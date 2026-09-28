import { createVar, style } from "@vanilla-extract/css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

/** Font size of the text, which is the height of a cell. */
export const cellSize = createVar();

// Phosphor: mint glyphs on the stage's ink. Ink: ink glyphs on lamp-lit paper.
export const screen = style({
  position: "relative",
  width: "100%",
  maxWidth: "48.5rem",
  // Square on a phone, so the grid keeps enough rows; the wide screen from 48em.
  aspectRatio: "1 / 1",
  "@media": {
    [breakpoints.md]: { aspectRatio: "778 / 410" },
  },
  overflow: "hidden",
  borderRadius: "0.75rem",
  selectors: {
    "&[data-palette='phosphor']": {
      color: vars.colors.secondary,
      textShadow: `0 0 6px color-mix(in srgb, ${vars.colors.secondary} 45%, transparent)`,
    },
    "&[data-palette='ink']": {
      color: vars.colors.foreground,
      backgroundColor: vars.colors.card,
      backgroundImage: `radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, white 70%, transparent), transparent 60%)`,
      boxShadow: `inset 0 2px 10px color-mix(in srgb, ${vars.colors.foreground} 14%, transparent)`,
    },
    "&[data-palette='phosphor'][data-xray]": { color: vars.colors.primary, textShadow: "none" },
    "&[data-palette='ink'][data-xray]": { color: vars.colors.tertiary },
  },
});

export const text = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: 0,
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: cellSize,
  lineHeight: 1,
  letterSpacing: 0,
  whiteSpace: "pre",
  userSelect: "none",
  cursor: "crosshair",
});

export const row = style({
  display: "block",
  height: cellSize,
});
