import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  letterSpacing: "0.06em",
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

export const table = style({
  ...machine,
  width: "100%",
  marginTop: vars.spacing.sm,
  borderCollapse: "collapse",
  fontSize: "0.6875rem",
});

globalStyle(`${table} th, ${table} td`, {
  padding: "0.3125rem 0.1875rem",
  textAlign: "right",
  borderTop: `1px solid color-mix(in srgb, ${vars.colors.background} 9%, transparent)`,
});

globalStyle(`${table} thead th`, {
  borderTop: "none",
  color: vars.colors.mutedForegroundOnDark,
});

globalStyle(`${table} th:first-child`, { textAlign: "left" });

export const pulsing = style({ color: vars.colors.primary });

export const steps = style({
  display: "inline-flex",
  gap: "2px",
});

export const step = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "0.875rem",
  height: "1rem",
  borderRadius: "2px",
  color: vars.colors.mutedForegroundOnDark,
  selectors: {
    "&[data-now]": { color: vars.colors.foreground, backgroundColor: vars.colors.primary },
  },
});
