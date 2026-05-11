import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";

export const blockStyle = style({
  borderRadius: vars.radius.md,
  border: `1px solid color-mix(in srgb, ${vars.colors.border} 60%, transparent)`,
  backgroundColor: `color-mix(in srgb, ${vars.colors.background} 55%, white)`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  overflow: "hidden",
  opacity: 0,
  boxShadow: `0 4px 20px color-mix(in srgb, ${vars.colors.primary} 8%, transparent)`,
  transition: "box-shadow 0.3s ease, border-color 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

globalStyle(`${blockStyle}:hover`, {
  boxShadow: `0 8px 32px color-mix(in srgb, ${vars.colors.primary} 16%, transparent)`,
  borderColor: `color-mix(in srgb, var(--block-accent) 40%, transparent)`,
});

export const blockBarStyle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  padding: `${vars.spacing.sm} ${vars.spacing.md} ${vars.spacing.xs}`,
  backgroundColor: `color-mix(in srgb, ${vars.colors.background} 30%, white)`,
  borderBottom: `1px solid color-mix(in srgb, ${vars.colors.border} 60%, transparent)`,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
});

export const blockTitleStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: vars.colors.foreground,
  fontWeight: vars.fontWeight.medium,
});

export const blockTitlePromptStyle = style({
  color: "var(--block-accent)",
  fontWeight: vars.fontWeight.extrabold,
  marginRight: vars.spacing.xs,
});

export const blockBodyStyle = style({
  paddingInline: `${vars.spacing.md} ${vars.spacing.md}`,
  paddingBlock: `${vars.spacing.md} ${vars.spacing.md}`,
  position: "relative",
  minHeight: "5.625rem",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  flex: 1,
});

export const tagsWrapStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.spacing.xs,
  alignItems: "center",
  position: "relative",
  flex: 1,
  zIndex: 1,
});
