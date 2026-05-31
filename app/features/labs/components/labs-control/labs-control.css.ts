import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

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
  fontWeight: vars.fontWeight.semibold,
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
  fontWeight: vars.fontWeight.medium,
  color: vars.colors.foreground,
});

export const controlSlider = style({
  flex: 1,
  color: vars.colors.foreground,
});

export const controlValue = style({
  flexShrink: 0,
  width: "3.5rem",
  textAlign: "right",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  color: vars.colors.mutedForeground,
  fontVariantNumeric: "tabular-nums",
});

export const buttonRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.xs,
});

export const resetButton = style({
  width: "100%",
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radius.sm,
  background: "transparent",
  color: vars.colors.foreground,
  fontSize: vars.fontSize.sm,
  fontWeight: vars.fontWeight.medium,
  cursor: "pointer",
  transition: "background 0.15s ease, border-color 0.15s ease",
  selectors: {
    "&:hover": {
      background: vars.colors.accent,
      borderColor: vars.colors.mutedForeground,
    },
  },
});

export const optionButton = style({
  flex: 1,
  minWidth: "3rem",
  padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
  border: `1px solid ${vars.colors.border}`,
  borderRadius: vars.radius.sm,
  background: "transparent",
  color: vars.colors.mutedForeground,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.medium,
  cursor: "pointer",
  transition: "color 0.15s ease, background 0.15s ease, border-color 0.15s ease",
  selectors: {
    "&:hover": {
      color: vars.colors.foreground,
      borderColor: vars.colors.mutedForeground,
    },
    "&[data-active='true']": {
      color: vars.colors.primaryForeground,
      background: vars.colors.primary,
      borderColor: vars.colors.primary,
    },
  },
});
