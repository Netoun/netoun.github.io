export const GRAIN_CONFIG = {
  // Le buffer doit correspondre exactement aux pixels physiques : tout
  // resampling (up ou down) moyenne le bruit par pixel et le rend flou.
  // On rend donc à devicePixelRatio natif — jamais de supersampling.
  minRenderScale: 1,
  maxRenderScale: 4,

  // The page's signed film grain (on the paper): one cell per physical pixel, half lighten,
  // half darken, alpha = pow(|n|·2, gamma) · strength. It is no longer drawn in WebGL:
  // `scripts/generate-grain-tile.ts` bakes it into public/images/grain-tile@{1,2}x.webp, which
  // global.css.ts sets as the body background. Change a value, then run `bun run generate-grain-tile`.
  filmGrainStrength: 0.05,
  // Gamma > 1 : la plupart des pixels restent discrets, une minorité claque —
  // grain "argentique" affirmé plutôt que voile de sable gris uniforme.
  filmGrainGamma: 1.5,
} as const;

/**
 * The baked tile: it repeats every `size` CSS px (the @2x file holds twice the cells), and its
 * alpha is quantised to `alphaSteps` levels (at a 0.05 ceiling 8-bit alpha only holds 13 values
 * anyway, and fewer steps compress the tile by a third).
 */
export const GRAIN_TILE = { size: 128, alphaSteps: 5 } as const;

const fract = (x: number) => x - Math.floor(x);

/** The GLSL `hash12` below, operation for operation: one value in [0, 1) per integer cell. */
export function grainHash12(x: number, y: number): number {
  let a = fract(x * 0.1031);
  let b = fract(y * 0.1031);
  let c = fract(x * 0.1031);
  const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33);
  a += d;
  b += d;
  c += d;
  return fract((a + b) * c);
}

export interface GrainCell {
  /** Lightens (white) or darkens (black) the paper. */
  lighten: boolean;
  /** The quantised weight, 0–1, before `strength`. */
  weight: number;
  alpha: number;
}

/** One cell of the film grain, as the tile bakes it. `steps = 0` keeps the weight unquantised. */
export function grainCell(
  x: number,
  y: number,
  {
    gamma = GRAIN_CONFIG.filmGrainGamma,
    strength = GRAIN_CONFIG.filmGrainStrength,
    steps = GRAIN_TILE.alphaSteps,
  }: { gamma?: number; strength?: number; steps?: number } = {},
): GrainCell {
  const n = grainHash12(x, y) - 0.5;
  const raw = Math.pow(Math.abs(n) * 2, gamma);
  const weight = steps > 0 ? Math.round(raw * steps) / steps : raw;
  return { lighten: n > 0, weight, alpha: weight * strength };
}

export const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * The same grain live, for the Lab: one cell per physical pixel, repeating every `u_period`
 * cells like the tile. `u_xray` tints lighten gold and darken violet at full weight, so the
 * structure shows.
 */
export const FILM_GRAIN_FRAGMENT_SHADER = `precision highp float;

uniform vec2 u_resolution;
uniform float u_strength;
uniform float u_gamma;
uniform float u_steps;
uniform float u_period;
uniform float u_xray;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  // Rows counted from the top, like the tile's.
  vec2 px = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
  vec2 cell = mod(floor(px), u_period);

  float n = hash12(cell) - 0.5;
  float weight = pow(abs(n) * 2.0, u_gamma);
  if (u_steps > 0.5) weight = floor(weight * u_steps + 0.5) / u_steps;

  vec3 ink = n > 0.0 ? vec3(1.0) : vec3(0.0);
  float alpha = weight * u_strength;
  if (u_xray > 0.5) {
    ink = n > 0.0 ? vec3(0.98, 0.84, 0.2) : vec3(0.55, 0.3, 0.9);
    alpha = weight;
  }

  // The canvas is premultiplied.
  gl_FragColor = vec4(ink * alpha, alpha);
}
`;
