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

## gstack (REQUIRED — global install)

**Before doing ANY work, verify gstack is installed:**

```bash
test -d ~/.claude/skills/gstack/bin && echo "GSTACK_OK" || echo "GSTACK_MISSING"
```

If GSTACK_MISSING: STOP. Do not proceed. Tell the user:

> gstack is required for all AI-assisted work in this repo.
> Install it:
> ```bash
> git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
> cd ~/.claude/skills/gstack && ./setup --team
> ```
> Then restart your AI coding tool.

Do not skip skills, ignore gstack errors, or work around missing gstack.

Using gstack skills: After install, skills like /qa, /ship, /review, /investigate,
and /browse are available. Use /browse for all web browsing.
Use ~/.claude/skills/gstack/... for gstack file paths (the global path).

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore

**Full gstack skill catalog** (upstream [README](https://github.com/garrytan/gstack)): `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/sync-gbrain`, `/retro`, `/investigate`, `/document-release`, `/document-generate`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/pair-agent`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`, `/context-save`, `/context-restore`, `/open-gstack-browser`, `/make-pdf`, `/scrape`, `/skillify`, `/health`, `/landing-report`.
