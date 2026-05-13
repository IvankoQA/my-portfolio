import type { PlaywrightTopic } from "../../types"

export const testRetriesTopic: PlaywrightTopic = {
  slug: "test-retries",
  groupId: "test-runner",
  order: 365,
  sourceDoc: "test-retries-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-retries",
  title: {
    en: "Retries",
    uk: "Повторні спроби",
  },
  summary: {
    en: "Test retries are a way to automatically re-run a test when it fails. This is useful when a test is flaky and fails intermittently. Test retries are configured in the [configuration file](./test-configuration.md).",
    uk: "Повторні спроби тесту — це автоматичний перезапуск після збою. Це корисно для нестабільних (flaky) тестів із періодичними збоями. Повторні спроби налаштовуються у [файлі конфігурації](./test-configuration.md).",
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
          en: "Test retries are a way to automatically re-run a test when it fails. This is useful when a test is flaky and fails intermittently. Test retries are configured in the [configuration file](./test-configuration.md).",
          uk: "Повторні спроби тесту — це автоматичний перезапуск після збою. Це корисно для нестабільних (flaky) тестів із періодичними збоями. Повторні спроби налаштовуються у [файлі конфігурації](./test-configuration.md).",
        },
      ],
    },
    {
      id: "failures",
      title: {
        en: "Failures",
        uk: "Збої",
      },
      paragraphs: [
        {
          en: "Playwright Test runs tests in worker processes. These processes are OS processes, running independently, orchestrated by the test runner. All workers have identical environments and each starts its own browser.",
          uk: "Playwright Test запускає тести в процесах-воркерах. Це процеси ОС, які працюють незалежно й координуються раннером тестів. Усі воркери мають однакове середовище, і кожен запускає власний браузер.",
        },
        {
          en: "Consider the following snippet:",
          uk: "Розгляньте такий фрагмент:",
        },
        {
          en: "When **all tests pass**, they will run in order in the same worker process.\n* Worker process starts\n  * `beforeAll` hook runs\n  * `first good` passes\n  * `second flaky` passes\n  * `third good` passes\n  * `afterAll` hook runs",
          uk: "Коли **усі тести проходять**, вони виконуються по черзі в одному процесі воркера.\n* Запускається процес воркера\n  * виконується хук `beforeAll`\n  * `first good` проходить\n  * `second flaky` проходить\n  * `third good` проходить\n  * виконується хук `afterAll`",
        },
        {
          en: "Should **any test fail**, Playwright Test will discard the entire worker process along with the browser and will start a new one. Testing will continue in the new worker process starting with the next test.\n* Worker process #1 starts\n  * `beforeAll` hook runs\n  * `first good` passes\n  * `second flaky` fails\n  * `afterAll` hook runs\n* Worker process #2 starts\n  * `beforeAll` hook runs again\n  * `third good` passes\n  * `afterAll` hook runs",
          uk: "Якщо **будь-який тест падає**, Playwright Test завершує весь процес воркера разом із браузером і запускає новий. Тестування триває в новому воркері, починаючи з наступного тесту.\n* Запускається воркер №1\n  * виконується хук `beforeAll`\n  * `first good` проходить\n  * `second flaky` падає\n  * виконується хук `afterAll`\n* Запускається воркер №2\n  * знову виконується `beforeAll`\n  * `third good` проходить\n  * виконується хук `afterAll`",
        },
        {
          en: "If you **enable [retries](#retries)**, second worker process will start by retrying the failed test and continue from there.\n* Worker process #1 starts\n  * `beforeAll` hook runs\n  * `first good` passes\n  * `second flaky` fails\n  * `afterAll` hook runs\n* Worker process #2 starts\n  * `beforeAll` hook runs again\n  * `second flaky` is retried and passes\n  * `third good` passes\n  * `afterAll` hook runs",
          uk: "Якщо **увімкнути [повторні спроби](#retries)**, другий воркер почне з повтору невдалого тесту й продовжить далі.\n* Запускається воркер №1\n  * виконується хук `beforeAll`\n  * `first good` проходить\n  * `second flaky` падає\n  * виконується хук `afterAll`\n* Запускається воркер №2\n  * знову виконується `beforeAll`\n  * `second flaky` повторюється й проходить\n  * `third good` проходить\n  * виконується хук `afterAll`",
        },
        {
          en: "This scheme works perfectly for independent tests and guarantees that failing tests can't affect healthy ones.",
          uk: "Така схема добре підходить для незалежних тестів і гарантує, що збої не впливають на успішні.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\ntest.describe('suite', () => {\n  test.beforeAll(async () => { /* ... */ });\n  test('first good', async ({ page }) => { /* ... */ });\n  test('second flaky', async ({ page }) => { /* ... */ });\n  test('third good', async ({ page }) => { /* ... */ });\n  test.afterAll(async () => { /* ... */ });\n});",
        },
      ],
    },
    {
      id: "retries",
      title: {
        en: "Retries",
        uk: "Повторні спроби",
      },
      paragraphs: [
        {
          en: "Playwright supports **test retries**. When enabled, failing tests will be retried multiple times until they pass, or until the maximum number of retries is reached. By default failing tests are not retried.",
          uk: "Playwright підтримує **повторні спроби тестів**. Якщо вони увімкнені, невдалі тести повторюються, доки не пройдуть або не буде вичерпано максимум спроб. За замовчуванням невдалі тести не повторюються.",
        },
        {
          en: "You can configure retries in the configuration file:",
          uk: "Повторні спроби налаштовуються у файлі конфігурації:",
        },
        {
          en: 'Playwright Test will categorize tests as follows:\n- "passed" - tests that passed on the first run;\n- "flaky" - tests that failed on the first run, but passed when retried;\n- "failed" - tests that failed on the first run and failed all retries.',
          uk: "Playwright Test класифікує тести так:\n- «passed» — пройшли з першого разу;\n- «flaky» — впали з першого разу, але пройшли після повтору;\n- «failed» — впали з першого разу й не пройшли після усіх повторів.",
        },
        {
          en: "You can detect retries at runtime with [`property: TestInfo.retry`], which is accessible to any test, hook or fixture. Here is an example that clears some server-side state before a retry.",
          uk: "Повтор на етапі виконання можна визначити через [`property: TestInfo.retry`] — доступно в будь-якому тесті, хуку чи фікстурі. Ось приклад очищення серверного стану перед повтором.",
        },
        {
          en: "You can specify retries for a specific group of tests or a single file with [`method: Test.describe.configure`].",
          uk: "Кількість повторів можна задати для певної групи тестів або одного файлу через [`method: Test.describe.configure`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "bash",
          code: "# Give failing tests 3 retry attempts\nnpx playwright test --retries=3",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\nexport default defineConfig({\n  // Give failing tests 3 retry attempts\n  retries: 3,\n});",
        },
        {
          id: "cb-4",
          language: "bash",
          code: "Running 3 tests using 1 worker\n\n  ✓ example.spec.ts:4:2 › first passes (438ms)\n  x example.spec.ts:5:2 › second flaky (691ms)\n  ✓ example.spec.ts:5:2 › second flaky (522ms)\n  ✓ example.spec.ts:6:2 › third passes (932ms)\n\n  1 flaky\n    example.spec.ts:5:2 › second flaky\n  2 passed (4s)",
        },
        {
          id: "cb-5",
          language: "js",
          code: "\ntest('my test', async ({ page }, testInfo) => {\n  if (testInfo.retry)\n    await cleanSomeCachesOnTheServer();\n  // ...\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "\ntest.describe(() => {\n  // All tests in this describe group will get 2 retry attempts.\n  test.describe.configure({ retries: 2 });\n\n  test('test 1', async ({ page }) => {\n    // ...\n  });\n\n  test('test 2', async ({ page }) => {\n    // ...\n  });\n});",
        },
      ],
    },
    {
      id: "serial-mode",
      title: {
        en: "Serial mode",
        uk: "Послідовний режим",
      },
      paragraphs: [
        {
          en: "Use [`method: Test.describe.serial`] to group dependent tests to ensure they will always run together and in order. If one of the tests fails, all subsequent tests are skipped. All tests in the group are retried together.",
          uk: "Використовуйте [`method: Test.describe.serial`], щоб згрупувати залежні тести: вони завжди виконуються разом і по черзі. Якщо один падає, усі наступні пропускаються. Усю групу повторюють разом.",
        },
        {
          en: "Consider the following snippet that uses `test.describe.serial`:",
          uk: "Розгляньте фрагмент з `test.describe.serial`:",
        },
        {
          en: "When running without [retries](#retries), all tests after the failure are skipped:\n* Worker process #1:\n  * `beforeAll` hook runs\n  * `first good` passes\n  * `second flaky` fails\n  * `third good` is skipped entirely",
          uk: "Без [повторів](#retries) усі тести після збою пропускаються:\n* Воркер №1:\n  * виконується `beforeAll`\n  * `first good` проходить\n  * `second flaky` падає\n  * `third good` повністю пропускається",
        },
        {
          en: "When running with [retries](#retries), all tests are retried together:\n* Worker process #1:\n  * `beforeAll` hook runs\n  * `first good` passes\n  * `second flaky` fails\n  * `third good` is skipped\n* Worker process #2:\n  * `beforeAll` hook runs again\n  * `first good` passes again\n  * `second flaky` passes\n  * `third good` passes",
          uk: "З [повторами](#retries) уся група повторюється разом:\n* Воркер №1:\n  * виконується `beforeAll`\n  * `first good` проходить\n  * `second flaky` падає\n  * `third good` пропускається\n* Воркер №2:\n  * знову `beforeAll`\n  * `first good` знову проходить\n  * `second flaky` проходить\n  * `third good` проходить",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "js",
          code: "\ntest.describe.configure({ mode: 'serial' });\n\ntest.beforeAll(async () => { /* ... */ });\ntest('first good', async ({ page }) => { /* ... */ });\ntest('second flaky', async ({ page }) => { /* ... */ });\ntest('third good', async ({ page }) => { /* ... */ });",
        },
      ],
    },
    {
      id: "reuse-single-page-between-tests",
      title: {
        en: "Reuse single page between tests",
        uk: "Повторне використання однієї сторінки між тестами",
      },
      paragraphs: [
        {
          en: "Playwright Test creates an isolated [Page] object for each test. However, if you'd like to reuse a single [Page] object between multiple tests, you can create your own in [`method: Test.beforeAll`] and close it in [`method: Test.afterAll`].",
          uk: "Playwright Test створює ізольований об’єкт [Page] для кожного тесту. Якщо потрібно повторно використовувати один [Page] у кількох тестах, створіть його в [`method: Test.beforeAll`] і закрийте в [`method: Test.afterAll`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-8",
          language: "js",
          code: "// @ts-check\n\nconst { test } = require('@playwright/test');\n\ntest.describe.configure({ mode: 'serial' });\n\n/** @type {import('@playwright/test').Page} */\nlet page;\n\ntest.beforeAll(async ({ browser }) => {\n  page = await browser.newPage();\n});\n\ntest.afterAll(async () => {\n  await page.close();\n});\n\ntest('runs first', async () => {\n  await page.goto('https://playwright.dev/');\n});\n\ntest('runs second', async () => {\n  await page.getByText('Get Started').click();\n});",
        },
        {
          id: "cb-9",
          language: "js",
          code: "\ntest.describe.configure({ mode: 'serial' });\n\nlet page: Page;\n\ntest.beforeAll(async ({ browser }) => {\n  page = await browser.newPage();\n});\n\ntest.afterAll(async () => {\n  await page.close();\n});\n\ntest('runs first', async () => {\n  await page.goto('https://playwright.dev/');\n});\n\ntest('runs second', async () => {\n  await page.getByText('Get Started').click();\n});",
        },
      ],
    },
  ],
  quiz: [],
}
