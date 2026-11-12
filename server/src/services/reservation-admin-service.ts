import { randomBytes, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { canTransitionEventInquiryStatus, canTransitionReservationStatus, lockSlotStarts, parseDate, timeToMinutes, type EventInquiryStatus, type ReservationRules, type ReservationStatus } from "../domain/reservation-domain";
import { AuditEventModel, EventInquiryModel, MenuCategoryModel, MenuItemModel, ReservationBlockModel, ReservationLockModel, ReservationModel, ServicePeriodModel, SettingModel, SpecialDayModel, TableModel } from "../models/core";
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
    return ReservationModel.findOne({ publicId }).select({ cancellationTokenHash: 0, idempotencyKey: 0 }).lean().exec();
  }

  async updateStatus(publicId: string, status: ReservationStatus, actorId: string) {
    const current = await ReservationModel.findOne({ publicId }).select({ status: 1 }).lean().exec();
    if (!current) return null;
    if (!canTransitionReservationStatus(current.status as ReservationStatus, status)) throw new Error("INVALID_STATUS_TRANSITION");
    const reservation = await ReservationModel.findOneAndUpdate({ publicId, status: current.status }, { $set: { status } }, { returnDocument: "after" }).select({ cancellationTokenHash: 0, idempotencyKey: 0 }).lean().exec();
    if (!reservation) throw new Error("STATUS_UPDATE_CONFLICT");
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "reservation.status_changed", target: publicId, metadata: { status } });
    return reservation;
  }

  async reservationHistory(publicId: string) {
    return AuditEventModel.find({ target: publicId, action: { $regex: /^reservation\./ } }).sort({ createdAt: -1 }).lean().exec();
  }

  async listOpeningHours() { return ServicePeriodModel.find().sort({ weekday: 1, startTime: 1, key: 1 }).select({ _id: 0, key: 1, weekday: 1, startTime: 1, endTime: 1, active: 1 }).lean().exec(); }
  async saveOpeningHour(input: { key: string; weekday: number; startTime: string; endTime: string; active: boolean }, actorId: string) {
    const period = await ServicePeriodModel.findOneAndUpdate({ key: input.key }, { $set: input }, { upsert: true, returnDocument: "after", runValidators: true }).lean().exec();
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "opening_hour.saved", target: input.key, metadata: { weekday: input.weekday, active: input.active } });
    return period;
  }
  async deleteOpeningHour(key: string, actorId: string) {
    const period = await ServicePeriodModel.findOneAndDelete({ key }).lean().exec();
    if (period) await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "opening_hour.deleted", target: key, metadata: {} });
    return period;
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
  async updateEventInquiryStatus(inquiryId: string, status: EventInquiryStatus, actorId: string) {
    const current = await EventInquiryModel.findOne({ inquiryId }).select({ status: 1 }).lean().exec();
    if (!current) return null;
    if (!canTransitionEventInquiryStatus(current.status as EventInquiryStatus, status)) throw new Error("INVALID_EVENT_INQUIRY_TRANSITION");
    const inquiry = await EventInquiryModel.findOneAndUpdate({ inquiryId, status: current.status }, { $set: { status } }, { returnDocument: "after", runValidators: true }).lean().exec();
    if (!inquiry) throw new Error("EVENT_INQUIRY_UPDATE_CONFLICT");
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "event_inquiry.status_changed", target: inquiryId, metadata: { status } });
    return inquiry;
  }
  async updateEventInquiryNote(inquiryId: string, internalNote: string, actorId: string) {
    const inquiry = await EventInquiryModel.findOneAndUpdate({ inquiryId }, { $set: { internalNote } }, { returnDocument: "after", runValidators: true }).lean().exec();
    if (inquiry) await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "event_inquiry.note_changed", target: inquiryId, metadata: {} });
    return inquiry;
  }

  async listMenuCategories() { return MenuCategoryModel.find().sort({ sortOrder: 1, slug: 1 }).lean().exec(); }
  async listMenuItems() { return MenuItemModel.find().sort({ categorySlug: 1, sortOrder: 1, itemId: 1 }).lean().exec(); }
  async getPublishedMenu() {
    const [categories, items] = await Promise.all([
      MenuCategoryModel.find({ active: true }).sort({ sortOrder: 1, slug: 1 }).select({ _id: 0, slug: 1, name: 1, sortOrder: 1 }).lean().exec(),
      MenuItemModel.find({ active: true, published: true }).sort({ categorySlug: 1, sortOrder: 1, itemId: 1 }).select({ _id: 0, itemId: 1, categorySlug: 1, name: 1, description: 1, priceCents: 1, allergens: 1, imageUrl: 1, sortOrder: 1 }).lean().exec(),
    ]);
    return categories.map((category) => ({ ...category, items: items.filter((item) => item.categorySlug === category.slug) }));
  }
  async getMenuPreview() {
    const [categories, items] = await Promise.all([
      MenuCategoryModel.find({ active: true }).sort({ sortOrder: 1, slug: 1 }).select({ _id: 0, slug: 1, name: 1, sortOrder: 1, active: 1 }).lean().exec(),
      MenuItemModel.find({ active: true }).sort({ categorySlug: 1, sortOrder: 1, itemId: 1 }).select({ _id: 0, itemId: 1, categorySlug: 1, name: 1, description: 1, priceCents: 1, allergens: 1, imageUrl: 1, sortOrder: 1, active: 1, published: 1 }).lean().exec(),
    ]);
    return categories.map((category) => ({ ...category, items: items.filter((item) => item.categorySlug === category.slug) }));
  }
  async getPublicOpeningHours() {
    const [regular, specialDays] = await Promise.all([
      ServicePeriodModel.find({ active: true }).sort({ weekday: 1, startTime: 1 }).select({ _id: 0, weekday: 1, startTime: 1, endTime: 1 }).lean().exec(),
      SpecialDayModel.find().sort({ date: 1 }).select({ _id: 0, date: 1, label: 1, closed: 1, opens: 1, closes: 1 }).lean().exec(),
    ]);
    return { regular, specialDays };
  }
  async saveMenuCategory(input: { slug: string; name: string; sortOrder: number; active: boolean }, actorId: string) {
    const category = await MenuCategoryModel.findOneAndUpdate({ slug: input.slug }, { $set: input }, { upsert: true, returnDocument: "after", runValidators: true }).lean().exec();
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "menu_category.saved", target: input.slug, metadata: { active: input.active } });
    return category;
  }
  async saveMenuItem(input: { itemId: string; categorySlug: string; name: string; description?: string; priceCents: number; allergens: string[]; imageUrl?: string; sortOrder: number; active: boolean; published: boolean }, actorId: string) {
    const item = await MenuItemModel.findOneAndUpdate({ itemId: input.itemId }, { $set: input }, { upsert: true, returnDocument: "after", runValidators: true }).lean().exec();
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "menu_item.saved", target: input.itemId, metadata: { categorySlug: input.categorySlug, active: input.active, published: input.published } });
    return item;
  }
  async publishMenuItem(itemId: string, published: boolean, actorId: string) {
    const item = await MenuItemModel.findOneAndUpdate({ itemId, active: true }, { $set: { published } }, { returnDocument: "after", runValidators: true }).lean().exec();
    if (!item) return null;
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: published ? "menu_item.published" : "menu_item.unpublished", target: itemId, metadata: { categorySlug: item.categorySlug } });
    return item;
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
