import { createVar, fallbackVar, keyframes, style, styleVariants } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

/**
 * Rack sizing contract. A `size` preset sets it on the rack; with `size="inherit"` the host
 * sets it on an ancestor (per breakpoint, in its own CSS).
 */
export const serverRackVars = {
  width: createVar(),
  unitHeight: createVar(),
  gap: createVar(),
  patchHeight: createVar(),
};

const rackWidth = fallbackVar(serverRackVars.width, "300px");
const unitHeight = fallbackVar(serverRackVars.unitHeight, "128px");
const rackGap = fallbackVar(serverRackVars.gap, "10px");
const patchHeight = fallbackVar(serverRackVars.patchHeight, "84px");

const rackSize = (unit: number, patch: number) => ({
  vars: {
    [serverRackVars.unitHeight]: `${unit}px`,
    [serverRackVars.gap]: "10px",
    [serverRackVars.patchHeight]: `${patch}px`,
  },
});

export const serverUnitRackSizeStyles = styleVariants({
  xs: rackSize(50, 72),
  sm: rackSize(100, 80),
  md: rackSize(128, 84),
  lg: rackSize(160, 96),
});

/** Per-LED phase, `0`–`1` (set inline): desynchronises the status LEDs. */
export const serverLedSeed = createVar();

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
  minHeight: unitHeight,
  position: "relative",
  transformStyle: "preserve-3d",
});

export const serverUnitRackPerspectiveStyle = style({
  width: rackWidth,
  // Three units and their gaps; a patch unit adds its height and one more gap.
  height: `calc(${unitHeight} * 3 + ${rackGap} * 2)`,
  perspective: "2000px",
  perspectiveOrigin: "bottom center",
  position: "relative",
  transformStyle: "preserve-3d",
  selectors: {
    '&[data-server-rack-patch="true"]': {
      height: `calc(${unitHeight} * 3 + ${rackGap} * 3 + ${patchHeight})`,
    },
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

// The patch unit keeps its own height; the three servers share what is left.
export const serverUnitContainerLinkStyle = style({
  flex: `0 0 ${patchHeight}`,
  minHeight: patchHeight,
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

// Pull handles: small chrome bars catching the light from the top left.
export const serverHandleStyle = style({
  position: "absolute",
  top: "50%",
  width: "3px",
  height: "20px",
  borderRadius: "99px",
  background: "linear-gradient(90deg, #4a4a52, #d9d9df 42%, #8a8a92 60%, #2a2a30)",
  boxShadow: "0 1px 1.5px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
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

// Each unit shows its own hardware behind the bezel (CSS only, no extra DOM):
// CORE a row of hot-swap drive caddies, EDGE a perforated grille and a status LCD,
// ARCHIVE a tape library's slots.
const driveActivity = keyframes({
  "0%, 100%": { opacity: 0.25 },
  "12%": { opacity: 1 },
  "18%": { opacity: 0.35 },
  "46%": { opacity: 0.9 },
  "52%": { opacity: 0.25 },
  "78%": { opacity: 1 },
  "84%": { opacity: 0.4 },
});

const panelHighlight = `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.background} 7%, transparent), transparent 42%)`;

export const ledGridVariantAStyle = style({
  background: [
    panelHighlight,
    // Caddy seams, eight bays.
    "repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.65) 0 1px, rgba(255, 255, 255, 0.06) 1px 2px, transparent 2px 12.5%)",
    // Pull tab across the lower third of each caddy.
    "linear-gradient(180deg, transparent 0 68%, rgba(255, 255, 255, 0.07) 68% 73%, rgba(0, 0, 0, 0.45) 73% 76%, transparent 76%)",
    // Power LEDs, one per caddy.
    `radial-gradient(circle at 26% 22%, ${vars.colors.secondary} 0 0.7px, transparent 1.3px) 0 0 / 12.5% 100% repeat-x`,
    `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 84%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.tertiary} 10%, ${vars.colors.foreground}))`,
  ].join(", "),
  selectors: {
    // Activity LEDs flicker as the drives work; paused off screen, still under reduced motion.
    "&::before": {
      backgroundImage: `radial-gradient(circle at 44% 22%, ${vars.colors.primary} 0 0.7px, transparent 1.3px)`,
      backgroundSize: "12.5% 100%",
      backgroundRepeat: "repeat-x",
      opacity: 0.9,
      animation: `${driveActivity} 2.6s steps(1, end) infinite`,
    },
    '[data-server-rack-paused="true"] &::before': { animationPlayState: "paused" },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      selectors: { "&::before": { animation: "none", opacity: 0.6 } },
    },
  },
});

export const ledGridVariantBStyle = style({
  background: [
    panelHighlight,
    // Perforated grille.
    "radial-gradient(circle, rgba(0, 0, 0, 0.8) 0 0.75px, transparent 1.05px) 0 0 / 3px 3px",
    `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 80%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.secondary} 12%, ${vars.colors.foreground}))`,
  ].join(", "),
  selectors: {
    // A small status LCD on the right, mint behind scanlines.
    "&::before": {
      inset: "auto 5px auto auto",
      top: "50%",
      width: "26%",
      height: "46%",
      transform: "translateY(-50%)",
      borderRadius: "1px",
      backgroundImage: `repeating-linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0 0.5px, transparent 0.5px 1.5px), linear-gradient(180deg, color-mix(in srgb, ${vars.colors.secondary} 32%, #000), color-mix(in srgb, ${vars.colors.secondary} 16%, #000))`,
      boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 6px color-mix(in srgb, ${vars.colors.secondary} 30%, transparent)`,
      opacity: 1,
    },
  },
});

export const ledGridVariantCStyle = style({
  background: [
    panelHighlight,
    // Three cartridge slots.
    "repeating-linear-gradient(180deg, transparent 0 12%, rgba(0, 0, 0, 0.78) 12% 22%, rgba(255, 255, 255, 0.07) 22% 23.5%, transparent 23.5% 33.34%)",
    // A drive LED at the end of each slot.
    `radial-gradient(circle at 94% 17%, ${vars.colors.primary} 0 0.7px, transparent 1.3px) 0 0 / 100% 33.34% repeat-y`,
    `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 86%, ${vars.colors.background}), color-mix(in srgb, ${vars.colors.primary} 10%, ${vars.colors.foreground}))`,
  ].join(", "),
  selectors: {
    // Cartridge labels at the mouth of each slot.
    "&::before": {
      inset: "0 auto 0 6px",
      width: "12%",
      backgroundImage: `repeating-linear-gradient(180deg, transparent 0 13%, color-mix(in srgb, ${vars.colors.primary} 45%, #000) 13% 21%, transparent 21% 33.34%)`,
      opacity: 0.85,
    },
  },
});

export const driveBayStyle = style({
  height: "11px",
  margin: "0 4px",
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 88%, transparent), color-mix(in srgb, ${vars.colors.foreground} 70%, transparent))`,
  border: `1px solid color-mix(in srgb, ${vars.colors.tertiary} 45%, ${vars.colors.foreground})`,
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
  animation: `${blinkSlow} calc(1.4s + ${serverLedSeed} * 1.9s) cubic-bezier(.4,0,.2,1) infinite`,
  animationDelay: `calc(${serverLedSeed} * -3s)`,
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

// Steel screws with a slot.
export const screwStyle = style({
  position: "absolute",
  width: "4px",
  height: "4px",
  borderRadius: "50%",
  background:
    "linear-gradient(45deg, transparent 42%, rgba(0, 0, 0, 0.55) 42% 58%, transparent 58%), radial-gradient(circle at 35% 30%, #a2a2aa, #45454c 60%, #1c1c20)",
  boxShadow: "0 0.5px 0.5px rgba(0, 0, 0, 0.6)",
  zIndex: 3,
  top: "4px",
  selectors: {
    "&:nth-child(1)": { left: "4px" },
    "&:nth-child(2)": { right: "4px" },
    "&:nth-child(3)": { left: "4px", bottom: "4px", top: "auto" },
    "&:nth-child(4)": { right: "4px", bottom: "4px", top: "auto" },
  },
});

// ── Patch unit (NETOUN LINK) ────────────────────────────────────────────────
// Keystone jacks drawn like the ones a patch panel really carries: a machined
// bezel, a dark cavity with gold contacts and the latch notch, an LED above.

export const ledGridLinkStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  padding: "2px 12px",
  background: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 55%, transparent), color-mix(in srgb, ${vars.colors.tertiary} 8%, ${vars.colors.foreground}))`,
});

const patchAccentVar = createVar();

export const patchJackStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  position: "relative",
  zIndex: 1,
});

export const patchJackAccentStyles = styleVariants({
  primary: { vars: { [patchAccentVar]: vars.colors.primary } },
  secondary: { vars: { [patchAccentVar]: vars.colors.secondary } },
  tertiary: { vars: { [patchAccentVar]: vars.colors.tertiary } },
  kirby: { vars: { [patchAccentVar]: vars.colors.kirby } },
});

export const patchJackHeadStyle = style({
  display: "flex",
  alignItems: "center",
  gap: "4px",
  height: "5px",
  fontFamily: vars.fontFamily.doto,
  fontSize: "5px",
  fontWeight: vars.fontWeight.extrabold,
  lineHeight: 1,
  letterSpacing: "0.6px",
  color: `color-mix(in srgb, ${vars.colors.background} 55%, transparent)`,
});

export const patchJackLedStyle = style({
  display: "block",
  width: "5px",
  height: "3px",
  borderRadius: "1px",
  background: `color-mix(in srgb, ${patchAccentVar} 28%, #000)`,
  boxShadow: "inset 0 0.5px 0 rgba(255, 255, 255, 0.25)",
  selectors: {
    [`${patchJackStyle}[data-plugged="true"] &`]: {
      background: patchAccentVar,
      boxShadow: `0 0 4px ${patchAccentVar}, inset 0 0.5px 0 rgba(255, 255, 255, 0.5)`,
    },
  },
});

export const patchJackSocketStyle = style({
  position: "relative",
  display: "block",
  width: "30px",
  height: "24px",
  borderRadius: "2.5px",
  background: "linear-gradient(180deg, #3a3a42, #16161b 55%, #101014)",
  boxShadow:
    "0 1px 0 rgba(255, 255, 255, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 0 rgba(0, 0, 0, 0.6)",
});

export const patchJackCavityStyle = style({
  position: "absolute",
  inset: "3px",
  borderRadius: "1.5px",
  background: "linear-gradient(180deg, #030304, #0c0c0f)",
  boxShadow: "inset 0 2px 3px #000, inset 0 -1px 0 rgba(255, 255, 255, 0.05)",
  selectors: {
    // Eight gold contacts.
    "&::before": {
      content: "",
      position: "absolute",
      left: "4px",
      right: "4px",
      top: "2px",
      height: "6px",
      background: `repeating-linear-gradient(90deg, color-mix(in srgb, ${vars.colors.primary} 80%, #7a5a00) 0 0.8px, transparent 0.8px 2.1px)`,
      opacity: 0.9,
    },
    // The latch notch.
    "&::after": {
      content: "",
      position: "absolute",
      left: "8px",
      right: "8px",
      bottom: 0,
      height: "5px",
      borderRadius: "1px 1px 0 0",
      background: "#000",
    },
  },
});

export const patchJackPlugStyle = style({
  display: "none",
  position: "absolute",
  inset: "1px",
  borderRadius: "2px",
  background: "linear-gradient(180deg, #2c2c33, #131317)",
  border: `1px solid color-mix(in oklab, ${patchAccentVar} 55%, #121214)`,
  boxShadow:
    "inset 0 1px 0 rgba(255, 255, 255, 0.22), inset 0 -2px 3px rgba(0, 0, 0, 0.6), 0 2px 3px rgba(0, 0, 0, 0.6)",
  selectors: {
    [`${patchJackStyle}[data-plugged="true"] &`]: { display: "block" },
    // Gloss along the plug's top edge.
    "&::before": {
      content: "",
      position: "absolute",
      left: "5px",
      right: "5px",
      top: "3px",
      height: "2px",
      borderRadius: "1px",
      background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)",
    },
    // The latch tab, in the port's accent.
    "&::after": {
      content: "",
      position: "absolute",
      left: "8px",
      right: "8px",
      bottom: "2px",
      height: "5px",
      borderRadius: "1px",
      background: `color-mix(in oklab, ${patchAccentVar} 60%, #121214)`,
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.25)",
    },
  },
});

// ── Cabinet ─────────────────────────────────────────────────────────────────
// One continuous cabinet around the units, so the stack reads as a rack and not as boxes:
// two side panels and two caps, 3px outside the units and 3px proud of their bezels.
const cabinetDepth = serverDepth + 6;
const cabinetMetal = `linear-gradient(90deg, #2a2a31 0%, #16161a 10%, #0e0e11 100%), url(/images/noise.svg)`;

export const cabinetSideStyle = style({
  position: "absolute",
  top: "-3px",
  bottom: "-3px",
  width: `${cabinetDepth}px`,
  transformOrigin: "0 50%",
  transform: "translateZ(3px) rotateY(90deg)",
  background: [
    // Vent slots near the front edge.
    "repeating-linear-gradient(180deg, transparent 0 6px, rgba(0, 0, 0, 0.7) 6px 9px, rgba(255, 255, 255, 0.05) 9px 10px) 14% 0 / 16% 100% no-repeat",
    cabinetMetal,
  ].join(", "),
  boxShadow:
    "inset 1px 0 0 rgba(255, 255, 255, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.06), inset 0 -1px 0 rgba(0, 0, 0, 0.6)",
  pointerEvents: "none",
  selectors: {
    "&[data-side='left']": { left: "-3px" },
    "&[data-side='right']": { left: "calc(100% + 3px)" },
  },
});

export const cabinetCapStyle = style({
  position: "absolute",
  left: "-3px",
  right: "-3px",
  height: `${cabinetDepth}px`,
  transformOrigin: "50% 0",
  transform: "translateZ(3px) rotateX(-90deg)",
  background: `linear-gradient(180deg, #24242a, #111114 40%, #0b0b0d), url(/images/noise.svg)`,
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.16)",
  pointerEvents: "none",
  selectors: {
    "&[data-edge='top']": { top: "-3px" },
    "&[data-edge='bottom']": { top: "calc(100% + 3px)" },
  },
});
