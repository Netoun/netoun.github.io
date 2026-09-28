import { useEffect, useRef } from "react";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import type { RendererType } from "@/components/misc/canvas-renderer/canvas-renderer.types";
import { useHeroAnimation, useHeroAnimationValue } from "../../orchestrator/hero-animation.context";
import {
  HERO_SPEC_ENTRY_FILE,
  HERO_SPEC_FILES,
  type HeroSpecFileId,
  isHeroSpecFileId,
} from "../../welcome-hero-spec-data";
import * as styles from "./welcome-hero-spec-header.css";

interface WelcomeHeroSpecHeaderProps {
  file: HeroSpecFileId | null;
  onFileChange: (file: HeroSpecFileId | null) => void;
  renderer: RendererType;
}

// `svg` is the renderer's no-GPU fallback: the static CSS gradient shows instead.
const RENDERER_LABEL: Record<RendererType, string> = {
  pending: "…",
  webgpu: "webgpu",
  webgl: "webgl",
  svg: "css",
};

/** A gap this long means the tab was hidden: start a fresh sample instead of reporting it. */
const STALE_SAMPLE_MS = 2000;

export function WelcomeHeroSpecHeader({
  file,
  onFileChange,
  renderer,
}: WelcomeHeroSpecHeaderProps) {
  const isSectionVisible = useHeroAnimationValue(useHeroAnimation(), "isSectionVisible");
  const fpsRef = useRef<HTMLSpanElement>(null);

  // Frame rate, measured: frames per second of the page, sampled every second
  // and written straight to the DOM (no re-render). Only while the hero is on screen, and
  // never under reduced motion: the page is still then, a rAF loop would be the one thing
  // running (the readout keeps its dash).
  useEffect(() => {
    if (!isSectionVisible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frames = 0;
    let sampleStart = performance.now();
    let frameId = requestAnimationFrame(function tick(now) {
      frames += 1;
      const elapsed = now - sampleStart;
      if (elapsed > STALE_SAMPLE_MS) {
        frames = 0;
        sampleStart = now;
      } else if (elapsed >= 1000) {
        if (fpsRef.current)
          fpsRef.current.textContent = String(Math.round((frames * 1000) / elapsed));
        frames = 0;
        sampleStart = now;
      }
      frameId = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frameId);
  }, [isSectionVisible]);

  return (
    <div className={styles.welcomeHeroSpecHeaderStyles}>
      <span aria-hidden="true" className={styles.welcomeHeroSpecHeaderEntryStyles}>
        {HERO_SPEC_ENTRY_FILE}
      </span>
      <ToggleButtonGroup
        aria-label="Highlight the annotations a source file sets"
        selectionMode="single"
        selectedKeys={file ? [file] : []}
        onSelectionChange={(keys) => {
          const [next] = keys;
          onFileChange(isHeroSpecFileId(next) ? next : null);
        }}
        className={styles.welcomeHeroSpecHeaderTabsStyles}
      >
        {HERO_SPEC_FILES.map(({ id, label }) => (
          <ToggleButton key={id} id={id} className={styles.welcomeHeroSpecHeaderTabStyles}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <span aria-hidden="true" className={styles.welcomeHeroSpecHeaderReadoutStyles}>
        <span className={styles.welcomeHeroSpecHeaderRendererStyles}>
          <span className={styles.welcomeHeroSpecHeaderDotStyles}>●</span>
          {RENDERER_LABEL[renderer]}
        </span>
        <span className={styles.welcomeHeroSpecHeaderFpsStyles}>
          <span ref={fpsRef}>—</span> fps
        </span>
      </span>
    </div>
  );
}
