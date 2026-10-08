import { dockClearance } from "@styles/dock.css";
import { arrival, motion } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { domainFills, domainInks, insetVar, machine } from "../../skill-fetch.css";
import { weight } from "@styles/weight";

/** A lit LED: brighter at the top, the fill below (as in the monitor meters). */
const led = (color: string) =>
  `linear-gradient(180deg, color-mix(in srgb, ${color} 58%, white), ${color} 70%)`;

const CHECK_START = arrival.output + 700;
const CHECK_STEP = 70;
const GROUPS = 5;
const LIT_START = arrival.output + 800;
const LIT_STEP = 35;
const MAX_STAGGERED_SEGMENTS = 16;

// From lg it sits on the card's inner edge so the two 2 × 2 grids share their columns; below,
// it is printed on the page edge like the head above it.
export const stackStyle = style({
  "@media": {
    [breakpoints.lg]: {
      paddingInline: insetVar,
    },
  },
});

export const labelRowStyle = style({
  ...machine,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: vars.spacing.sm,
  "@media": {
    [breakpoints.md]: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: `${vars.spacing.xs} ${vars.spacing.sm}`,
    },
  },
  marginBottom: vars.spacing.lg,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
});

export const labelStyle = style({
  margin: 0,
  padding: "0.125rem 0.5rem",
  borderRadius: vars.radius.xs,
  border: `1px solid color-mix(in srgb, ${vars.colors.foreground} 30%, transparent)`,
  font: "inherit",
});

export const labelNoteStyle = style({
  margin: 0,
  color: vars.colors.mutedForeground,
});

export const groupsStyle = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "grid",
  rowGap: vars.spacing.lg,
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
});

// As in the practice card: tick beside the title below lg, its own column from lg.
export const groupStyle = style({
  display: "grid",
  gridTemplateColumns: "1.5rem minmax(0, 1fr)",
  columnGap: "0.75rem",
  rowGap: vars.spacing.sm,
  alignItems: "center",
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "1.75rem minmax(0, 1fr)",
      columnGap: vars.spacing.md,
      alignItems: "start",
    },
  },
});

// Tooling (two tools, no colour) is a single line across the grid, under a hairline, so the
// 2 × 2 stays the coloured domains and keeps the practice card's columns.
export const toolingGroupStyle = style([
  groupStyle,
  {
    gridColumn: "1 / -1",
    paddingTop: vars.spacing.lg,
    borderTop: `1px solid color-mix(in srgb, ${vars.colors.foreground} 10%, transparent)`,
    "@media": {
      [breakpoints.lg]: {
        alignItems: "center",
      },
    },
  },
]);

globalStyle(`[data-reveal="idle"] ${groupStyle}`, {
  opacity: 0,
});

for (let index = 0; index < GROUPS; index += 1) {
  globalStyle(`[data-reveal="revealed"] ${groupStyle}:nth-child(${index + 1})`, {
    animation: `fetch-check 300ms ${motion.easing.signature} ${CHECK_START + index * CHECK_STEP}ms both`,
  });
}

export const tickStyle = recipe({
  base: {
    ...machine,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "0.3125rem",
    color: vars.colors.foreground,
    fontSize: "0.9375rem",
    boxShadow: `inset 0 1px 0 color-mix(in srgb, white 45%, transparent)`,
  },
  variants: {
    domain: {
      frontend: { backgroundImage: led(domainFills.frontend) },
      // The paper ✓ holds on violet; ink would not.
      backend: { backgroundImage: led(domainFills.backend), color: vars.colors.background },
      creative: { backgroundImage: led(domainFills.creative) },
      systems: { backgroundImage: led(domainFills.systems) },
      tooling: { backgroundImage: led(domainFills.tooling) },
    },
  },
});

export const groupBodyStyle = style({
  display: "contents",
  "@media": {
    [breakpoints.lg]: {
      display: "flex",
      flexDirection: "column",
      gap: vars.spacing.sm,
      minWidth: 0,
    },
  },
});

// The tooling line: its title, LEDs and tools side by side.
globalStyle(`${toolingGroupStyle} ${groupBodyStyle}`, {
  "@media": {
    [breakpoints.lg]: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      columnGap: vars.spacing.lg,
    },
  },
});

// Below lg, the tools run under the tick and the title, the full width.
export const toolGroupStyle = style({
  gridColumn: "1 / -1",
});

export const groupHeadStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "0.875rem",
});

// 20px at every width, as the practice checks and the work log's client projects.
export const groupTitleStyle = style({
  margin: 0,
  fontSize: vars.fontSize.xl,
  ...weight(vars.fontWeight.semibold),
  lineHeight: 1.2,
});

// One LED segment per tool, as in the monitor meters.
export const meterStyle = style({
  display: "flex",
  gap: "2px",
});

export const segmentStyle = recipe({
  base: {
    display: "block",
    width: "6px",
    height: "0.875rem",
    borderRadius: "1.5px",
  },
  variants: {
    domain: {
      frontend: { backgroundImage: led(domainFills.frontend) },
      backend: { backgroundImage: led(domainFills.backend) },
      creative: { backgroundImage: led(domainFills.creative) },
      systems: { backgroundImage: led(domainFills.systems) },
      tooling: { backgroundImage: led(domainFills.tooling) },
    },
  },
});

globalStyle(`[data-reveal="idle"] ${meterStyle} > *`, {
  opacity: 0.12,
});

globalStyle(`[data-reveal="revealed"] ${meterStyle} > *`, {
  animation: `fetch-lit 160ms ease-out ${LIT_START + MAX_STAGGERED_SEGMENTS * LIT_STEP}ms both`,
});

for (let index = 0; index < MAX_STAGGERED_SEGMENTS; index += 1) {
  globalStyle(`[data-reveal="revealed"] ${meterStyle} > :nth-child(${index + 1})`, {
    animationDelay: `${LIT_START + index * LIT_STEP}ms`,
  });
}

export const countStyle = style({
  ...machine,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.1em",
});

// The tools read as prose: a line of names, not a heap of pills.
export const toolsStyle = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  fontSize: vars.fontSize.base,
  lineHeight: 1.5,
});

export const toolStyle = recipe({
  base: {
    position: "relative",
    display: "inline-flex",
    alignItems: "baseline",
    cursor: "default",
    outline: "none",
    borderRadius: vars.radius.xs,
    textDecorationLine: "underline",
    textDecorationThickness: "2px",
    textUnderlineOffset: "0.3em",
    textDecorationColor: "transparent",
    transition: `text-decoration-color ${motion.duration.fast} ${motion.easing.out}`,
    selectors: {
      // A dot between names, drawn rather than typed, so no one hears it read.
      // 18px between names, the 3px dot centred in it.
      "&:not(:last-child)": {
        marginRight: "1.125rem",
      },
      "&:not(:last-child)::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        right: "-0.65625rem",
        width: "3px",
        height: "3px",
        borderRadius: vars.radius.full,
        backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 38%, transparent)`,
      },
      "&[data-focus-visible]": {
        outline: `2px solid ${vars.colors.foreground}`,
        outlineOffset: "2px",
      },
    },
  },
  variants: {
    domain: {
      frontend: { selectors: { "&[data-selected]": { textDecorationColor: domainInks.frontend } } },
      backend: { selectors: { "&[data-selected]": { textDecorationColor: domainInks.backend } } },
      creative: { selectors: { "&[data-selected]": { textDecorationColor: domainInks.creative } } },
      systems: { selectors: { "&[data-selected]": { textDecorationColor: domainInks.systems } } },
      tooling: { selectors: { "&[data-selected]": { textDecorationColor: domainInks.tooling } } },
    },
  },
});

// Each tool carries its receipt for screen readers; the line below only echoes it on screen.
export const hiddenReceiptStyle = style({
  position: "absolute",
  top: 0,
  left: 0,
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

export const receiptStyle = style({
  display: "grid",
  gridTemplateColumns: "1.75rem minmax(0, 1fr)",
  columnGap: vars.spacing.md,
  alignItems: "baseline",
  minHeight: "3.5rem",
  boxSizing: "border-box",
  margin: 0,
  marginTop: vars.spacing.xl,
  paddingBlock: vars.spacing.md,
  borderTop: `1px solid color-mix(in srgb, ${vars.colors.foreground} 14%, transparent)`,
  borderBottom: `1px solid color-mix(in srgb, ${vars.colors.foreground} 14%, transparent)`,
  backgroundColor: vars.colors.background,
  // Phones: the receipt stays in view at the foot of the screen while the stack scrolls by,
  // so a tap on any tool prints where it can be read. From md the stack fits beside its
  // receipt anyway.
  position: "sticky",
  bottom: 0,
  zIndex: 1,
  // The sections nav docks across the foot of phones: the receipt's paper runs on under the
  // capsule, its text above it (and above the home indicator on notched phones).
  paddingBottom: `calc(${dockClearance} + env(safe-area-inset-bottom))`,
  "@media": {
    [breakpoints.md]: {
      position: "static",
      paddingBottom: vars.spacing.md,
    },
    [breakpoints.lg]: {
      marginTop: "2.5rem",
    },
  },
});

export const receiptArrowStyle = style({
  ...machine,
  color: vars.colors.mutedForeground,
});

export const receiptTextStyle = style({
  fontSize: vars.fontSize.base,
  lineHeight: 1.45,
  color: `color-mix(in srgb, ${vars.colors.foreground} 82%, transparent)`,
  textWrap: "pretty",
});

export const receiptNameStyle = style({
  ...machine,
  marginRight: "0.625rem",
  color: vars.colors.foreground,
  letterSpacing: "0.06em",
});
