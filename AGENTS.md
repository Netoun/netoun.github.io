# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, opencode, Cursor) working in this repo. `CLAUDE.md` imports this file — edit here, not there.

## Project

Personal site of Nicolas Coulonnier (Netoun), full-stack engineer at Lonestone. Goal: visibility and credibility with technical peers, recruiters served on the side. Product truth lives in [PRODUCT.md](PRODUCT.md), visual system in [DESIGN.md](DESIGN.md) (+ `.impeccable/design.json` sidecar), component rules in [docs/architecture.md](docs/architecture.md).

**Never invent content** — bio, experiences, links, dates, metrics, legal text. Missing content stays missing; ask. Known content inconsistencies are listed in PRODUCT.md › Evidence on Hand.

## Stack

React Router 8 (framework mode, `ssr: false`, static prerender) · React 19 · TypeScript 7 (native `tsc`) strict · Vite 8 (Rolldown/Oxc) · Vanilla Extract · Anime.js 4 · React Aria Components · Vitest 5 + happy-dom · oxlint + oxfmt · knip · Bun 1.4 · Node 24 (`.node-version`)

Deployed as static files (`build/client`) on Cloudflare Pages — headers/redirects in `public/_headers`, `public/_redirects`. No server, no loaders/actions, no API.

## Commands

```bash
bun run dev          # http://localhost:5173
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
  routes.ts                 # / → welcome · /labs → labs layout (index + :slug) · /misc → redirect
  components/               # shared UI — must NOT import features/ or pages/ (lint-enforced)
    layouts/                #   container, content-section, feature-header, footer
    primitives/             #   button, slider, tag, terminal-buttons, icons
    misc/                   #   decorative/3D/canvas pieces: computer, server-unit, mesh-background, shaders/, canvas-renderer/…
  features/<domain>/        # business code shared across pages — must NOT import pages/ (lint-enforced)
    projects/ experiences/ skills/   # data + cards + hooks
    labs/                   #   experiment registry, shell, code viewer, experiments/<slug>/
  pages/<page>/             # welcome/, labs/ — page/<page>.page.tsx, sections/, components/, data/, hooks/
  hooks/                    # use-animation-priority, use-intersection-observer, use-mouse-position, use-reveal
  styles/                   # theme (tokens), global, fonts, motion, animations, responsive
  types/                    # ambient module declarations (?raw)
scripts/generate-assets.ts  # favicons + OG images (sharp) — `bun run generate-assets`
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

- `vars.*` → runtime CSS variables from `app/styles/theme.css.ts`; raw values (`colors`, `spacing`…) only in `globalStyle` or build-time code.
- Variants → `recipe()` (`@vanilla-extract/recipes`). Breakpoints → `@styles/responsive.css` (mobile-first). Keyframes → `app/styles/animations.css.ts`. Motion tokens → `app/styles/motion.css.ts`.
- Selectors: VE has no `:global()` — target ancestors with plain selectors (`'[data-x="y"] &'`). Lightning CSS flags invalid selectors at build.

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

Labs experiments may import components from any domain — showcasing them is their purpose (documented exception to the cross-domain rule).

## SEO & accessibility

- Every route exports `meta()` with title, description, Open Graph, Twitter and canonical. Titles: `Netoun - [page]`; lab experiments are topic-first via `buildExperimentMeta()` (`app/features/labs/data/labs-seo.ts`).
- One `<h1>` per page. Interactive primitives via React Aria Components — no raw native substitutes.
- Visible `:focus-visible` on everything interactive; WCAG AA contrast.
- `public/llms.txt`, `public/robots.txt`, and the build-generated `sitemap.xml` must stay consistent with real routes and content.

## Performance

- Fonts: local woff2 in `public/fonts/` (PP Neue Montreal, Mabeo Vintage); Doto from Google Fonts. `Inter` in the theme stack is not loaded (falls back to system-ui).
- Images in `public/images/` or `app/pages/<page>/assets/`, WebP preferred, `alt` always set.
- No new runtime dependency without justification; no heavy libraries (Framer Motion, Tailwind, GSAP…) without approval. No Lighthouse regression.

## Verification

1. `bun run check` must pass (lint warnings are a tracked backlog; errors block).
2. UI changes: run the app (`.claude/launch.json` → port 5175, or `bun run dev`) and check desktop + mobile (390px) with the browser/DevTools tools; include `prefers-reduced-motion`.
3. Build-affecting changes: `bun run build` and confirm `build/client/**/index.html` + `sitemap.xml`.

## Forbidden

- Changing the folder architecture without asking.
- CSS outside Vanilla Extract; Tailwind classes anywhere.
- Bypassing hooks or lint (`--no-verify`, disabling rules inline without a reason).
- Committing or pushing unless asked.

## Workflow

1. Explore the code before proposing. 2. Plan when a change spans several files. 3. Implement → `bun run check`. 4. Summarise what changed and what was not verified.

Feature specs (spec-kit) live in `specs/<nnn-feature>/`; `specs/001-premium-polish` is complete.
