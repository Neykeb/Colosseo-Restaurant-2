import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { siteContent } from "~/content/site-content";

const resources = Object.fromEntries(
  Object.entries(siteContent).map(([locale, translation]) => [locale, { translation }]),
);

void i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "de",
  supportedLngs: ["de", "en", "it"],
  interpolation: { escapeValue: false },
  returnObjects: true,
});

export default i18n;
