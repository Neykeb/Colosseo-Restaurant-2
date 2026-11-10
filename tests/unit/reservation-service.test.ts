import { describe, expect, it, vi } from "vitest";
import { reservationRules, restaurantAreas, restaurantTables, servicePeriods } from "../../server/src/data/restaurant-configuration";
import type { ReservationRepository } from "../../server/src/repositories/reservation-repository";
import { ReservationRequestError, ReservationService } from "../../server/src/services/reservation-service";

function createRepository(occupied = new Set<string>()) {
  return {
    loadConfiguration: vi.fn(async () => ({ rules: reservationRules, servicePeriods: [...servicePeriods], tables: [...restaurantTables], areas: [...restaurantAreas] })),
    findOccupiedTableKeys: vi.fn(async () => new Set(occupied)),
    createConfirmed: vi.fn(async (input) => ({ publicId: input.publicId, status: "confirmed" as const, tableKeys: input.tableKeys, reused: false })),
    findByPublicId: vi.fn(),
  } as unknown as ReservationRepository;
}

describe("ReservationService", () => {
  const now = () => new Date("2026-11-09T09:00:00.000Z");

  it("returns bookable Tuesday slots and their actual availability", async () => {
    const service = new ReservationService(createRepository(), now);
    const result = await service.getAvailability("2026-11-10", 2);
    expect(result.slots.map(({ startTime }) => startTime)).toEqual(["12:00", "17:00", "17:30", "18:00", "18:30", "19:00"]);
    expect(result.slots.every(({ available }) => available)).toBe(true);
  });

  it("returns no slots on the configured closing day", async () => {
    const service = new ReservationService(createRepository(), now);
    await expect(service.getAvailability("2026-11-16", 2)).resolves.toEqual({ date: "2026-11-16", partySize: 2, slots: [] });
  });

  it("creates a confirmed reservation using the smallest fitting table", async () => {
    const repository = createRepository();
    const service = new ReservationService(repository, now);
    const result = await service.createReservation({ date: "2026-11-10", startTime: "17:00", partySize: 2, locale: "de", guest: { name: "Giulia Bianchi", email: "giulia@example.com" }, privacyAcknowledged: true, idempotencyKey: "booking-0001" });
    expect(result.status).toBe("confirmed");
    expect(result.tableKeys).toEqual(["table-01"]);
    expect(repository.createConfirmed).toHaveBeenCalledWith(expect.objectContaining({ endTime: "19:00", slotStarts: ["17:00", "17:30", "18:00", "18:30", "19:00"] }));
  });

  it("rejects times outside service and fully booked capacity", async () => {
    const closedService = new ReservationService(createRepository(), now);
    await expect(closedService.createReservation({ date: "2026-11-10", startTime: "15:00", partySize: 2, locale: "de", guest: { name: "Luca Rossi", phone: "0417123456" }, privacyAcknowledged: true, idempotencyKey: "booking-0002" })).rejects.toMatchObject({ reason: "closed" });
    const fullService = new ReservationService(createRepository(new Set(restaurantTables.map(({ key }) => key))), now);
    await expect(fullService.createReservation({ date: "2026-11-10", startTime: "17:00", partySize: 2, locale: "de", guest: { name: "Luca Rossi", phone: "0417123456" }, privacyAcknowledged: true, idempotencyKey: "booking-0003" })).rejects.toBeInstanceOf(ReservationRequestError);
  });
});
