import { CalendarCheck, LockKey, Trash } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type SpecialDay = {
  date: string;
  label: string;
  closed: boolean;
  opens?: string;
  closes?: string;
};
type OpeningHour = { key: string; weekday: number; startTime: string; endTime: string; active: boolean };

type ReservationBlock = {
  blockId: string;
  date: string;
  startTime: string;
  endTime: string;
  scope: "restaurant" | "area" | "table";
  scopeKey?: string | null;
  reason: string;
};

type RestaurantTable = {
  key: string;
  name: string;
  areaKey: string;
};

type RequestError = Error & { code?: string };

const dateFormatter = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

function formatDate(value: string): string {
  return dateFormatter.format(new Date(`${value}T12:00:00`));
}

async function adminFetch<T>(url: string, token: string | null, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...(init?.body ? { "content-type": "application/json" } : {}), ...(token ? { authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: { code?: string; message?: string } } | null;
    const error = new Error(body?.error?.message ?? "Request failed") as RequestError;
    error.code = body?.error?.code;
    throw error;
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function scopeLabel(block: ReservationBlock, tables: RestaurantTable[]): string {
  if (block.scope === "restaurant") return "Gesamtes Restaurant";
  if (block.scope === "area") return `Bereich ${block.scopeKey ?? "–"}`;
  return tables.find(({ key }) => key === block.scopeKey)?.name ?? block.scopeKey ?? "Unbekannter Tisch";
}

export function ScheduleManagement({ getToken }: { getToken: () => Promise<string | null> }) {
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [blocks, setBlocks] = useState<ReservationBlock[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [specialState, setSpecialState] = useState<"idle" | "saving">("idle");
  const [blockState, setBlockState] = useState<"idle" | "saving">("idle");
  const [specialMessage, setSpecialMessage] = useState("");
  const [blockMessage, setBlockMessage] = useState("");
  const [specialDate, setSpecialDate] = useState("");
  const [specialLabel, setSpecialLabel] = useState("");
  const [specialType, setSpecialType] = useState<"closed" | "open">("closed");
  const [opens, setOpens] = useState("17:00");
  const [closes, setCloses] = useState("21:00");
  const [blockDate, setBlockDate] = useState("");
  const [blockStart, setBlockStart] = useState("17:00");
  const [blockEnd, setBlockEnd] = useState("19:00");
  const [blockScope, setBlockScope] = useState<ReservationBlock["scope"]>("restaurant");
  const [scopeKey, setScopeKey] = useState("");
  const [reason, setReason] = useState("");

  const areas = useMemo(() => [...new Set(tables.map(({ areaKey }) => areaKey))].sort(), [tables]);

  const loadData = useCallback(async () => {
    setState("loading");
    try {
      const token = await getToken();
      const [periodResult, dayResult, blockResult, tableResult] = await Promise.allSettled([
        adminFetch<{ regular: OpeningHour[] }>("/api/admin/opening-hours", token),
        adminFetch<{ specialDays: SpecialDay[] }>("/api/admin/special-days", token),
        adminFetch<{ blocks: ReservationBlock[] }>("/api/admin/reservation-blocks", token),
        adminFetch<{ tables: RestaurantTable[] }>("/api/admin/tables", token),
      ]);
      if (periodResult.status === "rejected") throw periodResult.reason;
      setOpeningHours(periodResult.value.regular);
      setSpecialDays(dayResult.status === "fulfilled" ? dayResult.value.specialDays : []);
      setBlocks(blockResult.status === "fulfilled" ? blockResult.value.blocks : []);
      setTables(tableResult.status === "fulfilled" ? tableResult.value.tables : []);
      setState("ready");
    } catch {
      setState("error");
    }
  }, [getToken]);

  useEffect(() => { void loadData(); }, [loadData]);

  useEffect(() => {
    if (blockScope === "restaurant") setScopeKey("");
    else if (blockScope === "area") setScopeKey(areas[0] ?? "");
    else setScopeKey(tables[0]?.key ?? "");
  }, [areas, blockScope, tables]);

  const saveSpecialDay = async (event: React.FormEvent) => {
    event.preventDefault();
    setSpecialState("saving");
    setSpecialMessage("");
    try {
      const token = await getToken();
      const body = specialType === "closed"
        ? { label: specialLabel, closed: true }
        : { label: specialLabel, closed: false, opens, closes };
      await adminFetch(`/api/admin/special-days/${specialDate}`, token, { method: "PUT", body: JSON.stringify(body) });
      setSpecialLabel("");
      await loadData();
      setSpecialMessage("Die datierte Sonderregel wurde gespeichert.");
    } catch {
      setSpecialMessage("Die Sonderregel konnte nicht gespeichert werden. Prüfe Datum und Uhrzeiten.");
    } finally {
      setSpecialState("idle");
    }
  };

  const deleteSpecialDay = async (date: string) => {
    setSpecialMessage("");
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/special-days/${date}`, token, { method: "DELETE" });
      await loadData();
      setSpecialMessage("Die Sonderregel wurde entfernt.");
    } catch {
      setSpecialMessage("Die Sonderregel konnte nicht entfernt werden.");
    }
  };

  const saveOpeningHour = async (hour: OpeningHour) => {
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/opening-hours/${encodeURIComponent(hour.key)}`, token, { method: "PUT", body: JSON.stringify(hour) });
      setSpecialMessage("Öffnungszeit gespeichert.");
      await loadData();
    } catch { setSpecialMessage("Die Öffnungszeit konnte nicht gespeichert werden."); }
  };

  const deleteOpeningHour = async (key: string) => {
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/opening-hours/${encodeURIComponent(key)}`, token, { method: "DELETE" });
      setSpecialMessage("Öffnungszeit entfernt.");
      await loadData();
    } catch { setSpecialMessage("Die Öffnungszeit konnte nicht entfernt werden."); }
  };

  const saveBlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setBlockState("saving");
    setBlockMessage("");
    try {
      const token = await getToken();
      await adminFetch("/api/admin/reservation-blocks", token, {
        method: "POST",
        body: JSON.stringify({ date: blockDate, startTime: blockStart, endTime: blockEnd, scope: blockScope, ...(blockScope === "restaurant" ? {} : { scopeKey }), reason }),
      });
      setReason("");
      await loadData();
      setBlockMessage("Die Sperrzeit wurde angelegt und blockiert neue Reservierungen.");
    } catch (error) {
      setBlockMessage((error as RequestError).code === "RESERVATION_CONFLICT"
        ? "Der Zeitraum überschneidet sich mit einer bestehenden Reservierung oder Sperre."
        : "Die Sperrzeit konnte nicht angelegt werden. Prüfe Zeitraum und Auswahl.");
    } finally {
      setBlockState("idle");
    }
  };

  const deleteBlock = async (blockId: string) => {
    setBlockMessage("");
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/reservation-blocks/${blockId}`, token, { method: "DELETE" });
      await loadData();
      setBlockMessage("Die Sperrzeit wurde aufgehoben.");
    } catch {
      setBlockMessage("Die Sperrzeit konnte nicht aufgehoben werden.");
    }
  };

  return (
    <section className="admin-availability" id="availability" aria-labelledby="availability-title" aria-busy={state === "loading"}>
      <div className="admin-section-heading"><div><p className="admin-kicker">Betrieb</p><h2 id="availability-title">Sondertage und Sperrzeiten</h2></div><p>Datierte Abweichungen</p></div>
      <p className="admin-section-intro">Schließtage und Sonderöffnungen ändern den Betrieb an einem Datum. Sperrzeiten blockieren zusätzlich ausgewählte Zeiten, Bereiche oder Tische.</p>

      {state === "loading" ? <p className="admin-empty" role="status">Betriebsregeln werden geladen …</p> : null}
      {state === "error" ? <div className="admin-notice" role="alert"><h3>Laden nicht möglich</h3><p>Die Sonderregeln konnten nicht abgerufen werden.</p><button type="button" onClick={() => void loadData()}>Erneut laden</button></div> : null}

      {state === "ready" ? <div className="admin-operation-grid">
        <article className="admin-operation-card">
          <div className="admin-operation-title"><CalendarCheck aria-hidden="true" /><div><h3>Reguläre Öffnungszeiten</h3><p>Wöchentliche Servicezeiten verwalten.</p></div></div>
          <div className="admin-operation-list" aria-label="Reguläre Öffnungszeiten">
            {openingHours.length === 0 ? <p className="admin-compact-empty">Keine Öffnungszeiten eingetragen.</p> : openingHours.map((hour) => <div key={hour.key}><div><strong>{["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][hour.weekday]}</strong><span>{hour.startTime}–{hour.endTime} Uhr{hour.active ? "" : " · inaktiv"}</span></div><button type="button" aria-label={`${hour.key} entfernen`} onClick={() => void deleteOpeningHour(hour.key)}><Trash aria-hidden="true" /></button></div>)}
          </div>
          <form className="admin-operation-form" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); void saveOpeningHour({ key: String(form.get("key")), weekday: Number(form.get("weekday")), startTime: String(form.get("startTime")), endTime: String(form.get("endTime")), active: true }); }}>
            <label><span>Schlüssel</span><input name="key" required pattern="[a-z0-9-]{1,80}" placeholder="z. B. fri-evening" /></label>
            <label><span>Wochentag</span><select name="weekday" defaultValue="5">{["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"].map((day, index) => <option key={day} value={index}>{day}</option>)}</select></label>
            <div className="admin-time-row"><label><span>Von</span><input name="startTime" type="time" required defaultValue="17:00" /></label><label><span>Bis</span><input name="endTime" type="time" required defaultValue="21:00" /></label></div>
            <button className="admin-save-button" type="submit">Öffnungszeit speichern</button>
          </form>
        </article>
        <article className="admin-operation-card">
          <div className="admin-operation-title"><CalendarCheck aria-hidden="true" /><div><h3>Sondertag</h3><p>Ganztägig schließen oder abweichend öffnen.</p></div></div>
          <form className="admin-operation-form" onSubmit={saveSpecialDay}>
            <label><span>Datum</span><input type="date" required value={specialDate} onChange={(event) => setSpecialDate(event.target.value)} /></label>
            <label><span>Bezeichnung</span><input type="text" required maxLength={160} placeholder="z. B. Betriebsferien" value={specialLabel} onChange={(event) => setSpecialLabel(event.target.value)} /></label>
            <fieldset><legend>Regel</legend><div className="admin-choice-row"><label><input type="radio" name="special-type" checked={specialType === "closed"} onChange={() => setSpecialType("closed")} /> Geschlossen</label><label><input type="radio" name="special-type" checked={specialType === "open"} onChange={() => setSpecialType("open")} /> Sonderöffnung</label></div></fieldset>
            {specialType === "open" ? <div className="admin-time-row"><label><span>Öffnet</span><input type="time" required value={opens} onChange={(event) => setOpens(event.target.value)} /></label><label><span>Schließt</span><input type="time" required value={closes} onChange={(event) => setCloses(event.target.value)} /></label></div> : null}
            <button className="admin-save-button" disabled={specialState === "saving"} type="submit">{specialState === "saving" ? "Wird gespeichert …" : "Sondertag speichern"}</button>
          </form>
          <p className="admin-form-message" aria-live="polite">{specialMessage}</p>
          <div className="admin-operation-list" aria-label="Gespeicherte Sondertage">
            {specialDays.length === 0 ? <p className="admin-compact-empty">Keine Sondertage eingetragen.</p> : specialDays.map((day) => <div key={day.date}><div><strong>{day.label}</strong><span>{formatDate(day.date)} · {day.closed ? "Geschlossen" : `${day.opens}–${day.closes} Uhr`}</span></div><button type="button" aria-label={`${day.label} am ${formatDate(day.date)} entfernen`} onClick={() => void deleteSpecialDay(day.date)}><Trash aria-hidden="true" /></button></div>)}
          </div>
        </article>

        <article className="admin-operation-card">
          <div className="admin-operation-title"><LockKey aria-hidden="true" /><div><h3>Sperrzeit</h3><p>Zeiträume atomar gegen neue Buchungen sperren.</p></div></div>
          <form className="admin-operation-form" onSubmit={saveBlock}>
            <label><span>Datum</span><input type="date" required value={blockDate} onChange={(event) => setBlockDate(event.target.value)} /></label>
            <div className="admin-time-row"><label><span>Von</span><input type="time" required value={blockStart} onChange={(event) => setBlockStart(event.target.value)} /></label><label><span>Bis</span><input type="time" required value={blockEnd} onChange={(event) => setBlockEnd(event.target.value)} /></label></div>
            <label><span>Geltungsbereich</span><select value={blockScope} onChange={(event) => setBlockScope(event.target.value as ReservationBlock["scope"])}><option value="restaurant">Gesamtes Restaurant</option><option value="area">Bereich</option><option value="table">Einzelner Tisch</option></select></label>
            {blockScope === "area" ? <label><span>Bereich</span><select required value={scopeKey} onChange={(event) => setScopeKey(event.target.value)}>{areas.map((area) => <option key={area} value={area}>{area}</option>)}</select></label> : null}
            {blockScope === "table" ? <label><span>Tisch</span><select required value={scopeKey} onChange={(event) => setScopeKey(event.target.value)}>{tables.map((table) => <option key={table.key} value={table.key}>{table.name} · {table.areaKey}</option>)}</select></label> : null}
            <label><span>Grund</span><input type="text" required minLength={2} maxLength={240} placeholder="z. B. Geschlossene Gesellschaft" value={reason} onChange={(event) => setReason(event.target.value)} /></label>
            <button className="admin-save-button" disabled={blockState === "saving"} type="submit">{blockState === "saving" ? "Wird gesperrt …" : "Sperrzeit anlegen"}</button>
          </form>
          <p className="admin-form-message" aria-live="polite">{blockMessage}</p>
          <div className="admin-operation-list" aria-label="Aktive Sperrzeiten">
            {blocks.length === 0 ? <p className="admin-compact-empty">Keine Sperrzeiten eingetragen.</p> : blocks.map((block) => <div key={block.blockId}><div><strong>{block.reason}</strong><span>{formatDate(block.date)} · {block.startTime}–{block.endTime} Uhr · {scopeLabel(block, tables)}</span></div><button type="button" aria-label={`${block.reason} am ${formatDate(block.date)} aufheben`} onClick={() => void deleteBlock(block.blockId)}><Trash aria-hidden="true" /></button></div>)}
          </div>
        </article>
      </div> : null}
    </section>
  );
}
