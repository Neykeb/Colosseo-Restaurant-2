import {
  createRootRoute,
  createRoute,
  createRouter,
  notFound,
  Outlet,
  redirect,
  useParams,
} from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { isLocale, siteContent, getPageKey, type Locale, type PageKey } from "~/content/site-content";
import { applyDocumentSeo, getRouteSeo } from "~/content/seo";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@clerk/react";
import "~/prototypes/colosseo/prototypes.css";
import "~/i18n/config";
import "~/styles/app.css";

const NottePrototype = lazy(() => import("~/prototypes/colosseo/prototype-variants").then((module) => ({ default: module.NottePrototype })));
const ColosseoPrototypesPage = lazy(() => import("~/components/colosseo-prototypes-page").then((module) => ({ default: module.ColosseoPrototypesPage })));

function RoutePending() {
  return <div aria-busy="true" aria-label="Seite wird geladen" className="route-pending" role="status" />;
}

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

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminRoute,
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
  adminRoute,
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
  if (!isLocale(lang)) throw notFound();
  const pageKey = getPageKey(lang, page);
  if (!pageKey) throw notFound();
  return { locale: lang, pageKey };
}

function SiteRoute() {
  const { lang, page } = useParams({ strict: false });
  if (!lang) throw notFound();
  const { locale, pageKey } = getRouteData(lang, page);
  const copy = siteContent[locale];

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = locale;
    applyDocumentSeo(getRouteSeo(locale, pageKey));
    return () => { document.documentElement.lang = previousLanguage; };
  }, [locale, pageKey]);

  if (pageKey === "home") {
    return <main className="prototype-stage" id="main-content"><Suspense fallback={<RoutePending />}><NottePrototype locale={locale} /></Suspense></main>;
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
  return <Suspense fallback={<RoutePending />}><ColosseoPrototypesPage /></Suspense>;
}

function AdminRoute() {
  const { getToken, isLoaded, isSignedIn, userId } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "allowed" | "forbidden" | "error">("idle");
  const [profile, setProfile] = useState<{ displayName: string; role: string } | null>(null);
  useEffect(() => {
    if (!isLoaded || !isSignedIn) { setStatus("idle"); setProfile(null); return; }
    let cancelled = false;
    setStatus("loading");
    void (async () => {
      try {
        const token = await getToken();
        const response = await fetch("/api/admin/me", { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
        if (cancelled) return;
        if (response.status === 401 || response.status === 403) {
          const body = await response.json().catch(() => null) as { error?: { code?: string } } | null;
          if (body?.error?.code === "OWNER_CLERK_ID_MISMATCH" || body?.error?.code === "OWNER_PROFILE_LOOKUP_FAILED") setStatus("error");
          else setStatus("forbidden");
          return;
        }
        if (!response.ok) throw new Error("Adminprüfung fehlgeschlagen.");
        setProfile(await response.json() as { displayName: string; role: string });
        setStatus("allowed");
      } catch { if (!cancelled) setStatus("error"); }
    })();
    return () => { cancelled = true; };
  }, [getToken, isLoaded, isSignedIn]);
  if (!isLoaded) return <main className="admin-page" aria-busy="true"><p>Adminbereich wird geladen …</p></main>;
  if (!isSignedIn) return <main className="admin-page"><h1>Anmeldung erforderlich</h1><p>Bitte melde dich über den Admin-Button an.</p></main>;
  if (status === "loading") return <main className="admin-page" aria-busy="true"><p>Adminzugriff wird geprüft …</p></main>;
  if (status === "forbidden") return <main className="admin-page"><p className="eyebrow">Zugriff verweigert</p><h1>Kein Adminzugriff</h1><p>Dein Clerk-Konto ist nicht als aktives Adminprofil freigeschaltet.</p></main>;
  if (status === "error") return <main className="admin-page"><p className="eyebrow">Konfigurationsfehler</p><h1>Ownerzugriff konnte nicht bestätigt werden</h1><p>Die Clerk-ID stimmt mit der lokalen Konfiguration überein, aber der laufende Server findet kein aktives passendes Owner-Profil.</p>{import.meta.env.DEV && userId ? <p><small>Angemeldete Entwicklungs-ID: <code>{userId}</code></small></p> : null}</main>;
  if (status !== "allowed" || !profile) return <main className="admin-page" aria-busy="true"><p>Adminbereich wird vorbereitet …</p></main>;
  return <main className="admin-page"><p className="eyebrow">Geschützter Bereich</p><h1>Administration</h1><p>Willkommen, {profile.displayName}. Rolle: {profile.role}.</p></main>;
}

function NotFound() {
  return <main className="not-found" id="main-content"><p>404</p><h1>Diese Seite gibt es nicht.</h1><Link className="button button-primary" to="/$lang" params={{ lang: "de" }} search={{}}>Zur Startseite</Link></main>;
}

export type AppRouteTree = typeof routeTree;
