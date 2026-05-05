# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/sandbox/sandbox-filters.spec.ts >> Sandbox filters & search @regression @sandbox >> RTC-014 search narrows product list by name @sandbox-planted
- Location: tests/e2e/sandbox/sandbox-filters.spec.ts:39:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Senior Rubber Duck')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Senior Rubber Duck')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Home" [ref=e5] [cursor=pointer]:
        - /url: /
        - generic [ref=e6]: IK
        - generic [ref=e7]: ivan-kozenko-aqa
      - navigation [ref=e8]:
        - link "CV fit" [ref=e9] [cursor=pointer]:
          - /url: /#fit
        - link "Contact" [ref=e10] [cursor=pointer]:
          - /url: /#contact
      - generic [ref=e11]:
        - button "EN" [ref=e12] [cursor=pointer]:
          - img [ref=e13]
          - text: EN
        - button "Toggle color theme" [ref=e16] [cursor=pointer]:
          - img [ref=e17]
  - generic [ref=e20]:
    - banner [ref=e21]:
      - generic [ref=e22]:
        - link "Vibe Coder Supply Co." [ref=e23] [cursor=pointer]:
          - /url: "#top"
          - generic [ref=e24]: Vibe Coder Supply Co.
        - generic [ref=e25]:
          - img "search" [ref=e26]
          - textbox "Search products, SKUs, vibes…" [active] [ref=e29]: duck
          - button "x" [ref=e30] [cursor=pointer]:
            - img "x" [ref=e31]
        - generic [ref=e33]:
          - generic [ref=e34]:
            - button "bug Mark bug" [ref=e35] [cursor=pointer]:
              - img "bug" [ref=e36]
              - text: Mark bug
            - generic "Elements you marked on the page" [ref=e40]: "0"
          - button "chat Contact us" [ref=e41] [cursor=pointer]:
            - img "chat" [ref=e42]
            - text: Contact us
          - button "user Account" [ref=e44] [cursor=pointer]:
            - img "user" [ref=e45]
            - generic [ref=e48]: Account
          - button "cart Cart 0" [ref=e49] [cursor=pointer]:
            - img "cart" [ref=e50]
            - text: Cart
            - generic [ref=e55]: "0"
      - generic [ref=e57]:
        - paragraph [ref=e58]: Try the QA challenge — find the bugs we hid in the store at Vibe Coder Supply Co.
        - generic [ref=e59]:
          - button "bug Test the store (15-minute challenge)" [ref=e60] [cursor=pointer]:
            - img "bug" [ref=e61]
            - text: Test the store (15-minute challenge)
          - button "Run automated tests" [ref=e65] [cursor=pointer]
    - generic [ref=e66]:
      - complementary [ref=e67]:
        - generic [ref=e68]:
          - generic [ref=e69]: Filters
          - generic [ref=e70]:
            - button "All 44" [ref=e71] [cursor=pointer]:
              - generic [ref=e72]: All
              - generic [ref=e73]: "44"
            - button "Ducks 6" [ref=e74] [cursor=pointer]:
              - generic [ref=e75]: Ducks
              - generic [ref=e76]: "6"
            - button "Mugs 7" [ref=e77] [cursor=pointer]:
              - generic [ref=e78]: Mugs
              - generic [ref=e79]: "7"
            - button "Stickers 7" [ref=e80] [cursor=pointer]:
              - generic [ref=e81]: Stickers
              - generic [ref=e82]: "7"
            - button "Apparel 7" [ref=e83] [cursor=pointer]:
              - generic [ref=e84]: Apparel
              - generic [ref=e85]: "7"
            - button "Dev tools 9" [ref=e86] [cursor=pointer]:
              - generic [ref=e87]: Dev tools
              - generic [ref=e88]: "9"
            - button "Books 4" [ref=e89] [cursor=pointer]:
              - generic [ref=e90]: Books
              - generic [ref=e91]: "4"
            - button "Snacks 4" [ref=e92] [cursor=pointer]:
              - generic [ref=e93]: Snacks
              - generic [ref=e94]: "4"
          - separator [ref=e95]
          - generic [ref=e96]:
            - generic [ref=e97]:
              - text: "Price:"
              - generic [ref=e98]: $500
            - slider [ref=e99]: "500"
          - generic [ref=e100]:
            - generic [ref=e101]: Min. rating
            - generic [ref=e102]:
              - button "all" [ref=e103] [cursor=pointer]
              - button "3+" [ref=e104] [cursor=pointer]
              - button "4+" [ref=e105] [cursor=pointer]
              - button "4.5+" [ref=e106] [cursor=pointer]
          - generic [ref=e107] [cursor=pointer]:
            - checkbox "In stock only" [ref=e108]
            - text: In stock only
          - button "Clear all" [ref=e109] [cursor=pointer]
      - main [ref=e110]:
        - generic [ref=e111]:
          - generic [ref=e112]: 38 results · "duck"
          - generic [ref=e113]:
            - combobox [ref=e115] [cursor=pointer]:
              - option "Featured" [selected]
              - option "Price ↑"
              - option "Price ↓"
              - option "Top rated"
              - option "Newest"
            - generic [ref=e116]:
              - button "grid" [ref=e117] [cursor=pointer]:
                - img "grid" [ref=e118]
              - button "list" [ref=e123] [cursor=pointer]:
                - img "list" [ref=e124]
        - generic [ref=e126]:
          - generic [ref=e127]:
            - img "It Compiles, Ship It mug" [ref=e130]
            - generic [ref=e131]:
              - generic [ref=e132]: It Compiles, Ship It mug
              - generic [ref=e133]: 350ml of irresponsibility.
              - generic [ref=e134]:
                - generic [ref=e135]:
                  - generic [ref=e136]: ★
                  - generic [ref=e137]: ★
                  - generic [ref=e138]: ★
                  - generic [ref=e139]: ★
                  - generic [ref=e140]: ★
                - generic [ref=e141]: "4.5"
                - generic [ref=e142]: (287)
            - generic [ref=e143]:
              - generic [ref=e145]: $19
              - button "plus Add" [ref=e146] [cursor=pointer]:
                - img "plus" [ref=e147]
                - text: Add
          - generic [ref=e149]:
            - img "Stack Overflow Inheritance Mug" [ref=e152]
            - generic [ref=e153]:
              - generic [ref=e154]: Stack Overflow Inheritance Mug
              - generic [ref=e155]: Copy & paste with confidence.
              - generic [ref=e156]:
                - generic [ref=e157]:
                  - generic [ref=e158]: ★
                  - generic [ref=e159]: ★
                  - generic [ref=e160]: ★
                  - generic [ref=e161]: ★
                  - generic [ref=e162]: ★
                - generic [ref=e163]: "4.7"
                - generic [ref=e164]: (156)
            - generic [ref=e165]:
              - generic [ref=e167]: $22
              - button "plus Add" [ref=e168] [cursor=pointer]:
                - img "plus" [ref=e169]
                - text: Add
          - generic [ref=e171]:
            - img "Sad Sprint Mug" [ref=e174]
            - generic [ref=e175]:
              - generic [ref=e176]: Sad Sprint Mug
              - generic [ref=e177]: Burndown chart goes up.
              - generic [ref=e178]:
                - generic [ref=e179]:
                  - generic [ref=e180]: ★
                  - generic [ref=e181]: ★
                  - generic [ref=e182]: ★
                  - generic [ref=e183]: ★
                  - generic [ref=e184]: ★
                - generic [ref=e185]: "4.2"
                - generic [ref=e186]: (73)
            - generic [ref=e187]:
              - generic [ref=e189]: $18
              - button "plus Add" [ref=e190] [cursor=pointer]:
                - img "plus" [ref=e191]
                - text: Add
          - generic [ref=e193]:
            - generic [ref=e195]: NEW
            - img "Espresso & Exceptions" [ref=e198]
            - generic [ref=e199]:
              - generic [ref=e200]: Espresso & Exceptions
              - generic [ref=e201]: Throws stack traces.
              - generic [ref=e202]:
                - generic [ref=e203]:
                  - generic [ref=e204]: ★
                  - generic [ref=e205]: ★
                  - generic [ref=e206]: ★
                  - generic [ref=e207]: ★
                  - generic [ref=e208]: ★
                - generic [ref=e209]: "4.8"
                - generic [ref=e210]: (113)
            - generic [ref=e211]:
              - generic [ref=e213]: $26
              - button "plus Add" [ref=e214] [cursor=pointer]:
                - img "plus" [ref=e215]
                - text: Add
          - generic [ref=e217]:
            - generic [ref=e219]: 0 LEFT
            - 'img "404: Coffee Not Found" [ref=e222]'
            - generic [ref=e223]:
              - generic [ref=e224]: "404: Coffee Not Found"
              - generic [ref=e225]: Empty by design.
              - generic [ref=e226]:
                - generic [ref=e227]:
                  - generic [ref=e228]: ★
                  - generic [ref=e229]: ★
                  - generic [ref=e230]: ★
                  - generic [ref=e231]: ★
                  - generic [ref=e232]: ★
                - generic [ref=e233]: "4.3"
                - generic [ref=e234]: (198)
            - generic [ref=e235]:
              - generic [ref=e237]: $17
              - button "plus Add" [disabled] [ref=e238]:
                - img "plus" [ref=e239]
                - text: Add
          - generic [ref=e241]:
            - img "TypeScript Tear Catcher" [ref=e244]
            - generic [ref=e245]:
              - generic [ref=e246]: TypeScript Tear Catcher
              - generic [ref=e247]: any[] is a feeling.
              - generic [ref=e248]:
                - generic [ref=e249]:
                  - generic [ref=e250]: ★
                  - generic [ref=e251]: ★
                  - generic [ref=e252]: ★
                  - generic [ref=e253]: ★
                  - generic [ref=e254]: ★
                - generic [ref=e255]: "4.6"
                - generic [ref=e256]: (88)
            - generic [ref=e257]:
              - generic [ref=e259]: $21
              - button "plus Add" [ref=e260] [cursor=pointer]:
                - img "plus" [ref=e261]
                - text: Add
          - generic [ref=e263]:
            - img "Senior Junior sticker" [ref=e266]
            - generic [ref=e267]:
              - generic [ref=e268]: Senior Junior sticker
              - generic [ref=e269]: It depends on the day.
              - generic [ref=e270]:
                - generic [ref=e271]:
                  - generic [ref=e272]: ★
                  - generic [ref=e273]: ★
                  - generic [ref=e274]: ★
                  - generic [ref=e275]: ★
                  - generic [ref=e276]: ★
                - generic [ref=e277]: "4.9"
                - generic [ref=e278]: (612)
            - generic [ref=e279]:
              - generic [ref=e281]: $4
              - button "plus Add" [ref=e282] [cursor=pointer]:
                - img "plus" [ref=e283]
                - text: Add
          - generic [ref=e285]:
            - generic [ref=e287]: NEW
            - img "Vibe Coding sticker pack" [ref=e290]
            - generic [ref=e291]:
              - generic [ref=e292]: Vibe Coding sticker pack
              - generic [ref=e293]: 12 stickers. 0 productivity.
              - generic [ref=e294]:
                - generic [ref=e295]:
                  - generic [ref=e296]: ★
                  - generic [ref=e297]: ★
                  - generic [ref=e298]: ★
                  - generic [ref=e299]: ★
                  - generic [ref=e300]: ★
                - generic [ref=e301]: "4.8"
                - generic [ref=e302]: (421)
            - generic [ref=e303]:
              - generic [ref=e305]: $9
              - button "plus Add" [ref=e306] [cursor=pointer]:
                - img "plus" [ref=e307]
                - text: Add
          - generic [ref=e309]:
            - img "It works ✓" [ref=e312]
            - generic [ref=e313]:
              - generic [ref=e314]: It works ✓
              - generic [ref=e315]: Locally. On your branch.
              - generic [ref=e316]:
                - generic [ref=e317]:
                  - generic [ref=e318]: ★
                  - generic [ref=e319]: ★
                  - generic [ref=e320]: ★
                  - generic [ref=e321]: ★
                  - generic [ref=e322]: ★
                - generic [ref=e323]: "4.6"
                - generic [ref=e324]: (309)
            - generic [ref=e325]:
              - generic [ref=e327]: $3
              - button "plus Add" [ref=e328] [cursor=pointer]:
                - img "plus" [ref=e329]
                - text: Add
          - generic [ref=e331]:
            - img "Production = Staging" [ref=e334]
            - generic [ref=e335]:
              - generic [ref=e336]: Production = Staging
              - generic [ref=e337]: What's the worst that could happen.
              - generic [ref=e338]:
                - generic [ref=e339]:
                  - generic [ref=e340]: ★
                  - generic [ref=e341]: ★
                  - generic [ref=e342]: ★
                  - generic [ref=e343]: ★
                  - generic [ref=e344]: ★
                - generic [ref=e345]: "4.4"
                - generic [ref=e346]: (117)
            - generic [ref=e347]:
              - generic [ref=e349]: $4
              - button "plus Add" [ref=e350] [cursor=pointer]:
                - img "plus" [ref=e351]
                - text: Add
          - generic [ref=e353]:
            - img "Skill issue sticker" [ref=e356]
            - generic [ref=e357]:
              - generic [ref=e358]: Skill issue sticker
              - generic [ref=e359]: Your bug, not mine.
              - generic [ref=e360]:
                - generic [ref=e361]:
                  - generic [ref=e362]: ★
                  - generic [ref=e363]: ★
                  - generic [ref=e364]: ★
                  - generic [ref=e365]: ★
                  - generic [ref=e366]: ★
                - generic [ref=e367]: "4.7"
                - generic [ref=e368]: (244)
            - generic [ref=e369]:
              - generic [ref=e371]: $3
              - button "plus Add" [ref=e372] [cursor=pointer]:
                - img "plus" [ref=e373]
                - text: Add
          - generic [ref=e375]:
            - img "Holographic 'TODO' sticker" [ref=e378]
            - generic [ref=e379]:
              - generic [ref=e380]: Holographic 'TODO' sticker
              - generic [ref=e381]: Forever pending.
              - generic [ref=e382]:
                - generic [ref=e383]:
                  - generic [ref=e384]: ★
                  - generic [ref=e385]: ★
                  - generic [ref=e386]: ★
                  - generic [ref=e387]: ★
                  - generic [ref=e388]: ★
                - generic [ref=e389]: "4.5"
                - generic [ref=e390]: (88)
            - generic [ref=e391]:
              - generic [ref=e393]: $6
              - button "plus Add" [ref=e394] [cursor=pointer]:
                - img "plus" [ref=e395]
                - text: Add
        - generic [ref=e397]:
          - button "‹" [disabled] [ref=e398]
          - button "1" [ref=e399] [cursor=pointer]
          - button "2" [ref=e400] [cursor=pointer]
          - button "3" [ref=e401] [cursor=pointer]
          - button "4" [ref=e402] [cursor=pointer]
          - button "›" [ref=e403] [cursor=pointer]
  - alert [ref=e404]
```

# Test source

```ts
  1   | import { test, expect } from "../../fixtures/base.fixture"
  2   | import { TAG } from "../../support/test-tags"
  3   | 
  4   | test.describe(`Sandbox filters & search ${TAG.regression} ${TAG.sandbox}`, () => {
  5   |   test.beforeEach(async ({ sandboxPage, page }) => {
  6   |     await sandboxPage.goto()
  7   |     await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  8   |   })
  9   | 
  10  |   test("RTC-011 category filter 'duck' shows only duck products", async ({
  11  |     page,
  12  |     sandboxPage,
  13  |   }) => {
  14  |     await sandboxPage.clickFilterCategory("duck")
  15  |     await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  16  |     await expect(page.getByText("It Compiles, Ship It mug")).toBeHidden()
  17  |   })
  18  | 
  19  |   test(`RTC-012 in-stock filter hides out-of-stock items ${TAG.sandboxPlanted}`, async ({
  20  |     page,
  21  |     sandboxPage,
  22  |   }) => {
  23  |     await sandboxPage.setFilterInStockOnly(true)
  24  |     // Correct behavior: at least one in-stock product remains visible.
  25  |     await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  26  |     await expect(page.getByText("404: Coffee Not Found")).toBeHidden()
  27  |   })
  28  | 
  29  |   test("RTC-013 clear filters restores full product list", async ({
  30  |     page,
  31  |     sandboxPage,
  32  |   }) => {
  33  |     await sandboxPage.clickFilterCategory("duck")
  34  |     await sandboxPage.setFilterInStockOnly(true)
  35  |     await sandboxPage.clickFilterClear()
  36  |     await expect(page.getByText("It Compiles, Ship It mug")).toBeVisible()
  37  |   })
  38  | 
  39  |   test(`RTC-014 search narrows product list by name ${TAG.sandboxPlanted}`, async ({
  40  |     sandboxPage,
  41  |     page,
  42  |   }) => {
  43  |     await sandboxPage.searchInput.fill("duck")
> 44  |     await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  45  |     await expect(page.getByText("It Compiles, Ship It mug")).toBeHidden()
  46  |     await sandboxPage.searchInput.clear()
  47  |     await expect(page.getByText("It Compiles, Ship It mug")).toBeVisible()
  48  |   })
  49  | 
  50  |   test("RTC-015 pagination page buttons change the grid", async ({ page }) => {
  51  |     await expect(page.getByTestId("pagination-next")).toBeVisible()
  52  |     const firstVisible = page.getByText("Senior Rubber Duck")
  53  |     await expect(firstVisible).toBeVisible()
  54  |     // Planted vs-07: ‹ › are inert; numbered buttons still paginate.
  55  |     await page.getByRole("button", { name: "2", exact: true }).click()
  56  |     await expect(firstVisible).toBeHidden()
  57  |     await page.getByRole("button", { name: "1", exact: true }).click()
  58  |     await expect(firstVisible).toBeVisible()
  59  |   })
  60  | 
  61  |   test(`CM-74 pagination arrows navigate between pages ${TAG.sandboxPlanted}`, async ({
  62  |     sandboxPage,
  63  |     page,
  64  |   }) => {
  65  |     const firstVisible = page.getByText("Senior Rubber Duck")
  66  |     await expect(firstVisible).toBeVisible()
  67  |     await sandboxPage.paginationNext.click()
  68  |     await expect(firstVisible).toBeHidden()
  69  |     await sandboxPage.paginationPrev.click()
  70  |     await expect(firstVisible).toBeVisible()
  71  |   })
  72  | 
  73  |   test("CM-31 applying filter resets to page 1", async ({
  74  |     page,
  75  |     sandboxPage,
  76  |   }) => {
  77  |     await page.getByRole("button", { name: "2", exact: true }).click()
  78  |     await expect(page.getByText("Senior Rubber Duck")).toBeHidden()
  79  |     await sandboxPage.clickFilterCategory("duck")
  80  |     await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  81  |   })
  82  | 
  83  |   test("CM-27 default page 1 shows exactly 12 product cards", async ({
  84  |     sandboxPage,
  85  |   }) => {
  86  |     await expect(sandboxPage.productCards).toHaveCount(12)
  87  |   })
  88  | 
  89  |   test("CM-08 category All shows 44 results", async ({ sandboxPage, page }) => {
  90  |     await sandboxPage.clickFilterCategory("duck")
  91  |     await sandboxPage.clickFilterCategory("all")
  92  |     // The "44 results" strip lives next to the sort dropdown
  93  |     await expect(page.getByText(/^44\s+results/i).first()).toBeVisible()
  94  |     await expect(sandboxPage.productCards).toHaveCount(12)
  95  |   })
  96  | 
  97  |   test("CM-10 category filter 'mug' shows only mug products", async ({
  98  |     sandboxPage,
  99  |     page,
  100 |   }) => {
  101 |     await sandboxPage.clickFilterCategory("mug")
  102 |     await expect(page.getByText("It Compiles, Ship It mug")).toBeVisible()
  103 |     await expect(page.getByText("Senior Rubber Duck")).toBeHidden()
  104 |   })
  105 | 
  106 |   test("CM-11 price-max filter reduces visible product count", async ({
  107 |     sandboxPage,
  108 |     page,
  109 |   }) => {
  110 |     await sandboxPage.setFilterPriceMaxValue("30")
  111 |     // Count should be less than 44 (products over $30 excluded)
  112 |     await expect(page.getByText(/^44\s+results/)).toBeHidden()
  113 |     // Products ≤ $30 like Senior Rubber Duck ($24) still visible
  114 |     await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  115 |     // Products > $30 like Staff Rubber Duck ($64) not visible
  116 |     await expect(page.getByText("Staff Rubber Duck")).toBeHidden()
  117 |   })
  118 | 
  119 |   test(`CM-63 slider at minimum price excludes premium SKUs ${TAG.sandboxPlanted}`, async ({
  120 |     sandboxPage,
  121 |     page,
  122 |   }) => {
  123 |     await sandboxPage.setFilterPriceMaxValue("5")
  124 |     await expect(page.getByText("Senior Rubber Duck")).toBeHidden()
  125 |   })
  126 | 
  127 |   test(`CM-64 category chips for books and snacks update selection ${TAG.sandboxPlanted}`, async ({
  128 |     sandboxPage,
  129 |     page,
  130 |   }) => {
  131 |     await sandboxPage.clickFilterCategory("duck")
  132 |     await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  133 |     await sandboxPage.clickFilterCategory("book")
  134 |     await expect(page.getByText("Senior Rubber Duck")).toBeHidden()
  135 |     await expect(page.getByText("Clean Code: Eventually")).toBeVisible()
  136 |     await sandboxPage.clickFilterCategory("snack")
  137 |     await expect(page.getByText("Clean Code: Eventually")).toBeHidden()
  138 |     await expect(page.getByText("Cold brew (12-pack)")).toBeVisible()
  139 |   })
  140 | 
  141 |   test("CM-12 rating filter 4.5+ excludes products rated below 4.5", async ({
  142 |     sandboxPage,
  143 |     page,
  144 |   }) => {
```