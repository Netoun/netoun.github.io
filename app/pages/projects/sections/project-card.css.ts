import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const cardStyle = style({
  borderRadius: vars.radius.md,
  height: "100%",
  border: "1px solid oklch(0.88 0.02 80 / 0.5)",
  backgroundColor: "oklch(1 0 0 / 0.55)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition:
    "transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.35s cubic-bezier(.22,1,.36,1)",
  opacity: 0,
  transform: "translateY(20px)",
  position: "relative",
  transformStyle: "preserve-3d",
  perspective: "1000px",
  cursor: "pointer",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  boxShadow: `0 4px 24px color-mix(in srgb, ${vars.colors.primary} 14%, transparent), 0 1px 4px oklch(0 0 0 / 0.06)`,
});

globalStyle(`${cardStyle}:hover`, {
  boxShadow: `0 24px 60px oklch(0 0 0 / 0.14), 0 0 0 1px color-mix(in srgb, ${vars.colors.primary} 30%, transparent), 0 8px 40px color-mix(in srgb, ${vars.colors.primary} 28%, transparent), 0 2px 12px color-mix(in srgb, ${vars.colors.secondary} 15%, transparent)`,
  transform: "rotateX(var(--x-rotation, 0deg)) rotateY(var(--y-rotation, 0deg)) scale(1.02)",
  transition: "transform 0.15s ease-out, box-shadow 0.35s cubic-bezier(.22,1,.36,1), opacity 0.5s ease",
});

export const perspectiveWrapper = style({
  perspective: "1000px",
});

export const cardVisible = style({
  opacity: 1,
  transform: "translateY(0)",
  transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.35s cubic-bezier(.22,1,.36,1)",
});

export const linkStyle = style({
  textDecoration: "none",
  color: "inherit",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  position: "relative",
  zIndex: 2,
  transform: "translateZ(0)",
  transformStyle: "preserve-3d",
});

export const terminalBarStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.spacing.sm,
  padding: `10px 14px 8px`,
  backgroundColor: "oklch(1 0 0 / 0.3)",
  borderBottom: "1px solid oklch(0.88 0.02 80 / 0.5)",
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  color: "oklch(0.5 0.03 80)",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
});

export const terminalLeftStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

export const terminalDateStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  color: "oklch(0.6 0.03 80)",
});

export const imageContainerStyle = style({
  width: "100%",
  height: "140px",
  overflow: "hidden",
  backgroundColor: "oklch(0.91 0.025 80)",
  position: "relative",
});

export const imageStyle = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transform: "scale(1.15)",
  transition: "transform 0.15s ease-out",
});

globalStyle(`${linkStyle}:hover ${imageStyle}`, {
  transform: "scale(1.15)",
});

globalStyle(`${imageContainerStyle}::after`, {
  content: '""',
  position: "absolute",
  inset: 0,
  background: [
    "linear-gradient(oklch(1 0 0 / 0.18), oklch(1 0 0 / 0.18))",
    "linear-gradient(135deg, oklch(0.8858 0.182 95.69 / 0.12) 0%, transparent 55%, oklch(0.5548 0.2575 312.98 / 0.09) 100%)",
  ].join(", "),
  pointerEvents: "none",
  zIndex: 1,
});

export const contentStyle = style({
  padding: `16px 16px 14px`,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  flex: 1,
});

export const titleStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontWeight: vars.fontWeight.semibold,
  fontSize: vars.fontSize.base,
  color: vars.colors.foreground,
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

export const promptStyle = style({
  fontFamily: vars.fontFamily.doto,
  color: vars.colors.primary,
  fontSize: vars.fontSize.sm,
});

export const descriptionStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.xs,
  lineHeight: "1.55",
  color: "oklch(0.38 0.01 80)",
  margin: 0,
  flex: 1,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export const tagsStyle = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "5px",
  marginTop: vars.spacing.xs,
});

export const tagStyle = recipe({
  base: {
    fontFamily: vars.fontFamily.doto,
    fontSize: "9.5px",
    letterSpacing: "0.08em",
    padding: `3px 9px`,
    borderRadius: vars.radius.full,
    fontWeight: vars.fontWeight.normal,
  },
  variants: {
    color: {
      pink: {
        backgroundColor: "oklch(0.9 0.07 355)",
        color: "oklch(0.45 0.12 355)",
      },
      green: {
        backgroundColor: "oklch(0.88 0.08 166)",
        color: "oklch(0.38 0.12 166)",
      },
      purple: {
        backgroundColor: "oklch(0.88 0.07 313)",
        color: "oklch(0.42 0.15 313)",
      },
      yellow: {
        backgroundColor: "oklch(0.93 0.1 95)",
        color: "oklch(0.45 0.13 85)",
      },
      blue: {
        backgroundColor: "oklch(0.88 0.06 235)",
        color: "oklch(0.42 0.1 235)",
      },
      default: {
        backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 20%, transparent)`,
        color: vars.colors.foreground,
      },
    },
  },
  defaultVariants: {
    color: "default",
  },
});

export const footerStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `10px 16px 13px`,
  borderTop: `1px solid ${vars.colors.border}`,
});

export const linkLabelStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "oklch(0.5 0.04 80)",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "color 0.2s",
});

globalStyle(`${cardStyle}:hover ${linkLabelStyle}`, {
  color: vars.colors.foreground,
});

export const haloStyle = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 1,
  borderRadius: vars.radius.md,
  opacity: 0,
  transition: "opacity 0.3s ease",
});

globalStyle(`${cardStyle}:hover ${haloStyle}`, {
  opacity: 1,
});

export const statusBadgeStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.14em",
  backgroundColor: vars.colors.primary,
  color: "oklch(0.25 0.05 85)",
  padding: `3px 8px`,
  borderRadius: vars.radius.sm,
  fontWeight: vars.fontWeight.bold,
});

export const footerAccentStyle = style({
  width: 16,
  height: 3,
  backgroundColor: vars.colors.primary,
  borderRadius: vars.radius.sm,
});
