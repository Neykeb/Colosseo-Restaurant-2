import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ArrowRight, ForkKnife, Phone } from "@phosphor-icons/react";
import { useRef } from "react";

import { NottePage } from "./notte/notte-page";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const images = {
  hero: "/images/hero-kitchen-concept.png",
  interior: "/images/colosseo/interior-dining-room.webp",
  pasta: "/images/pasta-craft-concept.png",
  pizza: "/images/pizza-concept.png",
  table: "/images/gathering-concept.png",
};

function usePrototypeMotion(kind: "materia" | "notte" | "grafica" | "casa") {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileLite = prefersReducedMotion
      || window.matchMedia("(pointer: coarse)").matches
      || window.matchMedia("(max-width: 767px)").matches;
    root.current?.classList.toggle("is-mobile-lite", mobileLite);
    if (mobileLite) {
      return () => root.current?.classList.remove("is-mobile-lite");
    }
    const ease = "power3.out";
    gsap.from("[data-enter]", { opacity: 0, y: kind === "grafica" ? 24 : 42, duration: 0.85, stagger: 0.09, ease });
    if (kind === "notte") {
      ScrollTrigger.clearScrollMemory("manual");
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      const lenis = new Lenis({
        duration: 1.05,
        easing: (value) => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      });
      const updateLenis = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
      const hero = root.current?.querySelector<HTMLElement>(".no-hero");
      const video = root.current?.querySelector<HTMLVideoElement>(".no-hero-video");
      const intro = root.current?.querySelector<HTMLElement>(".no-intro");
      const siteNav = root.current?.querySelector<HTMLElement>(".no-site-nav");
      let videoTween: gsap.core.Tween | undefined;
      let videoFrameRequest: number | undefined;
      let framePending = false;
      const playhead = { time: 0 };
      let removeNavigationListener = () => undefined;

      if (siteNav) {
        gsap.from(siteNav.children, { opacity: 0, y: -10, duration: 0.55, stagger: 0.06, ease: "power3.out" });
        const setNavigationState = (scrollTop: number, direction: number) => {
          siteNav.classList.toggle("is-compact", scrollTop > 72);
          if (scrollTop <= 72) siteNav.classList.remove("is-hidden");
          else if (direction > 0) siteNav.classList.add("is-hidden");
          else if (direction < 0) siteNav.classList.remove("is-hidden");
        };
        setNavigationState(window.scrollY, 0);
        let previousScrollTop = window.scrollY;
        let directionAnchor = window.scrollY;
        let navigationFrame: number | undefined;
        const updateNavigation = () => {
          const scrollTop = window.scrollY;
          const rawDirection = scrollTop > previousScrollTop ? 1 : scrollTop < previousScrollTop ? -1 : 0;
          if (scrollTop <= 72) directionAnchor = scrollTop;
          const distance = scrollTop - directionAnchor;
          const direction = distance >= 96 ? 1 : distance <= -72 ? -1 : 0;
          setNavigationState(scrollTop, direction);
          if (direction !== 0 || rawDirection === 0) directionAnchor = scrollTop;
          previousScrollTop = scrollTop;
          navigationFrame = undefined;
        };
        const onScroll = () => {
          if (navigationFrame === undefined) navigationFrame = window.requestAnimationFrame(updateNavigation);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        removeNavigationListener = () => {
          window.removeEventListener("scroll", onScroll);
          if (navigationFrame !== undefined) window.cancelAnimationFrame(navigationFrame);
        };
      }

      const seekToPlayhead = () => {
        if (!video) return;
        const targetTime = playhead.time;
        if (Math.abs(video.currentTime - targetTime) < 1 / 60) return;

        if (typeof video.requestVideoFrameCallback !== "function") {
          video.currentTime = targetTime;
          return;
        }

        if (framePending) return;
        framePending = true;
        video.currentTime = targetTime;
        videoFrameRequest = video.requestVideoFrameCallback(() => {
          framePending = false;
          seekToPlayhead();
        });
      };

      const createVideoScrub = () => {
        if (!hero || !video || !Number.isFinite(video.duration) || video.duration <= 0 || videoTween) return;
        video.pause();
        video.currentTime = 0;
        videoTween = gsap.to(playhead, {
          time: Math.max(0, video.duration - 0.04),
          ease: "none",
          onUpdate: seekToPlayhead,
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (window.innerWidth < 768 ? 2.4 : 3))}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.22,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        ScrollTrigger.refresh();
        lenis.scrollTo(0, { immediate: true });
      };

      if (video?.readyState && video.readyState >= HTMLMediaElement.HAVE_METADATA) createVideoScrub();
      else video?.addEventListener("loadedmetadata", createVideoScrub, { once: true });
      if (intro && root.current) {
        root.current.classList.add("has-layer-reveal");
        gsap.fromTo(intro, { yPercent: 16 }, {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: () => `top+=${Math.round(window.innerHeight * (window.innerWidth < 768 ? 1.6 : 2.2))} top`,
            end: () => `+=${window.innerHeight}`,
            scrub: 0.32,
            invalidateOnRefresh: true,
          },
        });
        const introImage = intro.querySelector<HTMLImageElement>(".no-intro-media img");
        if (introImage) {
          gsap.fromTo(introImage, { scale: 1.06 }, {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: () => `top+=${Math.round(window.innerHeight * (window.innerWidth < 768 ? 1.6 : 2.2))} top`,
              end: () => `+=${window.innerHeight}`,
              scrub: 0.32,
              invalidateOnRefresh: true,
            },
          });
        }
      }
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".no-hero .no-word-inner", { yPercent: 115, duration: 1.05, stagger: 0.07 })
        .from(".no-copy > p, .no-hero-actions, .no-arrow", { opacity: 0, y: 18, duration: 0.62, stagger: 0.07 }, "<+0.22");
      gsap.utils.toArray<HTMLElement>("[data-word-reveal]").forEach((item) => {
        gsap.from(item.querySelectorAll(".no-word-inner"), { yPercent: 115, stagger: 0.045, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 82%", end: "top 48%", scrub: true } });
      });
      const family = root.current?.querySelector<HTMLElement>(".no-family");
      const familyImage = family?.querySelector<HTMLImageElement>(".no-family-background");
      const familyHeadingWords = family?.querySelectorAll<HTMLElement>(".no-family-copy .no-word-inner");
      const familyBody = family?.querySelector<HTMLElement>(".no-family-copy > p");
      if (family && familyHeadingWords?.length && familyBody && familyImage) {
        const familyTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: family, start: "top 76%", once: true },
        });
        familyTimeline
          .from(familyHeadingWords, { yPercent: 115, duration: 0.72, stagger: 0.055 })
          .from(familyBody, { opacity: 0, y: 24, duration: 0.7 }, "<+0.16");
        gsap.fromTo(familyImage, { yPercent: -5, scale: 1.1 }, {
          yPercent: 5,
          scale: 1.03,
          ease: "none",
          scrollTrigger: { trigger: family, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-reveal-once]").forEach((section) => {
        const items = section.querySelectorAll<HTMLElement>("[data-reveal-item]");
        if (!items.length) return;
        gsap.from(items, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        });
      });
      const reservation = root.current?.querySelector<HTMLElement>(".no-reservation");
      const reservationRule = reservation?.querySelector<HTMLElement>(".no-reservation-rule");
      const reservationDetails = reservation?.querySelector<HTMLElement>(".no-reservation-details");
      if (reservation && reservationRule && reservationDetails) {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: reservation, start: "top 72%", once: true },
        })
          .from(reservationRule, { scaleX: 0, transformOrigin: "left center", duration: 0.85 })
          .from(reservationDetails, { opacity: 0, y: 24, duration: 0.7 }, "<+0.18");
      }
      const events = root.current?.querySelector<HTMLElement>(".no-events");
      const eventsImage = events?.querySelector<HTMLImageElement>(".no-events-image");
      const eventsSupport = events?.querySelectorAll<HTMLElement>(".no-events-support");
      if (events && eventsImage && eventsSupport?.length) {
        gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: events, start: "top 74%", once: true },
        })
          .from(eventsImage, { opacity: 0.45, scale: 0.94, duration: 1 })
          .from(eventsSupport, { opacity: 0, y: 24, duration: 0.68, stagger: 0.07 }, "<+0.2");
      }
      const visit = root.current?.querySelector<HTMLElement>(".no-info");
      const visitContact = visit?.querySelector<HTMLElement>(".no-info-contact");
      const visitDetails = visit?.querySelector<HTMLElement>(".no-info-details");
      if (visit && visitContact && visitDetails) {
        gsap.from([visitContact, visitDetails], { opacity: 0, y: 24, duration: 0.72, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: visit, start: "top 76%", once: true } });
      }
      gsap.utils.toArray<HTMLElement>("[data-cinematic]").forEach((item) => {
        gsap.fromTo(item, { scale: 0.92, opacity: 0.45 }, { scale: 1, opacity: 1, scrollTrigger: { trigger: item, start: "top 88%", end: "bottom 30%", scrub: true } });
      });
      const menuJourney = root.current?.querySelector<HTMLElement>(".no-menu-journey");
      const menuTrack = root.current?.querySelector<HTMLElement>(".no-menu-panels");
      const menuPanels = gsap.utils.toArray<HTMLElement>(".no-menu-panel");
      const menuImages = gsap.utils.toArray<HTMLImageElement>(".no-menu-image");
      let activeDishIndex = 0;
      const setActiveDish = (activeIndex: number) => {
        if (activeIndex === activeDishIndex) return;
        activeDishIndex = activeIndex;
        menuPanels.forEach((panel, index) => panel.classList.toggle("is-active", index === activeIndex));
        menuImages.forEach((image, index) => image.classList.toggle("is-active", index === activeIndex));
        menuJourney?.dispatchEvent(new CustomEvent<number>("colosseo:menu-slide", { detail: activeIndex }));
      };
      menuPanels.forEach((panel, index) => panel.classList.toggle("is-active", index === 0));
      if (menuJourney && menuTrack && menuPanels.length > 1) {
        const getImageTravel = (image: HTMLImageElement) => {
          const sectionRect = menuJourney.getBoundingClientRect();
          const imageRect = image.getBoundingClientRect();
          const imageStageRect = image.parentElement?.getBoundingClientRect();
          const offscreenGap = Math.min(150, Math.max(96, sectionRect.height * 0.22));
          const restingCenter = imageStageRect
            ? imageStageRect.top - sectionRect.top + imageStageRect.height / 2
            : sectionRect.height / 2;
          return {
            bottom: sectionRect.height - restingCenter + imageRect.height / 2 + offscreenGap,
            top: -(restingCenter + imageRect.height / 2),
          };
        };
        gsap.set(menuImages, {
          opacity: 1,
          transform: (index, image: HTMLImageElement) => index === 0
            ? "translate3d(0, 0px, 0)"
            : `translate3d(0, ${getImageTravel(image).bottom}px, 0)`,
        });
        const holdDuration = 0.32;
        const travelDuration = 1;
        const restingTimes = [0];
        let timelineCursor = holdDuration;
        const menuTimeline = gsap.timeline({
          defaults: { duration: 1, ease: "none" },
          scrollTrigger: {
            trigger: menuJourney,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * (
              (menuPanels.length - 1) * (travelDuration + holdDuration) + holdDuration
            ))}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.42,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const timelineTime = self.progress * menuTimeline.duration();
              const activeIndex = restingTimes.reduce(
                (current, restingTime, index) => timelineTime + 0.0001 >= restingTime ? index : current,
                0,
              );
              setActiveDish(activeIndex);
            },
          },
        });
        for (let index = 1; index < menuImages.length; index += 1) {
          const previousImage = menuImages[index - 1];
          const activeImage = menuImages[index];
          menuTimeline
            .to(previousImage, {
              transform: () => `translate3d(0, ${getImageTravel(previousImage).top}px, 0)`,
              duration: travelDuration,
            }, timelineCursor)
            .fromTo(activeImage, {
              transform: () => `translate3d(0, ${getImageTravel(activeImage).bottom}px, 0)`,
            }, {
              transform: "translate3d(0, 0px, 0)",
              duration: travelDuration,
              immediateRender: false,
            }, timelineCursor);
          timelineCursor += travelDuration;
          restingTimes.push(timelineCursor);
          timelineCursor += holdDuration;
        }
        menuTimeline.to(menuTrack, {
          transform: () => `translate3d(0, -${menuTrack.scrollHeight - menuTrack.clientHeight}px, 0)`,
          duration: timelineCursor,
        }, 0);
      }
      return () => {
        removeNavigationListener();
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
        video?.removeEventListener("loadedmetadata", createVideoScrub);
        if (videoFrameRequest !== undefined) video?.cancelVideoFrameCallback?.(videoFrameRequest);
        videoTween?.kill();
        root.current?.classList.remove("has-layer-reveal");
      };
    } else if (kind === "grafica") {
      gsap.to("[data-marquee]", { xPercent: -50, duration: 18, ease: "none", repeat: -1 });
    } else {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((item) => {
        gsap.from(item, { opacity: 0.15, y: 38, scrollTrigger: { trigger: item, start: "top 88%", end: "top 55%", scrub: true } });
      });
    }
  }, { scope: root });
  return root;
}

function PrototypeNav({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <header className={`p-nav ${dark ? "p-nav-dark" : ""} ${compact ? "p-nav-compact" : ""}`} data-enter>
      <a className="p-logo" href="#top"><small>RISTORANTE</small>COLOSSEO</a>
      <nav aria-label="Prototyp-Navigation"><a href="#menu">Speisekarte</a><a href="#story">Restaurant</a><a href="#events">Feiern</a></nav>
      <a className="p-nav-cta" href="tel:+49417162952"><Phone size={17} /> Reservieren</a>
    </header>
  );
}

export function MateriaPrototype() {
  const root = usePrototypeMotion("materia");
  return <div className="variant materia" id="top" ref={root}>
    <PrototypeNav />
    <section className="ma-hero">
      <div className="ma-copy" data-enter><p className="eyebrow">Frisch in unserer Küche</p><h1>Italien beginnt <span className="inline-photo"><img src={images.pasta} alt="" /></span> mit den Händen.</h1><p>Pizza, Pasta und ehrliche italienische Küche aus einfachen Zutaten.</p><div className="p-actions"><a className="p-button ma-solid" href="#action">Tisch reservieren</a><a className="p-button ma-line" href="#menu">Speisekarte</a></div></div>
      <figure className="ma-visual" data-enter><img src={images.hero} alt="Hände formen frischen Pizzateig" /><figcaption>Handwerk, Zeit und gute Zutaten.</figcaption></figure>
    </section>
    <section className="ma-manifest" id="story" data-reveal><h2>Einfach in den Zutaten.<br />Sorgfältig in der Zubereitung.</h2><p>Wir machen unsere Küche selbst. Jeden Tag, mit Ruhe und Aufmerksamkeit.</p></section>
    <section className="ma-grid" id="menu">
      <article className="ma-grid-image" data-reveal><img src={images.pizza} alt="Pizza Margherita" /></article>
      <article className="ma-grid-main" data-reveal><p>Aus dem Ofen</p><h3>Pizza</h3><span>Knuspriger Rand, Tomate, Mozzarella und Zeit.</span></article>
      <article data-reveal><p>Aus der Küche</p><h3>Pasta</h3></article><article data-reveal><p>Für danach</p><h3>Dolci</h3></article>
    </section>
    <section className="ma-action" id="action" data-reveal><p>Ein guter Abend braucht einen guten Tisch.</p><h2>Ci vediamo<br />al Colosseo.</h2><a href="tel:+49417162952">Tisch anfragen <ArrowRight /></a></section>
  </div>;
}

export function NottePrototype({ locale = "de" }: { locale?: "de" | "en" | "it" }) {
  const root = usePrototypeMotion("notte");
  return <NottePage locale={locale} rootRef={root} />;
}

export function GraficaPrototype() {
  const root = usePrototypeMotion("grafica");
  return <div className="variant grafica" id="top" ref={root}>
    <PrototypeNav compact />
    <section className="gr-hero"><div className="gr-title" data-enter><p>FATTO A MANO</p><h1>TEIG.<br />TOMATE.<br />HITZE.</h1></div><div className="gr-image" data-enter><img src={images.pizza} alt="Pizza mit Tomate und Mozzarella" /><span>GUTE DINGE BRAUCHEN KEINE LANGE LISTE.</span></div></section>
    <div className="gr-marquee"><div data-marquee>{Array(2).fill("PIZZA / PASTA / OLIVENÖL / ZEIT / COLOSSEO / ").join("")}</div></div>
    <section className="gr-menu" id="menu">
      <article className="gr-menu-main"><span>01</span><h2>PIZZA</h2><p>Heiß. Knusprig. Direkt aus dem Ofen.</p></article>
      <article><span>02</span><h2>PASTA</h2><p>Form, Sauce, Handwerk.</p></article>
      <article><span>03</span><h2>DOLCI</h2><p>Das richtige Ende.</p></article>
    </section>
    <section className="gr-story" id="story"><img src={images.hero} alt="Pizzateig wird von Hand geformt" /><div><p>NICHT KOMPLIZIERT.<br />NUR GUT GEMACHT.</p><a href="#action">UNSERE KÜCHE <ArrowRight /></a></div></section>
    <section className="gr-action" id="action"><h2>HUNGRIG?</h2><a href="tel:+49417162952">TISCH RESERVIEREN</a></section>
  </div>;
}

export function CasaPrototype() {
  const root = usePrototypeMotion("casa");
  return <div className="variant casa" id="top" ref={root}>
    <PrototypeNav />
    <section className="ca-hero"><div data-enter><p>Benvenuti</p><h1>Setzen Sie sich.<br />Wir kümmern uns um den Rest.</h1><span>Italienische Küche für gemeinsame Abende, vertraute Gesichter und besondere Anlässe.</span><a href="#action">Tisch reservieren</a></div><img src={images.table} alt="Gemeinsamer italienischer Abend" data-enter /></section>
    <section className="ca-letter" id="story" data-reveal><ForkKnife size={32} /><p>Im Colosseo kochen wir so, wie wir selbst gerne essen: frisch, ehrlich und mit Zeit für die Menschen am Tisch.</p><span>— Das Team vom Ristorante Colosseo</span></section>
    <section className="ca-favorites" id="menu"><header><p>Lieblingsgerichte</p><h2>Für jeden am Tisch etwas Gutes.</h2></header><div>{[['Pizza aus dem Ofen', images.pizza], ['Pasta aus unserer Küche', images.pasta], ['Abende zum Teilen', images.table]].map(([name,image])=><article data-reveal key={name}><img src={image} alt="" /><h3>{name}</h3><p>Die echte Auswahl und Preise folgen mit der finalen Speisekarte.</p></article>)}</div></section>
    <section className="ca-events" id="events" data-reveal><img src={images.hero} alt="Handarbeit in der Küche" /><div><p>Feiern im Colosseo</p><h2>Ein Tisch für die Menschen, die Ihnen wichtig sind.</h2><a href="#action">Feier anfragen</a></div></section>
    <section className="ca-action" id="action" data-reveal><p>Wir freuen uns auf Sie.</p><h2>Ihr Tisch wartet.</h2><div className="p-actions"><a href="tel:+49417162952">Anrufen</a><a href="#menu">Speisekarte ansehen</a></div></section>
  </div>;
}
