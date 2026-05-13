import type { PlaywrightTopic } from "../../types"

export const testAnnotationsTopic: PlaywrightTopic = {
  slug: "test-annotations",
  groupId: "test-runner",
  order: 310,
  sourceDoc: "test-annotations-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-annotations",
  title: {
    en: "Annotations",
    uk: "Анотації",
  },
  summary: {
    en: "Playwright supports tags and annotations that are displayed in the test report.",
    uk: "Playwright підтримує теги й анотації, які відображаються в звіті про тести.",
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
          en: "Playwright supports tags and annotations that are displayed in the test report.",
          uk: "Playwright підтримує теги й анотації, які відображаються в звіті про тести.",
        },
        {
          en: "You can add your own tags and annotations at any moment, but Playwright comes with a few built-in ones:\n- [`method: Test.skip`] marks the test as irrelevant. Playwright does not run such a test. Use this annotation when the test is not applicable in some configuration.\n- [`method: Test.fail`] marks the test as failing. Playwright will run this test and ensure it does indeed fail. If the test does not fail, Playwright will complain.\n- [`method: Test.fixme`] marks the test as failing. Playwright will not run this test, as opposed to the `fail` annotation. Use `fixme` when running the test is slow or crashes.\n- [`method: Test.slow`] marks the test as slow and triples the test timeout.",
          uk: "Ви можете додавати власні теги й анотації в будь-який момент, але Playwright має кілька вбудованих:\n- [`method: Test.skip`] позначає тест як нерелевантний. Playwright не запускає такий тест. Використовуйте цю анотацію, коли тест не застосовний у певній конфігурації.\n- [`method: Test.fail`] позначає тест як такий, що має падати. Playwright запустить цей тест і перевірить, що він справді падає. Якщо тест не падає, Playwright повідомить про проблему.\n- [`method: Test.fixme`] позначає тест як такий, що має падати. Playwright не запускатиме цей тест (на відміну від анотації `fail`). Використовуйте `fixme`, коли запуск тесту повільний або призводить до збоїв.\n- [`method: Test.slow`] позначає тест як повільний і потроює таймаут тесту.",
        },
        {
          en: "Annotations can be added to a single test or a group of tests.",
          uk: "Анотації можна додати до одного тесту або групи тестів.",
        },
        {
          en: "Built-in annotations can be conditional, in which case they apply when the condition is truthy, and may depend on test fixtures. There could be multiple annotations on the same test, possibly in different configurations.",
          uk: "Вбудовані анотації можуть бути умовними: тоді вони застосовуються, коли умова істинна, і можуть залежати від тестових фікстур. На одному тесті може бути кілька анотацій, іноді в різних конфігураціях.",
        },
      ],
    },
    {
      id: "focus-a-test",
      title: {
        en: "Focus a test",
        uk: "Сфокусувати тест",
      },
      paragraphs: [
        {
          en: "You can focus some tests. When there are focused tests, only these tests run.",
          uk: "Можна сфокусувати окремі тести. Якщо є сфокусовані тести, запускаються лише вони.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "test.only('focus this test', async ({ page }) => {\n  // Run only focused tests in the entire project.\n});",
        },
      ],
    },
    {
      id: "skip-a-test",
      title: {
        en: "Skip a test",
        uk: "Пропустити тест",
      },
      paragraphs: [
        {
          en: "Mark a test as skipped.",
          uk: "Позначте тест як пропущений.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "js",
          code: "test.skip('skip this test', async ({ page }) => {\n  // This test is not run\n});",
        },
      ],
    },
    {
      id: "conditionally-skip-a-test",
      title: {
        en: "Conditionally skip a test",
        uk: "Умовно пропустити тест",
      },
      paragraphs: [
        {
          en: "You can skip certain test based on the condition.",
          uk: "Можна пропускати певні тести залежно від умови.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "test('skip this test', async ({ page, browserName }) => {\n  test.skip(browserName === 'firefox', 'Still working on it');\n});",
        },
      ],
    },
    {
      id: "group-tests",
      title: {
        en: "Group tests",
        uk: "Групувати тести",
      },
      paragraphs: [
        {
          en: "You can group tests to give them a logical name or to scope before/after hooks to the group.",
          uk: "Можна групувати тести, щоб дати їм логічну назву або обмежити дію хуків before/after групою.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: "\ntest.describe('two tests', () => {\n  test('one', async ({ page }) => {\n    // ...\n  });\n\n  test('two', async ({ page }) => {\n    // ...\n  });\n});",
        },
      ],
    },
    {
      id: "tag-tests",
      title: {
        en: "Tag tests",
        uk: "Тегувати тести",
      },
      paragraphs: [
        {
          en: "Sometimes you want to tag your tests as `@fast` or `@slow`, and then filter by tag in the test report. Or you might want to only run tests that have a certain tag.",
          uk: "Іноді хочеться позначити тести тегами `@fast` або `@slow`, а потім фільтрувати за тегом у звіті. Або запускати лише тести з певним тегом.",
        },
        {
          en: "To tag a test, either provide an additional details object when declaring a test, or add `@`-token to the test title. Note that tags must start with `@` symbol.",
          uk: "Щоб додати тег, або передайте додатковий об’єкт `details` при оголошенні тесту, або додайте токен `@` до назви тесту. Теги мають починатися з символу `@`.",
        },
        {
          en: "You can also tag all tests in a group or provide multiple tags:",
          uk: "Також можна позначити всі тести в групі або вказати кілька тегів:",
        },
        {
          en: "You can now run tests that have a particular tag with [`--grep`](./test-cli.md#all-options) command line option.",
          uk: "Тепер можна запускати тести з певним тегом за допомогою опції командного рядка [`--grep`](./test-cli.md#all-options).",
        },
        {
          en: "Or if you want the opposite, you can skip the tests with a certain tag:",
          uk: "Або, навпаки, пропустити тести з певним тегом:",
        },
        {
          en: "To run tests containing either tag (logical `OR` operator):",
          uk: "Щоб запустити тести, що містять будь-який із тегів (логічний оператор `OR`):",
        },
        {
          en: "Or run tests containing both tags (logical `AND` operator) using regex lookaheads:",
          uk: "Або запустити тести, що містять обидва теги (логічний оператор `AND`), за допомогою regex lookaheads:",
        },
        {
          en: "You can also filter tests in the configuration file via [`property: TestConfig.grep`] and [`property: TestProject.grep`].",
          uk: "Також можна фільтрувати тести у файлі конфігурації через [`property: TestConfig.grep`] та [`property: TestProject.grep`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "\ntest('test login page', {\n  tag: '@fast',\n}, async ({ page }) => {\n  // ...\n});\n\ntest('test full report @slow', async ({ page }) => {\n  // ...\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "\ntest.describe('group', {\n  tag: '@report',\n}, () => {\n  test('test report header', async ({ page }) => {\n    // ...\n  });\n\n  test('test full report', {\n    tag: ['@slow', '@vrt'],\n  }, async ({ page }) => {\n    // ...\n  });\n});",
        },
        {
          id: "cb-7",
          language: "bash",
          code: "npx playwright test --grep @fast",
        },
        {
          id: "cb-8",
          language: "powershell",
          code: 'npx playwright test --grep "@fast"',
        },
        {
          id: "cb-9",
          language: "batch",
          code: "npx playwright test --grep @fast",
        },
        {
          id: "cb-10",
          language: "bash",
          code: "npx playwright test --grep-invert @fast",
        },
        {
          id: "cb-11",
          language: "powershell",
          code: 'npx playwright test --grep-invert "@fast"',
        },
        {
          id: "cb-12",
          language: "batch",
          code: "npx playwright test --grep-invert @fast",
        },
        {
          id: "cb-13",
          language: "bash",
          code: 'npx playwright test --grep "@fast|@slow"',
        },
        {
          id: "cb-14",
          language: "powershell",
          code: 'npx playwright test --grep --% "@fast^|@slow"',
        },
        {
          id: "cb-15",
          language: "batch",
          code: 'npx playwright test --grep "@fast^|@slow"',
        },
        {
          id: "cb-16",
          language: "bash",
          code: 'npx playwright test --grep "(?=.*@fast)(?=.*@slow)"',
        },
      ],
    },
    {
      id: "annotate-tests",
      title: {
        en: "Annotate tests",
        uk: "Анотувати тести",
      },
      paragraphs: [
        {
          en: "If you would like to annotate your tests with something more substantial than a tag, you can do that when declaring a test. Annotations have a `type` and a `description` for more context and available in reporter API. Playwright's built-in HTML reporter shows all annotations, except those where `type` starts with `_` symbol.",
          uk: "Якщо потрібно анотувати тести чимось більш змістовним, ніж тег, це можна зробити при оголошенні тесту. Анотації мають `type` і `description` для контексту й доступні в API репортерів. Вбудований HTML-репортер Playwright показує всі анотації, крім тих, де `type` починається з символу `_`.",
        },
        {
          en: "For example, to annotate a test with an issue url:",
          uk: "Наприклад, щоб анотувати тест URL-адресою issue:",
        },
        {
          en: "You can also annotate all tests in a group or provide multiple annotations:",
          uk: "Також можна анотувати всі тести в групі або вказати кілька анотацій:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-17",
          language: "js",
          code: "\ntest('test login page', {\n  annotation: {\n    type: 'issue',\n    description: 'https://github.com/microsoft/playwright/issues/23180',\n  },\n}, async ({ page }) => {\n  // ...\n});",
        },
        {
          id: "cb-18",
          language: "js",
          code: "\ntest.describe('report tests', {\n  annotation: { type: 'category', description: 'report' },\n}, () => {\n  test('test report header', async ({ page }) => {\n    // ...\n  });\n\n  test('test full report', {\n    annotation: [\n      { type: 'issue', description: 'https://github.com/microsoft/playwright/issues/23180' },\n      { type: 'performance', description: 'very slow test!' },\n    ],\n  }, async ({ page }) => {\n    // ...\n  });\n});",
        },
      ],
    },
    {
      id: "conditionally-skip-a-group-of-tests",
      title: {
        en: "Conditionally skip a group of tests",
        uk: "Умовно пропустити групу тестів",
      },
      paragraphs: [
        {
          en: "For example, you can run a group of tests just in Chromium by passing a callback.",
          uk: "Наприклад, можна запускати групу тестів лише в Chromium, передавши callback.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-19",
          language: "js",
          code: "\ntest.describe('chromium only', () => {\n  test.skip(({ browserName }) => browserName !== 'chromium', 'Chromium only!');\n\n  test.beforeAll(async () => {\n    // This hook is only run in Chromium.\n  });\n\n  test('test 1', async ({ page }) => {\n    // This test is only run in Chromium.\n  });\n\n  test('test 2', async ({ page }) => {\n    // This test is only run in Chromium.\n  });\n});",
        },
      ],
    },
    {
      id: "use-fixme-in-beforeeach-hook",
      title: {
        en: "Use fixme in `beforeEach` hook",
        uk: "Використання fixme в хуку `beforeEach`",
      },
      paragraphs: [
        {
          en: "To avoid running `beforeEach` hooks, you can put annotations in the hook itself.",
          uk: "Щоб не виконувати хуки `beforeEach`, можна розмістити анотації всередині самого хука.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-20",
          language: "js",
          code: "\ntest.beforeEach(async ({ page, isMobile }) => {\n  test.fixme(isMobile, 'Settings page does not work in mobile yet');\n\n  await page.goto('http://localhost:3000/settings');\n});\n\ntest('user profile', async ({ page }) => {\n  await page.getByText('My Profile').click();\n  // ...\n});",
        },
      ],
    },
    {
      id: "runtime-annotations",
      title: {
        en: "Runtime annotations",
        uk: "Анотації під час виконання",
      },
      paragraphs: [
        {
          en: "While the test is already running, you can add annotations to [`test.info().annotations`](./api/class-testinfo#test-info-annotations).",
          uk: "Під час виконання тесту можна додавати анотації до [`test.info().annotations`](./api/class-testinfo#test-info-annotations).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-21",
          language: "js",
          code: "\ntest('example test', async ({ page, browser }) => {\n  test.info().annotations.push({\n    type: 'browser version',\n    description: browser.version(),\n  });\n\n  // ...\n});",
        },
      ],
    },
  ],
  quiz: [],
}
