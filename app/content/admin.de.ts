export const adminCopy = {
  title: "Administration | Ristorante Colosseo",
  backToWebsite: "Zur Website",
  backToRestaurant: "Zur Restaurantseite",
  configuration: {
    kicker: "Administration nicht konfiguriert",
    title: "Der sichere Zugang ist lokal noch nicht eingerichtet.",
    body: "Trage den Clerk Publishable Key ausschließlich in deiner lokalen .env ein.",
  },
  signedOut: {
    kicker: "Geschützter Bereich",
    title: "Administration für das Colosseo.",
    body: "Dieser Zugang ist ausschließlich für den freigeschalteten Restaurantbesitzer bestimmt.",
    action: "Mit Google anmelden",
  },
  loading: { title: "Anmeldung wird geladen", body: "Der sichere Zugang wird vorbereitet." },
  checking: { title: "Berechtigung wird geprüft", body: "Dein Clerk-Konto wird mit dem internen Owner-Profil abgeglichen." },
  denied: { title: "Kein Adminzugriff", body: "Die Anmeldung war erfolgreich, aber dieses Konto ist nicht als aktiver Owner freigeschaltet." },
  unavailable: { title: "Prüfung momentan nicht möglich", body: "Der Server konnte die Berechtigung nicht bestätigen. Bitte versuche es später erneut." },
  authorized: {
    kicker: "Owner-Zugang bestätigt",
    greeting: (displayName: string) => `Willkommen, ${displayName}.`,
    body: "Das geschützte Grundlayout ist aktiv. Reservierungen, Speisekarte und Öffnungszeiten folgen in den jeweils freigegebenen Projektphasen.",
    modulesLabel: "Geplante Verwaltungsbereiche",
    modules: ["Reservierungen", "Speisekarte", "Öffnungszeiten"],
  },
  statusKicker: "Sicherheitsprüfung",
} as const;
