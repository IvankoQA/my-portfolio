import type { PlaywrightTopic } from "../../types"

export const testTimeoutsTopic: PlaywrightTopic = {
  slug: "test-timeouts",
  groupId: "test-runner",
  order: 380,
  level: "intermediate",
  trackOrder: 3,
  sourceDoc: "test-timeouts-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-timeouts",
  title: {
    en: "Timeouts",
    uk: "Тайм-аути",
  },
  summary: {
    en: "Playwright Test has multiple configurable timeouts for various tasks.",
    uk: "У Playwright Test є кілька налаштовуваних тайм-аутів для різних завдань.",
  },
  sections: [
    {
      id: "overview",
      title: {
        en: "Overview",
        uk: "Огляд",
      },
      paragraphs: [
        {
          en: "Playwright Test has multiple configurable timeouts for various tasks.",
          uk: "У Playwright Test є кілька налаштовуваних тайм-аутів для різних завдань.",
        },
        {
          en: "|Timeout    |Default             |Description                      |\n|:----------|:----------------|:--------------------------------|\n|Test timeout|30_000 ms|Timeout for each testSet in config{`{ timeout: 60_000 }`}Override in test`test.setTimeout(120_000)` |\n|Expect timeout|5_000 ms|Timeout for each assertionSet in config{`{ expect: { timeout: 10_000 } }`}Override in test`expect(locator).toBeVisible({ timeout: 10_000 })` |",
          uk: "|Timeout    |Default             |Description                      |\n|:----------|:----------------|:--------------------------------|\n|Test timeout|30_000 ms|Тайм-аут для кожного тестуЗадати в конфігурації{`{ timeout: 60_000 }`}Перевизначити в тесті`test.setTimeout(120_000)` |\n|Expect timeout|5_000 ms|Тайм-аут для кожного твердженняЗадати в конфігурації{`{ expect: { timeout: 10_000 } }`}Перевизначити в тесті`expect(locator).toBeVisible({ timeout: 10_000 })` |",
        },
      ],
    },
    {
      id: "test-timeout",
      title: {
        en: "Test timeout",
        uk: "Тайм-аут тесту",
      },
      paragraphs: [
        {
          en: "Playwright Test enforces a timeout for each test, 30 seconds by default. Time spent by the test function, fixture setups, and `beforeEach` hooks is included in the test timeout.",
          uk: "Playwright Test застосовує тайм-аут для кожного тесту, за замовчуванням 30 секунд. Час, витрачений функцією тесту, налаштуванням фікстур і хуками `beforeEach`, входить у тайм-аут тесту.",
        },
        {
          en: "Timed out test produces the following error:",
          uk: "Тест, що перевищив тайм-аут, дає таку помилку:",
        },
        {
          en: "Additional separate timeout, of the same value, is shared between fixture teardowns and `afterEach` hooks, after the test function has finished.",
          uk: "Додатковий окремий тайм-аут тієї ж тривалості спільно використовується під час завершення фікстур і хуками `afterEach` після завершення функції тесту.",
        },
        {
          en: "The same timeout value also applies to `beforeAll` and `afterAll` hooks, but they do not share time with any test.",
          uk: "Те саме значення тайм-ауту також застосовується до хуків `beforeAll` і `afterAll`, але вони не ділять час із жодним тестом.",
        },
        {
          en: "### Set test timeout in the config",
          uk: "### Задати тайм-аут тесту в конфігурації",
        },
        {
          en: "API reference: [`property: TestConfig.timeout`].",
          uk: "Довідник API: [`property: TestConfig.timeout`].",
        },
        {
          en: "### Set timeout for a single test",
          uk: "### Задати тайм-аут для одного тесту",
        },
        {
          en: "API reference: [`method: Test.setTimeout`] and [`method: Test.slow`].",
          uk: "Довідник API: [`method: Test.setTimeout`] та [`method: Test.slow`].",
        },
        {
          en: "### Change timeout from a `beforeEach` hook",
          uk: "### Змінити тайм-аут з хука `beforeEach`",
        },
        {
          en: "API reference: [`method: TestInfo.setTimeout`].",
          uk: "Довідник API: [`method: TestInfo.setTimeout`].",
        },
        {
          en: "### Change timeout for `beforeAll`/`afterAll` hook",
          uk: "### Змінити тайм-аут для хука `beforeAll`/`afterAll`",
        },
        {
          en: "`beforeAll` and `afterAll` hooks have a separate timeout, by default equal to test timeout. You can change it separately for each hook by calling [`method: TestInfo.setTimeout`] inside the hook.",
          uk: "Хуки `beforeAll` і `afterAll` мають окремий тайм-аут, за замовчуванням рівний тайм-ауту тесту. Його можна змінити окремо для кожного хука, викликавши [`method: TestInfo.setTimeout`] всередині хука.",
        },
        {
          en: "API reference: [`method: TestInfo.setTimeout`].",
          uk: "Довідник API: [`method: TestInfo.setTimeout`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "txt",
          code: "example.spec.ts:3:1 › basic test ===========================\n\nTimeout of 30000ms exceeded.",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\nexport default defineConfig({\n  timeout: 120_000,\n});",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\ntest('slow test', async ({ page }) => {\n  test.slow(); // Easy way to triple the default timeout\n  // ...\n});\n\ntest('very slow test', async ({ page }) => {\n  test.setTimeout(120_000);\n  // ...\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "\ntest.beforeEach(async ({ page }, testInfo) => {\n  // Extend timeout for all tests running this hook by 30 seconds.\n  testInfo.setTimeout(testInfo.timeout + 30_000);\n});",
        },
        {
          id: "cb-5",
          language: "js",
          code: "\ntest.beforeAll(async () => {\n  // Set timeout for this hook.\n  test.setTimeout(60000);\n});",
        },
      ],
    },
    {
      id: "expect-timeout",
      title: {
        en: "Expect timeout",
        uk: "Тайм-аут expect",
      },
      paragraphs: [
        {
          en: "Auto-retrying assertions like [`method: LocatorAssertions.toHaveText`] have a separate timeout, 5 seconds by default. Assertion timeout is unrelated to the test timeout. It produces the following error:",
          uk: "Автоматично повторювані твердження, як-от [`method: LocatorAssertions.toHaveText`], мають окремий тайм-аут, за замовчуванням 5 секунд. Тайм-аут твердження не пов’язаний із тайм-аутом тесту. У разі перевищення з’являється така помилка:",
        },
        {
          en: "### Set expect timeout in the config",
          uk: "### Задати тайм-аут expect у конфігурації",
        },
        {
          en: "API reference: [`property: TestConfig.expect`].",
          uk: "Довідник API: [`property: TestConfig.expect`].",
        },
        {
          en: "### Specify expect timeout for a single assertion",
          uk: "### Задати тайм-аут expect для одного твердження",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "txt",
          code: 'example.spec.ts:3:1 › basic test ===========================\n\nError: expect(received).toHaveText(expected)\n\nExpected string: "my text"\nReceived string: ""\nCall log:\n  - expect.toHaveText with timeout 5000ms\n  - waiting for "locator(\'button\')"',
        },
        {
          id: "cb-7",
          language: "js",
          code: "\nexport default defineConfig({\n  expect: {\n    timeout: 10_000,\n  },\n});",
        },
        {
          id: "cb-8",
          language: "js",
          code: "\ntest('example', async ({ page }) => {\n  await expect(locator).toHaveText('hello', { timeout: 10_000 });\n});",
        },
      ],
    },
    {
      id: "global-timeout",
      title: {
        en: "Global timeout",
        uk: "Глобальний тайм-аут",
      },
      paragraphs: [
        {
          en: "Playwright Test supports a timeout for the whole test run. This prevents excess resource usage when everything went wrong. There is no default global timeout, but you can set a reasonable one in the config, for example one hour. Global timeout produces the following error:",
          uk: "Playwright Test підтримує тайм-аут для всього прогону тестів. Це запобігає надмірному споживанню ресурсів, коли щось пішло не так. Глобального тайм-ауту за замовчуванням немає, але можна задати розумне значення в конфігурації, наприклад одну годину. У разі спрацювання глобального тайм-ауту з’являється така помилка:",
        },
        {
          en: "You can set global timeout in the config.",
          uk: "Глобальний тайм-аут можна задати в конфігурації.",
        },
        {
          en: "API reference: [`property: TestConfig.globalTimeout`].",
          uk: "Довідник API: [`property: TestConfig.globalTimeout`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "txt",
          code: "Running 1000 tests using 10 workers\n\n  514 skipped\n  486 passed\n  Timed out waiting 3600s for the entire test run",
        },
        {
          id: "cb-10",
          language: "js",
          code: "\nexport default defineConfig({\n  globalTimeout: 3_600_000,\n});",
        },
      ],
    },
    {
      id: "advanced-low-level-timeouts",
      title: {
        en: "Advanced: low level timeouts",
        uk: "Додатково: низькорівневі тайм-аути",
      },
      paragraphs: [
        {
          en: "These are the low-level timeouts that are pre-configured by the test runner, you should not need to change these.\nIf you happen to be in this section because your test are flaky, it is very likely that you should be looking for the solution elsewhere.",
          uk: "Це низькорівневі тайм-аути, які заздалегідь налаштовує раннер тестів; зазвичай їх не потрібно змінювати.\nЯкщо ви потрапили сюди через нестабільні (flaky) тести, майже напевно варто шукати рішення в іншому місці.",
        },
        {
          en: "|Timeout    |Default             |Description                      |\n|:----------|:----------------|:--------------------------------|\n|Action timeout| no timeout |Timeout for each actionSet in config{`{ use: { actionTimeout: 10_000 } }`}Override in test`locator.click({ timeout: 10_000 })` |\n|Navigation timeout| no timeout |Timeout for each navigation actionSet in config{`{ use: { navigationTimeout: 30_000 } }`}Override in test`page.goto('/', { timeout: 30_000 })` |\n|Global timeout|no timeout |Global timeout for the whole test runSet in config`{ globalTimeout: 3_600_000 }` |\n|`beforeAll`/`afterAll` timeout|30_000 ms|Timeout for the hookSet in hook`test.setTimeout(60_000)` |\n|Fixture timeout|no timeout |Timeout for an individual fixtureSet in fixture`{ scope: 'test', timeout: 30_000 }` |",
          uk: "|Timeout    |Default             |Description                      |\n|:----------|:----------------|:--------------------------------|\n|Action timeout| no timeout |Тайм-аут для кожної діїЗадати в конфігурації{`{ use: { actionTimeout: 10_000 } }`}Перевизначити в тесті`locator.click({ timeout: 10_000 })` |\n|Navigation timeout| no timeout |Тайм-аут для кожної навігаційної діїЗадати в конфігурації{`{ use: { navigationTimeout: 30_000 } }`}Перевизначити в тесті`page.goto('/', { timeout: 30_000 })` |\n|Global timeout|no timeout |Глобальний тайм-аут для всього прогону тестівЗадати в конфігурації`{ globalTimeout: 3_600_000 }` |\n|`beforeAll`/`afterAll` timeout|30_000 ms|Тайм-аут для хукаЗадати в хуку`test.setTimeout(60_000)` |\n|Fixture timeout|no timeout |Тайм-аут для окремої фікстуриЗадати у фікстурі`{ scope: 'test', timeout: 30_000 }` |",
        },
        {
          en: "### Set action and navigation timeouts in the config",
          uk: "### Задати тайм-аути дій і навігації в конфігурації",
        },
        {
          en: "API reference: [`property: TestOptions.actionTimeout`] and [`property: TestOptions.navigationTimeout`].",
          uk: "Довідник API: [`property: TestOptions.actionTimeout`] та [`property: TestOptions.navigationTimeout`].",
        },
        {
          en: "### Set timeout for a single action",
          uk: "### Задати тайм-аут для однієї дії",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    actionTimeout: 10 * 1000,\n    navigationTimeout: 30 * 1000,\n  },\n});",
        },
        {
          id: "cb-12",
          language: "js",
          code: "\ntest('basic test', async ({ page }) => {\n  await page.goto('https://playwright.dev', { timeout: 30000 });\n  await page.getByText('Get Started').click({ timeout: 10000 });\n});",
        },
      ],
    },
    {
      id: "fixture-timeout",
      title: {
        en: "Fixture timeout",
        uk: "Тайм-аут фікстури",
      },
      paragraphs: [
        {
          en: "By default, [fixture](./test-fixtures) shares timeout with the test. However, for slow fixtures, especially [worker-scoped](./test-fixtures#worker-scoped-fixtures) ones, it is convenient to have a separate timeout. This way you can keep the overall test timeout small, and give the slow fixture more time.",
          uk: "За замовчуванням [фікстура](./test-fixtures) ділить тайм-аут із тестом. Однак для повільних фікстур, зокрема [на рівні воркера](./test-fixtures#worker-scoped-fixtures), зручно мати окремий тайм-аут. Так можна залишити загальний тайм-аут тесту невеликим і водночас дати повільній фікстурі більше часу.",
        },
        {
          en: "API reference: [`method: Test.extend`].",
          uk: "Довідник API: [`method: Test.extend`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-13",
          language: "js",
          code: "\nconst test = base.extend({\n  slowFixture: [async ({}, use) => {\n    // ... perform a slow operation ...\n    await use('hello');\n  }, { timeout: 60_000 }]\n});\n\ntest('example test', async ({ slowFixture }) => {\n  // ...\n});",
        },
      ],
    },
  ],
  quiz: [],
}
