import { motion } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// The machine voice of the monitor: Doto at the legible floor (weight ≥ 800), tabular numerals.
const machine = {
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.extrabold,
  fontVariantNumeric: "tabular-nums",
} as const;

const rule = `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 55%, transparent)`;

// Characters in `_❯ netoun ps --projects`: one typing step per character.
const COMMAND_STEPS = 23;
// Arrival timeline (ms from the section reveal): command, then meters, then rows.
const ROW_START = 1100;
const ROW_STEP = 60;
const MAX_STAGGERED_ROWS = 12;

// One column set shared by the header strip and every row, widened per breakpoint.
const columns = {
  md: {
    gridTemplateAreas: '"id name status date"',
    gridTemplateColumns: "4.5rem minmax(0, 1fr) 6.5rem 5.5rem",
  },
  lg: {
    gridTemplateAreas: '"id name status host date"',
    gridTemplateColumns: "4.5rem minmax(0, 1fr) 6.5rem minmax(0, 1.3fr) 5.5rem",
  },
  xl: {
    gridTemplateAreas: '"id name status host stack date"',
    gridTemplateColumns: "4.5rem 14rem 6.5rem minmax(0, 1.2fr) minmax(0, 1fr) 5.5rem",
  },
};

export const windowStyle = style({
  position: "relative",
  overflow: "hidden",
  borderRadius: vars.radius.md,
  border: vars.border.strong,
  backgroundColor: vars.colors.card,
  // Discreet: a lamp from the top-left, paper warming slightly towards the foot.
  backgroundImage: `
    radial-gradient(120% 70% at 0% 0%, color-mix(in srgb, white 55%, transparent), transparent 60%),
    linear-gradient(180deg, transparent 40%, color-mix(in srgb, ${vars.colors.cardBorder} 22%, transparent))
  `,
  boxShadow: vars.boxShadow.restCard,
  color: vars.colors.foreground,
});

// ── Command bar ──────────────────────────────────────────────────────────────

export const commandBarStyle = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.md,
  minHeight: "3rem",
  padding: `0 ${vars.spacing.md}`,
  borderBottom: rule,
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, white 45%, transparent), transparent)`,
  // The whole command and the uptime share one line down to 360px.
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.06em",
  "@media": {
    [breakpoints.sm]: {
      fontSize: vars.fontSize.sm,
    },
    [breakpoints.md]: {
      padding: `0 ${vars.spacing.lg}`,
      fontSize: vars.fontSize.base,
    },
  },
});

export const commandStyle = style({
  display: "flex",
  alignItems: "center",
  minWidth: 0,
  whiteSpace: "nowrap",
});

export const commandTextStyle = style({
  overflow: "hidden",
});

globalStyle(`[data-reveal="idle"] ${commandTextStyle}`, {
  clipPath: "inset(0 100% 0 0)",
});

globalStyle(`[data-reveal="revealed"] ${commandTextStyle}`, {
  animation: `monitor-type 800ms steps(${COMMAND_STEPS}) 300ms both`,
});

export const cursorStyle = style({
  marginLeft: "0.25em",
  animation: "blink 1s step-end infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
    },
  },
});

// ── Summary: meters + task counts ────────────────────────────────────────────

export const summaryStyle = style({
  display: "grid",
  gap: vars.spacing.lg,
  padding: vars.spacing.md,
  borderBottom: rule,
  "@media": {
    [breakpoints.md]: {
      padding: vars.spacing.lg,
    },
    // Side by side only once the task line fits on one row.
    [breakpoints.lg]: {
      gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
      gap: vars.spacing["2xl"],
    },
  },
});

export const statsStyle = style({
  ...machine,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
});

export const statRowStyle = style({
  display: "flex",
  gap: vars.spacing.md,
});

export const statTermStyle = style({
  flexShrink: 0,
  width: "4.5rem",
  color: vars.colors.mutedForeground,
});

export const statValueStyle = style({
  margin: 0,
});

export const statNoteStyle = style({
  color: vars.colors.mutedForeground,
});

// ── Column strip (ink, the one dark band of the monitor) ─────────────────────

export const columnsStyle = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.lg,
  minHeight: "2.75rem",
  padding: `0 ${vars.spacing.md}`,
  backgroundColor: vars.colors.foreground,
  // A machined band: a hair lighter at the top edge.
  backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), ${vars.colors.foreground} 70%)`,
  color: vars.colors.background,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  "@media": {
    [breakpoints.md]: {
      display: "grid",
      ...columns.md,
      columnGap: vars.spacing.md,
      padding: `0 ${vars.spacing.lg}`,
    },
    [breakpoints.lg]: columns.lg,
    [breakpoints.xl]: columns.xl,
  },
});

export const sortLabelStyle = style({
  color: `color-mix(in srgb, ${vars.colors.background} 72%, transparent)`,
  "@media": {
    [breakpoints.md]: { display: "none" },
  },
});

export const columnLabelStyle = recipe({
  base: {
    display: "none",
  },
  variants: {
    column: {
      id: {
        gridArea: "id",
        "@media": { [breakpoints.md]: { display: "block" } },
      },
      host: {
        gridArea: "host",
        "@media": { [breakpoints.lg]: { display: "block" } },
      },
      stack: {
        gridArea: "stack",
        "@media": { [breakpoints.xl]: { display: "block" } },
      },
    },
  },
});

export const sortButtonStyle = recipe({
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4em",
    minHeight: "2.75rem",
    padding: 0,
    border: "none",
    background: "none",
    color: "inherit",
    font: "inherit",
    letterSpacing: "inherit",
    textTransform: "inherit",
    cursor: "pointer",
    transition: `color ${motion.duration.fast} ${motion.easing.out}`,
    selectors: {
      // Gold is a hover colour on dark surfaces only: this strip is ink.
      "&[data-hovered]": { color: vars.colors.primary },
      "&[data-focus-visible]": {
        outline: `2px solid ${vars.colors.primary}`,
        outlineOffset: "2px",
        borderRadius: vars.radius.xs,
      },
    },
  },
  variants: {
    column: {
      name: { gridArea: "name", justifySelf: "start" },
      status: { gridArea: "status", justifySelf: "start" },
      date: { gridArea: "date", justifySelf: "end" },
    },
  },
});

export const sortIndicatorStyle = recipe({
  base: {
    display: "inline-block",
    width: "0.8em",
    textAlign: "center",
  },
  variants: {
    active: {
      true: { opacity: 1 },
      false: { opacity: 0 },
    },
  },
});

// ── Rows ─────────────────────────────────────────────────────────────────────

export const listStyle = style({
  outline: "none",
});

export const rowStyle = style({
  position: "relative",
  display: "grid",
  // Touch and narrow screens: every row is a complete block, nothing hides behind a selection.
  gridTemplateAreas: `
    "id status date"
    "name name name"
    "host host host"
    "media media media"
    "description description description"
    "stack stack stack"
  `,
  gridTemplateColumns: "auto minmax(0, 1fr) auto",
  columnGap: vars.spacing.md,
  rowGap: vars.spacing.sm,
  padding: vars.spacing.md,
  borderBottom: rule,
  outline: "none",
  cursor: "default",
  transition: `background-color ${motion.duration.fast} ${motion.easing.out}`,
  selectors: {
    "&:last-child": { borderBottom: "none" },
    "&[data-focus-visible]": {
      outline: `2px solid ${vars.colors.foreground}`,
      outlineOffset: "-2px",
    },
  },
  "@media": {
    [breakpoints.md]: {
      ...columns.md,
      rowGap: 0,
      minHeight: "2.75rem",
      padding: `0 ${vars.spacing.lg}`,
      alignItems: "center",
      selectors: {
        // The mint wash fades towards the date, like a phosphor bar.
        "&[data-selected]": {
          backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.secondary} 32%, transparent), color-mix(in srgb, ${vars.colors.secondary} 18%, transparent) 65%, color-mix(in srgb, ${vars.colors.secondary} 10%, transparent))`,
        },
      },
    },
    [breakpoints.lg]: columns.lg,
    [breakpoints.xl]: columns.xl,
  },
});

// Rows print one after the other on arrival. Once a visitor sorts, rows move in the DOM:
// the window drops the arrival so a re-inserted row never replays it.
globalStyle(`[data-reveal="idle"] ${rowStyle}`, {
  opacity: 0,
});

globalStyle(`[data-reveal="revealed"] ${windowStyle}:not([data-sorted]) ${rowStyle}`, {
  animation: `monitor-row ${motion.duration.base} ${motion.easing.signature} both`,
  animationDelay: `${ROW_START + (MAX_STAGGERED_ROWS - 1) * ROW_STEP}ms`,
});

for (let index = 0; index < MAX_STAGGERED_ROWS; index += 1) {
  globalStyle(
    `[data-reveal="revealed"] ${windowStyle}:not([data-sorted]) ${rowStyle}:nth-child(${index + 1})`,
    { animationDelay: `${ROW_START + index * ROW_STEP}ms` },
  );
}

export const cellIdStyle = style({
  ...machine,
  gridArea: "id",
  display: "flex",
  alignItems: "center",
  gap: "0.4em",
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.1em",
});

// The selection marker exists where selection does: pointer screens, md and up.
export const caretStyle = style({
  display: "none",
  opacity: 0,
  transition: `opacity ${motion.duration.fast} ${motion.easing.out}`,
  "@media": {
    [breakpoints.md]: {
      display: "inline",
      selectors: {
        [`${rowStyle}[data-selected] &`]: { opacity: 1 },
      },
    },
  },
});

export const cellNameStyle = style({
  gridArea: "name",
  justifySelf: "start",
  maxWidth: "100%",
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.xl,
  fontWeight: vars.fontWeight.semibold,
  lineHeight: vars.lineHeight.tight,
  color: vars.colors.foreground,
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  },
  ":focus-visible": {
    outline: `2px solid ${vars.colors.foreground}`,
    outlineOffset: "2px",
    borderRadius: vars.radius.xs,
  },
  "@media": {
    [breakpoints.md]: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontSize: vars.fontSize.base,
    },
  },
});

export const cellStatusStyle = style({
  ...machine,
  gridArea: "status",
  display: "flex",
  alignItems: "center",
  gap: "0.6em",
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
});

// The status object turns to show its side while its row is selected.
export const statusBoxStyle = style({
  marginRight: "0.15em",
});

// One slot for either object, so LIVE and SRC labels line up.
globalStyle(`${cellStatusStyle} ${statusBoxStyle}`, {
  width: "20px",
});

globalStyle(`${rowStyle}[data-selected] ${statusBoxStyle}`, {
  transform: "rotateX(-24deg) rotateY(28deg)",
});

export const cellHostStyle = style({
  ...machine,
  gridArea: "host",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.04em",
  color: vars.colors.mutedForeground,
  "@media": {
    [breakpoints.md]: { display: "none" },
    [breakpoints.lg]: { display: "block" },
  },
});

export const cellStackStyle = style({
  gridArea: "stack",
  minWidth: 0,
  fontSize: vars.fontSize.sm,
  lineHeight: "1.4",
  color: vars.colors.mutedForeground,
  "@media": {
    [breakpoints.md]: { display: "none" },
    [breakpoints.xl]: {
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
  },
});

export const cellDateStyle = style({
  ...machine,
  gridArea: "date",
  justifySelf: "end",
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.1em",
});

// Narrow screens only: the row carries its own capture (wider, the detail pane shows it).
export const cellMediaStyle = style({
  gridArea: "media",
  marginTop: vars.spacing.xs,
  "@media": {
    [breakpoints.md]: { display: "none" },
  },
});

// Visible on narrow screens; wider, it stays in the row for screen readers while the
// detail pane shows it on screen.
export const cellDescriptionStyle = style({
  gridArea: "description",
  margin: 0,
  fontSize: vars.fontSize.base,
  lineHeight: "1.45",
  textWrap: "pretty",
  "@media": {
    [breakpoints.md]: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "1px",
      height: "1px",
      overflow: "hidden",
      clipPath: "inset(50%)",
      whiteSpace: "nowrap",
    },
  },
});

// ── Key bar ──────────────────────────────────────────────────────────────────

export const keysStyle = style({
  ...machine,
  display: "none",
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.1em",
  "@media": {
    [breakpoints.md]: {
      display: "flex",
      alignItems: "center",
      gap: vars.spacing.lg,
      minHeight: "3.25rem",
      padding: `0 ${vars.spacing.md}`,
      borderTop: rule,
      backgroundImage: `linear-gradient(0deg, color-mix(in srgb, ${vars.colors.cardBorder} 28%, transparent), transparent)`,
    },
  },
});

export const keyStyle = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.6em",
  minHeight: "2.75rem",
  padding: `0 ${vars.spacing.sm}`,
  border: "none",
  background: "none",
  color: vars.colors.foreground,
  font: "inherit",
  letterSpacing: "inherit",
  textDecoration: "none",
  cursor: "pointer",
  selectors: {
    "&:hover, &[data-hovered]": {
      textDecoration: "underline",
      textUnderlineOffset: "4px",
    },
    "&:focus-visible, &[data-focus-visible]": {
      outline: `2px solid ${vars.colors.foreground}`,
      outlineOffset: "2px",
      borderRadius: vars.radius.xs,
    },
  },
});

export const keysSpacerStyle = style({
  flexGrow: 1,
});
