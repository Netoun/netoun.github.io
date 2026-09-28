import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// Tiny CSS-3D objects, drawn like the laptop and the rack: six real faces, no image.
// Orthographic (no perspective): at 12–18px an isometric read stays crisp.

const tone = createVar();

/** Resting pose: front, right and top faces showing. Parents may turn it further. */
const BOX_POSE = "rotateX(-24deg) rotateY(-35deg)";

type Side = "front" | "back" | "right" | "left" | "top" | "bottom";

function faces(
  width: number,
  height: number,
  depth: number,
): Record<Side, Parameters<typeof style>[0]> {
  const centred = "translate(-50%, -50%)";
  const face = (w: number, h: number, transform: string) => ({
    width: `${w}px`,
    height: `${h}px`,
    transform: `${centred} ${transform}`,
  });
  return {
    front: face(width, height, `translateZ(${depth / 2}px)`),
    back: face(width, height, `rotateY(180deg) translateZ(${depth / 2}px)`),
    right: face(depth, height, `rotateY(90deg) translateZ(${width / 2}px)`),
    left: face(depth, height, `rotateY(-90deg) translateZ(${width / 2}px)`),
    top: face(width, depth, `rotateX(90deg) translateZ(${height / 2}px)`),
    bottom: face(width, depth, `rotateX(-90deg) translateZ(${height / 2}px)`),
  };
}

// Light from the top-left: the top face is the brightest, the right side the darkest visible one.
const SHADE: Record<Side, string> = {
  top: `linear-gradient(135deg, color-mix(in srgb, ${tone} 55%, white), color-mix(in srgb, ${tone} 80%, white))`,
  front: `linear-gradient(180deg, color-mix(in srgb, ${tone} 92%, white), ${tone})`,
  right: `linear-gradient(180deg, color-mix(in srgb, ${tone} 78%, black), color-mix(in srgb, ${tone} 64%, black))`,
  left: `color-mix(in srgb, ${tone} 86%, black)`,
  back: `color-mix(in srgb, ${tone} 55%, black)`,
  bottom: `color-mix(in srgb, ${tone} 50%, black)`,
};

export const boxStyle = recipe({
  base: {
    position: "relative",
    display: "inline-block",
    flexShrink: 0,
    transformStyle: "preserve-3d",
    transform: BOX_POSE,
    transition: `transform ${motion.duration.slow} ${motion.easing.signature}`,
    "@media": {
      "(prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
  },
  variants: {
    kind: {
      cube: { width: "12px", height: "12px" },
      server: { width: "18px", height: "8px" },
    },
    tone: {
      mint: { vars: { [tone]: vars.colors.secondary } },
      violet: { vars: { [tone]: vars.colors.tertiary } },
      gold: { vars: { [tone]: vars.colors.primary } },
      azure: { vars: { [tone]: vars.colors.azure } },
      graphite: { vars: { [tone]: "oklch(0.36 0.006 80)" } },
    },
  },
});

export const faceStyle = style({
  position: "absolute",
  left: "50%",
  top: "50%",
  boxSizing: "border-box",
  boxShadow: `inset 0 0 0 0.5px color-mix(in srgb, black 22%, transparent)`,
});

export const shadeStyle = styleVariants(SHADE, (background) => ({ background }));

export const cubeFaceStyle = styleVariants(faces(12, 12, 12));
export const serverFaceStyle = styleVariants(faces(18, 8, 12));

// The rack unit's front: two vent slots and a mint LED over its own shade, like the footer's rack.
export const serverFrontStyle = style({
  backgroundImage: `
    radial-gradient(circle at 14px 50%, ${vars.colors.secondary} 0 1.6px, transparent 2px),
    repeating-linear-gradient(90deg, color-mix(in srgb, black 35%, transparent) 0 1px, transparent 1px 3px),
    ${SHADE.front}
  `,
  backgroundSize: "100% 100%, 8px 3px, 100% 100%",
  backgroundPosition: "0 0, 3px 2.5px, 0 0",
  backgroundRepeat: "no-repeat",
});
