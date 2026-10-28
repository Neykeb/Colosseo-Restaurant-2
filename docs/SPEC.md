# Funktionale und technische Spezifikation

**Status:** Phase 3 freigegeben – Umsetzung in Phase 5 geprüft  
**Letzte Aktualisierung:** 27.10.2026

Diese Datei ist die einzige verbindliche Quelle für funktionale Anforderungen, Routing, Integrationen, technische Architektur, Datenmodelle, SEO-Rendering, Teststrategie und Akzeptanzkriterien. Sämtliche Festlegungen bleiben bis Gate 3 `VORSCHLAG`.

## 1. Ziel und Abgrenzung

Gebaut wird eine dreisprachige Marketing-Website für das Ristorante Colosseo. Sie stellt Restaurant, Speisekarte und Feiern vor und führt Gäste zu einer externen Tischreservierung oder zum Telefonanruf.

Nicht Bestandteil:

- Online-Bestellung oder Warenkorb
- eigenes Reservierungs-Backend
- Benutzerkonten
- erfundene Geschäftsdaten oder ungekennzeichnete Platzhalter
- CMS in der ersten Version, solange kein redaktioneller Pflegebedarf bestätigt ist
- Deployment ohne ausdrückliche Erlaubnis

## 2. Technologiestack

### Kern

- React mit TypeScript im Strict Mode
- React Router im Framework Mode über das offizielle Vite-Plugin
- Vite als Entwicklungs- und Buildsystem
- Tailwind CSS v4 plus semantische CSS-Variablen aus `DESIGN_SYSTEM.md`
- i18next und react-i18next für lokalisierte Inhalte
- GSAP, `@gsap/react` und ScrollTrigger für freigegebene scrollgebundene Animationen
- Lenis ausschließlich für die freigegebene, spürbare Wheel-Scroll-Trägheit der Notte-Startseite; Touch bleibt nativ und interne Overlay-Scrollflächen sind ausgeschlossen
- native CSS-Transitions für einfache Hover-, Fokus- und Press-Zustände

Auf groben Zeigern oder unter `768 px` wird das Mobile-Lite-Profil aktiviert: Lenis, ScrollTrigger-Pinning, Video-Scrubbing, Parallax, Dauer-Marquees und buchstabenweise Wechsel werden nicht initialisiert. Diese Einschränkung ist eine verbindliche Performance- und Bedienanforderung, kein Reduced-Motion-Ersatz.

### Begründung

React Router Framework Mode stellt typisierte Route Modules, Code-Splitting und statische Vorabgenerierung bereit. Alle bekannten Inhaltsrouten werden beim Build als HTML erzeugt. Das verbessert erste Darstellung, Crawlbarkeit und Metadaten, ohne einen permanenten Node-Server vorauszusetzen. Experimentelle React Server Components werden nicht verwendet.

Technische Referenzen: offizielle Dokumentation zu [React Router Framework Mode](https://reactrouter.com/start/modes), [Pre-Rendering](https://reactrouter.com/how-to/pre-rendering), [react-i18next](https://react.i18next.com/) und [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

### Abhängigkeitspolitik

- Vor jeder Installation `package.json` prüfen.
- Abhängigkeiten auf das oben begründete Minimum beschränken.
- Keine zweite Animationsbibliothek neben GSAP hinzufügen.
- Lenis gilt nicht als zweite UI-Animationsschicht: Es liefert ausschließlich den Seitenscroll und wird über den GSAP-Ticker mit ScrollTrigger synchronisiert.
- Keine UI-Komponentenbibliothek einführen; die Marketing-Komponenten werden auf Basis des freigegebenen Designsystems erstellt.
- Icons nur aus einer einzigen, in Phase 4 ausgewählten Familie. Präferenz: Phosphor Icons, sofern tatsächlich benötigt.
- Exakte Paketversionen werden bei Initialisierung gegen aktuelle stabile Releases und Peer-Abhängigkeiten geprüft und im Lockfile fixiert.

## 3. Rendering und Deployment-Modell

- React Router Framework Mode mit `ssr: false`.
- Alle bekannten Sprach- und Inhaltsrouten werden über `prerender` in `react-router.config.ts` vorab erzeugt.
- Ausgabe ist statisch hostbar. Netlify ist als erster Hostinganbieter bestätigt; `netlify.toml` baut mit `npm run build`, veröffentlicht `build/client`, leitet `/` auf `/de` und stellt für unbekannte clientseitige Pfade ergänzend den SPA-Fallback bereit.
- Für unbekannte URLs wird eine lokalisierbare 404-Seite vorgerendert oder hostingspezifisch zugeordnet.
- Eine SPA-Fallback-Datei darf nur ergänzend verwendet werden; kanonische Inhaltsrouten müssen eigenes HTML besitzen.
- Form- oder Reservierungsdaten werden nicht serverseitig gespeichert.

## 4. Routing und Informationsarchitektur

Deutsch ist Standardsprache. Jede sichtbare Inhaltsseite besitzt eine explizite Sprachroute.

| Zweck | Deutsch | Englisch | Italienisch |
|---|---|---|---|
| Start | `/de` | `/en` | `/it` |
| Speisekarte | `/de/speisekarte` | `/en/menu` | `/it/menu` |
| Restaurant | `/de/restaurant` | `/en/restaurant` | `/it/ristorante` |
| Feiern | `/de/feiern` | `/en/events` | `/it/eventi` |
| Kontakt | `/de/kontakt` | `/en/contact` | `/it/contatti` |

Weitere Regeln:

- `/` leitet auf `/de` weiter. Eine automatische Browser-Sprachumleitung wird nicht erzwungen, damit URLs stabil und vorhersehbar bleiben.
- Der Sprachwechsel führt stets auf die inhaltlich entsprechende Route.
- Unbekannte lokalisierte Pfade zeigen eine 404-Seite in der erkannten Pfadsprache.
- Impressum und Datenschutz werden erst nach Lieferung echter Inhalte als eigene lokalisierte Routen ergänzt. Bis dahin dürfen keine scheinbar vollständigen Rechtsseiten veröffentlicht werden.
- Jede Route definiert eigene Titel, Beschreibung, Canonical, Open-Graph-Daten und `hreflang`-Alternativen.

## 5. Verzeichnis- und Modulstruktur

```text
app/
  components/
    layout/
    navigation/
    sections/
    ui/
  content/
    de/
    en/
    it/
  i18n/
    config.ts
    locales.ts
    routing.ts
  lib/
    analytics.ts
    env.ts
    seo.ts
  motion/
    gsap.ts
    useReducedMotion.ts
  routes/
    $lang._index.tsx
    $lang.menu.tsx
    $lang.restaurant.tsx
    $lang.events.tsx
    $lang.contact.tsx
    $.tsx
  styles/
    app.css
    tokens.css
  root.tsx
  routes.ts
public/
  fonts/
  images/
  robots.txt
tests/
  e2e/
  integration/
  unit/
```

Öffentliche Route-Dateien dürfen interne englische Dateinamen tragen; lokalisierte URL-Segmente werden zentral in `i18n/routing.ts` abgebildet.

## 6. Komponentenarchitektur

### Layout

- `RootDocument`: HTML, globale Metadaten, Styles, Scripts und Skip-Link.
- `LocaleLayout`: validiert Sprache, setzt `lang`, lädt Ressourcen und rendert Header/Footer.
- `SiteHeader`: Desktop- und Mobile-Navigation, Reservierung und Sprachwechsel.
- `MobileMenu`: zugänglicher Dialog mit Fokusfalle, Escape-Schließen und Fokus-Rückgabe.
- `SiteFooter`: Navigation, Kontaktplatzhalter und später Rechtslinks.

### Inhaltssektionen

- `HeroSection`
- `CraftStatementSection`
- `KitchenGallerySection`
- `MenuPreviewSection`
- `AtmosphereSection`
- `EventsSection`
- `VisitSection`
- `ReservationCtaSection`

### Atomic Pattern der Notte-Startseite

- **Atoms:** elementare, zustandsarme Darstellungen wie `MaskedWords` und `ReviewStars`.
- **Molecules:** kleine fachliche Kombinationen wie `ReviewCard`.
- **Organisms:** eigenständige Seitenabschnitte wie `HeroSection`, `MenuPreviewSection`, `EventsSection`, `ReviewsSection`, `ReservationSection` und `VisitSection`.
- **Page Composition:** `NottePage` legt ausschließlich Reihenfolge, Dialogzustand und Fokus-Rückgabe fest; fachliche Section-Markups liegen nicht mehr in der Page-Komponente.
- Die bestätigten deutschen Notte-Inhalte und Geschäftswerte liegen zentral in `app/content/notte.de.ts`. Komponenten enthalten keine duplizierten sichtbaren Texte.
- Die vorhandene GSAP-Orchestrierung bleibt als seitenbezogene Motion-Schicht vom Section-Markup getrennt. Eine weitere Aufteilung ist erst erforderlich, wenn dieselben Motion-Patterns auf anderen Seiten wiederverwendet werden.

### Vollbild-Speisekarte

- `FullMenuOverlay` wird aus der bestehenden Notte-Speisekarten-Section über „Speisekarte ansehen“ geöffnet; die Hero-Section bleibt davon unberührt.
- Ein natives modales `dialog` enthält die bildschirmfüllende, intern scrollbare Speisekarte und eine sticky Filterleiste. Ein Filter rendert ausschließlich die gewählte Kategorie.
- Gerichte sind kompakte, nicht interaktive Einträge. Es gibt keine zusätzliche Detailansicht, weil sie dieselben Informationen wiederholen würde.
- Der Haupt-Schließen-Button und `Escape` beenden den Dialog. Danach kehrt der Fokus zum auslösenden Button zurück.
- Der Overlay-Scroll ist vom Seitenscroll entkoppelt und wird beim Öffnen sowie beim Filterwechsel auf den Anfang zurückgesetzt. Filter verändern die Seiten-URL nicht.
- Fehlende Beschreibungen werden ausgelassen und nicht ergänzt. Quelle und verifizierter Inhaltsumfang stehen ausschließlich in `CONTENT.md`.

Die konkreten Layoutvarianten werden erst durch den verpflichtenden `gpt-taste`-Designplan in Phase 4 gewählt. Ein Bento-Layout ist nur zulässig, wenn die tatsächliche Inhaltsmenge lückenlos aufgeht und `grid-flow-dense` eingesetzt wird.

### UI-Bausteine

- `ButtonLink`
- `TextLink`
- `ResponsiveImage`
- `LanguageSwitcher`
- `ExternalLinkNotice`
- `LocalizedLink`
- `SectionHeading`
- `PlaceholderNotice` ausschließlich in nicht-produktiven Builds

## 7. Datenmodelle

```ts
type Locale = "de" | "en" | "it";

type LocalizedText = Record<Locale, string>;

type RestaurantContact = {
  address: string | null;
  phoneDisplay: string | null;
  phoneHref: string | null;
  email: string | null;
  mapUrl: string | null;
};

type OpeningPeriod = {
  days: string[];
  opens: string;
  closes: string;
};

type ReservationConfig = {
  externalUrl: string | null;
  phoneHref: string | null;
};

type MenuCategory = {
  id: string;
  nameKey: string;
  descriptionKey?: string;
  items: MenuItem[];
};

type MenuItem = {
  id: string;
  nameKey: string;
  descriptionKey?: string;
  price?: string;
  allergens?: string[];
  image?: ImageAsset;
};

type ImageAsset = {
  src: string;
  width: number;
  height: number;
  altKey: string | null;
  kind: "real" | "licensed" | "generated-concept" | "placeholder";
  focalPoint?: { x: number; y: number };
};
```

- `null` erzwingt einen bewussten fehlenden Wert. Leere Fantasiedaten sind nicht zulässig.
- Platzhalter werden nur in Development/Preview gerendert und blockieren den Production Build, solange reale Pflichtwerte fehlen.
- Preise bleiben Strings, bis reale Format- und Währungsanforderungen feststehen.
- Allergene werden nur geführt, wenn fachlich korrekte Daten geliefert werden.

## 8. Lokalisierungsarchitektur

- Übersetzungen werden nach Sprache und Namespace als lokale JSON- oder TypeScript-Ressourcen geführt.
- Vorgesehene Namespaces: `common`, `navigation`, `home`, `menu`, `restaurant`, `events`, `contact`, `seo`, `errors`.
- Keine sichtbaren Strings direkt in Komponenten.
- Deutsch dient als redaktionelle Quelle; Englisch und Italienisch benötigen fachliche Prüfung.
- Fehlende Keys schlagen in Tests fehl. In Produktion darf kein Keyname sichtbar werden.
- Datums-, Zahlen- und Preisformatierung erfolgt mit `Intl` für die aktive Locale.
- `html[lang]`, Metadaten, Alternativtexte und zugängliche Namen werden pro Route gesetzt.

## 9. Externe Aktionen und Integrationen

### Reservierung

- Primärer CTA öffnet die noch zu liefernde externe Reservierungs-URL.
- Externer Link wird als solcher zugänglich kenntlich gemacht.
- Falls der Dienst Sprachparameter unterstützt, wird die aktive Locale übergeben.
- Telefonische Alternative nutzt einen validierten `tel:`-Link.
- Kein eigenes Formular und keine lokale Speicherung von Reservierungsdaten.

### Feiern und Veranstaltungen

- Der Zielweg ist `OFFEN`.
- Zulässige spätere Varianten: externe Anfrage-URL, `mailto:` oder Telefonnummer.
- Ein eigenes Formular wird erst spezifiziert, wenn Empfänger, Datenschutz, Spam-Schutz und Backend geklärt sind.

### Karten und Medien

- Keine automatisch ladende Drittanbieter-Karte vor Consent-Entscheidung.
- Standardmäßig statischer Anfahrtslink oder eigenes Bild.
- Eingebettete Videos starten nicht automatisch mit Ton und benötigen Poster sowie Reduced-Motion-Verhalten.

## 10. `gpt-taste`-Umsetzungsvertrag

Vor dem ersten React-/UI-Code wird ein `<design_plan>` ausgegeben. Er enthält:

1. dreizeilige simulierte Python-RNG-Ausgabe mit deterministischem Seed
2. Auswahl genau einer Hero-Architektur
3. Auswahl genau eines Font-Stacks aus Satoshi, Cabinet Grotesk, Outfit oder Geist
4. Auswahl genau dreier Komponentenarchitekturen aus dem Skill-Arsenal
5. Auswahl genau zweier GSAP-Paradigmen
6. AIDA-Nachweis für Navigation, Attention, Interest, Desire und Action
7. Hero-Mathematik mit breitem H1-Container und maximal zwei bis drei Zeilen
8. mathematischen Lückennachweis für jedes Bento-Raster inklusive `grid-flow-dense`
9. Prüfung auf verbotene Meta-Labels und ausreichende Button-Kontraste

Die zufällige Auswahl darf das freigegebene Inhaltsmodell, die Barrierefreiheit oder die Approval Gates nicht verändern. Konflikte werden zugunsten der freigegebenen Anforderungen gelöst und dokumentiert.

## 11. Animationsinfrastruktur

- GSAP und ScrollTrigger werden einmal in `motion/gsap.ts` registriert.
- React-Animationen verwenden `useGSAP` aus `@gsap/react` mit komponentenlokalem Scope und automatischem Cleanup.
- ScrollTrigger-Instanzen werden nur in isolierten Motion-Komponenten erzeugt.
- Erlaubte animierte Eigenschaften: primär `transform`, `opacity` und gegebenenfalls `clip-path` nach Performance-Prüfung.
- Kein scrollgetriebener React-State. Der richtungssensitive Header darf einen passiven, per `requestAnimationFrame` gedrosselten `window`-Scrolllistener verwenden, weil sein Hysteresezustand nicht aus dem Komponenten-Rendering abgeleitet wird.
- Gepinnte Sequenzen verwenden explizite Start-/Endpunkte, `invalidateOnRefresh` und werden bei Breakpointwechsel neu berechnet.
- `prefers-reduced-motion` deaktiviert Scrubbing, Pinning, Parallax und gestaffelte Reveals vollständig.
- Inhalte bleiben vor Initialisierung und ohne JavaScript sichtbar.
- `main` verhindert unbeabsichtigten horizontalen Overflow, ohne Fokusumrisse abzuschneiden.

## 12. Asset-Pipeline

- Originale liegen getrennt von generierten Webvarianten.
- Rasterbilder werden als AVIF und WebP plus kompatibler Fallback erzeugt.
- `srcset`-Breiten orientieren sich an tatsächlichen Layoutgrößen, nicht an pauschalen Stufen.
- Hero-LCP-Bild erhält Preload und hohe Priorität; unterhalb liegende Medien werden lazy geladen.
- Breite und Höhe oder `aspect-ratio` sind immer reserviert, um CLS zu vermeiden.
- Mobile Hero- und Schlüsselbilder dürfen eigene Crops besitzen.
- Fonts werden als WOFF2 selbst gehostet, mit Subsetting nur nach vollständiger Zeichensatzprüfung.
- `generated-concept` und `placeholder` dürfen nicht als reale Restaurantfotografie veröffentlicht werden.
- Der Production Build schlägt fehl, wenn als blockierend markierte Platzhalter verbleiben.

## 13. SEO und strukturierte Daten

- Pro Route eindeutiger lokalisierter Titel und Meta-Description.
- Self-referencing Canonical und vollständige `hreflang`-Gruppe für `de`, `en`, `it` sowie optional `x-default` auf `/de`.
- Open Graph und Social Preview pro Sprache; reales oder neutral gekennzeichnetes freigegebenes Bild.
- XML-Sitemap enthält ausschließlich veröffentlichte kanonische Routen.
- `robots.txt` verweist auf die Sitemap und blockiert keine notwendigen Assets.
- JSON-LD vom Typ `Restaurant` erst mit realen Angaben zu Name, URL, Telefon, Adresse und Öffnungszeiten veröffentlichen.
- `servesCuisine: "Italian"` ist sachlich bestätigt; Speisekarten-URL und Reservierungs-URL werden erst nach Lieferung ergänzt.
- Semantisch genau eine H1 pro Seite und logisch verschachtelte Folgeüberschriften.

## 14. Accessibility

- Ziel: WCAG 2.2 AA.
- Skip-Link, Landmarken und semantische Navigation.
- Vollständige Tastaturbedienung und sichtbare Fokuszustände.
- Mobile Navigation als Dialog mit korrektem Fokusmanagement.
- Touch-Ziele mindestens 44 x 44 px.
- Kein Inhalt ausschließlich durch Farbe, Hover oder Animation vermittelt.
- Medienalternativen entsprechend Inhalt und Funktion.
- Keine automatische Bewegung über fünf Sekunden ohne Pausemöglichkeit; bevorzugt keine dauerhafte Bewegung.
- Zoom auf 200 Prozent ohne Verlust von Inhalt oder Funktion.
- Deutsche, englische und italienische Langtexte werden auf Umbruch und zugängliche Namen geprüft.

## 15. Performance-Budget

- Feldziele: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- Initiales JavaScript-Budget als Arbeitsziel: maximal 180 kB gzip ohne GSAP-Route-Chunks; tatsächliches Budget nach erstem Build verifizieren.
- GSAP-reiche Abschnitte route- oder komponentenbezogen laden, wenn sie nicht für die erste Ansicht benötigt werden.
- Keine Hintergrundvideos, bis Dateigröße, Poster, Mobilstrategie und Nutzerkontrolle freigegeben sind.
- Maximal ein primäres LCP-Medium im Hero.
- Keine dauerhaften Filter auf scrollenden Großflächen.

## 16. Teststrategie

### Statisch und unitär

- TypeScript: `tsc --noEmit` oder der Framework-Typecheck.
- ESLint mit React-, Hooks-, Accessibility- und Importregeln.
- Vitest für Routing-Helfer, Locale-Mapping, Content-Schemas und SEO-Funktionen.
- Testing Library für Navigation, Sprachwechsel, Mobile Menu und externe Aktionen.

### End-to-End

- Playwright für alle Kernrouten in Deutsch, Englisch und Italienisch.
- Viewports mindestens 320 x 568, 390 x 844, 768 x 1024 und 1440 x 900.
- Tastaturfluss, Menüdialog, Sprachenwechsel, Reservierungs- und Telefonlinks.
- JavaScript-deaktivierte Prüfung der vorgerenderten Kerninhalte.
- Reduced Motion und 200-Prozent-Zoom.
- axe-basierte automatisierte Accessibility-Prüfung ergänzt manuelle Tests, ersetzt sie aber nicht.

### Visuelle und adversariale Prüfung

- Browser-Screenshots für repräsentative Routen und Viewports.
- `break-ui` mit Demo-, Worst-Case-, Empty-, One- und großen Datensätzen, soweit auf die jeweilige Oberfläche anwendbar.
- Besondere Testwerte: lange italienische Gerichtenamen, lange Veranstaltungsbezeichnungen, fehlende optionale Beschreibungen, sehr lange E-Mail-/URL-Werte und gebrochene Bilder.
- `gpt-taste`-Preflight vor Abschluss der visuellen Umsetzung.

## 17. Datenschutz und Sicherheit

- Keine personenbezogenen Daten lokal erfassen, solange kein eigenes Formular freigegeben ist.
- Externe Reservierungs- und Kartenlinks werden transparent gekennzeichnet.
- Keine Analyse- oder Marketing-Skripte vor Entscheidung über Consent und Rechtsgrundlage.
- Externe URLs ausschließlich aus validierter Konfiguration, niemals aus ungeprüften Nutzereingaben.
- `target="_blank"` nur mit sicherem `rel` und nur, wenn das Öffnen eines neuen Tabs fachlich sinnvoll ist.
- Keine Secrets in Client-Code oder Repository.

## 18. Akzeptanzkriterien für Phase 4

Die Implementierung gilt erst als vollständig, wenn:

- alle freigegebenen Routen in drei Sprachen statisch vorgerendert werden
- Navigation und Sprachwechsel auf die korrespondierenden Seiten führen
- externe Reservierung und Telefonalternative korrekt funktionieren
- keine Online-Bestellfunktion existiert
- keine blockierenden Platzhalter im Production Build verbleiben
- sichtbare Texte aus der Lokalisierungsstruktur stammen
- alle Seiten ohne Motion vollständig lesbar und bedienbar sind
- Mobile Menu, Fokusführung und Tastaturbedienung funktionieren
- Bilddimensionen reserviert und mobile Crops kontrolliert sind
- Canonical, `hreflang`, Sitemap und Metadaten korrekt erzeugt werden
- Typecheck, Lint, Build und relevante Tests erfolgreich sind
- `break-ui`-Befunde dokumentiert und freigegebene Korrekturen erneut geprüft wurden
- keine nicht freigegebenen Drittanbieter-Skripte oder Deployments erfolgt sind

## 19. Noch offene Implementierungsabhängigkeiten

- externe Reservierungs-URL und Anbieter
- realer Telefonlink
- Weg für Veranstaltungsanfragen
- Logo-Dateien und Nutzungsregeln
- reale Kontakt-, Adress-, Öffnungs- und Rechtsangaben
- finale Gerichte, Kategorien, Preise und gegebenenfalls Allergendaten
- finales Bildmaterial und dessen Rechte
- Hostinganbieter und Domain
- Entscheidung über Analytics und Consent

## Gate

Diese Spezifikation ist ein Phase-3-Entwurf. Projektinitialisierung oder UI-Code beginnen erst nach ausdrücklicher Gate-3-Freigabe.
