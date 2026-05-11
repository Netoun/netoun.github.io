import { createTimeline, stagger, text } from "animejs";
import { useCallback, useRef } from "react";

type WelcomeHeroContentAnimationProps = {
  welcomeHeading: HTMLElement;
  welcomeDescription: HTMLElement;
  welcomeButton: HTMLElement;
};

/**
 * Optimise les spans créées par text.split() pour éviter les forced reflows
 * Utilise cssText pour batcher les modifications DOM
 */
const optimizeSpansForAnimation = (container: HTMLElement) => {
  const spans = container.querySelectorAll("span");
  spans.forEach((span) => {
    span.style.cssText = "will-change: transform, opacity; contain: layout paint style;";
  });
  return spans;
};

export function useWelcomeHeroContentAnimation() {
  // Track RAF id for cleanup
  const rafIdRef = useRef<number | null>(null);

  const startAnimation = useCallback(
    ({ welcomeHeading, welcomeDescription, welcomeButton }: WelcomeHeroContentAnimationProps) => {
      // Batch all DOM operations in RAF to avoid forced reflows
      rafIdRef.current = requestAnimationFrame(() => {
        // Split text with chars animation
        const { chars: charsDescription } = text.split(welcomeDescription, {
          chars: true,
        });

        // Optimize spans immediately after split
        optimizeSpansForAnimation(welcomeDescription);

        // Mark elements for GPU acceleration - batch DOM writes
        welcomeHeading.style.cssText += "will-change: transform, opacity;";
        welcomeButton.style.cssText += "will-change: transform, opacity;";

        const timeline = createTimeline({
          defaults: { ease: "inQuint", duration: 300 },
        })
          .add(
            welcomeHeading,
            {
              opacity: [0, 1],
              transform: ["translateY(8px)", "translateY(0px)"],
              ease: "inOutSine",
              duration: 1000,
            },
            "start",
          )
          .add(
            welcomeButton,
            {
              opacity: [0, 1],
              transform: ["translateY(10px)", "translateY(0)"],
              ease: "inOutSine",
              duration: 300,
            },
            "start",
          )
          .add(
            charsDescription,
            {
              opacity: [0, 1],
              translateY: [4, 0],
              rotate: [0, 10, -10, 0],
              ease: "inOutSine",
            },
            stagger(18),
          );

        // Handle completion callback
        timeline.then(() => {
          // Cleanup will-change after animation completes - batch DOM writes
          welcomeHeading.style.cssText = welcomeHeading.style.cssText.replace(/will-change:[^;]+;?/g, "");
          welcomeButton.style.cssText = welcomeButton.style.cssText.replace(/will-change:[^;]+;?/g, "");
          const spans = welcomeDescription.querySelectorAll("span");
          spans.forEach((span) => {
            span.style.cssText = span.style.cssText.replace(/will-change:[^;]+;?/g, "");
          });
        });

        timeline.init();
      });

      // Cleanup function
      return () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      };
    },
    [],
  );

  return {
    startAnimation,
  };
}
