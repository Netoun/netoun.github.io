import { Profiler, useEffect, useReducer, useRef, useState, type ProfilerOnRenderCallback } from "react";

type MemoryInfo = {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
};

type PerformanceWithMemory = Performance & {
  memory?: MemoryInfo;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
  deviceMemory?: number;
};

type WebGlDebugInfo = {
  UNMASKED_VENDOR_WEBGL: number;
  UNMASKED_RENDERER_WEBGL: number;
};

type WebGpuAdapterInfo = {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
};

type WebGpuAdapterWithInfo = GPUAdapter & {
  requestAdapterInfo?: () => Promise<WebGpuAdapterInfo>;
  info?: WebGpuAdapterInfo;
};

type FpsStats = {
  current: number;
  average: number;
  min: number;
  droppedFrames: number;
  jankFrames: number;
  mainThreadPressure: number;
};

type LongTaskRecord = {
  name: string;
  startTime: number;
  duration: number;
};

type ReactCommitRecord = {
  id: string;
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
};

type LayoutShiftRecord = {
  startTime: number;
  value: number;
  hadRecentInput: boolean;
};

type GpuInfo = {
  webglVendor: string | null;
  webglRenderer: string | null;
  webgpuAvailable: boolean;
  webgpuInfo: WebGpuAdapterInfo | null;
};

type PerfDiagnostic = {
  severity: "info" | "warning" | "critical";
  area: "fps" | "main-thread" | "react" | "gpu" | "memory" | "layout" | "setup";
  message: string;
  evidence: string;
  nextStep: string;
};

type PerfSnapshot = {
  schemaVersion: 1;
  url: string;
  userAgent: string;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  viewport: string;
  screen: string;
  dpr: number;
  pointer: string;
  hover: string;
  reducedMotion: boolean;
  networkEffectiveType: string | null;
  saveData: boolean | null;
  timestamp: string;
  fps: FpsStats;
  memory: MemoryInfo | null;
  gpu: GpuInfo;
  canvases: Array<{
    label: string | null;
    renderer: string | null;
    width: number;
    height: number;
    cssWidth: number;
    cssHeight: number;
    ready: boolean;
  }>;
  longTasks: LongTaskRecord[];
  layoutShifts: LayoutShiftRecord[];
  reactCommits: ReactCommitRecord[];
};

type AgentPerfReport = {
  schemaVersion: 1;
  generatedAt: string;
  summary: string;
  diagnostics: PerfDiagnostic[];
  markdown: string;
  snapshot: PerfSnapshot;
};

declare global {
  interface Window {
    __perfDebug?: {
      version: 1;
      recordReactCommit: (commit: ReactCommitRecord) => void;
      getSnapshot: () => PerfSnapshot | null;
      getReport: () => AgentPerfReport | null;
      copyReport: () => Promise<boolean>;
      downloadReport: () => boolean;
      reset: () => void;
      waitForReport: (timeoutMs?: number) => Promise<AgentPerfReport | null>;
    };
  }
}

const ACTIVE_STORAGE_KEY = "netoun:perf-debug";
const MAX_RECORDS = 80;

function isPerfDebugActive() {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get("perf");

  if (queryValue === "0" || queryValue === "false") {
    window.localStorage.removeItem(ACTIVE_STORAGE_KEY);
    return false;
  }

  if (queryValue === "1" || queryValue === "true") {
    window.localStorage.setItem(ACTIVE_STORAGE_KEY, "1");
    return true;
  }

  return window.localStorage.getItem(ACTIVE_STORAGE_KEY) === "1";
}

function bytesToMb(bytes: number) {
  return Math.round((bytes / 1024 / 1024) * 10) / 10;
}

function round(value: number, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function getMemorySnapshot() {
  return (performance as PerformanceWithMemory).memory ?? null;
}

function getCanvasSnapshots() {
  return Array.from(document.querySelectorAll("canvas")).map((canvas) => {
    const rect = canvas.getBoundingClientRect();

    return {
      label: canvas.dataset.perfLabel ?? (canvas.id || null),
      renderer: canvas.dataset.perfRenderer ?? null,
      width: canvas.width,
      height: canvas.height,
      cssWidth: round(rect.width),
      cssHeight: round(rect.height),
      ready: canvas.dataset.ready === "true",
    };
  });
}

async function readGpuInfo(): Promise<GpuInfo> {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl");
  let webglVendor: string | null = null;
  let webglRenderer: string | null = null;

  if (gl) {
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info") as WebGlDebugInfo | null;
    if (debugInfo) {
      webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string;
      webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
    }
  }

  let adapter: WebGpuAdapterWithInfo | null = null;

  try {
    adapter = navigator.gpu ? ((await navigator.gpu.requestAdapter()) as WebGpuAdapterWithInfo | null) : null;
  } catch {
    adapter = null;
  }
  const webgpuInfo = adapter?.requestAdapterInfo
    ? await adapter.requestAdapterInfo()
    : adapter?.info ?? null;

  return {
    webglVendor,
    webglRenderer,
    webgpuAvailable: Boolean(navigator.gpu && adapter),
    webgpuInfo,
  };
}

function downloadJsonReport(report: AgentPerfReport) {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `perf-report-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function getWorstCommit(snapshot: PerfSnapshot) {
  return snapshot.reactCommits.reduce<ReactCommitRecord | null>((slowest, commit) => {
    if (!slowest || commit.actualDuration > slowest.actualDuration) return commit;
    return slowest;
  }, null);
}

function getLongTaskTotal(snapshot: PerfSnapshot) {
  return snapshot.longTasks.reduce((total, task) => total + task.duration, 0);
}

function createDiagnostics(snapshot: PerfSnapshot): PerfDiagnostic[] {
  const diagnostics: PerfDiagnostic[] = [];
  const worstCommit = getWorstCommit(snapshot);
  const longTaskTotal = getLongTaskTotal(snapshot);
  const [viewportWidth = 0] = snapshot.viewport.split("x").map(Number);
  const isSmallMobile = viewportWidth > 0 && viewportWidth <= 430;
  const largestCanvas = snapshot.canvases.reduce<(typeof snapshot.canvases)[number] | null>(
    (largest, canvas) => {
      if (!largest || canvas.width * canvas.height > largest.width * largest.height) return canvas;
      return largest;
    },
    null,
  );

  if (snapshot.fps.average > 0 && snapshot.fps.average < 45) {
    diagnostics.push({
      severity: "critical",
      area: "fps",
      message: "Average FPS is below the 45 FPS investigation threshold.",
      evidence: `avg=${snapshot.fps.average}, min=${snapshot.fps.min}, dropped=${snapshot.fps.droppedFrames}`,
      nextStep: "Compare long tasks and React commits. If both are low, inspect canvas/GPU shaders and CSS effects.",
    });
  } else if (snapshot.fps.min > 0 && snapshot.fps.min < 50) {
    diagnostics.push({
      severity: "warning",
      area: "fps",
      message: "FPS dips were observed even if average FPS may be acceptable.",
      evidence: `min=${snapshot.fps.min}, jank=${snapshot.fps.jankFrames}, dropped=${snapshot.fps.droppedFrames}`,
      nextStep: "Reproduce while scrolling/hovering and inspect the exact moment with Chrome Performance trace.",
    });
  }

  if (isSmallMobile && snapshot.dpr >= 2.5) {
    diagnostics.push({
      severity: "warning",
      area: "gpu",
      message: "Small mobile viewport with high DPR increases canvas pixel cost sharply.",
      evidence: `viewport=${snapshot.viewport}, screen=${snapshot.screen}, dpr=${snapshot.dpr}`,
      nextStep: "Cap shader canvas DPR/quality on small screens and compare FPS before changing React code.",
    });
  }

  if (isSmallMobile && snapshot.pointer === "coarse" && snapshot.hover === "none") {
    diagnostics.push({
      severity: "info",
      area: "setup",
      message: "Capture is running in a touch-first mobile context.",
      evidence: `pointer=${snapshot.pointer}, hover=${snapshot.hover}`,
      nextStep: "Check hover-only visual effects and mouse-driven animation loops for unnecessary work on touch devices.",
    });
  }

  if (snapshot.longTasks.length > 0) {
    diagnostics.push({
      severity: longTaskTotal > 250 ? "critical" : "warning",
      area: "main-thread",
      message: "Long tasks blocked the main thread during the capture.",
      evidence: `${snapshot.longTasks.length} long tasks, total=${round(longTaskTotal)}ms, worst=${round(snapshot.longTasks[0]?.duration ?? 0)}ms`,
      nextStep: "Open a Chrome Performance trace and inspect scripting/style/layout blocks around these timestamps.",
    });
  }

  if (worstCommit && worstCommit.actualDuration > 16) {
    diagnostics.push({
      severity: worstCommit.actualDuration > 50 ? "critical" : "warning",
      area: "react",
      message: "A React commit exceeded one frame budget.",
      evidence: `${worstCommit.id} ${worstCommit.phase} actual=${worstCommit.actualDuration}ms base=${worstCommit.baseDuration}ms`,
      nextStep: "Inspect the profiled subtree for state updates tied to animation, mouse movement, selection, or deferred sections.",
    });
  }

  if (largestCanvas && largestCanvas.width * largestCanvas.height > 2_500_000) {
    diagnostics.push({
      severity: "warning",
      area: "gpu",
      message: "A large canvas may be expensive on integrated GPUs or high-DPR displays.",
      evidence: `${largestCanvas.label ?? "unlabelled canvas"}: ${largestCanvas.width}x${largestCanvas.height}, renderer=${largestCanvas.renderer ?? "unknown"}`,
      nextStep: "Try lowering DPR/quality for this shader, pausing it offscreen, or switching powerPreference to low-power for comparison.",
    });
  }

  if (snapshot.canvases.some((canvas) => !canvas.ready)) {
    diagnostics.push({
      severity: "info",
      area: "gpu",
      message: "At least one canvas was mounted but not marked ready yet.",
      evidence: snapshot.canvases
        .filter((canvas) => !canvas.ready)
        .map((canvas) => canvas.label ?? "unlabelled canvas")
        .join(", "),
      nextStep: "Capture again after initial load, or inspect shader initialization/fallback timeout.",
    });
  }

  if (snapshot.layoutShifts.length > 0) {
    const cls = snapshot.layoutShifts.reduce((total, shift) => total + shift.value, 0);
    diagnostics.push({
      severity: cls > 0.1 ? "warning" : "info",
      area: "layout",
      message: "Layout shifts were observed during the capture.",
      evidence: `shifts=${snapshot.layoutShifts.length}, clsSample=${round(cls, 4)}`,
      nextStep: "Check lazy sections, font loading, image dimensions, and animated layout-affecting properties.",
    });
  }

  if (snapshot.memory) {
    const heapRatio = snapshot.memory.usedJSHeapSize / snapshot.memory.jsHeapSizeLimit;
    if (heapRatio > 0.7) {
      diagnostics.push({
        severity: "warning",
        area: "memory",
        message: "JS heap usage is high relative to the browser limit.",
        evidence: `used=${bytesToMb(snapshot.memory.usedJSHeapSize)}MB limit=${bytesToMb(snapshot.memory.jsHeapSizeLimit)}MB`,
        nextStep: "Take a heap snapshot and inspect retained arrays, animation state, and canvas resources.",
      });
    }
  }

  if (diagnostics.length === 0) {
    diagnostics.push({
      severity: "info",
      area: "setup",
      message: "No obvious issue crossed the built-in thresholds in this sample.",
      evidence: `avg=${snapshot.fps.average}, longTasks=${snapshot.longTasks.length}, reactCommits=${snapshot.reactCommits.length}`,
      nextStep: "Record a longer sample on an affected PC and add a Chrome Performance trace for frame-level analysis.",
    });
  }

  return diagnostics;
}

function createAgentReport(snapshot: PerfSnapshot): AgentPerfReport {
  const diagnostics = createDiagnostics(snapshot);
  const worstCommit = getWorstCommit(snapshot);
  const longTaskTotal = getLongTaskTotal(snapshot);
  const summary = `FPS avg ${snapshot.fps.average}, min ${snapshot.fps.min}, dropped ${snapshot.fps.droppedFrames}; long tasks ${snapshot.longTasks.length}/${round(longTaskTotal)}ms; React worst ${worstCommit ? `${worstCommit.id} ${worstCommit.actualDuration}ms` : "none"}; canvases ${snapshot.canvases.length}.`;
  const markdown = [
    "# Performance Debug Report",
    "",
    `Generated: ${snapshot.timestamp}`,
    `URL: ${snapshot.url}`,
    `Viewport: ${snapshot.viewport} @ DPR ${snapshot.dpr}`,
    `Screen: ${snapshot.screen}, pointer=${snapshot.pointer}, hover=${snapshot.hover}, reducedMotion=${snapshot.reducedMotion}`,
    `Network: ${snapshot.networkEffectiveType ?? "n/a"}, saveData=${snapshot.saveData ?? "n/a"}`,
    `Device: ${snapshot.hardwareConcurrency ?? "n/a"} cores, ${snapshot.deviceMemory ?? "n/a"}GB memory hint`,
    `GPU: ${snapshot.gpu.webglRenderer ?? "unknown WebGL renderer"}`,
    "",
    "## Summary",
    summary,
    "",
    "## Diagnostics",
    ...diagnostics.map(
      (diagnostic) =>
        `- [${diagnostic.severity}] ${diagnostic.area}: ${diagnostic.message} Evidence: ${diagnostic.evidence}. Next: ${diagnostic.nextStep}`,
    ),
    "",
    "## Canvas Inventory",
    ...snapshot.canvases.map(
      (canvas) =>
        `- ${canvas.label ?? "unlabelled"}: ${canvas.width}x${canvas.height} css=${canvas.cssWidth}x${canvas.cssHeight} renderer=${canvas.renderer ?? "unknown"} ready=${canvas.ready}`,
    ),
    "",
    "## Agent Commands",
    "- `await window.__perfDebug.waitForReport(5000)`",
    "- `window.__perfDebug.getReport()`",
    "- `await window.__perfDebug.copyReport()`",
    "- `window.__perfDebug.reset()`",
  ].join("\n");

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    summary,
    diagnostics,
    markdown,
    snapshot,
  };
}

function usePerfSampler(active: boolean) {
  const [, forceRender] = useReducer((value: number) => value + 1, 0);
  const fpsRef = useRef<FpsStats>({
    current: 0,
    average: 0,
    min: 0,
    droppedFrames: 0,
    jankFrames: 0,
    mainThreadPressure: 0,
  });
  const longTasksRef = useRef<LongTaskRecord[]>([]);
  const layoutShiftsRef = useRef<LayoutShiftRecord[]>([]);
  const reactCommitsRef = useRef<ReactCommitRecord[]>([]);
  const snapshotRef = useRef<PerfSnapshot | null>(null);
  const [gpuInfo, setGpuInfo] = useState<GpuInfo | null>(null);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;

    void readGpuInfo().then((info) => {
      if (!cancelled) setGpuInfo(info);
    });

    return () => {
      cancelled = true;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const reset = () => {
      longTasksRef.current = [];
      layoutShiftsRef.current = [];
      reactCommitsRef.current = [];
      fpsRef.current = {
        current: 0,
        average: 0,
        min: 0,
        droppedFrames: 0,
        jankFrames: 0,
        mainThreadPressure: 0,
      };
      snapshotRef.current = null;
    };

    const getReport = () => {
      const snapshot = snapshotRef.current;
      return snapshot ? createAgentReport(snapshot) : null;
    };

    const recordReactCommit = (commit: ReactCommitRecord) => {
      reactCommitsRef.current = [commit, ...reactCommitsRef.current].slice(0, MAX_RECORDS);
    };

    window.__perfDebug = {
      version: 1,
      recordReactCommit,
      getSnapshot: () => snapshotRef.current,
      getReport,
      copyReport: async () => {
        const report = getReport();
        if (!report || !navigator.clipboard) return false;

        await navigator.clipboard.writeText(report.markdown);
        return true;
      },
      downloadReport: () => {
        const report = getReport();
        if (!report) return false;

        downloadJsonReport(report);
        return true;
      },
      reset,
      waitForReport: (timeoutMs = 5000) => {
        const startedAt = performance.now();

        return new Promise((resolve) => {
          const check = () => {
            const report = getReport();
            if (report) {
              resolve(report);
              return;
            }

            if (performance.now() - startedAt >= timeoutMs) {
              resolve(null);
              return;
            }

            window.setTimeout(check, 100);
          };

          check();
        });
      },
    };

    return () => {
      delete window.__perfDebug;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const observers: PerformanceObserver[] = [];

    if (PerformanceObserver.supportedEntryTypes.includes("longtask")) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries().map((entry) => ({
          name: entry.name,
          startTime: round(entry.startTime, 2),
          duration: round(entry.duration, 2),
        }));

        longTasksRef.current = [...entries, ...longTasksRef.current].slice(0, MAX_RECORDS);
      });

      observer.observe({ type: "longtask", buffered: true });
      observers.push(observer);
    }

    if (PerformanceObserver.supportedEntryTypes.includes("layout-shift")) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries().flatMap((entry) => {
          const layoutShift = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };

          if (layoutShift.hadRecentInput) return [];

          return {
            startTime: round(layoutShift.startTime, 2),
            value: round(layoutShift.value ?? 0, 4),
            hadRecentInput: Boolean(layoutShift.hadRecentInput),
          };
        });

        layoutShiftsRef.current = [...entries, ...layoutShiftsRef.current].slice(0, MAX_RECORDS);
      });

      observer.observe({ type: "layout-shift", buffered: true });
      observers.push(observer);
    }

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [active]);

  useEffect(() => {
    if (!active || !gpuInfo) return;

    let frameId = 0;
    let updateId = 0;
    let lastFrameTime = performance.now();
    let lastSecondTime = lastFrameTime;
    let sampleStartTime = lastFrameTime;
    let frames = 0;
    let totalFrames = 0;
    let minFps = Number.POSITIVE_INFINITY;
    let droppedFrames = 0;
    let jankFrames = 0;
    let blockedFrameMs = 0;

    const sampleFrame = (now: number) => {
      const delta = now - lastFrameTime;
      lastFrameTime = now;
      frames += 1;
      totalFrames += 1;

      if (delta > 24) jankFrames += 1;
      if (delta > 34) {
        droppedFrames += Math.max(1, Math.floor(delta / 16.67) - 1);
        blockedFrameMs += delta - 16.67;
      }

      if (now - lastSecondTime >= 1000) {
        const current = (frames * 1000) / (now - lastSecondTime);
        minFps = Math.min(minFps, current);

        fpsRef.current = {
          current: round(current),
          average: round((totalFrames * 1000) / (now - sampleStartTime)),
          min: round(Number.isFinite(minFps) ? minFps : current),
          droppedFrames,
          jankFrames,
          mainThreadPressure: round(Math.min(100, (blockedFrameMs / (now - sampleStartTime)) * 100), 1),
        };

        frames = 0;
        lastSecondTime = now;
      }

      frameId = requestAnimationFrame(sampleFrame);
    };

    const updateSnapshot = () => {
      snapshotRef.current = {
        schemaVersion: 1,
        url: window.location.href,
        userAgent: navigator.userAgent,
        deviceMemory: "deviceMemory" in navigator ? ((navigator as NavigatorWithConnection).deviceMemory ?? null) : null,
        hardwareConcurrency: navigator.hardwareConcurrency || null,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        screen: `${window.screen.width}x${window.screen.height}`,
        dpr: window.devicePixelRatio,
        pointer: window.matchMedia("(pointer: coarse)").matches ? "coarse" : "fine",
        hover: window.matchMedia("(hover: hover)").matches ? "hover" : "none",
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        networkEffectiveType: (navigator as NavigatorWithConnection).connection?.effectiveType ?? null,
        saveData: (navigator as NavigatorWithConnection).connection?.saveData ?? null,
        timestamp: new Date().toISOString(),
        fps: fpsRef.current,
        memory: getMemorySnapshot(),
        gpu: gpuInfo,
        canvases: getCanvasSnapshots(),
        longTasks: longTasksRef.current,
        layoutShifts: layoutShiftsRef.current,
        reactCommits: reactCommitsRef.current,
      };

      forceRender();
      updateId = window.setTimeout(updateSnapshot, 1000);
    };

    frameId = requestAnimationFrame(sampleFrame);
    updateSnapshot();

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(updateId);
    };
  }, [active, gpuInfo]);

  return snapshotRef;
}

export function PerformanceDebugPanel() {
  const [active, setActive] = useState(false);
  const snapshotRef = usePerfSampler(active);
  const snapshot = snapshotRef.current;

  useEffect(() => {
    setActive(isPerfDebugActive());
  }, []);

  if (!active) return null;

  const memory = snapshot?.memory;
  const report = snapshot ? createAgentReport(snapshot) : null;
  const worstCommit = snapshot ? getWorstCommit(snapshot) : null;
  const longTaskTotal = snapshot ? getLongTaskTotal(snapshot) : 0;

  return (
    <aside style={panelStyles} aria-label="Performance debug panel">
      <div style={headerStyles}>
        <strong>Perf debug</strong>
        <button
          type="button"
          style={buttonStyles}
          onClick={() => {
            if (report) downloadJsonReport(report);
          }}
        >
          Export JSON
        </button>
      </div>
      <dl style={gridStyles}>
        <Metric label="FPS" value={`${snapshot?.fps.current ?? "..."}`} />
        <Metric label="Avg" value={`${snapshot?.fps.average ?? "..."}`} />
        <Metric label="Min" value={`${snapshot?.fps.min ?? "..."}`} />
        <Metric label="Dropped" value={`${snapshot?.fps.droppedFrames ?? "..."}`} />
        <Metric label="Jank" value={`${snapshot?.fps.jankFrames ?? "..."}`} />
        <Metric label="Pressure" value={`${snapshot?.fps.mainThreadPressure ?? "..."}%`} />
        <Metric label="Long tasks" value={`${snapshot?.longTasks.length ?? 0} / ${round(longTaskTotal)}ms`} />
        <Metric label="React worst" value={worstCommit ? `${worstCommit.id} ${round(worstCommit.actualDuration)}ms` : "none"} />
        <Metric label="Heap" value={memory ? `${bytesToMb(memory.usedJSHeapSize)}MB` : "n/a"} />
        <Metric label="GPU" value={snapshot?.gpu.webglRenderer ?? (snapshot?.gpu.webgpuAvailable ? "WebGPU" : "n/a")} />
        <Metric label="Canvas" value={`${snapshot?.canvases.length ?? 0}`} />
      </dl>
      {report ? <p style={diagnosticStyles}>{report.diagnostics[0]?.message}</p> : null}
      <p style={hintStyles}>Active via <code>?perf=1</code>. Disable via <code>?perf=0</code>.</p>
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt style={metricLabelStyles}>{label}</dt>
      <dd style={metricValueStyles}>{value}</dd>
    </div>
  );
}

export function PerformanceDebugProfiler({ id, children }: { id: string; children: React.ReactNode }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(isPerfDebugActive());
  }, []);

  const handleRender: ProfilerOnRenderCallback = (
    profilerId,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  ) => {
    window.__perfDebug?.recordReactCommit({
      id: profilerId,
      phase,
      actualDuration: round(actualDuration, 2),
      baseDuration: round(baseDuration, 2),
      startTime: round(startTime, 2),
      commitTime: round(commitTime, 2),
    });
  };

  if (!active) return children;

  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
}

const panelStyles: React.CSSProperties = {
  position: "fixed",
  right: 12,
  bottom: 12,
  zIndex: 9999,
  width: 340,
  maxWidth: "calc(100vw - 24px)",
  padding: 12,
  border: "1px solid rgba(255, 255, 255, 0.16)",
  borderRadius: 12,
  background: "rgba(8, 10, 16, 0.9)",
  color: "#f5f7ff",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  fontSize: 12,
  boxShadow: "0 16px 60px rgba(0, 0, 0, 0.35)",
  backdropFilter: "blur(14px)",
};

const headerStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  marginBottom: 10,
};

const buttonStyles: React.CSSProperties = {
  border: "1px solid rgba(255, 255, 255, 0.16)",
  borderRadius: 999,
  padding: "4px 9px",
  background: "rgba(255, 255, 255, 0.08)",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
};

const gridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
  margin: 0,
};

const metricLabelStyles: React.CSSProperties = {
  margin: 0,
  color: "rgba(245, 247, 255, 0.58)",
};

const metricValueStyles: React.CSSProperties = {
  margin: "2px 0 0",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const hintStyles: React.CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(245, 247, 255, 0.62)",
};

const diagnosticStyles: React.CSSProperties = {
  margin: "10px 0 0",
  color: "rgba(255, 214, 128, 0.92)",
};
