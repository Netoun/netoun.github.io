import { describe, expect, it } from "vitest";
import { readSections } from "./welcome-sections-nav-readout";

// The homepage at 1280×800 (production build, 2026-09-28).
const TOPS = [0, 960, 2076, 4298, 6147];
const VIEWPORT = 800;
const MAX = 6923 - VIEWPORT;

describe("readSections", () => {
  it("starts on the first section, lit as far as the middle of the first screen", () => {
    const { progress, activeIndex } = readSections(TOPS, 0, VIEWPORT, MAX);
    expect(activeIndex).toBe(0);
    expect(progress).toBeCloseTo(400 / 960 / 4);
  });

  it("makes a section current when its top crosses the middle of the viewport", () => {
    expect(readSections(TOPS, 960 - 401, VIEWPORT, MAX).activeIndex).toBe(0);
    expect(readSections(TOPS, 960 - 400, VIEWPORT, MAX).activeIndex).toBe(1);
  });

  it("lights the track up to an index exactly when its section becomes current", () => {
    expect(readSections(TOPS, 2076 - 400, VIEWPORT, MAX)).toEqual({
      progress: 0.5,
      activeIndex: 2,
    });
  });

  it("interpolates between two section tops", () => {
    const { progress, activeIndex } = readSections(TOPS, 960 - 400 + 558, VIEWPORT, MAX);
    expect(activeIndex).toBe(1);
    expect(progress).toBeCloseTo(0.375);
  });

  it("fills the track and selects the last section at the bottom of the page", () => {
    expect(readSections(TOPS, MAX, VIEWPORT, MAX)).toEqual({ progress: 1, activeIndex: 4 });
    expect(readSections(TOPS, MAX - 1, VIEWPORT, MAX)).toEqual({ progress: 1, activeIndex: 4 });
  });

  it("treats a page that cannot scroll as read to the end", () => {
    expect(readSections(TOPS, 0, VIEWPORT, 0)).toEqual({ progress: 1, activeIndex: 4 });
  });
});
