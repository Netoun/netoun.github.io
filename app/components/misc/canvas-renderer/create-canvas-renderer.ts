import type {
  RendererOptions,
  RendererSession,
  RendererType,
  ShaderBundle,
  Uniforms,
} from "./canvas-renderer.types";

declare global {
  interface Navigator {
    gpu?: GPU;
  }
}

type WebGPUContext = {
  device: GPUDevice;
  context: GPUCanvasContext;
  pipeline: GPURenderPipeline;
  bindGroup: GPUBindGroup;
  uniformBuffer: GPUBuffer;
  format: GPUTextureFormat;
};

type WebGLData = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uniforms: Map<string, WebGLUniformLocation>;
  resolutionLoc: WebGLUniformLocation | null;
  timeLoc: WebGLUniformLocation | null;
  qualityLoc: WebGLUniformLocation | null;
  positionBuffer: WebGLBuffer;
};

function getDevicePixelRatio(options: RendererOptions): number {
  const dpr = window.devicePixelRatio || 1;
  const min = options.renderScale?.min ?? 1;
  const max = options.renderScale?.max ?? dpr;
  return Math.min(Math.max(dpr, min), max);
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  dpr: number,
  useBoundingRect?: boolean,
): { width: number; height: number } {
  let cssWidth: number;
  let cssHeight: number;
  if (useBoundingRect) {
    const rect = canvas.getBoundingClientRect();
    cssWidth = rect.width;
    cssHeight = rect.height;
  } else {
    cssWidth = canvas.offsetWidth;
    cssHeight = canvas.offsetHeight;
  }
  const width = Math.max(1, Math.floor(cssWidth * dpr));
  const height = Math.max(1, Math.floor(cssHeight * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height };
}

function compileGLShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (import.meta.env.DEV) console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function setupWebGL(
  canvas: HTMLCanvasElement,
  shader: ShaderBundle,
  options: RendererOptions,
): WebGLData | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: options.powerPreference ?? "high-performance",
  });
  if (!gl) return null;

  const vertexShader = compileGLShader(gl, gl.VERTEX_SHADER, shader.vertexGLSL);
  const fragmentShader = compileGLShader(gl, gl.FRAGMENT_SHADER, shader.fragmentGLSL);
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
    if (import.meta.env.DEV) console.warn(gl.getProgramInfoLog(program));
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

  const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
  const timeLoc = gl.getUniformLocation(program, "u_time");
  const qualityLoc = gl.getUniformLocation(program, "u_quality");

  const uniformMap = new Map<string, WebGLUniformLocation>();
  if (resolutionLoc) uniformMap.set("u_resolution", resolutionLoc);
  if (timeLoc) uniformMap.set("u_time", timeLoc);
  if (qualityLoc) uniformMap.set("u_quality", qualityLoc);

  return {
    gl,
    program,
    uniforms: uniformMap,
    resolutionLoc,
    timeLoc,
    qualityLoc,
    positionBuffer,
  };
}

function applyWebGLUniforms(gl: WebGLRenderingContext, data: WebGLData, uniforms: Uniforms) {
  for (const [name, value] of Object.entries(uniforms)) {
    const loc = data.uniforms.get(name);
    if (!loc) continue;
    if (typeof value === "number") {
      gl.uniform1f(loc, value);
    } else if (value.length === 2) {
      gl.uniform2f(loc, value[0], value[1]);
    } else if (value.length === 3) {
      gl.uniform3f(loc, value[0], value[1], value[2]);
    } else if (value.length === 4) {
      gl.uniform4f(loc, value[0], value[1], value[2], value[3]);
    }
  }
}

async function setupWebGPU(
  canvas: HTMLCanvasElement,
  shader: ShaderBundle,
  options: RendererOptions,
  quality: number,
  shouldAbort: () => boolean,
): Promise<WebGPUContext | null> {
  const gpu = navigator.gpu;
  if (!gpu || !shader.webgpuWGSL || shouldAbort()) return null;

  const adapter = await gpu.requestAdapter({
    powerPreference: options.powerPreference ?? "high-performance",
  });
  if (!adapter || shouldAbort()) return null;

  const device = await adapter.requestDevice();
  if (shouldAbort()) {
    device.destroy();
    return null;
  }

  const context = canvas.getContext("webgpu");
  if (!context || shouldAbort()) {
    device.destroy();
    return null;
  }

  const format = gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "premultiplied" });

  const shaderModule = device.createShaderModule({ code: shader.webgpuWGSL });
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: shaderModule, entryPoint: "vsMain" },
    fragment: {
      module: shaderModule,
      entryPoint: "fsMain",
      targets: [{ format }],
    },
    primitive: { topology: "triangle-list" },
  });

  const uniformBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
  });

  return { device, context, pipeline, bindGroup, uniformBuffer, format };
}

function drawWebGPU(ctx: WebGPUContext, canvas: HTMLCanvasElement, uniforms: Uniforms) {
  const resolution = uniforms.u_resolution as [number, number] | undefined;
  const time = (uniforms.u_time as number) ?? 0;
  const quality = (uniforms.u_quality as number) ?? 0;

  const w = canvas.width;
  const h = canvas.height;

  ctx.device.queue.writeBuffer(
    ctx.uniformBuffer,
    0,
    new Float32Array([resolution?.[0] ?? w, resolution?.[1] ?? h, time, quality]),
  );

  const encoder = ctx.device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: ctx.context.getCurrentTexture().createView(),
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });
  pass.setPipeline(ctx.pipeline);
  pass.setBindGroup(0, ctx.bindGroup);
  pass.draw(6);
  pass.end();
  ctx.device.queue.submit([encoder.finish()]);
}

export function createCanvasRenderer(
  canvas: HTMLCanvasElement,
  shader: ShaderBundle,
  options: RendererOptions = {},
): Promise<RendererSession> {
  return new Promise((resolve) => {
    let type: RendererType = "pending";
    let cleanupFn: (() => void) | null = null;
    let cancelled = false;
    let drawQueued = false;
    let frameId: number | null = null;
    let resizeDebounceId: number | null = null;
    let webglData: WebGLData | null = null;
    let webgpuCtx: WebGPUContext | null = null;
    let isVisible = true;
    let reducedMotion = false;

    const dpr = getDevicePixelRatio(options);

    function destroy() {
      cancelled = true;
      if (frameId !== null) cancelAnimationFrame(frameId);
      if (resizeDebounceId !== null) clearTimeout(resizeDebounceId);
      cleanupFn?.();
    }

    function resolveRenderer(r: RendererType) {
      type = r;
      options.onReady?.(r);
      const session: RendererSession = {
        get type() {
          return type;
        },
        redraw() {
          if (type === "webgl" || type === "webgpu") scheduleDraw();
        },
        updateUniforms(newUniforms: Uniforms) {
          Object.assign(options.uniforms ?? {}, newUniforms);
          scheduleDraw();
        },
        destroy() {
          destroy();
        },
      };
      resolve(session);
    }

    function scheduleDraw() {
      if (cancelled || drawQueued) return;
      if (!isVisible || reducedMotion) return;
      drawQueued = true;
      if (options.animate) {
        frameId = requestAnimationFrame(renderFrame);
      } else {
        frameId = requestAnimationFrame(() => {
          renderFrame(0);
        });
      }
    }

    function renderFrame(_now: number) {
      drawQueued = false;
      frameId = null;
      if (cancelled) return;
      if (!isVisible || reducedMotion) return;

      const { width, height } = resizeCanvas(canvas, dpr);

      const quality = options.quality?.() ?? 0;
      const uniforms: Uniforms = {
        u_resolution: [width, height],
        u_time: 0,
        u_quality: quality,
        ...options.uniforms,
      };

      if (webgpuCtx) {
        drawWebGPU(webgpuCtx, canvas, uniforms);
      } else if (webglData) {
        webglData.gl.viewport(0, 0, width, height);
        applyWebGLUniforms(webglData.gl, webglData, uniforms);
        webglData.gl.drawArrays(webglData.gl.TRIANGLES, 0, 6);
      }

      canvas.dataset.ready = "true";

      if (options.animate) {
        scheduleDraw();
      }
    }

    function onResize() {
      if (cancelled) return;
      scheduleDraw();
    }

    function onResizeDebounced() {
      if (cancelled) return;
      if (resizeDebounceId !== null) clearTimeout(resizeDebounceId);
      resizeDebounceId = window.setTimeout(onResize, options.debounceResize ?? 0);
    }

    async function init() {
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      reducedMotion = options.respectReducedMotion !== false && motionQuery.matches;
      const handleMotion = (e: MediaQueryListEvent) => {
        reducedMotion = options.respectReducedMotion !== false && e.matches;
        scheduleDraw();
      };
      motionQuery.addEventListener("change", handleMotion);

      const visibilityObserver =
        options.respectVisibility !== false
          ? new IntersectionObserver(
              ([entry]) => {
                isVisible = entry.isIntersecting;
                scheduleDraw();
              },
              { threshold: 0 },
            )
          : null;
      visibilityObserver?.observe(canvas);

      const resizeObserver = new ResizeObserver(onResizeDebounced);
      resizeObserver.observe(canvas);
      window.addEventListener("resize", onResizeDebounced, { passive: true });

      cleanupFn = () => {
        motionQuery.removeEventListener("change", handleMotion);
        visibilityObserver?.disconnect();
        resizeObserver.disconnect();
        window.removeEventListener("resize", onResizeDebounced);
        if (webglData) {
          const { gl, program, positionBuffer } = webglData;
          gl.deleteBuffer(positionBuffer);
          gl.deleteProgram(program);
          const shaders = gl.getAttachedShaders(program);
          if (shaders) {
            for (const s of shaders) gl.deleteShader(s);
          }
        }
        if (webgpuCtx) {
          webgpuCtx.device.destroy();
        }
      };

      if (shader.webgpuWGSL) {
        try {
          let webgpuTimedOut = false;
          const gpuCleanup = await Promise.race([
            setupWebGPU(canvas, shader, options, 0, () => cancelled || webgpuTimedOut),
            new Promise<null>((r) =>
              setTimeout(() => {
                webgpuTimedOut = true;
                r(null);
              }, options.webgpuTimeout ?? 250),
            ),
          ]);
          if (!cancelled && gpuCleanup) {
            webgpuCtx = gpuCleanup;
            resolveRenderer("webgpu");
            scheduleDraw();
            return;
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("WebGPU renderer init failed, falling back to WebGL", error);
          }
        }
      }

      const wgl = setupWebGL(canvas, shader, options);
      if (!cancelled && wgl) {
        webglData = wgl;
        resolveRenderer("webgl");
        scheduleDraw();
        return;
      }

      if (!cancelled) {
        resolveRenderer("svg");
      }
    }

    void init();
  });
}
