import type { Page } from "@playwright/test"

export class HomePage {
  constructor(readonly page: Page) {}

  async goto(locale?: "en" | "uk") {
    const path = locale === "uk" ? "/uk" : "/"
    await this.page.goto(path)
  }

  get heading() {
    return this.page.getByRole("heading", { level: 1 })
  }

  /** Primary CTA points to the QA challenge/sandbox entry. */
  get sandboxLink() {
    return this.page.getByRole("link", {
      name: /challenge|челендж|тестуваль|playground|пісочниц|sandbox/i,
    })
  }

  get jobFitTextarea() {
    return this.page.getByRole("textbox")
  }

  get analyzeButton() {
    return this.page.getByRole("button", {
      name: /analyze fit|проаналізувати/i,
    })
  }

  /** "Try a sample JD" / "Тестовий JD" — narrowed to avoid matching "Upload .txt". */
  get loadSampleButton() {
    return this.page.getByRole("button", { name: /sample|тестовий/i })
  }

  /** "New JD" / "Новий JD" — replaces the older "Reset" copy. */
  get resetButton() {
    return this.page.getByRole("button", { name: /new\s*jd|новий\s*jd/i })
  }

  get scoreGauge() {
    return this.page.locator('svg[viewBox="0 0 128 128"]')
  }
}
