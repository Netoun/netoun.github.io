import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import {
  FILM_GRAIN_FRAGMENT_SHADER,
  GRAIN_CONFIG,
  GRAIN_TILE,
  VERTEX_SHADER,
} from "@/components/misc/shaders/grain/grain.shader";
import * as styles from "./grain-canvas.css";

export interface GrainCanvasProps {
  /** Alpha at full weight (the page's is 0.05). */
  strength?: number;
  gamma?: number;
  /** Alpha levels; 0 keeps the weight unquantised. */
  steps?: number;
  /** Tints lighten and darken at full weight. */
  xray?: boolean;
}

const grainShader = {
  vertexGLSL: VERTEX_SHADER,
  fragmentGLSL: FILM_GRAIN_FRAGMENT_SHADER,
} as const;

/** The page's film grain drawn live in WebGL, one cell per physical pixel. */
function GrainCanvasComponent({
  strength = GRAIN_CONFIG.filmGrainStrength,
  gamma = GRAIN_CONFIG.filmGrainGamma,
  steps = GRAIN_TILE.alphaSteps,
  xray = false,
}: GrainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The tile the page would pick: @2x from a pixel ratio above 1, which holds twice the cells.
  const [tileScale, setTileScale] = useState(1);

  useEffect(() => {
    const retina = window.matchMedia("(min-resolution: 1.01dppx)");
    const update = () => setTileScale(retina.matches ? 2 : 1);
    update();
    retina.addEventListener("change", update);
    return () => retina.removeEventListener("change", update);
  }, []);

  const uniforms = useMemo(
    () => ({
      u_strength: strength,
      u_gamma: gamma,
      u_steps: steps,
      u_period: GRAIN_TILE.size * tileScale,
      u_xray: xray ? 1 : 0,
    }),
    [strength, gamma, steps, tileScale, xray],
  );

  useShaderCanvas(canvasRef, grainShader, {
    animate: false,
    uniforms,
    powerPreference: "low-power",
    renderScale: { min: GRAIN_CONFIG.minRenderScale, max: GRAIN_CONFIG.maxRenderScale },
  });

  return <canvas ref={canvasRef} className={styles.grainCanvas} aria-hidden="true" />;
}

export const GrainCanvas = memo(GrainCanvasComponent);
