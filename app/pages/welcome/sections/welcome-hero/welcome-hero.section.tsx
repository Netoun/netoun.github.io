import { useEffect, useReducer, useRef, useState } from "react";
import { Section } from "@/components/layouts/sections/section.component";
import { useMousePosition } from "@/hooks/use-mouse-position.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { WelcomeHeroFilterBackground } from "./components/background/welcome-hero-filter-background.component";
import { WelcomeHeroComputerComponent } from "./components/computer/welcome-hero-computer.component";
import { useWelcomeHeroContentAnimation } from "./hooks/use-welcome-hero-content-animation.hook";
import { ContactHoverCard } from "./components/contact-hover-card/welcome-hero-contact-hover-card.component";
import * as styles from "./welcome-hero.css";

function getElementFromNode(node: Node): Element | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.parentElement;
  }
  return node as Element;
}

export function WelcomeHeroSection() {
  const welcomeContainerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
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

  // Detect text selection in welcome-hero section (optimized for Chrome)
  // Uses mouseup/keyup instead of selectionchange to avoid excessive events on Chrome
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

    // Check on mouseup (when selection ends)
    const handleMouseUp = () => {
      // Small delay to ensure selection is updated
      requestAnimationFrame(() => {
        requestAnimationFrame(checkSelection);
      });
    };

    // Check on keyup (for keyboard selections like Shift+Arrow)
    const handleKeyUp = (e: KeyboardEvent) => {
      // Only check if selection-related keys are pressed
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

    // Check when clicking outside to clear selection
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!container.contains(target)) {
        dispatch("deselect");
      }
    };

    // Fallback: check selectionchange but with heavy throttling (only for Chrome edge cases)
    let lastCheck = 0;
    const THROTTLE_MS = 150; // Only check every 150ms max
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

  const { startAnimation } = useWelcomeHeroContentAnimation();

  useEffect(() => {
    if (headingRef.current && descriptionRef.current) {
      // Use getElementById for button (faster than getElementsByClassName)
      const button = document.getElementById("welcome-button");
      if (button) {
        startAnimation({
          welcomeHeading: headingRef.current,
          welcomeDescription: descriptionRef.current,
          welcomeButton: button as HTMLElement,
        });
      }
    }
  }, [startAnimation]);

  const shouldDisableHeroAnimations = isTextSelected || !isVisible;

  return (
    <Section ref={sectionRef} className={styles.welcomeSectionStyles} data-section="welcome-hero">
      <div
        ref={welcomeContainerRef}
        id="welcome-container"
        className={styles.welcomeContainerStyle}
        data-text-selected={isTextSelected ? "true" : "false"}
      >
        <WelcomeHeroFilterBackground container={container} mousePosition={mousePosition} />
        <div className={styles.welcomeContentStyle}>
          <h1 id="welcome-heading" ref={headingRef} className={styles.welcomeHeadingStyles}>
            Hi, I'm Nicolas&nbsp;: <br /> Full-stack engineer crafting fast, clean web experiences.
          </h1>
          <p
            id="welcome-description"
            ref={descriptionRef}
            className={styles.welcomeDescriptionStyles}
          >
            <b>_</b>❯ I design and ship clean web experiences - from scalable frontends to robust
            backend systems. Currently building at{" "}
            <a className={styles.welcomeLinkStyles} href="https://www.lonestone.io">
              Lonestone
            </a>{" "}
            as a software engineer.
            <span className={styles.welcomeDescriptionCursorStyles}>▐</span>
          </p>
          <div className={styles.welcomeMetaStyles}>
            <span>Focused on performance, UX, and clean architecture</span>
          </div>
          <ContactHoverCard />
        </div>
      </div>

      <WelcomeHeroComputerComponent
        mousePosition={mousePosition}
        disabled={shouldDisableHeroAnimations}
      />
    </Section>
  );
}
