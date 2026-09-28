import clsx from "clsx";
import { memo, useEffect, useRef } from "react";
import { useWelcomeHeroSpec } from "../../hooks/use-welcome-hero-spec.hook";
import { heroSpecGroup, heroSpecShown } from "../../welcome-hero-spec.css";
import * as styles from "./welcome-hero-spec-overlay.css";

// The gutter value counts up as its dimension line draws (same delay and length).
const COUNT_DELAY_MS = 300;
const COUNT_DURATION_MS = 800;

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Frame-wide spec layer: dot grid, scanline, gutter dimension. */
export const WelcomeHeroSpecOverlay = memo(function WelcomeHeroSpecOverlay() {
  const spec = useWelcomeHeroSpec();
  const gutter = spec?.gutter;
  const countRef = useRef<HTMLSpanElement>(null);
  const hasCountedRef = useRef(false);

  // Written to the DOM directly: a re-render per frame would be waste. Counts
  // once; later measures (resizes) print the new value as is.
  useEffect(() => {
    const element = countRef.current;
    if (gutter === undefined || !element) return;

    if (hasCountedRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hasCountedRef.current = true;
      element.textContent = String(gutter);
      return;
    }
    hasCountedRef.current = true;

    const start = performance.now() + COUNT_DELAY_MS;
    let frameId = requestAnimationFrame(function count(now) {
      const progress = Math.min(1, Math.max(0, (now - start) / COUNT_DURATION_MS));
      element.textContent = String(Math.round(gutter * easeOutCubic(progress)));
      if (progress < 1) frameId = requestAnimationFrame(count);
    });

    return () => {
      cancelAnimationFrame(frameId);
      element.textContent = String(gutter);
    };
  }, [gutter]);

  return (
    <div aria-hidden="true" className={styles.welcomeHeroSpecOverlayStyles}>
      <div className={styles.welcomeHeroSpecGridStyles} />
      <div className={styles.welcomeHeroSpecScanlineStyles} />

      <div
        className={clsx(
          styles.welcomeHeroSpecGutterStyles,
          heroSpecGroup.gutter,
          heroSpecShown.block,
        )}
      >
        <span className={styles.welcomeHeroSpecGutterRuleStyles} />
        <span className={styles.welcomeHeroSpecGutterLabelStyles}>
          <span ref={countRef} /> · gutter
        </span>
      </div>
    </div>
  );
});
