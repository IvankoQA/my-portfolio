import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"

test.describe(`Sandbox store UI ${TAG.regression} ${TAG.sandbox}`, () => {
  test.beforeEach(async ({ sandboxPage, page }) => {
    await sandboxPage.goto()
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  })

  test("CM-04 theme toggle updates data-theme on documentElement", async ({
    sandboxPage,
    page,
  }) => {
    const html = page.locator("html")
    // `data-theme` is hydrated by next-themes after mount, so the initial
    // value may be "", "light", or "dark" depending on prefers-color-scheme.
    // Wait until the attribute settles to a known value before clicking.
    await expect(html).toHaveAttribute("data-theme", /^(light|dark)$/)
    const before = await html.getAttribute("data-theme")
    const opposite = before === "dark" ? "light" : "dark"
    await sandboxPage.themeToggle.click()
    await expect(html).toHaveAttribute("data-theme", opposite)
  })

  test("CM-17 list view shows product rows; grid view shows product cards", async ({
    sandboxPage,
  }) => {
    await sandboxPage.viewListBtn.click()
    await expect(sandboxPage.productRows).toHaveCount(12)
    await expect(sandboxPage.productCards).toHaveCount(0)
    await sandboxPage.viewGridBtn.click()
    await expect(sandboxPage.productCards).toHaveCount(12)
    await expect(sandboxPage.productRows).toHaveCount(0)
  })

  test("CM-19 CM-20 sale and new badges render for known product ids", async ({
    page,
  }) => {
    await expect(page.getByTestId("product-badge-sale-p01")).toBeVisible()
    await expect(page.getByTestId("product-badge-new-p10")).toBeVisible()
  })

  test(`CM-23 sort price low→high lane orders page-one slice ${TAG.sandboxPlanted}`, async ({
    sandboxPage,
  }) => {
    await sandboxPage.sortSelect.selectOption("priceAsc")
    await expect(sandboxPage.productCards.first()).toContainText(
      "Holographic 'TODO' sticker",
    )
  })

  test("CM-24 sort price high→low puts most expensive item first on page 1", async ({
    sandboxPage,
  }) => {
    await sandboxPage.sortSelect.selectOption("priceDesc")
    await expect(sandboxPage.productCards.first()).toContainText("Standup")
  })

  test("CM-25 sort by rating puts a top-rated product first on page 1", async ({
    sandboxPage,
  }) => {
    await sandboxPage.sortSelect.selectOption("rating")
    // p06 (Duck Pack of 5) and p43 share rating 5.0; stable sort preserves
    // catalog order, so the earlier index (p06) lands on top.
    await expect(sandboxPage.productCards.first()).toContainText(
      "Duck Pack of 5",
    )
  })

  test("CM-26 sort new lists Espresso & Exceptions first among new items", async ({
    sandboxPage,
  }) => {
    await sandboxPage.sortSelect.selectOption("new")
    await expect(sandboxPage.productCards.first()).toContainText(
      "Espresso & Exceptions",
    )
  })

  test("CM-42 chat button opens drawer with message input", async ({
    sandboxPage,
  }) => {
    await sandboxPage.chatButton.click()
    await expect(sandboxPage.chatDrawer).toBeVisible()
    await expect(sandboxPage.chatMessageInput).toBeVisible()
  })

  test("CM-78 opening account or cart closes chat drawer", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.chatButton.click()
    await expect(sandboxPage.chatDrawer).toBeVisible()

    await page.getByTestId("account-button").first().click()
    await expect(sandboxPage.chatDrawer).toBeHidden()
    await expect(page.getByTestId("auth-tab-login")).toBeVisible()
    await page.getByTestId("drawer-close").click()

    await sandboxPage.chatButton.click()
    await expect(sandboxPage.chatDrawer).toBeVisible()

    await sandboxPage.cartButton.click()
    await expect(sandboxPage.chatDrawer).toBeHidden()
    await expect(page.getByTestId("drawer-close")).toBeVisible()
  })
})
