import clsx from "clsx";
import { memo, type RefObject, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Computer } from "@/components/misc/computer/computer.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import { CyberneticGlyphGrid } from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.component";
import { FakeConsole } from "@/components/misc/fake-console/fake-console.component";
import { GlitchSignalMap } from "@/components/misc/glitch-signal-map/glitch-signal-map.component";
import { SystemMetricsPanel } from "@/components/misc/system-metrics-panel/system-metrics-panel.component";
import { formatLaptopTilt, useWelcomeHeroSpec } from "../../hooks/use-welcome-hero-spec.hook";
import { useHeroAnimation, useHeroAnimationValue } from "../../orchestrator/hero-animation.context";
import { heroSpecGroup, heroSpecShown } from "../../welcome-hero-spec.css";
import { WelcomeHeroSpecNote } from "../spec-note/welcome-hero-spec-note.component";
import { WelcomeHeroComputerSplash } from "./components/splash/welcome-hero-computer-splash.component";
import * as styles from "./welcome-hero-computer.css";

const BASE_ROTATION_X = 3;
const BASE_ROTATION_Y = -3;
// Tilt amplitude in pre-multiplier units: the CSS transform multiplies the
// vars by 1.8, so ±2.8 here ≈ ±5deg of visible tilt — subtle, not gimmicky.
const TILT_AMPLITUDE = 2.8;
// Lerp factor per frame — damping toward the pointer target for smoothness.
const TILT_DAMPING = 0.1;

/** The tilt as the CSS transform applies it, for the spec note. */
const tiltLabel = ({ x, y }: { x: number; y: number }) =>
  formatLaptopTilt(x * styles.heroComputerTiltScale, y * styles.heroComputerTiltScale);

const TILT_LINE_INDEX = 1;
const BASE_TILT_LABEL = tiltLabel({ x: BASE_ROTATION_X, y: BASE_ROTATION_Y });

/** Rewrites the spec note's tilt line, only when its text changes. */
function writeTiltLine(line: HTMLSpanElement | null, rotation: { x: number; y: number }) {
  if (!line) return;
  const text = tiltLabel(rotation);
  if (line.textContent !== text) line.textContent = text;
}

interface WelcomeHeroComputerComponentProps {
  /** Stable pointer ref from `useMousePosition` — read in animation frames only. */
  mousePositionRef: RefObject<MousePosition>;
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

function WelcomeHeroComputerComponentInner({
  mousePositionRef,
}: WelcomeHeroComputerComponentProps) {
  const heroAnimationEnabled = useHeroAnimationValue(useHeroAnimation(), "shouldAnimate");
  const containerRef = useRef<HTMLDivElement>(null);
  const capturesRef = useRef<HTMLDivElement>(null);
  const tiltLineRef = useRef<HTMLSpanElement | null>(null);
  const spec = useWelcomeHeroSpec();
  // The note mounts once the spec is measured: print the pose the laptop holds now.
  const attachTiltLine = useCallback((element: HTMLSpanElement | null) => {
    tiltLineRef.current = element;
    writeTiltLine(element, lastRotationRef.current);
  }, []);

  const lastRotationRef = useRef({ x: BASE_ROTATION_X, y: BASE_ROTATION_Y });
  const shouldAnimateRef = useRef(true);

  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const shouldAnimate =
    useAnimationPriority({
      priority: "medium",
      isVisible: isIntersecting,
    }) && heroAnimationEnabled;
  shouldAnimateRef.current = shouldAnimate;

  const [visibleZones, dispatch] = useReducer((_state: number, action: number) => action, 0);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    if (!shouldAnimate) return;

    // Reduced motion: no staggered fade-in — the screen is complete at once.
    if (hasRevealedRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hasRevealedRef.current = true;
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
      writeTiltLine(tiltLineRef.current, lastRotationRef.current);
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
      writeTiltLine(tiltLineRef.current, next);

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
  }, [shouldAnimate, canTilt, mousePositionRef]);

  return (
    <div
      ref={(element) => {
        containerRef.current = element;
        intersectionRef.current = element;
      }}
      className={styles.welcomeHeroComputerWrapperStyles}
      data-spec-target="laptop"
    >
      {/* Decorative on the homepage: the screen's hex and fake metrics are noise
          to a screen reader. No focusable inside, so aria-hidden is enough — inert
          would also kill the signal map's pointer hover. The Lab keeps them exposed. */}
      <div
        aria-hidden="true"
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
            <span
              className={clsx(
                styles.welcomeHeroComputerSelectionStyles,
                heroSpecGroup.laptop,
                heroSpecShown.block,
              )}
            />
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
                  {/* Offscreen or text selected: every widget loop pauses, not just the tilt. */}
                  {render(index < visibleZones && shouldAnimate)}
                </div>
              ))
            )}
          </div>
        </Computer>
      </div>
      <WelcomeHeroSpecNote
        group="laptop"
        lines={
          spec
            ? ["COMPUTER · CSS 3D", BASE_TILT_LABEL, `${spec.laptopFaces} faces · preserve-3d`]
            : undefined
        }
        className={styles.welcomeHeroComputerNoteStyles}
        accent="mint"
        liveLine={{ index: TILT_LINE_INDEX, ref: attachTiltLine }}
      />
    </div>
  );
}
// The pointer ref is stable, so memo keeps parent re-renders from reaching the heavy scene.
export const WelcomeHeroComputerComponent = memo(WelcomeHeroComputerComponentInner);
