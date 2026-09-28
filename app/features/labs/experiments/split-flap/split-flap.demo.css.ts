import { globalStyle, style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// The board stands on the stage's drafting sheet; the xray prints on the same paper, in ink.
const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontVariantNumeric: "tabular-nums",
} as const;

export const stage = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.spacing.lg,
  width: "100%",
  maxWidth: "46rem",
});

export const xray = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: vars.spacing.md,
  width: "100%",
  paddingTop: vars.spacing.md,
  borderTop: `1px solid color-mix(in srgb, ${vars.colors.foreground} 14%, transparent)`,
  animation: `labs-row ${motion.duration.base} ${motion.easing.signature} both`,
  "@media": {
    [breakpoints.md]: { gridTemplateColumns: "minmax(0, 1fr) 13rem" },
  },
});

// One flap pulled apart in depth: the static halves at the back, the two leaves in front,
// each caught mid-flip. Only the cards turn; their labels stay flat and readable.
export const specimen = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "11rem",
  perspective: "40rem",
  perspectiveOrigin: "50% 45%",
});

export const specimenRig = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, 7rem)",
  justifyContent: "center",
  gap: `${vars.spacing.lg} ${vars.spacing.sm}`,
  transformStyle: "preserve-3d",
  "@media": {
    [breakpoints.md]: { gridTemplateColumns: "repeat(4, 7rem)", gap: vars.spacing.sm },
  },
});

export const piece = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: vars.spacing.sm,
  transformStyle: "preserve-3d",
});

export const pieceCard = style({
  position: "relative",
  width: "4rem",
  height: "2.875rem",
  overflow: "hidden",
  boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${vars.colors.secondary} 60%, transparent), 0 8px 14px -8px oklch(0 0 0 / 0.6)`,
  transform: "rotateY(-18deg) translateZ(-1.5rem)",
  selectors: {
    "&[data-half='top']": {
      borderRadius: "0.375rem 0.375rem 0 0",
      backgroundImage: "linear-gradient(180deg, oklch(0.25 0.004 80), oklch(0.18 0.004 80))",
    },
    "&[data-half='bottom']": {
      borderRadius: "0 0 0.375rem 0.375rem",
      backgroundImage: "linear-gradient(180deg, oklch(0.16 0.004 80), oklch(0.12 0.004 80))",
    },
    [`${piece}[data-piece='leaf-top'] &`]: {
      transformOrigin: "50% 100%",
      transform: "rotateY(-18deg) translateZ(1.5rem) rotateX(-38deg)",
    },
    [`${piece}[data-piece='leaf-bottom'] &`]: {
      transformOrigin: "50% 0",
      transform: "rotateY(-18deg) translateZ(1.5rem) rotateX(38deg)",
    },
  },
});

export const pieceGlyph = style({
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "200%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: vars.fontFamily.ppNeueMontreal,
  ...weight(700),
  fontSize: "3.75rem",
  lineHeight: 1,
  color: vars.colors.background,
  selectors: {
    "&[data-half='bottom']": { top: "-100%" },
  },
});

export const pieceLabel = style({
  ...machine,
  maxWidth: "7rem",
  fontSize: "0.625rem",
  lineHeight: 1.3,
  textAlign: "center",
  color: vars.colors.foreground,
});

export const facts = style({
  ...machine,
  display: "grid",
  gridTemplateColumns: "auto minmax(0, 1fr)",
  gap: "0.375rem 0.75rem",
  alignContent: "center",
  margin: 0,
  fontSize: vars.fontSize.xs,
});

globalStyle(`${facts} > dt`, { color: vars.colors.mutedForeground });
globalStyle(`${facts} > dd`, { margin: 0 });

export const drum = style({
  ...machine,
  ...weight(900),
  gridColumn: "1 / -1",
  display: "flex",
  flexWrap: "wrap",
  gap: "2px",
  margin: 0,
  padding: 0,
  listStyle: "none",
  fontSize: vars.fontSize.xs,
});

export const drumGlyph = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "1.125rem",
  height: "1.375rem",
  borderRadius: "0.1875rem",
  color: vars.colors.mutedForeground,
  selectors: {
    "&[data-path]": {
      color: vars.colors.foreground,
      backgroundColor: `color-mix(in srgb, ${vars.colors.secondary} 26%, transparent)`,
    },
    "&[data-target]": { boxShadow: `inset 0 -2px 0 ${vars.colors.foreground}` },
    "&[data-current]": { color: vars.colors.background, backgroundColor: vars.colors.foreground },
  },
});

export const field = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
});

export const fieldLabel = style({
  flexShrink: 0,
  minWidth: "2.5rem",
  fontSize: vars.fontSize.sm,
  ...weight(500),
});

// Typed on the board's own ink, in the board's own glyphs.
export const fieldInput = style({
  // An ink control: its focus ring is gold.
  vars: { [vars.colors.ring]: vars.colors.primary },
  flex: 1,
  minWidth: 0,
  height: "2.25rem",
  padding: "0 0.625rem",
  border: "none",
  borderRadius: "0.375rem",
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground})`,
  boxShadow: `inset 0 1px 2px oklch(0 0 0 / 0.6), 0 1px 0 color-mix(in srgb, white 70%, transparent)`,
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: vars.colors.primary,
});

export const hint = style({
  ...machine,
  margin: 0,
  fontSize: "0.6875rem",
  lineHeight: 1.4,
  textTransform: "none",
  color: vars.colors.mutedForeground,
});
