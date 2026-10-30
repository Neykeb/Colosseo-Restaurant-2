# Backend-Cockpit

**Status:** Orientierung für Full-Stack-Phase `FS0`; noch kein Backend-Anwendungscode implementiert  
**Phase:** `FS0` – Analyse, Entscheidungen und Gate-Freigabe  
**Letzte Aktualisierung:** 30.10.2026

Diese Datei ist der schnelle Einstieg in die Backend-Arbeit. Sie fasst keine vollständige Spezifikation doppelt zusammen, sondern zeigt, **wo** eine Entscheidung verbindlich dokumentiert ist und **was als Nächstes** zu tun ist.

## 1. Aktueller Stand in 30 Sekunden

- Die bestehende öffentliche React-/TypeScript-Website bleibt erhalten.
- Das neue Backend ist geplant, aber noch nicht implementiert.
- Zielstack: Node.js, Express, TypeScript, MongoDB mit Mongoose, Clerk für OAuth und Sessions, Resend für E-Mails sowie Render für das Finalprojekt.
- Clerk authentifiziert Admins. Die eigene Express-/MongoDB-Logik entscheidet zusätzlich, ob ein Konto als `owner` oder `staff` zugelassen ist.
- Aktuelle Phase: `FS0`. Vor `FS1` fehlen die ausdrückliche Gate-Freigabe und die in `docs/TASKS.md` genannten Betriebsentscheidungen.
- Das `GO` vom 30.10.2026 autorisiert ausschließlich diese Dokumentations- und Planungsübersicht, nicht die Implementierung von `FS1`.

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

- `server/config`: geprüfte Umgebungsvariablen und Infrastrukturkonfiguration
- `server/http`: Express-App, Middleware, Routen und Fehlerantworten
- `server/modules`: fachliche Module wie Reservierungen, Speisekarte und Öffnungszeiten
- `server/models`: Mongoose-Schemas und Modelle
- `server/repositories`: gekapselter Datenzugriff
- `server/services`: Geschäftsabläufe und externe Dienste
- `server/jobs`: Outbox- und Wartungsaufgaben
- `server/tests`: Unit-, Integrations-, API- und Parallelitätstests

Noch nicht existierende Pfade sind Planung und dürfen nicht als bereits implementiert verstanden werden.

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

- Backend: Node.js, Express und TypeScript
- Datenzugriff: MongoDB mit Mongoose
- Admin-Anmeldung: Clerk OAuth
- E-Mail-Service: Resend
- Hosting: Render, zunächst für das Finalprojekt

### Vor `FS1` offen

- ausdrückliche Freigabe von Gate `FS0` und separates `GO` für `FS1`
- Bestätigung von MongoDB Atlas, Konto und Region
- Entscheidung zur lokalen transaktionsfähigen MongoDB-Umgebung beziehungsweise Docker-Replica-Set

### Vor späteren Phasen offen

- Clerk-Anwendung, OAuth-Anbieter und erste Owner-Identität
- Rollenmatrix für `owner` und `staff`
- reale Tische, Bereiche, Kombinations- und Reservierungsregeln
- Datenschutz-, Aufbewahrungs-, Storno- und No-show-Regeln
- E-Mail-Absenderdomain und Restaurantempfänger
- Bildspeicher für Speisekartenmedien

Die vollständige nummerierte Liste wird nur in `docs/TASKS.md` gepflegt.

## 8. Nächster zulässiger Schritt

1. Offene Entscheidungen für `FS1` klären.
2. Gate `FS0` ausdrücklich freigeben.
3. Ein separates `GO für FS1` erteilen.
4. Erst dann Plattformgrundlage und Datenbank implementieren.

Der operative Termin- und Personenplan steht in `docs/DAILY_PLAN.md`.
