import { useEffect } from "react";

/** Attribute on `<html>` that turns the paper grain on (see global.css.ts). */
export const PAPER_GRAIN_ATTRIBUTE = "data-grain";

/**
 * Switches the paper's film grain on once the page has loaded. The grain is a 27 KB tile:
 * requested with the stylesheet, it competed with the hero's font for bandwidth and pushed the
 * mobile LCP back by ~240 ms. After `load` it costs the first paint nothing; without JS the paper
 * stays plain, as it was with the WebGL canvas the tile replaces.
 */
export function usePaperGrain() {
  useEffect(() => {
    const show = () => document.documentElement.setAttribute(PAPER_GRAIN_ATTRIBUTE, "");
    if (document.readyState === "complete") {
      show();
      return;
    }
    window.addEventListener("load", show, { once: true });
    return () => window.removeEventListener("load", show);
  }, []);
}
