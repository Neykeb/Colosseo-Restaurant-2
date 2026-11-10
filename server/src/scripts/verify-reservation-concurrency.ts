import { randomUUID } from "node:crypto";
import { connectToDatabase, disconnectFromDatabase } from "../config/database";
import { assertSafeTestDatabaseTarget } from "../config/database-target";
import { getServerEnv } from "../config/env";
import { OutboxEventModel, ReservationBlockModel, ReservationLockModel, ReservationModel, ServiceHoursModel, SettingModel, TableAssignmentModel, TableModel } from "../models/core";
import { BookingError, BookingService } from "../services/booking-service";

const suffix = randomUUID().replaceAll("-", "");
const tableKey = `concurrency-${suffix}`;
const serviceKey = `concurrency-${suffix}`;
const reservationIds: string[] = [];

const env = getServerEnv();
assertSafeTestDatabaseTarget(env);
await connectToDatabase();
const existingRules = await SettingModel.findOne({ key: "reservation.rules" }).lean().exec();

try {
  await SettingModel.updateOne({ key: "reservation.rules" }, { $set: { key: "reservation.rules", value: { marker: "PLATZHALTER", timezone: "Europe/Berlin", bookingHorizonDays: 30, leadTimeMinutes: 0, defaultDurationMinutes: 60, bufferMinutes: 0, slotIntervalMinutes: 30, partySizeMin: 1, partySizeMax: 2, confirmationMode: "confirmed" } } }, { upsert: true });
  await TableModel.create({ key: tableKey, name: "Concurrency test table", areaKey: "test", minPartySize: 1, maxPartySize: 2, combinationGroupKey: null, active: true });
  await ServiceHoursModel.create({ key: serviceKey, weekday: 2, startTime: "17:00", endTime: "20:00", active: true });

  const service = new BookingService();
  const now = new Date();
  const daysUntilTuesday = ((2 - now.getUTCDay() + 7) % 7) || 7;
  const testDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysUntilTuesday)).toISOString().slice(0, 10);
  const common = { date: testDate, startTime: "17:00", partySize: 2, guest: { name: "Concurrency Test", email: "test@example.invalid" }, locale: "de" as const, source: "public" as const };
  const results = await Promise.allSettled([
    service.create({ ...common, idempotencyKey: `concurrency-a-${suffix}` }, now),
    service.create({ ...common, idempotencyKey: `concurrency-b-${suffix}` }, now),
  ]);
  const winner = results.find((result): result is PromiseFulfilledResult<{ publicId: string; cancellationToken: string }> => result.status === "fulfilled");
  for (const result of results) if (result.status === "fulfilled") reservationIds.push(String((result.value as { publicId: string }).publicId));
  const rejected = results.filter((result): result is PromiseRejectedResult => result.status === "rejected");
  if (reservationIds.length !== 1 || rejected.length !== 1 || !(rejected[0].reason instanceof BookingError) || rejected[0].reason.code !== "NO_AVAILABILITY") {
    throw new Error(`Expected one confirmed reservation and one NO_AVAILABILITY result, received ${JSON.stringify(results.map((result) => result.status))}`);
  }
  console.log("Concurrency verification passed: one reservation won the final table and one was rejected.");
  if (!winner?.value.cancellationToken) throw new Error("Winning public reservation did not return a cancellation token");
  const cancelled = await service.cancelByGuest(winner.value.publicId, winner.value.cancellationToken, now) as { status?: string };
  if (cancelled.status !== "cancelled") throw new Error("Guest cancellation did not set the cancelled status");
  const remainingLocks = await ReservationLockModel.countDocuments({ reservationPublicId: winner.value.publicId });
  if (remainingLocks !== 0) throw new Error("Guest cancellation did not release reservation locks");
  console.log("Guest cancellation verification passed: token accepted and table locks released.");
} finally {
  await ReservationLockModel.deleteMany({ tableKey });
  await TableAssignmentModel.deleteMany({ tableKey });
  await ReservationModel.deleteMany({ idempotencyKey: { $in: [`concurrency-a-${suffix}`, `concurrency-b-${suffix}`] } });
  await OutboxEventModel.deleteMany({ aggregateId: { $in: reservationIds } });
  await ReservationBlockModel.deleteMany({ createdBy: `concurrency-${suffix}` });
  await TableModel.deleteOne({ key: tableKey });
  await ServiceHoursModel.deleteOne({ key: serviceKey });
  if (existingRules) await SettingModel.replaceOne({ key: "reservation.rules" }, existingRules);
  else await SettingModel.deleteOne({ key: "reservation.rules" });
  await disconnectFromDatabase();
}
