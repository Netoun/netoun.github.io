# CLAUDE.md

@AGENTS.md

## Claude Code specifics

- **Hooks** (`.claude/settings.json`): every Edit/Write on a source file runs `oxfmt` then `oxlint` on that file; lint errors come back as hook feedback — fix them, don't bypass.
- **Design work** goes through the `impeccable` skill: it reads `PRODUCT.md` + `DESIGN.md` (+ `.impeccable/design.json`).
- **Browser checks**: `.claude/launch.json` starts the dev server on port 5175; use the chrome-devtools MCP tools for screenshots, console and Lighthouse.
