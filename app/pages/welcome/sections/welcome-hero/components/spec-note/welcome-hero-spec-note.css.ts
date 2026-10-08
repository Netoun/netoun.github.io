import { createVar, fallbackVar, globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import {
  heroSpecMotionMedia,
  heroSpecOnSelector,
  specDim,
  specDrawX,
  specInk,
  specLift,
  specTransition,
  specType,
} from "../../welcome-hero-spec.css";

/** When the note starts typing, relative to the spec turning on. Set by the note's positioning class. */
export const specNoteDelay = createVar();

const lineIndex = createVar();
const LINE_STAGGER_MS = 80;
const MAX_LINES = 5;

export const welcomeHeroSpecNoteStyles = style({
  position: "absolute",
  flexDirection: "column",
  gap: vars.spacing.xs,
  fontFamily: vars.fontFamily.mono,
  fontSize: specType.note,
  lineHeight: 1.3,
  letterSpacing: "0.02em",
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
  color: specInk.line,
  pointerEvents: "none",
  userSelect: "none",
  opacity: `calc((0.35 + 0.55 * ${specLift}) * ${specDim})`,
  transition: specTransition,
});

// Each line types in, left to right, one after the other.
export const welcomeHeroSpecNoteLineStyles = style({
  vars: { [lineIndex]: "0" },
  selectors: Object.fromEntries(
    Array.from({ length: MAX_LINES }, (_, index) => [
      `&:nth-child(${index + 1})`,
      { vars: { [lineIndex]: String(index) } },
    ]),
  ),
  "@media": {
    [heroSpecMotionMedia]: {
      selectors: {
        [`${heroSpecOnSelector} &`]: {
          animation: `${specDrawX} 500ms steps(24) calc(${fallbackVar(specNoteDelay, "0ms")} + ${lineIndex} * ${LINE_STAGGER_MS}ms) backwards`,
        },
      },
    },
  },
});

export const welcomeHeroSpecNoteAccentStyles = styleVariants({ mint: {}, gold: {} });

globalStyle(`${welcomeHeroSpecNoteAccentStyles.mint} > :first-child`, { color: specInk.mint });
globalStyle(`${welcomeHeroSpecNoteAccentStyles.gold} > :first-child`, { color: specInk.gold });
