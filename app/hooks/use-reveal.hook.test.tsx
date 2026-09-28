import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { revealIndex } from "@/styles/animations.css";
import { useReveal } from "./use-reveal.hook";

// `createVar()` returns `var(--name)`; inline styles are read by the bare name.
const REVEAL_INDEX = revealIndex.replace(/^var\((.+)\)$/, "$1");

interface EntryShape {
  isIntersecting: boolean;
  intersectionRect: { height: number };
  boundingClientRect: { height: number };
  rootBounds: { height: number } | null;
}
type ObserverCallback = (entries: EntryShape[]) => void;

/** `visible` px of an element `height` px tall, in a viewport `viewport` px tall. */
const entry = (visible: number, height = 400, viewport = 800): EntryShape => ({
  isIntersecting: visible > 0,
  intersectionRect: { height: visible },
  boundingClientRect: { height },
  rootBounds: { height: viewport },
});

let observerCallback: ObserverCallback | null = null;
const disconnect = vi.fn();

function Probe() {
  const { ref, state } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} id="probe" data-testid="container" data-reveal={state ?? undefined}>
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
  window.history.replaceState(null, "", "/");
});

describe("useReveal", () => {
  it("starts idle after mount and indexes children", () => {
    mockMatchMedia(false);
    render(<Probe />);
    const container = screen.getByTestId("container");
    expect(container.dataset.reveal).toBe("idle");
    const items = container.querySelectorAll<HTMLElement>("[data-reveal-item]");
    expect(items[0]?.style.getPropertyValue(REVEAL_INDEX)).toBe("0");
    expect(items[1]?.style.getPropertyValue(REVEAL_INDEX)).toBe("1");
  });

  it("transitions idle → revealed on viewport entry, once", () => {
    mockMatchMedia(false);
    render(<Probe />);
    act(() => observerCallback?.([entry(200)]));
    expect(screen.getByTestId("container").dataset.reveal).toBe("revealed");
    expect(disconnect).toHaveBeenCalled();
  });

  it("stays idle while not intersecting", () => {
    mockMatchMedia(false);
    render(<Probe />);
    act(() => observerCallback?.([entry(0)]));
    expect(screen.getByTestId("container").dataset.reveal).toBe("idle");
  });

  it("waits for the threshold share of a short element", () => {
    mockMatchMedia(false);
    render(<Probe />);
    act(() => observerCallback?.([entry(40)]));
    expect(screen.getByTestId("container").dataset.reveal).toBe("idle");
  });

  it("reveals an element taller than the viewport once it fills its share of the screen", () => {
    mockMatchMedia(false);
    render(<Probe />);
    // 2616px tall in a 390px screen: at most 14.9 % of it can ever be visible.
    act(() => observerCallback?.([entry(130, 2616, 390)]));
    expect(screen.getByTestId("container").dataset.reveal).toBe("revealed");
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

  it("goes static when a link to it is followed, before the jump", () => {
    mockMatchMedia(false);
    render(
      <>
        <a href="#probe">Probe</a>
        <Probe />
      </>,
    );
    act(() => screen.getByRole("link", { name: "Probe" }).click());
    expect(screen.getByTestId("container").dataset.reveal).toBe("static");
  });

  it("starts static when the page opens on its anchor", () => {
    mockMatchMedia(false);
    window.history.replaceState(null, "", "/#probe");
    render(<Probe />);
    expect(screen.getByTestId("container").dataset.reveal).toBe("static");
  });
});
