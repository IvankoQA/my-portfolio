import { test, expect } from "../../fixtures/base.fixture"
import { TAG } from "../../support/test-tags"
import { ukLearnTopicPath } from "../../support/playwright-learn-urls"

test.describe(`UK learn Playwright ${TAG.learn} ${TAG.regression}`, () => {
  test(`${TAG.smoke} index shows Ukrainian hero and track sections`, async ({
    playwrightLearnUkPage: learn,
    page,
  }) => {
    await learn.gotoIndex()
    await expect(page).toHaveURL(/\/uk\/learn\/playwright\/?$/)
    await expect(learn.heading).toHaveText(/Нотатки та тести з Playwright/)
    await expect(learn.tracksHeading).toBeVisible()
    await expect(learn.modulesHeading).toBeVisible()
    await expect(learn.introTopicLink("intro")).toBeVisible()
  })

  test(`${TAG.smoke} intro topic → quiz → back to topic flow`, async ({
    playwrightLearnUkPage: learn,
    page,
  }) => {
    await learn.gotoIndex()
    await learn.introTopicLink("intro").click()
    await expect(page).toHaveURL(/\/uk\/learn\/playwright\/intro\/?$/)
    await expect(learn.heading).toHaveText(/Вступ до Playwright/)
    await expect(learn.takeQuizLink).toBeVisible()

    await learn.takeQuizLink.click()
    await expect(page).toHaveURL(/\/uk\/learn\/playwright\/intro\/quiz\/?$/)
    await expect(learn.quizSubmitButton).toBeVisible()

    await learn.quizBackToTopicLink.click()
    await expect(page).toHaveURL(/\/uk\/learn\/playwright\/intro\/?$/)
    await expect(learn.heading).toHaveText(/Вступ до Playwright/)
  })

  test("index quiz link opens intro quiz directly", async ({
    playwrightLearnUkPage: learn,
    page,
  }) => {
    await learn.gotoIndex()
    await learn.introQuizLink("intro").click()
    await expect(page).toHaveURL(/\/uk\/learn\/playwright\/intro\/quiz\/?$/)
    await expect(learn.quizSubmitButton).toBeVisible()
  })

  test("topic back link returns to UK learn index", async ({
    playwrightLearnUkPage: learn,
    page,
  }) => {
    await learn.gotoTopic("intro")
    await learn.backToIndexLink.click()
    await expect(page).toHaveURL(/\/uk\/learn\/playwright\/?$/)
    await expect(learn.heading).toHaveText(/Нотатки та тести з Playwright/)
  })

  test("unknown topic shows Next.js not-found page", async ({ page }) => {
    await page.goto(ukLearnTopicPath("not-a-real-topic-slug-xyz"))
    await expect(page.getByRole("heading", { name: /404/i })).toBeVisible()
  })
})
