# Vibe Coder Supply — planted QA defects

Intentional defects on `/sandbox` and `/uk/sandbox` for the in-store **QA challenge**. E2E tests assert the **current shipped (buggy) behavior** until these seeds are removed or fixed.

| # | `SB_BUGS` id | Area | Summary |
|---|----------------|------|---------|
| 1 | `vs-01` | auth | Password autogenerate button is shown on **Login** (should be register-only). |
| 2 | `vs-02` | auth | **Register**: show/hide password toggle does not reveal plaintext; login works. |
| 3 | `vs-03` | auth | **Register**: no inline “email required” message for empty email; submit still blocked. |
| 4 | `vs-04` | auth | **Register**: role label always reads QA while value may differ. |
| 5 | `vs-05` | auth | User registered on **Register** tab cannot log in on **Login** with same credentials (Convex). |
| 6 | `vs-06` | header | Sort **Price ↑** uses same order as **Price ↓**. |
| 7 | `vs-07` | pagination | **‹** / **›** do not change page; numbered page buttons work. |
| 8 | `vs-08` | filter | **Books** / **Snacks** category buttons do not change selection. |
| 9 | `vs-09` | card | **Clear all** in the **empty results** block does nothing; sidebar **Clear all** works. |
| 10 | `vs-10` | filter | With price slider at **$5**, products **above $5** can still appear. |
| 11 | `vs-11` | search | Search shows items that do **not** match the query. |
| 12 | `vs-12` | cart | Promo **VIBES10** applies **50%** (copy still says 10%). |
| 13 | `vs-13` | cart | Any non-empty promo + **Apply** yields **69%** discount. |
| 14 | `vs-14` | cart | **Remove** removes a **different** line when multiple products are in the cart. |
| 15 | `vs-15` | chat | From the **second** user message onward, bot reply is **`error`**. |
| 16 | `vs-16` | chat | Chat header / input bar / bug-hint footer use **off-design green** backgrounds. |
| 17 | `vs-17` | cart | With **Ukrainian** UI, cart drawer title / totals / checkout CTA stay **English**. |
| 18 | `vs-18` | cart | Cart drawer **close** (X and backdrop) only succeeds on the **third** click. |
| 19 | `vs-19` | filter | Clicking **In stock only** (UA locale label) can hide **all products** instead of filtering only out-of-stock items. |

## Canonical failing test per bug (1:1)

| `SB_BUGS` id | Canonical failing E2E test |
|---|---|
| `vs-01` | `CM-77 login lane has no vs-01 bug marker` |
| `vs-02` | `CM-71 registration lane reveals password when toggling` |
| `vs-03` | `CM-72 registration lane shows empty-email field hint` |
| `vs-04` | `CM-76 registration role label reflects selected role` |
| `vs-05` | `CM-73 session handoff accepts fresh credentials on login tab` |
| `vs-06` | `CM-23 sort price low→high lane orders page-one slice` |
| `vs-07` | `CM-74 pagination arrows navigate between pages` |
| `vs-08` | `CM-64 category chips for books and snacks update selection` |
| `vs-09` | `CM-75 empty-state clear all restores catalog results` |
| `vs-10` | `CM-63 slider at minimum price excludes premium SKUs` |
| `vs-11` | `RTC-014 search narrows product list by name` |
| `vs-12` | `RTC-019 promo VIBES10 applies 10% discount` |
| `vs-13` | `RTC-020 invalid promo code is rejected` |
| `vs-14` | `CM-67 removing one SKU removes exactly that line` |
| `vs-15` | `RTC-070 second customer message yields a normal bot reply` |
| `vs-16` | `CM-69 chat chrome keeps neutral panel backgrounds` |
| `vs-17` | `CM-66 checkout copy is localized for UA storefront` |
| `vs-18` | `CM-68 cart drawer close works on first activation` |
| `vs-19` | `RTC-012 in-stock filter hides out-of-stock items` |

## Marking bugs during the challenge

- Elements that carry a defect expose **`data-vibe-bug-id="<id>"`** (id from the table).
- With the challenge active, **Mark bug** pick mode toggles the corresponding id in **`foundBugIds`** (and the challenge bar **Found N / 19**).
- Catalog source: [`src/lib/sandbox/vibe-store-data.ts`](../../src/lib/sandbox/vibe-store-data.ts) (`SB_BUGS`, `SB_BUG_ID_SET`).
- UI implementation: [`src/components/sandbox/vibe-store/vibe-sandbox-store.tsx`](../../src/components/sandbox/vibe-store/vibe-sandbox-store.tsx).

## Convex note (vs-05)

[`convex/sandbox.ts`](../../convex/sandbox.ts) — `registerUser` stores a hidden character in `passwordDemo` so `loginUser` strict equality fails for newly registered users.
