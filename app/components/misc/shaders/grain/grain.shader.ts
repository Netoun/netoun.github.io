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

  // Réglages du GrainCanvas (labs) — bruit noir en alpha variable.
  baseAlpha: 0.03,
  grainAlpha: 0.08,
} as const;

export const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
