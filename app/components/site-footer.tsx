import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { locales, pathFor, type Locale, type PageKey } from "~/content/site-content";

type Props = {
  locale: Locale;
  pageKey: PageKey;
  reserveLabel: string;
  nav: Record<PageKey, string>;
};

export function SiteFooter({ locale, pageKey, reserveLabel, nav }: Props) {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <p>Ristorante Colosseo</p>
        <h2>{reserveLabel}</h2>
        <span className="button button-light button-disabled" aria-disabled="true">
          {reserveLabel}
          <ArrowUpRight aria-hidden="true" size={19} />
        </span>
      </div>
      <div className="footer-grid">
        <div>
          <strong>Ristorante Colosseo</strong>
          <p>Pizza, Pasta und italienische Küche.</p>
        </div>
        <nav aria-label="Footer Navigation">
          {(Object.keys(nav) as PageKey[]).map((page) => (
            <Link key={page} to={pathFor(locale, page)}>{nav[page]}</Link>
          ))}
        </nav>
        <div className="footer-languages" aria-label="Sprache wählen">
          {locales.map((nextLocale) => (
            <Link
              aria-current={nextLocale === locale ? "page" : undefined}
              key={nextLocale}
              to={pathFor(nextLocale, pageKey)}
            >
              {nextLocale.toUpperCase()}
            </Link>
          ))}
        </div>
        <div>
          <p>Musterstraße 1</p>
          <p>12345 Musterstadt</p>
          <p>+49 000 00000000</p>
        </div>
      </div>
      <p className="footer-note">Konzeptstand. Geschäftsdaten und Rechtsangaben werden ersetzt.</p>
    </footer>
  );
}
