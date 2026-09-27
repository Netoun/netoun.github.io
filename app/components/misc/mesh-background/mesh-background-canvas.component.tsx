import { memo, useRef } from "react";
import clsx from "clsx";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import {
  FRAGMENT_SHADER,
  SHADER_CONFIG,
  VERTEX_SHADER,
  WEBGPU_SHADER,
  getShaderQuality,
  getShaderRenderScale,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./mesh-background-canvas.css";

const meshShader = {
  vertexGLSL: VERTEX_SHADER,
  fragmentGLSL: FRAGMENT_SHADER,
  webgpuWGSL: WEBGPU_SHADER,
} as const;

export interface MeshBackgroundCanvasProps {
  quality?: number | (() => number);
  animate?: boolean;
  animateOnScroll?: boolean;
  className?: string;
  debounceResize?: number;
  powerPreference?: "high-performance" | "low-power";
  respectReducedMotion?: boolean;
  respectVisibility?: boolean;
}

function MeshBackgroundCanvasComponent({
  quality = getShaderQuality,
  animate = true,
  animateOnScroll = false,
  className,
  debounceResize,
  powerPreference = "low-power",
  respectReducedMotion,
  respectVisibility,
}: MeshBackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qualityRef = useRef(quality);
  qualityRef.current = quality;

  const { type } = useShaderCanvas(canvasRef, meshShader, {
    animate,
    animateOnScroll,
    debounceResize,
    quality: () => {
      const currentQuality = qualityRef.current;
      return typeof currentQuality === "function" ? currentQuality() : currentQuality;
    },
    powerPreference,
    renderScale: getShaderRenderScale(),
    respectReducedMotion,
    respectVisibility,
    webgpuTimeout: SHADER_CONFIG.webgpuInitTimeoutMs,
  });

  if (type === "svg") return null;

  return (
    <canvas ref={canvasRef} className={clsx(styles.meshCanvas, className)} aria-hidden="true" />
  );
}

export const MeshBackgroundCanvas = memo(MeshBackgroundCanvasComponent);
