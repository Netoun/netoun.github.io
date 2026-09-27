import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type {
  RendererSession,
  RendererType,
  ShaderBundle,
  Uniforms,
} from "./canvas-renderer.types";
import { createCanvasRenderer } from "./create-canvas-renderer";

export interface UseShaderCanvasOptions {
  animate?: boolean;
  animateOnScroll?: boolean;
  debounceResize?: number;
  respectReducedMotion?: boolean;
  respectVisibility?: boolean;
  powerPreference?: "high-performance" | "low-power";
  webgpuTimeout?: number;
  renderScale?: { min: number; max: number };
  quality?: () => number;
  uniforms?: Uniforms;
  disabled?: boolean;
  onReady?: (type: RendererType) => void;
}

export function useShaderCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  shader: ShaderBundle,
  options: UseShaderCanvasOptions = {},
): { type: RendererType } {
  const [type, setType] = useState<RendererType>("pending");
  const sessionRef = useRef<RendererSession | null>(null);

  // Latest options for the async renderer, without re-creating the GPU session.
  const optionsRef = useRef(options);
  useLayoutEffect(() => {
    optionsRef.current = options;
  });

  const { disabled, uniforms } = options;
  const { vertexGLSL, fragmentGLSL, webgpuWGSL } = shader;

  // One renderer session per shader source. Other options are read once, at creation.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    const {
      disabled: _disabled,
      onReady: _onReady,
      uniforms: initialUniforms,
      ...rendererOptions
    } = optionsRef.current;
    let cancelled = false;

    createCanvasRenderer(
      canvas,
      { vertexGLSL, fragmentGLSL, webgpuWGSL },
      {
        ...rendererOptions,
        uniforms: initialUniforms,
        onReady(rendererType) {
          if (cancelled) return;
          setType(rendererType);
          optionsRef.current.onReady?.(rendererType);
        },
      },
    ).then((session) => {
      if (cancelled) {
        session.destroy();
        return;
      }
      sessionRef.current = session;
      // Uniforms may have changed while the renderer was initialising.
      const latestUniforms = optionsRef.current.uniforms;
      if (latestUniforms && latestUniforms !== initialUniforms) {
        session.updateUniforms(latestUniforms);
      }
    });

    return () => {
      cancelled = true;
      sessionRef.current?.destroy();
      sessionRef.current = null;
    };
  }, [canvasRef, vertexGLSL, fragmentGLSL, webgpuWGSL, disabled]);

  useEffect(() => {
    if (uniforms) sessionRef.current?.updateUniforms(uniforms);
  }, [uniforms]);

  return { type };
}
