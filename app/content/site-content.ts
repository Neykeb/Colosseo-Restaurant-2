export const locales = ["de", "en", "it"] as const;
export type Locale = (typeof locales)[number];
export type PageKey = "home" | "menu" | "restaurant" | "events" | "contact";

type SiteCopy = {
  languageName: string;
  nav: Record<PageKey, string>;
  common: {
    reserve: string;
    call: string;
    menu: string;
    eventInquiry: string;
    externalHint: string;
    conceptNotice: string;
    placeholderNotice: string;
    menuOpen: string;
    menuClose: string;
    skipLink: string;
  };
  home: {
    title: string;
    description: string;
    heroTitle: string;
    heroBody: string;
    craftTitle: string;
    craftBody: string;
    ingredients: string[];
    menuTitle: string;
    menuBody: string;
    menuItems: Array<{ title: string; body: string }>;
    kitchenTitle: string;
    kitchenBody: string;
    atmosphereTitle: string;
    atmosphereBody: string;
    eventsTitle: string;
    eventsBody: string;
    visitTitle: string;
    reserveTitle: string;
    reserveBody: string;
  };
  pages: Record<Exclude<PageKey, "home">, {
    title: string;
    intro: string;
    sections: Array<{ title: string; body: string }>;
  }>;
};

export const siteContent: Record<Locale, SiteCopy> = {
  de: {
    languageName: "Deutsch",
    nav: { home: "Start", menu: "Speisekarte", restaurant: "Restaurant", events: "Feiern", contact: "Kontakt" },
    common: {
      reserve: "Tisch reservieren",
      call: "Anrufen",
      menu: "Speisekarte",
      eventInquiry: "Feier anfragen",
      externalHint: "Öffnet einen externen Dienst",
      conceptNotice: "Konzeptbilder, keine Aufnahmen des realen Restaurants",
      placeholderNotice: "Die folgenden Kontaktdaten sind Platzhalter und werden vor Veröffentlichung ersetzt.",
      menuOpen: "Menü öffnen",
      menuClose: "Menü schließen",
      skipLink: "Zum Inhalt springen",
    },
    home: {
      title: "Italienische Küche, frisch zubereitet",
      description: "Ristorante Colosseo: Pizza, Pasta und italienische Küche aus einfachen, frischen Zutaten.",
      heroTitle: "Italien beginnt in unserer Küche.",
      heroBody: "Pizza, Pasta und ehrliche italienische Küche. Frisch zubereitet aus einfachen Zutaten.",
      craftTitle: "Einfach in den Zutaten. Sorgfältig in der Zubereitung.",
      craftBody: "Wir machen unsere Küche selbst. Mit Zeit, Aufmerksamkeit und Zutaten, die nicht mehr sein wollen, als sie sind.",
      ingredients: ["Teig", "Tomate", "Olivenöl", "Zeit", "Handwerk", "Gemeinsam essen"],
      menuTitle: "Was auf den Tisch kommt.",
      menuBody: "Die vollständige Karte folgt mit den echten Gerichten und Preisen. Diese Auswahl zeigt die geplante Struktur.",
      menuItems: [
        { title: "Pizza", body: "Knuspriger Rand, gute Tomaten und eine Küche, die dem Teig Zeit gibt." },
        { title: "Pasta", body: "Klassische Formen, einfache Saucen und frisch zubereitete Grundlagen." },
        { title: "Italienische Küche", body: "Vorspeisen, Hauptgerichte und Desserts werden ergänzt, sobald die reale Karte vorliegt." },
      ],
      kitchenTitle: "Handarbeit, die man schmeckt.",
      kitchenBody: "Nicht die Menge der Zutaten entscheidet, sondern was in der Küche mit ihnen geschieht.",
      atmosphereTitle: "Zeit für einen guten Tisch.",
      atmosphereBody: "Das Ristorante Colosseo soll ein Ort für lange Gespräche, gemeinsame Teller und einen entspannten Abend sein.",
      eventsTitle: "Gemeinsam feiern, italienisch genießen.",
      eventsBody: "Feiern und Veranstaltungen können angefragt werden. Kapazitäten und konkrete Möglichkeiten werden ergänzt.",
      visitTitle: "Besuch planen.",
      reserveTitle: "Ihr Tisch im Ristorante Colosseo.",
      reserveBody: "Reservieren Sie später über den externen Dienst oder rufen Sie uns direkt an.",
    },
    pages: {
      menu: {
        title: "Die Speisekarte",
        intro: "Pizza, Pasta und italienische Gerichte. Die echten Gerichte, Preise und Allergene werden noch ergänzt.",
        sections: [
          { title: "Pizza", body: "Gerichte und Preise sind noch offen." },
          { title: "Pasta", body: "Gerichte und Preise sind noch offen." },
          { title: "Weitere Gerichte", body: "Vorspeisen, Hauptgerichte und Desserts folgen mit der realen Speisekarte." },
        ],
      },
      restaurant: {
        title: "Unser Restaurant",
        intro: "Italienische Küche, frisch im Haus zubereitet. Die reale Geschichte des Ristorante Colosseo wird noch ergänzt.",
        sections: [
          { title: "Unsere Küche", body: "Einfache Zutaten, sorgfältige Zubereitung und Gerichte, die ihren Ursprung nicht verstecken." },
          { title: "Unser Anspruch", body: "Frische entsteht nicht durch große Worte, sondern durch tägliche Arbeit in der Küche." },
        ],
      },
      events: {
        title: "Feiern im Colosseo",
        intro: "Private Feiern und Veranstaltungen können angefragt werden. Reale Kapazitäten und Pakete sind noch offen.",
        sections: [
          { title: "Ihr Anlass", body: "Geburtstag, Familienessen oder gemeinsamer Abend. Wir klären die Möglichkeiten persönlich." },
          { title: "Anfrage", body: "Der endgültige externe Anfrageweg wird noch ergänzt." },
        ],
      },
      contact: {
        title: "Kontakt und Anfahrt",
        intro: "Adresse, Telefon, Öffnungszeiten und Anfahrt sind derzeit provisorisch angegeben.",
        sections: [
          { title: "Adresse", body: "Musterstraße 1, 12345 Musterstadt" },
          { title: "Öffnungszeiten", body: "Dienstag bis Sonntag, 17:00 bis 23:00 Uhr. Montag Ruhetag." },
          { title: "Kontakt", body: "+49 000 00000000, ciao@example.com" },
        ],
      },
    },
  },
  en: {
    languageName: "English",
    nav: { home: "Home", menu: "Menu", restaurant: "Restaurant", events: "Events", contact: "Contact" },
    common: {
      reserve: "Reserve a table",
      call: "Call us",
      menu: "View menu",
      eventInquiry: "Plan an event",
      externalHint: "Opens an external service",
      conceptNotice: "Concept imagery, not photographs of the actual restaurant",
      placeholderNotice: "The following contact details are placeholders and will be replaced before publication.",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      skipLink: "Skip to content",
    },
    home: {
      title: "Freshly prepared Italian food",
      description: "Ristorante Colosseo: pizza, pasta and Italian cooking made with simple, fresh ingredients.",
      heroTitle: "Italy begins in our kitchen.",
      heroBody: "Pizza, pasta and honest Italian cooking. Freshly prepared with simple ingredients.",
      craftTitle: "Simple ingredients. Careful preparation.",
      craftBody: "We prepare our food in-house, with time, attention and ingredients that are allowed to speak for themselves.",
      ingredients: ["Dough", "Tomato", "Olive oil", "Time", "Craft", "Eating together"],
      menuTitle: "What comes to the table.",
      menuBody: "The full menu will follow with confirmed dishes and prices. This selection shows the planned structure.",
      menuItems: [
        { title: "Pizza", body: "A crisp crust, good tomatoes and dough given the time it needs." },
        { title: "Pasta", body: "Classic shapes, simple sauces and foundations prepared in-house." },
        { title: "Italian cooking", body: "Starters, mains and desserts will be added when the real menu is available." },
      ],
      kitchenTitle: "Craft you can taste.",
      kitchenBody: "It is not the number of ingredients that matters, but what happens to them in the kitchen.",
      atmosphereTitle: "Make time for a good table.",
      atmosphereBody: "Ristorante Colosseo is intended as a place for long conversations, shared plates and an unhurried evening.",
      eventsTitle: "Celebrate together, eat Italian.",
      eventsBody: "Private celebrations and events can be requested. Capacity and specific options will be added later.",
      visitTitle: "Plan your visit.",
      reserveTitle: "Your table at Ristorante Colosseo.",
      reserveBody: "Reserve later through the external service or call us directly.",
    },
    pages: {
      menu: { title: "The menu", intro: "Pizza, pasta and Italian dishes. Confirmed dishes, prices and allergens are still to come.", sections: [
        { title: "Pizza", body: "Dishes and prices are still open." },
        { title: "Pasta", body: "Dishes and prices are still open." },
        { title: "More Italian dishes", body: "Starters, mains and desserts will follow with the confirmed menu." },
      ] },
      restaurant: { title: "Our restaurant", intro: "Italian food prepared fresh in-house. The real story of Ristorante Colosseo will be added later.", sections: [
        { title: "Our kitchen", body: "Simple ingredients, careful preparation and dishes that stay close to their origins." },
        { title: "Our approach", body: "Freshness comes from daily work in the kitchen, not from big claims." },
      ] },
      events: { title: "Events at Colosseo", intro: "Private celebrations and events can be requested. Real capacities and packages are still open.", sections: [
        { title: "Your occasion", body: "A birthday, family meal or evening together. We discuss the possibilities personally." },
        { title: "Enquiry", body: "The final external enquiry channel will be added later." },
      ] },
      contact: { title: "Contact and directions", intro: "The address, phone number, hours and directions are currently provisional.", sections: [
        { title: "Address", body: "Musterstrasse 1, 12345 Musterstadt" },
        { title: "Opening hours", body: "Tuesday to Sunday, 5 pm to 11 pm. Closed Monday." },
        { title: "Contact", body: "+49 000 00000000, ciao@example.com" },
      ] },
    },
  },
  it: {
    languageName: "Italiano",
    nav: { home: "Home", menu: "Menu", restaurant: "Ristorante", events: "Eventi", contact: "Contatti" },
    common: {
      reserve: "Prenota un tavolo",
      call: "Chiama",
      menu: "Vedi il menu",
      eventInquiry: "Richiedi un evento",
      externalHint: "Apre un servizio esterno",
      conceptNotice: "Immagini concettuali, non fotografie del ristorante reale",
      placeholderNotice: "I seguenti dati di contatto sono provvisori e saranno sostituiti prima della pubblicazione.",
      menuOpen: "Apri il menu",
      menuClose: "Chiudi il menu",
      skipLink: "Vai al contenuto",
    },
    home: {
      title: "Cucina italiana preparata al momento",
      description: "Ristorante Colosseo: pizza, pasta e cucina italiana con ingredienti semplici e freschi.",
      heroTitle: "L'Italia comincia nella nostra cucina.",
      heroBody: "Pizza, pasta e cucina italiana sincera. Preparata al momento con ingredienti semplici.",
      craftTitle: "Ingredienti semplici. Preparazione attenta.",
      craftBody: "Prepariamo tutto nella nostra cucina, con tempo, attenzione e ingredienti liberi di raccontarsi.",
      ingredients: ["Impasto", "Pomodoro", "Olio d'oliva", "Tempo", "Mestiere", "Stare a tavola"],
      menuTitle: "Quello che arriva in tavola.",
      menuBody: "Il menu completo arriverà con piatti e prezzi confermati. Questa selezione mostra la struttura prevista.",
      menuItems: [
        { title: "Pizza", body: "Bordo croccante, buoni pomodori e un impasto a cui diamo il tempo necessario." },
        { title: "Pasta", body: "Formati classici, sughi semplici e preparazioni fatte nella nostra cucina." },
        { title: "Cucina italiana", body: "Antipasti, secondi e dolci saranno aggiunti quando il menu reale sarà disponibile." },
      ],
      kitchenTitle: "Il lavoro delle mani si sente.",
      kitchenBody: "Non conta il numero degli ingredienti, ma ciò che succede loro in cucina.",
      atmosphereTitle: "Tempo per una buona tavola.",
      atmosphereBody: "Il Ristorante Colosseo vuole essere un luogo per conversazioni lunghe, piatti condivisi e serate senza fretta.",
      eventsTitle: "Festeggiare insieme, mangiare italiano.",
      eventsBody: "È possibile richiedere feste ed eventi. Capienza e proposte specifiche saranno aggiunte in seguito.",
      visitTitle: "Organizza la visita.",
      reserveTitle: "Il tuo tavolo al Ristorante Colosseo.",
      reserveBody: "Prenota in seguito tramite il servizio esterno oppure chiamaci direttamente.",
    },
    pages: {
      menu: { title: "Il menu", intro: "Pizza, pasta e piatti italiani. Piatti, prezzi e allergeni confermati saranno aggiunti.", sections: [
        { title: "Pizza", body: "Piatti e prezzi sono ancora da definire." },
        { title: "Pasta", body: "Piatti e prezzi sono ancora da definire." },
        { title: "Altri piatti italiani", body: "Antipasti, secondi e dolci seguiranno con il menu confermato." },
      ] },
      restaurant: { title: "Il nostro ristorante", intro: "Cucina italiana preparata fresca. La vera storia del Ristorante Colosseo sarà aggiunta in seguito.", sections: [
        { title: "La nostra cucina", body: "Ingredienti semplici, preparazione attenta e piatti fedeli alle proprie origini." },
        { title: "Il nostro impegno", body: "La freschezza nasce dal lavoro quotidiano in cucina, non dalle grandi parole." },
      ] },
      events: { title: "Eventi al Colosseo", intro: "È possibile richiedere feste private ed eventi. Capienza e proposte reali sono ancora da definire.", sections: [
        { title: "La tua occasione", body: "Compleanno, pranzo in famiglia o serata insieme. Valutiamo personalmente le possibilità." },
        { title: "Richiesta", body: "Il canale esterno definitivo sarà aggiunto in seguito." },
      ] },
      contact: { title: "Contatti e indicazioni", intro: "Indirizzo, telefono, orari e indicazioni sono attualmente provvisori.", sections: [
        { title: "Indirizzo", body: "Musterstrasse 1, 12345 Musterstadt" },
        { title: "Orari", body: "Da martedì a domenica, dalle 17:00 alle 23:00. Chiuso lunedì." },
        { title: "Contatti", body: "+49 000 00000000, ciao@example.com" },
      ] },
    },
  },
};

export const slugs: Record<Locale, Record<PageKey, string>> = {
  de: { home: "", menu: "speisekarte", restaurant: "restaurant", events: "feiern", contact: "kontakt" },
  en: { home: "", menu: "menu", restaurant: "restaurant", events: "events", contact: "contact" },
  it: { home: "", menu: "menu", restaurant: "ristorante", events: "eventi", contact: "contatti" },
};

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getPageKey(locale: Locale, page: string | undefined): PageKey | null {
  if (!page) return "home";
  return (Object.entries(slugs[locale]).find(([, slug]) => slug === page)?.[0] as PageKey | undefined) ?? null;
}

export function pathFor(locale: Locale, page: PageKey) {
  const slug = slugs[locale][page];
  return `/${locale}${slug ? `/${slug}` : ""}`;
}
