# Design System

## Direction artistique

**Néo-rétro futuriste** — esthétique cinématique dark inspirée des interfaces terminal des années 90, revisitée en haute définition. Le site est sobre côté global (fond beige, typo propre) mais le hero impose une atmosphère immersive et sombre générée entièrement en CSS/SVG.

### Atmosphère hero (`WelcomeHeroFilterBackground`)

| Couche | Technique | Détail |
|---|---|---|
| Fond sombre | CSS | Masque le beige global |
| Mesh blobs | SVG `feGaussianBlur` stdDeviation=25 | Or haut-gauche · Cyan bas-gauche · Violet haut-droit |
| Film grain | SVG `feTurbulence` fractalNoise baseFrequency=1.26, blend `overlay` | Texture granuleuse sur tout le hero |
| Mouse trail | Canvas (monté après 2s, client-only) | Trace le chemin curseur |
| Laptop 3D | CSS 3D — composant `Computer` | Boîte à faces multiples (lid + chassis), perspective isométrique |

### Typographie

| Rôle | Font | Note |
|---|---|---|
| H1 display | TTAlientzGrotesk | Très grande, blanc crème, `textShadow.glow` |
| Body / UI | PPNeueMontreal | Police par défaut du body |
| Terminal / boutons | Doto (monospace) | Labels style écran |
| Décoratif | MabeoVintage | Accents ponctuels |

Micro-détails terminaux à préserver : préfixe `_❯`, curseur `▐`, underscores autour des labels (`_GET MY RESUME_`), flèche `⤘`.

### Invariants — ne pas casser

- Le grain SVG reste en overlay sur tout le hero
- Les 3 couleurs de mesh blobs (or, cyan, violet) définissent l'identité visuelle de l'accueil
- TTAlientzGrotesk sur le H1 — ne pas substituer
- Les glows restent subtils — pas de néon agressif

---

## Couleurs (OKLCH)

Définies dans `app/styles/theme.css.ts`, accessibles via `vars.colors.*`.

| Token | Valeur | Usage |
|---|---|---|
| `background` | oklch(0.93 0.03 80) | Fond général (beige chaud) |
| `foreground` | oklch(0.07 0 0) | Texte principal |
| `primary` | oklch(0.8858 0.182 95.69) | Jaune/or — CTA, accents principaux |
| `secondary` | oklch(0.7906 0.1573 166.87) | Vert menthe — accents secondaires |
| `tertiary` | oklch(0.5548 0.2575 312.98) | Violet |
| `kirby` | oklch(0.8455 0.0872 355.09) | Rose — usage exclusif au composant Kirby |
| `muted` | oklch(0.96 0 0) | Fonds secondaires, hover subtil |
| `border` | oklch(0.9 0 0) | Bordures |
| `destructive` | oklch(0.55 0.22 29) | Erreurs, actions dangereuses |

États hover : `color-mix(in srgb, ${vars.colors.primary} 90%, transparent)` — jamais de valeurs en dur.

## Typographie

| Font | Fichier local | Usage |
|---|---|---|
| PPNeueMontreal | `PPNeueMontreal-Variable.woff2` | Body, UI général |
| TTAlientzGrotesk | `TT_Alientz_Grotesque.woff2` | Titres display |
| MabeoVintage | `MabeoVintage-Regular.woff2` | Accents décoratifs |
| Doto | Google Fonts | Terminal / boutons |
| Inter | Google Fonts | Fallback |

Fichiers locaux dans `/public/fonts/`. Tailles via `vars.fontSize.*` (`xs` 0.75rem → `10xl` 10.5rem). Poids via `vars.fontWeight.*`.

## Espacements & Radius

**Spacing** `vars.spacing.*` : `xs` 0.25 · `sm` 0.5 · `md` 1 · `lg` 1.5 · `xl` 2 · `2xl` 3 · `3xl` 4rem — pas de valeurs arbitraires.

**Radius** `vars.radius.*` : `sm` 0.5 · `md` 1 · `lg` 1.5 · `xl` 2 · `full` 9999px.

## Ombres & Glows

`vars.boxShadow` : `glow` / `glowXl` / `glow2xl` — halos combinant `primary` et `secondary`.
`vars.textShadow` : `glow` / `glowPrimary` — même logique pour le texte.

Réservés aux CTA et éléments hero. Utilisés en excès, l'effet disparaît.

## Breakpoints (mobile-first)

```ts
import { breakpoints } from '@styles/responsive.css';
// sm 640px · md 768px · lg 1024px · xl 1280px · 2k 1920px

style({
  fontSize: vars.fontSize.base,
  '@media': {
    [breakpoints.lg]: { fontSize: vars.fontSize.xl },
  },
});
```

## Règles visuelles

- Une seule `<h1>` par page, hiérarchie stricte
- Espacement via tokens uniquement
- Contraste `foreground`/`background` WCAG AA
- Animations hors viewport toujours pausées (`use-animation-priority`)
- Glows réservés aux CTA et hero — pas d'usage décoratif généralisé
