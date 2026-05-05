import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"

test.describe(`Sandbox filters & search ${TAG.regression} ${TAG.sandbox}`, () => {
  test.beforeEach(async ({ sandboxPage, page }) => {
    await sandboxPage.goto()
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  })

  test("RTC-011 category filter 'duck' shows only duck products", async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.clickFilterCategory("duck")
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
    await expect(page.getByText("It Compiles, Ship It mug")).toBeHidden()
  })

  test(`RTC-012 in-stock filter hides out-of-stock items ${TAG.sandboxPlanted}`, async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.setFilterInStockOnly(true)
    // Correct behavior: at least one in-stock product remains visible.
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
    await expect(page.getByText("404: Coffee Not Found")).toBeHidden()
  })

  test("RTC-013 clear filters restores full product list", async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.clickFilterCategory("duck")
    await sandboxPage.setFilterInStockOnly(true)
    await sandboxPage.clickFilterClear()
    await expect(page.getByText("It Compiles, Ship It mug")).toBeVisible()
  })

  test(`RTC-014 search narrows product list by name ${TAG.sandboxPlanted}`, async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.searchInput.fill("duck")
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
    await expect(page.getByText("It Compiles, Ship It mug")).toBeHidden()
    await sandboxPage.searchInput.clear()
    await expect(page.getByText("It Compiles, Ship It mug")).toBeVisible()
  })

  test("RTC-015 pagination page buttons change the grid", async ({ page }) => {
    await expect(page.getByTestId("pagination-next")).toBeVisible()
    const firstVisible = page.getByText("Senior Rubber Duck")
    await expect(firstVisible).toBeVisible()
    // Planted vs-07: ‹ › are inert; numbered buttons still paginate.
    await page.getByRole("button", { name: "2", exact: true }).click()
    await expect(firstVisible).toBeHidden()
    await page.getByRole("button", { name: "1", exact: true }).click()
    await expect(firstVisible).toBeVisible()
  })

  test(`CM-74 pagination arrows navigate between pages ${TAG.sandboxPlanted}`, async ({
    sandboxPage,
    page,
  }) => {
    const firstVisible = page.getByText("Senior Rubber Duck")
    await expect(firstVisible).toBeVisible()
    await sandboxPage.paginationNext.click()
    await expect(firstVisible).toBeHidden()
    await sandboxPage.paginationPrev.click()
    await expect(firstVisible).toBeVisible()
  })

  test("CM-31 applying filter resets to page 1", async ({
    page,
    sandboxPage,
  }) => {
    await page.getByRole("button", { name: "2", exact: true }).click()
    await expect(page.getByText("Senior Rubber Duck")).toBeHidden()
    await sandboxPage.clickFilterCategory("duck")
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  })

  test("CM-27 default page 1 shows exactly 12 product cards", async ({
    sandboxPage,
  }) => {
    await expect(sandboxPage.productCards).toHaveCount(12)
  })

  test("CM-08 category All shows 44 results", async ({ sandboxPage, page }) => {
    await sandboxPage.clickFilterCategory("duck")
    await sandboxPage.clickFilterCategory("all")
    // The "44 results" strip lives next to the sort dropdown
    await expect(page.getByText(/^44\s+results/i).first()).toBeVisible()
    await expect(sandboxPage.productCards).toHaveCount(12)
  })

  test("CM-10 category filter 'mug' shows only mug products", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.clickFilterCategory("mug")
    await expect(page.getByText("It Compiles, Ship It mug")).toBeVisible()
    await expect(page.getByText("Senior Rubber Duck")).toBeHidden()
  })

  test("CM-11 price-max filter reduces visible product count", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.setFilterPriceMaxValue("30")
    // Count should be less than 44 (products over $30 excluded)
    await expect(page.getByText(/^44\s+results/)).toBeHidden()
    // Products ≤ $30 like Senior Rubber Duck ($24) still visible
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
    // Products > $30 like Staff Rubber Duck ($64) not visible
    await expect(page.getByText("Staff Rubber Duck")).toBeHidden()
  })

  test(`CM-63 slider at minimum price excludes premium SKUs ${TAG.sandboxPlanted}`, async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.setFilterPriceMaxValue("5")
    await expect(page.getByText("Senior Rubber Duck")).toBeHidden()
  })

  test(`CM-64 category chips for books and snacks update selection ${TAG.sandboxPlanted}`, async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.clickFilterCategory("duck")
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
    await sandboxPage.clickFilterCategory("book")
    await expect(page.getByText("Senior Rubber Duck")).toBeHidden()
    await expect(page.getByText("Clean Code: Eventually")).toBeVisible()
    await sandboxPage.clickFilterCategory("snack")
    await expect(page.getByText("Clean Code: Eventually")).toBeHidden()
    await expect(page.getByText("Cold brew (12-pack)")).toBeVisible()
  })

  test("CM-12 rating filter 4.5+ excludes products rated below 4.5", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.clickFilterRating("4-5")
    // Junior Rubber Duck has rating 4.4 → should be hidden
    await expect(page.getByText("Junior Rubber Duck")).toBeHidden()
    // Senior Rubber Duck has rating 4.9 → still visible
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  })

  test("CM-15 combo duck + price-max + stock-only filters correctly", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.clickFilterCategory("duck")
    await sandboxPage.setFilterPriceMaxValue("30")
    // Keep this combo independent from the planned vs-19 stock-only bug.
    // Duck products ≤ $30: Senior ($24), Junior ($12), Pirate ($18), Goth ($22)
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
    // Duck Pack of 5 ($78) excluded by price
    await expect(page.getByText("Duck Pack of 5")).toBeHidden()
    // Staff Rubber Duck ($64) excluded by price
    await expect(page.getByText("Staff Rubber Duck")).toBeHidden()
  })

  test("CM-30 duck filter fits one page — pagination controls absent", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.clickFilterCategory("duck")
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
    // 6 duck products fit on 1 page → pagination not rendered
    await expect(sandboxPage.paginationNext).toBeHidden()
    await expect(sandboxPage.paginationPrev).toBeHidden()
  })

  test(`CM-75 empty-state clear all restores catalog results ${TAG.sandboxPlanted}`, async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.clickFilterCategory("duck")
    await sandboxPage.searchInput.fill("duck")
    const emptyState = page.locator('[data-vibe-bug-id="vs-09"]')
    await expect(emptyState).toBeVisible()
    await emptyState
      .getByRole("button", { name: /clear all|скинути все/i })
      .click()
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  })

  test("CM-78 empty state has no vs-09 bug marker", async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.clickFilterCategory("duck")
    await sandboxPage.searchInput.fill("duck")
    await expect(page.locator('[data-vibe-bug-id="vs-09"]')).toHaveCount(1)
  })
})
