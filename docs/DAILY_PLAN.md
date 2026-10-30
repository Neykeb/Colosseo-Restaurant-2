# Tagesplan Full-Stack-Finalprojekt

**Status:** Arbeitsentwurf für zwei Personen; Aufgabenverteilung und Gate-Termine sind noch zu bestätigen  
**Phase:** Planung innerhalb `FS0`; keine Freigabe für Anwendungscode  
**Planungszeitraum:** 02.11.2026–20.11.2026  
**Letzte Aktualisierung:** 30.10.2026

Diese Datei ist ausschließlich die operative Arbeitsübersicht. Anforderungen stehen in `docs/SPEC.md`, verbindliche Phasen und Gates in `docs/TASKS.md`. Ein Kalendertag ersetzt kein erforderliches `GO`: Ohne Freigabe wird an diesem Tag nur an erlaubten Vorbereitungen, Dokumentation oder Tests gearbeitet.

## 1. Rollenmodell

Bis die Namen festgelegt sind, verwenden wir:

- **Person A – Backend/Domain:** Express, API, Geschäftslogik, Reservierungslogik und Backend-Tests.
- **Person B – Daten/Admin/Integration:** MongoDB/Mongoose, Clerk, Admin-Frontend, Integration, Accessibility und E2E-Tests.
- **Gemeinsam:** Architekturentscheidungen, Reviews, Datenschutz, Sicherheitsprüfung, Präsentationswissen und Gate-Abnahmen.

Keiner markiert Arbeit der anderen Person ohne nachvollziehbaren Review als erledigt. Aufgaben, die denselben Codebereich betreffen, werden nicht gleichzeitig ohne vorherige Absprache bearbeitet.

## 2. Statuslegende

- `OFFEN`: noch nicht begonnen
- `IN ARBEIT`: aktiv bearbeitet; verantwortliche Person und Branch müssen genannt sein
- `BLOCKIERT`: Grund und benötigte Entscheidung müssen genannt sein
- `REVIEW`: Umsetzung abgeschlossen, Gegenprüfung ausstehend
- `ERLEDIGT`: Ergebnis und tatsächlich ausgeführte Prüfung sind dokumentiert

## 3. Terminrahmen

- Start: Montag, **02.11.2026**
- Interne Fertigstellung: Freitag, **20.11.2026**
- Umfang: 15 Werktage für zwei Personen
- Puffer: Der 19. und 20.11. sind überwiegend für Gesamttests, Fehlerbehebung und Präsentationsvorbereitung reserviert.
- `ANNAHME`: Beide Personen können an jedem Werktag am Projekt arbeiten. Abwesenheiten oder andere feste Termine sind noch nicht bekannt.
- `RISIKO`: Der Zeitplan ist nur erreichbar, wenn Gates und benötigte Geschäftsdaten rechtzeitig bereitstehen. Ungeklärte Reservierungsregeln blockieren `FS3` und alle darauf aufbauenden Phasen.

## 4. Tagesplan

| Datum | Person A | Person B | Gemeinsames Tagesziel / Gate | Status |
|---|---|---|---|---|
| Mo, 02.11. | Architektur und lokale Serverstrategie erklären; FS1-Aufgaben vorbereiten | Atlas-/lokale MongoDB-Optionen prüfen; Umgebungsvariablen-Checkliste vorbereiten | Offene FS1-Entscheidungen klären, Gate `FS0` und `GO FS1` einholen | `OFFEN` |
| Di, 03.11. | Express-/TypeScript-Grundlage, App-/Server-Trennung und Healthcheck | MongoDB-Verbindung, Konfigurationsvalidierung und lokale Entwicklungsumgebung | Plattform startet reproduzierbar; gegenseitiger Review | `BLOCKIERT` bis `GO FS1` |
| Mi, 04.11. | Fehlerformat, Korrelations-ID und sichere Middleware-Basis | Mongoose-Basismodelle, Indizes und Migrationsrahmen | Kernstruktur mit Unit-/Integrationstests | `BLOCKIERT` bis `GO FS1` |
| Do, 05.11. | Repository-/Service-Grenzen und API-Testaufbau | Kernmodelle für Betrieb, Tische, Reservierungen, Events und Outbox | FS1-Schema und Datenflüsse gemeinsam prüfen | `BLOCKIERT` bis `GO FS1` |
| Fr, 06.11. | Statische Produktionsauslieferung und Regression der öffentlichen Website | Seed mit klar künstlichen Daten und Datenbanktests | FS1-Abschlussbericht, Tests und Gate-Präsentation | `BLOCKIERT` bis `GO FS1` |
| Mo, 09.11. | Express-Clerk-Prüfung und Rollenmiddleware | Clerk-Client, OAuth-Zustände und geschütztes Admin-Grundlayout | Nur nach `GO FS2`: Anmeldung plus Zugriff-verweigert-Zustand | `BLOCKIERT` bis `GO FS2` |
| Di, 10.11. | Owner-/Staff-Rechte und API-Autorisierungstests | Adminprofil, Owner-Bootstrap, Accessibility und Redirect-Prüfung | FS2 abschließen; parallel reale Reservierungsregeln finalisieren | `BLOCKIERT` bis `GO FS2` |
| Mi, 11.11. | Zeitfenster-, Status- und Verfügbarkeits-Domainlogik | Tisch-/Bereichsdaten, Testfixtures und Admin-API-Vorbereitung | Nur nach `GO FS3`: reservierbare Slots fachlich korrekt berechnen | `BLOCKIERT` bis `GO FS3` |
| Do, 12.11. | Atomare Tischzuweisung, Idempotenz und Parallelitätsschutz | Config-/Availability-Endpunkte integrieren und Grenzfälle testen | Concurrency-, Zeitzonen- und Ausgebucht-Tests bestehen | `BLOCKIERT` bis `GO FS3` |
| Fr, 13.11. | Reservation-Endpunkt, Rate-Limit und Statusübergänge | Öffentliche Formularintegration mit Lade-/Fehlerzuständen | FS3 abnehmen; FS4-Oberfläche vorbereiten, ohne Gate vorwegzunehmen | `BLOCKIERT` bis `GO FS3` |
| Mo, 16.11. | Outbox und idempotente Resend-Service-Schicht | Reservierungsformular, Bestätigung, Mobile und Accessibility | Nur nach `GO FS4`: vollständige Gaststrecke ohne reale Testmails | `BLOCKIERT` bis `GO FS4` |
| Di, 17.11. | Reservierungs-/Kalender-APIs, Suche, Filter und Historie | Dashboard, Tages-/Wochenansicht und Detailbearbeitung | Nur nach `GO FS5`: operativer Reservierungsablauf | `BLOCKIERT` bis `GO FS5` |
| Mi, 18.11. | Menü-, Öffnungszeiten- und Veröffentlichungs-APIs | Adminmasken für Kategorien, Gerichte und Öffnungszeiten | Nur nach `GO FS6`: CMS-Kern und öffentlicher Fallback | `BLOCKIERT` bis `GO FS6` |
| Do, 19.11. | Security-, Datenschutz-, API- und Parallelitätsprüfungen | E2E-, Accessibility-, Mobile- und `break-ui`-Prüfungen | Nur nach `GO FS7`: gemeinsame Fehlerliste priorisieren und beheben | `BLOCKIERT` bis `GO FS7` |
| Fr, 20.11. | Backend-Regressionslauf, Betriebs- und API-Erklärung | Frontend-/Admin-Regressionslauf und Präsentationsablauf | Finalprojekt-Demo, Dokumentation, Restpunkte und Render-Go/No-Go; kein Deployment ohne Freigabe | `OFFEN` |

## 5. Kritischer Hinweis zum Umfang

Der Kalender bildet das gewünschte Ziel bis 20.11. ab, hebt aber die Gates `FS1` bis `FS8` nicht auf. Die Phasen `FS5` und `FS6` sind umfangreich. Falls Entscheidungen, Reviews oder Fehlerbehebungen länger dauern, gilt diese Priorität:

1. sichere Plattform und Datenbank
2. geschützter Adminzugang
3. korrektes Reservierungs- und Verfügbarkeitssystem
4. vollständige Gaststrecke und Benachrichtigung
5. Reservierungsverwaltung
6. Speisekarten-/Öffnungszeitenverwaltung
7. Produktionsdeployment erst nach vollständiger QA und eigener Freigabe

Nicht fertiggestellte Funktionen werden transparent als offen dokumentiert und nicht nur für eine Präsentation vorgetäuscht.

## 6. Täglicher Arbeitsbeginn

Vor der ersten Änderung werden diese fünf Punkte ausgefüllt:

```md
### Tagesstart – TT.MM.2026

- Aktuelle Phase / freigegebenes Gate:
- Stand vom Vortag:
- Person A heute:
- Person B heute:
- Blockaden / benötigte Entscheidungen:
```

Danach wird geprüft:

- Ist für die geplante Phase ein ausdrückliches `GO` dokumentiert?
- Sind benötigte Nutzerdaten und Entscheidungen vorhanden?
- Arbeiten beide Personen an getrennten, klar verantworteten Bereichen?
- Welche Tests müssen heute mindestens laufen?

## 7. Täglicher Abschluss

Am Ende jedes Arbeitstages wird genau ein Eintrag ergänzt:

```md
### Tagesabschluss – TT.MM.2026

- Person A erledigt:
- Person B erledigt:
- Gemeinsam geprüft:
- Tatsächlich ausgeführte Tests und Ergebnis:
- Geänderte Dokumentation:
- Offen / blockiert:
- Erster nächster Schritt:
```

Regeln:

- Nur nachweislich erledigte Aufgaben erhalten `ERLEDIGT`.
- Testnamen und Ergebnis werden konkret genannt; „alles getestet“ reicht nicht.
- Offene Arbeit wird mit Verantwortlichem und neuem Termin eingetragen.
- Der „erste nächste Schritt“ muss so konkret sein, dass beide Personen am Folgetag ohne erneute Suche beginnen können.

## 8. Aktueller Tagesstand – 30.10.2026

- **Erledigt:** Bestandsanalyse, Zielarchitektur, Stackentscheidung, Full-Stack-Roadmap, Clerk-Entscheidung sowie Backend- und Tagesplan-Übersicht.
- **Nicht begonnen:** Backend-Anwendungscode, Datenbank, Clerk-Integration, Resend-Integration und Render-Konfiguration.
- **Offen:** MongoDB-Atlas-Bestätigung, lokale MongoDB-Strategie, OAuth-Anbieter, Clerk-Anwendung, Owner-Identität sowie fachliche Reservierungsregeln.
- **Nächster Schritt:** Offene Voraussetzungen für `FS1` beantworten und anschließend Gate `FS0` plus `GO für FS1` ausdrücklich freigeben.
