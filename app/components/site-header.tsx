import { List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  locales,
  pathFor,
  type Locale,
  type PageKey,
} from "~/content/site-content";
import { BrandMark } from "./ui/atoms/brand-mark";
import { HeaderActions } from "./ui/molecules/header-actions";

type Props = {
  locale: Locale;
  pageKey: PageKey;
  nav: Record<PageKey, string>;
  reserveLabel: string;
  callLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
};

const pages: PageKey[] = ["home", "menu", "restaurant", "events", "contact"];

export function SiteHeader({
  locale,
  pageKey,
  nav,
  reserveLabel,
  callLabel,
  menuOpenLabel,
  menuCloseLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="site-header">
      <BrandMark href={pathFor(locale, "home")} />

      <nav aria-label="Hauptnavigation" className="desktop-nav">
        {pages.map((page) => (
          <Link
            aria-current={page === pageKey ? "page" : undefined}
            key={page}
            to={pathFor(locale, page)}
          >
            {nav[page]}
          </Link>
        ))}
      </nav>

      <HeaderActions
        callLabel={callLabel}
        menuCloseLabel={menuCloseLabel}
        menuButtonRef={triggerRef}
        menuIcon={open ? <X aria-hidden="true" size={25} /> : <List aria-hidden="true" size={25} />}
        menuOpenLabel={menuOpenLabel}
        onMenuToggle={() => setOpen((value) => !value)}
        open={open}
        reserveLabel={reserveLabel}
      />

      {open ? (
        <div aria-label="Mobile Navigation" aria-modal="true" className="mobile-menu" ref={menuRef} role="dialog">
          <nav>
            {pages.map((page) => (
              <Link key={page} onClick={() => setOpen(false)} to={pathFor(locale, page)}>
                {nav[page]}
              </Link>
            ))}
          </nav>
          <div className="mobile-languages" aria-label="Sprache wählen">
            {locales.map((nextLocale) => (
              <Link
                aria-current={nextLocale === locale ? "page" : undefined}
                key={nextLocale}
                onClick={() => setOpen(false)}
                to={pathFor(nextLocale, pageKey)}
              >
                {nextLocale.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
