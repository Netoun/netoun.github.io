import { createVar, fallbackVar, globalStyle, style } from "@vanilla-extract/css";
import { motion } from "@/styles/motion.css";
import { vars } from "@/styles/theme.css";
import { weight } from "@styles/weight";

// Backgrounds
const getBackground = (opacity: number) =>
  `linear-gradient(20deg, color-mix(in srgb, ${vars.colors.foreground} ${opacity}%, ${vars.colors.tertiary}), transparent), url(/images/noise.svg)`;

const backgroundLidComputer = getBackground(95);
const backgroundChassisComputer = getBackground(90);

/**
 * Where each face sits on its frame: the lid and the chassis are the same box, 10 px deep,
 * its front at z = 0. The Lab's xray prints these.
 */
export const computerFaceTransforms = {
  front: "none",
  back: "translateZ(-10px)",
  bottom: "rotateX(90deg) translateY(-5px) translateZ(-5px)",
  left: "translateZ(-5px) translateX(5px) rotateY(90deg)",
  right: "translateZ(-5px) translateX(-5px) rotateY(90deg)",
  top: "rotateX(90deg) translateY(-5px) translateZ(5px)",
} as const;

export type ComputerFace = keyof typeof computerFaceTransforms;

// Which way is out, in each face's own frame after its transform: the explode pushes it there.
const faceNormal: Record<ComputerFace, 1 | -1> = {
  front: 1,
  back: -1,
  bottom: -1,
  left: 1,
  right: -1,
  top: 1,
};

/** Xray only: how far every face is pulled out along its normal (a length, 0 when unset). */
export const computerExplode = createVar();
const explode = fallbackVar(computerExplode, "0px");

const explodedTransform = (face: ComputerFace) => {
  const base = computerFaceTransforms[face];
  return `${base === "none" ? "" : `${base} `}translateZ(calc(${faceNormal[face]} * ${explode}))`;
};

// Base styles
const baseFrameStyle = style({
  position: "absolute",
  width: "60%",
  left: "38%",
  transformStyle: "preserve-3d",
});

const baseFaceStyle = style({
  position: "absolute",
  opacity: 0.5,
});

const baseFullFaceStyle = style([
  baseFaceStyle,
  {
    width: "100%",
    height: "100%",
  },
]);

const baseEdgeFaceStyle = style([
  baseFaceStyle,
  {
    width: "10px",
    height: "100%",
  },
]);

const baseHorizontalEdgeStyle = style([
  baseFaceStyle,
  {
    width: "100%",
    height: "10px",
  },
]);

// Computer container
export const computerStyle = style({
  padding: vars.spacing.md,
  position: "relative",
  zIndex: 20,
  perspective: "2000px",
  transformStyle: "preserve-3d",
  aspectRatio: "400 / 272.5",
  perspectiveOrigin: "top left",
});

// Screen
export const computerScreenStyle = style({
  width: "100%",
  height: "100%",
  boxShadow: vars.boxShadow.innerMd,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.xs,
  color: vars.colors.primary,
  backgroundColor: vars.colors.foreground,
  selectors: {
    "&::before": {
      content: "",
      position: "absolute",
      inset: 0,
      border: `1px solid ${vars.colors.border}`,
      borderRadius: vars.radius.sm,
      opacity: 0.5,
    },
    "&::after": {
      content: "",
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(to top, transparent, transparent, color-mix(in srgb, ${vars.colors.foreground} 20%, transparent), color-mix(in srgb, ${vars.colors.foreground} 20%, transparent))`,
      backgroundSize: "100% 4px",
      backgroundPosition: "100% 92%",
      opacity: 0.5,
    },
  },
});

/** Each frame's pose in the container: the lid leans back, the chassis lies flat. */
export const computerFrameTransforms = {
  lid: "rotateY(-45deg) rotateX(15deg)",
  chassis: "rotateY(-45deg) rotateX(90deg) translateX(-10px) translateY(55%)",
} as const;

// Lid frame
export const computerFrameLidStyle = style([
  baseFrameStyle,
  {
    height: "66%",
    top: "2%",
    transform: computerFrameTransforms.lid,
    background: backgroundLidComputer,
  },
]);

// Lid faces
const lidFaceWithBackground = (transform?: string) =>
  style([
    baseFullFaceStyle,
    {
      background: backgroundLidComputer,
      ...(transform && { transform }),
    },
  ]);

export const computerFrameLidFrontStyle = style([
  lidFaceWithBackground(),
  {
    padding: vars.spacing.sm,
    selectors: {
      "&::after": {
        color: vars.colors.primary,
        content: "NETOUN COMPUTERS",
        position: "absolute",
        bottom: "0.05rem",
        fontSize: "0.25rem",
        left: "50%",
        transform: "translateX(-50%)",
        textShadow: vars.textShadow.glow,
      },
    },
  },
]);

export const computerFrameLidBackStyle = lidFaceWithBackground(computerFaceTransforms.back);

export const computerFrameLidBottomStyle = style([
  baseHorizontalEdgeStyle,
  {
    bottom: "0",
    transform: computerFaceTransforms.bottom,
    background: backgroundLidComputer,
  },
]);

export const computerFrameLidLeftStyle = style([
  baseEdgeFaceStyle,
  {
    right: "0",
    transform: computerFaceTransforms.left,
    background: backgroundLidComputer,
  },
]);

export const computerFrameLidRightStyle = style([
  baseEdgeFaceStyle,
  {
    transform: computerFaceTransforms.right,
    background: backgroundLidComputer,
  },
]);

export const computerFrameLidTopStyle = style([
  baseHorizontalEdgeStyle,
  {
    transform: computerFaceTransforms.top,
    background: backgroundLidComputer,
  },
]);

// Chassis frame
export const computerFrameChassisStyle = style([
  baseFrameStyle,
  {
    height: "70%",
    top: "33%",
    transform: computerFrameTransforms.chassis,
    background: backgroundChassisComputer,
  },
]);

// Chassis faces
const chassisFaceWithBackground = (transform?: string) =>
  style([
    baseFullFaceStyle,
    {
      background: backgroundChassisComputer,
      ...(transform && { transform }),
    },
  ]);

export const computerFrameChassisFrontStyle = style([
  chassisFaceWithBackground(),
  {
    padding: vars.spacing.sm,
    // The keyboard sizes itself on this face's width (`cqi`).
    containerType: "inline-size",
  },
]);

// Palm rest, under the keyboard: sized on the chassis face like the keys.
export const computerTrackpadStyle = style({
  width: "38%",
  aspectRatio: "16 / 10",
  marginInline: "auto",
  marginTop: "3cqi",
  background: `color-mix(in srgb, ${vars.colors.foreground} 92%, ${vars.colors.tertiary})`,
  border: `0.4cqi solid color-mix(in srgb, ${vars.colors.foreground} 70%, ${vars.colors.tertiary})`,
  borderRadius: "2.5cqi",
  boxShadow: `inset 0 0.4cqi 0.8cqi color-mix(in srgb, ${vars.colors.foreground} 30%, transparent)`,
});

export const computerFrameChassisBackStyle = chassisFaceWithBackground(computerFaceTransforms.back);

export const computerFrameChassisBottomStyle = style([
  baseHorizontalEdgeStyle,
  {
    bottom: "0",
    transform: computerFaceTransforms.bottom,
    background: backgroundChassisComputer,
  },
]);

export const computerFrameChassisLeftStyle = style([
  baseEdgeFaceStyle,
  {
    right: "0",
    transform: computerFaceTransforms.left,
    background: backgroundChassisComputer,
  },
]);

export const computerFrameChassisRightStyle = style([
  baseEdgeFaceStyle,
  {
    transform: computerFaceTransforms.right,
    background: backgroundChassisComputer,
  },
]);

export const computerFrameChassisTopStyle = style([
  baseHorizontalEdgeStyle,
  {
    transform: computerFaceTransforms.top,
    background: backgroundChassisComputer,
  },
]);

// Xray (the Lab): every face outlined and pushed out along its normal, the frames' own
// backgrounds off so each face reads alone, the picked face lit. The home never sets
// `data-xray`, so none of this reaches it.
const xray = `${computerStyle}[data-xray]`;

globalStyle(`${xray} [data-frame]`, { background: "none" });

for (const face of Object.keys(computerFaceTransforms) as ComputerFace[]) {
  globalStyle(`${xray} [data-face="${face}"]`, {
    transform: explodedTransform(face),
    opacity: 0.66,
    outline: `1px solid color-mix(in srgb, ${vars.colors.primary} 70%, transparent)`,
    outlineOffset: "-1px",
    transition: `transform 420ms ${motion.easing.signature}, opacity 200ms`,
  });
}

globalStyle(`${xray} [data-face][data-lit]`, {
  opacity: 0.92,
  background: `color-mix(in srgb, ${vars.colors.primary} 72%, transparent)`,
  outline: `2px solid ${vars.colors.primary}`,
});

// Names on the four full faces; the 10 px edges are named in the Lab's panel.
globalStyle(`${xray} [data-face][data-label]::before`, {
  content: "attr(data-label)",
  position: "absolute",
  zIndex: 1,
  left: "6px",
  bottom: "6px",
  padding: "1px 5px",
  borderRadius: "2px",
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  fontSize: "9px",
  lineHeight: 1.4,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: vars.colors.foreground,
  background: vars.colors.primary,
});

globalStyle(`${xray} [data-face]`, {
  "@media": { "(prefers-reduced-motion: reduce)": { transition: "none" } },
});
