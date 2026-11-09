import { ReservationRepository } from "../repositories/reservation-repository";
import type { Reservation } from "../models/core";

type ReservationStore = {
  findByPublicId(publicId: string): Promise<unknown | null>;
  findByIdempotencyKey(idempotencyKey: string): Promise<unknown | null>;
  create(input: Reservation): Promise<unknown>;
};

export class ReservationService {
  constructor(private readonly reservations: ReservationStore = new ReservationRepository()) {}

  findByPublicId(publicId: string) {
    return this.reservations.findByPublicId(publicId);
  }

  async createIdempotent(input: Reservation): Promise<Reservation> {
    const existing = await this.reservations.findByIdempotencyKey(input.idempotencyKey);
    if (existing) return existing as Reservation;
    try {
      return await this.reservations.create(input) as Reservation;
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error;
      const concurrent = await this.reservations.findByIdempotencyKey(input.idempotencyKey);
      if (!concurrent) throw error;
      return concurrent as Reservation;
    }
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000;
}
