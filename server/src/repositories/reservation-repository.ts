import mongoose from "mongoose";
import { ReservationModel, TableAssignmentModel, TableModel, type Reservation } from "../models/core";

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

  async createWithTableAssignment(input: Reservation, tableKey: string) {
    const session = await mongoose.startSession();
    try {
      let created: unknown;
      await session.withTransaction(async () => {
        const table = await TableModel.findOneAndUpdate({ key: tableKey, active: true }, { $inc: { allocationVersion: 1 } }, { new: true, session });
        if (!table) throw new Error("TABLE_NOT_AVAILABLE");
        const conflict = await TableAssignmentModel.exists({
          tableKey,
          date: input.date,
          startTime: { $lt: input.endTime },
          endTime: { $gt: input.startTime },
        }).session(session);
        if (conflict) throw new Error("TABLE_NOT_AVAILABLE");
        const [reservation] = await ReservationModel.create([input], { session });
        await TableAssignmentModel.create([{ reservationPublicId: input.publicId, tableKey, date: input.date, startTime: input.startTime, endTime: input.endTime }], { session });
        created = reservation;
      });
      return created;
    } finally {
      await session.endSession();
    }
  }
}
