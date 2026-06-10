import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useReveal } from "./use-reveal.hook";

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

let observerCallback: ObserverCallback | null = null;
const disconnect = vi.fn();

function Probe() {
  const { ref, state } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} data-testid="container" data-reveal={state ?? undefined}>
      <span data-reveal-item>a</span>
      <span data-reveal-item>b</span>
    </div>
  );
}

function mockMatchMedia(reducedMotion: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query.includes("prefers-reduced-motion") ? reducedMotion : false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

beforeEach(() => {
  observerCallback = null;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: ObserverCallback) {
        observerCallback = callback;
      }
      observe = vi.fn();
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  disconnect.mockClear();
});

describe("useReveal", () => {
  it("starts idle after mount and indexes children", () => {
    mockMatchMedia(false);
    render(<Probe />);
    const container = screen.getByTestId("container");
    expect(container.dataset.reveal).toBe("idle");
    const items = container.querySelectorAll<HTMLElement>("[data-reveal-item]");
    expect(items[0]?.style.getPropertyValue("--reveal-index")).toBe("0");
    expect(items[1]?.style.getPropertyValue("--reveal-index")).toBe("1");
  });

  it("transitions idle → revealed on viewport entry, once", () => {
    mockMatchMedia(false);
    render(<Probe />);
    act(() => observerCallback?.([{ isIntersecting: true }]));
    expect(screen.getByTestId("container").dataset.reveal).toBe("revealed");
    expect(disconnect).toHaveBeenCalled();
  });

  it("stays idle while not intersecting", () => {
    mockMatchMedia(false);
    render(<Probe />);
    act(() => observerCallback?.([{ isIntersecting: false }]));
    expect(screen.getByTestId("container").dataset.reveal).toBe("idle");
  });

  it("goes static with prefers-reduced-motion (no observer)", () => {
    mockMatchMedia(true);
    render(<Probe />);
    expect(screen.getByTestId("container").dataset.reveal).toBe("static");
    expect(observerCallback).toBeNull();
  });

  it("goes static on bfcache restore (pageshow persisted)", () => {
    mockMatchMedia(false);
    render(<Probe />);
    act(() => {
      const event = new Event("pageshow") as PageTransitionEvent;
      Object.defineProperty(event, "persisted", { value: true });
      window.dispatchEvent(event);
    });
    expect(screen.getByTestId("container").dataset.reveal).toBe("static");
  });
});
