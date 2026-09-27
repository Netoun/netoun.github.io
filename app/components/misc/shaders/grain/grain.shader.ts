const toGlslFloat = (value: number) => value.toFixed(8).replace(/0+$/, "").replace(/\.$/, ".0");

export const GRAIN_CONFIG = {
  // Le buffer doit correspondre exactement aux pixels physiques : tout
  // resampling (up ou down) moyenne le bruit par pixel et le rend flou.
  // On rend donc à devicePixelRatio natif — jamais de supersampling.
  minRenderScale: 1,
  maxRenderScale: 4,

  // Amplitude du grain film signé : alpha max d'un pixel (blanc ou noir).
  // C'EST LE KNOB PRINCIPAL du grain visible sur le hero (et tout le site).
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

export const FRAGMENT_SHADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 v_uv;
uniform vec2 u_resolution;

const float GRAIN_STRENGTH = ${toGlslFloat(GRAIN_CONFIG.filmGrainStrength)};
const float GRAIN_GAMMA = ${toGlslFloat(GRAIN_CONFIG.filmGrainGamma)};

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Grain film signé : une cellule = un pixel physique, moitié éclaircit,
// moitié assombrit. Sortie prémultipliée (blanc·a ou noir·a).
void main() {
  float n = hash12(floor(v_uv * u_resolution)) - 0.5;
  float alpha = pow(abs(n) * 2.0, GRAIN_GAMMA) * GRAIN_STRENGTH;
  vec3 tint = n > 0.0 ? vec3(alpha) : vec3(0.0);
  gl_FragColor = vec4(tint, alpha);
}
`;
