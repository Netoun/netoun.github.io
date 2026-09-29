import { describe, expect, it } from "vitest";
import { BASE_VALUES, DRIFT_SEQUENCES, metricsAt } from "./system-metrics-panel.component";

describe("metricsAt", () => {
  it("drifts on sequences that sum to zero", () => {
    const sums = DRIFT_SEQUENCES.map((sequence) =>
      sequence.reduce<number>((sum, step) => sum + step, 0),
    );
    expect(sums).toEqual(DRIFT_SEQUENCES.map(() => 0));
  });

  // The pulse used to accumulate: after five minutes every meter sat at 95–96 %.
  it("stays around its base however long it runs", () => {
    for (let tick = 0; tick < 5000; tick += 1) {
      const spread = metricsAt(tick).map((value, index) => Math.abs(value - BASE_VALUES[index]));
      expect(Math.max(...spread)).toBeLessThanOrEqual(3);
    }
  });

  it("loops every 24 ticks", () => {
    expect(metricsAt(24 * 7 + 5)).toEqual(metricsAt(5));
  });
});
