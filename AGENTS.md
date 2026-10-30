# Projektanweisungen für Agenten

## Geltungsbereich

Diese Datei gilt für das gesamte Repository. Sie ist die verbindliche Quelle für dauerhafte Arbeitsregeln, Coding-Standards und den Projektprozess. Fachliche Entscheidungen gehören ausschließlich in die jeweils zuständige Datei unter `docs/`.

## Sprache

- Kommunikation und Projektdokumentation erfolgen auf Deutsch.
- Code, technische Bezeichner, Datei- und Komponentennamen werden auf Englisch geschrieben.
- Übersetzungen müssen natürlich und professionell sein; ungeprüfte Maschinenübersetzungen sind nicht als final zu kennzeichnen.

## Verbindliche Quellen

- `docs/AUDIT.md`: geprüfte Referenzbeobachtungen und daraus abgeleitete Chancen, nicht das Zielsystem.
- `docs/SPEC.md`: freigegebene funktionale und technische Anforderungen sowie Akzeptanzkriterien.
- `docs/DESIGN_SYSTEM.md`: freigegebene visuelle Tokens, Layout-, Komponenten- und Motion-Regeln.
- `docs/CONTENT.md`: Inhaltsarchitektur, freigegebene Texte, Übersetzungen und Inhaltsstatus.
- `docs/TASKS.md`: Phasen, Abhängigkeiten, Gate-Status und Arbeitsfortschritt.
- `docs/BACKEND.md`: schneller Einstieg in die Full-Stack-Arbeit; zeigt Architektur, Zuständigkeiten, aktuellen Gate-Status und verweist auf die verbindlichen Details, ohne sie zu duplizieren.
- `docs/DAILY_PLAN.md`: operative Tagesplanung für zwei Personen, Tagesabschlüsse, Blockaden und eindeutig dokumentierter nächster Einstiegspunkt; ersetzt weder Anforderungen noch die Gate-Roadmap.

Informationen dürfen nicht zwischen diesen Dateien dupliziert werden. Andere Dokumente verlinken auf die zuständige Quelle. Ändert sich eine freigegebene Entscheidung oder eine relevante Implementierungsdetail, ist die zuständige Quelle im selben Arbeitsschritt zu aktualisieren.

`docs/BACKEND.md` ist der erste Einstieg für Backend-Fragen. Technische Anforderungen bleiben ausschließlich in `docs/SPEC.md`, der verbindliche Phasenstatus ausschließlich in `docs/TASKS.md`. `docs/DAILY_PLAN.md` plant nur die konkrete Zusammenarbeit; bei Widersprüchen gelten `SPEC.md` und `TASKS.md`.

## Approval Gates

1. Phase 1: Discovery und Referenz-Audit.
2. Phase 2: Kreativkonzept, Informationsarchitektur und Designsystem.
3. Phase 3: technische Spezifikation.
4. Phase 4: Implementierung.
5. Phase 5: visuelle QA und Optimierung.
6. Phase 6: finale Qualitätssicherung.

- Nach Phase 1, 2 und 3 ist eine ausdrückliche Freigabe erforderlich.
- Dokumentation ersetzt keine Freigabe.
- Ohne Freigabe darf die nächste Phase nicht begonnen werden.
- Schweigen, frühere allgemeine Zustimmung oder ein als Entwurf dokumentierter Vorschlag gelten nicht als Freigabe.
- Eine neue oder geänderte Freigabe wird mit Datum und Umfang in `docs/TASKS.md` festgehalten.

### Full-Stack-Erweiterung ab 30.10.2026

- Die Full-Stack-Erweiterung besitzt eigene, in `docs/TASKS.md` definierte Phasen `FS0` bis `FS8`.
- `FS0` umfasst ausschließlich Bestandsanalyse, Architekturentwurf, offene Fachfragen und Roadmap. Es darf dabei kein Anwendungscode entstehen und keine neue Laufzeitabhängigkeit installiert werden.
- Jede Phase ab `FS1` benötigt ein eigenes ausdrückliches `GO`. Ein `GO` gilt nur für die unmittelbar nächste dokumentierte Phase und nicht für spätere Phasen.
- Nach jeder Full-Stack-Phase werden Dokumentation, tatsächlich ausgeführte Tests, Ergebnis und Restpunkte präsentiert. Bis zum nächsten `GO` wird nicht weiter implementiert.
- Frühere Freigaben für die Marketing-Website autorisieren keine Backend-, Datenbank-, Authentifizierungs-, E-Mail- oder Produktionsänderungen.
- Verbindliche Zieltechnologien der Full-Stack-Erweiterung sind nach letzter Nutzeranpassung vom 30.10.2026: Node.js, Express und TypeScript für das Backend, MongoDB mit Mongoose, Render als Hostingplattform des Web Service, Resend für Transaktions-E-Mails und Clerk OAuth für die Admin-Anmeldung. MongoDB Atlas ist die empfohlene verwaltete Datenbankinfrastruktur und benötigt vor Einrichtung noch die ausdrückliche Bestätigung des Nutzers.
- Backend-as-a-Service-Lösungen, die Geschäftslogik oder Datenzugriff anstelle der eigenen Implementierung übernehmen, sind für dieses Finalprojekt ausgeschlossen. Clerk ist nach Nutzerentscheidung vom 30.10.2026 die ausdrücklich erlaubte Ausnahme für Admin-Identität, OAuth-Anmeldung und Sessionprüfung; fachliche Autorisierung und Rollen bleiben serverseitig im eigenen Express-/MongoDB-Code.
- Wichtige technische Entscheidungen werden in verständlicher Sprache dokumentiert, damit der Nutzer Architektur, Datenfluss, Sicherheitsmodell und Tests selbst präsentieren kann.

## Umgang mit Unbekanntem

- Fehlende Angaben niemals erfinden.
- Ungeklärte Punkte mit `OFFEN` kennzeichnen.
- Nicht verifizierte Schlussfolgerungen mit `ANNAHME` kennzeichnen und vor Umsetzung bestätigen lassen.
- Vorschläge mit `VORSCHLAG` kennzeichnen; sie sind bis zur Freigabe nicht verbindlich.
- Nur nachweislich geprüfte Sachverhalte als `VERIFIZIERT` bezeichnen.
- Der Ordnername ist kein Beleg für Projektname, Marke, Branche oder Leistungsumfang.
- Vom Nutzer ausdrücklich erlaubte provisorische Inhalte müssen sichtbar als `PLATZHALTER` gekennzeichnet bleiben. Sie dürfen weder als reale Fakten behandelt noch ohne Ersatzprüfung veröffentlicht werden.

## Entwicklungsstandards

- Standard-Stack erst nach Phase-3-Freigabe verbindlich festlegen. Ausgangsvorschlag: React, TypeScript im Strict Mode, Vite, Tailwind CSS, GSAP/ScrollTrigger, ein begründet ausgewählter Router und i18next/react-i18next.
- Semantisches HTML, progressive Verbesserung und komponentenorientierte Architektur verwenden.
- Keine hardcodierten UI-Texte; sichtbare Inhalte über die freigegebene Lokalisierungsstruktur führen.
- Designwerte aus Tokens beziehen; keine willkürlichen Einzelwerte in Komponenten.
- Abhängigkeiten nur installieren, wenn ihr Nutzen dokumentiert und eine leichtere Lösung nicht ausreichend ist.
- Animationen dürfen Inhalte nicht blockieren, kein Scroll-Jacking erzeugen und müssen `prefers-reduced-motion` respektieren.
- Tastaturbedienung, sichtbare Fokuszustände, sinnvolle zugängliche Namen und WCAG 2.2 AA berücksichtigen.
- Responsive Bilder, reservierte Medienflächen und bewusstes Laden für gute Core Web Vitals einsetzen.
- Fremde Texte, Bilder, Marken oder proprietäre Gestaltung nicht kopieren. Die Referenz dient ausschließlich zur Analyse von Prinzipien.
- Für die Website-Implementierung ist der Skill `gpt-taste` verbindlich. Vor dem ersten React-/UI-Code muss dessen `<design_plan>` vollständig ausgegeben werden. Die deterministische Auswahl von Hero, einer der erlaubten Typografie-Stacks, drei Komponentenarchitekturen und zwei GSAP-Paradigmen ist anschließend umzusetzen.
- `gpt-taste` ergänzt das freigegebene Designsystem. Bei Widersprüchen mit einem konkreten visuellen Token ist die ausdrücklich angeordnete Skill-Regel für die Umsetzung maßgeblich und die zuständige Dokumentation im selben Schritt zu aktualisieren.
- Backend-Eingaben werden an der Vertrauensgrenze serverseitig validiert; Clientvalidierung ist nur zusätzliche Bedienhilfe.
- Änderungen an MongoDB-Dokumentstruktur, Indizes oder Datenformaten erfolgen ausschließlich über versionierte, überprüfbare Migrationsskripte. Manuelle Produktionsänderungen ohne entsprechendes Skript sind unzulässig.
- Reservierungsentscheidungen müssen atomar und gegen parallele Anfragen abgesichert sein. Eine vorherige Verfügbarkeitsanzeige allein darf niemals als Buchungsgarantie gelten.
- Administrative Berechtigungen werden serverseitig und nach dem Prinzip der geringsten Rechte geprüft. Eine gültige Clerk-Anmeldung allein gewährt keinen Adminzugriff; zusätzlich muss ein aktives, serverseitig verwaltetes Adminprofil mit passender Rolle existieren.
- Secrets, Service-Schlüssel und E-Mail-Zugangsdaten bleiben ausschließlich in serverseitigen Umgebungsvariablen und dürfen weder in Client-Bundles noch im Repository erscheinen.
- Personenbezogene Daten erhalten dokumentierte Zwecke, Rechtsgrundlagen, Aufbewahrungs- und Löschregeln. Nicht erforderliche Daten werden nicht erhoben.
- Externe Nebenwirkungen wie E-Mail-Versand müssen idempotent, wiederholbar und von der erfolgreichen Kerntransaktion nachvollziehbar getrennt werden.

## Qualitätsregeln

- Tests oder Messwerte nur als ausgeführt dokumentieren, wenn sie tatsächlich ausgeführt wurden.
- Vor Abschluss einer Implementierungsaufgabe mindestens die relevanten Typ-, Lint-, Build- und Funktionstests ausführen, sofern im Projekt vorhanden.
- Feldziele sind keine Garantien: LCP ≤ 2,5 s, INP ≤ 200 ms und CLS ≤ 0,1 werden als Zielwerte behandelt.
- Repräsentative mobile, Tablet- und Desktop-Ansichten visuell prüfen.
- Bestehende Nutzeränderungen bewahren; keine destruktiven Git- oder Dateisystemaktionen ohne ausdrücklichen Auftrag.
- Nicht deployen, veröffentlichen, buchen oder externe Inhalte ändern, solange keine ausdrückliche Erlaubnis vorliegt.
- Sobald eine testbare Oberfläche existiert, ist der Skill `break-ui` für realistische Extremdaten, lange Übersetzungen, fehlende Inhalte und schmale Viewports einzusetzen. Befunde werden vor ihrer Behebung dokumentiert und in `docs/TASKS.md` nachverfolgt.

## Dokumentationspflege

- Jede Datei beginnt mit Status, Phase und letzter Aktualisierung.
- Entwürfe und freigegebene Entscheidungen müssen eindeutig unterscheidbar sein.
- Abgeschlossene Aufgaben in `docs/TASKS.md` nur mit überprüfbarem Ergebnis markieren.
- Widersprüche zuerst zugunsten der neuesten ausdrücklich freigegebenen Entscheidung lösen und alle betroffenen Quellen synchronisieren.
- Werden zusätzliche Spezialdokumente später benötigt, müssen sie eine neue, überschneidungsfreie Zuständigkeit erhalten; diese Zuordnung wird hier ergänzt.
- An jedem aktiven Projekttag wird `docs/DAILY_PLAN.md` zum Arbeitsbeginn und Tagesabschluss aktualisiert: Ist-Stand, tatsächlich erledigte Aufgaben, ausgeführte Tests, Blockaden und nächster gemeinsamer Einstiegspunkt. Nicht erledigte Aufgaben werden sichtbar neu eingeplant und nicht stillschweigend als abgeschlossen markiert.
