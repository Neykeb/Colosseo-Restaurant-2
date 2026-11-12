import { describe, expect, it } from "vitest";
import { buildTableCandidates, canTransitionReservationStatus, generateStartTimes, instantForLocalDateTime, lockSlotStarts, selectAvailableTables, validateBookingWindow, weekdayForDate } from "../../server/src/domain/reservation-domain";
import { reservationRules, restaurantTables, servicePeriods } from "../../server/src/data/restaurant-configuration";

describe("reservation domain", () => {
  it("validates real calendar dates and weekdays", () => {
    expect(weekdayForDate("2026-11-10")).toBe(2);
    expect(weekdayForDate("2026-02-30")).toBeNull();
  });

  it("creates only start times that fit the full reservation duration", () => {
    const tuesday = servicePeriods.filter(({ weekday }) => weekday === 2);
    expect(generateStartTimes(tuesday, reservationRules)).toEqual(["12:00", "17:00", "17:30", "18:00", "18:30", "19:00"]);
  });

  it("locks the duration plus buffer at the configured interval", () => {
    expect(lockSlotStarts("17:00", reservationRules)).toEqual(["17:00", "17:30", "18:00", "18:30", "19:00"]);
  });

  it("chooses the smallest fitting free table and then a permitted pair", () => {
    const forTwo = buildTableCandidates(restaurantTables, 2);
    expect(selectAvailableTables(forTwo, new Set())?.capacity).toBe(2);
    expect(selectAvailableTables(forTwo, new Set(["table-01", "table-02"]))?.capacity).toBe(4);
    const forEight = buildTableCandidates(restaurantTables, 8);
    expect(forEight[0]).toEqual({ tableKeys: ["table-07", "table-08"], capacity: 8 });
  });

  it("honours lead time and booking horizon in the restaurant timezone", () => {
    const now = new Date("2026-11-09T10:00:00.000Z");
    expect(validateBookingWindow("2026-11-09", "12:00", reservationRules, now)).toBe("lead_time");
    expect(validateBookingWindow("2026-11-10", "12:00", reservationRules, now)).toBe("ok");
    expect(validateBookingWindow("2027-02-01", "12:00", reservationRules, now)).toBe("horizon");
  });

  it("rejects a local time that does not exist during the DST jump", () => {
    expect(instantForLocalDateTime("2026-03-29", "02:30", "Europe/Berlin")).toBeNull();
  });

  it("allows only explicit status transitions", () => {
    expect(canTransitionReservationStatus("requested", "confirmed")).toBe(true);
    expect(canTransitionReservationStatus("confirmed", "completed")).toBe(true);
    expect(canTransitionReservationStatus("confirmed", "seated")).toBe(true);
    expect(canTransitionReservationStatus("completed", "confirmed")).toBe(false);
  });
});
