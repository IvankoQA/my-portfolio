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
  env: async ({}, useFixture) => {
    await useFixture(readEnv())
  },
  homePage: async ({ page }, useFixture) => {
    await useFixture(new HomePage(page))
  },
  sandboxPage: async ({ page }, useFixture) => {
    await useFixture(new SandboxPage(page))
  },
})

export { expect } from "@playwright/test"
