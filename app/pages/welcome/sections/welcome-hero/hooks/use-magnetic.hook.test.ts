import { describe, expect, it } from "vitest";
import { computeMagnetOffset } from "./use-magnetic.hook";

describe("computeMagnetOffset", () => {
  it("returns zero outside the attraction radius", () => {
    expect(computeMagnetOffset(200, 0, 80)).toEqual({ x: 0, y: 0 });
  });

  it("returns zero at the exact center (no direction)", () => {
    expect(computeMagnetOffset(0, 0, 80)).toEqual({ x: 0, y: 0 });
  });

  it("never exceeds the 4px clamp, even very close to center", () => {
    const { x, y } = computeMagnetOffset(1, 1, 80);
    expect(Math.hypot(x, y)).toBeLessThanOrEqual(4);
  });

  it("pulls toward the cursor direction", () => {
    const right = computeMagnetOffset(40, 0, 80);
    expect(right.x).toBeGreaterThan(0);
    expect(right.y).toBe(0);

    const upLeft = computeMagnetOffset(-30, -30, 80);
    expect(upLeft.x).toBeLessThan(0);
    expect(upLeft.y).toBeLessThan(0);
  });

  it("is stronger when closer to the element", () => {
    const near = computeMagnetOffset(10, 0, 80);
    const far = computeMagnetOffset(70, 0, 80);
    expect(near.x).toBeGreaterThan(far.x);
  });
});
