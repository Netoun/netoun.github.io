import { describe, expect, it } from "vitest";
import {
  DRUM,
  advanceBoard,
  blankBoard,
  boardTargets,
  cleanLine,
  drumDistance,
  hasLanded,
  startDelay,
} from "./split-flap-drum";

describe("split-flap drum", () => {
  it("holds 42 glyphs, the blank first", () => {
    expect(DRUM).toHaveLength(42);
    expect(DRUM[0]).toBe(" ");
    expect(DRUM.at(-1)).toBe("❯");
  });

  it("prints only what the drum carries", () => {
    expect(cleanLine("_> héllo, wörld!")).toBe("_❯ HELLO  WORLD ");
    expect(cleanLine("a".repeat(20))).toHaveLength(16);
  });

  it("centres each line on the board, the spare column going to the right", () => {
    const targets = boardTargets(["LINK", ""]);
    const row = targets
      .slice(0, 16)
      .map((index) => DRUM[index])
      .join("");
    expect(row).toBe("      LINK      ");
    expect(targets.slice(16).every((index) => index === 0)).toBe(true);

    const odd = boardTargets(["ABC", ""])
      .slice(0, 16)
      .map((index) => DRUM[index])
      .join("");
    expect(odd).toBe("      ABC       ");
  });

  it("turns forward only, wrapping past the end", () => {
    expect(drumDistance(DRUM.indexOf("A"), DRUM.indexOf("C"))).toBe(2);
    expect(drumDistance(DRUM.indexOf("C"), DRUM.indexOf("A"))).toBe(40);
    expect(drumDistance(5, 5)).toBe(0);
  });

  it("starts each column one stagger later, the second line two columns later", () => {
    expect(startDelay(0, 30)).toBe(0);
    expect(startDelay(3, 30)).toBe(90);
    expect(startDelay(16, 30)).toBe(60);
  });

  it("lands every flap on its target after exactly its distance in steps", () => {
    const targets = boardTargets(["ESTABLISH LINK", "NETOUN.COM/LABS"]);
    let state = blankBoard();
    let ticks = 0;
    while (!hasLanded(state, targets) && ticks < 200) {
      state = advanceBoard(state, targets, 70, 0);
      ticks += 1;
    }
    expect(hasLanded(state, targets)).toBe(true);
    expect(state.flips).toEqual(targets.map((target) => drumDistance(0, target)));
    expect(ticks).toBe(Math.max(...state.flips));
  });
});
