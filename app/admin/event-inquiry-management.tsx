import { ArrowClockwise, EnvelopeSimple, MagnifyingGlass, Phone, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

type InquiryStatus = "new" | "in_review" | "accepted" | "declined" | "closed";

type EventInquiry = {
  inquiryId: string;
  requestedDate: string;
  partySize: number;
  eventType: string;
  status: InquiryStatus;
  name: string;
  email: string;
  phone?: string;
  message: string;
  internalNote?: string;
  createdAt?: string;
};

const statusOptions: Array<{ value: "" | InquiryStatus; label: string }> = [
  { value: "", label: "Alle Status" },
  { value: "new", label: "Neu" },
  { value: "in_review", label: "In Bearbeitung" },
  { value: "accepted", label: "Angenommen" },
  { value: "declined", label: "Abgelehnt" },
  { value: "closed", label: "Abgeschlossen" },
];

const dateFormatter = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T12:00:00`));
}

function statusLabel(value: InquiryStatus): string {
  return statusOptions.find(({ value: option }) => option === value)?.label ?? value;
}

async function adminFetch<T>(url: string, token: string | null, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...(init?.body ? { "content-type": "application/json" } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { code?: string } } | null;
    throw new Error(body?.error?.code ?? "REQUEST_FAILED");
  }
  return response.json() as Promise<T>;
}

export function EventInquiryManagement({ getToken }: { getToken: () => Promise<string | null> }) {
  const [inquiries, setInquiries] = useState<EventInquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"" | InquiryStatus>("");
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [detailState, setDetailState] = useState<"idle" | "loading" | "ready" | "saving" | "error">("idle");
  const [selected, setSelected] = useState<EventInquiry | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<InquiryStatus>("new");
  const [internalNote, setInternalNote] = useState("");
  const [message, setMessage] = useState("");
  const detailRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const loadInquiries = useCallback(async (filters: { query: string; status: "" | InquiryStatus }, requestedPage = 1) => {
    setState("loading");
    try {
      const token = await getToken();
      const params = new URLSearchParams({ page: String(requestedPage), pageSize: "25" });
      if (filters.query.trim()) params.set("q", filters.query.trim());
      if (filters.status) params.set("status", filters.status);
      const result = await adminFetch<{ inquiries: EventInquiry[]; total: number; page: number; pageCount: number }>(`/api/admin/event-inquiries?${params}`, token);
      setInquiries(result.inquiries);
      setTotal(result.total);
      setPage(result.page);
      setPageCount(Math.max(1, result.pageCount));
      setState("ready");
    } catch {
      setState("error");
    }
  }, [getToken]);

  useEffect(() => { void loadInquiries({ query: "", status: "" }); }, [loadInquiries]);

  const closeDetail = useCallback(() => {
    setDetailState("idle");
    setSelected(null);
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
      const focusable = [...panel.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]')];
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

  const openInquiry = async (inquiryId: string) => {
    setDetailState("loading");
    setMessage("");
    try {
      const token = await getToken();
      const result = await adminFetch<{ inquiry: EventInquiry }>(`/api/admin/event-inquiries/${inquiryId}`, token);
      setSelected(result.inquiry);
      setSelectedStatus(result.inquiry.status);
      setInternalNote(result.inquiry.internalNote ?? "");
      setDetailState("ready");
    } catch {
      setDetailState("error");
    }
  };

  const refreshSelected = async (inquiryId: string) => {
    const token = await getToken();
    const result = await adminFetch<{ inquiry: EventInquiry }>(`/api/admin/event-inquiries/${inquiryId}`, token);
    setSelected(result.inquiry);
    setSelectedStatus(result.inquiry.status);
    setInternalNote(result.inquiry.internalNote ?? "");
    setInquiries((current) => current.map((inquiry) => inquiry.inquiryId === inquiryId ? result.inquiry : inquiry));
  };

  const saveStatus = async () => {
    if (!selected) return;
    setDetailState("saving");
    setMessage("");
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/event-inquiries/${selected.inquiryId}/status`, token, { method: "PATCH", body: JSON.stringify({ status: selectedStatus }) });
      await refreshSelected(selected.inquiryId);
      await loadInquiries({ query, status }, page);
      setMessage("Der Bearbeitungsstatus wurde aktualisiert.");
      setDetailState("ready");
    } catch {
      setMessage("Der Status konnte nicht gespeichert werden.");
      setDetailState("ready");
    }
  };

  const saveNote = async () => {
    if (!selected) return;
    setDetailState("saving");
    setMessage("");
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/event-inquiries/${selected.inquiryId}/note`, token, { method: "PATCH", body: JSON.stringify({ internalNote }) });
      await refreshSelected(selected.inquiryId);
      setMessage("Die interne Notiz wurde gespeichert.");
      setDetailState("ready");
    } catch {
      setMessage("Die interne Notiz konnte nicht gespeichert werden.");
      setDetailState("ready");
    }
  };

  const resetFilters = () => {
    setQuery("");
    setStatus("");
    void loadInquiries({ query: "", status: "" });
  };

  return (
    <section className="admin-inquiries" id="inquiries" aria-labelledby="inquiries-title">
      <div className="admin-section-heading"><div><p className="admin-kicker">Veranstaltungen</p><h2 id="inquiries-title">Anfragen bearbeiten</h2></div><p>{total} {total === 1 ? "Anfrage" : "Anfragen"}</p></div>

      <form className="admin-inquiry-filters" role="search" onSubmit={(event) => { event.preventDefault(); void loadInquiries({ query, status }); }}>
        <label><span>Name, Kontakt oder Anlass</span><div className="admin-search-input"><MagnifyingGlass aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} /></div></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as "" | InquiryStatus)}>{statusOptions.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}</select></label>
        <button className="admin-filter-submit" type="submit">Filtern</button>
        <button className="admin-filter-reset" type="button" onClick={resetFilters}><ArrowClockwise aria-hidden="true" /> Zurücksetzen</button>
      </form>

      {state === "loading" ? <p className="admin-empty" role="status">Veranstaltungsanfragen werden geladen …</p> : null}
      {state === "error" ? <div className="admin-notice" role="alert"><h3>Laden nicht möglich</h3><p>Die Anfragen konnten nicht abgerufen werden.</p><button type="button" onClick={() => void loadInquiries({ query, status }, page)}>Erneut laden</button></div> : null}
      {state === "ready" && inquiries.length === 0 ? <p className="admin-empty">Für diese Auswahl wurden keine Veranstaltungsanfragen gefunden.</p> : null}

      {state === "ready" && inquiries.length > 0 ? <div className="admin-reservation-table-wrap">
        <table className="admin-reservation-table admin-inquiry-table">
          <thead><tr><th>Status</th><th>Wunschtermin</th><th>Kontakt</th><th>Anlass</th><th>Gäste</th><th><span className="admin-visually-hidden">Aktion</span></th></tr></thead>
          <tbody>{inquiries.map((inquiry) => <tr key={inquiry.inquiryId}>
            <td><span className={`admin-status admin-inquiry-status-${inquiry.status}`}>{statusLabel(inquiry.status)}</span></td>
            <td><time dateTime={inquiry.requestedDate}>{formatDate(inquiry.requestedDate)}</time></td>
            <td><strong>{inquiry.name}</strong><span>{inquiry.email}</span></td>
            <td>{inquiry.eventType}</td>
            <td>{inquiry.partySize}</td>
            <td><button type="button" onClick={(event) => { triggerRef.current = event.currentTarget; void openInquiry(inquiry.inquiryId); }}>Öffnen</button></td>
          </tr>)}</tbody>
        </table>
      </div> : null}
      {state === "ready" && pageCount > 1 ? <nav className="admin-pagination" aria-label="Seiten der Veranstaltungsanfragen"><button type="button" disabled={page <= 1} onClick={() => void loadInquiries({ query, status }, page - 1)}>Zurück</button><span>Seite {page} von {pageCount}</span><button type="button" disabled={page >= pageCount} onClick={() => void loadInquiries({ query, status }, page + 1)}>Weiter</button></nav> : null}

      {detailState !== "idle" ? <div className="admin-detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDetail(); }}>
        <section className="admin-detail" ref={detailRef} role="dialog" aria-modal="true" aria-labelledby="inquiry-detail-title" aria-busy={detailState === "loading" || detailState === "saving"}>
          <button className="admin-detail-close" type="button" aria-label="Detailansicht schließen" onClick={closeDetail}><X aria-hidden="true" /></button>
          {detailState === "loading" ? <p className="admin-empty" role="status">Anfrage wird geladen …</p> : null}
          {detailState === "error" ? <div className="admin-notice" role="alert"><h2 id="inquiry-detail-title">Anfrage nicht verfügbar</h2><p>Die Details konnten nicht geladen werden.</p></div> : null}
          {selected && (detailState === "ready" || detailState === "saving") ? <>
            <p className="admin-kicker">{statusLabel(selected.status)} · {selected.inquiryId}</p>
            <h2 id="inquiry-detail-title">{selected.eventType} von {selected.name}</h2>
            <dl className="admin-detail-facts">
              <div><dt>Wunschtermin</dt><dd>{formatDate(selected.requestedDate)}</dd></div>
              <div><dt>Personen</dt><dd>{selected.partySize}</dd></div>
              <div><dt>E-Mail</dt><dd><a href={`mailto:${selected.email}`}><EnvelopeSimple aria-hidden="true" /> {selected.email}</a></dd></div>
              <div><dt>Telefon</dt><dd>{selected.phone ? <a href={`tel:${selected.phone}`}><Phone aria-hidden="true" /> {selected.phone}</a> : "Nicht angegeben"}</dd></div>
            </dl>
            <section className="admin-detail-section"><h3>Nachricht des Gastes</h3><p className="admin-inquiry-message">{selected.message}</p></section>
            <fieldset className="admin-detail-section"><legend>Bearbeitungsstatus</legend><div className="admin-detail-edit-row"><label><span>Status</span><select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value as InquiryStatus)}>{statusOptions.filter((option) => option.value).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><button className="admin-save-button" type="button" disabled={detailState === "saving" || selectedStatus === selected.status} onClick={() => void saveStatus()}>Status speichern</button></div></fieldset>
            <section className="admin-detail-section"><h3>Interne Notiz</h3><p>Nur für freigeschaltete Admins sichtbar.</p><label className="admin-note-field"><span>Notiz</span><textarea maxLength={2000} rows={7} value={internalNote} onChange={(event) => setInternalNote(event.target.value)} /></label><button className="admin-save-button" type="button" disabled={detailState === "saving" || internalNote === (selected.internalNote ?? "")} onClick={() => void saveNote()}>Notiz speichern</button></section>
            <p className="admin-save-message" aria-live="polite">{message}</p>
          </> : null}
        </section>
      </div> : null}
    </section>
  );
}
