import type { Page } from "@playwright/test"

export class SandboxPage {
  constructor(readonly page: Page) {}

  private async ensureFiltersVisible() {
    const drawerTrigger = this.page.getByTestId("filter-drawer-trigger")
    if ((await drawerTrigger.count()) === 0) return
    if (await this.filterCategoryAll.isVisible()) return
    await drawerTrigger.click()
    await this.filterCategoryAll.waitFor({ state: "visible" })
  }

  private async withVisibleFilters(action: () => Promise<void>) {
    const drawerTrigger = this.page.getByTestId("filter-drawer-trigger")
    // Mobile filter controls can switch during hydration (sidebar -> drawer).
    // Wait until at least one stable filter entrypoint is attached.
    await this.page
      .locator(
        '[data-testid="filter-category-all"], [data-testid="filter-drawer-trigger"]',
      )
      .first()
      .waitFor({ state: "attached" })

    if ((await drawerTrigger.count()) === 0) {
      await action()
      return
    }

    let lastError: unknown
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await this.ensureFiltersVisible()
        await action()
        return
      } catch (error) {
        lastError = error
        if (attempt === 1) break
        // Retry once in case drawer state desynced during transitions.
        await drawerTrigger.click()
        await this.filterCategoryAll.waitFor({ state: "visible" })
      }
    }

    throw lastError
  }

  async goto(locale?: "en" | "uk") {
    const path = locale === "uk" ? "/uk/sandbox" : "/sandbox"
    await this.page.goto(path)
  }

  get searchInput() {
    return this.page.getByTestId("sandbox-search").first()
  }

  get cartButton() {
    return this.page.getByTestId("cart-button").first()
  }

  get productCards() {
    return this.page.locator('[data-testid^="product-card"]')
  }

  get productRows() {
    return this.page.locator('[data-testid^="product-row"]')
  }

  get addToCartButtons() {
    return this.page.locator('[data-testid^="add-to-cart"]')
  }

  get challengeModal() {
    return this.page.locator('[role="dialog"]')
  }

  get timerDisplay() {
    return this.page.getByTestId("challenge-timer")
  }

  get markBugButton() {
    return this.page.getByTestId("mark-bug-toggle").first()
  }

  get markBugCount() {
    return this.page
      .locator('[title="Elements you marked on the page"]')
      .first()
  }

  get localeToggle() {
    return this.page.getByTestId("locale-toggle").first()
  }

  get themeToggle() {
    return this.page.getByTestId("theme-toggle").first()
  }

  get sortSelect() {
    return this.page.getByTestId("sort-select")
  }

  get viewGridBtn() {
    return this.page.getByTestId("view-grid")
  }

  get viewListBtn() {
    return this.page.getByTestId("view-list")
  }

  get paginationNext() {
    return this.page.getByTestId("pagination-next")
  }

  get paginationPrev() {
    return this.page.getByTestId("pagination-prev")
  }

  get chatButton() {
    return this.page.getByTestId("chat-button").first()
  }

  get chatDrawer() {
    return this.page.getByTestId("chat-drawer")
  }

  get chatMessageInput() {
    return this.page.getByTestId("chat-message-input")
  }

  get filterCategoryAll() {
    return this.page.getByTestId("filter-category-all")
  }

  get filterCategoryDuck() {
    return this.page.getByTestId("filter-category-duck")
  }

  get filterCategoryMug() {
    return this.page.getByTestId("filter-category-mug")
  }

  get filterPriceMax() {
    return this.page.getByTestId("filter-price-max")
  }

  filterRating(value: string) {
    return this.page.getByTestId(`filter-rating-${value}`)
  }

  get filterClear() {
    return this.page.getByTestId("filter-clear")
  }

  get filterCategoryBook() {
    return this.page.getByTestId("filter-category-book")
  }

  get filterCategorySnack() {
    return this.page.getByTestId("filter-category-snack")
  }

  get drawerClose() {
    return this.page.getByTestId("drawer-close")
  }

  get filterInStockOnly() {
    return this.page.getByTestId("filter-in-stock-only")
  }

  get challengeFinishEarly() {
    return this.page.getByTestId("challenge-finish-early")
  }

  get challengeFoundCount() {
    return this.page.getByTestId("challenge-found-count")
  }

  get challengeResultsSkip() {
    return this.page.getByTestId("challenge-results-skip")
  }

  /** Sets the price-max range input for React controlled components. */
  async setFilterPriceMaxValue(value: string) {
    await this.withVisibleFilters(async () => {
      await this.filterPriceMax.evaluate((el: HTMLInputElement, v: string) => {
        const nativeSet = Object.getOwnPropertyDescriptor(
          globalThis.HTMLInputElement.prototype,
          "value",
        )?.set
        nativeSet?.call(el, v)
        el.dispatchEvent(new Event("input", { bubbles: true }))
        el.dispatchEvent(new Event("change", { bubbles: true }))
      }, value)
    })
  }

  async clickFilterCategory(
    category: "all" | "duck" | "mug" | "book" | "snack",
  ) {
    await this.withVisibleFilters(async () => {
      await this.page.getByTestId(`filter-category-${category}`).first().click()
    })
  }

  async setFilterInStockOnly(checked: boolean) {
    await this.withVisibleFilters(async () => {
      if (checked) {
        await this.filterInStockOnly.check()
        return
      }
      await this.filterInStockOnly.uncheck()
    })
  }

  async clickFilterClear() {
    await this.withVisibleFilters(async () => {
      await this.filterClear.click()
    })
  }

  async clickFilterRating(value: string) {
    await this.withVisibleFilters(async () => {
      await this.filterRating(value).click()
    })
  }
}
