import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// The keyboard scales with the chassis face (its container): lengths are in
// the rem of the Lab's 22rem laptop, whose face is 12.2rem wide — so the keys
// keep their height whatever size the laptop is drawn at.
const u = (value: number) => `calc(${value} * 100cqi / 12.2)`;

export const computerKeyboardStyle = style({
  width: "100%",
  display: "grid",
  padding: u(0.3),
  paddingTop: u(1),
  boxSizing: "border-box",
  height: "fit-content",
});

export const computerKeyboardRowStyle = style({
  display: "grid",
  gridTemplateColumns: "repeat(45, 1fr)",
  gridTemplateRows: u(0.9),
  height: "fit-content",
});

export const computerKeyboardKeyStyle = style({
  background: `color-mix(in srgb, ${vars.colors.foreground} 95%, ${vars.colors.tertiary})`,
  border: `${u(0.05)} solid color-mix(in srgb, ${vars.colors.foreground} 70%, ${vars.colors.tertiary})`,
  borderRadius: u(0.15),
  boxShadow: `
    inset 0 ${u(0.05)} ${u(0.1)} color-mix(in srgb, ${vars.colors.foreground} 30%, transparent),
    0 ${u(0.05)} 0 color-mix(in srgb, ${vars.colors.background} 10%, transparent)
  `,
  position: "relative",

  fontSize: u(0.18),
  color: vars.colors.background,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ...weight(700),
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
