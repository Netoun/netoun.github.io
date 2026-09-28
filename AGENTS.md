# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, opencode, Cursor) working in this repo. `CLAUDE.md` imports this file — edit here, not there.

## Project

Personal site of Nicolas Coulonnier (Netoun), full-stack engineer at Lonestone. Goal: visibility and credibility with technical peers, recruiters served on the side. Product truth lives in [PRODUCT.md](PRODUCT.md), visual system in [DESIGN.md](DESIGN.md) (+ `.impeccable/design.json` sidecar), component rules in [docs/architecture.md](docs/architecture.md).

**Never invent content** — bio, experiences, links, dates, metrics, legal text. Missing content stays missing; ask. Known content inconsistencies are listed in PRODUCT.md › Evidence on Hand.

**Public repo.** Code is MIT (`LICENSE`); content (texts, captures, logo, OG image, identity) is all rights reserved, and fonts keep their own licences — see README › License. Never commit secrets, absolute local paths or client names (Lonestone client work stays unnamed). The one exception: the client projects Nicolas approved in the work log (`experiences-data.ts`: Desoutter, Cuevr, Mon Rét@b' d'abord; 2026-09-28).

## Stack

React Router 8 (framework mode, `ssr: false`, static prerender) · React 19 · TypeScript 7 (native `tsc`) strict · Vite 8 (Rolldown/Oxc) · Vanilla Extract · Anime.js 4 · React Aria Components · Vitest 5 + happy-dom · oxlint + oxfmt · knip · Bun 1.4 · Node 24 (`.node-version`)

Deployed as static files (`build/client`) on Cloudflare Pages (build command `bun i && bun run build`) — headers/redirects in `public/_headers`, `public/_redirects`. No server, no loaders/actions, no API.

## Commands

```bash
bun run dev          # https://netoun.localhost via portless (proxy already running, else asks sudo once)
bun run dev:vite     # plain Vite on http://localhost:5173 (no proxy)
bun run check        # typecheck + lint + fmt:check + tests — run before calling anything done
bun run build        # prerender to build/client (+ sitemap.xml)
bun run typecheck    # react-router typegen && tsc
bun run lint         # oxlint (config: .oxlintrc.json)
bun run fmt          # oxfmt --write
bun run test         # vitest watch
bun run test:run     # vitest single run
bun run knip         # unused files / exports / deps
bunx vitest run app/components/primitives/button/button.test.tsx   # one test file
```

## Structure

```
app/
  root.tsx                  # <html> layout, fonts, JSON-LD, ErrorBoundary
  routes.ts                 # / → welcome · /labs → labs layout (index + :slug) · /misc → redirect · * → not-found
  components/               # shared UI — must NOT import features/ or pages/ (lint-enforced)
    layouts/                #   container, content-section, error-screen, feature-header, footer
    primitives/             #   button, glyph, slider, tag, terminal-buttons, icons
    misc/                   #   decorative/3D/canvas pieces: computer, server-unit, mesh-background, shaders/, canvas-renderer/…
  features/<domain>/        # business code shared across pages — must NOT import pages/ (lint-enforced)
    projects/               #   process monitor (`htop`) + data + hooks
    experiences/            #   work log (`git log --graph`) + data
    skills/                 #   fetch readout (`fastfetch`) + data
    labs/                   #   experiment registry, shell, code viewer, experiments/<slug>/
  pages/<page>/             # welcome/, labs/, not-found/ — page/<page>.page.tsx, sections/, components/, data/, hooks/
  hooks/                    # use-animation-priority, use-current-month, use-intersection-observer, use-mouse-position, use-paper-grain, use-reveal
  styles/                   # theme (tokens), global, fonts, motion, animations, responsive
  types/                    # ambient declarations (?raw imports, build-time defines)
scripts/                    # sharp generators: generate-assets (favicon.ico, apple-touch-icon, OG), generate-grain-tile, generate-logo-ascii
```

Aliases (from `tsconfig.json` paths, resolved natively by Vite): `@/` → `app/`, `@components/`, `@primitives/`, `@styles/`.

## Conventions

- Full rules and templates: [docs/architecture.md](docs/architecture.md). Summary:
- One component per folder: `name.component.tsx` + `name.css.ts` (+ `name.test.tsx`). Also `*.section.tsx`, `*.page.tsx`, `*.hook.ts`, `*.types.ts`, `*-data.ts`.
- Under `app/pages/`, filenames carry the full feature prefix (`welcome-hero-computer.component.tsx`).
- kebab-case files/folders · named exports (default export only for `*.page.tsx`) · `export function`, props as `interface` · comments in English.
- TypeScript strict — no `any`, no `as` unless unavoidable, `import type` for types.
- Shared layout components receive business data as props (e.g. `Footer links={contactLinks}`), they never import it.

## Styling — Vanilla Extract only

All CSS lives in `.css.ts`. **No Tailwind, no plain CSS files, no `style=` props.**

- Values computed at runtime (a slider, a pointer, a measured size) are a `createVar()` in the `.css.ts`, written from React with `style={assignInlineVars({ [styles.x]: … })}` or from an effect with `setElementVars(el, …)` (`@vanilla-extract/dynamic`). Static or discrete values are classes, `styleVariants` or `data-*` selectors. The one exception is Prism's token styles in the Labs code viewer.

- `vars.*` → runtime CSS variables from `app/styles/theme.css.ts`; raw values (`colors`, `spacing`…) only in `globalStyle` or build-time code.
- Variants → `recipe()` (`@vanilla-extract/recipes`). Breakpoints → `@styles/responsive.css` (mobile-first, in em: a media query in px breaks at 200 % default text size). Keyframes → `app/styles/animations.css.ts`. Motion tokens → `app/styles/motion.css.ts`.
- Selectors: VE has no `:global()` — target ancestors with plain selectors (`'[data-x="y"] &'`). Lightning CSS flags invalid selectors at build.
- Theme vars are named by position: adding or removing a token in `theme.css.ts` renames every var after it, and a running dev server keeps serving the old names (the page looks unstyled). Restart `bun run dev` after editing the theme.
- Font weights → `...weight(x)` from `@styles/weight`, never a bare `fontWeight:` (a test enforces it). WebKit ignores `font-weight` on PP Neue Montreal's variable file and draws it Thin; the helper pins `font-variation-settings` there, and that setting inherits, so one bare weight hands its parent's axis to the whole subtree.
- Focus: the global ring reads `vars.colors.ring` (ink). A dark surface remaps it once — `vars: { [vars.colors.ring]: vars.colors.primary }` — rather than restating gold on each control. Terminal glyphs (`_❯ ▐ ⤘ ❯`) go through `<Glyph>` (aria-hidden).

## Animations & rendering

- Expensive animations go through `use-animation-priority`: `high` always runs · `medium` runs when visible · `low` runs when visible + browser idle.
- Scroll reveals via `use-reveal` (`data-reveal` / `data-reveal-item`): hidden state is applied by JS only, so prerendered HTML stays visible without JS.
- Every animation honours `prefers-reduced-motion`.
- Anime.js ≥ 4.5: parametric easings (`cubicBezier`, `steps`, `linear`, `irregular`) must be imported functions — the string form (`ease: "cubicBezier(…)"`) silently falls back to linear. The house curve is `SIGNATURE_CURVE` in `@styles/motion.css` (used by both CSS and JS).
- Pointer tracking: `useMousePosition()` returns a stable ref — read `.current` in effects / animation frames, never during render.
- Canvas/WebGL/WebGPU renderers live in `app/components/misc/canvas-renderer/` + `shaders/`; keep them client-only (effects), never at module scope during prerender.

## Labs

Each experiment = `app/features/labs/experiments/<slug>/` with `<slug>.experiment.ts` (descriptor), `<slug>.demo.tsx` (+ `.css.ts`). To add one:

1. Add the slug to `app/features/labs/data/experiment-slugs.ts` (drives prerender + sitemap).
2. Register the descriptor in `app/features/labs/data/experiments.ts`.
3. Source tabs use `?raw` imports; `.css.ts?raw` works thanks to the `raw-css-ts` plugin in `vite.config.ts`.
4. Add a row to the Labs table in `README.md`.

Labs experiments may import components from any domain — showcasing them is their purpose (documented exception to the cross-domain rule).

## SEO & accessibility

- Every route exports `meta()` with title, description, Open Graph, Twitter and canonical. Titles: `Netoun - [page]`; lab experiments are topic-first via `buildExperimentMeta()` (`app/features/labs/data/labs-seo.ts`).
- One `<h1>` per page. Interactive primitives via React Aria Components — no raw native substitutes.
- Visible `:focus-visible` on everything interactive; WCAG AA contrast.
- `public/llms.txt`, `public/robots.txt`, and the build-generated `sitemap.xml` must stay consistent with real routes and content.
- Labs URLs end with a slash everywhere (links, canonical, sitemap, `_redirects`): Pages serves `labs/index.html` there and 308s the slashless form. Unknown paths get `404.html`, a copy of the SPA fallback made in `react-router.config.ts › buildEnd`; the `*` route (`pages/not-found`, the 404 and its game) renders it, and the root `ErrorBoundary` only handles thrown errors.

## Performance

- Fonts: all self-hosted in `public/fonts/`, both preloaded in `root.tsx`: PP Neue Montreal (variable, commercial licence from Pangram Pangram; it does not cover subsetting, so it ships whole) and Doto (the Google Fonts latin / latin-ext subsets, SIL OFL). No third-party font request. `Inter` in the theme stack is not loaded (falls back to system-ui).
- Mobile budget (Lighthouse 12, `--form-factor=mobile`, simulated throttling, production preview, median of 3 on an idle machine; TBT swings with host load): performance ≥ 80, FCP ≤ 2.9 s, LCP ≤ 4.1 s, TBT ≤ 150 ms, CLS ≤ 0.01; accessibility, best practices and SEO 100. Measured 2026-09-28: 82, 2.86 s, 4.06 s (LCP is the hero h1, bound by the 153 KB PP Neue Montreal file), 20 ms, 0. Desktop stays ≥ 99.
- Paper grain: `bun run generate-grain-tile` bakes `grain.shader.ts` into `public/images/grain-tile@{1,2}x.webp`; `usePaperGrain` sets it after `load` (it cost 240 ms of mobile LCP when requested with the CSS).
- Images in `public/images/` or `app/pages/<page>/assets/`, WebP preferred, `alt` always set. `public/images/*` is cached a year (`public/_headers`) under unhashed names: a changed image gets a new filename, never an overwrite.
- No new runtime dependency without justification; no heavy libraries (Framer Motion, Tailwind, GSAP…) without approval. No Lighthouse regression.

## Verification

1. `bun run check` must pass. The lint backlog is at 0 and the React Compiler-era rules (`react/refs`, effect and memo dependencies, index keys, `no-shadow`) are errors; a new warning from the `suspicious`/`perf` categories is fixed, not left.
2. UI changes: run the app (`.claude/launch.json` → port 5175, or `bun run dev`) and check desktop + mobile (390px) with the browser/DevTools tools; include `prefers-reduced-motion`. Playwright's WebKit stands in for Safari for layout and fonts, but its screenshots drop CSS perspective: never judge the 3D pieces from them.
3. Build-affecting changes: `bun run build` and confirm `build/client/**/index.html` + `sitemap.xml`.

## Forbidden

- Changing the folder architecture without asking.
- CSS outside Vanilla Extract; Tailwind classes anywhere.
- Bypassing hooks or lint (`--no-verify`, disabling rules inline without a reason).
- Committing or pushing unless asked.

## Workflow

1. Explore the code before proposing. 2. Plan when a change spans several files. 3. Implement → `bun run check`. 4. Summarise what changed and what was not verified.
