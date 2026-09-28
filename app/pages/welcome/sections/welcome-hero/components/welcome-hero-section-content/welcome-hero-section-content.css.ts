import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";
import { specNoteDelay } from "../spec-note/welcome-hero-spec-note.css";
import {
  heroSpecLit,
  heroSpecRulesMedia,
  heroSpecRulesMotionMedia,
  heroSpecOnSelector,
  specDim,
  specDrawX,
  specDrawY,
  specInk,
  specLift,
  specSweepBackground,
  specSweepMask,
  specSweepWindow,
  specTransition,
} from "../../welcome-hero-spec.css";
import { weight } from "@styles/weight";

// Entrance: CSS from first paint, so it runs before hydration and never hides
// text that is already on screen. It starts from a dimmed, *visible* state (LCP
// counts it at once) and settles on the house curve; the cascade is heading →
// lead → actions, then the laptop (its own 400ms-delayed entrance).
// Reduced motion: none at all — the global rule only shortens the duration, and
// the `backwards` fill would still hold the dimmed state through each delay.
const heroTextSettle = keyframes({
  from: { opacity: 0.25, transform: "translateY(0.75rem)" },
});

const settle = (duration: string, delay: string) =>
  `${heroTextSettle} ${duration} ${motion.easing.signature} ${delay} backwards`;

const reducedMotion = "(prefers-reduced-motion: reduce)";

export const welcomeContentStyle = style({
  position: "relative",
  zIndex: 20,
  // A flex item: without this the swatch block's min-content width stretched the column
  // past a 320px screen and clipped the headline.
  minWidth: 0,
  color: vars.colors.background,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,

  "@media": {
    [breakpoints.md]: {
      gap: vars.spacing["2xl"],
    },
    [breakpoints["2k"]]: {
      gap: vars.spacing["3xl"],
    },
  },
});

/** Headline leading from lg; its line box feeds the spec layer (baselines, gutter dimension). */
const HEADING_LEADING = "0.8";

/** Line height of the headline where the spec shows (xl+), for layers laid out outside the h1. */
export const welcomeHeadingLineHeight = {
  lg: `calc(${vars.fontSize["7xl"]} * ${HEADING_LEADING})`,
  "2k": `calc(${vars.fontSize["8xl"]} * ${HEADING_LEADING})`,
} as const;

// Baseline of each headline line inside its line box: half the box plus half of
// (ascent - descent). 0.356em is PP Neue Montreal's, measured in the browser
// (72.5px from the top of a 96px / 76.8px line, 91px for 120px / 96px).
const baselineInLineBox = "calc(0.5lh + 0.356em)";

const baselines = (color: string) =>
  `linear-gradient(to bottom, transparent calc(${baselineInLineBox} - 1px), ${color} calc(${baselineInLineBox} - 1px), ${color} ${baselineInLineBox}, transparent ${baselineInLineBox})`;

const headingSpecLayer = {
  content: "",
  position: "absolute",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
  // One line box per tile, so it holds whatever the wrap.
  backgroundSize: "100% 1lh",
} as const;

export const welcomeHeadingBlockStyles = style({
  position: "relative",
});

export const welcomeHeadingNoteStyles = style({
  top: 0,
  right: 0,
  vars: { [specNoteDelay]: "1000ms" },
});

export const welcomeHeadingStyles = style({
  position: "relative",
  fontFeatureSettings: '"liga" 1, "clig" 1',
  fontStyle: "italic",
  ...weight(vars.fontWeight.bold),
  fontSize: vars.fontSize["4xl"],
  letterSpacing: "-0.035em",
  lineHeight: "0.9",
  // Wider than "Full-stack engineer &", narrower than "… & creative": the break
  // stays on the ampersand at every size, whatever the column width.
  maxWidth: "11em",
  textShadow: vars.textShadow.glow,
  animation: settle("700ms", "0ms"),

  selectors: {
    "&::selection": {
      backgroundColor: vars.colors.primary,
      color: vars.colors.foreground,
      textShadow: "none",
    },
    '[data-text-selected="true"] &': {
      textShadow: "none",
    },
  },

  "@media": {
    [breakpoints.sm]: {
      fontSize: vars.fontSize["5xl"],
    },
    [breakpoints.md]: {
      fontSize: vars.fontSize["6xl"],
      letterSpacing: "-0.04em",
      lineHeight: "0.9",
    },
    [breakpoints.lg]: {
      fontSize: vars.fontSize["7xl"],
      letterSpacing: "-0.045em",
      lineHeight: HEADING_LEADING,
    },
    [breakpoints["2k"]]: {
      fontSize: vars.fontSize["8xl"],
    },
    [reducedMotion]: {
      animation: "none",
    },
    // Spec layer: a mint rule on every baseline (::after), and a pulse running
    // along them each time the headline lights up (::before).
    [heroSpecRulesMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &::after`]: {
          ...headingSpecLayer,
          backgroundImage: baselines(specInk.mint),
          opacity: `calc((0.14 + 0.41 * ${specLift}) * ${specDim})`,
          transition: specTransition,
        },
        [heroSpecLit.heading.replaceAll("&", "&::before")]: {
          ...headingSpecLayer,
          backgroundImage: baselines(specInk.mint),
          maskImage: "linear-gradient(100deg, transparent, #000 50%, transparent)",
          maskSize: `${specSweepWindow} 100%`,
          maskRepeat: "no-repeat",
          maskPosition: `-${specSweepWindow} 0`,
        },
      },
    },
    [heroSpecRulesMotionMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &::after`]: {
          animation: `${specDrawX} 900ms ${motion.easing.signature} 500ms backwards`,
        },
        [heroSpecLit.heading.replaceAll("&", "&::before")]: {
          animation: `${specSweepMask} 900ms ${motion.easing.signature} both`,
        },
      },
    },
  },
});

/**
 * The lead's measure; its block (and the spec's measure line) share it. From lg
 * to xl the laptop sits beside it and its screen starts ~530px into the column:
 * 40rem ran the line ends under the lid.
 */
const leadMeasure = { base: "40rem", lg: "32rem", xl: "40rem", "2k": "42rem" } as const;

// Spec layer around the lead: an I-beam bracket on its left (::before) and a
// dimension line under its measure (::after), both on the block.
const leadSpecLayer = {
  content: "",
  position: "absolute",
  pointerEvents: "none",
  color: specInk.line,
  opacity: `calc((0.18 + 0.42 * ${specLift}) * ${specDim})`,
  transition: specTransition,
} as const;

/** Offset of the measure line under the lead. */
const leadMeasureGap = "0.75rem";

export const welcomeDescriptionBlockStyles = style({
  position: "relative",
  maxWidth: leadMeasure.base,

  "@media": {
    [breakpoints.lg]: {
      maxWidth: leadMeasure.lg,
    },
    [breakpoints.xl]: {
      maxWidth: leadMeasure.xl,
    },
    [breakpoints["2k"]]: {
      maxWidth: leadMeasure["2k"],
    },
    [heroSpecRulesMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &::before`]: {
          ...leadSpecLayer,
          right: `calc(100% + ${vars.spacing.sm})`,
          top: 0,
          bottom: 0,
          width: "7px",
          borderBlock: "1px solid currentColor",
          background: "linear-gradient(currentColor, currentColor) center / 1px 100% no-repeat",
        },
        [`${heroSpecOnSelector} &::after`]: {
          ...leadSpecLayer,
          insetInline: 0,
          top: `calc(100% + ${leadMeasureGap})`,
          height: "7px",
          borderInline: "1px solid currentColor",
          background: "linear-gradient(currentColor, currentColor) center / 100% 1px no-repeat",
        },
      },
    },
    [heroSpecRulesMotionMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &::before`]: {
          animation: `${specDrawY} 700ms ${motion.easing.signature} 1100ms backwards`,
        },
        [`${heroSpecOnSelector} &::after`]: {
          animation: `${specDrawX} 800ms ${motion.easing.signature} 1250ms backwards`,
        },
      },
    },
  },
});

export const welcomeDescriptionNoteStyles = style({
  right: 0,
  top: `calc(100% + ${leadMeasureGap} + 0.875rem)`,
  vars: { [specNoteDelay]: "1600ms" },
});

export const welcomeDescriptionStyles = style({
  fontSize: vars.fontSize.xl,
  maxWidth: leadMeasure.base,
  // A lead paragraph, not a headline: 1.25 packed its lines at 24–30px.
  lineHeight: vars.lineHeight.snug,
  // Its own stacking context, over the spec notes beside it; the content column
  // (z 20) already lifts the whole text above the laptop.
  zIndex: 1,
  position: "relative",
  textShadow: vars.textShadow.glowSm,
  animation: settle("600ms", "120ms"),

  "@media": {
    [breakpoints.md]: {
      fontSize: vars.fontSize["2xl"],
    },
    [breakpoints.lg]: {
      maxWidth: leadMeasure.lg,
    },
    [breakpoints.xl]: {
      maxWidth: leadMeasure.xl,
    },
    // 42rem, not wider: the laptop lid's top-left corner sits just right of it.
    [breakpoints["2k"]]: {
      maxWidth: leadMeasure["2k"],
      fontSize: vars.fontSize["3xl"],
    },
    [reducedMotion]: {
      animation: "none",
    },
    // Spec layer: the pulse along the measure line when the lead lights up.
    [heroSpecRulesMotionMedia]: {
      selectors: {
        [heroSpecLit.lead.replaceAll("&", "&::after")]: {
          content: "",
          position: "absolute",
          insetInline: 0,
          top: `calc(100% + ${leadMeasureGap} + 3px)`,
          height: "1px",
          pointerEvents: "none",
          backgroundImage: `linear-gradient(90deg, transparent, ${specInk.line}, transparent)`,
          backgroundSize: `${specSweepWindow} 100%`,
          backgroundRepeat: "no-repeat",
          animation: `${specSweepBackground} 800ms ${motion.easing.signature} both`,
        },
      },
    },
  },
});

const welcomeDescriptionCursorKeyframes = keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0 },
  "100%": { opacity: 1 },
});

export const welcomeDescriptionCursorStyles = style({
  animation: `${welcomeDescriptionCursorKeyframes} 800ms steps(1) infinite`,
  selectors: {
    '[data-anim-disabled="true"] &': { animationPlayState: "paused" },
  },
});

export const welcomeLinkStyles = style({
  color: vars.colors.primary,
  textDecoration: "underline",
  textShadow: vars.textShadow.glowPrimary,

  // Dark hero surface: focus ring must be `primary`, not the global `foreground` default.
  selectors: {
    "&:focus-visible": {
      outlineColor: vars.colors.primary,
    },
  },
});

// Stacked, never side by side: the contact popover opens to the right of the
// CTA (its beam wires into it), so that side stays empty.
export const welcomeActionsStyles = style({
  position: "relative",
  // As wide as the CTA, so its spec note sits just right of it.
  alignSelf: "flex-start",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  animation: settle("500ms", "240ms"),

  "@media": {
    [reducedMotion]: {
      animation: "none",
    },
  },
});

export const welcomeActionsNoteStyles = style({
  left: `calc(100% + ${vars.spacing.lg})`,
  top: vars.spacing.sm,
  vars: { [specNoteDelay]: "1750ms" },
});

// Secondary route out of the hero, for the peers: quieter than the CTA (no
// fill, no glow), same machine voice. Doto at its heaviest weight so the
// dot-matrix stays legible at 16–18px.
export const welcomeLabsLinkStyles = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  minHeight: "2.75rem",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.base,
  ...weight(vars.fontWeight.extrabold),
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: vars.colors.background,
  textDecoration: "none",
  borderRadius: vars.radius.sm,
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,

  selectors: {
    "&:hover": {
      color: vars.colors.primary,
    },
    // Dark hero surface: the ring is `primary`, per DESIGN.md. Offset outward,
    // since the link has no padding (its text aligns with the CTA's edge).
    "&:focus-visible": {
      color: vars.colors.primary,
      outlineColor: vars.colors.primary,
      outlineOffset: vars.spacing.xs,
    },
  },

  "@media": {
    [breakpoints.md]: {
      fontSize: vars.fontSize.lg,
    },
    [breakpoints["2k"]]: {
      fontSize: vars.fontSize.xl,
    },
  },
});

globalStyle(`${welcomeLabsLinkStyles} > span`, {
  transition: `transform ${motion.duration.base} ${motion.easing.signature}`,
});

globalStyle(`${welcomeLabsLinkStyles}:hover > span`, {
  transform: "translateX(0.25rem)",
});
