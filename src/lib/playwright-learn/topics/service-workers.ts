import type { PlaywrightTopic } from "../types"

export const serviceWorkersTopic: PlaywrightTopic = {
  slug: "service-workers",
  groupId: "guides",
  order: 268,
  sourceDoc: "service-workers-js-python.md",
  officialDocsUrl: "https://playwright.dev/docs/service-workers",
  title: {
    en: "Service Workers",
    uk: "Сервісні воркери",
  },
  summary: {
    en: "How Playwright handles service workers, how to disable them for predictable tests, and how to inspect service-worker-owned network traffic.",
    uk: "Як Playwright працює з service workers, як вимикати їх для передбачуваних тестів і як перевіряти мережеві запити, що належать service worker.",
  },
  sections: [
    {
      id: "when-it-matters",
      title: {
        en: "When it matters",
        uk: "Коли це важливо",
      },
      paragraphs: [
        {
          en: "Service workers can cache assets, proxy fetch requests, and provide offline behavior. Most ordinary end-to-end tests should not need to test the worker directly, but PWA, offline, caching, and network-routing scenarios often do.",
          uk: "Service workers можуть кешувати ресурси, проксувати fetch-запити й забезпечувати offline-поведінку. Звичайні end-to-end тести часто не мають тестувати worker напряму, але для PWA, offline-режимів, кешування й network-routing сценаріїв це буває важливо.",
        },
        {
          en: "If you only need regular network mocking, start with Playwright routing APIs such as `page.route()` or `browserContext.route()` first.",
          uk: "Якщо потрібно лише звичайне мокання мережі, спочатку використовуйте routing API Playwright: `page.route()` або `browserContext.route()`.",
        },
      ],
    },
    {
      id: "disable-service-workers",
      title: {
        en: "Disable service workers",
        uk: "Вимкнення service workers",
      },
      paragraphs: [
        {
          en: "For many test suites, disabling service workers makes network behavior more predictable. Configure this in `use` when the app does not need the worker behavior for the scenario.",
          uk: "У багатьох тестових наборах вимкнення service workers робить мережеву поведінку передбачуванішою. Налаштовуйте це в `use`, якщо сценарію не потрібна поведінка worker.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "ts",
          code: "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  use: {\n    serviceWorkers: 'block',\n  },\n});",
        },
      ],
    },
    {
      id: "wait-for-service-worker",
      title: {
        en: "Wait for activation",
        uk: "Очікування активації",
      },
      paragraphs: [
        {
          en: "Use the browser context to wait for the `serviceworker` event when a page registers a worker. Before evaluating inside the worker, wait until it controls the page.",
          uk: "Використовуйте browser context, щоб дочекатися події `serviceworker`, коли сторінка реєструє worker. Перед виконанням коду всередині worker дочекайтеся, поки він почне контролювати сторінку.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "ts",
          code: "const serviceWorkerPromise = context.waitForEvent('serviceworker');\nawait page.goto('/example-with-a-service-worker.html');\nconst serviceWorker = await serviceWorkerPromise;\n\nawait page.evaluate(async () => {\n  const registration = await navigator.serviceWorker.getRegistration();\n  if (registration?.active?.state === 'activated') return;\n\n  await new Promise<void>((resolve) => {\n    navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {\n      once: true,\n    });\n  });\n});\n\nawait serviceWorker.evaluate(() => self.location.href);",
        },
      ],
    },
    {
      id: "network-events",
      title: {
        en: "Network events",
        uk: "Мережеві події",
      },
      paragraphs: [
        {
          en: "Requests made by a service worker are reported on `browserContext`. For service-worker-owned requests, `request.serviceWorker()` is set and `request.frame()` throws.",
          uk: "Запити, зроблені service worker, видно на рівні `browserContext`. Для запитів, що належать service worker, `request.serviceWorker()` встановлений, а `request.frame()` кидає помилку.",
        },
        {
          en: "This lets you route only service-worker traffic and leave regular page traffic untouched.",
          uk: "Так можна обробляти лише трафік service worker і не чіпати звичайні запити сторінки.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "ts",
          code: "await context.route('**', async (route) => {\n  const request = route.request();\n\n  if (request.serviceWorker()) {\n    await route.fulfill({\n      contentType: 'text/plain',\n      status: 200,\n      body: 'from service worker route',\n    });\n    return;\n  }\n\n  await route.continue();\n});",
        },
      ],
    },
  ],
  quiz: [],
}
