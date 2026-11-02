# Projektplan und Entscheidungsstatus

**Status:** Full-Stack-Phase `FS0` – Analyse, Backend-Cockpit und Tagesplan abgeschlossen; Implementierung wartet auf Gate-Freigabe und ausdrückliches `GO für FS1`
**Phase:** `FS0` – Vorbereitung; Gate offen
**Letzte Aktualisierung:** 02.11.2026

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
- [x] Umfassendes Mobile-Lite-Profil umsetzen: Touchgeräte und Viewports unter 768 px von Lenis, Video-Scrub, Pinning, Parallax, Buchstabenwechsel und Dauer-Marquees entlasten; Navigation, Speisekartenvorschau, flexible Section-Höhen, Safe Areas, Touchziele und mobile Typografie neu kalibrieren.
- [x] Netlify-Konfiguration für den statischen React-Router-Build mit `build/client`, Standardumleitung auf `/de` und ergänzendem SPA-Fallback ergänzen.

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
- [ ] Fachliche und betriebliche Fragen mit dem Nutzer klären.
- [ ] **GATE FS0:** Zielarchitektur und Umfang ausdrücklich freigeben; erst danach darf `FS1` beginnen.

### Vorbereitungsstand und Freigabeumfang – 02.11.2026

- [x] Server-/API-Vorbereitung als Vorschlag in `SPEC.md`, Abschnitt 21, konkretisieren und offene Reservierungsfragen nach benötigter Phase bündeln.
- [x] Router-Ist-Zustand durch Quelltextprüfung feststellen: TanStack Router ist vorhanden; vollständige Migration und Auslieferung bleiben ungeprüft. Die frühere Aussage „React Router ist aktuell implementiert“ ist durch diesen Befund überholt.
- **Freigabe 02.11.2026:** Das erste GO dieser Arbeitseinheit autorisierte die Bestandsaufnahme und Planerstellung. Das anschließende GO autorisiert ausschließlich die vorgestellten Änderungen an `SPEC.md`, `TASKS.md`, `BACKEND.md` und `DAILY_PLAN.md`. Weder Gate `FS0` noch `FS1` sind damit freigegeben.
- **Prüfung:** Quelltexte, Konfiguration und Dokumentation gelesen; keine Typ-, Lint-, Build-, Funktions- oder Browsertests in dieser Vorbereitung ausgeführt.

### FS1 – Plattformgrundlage und reproduzierbare Datenbank

**Benötigt vor Start:** GO für `FS1`, Bestätigung von MongoDB Atlas, Atlas-Konto/Region sowie Entscheidung, ob lokal ein MongoDB-Replica-Set über Docker bereitgestellt werden soll. Mongoose, Render-Konto und Finalprojekt-Nutzung sind bestätigt.

- [ ] Lokale Entwicklungs- und Umgebungsvariablenstrategie ohne Secrets im Repository einrichten.
- [ ] Bereits im Quelltext vorhandene TanStack-Router-Migration vollständig prüfen und erforderliche Restarbeiten umsetzen; Sprachrouten, Direktaufruf, Reload, Lazy Loading, SEO-Metadaten, Prerender-/Buildstrategie und Produktionsfallback regressionsprüfen, bevor alte Router-Dateien oder Abhängigkeiten entfernt werden.
- [ ] Node-/Express-/TypeScript-Serverstruktur und getrennte `app`-/`server`-Startpunkte etablieren.
- [ ] Mongoose-Verbindung, Schemas/Modelle, Seed nur für klar künstliche Entwicklungsdaten und typisierten Repository-Zugriff etablieren.
- [ ] Kernschema für Einstellungen, Servicezeiten, Sondertage, Bereiche, Tische, Reservierungen, Zuweisungen, Ereignisse und Outbox umsetzen.
- [ ] MongoDB-Indizes, gering privilegierten Atlas-Datenbankbenutzer und idempotente Migrationsskripte samt Tests ergänzen.
- [ ] Express-App und Prozessstart getrennt implementieren; Konfiguration und geordnetes Herunterfahren prüfen.
- [ ] Healthcheck, Fehlerformat, Korrelations-ID und sichere Basiskonfiguration nach `SPEC.md`, Abschnitt 21, implementieren und per API-Tests prüfen.
- [ ] API-404 und statische Produktionsauslieferung nach freigegebener Buildstrategie umsetzen und Fallback-Abgrenzung prüfen.
- [ ] Bestehenden öffentlichen Build unverändert regressionsprüfen.
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

### Entscheidungsbündel und spätester Klärungszeitpunkt

Die nummerierte Liste oben bleibt die einzige Liste der offenen Detailfragen. Diese Zuordnung legt nur die Reihenfolge ihrer Klärung fest:

| Zeitpunkt | Benötigte Entscheidungen |
|---|---|
| Vor FS1 | Atlas-Bestätigung, Konto/Region und lokale transaktionsfähige Datenbank (Frage 11); Gate FS0 und eigenes GO FS1 |
| Innerhalb FS1 vor Auslieferungs-/Router-Restarbeiten | Prerender-/SEO-Strategie und konsistenter Build-/Hostingpfad gemäß `SPEC.md`, Abschnitt 21 |
| Vor FS2 | Adminpersonen und Rollen (9), OAuth-Anbieter (13), Clerk-Anwendung und erster Owner (14) |
| Vor FS3 | Kapazität und Kombinationen (1), Servicezeiten (2), Dauer/Puffer (3), Vorlauf/Horizont/Gruppen (4), Bestätigung (5), betriebliche Statusregeln (6); Importbedarf (10) vor betroffenen Migrationen |
| Vor FS4 | Gastseitige Änderungs-/Stornoregeln (6), Pflichtfelder und Aufbewahrung (7), E-Mail-Empfänger und Absender (8) |
| Vor FS6 | Objektspeicher (12) |

Aufbewahrungs- und Betriebsentscheidungen sind vor den jeweils betroffenen Implementierungen festzulegen; spätere Gates erlauben keine vorzeitige Verarbeitung ungeklärter personenbezogener Daten.

## Kleinschrittiger Router-Prüfauftrag – 02.11.2026

**Freigabe:** Nutzer-GO „für alle Schritte“ autorisiert die sieben vorgestellten Schritte des lokalen Installations-/Router-Prüfauftrags einschließlich Netlify-Korrektur und Dokumentation. Keine Veröffentlichung, kein Backend-Code und keine stillschweigende Auswahl noch offener Betriebs- oder SEO-Entscheidungen. Gate FS0 und GO FS1 bleiben offen.

- [x] Schritt 1: `npm ci --cache /tmp/colosseo-npm-cache --no-audit --no-fund` erfolgreich (109 Pakete). Sandbox-Versuch wegen EAI_AGAIN abgebrochen; Wiederholung mit Netzwerkfreigabe erfolgreich. Router war bei erster Prüfung bereits lokal installiert. Paketdateien unverändert.
- [x] Schritt 2: `npm run typecheck`, `npm run lint`, `npm test` (2 Dateien, 7 Tests) und `npm run build` erfolgreich. Aktuell kein Typegen-Schritt in diesen Scripts. Buildwarnungen: Drittanbieter-`use client`-Direktiven und JavaScript-Chunk über 500 kB (701,78 kB, gzip 231,22 kB); Lazy-Loading-Abnahme offen.
- [x] Schritt 3: `netlify.toml` veröffentlicht `dist` passend zum tatsächlich ausgeführten Vite-Build; `dist/` in `.gitignore` ergänzt. Kein Deployment und keine Netlify-Liveprüfung.
- [-] Schritt 4: Browserprüfung von Sprachrouten, Direktaufrufen, Reloads, unbekannten URLs und Navigation; Ergebnis siehe nachfolgender Prüfbericht.
- [-] Schritt 5: SEO-/Prerendering-Bestand und Lösungsvorschlag in `SPEC.md` dokumentiert. Konkrete Lösungsauswahl und Detailplan offen.
- [ ] Schritt 6: Vollständige Router-Abnahme erst nach geklärten und erfolgreich geprüften Restpunkten.
- [-] Schritt 7: FS1-Eingangsentscheidungen einzeln angefragt; Atlas-Konto/Region und lokale Umgebung bleiben bis Nutzerantwort OFFEN. Kein neues Phasen-GO erteilt.

**Skill-Verfügbarkeit:** `break-ui` und `gpt-taste` sind weder im verfügbaren Katalog noch in den geprüften lokalen Skill-Verzeichnissen vorhanden. In diesem Auftrag wird kein React-/UI-Code geändert. Die gezielte Routerprüfung ersetzt keine vollständige visuelle oder break-ui-Abnahme.

### Browser-Prüfbericht und offene Korrekturaufgaben

Headless-Chrome gegen lokalen `vite preview` des Production-Builds; Prüfung per DOM-Auswertung, keine visuelle Abnahme und kein Netlify-Livetest:

- [x] `/` leitet clientseitig auf `/de` weiter.
- [x] Direktaufruf und anschließender Reload rendern `/de`, `/en`, `/it`, `/de/speisekarte`, `/en/menu`, `/it/menu`.
- [x] Navigationsklick von `/de/restaurant` auf `/de/speisekarte` und Browser-Zurück nach `/de/restaurant` erfolgreich. Keine vollständige Navigation aller Seiten oder Sprachwechsel abgenommen.
- [x] `/de/a/b` zeigt bei Direktaufruf und Reload die vorhandene deutsche 404-Ansicht. HTTP-404-Status auf Netlify bleibt ungeprüft; SPA-Fallback ist keine Statusgarantie.
- [x] R1 (behoben und erneut geprüft; siehe Abschluss unten): `/de/unbekannt` und `/xx` zeigen bei Direktaufruf und Reload „Something went wrong!“ statt 404. Ursache im Quelltext: generischer Fehler für ungültige Locale/Seite. Korrektur gesondert planen; danach ungültige Locale, unbekanntes Segment und tiefen Pfad erneut prüfen.
- [ ] R2: `/en` und `/it` zeigen weiterhin die deutsche Startseite. Sprachinhalte gegen Freigabestand in `CONTENT.md` prüfen, fehlende Übersetzungen nicht erfinden; Korrekturplan vor UI-Änderung vorlegen.
- [ ] R3: Dokument-`lang` bleibt auch auf englischen/italienischen Unterseiten `de`; generischer Titel und fehlender Canonical in geprüften Routen. Metadaten und Dokument-Sprache zusammen mit freigegebenem SEO-Plan korrigieren.
- [ ] R4: Prerendering, Canonical-Domain, hreflang, echte Hosting-404 und Lazy Loading fehlen noch als abgenommene Ergebnisse. Erst nach deren Prüfung Schritt 6 abschließen.

R1–R4 sind vor ihrer Behebung erfasste Befunde. UI-Korrekturen wurden nicht begonnen; erforderliche Skills sind derzeit nicht verfügbar. Einzeleinsatz des Browsers ersetzt keine `break-ui`-, Accessibility- oder responsive Sichtprüfung.

**Buildartefakte:** `dist` enthält bereits versionierte Dateien. Der Prüflauf hatte diese regeneriert; ausschließlich diese vom Prüflauf verursachten Änderungen wurden anschließend auf den zuvor sauberen Repository-Stand zurückgesetzt. `.gitignore` wirkt nicht rückwirkend auf versionierte Dateien. Eine spätere Bereinigung der Versionsverwaltung ist separat zu entscheiden.

### Erneute Router-Verifikation – 02.11.2026

**Freigabe:** separates GO für erneute Prüfung und Dokumentation; keine Codekorrekturen. Routercode und Paketdateien stimmen mit dem vorherigen Prüflauf überein.

**Ausgeführt:** `npm run build -- --outDir /tmp/colosseo-router-verification` erfolgreich. Headless-Chrome mit Reduced Motion gegen lokalen Vite-Preview dieses Builds; DOM-/URL-Prüfung ohne visuelle Abnahme. Keine erneute Installation und kein erneuter Type-/Lint-/Unit-Lauf, da Anwendungscode unverändert blieb.

| Prüffall | Ergebnis |
|---|---|
| 15 öffentliche Inhaltsrouten: Start, Menü, Restaurant, Feiern, Kontakt in DE/EN/IT | Alle bei Direktaufruf und anschließendem Reload gerendert; Route und Überschrift geprüft. Inhaltliche Vollständigkeit nicht abgenommen. |
| 15 Hauptnavigationslinks, jeweils von der Restaurantseite der Sprache aus angeklickt | Alle erwarteten Zielpfade erreicht. Keine komplette Prüfung der abweichenden Startseiten-/Hash-Navigation oder mobilen Navigation. |
| `/` | clientseitige Weiterleitung auf `/de` bestätigt |
| Klick `/de/restaurant` → `/de/speisekarte` und Browser-Zurück | erwartete Pfade bestätigt |
| `/de/unbekannt`, `/xx`, jeweils mit Reload | R1 erneut bestätigt: allgemeine Fehleransicht statt 404 |
| `/de/a/b`, mit Reload | deutsche 404-Ansicht bestätigt; HTTP-Status des Livehostings nicht geprüft |
| `/en`, `/it` | R2 erneut bestätigt: deutsche Startseitenüberschrift und Inhalte |
| Dokument-Sprache und Metadaten der 15 Inhaltsrouten | R3 bestätigt: `html lang=de`, gleicher generischer Titel, kein Canonical |

**Ergebnis:** technische Erreichbarkeit und geprüfte Navigationsziele bestätigt; vollständige Router-Abnahme wegen R1–R4 weiterhin offen. Sprachwechsel, responsive Sichtprüfung, Hash-Navigation und Netlify-Liveverhalten sind weiterhin nicht abgenommen. Keine Fehlerbehebung in diesem Prüfschritt.

**Nächste einzelne Aufgabe (`VORSCHLAG`):** R1 beheben: in `app/router.tsx` ungültige Locale/Seite über TanStacks Not-found-Behandlung statt generischer Fehler melden; bestehende 404-Ansicht erhalten. Danach bekannte Routen sowie ungültige Locale, unbekannte Seite und tiefer Pfad per Direktaufruf/Reload regressionsprüfen, Typecheck/Lint/Tests/Build ausführen. Vor Umsetzung separates GO einholen; keine Übersetzungs- oder SEO-Änderungen in diesem Schritt.

### Abschluss R1 – Not-found-Behandlung – 02.11.2026

- **Freigabe:** separates Nutzer-GO für die vorgestellte einzelne Routerkorrektur samt Regression; keine SEO-, Übersetzungs- oder Layoutänderungen.
- **Umsetzung:** `app/router.tsx` meldet ungültige/fehlende Locale und unbekannte Seiten über `throw notFound()` statt generischem Fehler. Die bestehende 404-Komponente bleibt unverändert. Dies ist eine Routing-Fehlerkorrektur ohne neuen React-/UI-Aufbau; keine neue Gestaltung oder neue UI-Texte.
- **Ausgeführt und erfolgreich:** `npm run typecheck`, `npm run lint`, `npm test` (2 Dateien/7 Tests), `npm run build -- --outDir /tmp/colosseo-router-r1`. Buildwarnungen zu Drittanbieter-Direktiven und Chunkgröße bestehen weiter; versioniertes `dist` blieb unverändert.
- **Browserregression:** isolierter Headless-Chrome gegen lokalen Production-Preview, Reduced Motion. `/de/unbekannt`, `/en/unknown`, `/it/sconosciuto`, `/xx`, `/xx/menu`, `/de/a/b` zeigen bei Direktaufruf und Reload die bestehende 404-Ansicht. `/de`, `/en/menu`, `/it/ristorante` rendern bei Direktaufruf und Reload weiterhin ihre erwarteten Überschriften. Automatischer Vergleich der sechs Fehlerfälle erfolgreich.
- **Grenzen:** bestehende 404-Texte bleiben deutsch, auch unter EN/IT. Lokalisierung der Fehleransicht ist ein separater offener Punkt. Keine Aussage über echte HTTP-404-Status auf Netlify, keine vollständige visuelle/Accessibility-Abnahme. R2–R4 und vollständige Router-Abnahme bleiben offen.
- **Nächste Aufgabe:** R2 zuerst gegen freigegebene Inhaltsquellen prüfen und kleinen Korrekturplan vorstellen; erst nach weiterem GO umsetzen.

### R2 – Inhaltsbestandsprüfung – 02.11.2026

- [x] Separates GO für Bestandsprüfung aufgenommen; aktuelle Notte-Ressourcen, ältere EN-/IT-Texte, i18next und Locale-Übergabe geprüft.
- [x] Inhaltsbestand, fehlende Freigaben und betroffene Bereiche ausschließlich in `CONTENT.md`, „Bestandsprüfung der Notte-Lokalisierung“, dokumentiert.
- [ ] R2 bleibt offen: keine Übersetzungen oder UI-Anpassungen mit dieser Prüfung umgesetzt. Nächster kleiner Vorschlag ist ein zur Prüfung vorgelegter EN-/IT-Textentwurf für Navigation, Hero und Begrüßung. Weitere Inhalte und technische Integration folgen separat.
- **Prüfung:** ausschließlich Quelltext-/Dokumentationsabgleich; keine neuen Typ-, Lint-, Unit-, Build- oder Browserläufe, da kein Anwendungscode geändert wurde. Vor technischem UI-Aufbau gelten weiterhin die Skill-Voraussetzungen aus `AGENTS.md`.

### R2 – Textteilfreigabe und Dokumentation – 02.11.2026

- [x] EN-/IT-Entwürfe für Navigation, Hero, Begrüßung und zugehörigen Bildalternativtext vorlegen und ausdrückliches Nutzer-GO erhalten.
- [x] Nach separatem Dokumentations-GO Texte und Freigabeumfang in `CONTENT.md`, „Freigegebene EN-/IT-Texte: Notte-Navigation, Hero und Begrüßung“, festhalten. Texte werden hier nicht dupliziert.
- **Freigabeumfang:** ausschließlich die vorgelegten Texte und anschließend ihre Dokumentation; keine technische Integration, kein neues Phasen-GO und keine Veröffentlichung.
- **Prüfung:** gespeicherte Texte gegen die freigegebene Chatvorlage abgeglichen; `git diff --check` erfolgreich. Keine ausführbaren Anwendungstests, da ausschließlich Dokumentation geändert wurde.
- [ ] Technische Integration dieser Teilinhalte separat planen und freigeben lassen. Restliche Inhalte und R2 als Gesamtbefund bleiben offen; die EN-/IT-Startseiten sind noch nicht vollständig lokalisiert.

### R2 – Technische Teilintegration – 02.11.2026

- **Freigabe:** Nutzer erteilt nach erklärter Nichtverfügbarkeit von `gpt-taste` eine einmalige Ausnahme für die vorgestellte Textintegration von Navigation, Hero und Begrüßung. Keine dauerhafte Aufhebung der Skill-Regel, keine Gestaltungs-/Motionänderung und kein Full-Stack-Phasen-GO.
- [x] Typisierte Teilressourcen in `app/content/notte-locales.ts` mit freigegebenem Wortlaut und deutschen Referenzen anlegen.
- [x] Locale-Auswahl in `NottePage` und Text-Props für die drei Abschnitte ergänzen; zugängliche Navigationsnamen, Öffnen-/Schließen-Beschriftungen und Bildalternativtext einbinden.
- **Technische Prüfungen erfolgreich:** Typecheck, Lint, Vitest (2 Dateien/7 Tests), Production-Build nach `/tmp/colosseo-intro-build`. Keine Paketinstallation, versioniertes `dist` unberührt. Bestehende Buildwarnungen bleiben.
- **Restumfang:** übrige Startseitenabschnitte einschließlich Overlay/Footer, Dokument-Sprache und SEO unverändert. R2 bleibt insgesamt offen. `break-ui` weiterhin nicht verfügbar; gezielte Browserprüfungen sind keine vollständige Skill-Abnahme.

**Browserergebnis der Teilintegration:** Headless-Chrome mit Reduced Motion gegen frischen Production-Preview; DE/EN/IT jeweils bei 390, 768 und 1440 px geprüft. Hero-Überschrift automatisch verglichen; Begrüßung, Alternativtext und Navigationslabels anhand erfasster DOM-Werte mit freigegebenen Ressourcen abgeglichen. Menü-Öffnen ändert `aria-expanded` und Schließen-Beschriftung, Escape setzt es zurück. Kein horizontaler Dokumentüberlauf in den neun Fällen. Footer-Sprachwechsel EN → IT → DE zeigt passende URL und Hero-Überschrift. Mobile Hero-Screenshots aller drei Sprachen visuell geprüft, ohne erkennbaren Textbeschnitt. Tablet/Desktop per DOM und Überlaufmessung geprüft, keine vollständige visuelle Abnahme. Gesamtprüfskript erfolgreich (0 Fehler). `git diff --check` erfolgreich. Keine vollständige Keyboard-/Accessibility-, Hash-/Anker- oder break-ui-Abnahme.

### R2 – Textfreigabe Familiengeschichte dokumentiert – 02.11.2026

- [x] EN-/IT-Entwürfe für Überschrift und Fließtext der Familiengeschichte vorlegen und ausdrückliches Nutzer-GO erhalten.
- [x] Nach separatem Dokumentations-GO Wortlaut und Freigabeumfang in `CONTENT.md`, „Freigegebene EN-/IT-Texte: Familiengeschichte“, festhalten. Keine Textduplikate in dieser Datei.
- **Freigabeumfang:** Texte und ihre Dokumentation; keine UI-Integration, keine Erweiterung der früheren einmaligen Skill-Ausnahme, kein Phasen-GO und keine Veröffentlichung.
- **Prüfung:** gespeicherten Wortlaut mit der freigegebenen Chatvorlage abgeglichen; `git diff --check` erfolgreich. Keine Anwendungstests für diese reine Dokumentationsänderung ausgeführt.
- [ ] Technische Integration der Familiengeschichte separat planen und freigeben lassen; R2 bleibt insgesamt offen.

### R2 – Familiengeschichte technisch integriert – 02.11.2026

- **Freigabe:** separates Nutzer-GO für den konkreten Integrationsplan einschließlich einmaliger `gpt-taste`-Ausnahme für die Familiengeschichte. Keine dauerhafte Skill-Ausnahme, keine weiteren UI-Aufgaben und kein neues Full-Stack-Gate.
- [x] `family` in `app/content/notte-locales.ts` typisiert ergänzen; deutsche Inhalte referenzieren und freigegebene EN-/IT-Texte übernehmen.
- [x] `NottePage` übergibt die gewählte Fassung an `FamilyStorySection`; diese liest Überschrift und Fließtext aus Props. Bild, Bildalternativtext, Layout und Motion unverändert.
- **Technische Prüfungen erfolgreich:** `npm run typecheck`, `npm run lint`, `npm test` (2 Dateien/7 Tests), `npm run build -- --outDir /tmp/colosseo-family-build`. Vorhandene Buildwarnungen bestehen weiter; keine Paketänderung und kein regeneriertes versioniertes `dist`.
- **Restpunkte:** übrige EN-/IT-Inhalte und Bildalternativtext der Familiengeschichte noch offen; R2 insgesamt nicht abgeschlossen. R3/R4 bleiben offen. `break-ui` nicht verfügbar; gezielte Prüfung ersetzt keine vollständige Skill-Abnahme.

**Browserprüfung Familiengeschichte:** DE/EN/IT jeweils bei 390, 768 und 1440 px gegen frischen Production-Preview mit Reduced Motion geprüft. Überschrift und vollständiger Fließtext automatisch gegen die freigegebene Vorlage verglichen; neun Fälle erfolgreich, ohne horizontalen Dokumentüberlauf. Footer-Sprachwechsel EN → IT → DE aktualisiert URL und beide Texte; Gesamtprüfskript mit 0 Fehlern beendet. Repräsentative Screenshots EN/Mobil, IT/Tablet und DE/Desktop visuell geprüft: Familiengeschichte lesbar ohne erkennbaren Textbeschnitt. Keine vollständige Accessibility-/Motion-/break-ui-Abnahme. `git diff --check` erfolgreich.

### R2 – Textfreigabe Feiern-Section dokumentiert – 02.11.2026

- [x] EN-/IT-Entwürfe für Abschnittstitel, Überschrift, Fließtext, Aktion und Bildalternativtext vorlegen und ausdrückliches Nutzer-GO erhalten.
- [x] Nach separatem Dokumentations-GO Wortlaut und Freigabeumfang in `CONTENT.md`, „Freigegebene EN-/IT-Texte: Feiern-Section“, festhalten; hier keine Textduplikate.
- **Freigabeumfang:** ausschließlich vorgelegte Texte und anschließende Dokumentation; keine UI-Integration, keine neue Skill-Ausnahme, kein Full-Stack-Phasen-GO und keine Veröffentlichung.
- **Prüfung:** gespeicherten Wortlaut mit der freigegebenen Chatvorlage abgeglichen; `git diff --check` erfolgreich. Keine Anwendungstests für diese reine Dokumentationsänderung ausgeführt.
- [ ] Technische Integration der Feiern-Section separat planen und freigeben lassen. R2 bleibt insgesamt offen.

### R2 – Feiern-Section technisch integriert – 02.11.2026

- **Freigabe:** Nutzer-GO nach vorgestelltem Integrationsplan und Installation von `gpt-taste`; Umfang ausschließlich fünf freigegebene Texte je Sprache. Keine neue Gestaltung, keine zusätzlichen Leistungen und kein Deployment.
- **Skillstand:** `gpt-taste` ist unter `/home/simon/.codex/skills/gpt-taste/SKILL.md` installiert und wurde gelesen. Frühere Nichtverfügbarkeitsangaben beschreiben den damaligen Stand. Designplan vor UI-Änderung ausgegeben. Bestehende Architektur, Typografie und GSAP bleiben gemäß begrenztem Nutzerauftrag erhalten; eine neue zufällige Gestaltung würde diesen Umfang überschreiten. Keine vollständige visuelle Neugestaltung oder pauschale Skill-Konformität behauptet.
- [x] Sprachressourcen um `events` ergänzen, deutsches Original referenzieren und freigegebene EN-/IT-Texte übernehmen.
- [x] `NottePage` übergibt Texte an `EventsSection`; Abschnittstitel, Überschrift, Fließtext, Aktion und Bildalternativtext stammen aus Props.
- **Technische Prüfungen erfolgreich:** Typecheck, Lint, Vitest (2 Dateien/7 Tests), Production-Build nach `/tmp/colosseo-events-build`. Bestehende Buildwarnungen bestehen weiter; versioniertes `dist` unverändert.
- **Restpunkte:** übrige Lokalisierung und R3/R4 bleiben offen. `break-ui` weiterhin nicht verfügbar; keine vollständige Skill-, Accessibility- oder Motion-Abnahme.

**Browserergebnis Feiern-Section:** DE/EN/IT jeweils bei 390, 768 und 1440 px gegen frischen Production-Preview mit Reduced Motion geprüft. Alle fünf Texte automatisch mit der Vorlage verglichen; Anfrageziel in jedem Fall unverändert. Neun Viewport-/Sprachfälle sowie Footer-Sprachwechsel EN → IT → DE erfolgreich (0 Fehler im Text-/URL-/Überlaufvergleich), kein horizontaler Dokumentüberlauf. Repräsentative Screenshots EN/Mobil, IT/Tablet, DE/Desktop angesehen. Texte werden vollständig gerendert; die Sichtprüfung ergab jedoch den nachfolgenden separaten Befund. Keine vollständige visuelle Abnahme.

- [x] V1 (begrenzte Korrektur umgesetzt und regressionsgeprüft; Abschluss unten): Bei 768 px überlagert die bestehende fixe Navigation nach `scrollIntoView()` der Feiern-Section den Abschnittstitel beziehungsweise die Überschrift. Im IT-Screenshot reproduziert; Ursache/Umfang bei manueller Navigation noch gesondert prüfen. Vor Behebung dokumentiert; Layoutkorrektur nicht Bestandteil der Textintegration. Nächsten kleinen Diagnoseplan separat vorstellen. `git diff --check` erfolgreich.

### Skill-Übersicht anlegen – 02.11.2026

- **Freigabe:** Nutzer-GO für die vorgestellte `SKILLS.md` im Repository-Hauptverzeichnis und Ergänzung ihrer überschneidungsfreien Zuständigkeit in `AGENTS.md`.
- [x] Projektbezogene Skill-Übersicht erstellt; lokale Fundstellen erneut geprüft und aktuellen Verfügbarkeitsstand dort dokumentiert.
- [x] Zuständigkeit in `AGENTS.md` ergänzt; verbindliche Regeln und historische Einsatzprotokolle nicht in die Übersicht kopiert.
- **Prüfung:** Dokumentationsverweise und Skill-Fundstellen abgeglichen; `git diff --check` erfolgreich. Keine Anwendungstests für reine Dokumentation ausgeführt.
- **Umfang:** keine Skill-Installation, UI-Änderung, neue Ausnahme oder Phasenfreigabe. Bestehende Restpunkte bleiben offen.

### V1 – Überlagerung diagnostiziert – 02.11.2026

**Freigabe:** GO ausschließlich für Diagnose und Korrekturplan; keine UI-/CSS-Änderung.

**Ausgeführt:** vorhandenen unveränderten Production-Prüfbuild lokal mit Vite-Preview und Headless-Chrome verwendet. Italienische Startseite, Reduced Motion, Viewporthöhe 900 px; bei 390, 768 und 1440 px jeweils `scrollIntoView()` und tatsächlichen Klick auf den Headerlink zu `#events` verglichen. Mobil vorher Menü geöffnet. Nach Scrollende Elementrechtecke gemessen; Quelltext von Navigation, Motion und CSS abgeglichen. Keine erneuten Type-/Lint-/Unit-/Buildläufe, da kein Anwendungscode geändert wurde.

| Viewport | Header-Unterkante | Abschnittstitel oben | Überschrift oben | Ergebnis beider Sprungmethoden |
|---|---:|---:|---:|---|
| 390 px | 64 px | 80,36 px | 114,36 px | kein vertikaler Überlappungsbereich |
| 768 px | 106 px | 53,38 px | 86,64 px | Überschrift reicht ca. 19,36 px in Headerbereich; V1 auch beim normalen Linkklick bestätigt |
| 1440 px | 82 px | 252,34 px | 285,61 px | kein vertikaler Überlappungsbereich |

**Ursache:** Tablet-Regeln bis 900 px erzeugen eine zweizeilige Navigation mit Mindesthöhe 98 px und 8 px Abstand zum oberen Rand. Die einzeilige mobile Headerregel greift erst bis 767 px. Der Inhalt der einspaltigen Feiern-Section beginnt bei 768 px nach ca. 53,76 px Innenabstand; der fixe Header reserviert keinen Platz. Es gibt weder `scroll-margin-top` am Sprungziel noch `scroll-padding-top` am Dokument. Reduced Motion beendet die Motion-Initialisierung vor der richtungsabhängigen Header-Ausblendung; der Header bleibt daher sichtbar. Eine kaschierende Ausblendung darf nicht Voraussetzung für lesbare Ankerziele sein.

**Grenzen:** Messung mit Reduced Motion und IT; normale GSAP-/Lenis-Variante, andere Sprachen, weitere Tabletbreiten und andere Anker noch nicht umfassend geprüft. Kein allgemeiner Accessibility-Nachweis.

**Korrekturplan (`VORSCHLAG`, Umsetzung wartet auf GO):** ausschließlich für das Sprungziel `#events` im Tabletbereich 768–900 px einen tokenbasierten Scrollabstand für den sichtbaren Header vorsehen. Headerhöhe und oberer Versatz als benannte Werte in der zuständigen Tokenquelle dokumentieren; CSS nutzt daraus `scroll-margin-top`. Keine neue Scrollsteuerung, keine Inhalts-/Typografie-/Motionänderung. Betroffene Dateien: `app/prototypes/colosseo/prototypes.css`, `docs/DESIGN_SYSTEM.md`, `docs/TASKS.md`, `docs/DAILY_PLAN.md`. Anschließend Linkklick und direktes Anspringen in DE/EN/IT, Reduced Motion und normale Motion, besonders bei 767/768/900/901 px sowie Mobil/Desktop prüfen; bestehende Typ-/Lint-/Test-/Buildprüfungen ausführen. Andere Anker erhalten bei Bedarf eigene Befunde und Aufgaben.

### V1 – Begrenzten Tablet-Scrollabstand implementieren – 02.11.2026

- **Freigabe:** separates GO zum vorgestellten tokenbasierten Scrollabstand für `#events` zwischen 768 und 900 px einschließlich Dokumentation und Regression.
- **Umsetzung:** ausschließlich `prototypes.css` um lokal begrenzte Tokens für die vorhandene Headerhöhe/Position und daraus berechnetes `scroll-margin-top` ergänzt; Werte in `DESIGN_SYSTEM.md` dokumentiert. Keine Text-, Layout-, Typografie- oder Motionänderung.
- **Skill:** bereits gelesenen `gpt-taste` berücksichtigt und begrenzten Designplan vor Änderung ausgegeben; keine neue Architektur-/Typografieauswahl bei dieser ausdrücklich begrenzten QA-Korrektur.
- **Technische Prüfungen erfolgreich:** `npm run typecheck`, `npm run lint`, `npm test` (2 Dateien/7 Tests), `npm run build -- --outDir /tmp/colosseo-v1-fixed-build`. Bestehende Buildwarnungen unverändert; versioniertes `dist` bleibt unberührt.
- **Browserregression:** abgeschlossen; siehe Ergebnis und Prüfgrenzen unten.

**Abschluss V1:** korrigierter Browserprüflauf mit Pflichtprüfung des geladenen Inhalts erfolgreich: 72 gültige Fälle (390/767/768/900/901/1440 px × DE/EN/IT × direktes Anspringen/Headerlink × Reduced Motion/normaler Motion), kein gemessener vertikaler Überlappungsbereich zwischen Header und Abschnittstitel und kein horizontaler Dokumentüberlauf. 106 px Scrollabstand nur im vorgesehenen Bereich aktiv. Bei 768 px/IT/Reduced Motion beginnt die Überschrift nach dem Sprung bei ca. 192,64 px statt 86,64 px; Headerunterkante weiterhin 106 px. Screenshots dieses Tablet-Falls für beide Motion-Einstellungen visuell angesehen. Kein Deployment und keine vollständige Accessibility-/Motion-Abnahme; andere Anker bleiben außerhalb des Umfangs.

**Prüflaufkorrektur:** Der erste lange Browserlauf verlor den lokalen Preview-Prozess. Fehlende DOM-Messwerte wurden zunächst nicht korrekt als Fehler gewertet; dessen pauschale Erfolgsausgabe wurde verworfen. Preview in stabiler Terminal-Sitzung neu gestartet, Prüfung um Pflichtnachweis geladener Inhalte ergänzt und alle 72 Fälle erneut ausgeführt. Nur dieser zweite vollständige Lauf ist Grundlage des Abschlusses. `git diff --check` erfolgreich.

### README als Projekteinstieg – 02.11.2026

- **Freigabe:** Nutzer-GO für die vorgestellte README mit Projektbeschreibung, lokalem Start, Prüfbefehlen, Verzeichnisübersicht und Quellenverweisen.
- [x] `README.md` anhand vorhandener Paket-/Hostingkonfiguration und Verzeichnisse erstellt; implementiertes Frontend und geplantes Backend unterschieden.
- [x] Überschneidungsfreie Zuständigkeit als Projekteinstieg in `AGENTS.md` ergänzt.
- **Prüfung:** lokale Markdown-Ziele auf Existenz und genannte npm-Scripts gegen `package.json` automatisiert geprüft; Kompatibilitätsangaben aus den Vite-/Vitest-Einträgen des Lockfiles abgeleitet; `git diff --check` erfolgreich. Keine erneuten Anwendungstests oder Builds für diese Dokumentationsänderung ausgeführt. Preview-Beispiel nicht in dieser Aufgabe gestartet.
- **Umfang:** kein Anwendungscode, keine Installation, keine Veröffentlichung und keine neue Phasenfreigabe. Bestehende Restpunkte bleiben offen.
