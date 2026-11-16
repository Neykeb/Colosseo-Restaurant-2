import { Resend } from "resend";
import { OutboxEventModel, ReservationModel } from "../models/core";

type Locale = "de" | "en" | "it";

export interface EmailMessage {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
}

export interface EmailTransport {
  send(message: EmailMessage, idempotencyKey: string): Promise<{ id: string }>;
}

export interface EmailOutboxConfiguration {
  apiKey: string;
  from: string;
  restaurantRecipient: string;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "de" ? "de-DE" : locale === "it" ? "it-IT" : "en-GB", {
    dateStyle: "long",
    timeZone: "Europe/Berlin",
  }).format(new Date(`${date}T12:00:00.000Z`));
}

export function createReservationEmail(input: {
  recipient: "guest" | "restaurant";
  restaurantRecipient: string;
  from: string;
  reservation: { publicId: string; date: string; startTime: string; partySize: number; locale: Locale; guest: { name: string; email?: string; phone?: string } };
}): EmailMessage {
  const { reservation } = input;
  const locale = reservation.locale ?? "de";
  const date = formatDate(reservation.date, locale);
  const guestCopy = {
    de: { subject: "Ihre Reservierung im Ristorante Colosseo", greeting: `Guten Tag ${reservation.guest.name},`, intro: "Ihre Reservierung ist bestätigt.", people: "Personen", reference: "Reservierungsnummer", closing: "Wir freuen uns auf Ihren Besuch." },
    en: { subject: "Your reservation at Ristorante Colosseo", greeting: `Hello ${reservation.guest.name},`, intro: "Your reservation is confirmed.", people: "guests", reference: "Reservation number", closing: "We look forward to welcoming you." },
    it: { subject: "La tua prenotazione al Ristorante Colosseo", greeting: `Buongiorno ${reservation.guest.name},`, intro: "La tua prenotazione è confermata.", people: "persone", reference: "Numero di prenotazione", closing: "Non vediamo l’ora di accoglierti." },
  }[locale];
  const isGuest = input.recipient === "guest";
  const to = isGuest && reservation.guest.email ? reservation.guest.email : input.restaurantRecipient;
  const subject = isGuest ? guestCopy.subject : `Neue Reservierung ${reservation.publicId}: ${reservation.guest.name}`;
  const lines = isGuest
    ? [guestCopy.greeting, "", guestCopy.intro, `${date}, ${reservation.startTime} Uhr`, `${reservation.partySize} ${guestCopy.people}`, `${guestCopy.reference}: ${reservation.publicId}`, "", guestCopy.closing, "Ristorante Colosseo"]
    : ["Neue bestätigte Online-Reservierung", "", `Gast: ${reservation.guest.name}`, `Datum: ${date}`, `Uhrzeit: ${reservation.startTime} Uhr`, `Personen: ${reservation.partySize}`, `Referenz: ${reservation.publicId}`, `E-Mail: ${reservation.guest.email ?? "nicht angegeben"}`, `Telefon: ${reservation.guest.phone ?? "nicht angegeben"}`];
  const text = lines.join("\n");
  const html = `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#211713;max-width:620px">${lines.map((line) => line ? `<p style="margin:0 0 10px">${escapeHtml(line)}</p>` : "<br>").join("")}</div>`;
  return { from: input.from, to: [to], subject, html, text };
}

export class ResendEmailTransport implements EmailTransport {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(message: EmailMessage, idempotencyKey: string): Promise<{ id: string }> {
    const { data, error } = await this.client.emails.send(message, { idempotencyKey });
    if (error || !data) throw new Error(error?.message ?? "Resend did not return an email ID.");
    return { id: data.id };
  }
}

export class EmailOutboxWorker {
  private timer?: NodeJS.Timeout;

  constructor(
    private readonly configuration: EmailOutboxConfiguration,
    private readonly transport: EmailTransport = new ResendEmailTransport(configuration.apiKey),
  ) {}

  async processNext(): Promise<boolean> {
    const now = new Date();
    const staleLock = new Date(now.getTime() - 10 * 60_000);
    const event = await OutboxEventModel.findOneAndUpdate(
      {
        attempts: { $lt: 5 },
        $or: [
          { status: { $in: ["pending", "failed"] }, nextAttemptAt: { $lte: now } },
          { status: "processing", lockedAt: { $lte: staleLock } },
        ],
      },
      { $set: { status: "processing", lockedAt: now }, $inc: { attempts: 1 } },
      { sort: { createdAt: 1 }, returnDocument: "after" },
    ).lean().exec();
    if (!event) return false;
    try {
      const reservation = await ReservationModel.findOne({ publicId: event.aggregateId }).lean().exec();
      if (!reservation) throw new Error("Reservation for email event was not found.");
      if (!reservation.guest?.name) throw new Error("Reservation guest data is incomplete.");
      const recipient = event.type === "reservation.confirmed.guest" ? "guest" : event.type === "reservation.confirmed.restaurant" ? "restaurant" : null;
      if (!recipient) throw new Error("Unsupported email event type.");
      const message = createReservationEmail({
        recipient,
        restaurantRecipient: this.configuration.restaurantRecipient,
        from: this.configuration.from,
        reservation: {
          publicId: reservation.publicId,
          date: reservation.date,
          startTime: reservation.startTime,
          partySize: reservation.partySize,
          locale: reservation.locale as Locale,
          guest: { name: reservation.guest.name, email: reservation.guest.email ?? undefined, phone: reservation.guest.phone ?? undefined },
        },
      });
      const sent = await this.transport.send(message, event.eventId);
      await OutboxEventModel.updateOne({ eventId: event.eventId }, { $set: { status: "sent", sentAt: new Date(), providerId: sent.id }, $unset: { lockedAt: 1, lastError: 1 } });
    } catch (error) {
      const message = (error instanceof Error ? error.message : "Unknown email delivery error").slice(0, 500);
      const delayMinutes = Math.min(60, 2 ** Math.max(0, event.attempts - 1));
      await OutboxEventModel.updateOne({ eventId: event.eventId }, { $set: { status: "failed", lastError: message, nextAttemptAt: new Date(Date.now() + delayMinutes * 60_000) }, $unset: { lockedAt: 1 } });
    }
    return true;
  }

  start(intervalMs = 5_000): void {
    void this.processNext();
    this.timer = setInterval(() => { void this.processNext(); }, intervalMs);
    this.timer.unref();
  }

  stop(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
