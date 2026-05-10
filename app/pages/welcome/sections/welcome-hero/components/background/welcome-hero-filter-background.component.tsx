import { memo, useEffect, useRef, useState } from "react";
import { MousePathCanvas } from "@/components/misc/mouse-path-canvas/mouse-path-canvas.component";
import { ClientOnly } from "@/components/primitives/client-only/client-only.component";
import type { MousePosition } from "@/hooks/use-mouse-position.hook";
import * as styles from "./welcome-hero-filter-background.css";

const MESH_SHAPES = [
  {
    id: "mesh-1",
    d: "M25.5 -31.1C31.3 -25.6 33 -15.8 33.4 -6.8C33.9 2.2 33.1 10.4 29.3 16.7C25.4 23.1 18.5 27.4 11 30.3C3.4 33.1 -4.8 34.3 -11.4 31.7C-18 29.1 -23 22.6 -28.9 15.3C-34.8 7.9 -41.6 -0.3 -40.3 -7C-39 -13.7 -29.6 -18.9 -21.5 -24C-13.5 -29 -6.7 -34 1.6 -35.9C9.9 -37.8 19.8 -36.5 25.5 -31.1Z",
    viewBox: "-50 -50 100 100",
    style: { top: "0%", left: "0%", width: "55%", height: "50%" },
    pathIndex: 1,
  },
  {
    id: "mesh-2",
    d: "M8.5,-5.6C14.5,-2.5,25.3,-1.3,25.5,0.2C25.8,1.8,15.5,3.5,9.5,6.2C3.5,8.9,1.8,12.5,-4.3,16.8C-10.4,21.1,-20.7,26.1,-24.1,23.4C-27.4,20.7,-23.8,10.4,-21.7,2.1C-19.6,-6.1,-19,-12.3,-15.6,-15.3C-12.3,-18.4,-6.1,-18.3,-2.4,-15.9C1.3,-13.5,2.5,-8.6,8.5,-5.6Z",
    // Bounding box: 0→500, 0→300 + blur padding
    viewBox: "-50 -30 100 100",
    style: { bottom: "0", left: "0%", width: "20%", height: "30%" },
    pathIndex: 2,
  },
  {
    id: "mesh-3",
    d: "M649 279 847 298 871 427 712 390Z",
    // Bounding box: x=649→871, y=279→427 + blur padding
    viewBox: "599 229 322 248",
    style: { top: "40%", left: "50%", width: "35%", height: "55%" },
    pathIndex: 3,
  },
] as const;

const SharedDefsSVG = memo(function SharedDefsSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      style={{ position: "absolute", visibility: "hidden" }}
      aria-hidden="true"
    >
      <defs>
        {/* Shared blur filter for all mesh shapes */}
        <filter id="mesh-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
        </filter>

        {/* Noise patterns */}
        <filter id="noise" x="0" y="0" width="100%" height="100%">
          {/* Reduced baseFrequency from 1.25 to 0.8 for better performance */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.26"
            result="turbulence"
            stitchTiles="stitch"
          />
          <feBlend in="SourceGraphic" in2="turbulence" mode="overlay" />
        </filter>
      </defs>
    </svg>
  );
});

const MeshShapeSVG = memo(function MeshShapeSVG({
  d,
  viewBox,
  style,
  pathIndex,
}: (typeof MESH_SHAPES)[number]) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={styles.welcomeMeshShapeStyles}
      style={style}
    >
      <title>{`Mesh ${pathIndex}`}</title>
      <path
        d={d}
        filter="url(#mesh-blur)"
        data-mesh-index={pathIndex}
        className={styles.welcomeMeshGradientPathStyles}
      />
    </svg>
  );
});

const NoiseOverlaySVG = memo(function NoiseOverlaySVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 500"
      preserveAspectRatio="none"
      className={styles.welcomeNoiseOverlayStyles}
    >
      <title>Noise Overlay</title>
      <rect
        x="0"
        y="0"
        width="1000"
        height="500"
        filter="url(#noise)"
        fill="white"
        opacity="0.08"
      />
    </svg>
  );
});

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_quality;

const float FILM_GRAIN_FLICKER_BASE = 0.98;
const float FILM_GRAIN_FLICKER_RANGE = 0.02;
const float FILM_GRAIN_JITTER = 1.2;
const float FILM_GRAIN_STRENGTH = 0.09;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
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

float grainLayer(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float blob(vec2 uv, vec2 center, vec2 scale, float softness) {
  vec2 d = (uv - center) / scale;
  float dist = dot(d, d);
  return exp(-dist * softness);
}

void main() {
  vec2 uv = v_uv;
  float t = u_time * 0.06;

  vec2 c1 = vec2(0.16 + sin(t * 0.9) * 0.012, 0.14 + cos(t * 0.8) * 0.01);
  vec2 c2 = vec2(0.10 + cos(t * 1.1) * 0.012, 0.80 + sin(t * 0.7) * 0.01);
  vec2 c3 = vec2(0.70 + sin(t * 0.6) * 0.014, 0.62 + cos(t * 1.0) * 0.012);

  float m1 = blob(uv, c1, vec2(0.28, 0.24), 3.6);
  float m2 = blob(uv, c2, vec2(0.14, 0.17), 4.2);
  float m3 = blob(uv, c3, vec2(0.23, 0.29), 4.0);

  vec3 col1 = vec3(0.97, 0.78, 0.28);
  vec3 col2 = vec3(0.33, 0.84, 0.56);
  vec3 col3 = vec3(0.79, 0.29, 0.88);

  vec3 color = vec3(0.0);
  color += col1 * m1 * 0.26;
  color += col2 * m2 * 0.33;
  color += col3 * m3 * 0.31;

  float dist = distance(uv, vec2(0.5));
  float vignette = 1.0 - smoothstep(0.38, 0.92, dist);
  color *= (0.72 + 0.28 * vignette);

  color += vec3(0.02, 0.03, 0.05);

  vec2 px = uv * u_resolution.xy;
  float flicker = FILM_GRAIN_FLICKER_BASE + sin(u_time * 1.8) * FILM_GRAIN_FLICKER_RANGE;
  vec2 jitter = vec2(
    noise(vec2(u_time * 0.45, 1.73)) - 0.5,
    noise(vec2(2.91, u_time * 0.45)) - 0.5
  ) * FILM_GRAIN_JITTER;
  float coarse = grainLayer((px + jitter) * 0.6);
  float mid = grainLayer((px + jitter) * 1.1 + vec2(17.0, 43.0));
  float fine = hash((px + jitter) * 2.7 + vec2(u_time * 41.0, u_time * 33.0));
  float filmGrain = ((coarse * 0.56 + mid * 0.29 + fine * 0.15) - 0.5) * flicker;
  color += filmGrain * (FILM_GRAIN_STRENGTH * u_quality);

  gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
`;

const MeshShaderBackground = memo(function MeshShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [renderer, setRenderer] = useState<"pending" | "webgpu" | "webgl" | "svg">("pending");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const commonSetup = () => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reducedMotionRef = { current: mediaQuery.matches };
      const qualityValue = document.documentElement.dataset.quality === "high" ? 1 : 0.7;
      const handleMotion = () => {
        reducedMotionRef.current = mediaQuery.matches;
      };
      mediaQuery.addEventListener("change", handleMotion);

      return {
        qualityValue,
        reducedMotionRef,
        dispose: () => mediaQuery.removeEventListener("change", handleMotion),
      };
    };

    const initWebGPU = async () => {
      const gpu = (navigator as { gpu?: any }).gpu;
      if (!gpu) return null;

      const adapter = await gpu.requestAdapter({ powerPreference: "high-performance" });
      if (!adapter) return null;

      const device = await adapter.requestDevice();
      const context = canvas.getContext("webgpu") as GPUCanvasContext;
      if (!context) return null;

      const format = gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: "premultiplied" });

      const shader = device.createShaderModule({
        code: `
struct VertexOut { @builtin(position) pos : vec4f, @location(0) uv : vec2f };
struct Uniforms { resolution : vec2f, time : f32, quality : f32 };
@group(0) @binding(0) var<uniform> u : Uniforms;

const FILM_GRAIN_FLICKER_BASE : f32 = 0.98;
const FILM_GRAIN_FLICKER_RANGE : f32 = 0.02;
const FILM_GRAIN_JITTER : f32 = 1.2;
const FILM_GRAIN_STRENGTH : f32 = 0.09;

@vertex
fn vsMain(@builtin(vertex_index) i : u32) -> VertexOut {
  var p = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0)
  );
  var out : VertexOut;
  out.pos = vec4f(p[i], 0.0, 1.0);
  out.uv = p[i] * 0.5 + vec2f(0.5);
  return out;
}

fn hash(p: vec2f) -> f32 { return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123); }
fn noise(p: vec2f) -> f32 {
  let i = floor(p); let f = fract(p); let v = f * f * (3.0 - 2.0 * f);
  let a = hash(i); let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0)); let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, v.x), mix(c, d, v.x), v.y);
}
fn grainLayer(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
fn blob(uv: vec2f, c: vec2f, s: vec2f, soft: f32) -> f32 {
  let d = (uv - c) / s;
  return exp(-dot(d, d) * soft);
}

@fragment
fn fsMain(in: VertexOut) -> @location(0) vec4f {
  let uv = in.uv;
  let t = u.time * 0.06;
  let c1 = vec2f(0.16 + sin(t * 0.9) * 0.012, 0.14 + cos(t * 0.8) * 0.01);
  let c2 = vec2f(0.10 + cos(t * 1.1) * 0.012, 0.80 + sin(t * 0.7) * 0.01);
  let c3 = vec2f(0.70 + sin(t * 0.6) * 0.014, 0.62 + cos(t * 1.0) * 0.012);
  let m1 = blob(uv, c1, vec2f(0.28, 0.24), 3.6);
  let m2 = blob(uv, c2, vec2f(0.14, 0.17), 4.2);
  let m3 = blob(uv, c3, vec2f(0.23, 0.29), 4.0);
  let col1 = vec3f(0.97, 0.78, 0.28);
  let col2 = vec3f(0.33, 0.84, 0.56);
  let col3 = vec3f(0.79, 0.29, 0.88);
  var color = col1 * m1 * 0.26 + col2 * m2 * 0.33 + col3 * m3 * 0.31;
  let dist = distance(uv, vec2f(0.5));
  let vig = 1.0 - smoothstep(0.38, 0.92, dist);
  color *= (0.72 + 0.28 * vig);
  color += vec3f(0.02, 0.03, 0.05);
  let px = uv * u.resolution;
  let flicker = FILM_GRAIN_FLICKER_BASE + sin(u.time * 1.8) * FILM_GRAIN_FLICKER_RANGE;
  let jitter = vec2f(
    noise(vec2f(u.time * 0.45, 1.73)) - 0.5,
    noise(vec2f(2.91, u.time * 0.45)) - 0.5
  ) * FILM_GRAIN_JITTER;
  let coarse = grainLayer((px + jitter) * 0.6);
  let mid = grainLayer((px + jitter) * 1.1 + vec2f(17.0, 43.0));
  let fine = hash((px + jitter) * 2.7 + vec2f(u.time * 41.0, u.time * 33.0));
  let filmGrain = ((coarse * 0.56 + mid * 0.29 + fine * 0.15) - 0.5) * flicker;
  color += vec3f(filmGrain * (FILM_GRAIN_STRENGTH * u.quality));
  return vec4f(max(color, vec3f(0.0)), 1.0);
}
`,
      });

      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: shader, entryPoint: "vsMain" },
        fragment: { module: shader, entryPoint: "fsMain", targets: [{ format }] },
        primitive: { topology: "triangle-list" },
      });

      const uniformBuffer = device.createBuffer({
        size: 16,
        usage: (window as any).GPUBufferUsage.UNIFORM | (window as any).GPUBufferUsage.COPY_DST,
      });

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });

      const common = commonSetup();
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      window.addEventListener("resize", resize, { passive: true });

      const start = performance.now();
      let frameId = 0;
      const render = (now: number) => {
        const elapsed = common.reducedMotionRef.current ? 0 : (now - start) / 1000;
        device.queue.writeBuffer(
          uniformBuffer,
          0,
          new Float32Array([canvas.width, canvas.height, elapsed, common.qualityValue]),
        );

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              clearValue: { r: 0, g: 0, b: 0, a: 0 },
              loadOp: "clear",
              storeOp: "store",
            },
          ],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(6);
        pass.end();
        device.queue.submit([encoder.finish()]);
        frameId = window.requestAnimationFrame(render);
      };
      frameId = window.requestAnimationFrame(render);

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        common.dispose();
      };
    };

    const initWebGL = () => {
      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      });
      if (!gl) return null;

      const compileShader = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vertexShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vertexShader || !fragmentShader) return null;

      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      const positionLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      const timeLocation = gl.getUniformLocation(program, "u_time");
      const qualityLocation = gl.getUniformLocation(program, "u_quality");
      const common = commonSetup();

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.floor(rect.width * dpr));
        const height = Math.max(1, Math.floor(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.uniform2f(resolutionLocation, width, height);
        gl.uniform1f(qualityLocation, common.qualityValue);
      };

      resize();
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      window.addEventListener("resize", resize, { passive: true });

      const start = performance.now();
      let frameId = 0;
      const render = (now: number) => {
        const elapsed = common.reducedMotionRef.current ? 0 : (now - start) / 1000;
        gl.uniform1f(timeLocation, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        frameId = window.requestAnimationFrame(render);
      };
      frameId = window.requestAnimationFrame(render);

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", resize);
        common.dispose();
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      };
    };

    const init = async () => {
      const WEBGPU_INIT_TIMEOUT_MS = 120;

      try {
        const gpuCleanup = await Promise.race<ReturnType<typeof initWebGPU>>([
          initWebGPU(),
          new Promise<null>((resolve) => {
            window.setTimeout(() => resolve(null), WEBGPU_INIT_TIMEOUT_MS);
          }),
        ]);
        if (!cancelled && gpuCleanup) {
          setRenderer("webgpu");
          cleanup = gpuCleanup;
          return;
        }
      } catch {
        // fall through to webgl
      }

      const glCleanup = initWebGL();
      if (!cancelled && glCleanup) {
        setRenderer("webgl");
        cleanup = glCleanup;
        return;
      }

      if (!cancelled) {
        setRenderer("svg");
      }
    };

    void init();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  if (renderer === "svg") {
    return (
      <div className={styles.welcomeMeshContainerStyles}>
        {MESH_SHAPES.map((mesh) => (
          <MeshShapeSVG key={mesh.id} {...mesh} />
        ))}
        <NoiseOverlaySVG />
      </div>
    );
  }

  return (
    <div className={styles.welcomeMeshContainerStyles}>
      <canvas ref={canvasRef} className={styles.welcomeShaderCanvasStyles} aria-hidden="true" />
    </div>
  );
});

interface WelcomeHeroFilterBackgroundProps {
  container: HTMLElement | null;
  mousePosition: MousePosition;
  disabled?: boolean;
}

function WelcomeHeroFilterBackgroundComponent({
  container,
  mousePosition,
  disabled = false,
}: WelcomeHeroFilterBackgroundProps) {
  const [shouldMountMousePath, setShouldMountMousePath] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const timer = setTimeout(() => {
      setShouldMountMousePath(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {/* Hidden SVG with shared defs (filter, patterns) - must be rendered first */}
      <SharedDefsSVG />

      {/* MousePathCanvas must be outside the shifted mesh container for correct positioning */}
      <ClientOnly>
        {shouldMountMousePath ? (
          container ? (
            <MousePathCanvas
              key={container.id || "mouse-path"}
              container={container}
              mousePosition={mousePosition}
              disabled={disabled}
            />
          ) : null
        ) : null}
      </ClientOnly>

      <MeshShaderBackground />
    </>
  );
}

export const WelcomeHeroFilterBackground = WelcomeHeroFilterBackgroundComponent;
