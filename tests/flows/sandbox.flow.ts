import type { Page } from "@playwright/test"
import { SandboxPage } from "../pages/sandbox/sandbox.page"

export async function navigateToSandbox(page: Page, locale?: "en" | "uk") {
  const sandbox = new SandboxPage(page)
  await sandbox.goto(locale)
  return sandbox
}

export async function addFirstProductToCart(page: Page) {
  const sandbox = new SandboxPage(page)
  await sandbox.goto()
  const firstAdd = sandbox.addToCartButtons.first()
  await firstAdd.click()
  return sandbox
}
