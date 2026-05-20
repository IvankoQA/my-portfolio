import { test as base } from "@playwright/test"
import { readEnv, type EnvConfig } from "../common/config/env"
import { HomePage } from "../pages/home/home.page"
import { PlaywrightLearnUkPage } from "../pages/learn/playwright-learn-uk.page"
import { SandboxPage } from "../pages/sandbox/sandbox.page"

type Fixtures = {
  env: EnvConfig
  homePage: HomePage
  playwrightLearnUkPage: PlaywrightLearnUkPage
  sandboxPage: SandboxPage
}

export const test = base.extend<Fixtures>({
  // biome-ignore lint/correctness/noEmptyPattern: Playwright fixture signature requires destructure param
  env: async ({}, fixtureDone) => {
    await fixtureDone(readEnv())
  },
  homePage: async ({ page }, fixtureDone) => {
    await fixtureDone(new HomePage(page))
  },
  playwrightLearnUkPage: async ({ page }, fixtureDone) => {
    await fixtureDone(new PlaywrightLearnUkPage(page))
  },
  sandboxPage: async ({ page }, fixtureDone) => {
    await fixtureDone(new SandboxPage(page))
  },
})

export { expect } from "@playwright/test"
