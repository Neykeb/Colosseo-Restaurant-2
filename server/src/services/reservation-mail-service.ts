import { OutboxEventModel, ReservationModel } from "../models/core";

type MailConfig = { apiKey: string; from: string; restaurantEmail: string };
type Fetch = typeof fetch;

export class ReservationMailService {
  constructor(private readonly config: MailConfig, private readonly request: Fetch = fetch) {}

  async processPending(limit = 20): Promise<{ sent: number; failed: number }> {
    const events = await OutboxEventModel.find({ status: { $in: ["pending", "failed"] }, nextAttemptAt: { $lte: new Date() } }).sort({ createdAt: 1 }).limit(limit).exec();
    let sent = 0;
    let failed = 0;
    for (const event of events) {
      event.status = "processing";
      event.attempts += 1;
      await event.save();
      try {
        const reservation = await ReservationModel.findOne({ publicId: event.aggregateId }).lean().exec();
        if (!reservation) throw new Error("Reservation not found for outbox event");
        const guestEvent = event.type === "reservation.created.guest";
        const to = guestEvent ? reservation.guest?.email : this.config.restaurantEmail;
        if (!to) throw new Error("Reservation email recipient is missing");
        const copy = mailCopy(reservation.locale, guestEvent, reservation.publicId, reservation.date, reservation.startTime, reservation.partySize);
        const response = await this.request("https://api.resend.com/emails", {
          method: "POST",
          headers: { authorization: `Bearer ${this.config.apiKey}`, "content-type": "application/json", "idempotency-key": event.eventId },
          body: JSON.stringify({ from: this.config.from, to: [to], subject: copy.subject, text: copy.text }),
        });
        if (!response.ok) throw new Error(`Resend returned ${response.status}`);
        event.status = "sent";
        event.nextAttemptAt = undefined;
        await event.save();
        sent += 1;
      } catch {
        event.status = "failed";
        event.nextAttemptAt = new Date(Date.now() + Math.min(60, 2 ** event.attempts) * 60_000);
        await event.save();
        failed += 1;
      }
    }
    return { sent, failed };
  }
}

export function mailCopy(locale: string, guest: boolean, reference: string, date: string, time: string, partySize: number) {
  if (!guest) return { subject: `Neue Reservierung ${reference}`, text: `Neue Reservierung: ${date}, ${time}, ${partySize} Personen. Referenz: ${reference}` };
  if (locale === "en") return { subject: `Your reservation ${reference}`, text: `We received your reservation for ${date} at ${time}, party of ${partySize}. Reference: ${reference}` };
  if (locale === "it") return { subject: `La tua prenotazione ${reference}`, text: `Abbiamo ricevuto la prenotazione per il ${date} alle ${time}, ${partySize} persone. Riferimento: ${reference}` };
  return { subject: `Ihre Reservierung ${reference}`, text: `Wir haben Ihre Reservierung für den ${date} um ${time} Uhr für ${partySize} Personen erhalten. Referenz: ${reference}` };
}
