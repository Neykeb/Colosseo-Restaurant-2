import { notteContent } from "./notte.de";
import type { Locale } from "./site-content";

type TextFields<T> = { [Key in keyof T]: string };

export type NotteIntroCopy = {
  navigation: TextFields<typeof notteContent.navigation> & {
    label: string;
    open: string;
    close: string;
  };
  hero: TextFields<typeof notteContent.hero>;
  welcome: TextFields<typeof notteContent.welcome>;
  family: TextFields<typeof notteContent.family>;
  events: TextFields<typeof notteContent.events>;
};

// Only these approved sections are localized; remaining sections stay pending.
export const notteIntroContent: Record<Locale, NotteIntroCopy> = {
  de: {
    navigation: {
      ...notteContent.navigation,
      label: "Hauptnavigation",
      open: "Navigation öffnen",
      close: "Navigation schließen",
    },
    hero: notteContent.hero,
    welcome: notteContent.welcome,
    family: notteContent.family,
    events: notteContent.events,
  },
  en: {
    events: {
      eyebrow: "Celebrations at Colosseo",
      title: "A table for the people who matter to you.",
      body: "Please contact us directly to enquire about private events, weddings and catering.",
      action: "Enquire about a celebration",
      imageAlt: "Guests raising a toast over an Italian meal.",
    },
    family: {
      title: "Family-run for over 30 years.",
      body: "With fresh ingredients and carefully selected recipes, we hope to bring you the flavours of Italy. Whether you join us for a leisurely lunch or a relaxed dinner, we look forward to welcoming you.",
    },
    navigation: {
      brandEyebrow: "Ristorante",
      brandName: "Colosseo",
      menu: "Menu",
      events: "Celebrations",
      contact: "Contact",
      reserve: "Book a table",
      label: "Main navigation",
      open: "Open navigation",
      close: "Close navigation",
    },
    hero: {
      eyebrow: "Una sera al Colosseo",
      title: "An evening worth lingering over.",
      reserve: "Book a table",
      menu: "Explore the menu",
    },
    welcome: {
      title: "Dear guests and amici",
      body: "Welcome to our Italian restaurant. For us, it’s all about good, honest food without unnecessary fuss — simple, fresh and delicious.",
      signature: "Buon Appetito!",
      imageAlt: "Dining room at Ristorante Colosseo with set tables and a bar.",
    },
  },
  it: {
    events: {
      eyebrow: "Eventi al Colosseo",
      title: "Un tavolo per le persone a cui tieni.",
      body: "Per eventi privati, matrimoni e catering, contattateci direttamente.",
      action: "Richiedi informazioni per un evento",
      imageAlt: "Ospiti che brindano durante un pasto italiano.",
    },
    family: {
      title: "A gestione familiare da oltre 30 anni.",
      body: "Con ingredienti freschi e ricette selezionate, desideriamo farvi scoprire i sapori d’Italia. Che sia per un piacevole pranzo o una cena in tranquillità, saremo felici di accogliervi.",
    },
    navigation: {
      brandEyebrow: "Ristorante",
      brandName: "Colosseo",
      menu: "Menu",
      events: "Eventi",
      contact: "Contatti",
      reserve: "Prenota un tavolo",
      label: "Navigazione principale",
      open: "Apri la navigazione",
      close: "Chiudi la navigazione",
    },
    hero: {
      eyebrow: "Una sera al Colosseo",
      title: "Una serata da vivere senza fretta.",
      reserve: "Prenota un tavolo",
      menu: "Scopri il menu",
    },
    welcome: {
      title: "Cari ospiti e amici",
      body: "Benvenuti nel nostro ristorante italiano. Per noi conta la buona cucina, senza inutili fronzoli: semplice, fresca e gustosa.",
      signature: "Buon Appetito!",
      imageAlt: "Sala del Ristorante Colosseo con tavoli apparecchiati e bancone del bar.",
    },
  },
};
