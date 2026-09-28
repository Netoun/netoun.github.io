import { setElementVars } from "@vanilla-extract/dynamic";
import { useEffect } from "react";
import type { RefObject } from "react";
import { chromeReflection } from "./use-chrome-reflection.css";

/**
 * Lets the pointer drive the chrome on the monitor's captures: while a fine pointer moves
 * over `ref`, writes `chromeReflection` (0–1) on it and sets `data-chrome="on"`.
 * Nothing runs for touch, under reduced motion, or while `enabled` is false.
 */
export function useChromeReflection(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rect: DOMRect | null = null;
    let frame = 0;
    let x = 0.5;
    let y = 0.5;

    const apply = () => {
      frame = 0;
      setElementVars(element, {
        [chromeReflection.x]: x.toFixed(3),
        [chromeReflection.y]: y.toFixed(3),
      });
    };

    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const onEnter = () => {
      rect = element.getBoundingClientRect();
      element.dataset.chrome = "on";
    };

    const onMove = (event: PointerEvent) => {
      rect ??= element.getBoundingClientRect();
      x = clamp((event.clientX - rect.left) / rect.width);
      y = clamp((event.clientY - rect.top) / rect.height);
      if (frame === 0) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      rect = null;
      delete element.dataset.chrome;
    };

    // The window moves under a still pointer while the page scrolls: measure again.
    const onScroll = () => {
      rect = null;
    };

    element.addEventListener("pointerenter", onEnter);
    element.addEventListener("pointermove", onMove, { passive: true });
    element.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      element.removeEventListener("pointerenter", onEnter);
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
      delete element.dataset.chrome;
    };
  }, [ref, enabled]);
}
