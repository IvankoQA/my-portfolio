import { test, expect } from "../fixtures/base.fixture"
import { TAG } from "../support/test-tags"
import {
  allUkLearnPlaywrightPaths,
  UK_LEARN_PLAYWRIGHT_INDEX,
  ukLearnQuizPath,
  ukLearnTopicPath,
} from "../support/playwright-learn-urls"

test.describe(`UK learn Playwright routes ${TAG.api} ${TAG.learn} ${TAG.regression}`, () => {
  test(`${TAG.smoke} GET ${UK_LEARN_PLAYWRIGHT_INDEX} returns 200 HTML with Ukrainian title`, async ({
    request,
    env,
  }) => {
    const res = await request.get(`${env.baseUrl}${UK_LEARN_PLAYWRIGHT_INDEX}`)
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"] ?? "").toMatch(/text\/html/i)
    const html = await res.text()
    expect(html).toContain("Нотатки та тести з Playwright")
    expect(html).toContain("Навчальні треки")
  })

  test(`${TAG.smoke} GET intro topic and quiz return 200`, async ({
    request,
    env,
  }) => {
    const topicRes = await request.get(
      `${env.baseUrl}${ukLearnTopicPath("intro")}`,
    )
    expect(topicRes.status()).toBe(200)
    const topicHtml = await topicRes.text()
    expect(topicHtml).toContain("Вступ до Playwright")

    const quizRes = await request.get(
      `${env.baseUrl}${ukLearnQuizPath("intro")}`,
    )
    expect(quizRes.status()).toBe(200)
    const quizHtml = await quizRes.text()
    expect(quizHtml).toMatch(/квіз|тест/i)
  })

  test("GET unknown topic slug returns 404", async ({ request, env }) => {
    const res = await request.get(
      `${env.baseUrl}${ukLearnTopicPath("this-slug-does-not-exist-xyz")}`,
    )
    expect(res.status()).toBe(404)
  })

  test("GET unknown quiz slug returns 404", async ({ request, env }) => {
    const res = await request.get(
      `${env.baseUrl}${ukLearnQuizPath("this-slug-does-not-exist-xyz")}`,
    )
    expect(res.status()).toBe(404)
  })

  for (const path of allUkLearnPlaywrightPaths()) {
    test(`GET ${path} returns 200`, async ({ request, env }) => {
      const res = await request.get(`${env.baseUrl}${path}`)
      expect(res.status()).toBe(200)
      expect(res.headers()["content-type"] ?? "").toMatch(/text\/html/i)
    })
  }
})
