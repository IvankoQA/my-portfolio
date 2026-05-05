# Project Brain: my-portfolio

## Stack and architecture
- Frontend: Next.js App Router + React + TypeScript.
- Backend: Convex (`convex/`).
- UI/tooling: Tailwind CSS, Biome.
- Key contract docs live in `docs/sandbox.md` (sandbox API Part B, spec, regression).

## Core commands
- `npm run dev` - run local Next.js app.
- `npm run build` - production build validation.
- `pnpm run lint` (or `pnpm run biome:check`) - Biome checks via native CLI bridge [`scripts/run-biome.mjs`](scripts/run-biome.mjs).
- `npm run format` - Biome format fixes.

**Chrome DevTools MCP:** if tools report the browser profile already in use, close that automation Chrome first, then retry — see AGENTS.md (Verification).

## Repository conventions
- Keep backend contracts in sync with implementation when touching sandbox flows.
- Prefer small, focused edits over broad refactors.
- Do not change unrelated files while implementing a task.
- Keep docs updates close to code changes when behavior changes.

## Convex rules (high priority)
- This project uses [Convex](https://convex.dev) as its backend.
- When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first**.
- Convex rules in that file override default LLM assumptions.
- Always add validators for function args in Convex functions.
- Prefer indexed queries and bounded reads (`take`/pagination), not unbounded `collect`.

## Definition of done for code changes
- Feature/bug behavior is implemented end-to-end.
- `pnpm run lint` passes for touched files (or documented blocker; see AGENTS.md if an embedded terminal reports a false OOM).
- Relevant docs are updated when external behavior or contract changes.
- Changes are scoped, readable, and avoid speculative abstractions.

## Claude runtime layout
- Keep shared Claude Code runtime config in `.claude/`.
- Deterministic hooks live in `.claude/hooks/` and should stay lightweight/safe.
- Reusable task instructions live in `.claude/skills/`.
- Subagent role prompts live in `.claude/agents/`.
- Slash command prompts live in `.claude/commands/`.
- Path-scoped rule files live in `.claude/rules/`.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
