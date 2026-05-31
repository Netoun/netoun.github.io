import { memo, useEffect, useRef } from "react";
import { VERTEX_SHADER, GRAIN_CONFIG } from "@/components/misc/shaders/grain/grain.shader";
import * as styles from "./grain-canvas.css";

export interface GrainCanvasProps {
  /** Overall grain brightness overlay — defaults to GRAIN_CONFIG.grainAlpha (0.08). */
  grainAlpha?: number;
  /** Base (minimum) alpha of the grain layer — defaults to GRAIN_CONFIG.baseAlpha (0.03). */
  baseAlpha?: number;
}

// The fragment shader is identical to FRAGMENT_SHADER in grain.shader.ts,
// but BASE_ALPHA and GRAIN_ALPHA are exposed as uniforms so they can be
// changed at runtime without recompiling the program.
const GRAIN_FRAGMENT_SHADER = `
precision mediump float;

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

  // Demo component: clamp to the full [0,1] range so the sliders are
  // expressive. The production BodyGrainOverlay keeps its own subtle clamp.
  gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(alpha, 0.0, 1.0));
}
`;

/**
 * Reusable WebGL grain canvas that fills its positioned parent.
 * The parent must have `position: relative` (or absolute/fixed).
 * Grain appearance is controlled via `grainAlpha` and `baseAlpha` props.
 */
function GrainCanvasComponent({ grainAlpha, baseAlpha }: GrainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs for uniform locations so the resize/update path can reach them
  // without re-running the full effect.
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const resolutionLocRef = useRef<WebGLUniformLocation | null>(null);
  const baseAlphaLocRef = useRef<WebGLUniformLocation | null>(null);
  const grainAlphaLocRef = useRef<WebGLUniformLocation | null>(null);

  // Resolved alpha values (fall back to GRAIN_CONFIG defaults).
  const resolvedBase = baseAlpha ?? GRAIN_CONFIG.baseAlpha;
  const resolvedGrain = grainAlpha ?? GRAIN_CONFIG.grainAlpha;

  // Main WebGL setup — runs once on mount.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });

    if (!gl) return;

    // --- Compile helpers ---
    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("[GrainCanvas] shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, GRAIN_FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[GrainCanvas] program link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    // --- Fullscreen quad ---
    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    if (positionLocation === -1) {
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const baseAlphaLoc = gl.getUniformLocation(program, "u_baseAlpha");
    const grainAlphaLoc = gl.getUniformLocation(program, "u_grainAlpha");

    if (!resolutionLoc || !baseAlphaLoc || !grainAlphaLoc) {
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    // Store refs so sibling effects can reach them without re-compiling.
    glRef.current = gl;
    resolutionLocRef.current = resolutionLoc;
    baseAlphaLocRef.current = baseAlphaLoc;
    grainAlphaLocRef.current = grainAlphaLoc;

    // --- Draw ---
    const render = (base: number, grain: number) => {
      const { offsetWidth: w, offsetHeight: h } = canvas.parentElement ?? canvas;
      const dpr = Math.min(
        Math.max(window.devicePixelRatio || 1, GRAIN_CONFIG.minRenderScale),
        GRAIN_CONFIG.maxRenderScale,
      );
      const width = Math.max(1, Math.floor(w * dpr));
      const height = Math.max(1, Math.floor(h * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLoc, width, height);
      gl.uniform1f(baseAlphaLoc, base);
      gl.uniform1f(grainAlphaLoc, grain);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Read current prop values via closure-safe accessor stored on canvas element.
    // We use a simple callback ref pattern to avoid stale closures.
    const getAlphas = () => ({
      base: canvasRef.current?.__grainBase ?? GRAIN_CONFIG.baseAlpha,
      grain: canvasRef.current?.__grainAlpha ?? GRAIN_CONFIG.grainAlpha,
    });

    const onResize = () => {
      const { base, grain } = getAlphas();
      render(base, grain);
    };

    // Initial draw with current defaults.
    render(GRAIN_CONFIG.baseAlpha, GRAIN_CONFIG.grainAlpha);

    const observer = new ResizeObserver(onResize);
    observer.observe(canvas.parentElement ?? canvas);

    return () => {
      observer.disconnect();
      glRef.current = null;
      resolutionLocRef.current = null;
      baseAlphaLocRef.current = null;
      grainAlphaLocRef.current = null;
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update uniforms + redraw whenever alpha props change (no recompile needed).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Store current values on the element so the ResizeObserver closure can read them.
    canvas.__grainBase = resolvedBase;
    canvas.__grainAlpha = resolvedGrain;

    const gl = glRef.current;
    const baseLoc = baseAlphaLocRef.current;
    const grainLoc = grainAlphaLocRef.current;
    const resLoc = resolutionLocRef.current;

    if (!gl || !baseLoc || !grainLoc || !resLoc) return;

    const { offsetWidth: w, offsetHeight: h } = canvas.parentElement ?? canvas;
    const dpr = Math.min(
      Math.max(window.devicePixelRatio || 1, GRAIN_CONFIG.minRenderScale),
      GRAIN_CONFIG.maxRenderScale,
    );
    const width = Math.max(1, Math.floor(w * dpr));
    const height = Math.max(1, Math.floor(h * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    gl.viewport(0, 0, width, height);
    gl.uniform2f(resLoc, width, height);
    gl.uniform1f(baseLoc, resolvedBase);
    gl.uniform1f(grainLoc, resolvedGrain);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, [resolvedBase, resolvedGrain]);

  return <canvas ref={canvasRef} className={styles.grainCanvas} aria-hidden="true" />;
}

export const GrainCanvas = memo(GrainCanvasComponent);

// Augment HTMLCanvasElement to store alpha values accessible by the ResizeObserver closure.
declare global {
  interface HTMLCanvasElement {
    __grainBase?: number;
    __grainAlpha?: number;
  }
}
