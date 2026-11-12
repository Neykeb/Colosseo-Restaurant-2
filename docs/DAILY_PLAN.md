# Tagesplan Full-Stack-Finalprojekt

**Status:** FS4 technisch umgesetzt; Person-B-Aufgaben vom 10.11. einschließlich Render-E2E abgeschlossen, externe Freigaben und Gate-Abnahme offen

**Phase:** `FS4` – Öffentliche Reservierungsstrecke und Benachrichtigungen

**Planungszeitraum:** 02.11.2026–13.11.2026

**Letzte Aktualisierung:** 11.11.2026

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
| Mi, 04.11. | Kernmodelle, Repository-/Service-Grenzen, Indizes und künstliche Seed-Daten | TanStack Router, Sprachrouten, Direktaufruf, Reload, Lazy Loading, Prerendering und Netlify-Livebetrieb absichern | FS1-Datenbasis und vollständige lokale sowie produktive Router-/SEO-Regression | `PERSON A ERLEDIGT; PERSON B ERLEDIGT` |
| Do, 05.11. | Clerk-Prüfung, Adminprofile, Rollenmiddleware und Autorisierungstests | Clerk-Client, OAuth-Zustände und geschütztes Admin-Grundlayout | Erlaubter Owner-Zugriff und verständliches `403` für nicht freigeschaltete Konten | `ERLEDIGT; GATE-ABNAHME OFFEN` |
| Fr, 06.11. | Verfügbarkeits-, Zeitfenster- und Statuslogik | reale Tisch-/Bereichsdaten modellieren; Config-/Availability-Integration | Nur nach `GO FS3`: fachliche Regeln und Grenzfälle als Tests nachweisen | `BLOCKIERT` bis `GO FS3` |
| Mo, 09.11. | atomare Tischzuweisung, Idempotenz, Rate-Limit und parallele Reservierungsversuche | öffentliches Reservierungsformular mit Lade-, Fehler-, Mobil- und Accessibility-Zuständen | Letzte Kapazität kann nicht doppelt bestätigt werden; API- und UI-Integration | `PERSON A ERLEDIGT; PERSON B REVIEW` |
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

## 9. Tagesabschluss – 02.11.2026

- **Aktuelle Phase:** `FS1` ist ausdrücklich freigegeben und in Arbeit.
- **Person B heute erledigt:** MongoDB Atlas ohne Docker bestätigt; Mongoose, Zod und TypeScript-Laufzeit installiert; `.env` abgesichert; validierte Konfiguration, Verbindungsmodul, `db:check` und neun neue Datenbank-/Konfigurationstests ergänzt; echte Verbindung zum Atlas-Cluster hergestellt; vorhandenen TanStack-Router-Stand technisch und sichtbar geprüft.
- **Verifiziert:** `npm run db:check` meldet `connected`; Typecheck, OXLint, 16 Unit-Tests und Vite-Production-Build sind erfolgreich. Lokale Direktaufrufe und Reloads funktionieren im Dev-Server und Production-Preview für die geprüften Routen. Der Build meldet Bundle-Größen- und Modul-Direktiven-Warnungen.
- **Router-Befunde für 04.11.:** `/en` rendert auf der Startseite noch deutschen Inhalt; ein unbekannter lokalisierter Pfad zeigt den technischen TanStack-Fehlerzustand statt der gestalteten 404-Seite; Prerender/SEO fehlen; Netlify veröffentlicht noch den veralteten Ordner `build/client` statt des aktuellen Vite-Ausgabeordners `dist`.
- **Für Person B am 02.11. offen:** Keine weitere lokale Implementierungsaufgabe. Nur Atlas-Region und geringstmögliche Benutzerrechte müssen im Atlas-Konto noch geprüft beziehungsweise mitgeteilt werden; dafür lässt sich aus dem Repository kein Nachweis ableiten.
- **Nächster planmäßiger Einstieg Person B:** Am 03.11. Migrationsrahmen und lokale Datenbank-Testumgebung bearbeiten; keine Arbeit aus späteren Phasen vorziehen.

## 10. Tagesabschluss – 03.11.2026

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
## 11. Tagesabschluss – 04.11.2026

- **Person B erledigt:** TanStack-Router- und SEO-Bestand nach den neuen Teamänderungen erneut geprüft, Production-Build mit bestätigter `SITE_URL` erzeugt und den verifizierten `dist`-Ordner auf die verknüpfte Netlify-Site veröffentlicht.
- **Livebetrieb korrigiert:** Der zunächst aktive Netlify-SSO-Zugriffsschutz lieferte für alle Seiten und Assets `401 Login Redirect`. Der Site-spezifische Schutz wurde deaktiviert; die Produktionssite ist danach öffentlich erreichbar.
- **Live geprüft:** `/`, `/de`, `/en`, `/it`, die lokalisierten Speisekartenpfade, direkte Reloads, clientseitige gestaltete 404, lokalisierte Titel und `lang`-Attribute, Canonical, Hreflang, `og:url`, `robots.txt`, Sitemap mit 15 URLs sowie Haupt- und Lazy-Chunks.
- **Tatsächlich ausgeführte Tests:** `npm run typecheck`, `npm run lint`, `npm test` mit 24/24 Tests und Production-Build erfolgreich. Anschließend HTTP- und reale Browserprüfung auf `https://ristorante-colosseo-winsen.netlify.app` erfolgreich.
- **Bewahrte Teamänderungen:** Die Express-Ergänzungen von Person A wurden zunächst unverändert mitgeprüft und am 05.11. nach der Zusammenführung gemeinsam regressionsgeprüft.
- **Offen für Person B am 04.11.:** keine weitere Router-/Deployment-Aufgabe. Konkrete Datenbankmodelle und Indexmigrationen folgen erst zusammen mit dem freigegebenen FS1-Modellumfang; Backups bleiben vor realem Produktionsbetrieb offen.
- **Nächster planmäßiger Einstieg Person B:** Erst nach Abschluss und Abnahme von `FS1` sowie ausdrücklichem `GO für FS2` mit Clerk-Client, OAuth-Zuständen und geschütztem Admin-Grundlayout beginnen.
- **Person A erledigt:** Express-Abhängigkeit, getrennte App-/Server-Dateien, `/api/health`, Korrelations-ID, einheitliches 404-/500-Fehlerformat, sichere Basiskonfiguration und validierter `PORT` sowie vorläufige Mongoose-Kernmodelle, typisierte Reservation-Repository-/Service-Grenze, Core-Indexmigration und künstlicher Development-Seed ergänzt. Keine realen Tisch-, Zeit- oder Restaurantdaten erfunden.
- **Person A – bisherige Prüfungen:** `npm run typecheck`, `npm run lint`, `npm test` mit 24/24 Tests und `git diff --check` erfolgreich; der frühere Listener-Smoke-Test war durch `listen EPERM` blockiert.
- **Gemeinsame FS1-Restpunkte:** statische Produktionsauslieferung über Express, erlaubter Listener-/API-Integrationstest, echte Atlas-Ausführung der Core-Indexmigration sowie Präsentation und Abnahme von Gate `FS1`. Fachliche Reservierungsregeln und produktive Inhalte gehören in spätere freigegebene Phasen.

## 12. Tagesstart und FS1-Abschluss – 05.11.2026

- **Ausgangslage:** Die Dokumentationsänderungen beider Personen lagen mit Merge-Konflikten vor. `FS2` blieb wegen fehlender Gate-Abnahme und Clerk-Eingangsdaten gesperrt.
- **Konfliktlösung:** `docs/DAILY_PLAN.md` und `docs/TASKS.md` inhaltlich zusammengeführt; Backend-Ergebnisse von Person A und Router-/Netlify-Ergebnisse von Person B vollständig erhalten. `.env.test` aus der Git-Verfolgung entfernt und weiterhin nur lokal über `.gitignore` geschützt.
- **FS1-Korrekturen:** Direkten TypeScript-Serverstart repariert, statische Produktionsauslieferung über Express ergänzt und die unvollständige handgeschriebene Express-Deklaration durch `@types/express` ersetzt.
- **Neue Integrationstests:** Direkter Einstieg, Healthcheck, übernommene Korrelations-ID, strukturiertes API-404 und statischer SPA-Fallback werden automatisiert geprüft.
- **Echte Prozessprüfungen:** Development- und Production-Server erfolgreich gestartet und kontrolliert beendet; `/api/health`, API-404, `/de/`, `/en/`, `/it/` und HTML-Fallback erfolgreich über echte lokale Listener abgerufen.
- **Datenbank:** Core-Indexmigration erfolgreich und wiederholbar gegen `colosseo_test` geprüft sowie anschließend in der Atlas-Entwicklungsdatenbank `colosseo` angewendet. Es wurden keine realen Restaurant- oder Gastdaten erzeugt.
- **Tatsächlich ausgeführte Prüfungen:** Typecheck, Lint, 28/28 Tests, Production-Build und `git diff --check` erfolgreich; `db:check`, Testmigration, Development-Migration und Migrationsstatus erfolgreich.
- **Gate-Status:** `FS1` ist technisch abgeschlossen und wartet auf ausdrückliche Nutzerabnahme. `FS2` wurde nicht begonnen.
- **Nächster zulässiger Schritt:** FS1-Ergebnis präsentieren; anschließend Clerk-Anwendung, OAuth-Anbieter, erste Owner-ID und Rollenmatrix klären und auf separates `GO für FS2` warten.

## 13. FS2-Freigabe – 05.11.2026

- **Gate:** Der Nutzer hat `FS1` abgenommen und `FS2` mit ausdrücklichem `GO` freigegeben.
- **Bestätigte Entscheidungen:** Eine Clerk-Anwendung existiert; Google ist der einzige OAuth-Anbieter. Der Restaurantbesitzer erhält als `owner` Vollzugriff und wird dauerhaft über seine eindeutige Clerk User-ID autorisiert. `staff` bleibt ohne konkrete Rechtefreigabe gesperrt.
- **Aktueller Blocker:** Person A muss ihre Clerk-Änderungen noch auf `dev` pushen. Die konkrete Owner-User-ID wird anschließend aus Clerk übernommen und nicht erfunden.
- **Nächster Einstieg:** Nach dem Push zuerst die vorhandene Implementierung und Secret-Trennung prüfen, dann nur fehlende Sessionprüfung, eigenes Adminprofil, Rollenmiddleware und geschütztes Admin-Grundlayout ergänzen.

## 14. Sicherheitsbereinigung – 05.11.2026

- **Befund:** Der Team-Push hatte `.env` und `.env.test` trotz vorhandener Ignore-Regeln erneut als bereits getrackte Dateien in mehrere Branch-Historien aufgenommen.
- **Bereinigung:** Beide Dateien wurden aus der gesamten erreichbaren Historie der Branches `dev`, `feature/momo` und `feature/szymon` entfernt; die bereinigten Branches wurden kontrolliert force-gepusht und lokal neu ausgerichtet. `.env.example` bleibt die einzige versionierte Env-Vorlage.
- **Prävention:** `npm test` führt nun zuerst `check:tracked-env` aus und bricht ab, falls `.env` oder eine private `.env.*`-Datei erneut getrackt wird.
- **Extern erforderlich:** Das veröffentlichte MongoDB-Passwort wird vom Nutzer rotiert. Da GitHub alte Commit-Ansichten und Pull-Request-Refs zwischenspeichern kann, ist die Rotation unabhängig von der Historienbereinigung zwingend.

## 15. FS2-Implementierungsstand – 05.11.2026

- **Integriert:** Person-As Clerk-Abhängigkeiten, Adminprofil und Rollenansatz geprüft. Falschen öffentlichen Login entfernt, öffentliche Website ohne Clerk-Key lauffähig gehalten und `/admin` als eigenen lazy geladenen Bereich ergänzt.
- **Backend:** Offizielle `getAuth()`-Schnittstelle, aktive Owner-Prüfung, `/api/admin/session`, sichere Fehlerzustände, kontrollierter Owner-Bootstrap und Datenbankverbindung vor Serverstart umgesetzt. `staff` erhält weiterhin keinen Zugriff.
- **Sicherheit/SEO:** Adminroute aus Navigation, Sitemap und Indexierung ausgeschlossen; Robots-Meta, `robots.txt`, Netlify- und Express-Header ergänzt. Private Env-Dateien werden weiterhin automatisiert abgewiesen.
- **Prüfungen:** Typecheck, Lint, 38/38 Tests und Production-Build erfolgreich. Öffentliche deutsche Seite sowie `/admin` ohne Clerk-Key auf Desktop und bei 320 px visuell geprüft.
- **Verifiziert am 05.11.2026:** Atlas-Testverbindung, vollständige Clerk-Schlüssel, übereinstimmende Publishable Keys, konkrete Owner User-ID und Google-Verbindung (`oauth_google`) wurden ohne Ausgabe sensibler Werte geprüft. Der idempotente Owner-Bootstrap läuft erfolgreich; Health antwortet mit `200`, der geschützte Admin-Endpunkt ohne Sitzung erwartungsgemäß mit `401`.
- **Noch offen:** Der Restaurantbesitzer muss den Google-Login einmal im Browser abschließen. Danach werden der signierte `/api/admin/session`-Request, die Owner-Ansicht, Tastaturbedienung und Abmeldung real geprüft.
- **Owner-Erweiterung:** Die freigegebene zweite Clerk User-ID wurde gegen Clerk geprüft und als zweites aktives Ownerprofil in Atlas angelegt. `npm run admin:grant-owner -- user_...` erlaubt weitere kontrollierte, idempotente Freischaltungen, ohne User-IDs im Code oder in Git zu speichern. Beide Ownerprofile sind aktiv; Typecheck, Lint und 38/38 Tests bleiben erfolgreich.
- **Break-UI-Befund:** Der Owner-Anzeigename war im Datenmodell unbeschränkt, obwohl der Bootstrap maximal 120 Zeichen akzeptiert. Der Befund wurde am 06.11. durch eine einheitliche Modellgrenze, eine Bestandsmigration, Modelltests und sicheres Umbrechen behoben.

## 16. FS2-Fortsetzung – 06.11.2026

- **Erledigt:** Der eingebettete Clerk-Anmeldedialog verwendet die offizielle deutsche Lokalisierung `deDE`. Die Lokalisierung bleibt im lazy geladenen Admin-Bundle und verändert die öffentliche Website nicht.
- **Prüfungen:** Typecheck, Lint, 38/38 Tests und Production-Build erfolgreich.
- **Nutzerverifiziert:** Invite-only, Abmeldung und erneute Anmeldung wurden erfolgreich geprüft. Ein weiterer angemeldeter, aber nicht freigeschalteter Benutzer erhielt erwartungsgemäß keinen Adminzugriff.
- **Tastaturprüfung:** „Zur Website“ und „Mit Google anmelden“ sind in sinnvoller Reihenfolge erreichbar; Enter öffnet den deutschen Clerk-Dialog, Escape schließt ihn und stellt den Fokus am Auslöser wieder her.
- **Break-UI-Korrektur:** `displayName` ist nun im Mongoose-Modell auf 120 getrimmte Zeichen begrenzt. Migration `0002_admin-display-name-limit` prüft vorhandene Profile ohne Namen stillschweigend zu verändern; lange Namen dürfen in der Begrüßung umbrechen.
- **Prüfungen:** Typecheck, Lint, 40/40 Tests und Production-Build erfolgreich. Die neue Migration wurde in `colosseo_test` und `colosseo` erfolgreich angewendet.
- **Gate-Status:** `FS2` ist technisch abgeschlossen und wartet auf Präsentation sowie ausdrückliche Abnahme. `FS3` wurde nicht begonnen.
- **Admin-Einstieg:** Nach Nutzerfreigabe wurde ein dezenter, lokalisierter Utility-Link im Footer ergänzt. Der Adminbereich bleibt aus Hauptnavigation und Suchindex ausgeschlossen; die Sichtbarkeit des Links ersetzt keine serverseitige Owner-Prüfung.

## 17. FS3-Teilstart – 06.11.2026

- **Freigegebener Person-B-Umfang:** Bereiche, Tische, erlaubte Kombinationen und anschließend die noch offenen betrieblichen FS3-Grundwerte. Der Nutzer hat ausdrücklich erfundene Daten erlaubt und neutrale Bezeichnungen ohne `demo` verlangt.
- **Umgesetzt:** Zwei Bereiche, acht Tische mit Mindest-/Maximalkapazität sowie drei Kombinationspaare als zentrale, idempotente Restaurantkonfiguration modelliert. Neutrale Schlüssel wie `main-dining` und `table-01` ersetzen die bisherigen Entwicklungsmarker.
- **Datenmodell:** Veraltete Felder `seats` und `combinable` durch `name`, `minPartySize`, `maxPartySize` und `combinationGroupKey` ersetzt. Eine Modellregel verhindert eine Mindestkapazität oberhalb der Maximalkapazität.
- **Betriebsregeln:** Elf Servicezeiten (Dienstag bis Sonntag), 120 Minuten Reservierungsdauer, 15 Minuten Puffer, 120 Minuten Mindestvorlauf, 60 Tage Buchungshorizont, 30-Minuten-Zeitfenster und 1 bis 10 Personen sind zentral hinterlegt. Montag besitzt keine buchbare Servicezeit.
- **Migration:** `0003_table-capacity-and-combinations` und `0004_initial-restaurant-configuration` wurden erfolgreich in `colosseo_test` und `colosseo` angewendet. Die zweite Migration ersetzt `demo-*`-Schlüssel, entfernt alte `development-*`-Platzhalter und bereitet mehrere Servicezeiten pro Wochentag vor.
- **Verifiziert:** Typecheck, Lint und 45/45 Tests sind erfolgreich. Der Seed meldet 2 Bereiche, 8 Tische und 11 Servicezeiten.
- **Weiter offen:** fachliche Bestätigung der vorläufigen Restaurantwerte sowie die pure Verfügbarkeitslogik, atomare Tischzuweisung, APIs und Concurrency-/Grenztests.

## 18. FS3-Fortsetzung des Arbeitspakets vom 06.11. – ausgeführt am 09.11.2026

- **Domainlogik:** Kalenderdatum, Wochentag, Restaurantzeitzone, Vorlauf, Buchungshorizont, Servicezeiten, Reservierungsdauer, Puffer, Tischkandidaten und erlaubte Statusübergänge als datenbankunabhängige Funktionen implementiert.
- **Verfügbarkeit:** Das System erzeugt nur vollständig in eine Servicezeit passende Startzeiten, berücksichtigt vorhandene Tisch-Zeit-Sperren und wählt deterministisch die kleinste passende Einzel- oder Kombinationsbelegung.
- **Atomare Buchung:** Reservierung, Tischzuweisungen und diskrete Sperrsegmente werden gemeinsam in einer MongoDB-Transaktion geschrieben. Der eindeutige Index aus Migration `0005_reservation-locks` verhindert Doppelbelegung bei parallelen Anfragen.
- **Öffentliche API:** `GET /api/reservations/config`, `GET /api/reservations/availability` und `POST /api/reservations` mit Zod-Validierung, Idempotency-Key und speicherinternem Rate-Limit umgesetzt. Interne Tischschlüssel werden bei öffentlichen Buchungen nicht ausgegeben.
- **Admin-API:** Manuelle Reservierungen sowie Listen, Anlegen und Entfernen zeitlicher Restaurant-, Bereichs- oder Tischsperren sind ownergeschützt. Migration `0006_reservation-blocks` wurde in Test- und Entwicklungsdatenbank angewendet.
- **Prüfungen:** Typecheck, Lint und 58/58 automatisierte Tests erfolgreich. Ein echter paralleler Test auf `colosseo_test` ergab genau eine bestätigte und eine konfliktbedingt abgewiesene Buchung. Das Erstellen einer vier Segmente umfassenden Testsperre und deren vollständiges Entfernen wurden ebenfalls auf Atlas geprüft; Testdaten wurden anschließend entfernt.
- **Offen vor Produktion:** Die vorläufigen Tische, Servicezeiten und Reservierungsregeln müssen vom Restaurant bestätigt werden. `FS3` wartet auf Präsentation und Gate-Abnahme; `FS4` wurde nicht begonnen.
- **FS4-Eingangsentscheidung:** Resend ist als externer Dienst für Transaktions-E-Mails bestätigt. Noch offen sind die verifizierte Absenderdomain, die Restaurantempfängeradresse, finale E-Mail-Texte und das ausdrückliche `GO für FS4`.

## 19. FS4-Arbeitspaket – 09.11.2026

- **Freigabe:** Nutzer hat `FS4` ausdrücklich gestartet und Resend bestätigt.
- **Gaststrecke:** Dreisprachiges Reservierungsformular mit Verfügbarkeitsprüfung, Pflichtbestätigung des Datenschutzhinweises, stabiler Idempotenz-ID, Lade-/Fehler-/Erfolgszuständen und telefonischem Fallback integriert.
- **E-Mail:** Resend-Transport, atomare Outbox-Erzeugung, eindeutige Ereignisschlüssel, begrenzte Wiederholungen und getrennte Gast-/Restaurantnachrichten implementiert. Restaurantempfänger vorläufig `mohammad.amiri@dci-student.org`.
- **Datenbasis:** Migration `0007_email-outbox` ergänzt Locale-/Datenschutz-Bestand und den Zustellindex und ist in `colosseo_test` sowie `colosseo` angewendet.
- **Prüfungen:** Typecheck, Lint, 62/62 automatisierte Tests und Production-Build erfolgreich. Öffentliche Config und Verfügbarkeit wurden gegen die laufende API geprüft; Desktop-Formular, Zustände und Fokusstruktur wurden im Browser kontrolliert. Am 09.11.2026 wurde zusätzlich eine reale Gastzustellung über Resend mit Status `Delivered` und genau einem eindeutigen Outbox-Ereignis verifiziert; der erneute Regressionslauf aus Typecheck, Lint, 62/62 Tests und Build war erfolgreich. Der Build enthält nur bekannte Drittanbieterhinweise zu `use client`.
- **Blockade im Testmodus:** Die Restaurantnachricht an die vorläufige DCI-Adresse wird ohne eigene verifizierte Absenderdomain von Resend erwartungsgemäß abgelehnt. Die Outbox speichert den Fehler und begrenzt die Wiederholungen; es wurden keine doppelten Ereignis-IDs gefunden.
- **Offen:** verifizierte Produktionsdomain und Render-Konfiguration, rechtliche Freigabe des Datenschutzhinweises, Aufbewahrungs- und Stornoregel sowie die verbleibenden FS4-Qualitätsprüfungen. `FS5` wurde nicht begonnen.
- **Person B – Mobile/Accessibility-Korrekturen:** Veraltete Uhrzeitauswahl wird bei Änderung von Datum oder Personenzahl vollständig verworfen; parallele Verfügbarkeitsabfragen werden abgebrochen. Fehlende Kontaktangaben markieren E-Mail und Telefon mit `aria-invalid` und verschieben den Fokus auf das erste betroffene Feld. Verfügbarkeitsanzahl und Reservierungsbestätigung besitzen Live-Region beziehungsweise kontrollierten Fokus. Formularfelder bleiben mobil bei mindestens 16 px, interaktive Ziele mindestens 44 px groß; reine Hover-Zustände der produktiven Seite greifen nur bei einem präzisen Zeiger.
- **Person B – Browserprüfung:** Lokaler Gastfluss auf Deutsch bis zur clientseitigen Kontaktvalidierung geprüft; der Fehlerfokus landet auf E-Mail. Nach Datumswechsel verschwinden alte Uhrzeiten und Kontaktdaten. Deutsche, englische und italienische Reservierungsüberschriften sowie das jeweilige `lang`-Attribut sind korrekt. Bei mobilem Viewport entstand kein horizontaler Überlauf; Desktop-Ankernavigation erreicht nach der sanften Scrollstrecke exakt `#action`.
- **Person B – tatsächlich ausgeführte Prüfungen:** Typecheck, OXLint, 62/62 Tests und Production-Build erfolgreich. Der Build meldet weiterhin ausschließlich bekannte Drittanbieterhinweise zu `use client`; `SITE_URL` war beim lokalen Lauf nicht gesetzt. Eine echte iOS-/Android-Hardwareprüfung und eine emulierte Betriebssystemeinstellung für Reduced Motion bleiben offen.
- **Nächster Einstieg Person B:** Auf realem iOS/Android Touch, Bildschirmtastatur und Reduced Motion prüfen; danach Gegenreview durch Person A und FS4-Gate vorbereiten. Resend-Produktionsdomain sowie rechtliche Storno-/Aufbewahrungsentscheidungen bleiben externe Blocker.

## 20. Tagesstart Person B – 10.11.2026

- **Übertrag vom 09.11.:** Reale iOS-/Android-Prüfung einschließlich Bildschirmtastatur sowie Reduced-Motion-Prüfung sind noch offen. Der 09.11. ist deshalb fachlich umgesetzt, aber noch nicht vollständig abgenommen.
- **Aufgabe 1 – REVIEW:** Viewport, Touch-Ziele, 16-px-Eingaben, Hover-Gating, Safe Areas, Scrollverhalten und Reduced-Motion-Fallback statisch geprüft; die öffentliche Seite und Reservierungsstrecke zusätzlich bei 390 px sowie die Gesamtseite bei schmaler Ansicht im Browser kontrolliert. Vier zu kleine Textlink-Ziele wurden mobil auf mindestens 44 × 44 px erweitert. Danach bestanden Typecheck, OXLint, 62/62 Tests und Production-Build; sichtbar war nur der bekannte Drittanbieterhinweis zu `use client`, `SITE_URL` war lokal nicht gesetzt. Kein horizontaler Überlauf und kein sichtbares Bedienelement unter 44 × 44 px bei der erneuten 390-px-Prüfung.
- **Mobile Navigation korrigiert:** Die mobile GSAP-Eingangsanimation verändert das zunächst geschlossene Dropdown nicht mehr inline. Auf größeren Ansichten stehen Speisekarte, Feiern und Kontakt als geometrisch zentrierte Dreiergruppe; Reservieren bleibt rahmenlos separat ganz rechts. Mobil bleiben im geschlossenen Zustand nur Logo und Burger sichtbar; beim Öffnen werden alle vier Links bündig als vollbreite Ebene mit einem 220-ms-Clip-Reveal von oben nach unten eingeblendet. Der separate quadratische Reservierungsbutton samt Icon wurde vollständig entfernt, und eine geöffnete Navigation wird durch die Scroll-Ausblendung nicht versteckt. Bei 320, 390 und 1024 px visuell geprüft; Typecheck, OXLint, 62/62 Tests und Production-Build erneut erfolgreich.
- **Mobile Speisekarten-Reihenfolge korrigiert:** Unterhalb von 900 px steht der aktive Gerichtstext vollständig vor dem zugehörigen Bild. Der Bildbereich besitzt eine eigene feste Zeile und abgeschnittenen Überlauf, sodass auch die Scrollanimation niemals über den Text laufen kann; auf Nutzerwunsch bleibt der Übergang ohne sichtbare Trennlinie. Der Reduced-Motion-Fallback übernimmt dieselbe Reihenfolge. Bei 390 px im Browser visuell und über die tatsächlichen Elementgrenzen geprüft; Text und Bild überlappen nicht. Typecheck, OXLint, 62/62 Tests und Production-Build bestanden anschließend erneut; beim Build erschienen nur die bekannten Hinweise zu `use client` und der lokal nicht gesetzten `SITE_URL`.
- **Mobile Bildgrenze nachjustiert:** Text- und Bildbereich nutzen auf gestapelten Ansichten nun jeweils 50 Prozent der Viewporthöhe. Dadurch verschwindet das scrollende Gerichtbild deutlich näher am Beschreibungstext, bleibt aber weiterhin vollständig auf seinen eigenen, abgeschnittenen Bildbereich begrenzt.
- **Person B – Spam-/Ausfallprüfung abgeschlossen:** Die öffentliche Reservierungs-API wurde automatisiert gegen wiederholte Buchungsversuche und simulierte Datenbank-/Provider-Ausfälle geprüft. Nach zehn Versuchen antwortet sie mit `429`, `Retry-After` und Korrelations-ID; unerwartete Ausfälle liefern eine neutrale `500`-Antwort, ohne interne URI, Passwort oder Provider-Token preiszugeben. Der vollständige Regressionslauf aus Typecheck, OXLint, 64/64 Tests und Production-Build ist erfolgreich; sichtbar blieben nur die bekannten Drittanbieterhinweise zu `use client` und die lokal nicht gesetzte `SITE_URL`.
- **Smartphone-Prüfung bestätigt:** Der Nutzer hat den echten Smartphone-Test am 10.11.2026 als durchgeführt bestätigt. Gerät, Betriebssystem, Browser und einzelne Prüfergebnisse wurden nicht mitgeteilt; diese Bestätigung ersetzt deshalb keinen detaillierten gerätespezifischen Prüfbericht.
- **Produktions-E2E vorbereitet:** Für den gemeinsamen React-/Express-Web-Service wurde eine Render-Blueprint-Konfiguration mit reproduzierbarem Build, idempotenter Migration unmittelbar vor dem Serverstart, Frankfurt-Region und Health Check ergänzt. Der Free-Plan unterstützt laut offizieller Render-Dokumentation keinen separaten Pre-Deploy-Befehl; deshalb ist die Migration bewusst Teil des Startbefehls. Alle Secrets und noch unbestätigten Produktionswerte sind ausschließlich als manuell zu setzende Render-Umgebungsvariablen markiert; es wurde nichts deployed oder übertragen.
- **Person B – Tagesaufgaben abgeschlossen:** Render-Service, Produktions-URL und Umgebungsvariablen sind aktiv. Der technische Produktions-E2E umfasst Health, öffentliche Konfiguration und Verfügbarkeit, Sprach- und Unterseiten einschließlich Reload/Redirect, Canonical, Sitemap, Robots, Adminschutz, sichere Validierungsfehler, Secret-Scan und die gestaltete 404-Oberfläche. Eine echte synthetische Produktionsbuchung wurde wegen realer Daten- und E-Mail-Nebenwirkungen bewusst nicht erzeugt; Buchung, Idempotenz und Parallelität sind automatisiert und gegen Atlas geprüft.
- **Render-Branch synchronisiert:** Der vollständig geprüfte Integrationsstand wurde am 10.11.2026 auf den GitHub-Standardbranch `dev` übertragen. Render kann damit nicht mehr versehentlich den vorherigen Stand des Branches deployen. Die Blueprint-Erstellung wartet nur noch auf die GitHub-App-Berechtigung für das Repository `Neykeb/Colosseo-Restaurant-2`; im aktuell verbundenen Render-GitHub-Konto ist ausschließlich ein anderes Repository sichtbar.
- **Render-Erstdeployment:** Repository, `dev`-Branch und Blueprint wurden verbunden; Render vergab `https://ristorante-colosseo.onrender.com`. Der erste Build scheiterte reproduzierbar mit `vite: not found`, weil `NODE_ENV=production` bei `npm ci` die für Build und TypeScript-Serverstart benötigten Dev-Abhängigkeiten ausließ. Der Blueprint installiert diese Werkzeuge deshalb ausdrücklich mit `npm ci --include=dev`; es wurden keine Secrets in Git übernommen.
- **Render live:** Das korrigierte Blueprint-Deployment von Commit `89d342f` ist erfolgreich und der gemeinsame React-/Express-Service unter `https://ristorante-colosseo.onrender.com` erreichbar. `/api/health`, `/`, `/de`, `/en`, `/it` und `/admin` antworteten im Produktions-Smoketest jeweils erfolgreich mit HTTP `200`. Der Free-Service kann nach Inaktivität einschlafen und beim ersten Aufruf deshalb deutlich verzögert reagieren.
- **Mobile Navigation nach Live-Prüfung:** Die mobile Menüebene wurde aus ihrer fragilen Fixed-/Transform-Verschachtelung gelöst, mit eindeutigem Layer, vollständiger Breite, Sichtbarkeitszustand und Fokusgrenzen abgesichert. Öffnen und Schließen verwenden eine unterbrechbare 280-ms-Transition mit sanftem Anlauf und Abbremsen; Reduced Motion entfernt die Positionsbewegung und verkürzt die Überblendung.
- **Mobiles Datumsfeld korrigiert:** Das native Datumsfeld besitzt nun eine begrenzte, Safari-stabile Breite, ein sichtbares lokalisiertes Format, ein einheitliches Kalender-Symbol und eine vollständig antippbare native Auswahlfläche. Dadurch läuft das Feld auf schmalen iPhones nicht mehr aus dem Reservierungsformular und bleibt in anderen Browsern funktional.
- **Mobile Feiern-Section korrigiert:** Die weiterhin exakt `100svh` hohe Section reserviert mobil ausreichend Raum für Überschrift, Beschreibung und CTA. Eine kleinere responsive Überschrift, kompaktere Abstände und eine 65/35-Aufteilung verhindern, dass „Feier anfragen“ abgeschnitten oder vom anschließend beginnenden Foto überdeckt wird.
- **Produktions-404 gehärtet:** Unbekannte HTML-Routen zeigen weiterhin die gestaltete TanStack-404-Oberfläche, antworten serverseitig aber nun korrekt mit HTTP `404`. Client-only-Routen wie `/admin` bleiben mit und ohne abschließenden Slash erreichbar; ein eigener Listener-Test verhindert Regressionen.
- **Tagesabschluss Person B:** Alle für den 10.11. technisch ausführbaren Person-B-Aufgaben sind erledigt und dokumentiert. Offen bleiben ausschließlich der unabhängige Gegenreview durch Person A, die fachlich/rechtliche Freigabe von Datenschutz-, Aufbewahrungs- und Stornoregeln, eine verifizierte Resend-Absenderdomain sowie die ausdrückliche Gate-Abnahme. Diese Punkte benötigen andere Verantwortliche beziehungsweise eine Nutzerentscheidung und werden nicht fälschlich als erledigt markiert.

## 21. Integrationsstand Person A – 11.11.2026

- Der Merge von `origin/dev` in `feature/szymon` wurde Datei für Datei aufgelöst. Der geprüfte Produktionsstand aus `dev` bleibt die technische Grundlage.
- Person As Reservierungsverwaltungs- und Veranstaltungsanfrage-Code wurde auf die aktuelle `ReservationAdminService`-/Express-Architektur übertragen; veraltete parallele Servicevarianten wurden nicht über den Produktionsstand gelegt.
- Migration `0010_event_inquiries`, Event-Inquiry-Modell und geschützte Admin-Endpunkte sind integriert. Diese Integration ist noch keine Gate-Abnahme von `FS5`; der dokumentierte Phasenstatus bleibt unverändert.
- **Verifiziert:** keine Konfliktmarker oder unaufgelösten Git-Konflikte; Typecheck, Lint, alle 76 Tests und Production-Build erfolgreich. Die Build-Hinweise zu externen `use client`-Direktiven sind unveränderte, nicht blockierende Bundler-Warnungen.
- **FS4-Gegenreview:** Person A hat Reservierungsgrenze, Adminschutz, Outbox-Idempotenz, Wiederholungslogik, Secret-Trennung, Storno-Sperre und Aufbewahrungsskript geprüft. `npm audit --omit=dev` meldet keine bekannten Schwachstellen; Secret-Tracking-Prüfung, Typecheck, OXLint, 76/76 Tests und Production-Build sind erfolgreich.
- **Vorbereitete Entscheidung:** Der technische Fachentwurf schlägt eine tokenbasierte Online-Stornierung bis zwei Stunden vorher sowie 90/180/30/365 Tage für Anonymisierung beziehungsweise Löschung vor. Das ist ausdrücklich keine Rechtsfreigabe. Ohne Restaurant-/Rechtsfreigabe bleiben öffentlicher Storno und automatische Produktionslöschung deaktiviert.
- **Nur für einen späteren Produktionsbetrieb offen:** eigene verifizierte Resend-Absenderdomain, verbindliche Datenschutz- und Anbieterangaben sowie Regeln für reale Veranstaltungsanfragen. Für den aktuellen Demo-Umfang bleibt nur die ausdrückliche Gate-Abnahme `FS4` offen.
- **Umfangsentscheidung:** Der Nutzer hat am 11.11.2026 bestätigt, dass die Anwendung ausschließlich ein nicht-produktives Weiterbildungs-/Demoprojekt ist. Eigene Resend-Domain und rechtliche Produktionsprüfung blockieren die Demo-Abnahme daher nicht mehr. Es dürfen weiterhin keine echten Gastdaten verwendet oder beliebige reale Empfänger über den Testabsender angeschrieben werden.
- **Atlas-/Migrationprüfung:** Der zuvor gemeldete `querySrv ECONNREFUSED` ist am 11.11.2026 nicht mehr reproduzierbar; die SRV-Abfrage liefert alle drei Atlas-Knoten. Anschließend wurden zwei echte Fehler in Migration `0010` behoben: eine ungültige ID-Schreibweise und ein nicht idempotenter Indexaufbau bei bereits gleichwertigem Mongoose-Index. `0010_event-inquiries` ist nun in Atlas angewendet und der Statuslauf meldet alle Migrationen `0001` bis `0010` als `applied`. Typecheck, OXLint, 76/76 Tests und Production-Build sind danach erfolgreich.
- **Externe Blocker:** Verifizierte Resend-Produktionsdomain sowie fachlich/rechtlich freigegebene Datenschutz-, Aufbewahrungs- und Stornoregeln.
- **Phasengrenze:** `FS5` beginnt erst nach abgeschlossener FS4-Präsentation, ausdrücklicher Gate-Abnahme und neuem `GO`.
- **Branch-Integration:** Die Konflikte zwischen `feature/momo` und `dev` wurden vollständig aufgelöst. Die getestete öffentliche Website, mobile Navigation, Reservierungsstrecke und bestehende Admin-Autorisierung blieben maßgeblich; ergänzende Storno-, Aufbewahrungs-, Outbox- und Migrationsbausteine aus `dev` wurden kompatibel übernommen. `dist/` bleibt generiert und unversioniert. Typecheck, OXLint, 76/76 Tests und Production-Build waren anschließend erfolgreich; der Build meldete nur die bekannten Drittanbieterhinweise zu `use client` und die lokal nicht gesetzte `SITE_URL`.

## 22. FS4-Abnahme – 11.11.2026

- **Gate:** Der Nutzer hat die präsentierte FS4-Gaststrecke mit ausdrücklichem `GO FS4` abgenommen.
- **Status:** FS4 ist abgenommen. FS5 darf erst nach einem separaten ausdrücklichen `GO FS5` begonnen werden.
- **Person A nächster zulässiger Schritt:** FS5-Arbeitsumfang und Zuständigkeiten vorbereiten; keine FS5-Implementierung ohne neues Gate beginnen.

## 23. FS5-Freigabe – 11.11.2026

- **Gate:** Der Nutzer erteilt ausdrücklich `GO FS5`.
- **Status:** FS5 ist freigegeben; die Umsetzung darf beginnen.
- **Person A nächster Schritt:** FS5-Backend-Regression für Reservierungsverwaltung und Veranstaltungsanfragen gegen den aktuellen Integrationsstand prüfen und den ersten offenen API-/Datenbankpunkt bearbeiten.

## 24. FS5-Backend-Regression – 11.11.2026

- **Dependency-Prüfung:** `resend` war in `package.json` und `package-lock.json` deklarierter, lokal aber fehlender Bestandteil. `npm ci --include=dev --ignore-scripts` stellte die Lockfile-Installation wieder her.
- **Ergebnisse:** Typecheck, Lint und Production-Build erfolgreich; der direkte Vitest-Lauf ergab 65/76 erfolgreiche Tests. Die 11 HTTP-Tests scheiterten ausschließlich an der Sandbox-Blockade `listen EPERM` für lokale Listener.
- **Atlas:** `npm run db:migrate:status` erneut versucht; DNS-SRV-Auflösung zu Atlas scheitert weiterhin mit `querySrv ECONNREFUSED`. Es wurde keine Datenbankänderung durchgeführt.
- **Nächster Einstieg:** HTTP-Regression und Atlas-Migrationsstatus in einer Umgebung mit lokalem Listener und erreichbarem Atlas-DNS wiederholen; danach FS5-Daten-/API-Regression fortsetzen.

## 25. FS5-Regression nach Umgebungsfreigabe – 11.11.2026

- **Verifiziert:** HTTP-Regression mit lokalem Listener erfolgreich; 12/12 HTTP-Tests bestanden.
- **Verifiziert:** vollständiger `npm test` erfolgreich; 16 Testdateien und 76/76 Tests bestanden, einschließlich Secret-Tracking-Prüfung.
- **Atlas:** `npm run db:migrate:status` erfolgreich; Migrationen `0001` bis `0010` stehen auf `applied`.
- **Ergebnis:** Die bisherigen Sandbox-Blockaden sind für diese Prüfung überwunden. Es wurde keine neue Migration ausgeführt und keine Datenbankstruktur verändert.
- **Nächster Einstieg:** FS5-Funktionsarbeit fortsetzen; als Person A folgt die fachliche API-/Datenprüfung der operativen Verwaltung und Veranstaltungsanfragen.

## 26. FS5-Fachprüfung Veranstaltungsanfragen – 11.11.2026

- **Befund:** Die aktuelle `ReservationAdminService`-Variante validierte bisher nur das Statusformat, nicht die fachlich erlaubten Übergänge.
- **Korrektur:** Statusübergänge für Veranstaltungsanfragen sind jetzt atomar gegen den erwarteten Ausgangsstatus abgesichert; ungültige Übergänge und parallele Änderungen werden abgelehnt. Audit-Ereignisse entstehen nur nach erfolgreicher Änderung.
- **Erledigt:** Statusübergangsmatrix als datenbankunabhängige Domainfunktion zentralisiert und mit 4 dedizierten Unit-Tests abgesichert. Die drei Entwicklungsbeispiele wurden anschließend gegen Atlas geprüft.

## 27. FS5-Atlas-Prüfung Veranstaltungsanfragen – 11.11.2026

- **Seed:** Development-Seed um drei idempotente, ausschließlich synthetische `PLATZHALTER` ergänzt: Privates Dinner (24, `new`), Firmenfeier (35, `in_review`) und Geburtstag (12, `new`).
- **Atlas-Verifizierung:** Development-Seed erfolgreich ausgeführt; read-only Abfrage bestätigt genau 3 Datensätze mit den erwarteten Typen, Personenzahlen und Statuswerten.
- **Offen:** öffentliche Anfrage-/Admin-UI-Integration und dedizierte Service-Unit-Tests für die Statusübergangsmatrix.

## 28. FS5-Berechtigungs- und API-Regression – 11.11.2026

- **Ergänzt:** API-Test für geschützte Veranstaltungsanfragen, Pflichtfeldvalidierung, Anlegen und Statusänderung.
- **Prüfungen:** vollständiger `npm test` erfolgreich; 17 Testdateien und 81/81 Tests bestanden, inklusive Secret-Tracking.
- **Ergebnis:** FS5-Backend-Berechtigungs- und Validierungsabdeckung ist erweitert. Frontend-Admin-UI, Tastaturprüfung und E2E bleiben offen.

## 29. FS5-Abnahme – 11.11.2026

- **Gate:** Der Nutzer hat die operative Verwaltung mit ausdrücklichem `GO FS5` abgenommen.
- **Status:** FS5 ist abgenommen. FS6 darf erst nach einem separaten ausdrücklichen `GO FS6` begonnen werden.
- **Nächster zulässiger Schritt:** FS6-Arbeitsumfang und Zuständigkeiten vorbereiten; keine FS6-Implementierung ohne neues Gate.

## 30. FS6-Freigabe – 11.11.2026

- **Gate:** Der Nutzer erteilt ausdrücklich `GO FS6`.
- **Status:** FS6 ist freigegeben; die Umsetzung darf beginnen.
- **Person A nächster Schritt:** Backend-Verträge und Datenmodell für Speisekarte, Öffnungszeiten, Medienverwaltung sowie Entwurf/Vorschau/Veröffentlichen prüfen.
- **Person B nächster Schritt:** Admin-Oberflächen und öffentliche Synchronisation vorbereiten.

## 31. FS6-Menü-Backend-Grundlage – 11.11.2026

- **Umgesetzt:** versionierte Migration `0011_menu-content`, `MenuCategory`-/`MenuItem`-Modelle und geschützte Admin-API für Kategorien und Gerichte ergänzt.
- **Datenregeln:** Preise werden als Centwerte gespeichert; Allergene, Sortierung, Aktivstatus und Publikationsstatus sind serverseitig validiert. Bild-URLs sind nur als optionale Referenz vorgesehen; Uploadregeln sind noch offen.
- **Migration:** `0011_menu-content` erfolgreich in Atlas angewendet; Migrationen `0001` bis `0011` stehen auf `applied`. Ein bereits vorhandener gleichwertiger Index wurde idempotent berücksichtigt.
- **Prüfungen:** Typecheck, Lint und 81/81 Tests erfolgreich.
- **Offen:** Öffnungszeiten-/Veröffentlichungslogik, Bild-Upload, öffentliche Synchronisation, Admin-UI und E2E-/Accessibility-Prüfung.

## 32. FS6-Öffentliche Menüausgabe – 11.11.2026

- **Umgesetzt:** `GET /api/public/menu` liefert ausschließlich aktive Kategorien und aktive, veröffentlichte Gerichte; interne IDs und Zeitstempel werden nicht ausgegeben. Sortierung und Kategoriezuordnung sind deterministisch.
- **Offen:** Admin-UI, Bild-Upload mit Rechte-/Typ-/Größenprüfung, Vorschau-/Veröffentlichungsworkflow und E2E-/Accessibility-Prüfung.

## 33. FS6-Öffentliche Öffnungszeiten – 11.11.2026

- **Umgesetzt:** `GET /api/public/opening-hours` liefert reguläre aktive Servicezeiten und datierte Sondertage mit geschlossen-/geöffnet-Status. Interne IDs und Zeitstempel werden nicht ausgegeben.
- **Offen:** vollständige Admin-Pflege, Veröffentlichungs-/Vorschauworkflow, Bild-Upload, UI und E2E-/Accessibility-Prüfung.

## 34. FS6-Menüvorschau – 11.11.2026

- **Umgesetzt:** geschützter Endpunkt `GET /api/admin/menu/preview` ergänzt. Er zeigt aktive Entwurfs- und Veröffentlichungsdaten einschließlich `published`-Status; die öffentliche Route bleibt auf veröffentlichte Gerichte begrenzt.
- **Offen:** expliziter Veröffentlichungsworkflow, Bild-Upload, Admin-UI und E2E-/Accessibility-Prüfung.

## 35. FS6-Veröffentlichungsworkflow – 11.11.2026

- **Umgesetzt:** `PATCH /api/admin/menu/items/:itemId/publication` veröffentlicht oder entzieht die Veröffentlichung eines aktiven Gerichts. Beide Aktionen werden auditiert; nicht aktive oder unbekannte Gerichte werden abgelehnt.
- **Offen:** Bild-Upload, vollständige Admin-UI und E2E-/Accessibility-Prüfung.

## 36. FS6-GridFS-Medienablage – 11.11.2026

- **Umgesetzt:** MongoDB GridFS mit Bucket `media`, geschütztem JSON-Upload `POST /api/admin/media` und öffentlichem Abruf `GET /api/public/media/:id` ergänzt.
- **Validierung:** erlaubte Typen JPEG/PNG/WebP, maximale Größe 5 MB, verpflichtender Alternativtext und bereinigter Dateiname. Der Upload bleibt admin-geschützt; Dateien erhalten unveränderliche Cache-Header.
- **Migration:** `0012_gridfs-media` erfolgreich in Atlas angewendet; Migrationen `0001` bis `0012` stehen auf `applied`.
- **Offen:** tatsächliche Dateisignaturprüfung, Rechte-/Löschworkflow, Admin-UI und E2E-/Accessibility-Prüfung.

## 37. FS6-Dateisignaturprüfung – 11.11.2026

- **Umgesetzt:** JPEG-, PNG- und WebP-Dateien werden zusätzlich zum MIME-Typ anhand ihrer Binärsignatur geprüft. Falsch deklarierte oder beschädigte Uploads werden mit `MEDIA_SIGNATURE_INVALID` abgelehnt.
- **Offen:** Rechte-/Löschworkflow, Admin-UI und E2E-/Accessibility-Prüfung.

## 38. FS6-Medien-Rechte und Löschung – 11.11.2026

- **Umgesetzt:** `DELETE /api/admin/media/:id` ergänzt. Medienlöschung ist ownergeschützt, entfernt GridFS-Datei und Chunks und erzeugt ein `media.deleted`-Audit-Ereignis.
- **Offen:** Admin-UI und E2E-/Accessibility-Prüfung.

## 39. FS6-Abschlussprüfung Person A – 11.11.2026

- **Voraussetzung:** Die Admin-UI wird auf Nutzerangabe als erledigt übernommen; eine erneute UI-Implementierung wurde übersprungen.
- **Prüfungen:** `npm test` erfolgreich mit 17 Testdateien und 81/81 Tests; Secret-Tracking erfolgreich. `npm run build` erfolgreich; verbleiben nur bekannte Drittanbieterhinweise zu `use client` und die lokal nicht gesetzte `SITE_URL`. `npm audit --omit=dev` meldet 0 bekannte Schwachstellen.
- **Atlas:** Migrationen `0001` bis `0012` stehen auf `applied`.
- **Offen:** dokumentierter visueller/E2E-Nachweis der FS6-UI, sofern dieser nicht bereits separat durch Person B vorliegt; danach FS6-Präsentation und Gate-Vorbereitung.

## 40. Person-A-Medienvalidierung – 12.11.2026

- **Umgesetzt:** dedizierte Unit-Tests für GridFS-MIME-Prüfung, Alternativtextpflicht, Binärsignatur und 5-MB-Grenze ergänzt.
- **Prüfungen:** `npm run typecheck`, `npm run lint` und `npm test` erfolgreich; 18 Testdateien und 85/85 Tests bestanden.
- **Abgrenzung:** Person-B-/UI-Aufgaben wurden bewusst nicht bearbeitet.

## 41. FS6-Person-B-Integration – 12.11.2026

- **Zuständigkeit:** Person B hat die responsive Adminoberfläche für Kategorien, Gerichte, Preise, Beschreibungen, Allergene, Sortierung, Aktivstatus, Vorschau, Veröffentlichung, Bildauswahl und bestätigte Löschung vorbereitet. Es wurden keine Speisekartendaten erfunden.
- **Accessibility:** Bildauswahl und Alternativtext sind sichtbar formulargebunden. Pflichtfeldfehler werden markiert, erklärt und fokussiert; wiederholte Veröffentlichungsaktionen nennen das betroffene Gericht. Der Vorschau-Dialog restauriert den Fokus bei jeder Schließart.
- **Responsive und Motion:** Bei 320 px beziehungsweise 200-%-Zoom stapeln sich Listeneinträge und Aktionen ohne horizontale Zwangsbedienung. Dialogbewegung läuft nur ohne aktivierte reduzierte Bewegung.
- **API-Prüfung:** Person As Menü-/Medien-API ist integriert. `imageUrl` akzeptiert gezielt interne GridFS-URLs (`/api/public/media/<ObjectId>`) sowie absolute HTTPS-URLs; beliebige relative Pfade und unverschlüsselte externe URLs werden abgelehnt.

## 42. FS6-URL-Vertrag und Medienfluss – 12.11.2026

- **Integrationstest:** Upload → Gericht speichern → Gericht veröffentlichen einschließlich Ablehnung eines beliebigen relativen Pfads ist automatisiert abgesichert.
- **Prüfungen Person A:** Typecheck, Lint und 86/86 Tests erfolgreich.
- **Person-B-Regression:** Der zusammengeführte Stand besteht erneut Typecheck, OXLint, 86/86 Tests, Production-Build und `git diff --check`. Der lokale Express-Server startet auf Port `3000`; die Adminoberfläche erreicht die Google-Anmeldung.
- **Manueller Browser-E2E:** Authentifizierter Bild-Upload, Speichern mit internem Medienpfad, Entwurfsvorschau, Veröffentlichung, öffentlicher Menüabruf, öffentlicher Bildabruf mit unveränderlichem Cache-Header und Zurückziehen wurden erfolgreich geprüft.
- **Bereinigung verifiziert:** Die synthetische Kategorie `e2e-test`, das Testgericht und das GridFS-Testmedium wurden durch Person A entfernt. Eine read-only Atlas-Abfrage bestätigt, dass alle drei Datensätze nicht mehr existieren.
