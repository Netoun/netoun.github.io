import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const landing = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing["2xl"],
  width: "100%",
  maxWidth: "72rem",
  marginInline: "auto",
});

export const intro = style({
  maxWidth: "44rem",
  marginTop: `calc(-1 * ${vars.spacing.lg})`,
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.relaxed,
  color: vars.colors.mutedForeground,
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
  gap: vars.spacing.lg,
});

export const card = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  padding: vars.spacing.lg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.colors.cardBorder}`,
  borderTop: "2px solid transparent",
  backgroundColor: vars.colors.card,
  color: vars.colors.foreground,
  textDecoration: "none",
  transition: "transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: vars.boxShadow.lg,
    },
    "&[data-accent='primary']": { borderTopColor: vars.colors.primary },
    "&[data-accent='secondary']": { borderTopColor: vars.colors.secondary },
    "&[data-accent='tertiary']": { borderTopColor: vars.colors.tertiary },
  },
});

export const cardIcon = style({
  fontSize: vars.fontSize["2xl"],
  lineHeight: 1,
});

export const cardGroup = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize["2xs"],
  fontWeight: vars.fontWeight.semibold,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const cardTitle = style({
  margin: 0,
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
});

export const cardDesc = style({
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: vars.lineHeight.relaxed,
  color: vars.colors.mutedForeground,
});
