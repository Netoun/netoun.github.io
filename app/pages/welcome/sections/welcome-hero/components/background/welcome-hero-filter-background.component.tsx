import { memo } from "react";
import type { RendererType } from "@/components/misc/canvas-renderer/canvas-renderer.types";
import { MeshBackgroundCanvas } from "@/components/misc/mesh-background/mesh-background-canvas.component";
import {
  type MeshCompositionWindow,
  SHADER_CONFIG,
  getShaderQuality,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./welcome-hero-filter-background.css";

const getHeroShaderQuality = () => getShaderQuality() * SHADER_CONFIG.heroQualityMultiplier;

// The hero shows the lower-left two thirds of the mesh composition (gold low
// left, violet high right). A canvas at 150 % × 150 % of the frame would clip and
// pay 2.25x the fragments and GPU memory for pixels nobody sees.
const HERO_COMPOSITION_WINDOW: MeshCompositionWindow = {
  scale: [2 / 3, 2 / 3],
  offset: [0, 0],
};

interface WelcomeHeroFilterBackgroundProps {
  /** Reports which renderer paints the mesh (the spec header prints it). Keep it stable. */
  onRendererReady?: (type: RendererType) => void;
}

export const WelcomeHeroFilterBackground = memo(function WelcomeHeroFilterBackground({
  onRendererReady,
}: WelcomeHeroFilterBackgroundProps) {
  return (
    <div className={styles.welcomeMeshContainerStyles}>
      {/* Drawn once, then on resize only: the morph and the laptop carry the
          motion, so the mesh no longer repaints the whole hero on every scroll frame. */}
      <MeshBackgroundCanvas
        quality={getHeroShaderQuality}
        animate={false}
        compositionWindow={HERO_COMPOSITION_WINDOW}
        className={styles.welcomeShaderCanvasStyles}
        debounceResize={200}
        respectVisibility
        onRendererReady={onRendererReady}
      />
    </div>
  );
});
