import { style } from "@vanilla-extract/css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

export const welcomeHeroComputerWrapperStyles = style({
  position: "absolute",
  zIndex: 10,
  bottom: 0,
  right: "5vw",
  filter: `drop-shadow(0 0 2.5rem color-mix(in srgb, ${vars.colors.secondary} 30%, transparent))`,
  width: "300px",
  selectors: {
    ':global([data-quality="high"]) &': {
      filter: `drop-shadow(0 0 3.5rem color-mix(in srgb, ${vars.colors.secondary} 70%, transparent))`,
    },
  },
  "@media": {
    [breakpoints.md]: {
      width: "400px",
    },
    [breakpoints.xl]: {
      width: "600px",
    },
  },
});

export const welcomeHeroComputerCapturesStyles = style({
  width: "100%",
  userSelect: "none",
  pointerEvents: "none",
  transformStyle: "preserve-3d",
  transform:
    "rotateY(var(--mouse-position-x)) rotateX(var(--mouse-position-y)) translateZ(0)",
  willChange: "transform",
  backfaceVisibility: "hidden",
});

const gridBase = {
  borderRadius: vars.radius.sm,
  background: `color-mix(in srgb, ${vars.colors.background} 10%, transparent)`,
};

export const welcomeHeroComputerStyles = style({
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.bold,
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gridTemplateRows: "repeat(3, 1fr)",
  width: "100%",
  height: "100%",
  padding: vars.spacing.sm,
  gap: vars.spacing.xs,
  background: `color-mix(in srgb, ${vars.colors.background} 10%, transparent)`,
});

export const zone1Styles = style({
  ...gridBase,
  gridColumn: "1 / 3",
  gridRow: "1 / 2",
  overflow: "hidden",
});

export const zone2Styles = style({
  ...gridBase,
  gridColumn: "3 / 4",
  gridRow: "1 / 3",
});

export const zone3Styles = style({
  ...gridBase,
  gridColumn: "1 / 3",
  gridRow: "2 / 4",
});

export const zone4Styles = style({
  ...gridBase,
  gridColumn: "3 / 4",
  gridRow: "3 / 4",
});
