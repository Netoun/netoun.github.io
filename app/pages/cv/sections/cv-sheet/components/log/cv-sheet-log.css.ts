import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";
import { LINE, label, u } from "../../cv-sheet-metrics";

// The work history as `git log --graph`, laid on the body's line: every row is one LINE tall,
// so the lanes' dots fall level with the text they run beside.

export const log = style({
  display: "flex",
  flexDirection: "column",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

const row = {
  display: "grid",
  columnGap: u(6),
} as const;

export const job = style({
  ...row,
  gridTemplateColumns: `${u(16)} minmax(0, 1fr)`,
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  selectors: {
    // One blank line between employers, on the lane: git keeps drawing `|` through it.
    [`${job}:not(:last-child) > &`]: { paddingBottom: LINE },
  },
});

export const head = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: u(10),
  height: LINE,
});

export const who = style({
  margin: 0,
  minWidth: 0,
  overflow: "hidden",
  fontSize: "inherit",
  ...weight(400),
  lineHeight: LINE,
  whiteSpace: "nowrap",
});

export const company = style({
  marginRight: u(4),
  fontSize: u(15.17),
  ...weight(700),
  letterSpacing: "-0.01em",
});

// The current job is where HEAD points, a git tag in gold.
export const headRef = style({
  ...label,
  display: "inline-block",
  marginLeft: u(8),
  padding: `0 ${u(5)}`,
  borderRadius: vars.radius.full,
  backgroundColor: `color-mix(in srgb, ${vars.colors.primary} 34%, transparent)`,
  lineHeight: u(14),
  letterSpacing: "0.08em",
  verticalAlign: "baseline",
});

export const period = style({
  ...label,
  flexShrink: 0,
  margin: 0,
  letterSpacing: "0.03em",
  color: vars.colors.mutedForeground,
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
});

export const text = style({
  margin: 0,
  textWrap: "pretty",
});

export const clients = style({
  display: "flex",
  flexDirection: "column",
  margin: 0,
  padding: 0,
  listStyle: "none",
});

export const client = style({
  ...row,
  gridTemplateColumns: `${u(14)} minmax(0, 1fr)`,
});

export const clientTitle = style({
  ...weight(600),
});

export const more = style([client, { color: vars.colors.mutedForeground }]);

// `⋮`, three of Doto's dots stacked in the lane.
export const elision = style({
  justifySelf: "center",
  alignSelf: "center",
  width: u(3),
  height: u(13.5),
  backgroundImage: `radial-gradient(circle, currentColor 0 ${u(0.9)}, transparent ${u(1.05)})`,
  backgroundSize: `${u(3)} ${u(4.5)}`,
  backgroundRepeat: "repeat-y",
});
