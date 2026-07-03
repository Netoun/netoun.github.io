import { memo, useEffect, useReducer, useRef, useState } from "react";
import { Computer } from "@/components/misc/computer/computer.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import { CyberneticGlyphGrid } from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.component";
import { FakeConsole } from "@/components/misc/fake-console/fake-console.component";
import { GlitchSignalMap } from "@/components/misc/glitch-signal-map/glitch-signal-map.component";
import { SystemMetricsPanel } from "@/components/misc/system-metrics-panel/system-metrics-panel.component";
import { useHeroAnimation } from "../../orchestrator/hero-animation.context";
import { WelcomeHeroComputerSplash } from "./components/splash/welcome-hero-computer-splash.component";
import * as styles from "./welcome-hero-computer.css";

const BASE_ROTATION_X = 3;
const BASE_ROTATION_Y = -3;
// Tilt amplitude in pre-multiplier units: the CSS transform multiplies the
// vars by 1.8, so ±2.8 here ≈ ±5deg of visible tilt — subtle, not gimmicky.
const TILT_AMPLITUDE = 2.8;
// Lerp factor per frame — damping toward the pointer target for smoothness.
const TILT_DAMPING = 0.1;

interface WelcomeHeroComputerComponentProps {
  mousePosition: MousePosition;
}

const HERO_COMPUTER_ZONES = [
  {
    id: "hero-computer-zone1",
    className: styles.zone1Styles,
    render: (isAnimating: boolean) => <FakeConsole isAnimating={isAnimating} />,
  },
  {
    id: "hero-computer-zone2",
    className: styles.zone2Styles,
    render: (isAnimating: boolean) => <GlitchSignalMap isAnimating={isAnimating} />,
  },
  {
    id: "hero-computer-zone3",
    className: styles.zone3Styles,
    render: (isAnimating: boolean) => <CyberneticGlyphGrid isAnimating={isAnimating} />,
  },
  {
    id: "hero-computer-zone4",
    className: styles.zone4Styles,
    render: (isAnimating: boolean) => <SystemMetricsPanel isAnimating={isAnimating} />,
  },
] as const;

function WelcomeHeroComputerComponentInner({ mousePosition }: WelcomeHeroComputerComponentProps) {
  const heroAnim = useHeroAnimation();
  const disabled = !heroAnim.getState().shouldAnimate;
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

  // Tilt only for desktop pointers, never under prefers-reduced-motion.
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setCanTilt(finePointer.matches && !reducedMotion.matches);
    };

    update();
    finePointer.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      finePointer.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const resetToBasePose = () => {
      lastRotationRef.current = { x: BASE_ROTATION_X, y: BASE_ROTATION_Y };
      const capturesElement = capturesRef.current;
      if (!capturesElement) return;
      capturesElement.style.setProperty("--mouse-position-x", `${BASE_ROTATION_X}deg`);
      capturesElement.style.setProperty("--mouse-position-y", `${BASE_ROTATION_Y}deg`);
    };

    if (!canTilt) {
      resetToBasePose();
      return;
    }

    let frameId: number | null = null;

    // Single rAF loop: pointer position (mutated ref, no rerenders) → tilt
    // target, lerped each frame for damping. Only the two CSS vars feeding a
    // GPU-composited rotateX/rotateY transform are written — no layout work.
    const animate = () => {
      if (!shouldAnimateRef.current) {
        // Hero out of view / animations disabled: detach the loop.
        frameId = null;
        return;
      }

      frameId = requestAnimationFrame(animate);

      const currentMousePos = mousePositionRef.current;
      // No pointer event yet: hold the base pose instead of tilting toward (0,0).
      if (currentMousePos.x === 0 && currentMousePos.y === 0) return;

      // Normalize viewport coords to [-1, 1] around the center.
      const nx = Math.min(1, Math.max(-1, (currentMousePos.x / window.innerWidth) * 2 - 1));
      const ny = Math.min(1, Math.max(-1, (currentMousePos.y / window.innerHeight) * 2 - 1));

      const target = {
        x: BASE_ROTATION_X - nx * TILT_AMPLITUDE,
        y: BASE_ROTATION_Y - ny * TILT_AMPLITUDE,
      };

      const current = lastRotationRef.current;
      const next = {
        x: current.x + (target.x - current.x) * TILT_DAMPING,
        y: current.y + (target.y - current.y) * TILT_DAMPING,
      };

      if (Math.abs(next.x - current.x) < 0.002 && Math.abs(next.y - current.y) < 0.002) {
        return; // Converged — skip the style write until the pointer moves again.
      }

      lastRotationRef.current = next;

      const capturesElement = capturesRef.current;
      if (!capturesElement) return;
      capturesElement.style.setProperty("--mouse-position-x", `${next.x}deg`);
      capturesElement.style.setProperty("--mouse-position-y", `${next.y}deg`);
    };

    // Only start animation if component is visible
    if (shouldAnimateRef.current) {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [shouldAnimate, canTilt]);

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
    return (
      prevProps.mousePosition.x === nextProps.mousePosition.x &&
      prevProps.mousePosition.y === nextProps.mousePosition.y
    );
  },
);
