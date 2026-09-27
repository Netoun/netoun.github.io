---
name: homepage
description: Resume the homepage improvement plan (docs/homepage-plan.md) on one section and run the Impeccable workflow on it. Usage — /homepage <hero|global|nav|projects|experience|skills|footer|closing>. Temporary scaffolding, deleted once the plan is complete.
argument-hint: "<hero|global|nav|projects|experience|skills|footer|closing>"
disable-model-invocation: true
---

# Homepage plan — one section per session

Requested section: `$ARGUMENTS`

## 1. Load the plan

- Read `docs/homepage-plan.md` in full. It is the durable backlog: decisions already taken, content Nicolas decides, per-section checklists with evidence (`file:line`).
- Map the argument to a plan section:

  | Argument     | Plan section     | Impeccable `--target`                                                                  |
  | ------------ | ---------------- | -------------------------------------------------------------------------------------- |
  | `hero`       | 1 · Hero         | `app/pages/welcome/sections/welcome-hero/welcome-hero.section.tsx`                     |
  | `global`     | 2 · Global       | `app/root.tsx`                                                                         |
  | `nav`        | 3 · Sections nav | `app/pages/welcome/components/welcome-sections-nav/welcome-sections-nav.component.tsx` |
  | `projects`   | 4 · Projects     | `app/pages/welcome/sections/welcome-projects/welcome-projects.section.tsx`             |
  | `experience` | 5 · Experience   | `app/pages/welcome/sections/welcome-experience/welcome-experience.section.tsx`         |
  | `skills`     | 6 · Skills       | `app/pages/welcome/sections/welcome-skills/welcome-skills.section.tsx`                 |
  | `footer`     | 7 · Footer       | `app/components/layouts/footer/footer.component.tsx`                                   |
  | `closing`    | 8 · Closing      | `app/pages/welcome/page/welcome.page.tsx`                                              |

- Empty or unknown argument: list every section with its ticked/total count and ask which one with AskUserQuestion.
- One section per session. Do not drift into other sections; note cross-section findings in the plan instead.
- The evidence dates from 2026-09-27: re-verify each `file:line` before editing.

## 2. Prerequisites

- Section 0 unticked (no root `DESIGN.md`): do it first — `/impeccable document`, then delete `docs/design.md` and update its links in `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`. Nicolas approved this on 2026-09-27.
- `closing`: sections 1–7 must be fully ticked; otherwise list what is left and ask how to proceed.

## 3. Run the Impeccable workflow

- Invoke the `impeccable` skill and run its Setup once with the `--target` from the table.
- Execute the section's unticked items in the listed order. Each item names an Impeccable command: load that command's reference and follow it, scoped to the files and brief written in the item. Read `craft-floor.md` before the first UI edit, as the skill requires.
- Anything listed under "Content Nicolas decides" is never invented. When an item needs it, ask with AskUserQuestion (concrete options drawn from existing data), then record the answer in the plan and tick its box.
- Keep the invariants listed under "Decisions taken".
- Project rules still apply (AGENTS.md): Vanilla Extract only, React Aria primitives, reduced motion honoured, prerender-safe rendering, no new runtime dependency without asking, no commit unless asked.

## 4. Verify — one batched pass, fix everything it shows, at most one confirmation pass

- `bun run check`.
- Production build + preview (commands in the plan). Desktop 1280 / 1440 / 1920, mobile 390 portrait + landscape, keyboard, no-JS (`build/client/index.html`), reduced motion verified in code. Browser: chrome-devtools MCP in your own tab.
- Detector: browser overlay pass on the build only — the source scan cannot read Vanilla Extract.
- Stop every server you started.

## 5. Record progress

- Tick the completed boxes in `docs/homepage-plan.md`. Under the section, add a dated `Done (YYYY-MM-DD)` line with the measurements (e.g. Lighthouse mobile before/after, tilt round-trip failures) and anything deferred, with the reason.
- Finish with: files changed, what was verified, what was not, and the next section to run (`/homepage <next>`).

## 6. When the plan is complete

Once `closing` is ticked and the final critique/audit scores are recorded, Nicolas wants this scaffolding removed (asked 2026-09-27). Confirm once, then delete `.claude/skills/homepage/` and `docs/homepage-plan.md`, and remove the matching memory entries.
