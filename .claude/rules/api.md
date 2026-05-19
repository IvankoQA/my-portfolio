# API and Convex scoped rules

Applies when working in:
- `convex/**`
- `docs/sandbox.md` (sandbox backend contract: **Part B**, anchor `#part-b`)

Rules:
1. Add argument validators for Convex functions.
2. Prefer indexed and bounded queries.
3. Keep backend contract docs aligned with behavior changes.
4. Avoid changing unrelated frontend files in backend-only tasks.
5. If unsure about Convex APIs beyond this repo’s guidelines, use Context7 MCP (`resolve-library-id` for `Convex`, then `query-docs`) before guessing.
