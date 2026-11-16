import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  AuditEventModel: { deleteMany: vi.fn() },
  OutboxEventModel: { deleteMany: vi.fn() },
  ReservationLockModel: { deleteMany: vi.fn() },
  ReservationModel: { find: vi.fn(), updateMany: vi.fn() },
  TableAssignmentModel: { deleteMany: vi.fn() },
}));

vi.mock("../../server/src/models/core", () => mocks);

function query<T>(value: T) {
  return { select: () => ({ lean: () => ({ exec: async () => value }) }) };
}
import { isoDateDaysAgo, retentionPolicy } from "../../server/src/services/retention-service";

describe("reservation retention policy", () => {
  it("keeps the documented retention periods stable", () => {
    expect(retentionPolicy).toEqual({ cancelledOrDeclinedDays: 90, completedOrNoShowDays: 180, sentOutboxDays: 30, auditDays: 365 });
  });

  it("calculates UTC date cutoffs deterministically", () => {
    expect(isoDateDaysAgo(new Date("2026-11-09T12:00:00Z"), 90)).toBe("2026-08-11");
  });

  it("anonymizes expired reservations and removes dependent operational data", async () => {
    const reservations = [{ publicId: "COL-EXPIRED-1" }, { publicId: "COL-EXPIRED-2" }];
    mocks.ReservationModel.find.mockReturnValue(query(reservations));
    mocks.ReservationModel.updateMany.mockResolvedValue({ modifiedCount: 2 });
    mocks.ReservationLockModel.deleteMany.mockResolvedValue({ deletedCount: 4 });
    mocks.TableAssignmentModel.deleteMany.mockResolvedValue({ deletedCount: 2 });
    mocks.OutboxEventModel.deleteMany.mockResolvedValue({ deletedCount: 3 });
    mocks.AuditEventModel.deleteMany.mockResolvedValue({ deletedCount: 1 });

    const { applyRetention } = await import("../../server/src/services/retention-service");
    await expect(applyRetention(new Date("2026-11-09T12:00:00Z"))).resolves.toEqual({ anonymizedReservations: 2, deletedOutboxEvents: 3, deletedAuditEvents: 1 });
    expect(mocks.ReservationModel.updateMany).toHaveBeenCalledWith({ publicId: { $in: ["COL-EXPIRED-1", "COL-EXPIRED-2"] } }, { $set: { guest: { name: "ANONYMIZED" } }, $unset: { internalNote: "", cancellationTokenHash: "" } });
    expect(mocks.ReservationLockModel.deleteMany).toHaveBeenCalledWith({ reservationPublicId: { $in: ["COL-EXPIRED-1", "COL-EXPIRED-2"] } });
    expect(mocks.TableAssignmentModel.deleteMany).toHaveBeenCalledWith({ reservationPublicId: { $in: ["COL-EXPIRED-1", "COL-EXPIRED-2"] } });
  });
});
