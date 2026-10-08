import { setElementVars } from "@vanilla-extract/dynamic";
import clsx from "clsx";
import { memo, type RefObject, useCallback, useEffect, useRef } from "react";
import { Computer } from "@/components/misc/computer/computer.component";
import { useAnimationPriority } from "@/hooks/use-animation-priority.hook";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer.hook";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import { CyberneticGlyphGrid } from "@/components/misc/cybernetic-glyph-grid/cybernetic-glyph-grid.component";
import { FakeConsole } from "@/components/misc/fake-console/fake-console.component";
import { GlitchSignalMap } from "@/components/misc/glitch-signal-map/glitch-signal-map.component";
import { SystemMetricsPanel } from "@/components/misc/system-metrics-panel/system-metrics-panel.component";
import { useCanTilt } from "../../hooks/use-can-tilt.hook";
import { formatLaptopTilt, useWelcomeHeroSpec } from "../../hooks/use-welcome-hero-spec.hook";
import { useZoneReveal } from "../../hooks/use-zone-reveal.hook";
import { useHeroAnimation, useHeroAnimationValue } from "../../orchestrator/hero-animation.context";
import { heroSpecGroup, heroSpecShown } from "../../welcome-hero-spec.css";
import { WelcomeHeroSpecNote } from "../spec-note/welcome-hero-spec-note.component";
import { WelcomeHeroComputerSplash } from "./components/splash/welcome-hero-computer-splash.component";
import * as styles from "./welcome-hero-computer.css";

const { x: BASE_ROTATION_X, y: BASE_ROTATION_Y } = styles.heroComputerBaseTilt;
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

function writeTilt(element: HTMLElement | null, rotation: { x: number; y: number }) {
  if (!element) return;
  setElementVars(element, {
    [styles.heroComputerTiltX]: `${rotation.x}deg`,
    [styles.heroComputerTiltY]: `${rotation.y}deg`,
  });
}

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
  const capturesRef = useRef<HTMLDivElement>(null);
  const tiltLineRef = useRef<HTMLSpanElement | null>(null);
  const spec = useWelcomeHeroSpec();
  // The note mounts once the spec is measured: print the pose the laptop holds now.
  const attachTiltLine = useCallback((element: HTMLSpanElement | null) => {
    tiltLineRef.current = element;
    writeTiltLine(element, lastRotationRef.current);
  }, []);

  const lastRotationRef = useRef({ x: BASE_ROTATION_X, y: BASE_ROTATION_Y });

  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const shouldAnimate =
    useAnimationPriority({
      priority: "medium",
      isVisible: isIntersecting,
    }) && heroAnimationEnabled;

  const visibleZones = useZoneReveal(shouldAnimate);
  // Tilt only for desktop pointers, never under prefers-reduced-motion.
  const canTilt = useCanTilt();

  useEffect(() => {
    const resetToBasePose = () => {
      lastRotationRef.current = { x: BASE_ROTATION_X, y: BASE_ROTATION_Y };
      writeTiltLine(tiltLineRef.current, lastRotationRef.current);
      writeTilt(capturesRef.current, lastRotationRef.current);
    };

    if (!canTilt) {
      resetToBasePose();
      return;
    }

    // Hero out of view / animations disabled: hold the last pose, no loop.
    if (!shouldAnimate) return;

    // Single rAF loop: pointer position (mutated ref, no rerenders) → tilt
    // target, lerped each frame for damping. Only the two CSS vars feeding a
    // GPU-composited rotateX/rotateY transform are written — no layout work.
    const animate = () => {
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
      writeTilt(capturesRef.current, next);
    };

    let frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [shouldAnimate, canTilt, mousePositionRef]);

  return (
    <div
      ref={(element) => {
        intersectionRef.current = element;
      }}
      className={styles.welcomeHeroComputerWrapperStyles}
      data-spec-target="laptop"
      // Visibility alone (not text selection): the screen's CSS loops pause only off screen.
      data-anim-disabled={isIntersecting ? "false" : "true"}
    >
      {/* Decorative on the homepage: the screen's hex and fake metrics are noise
          to a screen reader. No focusable inside, so aria-hidden is enough — inert
          would also kill the signal map's pointer hover. The Lab keeps them exposed. */}
      <div
        aria-hidden="true"
        ref={capturesRef}
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
                <div key={id} id={id} className={className} data-revealed={index < visibleZones}>
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
