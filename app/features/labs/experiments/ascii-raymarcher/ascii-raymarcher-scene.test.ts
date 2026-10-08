import { describe, expect, it } from "vitest";
import { RAMPS, bucketOf, gridFor, renderAsciiFrame } from "./ascii-raymarcher-scene";

const FRAME = { cols: 92, rows: 29, shape: "box", ramp: "classic", light: 35, time: 0.9 } as const;

describe("ascii raymarcher scene", () => {
  it("prints one line of cols glyphs per row", () => {
    const frame = renderAsciiFrame(FRAME);
    expect(frame.lines).toHaveLength(29);
    expect(frame.lines.every((line) => [...line].length === 92)).toBe(true);
  });

  it("is deterministic for a given time", () => {
    expect(renderAsciiFrame(FRAME).lines).toEqual(renderAsciiFrame(FRAME).lines);
  });

  it("misses the corners and hits the centre", () => {
    const frame = renderAsciiFrame(FRAME);
    expect(frame.luminance[0]).toBe(-1);
    expect(frame.luminance[14 * 92 + 46]).toBeGreaterThan(0);
  });

  it("counts every lit cell in exactly one bucket", () => {
    const frame = renderAsciiFrame(FRAME);
    const lit = frame.luminance.filter((value) => value >= 0).length;
    expect(frame.counts.reduce((sum, count) => sum + count, 0)).toBe(lit);
  });

  it("cuts luminance on the fastfetch logo's thresholds for the netoun ramp", () => {
    expect(RAMPS.netoun.map((bucket) => bucket.from)).toEqual([0, 0.1, 0.3, 0.62]);
    expect([0.05, 0.2, 0.5, 0.9].map((value) => bucketOf("netoun", value))).toEqual([0, 1, 2, 3]);
    // strict > : a luminance sitting exactly on a threshold stays in the lower bucket
    expect([0.1, 0.3, 0.62].map((value) => bucketOf("netoun", value))).toEqual([0, 1, 2]);
    expect([0.1001, 0.3001, 0.6201].map((value) => bucketOf("netoun", value))).toEqual([1, 2, 3]);
    const frame = renderAsciiFrame({ ...FRAME, ramp: "netoun" });
    expect(frame.lines.join("")).toMatch(/[netou]/);
  });

  it("clamps the classic ramp's last bucket", () => {
    expect(bucketOf("classic", 0.9)).toBe(9);
    expect(bucketOf("classic", 1)).toBe(9);
  });

  it("fits cells 0.6em wide and 1em tall", () => {
    expect(gridFor(778, 410, 14)).toEqual({ cols: 92, rows: 29 });
  });
});
