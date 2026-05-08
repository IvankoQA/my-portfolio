import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  captureGitInfo: {
    commit: true,
    diff: !!process.env.CI,
  },
  testDir: "./tests",
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 6,
  fullyParallel: true,
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/html", open: "never" }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "off",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: ["e2e/**/*.spec.ts"],
      testIgnore: ["e2e/sandbox/**/*.spec.ts"],
    },
    {
      name: "iphone-15-pro",
      use: { ...devices["iPhone 15 Pro"] },
      testMatch: ["e2e/**/*.spec.ts"],
      testIgnore: ["e2e/sandbox/**/*.spec.ts"],
    },
    {
      name: "sandbox-store",
      use: { ...devices["Desktop Chrome"] },
      testMatch: ["e2e/sandbox/**/*.spec.ts"],
      grep: /@sandbox/,
    },
    {
      name: "sandbox-store-iphone-15-pro",
      use: { ...devices["iPhone 15 Pro"] },
      testMatch: ["e2e/sandbox/**/*.spec.ts"],
      grep: /@sandbox/,
    },
    {
      name: "api",
      use: {},
      testMatch: ["api/**/*.spec.ts"],
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
