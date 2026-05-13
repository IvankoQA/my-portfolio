import type { PlaywrightTopic } from "../../types"

export const testUseOptionsTopic: PlaywrightTopic = {
  slug: "test-use-options",
  groupId: "test-runner",
  order: 395,
  sourceDoc: "test-use-options-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-use-options",
  title: {
    en: "Configuration (use)",
    uk: "Конфігурація (use)",
  },
  summary: {
    en: "In addition to configuring the test runner you can also configure [Emulation](#emulation-options), [Network](#network-options) and [Recording](#recording-options) for the [Browser] or [BrowserContext]. These options are passed to the `use: {}` object in the Playwright config.",
    uk: "Окрім налаштування раннера тестів можна також налаштувати [Емуляцію](#emulation-options), [Мережу](#network-options) та [Запис](#recording-options) для [Browser] або [BrowserContext]. Ці опції передаються в об’єкт `use: {}` у конфігурації Playwright.",
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
          en: "In addition to configuring the test runner you can also configure [Emulation](#emulation-options), [Network](#network-options) and [Recording](#recording-options) for the [Browser] or [BrowserContext]. These options are passed to the `use: {}` object in the Playwright config.",
          uk: "Окрім налаштування раннера тестів можна також налаштувати [Емуляцію](#emulation-options), [Мережу](#network-options) та [Запис](#recording-options) для [Browser] або [BrowserContext]. Ці опції передаються в об’єкт `use: {}` у конфігурації Playwright.",
        },
        {
          en: "### Basic Options",
          uk: "### Основні опції",
        },
        {
          en: "Set the base URL and storage state for all tests:",
          uk: "Задайте базову URL-адресу та стан сховища для всіх тестів:",
        },
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.baseURL`] | Base URL used for all pages in the context. Allows navigating by using just the path, for example `page.goto('/settings')`. |\n| [`property: TestOptions.storageState`] | Populates context with given storage state. Useful for easy authentication, [learn more](./auth.md). |",
          uk: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.baseURL`] | Базова URL-адреса для всіх сторінок у контексті. Дозволяє переходити лише за шляхом, наприклад `page.goto('/settings')`. |\n| [`property: TestOptions.storageState`] | Заповнює контекст заданим станом сховища. Корисно для простої автентифікації; [докладніше](./auth.md). |",
        },
        {
          en: "### Emulation Options",
          uk: "### Опції емуляції",
        },
        {
          en: 'With Playwright you can emulate a real device such as a mobile phone or tablet. See our [guide on projects](./test-projects.md) for more info on emulating devices. You can also emulate the `"geolocation"`, `"locale"` and `"timezone"` for all tests or for a specific test as well as set the `"permissions"` to show notifications or change the `"colorScheme"`. See our [Emulation](./emulation.md) guide to learn more.',
          uk: 'За допомогою Playwright можна емулювати реальний пристрій, наприклад телефон чи планшет. Див. наш [посібник з проєктів](./test-projects.md) щодо емуляції пристроїв. Також можна емулювати `"geolocation"`, `"locale"` та `"timezone"` для всіх тестів або для окремого тесту, а також задати `"permissions"` для сповіщень або змінити `"colorScheme"`. Більше — у [посібнику з емуляції](./emulation.md).',
        },
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.colorScheme`] | [Emulates](./emulation.md#color-scheme-and-media) `'prefers-colors-scheme'` media feature, supported values are `'light'` and `'dark'` |\n| [`property: TestOptions.geolocation`] | Context [geolocation](./emulation.md#geolocation). |\n| [`property: TestOptions.locale`] | [Emulates](./emulation.md#locale--timezone) the user locale, for example `en-GB`, `de-DE`, etc. |\n| [`property: TestOptions.permissions`] | A list of [permissions](./emulation.md#permissions) to grant to all pages in the context. |\n| [`property: TestOptions.timezoneId`] | Changes the [timezone](./emulation.md#locale--timezone) of the context. |\n| [`property: TestOptions.viewport`] | [Viewport](./emulation.md#viewport) used for all pages in the context. |",
          uk: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.colorScheme`] | [Емулює](./emulation.md#color-scheme-and-media) медіавластивість `'prefers-colors-scheme'`; підтримувані значення — `'light'` і `'dark'` |\n| [`property: TestOptions.geolocation`] | [Геолокація](./emulation.md#geolocation) контексту. |\n| [`property: TestOptions.locale`] | [Емулює](./emulation.md#locale--timezone) локаль користувача, наприклад `en-GB`, `de-DE` тощо. |\n| [`property: TestOptions.permissions`] | Список [дозволів](./emulation.md#permissions), які надаються всім сторінкам у контексті. |\n| [`property: TestOptions.timezoneId`] | Змінює [часовий пояс](./emulation.md#locale--timezone) контексту. |\n| [`property: TestOptions.viewport`] | [В’юпорт](./emulation.md#viewport) для всіх сторінок у контексті. |",
        },
        {
          en: "### Network Options",
          uk: "### Мережеві опції",
        },
        {
          en: "Available options to configure networking:",
          uk: "Доступні опції для налаштування мережі:",
        },
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.acceptDownloads`] | Whether to automatically download all the attachments, defaults to `true`. [Learn more](./downloads.md) about working with downloads. |\n| [`property: TestOptions.extraHTTPHeaders`] | An object containing additional HTTP headers to be sent with every request. All header values must be strings. |\n| [`property: TestOptions.httpCredentials`] | Credentials for [HTTP authentication](./network.md#http-authentication). |\n| [`property: TestOptions.ignoreHTTPSErrors`] | Whether to ignore HTTPS errors during navigation. |\n| [`property: TestOptions.offline`] | Whether to emulate network being offline. |\n| [`property: TestOptions.proxy`] | [Proxy settings](./network.md#http-proxy) used for all pages in the test. |",
          uk: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.acceptDownloads`] | Чи автоматично завантажувати всі вкладення; за замовчуванням `true`. [Докладніше](./downloads.md) про роботу зі завантаженнями. |\n| [`property: TestOptions.extraHTTPHeaders`] | Об’єкт із додатковими HTTP-заголовками для кожного запиту. Усі значення заголовків мають бути рядками. |\n| [`property: TestOptions.httpCredentials`] | Облікові дані для [HTTP-автентифікації](./network.md#http-authentication). |\n| [`property: TestOptions.ignoreHTTPSErrors`] | Чи ігнорувати помилки HTTPS під час навігації. |\n| [`property: TestOptions.offline`] | Чи емулювати відсутність мережі. |\n| [`property: TestOptions.proxy`] | [Налаштування проксі](./network.md#http-proxy) для всіх сторінок у тесті. |",
        },
        {
          en: "### Recording Options",
          uk: "### Опції запису",
        },
        {
          en: "With Playwright you can capture screenshots, record videos as well as traces of your test. By default these are turned off but you can enable them by setting the `screenshot`, `video` and `trace` options in your `playwright.config.js` file.",
          uk: "Playwright може робити знімки екрана, записувати відео й трейси тесту. За замовчуванням це вимкнено; увімкніть опціями `screenshot`, `video` та `trace` у файлі `playwright.config.js`.",
        },
        {
          en: "Trace files, screenshots and videos will appear in the test output directory, typically `test-results`.",
          uk: "Файли трейсів, знімки та відео з’являться в каталозі виводу тестів, зазвичай `test-results`.",
        },
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.screenshot`] | Capture [screenshots](./screenshots.md) of your test. Options include `'off'`, `'on'` and `'only-on-failure'` |\n| [`property: TestOptions.trace`] | Playwright can produce test traces while running the tests. Later on, you can view the trace and get detailed information about Playwright execution by opening [Trace Viewer](./trace-viewer.md). Options include: `'off'`, `'on'`, `'retain-on-failure'` and `'on-first-retry'`  |\n| [`property: TestOptions.video`] | Playwright can record [videos](./videos.md) for your tests. Options include: `'off'`, `'on'`, `'retain-on-failure'` and `'on-first-retry'` |",
          uk: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.screenshot`] | Робити [знімки екрана](./screenshots.md) під час тесту. Значення: `'off'`, `'on'` і `'only-on-failure'` |\n| [`property: TestOptions.trace`] | Playwright може збирати трейси під час запуску тестів. Пізніше їх можна переглянути в [Trace Viewer](./trace-viewer.md) з деталями виконання. Значення: `'off'`, `'on'`, `'retain-on-failure'` і `'on-first-retry'`  |\n| [`property: TestOptions.video`] | Playwright може записувати [відео](./videos.md) для тестів. Значення: `'off'`, `'on'`, `'retain-on-failure'` і `'on-first-retry'` |",
        },
        {
          en: "### Other Options",
          uk: "### Інші опції",
        },
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.actionTimeout`] | Timeout for each Playwright action in milliseconds. Defaults to `0` (no timeout). Learn more about [timeouts](./test-timeouts.md) and how to set them for a single test. |\n| [`property: TestOptions.browserName`] | Name of the browser that runs tests. Defaults to 'chromium'. Options include `chromium`, `firefox`, or `webkit`. |\n| [`property: TestOptions.bypassCSP`] |Toggles bypassing Content-Security-Policy. Useful when CSP includes the production origin. Defaults to `false`. |\n| [`property: TestOptions.channel`] | Browser channel to use. [Learn more](./browsers.md) about different browsers and channels. |\n| [`property: TestOptions.headless`] | Whether to run the browser in headless mode meaning no browser is shown when running tests. Defaults to `true`. |\n| [`property: TestOptions.testIdAttribute`] | Changes the default [`data-testid` attribute](./locators.md#locate-by-test-id) used by Playwright locators. |",
          uk: "| Option | Description |\n| :- | :- |\n| [`property: TestOptions.actionTimeout`] | Тайм-аут кожної дії Playwright у мілісекундах. За замовчуванням `0` (без тайм-ауту). Докладніше про [тайм-аути](./test-timeouts.md) й налаштування для одного тесту. |\n| [`property: TestOptions.browserName`] | Назва браузера для запуску тестів. За замовчуванням `'chromium'`. Можливі значення: `chromium`, `firefox` або `webkit`. |\n| [`property: TestOptions.bypassCSP`] |Увімкнути обхід Content-Security-Policy. Корисно, коли CSP містить продакшн-домен. За замовчуванням `false`. |\n| [`property: TestOptions.channel`] | Канал браузера. [Докладніше](./browsers.md) про різні браузери та канали. |\n| [`property: TestOptions.headless`] | Чи запускати браузер у headless-режимі (без видимого вікна). За замовчуванням `true`. |\n| [`property: TestOptions.testIdAttribute`] | Змінює типовий [`data-testid` attribute](./locators.md#locate-by-test-id), який використовують локатори Playwright. |",
        },
        {
          en: "### More browser and context options",
          uk: "### Додаткові опції браузера й контексту",
        },
        {
          en: "Any options accepted by [`method: BrowserType.launch`], [`method: Browser.newContext`] or [`method: BrowserType.connect`] can be put into `launchOptions`, `contextOptions` or `connectOptions` respectively in the `use` section.",
          uk: "Будь-які опції, які приймають [`method: BrowserType.launch`], [`method: Browser.newContext`] або [`method: BrowserType.connect`], можна вказати відповідно в `launchOptions`, `contextOptions` або `connectOptions` у секції `use`.",
        },
        {
          en: "However, most common ones like `headless` or `viewport` are available directly in the `use` section - see [basic options](#basic-options), [emulation](#emulation-options) or [network](#network-options).",
          uk: "Найпоширеніші, як-от `headless` чи `viewport`, доступні безпосередньо в `use` — див. [основні опції](#basic-options), [емуляцію](#emulation-options) або [мережу](#network-options).",
        },
        {
          en: "### Explicit Context Creation and Option Inheritance",
          uk: "### Явне створення контексту й успадкування опцій",
        },
        {
          en: "If using the built-in `browser` fixture, calling [`method: Browser.newContext`] will create a context with options inherited from the config:",
          uk: "Якщо використовується вбудована фікстура `browser`, виклик [`method: Browser.newContext`] створює контекст з опціями, успадкованими з конфігурації:",
        },
        {
          en: "An example test illustrating the initial context options are set:",
          uk: "Приклад тесту, де задані початкові опції контексту:",
        },
        {
          en: "### Configuration Scopes",
          uk: "### Області конфігурації",
        },
        {
          en: "You can configure Playwright globally, per project, or per test. For example, you can set the locale to be used globally by adding `locale` to the `use` option of the Playwright config, and then override it for a specific project using the `project` option in the config. You can also override it for a specific test by adding `test.use({})` in the test file and passing in the options.",
          uk: "Playwright можна налаштовувати глобально, на рівні проєкту або окремого тесту. Наприклад, додайте `locale` до `use` у конфігурації для глобальної локалі, потім перевизначте її для конкретного проєкту через `project`. Також можна перевизначити для одного тесту, додавши `test.use({})` у файлі тесту й передавши опції.",
        },
        {
          en: "You can override options for a specific project using the `project` option in the Playwright config.",
          uk: "Опції для конкретного проєкту можна перевизначити через `project` у конфігурації Playwright.",
        },
        {
          en: "You can override options for a specific test file by using the `test.use()` method and passing in the options. For example to run tests with the French locale for a specific test:",
          uk: "Опції для конкретного тестового файлу перевизначаються методом `test.use()` з передачею опцій. Наприклад, щоб запустити тести з французькою локаллю:",
        },
        {
          en: "The same works inside a describe block. For example to run tests in a describe block with the French locale:",
          uk: "Те саме працює всередині блоку `describe`. Наприклад, щоб усі тести в блоці йшли з французькою локаллю:",
        },
        {
          en: "### Reset an option",
          uk: "### Скинути опцію",
        },
        {
          en: "You can reset an option to the value defined in the config file. Consider the following config that sets a `baseURL`:",
          uk: "Опцію можна скинути до значення з конфігураційного файлу. Наприклад, конфігурація з `baseURL`:",
        },
        {
          en: "You can now configure `baseURL` for a file, and also opt-out for a single test.",
          uk: "Тепер можна задати `baseURL` для файлу й окремо вимкнути його для одного тесту.",
        },
        {
          en: "If you would like to completely reset the value to `undefined`, use a long-form fixture notation.",
          uk: "Щоб повністю скинути значення до `undefined`, використовуйте довгу форму запису фікстури.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    // Base URL to use in actions like `await page.goto('/')`.\n    baseURL: 'http://localhost:3000',\n\n    // Populates context with given storage state.\n    storageState: 'state.json',\n  },\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    // Emulates `'prefers-colors-scheme'` media feature.\n    colorScheme: 'dark',\n\n    // Context geolocation.\n    geolocation: { longitude: 12.492507, latitude: 41.889938 },\n\n    // Emulates the user locale.\n    locale: 'en-GB',\n\n    // Grants specified permissions to the browser context.\n    permissions: ['geolocation'],\n\n    // Emulates the user timezone.\n    timezoneId: 'Europe/Paris',\n\n    // Viewport used for all pages in the context.\n    viewport: { width: 1280, height: 720 },\n  },\n});",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    // Whether to automatically download all the attachments.\n    acceptDownloads: false,\n\n    // An object containing additional HTTP headers to be sent with every request.\n    extraHTTPHeaders: {\n      'X-My-Header': 'value',\n    },\n\n    // Credentials for HTTP authentication.\n    httpCredentials: {\n      username: 'user',\n      password: 'pass',\n    },\n\n    // Whether to ignore HTTPS errors during navigation.\n    ignoreHTTPSErrors: true,\n\n    // Whether to emulate network being offline.\n    offline: true,\n\n    // Proxy settings used for all pages in the test.\n    proxy: {\n      server: 'http://myproxy.com:3128',\n      bypass: 'localhost',\n    },\n  },\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    // Capture screenshot after each test failure.\n    screenshot: 'only-on-failure',\n\n    // Record trace only when retrying a test for the first time.\n    trace: 'on-first-retry',\n\n    // Record video only when retrying a test for the first time.\n    video: 'on-first-retry'\n  },\n});",
        },
        {
          id: "cb-5",
          language: "js",
          code: '\nexport default defineConfig({\n  use: {\n    // Maximum time each action such as `click()` can take. Defaults to 0 (no limit).\n    actionTimeout: 0,\n\n    // Name of the browser that runs tests. For example `chromium`, `firefox`, `webkit`.\n    browserName: \'chromium\',\n\n    // Toggles bypassing Content-Security-Policy.\n    bypassCSP: true,\n\n    // Channel to use, for example "chrome", "chrome-beta", "msedge", "msedge-beta".\n    channel: \'chrome\',\n\n    // Run browser in headless mode.\n    headless: false,\n\n    // Change the default data-testid attribute.\n    testIdAttribute: \'pw-test-id\',\n  },\n});',
        },
        {
          id: "cb-6",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    launchOptions: {\n      slowMo: 50,\n    },\n  },\n});",
        },
        {
          id: "cb-7",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    userAgent: 'some custom ua',\n    viewport: { width: 100, height: 100 },\n  },\n});",
        },
        {
          id: "cb-8",
          language: "js",
          code: "test('should inherit use options on context when using built-in browser fixture', async ({\n  browser,\n}) => {\n  const context = await browser.newContext();\n  const page = await context.newPage();\n  expect(await page.evaluate(() => navigator.userAgent)).toBe('some custom ua');\n  expect(await page.evaluate(() => window.innerWidth)).toBe(100);\n  await context.close();\n});",
        },
        {
          id: "cb-9",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    locale: 'en-GB'\n  },\n});",
        },
        {
          id: "cb-10",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'chromium',\n      use: {\n        ...devices['Desktop Chrome'],\n        locale: 'de-DE',\n      },\n    },\n  ],\n});",
        },
        {
          id: "cb-11",
          language: "js",
          code: "\ntest.use({ locale: 'fr-FR' });\n\ntest('example', async ({ page }) => {\n  // ...\n});",
        },
        {
          id: "cb-12",
          language: "js",
          code: "\ntest.describe('french language block', () => {\n\n  test.use({ locale: 'fr-FR' });\n\n  test('example', async ({ page }) => {\n    // ...\n  });\n});",
        },
        {
          id: "cb-13",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    baseURL: 'https://playwright.dev',\n  },\n});",
        },
        {
          id: "cb-14",
          language: "js",
          code: "\n// Configure baseURL for this file.\ntest.use({ baseURL: 'https://playwright.dev/docs/intro' });\n\ntest('check intro contents', async ({ page }) => {\n  // This test will use \"https://playwright.dev/docs/intro\" base url as defined above.\n});\n\ntest.describe(() => {\n  // Reset the value to a config-defined one.\n  test.use({ baseURL: undefined });\n\n  test('can navigate to intro from the home page', async ({ page }) => {\n    // This test will use \"https://playwright.dev\" base url as defined in the config.\n  });\n});",
        },
        {
          id: "cb-15",
          language: "js",
          code: "\n// Completely unset baseURL for this file.\ntest.use({\n  baseURL: [async ({}, use) => use(undefined), { scope: 'test' }],\n});\n\ntest('no base url', async ({ page }) => {\n  // This test will not have a base url.\n});",
        },
      ],
    },
  ],
  quiz: [],
}
