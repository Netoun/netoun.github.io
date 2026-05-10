import { useEffect, useRef } from "react";
import type { AccentType, ShapeType } from "../../data/skills-data.types";
import { ACCENT_RGB, SHAPE_INDEX } from "../../data/skills-data";
import * as styles from "./skills-shape-shader.css";

const SHAPE_CLASSES: Record<ShapeType, string> = {
  sparkle: styles.shapeSparkleStyle,
  diamond: styles.shapeDiamondStyle,
  cube: styles.shapeCubeStyle,
  circle: styles.shapeCircleStyle,
  hexagon: styles.shapeHexagonStyle,
  ring: styles.shapeRingStyle,
};

interface ShapeShaderProps {
  shape: ShapeType;
  accent: AccentType;
}

export function ShapeShader({ shape, accent }: ShapeShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackClass = `${styles.shapeBaseStyle} ${SHAPE_CLASSES[shape]}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let stop = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };

    const startWebGL = () => {
      const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
      if (!gl) return false;

      const vertex = gl.createShader(gl.VERTEX_SHADER);
      const fragment = gl.createShader(gl.FRAGMENT_SHADER);
      if (!vertex || !fragment) return false;

      const vertexSource = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      const fragmentSource = `
        precision mediump float;
        varying vec2 vUv;
        uniform vec2 uResolution;
        uniform float uTime;
        uniform vec3 uAccent;
        uniform float uShape;

        float sdCircle(vec2 p, float r) { return length(p) - r; }
        float sdBox(vec2 p, vec2 b) {
          vec2 d = abs(p) - b;
          return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
        }
        float sdDiamond(vec2 p, float r) { return (abs(p.x) + abs(p.y)) - r; }
        float sdHexagon(vec2 p, float r) {
          const vec3 k = vec3(-0.8660254, 0.5, 0.57735);
          p = abs(p);
          p -= 2.0 * min(dot(k.xy, p), 0.0) * k.xy;
          p -= vec2(clamp(p.x, -k.z * r, k.z * r), r);
          return length(p) * sign(p.y);
        }
        mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

        vec3 hueShift(vec3 c, float h) {
          float a = h;
          float s = sin(a);
          float co = cos(a);
          mat3 m = mat3(
            0.299 + 0.701 * co + 0.168 * s, 0.587 - 0.587 * co + 0.330 * s, 0.114 - 0.114 * co - 0.497 * s,
            0.299 - 0.299 * co - 0.328 * s, 0.587 + 0.413 * co + 0.035 * s, 0.114 - 0.114 * co + 0.292 * s,
            0.299 - 0.3 * co + 1.25 * s,    0.587 - 0.588 * co - 1.05 * s,  0.114 + 0.886 * co - 0.203 * s
          );
          return clamp(m * c, 0.0, 1.0);
        }

        float shapeMask(vec2 p) {
          float d = sdCircle(p, 0.44);
          if (uShape < 0.5) {
            vec2 q = p * rot(0.785);
            d = max(sdDiamond(p, 0.52), -sdDiamond(q, 0.25));
          } else if (uShape < 1.5) {
            d = sdDiamond(p, 0.56);
          } else if (uShape < 2.5) {
            d = sdBox(p, vec2(0.42));
          } else if (uShape < 3.5) {
            d = sdCircle(p, 0.48);
          } else if (uShape < 4.5) {
            d = sdHexagon(p, 0.5);
          } else {
            float outer = sdCircle(p, 0.5);
            float inner = sdCircle(p, 0.34);
            d = max(outer, -inner);
          }
          return smoothstep(0.03, -0.03, d);
        }

        void main() {
          vec2 p = (vUv - 0.5) * 2.0;
          p.x *= uResolution.x / max(uResolution.y, 1.0);
          float t = uTime;

          float mask = shapeMask(p);
          if (mask < 0.001) {
            gl_FragColor = vec4(0.0);
            return;
          }

          float r = length(p);
          float z = sqrt(max(0.0, 1.0 - min(1.0, r * r)));
          vec3 n = normalize(vec3(p * 0.9, z));

          vec3 l = normalize(vec3(
            sin(t * 1.15) * 0.65,
            cos(t * 0.9) * 0.55,
            0.85
          ));
          vec3 v = vec3(0.0, 0.0, 1.0);
          vec3 h = normalize(l + v);
          float diff = max(dot(n, l), 0.0);
          float spec = pow(max(dot(n, h), 0.0), 58.0);
          float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0);

          float sweep = sin((p.x - p.y) * 9.0 + t * 2.2) * 0.5 + 0.5;
          float ripple = sin((p.x + p.y) * 13.0 - t * 2.8) * 0.5 + 0.5;
          vec3 prismA = hueShift(uAccent, 0.8 + sweep * 1.2 + t * 0.45);
          vec3 prismB = hueShift(uAccent, -0.5 + ripple * 0.9 - t * 0.25);
          float bands = mix(sweep, ripple, 0.35);
          vec3 prism = mix(prismA, prismB, bands);

          float shimmer = smoothstep(0.72, 1.0, sin(p.x * 10.0 - p.y * 7.0 + t * 3.4) * 0.5 + 0.5);
          float shade = 0.35 + 0.65 * diff;
          vec3 base = mix(uAccent * 0.82, prism, 0.28) * shade;
          vec3 rim = hueShift(prism, 0.9) * fresnel * (0.24 + shimmer * 0.2);
          vec3 highlight = vec3(1.0) * spec * (0.42 + shimmer * 0.28);
          vec3 col = base + rim + highlight;

          float pulse = 0.88 + 0.12 * sin(t * 2.6);
          float alpha = mask * pulse * (0.22 + 0.18 * (1.0 - r) + shimmer * 0.12);
          gl_FragColor = vec4(col, alpha);
        }
      `;

      gl.shaderSource(vertex, vertexSource);
      gl.compileShader(vertex);
      gl.shaderSource(fragment, fragmentSource);
      gl.compileShader(fragment);
      if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS)) return false;
      if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) return false;

      const program = gl.createProgram();
      if (!program) return false;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;

      const buffer = gl.createBuffer();
      if (!buffer) return false;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const posLoc = gl.getAttribLocation(program, "position");
      const timeLoc = gl.getUniformLocation(program, "uTime");
      const resLoc = gl.getUniformLocation(program, "uResolution");
      const accentLoc = gl.getUniformLocation(program, "uAccent");
      const shapeLoc = gl.getUniformLocation(program, "uShape");
      if (posLoc < 0 || !timeLoc || !resLoc || !accentLoc || !shapeLoc) return false;

      const rgb = ACCENT_RGB[accent];
      const shapeIndex = SHAPE_INDEX[shape];
      const start = performance.now();

      const draw = () => {
        if (stop) return;
        resize();
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.useProgram(program);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(timeLoc, (performance.now() - start) * 0.001);
        gl.uniform2f(resLoc, canvas.width, canvas.height);
        gl.uniform3f(accentLoc, rgb[0], rgb[1], rgb[2]);
        gl.uniform1f(shapeLoc, shapeIndex);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        raf = requestAnimationFrame(draw);
      };

      draw();
      return true;
    };

    startWebGL();

    return () => {
      stop = true;
      if (raf) cancelAnimationFrame(raf);
    };
  }, [accent, shape]);

  return (
    <>
      <div className={fallbackClass} aria-hidden />
      <canvas ref={canvasRef} className={styles.shapeShaderCanvasStyle} aria-hidden />
    </>
  );
}
