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
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Why can't you test Chrome extensions with Google Chrome or Microsoft Edge in Playwright?",
        uk: "Чому не можна тестувати Chrome-розширення з Google Chrome або Microsoft Edge у Playwright?",
      },
      options: [
        { id: "a", label: { en: "Those browsers don't support extensions at all.", uk: "Ці браузери взагалі не підтримують розширення." } },
        { id: "b", label: { en: "They removed the command-line flags Playwright needs to side-load an unpacked extension.", uk: "Вони прибрали command-line flags, потрібні Playwright для завантаження розпакованого розширення." } },
        { id: "c", label: { en: "Playwright only supports Chromium for all testing scenarios.", uk: "Playwright підтримує лише Chromium для всіх сценаріїв тестування." } },
        { id: "d", label: { en: "Extensions require a persistent context which only Chromium provides.", uk: "Розширення потребують persistent context, який надає лише Chromium." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Google Chrome and Microsoft Edge removed `--disable-extensions-except` and `--load-extension` support. Those flags are how Playwright side-loads an unpacked extension. Bundled Chromium still supports them, so you use `channel: 'chromium'` in `launchPersistentContext`.",
        uk: "Google Chrome і Microsoft Edge прибрали підтримку `--disable-extensions-except` і `--load-extension`. Саме через ці прапори Playwright завантажує розпакований extension. Bundled Chromium їх підтримує, тому використовують `channel: 'chromium'` у `launchPersistentContext`.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Which browser launch method is required when testing extensions, and why?",
        uk: "Який метод запуску браузера потрібен при тестуванні розширень і чому?",
      },
      options: [
        { id: "a", label: { en: "`browser.newContext()` — it supports extra launch arguments.", uk: "`browser.newContext()` — він підтримує додаткові launch-аргументи." } },
        { id: "b", label: { en: "`chromium.launch()` with `args` — standard launch with custom flags.", uk: "`chromium.launch()` з `args` — стандартний запуск з прапорами." } },
        { id: "c", label: { en: "`chromium.launchPersistentContext()` — extensions require a persistent user data directory.", uk: "`chromium.launchPersistentContext()` — розширення потребують persistent user data directory." } },
        { id: "d", label: { en: "`chromium.connect()` — extensions are loaded via a remote browser.", uk: "`chromium.connect()` — розширення завантажуються через віддалений браузер." } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "Chrome extensions run in a persistent browser context tied to a user data directory. `launchPersistentContext` creates that context and accepts the `--load-extension` and `--disable-extensions-except` flags needed to load the unpacked extension.",
        uk: "Chrome-розширення працюють у persistent browser context, прив'язаному до user data directory. `launchPersistentContext` створює цей контекст і приймає прапори `--load-extension` і `--disable-extensions-except`, потрібні для завантаження розпакованого розширення.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "How do you obtain the extension ID for a Manifest V3 extension after launching the context?",
        uk: "Як отримати extension ID для розширення Manifest V3 після запуску контексту?",
      },
      options: [
        { id: "a", label: { en: "Read it from the extension's `manifest.json` file.", uk: "Прочитати його з файлу `manifest.json` розширення." } },
        { id: "b", label: { en: "Wait for the extension service worker event and parse the ID from its URL.", uk: "Дочекатися події service worker розширення й отримати ID з його URL." } },
        { id: "c", label: { en: "Call `context.extensionId()` after the context is created.", uk: "Викликати `context.extensionId()` після створення контексту." } },
        { id: "d", label: { en: "Read the `chrome.runtime.id` via `page.evaluate()`.", uk: "Прочитати `chrome.runtime.id` через `page.evaluate()`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "For MV3 extensions, the background service worker URL has the form `chrome-extension://<extensionId>/...`. Wait for the `serviceworker` event on the context, then call `.url().split('/')[2]` to extract the ID. There is no `context.extensionId()` API.",
        uk: "Для MV3 розширень URL фонового service worker має форму `chrome-extension://<extensionId>/...`. Чекайте на подію `serviceworker` контексту, потім викличте `.url().split('/')[2]` щоб отримати ID. API `context.extensionId()` не існує.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What are the two required `args` you must pass to `launchPersistentContext` to load an unpacked extension?",
        uk: "Які два обов'язкові `args` потрібно передати в `launchPersistentContext` для завантаження розпакованого розширення?",
      },
      options: [
        { id: "a", label: { en: "`--enable-extensions` and `--extension-path`", uk: "`--enable-extensions` і `--extension-path`" } },
        { id: "b", label: { en: "`--load-extension` and `--allow-extensions`", uk: "`--load-extension` і `--allow-extensions`" } },
        { id: "c", label: { en: "`--disable-extensions-except` and `--load-extension`", uk: "`--disable-extensions-except` і `--load-extension`" } },
        { id: "d", label: { en: "`--no-sandbox` and `--load-extension`", uk: "`--no-sandbox` і `--load-extension`" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`--disable-extensions-except=<path>` disables all extensions except the one at the given path, and `--load-extension=<path>` tells Chromium to load the unpacked extension from that path. Both must point to the same directory.",
        uk: "`--disable-extensions-except=<path>` вимикає всі розширення крім того, що за вказаним шляхом, а `--load-extension=<path>` каже Chromium завантажити розпакований extension з цього шляху. Обидва мають вказувати на одну директорію.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "In a test fixture for extensions, which fixture provides the context and which derives the extension ID from it?",
        uk: "У fixture для розширень — яка fixture надає контекст, а яка отримує extension ID з нього?",
      },
      options: [
        { id: "a", label: { en: "`extensionId` provides the context; `context` derives the ID.", uk: "`extensionId` надає контекст; `context` отримує ID." } },
        { id: "b", label: { en: "`context` launches the persistent context; `extensionId` waits for the service worker and extracts the ID from the context.", uk: "`context` запускає persistent context; `extensionId` чекає на service worker і отримує ID з контексту." } },
        { id: "c", label: { en: "Both fixtures are independent and do not reference each other.", uk: "Обидві fixtures незалежні і не посилаються одна на одну." } },
        { id: "d", label: { en: "A single combined fixture returns both the context and the ID.", uk: "Одна комбінована fixture повертає і контекст, і ID." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `context` fixture calls `chromium.launchPersistentContext` and yields the context, closing it on teardown. The `extensionId` fixture receives `{ context }` as its dependency, waits for the service worker, and parses the extension ID from the worker URL. This composition keeps each fixture focused.",
        uk: "Fixture `context` викликає `chromium.launchPersistentContext` і передає контекст, закриваючи його при завершенні. Fixture `extensionId` отримує `{ context }` як залежність, чекає на service worker і отримує extension ID з URL воркера. Така композиція тримає кожну fixture сфокусованою.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "After getting the extension ID, how do you open the extension popup page in a test?",
        uk: "Після отримання extension ID, як відкрити popup сторінку розширення в тесті?",
      },
      options: [
        { id: "a", label: { en: "Click the extension icon in the browser toolbar.", uk: "Клацнути на іконку розширення у тулбарі браузера." } },
        { id: "b", label: { en: "Call `browser.openExtension(extensionId)` with the ID.", uk: "Викликати `browser.openExtension(extensionId)` з ID." } },
        { id: "c", label: { en: "Navigate to `chrome-extension://<extensionId>/<popup-file>.html` with `page.goto()`.", uk: "Перейти на `chrome-extension://<extensionId>/<popup-file>.html` через `page.goto()`." } },
        { id: "d", label: { en: "Use `context.newPage()` with `{ extensionId }` option.", uk: "Використати `context.newPage()` з опцією `{ extensionId }`." } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "You navigate directly to the extension's HTML file using the `chrome-extension://` protocol and the extension ID: `page.goto('chrome-extension://' + extensionId + '/popup.html')`. There is no click-the-toolbar API in Playwright, and no `openExtension` method.",
        uk: "Ви переходите безпосередньо до HTML файлу розширення за протоколом `chrome-extension://` з extension ID: `page.goto('chrome-extension://' + extensionId + '/popup.html')`. У Playwright немає API для кліку по тулбару або методу `openExtension`.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Which `channel` value must you set in `launchPersistentContext` for extension testing?",
        uk: "Яке значення `channel` потрібно задати в `launchPersistentContext` для тестування розширень?",
      },
      options: [
        { id: "a", label: { en: "`'chrome'`", uk: "`'chrome'`" } },
        { id: "b", label: { en: "`'chromium'`", uk: "`'chromium'`" } },
        { id: "c", label: { en: "`'msedge'`", uk: "`'msedge'`" } },
        { id: "d", label: { en: "No channel is needed; it defaults to the correct one.", uk: "Channel не потрібний; за замовчуванням він встановлений правильно." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "You set `channel: 'chromium'` to use the bundled Chromium browser that Playwright ships. Google Chrome (`'chrome'`) and Microsoft Edge (`'msedge'`) do not support the `--load-extension` flag, so they cannot load unpacked extensions.",
        uk: "Встановлюйте `channel: 'chromium'`, щоб використовувати bundled Chromium, який постачається з Playwright. Google Chrome (`'chrome'`) і Microsoft Edge (`'msedge'`) не підтримують прапор `--load-extension`, тому не можуть завантажувати розпаковані розширення.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What does `context.waitForEvent('serviceworker')` return in the extension fixture?",
        uk: "Що повертає `context.waitForEvent('serviceworker')` у fixture для розширень?",
      },
      options: [
        { id: "a", label: { en: "A `Page` object representing the service worker tab.", uk: "Об'єкт `Page` що представляє вкладку service worker." } },
        { id: "b", label: { en: "A `Worker` object whose `.url()` contains the extension ID.", uk: "Об'єкт `Worker`, чий `.url()` містить extension ID." } },
        { id: "c", label: { en: "A boolean indicating whether the service worker registered successfully.", uk: "Boolean що вказує на успішну реєстрацію service worker." } },
        { id: "d", label: { en: "The extension manifest as a JSON object.", uk: "Маніфест розширення як JSON об'єкт." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`context.waitForEvent('serviceworker')` resolves to a `Worker` object. For MV3 extensions the worker URL is `chrome-extension://<extensionId>/background.js` (or similar), so `serviceWorker.url().split('/')[2]` extracts the extension ID.",
        uk: "`context.waitForEvent('serviceworker')` повертає об'єкт `Worker`. Для MV3 розширень URL воркера має вигляд `chrome-extension://<extensionId>/background.js`, тому `serviceWorker.url().split('/')[2]` отримує extension ID.",
      },
    },
  ],
}
