import { describe, expect, it } from "vitest";
import { assertReservationTransition, canAccommodateParty, canTransitionReservation, isWithinServiceWindow, windowsOverlap } from "../../server/src/domain/reservation-domain";

describe("reservation domain", () => {
  it("accepts a reservation fully inside an enabled service window", () => {
    expect(isWithinServiceWindow("18:00", "19:30", { opens: "17:00", closes: "21:00" })).toBe(true);
  });

  it("rejects disabled and out-of-window service periods", () => {
    expect(isWithinServiceWindow("18:00", "19:30", { opens: "17:00", closes: "21:00", enabled: false })).toBe(false);
    expect(isWithinServiceWindow("16:00", "17:30", { opens: "17:00", closes: "21:00" })).toBe(false);
  });

  it("detects half-open interval overlap without treating touching windows as overlap", () => {
    expect(windowsOverlap("18:00", "19:00", "18:30", "19:30")).toBe(true);
    expect(windowsOverlap("18:00", "19:00", "19:00", "20:00")).toBe(false);
  });

  it("allows only explicit reservation status transitions", () => {
    expect(canTransitionReservation("pending", "confirmed")).toBe(true);
    expect(canTransitionReservation("confirmed", "pending")).toBe(false);
    expect(() => assertReservationTransition("completed", "confirmed")).toThrow("Invalid reservation transition");
  });

  it("calculates only active table capacity for availability", () => {
    const tables = [{ seats: 2, active: true }, { seats: 4, active: true }, { seats: 8, active: false }];
    expect(canAccommodateParty(tables, 2, 4)).toBe(true);
    expect(canAccommodateParty(tables, 2, 5)).toBe(false);
  });
});
