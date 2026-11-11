import { ArrowClockwise, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

type ReservationStatus = "requested" | "pending" | "confirmed" | "cancelled" | "declined" | "seated" | "completed" | "no_show";

type Reservation = {
  publicId: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
  locale: "de" | "en" | "it";
  status: ReservationStatus;
  source: "public" | "admin";
  guest: { name: string; email?: string; phone?: string };
  tableKeys?: string[];
  createdAt?: string;
};

type AuditEvent = {
  eventId: string;
  action: string;
  actorId?: string;
  metadata: { from?: string; status?: string; tableKeys?: string[] };
  createdAt: string;
};

type RestaurantTable = {
  key: string;
  name: string;
  areaKey: string;
  minPartySize: number;
  maxPartySize: number;
  combinationGroupKey?: string | null;
};

const statuses: Array<{ value: "" | ReservationStatus; label: string }> = [
  { value: "", label: "Alle Status" },
  { value: "requested", label: "Angefragt" },
  { value: "pending", label: "In Prüfung" },
  { value: "confirmed", label: "Bestätigt" },
  { value: "cancelled", label: "Storniert" },
  { value: "declined", label: "Abgelehnt" },
  { value: "seated", label: "Eingetroffen" },
  { value: "completed", label: "Abgeschlossen" },
  { value: "no_show", label: "Nicht erschienen" },
];

const allowedTransitions: Record<ReservationStatus, ReservationStatus[]> = {
  requested: ["confirmed", "declined", "cancelled"],
  pending: ["confirmed", "declined", "cancelled"],
  confirmed: ["seated", "cancelled", "completed", "no_show"],
  seated: ["completed", "no_show"],
  declined: [],
  cancelled: [],
  completed: [],
  no_show: [],
};

function labelForStatus(value: ReservationStatus): string {
  return statuses.find(({ value: status }) => status === value)?.label ?? value;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}

async function adminFetch<T>(url: string, token: string | null, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...(init?.body ? { "content-type": "application/json" } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { code?: string; message?: string } } | null;
    throw new Error(body?.error?.code ?? "REQUEST_FAILED");
  }
  return response.json() as Promise<T>;
}

export function ReservationManagement({ getToken }: { getToken: () => Promise<string | null> }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"" | ReservationStatus>("");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [history, setHistory] = useState<AuditEvent[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [detailState, setDetailState] = useState<"idle" | "loading" | "ready" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");
  const detailRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const loadReservations = useCallback(async (filters: { query: string; date: string; status: "" | ReservationStatus }, requestedPage = 1) => {
    setState("loading");
    try {
      const token = await getToken();
      const params = new URLSearchParams({ pageSize: "25", page: String(requestedPage) });
      if (filters.query.trim()) params.set("q", filters.query.trim());
      if (filters.date) params.set("date", filters.date);
      if (filters.status) params.set("status", filters.status);
      const result = await adminFetch<{ reservations: Reservation[]; total: number; page: number; pageCount: number }>(`/api/admin/reservations?${params}`, token);
      setReservations(result.reservations);
      setTotal(result.total);
      setPage(result.page);
      setPageCount(Math.max(1, result.pageCount));
      setState("ready");
    } catch {
      setState("error");
    }
  }, [getToken]);

  useEffect(() => { void loadReservations({ query: "", date: "", status: "" }); }, [loadReservations]);

  const closeDetail = useCallback(() => {
    setDetailState("idle");
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (detailState === "idle") return;
    const panel = detailRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDetail();
      if (event.key !== "Tab" || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]')];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeDetail, detailState]);

  const openReservation = async (publicId: string) => {
    setDetailState("loading");
    setMessage("");
    try {
      const token = await getToken();
      const [detail, eventResult, tableResult] = await Promise.all([
        adminFetch<{ reservation: Reservation }>(`/api/admin/reservations/${publicId}`, token),
        adminFetch<{ events: AuditEvent[] }>(`/api/admin/reservations/${publicId}/history`, token),
        adminFetch<{ tables: RestaurantTable[] }>("/api/admin/tables", token),
      ]);
      setSelected(detail.reservation);
      setSelectedTables(detail.reservation.tableKeys ?? []);
      setHistory(eventResult.events);
      setTables(tableResult.tables);
      setDetailState("ready");
    } catch {
      setSelected(null);
      setDetailState("error");
    }
  };

  const updateStatus = async (nextStatus: ReservationStatus) => {
    if (!selected) return;
    setDetailState("saving");
    setMessage("");
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/reservations/${selected.publicId}/status`, token, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      await Promise.all([openReservation(selected.publicId), loadReservations({ query, date, status }, page)]);
      setMessage("Der Reservierungsstatus wurde aktualisiert.");
    } catch (error) {
      setDetailState("ready");
      setMessage(error instanceof Error && error.message === "INVALID_STATUS_TRANSITION" ? "Dieser Statuswechsel ist nicht mehr zulässig." : "Der Status konnte nicht gespeichert werden.");
    }
  };

  const saveTables = async () => {
    if (!selected || selectedTables.length === 0) return;
    setDetailState("saving");
    setMessage("");
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/reservations/${selected.publicId}/tables`, token, { method: "PATCH", body: JSON.stringify({ tableKeys: selectedTables }) });
      await openReservation(selected.publicId);
      setMessage("Die Tischzuweisung wurde sicher aktualisiert.");
    } catch (error) {
      setDetailState("ready");
      const code = error instanceof Error ? error.message : "";
      setMessage(code === "TABLE_NOT_AVAILABLE" ? "Mindestens ein Tisch wurde zwischenzeitlich belegt." : "Diese Tischkombination ist für die Gruppengröße nicht zulässig.");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setDate("");
    setStatus("");
    void loadReservations({ query: "", date: "", status: "" });
  };

  return (
    <section className="admin-reservations" id="reservations" aria-labelledby="reservations-title">
      <div className="admin-section-heading"><div><p className="admin-kicker">Reservierungen</p><h2 id="reservations-title">Suchen und bearbeiten</h2></div><p>{total} {total === 1 ? "Eintrag" : "Einträge"}</p></div>

      <form className="admin-filterbar" role="search" onSubmit={(event) => { event.preventDefault(); void loadReservations({ query, date, status }); }}>
        <label><span>Gast, Kontakt oder Referenz</span><div className="admin-search-input"><MagnifyingGlass aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></div></label>
        <label><span>Datum</span><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as "" | ReservationStatus)}>{statuses.map((option) => <option value={option.value} key={option.value || "all"}>{option.label}</option>)}</select></label>
        <button className="admin-filter-submit" type="submit">Filtern</button>
        <button className="admin-filter-reset" type="button" onClick={resetFilters}><ArrowClockwise aria-hidden="true" /> Zurücksetzen</button>
      </form>

      {state === "loading" ? <p className="admin-empty" role="status">Reservierungen werden geladen …</p> : null}
      {state === "error" ? <div className="admin-notice" role="alert"><h3>Laden nicht möglich</h3><p>Die Reservierungsliste konnte nicht abgerufen werden.</p><button type="button" onClick={() => void loadReservations({ query, date, status })}>Erneut laden</button></div> : null}
      {state === "ready" && reservations.length === 0 ? <p className="admin-empty">Für diese Filter wurden keine Reservierungen gefunden.</p> : null}
      {state === "ready" && reservations.length > 0 ? <div className="admin-reservation-table-wrap"><table className="admin-reservation-table">
        <thead><tr><th>Datum</th><th>Zeit</th><th>Gast</th><th>Personen</th><th>Status</th><th><span className="admin-visually-hidden">Aktion</span></th></tr></thead>
        <tbody>{reservations.map((reservation) => <tr key={reservation.publicId}>
          <td>{formatDate(reservation.date)}</td><td>{reservation.startTime}</td><td><strong>{reservation.guest.name}</strong><span>{reservation.publicId}</span></td><td>{reservation.partySize}</td><td><span className={`admin-status admin-status-${reservation.status}`}>{labelForStatus(reservation.status)}</span></td><td><button type="button" onClick={(event) => { triggerRef.current = event.currentTarget; void openReservation(reservation.publicId); }}>Öffnen</button></td>
        </tr>)}</tbody>
      </table></div> : null}
      {state === "ready" && pageCount > 1 ? <nav className="admin-pagination" aria-label="Reservierungsseiten"><button type="button" disabled={page <= 1} onClick={() => void loadReservations({ query, date, status }, page - 1)}>Zurück</button><span>Seite {page} von {pageCount}</span><button type="button" disabled={page >= pageCount} onClick={() => void loadReservations({ query, date, status }, page + 1)}>Weiter</button></nav> : null}

      {detailState !== "idle" ? <div className="admin-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDetail(); }}>
        <aside className="admin-detail" ref={detailRef} role="dialog" aria-modal="true" aria-labelledby="reservation-detail-title">
          <button className="admin-detail-close" type="button" aria-label="Detailansicht schließen" onClick={closeDetail}><X aria-hidden="true" /></button>
          {detailState === "loading" ? <p role="status">Details werden geladen …</p> : null}
          {detailState === "error" ? <div className="admin-notice" role="alert"><h3>Details nicht verfügbar</h3><button type="button" onClick={closeDetail}>Schließen</button></div> : null}
          {selected && (detailState === "ready" || detailState === "saving") ? <>
            <p className="admin-kicker">{selected.publicId}</p><h2 id="reservation-detail-title">{selected.guest.name}</h2>
            <dl className="admin-detail-facts"><div><dt>Termin</dt><dd>{formatDate(selected.date)}, {selected.startTime}–{selected.endTime} Uhr</dd></div><div><dt>Personen</dt><dd>{selected.partySize}</dd></div><div><dt>E-Mail</dt><dd>{selected.guest.email ? <a href={`mailto:${selected.guest.email}`}>{selected.guest.email}</a> : "Nicht angegeben"}</dd></div><div><dt>Telefon</dt><dd>{selected.guest.phone ? <a href={`tel:${selected.guest.phone}`}>{selected.guest.phone}</a> : "Nicht angegeben"}</dd></div></dl>

            <section className="admin-detail-section"><h3>Status</h3><p>Aktuell: <span className={`admin-status admin-status-${selected.status}`}>{labelForStatus(selected.status)}</span></p>{allowedTransitions[selected.status].length ? <div className="admin-detail-actions">{allowedTransitions[selected.status].map((nextStatus) => <button type="button" disabled={detailState === "saving"} onClick={() => void updateStatus(nextStatus)} key={nextStatus}>{labelForStatus(nextStatus)}</button>)}</div> : <p>Für diesen Endstatus sind keine weiteren Änderungen vorgesehen.</p>}</section>

            <fieldset className="admin-detail-section" disabled={detailState === "saving" || allowedTransitions[selected.status].length === 0}><legend>Tischzuweisung</legend><p>Eine Änderung wird atomar geprüft. Bei einer Überschneidung bleibt die bisherige Zuordnung erhalten.</p><div className="admin-table-options">{tables.map((table) => <label key={table.key}><input type="checkbox" checked={selectedTables.includes(table.key)} onChange={(event) => setSelectedTables((current) => event.target.checked ? [...current, table.key] : current.filter((key) => key !== table.key))} /><span><strong>{table.name}</strong><small>{table.minPartySize}–{table.maxPartySize} Plätze · {table.areaKey}</small></span></label>)}</div><button className="admin-save-button" type="button" disabled={selectedTables.length === 0 || detailState === "saving"} onClick={() => void saveTables()}>Tische speichern</button></fieldset>

            <section className="admin-detail-section"><h3>Verlauf</h3>{history.length ? <ol className="admin-history">{history.map((event) => <li key={event.eventId}><span>{event.action === "reservation.status_changed" ? `Status: ${event.metadata.status ? labelForStatus(event.metadata.status as ReservationStatus) : "geändert"}` : event.action === "reservation.tables_changed" ? `Tische: ${event.metadata.tableKeys?.join(", ")}` : event.action}</span><time dateTime={event.createdAt}>{new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(new Date(event.createdAt))}</time></li>)}</ol> : <p>Noch keine protokollierten Änderungen.</p>}</section>
            <p className="admin-save-message" aria-live="polite">{message}</p>
          </> : null}
        </aside>
      </div> : null}
    </section>
  );
}
