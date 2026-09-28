import { style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// The readout is printed on the stage's ink: paper at set strengths, the cell colours of the
// canvas's xray (app/components/misc/glitch-signal-map) as swatches.
const paper = (percent: number) =>
  `color-mix(in srgb, ${vars.colors.background} ${percent}%, transparent)`;
const dim = vars.colors.mutedForegroundOnDark;
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
  alignItems: "center",
  justifyContent: "center",
  gap: `${vars.spacing.lg} 2.75rem`,
});

export const readout = style({
  display: "flex",
  flexDirection: "column",
  width: "18.75rem",
  maxWidth: "100%",
  color: vars.colors.background,
  animation: `labs-row ${motion.duration.base} ${motion.easing.signature} both`,
});

export const kicker = style({
  ...machine,
  ...weight(900),
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  color: vars.colors.primary,
});

export const tick = style({
  ...machine,
  ...weight(900),
  margin: `${vars.spacing.sm} 0 0`,
  fontSize: "1.75rem",
  lineHeight: 1.1,
  letterSpacing: "0.04em",
});

export const line = style({
  ...machine,
  margin: "0.375rem 0 0",
  fontSize: vars.fontSize.xs,
  color: dim,
});

export const walk = style({
  margin: "0.25rem 0 0",
  fontFamily: vars.fontFamily.mono,
  fontSize: vars.fontSize.xs,
  color: vars.colors.primary,
});

export const kinds = style({
  display: "flex",
  flexDirection: "column",
  margin: `${vars.spacing.md} 0 0`,
  padding: 0,
  listStyle: "none",
});

export const kind = style({
  display: "grid",
  gridTemplateColumns: "1.375rem minmax(0, 1fr) auto",
  columnGap: "0.625rem",
  rowGap: "0.125rem",
  alignItems: "center",
  padding: `${vars.spacing.sm} 0`,
  borderTop: `1px solid ${paper(9)}`,
});

export const swatch = style({
  width: "1.375rem",
  height: "0.5625rem",
  borderRadius: "1px",
  selectors: {
    "&[data-kind='idle']": { boxShadow: "inset 0 0 0 1px oklch(0.79 0.16 167 / 0.45)" },
    "&[data-kind='active']": { backgroundColor: "oklch(0.79 0.16 167)" },
    "&[data-kind='accent']": { backgroundColor: "oklch(0.71 0.17 335)" },
    "&[data-kind='recal']": {
      backgroundColor: "oklch(0.76 0.21 178)",
      boxShadow: "0 0 8px oklch(0.76 0.21 178)",
    },
    "&[data-kind='touched']": { boxShadow: `0 0 0 1.5px ${vars.colors.primary}` },
  },
});

export const kindLabel = style({
  ...machine,
  ...weight(900),
  fontSize: vars.fontSize.xs,
});

export const kindCount = style({
  ...machine,
  ...weight(900),
  fontSize: vars.fontSize.sm,
});

export const kindRule = style({
  gridColumn: "2 / 4",
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.6875rem",
  color: dim,
});

export const cell = style({
  minHeight: "1.125rem",
  margin: `${vars.spacing.sm} 0 0`,
  fontFamily: vars.fontFamily.mono,
  fontSize: "0.6875rem",
  color: dim,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const seedRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
});
