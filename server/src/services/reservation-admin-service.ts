import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { lockSlotStarts, parseDate, timeToMinutes, type ReservationRules } from "../domain/reservation-domain";
import { ReservationBlockModel, ReservationLockModel, SettingModel, TableModel } from "../models/core";
import { ReservationLockConflictError } from "../repositories/reservation-repository";

export interface ReservationBlockInput {
  date: string;
  startTime: string;
  endTime: string;
  scope: "restaurant" | "area" | "table";
  scopeKey?: string;
  reason: string;
  createdBy: string;
}

function duplicateKey(error: unknown): boolean {
  return (error as { code?: number }).code === 11_000;
}

export class ReservationAdminService {
  async listBlocks(date?: string) {
    return ReservationBlockModel.find(date ? { date } : {}).sort({ date: 1, startTime: 1 }).select({ _id: 0, __v: 0 }).lean().exec();
  }

  async createBlock(input: ReservationBlockInput) {
    if (!parseDate(input.date)) throw new Error("The block date is invalid.");
    const start = timeToMinutes(input.startTime);
    const end = timeToMinutes(input.endTime);
    if (start === null || end === null || start >= end) throw new Error("The block time range is invalid.");
    const [setting, tables] = await Promise.all([
      SettingModel.findOne({ key: "reservation.rules" }).lean().exec(),
      TableModel.find({ active: true }).lean().exec(),
    ]);
    if (!setting) throw new Error("Reservation rules are not configured.");
    const rules = setting.value as ReservationRules;
    const selected = tables.filter((table) => input.scope === "restaurant" || (input.scope === "area" ? table.areaKey === input.scopeKey : table.key === input.scopeKey));
    if (selected.length === 0) throw new Error("The requested block scope does not match an active table.");
    const durationRules = { ...rules, defaultDurationMinutes: end - start, bufferMinutes: 0 };
    const slots = lockSlotStarts(input.startTime, durationRules);
    const blockId = `BLK-${randomBytes(5).toString("hex").toUpperCase()}`;
    const lockId = `BLOCK-${blockId}`;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await ReservationLockModel.insertMany(selected.flatMap(({ key }) => slots.map((slotStart) => ({ reservationPublicId: lockId, date: input.date, tableKey: key, slotStart }))), { session, ordered: true });
        await ReservationBlockModel.create([{ blockId, ...input, scopeKey: input.scopeKey ?? null }], { session });
      });
      return { blockId, date: input.date, startTime: input.startTime, endTime: input.endTime, scope: input.scope, scopeKey: input.scopeKey ?? null, tableCount: selected.length };
    } catch (error) {
      if (duplicateKey(error)) throw new ReservationLockConflictError();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async deleteBlock(blockId: string): Promise<boolean> {
    const session = await mongoose.startSession();
    let deleted = false;
    try {
      await session.withTransaction(async () => {
        const result = await ReservationBlockModel.deleteOne({ blockId }, { session });
        deleted = result.deletedCount === 1;
        if (deleted) await ReservationLockModel.deleteMany({ reservationPublicId: `BLOCK-${blockId}` }, { session });
      });
      return deleted;
    } finally {
      await session.endSession();
    }
  }
}
