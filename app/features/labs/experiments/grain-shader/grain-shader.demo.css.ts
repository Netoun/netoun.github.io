import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

/** The loupe's factor, and the tile's size once magnified (CSS px). */
export const zoom = createVar();
export const tileSize = createVar();

const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontVariantNumeric: "tabular-nums",
} as const;

export const stage = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  justifyContent: "center",
  gap: `${vars.spacing.lg} 2.75rem`,
  width: "100%",
});

export const panes = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: vars.spacing.md,
  flex: "1 1 26rem",
  minWidth: 0,
  maxWidth: "34rem",
  "@media": {
    [breakpoints.sm]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  },
});

export const pane = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  margin: 0,
});

// The site's paper, as the body wears it.
export const paper = style({
  position: "relative",
  aspectRatio: "1",
  overflow: "hidden",
  borderRadius: vars.radius.sm,
  backgroundColor: vars.colors.background,
});

// Both panes go through the same loupe: drawn at one cell per device pixel, then scaled from
// the top left with nearest-neighbour sampling, so a cell grows into a block you can count.
export const magnify = style({
  position: "absolute",
  inset: 0,
  transformOrigin: "0 0",
  transform: `scale(${zoom})`,
  imageRendering: "pixelated",
});

export const baked = style({
  backgroundImage: [
    "url(/images/grain-tile@1x.webp)",
    "image-set(url(/images/grain-tile@1x.webp) 1x, url(/images/grain-tile@2x.webp) 2x)",
  ],
  backgroundSize: "128px 128px",
});

// Xray: the tile's seams, every `tileSize`.
export const seams = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  backgroundImage: `linear-gradient(90deg, ${vars.colors.secondary} 1px, transparent 1px), linear-gradient(${vars.colors.secondary} 1px, transparent 1px)`,
  backgroundSize: `${tileSize} ${tileSize}`,
  opacity: 0.8,
});

export const caption = style({
  ...machine,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  fontSize: "0.6875rem",
  color: vars.colors.mutedForegroundOnDark,
});

export const captionName = style({ color: vars.colors.background });

export const differs = style({ color: vars.colors.primary });

export const histogram = style({
  ...machine,
  width: "100%",
  margin: `${vars.spacing.md} 0 0`,
  borderCollapse: "collapse",
  tableLayout: "fixed",
  fontSize: "0.6875rem",
  color: vars.colors.mutedForegroundOnDark,
});

globalStyle(`${histogram} th, ${histogram} td`, {
  padding: "0.1875rem 0.25rem",
  textAlign: "right",
  ...weight(800),
});

globalStyle(`${histogram} thead th`, { color: vars.colors.background });
globalStyle(`${histogram} th:first-child`, { width: "3rem", textAlign: "left" });
globalStyle(`${histogram} th:last-child`, { width: "3.5rem" });

// Darken grows to the left, lighten to the right, from the middle.
export const bar = style({
  display: "block",
  height: "0.5rem",
  borderRadius: "1px",
  selectors: {
    "&[data-side='darken']": { marginLeft: "auto", backgroundColor: "oklch(0.55 0.25 300)" },
    "&[data-side='lighten']": { backgroundColor: "oklch(0.9 0.16 95)" },
  },
});

/** A bar's share of the tile, 0–100 %. */
export const share = createVar();

export const barFill = style({ width: share });

export const srOnly = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});
