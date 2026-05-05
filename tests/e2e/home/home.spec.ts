import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"

// JD analysis is a backend-heavy operation that legitimately exceeds the
// default 5s expect timeout, so per-assertion overrides are intentional.
const ANALYZE_TIMEOUT_MS = 15_000
const ERROR_PANEL_TIMEOUT_MS = 10_000

test.describe(`Home page ${TAG.regression}`, () => {
  test(`${TAG.smoke} RTC-001 hero section renders with name and CTA`, async ({
    homePage,
  }) => {
    await homePage.goto()
    await expect(homePage.heading).toBeVisible()
    await expect(homePage.heading).toContainText("Ivan")
    await expect(homePage.sandboxLink.first()).toBeVisible()
  })

  test("RTC-002 Ukrainian locale loads on /uk", async ({ homePage, page }) => {
    await homePage.goto("uk")
    await expect(page).toHaveURL(/\/uk/)
    await expect(homePage.heading).toBeVisible()
    await expect(homePage.sandboxLink.first()).toHaveAttribute(
      "href",
      /\/uk\/sandbox/,
    )
  })

  test("RTC-003 analyze button disabled when textarea is empty", async ({
    homePage,
  }) => {
    await homePage.goto()
    await expect(homePage.jobFitTextarea).toBeVisible()
    await expect(homePage.analyzeButton).toBeDisabled()
  })

  test("RTC-004 load sample + analyze shows score gauge", async ({
    homePage,
  }) => {
    await homePage.goto()
    await homePage.loadSampleButton.click()
    await expect(homePage.jobFitTextarea).not.toBeEmpty()
    await homePage.analyzeButton.click()
    await expect(homePage.scoreGauge).toBeVisible({
      timeout: ANALYZE_TIMEOUT_MS,
    })
  })

  test("RTC-005 no-signals JD shows error panel", async ({ homePage }) => {
    await homePage.goto()
    await homePage.jobFitTextarea.fill(
      "aaaa bbbb cccc xyz totally random text here",
    )
    await homePage.analyzeButton.click()
    await expect(homePage.resetButton).toBeVisible({
      timeout: ERROR_PANEL_TIMEOUT_MS,
    })
  })

  test("RTC-006 reset clears results and returns to idle", async ({
    homePage,
  }) => {
    await homePage.goto()
    await homePage.loadSampleButton.click()
    await homePage.analyzeButton.click()
    await expect(homePage.scoreGauge).toBeVisible({
      timeout: ANALYZE_TIMEOUT_MS,
    })
    await homePage.resetButton.first().click()
    await expect(homePage.scoreGauge).toBeHidden()
    await expect(homePage.jobFitTextarea).toBeEmpty()
  })

  test("RTC-007 CV download link has correct href", async ({
    homePage,
    page,
  }) => {
    await homePage.goto()
    const downloadLink = page.getByRole("link", {
      name: /download.*pdf|pdf.*resume/i,
    })
    await expect(downloadLink).toBeVisible()
    await expect(downloadLink).toHaveAttribute(
      "href",
      "/cv/CV_Ivan_Kozenko_AQA_Senior.pdf",
    )
  })
})
