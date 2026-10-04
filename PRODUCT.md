# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Technical peers** (developers, creative developers, tech leads) who land on the site from GitHub, X or LinkedIn, or from a shared Labs link. Their job: judge the craft — how things are built, not just how they look — and decide whether Nicolas is someone worth following, citing, or talking to.
- **Recruiters and hiring leads** browsing opportunistically. Nicolas is **not actively job-hunting**; their job is to quickly understand who he is, what he has shipped, and how to reach him.

## Product Purpose

Personal site of Nicolas Coulonnier ("Netoun"), full-stack engineer at Lonestone (Nantes, FR). It exists for **visibility and credibility**: being recognised by peers, having the Labs shared, and growing the network.

Success = peers explore the Labs and share them; visitors leave knowing what Nicolas builds and how to reach him (contact links in the footer, and the résumé PDF).

## Positioning

**A production full-stack engineer whose signature is creative front-end craft.** The backbone is shipped client work (web apps across healthcare, SaaS and corporate platforms at Lonestone; NestJS/React open-source tooling). The edge is the site itself and the Labs: WebGL/WebGPU shaders, 3D CSS, canvas and motion experiments shown live **with their source code**. A generic portfolio can claim "creative developer"; this one proves it and exposes the implementation.

## Operating Context

- Visitors arrive from shared links (GitHub `netoun`, LinkedIn, X `netoun`, email) and from search — each page ships SEO meta, a sitemap and `public/llms.txt` for AI crawlers.
- Routes: `/` (hero, projects, experience, skills, contact footer), `/labs` (experiment index), `/labs/:slug` (live demo + source viewer). `/misc` redirects to `/labs`. Any other path is the 404 (`*` route), with a small game: make 404 from five numbers on a server rack.
- Static prerendered site (React Router framework mode, `ssr: false`) deployed on Cloudflare Pages (`public/_headers`, `_redirects`). No backend, no forms, no analytics in the codebase.

## Capabilities and Constraints

- Content is static TypeScript data: `app/features/projects/data/projects-data.ts`, `app/features/experiences/data/experiences-data.ts`, `app/features/skills/data/skills-data.ts`, `app/features/labs/data/experiments.ts`, `app/features/site/data/contact-links.data.ts`.
- Every page must render fully without JS (prerender-safe) and respect `prefers-reduced-motion`.
- Expensive animations are gated by visibility/idle (`use-animation-priority`); no Lighthouse regression is tolerated.
- New runtime dependencies need justification; no heavy libraries (Framer Motion, Tailwind…).
- **Résumé:** `/cv/` prints one A4 sheet from the site's data; `bun run generate-cv` saves it as `public/nicolas-coulonnier-cv.pdf`. The page is `noindex` and out of the sitemap. The download link sits in the hero's contact popover and on the home footer's plate (Nicolas, 2026-10-01), behind `RESUME_IS_PUBLISHED` (`app/features/site/data/resume.data.ts`), turned on by Nicolas on 2026-10-04. The PDF embeds PP Neue Montreal (as Type 3 subsets).

## Brand Commitments

- Name: **Netoun** (handle) / Nicolas Coulonnier. Page titles follow `Netoun - [page]`.
- Voice: terminal / machine vocabulary — `_❯` prompts, `▐` cursor, underscored labels (`_VIEW PROJECT_`, `_MENU_`), `_0N /` numbering, "ESTABLISH LINK". English copy.
- Existing assets: `public/logo.svg`, favicons, OG images in `public/og-image-*`, local fonts in `public/fonts/`.
- Visual identity is recorded in `DESIGN.md` (root) and its sidecar `.impeccable/design.json`.

## Evidence on Hand

- Real projects with links (personal + Lonestone open source): website, Procedural Maps, Treashunt, Commun'île, Nzoth, Lonestone Boilerplate — see `projects-data.ts`.
- Real experience: Lonestone (Jul 2021 — present), Easilys, Sogeti — see `experiences-data.ts`.
- 13 Labs experiments with live demos and source (`app/features/labs/experiments/`), each with a `man` page and an xray view of its mechanism.
- **Résumé:** English, one A4 page, built from the data above; the descriptions are condensed in `app/pages/cv/data/cv-copy.data.ts`. Education (Master's degree, EPSI Nantes, no years) comes from Nicolas (2026-10-01) and lives only there.
- **Absent — never fabricate:** testimonials, client quotes, metrics, awards, press.
- **Resolved inconsistencies (Nicolas, 2026-09-27/28):**
  - Profiles: `contact-links.data.ts` is the source (`github.com/netoun`, `linkedin.com/in/nicolas-coulonnier-66416813b`); the JSON-LD `sameAs` reads it, `public/llms.txt` matches it.
  - Role label: "Full-stack engineer" everywhere (hero, Lonestone role, home title, JSON-LD `jobTitle`, llms.txt). Past job titles (Easilys "Full Stack Developer") stay as they were.

## Product Principles

1. **Proof over claims.** Credibility comes from working artifacts — live Labs with source, shipped projects with links — never from adjectives or invented numbers.
2. **Engineering is part of the craft.** Every creative piece also demonstrates production quality: performance budget, accessibility, prerender-safety, clean code worth reading.
3. **Peers first, recruiters served.** Optimise for the curious developer who opens the source; make the recruiter path (who, what, contact) obvious without turning the site into a sales page.
4. **Truthful content only.** Bio, dates, links and legal text come from Nicolas; gaps stay visible gaps.

## Accessibility & Inclusion

- WCAG AA contrast for text on both the beige and dark surfaces.
- Visible `:focus-visible` ring on every interactive element; keyboard-complete navigation.
- `prefers-reduced-motion` honoured everywhere (content shown immediately, no motion).
- Interactive primitives via React Aria Components.
