# Agent Runtime Rules

## Scope discipline
- Solve only the requested task; avoid opportunistic rewrites.
- Preserve existing architecture and naming patterns unless asked to change them.
- If requirements are ambiguous, ask a targeted clarifying question before large edits.

## Editing workflow
- Read relevant files first, then implement directly.
- Keep diffs compact and easy to review.
- Do not revert user-authored changes that are outside task scope.
- After substantive edits, run lint checks for touched files.

## Convex execution rules
- Before any Convex code change, read `convex/_generated/ai/guidelines.md`.
- Use `query`/`mutation`/`action` and `internal*` APIs correctly.
- Include argument validators for all Convex function registrations.
- Favor indexed access patterns and bounded result sets.

## Verification and reporting
- Validate behavior with the smallest reliable check (lint/test/run path).
- **Biome:** use `pnpm run lint` or `pnpm run biome:check` (same command). The repo runs the native CLI via [`scripts/run-biome.mjs`](scripts/run-biome.mjs) to avoid spurious OOM on some hosts. If an embedded tool still reports OOM for `pnpm run lint`, run `pnpm run biome:check` from a normal terminal or call `node ./scripts/run-biome.mjs check .` directly.
- **Chrome DevTools MCP (`user-chrome-devtools`):** if any tool returns *«The browser is already running … chrome-devtools-mcp/chrome-profile»* (or similar), **do not** retry blindly. First terminate only the automation Chrome that uses that profile, wait a second, then call the MCP tool again (e.g. `new_page` / `navigate_page` / `take_snapshot`). Safe pattern: `pkill -f "user-data-dir=.*chrome-devtools-mcp/chrome-profile"` — this targets the MCP isolation profile, not arbitrary user Chrome windows.
- Report what changed, why it changed, and any residual risk or follow-up.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
