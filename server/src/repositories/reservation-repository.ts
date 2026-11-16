import mongoose, { type ClientSession } from "mongoose";
import { AreaModel, OutboxEventModel, ReservationLockModel, ReservationModel, ServicePeriodModel, SettingModel, TableAssignmentModel, TableModel, type Reservation } from "../models/core";
import type { ReservationRules, ReservableTable, ServicePeriod } from "../domain/reservation-domain";

export interface ReservationConfiguration {
  rules: ReservationRules;
  servicePeriods: ServicePeriod[];
  tables: ReservableTable[];
  areas: Array<{ key: string; name: string; active: boolean }>;
}

export interface ConfirmedReservationInput {
  publicId: string;
  idempotencyKey: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
  locale: "de" | "en" | "it";
  guest: { name: string; email?: string; phone?: string };
  privacyAcknowledged: true;
  tableKeys: string[];
  slotStarts: string[];
}

export class ReservationLockConflictError extends Error {
  constructor() {
    super("The selected tables were reserved by another request.");
    this.name = "ReservationLockConflictError";
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return (error as { code?: number }).code === 11_000;
}

export class ReservationRepository {
  findByPublicId(publicId: string) {
    return ReservationModel.findOne({ publicId }).lean().exec();
  }

  findByIdempotencyKey(idempotencyKey: string) {
    return ReservationModel.findOne({ idempotencyKey }).lean().exec();
  }

  create(input: Reservation) {
    return ReservationModel.create(input);
  }

  findByCancellationToken(publicId: string, cancellationTokenHash: string) {
    return ReservationModel.findOne({ publicId, cancellationTokenHash }).lean().exec();
  }

  async cancelByGuest(publicId: string, cancellationTokenHash: string) {
    const session = await mongoose.startSession();
    try {
      let cancelled: unknown;
      await session.withTransaction(async () => {
        const reservation = await ReservationModel.findOneAndUpdate(
          { publicId, cancellationTokenHash, status: { $in: ["pending", "confirmed"] } },
          { $set: { status: "cancelled" } },
          { returnDocument: "after", session },
        );
        if (!reservation) throw new Error("RESERVATION_NOT_CANCELLABLE");
        await ReservationLockModel.deleteMany({ reservationPublicId: publicId }, { session });
        await TableAssignmentModel.deleteMany({ reservationPublicId: publicId }, { session });
        await OutboxEventModel.insertMany([
          { eventId: `reservation-cancelled-guest-${publicId}`, type: "reservation.cancelled.guest", aggregateId: publicId, payload: { version: 1, locale: reservation.locale }, status: "pending", attempts: 0, nextAttemptAt: new Date() },
          { eventId: `reservation-cancelled-restaurant-${publicId}`, type: "reservation.cancelled.restaurant", aggregateId: publicId, payload: { version: 1, locale: reservation.locale }, status: "pending", attempts: 0, nextAttemptAt: new Date() },
        ], { session });
        cancelled = reservation;
      });
      return cancelled;
    } finally {
      await session.endSession();
    }
  }

  async createWithTableAssignment(input: Reservation, tableKeys: readonly string[], slotIntervalMinutes = 30, occupancyEndTime = input.endTime) {
    const session = await mongoose.startSession();
    try {
      let created: unknown;
      await session.withTransaction(async () => {
        const slotStarts: string[] = [];
        const startMinutes = Number(input.startTime.slice(0, 2)) * 60 + Number(input.startTime.slice(3));
        const endMinutes = Number(occupancyEndTime.slice(0, 2)) * 60 + Number(occupancyEndTime.slice(3));
        for (let minute = startMinutes; minute < endMinutes; minute += slotIntervalMinutes) {
          slotStarts.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
        }
        await ReservationLockModel.insertMany(tableKeys.flatMap((tableKey) => slotStarts.map((slotStart) => ({ reservationPublicId: input.publicId, date: input.date, tableKey, slotStart }))), { session });
        const [reservation] = await ReservationModel.create([input], { session });
        await TableAssignmentModel.insertMany(tableKeys.map((tableKey) => ({ reservationPublicId: input.publicId, tableKey, date: input.date, startTime: input.startTime, endTime: occupancyEndTime })), { session });
        await OutboxEventModel.insertMany([
          { eventId: `reservation-created-guest-${input.publicId}`, type: "reservation.created.guest", aggregateId: input.publicId, payload: { version: 1, locale: input.locale }, status: "pending", attempts: 0, nextAttemptAt: new Date() },
          { eventId: `reservation-created-restaurant-${input.publicId}`, type: "reservation.created.restaurant", aggregateId: input.publicId, payload: { version: 1, locale: input.locale }, status: "pending", attempts: 0, nextAttemptAt: new Date() },
        ], { session });
        created = reservation;
      });
      return created;
    } catch (error) {
      if (isDuplicateKeyError(error)) throw new Error("TABLE_NOT_AVAILABLE");
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async loadConfiguration(): Promise<ReservationConfiguration> {
    const [setting, servicePeriods, tables, areas] = await Promise.all([
      SettingModel.findOne({ key: "reservation.rules" }).lean().exec(),
      ServicePeriodModel.find({ active: true }).sort({ weekday: 1, startTime: 1 }).lean().exec(),
      TableModel.find({ active: true }).sort({ key: 1 }).lean().exec(),
      AreaModel.find({ active: true }).sort({ key: 1 }).lean().exec(),
    ]);
    if (!setting) throw new Error("Reservation rules are not configured.");
    return {
      rules: setting.value as ReservationRules,
      servicePeriods: servicePeriods.map(({ key, weekday, startTime, endTime, active }) => ({ key, weekday, startTime, endTime, active })),
      tables: tables.map(({ key, minPartySize, maxPartySize, combinationGroupKey, active }) => ({ key, minPartySize, maxPartySize, combinationGroupKey: combinationGroupKey ?? null, active })),
      areas: areas.map(({ key, name, active }) => ({ key, name, active })),
    };
  }

  async findOccupiedTableKeys(date: string, slotStarts: string[], session?: ClientSession): Promise<Set<string>> {
    const query = ReservationLockModel.find({ date, slotStart: { $in: slotStarts } }).distinct("tableKey");
    if (session) query.session(session);
    return new Set(await query.exec());
  }

  async createConfirmed(input: ConfirmedReservationInput): Promise<{ publicId: string; status: "confirmed"; tableKeys: string[]; reused: boolean }> {
    const existing = await this.findByIdempotencyKey(input.idempotencyKey);
    if (existing) return { publicId: existing.publicId, status: "confirmed", tableKeys: input.tableKeys, reused: true };
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await ReservationLockModel.insertMany(input.tableKeys.flatMap((tableKey) => input.slotStarts.map((slotStart) => ({ reservationPublicId: input.publicId, date: input.date, tableKey, slotStart }))), { session, ordered: true });
        await ReservationModel.create([{ publicId: input.publicId, idempotencyKey: input.idempotencyKey, date: input.date, startTime: input.startTime, endTime: input.endTime, partySize: input.partySize, locale: input.locale, status: "confirmed", guest: input.guest, privacyAcknowledgedAt: new Date() }], { session });
        await TableAssignmentModel.insertMany(input.tableKeys.map((tableKey) => ({ reservationPublicId: input.publicId, tableKey, date: input.date, startTime: input.startTime, endTime: input.endTime })), { session, ordered: true });
        const events = [{
          eventId: `reservation.confirmed.restaurant/${input.publicId}`,
          type: "reservation.confirmed.restaurant",
          aggregateId: input.publicId,
          payload: { reservationPublicId: input.publicId, recipient: "restaurant" },
          status: "pending",
          attempts: 0,
          nextAttemptAt: new Date(),
        }];
        if (input.guest.email) events.push({
          eventId: `reservation.confirmed.guest/${input.publicId}`,
          type: "reservation.confirmed.guest",
          aggregateId: input.publicId,
          payload: { reservationPublicId: input.publicId, recipient: "guest" },
          status: "pending",
          attempts: 0,
          nextAttemptAt: new Date(),
        });
        await OutboxEventModel.insertMany(events, { session, ordered: true });
      });
      return { publicId: input.publicId, status: "confirmed", tableKeys: input.tableKeys, reused: false };
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        const idempotent = await this.findByIdempotencyKey(input.idempotencyKey);
        if (idempotent) return { publicId: idempotent.publicId, status: "confirmed", tableKeys: input.tableKeys, reused: true };
        throw new ReservationLockConflictError();
      }
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
