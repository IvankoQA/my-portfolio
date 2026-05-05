# .claude setup for this project

This folder contains Claude Code runtime configuration used by the repository.

Mental model:
- `CLAUDE.md`: advisory project rules and conventions.
- `.claude/hooks/`: deterministic shell hooks.
- `.claude/skills/`: task-specific reusable instructions.
- `.claude/agents/`: subagent role prompts.
- `.claude/commands/`: slash command prompts.
- `.claude/rules/`: path-scoped rule files.
- `.mcp.json`: MCP server definitions at project root.

Recommended local-only files (ignored by git):
- `CLAUDE.local.md`
- `.claude/settings.local.json`
