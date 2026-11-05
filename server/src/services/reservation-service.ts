import { ReservationRepository } from "../repositories/reservation-repository";

export class ReservationService {
  constructor(private readonly reservations = new ReservationRepository()) {}

  findByPublicId(publicId: string) {
    return this.reservations.findByPublicId(publicId);
  }
}
