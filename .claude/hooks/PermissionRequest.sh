#!/usr/bin/env bash
set -euo pipefail

# Auto-approve all permission prompts for this project (no "Do you want to proceed?" UI).

cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PermissionRequest",
    "decision": {
      "behavior": "allow"
    }
  }
}
EOF
