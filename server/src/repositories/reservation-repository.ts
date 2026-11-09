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
