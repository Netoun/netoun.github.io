import { style } from "@vanilla-extract/css";
import { motion } from "@styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

export const controlPanel = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
});

export const controlGroup = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const controlGroupTitle = style({
  margin: 0,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  ...weight(vars.fontWeight.semibold),
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const controlRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
});

export const controlLabel = style({
  flexShrink: 0,
  minWidth: "2.5rem",
  fontSize: vars.fontSize.sm,
  ...weight(vars.fontWeight.medium),
  color: vars.colors.foreground,
});

export const controlSlider = style({
  flex: 1,
  color: vars.colors.foreground,
});

// An LCD readout: gold digits on an ink well.
export const controlValue = style({
  flexShrink: 0,
  minWidth: "3.75rem",
  height: "1.625rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "0 0.5rem",
  boxSizing: "border-box",
  borderRadius: "0.375rem",
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground})`,
  boxShadow: `inset 0 1px 2px oklch(0 0 0 / 0.6), 0 1px 0 color-mix(in srgb, white 70%, transparent)`,
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
  color: vars.colors.primary,
  textShadow: `0 0 6px color-mix(in srgb, ${vars.colors.primary} 45%, transparent)`,
  fontVariantNumeric: "tabular-nums",
});

// Segmented control: an ink well, the chosen option lit gold.
export const buttonRow = style({
  // An ink control: its focus ring is gold.
  vars: { [vars.colors.ring]: vars.colors.primary },
  display: "flex",
  flexWrap: "wrap",
  gap: "0.25rem",
  padding: "0.25rem",
  borderRadius: "0.75rem",
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground})`,
  boxShadow: `inset 0 1px 2px oklch(0 0 0 / 0.5), 0 1px 0 color-mix(in srgb, white 70%, transparent)`,
});

export const resetButton = style({
  width: "100%",
  minHeight: "2.75rem",
  padding: `0 ${vars.spacing.md}`,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radius.sm,
  background: "transparent",
  color: vars.colors.foreground,
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}, border-color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&[data-hovered]": {
      background: vars.colors.accent,
      borderColor: vars.colors.mutedForeground,
    },
    "&[data-disabled]": {
      cursor: "default",
      color: vars.colors.mutedForeground,
      borderStyle: "dashed",
    },
  },
});

export const optionButton = style({
  flex: 1,
  minWidth: "3rem",
  minHeight: "2.25rem",
  padding: `0 ${vars.spacing.sm}`,
  border: "none",
  borderRadius: "0.5rem",
  background: "transparent",
  color: `color-mix(in srgb, ${vars.colors.background} 62%, transparent)`,
  fontFamily: vars.fontFamily.doto,
  ...weight(900),
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: `color ${motion.duration.fast} ${motion.easing.out}, background-color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&:hover:not([data-active='true'])": {
      color: vars.colors.background,
    },
    "&[data-active='true']": {
      color: vars.colors.primaryForeground,
      background: vars.colors.primary,
      boxShadow: `inset 0 1px 0 color-mix(in srgb, white 45%, transparent), 0 1px 2px oklch(0 0 0 / 0.4)`,
    },
  },
});
