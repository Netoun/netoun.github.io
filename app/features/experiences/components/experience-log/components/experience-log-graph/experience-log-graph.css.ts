import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import {
  geometry,
  laneBottomVar,
  laneColors,
  laneTopVar,
  nodeLine,
  railColor,
} from "../../experience-log.css";

/** Where a row sits along its branch: 0 at the tip (the latest), 1 where it forked. */
export const alongVar = createVar();
const sizeVar = createVar();

/** The lane between lit (its tip, the latest) and deep (where it forked), in oklab. */
const along = (t: string) =>
  `color-mix(in oklab, ${laneTopVar} calc((1 - ${t}) * 100%), ${laneBottomVar})`;

const cell = `calc(${geometry.glyph} * 0.6)`;

export const graphStyle = style({
  position: "relative",
  alignSelf: "stretch",
  // The printed line, read back by useLineSnap to snap the row.
  lineHeight: geometry.line,
});

// Three glyph cells (main, the diagonals, the branch), clipped to the row: the rows are
// snapped to whole lines, so a run ends on a line boundary and the next row carries on.
export const columnsStyle = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  overflow: "hidden",
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontSize: geometry.glyph,
  lineHeight: geometry.line,
  letterSpacing: 0,
  textAlign: "center",
  whiteSpace: "pre",
  userSelect: "none",
  // The page's grayscale smoothing thins Doto on macOS and opens seams between its dots; the
  // graph's strokes keep the system's default, as a terminal prints them.
  WebkitFontSmoothing: "auto",
});

export const columnStyle = style({
  display: "flex",
  flexDirection: "column",
  width: cell,
  minHeight: 0,
});

const tones = {
  // main's rail, and its merges and root.
  rail: { color: railColor },
  // main above its latest merge: `¦`, it has not moved since the open branch forked.
  wait: { color: `color-mix(in srgb, ${railColor} 60%, transparent)` },
  // A tip's `*`, HEAD's included: the lane at its most lit.
  lit: { color: laneTopVar },
  // The unlisted client work: `:` in the lane's deep end.
  deep: { color: laneBottomVar },
  // The branch folding back into main, and main opening the next one.
  fork: { color: `color-mix(in oklab, ${laneBottomVar} 60%, ${railColor})` },
  mergeIn: { color: `color-mix(in oklab, ${railColor} 40%, ${laneTopVar})` },
  // A client project's `*`: its own domain.
  frontend: { color: laneColors.frontend },
  backend: { color: laneColors.backend },
  creative: { color: laneColors.creative },
  systems: { color: laneColors.systems },
  // The branch's `|`: lit at its tip, deeper row by row down to where it forked. One solid
  // colour per row: a gradient clipped to the text breaks Doto's merged dots apart.
  lane: { color: along(alongVar) },
};

export type GlyphTone = keyof typeof tones;

/** A glyph on the row's first line: a node, a diagonal. */
export const glyphStyle = recipe({
  base: { display: "block", height: geometry.line, flexShrink: 0 },
  variants: { tone: tones },
});

/** The same glyph on every line below, as far as the row goes. */
export const runStyle = recipe({
  base: { display: "block", flex: 1, minHeight: 0, overflow: "hidden" },
  variants: { tone: tones },
});

// HEAD, the one live mark of the section: a gold pulse behind its `*`.
export const pingStyle = style({
  vars: { [sizeVar]: `calc(${geometry.glyph} * 0.8)` },
  position: "absolute",
  width: sizeVar,
  height: sizeVar,
  left: `calc(${cell} * 2.5 - ${sizeVar} / 2)`,
  top: `calc(${nodeLine} - ${sizeVar} / 2)`,
  borderRadius: vars.radius.full,
  backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 70%, transparent)`,
  animation: "log-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0,
    },
  },
});

// Off screen, the ping rests (ContentSection marks the section).
globalStyle(`[data-anim-disabled="true"] ${pingStyle}`, {
  animation: "none",
  opacity: 0,
});
