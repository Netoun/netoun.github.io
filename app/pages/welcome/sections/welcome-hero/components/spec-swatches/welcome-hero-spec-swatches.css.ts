import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";
import { HERO_SPEC_SWATCHES } from "../../welcome-hero-spec-data";
import {
  heroPanelPaddingTop,
  heroSideBySide2kMedia,
  heroSideBySideMedia,
} from "../../welcome-hero-layout.css";
import {
  heroSpecOnSelector,
  heroSpecRulesMotionMedia,
  specInk,
  specRise,
  specType,
} from "../../welcome-hero-spec.css";

// Palette swatches, small and quiet but never faded, at every width. Under the
// Labs link in the text column's flow; beside the laptop (side by side) they
// drop into the panel's bottom padding, bottom left. Two columns, ~350px: a
// single row ran under the laptop's chassis, this block ends before it, and at
// 60px tall it fits the 4rem padding without meeting the Labs link. One column
// on the narrowest phones.
const SWATCH_START_MS = 2000;
const SWATCH_STAGGER_MS = 90;

export const welcomeHeroSpecSwatchesStyles = style({
  display: "none",
  maxWidth: "22rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(10.25rem, 100%), max-content))",
  gap: `${vars.spacing.sm} 1.25rem`,
  fontFamily: vars.fontFamily.mono,
  fontSize: specType.swatch,
  lineHeight: 1.1,
  whiteSpace: "nowrap",
  pointerEvents: "none",
  userSelect: "none",
  selectors: {
    [`${heroSpecOnSelector} &`]: { display: "grid" },
  },
  "@media": {
    [heroSideBySideMedia]: {
      position: "absolute",
      left: 0,
      // The container's bottom padding is 3xl here: sit sm above the frame edge.
      bottom: `calc(${vars.spacing.sm} - ${vars.spacing["3xl"]})`,
    },
    [heroSideBySide2kMedia]: {
      bottom: `calc(${vars.spacing.xl} - ${heroPanelPaddingTop.sideBySide2k})`,
    },
  },
});

export const welcomeHeroSpecSwatchStyles = style({
  display: "flex",
  alignItems: "center",
  gap: "0.4375rem",
  "@media": {
    [heroSpecRulesMotionMedia]: {
      selectors: Object.fromEntries(
        HERO_SPEC_SWATCHES.map((_, index) => [
          `${heroSpecOnSelector} &:nth-child(${index + 1})`,
          {
            animation: `${specRise} 450ms ${motion.easing.signature} ${SWATCH_START_MS + index * SWATCH_STAGGER_MS}ms backwards`,
          },
        ]),
      ),
    },
  },
});

export const welcomeHeroSpecSwatchChipStyles = styleVariants(
  Object.fromEntries(HERO_SPEC_SWATCHES.map(({ token }) => [token, token])) as Record<
    (typeof HERO_SPEC_SWATCHES)[number]["token"],
    (typeof HERO_SPEC_SWATCHES)[number]["token"]
  >,
  (token) => ({
    flexShrink: 0,
    width: "8px",
    height: "8px",
    borderRadius: "2px",
    background: vars.colors[token],
    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${specInk.line} 15%, transparent)`,
  }),
);

export const welcomeHeroSpecSwatchTextStyles = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  color: `color-mix(in srgb, ${specInk.line} 30%, transparent)`,
});

globalStyle(`${welcomeHeroSpecSwatchTextStyles} > :first-child`, {
  color: `color-mix(in srgb, ${specInk.line} 55%, transparent)`,
});
