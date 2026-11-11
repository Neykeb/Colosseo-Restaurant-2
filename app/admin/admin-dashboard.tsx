import { CalendarBlank, CalendarDots, Confetti, UsersThree } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type AdminProfile = {
  displayName: string;
};

type Reservation = {
  publicId: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
  status: "requested" | "pending" | "confirmed" | "cancelled" | "declined" | "seated" | "completed" | "no_show";
  guest: { name: string };
};

type EventInquiry = {
  inquiryId: string;
  requestedDate: string;
  partySize: number;
  eventType: string;
  status: "new" | "in_review" | "accepted" | "declined" | "closed";
  name: string;
};

type ReservationBlock = {
  blockId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
};

type SpecialDay = {
  date: string;
  label: string;
  closed: boolean;
  opens?: string;
  closes?: string;
};

type CalendarOverview = {
  startDate: string;
  endDate: string;
  reservations: Reservation[];
  inquiries: EventInquiry[];
  blocks: ReservationBlock[];
  specialDays: SpecialDay[];
};

type ViewMode = "day" | "week";

const dateFormatter = new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "2-digit", month: "long" });
const compactDateFormatter = new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "2-digit", month: "2-digit" });

function isoDate(date: Date): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(date);
}

function parseIsoDate(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

function addDays(value: string, amount: number): string {
  const date = parseIsoDate(value);
  date.setDate(date.getDate() + amount);
  return isoDate(date);
}

function mondayOf(value: string): string {
  const date = parseIsoDate(value);
  const weekday = date.getDay() || 7;
  date.setDate(date.getDate() - weekday + 1);
  return isoDate(date);
}

function statusLabel(status: Reservation["status"]): string {
  return {
    requested: "Angefragt",
    pending: "In Prüfung",
    confirmed: "Bestätigt",
    cancelled: "Storniert",
    declined: "Abgelehnt",
    seated: "Eingetroffen",
    completed: "Abgeschlossen",
    no_show: "Nicht erschienen",
  }[status];
}

export function AdminDashboard({ profile, getToken, userControl }: {
  profile: AdminProfile;
  getToken: () => Promise<string | null>;
  userControl: React.ReactNode;
}) {
  const today = useMemo(() => isoDate(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState<ViewMode>("day");
  const [data, setData] = useState<CalendarOverview | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  const range = useMemo(() => {
    const startDate = view === "week" ? mondayOf(selectedDate) : selectedDate;
    return { startDate, endDate: view === "week" ? addDays(startDate, 6) : startDate };
  }, [selectedDate, view]);

  const loadOverview = useCallback(async (signal?: AbortSignal) => {
    setState("loading");
    try {
      const token = await getToken();
      const params = new URLSearchParams(range);
      const response = await fetch(`/api/admin/calendar?${params}`, {
        headers: token ? { authorization: `Bearer ${token}` } : undefined,
        signal,
      });
      if (!response.ok) throw new Error("Calendar overview request failed");
      setData(await response.json() as CalendarOverview);
      setState("ready");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setState("error");
    }
  }, [getToken, range]);

  useEffect(() => {
    const controller = new AbortController();
    void loadOverview(controller.signal);
    return () => controller.abort();
  }, [loadOverview]);

  const visibleDates = useMemo(() => view === "week"
    ? Array.from({ length: 7 }, (_, index) => addDays(range.startDate, index))
    : [range.startDate], [range.startDate, view]);
  const activeReservations = data?.reservations.filter(({ status }) => !["cancelled", "declined", "no_show"].includes(status)) ?? [];
  const guestCount = activeReservations.reduce((sum, reservation) => sum + reservation.partySize, 0);
  const needsAttention = data?.reservations.filter(({ status }) => status === "requested" || status === "pending").length ?? 0;
  const openInquiries = data?.inquiries.filter(({ status }) => status === "new" || status === "in_review").length ?? 0;

  return (
    <main className="admin-dashboard" id="main-content">
      <aside className="admin-sidebar" aria-label="Admin-Navigation">
        <div>
          <p className="admin-wordmark">Colosseo</p>
          <p className="admin-sidebar-caption">Administration</p>
        </div>
        <nav aria-label="Verwaltungsbereiche">
          <a href="#overview" aria-current="page"><CalendarBlank aria-hidden="true" /> Übersicht</a>
          <a href="#schedule"><CalendarDots aria-hidden="true" /> Kalender</a>
          <a href="#inquiries"><Confetti aria-hidden="true" /> Anfragen</a>
        </nav>
        <a className="admin-site-link" href="/de">Zur Website</a>
      </aside>

      <section className="admin-workspace">
        <header className="admin-dashboard-header" id="overview">
          <div>
            <p className="admin-kicker">Betriebsübersicht</p>
            <h1>Guten Tag, {profile.displayName}.</h1>
            <p>{view === "day" ? dateFormatter.format(parseIsoDate(range.startDate)) : `${compactDateFormatter.format(parseIsoDate(range.startDate))} – ${compactDateFormatter.format(parseIsoDate(range.endDate))}`}</p>
          </div>
          <div className="admin-user-control">{userControl}</div>
        </header>

        <div className="admin-toolbar" aria-label="Kalenderzeitraum">
          <div className="admin-view-switch" role="group" aria-label="Ansicht wählen">
            <button type="button" aria-pressed={view === "day"} onClick={() => setView("day")}>Tag</button>
            <button type="button" aria-pressed={view === "week"} onClick={() => setView("week")}>Woche</button>
          </div>
          <label>Datum <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value || today)} /></label>
          <button className="admin-text-button" type="button" onClick={() => setSelectedDate(today)}>Heute</button>
        </div>

        <section className="admin-metrics" aria-label="Kennzahlen im gewählten Zeitraum" aria-busy={state === "loading"}>
          <article><CalendarBlank aria-hidden="true" /><span>Reservierungen</span><strong>{state === "ready" ? activeReservations.length : "–"}</strong></article>
          <article><UsersThree aria-hidden="true" /><span>Erwartete Gäste</span><strong>{state === "ready" ? guestCount : "–"}</strong></article>
          <article><CalendarDots aria-hidden="true" /><span>Zu prüfen</span><strong>{state === "ready" ? needsAttention : "–"}</strong></article>
          <article><Confetti aria-hidden="true" /><span>Offene Anfragen</span><strong>{state === "ready" ? openInquiries : "–"}</strong></article>
        </section>

        {state === "error" ? (
          <div className="admin-notice" role="alert"><h2>Die Übersicht konnte nicht geladen werden.</h2><p>Prüfe die Verbindung und versuche es erneut.</p><button type="button" onClick={() => void loadOverview()}>Erneut laden</button></div>
        ) : null}

        <section className="admin-schedule" id="schedule" aria-labelledby="schedule-title" aria-busy={state === "loading"}>
          <div className="admin-section-heading"><div><p className="admin-kicker">Tagesablauf</p><h2 id="schedule-title">Reservierungen und Sperrzeiten</h2></div><p>{data?.specialDays.length ? `${data.specialDays.length} Sonderregelung(en)` : "Regulärer Betrieb"}</p></div>
          {state === "loading" ? <p className="admin-empty" role="status">Kalender wird geladen …</p> : null}
          {state === "ready" && activeReservations.length === 0 && (data?.blocks.length ?? 0) === 0 ? <p className="admin-empty">Für diesen Zeitraum sind keine Reservierungen oder Sperrzeiten eingetragen.</p> : null}
          {state === "ready" ? visibleDates.map((date) => {
            const reservations = activeReservations.filter((reservation) => reservation.date === date);
            const blocks = data?.blocks.filter((block) => block.date === date) ?? [];
            if (view === "week" && reservations.length === 0 && blocks.length === 0) return null;
            return <div className="admin-day" key={date}>
              <h3><time dateTime={date}>{dateFormatter.format(parseIsoDate(date))}</time></h3>
              <div className="admin-agenda-list">
                {reservations.map((reservation) => <article className="admin-agenda-item" key={reservation.publicId}>
                  <time dateTime={`${reservation.date}T${reservation.startTime}`}>{reservation.startTime}</time>
                  <div><strong>{reservation.guest.name}</strong><span>{reservation.partySize} Personen · bis {reservation.endTime} Uhr</span></div>
                  <span className={`admin-status admin-status-${reservation.status}`}>{statusLabel(reservation.status)}</span>
                </article>)}
                {blocks.map((block) => <article className="admin-agenda-item admin-agenda-block" key={block.blockId}>
                  <time>{block.startTime}</time><div><strong>Gesperrt</strong><span>{block.reason || "Reservierungssperre"} · bis {block.endTime} Uhr</span></div><span className="admin-status">Block</span>
                </article>)}
              </div>
            </div>;
          }) : null}
        </section>

        <section className="admin-inquiry-preview" id="inquiries" aria-labelledby="inquiry-title">
          <div className="admin-section-heading"><div><p className="admin-kicker">Veranstaltungen</p><h2 id="inquiry-title">Offene Anfragen</h2></div></div>
          {state === "ready" && openInquiries === 0 ? <p className="admin-empty">Momentan warten keine Veranstaltungsanfragen auf Bearbeitung.</p> : null}
          {state === "ready" ? data?.inquiries.filter(({ status }) => status === "new" || status === "in_review").slice(0, 3).map((inquiry) => <article className="admin-inquiry-row" key={inquiry.inquiryId}>
            <div><strong>{inquiry.name}</strong><span>{inquiry.eventType} · {inquiry.partySize} Personen</span></div>
            <time dateTime={inquiry.requestedDate}>{compactDateFormatter.format(parseIsoDate(inquiry.requestedDate))}</time>
          </article>) : null}
        </section>
      </section>
    </main>
  );
}
