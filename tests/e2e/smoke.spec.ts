import { test, expect } from "../fixtures/base.fixture"
import { TAG } from "../support/test-tags"

test.describe(`Smoke ${TAG.smoke}`, () => {
  test("home page loads and shows name", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("h1")).toBeVisible()
  })

  test("sandbox page loads", async ({ page }) => {
    await page.goto("/sandbox")
    await expect(page).toHaveURL(/sandbox/)
  })
})
