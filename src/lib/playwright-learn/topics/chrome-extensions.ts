import type { PlaywrightTopic } from "../types"

export const chromeExtensionsTopic: PlaywrightTopic = {
  slug: "chrome-extensions",
  groupId: "guides",
  order: 137,
  level: "advanced",
  trackOrder: 22,
  sourceDoc: "chrome-extensions-js-python.md",
  officialDocsUrl: "https://playwright.dev/docs/chrome-extensions",
  title: {
    en: "Chrome extensions",
    uk: "Розширення Chrome",
  },
  summary: {
    en: "How to load and test Chromium extensions with Playwright using a persistent context and extension-specific fixtures.",
    uk: "Як завантажувати й тестувати Chromium-розширення в Playwright через persistent context і спеціальні fixtures.",
  },
  sections: [
    {
      id: "chromium-only",
      title: {
        en: "Chromium only",
        uk: "Тільки Chromium",
      },
      paragraphs: [
        {
          en: "Chrome extension testing is a Chromium-specific scenario. Extensions need a persistent browser context and custom launch arguments that point to the unpacked extension directory.",
          uk: "Тестування Chrome-розширень — це Chromium-specific сценарій. Розширення потребують persistent browser context і launch-аргументів, які вказують на директорію розпакованого розширення.",
        },
        {
          en: "Use the bundled `chromium` channel when loading extensions. Google Chrome and Microsoft Edge removed the command-line flags Playwright needs for side-loading extensions.",
          uk: "Для завантаження розширень використовуйте bundled `chromium` channel. Google Chrome і Microsoft Edge прибрали command-line flags, які Playwright використовує для side-loading розширень.",
        },
      ],
    },
    {
      id: "launch-extension",
      title: {
        en: "Launch an extension",
        uk: "Запуск розширення",
      },
      paragraphs: [
        {
          en: "Launch a persistent context with `--disable-extensions-except` and `--load-extension`. For Manifest V3 extensions, wait for the extension service worker and derive the extension id from its URL.",
          uk: "Запускайте persistent context з `--disable-extensions-except` і `--load-extension`. Для Manifest V3 розширень дочекайтеся service worker розширення й отримайте extension id з його URL.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "ts",
          code: "import { chromium } from '@playwright/test';\nimport path from 'node:path';\n\nconst pathToExtension = path.join(__dirname, 'my-extension');\nconst userDataDir = '/tmp/test-user-data-dir';\n\nconst context = await chromium.launchPersistentContext(userDataDir, {\n  channel: 'chromium',\n  args: [\n    '--disable-extensions-except=' + pathToExtension,\n    '--load-extension=' + pathToExtension,\n  ],\n});\n\nlet [serviceWorker] = context.serviceWorkers();\nif (!serviceWorker) {\n  serviceWorker = await context.waitForEvent('serviceworker');\n}\n\nconst extensionId = serviceWorker.url().split('/')[2];\nawait context.close();",
        },
      ],
    },
    {
      id: "test-fixture",
      title: {
        en: "Create a test fixture",
        uk: "Fixture для тестів",
      },
      paragraphs: [
        {
          en: "For Playwright Test, wrap the persistent context and extension id in fixtures. Tests can then open the extension popup or verify the extension effect on normal pages.",
          uk: "У Playwright Test зручно загорнути persistent context і extension id у fixtures. Тести після цього можуть відкривати popup розширення або перевіряти вплив розширення на звичайні сторінки.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "ts",
          code: "import { test as base, chromium, type BrowserContext } from '@playwright/test';\nimport path from 'node:path';\n\nexport const test = base.extend<{\n  context: BrowserContext;\n  extensionId: string;\n}>({\n  context: async ({}, use) => {\n    const pathToExtension = path.join(__dirname, 'my-extension');\n    const context = await chromium.launchPersistentContext('', {\n      channel: 'chromium',\n      args: [\n        '--disable-extensions-except=' + pathToExtension,\n        '--load-extension=' + pathToExtension,\n      ],\n    });\n\n    await use(context);\n    await context.close();\n  },\n\n  extensionId: async ({ context }, use) => {\n    let [serviceWorker] = context.serviceWorkers();\n    if (!serviceWorker) {\n      serviceWorker = await context.waitForEvent('serviceworker');\n    }\n\n    await use(serviceWorker.url().split('/')[2]);\n  },\n});\n\nexport const expect = test.expect;",
        },
        {
          id: "cb-3",
          language: "ts",
          code: "import { expect, test } from './fixtures';\n\ntest('popup page', async ({ page, extensionId }) => {\n  await page.goto('chrome-extension://' + extensionId + '/popup.html');\n  await expect(page.locator('body')).toHaveText('my-extension popup');\n});",
        },
      ],
    },
  ],
  quiz: [],
}
