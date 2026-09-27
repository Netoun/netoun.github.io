import { memo, useRef } from "react";
import {
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  GRAIN_CONFIG,
} from "@/components/misc/shaders/grain/grain.shader";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import * as styles from "./body-grain-overlay.css";

const bodyGrainShader = {
  vertexGLSL: VERTEX_SHADER,
  fragmentGLSL: FRAGMENT_SHADER,
} as const;

function BodyGrainOverlayComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useShaderCanvas(canvasRef, bodyGrainShader, {
    animate: false,
    powerPreference: "low-power",
    renderScale: {
      min: GRAIN_CONFIG.minRenderScale,
      max: GRAIN_CONFIG.maxRenderScale,
    },
  });

  return <canvas ref={canvasRef} className={styles.bodyGrainOverlayStyles} aria-hidden="true" />;
}

export const BodyGrainOverlay = memo(BodyGrainOverlayComponent);
