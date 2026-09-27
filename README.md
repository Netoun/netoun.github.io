# netoun.com

Personal site of Nicolas Coulonnier (Netoun) — portfolio plus **Labs**, a playground of 3D CSS, canvas and shader experiments shown live with their source code.

Live: <https://www.netoun.com>

## Stack

React Router 8 (framework mode, static prerender, `ssr: false`) · React 19 · TypeScript 7 · Vite 8 · Vanilla Extract · Anime.js · React Aria Components · Vitest 5 · oxlint / oxfmt · knip · Bun

## Getting started

Requires Bun ≥ 1.4 and Node 24 (`.node-version`).

```bash
bun install
bun run dev        # http://localhost:5173
```

## Scripts

| Script                    | What it does                                            |
| ------------------------- | ------------------------------------------------------- |
| `bun run dev`             | Dev server with HMR                                     |
| `bun run build`           | Prerender every route to `build/client` + `sitemap.xml` |
| `bun run check`           | Typecheck, lint, format check and tests                 |
| `bun run typecheck`       | Route typegen + `tsc`                                   |
| `bun run lint`            | oxlint                                                  |
| `bun run fmt`             | oxfmt (write)                                           |
| `bun run test`            | Vitest in watch mode (`test:run` for a single run)      |
| `bun run knip`            | Unused files, exports and dependencies                  |
| `bun run generate-assets` | Regenerate favicons and OG images from `public/`        |

## Deployment

Static hosting on Cloudflare Pages (build image v3), publishing `build/client`. Pages installs Node from `.node-version` and Bun from `packageManager` in `package.json`, then runs `bun install --frozen-lockfile` before the dashboard build command (`bun i && bun run build && bun run generate-sitemap`). `generate-sitemap` is only a compatibility alias — the sitemap is emitted by the build — so the command can be simplified to `bun run build`. Security and cache headers live in `public/_headers`, redirects in `public/_redirects`.

CI (`.github/workflows/ci.yml`) runs `check`, `knip` and `build` on every push to `main` and on pull requests.

## Docs

- [PRODUCT.md](PRODUCT.md) — audience, purpose, positioning, content rules
- [DESIGN.md](DESIGN.md) — design system (tokens, typography, motion, surfaces)
- [docs/architecture.md](docs/architecture.md) — folder, naming and import rules
- [AGENTS.md](AGENTS.md) — working guide for AI coding agents (`CLAUDE.md` imports it)
