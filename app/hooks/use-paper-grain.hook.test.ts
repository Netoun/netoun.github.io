import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PAPER_GRAIN_ATTRIBUTE, usePaperGrain } from "./use-paper-grain.hook";

describe("usePaperGrain", () => {
  afterEach(() => {
    document.documentElement.removeAttribute(PAPER_GRAIN_ATTRIBUTE);
    vi.restoreAllMocks();
  });

  it("turns the grain on at once when the page has already loaded", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("complete");
    renderHook(() => usePaperGrain());
    expect(document.documentElement.hasAttribute(PAPER_GRAIN_ATTRIBUTE)).toBe(true);
  });

  it("waits for the load event otherwise", () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("interactive");
    renderHook(() => usePaperGrain());
    expect(document.documentElement.hasAttribute(PAPER_GRAIN_ATTRIBUTE)).toBe(false);

    window.dispatchEvent(new Event("load"));
    expect(document.documentElement.hasAttribute(PAPER_GRAIN_ATTRIBUTE)).toBe(true);
  });
});
