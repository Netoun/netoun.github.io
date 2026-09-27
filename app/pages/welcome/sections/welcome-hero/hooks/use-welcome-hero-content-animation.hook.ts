import { SIGNATURE_CURVE } from "@styles/motion.css";
import { animate, cubicBezier } from "animejs";
import { useCallback, useRef } from "react";

type WelcomeHeroContentAnimationProps = {
  welcomeHeading: HTMLElement;
  welcomeDescription: HTMLElement;
  welcomeButton: HTMLElement;
};

export function useWelcomeHeroContentAnimation() {
  const animationsRef = useRef<ReturnType<typeof animate>[]>([]);

  const startAnimation = useCallback(
    ({ welcomeHeading, welcomeDescription, welcomeButton }: WelcomeHeroContentAnimationProps) => {
      // Reduced motion: elements are visible by default, simply don't animate
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => {};
      }

      // Intentional cascade — heading, then description, then CTA — sharing the
      // signature easing (motion.easing.signature). GPU-only: opacity/transform,
      // whole elements (no text splitting). anime.js ≥ 4.5 needs the easing
      // function itself: the "cubicBezier(…)" string form silently falls back to linear.
      const ease = cubicBezier(...SIGNATURE_CURVE);

      const headingAnim = animate(welcomeHeading, {
        opacity: [0, 1],
        transform: ["translateY(12px)", "translateY(0px)"],
        ease,
        duration: 700,
      });

      const descAnim = animate(welcomeDescription, {
        opacity: [0, 1],
        transform: ["translateY(8px)", "translateY(0)"],
        ease,
        duration: 600,
        delay: 150,
      });

      const buttonAnim = animate(welcomeButton, {
        opacity: [0, 1],
        transform: ["translateY(10px)", "translateY(0)"],
        ease,
        duration: 500,
        delay: 300,
      });

      animationsRef.current = [headingAnim, descAnim, buttonAnim];

      return () => {
        animationsRef.current.forEach((anim) => anim.cancel?.());
        animationsRef.current = [];
      };
    },
    [],
  );

  return {
    startAnimation,
  };
}
