#!/usr/bin/env bash
set -euo pipefail

echo "[SessionStart] Loading project context..."

if [ -f "CLAUDE.md" ]; then
  echo "[SessionStart] Found CLAUDE.md"
fi

if [ -f ".mcp.json" ]; then
  echo "[SessionStart] Found .mcp.json"
fi
