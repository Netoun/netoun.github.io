/**
 * The glass of a small terminal on the paper (the Skills fetch readout): a light pass drawn over
 * the screen with `mix-blend-mode: screen`, so it only ever adds light, text included. The dark
 * half of the CRT (scanlines, vignette) is CSS, and so is the resting glass: without WebGL the
 * terminal is complete, only still.
 */
const CRT_CONFIG = {
  // The hero mesh's three lights (gold, mint, violet: the theme accents in sRGB), barely lit.
  meshStrength: 0.085,
  // The refresh band rolling down the glass: one pass every `bandPeriod` seconds.
  bandPeriod: 7.5,
  bandStrength: 0.045,
  bandSharpness: 7,
  // Phosphor noise, re-rolled `noiseFps` times a second; gamma > 1 keeps most cells dark.
  noiseStrength: 0.05,
  noiseGamma: 3,
  noiseFps: 24,
} as const;

export const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const float = (value: number) => (Number.isInteger(value) ? `${value}.0` : String(value));

export const FRAGMENT_SHADER = `precision mediump float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;

const vec3 GOLD = vec3(0.996, 0.843, 0.004);
const vec3 MINT = vec3(0.125, 0.855, 0.647);
const vec3 VIOLET = vec3(0.647, 0.125, 0.855);
const vec3 PAPER = vec3(0.951, 0.903, 0.824);

const float MESH_STRENGTH = ${float(CRT_CONFIG.meshStrength)};
const float BAND_PERIOD = ${float(CRT_CONFIG.bandPeriod)};
const float BAND_STRENGTH = ${float(CRT_CONFIG.bandStrength)};
const float BAND_SHARPNESS = ${float(CRT_CONFIG.bandSharpness)};
const float NOISE_STRENGTH = ${float(CRT_CONFIG.noiseStrength)};
const float NOISE_GAMMA = ${float(CRT_CONFIG.noiseGamma)};
const float NOISE_FPS = ${float(CRT_CONFIG.noiseFps)};

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// One soft light, falling off as a gaussian around its centre.
float light(vec2 p, vec2 centre, float radius) {
  vec2 d = p - centre;
  return exp(-dot(d, d) / (radius * radius));
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  // Wrapped so mediump keeps its precision over a long visit.
  float t = mod(u_time, 3600.0);

  // The mesh: mint behind the logo, violet low under the readout, gold in the far corner, each
  // on its own slow orbit.
  vec3 glow = MINT * light(p, vec2(0.2 * aspect + 0.05 * sin(t * 0.11), 0.6 + 0.08 * cos(t * 0.13)), 0.6);
  glow += VIOLET * light(p, vec2(0.62 * aspect + 0.06 * cos(t * 0.09), 0.18 + 0.06 * sin(t * 0.07)), 0.7);
  glow += GOLD * 0.6 * light(p, vec2(0.94 * aspect + 0.04 * sin(t * 0.08), 0.9 + 0.05 * cos(t * 0.1)), 0.5);
  vec3 color = glow * MESH_STRENGTH;

  // The refresh band rolls top to bottom; a still frame (u_time = 0: reduced motion) has none.
  float moving = step(0.0001, t);
  float head = 1.0 - fract(t / BAND_PERIOD);
  float band = exp(-pow((v_uv.y - head) * BAND_SHARPNESS, 2.0));
  color += PAPER * band * BAND_STRENGTH * moving;

  // Phosphor noise, one cell per drawn pixel.
  float frame = floor(t * NOISE_FPS);
  float noise = hash12(floor(v_uv * u_resolution) + frame * 17.0);
  color += PAPER * pow(noise, NOISE_GAMMA) * NOISE_STRENGTH;

  gl_FragColor = vec4(color, 1.0);
}
`;
