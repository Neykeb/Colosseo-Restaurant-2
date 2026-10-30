import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  useParams,
} from "@tanstack/react-router";
import { isLocale, siteContent, getPageKey, type Locale, type PageKey } from "~/content/site-content";
import { NottePrototype } from "~/prototypes/colosseo/prototype-variants";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import { ColosseoPrototypesPage } from "~/components/colosseo-prototypes-page";
import { Link } from "@tanstack/react-router";
import "~/prototypes/colosseo/prototypes.css";
import "~/i18n/config";
import "~/styles/app.css";

function RootLayout() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => { throw redirect({ to: "/$lang", params: { lang: "de" }, search: {} }); },
});

const prototypeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/prototypes/colosseo",
  component: PrototypesRoute,
});

const localizedIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$lang/",
  component: SiteRoute,
});

const localizedPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/$lang/$page",
  component: SiteRoute,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  prototypeRoute,
  localizedIndexRoute,
  localizedPageRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function getRouteData(lang: string, page?: string): { locale: Locale; pageKey: PageKey } {
  if (!isLocale(lang)) throw new Error("Not found");
  const pageKey = getPageKey(lang, page);
  if (!pageKey) throw new Error("Not found");
  return { locale: lang, pageKey };
}

function SiteRoute() {
  const { lang, page } = useParams({ strict: false });
  if (!lang) throw new Error("Not found");
  const { locale, pageKey } = getRouteData(lang, page);
  const copy = siteContent[locale];

  if (pageKey === "home") {
    return <main className="prototype-stage" id="main-content"><NottePrototype locale={locale} /></main>;
  }

  return (
    <div className="app-shell" lang={locale}>
      <SiteHeader callLabel={copy.common.call} locale={locale} menuCloseLabel={copy.common.menuClose} menuOpenLabel={copy.common.menuOpen} nav={copy.nav} pageKey={pageKey} reserveLabel={copy.common.reserve} />
      <ContentPage copy={copy.pages[pageKey]} locale={locale} pageKey={pageKey} reserveLabel={copy.common.reserve} />
      <SiteFooter locale={locale} nav={copy.nav} pageKey={pageKey} reserveLabel={copy.common.reserve} />
    </div>
  );
}

function ContentPage({ copy, locale, pageKey, reserveLabel }: { copy: { title: string; intro: string; sections: Array<{ title: string; body: string }> }; locale: Locale; pageKey: Exclude<PageKey, "home">; reserveLabel: string }) {
  const image = pageKey === "menu" ? "/images/pizza-concept.png" : pageKey === "events" ? "/images/gathering-concept.png" : pageKey === "restaurant" ? "/images/pasta-craft-concept.png" : "/images/hero-kitchen-concept.png";
  return (
    <main className="content-page" id="main-content">
      <section className="content-hero"><div><h1>{copy.title}</h1><p>{copy.intro}</p></div><img alt="Konzeptbild für diese Seite" src={image} /></section>
      <section className="content-grid">{copy.sections.map((section) => <article key={section.title}><h2>{section.title}</h2><p>{section.body}</p></article>)}</section>
      <section className="content-action"><h2>{reserveLabel}</h2><span className="button button-primary button-disabled" aria-disabled="true">{reserveLabel}</span><Link className="text-link" to="/$lang" params={{ lang: locale }} search={{}}>Ristorante Colosseo</Link></section>
    </main>
  );
}

function PrototypesRoute() {
  return <ColosseoPrototypesPage />;
}

function NotFound() {
  return <main className="not-found" id="main-content"><p>404</p><h1>Diese Seite gibt es nicht.</h1><Link className="button button-primary" to="/$lang" params={{ lang: "de" }} search={{}}>Zur Startseite</Link></main>;
}

export type AppRouteTree = typeof routeTree;
