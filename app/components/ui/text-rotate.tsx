import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type AnimatePresenceProps,
  type MotionProps,
  type Transition,
} from "motion/react";

import { cn } from "~/lib/utils";

type TextRotateProps = {
  texts: string[];
  rotationInterval?: number;
  initial?: MotionProps["initial"];
  animate?: MotionProps["animate"];
  exit?: MotionProps["exit"];
  animatePresenceMode?: AnimatePresenceProps["mode"];
  animatePresenceInitial?: boolean;
  staggerDuration?: number;
  transition?: Transition;
  loop?: boolean;
  auto?: boolean;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
};

export type TextRotateRef = {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
};

function splitIntoCharacters(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("de", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
}

export const TextRotate = forwardRef<TextRotateRef, TextRotateProps>(
  (
    {
      texts,
      transition = { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
      initial = { opacity: 0, transform: "translateY(70%)" },
      animate = { opacity: 1, transform: "translateY(0%)" },
      exit = { opacity: 0, transform: "translateY(-70%)" },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2000,
      staggerDuration = 0,
      loop = true,
      auto = true,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const reduceMotion = useReducedMotion();
    const words = useMemo(
      () =>
        (texts[currentIndex] ?? "").split(" ").map((word, index, items) => ({
          characters: splitIntoCharacters(word),
          needsSpace: index !== items.length - 1,
        })),
      [currentIndex, texts],
    );

    const jumpTo = useCallback(
      (index: number) =>
        setCurrentIndex(Math.max(0, Math.min(index, texts.length - 1))),
      [texts.length],
    );
    const next = useCallback(
      () =>
        setCurrentIndex((index) =>
          index === texts.length - 1 ? (loop ? 0 : index) : index + 1,
        ),
      [loop, texts.length],
    );
    const previous = useCallback(
      () =>
        setCurrentIndex((index) =>
          index === 0 ? (loop ? texts.length - 1 : index) : index - 1,
        ),
      [loop, texts.length],
    );
    const reset = useCallback(() => jumpTo(0), [jumpTo]);

    useImperativeHandle(ref, () => ({ jumpTo, next, previous, reset }), [
      jumpTo,
      next,
      previous,
      reset,
    ]);

    useEffect(() => {
      if (!auto) return;
      const interval = window.setInterval(next, rotationInterval);
      return () => window.clearInterval(interval);
    }, [auto, next, rotationInterval]);

    let characterOffset = 0;
    return (
      <span className={cn("flex flex-wrap", mainClassName)}>
        <span className="sr-only">{texts[currentIndex]}</span>
        <AnimatePresence initial={animatePresenceInitial} mode={animatePresenceMode}>
          <motion.span aria-hidden="true" className="flex flex-wrap" key={currentIndex}>
            {words.map((word, wordIndex) => {
              const offset = characterOffset;
              characterOffset += word.characters.length;
              return (
                <span className={cn("inline-flex", splitLevelClassName)} key={`${word.characters.join("")}-${wordIndex}`}>
                  {word.characters.map((character, characterIndex) => (
                    <motion.span
                      animate={reduceMotion ? { opacity: 1 } : animate}
                      className={cn("inline-block", elementLevelClassName)}
                      exit={reduceMotion ? { opacity: 0 } : exit}
                      initial={reduceMotion ? { opacity: 0 } : initial}
                      key={`${character}-${characterIndex}`}
                      transition={{
                        ...transition,
                        delay: reduceMotion ? 0 : (offset + characterIndex) * staggerDuration,
                      }}
                    >
                      {character}
                    </motion.span>
                  ))}
                  {word.needsSpace && <span>&nbsp;</span>}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </span>
    );
  },
);
TextRotate.displayName = "TextRotate";
