import { memo, useEffect, useRef } from "react";
import * as styles from "./holographic-overlay.css";

const GPU_BUFFER_USAGE_UNIFORM = 0x40;
const GPU_BUFFER_USAGE_COPY_DST = 0x08;

const WGSL_SHADER = `
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

const GLSL_VERTEX = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const GLSL_FRAGMENT = `
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

interface Backend {
  render: (time: number) => void;
  resize: () => void;
  dispose: () => void;
}

function getViewport(canvas: HTMLCanvasElement, parent: HTMLElement) {
  const rect = parent.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));

  return {
    width,
    height,
    cssWidth: Math.max(1, rect.width),
    cssHeight: Math.max(1, rect.height),
  };
}

function setCanvasSize(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  cssWidth: number,
  cssHeight: number,
) {
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
}

async function tryWebGPU(canvas: HTMLCanvasElement, parent: HTMLElement): Promise<Backend | null> {
  const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;
  if (!gpu) return null;

  const adapter = await gpu.requestAdapter();
  if (!adapter) return null;

  const device = await adapter.requestDevice();
  if (!device) return null;

  const format = gpu.getPreferredCanvasFormat();
  const shaderModule = device.createShaderModule({ code: WGSL_SHADER });

  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: shaderModule,
      entryPoint: "vs",
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs",
      targets: [
        {
          format,
          blend: {
            color: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
  });

  const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPU_BUFFER_USAGE_UNIFORM | GPU_BUFFER_USAGE_COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  const context = canvas.getContext("webgpu");

  if (!context) {
    device.destroy();
    return null;
  }

  const uniformData = new Float32Array(4);

  const configure = () => {
    context.configure({
      device,
      format,
      alphaMode: "premultiplied",
    });
  };

  configure();

  let disposed = false;

  return {
    resize: () => {
      if (disposed) return;

      const vp = getViewport(canvas, parent);
      setCanvasSize(canvas, vp.width, vp.height, vp.cssWidth, vp.cssHeight);

      configure();

      uniformData[0] = vp.width;
      uniformData[1] = vp.height;
      device.queue.writeBuffer(uniformBuffer, 0, uniformData);
    },

    render: (time: number) => {
      if (disposed) return;

      uniformData[2] = time;
      device.queue.writeBuffer(uniformBuffer, 0, uniformData);

      const encoder = device.createCommandEncoder();
      const textureView = context.getCurrentTexture().createView();

      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: textureView,
            loadOp: "clear",
            storeOp: "store",
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
          },
        ],
      });

      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.draw(6);
      pass.end();

      device.queue.submit([encoder.finish()]);
    },

    dispose: () => {
      disposed = true;
      device.destroy();
    },
  };
}

function tryWebGL(canvas: HTMLCanvasElement, parent: HTMLElement): Backend | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });

  if (!gl) return null;

  const compileShader = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  };

  const vs = compileShader(gl.VERTEX_SHADER, GLSL_VERTEX);
  const fs = compileShader(gl.FRAGMENT_SHADER, GLSL_FRAGMENT);

  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  const positionBuffer = gl.createBuffer();

  if (!positionBuffer) {
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");

  if (positionLocation === -1 || resolutionLocation === null || timeLocation === null) {
    gl.deleteBuffer(positionBuffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  gl.disable(gl.STENCIL_TEST);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.clearColor(0, 0, 0, 0);

  let disposed = false;

  return {
    resize: () => {
      if (disposed) return;

      const vp = getViewport(canvas, parent);
      setCanvasSize(canvas, vp.width, vp.height, vp.cssWidth, vp.cssHeight);

      gl.viewport(0, 0, vp.width, vp.height);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, vp.width, vp.height);
    },

    render: (time: number) => {
      if (disposed) return;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(timeLocation, time);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },

    dispose: () => {
      disposed = true;
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}

function HolographicOverlayComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let disposed = false;
    let frameId = 0;
    let backend: Backend | null = null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();

    const getElapsedTime = () => (performance.now() - start) / 1000;

    const render = (now: number) => {
      if (disposed || !backend) return;

      try {
        backend.render((now - start) / 1000);
      } catch (error) {
        console.warn("Holographic overlay render failed.", error);
        backend.dispose();
        backend = null;
        return;
      }

      if (!reducedMotion.matches) {
        frameId = requestAnimationFrame(render);
      }
    };

    const renderOnce = () => {
      if (disposed || !backend) return;

      try {
        backend.render(getElapsedTime());
      } catch (error) {
        console.warn("Holographic overlay render failed.", error);
        backend.dispose();
        backend = null;
      }
    };

    const resize = () => {
      if (disposed || !backend) return;

      backend.resize();

      if (reducedMotion.matches) {
        renderOnce();
      }
    };

    const startRendering = () => {
      if (disposed || !backend) return;

      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(render);
    };

    const onMotionChange = () => {
      cancelAnimationFrame(frameId);

      if (reducedMotion.matches) {
        renderOnce();
        return;
      }

      startRendering();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    reducedMotion.addEventListener("change", onMotionChange);

    tryWebGPU(canvas, parent)
      .catch(() => null)
      .then((gpuBackend) => {
        if (disposed) {
          gpuBackend?.dispose();
          return;
        }

        backend = gpuBackend ?? tryWebGL(canvas, parent);

        if (!backend) {
          console.warn("Holographic overlay: no WebGPU/WebGL backend available.");
          return;
        }

        backend.resize();

        if (reducedMotion.matches) {
          renderOnce();
          return;
        }

        startRendering();
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", onMotionChange);
      backend?.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.holographicOverlayStyles} aria-hidden="true" />;
}

export const HolographicOverlay = memo(HolographicOverlayComponent);
