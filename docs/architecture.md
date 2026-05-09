# Architecture des composants

## Arborescence globale

```
app/
  components/          # Composants partagés (réutilisables dans toutes les pages)
  features/<domain>/   # Métier partagé (UI + data + hooks + types réutilisés)
  pages/<feature>/     # Module d'une page
    page/              # Fichier de route (<feature>.page.tsx)
    sections/          # Sections propres à cette page
    components/        # Sous-composants propres à la page
    hooks/             # Hooks propres à la page
    data/              # Données statiques de la page
    assets/            # Assets de la page
```

---

## Catégories de `app/components/`

| Dossier       | Rôle                                                          | Exemples                                     |
| ------------- | ------------------------------------------------------------- | -------------------------------------------- |
| `primitives/` | Atomes UI réutilisables, sans logique métier                  | `button/`, `tag/`, `slider/`, `client-only/` |
| `layouts/`    | Tout ce qui structure la page                                 | `container/`, `sections/`, `feature-header/` |
| `misc/`       | Composants complexes mais réutilisables (décoratifs, visuels) | `computer/`, `kirby/`, `dots-canvas/`        |

### Règles

- **`feature-header/`** est un layout → dans `layouts/`, pas à la racine.
- Usage unique d'une page → reste dans `pages/<feature>/components/` ou `pages/<feature>/sections/<section>/components/`.
- UI générique utilisée par 2+ pages → monte dans `app/components/`.
- UI/data/hooks/types métier utilisés par 2+ pages → montent dans `app/features/<domain>/`.

---

## Catégories de `app/features/`

`app/features/` contient le code métier partagé entre plusieurs pages. Les dossiers de domaine suivent les noms de pages au pluriel.

```
app/features/
  projects/
    components/
      project-card/
        project-card.component.tsx
        project-card.css.ts
    data/
      projects-data.ts
    hooks/
      use-projects.hook.ts
      use-projects.hook.types.ts
  experiences/
    components/
      experience-card/
        experience-card.component.tsx
        experience-card.css.ts
    data/
      experiences-data.ts
    hooks/
      use-experiences.hook.ts
      use-experiences.hook.types.ts
```

### Règles

- Nom de domaine pluriel, aligné avec la page (`projects`, `experiences`).
- Les fichiers dans `features/<domain>/components/` ne répètent pas le préfixe du domaine : `project-card.component.tsx`, pas `projects-project-card.component.tsx`.
- Une page peut importer depuis `app/features/<domain>/`.
- Une feature métier ne doit pas importer depuis `app/pages/`.

---

## Conventions de nommage

| Type      | Pattern           | Exemple                             |
| --------- | ----------------- | ----------------------------------- |
| Composant | `*.component.tsx` | `button.component.tsx`              |
| Section   | `*.section.tsx`   | `welcome-hero.section.tsx`          |
| Page      | `*.page.tsx`      | `welcome.page.tsx`                  |
| Styles    | `*.css.ts`        | `button.css.ts`                     |
| Hook      | `*.hook.ts`       | `use-intersection-observer.hook.ts` |
| Types     | `*.types.ts`      | `use-projects.hook.types.ts`        |
| Données   | `*-data.ts`       | `projects-data.ts`                  |
| Test      | `*.test.tsx`      | `button.test.tsx`                   |

### Règles générales

- **kebab-case** dossiers et fichiers.
- **named export** — pas de `export default` sauf pour les pages (`*.page.tsx`).

### Règle `app/pages/<feature>/` : 1 fichier = 1 composant, préfixé par la feature

Dans `app/pages/`, chaque fichier = un seul composant. Le nom du fichier porte le préfixe complet de la feature, du parent, du grand-parent, etc.

```
welcome                          # feature
welcome-hero                     # section
welcome-hero-button              # composant dans la section
welcome-hero-button-icon         # sous-composant du composant
```

**Pattern** : `<feature>-<parent>-<component-name>.component.tsx`

Exemple concret :

```
pages/welcome/sections/welcome-hero/components/computer/
  welcome-hero-computer.component.tsx          ✓
  welcome-hero-computer.css.ts                 ✓
  components/
    character-grid/
      welcome-hero-computer-character-grid.component.tsx   ✓
      welcome-hero-computer-character-grid.css.ts          ✓
    square-grid/
      welcome-hero-computer-square-grid.component.tsx      ✓
      welcome-hero-computer-square-grid.css.ts             ✓
```

Tout fichier dans `app/pages/` qui ne respecte pas ce préfixe est hors architecture cible.

### Cas `app/components/` : composition, pas de préfixe

Dans `app/components/`, les composants sont rangés par dossier et n'ont pas de préfixe :

```
app/components/layouts/
  container/
    container.component.tsx       ✓
    container.css.ts              ✓
  feature-header/
    feature-header.component.tsx  ✓
    feature-header.css.ts         ✓
```

---

## Conventions TypeScript

- Interface des props : `export interface <Name>Props`.
- Types partagés : fichier `*.types.ts` dédié.
- Imports type-only : `import type { ... }`.
- Props = `interface` (pas `type`).
- Fonctions = `export function` (pas d'arrow).
- `React.memo` pour les composants visuels lourds.

---

## Composition d'une page

```
pages/welcome/
  page/welcome.page.tsx
  sections/
    welcome-hero/
      welcome-hero.section.tsx
      welcome-hero.css.ts
      components/
        background/
          welcome-hero-filter-background.component.tsx
          welcome-hero-filter-background.css.ts
        computer/
          welcome-hero-computer.component.tsx
          welcome-hero-computer.css.ts
          components/
            character-grid/
              welcome-hero-computer-character-grid.component.tsx
              welcome-hero-computer-character-grid.css.ts
            square-grid/
              welcome-hero-computer-square-grid.component.tsx
              welcome-hero-computer-square-grid.css.ts
      hooks/
        use-welcome-hero-content-animation.hook.ts
    welcome-projects/
      welcome-projects.section.tsx
      welcome-projects.css.ts
    welcome-experience/
      welcome-experience.section.tsx
      welcome-experience.css.ts
    welcome-skills/
      welcome-skills.section.tsx
      welcome-skills.css.ts
```

### Règles de composition

- Une **page** est composée exclusivement de **sections**.
- Une **section** peut avoir des sous-composants dans `components/`.
- Un sous-composant peut lui-même avoir des sous-composants (imbrication infinie).
- Hooks et données propres à une section restent dans son dossier.
- Une section importe depuis `app/components/`, `app/features/<domain>/` ou depuis ses propres sous-composants.
- Une section ne doit pas importer depuis les sections d'une autre page.
- Si un sous-composant est utilisé par 2+ pages, il monte dans `app/components/` ou `app/features/<domain>/` selon sa nature.

---

## Règles d'import

- `app/pages/<feature>/` peut importer depuis `app/components/`, `app/features/` et ses propres sous-dossiers.
- `app/features/<domain>/` peut importer depuis `app/components/` et ses propres sous-dossiers.
- `app/components/` ne doit pas importer depuis `app/pages/` ni `app/features/`.
- Import cross-page interdit : aucun import depuis `app/pages/<other-feature>/`.
- Import entre domaines métier interdit par défaut (`app/features/projects/` → `app/features/experiences/`). Extraire dans `app/components/` si c'est générique, ou demander une décision architecture si c'est réellement métier partagé.

---

## Règles de review

Cette architecture décrit la cible, pas l'état transitoire du code.

- Toute violation de cette architecture est bloquante en review.
- La conformité est évaluée sur tout le repo, pas seulement sur le diff.
- Ne pas accepter de nouveau code qui dépend d'un import cross-page, d'un mauvais dossier, ou d'un fichier mal nommé.
- Les templates de ce document utilisent les chemins cibles, même si le repo courant n'est pas encore migré.

---

## Template section

```tsx
// <feature>-<name>.section.tsx
import type { ReactNode } from "react";
import { Section } from "@/components/layouts/sections/section.component";
import { FeatureHeader, FeatureHeaderTitle } from "@/components/layouts/feature-header/feature-header.component";
import * as styles from "./<feature>-<name>.css";

interface <Feature><Name>SectionProps {
  children?: ReactNode;
}

export function <Feature><Name>Section({ children }: <Feature><Name>SectionProps) {
  return (
    <Section>
      <FeatureHeader variant="secondary">
        <FeatureHeaderTitle size="md">My Title</FeatureHeaderTitle>
      </FeatureHeader>
      {children}
    </Section>
  );
}
```

---

## Template sous-composant de section

```tsx
// <feature>-<parent>-<child>.component.tsx
interface <Feature><Parent><Child>Props {
  // ...
}

export function <Feature><Parent><Child>({}: <Feature><Parent><Child>Props) {
  return <div>{/* ... */}</div>;
}
```

---

## Template composant partagé (dans `app/components/`)

```tsx
// <name>.component.tsx
import * as styles from "./<name>.css";

interface <Name>Props {
  className?: string;
  children?: React.ReactNode;
}

export function <Name>({ className, children }: <Name>Props) {
  return <div className={className}>{children}</div>;
}
```

---

## Template styles

```ts
// <name>.css.ts
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const root = style({
  // vars.colors.*, vars.spacing.*, vars.fontSize.*, etc.
});
```

Pour les variantes : `recipe()` de `@vanilla-extract/recipes` (voir `button.css.ts`).

---

## Règles de style

Voir [`design.md`](./design.md) pour tokens, breakpoints, ombres, typographie.

Rappels :

- Toujours les tokens — pas de valeurs arbitraires.
- Mobile-first : breakpoints via `@styles/responsive.css`.
- Hover : `color-mix(in srgb, ${vars.colors.primary} 90%, transparent)`.
- Animations hors viewport : `useAnimationPriority`.

---

## Checklist création

1. [ ] Déterminer : page-local / layout / primitive / misc / feature métier
2. [ ] Usage unique → `pages/`, UI générique réutilisée → `app/components/`, métier réutilisé → `app/features/`
3. [ ] Dans `pages/` : préfixer le fichier du nom complet de la feature
4. [ ] Créer `*.component.tsx` (ou `*.section.tsx`) + `*.css.ts`
5. [ ] Définir l'interface des props
6. [ ] Named export (pas de default sauf page)
7. [ ] Tokens `vars.*` partout
8. [ ] Sous-composants → `components/` dans le même dossier
9. [ ] Hooks/data page-local → `pages/<feature>/hooks/` ou `pages/<feature>/data/`
10. [ ] Hooks/data métier partagé → `app/features/<domain>/hooks/` ou `app/features/<domain>/data/`
11. [ ] Vérifier pas de doublon dans `app/components/` ou `app/features/`
