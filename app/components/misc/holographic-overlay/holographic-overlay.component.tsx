import { memo, useEffect, useRef } from "react";
import * as styles from "./holographic-overlay.css";

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
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

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float edgeFade(vec2 uv) {
  float x = smoothstep(0.0, 0.035, uv.x) * (1.0 - smoothstep(0.965, 1.0, uv.x));
  float y = smoothstep(0.0, 0.035, uv.y) * (1.0 - smoothstep(0.965, 1.0, uv.y));
  return x * y;
}

void main() {
  vec2 uv = v_uv;
  vec2 mouse = clamp(u_mouse, vec2(0.0), vec2(1.0));

  // Keep u_resolution active. No circular mask.
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

  vec2 tilt = mouse - 0.5;

  // Wide diagonal foil bands, like card foil rather than a spotlight.
  float d1 = dot(uv, normalize(vec2(1.0, 0.58)));
  float d2 = dot(uv, normalize(vec2(-0.72, 1.0)));
  float mouseShift = dot(tilt, vec2(1.25, 0.8));

  float sweep1 = d1 * 5.8 + mouseShift * 1.9 - u_time * 0.08;
  float sweep2 = d2 * 9.5 - mouseShift * 1.1 + u_time * 0.05;

  float n = noise(uv * 4.0 + vec2(u_time * 0.025, -u_time * 0.015));
  float fine = noise(uv * 48.0 - u_time * 0.06);

  float hue = fract(sweep1 * 0.16 + n * 0.12 + mouseShift * 0.05);
  vec3 rainbow = hsv2rgb(vec3(hue, 0.62, 1.0));

  float band1 = smoothstep(0.28, 1.0, 0.5 + 0.5 * sin(sweep1 * 6.2831853));
  float band2 = smoothstep(0.70, 1.0, 0.5 + 0.5 * sin(sweep2 * 6.2831853));
  float bands = band1 * 0.55 + band2 * 0.24;

  // Sparse glitter.
  vec2 cell = floor(uv * 76.0);
  float glitterSeed = hash(cell + floor(u_time * 2.0));
  float glitter = smoothstep(0.986, 1.0, glitterSeed);
  glitter *= smoothstep(0.52, 1.0, noise(uv * 220.0 + glitterSeed * 9.0));

  // Very subtle printed horizontal foil lines.
  float scan = 0.94 + 0.06 * sin(uv.y * u_resolution.y * 0.75);

  // Directional sheen without radial falloff.
  vec2 tiltDir = normalize(tilt + vec2(0.001, 0.0));
  float sheen = dot(normalize(p + vec2(0.0001)), tiltDir) * 0.5 + 0.5;
  sheen = smoothstep(0.35, 1.0, sheen) * 0.18;

  float mask = edgeFade(uv);

  vec3 color = rainbow * (0.16 + bands * 0.55 + fine * 0.08 + sheen);
  color += vec3(1.0, 0.96, 0.86) * glitter * 0.55;
  color *= scan * mask;

  // Stronger than the previous version so it is visibly present.
  float alpha = 0.12 + bands * 0.26 + glitter * 0.26 + sheen * 0.12;
  alpha *= mask;
  alpha = clamp(alpha, 0.0, 0.48);

  gl_FragColor = vec4(color, alpha);
}
`;

function HolographicOverlayComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });

    if (!gl) return;

    let frameId = 0;
    let disposed = false;

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

    const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) {
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    if (positionLocation === -1) {
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    if (resolutionLocation === null || timeLocation === null || mouseLocation === null) {
      console.warn("Missing WebGL uniform location", {
        resolutionLocation,
        timeLocation,
        mouseLocation,
      });
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const mouseRef = { x: 0.5, y: 0.5 };

    const updateMouse = () => {
      const computedStyle = getComputedStyle(parent);
      const rawX = parseFloat(computedStyle.getPropertyValue("--x"));
      const rawY = parseFloat(computedStyle.getPropertyValue("--y"));

      mouseRef.x = Number.isFinite(rawX) ? rawX / 100 : 0.5;
      mouseRef.y = Number.isFinite(rawY) ? rawY / 100 : 0.5;
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.cssText = `width: ${rect.width}px; height: ${rect.height}px`;
      }

      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLocation, width, height);
    };

    const start = performance.now();

    const render = (now: number) => {
      if (disposed) return;

      resize();
      updateMouse();

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, (now - start) / 1000);
      gl.uniform2f(mouseLocation, mouseRef.x, mouseRef.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      frameId = window.requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    resize();
    frameId = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.holographicOverlayStyles} aria-hidden="true" />;
}

export const HolographicOverlay = memo(HolographicOverlayComponent);
