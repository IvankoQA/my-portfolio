import { test, expect } from "../fixtures/base.fixture"
import { TAG } from "../support/test-tags"

/**
 * API tests for POST /api/jd-match
 * RTC-031, RTC-032, RTC-033, RTC-034, RTC-035
 */
test.describe(`/api/jd-match ${TAG.regression}`, () => {
  const ENDPOINT = "/api/jd-match"

  // JD text that reliably produces skill signals (Playwright/TypeScript keywords)
  const VALID_JD =
    "We need a Senior QA Engineer with Playwright, TypeScript, and API testing experience. " +
    "Cypress or Selenium background is a plus. CI/CD with GitHub Actions required."

  test(`${TAG.smoke} RTC-031 happy path returns 200 with result shape`, async ({
    request,
    env,
  }) => {
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: { text: VALID_JD, lang: "en" },
    })

    expect(res.status()).toBe(200)

    const body = (await res.json()) as Record<string, unknown>

    // RTC-035 contract shape
    expect(typeof body.source).toBe("string")
    expect(body.source).toBe("local")
    expect(body.aiNarrative).toBeNull()

    const result = body.result as Record<string, unknown>
    expect(typeof result.score).toBe("number")
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(typeof result.band).toBe("string")
    expect(["poor", "partial", "solid", "strong"]).toContain(result.band)
    expect(Array.isArray(result.strong)).toBe(true)
    expect(Array.isArray(result.partial)).toBe(true)
    expect(Array.isArray(result.gaps)).toBe(true)
    expect(typeof result.rawScore).toBe("number")
    expect(typeof result.totalSignals).toBe("number")
  })

  test("RTC-031 valid JD produces at least one strong match", async ({
    request,
    env,
  }) => {
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: { text: VALID_JD, lang: "en" },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as { result: { strong: unknown[] } }
    expect(body.result.strong.length).toBeGreaterThan(0)
  })

  test("RTC-032 empty text returns 400 {error:empty}", async ({
    request,
    env,
  }) => {
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: { text: "" },
    })
    expect(res.status()).toBe(400)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.error).toBe("empty")
  })

  test("RTC-032 whitespace-only text returns 400", async ({ request, env }) => {
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: { text: "   \n\t  " },
    })
    expect(res.status()).toBe(400)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.error).toBe("empty")
  })

  test("RTC-033 malformed JSON body returns 400 {error:invalid_json}", async ({
    request,
    env,
  }) => {
    // Sending raw bytes (Buffer) guarantees Playwright forwards the body
    // verbatim instead of re-serializing a string into a JSON-string literal
    // (which would parse successfully and produce {error:empty} instead).
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: Buffer.from("not-valid-json-at-all", "utf-8"),
      headers: { "Content-Type": "application/json" },
    })
    expect(res.status()).toBe(400)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.error).toBe("invalid_json")
  })

  test("RTC-034 no-signals JD returns 422 noSignals", async ({
    request,
    env,
  }) => {
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: { text: "hello world aaaa bbbbb xyz totally random text" },
    })
    expect(res.status()).toBe(422)
    const body = (await res.json()) as Record<string, unknown>
    expect(body.error).toBe("noSignals")
    expect(body.result).toBeDefined()
  })

  test("RTC-035 response body never contains unexpected top-level keys", async ({
    request,
    env,
  }) => {
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: { text: VALID_JD },
    })
    expect(res.status()).toBe(200)
    const body = (await res.json()) as Record<string, unknown>
    const allowed = new Set([
      "source",
      "result",
      "aiNarrative",
      "aiStrongNote",
      "aiPartialGapsNote",
    ])
    const extra = Object.keys(body).filter((k) => !allowed.has(k))
    expect(extra).toHaveLength(0)
  })

  test("RTC-035 Ukrainian lang param accepted without error", async ({
    request,
    env,
  }) => {
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: { text: VALID_JD, lang: "uk" },
    })
    expect(res.status()).toBe(200)
  })

  test("text exceeding 30000 chars is silently truncated and processed", async ({
    request,
    env,
  }) => {
    const longText = VALID_JD.padEnd(35_000, " Playwright TypeScript QA")
    const res = await request.post(`${env.baseUrl}${ENDPOINT}`, {
      data: { text: longText },
    })
    // Should succeed (not 500), truncated at 30k server-side
    expect(res.status()).toBeLessThan(500)
  })
})
