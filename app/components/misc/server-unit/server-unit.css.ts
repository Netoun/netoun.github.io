import { style, keyframes } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

const getBackground = (opacity: number) =>
  `linear-gradient(20deg, color-mix(in srgb, ${vars.colors.foreground} ${opacity}%, ${vars.colors.tertiary}), transparent), url(/images/noise.svg)`;

const backgroundServer = getBackground(98);
const backgroundServerEdge = getBackground(96);
const serverDepth = 96;
const serverHalfDepth = serverDepth / 2;
const accentSpectrum = `linear-gradient(90deg, ${vars.colors.tertiary} 0%, ${vars.colors.secondary} 45%, ${vars.colors.primary} 78%, ${vars.colors.destructive} 100%)`;

const baseFaceStyle = style({
  position: "absolute",
});

const baseFullFaceStyle = style([baseFaceStyle, { width: "100%", height: "100%" }]);

const baseEdgeFaceStyle = style([baseFaceStyle, { width: `${serverDepth}px`, height: "100%" }]);

const baseHorizontalEdgeStyle = style([
  baseFaceStyle,
  { width: "100%", height: `${serverDepth}px` },
]);

const faceWithBackground = (transform?: string) =>
  style([baseFullFaceStyle, { background: backgroundServer, ...(transform && { transform }) }]);

export const serverUnitContainerStyle = style({
  width: "100%",
  flex: 1,
  minHeight: "var(--server-unit-height, 128px)",
  position: "relative",
  transformStyle: "preserve-3d",
});

export const serverUnitRackPerspectiveStyle = style({
  width: "300px",
  height: "var(--server-rack-height, 430px)",
  perspective: "2000px",
  perspectiveOrigin: "bottom center",
  position: "relative",
  transformStyle: "preserve-3d",
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: "-14px -18px -16px -12px",
      background: `linear-gradient(115deg, color-mix(in srgb, ${vars.colors.background} 14%, transparent), transparent 34%), radial-gradient(ellipse at 18% 8%, color-mix(in srgb, ${vars.colors.primary} 18%, transparent), transparent 42%), radial-gradient(ellipse at 100% 64%, color-mix(in srgb, ${vars.colors.tertiary} 22%, transparent), transparent 48%)`,
      filter: "blur(14px)",
      opacity: 0.55,
      transform: "translateZ(-120px)",
      pointerEvents: "none",
    },
    "&::after": {
      content: "",
      position: "absolute",
      inset: "4px -16px -18px 18px",
      background: `linear-gradient(100deg, color-mix(in srgb, ${vars.colors.foreground} 54%, transparent), transparent 62%)`,
      opacity: 0.35,
      transform: "translateZ(-130px) skewY(-2deg)",
      filter: "blur(6px)",
      pointerEvents: "none",
    },
  },
});

export const serverUnitRackStackStyle = style({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transformStyle: "preserve-3d",
  position: "relative",
});

export const serverUnitInnerStyle = style({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
});

export const serverFaceFrontStyle = style([
  faceWithBackground(),
  {
    display: "flex",
    flexDirection: "column",
    padding: "7px 8px 6px",
    gap: "1px",
    overflow: "hidden",
    background: backgroundServer,
    boxShadow: `
      inset 0 1px 0 color-mix(in srgb, ${vars.colors.background} 18%, transparent),
      inset 0 -8px 18px color-mix(in srgb, ${vars.colors.foreground} 18%, transparent),
      inset 14px 0 28px color-mix(in srgb, ${vars.colors.foreground} 16%, transparent),
      0 1px 0 color-mix(in srgb, ${vars.colors.tertiary} 42%, transparent),
      0 9px 16px color-mix(in srgb, ${vars.colors.foreground} 18%, transparent),
      12px 18px 24px color-mix(in srgb, ${vars.colors.foreground} 18%, transparent)
    `,
    selectors: {
      "&::before": {
        content: "",
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(112deg, transparent 0 36%, color-mix(in srgb, ${vars.colors.background} 9%, transparent) 41%, transparent 48%),
          repeating-linear-gradient(to bottom, transparent, transparent 0.5px, color-mix(in srgb, ${vars.colors.foreground} 20%, transparent) 0.5px, color-mix(in srgb, ${vars.colors.foreground} 20%, transparent) 1px)
        `,
        opacity: 0.9,
        zIndex: 0,
        pointerEvents: "none",
      },
      "&::after": {
        content: "",
        position: "absolute",
        inset: 0,
        background: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.foreground} 36%, transparent), transparent 10% 88%, color-mix(in srgb, ${vars.colors.foreground} 42%, transparent))`,
        boxShadow: `inset 0 0 16px color-mix(in srgb, ${vars.colors.foreground} 28%, transparent)`,
        zIndex: 0,
        pointerEvents: "none",
      },
    },
  },
]);

export const serverFaceFrontVariantAStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.tertiary} 16%, ${vars.colors.foreground}))`,
});

export const serverFaceFrontVariantBStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 82%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.secondary} 18%, ${vars.colors.foreground}))`,
});

export const serverFaceFrontVariantCStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 83%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.primary} 18%, ${vars.colors.foreground}))`,
});

export const serverBrandBarStyle = style({
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "12px",
  margin: "0 1px 2px",
  padding: "0 4px",
  border: `1px solid color-mix(in srgb, ${vars.colors.foreground} 24%, transparent)`,
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.tertiary} 35%, transparent), color-mix(in srgb, ${vars.colors.foreground} 88%, transparent))`,
  selectors: {
    "&::after": {
      content: "",
      position: "absolute",
      inset: 0,
      backgroundImage:
        "repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,.08) 5px, rgba(255,255,255,.08) 6px)",
      opacity: 0.35,
      pointerEvents: "none",
    },
  },
});

export const serverBrandBarVariantAStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.tertiary} 22%, transparent), color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}))`,
});

export const serverBrandBarVariantBStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.secondary} 22%, transparent), color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}))`,
});

export const serverBrandBarVariantCStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.primary} 22%, transparent), color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}))`,
});

export const serverBrandTitleStyle = style({
  fontSize: "4.5px",
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: `color-mix(in srgb, ${vars.colors.primary} 70%, ${vars.colors.foreground})`,
  fontWeight: vars.fontWeight.bold,
  textShadow: vars.textShadow.glow,
});

export const serverBrandRackStyle = style({
  fontSize: "4px",
  letterSpacing: "0.4px",
  color: `color-mix(in srgb, ${vars.colors.foreground} 38%, transparent)`,
  fontWeight: vars.fontWeight.bold,
});

export const serverHandleStyle = style({
  position: "absolute",
  top: "50%",
  width: "3px",
  height: "20px",
  borderRadius: "99px",
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 30%, transparent), color-mix(in srgb, ${vars.colors.foreground} 12%, transparent))`,
  border: `1px solid color-mix(in srgb, ${vars.colors.foreground} 28%, transparent)`,
  transform: "translateY(-50%)",
  zIndex: 2,
  selectors: {
    "&[data-side='left']": { left: "2px" },
    "&[data-side='right']": { right: "2px" },
  },
});

export const serverFaceBackStyle = faceWithBackground(`translateZ(-${serverDepth}px)`);

export const serverFaceTopStyle = style([
  baseHorizontalEdgeStyle,
  {
    top: "0",
    transform: `rotateX(90deg) translateY(-${serverHalfDepth}px) translateZ(${serverHalfDepth}px)`,
    background: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.background} 16%, transparent), transparent 45%), ${backgroundServerEdge}`,
  },
]);

export const serverFaceBottomStyle = style([
  baseHorizontalEdgeStyle,
  {
    bottom: "0",
    transform: `rotateX(90deg) translateY(-${serverHalfDepth}px) translateZ(-${serverHalfDepth}px)`,
    background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 22%, transparent), transparent 55%), ${backgroundServerEdge}`,
  },
]);

export const serverFaceLeftStyle = style([
  baseEdgeFaceStyle,
  {
    right: "0",
    transform: `translateZ(-${serverHalfDepth}px) translateX(${serverHalfDepth}px) rotateY(90deg)`,
    background: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.background} 10%, transparent), color-mix(in srgb, ${vars.colors.foreground} 42%, transparent)), ${backgroundServerEdge}`,
  },
]);

export const serverFaceRightStyle = style([
  baseEdgeFaceStyle,
  {
    transform: `translateZ(-${serverHalfDepth}px) translateX(-${serverHalfDepth}px) rotateY(90deg)`,
    background: `linear-gradient(90deg, color-mix(in srgb, ${vars.colors.foreground} 50%, transparent), color-mix(in srgb, ${vars.colors.background} 8%, transparent)), ${backgroundServerEdge}`,
  },
]);

const blinkSlow = keyframes({
  "0%, 100%": {
    opacity: 0.45,
    transform: "scale(0.96)",
  },
  "50%": {
    opacity: 0.72,
    transform: "scale(1)",
  },
});

export const ledGridStyle = style({
  display: "grid",
  gridTemplateColumns: "repeat(12, 1fr)",
  gridAutoRows: "1fr",
  gap: "2px",
  flex: 1,
  padding: "5px 2px",
  position: "relative",
  zIndex: 1,
  overflow: "hidden",
  border: `1px solid color-mix(in srgb, ${vars.colors.background} 8%, transparent)`,
  background: `color-mix(in srgb, ${vars.colors.foreground} 54%, transparent)`,
  boxShadow: `inset 0 0 14px color-mix(in srgb, ${vars.colors.foreground} 40%, transparent)`,
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: 0,
      backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 5px, color-mix(in srgb, ${vars.colors.background} 5%, transparent) 5px, color-mix(in srgb, ${vars.colors.background} 5%, transparent) 6px)`,
      opacity: 0.45,
      pointerEvents: "none",
    },
    "&::after": {
      content: "",
      position: "absolute",
      inset: "0 0 auto",
      height: "42%",
      background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.background} 8%, transparent), transparent)`,
      pointerEvents: "none",
    },
  },
});

export const ledGridVariantAStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 52%, transparent), color-mix(in srgb, ${vars.colors.tertiary} 8%, ${vars.colors.foreground}))`,
});

export const ledGridVariantBStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 50%, transparent), color-mix(in srgb, ${vars.colors.secondary} 10%, ${vars.colors.foreground}))`,
});

export const ledGridVariantCStyle = style({
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 50%, transparent), color-mix(in srgb, ${vars.colors.primary} 10%, ${vars.colors.foreground}))`,
});
export const driveBayStyle = style({
  height: "11px",
  margin: "0 4px",
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 88%, transparent), color-mix(in srgb, ${vars.colors.foreground} 70%, transparent))`,
  border: `1px solid color-mix(in srgb, ${vars.colors.foreground} 32%, ${vars.colors.tertiary})`,
  borderRadius: "1px",
  opacity: 0.78,
  position: "relative",
  zIndex: 1,
  boxShadow: `inset 0 2px 4px color-mix(in srgb, ${vars.colors.foreground} 44%, transparent), 0 1px 0 color-mix(in srgb, ${vars.colors.background} 8%, transparent)`,
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: "2px 3px",
      backgroundImage: `repeating-linear-gradient(90deg, color-mix(in srgb, ${vars.colors.background} 8%, transparent), color-mix(in srgb, ${vars.colors.background} 8%, transparent) 1px, transparent 1px, transparent 7px)`,
      opacity: 0.45,
    },
    "&::after": {
      content: "",
      position: "absolute",
      top: "2px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "6px",
      height: "1.5px",
      borderRadius: "0.5px",
      background: vars.colors.secondary,
      opacity: 0.5,
    },
  },
});

export const statusBarStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "2px 4px",
  height: "14px",
  position: "relative",
  zIndex: 1,
  background: `color-mix(in srgb, ${vars.colors.foreground} 52%, transparent)`,
  border: `1px solid color-mix(in srgb, ${vars.colors.foreground} 15%, transparent)`,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.35)",
});

export const accentStripStyle = style({
  height: "2px",
  margin: "1px 4px 0",
  borderRadius: "2px",
  background: accentSpectrum,
  opacity: 0.7,
  boxShadow: `0 0 5px color-mix(in srgb, ${vars.colors.tertiary} 35%, transparent)`,
  position: "relative",
  zIndex: 1,
});

export const accentStripVariantAStyle = style({
  opacity: 0.5,
  filter: "hue-rotate(-8deg)",
});

export const accentStripVariantBStyle = style({
  opacity: 0.52,
  filter: "saturate(.9) hue-rotate(18deg)",
});

export const accentStripVariantCStyle = style({
  opacity: 0.56,
  filter: "saturate(1.02) hue-rotate(-24deg)",
});

export const statusLedStyle = style({
  width: "5px",
  height: "5px",
  borderRadius: "50%",
  position: "relative",
  color: vars.colors.secondary,
  background:
    "radial-gradient(circle at 35% 35%, color-mix(in srgb, currentColor 45%, white), currentColor 58%, color-mix(in srgb, currentColor 55%, black) 100%)",
  border: "0.5px solid color-mix(in srgb, currentColor 45%, black)",
  boxShadow: "inset 0 -1px 1px rgba(0,0,0,.55)",
  animation: `${blinkSlow} calc(1.4s + var(--seed) * 1.9s) cubic-bezier(.4,0,.2,1) infinite`,
  animationDelay: `calc(var(--seed) * -3s)`,
  selectors: {
    "&[data-status='HDD']": { color: vars.colors.primary },
    "&[data-status='LAN']": { color: vars.colors.secondary },
    "&[data-status='ERR']": { color: vars.colors.destructive },
    '[data-server-rack-paused="true"] &': { animationPlayState: "paused" },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0.6,
    },
  },
});

export const statusLabelStyle = style({
  fontSize: "4px",
  color: `color-mix(in srgb, ${vars.colors.foreground} 38%, transparent)`,
  fontWeight: vars.fontWeight.bold,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  flex: 1,
});

export const screwStyle = style({
  position: "absolute",
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  background: `color-mix(in srgb, ${vars.colors.foreground} 45%, ${vars.colors.tertiary})`,
  boxShadow: "inset 0 0 1px rgba(0,0,0,0.5)",
  zIndex: 3,
  top: "4px",
  selectors: {
    "&:nth-child(1)": { left: "4px" },
    "&:nth-child(2)": { right: "4px" },
    "&:nth-child(3)": { left: "4px", bottom: "4px", top: "auto" },
    "&:nth-child(4)": { right: "4px", bottom: "4px", top: "auto" },
  },
});
