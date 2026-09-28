import { describe, expect, it } from "vitest";
import {
  JACKS,
  cablePath,
  endPin,
  isJackFree,
  jackById,
  layCable,
  nearestFreeJack,
  stepCable,
  stretchPercent,
  type SolverParams,
} from "./patch-bay-verlet";

const PARAMS: SolverParams = { gravity: 1, damping: 0.985, slack: 45, passes: 8 };

const settle = (params: SolverParams, steps = 600) => {
  const cable = layCable(jackById("A2"), jackById("B5"));
  let moved = 0;
  for (let step = 0; step < steps; step += 1) {
    moved = stepCable(cable, [endPin(cable, 0), endPin(cable, 1)], params);
  }
  return { cable, moved };
};

describe("patch bay solver", () => {
  it("lays out two rows of eight jacks", () => {
    expect(JACKS).toHaveLength(16);
    expect(JACKS[0].id).toBe("A1");
    expect(JACKS[15].id).toBe("B8");
  });

  it("keeps plugged ends in their jacks", () => {
    const { cable } = settle(PARAMS);
    const a = jackById("A2");
    expect(cable.points[0]).toMatchObject({ x: a.x, y: a.anchorY });
  });

  it("comes to rest, close to its rest length", () => {
    const { cable, moved } = settle(PARAMS);
    expect(moved).toBeLessThan(0.02);
    expect(Math.abs(stretchPercent(cable, PARAMS.slack))).toBeLessThan(5);
  });

  it("stretches less with more constraint passes", () => {
    const soft = stretchPercent(settle({ ...PARAMS, passes: 1 }).cable, PARAMS.slack);
    const stiff = stretchPercent(settle({ ...PARAMS, passes: 24 }).cable, PARAMS.slack);
    expect(stiff).toBeLessThan(soft);
  });

  it("draws one smooth path through every point", () => {
    const { cable } = settle(PARAMS);
    const path = cablePath(cable.points);
    expect(path.startsWith("M ")).toBe(true);
    expect(path.match(/ C /g)).toHaveLength(cable.points.length - 1);
  });

  it("offers only free jacks within the cable's reach", () => {
    const cables = [
      layCable(jackById("A2"), jackById("B5")),
      layCable(jackById("A6"), jackById("B1")),
    ];
    expect(isJackFree(cables, 0, 0, jackById("A6"), PARAMS.slack)).toBe(false);
    expect(isJackFree(cables, 0, 0, jackById("A3"), PARAMS.slack)).toBe(true);
    const near = nearestFreeJack(
      cables,
      0,
      0,
      { x: jackById("A6").x, y: jackById("A6").cy },
      PARAMS.slack,
    );
    expect(near?.id).not.toBe("A6");
  });
});
