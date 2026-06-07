import { breakpoints } from "@styles/responsive.css";
import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const frame = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xl,
  width: "100%",
  maxWidth: "72rem",
  marginInline: "auto",
});

export const frameHeader = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const title = style({
  fontSize: vars.fontSize["2xl"],
  fontWeight: vars.fontWeight.extrabold,
  color: vars.colors.mutedForeground,
  fontFamily: vars.fontFamily.doto,
});

export const description = style({
  maxWidth: "48rem",
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
  color: vars.colors.mutedForeground,
});

export const tagRow = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.xs,
});

export const tagChip = style({
  padding: `2px ${vars.spacing.sm}`,
  borderRadius: vars.radius.full,
  border: `1px solid ${vars.colors.border}`,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const demoLayout = style({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: vars.spacing.lg,
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "minmax(0, 1fr) 18rem",
      alignItems: "start",
    },
  },
});

export const stage = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "28rem",
  padding: vars.spacing.xl,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.colors.cardBorder}`,
  overflow: "hidden",
  backgroundColor: vars.colors.card,
  backgroundImage: `
    linear-gradient(color-mix(in srgb, ${vars.colors.secondary} 12%, transparent) 0.1rem, transparent 0.1rem),
    linear-gradient(90deg, color-mix(in srgb, ${vars.colors.secondary} 12%, transparent) 0.1rem, transparent 0.1rem)
  `,
  backgroundSize: "4rem 4rem",
});

export const controlsAside = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  padding: vars.spacing.lg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.colors.cardBorder}`,
  backgroundColor: vars.colors.card,
  "@media": {
    [breakpoints.lg]: {
      position: "sticky",
      top: vars.spacing.lg,
    },
  },
});
