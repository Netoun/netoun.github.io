import { createContext, useContext } from "react";
import type { HeroAnimationOrchestrator } from "./hero-animation.port";

export const HeroAnimationContext = createContext<HeroAnimationOrchestrator | null>(null);

export function useHeroAnimation(): HeroAnimationOrchestrator {
  const ctx = useContext(HeroAnimationContext);
  if (!ctx) {
    throw new Error("useHeroAnimation must be used within a HeroAnimationContext provider");
  }
  return ctx;
}
