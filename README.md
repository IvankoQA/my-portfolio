# Ivan Kozenko — Portfolio

Personal portfolio site for a Senior AQA Engineer. Two main routes:
- **`/`** — CV, job-fit analyzer (local, no LLM), contact, EN/UK locale
- **`/sandbox`** — Vibe Coder Supply Co., an interactive QA playground: fake e-commerce storefront with 19 intentional planted bugs and a timed QA challenge

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Backend | Convex (queries, mutations, schema at `convex/`) |
| Styling | Tailwind CSS v4, next-themes, shadcn/ui |
| Lint / format | Biome via `scripts/run-biome.mjs` |
| Tests | Playwright (e2e + API) |

## Directory map

```
my-portfolio/
├── convex/              Convex backend: schema.ts, sandbox.ts, seed.ts
├── docs/                Detailed docs: sandbox API contract, spec, regression log
│   └── testing/         Planted-bug list, coverage matrix, test case catalog
├── my-portfolio-design/ Historical JSX prototypes — not in production build
├── public/              Static assets: CV PDF, icons
├── reports/html/        Playwright HTML report — served via /sandbox-test-report route
├── scripts/             run-biome.mjs — Biome CLI wrapper
├── src/
│   ├── app/             Next.js routes + route handlers
│   │   ├── sandbox/     /sandbox page + /sandbox/[slug] redirect
│   │   ├── sandbox-test-report/  Proxy route serving reports/html/ at runtime
│   │   └── uk/          /uk locale mirrors
│   ├── components/sandbox/vibe-store/  Main sandbox UI + auto-test report component
│   ├── hooks/           use-is-mobile, use-sandbox-session
│   ├── lib/             CV data, JD matcher, i18n strings, sandbox catalog + SB_BUGS
│   └── providers/       ConvexClientProvider
├── tests/               Playwright: e2e/, api/, fixtures/, pages/, flows/
├── .claude/             Claude Code: hooks, skills, rules, settings
├── AGENTS.md            Rules for AI agents (lint, Convex, MCP)
└── CLAUDE.md            Project brain for Claude Code
```

## Commands

### Development

```bash
npm run dev          # Next.js dev server at localhost:3000
npx convex dev       # Convex backend (required for auth, seeding, sandbox session)
npm run build        # Production build
```

Env: copy `env.example` to `.env.local` and set `NEXT_PUBLIC_CONVEX_URL`.

### Lint / format

```bash
pnpm run lint            # Biome check (same as biome:check)
pnpm run format          # Biome format --write
# If embedded IDE terminal reports OOM, call the script directly:
node ./scripts/run-biome.mjs check .
node ./scripts/run-biome.mjs check path/to/file.ts
```

### Tests

First-time setup — install Chromium:

```bash
pnpm exec playwright install chromium
```

| Command | What it runs |
|---------|-------------|
| `pnpm test` | All Playwright projects |
| `pnpm run test:all-except-planted` | All except `@sandbox-planted` cases |
| `pnpm run test:e2e` | E2E: chromium + iphone-15-pro + sandbox desktop + mobile |
| `pnpm run test:store` | Sandbox specs only (desktop + mobile) |
| `pnpm run test:e2e:sandbox` | Alias for `test:store` |
| `pnpm run test:e2e:mobile` | Mobile projects only |
| `pnpm run test:e2e:ci` | CI minimal: chromium + sandbox-store |
| `pnpm run test:e2e:ci:all` | CI full: all 4 e2e projects |
| `pnpm run test:store:full` | Sandbox UI + API routes |
| `pnpm run test:api` | API tests only (`tests/api/`) |
| `pnpm run test:smoke` | `@smoke` tag subset |

- Base URL: `http://localhost:3000` (override with `BASE_URL` env var)
- `webServer` in `playwright.config.ts` auto-starts `npm run dev`; reuses an existing server
- Trace written on failure (`retain-on-failure`); view with `pnpm exec playwright show-report reports/html`

## Intentional bugs

`/sandbox` contains **19 planted defects** (`vs-01`–`vs-19`) that are intentional and power the QA challenge.

| Resource | Path |
|----------|------|
| Canonical bug list | [`docs/testing/vibe-store-planted-bugs.md`](docs/testing/vibe-store-planted-bugs.md) |
| Source data | `SB_BUGS` in [`src/lib/sandbox/vibe-store-data.ts`](src/lib/sandbox/vibe-store-data.ts) |
| E2E assertions | `tests/e2e/sandbox/` — `@sandbox-planted` tests assert current **buggy** behavior |

**Policy**: do not fix a planted bug without simultaneously removing it from `SB_BUGS`, the bug-list doc, and the corresponding `@sandbox-planted` test.

The same 19 bugs are exercised on two Playwright projects: `sandbox-store` (desktop) and `sandbox-store-iphone-15-pro` (mobile).

## MCP profile (this project)

| Server | Status |
|--------|--------|
| `playwright` | Disabled (in `.claude/settings.local.json`) |
| `shadcn` | Disabled |
| `github` | Disabled |
| `chrome-devtools` | Available globally (`~/.cursor/mcp.json`) |
| Figma | **Not configured** — no active Figma MCP in repo or global profile |

## AI-agent notes

- Before editing Convex code: read `convex/_generated/ai/guidelines.md` first.
- Lint via `pnpm run lint` or `node ./scripts/run-biome.mjs check .`.
- Chrome DevTools MCP "browser already running" error: `pkill -f "user-data-dir=.*chrome-devtools-mcp/chrome-profile"` then retry.
- Detailed sandbox backend contract: [`docs/sandbox.md#part-b`](docs/sandbox.md#part-b).
- Detailed `src/` structure: [`docs/sandbox.md#part-a`](docs/sandbox.md#part-a).
- Do not change unrelated files when implementing a scoped task.
