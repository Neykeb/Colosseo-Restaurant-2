import { describe, expect, it } from "vitest";
import { BookingError, canCancelUntil, selectTableAllocation, validateBookingDate, type BookingRules } from "../../server/src/services/booking-service";

const rules: BookingRules = {
  timezone: "Europe/Berlin",
  bookingHorizonDays: 30,
  leadTimeMinutes: 120,
  defaultDurationMinutes: 120,
  partySizeMin: 1,
  partySizeMax: 8,
  confirmationMode: "pending",
};

describe("booking rules", () => {
  it("accepts dates inside the configured Berlin booking horizon", () => {
    expect(() => validateBookingDate("2026-11-10", rules, new Date("2026-11-09T10:00:00Z"))).not.toThrow();
  });

  it("rejects past dates and dates beyond the booking horizon", () => {
    expect(() => validateBookingDate("2026-11-08", rules, new Date("2026-11-09T10:00:00Z"))).toThrow(BookingError);
    expect(() => validateBookingDate("2026-12-10", rules, new Date("2026-11-09T10:00:00Z"))).toThrowError(/booking horizon/i);
  });

  it("rejects invalid calendar date input", () => {
    expect(() => validateBookingDate("09.11.2026", rules)).toThrowError(/YYYY-MM-DD/);
    expect(() => validateBookingDate("2026-02-31", rules)).toThrowError(/YYYY-MM-DD/);
  });
});

describe("guest cancellation deadline", () => {
  it("allows cancellation until two hours before the Berlin reservation time", () => {
    expect(canCancelUntil("2026-11-10", "18:00", new Date("2026-11-10T14:59:00Z"), "Europe/Berlin", 120)).toBe(true);
    expect(canCancelUntil("2026-11-10", "18:00", new Date("2026-11-10T15:01:00Z"), "Europe/Berlin", 120)).toBe(false);
  });
});

describe("table allocation", () => {
  const tables = [
    { key: "t1", minPartySize: 1, maxPartySize: 2, combinationGroupKey: "pair" },
    { key: "t2", minPartySize: 1, maxPartySize: 2, combinationGroupKey: "pair" },
    { key: "t3", minPartySize: 2, maxPartySize: 4, combinationGroupKey: null },
  ];

  it("chooses the smallest single table before a combination", () => {
    expect(selectTableAllocation(tables, 2)?.map((table) => table.key)).toEqual(["t1"]);
    expect(selectTableAllocation(tables, 3)?.map((table) => table.key)).toEqual(["t3"]);
  });

  it("uses only tables from the same combination group", () => {
    expect(selectTableAllocation(tables.slice(0, 2), 4)?.map((table) => table.key)).toEqual(["t1", "t2"]);
  });

  it("returns sold out when no valid allocation remains", () => {
    expect(selectTableAllocation(tables, 8)).toBeNull();
    expect(selectTableAllocation([], 2)).toBeNull();
  });
});
