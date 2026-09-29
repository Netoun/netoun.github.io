import { createVar, style } from "@vanilla-extract/css";
import { swatch } from "../../components/labs-readout/labs-readout.css";
import { vars } from "@/styles/theme.css";

export const stage = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
  gap: `${vars.spacing.lg} 2.75rem`,
});

// The canvas's xray colours (app/components/misc/cybernetic-glyph-grid), as swatches.
export const swatches = {
  touched: style([swatch, { boxShadow: `0 0 0 1.5px ${vars.colors.primary}` }]),
  glitching: style([swatch, { boxShadow: "0 0 0 1px oklch(0.62 0.25 313)" }]),
  accent: style([swatch, { backgroundColor: "oklch(0.71 0.17 336)" }]),
  atlas: style([swatch, { backgroundColor: "oklch(0.82 0.15 130)" }]),
};

/** The packed sheet's width / height, measured when the atlas grows. */
export const atlasAspect = createVar();

// The sheet keeps growing (hundreds of bitmaps): a fixed window on its first rows.
export const atlasWindow = style({
  maxHeight: "8.5rem",
  marginTop: vars.spacing.sm,
  overflow: "hidden",
  maskImage: "linear-gradient(180deg, black 70%, transparent)",
});

export const atlas = style({
  display: "block",
  width: "100%",
  height: "auto",
  aspectRatio: atlasAspect,
  borderRadius: "2px",
  backgroundColor: "oklch(0.1 0.02 220)",
  imageRendering: "pixelated",
});
