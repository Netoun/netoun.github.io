---
target: homepage (/)
total_score: 25
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 4
target_identity: "file:app/pages/welcome/page/welcome.page.tsx"
target_fingerprint: "sha256:0c95f7c4c5ed0efd4f708d341c7f88e6041fd43c0ec396ddc7335bb6eab8168d"
target_path: app/pages/welcome/page/welcome.page.tsx
timestamp: 2026-09-28T14-41-31Z
slug: app-pages-welcome-page-welcome-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay), plus a separate technical audit. Production build preview, Playwright with a separate Chrome (the DevTools MCP was locked by another session).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Capsule shows section + progress; arrivals hide content for over 1 s |
| 2 | Match System / Real World | 3 | Native to peers; recruiters meet TASKS, SRC, HEAD, "14 tags"; CREATIVE holds Python |
| 3 | User Control and Freedom | 2 | Hover commits state (monitor selection, log filter); a tap on a row leaves the site |
| 4 | Consistency and Standards | 3 | Rigorous system; project names are unstyled links, "LABS →" in four forms |
| 5 | Error Prevention | 2 | Easy to open the wrong project (hover path to the detail pane), accidental opens on touch |
| 6 | Recognition Rather Than Recall | 3 | Key bar and receipt hint help; log filter and spec groups are hover-only, uncued |
| 7 | Flexibility and Efficiency | 3 | Arrows, Enter and sort in the monitor; capsule jumps |
| 8 | Aesthetic and Minimalist Design | 3 | Bookends excellent; the middle repeats (LED segments x5, three typed arrivals) |
| 9 | Error Recovery | 3 | WebGPU → WebGL → CSS fallbacks, no-JS and backdrop-filter fallbacks |
| 10 | Help and Documentation | n/a | A portfolio has no task that needs documentation |
| **Total** | | **25/36** | **Acceptable (69%), one point short of Good** |

Previous run (2026-09-27): 20/32 with 7 and 10 n/a. Without heuristic 7, this run is 22/32.

## Design Specificity Verdict

Authored for this product. Every middle section is a real dev-tool procedure fed by the data (`htop`, `git log --graph`, `fastfetch`, a patch panel), and the hero's spec layer prints measured values: proof, not claims. Generic spots: the hero lead ("fast, polished web products…") and the section descriptions ("Work history & professional experience"). The structural gap: the Labs, the real differentiator, appear on `/` only as a count and four text links.

Deterministic scan (URL, 1280 / 390): 254 / 258 findings. ai-color-palette 189 and dark-glow 17 are the documented gold/mint/violet palette and dark-panel glows (none on paper); wide-tracking 20 is Doto labels; blinking-cursor, oversized-h1, cream-palette, codex-grid, stripes, buried-raster, nested-cards are documented or aria-hidden hardware. False positives verified in the page: content-hidden-at-rest (measured mid-arrival; 1 % hidden after settling, the folded nav list), monitor low-contrast (5.7–7.2:1 labels and 19:1 values on real pixels; desktop descriptions are sr-only), text-occlusion (keycaps of the aria-hidden 3D laptop). Missed by the detector, found by both B and the audit: the rack caption at 3.8–4.0:1 over the footer mesh's gold bloom.

## Priority Issues

- **[P1] Hover commits state.** Monitor: `onHoverStart` selects rows and the detail pane sits below them, so moving to `_LIVE_ ↗` from Treashunt crosses the rows and lands on Lonestone Boilerplate. Log: an employer group is a pointerenter target, so scrolling with a resting mouse fades the other branches to 28 %. Touch: a tap on a monitor row (768 tablet, 390 blocks) opens the project in a new tab. Fix: hover intent (~150 ms) plus a safe triangle towards the pane, or commit on click/arrows only; filter the log from `branch -v` and the ref pills only, ignoring pointer events right after a scroll; on coarse pointers a tap selects, the name link opens. `/impeccable harden`, `/impeccable adapt`.
- **[P1] Hero h1 and lead clipped at 320–340 px after hydration** (WCAG 1.4.10). The aria-hidden swatch grid (`minmax(10.25rem, max-content)`, nowrap) stretches the flex column to 348 px; `welcomeContentStyle` has no `minWidth: 0`. Fix: `minWidth: 0` and `minmax(min(10.25rem, 100%), max-content)`. `/impeccable adapt`.
- **[P1] The closed contact beam animates forever from 768 px.** Mounted unconditionally at opacity 0 with infinite CSS animations and six SMIL `animateMotion` loops: 60 style recalcs and layouts per second at every scroll position, reduced motion included (SMIL ignores it). Fix: mount it only while the popover is open or the CTA is hovered; CSS `offset-path` instead of SMIL. `/impeccable optimize`.
- **[P1] The derived taxonomy contradicts the positioning.** The tag map's `creative` bucket is "creative & systems (graphics, games, low-level, AI)" but is labelled CREATIVE: Skills lists Rust and Python as creative, Sogeti reads 4 CREATIVE for a chatbot/ML job, the monitor's CREATIVE meter is the emptiest (02) under "creative developer". WebGPU's receipt is `@webgpu/types` while the hero renders with WebGPU. Fix: owner decides the buckets (systems/ML domain, or move them to backend/tooling); count the Labs as a source; point WebGPU at the renderer or the mesh Lab. `/impeccable clarify`.
- **[P2] The keyboard and screen-reader path diverges from the visual one.** The spec tabs are the first tab stop and are announced before the h1; the sections nav is `visibility: hidden` at the top, so Tab from the top never reaches it; the fixed dock half-covers focused items (no `scroll-padding-bottom`); the rack caption is 3.8:1 over the mesh (WCAG 1.4.3). Fix: spec header after the hero content in the DOM, nav revealed on `:focus-within`, `scrollPaddingBottom: dockClearance` on `html`, caption at paper 80 % or a local scrim. `/impeccable harden`.

## Persona Red Flags

- **Jordan (first-timer):** the first screen offers `.css.ts` file tabs; TASKS, SRC/LIVE, PID, "14 tags", "Uptime 9Y", `HEAD ->`; project names do not look like links.
- **Sam (screen reader + keyboard):** spec radiogroup before the h1; nav unreachable from the top; "_Get in touch_" and "_01 /" read as text; each monitor row is one ~40-word gridcell starting with the PID; React Aria announces in the browser language (no `I18nProvider`).
- **Casey (mobile):** about 13 screens (Projects alone 3,160 px); accidental external opens from rows; the translucent popover over the swatches; at 844×390 the capsule covers ~15 % of the height.
- **Technical peer (shared link):** hover opens the wrong project; Python and Rust under Creative; the default detail pane is a dark mirror of the current page; no Lab is visible on `/` without leaving it.

## Minor Observations

- Arrivals: three typed commands in a row, each gating content >1 s (400 ms: no rows; 1.2 s: 3 of 6). Trigger earlier (rootMargin), cap ~600 ms, skip after a nav jump.
- 200 % default text size at 1280: px breakpoints with rem tracks make the page 1,614 px wide and collapse HOST/STACK (WCAG 1.4.4); page zoom is fine.
- Host cell `github.com/lonestone/lonestone-boilerpla…` truncated with no fallback on mobile; port numbers 01–03 at 4.3:1 on the glass (aria-hidden); swatch OKLCH values at 30 % alpha (~2.3:1) although DESIGN.md says full strength.
- Captures ship 1216×760 for 653×368 with no `srcset` (~49 KiB); median LCP sits exactly on the 4.1 s budget; the FPS meter's rAF runs under reduced motion.
- Date ranges use an em dash (`JUL 2021 — NOW`); an en dash is the convention.
- Content check for the owner: Desoutter, Cuevr and Mon Rét@b' d'abord are named in the work log while AGENTS.md says Lonestone client work stays unnamed; the practice line reads "client work, not listed · Cuevr".

## Questions to Consider

- Success is peers exploring and sharing the Labs, yet the loudest object is `_GET IN TOUCH_` for someone not job-hunting: should one live Lab run on `/`?
- After four CLI procedures in a row, does the metaphor still carry meaning, or has "every section is a terminal" become the template?
- Real `htop` selects with keys, not hover: would click-to-select feel more like the machine?
