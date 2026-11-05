# Tagesplan Full-Stack-Finalprojekt

**Status:** Verdichteter Arbeitsentwurf für zwei Personen; Gates und fachliche Eingangsdaten bleiben verbindliche Voraussetzungen

**Phase:** `FS1` freigegeben und in Arbeit

**Planungszeitraum:** 02.11.2026–13.11.2026

**Letzte Aktualisierung:** 03.11.2026

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
| Mo, 02.11. | FS1-Server- und API-Struktur vorbereiten; offene Reservierungsfragen bündeln | MongoDB Atlas festlegen, Mongoose-Umgebung und Verbindungstest umsetzen; TanStack-Router-Stand verifizieren | Person B: Atlas-Verbindung und Router-Bestand verifiziert; Person A bleibt separat | `PERSON B ERLEDIGT` |
| Di, 03.11. | Express/TypeScript, App-/Server-Trennung, Healthcheck, Fehlerformat und Konfigurationsvalidierung | MongoDB/Mongoose-Verbindung, Migrationsrahmen und lokale Testumgebung | Reproduzierbare Plattform, Unit-/Integrationstest und gegenseitiger Review | `PERSON A ERLEDIGT; PERSON B ERLEDIGT` |
| Mi, 04.11. | Kernmodelle, Repository-/Service-Grenzen, Indizes und künstliche Seed-Daten | TanStack Router migrieren; Sprachrouten, Direktaufruf, Reload, Lazy Loading und Buildstrategie absichern | FS1-Datenbasis plus Router-Regression; React Router erst nach erfolgreicher Abnahme entfernen | `PERSON A ERLEDIGT; PERSON B OFFEN` |
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

## 9. Aktueller Tagesstand – 02.11.2026

- **Aktuelle Phase:** `FS1` ist ausdrücklich freigegeben und in Arbeit.
- **Person B heute erledigt:** MongoDB Atlas ohne Docker bestätigt; Mongoose, Zod und TypeScript-Laufzeit installiert; `.env` abgesichert; validierte Konfiguration, Verbindungsmodul, `db:check` und neun neue Datenbank-/Konfigurationstests ergänzt; echte Verbindung zum Atlas-Cluster hergestellt; vorhandenen TanStack-Router-Stand technisch und sichtbar geprüft.
- **Verifiziert:** `npm run db:check` meldet `connected`; Typecheck, OXLint, 16 Unit-Tests und Vite-Production-Build sind erfolgreich. Lokale Direktaufrufe und Reloads funktionieren im Dev-Server und Production-Preview für die geprüften Routen. Der Build meldet Bundle-Größen- und Modul-Direktiven-Warnungen.
- **Router-Befunde für 04.11.:** `/en` rendert auf der Startseite noch deutschen Inhalt; ein unbekannter lokalisierter Pfad zeigt den technischen TanStack-Fehlerzustand statt der gestalteten 404-Seite; Prerender/SEO fehlen; Netlify veröffentlicht noch den veralteten Ordner `build/client` statt des aktuellen Vite-Ausgabeordners `dist`.
- **Für Person B am 02.11. offen:** Keine weitere lokale Implementierungsaufgabe. Nur Atlas-Region und geringstmögliche Benutzerrechte müssen im Atlas-Konto noch geprüft beziehungsweise mitgeteilt werden; dafür lässt sich aus dem Repository kein Nachweis ableiten.
- **Nächster planmäßiger Einstieg Person B:** Am 03.11. Migrationsrahmen und lokale Datenbank-Testumgebung bearbeiten; keine Arbeit aus späteren Phasen vorziehen.

## 10. Aktueller Tagesstand – 03.11.2026

- **Zusätzlicher freigegebener Reparaturumfang:** Frontend-Regressionskorrektur der bestehenden Marketing-Website; keine Änderung an den laufenden Backend-Arbeitsbereichen von Person A/B.
- **Erledigt:** Ursache der verschwundenen Desktop-/Touch-Animationen getrennt; pauschales Mobile-Lite-Early-Return entfernt; native Touch-Scrollbewegung beibehalten; Navigation, sticky Speisekarte, Section-Reveals und Bewertungsband reaktiviert; Mobile-Layer-Overlap ohne Video-Pinning entfernt; Mobile-Parallax aus Performancegründen deaktiviert.
- **Technisch erledigt:** gestaltete Router-404 statt technischer Fehleransicht, korrektes `lang`-Attribut, Lazy Loading der schweren Notte-/Prototypmodule und Netlify-Publish-Verzeichnis `dist`.
- **Ausgeführte Prüfungen:** `npm run typecheck`, `npm run lint`, `npm test` mit 16/16 bestandenen Tests und `npm run build` erfolgreich. Desktop visuell im In-App-Browser geprüft; Mobile bei 390 × 844 px mit statischem Reduced-Motion-Fallback geprüft. Der erste Testaufruf mit der nicht unterstützten Vitest-Option `--runInBand` wurde verworfen und korrekt ohne diese Option wiederholt.
- **Build-Ergebnis:** Das frühere einzelne JavaScript-Bundle mit rund 702 KB ist durch Route-Lazy-Loading in Haupt- und Notte-Chunk mit rund 368 KB beziehungsweise 333 KB geteilt; die 500-KB-Warnung entfällt.
- **Weitere Erledigungen:** Feiern-Section auf allen Breakpoints als exakt `100svh` definiert; englische und italienische Notte-Fassung einschließlich Navigation, Hauptinhalte, Aktionen, Öffnungszeiten, Bewertungsmetadaten und Speisekarten-Overlay-Bedienung ergänzt. Verifizierte Speisen- und Rezensionstexte bleiben unverändert.
- **Impeccable:** Globaler Updateversuch mit `npx impeccable update --global --force -y` ausgeführt; der CLI-Updater erkennt die Codex-gebündelte Installation nicht und verlangt eine separate Neuinstallation. Keine doppelte Installation angelegt.
- **Prerender/SEO umgesetzt:** Der Production-Build erzeugt über `scripts/prerender.ts` für 15 lokalisierte Routen eigenes semantisches HTML, lokalisierte Title/Descriptions, Open Graph, `Restaurant`-JSON-LD und `robots.txt`. Die verknüpfte Netlify-Produktionsbasis `https://ristorante-colosseo-winsen.netlify.app` wurde verifiziert und als `SITE_URL` gesetzt; Canonical, Hreflang und Sitemap wurden damit lokal erfolgreich erzeugt.
- **Frontend-Ergänzung:** Reservierungsabschluss mit freigegebener „Vino Ember“-WebGL-Hintergrundbewegung, statischem Mobile-/Reduced-Motion-Fallback und unveränderter lokalisierter Telefonaktion umgesetzt. Typecheck, Lint, Tests, Build und visuelle Prüfung werden im Tagesabschluss dieses Arbeitsschritts konkret nachgetragen.
- **Person B – Datenbank erledigt:** Sicherheitsproblem in `.env.example` behoben und alle Zugangsdaten durch erkennbare Platzhalter ersetzt. Versionierten MongoDB-Migrationsrahmen mit geordneter Registry, Historie, Sperre gegen parallele Läufe, Status, Vorwärtslauf und einzelnem Rollback implementiert. `.env.test.example`, Atlas-Testzielschutz und eigene Test-/Migrationsbefehle ergänzt.
- **Tatsächlich ausgeführte Datenbankprüfungen:** `npm run typecheck`, `npm run lint`, `npm test` mit 24/24 bestandenen Tests, `npm run build` und `npm run db:migrate:status` erfolgreich. Der Statuslauf hat die echte Entwicklungsverbindung verwendet und erwartungsgemäß gemeldet, dass noch keine konkrete Migration registriert ist.
- **Person B – Atlas-Testziel verifiziert:** `.env.test` überschreibt nur `NODE_ENV=test` und `MONGODB_DB_NAME=colosseo_test`; die geheime Atlas-URI wird sicher aus der ignorierten `.env` übernommen und nicht dupliziert. `npm run db:check:test` verbindet nachweislich mit `colosseo_test`. `npm run db:migrate:test` läuft erfolgreich und meldet mangels konkreter Schema-Migrationen erwartungsgemäß „already up to date“.
- **Sicherheitshinweis:** Falls die zuvor in `.env.example` sichtbaren Zugangsdaten jemals gültig waren, muss das betreffende Atlas-Passwort im Atlas-Konto rotiert werden; dies kann nicht aus dem Repository heraus verifiziert oder sicher durchgeführt werden.
- **Person B – Atlas-Grundlage abgeschlossen:** Über eine neue Atlas-Verbindung wurden am 03.11.2026 ohne Ausgabe von URI oder Passwort ausschließlich datenbankspezifische `readWrite`-Rollen für `colosseo` und `colosseo_test` verifiziert. `npm run db:check`, `npm run db:check:test` und `npm run db:migrate:test` sind erfolgreich. Der Nutzer bestätigte MongoDB `8.0.36`, AWS Frankfurt (`eu-central-1`) und ein Replica Set mit drei Nodes. Backups sind derzeit inaktiv und bleiben ein späterer Produktionspunkt.
- **Person B – Produktionsregression:** `npm run typecheck`, `npm run lint`, `npm test` mit 24/24 Tests und `npm run build` erfolgreich. `/de`, `/en`, `/it`, direkter Reload und die gestaltete 404-Seite wurden im lokalen Produktions-Build geprüft; `netlify.toml` veröffentlicht `dist`. Die Build-Hinweise zu fremden `use client`-Direktiven sind nicht fehlgeschlagen und stammen aus Abhängigkeiten.
- **Prerender-Prüfung:** Typecheck, Lint, 24/24 Tests und Build erfolgreich. Die 15 Zieldateien, lokalisierte statische Inhalte, Metadaten, strukturierte Daten sowie die anschließende interaktive React-Darstellung wurden geprüft. Ein zunächst gefundener `%20`-Pfadfehler bei Leerzeichen im Projektordner wurde mit `fileURLToPath` behoben; der ausschließlich dadurch erzeugte Fehlordner wurde in den Papierkorb verschoben.
- **Nächster Einstieg Person B:** Nach ausdrücklicher Deployment-Freigabe den aktuellen Stand auf Netlify veröffentlichen und Canonical/Hreflang/Sitemap, Sprachrouten, Reload und 404 live regressionsprüfen. Konkrete Indexmigrationen folgen erst zusammen mit den bestätigten Modellen; eine Backup-Strategie folgt vor realem Produktionsbetrieb.
- **Person A – 03.11.2026 erledigt:** Express-Abhängigkeit, getrennte App-/Server-Dateien, `/api/health`, Korrelations-ID, einheitliches 404-/500-Fehlerformat, sichere Basiskonfiguration und validierter `PORT` ergänzt. Frontend-Dateien blieben unverändert.
- **Person A – tatsächlich ausgeführte Prüfungen:** `npm run typecheck`, `npm run lint` und `npm test` mit 24/24 Tests erfolgreich; lokaler HTTP-Smoke-Test konnte wegen Sandbox-Fehler `listen EPERM` nicht ausgeführt werden.
- **Person A – Restpunkt:** statische Produktionsauslieferung über Express und ein erlaubter Listener-/API-Integrationstest bleiben für die nächste FS1-Kleinaufgabe offen.
- **Person A – 04.11.2026 erledigt:** vorläufige Mongoose-Kernmodelle, typisierte Reservation-Repository-/Service-Grenze, Core-Indexmigration und künstlicher Development-Seed ergänzt. Keine realen Tisch-, Zeit- oder Restaurantdaten erfunden.
- **Person A – tatsächlich ausgeführte Prüfungen:** `npm run typecheck`, `npm run lint` und `npm test` mit 24/24 Tests erfolgreich; `git diff --check` erfolgreich.
- **Person A – Restpunkte:** fachliche Reservierungsregeln, konkrete produktive Daten und echte Atlas-Ausführung der Core-Indexmigration bleiben offen. Frontend unverändert.
