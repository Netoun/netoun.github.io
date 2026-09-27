---
target: homepage
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:/Users/nicolqs/Workspace/netoun-website/app/pages/welcome/page/welcome.page.tsx"
target_fingerprint: "sha256:197fcc3de2d36ce67a63e6d990c50abe109a3c7aeef6a9d8fa6f55dfc4e54f1e"
target_path: /Users/nicolqs/Workspace/netoun-website/app/pages/welcome/page/welcome.page.tsx
timestamp: 2026-09-27T13-15-49Z
slug: app-pages-welcome-page-welcome-page-tsx
---
Method: dual-agent (A: critique-a · B: detector-b) + isolated technical audit (C: audit-c). B returned before A; A ran isolated, unanchored.

# Homepage "/" critique — design 20/32 (Acceptable) · audit 10/20 (Acceptable)

## Design Health (Nielsen, Experience mode)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 2 | 200vh pin: one screen of scroll with no visual change at 1280–1919px; no nav on mobile |
| 2 | Match system / real world | 3 | Jargon labels: `_00…_04`, ESTABLISH LINK, ACTIVE on 5/6 projects |
| 3 | User control and freedom | 3 | Popover OK (Esc, focus return); pin takes over scroll |
| 4 | Consistency and standards | 2 | "Full-stack engineer" (hero) vs "Software Developer" (job); ACTIVE has 2 meanings; lift/glow on non-clickable cards |
| 5 | Error prevention | 3 | "_VIEW PROJECT_" doesn't say source vs demo |
| 6 | Recognition rather than recall | 2 | Labs only in footer; number-only nav; Skills color legend to memorize |
| 7 | Flexibility and efficiency | n/a | Linear reading page |
| 8 | Aesthetic and minimalist design | 3 | Excellent hero; noisy middle (window dots, 5 ACTIVE, 50 tags, subtitles repeating titles) |
| 9 | Error recovery | 2 | Silent failures: no JS → CTA inert, laptop stuck on INITIALIZING; no WebGL → mesh gone |
| 10 | Help and documentation | n/a | Portfolio |
| **Total** | | **20/32 (62.5%)** | **Acceptable** |

## Audit Health
| Dimension | Score | Key finding |
|---|---|---|
| Accessibility | 2 | Focus invisible on all 6 project cards; 3 contrast failures; hero clipped at 400% zoom |
| Performance | 2 | Desktop 99, mobile 80–83 (LCP 3.7 s); laptop widgets animate offscreen |
| Responsive | 2 | No overflow; hero clipped on landscape phone; no nav < 768px |
| Theming | 2 | 166 color-mix, 28 ad hoc box-shadows, 43 raw colors, 2 undefined CSS vars |
| Integrity | 2 | PRODUCT.md/design.md rules (gating, reduced motion, prerender) not enforced by code |
| **Total** | **10/20** | **Acceptable** |
Lighthouse a11y/BP/SEO = 100 on both form factors; none of the above is in its scope.

## Design Specificity Verdict
- LLM: dark bookends (hero, footer) are authored for Netoun; the middle is one template ×3 (eyebrow `_0N /` → title → subtitle restating title → grid), category-interchangeable.
- Biggest missed opportunity: every visual object on the homepage IS a Lab (laptop=computer-3d, rack=server-unit-3d, cards=project-card-3d, grain=grain-shader, mesh=mesh-background, morph=scroll-morph) and the page never says so.
- Detector: source scan 0 findings but blind (can't read Vanilla Extract). Prerendered HTML 40 findings (10 real). Browser 176 desktop (15 real) / 185 mobile (12 real). ~160 FPs = documented palette/glows; detector never loads docs/design.md (expects root DESIGN.md). Extra real bug: `marginTop: -${vars.spacing.sm}` → `-var(...)` invalid, dropped (welcome-hero-section-content.css.ts:89). MabeoVintage preloaded, unused.
- Overlays: [Human] tab, pageId 4 (1440×900).
- A vs C disagreement on project-card focus resolved for C (code-verified).

## Overall Impression
Award-level hero followed by a CV in cards. Biggest lever: route peers to the Labs and caption the page as what it is — an index of live Labs.

## What's Working
1. Hero world: staged entrance, shared house curve CSS/JS, heavy animations gated, correct React Aria popover.
2. One surface vocabulary + visible restraint in code; dark → beige → dark rhythm.
3. Engineering hygiene: full prerender, JS-only reveal hiding, seeded offscreen-paused rack, Labs chunk off homepage, CLS≈0, desktop 99.

## Priority Issues
1. [P1] [Hero · Nav · Footer] Labs buried: only route = footer link (footer.component.tsx:69); hero offers contact only; no LABS nav item; no object points to its Lab. Fix: secondary "Explore the Labs →" CTA in hero, LABS nav item, `⤘ /labs/<slug>` captions (laptop, rack, cards), dedicated footer Labs line. Command: shape.
2. [P1] [Hero] Dead-scroll pin + clipping: getContainerMaxWidth() (use-hero-morph-progress.hook.ts:25-31) hand-copies max-widths that no longer match container.css.ts:29 → targetScale clamped to 1 at 1280–1919 (one pinned screen, nothing moves); at 1920 text shrinks ×0.757; overflow hidden + 100vh → paragraph + CTA invisible at 844×390 and 400% zoom (WCAG 1.4.10). Fix: target from measured container, pin ~120vh, clip-path/inset morph instead of scale, min-height + svh when inactive. Commands: animate, adapt.
3. [P1] [Projects] Main links break a11y/prerender: global `a:focus-visible` offset 2px (global.css.ts:68-72, 0,1,1) beats card's base-class -2px (project-card.css.ts:50) → ring clipped by overflow hidden (WCAG 2.4.7); toLocaleDateString without timeZone (project-card.component.tsx:121) → React #418 west of UTC (reproduced TZ=America/Los_Angeles), wrong month, full client re-render; ~40-word link names, title read twice. Command: harden.
4. [P1] [Global] Doto too small/light where it matters: client project titles 2.93:1, copyright 2.72:1, contact links 14px/400 @75%, nav + ACTIVE 9.6px (`2xs` token below documented `xs` floor). Doto 900 ≥16px reads fine → missing floor. Fix: Doto floor, metadata in PP Neue Montreal, mutedForegroundOnDark token. Commands: typeset, colorize.
5. [P2] [Projects · Experience · Skills] Work doesn't lead: 6 equal cards by date, 140px images, ACTIVE = featured flag on 5/6, no source vs demo; Experience capped at 640px inside 1135px card; Skills 50 tags with two contradictory color taxonomies. Commands: layout, distill.

## Persona Red Flags
- Technical peer: admires laptop without knowing it's /labs/computer-3d; random-hex screen reads as theatre; pin reads as broken morph.
- Recruiter (60 s): name/role/employer in 5 s; client work in faintest type; role contradicts hero; no plain-text email.
- Casey (mobile): 7,671px (~9 screens) without nav; 21px contact links; hero CTA disappears in landscape.
- Riley: no JS → inert CTA, laptop stuck; reduced motion → mesh still drifts on scroll (respectReducedMotion={false}), card tilt ignores preference.

## Minor Observations
- og:image points to nonexistent /images/projects/website.webp (root.tsx:30-34); og-image-1200x630.png exists unused (audit P1).
- Laptop widgets never pause offscreen: render(index < visibleZones) lacks shouldAnimate (welcome-hero-computer.component.tsx:207-219) → 2 rAF loops + ~31 DOM mutations/s all visit (audit P1).
- Laptop tilt dies after scroll round-trip (reproduced 3/3; fix useSyncExternalStore).
- Hero entrance re-hides the painted h1 at hydration (blink).
- Footer inside <main>; footer h3 under SKILLS h2.
- Doto via render-blocking Google Fonts (~800 ms mobile); MabeoVintage preloaded unused; no mobile Lighthouse baseline.
- welcome-hero.png (1.9 MB) unreferenced.
- 26 oxlint warnings, 17 style= props.
- Content to confirm with Nicolas: "… and many more", Sogeti/Easilys overlap, Treashunt marketing copy.

## Questions to Consider
1. What if every live object carried its `⤘ /labs/<slug>` caption, like a museum label?
2. Is the laptop there to look busy or to be true?
3. What would the page lose if Skills disappeared and each tag lived on the project or job that proves it?
4. Should the page end on "Thanks for exploring" or on the next thing a peer should do?

## Per-section diagnosis
| Section | Verdict | Keep | Issues |
|---|---|---|---|
| Global | refine | OKLCH tokens, dark/beige/dark rhythm, reduced-motion kill switch | Doto floor P1 typeset · OG image P1 harden · DESIGN.md missing/drifted P2 document · fonts P2 optimize |
| Nav | refine | rAF progress, aria-current, gold→mint→violet track | no LABS P1 shape · hidden < 768 P2 adapt · 9.6px numbers P2 clarify |
| Hero | refine (keep world) | mesh + grain, booting laptop, CTA + popover, staged entrance | dead pin + clipping P1 animate/adapt · no Labs path P1 shape · widgets offscreen P1 optimize · JS/WebGL-only P2 harden |
| Projects | rework | card craft (lighten) | focus + hydration + link name P1 harden · no lead, ACTIVE, source/demo P2 layout |
| Experience | refine | real clients, quiet rail | client titles 2.93:1 P1 colorize · 640/1135 P2 layout · useless blur P2 distill |
| Skills | rework or merge | color-by-domain | two taxonomies, 50 tags = claim not proof P2 distill |
| Footer | refine | dark panel, rack, LEDs, ESTABLISH LINK | inverted hierarchy P1 typeset · copyright 2.72:1 P1 colorize · Labs footnote P2 shape · 21px targets P2 adapt |
