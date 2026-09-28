import { createVar, keyframes, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";
import { specNoteDelay } from "../spec-note/welcome-hero-spec-note.css";
import {
  heroSpecLit,
  heroSpecMotionMedia,
  heroSpecOnSelector,
  specDim,
  specDrawX,
  specInk,
  specLift,
  specTransition,
} from "../../welcome-hero-spec.css";
import {
  heroColumnGutter,
  heroLaptopAspect,
  heroPanelPadding,
  heroSideBySide2kMedia,
  heroSideBySideMedia,
  heroSideBySideXlMedia,
  heroStackedLaptopWidth,
} from "../../welcome-hero-layout.css";

// Fin de la cascade d'entrée du hero (titre → texte → CTA → laptop).
// Pas de `to` : chaque propriété revient à sa valeur de repos (0.94 ou 1 selon data-quality).
const computerEnter = keyframes({
  from: { opacity: 0, transform: "translateY(24px)" },
});

// Laptop width whose top edge clears the headline block (`headlineBottom` from
// the viewport top): scene height ≈ width × heroLaptopAspect.
const sideBySideWidthForHeight = (headlineBottom: string) =>
  `calc((100svh - ${headlineBottom}) / ${heroLaptopAspect})`;

export const welcomeHeroComputerWrapperStyles = style({
  position: "absolute",
  zIndex: 10,
  // The box overlaps the end of the lead's lines: only the screen takes the
  // pointer, so that text stays selectable under it.
  pointerEvents: "none",
  display: "flex",
  flexDirection: "column",
  // Stacked under the text: centred in the space the container reserves.
  bottom: vars.spacing.sm,
  insetInline: 0,
  marginInline: "auto",
  width: heroStackedLaptopWidth.base,
  animation: `${computerEnter} ${motion.duration.slow} ${motion.easing.signature} 400ms backwards`,
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: "-10%",
      zIndex: -1,
      pointerEvents: "none",
      background: `radial-gradient(ellipse at 70% 70%, color-mix(in srgb, ${vars.colors.secondary} 42%, transparent), transparent 70%)`,
      filter: "blur(3rem)",
    },
    '[data-quality="high"] &::before': {
      background: `radial-gradient(ellipse at 70% 70%, color-mix(in srgb, ${vars.colors.secondary} 76%, transparent), transparent 70%)`,
      filter: "blur(4.2rem)",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
    // Right edge on the page's content column, like the text's left edge.
    [breakpoints.md]: {
      left: "auto",
      right: `calc(${heroColumnGutter} + ${heroPanelPadding.md})`,
      marginInline: 0,
      width: heroStackedLaptopWidth.md,
    },
    [breakpoints.lg]: {
      right: `calc(${heroColumnGutter} + ${heroPanelPadding.lg})`,
    },
    // Beside the text, the lid's top-left corner must stay under the headline:
    // on short screens the laptop shrinks with the viewport height instead.
    [heroSideBySideMedia]: {
      width: `min(460px, ${sideBySideWidthForHeight("24rem")})`,
    },
    [heroSideBySideXlMedia]: {
      bottom: vars.spacing.lg,
      width: `min(640px, ${sideBySideWidthForHeight("24rem")})`,
    },
    [heroSideBySide2kMedia]: {
      bottom: vars.spacing["2xl"],
      width: `min(820px, ${sideBySideWidthForHeight("30rem")})`,
    },
  },
});

/** The pointer tilt vars are scaled by this in the transform (the spec note prints the product). */
export const heroComputerTiltScale = 1.8;

/** Resting pose, in tilt-var degrees (before the scale). */
export const heroComputerBaseTilt: { readonly x: number; readonly y: number } = { x: 3, y: -3 };

/** Tilt written by the pointer loop, in degrees before the scale. */
export const heroComputerTiltX = createVar();
export const heroComputerTiltY = createVar();

export const welcomeHeroComputerCapturesStyles = style({
  vars: {
    [heroComputerTiltX]: `${heroComputerBaseTilt.x}deg`,
    [heroComputerTiltY]: `${heroComputerBaseTilt.y}deg`,
  },
  width: "100%",
  userSelect: "none",
  pointerEvents: "none",
  transformStyle: "preserve-3d",
  transform: `rotateY(calc(${heroComputerTiltX} * ${heroComputerTiltScale})) rotateX(calc(${heroComputerTiltY} * ${heroComputerTiltScale})) translateZ(0)`,
  willChange: "transform",
  backfaceVisibility: "hidden",
});

const gridBase = {
  borderRadius: vars.radius.sm,
  background: `color-mix(in srgb, ${vars.colors.background} 10%, transparent)`,
  transition: "opacity 0.4s ease-out",
  // Zones light up one by one after the boot splash.
  selectors: {
    '&[data-revealed="false"]': { opacity: 0 },
  },
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
  // The laptop's hover target (the wrapper lets the pointer through).
  pointerEvents: "auto",
});

// Spec layer: a dashed selection box on the screen's plane, so it tilts with
// the laptop; its ants march while the laptop is lit.
const antsDash = `${specInk.line} 50%, transparent 0`;
const ants = keyframes({
  to: { backgroundPosition: "8px 0, -8px 100%, 0 -8px, 100% 8px" },
});

export const welcomeHeroComputerSelectionStyles = style({
  position: "absolute",
  inset: `calc(-1 * ${vars.spacing.sm})`,
  pointerEvents: "none",
  backgroundImage: `linear-gradient(90deg, ${antsDash}), linear-gradient(90deg, ${antsDash}), linear-gradient(0deg, ${antsDash}), linear-gradient(0deg, ${antsDash})`,
  backgroundSize: "8px 1px, 8px 1px, 1px 8px, 1px 8px",
  backgroundPosition: "0 0, 0 100%, 0 0, 100% 0",
  backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
  // The lid faces render at 0.5 opacity: these values land at 0.16 and 0.5.
  opacity: `calc((0.32 + 0.68 * ${specLift}) * ${specDim})`,
  transition: specTransition,
  "@media": {
    [heroSpecMotionMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &`]: {
          animation: `${specDrawX} 1100ms ${motion.easing.signature} 1400ms backwards, ${ants} 1.2s linear infinite`,
          animationPlayState: "running, paused",
        },
        [heroSpecLit.laptop]: {
          animationPlayState: "running, running",
        },
      },
    },
  },
});

export const welcomeHeroComputerNoteStyles = style({
  right: 0,
  bottom: `calc(100% + ${vars.spacing.sm})`,
  vars: { [specNoteDelay]: "1700ms" },
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
  display: "grid",
  placeItems: "center",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  color: vars.colors.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
});

// Boot sequence in pure CSS: it plays from first paint, with or without JS, and
// rests on "System ready." — the frame the prerendered HTML shows for good.
// Timeline starts with the laptop's entrance (400ms delay, see computerEnter).
const BOOT_STEP_MS = 200;
const BOOT_START_MS = 400;
// Intermediate steps before "System ready." — keep in sync with the splash markup.
const BOOT_STEP_COUNT = 4;
const bootStepDelay = (index: number) => `${BOOT_START_MS + index * BOOT_STEP_MS}ms`;

const bootStepVisible = keyframes({
  "from, to": { opacity: 1 },
});

const bootCursorBlink = keyframes({
  "50%": { opacity: 0 },
});

export const splashStepStyles = style({
  gridArea: "1 / 1",
  opacity: 0,
  animationName: bootStepVisible,
  animationDuration: `${BOOT_STEP_MS}ms`,
  animationTimingFunction: "steps(1)",
  selectors: Object.fromEntries(
    Array.from({ length: BOOT_STEP_COUNT }, (_, index) => [
      `&:nth-child(${index + 1})`,
      { animationDelay: bootStepDelay(index) },
    ]),
  ),
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

// Last step: visible by default (no-JS, reduced motion), hidden only until its turn.
const bootFinalHold = keyframes({
  from: { opacity: 0 },
  to: { opacity: 0 },
});

export const splashFinalStepStyles = style({
  gridArea: "1 / 1",
  animationName: bootFinalHold,
  animationDuration: "1ms",
  animationDelay: bootStepDelay(BOOT_STEP_COUNT),
  animationFillMode: "backwards",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

export const splashCursorStyles = style({
  animation: `${bootCursorBlink} 530ms steps(1) infinite`,
});
