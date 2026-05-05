import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"

test.describe(`Sandbox support chat ${TAG.regression} ${TAG.sandbox}`, () => {
  test.beforeEach(async ({ sandboxPage, page }) => {
    await sandboxPage.goto()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
  })

  test(`RTC-070 second customer message yields a normal bot reply ${TAG.sandboxPlanted}`, async ({
    sandboxPage,
    page,
  }) => {
    await sandboxPage.chatButton.click()
    await sandboxPage.chatMessageInput.fill("hello")
    await page.getByTestId("chat-send").click()
    await expect(page.getByText("hello")).toBeVisible()
    await sandboxPage.chatMessageInput.fill("follow-up")
    await page.getByTestId("chat-send").click()
    await expect(
      sandboxPage.chatDrawer.locator(":scope > div:nth-of-type(2) > div"),
    ).toHaveCount(5)
    await expect(page.locator('[data-vibe-bug-id="vs-15"]')).toHaveCount(0)
  })

  test(`CM-69 chat chrome keeps neutral panel backgrounds ${TAG.sandboxPlanted}`, async ({
    sandboxPage,
  }) => {
    await sandboxPage.chatButton.click()
    const drawer = sandboxPage.chatDrawer
    await expect(drawer).toBeVisible()
    await expect(drawer.locator('[data-vibe-bug-id="vs-16"]')).toHaveCount(0)
  })
})
