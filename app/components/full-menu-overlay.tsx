import { X } from "@phosphor-icons/react";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

import { allergenLegend, menuCategories, menuSource } from "~/content/menu-data";

type FullMenuOverlayProps = {
  onClose: () => void;
  open: boolean;
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse), (max-width: 767px)").matches;

export function FullMenuOverlay({ onClose, open }: FullMenuOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const mainCloseRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);
  const [activeCategoryId, setActiveCategoryId] = useState("antipasti");

  const activeCategory = useMemo(
    () => menuCategories.find((category) => category.id === activeCategoryId) ?? menuCategories[0],
    [activeCategoryId],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    const shell = shellRef.current;
    if (!dialog || !shell || !open) return;

    closingRef.current = false;
    if (!dialog.open) dialog.showModal();
    shell.scrollTop = 0;
    mainCloseRef.current?.focus();

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    if (!prefersReducedMotion()) {
      gsap.fromTo(shell, { yPercent: 100 }, { yPercent: 0, duration: 0.36, ease: "power4.out", overwrite: true });
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      gsap.killTweensOf(shell);
    };
  }, [open]);

  const finishClose = () => {
    if (!closingRef.current) return;
    dialogRef.current?.close();
    closingRef.current = false;
    onClose();
  };

  const closeOverlay = () => {
    const shell = shellRef.current;
    if (!shell || closingRef.current) return;
    closingRef.current = true;
    if (prefersReducedMotion()) {
      finishClose();
      return;
    }
    gsap.to(shell, { yPercent: 100, duration: 0.28, ease: "power3.in", overwrite: true, onComplete: finishClose });
  };

  const selectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    shellRef.current?.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <dialog
      aria-label="Unsere Speisekarte"
      className="full-menu-dialog"
      onCancel={(event) => {
        event.preventDefault();
        closeOverlay();
      }}
      ref={dialogRef}
    >
      <div className="full-menu-shell" data-lenis-prevent ref={shellRef}>
        <header className="full-menu-toolbar">
          <div className="full-menu-title"><small>RISTORANTE COLOSSEO</small><strong>Unsere Speisekarte</strong></div>
          <div aria-label="Speisekarten-Kategorien" className="full-menu-filters" role="group">
            {menuCategories.map((category) => (
              <button
                aria-pressed={activeCategoryId === category.id}
                key={category.id}
                onClick={() => selectCategory(category.id)}
                type="button"
              >
                {category.filterLabel}
              </button>
            ))}
          </div>
          <button aria-label="Speisekarte schließen" className="full-menu-close" onClick={closeOverlay} ref={mainCloseRef} type="button"><X size={22} /></button>
        </header>

        <main className="full-menu-content" key={activeCategory.id}>
          {activeCategory.sections.map((section) => (
            <section className="full-menu-category" key={section.id}>
              <header>
                <h2>{section.heading}</h2>
                {section.subheading && <h3>{section.subheading}</h3>}
                {section.note && <p>{section.note}</p>}
              </header>
              <div className="full-menu-list">
                {section.dishes.map((item) => (
                  <article
                    className="full-menu-dish"
                    key={item.key}
                  >
                    <span className="full-menu-dish-number">{item.number}</span>
                    <span className="full-menu-dish-copy">
                      <span className="full-menu-dish-title"><strong>{item.name}</strong>{item.allergens && <em>{item.allergens}</em>}</span>
                      {item.description && <small>{item.description}</small>}
                    </span>
                    <span className="full-menu-dish-price">{item.price}</span>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <details className="full-menu-legend">
            <summary>Übersicht: Allergene und Zusatzstoffe</summary>
            <p>In allen Speisen können Spuren von Allergenen enthalten sein!</p>
            <div>{allergenLegend.map((entry) => <span key={entry}>{entry}</span>)}</div>
          </details>

          <footer className="full-menu-footer">
            <p>Stand der geprüften Online-Speisekarte: {menuSource.checkedAt}</p>
            <a href={menuSource.url} target="_blank" rel="noreferrer">Originalquelle öffnen</a>
          </footer>
        </main>
      </div>

    </dialog>
  );
}
