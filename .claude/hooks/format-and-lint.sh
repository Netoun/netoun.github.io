#!/usr/bin/env bash
# PostToolUse hook (Edit|MultiEdit|Write): format the touched file with oxfmt,
# then lint it with oxlint. Lint errors exit 2 so Claude receives them as feedback.
set -uo pipefail

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
file="$(jq -r '.tool_input.file_path // empty')"
[[ -z "$file" || ! -f "$file" ]] && exit 0

# Only files inside this repo, outside generated / vendored trees.
rel="${file#"$root"/}"
[[ "$rel" == "$file" ]] && exit 0
case "$rel" in
  node_modules/* | build/* | .react-router/* | public/*) exit 0 ;;
esac

bin="$root/node_modules/.bin"

case "$rel" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.json | *.jsonc | *.md | *.css)
    [[ -x "$bin/oxfmt" ]] && "$bin/oxfmt" --write "$file" >/dev/null 2>&1
    ;;
esac

case "$rel" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs)
    [[ -x "$bin/oxlint" ]] || exit 0
    # no-unused-vars is skipped here: multi-step edits (import first, usage next) would
    # trip it transiently. `bun run check` still enforces it.
    if ! out="$(cd "$root" && "$bin/oxlint" --quiet -A no-unused-vars "$rel" 2>&1)"; then
      echo "oxlint errors in $rel:" >&2
      echo "$out" >&2
      exit 2
    fi
    ;;
esac
exit 0
