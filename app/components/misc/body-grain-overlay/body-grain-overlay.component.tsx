import { memo, useEffect, useRef } from "react";
import {
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  getCanvasSize,
} from "@/components/misc/shaders/grain/grain.shader";
import * as styles from "./body-grain-overlay.css";

const GRAIN_TARGET_FPS = 10;
const GRAIN_FRAME_MS = 1000 / GRAIN_TARGET_FPS;

function BodyGrainOverlayComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let frameId = 0;
    let disposed = false;
    let isRendering = false;
    let lastFrame = 0;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotionRef = { current: mediaQuery.matches };

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });

    if (!gl) return;

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

    if (!resolutionLocation || !timeLocation) {
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    const resize = () => {
      const { width, height } = getCanvasSize();

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLocation, width, height);
    };

    const start = performance.now();

    const render = (now: number) => {
      if (disposed) return;

      if (!reducedMotionRef.current && now - lastFrame < GRAIN_FRAME_MS) {
        frameId = window.requestAnimationFrame(render);
        return;
      }

      isRendering = true;
      lastFrame = now;
      const elapsed = reducedMotionRef.current ? 0 : (now - start) / 1000;

      gl.uniform1f(timeLocation, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (reducedMotionRef.current) {
        isRendering = false;
        return;
      }

      frameId = window.requestAnimationFrame(render);
    };

    const startRendering = () => {
      if (!isRendering && !disposed) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const onResize = () => {
      resize();
      startRendering();
    };

    const onMotionChange = () => {
      reducedMotionRef.current = mediaQuery.matches;
      startRendering();
    };

    resize();
    window.addEventListener("resize", onResize, { passive: true });
    mediaQuery.addEventListener("change", onMotionChange);
    startRendering();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      mediaQuery.removeEventListener("change", onMotionChange);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.bodyGrainOverlayStyles} aria-hidden="true" />;
}

export const BodyGrainOverlay = memo(BodyGrainOverlayComponent);
