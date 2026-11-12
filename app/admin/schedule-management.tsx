import { CalendarCheck, Clock, LockKey, Plus, Trash } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type SpecialDay = {
  date: string;
  label: string;
  closed: boolean;
  opens?: string;
  closes?: string;
};

type ServicePeriod = {
  key: string;
  weekday: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

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
const weekdayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

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
  const [servicePeriods, setServicePeriods] = useState<ServicePeriod[]>([]);
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [blocks, setBlocks] = useState<ReservationBlock[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [specialState, setSpecialState] = useState<"idle" | "saving">("idle");
  const [periodState, setPeriodState] = useState<"idle" | "saving">("idle");
  const [blockState, setBlockState] = useState<"idle" | "saving">("idle");
  const [specialMessage, setSpecialMessage] = useState("");
  const [periodMessage, setPeriodMessage] = useState("");
  const [periodKey, setPeriodKey] = useState("");
  const [periodWeekday, setPeriodWeekday] = useState(2);
  const [periodStart, setPeriodStart] = useState("17:00");
  const [periodEnd, setPeriodEnd] = useState("21:00");
  const [periodActive, setPeriodActive] = useState(true);
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
        adminFetch<{ regular: ServicePeriod[] }>("/api/admin/opening-hours", token),
        adminFetch<{ specialDays: SpecialDay[] }>("/api/admin/special-days", token),
        adminFetch<{ blocks: ReservationBlock[] }>("/api/admin/reservation-blocks", token),
        adminFetch<{ tables: RestaurantTable[] }>("/api/admin/tables", token),
      ]);
      if (periodResult.status === "rejected") throw periodResult.reason;
      setServicePeriods(periodResult.value.regular);
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

  const resetPeriod = () => {
    setPeriodKey("");
    setPeriodWeekday(2);
    setPeriodStart("17:00");
    setPeriodEnd("21:00");
    setPeriodActive(true);
  };

  const editPeriod = (period: ServicePeriod) => {
    setPeriodKey(period.key);
    setPeriodWeekday(period.weekday);
    setPeriodStart(period.startTime);
    setPeriodEnd(period.endTime);
    setPeriodActive(period.active);
    setPeriodMessage("");
  };

  const savePeriod = async (event: React.FormEvent) => {
    event.preventDefault();
    setPeriodState("saving");
    setPeriodMessage("");
    try {
      const token = await getToken();
      const key = periodKey || `period_${periodWeekday}_${periodStart.replace(":", "")}_${crypto.randomUUID().slice(0, 8)}`;
      await adminFetch(`/api/admin/opening-hours/${encodeURIComponent(key)}`, token, {
        method: "PUT",
        body: JSON.stringify({ weekday: periodWeekday, startTime: periodStart, endTime: periodEnd, active: periodActive }),
      });
      await loadData();
      resetPeriod();
      setPeriodMessage("Die reguläre Servicezeit wurde gespeichert.");
    } catch {
      setPeriodMessage("Die Servicezeit konnte nicht gespeichert werden. Prüfe Wochentag und Zeitraum.");
    } finally {
      setPeriodState("idle");
    }
  };

  const deletePeriod = async (period: ServicePeriod) => {
    if (!window.confirm(`${weekdayNames[period.weekday]}, ${period.startTime}–${period.endTime} Uhr wirklich entfernen?`)) return;
    setPeriodMessage("");
    try {
      const token = await getToken();
      await adminFetch(`/api/admin/opening-hours/${encodeURIComponent(period.key)}`, token, { method: "DELETE" });
      if (period.key === periodKey) resetPeriod();
      await loadData();
      setPeriodMessage("Die reguläre Servicezeit wurde entfernt.");
    } catch {
      setPeriodMessage("Die Servicezeit konnte nicht entfernt werden.");
    }
  };

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
      <div className="admin-section-heading"><div><p className="admin-kicker">Betrieb</p><h2 id="availability-title">Öffnungszeiten und Ausnahmen</h2></div><p>Regulärer Betrieb und Abweichungen</p></div>
      <p className="admin-section-intro">Reguläre Servicezeiten bestimmen die wöchentlich reservierbaren Zeiträume. Sondertage und Sperrzeiten überschreiben oder begrenzen einzelne Termine.</p>

      {state === "loading" ? <p className="admin-empty" role="status">Betriebsregeln werden geladen …</p> : null}
      {state === "error" ? <div className="admin-notice" role="alert"><h3>Laden nicht möglich</h3><p>Die Sonderregeln konnten nicht abgerufen werden.</p><button type="button" onClick={() => void loadData()}>Erneut laden</button></div> : null}

      {state === "ready" ? <div className="admin-operation-grid">
        <article className="admin-operation-card admin-operation-card-wide">
          <div className="admin-operation-title"><Clock aria-hidden="true" /><div><h3>Reguläre Servicezeiten</h3><p>Wiederkehrende Zeitfenster nach Wochentag verwalten.</p></div></div>
          <form className="admin-operation-form admin-period-form" onSubmit={savePeriod}>
            <label><span>Wochentag</span><select value={periodWeekday} onChange={(event) => setPeriodWeekday(Number(event.target.value))}>{weekdayNames.map((name, weekday) => <option key={name} value={weekday}>{name}</option>)}</select></label>
            <div className="admin-time-row"><label><span>Von</span><input type="time" required value={periodStart} onChange={(event) => setPeriodStart(event.target.value)} /></label><label><span>Bis</span><input type="time" required value={periodEnd} onChange={(event) => setPeriodEnd(event.target.value)} /></label></div>
            <label className="admin-check"><input type="checkbox" checked={periodActive} onChange={(event) => setPeriodActive(event.target.checked)} /> Für Reservierungen aktiv</label>
            <div className="admin-period-actions"><button className="admin-save-button" disabled={periodState === "saving"} type="submit">{periodState === "saving" ? "Wird gespeichert …" : periodKey ? "Änderung speichern" : "Servicezeit hinzufügen"}</button>{periodKey ? <button className="admin-text-button" type="button" onClick={resetPeriod}><Plus aria-hidden="true" /> Neue Servicezeit</button> : null}</div>
          </form>
          <p className="admin-form-message" aria-live="polite">{periodMessage}</p>
          <div className="admin-operation-list admin-period-list" aria-label="Reguläre Servicezeiten">
            {servicePeriods.length === 0 ? <p className="admin-compact-empty">Keine regulären Servicezeiten eingetragen.</p> : servicePeriods.map((period) => <div key={period.key}><button className="admin-period-edit" type="button" aria-label={`${weekdayNames[period.weekday]}, ${period.startTime} bis ${period.endTime} Uhr bearbeiten`} onClick={() => editPeriod(period)}><strong>{weekdayNames[period.weekday]}</strong><span>{period.startTime}–{period.endTime} Uhr · {period.active ? "Aktiv" : "Inaktiv"}</span></button><button type="button" aria-label={`${weekdayNames[period.weekday]}, ${period.startTime} bis ${period.endTime} Uhr entfernen`} onClick={() => void deletePeriod(period)}><Trash aria-hidden="true" /></button></div>)}
          </div>
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
