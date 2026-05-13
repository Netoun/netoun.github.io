# Performance Debug

Dev-only tooling for investigating FPS drops on the welcome page and hero shaders.

## Enable

Run the app in dev mode and open the target page with `?perf=1`.

```bash
bun run dev
```

Disable persistent debug mode with `?perf=0`.

## Agent Workflow

An AI agent can use Chrome DevTools against a page where `?perf=1` is active and run:

```js
await window.__perfDebug.waitForReport(5000);
```

Useful commands:

```js
window.__perfDebug.getReport();
window.__perfDebug.getSnapshot();
await window.__perfDebug.copyReport();
window.__perfDebug.downloadReport();
window.__perfDebug.reset();
```

`getReport()` returns a versioned object with:

- `summary`: concise human-readable finding
- `diagnostics`: threshold-based findings with severity, evidence, and next step
- `markdown`: copy/paste-ready report for an agent or issue
- `snapshot`: raw FPS, long tasks, layout shifts, React commits, GPU info, memory, canvas inventory

## Small Mobile Workflow

For reports like "small phones lag badly", capture at least one sample with:

- width around `360px` to `390px`
- DPR `2` or `3`
- touch/coarse pointer emulation
- the hero visible for 5 to 10 seconds

In Chrome DevTools, emulate a small mobile device, open `/?perf=1`, reproduce the lag, then run:

```js
await window.__perfDebug.waitForReport(8000);
```

Look first at these fields:

- `snapshot.viewport`, `snapshot.screen`, `snapshot.dpr`
- `snapshot.pointer`, `snapshot.hover`, `snapshot.reducedMotion`
- `snapshot.fps.average`, `snapshot.fps.min`, `snapshot.fps.droppedFrames`
- `snapshot.canvases[].width` and `snapshot.canvases[].height`
- `diagnostics` entries for `gpu`, `main-thread`, and `react`

## Interpreting Reports

Use this priority order:

1. `longTasks` high: inspect main-thread scripting/style/layout in Chrome Performance.
2. `reactCommits` slow: inspect state updates in profiled React subtree.
3. FPS low but long tasks and React commits low: suspect GPU/canvas/CSS filters.
4. Large canvas at high DPR: test reduced shader quality or lower canvas resolution.
5. Layout shifts present: inspect lazy sections, font loading, image dimensions, and layout-affecting animations.

React profiling IDs currently include:

- `welcome-hero`
- `welcome-hero-background`
- `welcome-hero-contact-card`
- `welcome-hero-computer`
- `welcome-hero-computer-fake-console`
- `welcome-hero-computer-glitch-signal-map`
- `welcome-hero-computer-glyph-grid`
- `welcome-hero-computer-system-metrics`

## Current Instrumentation

- Global overlay in `app/root.tsx`
- React Profiler around `WelcomeHeroSection`
- Canvas labels on welcome hero shader
- Browser APIs: `requestAnimationFrame`, `PerformanceObserver`, Chrome heap memory when available, WebGL debug renderer info, WebGPU adapter info when available

Browsers do not expose true system CPU/GPU utilization to websites. The report uses web-observable proxies: frame pacing, long tasks, dropped frames, heap, canvas size, and GPU backend/renderer.

## Agent Runbook (Copy/Paste)

Use this checklist in a PR or issue when investigating welcome-page performance.

```md
### Performance Debug Runbook

1. Start dev server: `bun run dev`
2. Open target page with debug enabled: `?perf=1`
3. In DevTools Console, wait for a stable sample:
   - `await window.__perfDebug.waitForReport(5000)`
4. Collect data:
   - `window.__perfDebug.getReport()`
   - `window.__perfDebug.getSnapshot()`
   - Optional export: `await window.__perfDebug.copyReport()` or `window.__perfDebug.downloadReport()`
5. Prioritize findings in this order:
   1. `longTasks` high -> investigate main-thread scripting/style/layout in Chrome Performance
   2. `reactCommits` slow -> inspect state updates in profiled React subtree
   3. FPS low with low long tasks + low React commit cost -> suspect GPU/canvas/CSS filters
   4. Large canvas at high DPR -> test lower shader quality or reduced canvas resolution
   5. Layout shifts present -> inspect lazy sections, font loading, image dimensions, layout-affecting animations
6. If needed, reset and re-run:
   - `window.__perfDebug.reset()`

### Report Template

- Route tested:
- Device/OS/browser:
- Query params used: `?perf=1`
- Summary (`report.summary`):
- Top diagnostics (`report.diagnostics`):
- Snapshot highlights:
  - FPS / dropped frames:
  - Long tasks:
  - React commits:
  - Canvas inventory + DPR:
  - GPU backend/renderer:
  - Memory trend:
  - Layout shifts:
- Most likely bottleneck category: main-thread / React / GPU-canvas / layout
- Next fix to try:
- Validation plan after fix:
```
