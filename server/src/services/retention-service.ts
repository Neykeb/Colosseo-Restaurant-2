import { AuditEventModel, OutboxEventModel, ReservationLockModel, ReservationModel, TableAssignmentModel } from "../models/core";

export const retentionPolicy = {
  cancelledOrDeclinedDays: 90,
  completedOrNoShowDays: 180,
  sentOutboxDays: 30,
  auditDays: 365,
} as const;

export async function applyRetention(now = new Date()) {
  const cancelledBefore = isoDateDaysAgo(now, retentionPolicy.cancelledOrDeclinedDays);
  const completedBefore = isoDateDaysAgo(now, retentionPolicy.completedOrNoShowDays);
  const reservations = await ReservationModel.find({
    $or: [
      { status: { $in: ["cancelled", "declined"] }, date: { $lt: cancelledBefore } },
      { status: { $in: ["completed", "no_show"] }, date: { $lt: completedBefore } },
    ],
    "guest.name": { $ne: "ANONYMIZED" },
  }).select({ publicId: 1 }).lean().exec();
  const publicIds = reservations.map((reservation) => reservation.publicId);
  if (publicIds.length) {
    await ReservationModel.updateMany({ publicId: { $in: publicIds } }, { $set: { guest: { name: "ANONYMIZED" } }, $unset: { internalNote: "", cancellationTokenHash: "" } });
    await ReservationLockModel.deleteMany({ reservationPublicId: { $in: publicIds } });
    await TableAssignmentModel.deleteMany({ reservationPublicId: { $in: publicIds } });
  }
  const outboxResult = await OutboxEventModel.deleteMany({ status: "sent", updatedAt: { $lt: daysAgo(now, retentionPolicy.sentOutboxDays) } });
  const auditResult = await AuditEventModel.deleteMany({ createdAt: { $lt: daysAgo(now, retentionPolicy.auditDays) } });
  return { anonymizedReservations: publicIds.length, deletedOutboxEvents: outboxResult.deletedCount, deletedAuditEvents: auditResult.deletedCount };
}

export function isoDateDaysAgo(now: Date, days: number): string {
  return new Date(now.getTime() - days * 86_400_000).toISOString().slice(0, 10);
}

function daysAgo(now: Date, days: number): Date {
  return new Date(now.getTime() - days * 86_400_000);
}
