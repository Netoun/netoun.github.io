import { memo, useRef } from "react";
import { VERTEX_SHADER, GRAIN_CONFIG } from "@/components/misc/shaders/grain/grain.shader";
import { useShaderCanvas } from "@/components/misc/canvas-renderer/use-canvas-shader.hook";
import * as styles from "./grain-canvas.css";

export interface GrainCanvasProps {
  grainAlpha?: number;
  baseAlpha?: number;
}

const GRAIN_FRAGMENT_SHADER = `precision mediump float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_baseAlpha;
uniform float u_grainAlpha;

const float COARSE_SCALE = 2.4;
const float MID_SCALE = 4.8;
const float FINE_SCALE = 9.0;

const float COARSE_WEIGHT = 0.4;
const float MID_WEIGHT = 0.35;
const float FINE_WEIGHT = 0.25;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  vec2 px = v_uv * u_resolution;

  float coarse = valueNoise(px * COARSE_SCALE);
  float mid = valueNoise(px * MID_SCALE + vec2(17.0, 43.0));
  float fine = hash12(floor(px * FINE_SCALE));

  float grain =
    coarse * COARSE_WEIGHT +
    mid * MID_WEIGHT +
    fine * FINE_WEIGHT -
    0.5;

  float alpha = u_baseAlpha + grain * u_grainAlpha;

  gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(alpha, 0.0, 1.0));
}
`;

const grainShader = {
  vertexGLSL: VERTEX_SHADER,
  fragmentGLSL: GRAIN_FRAGMENT_SHADER,
} as const;

function GrainCanvasComponent({ grainAlpha, baseAlpha }: GrainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resolvedBase = baseAlpha ?? GRAIN_CONFIG.baseAlpha;
  const resolvedGrain = grainAlpha ?? GRAIN_CONFIG.grainAlpha;

  useShaderCanvas(canvasRef, grainShader, {
    animate: false,
    uniforms: {
      u_baseAlpha: resolvedBase,
      u_grainAlpha: resolvedGrain,
    },
    powerPreference: "low-power",
    renderScale: {
      min: GRAIN_CONFIG.minRenderScale,
      max: GRAIN_CONFIG.maxRenderScale,
    },
  });

  return <canvas ref={canvasRef} className={styles.grainCanvas} aria-hidden="true" />;
}

export const GrainCanvas = memo(GrainCanvasComponent);
