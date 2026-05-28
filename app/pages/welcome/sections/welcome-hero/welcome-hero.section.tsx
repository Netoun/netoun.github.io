import { useEffect, useReducer, useRef, useState } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { WelcomeHeroFilterBackground } from "./components/background/welcome-hero-filter-background.component";
import { WelcomeHeroComputerComponent } from "./components/computer/welcome-hero-computer.component";
import { WelcomeHeroSectionContent } from "./components/welcome-hero-section-content/welcome-hero-section-content.component";
import { HeroScrollMorph } from "./components/hero-scroll-morph/hero-scroll-morph.component";
import * as styles from "./welcome-hero.css";

function getElementFromNode(node: Node): Element | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.parentElement;
  }
  return node as Element;
}

export function WelcomeHeroSection() {
  const welcomeContainerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { ref: sectionRef, isIntersecting: isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });
  const [isTextSelected, dispatch] = useReducer(
    (_state: boolean, action: "select" | "deselect") => {
      switch (action) {
        case "select":
          return true;
        case "deselect":
          return false;
      }
    },
    false,
  );
  const mousePosition = useMousePosition({
    container: container ?? undefined,
  });

  useEffect(() => {
    if (welcomeContainerRef.current) {
      setContainer(welcomeContainerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!welcomeContainerRef.current) return;

    const container = welcomeContainerRef.current;

    const checkSelection = () => {
      const selection = window.getSelection();

      let isSelected = false;
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          const startNode = range.startContainer;
          const endNode = range.endContainer;
          const startElement = getElementFromNode(startNode);
          const endElement = getElementFromNode(endNode);
          const isStartInContainer = startElement ? container.contains(startElement) : false;
          const isEndInContainer = endElement ? container.contains(endElement) : false;
          isSelected = isStartInContainer || isEndInContainer;
        }
      }

      dispatch(isSelected ? "select" : "deselect");
    };

    const handleSelectStart = (e: Event) => {
      const target = e.target as Node;
      if (container.contains(target)) {
        dispatch("select");
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
        dispatch("select");
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!container.contains(target)) {
        dispatch("deselect");
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
    document.addEventListener("selectstart", handleSelectStart, {
      passive: true,
    });
    document.addEventListener("keydown", handleKeyDown, { passive: true });
    document.addEventListener("keyup", handleKeyUp, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("selectionchange", handleSelectionChange, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const shouldDisableHeroAnimations = isTextSelected || !isVisible;

  return (
    <HeroScrollMorph containerRef={welcomeContainerRef}>
      <div
        ref={sectionRef}
        className={styles.welcomeSectionStyles}
        data-section="welcome-hero"
      >
        <div
          ref={welcomeContainerRef}
          id="welcome-container"
          className={styles.welcomeContainerStyle}
          data-text-selected={isTextSelected ? "true" : "false"}
        >
          <WelcomeHeroFilterBackground disabled={shouldDisableHeroAnimations} />
          <WelcomeHeroSectionContent />
        </div>

        <WelcomeHeroComputerComponent
          mousePosition={mousePosition}
          disabled={shouldDisableHeroAnimations}
        />
      </div>
    </HeroScrollMorph>
  );
}
