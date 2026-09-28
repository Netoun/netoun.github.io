import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { LogRow } from "../../../../data/experience-log";
import { ExperienceLogGraph, type MainRun } from "./experience-log-graph.component";

/** The first printed line of a row, main to branch (a space where a cell is empty). */
function firstLine(row: LogRow, main: MainRun = "rail") {
  const { container } = render(<ExperienceLogGraph row={row} main={main} />);
  const columns = container.querySelectorAll('[class*="columnStyle"]');
  return [...columns].map((column) => column.textContent?.[0] ?? " ").join("");
}

describe("ExperienceLogGraph", () => {
  it("prints git's own glyphs for every kind of row", () => {
    const tip: LogRow = {
      kind: "tip",
      hash: "7448d23",
      refs: [{ label: "HEAD -> lonestone", kind: "head" }],
    };
    expect(firstLine(tip, "wait")).toBe("¦ *");
    expect(firstLine({ kind: "fork" })).toBe("|/ ");
    expect(firstLine({ kind: "merge", hash: "cd178c8", refs: [] })).toBe("*  ");
    expect(firstLine({ kind: "merge-in" })).toBe("|\\ ");
    expect(firstLine({ kind: "elided" })).toBe("| :");
    expect(firstLine({ kind: "root", hash: "f5d3d35", refs: [] }, "none")).toBe("*  ");
  });

  it("stays out of the accessibility tree", () => {
    const { container } = render(<ExperienceLogGraph row={{ kind: "fork" }} main="rail" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
