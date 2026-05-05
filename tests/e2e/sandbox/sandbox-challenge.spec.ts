import type { Page } from "@playwright/test"
import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"

async function openStartChallengeModal(page: Page) {
  await page.getByTestId("sandbox-challenge-cta").click()
  await expect(page.getByRole("dialog")).toBeVisible()
}

async function confirmChallengeStart(page: Page) {
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /start the run|розпочати/i })
    .click()
}

test.describe(`Sandbox QA challenge ${TAG.regression} ${TAG.sandbox}`, () => {
  test.beforeEach(async ({ sandboxPage, page }) => {
    await sandboxPage.goto()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
  })

  test("RTC-023 clicking Start challenge shows confirmation modal", async ({
    page,
  }) => {
    await openStartChallengeModal(page)
    const dlg = page.getByRole("dialog")
    await expect(
      dlg.getByRole("button", { name: /start the run|розпочати/i }),
    ).toBeVisible()
    await expect(
      dlg.getByRole("button", { name: /maybe later|можливо пізніше/i }),
    ).toBeVisible()
  })

  test("RTC-024 confirming challenge shows challenge bar with countdown", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await expect(sandboxPage.timerDisplay).toBeVisible()
    await expect(sandboxPage.challengeFoundCount).toHaveText("0 / 19")
  })

  test("RTC-025 cancel challenge start modal closes without starting", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await page
      .getByRole("dialog")
      .getByRole("button", { name: /maybe later|можливо пізніше/i })
      .click()
    await expect(page.getByRole("dialog")).toBeHidden()
    await expect(sandboxPage.timerDisplay).toBeHidden()
  })

  test("RTC-026 finish early shows results modal", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await expect(sandboxPage.timerDisplay).toBeVisible()
    await sandboxPage.challengeFinishEarly.click()
    const resultsDlg = page.getByRole("dialog")
    await expect(resultsDlg).toBeVisible()
    await expect(resultsDlg.getByText(/of 19 bugs/i)).toBeVisible()
  })

  test("RTC-027 mark bug mode toggle and element click registers bug", async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.markBugButton.click()
    // Bug-marking is a global click handler on the sandbox root, so the
    // target element is intentionally a non-interactive text node — `force`
    // bypasses Playwright's actionability checks that don't apply here.
    await page.getByText("Senior Rubber Duck").first().click({ force: true })
    await expect(page.getByText("Added to the bug list")).toBeVisible()
  })

  test("CM-45 second click on same element de-marks bug", async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.markBugButton.click()
    const target = page.getByText("Senior Rubber Duck").first()
    await target.click({ force: true })
    await expect(sandboxPage.markBugCount).toHaveText("1")
    await sandboxPage.markBugButton.click()
    await target.click({ force: true })
    await expect(sandboxPage.markBugCount).toHaveText("0")
  })

  test("RTC-028 Escape key exits mark-bug mode", async ({ sandboxPage }) => {
    await sandboxPage.markBugButton.click()
    await expect(sandboxPage.markBugButton).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    await sandboxPage.page.keyboard.press("Escape")
    await expect(sandboxPage.markBugButton).not.toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })

  test("RTC-029 auto-test view renders and Back returns to store", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await expect(sandboxPage.timerDisplay).toBeVisible()
    await sandboxPage.challengeFinishEarly.click()
    await page.getByRole("button", { name: /auto|run.*test/i }).click()
    const backBtn = page.getByRole("button", { name: /back/i })
    await expect(backBtn).toBeVisible()
    await backBtn.click()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
  })

  test("CM-80 auto-test view survives page reload", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await expect(sandboxPage.timerDisplay).toBeVisible()
    await sandboxPage.challengeFinishEarly.click()
    await page.getByRole("button", { name: /auto|run.*test/i }).click()

    const reportTitle = page.getByRole("heading", {
      name: /automated test report|звіт автоматичних тестів/i,
    })
    const reportFrame = page.locator(
      'iframe[title="Sandbox auto tests report"]',
    )
    await expect(reportTitle).toBeVisible()
    await expect(reportFrame).toBeVisible({ timeout: 15000 })

    await page.reload()

    await expect(reportTitle).toBeVisible()
    await expect(reportFrame).toBeVisible({ timeout: 15000 })
    await expect(page.getByText("node v20.11 · pnpm 9.4")).toHaveCount(0)
  })

  test("CM-47 click outside #vibe-sandbox-root in mark-bug mode does not register", async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.markBugButton.click()
    await expect(sandboxPage.markBugButton).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    await expect(sandboxPage.markBugCount).toHaveText("0")
    await page.evaluate(() => {
      document.body.dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, button: 0 }),
      )
    })
    await expect(sandboxPage.markBugCount).toHaveText("0")
  })

  test("CM-51 challenge timer renders in MM:SS format", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await expect(sandboxPage.timerDisplay).toBeVisible()
    await expect(sandboxPage.timerDisplay).toHaveText(/15:00|14:59/)
  })

  test("CM-74 mark mode on seeded control bumps found counter", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await sandboxPage.markBugButton.click()
    await page.locator("[data-vibe-bug-id='vs-06']").click({ force: true })
    await expect(sandboxPage.challengeFoundCount).toHaveText("1 / 19")
  })

  test("CM-56 skip on results modal closes modal and resets challenge", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await expect(sandboxPage.timerDisplay).toBeVisible()
    await sandboxPage.challengeFinishEarly.click()
    await expect(sandboxPage.challengeResultsSkip).toBeVisible()
    await sandboxPage.challengeResultsSkip.click()
    await expect(sandboxPage.challengeResultsSkip).toBeHidden()
    await expect(sandboxPage.timerDisplay).toBeHidden()
    await expect(page.getByText("Senior Rubber Duck").first()).toBeVisible()
  })

  test("CM-78 active challenge blocks navigation with leave-confirmation modal", async ({
    page,
    sandboxPage,
  }) => {
    await sandboxPage.goto("uk")
    await expect(page.getByText("Senior гумова качечка").first()).toBeVisible()
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await expect(sandboxPage.timerDisplay).toBeVisible()

    await page
      .getByRole("link", { name: /home|back|додому|назад/i })
      .first()
      .click()

    const leaveDlg = page.getByRole("dialog")
    await expect(leaveDlg).toBeVisible()
    await expect(leaveDlg.getByText(/Вийти з челенджу\?/i)).toBeVisible()
    await expect(
      leaveDlg.getByText(/незавершений пошук багів буде втрачено/i),
    ).toBeVisible()
    await expect(
      leaveDlg.getByRole("button", { name: /Залишитись|stay/i }),
    ).toBeVisible()
    await expect(
      leaveDlg.getByRole("button", { name: /Так, перейти|leave|go/i }),
    ).toBeVisible()

    await leaveDlg.getByRole("button", { name: /Залишитись|stay/i }).click()
    await expect(leaveDlg).toBeHidden()
    await expect(page).toHaveURL(/\/uk\/sandbox/)
    await expect(sandboxPage.timerDisplay).toBeVisible()
  })

  test("CM-79 challenge progress survives page reload", async ({
    page,
    sandboxPage,
  }) => {
    await openStartChallengeModal(page)
    await confirmChallengeStart(page)
    await expect(sandboxPage.timerDisplay).toBeVisible()

    await sandboxPage.markBugButton.click()
    await page.locator("[data-vibe-bug-id='vs-06']").click({ force: true })
    await expect(sandboxPage.challengeFoundCount).toHaveText("1 / 19")
    await expect(sandboxPage.markBugCount).toHaveText("1")

    await page.reload()

    await expect(sandboxPage.timerDisplay).toBeVisible()
    await expect(sandboxPage.challengeFoundCount).toHaveText("1 / 19")
    await expect(sandboxPage.markBugCount).toHaveText("1")
    await expect(sandboxPage.challengeFinishEarly).toBeVisible()
  })
})
