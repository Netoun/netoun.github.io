import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const sectionStyle = style({
  position: "relative",
  overflow: "hidden",
  paddingTop: vars.spacing["3xl"],
  paddingBottom: vars.spacing["3xl"],
});

export const contentStyle = style({
  position: "relative",
  zIndex: 1,
});

// Colour key — mirrors the three tech-domain accents used by the skill pills.
export const legendStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.md,
  marginBottom: vars.spacing.md,
});

export const legendItemStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  color: vars.colors.foreground,
});

export const legendDotStyle = recipe({
  base: {
    width: "10px",
    height: "10px",
    borderRadius: vars.radius.full,
    flexShrink: 0,
  },
  variants: {
    domain: {
      frontend: { backgroundColor: vars.colors.secondary },
      backend: { backgroundColor: vars.colors.tertiary },
      creative: { backgroundColor: vars.colors.primary },
    },
  },
});

export const skillsGridStyle = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: vars.spacing.md,

  "@media": {
    [breakpoints.md]: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
});
