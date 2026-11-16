import { describe, expect, it } from "vitest";
import { canTransitionEventInquiryStatus } from "../../server/src/domain/reservation-domain";

describe("event inquiry status transitions", () => {
  it("moves new inquiries into review or closes them", () => {
    expect(canTransitionEventInquiryStatus("new", "in_review")).toBe(true);
    expect(canTransitionEventInquiryStatus("new", "closed")).toBe(true);
  });

  it("allows review to be accepted or declined", () => {
    expect(canTransitionEventInquiryStatus("in_review", "accepted")).toBe(true);
    expect(canTransitionEventInquiryStatus("in_review", "declined")).toBe(true);
  });

  it("allows terminal inquiries to close only", () => {
    expect(canTransitionEventInquiryStatus("accepted", "closed")).toBe(true);
    expect(canTransitionEventInquiryStatus("declined", "closed")).toBe(true);
    expect(canTransitionEventInquiryStatus("closed", "new")).toBe(false);
  });

  it("rejects backwards transitions", () => {
    expect(canTransitionEventInquiryStatus("accepted", "in_review")).toBe(false);
    expect(canTransitionEventInquiryStatus("declined", "accepted")).toBe(false);
    expect(canTransitionEventInquiryStatus("new", "accepted")).toBe(false);
  });
});
