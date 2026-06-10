import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Reveal-once on viewport entry, with staggered children.
// States (see specs/001-premium-polish/data-model.md):
// - null    → server/prerender markup: no attribute, content fully visible without JS
// - idle    → hidden, waiting for viewport entry (only ever set by JS, before paint)
// - revealed → transition to final state (never goes back to idle)
// - static  → final state with no animation (reduced motion, bfcache restore)
export type RevealState = "idle" | "revealed" | "static";

// Children opt in with data-reveal-item; delay = --reveal-index × motion.staggerStep,
// index capped so a long list never waits more than ~400ms.
const STAGGER_INDEX_CAP = 5;

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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("static");
      return;
    }

    const items = element.querySelectorAll<HTMLElement>("[data-reveal-item]");
    items.forEach((item, index) => {
      item.style.setProperty("--reveal-index", String(Math.min(index, STAGGER_INDEX_CAP)));
    });
    setState("idle");
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
        if (entry.isIntersecting) {
          setState("revealed");
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [state, rootMargin, threshold]);

  return { ref, state };
}
