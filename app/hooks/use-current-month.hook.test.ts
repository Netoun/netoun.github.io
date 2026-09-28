import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCurrentMonth } from "./use-current-month.hook";

describe("useCurrentMonth", () => {
  it("returns the visitor's month as YYYY-MM on the client", () => {
    const { result } = renderHook(() => useCurrentMonth());
    expect(result.current).toBe(new Date().toISOString().slice(0, 7));
  });

  it("has a build month to hydrate from", () => {
    expect(__BUILD_DATE__).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
