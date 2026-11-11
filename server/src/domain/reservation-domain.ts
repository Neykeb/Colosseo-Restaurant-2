export interface ReservationRules {
  timezone: string;
  bookingHorizonDays: number;
  leadTimeMinutes: number;
  defaultDurationMinutes: number;
  bufferMinutes: number;
  slotIntervalMinutes: number;
  partySizeMin: number;
  partySizeMax: number;
}

export interface ServicePeriod {
  key: string;
  weekday: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface ReservableTable {
  key: string;
  minPartySize: number;
  maxPartySize: number;
  combinationGroupKey: string | null;
  active: boolean;
}

export interface TableCandidate {
  tableKeys: string[];
  capacity: number;
}

const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function parseDate(value: string): { year: number; month: number; day: number } | null {
  const match = datePattern.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { year, month, day };
}

export function timeToMinutes(value: string): number | null {
  const match = timePattern.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

export function minutesToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function weekdayForDate(value: string): number | null {
  const parsed = parseDate(value);
  return parsed ? new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day)).getUTCDay() : null;
}

export function addCalendarDays(value: string, days: number): string | null {
  const parsed = parseDate(value);
  if (!parsed) return null;
  const next = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day + days));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

export function dateInTimezone(now: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function instantForLocalDateTime(date: string, time: string, timezone: string): Date | null {
  const parsedDate = parseDate(date);
  const minutes = timeToMinutes(time);
  if (!parsedDate || minutes === null) return null;
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const targetAsUtc = Date.UTC(parsedDate.year, parsedDate.month - 1, parsedDate.day, hour, minute);
  let candidate = targetAsUtc;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const parts = formatter.formatToParts(new Date(candidate));
    const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value);
    const representedAsUtc = Date.UTC(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"));
    candidate += targetAsUtc - representedAsUtc;
  }

  const result = new Date(candidate);
  const rendered = formatter.formatToParts(result);
  const renderedPart = (type: Intl.DateTimeFormatPartTypes) => rendered.find((item) => item.type === type)?.value;
  const matches = renderedPart("year") === String(parsedDate.year)
    && renderedPart("month") === String(parsedDate.month).padStart(2, "0")
    && renderedPart("day") === String(parsedDate.day).padStart(2, "0")
    && renderedPart("hour") === String(hour).padStart(2, "0")
    && renderedPart("minute") === String(minute).padStart(2, "0");
  return matches ? result : null;
}

export function validateBookingWindow(date: string, time: string, rules: ReservationRules, now: Date): "ok" | "past" | "lead_time" | "horizon" | "invalid" {
  const instant = instantForLocalDateTime(date, time, rules.timezone);
  if (!instant) return "invalid";
  if (instant.getTime() <= now.getTime()) return "past";
  if (instant.getTime() < now.getTime() + rules.leadTimeMinutes * 60_000) return "lead_time";
  const today = dateInTimezone(now, rules.timezone);
  const lastDate = addCalendarDays(today, rules.bookingHorizonDays);
  if (!lastDate || date > lastDate) return "horizon";
  return "ok";
}

export function generateStartTimes(periods: readonly ServicePeriod[], rules: ReservationRules): string[] {
  const result: string[] = [];
  for (const period of periods.filter(({ active }) => active)) {
    const start = timeToMinutes(period.startTime);
    const end = timeToMinutes(period.endTime);
    if (start === null || end === null) continue;
    for (let value = start; value + rules.defaultDurationMinutes <= end; value += rules.slotIntervalMinutes) {
      result.push(minutesToTime(value));
    }
  }
  return [...new Set(result)].sort();
}

export function lockSlotStarts(startTime: string, rules: ReservationRules): string[] {
  const start = timeToMinutes(startTime);
  if (start === null) return [];
  const occupiedMinutes = rules.defaultDurationMinutes + rules.bufferMinutes;
  const count = Math.ceil(occupiedMinutes / rules.slotIntervalMinutes);
  return Array.from({ length: count }, (_, index) => minutesToTime(start + index * rules.slotIntervalMinutes));
}

export function buildTableCandidates(tables: readonly ReservableTable[], partySize: number): TableCandidate[] {
  const active = tables.filter(({ active }) => active);
  const candidates: TableCandidate[] = active
    .filter((table) => partySize >= table.minPartySize && partySize <= table.maxPartySize)
    .map((table) => ({ tableKeys: [table.key], capacity: table.maxPartySize }));
  const groups = new Map<string, ReservableTable[]>();
  for (const table of active) {
    if (!table.combinationGroupKey) continue;
    const group = groups.get(table.combinationGroupKey) ?? [];
    group.push(table);
    groups.set(table.combinationGroupKey, group);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const capacity = group.reduce((total, table) => total + table.maxPartySize, 0);
    const minimumUsefulSize = Math.max(...group.map(({ maxPartySize }) => maxPartySize)) + 1;
    if (partySize >= minimumUsefulSize && partySize <= capacity) {
      candidates.push({ tableKeys: group.map(({ key }) => key).sort(), capacity });
    }
  }
  return candidates.sort((left, right) => left.capacity - right.capacity || left.tableKeys.length - right.tableKeys.length || left.tableKeys.join().localeCompare(right.tableKeys.join()));
}

export function selectAvailableTables(candidates: TableCandidate[], occupiedTableKeys: Set<string>): TableCandidate | null {
  return candidates.find(({ tableKeys }) => tableKeys.every((key) => !occupiedTableKeys.has(key))) ?? null;
}

export const reservationStatusTransitions = {
  requested: ["confirmed", "declined", "cancelled"],
  pending: ["confirmed", "declined", "cancelled"],
  confirmed: ["cancelled", "completed", "no_show"],
  seated: ["completed", "no_show"],
  declined: [],
  cancelled: [],
  completed: [],
  no_show: [],
} as const;

export type ReservationStatus = keyof typeof reservationStatusTransitions;

export function canTransitionReservationStatus(from: ReservationStatus, to: ReservationStatus): boolean {
  return (reservationStatusTransitions[from] as readonly string[]).includes(to);
}

export function minutesSinceMidnight(value: string): number {
  const minutes = timeToMinutes(value);
  if (minutes === null) throw new Error("Invalid time value.");
  return minutes;
}

export function isWithinServiceWindow(startTime: string, endTime: string, window: { opens: string; closes: string }): boolean {
  return startTime >= window.opens && endTime <= window.closes;
}

export function assertReservationTransition(from: ReservationStatus, to: ReservationStatus): void {
  if (!canTransitionReservationStatus(from, to)) throw new Error("Invalid reservation status transition.");
}

export type EventInquiryStatus = "new" | "in_review" | "accepted" | "declined" | "closed";

const eventInquiryStatusTransitions: Record<EventInquiryStatus, readonly EventInquiryStatus[]> = {
  new: ["in_review", "declined", "closed"],
  in_review: ["accepted", "declined", "closed"],
  accepted: ["closed"],
  declined: ["closed"],
  closed: [],
};

export function canTransitionEventInquiryStatus(from: EventInquiryStatus, to: EventInquiryStatus): boolean {
  return eventInquiryStatusTransitions[from].includes(to);
}
