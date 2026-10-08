import { breakpoints } from "@styles/responsive.css";
import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { style } from "@vanilla-extract/css";

// A drafting sheet on the paper: ink lines only, no fill and no shadow (DESIGN.md › the rack
// elevation's line). The spares are drawn, the server makes them real.
const line = `color-mix(in srgb, ${vars.colors.foreground} 88%, transparent)`;
const faint = `color-mix(in srgb, ${vars.colors.foreground} 30%, transparent)`;
const machine = {
  fontFamily: vars.fontFamily.doto,
  ...weight(vars.fontWeight.extrabold),
  fontVariantNumeric: "tabular-nums",
} as const;
const grid = `color-mix(in srgb, ${vars.colors.foreground} 5%, transparent)`;
// Drafting convention: a part shown where it used to be is drawn in phantom lines.
const phantom = (angle: string) =>
  `repeating-linear-gradient(${angle}, ${line} 0 10px, transparent 10px 13px, ${line} 13px 15px, transparent 15px 18px)`;

export const sheetStyle = style({
  position: "relative",
  border: `1.2px solid ${line}`,
  borderRadius: "2px",
  background: `linear-gradient(${grid} 1px, transparent 1px) 0 0 / 8px 8px, linear-gradient(90deg, ${grid} 1px, transparent 1px) 0 0 / 8px 8px`,
  // Registration marks in the top corners.
  "::before": {
    content: '""',
    position: "absolute",
    left: "3px",
    top: "3px",
    width: "10px",
    height: "10px",
    borderLeft: `1.2px solid ${line}`,
    borderTop: `1.2px solid ${line}`,
  },
  "::after": {
    content: '""',
    position: "absolute",
    right: "3px",
    top: "3px",
    width: "10px",
    height: "10px",
    borderRight: `1.2px solid ${line}`,
    borderTop: `1.2px solid ${line}`,
  },
});

export const partsStyle = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.875rem",
  padding: `0.875rem 0.75rem 1rem`,
});

export const rowStyle = style({
  display: "grid",
  gap: "0.625rem",
  gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
  selectors: {
    '&[data-row="operators"]': { gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.5rem" },
  },
  "@media": { [breakpoints.md]: { gap: vars.spacing.sm } },
});

const edge = `color-mix(in srgb, ${vars.colors.foreground} 78%, transparent)`;
const keyRest = `0 3px 0 ${edge}, 0 10px 16px -12px ${faint}`;
const keyHover = `0 5px 0 ${edge}, 0 16px 22px -14px ${faint}`;
const keyPressed = `0 1px 0 ${edge}, 0 4px 8px -6px ${faint}`;

// Composed rather than spread, so the parts' own selectors and media queries add to it.
const partSize = style({
  position: "relative",
  height: "5.25rem",
  boxSizing: "border-box",
  borderRadius: "3px",
  selectors: {
    '[data-row="operators"] &': { height: "3.75rem" },
  },
  "@media": {
    [breakpoints.md]: {
      height: "6.75rem",
      selectors: { '[data-row="operators"] &': { height: "4.75rem" } },
    },
  },
});

export const partStyle = style([
  partSize,
  {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "9px 0 10px",
    border: `1.2px solid ${line}`,
    // A part you can take is a key on the sheet: lit paper stock with its thickness drawn under
    // it. It rises under the pointer and sinks when pressed; a placed part stays flat, drawn.
    background: vars.colors.card,
    boxShadow: keyRest,
    color: vars.colors.foreground,
    cursor: "pointer",
    transition: `transform ${motion.duration.fast} ${motion.easing.signature}, box-shadow ${motion.duration.fast} ${motion.easing.signature}`,
    selectors: {
      '[data-row="operators"] &': { paddingBlock: "8px 9px" },
      "&[data-hovered]": { transform: "translateY(-2px)", boxShadow: keyHover },
      "&[data-pressed]": { transform: "translateY(2px)", boxShadow: keyPressed },
      "&[data-disabled]": { cursor: "not-allowed", opacity: 0.4, boxShadow: keyPressed },
      '&[data-known="absent"]': { opacity: 0.55 },
      "&[data-focus-visible]": { outline: `2px solid ${vars.colors.ring}`, outlineOffset: "2px" },
    },
    "@media": { "(prefers-reduced-motion: reduce)": { transition: "none" } },
  },
]);

// The part's centre line, dashed, as drawings mark an axis.
export const axisStyle = style({
  position: "absolute",
  left: "50%",
  top: "-5px",
  bottom: "-5px",
  borderLeft: `1px dashed ${faint}`,
  selectors: {
    '[data-row="operators"] &': {
      left: "-5px",
      right: "-5px",
      top: "50%",
      bottom: "auto",
      borderLeft: 0,
      borderTop: `1px dashed ${faint}`,
    },
  },
});

// The key's LED keeps what the runs taught, like Tusmo's keyboard: mint once the part has sat
// in its right bay, gold while it is only known to be in the solution. A part the solution does
// not use keeps its key, greyed and struck (it can still be plugged).
export const ledStyle = style({
  position: "relative",
  flexShrink: 0,
  display: "block",
  width: "8px",
  height: "8px",
  boxSizing: "border-box",
  borderRadius: vars.radius.full,
  border: `1.2px solid ${line}`,
  background: vars.colors.card,
  selectors: {
    '[data-known="right"] &': {
      width: "10px",
      height: "10px",
      background: `color-mix(in oklab, ${vars.colors.secondary} 70%, ${vars.colors.foreground})`,
    },
    '[data-known="elsewhere"] &': {
      width: "10px",
      height: "10px",
      background: vars.colors.primary,
    },
    '[data-known="absent"] &': {
      background: `linear-gradient(135deg, transparent 42%, ${line} 42% 58%, transparent 58%), ${vars.colors.card}`,
    },
  },
});

// Labels sit on a chip of the key's paper so the axis line runs behind them.
export const valueStyle = style({
  ...machine,
  position: "relative",
  padding: "2px 3px",
  background: vars.colors.card,
  fontSize: vars.fontSize["2xl"],
  lineHeight: 1,
});

export const operatorStyle = style({
  position: "relative",
  display: "flex",
  alignItems: "baseline",
  gap: "6px",
  padding: "1px 5px",
  background: vars.colors.card,
});

export const symbolStyle = style({
  ...machine,
  fontSize: "1.375rem",
  lineHeight: 1,
  color: `color-mix(in oklab, ${vars.colors.secondary} 50%, ${vars.colors.foreground})`,
});

export const mnemonicStyle = style({
  ...machine,
  fontSize: "0.6875rem",
  letterSpacing: "0.14em",
  color: vars.colors.mutedForeground,
});

// A parts-list quantity in the key's corner: how many more of this operator can go in.
export const quantityStyle = style({
  ...machine,
  position: "absolute",
  top: "5px",
  right: "7px",
  fontSize: "0.6875rem",
  lineHeight: 1,
  letterSpacing: "0.04em",
  color: vars.colors.mutedForeground,
});

export const handleStyle = style({
  position: "relative",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  width: "56%",
  "::before": {
    content: '""',
    width: "100%",
    borderTop: `1.2px solid ${faint}`,
  },
  "::after": {
    content: '""',
    width: "100%",
    height: "7px",
    boxSizing: "border-box",
    border: `1.2px solid ${line}`,
    borderRadius: "3px",
    background: vars.colors.card,
  },
  selectors: {
    '[data-row="operators"] &': { width: "40%" },
  },
});

export const placedStyle = style([
  partSize,
  {
    ...machine,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "1.0625rem",
    lineHeight: 1,
    color: `color-mix(in srgb, ${vars.colors.foreground} 38%, transparent)`,
    background: `${phantom("90deg")} 0 0 / 100% 1.2px no-repeat, ${phantom("90deg")} 0 100% / 100% 1.2px no-repeat, ${phantom("180deg")} 0 0 / 1.2px 100% no-repeat, ${phantom("180deg")} 100% 0 / 1.2px 100% no-repeat`,
  },
]);

export const placedBayStyle = style({
  fontSize: "0.6875rem",
  letterSpacing: "0.08em",
  color: vars.colors.mutedForeground,
});

// The sheet's title block: what it holds, the draw, and its two tools.
export const titleBlockStyle = style({
  display: "flex",
  alignItems: "stretch",
  borderTop: `1.2px solid ${line}`,
  background: vars.colors.background,
});

export const cellStyle = style({
  ...machine,
  display: "flex",
  alignItems: "center",
  minHeight: "2.75rem",
  paddingInline: "0.75rem",
  boxSizing: "border-box",
  borderLeft: `1.2px solid ${line}`,
  fontSize: "0.6875rem",
  letterSpacing: "0.14em",
  color: vars.colors.mutedForeground,
  selectors: {
    "&:first-child": { flexGrow: 1, borderLeft: 0 },
  },
});

export const toolStyle = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2.75rem",
  minHeight: "2.75rem",
  padding: 0,
  border: 0,
  borderLeft: `1.2px solid ${line}`,
  background: "transparent",
  color: vars.colors.foreground,
  cursor: "pointer",
  transition: `background-color ${motion.duration.fast} ease`,
  selectors: {
    "&[data-hovered]": { backgroundColor: vars.colors.muted },
    "&[data-disabled]": { cursor: "not-allowed", color: vars.colors.mutedForeground },
    "&[data-focus-visible]": { outline: `2px solid ${vars.colors.ring}`, outlineOffset: "-4px" },
  },
});

export const toolIconStyle = style({
  width: "0.875rem",
  height: "0.875rem",
});
