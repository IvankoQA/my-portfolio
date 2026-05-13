import type { PlaywrightTopic } from "../../types"

export const emulationTopic: PlaywrightTopic = {
  slug: "emulation",
  groupId: "guides",
  order: 185,
  sourceDoc: "emulation.md",
  officialDocsUrl: "https://playwright.dev/docs/emulation",
  title: {
    en: "Emulation",
    uk: "Емуляція",
  },
  summary: {
    en: 'With Playwright you can test your app on any browser as well as emulate a real device such as a mobile phone or tablet. Simply configure the devices you would like to emulate and Playwright will simulate the browser behavior such as `"userAgent"`, `"screenSize"`, `"viewport"` and if it `"hasTouch"` enabled. You can also emulate the `"geolocation"`, `"locale"` and `"timezone"` for all tests or for a specific test a…',
    uk: 'За допомогою Playwright можна тестувати застосунок у будь-якому браузері та емулювати справжній пристрій (телефон, планшет). Налаштуйте потрібні пристрої — Playwright імітує поведінку браузера: `"userAgent"`, `"screenSize"`, `"viewport"` і чи ввімкнено `"hasTouch"`. Також можна емулювати `"geolocation"`, `"locale"` та `"timezone"` для всіх тестів або для окремого тесту…',
  },
  sections: [
    {
      id: "introduction",
      title: {
        en: "Introduction",
        uk: "Вступ",
      },
      paragraphs: [
        {
          en: 'With Playwright you can test your app on any browser as well as emulate a real device such as a mobile phone or tablet. Simply configure the devices you would like to emulate and Playwright will simulate the browser behavior such as `"userAgent"`, `"screenSize"`, `"viewport"` and if it `"hasTouch"` enabled. You can also emulate the `"geolocation"`, `"locale"` and `"timezone"` for all tests or for a specific test as well as set the `"permissions"` to show notifications or change the `"colorScheme"`.',
          uk: 'За допомогою Playwright можна тестувати застосунок у будь-якому браузері та емулювати справжній пристрій (телефон, планшет). Налаштуйте потрібні пристрої — Playwright імітує поведінку браузера: `"userAgent"`, `"screenSize"`, `"viewport"` і чи ввімкнено `"hasTouch"`. Також можна емулювати `"geolocation"`, `"locale"` та `"timezone"` для всіх тестів або для окремого тесту, задати `"permissions"` для сповіщень або змінити `"colorScheme"`.',
        },
      ],
    },
    {
      id: "devices",
      title: {
        en: "Devices",
        uk: "Пристрої",
      },
      paragraphs: [
        {
          en: "Playwright comes with a [registry of device parameters](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json) using [`property: Playwright.devices`] for selected desktop, tablet and mobile devices. It can be used to simulate browser behavior for a specific device such as user agent, screen size, viewport and if it has touch enabled. All tests will run with the specified device parameters.",
          uk: "Playwright містить [реєстр параметрів пристроїв](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json) через [`property: Playwright.devices`] для обраних настільних, планшетних і мобільних профілів. Його використовують, щоб імітувати поведінку браузера для конкретного пристрою: user agent, розмір екрана, viewport і наявність дотику. Усі тести виконуються з заданими параметрами пристрою.",
        },
        {
          en: '**Note**: Pre-configured devices assume a specific platform. For example, "Desktop Chrome" will provide a Windows-specific user agent string.',
          uk: "**Примітка**: попередньо налаштовані пристрої припускають певну платформу. Наприклад, «Desktop Chrome» дає user agent, характерний для Windows.",
        },
        {
          en: "If you would like to use the user agent specific to the platform that is running the tests, we recommend unsetting the user agent property.",
          uk: "Якщо потрібен user agent платформи, на якій запускаються тести, краще скинути властивість user agent.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'chromium',\n      use: {\n        ...devices['Desktop Chrome'],\n      },\n    },\n    {\n      name: 'Mobile Safari',\n      use: {\n        ...devices['iPhone 13'],\n      },\n    },\n  ],\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "const { chromium, devices } = require('playwright');\nconst browser = await chromium.launch();\n\nconst iphone13 = devices['iPhone 13'];\nconst context = await browser.newContext({\n  ...iphone13,\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "const context = await browser.newContext({\n  ...devices['Desktop Chrome'],\n  userAgent: undefined,\n});",
        },
      ],
    },
    {
      id: "devices",
      title: {
        en: "Devices",
        uk: "Пристрої",
      },
      paragraphs: [
        {
          en: "Playwright can emulate various devices by specifying `setDeviceScaleFactor`, `setHasTouch`, `setIsMobile`, `setScreenSize`, `setUserAgent` and `setViewportSize` options when creating a context with [`method: Browser.newContext`].",
          uk: "Playwright може емулювати різні пристрої, задаючи опції `setDeviceScaleFactor`, `setHasTouch`, `setIsMobile`, `setScreenSize`, `setUserAgent` та `setViewportSize` під час створення контексту через [`method: Browser.newContext`].",
        },
      ],
    },
    {
      id: "viewport",
      title: {
        en: "Viewport",
        uk: "Область перегляду (viewport)",
      },
      paragraphs: [
        {
          en: "The viewport is included in the device but you can override it for some tests with [`method: Page.setViewportSize`].",
          uk: "Viewport входить до профілю пристрою, але для окремих тестів його можна перевизначити через [`method: Page.setViewportSize`].",
        },
        {
          en: "Test file:",
          uk: "Файл конфігурації тестів:",
        },
        {
          en: "The same works inside a test file.",
          uk: "Те саме працює всередині файлу з тестами.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'chromium',\n      use: {\n        ...devices['Desktop Chrome'],\n        // It is important to define the `viewport` property after destructuring `devices`,\n        // since devices also define the `viewport` for that device.\n        viewport: { width: 1280, height: 720 },\n      },\n    },\n  ]\n});",
        },
        {
          id: "cb-10",
          language: "js",
          code: "// Create context with given viewport\nconst context = await browser.newContext({\n  viewport: { width: 1280, height: 1024 }\n});",
        },
        {
          id: "cb-11",
          language: "js",
          code: "\ntest.use({\n  viewport: { width: 1600, height: 1200 },\n});\n\ntest('my test', async ({ page }) => {\n  // ...\n});",
        },
        {
          id: "cb-12",
          language: "js",
          code: "// Create context with given viewport\nconst context = await browser.newContext({\n  viewport: { width: 1280, height: 1024 }\n});\n\n// Resize viewport for individual page\nawait page.setViewportSize({ width: 1600, height: 1200 });\n\n// Emulate high-DPI\nconst context = await browser.newContext({\n  viewport: { width: 2560, height: 1440 },\n  deviceScaleFactor: 2,\n});",
        },
        {
          id: "cb-13",
          language: "js",
          code: "\ntest.describe('specific viewport block', () => {\n  test.use({ viewport: { width: 1600, height: 1200 } });\n\n  test('my test', async ({ page }) => {\n    // ...\n  });\n});",
        },
        {
          id: "cb-14",
          language: "js",
          code: "// Create context with given viewport\nconst context = await browser.newContext({\n  viewport: { width: 1600, height: 1200 }\n});\nconst page = await context.newPage();",
        },
      ],
    },
    {
      id: "ismobile",
      title: {
        en: "isMobile",
        uk: "isMobile",
      },
      paragraphs: [
        {
          en: "Whether the meta viewport tag is taken into account and touch events are enabled.",
          uk: "Чи враховується тег meta viewport і чи ввімкнено події дотику.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-19",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'chromium',\n      use: {\n        ...devices['Desktop Chrome'],\n        // It is important to define the `isMobile` property after destructuring `devices`,\n        // since devices also define the `isMobile` for that device.\n        isMobile: false,\n      },\n    },\n  ]\n});",
        },
      ],
    },
    {
      id: "locale-timezone",
      title: {
        en: "Locale & Timezone",
        uk: "Мова та часовий пояс",
      },
      paragraphs: [
        {
          en: "Emulate the browser Locale and Timezone which can be set globally for all tests in the config and then overridden for particular tests.",
          uk: "Емулюйте мову (locale) і часовий пояс браузера: глобально для всіх тестів у конфігурації або окремо для певних тестів.",
        },
        {
          en: "######",
          uk: "######",
        },
        {
          en: "Note that this only affects the browser timezone and locale, not the test runner timezone.\nTo set the test runner timezone, you can use the [`TZ` environment variable](https://nodejs.org/api/cli.html#tz).",
          uk: "Це впливає лише на часовий пояс і мову браузера, а не на часовий пояс раннера тестів.\nДля раннера можна задати змінну середовища [`TZ`](https://nodejs.org/api/cli.html#tz).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-24",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    // Emulates the browser locale.\n    locale: 'en-GB',\n\n    // Emulates the browser timezone.\n    timezoneId: 'Europe/Paris',\n  },\n});",
        },
        {
          id: "cb-25",
          language: "js",
          code: "\ntest.use({\n  locale: 'de-DE',\n  timezoneId: 'Europe/Berlin',\n});\n\ntest('my test for de lang in Berlin timezone', async ({ page }) => {\n  await page.goto('https://www.bing.com');\n  // ...\n});",
        },
        {
          id: "cb-26",
          language: "js",
          code: "const context = await browser.newContext({\n  locale: 'de-DE',\n  timezoneId: 'Europe/Berlin',\n});",
        },
      ],
    },
    {
      id: "permissions",
      title: {
        en: "Permissions",
        uk: "Дозволи",
      },
      paragraphs: [
        {
          en: "Allow app to show system notifications.",
          uk: "Дозволити застосунку показувати системні сповіщення.",
        },
        {
          en: "Allow notifications for a specific domain.",
          uk: "Дозволити сповіщення для конкретного домену.",
        },
        {
          en: "Revoke all permissions with [`method: BrowserContext.clearPermissions`].",
          uk: "Скасувати всі дозволи через [`method: BrowserContext.clearPermissions`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-31",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    // Grants specified permissions to the browser context.\n    permissions: ['notifications'],\n  },\n});",
        },
        {
          id: "cb-32",
          language: "js",
          code: "const context = await browser.newContext({\n  permissions: ['notifications'],\n});",
        },
        {
          id: "cb-36",
          language: "js",
          code: "\ntest.beforeEach(async ({ context }) => {\n  // Runs before each test and signs in each page.\n  await context.grantPermissions(['notifications'], { origin: 'https://skype.com' });\n});\n\ntest('first', async ({ page }) => {\n  // page has notifications permission for https://skype.com.\n});",
        },
        {
          id: "cb-37",
          language: "js",
          code: "await context.grantPermissions(['notifications'], { origin: 'https://skype.com' });",
        },
        {
          id: "cb-42",
          language: "js",
          code: "// Library\nawait context.clearPermissions();",
        },
      ],
    },
    {
      id: "geolocation",
      title: {
        en: "Geolocation",
        uk: "Геолокація",
      },
      paragraphs: [
        {
          en: 'Grant `"geolocation"` permissions and set geolocation to a specific area.',
          uk: 'Надайте дозвіл `"geolocation"` і задайте геолокацію для певної області.',
        },
        {
          en: "Change the location later:",
          uk: "Змінити розташування пізніше:",
        },
        {
          en: "**Note** you can only change geolocation for all pages in the context.",
          uk: "**Примітка:** геолокацію можна змінити лише для всіх сторінок у контексті одночасно.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-47",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    // Context geolocation\n    geolocation: { longitude: 12.492507, latitude: 41.889938 },\n    permissions: ['geolocation'],\n  },\n});",
        },
        {
          id: "cb-48",
          language: "js",
          code: "\ntest.use({\n  geolocation: { longitude: 41.890221, latitude: 12.492348 },\n  permissions: ['geolocation'],\n});\n\ntest('my test with geolocation', async ({ page }) => {\n  // ...\n});",
        },
        {
          id: "cb-49",
          language: "js",
          code: "const context = await browser.newContext({\n  geolocation: { longitude: 41.890221, latitude: 12.492348 },\n  permissions: ['geolocation']\n});",
        },
        {
          id: "cb-54",
          language: "js",
          code: "\ntest.use({\n  geolocation: { longitude: 41.890221, latitude: 12.492348 },\n  permissions: ['geolocation'],\n});\n\ntest('my test with geolocation', async ({ page, context }) => {\n  // overwrite the location for this test\n  await context.setGeolocation({ longitude: 48.858455, latitude: 2.294474 });\n});",
        },
        {
          id: "cb-55",
          language: "js",
          code: "await context.setGeolocation({ longitude: 48.858455, latitude: 2.294474 });",
        },
      ],
    },
    {
      id: "color-scheme-and-media",
      title: {
        en: "Color Scheme and Media",
        uk: "Колірна схема та медіа",
      },
      paragraphs: [
        {
          en: "Emulate the users `\"colorScheme\"`. Supported values are 'light' and 'dark'. You can also emulate the media type with [`method: Page.emulateMedia`].",
          uk: "Емулюйте `\"colorScheme\"` користувача. Підтримуються значення 'light' і 'dark'. Тип медіа можна емулювати через [`method: Page.emulateMedia`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-60",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    colorScheme: 'dark',\n  },\n});",
        },
        {
          id: "cb-61",
          language: "js",
          code: "\ntest.use({\n  colorScheme: 'dark' // or 'light'\n});\n\ntest('my test with dark mode', async ({ page }) => {\n  // ...\n});",
        },
        {
          id: "cb-62",
          language: "js",
          code: "// Create context with dark mode\nconst context = await browser.newContext({\n  colorScheme: 'dark' // or 'light'\n});\n\n// Create page with dark mode\nconst page = await browser.newPage({\n  colorScheme: 'dark' // or 'light'\n});\n\n// Change color scheme for the page\nawait page.emulateMedia({ colorScheme: 'dark' });\n\n// Change media for page\nawait page.emulateMedia({ media: 'print' });",
        },
      ],
    },
    {
      id: "user-agent",
      title: {
        en: "User Agent",
        uk: "User-Agent",
      },
      paragraphs: [
        {
          en: "The User Agent is included in the device and therefore you  will rarely need to change it however if you do need to test a different user agent you can override it with the `userAgent` property.",
          uk: "User-Agent зазвичай уже заданий у профілі пристрою, тому його рідко змінюють; якщо треба перевірити інший рядок, перевизначте властивість `userAgent`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-67",
          language: "js",
          code: "\ntest.use({ userAgent: 'My user agent' });\n\ntest('my user agent test', async ({ page }) => {\n  // ...\n});",
        },
        {
          id: "cb-68",
          language: "js",
          code: "const context = await browser.newContext({\n  userAgent: 'My user agent'\n});",
        },
      ],
    },
    {
      id: "offline",
      title: {
        en: "Offline",
        uk: "Без мережі",
      },
      paragraphs: [
        {
          en: "Emulate the network being offline.",
          uk: "Емулювати відсутність мережі (offline).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-73",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    offline: true\n  },\n});",
        },
      ],
    },
    {
      id: "javascript-enabled",
      title: {
        en: "JavaScript Enabled",
        uk: "Увімкнений JavaScript",
      },
      paragraphs: [
        {
          en: "Emulate a user scenario where JavaScript is disabled.",
          uk: "Емулювати сценарій, коли JavaScript вимкнено.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-78",
          language: "js",
          code: "\ntest.use({ javaScriptEnabled: false });\n\ntest('test with no JavaScript', async ({ page }) => {\n  // ...\n});",
        },
        {
          id: "cb-79",
          language: "js",
          code: "const context = await browser.newContext({\n  javaScriptEnabled: false\n});",
        },
      ],
    },
  ],
  quiz: [],
}
