import { style } from "@vanilla-extract/css";
import { vars } from "@styles/theme.css";
import { BODY, LINE, SHEET_HEIGHT, SHEET_WIDTH, u } from "./cv-sheet-metrics";

// The sheet is one A4 page. On screen it sits on the paper like a printout and scales down to
// the column; printed (the PDF), it is the page itself.

export const frame = style({
  display: "flex",
  justifyContent: "center",
  "@media": {
    print: { display: "block" },
  },
});

export const sheet = style({
  containerType: "inline-size",
  width: `min(100%, ${SHEET_WIDTH}px)`,
  aspectRatio: `${SHEET_WIDTH} / ${SHEET_HEIGHT}`,
  overflow: "hidden",
  // White, not the lit stock: the PDF is printed, and a tinted page would ink the whole sheet.
  backgroundColor: "white",
  color: vars.colors.foreground,
  boxShadow: vars.boxShadow.restCard,
  "@media": {
    // 794 × 1123 px is a fraction of a pixel taller than 297 mm: printed at that ratio, the
    // sheet would break onto a second page and carry its foot (the status strip) with it.
    print: {
      width: "100%",
      height: "calc(297mm - 1px)",
      aspectRatio: "auto",
      boxShadow: "none",
      breakInside: "avoid",
    },
  },
});

export const page = style({
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: `${u(36)} ${u(48)} ${u(30)}`,
  fontFamily: vars.fontFamily.ppNeueMontreal,
  fontSize: BODY,
  lineHeight: LINE,
});

export const rule = style({
  height: 1,
  margin: `${u(16)} 0`,
  backgroundColor: vars.colors.cardBorder,
});

export const columns = style({
  display: "grid",
  gridTemplateColumns: `minmax(0, 1fr) ${u(232)}`,
  columnGap: u(28),
});

export const column = style({
  display: "flex",
  flexDirection: "column",
  gap: u(16),
});

export const block = style({
  display: "flex",
  flexDirection: "column",
  gap: u(8),
});

// The way to the site closes the side column, level with the foot of the main one.
export const pointer = style({
  marginTop: "auto",
  paddingTop: u(16),
});
