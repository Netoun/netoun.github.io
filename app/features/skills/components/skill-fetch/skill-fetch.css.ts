import { arrival } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { createVar, globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import type { StackDomain } from "../../data/skills-data.types";
import { weight } from "@styles/weight";

// The machine voice of the readout: Doto at the legible floor (weight ≥ 800), tabular numerals.
export const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontVariantNumeric: "tabular-nums",
} as const;

// Characters in `_❯ fastfetch --logo netoun`: one typing step per character.
const COMMAND_STEPS = 25;
// Arrival timeline (ms from the section reveal): command, logo, then the readout lines.
export const LOGO_START = arrival.commandDelay + 200;
export const LOGO_STEP = 28;
const LINE_START = arrival.output;
const LINE_STEP = 55;

/**
 * The card's inner edge (its border + padding). The stack below is printed on the paper but
 * sits on the same edge, so the two 2 × 2 grids share their columns.
 */
export const insetVar = createVar();

/** The fill of each domain: ticks, LED segments and colour blocks, as the tag primitive tints. */
export const domainFills: Record<StackDomain, string> = {
  frontend: vars.colors.secondary,
  backend: vars.colors.tertiary,
  creative: vars.colors.primary,
  systems: vars.colors.azure,
  // Neutral but lit: the paper-edge tone vanished on the paper.
  tooling: `color-mix(in oklab, ${vars.colors.mutedForeground} 40%, ${vars.colors.cardBorder})`,
};

/**
 * The same domains as lines and large text on paper (≥ 3:1): mint, gold and azure deepened
 * with ink in oklab (as the work log does), violet as is, tooling in graphite.
 */
export const domainInks: Record<StackDomain, string> = {
  frontend: `color-mix(in oklab, ${vars.colors.secondary} 70%, ${vars.colors.foreground})`,
  backend: vars.colors.tertiary,
  creative: `color-mix(in oklab, ${vars.colors.primary} 70%, ${vars.colors.foreground})`,
  systems: `color-mix(in oklab, ${vars.colors.azure} 70%, ${vars.colors.foreground})`,
  tooling: vars.colors.mutedForeground,
};

/**
 * The same domains lit on the terminal's ink: the accents as they are, violet lifted with white
 * (as the work log's lit lanes) so small text holds 4.5:1, tooling in the dark-panel muted.
 */
export const domainLights: Record<StackDomain, string> = {
  frontend: vars.colors.secondary,
  backend: `color-mix(in oklab, ${vars.colors.tertiary} 72%, white)`,
  creative: vars.colors.primary,
  systems: vars.colors.azure,
  tooling: vars.colors.mutedForegroundOnDark,
};

/** A lit LED: brighter at the top, the fill below (as in the monitor meters). */
const led = (color: string) =>
  `linear-gradient(180deg, color-mix(in srgb, ${color} 58%, white), ${color} 70%)`;

/** An LED on the terminal's glass: the same fill, with the bloom of its own light. */
const ledOnInk = (color: string) => ({
  backgroundImage: led(color),
  boxShadow: `inset 0 1px 0 color-mix(in srgb, white 40%, transparent), inset 0 -2px 0 color-mix(in srgb, ${vars.colors.foreground} 22%, transparent), 0 0 0.875rem -0.125rem color-mix(in srgb, ${color} 55%, transparent)`,
});

export const fetchStyle = style({
  vars: {
    [insetVar]: `calc(${vars.spacing.lg} + 1px)`,
  },
  color: vars.colors.foreground,
  "@media": {
    [breakpoints.lg]: {
      vars: { [insetVar]: `calc(2.5rem + 1px)` },
    },
  },
});

// ── Terminal: the head of the readout, on ink ────────────────────────────────

/** Lit phosphor: every glyph on the glass carries a soft halo of its own colour. */
const bloom = `0 0 0.5em color-mix(in srgb, currentColor 38%, transparent)`;

/** The machine voice adds a hair of convergence error: fault red to the left, mint to the right. */
const phosphor = {
  textShadow: `-0.035em 0 color-mix(in srgb, ${vars.colors.destructive} 42%, transparent), 0.035em 0 color-mix(in srgb, ${vars.colors.secondary} 36%, transparent), ${bloom}`,
} as const;

// A small terminal in the column, an object like the work log's command line (the Bookend Rule
// holds: no bleed, no mesh panel). Its width and inner edge are the practice card's.
export const terminalStyle = style({
  // Its own stacking context: WebKit only clips composited children (the glass) to the rounded
  // corners of an isolated parent.
  isolation: "isolate",
  overflow: "hidden",
  marginBottom: vars.spacing["2xl"],
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in srgb, ${vars.colors.background} 12%, ${vars.colors.foreground})`,
  backgroundColor: vars.colors.foreground,
  boxShadow: vars.boxShadow.restCard,
  color: vars.colors.background,
  vars: {
    [vars.colors.ring]: vars.colors.primary,
  },
  "@media": {
    [breakpoints.lg]: {
      marginBottom: "4.5rem",
    },
  },
});

export const terminalBarStyle = style({
  display: "flex",
  alignItems: "center",
  minHeight: "2.5rem",
  padding: `0 calc(${insetVar} - 1px)`,
  borderBottom: `1px solid color-mix(in srgb, ${vars.colors.background} 9%, transparent)`,
  // Machined like the work log's terminal: a hair lighter at the top edge.
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 86%, ${vars.colors.background}), ${vars.colors.foreground})`,
  boxShadow: `inset 0 1px 0 color-mix(in srgb, ${vars.colors.background} 12%, transparent)`,
});

export const screenStyle = style({
  position: "relative",
  isolation: "isolate",
  // The glass clips itself to the window's bottom corners (inside its 1px border), so neither
  // the light pass nor the scanlines rely on the window's clip.
  overflow: "hidden",
  borderRadius: `0 0 calc(${vars.radius.md} - 1px) calc(${vars.radius.md} - 1px)`,
  padding: `${vars.spacing.lg} calc(${insetVar} - 1px) ${vars.spacing.xl}`,
  // The resting glass, and all of it without WebGL: the mesh's three lights, held still.
  backgroundImage: `
    radial-gradient(55% 70% at 16% 45%, color-mix(in srgb, ${vars.colors.secondary} 9%, transparent), transparent 70%),
    radial-gradient(55% 60% at 64% 100%, color-mix(in srgb, ${vars.colors.tertiary} 12%, transparent), transparent 70%),
    radial-gradient(35% 45% at 96% 0%, color-mix(in srgb, ${vars.colors.primary} 6%, transparent), transparent 70%)
  `,
  textShadow: bloom,
  "@media": {
    [breakpoints.lg]: {
      paddingTop: vars.spacing.xl,
      paddingBottom: vars.spacing["2xl"],
    },
  },
  selectors: {
    // The dark half of the CRT, over the text and the light pass: scanlines, the tube's
    // vignette and a glass sheen from the top-left lamp.
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      zIndex: 2,
      pointerEvents: "none",
      // The tube's inset shadow follows the rounded corners instead of being cut by them.
      borderRadius: "inherit",
      backgroundImage: `
        linear-gradient(160deg, color-mix(in srgb, ${vars.colors.background} 6%, transparent), transparent 32%),
        repeating-linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 30%, transparent) 0 1px, transparent 1px 3px),
        radial-gradient(125% 115% at 50% 45%, transparent 58%, color-mix(in srgb, ${vars.colors.foreground} 62%, transparent))
      `,
      boxShadow: `inset 0 0 3rem color-mix(in srgb, ${vars.colors.foreground} 70%, transparent)`,
    },
  },
});

/** The light pass sits over the text, under the scanlines. */
export const crtStyle = style({
  zIndex: 1,
  borderRadius: "inherit",
});

export const commandLineStyle = style({
  ...machine,
  display: "flex",
  alignItems: "baseline",
  marginBottom: vars.spacing.xl,
  "@media": {
    [breakpoints.lg]: {
      marginBottom: "2.5rem",
    },
  },
});

export const commandStyle = style({
  ...phosphor,
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  whiteSpace: "nowrap",
  fontSize: vars.fontSize.base,
  letterSpacing: "0.06em",
  "@media": {
    [breakpoints.lg]: {
      fontSize: vars.fontSize.xl,
    },
  },
});

// Gold is allowed here: it sits on ink.
export const promptStyle = style({
  color: vars.colors.primary,
});

export const commandTextStyle = style({
  overflow: "hidden",
});

globalStyle(`[data-reveal="idle"] ${commandTextStyle}`, {
  clipPath: "inset(0 100% 0 0)",
});

globalStyle(`[data-reveal="revealed"] ${commandTextStyle}`, {
  animation: `fetch-type ${arrival.commandDuration}ms steps(${COMMAND_STEPS}) ${arrival.commandDelay}ms both`,
});

export const cursorStyle = style({
  marginLeft: "0.25em",
  color: vars.colors.primary,
  animation: "blink 1s step-end infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

// ── Head: logo | user@host, key: value lines, colour blocks ─────────────────

export const headStyle = style({
  display: "grid",
  gap: vars.spacing.lg,
  justifyItems: "start",
  "@media": {
    [breakpoints.md]: {
      gridTemplateColumns: "auto minmax(0, 1fr)",
      alignItems: "center",
      columnGap: vars.spacing["2xl"],
    },
    [breakpoints.lg]: {
      columnGap: vars.spacing["3xl"],
    },
  },
});

export const readoutStyle = style({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  width: "100%",
});

/**
 * The readout prints line by line once the logo is out: user@host, the dashes, each line, the
 * colour row. One class per step (no inline styles in this codebase); later steps share the last.
 */
export const PRINT_STEPS = 10;

export const printStep = styleVariants(
  Object.fromEntries(Array.from({ length: PRINT_STEPS }, (_, step) => [step, {}])),
);

for (let step = 0; step < PRINT_STEPS; step += 1) {
  globalStyle(`[data-reveal="idle"] ${printStep[step]}`, {
    opacity: 0,
  });
  globalStyle(`[data-reveal="revealed"] ${printStep[step]}`, {
    animation: `fetch-print 1ms linear ${LINE_START + step * LINE_STEP}ms both`,
  });
}

export const userHostStyle = style({
  ...machine,
  ...phosphor,
  margin: 0,
  fontSize: vars.fontSize.xl,
  letterSpacing: "0.04em",
  "@media": {
    [breakpoints.lg]: {
      fontSize: "1.625rem",
    },
  },
});

export const userStyle = style({
  color: domainLights.frontend,
});

export const hostStyle = style({
  color: domainLights.backend,
});

// neofetch's underline: as many dashes as user@host has characters.
export const dashesStyle = style([
  userHostStyle,
  {
    marginBottom: vars.spacing.sm,
    color: `color-mix(in srgb, ${vars.colors.background} 32%, transparent)`,
  },
]);

export const linesStyle = style({
  margin: 0,
  display: "flex",
  flexDirection: "column",
});

export const lineStyle = style({
  display: "grid",
  gridTemplateColumns: "6.5rem minmax(0, 1fr)",
  alignItems: "baseline",
  columnGap: vars.spacing.md,
  paddingBlock: "0.3125rem",
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: "8rem minmax(0, 1fr)",
    },
  },
});

// Keys in gold, as neofetch colours its keys: legal here, on ink.
export const lineKeyStyle = style({
  ...machine,
  ...phosphor,
  color: vars.colors.primary,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.08em",
  "@media": {
    [breakpoints.lg]: {
      fontSize: vars.fontSize.base,
    },
  },
});

// Body size at every width: the page's running text on paper is 16px.
export const lineValueStyle = style({
  margin: 0,
  fontSize: vars.fontSize.base,
  lineHeight: 1.45,
  textWrap: "pretty",
});

// The datum of a line reads first: names and counts strong, their context muted, the role set
// like the hero headline (bold italic, tight tracking).
export const partTones = styleVariants({
  strong: {
    ...weight(vars.fontWeight.semibold),
  },
  muted: {
    color: vars.colors.mutedForegroundOnDark,
  },
  role: {
    ...weight(vars.fontWeight.bold),
    fontStyle: "italic",
    letterSpacing: "-0.01em",
  },
});

// neofetch's colour row: one block per domain, named and counted.
export const blocksStyle = style({
  ...machine,
  ...phosphor,
  margin: 0,
  marginTop: vars.spacing.lg,
  padding: 0,
  listStyle: "none",
  // Phones: an even 2-column grid, so the six blocks line up instead of wrapping ragged.
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: `${vars.spacing.md} ${vars.spacing.sm}`,
  fontSize: vars.fontSize.xs,
  // Tighter on phones so `SYSTEMS & AI 02` fits half a 320px column.
  letterSpacing: "0.08em",
  "@media": {
    [breakpoints.md]: {
      display: "flex",
      flexWrap: "wrap",
      gap: vars.spacing.sm,
      letterSpacing: "0.12em",
    },
    [breakpoints.lg]: {
      marginTop: "1.75rem",
    },
  },
});

export const blockStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  // The label and its count stay on one line; the block grows past its swatch if needed.
  whiteSpace: "nowrap",
  "@media": {
    [breakpoints.md]: {
      minWidth: "5.75rem",
    },
    [breakpoints.lg]: {
      minWidth: "6.5rem",
    },
  },
});

export const swatchStyle = recipe({
  base: {
    display: "block",
    height: "1.625rem",
    borderRadius: vars.radius.xs,
  },
  variants: {
    kind: {
      // The practice is ink on the paper; on the ink it is paper.
      practice: ledOnInk(vars.colors.background),
      frontend: ledOnInk(domainFills.frontend),
      backend: ledOnInk(domainFills.backend),
      creative: ledOnInk(domainFills.creative),
      systems: ledOnInk(domainFills.systems),
      tooling: ledOnInk(domainLights.tooling),
    },
  },
});

export const blockCountStyle = style({
  color: vars.colors.mutedForegroundOnDark,
});

// ── Body: practice card, then the stack, on one rhythm ───────────────────────

export const practiceSlotStyle = style({
  marginBottom: vars.spacing["2xl"],
  "@media": {
    [breakpoints.lg]: {
      marginBottom: "4.5rem",
    },
  },
});
