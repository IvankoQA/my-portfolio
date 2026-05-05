# Sandbox: functional test coverage

**Pages:** `/sandbox` and `/uk/sandbox`
**E2E environment:** `npm run dev` on `http://localhost:3000`
**Updated:** 2026-05-04 — full run: `54` e2e + `15` api (green); sandbox block in e2e: `45` tests (chromium).

---

## Status legend

- **covered** — stable automated test exists.
- **partial** — test exists but edge case is not fully covered (currently: 0).
- **none** — no automation (see note on the case).
- **manual-only** — intentionally manual only.

---

## Coverage by area

Each **CM-xx** entry: scenario, priority **P1/P2**, status, optional backend integration, test file + case name.

### Header

- **CM-01** (P1, covered) — Page load: header with brand, search, cart/account/chat buttons. Integration: Convex `initSession` on mount. **Test:** `tests/e2e/sandbox/sandbox-load.spec.ts` — RTC-008.
- **CM-02** (P1, covered) — Locale toggle EN→UA, UI strings switch to Ukrainian. **Test:** same file — RTC-010.
- **CM-03** (P1, covered) — Locale toggle UA→EN, strings switch back to English. **Test:** same file — RTC-010.
- **CM-04** (P2, covered) — Theme toggle light→dark, `data-theme` changes on `<html>`. **Test:** `tests/e2e/sandbox/sandbox-store-ui.spec.ts` — CM-04.
- **CM-05** (P1, covered) — Back-to-home link goes to `/`. **Test:** `tests/e2e/sandbox/sandbox-load.spec.ts` — RTC-030.
- **CM-06** (P1, covered) — Typing in search narrows results, counter updates. **Test:** `tests/e2e/sandbox/sandbox-filters.spec.ts` — RTC-014.
- **CM-07** (P1, covered) — Clearing search restores full product list. **Test:** same file — RTC-014.

### Filters

- **CM-08** (P1, covered) — Category "All": 44 results total, 12 cards on page 1. **Test:** `tests/e2e/sandbox/sandbox-filters.spec.ts` — CM-08.
- **CM-09** (P1, covered) — Category "duck": only ducks shown. **Test:** same file — RTC-011.
- **CM-10** (P2, covered) — Category "mug": only mugs shown. **Test:** same file — CM-10.
- **CM-11** (P1, covered) — Max-price slider reduces product set (native setter for range input). **Test:** same file — CM-11.
- **CM-12** (P2, covered) — Rating "4.5+" hides products below threshold. **Test:** same file — CM-12.
- **CM-13** (P1, covered) — "In stock only" hides out-of-stock items (p11, p29). **Test:** same file — RTC-012.
- **CM-14** (P1, covered) — "Clear filters" resets all filters. **Test:** same file — RTC-013.
- **CM-15** (P2, covered) — Combo: duck + price + in-stock. **Test:** same file — CM-15.

### Product grid / list

- **CM-16** (P1, covered) — Grid: cards with name, price, rating, stock, tagline. **Test:** `tests/e2e/sandbox/sandbox-load.spec.ts` — RTC-008.
- **CM-17** (P2, covered) — List/grid toggle, row/card layout. **Test:** `tests/e2e/sandbox/sandbox-store-ui.spec.ts` — CM-17.
- **CM-18** (P1, covered) — Out-of-stock: Add button disabled (p11, p29). **Test:** `tests/e2e/sandbox/sandbox-cart.spec.ts` — RTC-022.
- **CM-19** (P2, covered) — "Sale" badge for `sale: true` (`product-badge-sale-p01`). **Test:** `tests/e2e/sandbox/sandbox-store-ui.spec.ts` — CM-19 / CM-20.
- **CM-20** (P2, covered) — "New" badge for `isNew: true` (`product-badge-new-p10`). **Test:** same file — CM-19 / CM-20.
- **CM-21** (P1, covered) — Add to cart: item at qty 1. **Test:** `tests/e2e/sandbox/sandbox-cart.spec.ts` — RTC-016.
- **CM-22** (P1, covered) — Re-add increases qty (up to stock limit). **Test:** same file — RTC-017.

### Sort

- **CM-23** (P2, covered) — Price low→high: first card is cheapest ("It works ✓"). **Test:** `tests/e2e/sandbox/sandbox-store-ui.spec.ts` — CM-23.
- **CM-24** (P2, covered) — Price high→low: first card is most expensive ("Standup"). **Test:** same file — CM-24.
- **CM-25** (P2, covered) — By rating: top rating first; p06 is first among 5.0s. **Test:** same file — CM-25.
- **CM-26** (P2, covered) — "New": new arrivals first; first is Espresso & Exceptions. **Test:** same file — CM-26.

### Pagination

- **CM-27** (P1, covered) — Page 1: exactly 12 cards. **Test:** `tests/e2e/sandbox/sandbox-filters.spec.ts` — CM-27.
- **CM-28** (P1, covered) — Next button: loads next batch of products. **Test:** same file — RTC-015.
- **CM-29** (P1, covered) — Prev button: returns to previous page. **Test:** same file — RTC-015.
- **CM-30** (P2, covered) — Filter result ≤ one page: pagination hidden (ducks: 6 items). **Test:** same file — CM-30.
- **CM-31** (P1, covered) — New filter resets to page 1. **Test:** same file — CM-31.

### Cart drawer

- **CM-32** (P1, covered) — Open cart: line items and subtotal. **Test:** `tests/e2e/sandbox/sandbox-cart.spec.ts` — RTC-016.
- **CM-33** (P1, covered) — Increase qty updates subtotal. **Test:** same file — RTC-017.
- **CM-34** (P1, covered) — Decrease qty to zero removes line. **Test:** same file — CM-34.
- **CM-35** (P1, covered) — Remove item button. **Test:** same file — RTC-018.
- **CM-36** (P1, covered) — Promo `VIBES10`: 10% discount in UI. **Test:** same file — RTC-019.
- **CM-37** (P1, covered) — Invalid promo: no discount, promo reset. **Test:** same file — RTC-020.
- **CM-38** (P1, covered) — Cart survives page reload (`localStorage`). **Test:** same file — RTC-021.
- **CM-39** (P2, covered) — Empty cart before any add-to-cart. **Test:** same file — CM-39.

### Account / auth

- **CM-40** (P2, none) — Account drawer in unauthenticated state. Integration: Convex `getSessionAuthState`. **Gap:** no Convex mock / test double in e2e.
- **CM-41** (P2, manual-only) — Authenticated account in drawer. Requires real credentials / live environment.

### Chat drawer

- **CM-42** (P2, covered) — Chat: drawer and message input. **Test:** `tests/e2e/sandbox/sandbox-store-ui.spec.ts` — CM-42.

### Mark bug mode

- **CM-43** (P1, covered) — Enable "Mark bug" mode, cursor style. **Test:** `tests/e2e/sandbox/sandbox-challenge.spec.ts` — RTC-027.
- **CM-44** (P1, covered) — Click element in mode: snackbar, counter +1. **Test:** same file — RTC-027.
- **CM-45** (P2, covered) — Second click on same element un-marks it. **Test:** same file — CM-45.
- **CM-46** (P2, covered) — Escape exits the mode. **Test:** same file — RTC-028.
- **CM-47** (P2, covered) — Click outside `#vibe-sandbox-root` does not register (synthetic `pointerdown` on `document.body`). **Test:** same file — CM-47.

### QA challenge

- **CM-48** (P1, covered) — "Start challenge" opens confirmation modal. **Test:** `tests/e2e/sandbox/sandbox-challenge.spec.ts` — RTC-023.
- **CM-49** (P1, covered) — Confirm start: challenge bar and timer visible. **Test:** same file — RTC-024.
- **CM-50** (P2, covered) — Cancel start: modal closed, challenge not started. **Test:** same file — RTC-025.
- **CM-51** (P1, covered) — Timer in MM:SS format on `challenge-timer`; per-frame countdown not checked. **Test:** same file — CM-51.
- **CM-52** (P1, manual-only) — Timer reaches zero and auto-results appear — requires ~300s or timer mock.
- **CM-53** (P2, covered) — "Finish early" shows results modal. **Test:** same file — RTC-026.
- **CM-54** (P1, covered) — Results modal: bugs found/total, CTA. **Test:** same file — RTC-026.
- **CM-55** (P1, covered) — "Run auto tests" CTA switches to auto-test view. **Test:** same file — RTC-029.
- **CM-56** (P2, covered) — "Skip" on results: modal closed, challenge reset. **Test:** same file — CM-56.

### Auto-test view

- **CM-57** (P1, covered) — Auto-test report, test list. **Test:** `tests/e2e/sandbox/sandbox-challenge.spec.ts` — RTC-029.
- **CM-58** (P1, covered) — "Back" returns to storefront. **Test:** same file — RTC-029.

### Locale / i18n

- **CM-59** (P1, covered) — `/uk/sandbox` opens in UA locale. **Test:** `tests/e2e/sandbox/sandbox-load.spec.ts` — RTC-009.
- **CM-60** (P2, covered) — Product names in Ukrainian on UA locale. **Test:** same file — RTC-009.

### Convex session

- **CM-61** (P1, manual-only) — Session key and `sandbox.initSession` mutation on load. Requires live local Convex.
- **CM-62** (P2, manual-only) — `getSessionAuthState` for unauthenticated user. Also requires live Convex.

---

## Status summary

- **covered:** 57
- **partial:** 0
- **none:** 1 (CM-40)
- **manual-only:** 4 (CM-41, CM-52, CM-61, CM-62)
- **Total cases in matrix:** 62

**Remaining gaps**

- **CM-40** — automate once a stable Convex mock or test double for `getSessionAuthState` is available.
- **CM-41, CM-52, CM-61, CM-62** — intentionally manual (real login, long timer, live Convex stack).

---

## E2E maintenance notes

- Dialogs: use semantic `role="dialog"` assertions.
- Cart: panel next to close button (`[aria-label="Close drawer"] + div`) and `data-testid="cart-remove-{id}"`.
- Mark bug: second click on the same path toggles `manualBugPaths` off.
