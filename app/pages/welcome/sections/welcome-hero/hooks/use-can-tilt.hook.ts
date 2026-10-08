import { useEffect, useState } from "react";

/** Tilt only for desktop pointers, never under prefers-reduced-motion. */
export function useCanTilt(): boolean {
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setCanTilt(finePointer.matches && !reducedMotion.matches);
    };

    update();
    finePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      finePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  return canTilt;
}
