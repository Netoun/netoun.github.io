import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const MONO = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

export const codeViewer = style({
  display: "flex",
  flexDirection: "column",
  borderRadius: vars.radius.md,
  border: vars.border.subtle,
  background: vars.colors.foreground,
  boxShadow: vars.boxShadow.lg,
  overflow: "hidden",
  minHeight: 0,
});

export const codeHeader = style({
  display: "flex",
  alignItems: "stretch",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  borderBottom: `1px solid color-mix(in srgb, ${vars.colors.background} 12%, transparent)`,
  paddingRight: vars.spacing.sm,
});

export const tabRow = style({
  display: "flex",
  overflowX: "auto",
});

export const tab = style({
  flexShrink: 0,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  border: "none",
  borderBottom: "2px solid transparent",
  background: "transparent",
  color: `color-mix(in srgb, ${vars.colors.background} 55%, transparent)`,
  fontFamily: MONO,
  fontSize: vars.fontSize.xs,
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "color 0.15s ease, border-color 0.15s ease",
  selectors: {
    "&:hover": {
      color: vars.colors.background,
    },
    "&[data-active='true']": {
      color: vars.colors.primary,
      borderBottomColor: vars.colors.primary,
    },
  },
});

export const copyButton = style({
  alignSelf: "center",
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  gap: vars.spacing.xs,
  padding: `${vars.spacing.xs} ${vars.spacing.sm}`,
  border: `1px solid color-mix(in srgb, ${vars.colors.background} 20%, transparent)`,
  borderRadius: vars.radius.xs,
  background: "transparent",
  color: `color-mix(in srgb, ${vars.colors.background} 70%, transparent)`,
  fontFamily: MONO,
  fontSize: vars.fontSize["2xs"],
  cursor: "pointer",
  transition: "color 0.15s ease, border-color 0.15s ease",
  selectors: {
    "&:hover": {
      color: vars.colors.background,
      borderColor: `color-mix(in srgb, ${vars.colors.background} 40%, transparent)`,
    },
    "&[data-copied='true']": {
      color: vars.colors.secondary,
      borderColor: vars.colors.secondary,
    },
  },
});

export const codeScroll = style({
  overflow: "auto",
  maxHeight: "60vh",
  minHeight: 0,
});

export const pre = style({
  margin: 0,
  padding: vars.spacing.md,
  fontFamily: MONO,
  fontSize: vars.fontSize.xs,
  lineHeight: vars.lineHeight.relaxed,
  background: "transparent !important",
  tabSize: 2,
});

export const line = style({
  display: "table-row",
});

export const lineNumber = style({
  display: "table-cell",
  userSelect: "none",
  textAlign: "right",
  paddingRight: vars.spacing.md,
  color: `color-mix(in srgb, ${vars.colors.background} 30%, transparent)`,
  fontVariantNumeric: "tabular-nums",
});

export const lineContent = style({
  display: "table-cell",
  whiteSpace: "pre",
});
