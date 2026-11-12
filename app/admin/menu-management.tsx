import { Eye, ImageSquare, Plus, Trash, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type MenuCategory = { slug: string; name: string; sortOrder: number; active: boolean };
type MenuItem = {
  itemId: string;
  categorySlug: string;
  name: string;
  description?: string;
  priceCents: number;
  allergens: string[];
  imageUrl?: string;
  sortOrder: number;
  active: boolean;
  published: boolean;
};
type PreviewCategory = MenuCategory & { items: MenuItem[] };
type ItemDraft = Omit<MenuItem, "priceCents" | "allergens"> & { price: string; allergens: string };

const emptyDraft = (categorySlug = ""): ItemDraft => ({
  itemId: "",
  categorySlug,
  name: "",
  description: "",
  price: "",
  allergens: "",
  imageUrl: undefined,
  sortOrder: 0,
  active: true,
  published: false,
});

function toDraft(item: MenuItem): ItemDraft {
  return { ...item, price: (item.priceCents / 100).toFixed(2).replace(".", ","), allergens: item.allergens.join(", ") };
}

function mediaId(url?: string): string | null {
  return url?.match(/\/api\/public\/media\/([a-f\d]{24})$/i)?.[1] ?? null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden."));
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.readAsDataURL(file);
  });
}

export function MenuManagement({ getToken }: { getToken: () => Promise<string | null> }) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [draft, setDraft] = useState<ItemDraft>(() => emptyDraft());
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewCategory[] | null>(null);
  const [categoryDraft, setCategoryDraft] = useState({ slug: "", name: "", sortOrder: 0 });
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const authenticatedFetch = useCallback(async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const token = await getToken();
    return fetch(input, { ...init, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}), ...init.headers } });
  }, [getToken]);

  const load = useCallback(async () => {
    setState("loading");
    try {
      const [categoryResponse, itemResponse] = await Promise.all([
        authenticatedFetch("/api/admin/menu/categories"),
        authenticatedFetch("/api/admin/menu/items"),
      ]);
      if (!categoryResponse.ok || !itemResponse.ok) throw new Error("Speisekarte konnte nicht geladen werden.");
      const categoryBody = await categoryResponse.json() as { categories: MenuCategory[] };
      const itemBody = await itemResponse.json() as { items: MenuItem[] };
      setCategories(categoryBody.categories);
      setItems(itemBody.items);
      setSelectedCategory((current) => current || categoryBody.categories[0]?.slug || "");
      setState("ready");
    } catch {
      setState("error");
    }
  }, [authenticatedFetch]);

  useEffect(() => { void load(); }, [load]);

  const filteredItems = useMemo(() => items.filter((item) => !selectedCategory || item.categorySlug === selectedCategory), [items, selectedCategory]);

  function selectItem(item?: MenuItem) {
    setDraft(item ? toDraft(item) : emptyDraft(selectedCategory || categories[0]?.slug));
    setMessage("");
  }

  async function saveCategory(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true); setMessage("");
    try {
      const response = await authenticatedFetch(`/api/admin/menu/categories/${encodeURIComponent(categoryDraft.slug.trim())}`, {
        method: "PUT", body: JSON.stringify({ name: categoryDraft.name.trim(), sortOrder: categoryDraft.sortOrder, active: true }),
      });
      if (!response.ok) throw new Error();
      setCategoryDraft({ slug: "", name: "", sortOrder: categories.length });
      setMessage("Kategorie gespeichert.");
      await load();
    } catch { setMessage("Kategorie konnte nicht gespeichert werden."); }
    finally { setBusy(false); }
  }

  async function saveItem(event?: React.FormEvent) {
    event?.preventDefault();
    const price = Number(draft.price.replace(",", "."));
    if (!draft.name.trim() || !draft.categorySlug || !Number.isFinite(price) || price < 0) {
      setMessage("Bitte Name, Kategorie und einen gültigen Preis eintragen.");
      return;
    }
    const itemId = draft.itemId || `dish_${crypto.randomUUID().replaceAll("-", "")}`;
    setBusy(true); setMessage("");
    try {
      const payload = {
        categorySlug: draft.categorySlug,
        name: draft.name.trim(),
        description: draft.description?.trim() || undefined,
        priceCents: Math.round(price * 100),
        allergens: draft.allergens.split(",").map((value) => value.trim()).filter(Boolean),
        imageUrl: draft.imageUrl || undefined,
        sortOrder: draft.sortOrder,
        active: draft.active,
        published: draft.published,
      };
      const response = await authenticatedFetch(`/api/admin/menu/items/${encodeURIComponent(itemId)}`, { method: "PUT", body: JSON.stringify(payload) });
      if (!response.ok) throw new Error();
      const body = await response.json() as { item: MenuItem };
      setDraft(toDraft(body.item));
      setMessage("Gericht gespeichert.");
      await load();
    } catch { setMessage("Gericht konnte nicht gespeichert werden."); }
    finally { setBusy(false); }
  }

  async function setPublication(item: MenuItem, published: boolean) {
    setBusy(true); setMessage("");
    try {
      const response = await authenticatedFetch(`/api/admin/menu/items/${encodeURIComponent(item.itemId)}/publication`, { method: "PATCH", body: JSON.stringify({ published }) });
      if (!response.ok) throw new Error();
      setMessage(published ? "Gericht veröffentlicht." : "Veröffentlichung zurückgenommen.");
      await load();
    } catch { setMessage("Veröffentlichungsstatus konnte nicht geändert werden."); }
    finally { setBusy(false); }
  }

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"].includes(file.type)) || file.size > 5 * 1024 * 1024) {
      setMessage("Bitte JPG, PNG oder WebP bis maximal 5 MB auswählen."); return;
    }
    const altText = window.prompt("Bitte beschreibe das Bild kurz für Screenreader:")?.trim();
    if (!altText) { setMessage("Für den Upload ist ein Alternativtext erforderlich."); return; }
    setBusy(true); setMessage("Bild wird hochgeladen …");
    try {
      const response = await authenticatedFetch("/api/admin/media", { method: "POST", body: JSON.stringify({ fileName: file.name, contentType: file.type, altText, dataBase64: await fileToBase64(file) }) });
      if (!response.ok) throw new Error();
      const body = await response.json() as { media: { url: string } };
      setDraft((current) => ({ ...current, imageUrl: body.media.url }));
      setMessage("Bild hochgeladen. Speichere jetzt das Gericht.");
    } catch { setMessage("Bild konnte nicht hochgeladen werden."); }
    finally { setBusy(false); }
  }

  async function removeImage() {
    const id = mediaId(draft.imageUrl);
    if (!id || !window.confirm("Bild dauerhaft aus der Medienablage löschen?")) return;
    setBusy(true); setMessage("");
    try {
      if (draft.itemId) {
        const price = Number(draft.price.replace(",", "."));
        const response = await authenticatedFetch(`/api/admin/menu/items/${encodeURIComponent(draft.itemId)}`, { method: "PUT", body: JSON.stringify({
          categorySlug: draft.categorySlug, name: draft.name.trim(), description: draft.description?.trim() || undefined,
          priceCents: Math.round(price * 100), allergens: draft.allergens.split(",").map((value) => value.trim()).filter(Boolean),
          sortOrder: draft.sortOrder, active: draft.active, published: draft.published,
        }) });
        if (!response.ok) throw new Error();
      }
      const response = await authenticatedFetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!response.ok && response.status !== 404) throw new Error();
      setDraft((current) => ({ ...current, imageUrl: undefined }));
      setMessage("Bild entfernt.");
      await load();
    } catch { setMessage("Bild konnte nicht sicher entfernt werden."); }
    finally { setBusy(false); }
  }

  async function openPreview() {
    lastFocused.current = document.activeElement as HTMLElement;
    setBusy(true); setMessage("");
    try {
      const response = await authenticatedFetch("/api/admin/menu/preview");
      if (!response.ok) throw new Error();
      setPreview((await response.json() as { categories: PreviewCategory[] }).categories);
      requestAnimationFrame(() => dialogRef.current?.showModal());
    } catch { setMessage("Vorschau konnte nicht geladen werden."); }
    finally { setBusy(false); }
  }

  function closePreview() {
    dialogRef.current?.close(); setPreview(null); lastFocused.current?.focus();
  }

  return (
    <section className="admin-menu" id="menu" aria-labelledby="menu-title" aria-busy={state === "loading" || busy}>
      <div className="admin-section-heading">
        <div><p className="admin-kicker">Inhalte</p><h2 id="menu-title">Speisekarte verwalten</h2></div>
        <button className="admin-preview-button" type="button" onClick={() => void openPreview()} disabled={busy || state !== "ready"}><Eye aria-hidden="true" /> Vorschau</button>
      </div>
      {state === "loading" ? <p className="admin-empty" role="status">Speisekarte wird geladen …</p> : null}
      {state === "error" ? <div className="admin-notice" role="alert"><h3>Laden fehlgeschlagen</h3><button type="button" onClick={() => void load()}>Erneut laden</button></div> : null}
      {state === "ready" ? <div className="admin-menu-layout">
        <aside className="admin-menu-index" aria-label="Kategorien und Gerichte">
          <label>Kategorie<select value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setDraft(emptyDraft(event.target.value)); }}>
            <option value="">Alle Kategorien</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}{category.active ? "" : " (inaktiv)"}</option>)}
          </select></label>
          <button className="admin-new-item" type="button" onClick={() => selectItem()}><Plus aria-hidden="true" /> Neues Gericht</button>
          <div className="admin-menu-items">{filteredItems.map((item) => <article key={item.itemId} className={draft.itemId === item.itemId ? "is-selected" : ""}>
            <button type="button" onClick={() => selectItem(item)}><span>{item.name}</span><small>{(item.priceCents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })} · {item.published ? "veröffentlicht" : "Entwurf"}</small></button>
            <button type="button" disabled={busy || !item.active} onClick={() => void setPublication(item, !item.published)}>{item.published ? "Zurückziehen" : "Veröffentlichen"}</button>
          </article>)}</div>
          <form className="admin-category-form" onSubmit={(event) => void saveCategory(event)}>
            <h3>Neue Kategorie</h3>
            <label>Technischer Schlüssel<input required maxLength={80} value={categoryDraft.slug} onChange={(event) => setCategoryDraft({ ...categoryDraft, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="z. B. antipasti" /></label>
            <label>Anzeigename<input required maxLength={160} value={categoryDraft.name} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: event.target.value })} /></label>
            <label>Reihenfolge<input type="number" min="0" max="10000" value={categoryDraft.sortOrder} onChange={(event) => setCategoryDraft({ ...categoryDraft, sortOrder: Number(event.target.value) })} /></label>
            <button type="submit" disabled={busy}>Kategorie speichern</button>
          </form>
        </aside>

        <form className="admin-menu-editor" onSubmit={(event) => void saveItem(event)}>
          <div className="admin-menu-editor-heading"><div><p className="admin-kicker">{draft.itemId ? "Gericht bearbeiten" : "Neues Gericht"}</p><h3>{draft.name || "Gericht anlegen"}</h3></div><span>{draft.published ? "Live" : "Entwurf"}</span></div>
          <div className="admin-menu-form-grid">
            <label className="admin-field-wide">Name<input required maxLength={160} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label>Kategorie<select required value={draft.categorySlug} onChange={(event) => setDraft({ ...draft, categorySlug: event.target.value })}><option value="">Bitte wählen</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
            <label>Preis in Euro<input required inputMode="decimal" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="0,00" /></label>
            <label className="admin-field-wide">Beschreibung<textarea maxLength={2000} value={draft.description || ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
            <label className="admin-field-wide">Allergene, durch Komma getrennt<input value={draft.allergens} onChange={(event) => setDraft({ ...draft, allergens: event.target.value })} /></label>
            <label>Reihenfolge<input type="number" min="0" max="10000" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} /></label>
            <fieldset><legend>Status</legend><label className="admin-check"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Aktiv</label><label className="admin-check"><input type="checkbox" checked={draft.published} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} /> Veröffentlicht</label></fieldset>
          </div>
          <div className="admin-media-field">
            <div>{draft.imageUrl ? <img src={draft.imageUrl} alt="Vorschau des hochgeladenen Gerichtbilds" /> : <ImageSquare aria-hidden="true" />}</div>
            <div><h4>Gerichtbild</h4><p>JPG, PNG oder WebP, maximal 5 MB. Ein Alternativtext ist Pflicht.</p><label className="admin-upload-button">Bild auswählen<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void uploadImage(event.target.files?.[0])} /></label>{mediaId(draft.imageUrl) ? <button className="admin-remove-media" type="button" onClick={() => void removeImage()} disabled={busy}><Trash aria-hidden="true" /> Bild löschen</button> : null}</div>
          </div>
          <div className="admin-menu-actions"><button className="admin-save-button" type="submit" disabled={busy}>{busy ? "Bitte warten …" : "Gericht speichern"}</button></div>
          <p className="admin-form-message" role="status" aria-live="polite">{message}</p>
        </form>
      </div> : null}

      <dialog className="admin-menu-preview" ref={dialogRef} onCancel={(event) => { event.preventDefault(); closePreview(); }} onClose={() => setPreview(null)} aria-labelledby="menu-preview-title">
        <button className="admin-detail-close" type="button" onClick={closePreview} aria-label="Vorschau schließen"><X aria-hidden="true" /></button>
        <p className="admin-kicker">Nicht öffentliche Vorschau</p><h2 id="menu-preview-title">Speisekarte</h2>
        {preview?.length ? preview.map((category) => <section key={category.slug}><h3>{category.name}</h3>{category.items.length ? category.items.map((item) => <article key={item.itemId}>{item.imageUrl ? <img src={item.imageUrl} alt="" /> : null}<div><h4>{item.name}</h4>{item.description ? <p>{item.description}</p> : null}<small>{item.published ? "Veröffentlicht" : "Entwurf"}</small></div><strong>{(item.priceCents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</strong></article>) : <p>Keine aktiven Gerichte.</p>}</section>) : <p>Keine Vorschauinhalte vorhanden.</p>}
      </dialog>
    </section>
  );
}
