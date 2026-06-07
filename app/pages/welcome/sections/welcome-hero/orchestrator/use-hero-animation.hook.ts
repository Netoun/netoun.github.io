import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  HeroAnimationOrchestrator,
  HeroAnimationState,
  HeroAnimationSubscriber,
} from "./hero-animation.port";

function getElementFromNode(node: Node): Element | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.parentElement;
  }
  return node as Element;
}

interface UseHeroAnimationProviderOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  sectionRef: React.RefObject<HTMLElement | null>;
}

export function useHeroAnimationProvider({
  containerRef,
  sectionRef,
}: UseHeroAnimationProviderOptions): HeroAnimationOrchestrator {
  const subscribersRef = useRef<Set<HeroAnimationSubscriber>>(new Set());
  const [state, setState] = useState<HeroAnimationState>({
    shouldAnimate: true,
    isTextSelected: false,
    isSectionVisible: true,
    prefersReducedMotion: false,
  });
  const stateRef = useRef(state);

  const notify = useCallback(() => {
    const s = stateRef.current;
    for (const fn of subscribersRef.current) {
      fn(s);
    }
  }, []);

  const setCondition = useCallback(
    <K extends keyof HeroAnimationState>(key: K, value: HeroAnimationState[K]) => {
      if (stateRef.current[key] === value) return;
      stateRef.current = { ...stateRef.current, [key]: value };
      stateRef.current = {
        ...stateRef.current,
        shouldAnimate: !stateRef.current.isTextSelected && stateRef.current.isSectionVisible,
      };
      setState(stateRef.current);
      notify();
    },
    [notify],
  );

  const getState = useCallback((): HeroAnimationState => stateRef.current, []);

  const subscribe = useCallback((fn: HeroAnimationSubscriber) => {
    subscribersRef.current.add(fn);
    return () => {
      subscribersRef.current.delete(fn);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkSelection = () => {
      const selection = window.getSelection();
      let isSelected = false;
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          const startEl = getElementFromNode(range.startContainer);
          const endEl = getElementFromNode(range.endContainer);
          isSelected = Boolean(
            (startEl && container.contains(startEl)) || (endEl && container.contains(endEl)),
          );
        }
      }
      setCondition("isTextSelected", isSelected);
    };

    const handleSelectStart = (e: Event) => {
      if (container.contains(e.target as Node)) {
        setCondition("isTextSelected", true);
      }
    };

    const handleMouseUp = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(checkSelection);
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (
        e.shiftKey ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        requestAnimationFrame(checkSelection);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey) {
        setCondition("isTextSelected", true);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!container.contains(e.target as Node)) {
        setCondition("isTextSelected", false);
      }
    };

    let lastCheck = 0;
    const THROTTLE_MS = 150;
    const handleSelectionChange = () => {
      const now = performance.now();
      if (now - lastCheck < THROTTLE_MS) return;
      lastCheck = now;
      requestAnimationFrame(checkSelection);
    };

    document.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("selectstart", handleSelectStart, { passive: true });
    document.addEventListener("keydown", handleKeyDown, { passive: true });
    document.addEventListener("keyup", handleKeyUp, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("selectionchange", handleSelectionChange, { passive: true });

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [containerRef, setCondition]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setCondition("isSectionVisible", entry.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef, setCondition]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setCondition("prefersReducedMotion", mq.matches);

    const handler = (e: MediaQueryListEvent) => setCondition("prefersReducedMotion", e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setCondition]);

  return useMemo(() => ({ getState, subscribe }), [getState, subscribe]);
}
