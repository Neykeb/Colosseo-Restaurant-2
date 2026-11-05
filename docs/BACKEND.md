# Backend-Cockpit

**Status:** Full-Stack-Phase `FS1` in Arbeit; Atlas-Verbindung und versionierter Migrationsrahmen verifiziert

**Phase:** `FS1` – Plattformgrundlage und reproduzierbare Datenbank

**Letzte Aktualisierung:** 05.11.2026

Diese Datei ist der schnelle Einstieg in die Backend-Arbeit. Sie fasst keine vollständige Spezifikation doppelt zusammen, sondern zeigt, **wo** eine Entscheidung verbindlich dokumentiert ist und **was als Nächstes** zu tun ist.

## 1. Aktueller Stand in 30 Sekunden

- Die bestehende öffentliche React-/TypeScript-Website bleibt erhalten.
- Die erste Backend-Grundlage ist implementiert: validierte Serverumgebung, getrennte Express-App und Serverstart, Healthcheck, Korrelations-ID, Fehlerformat, Mongoose-Verbindung und erfolgreicher Atlas-Verbindungstest.
- Der versionierte MongoDB-Migrationsrahmen ist implementiert: geordnete Registry, Historie, Ausführungssperre, Status, Vorwärtslauf, einzelner Rollback und Unit-Tests. Konkrete Schema-/Indexmigrationen folgen mit den bestätigten Modellen.
- Zielstack: React, TypeScript, Vite und TanStack Router im Frontend; Node.js, Express und TypeScript im Backend; MongoDB mit Mongoose, Clerk für OAuth und Sessions, Resend für E-Mails sowie Render für das Finalprojekt.
- TanStack Router ist im Quellcode implementiert; Sprachrouten, direkte Reloads, gestalteter 404-Zustand, Lazy Loading, Netlify-Publish-Pfad und Build-Prerendering für 15 lokalisierte Routen sind lokal verifiziert. Die verknüpfte Netlify-Produktionsbasis `https://ristorante-colosseo-winsen.netlify.app` ist als `SITE_URL` gesetzt; Canonical, Hreflang, Sitemap und `robots.txt` wurden damit im lokalen Production-Build erfolgreich geprüft. Die Regression nach einem echten Netlify-Deployment bleibt offen.
- Der Atlas-Benutzer besitzt am 03.11.2026 verifiziert ausschließlich datenbankspezifisches `readWrite` für `colosseo` und `colosseo_test`. Entwicklungsverbindung, Testverbindung und Test-Migrationslauf sind damit erfolgreich.
- Vom Nutzer bestätigter Atlas-Betriebsstand: MongoDB `8.0.36`, AWS Frankfurt (`eu-central-1`), Replica Set mit drei Nodes, Backups derzeit inaktiv, keine verknüpften App Services und ein vorhandener Search-Index. Render soll später möglichst regionsnah betrieben werden; Backups bleiben vor einem realen Produktionsbetrieb zu klären.
- Clerk authentifiziert Admins. Die eigene Express-/MongoDB-Logik entscheidet zusätzlich, ob ein Konto als `owner` oder `staff` zugelassen ist.
- Aktuelle Phase: `FS1`. MongoDB Atlas ohne zusätzliche lokale Docker-Datenbank und `GO für FS1` wurden am 02.11.2026 bestätigt.
- Person A hat am 03.11.2026 die Express-/TypeScript-Grundlage implementiert. Die statische Produktionsauslieferung über Express und ein echter Listener-Smoke-Test bleiben offen.
- Person A hat am 04.11.2026 vorläufige Kernmodelle, eine typisierte Reservation-Repository-/Service-Grenze, die erste Core-Indexmigration und einen künstlichen Development-Seed ergänzt. Reale Reservierungsregeln und produktive Geschäftsdaten sind nicht festgeschrieben.
- Person A hat am 05.11.2026 die Clerk-Express-Middleware, `admin_profiles`, das Adminprofil-Repository sowie serverseitige `owner`-/`staff`-Autorisierung mit 401-/403-Tests ergänzt. Clerk bleibt Quelle der Identität; MongoDB bleibt Quelle der fachlichen Adminberechtigung.

## 2. Wo finde ich was?

| Frage | Verbindliche Quelle |
|---|---|
| Was soll das Backend können? | `docs/SPEC.md`, Abschnitte 20–29 |
| Welche Architektur, Datenobjekte, APIs und Sicherheitsregeln sind geplant? | `docs/SPEC.md`, Abschnitte 21–28 |
| In welcher Phase sind wir und was ist erledigt? | `docs/TASKS.md`, „Full-Stack-Erweiterung – Gate-basierte Roadmap“ |
| Was muss vor der nächsten Phase entschieden werden? | `docs/TASKS.md`, jeweiliger Abschnitt „Benötigt vor Start“ und offene Entscheidungen |
| Wer arbeitet heute woran? | `docs/DAILY_PLAN.md` |
| Welche dauerhaften Arbeitsregeln gelten? | `AGENTS.md` |
| Welche Texte und Geschäftsdaten sind bestätigt? | `docs/CONTENT.md` |
| Welche Frontend-Gestaltung bleibt erhalten? | `docs/DESIGN_SYSTEM.md` |
| Was wurde am bestehenden Projekt technisch festgestellt? | `docs/AUDIT.md`, technischer Full-Stack-Bestandsaudit |

## 3. Geplanter Systemfluss

```text
Gast / Admin
     |
React-Frontend
     |
Express-API (Validierung, Rechte, Geschäftslogik)
     |---------------- Clerk (Admin-Identität und Session)
     |---------------- Resend (Transaktions-E-Mails über Outbox)
     |
Mongoose
     |
MongoDB

Render: geplanter Betrieb von Express und öffentlichem Build im Finalprojekt
```

Wichtig: Die öffentliche Verfügbarkeitsanzeige ist keine Buchungsgarantie. Nur der erfolgreiche, atomare Abschluss im Backend bestätigt eine Reservierung. Die vollständige Regel steht in `docs/SPEC.md`.

## 4. Geplante Backend-Bereiche

| Bereich | Verantwortung | Geplante Phase |
|---|---|---|
| Plattform | Express, Konfiguration, Healthcheck, Fehlerformat, MongoDB-Verbindung | `FS1` |
| Datenbasis | Mongoose-Modelle, Indizes, Migrationen und künstliche Entwicklungsdaten | `FS1` |
| Adminzugang | Clerk OAuth, Sessionprüfung, eigene Rollen und geschütztes `/admin` | `FS2` |
| Reservierung | Verfügbarkeit, Tischzuweisung, Status und Parallelitätsschutz | `FS3` |
| Gaststrecke | Reservierungsformular, Bestätigung und E-Mail-Outbox | `FS4` |
| Betrieb | Kalender, Reservierungen, Sperrzeiten und Anfragen | `FS5` |
| Inhalte | Speisekarte, Öffnungszeiten, Bilder und Veröffentlichung | `FS6` |
| Absicherung | Datenschutz, Security, Backups, vollständige QA | `FS7` |
| Livegang | Render, MongoDB-Betrieb, Domain, Monitoring und Rollback | `FS8` |

Die vollständigen Aufgaben und Gates stehen ausschließlich in `docs/TASKS.md`.

## 5. Vorgesehene Code-Struktur

Die konkrete Struktur wird erst in `FS1` angelegt. Maßgeblich ist dann die in `docs/SPEC.md` definierte Architektur. Als Orientierung sind folgende Verantwortungsgrenzen vorgesehen:

- `server/src/config`: geprüfte Umgebungsvariablen und Infrastrukturkonfiguration
- `server/src/database/migrations`: Migrationsvertrag, Registry, Runner und MongoDB-Historie/-Sperre
- `database/migrations`: zukünftige konkrete, versionierte Schema-, Index- und Datenmigrationen
- `server/src/routes` und `server/src/middleware`: Express-Routen, Middleware und Fehlerantworten
- `server/src/modules`: fachliche Module wie Reservierungen, Speisekarte und Öffnungszeiten
- `server/src/models`: Mongoose-Schemas und Modelle
- `server/src/repositories`: gekapselter Datenzugriff
- `server/src/services`: Geschäftsabläufe und externe Dienste
- `server/src/jobs`: Outbox- und Wartungsaufgaben
- `tests`: Unit-, Integrations-, API- und Parallelitätstests

Noch nicht existierende Pfade sind Planung und dürfen nicht als bereits implementiert verstanden werden. Neue Migrationen erhalten aufsteigende IDs wie `0001_create-settings-indexes`, werden nach der ersten Ausführung nicht verändert und explizit in der Registry eingetragen.

### Datenbankbefehle

- `npm run db:check`: Entwicklungsverbindung prüfen
- `npm run db:migrate:status`: registrierte und angewendete Migrationen anzeigen
- `npm run db:migrate`: ausstehende Migrationen anwenden
- `npm run db:migrate:down`: nur die zuletzt angewendete Migration zurücknehmen, sofern sie eine `down`-Operation besitzt
- `npm run db:check:test`: getrennte Atlas-Testdatenbank prüfen; benötigt `.env.test`
- `npm run db:migrate:test`: Migrationen ausschließlich gegen die geschützte `_test`-Datenbank ausführen

## 6. Verbindliche Backend-Grundsätze

Die ausführlichen Regeln stehen in `AGENTS.md` und `docs/SPEC.md`. Für den schnellen Einstieg gelten besonders:

- Eingaben immer serverseitig validieren.
- Eine gültige Clerk-Anmeldung allein gewährt keinen Adminzugriff.
- Rollen und fachliche Berechtigungen werden im eigenen Backend geprüft.
- Secrets gehören ausschließlich in serverseitige Umgebungsvariablen.
- MongoDB-Strukturänderungen erfolgen über versionierte Migrationsskripte.
- Reservierungsentscheidungen müssen atomar und gegen parallele Anfragen abgesichert sein.
- E-Mail-Versand darf eine erfolgreiche Kerntransaktion nicht unkontrolliert zurückrollen oder doppelt ausgeführt werden.
- Personenbezogene Daten werden nur mit dokumentiertem Zweck und festgelegter Aufbewahrung verarbeitet.
- Nach jeder Phase folgen Dokumentation, Tests, Ergebnisbericht und ein neues `GO`.

## 7. Aktuelle Entscheidungen und offene Punkte

### Bestätigt

- Frontend-Routing im Zielsystem: TanStack Router
- Backend: Node.js, Express und TypeScript
- Datenzugriff: MongoDB mit Mongoose
- Admin-Anmeldung: Clerk OAuth
- E-Mail-Service: Resend
- Hosting: Render, zunächst für das Finalprojekt

### In `FS1` noch offen

- Express-Grundgerüst, Kernmodelle, konkrete Indexmigrationen und typisierte Repositories umsetzen
- Konkrete Schema-/Indexmigrationen ergänzen, sobald die zugehörigen Modelle in `FS1` festgelegt sind
- Ein ausdrücklich freigegebenes Netlify-Deployment ausführen und anschließend Canonical, Hreflang, Sitemap, Reloads und Sprachrouten auf der Live-Site regressionsprüfen

### Vor späteren Phasen offen

- Backup-Strategie beziehungsweise passender Atlas-Tarif vor einem realen Produktionsbetrieb
- Clerk-Anwendung, OAuth-Anbieter und erste Owner-Identität
- Rollenmatrix für `owner` und `staff`
- reale Tische, Bereiche, Kombinations- und Reservierungsregeln
- Datenschutz-, Aufbewahrungs-, Storno- und No-show-Regeln
- E-Mail-Absenderdomain und Restaurantempfänger
- Bildspeicher für Speisekartenmedien

Die vollständige nummerierte Liste wird nur in `docs/TASKS.md` gepflegt.

## 8. Nächster zulässiger Schritt

1. Node-/Express-/TypeScript-Grundgerüst mit getrennten `app`-/`server`-Startpunkten aufbauen.
2. Healthcheck, einheitliches Fehlerformat, Korrelations-ID und sichere Basiskonfiguration ergänzen.
3. Danach Kernmodelle, konkrete Indexmigrationen und typisierte Repositories innerhalb von `FS1` umsetzen und testen.

Der operative Termin- und Personenplan steht in `docs/DAILY_PLAN.md`.
