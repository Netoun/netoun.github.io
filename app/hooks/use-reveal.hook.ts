import { setElementVars } from "@vanilla-extract/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { revealIndex } from "@/styles/animations.css";

// Reveal-once on viewport entry, with staggered children.
// States:
// - null    → server/prerender markup: no attribute, content fully visible without JS
// - idle    → hidden, waiting for viewport entry (only ever set by JS, before paint)
// - revealed → transition to final state (never goes back to idle)
// - static  → final state with no animation (reduced motion, bfcache restore)
export type RevealState = "idle" | "revealed" | "static";

// Children opt in with data-reveal-item; delay = revealIndex × motion.staggerStep,
// index capped so a long list never waits more than ~400ms.
const STAGGER_INDEX_CAP = 5;

// Every 5 %: a section taller than the viewport still reports as it scrolls in.
const RATIO_STEPS = Array.from({ length: 21 }, (_, step) => step / 20);

/**
 * `threshold` of the element, or of the viewport when the element is taller than it:
 * a section more than 1/threshold screens tall can never show that share of itself.
 */
function coversThreshold(entry: IntersectionObserverEntry, threshold: number): boolean {
  if (!entry.isIntersecting) return false;
  const viewport = entry.rootBounds?.height ?? window.innerHeight;
  const reference = Math.min(entry.boundingClientRect.height, viewport);
  return entry.intersectionRect.height >= reference * threshold;
}

interface UseRevealOptions {
  rootMargin?: string;
  threshold?: number;
}

export function useReveal<T extends HTMLElement = HTMLElement>(options: UseRevealOptions = {}) {
  const { rootMargin = "0px 0px -10% 0px", threshold = 0.15 } = options;
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState | null>(null);

  // Before first hydrated paint: decide whether to hide and index the children.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) {
      const items = element.querySelectorAll<HTMLElement>("[data-reveal-item]");
      items.forEach((item, index) => {
        setElementVars(item, { [revealIndex]: String(Math.min(index, STAGGER_INDEX_CAP)) });
      });
    }

    // Intentional: the first render must match the prerendered markup (state = null);
    // the client-only decision lands in a layout effect, before the first paint.
    // oxlint-disable-next-line react/set-state-in-effect
    setState(reducedMotion ? "static" : "idle");
  }, []);

  useEffect(() => {
    if (state !== "idle") return;
    const element = ref.current;
    if (!element) return;

    // bfcache restore must never show a page stuck in pre-reveal state
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setState("static");
    };
    window.addEventListener("pageshow", onPageShow);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (coversThreshold(entry, threshold)) {
          setState("revealed");
          observer.disconnect();
        }
      },
      { rootMargin, threshold: [...new Set([...RATIO_STEPS, threshold])] },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [state, rootMargin, threshold]);

  return { ref, state };
}
