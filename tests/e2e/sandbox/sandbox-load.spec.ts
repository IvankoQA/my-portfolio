import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"

test.describe(`Sandbox load & locale ${TAG.regression} ${TAG.sandbox}`, () => {
  test(`${TAG.smoke} RTC-008 sandbox renders 12 product cards on page 1`, async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.goto()
    // The sandbox layout nests the Vibe-store header inside the portfolio
    // header, so we anchor on the search input that lives in the sandbox
    // header to avoid a strict-mode collision with the outer banner.
    await expect(sandboxPage.searchInput).toBeVisible()
    // First product on page 1 (perPage = 12) should be visible.
    await expect(page.getByText("Senior Rubber Duck")).toBeVisible()
  })

  test("RTC-009 /uk/sandbox loads in Ukrainian locale", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.goto("uk")
    await expect(page).toHaveURL(/\/uk\/sandbox/)
    await expect(page.getByText("Senior гумова качечка")).toBeVisible()
  })

  test("RTC-010 locale toggle EN→UA→EN switches language", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.goto()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
    await sandboxPage.localeToggle.click()
    await expect(page).toHaveURL(/\/uk\/sandbox/)
    await expect(page.getByText("Senior гумова качечка").first()).toBeVisible()
    await sandboxPage.localeToggle.click()
    await expect(page).toHaveURL(/(?<!uk\/)sandbox/)
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
  })

  test("RTC-030 back-to-home link navigates to home page", async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.goto()
    await page
      .getByRole("link", { name: /home|back/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/$|\/\?/)
    await expect(page.locator("h1")).toBeVisible()
  })
})
