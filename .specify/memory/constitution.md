<!--
Sync Impact Report
- Version change: template (unfilled) → 1.0.0
- Principles defined: I. Truthful Content · II. Prerender-Safe by Default · III. Performance Budget ·
  IV. Accessible Motion & Interaction · V. Architecture & Styling Discipline
- Added sections: Technical Constraints, Development Workflow, Governance
- Removed sections: none
- Templates: .specify/templates/plan-template.md ✅ (generic "Constitution Check" gate, no change needed) ·
  spec-template.md ✅ · tasks-template.md ✅
- Runtime guidance: AGENTS.md (imported by CLAUDE.md) ✅ aligned
- Deferred TODOs: none
Derived from the de facto rules of AGENTS.md, PRODUCT.md, docs/design.md, docs/architecture.md and the
gates used by specs/001-premium-polish/plan.md.
-->

# netoun-website Constitution

## Core Principles

### I. Truthful Content (NON-NEGOTIABLE)

Bio, experiences, projects, dates, links, metrics and legal text come from Nicolas only. Specs, plans and
code MUST NOT invent content, testimonials or numbers; a missing fact stays a visible gap or an explicit
open question. Rationale: the site exists for credibility — one fabricated claim destroys it.

### II. Prerender-Safe by Default

Every route MUST render complete, readable HTML at build time (`ssr: false` + prerender) and stay usable
without JavaScript. Browser-only work (canvas, WebGL/WebGPU, `matchMedia`, observers) runs in effects;
hidden/pre-animation states are applied by JS only. Rationale: static hosting, SEO, and resilience.

### III. Performance Budget

No Lighthouse regression on `/` and `/labs`. Expensive animations MUST go through
`use-animation-priority` (off-screen = paused), animate transforms/opacity only, and new runtime
dependencies require a written justification (heavy libraries need explicit approval). Rationale:
engineering quality is part of the proof the site makes.

### IV. Accessible Motion & Interaction

`prefers-reduced-motion` MUST be honoured everywhere (content shown immediately, no motion). Every
interactive element has a visible `:focus-visible` state, text meets WCAG AA contrast, and interactive
primitives use React Aria Components. Rationale: craft that excludes people is not craft.

### V. Architecture & Styling Discipline

Folder, naming and import rules of `docs/architecture.md` apply to the whole repo (component/feature
boundaries are lint-enforced). Styles live in Vanilla Extract `.css.ts` with design tokens only — no
Tailwind, no plain CSS files. Changing the folder architecture requires explicit approval. Rationale: a
small codebase stays legible only if every file has one obvious home.

## Technical Constraints

- Stack: React Router (framework mode, static prerender) · React · TypeScript strict · Vite · Vanilla
  Extract · Anime.js · React Aria Components · Vitest · oxlint/oxfmt · Bun; Node version pinned in
  `.node-version`.
- Hosting: static files on Cloudflare Pages (`build/client`); no server runtime, loaders or actions.
- Content is static TypeScript data under `app/features/*/data/` and `app/pages/*/data/`.

## Development Workflow

- Plans list their Constitution Check gates against Principles I–V before research, and re-check after design.
- `bun run check` (typecheck, lint, format, tests) MUST pass before a task is considered done; CI runs
  `check`, `knip` and `build`.
- UI changes are verified in a browser at desktop and 390 px mobile widths, with reduced motion on and off.
- Lint warnings are a tracked backlog; lint errors block.

## Governance

This constitution supersedes conflicting guidance; `AGENTS.md` holds day-to-day runtime guidance and must
stay consistent with it. Amendments are made in a commit that updates this file, its Sync Impact Report and
any affected template. Versioning is semantic: MAJOR for removing or redefining a principle, MINOR for a
new principle or section, PATCH for clarifications. Reviews check compliance with Principles I–V.

**Version**: 1.0.0 | **Ratified**: 2026-09-27 | **Last Amended**: 2026-09-27
