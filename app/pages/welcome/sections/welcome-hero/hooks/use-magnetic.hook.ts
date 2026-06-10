import { useEffect, type RefObject } from "react";

const ATTRACTION_RADIUS = 80;
const MAX_OFFSET = 4;

// Pure helper: pull toward the cursor, stronger when closer, clamped to ±MAX_OFFSET.
// dx/dy are cursor coordinates relative to the element center.
export function computeMagnetOffset(
  dx: number,
  dy: number,
  radius: number = ATTRACTION_RADIUS,
): { x: number; y: number } {
  const distance = Math.hypot(dx, dy);
  if (distance === 0 || distance > radius) {
    return { x: 0, y: 0 };
  }
  const strength = 1 - distance / radius;
  return {
    x: (dx / distance) * MAX_OFFSET * strength,
    y: (dy / distance) * MAX_OFFSET * strength,
  };
}

// Sets --magnet-x/--magnet-y on the element so CSS can translate it toward the
// cursor. Inert on coarse pointers and when the user prefers reduced motion.
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMouseMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = element.getBoundingClientRect();
        const { x, y } = computeMagnetOffset(
          event.clientX - (rect.left + rect.width / 2),
          event.clientY - (rect.top + rect.height / 2),
        );
        element.style.setProperty("--magnet-x", `${x}px`);
        element.style.setProperty("--magnet-y", `${y}px`);
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (frame) cancelAnimationFrame(frame);
      element.style.removeProperty("--magnet-x");
      element.style.removeProperty("--magnet-y");
    };
  }, [ref]);
}
