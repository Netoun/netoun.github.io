const toGlslFloat = (value: number) => value.toFixed(8).replace(/0+$/, "").replace(/\.$/, ".0");

const GRAIN_CONFIG = {
  maxDevicePixelRatio: 2,

  coarseScale: 2.4,
  midScale: 4.8,
  fineScale: 9.0,

  coarseWeight: 0.4,
  midWeight: 0.35,
  fineWeight: 0.25,

  baseAlpha: 0.03,
  grainAlpha: 0.08,
  minAlpha: 0.004,
  maxAlpha: 0.065,
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

  float alpha = BASE_ALPHA + grain * GRAIN_ALPHA;

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
