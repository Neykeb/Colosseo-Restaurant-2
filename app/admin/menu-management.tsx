import { Eye, ImageSquare, Plus, Trash, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DevDataToggle, useDataState } from "../components/dev-data-toggle";
import {
  oneCaseCategories,
  oneCaseItems,
  previewFrom,
  worstCaseCategories,
  worstCaseItems,
} from "./menu-management.fixtures";

export type MenuCategory = { slug: string; name: string; sortOrder: number; active: boolean };
export type MenuItem = {
  itemId: string;
  categorySlug: string;
  name: string;
  description?: string;
  priceCents: number;
  allergens: string[];
  imageUrl?: string;
  imageAltText?: string;
  sortOrder: number;
  active: boolean;
  published: boolean;
};
export type PreviewCategory = MenuCategory & { items: MenuItem[] };
type ItemDraft = Omit<MenuItem, "priceCents" | "allergens"> & { price: string; allergens: string };

const emptyDraft = (categorySlug = ""): ItemDraft => ({
  itemId: "",
  categorySlug,
  name: "",
  description: "",
  price: "",
  allergens: "",
  imageUrl: undefined,
  imageAltText: undefined,
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
  const dataState = useDataState();
  const fixtureMode = import.meta.env.DEV && dataState !== "demo";
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [draft, setDraft] = useState<ItemDraft>(() => emptyDraft());
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewCategory[] | null>(null);
  const [categoryDraft, setCategoryDraft] = useState({ slug: "", name: "", sortOrder: 0 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageAltText, setImageAltText] = useState("");
  const [formError, setFormError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);

  const authenticatedFetch = useCallback(async (input: RequestInfo | URL, init: RequestInit = {}) => {
    const token = await getToken();
    return fetch(input, { ...init, headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}), ...init.headers } });
  }, [getToken]);

  const load = useCallback(async () => {
    setState("loading");
    if (fixtureMode) {
      const fixture = dataState === "worst"
        ? { categories: worstCaseCategories, items: worstCaseItems }
        : dataState === "one"
          ? { categories: oneCaseCategories, items: oneCaseItems }
          : { categories: [], items: [] };
      setCategories(fixture.categories);
      setItems(fixture.items);
      setSelectedCategory(fixture.categories[0]?.slug || "");
      setDraft(emptyDraft(fixture.categories[0]?.slug));
      setState("ready");
      return;
    }
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
  }, [authenticatedFetch, dataState, fixtureMode]);

  useEffect(() => { void load(); }, [load]);

  const filteredItems = useMemo(() => items.filter((item) => !selectedCategory || item.categorySlug === selectedCategory), [items, selectedCategory]);

  function selectItem(item?: MenuItem) {
    setDraft(item ? toDraft(item) : emptyDraft(selectedCategory || categories[0]?.slug));
    setMessage("");
    setFormError("");
    setSelectedFile(null);
    setImageAltText("");
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
    const allergens = draft.allergens.split(",").map((value) => value.trim()).filter(Boolean);
    setFormError("");
    if (!draft.name.trim()) {
      setFormError("Bitte einen Namen für das Gericht eintragen.");
      nameRef.current?.focus();
      return;
    }
    if (!draft.categorySlug) {
      setFormError("Bitte eine Kategorie auswählen.");
      categoryRef.current?.focus();
      return;
    }
    if (!Number.isFinite(price) || price < 0 || price > 1000) {
      setFormError("Bitte einen Preis zwischen 0,00 € und 1.000,00 € eintragen.");
      priceRef.current?.focus();
      return;
    }
    if (allergens.length > 50 || allergens.some((allergen) => allergen.length > 80)) {
      setFormError("Bitte höchstens 50 Allergene mit jeweils maximal 80 Zeichen eintragen.");
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
        allergens,
        imageUrl: draft.imageUrl || undefined,
        imageAltText: draft.imageAltText || undefined,
        sortOrder: draft.sortOrder,
        active: draft.active,
        published: draft.published,
      };
      const response = await authenticatedFetch(`/api/admin/menu/items/${encodeURIComponent(itemId)}`, { method: "PUT", body: JSON.stringify(payload) });
      if (!response.ok) throw new Error();
      const body = await response.json() as { item: MenuItem };
      setDraft(toDraft(body.item));
      setFormError("");
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

  function chooseImage(file: File | undefined) {
    if (!file) return;
    if (!(["image/jpeg", "image/png", "image/webp"].includes(file.type)) || file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);
      setFormError("Bitte JPG, PNG oder WebP bis maximal 5 MB auswählen.");
      return;
    }
    setSelectedFile(file);
    setFormError("");
    setMessage(`${file.name} ist ausgewählt. Alternativtext ergänzen und Upload starten.`);
  }

  async function uploadImage() {
    if (!selectedFile) { setFormError("Bitte zuerst ein Bild auswählen."); return; }
    const altText = imageAltText.trim();
    if (!altText) { setFormError("Bitte einen Alternativtext für das Bild eintragen."); return; }
    setFormError("");
    setBusy(true); setMessage("Bild wird hochgeladen …");
    try {
      const response = await authenticatedFetch("/api/admin/media", { method: "POST", body: JSON.stringify({ fileName: selectedFile.name, contentType: selectedFile.type, altText, dataBase64: await fileToBase64(selectedFile) }) });
      if (!response.ok) throw new Error();
      const body = await response.json() as { media: { url: string } };
      setDraft((current) => ({ ...current, imageUrl: body.media.url, imageAltText: altText }));
      setSelectedFile(null);
      setImageAltText("");
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
          sortOrder: draft.sortOrder, active: draft.active, published: draft.published, imageAltText: draft.imageAltText,
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
    if (fixtureMode) {
      setPreview(previewFrom(categories, items));
      requestAnimationFrame(() => dialogRef.current?.showModal());
      return;
    }
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
      <DevDataToggle />
      <div className="admin-section-heading">
        <div><p className="admin-kicker">Inhalte</p><h2 id="menu-title">Speisekarte verwalten</h2></div>
        <button className="admin-preview-button" type="button" onClick={() => void openPreview()} disabled={busy || state !== "ready"}><Eye aria-hidden="true" /> Vorschau</button>
      </div>
      {fixtureMode ? <p className="admin-fixture-note" role="status">Entwicklungsansicht mit lokalen Testdaten. Änderungen sind deaktiviert.</p> : null}
      {state === "loading" ? <p className="admin-empty" role="status">Speisekarte wird geladen …</p> : null}
      {state === "error" ? <div className="admin-notice" role="alert"><h3>Laden fehlgeschlagen</h3><button type="button" onClick={() => void load()}>Erneut laden</button></div> : null}
      {state === "ready" ? <div className="admin-menu-layout">
        <aside className="admin-menu-index" aria-label="Kategorien und Gerichte">
          <label>Kategorie<select name="menuCategoryFilter" value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setDraft(emptyDraft(event.target.value)); }}>
            <option value="">Alle Kategorien</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}{category.active ? "" : " (inaktiv)"}</option>)}
          </select></label>
          <button className="admin-new-item" type="button" disabled={fixtureMode} onClick={() => selectItem()}><Plus aria-hidden="true" /> Neues Gericht</button>
          <div className="admin-menu-items">{filteredItems.length === 0 ? <p className="admin-compact-empty">Keine Gerichte in dieser Kategorie. Lege ein Gericht an oder wähle eine andere Kategorie.</p> : filteredItems.map((item) => <article key={item.itemId} className={draft.itemId === item.itemId ? "is-selected" : ""}>
            <button type="button" aria-pressed={draft.itemId === item.itemId} onClick={() => selectItem(item)}><span>{item.name}</span><small>{(item.priceCents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })} · {item.published ? "veröffentlicht" : "Entwurf"}</small></button>
            <button type="button" aria-label={`${item.published ? "Zurückziehen" : "Veröffentlichen"}: ${item.name}`} disabled={fixtureMode || busy || !item.active} onClick={() => void setPublication(item, !item.published)}>{item.published ? "Zurückziehen" : "Veröffentlichen"}</button>
          </article>)}</div>
          <form className="admin-category-form" onSubmit={(event) => void saveCategory(event)}>
            <h3>Neue Kategorie</h3>
            <label>Technischer Schlüssel<input name="categorySlug" required maxLength={80} value={categoryDraft.slug} onChange={(event) => setCategoryDraft({ ...categoryDraft, slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} placeholder="z. B. antipasti" /></label>
            <label>Anzeigename<input name="categoryName" required maxLength={160} value={categoryDraft.name} onChange={(event) => setCategoryDraft({ ...categoryDraft, name: event.target.value })} /></label>
            <label>Reihenfolge<input name="categorySortOrder" type="number" min="0" max="10000" value={categoryDraft.sortOrder} onChange={(event) => setCategoryDraft({ ...categoryDraft, sortOrder: Number(event.target.value) })} /></label>
            <button type="submit" disabled={fixtureMode || busy}>Kategorie speichern</button>
          </form>
        </aside>

        <form className="admin-menu-editor" onSubmit={(event) => void saveItem(event)}>
          <div className="admin-menu-editor-heading"><div><p className="admin-kicker">{draft.itemId ? "Gericht bearbeiten" : "Neues Gericht"}</p><h3>{draft.name || "Gericht anlegen"}</h3></div><span>{draft.published ? "Live" : "Entwurf"}</span></div>
          <div className="admin-menu-form-grid">
            <label className="admin-field-wide">Name<input ref={nameRef} name="dishName" required maxLength={160} aria-invalid={Boolean(formError && !draft.name.trim())} aria-describedby={formError ? "menu-form-error" : undefined} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label>Kategorie<select ref={categoryRef} name="dishCategory" required aria-invalid={Boolean(formError && !draft.categorySlug)} aria-describedby={formError ? "menu-form-error" : undefined} value={draft.categorySlug} onChange={(event) => setDraft({ ...draft, categorySlug: event.target.value })}><option value="">Bitte wählen</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
            <label>Preis in Euro<input ref={priceRef} name="dishPrice" required inputMode="decimal" aria-invalid={Boolean(formError && (!Number.isFinite(Number(draft.price.replace(",", "."))) || Number(draft.price.replace(",", ".")) < 0))} aria-describedby={formError ? "menu-form-error" : undefined} value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} placeholder="0,00" /></label>
            <label className="admin-field-wide">Beschreibung<textarea name="dishDescription" maxLength={2000} value={draft.description || ""} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
            <label className="admin-field-wide">Allergene, durch Komma getrennt<input name="dishAllergens" value={draft.allergens} onChange={(event) => setDraft({ ...draft, allergens: event.target.value })} /></label>
            <label>Reihenfolge<input name="dishSortOrder" type="number" min="0" max="10000" value={draft.sortOrder} onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })} /></label>
            <fieldset><legend>Status</legend><label className="admin-check"><input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /> Aktiv</label><label className="admin-check"><input type="checkbox" checked={draft.published} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} /> Veröffentlicht</label></fieldset>
          </div>
          <div className="admin-media-field">
            <div>{draft.imageUrl ? <img src={draft.imageUrl} alt="Vorschau des hochgeladenen Gerichtbilds" /> : <ImageSquare aria-hidden="true" />}</div>
            <div><h4>Gerichtbild</h4><p>JPG, PNG oder WebP, maximal 5 MB. Ein Alternativtext ist Pflicht.</p><div className="admin-media-controls"><label className="admin-upload-button">Bild auswählen<input name="dishImage" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseImage(event.target.files?.[0])} /></label><span>{selectedFile?.name || "Keine neue Datei ausgewählt"}</span><label>Alternativtext<input name="dishImageAlt" maxLength={300} value={imageAltText} onChange={(event) => setImageAltText(event.target.value)} aria-describedby="image-alt-help" /></label><small id="image-alt-help">Beschreibe kurz, was auf dem Bild für das Gericht wichtig ist.</small><button className="admin-upload-start" type="button" onClick={() => void uploadImage()} disabled={busy || !selectedFile}>Bild hochladen</button>{mediaId(draft.imageUrl) ? <button className="admin-remove-media" type="button" onClick={() => void removeImage()} disabled={busy}><Trash aria-hidden="true" /> Bild löschen</button> : null}</div></div>
          </div>
          <div className="admin-menu-actions"><button className="admin-save-button" type="submit" disabled={fixtureMode || busy}>{busy ? "Bitte warten …" : "Gericht speichern"}</button></div>
          <p id="menu-form-error" className="admin-form-error" role="alert">{formError}</p>
          <p className="admin-form-message" role="status" aria-live="polite">{message}</p>
        </form>
      </div> : null}

      <dialog className="admin-menu-preview" ref={dialogRef} onCancel={(event) => { event.preventDefault(); closePreview(); }} onClose={() => { setPreview(null); lastFocused.current?.focus(); }} aria-labelledby="menu-preview-title">
        <button className="admin-detail-close" type="button" onClick={closePreview} aria-label="Vorschau schließen"><X aria-hidden="true" /></button>
        <p className="admin-kicker">Nicht öffentliche Vorschau</p><h2 id="menu-preview-title">Speisekarte</h2>
        {preview?.length ? preview.map((category) => <section key={category.slug}><h3>{category.name}</h3>{category.items.length ? category.items.map((item) => <article key={item.itemId}>{item.imageUrl ? <img src={item.imageUrl} alt={item.imageAltText || "Gerichtbild ohne Alternativtext"} /> : null}<div><h4>{item.name}</h4>{item.description ? <p>{item.description}</p> : null}<small>{item.published ? "Veröffentlicht" : "Entwurf"}</small></div><strong>{(item.priceCents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</strong></article>) : <p>Keine aktiven Gerichte.</p>}</section>) : <p>Keine Vorschauinhalte vorhanden.</p>}
      </dialog>
    </section>
  );
}
