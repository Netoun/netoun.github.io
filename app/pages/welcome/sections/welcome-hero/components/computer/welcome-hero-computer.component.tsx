import { memo, useEffect, useReducer, useRef } from "react";
import { Computer } from "@/components/misc/computer/computer.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import { WelcomeHeroComputerCyberneticGlyphGrid } from "./components/cybernetic-glyph-grid/welcome-hero-computer-cybernetic-glyph-grid.component";
import { WelcomeHeroComputerFakeConsole } from "./components/fake-console/welcome-hero-computer-fake-console.component";
import { WelcomeHeroComputerGlitchSignalMap } from "./components/glitch-signal-map/welcome-hero-computer-glitch-signal-map.component";
import { WelcomeHeroComputerSystemMetricsPanel } from "./components/system-metrics-panel/welcome-hero-computer-system-metrics-panel.component";
import { WelcomeHeroComputerSplash } from "./components/splash/welcome-hero-computer-splash.component";
import * as styles from "./welcome-hero-computer.css";

const BASE_ROTATION_X = 3;
const BASE_ROTATION_Y = -3;

interface WelcomeHeroComputerComponentProps {
  mousePosition: MousePosition;
  disabled?: boolean;
}

const HERO_COMPUTER_ZONES = [
  {
    id: "hero-computer-zone1",
    className: styles.zone1Styles,
    render: (isAnimating: boolean) => <WelcomeHeroComputerFakeConsole isAnimating={isAnimating} />,
  },
  {
    id: "hero-computer-zone2",
    className: styles.zone2Styles,
    render: (isAnimating: boolean) => (
      <WelcomeHeroComputerGlitchSignalMap isAnimating={isAnimating} />
    ),
  },
  {
    id: "hero-computer-zone3",
    className: styles.zone3Styles,
    render: (isAnimating: boolean) => (
      <WelcomeHeroComputerCyberneticGlyphGrid isAnimating={isAnimating} />
    ),
  },
  {
    id: "hero-computer-zone4",
    className: styles.zone4Styles,
    render: (isAnimating: boolean) => (
      <WelcomeHeroComputerSystemMetricsPanel isAnimating={isAnimating} />
    ),
  },
] as const;

function WelcomeHeroComputerComponentInner({
  mousePosition,
  disabled = false,
}: WelcomeHeroComputerComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const capturesRef = useRef<HTMLDivElement>(null);

  const mousePositionRef = useRef(mousePosition);
  const lastRotationRef = useRef({ x: BASE_ROTATION_X, y: BASE_ROTATION_Y });
  const shouldAnimateRef = useRef(true);

  mousePositionRef.current = mousePosition;

  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const shouldAnimate =
    useAnimationPriority({
      priority: "medium",
      isVisible: isIntersecting,
    }) && !disabled;
  shouldAnimateRef.current = shouldAnimate;

  const [visibleZones, dispatch] = useReducer((_state: number, action: number) => action, 0);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    if (!shouldAnimate) return;

    if (hasRevealedRef.current) {
      dispatch(4);
      return;
    }

    let zone = 1;
    const interval = setInterval(() => {
      dispatch(zone);
      zone += 1;
      if (zone > 4) {
        hasRevealedRef.current = true;
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [shouldAnimate]);

  useEffect(() => {
    let frameId: number | null = null;
    let idleCallbackId: number | undefined;
    let lastUpdateTime = 0;
    const updateInterval = 32; // Reduced from 16ms to 32ms (30fps instead of 60fps)

    const animate = (currentTime: number) => {
      if (!shouldAnimateRef.current) {
        frameId = null;
        return;
      }

      frameId = requestAnimationFrame(animate);
      if (currentTime - lastUpdateTime < updateInterval) return;
      lastUpdateTime = currentTime;

      const currentMousePos = mousePositionRef.current;
      const newRotation = {
        x: BASE_ROTATION_X + currentMousePos.x * -0.001,
        y: BASE_ROTATION_Y + currentMousePos.y * -0.001,
      };

      if (
        Math.abs(newRotation.x - lastRotationRef.current.x) > 0.001 ||
        Math.abs(newRotation.y - lastRotationRef.current.y) > 0.001
      ) {
        lastRotationRef.current = newRotation;

        const capturesElement = capturesRef.current;
        if (!capturesElement) return;

        if (idleCallbackId) cancelIdleCallback(idleCallbackId);

        const updateRotationStyles = () => {
          capturesElement.style.setProperty("--mouse-position-x", `${newRotation.x}deg`);
          capturesElement.style.setProperty("--mouse-position-y", `${newRotation.y}deg`);
        };

        if ("requestIdleCallback" in window) {
          idleCallbackId = requestIdleCallback(updateRotationStyles, {
            timeout: 50,
          });
        } else {
          updateRotationStyles();
        }
      }
    };

    // Only start animation if component is visible
    if (shouldAnimateRef.current) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (idleCallbackId) cancelIdleCallback(idleCallbackId);
    };
  }, [shouldAnimate]);

  return (
    <div
      ref={(element) => {
        containerRef.current = element;
        intersectionRef.current = element;
      }}
      className={styles.welcomeHeroComputerWrapperStyles}
    >
      <div
        ref={capturesRef}
        style={
          {
            "--mouse-position-x": `${BASE_ROTATION_X}deg`,
            "--mouse-position-y": `${BASE_ROTATION_Y}deg`,
          } as React.CSSProperties
        }
        className={styles.welcomeHeroComputerCapturesStyles}
      >
        <Computer>
          <div className={styles.welcomeHeroComputerStyles}>
            {visibleZones === 0 ? (
              <WelcomeHeroComputerSplash />
            ) : (
              HERO_COMPUTER_ZONES.map(({ id, className, render }, index) => (
                <div
                  key={id}
                  id={id}
                  className={className}
                  style={{ opacity: index < visibleZones ? 1 : 0 }}
                >
                  {render(index < visibleZones)}
                </div>
              ))
            )}
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
      prevProps.mousePosition.y === nextProps.mousePosition.y &&
      prevProps.disabled === nextProps.disabled
    );
  },
);
