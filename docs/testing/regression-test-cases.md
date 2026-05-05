# Regression Test Case Catalog

Covers: portfolio home (`/`), sandbox (`/sandbox`), public API (`/api/jd-match`), and localized routes (`/uk`, `/uk/sandbox`).

**Format:** Each case includes ID, title, preconditions, steps, expected result, priority, type, and link to coverage matrix row(s).

---

## Home Page (`/` and `/uk`)

### RTC-001 — Home page renders hero section

| Field | Value |
|-------|-------|
| **ID** | RTC-001 |
| **Title** | Home page renders hero section |
| **Type** | smoke, regression |
| **Priority** | P1 |
| **Matrix rows** | — |
| **Preconditions** | App running on `http://localhost:3000` |
| **Steps** | 1. Navigate to `/` |
| **Expected** | `<h1>` visible, contains "Ivan"; status badge "available" shown; CTA links to `/sandbox` present |

---

### RTC-002 — Home page Ukrainian locale loads

| Field | Value |
|-------|-------|
| **ID** | RTC-002 |
| **Title** | Home page loads on `/uk` with Ukrainian strings |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | — |
| **Preconditions** | App running |
| **Steps** | 1. Navigate to `/uk` |
| **Expected** | Page renders; language indicator or heading text differs from EN version; sandbox link points to `/uk/sandbox` |

---

### RTC-003 — Job-fit checker — analyze button disabled on empty input

| Field | Value |
|-------|-------|
| **ID** | RTC-003 |
| **Title** | Job-fit analyzer disables "Analyze" when textarea is empty |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | — |
| **Preconditions** | Home page open, textarea empty |
| **Steps** | 1. Navigate to `/` — 2. Confirm textarea is empty |
| **Expected** | "Analyze" button has `disabled` attribute or `opacity: 0.5` / `cursor: not-allowed` |

---

### RTC-004 — Job-fit checker — sample JD loads and analyze runs

| Field | Value |
|-------|-------|
| **ID** | RTC-004 |
| **Title** | Clicking "Load sample" fills textarea; "Analyze" runs and shows score gauge |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | — |
| **Preconditions** | Home page open |
| **Steps** | 1. Navigate to `/` — 2. Click "Load sample" button — 3. Click "Analyze" — 4. Wait for results |
| **Expected** | Score gauge SVG visible; strong/partial chips shown; "Copy summary" button appears |

---

### RTC-005 — Job-fit checker — empty/no-signals JD shows error state

| Field | Value |
|-------|-------|
| **ID** | RTC-005 |
| **Title** | JD with no recognizable keywords shows error panel |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | — |
| **Preconditions** | Home page open |
| **Steps** | 1. Navigate to `/` — 2. Type "aaaa bbb ccc" in textarea — 3. Click "Analyze" |
| **Expected** | Error panel shown with message about no signals; "Reset" button visible |

---

### RTC-006 — Job-fit checker — reset clears results

| Field | Value |
|-------|-------|
| **ID** | RTC-006 |
| **Title** | "Reset" clears results and returns to idle state |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | — |
| **Preconditions** | Job-fit results shown (RTC-004 complete) |
| **Steps** | 1. With results visible, click "Reset" |
| **Expected** | Idle empty-state panel shown; textarea cleared |

---

### RTC-007 — CV PDF download link present

| Field | Value |
|-------|-------|
| **ID** | RTC-007 |
| **Title** | "Download PDF resume" link has correct href |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | — |
| **Preconditions** | Home page open |
| **Steps** | 1. Navigate to `/` — 2. Locate download link |
| **Expected** | `<a download href="/cv/CV_Ivan_Kozenko_AQA_Senior.pdf">` present and reachable (HTTP 200) |

---

## Sandbox (`/sandbox` and `/uk/sandbox`)

### RTC-008 — Sandbox loads with all products visible

| Field | Value |
|-------|-------|
| **ID** | RTC-008 |
| **Title** | Sandbox page renders 12 product cards on first page |
| **Type** | smoke, regression |
| **Priority** | P1 |
| **Matrix rows** | CM-01, CM-16, CM-27 |
| **Preconditions** | App running |
| **Steps** | 1. Navigate to `/sandbox` |
| **Expected** | Header with brand name visible; 12 product cards on page; filters sidebar visible |

---

### RTC-009 — Sandbox UA locale

| Field | Value |
|-------|-------|
| **ID** | RTC-009 |
| **Title** | `/uk/sandbox` renders in Ukrainian locale |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-59, CM-60 |
| **Preconditions** | App running |
| **Steps** | 1. Navigate to `/uk/sandbox` |
| **Expected** | Page renders; locale toggle button shows "UK"; product names in Ukrainian |

---

### RTC-010 — Sandbox locale toggle EN→UA

| Field | Value |
|-------|-------|
| **ID** | RTC-010 |
| **Title** | Locale toggle switches to Ukrainian and back |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-02, CM-03 |
| **Preconditions** | Sandbox open in EN locale |
| **Steps** | 1. Navigate to `/sandbox` — 2. Click locale toggle — 3. Click locale toggle again |
| **Expected** | After step 2: URL changes to `/uk/sandbox`, UI strings in Ukrainian. After step 3: returns to `/sandbox`, UI in English |

---

### RTC-011 — Category filter narrows product list

| Field | Value |
|-------|-------|
| **ID** | RTC-011 |
| **Title** | Clicking category "duck" shows only duck products |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-09 |
| **Preconditions** | Sandbox open, all products visible |
| **Steps** | 1. Click "duck" in the category filter |
| **Expected** | Only duck-category products shown; count matches `SB_PRODUCTS.filter(p => p.cat==='duck').length` (6) |

---

### RTC-012 — In-stock filter hides out-of-stock items

| Field | Value |
|-------|-------|
| **ID** | RTC-012 |
| **Title** | "In stock only" checkbox hides products with stock=0 |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-13 |
| **Preconditions** | Sandbox open, all products visible |
| **Steps** | 1. Check "in stock only" checkbox |
| **Expected** | Products p11 (404 mug, stock=0) and p29 (USB-C dongle, stock=0) no longer visible |

---

### RTC-013 — Clear filters restores full list

| Field | Value |
|-------|-------|
| **ID** | RTC-013 |
| **Title** | "Clear filters" button resets all active filters |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-14, CM-31 |
| **Preconditions** | Category "duck" active, stock-only checked |
| **Steps** | 1. Apply duck filter + stock-only — 2. Click "Clear filters" |
| **Expected** | All 44 products visible again on page 1; rating and price filters reset to defaults |

---

### RTC-014 — Search narrows product list

| Field | Value |
|-------|-------|
| **ID** | RTC-014 |
| **Title** | Search query filters products by name/tagline |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-06, CM-07 |
| **Preconditions** | Sandbox open |
| **Steps** | 1. Type "duck" in search input — 2. Clear search input |
| **Expected** | After step 1: only duck-related products shown. After step 2: full list restored |

---

### RTC-015 — Pagination next/previous page

| Field | Value |
|-------|-------|
| **ID** | RTC-015 |
| **Title** | Pagination navigates through pages of products |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-27, CM-28, CM-29 |
| **Preconditions** | Sandbox open with all 44 products (4 pages at 12/page) |
| **Steps** | 1. Click "Next page" — 2. Click "Previous page" |
| **Expected** | After step 1: different 12 products shown, page indicator shows page 2. After step 2: back to page 1 |

---

### RTC-016 — Add to cart — product appears in cart

| Field | Value |
|-------|-------|
| **ID** | RTC-016 |
| **Title** | Adding a product to cart updates cart badge and drawer |
| **Type** | smoke, regression |
| **Priority** | P1 |
| **Matrix rows** | CM-21 |
| **Preconditions** | Sandbox open |
| **Steps** | 1. Click "Add to cart" on any in-stock product — 2. Open cart drawer |
| **Expected** | Cart badge count increments to 1; cart drawer shows product with qty=1 and correct price |

---

### RTC-017 — Cart quantity increment and subtotal update

| Field | Value |
|-------|-------|
| **ID** | RTC-017 |
| **Title** | Incrementing cart qty updates subtotal correctly |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-22, CM-33 |
| **Preconditions** | One product in cart |
| **Steps** | 1. Open cart — 2. Click "+" on item (increment qty) |
| **Expected** | Qty shows 2; subtotal = price × 2 |

---

### RTC-018 — Cart remove item

| Field | Value |
|-------|-------|
| **ID** | RTC-018 |
| **Title** | Removing item from cart empties the cart |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-35 |
| **Preconditions** | One product in cart |
| **Steps** | 1. Open cart — 2. Click remove/trash icon on item |
| **Expected** | Cart is empty; empty-state message shown |

---

### RTC-019 — Promo code VIBES10 applies discount

| Field | Value |
|-------|-------|
| **ID** | RTC-019 |
| **Title** | Valid promo "VIBES10" applies 10% discount |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-36 |
| **Preconditions** | Product in cart (price known) |
| **Steps** | 1. Open cart — 2. Type "VIBES10" in promo input — 3. Click "Apply" |
| **Expected** | Discount line shows −10%; total = subtotal × 0.9 |

---

### RTC-020 — Invalid promo code is rejected

| Field | Value |
|-------|-------|
| **ID** | RTC-020 |
| **Title** | Invalid promo code "FAKECODE" is rejected, no discount shown |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-37 |
| **Preconditions** | Product in cart |
| **Steps** | 1. Open cart — 2. Type "FAKECODE" — 3. Click "Apply" |
| **Expected** | No discount applied; total unchanged; no promo confirmation shown |

---

### RTC-021 — Cart persists across page reload

| Field | Value |
|-------|-------|
| **ID** | RTC-021 |
| **Title** | Cart items survive page reload via localStorage |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-38 |
| **Preconditions** | Product in cart |
| **Steps** | 1. Add product to cart — 2. Reload page — 3. Open cart |
| **Expected** | Same item(s) present with same qty after reload |

---

### RTC-022 — Out-of-stock product cannot be added to cart

| Field | Value |
|-------|-------|
| **ID** | RTC-022 |
| **Title** | Add-to-cart button disabled for out-of-stock products |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-18 |
| **Preconditions** | Sandbox open, products visible |
| **Steps** | 1. Apply "in stock only" off — 2. Find p11 (404 mug, stock=0) or p29 — 3. Inspect "Add to cart" button |
| **Expected** | Button has `disabled` attribute; clicking it does not add to cart |

---

### RTC-023 — QA challenge start modal appears

| Field | Value |
|-------|-------|
| **ID** | RTC-023 |
| **Title** | Clicking "Start challenge" shows confirmation modal |
| **Type** | smoke, regression |
| **Priority** | P1 |
| **Matrix rows** | CM-48 |
| **Preconditions** | Sandbox open, not in challenge mode |
| **Steps** | 1. Click "Start challenge" button in header area |
| **Expected** | Modal dialog visible with "Start" and "Cancel" buttons |

---

### RTC-024 — QA challenge starts countdown on confirm

| Field | Value |
|-------|-------|
| **ID** | RTC-024 |
| **Title** | Confirming challenge start shows challenge bar with timer |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-49, CM-51 |
| **Preconditions** | Challenge start modal open |
| **Steps** | 1. Click "Start" in modal — 2. Wait 2 seconds |
| **Expected** | Challenge bar visible at top; timer shows value near 300 and counts down |

---

### RTC-025 — Cancel challenge start modal

| Field | Value |
|-------|-------|
| **ID** | RTC-025 |
| **Title** | Cancelling the start modal does not start the challenge |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | CM-50 |
| **Preconditions** | Challenge start modal open |
| **Steps** | 1. Click "Cancel" in modal |
| **Expected** | Modal closes; challenge bar not visible; store view unchanged |

---

### RTC-026 — Challenge finish early shows results

| Field | Value |
|-------|-------|
| **ID** | RTC-026 |
| **Title** | "Finish" button during challenge shows results modal |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | CM-53, CM-54 |
| **Preconditions** | Challenge active (RTC-024 complete) |
| **Steps** | 1. Click "Finish" in challenge bar |
| **Expected** | Results modal visible showing found/total bug counts and action buttons |

---

### RTC-027 — Mark bug mode toggle and element selection

| Field | Value |
|-------|-------|
| **ID** | RTC-027 |
| **Title** | Mark bug mode allows clicking an element to register it as a bug |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-43, CM-44 |
| **Preconditions** | Sandbox open |
| **Steps** | 1. Click "Mark bug" button — 2. Click a product card element |
| **Expected** | Cursor changes to crosshair; after click snackbar confirmation shown; bug count increments to 1 |

---

### RTC-028 — Escape key exits mark-bug mode

| Field | Value |
|-------|-------|
| **ID** | RTC-028 |
| **Title** | Pressing Escape while in mark-bug mode exits the mode |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | CM-46 |
| **Preconditions** | Mark-bug mode active |
| **Steps** | 1. Activate mark-bug mode — 2. Press Escape key |
| **Expected** | Cursor returns to default; "Mark bug" button no longer shows active state |

---

### RTC-029 — Auto-test view renders and back returns to store

| Field | Value |
|-------|-------|
| **ID** | RTC-029 |
| **Title** | Auto-test view shows test report; "Back" returns to store |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-55, CM-57, CM-58 |
| **Preconditions** | Challenge results modal open |
| **Steps** | 1. Click "Run auto tests" — 2. Observe auto-test report — 3. Click "Back" |
| **Expected** | Auto-test report panel visible with test list. After "Back": store view restored |

---

### RTC-030 — Back-to-home link navigates from sandbox

| Field | Value |
|-------|-------|
| **ID** | RTC-030 |
| **Title** | Back-to-home link from sandbox navigates to portfolio home |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | CM-05 |
| **Preconditions** | Sandbox open |
| **Steps** | 1. Click back/home link in sandbox header |
| **Expected** | URL changes to `/`; portfolio home page renders |

---

## Public API (`/api/jd-match`)

### RTC-031 — POST /api/jd-match happy path returns 200 with result

| Field | Value |
|-------|-------|
| **ID** | RTC-031 |
| **Title** | POST with valid JD text returns 200 with score and match data |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | — |
| **Preconditions** | App running |
| **Steps** | 1. POST `{"text":"Playwright TypeScript automation QA","lang":"en"}` to `/api/jd-match` |
| **Expected** | HTTP 200; body has `source`, `result.score` (number), `result.strong` (array) |

---

### RTC-032 — POST /api/jd-match with empty text returns 400

| Field | Value |
|-------|-------|
| **ID** | RTC-032 |
| **Title** | POST with empty `text` returns 400 `{error:"empty"}` |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | — |
| **Preconditions** | App running |
| **Steps** | 1. POST `{"text":""}` to `/api/jd-match` |
| **Expected** | HTTP 400; body is `{"error":"empty"}` |

---

### RTC-033 — POST /api/jd-match with invalid JSON returns 400

| Field | Value |
|-------|-------|
| **ID** | RTC-033 |
| **Title** | POST with malformed JSON body returns 400 |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | — |
| **Preconditions** | App running |
| **Steps** | 1. POST raw string `not-json` with `Content-Type: application/json` |
| **Expected** | HTTP 400; body is `{"error":"invalid_json"}` |

---

### RTC-034 — POST /api/jd-match no-signals text returns 422

| Field | Value |
|-------|-------|
| **ID** | RTC-034 |
| **Title** | JD text with no recognizable skill signals returns 422 noSignals |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | — |
| **Preconditions** | App running |
| **Steps** | 1. POST `{"text":"hello world foo bar xyz"}` to `/api/jd-match` |
| **Expected** | HTTP 422; body has `{"error":"noSignals","result":...}` |

---

### RTC-035 — POST /api/jd-match response contract shape

| Field | Value |
|-------|-------|
| **ID** | RTC-035 |
| **Title** | Successful response has expected top-level contract shape |
| **Type** | regression |
| **Priority** | P1 |
| **Matrix rows** | — |
| **Preconditions** | App running |
| **Steps** | 1. POST valid JD text — 2. Validate response body fields |
| **Expected** | Body has: `source` (string), `result.score` (0–100), `result.band` (string), `result.strong` (array), `result.partial` (array), `result.gaps` (array), `aiNarrative` (null or string) |

---

## Navigation & Routes

### RTC-036 — All public routes return 200

| Field | Value |
|-------|-------|
| **ID** | RTC-036 |
| **Title** | All public HTML routes return HTTP 200 |
| **Type** | smoke, regression |
| **Priority** | P1 |
| **Matrix rows** | — |
| **Preconditions** | App running |
| **Steps** | 1. GET `/` — 2. GET `/uk` — 3. GET `/sandbox` — 4. GET `/uk/sandbox` |
| **Expected** | All respond HTTP 200 with HTML body |

---

### RTC-037 — Unknown route returns 404

| Field | Value |
|-------|-------|
| **ID** | RTC-037 |
| **Title** | Non-existent page returns Next.js 404 |
| **Type** | regression |
| **Priority** | P2 |
| **Matrix rows** | — |
| **Preconditions** | App running |
| **Steps** | 1. GET `/this-does-not-exist-xyz` |
| **Expected** | HTTP 404 response |

---
