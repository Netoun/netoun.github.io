# CLAUDE.md

This file provides guidance to ai (claude.ai/opencode) when working with code in this repository.

## Project

Portfolio personnel de Nicolas Coulonnier (Netoun), ingénieur full stack chez Lonestone. Cible : recruteurs et pairs techniques. Objectif : visibilité, téléchargement du CV, prise de contact. DA néo-rétro futuriste, 3D — voir @design.md.

**Ne jamais inventer de contenu** (bio, expériences, liens, textes légaux).

## Stack

React Router v7 · React 19 · TypeScript strict · Vite · Vanilla Extract CSS · Anime.js · React Aria Components · oxlint · Vitest · Bun

React Router **Framework Mode**, `ssr: false`, prerender statique de `/`. Pas de loaders/actions serveur.

## Commands

```bash
bun run dev          # localhost:5173
bun run build
bun run typecheck    # react-router typegen + tsc
bun run test         # vitest watch
bun run lint  # oxlint
bun run fmt   # oxfmt autofix

bun run test app/components/primitives/button/button.test.tsx  # test ciblé
```

**Après toute modification importante :** `bun run typecheck && bun run lint`

## Structure

```
app/
  routes.ts                  # index → welcome.page, /misc → misc.page
  root.tsx                   # Layout global, fonts, ErrorBoundary
  components/
    layouts/                 # Section, Container — wrappers structurels
    primitives/              # UI de base (Button, Slider, Image, ClientOnly)
    misc/                    # Composants décoratifs animés (Computer, Kirby, canvas…)
  pages/<page>/
    page/<page>.page.tsx     # export meta() + composant route
    sections/                # sections + hooks locaux à la page
  hooks/                     # hooks partagés (animation, scroll, souris)
  styles/                    # tokens, global, responsive, animations, fonts
```

Aliases : `@/` → `app/`, `@components/`, `@primitives/`, `@styles/`.

## Conventions

- Chaque composant dans son propre dossier : `name.component.tsx` + `name.css.ts` + `name.test.tsx`
- Kebab-case pour fichiers et dossiers, comments en anglais
- TypeScript strict — pas de `any`, pas de `as` sauf nécessité absolue

## Styling — Vanilla Extract

Tout le CSS est en `.css.ts`. **Pas de Tailwind, pas de CSS classique, pas de `style=`.**

- `vars.*` → CSS variables runtime
- `colors`, `spacing`… importés directement → valeurs statiques (dans `globalStyle` ou hors runtime)
- Variants → `recipe()` de `@vanilla-extract/recipes`
- Breakpoints → `app/styles/responsive.css.ts`, mobile-first
- Keyframes globaux → `app/styles/animations.css.ts`

## Animations

Toujours utiliser `use-animation-priority` pour les animations coûteuses :

| Priorité | Comportement |
|---|---|
| `high` | Toujours animé |
| `medium` | Animé si visible (IntersectionObserver) |
| `low` | Animé si visible + browser idle (requestIdleCallback) |

## SEO & accessibilité

- Chaque page exporte `meta()` — format : `"Netoun - [page]"`, description unique
- Open Graph absent — à ajouter sur toute nouvelle page
- Une seule `<h1>` par page
- Primitives interactives via React Aria Components — ne pas substituer par du HTML natif brut

## Performance

- Fonts woff2 locaux dans `/public/fonts/`, Google Fonts uniquement pour Inter et Doto
- Images dans `app/pages/<page>/assets/` ou `public/`, format WebP/PNG, `alt` toujours renseigné
- Ne pas ajouter de dépendance sans justification

## Interdits

- Modifier l'architecture des dossiers sans demander
- Ajouter des librairies lourdes (Framer Motion, Tailwind…) sans accord
- Écrire du CSS hors Vanilla Extract
- Bypasser oxlint (`--no-verify`)

## Workflow

1. Explorer le code avant toute proposition
2. Proposer un plan si la modification touche plusieurs fichiers
3. Implémenter → valider (`typecheck` + `lint`)
4. Résumer ce qui a changé

## Design system

@design.md
