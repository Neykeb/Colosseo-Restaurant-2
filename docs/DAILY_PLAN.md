# Tagesplan Full-Stack-Finalprojekt

**Status:** Verdichteter Arbeitsentwurf für zwei Personen; Gates und fachliche Eingangsdaten bleiben verbindliche Voraussetzungen

**Phase:** `FS1` freigegeben und in Arbeit

**Planungszeitraum:** 02.11.2026–13.11.2026

**Letzte Aktualisierung:** 05.11.2026

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
- **Aktueller Stand:** Person A hat bestätigt, dass die Clerk-Änderungen auf `dev` gepusht wurden. Der Nutzer bestätigt außerdem, dass die Owner-Clerk-User-ID bereits vorliegt.
- **Nächster Einstieg:** Clerk-Änderungen, Secret-Trennung und vorhandene Owner-ID prüfen; anschließend nur fehlende Sessionprüfung, eigenes Adminprofil und geschütztes Admin-Grundlayout ergänzen.

## 14. Sicherheitsbereinigung – 05.11.2026

- **Befund:** Der Team-Push hatte `.env` und `.env.test` trotz vorhandener Ignore-Regeln erneut als bereits getrackte Dateien in mehrere Branch-Historien aufgenommen.
- **Bereinigung:** Beide Dateien wurden aus der gesamten erreichbaren Historie der Branches `dev`, `feature/momo` und `feature/szymon` entfernt; die bereinigten Branches wurden kontrolliert force-gepusht und lokal neu ausgerichtet. `.env.example` bleibt die einzige versionierte Env-Vorlage.
- **Prävention:** `npm test` führt nun zuerst `check:tracked-env` aus und bricht ab, falls `.env` oder eine private `.env.*`-Datei erneut getrackt wird.
- **Extern erforderlich:** Das veröffentlichte MongoDB-Passwort wird vom Nutzer rotiert. Da GitHub alte Commit-Ansichten und Pull-Request-Refs zwischenspeichern kann, ist die Rotation unabhängig von der Historienbereinigung zwingend.

## 15. FS2-Arbeit – 06.11.2026

- **Umgesetzt:** `/admin` ruft nach erfolgreicher Clerk-Anmeldung `/api/admin/me` mit dem Clerk-Sessiontoken auf und unterscheidet Lade-, verweigerten, technischen und erfolgreichen Zustand.
- **Umgesetzt:** Vite-Development-Proxy für `/api` auf den lokalen Express-Port ergänzt; `.env.example` dokumentiert die benötigten Clerk-Variablen ohne echte Werte.
- **Prüfungen:** Typecheck und Lint erfolgreich; Production-Build erfolgreich. Vitest: 29/32 Tests bestanden; drei Listener-Integrationstests wurden durch die Sandbox-Beschränkung `listen EPERM` blockiert.
- **Offen:** echter signierter Clerk-Request mit laufendem Backend, Browserprüfung des Google-OAuth-Flows, Owner-Profil-Bootstrap gegen die Testdatenbank sowie Accessibility-/Security-Abnahme.
- **Nachprüfung:** Google-OAuth und ein signierter Request wurden im Browser erreicht; der Ownerzugriff war zunächst wegen einer nicht passenden `CLERK_AUTHORIZED_PARTIES`-Origin blockiert. Die lokalen Origins für Ports 5173/5174 mit `localhost` und `127.0.0.1` sind jetzt ergänzt und der Express-Server neu gestartet. Die abschließende Owner-Ansicht muss nach einem Browser-Reload erneut bestätigt werden.

## 16. FS3-Start – 06.11.2026

- **Freigabe:** `GO für FS3` wurde vom Nutzer erteilt.
- **Umgesetzt:** Pure Domainlogik für `HH:mm`-Zeitfenster, gültige Servicefenster, Überschneidungen und explizite Reservierungs-Statusübergänge ergänzt.
- **Tests:** Typecheck, Lint und vier neue Domain-Unit-Tests erfolgreich.
- **Offen:** reale Tisch-/Bereichsdaten, Servicezeiten, Dauer/Buffer, Vorlauf, Buchungshorizont, Gruppengrenzen, Sperr- und Bestätigungsregeln müssen vor API- und Concurrency-Implementierung fachlich bestätigt werden.
- **Freigegebene Entwicklungsannahme:** Der Nutzer hat synthetische FS3-Daten erlaubt. Der Development-Seed wurde gegen die Entwicklungsdatenbank ausgeführt und enthält ausschließlich markierte `PLATZHALTER`-Daten; reale Produktionsregeln bleiben offen.
