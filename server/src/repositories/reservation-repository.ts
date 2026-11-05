import { ReservationModel, type Reservation } from "../models/core";

export class ReservationRepository {
  findByPublicId(publicId: string) {
    return ReservationModel.findOne({ publicId }).lean().exec();
  }

  findByIdempotencyKey(idempotencyKey: string) {
    return ReservationModel.findOne({ idempotencyKey }).lean().exec();
  }

  create(input: Reservation) {
    return ReservationModel.create(input);
  }
}
