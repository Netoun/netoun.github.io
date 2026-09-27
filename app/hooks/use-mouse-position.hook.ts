import { type RefObject, useEffect, useRef } from "react";

export type MousePosition = {
  x: number;
  y: number;
};

/**
 * Tracks the pointer in viewport coordinates without re-rendering.
 *
 * Returns a stable ref: read `.current` from effects or animation frames, never
 * during render. Listens on `target` when provided, on `window` otherwise.
 * `{ x: 0, y: 0 }` means no pointer event has been received yet.
 */
export function useMousePosition(target?: RefObject<HTMLElement | null>): RefObject<MousePosition> {
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const container: HTMLElement | Window = target?.current ?? window;

    const handleMouseMove = (event: Event) => {
      if (!(event instanceof MouseEvent)) return;
      mousePositionRef.current.x = event.clientX;
      mousePositionRef.current.y = event.clientY;
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [target]);

  return mousePositionRef;
}
