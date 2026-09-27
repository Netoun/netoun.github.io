# Homepage improvement plan

Source: Impeccable critique (dual-agent) + technical audit of `/`, run on 2026-09-27 against the production prerender.
Scores at that date: **design 20/32** (Acceptable, Nielsen 7 and 10 n/a) · **audit 10/20** (Acceptable).
Evidence archive: `.impeccable/critique/2026-09-27T13-15-49Z__app-pages-welcome-page-welcome-page-tsx.md`.

This file is the durable backlog. The Impeccable snapshot is keyed on the fingerprint of `app/pages/welcome/page/welcome.page.tsx` and closes itself as soon as that file changes — keep progress here (tick the boxes).

## How to resume in a new session

1. Branch `chore/tooling-core-upgrade` (not merged into `main` yet).
2. Run `/homepage <section>` (`hero`, `global`, `nav`, `projects`, `experience`, `skills`, `footer`, `closing`) — project skill in `.claude/skills/homepage/`. One section per session.
3. The skill runs the listed Impeccable commands in order, scoped to that section's files.
4. Verify on the production build, not the dev server: `bun run build` then `bunx vite preview --port 4173 --strictPort --host 127.0.0.1` (stop it afterwards). Check 1280 / 1440 / 1920, 390 portrait + landscape, keyboard, no-JS (`build/client/index.html`), reduced motion (code-verified — the DevTools MCP cannot emulate it).
5. `bun run check` before calling a section done; tick the boxes; re-run `/impeccable critique` + `/impeccable audit` at the end of the plan.

Tooling notes:

- The Impeccable detector cannot read Vanilla Extract source (`.css.ts` / `style={{…}}`): a source scan returning 0 proves nothing. Do not enable the Impeccable hook. Use the browser overlay pass on the build (`impeccable live-server --background`, inject `detect.js`, read `[impeccable]` console lines, then `live-server stop --keep-inject`).
- Until step 0 is done, the detector does not load the design system (it looks for a root `DESIGN.md` or `.impeccable/design.json`): ~160 of its findings are the documented palette and glows.

## Decisions taken (2026-09-27)

- **Labs** — captions `⤘ /labs/<slug>` on every live object + secondary hero CTA + LABS nav item + dedicated footer line. No invented content.
- **Middle sections** — targeted rework: lead project on 2 columns, SOURCE ↗ / LIVE ↗ labels, ACTIVE badge off projects, Experience on 2 columns, Skills with one taxonomy and fewer tags.
- **DESIGN.md** — generated at the repo root from code; `docs/design.md` deleted; links updated.
- **Preserve** — hero world (mesh gold/cyan/violet, grain, booting laptop, magnetic CTA, scroll-morph), Doto terminal vocabulary (`_❯ ▐ ⤘ _0N /`), dark footer panel with the rack and "ESTABLISH LINK". Never resurrect "The Signal" directions (carrier wave, dithering).

## Content Nicolas decides during execution (never invent)

- [x] Single role label — "Full-stack engineer" (hero h1) vs "Software Developer" (experience data) vs "Software Engineer" (`public/llms.txt`) → **"Full-stack engineer"** (Nicolas, 2026-09-27). Hero h1 already matches; align `experiences-data.ts` (§5) and `public/llms.txt` + meta/JSON-LD (§2).
- [ ] Project order + lead project; whether Nzoth / Lonestone Boilerplate get a "Lonestone OSS" label
- [ ] Footer copy replacing "Thanks for exploring ✦ / Built with passion and pixels"
- [ ] Meaning of the ACTIVE badge on projects (today it renders the `featured` flag on 5/6 cards): drop or redefine
- [x] Hero meta line "Focused on performance, UX, and clean architecture": keep (render fixed) or cut → **cut** (Nicolas, 2026-09-27).
- [ ] Experience: "… and many more" entry; Sogeti (Sep 2017 – Oct 2019) overlapping Easilys (Jul 2019 –)
- [ ] Treashunt description (currently product marketing copy)
- [ ] Repo and live URLs per project (needed for SOURCE / LIVE links)
- [ ] Which skills tags to cut

---

## 0 · Prerequisite — start of the Hero session

- [x] `/impeccable document` → root `DESIGN.md` (tokens in frontmatter + `.impeccable/design.json`) derived from code: invariants above, plus what the code really does (WebGL/WebGPU mesh, WebGL grain, no mouse trail, MabeoVintage unused).
- [x] Delete `docs/design.md`; update links in `AGENTS.md:7`, `CLAUDE.md:8`, `PRODUCT.md:43`.

Done (2026-09-27): North Star "The Night Workbench", component feel "Precise, tactile, quiet" (Nicolas). Links also updated in `README.md`, `docs/architecture.md`, `.specify/memory/constitution.md`. The shader's second blob is **mint** (rgb 0.33/0.84/0.56), not cyan — DESIGN.md says gold/mint/violet. Contradictions the documenter left out of DESIGN.md on purpose (to fix in §2/§3/§5/§7): default focus ring for links/buttons/`[tabindex]` is gold (invisible on paper); `⤘` card prompts pure gold on paper; nav gold hover on paper; footer copyright graphite on dark (2.72:1); Doto 0.6rem in nav and 400–500 weight in bars; experience card `backdrop-filter`; MabeoVintage preloaded unused.

## 1 · Hero — DONE 2026-09-27 (verdict: refine, keep the world)

Goal: the morph does something at every width, the hero never clips, it also routes peers to the Labs, and it honours the prerender and reduced-motion contracts.

- [x] **`/impeccable harden`**
  - Laptop tilt dies after scrolling to the bottom and back (reproduced 3/3): `WelcomeHeroComputer` reads `getState().shouldAnimate` during render while the orchestrator context value is memoized (`welcome-hero-computer.component.tsx:53-54`, `use-hero-animation.hook.ts:166`). Fix with `useSyncExternalStore(subscribe, () => getState().shouldAnimate)`. Same pattern at `welcome-hero.section.tsx:21` (`isTextSelected`).
  - `marginTop: \`-${vars.spacing.sm}\`` compiles to `-var(…)`, invalid and dropped by the browser → `calc(-1 * ${vars.spacing.sm})` (`welcome-hero-section-content.css.ts:89`).
  - Remove `respectReducedMotion={false}` (`welcome-hero-filter-background.component.tsx:20`): the mesh still drifts on scroll under reduced motion.
  - "_Get in touch_" is a React Aria button, inert without JS: render an `<a href="#contact">` and enhance it into the popover (`welcome-hero-contact-hover-card.component.tsx`).
  - Prerendered laptop is frozen on "INITIALIZING SYSTEM…": prerender its resting "System ready." frame (`welcome-hero-computer-splash.component.tsx`).
  - Static CSS gold/cyan/violet gradient under the mesh canvas so the colour invariant survives without WebGL.
  - Laptop screen text is read by screen readers ("CORE 07 READY 60%…"): `aria-hidden` + `inert` on the homepage wrapper.
  - Define `--highlight-background` / `--highlight-border` (`welcome-hero-contact-hover-card.css.ts:202-203, 236`).
- [x] **`/impeccable optimize`**
  - Laptop widgets never pause offscreen (2 rAF loops + ~31 DOM mutations/s for the whole visit): `render(index < visibleZones)` → `render(index < visibleZones && shouldAnimate)` (`welcome-hero-computer.component.tsx:207-219`). Model: the rack's `data-server-rack-paused`.
  - Mesh canvas sized to the visible frame (container is 150 % × 150 %), drop the permanent `will-change`, `powerPreference: "low-power"`, throttle or drop the scroll link (`welcome-hero-filter-background.component.tsx:14-22`, `.css.ts:4-14`).
  - Record a mobile Lighthouse baseline before/after (2026-09-27: 80–83, LCP 3.7 s, FCP 2.6 s; desktop 99).
- [x] **`/impeccable animate`**
  - Dead-scroll pin: `getContainerMaxWidth()` hand-copies max-widths that no longer match `container.css.ts:29` (1280 px up to 1919 px), so `targetScale` clamps to 1 — at 1280–1919 px the hero stays pinned for a full screen with nothing moving; at 1920 the text shrinks ×0.757 and lands 1440 px wide over 1312 px content (`use-hero-morph-progress.hook.ts:25-31, 86`). Measure the target from the real container instead of a table.
  - Pin 200vh → ~120vh (`hero-scroll-morph.css.ts:12`).
  - Morph with `clip-path: inset()` + radius instead of `scale()`: text keeps its size, the panel lands aligned with the beige sections and the footer.
  - Entrance: CSS-only, never set opacity 0 on already-painted content (today the h1 blinks at hydration: painted 892 ms → hidden 1191 ms → back 1284 ms; `use-welcome-hero-content-animation.hook.ts:27-48`).
  - SMIL beam packets ignore reduced motion.
- [x] **`/impeccable adapt`**
  - Hero content clipped at 844×390 (landscape phone) and 320×256 (~400 % zoom), WCAG 1.4.10: `min-height` + `svh`/`dvh` when the morph is inactive (< md, reduced motion, short `max-height`), let the frame grow (`hero-scroll-morph.css.ts:5-59`, `welcome-hero.css.ts:15-33`).
- [x] **`/impeccable shape`**
  - Write the Labs brief for all 4 sections (hero CTA, nav item, captions, footer line); implement the hero part only: secondary "Explore the Labs →" CTA next to "_Get in touch_" (`welcome-hero-section-content.component.tsx:52-54`), caption `⤘ /labs/computer-3d` under the laptop.
- [x] **`/impeccable typeset`** (hero scope)
  - Meta line renders ~3.3:1: `textShadow` painted over the `background-clip: text` gradient + opacity 0.86 (`welcome-hero-section-content.css.ts:85-107`); violet gradient stop 4.23:1; paragraph line-height 1.25 (`:69`).
- [ ] Optional **`/impeccable delight`**: the laptop screen shows something true (Labs slugs, or its own `?raw` source) instead of random hex and fake metrics. **Deferred** by Nicolas (2026-09-27): the 4 widgets are shared with the Labs, so it is not a hero-only change. Pick it up with §8 or as its own session.
- [x] **`/impeccable polish`** (hero): 1280 / 1440 / 1920, 390 portrait + landscape, reduced motion, no-JS, keyboard.

Risks: switching `scale()` → `clip-path` changes how the morph feels at 1920 (a shrinking card becomes a tightening frame) — validate visually. `useSyncExternalStore` touches every orchestrator consumer — the tilt round-trip must go from 3/3 failures to 0/3.

Done (2026-09-27):

- **Measurements.** Lighthouse mobile (3 runs, simulated throttling) went from 86/86/86 (FCP 2.6 s, LCP 3.7 s, TBT 0–20 ms, CLS 0.002) to 85/85/86 (FCP 2.4–2.6 s, LCP 3.6–3.7 s, TBT 80–100 ms, CLS 0). A real DevTools trace (mobile, CPU ×4, over 5 s) says the opposite of the simulated TBT: TBT 367 → 118 ms, longest task 362 → 105 ms. The canvas renderer's 62 ms forced reflow at first draw is gone. Lantern charges the whole hydration to one 90 ms task (base: 48 ms + a separate 30 ms canvas task). LCP is unchanged and still dominated by render-blocking Google Fonts CSS (§2 optimize). The LCP element was the meta line; it is now the lead paragraph.
- **Tilt.** Round-trip failures went from 3/3 to 0/3. Offscreen laptop widget mutations went from ~31/s to 0. At 1440 @2x the hero mesh buffer is 2848×1768; before it was 2.25× that.
- **Harden.**
  - `useHeroAnimationValue` (useSyncExternalStore) replaces `getState()` reads during render, and the provider no longer re-renders the section on every change.
  - "_Get in touch_" prerenders as `<a href="#contact">`. After hydration only that leaf becomes the React Aria button, inside a transition, so the magnetic span keeps its DOM node and its listeners.
  - The boot splash is pure CSS and rests on "System ready.".
  - A static CSS gold/violet/mint gradient sits under the canvas.
  - The laptop is `aria-hidden` but not `inert`: nothing inside it is focusable, and `inert` would kill the signal map's pointer hover.
  - `--highlight-*` became scoped `createVar`s.
  - The `-var()` margin disappeared with the meta line.
  - Reduced motion: the shared canvas renderer now draws a still frame instead of nothing. This also fixes the blank grain and footer mesh under reduced motion (cross-section). The hero no longer passes `respectReducedMotion={false}`. SMIL beam packets are not rendered, and the hero text entrance is `animation: none`.
- **Optimize.**
  - Widgets receive `isAnimating = revealed && shouldAnimate`.
  - The mesh canvas is exactly the frame. `MeshCompositionWindow` bakes the visible uv window into the shader, and grain stays on physical pixels.
  - No permanent `will-change`. The scroll link was dropped rather than throttled: the mesh now draws once, then only on resize.
  - The hero was already `low-power` (the component default).
  - Shared renderer: buffer size comes from the ResizeObserver entry and never from `offsetWidth` in the draw frame.
- **Animate.** The morph is CSS scroll-driven: `clip-path: inset(0 var(gutter) round 2rem)`, with `animation-timeline: scroll(root)` over 0–50vh. The JS hook is deleted.
  - The target is not a DOM measurement. It is computed from `containerColumn`, now exported by `container.css.ts`: one source for the sections and the hero. The text and the laptop are laid out on that column from the start, so nothing scales and the panel lands flush with the cards and the footer (checked at 1440: 128 → 1312 px).
  - The pin is 20vh (spacer), only when `min-width: 1024px`, `min-height: 640px` and motion is allowed. The frame tightens from md up.
  - Browsers without scroll timelines keep a full-bleed static frame.
  - The entrance is CSS, from a dimmed but _visible_ state (opacity 0.25): no hydration blink. The anime.js hook is deleted.
- **Adapt.** The frame is in flow with `min-height: 100svh`, and the laptop stacks under the text in reserved space below lg or below 640 px of height. Checked with no clipping and no horizontal scroll at 844×390 (frame grows to 942 px) and 320×256 (776 px). Beside the text, the laptop width follows the viewport height so the lid clears the headline (1280×720 checked).
- **Shape.** Brief below. Hero part implemented: "Explore the Labs →" sits _under_ the CTA, because beside it the contact popover (which opens to the right) covered it. Caption `⤘ /labs/computer-3d` sits under the laptop.
- **Typeset.** Meta line cut (Nicolas). Lead line-height 1.25 → 1.375. The h1 is capped at `11em` so the break stays on "&" at every width. The lead is capped at 42rem at 2k so it clears the lid.
- **Polish / verification.** 1280×800 and 1280×720, 1440×900, 1920×1080, 390×844, 844×390, 320×256; keyboard order (Lonestone → CTA → Labs → caption), Enter opens the popover, focus rings in `primary`. No-JS: the prerender shows the gradient, "System ready." and a working `#contact` link. Reduced motion verified in code. Detector overlay on the build: nothing new that is hero-specific (the glows and the `▐` cursor are documented invariants; the widget colours belong to the deferred delight). Other findings belong to §4/§5/§7.
- **Tooling.** `.impeccable/**` was added to oxfmt `ignorePatterns`: the committed critique archive was failing `fmt:check` before this session. `bun run check` is green, knip is clean, and lint warnings went 26 → 24.
- **Cross-section notes.** The `scroll-morph` Lab still describes its own scale morph, which stays true for the demo. The DESIGN.md hover rule applies to captions on paper: ink, never gold (§4 `project-card-3d` caption). Firefox scroll-timeline support was not checked in a browser.
- **Spec layer (2026-09-27, after the "creative dev" feedback).** Nicolas asked for more small details; picked on a Claude Design canvas: the editor header of concept E with the annotations of F, plus the dot grid and a ~2 s plotter intro. Shipped as the hero's spec layer (DESIGN.md › Spec Layer):
  - File tabs (React Aria `ToggleButtonGroup`) naming the real files that set each value: `welcome-hero-section-content.css.ts`, `welcome-hero.css.ts`, `welcome-hero-computer.css.ts`, `theme.css.ts`. The live renderer (`onRendererReady` added to `MeshBackgroundCanvas`) and the measured fps (rAF, only while the hero is visible).
  - Annotations read from the live elements (`use-welcome-hero-spec.hook.ts`, formatters unit-tested): headline baselines drawn in CSS from `lh`/`em` (baseline = `0.5lh + 0.356em`, measured), lead measure, gutter dimension with a count-up, CTA note, a selection box on the laptop's screen plane with the live tilt, palette swatches. Hover (`:has()`, no JS) or a picked tab lights a group.
  - From 1280 px and 640 px tall only; narrower keeps the header (entry file name) and the dots. Without JS: dots and file name. Under reduced motion: static.
  - "0 images" in the canvas was wrong (the laptop uses `noise.svg`): the note reads "12 faces · preserve-3d", with the face count read from the DOM.
  - Fixes found on the way: the laptop wrapper took the pointer over the end of the lead's lines (text not selectable at 1440): only the screen and caption take it now. At 1024–1279 px the laptop lid covered the lead's line ends: lead measure 32rem there (40rem from xl). Container padding-top now clears the 2.5rem header at every width (text starts 40 px lower below lg).
  - Verified on the build: 1024×700, 1280×800, 1440×900, 1920×1080, 2560×1440, 390×844, no horizontal scroll; keyboard (one tab stop, arrows, Enter/Space toggle, gold ring); no-JS prerender (no `data-spec`, no values). Lighthouse mobile ×3: 85/85/85 (was 85/85/86), TBT 50–60 ms, CLS 0, FCP 2.7 s, LCP 3.8 s (fonts-bound, §2). Detector: only the mint (a DESIGN.md brand colour), existing glows and footer findings.
  - Then (Nicolas): the `⤘ /labs/computer-3d` caption under the laptop is removed (its reserved space in the stacked layout too), the `theme.css.ts` tab is removed (three tabs), and the swatches stay at full strength, outside the lighting. The Labs brief's caption spec still applies to §4/§7.
  - Not done: `.impeccable/design.json` sidecar not regenerated for the spec layer (DESIGN.md is); Safari/Firefox not checked in a browser (`lh` unit, `:has()`, `mask-position` animation).

### Labs brief (shape, 2026-09-27) — applies to §1, §3, §4, §7

- **Job.** Route the peers (PRODUCT.md, primary users) from any live object to its Lab, where it runs with its source. This is proof over claims: the caption points at the artifact, it does not describe it.
- **Two glyphs, never mixed.** `→` = a route to a page ("Explore the Labs →", nav LABS item, footer line). `⤘ /labs/<slug>` = a caption attached to one live object, naming its Lab path verbatim.
- **Caption spec.** Doto `sm` weight 900 (Doto floor). On dark panels: beige at 72 %, hover and focus in `primary`. On paper: ink at ~70 %, hover in ink, never gold (Dark-Only Gold). Placed under or next to its object, never floating. React Router `Link`. `aria-label` = "<path> — <object>, live with its source" (visible text first, WCAG 2.5.3). Only for objects that have a Lab: `computer-3d` (hero, done), `project-card-3d` (§4, in the projects header), `server-unit-3d` (§7, by the rack).
- **Hero (done).** A secondary route under the primary CTA, quieter than it (no fill, no glow), Doto 900 at base/lg.
- **Nav (§3).** LABS is the last item: a route with `→`, no `_0N` index, outside the scroll-spy, visually separated from the anchors.
- **Footer (§7).** A dedicated Labs line with the experiment count read from `experiments.ts` (never hard-coded). Nicolas writes the wording (§7 clarify); the existing "Explore the Labs →" link can become that line.

## 2 · Global

- [ ] **Quick P1 fixes, no design decision** (`/impeccable harden`) — can open the Hero session:
  - Project dates use `toLocaleDateString` without `timeZone` on date-only ISO strings → React error #418 and wrong month (Oct/May instead of Nov/Jun) for visitors west of UTC, full client re-render (reproduced with `TZ=America/Los_Angeles`). Pass `timeZone: "UTC"` + a test under a negative offset (`project-card.component.tsx:121-124`).
  - `og:image` / `twitter:image` point to a nonexistent, relative `/images/projects/website.webp` (`root.tsx:30-34`); `public/og-image-1200x630.png` exists unused → absolute URL + `og:image:alt`, ideally in route `meta()`.
  - Project-card focus ring clipped (WCAG 2.4.7): global `a:focus-visible { outline-offset: 2px }` (`global.css.ts:68-72`) beats the card's base-class `-2px` (`project-card.css.ts:49-56`) → move the offset into the card's `:focus-visible` block, or wrap the global selector in `:where()`.
  - A `<Glyph aria-hidden>` primitive for `_❯ ⤘ ▐ ⸭ ✦` (today inside every h2: accessible names read "_❯PROJECTS").
  - Footer out of `<main>` (`welcome.page.tsx:47-54`); footer heading h3 → h2.
  - Copyright year fixed at build time (`footer.component.tsx:73`): otherwise every Jan 1 triggers #418 until the next deploy.
- [ ] **`/impeccable typeset` + `/impeccable colorize`**
  - Doto floor: ≥ 16 px or weight ≥ 800 for anything read or clicked; `2xs` (0.6 rem, below the documented `xs`) only for aria-hidden decoration; micro-metadata in PP Neue Montreal.
  - `mutedForegroundOnDark` token ≥ 4.5:1 on the dark panels (`mutedForeground` is 2.72:1 there).
  - Gold hover recipe only on dark surfaces (≈1.1:1 on paper).
  - Files: `app/styles/theme.css.ts`, `tag.css.ts`, `feature-header.css.ts` + consumers.
- [ ] **`/impeccable optimize`**
  - Self-host a Doto subset + preload (Google Fonts CSS is render-blocking, ~800 ms on mobile; mobile LCP element is Doto text).
  - Remove the MabeoVintage preload (`root.tsx:42-48`; font unused).
  - Subset PPNeueMontreal (156 KB, heaviest asset).
  - Add a mobile Lighthouse budget (every baseline in the repo is desktop).
- [ ] **`/impeccable distill`**
  - `BodyGrainOverlay` (full-viewport WebGL canvas, drawn once) → tiled CSS background: same look, one grain system instead of three.
  - Delete `app/pages/welcome/assets/welcome-hero.png` (1.9 MB, unreferenced).

## 3 · Sections nav (verdict: refine)

- [ ] `/impeccable shape` — LABS as the last item, styled as a route (→), distinct from the anchors.
- [ ] `/impeccable clarify` — active section name always visible, not only `_0N` (labels are 9.6 px, `welcome-sections-nav.css.ts:152`).
- [ ] `/impeccable adapt` — below 768 px (hidden today, `:9-14`, on a 7,671 px mobile page): compact bottom pill with progress + current section, safe-area aware; labels always visible on touch tablets.

Risk: the mobile pill must not cover the footer contacts.

## 4 · Projects (verdict: rework)

- [ ] `/impeccable layout` — lead project spanning 2 columns (driven by `featured`, which stops being a badge; `welcome-projects.css.ts:18-22`); 16:10 media instead of 140 px strips (`project-card.css.ts:89`); order chosen by Nicolas instead of date (`projects-data.ts:73`); SOURCE ↗ (github.com) / LIVE ↗ labels derived from the URL, two links when both exist (`repoUrl` / `liveUrl` in `projects-data.ts` + `use-projects.hook.types.ts`).
- [ ] `/impeccable distill` — effect stack 9 → ~4: keep tilt + holo sheen; remove the cursor halo (inline `style` with raw `rgb(255 255 240 / 0.18)`, `project-card.component.tsx:190-195`), image and tag parallax, macOS window dots; ACTIVE per Nicolas; caption `⤘ /labs/project-card-3d` in the section header.
- [ ] `/impeccable harden` — link name via `aria-labelledby` on the title (today ~40 words, title read twice), `alt=""`, reduced motion for tilt/parallax (no `@media` in `project-card.css.ts`).

Risk: the `project-card-3d` Lab imports this component (`project-card-3d.demo.tsx`, `.experiment.ts`) — the rework changes the Lab and its source tab.

## 5 · Experience (verdict: refine)

- [ ] `/impeccable colorize` + `/impeccable typeset` — client project titles are Doto 14 px mint at 2.93:1 (`experience-card.css.ts:234-239`) → PP Neue Montreal semibold in foreground; ACTIVE badge (9.6 px) to the floor.
- [ ] `/impeccable layout` — 2 columns (company / period / role left, projects right) to use the empty ~45 % (text capped at 640 px inside a 1135 px card, `:209`); an h3 per company.
- [ ] `/impeccable distill` / `/impeccable quieter` — delete `backdropFilter` on the opaque card (`:90-91`); no hover lift/glow on this non-clickable card (`:98-100`); timeline ping on the current job only.

## 6 · Skills (verdict: rework, reduced)

- [ ] `/impeccable distill` — one taxonomy (block titles carry the domain; today "Creative Frontend" is mint while the legend's "Creative & systems" is gold, and "AI" is gold inside violet "Realtime Systems"); remove duplicates (TypeScript ×2); cut tags per Nicolas; colour no longer the only signal (WCAG 1.4.1); one colour map instead of `skills-data.ts` + `tag.component.tsx` kept in sync by hand.
- [ ] `/impeccable typeset` — 12 px Doto pills to the floor.
- [ ] `/impeccable harden` — block titles as headings, tags as lists; no hover lift/glow on non-clickable blocks (`skills-block-card.css.ts:18-21`).

## 7 · Footer (verdict: refine)

- [ ] `/impeccable typeset` — invert the hierarchy: "ESTABLISH LINK" + contact links become the lead block (Doto 900 at base/lg, like the hero popover `welcome-hero-contact-hover-card.css.ts:220-247`) above the sign-off; email address shown as text (existing data).
- [ ] `/impeccable colorize` — copyright (`footer.css.ts:250-256`) and links on `mutedForegroundOnDark`.
- [ ] `/impeccable shape` — dedicated Labs line with the experiment count from the registry (`app/features/labs/data/experiments.ts`); caption `⤘ /labs/server-unit-3d` by the rack.
- [ ] `/impeccable adapt` — contact targets ≥ 44 px on mobile (21 px today, `footer.css.ts:157-202`); smaller rack before the contacts on mobile; desktop-first `max-width: 767px` queries → mobile-first.
- [ ] `/impeccable clarify` — new copy from Nicolas.
- [ ] `/impeccable optimize` — footer mesh `powerPreference: "high-performance"` → low-power (`footer-background.component.tsx:99-105`).

## 8 · Closing

- [ ] `/impeccable polish` on the whole homepage: 26 oxlint warnings → 0, then promote those rules to `error` in `.oxlintrc.json`; static `style=` props into CSS (dynamic CSS vars: decide on `@vanilla-extract/dynamic`); `Button` silently drops `id` (`button.component.tsx:11-12`); leftover `"use client"` in the splash component; `zIndex: 9999` on the hero paragraph.
- [ ] Re-run `/impeccable critique` and `/impeccable audit` — baseline 20/32 and 10/20.
- [ ] Delete this scaffolding once everything above is ticked (Nicolas, 2026-09-27): `.claude/skills/homepage/`, this file, and the matching memory entries.
