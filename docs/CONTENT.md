# Inhalt und Lokalisierung

**Status:** Phase 2 freigegeben; Full-Stack-Inhaltsbedarf ergänzt; EN-/IT-Teilfreigaben der Notte-Startseite dokumentiert
**Phase:** Inhaltsbestand der Marketing-Website; Full-Stack-Planung `FS0`
**Letzte Aktualisierung:** 02.11.2026

Diese Datei ist die einzige verbindliche Quelle für Inhaltsarchitektur, Seitentexte, CTA-Texte, Lokalisierung, Metadateninhalte und Inhaltsstatus. Funktionale Seitenanforderungen stehen in `SPEC.md`; visuelle Darstellungsregeln stehen in `DESIGN_SYSTEM.md`.

## Bestätigter Stand

- Projektdokumentation und Kommunikation erfolgen auf Deutsch.
- Code und technische Bezeichner erfolgen auf Englisch.
- Projekt- und Markenname: **Ristorante Colosseo**.
- Angebot: Pizza, Pasta und weitere italienische Speisen.
- Kernbotschaft als sachliche Grundlage: frische Zubereitung in der eigenen Küche mit einfachen Zutaten.
- Kernzielgruppe: Menschen ab etwa 30 Jahren mit Interesse an italienischem Essen und frischen Zutaten.
- Primäres Conversion-Ziel: Tisch reservieren. Der ausdrückliche Full-Stack-Auftrag vom 30.10.2026 ersetzt die frühere Festlegung auf einen externen Dienst durch ein eigenes Reservierungssystem; bis zu dessen geprüfter Freigabe bleibt die bestätigte Telefonnummer der einzige aktive Reservierungsweg.
- Sekundäre Ziele: Speisekarte einsehen sowie Feiern und Veranstaltungen anfragen.
- Eine Online-Bestellfunktion für Essen ist nicht vorgesehen.
- Verbindliche Sprachen: Deutsch, Englisch und Italienisch. Die Standardsprache ist `OFFEN`.
- Bestehende Marke und Logo: vorhanden, Dateien und Verwendungsregeln noch `OFFEN`.
- Reales, für das Projekt freigegebenes Bildmaterial: Innenraum, Außenansicht, Caprese, Pasta und Pizza; durch Nutzer am 12.10.2026 bestätigt.
- Restaurantgeschichte: seit über 30 Jahren traditioneller Familienbetrieb; durch Nutzertext am 12.10.2026 bestätigt.

## Geschäftsdaten

Ausdrücklich bestätigte Werte gelten als reale Projektangaben. Von der bisherigen Website übernommene Werte bleiben bis zur Bestätigung ihrer Aktualität offen.

| Feld | Inhalt | Status |
|---|---|---|
| Adresse | Bahnhofstraße 42–45, 21423 Winsen (Luhe) | `FREIGEGEBEN` durch Nutzer am 10.10.2026 |
| Telefon | 04171 62952 / `tel:+49417162952` | `FREIGEGEBEN` durch Nutzer am 10.10.2026 |
| E-Mail | ristorante.colosseo@googlemail.com | `QUELLE ALTSEITE`, Aktualität `OFFEN` |
| Öffnungszeiten | Montag geschlossen; Dienstag–Freitag 12:00–14:00 und 17:00–21:00; Samstag 17:00–21:00; Sonntag 12:00–14:00 und 17:00–21:00 | `QUELLE ALTSEITE`, Aktualität `OFFEN` |
| Rechtliche Angaben | Werden nachgereicht | `OFFEN` |

Nicht ausdrücklich freigegebene Angaben dürfen vor Veröffentlichung nicht als aktuell dargestellt werden.

## Benötigte Inputs

- fachlich bestätigte Reservierungsregeln und Formularfelder sowie konkreter Veranstaltungsanfrageweg
- reale Geschäftsdaten als Ersatz für sämtliche Platzhalter
- Seiten- und Funktionsumfang
- Markenstimme, gewünschte Tonalität und verbotene Formulierungen
- vorhandene Texte, Übersetzungen und Freigabeverantwortliche
- rechtlich geprüfte Pflichtinhalte
- SEO-Themen, Regionen und Suchintentionen

## In Phase 2 zu pflegen

Für jede freigegebene Seite werden Zweck, Zielgruppe, Kernbotschaft, Abschnittsfolge, CTA, benötigte Belege/Assets und Sprachstatus dokumentiert. Texte erhalten einen eindeutigen Status: `OFFEN`, `ENTWURF`, `FACHLICH GEPRÜFT`, `ÜBERSETZT` oder `FREIGEGEBEN`.

## Informationsarchitektur

### Vorgeschlagene Hauptnavigation

1. **Startseite**: Positionierung, Angebot, Handwerk, Atmosphäre und Reservierung.
2. **Speisekarte**: kategorisierte Speisen und Getränke. Preise und Gerichte bleiben bis zur Lieferung `OFFEN`.
3. **Unser Restaurant**: Geschichte, Anspruch und Küche. Der über 30-jährige traditionelle Familienbetrieb ist bestätigt; Angaben zu Personen und Team bleiben offen.
4. **Feiern**: Möglichkeiten für private Feiern und Veranstaltungen mit externem Anfrageweg.
5. **Kontakt**: Anfahrt, reale Öffnungszeiten, Telefon und rechtliche Verweise.

Globale Aktionen: **Tisch reservieren**, Telefon, Sprachauswahl. Die Reservierungsaktion führt erst nach freigegebener Full-Stack-Implementierung in den eigenen Buchungsablauf; bis dahin bleibt sie telefonisch. Impressum und Datenschutz stehen ausschließlich im Footer und bleiben inhaltlich `OFFEN`.

Die Speisekarte erhält eine eigene Seite und darf zusätzlich als kurze Auswahl auf der Startseite erscheinen. Eine Online-Bestellstrecke wird nicht vorgesehen.

## Homepage-Architektur

Die am 22.10.2026 freigegebene Reihenfolge der deutschen Notte-Startseite lautet:

1. **Hero** mit scrollgesteuertem Pizza-Video und Reservierungsaktion.
2. **Begrüßung** „Liebe Gäste und Amici“ mit realem Innenraumfoto.
3. **Speisekarten-Vorschau** als Sticky-Editorial-Sequenz und Zugang zur vollständigen Karte.
4. **Familiengeschichte** mit der bestätigten Aussage zum über 30-jährigen Familienbetrieb.
5. **Feiern und besondere Anlässe** als einzelne bilddominante Section; der frühere redundante Services-Slider entfällt vollständig.
6. **Google-Bewertungen** als Vertrauensbeleg.
7. **Reservierungsabschluss** mit bestätigter telefonischer Alternative; externer Anbieter bleibt `OFFEN`.
8. **Besuch planen** mit Öffnungszeiten, Adresse, Telefon und Anfahrt.
9. **Footer** mit Navigation, Sprachen sowie später Impressum und Datenschutz.

Die frühere Mittag-/Abend-Doppelfläche und der Services-Slider sind nicht mehr Teil der freigegebenen Inhaltsarchitektur.

Die Startseite nutzt mindestens vier unterschiedliche Layoutfamilien: Media-Hero, typografische Manifestfläche, asymmetrische Galerie, horizontale Speisekarten-Vorschau, Kontaktblock und fokussierter CTA-Abschluss.

## Kernbotschaften und CTA-System

### Inhaltliche Hierarchie

1. Italienisches Essen, frisch in der eigenen Küche zubereitet.
2. Einfache Zutaten und sorgfältiges Handwerk.
3. Pizza, Pasta und weitere italienische Gerichte.
4. Ein Ort für gemeinsames Essen sowie Feiern und Veranstaltungen.

### Verbindliche Aktionsbegriffe

| Absicht | Deutscher Begriff | Status |
|---|---|---|
| Primär | Tisch reservieren | `FREIGEGEBENE ABSICHT`, Textentwurf |
| Telefon | Anrufen | `FREIGEGEBENE ABSICHT`, Textentwurf |
| Menü | Speisekarte | `FREIGEGEBENE ABSICHT`, Textentwurf |
| Veranstaltung | Feier anfragen | `FREIGEGEBENE ABSICHT`, Textentwurf |

Übersetzungen werden erst nach Freigabe des deutschen Ausgangstextes final erstellt.

## Vorläufiger deutscher Textansatz

Alle folgenden Texte sind `ENTWURF` und enthalten keine zusätzlichen Geschäftsfakten.

- Hero-H1: **Italien beginnt in unserer Küche.**
- Hero-Subline: **Pizza, Pasta und ehrliche italienische Küche. Frisch zubereitet aus einfachen Zutaten.**
- Handwerks-Headline: **Einfach in den Zutaten. Sorgfältig in der Zubereitung.**
- Speisekarten-Headline: **Was heute auf den Tisch kommt.**
- Atmosphären-Headline: **Zeit für einen guten Tisch.**
- Feier-Headline: **Gemeinsam feiern, italienisch genießen.**
- Reservierungsabschluss: **Ihr Tisch im Ristorante Colosseo.**

## Lokalisierung

- Sprachen: Deutsch (`de`), Englisch (`en`), Italienisch (`it`).
- Standardsprache: Deutsch. Englisch und Italienisch sind gleichwertig erreichbare lokalisierte Fassungen.
- Deutsch ist redaktionelle Ausgangssprache. Englisch und Italienisch folgen nach fachlicher Freigabe der deutschen Fassung.
- Navigation, Metadaten, Alternativtexte, Fehlermeldungen und externe Linkhinweise werden vollständig lokalisiert.
- Externe Reservierungsziele müssen, sofern möglich, die gewählte Sprache übernehmen.
- Fehlende Übersetzungen dürfen nicht still auf gemischte Sprachseiten führen. Das technische Fallback wird in Phase 3 spezifiziert.

## Asset-Inventar und Art Direction

Fünf reale, vom Nutzer freigegebene Aufnahmen liegen vor. Nicht belegte zusätzliche Motive bleiben `OFFEN`. Generierte Motive sind nur als Konzeptmaterial zulässig und dürfen keine erfundenen Räume, Mitarbeitenden oder Einrichtungen als real darstellen.

| Platzierung | Benötigtes Motiv | Format | Status |
|---|---|---|---|
| Hero | Hände bei frischer Pasta- oder Pizzazubereitung, gerichtetes Seitenlicht | 16:9 Desktop, 4:5 Mobil | `OFFEN` |
| Handwerk | Mehl, Teig, Tomaten, Olivenöl, reale Arbeitsschritte | 4:5 und 3:2 | `OFFEN` |
| Speisekarte | reale Aufnahmen von Caprese, Pasta und Pizza | 4:5 bzw. 4:3 | `FREIGEGEBEN`, Dateien unter `/images/colosseo/` |
| Atmosphäre | realer Gastraum mit gedeckten Tischen und Bar | 1:1 | `FREIGEGEBEN`, `interior-dining-room.webp` |
| Feiern | vom Nutzer bereitgestellte Tischsituation mit gemeinsamem Anstoßen und italienischen Gerichten; keine erfundene Kapazität | 4:5 | `FREIGEGEBEN` |
| Kontakt | Außenansicht und Eingang des realen Restaurants | ca. 16:9 | `FREIGEGEBEN`, `exterior-entrance.png` |

### Freigegebene Begrüßung und Familiengeschichte der deutschen Notte-Startseite

- Überschrift: **Liebe Gäste und Amici**
- Fließtext: **Herzlich willkommen in unserem italienischen Restaurant. Bei uns dreht sich alles um gute, ehrliche Küche ohne viel Schnickschnack – einfach, frisch und köstlich.**
- Abschluss: **Buon Appetito!**
- Platzierung: zweite Section der deutschen Hauptseite unter `/de`.
- Familiengeschichte, Überschrift: **Familienbetrieb seit über 30 Jahren.**
- Familiengeschichte, Fließtext: **Mit frischen Zutaten und ausgewählten Rezepten möchten wir Ihnen die Aromen Italiens näherbringen. Ob bei einem gemütlichen Mittagessen oder einem entspannten Abendessen – wir freuen uns darauf, Sie bei uns begrüßen zu dürfen.**
- Platzierung: direkt nach der Sticky-Editorial-Speisekarten-Vorschau; keine Wiederholung der Begrüßung.
- Status: `FREIGEGEBEN` durch Nutzer am 22.10.2026.

### Verifizierte Auswahl aus der Original-Speisekarte

Quelle: die auf der offiziellen Colosseo-Website direkt verlinkten PDFs `Antipasti.pdf`, `Pasta-1.pdf` und `Pizza.pdf`, geprüft am 12.10.2026.

| Kategorie | Gericht | Beschreibung | Preis | Status |
|---|---|---|---:|---|
| ANTIPASTI FREDDI | MOZZARELLA CAPRESE | Tomaten, Mozzarella und Basilikum | 10,50 € | `VERIFIZIERT` |
| PASTA / TEIGWAREN | PENNE ALLA SICILIANA | Makkaroni mit Tomatensahnesauce, Paprika und Auberginen | 12,50 € | `VERIFIZIERT` |
| PIZZA / PIZZA | PIZZA MARGHERITA | mit Tomatensauce und Käse | 9,50 € | `VERIFIZIERT` |

Die Startseite zeigt bewusst nur diese kuratierte Auswahl. Für Vollständigkeit und Preisänderungen bleibt die offizielle Speisekarte maßgeblich.

Namen, Kategorieüberschriften, Beschreibungen, Groß-/Kleinschreibung und Satzzeichen dieser Auswahl werden ohne redaktionelle Umformulierung aus den aktuell verlinkten Originalkarten übernommen.

### Vollständige Original-Speisekarte im Overlay

Die Vollbild-Speisekarte wurde am 12.10.2026 gegen sämtliche auf der offiziellen Colosseo-Website direkt verlinkten Karten geprüft: `Mittagstisch-Pasta.pdf`, `Mittagstisch-Pizza.pdf`, `Antipasti.pdf`, `Suppen-Salate.pdf`, `Pasta-1.pdf`, `Pasta-2.pdf`, `Pizza.pdf`, `Manzo-Rind.pdf` und `Pesce-Fisch.pdf`.

- Umfang: 8 kompakte Filter und 129 Einträge einschließlich der separat bepreisten Mittagstisch-Auswahl. „Mittagstisch“ ist der einzige zusammengesetzte Filtername; erfundene Bezeichnungen wie „Mittag · Pasta“ werden nicht verwendet.
- Datenquelle im Code: `app/content/menu-data.ts`.
- Originalüberschriften, Gerichtnummern, Namen, Beschreibungen, Preise, Allergenkennzeichnungen und Zusatzstoffe werden ohne redaktionelle Korrektur aus den PDF-Karten übernommen. Ist in der Quelle keine Beschreibung oder Kennzeichnung vorhanden, bleibt das Feld leer; es wird nicht erfunden.
- Verbindliche Originalüberschriften: `ANTIPASTI FREDDI / KALTE VORSPEISEN`, `ANTIPASTI CALDI / WARME VORSPEISEN`, `ZUPPE / SUPPEN`, `INSALATE / SALATE`, `PASTA / TEIGWAREN`, `PIZZA / PIZZA`, `MANZO / RINDFLEISCH` und `PESCE / FISCH`. Die Hauptüberschrift lautet wie auf der offiziellen Website „Unsere Speisekarte“.
- Der Quellenstand wird im Overlay sichtbar genannt und zur offiziellen Website verlinkt. Preisänderungen auf der offiziellen Karte müssen vor Veröffentlichung erneut abgeglichen werden.
- Sprachstatus: derzeit ausschließlich deutsch verifiziert; englische und italienische Fassungen bleiben `OFFEN`.

### Google-Bewertungen auf der deutschen Notte-Startseite

- Das Google-Unternehmensprofil wurde am 22.10.2026 im angemeldeten Originalprofil direkt geprüft: **4,5 Sterne aus 438 Rezensionen**.
- Zwölf unterschiedliche Stimmen mit echtem Anzeigenamen, sichtbarer Einzelwertung, relativem Datum und sehr kurzem Originalauszug wurden ausgewählt: Heiko Simon, Roger Stehr, FoodReview, Jens Schmiggelmeister, B T, Nicola Decker, Nico Niklas, Annette Kemna, Frank Borde, Carsten Hardt, Christian Dierken und Edda Hoffmann-Wernich.
- Zehn Auswahlstimmen besitzen fünf Sterne, zwei vier Sterne. Die Website rendert die Wertung als zugängliche visuelle Sternreihe statt als wiederholten Text.
- Die Website zeigt bewusst nur Mikroauszüge und verlinkt für den vollständigen Kontext auf das Google-Unternehmensprofil. Profilbilder werden nicht übernommen.
- Bewertungsstand, Anzahl und relative Zeitangaben müssen vor Veröffentlichung erneut geprüft werden.

### Reservierungsabschluss auf der deutschen Notte-Startseite

- Platzierung: direkt nach den Google-Bewertungen.
- Überschrift: **Ihr Tisch im Ristorante Colosseo.**
- Fließtext: **Reservieren Sie Ihren Tisch telefonisch. Wir freuen uns auf Ihren Besuch.**
- Primäre Aktion: **04171 62952 anrufen** mit `tel:+49417162952`.
- Der externe Reservierungsdienst und seine Ziel-URL bleiben `OFFEN` und werden bis zur Lieferung nicht dargestellt oder ersetzt.

### Konzeptprompt für nicht-reale Moodbilder

„Premium editorial food photography for an Italian restaurant concept, real hands shaping fresh pasta dough on a dark stone worktop, simple ingredients, natural side light, restrained contrast, subtle grain, authentic kitchen texture, appetizing but not overstyled, no visible faces, no logos, no text, no invented restaurant interior, documentary realism.“

Der Prompt ist nur eine Art-Direction-Grundlage. Für jedes spätere Bild sind Motiv, Format, reale bzw. konzeptionelle Kennzeichnung und zulässiger Verwendungszweck separat festzulegen.

## Inhaltsregeln

- Keine erfundenen Auszeichnungen, Bewertungen, Personen, Gerichte oder Leistungen. Ausdrücklich erlaubte provisorische Kontakt-, Adress- und Öffnungsdaten müssen als `PLATZHALTER` geführt und vor Veröffentlichung ersetzt werden.
- Keine Referenztexte übernehmen oder sinngemäß als Geschäftsfakten darstellen.
- Keine generierten Innenräume, Mitarbeitenden oder Einrichtungen als reale Dokumentation ausgeben.
- Sichtbare UI-Texte werden später zentral lokalisiert; hardcodierte Kopien sind unzulässig.
- Metadaten und Alternativtexte müssen je Sprache inhaltlich passen, nicht nur wörtlich übersetzt sein.

## Gate

Informationsarchitektur und Tonalität wurden am 10.10.2026 durch „okay weiter“ freigegeben. Die einzelnen als `ENTWURF` markierten Texte benötigen weiterhin eine Inhaltsprüfung, bevor sie als endgültige Geschäftsaussagen veröffentlicht werden.

## Bestandsprüfung der Notte-Lokalisierung – 02.11.2026

**Status der ursprünglichen Bestandsprüfung:** Quelltext und dokumentierte Freigaben geprüft; dabei keine neuen Übersetzungen erstellt oder freigegeben. Die anschließende Teilfreigabe steht im folgenden Freigabeabschnitt.

| Inhaltsbereich | Verifizierter Bestand | Freigabe-/Reststatus |
|---|---|---|
| Aktuelle Notte-Startseite | deutsche Texte in `app/content/notte.de.ts`; direkte Verwendung in `organisms.tsx` | Freigaben einzelner deutscher Texte stehen oben; keine pauschale neue Freigabe durch diese Prüfung |
| EN-/IT-Homepage in `app/content/site-content.ts` | Texte für ältere Homepage-Struktur vorhanden; abweichende Hero-Aussage, fehlende aktuelle Begrüßung/Familiengeschichte und aktuelle Bewertungs-/Besuchsstruktur; veralteter Hinweis auf spätere externe Reservierung | kein vollständiger Ersatz für Notte; sprachliche Prüfung und Freigabe der aktuellen Notte-Fassungen OFFEN |
| Sprachübergabe | Route → `NottePrototype` → `NottePage` vorhanden; dort nur an Footer weitergegeben | Abschnitte beziehen deutsche Ressourcen unabhängig von Locale; technische Ursache von R2 |
| i18next | Ressourcen aus `site-content.ts`, deutsches Fallback | aktuelle Notte-Ressourcen dort nicht eingebunden; Konfiguration allein lokalisiert die Abschnitte nicht |
| Navigation und Accessibility | deutsche Beschriftungen auch direkt in Komponenten; Footer-Sprachlinks vorhanden | Übersetzungen von Navigation, Menüaktionen, zugänglichen Namen und Bildalternativen OFFEN |
| Menü-Vorschau und Overlay | Originaldaten und deutsch verifizierte Texte; Overlay ohne Locale-Prop | EN-/IT-Fassungen OFFEN; insbesondere Allergene nicht ungeprüft übersetzen oder mit alten Platzhalterdaten ersetzen |
| Bewertungen und Öffnungszeiten | Originalzitate, relative deutsche Datumsangaben, deutsche Tages-/Zeitbeschriftungen | fremdsprachige Rahmentexte und Umgang mit Originalzitaten festlegen; Aktualitätsstatus der Geschäftsdaten bleibt unverändert |

### Ursprünglicher Inhaltsvorschlag und verbleibender Umfang

Zuerst ausschließlich einen EN-/IT-Textentwurf für Navigation, Hero und Begrüßung der aktuellen Notte-Startseite zur Prüfung vorlegen. Keine Geschäftsangaben ergänzen und keine alten Homepage-Aussagen automatisch übernehmen. Übersetzungen bleiben bis zur fachlichen/sprachlichen Prüfung `ENTWURF`.

Danach schrittweise die übrigen Abschnitte einschließlich Alternativtexte und Accessibility-Beschriftungen prüfen. Menüoriginale und Bewertungszitate benötigen eine ausdrückliche Regel für Originalsprache/Übersetzung. Erst mit abgestimmtem Inhalt die technische Locale-Auswahl und Übergabe an die Abschnitte planen und einzeln freigeben. Ein vollständiges deutsches Fallback unter EN-/IT-URLs gilt nicht als fertige Lokalisierung.

## Freigegebene EN-/IT-Texte: Notte-Navigation, Hero und Begrüßung

**Status:** `FREIGEGEBEN` durch ausdrückliches Nutzer-GO am 02.11.2026 nach Vorlage der folgenden Textentwürfe. Ein weiteres GO autorisiert deren Dokumentation. Keine technische Integration, keine Veröffentlichung und keine Freigabe der übrigen Startseiteninhalte. Die Freigabe dokumentiert die Nutzerentscheidung; eine zusätzliche externe Sprachprüfung wird nicht behauptet.

„Ristorante Colosseo“ bleibt unverändert. Der Hero-Auftakt **Una sera al Colosseo** und die Begrüßungssignatur **Buon Appetito!** bleiben in beiden Fassungen erhalten. Die Hero-Überschriften sind sinngemäß übertragen.

| Inhalt | Englisch (`en`) | Italienisch (`it`) |
|---|---|---|
| Navigation: Speisekarte | Menu | Menu |
| Navigation: Feiern | Celebrations | Eventi |
| Navigation: Kontakt | Contact | Contatti |
| Navigation: Reservieren | Book a table | Prenota un tavolo |
| Navigation öffnen | Open navigation | Apri la navigazione |
| Navigation schließen | Close navigation | Chiudi la navigazione |
| Zugänglicher Navigationsname | Main navigation | Navigazione principale |
| Hero-Überschrift | An evening worth lingering over. | Una serata da vivere senza fretta. |
| Hero-Reservierungsaktion | Book a table | Prenota un tavolo |
| Hero-Speisekartenaktion | Explore the menu | Scopri il menu |
| Begrüßungsüberschrift | Dear guests and amici | Cari ospiti e amici |
| Begrüßungstext | Welcome to our Italian restaurant. For us, it’s all about good, honest food without unnecessary fuss — simple, fresh and delicious. | Benvenuti nel nostro ristorante italiano. Per noi conta la buona cucina, senza inutili fronzoli: semplice, fresca e gustosa. |
| Bildalternativtext der Begrüßung | Dining room at Ristorante Colosseo with set tables and a bar. | Sala del Ristorante Colosseo con tavoli apparecchiati e bancone del bar. |

Die frühere Bestandsprüfung bleibt als zeitlicher Befund erhalten. Deren Status OFFEN ist für genau die hier freigegebenen Texte überholt. Weitere Inhaltsfreigaben folgen gegebenenfalls in den nachstehenden Abschnitten. Speisekarteninhalte, Bewertungsrahmentexte, Öffnungszeitenbeschriftungen und Footer bleiben hinsichtlich EN-/IT-Freigabe offen. Die Teilfreigabe bedeutet keine vollständige Lokalisierung von `/en` oder `/it`.

### Technischer Integrationsstand der Teilfreigabe – 02.11.2026

Die oben freigegebenen Texte für Navigation, Hero und Begrüßung sind in `app/content/notte-locales.ts` eingebunden. Deutsche Ausgangstexte bleiben aus `notte.de.ts` referenziert; die Sprachauswahl folgt der Route. Die historische Bestandsprüfung beschreibt den Zustand vor dieser Teilintegration. Die übrigen Bereiche sind weiterhin nicht lokalisiert; diese Änderung beseitigt R2 nicht vollständig. Architektur und Prüfergebnisse stehen in `SPEC.md` beziehungsweise `TASKS.md`.

## Freigegebene EN-/IT-Texte: Familiengeschichte

**Status:** `FREIGEGEBEN` durch ausdrückliches Nutzer-GO am 02.11.2026 nach Vorlage dieser Textentwürfe. Ein anschließendes separates GO autorisiert ausschließlich deren Dokumentation. Keine technische Integration oder Veröffentlichung. Die Nutzerfreigabe wird dokumentiert; eine zusätzliche externe Sprachprüfung wird nicht behauptet.

### Englisch (`en`)

**Family-run for over 30 years.**

With fresh ingredients and carefully selected recipes, we hope to bring you the flavours of Italy. Whether you join us for a leisurely lunch or a relaxed dinner, we look forward to welcoming you.

### Italienisch (`it`)

**A gestione familiare da oltre 30 anni.**

Con ingredienti freschi e ricette selezionate, desideriamo farvi scoprire i sapori d’Italia. Che sia per un piacevole pranzo o una cena in tranquillità, saremo felici di accogliervi.

Der deutsche Ausgangstext bleibt unverändert. Diese Freigabe umfasst ausschließlich Überschrift und Fließtext der Familiengeschichte; sie umfasst keine neuen Geschäftsfakten, Bildalternativtexte oder andere Abschnitte. Die Familiengeschichte ist nach separatem Integrations-GO am 02.11.2026 in `app/content/notte-locales.ts` eingebunden. Überschrift und Fließtext folgen der Route; der vorhandene deutsche Bildalternativtext wurde entsprechend dem begrenzten Auftrag unverändert belassen. Prüfergebnisse stehen in `TASKS.md`.

## Freigegebene EN-/IT-Texte: Feiern-Section

**Status:** `FREIGEGEBEN` durch ausdrückliches Nutzer-GO am 02.11.2026 nach Vorlage der folgenden Textentwürfe. Ein separates anschließendes GO autorisiert deren Dokumentation. Keine technische Integration oder Veröffentlichung. Die Nutzerfreigabe wird dokumentiert; eine zusätzliche externe Sprachprüfung wird nicht behauptet.

| Inhalt | Englisch (`en`) | Italienisch (`it`) |
|---|---|---|
| Abschnittstitel | Celebrations at Colosseo | Eventi al Colosseo |
| Überschrift | A table for the people who matter to you. | Un tavolo per le persone a cui tieni. |
| Fließtext | Please contact us directly to enquire about private events, weddings and catering. | Per eventi privati, matrimoni e catering, contattateci direttamente. |
| Aktion | Enquire about a celebration | Richiedi informazioni per un evento |
| Bildalternativtext | Guests raising a toast over an Italian meal. | Ospiti che brindano durante un pasto italiano. |

Diese Freigabe umfasst ausschließlich die fünf vorgelegten Texte je Sprache. Die Bestätigung der angebotenen Leistungen bleibt vom Übersetzungsstatus getrennt; es werden keine neuen Geschäftsfakten oder Kontaktwege freigegeben. Der deutsche Ausgangstext bleibt unverändert. Nach separater Vorstellung des Integrationsplans und Nutzer-GO am 02.11.2026 sind die fünf Texte je Sprache in `app/content/notte-locales.ts` eingebunden und werden entsprechend der Route an die Feiern-Section übergeben. Der deutsche Ausgangstext und das Anfrageziel bleiben erhalten. Weitere Inhaltsbereiche und vollständige EN-/IT-Lokalisierung bleiben offen.
