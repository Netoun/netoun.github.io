import { useEffect, useRef, useState } from "react";

/**
 * Hook to create a parallax scroll effect
 * @param speed - Parallax speed factor (0.5 = half the scroll speed)
 */
export function useParallaxScroll(speed = 0.5) {
  const elementRef = useRef<SVGSVGElement>(null);
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Client-only: skip if not in browser
    if (typeof window === "undefined") return;

    let ticking = false;

    const updateOffset = () => {
      const scrollY = window.scrollY;
      setOffset(scrollY * speed);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(updateOffset);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed]);

  return { elementRef, offset };
}
