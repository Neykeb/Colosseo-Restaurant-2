import { randomBytes } from "node:crypto";
import { buildTableCandidates, generateStartTimes, lockSlotStarts, minutesToTime, selectAvailableTables, timeToMinutes, validateBookingWindow, weekdayForDate } from "../domain/reservation-domain";
import { ReservationLockConflictError, ReservationRepository } from "../repositories/reservation-repository";

export interface ReservationRequest {
  date: string;
  startTime: string;
  partySize: number;
  locale?: "de" | "en" | "it";
  guest: { name: string; email?: string; phone?: string };
  privacyAcknowledged: true;
  idempotencyKey: string;
}

export type AvailabilityReason = "invalid_date" | "party_size" | "closed" | "past" | "lead_time" | "horizon" | "fully_booked";

export class ReservationRequestError extends Error {
  constructor(public readonly reason: AvailabilityReason, message: string) {
    super(message);
    this.name = "ReservationRequestError";
  }
}

function createPublicId(): string {
  return `COL-${randomBytes(5).toString("hex").toUpperCase()}`;
}

export class ReservationService {
  constructor(private readonly reservations = new ReservationRepository(), private readonly now: () => Date = () => new Date()) {}

  findByPublicId(publicId: string) {
    return this.reservations.findByPublicId(publicId);
  }

  async getPublicConfiguration() {
    const configuration = await this.reservations.loadConfiguration();
    return {
      timezone: configuration.rules.timezone,
      bookingHorizonDays: configuration.rules.bookingHorizonDays,
      leadTimeMinutes: configuration.rules.leadTimeMinutes,
      defaultDurationMinutes: configuration.rules.defaultDurationMinutes,
      slotIntervalMinutes: configuration.rules.slotIntervalMinutes,
      partySize: { min: configuration.rules.partySizeMin, max: configuration.rules.partySizeMax },
      servicePeriods: configuration.servicePeriods,
    };
  }

  async getAvailability(date: string, partySize: number) {
    const configuration = await this.reservations.loadConfiguration();
    const weekday = weekdayForDate(date);
    if (weekday === null) throw new ReservationRequestError("invalid_date", "The reservation date is invalid.");
    if (!Number.isInteger(partySize) || partySize < configuration.rules.partySizeMin || partySize > configuration.rules.partySizeMax) throw new ReservationRequestError("party_size", "The party size is outside the reservable range.");
    const periods = configuration.servicePeriods.filter((period) => period.weekday === weekday && period.active);
    const candidates = buildTableCandidates(configuration.tables, partySize);
    const slots: Array<{ startTime: string; available: boolean }> = [];
    for (const startTime of generateStartTimes(periods, configuration.rules)) {
      if (validateBookingWindow(date, startTime, configuration.rules, this.now()) !== "ok") continue;
      const occupied = await this.reservations.findOccupiedTableKeys(date, lockSlotStarts(startTime, configuration.rules));
      slots.push({ startTime, available: Boolean(selectAvailableTables(candidates, occupied)) });
    }
    return { date, partySize, slots };
  }

  async createReservation(input: ReservationRequest) {
    const configuration = await this.reservations.loadConfiguration();
    const weekday = weekdayForDate(input.date);
    if (weekday === null) throw new ReservationRequestError("invalid_date", "The reservation date is invalid.");
    if (!Number.isInteger(input.partySize) || input.partySize < configuration.rules.partySizeMin || input.partySize > configuration.rules.partySizeMax) throw new ReservationRequestError("party_size", "The party size is outside the reservable range.");
    const periods = configuration.servicePeriods.filter((period) => period.weekday === weekday && period.active);
    if (!generateStartTimes(periods, configuration.rules).includes(input.startTime)) throw new ReservationRequestError("closed", "The requested time is outside the reservable service periods.");
    const window = validateBookingWindow(input.date, input.startTime, configuration.rules, this.now());
    if (window !== "ok") {
      const reason: AvailabilityReason = window === "invalid" ? "invalid_date" : window;
      throw new ReservationRequestError(reason, `The requested time violates the ${reason} rule.`);
    }
    const candidates = buildTableCandidates(configuration.tables, input.partySize);
    const slotStarts = lockSlotStarts(input.startTime, configuration.rules);
    const startMinutes = timeToMinutes(input.startTime);
    if (startMinutes === null) throw new ReservationRequestError("closed", "The requested time is invalid.");
    const endTime = minutesToTime(startMinutes + configuration.rules.defaultDurationMinutes);
    const attempted = new Set<string>();
    while (attempted.size < configuration.tables.length) {
      const occupied = await this.reservations.findOccupiedTableKeys(input.date, slotStarts);
      for (const key of attempted) occupied.add(key);
      const candidate = selectAvailableTables(candidates, occupied);
      if (!candidate) break;
      candidate.tableKeys.forEach((key) => attempted.add(key));
      try {
        return await this.reservations.createConfirmed({ ...input, locale: input.locale ?? "de", publicId: createPublicId(), endTime, tableKeys: candidate.tableKeys, slotStarts });
      } catch (error) {
        if (!(error instanceof ReservationLockConflictError)) throw error;
      }
    }
    throw new ReservationRequestError("fully_booked", "No suitable table is available for the requested time.");
  }
}
