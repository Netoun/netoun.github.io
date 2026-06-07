import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, vi } from "vitest";

interface ClipboardSpy {
  writeText: ReturnType<typeof vi.fn>;
  readText: ReturnType<typeof vi.fn>;
  getLastCopy(): string;
}

export function mockClipboard(): ClipboardSpy {
  const writeText = vi.fn().mockResolvedValue(undefined);
  const readText = vi.fn().mockResolvedValue("");
  vi.stubGlobal("navigator", {
    ...navigator,
    clipboard: { writeText, readText },
  });
  return {
    writeText,
    readText,
    getLastCopy() {
      return writeText.mock.calls.at(-1)?.[0] ?? "";
    },
  };
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
