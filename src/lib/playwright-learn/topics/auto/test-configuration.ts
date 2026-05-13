import type { PlaywrightTopic } from "../../types"

export const testConfigurationTopic: PlaywrightTopic = {
  slug: "test-configuration",
  groupId: "test-runner",
  order: 330,
  sourceDoc: "test-configuration-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-configuration",
  title: {
    en: "Configuration",
    uk: "Конфігурація",
  },
  summary: {
    en: "Playwright has many options to configure how your tests are run. You can specify these options in the configuration file. Note that test runner options are **top-level**, do not put them into the `use` section.",
    uk: "У Playwright багато опцій, як налаштувати запуск тестів. Їх можна задати в конфігураційному файлі. Зверніть увагу: опції тестраннера — **на верхньому рівні**, не поміщайте їх у секцію `use`.",
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
          en: "Playwright has many options to configure how your tests are run. You can specify these options in the configuration file. Note that test runner options are **top-level**, do not put them into the `use` section.",
          uk: "У Playwright багато опцій, як налаштувати запуск тестів. Їх можна задати в конфігураційному файлі. Зверніть увагу: опції тестраннера — **на верхньому рівні**, не поміщайте їх у секцію `use`.",
        },
      ],
    },
    {
      id: "basic-configuration",
      title: {
        en: "Basic Configuration",
        uk: "Базова конфігурація",
      },
      paragraphs: [
        {
          en: "Here are some of the most common configuration options.",
          uk: "Ось деякі з найпоширеніших опцій конфігурації.",
        },
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestConfig.forbidOnly`] | Whether to exit with an error if any tests are marked as `test.only`. Useful on CI.|\n| [`property: TestConfig.fullyParallel`] | have all tests in all files to run in parallel. See [Parallelism](./test-parallel) and [Sharding](./test-sharding) for more details. |\n| [`property: TestConfig.projects`] | Run tests in multiple configurations or on multiple browsers |\n| [`property: TestConfig.reporter`] | Reporter to use. See [Test Reporters](/test-reporters.md) to learn more about which reporters are available. |\n| [`property: TestConfig.retries`] | The maximum number of retry attempts per test. See [Test Retries](/test-retries.md) to learn more about retries.|\n| [`property: TestConfig.testDir`] | Directory with the test files. |\n| [`property: TestConfig.use`]  | Options with `use{}` |\n| [`property: TestConfig.webServer`] | To launch a server during the tests, use the `webServer` option |\n| [`property: TestConfig.workers`] | The maximum number of concurrent worker processes to use for parallelizing tests. Can also be set as percentage of logical CPU cores, e.g. `'50%'.`. See [Parallelism](./test-parallel) and [Sharding](./test-sharding) for more details. |",
          uk: "| Опція | Опис |\n| :- | :- |\n| [`property: TestConfig.forbidOnly`] | Чи завершувати з помилкою, якщо є тести з позначкою `test.only`. Корисно на CI.|\n| [`property: TestConfig.fullyParallel`] | Запускати паралельно всі тести з усіх файлів. Див. [Parallelism](./test-parallel) і [Sharding](./test-sharding). |\n| [`property: TestConfig.projects`] | Запускати тести в кількох конфігураціях або в кількох браузерах |\n| [`property: TestConfig.reporter`] | Який репортер використовувати. Див. [Test Reporters](/test-reporters.md). |\n| [`property: TestConfig.retries`] | Максимальна кількість повторів на тест. Див. [Test Retries](/test-retries.md).|\n| [`property: TestConfig.testDir`] | Каталог із тестовими файлами. |\n| [`property: TestConfig.use`]  | Опції в `use{}` |\n| [`property: TestConfig.webServer`] | Щоб підняти сервер під час тестів, використайте опцію `webServer` |\n| [`property: TestConfig.workers`] | Максимальна кількість паралельних воркерів. Можна задати у відсотках від логічних ядер CPU, наприклад `'50%'`. Див. [Parallelism](./test-parallel) і [Sharding](./test-sharding). |",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  // Look for test files in the \"tests\" directory, relative to this configuration file.\n  testDir: 'tests',\n\n  // Run all tests in parallel.\n  fullyParallel: true,\n\n  // Fail the build on CI if you accidentally left test.only in the source code.\n  forbidOnly: !!process.env.CI,\n\n  // Retry on CI only.\n  retries: process.env.CI ? 2 : 0,\n\n  // Opt out of parallel tests on CI.\n  workers: process.env.CI ? 1 : undefined,\n\n  // Reporter to use\n  reporter: 'html',\n\n  use: {\n    // Base URL to use in actions like `await page.goto('/')`.\n    baseURL: 'http://localhost:3000',\n\n    // Collect trace when retrying the failed test.\n    trace: 'on-first-retry',\n  },\n  // Configure projects for major browsers.\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n  ],\n  // Run your local dev server before starting the tests.\n  webServer: {\n    command: 'npm run start',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n  },\n});",
        },
      ],
    },
    {
      id: "filtering-tests",
      title: {
        en: "Filtering Tests",
        uk: "Фільтрація тестів",
      },
      paragraphs: [
        {
          en: "Filter tests by glob patterns or regular expressions.",
          uk: "Фільтруйте тести за шаблонами glob або регулярними виразами.",
        },
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestConfig.testIgnore`] | Glob patterns or regular expressions that should be ignored when looking for the test files. For example, `'*test-assets'` |\n| [`property: TestConfig.testMatch`] | Glob patterns or regular expressions that match test files. For example, `'*todo-tests/*.spec.ts'`. By default, Playwright runs .*(test&#124;spec)\\.(js&#124;ts&#124;mjs) files. |",
          uk: "| Опція | Опис |\n| :- | :- |\n| [`property: TestConfig.testIgnore`] | Шаблони glob або регулярні вирази для ігнорування під час пошуку тестових файлів. Наприклад, `'*test-assets'` |\n| [`property: TestConfig.testMatch`] | Шаблони glob або регулярні вирази, що відповідають тестовим файлам. Наприклад, `'*todo-tests/*.spec.ts'`. За замовчуванням Playwright запускає файли .*(test&#124;spec)\\.(js&#124;ts&#124;mjs). |",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "js",
          code: "\nexport default defineConfig({\n  // Glob patterns or regular expressions to ignore test files.\n  testIgnore: '*test-assets',\n\n  // Glob patterns or regular expressions that match test files.\n  testMatch: '*todo-tests/*.spec.ts',\n});",
        },
      ],
    },
    {
      id: "advanced-configuration",
      title: {
        en: "Advanced Configuration",
        uk: "Розширена конфігурація",
      },
      paragraphs: [
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestConfig.globalSetup`] | Path to the global setup file. This file will be required and run before all the tests. It must export a single function. |\n| [`property: TestConfig.globalTeardown`] |Path to the global teardown file. This file will be required and run after all the tests. It must export a single function. |\n| [`property: TestConfig.outputDir`] | Folder for test artifacts such as screenshots, videos, traces, etc. |\n| [`property: TestConfig.timeout`] | Playwright enforces a [timeout](./test-timeouts.md) for each test, 30 seconds by default. Time spent by the test function, test fixtures and beforeEach hooks is included in the test timeout. |",
          uk: "| Опція | Опис |\n| :- | :- |\n| [`property: TestConfig.globalSetup`] | Шлях до файлу глобального setup. Файл підключається й виконується перед усіма тестами. Має експортувати одну функцію. |\n| [`property: TestConfig.globalTeardown`] |Шлях до файлу глобального teardown. Файл підключається й виконується після усіх тестів. Має експортувати одну функцію. |\n| [`property: TestConfig.outputDir`] | Каталог для артефактів тестів: скріншоти, відео, трейси тощо. |\n| [`property: TestConfig.timeout`] | Playwright застосовує [таймаут](./test-timeouts.md) до кожного тесту, за замовчуванням 30 с. У таймаут тесту входить час функції тесту, фікстур і хуків beforeEach. |",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "\nexport default defineConfig({\n  // Folder for test artifacts such as screenshots, videos, traces, etc.\n  outputDir: 'test-results',\n\n  // path to the global setup files.\n  globalSetup: require.resolve('./global-setup'),\n\n  // path to the global teardown files.\n  globalTeardown: require.resolve('./global-teardown'),\n\n  // Each test is given 30 seconds.\n  timeout: 30000,\n\n});",
        },
      ],
    },
    {
      id: "expect-options",
      title: {
        en: "Expect Options",
        uk: "Опції expect",
      },
      paragraphs: [
        {
          en: "Configuration for the expect assertion library.",
          uk: "Налаштування бібліотеки перевірок expect.",
        },
        {
          en: "| Option | Description |\n| :- | :- |\n| [`property: TestConfig.expect`] | [Web first assertions](./test-assertions.md) like `expect(locator).toHaveText()` have a separate timeout of 5 seconds by default. This is the maximum time the `expect()` should wait for the condition to be met. Learn more about [test and expect timeouts](./test-timeouts.md) and how to set them for a single test. |\n| [`method: PageAssertions.toHaveScreenshot#1`] | Configuration for the `expect(locator).toHaveScreenshot()` method. |\n| [`method: SnapshotAssertions.toMatchSnapshot#1`]| Configuration for the `expect(locator).toMatchSnapshot()` method.|",
          uk: "| Опція | Опис |\n| :- | :- |\n| [`property: TestConfig.expect`] | У [web first assertions](./test-assertions.md) на кшталт `expect(locator).toHaveText()` за замовчуванням окремий таймаут 5 с — максимальний час очікування `expect()`, поки умова не виконається. Див. [таймаути тестів і expect](./test-timeouts.md) і як задати їх для одного тесту. |\n| [`method: PageAssertions.toHaveScreenshot#1`] | Конфігурація для `expect(locator).toHaveScreenshot()`. |\n| [`method: SnapshotAssertions.toMatchSnapshot#1`]| Конфігурація для `expect(locator).toMatchSnapshot()`.|",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: "\nexport default defineConfig({\n  expect: {\n    // Maximum time expect() should wait for the condition to be met.\n    timeout: 5000,\n\n    toHaveScreenshot: {\n      // An acceptable amount of pixels that could be different, unset by default.\n      maxDiffPixels: 10,\n    },\n\n    toMatchSnapshot: {\n      // An acceptable ratio of pixels that are different to the\n      // total amount of pixels, between 0 and 1.\n      maxDiffPixelRatio: 0.1,\n    },\n  },\n\n});",
        },
      ],
    },
  ],
  quiz: [],
}
