import { vars } from "@styles/theme.css";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import {
  domainAccents,
  geometry,
  laneBottomVar,
  laneColors,
  laneTopVar,
  railColor,
  softLaneBottom,
  softLaneTop,
} from "../../experience-log.css";

const centerVar = createVar();
const sizeVar = createVar();
const commitLineVar = createVar();
const commitFillVar = createVar();

const MAIN_CENTER = `calc(${geometry.column} * 0.25)`;
const BRANCH_CENTER = `calc(${geometry.column} * 0.75)`;

// A bead of the lane colour: a soft highlight up-left, lit to deep across it, like the
// monitor's LEDs and cubes. Metal and light, never a glow.
const bead = (lit: string, deep: string) =>
  `radial-gradient(circle at 34% 30%, color-mix(in oklab, ${lit} 40%, white) 0, ${lit} 42%, ${deep} 100%)`;

export const graphStyle = style({
  position: "relative",
  alignSelf: "stretch",
  minHeight: "100%",
});

// The unlisted client work: the branch keeps going, unprinted, as round dots.
export const elidedLaneStyle = style({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: `calc(${BRANCH_CENTER} - ${geometry.stroke} / 2)`,
  width: geometry.stroke,
  backgroundImage: `radial-gradient(circle, ${softLaneBottom} 1.4px, transparent 1.7px)`,
  backgroundSize: `${geometry.stroke} 8px`,
  backgroundRepeat: "repeat-y",
  backgroundPosition: "center 3px",
});

// One path for every width: the viewBox stretches with the row, the stroke does not.
// Each curve runs on to the centre of its merge node, so the node hides where the
// coloured lane meets the thinner rail.
export const connectorStyle = recipe({
  base: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: `calc(100% + ${geometry.nodeY})`,
    overflow: "visible",
    zIndex: 0,
  },
  variants: {
    kind: {
      fork: { top: 0 },
      "merge-in": { top: `calc(-1 * ${geometry.nodeY})` },
    },
  },
});

export const connectorPathStyle = style({
  fill: "none",
  strokeWidth: geometry.stroke,
  // Butt ends: each path runs a few pixels straight into the lane it joins, same colour.
  strokeLinecap: "butt",
  vectorEffect: "non-scaling-stroke",
});

// Gradient stops of the curves: the branch fades into main's rail where they meet.
export const stopRailStyle = style({ stopColor: railColor });
export const stopLitStyle = style({ stopColor: softLaneTop });
export const stopDeepStyle = style({ stopColor: softLaneBottom });

export const nodeStyle = recipe({
  base: {
    position: "absolute",
    width: sizeVar,
    height: sizeVar,
    left: `calc(${centerVar} - ${sizeVar} / 2)`,
    top: `calc(${geometry.nodeY} - ${sizeVar} / 2)`,
    // Above every curve, including the one of the next row that starts at its centre. No
    // paper halo: the lines run right up to the nodes, as in git's own graph.
    zIndex: 2,
    boxSizing: "border-box",
    borderRadius: vars.radius.full,
  },
  variants: {
    lane: {
      main: { vars: { [centerVar]: MAIN_CENTER } },
      branch: { vars: { [centerVar]: BRANCH_CENTER } },
    },
    kind: {
      // HEAD: a bead of the branch colour in a paper halo and a gold ring, the one lit mark.
      head: {
        vars: { [sizeVar]: geometry.nodeLarge },
        backgroundImage: bead(laneTopVar, laneBottomVar),
        // The gold ring stands off the bead; paper fills the gap so the lane stays under it.
        boxShadow: `0 0 0 ${geometry.halo} ${vars.colors.background}`,
        outline: `2.5px solid ${vars.colors.primary}`,
        outlineOffset: geometry.halo,
      },
      tip: {
        vars: { [sizeVar]: geometry.nodeMedium },
        backgroundImage: bead(laneTopVar, laneBottomVar),
      },
      // A client project: ringed in its own domain, a lit tint of it inside.
      commit: {
        vars: { [sizeVar]: geometry.nodeSmall },
        backgroundImage: `radial-gradient(circle at 34% 30%, color-mix(in oklab, ${commitFillVar} 18%, white) 0, color-mix(in srgb, ${commitFillVar} 36%, ${vars.colors.background}) 70%)`,
        border: `2px solid ${commitLineVar}`,
      },
      // main merging the branch: a rail ring around a centred dot of the merged branch.
      merge: {
        vars: { [sizeVar]: geometry.nodeLarge },
        backgroundImage: `radial-gradient(circle, ${laneTopVar} 0 3px, ${vars.colors.background} 3.5px)`,
        border: `2px solid ${railColor}`,
      },
      root: {
        vars: { [sizeVar]: geometry.nodeSmall },
        backgroundColor: vars.colors.background,
        border: `2px solid ${railColor}`,
      },
    },
    domain: {
      none: {},
      frontend: {
        vars: { [commitLineVar]: laneColors.frontend, [commitFillVar]: domainAccents.frontend },
      },
      backend: {
        vars: { [commitLineVar]: laneColors.backend, [commitFillVar]: domainAccents.backend },
      },
      creative: {
        vars: { [commitLineVar]: laneColors.creative, [commitFillVar]: domainAccents.creative },
      },
      systems: {
        vars: { [commitLineVar]: laneColors.systems, [commitFillVar]: domainAccents.systems },
      },
    },
  },
  defaultVariants: {
    domain: "none",
  },
});

export const pingStyle = style({
  vars: { [sizeVar]: `calc(${geometry.nodeLarge} + 6px)` },
  position: "absolute",
  width: sizeVar,
  height: sizeVar,
  left: `calc(${BRANCH_CENTER} - ${sizeVar} / 2)`,
  top: `calc(${geometry.nodeY} - ${sizeVar} / 2)`,
  zIndex: 1,
  borderRadius: vars.radius.full,
  backgroundColor: vars.colors.primary,
  animation: "log-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite",
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animation: "none",
      opacity: 0,
    },
  },
});

// Off screen, the ping rests (ContentSection marks the section).
globalStyle(`[data-anim-disabled="true"] ${pingStyle}`, {
  animation: "none",
  opacity: 0,
});
