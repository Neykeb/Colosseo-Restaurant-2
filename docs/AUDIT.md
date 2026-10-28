# Discovery- und Referenz-Audit

**Status:** Phase 1 - freigegeben  
**Letzte Aktualisierung:** 10.10.2026  
**Referenz:** <https://ballenacabo.com/>  
**Prüfumfang:** Startseite im echten Browser bei 1280 × 720 sowie 390 × 844; DOM-, Stylesheet- und Script-Inspektion. Unterseiten, vollständige Animations-Timelines und Performance-Messungen wurden noch nicht geprüft.

Diese Datei ist die verbindliche Quelle für verifizierte Beobachtungen zur Referenz und die davon getrennten Übertragungsmöglichkeiten. Sie definiert weder die künftige Marke noch freigegebene Gestaltungstokens.

## 1. Projektverständnis

### Bestätigte Angaben

- Projekt- und Markenname: **Ristorante Colosseo**.
- Branche: Gastronomie; italienisches Restaurant.
- Angebot: Pizza, Pasta und allgemein italienische Speisen.
- Qualitätsversprechen: Die Speisen werden in der eigenen Küche frisch und mit einfachen Zutaten zubereitet.
- Zielgruppe: Menschen ab etwa 30 Jahren, die italienisches Essen und frische Zutaten schätzen. Eine feinere Segmentierung ist noch offen.
- Sprachen: Deutsch, Englisch und Italienisch.
- Eine bestehende Marke und ein Logo sind vorhanden. Konkrete Logo-Dateien und Nutzungsvarianten liegen im Projekt noch nicht vor.
- Farben, Schriften und Bildmaterial sind nicht vorhanden und sollen später eigenständig entwickelt bzw. beschafft werden. Die Referenz darf dabei als Qualitäts- und Prinzipieninspiration dienen, nicht als Vorlage zum Kopieren.
- Reale Adresse, Kontakt, Öffnungszeiten und Rechtsangaben werden später geliefert. Bis dahin hat der Nutzer ausdrücklich klar gekennzeichnete Platzhalter erlaubt.

### Noch nicht bekannt

- Primäres Conversion-Ziel: Tischreservierung über einen externen Reservierungsdienst oder telefonisch. Welcher externe Dienst verwendet wird, ist noch `OFFEN`.
- `OFFEN` genauer Pflichtumfang der Seiten und Funktionen
- `OFFEN` Standardsprache der Website
- `OFFEN` Logo-Datei, Varianten, Schutzraum und sonstige Markenregeln
- `OFFEN` reale Adresse, Kontakt-, Öffnungs- und Rechtsangaben
- `OFFEN` Hosting, Domain, CMS-/Pflegebedarf und Integrationen
- `OFFEN` redaktionelle Verantwortung für Texte und Übersetzungen

## 2. Verifizierte Referenzbeobachtungen

### Visuelle Sprache

- Die Startseite eröffnet mit einem vollflächigen, atmosphärischen Video-Hero. Der große, links versetzte Versal-Titel liegt direkt auf dem Bewegtbild.
- Die Bildwelt arbeitet mit warmem, natürlichem Licht, kräftigen Schatten, sichtbarer Materialität und nahen gastronomischen bzw. architektonischen Motiven.
- Die Grundfläche ist ein warmes Off-White (`rgb(248, 242, 229)`); daneben wurden Schwarz, sehr helles Grünweiß und transparente dunkle Overlays beobachtet.
- Verifizierte Body- und Hero-Schrift ist `Sweet Sans Pro` mit System-Sans-Fallback. Der geprüfte Desktop-H1 ist circa 60,7 px groß, 400 gewichtet, mit circa 0,9 Zeilenhöhe und leichter Laufweite.
- Die Komposition ist editorial statt kartenbasiert: großzügige Freiflächen, wechselnde Text-/Bildblöcke, sehr große Bilder und markante Versalüberschriften.
- Das Logo sitzt mittig in einer schmalen transparenten Kopfzeile; links steht der primäre Buchungs-CTA, rechts das Menü.

### Informations- und Seitenrhythmus

Die beobachtete Startseite folgt diesem Rhythmus:

1. Video-Hero mit Positionierungssatz.
2. Intro aus Eyebrow, großer Aussage, Kurztext und Link.
3. Split-Block mit Food-Fotografie und Menü-Teaser.
4. Großes thematisches Intro zur Umgebung/Atmosphäre.
5. Bildstarker Slider zu Events, Galerie, Gutscheinen und Menü.
6. About-Teaser.
7. Kontakt, Öffnungszeiten und Adresse.
8. Umfangreicher Footer mit Navigation, Social/Gutscheinen, Newsletter und Rechtlichem.

Diese Reihenfolge ist eine Referenzbeobachtung und keine Empfehlung für das neue Projekt.

### Navigation und Conversion

- Der CTA „Book now“ bleibt prominent im Header.
- Die Hauptnavigation umfasst auf der Referenz Events, Menü, Galerie, Standort und About; ergänzend werden Instagram und Gutscheine angeboten.
- Conversion-Pfade werden wiederholt, bleiben textlich knapp und sind eng mit großformatigen Medien gekoppelt.
- Ein Newsletterformular und ein zeitgesteuertes Event-Popup wurden im DOM beobachtet. Das Popup überdeckte initial den Hero und stellt damit ein mögliches UX-Risiko dar.

Das primäre Conversion-Ziel des Ristorante Colosseo ist die **Tischreservierung**. Sie erfolgt über einen noch zu benennenden externen Reservierungsdienst und alternativ telefonisch; ein eigenes Reservierungsformular ist nicht vorgesehen. Unterstützende Ziele sind das Einsehen der Speisekarte sowie eine Anfrage für Feiern und Veranstaltungen. Eine Online-Bestellfunktion für Essen ist ausdrücklich nicht vorgesehen.

### Motion und Technik

- `VERIFIZIERT` Eingebunden sind GSAP 3.12.5, ScrollTrigger 3.12.5, Lenis 1.1.18 und Swiper 8.4.5.
- Der Hero verwendet bewegtes Bild; beim mobilen Scrollen wurden bild- und textbezogene Reveal-/Maskierungszustände sichtbar.
- Der Slider besitzt Vor-/Zurück-Steuerung und mehrere großformatige Medien-Slides.
- `ANNAHME` Sanftes Scrollen und scrollgebundene Übergänge werden über Lenis und GSAP koordiniert. Die genaue Timeline wurde noch nicht technisch nachverfolgt.
- `OFFEN` Verhalten bei `prefers-reduced-motion`, Tastaturbedienung des Sliders und Inhalte ohne JavaScript.

### Responsive Verhalten

- Bei 390 × 844 bleibt der Header kompakt mit CTA, zentriertem Logo und Hamburger-Menü.
- Der Hero füllt nahezu die gesamte mobile Höhe; die Überschrift bricht in vier kurze Zeilen um und behält starke visuelle Dominanz.
- Medien werden mobil aggressiv hochformatig zugeschnitten. Text- und Bildflächen werden gestapelt.
- Während eines mobilen Scrollzustands lag der große Introtext teilweise maskiert über einem Bildübergang. Das erzeugt Spannung, erhöht aber Anforderungen an Lesbarkeit und robuste Zwischenzustände.

## 3. Trennung von Inspiration und Übernahme

### Sinnvoll zu adaptierende Prinzipien

- Ein klarer, bildstarker Einstieg mit nur einer Kernbotschaft und einem primären CTA.
- Editorialer Rhythmus aus großen Medien, kurzen Texten und bewusst gesetzter Leere.
- Eine reduzierte Navigation mit konsistent wiederholtem Conversion-Pfad.
- Bewegungen, die Hierarchie, Übergang oder räumliche Tiefe erklären.
- Mobile Bildausschnitte als eigenständige Art Direction statt automatischer Desktop-Crops.

### Nicht zu übernehmen

- Referenztexte, Markenname, Logo, konkrete Seitennamen oder Geschäftsdaten.
- Proprietäre Bilder, Videos, Schriften oder genaue Kompositionen.
- Die Referenz-Sitemap ohne Nachweis der neuen Nutzer- und Geschäftsziele.
- Popup- oder Smooth-Scroll-Verhalten ohne Nutzen-, Accessibility- und Performance-Prüfung.

## 4. Vorläufige Designchancen

Die Phase-1-Richtung ist freigegeben. Ihre konkrete gestalterische Übersetzung bleibt bis zur Phase-2-Freigabe `VORSCHLAG`:

- Eine eigenständige visuelle Leitidee aus dem realen Charakter des neuen Unternehmens entwickeln, statt das Meer-/Wüste-Narrativ der Referenz zu imitieren.
- Das Versprechen „frisch in der eigenen Küche, aus einfachen Zutaten“ als glaubwürdigen inhaltlichen und visuellen Kern prüfen.
- Fotografie als primären Träger von Atmosphäre einsetzen. Da kein Bildmaterial vorliegt, müssen reale Shootings, lizenzierte Bilder, klar deklarierte generierte Motive oder temporäre Platzhalter in Phase 2 gegeneinander abgewogen werden.
- Die Startseite als klare Dramaturgie aus Versprechen, Angebot, Beleg, Atmosphäre und Conversion konzipieren.
- Hochwertige Motion auf wenige wiederverwendbare Muster reduzieren und mobile/reduzierte Varianten von Beginn an definieren.

## 5. Vorläufige Funktions- und Inhaltsbedarfe

Noch keine Funktion ist freigegeben. Zu klären sind:

- externer Reservierungsdienst und dessen technische Anbindung
- erforderliche Seiten und rechtliche Seiten
- Reservierungsfunktion sowie Anfrageweg für Feiern und Veranstaltungen
- Öffnungszeiten, Standort, Kontakt und Social-Kanäle
- Menü-/Leistungsdaten und deren Pflegeprozess
- Newsletter oder andere Marketing-Einwilligungen
- Standardsprache und redaktioneller Übersetzungsprozess für Deutsch, Englisch und Italienisch
- SEO-relevante Suchintentionen, Regionen und strukturierte Daten
- Bedarf an CMS, Analyse, Consent-Management und Drittanbieter-Einbettungen

## 6. Risiken

- Das Business-Briefing ist ausreichend für eine erste Positionierung, aber ohne Festlegung der Reservierungs- und Anfragewege, der übrigen Pflichtfunktionen und ohne Logo-Übergabe kann noch keine belastbare Sitemap oder kreative Richtung freigegeben werden.
- Ein Video-Hero kann LCP, Datenverbrauch und Barrierefreiheit belasten; Posterbild, Kompression, Ladepriorität und Reduced-Motion-Fallback sind zwingend zu planen.
- Lizenzpflichtige Referenzschriften oder -medien dürfen nicht stillschweigend übernommen werden.
- Smooth Scrolling und komplexe ScrollTrigger-Szenen erhöhen Test-, Performance- und Accessibility-Aufwand.
- Dreisprachigkeit vervielfacht Inhalts-, Metadaten- und QA-Aufwand.

## 7. Offene Fragen für den Abschluss von Phase 1

1. Welcher externe Reservierungsdienst wird verwendet, und wie lautet die spätere Ziel-URL?
2. Wie sollen Anfragen für Feiern und Veranstaltungen eingehen: telefonisch, per E-Mail, über ein externes System oder später über ein Formular?
3. Welche Seiten, Funktionen und externen Systeme sind darüber hinaus zwingend erforderlich?
4. Welche Sprache soll beim ersten Besuch standardmäßig erscheinen?
5. Wann kann die vorhandene Logo-Datei bereitgestellt werden, und existieren Varianten oder Nutzungsregeln?
6. Wer liefert bzw. genehmigt Texte und Übersetzungen?
7. Welche Domain, Hosting- und Pflegeanforderungen bestehen?
8. Gibt es einen verbindlichen Termin, Budgetrahmen oder technische Einschränkungen?
9. Welche Referenzmerkmale gefallen besonders, welche ausdrücklich nicht?

## 8. Gate

Die für eine kreative Konzeption wesentlichen Business-Grundlagen sind erfasst. Die verbleibenden offenen Angaben werden als klar markierte Abhängigkeiten weitergeführt. Phase 1 wurde am 10.10.2026 freigegeben; Details stehen im Freigabeprotokoll von `TASKS.md`.
