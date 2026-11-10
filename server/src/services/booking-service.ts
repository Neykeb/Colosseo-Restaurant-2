import { createHash, randomBytes, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import {
  ReservationBlockModel,
  AuditEventModel,
  ReservationModel,
  ServiceHoursModel,
  SettingModel,
  TableAssignmentModel,
  TableModel,
  ReservationLockModel,
  SpecialDayModel,
  type Reservation,
} from "../models/core";
import { assertReservationTransition, isWithinServiceWindow, minutesSinceMidnight, type ReservationStatus } from "../domain/reservation-domain";
import { ReservationRepository } from "../repositories/reservation-repository";

export type BookingRules = {
  marker?: string;
  timezone: string;
  bookingHorizonDays: number;
  leadTimeMinutes: number;
  defaultDurationMinutes: number;
  partySizeMin: number;
  partySizeMax: number;
  confirmationMode: "pending" | "confirmed";
  slotIntervalMinutes?: number;
  bufferMinutes?: number;
};

export type ReservationInput = {
  date: string;
  startTime: string;
  partySize: number;
  guest: { name: string; email?: string; phone?: string };
  locale: "de" | "en" | "it";
  idempotencyKey: string;
  source: "public" | "admin";
  internalNote?: string;
};

export class BookingError extends Error {
  constructor(public readonly code: string, public readonly statusCode: number, message: string) {
    super(message);
  }
}

export class BookingService {
  constructor(private readonly reservations = new ReservationRepository()) {}

  async getRules(): Promise<BookingRules> {
    const setting = await SettingModel.findOne({ key: "reservation.rules" }).lean().exec();
    if (!setting?.value) throw new BookingError("BOOKING_NOT_CONFIGURED", 503, "Booking is not configured.");
    return setting.value as BookingRules;
  }

  async publicConfig() {
    const rules = await this.getRules();
    return {
      timezone: rules.timezone,
      bookingHorizonDays: rules.bookingHorizonDays,
      leadTimeMinutes: rules.leadTimeMinutes,
      defaultDurationMinutes: rules.defaultDurationMinutes,
      partySize: { min: rules.partySizeMin, max: rules.partySizeMax },
      locales: ["de", "en", "it"],
      provisional: rules.marker === "PLATZHALTER",
    };
  }

  private async serviceWindows(date: string) {
    const specialDay = await SpecialDayModel.findOne({ date }).lean().exec();
    if (specialDay) {
      if (specialDay.closed || !specialDay.opens || !specialDay.closes) return [];
      return [{ startTime: specialDay.opens, endTime: specialDay.closes }];
    }
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    return ServiceHoursModel.find({ weekday, active: true }).sort({ startTime: 1 }).lean().exec();
  }

  async availability(date: string, partySize: number, now = new Date()): Promise<string[]> {
    const rules = await this.getRules();
    validateBookingDate(date, rules, now);
    if (partySize < rules.partySizeMin || partySize > rules.partySizeMax) return [];
    const services = await this.serviceWindows(date);
    if (services.length === 0) return [];
    const interval = rules.slotIntervalMinutes ?? 30;
    const slots: string[] = [];
    for (const service of services) {
      for (let start = minutesSinceMidnight(service.startTime); start + rules.defaultDurationMinutes + (rules.bufferMinutes ?? 0) <= minutesSinceMidnight(service.endTime); start += interval) {
        const startTime = formatMinutes(start);
        if (!meetsLeadTime(date, startTime, rules, now)) continue;
        const occupancyEndTime = formatMinutes(start + rules.defaultDurationMinutes + (rules.bufferMinutes ?? 0));
        if (await this.findAvailableTables(date, startTime, occupancyEndTime, partySize)) slots.push(startTime);
      }
    }
    return slots;
  }

  async create(input: ReservationInput, now = new Date()) {
    const existing = await this.reservations.findByIdempotencyKey(input.idempotencyKey);
    if (existing) return existing;
    const rules = await this.getRules();
    if (rules.marker === "PLATZHALTER" && process.env.NODE_ENV === "production") {
      throw new BookingError("BOOKING_NOT_RELEASED", 503, "Online booking has not been released for production.");
    }
    validateBookingDate(input.date, rules, now);
    if (input.partySize < rules.partySizeMin || input.partySize > rules.partySizeMax) {
      throw new BookingError("PARTY_SIZE_NOT_ALLOWED", 422, "The party size is not bookable.");
    }
    const endTime = formatMinutes(minutesSinceMidnight(input.startTime) + rules.defaultDurationMinutes);
    const occupancyEndTime = formatMinutes(minutesSinceMidnight(endTime) + (rules.bufferMinutes ?? 0));
    const services = await this.serviceWindows(input.date);
    if (!services.some((service) => isWithinServiceWindow(input.startTime, occupancyEndTime, { opens: service.startTime, closes: service.endTime }))) {
      throw new BookingError("OUTSIDE_SERVICE_WINDOW", 422, "The requested time is outside the service window.");
    }
    if (!meetsLeadTime(input.date, input.startTime, rules, now)) {
      throw new BookingError("LEAD_TIME_NOT_MET", 422, "The minimum lead time is not met.");
    }
    const tables = await this.findAvailableTables(input.date, input.startTime, occupancyEndTime, input.partySize);
    if (!tables) throw new BookingError("NO_AVAILABILITY", 409, "No availability remains for the requested time.");
    const cancellationToken = input.source === "public" ? randomBytes(32).toString("base64url") : undefined;
    const reservation = {
      publicId: `res_${randomUUID().replaceAll("-", "")}`,
      date: input.date,
      startTime: input.startTime,
      endTime,
      partySize: input.partySize,
      status: rules.confirmationMode,
      source: input.source,
      locale: input.locale,
      guest: input.guest,
      internalNote: input.internalNote,
      cancellationTokenHash: cancellationToken ? hashCancellationToken(cancellationToken) : undefined,
      idempotencyKey: input.idempotencyKey,
    } as Reservation;
    try {
      const created = await this.reservations.createWithTableAssignment(reservation, tables.map((table) => table.key), rules.slotIntervalMinutes ?? 30, occupancyEndTime);
      return cancellationToken ? { ...documentObject(created), cancellationToken } : created;
    } catch (error) {
      const concurrent = await this.reservations.findByIdempotencyKey(input.idempotencyKey);
      if (concurrent) return concurrent;
      if (error instanceof Error && error.message === "TABLE_NOT_AVAILABLE") {
        throw new BookingError("NO_AVAILABILITY", 409, "No availability remains for the requested time.");
      }
      throw error;
    }
  }

  async cancelByGuest(publicId: string, token: string, now = new Date()) {
    const tokenHash = hashCancellationToken(token);
    const reservation = await this.reservations.findByCancellationToken(publicId, tokenHash) as Reservation | null;
    if (!reservation) throw new BookingError("INVALID_CANCELLATION_TOKEN", 404, "The reservation could not be found.");
    if (!canCancelUntil(reservation.date, reservation.startTime, now, "Europe/Berlin", 120)) {
      throw new BookingError("CANCELLATION_DEADLINE_PASSED", 409, "Online cancellation closes two hours before the reservation.");
    }
    try {
      return await this.reservations.cancelByGuest(publicId, tokenHash);
    } catch (error) {
      if (error instanceof Error && error.message === "RESERVATION_NOT_CANCELLABLE") throw new BookingError("RESERVATION_NOT_CANCELLABLE", 409, "The reservation can no longer be cancelled.");
      throw error;
    }
  }

  async listReservations(filters: { date?: string; status?: ReservationStatus; q?: string; page?: number; pageSize?: number }) {
    const query: Record<string, unknown> = {};
    if (filters.date) query.date = filters.date;
    if (filters.status) query.status = filters.status;
    if (filters.q) {
      const escaped = filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const expression = new RegExp(escaped, "i");
      query.$or = [{ publicId: expression }, { "guest.name": expression }, { "guest.email": expression }, { "guest.phone": expression }];
    }
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 25;
    const [reservations, total] = await Promise.all([
      ReservationModel.find(query).sort({ date: 1, startTime: 1, publicId: 1 }).skip((page - 1) * pageSize).limit(pageSize).lean().exec(),
      ReservationModel.countDocuments(query).exec(),
    ]);
    return { reservations, total, page, pageSize, pageCount: Math.ceil(total / pageSize) };
  }

  async getReservation(publicId: string) {
    const reservation = await ReservationModel.findOne({ publicId }).lean().exec();
    if (!reservation) throw new BookingError("RESERVATION_NOT_FOUND", 404, "Reservation not found.");
    return reservation;
  }

  async updateStatus(publicId: string, status: ReservationStatus, actorId = "system") {
    const current = await ReservationModel.findOne({ publicId }).select({ status: 1 }).lean().exec();
    if (!current) throw new BookingError("RESERVATION_NOT_FOUND", 404, "Reservation not found.");
    try {
      assertReservationTransition(current.status as ReservationStatus, status);
    } catch {
      throw new BookingError("INVALID_STATUS_TRANSITION", 409, "The requested reservation status transition is not allowed.");
    }

    const reservation = await ReservationModel.findOneAndUpdate(
      { publicId, status: current.status },
      { $set: { status } },
      { returnDocument: "after" },
    ).lean().exec();
    if (!reservation) {
      throw new BookingError("STATUS_UPDATE_CONFLICT", 409, "The reservation was changed by another administrator. Reload and try again.");
    }
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "reservation.status_changed", target: publicId, metadata: { status } });
    return reservation;
  }

  async assignTables(publicId: string, tableKeys: string[], actorId = "system") {
    const session = await mongoose.startSession();
    try {
      let result: unknown;
      await session.withTransaction(async () => {
        const reservation = await ReservationModel.findOne({ publicId }).session(session).lean().exec();
        if (!reservation) throw new BookingError("RESERVATION_NOT_FOUND", 404, "Reservation not found.");
        const uniqueKeys = [...new Set(tableKeys)];
        const tables = await TableModel.find({ key: { $in: uniqueKeys }, active: true }).session(session).lean().exec();
        const capacity = tables.reduce((total, table) => total + table.maxPartySize, 0);
        if (tables.length !== uniqueKeys.length || capacity < reservation.partySize) {
          throw new BookingError("INVALID_TABLE_ASSIGNMENT", 422, "The selected tables are invalid or cannot accommodate the party.");
        }
        await ReservationLockModel.deleteMany({ reservationPublicId: publicId }, { session });
        await TableAssignmentModel.deleteMany({ reservationPublicId: publicId }, { session });
        const slotStarts: string[] = [];
        for (let minute = minutesSinceMidnight(reservation.startTime); minute < minutesSinceMidnight(reservation.endTime); minute += 30) {
          slotStarts.push(`${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`);
        }
        await ReservationLockModel.insertMany(uniqueKeys.flatMap((tableKey) => slotStarts.map((slotStart) => ({ reservationPublicId: publicId, date: reservation.date, tableKey, slotStart }))), { session });
        const assignments = await TableAssignmentModel.insertMany(uniqueKeys.map((tableKey) => ({ reservationPublicId: publicId, tableKey, date: reservation.date, startTime: reservation.startTime, endTime: reservation.endTime })), { session });
        await AuditEventModel.create([{ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "reservation.tables_assigned", target: publicId, metadata: { tableKeys: uniqueKeys } }], { session });
        result = assignments;
      });
      return result;
    } catch (error) {
      if (error instanceof BookingError) throw error;
      if (error instanceof Error && "code" in error && (error as { code?: number }).code === 11000) throw new BookingError("TABLE_ASSIGNMENT_CONFLICT", 409, "One of the selected tables is no longer available.");
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async reservationHistory(publicId: string) {
    const exists = await ReservationModel.exists({ publicId });
    if (!exists) throw new BookingError("RESERVATION_NOT_FOUND", 404, "Reservation not found.");
    return AuditEventModel.find({ target: publicId, action: { $regex: /^reservation\./ } }).sort({ createdAt: -1 }).lean().exec();
  }

  async listSpecialDays() {
    return SpecialDayModel.find().sort({ date: 1 }).lean().exec();
  }

  async saveSpecialDay(input: { date: string; label: string; closed: boolean; opens?: string; closes?: string }, actorId = "system") {
    if (!input.closed && (!input.opens || !input.closes || minutesSinceMidnight(input.closes) <= minutesSinceMidnight(input.opens))) {
      throw new BookingError("INVALID_SPECIAL_DAY_WINDOW", 422, "An open special day requires a valid opening window.");
    }
    const specialDay = await SpecialDayModel.findOneAndUpdate(
      { date: input.date },
      { $set: { ...input, opens: input.closed ? undefined : input.opens, closes: input.closed ? undefined : input.closes } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, runValidators: true },
    ).lean().exec();
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "special_day.saved", target: input.date, metadata: { closed: input.closed, opens: input.opens, closes: input.closes } });
    return specialDay;
  }

  async deleteSpecialDay(date: string, actorId = "system") {
    const specialDay = await SpecialDayModel.findOneAndDelete({ date }).lean().exec();
    if (!specialDay) throw new BookingError("SPECIAL_DAY_NOT_FOUND", 404, "Special day not found.");
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "special_day.deleted", target: date, metadata: {} });
    return specialDay;
  }

  async listBlocks(date?: string) {
    return ReservationBlockModel.find(date ? { date, active: true } : { active: true }).sort({ date: 1, startTime: 1 }).lean().exec();
  }

  async createBlock(input: { date: string; startTime: string; endTime: string; label: string; createdBy: string }) {
    if (minutesSinceMidnight(input.endTime) <= minutesSinceMidnight(input.startTime)) throw new BookingError("INVALID_TIME_WINDOW", 422, "The block must end after it starts.");
    const block = await ReservationBlockModel.create({ ...input, blockId: `blk_${randomUUID().replaceAll("-", "")}`, active: true });
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId: input.createdBy, action: "reservation_block.created", target: block.blockId, metadata: { date: input.date, startTime: input.startTime, endTime: input.endTime } });
    return block;
  }

  async deactivateBlock(publicId: string, actorId = "system") {
    const block = await ReservationBlockModel.findOneAndUpdate({ blockId: publicId, active: true }, { $set: { active: false } }, { returnDocument: "after" }).lean().exec();
    if (!block) throw new BookingError("BLOCK_NOT_FOUND", 404, "Reservation block not found.");
    await AuditEventModel.create({ eventId: `evt_${randomUUID().replaceAll("-", "")}`, actorId, action: "reservation_block.deactivated", target: publicId, metadata: {} });
    return block;
  }

  private async findAvailableTables(date: string, startTime: string, endTime: string, partySize: number) {
    const block = await ReservationBlockModel.exists({ date, active: true, startTime: { $lt: endTime }, endTime: { $gt: startTime } });
    if (block) return null;
    const [tables, assignments] = await Promise.all([
      TableModel.find({ active: true }).select({ key: 1, minPartySize: 1, maxPartySize: 1, combinationGroupKey: 1, active: 1 }).lean().exec(),
      TableAssignmentModel.find({ date, startTime: { $lt: endTime }, endTime: { $gt: startTime } }).select({ tableKey: 1 }).lean().exec(),
    ]);
    const occupied = new Set(assignments.map((assignment) => assignment.tableKey));
    const available = tables.filter((table) => !occupied.has(table.key));
    return selectTableAllocation(available, partySize);
  }
}

export function selectTableAllocation<T extends { key: string; minPartySize: number; maxPartySize: number; combinationGroupKey?: string | null }>(tables: readonly T[], partySize: number): readonly T[] | null {
  const single = tables
    .filter((table) => table.minPartySize <= partySize && table.maxPartySize >= partySize)
    .sort((first, second) => first.maxPartySize - second.maxPartySize || first.key.localeCompare(second.key))[0];
  if (single) return [single];
  const combinations = tables.flatMap((first, index) => tables.slice(index + 1).map((second) => [first, second] as const))
      .filter(([first, second]) => first.combinationGroupKey && first.combinationGroupKey === second.combinationGroupKey && first.maxPartySize + second.maxPartySize >= partySize)
      .sort((first, second) => (first[0].maxPartySize + first[1].maxPartySize) - (second[0].maxPartySize + second[1].maxPartySize) || first[0].key.localeCompare(second[0].key));
  return combinations[0] ?? null;
}

export function validateBookingDate(date: string, rules: BookingRules, now = new Date()): void {
  if (!isValidIsoDate(date)) throw new BookingError("INVALID_DATE", 422, "Date must use YYYY-MM-DD format.");
  const today = localDate(now, rules.timezone);
  const difference = Math.floor((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
  if (difference < 0 || difference > rules.bookingHorizonDays) throw new BookingError("DATE_OUTSIDE_BOOKING_HORIZON", 422, "The date is outside the booking horizon.");
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

function meetsLeadTime(date: string, time: string, rules: BookingRules, now: Date): boolean {
  const today = localDate(now, rules.timezone);
  if (date > today) return true;
  if (date < today) return false;
  return minutesSinceMidnight(time) >= localMinutes(now, rules.timezone) + rules.leadTimeMinutes;
}

function localDate(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

function localMinutes(date: Date, timezone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(values.hour) * 60 + Number(values.minute);
}

function formatMinutes(total: number): string {
  if (total < 0 || total >= 24 * 60) throw new BookingError("INVALID_TIME_WINDOW", 422, "The time window must stay within one calendar day.");
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function hashCancellationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function documentObject(value: unknown): Record<string, unknown> {
  return typeof (value as { toObject?: unknown })?.toObject === "function"
    ? (value as { toObject(): Record<string, unknown> }).toObject()
    : value as Record<string, unknown>;
}

export function canCancelUntil(date: string, time: string, now: Date, timezone: string, deadlineMinutes: number): boolean {
  const instant = zonedDateTimeToUtc(date, time, timezone);
  return instant.getTime() - now.getTime() >= deadlineMinutes * 60_000;
}

function zonedDateTimeToUtc(date: string, time: string, timezone: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const assumedUtc = Date.UTC(year, month - 1, day, hour, minute);
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const offsetAt = (instant: number) => {
    const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map((part) => [part.type, part.value]));
    return Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute)) - instant;
  };
  let result = assumedUtc - offsetAt(assumedUtc);
  result = assumedUtc - offsetAt(result);
  return new Date(result);
}
