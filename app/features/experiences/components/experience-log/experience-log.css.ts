import { arrival, motion } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { createVar, globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import type { StackDomain } from "../../data/experience-log";
import { weight } from "@styles/weight";

// The machine voice of the log: Doto at the legible floor (weight ≥ 800), tabular numerals.
const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontVariantNumeric: "tabular-nums",
} as const;

// Characters in `netoun log --graph --all`: one typing step per character. No `_❯` here:
// the section title already carries the prompt.
const COMMAND_STEPS = 24;
// Arrival timeline (ms from the section reveal): the command types, then the rows print.
const ROW_START = arrival.output;
const ROW_STEP = 55;
const MAX_STAGGERED_ROWS = 24;
const TRACK_LAG = 200;

/** Lane colour of the group's branch, set by `groupStyle`. */
export const laneVar = createVar();
/** The lane's lit end (the tip, the most recent) and its deep end (where it forked). */
export const laneTopVar = createVar();
export const laneBottomVar = createVar();
/** The same hue, readable on the ink HEAD pill. */
const laneOnInkVar = createVar();

/** The accent of each domain, as the tag primitive tints it. */
export const domainAccents: Record<StackDomain, string> = {
  frontend: vars.colors.secondary,
  backend: vars.colors.tertiary,
  creative: vars.colors.primary,
  systems: vars.colors.azure,
};

/**
 * Lines on paper need ≥ 3:1: mint, gold and azure are deepened with ink, violet already holds.
 * Mixed in oklab: in oklch the ink's hue (0) would drag mint to olive and gold to orange.
 */
export const laneColors: Record<StackDomain, string> = {
  frontend: `color-mix(in oklab, ${vars.colors.secondary} 70%, ${vars.colors.foreground})`,
  backend: vars.colors.tertiary,
  creative: `color-mix(in oklab, ${vars.colors.primary} 70%, ${vars.colors.foreground})`,
  systems: `color-mix(in oklab, ${vars.colors.azure} 70%, ${vars.colors.foreground})`,
};

/**
 * Along a branch the lane runs from lit (its tip, the latest) to deep (where it forked off
 * main), and the curves carry it on into main's ink: time reads as light.
 */
export const laneTops: Record<StackDomain, string> = {
  frontend: `color-mix(in oklab, ${vars.colors.secondary} 88%, ${vars.colors.foreground})`,
  backend: `color-mix(in oklab, ${vars.colors.tertiary} 82%, white)`,
  creative: `color-mix(in oklab, ${vars.colors.primary} 84%, ${vars.colors.foreground})`,
  systems: `color-mix(in oklab, ${vars.colors.azure} 88%, ${vars.colors.foreground})`,
};

/**
 * main's rail and the git lines: a modern grid black, graphite rather than ink. Crisp, and
 * still about 9:1 on the paper.
 */
export const railColor = `color-mix(in oklab, ${vars.colors.mutedForeground} 78%, ${vars.colors.foreground})`;

// The deep end of a lane fades towards the rail, not towards black.
export const laneBottoms: Record<StackDomain, string> = {
  frontend: `color-mix(in oklab, ${vars.colors.secondary} 60%, ${railColor})`,
  backend: `color-mix(in oklab, ${vars.colors.tertiary} 66%, ${railColor})`,
  creative: `color-mix(in oklab, ${vars.colors.primary} 58%, ${railColor})`,
  systems: `color-mix(in oklab, ${vars.colors.azure} 62%, ${railColor})`,
};

const laneOnInk: Record<StackDomain, string> = {
  frontend: vars.colors.secondary,
  backend: `color-mix(in oklab, ${vars.colors.tertiary} 55%, ${vars.colors.background})`,
  creative: vars.colors.primary,
  systems: vars.colors.azure,
};

/** A lit LED segment: brighter at the top, the domain colour below (as in the monitor meters). */
const led = (color: string) =>
  `linear-gradient(180deg, color-mix(in oklab, ${color} 55%, white), ${color} 60%)`;

/**
 * Graph geometry, stepped up per breakpoint. Lanes sit at 25 % (main) and 75 % (branch) of
 * the graph column at every width, so one connector path scales with it.
 */
export const geometry = {
  column: createVar(),
  gap: createVar(),
  stroke: createVar(),
  /** Height of the node line, from the top of a row. */
  nodeY: createVar(),
  connector: createVar(),
  nodeLarge: createVar(),
  nodeMedium: createVar(),
  nodeSmall: createVar(),
  /** Paper ring that detaches a node from its lane. */
  halo: createVar(),
};

export const logStyle = style({
  vars: {
    // Lanes sit at 25 % and 75 % of the column: widths of 50 / 82 / 122px put both centres on
    // a half pixel, so a 3px line covers whole pixels and stays crisp at 1x. Odd node sizes and
    // a half-pixel node line keep the nodes on whole pixels too.
    [geometry.column]: "50px",
    [geometry.gap]: "0.875rem",
    // One width for every line of the graph, rail and lanes alike.
    [geometry.stroke]: "3px",
    [geometry.nodeY]: "22.5px",
    [geometry.connector]: "2rem",
    [geometry.nodeLarge]: "19px",
    [geometry.nodeMedium]: "15px",
    [geometry.nodeSmall]: "13px",
    [geometry.halo]: "3px",
  },
  color: vars.colors.foreground,
  "@media": {
    [breakpoints.md]: {
      vars: {
        [geometry.column]: "82px",
        [geometry.gap]: vars.spacing.md,
        [geometry.nodeY]: "26.5px",
        [geometry.connector]: "2.5rem",
      },
    },
    [breakpoints.lg]: {
      vars: {
        [geometry.column]: "122px",
        [geometry.gap]: vars.spacing.lg,
        [geometry.nodeY]: "32.5px",
        [geometry.connector]: "3.5rem",
        [geometry.nodeLarge]: "23px",
        [geometry.nodeMedium]: "19px",
        [geometry.nodeSmall]: "17px",
        [geometry.halo]: "4px",
      },
    },
  },
});

// ── Command line ─────────────────────────────────────────────────────────────

export const commandLineStyle = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: `${vars.spacing.sm} ${vars.spacing.lg}`,
  paddingBottom: vars.spacing.lg,
});

// A small terminal on the paper: the one command of the log, typed on ink. An object
// like the HEAD pill, not a panel (the Bookend Rule holds).
export const terminalStyle = style({
  ...machine,
  margin: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6em",
  minWidth: 0,
  maxWidth: "100%",
  minHeight: "2.5rem",
  padding: `0 ${vars.spacing.md}`,
  boxSizing: "border-box",
  borderRadius: vars.radius.sm,
  whiteSpace: "nowrap",
  backgroundColor: vars.colors.foreground,
  // Machined like the monitor's column strip: a hair lighter at the top edge.
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground} 70%)`,
  boxShadow: `inset 0 1px 0 color-mix(in srgb, ${vars.colors.background} 14%, transparent), ${vars.boxShadow.restCard}`,
  color: vars.colors.background,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.04em",
  "@media": {
    [breakpoints.lg]: {
      minHeight: "2.75rem",
      padding: `0 1.125rem`,
      fontSize: vars.fontSize.base,
      letterSpacing: "0.05em",
    },
  },
});

// Gold is allowed here: it sits on ink.
export const terminalPromptStyle = style({
  color: vars.colors.primary,
});

export const commandTextStyle = style({
  overflow: "hidden",
});

globalStyle(`[data-reveal="idle"] ${commandTextStyle}`, {
  clipPath: "inset(0 100% 0 0)",
});

globalStyle(`[data-reveal="revealed"] ${commandTextStyle}`, {
  animation: `log-draw ${arrival.commandDuration}ms steps(${COMMAND_STEPS}) ${arrival.commandDelay}ms both`,
});

export const argStyle = recipe({
  base: {
    padding: "0 0.3em",
    borderRadius: vars.radius.xs,
    transition: `background-color ${motion.duration.fast} ${motion.easing.out}`,
  },
  variants: {
    domain: {
      none: {},
      frontend: {
        backgroundColor: `color-mix(in srgb, ${domainAccents.frontend} 36%, transparent)`,
      },
      backend: { backgroundColor: `color-mix(in srgb, ${domainAccents.backend} 55%, transparent)` },
      creative: {
        backgroundColor: `color-mix(in srgb, ${domainAccents.creative} 36%, transparent)`,
      },
      systems: {
        backgroundColor: `color-mix(in srgb, ${domainAccents.systems} 36%, transparent)`,
      },
    },
  },
});

export const cursorStyle = style({
  marginLeft: "0.2em",
  animation: "blink 1s step-end infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": { animation: "none" },
  },
});

export const terminalCursorStyle = style([
  cursorStyle,
  { marginLeft: "-0.35em", color: vars.colors.primary },
]);

export const totalStyle = style({
  ...machine,
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  color: vars.colors.mutedForeground,
  "@media": {
    [breakpoints.lg]: { fontSize: vars.fontSize.sm },
  },
});

// ── Groups and rows ──────────────────────────────────────────────────────────

export const groupsStyle = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
});

// Pointing at a branch filters the log to it, like `git log <branch>`: the others fade.
export const groupStyle = recipe({
  base: {
    position: "relative",
    transition: `opacity 220ms ${motion.easing.signature}`,
    selectors: {
      "&[data-dimmed]": { opacity: 0.28 },
    },
  },
  variants: {
    domain: {
      frontend: {
        vars: {
          [laneVar]: laneColors.frontend,
          [laneTopVar]: laneTops.frontend,
          [laneBottomVar]: laneBottoms.frontend,
          [laneOnInkVar]: laneOnInk.frontend,
        },
      },
      backend: {
        vars: {
          [laneVar]: laneColors.backend,
          [laneTopVar]: laneTops.backend,
          [laneBottomVar]: laneBottoms.backend,
          [laneOnInkVar]: laneOnInk.backend,
        },
      },
      creative: {
        vars: {
          [laneVar]: laneColors.creative,
          [laneTopVar]: laneTops.creative,
          [laneBottomVar]: laneBottoms.creative,
          [laneOnInkVar]: laneOnInk.creative,
        },
      },
      systems: {
        vars: {
          [laneVar]: laneColors.systems,
          [laneTopVar]: laneTops.systems,
          [laneBottomVar]: laneBottoms.systems,
          [laneOnInkVar]: laneOnInk.systems,
        },
      },
    },
  },
});

// ── Lanes, drawn once per group behind its rows ──────────────────────────────

/**
 * Lines are softened with the paper rather than made transparent: the same look as ~72 %
 * opacity, but opaque, so where two pieces of a line overlap (a curve running into a
 * lane) nothing doubles up and the joint disappears.
 */
const soft = (color: string) => `color-mix(in oklab, ${color} 72%, ${vars.colors.background})`;

/** The lane's softened ends, for the curves and dots drawn by the graph cells. */
export const softLaneTop = soft(laneTopVar);
export const softLaneBottom = soft(laneBottomVar);

const MAIN_X = `calc(${geometry.column} * 0.25)`;
const BRANCH_X = `calc(${geometry.column} * 0.75)`;

export const mainRailStyle = recipe({
  base: {
    position: "absolute",
    left: `calc(${MAIN_X} - ${geometry.stroke} / 2)`,
    width: geometry.stroke,
    top: 0,
    bottom: 0,
    backgroundColor: railColor,
    pointerEvents: "none",
  },
  variants: {
    from: {
      top: {},
      node: { top: geometry.nodeY },
    },
    to: {
      end: {},
      root: { bottom: geometry.nodeY },
    },
  },
});

// Where main only marks its place (above its latest merge): a fine dash, not the rail.
export const mainDashStyle = recipe({
  base: {
    position: "absolute",
    left: `calc(${MAIN_X} - ${geometry.stroke} / 2)`,
    width: 0,
    top: 0,
    borderLeft: `${geometry.stroke} dashed color-mix(in srgb, ${railColor} 55%, transparent)`,
    pointerEvents: "none",
  },
  variants: {
    to: {
      // Runs on into the next group, down to main's tip node: one dash pattern, no restart.
      nextNode: { bottom: `calc(-1 * ${geometry.nodeY})` },
      root: { bottom: geometry.nodeY },
    },
  },
});

/** The employer and its listed projects: the span the branch lane runs along. */
export const bodyStyle = style({
  position: "relative",
});

// Lit at the tip, deep where it forked: the curves below carry it on into main's ink.
export const branchLaneStyle = recipe({
  base: {
    position: "absolute",
    left: `calc(${BRANCH_X} - ${geometry.stroke} / 2)`,
    width: geometry.stroke,
    bottom: 0,
    backgroundImage: `linear-gradient(180deg, ${soft(laneTopVar)}, ${soft(laneVar)} 45%, ${soft(laneBottomVar)})`,
    pointerEvents: "none",
  },
  variants: {
    // The open branch starts at HEAD; a merged one is joined from above by main's curve.
    from: {
      node: { top: geometry.nodeY },
      top: { top: 0 },
    },
  },
});

// Lanes draw down as their rows print.
export const laneDrawStyle = style({});

globalStyle(`[data-reveal="idle"] ${laneDrawStyle}`, {
  clipPath: "inset(0 0 100% 0)",
});

globalStyle(`[data-reveal="revealed"] ${laneDrawStyle}`, {
  // `backwards`, not `both`: once drawn, no clip-path lingers on the lane.
  animation: `log-grow 900ms ${motion.easing.signature} backwards`,
  animationDelay: `${ROW_START + MAX_STAGGERED_ROWS * ROW_STEP}ms`,
});

for (let index = 0; index < MAX_STAGGERED_ROWS; index += 1) {
  globalStyle(`[data-reveal="revealed"] [data-first-row="${index}"] > ${laneDrawStyle}`, {
    animationDelay: `${ROW_START + index * ROW_STEP}ms`,
  });
}

export const commitListStyle = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const rowStyle = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: `${geometry.column} minmax(0, 1fr)`,
  columnGap: geometry.gap,
});

export const rowKindStyle = styleVariants({
  tip: {},
  commit: {},
  elided: { minHeight: `calc(${geometry.nodeY} * 2)` },
  merge: { minHeight: `calc(${geometry.nodeY} * 2)` },
  root: { minHeight: `calc(${geometry.nodeY} * 2)` },
  fork: { minHeight: geometry.connector },
  "merge-in": { minHeight: geometry.connector },
});

// Rows print one after the other on arrival; the index lives in data-row (no inline style).
globalStyle(`[data-reveal="idle"] ${rowStyle}`, {
  opacity: 0,
});

globalStyle(`[data-reveal="revealed"] ${rowStyle}`, {
  // `backwards`, not `both`: a filled opacity/transform animation keeps a stacking context
  // on every row, and the next row's curve would then paint over this row's node.
  animation: `log-row ${motion.duration.base} ${motion.easing.signature} backwards`,
  animationDelay: `${ROW_START + MAX_STAGGERED_ROWS * ROW_STEP}ms`,
});

for (let index = 0; index < MAX_STAGGERED_ROWS; index += 1) {
  globalStyle(`[data-reveal="revealed"] ${rowStyle}[data-row="${index}"]`, {
    animationDelay: `${ROW_START + index * ROW_STEP}ms`,
  });
}

// ── Employer (branch tip) ────────────────────────────────────────────────────

// The branch runs out as a track under its employer; the pill and the period sit on it.
export const trackStyle = style({
  position: "absolute",
  left: `calc(${geometry.column} * 0.75)`,
  right: 0,
  top: `calc(${geometry.nodeY} - ${geometry.stroke} / 2)`,
  height: geometry.stroke,
  backgroundImage: `linear-gradient(90deg, ${soft(laneTopVar)}, ${soft(laneVar)} 35%, transparent 94%)`,
  pointerEvents: "none",
});

globalStyle(`[data-reveal="idle"] ${trackStyle}`, {
  clipPath: "inset(0 100% 0 0)",
});

globalStyle(`[data-reveal="revealed"] ${trackStyle}`, {
  animation: `log-draw 700ms ${motion.easing.signature} backwards`,
  animationDelay: `${ROW_START + MAX_STAGGERED_ROWS * ROW_STEP + TRACK_LAG}ms`,
});

for (let index = 0; index < MAX_STAGGERED_ROWS; index += 1) {
  globalStyle(`[data-reveal="revealed"] ${rowStyle}[data-row="${index}"] ${trackStyle}`, {
    animationDelay: `${ROW_START + index * ROW_STEP + TRACK_LAG}ms`,
  });
}

// Mobile: one column in reading order (pill, name, role, period, place, text, stack, mix).
// From lg: identity on the left, period + text on the right, both starting on the track.
export const tipStyle = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  paddingBottom: "2.5rem",
  "@media": {
    [breakpoints.lg]: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 17rem) minmax(0, 1fr)",
      columnGap: "2.5rem",
      alignItems: "start",
      paddingBottom: "3.5rem",
    },
    [breakpoints.xl]: {
      gridTemplateColumns: "minmax(0, 21.25rem) minmax(0, 1fr)",
      columnGap: vars.spacing["2xl"],
    },
  },
});

export const tipColumnStyle = style({
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

// Reading order on mobile. From lg the two columns already hold their children in DOM order,
// which matches these values, so nothing needs resetting.
const order = (value: number) => ({ order: value });

export const refsStyle = style({
  ...order(0),
  // Hugs the pills: the row is a hover target for the filter, the empty width is not.
  alignSelf: "flex-start",
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.xs,
  // The pill (1.75rem) is centred on the node line.
  marginTop: `calc(${geometry.nodeY} - 0.875rem)`,
});

const pill = {
  ...machine,
  ...weight(vars.fontWeight.extrabold),
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35em",
  height: "1.75rem",
  padding: "0 0.625rem",
  boxSizing: "border-box",
  borderRadius: vars.radius.sm,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.05em",
  whiteSpace: "nowrap",
  "@media": {
    [breakpoints.lg]: { fontSize: vars.fontSize.sm },
  },
} as const;

export const refStyle = recipe({
  base: pill,
  variants: {
    kind: {
      // The one ink object of the section: gold is allowed here, it sits on dark.
      head: {
        backgroundColor: vars.colors.foreground,
        backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 86%, ${vars.colors.background}), ${vars.colors.foreground} 70%)`,
        color: vars.colors.background,
        boxShadow: `0 1px 2px color-mix(in srgb, ${vars.colors.foreground} 20%, transparent)`,
      },
      branch: {
        backgroundColor: `color-mix(in srgb, ${laneVar} 22%, ${vars.colors.background})`,
        border: `2px solid ${laneVar}`,
      },
      main: {
        height: "1.5rem",
        border: `2px solid ${vars.colors.foreground}`,
      },
      tag: {
        height: "1.5rem",
        backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 34%, ${vars.colors.background})`,
        border: `1px solid color-mix(in oklab, ${vars.colors.primary} 65%, ${vars.colors.foreground})`,
      },
    },
  },
});

export const headLabelStyle = style({ color: vars.colors.primary });
export const headArrowStyle = style({
  color: `color-mix(in srgb, ${vars.colors.background} 60%, transparent)`,
});
export const headSlugStyle = style({ color: laneOnInkVar });

export const companyStyle = style({
  ...order(1),
  margin: `${vars.spacing.xs} 0 0`,
  fontSize: vars.fontSize["3xl"],
  ...weight(vars.fontWeight.bold),
  lineHeight: 1.02,
  letterSpacing: "-0.025em",
  "@media": {
    [breakpoints.lg]: {
      marginTop: vars.spacing.md,
      // Below the section h2 (3.5rem), above everything else in the log.
      fontSize: "2.5rem",
    },
  },
});

export const roleStyle = style({
  ...order(2),
  margin: 0,
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.snug,
  "@media": {
    [breakpoints.lg]: { fontSize: vars.fontSize.xl },
  },
});

export const periodStyle = style({
  ...machine,
  ...order(3),
  margin: 0,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.08em",
  "@media": {
    // Sits on the track: paper behind it hides the line, centred on the node line.
    [breakpoints.lg]: {
      alignSelf: "flex-start",
      display: "inline-flex",
      alignItems: "center",
      height: "1.75rem",
      marginTop: `calc(${geometry.nodeY} - 0.875rem)`,
      marginLeft: "-0.75rem",
      padding: "0 0.75rem",
      backgroundColor: vars.colors.background,
      fontSize: vars.fontSize.base,
      letterSpacing: "0.1em",
    },
  },
});

export const durationStyle = style({
  color: vars.colors.mutedForeground,
});

export const locationStyle = style({
  ...machine,
  ...order(4),
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
});

export const descriptionStyle = style({
  ...order(5),
  margin: `${vars.spacing.xs} 0 0`,
  maxWidth: "30em",
  // Body size at every width, as the client projects under it.
  fontSize: vars.fontSize.base,
  lineHeight: 1.55,
  textWrap: "pretty",
  "@media": {
    [breakpoints.lg]: {
      marginTop: vars.spacing.md,
    },
  },
});

export const stackStyle = style({
  ...order(6),
  margin: `${vars.spacing.xs} 0 0`,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.sm,
});

export const mixStyle = style({
  ...order(7),
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  marginTop: vars.spacing.sm,
});

export const mixLedsStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "2px",
});

export const mixLedStyle = recipe({
  base: {
    display: "block",
    width: "10px",
    height: "13px",
    borderRadius: "2px",
    boxShadow: `inset 0 -1px 0 color-mix(in srgb, ${vars.colors.foreground} 18%, transparent)`,
    "@media": {
      [breakpoints.lg]: { width: "11px", height: "14px" },
    },
  },
  variants: {
    domain: {
      frontend: { backgroundImage: led(domainAccents.frontend) },
      backend: { backgroundImage: led(domainAccents.backend) },
      creative: { backgroundImage: led(domainAccents.creative) },
      systems: { backgroundImage: led(domainAccents.systems) },
    },
  },
});

export const mixLabelStyle = style({
  ...machine,
  margin: 0,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.08em",
  color: vars.colors.mutedForeground,
});

// ── Client project (commit) ──────────────────────────────────────────────────

export const commitStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  paddingBottom: "1.75rem",
  "@media": {
    [breakpoints.lg]: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 17rem) minmax(0, 1fr)",
      columnGap: "2.5rem",
      alignItems: "start",
      paddingBottom: vars.spacing.xl,
    },
    [breakpoints.xl]: {
      gridTemplateColumns: "minmax(0, 21.25rem) minmax(0, 1fr)",
      columnGap: vars.spacing["2xl"],
    },
  },
});

export const commitHeadStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  minWidth: 0,
});

export const commitTitleStyle = style({
  // First line centred on the node line, whatever the font size.
  margin: `calc(${geometry.nodeY} - 0.5lh) 0 0`,
  fontSize: vars.fontSize.lg,
  ...weight(vars.fontWeight.semibold),
  lineHeight: vars.lineHeight.tight,
  letterSpacing: "-0.01em",
  "@media": {
    [breakpoints.lg]: { fontSize: vars.fontSize.xl },
  },
});

export const commitDomainStyle = style({
  ...machine,
  margin: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  color: vars.colors.mutedForeground,
});

export const commitLedStyle = recipe({
  base: {
    display: "block",
    width: "8px",
    height: "8px",
    borderRadius: "2px",
  },
  variants: {
    domain: {
      frontend: { backgroundImage: led(domainAccents.frontend) },
      backend: { backgroundImage: led(domainAccents.backend) },
      creative: { backgroundImage: led(domainAccents.creative) },
      systems: { backgroundImage: led(domainAccents.systems) },
    },
  },
});

export const commitBodyStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  minWidth: 0,
});

export const commitDescriptionStyle = style({
  margin: `${vars.spacing.xs} 0 0`,
  maxWidth: "34em",
  fontSize: vars.fontSize.base,
  lineHeight: 1.55,
  textWrap: "pretty",
  "@media": {
    [breakpoints.lg]: {
      margin: `calc(${geometry.nodeY} - 0.5lh) 0 0`,
    },
  },
});

// ── Machine rows: elision, merges, root ──────────────────────────────────────

export const machineRowStyle = style({
  ...machine,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `0.375rem ${vars.spacing.sm}`,
  minHeight: `calc(${geometry.nodeY} * 2)`,
  paddingBlock: vars.spacing.xs,
  boxSizing: "border-box",
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.06em",
  color: vars.colors.mutedForeground,
  "@media": {
    [breakpoints.lg]: {
      fontSize: vars.fontSize.sm,
      letterSpacing: "0.08em",
    },
  },
});

export const mergedNameStyle = style({
  color: vars.colors.foreground,
  ...weight(vars.fontWeight.extrabold),
});

// ── Foot: end of log + legend ────────────────────────────────────────────────

export const footStyle = style({
  ...machine,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `0.625rem ${vars.spacing.lg}`,
  paddingTop: vars.spacing.lg,
  paddingLeft: `calc(${geometry.column} + ${geometry.gap})`,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.08em",
  color: vars.colors.mutedForeground,
});

export const endStyle = style({
  color: vars.colors.foreground,
  flexBasis: "100%",
  "@media": {
    [breakpoints.md]: { flexBasis: "auto", marginRight: "auto" },
  },
});

export const legendStyle = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: `0.625rem ${vars.spacing.md}`,
});

export const legendItemStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  color: vars.colors.foreground,
});

export const legendSwatchStyle = recipe({
  base: {
    display: "block",
    width: "22px",
    height: geometry.stroke,
    borderRadius: "2px",
  },
  variants: {
    domain: {
      frontend: {
        backgroundImage: `linear-gradient(90deg, ${laneBottoms.frontend}, ${laneTops.frontend})`,
      },
      backend: {
        backgroundImage: `linear-gradient(90deg, ${laneBottoms.backend}, ${laneTops.backend})`,
      },
      creative: {
        backgroundImage: `linear-gradient(90deg, ${laneBottoms.creative}, ${laneTops.creative})`,
      },
      systems: {
        backgroundImage: `linear-gradient(90deg, ${laneBottoms.systems}, ${laneTops.systems})`,
      },
    },
  },
});
