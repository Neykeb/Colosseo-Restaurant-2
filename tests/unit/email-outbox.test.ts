import { afterEach, describe, expect, it, vi } from "vitest";
import { OutboxEventModel, ReservationModel } from "../../server/src/models/core";
import { createReservationEmail, EmailOutboxWorker } from "../../server/src/services/email-outbox-service";

afterEach(() => vi.restoreAllMocks());

describe("reservation email rendering", () => {
  it("renders localized guest mail and escapes untrusted guest content", () => {
    const email = createReservationEmail({
      recipient: "guest",
      from: "Ristorante Colosseo <reservierung@example.com>",
      restaurantRecipient: "mohammad.amiri@dci-student.org",
      reservation: {
        publicId: "COL-1234567890",
        date: "2026-11-10",
        startTime: "17:00",
        partySize: 2,
        locale: "de",
        guest: { name: "<script>alert(1)</script>", email: "guest@example.com" },
      },
    });

    expect(email.to).toEqual(["guest@example.com"]);
    expect(email.subject).toContain("Reservierung");
    expect(email.text).toContain("COL-1234567890");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).not.toContain("<script>");
  });

  it("sends restaurant notifications only to the configured recipient", () => {
    const email = createReservationEmail({
      recipient: "restaurant",
      from: "Ristorante Colosseo <reservierung@example.com>",
      restaurantRecipient: "mohammad.amiri@dci-student.org",
      reservation: {
        publicId: "COL-0987654321",
        date: "2026-11-10",
        startTime: "19:00",
        partySize: 4,
        locale: "it",
        guest: { name: "Giulia Bianchi", phone: "04171 62952" },
      },
    });

    expect(email.to).toEqual(["mohammad.amiri@dci-student.org"]);
    expect(email.subject).toContain("COL-0987654321");
    expect(email.text).toContain("Telefon: 04171 62952");
  });

  it("claims an event, sends it with its stable idempotency key and marks it sent", async () => {
    const event = { eventId: "reservation.confirmed.restaurant/COL-1234567890", type: "reservation.confirmed.restaurant", aggregateId: "COL-1234567890", attempts: 1 };
    vi.spyOn(OutboxEventModel, "findOneAndUpdate").mockReturnValue({ lean: () => ({ exec: async () => event }) } as never);
    vi.spyOn(ReservationModel, "findOne").mockReturnValue({ lean: () => ({ exec: async () => ({ publicId: "COL-1234567890", date: "2026-11-10", startTime: "17:00", partySize: 2, locale: "de", guest: { name: "Giulia Bianchi", email: "guest@example.com" } }) }) } as never);
    const update = vi.spyOn(OutboxEventModel, "updateOne").mockResolvedValue({ acknowledged: true } as never);
    const send = vi.fn(async () => ({ id: "resend-message-1" }));
    const worker = new EmailOutboxWorker(
      { apiKey: "re_test_key", from: "Ristorante Colosseo <reservierung@example.com>", restaurantRecipient: "mohammad.amiri@dci-student.org" },
      { send },
    );

    await expect(worker.processNext()).resolves.toBe(true);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: ["mohammad.amiri@dci-student.org"] }), event.eventId);
    expect(update).toHaveBeenCalledWith({ eventId: event.eventId }, expect.objectContaining({ $set: expect.objectContaining({ status: "sent", providerId: "resend-message-1" }) }));
  });
});
