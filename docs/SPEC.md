# Funktionale und technische Spezifikation

**Status:** Bestehende Phase 3 freigegeben; Full-Stack-Erweiterung `FS0` als nicht freigegebener Architekturentwurf
**Letzte Aktualisierung:** 30.10.2026

Diese Datei ist die einzige verbindliche Quelle für funktionale Anforderungen, Routing, Integrationen, technische Architektur, Datenmodelle, SEO-Rendering, Teststrategie und Akzeptanzkriterien. Die bestehende Website-Spezifikation wurde mit Gate 3 freigegeben. Neue Full-Stack-Festlegungen bleiben bis Gate `FS0` `VORSCHLAG`.

> **Änderungsauftrag 30.10.2026:** Die Abschnitte 20 bis 29 planen ein eigenes Reservierungs-Backend, Administration und Inhaltsverwaltung. Der zuletzt festgelegte Zielstack ist Node.js/Express/TypeScript, MongoDB mit Mongoose, Render, Resend und Clerk OAuth für die Admin-Anmeldung. MongoDB Atlas ist noch als Betriebsform zu bestätigen. Die konkrete Umsetzung bleibt bis Gate `FS0` gesperrt. Bis dahin bleibt die laufende statische Website unverändert maßgeblich.

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

Die ursprüngliche Spezifikation wurde am 10.10.2026 mit Gate 3 freigegeben und anschließend umgesetzt. Dieser historische Gate-Status autorisiert nicht die nachfolgend geplante Full-Stack-Erweiterung.

## 20. Full-Stack-Zielbild (`VORSCHLAG`)

Der neue Umfang erweitert die bestehende Marketing-Website, ohne deren Gestaltung oder öffentliche Inhaltsreihenfolge neu zu bauen:

- Gäste prüfen buchbare Zeitfenster und senden eine Reservierung mit Datum, Uhrzeit, Personenanzahl und notwendigen Kontaktdaten.
- Das Backend entscheidet innerhalb einer atomaren Operation anhand der zu diesem Zeitpunkt gültigen Regeln und Kapazitäten, ob die Reservierung bestätigt wird.
- Gäste und Restaurant erhalten statusabhängige Transaktions-E-Mails.
- Autorisierte Mitarbeitende verwalten Reservierungen, Kalender/Sperrzeiten, Tische, Speisekarte, Öffnungszeiten und Veranstaltungsanfragen.
- Änderungen an Speisekarte und Öffnungszeiten erhalten einen kontrollierten Veröffentlichungsstatus; die öffentliche Website besitzt einen sicheren Fallback, falls das Backend zeitweise nicht erreichbar ist.

Weiter ausgeschlossen bleiben Online-Essensbestellung, Warenkorb und Zahlungsabwicklung, solange sie nicht separat spezifiziert und freigegeben werden.

## 21. Architekturentscheidung

### Empfohlene Zielarchitektur

| Schicht | Vorschlag | Begründung |
|---|---|---|
| Öffentliche UI und Admin-UI | bestehendes React Router/Vite/TypeScript-Projekt | Bewahrt Routen, Design, Komponenten und Buildsystem; Admin wird als lazy geladener, geschützter Bereich ergänzt. |
| Server | eigener Node.js-/Express-/TypeScript-Server | API, Authentifizierung, Validierung und Geschäftslogik bleiben selbst entwickelt und nachvollziehbar. |
| Produktionsbetrieb | ein Render Web Service für Express, API und statischen React-Build | Gemeinsame Origin vereinfacht sichere Cookie-Sessions, CSRF-Schutz und Deployment. Express bindet an `0.0.0.0` und den von Render gelieferten `PORT`. |
| Datenbank | MongoDB Atlas; Region möglichst nah am Render Web Service | Verwalteter MongoDB-Betrieb mit Replica Set für Transaktionen; Render und Atlas besitzen eine dokumentierte Integration. |
| ODM und Strukturmigrationen | Mongoose sowie eingecheckte, idempotente Migrationsskripte | MongoDB-native Schemas, Modelle, Validierung, Indizes und Transaktionen mit offizieller TypeScript-Unterstützung. |
| Admin-Authentifizierung | Clerk mit OAuth über `@clerk/react` und `@clerk/express` | Clerk übernimmt Identität, OAuth-Ablauf und Sessionprüfung. Anbieter und zugelassene Identitäten bleiben zu konfigurieren. |
| Autorisierung | eigene MongoDB-basierte Rollenprüfung mit `owner` und `staff` | Jede geschützte Route prüft zusätzlich zur Clerk-Session ein aktives Adminprofil und die erforderliche Rolle serverseitig. Exakte Rechte-Matrix bleibt `OFFEN`. |
| Bilder | externer Objektspeicher `OFFEN`; MongoDB speichert nur Metadaten und URLs | Render-Web-Service-Dateien sind flüchtig. Uploadanbieter und Rechteprüfung werden vor `FS6` festgelegt. |
| E-Mail | Resend über eine eigene Mail-Service-Schicht und Outbox | Domänenbasierter Transaktionsversand und Idempotenz; Absenderdomain und Empfänger bleiben `OFFEN`. |

Render unterstützt Node-/Express-Web-Services und erwartet die Bindung an den bereitgestellten `PORT`. Das Dateisystem des Web Service ist flüchtig; dauerhafte Fachdaten liegen in MongoDB Atlas. Der Atlas-Connection-String bleibt ein Render-Secret. Ein kostenloser Render-Web-Service kann nach Inaktivität schlafen; dies wird für das Finalprojekt akzeptiert, aber nicht als Produktionsziel eines realen Reservierungsbetriebs bewertet.

### Prozess- und Verzeichnisstruktur (`VORSCHLAG`)

```text
app/                         bestehendes React-Frontend
server/
  src/
    app.ts                   Express-Konfiguration ohne listen()
    server.ts                Prozessstart und Graceful Shutdown
    config/                  validierte Umgebungsvariablen
    routes/                  HTTP-Routen und Router
    controllers/             HTTP-Übersetzung, keine Geschäftslogik
    services/                Reservierung, Auth, Menü, Mail
    repositories/            Mongoose-Datenzugriff
    models/                  Mongoose-Schemas und Modelle
    middleware/              Auth, Rollen, Fehler, Rate-Limit, CSRF
    validation/              Request-/Response-Schemas
    jobs/                    Outbox-Verarbeitung und Aufräumjobs
    lib/                     Logger, Zeit, IDs, gemeinsame Helfer
database/migrations/         versionierte Struktur-/Datenmigrationen
tests/
  unit/
  integration/
  e2e/
```

Im lokalen Betrieb laufen Vite und Express als getrennte Prozesse; Vite leitet `/api` an Express weiter. Im Produktionsbetrieb beantwortet Express zuerst `/api/*`, Healthcheck und Admin-Sicherheitsrouten und liefert danach `build/client` einschließlich kontrolliertem SPA-Fallback aus. So bleibt der React-Build selbst statisch optimierbar, während API und sichere Sessions dieselbe Origin verwenden.

### Bewusste Nichtentscheidungen

- `BESTÄTIGT` Ein Render-Konto besteht; Render dient zunächst ausschließlich dem Finalprojekt.
- `OFFEN` Render- und Atlas-Region, Tarif sowie Eigentümer des Atlas- und Resend-Kontos.
- `OFFEN` Node-LTS- und konkrete Mongoose-Hauptversion; sie werden in `FS1` nach Kompatibilitätsprüfung fixiert und nicht als `latest` offen gelassen.
- `OFFEN` ob öffentliche, veröffentlichte Menü-/Öffnungszeitendaten direkt über eine lesende API oder als beim Build erzeugter Snapshot ausgeliefert werden. Ziel ist Aktualität ohne Verlust der statischen Ausfallsicherheit.
- `OFFEN` Objektspeicher für Speisekartenbilder, Staging-/Produktionsdienste sowie Domain-/DNS-Verantwortung.

## 22. Sicherheits- und Vertrauensgrenzen (`VORSCHLAG`)

- Öffentliche Eingaben werden serverseitig gegen ein gemeinsames Schema validiert, normalisiert und größenbeschränkt.
- Reservierungs- und Anfrageendpunkte erhalten Rate-Limits, Bot-/Spam-Schutz, generische Fehlermeldungen und keine Auskunft darüber, ob eine E-Mail bereits bekannt ist.
- Schreibende Admin-Endpunkte akzeptieren nur eine vom Clerk Express SDK serverseitig verifizierte Session und prüfen zusätzlich aktives Adminprofil und Rolle. Clientseitige Clerk-Komponenten oder UI-Sichtbarkeit ersetzen keine Autorisierung.
- Der Zugang zum Adminbereich wird nicht allein durch einen möglichen Clerk-Sign-in beschränkt. Nur vorher zugelassene Clerk-User-IDs erhalten ein aktives `admin_profiles`-Dokument; alle anderen authentifizierten Benutzer erhalten `403 Forbidden`.
- Clerk Publishable Key darf im Vite-Client verfügbar sein. Clerk Secret Key bleibt ausschließlich als Render-Secret im Express-Backend. Development- und Production-Instanzen sowie Redirect-URLs werden getrennt konfiguriert.
- OAuth-Redirects und `authorizedParties` werden auf die tatsächlichen lokalen und Render-Domains begrenzt. Zustandsänderungen bleiben durch Clerk-Sessionprüfung sowie passende Origin-/CSRF-Maßnahmen geschützt.
- Login- und OAuth-Sicherheitsfunktionen werden nicht selbst nachgebaut. Reservierungs-, Rollen-, Daten- und Geschäftslogik bleiben vollständig im eigenen Backend.
- Da Produktion dieselbe Origin verwendet, bleibt CORS standardmäßig geschlossen. Nur ausdrücklich benötigte Preview-/Entwicklungsursprünge werden freigegeben.
- Mutationen erzeugen unveränderliche Audit-Ereignisse mit Akteur, Zeitpunkt, Objekt, Aktion und minimal erforderlicher Änderungsinformation; Passwörter, Tokens und unnötige personenbezogene Inhalte werden nie protokolliert.
- E-Mail-Versand läuft über eine Outbox mit eindeutigen Ereignisschlüsseln. Wiederholungen dürfen keine doppelten Bestätigungen erzeugen.
- Backups, Wiederherstellungstest, Secret-Rotation, Monitoring und Incident-Ablauf sind Produktionskriterien, keine späteren Extras.

### Eigene Autorisierungsobjekte neben Clerk

- `admin_profiles`: eindeutige Clerk-User-ID, interne Rolle, Aktivstatus, Anzeigename, Erstellungs-/Änderungszeit und optional letzter erfolgreicher Adminzugriff.
- `audit_events`: administrative Aktion, Clerk-Akteur-ID, Zielobjekt, Zeitpunkt und sichere Metadaten ohne Tokens oder unnötige Gastdaten.

Clerk bleibt Quelle für Identität und Session. MongoDB bleibt Quelle für die fachliche Adminberechtigung. Rollen werden nicht aus frei änderbaren Benutzer-Metadaten übernommen.

## 23. Fachliches Reservierungsmodell (`ENTWURF`)

### Kernobjekte

- `restaurant_settings`: Zeitzone, Buchungshorizont, Vorlauf, Standarddauer und veröffentlichte Regeln.
- `dining_areas`: optionale Bereiche wie Gastraum oder Terrasse; reale Bereiche sind `OFFEN`.
- `restaurant_tables`: interner Name, Mindest-/Maximalkapazität, Bereich, aktiv/inaktiv und gegebenenfalls Kombinationsgruppe.
- `service_periods`: wöchentliche buchbare Servicezeiten getrennt von bloßen Öffnungszeiten.
- `special_openings` und `closures`: datierte Abweichungen, Feiertage, private Veranstaltungen und Sperrzeiten.
- `reservations`: öffentlicher Referenzcode, Gastdaten, Personenanzahl, Start/Ende, Locale, Status, Quelle, Datenschutzzeitpunkte und interne Notiz getrennt von Gastnotizen.
- `reservation_table_assignments`: Zuordnung einer Reservierung zu einem oder mehreren Tischen.
- `reservation_locks`: technische Sperrdokumente pro Tisch und Zeitsegment mit eindeutigem zusammengesetztem Index gegen Doppelbelegungen.
- `reservation_events`: Statushistorie für Bestätigung, Änderung, Storno, No-show und manuelle Eingriffe.
- `inquiries`: Veranstaltungsanfragen mit eigenem Status und minimal erforderlichen Kontaktdaten.
- `menu_categories` und `menu_items`: mehrsprachige Inhalte, Preise als Decimal/Minor-Unit-Entscheidung `OFFEN`, Sortierung, Aktiv- und Veröffentlichungsstatus.
- `menu_item_images`: Speicher-URL, Dimensionen, MIME-Typ, Alternativtexte, Rechte-/Quellstatus und Sortierung.
- `opening_hours` und `opening_hour_exceptions`: öffentlich angezeigte reguläre Zeiten und datierte Abweichungen; buchbare `service_periods` bleiben fachlich getrennt.
- `email_outbox`: Ereignistyp, Empfängerreferenz, Payloadversion, Idempotenzschlüssel, Versuche, nächster Versuch und Versandstatus.

### Statusmodell

`pending`, `confirmed`, `declined`, `cancelled_by_guest`, `cancelled_by_restaurant`, `seated`, `completed`, `no_show`.

Ob eine Anfrage sofort `confirmed` oder zunächst `pending` wird, hängt von den noch offenen Betriebsregeln ab. Ein Status darf nur über erlaubte Übergänge verändert werden; jede Änderung erzeugt ein Ereignis.

### Atomare Verfügbarkeitsentscheidung

1. Eingabe und Zeitzone validieren.
2. Servicezeit, Sonderöffnung, Sperrung, Vorlauf, Buchungshorizont und Gruppengröße prüfen.
3. Geeignete aktive Tische beziehungsweise erlaubte Kombinationen bestimmen.
4. Deterministisch die kleinste passende zulässige Belegung auswählen.
5. Innerhalb einer MongoDB-Transaktion für jeden belegten Tisch und jedes betroffene Zeitsegment Sperrdokumente mit eindeutigem zusammengesetztem Index anlegen. Ein Indexkonflikt bedeutet, dass eine parallele Anfrage zuvor gewonnen hat.
6. Bei Konflikt erneut berechnen oder ablehnen; ansonsten Reservierung, Tischzuordnung und Sperrdokumente gemeinsam speichern oder vollständig zurückrollen.
7. Erst nach erfolgreichem Commit ein Outbox-Ereignis für E-Mails erzeugen.

Die öffentliche Verfügbarkeitsabfrage ist nur eine Momentaufnahme. Ausschließlich der erfolgreiche Transaktionsabschluss bestätigt die Buchung. Mongoose-Transaktionen laufen nicht mit parallelen Operationen innerhalb derselben Session; alle beteiligten Schreibschritte werden bewusst seriell ausgeführt.

## 24. Vorläufiges API-Inventar (`VORSCHLAG`)

### Öffentlich

- `GET /api/public/config` – veröffentlichte Buchungsregeln und notwendige Formularoptionen.
- `GET /api/public/availability?date=…&partySize=…` – verfügbare Startzeiten ohne interne Tischdetails.
- `POST /api/public/reservations` – atomare Reservierungsanfrage; wiederholte Übermittlung über Idempotency-Key absichern.
- `POST /api/public/reservations/:reference/cancel` – nur mit sicherem, zeitlich begrenztem Gast-Token; genaue Stornoregel `OFFEN`.
- `GET /api/public/menu` und `GET /api/public/opening-hours` – ausschließlich veröffentlichte Inhalte.
- `POST /api/public/inquiries` – Veranstaltung anfragen; Felder und Empfänger `OFFEN`.

### Geschützt

- `/api/admin/reservations` – Listen, Details, Anlegen, Ändern, Stornieren, Statuswechsel und Tischzuordnung.
- `/api/admin/calendar` – Tages-/Wochenbelegung, Sperrungen und Sonderöffnungen.
- `/api/admin/tables` und `/api/admin/settings` – Kapazität und Buchungsregeln.
- `/api/admin/menu` – Kategorien, Gerichte, Preise, Beschreibungen, Bilder, Sortierung und Veröffentlichung.
- `/api/admin/opening-hours` – reguläre und datierte Abweichungen.
- `/api/admin/inquiries` – Eingang, Status und interne Bearbeitung.

Fehler verwenden stabile maschinenlesbare Codes, eine sichere Nutzermeldung und eine serverseitige Korrelations-ID. Personenbezogene Details erscheinen nicht in URLs oder Logs.

## 25. Admin-Dashboard (`VORSCHLAG`)

- Eigene Route unter `/admin`; nicht in öffentliche Navigation, Sitemap oder `hreflang` aufnehmen und mit `noindex` ausliefern.
- Clerk-OAuth-Anmeldung, Sessionablauf, Abmeldung, Fehlerzustände und Fokusführung sind vor fachlichen Modulen umzusetzen. Nicht zugelassene, aber erfolgreich authentifizierte Personen erhalten eine verständliche Zugriff-verweigert-Ansicht.
- Startansicht: heutige Reservierungen, offene Anfragen, nächste Sperrung und klar gekennzeichnete Fehlerzustände.
- Kalender: Tag/Woche, verständliche Statuslegende und zugängliche Listenalternative; Drag-and-drop ist höchstens progressive Verbesserung.
- Reservierungen: Suche, Filter, Detail, Statuswechsel, Tischzuordnung und nachvollziehbare Historie.
- Speisekarte und Öffnungszeiten: Entwurf/Veröffentlicht, Vorschau, explizites Publizieren und Warnung bei ungespeicherten Änderungen.
- Destruktive Aktionen benötigen Bestätigung; fachlich relevante Datensätze werden bevorzugt deaktiviert oder storniert statt hart gelöscht.
- Das öffentliche Notte-Design bleibt erhalten. Das Dashboard verwendet dieselben Grundtokens, aber eine nüchterne, dichte Arbeitsoberfläche ohne Marketing-Motion.

## 26. Datenschutz und Aufbewahrung (`OFFEN`)

Vor `FS4` müssen mindestens festgelegt und rechtlich geprüft sein:

- Pflichtfelder, Zweck und Rechtsgrundlage je Formular.
- Aufbewahrungsfrist für Reservierungen, stornierte Buchungen, No-shows, Anfragen, Auditdaten und E-Mail-Ereignisse.
- Prozess für Auskunft, Berichtigung und Löschung sowie Verantwortlicher im Restaurant.
- Datenschutzerklärung, Auftragsverarbeitungsverträge, Anbieterregionen und gegebenenfalls Drittlandtransfer.
- Inhalt und Zeitpunkt der Einwilligung, falls Daten über die reine Reservierungsabwicklung hinaus verwendet werden.

Marketing-Einwilligung wird nicht mit der Reservierung gebündelt. Zahlungsdaten und besondere Kategorien personenbezogener Daten werden nicht erhoben.

## 27. Teststrategie der Full-Stack-Erweiterung (`VORSCHLAG`)

- Unit-Tests: Zeitfenster, Statusübergänge, Validierung, Locale- und Preisformatierung.
- Datenbanktests: Schema- und Indexregeln, idempotente Migrationen, gering privilegierter Atlas-Datenbankbenutzer, atomare Zuweisung und parallele Reservierungsversuche auf einem Replica Set.
- API-Integration: Authentifizierung, Autorisierung, Rate-Limits, Idempotenz, Fehlercodes und E-Mail-Outbox.
- Komponenten-/Browsertests: Reservierungsformular, alle Zustände, Admin-Login, Tastaturfluss, Kalender-Listenalternative und Inhaltseditoren.
- End-to-End: erfolgreiche Zusage, ausgebuchter Slot, parallele letzte Kapazität, Storno, manuelle Änderung, E-Mail-Wiederholung und Veröffentlichung von Menü/Öffnungszeiten.
- Sicherheitsprüfung: Zugriff ohne/falsche Rolle, IDOR, Eingabegrenzen, XSS, Uploadtypen, Secret-Leaks, CORS/CSRF und Dependency-Audit.
- Regression: bestehende öffentliche Routen, Motion-Fallbacks, Speisekartenoverlay, dreisprachige Navigation, Build und visuelle Kernansichten.

## 28. Abnahmekriterien für die Gesamtfunktion (`ENTWURF`)

- Zwei parallele Anfragen können dieselbe letzte Tischkapazität nicht doppelt bestätigen.
- Öffnungs-, Service-, Sperr-, Vorlauf-, Dauer- und Gruppengrößenregeln werden serverseitig erzwungen.
- Gäste erhalten genau eine zur gespeicherten Statusentscheidung passende E-Mail; ein Mailfehler ändert eine bestätigte Reservierung nicht rückwirkend.
- Nicht angemeldete und unberechtigte Benutzer erhalten keinen Zugriff auf Admin- oder personenbezogene Daten.
- Jede fachliche Adminänderung ist einem Akteur und Zeitpunkt zuordenbar.
- Veröffentlichte Menü- und Öffnungszeitendaten erscheinen konsistent, während Entwürfe öffentlich unsichtbar bleiben.
- Die bestehende Website bleibt in Gestaltung, öffentlicher Route und Performancebudget regressionsfrei; neue Admin-/Backend-Chunks werden nicht für den Hero geladen.
- Typecheck, Lint, Unit-, Datenbank-, Integrations-, E2E-, Accessibility- und Production-Build-Prüfungen sind tatsächlich erfolgreich ausgeführt und dokumentiert.
- Datenschutztexte, Aufbewahrung, Anbietervereinbarungen, Backup/Restore und Produktionsmonitoring sind vor Livegang bestätigt.

## 29. Full-Stack-Gate

`FS0` endet mit dieser Analyse und Roadmap. Es wurden weder Anwendungscode noch Datenbankschema noch Abhängigkeiten implementiert. Vor `FS1` sind ein ausdrückliches `GO` und die in `TASKS.md` für `FS1` bezeichneten Entscheidungen erforderlich. Die frühere Gate-3-Freigabe der Marketing-Website gilt nicht als Freigabe dieser Erweiterung.
