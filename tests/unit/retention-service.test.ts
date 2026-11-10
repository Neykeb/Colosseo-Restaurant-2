import { describe, expect, it } from "vitest";
import { isoDateDaysAgo, retentionPolicy } from "../../server/src/services/retention-service";

describe("reservation retention policy", () => {
  it("keeps the documented retention periods stable", () => {
    expect(retentionPolicy).toEqual({ cancelledOrDeclinedDays: 90, completedOrNoShowDays: 180, sentOutboxDays: 30, auditDays: 365 });
  });

  it("calculates UTC date cutoffs deterministically", () => {
    expect(isoDateDaysAgo(new Date("2026-11-09T12:00:00Z"), 90)).toBe("2026-08-11");
  });
});
