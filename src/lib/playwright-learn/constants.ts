export const PLAYWRIGHT_LEARN_STORAGE_KEY = "playwrightLearn.progress.v1"

/** Topics present on disk but hidden from the learn catalog (TS + Playwright Test track). */
export const EXCLUDED_PLAYWRIGHT_LEARN_CATALOG_SLUGS = [
  "languages",
  "puppeteer",
  "protractor",
  "selenium-grid",
  "webview2",
] as const
