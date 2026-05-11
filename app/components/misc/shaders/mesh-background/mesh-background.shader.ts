const toGlslFloat = (value: number) => value.toFixed(8).replace(/0+$/, "").replace(/\.$/, ".0");
const toWgslFloat = toGlslFloat;

const glslVec3 = (value: readonly [number, number, number]) =>
  `vec3(${value.map(toGlslFloat).join(", ")})`;

const wgslVec3 = (value: readonly [number, number, number]) =>
  `vec3f(${value.map(toWgslFloat).join(", ")})`;

export const SHADER_CONFIG = {
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
  maxDevicePixelRatio: 2,
  defaultQuality: 0.7,
  highQuality: 1,
  webgpuInitTimeoutMs: 250,
} as const;

export const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER = `
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

export const WEBGPU_SHADER = `
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
