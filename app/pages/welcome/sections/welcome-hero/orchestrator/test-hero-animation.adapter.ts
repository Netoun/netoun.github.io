import type {
  HeroAnimationOrchestrator,
  HeroAnimationState,
  HeroAnimationSubscriber,
} from "./hero-animation.port";

export interface TestHeroAnimationAdapter extends HeroAnimationOrchestrator {
  setTextSelected(value: boolean): void;
  setSectionVisible(value: boolean): void;
  setReducedMotion(value: boolean): void;
}

export function createTestHeroAnimationAdapter(
  initial?: Partial<HeroAnimationState>,
): TestHeroAnimationAdapter {
  const subscribers = new Set<HeroAnimationSubscriber>();

  function deriveState(): HeroAnimationState {
    return {
      shouldAnimate: !state.isTextSelected && state.isSectionVisible,
      isTextSelected: state.isTextSelected,
      isSectionVisible: state.isSectionVisible,
      prefersReducedMotion: state.prefersReducedMotion,
    };
  }

  const state: HeroAnimationState = {
    shouldAnimate: true,
    isTextSelected: false,
    isSectionVisible: true,
    prefersReducedMotion: false,
    ...initial,
  };

  function notify() {
    const s = deriveState();
    for (const fn of subscribers) {
      fn(s);
    }
  }

  return {
    getState: () => deriveState(),
    subscribe(fn) {
      subscribers.add(fn);
      return () => subscribers.delete(fn);
    },
    setTextSelected(value) {
      if (state.isTextSelected === value) return;
      state.isTextSelected = value;
      state.shouldAnimate =
        !state.isTextSelected && state.isSectionVisible && !state.prefersReducedMotion;
      notify();
    },
    setSectionVisible(value) {
      if (state.isSectionVisible === value) return;
      state.isSectionVisible = value;
      state.shouldAnimate =
        !state.isTextSelected && state.isSectionVisible && !state.prefersReducedMotion;
      notify();
    },
    setReducedMotion(value) {
      if (state.prefersReducedMotion === value) return;
      state.prefersReducedMotion = value;
      state.shouldAnimate =
        !state.isTextSelected && state.isSectionVisible && !state.prefersReducedMotion;
      notify();
    },
  };
}
