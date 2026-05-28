import { style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

export const heroScrollMorphWrapper = style({
  position: "relative",
  height: "100vh",
  overflow: "visible",

  "@media": {
    [breakpoints.md]: {
      height: "200vh",
    },
  },
});

export const heroMorphStage = style({
  position: "relative",
  top: 0,
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  contain: "layout style paint",
  vars: {
    "--hero-scale": "1",
    "--hero-translate-y": "0px",
  } as Record<string, string>,

  "@media": {
    [breakpoints.md]: {
      position: "sticky",
      willChange: "transform",
    },
  },
});

export const heroMorphFrame = style({
  position: "absolute",
  top: vars.spacing.sm,
  left: vars.spacing.sm,
  width: `calc(100vw - (${vars.spacing.sm} * 2))`,
  height: `calc(100vh - (${vars.spacing.sm} * 2))`,
  overflow: "hidden",
  borderRadius: vars.radius.md,
  transform: "translate3d(0, var(--hero-translate-y), 0) scale(var(--hero-scale))",
  transformOrigin: "center top",

  "@media": {
    [breakpoints.md]: {
      borderRadius: vars.radius.xl,
      willChange: "transform",
    },
  },
});

export const heroMorphContent = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
});
