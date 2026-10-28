import { ArrowRight, Phone } from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { Link } from "react-router";

import { pathFor, siteContent, type Locale } from "~/content/site-content";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type HomeCopy = (typeof siteContent)["de"]["home"];
type CommonCopy = (typeof siteContent)["de"]["common"];

export function HomePage({ locale, copy, common }: { locale: Locale; copy: HomeCopy; common: CommonCopy }) {
  const pageRef = useRef<HTMLElement>(null);
  const kitchenRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.from("[data-hero-item]", {
      opacity: 0,
      y: 28,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
    });

    const media = gsap.matchMedia();
    media.add("(min-width: 900px)", () => {
      const title = kitchenRef.current?.querySelector(".kitchen-copy");
      const gallery = kitchenRef.current?.querySelector(".kitchen-gallery");
      if (!title || !gallery) return;
      ScrollTrigger.create({
        trigger: kitchenRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: title,
        pinSpacing: false,
      });
      gsap.fromTo(
        gallery.querySelectorAll("img"),
        { scale: 0.88, opacity: 0.45 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: gallery,
            start: "top 80%",
            end: "bottom 65%",
            scrub: 1,
          },
        },
      );
    });

    const cards = stackRef.current?.querySelectorAll<HTMLElement>(".stack-card");
    cards?.forEach((card, index) => {
      if (index === cards.length - 1) return;
      gsap.to(card, {
        scale: 0.94,
        opacity: 0.58,
        ease: "none",
        scrollTrigger: {
          trigger: cards[index + 1],
          start: "top bottom",
          end: "top 18%",
          scrub: true,
        },
      });
    });

    return () => media.revert();
  }, { scope: pageRef });

  return (
    <main className="page-shell" id="main-content" ref={pageRef}>
      <section className="hero-section">
        <div className={`hero-copy${copy.heroTitle.length > 64 ? " hero-copy-long" : ""}`}>
          <p className="hero-kicker" data-hero-item>Ristorante Colosseo</p>
          <h1 data-hero-item>{copy.heroTitle}</h1>
          <p className="hero-body" data-hero-item>{copy.heroBody}</p>
          <div className="hero-actions" data-hero-item>
            <span className="button button-primary button-disabled" aria-disabled="true">{common.reserve}</span>
            <Link className="button button-ghost" to={pathFor(locale, "menu")}>{common.menu}</Link>
          </div>
        </div>
        <figure className="hero-media" data-hero-item>
          <img
            alt="Konzeptbild: Hände formen frischen Pizzateig auf einer Arbeitsfläche"
            fetchPriority="high"
            height="940"
            src="/images/hero-kitchen-concept.png"
            width="1672"
          />
          <figcaption>{common.conceptNotice}</figcaption>
        </figure>
      </section>

      <section className="craft-section section-space">
        <h2>
          {copy.craftTitle.split(" ").slice(0, 3).join(" ")} {" "}
          <span className="inline-image" aria-hidden="true">
            <img alt="" src="/images/pasta-craft-concept.png" />
          </span>{" "}
          {copy.craftTitle.split(" ").slice(3).join(" ")}
        </h2>
        <p>{copy.craftBody}</p>
      </section>

      <div className="marquee" aria-label={copy.ingredients.join(", ")}>
        <div className="marquee-track">
          {[...copy.ingredients, ...copy.ingredients].map((item, index) => (
            <span aria-hidden={index >= copy.ingredients.length} key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="menu-section section-space">
        <div className="section-heading">
          <h2>{copy.menuTitle}</h2>
          <p>{copy.menuBody}</p>
        </div>
        {copy.menuItems.length ? <div className={`menu-bento menu-bento-${Math.min(copy.menuItems.length, 3)}`}>
          <article className="bento-image bento-large">
            <img alt="Konzeptbild einer Pizza Margherita" loading="lazy" src="/images/pizza-concept.png" />
          </article>
          {copy.menuItems.slice(0, 2).map((item) => (
            <article className="bento-copy" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
          {copy.menuItems[2] ? <article className="bento-copy bento-wide">
            <div>
              <h3>{copy.menuItems[2].title}</h3>
              <p>{copy.menuItems[2].body}</p>
            </div>
            <Link className="text-link" to={pathFor(locale, "menu")}>
              {common.menu}<ArrowRight aria-hidden="true" size={20} />
            </Link>
          </article> : null}
        </div> : <div className="menu-empty"><p>Inhalte folgen.</p></div>}
      </section>

      <section className="kitchen-section section-space" ref={kitchenRef}>
        <div className="kitchen-copy">
          <h2>{copy.kitchenTitle}</h2>
          <p>{copy.kitchenBody}</p>
        </div>
        <div className="kitchen-gallery">
          <img alt="Konzeptbild: frische Pasta wird von Hand geschnitten" loading="lazy" src="/images/pasta-craft-concept.png" />
          <img alt="Konzeptbild: Pizza mit Tomate, Mozzarella und Basilikum" loading="lazy" src="/images/pizza-concept.png" />
          <img alt="Konzeptbild: Hände arbeiten an frischem Pizzateig" loading="lazy" src="/images/hero-kitchen-concept.png" />
        </div>
      </section>

      <section className="accordion-section section-space">
        <div className="horizontal-accordion">
          <article className="accordion-panel">
            <img alt="Konzeptbild eines gemeinsamen italienischen Abendessens" loading="lazy" src="/images/gathering-concept.png" />
            <div><h2>{copy.atmosphereTitle}</h2><p>{copy.atmosphereBody}</p></div>
          </article>
          <article className="accordion-panel">
            <img alt="Konzeptbild frischer Pasta" loading="lazy" src="/images/pasta-craft-concept.png" />
            <div><h2>{copy.eventsTitle}</h2><p>{copy.eventsBody}</p></div>
          </article>
          <article className="accordion-panel">
            <img alt="Konzeptbild einer Pizza" loading="lazy" src="/images/pizza-concept.png" />
            <div><h2>{copy.visitTitle}</h2><p>{common.placeholderNotice}</p></div>
          </article>
        </div>
      </section>

      <section className="stack-section section-space" ref={stackRef}>
        <article className="stack-card stack-dark">
          <p>{copy.eventsBody}</p>
          <h2>{copy.eventsTitle}</h2>
          <Link className="button button-light" to={pathFor(locale, "events")}>{common.eventInquiry}</Link>
        </article>
        <article className="stack-card stack-image">
          <img alt="Konzeptbild einer gedeckten Tafel" loading="lazy" src="/images/gathering-concept.png" />
          <div><h2>{copy.atmosphereTitle}</h2></div>
        </article>
        <article className="stack-card stack-accent">
          <p>{copy.reserveBody}</p>
          <h2>{copy.reserveTitle}</h2>
          <div className="stack-actions">
            <span className="button button-light button-disabled" aria-disabled="true">{common.reserve}</span>
            <a className="button button-outline-light" href="tel:+4900000000000"><Phone aria-hidden="true" size={18} />{common.call}</a>
          </div>
        </article>
      </section>
    </main>
  );
}
