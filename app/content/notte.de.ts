export const notteImages = {
  heroPoster: "/images/pizza-concept.png",
  interior: "/images/colosseo/interior-dining-room.webp",
  menu: "/images/pasta-craft-concept.png",
  events: "/images/colosseo/events-dinner.png",
} as const;

export const notteContent = {
  navigation: {
    brandEyebrow: "Ristorante",
    brandName: "Colosseo",
    menu: "Speisekarte",
    events: "Feiern",
    contact: "Kontakt",
    reserve: "Reservieren",
  },
  hero: {
    eyebrow: "Una sera al Colosseo",
    title: "Ein Abend, der länger bleiben darf.",
    reserve: "Tisch reservieren",
    menu: "Speisekarte entdecken",
  },
  welcome: {
    title: "Liebe Gäste und Amici",
    body: "Herzlich willkommen in unserem italienischen Restaurant. Bei uns dreht sich alles um gute, ehrliche Küche ohne viel Schnickschnack – einfach, frisch und köstlich.",
    signature: "Buon Appetito!",
    imageAlt: "Gastraum des Ristorante Colosseo mit gedeckten Tischen und Bar",
  },
  menu: {
    eyebrow: "Aus unserer Speisekarte",
    title: "Tre piatti. Una cucina.",
    open: "Speisekarte ansehen",
    imageAlt: "Frische Pasta wird von Hand zubereitet",
  },
  family: {
    title: "Familienbetrieb seit über 30 Jahren.",
    body: "Mit frischen Zutaten und ausgewählten Rezepten möchten wir Ihnen die Aromen Italiens näherbringen. Ob bei einem gemütlichen Mittagessen oder einem entspannten Abendessen – wir freuen uns darauf, Sie bei uns begrüßen zu dürfen.",
  },
  events: {
    eyebrow: "Feiern im Colosseo",
    title: "Ein Tisch für die Menschen, die Ihnen wichtig sind.",
    body: "Private Veranstaltungen, Hochzeiten und Catering können persönlich angefragt werden.",
    action: "Feier anfragen",
    imageAlt: "Gäste stoßen bei einem italienischen Abendessen miteinander an",
  },
  reviews: {
    title: "Was Gäste über uns sagen.",
    summary: "aus 438 Google-Rezensionen",
    link: "Alle Bewertungen bei Google",
    date: "Stand: 22. Oktober 2026",
  },
  reservation: {
    eyebrow: "Reservierung",
    title: "Ihr Tisch im Ristorante Colosseo.",
    body: "Reservieren Sie Ihren Tisch telefonisch. Wir freuen uns auf Ihren Besuch.",
    action: "04171 62952 anrufen",
  },
  visit: {
    hours: "Öffnungszeiten",
    contact: "Kontakt & Anfahrt",
    addressLine1: "Bahnhofstraße 42–45",
    addressLine2: "21423 Winsen (Luhe)",
    phone: "04171 62952",
    route: "Route öffnen",
    mapTitle: "Standort in Google Maps",
    payment: "Barzahlung und EC-Karte",
    imageAlt: "Eingang des Ristorante Colosseo in der Bahnhofstraße",
  },
  footer: {
    statement: "Italienische Küche, frisch zubereitet.",
    menu: "Speisekarte",
    restaurant: "Restaurant",
    events: "Feiern",
    reviews: "Bewertungen",
    languages: "Sprachen",
  },
} as const;

export const menuDishes = [
  { category: "ANTIPASTI FREDDI", name: "MOZZARELLA CAPRESE", description: "Tomaten, Mozzarella und Basilikum", price: "10,50 €", image: "/images/colosseo/caprese.webp" },
  { category: "PASTA / TEIGWAREN", name: "PENNE ALLA SICILIANA", description: "Makkaroni mit Tomatensahnesauce, Paprika und Auberginen", price: "12,50 €", image: "/images/colosseo/pasta-verdure.webp" },
  { category: "PIZZA / PIZZA", name: "PIZZA MARGHERITA", description: "mit Tomatensauce und Käse", price: "9,50 €", image: "/images/colosseo/pizza-margherita.webp" },
] as const;

export const googleReviews = [
  { author: "Heiko Simon", quote: "Bester Italiener", rating: 5, date: "vor 4 Monaten" },
  { author: "Roger Stehr", quote: "Jederzeit wieder", rating: 4, date: "vor 3 Monaten" },
  { author: "FoodReview", quote: "Preis-Leistungs-Verhältnis", rating: 4, date: "vor einem Jahr" },
  { author: "Jens Schmiggelmeister", quote: "Herzlich … und familiär", rating: 5, date: "vor 8 Monaten" },
  { author: "B T", quote: "Excelente Pizza", rating: 5, date: "vor 10 Monaten" },
  { author: "Nicola Decker", quote: "Aufmerksamer Service", rating: 5, date: "vor 5 Monaten" },
  { author: "Nico Niklas", quote: "Service spitze", rating: 5, date: "vor 7 Monaten" },
  { author: "Annette Kemna", quote: "Klein und gemütlich", rating: 5, date: "vor 10 Monaten" },
  { author: "Frank Borde", quote: "Service war top", rating: 5, date: "vor 9 Monaten" },
  { author: "Carsten Hardt", quote: "Rundum zufrieden", rating: 5, date: "vor 11 Monaten" },
  { author: "Christian Dierken", quote: "Typisch italienisch", rating: 5, date: "vor einem Jahr" },
  { author: "Edda Hoffmann-Wernich", quote: "Sehr lecker", rating: 5, date: "vor 8 Monaten" },
] as const;

export const openingHours = [
  ["Montag", "Ruhetag"],
  ["Dienstag–Freitag", "12–14 · 17–21 Uhr"],
  ["Samstag", "17–21 Uhr"],
  ["Sonntag", "12–14 · 17–21 Uhr"],
] as const;

export const notteLinks = {
  phone: "tel:+49417162952",
  events: "mailto:ristorante.colosseo@googlemail.com",
  route: "https://www.google.com/maps/search/?api=1&query=Bahnhofstra%C3%9Fe+42-45%2C+21423+Winsen+Luhe",
  reviews: "https://www.google.com/maps/place/Ristorante+Colosseo/@53.357921,10.2062523,17z/data=!4m6!3m5!1s0x47b1ebc69cc21a87:0x62d2a0b8594cb06f!8m2!3d53.357921!4d10.2062523!16s%2Fg%2F1tf2r8p4",
} as const;
