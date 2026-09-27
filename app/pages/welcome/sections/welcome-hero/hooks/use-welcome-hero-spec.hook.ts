import { createContext, startTransition, useContext, useEffect, useState } from "react";

// The spec layer prints values read from the live elements (computed styles and
// layout), never copied by hand: change a token and the annotation follows.

export interface WelcomeHeroSpecValues {
  heading: readonly string[];
  lead: readonly string[];
  cta: readonly string[];
  /** Frame edge → start of the text, in CSS px. */
  gutter: number;
  /** Faces of the CSS 3D laptop. */
  laptopFaces: number;
}

export const WelcomeHeroSpecContext = createContext<WelcomeHeroSpecValues | null>(null);

/** Spec values, or null until they are measured (prerender, no JS, fonts loading). */
export function useWelcomeHeroSpec(): WelcomeHeroSpecValues | null {
  return useContext(WelcomeHeroSpecContext);
}

type SpecStyle = Pick<
  CSSStyleDeclaration,
  | "borderTopLeftRadius"
  | "fontFamily"
  | "fontSize"
  | "fontStyle"
  | "fontWeight"
  | "letterSpacing"
  | "lineHeight"
  | "maxWidth"
  | "textTransform"
>;

const px = (value: string) => Number.parseFloat(value);

/** Up to 3 decimals, no trailing zeros: 0.8, 1.375, 11. */
const trim = (value: number) => String(Number(value.toFixed(3)));

/** With a true minus sign. */
const signed = (value: number) => (value < 0 ? `−${trim(-value)}` : trim(value));

const firstFamily = (family: string) =>
  (family.split(",")[0] ?? "").trim().replace(/^["']|["']$/g, "");

export function formatHeadingSpec(style: SpecStyle): string[] {
  const size = px(style.fontSize);
  const italic = style.fontStyle === "italic" ? " Italic" : "";
  const maxWidth = px(style.maxWidth);
  return [
    "H1 · DISPLAY",
    `${firstFamily(style.fontFamily)}${italic} ${style.fontWeight}`,
    `${trim(size)} / ${trim(px(style.lineHeight) / size)} · ${signed(px(style.letterSpacing) / size)}em`,
    ...(Number.isFinite(maxWidth) ? [`max ${trim(maxWidth / size)}em · breaks on &`] : []),
  ];
}

export function formatLeadSpec(style: SpecStyle, rootFontSize: number): string[] {
  const size = px(style.fontSize);
  const maxWidth = px(style.maxWidth);
  const measure = Number.isFinite(maxWidth) ? `${trim(maxWidth / rootFontSize)}rem · ` : "";
  return [`${measure}${trim(size)} / ${trim(px(style.lineHeight) / size)}`];
}

export function formatCtaSpec(style: SpecStyle): string[] {
  return [
    "CTA · MACHINE VOICE",
    `${firstFamily(style.fontFamily)} ${style.fontWeight} · ${trim(px(style.fontSize))} · ${style.textTransform}`,
    `radius ${trim(px(style.borderTopLeftRadius))} · glowPrimary`,
  ];
}

const formatDegrees = (value: number) => `${signed(Number(value.toFixed(1)))}°`;

/** The laptop's live tilt, as the CSS transform applies it. */
export function formatLaptopTilt(rotateY: number, rotateX: number): string {
  return `rotateY ${formatDegrees(rotateY)} · rotateX ${formatDegrees(rotateX)}`;
}

const LAPTOP_FACES_SELECTOR = '[id^="computer-frame-lid-"], [id^="computer-frame-chassis-"]';

function readHeroSpec(section: HTMLElement, container: HTMLElement): WelcomeHeroSpecValues | null {
  const heading = section.querySelector<HTMLElement>('[data-spec-target="heading"]');
  const lead = section.querySelector<HTMLElement>('[data-spec-target="lead"]');
  // The target wraps the CTA leaf (a link before hydration, a button after).
  const cta = section.querySelector<HTMLElement>('[data-spec-target="cta"] > :first-child');
  if (!heading || !lead || !cta) return null;

  const rootFontSize = px(getComputedStyle(document.documentElement).fontSize) || 16;
  return {
    heading: formatHeadingSpec(getComputedStyle(heading)),
    lead: formatLeadSpec(getComputedStyle(lead), rootFontSize),
    cta: formatCtaSpec(getComputedStyle(cta)),
    gutter: Math.round(
      heading.getBoundingClientRect().left - container.getBoundingClientRect().left,
    ),
    laptopFaces: section.querySelectorAll(LAPTOP_FACES_SELECTOR).length,
  };
}

const sameSpec = (a: WelcomeHeroSpecValues, b: WelcomeHeroSpecValues) =>
  JSON.stringify(a) === JSON.stringify(b);

const RESIZE_DEBOUNCE_MS = 150;

interface UseWelcomeHeroSpecProviderOptions {
  sectionRef: React.RefObject<HTMLElement | null>;
  containerRef: React.RefObject<HTMLElement | null>;
}

/**
 * Measures once the fonts are in (metrics change on swap), then again after
 * resizes. The update is a transition: the plotter intro never blocks input.
 */
export function useWelcomeHeroSpecProvider({
  sectionRef,
  containerRef,
}: UseWelcomeHeroSpecProviderOptions): WelcomeHeroSpecValues | null {
  const [values, setValues] = useState<WelcomeHeroSpecValues | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    let cancelled = false;
    let timer: number | undefined;
    let observer: ResizeObserver | undefined;

    const measure = () => {
      const next = readHeroSpec(section, container);
      if (!next) return;
      startTransition(() => {
        setValues((previous) => (previous && sameSpec(previous, next) ? previous : next));
      });
    };

    void document.fonts.ready.then(() => {
      if (cancelled) return;
      // The first callback fires on observe: measure at once, debounce the rest.
      let isFirstCallback = true;
      observer = new ResizeObserver(() => {
        window.clearTimeout(timer);
        if (isFirstCallback) {
          isFirstCallback = false;
          measure();
          return;
        }
        timer = window.setTimeout(measure, RESIZE_DEBOUNCE_MS);
      });
      observer.observe(container);
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.clearTimeout(timer);
    };
  }, [sectionRef, containerRef]);

  return values;
}
