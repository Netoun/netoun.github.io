import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/layouts/sections/section.component";
import { Button } from "@/components/primitives/button/button.component";
import { useMousePosition } from "@/hooks/use-mouse-position.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import { WelcomeHeroFilterBackground } from "./components/background/welcome-hero-filter-background.component";
import { WelcomeHeroComputerComponent } from "./components/computer/welcome-hero-computer.component";
import { useWelcomeHeroContentAnimation } from "./hooks/use-welcome-hero-content-animation.hook";
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
  const [isTextSelected, setIsTextSelected] = useState(false);
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

      setIsTextSelected(isSelected);
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

    // Check when clicking outside to clear selection
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!container.contains(target)) {
        setIsTextSelected(false);
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
    document.addEventListener("keyup", handleKeyUp, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("selectionchange", handleSelectionChange, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
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

  return (
    <Section ref={sectionRef} className={styles.welcomeSectionStyles} data-section="welcome-hero">
      <div
        ref={welcomeContainerRef}
        id="welcome-container"
        className={styles.welcomeContainerStyle}
      >
        <WelcomeHeroFilterBackground
          container={container}
          mousePosition={mousePosition}
          disabled={isTextSelected || !isVisible}
        />
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
            <span>React - TypeScript - NestJS - WebGL</span>
          </div>
          <Button id="welcome-button" className={styles.welcomeButtonStyles}>
            <span className={styles.welcomeButtonLabelStyles}>_Get my resume_</span>
            <span className={styles.welcomeButtonHoverLabelStyles}>_Downloading... █</span>{" "}
            <span className={styles.welcomeButtonArrowStyles}>⤘</span>
          </Button>
        </div>
      </div>

      <WelcomeHeroComputerComponent mousePosition={mousePosition} />
    </Section>
  );
}
