import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

// Backgrounds
const getBackground = (opacity: number) =>
  `linear-gradient(20deg, color-mix(in srgb, ${vars.colors.foreground} ${opacity}%, ${vars.colors.tertiary}), transparent), url(https://grainy-gradients.vercel.app/noise.svg)`;

const backgroundLidComputer = getBackground(95);
const backgroundChassisComputer = getBackground(90);

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
      backgroundImage: "linear-gradient(to top, transparent, transparent, #333333, #333333)",
      backgroundSize: "100% 4px",
      backgroundPosition: "100% 92%",
      opacity: 0.5,
    },
  },
});

export const computerScreenContentStyle = style({
  width: "100px",
});

// Lid frame
export const computerFrameLidStyle = style([
  baseFrameStyle,
  {
    height: "66%",
    top: "2%",
    transform: "rotateY(-45deg) rotateX(15deg)",
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

export const computerFrameLidBackStyle = lidFaceWithBackground("translateZ(-10px)");

export const computerFrameLidBottomStyle = style([
  baseHorizontalEdgeStyle,
  {
    bottom: "0",
    transform: "rotateX(90deg) translateY(-5px) translateZ(-5px)",
    background: backgroundLidComputer,
  },
]);

export const computerFrameLidLeftStyle = style([
  baseEdgeFaceStyle,
  {
    right: "0",
    transform: "translateZ(-5px) translateX(5px) rotateY(90deg)",
    background: backgroundLidComputer,
  },
]);

export const computerFrameLidRightStyle = style([
  baseEdgeFaceStyle,
  {
    transform: "translateZ(-5px) translateX(-5px) rotateY(90deg)",
    background: backgroundLidComputer,
  },
]);

export const computerFrameLidTopStyle = style([
  baseHorizontalEdgeStyle,
  {
    transform: "rotateX(90deg) translateY(-5px) translateZ(5px)",
    background: backgroundLidComputer,
  },
]);

// Chassis frame
export const computerFrameChassisStyle = style([
  baseFrameStyle,
  {
    height: "70%",
    top: "33%",
    transform: "rotateY(-45deg) rotateX(90deg) translateX(-10px) translateY(55%)",
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
  },
]);

export const computerFrameChassisBackStyle = chassisFaceWithBackground("translateZ(-10px)");

export const computerFrameChassisBottomStyle = style([
  baseHorizontalEdgeStyle,
  {
    bottom: "0",
    transform: "rotateX(90deg) translateY(-5px) translateZ(-5px)",
    background: backgroundChassisComputer,
  },
]);

export const computerFrameChassisLeftStyle = style([
  baseEdgeFaceStyle,
  {
    right: "0",
    transform: "translateZ(-5px) translateX(5px) rotateY(90deg)",
    background: backgroundChassisComputer,
  },
]);

export const computerFrameChassisRightStyle = style([
  baseEdgeFaceStyle,
  {
    transform: "translateZ(-5px) translateX(-5px) rotateY(90deg)",
    background: backgroundChassisComputer,
  },
]);

export const computerFrameChassisTopStyle = style([
  baseHorizontalEdgeStyle,
  {
    transform: "rotateX(90deg) translateY(-5px) translateZ(5px)",
    background: backgroundChassisComputer,
  },
]);
