# Ristorante Colosseo

**Status:** Marketing-Website implementiert; Lokalisierung und finale Prüfung noch nicht abgeschlossen
**Phase:** Marketing-Website – QA und Lokalisierung; Full-Stack-Erweiterung `FS0`
**Letzte Aktualisierung:** 02.11.2026

React-/TypeScript-Website für das Ristorante Colosseo mit Restaurantinformationen, Speisekarte und telefonischer Reservierungsaktion. Diese README dient als Einstieg und lokale Kurzanleitung. Anforderungen, Inhalte und Freigaben stehen in den unten verlinkten Projektdokumenten.

## Entwicklungsstand

Das Frontend verwendet Vite, TanStack Router, Tailwind CSS und GSAP. Sprachrouten für Deutsch, Englisch und Italienisch sind vorhanden; die aktuelle Notte-Startseite ist erst teilweise übersetzt. Offene Prüfungen zu SEO, Prerendering und vollständiger Lokalisierung stehen in [TASKS.md](docs/TASKS.md).

Das eigene Reservierungs-Backend, die Datenbankanbindung und die Admin-Anmeldung sind geplant und noch nicht implementiert. Architektur und geplanter Zielstack sind über das [Backend-Cockpit](docs/BACKEND.md) erschlossen. Der verbindliche Phasen- und Freigabestatus steht ausschließlich in [TASKS.md](docs/TASKS.md).

## Lokal starten

Benötigt werden Node.js und npm. Die gemeinsam kompatiblen Node-Bereiche der aktuell im Lockfile fixierten Vite-/Vitest-Versionen sind `^22.12.0`, `^24.0.0` oder `>=26.0.0`. Eine projektweit festgelegte Node-Version ist noch offen; die Angabe beschreibt Paketkompatibilität und keine bereits getroffene Betriebsentscheidung.

Im Repository-Verzeichnis ausführen:

```bash
npm ci
npm run dev
```

Die von Vite ausgegebene lokale Adresse öffnen und `/de`, `/en` oder `/it` aufrufen. Nach einem Pull mit geänderten Paketdateien stellt `npm ci` die im Lockfile festgehaltenen Abhängigkeiten wieder her. Dabei wird das lokale `node_modules` neu aufgebaut.

Für den aktuellen Frontend-Start sind weder ein Datenbankkonto noch Backend-Zugangsdaten erforderlich. Secrets gehören nicht ins Repository.

## Prüfungen und Build

| Befehl | Zweck |
|---|---|
| `npm run typecheck` | TypeScript ohne Ausgabe prüfen |
| `npm run lint` | Oxlint ausführen |
| `npm test` | vorhandene Vitest-Tests einmal ausführen |
| `npm run test:watch` | Tests im Watch-Modus ausführen |
| `npm run build` | Production-Build nach `dist/` erzeugen |

Diese Befehle beschreiben die verfügbaren Scripts. Tatsächlich ausgeführte Prüfungen und deren Grenzen sind in [TASKS.md](docs/TASKS.md) dokumentiert.

`netlify.toml` verwendet derzeit `npm run build` und `dist` als Veröffentlichungsverzeichnis. Das ist eine lokale Konfiguration, kein Nachweis eines erfolgten Deployments. `dist/` enthält noch bereits versionierte Artefakte; der Ignore-Eintrag entfernt diese nicht rückwirkend aus Git. Für einen isolierten Prüfbuild kann deshalb ein temporäres Ausgabeverzeichnis angegeben werden:

```bash
npm run build -- --outDir /tmp/colosseo-readme-preview
npm exec vite preview -- --outDir /tmp/colosseo-readme-preview
```

Das Beispiel verwendet einen temporären Linux-/macOS-Pfad. Vite Preview dient der lokalen Prüfung. Veröffentlichung und Hostingentscheidungen folgen den Projektfreigaben.

## Verzeichnisübersicht

```text
app/
  components/             gemeinsame Komponenten und Speisekarten-Overlay
  content/                Texte, Sprachressourcen und Speisekartendaten
  i18n/                   i18next-Konfiguration
  lib/                    gemeinsame Hilfsfunktionen
  prototypes/colosseo/     Notte-Seite, Varianten, Motion und zugehörige Styles
  styles/                 globale Styles
  main.tsx                Client-Einstieg
  router.tsx              TanStack-Routen
public/                   statische Bilder, Videos und weitere Assets
tests/unit/               vorhandene Unit-Tests
docs/                     zuständige Projektquellen
```

Eine `server/`-Struktur ist noch nicht implementiert.

## Projektdokumentation

| Dokument | Einstieg |
|---|---|
| [AGENTS.md](AGENTS.md) | verbindliche Arbeitsregeln und Freigabeprozess |
| [SKILLS.md](SKILLS.md) | projektbezogene Skills, Fundstellen und Verfügbarkeit |
| [SPEC.md](docs/SPEC.md) | funktionale und technische Anforderungen |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Gestaltung, Tokens und Motion |
| [CONTENT.md](docs/CONTENT.md) | Inhalte, Übersetzungen und Inhaltsfreigaben |
| [TASKS.md](docs/TASKS.md) | Fortschritt, Gates, Prüfergebnisse und Restpunkte |
| [BACKEND.md](docs/BACKEND.md) | Einstieg in die geplante Full-Stack-Erweiterung |
| [DAILY_PLAN.md](docs/DAILY_PLAN.md) | operative Tagesplanung und nächster Einstieg |
| [AUDIT.md](docs/AUDIT.md) | geprüfte Referenzbeobachtungen und Bestandsaudit |
