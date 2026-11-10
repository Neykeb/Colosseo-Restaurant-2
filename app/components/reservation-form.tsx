import { ArrowRight, CheckCircle, Phone } from "@phosphor-icons/react";
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";

type Locale = "de" | "en" | "it";
type AvailabilitySlot = { startTime: string; available: boolean };
type PublicConfiguration = { bookingHorizonDays: number; partySize: { min: number; max: number } };

const copy = {
  de: { date: "Datum", people: "Personen", check: "Freie Zeiten anzeigen", time: "Uhrzeit", noSlots: "Für dieses Datum sind online keine freien Zeiten verfügbar.", available: (count: number) => `${count} freie ${count === 1 ? "Zeit" : "Zeiten"} verfügbar.`, name: "Name", email: "E-Mail", phone: "Telefon", contactHint: "Bitte geben Sie mindestens E-Mail oder Telefon an.", privacy: "Ich habe den Hinweis zur Verarbeitung meiner Angaben für diese Reservierung gelesen.", submit: "Reservierung verbindlich anfragen", loading: "Reservierung wird geprüft …", success: "Ihre Reservierung ist bestätigt.", reference: "Reservierungsnummer", retry: "Andere Zeit wählen", error: "Die Reservierung konnte gerade nicht abgeschlossen werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.", unavailable: "Dieser Termin ist inzwischen nicht mehr verfügbar.", selectTime: "Bitte wählen Sie zuerst eine verfügbare Uhrzeit.", online: "Online reservieren", phoneAction: "Oder 04171 62952 anrufen" },
  en: { date: "Date", people: "Guests", check: "Show available times", time: "Time", noSlots: "No online times are available for this date.", available: (count: number) => `${count} available ${count === 1 ? "time" : "times"}.`, name: "Name", email: "Email", phone: "Phone", contactHint: "Please provide at least an email address or phone number.", privacy: "I have read the notice about processing my details for this reservation.", submit: "Request a confirmed reservation", loading: "Checking your reservation …", success: "Your reservation is confirmed.", reference: "Reservation number", retry: "Choose another time", error: "The reservation could not be completed. Please try again or call us.", unavailable: "This time is no longer available.", selectTime: "Please select an available time first.", online: "Reserve online", phoneAction: "Or call 04171 62952" },
  it: { date: "Data", people: "Persone", check: "Mostra gli orari disponibili", time: "Orario", noSlots: "Non ci sono orari online disponibili per questa data.", available: (count: number) => `${count} ${count === 1 ? "orario disponibile" : "orari disponibili"}.`, name: "Nome", email: "E-mail", phone: "Telefono", contactHint: "Inserisci almeno un indirizzo e-mail o un numero di telefono.", privacy: "Ho letto l’informativa sul trattamento dei miei dati per questa prenotazione.", submit: "Richiedi la prenotazione", loading: "Stiamo verificando la prenotazione …", success: "La prenotazione è confermata.", reference: "Numero di prenotazione", retry: "Scegli un altro orario", error: "Non è stato possibile completare la prenotazione. Riprova o chiamaci.", unavailable: "Questo orario non è più disponibile.", selectTime: "Seleziona prima un orario disponibile.", online: "Prenota online", phoneAction: "Oppure chiama 04171 62952" },
} as const;

function formatLocalDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function readError(response: Response): Promise<string | undefined> {
  const body = await response.json().catch(() => null) as { error?: { code?: string } } | null;
  return body?.error?.code;
}

export function ReservationForm({ locale }: { locale: Locale }) {
  const labels = copy[locale];
  const errorId = useId();
  const contactHintId = useId();
  const [configuration, setConfiguration] = useState<PublicConfiguration>({ bookingHorizonDays: 60, partySize: { min: 1, max: 10 } });
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState<AvailabilitySlot[] | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [contactInvalid, setContactInvalid] = useState(false);
  const [availabilityAnnouncement, setAvailabilityAnnouncement] = useState("");
  const [reference, setReference] = useState("");
  const idempotencyKey = useRef(crypto.randomUUID());
  const availabilityRequest = useRef<AbortController | null>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const successPanel = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date(), []);
  const minDate = formatLocalDate(today);
  const maxDate = formatLocalDate(addDays(today, configuration.bookingHorizonDays));

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/reservations/config", { signal: controller.signal })
      .then(async (response) => response.ok ? response.json() as Promise<PublicConfiguration> : Promise.reject(new Error("Configuration unavailable")))
      .then(setConfiguration)
      .catch((fetchError: unknown) => { if ((fetchError as { name?: string }).name !== "AbortError") setError(labels.error); });
    return () => controller.abort();
  }, [labels.error]);

  useEffect(() => () => availabilityRequest.current?.abort(), []);

  useEffect(() => {
    if (reference) successPanel.current?.focus();
  }, [reference]);

  const resetAvailability = () => {
    availabilityRequest.current?.abort();
    setSlots(null);
    setSelectedTime("");
    setAvailabilityAnnouncement("");
    setError("");
    idempotencyKey.current = crypto.randomUUID();
  };

  const checkAvailability = async () => {
    if (!date) return;
    availabilityRequest.current?.abort();
    const controller = new AbortController();
    availabilityRequest.current = controller;
    setChecking(true);
    setError("");
    setSelectedTime("");
    setAvailabilityAnnouncement(labels.loading);
    try {
      const response = await fetch(`/api/reservations/availability?date=${encodeURIComponent(date)}&partySize=${partySize}`, { signal: controller.signal });
      if (!response.ok) throw new Error("Availability unavailable");
      const result = await response.json() as { slots: AvailabilitySlot[] };
      setSlots(result.slots);
      const availableCount = result.slots.filter((slot) => slot.available).length;
      setAvailabilityAnnouncement(availableCount ? labels.available(availableCount) : labels.noSlots);
    } catch (availabilityError) {
      if ((availabilityError as { name?: string }).name === "AbortError") return;
      setSlots(null);
      setError(labels.error);
      setAvailabilityAnnouncement("");
    } finally {
      if (availabilityRequest.current === controller) {
        availabilityRequest.current = null;
        setChecking(false);
      }
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedTime) { setError(labels.selectTime); return; }
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    if (!email && !phone) {
      setContactInvalid(true);
      setError(labels.contactHint);
      emailInput.current?.focus();
      return;
    }
    setContactInvalid(false);
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey.current },
        body: JSON.stringify({ date, startTime: selectedTime, partySize, locale, guest: { name: String(form.get("name") ?? "").trim(), email: email || undefined, phone: phone || undefined }, privacyAcknowledged: form.get("privacy") === "on" }),
      });
      if (!response.ok) {
        const code = await readError(response);
        throw new Error(code === "FULLY_BOOKED" ? "FULLY_BOOKED" : "REQUEST_FAILED");
      }
      const result = await response.json() as { reservation: { publicId: string } };
      setReference(result.reservation.publicId);
      idempotencyKey.current = crypto.randomUUID();
    } catch (submitError) {
      setError(submitError instanceof Error && submitError.message === "FULLY_BOOKED" ? labels.unavailable : labels.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (reference) return <div aria-live="polite" className="reservation-success" ref={successPanel} role="status" tabIndex={-1}><CheckCircle aria-hidden="true" size={30} weight="fill" /><strong>{labels.success}</strong><p>{labels.reference}: <b>{reference}</b></p><button onClick={() => { setReference(""); resetAvailability(); }} type="button">{labels.retry}</button></div>;

  return <form aria-busy={checking || submitting} aria-describedby={error ? errorId : undefined} className="reservation-form" onSubmit={submit}>
    <div className="reservation-form-heading"><strong>{labels.online}</strong><a href="tel:+49417162952"><Phone aria-hidden="true" size={18} />{labels.phoneAction}</a></div>
    <div className="reservation-form-search">
      <label><span>{labels.date}</span><input min={minDate} max={maxDate} name="date" onChange={(event) => { setDate(event.target.value); resetAvailability(); }} required type="date" value={date} /></label>
      <label><span>{labels.people}</span><select name="partySize" onChange={(event) => { setPartySize(Number(event.target.value)); resetAvailability(); }} value={partySize}>{Array.from({ length: configuration.partySize.max - configuration.partySize.min + 1 }, (_, index) => configuration.partySize.min + index).map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <button className="reservation-check" disabled={!date || checking} onClick={checkAvailability} type="button">{checking ? labels.loading : labels.check}<ArrowRight aria-hidden="true" /></button>
    </div>
    <p aria-live="polite" className="reservation-live">{availabilityAnnouncement}</p>
    {slots && <fieldset className="reservation-times"><legend>{labels.time}</legend>{slots.length ? <div>{slots.map((slot) => <button aria-pressed={selectedTime === slot.startTime} className={selectedTime === slot.startTime ? "is-selected" : undefined} disabled={!slot.available} key={slot.startTime} onClick={() => { setSelectedTime(slot.startTime); setError(""); idempotencyKey.current = crypto.randomUUID(); }} type="button">{slot.startTime}</button>)}</div> : <p>{labels.noSlots}</p>}</fieldset>}
    {selectedTime && <div className="reservation-contact"><label><span>{labels.name}</span><input autoComplete="name" maxLength={120} name="name" required /></label><label><span>{labels.email}</span><input aria-describedby={contactInvalid ? errorId : contactHintId} aria-invalid={contactInvalid || undefined} autoCapitalize="none" autoComplete="email" maxLength={254} name="email" onChange={() => { setContactInvalid(false); if (error === labels.contactHint) setError(""); }} ref={emailInput} spellCheck={false} type="email" /></label><label><span>{labels.phone}</span><input aria-describedby={contactInvalid ? errorId : contactHintId} aria-invalid={contactInvalid || undefined} autoComplete="tel" inputMode="tel" maxLength={30} name="phone" onChange={() => { setContactInvalid(false); if (error === labels.contactHint) setError(""); }} type="tel" /></label><p id={contactHintId}>{labels.contactHint}</p><label className="reservation-privacy"><input name="privacy" required type="checkbox" /><span>{labels.privacy}</span></label><button className="reservation-submit" disabled={submitting} type="submit">{submitting ? labels.loading : labels.submit}<ArrowRight aria-hidden="true" /></button></div>}
    {error && <p className="reservation-error" id={errorId} role="alert">{error}</p>}
  </form>;
}
