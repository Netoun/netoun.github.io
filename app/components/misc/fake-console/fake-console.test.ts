import { describe, expect, it } from "vitest";
import { FAKE_CONSOLE_DEFAULTS, lineParts } from "./fake-console.component";

const lines = (count: number) => {
  let seed: number = FAKE_CONSOLE_DEFAULTS.seed;
  return Array.from({ length: count }, () => {
    const [parts, next] = lineParts(seed);
    seed = next;
    return `${parts.process} ${parts.state} ${parts.load} ${parts.hex}-${parts.tail}`;
  });
};

describe("lineParts", () => {
  it("draws the same log from the same seed", () => {
    expect(lines(6)).toEqual(lines(6));
  });

  // The low bits of an LCG repeat every few draws: read from them, the log looped every four lines.
  it("does not loop within a screenful", () => {
    const log = lines(24);
    expect(new Set(log).size).toBe(log.length);
    expect(new Set(log.map((line) => line.split(" ").slice(0, 3).join(" "))).size).toBeGreaterThan(
      8,
    );
  });
});
