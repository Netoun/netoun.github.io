import { useEffect, useMemo, useRef } from "react";

export type MousePosition = {
  x: number;
  y: number;
};

type UseMousePositionParams = {
  container?: HTMLElement | Window;
};

export function useMousePosition({
  container = typeof window !== "undefined" ? window : undefined,
}: UseMousePositionParams = {}) {
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    // Client-only: skip if not in browser
    if (typeof window === "undefined") return;
    if (!container) return;

    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      // Mutate the existing object instead of replacing it
      // This keeps the reference stable and prevents rerenders
      mousePositionRef.current.x = mouseEvent.clientX;
      mousePositionRef.current.y = mouseEvent.clientY;
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [container]);

  // Return a stable object reference that doesn't change
  // The object is mutated internally, but the reference stays the same
  // This prevents rerenders while still allowing components to read the latest value
  return useMemo(() => mousePositionRef.current, []);
}
