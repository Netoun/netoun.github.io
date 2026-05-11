export const GPU_BUFFER_USAGE_UNIFORM = 0x40;
export const GPU_BUFFER_USAGE_COPY_DST = 0x08;

export const WGSL_SHADER = `
struct Uniforms {
  resolution: vec2f,
  time: f32,
  _pad: f32,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs(@builtin(vertex_index) idx: u32) -> VertexOutput {
  let positions = array<vec2f, 6>(
    vec2f(-1.0, -1.0),
    vec2f(1.0, -1.0),
    vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0),
    vec2f(1.0, -1.0),
    vec2f(1.0, 1.0)
  );

  let pos = positions[idx];

  var out: VertexOutput;
  out.position = vec4f(pos, 0.0, 1.0);
  out.uv = pos * 0.5 + 0.5;
  return out;
}

fn hash21(p: vec2f) -> f32 {
  var q = fract(p * vec2f(234.34, 435.345));
  q += dot(q, q + 34.23);
  return fract(q.x * q.y);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);

  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p0: vec2f) -> f32 {
  var p = p0;
  var v = 0.0;
  var a = 0.5;

  for (var i = 0; i < 4; i = i + 1) {
    v += noise(p) * a;
    p = p * 2.0 + vec2f(19.7, 11.3);
    a *= 0.5;
  }

  return v;
}

fn spectralColor(x: f32) -> vec3f {
  return vec3f(
    0.5 + 0.5 * sin(x),
    0.5 + 0.5 * sin(x + 2.094),
    0.5 + 0.5 * sin(x + 4.188)
  );
}

@fragment
fn fs(in: VertexOutput) -> @location(0) vec4f {
  let uv = in.uv;
  let t = uniforms.time;

  let aspect = uniforms.resolution.x / max(uniforms.resolution.y, 1.0);
  let centered = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5);
  let radius = length(centered);

  let edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  let edgeFade = smoothstep(0.0, 0.16, edge);

  let drift = vec2f(t * 0.026, -t * 0.018);
  let wave = vec2f(
    sin((uv.y + t * 0.2) * 13.0),
    cos((uv.x - t * 0.17) * 11.0)
  ) * 0.007;

  let flowUv = uv + wave;
  let n = fbm(flowUv * 3.6 + drift);
  let n2 = fbm(flowUv * 9.0 + vec2f(-t * 0.035, t * 0.022));
  let grain = hash21(floor((uv + vec2f(t * 0.015, -t * 0.01)) * uniforms.resolution.xy * 0.55));

  let diagonal = flowUv.x * 1.15 + flowUv.y * 0.72;
  let foilBands = 0.5 + 0.5 * sin((diagonal + n * 0.42) * 22.0 - t * 0.65);
  let sharpBands = smoothstep(0.58, 0.96, foilBands);

  let softSheen = smoothstep(0.0, 1.0, 1.0 - radius * 1.38 + n * 0.24);
  let caustic = smoothstep(0.55, 1.0, 0.45 + 0.55 * sin((diagonal + n * 0.5) * 10.0 - t * 0.5));

  let borderRing = smoothstep(0.13, 0.0, edge) * smoothstep(0.0, 0.032, edge);
  let innerGlow = smoothstep(0.38, 0.04, radius);

  let tintA = vec3f(0.76, 0.9, 1.0);
  let tintB = vec3f(1.0, 0.96, 0.98);
  let baseMix = smoothstep(0.0, 1.0, uv.y + n * 0.16 - 0.04);
  var color = mix(tintA, tintB, baseMix);

  let spectral = spectralColor((diagonal + n * 0.45 + t * 0.035) * 12.0);
  let secondarySpectral = spectralColor((uv.x - uv.y * 0.75 + n2 * 0.35 - t * 0.028) * 18.0);

  color = mix(color, spectral, 0.26 * sharpBands);
  color += secondarySpectral * caustic * 0.1;
  color += vec3f(0.9, 0.98, 1.0) * softSheen * 0.09;
  color += vec3f(0.95, 0.98, 1.0) * borderRing * 0.85;
  color += vec3f(0.9, 0.95, 1.0) * innerGlow * 0.055;
  color += (grain - 0.5) * 0.035;

  let haze = 0.72 + 0.28 * n2;
  color *= haze;

  var alpha = 0.045;
  alpha += softSheen * 0.045;
  alpha += sharpBands * 0.055;
  alpha += caustic * 0.035;
  alpha += n2 * 0.025;
  alpha += borderRing * 0.16;
  alpha += grain * 0.012;
  alpha = clamp(alpha, 0.0, 0.24) * edgeFade;

  return vec4f(color * alpha, alpha);
}
`;

export const GLSL_VERTEX = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const GLSL_FRAGMENT = `
precision highp float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;

  for (int i = 0; i < 4; i++) {
    v += noise(p) * a;
    p = p * 2.0 + vec2(19.7, 11.3);
    a *= 0.5;
  }

  return v;
}

vec3 spectralColor(float x) {
  return vec3(
    0.5 + 0.5 * sin(x),
    0.5 + 0.5 * sin(x + 2.094),
    0.5 + 0.5 * sin(x + 4.188)
  );
}

void main() {
  vec2 uv = v_uv;
  float t = u_time;

  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 centered = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  float radius = length(centered);

  float edge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  float edgeFade = smoothstep(0.0, 0.16, edge);

  vec2 drift = vec2(t * 0.026, -t * 0.018);
  vec2 wave = vec2(
    sin((uv.y + t * 0.2) * 13.0),
    cos((uv.x - t * 0.17) * 11.0)
  ) * 0.007;

  vec2 flowUv = uv + wave;
  float n = fbm(flowUv * 3.6 + drift);
  float n2 = fbm(flowUv * 9.0 + vec2(-t * 0.035, t * 0.022));
  float grain = hash21(floor((uv + vec2(t * 0.015, -t * 0.01)) * u_resolution.xy * 0.55));

  float diagonal = flowUv.x * 1.15 + flowUv.y * 0.72;
  float foilBands = 0.5 + 0.5 * sin((diagonal + n * 0.42) * 22.0 - t * 0.65);
  float sharpBands = smoothstep(0.58, 0.96, foilBands);

  float softSheen = smoothstep(0.0, 1.0, 1.0 - radius * 1.38 + n * 0.24);
  float caustic = smoothstep(0.55, 1.0, 0.45 + 0.55 * sin((diagonal + n * 0.5) * 10.0 - t * 0.5));

  float borderRing = smoothstep(0.13, 0.0, edge) * smoothstep(0.0, 0.032, edge);
  float innerGlow = smoothstep(0.38, 0.04, radius);

  vec3 tintA = vec3(0.76, 0.9, 1.0);
  vec3 tintB = vec3(1.0, 0.96, 0.98);
  float baseMix = smoothstep(0.0, 1.0, uv.y + n * 0.16 - 0.04);
  vec3 color = mix(tintA, tintB, baseMix);

  vec3 spectral = spectralColor((diagonal + n * 0.45 + t * 0.035) * 12.0);
  vec3 secondarySpectral = spectralColor((uv.x - uv.y * 0.75 + n2 * 0.35 - t * 0.028) * 18.0);

  color = mix(color, spectral, 0.26 * sharpBands);
  color += secondarySpectral * caustic * 0.1;
  color += vec3(0.9, 0.98, 1.0) * softSheen * 0.09;
  color += vec3(0.95, 0.98, 1.0) * borderRing * 0.85;
  color += vec3(0.9, 0.95, 1.0) * innerGlow * 0.055;
  color += (grain - 0.5) * 0.035;

  float haze = 0.72 + 0.28 * n2;
  color *= haze;

  float alpha = 0.045;
  alpha += softSheen * 0.045;
  alpha += sharpBands * 0.055;
  alpha += caustic * 0.035;
  alpha += n2 * 0.025;
  alpha += borderRing * 0.16;
  alpha += grain * 0.012;
  alpha = clamp(alpha, 0.0, 0.24) * edgeFade;

  gl_FragColor = vec4(color, alpha);
}
`;

export interface HolographicBackend {
  render: (time: number) => void;
  resize: () => void;
  dispose: () => void;
}
