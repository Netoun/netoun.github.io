import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

type HeldKey = "up" | "down" | "enter";
// Keys the grid answers to, mirrored on the key bar's keycaps while held.
const HELD_KEYS: Partial<Record<string, HeldKey>> = {
  ArrowUp: "up",
  ArrowDown: "down",
  Enter: "enter",
};

/**
 * Tracks which grid key is held (for the key bar's keycap feedback) and the type of the last
 * pointer that pressed a row (React Aria runs the row action on a tap, so the action reads it).
 */
export function useHeldKeys(gridRef: RefObject<HTMLDivElement | null>) {
  const [heldKey, setHeldKey] = useState<HeldKey | null>(null);
  const pointerTypeRef = useRef<string>("mouse");

  // Listens on the grid itself (never the document): only keys typed in the projects count.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const onKeyDown = (event: KeyboardEvent) => {
      pointerTypeRef.current = "keyboard";
      const key = HELD_KEYS[event.key];
      if (key) setHeldKey(key);
    };
    const onPointerDown = (event: PointerEvent) => {
      pointerTypeRef.current = event.pointerType;
    };
    const release = () => setHeldKey(null);
    grid.addEventListener("keydown", onKeyDown);
    grid.addEventListener("pointerdown", onPointerDown, { capture: true });
    grid.addEventListener("keyup", release);
    grid.addEventListener("focusout", release);
    return () => {
      grid.removeEventListener("keydown", onKeyDown);
      grid.removeEventListener("pointerdown", onPointerDown, { capture: true });
      grid.removeEventListener("keyup", release);
      grid.removeEventListener("focusout", release);
    };
  }, [gridRef]);

  return { heldKey, pointerTypeRef };
}
