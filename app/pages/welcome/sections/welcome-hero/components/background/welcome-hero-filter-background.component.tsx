import { memo, useEffect, useRef, useState } from "react";

import {
  SHADER_CONFIG,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  WEBGPU_SHADER,
  GPU_BUFFER_USAGE,
  getShaderQuality,
  getCanvasSize,
  type RendererType,
  type NavigatorWithGpu,
  type MinimalGPUCanvasContext,
} from "@/components/misc/shaders/mesh-background/mesh-background.shader";
import * as styles from "./welcome-hero-filter-background.css";

const MeshShaderBackground = memo(function MeshShaderBackground({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [renderer, setRenderer] = useState<RendererType>("pending");

  useEffect(() => {
    if (disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanup: (() => void) | null = null;
    let cancelled = false;
    let isVisible = true;

    const commonSetup = (onMotionChange?: () => void) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const reducedMotionRef = { current: mediaQuery.matches };
      const qualityValue = getShaderQuality();

      const handleMotion = () => {
        reducedMotionRef.current = mediaQuery.matches;
        onMotionChange?.();
      };

      mediaQuery.addEventListener("change", handleMotion);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) onMotionChange?.();
        },
        { threshold: 0 },
      );

      intersectionObserver.observe(canvas);

      return {
        qualityValue,
        reducedMotionRef,
        dispose: () => {
          mediaQuery.removeEventListener("change", handleMotion);
          intersectionObserver.disconnect();
        },
      };
    };

    const initWebGPU = async (shouldAbort: () => boolean) => {
      const gpu = (navigator as NavigatorWithGpu).gpu;
      if (!gpu || shouldAbort()) return null;

      const adapter = await gpu.requestAdapter({
        powerPreference: "high-performance",
      });
      if (!adapter || shouldAbort()) return null;

      const device = await adapter.requestDevice();
      if (shouldAbort()) {
        device.destroy();
        return null;
      }

      const context = canvas.getContext("webgpu") as MinimalGPUCanvasContext | null;
      if (!context || shouldAbort()) {
        device.destroy();
        return null;
      }

      const format = gpu.getPreferredCanvasFormat();

      context.configure({
        device,
        format,
        alphaMode: "premultiplied",
      });

      const shader = device.createShaderModule({ code: WEBGPU_SHADER });

      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: shader, entryPoint: "vsMain" },
        fragment: {
          module: shader,
          entryPoint: "fsMain",
          targets: [{ format }],
        },
        primitive: { topology: "triangle-list" },
      });

      const uniformBuffer = device.createBuffer({
        size: 16,
        usage: GPU_BUFFER_USAGE.UNIFORM | GPU_BUFFER_USAGE.COPY_DST,
      });

      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });

      let frameId = 0;
      let renderQueued = false;

      const resize = () => {
        const { width, height } = getCanvasSize(canvas);

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      };

      const render = (_now: number) => {
        renderQueued = false;
        if (shouldAbort()) return;

        if (!isVisible) {
          return;
        }

        const elapsed = 0;

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

        canvas.dataset.ready = "true";
      };

      const startRendering = () => {
        if (shouldAbort() || !isVisible) return;

        resize();

        if (!renderQueued) {
          renderQueued = true;
          frameId = window.requestAnimationFrame(render);
        }
      };

      const common = commonSetup(startRendering);

      resize();

      const resizeObserver = new ResizeObserver(startRendering);
      resizeObserver.observe(canvas);

      window.addEventListener("resize", startRendering, { passive: true });

      startRendering();

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", startRendering);
        common.dispose();
        device.destroy();
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
          if (import.meta.env.DEV) {
            console.warn(gl.getShaderInfoLog(shader));
          }

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
        return null;
      }

      const program = gl.createProgram();

      if (!program) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        if (import.meta.env.DEV) {
          console.warn(gl.getProgramInfoLog(program));
        }

        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      gl.useProgram(program);

      const positionBuffer = gl.createBuffer();

      if (!positionBuffer) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
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
        return null;
      }

      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
      const timeLocation = gl.getUniformLocation(program, "u_time");
      const qualityLocation = gl.getUniformLocation(program, "u_quality");

      if (!resolutionLocation || !timeLocation || !qualityLocation) {
        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
      }

      let frameId = 0;
      let renderQueued = false;

      const resize = () => {
        const { width, height } = getCanvasSize(canvas);

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }

        gl.viewport(0, 0, width, height);
        gl.uniform2f(resolutionLocation, width, height);
        gl.uniform1f(qualityLocation, common.qualityValue);
      };

      const render = (_now: number) => {
        renderQueued = false;
        if (cancelled) return;

        if (!isVisible) {
          return;
        }

        const elapsed = 0;

        gl.uniform1f(timeLocation, elapsed);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        canvas.dataset.ready = "true";
      };

      const startRendering = () => {
        if (cancelled || !isVisible) return;

        resize();

        if (!renderQueued) {
          renderQueued = true;
          frameId = window.requestAnimationFrame(render);
        }
      };

      const common = commonSetup(startRendering);

      resize();

      const resizeObserver = new ResizeObserver(startRendering);
      resizeObserver.observe(canvas);

      window.addEventListener("resize", startRendering, { passive: true });

      startRendering();

      return () => {
        window.cancelAnimationFrame(frameId);
        resizeObserver.disconnect();
        window.removeEventListener("resize", startRendering);
        common.dispose();

        gl.deleteBuffer(positionBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      };
    };

    const init = async () => {
      let webgpuTimedOut = false;
      let rendererType: RendererType | null = null;
      let rendererCleanup: (() => void) | null = null;

      try {
        const gpuCleanup = await Promise.race<Awaited<ReturnType<typeof initWebGPU>>>([
          initWebGPU(() => cancelled || webgpuTimedOut),
          new Promise<null>((resolve) => {
            window.setTimeout(() => {
              webgpuTimedOut = true;
              resolve(null);
            }, SHADER_CONFIG.webgpuInitTimeoutMs);
          }),
        ]);

        if (!cancelled && gpuCleanup) {
          rendererType = "webgpu";
          rendererCleanup = gpuCleanup;
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("WebGPU background initialization failed", error);
        }
      }

      if (!rendererType) {
        const glCleanup = initWebGL();

        if (!cancelled && glCleanup) {
          rendererType = "webgl";
          rendererCleanup = glCleanup;
        }
      }

      if (!rendererType && !cancelled) {
        rendererType = "svg";
      }

      if (rendererType && !cancelled) {
        setRenderer(rendererType);
        cleanup = rendererCleanup;
      }
    };

    void init();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [disabled]);

  if (disabled) {
    return null;
  }

  return (
    <div className={styles.welcomeMeshContainerStyles}>
      {renderer !== "svg" && (
        <canvas ref={canvasRef} className={styles.welcomeShaderCanvasStyles} aria-hidden="true" />
      )}
    </div>
  );
});

interface WelcomeHeroFilterBackgroundProps {
  disabled?: boolean;
}

function WelcomeHeroFilterBackgroundComponent({
  disabled = false,
}: WelcomeHeroFilterBackgroundProps) {
  return <MeshShaderBackground disabled={disabled} />;
}

export const WelcomeHeroFilterBackground = WelcomeHeroFilterBackgroundComponent;
