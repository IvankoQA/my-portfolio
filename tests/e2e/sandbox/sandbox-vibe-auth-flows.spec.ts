import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"

test.describe(`Sandbox account flows ${TAG.regression} ${TAG.sandbox}`, () => {
  test.beforeEach(async ({ sandboxPage, page }) => {
    await sandboxPage.goto()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
    await page.getByTestId("account-button").click()
    if (await page.getByTestId("auth-logout").isVisible()) {
      await page.getByTestId("auth-logout").click()
    }
  })

  test("CM-70 registration lane shows password autogen control", async ({
    page,
  }) => {
    await page.getByTestId("auth-tab-register").click()
    await expect(page.locator("[data-password-generate]")).toBeVisible()
  })

  test(`CM-77 login lane has no vs-01 bug marker ${TAG.sandboxPlanted}`, async ({
    page,
  }) => {
    // Force an explicit login-lane state so this check is stable
    // even if account panel state leaks between tests.
    await page.getByTestId("auth-tab-login").click()
    await expect(page.locator('[data-vibe-bug-id="vs-01"]')).toHaveCount(0)
  })

  test(`CM-71 registration lane reveals password when toggling ${TAG.sandboxPlanted}`, async ({
    page,
  }) => {
    await page.getByTestId("auth-tab-register").click()
    const pass = page.locator('input[autocomplete="new-password"]').first()
    await expect(pass).toHaveAttribute("type", "password")
    await page.locator("[data-password-toggle]").click()
    await expect(pass).toHaveAttribute("type", "text")
  })

  test(`CM-72 registration lane shows empty-email field hint ${TAG.sandboxPlanted}`, async ({
    page,
  }) => {
    await page.getByTestId("auth-tab-register").click()
    await page.getByPlaceholder(/name/i).fill("Demo")
    await page.locator('input[type="password"]').fill("CorrectHorse1!")
    await page.getByTestId("auth-email").click()
    await page.getByTestId("auth-email").blur()
    await expect(
      page.getByTestId("auth-email").locator("..").locator('[role="alert"]'),
    ).toHaveCount(1)
  })

  test(`CM-73 session handoff accepts fresh credentials on login tab ${TAG.sandboxPlanted}`, async ({
    page,
  }) => {
    const stamp = Date.now()
    const email = `hunt-${stamp}@example.com`
    const password = "CorrectHorse1!"
    await page.getByTestId("auth-tab-register").click()
    await page.getByPlaceholder(/name/i).fill(`QA Hunter ${stamp}`)
    await page.getByTestId("auth-email").fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByTestId("auth-submit-register").click()
    await expect(page.getByText(`QA Hunter ${stamp}`).first()).toBeVisible({
      timeout: 25_000,
    })
    await page.getByTestId("auth-logout").click()
    await page.getByTestId("auth-tab-login").click()
    await page.getByTestId("auth-email").fill(email)
    await page.locator('input[autocomplete="current-password"]').fill(password)
    await page.getByTestId("auth-submit-login").click()
    await expect(page.getByText(`QA Hunter ${stamp}`).first()).toBeVisible({
      timeout: 25_000,
    })
  })

  test(`CM-76 registration role label reflects selected role ${TAG.sandboxPlanted}`, async ({
    page,
  }) => {
    await page.getByTestId("auth-tab-register").click()
    const roleBugBox = page.locator('[data-vibe-bug-id="vs-04"]')
    await roleBugBox.locator("select").selectOption("developer")
    await expect(roleBugBox.locator(":scope > div")).toHaveText(
      /Developer|Розробник/i,
    )
  })
})
