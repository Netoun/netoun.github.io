import { vars } from "@styles/theme.css";
import { globalStyle, style } from "@vanilla-extract/css";

export const cardStyle = style({
  borderRadius: vars.radius.md,
  height: "100%",
  border: `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 50%, transparent)`,
  backgroundColor: vars.colors.card,
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition:
    "transform 0.25s cubic-bezier(.22,1,.36,1), box-shadow 0.35s cubic-bezier(.22,1,.36,1)",
  opacity: 1,
  transform: "rotate(var(--card-rotate, 0deg))",
  position: "relative",
  transformStyle: "preserve-3d",
  perspective: "1000px",
  cursor: "pointer",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  boxShadow: `
    0 4px 24px color-mix(in srgb, ${vars.colors.primary} 14%, transparent),
    0 1px 4px color-mix(in srgb, ${vars.colors.foreground} 6%, transparent)
  `,
});

globalStyle(`${cardStyle}:hover`, {
  boxShadow: `
    0 24px 60px color-mix(in srgb, ${vars.colors.foreground} 14%, transparent),
    0 0 0 1px color-mix(in srgb, ${vars.colors.primary} 30%, transparent),
    0 8px 40px color-mix(in srgb, ${vars.colors.primary} 28%, transparent),
    0 2px 12px color-mix(in srgb, ${vars.colors.secondary} 15%, transparent)
  `,
  transform:
    "rotate(0deg) rotateX(var(--x-rotation, 0deg)) rotateY(var(--y-rotation, 0deg)) translateY(-4px) scale(1.02)",
  transition:
    "transform 0.15s ease-out, box-shadow 0.35s cubic-bezier(.22,1,.36,1), opacity 0.5s ease",
});

export const perspectiveWrapper = style({
  perspective: "1000px",
  height: "100%",
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
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  backgroundColor: `color-mix(in srgb, ${vars.colors.card} 55%, transparent)`,
  borderBottom: `1px solid color-mix(in srgb, ${vars.colors.cardBorder} 50%, transparent)`,
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  color: vars.colors.mutedForeground,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
});

export const terminalLeftStyle = style({
  display: "flex",
  alignItems: "center",
  gap: `calc(${vars.spacing.sm} * 1.25)`,
});

export const terminalDateStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  color: vars.colors.mutedForeground,
});

export const imageContainerStyle = style({
  width: "100%",
  height: "140px",
  overflow: "hidden",
  position: "relative",
  boxShadow: vars.boxShadow.innerLg,
});

export const imageStyle = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transform: "scale(1.15)",
  transition: "transform 0.15s ease-out",
  // filter: "brightness(1.15)",
});

globalStyle(`${linkStyle}:hover ${imageStyle}`, {
  transform: "scale(1.15)",
});

// Lightweight CSS holographic sheen (replaces the per-card WebGL overlay).
// Reuses the --x/--y vars set by the card parallax so the iridescence
// tracks the cursor without opening a GPU context.
export const holoSheenStyle = style({
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 3,
  borderRadius: "inherit",
  opacity: 0.18,
  mixBlendMode: "soft-light",
  transition: "opacity 0.35s ease",
  backgroundImage: `linear-gradient(
    115deg,
    transparent 0%,
    color-mix(in srgb, ${vars.colors.primary} 50%, transparent) 22%,
    color-mix(in srgb, ${vars.colors.secondary} 50%, transparent) 42%,
    color-mix(in srgb, ${vars.colors.tertiary} 50%, transparent) 60%,
    color-mix(in srgb, ${vars.colors.kirby} 50%, transparent) 80%,
    transparent 100%
  )`,
  backgroundSize: "220% 220%",
  backgroundPosition: "var(--x, 50%) var(--y, 50%)",
  boxShadow: `inset 0 1px 0 color-mix(in srgb, ${vars.colors.background} 35%, transparent)`,
});

globalStyle(`${cardStyle}:hover ${holoSheenStyle}`, {
  opacity: 0.5,
});

export const contentStyle = style({
  padding: vars.spacing.md,
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
  gap: `calc(${vars.spacing.sm} * 0.75)`,
});

export const promptStyle = style({
  fontFamily: vars.fontFamily.doto,
  color: vars.colors.primary,
  fontSize: vars.fontSize.sm,
});

export const descriptionStyle = style({
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: vars.fontSize.sm,
  lineHeight: "1.45",
  color: vars.colors.foreground,
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
  gap: `calc(${vars.spacing.xs} * 1.25)`,
  marginTop: `calc(${vars.spacing.xs} * 1.25)`,
});

export const footerStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  borderTop: `1px solid ${vars.colors.border}`,
});

export const linkLabelStyle = style({
  fontFamily: vars.fontFamily.doto,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: vars.colors.mutedForeground,
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "color 0.2s",
  display: "inline-flex",
  alignItems: "center",
  gap: `calc(${vars.spacing.xs} / 2)`,
});

export const linkArrowStyle = style({
  display: "inline-block",
  opacity: 0,
  transform: "translateX(-4px)",
  transition: "opacity 0.2s ease, transform 0.2s ease",
});

globalStyle(`${cardStyle}:hover ${linkArrowStyle}`, {
  opacity: 1,
  transform: "translateX(0)",
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
  color: vars.colors.primaryForeground,
  padding: `calc(${vars.spacing.xs} / 2) ${vars.spacing.sm}`,
  borderRadius: vars.radius.sm,
  fontWeight: vars.fontWeight.bold,
});

export const footerAccentStyle = style({
  width: 16,
  height: 3,
  backgroundColor: vars.colors.primary,
  borderRadius: vars.radius.sm,
});
