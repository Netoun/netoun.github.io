import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const computerKeyboardStyle = style({
  width: "100%",
  display: "grid",
  padding: "0.3rem",
  paddingTop: "1rem",
  boxSizing: "border-box",
  height: "fit-content",
});

export const computerKeyboardRowStyle = style({
  display: "grid",
  gridTemplateColumns: "repeat(45, 1fr)",
  gridTemplateRows: "0.9rem",
  height: "fit-content",
});

export const computerKeyboardKeyStyle = style({
  background: `color-mix(in srgb, ${vars.colors.foreground} 95%, ${vars.colors.tertiary})`,
  border: `0.05rem solid color-mix(in srgb, ${vars.colors.foreground} 70%, ${vars.colors.tertiary})`,
  borderRadius: "0.15rem",
  boxShadow: `inset 0 0.05rem 0.1rem rgba(0, 0, 0, 0.3), 0 0.05rem 0 rgba(255, 255, 255, 0.1)`,
  position: "relative",

  fontSize: "0.18rem",
  color: vars.colors.background,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  textTransform: "uppercase",
  userSelect: "none",
  gridColumn: "span 3",
  selectors: {
    '&[data-key="Shift"]': {
      gridColumn: "span 7",
    },
    '&[data-key="Shift"]:last-child': {
      gridColumn: "span 8",
    },
    '&[data-key="Space"]': {
      gridColumn: "span 17",
    },
    '&[data-key="Enter"]': {
      gridColumn: "span 6",
    },
    '&[data-key="⌫"]': {
      gridColumn: "span 6",
    },
    '&[data-key="Tab"]': {
      gridColumn: "span 5",
    },
    '&[data-key="Ctrl"]': {
      gridColumn: "span 4",
    },
    '&[data-key="⌘"]': {
      gridColumn: "span 4",
    },
    '&[data-key="Alt"]': {
      gridColumn: "span 4",
    },
    '&[data-key="Caps"]': {
      gridColumn: "span 6",
    },
    '&[data-key="Del"]': {
      gridColumn: "span 4",
    },
    '&[data-key="Fn1"]': {
      gridColumn: "span 4",
    },
    '&[data-key="Fn2"]': {
      gridColumn: "span 4",
    },
  },
});
