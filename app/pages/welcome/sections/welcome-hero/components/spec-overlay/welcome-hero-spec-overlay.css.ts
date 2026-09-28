import { keyframes, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";
import { welcomeHeadingLineHeight } from "../welcome-hero-section-content/welcome-hero-section-content.css";
import {
  heroColumnGutter,
  heroHeaderHeight,
  heroPanelPadding,
  heroPanelPaddingTop,
  heroSideBySide2kMedia,
} from "../../welcome-hero-layout.css";
import {
  heroSpecActive,
  heroSpecMedia,
  heroSpecMotionMedia,
  heroSpecOnSelector,
  specDim,
  specDrawX,
  specFadeIn,
  specInk,
  specLift,
  specRise,
  specTransition,
  specType,
} from "../../welcome-hero-spec.css";

const noMotion = "(prefers-reduced-motion: no-preference)";

// The whole frame, under the text (z 20) and over the mesh. Sized as a
// container so the scanline can travel its full height on the compositor.
export const welcomeHeroSpecOverlayStyles = style({
  position: "absolute",
  inset: 0,
  zIndex: 15,
  overflow: "hidden",
  pointerEvents: "none",
  containerType: "size",
});

// Dot grid, 16px pitch, 10% ink: the workbench's cutting mat. Pure CSS, so it
// is there from first paint, with or without JS, at every width.
export const welcomeHeroSpecGridStyles = style({
  position: "absolute",
  inset: `${heroHeaderHeight} 0 0 0`,
  backgroundImage: `radial-gradient(circle, color-mix(in srgb, ${specInk.line} 10%, transparent) 0.75px, transparent 1.25px)`,
  backgroundSize: "16px 16px",
  backgroundPosition: "8px 8px",
  transition: `opacity 400ms ${motion.easing.out}`,
  "@media": {
    // Only where groups can light: on touch, a tap leaves :hover stuck.
    [heroSpecMedia]: {
      selectors: {
        [heroSpecActive]: { opacity: 0.5 },
      },
    },
    [noMotion]: {
      animation: `${specFadeIn} 1400ms ${motion.easing.out} 100ms backwards`,
    },
  },
});

const scan = keyframes({
  "0%": { translate: "0 0", opacity: 0 },
  "6%": { opacity: 1 },
  "100%": { translate: `0 calc(100cqh - ${heroHeaderHeight})`, opacity: 0 },
});

// The plotter's head: one mint line sweeps the frame once as the spec turns on.
export const welcomeHeroSpecScanlineStyles = style({
  display: "none",
  position: "absolute",
  top: heroHeaderHeight,
  insetInline: 0,
  height: "1px",
  opacity: 0,
  background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${specInk.mint} 55%, transparent) 20% 80%, transparent)`,
  boxShadow: `0 0 12px color-mix(in srgb, ${specInk.mint} 50%, transparent)`,
  "@media": {
    [heroSpecMotionMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &`]: {
          display: "block",
          animation: `${scan} 1800ms ${motion.easing.signature} 150ms both`,
        },
      },
    },
  },
});

// Gutter dimension: frame edge → text, on the headline's first line.
const textColumnStart = `calc(${heroColumnGutter} + ${heroPanelPadding.lg})`;

export const welcomeHeroSpecGutterStyles = style({
  position: "absolute",
  left: 0,
  width: textColumnStart,
  top: `calc(${heroPanelPaddingTop.lg} + ${welcomeHeadingLineHeight.lg} * 0.5 - 3px)`,
  height: "7px",
  "@media": {
    [heroSideBySide2kMedia]: {
      top: `calc(${heroPanelPaddingTop.sideBySide2k} + ${welcomeHeadingLineHeight["2k"]} * 0.5 - 3px)`,
    },
  },
});

export const welcomeHeroSpecGutterRuleStyles = style({
  position: "absolute",
  inset: `0 ${vars.spacing.md} 0 ${vars.spacing.md}`,
  borderInline: `1px solid ${specInk.line}`,
  background: `linear-gradient(${specInk.line}, ${specInk.line}) center / 100% 1px no-repeat`,
  opacity: `calc((0.35 + 0.35 * ${specLift}) * ${specDim})`,
  transition: specTransition,
  "@media": {
    [heroSpecMotionMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &`]: {
          animation: `${specDrawX} 800ms ${motion.easing.signature} 300ms backwards`,
        },
      },
    },
  },
});

export const welcomeHeroSpecGutterLabelStyles = style({
  position: "absolute",
  left: vars.spacing.md,
  bottom: "calc(100% + 0.375rem)",
  fontFamily: vars.fontFamily.mono,
  fontSize: specType.note,
  lineHeight: 1,
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
  color: specInk.line,
  opacity: `calc((0.55 + 0.4 * ${specLift}) * ${specDim})`,
  transition: specTransition,
  "@media": {
    [heroSpecMotionMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &`]: {
          animation: `${specRise} 400ms ${motion.easing.out} 350ms backwards`,
        },
      },
    },
  },
});
