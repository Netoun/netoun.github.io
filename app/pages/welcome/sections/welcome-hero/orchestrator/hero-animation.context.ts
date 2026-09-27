import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { HeroAnimationOrchestrator, HeroAnimationState } from "./hero-animation.port";
import { INITIAL_HERO_ANIMATION_STATE } from "./use-hero-animation.hook";

export const HeroAnimationContext = createContext<HeroAnimationOrchestrator | null>(null);

export function useHeroAnimation(): HeroAnimationOrchestrator {
  const ctx = useContext(HeroAnimationContext);
  if (!ctx) {
    throw new Error("useHeroAnimation must be used within a HeroAnimationContext provider");
  }
  return ctx;
}

/**
 * Subscribes to one key of the orchestrator state. The orchestrator object is
 * memoized, so reading `getState()` during render goes stale as soon as the
 * component skips a render (memo, unchanged context) — this re-renders on change.
 */
export function useHeroAnimationValue<K extends keyof HeroAnimationState>(
  orchestrator: HeroAnimationOrchestrator,
  key: K,
): HeroAnimationState[K] {
  const getSnapshot = useCallback(() => orchestrator.getState()[key], [orchestrator, key]);
  // Prerender: the initial state, which is also the client's first snapshot.
  const getServerSnapshot = useCallback(() => INITIAL_HERO_ANIMATION_STATE[key], [key]);
  return useSyncExternalStore(orchestrator.subscribe, getSnapshot, getServerSnapshot);
}
