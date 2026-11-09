import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

type Locale = "de" | "en" | "it";
type Config = { bookingHorizonDays: number; partySize: { min: number; max: number }; provisional: boolean };

const copy = {
  de: { date: "Datum", party: "Personen", time: "Uhrzeit", name: "Name", email: "E-Mail", phone: "Telefon (optional)", load: "Verfügbarkeit prüfen", submit: "Reservierung anfragen", loading: "Wird geladen …", noSlots: "Für diese Auswahl ist kein Tisch verfügbar.", success: "Vielen Dank. Ihre Reservierungsreferenz lautet", error: "Die Reservierung konnte nicht abgeschlossen werden.", preview: "Entwicklungsmodus: Bitte keine echten personenbezogenen Daten eingeben.", privacy: "Die Angaben werden ausschließlich zur Bearbeitung dieser Reservierungsanfrage verwendet. Die finale Datenschutzinformation ist noch nicht freigegeben." },
  en: { date: "Date", party: "Guests", time: "Time", name: "Name", email: "Email", phone: "Phone (optional)", load: "Check availability", submit: "Request reservation", loading: "Loading …", noSlots: "No table is available for this selection.", success: "Thank you. Your reservation reference is", error: "The reservation could not be completed.", preview: "Development mode: do not enter real personal data.", privacy: "The details are used only to process this reservation request. The final privacy information has not yet been approved." },
  it: { date: "Data", party: "Persone", time: "Orario", name: "Nome", email: "Email", phone: "Telefono (facoltativo)", load: "Verifica disponibilità", submit: "Richiedi prenotazione", loading: "Caricamento …", noSlots: "Nessun tavolo è disponibile per questa scelta.", success: "Grazie. Il riferimento della prenotazione è", error: "Non è stato possibile completare la prenotazione.", preview: "Modalità di sviluppo: non inserire dati personali reali.", privacy: "I dati sono utilizzati esclusivamente per gestire questa richiesta. L'informativa privacy definitiva non è ancora approvata." },
} as const;

export function ReservationForm({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const [config, setConfig] = useState<Config | null>(null);
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState<string[]>([]);
  const [time, setTime] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const idempotencyKey = useRef(crypto.randomUUID());
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const maxDate = useMemo(() => {
    const value = new Date();
    value.setUTCDate(value.getUTCDate() + (config?.bookingHorizonDays ?? 30));
    return value.toISOString().slice(0, 10);
  }, [config]);

  useEffect(() => {
    fetch("/api/public/config").then(async (response) => {
      if (!response.ok) throw new Error();
      setConfig(await response.json() as Config);
    }).catch(() => { setState("error"); setMessage(text.error); });
  }, [text.error]);

  async function checkAvailability() {
    if (!date) return;
    setState("loading");
    setMessage("");
    setTime("");
    try {
      const response = await fetch(`/api/public/availability?date=${encodeURIComponent(date)}&partySize=${partySize}`);
      if (!response.ok) throw new Error();
      const body = await response.json() as { slots: string[] };
      setSlots(body.slots);
      setState("idle");
      if (body.slots.length === 0) setMessage(text.noSlots);
    } catch {
      setState("error");
      setMessage(text.error);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!time) return;
    setState("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/public/reservations", {
        method: "POST",
        headers: { "content-type": "application/json", "idempotency-key": idempotencyKey.current },
        body: JSON.stringify({ date, startTime: time, partySize, locale, guest: { name: form.get("name"), email: form.get("email"), phone: form.get("phone") || undefined } }),
      });
      const body = await response.json() as { reference?: string };
      if (!response.ok || !body.reference) throw new Error();
      setState("success");
      setMessage(`${text.success} ${body.reference}.`);
      idempotencyKey.current = crypto.randomUUID();
    } catch {
      setState("error");
      setMessage(text.error);
    }
  }

  const productionBlocked = Boolean(config?.provisional && import.meta.env.PROD);
  return <form className="no-reservation-form" onSubmit={submit}>
    {config?.provisional ? <p className="no-reservation-notice" role="note">{text.preview}</p> : null}
    <div className="no-reservation-fields">
      <label>{text.date}<input min={today} max={maxDate} name="date" onChange={(event) => setDate(event.target.value)} required type="date" value={date} /></label>
      <label>{text.party}<select name="partySize" onChange={(event) => setPartySize(Number(event.target.value))} value={partySize}>{Array.from({ length: (config?.partySize.max ?? 8) - (config?.partySize.min ?? 1) + 1 }, (_, index) => index + (config?.partySize.min ?? 1)).map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
      <button disabled={!date || state === "loading" || productionBlocked} onClick={checkAvailability} type="button">{state === "loading" ? text.loading : text.load}</button>
    </div>
    {slots.length > 0 ? <fieldset><legend>{text.time}</legend><div className="no-reservation-slots">{slots.map((slot) => <label key={slot}><input checked={time === slot} name="time" onChange={() => setTime(slot)} type="radio" value={slot} /> <span>{slot}</span></label>)}</div></fieldset> : null}
    {time ? <div className="no-reservation-contact"><label>{text.name}<input autoComplete="name" maxLength={100} name="name" required /></label><label>{text.email}<input autoComplete="email" maxLength={254} name="email" required type="email" /></label><label>{text.phone}<input autoComplete="tel" maxLength={40} name="phone" type="tel" /></label><p>{text.privacy}</p><button disabled={state === "submitting" || productionBlocked} type="submit">{state === "submitting" ? text.loading : text.submit}</button></div> : null}
    <p aria-live="polite" className={`no-reservation-status no-reservation-status-${state}`}>{message}</p>
  </form>;
}
