# Projektplan und Entscheidungsstatus

**Status:** Full-Stack-Phase `FS1` – MongoDB-Atlas-Verbindung verifiziert; übrige Plattformaufgaben offen
**Letzte Aktualisierung:** 03.11.2026

Diese Datei ist die einzige verbindliche Quelle für Phasenstatus, Abhängigkeiten, Prioritäten, Freigaben und Implementierungsfortschritt. Fachliche Details bleiben in ihren zuständigen Dokumenten.

## Statuslegende

- `[ ]` nicht begonnen
- `[-]` begonnen oder blockiert
- `[x]` abgeschlossen und überprüft
- `GATE` ausdrückliche Nutzerfreigabe erforderlich

## Phase 1 – Discovery und Referenz-Audit

- [x] Master-Prompt und Dokumentationsauftrag auswerten.
- [x] Repository-Ausgangslage prüfen: zu Beginn waren nur Git-Metadaten vorhanden.
- [x] Referenz-Startseite im echten Browser bei Desktop- und Mobile-Viewport prüfen.
- [x] Beobachtungen, Annahmen, Risiken und Übertragungsgrenzen in `AUDIT.md` trennen.
- [x] `AGENTS.md` als dauerhafte Regelquelle anlegen.
- [x] Dokumentationsstruktur und Zuständigkeiten anlegen.
- [x] Projektname, Branche, Grundangebot, Qualitätsversprechen, Kernzielgruppe und Sprachen erfassen.
- [x] `AUDIT.md` mit den bisher bestätigten Projektinformationen aktualisieren.
- [x] Primäre und sekundäre Conversion-Ziele sowie den Ausschluss einer Online-Essensbestellung bestätigen.
- [x] Reservierung über externen Dienst und alternativ telefonisch festlegen; eigenes Reservierungsformular ausschließen.
- [x] Verbleibende unbekannte Angaben als nachzuverfolgende Abhängigkeiten dokumentieren.
- [x] Phase-1-Ergebnisse präsentieren und offene Konflikte schließen.
- [x] **GATE 1: Phase 1 durch „Okay, macht weiter“ ausdrücklich freigegeben.**

## Phase 2 – Kreativkonzept und Designsystem

**Abhängigkeit:** Gate 1.

- [x] Eigenständige Creative Direction „Materia Italiana“ mit Begründung entwickeln.
- [x] Sitemap, Navigation und Homepage-Dramaturgie vorschlagen.
- [x] Responsive Strategie definieren.
- [x] `DESIGN_SYSTEM.md` mit Tokens und Komponentenregeln ausarbeiten.
- [x] `CONTENT.md` mit Inhaltsarchitektur, Tonalität und Sprachstatus ausarbeiten.
- [x] Fotografie-/Asset-Richtung und individuelles Inventar definieren.
- [x] Motion-Konzept einschließlich Reduced Motion definieren; technische Details erst in Phase 3 verbindlich machen.
- [x] **GATE 2: Phase 2 durch „okay weiter“ ausdrücklich freigegeben.**

## Phase 3 – Technische Spezifikation

**Abhängigkeit:** Gate 2.

- [x] Architektur, Routing und Lokalisierung festlegen.
- [x] Datenmodelle, Integrationen und Asset-Pipeline definieren.
- [x] SEO-Rendering- und Metadatenstrategie festlegen.
- [x] Animationsinfrastruktur und Accessibility-Fallbacks festlegen.
- [x] Teststrategie und überprüfbare Akzeptanzkriterien formulieren.
- [x] `gpt-taste`-Umsetzungsvertrag und späteren `break-ui`-Testablauf verankern.
- [x] `SPEC.md` vollständig ausarbeiten.
- [x] Implementierungsplan und Abhängigkeiten aktualisieren.
- [x] **GATE 3: durch „Phase drei ist freigegeben.“ ausdrücklich freigegeben.**

## Phase 4 – Implementierung

**Abhängigkeit:** Gate 3.

- [x] Projekt mit freigegebenem Stack initialisieren.
- [x] Verpflichtenden `gpt-taste`-Designplan mit Seed 27 ausführen; Geist, Editorial Split, drei Komponentenarchitekturen und zwei GSAP-Paradigmen auswählen.
- [x] Design-Tokens und technische Grundlagen implementieren.
- [x] Gemeinsame Komponenten und Layouts bauen.
- [x] 15 lokalisierte Routen und vorläufige Inhalte integrieren.
- [x] Vier generierte Konzeptbilder integrieren und sichtbar als nicht-reale Restaurantfotografie kennzeichnen.
- [x] Lokalisierung, Metadaten, Canonical und `hreflang` implementieren.
- [x] GSAP-Pinning und Kartenstapel mit Reduced-Motion-Fallback umsetzen.
- [x] Typecheck, Lint, Unit-Tests und statischen Production-Build erfolgreich ausführen.
- [x] `break-ui`-Zustände implementieren, gefundene Überläufe und Leerraumprobleme beheben und erneut prüfen.
- [x] Mobilmenü auf volle Viewporthöhe korrigieren sowie Fokusfalle, Escape-Schließen und Fokusrückgabe implementieren und prüfen.
- [x] Entwicklungs- und Build-Auflösung des `~/`-Alias vereinheitlichen.
- [x] Dokumentensprache und Skip-Link für Deutsch, Englisch und Italienisch lokalisieren.
- [ ] Externe Reservierungs- und Veranstaltungslinks nach Lieferung echter Ziele integrieren.
- [ ] Reale Geschäftsdaten, Logo und finale Speisekarte integrieren.

## Phase 5 – Visuelle QA und Optimierung

**Abhängigkeit:** Implementierung der prüfbaren Funktionen.

- [x] Repräsentative mobile, Tablet- und Desktop-Viewports im Browser prüfen.
- [x] Typografie, Navigation sowie Demo-, Worst-Case-, Leer- und Ein-Element-Zustände prüfen.
- [-] Motion, Reduced Motion und weitere Screenreader-relevante Zustände prüfen; Tastaturbedienung des Mobilmenüs ist verifiziert.
- [x] Gefundene Layout-, Alias-, Sprach- und Fokusprobleme beheben und erneut prüfen.
- [x] Vier klar divergierende Homepage-Prototypen unter `/prototypes/colosseo` isoliert von der produktiven Website umsetzen.
- [x] Design-Explorer auf mobilen und Desktop-Viewports, per Tastatur, URL-Persistenz und Konsole prüfen.
- [x] Bevorzugte Richtung „Notte“ mit vollständiger Inhaltsdramaturgie, GSAP-Wortmasken, Hero-Parallax, Split-Menü, Services-Slider und richtungsabhängigem Header erweitern; Lenis nach reproduziertem Scrollkonflikt wieder entfernen.
- [x] Nutzerbestätigte Adresse Bahnhofstraße 42–45 und Telefonnummer 04171 62952 in Prototyp und Inhaltsquelle übernehmen.
- [x] Bereitgestelltes Pizza-Video im Notte-Hero ohne Autoplay integrieren, per GSAP ScrollTrigger reversibel scrubben und mit responsivem Pinning, linksbündigem Text sowie Reduced-Motion-Poster absichern.
- [x] Performante Layer-Reveal-Transition zwischen gepinntem Notte-Hero und Intro-Section mit transformbasierter Scrollbewegung, statischem Ebenenschatten und Reduced-Motion-Fallback umsetzen.
- [x] Fünf freigegebene reale Restaurantfotos strukturiert ablegen und die zweite Notte-Section mit Innenraumfoto, bestätigtem Begrüßungstext sowie lokaler Bodoni-Moda-Signatur neu gestalten.
- [x] Bevorzugte Notte-Richtung als deutsche Hauptseite unter `/de` aktivieren und den internen Demo-Datenumschalter aus regulären Seiten entfernen; der Design-Explorer bleibt separat erhalten.
- [x] Designrichtung „Notte“ durch den Nutzerauftrag zur eigentlichen Website festgelegt und unter `/de` aktiviert.
- [x] Notte-Speisekarte nach finaler Nutzerfreigabe auf eine vollständig gepinnte Editorial-Bühne umstellen: ein konstantes Foto, ausschließlich vertikal scrollende Gerichtsspur, Freigabe nach dem letzten Gericht und reversibler Rücklauf; Trennlinien bleiben entfernt.
- [x] `break-ui`-Befund dokumentiert und behoben: transformierte Medien und der richtungsabhängige Header vergrößerten bei 320 px die horizontale Scrollfläche; Root-Clipping ergänzt und erneut geprüft.
- [x] Vollbild-Speisekarte für „Notte“ mit 8 Filtern und 129 aus den offiziellen Karten geprüften Einträgen umsetzen; sticky Filterleiste, Escape-Schließen, Scrollsperre, Reduced Motion und Fokusrückgabe ergänzen.
- [x] Speisekarten-Audit beheben: abgeleitete Mittagstexte und technische IDs entfernen, PDF-Überschriften und Originalbeschreibungen übernehmen, Allergene samt Legende ergänzen, URL-Hashes und erhaltene Scrollposition beseitigen sowie Detail-Schließen reparieren.
- [x] Blockiertes beziehungsweise verzögertes Scrollgefühl beheben: globale Lenis-Glättung entfernen und Hero-Pinning von 500/620 auf 240/300 Viewport-Prozent reduzieren.
- [x] Redundante Gericht-Detailansicht vollständig entfernen und Gerichte als kompakte, nicht interaktive Listeneinträge ausgeben.
- [x] Verschwundene Notte-Hauptnavigation wiederherstellen: automatisches Wegfahren entfernen und Navigationspunkte unter 900 px als kompakte zweite Zeile erhalten.
- [x] Drei Gerichte der Startseiten-Vorschau einschließlich Großschreibung, Kategorieüberschrift und Satzzeichen exakt an die Originalkarten angleichen.
- [x] Freigegebenen Begrüßungstext ohne Hero-Änderung neu verteilen und direkt nach der Speisekarten-Vorschau eine performante, typografische Familiengeschichte mit responsiver Einzelspalte und Reduced-Motion-Fallback ergänzen.
- [x] Familiengeschichte als 70svh großes, bildfüllendes Sticky-Kapitel mit Parallax, dunklem Scrim, einmaliger Textchoreografie und Reduced-Motion-Fallback ausführen; dekorative Jahreszahl entfernen.
- [x] Bewertungssection auf zwölf direkt im angemeldeten Google-Unternehmensprofil verifizierte Vier- und Fünf-Sterne-Stimmen erweitern; zwei gegenläufige Reihen, visuelle Sterne, Hover-/Fokus-Pause, Reduced-Motion-Scroll und nach neuer Nutzerentscheidung exakt 50svh Höhe umsetzen.
- [x] Reservierungsabschluss direkt nach den Bewertungen als responsives 7/5-Editorial-Raster mit bestätigter Telefonaktion, Wort-Reveal, transformbasierter Eintrittschoreografie und Reduced-Motion-Fallback umsetzen; offenen externen Reservierungslink nicht erfinden.
- [x] Reservierungsabschluss nach Nutzerfreigabe um eine performante „Vino Ember“-WebGL-Fläche erweitern; Bewegung auf sichtbare Desktop-/Tablet-Zustände begrenzen und statische Mobile-, Reduced-Motion- sowie WebGL-Fallbacks erhalten.
- [x] Vorhandene Section „Feiern im Colosseo“ um eine eigene einmalige GSAP-Choreografie für Bild, Begleittext und Anfrageaktion ergänzen; Wort-Reveal beibehalten und Reduced Motion respektieren.
- [x] Redundante Mittag-/Abend-Section nach Nutzerentscheidung vollständig aus Markup, Responsive-Regeln und Styles entfernen.
- [x] Nutzerfreigegebene Seitenreihenfolge umsetzen: Hero, Begrüßung, Speisekarte, Familiengeschichte, Feiern, Bewertungen, Reservierung und Besuchsabschluss.
- [x] Redundanten Services-Slider einschließlich unbestätigter Serviceaussagen, Zustandslogik und sämtlicher CSS-Regeln entfernen; hochwertige Anlass-Section als einzigen Veranstaltungsbereich behalten.
- [x] Deutsche Notte-Startseite nach Atomic Pattern in zentrale Inhalte, Atoms, Molecules, Section-Organisms und reine Page-Komposition zerlegen; bestehende Motion-Selektoren und Fokus-Rückgabe erhalten.
- [x] Besuchsabschluss ohne redundantes Eingangsfoto mit kompakten Öffnungszeiten, Kontaktaktionen, datenschutzfreundlichem Google-Maps-Link und eigener transformbasierter Eintrittsbewegung neu gestalten.
- [x] Reload-Fehler beheben: native Scrollwiederherstellung vor der GSAP-Initialisierung deaktivieren, Scrollposition synchron auf den Seitenanfang setzen und Reload-Fragmente entfernen.
- [x] Navigation am Seitenanfang randlos über volle Breite setzen, beim Scrollen zur Glasnavigation verdichten, abwärts ausblenden und aufwärts sanft zurückführen; Links auf Speisekarte, Feiern und Kontakt fokussieren.
- [x] Hero-CTA-Hierarchie zugunsten der telefonischen Reservierung schärfen und Seiteneinstieg gestaffelt animieren, ohne eine konfliktanfällige globale Smooth-Scroll-Engine einzuführen.
- [x] Reservierungsabschluss auf 54svh verdichten, Kontaktabschluss ohne redundantes Foto neu ordnen und das reale Eingangsfoto als vollflächigen Ortsbeleg in die Familiengeschichte verschieben.
- [x] Header-Bug bei kleinen Scrollimpulsen mit 96/72-px-Hysterese beheben, Rückkehrbewegung auf 280 ms beruhigen und noch unversorgte Sections mit einmaligen gestaffelten Reveals ergänzen.
- [x] Sticky-Familienkapitel auf den gemeinsamen Story-/Anlass-Übergangscontainer begrenzen, sodass es nach der direkt folgenden Section vollständig endet; Lenis als spürbare Wheel-Trägheit mit GSAP-Ticker-Synchronisierung, nativem Touch und Overlay-Ausschluss kontrolliert wieder einführen.
- [x] `break-ui`-Regression vom 23.10.2026 beheben und im Browser erneut prüfen: gemeinsamen Mittelpunkt und langsamen Header-Morph herstellen; `/de`, `/en` und `/it` auf dieselbe Notte-Komposition führen; Footer-Sprachen ohne Dokument-Neuladung wechseln; Video/Wash/Text in stabile Ebenen trennen, damit das Scrubbing den Hero-CTA nicht übermalt.
- [x] Freigegebenes Typografiesystem aus Designvariante A in die produktive Website übertragen: Instrument Serif für Display-, Zitat- und Signaturrollen sowie DM Sans für Text und UI lokal über Fontsource einbinden; Geist und Bodoni Moda entfernen.
- [x] Bild der Feiern-Section durch das vom Nutzer bereitgestellte Abendessenmotiv ersetzen, lokal unter `public/images/colosseo/` ablegen und den Alternativtext aktualisieren.
- [x] Sticky-Speisekarten-Section nach neuer Nutzerentscheidung wieder auf 100 Viewport-Höhenprozent setzen; mobile Aufteilung auf 42/58 Viewport-Höhenprozent anpassen und die drei Gerichtsfotos weiterhin synchron mit unterbrechbarem GSAP-Crossfade wechseln.
- [x] Speisekarten-Section als exaktes 50/50-Raster verfeinern: Gerichtsbilder links auf 60 Prozent der Spaltenbreite zentrieren, leicht abrunden und richtungsabhängig von oben nach unten beziehungsweise reversibel ein- und ausführen; mobil auf 78 Prozent Bildbreite anpassen.
- [x] Speisekarten-Section nach der neuen visuellen Referenz auf eine einheitliche cremefarbene Editorial-Bühne mit kleinem quadratischem Foto, großzügiger Negativfläche und synchronem Buchstabenwechsel des Gerichtnamens umstellen; responsive und Reduced-Motion-Zustände ergänzen.
- [x] Richtungsfehler des Menübildwechsels korrigieren: abwärts fährt das nächste Bild vollständig von unten nach oben, aufwärts exakt reversibel; maskierter Überlauf, unterbrechbare GSAP-Timeline und das verbindliche Zwei-Schriften-System bleiben erhalten.
- [x] Menübilder auf eine kontinuierlich gescrubbte Ganzstreckenbewegung umstellen: Eintritt hinter dem unteren Sectionrand, zentraler Rastpunkt, vollständiger Austritt über den oberen Sectionrand sowie verzögerter Textwechsel erst am Rastpunkt.
- [x] Browser-Annotation zur Menüausrichtung übernehmen: ersten und alle folgenden Bildrastpunkte geometrisch auf die Textmitte ausrichten, vor jeder Ausfahrt eine kurze Ruhephase ergänzen und Folgebilder mit responsivem 96–150-px-Abstand vollständig unterhalb der Section starten lassen.
- [x] Das frühere pauschale Mobile-Lite-Profil am 03.11. korrigieren: Touch/kleine Viewports deaktivieren nicht länger den gesamten Motion-Stack; Lenis, Video-Layer und Parallax bleiben mobil ausgespart, sticky Speisekarte, einmalige Reveals, Navigation und Bewertungsband sind wieder aktiv.
- [x] Netlify-Konfiguration auf den tatsächlichen Vite-Ausgabeordner `dist`, Standardumleitung auf `/de` und SPA-Fallback ausrichten.

## Phase 6 – Finale Qualitätssicherung

- [x] Typecheck, Lint, Unit-Tests und Production Build auf dem aktuellen Stand ausführen.
- [-] Funktion, Lokalisierung, Barrierefreiheit und Links prüfen; Vollbild-Speisekarte ist auf Deutsch funktional geprüft, Übersetzungen und gesamtheitliche Linkprüfung bleiben offen.
- [ ] Performance und SEO mit geeigneten Werkzeugen messen.
- [ ] Ergebnisse und verbleibende Abhängigkeiten nachvollziehbar dokumentieren.
- [ ] Deployment-Anleitung bereitstellen.
- [ ] Nicht ohne ausdrückliche Erlaubnis deployen.

## Freigabeprotokoll

| Datum | Gate | Status | Umfang / Hinweis |
|---|---|---|---|
| 10.10.2026 | Gate 1 | Freigegeben | Nutzer: „Okay, macht weiter.“ Phase 2 autorisiert. |
| 10.10.2026 | Gate 2 | Freigegeben | Nutzer: „okay weiter“. Phase 3 autorisiert. |
| 10.10.2026 | Gate 3 | Freigegeben | Nutzer: „Phase drei ist freigegeben.“ Phase 4 autorisiert. |
| 30.10.2026 | FS0-Dokumentation | Freigegeben | Nutzer: „go“. Autorisiert wurden Backend-Cockpit und Zwei-Personen-Tagesplan; dies ist ausdrücklich keine Gate-Freigabe für `FS1`. |
| 02.11.2026 | Gate FS0 / Start FS1 | Freigegeben | Nutzer bestätigt MongoDB Atlas ohne zusätzliche Docker-Datenbank und erteilt ausdrücklich „Go für FS1“. |

## Aktuelle Blocker

- Business-Briefing ist teilweise bestätigt; verbleibende Punkte siehe offene Fragen in `AUDIT.md`.
- Logo ist vorhanden, liegt jedoch noch nicht als nutzbare Datei mit Anwendungsregeln vor; Farben, Schriften und Bildmaterial fehlen.
- Reservierungsanbieter/-URL und der externe Veranstaltungsanfrageweg fehlen noch.
- Adresse und Telefonnummer sind bestätigt; E-Mail, Öffnungszeiten, übrige Geschäfts- und Rechtsangaben müssen noch final bestätigt beziehungsweise geliefert werden.

## Testskill-Status

- `break-ui` wurde gegen lange Navigations-, CTA-, Überschrifts-, Menü- und Kontakttexte sowie leere und einzelne Datensätze eingesetzt.
- Das Vollbild-Speisekarten-Overlay wurde zusätzlich mit den längsten realen Gerichtsnamen, der fehlenden Bruschetta-Beschreibung, 129 Einträgen und schmaler Browseransicht geprüft; Namen umbrechen, Preise und Schließen-Aktionen bleiben erreichbar, und es entstand kein neuer dokumentierter Überlauf.
- Mobile, Tablet- und Desktopzustände wurden nach den Korrekturen ohne dokumentweiten horizontalen Überlauf erneut geprüft.
- OFFEN: fehlende Bilder und 200-Prozent-Zoom separat verifizieren.

## Verbindlicher Umsetzungsskill

- Phase 4: `gpt-taste` vor jedem ersten UI-Code anwenden und den geforderten `<design_plan>` erstellen.
- Die dort deterministisch gewählte Typografie ersetzt den früheren Schriftvorschlag und wird anschließend in `DESIGN_SYSTEM.md` konkretisiert.

## Full-Stack-Erweiterung – Gate-basierte Roadmap

Der Auftrag vom 30.10.2026 erweitert den früher freigegebenen Umfang wesentlich. Die bestehende Phase 6 der Marketing-Website bleibt mit ihren offenen Qualitätspunkten bestehen; Full-Stack-Arbeiten werden separat als `FS0` bis `FS8` verfolgt. Jede Phase endet mit Dokumentation, tatsächlich ausgeführten Tests, Ergebnisbericht und einem neuen Gate.

### FS0 – Bestandsanalyse und Architekturentwurf

- [x] Repository, Build, Routing, Hosting, Inhalte und vorhandene Tests prüfen.
- [x] Konflikt zur früheren Abgrenzung „kein eigenes Backend/CMS“ identifizieren.
- [x] Sicherheits-, Datenschutz-, Parallelitäts- und Betriebsrisiken erfassen.
- [x] Zielarchitektur, Domänenmodell, API-Inventar, Teststrategie und Phasenfolge als `VORSCHLAG` dokumentieren.
- [x] Dauerhafte Backend-, Datenbank- und Gate-Regeln in `AGENTS.md` ergänzen.
- [x] `docs/BACKEND.md` als schnellen, nicht duplizierenden Einstieg in Architektur, Regeln, Quellen und nächsten zulässigen Schritt erstellen.
- [x] `docs/DAILY_PLAN.md` als operative Zwei-Personen-Planung für 02.11.–20.11.2026 samt Tagesstart, Tagesabschluss, Blockaden und Übergabeformat erstellen.
- [x] Kursunterlagen intern als Vollständigkeitskontrolle prüfen, ohne eine detaillierte Lernstoff- oder Quellenmatrix im Projekt abzulegen.
- [x] Zielentscheidung TanStack Router dokumentieren und Migration vom aktuellen React Router einschließlich Prerender-/SEO-Risiko in `FS1` einplanen.
- [x] `docs/DAILY_PLAN.md` nach Nutzerentscheidung auf 02.11.–13.11.2026 verdichten und zusätzliche Projektthemen separat kennzeichnen.
- [x] Technische Baseline verifizieren: Typecheck, Lint, 7 Unit-Tests und Production-Build erfolgreich. Ein initial parallel zu Typecheck gestarteter Testlauf kollidierte im gemeinsamen React-Router-Typegen-Ausgabeordner; der anschließende isolierte Testlauf war erfolgreich. CI muss Typegen-verwendende Schritte seriell oder mit getrennten Ausgabeverzeichnissen ausführen.
- [-] Fachliche und betriebliche Fragen mit dem Nutzer klären; Atlas-Betriebsform ist bestätigt, Reservierungsregeln bleiben offen.
- [x] **GATE FS0:** Zielarchitektur und Start von `FS1` am 02.11.2026 ausdrücklich freigegeben.

### FS1 – Plattformgrundlage und reproduzierbare Datenbank

**Start bestätigt:** GO für `FS1` sowie MongoDB Atlas ohne zusätzliche lokale Docker-Datenbank wurden am 02.11.2026 bestätigt. Die lokale Verbindung zum eingerichteten Atlas-Cluster wurde am 02.11.2026 mit `npm run db:check` verifiziert. Am 03.11.2026 wurden ausschließlich datenbankspezifische `readWrite`-Rollen für `colosseo` und `colosseo_test` technisch verifiziert; Entwicklungsverbindung, Testverbindung und Test-Migrationslauf sind erfolgreich. Der Nutzer bestätigte MongoDB `8.0.36`, AWS Frankfurt (`eu-central-1`) und ein Replica Set mit drei Nodes. Backups sind derzeit inaktiv und bleiben vor einem realen Produktionsbetrieb offen.

- [x] Lokale Entwicklungs- und Umgebungsvariablenstrategie ohne Secrets im Repository einrichten: `.env` wird ignoriert, `.env.example` enthält ausschließlich Platzhalter und Zod validiert MongoDB-Werte.
- [-] TanStack Router ist im Quellcode implementiert; Typecheck, OXLint, 24 Unit-Tests und Production-Build laufen. Am 03.11.2026 wurden `/de`, `/en`, `/it`, direkter Reload und die gestaltete 404-Seite im lokalen Produktions-Build verifiziert; Netlify veröffentlicht `dist`. Der Build erzeugt für alle 15 lokalisierten Inhaltsrouten eigenes semantisches HTML mit lokalisierter Description, Open Graph und `Restaurant`-JSON-LD. Die über die verknüpfte Netlify-Site verifizierte Produktionsbasis `https://ristorante-colosseo-winsen.netlify.app` ist als `SITE_URL` gesetzt; Canonical, Hreflang, Sitemap und `robots.txt` wurden damit lokal erfolgreich geprüft. `OFFEN`: Regression nach einem ausdrücklich freigegebenen echten Netlify-Deployment.
- [x] Node-/Express-/TypeScript-Serverstruktur und getrennte `app`-/`server`-Startpunkte etablieren: `server/src/http/app.ts` kapselt die Express-App, `server/src/server.ts` den Prozessstart und das kontrollierte Herunterfahren.
- [-] Mongoose installieren und sichere, wiederverwendbare Verbindungslogik samt Statusprüfung und `db:check` etablieren; Installation, Verbindungslogik und echte Atlas-Verbindung sind verifiziert, Schemas/Modelle, Seed und typisierte Repositories bleiben offen.
- [ ] Kernschema für Einstellungen, Servicezeiten, Sondertage, Bereiche, Tische, Reservierungen, Zuweisungen, Ereignisse und Outbox umsetzen.
- [x] Versionierten, idempotent ausführbaren MongoDB-Migrationsrahmen mit Registry, Historie, Ausführungssperre, Status, Vorwärtslauf, einzelnem Rollback, sicherer Testzielprüfung und Unit-Tests ergänzen.
- [-] Getrennte Atlas-Testdatenbank `colosseo_test`, datenbankspezifische `readWrite`-Rollen, leerer Test-Migrationslauf sowie AWS Frankfurt (`eu-central-1`) und das dreiknotige Replica Set sind verifiziert beziehungsweise vom Nutzer bestätigt. Offen sind konkrete Indexmigrationen zusammen mit den bestätigten Modellen; Backups sind als späterer Produktionspunkt offen.
- [-] Express-Grundgerüst mit Healthcheck, Fehlerformat, Korrelations-ID und sicherer Basiskonfiguration aufsetzen; die statische Produktionsauslieferung bleibt als separater FS1-Restpunkt offen. Typecheck, Lint und Unit-Tests sind erfolgreich, ein echter Listener-Smoke-Test war in der Sandbox wegen `EPERM` blockiert.
- [-] Bestehenden öffentlichen Build lokal regressionsprüfen; Typecheck, Lint, 24/24 Tests, Build, erzeugte Sprachdateien und interaktive `/de`-Darstellung sind erfolgreich geprüft. Echte Netlify-Regression bleibt offen.
- [ ] **GATE FS1:** Schema, lokale Einrichtung, Tests und Sicherheitsgrenzen präsentieren; auf GO für `FS2` warten.

### FS2 – Admin-Authentifizierung und geschütztes Grundlayout

**Benötigt vor Start:** Clerk-Konto/Anwendung, gewünschte OAuth-Anbieter, erste Owner-Identität und Rollenmatrix.

- [ ] Clerk Development Instance, Vite-Client und Express-Middleware mit getrennten Secrets konfigurieren.
- [ ] OAuth-Anmeldung, Abmeldung, Sessionablauf, Redirect-Allowlist und Fehlerzustände umsetzen.
- [ ] Eigenes `admin_profiles`-Modell und sicheren Owner-Bootstrap für Clerk-User-IDs implementieren.
- [ ] `/admin` mit Lade-, Zugriff-verweigert- und geschützten Layoutzuständen erstellen.
- [ ] Owner-/Staff-Rechte als serverseitige Middleware-, Service- und API-Tests verankern.
- [ ] Admin aus Sitemap/Indexierung und öffentlicher Navigation ausschließen.
- [ ] Accessibility- und Security-Tests durchführen.
- [ ] **GATE FS2:** geschützten Zugang und Rollenprüfung präsentieren; auf GO für `FS3` warten.

### FS3 – Reservierungs- und Verfügbarkeitskern

**Benötigt vor Start:** reale Tischliste, Bereiche, Kombinationsregeln, Servicezeiten, Dauer/Buffer, Vorlauf, Buchungshorizont, Gruppengrenzen, Sperr- und Bestätigungsregeln.

- [ ] Pure Domainlogik für Zeitfenster und Statusübergänge umsetzen.
- [ ] Atomare Tischzuweisung einschließlich Parallelitätsschutz implementieren.
- [ ] Öffentliche Config-/Availability-/Reservation-API mit Validierung, Rate-Limit und Idempotenz erstellen.
- [ ] Admin-API für manuelle Reservierungen und Sperrzeiten ergänzen.
- [ ] Concurrency-, Grenzzeit-, Zeitzonen- und Ausgebucht-Tests ausführen.
- [ ] **GATE FS3:** Reservierungskern per API und Tests präsentieren; auf GO für `FS4` warten.

### FS4 – Öffentliche Reservierungsstrecke und Benachrichtigungen

**Benötigt vor Start:** freigegebene Formularfelder/-texte in DE/EN/IT, Datenschutzgrundlage, Stornoregeln, Absenderdomain, Restaurantempfänger und E-Mail-Anbieter.

- [ ] Reservierungsoberfläche in das bestehende Design integrieren, ohne Hero oder öffentliche Dramaturgie unnötig zu verändern.
- [ ] Zugängliche Datum-, Uhrzeit-, Personen- und Kontaktdateneingabe mit vollständigen Zuständen umsetzen.
- [ ] Outbox-Verarbeitung und idempotente Gast-/Restaurant-E-Mails integrieren.
- [ ] Sichere Gaststornierung nur bei freigegebener Regel ergänzen.
- [ ] Spam-, Fehler-, Locale-, Mobile-, Reduced-Motion- und E2E-Prüfungen ausführen.
- [ ] **GATE FS4:** komplette Gaststrecke präsentieren; auf GO für `FS5` warten.

### FS5 – Reservierungs-, Kalender- und Anfrageverwaltung

- [ ] Dashboardübersicht und zugängliche Tages-/Wochenansichten umsetzen.
- [ ] Reservierungssuche, Filter, Detail, Status, Tischzuweisung und Historie implementieren.
- [ ] Sonderöffnungen, Schließungen und Sperrzeiten verwalten.
- [ ] Veranstaltungsanfragen mit freigegebenen Feldern, Status und interner Bearbeitung integrieren.
- [ ] Berechtigungs-, Konflikt-, Tastatur- und E2E-Tests ausführen.
- [ ] **GATE FS5:** operative Verwaltung präsentieren; auf GO für `FS6` warten.

### FS6 – Speisekarte, Öffnungszeiten und Medienverwaltung

- [ ] Kategorien, Gerichte, Preise, Beschreibungen, Allergene, Sortierung und Aktivstatus verwalten.
- [ ] Bild-Upload mit Größen-, Typ-, Rechte- und Alternativtextregeln integrieren.
- [ ] Reguläre Öffnungszeiten und datierte Abweichungen pflegen.
- [ ] Entwurf/Vorschau/Veröffentlichen und sicheren öffentlichen Fallback umsetzen.
- [ ] Bestehende verifizierte Daten kontrolliert migrieren; keine Inhalte automatisch umformulieren.
- [ ] Cache-, Veröffentlichungs-, Upload- und Regressionsprüfungen ausführen.
- [ ] **GATE FS6:** CMS-Funktionen und öffentliche Synchronisation präsentieren; auf GO für `FS7` warten.

### FS7 – Datenschutz, Sicherheit, Betrieb und vollständige QA

- [ ] Aufbewahrung, Löschung, Auskunft und Datenexport technisch umsetzen und dokumentieren.
- [ ] Auditlog, Monitoring, Alarmierung, Rate-Limits und Secret-Rotation prüfen.
- [ ] Backup und Wiederherstellung in einer Nicht-Produktionsumgebung nachweislich testen.
- [ ] Dependency-, Auth-, Autorisierungs-, IDOR-, XSS-, Upload-, CORS-/CSRF- und Log-Leak-Prüfungen durchführen.
- [ ] Gesamte Regression für öffentliche Website, Admin, API, Datenbank, E-Mails, Accessibility, Mobile und Performance ausführen.
- [ ] `break-ui` auf Formulare, Kalender, lange Menüinhalte, leere Daten und Fehlerzustände anwenden.
- [ ] **GATE FS7:** Abnahmebericht und offene Produktionsrisiken präsentieren; auf GO für `FS8` warten.

### FS8 – Produktionsmigration und kontrollierter Livegang

**Benötigt vor Start:** ausdrückliche Deployment-Erlaubnis, bestätigte Rechts- und Geschäftsdaten, produktive Render-/Resend-Konten, Domain, Verantwortliche und Rollbackfenster.

- [ ] Produktionsmigration und validierte Ausgangsdaten vorbereiten.
- [ ] Render Web Service und MongoDB Atlas möglichst regionsnah, Domain, E-Mail-DNS, Umgebungsvariablen, Monitoring und Backups konfigurieren.
- [ ] Smoke-Tests, Rollbackplan und Abnahmecheckliste ausführen.
- [ ] Erst nach gesonderter Freigabe deployen und keine Test-E-Mails an reale Gäste senden.
- [ ] **GATE FS8:** Livegang abnehmen und Betriebsübergabe dokumentieren.

## Offene Entscheidungen vor der Reservierungsimplementierung

1. `OFFEN` Welche realen Tische existieren, wie viele Plätze haben sie, welche dürfen kombiniert werden und gibt es getrennte Bereiche?
2. `OFFEN` Welche Zeiten sind tatsächlich reservierbar – unabhängig von den allgemeinen Öffnungszeiten?
3. `OFFEN` Wie lange gilt eine Belegung je Gruppengröße und ist ein Puffer zwischen Reservierungen nötig?
4. `OFFEN` Wie weit im Voraus, mit welchem Mindestvorlauf und bis zu welcher Gruppengröße darf automatisch gebucht werden?
5. `OFFEN` Soll jede passende Anfrage sofort bestätigt werden oder benötigen bestimmte Zeiten/Gruppen eine manuelle Freigabe?
6. `OFFEN` Welche Änderungs-, Storno-, No-show- und Verspätungsregeln gelten?
7. `OFFEN` Welche Pflichtfelder dürfen erhoben werden und wie lange werden Reservierungen, Anfragen und Logs gespeichert?
8. `OFFEN` Wer erhält Restaurant-E-Mails, welche Absenderdomain wird verwendet und wer verwaltet Render und Resend?
9. `OFFEN` Welche Personen erhalten Adminzugang und welche Rechte benötigen Owner und Mitarbeitende?
10. `OFFEN` Sollen bestehende Reservierungen oder andere Daten importiert werden?
11. `OFFEN` Soll die lokale MongoDB als Replica Set über Docker laufen oder ist bereits eine transaktionsfähige MongoDB-Entwicklungsumgebung vorhanden?
12. `OFFEN` Welcher externe Objektspeicher darf später für hochgeladene Speisekartenbilder verwendet werden?
13. `OFFEN` Welcher Clerk-OAuth-Anbieter soll erlaubt werden: Google, Microsoft oder beide?
14. `OFFEN` Existiert bereits ein Clerk-Konto beziehungsweise eine Clerk-Anwendung, und welche Identität soll erster Owner werden?
