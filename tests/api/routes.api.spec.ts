import { test, expect } from "../fixtures/base.fixture"
import { TAG } from "../support/test-tags"

/**
 * RTC-036, RTC-037 — public route availability checks
 */
test.describe(`Public routes ${TAG.smoke} ${TAG.regression}`, () => {
  const PUBLIC_ROUTES = ["/", "/uk", "/sandbox", "/uk/sandbox"]

  for (const route of PUBLIC_ROUTES) {
    test(`RTC-036 GET ${route} returns 200`, async ({ request, env }) => {
      const res = await request.get(`${env.baseUrl}${route}`)
      expect(res.status()).toBe(200)
    })
  }

  test("RTC-037 unknown route returns 404", async ({ request, env }) => {
    const res = await request.get(
      `${env.baseUrl}/this-route-does-not-exist-xyz`,
    )
    expect(res.status()).toBe(404)
  })

  test("CV PDF asset is reachable (200)", async ({ request, env }) => {
    const res = await request.get(
      `${env.baseUrl}/cv/CV_Ivan_Kozenko_AQA_Senior.pdf`,
    )
    expect(res.status()).toBe(200)
  })
})
