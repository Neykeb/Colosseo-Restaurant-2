import { ArrowDownRight, ArrowRight, List, MapPin, Phone, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "@tanstack/react-router";

import { TextRotate, type TextRotateRef } from "~/components/ui/text-rotate";
import { googleReviews, menuDishes, notteContent, notteImages, notteLinks, openingHours } from "~/content/notte.de";

import { MaskedWords } from "./atoms";
import { ReviewCard } from "./molecules";

export function NotteNavigation() {
  const content = notteContent.navigation;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return <header className="p-nav p-nav-dark no-site-nav">
    <a className="p-logo" href="#top"><small>{content.brandEyebrow}</small>{content.brandName}</a>
    <nav aria-label="Hauptnavigation" className={open ? "is-open" : undefined}><a href="#menu" onClick={() => setOpen(false)}>{content.menu}</a><a href="#events" onClick={() => setOpen(false)}>{content.events}</a><a href="#contact" onClick={() => setOpen(false)}>{content.contact}</a></nav>
    <button aria-expanded={open} aria-label={open ? "Navigation schließen" : "Navigation öffnen"} className="no-nav-toggle" onClick={() => setOpen((value) => !value)} type="button">{open ? <X size={22} /> : <List size={22} />}</button>
    <a className="p-nav-cta" href={notteLinks.phone}><Phone size={17} /> {content.reserve}</a>
  </header>;
}

export function HeroSection() {
  const content = notteContent.hero;
  return <section className="no-hero">
    <video className="no-hero-video" preload="metadata" muted playsInline poster={notteImages.heroPoster} aria-hidden="true" disablePictureInPicture>
      <source media="(hover: hover) and (pointer: fine) and (min-width: 768px)" src="/videos/pizza-scroll.mp4" type="video/mp4" />
    </video>
    <div className="no-wash" />
    <div className="no-copy" data-enter><p>{content.eyebrow}</p><h1><MaskedWords text={content.title} /></h1><div className="no-hero-actions"><a className="no-hero-primary" href="#action">{content.reserve}</a><a className="no-hero-link" href="#menu">{content.menu}</a></div></div>
    <ArrowDownRight className="no-arrow" size={42} />
  </section>;
}

export function WelcomeSection() {
  const content = notteContent.welcome;
  return <section className="no-intro" id="story">
    <figure className="no-intro-media"><img src={notteImages.interior} alt={content.imageAlt} width="960" height="960" sizes="(max-width: 900px) 88vw, 40vw" loading="lazy" decoding="async" /></figure>
    <div className="no-intro-copy"><h2 data-word-reveal><MaskedWords text={content.title} /></h2><p>{content.body}</p><p className="no-intro-signature">{content.signature}</p></div>
  </section>;
}

export function MenuPreviewSection({ onOpenMenu, triggerRef }: { onOpenMenu: () => void; triggerRef: RefObject<HTMLButtonElement | null> }) {
  const content = notteContent.menu;
  const [activeSlide, setActiveSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const textRotateRef = useRef<TextRotateRef>(null);
  const activeDish = menuDishes[activeSlide];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const syncSlide = (event: Event) => setActiveSlide((event as CustomEvent<number>).detail);
    section.addEventListener("colosseo:menu-slide", syncSlide);
    return () => section.removeEventListener("colosseo:menu-slide", syncSlide);
  }, []);

  useEffect(() => textRotateRef.current?.jumpTo(activeSlide), [activeSlide]);

  return <section className="no-menu-journey" id="menu" ref={sectionRef}>
    <div className="no-menu-sticky">
      <div className="no-menu-images" aria-hidden="true">
        {menuDishes.map((dish, index) => <img className={`no-menu-image${index === 0 ? " is-active" : ""}`} data-menu-image={index} key={dish.name} src={dish.image} alt="" loading="lazy" decoding="async" />)}
      </div>
      <div className="no-menu-heading"><p>{content.eyebrow}</p></div>
    </div>
    <div className="no-menu-display" aria-live="polite">
      <div className="no-menu-meta"><span>{activeDish.category}</span><strong>{activeDish.price}</strong></div>
      <h3><TextRotate auto={false} loop={false} mainClassName="no-menu-rotating-title" ref={textRotateRef} splitLevelClassName="overflow-hidden pb-[0.08em]" staggerDuration={0.012} texts={menuDishes.map((dish) => dish.name)} /></h3>
      <p>{activeDish.description}</p>
      {activeSlide === menuDishes.length - 1 && <button className="no-menu-source" onClick={onOpenMenu} ref={triggerRef} type="button">{content.open} <ArrowRight /></button>}
    </div>
    <div className="no-menu-panels" aria-hidden="true">{menuDishes.map((dish, index) => <article className="no-menu-panel" data-menu-index={index} key={dish.name} />)}</div>
    <div className="no-menu-mobile-list">
      <p className="no-menu-mobile-eyebrow">{content.eyebrow}</p>
      {menuDishes.map((dish) => <article className="no-menu-mobile-card" key={dish.name}>
        <img src={dish.image} alt="" width="480" height="480" loading="lazy" decoding="async" />
        <div><span>{dish.category}</span><strong>{dish.price}</strong><h3>{dish.name}</h3><p>{dish.description}</p></div>
      </article>)}
      <button className="no-menu-source" onClick={onOpenMenu} ref={triggerRef} type="button">{content.open} <ArrowRight /></button>
    </div>
  </section>;
}

export function FamilyStorySection() {
  const content = notteContent.family;
  return <section className="no-family" id="family" aria-labelledby="family-title">
    <img className="no-family-background" src="/images/colosseo/exterior-entrance.png" alt={notteContent.visit.imageAlt} width="1630" height="965" loading="lazy" decoding="async" />
    <div className="no-family-wash" aria-hidden="true" />
    <div className="no-family-copy"><h2 id="family-title"><MaskedWords text={content.title} /></h2><p>{content.body}</p></div>
  </section>;
}

export function EventsSection() {
  const content = notteContent.events;
  return <section className="no-events" id="events">
    <div><p className="no-events-support">{content.eyebrow}</p><h2 data-word-reveal><MaskedWords text={content.title} /></h2><p className="no-events-support">{content.body}</p><a className="no-events-support" href={notteLinks.events}>{content.action} <ArrowRight /></a></div>
    <img className="no-events-image" src={notteImages.events} alt={content.imageAlt} width="1122" height="1402" loading="lazy" decoding="async" />
  </section>;
}

export function ReviewsSection() {
  const content = notteContent.reviews;
  const rows = [googleReviews.slice(0, 6), googleReviews.slice(6)];
  return <section className="no-reviews" id="reviews" aria-labelledby="reviews-title" data-reveal-once>
    <header className="no-reviews-heading" data-reveal-item><div className="no-reviews-score"><span aria-hidden="true">★★★★★</span><strong>4,5</strong><p>{content.summary}</p></div><h2 id="reviews-title">{content.title}</h2></header>
    <div className="no-review-marquees" aria-label="Ausgewählte Google-Rezensionen" data-reveal-item>
      {rows.map((row, rowIndex) => <div className={`no-review-rail no-review-rail-${rowIndex + 1}`} key={rowIndex}>
        {[false, true].map((duplicate) => <div className="no-review-set" aria-hidden={duplicate || undefined} key={duplicate ? "duplicate" : "original"}>{row.map((review) => <ReviewCard duplicate={duplicate} key={review.author} review={review} />)}</div>)}
      </div>)}
    </div>
    <footer className="no-reviews-footer" data-reveal-item><a href={notteLinks.reviews} rel="noreferrer" target="_blank">{content.link} <ArrowRight /></a><small>{content.date}</small></footer>
  </section>;
}

export function ReservationSection() {
  const content = notteContent.reservation;
  return <section className="no-reservation" id="action" aria-labelledby="reservation-title">
    <div className="no-reservation-intro"><p>{content.eyebrow}</p><span className="no-reservation-rule" aria-hidden="true" /></div>
    <h2 id="reservation-title" data-word-reveal><MaskedWords text={content.title} /></h2>
    <div className="no-reservation-details"><p>{content.body}</p><a href={notteLinks.phone}><Phone size={20} weight="regular" />{content.action}</a></div>
  </section>;
}

export function VisitSection() {
  const content = notteContent.visit;
  return <section className="no-info" id="contact" aria-labelledby="contact-title">
    <div className="no-info-contact"><p>{content.contact}</p><h2 id="contact-title">{content.addressLine1}<br />{content.addressLine2}</h2><div><a href={notteLinks.phone}><Phone /> {content.phone}</a><a href={notteLinks.route}><MapPin /> {content.route}</a></div><small>{content.payment}</small></div>
    <div className="no-info-details"><p>{content.hours}</p><dl>{openingHours.map(([day, hours]) => <div key={day}><dt>{day}</dt><dd>{hours}</dd></div>)}</dl><a className="no-info-map" href={notteLinks.route}><MapPin size={30} weight="fill" /><span><strong>{content.mapTitle}</strong><small>{content.route}</small></span><ArrowRight /></a></div>
  </section>;
}

export function NotteFooter({ locale }: { locale: "de" | "en" | "it" }) {
  const content = notteContent.footer;
  const visit = notteContent.visit;
  return <footer className="no-footer" data-reveal-once>
    <div className="no-footer-brand" data-reveal-item><strong>Ristorante Colosseo</strong><p>{content.statement}</p></div>
    <nav aria-label="Footer-Navigation" data-reveal-item><a href="#menu">{content.menu}</a><a href="#story">{content.restaurant}</a><a href="#events">{content.events}</a><a href="#reviews">{content.reviews}</a></nav>
    <div className="no-footer-contact" data-reveal-item><a href={notteLinks.phone}>{visit.phone}</a><p>{visit.addressLine1}<br />{visit.addressLine2}</p></div>
    <nav className="no-footer-languages" aria-label={content.languages} data-reveal-item>{(["de", "en", "it"] as const).map((language) => <Link aria-current={locale === language ? "page" : undefined} key={language} to="/$lang" params={{ lang: language }} search={{}}>{language.toUpperCase()}</Link>)}</nav>
  </footer>;
}
