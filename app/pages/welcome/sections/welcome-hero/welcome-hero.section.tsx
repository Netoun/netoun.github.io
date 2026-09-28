import { useRef, useState } from "react";
import type { RendererType } from "@/components/misc/canvas-renderer/canvas-renderer.types";
import { useMousePosition } from "@/hooks/use-mouse-position.hook";
import { HeroAnimationContext, useHeroAnimationValue } from "./orchestrator/hero-animation.context";
import { useHeroAnimationProvider } from "./orchestrator/use-hero-animation.hook";
import {
  WelcomeHeroSpecContext,
  useWelcomeHeroSpecProvider,
} from "./hooks/use-welcome-hero-spec.hook";
import type { HeroSpecFileId } from "./welcome-hero-spec-data";
import { WelcomeHeroFilterBackground } from "./components/background/welcome-hero-filter-background.component";
import { WelcomeHeroComputerComponent } from "./components/computer/welcome-hero-computer.component";
import { WelcomeHeroSectionContent } from "./components/welcome-hero-section-content/welcome-hero-section-content.component";
import { WelcomeHeroScrollMorph } from "./components/scroll-morph/welcome-hero-scroll-morph.component";
import { WelcomeHeroSpecHeader } from "./components/spec-header/welcome-hero-spec-header.component";
import { WelcomeHeroSpecOverlay } from "./components/spec-overlay/welcome-hero-spec-overlay.component";
import * as styles from "./welcome-hero.css";

export function WelcomeHeroSection() {
  const welcomeContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const orchestrator = useHeroAnimationProvider({
    containerRef: welcomeContainerRef,
    sectionRef,
  });
  // Viewport-wide: the laptop sits outside the text container and must follow the pointer anywhere.
  const mousePositionRef = useMousePosition();

  const isTextSelected = useHeroAnimationValue(orchestrator, "isTextSelected");

  // Spec layer: values measured from the live elements, the picked source file,
  // and the renderer that paints the mesh. The attributes drive its CSS.
  const spec = useWelcomeHeroSpecProvider({ sectionRef, containerRef: welcomeContainerRef });
  const [specFile, setSpecFile] = useState<HeroSpecFileId | null>(null);
  const [renderer, setRenderer] = useState<RendererType>("pending");

  return (
    <HeroAnimationContext.Provider value={orchestrator}>
      <WelcomeHeroSpecContext.Provider value={spec}>
        <WelcomeHeroScrollMorph>
          <div
            ref={sectionRef}
            id="intro"
            className={styles.welcomeSectionStyles}
            data-section="welcome-hero"
            data-spec={spec ? "on" : undefined}
            data-spec-file={specFile ?? undefined}
          >
            <div
              ref={welcomeContainerRef}
              id="welcome-container"
              className={styles.welcomeContainerStyle}
              data-text-selected={isTextSelected ? "true" : "false"}
            >
              <WelcomeHeroFilterBackground onRendererReady={setRenderer} />
              <WelcomeHeroSpecOverlay />
              <WelcomeHeroSectionContent />
              {/* Drawn along the top edge but read after the h1 and the lead: its tabs are
                  an extra, not the page's first words or first tab stop. */}
              <WelcomeHeroSpecHeader
                file={specFile}
                onFileChange={setSpecFile}
                renderer={renderer}
              />
            </div>

            <WelcomeHeroComputerComponent mousePositionRef={mousePositionRef} />
          </div>
        </WelcomeHeroScrollMorph>
      </WelcomeHeroSpecContext.Provider>
    </HeroAnimationContext.Provider>
  );
}
