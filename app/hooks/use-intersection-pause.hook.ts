import { useEffect, useRef, useState } from "react";

interface UseIntersectionPauseOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to pause WebGL/canvas animations when the component
 * is not visible in the viewport.
 *
 * Typical usage with WebGL:
 * ```typescript
 * const { isVisible, ref } = useIntersectionPause({ threshold: 0.1 });
 *
 * useEffect(() => {
 *   if (!isVisible) return; // Skip rendering when invisible
 *   // ... WebGL setup
 * }, [isVisible]);
 * ```
 */
export function useIntersectionPause<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionPauseOptions = {},
) {
  const { threshold = 0, rootMargin = "0px", triggerOnce = false } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);

        // If triggerOnce is true, disconnect observer after first appearance
        if (triggerOnce && visible) {
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
