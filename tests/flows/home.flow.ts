import type { Page } from "@playwright/test"
import { HomePage } from "../pages/home/home.page"

export async function navigateToHome(page: Page, locale?: "en" | "uk") {
  const home = new HomePage(page)
  await home.goto(locale)
  return home
}

export async function runJobFitCheck(page: Page, jdText: string) {
  const home = new HomePage(page)
  await home.goto()
  await home.jobFitTextarea.fill(jdText)
  await home.analyzeButton.click()
  return home
}
