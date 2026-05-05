# Project and sandbox documentation

Single reference file: sandbox backend contract, master specification, manual regression suite, regression findings, and run report. Update the relevant sections here when sandbox API or public behavior changes.

## Contents

1. [Part A: Project overview](#part-a)
2. [Part B: Sandbox backend contract](#part-b)
3. [Part C: Sandbox master specification](#part-c)
4. [Part D: Manual regression suite](#part-d)
5. [Part E: Regression findings](#part-e)
6. [Part F: Regression run report](#part-f)

---

<a id="part-a"></a>

## Part A: Project overview

For stack, commands, and top-level directory map see the root [README.md](../README.md). This section covers the detailed `src/` file structure.

### A.1. `src/app/` — Next.js App Router routes

| Path | Purpose |
|------|---------|
| `layout.tsx` | Root layout: fonts (Inter Tight, JetBrains Mono), `ThemeProvider`, `ConvexClientProvider`, `AppInit`, `Header`, metadata. |
| `globals.css` | Global styles: light/dark theme tokens (`--bg`, `--ink`, `--accent-color`), body/scrollbar base styles. |
| `page.tsx` | Home page (EN default): hero, terminal block, wins, experience, tech stack, job-fit (`JobFitChecker`), contacts. Anchors: `#experience`, `#stack`, `#fit`, `#contact`. |
| `Header.tsx` | Site header: logo, `#fit` / `#contact` links, EN/UK toggle, sandbox link, theme toggle. |
| `sandbox/page.tsx` | `/sandbox` route — vibe store shell. |
| `sandbox/[slug]/page.tsx` | `/sandbox/[slug]` — client redirect to `/sandbox` (locale-aware). |
| `sandbox-test-report/[...path]/route.ts` | Proxy serving `reports/html/` at runtime (strips run timestamps). |
| `sandbox-test-report/open-trace/route.ts` | Redirect to canonical trace viewer URL. |
| `uk/page.tsx` | `/uk` — home page in Ukrainian locale. |
| `uk/sandbox/page.tsx` | Re-export of sandbox page for `/uk/sandbox`. |
| `uk/sandbox/[slug]/page.tsx` | Re-export of slug redirect for `/uk/sandbox/[slug]`. |
| `api/jd-match/route.ts` | API route for job-fit analysis. |

### A.2. `src/components/`

| Path | Purpose |
|------|---------|
| `theme-provider.tsx` | `next-themes` wrapper for `data-theme`. |
| `app-init.tsx` | On mount, calls Convex `seedDefaults` and `seedSandboxData` (idempotent demo data seeding). |
| `sandbox/vibe-store/vibe-sandbox-store.tsx` | Main Vibe Coder Supply Co. UI: catalog, filters, cart, chat, challenge, auth, etc. |
| `sandbox/vibe-store/vibe-sandbox-ui-bits.tsx` | Small reusable sandbox UI fragments. |
| `sandbox/vibe-store/vibe-sandbox-auto-test.tsx` | Auto-test report view (renders real Playwright HTML report via iframe). |

### A.3. `src/lib/`

| Path | Purpose |
|------|---------|
| `cv-data.ts` | Structured CV: name, roles, experience, skills (aliases + matcher weights), `sampleJD`. |
| `jd-matcher.ts` | Local JD analysis: `analyzeJD`, `rawScore`, bonuses, `JdResult`. |
| `i18n/strings.ts` | EN/UK strings for home and job-fit (`useT`, keys `fit.*`, `nav.*`, …). |
| `i18n/locale.ts` | Locale parsing from pathname, `localizePath` for links. |
| `i18n/vibe-sandbox-strings.ts` | Sandbox UI strings (EN/UK). |
| `sandbox/vibe-store-data.ts` | Product catalog, categories, `SB_BUGS` planted defects, `SB_BUG_ID_SET`. |
| `sandbox/vibe-product-images.ts` | Unsplash URL pool (hash of product `id` → stable image URL). |
| `sandbox/vibe-sandbox-cart-storage.ts` | Cart persistence in `localStorage`. |
| `sandbox/vibe-auto-tests.ts` | `VIBE_AUTO_TEST_RUN` constant shown in auto-test report terminal header. |

### A.4. `src/hooks/` and `src/providers/`

| File | Purpose |
|------|---------|
| `hooks/use-is-mobile.ts` | Mobile breakpoint detection for responsive layout. |
| `hooks/use-sandbox-session.ts` | Sandbox session key management (localStorage ↔ Convex). |
| `providers/convex-provider.tsx` | `ConvexReactClient` + `ConvexProvider`; requires `NEXT_PUBLIC_CONVEX_URL`. |

### A.5. Data flow (simplified)

```
Home + Job-fit:  page.tsx → cv-data + jd-matcher (client-only, no network)
Sandbox UI:      vibe-sandbox-store → Convex mutations/queries (auth, session)
                 vibe-sandbox-store → SB_PRODUCTS + SB_BUGS (client-only, no network)
Seeding:         AppInit (on first mount) → Convex seedDefaults / seedSandboxData
```

### A.6. Documentation maintenance

When sandbox public behavior or API changes, update [Part B](#part-b) and the regression sections ([Part D](#part-d)–[Part F](#part-f)) as appropriate.

---

<a id="part-b"></a>

## Part B: Sandbox backend contract

### UI surface (`/sandbox`)

The `/sandbox` and `/uk/sandbox` routes render **Vibe Coder Supply Co.** — a QA storefront with a **client-only** catalog (44 products), local cart, drawers, contact chat, and optional **QA challenge** (15:00 timer, area-based defect hints, planted defects from `SB_BUGS` in [`docs/testing/vibe-store-planted-bugs.md`](testing/vibe-store-planted-bugs.md), results modal, simulated automated test report). Theme toggling uses the app-wide `next-themes` provider (`data-theme` on `<html>`).

**Auth** on this page uses Convex: a browser `sandbox_session_key` in `localStorage` becomes `sessionKey`; `sandbox.initSession` ensures a `sandbox_sessions` row, then `registerUser` / `loginUser` / `logoutUser` and `getSessionAuthState` persist demo users in `sandbox_users` and session auth fields. Catalog, cart, and chat remain local to the page.

### Convex functions (legacy store API)

The following were used by the previous Convex-backed sandbox UI. They are still defined in `convex/sandbox.ts` unless removed in a later change.

#### Session & view

- `sandbox.initSession({ sessionKey })`
- `sandbox.getProductView({ sessionKey })`

#### Registration

- `sandbox.registerUser({ sessionKey, name, email, password, role })`
- `sandbox.loginUser({ sessionKey, email, password })`
- `sandbox.logoutUser({ sessionKey })`
- `sandbox.getSessionAuthState({ sessionKey })`
- `sandbox.listUsers({ sessionKey, limit, search? })`

`role` values:

- `qa`
- `developer`
- `manager`

Validation errors:

- `NAME_REQUIRED`
- `EMAIL_INVALID`
- `PASSWORD_TOO_SHORT`
- `EMAIL_ALREADY_EXISTS`
- `EMAIL_RESERVED`
- `LOGIN_FIELDS_REQUIRED`
- `LOGIN_INVALID_CREDENTIALS`

#### Real-time feed

- `sandbox.addRealtimeMessage({ sessionKey, author, text })`
- `sandbox.editRealtimeMessage({ sessionKey, messageId, text })`
- `sandbox.deleteRealtimeMessage({ sessionKey, messageId })`
- `sandbox.reactToRealtimeMessage({ sessionKey, messageId, emoji })`
- `sandbox.listRealtimeMessages({ sessionKey, limit, search? })`
- `sandbox.listActivityFeed({ sessionKey, limit })`

Feed event types:

- `user_registered`
- `chat_message`

#### Catalog + Cart

- `sandbox.ensureCatalog({ sessionKey })`
- `sandbox.listCatalogProducts({ locale })` — `locale`: `"en"` | `"uk"` | `"ru"`.
- `sandbox.addCartItem({ sessionKey, sku, qty })`
- `sandbox.updateCartItemQty({ sessionKey, sku, qty })`
- `sandbox.removeCartItem({ sessionKey, sku })`
- `sandbox.getCartState({ sessionKey, promoCode?, locale? })`

Promocodes (seeded in Convex catalog flow): `SAVE10`, `QA20`.

Catalog size when seeded via Convex: ~200 procedural products.

### Contract notes

- `getCartState` returns full totals breakdown: `subtotal`, `itemDiscount`, `campaignDiscount`, `promoDiscount`, `total`.

---

<a id="part-c"></a>

## Part C: Sandbox Master Specification (Canonical)

This file section is the single source of truth for the sandbox rebuild narrative. It replaces conflicting requirements from older standalone sandbox docs.

Target project: Next.js + TypeScript + Convex.
Primary route: `/sandbox`.

**Current UI (implemented):** `/sandbox` is the **Vibe Coder Supply Co.** client-only storefront from `my-portfolio-design/` (filters, 44-item catalog, cart/account drawers, chat widget, in-store **QA challenge** with timer and **area-based hint panel**; planted defects live in `src/lib/sandbox/vibe-store-data.ts` as `SB_BUGS` and may be empty while bugs are redistributed). Results modal and simulated auto-test report remain. It does **not** mount the older “5 challenge tabs” wizard/cascading/realtime/heavy scenarios on this route. Manual steps for this surface live in [Part D](#part-d).

### C.1) Product Direction

Build a challenge-style QA playground:

- portfolio app with two primary routes in header: `/`, `/sandbox`;
- one interactive sandbox page; the shipped experience is the **Vibe store + challenge** above (historical spec also described **5 challenge tabs**);
- time-boxed challenge: **find bugs in 15 minutes**;
- user can finish early with **"Finish challenge"** button;
- result modal summarizes findings and offers **`Run demo tests`**;
- demo tests quickly reveal all known bugs and explain each one.

The page should feel like a realistic QA mission, not a simple form demo.

### C.2) Global App Information Architecture

#### C.2.1 Header Navigation (all pages)

Header is visible on all main routes and includes:

- `/` (Main / CV + Links)
- `/sandbox` (QA challenge)

#### C.2.2 Main Page `/`

Main page combines CV and links blocks and must include:

- `Connect` block (YouTube, LinkedIn, TikTok via the social links dataset);
- `Side Projects` block (current side project with teammate plus placeholder-ready block for future project details);
- clear CV presentation;
- action to copy CV content (or key profile summary) quickly;
- CTA button linking to sandbox with message like:
  - `Try yourself as QA: find all bugs in 15 minutes`.

### C.3) Sandbox Core User Flow

1. User opens `/sandbox` and sees challenge intro.
2. User clicks `Start challenge`.
3. Challenge session starts with timer `15:00`.
4. User explores 5 tabs, fills fields, triggers bugs, and marks findings.
5. Challenge ends by:
   - timer reaches 0, or
   - user clicks `Finish challenge` and confirms.
6. Result modal opens with manual score and CTA `Run demo tests`.
7. Demo tests run for ~5 seconds and show complete bug report.
8. User can inspect found bugs (UI + API categories) and retry challenge.

### C.4) Required UI Blocks

#### C.4.1 Header / Control Bar

- Challenge title: `Find all bugs in 15 minutes`.
- Visible countdown timer.
- Buttons:
  - `Start challenge` (before start),
  - `Finish challenge` (during active run),
  - `Run demo tests` (in result state/modal),
  - `Restart`.

#### C.4.2 Five Challenge Tabs

Must include exactly five challenge tabs with distinct failure modes:

1. `Wizard`
2. `Cascading Inputs`
3. `Realtime Chat`
4. `Race Condition`
5. `Heavy Endpoint / Data Grid`

Each tab contains multiple interactive fields and at least 2 intentional bugs.

#### C.4.3 Result Modal

Shown on timeout or manual finish.

Contains:

- completion type: `timeout` or `finished early`;
- time spent and time left;
- manual findings count (`X / total`);
- button `Run demo tests`;
- after demo run: automatic findings list with bug cards.

### C.5) Challenge and Scoring Rules

- One session = one timed run.
- Session statuses:
  - `idle`
  - `active`
  - `completed_timeout`
  - `completed_early`
  - `reviewing_demo_tests`
- Manual score is based on bugs user marked as found.
- Demo score is based on automated checks.
- Final view must clearly show manual vs automated gap.

Suggested output:

- `You found 4 of 12 bugs manually.`
- `Demo tests found 12 of 12 bugs in 4.8s.`

### C.6) Bug Content Model

Every bug definition must include:

- `bugId` (stable string),
- `title`,
- `description`,
- `tabKey`,
- `category` (`ui`, `api`, `realtime`, `state`, `performance`),
- `severity` (`low`, `medium`, `high`, `critical`),
- `reproHint`,
- `expectedBehavior`,
- `actualBehavior`,
- optional `apiEndpoint`.

Single bug catalog should power:

- tab hints / manual checklist,
- result modal details,
- demo tests output.

### C.7) Convex Backend Requirements

#### Mandatory precondition

Before any Convex edits, read: `convex/_generated/ai/guidelines.md`.

#### Data model (target)

Retain useful existing tables where possible, but introduce challenge-first entities:

- `sandbox_sessions`
  - `sessionKey`, `status`, `startedAt`, `endedAt`, `durationSec`, `foundBugIds`, `activeTab`
- `sandbox_bug_catalog`
  - canonical bug definitions
- `sandbox_demo_test_runs`
  - run metadata and summarized results
- `sandbox_demo_test_results`
  - per bug check outcomes

Keep existing scenario tables (`wizard`, `inventory`, `chat`, etc.) if already functional.

#### Function rules

- Every Convex registration must have argument validators.
- Use indexed and bounded reads (`withIndex`, `take`, pagination).
- No unbounded `collect()` for large datasets.
- Use explicit error codes (`SESSION_NOT_FOUND`, `INVALID_SESSION_STATE`, `BUG_NOT_FOUND`).

### C.8) Demo Tests Requirements

- Trigger from result modal.
- Runtime target: 3-6 seconds.
- Deterministic output for same preset.
- Return structure:
  - `runId`
  - `durationMs`
  - `totalChecks`
  - `passed`
  - `failed`
  - `results[]` with `bugId`, `status`, `message`.

Demo tests may be simulated, but output must map to real bug catalog entries.

### C.9) Frontend Architecture

Expected structure:

- `src/app/sandbox/page.tsx` (single challenge page container)
- `src/components/sandbox/ChallengeTopBar.tsx`
- `src/components/sandbox/ChallengeTabs.tsx`
- `src/components/sandbox/ChallengeTimer.tsx`
- `src/components/sandbox/ChallengeResultModal.tsx`
- `src/components/sandbox/tabs/*` (tab implementations)
- `src/lib/sandbox/types.ts`
- `src/lib/sandbox/constants.ts`
- `src/lib/sandbox/bugCatalog.ts`

Keep components focused and test-friendly.

### C.10) Testability Requirements

- Stable selectors on all key controls:
  - `sandbox-challenge-start`
  - `sandbox-challenge-finish`
  - `sandbox-challenge-run-demo-tests`
  - `sandbox-tab-<key>`
  - `sandbox-bug-<bugId>`
- deterministic reset to known preset;
- no hidden random delays unless marked as chaos mode;
- expose debug snapshot in `window.__sandbox`:
  - session status,
  - timer state,
  - active tab,
  - manual found bug ids,
  - last demo run id.

### C.11) Implementation Plan (Strict Order)

1. Consolidate schema and backend contract for challenge sessions + bug catalog.
2. Align global shell with header routes (`/`, `/sandbox`) and verify navigation.
3. Build single-page sandbox challenge shell with top bar, timer, and five challenge tabs.
4. Wire manual bug marking and persistent session progress.
5. Add `Finish challenge` early-exit flow and timeout flow.
6. Build result modal (manual stats first).
7. Implement demo tests run + detailed results view.
8. Add stable test IDs and debug surface.
9. Run lint and update [Part B](#part-b) in this file when APIs change.

### C.12) Acceptance Criteria

- Header contains working navigation to `/` and `/sandbox`.
- `/` presents CV plus links blocks (Connect + Side Projects), supports copy action, and has CTA to sandbox challenge.
- `/sandbox` is a single interactive challenge page with 5 challenge tabs.
- Timer starts at 15 minutes and ends session correctly.
- `Finish challenge` ends active session immediately after confirmation.
- Result modal appears for both timeout and early finish.
- `Run demo tests` produces deterministic report in <= 6 seconds.
- Convex functions use validators and bounded/indexed access patterns.
- Lint passes for changed scope.

### C.13) Non-Goals

- Real CI execution from browser.
- External auth provider integration.
- Rework of unrelated pages.

### C.14) Definition of Done

Done means the sandbox now demonstrates:

- strong exploratory QA scenario design;
- explicit manual vs automated testing comparison;
- production-like state management and deterministic behavior;
- polished recruiter-facing narrative in one coherent experience.

---

<a id="part-d"></a>

## Part D: Sandbox (Vibe Store) — Manual Regression Suite

### D.1. Scope

Validates `/sandbox` and `/uk/sandbox` as the **Vibe Coder Supply Co.** storefront: header (back link, brand, product search, EN/UA, theme, contact, account, cart), filters sidebar (including **QA challenge** card when idle), product grid/list, cart drawer, account drawer (Convex-backed demo auth), floating contact chat, promo strip with challenge entry, challenge timer bar, **sidebar area hint panel** (counts per functional slice; planted defects list may be empty), results modal, and simulated automated test report.

**Convex** is required for **account** flows (`initSession` + register/login/logout). Catalog and cart remain client-side.

Locales: EN (`/sandbox`), UA (`/uk/sandbox`). Themes: Light / Dark / System via global header + in-page theme toggle (both use `next-themes`).

### D.2. Preconditions

- App running (`npm run dev`).
- Optional: fresh browser profile.

### D.3. Test matrix

- Browsers: Chrome (primary), Firefox (sanity).
- Paths: `/sandbox`, `/uk/sandbox`.
- Themes: light and dark.

### D.4. Test cases

#### VS-001 — Shell and navigation

1. Open `/sandbox`.
2. Confirm sticky header: back to portfolio, duck brand, search field, `EN` / `UK` toggle, sun/moon theme, Contact us, Account, Cart with badge `0`.
3. Click back link → portfolio home (localized).

#### VS-002 — Locale toggle

1. On `/sandbox`, click `EN` (or locale control) to switch to Ukrainian route.
2. Expect URL `/uk/sandbox` and UA strings on chrome (e.g. filters, buttons).

#### VS-003 — Theme toggle

1. Toggle sun/moon in store header.
2. Expect `data-theme` on `<html>` to switch; layout remains usable.

#### VS-004 — Filters and catalog

1. Use category list, price slider, min rating chips, “In stock only”, sort dropdown.
2. Switch grid/list icons.
3. Clear filters resets search text, category **all**, price max, stock checkbox, and **min rating** (back to “all”).

#### VS-005 — Search (Cyrillic)

1. On `/uk/sandbox` (or EN), type a Cyrillic query matching UA catalog copy (e.g. `duck` in Ukrainian).
2. Expect matching duck products (search matches `name` / `tagline` in EN and UA).

#### VS-006 — Cart drawer

1. Add products from grid; open cart drawer.
2. Change quantity, remove line; apply promo `VIBES10` once (10% off); re-apply with the same code does **not** stack further discount.
3. Checkout button present (non-functional, as design).

#### VS-007 — QA challenge flow

1. From **sidebar** “15-minute bug hunt” card or **promo strip**, open challenge modal → Start.
2. Confirm timer bar, **area hints** in sidebar (per-zone found/total when defects exist), and that **Finish** (UA: finish label) opens the **results modal immediately** (no confirm step).
3. Results modal: bug count, time stats, praise line (**>50%** vs **≤50%** of planted bugs), **Run automated tests**, **Skip — back to store**.
4. Report animates test rows; **Back to store** returns to storefront and clears challenge UI state.
5. Optional: let timer reach `0:00` → results auto-opens.

#### VS-008 — Account drawer (Convex demo auth)

1. Open Account → **Register**: name (required), email (must contain `@`, min length aligned with backend), password (≥8), role (QA / Developer / Manager). Invalid input shows inline errors; duplicate email shows server error text.
2. After successful register, session is **logged in** (name + email + role in drawer; header shows name or email prefix).
3. **Log out** then **Log in** with the same email/password → session restored.
4. **Log in** tab: empty fields, email without `@`, or password `<8` characters → validation errors (no success).
5. **Log out** clears the client cart and promo state for the next session.

#### VS-009 — Contact chat

1. Open Contact us → floating chat.
2. Send messages; bot replies after delay; chat scrolls to the latest message without an artificial overscroll jump.

#### VS-010 — Pagination

1. With enough results to paginate, go to page 2+; after narrowing filters, current page clamps so it never stays past the last page.

### D.5. Out of scope (this page)

- `RealtimeChatPanel` (edit/delete/react/search) and catalog of ~200 SKUs with `SAVE10` / `QA20` on this route.

See [Part E](#part-e) for a dated list of regression findings vs fixes.

Automated/tooling run log: [Part F](#part-f).

---

<a id="part-e"></a>

## Part E: Vibe Store sandbox — regression findings (manual)

Date: 2026-05-02. Scope: `/sandbox`, `/uk/sandbox` (Vibe Coder Supply Co.).

### Fixed in this pass

| ID | Area | Finding | Resolution |
| --- | --- | --- | --- |
| REG-001 | Auth | Log in / Register accepted empty fields and fake success without validation. | Client checks + Convex `loginUser` / `registerUser` rules (email with `@`, min length 6 for email, password ≥ 8, name required on register). |
| REG-002 | Auth | Log in did not validate email shape or short password before “success”. | Same as REG-001; login rejects invalid email / short password with `EMAIL_INVALID` / `PASSWORD_TOO_SHORT`. |
| REG-003 | Auth | No name field; header showed only email local-part after “login”. | Register includes **Name** + **Role**; Convex session stores `authUserName`; UI shows name when logged in; Convex **auto-logs in** after successful register. |
| REG-004 | Auth | No real persistence — could not log out and log in again with the same credentials. | Auth backed by Convex `sandbox_users` + `getSessionAuthState` with `sandbox_session_key` in `localStorage`. |
| REG-005 | QA challenge | Easy to miss the challenge entry (only small promo banner). | Sidebar card **“15-minute bug hunt”** + primary **Start 15-min challenge** button; promo bar button label uses `ch.start`. |
| REG-006 | QA challenge | “Finish early” opened a confirm dialog; product owner wanted immediate results modal. | **Finish** (including UA locale label) calls results modal directly (confirm step removed). |
| REG-007 | QA challenge | Results praise used fine-grained bands, not a clear “> half the bugs” message. | Modal body uses `res.split.high` / `res.split.low` based on **strictly more than 50%** of planted bugs found. |
| REG-008 | Filters | “Clear all” did not reset min-rating chips. | `clearFilters()` now calls `setMinRating(0)`. |
| REG-009 | Search | Cyrillic queries returned no rows (EN-only match). | Filter matches `name` / `tagline` in both EN and UA. |
| REG-010 | Cards | Out-of-stock items still allowed Add. | `addToCart` no-ops for `stock <= 0`; Add button disabled in grid + list. |
| REG-011 | Cart | `VIBES10` could be applied repeatedly, stacking percent. | Second apply of the same code is ignored; discount stays 10%. |
| REG-012 | Cart | Odd sticker qty used `Math.floor`, wrong subtotal. | Subtotal is always `price × qty`. |
| REG-013 | Cart / auth | Logout left cart lines in memory. | `onLogoutAfter` clears cart, promo code input, and promo state. |
| REG-014 | Auth | No password visibility toggle. | Show/hide control with `data-password-toggle` next to password field. |
| REG-015 | Chat | Scroll target used `scrollHeight + 200`, jumpy UX. | Scroll to `scrollHeight` only. |
| REG-016 | Pagination | Page index could exceed new `totalPages` after filter change. | `useEffect` clamps `page` into `[1, totalPages]`. |
| REG-017 | A11y | Store inputs used `outline: none` with no `:focus-visible` ring. | `.vibe-store-focus:focus-visible` in `globals.css` on search, range, sort, promo, chat, account fields. |
| REG-018 | Header | Cart badge could show negative in edge cases. | Badge uses `Math.max(0, sum(qty))`. |
| REG-019 | i18n | Chat placeholder and auth placeholders hardcoded EN. | `sb.contact.placeholder`, `sb.auth.passwordPlaceholder`, localized bot replies. |
| REG-020 | Demo report | Simulated Playwright rows still showed 12 fails after fixes. | `vibe-auto-tests.ts` rows `t01`–`t12` set to **pass** to match storefront behavior. |
| REG-021 | Header | On `/uk/*`, **Fit** / **Contact** linked to `/#fit` and `/#contact` (EN home) instead of localized home. | `Header` uses `localizePath("/", locale)` for hash targets (`/uk#fit`, `/uk#contact`). |
| REG-022 | Cart | **Total** row stayed English on UK locale. | `sb.cart.total` + `t("sb.cart.total")` in cart drawer. |
| REG-023 | Cart | Promo block / apply / line labels and `+` qty could ignore stock; line totals rounded to whole dollars. | `sb.cart.promoBlock` / `apply` / `promoLine`; cap `addToCart` / `updateQty` at `stock`; line total `toFixed(2)`; disable `+` at max stock. |
| REG-024 | Cart | Switching `/sandbox` ↔ `/uk/sandbox` remounted the store and **lost** cart/promo (looked like “two carts”). | `localStorage` key `vibe_sandbox_checkout_v1` (lines by product `id` + `q`, promo, promo input); hydrate on mount; persist only after `checkoutHydrated` so the first persist pass cannot overwrite storage with an empty cart; **also** `syncPersist` after `addToCart` / `removeFromCart` / `updateQty` / `applyPromo` so a fast locale navigation cannot skip the debounced effect; cleared on logout. |

### Follow-up (optional)

- E2E against deployed Convex for auth mutations if CI should cover them.
- Rate limiting / session hardening are out of scope for this demo storefront.

---

<a id="part-f"></a>

## Part F: Regression run — Vibe Store `/sandbox` (2026-05-02)

### Scope

- **Routes:** `/sandbox` (full challenge + account flow), `/uk/sandbox` (locale shell + updated sidebar hint verified in browser).
- **Stack checks:** `pnpm exec tsc --noEmit`, `pnpm run build` (Next.js 16.2.4, Turbopack).
- **Browser automation:** Cursor **IDE Browser** MCP (`browser_navigate`, `browser_click`, `browser_snapshot`, `browser_console_messages`, `browser_lock` / `unlock`).
- **Chrome DevTools MCP (`user-chrome-devtools`):** If `list_pages` / `new_page` fails with *browser already running* for `~/.cache/chrome-devtools-mcp/chrome-profile`, stop only that automation Chrome (process whose argv includes that `--user-data-dir`), then retry MCP. **Do not** kill your personal Chrome profile; prefer closing the DevTools MCP window or MCP `--isolated` per [chrome-devtools-mcp](https://www.npmjs.com/package/chrome-devtools-mcp) docs.

### Build / static analysis

| Check        | Result                          |
| ------------ | ------------------------------- |
| TypeScript   | Pass (`pnpm exec tsc --noEmit`) |
| Production build | Pass (`pnpm run build`)     |

### IDE Browser MCP — `/sandbox`

| Step | Action | Result |
| ---- | ------ | ------ |
| 1 | Navigate `http://localhost:3000/sandbox` | Page title **Ivan Kozenko · Senior AQA Engineer**; shell visible (back link, brand, search, EN, theme, Contact, Account, Cart 0, categories, product grid, pagination, sidebar challenge card). |
| 2 | Click **Start 15-min challenge** (promo bar) | Modal opens: title *Test the store: 15-minute challenge*, lede for **18 planted defects**, three rule bullets, **Maybe later** / **Start the run**. |
| 3 | Click **Start the run** | Challenge mode: top bar **Finish**, promo strip hidden; timer UX present. |
| 4 | Click **Finish** | Results modal: *Wrapped up early — nice*, copy for **no planted defects** (`res.split.zero`), **Skip — back to store**, **Run automated tests**. |
| 5 | Click **Skip — back to store** | Returns to idle storefront; **Start 5-min challenge** visible again. |
| 6 | Open **Account** drawer | **Log in** / **Register** tabs, email + password fields, primary **Log in** button. |
| 7 | **Log in** with empty fields | No console errors/warnings beyond HMR/React DevTools; validation is client-side (expected). |

#### Observations (non-blocking)

1. **Accessibility snapshot:** After empty login submit, `role=alert` was not surfaced in the YAML snapshot (may be tree depth / snapshot limits). Manual check: red error text should still render in drawer.
2. **Copy:** Sidebar `ch.sidebar.hint` was aligned with the new area-summary panel (EN + UK) during this regression pass.

### IDE Browser MCP — `/uk/sandbox`

| Step | Action | Result |
| ---- | ------ | ------ |
| 1 | Navigate `http://localhost:3000/uk/sandbox` | UA chrome renders localized nav/actions (support, account, cart, challenge CTA, categories, sort, grid/list, add on cards). |
| 2 | Sidebar hint (ref `e53`) | After copy fix: UA text describes timer + **area summary** (not checklist-only). |

### Chrome DevTools MCP — `/sandbox` + `/uk/sandbox` (2026-05-02)

Automation: `navigate_page`, `take_snapshot`, `click`, `fill`, `list_console_messages` (errors), `list_network_requests`.

| Step | Action | Result |
| ---- | ------ | ------ |
| 1 | `/sandbox` idle storefront | Grid, filters, pagination, **Start 5-min challenge**, **Account**, **Cart** (state from session; e.g. badge after add). |
| 2 | Challenge: start challenge (UA locale labels) → start run | Timer **15:00**, found counter (`0 / 18`), and area-focus rows show non-zero totals per area. |
| 3 | **Finish** → results | Early wrap + **Skip — back to store**; returns to idle. |
| 4 | **Add** first product → **Cart** | Drawer: line item, promo, totals; **Close drawer** works. |
| 5 | **Account** → email `bad`, password `1234567` → **Log in** | Inline alert: *Enter a valid email (must include @).*; `email` textbox `invalid="true"`. |
| 6 | `list_console_messages` (errors) after flows | **No errors** in sampled window. |
| 7 | Navigate `/uk/sandbox` | UA shell renders localized controls for support/account/cart/challenge, filters, clear-all, add, and grid/list; `list_network_requests` on navigation: document + static assets **200/304**, no failed requests in capture. |
| 8 | Open localized **Support** entry | Drawer with localized chat title, message field, and send action appears; close works. |
| 9 | Search with a UA-language duck query | Matches duck rows; localized clear-all restores full catalog. |
| 10 | Search **duck** | **6 results** (duck SKUs/titles). |
| 11 | **Toggle color theme** | `description` flips **Switch to dark** → **Switch to light** (dark mode on). |
| 12 | Pagination **2** | Grid swaps to page-2 products (stickers/apparel etc.); control **2** focused. |
| 13 | `list_console_messages` (`error` + `warn`) | **None** after the above. |

**Note:** Cart count can differ between EN and UK if storage is keyed by locale or session was reset on full navigation; behavior is consistent with a per-route client state.

### Portfolio `/` (Chrome DevTools, EN)

| Step | Action | Result |
| ---- | ------ | ------ |
| 1 | **Try a sample JD** → **Analyze fit** | Analyzing phases → score + **Strong matches** + **Copy summary**. |
| 2 | **New JD** | Resets job-fit panel to idle. |

### `/sandbox` extended (Chrome DevTools)

| Step | Action | Result |
| ---- | ------ | ------ |
| 1 | **Maybe later** on challenge modal | Modal closes. |
| 2 | Re-open challenge → **Start the run** → **Finish** → **Run automated tests** | Auto report runs to **COMPLETE**; **Back to store** returns to storefront. |
| 3 | **Ducks** + **List**, **Contact** chat send | Bot reply EN; placeholder from i18n. |

### Code fixes (2026-05-02 follow-up)

Storefront + demo report aligned: `clearFilters` resets **min rating**; Cyrillic + ASCII search on EN+UA fields; OOS **Add** disabled; **VIBES10** non-stacking; subtotal without sticker floor bug; **logout** clears cart/promo; cart badge `Math.max(0,…)`; chat scroll; page clamp vs `totalPages`; `.vibe-store-focus` rings; account password **show/hide** (`data-password-toggle`); i18n placeholders + bot lines; `vibe-auto-tests.ts` **t01–t12** → pass. See [Part E](#part-e) REG-008–REG-020.

### Residual / follow-up

- [ ] Optional Playwright smoke: challenge start → finish → skip (headless CI).

### Related docs (within this file)

- Manual matrix: [Part D](#part-d)
- Prior bug log: [Part E](#part-e)
