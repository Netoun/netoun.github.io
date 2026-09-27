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
    // getBoundingClientRect forces layout, and the hero tilt loop invalidates
    // styles every pointer frame — measuring here each mousemove would reflow
    // per frame. Cache the rect; refresh after scroll/resize, with a short TTL
    // as a safety net for other movement (e.g. the entrance animation).
    let cachedRect: DOMRect | null = null;
    let cachedAt = 0;
    let lastX = "";
    let lastY = "";
    const invalidateRect = () => {
      cachedRect = null;
    };

    const onMouseMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame((now) => {
        frame = 0;
        if (!cachedRect || now - cachedAt > 1000) {
          cachedRect = element.getBoundingClientRect();
          cachedAt = now;
        }
        const rect = cachedRect;
        const { x, y } = computeMagnetOffset(
          event.clientX - (rect.left + rect.width / 2),
          event.clientY - (rect.top + rect.height / 2),
        );
        const nextX = `${x}px`;
        const nextY = `${y}px`;
        if (nextX === lastX && nextY === lastY) return;
        lastX = nextX;
        lastY = nextY;
        element.style.setProperty("--magnet-x", nextX);
        element.style.setProperty("--magnet-y", nextY);
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", invalidateRect, { passive: true });
    window.addEventListener("resize", invalidateRect, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", invalidateRect);
      window.removeEventListener("resize", invalidateRect);
      if (frame) cancelAnimationFrame(frame);
      element.style.removeProperty("--magnet-x");
      element.style.removeProperty("--magnet-y");
    };
  }, [ref]);
}
