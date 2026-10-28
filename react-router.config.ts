import type { Config } from "@react-router/dev/config";

const paths = [
  "/de",
  "/de/speisekarte",
  "/de/restaurant",
  "/de/feiern",
  "/de/kontakt",
  "/en",
  "/en/menu",
  "/en/restaurant",
  "/en/events",
  "/en/contact",
  "/it",
  "/it/menu",
  "/it/ristorante",
  "/it/eventi",
  "/it/contatti"
];

export default {
  ssr: false,
  prerender: paths,
} satisfies Config;
