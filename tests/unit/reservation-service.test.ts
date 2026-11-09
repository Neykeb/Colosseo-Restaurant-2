import { describe, expect, it } from "vitest";
import { ReservationService } from "../../server/src/services/reservation-service";
import type { Reservation } from "../../server/src/models/core";

const reservation = { publicId: "res_dev_1", date: "2026-11-10", startTime: "18:00", endTime: "20:00", partySize: 2, status: "requested", guest: { name: "Development Guest" }, idempotencyKey: "idem_dev_1" } as unknown as Reservation;

describe("reservation idempotency", () => {
  it("returns the existing reservation for a repeated request", async () => {
    const repository = { findByIdempotencyKey: async () => reservation, create: async () => { throw new Error("must not create"); }, findByPublicId: async () => reservation };
    await expect(new ReservationService(repository).createIdempotent(reservation)).resolves.toEqual(reservation);
  });

  it("recovers a concurrent duplicate-key race by reading the winner", async () => {
    let reads = 0;
    const repository = { findByIdempotencyKey: async () => (++reads === 1 ? null : reservation), create: async () => { throw Object.assign(new Error("duplicate"), { code: 11000 }); }, findByPublicId: async () => reservation };
    await expect(new ReservationService(repository).createIdempotent(reservation)).resolves.toEqual(reservation);
  });

  it("returns one result for two simultaneous requests with the same idempotency key", async () => {
    let stored: Reservation | null = null;
    let creates = 0;
    const repository = {
      findByIdempotencyKey: async () => stored,
      create: async () => {
        creates += 1;
        await Promise.resolve();
        if (stored) throw Object.assign(new Error("duplicate"), { code: 11000 });
        stored = reservation;
        return reservation;
      },
      findByPublicId: async () => stored,
    };
    const service = new ReservationService(repository);
    const results = await Promise.all([service.createIdempotent(reservation), service.createIdempotent(reservation)]);
    expect(results).toEqual([reservation, reservation]);
    expect(creates).toBe(2);
  });
});
