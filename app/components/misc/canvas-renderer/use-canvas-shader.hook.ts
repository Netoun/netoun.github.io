import { useEffect, useRef, useState } from "react";
import type { RendererType, ShaderBundle, Uniforms } from "./canvas-renderer.types";
import { createCanvasRenderer } from "./create-canvas-renderer";

export interface UseShaderCanvasOptions {
  animate?: boolean;
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
  const sessionRef = useRef<Awaited<ReturnType<typeof createCanvasRenderer>> | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    const { disabled, uniforms, ...rendererOpts } = optionsRef.current;
    if (!canvas || disabled) return;

    let cancelled = false;

    createCanvasRenderer(canvas, shader, {
      ...rendererOpts,
      uniforms,
      onReady(r) {
        if (cancelled) return;
        setType(r);
        rendererOpts.onReady?.(r);
      },
    }).then((session) => {
      if (cancelled) {
        session.destroy();
        return;
      }
      sessionRef.current = session;
    });

    return () => {
      cancelled = true;
      sessionRef.current?.destroy();
      sessionRef.current = null;
    };
  }, [
    canvasRef,
    shader.vertexGLSL,
    shader.fragmentGLSL,
    shader.webgpuWGSL,
    optionsRef.current.disabled,
  ]);

  useEffect(() => {
    const session = sessionRef.current;
    const { uniforms } = options;
    if (!session || !uniforms) return;
    session.updateUniforms(uniforms);
  }, [options.uniforms]);

  return { type };
}
