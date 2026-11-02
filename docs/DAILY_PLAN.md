# Tagesplan Full-Stack-Finalprojekt

**Status:** Verdichteter Arbeitsentwurf für zwei Personen; Gates und fachliche Eingangsdaten bleiben verbindliche Voraussetzungen

**Phase:** Planung innerhalb `FS0`; keine Freigabe für Anwendungscode

**Planungszeitraum:** 02.11.2026–13.11.2026

**Letzte Aktualisierung:** 02.11.2026

Diese Datei ist ausschließlich die operative Arbeitsübersicht. Anforderungen stehen in `docs/SPEC.md`, verbindliche Phasen und Gates in `docs/TASKS.md`. Ein Datum ersetzt kein erforderliches `GO`. Ohne Freigabe werden an diesem Tag nur erlaubte Planung, Dokumentation und Vorbereitung ausgeführt.

## 1. Rollenmodell

Bis die Namen festgelegt sind, verwenden wir:

- **Person A – Backend/Domain:** Express, API, Geschäftslogik, Reservierungslogik und Backend-Tests.
- **Person B – Frontend/Daten/Integration:** TanStack Router, MongoDB/Mongoose, Clerk, Admin-UI, Integration, Accessibility und E2E-Tests.
- **Gemeinsam:** Architekturentscheidungen, Reviews, Datenschutz, Sicherheit, Präsentationswissen und Gate-Abnahmen.

Beide Personen arbeiten möglichst in getrennten Verantwortungsbereichen. Jede kritische Änderung wird von der jeweils anderen Person geprüft. Aufgaben werden nur mit überprüfbarem Ergebnis als erledigt markiert.

## 2. Statuslegende

- `OFFEN`: noch nicht begonnen
- `IN ARBEIT`: aktiv bearbeitet; verantwortliche Person und Branch sind genannt
- `BLOCKIERT`: Grund und benötigte Entscheidung sind genannt
- `REVIEW`: Umsetzung abgeschlossen, Gegenprüfung ausstehend
- `ERLEDIGT`: Ergebnis und tatsächlich ausgeführte Prüfung sind dokumentiert

## 3. Kursabdeckung und zusätzliche Projektthemen

Die bereitgestellten Frontend- und Backend-Kursordner wurden am 02.11.2026 ausschließlich als interne Vollständigkeitskontrolle geprüft. Eine detaillierte Lernstoff-, Kurstag- oder Quellenzuordnung wird bewusst nicht im Repository gespeichert.

### Abdeckungsstatus

- `GEPRÜFT`: Der Tagesplan berücksichtigt die für das Projekt relevanten Grundlagen aus den bereitgestellten Frontend- und Backend-Unterlagen.
- `OFFEN`: Die tatsächliche Umsetzung und Beherrschung wird erst durch Code, Review und Tests pro Aufgabe nachgewiesen.

### Zusätzliche Projektthemen

Diese Themen wurden bei der internen Prüfung nicht als eigener Kursgegenstand gefunden und werden deshalb im Projekt ausdrücklich als zusätzlicher Lernaufwand behandelt:

- Migration des bestehenden React-Router-Framework-Projekts zu TanStack Router einschließlich Prerender-/SEO-Ersatz
- Resend-Anbindung für Transaktions-E-Mails
- zuverlässiges Outbox-Muster mit Idempotenz und Wiederholungsversuchen
- MongoDB-Parallelitätsschutz für die letzte reservierbare Tischkapazität
- gemeinsamer Produktionsbetrieb von statischem Frontend und Express-API auf Render

Diese Liste beschreibt nur zusätzliche Projektthemen. Sie ist keine Dokumentation des bereits behandelten Kursstoffs.

## 4. Terminrahmen

- Start: Montag, **02.11.2026**
- Interne Fertigstellung: Freitag, **13.11.2026**
- Umfang: 10 Werktage für zwei Personen
- Puffer: Der 13.11. ist überwiegend für Gesamttests, Fehlerbehebung, Dokumentation und Präsentationsvorbereitung vorgesehen.
- `ANNAHME`: Beide Personen können an allen zehn Werktagen am Projekt arbeiten.
- `RISIKO`: Der vollständige Umfang `FS1` bis `FS8` ist in zehn Werktagen nur mit sehr schnellen Entscheidungen, täglichen Reviews und strikt begrenztem Funktionsumfang realistisch. Sicherheit, Datenintegrität und Tests werden nicht zugunsten einer vorgetäuschten Vollständigkeit ausgelassen.

## 5. Verdichteter Tagesplan

| Datum | Person A | Person B | Gemeinsames Ergebnis / Prüfung | Status |
|---|---|---|---|---|
| Mo, 02.11. | FS1-Server- und API-Struktur vorbereiten; offene Reservierungsfragen bündeln | TanStack-Router-Migrationsplan sowie Atlas-/lokale MongoDB-Entscheidung vorbereiten | Gate `FS0`, Voraussetzungen und getrenntes `GO FS1` klären; noch kein Anwendungscode ohne Freigabe | `IN ARBEIT` |
| Di, 03.11. | Express/TypeScript, App-/Server-Trennung, Healthcheck, Fehlerformat und Konfigurationsvalidierung | MongoDB/Mongoose-Verbindung, Migrationsrahmen und lokale Testumgebung | Reproduzierbare Plattform, Unit-/Integrationstest und gegenseitiger Review | `BLOCKIERT` bis `GO FS1` |
| Mi, 04.11. | Kernmodelle, Repository-/Service-Grenzen, Indizes und künstliche Seed-Daten | TanStack Router migrieren; Sprachrouten, Direktaufruf, Reload, Lazy Loading und Buildstrategie absichern | FS1-Datenbasis plus Router-Regression; React Router erst nach erfolgreicher Abnahme entfernen | `BLOCKIERT` bis `GO FS1` |
| Do, 05.11. | Clerk-Prüfung, Adminprofile, Rollenmiddleware und Autorisierungstests | Clerk-Client, OAuth-Zustände und geschütztes Admin-Grundlayout | Nur nach `GO FS2`: erlaubter Owner-Zugriff und verständliches `403` für nicht freigeschaltete Konten | `BLOCKIERT` bis `GO FS2` |
| Fr, 06.11. | Verfügbarkeits-, Zeitfenster- und Statuslogik | reale Tisch-/Bereichsdaten modellieren; Config-/Availability-Integration | Nur nach `GO FS3`: fachliche Regeln und Grenzfälle als Tests nachweisen | `BLOCKIERT` bis `GO FS3` |
| Mo, 09.11. | atomare Tischzuweisung, Idempotenz, Rate-Limit und parallele Reservierungsversuche | öffentliches Reservierungsformular mit Lade-, Fehler-, Mobil- und Accessibility-Zuständen | Letzte Kapazität kann nicht doppelt bestätigt werden; API- und UI-Integration | `BLOCKIERT` bis passende Gates |
| Di, 10.11. | Resend-Service, Outbox, Wiederholungen und sichere E-Mail-Ereignisse | Bestätigungs-/Fehleransichten sowie Reservierungsverwaltung im Adminbereich | Nur nach `GO FS4/FS5`: Gaststrecke und operative Bearbeitung ohne doppelte E-Mails | `BLOCKIERT` bis passende Gates |
| Mi, 11.11. | Menü-, Öffnungszeiten- und Veröffentlichungs-APIs | Adminmasken für Reservierungen, Kategorien, Gerichte und Öffnungszeiten | Nur nach `GO FS5/FS6`: Verwaltung mit öffentlichem Fallback und Berechtigungstests | `BLOCKIERT` bis passende Gates |
| Do, 12.11. | Security-, Datenschutz-, Concurrency- und API-Prüfungen | E2E-, Accessibility-, Mobile-, Performance- und `break-ui`-Prüfungen | Nur nach `GO FS7`: gemeinsame priorisierte Fehlerliste beheben; keine offenen kritischen Befunde | `BLOCKIERT` bis `GO FS7` |
| Fr, 13.11. | Backend-Regressionslauf, Betriebsablauf und API-Erklärung | Frontend-/Admin-Regression, Router-/Buildprüfung und Präsentationsablauf | Dokumentation, Demo, Restpunkte und Render-Go/No-Go; Deployment ausschließlich nach `GO FS8` | `OFFEN` |

## 6. Priorität bei Zeitmangel

Der verkürzte Plan hebt die Gates nicht auf. Falls nicht alles bis 13.11. sicher fertiggestellt werden kann, gilt:

1. stabile Plattform und Datenbank
2. korrekt geschützter Adminzugang
3. atomare Reservierung und Verfügbarkeit
4. vollständige Gaststrecke
5. Reservierungsverwaltung
6. Speisekarten- und Öffnungszeitenverwaltung
7. E-Mails, vollständige QA und kontrollierter Betrieb

Nicht fertiggestellte Funktionen bleiben sichtbar `OFFEN` oder `BLOCKIERT`. Sie werden weder vorgetäuscht noch ohne Tests als abgeschlossen präsentiert.

## 7. Täglicher Arbeitsbeginn

```md
### Tagesstart – TT.MM.2026

- Aktuelle Phase / freigegebenes Gate:
- Stand vom Vortag:
- Person A heute:
- Person B heute:
- Zusätzlicher Lernbedarf heute:
- Blockaden / benötigte Entscheidungen:
```

Vor der ersten Änderung wird geprüft: Ist das benötigte Gate freigegeben? Sind Eingangsdaten vorhanden? Überschneiden sich Arbeitsbereiche? Welche Tests müssen heute mindestens laufen?

## 8. Täglicher Abschluss

```md
### Tagesabschluss – TT.MM.2026

- Person A erledigt:
- Person B erledigt:
- Gemeinsam geprüft:
- Tatsächlich ausgeführte Tests und Ergebnis:
- Neue Projekterkenntnisse:
- Geänderte Dokumentation:
- Offen / blockiert:
- Erster nächster Schritt:
```

Nur nachweislich erledigte Aufgaben erhalten `ERLEDIGT`. Testnamen und Ergebnisse werden konkret genannt. Offene Arbeit erhält Verantwortlichen und neuen Termin. Der nächste Schritt wird so formuliert, dass beide Personen ohne erneute Suche weiterarbeiten können.

## 9. Tagesstart – 02.11.2026

- **Aktuelle Phase:** `FS0`; keine Freigabe für Anwendungscode.
- **Stand:** Analyse, Zielarchitektur, Backend-Cockpit und erster Arbeitsplan sind vorhanden.
- **Heute dokumentiert:** Kursbestand intern als Kontrollgrundlage geprüft, TanStack Router als Zielentscheidung aufgenommen und Zeitplan bis 13.11. verdichtet.
- **Noch nicht abgenommen:** Router-Migration; aktueller Befund siehe `SPEC.md`, Abschnitt 21.
- **Nicht begonnen:** Backend-Code, Datenbank, Clerk-, Resend- und Render-Integration.
- **Blockaden:** MongoDB-Atlas-/lokale Datenbankentscheidung, Gate `FS0`, `GO FS1`, Clerk-Anbieter/Owner sowie fachliche Reservierungsregeln.
- **Person A / Arbeitsbereich:** Server-/API-Plan und Reservierungsfragen; Vorbereitung geprüft, keine Backend-Implementierung. Personenname und Branchzuordnung bleiben `OFFEN`.
- **Person B / Arbeitsbereich:** Router-Abnahmeplan sowie Atlas-/lokale Datenbankentscheidung bleiben offen; keine Erledigung durch Person B nachgewiesen.
- **Erster nächster Schritt:** Die in `TASKS.md` gebündelten FS1-Voraussetzungen beantworten und anschließend Gate `FS0` plus `GO für FS1` ausdrücklich freigeben.

## 10. Arbeitsabschluss der Vorbereitung – 02.11.2026

- **Erledigt:** Bestandsaufnahme und freigegebene Dokumentationsvorbereitung für Server-/API-Aufbau; Reservierungsfragen in `TASKS.md` nach Klärungszeitpunkt geordnet.
- **Geprüft:** Backend-Cockpit, Spezifikation, Gates, Tagesplan, Paket-/TypeScript-/Vite-Konfiguration, Router, Client-Einstieg, Netlify-Konfiguration und vorhandene Routingtests gelesen.
- **Erkenntnis:** Router-Ist-Zustand weicht von früherer Dokumentation ab. Technische Befunde und ausstehende Abnahme stehen in `SPEC.md`, Abschnitt 21.
- **Tests:** Keine ausführbaren Tests durchgeführt; keine Anwendungscodeänderung. Dokumentations-Diff auf Konsistenz geprüft; `git diff --check` erfolgreich ohne Formatfehler.
- **Geänderte Dokumentation:** `SPEC.md`, `TASKS.md`, `BACKEND.md`, `DAILY_PLAN.md` im freigegebenen Umfang.
- **Offen / blockiert:** FS1-Eingangsentscheidungen und Gates; keine Freigabe für Anwendungscode. Noch offene Umsetzung bleibt für den 03.11. eingeplant, abhängig von den Freigaben.
- **Nächster gemeinsamer Einstieg:** FS1-Voraussetzungen in `TASKS.md` klären; danach den konkreten ersten Implementierungsschritt zur Freigabe vorlegen. Der gesamte FS1-Umfang ist mit dieser Vorbereitung nicht abgeschlossen.

## 11. Folgeauftrag: lokale Router-Verifikation – 02.11.2026

- **Arbeitsbeginn / Umfang:** Nutzer-GO für alle sieben vorgestellten Teilschritte; erweitert den heutigen Auftrag ausdrücklich um lokale Router-/Netlify-Prüfung. Kein Deployment und kein GO FS1.
- **Erledigt:** reproduzierbare Installation, technische Prüfläufe, Netlify-Ausgabeordner und Ignore-Regel korrigiert. Paketdateien unverändert.
- **Tatsächlich ausgeführt:** `npm ci` erfolgreich; Typecheck und Lint erfolgreich; Vitest 2 Dateien/7 Tests erfolgreich; Production-Build erfolgreich. Buildwarnungen und einzelne Browserfälle stehen ausschließlich im Prüfbericht in `TASKS.md`.
- **Browser:** Headless-Chrome gegen lokalen Production-Preview verwendet; Direktaufruf/Reload, exemplarischer Navigationsklick und Zurück geprüft. Keine visuelle, responsive oder Livehosting-Abnahme.
- **Offen:** Routerbefunde R1–R4 in `TASKS.md`; vollständige Router-Abnahme nicht erteilt. SEO-/Prerendering-Vorschlag und benötigte FS1-Entscheidungen zur Nutzerklärung vorgelegt.
- **Geänderte Dateien:** `netlify.toml`, `.gitignore` und die zuständigen Projektquellen `SPEC.md`, `TASKS.md`, `BACKEND.md`, `DAILY_PLAN.md`.
- **Nächster Einstieg:** Nutzerantwort zur SEO-Richtung und Datenbankumgebung aufnehmen; R1 als erste kleine Korrektur mit konkreten Dateien und Tests vorstellen. Vor React-/UI-Änderungen erforderliche Skills verfügbar machen beziehungsweise ausdrückliche Nutzerentscheidung dazu einholen. FS1 bleibt bis zu seinen Voraussetzungen gesperrt.

## 12. Erneute Router-Verifikation – 02.11.2026

- **Arbeitsbeginn / Freigabe:** GO für den ausdrücklich vorgestellten Prüfschritt: Code-/Berichtsabgleich, erneute Browserprüfung und Ergebnisdokumentation. Keine Router-/UI-Korrekturen.
- **Prüfumgebung:** frischer Production-Build nach `/tmp/colosseo-router-verification`, Vite-Preview und isolierter Headless-Chrome mit Reduced Motion; versionierte Buildartefakte bleiben unverändert.
- **Tatsächlich ausgeführt:** isolierter Production-Build erfolgreich; alle 15 Inhaltsrouten direkt und mit Reload sowie 15 Hauptnavigationslinks geprüft. R1–R3 erneut bestätigt.
- **Ergebnis / Restpunkte:** siehe erneuten Prüfbericht in `TASKS.md`; keine vollständige Router-Abnahme.
- **Nächster Einstieg:** erste Fehlerkorrektur R1 konkret vorstellen und vor Umsetzung ein eigenes GO einholen. Fachliche und SEO-Entscheidungen bleiben separat offen.

## 13. Einzelkorrektur R1 – 02.11.2026

- **Arbeitsbeginn / Freigabe:** separates GO für Not-found-Behandlung und Regression; Umfang auf Router-Fehlersignal beschränkt.
- **Erledigt:** `app/router.tsx` auf TanStack-Not-found-Signal umgestellt; bestehende Fehleransicht erhalten.
- **Tatsächlich geprüft:** Typecheck, Lint, 7 Tests und isolierter Production-Build erfolgreich. Browserprüfung von neun URLs jeweils direkt und mit Reload erfolgreich; Einzelheiten und Grenzen ausschließlich im R1-Abschluss in `TASKS.md`.
- **Dokumentation:** R1-Ergebnis in `TASKS.md`, Routingverhalten in `SPEC.md`, heutige Übergabe hier gepflegt.
- **Offen / nächster Einstieg:** R2–R4 bleiben offen. Als Nächstes R2-Inhaltsstand prüfen und konkreten Plan vor Umsetzung freigeben lassen; keine weitere Aufgabe mit diesem GO beginnen.

## 14. R2-Inhaltsbestandsprüfung – 02.11.2026

- **Arbeitsbeginn / Freigabe:** GO ausschließlich für EN-/IT-Inhaltsprüfung und konkreten Folgeplan.
- **Erledigt:** Ressourcen und Freigabestatus gegen tatsächlichen Datenfluss geprüft; Befunde in `CONTENT.md`, Fortschritt in `TASKS.md` festgehalten.
- **Prüfungen:** Quelltext und Dokumentation gelesen; keine ausführbaren Tests, keine UI-/Übersetzungsänderungen.
- **Offen:** R2 weiterhin ungelöst; aktuelle Notte-Übersetzungen nicht freigegeben. Andere Routerrestpunkte bleiben offen.
- **Nächster Einstieg:** kleinen EN-/IT-Textentwurf für Navigation, Hero und Begrüßung vorlegen, sobald dafür GO erteilt ist; noch keine technische Integration.

## 15. R2-Textteilfreigabe dokumentieren – 02.11.2026

- **Arbeitsbeginn / Freigabe:** separates GO für Dokumentation der zuvor freigegebenen EN-/IT-Texte; kein UI-Auftrag.
- **Erledigt:** Texte und Freigabedatum in `CONTENT.md` festgehalten; Fortschritt und Freigabeumfang in `TASKS.md` dokumentiert.
- **Prüfung:** Wortlaut mit der freigegebenen Vorlage abgeglichen; `git diff --check` erfolgreich. Keine neuen Typ-, Lint-, Unit-, Build- oder Browserläufe für diese reine Dokumentationsänderung.
- **Offen:** technische Integration und restliche Lokalisierung; R2 bleibt offen.
- **Nächster Einstieg:** kleinen technischen Integrationsplan für die freigegebenen Teilinhalte mit betroffenen Dateien und Prüfungen vorstellen. Erst nach eigenem GO umsetzen; verfügbare Skill-Voraussetzungen vor UI-Arbeit klären.

## 16. R2-Teilintegration – 02.11.2026

- **Arbeitsbeginn / Freigabe:** einmalige Nutzer-Ausnahme für fehlenden `gpt-taste` und begrenzte Integration der freigegebenen Texte. Keine Gestaltungs-/Motionänderung.
- **Erledigt:** typisierte Sprachressourcen und Locale-abhängige Textübergabe für Navigation, Hero und Begrüßung integriert; Inhalts-/Architekturstatus in zuständigen Quellen aktualisiert.
- **Tatsächlich geprüft:** Typecheck, Lint, 7 Unit-Tests und isolierter Production-Build erfolgreich; DE/EN/IT bei drei Viewports, Menüzustände und Footer-Sprachwechsel geprüft. Details und Prüfgrenzen in `TASKS.md`. Dokumentations-Diff ohne Formatfehler.
- **Offen:** übrige Startseitenlokalisierung und R3/R4; vollständige Router-Abnahme weiterhin offen.
- **Nächster Einstieg:** nächsten kleinen Inhaltsblock zur Übersetzung auswählen und Entwürfe vorlegen, beispielsweise Familiengeschichte. Erst nach separatem GO beginnen; diese einmalige Ausnahme autorisiert keine weiteren UI-Aufgaben.

## 17. Textfreigabe Familiengeschichte dokumentieren – 02.11.2026

- **Arbeitsbeginn / Freigabe:** separates GO für Dokumentation der bereits freigegebenen EN-/IT-Familiengeschichte.
- **Erledigt:** exakten Wortlaut samt Datum und Umfang in `CONTENT.md` aufgenommen; Fortschritt in `TASKS.md` gepflegt.
- **Prüfung:** Abgleich mit freigegebener Vorlage und `git diff --check` erfolgreich. Keine ausführbaren Anwendungstests; UI-Dateien in diesem Schritt unverändert.
- **Offen:** technische Integration der Familiengeschichte und übrige Lokalisierung; vollständige Router-Abnahme weiterhin offen.
- **Nächster Einstieg:** kleinen Integrationsplan für die Familiengeschichte mit Dateien, Prüfungen und geltenden Skill-Voraussetzungen vorstellen; erst nach eigenem GO umsetzen.

## 18. Familiengeschichte integrieren – 02.11.2026

- **Arbeitsbeginn / Freigabe:** separates GO für begrenzte Integration einschließlich einmaliger Skill-Ausnahme; keine Bild-/Gestaltungs-/Motionänderung.
- **Erledigt:** EN-/IT-Familiengeschichte in vorhandene Sprachressourcen integriert und per Text-Props angebunden; deutsche Ausgangsfassung erhalten.
- **Tatsächlich geprüft:** Typecheck, Lint, 7 Tests und isolierter Production-Build erfolgreich. Neun Sprach-/Viewportfälle, Footer-Sprachwechsel und repräsentative mobile/Tablet/Desktop-Screenshots geprüft; Einzelheiten und Grenzen in `TASKS.md`. Diff ohne Formatfehler.
- **Dokumentation:** Inhaltsstand in `CONTENT.md`, technische Zuständigkeit in `SPEC.md`, Ergebnis in `TASKS.md` aktualisiert.
- **Offen:** weitere Lokalisierung, darunter Familienbild-Alternativtext, und R3/R4; vollständige Router-Abnahme offen.
- **Nächster Einstieg:** als nächsten kleinen Inhaltsblock EN-/IT-Entwürfe für die Feiern-Section einschließlich Bildalternativtext vorschlagen. Erst nach eigenem GO beginnen; keine automatische Fortsetzung der UI-Arbeit.

## 19. Textfreigabe Feiern-Section dokumentieren – 02.11.2026

- **Arbeitsbeginn / Freigabe:** separates GO für Dokumentation der bereits freigegebenen EN-/IT-Texte einschließlich Bildalternativtext; kein UI-Auftrag.
- **Erledigt:** exakten Wortlaut, Datum und Umfang in `CONTENT.md` aufgenommen; Fortschritt in `TASKS.md` gepflegt.
- **Prüfung:** Abgleich mit freigegebener Vorlage und `git diff --check` erfolgreich. Keine ausführbaren Anwendungstests; UI-Dateien in diesem Schritt unverändert.
- **Offen:** technische Integration der Feiern-Section und übrige Lokalisierung; vollständige Router-Abnahme weiterhin offen.
- **Nächster Einstieg:** kleinen Integrationsplan für die Feiern-Section mit Dateien, Prüfungen und geltenden Skill-Voraussetzungen vorstellen; erst nach eigenem GO umsetzen.

## 20. Feiern-Section integrieren – 02.11.2026

- **Arbeitsbeginn / Freigabe:** GO zur vorgestellten begrenzten Textintegration nach Skill-Installation; `gpt-taste` gelesen und Designplan vor Code ausgegeben. Bestehende Gestaltung gemäß Auftrag erhalten.
- **Erledigt:** fünf freigegebene Texte je Sprache eingebunden und per Props an die Feiern-Section übergeben; deutsches Original, Bild, Anfrageziel und Motion erhalten.
- **Tatsächlich geprüft:** Typecheck, Lint, 7 Tests und isolierter Production-Build erfolgreich. Texte, Anfrageziel und Sprachwechsel bei drei Viewports geprüft. Repräsentative Screenshots angesehen; Textprüfungen erfolgreich, separater visueller Befund V1 in `TASKS.md` erfasst. Keine vollständige visuelle Abnahme. Diff ohne Formatfehler.
- **Dokumentation:** `CONTENT.md`, `SPEC.md` und `TASKS.md` aktualisiert.
- **Offen:** V1, übrige Lokalisierung und R3/R4; vollständige Router-Abnahme weiterhin offen.
- **Nächster Einstieg:** V1 mit kleinem Diagnoseplan zur Freigabe vorstellen; noch keine Layoutkorrektur mit diesem GO ausführen.

## 21. Projektbezogene Skill-Übersicht – 02.11.2026

- **Arbeitsbeginn / Freigabe:** GO für `SKILLS.md` und Zuständigkeitsverweis in `AGENTS.md`.
- **Erledigt:** aktuelle lokale Skill-Fundstellen geprüft und Übersicht angelegt; Zuständigkeit ohne Duplikation der Einsatzregeln ergänzt. Fortschritt in `TASKS.md` festgehalten.
- **Prüfung:** Pfade und Dokumentationsverweise abgeglichen; `git diff --check` erfolgreich. Keine Anwendungstests, da kein Anwendungscode geändert wurde.
- **Offen:** vorhandene Implementierungs-/QA-Restpunkte bleiben bestehen; kein neuer Skill installiert.
- **Nächster Einstieg:** zum offenen Diagnosevorschlag V1 zurückkehren und vor Beginn das zugehörige GO einholen.

## 22. V1-Diagnose – 02.11.2026

- **Arbeitsbeginn / Freigabe:** GO ausschließlich für Messung, Ursachenanalyse und Korrekturplan.
- **Erledigt:** sechs Browserfälle auf unverändertem Prüfbuild verglichen und CSS-/Motion-Ursache eingegrenzt. V1 bei 768 px auch über Headerlink bestätigt; Messergebnisse ausschließlich in `TASKS.md`.
- **Prüfung:** Browserrechtecke bei drei Viewportbreiten mit Reduced Motion erfasst; Dokumentations-Diff mit `git diff --check` geprüft. Keine neuen Anwendungstests/Builds, kein UI-Code geändert.
- **Offen:** V1 noch nicht behoben; normale Motion und weitere Sprachen/Grenzbreiten im Korrekturprüfplan berücksichtigt.
- **Nächster Einstieg:** GO für den in `TASKS.md` vorgestellten begrenzten Tablet-Scrollabstand einholen; danach nur V1 korrigieren und regressionsprüfen.

## 23. V1-Korrektur abschließen – 02.11.2026

- **Arbeitsbeginn / Freigabe:** GO für begrenzten tokenbasierten Tablet-Scrollabstand und Regression; Designplan vor CSS-Änderung ausgegeben.
- **Erledigt:** Scrollabstand für Feiern-Sprungziel zwischen 768 und 900 px implementiert; Tokens in `DESIGN_SYSTEM.md`, Umsetzung und geprüfte Grenzen in `TASKS.md` dokumentiert.
- **Tatsächlich geprüft:** Typecheck, Lint, 7 Tests und isolierter Production-Build erfolgreich. Nach verworfenem unvollständigem Erstlauf alle 72 Browserfälle mit geladenem Inhalt erneut erfolgreich geprüft; Screenshots beider Motion-Einstellungen am ursprünglichen Tabletfall angesehen. Einzelheiten ausschließlich im V1-Abschluss in `TASKS.md`.
- **Ergebnis:** V1 im vereinbarten Umfang behoben. Kein weiterer UI-Umfang begonnen; vollständige Router-/Lokalisierungsabnahme weiterhin offen.
- **Nächster Einstieg:** nächsten kleinen Inhaltsblock vorschlagen, beispielsweise Reservierungsabschluss mit EN-/IT-Textentwürfen; erst nach eigenem GO beginnen. Andere Anker bleiben bei Bedarf gesondert zu prüfen.

## 24. README erstellen – 02.11.2026

- **Arbeitsbeginn / Freigabe:** GO für die vorgestellte Projekteinführung und lokale Kurzanleitung.
- **Erledigt:** README erstellt, Zuständigkeit in `AGENTS.md` ergänzt und Fortschritt in `TASKS.md` dokumentiert.
- **Prüfung:** Befehle, Konfiguration und Verzeichnisse gegen Repository abgeglichen; lokale Dokumentationslinks und npm-Scriptnamen automatisiert geprüft; `git diff --check` erfolgreich. Keine Anwendungstests/Builds oder Serverstarts für diese reine Dokumentationsänderung.
- **Offen:** vorhandene Lokalisierungs-/SEO-Restpunkte bestehen weiter.
- **Nächster Einstieg:** nächsten kleinen Inhaltsblock, beispielsweise EN-/IT-Entwürfe für den Reservierungsabschluss, vorstellen; erst nach eigenem GO beginnen.
