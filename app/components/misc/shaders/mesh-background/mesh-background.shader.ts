const toGlslFloat = (value: number) => value.toFixed(8).replace(/0+$/, "").replace(/\.$/, ".0");
const toWgslFloat = toGlslFloat;

const glslVec3 = (value: readonly [number, number, number]) =>
  `vec3(${value.map(toGlslFloat).join(", ")})`;

const wgslVec3 = (value: readonly [number, number, number]) =>
  `vec3f(${value.map(toWgslFloat).join(", ")})`;

const square = (value: number) => value * value;

export const SHADER_CONFIG = {
  animationSpeed: 0.06,

  // Grain beaucoup moins cher.
  filmGrainFlickerBase: 0.98,
  filmGrainFlickerRange: 0.02,
  filmGrainStrength: 0.16,

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
    color: [0.97, 0.78, 0.28] as const,
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
    color: [0.33, 0.84, 0.56] as const,
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
    color: [0.79, 0.29, 0.88] as const,
    intensity: 0.31,
  },

  vignetteStart: 0.38,
  vignetteEnd: 0.92,
  vignetteBase: 0.72,
  vignetteStrength: 0.28,
  baseColor: [0.02, 0.03, 0.05] as const,

  // Gros gain FPS sur retina.
  // Si c'est trop flou, mets 1.25 ou 1.5.
  maxDevicePixelRatio: 1,

  defaultQuality: 0.45,
  highQuality: 0.75,
  webgpuInitTimeoutMs: 250,
} as const;

export const VERTEX_SHADER = `
attribute vec2 a_position;

varying vec2 v_uv;
varying vec2 v_c1;
varying vec2 v_c2;
varying vec2 v_c3;

uniform float u_time;

const float ANIMATION_SPEED = ${toGlslFloat(SHADER_CONFIG.animationSpeed)};

void main() {
  float t = u_time * ANIMATION_SPEED;

  v_uv = a_position * 0.5 + 0.5;

  v_c1 = vec2(
    ${toGlslFloat(SHADER_CONFIG.blob1.centerX)} + sin(t * ${toGlslFloat(SHADER_CONFIG.blob1.speedX)}) * ${toGlslFloat(SHADER_CONFIG.blob1.moveX)},
    ${toGlslFloat(SHADER_CONFIG.blob1.centerY)} + cos(t * ${toGlslFloat(SHADER_CONFIG.blob1.speedY)}) * ${toGlslFloat(SHADER_CONFIG.blob1.moveY)}
  );

  v_c2 = vec2(
    ${toGlslFloat(SHADER_CONFIG.blob2.centerX)} + cos(t * ${toGlslFloat(SHADER_CONFIG.blob2.speedX)}) * ${toGlslFloat(SHADER_CONFIG.blob2.moveX)},
    ${toGlslFloat(SHADER_CONFIG.blob2.centerY)} + sin(t * ${toGlslFloat(SHADER_CONFIG.blob2.speedY)}) * ${toGlslFloat(SHADER_CONFIG.blob2.moveY)}
  );

  v_c3 = vec2(
    ${toGlslFloat(SHADER_CONFIG.blob3.centerX)} + sin(t * ${toGlslFloat(SHADER_CONFIG.blob3.speedX)}) * ${toGlslFloat(SHADER_CONFIG.blob3.moveX)},
    ${toGlslFloat(SHADER_CONFIG.blob3.centerY)} + cos(t * ${toGlslFloat(SHADER_CONFIG.blob3.speedY)}) * ${toGlslFloat(SHADER_CONFIG.blob3.moveY)}
  );

  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
precision mediump float;

varying vec2 v_uv;
varying vec2 v_c1;
varying vec2 v_c2;
varying vec2 v_c3;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_quality;

const float FILM_GRAIN_FLICKER_BASE = ${toGlslFloat(SHADER_CONFIG.filmGrainFlickerBase)};
const float FILM_GRAIN_FLICKER_RANGE = ${toGlslFloat(SHADER_CONFIG.filmGrainFlickerRange)};
const float FILM_GRAIN_STRENGTH = ${toGlslFloat(SHADER_CONFIG.filmGrainStrength)};

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float blobFast(vec2 uv, vec2 center, vec2 invScale, float softness) {
  vec2 d = (uv - center) * invScale;
  float x = max(0.0, 1.0 - dot(d, d) * softness * 0.12);
  return x * x;
}

void main() {
  vec2 uv = v_uv;

  float m1 = blobFast(
    uv,
    v_c1,
    vec2(${toGlslFloat(1 / SHADER_CONFIG.blob1.scaleX)}, ${toGlslFloat(1 / SHADER_CONFIG.blob1.scaleY)}),
    ${toGlslFloat(SHADER_CONFIG.blob1.softness)}
  );

  float m2 = blobFast(
    uv,
    v_c2,
    vec2(${toGlslFloat(1 / SHADER_CONFIG.blob2.scaleX)}, ${toGlslFloat(1 / SHADER_CONFIG.blob2.scaleY)}),
    ${toGlslFloat(SHADER_CONFIG.blob2.softness)}
  );

  float m3 = blobFast(
    uv,
    v_c3,
    vec2(${toGlslFloat(1 / SHADER_CONFIG.blob3.scaleX)}, ${toGlslFloat(1 / SHADER_CONFIG.blob3.scaleY)}),
    ${toGlslFloat(SHADER_CONFIG.blob3.softness)}
  );

  vec3 color =
    ${glslVec3(SHADER_CONFIG.blob1.color)} * m1 * ${toGlslFloat(SHADER_CONFIG.blob1.intensity)} +
    ${glslVec3(SHADER_CONFIG.blob2.color)} * m2 * ${toGlslFloat(SHADER_CONFIG.blob2.intensity)} +
    ${glslVec3(SHADER_CONFIG.blob3.color)} * m3 * ${toGlslFloat(SHADER_CONFIG.blob3.intensity)};

  vec2 d = uv - vec2(0.5);
  float dist2 = dot(d, d);

  float vignette = 1.0 - smoothstep(
    ${toGlslFloat(square(SHADER_CONFIG.vignetteStart))},
    ${toGlslFloat(square(SHADER_CONFIG.vignetteEnd))},
    dist2
  );

  color *= ${toGlslFloat(SHADER_CONFIG.vignetteBase)} + ${toGlslFloat(SHADER_CONFIG.vignetteStrength)} * vignette;
  color += ${glslVec3(SHADER_CONFIG.baseColor)};

  if (u_quality > 0.001) {
    vec2 px = uv * u_resolution;
    float frame = mod(floor(u_time * 18.0), 1024.0);

    float grain = hash12(floor(px * 0.75) + vec2(frame, frame * 1.37)) - 0.5;
    float flicker = FILM_GRAIN_FLICKER_BASE + (hash12(vec2(frame, 91.7)) - 0.5) * FILM_GRAIN_FLICKER_RANGE;

    color += grain * flicker * FILM_GRAIN_STRENGTH * u_quality;
  }

  gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
`;

export const WEBGPU_SHADER = `
struct VertexOut {
  @builtin(position) pos : vec4f,
  @location(0) uv : vec2f,
  @location(1) c1 : vec2f,
  @location(2) c2 : vec2f,
  @location(3) c3 : vec2f,
};

struct Uniforms {
  resolution : vec2f,
  time : f32,
  quality : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;

const ANIMATION_SPEED : f32 = ${toWgslFloat(SHADER_CONFIG.animationSpeed)};
const FILM_GRAIN_FLICKER_BASE : f32 = ${toWgslFloat(SHADER_CONFIG.filmGrainFlickerBase)};
const FILM_GRAIN_FLICKER_RANGE : f32 = ${toWgslFloat(SHADER_CONFIG.filmGrainFlickerRange)};
const FILM_GRAIN_STRENGTH : f32 = ${toWgslFloat(SHADER_CONFIG.filmGrainStrength)};

@vertex
fn vsMain(@builtin(vertex_index) i : u32) -> VertexOut {
  var p = array<vec2f, 6>(
    vec2f(-1.0, -1.0),
    vec2f(1.0, -1.0),
    vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0),
    vec2f(1.0, -1.0),
    vec2f(1.0, 1.0)
  );

  let pos = p[i];
  let t = u.time * ANIMATION_SPEED;

  var out : VertexOut;
  out.pos = vec4f(pos, 0.0, 1.0);
  out.uv = pos * 0.5 + vec2f(0.5);

  out.c1 = vec2f(
    ${toWgslFloat(SHADER_CONFIG.blob1.centerX)} + sin(t * ${toWgslFloat(SHADER_CONFIG.blob1.speedX)}) * ${toWgslFloat(SHADER_CONFIG.blob1.moveX)},
    ${toWgslFloat(SHADER_CONFIG.blob1.centerY)} + cos(t * ${toWgslFloat(SHADER_CONFIG.blob1.speedY)}) * ${toWgslFloat(SHADER_CONFIG.blob1.moveY)}
  );

  out.c2 = vec2f(
    ${toWgslFloat(SHADER_CONFIG.blob2.centerX)} + cos(t * ${toWgslFloat(SHADER_CONFIG.blob2.speedX)}) * ${toWgslFloat(SHADER_CONFIG.blob2.moveX)},
    ${toWgslFloat(SHADER_CONFIG.blob2.centerY)} + sin(t * ${toWgslFloat(SHADER_CONFIG.blob2.speedY)}) * ${toWgslFloat(SHADER_CONFIG.blob2.moveY)}
  );

  out.c3 = vec2f(
    ${toWgslFloat(SHADER_CONFIG.blob3.centerX)} + sin(t * ${toWgslFloat(SHADER_CONFIG.blob3.speedX)}) * ${toWgslFloat(SHADER_CONFIG.blob3.moveX)},
    ${toWgslFloat(SHADER_CONFIG.blob3.centerY)} + cos(t * ${toWgslFloat(SHADER_CONFIG.blob3.speedY)}) * ${toWgslFloat(SHADER_CONFIG.blob3.moveY)}
  );

  return out;
}

fn hash12(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + vec3f(33.33));
  return fract((p3.x + p3.y) * p3.z);
}

fn blobFast(uv: vec2f, center: vec2f, invScale: vec2f, softness: f32) -> f32 {
  let d = (uv - center) * invScale;
  let x = max(0.0, 1.0 - dot(d, d) * softness * 0.12);
  return x * x;
}

@fragment
fn fsMain(in: VertexOut) -> @location(0) vec4f {
  let uv = in.uv;

  let m1 = blobFast(
    uv,
    in.c1,
    vec2f(${toWgslFloat(1 / SHADER_CONFIG.blob1.scaleX)}, ${toWgslFloat(1 / SHADER_CONFIG.blob1.scaleY)}),
    ${toWgslFloat(SHADER_CONFIG.blob1.softness)}
  );

  let m2 = blobFast(
    uv,
    in.c2,
    vec2f(${toWgslFloat(1 / SHADER_CONFIG.blob2.scaleX)}, ${toWgslFloat(1 / SHADER_CONFIG.blob2.scaleY)}),
    ${toWgslFloat(SHADER_CONFIG.blob2.softness)}
  );

  let m3 = blobFast(
    uv,
    in.c3,
    vec2f(${toWgslFloat(1 / SHADER_CONFIG.blob3.scaleX)}, ${toWgslFloat(1 / SHADER_CONFIG.blob3.scaleY)}),
    ${toWgslFloat(SHADER_CONFIG.blob3.softness)}
  );

  var color =
    ${wgslVec3(SHADER_CONFIG.blob1.color)} * m1 * ${toWgslFloat(SHADER_CONFIG.blob1.intensity)} +
    ${wgslVec3(SHADER_CONFIG.blob2.color)} * m2 * ${toWgslFloat(SHADER_CONFIG.blob2.intensity)} +
    ${wgslVec3(SHADER_CONFIG.blob3.color)} * m3 * ${toWgslFloat(SHADER_CONFIG.blob3.intensity)};

  let d = uv - vec2f(0.5);
  let dist2 = dot(d, d);

  let vignette = 1.0 - smoothstep(
    ${toWgslFloat(square(SHADER_CONFIG.vignetteStart))},
    ${toWgslFloat(square(SHADER_CONFIG.vignetteEnd))},
    dist2
  );

  color *= ${toWgslFloat(SHADER_CONFIG.vignetteBase)} + ${toWgslFloat(SHADER_CONFIG.vignetteStrength)} * vignette;
  color += ${wgslVec3(SHADER_CONFIG.baseColor)};

  if (u.quality > 0.001) {
    let px = uv * u.resolution;
    let frame = min(floor(u.time * 18.0), 1024.0);

    let grain = hash12(floor(px * 0.75) + vec2f(frame, frame * 1.37)) - 0.5;
    let flicker = FILM_GRAIN_FLICKER_BASE + (hash12(vec2f(frame, 91.7)) - 0.5) * FILM_GRAIN_FLICKER_RANGE;

    color += vec3f(grain * flicker * FILM_GRAIN_STRENGTH * u.quality);
  }

  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`;

export type RendererType = "pending" | "webgpu" | "webgl" | "svg";

export type NavigatorWithGpu = Navigator & {
  gpu?: GPU;
};

export interface MinimalGPUCanvasContext {
  configure(options: {
    device: GPUDevice;
    format: GPUTextureFormat;
    alphaMode: "premultiplied";
  }): void;
  getCurrentTexture(): GPUTexture;
}

export const GPU_BUFFER_USAGE = {
  COPY_DST: 0x0008,
  UNIFORM: 0x0040,
} as const;

export function getShaderQuality() {
  return document.documentElement.dataset.quality === "high"
    ? SHADER_CONFIG.highQuality
    : SHADER_CONFIG.defaultQuality;
}

export function getCanvasSize(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, SHADER_CONFIG.maxDevicePixelRatio);

  return {
    width: Math.max(1, Math.floor(rect.width * dpr)),
    height: Math.max(1, Math.floor(rect.height * dpr)),
  };
}
