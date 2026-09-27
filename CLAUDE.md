# CLAUDE.md

@AGENTS.md

## Claude Code specifics

- **Hooks** (`.claude/settings.json`): every Edit/Write on a source file runs `oxfmt` then `oxlint` on that file; lint errors come back as hook feedback — fix them, don't bypass.
- **Design work** goes through the `impeccable` skill: it reads `PRODUCT.md` + `DESIGN.md` (+ `.impeccable/design.json`).
- **Browser checks**: `.claude/launch.json` starts the dev server on port 5175; use the chrome-devtools MCP tools for screenshots, console and Lighthouse.
- **Spec-kit**: `/speckit-*` skills manage `specs/`; the block below is rewritten by `speckit.agent-context.update` — don't edit it by hand.

<!-- SPECKIT START -->

No active spec-kit feature. Last completed: [specs/001-premium-polish](specs/001-premium-polish/spec.md).
<!-- SPECKIT END -->
