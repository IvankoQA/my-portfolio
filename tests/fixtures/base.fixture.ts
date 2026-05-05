import { test as base } from "@playwright/test"
import { readEnv, type EnvConfig } from "../common/config/env"
import { HomePage } from "../pages/home/home.page"
import { SandboxPage } from "../pages/sandbox/sandbox.page"

type Fixtures = {
  env: EnvConfig
  homePage: HomePage
  sandboxPage: SandboxPage
}

export const test = base.extend<Fixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: Playwright fixture signature requires destructure param
  env: async ({}, use) => {
    await use(readEnv())
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  sandboxPage: async ({ page }, use) => {
    await use(new SandboxPage(page))
  },
})

export { expect } from "@playwright/test"
