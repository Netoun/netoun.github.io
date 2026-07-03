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
  // 100% not 100vw: 100vw ignores the vertical scrollbar width and creates
  // a horizontal overflow on browsers with classic scrollbars.
  width: "100%",
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
      // Above the sections nav (z 40): the nav appears mid-hero and gets
      // uncovered by the panel's bottom edge as the hero scrolls away.
      zIndex: 41,
    },
  },
});

export const heroMorphFrame = style({
  position: "absolute",
  top: vars.spacing.sm,
  left: vars.spacing.sm,
  width: `calc(100% - (${vars.spacing.sm} * 2))`,
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
