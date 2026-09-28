import { describe, expect, it } from "vitest";
import { formatUptime } from "./use-session-uptime.hook";

describe("formatUptime", () => {
  it("shows a placeholder until the client has a value", () => {
    expect(formatUptime(null)).toBe("--:--:--");
  });

  it("prints hours, minutes and seconds on two digits", () => {
    expect(formatUptime(0)).toBe("00:00:00");
    expect(formatUptime(133)).toBe("00:02:13");
    expect(formatUptime(3 * 3600 + 5)).toBe("03:00:05");
  });
});
