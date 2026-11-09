import mongoose from "mongoose";
import { OutboxEventModel, ReservationLockModel, ReservationModel, TableAssignmentModel, type Reservation } from "../models/core";
import { minutesSinceMidnight } from "../domain/reservation-domain";

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

  async createWithTableAssignment(input: Reservation, tableKeys: readonly string[], slotIntervalMinutes = 30, occupancyEndTime = input.endTime) {
    const session = await mongoose.startSession();
    try {
      let created: unknown;
      await session.withTransaction(async () => {
        const slotStarts: string[] = [];
        for (let minute = minutesSinceMidnight(input.startTime); minute < minutesSinceMidnight(occupancyEndTime); minute += slotIntervalMinutes) {
          slotStarts.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
        }
        const locks = tableKeys.flatMap((tableKey) => slotStarts.map((slotStart) => ({ reservationPublicId: input.publicId, date: input.date, tableKey, slotStart })));
        await ReservationLockModel.insertMany(locks, { session });
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
      if (typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000) throw new Error("TABLE_NOT_AVAILABLE");
      throw error;
    } finally {
      await session.endSession();
    }
  }
}
