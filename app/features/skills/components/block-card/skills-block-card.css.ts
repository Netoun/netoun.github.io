import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";

export const blockStyle = style({
  borderRadius: vars.radius.md,
  border: vars.border.subtle,
  backgroundColor: vars.colors.card,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  overflow: "hidden",
  opacity: 1,
  boxShadow: vars.boxShadow.restCard,
  transition: `box-shadow ${motion.duration.base} ${motion.easing.signature}, border-color ${motion.duration.base} ${motion.easing.signature}`,
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

globalStyle(`${blockStyle}:hover`, {
  boxShadow: vars.boxShadow.hoverCard,
  borderColor: `color-mix(in srgb, var(--block-accent) 40%, transparent)`,
});

export const blockBarStyle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  padding: `${vars.spacing.sm} ${vars.spacing.md} ${vars.spacing.xs}`,
  backgroundColor: `color-mix(in srgb, ${vars.colors.card} 55%, transparent)`,
  borderBottom: vars.border.subtle,
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
