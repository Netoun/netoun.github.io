import { setElementVars } from "@vanilla-extract/dynamic";
import { useEffect, useRef, type RefObject } from "react";
import { plateGlass } from "./footer-patch-plate.css";

// Where the glass catches the light when nothing points at it: its left edge, level with the
// plugged port (x and y in % of the plate).
const REST_X = 6;
// Easing of the light towards its target, per frame.
const FOLLOW = 0.18;

/**
 * Drives the faceplate's liquid highlight through `plateGlass` (two CSS variables, in
 * percentages): it follows a fine pointer over the plate, and otherwise rests on
 * the plugged port's row. No React render per frame; under reduced motion it jumps instead of
 * gliding, and never follows the pointer.
 */
export function usePlateLight(plateRef: RefObject<HTMLElement | null>, plugged: string | null) {
  const restRef = useRef<((portId: string | null) => void) | null>(null);

  useEffect(() => {
    const plate = plateRef.current;
    if (!plate) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let current: [number, number] = [REST_X, 50];
    let target: [number, number] = [REST_X, 50];
    let frame = 0;
    let pointing = false;

    const paint = () => {
      setElementVars(plate, {
        [plateGlass.x]: `${current[0].toFixed(2)}%`,
        [plateGlass.y]: `${current[1].toFixed(2)}%`,
      });
    };
    const step = () => {
      current = [
        current[0] + (target[0] - current[0]) * FOLLOW,
        current[1] + (target[1] - current[1]) * FOLLOW,
      ];
      paint();
      const settled = Math.abs(target[0] - current[0]) + Math.abs(target[1] - current[1]) < 0.05;
      frame = settled ? 0 : requestAnimationFrame(step);
    };
    const aim = (next: [number, number]) => {
      target = next;
      if (reducedMotion.matches) {
        current = next;
        paint();
        return;
      }
      if (!frame) frame = requestAnimationFrame(step);
    };
    const rest = (portId: string | null) => {
      if (pointing) return;
      const row = portId
        ? plate.querySelector(`[data-footer-socket="${portId}"]`)?.closest("a")
        : null;
      if (!row) {
        aim([REST_X, 50]);
        return;
      }
      const box = plate.getBoundingClientRect();
      const rowBox = row.getBoundingClientRect();
      aim([REST_X, ((rowBox.top + rowBox.height / 2 - box.top) / Math.max(box.height, 1)) * 100]);
    };
    const onMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      pointing = true;
      const box = plate.getBoundingClientRect();
      aim([
        ((event.clientX - box.left) / Math.max(box.width, 1)) * 100,
        ((event.clientY - box.top) / Math.max(box.height, 1)) * 100,
      ]);
    };
    const onLeave = () => {
      pointing = false;
      const socket = plate.querySelector('[data-plugged="true"] [data-footer-socket]');
      rest(socket?.getAttribute("data-footer-socket") ?? null);
    };

    restRef.current = rest;
    plate.addEventListener("pointermove", onMove);
    plate.addEventListener("pointerleave", onLeave);
    return () => {
      restRef.current = null;
      cancelAnimationFrame(frame);
      plate.removeEventListener("pointermove", onMove);
      plate.removeEventListener("pointerleave", onLeave);
    };
  }, [plateRef]);

  // The plug moved (keyboard, or the pointer left a port): the light follows it to its row.
  useEffect(() => {
    restRef.current?.(plugged);
  }, [plugged]);
}
