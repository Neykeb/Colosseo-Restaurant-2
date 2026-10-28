# Projektplan und Entscheidungsstatus

**Status:** Phase 5 aktiv – „Notte“ ist als deutsche Hauptseite aktiviert; finale Messungen und reale Daten stehen aus  
**Letzte Aktualisierung:** 27.10.2026

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
