import { memo, useEffect, useRef, useState } from "react";
import { Computer } from "@/components/misc/computer/computer.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import { WelcomeHeroComputerFakeConsole } from "./components/fake-console/welcome-hero-computer-fake-console.component";
import * as styles from "./welcome-hero-computer.css";

function WelcomeHeroComputerComponentInner({ mousePosition }: { mousePosition: MousePosition }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const mousePositionRef = useRef(mousePosition);
  const lastRotationRef = useRef({ x: 0, y: 0 });
  const shouldAnimateRef = useRef(true);

  mousePositionRef.current = mousePosition;

  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const shouldAnimate = useAnimationPriority({
    priority: "medium",
    isVisible: isIntersecting,
  });
  shouldAnimateRef.current = shouldAnimate;

  useEffect(() => {
    let frameId: number;
    let idleCallbackId: number | undefined;
    let lastUpdateTime = 0;
    const updateInterval = 16;

    const animate = (currentTime: number) => {
      frameId = requestAnimationFrame(animate);
      if (!shouldAnimateRef.current) return;
      if (currentTime - lastUpdateTime < updateInterval) return;
      lastUpdateTime = currentTime;

      const currentMousePos = mousePositionRef.current;
      const newRotation = {
        x: currentMousePos.x * -0.001,
        y: currentMousePos.y * -0.001,
      };

      if (
        Math.abs(newRotation.x - lastRotationRef.current.x) > 0.0001 ||
        Math.abs(newRotation.y - lastRotationRef.current.y) > 0.0001
      ) {
        lastRotationRef.current = newRotation;

        if (idleCallbackId) cancelIdleCallback(idleCallbackId);

        if ("requestIdleCallback" in window) {
          idleCallbackId = requestIdleCallback(
            () => setRotation(newRotation),
            { timeout: 100 },
          );
        } else {
          setRotation(newRotation);
        }
      }
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (idleCallbackId) cancelIdleCallback(idleCallbackId);
    };
  }, []);

  return (
    <div
      ref={(element) => {
        containerRef.current = element;
        intersectionRef.current = element;
      }}
      className={styles.welcomeHeroComputerWrapperStyles}
    >
      <div
        style={
          {
            "--mouse-position-x": `${rotation.x}deg`,
            "--mouse-position-y": `${rotation.y}deg`,
          } as React.CSSProperties
        }
        className={styles.welcomeHeroComputerCapturesStyles}
      >
        <Computer>
          <div className={styles.welcomeHeroComputerStyles}>
            <div id="hero-computer-zone1" className={styles.zone1Styles}>
              <WelcomeHeroComputerFakeConsole isAnimating={shouldAnimate} />
            </div>
            <div id="hero-computer-zone2" className={styles.zone2Styles} />
            <div id="hero-computer-zone3" className={styles.zone3Styles} />
            <div id="hero-computer-zone4" className={styles.zone4Styles} />
          </div>
        </Computer>
      </div>
    </div>
  );
}
// Memoize component to prevent rerenders when mousePosition object reference is stable
export const WelcomeHeroComputerComponent = memo(
  WelcomeHeroComputerComponentInner,
  (prevProps, nextProps) => {
    // Only rerender if mouse position values actually changed
    return (
      prevProps.mousePosition.x === nextProps.mousePosition.x &&
      prevProps.mousePosition.y === nextProps.mousePosition.y
    );
  },
);
