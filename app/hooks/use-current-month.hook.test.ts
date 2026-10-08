import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCurrentMonth } from "./use-current-month.hook";

function Probe() {
  return createElement("span", null, useCurrentMonth());
}

describe("useCurrentMonth", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2030-03-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the visitor's month as YYYY-MM on the client", () => {
    const { result } = renderHook(() => useCurrentMonth());
    expect(result.current).toBe("2030-03");
  });

  it("renders the build month on the server and during hydration", () => {
    expect(renderToString(createElement(Probe))).toContain(__BUILD_DATE__.slice(0, 7));
  });
});
