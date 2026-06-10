# SPEC — Premium Polish Pass

## Objective

Élever la qualité perçue du portfolio (netoun.com) sans refonte : finitions, micro-interactions, motion orchestrée, rythme typographique. Cible : recruteurs et pairs techniques — le site doit donner la même impression qu'un produit soigné de studio. Périmètre : **polish de l'existant uniquement**, aucun nouveau composant majeur, aucune nouvelle dépendance.

## Scope — 5 lots

### Lot A — Motion orchestrée (entrée & scroll)

- **A1** Hero : chorégraphie d'entrée séquencée (H1 reveal → sous-titre → CTAs → laptop 3D) via l'orchestrator existant — délais intentionnels, easing commun.
- **A2** Sections welcome (projects, skills, experience, inspirations) : reveal au scroll avec stagger sur les cards (opacity + translateY GPU-only), déclenché via `use-animation-priority`.
- **A3** Headers de section (`feature-header`) : reveal du label terminal puis du titre.
- **Critères** : 60fps Firefox + Chrome, aucun layout shift (CLS stable), `prefers-reduced-motion` → tout visible immédiatement sans animation.

### Lot B — Micro-interactions

- **B1** Button : ajouter `:focus-visible` ring visible (token primary), affiner `:active` (scale/translateY + transition courte), états cohérents sur les 4 variants.
- **B2** Project card : **fix du zoom image mort** (`scale(1.15)` repos = hover dans `project-card.css.ts`) — repos `1.05`, hover `1.15`.
- **B3** Tags, terminal-buttons, liens footer : hover/focus states cohérents (couleur + micro-translate), curseur `▐` ou arrow `⤘` réutilisés.
- **B4** CTA hero « magnetic » subtil (suivi souris ±4px max, GPU transform, désactivé mobile + reduced-motion).
- **Critères** : tout élément interactif a un état hover ET focus-visible distincts ; navigation clavier irréprochable.

### Lot C — Typographie & rythme

- **C1** Audit espacement vertical entre sections : passer sur un rythme cohérent (tokens `2xl`/`3xl`), plus d'air autour des titres display.
- **C2** Numérotation terminal des sections (`_01 / PROJECTS_`…) cohérente partout, même format Doto + letterSpacing.
- **C3** Hiérarchie : vérifier tailles display vs body sur tous les breakpoints, resserrer line-height des titres si besoin.
- **Critères** : aucun espacement arbitraire (tokens only), hiérarchie h1→h2→h3 stricte, mobile aussi aéré que desktop.

### Lot D — Matière & lumière

- **D1** Harmoniser les ombres/glows : un seul vocabulaire (repos discret → hover affirmé), supprimer les box-shadows ad hoc divergents entre cards.
- **D2** Bordures : unifier les `color-mix` de borders (cards, footers, terminal bars) sur 2-3 valeurs nommées.
- **D3** Labs : aligner les fiches expériences sur le même vocabulaire de matière (grain, borders, glows) que la home.
- **Critères** : glows réservés CTAs/hero/hover (règle design.md), pas de néon agressif, identité blobs gold/cyan/violet intacte.

### Lot E — Transversal (chaque lot)

- `prefers-reduced-motion` respecté sur toute nouvelle animation.
- Mobile : chaque finition a son équivalent tactile (pas de premium hover-only).
- Lighthouse : LCP/CLS/INP non régressés après chaque lot (comparaison vs prod actuel).
- `bun run typecheck && bun run lint` verts après chaque lot.

## Ordre & priorité

B (quick wins visibles) → A (plus gros impact perçu) → C → D. Lot E transversal.

## Commands

```bash
bun run dev          # localhost:5173
bun run typecheck && bun run lint   # après chaque changement significatif
bun run test         # vitest
bun run build
```

## Project structure

Existante, inchangée (cf. CLAUDE.md). Travaux dans :
`app/components/primitives/*`, `app/pages/welcome/sections/*`, `app/features/{projects,experiences,skills,labs}/components/*`, `app/styles/*`, `app/pages/welcome/page/orchestrator/`.

## Code style

- Vanilla Extract uniquement, tokens `vars.*`, breakpoints mobile-first.
- Animations : Anime.js ou CSS, **transforms/opacity GPU-only**, jamais de distorsion de texte, toujours `use-animation-priority` pour le coûteux.
- Composants : `name.component.tsx` + `name.css.ts` + `name.test.tsx`, kebab-case.

## Testing strategy

- Tests existants ne cassent pas ; nouveau comportement testable (ex. variants recipe) → test ciblé.
- Vérification visuelle navigateur (preview) par lot : hover/focus/scroll/reduced-motion/mobile (resize).
- Lighthouse local avant/après par lot.

## Boundaries

- **Always** : typecheck + lint après chaque lot ; reduced-motion fallback ; tokens only.
- **Ask first** : tout nouveau composant, toute modification de l'architecture des dossiers, tout ajout > polish (preloader, curseur custom…).
- **Never** : nouvelle dépendance ; CSS hors Vanilla Extract ; inventer du contenu (bio, projets, liens) ; casser les invariants hero (grain SVG, 3 blobs, TTAlientzGrotesk H1, glows subtils) ; animations non-GPU ou saccadées Firefox.

## Unresolved questions

1. Lot B4 (CTA magnetic) : ok ou trop gadget ?
2. Lot C2 : la numérotation `_01 / PROJECTS_` existe-t-elle déjà partiellement ? (à vérifier en implémentation — si absente, c'est un ajout léger, validé ?)
3. Lighthouse : seuil de tolérance (strictement ≥ scores actuels, ou -1pt acceptable) ?
