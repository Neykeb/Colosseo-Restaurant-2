import { randomBytes, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { buildTableCandidates, canTransitionReservationStatus, lockSlotStarts, parseDate, timeToMinutes, type ReservationRules, type ReservationStatus } from "../domain/reservation-domain";
import { AuditEventModel, EventInquiryModel, ReservationBlockModel, ReservationLockModel, ReservationModel, SettingModel, SpecialDayModel, TableAssignmentModel, TableModel } from "../models/core";
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
  async getCalendarOverview(startDate: string, endDate: string) {
    const dateRange = { $gte: startDate, $lte: endDate };
    const [reservations, inquiries, blocks, specialDays] = await Promise.all([
      ReservationModel.find({ date: dateRange })
        .sort({ date: 1, startTime: 1 })
        .select({ cancellationTokenHash: 0, idempotencyKey: 0, internalNote: 0 })
        .lean()
        .exec(),
      EventInquiryModel.find({ requestedDate: dateRange })
        .sort({ requestedDate: 1, createdAt: -1 })
        .select({ internalNote: 0 })
        .lean()
        .exec(),
      ReservationBlockModel.find({ date: dateRange, active: true })
        .sort({ date: 1, startTime: 1 })
        .select({ _id: 0, __v: 0 })
        .lean()
        .exec(),
      SpecialDayModel.find({ date: dateRange }).sort({ date: 1 }).lean().exec(),
    ]);

    return { startDate, endDate, reservations, inquiries, blocks, specialDays };
  }

  async listReservations(filters: { date?: string; status?: ReservationStatus; q?: string; page?: number; pageSize?: number }) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 25));
    const query: Record<string, unknown> = {};
    if (filters.date) query.date = filters.date;
    if (filters.status) query.status = filters.status;
    if (filters.q) {
      const escaped = filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [{ publicId: { $regex: escaped, $options: "i" } }, { "guest.name": { $regex: escaped, $options: "i" } }, { "guest.email": { $regex: escaped, $options: "i" } }, { "guest.phone": { $regex: escaped, $options: "i" } }];
    }
    const [reservations, total] = await Promise.all([
      ReservationModel.find(query).sort({ date: 1, startTime: 1 }).skip((page - 1) * pageSize).limit(pageSize).select({ cancellationTokenHash: 0, idempotencyKey: 0 }).lean().exec(),
      ReservationModel.countDocuments(query).exec(),
    ]);
    return { reservations, total, page, pageSize, pageCount: Math.ceil(total / pageSize) };
  }

  async getReservation(publicId: string) {
    const [reservation, assignments] = await Promise.all([
      ReservationModel.findOne({ publicId }).select({ cancellationTokenHash: 0, idempotencyKey: 0 }).lean().exec(),
      TableAssignmentModel.find({ reservationPublicId: publicId }).sort({ tableKey: 1 }).select({ _id: 0, tableKey: 1 }).lean().exec(),
    ]);
    return reservation ? { ...reservation, tableKeys: assignments.map(({ tableKey }) => tableKey) } : null;
  }

  async updateStatus(publicId: string, status: ReservationStatus, actorId: string) {
    const session = await mongoose.startSession();
    try {
      let updated: unknown = null;
      await session.withTransaction(async () => {
        const current = await ReservationModel.findOne({ publicId }).select({ status: 1 }).session(session).lean().exec();
        if (!current) return;
        if (!canTransitionReservationStatus(current.status as ReservationStatus, status)) throw new Error("INVALID_STATUS_TRANSITION");
        const reservation = await ReservationModel.findOneAndUpdate({ publicId, status: current.status }, { $set: { status } }, { returnDocument: "after", session }).select({ cancellationTokenHash: 0, idempotencyKey: 0 }).lean().exec();
        if (!reservation) throw new Error("STATUS_UPDATE_CONFLICT");
        if (status === "cancelled" || status === "declined") {
          await ReservationLockModel.deleteMany({ reservationPublicId: publicId }, { session });
          await TableAssignmentModel.deleteMany({ reservationPublicId: publicId }, { session });
        }
        await AuditEventModel.create([{ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "reservation.status_changed", target: publicId, metadata: { from: current.status, status } }], { session });
        updated = reservation;
      });
      return updated;
    } finally {
      await session.endSession();
    }
  }

  async reservationHistory(publicId: string) {
    return AuditEventModel.find({ target: publicId, action: { $regex: /^reservation\./ } }).sort({ createdAt: -1 }).lean().exec();
  }

  async listTables() {
    const tables = await TableModel.find({ active: true }).sort({ areaKey: 1, key: 1 }).select({ _id: 0, key: 1, name: 1, areaKey: 1, minPartySize: 1, maxPartySize: 1, combinationGroupKey: 1 }).lean().exec();
    return tables.map(({ key, name, areaKey, minPartySize, maxPartySize, combinationGroupKey }) => ({ key, name, areaKey, minPartySize, maxPartySize, combinationGroupKey: combinationGroupKey ?? null }));
  }

  async reassignTables(publicId: string, tableKeys: string[], actorId: string): Promise<{ tableKeys: string[] } | null> {
    const session = await mongoose.startSession();
    try {
      let result: { tableKeys: string[] } | null = null;
      await session.withTransaction(async () => {
        const [reservation, setting, tables] = await Promise.all([
          ReservationModel.findOne({ publicId }).session(session).lean().exec(),
          SettingModel.findOne({ key: "reservation.rules" }).session(session).lean().exec(),
          TableModel.find({ active: true }).session(session).lean().exec(),
        ]);
        if (!reservation) return;
        if (!setting) throw new Error("RESERVATION_RULES_NOT_CONFIGURED");
        if (["cancelled", "declined", "completed", "no_show"].includes(reservation.status)) throw new Error("RESERVATION_NOT_ASSIGNABLE");
        const normalized = [...new Set(tableKeys)].sort();
        const candidates = buildTableCandidates(tables.map(({ key, minPartySize, maxPartySize, combinationGroupKey, active }) => ({ key, minPartySize, maxPartySize, combinationGroupKey: combinationGroupKey ?? null, active })), reservation.partySize);
        if (!candidates.some((candidate) => candidate.tableKeys.length === normalized.length && candidate.tableKeys.every((key, index) => key === normalized[index]))) throw new Error("INVALID_TABLE_COMBINATION");
        const rules = setting.value as ReservationRules;
        const slots = lockSlotStarts(reservation.startTime, rules);
        await ReservationLockModel.deleteMany({ reservationPublicId: publicId }, { session });
        await TableAssignmentModel.deleteMany({ reservationPublicId: publicId }, { session });
        await ReservationLockModel.insertMany(normalized.flatMap((tableKey) => slots.map((slotStart) => ({ reservationPublicId: publicId, date: reservation.date, tableKey, slotStart }))), { session, ordered: true });
        await TableAssignmentModel.insertMany(normalized.map((tableKey) => ({ reservationPublicId: publicId, tableKey, date: reservation.date, startTime: reservation.startTime, endTime: reservation.endTime })), { session, ordered: true });
        await AuditEventModel.create([{ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "reservation.tables_changed", target: publicId, metadata: { tableKeys: normalized } }], { session });
        result = { tableKeys: normalized };
      });
      return result;
    } catch (error) {
      if (duplicateKey(error)) throw new ReservationLockConflictError();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async listSpecialDays() { return SpecialDayModel.find().sort({ date: 1 }).lean().exec(); }

  async saveSpecialDay(input: { date: string; label: string; closed: boolean; opens?: string; closes?: string }, actorId: string) {
    const day = await SpecialDayModel.findOneAndUpdate({ date: input.date }, { $set: { ...input, opens: input.closed ? undefined : input.opens, closes: input.closed ? undefined : input.closes } }, { upsert: true, returnDocument: "after", runValidators: true }).lean().exec();
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "special_day.saved", target: input.date, metadata: { closed: input.closed } });
    return day;
  }

  async deleteSpecialDay(date: string, actorId: string) {
    const day = await SpecialDayModel.findOneAndDelete({ date }).lean().exec();
    if (day) await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "special_day.deleted", target: date, metadata: {} });
    return day;
  }

  async listEventInquiries() { return EventInquiryModel.find().sort({ requestedDate: 1, createdAt: -1 }).lean().exec(); }
  async getEventInquiry(inquiryId: string) { return EventInquiryModel.findOne({ inquiryId }).lean().exec(); }
  async createEventInquiry(input: { name: string; email: string; phone?: string; eventType: string; requestedDate: string; partySize: number; message: string }) { return EventInquiryModel.create({ ...input, inquiryId: `inq_${randomUUID().replaceAll("-", "")}`, status: "new" }); }
  async updateEventInquiryStatus(inquiryId: string, status: "new" | "in_review" | "accepted" | "declined" | "closed", actorId: string) {
    const inquiry = await EventInquiryModel.findOneAndUpdate({ inquiryId }, { $set: { status } }, { returnDocument: "after", runValidators: true }).lean().exec();
    if (inquiry) await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "event_inquiry.status_changed", target: inquiryId, metadata: { status } });
    return inquiry;
  }
  async updateEventInquiryNote(inquiryId: string, internalNote: string, actorId: string) {
    const inquiry = await EventInquiryModel.findOneAndUpdate({ inquiryId }, { $set: { internalNote } }, { returnDocument: "after", runValidators: true }).lean().exec();
    if (inquiry) await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "event_inquiry.note_changed", target: inquiryId, metadata: {} });
    return inquiry;
  }

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
