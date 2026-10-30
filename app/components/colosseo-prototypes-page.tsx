import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { CasaPrototype, GraficaPrototype, MateriaPrototype, NottePrototype } from "~/prototypes/colosseo/prototype-variants";
import "~/prototypes/colosseo/prototypes.css";

const variants = [
  { name: "Materia", Component: MateriaPrototype },
  { name: "Notte", Component: NottePrototype },
  { name: "Grafica", Component: GraficaPrototype },
  { name: "Casa", Component: CasaPrototype },
] as const;

export function ColosseoPrototypesPage() {
  const { searchStr } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(searchStr);
  const initial = Math.min(Math.max(Number(params.get("v")) || 1, 1), variants.length) - 1;
  const [current, setCurrent] = useState(initial);
  const [replay, setReplay] = useState(0);
  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const Active = variants[current].Component;

  const select = (index: number) => {
    if (index < 0 || index >= variants.length) return;
    setCurrent(index);
    setReplay((value) => value + 1);
    navigate({ search: () => ({ v: String(index + 1) }) as never, replace: true });
  };

  useLayoutEffect(() => {
    const item = itemRefs.current[current];
    const highlight = highlightRef.current;
    if (item && highlight) {
      highlight.style.width = `${item.offsetWidth}px`;
      highlight.style.transform = `translateX(${item.offsetLeft}px)`;
    }
    const first = requestAnimationFrame(() => {
      const second = requestAnimationFrame(() => pickerRef.current?.setAttribute("data-ready", ""));
      return () => cancelAnimationFrame(second);
    });
    const onResize = () => {
      const nextItem = itemRefs.current[current];
      if (nextItem && highlightRef.current) {
        highlightRef.current.style.width = `${nextItem.offsetWidth}px`;
        highlightRef.current.style.transform = `translateX(${nextItem.offsetLeft}px)`;
      }
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(first); window.removeEventListener("resize", onResize); };
  }, [current]);

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable || event.metaKey || event.ctrlKey || event.altKey) return;
      const number = Number.parseInt(event.key, 10);
      if (number >= 1 && number <= variants.length) select(number - 1);
      else if (event.key === "ArrowRight") select((current + 1) % variants.length);
      else if (event.key === "ArrowLeft") select((current - 1 + variants.length) % variants.length);
      else if (event.key === "r" || event.key === "R") setReplay((value) => value + 1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className="prototype-stage" id="main-content">
      <Active key={`${current}-${replay}`} />
      <nav className="proto-picker" aria-label="Prototype variants" ref={pickerRef}>
        <span className="proto-picker-highlight" aria-hidden="true" ref={highlightRef}></span>
        {variants.map((variant, index) => <button aria-current={index === current ? "true" : undefined} className="proto-picker-item" data-active={index === current ? "" : undefined} key={variant.name} onClick={() => select(index)} ref={(node) => { itemRefs.current[index] = node; }} type="button">{variant.name}</button>)}
        <span className="proto-picker-divider" aria-hidden="true"></span>
        <button aria-label="Replay animation (R)" className="proto-picker-item proto-picker-replay" onClick={() => setReplay((value) => value + 1)} type="button">↻</button>
      </nav>
    </main>
  );
}
