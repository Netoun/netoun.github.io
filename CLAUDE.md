# CLAUDE.md

This file provides guidance to ai (claude.ai/opencode) when working with code in this repository.

## Project

Personal portfolio of Nicolas Coulonnier (Netoun), full stack engineer at Lonestone. Target: recruiters and technical peers. Goal: visibility, CV download, contact. Neo-retro futuristic, 3D art direction — see [design.md](docs/design.md).

**Never invent content** (bio, experiences, links, legal text).

## Stack

React Router v7 · React 19 · TypeScript strict · Vite · Vanilla Extract CSS · Anime.js · React Aria Components · oxlint · Vitest · Bun

React Router **Framework Mode**, `ssr: false`, static prerender of `/`. No server loaders/actions.

## Commands

```bash
bun run dev          # localhost:5173
bun run build
bun run typecheck    # react-router typegen + tsc
bun run test         # vitest watch
bun run lint  # oxlint
bun run fmt   # oxfmt autofix

bun run test app/components/primitives/button/button.test.tsx  # targeted test
```

**After any significant change:** `bun run typecheck && bun run lint`

## Structure

```
app/
  routes.ts                  # index → welcome.page, /misc → misc.page
  root.tsx                   # Global layout, fonts, ErrorBoundary
  components/
    layouts/                 # Section, Container — structural wrappers
    primitives/              # Base UI (Button, Slider, Image, ClientOnly)
    misc/                    # Animated decorative components (Computer, Kirby, canvas…)
  pages/<page>/
    page/<page>.page.tsx     # export meta() + route component
    sections/                # sections + page-local hooks
  hooks/                     # shared hooks (animation, scroll, mouse)
  styles/                    # tokens, global, responsive, animations, fonts
```

Aliases: `@/` → `app/`, `@components/`, `@primitives/`, `@styles/`.

## Conventions

- Each component in its own folder: `name.component.tsx` + `name.css.ts` + `name.test.tsx`
- Kebab-case for files and folders, comments in English
- TypeScript strict — no `any`, no `as` unless absolutely necessary

## Styling — Vanilla Extract

All CSS is in `.css.ts`. **No Tailwind, no plain CSS, no `style=`.**

- `vars.*` → runtime CSS variables
- `colors`, `spacing`… imported directly → static values (in `globalStyle` or outside runtime)
- Variants → `recipe()` from `@vanilla-extract/recipes`
- Breakpoints → `app/styles/responsive.css.ts`, mobile-first
- Global keyframes → `app/styles/animations.css.ts`

## Animations

Always use `use-animation-priority` for expensive animations:

| Priority | Behavior                                                 |
| -------- | -------------------------------------------------------- |
| `high`   | Always animating                                         |
| `medium` | Animates if visible (IntersectionObserver)               |
| `low`    | Animates if visible + browser idle (requestIdleCallback) |

## SEO & Accessibility

- Each page exports `meta()` — format: `"Netoun - [page]"`, unique description
- Open Graph absent — to add on any new page
- One `<h1>` per page
- Interactive primitives via React Aria Components — do not substitute with raw native HTML

## Performance

- Local woff2 fonts in `/public/fonts/`, Google Fonts only for Inter and Doto
- Images in `app/pages/<page>/assets/` or `public/`, WebP/PNG format, `alt` always provided
- Do not add dependencies without justification

## Forbidden

- Modify folder architecture without asking
- Add heavy libraries (Framer Motion, Tailwind…) without approval
- Write CSS outside Vanilla Extract
- Bypass oxlint (`--no-verify`)

## Workflow

1. Explore the code before any proposal
2. Propose a plan if the change touches multiple files
3. Implement → validate (`typecheck` + `lint`)
4. Summarize what changed

## Design System

See [design.md](docs/design.md).

## Component Architecture

See [architecture.md](docs/architecture.md) — naming rules, page/section/component organization, templates.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:
[specs/001-premium-polish/plan.md](specs/001-premium-polish/plan.md)
(spec: [specs/001-premium-polish/spec.md](specs/001-premium-polish/spec.md))
<!-- SPECKIT END -->
