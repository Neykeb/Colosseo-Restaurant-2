# Backend-Cockpit

**Status:** Full-Stack-Phase `FS6` in Arbeit; Menü- und Medienverwaltung integriert

**Phase:** `FS6` – Speisekarte, Öffnungszeiten und Medienverwaltung

**Letzte Aktualisierung:** 12.11.2026

Diese Datei ist der schnelle Einstieg in die Backend-Arbeit. Sie fasst keine vollständige Spezifikation doppelt zusammen, sondern zeigt, **wo** eine Entscheidung verbindlich dokumentiert ist und **was als Nächstes** zu tun ist.

## 1. Aktueller Stand in 30 Sekunden

- Die bestehende öffentliche React-/TypeScript-Website bleibt erhalten.
- Die erste Backend-Grundlage ist implementiert: validierte Serverumgebung, getrennte Express-App und Serverstart, Healthcheck, Korrelations-ID, Fehlerformat, Mongoose-Verbindung und erfolgreicher Atlas-Verbindungstest.
- Der versionierte MongoDB-Migrationsrahmen ist implementiert: geordnete Registry, Historie, Ausführungssperre, Status, Vorwärtslauf, einzelner Rollback und Unit-Tests. Die erste Core-Indexmigration ist in `colosseo_test` und `colosseo` erfolgreich angewendet.
- Zielstack: React, TypeScript, Vite und TanStack Router im Frontend; Node.js, Express und TypeScript im Backend; MongoDB mit Mongoose, Clerk für OAuth und Sessions, Resend für E-Mails sowie Render für das Finalprojekt.
- TanStack Router, Sprachrouten, direkte Reloads, gestalteter 404-Zustand, Lazy Loading, Netlify-Publish-Pfad und Build-Prerendering für 15 lokalisierte Routen sind lokal und auf `https://ristorante-colosseo-winsen.netlify.app` verifiziert. Canonical, Hreflang, Sitemap, `robots.txt` und die öffentlich geladenen JavaScript-Chunks wurden am 04.11.2026 live geprüft; der zuvor aktive Netlify-SSO-Zugriffsschutz ist deaktiviert.
- Der Atlas-Benutzer besitzt am 03.11.2026 verifiziert ausschließlich datenbankspezifisches `readWrite` für `colosseo` und `colosseo_test`. Entwicklungsverbindung, Testverbindung und Test-Migrationslauf sind damit erfolgreich.
- Vom Nutzer bestätigter Atlas-Betriebsstand: MongoDB `8.0.36`, AWS Frankfurt (`eu-central-1`), Replica Set mit drei Nodes, Backups derzeit inaktiv, keine verknüpften App Services und ein vorhandener Search-Index. Render soll später möglichst regionsnah betrieben werden; Backups bleiben vor einem realen Produktionsbetrieb zu klären.
- Clerk authentifiziert Admins. Die eigene Express-/MongoDB-Logik entscheidet zusätzlich, ob ein Konto als `owner` oder `staff` zugelassen ist.
- Aktuelle Phase: `FS6`. Die Menü-/Medienmodelle, GridFS-Ablage, geschützten CRUD-/Publikationsendpunkte sowie die Adminoberfläche für Kategorien, Gerichte, Vorschau, Veröffentlichung, Upload und Löschung sind integriert und technisch geprüft. Reguläre Öffnungszeiten, Bestandsmigration, öffentliche Synchronisation mit Fallback und das abschließende FS6-E2E bleiben offen.
- Die reine Reservierungslogik, öffentliche Config-/Verfügbarkeits-/Buchungsendpunkte, idempotente Bestätigung, Rate-Limit, atomare Tisch-Zeit-Sperren sowie geschützte Admin-Endpunkte für manuelle Buchungen und Sperrzeiten sind implementiert. Migrationen `0005` und `0006` sind in `colosseo_test` und `colosseo` angewendet.
- Die Express-/TypeScript-Grundlage einschließlich statischer Produktionsauslieferung ist implementiert. Entwicklungs- und Produktionsprozess, Healthcheck, API-404 sowie die drei vorgerenderten Sprachseiten wurden am 05.11.2026 über echte lokale Listener geprüft.
- Der gemeinsame React-/Express-Web-Service ist per Render-Blueprint in Frankfurt live. Reproduzierbarer Build, idempotente Migration vor dem Serverstart, `/api/health`, MongoDB Atlas, Clerk, Resend-Konfiguration und `SITE_URL` sind in der Render-Umgebung aktiv; Secrets bleiben ausschließlich dort gespeichert.
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

### Aktueller FS4-Stand

- Die Gaststrecke prüft Verfügbarkeit und bestätigt eine Reservierung ausschließlich nach erfolgreicher atomarer Datenbanktransaktion.
- Pro bestätigter Buchung entstehen eindeutige Outbox-Ereignisse für Restaurant und – sofern eine E-Mail angegeben wurde – Gast. Der Worker nutzt dieselbe Ereignis-ID als Resend-Idempotenzschlüssel und wiederholt temporär fehlgeschlagene Zustellungen begrenzt.
- Empfänger für Restaurantbenachrichtigungen: `mohammad.amiri@dci-student.org` (`VORLÄUFIG BESTÄTIGT 09.11.2026`).
- Der lokale Resend-API-Key und der Testabsender `onboarding@resend.dev` sind konfiguriert. Ein realer Gastversand wurde am 09.11.2026 mit Providerstatus `Delivered` und genau einem eindeutigen Outbox-Ereignis verifiziert.
- Ohne verifizierte eigene Domain erlaubt Resend nur Testzustellungen an die Adresse des Resend-Kontos. Die Restaurantbenachrichtigung an die vorläufige DCI-Adresse wurde deshalb erwartungsgemäß abgelehnt und bleibt in der Outbox wiederholbar; eine produktive Absenderdomain bleibt offen.

### Vor späteren Phasen offen

- Backup-Strategie beziehungsweise passender Atlas-Tarif vor einem realen Produktionsbetrieb
- konkrete Clerk User-ID jedes freizugebenden Owners
- konkrete Rechte für `staff`; bis zur Freigabe bleibt diese Rolle gesperrt
- reale Tische, Bereiche, Kombinations- und Reservierungsregeln
- Datenschutz-, Aufbewahrungs-, Storno- und No-show-Regeln
- E-Mail-Absenderdomain; Restaurantempfänger ist vorläufig festgelegt
- Bildrechte beziehungsweise Freigaben für später real hochgeladene Speisekartenmedien; die technische Ablage verwendet für das Demo-Projekt MongoDB GridFS

Die vollständige nummerierte Liste wird nur in `docs/TASKS.md` gepflegt.

## 8. Nächster zulässiger Schritt

1. Für die Demo im eingeschränkten Resend-Testmodus bleiben; keine beliebigen realen Empfänger und keine echten Gastdaten verwenden. Eine eigene Absenderdomain ist erst bei einem späteren Produktionsauftrag erforderlich.
2. `FS6` ist seit dem ausdrücklichen `GO` vom 12.11.2026 aktiv. Menü- und Medienverwaltung sind integriert. Als Nächstes folgt die reguläre Öffnungszeitenverwaltung ohne Duplikation der datierten Sondertage aus `FS5`.
3. Öffentliche Menü-/Öffnungszeiten-Synchronisation erst nach kontrollierter Bestandsmigration aktivieren; bis dahin bleibt die verifizierte statische Website maßgeblich. `FS7` benötigt ein neues ausdrückliches `GO`.

Der operative Termin- und Personenplan steht in `docs/DAILY_PLAN.md`.
