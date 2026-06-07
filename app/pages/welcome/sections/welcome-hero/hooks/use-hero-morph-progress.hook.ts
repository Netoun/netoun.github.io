import { useCallback, useEffect, useRef, type RefObject } from "react";

interface HeroMorphProgressOptions {
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
}

interface MorphParams {
  start: number;
  end: number;
  targetScale: number;
  initialized: boolean;
}

const DESKTOP_MORPH_QUERY = "(min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const CSS_PROPS = ["--hero-scale", "--hero-translate-y"];

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const easeInOutQuad = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function getContainerMaxWidth(): number {
  const w = window.innerWidth;
  if (w >= 1280) return Math.min(w, 1440);
  if (w >= 1024) return 1024;
  if (w >= 768) return 768;
  return w;
}

function getSectionPadding(): number {
  const rootFontSize = Number.parseFloat(
    window.getComputedStyle(document.documentElement).fontSize,
  );
  return rootFontSize * 0.5;
}

function getInitialParams(): MorphParams {
  return {
    start: 0,
    end: 0,
    targetScale: 1,
    initialized: false,
  };
}

export function useHeroMorphProgress({ containerRef, enabled = true }: HeroMorphProgressOptions) {
  const stageElRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const paramsRef = useRef<MorphParams>(getInitialParams());
  const desktopMorphRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const activeRef = useRef(false);

  const resetInlineStyles = useCallback(() => {
    const el = stageElRef.current;
    if (!el) return;

    for (const prop of CSS_PROPS) {
      el.style.removeProperty(prop);
    }

    paramsRef.current = getInitialParams();
  }, []);

  const updatePositions = useCallback(() => {
    const el = stageElRef.current;
    if (!el || !desktopMorphRef.current || reducedMotionRef.current) return;

    const anchor = el.parentElement ?? el;
    const rect = anchor.getBoundingClientRect();
    const heroTop = rect.top + window.scrollY;
    const sectionPadding = getSectionPadding();
    const availableWidth = window.innerWidth - sectionPadding * 2;
    const containerWidth = getContainerMaxWidth();

    paramsRef.current = {
      start: heroTop + 120,
      end: heroTop + window.innerHeight * 0.85,
      targetScale: containerWidth / availableWidth,
      initialized: true,
    };
  }, []);

  const tick = useCallback(() => {
    const el = stageElRef.current;
    const p = paramsRef.current;
    if (!el || !activeRef.current || !p.initialized) return;

    const raw = (window.scrollY - p.start) / (p.end - p.start);
    const progress = clamp(raw, 0, 1);
    const s = easeInOutQuad(progress);
    const scale = 1 - (1 - p.targetScale) * s;

    el.style.setProperty("--hero-scale", scale.toFixed(4));
  }, []);

  const scheduleTick = useCallback(() => {
    if (!activeRef.current || rafRef.current !== null) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      tick();
    });
  }, [tick]);

  const refresh = useCallback(() => {
    updatePositions();
    tick();
  }, [tick, updatePositions]);

  const setActiveState = useCallback(() => {
    desktopMorphRef.current = window.matchMedia(DESKTOP_MORPH_QUERY).matches;
    reducedMotionRef.current = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    activeRef.current = enabled && desktopMorphRef.current && !reducedMotionRef.current;

    if (!activeRef.current) {
      resetInlineStyles();
      return;
    }

    refresh();
  }, [enabled, refresh, resetInlineStyles]);

  const stageRef = useCallback(
    (node: HTMLElement | null) => {
      stageElRef.current = node;
      setActiveState();
    },
    [setActiveState],
  );

  useEffect(() => {
    const desktopMedia = window.matchMedia(DESKTOP_MORPH_QUERY);
    const reducedMedia = window.matchMedia(REDUCED_MOTION_QUERY);

    const onScroll = () => scheduleTick();
    const onResize = () => refresh();
    const onMediaChange = () => setActiveState();

    setActiveState();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    desktopMedia.addEventListener("change", onMediaChange);
    reducedMedia.addEventListener("change", onMediaChange);

    let ro: ResizeObserver | null = null;
    if (containerRef.current) {
      ro = new ResizeObserver(onResize);
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      desktopMedia.removeEventListener("change", onMediaChange);
      reducedMedia.removeEventListener("change", onMediaChange);
      ro?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, refresh, scheduleTick, setActiveState]);

  return { stageRef };
}
