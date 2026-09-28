# Component Architecture

## Global Tree

```
app/
  components/          # Shared components (reusable across all pages)
  features/<domain>/   # Shared business logic (UI + data + hooks + types reused)
  pages/<feature>/     # Page module
    page/              # Route file (<feature>.page.tsx)
    sections/          # Page-specific sections
    components/        # Page-specific sub-components
    hooks/             # Page-specific hooks
    data/              # Page static data
    assets/            # Page assets
```

---

## `app/components/` Categories

| Directory     | Role                                                 | Examples                                                            |
| ------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| `primitives/` | Reusable UI atoms, no business logic                 | `button/`, `tag/`, `slider/`, `terminal-buttons/`                   |
| `layouts/`    | Everything that structures the page                  | `container/`, `content-section/`, `feature-header/`, `footer/`      |
| `misc/`       | Complex but reusable components (decorative, visual) | `computer/`, `server-unit/`, `mesh-background/`, `canvas-renderer/` |

### Rules

- **`feature-header/`** is a layout → in `layouts/`, not at root.
- Single page usage → stays in `pages/<feature>/components/` or `pages/<feature>/sections/<section>/components/`.
- Generic UI used by 2+ pages → moves up to `app/components/`.
- UI/data/hooks/types business logic used by 2+ pages → moves up to `app/features/<domain>/`.

---

## `app/features/` Categories

`app/features/` contains business code shared between multiple pages. Domain folders use plural page names.

```
app/features/
  projects/
    components/
      project-monitor/
        project-monitor.component.tsx
        project-monitor.css.ts
    data/
      projects-data.ts
      projects-data.types.ts
    hooks/
      use-session-uptime.hook.ts
  experiences/
    components/
      experience-log/
        experience-log.component.tsx
        experience-log.css.ts
    data/
      experiences-data.ts
      experiences-data.types.ts
  site/
    data/
      site.ts                  # SITE_URL
      contact-links.data.ts
      site-status.data.ts      # what the build says about itself (footer status strip)
```

### Rules

- Plural domain name, aligned with the page (`projects`, `experiences`).
- Files in `features/<domain>/components/` do not repeat the domain prefix: `project-monitor.component.tsx`, not `projects-project-monitor.component.tsx`.
- A page may import from `app/features/<domain>/`.
- A business feature must not import from `app/pages/`.

---

## Naming Conventions

| Type      | Pattern           | Example                             |
| --------- | ----------------- | ----------------------------------- |
| Component | `*.component.tsx` | `button.component.tsx`              |
| Section   | `*.section.tsx`   | `welcome-hero.section.tsx`          |
| Page      | `*.page.tsx`      | `welcome.page.tsx`                  |
| Styles    | `*.css.ts`        | `button.css.ts`                     |
| Hook      | `*.hook.ts`       | `use-intersection-observer.hook.ts` |
| Types     | `*.types.ts`      | `projects-data.types.ts`            |
| Data      | `*-data.ts`       | `projects-data.ts`                  |
| Test      | `*.test.tsx`      | `button.test.tsx`                   |

### General Rules

- **kebab-case** for folders and files.
- **named export** — no `export default` except for pages (`*.page.tsx`).

### `app/pages/<feature>/` Rule: 1 file = 1 component, prefixed by feature

In `app/pages/`, each file = one component. The filename carries the full feature prefix, parent, grandparent, etc.

```
welcome                          # feature
welcome-hero                     # section
welcome-hero-button              # component in section
welcome-hero-button-icon         # sub-component of component
```

**Pattern**: `<feature>-<parent>-<component-name>.component.tsx`

Concrete example:

```
pages/welcome/sections/welcome-hero/components/contact-hover-card/
  welcome-hero-contact-hover-card.component.tsx          ✓
  welcome-hero-contact-hover-card.css.ts                 ✓
  components/
    beam/
      welcome-hero-contact-hover-card-beam.component.tsx ✓
      welcome-hero-contact-hover-card-beam.css.ts        ✓
```

Any file in `app/pages/` that does not respect this prefix is outside the target architecture.

### `app/components/` Case: composition, no prefix

In `app/components/`, components are organized by folder and have no prefix:

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

## TypeScript Conventions

- Props interface: `export interface <Name>Props`.
- Shared types: dedicated `*.types.ts` file.
- Type-only imports: `import type { ... }`.
- Props = `interface` (not `type`).
- Functions = `export function` (no arrow).
- `React.memo` for heavy visual components.

---

## Page Composition

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
            splash/
              welcome-hero-computer-splash.component.tsx
        scroll-morph/
          welcome-hero-scroll-morph.component.tsx
          welcome-hero-scroll-morph.css.ts
      hooks/
        use-welcome-hero-spec.hook.ts
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

### Composition Rules

- A **page** is composed exclusively of **sections**.
- A **section** may have sub-components in `components/`.
- A sub-component may itself have sub-components (infinite nesting).
- Hooks and data specific to a section stay in its folder.
- A section imports from `app/components/`, `app/features/<domain>/` or from its own sub-components.
- A section must not import from another page's sections.
- If a sub-component is used by 2+ pages, it moves up to `app/components/` or `app/features/<domain>/` depending on its nature.

---

## Import Rules

Enforced by oxlint (`no-restricted-imports` overrides in `.oxlintrc.json`) for `app/components/` and `app/features/`; the other rules are checked in review.

- `app/pages/<feature>/` may import from `app/components/`, `app/features/` and its own sub-folders.
- `app/features/<domain>/` may import from `app/components/` and its own sub-folders.
- `app/components/` must not import from `app/pages/` or `app/features/`.
- Cross-page import forbidden: no import from `app/pages/<other-feature>/`.
- Cross-business-domain import forbidden by default (`app/features/projects/` → `app/features/experiences/`). Extract into `app/components/` if generic, or request an architecture decision if truly shared business logic.
- **Decided exception:** `app/features/labs/experiments/` may import components (and their `?raw` sources) from any domain — showcasing them is the purpose of the Labs.
- **Decided exception:** `app/features/site/` holds the site's own identity (URL, contact links, build status); any page or domain may import it.
- Shared components never import business data: pages pass it in as props (e.g. `<Footer links={contactLinks} />`).

---

## Review Rules

This architecture describes the target, not the transient state of the code.

- Any violation of this architecture is blocking in review.
- Compliance is assessed on the entire repo, not just the diff.
- Do not accept new code that depends on a cross-page import, a wrong folder, or a misnamed file.
- Templates in this document use target paths, even if the current repo hasn't been migrated yet.

---

## Section Template

Sections of the home page wrap `ContentSection`, which owns the container, the header (eyebrow index, title, description), the scroll reveal and the animation gating.

```tsx
// <feature>-<name>.section.tsx
import { ContentSection } from "@/components/layouts/content-section/content-section.component";
import * as styles from "./<feature>-<name>.css";

export function <Feature><Name>Section() {
  return (
    <ContentSection
      id="<name>"
      index={1}
      title="My Title"
      description="One-line description."
      variant="secondary"
    >
      {({ shouldAnimate }) => <div className={styles.grid}>{/* ... */}</div>}
    </ContentSection>
  );
}
```

---

## Section Sub-Component Template

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

## Shared Component Template (in `app/components/`)

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

## Styles Template

```ts
// <name>.css.ts
import { vars } from "@styles/theme.css";
import { style } from "@vanilla-extract/css";

export const root = style({
  // vars.colors.*, vars.spacing.*, vars.fontSize.*, etc.
});
```

For variants: `recipe()` from `@vanilla-extract/recipes` (see `button.css.ts`).

---

## Style Rules

See [`DESIGN.md`](../DESIGN.md) for tokens, breakpoints, shadows, typography.

Reminders:

- Always tokens — no arbitrary values.
- Mobile-first: breakpoints via `@styles/responsive.css`.
- Hover: `color-mix(in srgb, ${vars.colors.primary} 90%, transparent)`.
- Animations out of viewport: `useAnimationPriority`.

---

## Creation Checklist

1. [ ] Determine: page-local / layout / primitive / misc / business feature
2. [ ] Single use → `pages/`, reusable generic UI → `app/components/`, reusable business → `app/features/`
3. [ ] In `pages/`: prefix file with full feature name
4. [ ] Create `*.component.tsx` (or `*.section.tsx`) + `*.css.ts`
5. [ ] Define props interface
6. [ ] Named export (no default except page)
7. [ ] `vars.*` tokens everywhere
8. [ ] Sub-components → `components/` in same folder
9. [ ] Page-local hooks/data → `pages/<feature>/hooks/` or `pages/<feature>/data/`
10. [ ] Shared business hooks/data → `app/features/<domain>/hooks/` or `app/features/<domain>/data/`
11. [ ] Verify no duplicate in `app/components/` or `app/features/`
