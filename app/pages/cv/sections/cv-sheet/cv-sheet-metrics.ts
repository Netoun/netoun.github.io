import { vars } from "@styles/theme.css";
import { weight } from "@styles/weight";

/** A4 at 96 dpi, in CSS px: the PDF prints the sheet at exactly this size. */
export const SHEET_WIDTH = 794;
export const SHEET_HEIGHT = 1123;

/**
 * A length on the sheet, in px of the printed A4. It resolves against the sheet's own width
 * (`cqi`): the PDF prints at 1:1, and a narrow screen gets the same page, scaled, line breaks
 * and all.
 */
export function u(px: number): string {
  return `calc(${px} * 100cqi / ${SHEET_WIDTH})`;
}

/** Body text, and the line every graph row snaps to (the git lanes are drawn on it). */
export const BODY = u(13);
export const LINE = u(17.42);

/** Doto labels: dates, keys, commands, the status strip. 12px at 800, the legible minimum. */
export const label = {
  fontFamily: vars.fontFamily.doto,
  ...weight(800),
  fontSize: u(12),
  letterSpacing: "0.04em",
} as const;

/** The `_❯` prompt on paper: gold mixed half with ink, as on the section titles. */
export const promptColor = `color-mix(in srgb, ${vars.colors.primary} 50%, ${vars.colors.foreground})`;

const NO_BREAK_SPACE = String.fromCodePoint(0xa0);

/**
 * A list of tools as one line of text: a tool never breaks inside its name (`Vanilla Extract`),
 * and each `·` stays on the line of the tool before it.
 */
export function joinTools(tools: string[]): string {
  return tools.map((tool) => tool.replaceAll(" ", NO_BREAK_SPACE)).join(`${NO_BREAK_SPACE}· `);
}
