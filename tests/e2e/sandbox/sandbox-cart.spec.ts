import type { Page } from "@playwright/test"
import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"

/** Cart drawer panel (sibling of the full-screen scrim). */
function cartPanel(page: Page) {
  return page.locator('[aria-label="Close drawer"]').locator("+ div")
}

async function addFirstToCart(page: Page) {
  await page
    .getByRole("button", { name: /add to cart|add/i })
    .first()
    .click()
}

async function openCart(page: Page) {
  await page.getByTestId("cart-button").first().click()
}

test.describe(`Sandbox cart ${TAG.regression} ${TAG.sandbox}`, () => {
  test.beforeEach(async ({ sandboxPage, page }) => {
    await sandboxPage.goto()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
  })

  test("RTC-016 add to cart shows item in cart drawer", async ({ page }) => {
    await addFirstToCart(page)
    await openCart(page)
    await expect(cartPanel(page).getByText(/\$24\s*×\s*1/)).toBeVisible()
  })

  test("RTC-017 increment qty updates subtotal", async ({ page }) => {
    await addFirstToCart(page)
    await openCart(page)
    await cartPanel(page).getByRole("button", { name: "+" }).click()
    await expect(cartPanel(page).getByText(/\$24\s*×\s*2/)).toBeVisible()
    await expect(cartPanel(page).getByText("$48.00").first()).toBeVisible()
  })

  test("RTC-018 remove item empties the cart", async ({ page }) => {
    await page.getByTestId("add-to-cart-p01").click()
    await openCart(page)
    await page.getByTestId("cart-remove-p01").click()
    await expect(
      cartPanel(page).getByText("Cart is suspiciously empty."),
    ).toBeVisible()
  })

  test(`RTC-019 promo VIBES10 applies 10% discount ${TAG.sandboxPlanted}`, async ({
    page,
  }) => {
    await addFirstToCart(page)
    await openCart(page)
    const promoInput = cartPanel(page).locator(
      'input[placeholder*="VIBES10" i], input[placeholder*="promo" i]',
    )
    await promoInput.fill("VIBES10")
    await cartPanel(page).getByRole("button", { name: /apply/i }).click()
    await expect(
      cartPanel(page).getByText(/VIBES10 · −10% applied/),
    ).toBeVisible()
  })

  test(`RTC-020 invalid promo code is rejected ${TAG.sandboxPlanted}`, async ({
    page,
  }) => {
    await addFirstToCart(page)
    await openCart(page)
    const promoInput = cartPanel(page).locator(
      'input[placeholder*="VIBES10" i], input[placeholder*="promo" i]',
    )
    await promoInput.fill("FAKECODE")
    await cartPanel(page).getByRole("button", { name: /apply/i }).click()
    await expect(cartPanel(page).getByText(/FAKECODE ·/)).toHaveCount(0)
  })

  test("RTC-021 cart persists across page reload", async ({ page }) => {
    await addFirstToCart(page)
    await page.reload()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
    await openCart(page)
    await expect(cartPanel(page).getByText(/\$24\s*×\s*1/)).toBeVisible()
  })

  test("CM-34 decrement qty to zero removes line from cart", async ({
    page,
    sandboxPage,
  }) => {
    await page.getByTestId("add-to-cart-p01").click()
    await sandboxPage.cartButton.click()
    await cartPanel(page).getByRole("button", { name: "−" }).click()
    await expect(
      cartPanel(page).getByText("Cart is suspiciously empty."),
    ).toBeVisible()
  })

  test("CM-39 empty cart shows empty state before any add-to-cart", async ({
    page,
    sandboxPage,
  }) => {
    await page.evaluate(() =>
      localStorage.removeItem("vibe_sandbox_checkout_v1"),
    )
    await page.reload()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
    await sandboxPage.cartButton.click()
    await expect(
      cartPanel(page).getByText("Cart is suspiciously empty."),
    ).toBeVisible()
  })

  test("RTC-022 out-of-stock product add-to-cart is disabled", async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.clickFilterCategory("mug")
    await expect(page.getByTestId("product-card-p11")).toBeVisible()
    await expect(page.getByTestId("add-to-cart-p11")).toBeDisabled()
  })

  test(`CM-66 checkout copy is localized for UA storefront ${TAG.sandboxPlanted}`, async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.goto("uk")
    await page.getByTestId("add-to-cart-p01").click()
    await sandboxPage.cartButton.click()
    const panel = cartPanel(page)
    await expect(panel.getByText("Сума")).toBeVisible()
    await expect(panel.getByText("До оплати (не насправді)")).toBeVisible()
  })

  test(`CM-67 removing one SKU removes exactly that line ${TAG.sandboxPlanted}`, async ({
    page,
    sandboxPage,
  }) => {
    await page.getByTestId("add-to-cart-p01").click()
    await page.getByTestId("add-to-cart-p02").click()
    await sandboxPage.cartButton.click()
    const panel = cartPanel(page)
    await expect(panel.getByText(/Senior Rubber Duck/)).toBeVisible()
    await expect(panel.getByText(/Junior Rubber Duck/)).toBeVisible()
    await panel.getByTestId("cart-remove-p01").click()
    await expect(panel.getByText(/Senior Rubber Duck/)).toBeHidden()
    await expect(panel.getByText(/Junior Rubber Duck/)).toBeVisible()
  })

  test(`CM-68 cart drawer close works on first activation ${TAG.sandboxPlanted}`, async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.goto()
    await sandboxPage.cartButton.click()
    await expect(cartPanel(page)).toBeVisible()
    await sandboxPage.drawerClose.click()
    await expect(cartPanel(page)).toBeHidden()
  })
})
