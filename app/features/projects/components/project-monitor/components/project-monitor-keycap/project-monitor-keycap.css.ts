import { motion } from "@styles/motion.css";
import { vars } from "@styles/theme.css";
import { globalStyle, style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// A real CSS-3D keycap (top plate + front and right walls), in the ink of the laptop's
// keyboard. It sinks when its button is pressed, and when the matching key is pressed
// inside the projects grid (`data-down`).

const WALL = 6;
const DEPTH = 17;
const POSE = "rotateX(-52deg) rotateY(-14deg)";
const PRESSED_POSE = `${POSE} translateY(2px)`;

const size = { key: 22, wide: 30 } as const;

function plates(width: number) {
  const centred = "translate(-50%, -50%)";
  return {
    top: {
      width: `${width}px`,
      height: `${DEPTH}px`,
      transform: `${centred} rotateX(90deg) translateZ(${WALL / 2}px)`,
    },
    front: {
      width: `${width}px`,
      height: `${WALL}px`,
      transform: `${centred} translateZ(${DEPTH / 2}px)`,
    },
    right: {
      width: `${DEPTH}px`,
      height: `${WALL}px`,
      transform: `${centred} rotateY(90deg) translateZ(${width / 2}px)`,
    },
  };
}

export const keycapStyle = recipe({
  base: {
    position: "relative",
    display: "inline-block",
    flexShrink: 0,
    height: "20px",
  },
  variants: {
    width: {
      key: { width: `${size.key + 4}px` },
      wide: { width: `${size.wide + 4}px` },
    },
  },
});

// The key's contact shadow on the bar: tightens as the key goes down.
export const shadowStyle = style({
  position: "absolute",
  left: "10%",
  right: "4%",
  bottom: "-1px",
  height: "6px",
  borderRadius: vars.radius.full,
  background: `radial-gradient(closest-side, color-mix(in srgb, ${vars.colors.foreground} 45%, transparent), transparent)`,
  transition: `transform ${motion.duration.fast} ${motion.easing.out}, opacity ${motion.duration.fast} ${motion.easing.out}`,
});

export const bodyStyle = style({
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 0,
  height: 0,
  transformStyle: "preserve-3d",
  transform: POSE,
  transition: `transform ${motion.duration.fast} ${motion.easing.out}`,
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

export const plateStyle = style({
  position: "absolute",
  left: 0,
  top: 0,
  boxSizing: "border-box",
});

export const keyPlateStyle = styleVariants(plates(size.key));
export const widePlateStyle = styleVariants(plates(size.wide));

export const topShadeStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "3px",
  background: `linear-gradient(160deg, oklch(0.34 0.004 80), oklch(0.17 0.004 80))`,
  boxShadow: `inset 0 1px 0 color-mix(in srgb, white 18%, transparent), inset 0 0 0 0.5px color-mix(in srgb, black 40%, transparent)`,
  color: vars.colors.background,
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.extrabold,
  fontSize: "0.75rem",
  lineHeight: 1,
});

export const frontShadeStyle = style({
  borderRadius: "0 0 3px 3px",
  background: `linear-gradient(180deg, oklch(0.2 0.004 80), oklch(0.1 0.004 80))`,
});

export const rightShadeStyle = style({
  background: `linear-gradient(180deg, oklch(0.14 0.004 80), oklch(0.07 0 0))`,
});

// Pressed: by the pointer on its button or link, or by the matching key in the grid.
const PRESSED_BY = ["[data-pressed]", "a:active", "[data-down]"];
const whenPressed = (target: string) => PRESSED_BY.map((by) => `${by} ${target}`).join(", ");

globalStyle(whenPressed(bodyStyle), {
  transform: PRESSED_POSE,
});

globalStyle(whenPressed(shadowStyle), {
  transform: "scaleX(0.82)",
  opacity: 0.7,
});
