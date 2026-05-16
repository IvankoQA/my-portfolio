#!/usr/bin/env bash
set -euo pipefail

# Claude Code PostToolUse: stdout must be valid JSON (e.g. {}).
# Звук только после Bash/Shell (см. matcher в .claude/settings.json), не после Read/Write и т.д.
# «Шумные» однострочники (tsc, lint, grep | head …) — без звука (shell-sound-policy.sh).

_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck disable=SC1091
source "$_REPO_ROOT/.cursor/hooks/_macos_ping.sh"
# shellcheck disable=SC1091
source "$_REPO_ROOT/.cursor/hooks/shell-sound-policy.sh"

json=$(cat || true)

summary="Команда агента завершена"
if command -v jq >/dev/null 2>&1; then
	summary=$(
		echo "$json" | jq -r '
			(.tool_name // .toolName // .name // .tool_use_id // empty)
			| if length > 0 then "Готово: " + . else "Команда агента завершена" end
		' 2>/dev/null || echo "Команда агента завершена"
	)
fi

cmd=$(hook_json_extract_shell_cmd "$json")
dur=$(hook_json_extract_duration_ms "$json")

if ! shell_sound_is_trivial "$cmd" "$dur"; then
	macos_ping "Терминал Cursor" "$summary"
fi

echo '{}'
