import { useEffect, useRef } from "react";
import type { PointerEvent } from "react";

// A wheel scroll moves content under a resting mouse, and the browser reports that as the
// pointer entering it. A branch lights only on a mouse move once the page has settled.
const SCROLL_SETTLE_MS = 200;

/**
 * Pointer handlers that light a branch of the work history: mouse only (touch has no hover
 * to leave), never while the page scrolls.
 */
export function useBranchHover(onLitBranchChange: (slug: string | null) => void) {
  const lastScrollRef = useRef(Number.NEGATIVE_INFINITY);

  useEffect(() => {
    const onScroll = () => {
      lastScrollRef.current = performance.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (slug: string) => ({
    onPointerMove: (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (performance.now() - lastScrollRef.current < SCROLL_SETTLE_MS) return;
      onLitBranchChange(slug);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === "mouse") onLitBranchChange(null);
    },
  });
}
