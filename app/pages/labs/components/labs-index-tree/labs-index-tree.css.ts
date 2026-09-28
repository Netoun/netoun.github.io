import { createVar, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { chromeScreen } from "@/components/misc/chrome-capture/chrome-capture.css";
import { arrival, motion } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";

// The tree is printed on the paper, on a line grid like the work log's graph: every line is
// one grid line tall, so the glyph gutter never breaks between rows. Doto advances 0.6em, so a
// gutter of eight cells is 4.8em of its glyph size, at every width.
const line = createVar();
const glyphSize = createVar();

/** Position of the row in the tree, for the arrival stagger. */
export const rowOrder = createVar();

const LG_WITH_POINTER = `${breakpoints.lg} and (hover: hover) and (pointer: fine)`;
const ROW_STAGGER = 45;

const glyphInk = `color-mix(in oklab, ${vars.colors.foreground} 72%, ${vars.colors.background})`;

const doto = {
  fontFamily: vars.fontFamily.doto,
  letterSpacing: 0,
  whiteSpace: "pre",
  // The page's grayscale smoothing thins Doto's dots on macOS (as in the work log's graph).
  WebkitFontSmoothing: "auto",
} as const;

const label = {
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  ...weight(800),
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  color: vars.colors.mutedForeground,
} as const;

export const treeStyle = style({
  vars: {
    [line]: "1.5rem",
    [glyphSize]: "0.75rem",
  },
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  "@media": {
    [breakpoints.lg]: {
      vars: {
        [line]: "1.75rem",
        [glyphSize]: "1.25rem",
      },
    },
  },
});

const printed = {
  animation: `labs-row ${motion.duration.base} ${motion.easing.signature} both`,
  animationDelay: `calc(${arrival.output}ms + ${rowOrder} * ${ROW_STAGGER}ms)`,
} as const;

export const rootStyle = style({
  ...doto,
  ...weight(900),
  margin: 0,
  height: line,
  lineHeight: line,
  fontSize: `calc(${glyphSize} + 0.125rem)`,
  "@media": {
    [breakpoints.lg]: { fontSize: glyphSize },
  },
});

export const groupStyle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  margin: 0,
  height: line,
});

export const glyphStyle = style({
  ...doto,
  ...weight(900),
  flexShrink: 0,
  fontSize: glyphSize,
  lineHeight: line,
  color: glyphInk,
});

export const groupDirStyle = style({
  ...doto,
  ...weight(900),
  marginLeft: `calc(-1 * ${vars.spacing.sm})`,
  fontSize: `calc(${glyphSize} + 0.125rem)`,
  lineHeight: line,
  color: vars.colors.foreground,
  "@media": {
    [breakpoints.lg]: { fontSize: glyphSize },
  },
});

export const groupMetaStyle = style({
  ...label,
  marginLeft: "auto",
  letterSpacing: "0.06em",
  "@media": {
    [breakpoints.lg]: { letterSpacing: "0.1em", paddingRight: vars.spacing.sm },
  },
});

export const srOnlyStyle = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

export const listStyle = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
});

// One experiment: the whole row is its link. Phones: three lines (title, a two-line sentence)
// beside a thumbnail. From 1024px: two lines (title and counts, then the sentence), and the
// thumbnail gives way to the loupe.
export const rowStyle = style({
  ...printed,
  position: "relative",
  display: "grid",
  gridTemplateColumns: `calc(${glyphSize} * 4.8) minmax(0, 1fr) 4rem`,
  gridTemplateRows: `repeat(3, ${line})`,
  gridTemplateAreas: `"gutter head thumb" "gutter desc thumb" "gutter desc thumb"`,
  columnGap: vars.spacing.sm,
  borderRadius: vars.radius.xs,
  color: vars.colors.foreground,
  textDecoration: "none",
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}`,
  "@media": {
    [breakpoints.lg]: {
      gridTemplateColumns: `calc(${glyphSize} * 4.8) 0.75rem 1.25rem minmax(0, 1fr) auto`,
      gridTemplateRows: `repeat(2, ${line})`,
      gridTemplateAreas: `"gutter caret icon head meta" "gutter . . desc desc"`,
      columnGap: vars.spacing.xs,
      paddingRight: vars.spacing.sm,
    },
    // The row in the loupe: the monitor's selection wash, fading across the row.
    [LG_WITH_POINTER]: {
      selectors: {
        '&[data-previewed="true"]': {
          backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.secondary} 32%, transparent), color-mix(in srgb, ${vars.colors.secondary} 10%, transparent))`,
        },
      },
    },
  },
});

export const gutterStyle = style({
  gridArea: "gutter",
  display: "flex",
  flexDirection: "column",
});

export const gutterLineStyle = style({
  ...doto,
  ...weight(900),
  display: "block",
  height: line,
  fontSize: glyphSize,
  lineHeight: line,
  color: glyphInk,
  "@media": {
    // Two lines per row from 1024px: the third is the phone's.
    [breakpoints.lg]: {
      selectors: { "&:nth-child(3)": { display: "none" } },
    },
  },
});

export const caretStyle = style({
  display: "none",
  "@media": {
    [LG_WITH_POINTER]: {
      gridArea: "caret",
      display: "block",
      alignSelf: "center",
      fontFamily: vars.fontFamily.doto,
      fontSize: vars.fontSize.sm,
      ...weight(900),
      opacity: 0,
      transition: `opacity ${motion.duration.fast} ${motion.easing.out}`,
      selectors: {
        [`${rowStyle}[data-previewed="true"] &`]: { opacity: 1 },
      },
    },
  },
});

export const iconStyle = recipe({
  base: {
    display: "none",
    "@media": {
      [breakpoints.lg]: {
        gridArea: "icon",
        display: "block",
        alignSelf: "center",
        width: "1rem",
        height: "1rem",
      },
    },
  },
  variants: {
    accent: {
      primary: { color: vars.colors.primary },
      secondary: { color: vars.colors.secondary },
      tertiary: { color: vars.colors.tertiary },
    },
  },
});

export const headStyle = style({
  gridArea: "head",
  display: "flex",
  alignItems: "baseline",
  gap: vars.spacing.sm,
  minWidth: 0,
  lineHeight: line,
});

export const indexStyle = style({
  ...label,
  fontSize: vars.fontSize.sm,
});

export const titleStyle = style({
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: vars.fontSize.base,
  ...weight(600),
  letterSpacing: "-0.01em",
  "@media": {
    [breakpoints.lg]: { fontSize: vars.fontSize.lg },
  },
});

export const metaStyle = style({
  ...label,
  display: "none",
  "@media": {
    [breakpoints.lg]: {
      gridArea: "meta",
      display: "block",
      alignSelf: "center",
    },
  },
});

export const sentenceStyle = style({
  gridArea: "desc",
  minWidth: 0,
  margin: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: line,
  color: vars.colors.mutedForeground,
  // Phones: two lines at most; from 1024px one, the loupe prints it whole.
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  "@media": {
    [breakpoints.lg]: {
      display: "block",
      fontSize: vars.fontSize.base,
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
  },
});

// The thumbnail's own box: the bezel sets its display, so the phone-only rule lives here.
export const thumbStyle = style({
  gridArea: "thumb",
  alignSelf: "center",
  display: "block",
  width: "4rem",
  "@media": {
    [breakpoints.lg]: { display: "none" },
  },
});

export const thumbInkStyle = style({
  vars: {
    [chromeScreen.color]: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.muted})`,
  },
});

export const thumbPaperStyle = style({
  vars: { [chromeScreen.color]: vars.colors.card },
});

export const closingStyle = style({
  ...doto,
  ...weight(800),
  margin: 0,
  marginTop: line,
  fontSize: vars.fontSize.sm,
  lineHeight: line,
  color: vars.colors.mutedForeground,
});
