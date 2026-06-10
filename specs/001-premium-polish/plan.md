# Implementation Plan: Premium Polish Pass

**Branch**: `main` (travail par lots, commits atomiques) | **Date**: 2026-06-10 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-premium-polish/spec.md`

## Summary

Élever la qualité perçue du portfolio sans refonte, en 4 lots livrables indépendamment : P1 micro-interactions (focus-visible global, fix zoom image project-card, états hover/press cohérents, magnetic CTA hero), P2 motion orchestrée (entrée hero séquencée via l'orchestrateur existant, scroll reveals avec stagger via `use-animation-priority`), P3 rythme typographique (tokens d'espacement, numérotation terminal des headers), P4 matière/lumière (vocabulaire unifié d'ombres/glows/bordures, alignement labs). Approche : CSS-first (Vanilla Extract), Anime.js seulement où le CSS ne suffit pas, transforms/opacity uniquement.

## Technical Context

**Language/Version**: TypeScript strict, React 19, React Router v7 Framework Mode (`ssr: false`, prerender de `/`)

**Primary Dependencies**: Vanilla Extract (+ recipes), Anime.js, React Aria Components — **zéro ajout autorisé**

**Storage**: N/A (site statique)

**Testing**: Vitest (+ tests composants existants), vérification navigateur (preview/devtools), Lighthouse local avant/après par lot

**Target Platform**: Web statique (Cloudflare Pages), Chrome + Firefox desktop, mobile tactile

**Project Type**: SPA statique prerendered (portfolio)

**Performance Goals**: 60fps sur toutes les animations (Chrome + Firefox), zéro régression Lighthouse (4 catégories), CLS inchangé

**Constraints**: GPU-only (transform/opacity), `prefers-reduced-motion` partout, contenu visible sans JS, invariants DA intouchables (grain hero, blobs gold/cyan/violet, TTAlientzGrotesk H1, glows subtils), tokens `vars.*` only

**Scale/Scope**: 2 routes (`/`, `/labs[/:slug]`), ~5 sections home, ~10 composants touchés, 0 nouveau composant majeur

## Constitution Check

`.specify/memory/constitution.md` est un template vierge — la constitution de facto du projet est `CLAUDE.md` + `docs/design.md`. Gates dérivés :

| Gate | Statut |
|------|--------|
| Aucune nouvelle dépendance | PASS — CSS + Anime.js existants suffisent |
| CSS uniquement en Vanilla Extract, tokens only | PASS — tout le travail est dans des `.css.ts` |
| Architecture de dossiers inchangée | PASS — modifications in-place, aucun déplacement |
| Pas de contenu inventé | PASS — aucun texte nouveau hors labels terminal (`_01 / PROJECTS_`), format déjà établi par la DA |
| `use-animation-priority` pour le coûteux | PASS — reveals scroll branchés dessus |
| React Aria pour l'interactif | PASS — on enrichit les primitives existantes |

Re-check post-design : aucun écart. Complexity Tracking vide.

## Project Structure

### Documentation (this feature)

```text
specs/001-premium-polish/
├── plan.md              # Ce fichier
├── research.md          # Décisions techniques (Phase 0)
├── data-model.md        # Vocabulaire d'interaction/motion (Phase 1)
├── quickstart.md        # Comment vérifier chaque lot (Phase 1)
└── tasks.md             # Généré par /speckit-tasks
```

### Source Code (repository root)

```text
app/
├── styles/
│   ├── theme.css.ts                 # P4 : tokens border/shadow nommés si manquants
│   ├── animations.css.ts            # P2 : keyframes reveal globaux
│   └── motion.css.ts                # P2 (nouveau fichier styles, pas composant) : durées/easings nommés
├── components/
│   ├── primitives/
│   │   ├── button/button.css.ts     # P1 : focus-visible, active, transitions affinées
│   │   ├── tag/                     # P1 : hover/focus states
│   │   └── terminal-buttons/        # P1 : hover/focus states
│   └── layouts/
│       ├── feature-header/          # P2 reveal label→titre · P3 numérotation terminal
│       ├── content-section/         # P3 : rythme vertical tokens
│       └── footer/                  # P1 liens · P4 bordures
├── pages/welcome/
│   ├── sections/welcome-hero/
│   │   ├── orchestrator/            # P2 : séquence d'entrée (H1 → sous-titre → CTAs → laptop)
│   │   └── components/welcome-hero-section-content/  # P1 : magnetic CTA
│   └── sections/welcome-{projects,skills,experience}/  # P2 : scroll reveal + stagger
├── features/
│   ├── projects/components/project-card/   # P1 fix zoom image · P4 ombres
│   ├── experiences/components/experience-card/  # P1 états · P4 ombres
│   └── labs/components/                    # P4 : alignement matière
└── hooks/
    └── use-reveal.hook.ts           # P2 (nouveau hook partagé) : reveal-once + stagger + reduced-motion
```

**Structure Decision**: structure existante inchangée. Deux ajouts légers autorisés et justifiés : `app/styles/motion.css.ts` (vocabulaire durées/easings — évite les valeurs magiques dispersées) et `app/hooks/use-reveal.hook.ts` (un seul hook de reveal réutilisé par toutes les sections, composé sur `use-animation-priority` et `use-intersection-observer` existants). Pas de nouveau composant.

## Implementation Phases (lots)

### Lot P1 — Micro-interactions (quick wins)

1. `button.css.ts` : `:focus-visible` ring (`outline` 2px `vars.colors.primary` + offset), `:active` affiné, transitions courtes ; décliné sur les 4 variants.
2. `project-card.css.ts` : repos `scale(1.05)` → hover `scale(1.15)` (fix du zoom mort, transition existante conservée).
3. Tag, terminal-buttons, liens footer, liens cards : hover + focus-visible cohérents (couleur, micro-translate, réutilisation `⤘`/`▐`).
4. Magnetic CTA hero : petit hook local (souris dans un rayon → `transform: translate(±4px)`, spring-back), monté uniquement si pointer fin + pas de reduced-motion (`matchMedia`), dans `welcome-hero-section-content`.
5. Gate : typecheck + lint + tests + parcours clavier complet + Lighthouse.

### Lot P2 — Motion orchestrée

1. `motion.css.ts` : durées (`fast/base/slow`) + easings nommés (un easing signature commun).
2. Orchestrateur hero : étendre `use-hero-animation.hook` avec la séquence d'entrée (opacity/translateY GPU, délais en cascade) ; fallback reduced-motion = état final immédiat ; contenu visible par défaut (animation = enrichissement, pas de `opacity: 0` initial en CSS pur sans garde JS).
3. `use-reveal.hook.ts` : reveal-once par section (IntersectionObserver via hooks existants), stagger sur les enfants, no-op si reduced-motion.
4. Brancher les 3 sections welcome montées (projects, skills, experience) + `feature-header` (label → titre). NB : `welcome-inspirations/` est du code mort non monté — hors périmètre.
5. Gate : enregistrement perf scroll Chrome + Firefox (pas de frame > 32ms), CLS, reduced-motion, bfcache (pageshow → état final), Lighthouse.

### Lot P3 — Typographie & rythme

1. Audit espacements `content-section` + sections : normaliser sur `vars.spacing.2xl/3xl`, mobile compris.
2. `feature-header` : numérotation terminal `_0N / LABEL_` uniforme (Doto, letterSpacing existant), prop `index` ou data dérivée de l'ordre des sections.
3. Vérif hiérarchie display/body sur tous breakpoints, line-height titres.
4. Gate : revue visuelle mobile + desktop, typecheck/lint, Lighthouse.

### Lot P4 — Matière & lumière

1. `theme.css.ts` : 2-3 valeurs nommées de bordure (`borderSubtle/borderStrong`…) + vocabulaire d'ombre repos/hover si manquant ; remplacer les `color-mix` ad hoc dans project-card, experience-card, footers, terminal bars.
2. Harmoniser les box-shadows des cards (repos discret → hover affirmé, même courbe).
3. Labs : appliquer le même vocabulaire (cards expériences, shell).
4. Gate : comparaison visuelle côte à côte, glows réservés CTAs/hero/hover, Lighthouse final complet vs baseline.

### Transversal (chaque lot)

- Baseline Lighthouse mesurée AVANT P1 (local, build de prod, 3 runs médiane) et comparée après chaque lot.
- `bun run typecheck && bun run lint && bun run test` verts avant tout commit.
- Un commit par étape logique, messages conventionnels.

## Complexity Tracking

Aucune violation — section vide.
