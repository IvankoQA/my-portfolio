# Sandbox contract sync

Use this skill when a task changes sandbox backend behavior in `convex/` or sandbox UI/API usage in `src/components/sandbox/` and `src/app/sandbox/`.

## Goal
Keep implementation and docs in sync.

## Checklist
1. Read `docs/sandbox.md` **Part B** (`#part-b` — Sandbox backend contract) before edits.
2. If changing Convex functions, read `convex/_generated/ai/guidelines.md` first.
3. Update implementation.
4. Update `docs/sandbox.md` Part B when API, payloads, or behavior changes.
5. Run lint on touched files and report residual risks.
