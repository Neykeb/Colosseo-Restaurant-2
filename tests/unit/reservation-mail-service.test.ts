import { describe, expect, it } from "vitest";
import { mailCopy } from "../../server/src/services/reservation-mail-service";

describe("reservation email localization", () => {
  it("creates localized guest messages without exposing internal table data", () => {
    expect(mailCopy("de", true, "res_123", "2026-11-10", "18:00", 2)).toMatchObject({ subject: "Ihre Reservierung res_123" });
    expect(mailCopy("en", true, "res_123", "2026-11-10", "18:00", 2).text).toContain("party of 2");
    expect(mailCopy("it", true, "res_123", "2026-11-10", "18:00", 2).text).toContain("2 persone");
  });

  it("creates a separate restaurant notification", () => {
    expect(mailCopy("de", false, "res_123", "2026-11-10", "18:00", 2).subject).toContain("Neue Reservierung");
  });
});
