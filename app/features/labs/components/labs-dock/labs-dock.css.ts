import { createVar, fallbackVar, globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { DOCK_HEIGHT, DOCK_OFFSET } from "@/styles/dock.css";
import { motion } from "@/styles/motion.css";
import { breakpoints } from "@/styles/responsive.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// The Labs dock: the home sections nav's ink capsule, pointed at the experiments. At rest one
// status line (the current experiment, previous, next) over the neon track, one station per
// experiment; open, it grows upward into the grouped list. The capsule recipe (frame, bevel,
// rows, touch sizes) is copied from `pages/welcome/components/welcome-sections-nav`, which a
// feature may not import: keep the two in step. The track is straight here: ten stations on
// the sections nav's S would read as a squiggle (canvas board `LabsDock`).

const rowHeight = createVar();
const controlHeight = createVar();
const padTop = createVar();
const trackGap = createVar();
const restRadius = createVar();
const openRadius = createVar();
const labelSize = createVar();
const iconSize = createVar();

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

export const dockStyle = style({
  vars: {
    [rowHeight]: "1.75rem",
    [controlHeight]: "1.75rem",
    [padTop]: "0.25rem",
    [trackGap]: "0.125rem",
    [restRadius]: "1.5625rem",
    [openRadius]: "1rem",
    [labelSize]: vars.fontSize.xs,
    [iconSize]: "0.875rem",
    // Ink object: every focus ring inside it is gold.
    [vars.colors.ring]: vars.colors.primary,
  },
  position: "fixed",
  zIndex: 40,
  left: DOCK_OFFSET,
  right: DOCK_OFFSET,
  bottom: `max(${DOCK_OFFSET}, env(safe-area-inset-bottom))`,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto auto auto",
  gridTemplateRows: "0fr auto auto",
  gridTemplateAreas: `"list list list list" "toggle divider previous next" "track track track track"`,
  alignItems: "center",
  columnGap: vars.spacing.xs,
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
  transitionProperty: "opacity, transform, grid-template-rows, border-radius",
  transitionDuration: `${motion.duration.base}, ${motion.duration.base}, ${OPEN_DURATION}, ${OPEN_DURATION}`,
  transitionTimingFunction: motion.easing.signature,

  "@media": {
    [breakpoints.md]: {
      left: vars.spacing.lg,
      right: "auto",
      bottom: vars.spacing.lg,
      // Wide enough for the longest row, so opening never resizes the capsule sideways.
      width: "21rem",
    },
    [TOUCH]: {
      vars: {
        [rowHeight]: "2.75rem",
        [controlHeight]: "2.75rem",
        // 44px targets: the track tucks into the bottom of their box, the capsule stays at
        // DOCK_HEIGHT.
        [padTop]: "0",
        [trackGap]: "-0.5rem",
        [restRadius]: `calc(${DOCK_HEIGHT} / 2)`,
        [openRadius]: "1.375rem",
        [labelSize]: vars.fontSize.sm,
        [iconSize]: "1rem",
      },
    },
  },

  selectors: {
    // On the index there is no current experiment: the status line is the toggle alone.
    '&[data-mode="index"]': {
      gridTemplateColumns: "minmax(0, 1fr)",
      gridTemplateAreas: `"list" "toggle" "track"`,
    },
    // The footer holds the contacts: the capsule steps out of its way, but stays in the tab
    // order and comes back with focus.
    "&[data-away]:not(:focus-within)": {
      opacity: 0,
      pointerEvents: "none",
      transform: "translateY(1rem)",
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

/** How much of the track is lit, `0`–`1`. */
export const dockLit = createVar();
/** Where a station sits along the track, `0`–`1`. */
export const stationAt = createVar();

export const trackStyle = style({
  gridArea: "track",
  position: "relative",
  height: "0.625rem",
  marginTop: trackGap,
  marginInline: "1.25rem",
  pointerEvents: "none",
});

// The unlit remainder.
export const trackBaseStyle = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: "50%",
  height: "1.5px",
  borderRadius: "2px",
  transform: "translateY(-50%)",
  backgroundColor: paperAt(14),
});

// The lit copy: its box bleeds 0.5rem above and below so the mask never crops the halo; the
// component writes the progress into `dockLit`, the last 6px fade out into a soft tip.
const litEdge = `calc(${fallbackVar(dockLit, "0")} * 100%)`;

export const trackLitStyle = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: "-0.5rem",
  bottom: "-0.5rem",
  maskImage: `linear-gradient(90deg, #000 calc(${litEdge} - 0.375rem), transparent ${litEdge})`,
});

const neon = `linear-gradient(90deg, ${vars.colors.primary}, ${vars.colors.secondary} 50%, ${vars.colors.tertiary})`;

// Soft halo under the crisp line: static blur, only the mask moves.
export const trackHaloStyle = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: "50%",
  height: "5px",
  borderRadius: "3px",
  transform: "translateY(-50%)",
  backgroundImage: neon,
  opacity: 0.55,
  filter: "blur(2.5px)",
});

export const trackNeonStyle = style({
  position: "absolute",
  left: 0,
  right: 0,
  top: "50%",
  height: "2px",
  borderRadius: "2px",
  transform: "translateY(-50%)",
  backgroundImage: neon,
});

// Passed stations turn paper, the current one is gold (legal: on ink), the rest stay unlit.
export const stationStyle = style({
  position: "absolute",
  top: "50%",
  left: `calc(${fallbackVar(stationAt, "0")} * 100%)`,
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
    "&[data-current]": {
      backgroundColor: vars.colors.primary,
      boxShadow: `0 0 6px color-mix(in srgb, ${vars.colors.primary} 70%, transparent)`,
    },
  },
});

// ── Status line ───────────────────────────────────────────────────────────────

// The current experiment, and the disclosure button for the list.
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
    [`${dockStyle}[data-mode="index"] &`]: {
      marginRight: "0.75rem",
    },
  },
});

export const toggleLabelStyle = style({
  flex: 1,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const indexStyle = style({
  ...weight(800),
  color: vars.colors.mutedForegroundOnDark,
});

// Types in whenever the current experiment changes (the component re-keys it).
export const currentNameStyle = style({
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
    [`${dockStyle}[data-open] &`]: {
      transform: "rotate(180deg)",
    },
  },
});

export const dividerStyle = style({
  gridArea: "divider",
  width: "1px",
  height: "1rem",
  marginInline: vars.spacing.xs,
  backgroundColor: paperAt(16),
});

// ❮ / ❯: square keys to the neighbours; at either end the missing one stays drawn, dimmed and
// out of the tab order, so the status line never shifts.
export const stepStyle = style({
  ...machine,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: controlHeight,
  height: controlHeight,
  borderRadius: vars.radius.sm,
  ...weight(vars.fontWeight.extrabold),
  color: paperAt(82),
  textDecoration: "none",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&:hover, &:focus-visible": {
      color: vars.colors.primary,
    },
    "&[data-disabled]": {
      color: paperAt(24),
    },
  },
});

export const stepAreas = styleVariants({
  previous: { gridArea: "previous" },
  next: { gridArea: "next", marginRight: "0.375rem" },
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
    [`${dockStyle}[data-open] &`]: {
      opacity: 1,
    },
  },
});

export const listStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
  // Rows line up with the toggle's label. Bottom: room for the hairline drawn below.
  padding: "0.75rem 0.75rem calc(0.25rem + 1px)",
  backgroundImage: `linear-gradient(${paperAt(12)}, ${paperAt(12)})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center bottom",
  backgroundSize: "calc(100% - 1.5rem) 1px",
});

// `3D CSS ────`: the group's name and a hairline to the edge.
export const groupLabelStyle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  margin: 0,
  height: "1.375rem",
  paddingInline: vars.spacing.sm,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  ...weight(800),
  color: vars.colors.mutedForegroundOnDark,
  selectors: {
    "&::after": {
      content: '""',
      flex: 1,
      height: "1px",
      backgroundColor: paperAt(12),
    },
  },
});

export const groupListStyle = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
});

export const linkStyle = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  gap: "0.625rem",
  height: rowHeight,
  paddingInline: vars.spacing.sm,
  borderRadius: vars.radius.sm,
  ...weight(800),
  color: vars.colors.mutedForegroundOnDark,
  textDecoration: "none",
  transition: `color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    '&[aria-current="page"]': {
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

// The closing row back to the index, under a hairline.
export const indexLinkStyle = style({
  ...weight(vars.fontWeight.extrabold),
  color: paperAt(82),
  boxShadow: `inset 0 1px 0 ${paperAt(12)}`,
  borderRadius: 0,
});

// Names type in, one row after the other, each time the list opens.
export const linkNameStyle = style({
  display: "inline-block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  selectors: {
    [`${dockStyle}[data-open] &`]: {
      animation: "nav-type 300ms steps(12) both",
    },
  },
});

// The experiment's iso icon in its accent: an object on ink, so full colour is legal.
export const iconStyle = style({
  display: "block",
  flex: "none",
  width: iconSize,
  height: iconSize,
});

export const iconAccents = styleVariants({
  primary: { color: vars.colors.primary },
  secondary: { color: vars.colors.secondary },
  // Violet lifted with white: undiluted it sinks into the ink.
  tertiary: { color: `color-mix(in oklab, ${vars.colors.tertiary} 72%, white)` },
});

export const srOnlyStyle = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
});

// Rows type in one after the other: the stagger follows the row's place in the whole list.
for (let index = 1; index <= 12; index++) {
  globalStyle(`${listStyle} [data-row="${index}"] ${linkNameStyle}`, {
    animationDelay: `${40 + index * 30}ms`,
  });
}
