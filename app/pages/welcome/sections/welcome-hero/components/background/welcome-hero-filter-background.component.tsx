import { memo, useRef } from "react";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import { useHeroAnimation } from "../../orchestrator/hero-animation.context";
import {
  SHADER_CONFIG,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  WEBGPU_SHADER,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./welcome-hero-filter-background.css";

const heroShader = {
  vertexGLSL: VERTEX_SHADER,
  fragmentGLSL: FRAGMENT_SHADER,
  webgpuWGSL: WEBGPU_SHADER,
} as const;

function getShaderQuality() {
  const quality = typeof document !== "undefined" && document.documentElement.dataset.quality;
  return quality === "high" ? SHADER_CONFIG.highQuality : SHADER_CONFIG.defaultQuality;
}

function getHeroRenderScale() {
  const quality = typeof document !== "undefined" && document.documentElement.dataset.quality;
  const maxScale =
    quality === "high" ? SHADER_CONFIG.maxRenderScaleHigh : SHADER_CONFIG.maxRenderScale;
  return { min: SHADER_CONFIG.minRenderScale, max: maxScale };
}

export const WelcomeHeroFilterBackground = memo(function WelcomeHeroFilterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orchestrator = useHeroAnimation();
  const disabled = !orchestrator.getState().shouldAnimate;

  const { type } = useShaderCanvas(canvasRef, heroShader, {
    animate: false,
    debounceResize: 200,
    quality: getShaderQuality,
    renderScale: getHeroRenderScale(),
    respectReducedMotion: true,
    respectVisibility: true,
    webgpuTimeout: SHADER_CONFIG.webgpuInitTimeoutMs,
    disabled,
  });

  if (disabled || type === "svg") return null;

  return (
    <div className={styles.welcomeMeshContainerStyles}>
      <canvas ref={canvasRef} className={styles.welcomeShaderCanvasStyles} aria-hidden="true" />
    </div>
  );
});
