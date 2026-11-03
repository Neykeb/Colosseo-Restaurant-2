# Designsystem

**Status:** Phase 2 - freigegeben  
**Letzte Aktualisierung:** 27.10.2026

Diese Datei ist die einzige verbindliche Quelle für visuelle Tokens, Typografie, Farben, Abstände, Raster, Breakpoints, Komponentenvarianten, Medienverhältnisse, Zustände und Motion-Regeln. Sämtliche Festlegungen sind bis Gate 2 `VORSCHLAG`.

## 1. Creative Direction

**Design Read:** Hochwertige Restaurant-Website für Gäste ab 30, mit sinnlicher, editorialer und selbstbewusster Bildsprache. Sie übernimmt den Qualitätsanspruch und den großzügigen Medienrhythmus der Referenz, übersetzt ihn aber eigenständig in moderne italienische Gastlichkeit.

Arbeitstitel der Richtung: **Materia Italiana**.

Die Gestaltung soll nicht mit rot-weiß-grünen Klischees, rustikaler Trattoria-Dekoration oder künstlichem Luxus arbeiten. Der Kern ist Materialität: Mehlstaub, Teig, Tomate, Olivenöl, Dampf, Hände und echte Küchenarbeit. Die Website wirkt ruhig, präzise und appetitlich. Sie zeigt, dass Einfachheit nur dann hochwertig ist, wenn Zutaten und Handwerk stimmen.

### Design-Regler

- `DESIGN_VARIANCE: 7` - asymmetrische Editorial-Kompositionen mit kontrollierter Ordnung.
- `MOTION_INTENSITY: 6` - spürbare, filmische Übergänge ohne Showeffekte oder Scroll-Zwang.
- `VISUAL_DENSITY: 3` - große Medien, kurze Texte und viel Raum.

### Leitprinzipien

1. Essen und Zubereitung tragen die visuelle Erzählung.
2. Jede Seite führt klar zur Reservierung, ohne den Inhalt zu überdecken.
3. Wenige, große Aussagen ersetzen kleinteilige Kartenraster.
4. Asymmetrie gilt ab Tablet; mobil wird jede Komposition klar einspaltig.
5. Animation erklärt Hierarchie, Übergang oder Reaktion. Reine Dekoration entfällt.

## 2. Farbkonzept

Die Palette nutzt Mineralweiß und fast schwarzes Anthrazit als Bühne. Tomatenrot ist der einzige Akzent. Oliven-, Kräuter- und Holzfarben dürfen in der Fotografie vorkommen, werden aber nicht als UI-Akzente eingesetzt.

| Token | Hell | Dunkel | Verwendung |
|---|---:|---:|---|
| `--color-bg` | `#F1F2EC` | `#151815` | Seitenfläche |
| `--color-surface` | `#E5E7DF` | `#202420` | abgesetzte Flächen, Navigation |
| `--color-text` | `#181B18` | `#F0F1EB` | Haupttext |
| `--color-text-muted` | `#555D55` | `#B8BDB5` | Sekundärtext |
| `--color-accent` | `#C43D2F` | `#E05A4C` | primäre CTA, aktive Zustände |
| `--color-accent-contrast` | `#FFF8F2` | `#151815` | Text auf Akzent |
| `--color-border` | `#C9CDC4` | `#3B413B` | funktionale Trennungen |
| `--color-error` | `#A52C2C` | `#FF8A80` | Fehler |
| `--color-success` | `#2F6A47` | `#77C995` | Erfolgsmeldungen |
| `--color-focus` | `#1E65D6` | `#79A9FF` | sichtbarer Tastaturfokus |

Vor Umsetzung sind alle Text-, Button-, Formular- und Fokuskontraste gegen WCAG 2.2 AA zu messen. Der helle und der dunkle Satz bilden zwei vollständige Seitenthemen; innerhalb einer Seite wechseln Sektionen nicht willkürlich zwischen beiden. Standardmodus bleibt `OFFEN` und wird bei Gate 2 entschieden.

## 3. Typografie

### Familien

Die am 26.10.2026 ausdrücklich freigegebene Typografiekombination aus Variante A gilt auch für die produktive Website und ersetzt die bisherige Geist-/Bodoni-Lösung:

- `Instrument Serif`, Gewicht 400 normal und kursiv: H1 bis H3, redaktionelle Zitate, hervorgehobene Preise und Zahlen sowie die Signatur **„Buon Appetito!“**.
- `DM Sans`, Gewichte 400, 500 und 600: Fließtext, Navigation, Buttons, Labels, Kategorien, Bildunterschriften, Kontakt- und Zeitangaben.
- Beide Familien werden über Fontsource lokal ausgeliefert; zur Laufzeit werden keine Google-Fonts-Anfragen ausgeführt.
- Display-Überschriften verwenden `letter-spacing: -0.035em`; kursive italienische Akzente bleiben in `Instrument Serif Italic`.

Diese ausdrückliche Nutzerentscheidung ersetzt die frühere deterministische Geist-Auswahl aus dem initialen `gpt-taste`-Plan. Die übrigen Skill- und Designregeln bleiben bestehen.

### Responsive Skala

| Rolle | Klein | Mittel | Groß | Zeilenhöhe |
|---|---:|---:|---:|---:|
| Display XL | 48 px | 72 px | 104 px | 0,92-0,98 |
| H1 | 42 px | 64 px | 80 px | 0,96-1,02 |
| H2 | 34 px | 48 px | 64 px | 1,00-1,06 |
| H3 | 26 px | 32 px | 40 px | 1,08-1,15 |
| Lead | 20 px | 22 px | 24 px | 1,35 |
| Body | 16 px | 17 px | 18 px | 1,6 |
| Small | 14 px | 14 px | 15 px | 1,45 |
| Label | 12 px | 12 px | 13 px | 1,2 |

- Headlines verwenden normale Schreibweise statt flächendeckender Versalien.
- UI-Labels können mit moderater Laufweite in Versalien stehen, maximal einmal pro drei Sektionen als Eyebrow.
- Fließtexte bleiben auf maximal 65 Zeichen pro Zeile begrenzt.
- Der Hero-Titel hat auf Desktop höchstens zwei Zeilen; auf Mobil höchstens vier kurze Zeilen.

## 4. Layout und Spacing

### Raster

- Maximalbreite: `1440px`.
- Desktop: 12 Spalten, 24 px Gutter, 48-72 px Außenabstand.
- Tablet: 8 Spalten, 20 px Gutter, 32 px Außenabstand.
- Mobil: 4 Spalten, 16 px Gutter und Außenabstand.
- Breakpoints: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

### Spacing-Skala

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160` px.

- Abschnittsabstand: mobil 72-96 px, Desktop 112-160 px.
- Navigation: 64 px mobil, maximal 76 px Desktop.
- Full-height-Bereiche verwenden `min-height: 100dvh`, niemals `100vh`.
- Asymmetrische Raster kollabieren unter 768 px zu einer klaren Einzelspalte.

## 5. Form und Oberfläche

- Grundsystem: überwiegend scharfkantig.
- Interaktive Controls: 4 px Radius.
- Medien und Inhaltsflächen: 0 px Radius.
- Pills werden nur für den Sprachumschalter verwendet, nicht als allgemeiner Dekorationsstil.
- Schatten dienen ausschließlich schwebender Navigation oder Dialogen und bleiben weich sowie farblich an die Oberfläche angepasst.
- Karten werden vermieden. Gruppierung erfolgt primär über Raum, Bildformat und wenige funktionale Linien.

## 6. Komponentenregeln

### Header

- Desktop: Logo links, kompakte Hauptnavigation mittig/rechts, primäre Aktion „Tisch reservieren“ als klarer Abschluss.
- Die Navigation der freigegebenen Notte-Variante liegt am Seitenanfang breit und transparent. Nach unten fährt sie nach der festgelegten Hysterese aus dem Viewport; bei bewusstem Aufwärtsscrollen kehrt sie als kompakte Glasnavigation zurück.
- Unter 900 px bleibt die Hauptnavigation als kompakte, horizontal erreichbare zweite Zeile sichtbar; Navigationspunkte dürfen nicht ersatzlos ausgeblendet werden.
- Mobil: Logo, Reservierungsaktion und zugänglicher Menüschalter in einer Zeile.
- Über Medien erhält der Header eine ausreichend deckende oder weich hinterlegte Fläche. Lesbarkeit darf nicht vom Foto abhängen.
- Der Header bleibt maximal 76 px hoch und zeigt Desktop-Navigation einzeilig.

### Buttons und Links

- Primär: Akzentfläche, kontrastreicher Text, 48-56 px Höhe.
- Sekundär: textlicher Link mit Unterstreichung oder Pfeil aus einer später festgelegten Icon-Familie.
- Labels bleiben kurz und einzeilig: „Tisch reservieren“, „Speisekarte“, „Feier anfragen“.
- `:hover` verändert Farbe und verschiebt den Inhalt maximal 2 px. `:active` skaliert auf 0,98.
- Fokus: 2 px sichtbarer Ring plus 2 px Offset.
- Eine Aktion behält überall dieselbe Bezeichnung.

### Formulare

- Labels stehen immer oberhalb der Eingabe; Placeholder ersetzen kein Label.
- Hilfe unterhalb des Labels, Fehler direkt unterhalb des Feldes.
- Eingabehöhe mindestens 48 px, Touch-Ziel mindestens 44 x 44 px.
- Lade-, Erfolgs- und Fehlerzustand müssen vollständig gestaltet werden.

### Sprachumschalter

- Sichtbare Kürzel `DE`, `EN`, `IT` mit ausgeschriebenem zugänglichem Namen.
- Aktive Sprache wird nicht nur über Farbe vermittelt.
- Wechsel erhält die inhaltlich entsprechende Route, sofern verfügbar.

## 7. Medien und Art Direction

### Bildverhältnisse

- Hero: Desktop 16:9 oder breiter, mobil separat 4:5 oder 9:16.
- Gerichte und Zubereitung: 4:5 und 3:2.
- Raum/Atmosphäre: 16:9 und 3:2.
- Veranstaltungsbereich: 4:5 mit genügend negativer Fläche für angrenzenden Text, nie Text als Bildoverlay ohne Scrim.

### Motivregeln

- echte Hände, sichtbare Arbeit und natürliche Unordnung
- gerichtetes Seitenlicht, kontrollierte Schatten, keine übertriebene HDR-Schärfe
- Zutaten erkennbar und plausibel, Speisen nicht künstlich überladen
- verschiedene Distanzen: Makro, Halbnah und räumlicher Kontext
- keine generierten Personen oder Räume als reale Dokumentation ausgeben

Das vollständige Inventar und die Inhaltszuordnung stehen in `CONTENT.md`.

## 8. Motion-System

### Tokens

| Token | Wert | Einsatz |
|---|---:|---|
| `--motion-fast` | 160 ms | Hover, Fokus, kleine Rückmeldung |
| `--motion-base` | 320 ms | Menü, Sprachwechsel, Controls |
| `--motion-slow` | 700 ms | Bild- und Abschnittsreveal |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | natürliche Verzögerung |
| `--ease-emphasis` | `cubic-bezier(0.16, 1, 0.3, 1)` | Hero und große Übergänge |

### Vorgeschlagene Muster

1. Hero-Einstieg: Medienblende plus gestaffeltes Einblenden von Titel und CTA. Zweck: Hierarchie.
2. Bild-Reveal: Clip-Maskierung beim erstmaligen Eintritt. Zweck: Abschnittswechsel und Materialität.
3. Text-Reveal: kurze Zeilen oder Blöcke mit Opacity und maximal 24 px Y-Versatz. Zweck: Leseführung.
4. Menü: deckender Fullscreen-Reveal auf Mobil. Zweck: klarer Zustandswechsel.
5. Speisekarten-Vorschau: horizontales Drag/Swipe nur als direkte Interaktion, kein automatischer Dauerlauf.
6. CTA-Feedback: dezente Verschiebung und Press-State. Zweck: Bedienrückmeldung.

Kein Scroll-Jacking. Keine endlosen Marquees. Parallax bleibt auf ein langsames Hintergrundmotiv begrenzt, falls der Performance-Test dies zulässt.

### Reduced Motion

- Bei `prefers-reduced-motion: reduce` entfallen Parallax, Maskenfahrten und gestaffelte Bewegung.
- Inhalte erscheinen sofort und bleiben vollständig zugänglich.
- Video-Hero wird durch ein optimiertes Poster ersetzt oder pausiert, abhängig von der späteren technischen Spezifikation.

### Verbindliches Mobile-Lite-Profil

- Auf Geräten mit grobem primärem Zeiger sowie unter `768 px` werden Lenis, GSAP-Scroll-Pinning, Video-Scrubbing, Parallax, buchstabenweise Textwechsel und dauerhafte Marquees nicht initialisiert. Die Inhaltsreihenfolge und alle Aktionen bleiben unverändert verfügbar.
- Der Hero verwendet ein lokales, leichtes WebP-Poster und native Dokumentbewegung. Die Navigation ist eine kompakte 64-px-Zeile mit zugänglichem Menüschalter, Telefonaktion, Safe-Area-Abständen und mindestens 44 × 44 px großen Touchzielen.
- Inhaltssections verwenden `min-height` beziehungsweise inhaltsabhängige Höhe statt fester `svh`-Höhen, wenn Textvergrößerung oder schmale Viewports sonst Inhalte abschneiden könnten.
- Die Speisekartenvorschau wird mobil als lineare Liste aus drei Bild-/Textblöcken ausgegeben. Bewertungen verwenden native horizontale Scrollflächen mit Scroll-Snap statt automatischer Bewegung.
- Einmalige dekorative Section-Reveals entfallen mobil. Zustandsbewegungen wie das Öffnen der Navigation bleiben auf Transform und Opacity, höchstens `180 ms`, begrenzt.

### Deutsche Hauptseite „Notte“: scrollgesteuerter Pizza-Hero

- Der bereitgestellte Pizza-Clip ist ein dekoratives Hero-Medium ohne Autoplay oder Ton.
- GSAP ScrollTrigger bindet die Videozeit linear an den Scroll-Fortschritt: abwärts zerlegt sich die Pizza, aufwärts läuft derselbe Ablauf reversibel zurück.
- Der Hero bleibt für die Dauer der Sequenz gepinnt; die Strecke beträgt mobil `240dvh` und ab Tablet `300dvh`. Ein kurzer Scrub-Nachlauf von `0,22 s` glättet die reversible Videozuordnung. Lenis liefert auf Wheel-Geräten die freigegebene Scroll-Trägheit; Touch bleibt nativ. Lenis und ScrollTrigger laufen über denselben GSAP-Ticker.
- Video-Seeks werden mit `requestVideoFrameCallback` an die tatsächlich dekodierten Frames gekoppelt. So überholt der Scroll-Thread den Videodecoder nicht mit mehreren ausstehenden Suchpositionen.
- Im letzten Viewport der gepinnten Hero-Sequenz schiebt sich die Intro-Section als eigenständige Ebene von unten über den Hero. Der Reveal nutzt ausschließlich eine lineare, scrollgebundene Y-Transformation mit `0,32 s` Scrub-Nachlauf; ein statischer, weicher Schatten trennt die Ebenen ohne zusätzlichen Paint pro Frame.
- Bei Reduced Motion entfällt auch der Layer-Overlap vollständig; die Intro-Section folgt dem Hero im normalen Dokumentfluss.
- Der Text bleibt linksbündig auf einer abgedunkelten Bildzone, während die Pizza visuell in der rechten Hälfte wirken kann.
- Bei `prefers-reduced-motion: reduce` entfallen Pinning und Scrubbing vollständig; das vorhandene Pizza-Poster ersetzt das Video.
- Diese Regeln gelten für die deutsche Hauptseite unter `/de`; der Design-Explorer unter `/prototypes/colosseo` bleibt eine getrennte Entwicklungsansicht.

### Deutsche Hauptseite „Notte“: Begrüßungssection

- Die zweite Section verwendet einen asymmetrischen Split aus realem Innenraumfoto und Begrüßungstext; mobil steht das Bild oberhalb des Textes.
- Das Foto bleibt quadratisch, erhält einen subtilen transformbasierten Scale-Reveal und wird bei Reduced Motion ohne Bewegung dargestellt.
- Die Signaturfarbe `#D89478` ist ausschließlich „Buon Appetito!“ zugeordnet und wird nicht als allgemeiner CTA- oder UI-Akzent verwendet.
- Das lokale WebP wird unterhalb der Falz lazy geladen, asynchron dekodiert und über feste Abmessungen sowie `sizes` ohne Layoutsprung reserviert.

### Deutsche Hauptseite „Notte“: Familiengeschichte

- Die kompakte Familiengeschichte folgt erst nach der Speisekarten-Vorschau, damit Begrüßung und Herkunft nicht als zwei aufeinanderfolgende Textkapitel erscheinen.
- Das reale Eingangsfoto füllt die gesamte, exakt `70svh` hohe Section und wird durch einen zweistufigen dunklen Scrim für ausreichend Textkontrast beruhigt. Die frühere dekorative `30+`-Zahl und der helle Split entfallen.
- Überschrift und Fließtext liegen als kompakter redaktioneller Block direkt auf dem Motiv. Die maskierten Überschriftwörter erscheinen einmalig im Abstand von 55 ms; der Fließtext folgt mit maximal 24 px Y-Versatz.
- Das Hintergrundbild bewegt sich scrollgebunden langsam von `yPercent -5` auf `5` und skaliert von `1,10` auf `1,03`. Familiengeschichte und Anlass-Section liegen in einem gemeinsamen, isolierten Übergangscontainer: Die Story bleibt nur innerhalb dieses Containers bei `top: 0` sticky, während der Anlass darüberläuft, und verlässt danach mit dem Container vollständig den Viewport.
- Reduced Motion und Mobile-Lite entfernen Parallax und Sticky-Overlap. Auf kleinen Viewports wächst die Section mit ihrem Inhalt und besitzt keine feste Maximalhöhe.

### Deutsche Hauptseite „Notte“: Google-Bewertungen

- Die Vertrauenssection ist auf Desktop exakt `50svh` hoch und folgt der Familiengeschichte. Mobil wächst sie mit dem Inhalt. Sie nutzt eine dunkle Fläche, eine kompakte Aggregatbewertung und horizontal erreichbare Originalauszüge.
- Zwölf verifizierte Stimmen laufen in zwei horizontalen Reihen mit `36 s` beziehungsweise `40 s` linear und in entgegengesetzter Richtung. Eine nur visuell duplizierte, `aria-hidden` gesetzte Kopie erzeugt den nahtlosen Loop; die zugängliche Inhaltsliste enthält jede Stimme genau einmal.
- Hover und Tastaturfokus pausieren beide Reihen. Es gibt kein Pinning und keinen GSAP-Ticker; die kompositorische Bewegung läuft als GPU-freundliche CSS-Transformation.
- Einzelwertungen erscheinen als `★★★★★` beziehungsweise `★★★★☆` und besitzen einen zugänglichen Namen wie „4 von 5 Sternen“.
- Reduced Motion stoppt beide Reihen, entfernt die visuellen Duplikate und macht die Originalreihen horizontal scrollbar.
- Auf kleinen Viewports entfallen beide Dauerläufe und die visuellen Duplikate; die Originalkarten sind nativ horizontal scrollbar und rasten dezent ein.

### Deutsche Hauptseite „Notte“: Reservierungsabschluss

- Der fokussierte Reservierungsabschluss folgt direkt nach den Bewertungen und bildet die Action-Stufe der Startseite. Ein heller, warmer Fond setzt ihn als ruhige typografische Zäsur von der dunklen Vertrauenssection ab.
- Das Desktop-Raster umfasst zwölf vollständig belegte Spalten: Die Überschrift nutzt Spalten 1–7, Text und Telefonaktion Spalten 9–12; die Einleitung besetzt Spalten 1–3. Unter 900 px folgt alles in einer linearen Einzelspalte.
- Die bestätigte Telefonnummer ist die einzige aktive Reservierungsaktion, solange der externe Dienst `OFFEN` ist. Der CTA besitzt mindestens 52 px Höhe, sichtbaren Tastaturfokus und einen nur für präzise Zeiger aktivierten Farbwechsel.
- Beim erstmaligen Eintritt zeichnet sich die horizontale Regel per `scaleX` auf; anschließend erscheinen Begleittext und CTA mit maximal 24 px Y-Versatz. Die maskierten Überschriftwörter nutzen den bestehenden scrollgebundenen Reveal. Alle Bewegungen verwenden ausschließlich Transform und Opacity, erzeugen keine zusätzliche Scrollstrecke und entfallen bei Reduced Motion.
- Die Section ist auf mindestens `54svh` verdichtet. Zusätzliche Dekoration oder nicht belegte Reservierungsversprechen entfallen; die typografische Hierarchie, der kurze Erklärungstext und die bestätigte Telefonaktion füllen die zwölf Spalten ohne künstlichen Leerraum.

### Deutsche Hauptseite „Notte“: Feiern und besondere Anlässe

- Die bilddominante Zweiteilung bleibt ein eigenständiges Kapitel: Text und Anfrageaktion links, festlich gedeckter Tisch rechts; mobil werden beide Flächen linear gestapelt.
- Beim erstmaligen Eintritt wächst das Bild von `scale 0,94` auf seine natürliche Größe und blendet von `opacity 0,45` ein. Label, Fließtext und Anfrageaktion folgen mit 70 ms Abstand und maximal 24 px Y-Versatz; die Überschrift behält den bestehenden scrollgebundenen Wort-Reveal.
- Die Animation verwendet nur Transform und Opacity, läuft einmal ohne Pinning und entfällt bei Reduced Motion vollständig.

### Deutsche Hauptseite „Notte“: Besuchsabschluss

- Der kompakte Besuchsabschluss kombiniert Adresse und direkte Kontaktaktionen mit bestätigungsbedürftigen Öffnungszeiten und einem klar gekennzeichneten externen Google-Maps-Link. Das Eingangsfoto ist der Familiengeschichte zugeordnet und wird hier nicht redundant wiederholt.
- Eine automatisch ladende Drittanbieterkarte entfällt aus Datenschutz- und Performancegründen. Der Kartenbereich ist eine lokale, gestalterische Linkfläche und lädt Google Maps erst nach bewusster Aktivierung.
- Kontakt- und Detailspalte erscheinen einmalig mit maximal 24 px Y-Versatz. Reduced Motion zeigt beide Bereiche sofort und ohne Transformation.
- Unter 900 px werden Foto und Informationen gestapelt; beide behalten mindestens `68svh`, ohne horizontales Überlaufen.

### Scrollinitialisierung

- Ein vollständiges Laden oder Neuladen der deutschen Notte-Startseite beginnt immer am Dokumentanfang, bevor ScrollTrigger seine Pin-Strecken berechnet.
- Die native Browser-Scrollwiederherstellung wird für die Lebensdauer der Seite auf `manual` gesetzt. Zusätzlich wird der interne ScrollTrigger-Speicher vor dem Aufbau der Pin-Strecken geleert und die Position nach dem ersten `ScrollTrigger.refresh()` erneut auf `0` synchronisiert. Bei einem Reload wird ein vorhandener Fragmentanker entfernt, damit keine nachträgliche Ankernavigation die Seite erneut in eine gepinnte Section verschiebt.
- Der Reset erfolgt unmittelbar und ohne Animation; reguläre Ankerklicks innerhalb der bereits geladenen Seite bleiben funktionsfähig.

### Globale Navigation und Eintrittsbewegung

- Am Dokumentanfang liegt die Hauptnavigation transparent und randlos über die gesamte Seitenbreite; Logo und Reservierungsaktion stehen an den äußeren Rasterkanten. Erst nach 72 px Scrollstrecke verdichtet sie sich zur vorhandenen zentrierten Glasnavigation.
- Kleine Scrollimpulse ändern den Sichtzustand nicht: Abwärts sind kumuliert 96 px bis zum Ausblenden erforderlich, aufwärts 72 px bis zur Rückkehr. Breite, Höhe, Innenabstand, Position und Weichzeichnung morphen über 560 ms; die reine Y-Fahrt verwendet 460 ms. Beide Zustände behalten denselben horizontalen Mittelpunkt, damit kein seitlicher Sprung entsteht.
- Die Hauptnavigation enthält „Speisekarte“, „Feiern“ und „Kontakt“. „Restaurant“ entfällt als redundanter Sprung zur bereits direkt folgenden Begrüßung.
- Im Hero ist „Tisch reservieren“ die gefüllte Primäraktion; „Speisekarte entdecken“ bleibt als unterstrichener Sekundärlink.
- Der Seiteneinstieg staffelt Hero-Titel, Begleittext und Aktionen mit Transform und Opacity. Jede weitere Inhaltssection besitzt entweder ihre bestehende einmalige Choreografie oder einen einmaligen generischen Reveal mit 24 px Y-Versatz, 800 ms Dauer und 80 ms Staffelung. Lenis verwendet `duration: 1,05`, exponentielles Ease-out und `wheelMultiplier: 0,9`; Fullscreen-Menü und Reduced Motion umgehen die Glättung. Native Ankernavigation bleibt sanft.

### Deutsche Hauptseite „Notte“: Sticky-Editorial-Speisekarte

- Die Bühne verwendet eine durchgehende cremefarbene Fläche `#EEE5D7` ohne visuelle Trennung der beiden Spalten.
- Desktop bleibt ein ruhiges 50/50-Raster: Ein kleines quadratisches Gerichtsfoto steht mittig in der linken Hälfte, während Kategorie, Originalpreis, Gerichtname und Kurzbeschreibung mittig in der rechten Hälfte erscheinen. Großzügige Negativfläche ist Teil der Komposition.
- Der Gerichtname wechselt buchstabenweise mit einer vertikalen, unterbrechbaren Motion-Transition. Jedes Foto durchquert scrollgebunden die vollständige Section-Höhe: Es kommt mit einem responsiven Offscreen-Abstand von `96–150 px` vollständig hinter dem unteren Sectionrand hervor, erreicht denselben vertikalen Rastpunkt wie der zugehörige Text und verlässt die Section vollständig über den oberen Rand. Eine kurze scrollgebundene Ruhephase von `0,32` Timeline-Einheiten hält jedes Bild am Rastpunkt; dadurch beginnt das erste Bild beim Section-Eintritt bereits korrekt ausgerichtet. Beim Aufwärtsscrollen läuft dieselbe Strecke exakt rückwärts. Der Textzustand wechselt erst am erreichten Rastpunkt, nicht während der Durchfahrt. Die Section selbst maskiert den Überlauf; Transform bleibt die einzige bewegte Eigenschaft.
- Mobil und bei Reduced Motion entfallen Pinning, Buchstabenwechsel und Offscreen-Fahrten. Alle drei Gerichte stehen als eigenständige Bild-/Textblöcke vollständig im normalen Dokumentfluss.

- Desktop und Tablet verwenden eine zweispaltige Editorial-Komposition mit einem einzigen, unverändert sichtbaren Food-Foto links und einer vertikalen Auswahl verifizierter Gerichte rechts.
- GSAP ScrollTrigger pinnt die gesamte Section für die Dauer der Sequenz. Ausschließlich die rechte Gerichtsspur bewegt sich scrub-gebunden nach oben; erst nach dem letzten Gericht wird das Pinning freigegeben. Beim Hochscrollen läuft die Sequenz reversibel zurück.
- Gerichtname, Originalbeschreibung und Preis bilden die Hierarchie; dekorative Trennlinien zwischen Gerichten entfallen vollständig.
- Mobil wird dieselbe gepinnte Bühne als Bild-über-Text-Komposition dargestellt; weiterhin bewegt sich nur die Gerichtsspur.
- Bei Reduced Motion entfällt das Pinning. Das einzelne Foto und alle Gerichte folgen statisch im normalen Dokumentfluss.

### Deutsche Hauptseite „Notte“: Vollbild-Speisekarte

- Der Dialog übernimmt die dunkle Notte-Fläche und helle Editorial-Typografie. Originalüberschriften, Gerichte und Preise werden kompakt über Raum und dezente Flächen statt dekorativer Trennlinien gegliedert.
- Die Filterleiste bleibt am oberen Rand sticky und ist auf schmalen Viewports horizontal scrollbar. Der aktive Filter ist zusätzlich zur Farbe unterstrichen; Schließen-Controls besitzen mindestens 48 × 48 px Touchfläche.
- Der Einstieg nutzt eine vertikale Transform-Bewegung mit `0,36 s`; das Schließen verwendet einen kürzeren Rücklauf mit `0,28 s`.
- Reduced Motion entfernt die Transformfahrt vollständig. Der Inhalt ist sofort sichtbar; Öffnen, Schließen und Kategoriennavigation bleiben funktional.
- Gerichte besitzen keinen Hover- oder Klickzustand und öffnen keine weitere Ebene. Sämtliche Informationen stehen direkt im kompakten Listeneintrag.
- Lange Gerichtsnamen umbrechen ausschließlich an natürlichen Wortgrenzen. Preis und Gerichtsnummer bleiben ungekürzt und nicht umbrechend; fehlende Beschreibungen erzeugen keine Leerzeile.

## 9. Accessibility-Zustände

- Maus-, Tastatur-, Touch- und Screenreader-Bedienung werden gleichwertig geplant.
- Hover ist niemals der einzige Informationsträger.
- Aktive Zustände nutzen mindestens zwei Signale, zum Beispiel Farbe plus Unterstreichung.
- Medien benötigen passende Alternativtexte oder leere Alternativtexte, wenn rein dekorativ.
- Navigationsdialog und Formulare erhalten korrektes Fokusmanagement.
- Mindestkontraste: 4,5:1 für normalen Text, 3:1 für große Schrift und grafische UI-Elemente.

## 10. Offene Entscheidungen

- `OFFEN` Prüfung des vorhandenen Logos gegen die vorgeschlagene Palette und Typografie.
- `OFFEN` helles, dunkles oder systemabhängiges Standardthema.
- `OFFEN` deterministische Font-Auswahl im verpflichtenden `gpt-taste`-Designplan sowie Lizenz- und Zeichensatzprüfung.
- `OFFEN` reales oder generiertes Bildmaterial und Produktionsbudget.
- `OFFEN` genaue Icon-Familie; Entscheidung erst bei technischer Spezifikation.

## Gate

Dieses Designsystem wurde am 10.10.2026 durch „okay weiter“ freigegeben. Offene Punkte bleiben ausdrücklich offen und werden vor ihrer Umsetzung aufgelöst.
