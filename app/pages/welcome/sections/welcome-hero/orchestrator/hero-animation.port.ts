export interface HeroAnimationState {
  shouldAnimate: boolean;
  isTextSelected: boolean;
  isSectionVisible: boolean;
  prefersReducedMotion: boolean;
}

export type HeroAnimationSubscriber = (state: HeroAnimationState) => void;

export interface HeroAnimationOrchestrator {
  getState(): HeroAnimationState;
  subscribe(subscriber: HeroAnimationSubscriber): () => void;
}
