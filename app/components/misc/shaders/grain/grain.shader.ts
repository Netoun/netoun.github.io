const toGlslFloat = (value: number) => value.toFixed(8).replace(/0+$/, "").replace(/\.$/, ".0");

const GRAIN_CONFIG = {
  maxDevicePixelRatio: 2,
  flickerBase: 0.98,
  flickerRange: 0.02,
  flickerSpeed: 1.8,

  jitterStrength: 1.2,
  jitterSpeed: 0.45,

  coarseScale: 0.55,
  midScale: 1.15,
  fineScale: 2.6,

  coarseWeight: 0.55,
  midWeight: 0.3,
  fineWeight: 0.15,

  baseAlpha: 0.048,
  grainAlpha: 0.165,
  minAlpha: 0.006,
  maxAlpha: 0.11,
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
precision mediump float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;

const float FLICKER_BASE = ${toGlslFloat(GRAIN_CONFIG.flickerBase)};
const float FLICKER_RANGE = ${toGlslFloat(GRAIN_CONFIG.flickerRange)};
const float FLICKER_SPEED = ${toGlslFloat(GRAIN_CONFIG.flickerSpeed)};
const float JITTER_STRENGTH = ${toGlslFloat(GRAIN_CONFIG.jitterStrength)};
const float JITTER_SPEED = ${toGlslFloat(GRAIN_CONFIG.jitterSpeed)};

const float COARSE_SCALE = ${toGlslFloat(GRAIN_CONFIG.coarseScale)};
const float MID_SCALE = ${toGlslFloat(GRAIN_CONFIG.midScale)};
const float FINE_SCALE = ${toGlslFloat(GRAIN_CONFIG.fineScale)};

const float COARSE_WEIGHT = ${toGlslFloat(GRAIN_CONFIG.coarseWeight)};
const float MID_WEIGHT = ${toGlslFloat(GRAIN_CONFIG.midWeight)};
const float FINE_WEIGHT = ${toGlslFloat(GRAIN_CONFIG.fineWeight)};

const float BASE_ALPHA = ${toGlslFloat(GRAIN_CONFIG.baseAlpha)};
const float GRAIN_ALPHA = ${toGlslFloat(GRAIN_CONFIG.grainAlpha)};
const float MIN_ALPHA = ${toGlslFloat(GRAIN_CONFIG.minAlpha)};
const float MAX_ALPHA = ${toGlslFloat(GRAIN_CONFIG.maxAlpha)};

// Hash sans sin() : bien plus rapide sur beaucoup de GPUs mobiles / intégrés
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Bruit value noise simplifié
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

  float t = u_time;

  float flicker = FLICKER_BASE + sin(t * FLICKER_SPEED) * FLICKER_RANGE;

  // Jitter moins cher : pas besoin de noise interpolé pour ça
  vec2 jitter = vec2(
    hash12(vec2(t * JITTER_SPEED, 1.73)) - 0.5,
    hash12(vec2(2.91, t * JITTER_SPEED)) - 0.5
  ) * JITTER_STRENGTH;

  vec2 p = px + jitter;

  // Seulement 2 value noise + 1 hash direct
  float coarse = valueNoise(p * COARSE_SCALE);
  float mid = valueNoise(p * MID_SCALE + vec2(17.0, 43.0));

  // Grain fin en hash direct, pas interpolé
  float fine = hash12(floor(p * FINE_SCALE) + floor(t * 24.0));

  float grain =
    coarse * COARSE_WEIGHT +
    mid * MID_WEIGHT +
    fine * FINE_WEIGHT -
    0.5;

  float alpha = (BASE_ALPHA + grain * GRAIN_ALPHA) * flicker;

  gl_FragColor = vec4(0.0, 0.0, 0.0, clamp(alpha, MIN_ALPHA, MAX_ALPHA));
}
`;

export function getCanvasSize() {
  const dpr = Math.min(window.devicePixelRatio || 1, GRAIN_CONFIG.maxDevicePixelRatio);

  return {
    width: Math.max(1, Math.floor(window.innerWidth * dpr)),
    height: Math.max(1, Math.floor(window.innerHeight * dpr)),
  };
}
