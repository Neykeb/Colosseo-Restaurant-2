import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";

import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import {
  getPageKey,
  isLocale,
  locales,
  pathFor,
  siteContent,
  type Locale,
  type PageKey,
} from "~/content/site-content";
import "~/i18n/config";
import { NottePrototype } from "~/prototypes/colosseo/prototype-variants";
import "~/prototypes/colosseo/prototypes.css";

type RouteData = { locale: Locale; pageKey: PageKey };

export function loader({ params }: LoaderFunctionArgs): RouteData {
  if (!isLocale(params.lang)) {
    throw new Response("Not found", { status: 404 });
  }
  const pageKey = getPageKey(params.lang, params.page);
  if (!pageKey) {
    throw new Response("Not found", { status: 404 });
  }
  return { locale: params.lang, pageKey };
}

export const meta: MetaFunction<typeof loader> = ({ loaderData }) => {
  if (!loaderData) return [{ title: "Ristorante Colosseo" }];
  const copy = siteContent[loaderData.locale];
  const title = loaderData.pageKey === "home" ? copy.home.title : copy.pages[loaderData.pageKey].title;
  const description = loaderData.pageKey === "home" ? copy.home.description : copy.pages[loaderData.pageKey].intro;
  const canonicalPath = pathFor(loaderData.locale, loaderData.pageKey);

  return [
    { title: `${title} | Ristorante Colosseo` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} | Ristorante Colosseo` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/images/hero-kitchen-concept.png" },
    { tagName: "link", rel: "canonical", href: canonicalPath },
    ...locales.map((locale) => ({
      tagName: "link" as const,
      rel: "alternate",
      hrefLang: locale,
      href: pathFor(locale, loaderData.pageKey),
    })),
  ];
};

export default function SiteRoute() {
  const { locale, pageKey } = useLoaderData<typeof loader>();
  const copy = siteContent[locale];

  if (pageKey === "home") {
    return <main className="prototype-stage" id="main-content"><NottePrototype locale={locale} /></main>;
  }

  return (
    <div className="app-shell" lang={locale}>
      <SiteHeader
        callLabel={copy.common.call}
        locale={locale}
        menuCloseLabel={copy.common.menuClose}
        menuOpenLabel={copy.common.menuOpen}
        nav={copy.nav}
        pageKey={pageKey}
        reserveLabel={copy.common.reserve}
      />

      <ContentPage copy={copy.pages[pageKey]} locale={locale} pageKey={pageKey} reserveLabel={copy.common.reserve} />

      <SiteFooter locale={locale} nav={copy.nav} pageKey={pageKey} reserveLabel={copy.common.reserve} />
    </div>
  );
}

function ContentPage({
  copy,
  locale,
  pageKey,
  reserveLabel,
}: {
  copy: { title: string; intro: string; sections: Array<{ title: string; body: string }> };
  locale: Locale;
  pageKey: Exclude<PageKey, "home">;
  reserveLabel: string;
}) {
  const image = pageKey === "menu"
    ? "/images/pizza-concept.png"
    : pageKey === "events"
      ? "/images/gathering-concept.png"
      : pageKey === "restaurant"
        ? "/images/pasta-craft-concept.png"
        : "/images/hero-kitchen-concept.png";

  return (
    <main className="content-page" id="main-content">
      <section className="content-hero">
        <div>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </div>
        <img alt="Konzeptbild für diese Seite" src={image} />
      </section>
      <section className="content-grid">
        {copy.sections.map((section) => (
          <article key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
      <section className="content-action">
        <h2>{reserveLabel}</h2>
        <span className="button button-primary button-disabled" aria-disabled="true">{reserveLabel}</span>
        <Link className="text-link" to={pathFor(locale, "home")}>Ristorante Colosseo</Link>
      </section>
    </main>
  );
}
