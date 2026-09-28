import { globalStyle, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";
import {
  heroColumnGutter,
  heroHeaderHeight,
  heroPanelPadding,
} from "../../welcome-hero-layout.css";
import {
  heroSpecMedia,
  heroSpecMotionMedia,
  heroSpecOnSelector,
  heroSpecReducedMotion,
  specBlip,
  specFadeDown,
  specInk,
  specType,
} from "../../welcome-hero-spec.css";
import { HERO_SPEC_FILES } from "../../welcome-hero-spec-data";

// The frame's top edge reads as an editor's tab strip. It runs on the page's
// content column (like the text), so the scroll morph never clips a tab.
const TAB_PADDING = "0.875rem";
const TAB_STAGGER_MS = 80;

const fadeDown = (delayMs: number) =>
  `${specFadeDown} 450ms ${motion.easing.signature} ${delayMs}ms backwards`;

export const welcomeHeroSpecHeaderStyles = style({
  position: "absolute",
  zIndex: 25,
  insetInline: 0,
  top: 0,
  height: heroHeaderHeight,
  display: "flex",
  alignItems: "stretch",
  gap: vars.spacing.md,
  paddingInline: vars.spacing.md,
  borderBottom: `1px solid color-mix(in srgb, ${specInk.line} 8%, transparent)`,
  fontFamily: vars.fontFamily.mono,
  fontSize: specType.tab,
  color: `color-mix(in srgb, ${specInk.line} 60%, transparent)`,
  whiteSpace: "nowrap",

  "@media": {
    [breakpoints.md]: {
      paddingInline: `calc(${heroColumnGutter} + ${heroPanelPadding.md})`,
    },
    [breakpoints.lg]: {
      paddingInline: `calc(${heroColumnGutter} + ${heroPanelPadding.lg})`,
    },
  },
});

// Where the tabs do not fit, or before the spec is on: the section's entry file.
export const welcomeHeroSpecHeaderEntryStyles = style({
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  textOverflow: "ellipsis",
  userSelect: "none",
  "@media": {
    [heroSpecMedia]: {
      selectors: { [`${heroSpecOnSelector} &`]: { display: "none" } },
    },
  },
});

export const welcomeHeroSpecHeaderTabsStyles = style({
  display: "none",
  alignItems: "stretch",
  // The first label sits on the text column, not its padding.
  marginInlineStart: `calc(-1 * ${TAB_PADDING})`,
  "@media": {
    [heroSpecMedia]: {
      selectors: { [`${heroSpecOnSelector} &`]: { display: "flex" } },
    },
  },
});

export const welcomeHeroSpecHeaderTabStyles = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  paddingInline: TAB_PADDING,
  border: "none",
  background: "transparent",
  color: "inherit",
  font: "inherit",
  cursor: "pointer",
  transition: `color ${motion.duration.base} ${motion.easing.out}`,
  outline: "none",

  selectors: {
    "& + &": {
      borderInlineStart: `1px solid color-mix(in srgb, ${specInk.line} 10%, transparent)`,
    },
    "&[data-hovered]": {
      color: `color-mix(in srgb, ${specInk.line} 85%, transparent)`,
    },
    "&[data-selected]": {
      color: specInk.line,
    },
    // The underline marks the picked file; it grows from its centre.
    "&::after": {
      content: "",
      position: "absolute",
      insetInline: TAB_PADDING,
      bottom: "-1px",
      height: "1px",
      background: specInk.mint,
      transform: "scaleX(0)",
      transition: `transform 320ms ${motion.easing.signature}`,
    },
    "&[data-selected]::after": {
      transform: "scaleX(1)",
    },
    // Dark panel: the ring is `primary`, per DESIGN.md; inset, the strip clips outside.
    "&[data-focus-visible]": {
      outline: `2px solid ${vars.colors.primary}`,
      outlineOffset: "-4px",
      borderRadius: vars.radius.sm,
      color: specInk.line,
    },
  },

  // Tabs drop in one after the other when the spec turns on.
  "@media": {
    [heroSpecMotionMedia]: {
      selectors: Object.fromEntries(
        Array.from({ length: HERO_SPEC_FILES.length }, (_, index) => [
          `${heroSpecOnSelector} &:nth-child(${index + 1})`,
          { animation: fadeDown(80 + index * TAB_STAGGER_MS) },
        ]),
      ),
    },
  },
});

// Live readout: which renderer paints the background, and the frame rate.
export const welcomeHeroSpecHeaderReadoutStyles = style({
  display: "none",
  alignItems: "center",
  gap: vars.spacing.md,
  marginInlineStart: "auto",
  userSelect: "none",
  fontVariantNumeric: "tabular-nums",
  selectors: {
    [`${heroSpecOnSelector} &`]: { display: "flex" },
  },
  "@media": {
    [heroSpecMotionMedia]: {
      selectors: { [`${heroSpecOnSelector} &`]: { animation: fadeDown(320) } },
    },
  },
});

export const welcomeHeroSpecHeaderRendererStyles = style({
  display: "flex",
  alignItems: "center",
  gap: "0.375rem",
  color: `color-mix(in srgb, ${specInk.mint} 80%, transparent)`,
});

export const welcomeHeroSpecHeaderDotStyles = style({
  fontSize: "0.5rem",
  animation: `${specBlip} 2s ease-in-out infinite`,
  selectors: {
    // Hero off screen: Blink can't composite the loop and repaints the page every frame.
    '[data-anim-disabled="true"] &': { animationPlayState: "paused" },
  },
  "@media": {
    [heroSpecReducedMotion]: { animation: "none" },
  },
});

export const welcomeHeroSpecHeaderFpsStyles = style({
  color: `color-mix(in srgb, ${specInk.line} 50%, transparent)`,
});

globalStyle(`${welcomeHeroSpecHeaderFpsStyles} > span`, {
  display: "inline-block",
  minWidth: "3ch",
  textAlign: "end",
});
