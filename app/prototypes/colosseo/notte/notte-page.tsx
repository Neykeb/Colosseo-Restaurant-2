import type { RefObject } from "react";
import { useLayoutEffect, useRef, useState } from "react";

import { notteIntroContent } from "~/content/notte-locales";

import { FullMenuOverlay } from "~/components/full-menu-overlay";

import { EventsSection, FamilyStorySection, HeroSection, MenuPreviewSection, NotteFooter, NotteNavigation, ReservationSection, ReviewsSection, VisitSection, WelcomeSection } from "./organisms";

export function NottePage({ locale, rootRef }: { locale: "de" | "en" | "it"; rootRef: RefObject<HTMLDivElement | null> }) {
  const content = notteIntroContent[locale];
  const [fullMenuOpen, setFullMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const closeFullMenu = () => {
    setFullMenuOpen(false);
    requestAnimationFrame(() => menuTriggerRef.current?.focus());
  };

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const resetScroll = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    window.history.scrollRestoration = "manual";
    if (navigation?.type === "reload" && window.location.hash) {
      window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    }
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    window.addEventListener("pageshow", resetScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", resetScroll);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return <div className="variant notte" id="top" ref={rootRef}>
    <NotteNavigation content={content.navigation} />
    <HeroSection content={content.hero} />
    <WelcomeSection content={content.welcome} />
    <MenuPreviewSection onOpenMenu={() => setFullMenuOpen(true)} triggerRef={menuTriggerRef} />
    <div className="no-family-transition">
      <FamilyStorySection content={content.family} />
      <EventsSection content={content.events} />
    </div>
    <ReviewsSection />
    <ReservationSection />
    <VisitSection />
    <NotteFooter locale={locale} />
    <FullMenuOverlay onClose={closeFullMenu} open={fullMenuOpen} />
  </div>;
}
