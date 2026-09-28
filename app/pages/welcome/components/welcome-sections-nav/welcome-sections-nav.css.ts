import { createVar, fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { DOCK_HEIGHT, DOCK_OFFSET } from "@/styles/dock.css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// Sections nav: a small ink capsule docked at the foot of the screen. At rest it is one status
// line (the current section, LABS →) with the neon track along its foot; open, it grows upward
// into the list. Opaque on purpose: below 1440px the page
// has no free gutter, so the capsule covers content the way a dock does, never text on text.
// Ink rather than paper because the neon only reads on a dark ground, and gold hover is only
// legal there (DESIGN.md › Dark-Only Gold). Not a third dark panel: an object, like the work
// log's command terminal.

const rowHeight = createVar();
const controlHeight = createVar();
const padTop = createVar();
const trackGap = createVar();
const restRadius = createVar();
const openRadius = createVar();
const labelSize = createVar();

const OPEN_DURATION = "360ms";
const TOUCH = "(hover: none)";

const paperAt = (percent: number) =>
  `color-mix(in srgb, ${vars.colors.background} ${percent}%, transparent)`;

// Doto at 800–900, so 12px stays legible (DESIGN.md › Legible Dot-Matrix); 14px on touch.
const machine = {
  fontFamily: vars.fontFamily.doto,
  fontSize: labelSize,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  whiteSpace: "pre",
} as const;

export const navStyle = style({
  vars: {
    [rowHeight]: "1.75rem",
    [controlHeight]: "1.75rem",
    [padTop]: "0.25rem",
    [trackGap]: "0.125rem",
    [restRadius]: "1.5625rem",
    [openRadius]: "1rem",
    [labelSize]: vars.fontSize.xs,
    // Ink object: every focus ring inside it is gold.
    [vars.colors.ring]: vars.colors.primary,
  },
  position: "fixed",
  // Above all page content, below only the hero morph stage (z 41): mid-hero the capsule is
  // already there, and the panel's bottom edge uncovers it as the hero scrolls away.
  zIndex: 40,
  left: DOCK_OFFSET,
  right: DOCK_OFFSET,
  bottom: `max(${DOCK_OFFSET}, env(safe-area-inset-bottom))`,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto auto",
  gridTemplateRows: "0fr auto auto",
  gridTemplateAreas: `"list list list" "toggle divider labs" "track track track"`,
  alignItems: "center",
  columnGap: vars.spacing.sm,
  paddingTop: padTop,
  paddingBottom: "0.375rem",
  // Nothing leaves the capsule, the track's halo included.
  overflow: "hidden",
  borderRadius: restRadius,
  border: `1px solid ${paperAt(14)}`,
  backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 98%, ${vars.colors.accent})`,
  backgroundImage: `linear-gradient(180deg, ${paperAt(8)}, transparent 60%)`,
  boxShadow: [
    `inset 0 1px 0 color-mix(in srgb, white 9%, transparent)`,
    `0 1px 2px color-mix(in srgb, ${vars.colors.foreground} 22%, transparent)`,
    `0 14px 32px -14px color-mix(in srgb, ${vars.colors.foreground} 60%, transparent)`,
  ].join(", "),

  // Hidden while the hero is in view and once the footer holds the screen, but still in the tab
  // order: it is the page's first stop, and focus brings it back (above the hero stage too).
  opacity: 0,
  pointerEvents: "none",
  transform: "translateY(1rem)",
  transitionProperty: "opacity, transform, grid-template-rows, border-radius",
  transitionDuration: `${motion.duration.base}, ${motion.duration.base}, ${OPEN_DURATION}, ${OPEN_DURATION}`,
  transitionTimingFunction: motion.easing.signature,

  "@media": {
    [breakpoints.md]: {
      left: vars.spacing.lg,
      right: "auto",
      bottom: vars.spacing.lg,
      gridTemplateColumns: "auto auto auto",
    },
    [TOUCH]: {
      vars: {
        [rowHeight]: "2.75rem",
        [controlHeight]: "2.75rem",
        // 44px targets: the track tucks into the bottom of their box, the capsule stays at
        // DOCK_HEIGHT (0 + 44 - 8 + 10 + 6 = 52px).
        [padTop]: "0",
        [trackGap]: "-0.5rem",
        [restRadius]: `calc(${DOCK_HEIGHT} / 2)`,
        [openRadius]: "1.375rem",
        [labelSize]: vars.fontSize.sm,
      },
    },
  },

  selectors: {
    "&[data-visible], &:focus-within": {
      opacity: 1,
      pointerEvents: "auto",
      transform: "none",
    },
    "&:focus-within": { zIndex: 42 },
    "&[data-open]": {
      gridTemplateRows: "1fr auto auto",
      borderRadius: openRadius,
    },
  },
});

// Touch only: a light veil behind the open list; a tap on it closes the list.
export const scrimStyle = style({
  display: "none",
  "@media": {
    [TOUCH]: {
      display: "block",
      position: "fixed",
      inset: 0,
      zIndex: 39,
      backgroundColor: `color-mix(in srgb, ${vars.colors.foreground} 14%, transparent)`,
      opacity: 0,
      pointerEvents: "none",
      transition: `opacity ${motion.duration.base} ${motion.easing.out}`,
    },
  },
  selectors: {
    "&[data-open]": {
      opacity: 1,
      pointerEvents: "auto",
    },
  },
});

// ── Neon track ────────────────────────────────────────────────────────────────
// Along the capsule's foot, from the first label's column to the last one's: the same gentle
// S as ever, laid down, lit gold → mint → violet up to the scroll progress, with a station
// where it crosses its centre line at each section.
export const trackStyle = style({
  gridArea: "track",
  position: "relative",
  height: "0.625rem",
  marginTop: trackGap,
  marginInline: "1.25rem",
  pointerEvents: "none",
});

export const trackSvgStyle = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  overflow: "visible",
});

// The unlit remainder.
export const trackBaseStyle = style({
  fill: "none",
  stroke: paperAt(14),
  strokeWidth: 1.5,
  strokeLinecap: "round",
});

/** Scroll progress of the page, `0`–`1`, written by the nav's scroll pass. */
export const sectionsNavLit = createVar();

// The lit copy of the curve. Its box bleeds 0.5rem past the track (top, bottom, left) so the
// mask never crops the halo; the component writes the progress (0 → 1) into
// `sectionsNavLit`, and the last 6px fade out into a soft tip.
const BLEED = "0.5rem";
const litEdge = `calc(${BLEED} + (100% - ${BLEED}) * ${fallbackVar(sectionsNavLit, "0")})`;

export const trackLitStyle = style({
  position: "absolute",
  top: `calc(-1 * ${BLEED})`,
  bottom: `calc(-1 * ${BLEED})`,
  left: `calc(-1 * ${BLEED})`,
  right: 0,
  maskImage: `linear-gradient(90deg, #000 calc(${litEdge} - 0.375rem), transparent ${litEdge})`,
});

globalStyle(`${trackLitStyle} > svg`, {
  top: BLEED,
  bottom: BLEED,
  left: BLEED,
  width: `calc(100% - ${BLEED})`,
  height: `calc(100% - 2 * ${BLEED})`,
});

// Soft halo under the crisp line: static blur, only the clip moves.
export const trackHaloStyle = style({
  fill: "none",
  strokeWidth: 5,
  strokeLinecap: "round",
  opacity: 0.55,
  filter: "blur(2.5px)",
});

export const trackNeonStyle = style({
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round",
});

export const gradientStopStartStyle = style({
  stopColor: vars.colors.primary,
});

export const gradientStopMidStyle = style({
  stopColor: vars.colors.secondary,
});

export const gradientStopEndStyle = style({
  stopColor: vars.colors.tertiary,
});

export const stationStyle = style({
  position: "absolute",
  top: "50%",
  width: "4px",
  height: "4px",
  borderRadius: vars.radius.full,
  transform: "translate(-50%, -50%)",
  backgroundColor: `color-mix(in srgb, ${vars.colors.background} 32%, ${vars.colors.foreground})`,
  transition: `background-color ${motion.duration.base} ${motion.easing.out}, box-shadow ${motion.duration.base} ${motion.easing.out}`,
  selectors: {
    "&[data-lit]": {
      backgroundColor: vars.colors.background,
      boxShadow: `0 0 4px ${paperAt(60)}`,
    },
  },
});

// Five sections, four quarters: the stations sit where the curve crosses its centre line.
// They follow the base curve and its lit copy in the track (children 1 and 2).
for (let index = 0; index < 5; index++) {
  globalStyle(`${stationStyle}:nth-child(${index + 3})`, {
    left: `${index * 25}%`,
  });
}

// ── Status line ───────────────────────────────────────────────────────────────

// The current section, and the disclosure button for the list.
export const toggleStyle = style({
  ...machine,
  gridArea: "toggle",
  justifySelf: "stretch",
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  minWidth: 0,
  height: controlHeight,
  // The label starts on the same column as the rows' indexes and the track.
  marginLeft: "0.75rem",
  paddingInline: vars.spacing.sm,
  border: 0,
  borderRadius: vars.radius.sm,
  backgroundColor: "transparent",
  color: vars.colors.background,
  ...weight(vars.fontWeight.extrabold),
  textAlign: "left",
  cursor: "pointer",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&[data-hovered]": {
      color: vars.colors.primary,
    },
  },
});

export const toggleLabelStyle = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
});

export const indexStyle = style({
  ...weight(800),
  color: vars.colors.mutedForegroundOnDark,
});

// Types in whenever the current section changes (the component re-keys it).
export const currentNameStyle = style({
  display: "inline-block",
  animation: "nav-type 360ms steps(12) both",
});

// Touch only: hover opens the list elsewhere, so the chevron says the label is a button.
export const chevronStyle = style({
  display: "none",
  flex: "none",
  width: "0.875rem",
  height: "0.875rem",
  fill: "none",
  stroke: paperAt(70),
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  transition: `transform ${motion.duration.base} ${motion.easing.signature}`,
  "@media": {
    [TOUCH]: {
      display: "block",
    },
  },
  selectors: {
    [`${navStyle}[data-open] &`]: {
      transform: "rotate(180deg)",
    },
  },
});

export const dividerStyle = style({
  gridArea: "divider",
  width: "1px",
  height: "1rem",
  backgroundColor: paperAt(16),
});

// A route, not an anchor: `→`, no `_0N` index, outside the scroll-spy.
export const labsStyle = style({
  ...machine,
  gridArea: "labs",
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  height: controlHeight,
  marginRight: "0.75rem",
  paddingInline: "0.5rem",
  borderRadius: vars.radius.sm,
  ...weight(vars.fontWeight.extrabold),
  color: paperAt(82),
  textDecoration: "none",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&:hover, &:focus-visible": {
      color: vars.colors.primary,
    },
  },
});

globalStyle(`${labsStyle} > span`, {
  transition: `transform ${motion.duration.base} ${motion.easing.signature}`,
});

globalStyle(`${labsStyle}:hover > span`, {
  transform: "translateX(3px)",
});

// ── List ──────────────────────────────────────────────────────────────────────

// Collapsed to a 0fr grid row (the capsule animates it open), `inert` while closed.
export const listRegionStyle = style({
  gridArea: "list",
  minHeight: 0,
  overflow: "hidden",
  opacity: 0,
  transition: `opacity 220ms ${motion.easing.out}`,
  selectors: {
    [`${navStyle}[data-open] &`]: {
      opacity: 1,
    },
  },
});

export const listStyle = style({
  display: "flex",
  flexDirection: "column",
  listStyle: "none",
  margin: 0,
  // Rows line up with the toggle's label. Bottom: room for the hairline drawn below.
  padding: "0.625rem 0.75rem calc(0.25rem + 1px)",
  backgroundImage: `linear-gradient(${paperAt(12)}, ${paperAt(12)})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center bottom",
  backgroundSize: "calc(100% - 1.5rem) 1px",
});

export const linkStyle = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  height: rowHeight,
  paddingInline: vars.spacing.sm,
  borderRadius: vars.radius.sm,
  ...weight(800),
  color: vars.colors.mutedForegroundOnDark,
  textDecoration: "none",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    '&[aria-current="true"]': {
      ...weight(vars.fontWeight.extrabold),
      color: vars.colors.background,
      backgroundColor: paperAt(8),
    },
    "&:hover, &:focus-visible": {
      color: vars.colors.primary,
    },
    // The list region clips its overflow: the ring is drawn inside the row.
    "&:focus-visible": {
      outlineOffset: "-2px",
    },
  },
});

// Names type in, one row after the other, each time the list opens.
export const linkNameStyle = style({
  display: "inline-block",
  selectors: {
    [`${navStyle}[data-open] &`]: {
      animation: "nav-type 300ms steps(12) both",
    },
  },
});

for (let index = 1; index <= 5; index++) {
  globalStyle(`${listStyle} > li:nth-child(${index}) ${linkNameStyle}`, {
    animationDelay: `${40 + index * 40}ms`,
  });
}

export const srOnlyStyle = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});
