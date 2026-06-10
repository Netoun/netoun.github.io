# Tasks: Premium Polish Pass

**Input**: Design documents from `/specs/001-premium-polish/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md
**Tests**: non demandés explicitement — vérification par gates (typecheck/lint/test existants + navigateur + Lighthouse), pas de nouveaux tests sauf si un comportement testable est ajouté (hooks).

## Phase 1: Setup

- [x] T001 Mesurer la baseline Lighthouse : `bun run build`, servir le build de prod local, 3 runs, consigner la médiane des 4 catégories + LCP/CLS/TBT dans specs/001-premium-polish/baseline-lighthouse.md
- [x] T002 Vérifier que la base est verte avant chantier : `bun run typecheck && bun run lint && bun run test` (corriger ou signaler tout échec préexistant avant de continuer)

## Phase 2: Foundational (bloquant pour toutes les stories)

- [x] T003 Créer le vocabulaire motion (durées fast/base/slow + easings signature/out, D5 de research.md) dans app/styles/motion.css.ts, en promouvant le cubic-bezier(.22,1,.36,1) déjà utilisé par project-card.css.ts

**Checkpoint**: tokens motion disponibles — les 4 stories peuvent démarrer.

## Phase 3: User Story 1 — Micro-interactions impeccables (P1) 🎯 MVP

**Goal**: chaque élément interactif a des états rest/hover/focus-visible/active distincts ; zoom image project-card réparé ; magnetic CTA hero.

**Independent Test**: parcours souris + clavier complet de `/` et `/labs` (quickstart.md §P1).

- [x] T004 [US1] Ajouter `:focus-visible` (outline 2px primary + offset 2px, D6) et affiner `:active`/transitions avec les tokens motion dans app/components/primitives/button/button.css.ts (les 4 variants)
- [x] T005 [P] [US1] Réparer le zoom image mort : repos `scale(1.05)` → hover `scale(1.15)` dans app/features/projects/components/project-card/project-card.css.ts (transition existante conservée)
- [x] T006 [P] [US1] N/A — Tag est non interactif (pas de onClick/href) ; FR-001 ne s'applique qu'aux éléments interactifs. Un ring global a/button/[tabindex]:focus-visible existe déjà dans global.css.ts
- [x] T007 [P] [US1] N/A — terminal-buttons sont des pastilles décoratives (traffic lights), non interactives
- [x] T008 [P] [US1] États hover + focus-visible des liens dans app/components/layouts/footer/ et des liens/labels de cartes (project-card.css.ts `linkLabelStyle`, experience-card)
- [x] T009 [US1] Créer le hook magnetic (mousemove rAF-throttled → `--magnet-x/--magnet-y` clamp ±4px, monté seulement si `(pointer: fine)` et pas reduced-motion, D3) dans app/pages/welcome/sections/welcome-hero/hooks/use-magnetic.hook.ts + test unitaire du clamp
- [x] T010 [US1] Brancher le magnetic sur les CTAs du hero dans app/pages/welcome/sections/welcome-hero/components/welcome-hero-section-content/ (composant + .css.ts : `translate3d(var(--magnet-x), var(--magnet-y), 0)` + transition retour)
- [x] T011 [US1] Gate US1 : `bun run typecheck && bun run lint && bun run test` + quickstart.md §P1 (souris, clavier, reduced-motion, tactile) + Lighthouse vs baseline

**Checkpoint**: US1 livrable seule — quick wins visibles.

## Phase 4: User Story 2 — Arrivée et défilement orchestrés (P2)

**Goal**: entrée hero séquencée, sections révélées en stagger une seule fois, fluide Chrome + Firefox.

**Independent Test**: quickstart.md §P2 (reload, scroll, perf panel, reduced-motion, no-JS, bfcache).

- [ ] T012 [US2] Créer app/hooks/use-reveal.hook.ts (états idle/revealed/static de data-model.md : classe posée par JS avant paint, IntersectionObserver via use-intersection-observer + use-animation-priority existants, stagger `--reveal-index`, no-op reduced-motion, pageshow → static, D1/D2) + test unitaire des transitions d'état
- [ ] T013 [US2] Ajouter les styles de reveal partagés (état caché transform/opacity, transition tokens motion, media query reduced-motion) dans app/styles/animations.css.ts
- [ ] T014 [US2] Étendre l'orchestrateur hero avec la séquence d'entrée H1 → sous-titre → CTAs → laptop (timeline Anime.js, transform/opacity only, fallback reduced-motion = état final, D4) dans app/pages/welcome/sections/welcome-hero/orchestrator/use-hero-animation.hook.ts
- [ ] T015 [P] [US2] Brancher use-reveal + stagger sur welcome-projects et welcome-skills (app/pages/welcome/sections/welcome-projects/, welcome-skills/ — .section.tsx + .css.ts)
- [ ] T016 [P] [US2] Brancher use-reveal + stagger sur welcome-experience (app/pages/welcome/sections/welcome-experience/) — welcome-inspirations est du code mort non monté, hors périmètre
- [ ] T017 [US2] Reveal label → titre dans app/components/layouts/feature-header/ (réutiliser l'animation Anime.js existante du composant, l'aligner sur les tokens motion)
- [ ] T018 [US2] Gate US2 : quickstart.md §P2 complet (perf scroll Chrome + Firefox sans frame >32ms, CLS, reduced-motion, JS off, bfcache, resize fenêtre pendant l'entrée hero sans layout shift ni état bloqué) + typecheck/lint/test + Lighthouse vs baseline

**Checkpoint**: US1+US2 = l'essentiel de l'impact premium.

## Phase 5: User Story 3 — Rythme typographique (P3)

**Goal**: respiration verticale régulière (tokens), numérotation terminal uniforme des sections.

**Independent Test**: quickstart.md §P3 (comparaison desktop + 375px, format des headers).

- [ ] T019 [US3] Normaliser le rythme vertical (vars.spacing.2xl/3xl, mobile compris) dans app/components/layouts/content-section/ et les .css.ts des sections welcome
- [ ] T020 [US3] Numérotation terminal `_0N / LABEL_` uniforme (Doto, letterSpacing existant, prop index) dans app/components/layouts/feature-header/feature-header.component.tsx + feature-header.css.ts, et passer l'index depuis les sections de app/pages/welcome/
- [ ] T021 [US3] Vérifier hiérarchie display/body et line-height des titres sur tous les breakpoints (ajuster dans les .css.ts concernés uniquement si écart)
- [ ] T022 [US3] Gate US3 : revue visuelle mobile + desktop (quickstart.md §P3) + typecheck/lint/test + Lighthouse vs baseline

## Phase 6: User Story 4 — Matière et lumière unifiées (P4)

**Goal**: vocabulaire unique d'ombres/glows/bordures sur toutes les surfaces, labs aligné sur la home.

**Independent Test**: quickstart.md §P4 (comparaison côte à côte, audit glows).

- [ ] T023 [US4] Ajouter les tokens de surface (border subtle/strong, shadow restCard/hoverCard — data-model.md) dans app/styles/theme.css.ts
- [ ] T024 [P] [US4] Remplacer les color-mix/box-shadows ad hoc par les tokens dans app/features/projects/components/project-card/project-card.css.ts et app/features/experiences/components/experience-card/
- [ ] T025 [P] [US4] Appliquer les tokens de surface aux footers et terminal bars (app/components/layouts/footer/, project-card terminalBarStyle)
- [ ] T026 [US4] Aligner labs sur le vocabulaire de matière de la home (app/features/labs/components/ — shell et cards d'expériences)
- [ ] T027 [US4] Gate US4 : quickstart.md §P4 (continuité home → labs, glows réservés CTAs/hero/hover) + typecheck/lint/test + Lighthouse vs baseline

## Phase 7: Polish & Cross-Cutting

- [ ] T028 Passe transversale finale : parcours clavier complet, reduced-motion, mobile 375px sur `/` et `/labs` (SC-001, SC-005, SC-006 de spec.md)
- [ ] T029 Lighthouse final complet vs baseline-lighthouse.md — zéro régression sur les 4 catégories (SC-002) ; retirer/retravailler toute finition qui coûte
- [ ] T030 Mettre à jour docs/design.md : tokens motion (durées/easings), tokens de surface, règle focus-visible — sections nouvelles uniquement, invariants intacts
- [ ] T031 Nettoyage : supprimer SPEC.md racine (cadrage migré dans specs/001-premium-polish/) et vérifier `bun run build` final

## Dependencies

- Phase 1 → Phase 2 → toutes les stories.
- US1 (P3) indépendante. US2 dépend de T003 (tokens motion). US3 indépendante (T020 touche feature-header comme T017 — séquencer si menées en parallèle). US4 indépendante mais après US1 recommandé (T024 retouche les mêmes .css.ts que T005/T008).
- Ordre de livraison validé : US1 → US2 → US3 → US4 → Polish.

## Parallel Examples

- US1 : T005, T006, T007, T008 en parallèle (fichiers distincts) après T004.
- US2 : T015 et T016 en parallèle après T012+T013.
- US4 : T024 et T025 en parallèle après T023.

## Implementation Strategy

MVP = US1 seule (quick wins livrables immédiatement). Livraison incrémentale lot par lot, gate Lighthouse à chaque checkpoint, commit atomique par tâche ou groupe parallèle.
