import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import type { RendererType } from "@/components/misc/canvas-renderer/canvas-renderer.types";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import {
  type MeshCompositionWindow,
  FRAGMENT_SHADER,
  SHADER_CONFIG,
  VERTEX_SHADER,
  WEBGPU_SHADER,
  buildMeshFragmentShader,
  buildMeshWebGPUShader,
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
  /**
   * Start the GPU session only once the canvas comes within this margin of the viewport
   * (an IntersectionObserver `rootMargin`), not at hydration. Default: at mount.
   */
  armMargin?: string;
  /** Render only this window of the composition (default: all of it). Read once, at mount. */
  compositionWindow?: MeshCompositionWindow;
  /** Called once with the renderer that won (`svg` = no GPU, the caller's CSS fallback shows). */
  onRendererReady?: (type: RendererType) => void;
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
  armMargin,
  compositionWindow,
  onRendererReady,
}: MeshBackgroundCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [armed, setArmed] = useState(
    () => armMargin === undefined || typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || armed || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setArmed(true);
      },
      { rootMargin: armMargin },
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [armed, armMargin]);

  // Callers pass a module constant; the bundle's strings key the GPU session.
  const shader = useMemo(
    () =>
      compositionWindow
        ? {
            vertexGLSL: VERTEX_SHADER,
            fragmentGLSL: buildMeshFragmentShader(compositionWindow),
            webgpuWGSL: buildMeshWebGPUShader(compositionWindow),
          }
        : meshShader,
    [compositionWindow],
  );
  // Latest quality for the renderer's frame loop, without re-creating the GPU session.
  const qualityRef = useRef(quality);
  useLayoutEffect(() => {
    qualityRef.current = quality;
  });

  const { type } = useShaderCanvas(canvasRef, shader, {
    animate,
    animateOnScroll,
    disabled: !armed,
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
    onReady: onRendererReady,
  });

  if (type === "svg") return null;

  return (
    <canvas ref={canvasRef} className={clsx(styles.meshCanvas, className)} aria-hidden="true" />
  );
}

export const MeshBackgroundCanvas = memo(MeshBackgroundCanvasComponent);
