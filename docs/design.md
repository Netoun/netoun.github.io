# Design System

## Art Direction

**Neo-retro futuristic** — dark cinematic aesthetic inspired by 90s terminal interfaces, revisited in high definition. The site is sober globally (beige background, clean typography) but the hero imposes an immersive dark atmosphere generated entirely in CSS/SVG.

### Hero Atmosphere (`WelcomeHeroFilterBackground`)

| Layer       | Technique                                                           | Detail                                                |
| ----------- | ------------------------------------------------------------------- | ----------------------------------------------------- |
| Dark base   | CSS                                                                 | Masks the global beige                                |
| Mesh blobs  | SVG `feGaussianBlur` stdDeviation=25                                | Gold top-left · Cyan bottom-left · Violet top-right   |
| Film grain  | SVG `feTurbulence` fractalNoise baseFrequency=1.26, blend `overlay` | Grainy texture over the entire hero                   |
| Mouse trail | Canvas (mounted after 2s, client-only)                              | Traces cursor path                                    |
| Laptop 3D   | CSS 3D — `Computer` component                                       | Multi-face box (lid + chassis), isometric perspective |

### Typography

| Role               | Font             | Note                                       |
| ------------------ | ---------------- | ------------------------------------------ |
| H1 display         | PPNeueMontreal   | Very large, cream white, `textShadow.glow` |
| Body / UI          | PPNeueMontreal   | Default body font                          |
| Terminal / buttons | Doto (monospace) | Screen-style labels                        |
| Decorative         | MabeoVintage     | Occasional accents                         |

Terminal micro-details to preserve: `_❯` prefix, `▐` cursor, underscores around labels (`_GET MY RESUME_`), `⤘` arrow.

### Invariants — Do Not Break

- SVG grain stays as overlay on the entire hero
- The 3 mesh blob colors (gold, cyan, violet) define the home page visual identity
- Glows remain subtle — no aggressive neon

---

## Colors (OKLCH)

Defined in `app/styles/theme.css.ts`, accessible via `vars.colors.*`.

| Token         | Value                       | Usage                                   |
| ------------- | --------------------------- | --------------------------------------- |
| `background`  | oklch(0.93 0.03 80)         | General background (warm beige)         |
| `foreground`  | oklch(0.07 0 0)             | Main text                               |
| `primary`     | oklch(0.8858 0.182 95.69)   | Yellow/gold — CTAs, main accents        |
| `secondary`   | oklch(0.7906 0.1573 166.87) | Mint green — secondary accents          |
| `tertiary`    | oklch(0.5548 0.2575 312.98) | Violet                                  |
| `kirby`       | oklch(0.8455 0.0872 355.09) | Pink — exclusive to the Kirby component |
| `muted`       | oklch(0.96 0 0)             | Secondary backgrounds, subtle hover     |
| `border`      | oklch(0.9 0 0)              | Borders                                 |
| `destructive` | oklch(0.55 0.22 29)         | Errors, dangerous actions               |

Hover states: `color-mix(in srgb, ${vars.colors.primary} 90%, transparent)` — never hardcoded values.

## Typography

| Font             | Local file                      | Usage              |
| ---------------- | ------------------------------- | ------------------ |
| PPNeueMontreal   | `PPNeueMontreal-Variable.woff2` | Body, general UI   |
| MabeoVintage     | `MabeoVintage-Regular.woff2`    | Decorative accents |
| Doto             | Google Fonts                    | Terminal / buttons |
| Inter            | Google Fonts                    | Fallback           |

Local files in `/public/fonts/`. Sizes via `vars.fontSize.*` (`xs` 0.75rem → `10xl` 10.5rem). Weights via `vars.fontWeight.*`.

## Spacing & Radius

**Spacing** `vars.spacing.*`: `xs` 0.25 · `sm` 0.5 · `md` 1 · `lg` 1.5 · `xl` 2 · `2xl` 3 · `3xl` 4rem — no arbitrary values.

**Radius** `vars.radius.*`: `sm` 0.5 · `md` 1 · `lg` 1.5 · `xl` 2 · `full` 9999px.

## Shadows & Glows

`vars.boxShadow`: `glow` / `glowXl` / `glow2xl` — halos combining `primary` and `secondary`.
`vars.textShadow`: `glow` / `glowPrimary` — same logic for text.

Reserved for CTAs and hero elements. Overused, the effect disappears.

## Surfaces (cards, panels, terminal bars)

One shared vocabulary for every card-like surface:

| Token | Usage |
| ----- | ----- |
| `vars.border.subtle` | Card borders, terminal bar separators (50% cardBorder mix) |
| `vars.border.strong` | Stronger separators (footers) |
| `vars.boxShadow.restCard` | Cards at rest — discreet halo |
| `vars.boxShadow.hoverCard` | Cards on hover — lift + accent ring |

No ad hoc `color-mix` borders or one-off box-shadows on surfaces.

## Motion

Tokens in `app/styles/motion.css.ts` (static values, not runtime vars):

| Token | Value | Usage |
| ----- | ----- | ----- |
| `motion.duration` | `fast` 150ms · `base` 300ms · `slow` 600ms | All transitions |
| `motion.easing.signature` | cubic-bezier(0.22, 1, 0.36, 1) | Reveals, hovers — the house curve |
| `motion.staggerStep` | 70ms | Scroll reveal stagger (index capped at 5) |

Scroll reveals via `use-reveal.hook` (`data-reveal` / `data-reveal-item`): hidden state is only ever applied by JS before paint — prerendered HTML stays fully visible without JS. Every animation respects `prefers-reduced-motion` (content shown immediately, no motion).

## Focus

Every interactive element has a visible `:focus-visible` ring: `outline 2px` + offset, `foreground` on light surfaces (gold is too close to the beige background), `primary` on dark surfaces (footer). Never remove it.

## Breakpoints (mobile-first)

```ts
import { breakpoints } from "@styles/responsive.css";
// sm 640px · md 768px · lg 1024px · xl 1280px · 2k 1920px

style({
  fontSize: vars.fontSize.base,
  "@media": {
    [breakpoints.lg]: { fontSize: vars.fontSize.xl },
  },
});
```

## Visual Rules

- One `<h1>` per page, strict hierarchy
- Spacing via tokens only
- `foreground`/`background` contrast WCAG AA
- Animations out of viewport always paused (`use-animation-priority`)
- Glows reserved for CTAs and hero — no general decorative use
