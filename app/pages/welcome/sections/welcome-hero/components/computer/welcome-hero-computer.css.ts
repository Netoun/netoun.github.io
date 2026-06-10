import { keyframes, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";

// Fin de la cascade d'entrée du hero (titre → texte → CTA → laptop).
// Pas de `to` : chaque propriété revient à sa valeur de repos (0.94 ou 1 selon data-quality).
const computerEnter = keyframes({
  from: { opacity: 0, transform: "translateY(24px)" },
});

export const welcomeHeroComputerWrapperStyles = style({
  position: "absolute",
  isolation: "isolate",
  contain: "layout paint style",
  zIndex: 10,
  bottom: "0rem",
  right: "5vw",
  opacity: 0.94,
  filter: `drop-shadow(0 0 3rem color-mix(in srgb, ${vars.colors.secondary} 42%, transparent))`,
  width: "max(100%, 400px)",
  maxWidth: "100%",
  animation: `${computerEnter} ${motion.duration.slow} ${motion.easing.signature} 400ms backwards`,
  selectors: {
    ':global([data-quality="high"]) &': {
      opacity: 1,
      filter: `drop-shadow(0 0 4.2rem color-mix(in srgb, ${vars.colors.secondary} 76%, transparent))`,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
    [breakpoints.md]: {
      bottom: "0.5rem",
      width: "460px",
    },
    [breakpoints.xl]: {
      bottom: "1rem",
      width: "640px",
    },
    [breakpoints["2k"]]: {
      bottom: "2rem",
      right: "8vw",
      width: "820px",
    },
  },
});

export const welcomeHeroComputerCapturesStyles = style({
  width: "100%",
  userSelect: "none",
  pointerEvents: "none",
  transformStyle: "preserve-3d",
  transform:
    "rotateY(calc(var(--mouse-position-x) * 1.8)) rotateX(calc(var(--mouse-position-y) * 1.8)) translateZ(0)",
  willChange: "transform",
  backfaceVisibility: "hidden",
});

const gridBase = {
  borderRadius: vars.radius.sm,
  background: `color-mix(in srgb, ${vars.colors.background} 10%, transparent)`,
  transition: "opacity 0.4s ease-out",
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
  pointerEvents: "auto",
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

export const splashStyles = style({
  gridColumn: "1 / -1",
  gridRow: "1 / -1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  color: vars.colors.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
});
