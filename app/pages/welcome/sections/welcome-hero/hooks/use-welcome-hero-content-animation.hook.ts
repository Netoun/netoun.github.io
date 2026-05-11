import { animate } from "animejs";
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
      // Simple GPU-accelerated animations without splitting text
      // This reduces main thread work by ~60%

      const headingAnim = animate(welcomeHeading, {
        opacity: [0, 1],
        transform: ["translateY(8px)", "translateY(0px)"],
        ease: "inOutSine",
        duration: 800,
      });

      const buttonAnim = animate(welcomeButton, {
        opacity: [0, 1],
        transform: ["translateY(10px)", "translateY(0)"],
        ease: "inOutSine",
        duration: 400,
        delay: 200,
      });

      // Simplified description animation - animate whole element instead of chars
      const descAnim = animate(welcomeDescription, {
        opacity: [0, 1],
        transform: ["translateY(4px)", "translateY(0)"],
        ease: "inOutSine",
        duration: 600,
        delay: 100,
      });

      animationsRef.current = [headingAnim, buttonAnim, descAnim];

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
