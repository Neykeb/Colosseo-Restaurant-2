# Projektplan und Entscheidungsstatus

**Status:** Full-Stack-Phase `FS5` freigegeben; Umsetzung noch nicht begonnen
**Letzte Aktualisierung:** 10.11.2026

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
| 05.11.2026 | Gate FS1 / Start FS2 | Freigegeben | Nutzer nimmt FS1 ab und erteilt ausdrücklich „GO für FS2“. |
| 06.11.2026 | Start FS3 | Freigegeben | Nutzer erteilt ausdrücklich „GO für FS3“; reale Betriebsdaten dürfen vorläufig durch markierte synthetische Entwicklungsdaten ersetzt werden. |
| 09.11.2026 | Gate FS3 / Start FS4 | Freigegeben | Nutzer bestätigt den präsentierten FS3-Stand mit „go“. FS4 ist damit freigegeben; Produktionsfreigabe bleibt von echten Datenschutz-, Storno- und E-Mail-Daten abhängig. |
| 10.11.2026 | Gate FS4 / Start FS5 | Freigegeben | Nutzer erteilt ausdrücklich „GO FS5“. FS5 ist freigegeben; Umsetzung beginnt. |

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
- [x] TanStack Router ist implementiert und am 04.11.2026 lokal sowie auf Netlify vollständig regressionsgeprüft: Typecheck, OXLint, 24 Unit-Tests und Production-Build laufen; `/de`, `/en`, `/it`, direkte Reloads, lokalisierte Unterseiten und die gestaltete 404 funktionieren. Netlify veröffentlicht `dist`; alle 15 lokalisierten Inhaltsrouten besitzen vorgerendertes semantisches HTML, lokalisierte Description, Open Graph und `Restaurant`-JSON-LD. Die bestätigte Produktionsbasis `https://ristorante-colosseo-winsen.netlify.app` erzeugt korrekte Canonical-/Hreflang-Links, Sitemap und `robots.txt`. Der zunächst aktive Netlify-SSO-Zugriffsschutz wurde für den öffentlichen Betrieb deaktiviert und die Live-Site anschließend erneut geprüft.
- [x] Node-/Express-/TypeScript-Serverstruktur und getrennte `app`-/`server`-Startpunkte etablieren: `server/src/http/app.ts` kapselt die Express-App, `server/src/server.ts` den Prozessstart und das kontrollierte Herunterfahren.
- [x] Mongoose installieren und sichere, wiederverwendbare Verbindungslogik samt Statusprüfung und `db:check` etablieren; Installation, echte Atlas-Verbindung, Kernmodelle, künstlicher Development-Seed und typisierte Repository-/Service-Grenze sind verifiziert.
- [x] Kernschema für Einstellungen, Servicezeiten, Sondertage, Bereiche, Tische, Reservierungen, Zuweisungen, Audit-Ereignisse und Outbox umsetzen; typisierte Reservation-Repository-/Service-Grenze und ausschließlich künstlicher Development-Seed sind vorhanden. Fachliche Reservierungsregeln und produktive Inhalte bleiben bewusst für die dafür freizugebenden Folgephasen offen.
- [x] Versionierten, idempotent ausführbaren MongoDB-Migrationsrahmen mit Registry, Historie, Ausführungssperre, Status, Vorwärtslauf, einzelnem Rollback, sicherer Testzielprüfung und Unit-Tests ergänzen.
- [x] Getrennte Atlas-Testdatenbank `colosseo_test`, datenbankspezifische `readWrite`-Rollen, AWS Frankfurt (`eu-central-1`) und das dreiknotige Replica Set verifizieren; die erste Core-Indexmigration ist am 05.11.2026 erfolgreich und idempotent in `colosseo_test` sowie `colosseo` angewendet. Backups bleiben als späterer Produktionsbetriebspunkt offen.
- [x] Express-Grundgerüst mit Healthcheck, Fehlerformat, Korrelations-ID, sicherer Basiskonfiguration und statischer Produktionsauslieferung aufsetzen. Der direkte TypeScript-Prozessstart wurde korrigiert; echte Listener-Smoke-Tests für Development, Production, Healthcheck, API-404 und vorgerenderte Sprachseiten sind erfolgreich.
- [x] Bestehenden öffentlichen Build lokal und auf Netlify regressionsprüfen; Typecheck, Lint, 24/24 Tests, Build, erzeugte Sprachdateien, lokalisierte Live-Routen, direkte Reloads, clientseitige 404, SEO-Dateien und JavaScript-Chunks sind erfolgreich geprüft.
- [x] **GATE FS1:** Technische Umsetzung und Prüfungen wurden am 05.11.2026 präsentiert und vom Nutzer mit ausdrücklichem `GO` abgenommen. `FS2` ist freigegeben; der Anwendungsstart wartet ausschließlich auf die darunter genannten Clerk-Eingangsdaten.

### FS2 – Admin-Authentifizierung und geschütztes Grundlayout

**Benötigt vor Start:** Clerk-Konto/Anwendung, gewünschte OAuth-Anbieter, erste Owner-Identität und Rollenmatrix.

**Freigabe:** `GO für FS2` am 05.11.2026 erteilt. Eine Clerk-Anwendung existiert und Google wurde als einziger OAuth-Anbieter bestätigt. `owner` erhält Vollzugriff; `staff` bleibt bis zu einer späteren Rechtefreigabe gesperrt. Die Clerk-Änderungen von Person A wurden laut Nutzer auf `dev` gepusht; die Owner-Clerk-User-ID liegt laut Nutzer bereits vor.

- [-] Clerk Development Instance, Vite-Client und Express-Middleware mit getrennten Secrets konfigurieren; `@clerk/react`, `@clerk/express`, `ClerkProvider`, Vite-API-Proxy und bedingte `clerkMiddleware()` sind lokal eingerichtet. Ein echter signierter Backend-Request bleibt offen.
- [ ] OAuth-Anmeldung, Abmeldung, Sessionablauf, Redirect-Allowlist und Fehlerzustände umsetzen.
- [-] Eigenes `admin_profiles`-Modell und Repository für Clerk-User-IDs implementieren; der Owner-Bootstrap bleibt bis zur bestätigten Owner-Clerk-ID offen.
- [-] `/admin` mit Lade-, Zugriff-verweigert-, technischem Fehler- und geschütztem Layoutzustand erstellt; Browserprüfung des echten Google-OAuth-Flows bleibt offen.
- [x] Owner-/Staff-Rechte als serverseitige Autorisierungsfunktion und Middleware mit verständlichen `401`-/`403`-Antworten sowie Unit-Tests verankern.
- [ ] Admin aus Sitemap/Indexierung und öffentlicher Navigation ausschließen.
- [ ] Accessibility- und Security-Tests durchführen.
- [ ] **GATE FS2:** geschützten Zugang und Rollenprüfung präsentieren; auf GO für `FS3` warten.

### FS3 – Reservierungs- und Verfügbarkeitskern

**Benötigt vor Start:** reale Tischliste, Bereiche, Kombinationsregeln, Servicezeiten, Dauer/Buffer, Vorlauf, Buchungshorizont, Gruppengrenzen, Sperr- und Bestätigungsregeln.

- [x] Pure Domainlogik für `HH:mm`-Zeitfenster, Servicefenster, Überschneidungen und explizite Statusübergänge umgesetzt. Synthetische `PLATZHALTER`-Tische, Servicezeiten und Entwicklungsregeln wurden nach Nutzerfreigabe idempotent bereitgestellt; reale Betriebswerte bleiben offen.
- [x] Atomare Tischzuweisung einschließlich eindeutiger Tisch-/Zeitslot-Sperren, MongoDB-Transaktion und deterministischer Einzel-/Kombinationstischauswahl implementieren; echter Parallelitätstest auf `colosseo_test` bestätigt genau einen Gewinner für die letzte Kapazität.
- [x] Öffentliche Config-/Availability-/Reservation-API mit Zod-Validierung, Rate-Limit, Idempotency-Key, Vorlauf, Buchungshorizont, Serviceperioden, Dauer und Puffer erstellen.
- [x] Geschützte Admin-API für Reservierungsliste, manuelle Reservierungen, Statusübergänge und administrativ verwaltete Sperrzeiten samt Audit-Ereignissen ergänzen. Die Autorisierung bleibt serverseitig aktiv, obwohl die abschließende FS2-Browserprüfung auf Nutzerwunsch verschoben wurde.
- [x] Concurrency-, Grenzzeit-, Zeitzonen-, Ausgebucht-, Validierungs-, Rate-Limit- und API-Tests ausführen: Typecheck, Lint, 51/51 Vitest-Tests, Production-Build, Test-/Development-Migration `0008`, read-only Development-Availability-Smoke-Test und echter Atlas-Testdatenbank-Parallelitätstest erfolgreich.
- [x] **GATE FS3:** technischer Reservierungskern wurde am 09.11.2026 präsentiert und vom Nutzer mit „go“ abgenommen; `FS4` ist freigegeben. Reale Betriebsdaten ersetzen vor einem Livebetrieb weiterhin die markierten `PLATZHALTER`-Regeln.

### FS4 – Öffentliche Reservierungsstrecke und Benachrichtigungen

**Benötigt vor Start:** freigegebene Formularfelder/-texte in DE/EN/IT, Datenschutzgrundlage, Stornoregeln, Absenderdomain, Restaurantempfänger und E-Mail-Anbieter.

- [x] Reservierungsoberfläche in den bestehenden Notte-Reservierungsabschnitt integrieren, ohne Hero oder öffentliche Dramaturgie zu verändern; Production-Übermittlung bleibt bei `PLATZHALTER`-Regeln server- und clientseitig gesperrt.
- [x] Zugängliche Datum-, Uhrzeit-, Personen- und Kontaktdateneingabe in DE/EN/IT mit Lade-, Leer-, Fehler- und Erfolgszustand sowie telefonischer Alternative umsetzen.
- [x] Outbox-Ereignisse atomar mit der Reservierung anlegen; idempotenten Resend-Worker, lokalisierte Gast-/Stornonachricht, Restaurantnachricht und Wiederholungsplanung implementieren. API-Key, Absender und Empfänger wurden am 09.11.2026 mit genau einer technischen Testmail erfolgreich verifiziert.
- [x] Sichere Gaststornierung mit zufälligem, nur gehasht gespeichertem Token bis zwei Stunden vor Reservierungsbeginn ergänzen; echter Atlas-Test bestätigt Statuswechsel und Freigabe der Tischsperren.
- [-] Rate-Limit, Fehlerfälle, drei Locales, responsive Einspaltenansicht und Reduced-Motion-kompatible statische Formularzustände umgesetzt; echter Browser-E2E- und Extremdatenlauf bleibt offen, weil die verpflichtenden Skills `gpt-taste` und `break-ui` in dieser Sitzung nicht verfügbar waren.
- [x] **GATE FS4:** komplette Gaststrecke präsentiert und am 10.11.2026 durch das ausdrückliche `GO FS5` abgenommen. Browser-E2E-/Extremdatenprüfungen bleiben dokumentierte Restpunkte und gelten nicht als ausgeführt.

### FS5 – Reservierungs-, Kalender- und Anfrageverwaltung

**Start:** `GO FS5` am 10.11.2026 ausdrücklich erteilt; die Umsetzung beginnt jetzt.

- [ ] Dashboardübersicht und zugängliche Tages-/Wochenansichten umsetzen.
- [-] Backend-Grundlage für Reservierungssuche, Filter, Pagination und Detail-Endpunkt, atomare Statusänderung sowie atomare Tischzuweisung und Historie implementiert. Frontend und vollständige API-Regression bleiben offen.
- [-] Sondertage mit Sonderöffnungen und Schließungen sowie Auditierung als Admin-API ergänzt und in Availability-/Buchungslogik priorisiert; bestehende Sperrzeiten-API ist vorhanden. Vollständige Konflikt-/API-Regression bleibt offen.
- [-] Synthetische `PLATZHALTER`-Felder, versioniertes Modell, Admin-API, Detailansicht, interne Notizen sowie atomare Status-/Audit-Logik für Veranstaltungsanfragen umgesetzt; öffentlicher Anfrageweg und vollständige API-Regression bleiben offen.
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
13. `VERIFIZIERT` Für die bestehende Clerk-Anwendung wird ausschließlich Google OAuth verwendet.
14. `TEILWEISE OFFEN` Die erste Restaurantbesitzer-Identität erhält `owner` mit Vollzugriff und wird dauerhaft über ihre Clerk User-ID autorisiert. Die konkrete User-ID wird nach dem Push von Person A beziehungsweise dem ersten kontrollierten Clerk-Kontoabgleich eingetragen.
