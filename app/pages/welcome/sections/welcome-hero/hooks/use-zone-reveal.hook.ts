import { useEffect, useReducer, useRef } from "react";

/**
 * Staggered reveal of the hero computer's four zones: one zone per second once
 * `shouldAnimate` is on. Returns how many zones are visible (0 = splash).
 */
export function useZoneReveal(shouldAnimate: boolean): number {
  const [visibleZones, dispatch] = useReducer((_state: number, action: number) => action, 0);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    if (!shouldAnimate) return;

    // Reduced motion: no staggered fade-in — the screen is complete at once.
    if (hasRevealedRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hasRevealedRef.current = true;
      dispatch(4);
      return;
    }

    let zone = 1;
    const interval = setInterval(() => {
      dispatch(zone);
      zone += 1;
      if (zone > 4) {
        hasRevealedRef.current = true;
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldAnimate]);

  return visibleZones;
}
