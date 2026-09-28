import { setElementVars } from "@vanilla-extract/dynamic";
import { type RefObject, useEffect } from "react";

/**
 * Snaps every `[data-line-row]` inside `root` to a whole number of printed lines, so a glyph
 * column clipped by its row ends on a line boundary and the next row carries on unbroken.
 * A row's height is read from its `[data-line-content]` child (never from the row, which the
 * snap itself grows) and written to `linesVar`; the line is the graph cell's line height.
 * Before this runs (prerender, no JS) the rows keep their natural height.
 */
export function useLineSnap(root: RefObject<HTMLElement | null>, linesVar: string) {
  useEffect(() => {
    const element = root.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const snap = (content: Element) => {
      const row = content.closest<HTMLElement>("[data-line-row]");
      const cell = row?.firstElementChild;
      if (!row || !cell) return;
      const line = Number.parseFloat(getComputedStyle(cell).lineHeight);
      if (!line) return;
      const height = content.getBoundingClientRect().bottom - row.getBoundingClientRect().top;
      // A hair under a whole line stays on it (sub-pixel rounding of the text).
      const lines = Math.max(1, Math.ceil(height / line - 0.05));
      setElementVars(row, { [linesVar]: String(lines) });
    };

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) snap(entry.target);
    });
    for (const content of element.querySelectorAll("[data-line-content]"))
      observer.observe(content);
    return () => observer.disconnect();
  }, [root, linesVar]);
}
