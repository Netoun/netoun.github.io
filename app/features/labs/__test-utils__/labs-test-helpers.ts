import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, vi } from "vitest";

export function mockClipboard(): void {
  vi.stubGlobal("navigator", {
    ...navigator,
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
}

export function renderControl(element: ReactElement): RenderResult {
  return render(element);
}

export function renderDemo(element: ReactElement): RenderResult {
  mockClipboard();
  return render(element);
}

afterEach(() => {
  vi.unstubAllGlobals();
});
