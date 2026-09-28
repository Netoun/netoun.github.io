import { motion } from "@styles/motion.css";
import { breakpoints } from "@styles/responsive.css";
import { vars } from "@styles/theme.css";
import { createVar, globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { domainAccents, laneColors } from "../../experience-log.css";

const machine = {
  fontFamily: vars.fontFamily.doto,
  fontWeight: vars.fontWeight.extrabold,
  fontVariantNumeric: "tabular-nums",
} as const;

// Bars fill left to right once the header has risen (ms from the section reveal).
const FILL_START = 700;
const FILL_STEP = 120;

const segmentColorVar = createVar();
const washVar = createVar();

export const branchesStyle = style({
  ...machine,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
  fontSize: vars.fontSize.sm,
  letterSpacing: "0.06em",
  "@media": {
    [breakpoints.xl]: { width: "33.75rem" },
  },
});

export const promptStyle = style({
  margin: 0,
  paddingBottom: vars.spacing.xs,
  fontSize: vars.fontSize.xs,
  letterSpacing: "0.12em",
  color: vars.colors.mutedForeground,
});

export const listStyle = style({
  margin: 0,
  padding: 0,
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});

export const rowStyle = recipe({
  base: {
    display: "grid",
    gridTemplateColumns: "0.75rem 5.75rem minmax(0, 1fr) 3.5rem",
    alignItems: "center",
    columnGap: vars.spacing.sm,
    height: "2rem",
    padding: `0 ${vars.spacing.sm}`,
    margin: `0 calc(-1 * ${vars.spacing.sm})`,
    borderRadius: vars.radius.sm,
    transition: `background-color ${motion.duration.fast} ${motion.easing.out}`,
    selectors: {
      "&[data-lit]": { backgroundColor: washVar },
    },
    "@media": {
      [breakpoints.sm]: {
        gridTemplateColumns: "0.75rem 6.5rem minmax(0, 1fr) 3.75rem 8.5rem",
      },
    },
  },
  variants: {
    domain: {
      frontend: {
        vars: {
          [segmentColorVar]: laneColors.frontend,
          [washVar]: `color-mix(in srgb, ${domainAccents.frontend} 18%, transparent)`,
        },
      },
      backend: {
        vars: {
          [segmentColorVar]: laneColors.backend,
          [washVar]: `color-mix(in srgb, ${domainAccents.backend} 18%, transparent)`,
        },
      },
      creative: {
        vars: {
          [segmentColorVar]: laneColors.creative,
          [washVar]: `color-mix(in srgb, ${domainAccents.creative} 18%, transparent)`,
        },
      },
      systems: {
        vars: {
          [segmentColorVar]: laneColors.systems,
          [washVar]: `color-mix(in srgb, ${domainAccents.systems} 18%, transparent)`,
        },
      },
    },
  },
});

export const starStyle = style({
  fontWeight: vars.fontWeight.extrabold,
});

export const nameStyle = style({
  fontWeight: vars.fontWeight.extrabold,
});

// Same scale for every bar: the longest tenure fills it, one segment per two months.
export const meterStyle = style({
  display: "flex",
  gap: "2px",
  height: "0.875rem",
});

export const segmentStyle = recipe({
  base: {
    flex: 1,
    minWidth: "2px",
    borderRadius: "1px",
  },
  variants: {
    lit: {
      // A lit LED, as in the monitor meters: brighter at the top, the lane colour below.
      true: {
        backgroundImage: `linear-gradient(180deg, color-mix(in oklab, ${segmentColorVar} 55%, white), ${segmentColorVar} 65%)`,
      },
      false: {
        backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${vars.colors.foreground} 5%, transparent), color-mix(in srgb, ${vars.colors.foreground} 10%, transparent))`,
      },
    },
  },
});

globalStyle(`[data-reveal="idle"] ${meterStyle}`, {
  clipPath: "inset(0 100% 0 0)",
});

globalStyle(`[data-reveal="revealed"] ${meterStyle}`, {
  animation: `log-draw 700ms steps(24) both`,
  animationDelay: `${FILL_START}ms`,
});

for (let index = 0; index < 6; index += 1) {
  globalStyle(`[data-reveal="revealed"] li:nth-child(${index + 1}) > ${meterStyle}`, {
    animationDelay: `${FILL_START + index * FILL_STEP}ms`,
  });
}

export const monthsStyle = style({
  textAlign: "right",
});

export const statusStyle = style({
  display: "none",
  color: vars.colors.mutedForeground,
  "@media": {
    [breakpoints.sm]: { display: "block" },
  },
});
