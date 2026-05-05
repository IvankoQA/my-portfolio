#!/usr/bin/env bash
set -euo pipefail

mkdir -p .claude/state
snapshot=".claude/state/precompact-$(date '+%Y%m%d-%H%M%S').txt"

{
  echo "timestamp=$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo "cwd=$(pwd)"
  echo "git_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
} > "$snapshot"

echo "[PreCompact] Saved state to $snapshot"
