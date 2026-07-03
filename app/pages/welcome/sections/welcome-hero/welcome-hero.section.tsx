import { useRef } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position.hook";
import { HeroAnimationContext } from "./orchestrator/hero-animation.context";
import { useHeroAnimationProvider } from "./orchestrator/use-hero-animation.hook";
import { WelcomeHeroFilterBackground } from "./components/background/welcome-hero-filter-background.component";
import { WelcomeHeroComputerComponent } from "./components/computer/welcome-hero-computer.component";
import { WelcomeHeroSectionContent } from "./components/welcome-hero-section-content/welcome-hero-section-content.component";
import { HeroScrollMorph } from "./components/hero-scroll-morph/hero-scroll-morph.component";
import * as styles from "./welcome-hero.css";

export function WelcomeHeroSection() {
  const welcomeContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const orchestrator = useHeroAnimationProvider({
    containerRef: welcomeContainerRef,
    sectionRef,
  });
  const mousePosition = useMousePosition({
    container: welcomeContainerRef.current ?? undefined,
  });

  const isTextSelected = orchestrator.getState().isTextSelected;

  return (
    <HeroAnimationContext.Provider value={orchestrator}>
      <HeroScrollMorph containerRef={welcomeContainerRef}>
        <div
          ref={sectionRef}
          id="intro"
          className={styles.welcomeSectionStyles}
          data-section="welcome-hero"
        >
          <div
            ref={welcomeContainerRef}
            id="welcome-container"
            className={styles.welcomeContainerStyle}
            data-text-selected={isTextSelected ? "true" : "false"}
          >
            <WelcomeHeroFilterBackground />
            <WelcomeHeroSectionContent />
          </div>

          <WelcomeHeroComputerComponent mousePosition={mousePosition} />
        </div>
      </HeroScrollMorph>
    </HeroAnimationContext.Provider>
  );
}
