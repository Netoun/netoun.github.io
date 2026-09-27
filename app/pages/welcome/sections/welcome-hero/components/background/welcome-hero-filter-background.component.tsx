import { memo } from "react";
import { MeshBackgroundCanvas } from "@/components/misc/mesh-background/mesh-background-canvas.component";
import {
  SHADER_CONFIG,
  getShaderQuality,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./welcome-hero-filter-background.css";

const getHeroShaderQuality = () => getShaderQuality() * SHADER_CONFIG.heroQualityMultiplier;

export const WelcomeHeroFilterBackground = memo(function WelcomeHeroFilterBackground() {
  return (
    <div className={styles.welcomeMeshContainerStyles}>
      <MeshBackgroundCanvas
        quality={getHeroShaderQuality}
        animate={false}
        animateOnScroll
        className={styles.welcomeShaderCanvasStyles}
        debounceResize={200}
        respectReducedMotion={false}
        respectVisibility
      />
    </div>
  );
});
