import { memo, useEffect, useId, useState } from "react";
import { MousePathCanvas } from "@/components/misc/mouse-path-canvas/mouse-path-canvas.component";
import { ClientOnly } from "@/components/primitives/client-only/client-only.component";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import * as styles from "./welcome-hero-filter-background.css";

const MESH_SHAPES = [
  {
    id: "mesh-1",
    d: "M25.5 -31.1C31.3 -25.6 33 -15.8 33.4 -6.8C33.9 2.2 33.1 10.4 29.3 16.7C25.4 23.1 18.5 27.4 11 30.3C3.4 33.1 -4.8 34.3 -11.4 31.7C-18 29.1 -23 22.6 -28.9 15.3C-34.8 7.9 -41.6 -0.3 -40.3 -7C-39 -13.7 -29.6 -18.9 -21.5 -24C-13.5 -29 -6.7 -34 1.6 -35.9C9.9 -37.8 19.8 -36.5 25.5 -31.1Z",
    viewBox: "-50 -50 100 100",
    style: { top: "0%", left: "0%", width: "55%", height: "50%" },
    pathIndex: 1,
  },
  {
    id: "mesh-2",
    d: "M8.5,-5.6C14.5,-2.5,25.3,-1.3,25.5,0.2C25.8,1.8,15.5,3.5,9.5,6.2C3.5,8.9,1.8,12.5,-4.3,16.8C-10.4,21.1,-20.7,26.1,-24.1,23.4C-27.4,20.7,-23.8,10.4,-21.7,2.1C-19.6,-6.1,-19,-12.3,-15.6,-15.3C-12.3,-18.4,-6.1,-18.3,-2.4,-15.9C1.3,-13.5,2.5,-8.6,8.5,-5.6Z",
    viewBox: "-50 -30 100 100",
    style: { bottom: "0", left: "0%", width: "20%", height: "30%" },
    pathIndex: 2,
  },
  {
    id: "mesh-3",
    d: "M649 279 847 298 871 427 712 390Z",
    viewBox: "599 229 322 248",
    style: { top: "40%", left: "50%", width: "35%", height: "55%" },
    pathIndex: 3,
  },
] as const;

const SHADER_CONFIG = {
  animationSpeed: 0.06,
  filmGrainFlickerBase: 0.98,
  filmGrainFlickerRange: 0.02,
  filmGrainJitter: 5.9,
  filmGrainStrength: 0.21,
  blob1: {
    centerX: 0.16,
    centerY: 0.14,
    moveX: 0.012,
    moveY: 0.01,
    speedX: 0.9,
    speedY: 0.8,
    scaleX: 0.28,
    scaleY: 0.24,
    softness: 3.6,
    color: [0.97, 0.78, 0.28],
    intensity: 0.26,
  },
  blob2: {
    centerX: 0.1,
    centerY: 0.8,
    moveX: 0.012,
    moveY: 0.01,
    speedX: 1.1,
    speedY: 0.7,
    scaleX: 0.14,
    scaleY: 0.17,
    softness: 4.2,
    color: [0.33, 0.84, 0.56],
    intensity: 0.33,
  },
  blob3: {
    centerX: 0.7,
    centerY: 0.62,
    moveX: 0.014,
    moveY: 0.012,
    speedX: 0.6,
    speedY: 1,
    scaleX: 0.23,
    scaleY: 0.29,
    softness: 4,
    color: [0.79, 0.29, 0.88],
    intensity: 0.31,
  },
  vignetteStart: 0.38,
  vignetteEnd: 0.92,
  vignetteBase: 0.72,
  vignetteStrength: 0.28,
  baseColor: [0.02, 0.03, 0.05],
  maxDevicePixelRatio: 2,
  defaultQuality: 0.7,
  highQuality: 1,
  webgpuInitTimeoutMs: 250,
} as const;

const toGlslFloat = (value: number) => value.toFixed(8).replace(/0+$/, "").replace(/\.$/, ".0");
const toWgslFloat = toGlslFloat;

const glslVec3 = (value: readonly [number, number, number]) =>
  `vec3(${value.map(toGlslFloat).join(", ")})`;

const wgslVec3 = (value: readonly [number, number, number]) =>
  `vec3f(${value.map(toWgslFloat).join(", ")})`;

const normalizeSvgId = (id: string) => id.replace(/:/g, "-");

interface SharedSvgIds {
  meshBlurId: string;
  noiseId: string;
}

const SharedDefsSVG = memo(function SharedDefsSVG({ meshBlurId, noiseId }: SharedSvgIds) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      style={{ position: "absolute", visibility: "hidden" }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id={meshBlurId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
        </filter>

        <filter id={noiseId} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.26"
            result="turbulence"
            stitchTiles="stitch"
          />
          <feBlend in="SourceGraphic" in2="turbulence" mode="overlay" />
        </filter>
      </defs>
    </svg>
  );
});

type MeshShapeSVGProps = (typeof MESH_SHAPES)[number] & {
  meshBlurId: string;
};

const MeshShapeSVG = memo(function MeshShapeSVG({
  d,
  viewBox,
  style,
  pathIndex,
  meshBlurId,
}: MeshShapeSVGProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={styles.welcomeMeshShapeStyles}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={d}
        filter={`url(#${meshBlurId})`}
        data-mesh-index={pathIndex}
        className={styles.welcomeMeshGradientPathStyles}
      />
    </svg>
  );
});

const NoiseOverlaySVG = memo(function NoiseOverlaySVG({ noiseId }: Pick<SharedSvgIds, "noiseId">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      preserveAspectRatio="none"
      className={styles.welcomeNoiseOverlayStyles}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="0"
        y="0"
        width="1000"
        height="500"
        filter={`url(#${noiseId})`}
        fill="white"
        opacity="0.08"
      />
    </svg>
  );
});

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_quality;

const float ANIMATION_SPEED = ${toGlslFloat(SHADER_CONFIG.animationSpeed)};
const float FILM_GRAIN_FLICKER_BASE = ${toGlslFloat(SHADER_CONFIG.filmGrainFlickerBase)};
const float FILM_GRAIN_FLICKER_RANGE = ${toGlslFloat(SHADER_CONFIG.filmGrainFlickerRange)};
const float FILM_GRAIN_JITTER = ${toGlslFloat(SHADER_CONFIG.filmGrainJitter)};
const float FILM_GRAIN_STRENGTH = ${toGlslFloat(SHADER_CONFIG.filmGrainStrength)};

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float grainLayer(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float blob(vec2 uv, vec2 center, vec2 scale, float softness) {
  vec2 d = (uv - center) / scale;
  float dist = dot(d, d);
  return exp(-dist * softness);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time * ANIMATION_SPEED;

  vec2 c1 = vec2(
    ${toGlslFloat(SHADER_CONFIG.blob1.centerX)} + sin(t * ${toGlslFloat(SHADER_CONFIG.blob1.speedX)}) * ${toGlslFloat(SHADER_CONFIG.blob1.moveX)},
    ${toGlslFloat(SHADER_CONFIG.blob1.centerY)} + cos(t * ${toGlslFloat(SHADER_CONFIG.blob1.speedY)}) * ${toGlslFloat(SHADER_CONFIG.blob1.moveY)}
  );
  vec2 c2 = vec2(
    ${toGlslFloat(SHADER_CONFIG.blob2.centerX)} + cos(t * ${toGlslFloat(SHADER_CONFIG.blob2.speedX)}) * ${toGlslFloat(SHADER_CONFIG.blob2.moveX)},
    ${toGlslFloat(SHADER_CONFIG.blob2.centerY)} + sin(t * ${toGlslFloat(SHADER_CONFIG.blob2.speedY)}) * ${toGlslFloat(SHADER_CONFIG.blob2.moveY)}
  );
  vec2 c3 = vec2(
    ${toGlslFloat(SHADER_CONFIG.blob3.centerX)} + sin(t * ${toGlslFloat(SHADER_CONFIG.blob3.speedX)}) * ${toGlslFloat(SHADER_CONFIG.blob3.moveX)},
    ${toGlslFloat(SHADER_CONFIG.blob3.centerY)} + cos(t * ${toGlslFloat(SHADER_CONFIG.blob3.speedY)}) * ${toGlslFloat(SHADER_CONFIG.blob3.moveY)}
  );

  float m1 = blob(uv, c1, vec2(${toGlslFloat(SHADER_CONFIG.blob1.scaleX)}, ${toGlslFloat(SHADER_CONFIG.blob1.scaleY)}), ${toGlslFloat(SHADER_CONFIG.blob1.softness)});
  float m2 = blob(uv, c2, vec2(${toGlslFloat(SHADER_CONFIG.blob2.scaleX)}, ${toGlslFloat(SHADER_CONFIG.blob2.scaleY)}), ${toGlslFloat(SHADER_CONFIG.blob2.softness)});
  float m3 = blob(uv, c3, vec2(${toGlslFloat(SHADER_CONFIG.blob3.scaleX)}, ${toGlslFloat(SHADER_CONFIG.blob3.scaleY)}), ${toGlslFloat(SHADER_CONFIG.blob3.softness)});

  vec3 color = vec3(0.0);
  color += ${glslVec3(SHADER_CONFIG.blob1.color)} * m1 * ${toGlslFloat(SHADER_CONFIG.blob1.intensity)};
  color += ${glslVec3(SHADER_CONFIG.blob2.color)} * m2 * ${toGlslFloat(SHADER_CONFIG.blob2.intensity)};
  color += ${glslVec3(SHADER_CONFIG.blob3.color)} * m3 * ${toGlslFloat(SHADER_CONFIG.blob3.intensity)};

  float dist = distance(uv, vec2(0.5));
  float vignette = 1.0 - smoothstep(${toGlslFloat(SHADER_CONFIG.vignetteStart)}, ${toGlslFloat(SHADER_CONFIG.vignetteEnd)}, dist);
  color *= (${toGlslFloat(SHADER_CONFIG.vignetteBase)} + ${toGlslFloat(SHADER_CONFIG.vignetteStrength)} * vignette);

  color += ${glslVec3(SHADER_CONFIG.baseColor)};

  vec2 px = uv * u_resolution.xy;
  float flicker = FILM_GRAIN_FLICKER_BASE + sin(u_time * 1.8) * FILM_GRAIN_FLICKER_RANGE;
  vec2 jitter = vec2(
    noise(vec2(u_time * 0.45, 1.73)) - 0.5,
    noise(vec2(2.91, u_time * 0.45)) - 0.5
  ) * FILM_GRAIN_JITTER;
  float coarse = grainLayer((px + jitter) * 0.6);
  float mid = grainLayer((px + jitter) * 1.1 + vec2(17.0, 43.0));
  float fine = hash((px + jitter) * 2.7 + vec2(u_time * 41.0, u_time * 33.0));
  float filmGrain = ((coarse * 0.56 + mid * 0.29 + fine * 0.15) - 0.5) * flicker;
  color += filmGrain * (FILM_GRAIN_STRENGTH * u_quality);

  gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
`;

const WEBGPU_SHADER = `
struct VertexOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f };
struct Uniforms { resolution : vec2f, time : f32, quality : f32 };
@group(0) @binding(0) var<uniform> u : Uniforms;

const ANIMATION_SPEED : f32 = ${toWgslFloat(SHADER_CONFIG.animationSpeed)};
const FILM_GRAIN_FLICKER_BASE : f32 = ${toWgslFloat(SHADER_CONFIG.filmGrainFlickerBase)};
const FILM_GRAIN_FLICKER_RANGE : f32 = ${toWgslFloat(SHADER_CONFIG.filmGrainFlickerRange)};
const FILM_GRAIN_JITTER : f32 = ${toWgslFloat(SHADER_CONFIG.filmGrainJitter)};
const FILM_GRAIN_STRENGTH : f32 = ${toWgslFloat(SHADER_CONFIG.filmGrainStrength)};

@vertex
fn vsMain(@builtin(vertex_index) i : u32) -> VertexOut {
  var p = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0)
  );
  var out : VertexOut;
  out.pos = vec4f(p[i], 0.0, 1.0);
  out.uv = p[i] * 0.5 + vec2f(0.5);
  return out;
}

fn hash(p: vec2f) -> f32 { return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123); }
fn noise(p: vec2f) -> f32 {
  let i = floor(p); let f = fract(p); let v = f * f * (3.0 - 2.0 * f);
  let a = hash(i); let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0)); let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, v.x), mix(c, d, v.x), v.y);
}
fn grainLayer(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let v = f * f * (3.0 - 2.0 * f);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, v.x), mix(c, d, v.x), v.y);
}
fn blob(uv: vec2f, c: vec2f, s: vec2f, soft: f32) -> f32 {
  let d = (uv - c) / s;
  return exp(-dot(d, d) * soft);
}

@fragment
fn fsMain(in: VertexOut) -> @location(0) vec4f {
  let uv = in.uv;
  let t = u.time * ANIMATION_SPEED;
  let c1 = vec2f(
    ${toWgslFloat(SHADER_CONFIG.blob1.centerX)} + sin(t * ${toWgslFloat(SHADER_CONFIG.blob1.speedX)}) * ${toWgslFloat(SHADER_CONFIG.blob1.moveX)},
    ${toWgslFloat(SHADER_CONFIG.blob1.centerY)} + cos(t * ${toWgslFloat(SHADER_CONFIG.blob1.speedY)}) * ${toWgslFloat(SHADER_CONFIG.blob1.moveY)}
  );
  let c2 = vec2f(
    ${toWgslFloat(SHADER_CONFIG.blob2.centerX)} + cos(t * ${toWgslFloat(SHADER_CONFIG.blob2.speedX)}) * ${toWgslFloat(SHADER_CONFIG.blob2.moveX)},
    ${toWgslFloat(SHADER_CONFIG.blob2.centerY)} + sin(t * ${toWgslFloat(SHADER_CONFIG.blob2.speedY)}) * ${toWgslFloat(SHADER_CONFIG.blob2.moveY)}
  );
  let c3 = vec2f(
    ${toWgslFloat(SHADER_CONFIG.blob3.centerX)} + sin(t * ${toWgslFloat(SHADER_CONFIG.blob3.speedX)}) * ${toWgslFloat(SHADER_CONFIG.blob3.moveX)},
    ${toWgslFloat(SHADER_CONFIG.blob3.centerY)} + cos(t * ${toWgslFloat(SHADER_CONFIG.blob3.speedY)}) * ${toWgslFloat(SHADER_CONFIG.blob3.moveY)}
  );
  let m1 = blob(uv, c1, vec2f(${toWgslFloat(SHADER_CONFIG.blob1.scaleX)}, ${toWgslFloat(SHADER_CONFIG.blob1.scaleY)}), ${toWgslFloat(SHADER_CONFIG.blob1.softness)});
  let m2 = blob(uv, c2, vec2f(${toWgslFloat(SHADER_CONFIG.blob2.scaleX)}, ${toWgslFloat(SHADER_CONFIG.blob2.scaleY)}), ${toWgslFloat(SHADER_CONFIG.blob2.softness)});
  let m3 = blob(uv, c3, vec2f(${toWgslFloat(SHADER_CONFIG.blob3.scaleX)}, ${toWgslFloat(SHADER_CONFIG.blob3.scaleY)}), ${toWgslFloat(SHADER_CONFIG.blob3.softness)});
  var color = ${wgslVec3(SHADER_CONFIG.blob1.color)} * m1 * ${toWgslFloat(SHADER_CONFIG.blob1.intensity)}
    + ${wgslVec3(SHADER_CONFIG.blob2.color)} * m2 * ${toWgslFloat(SHADER_CONFIG.blob2.intensity)}
    + ${wgslVec3(SHADER_CONFIG.blob3.color)} * m3 * ${toWgslFloat(SHADER_CONFIG.blob3.intensity)};
  let dist = distance(uv, vec2f(0.5));
  let vig = 1.0 - smoothstep(${toWgslFloat(SHADER_CONFIG.vignetteStart)}, ${toWgslFloat(SHADER_CONFIG.vignetteEnd)}, dist);
  color *= (${toWgslFloat(SHADER_CONFIG.vignetteBase)} + ${toWgslFloat(SHADER_CONFIG.vignetteStrength)} * vig);
  color += ${wgslVec3(SHADER_CONFIG.baseColor)};
  let px = uv * u.resolution;
  let flicker = FILM_GRAIN_FLICKER_BASE + sin(u.time * 1.8) * FILM_GRAIN_FLICKER_RANGE;
  let jitter = vec2f(
    noise(vec2f(u.time * 0.45, 1.73)) - 0.5,
    noise(vec2f(2.91, u.time * 0.45)) - 0.5
  ) * FILM_GRAIN_JITTER;
  let coarse = grainLayer((px + jitter) * 0.6);
  let mid = grainLayer((px + jitter) * 1.1 + vec2f(17.0, 43.0));
  let fine = hash((px + jitter) * 2.7 + vec2f(u.time * 41.0, u.time * 33.0));
  let filmGrain = ((coarse * 0.56 + mid * 0.29 + fine * 0.15) - 0.5) * flicker;
  color += vec3f(filmGrain * (FILM_GRAIN_STRENGTH * u.quality));
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`;

type RendererType = "pending" | "webgpu" | "webgl" | "svg";

type NavigatorWithGpu = Navigator & {
  gpu?: GPU;
};

interface MinimalGPUCanvasContext {
  configure(options: {
    device: GPUDevice;
    format: GPUTextureFormat;
    alphaMode: "premultiplied";
  }): void;
  getCurrentTexture(): GPUTexture;
}

const GPU_BUFFER_USAGE = {
  COPY_DST: 0x0008,
  UNIFORM: 0x0040,
} as const;

function getShaderQuality() {
  return document.documentElement.dataset.quality === "high"
    ? SHADER_CONFIG.highQuality
    : SHADER_CONFIG.defaultQuality;
}

function getCanvasSize(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, SHADER_CONFIG.maxDevicePixelRatio);

  return {
    width: Math.max(1, Math.floor(rect.width * dpr)),
    height: Math.max(1, Math.floor(rect.height * dpr)),
  };
}

const MeshShaderBackground = memo(function MeshShaderBackground({
  meshBlurId,
  noiseId,
  disabled = false,
}: SharedSvgIds & { disabled?: boolean }) {
  const canvasRef = useState<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = canvasRef;
  const [renderer, setRenderer] = useState<RendererType>("pending");

  useEffect(() => {
    if (!canvas) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const commonSetup = (onMotionChange?: () => void) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reducedMotionRef = { current: mediaQuery.matches };
      const qualityValue = getShaderQuality();
      const handleMotion = () => {
        reducedMotionRef.current = mediaQuery.matches;
        onMotionChange?.();
      };

      mediaQuery.addEventListener("change", handleMotion);

      return {
        qualityValue,
        reducedMotionRef,
        dispose: () => mediaQuery.removeEventListener("change", handleMotion),
      };
    };

    const initWebGPU = async (shouldAbort: () => boolean) => {
      const gpu = (navigator as NavigatorWithGpu).gpu;
      if (!gpu || shouldAbort()) return null;

      const adapter = await gpu.requestAdapter({
        powerPreference: "high-performance",
      });
      if (!adapter || shouldAbort()) return null;

      const device = await adapter.requestDevice();
      if (shouldAbort()) {
        device.destroy();
        return null;
      }

      const context = canvas.getContext("webgpu") as MinimalGPUCanvasContext | null;
      if (!context || shouldAbort()) {
        device.destroy();
        return null;
      }

      const format = gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: "premultiplied" });

      const shader = device.createShaderModule({ code: WEBGPU_SHADER });

      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: shader, entryPoint: "vsMain" },
        fragment: {
          module: shader,
          entryPoint: "fsMain",
          targets: [{ format }],
        },
        primitive: { topology: "triangle-list" },
      });

      const uniformBuffer = device.createBuffer({
        size: 16,
        usage: GPU_BUFFER_USAGE.UNIFORM | GPU_BUFFER_USAGE.COPY_DST,
      });

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });

      let frameId = 0;
      let isRendering = false;
      const start = performance.now();

      const resize = () => {
        const { width, height } = getCanvasSize(canvas);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      };

      const render = (now: number) => {
        if (shouldAbort()) return;

        isRendering = true;
        const elapsed = common.reducedMotionRef.current ? 0 : (now - start) / 1000;

        device.queue.writeBuffer(
          uniformBuffer,
          0,
          new Float32Array([canvas.width, canvas.height, elapsed, common.qualityValue]),
        );

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              loadOp: "clear",
              storeOp: "store",
            },
          ],
        });

        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(6);
        pass.end();
        device.queue.submit([encoder.finish()]);

        if (!canvas.dataset.ready) {
          canvas.dataset.ready = "true";
        }

        if (common.reducedMotionRef.current) {
          isRendering = false;
          return;
        }

        frameId = window.requestAnimationFrame(render);
      };

      const startRendering = () => {
        if (!isRendering && !shouldAbort()) {
          frameId = window.requestAnimationFrame(render);
        }
      };

      const common = commonSetup(startRendering);

      resize();
      const resizeObserver = new ResizeObserver(() => {
        resize();
        startRendering();
      });
      resizeObserver.observe(canvas);
      window.addEventListener("resize", resize, { passive: true });

      startRendering();

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        common.dispose();
        device.destroy();
      };
    };

    const initWebGL = () => {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      });
      if (!gl) return null;

      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          if (import.meta.env.DEV) {
            console.warn(gl.getShaderInfoLog(shader));
          }
          gl.deleteShader(shader);
          return null;
        }

        return shader;
      };

      const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vertexShader || !fragmentShader) {
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        return null;
      }

      const program = gl.createProgram();
      if (!program) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        if (import.meta.env.DEV) {
          console.warn(gl.getProgramInfoLog(program));
        }
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();
      if (!positionBuffer) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
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
        return null;
      }

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      const timeLocation = gl.getUniformLocation(program, "u_time");
      const qualityLocation = gl.getUniformLocation(program, "u_quality");

      if (!resolutionLocation || !timeLocation || !qualityLocation) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      let frameId = 0;
      let isRendering = false;
      const start = performance.now();

      const resize = () => {
        const { width, height } = getCanvasSize(canvas);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform2f(resolutionLocation, width, height);
        gl.uniform1f(qualityLocation, common.qualityValue);
      };

      const render = (now: number) => {
        if (cancelled) return;

        isRendering = true;
        const elapsed = common.reducedMotionRef.current ? 0 : (now - start) / 1000;
        gl.uniform1f(timeLocation, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        if (!canvas.dataset.ready) {
          canvas.dataset.ready = "true";
        }

        if (common.reducedMotionRef.current) {
          isRendering = false;
          return;
        }

        frameId = window.requestAnimationFrame(render);
      };

      const startRendering = () => {
        if (!isRendering && !cancelled) {
          frameId = window.requestAnimationFrame(render);
        }
      };

      const common = commonSetup(startRendering);

      resize();
      const resizeObserver = new ResizeObserver(() => {
        resize();
        startRendering();
      });
      resizeObserver.observe(canvas);
      window.addEventListener("resize", resize, { passive: true });

      startRendering();

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        common.dispose();
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      };
    };

    const init = async () => {
      let webgpuTimedOut = false;
      let rendererType: RendererType | null = null;
      let rendererCleanup: (() => void) | null = null;

      try {
        const gpuCleanup = await Promise.race<Awaited<ReturnType<typeof initWebGPU>>>([
          initWebGPU(() => cancelled || webgpuTimedOut),
          new Promise<null>((resolve) => {
            window.setTimeout(() => {
              webgpuTimedOut = true;
              resolve(null);
            }, SHADER_CONFIG.webgpuInitTimeoutMs);
          }),
        ]);

        if (!cancelled && gpuCleanup) {
          rendererType = "webgpu";
          rendererCleanup = gpuCleanup;
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("WebGPU background initialization failed", error);
        }
      }

      if (!rendererType) {
        const glCleanup = initWebGL();
        if (!cancelled && glCleanup) {
          rendererType = "webgl";
          rendererCleanup = glCleanup;
        }
      }

      if (!rendererType && !cancelled) {
        rendererType = "svg";
      }

      if (rendererType) {
        setRenderer(rendererType);
        cleanup = rendererCleanup;
      }
    };

    void init();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [canvas]);

  if (disabled) {
    return null;
  }

  return (
    <div className={styles.welcomeMeshContainerStyles}>
      {MESH_SHAPES.map((mesh) => (
        <MeshShapeSVG key={mesh.id} {...mesh} meshBlurId={meshBlurId} />
      ))}
      <NoiseOverlaySVG noiseId={noiseId} />
      {renderer !== "svg" && (
        <canvas ref={setCanvas} className={styles.welcomeShaderCanvasStyles} aria-hidden="true" />
      )}
    </div>
  );
});

interface WelcomeHeroFilterBackgroundProps {
  container: HTMLElement | null;
  mousePosition: MousePosition;
  disabled?: boolean;
}

function WelcomeHeroFilterBackgroundComponent({
  container,
  mousePosition,
  disabled = false,
}: WelcomeHeroFilterBackgroundProps) {
  const [shouldMountMousePath, setShouldMountMousePath] = useState(false);
  const svgId = normalizeSvgId(useId());
  const meshBlurId = `${svgId}-mesh-blur`;
  const noiseId = `${svgId}-noise`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShouldMountMousePath(true);
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <SharedDefsSVG meshBlurId={meshBlurId} noiseId={noiseId} />

      <ClientOnly>
        {shouldMountMousePath && container ? (
          <MousePathCanvas
            key={container.id || "mouse-path"}
            container={container}
            mousePosition={mousePosition}
            disabled={disabled}
          />
        ) : null}
      </ClientOnly>

      <MeshShaderBackground meshBlurId={meshBlurId} noiseId={noiseId} disabled={disabled} />
    </>
  );
}

export const WelcomeHeroFilterBackground = WelcomeHeroFilterBackgroundComponent;
