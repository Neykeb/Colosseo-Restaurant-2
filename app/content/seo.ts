import { siteContent, type Locale, type PageKey } from "./site-content";

const homeTitles: Record<Locale, string> = {
  de: "Ristorante Colosseo | Italienisches Restaurant in Winsen (Luhe)",
  en: "Ristorante Colosseo | Italian restaurant in Winsen (Luhe)",
  it: "Ristorante Colosseo | Ristorante italiano a Winsen (Luhe)",
};

const localeTags: Record<Locale, string> = {
  de: "de_DE",
  en: "en_GB",
  it: "it_IT",
};

export type RouteSeo = {
  title: string;
  description: string;
  localeTag: string;
};

export function getRouteSeo(locale: Locale, pageKey: PageKey): RouteSeo {
  const copy = siteContent[locale];

  if (pageKey === "home") {
    return {
      title: homeTitles[locale],
      description: copy.home.description,
      localeTag: localeTags[locale],
    };
  }

  const page = copy.pages[pageKey];
  return {
    title: `${page.title} | Ristorante Colosseo`,
    description: page.intro,
    localeTag: localeTags[locale],
  };
}

export function applyDocumentSeo(seo: RouteSeo): void {
  document.title = seo.title;
  setMeta("description", seo.description);
  setPropertyMeta("og:title", seo.title);
  setPropertyMeta("og:description", seo.description);
  setPropertyMeta("og:type", "website");
  setPropertyMeta("og:locale", seo.localeTag);
}

function setMeta(name: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.append(element);
  }
  element.content = content;
}

function setPropertyMeta(property: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.append(element);
  }
  element.content = content;
}
