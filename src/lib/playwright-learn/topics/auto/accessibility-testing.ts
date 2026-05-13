import type { PlaywrightTopic } from "../../types"

export const accessibilityTestingTopic: PlaywrightTopic = {
  slug: "accessibility-testing",
  groupId: "guides",
  order: 100,
  sourceDoc: "accessibility-testing-js.md",
  officialDocsUrl: "https://playwright.dev/docs/accessibility-testing",
  title: {
    en: "Accessibility testing",
    uk: "Тестування доступності",
  },
  summary: {
    en: "Playwright can be used to test your application for many types of accessibility issues.",
    uk: "Playwright можна використовувати, щоб перевіряти застосунок на численні типи проблем доступності.",
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
          en: "Playwright can be used to test your application for many types of accessibility issues.",
          uk: "Playwright можна використовувати, щоб перевіряти застосунок на численні типи проблем доступності.",
        },
        {
          en: "A few examples of problems this can catch include:\n- Text that would be hard to read for users with vision impairments due to poor color contrast with the background behind it\n- UI controls and form elements without labels that a screen reader could identify\n- Interactive elements with duplicate IDs which can confuse assistive technologies",
          uk: "Ось кілька прикладів проблем, які можна виявити:\n- текст, який важко читати людям із порушенням зору через низький контраст кольору з фоном\n- елементи керування та поля форми без підписів, які може розпізнати зчитувач екрана\n- інтерактивні елементи з дубльованими `id`, що можуть заплутати допоміжні технології",
        },
        {
          en: "The following examples rely on the [`@axe-core/playwright`](https://npmjs.org/@axe-core/playwright) package which adds support for running the [axe accessibility testing engine](https://www.deque.com/axe/) as part of your Playwright tests.",
          uk: "Надалі приклади спираються на пакет [`@axe-core/playwright`](https://npmjs.org/@axe-core/playwright), який додає підтримку запуску [рушія тестування доступності axe](https://www.deque.com/axe/) у ваших тестах Playwright.",
        },
      ],
    },
    {
      id: "example-accessibility-tests",
      title: {
        en: "Example accessibility tests",
        uk: "Приклади тестів доступності",
      },
      paragraphs: [
        {
          en: "Accessibility tests work just like any other Playwright test. You can either create separate test cases for them, or integrate accessibility scans and assertions into your existing test cases.",
          uk: "Тести доступності працюють так само, як і будь-які інші тести Playwright. Можна створювати окремі тест-кейси або вбудовувати сканування доступності та асерти в уже наявні тести.",
        },
        {
          en: "The following examples demonstrate a few basic accessibility testing scenarios.",
          uk: "Нижче показано кілька базових сценаріїв тестування доступності.",
        },
        {
          en: "### Scanning an entire page",
          uk: "### Сканування всієї сторінки",
        },
        {
          en: "This example demonstrates how to test an entire page for automatically detectable accessibility violations. The test:\n1. Imports the `@axe-core/playwright` package\n1. Uses normal Playwright Test syntax to define a test case\n1. Uses normal Playwright syntax to navigate to the page under test\n1. Awaits `AxeBuilder.analyze()` to run the accessibility scan against the page\n1. Uses normal Playwright Test [assertions](./test-assertions) to verify that there are no violations in the returned scan results",
          uk: "Цей приклад показує, як перевірити всю сторінку на порушення доступності, які можна виявити автоматично. Тест:\n1. імпортує пакет `@axe-core/playwright`\n1. використовує звичайний синтаксис Playwright Test для опису тест-кейсу\n1. використовує звичайний синтаксис Playwright для переходу на тестовану сторінку\n1. очікує `AxeBuilder.analyze()`, щоб запустити сканування доступності сторінки\n1. використовує звичайні [асерти](./test-assertions) Playwright Test, щоб переконатися, що в результатах сканування немає порушень",
        },
        {
          en: "### Configuring axe to scan a specific part of a page",
          uk: "### Налаштування axe для сканування частини сторінки",
        },
        {
          en: "`@axe-core/playwright` supports many configuration options for axe. You can specify these options by using a Builder pattern with the `AxeBuilder` class.",
          uk: "`@axe-core/playwright` підтримує багато параметрів конфігурації для axe. Їх можна задати за допомогою патерну Builder і класу `AxeBuilder`.",
        },
        {
          en: "For example, you can use [`AxeBuilder.include()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderincludeselector-string--string) to constrain an accessibility scan to only run against one specific part of a page.",
          uk: "Наприклад, можна використати [`AxeBuilder.include()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderincludeselector-string--string), щоб обмежити сканування доступності лише однією ділянкою сторінки.",
        },
        {
          en: "`AxeBuilder.analyze()` will scan the page *in its current state* when you call it. To scan parts of a page that are revealed based on UI interactions, use [Locators](./locators.md) to interact with the page before invoking `analyze()`:",
          uk: "`AxeBuilder.analyze()` сканує сторінку *у її поточному стані* на момент виклику. Щоб перевірити частини сторінки, які з’являються після дій у інтерфейсі, скористайтеся [локаторами](./locators.md) для взаємодії зі сторінкою перед викликом `analyze()`:",
        },
        {
          en: "### Scanning for WCAG violations",
          uk: "### Сканування на порушення WCAG",
        },
        {
          en: 'By default, axe checks against a wide variety of accessibility rules. Some of these rules correspond to specific success criteria from the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG21/), and others are "best practice" rules that are not specifically required by any WCAG criterion.',
          uk: "За замовчуванням axe перевіряє за великою кількістю правил доступності. Частина з них відповідає конкретним критеріям успіху з [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG21/), інші — це правила «найкращих практик», які жоден критерій WCAG явно не вимагає.",
        },
        {
          en: 'You can constrain an accessibility scan to only run those rules which are "tagged" as corresponding to specific WCAG success criteria by using [`AxeBuilder.withTags()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderwithtagstags-stringarray). For example, [Accessibility Insights for Web\'s Automated Checks](https://accessibilityinsights.io/docs/web/getstarted/fastpass/?referrer=playwright-accessibility-testing-js) only include axe rules that test for violations of WCAG A and AA success criteria; to match that behavior, you would use the tags `wcag2a`, `wcag2aa`, `wcag21a`, and `wcag21aa`.',
          uk: "Можна обмежити сканування доступності лише тими правилами, які «позначені» як відповідні конкретним критеріям успіху WCAG, за допомогою [`AxeBuilder.withTags()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderwithtagstags-stringarray). Наприклад, [автоматичні перевірки Accessibility Insights for Web](https://accessibilityinsights.io/docs/web/getstarted/fastpass/?referrer=playwright-accessibility-testing-js) містять лише правила axe для порушень критеріїв успіху WCAG рівнів A та AA; щоб повторити цю поведінку, використовуйте теги `wcag2a`, `wcag2aa`, `wcag21a` та `wcag21aa`.",
        },
        {
          en: "Note that automated testing cannot detect all types of WCAG violations.",
          uk: "Майте на увазі: автоматичне тестування не виявляє всі типи порушень WCAG.",
        },
        {
          en: 'You can find a complete listing of the rule tags axe-core supports in [the "Axe-core Tags" section of the axe API documentation](https://www.deque.com/axe/core-documentation/api-documentation/#axecore-tags).',
          uk: "Повний перелік тегів правил, які підтримує axe-core, є в [розділі «Axe-core Tags» документації API axe](https://www.deque.com/axe/core-documentation/api-documentation/#axecore-tags).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\ntest.describe('homepage', () => { // 2\n  test('should not have any automatically detectable accessibility issues', async ({ page }) => {\n    await page.goto('https://your-site.com/'); // 3\n\n    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4\n\n    expect(accessibilityScanResults.violations).toEqual([]); // 5\n  });\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "const { test, expect } = require('@playwright/test');\nconst AxeBuilder = require('@axe-core/playwright').default; // 1\n\ntest.describe('homepage', () => { // 2\n  test('should not have any automatically detectable accessibility issues', async ({ page }) => {\n    await page.goto('https://your-site.com/'); // 3\n\n    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4\n\n    expect(accessibilityScanResults.violations).toEqual([]); // 5\n  });\n});",
        },
        {
          id: "cb-3",
          language: "js",
          code: "test('navigation menu should not have automatically detectable accessibility violations', async ({\n  page,\n}) => {\n  await page.goto('https://your-site.com/');\n\n  await page.getByRole('button', { name: 'Navigation Menu' }).click();\n\n  // It is important to waitFor() the page to be in the desired\n  // state *before* running analyze(). Otherwise, axe might not\n  // find all the elements your test expects it to scan.\n  await page.locator('#navigation-menu-flyout').waitFor();\n\n  const accessibilityScanResults = await new AxeBuilder({ page })\n      .include('#navigation-menu-flyout')\n      .analyze();\n\n  expect(accessibilityScanResults.violations).toEqual([]);\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "test('should not have any automatically detectable WCAG A or AA violations', async ({ page }) => {\n  await page.goto('https://your-site.com/');\n\n  const accessibilityScanResults = await new AxeBuilder({ page })\n      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])\n      .analyze();\n\n  expect(accessibilityScanResults.violations).toEqual([]);\n});",
        },
      ],
    },
    {
      id: "handling-known-issues",
      title: {
        en: "Handling known issues",
        uk: "Робота з відомими проблемами",
      },
      paragraphs: [
        {
          en: 'A common question when adding accessibility tests to an application is "how do I suppress known violations?" The following examples demonstrate a few techniques you can use.',
          uk: "Часте питання під час додавання тестів доступності: «як приховати відомі порушення?» Нижче — кілька прийомів, які можна застосувати.",
        },
        {
          en: "### Excluding individual elements from a scan",
          uk: "### Виключення окремих елементів зі сканування",
        },
        {
          en: "If your application contains a few specific elements with known issues, you can use [`AxeBuilder.exclude()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderexcludeselector-string--string) to exclude them from being scanned until you're able to fix the issues.",
          uk: "Якщо в застосунку є кілька елементів із відомими проблемами, можна скористатися [`AxeBuilder.exclude()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderexcludeselector-string--string), щоб не сканувати їх, доки не вдасться виправити порушення.",
        },
        {
          en: "This is usually the simplest option, but it has some important downsides:\n* `exclude()` will exclude the specified elements *and all of their descendants*. Avoid using it with components that contain many children.\n* `exclude()` will prevent *all* rules from running against the specified elements, not just the rules corresponding to known issues.",
          uk: "Зазвичай це найпростіший варіант, але він має важливі недоліки:\n* `exclude()` виключає вказані елементи *і всіх нащадків*. Не варто застосовувати до компонентів із великою кількістю дочірніх вузлів.\n* `exclude()` блокує *усі* правила для цих елементів, а не лише ті, що стосуються відомих проблем.",
        },
        {
          en: "Here is an example of excluding one element from being scanned in one specific test:",
          uk: "Ось приклад виключення одного елемента зі сканування в конкретному тесті:",
        },
        {
          en: "If the element in question is used repeatedly in many pages, consider [using a test fixture](#using-a-test-fixture-for-common-axe-configuration) to reuse the same `AxeBuilder` configuration across multiple tests.",
          uk: "Якщо той самий елемент часто зустріється на багатьох сторінках, розгляньте [використання test fixture](#using-a-test-fixture-for-common-axe-configuration), щоб повторно використовувати однакову конфігурацію `AxeBuilder` у кількох тестах.",
        },
        {
          en: "### Disabling individual scan rules",
          uk: "### Вимкнення окремих правил сканування",
        },
        {
          en: "If your application contains many different preexisting violations of a specific rule, you can use [`AxeBuilder.disableRules()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderdisablerulesrules-stringarray) to temporarily disable individual rules until you're able to fix the issues.",
          uk: "Якщо в застосунку багато різних наявних порушень одного правила, можна тимчасово вимкнути окремі правила через [`AxeBuilder.disableRules()`](https://github.com/dequelabs/axe-core-npm/blob/develop/packages/playwright/README.md#axebuilderdisablerulesrules-stringarray), доки не вдасться все виправити.",
        },
        {
          en: "You can find the rule IDs to pass to `disableRules()` in the `id` property of the violations you want to suppress. A [complete list of axe's rules](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md) can be found in `axe-core`'s documentation.",
          uk: "Ідентифікатори правил для `disableRules()` беруться з властивості `id` тих порушень, які потрібно приглушити. [Повний список правил axe](https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md) є в документації `axe-core`.",
        },
        {
          en: "### Using snapshots to allow specific known issues",
          uk: "### Знімки (snapshots) для допустимих відомих проблем",
        },
        {
          en: "If you would like to allow for a more granular set of known issues, you can use [Snapshots](./test-snapshots.md) to verify that a set of preexisting violations has not changed. This approach avoids the downsides of using `AxeBuilder.exclude()` at the cost of slightly more complexity and fragility.",
          uk: "Якщо потрібно точніше контролювати набір відомих порушень, можна використати [знімки](./test-snapshots.md), щоб переконатися, що набір наявних порушень не змінився. Це обходить недоліки `AxeBuilder.exclude()`, але додає складності й крихкості тестам.",
        },
        {
          en: "Do not use a snapshot of the entire `accessibilityScanResults.violations` array. It contains implementation details of the elements in question, such as a snippet of their rendered HTML; if you include these in your snapshots, it will make your tests prone to breaking every time one of the components in question changes for an unrelated reason:",
          uk: "Не робіть знімок усього масиву `accessibilityScanResults.violations`: він містить деталі реалізації елементів, зокрема уривки з відрендереного HTML; якщо включити це в знімки, тести часто ламатимуться через зміни в компонентах з несуміжних причин:",
        },
        {
          en: "Instead, create a *fingerprint* of the violation(s) in question that contains only enough information to uniquely identify the issue, and use a snapshot of the fingerprint:",
          uk: "Натомість створіть *відбиток* (fingerprint) порушень із мінімумом даних, достатнім для однозначної ідентифікації проблеми, і зберігайте знімок саме відбитка:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "test('should not have any accessibility violations outside of elements with known issues', async ({\n  page,\n}) => {\n  await page.goto('https://your-site.com/page-with-known-issues');\n\n  const accessibilityScanResults = await new AxeBuilder({ page })\n      .exclude('#element-with-known-issue')\n      .analyze();\n\n  expect(accessibilityScanResults.violations).toEqual([]);\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "test('should not have any accessibility violations outside of rules with known issues', async ({\n  page,\n}) => {\n  await page.goto('https://your-site.com/page-with-known-issues');\n\n  const accessibilityScanResults = await new AxeBuilder({ page })\n      .disableRules(['duplicate-id'])\n      .analyze();\n\n  expect(accessibilityScanResults.violations).toEqual([]);\n});",
        },
        {
          id: "cb-7",
          language: "js",
          code: "// Don't do this! This is fragile.\nexpect(accessibilityScanResults.violations).toMatchSnapshot();",
        },
        {
          id: "cb-8",
          language: "js",
          code: "// This is less fragile than snapshotting the entire violations array.\nexpect(violationFingerprints(accessibilityScanResults)).toMatchSnapshot();\n\n// my-test-utils.js\nfunction violationFingerprints(accessibilityScanResults) {\n  const violationFingerprints = accessibilityScanResults.violations.map(violation => ({\n    rule: violation.id,\n    // These are CSS selectors which uniquely identify each element with\n    // a violation of the rule in question.\n    targets: violation.nodes.map(node => node.target),\n  }));\n\n  return JSON.stringify(violationFingerprints, null, 2);\n}",
        },
      ],
    },
    {
      id: "exporting-scan-results-as-a-test-attachment",
      title: {
        en: "Exporting scan results as a test attachment",
        uk: "Експорт результатів сканування як вкладення до тесту",
      },
      paragraphs: [
        {
          en: "Most accessibility tests are primarily concerned with the `violations` property of the axe scan results. However, the scan results contain more than just `violations`. For example, the results also contain information about rules which passed and about elements which axe found to have inconclusive results for some rules. This information can be useful for debugging tests that aren't detecting all the violations you expect them to.",
          uk: "У більшості тестів доступності головне — властивість `violations` у результатах сканування axe. Але в результатах є не лише `violations`: наприклад, відомості про правила, що пройшли, і про елементи з неоднозначними результатами для деяких правил. Це корисно для діагностики тестів, які не знаходять усі очікувані порушення.",
        },
        {
          en: "To include *all* of the scan results as part of your test results for debugging purposes, you can add the scan results as a test attachment with [`testInfo.attach()`](./api/class-testinfo#test-info-attach). [Reporters](./test-reporters) can then embed or link the full results as part of your test output.",
          uk: "Щоб зберегти *усі* результати сканування в артефактах тесту для діагностики, додайте їх як вкладення через [`testInfo.attach()`](./api/class-testinfo#test-info-attach). [Репортери](./test-reporters) зможуть вбудувати або посилатися на повні результати у виводі тестів.",
        },
        {
          en: "The following example demonstrates attaching scan results to a test:",
          uk: "Нижче показано, як прикріпити результати сканування до тесту:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "js",
          code: "test('example with attachment', async ({ page }, testInfo) => {\n  await page.goto('https://your-site.com/');\n\n  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();\n\n  await testInfo.attach('accessibility-scan-results', {\n    body: JSON.stringify(accessibilityScanResults, null, 2),\n    contentType: 'application/json'\n  });\n\n  expect(accessibilityScanResults.violations).toEqual([]);\n});",
        },
      ],
    },
    {
      id: "using-a-test-fixture-for-common-axe-configuration",
      title: {
        en: "Using a test fixture for common axe configuration",
        uk: "Test fixture для спільної конфігурації axe",
      },
      paragraphs: [
        {
          en: "[Test fixtures](./test-fixtures) are a good way to share common `AxeBuilder` configuration across many tests. Some scenarios where this might be useful include:\n* Using a common set of rules among all of your tests\n* Suppressing a known violation in a common element which appears in many different pages\n* Attaching standalone accessibility reports consistently for many scans",
          uk: "[Test fixtures](./test-fixtures) — зручний спосіб ділитися спільною конфігурацією `AxeBuilder` між багатьма тестами. Наприклад, коли потрібно:\n* використовувати один набір правил у всіх тестах\n* приглушити відоме порушення в спільному елементі, що повторюється на різних сторінках\n* стабільно додавати окремі звіти про доступність для багатьох сканувань",
        },
        {
          en: "The following example demonstrates creating and using a test fixture that covers each of those scenarios.",
          uk: "Нижче показано створення та використання test fixture, який покриває ці сценарії.",
        },
        {
          en: "### Creating a fixture",
          uk: "### Створення fixture",
        },
        {
          en: "This example fixture creates an `AxeBuilder` object which is pre-configured with shared `withTags()` and `exclude()` configuration.",
          uk: "У цьому прикладі fixture створює об’єкт `AxeBuilder` із наперед заданими спільними викликами `withTags()` та `exclude()`.",
        },
        {
          en: "### Using a fixture",
          uk: "### Використання fixture",
        },
        {
          en: "To use the fixture, replace the earlier examples' `new AxeBuilder({ page })` with the newly defined `makeAxeBuilder` fixture:",
          uk: "Щоб скористатися fixture, замініть у попередніх прикладах `new AxeBuilder({ page })` на щойно визначений fixture `makeAxeBuilder`:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-10",
          language: "js",
          code: "\ntype AxeFixture = {\n  makeAxeBuilder: () => AxeBuilder;\n};\n\n// Extend base test by providing \"makeAxeBuilder\"\n//\n// This new \"test\" can be used in multiple test files, and each of them will get\n// a consistently configured AxeBuilder instance.\nexport const test = base.extend({\n  makeAxeBuilder: async ({ page }, use) => {\n    const makeAxeBuilder = () => new AxeBuilder({ page })\n        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])\n        .exclude('#commonly-reused-element-with-known-issue');\n\n    await use(makeAxeBuilder);\n  }\n});\nexport { expect } from '@playwright/test';",
        },
        {
          id: "cb-11",
          language: "js",
          code: "const base = require('@playwright/test');\nconst AxeBuilder = require('@axe-core/playwright').default;\n\n// Extend base test by providing \"makeAxeBuilder\"\n//\n// This new \"test\" can be used in multiple test files, and each of them will get\n// a consistently configured AxeBuilder instance.\nexports.test = base.test.extend({\n  makeAxeBuilder: async ({ page }, use) => {\n    const makeAxeBuilder = () => new AxeBuilder({ page })\n        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])\n        .exclude('#commonly-reused-element-with-known-issue');\n\n    await use(makeAxeBuilder);\n  }\n});\nexports.expect = base.expect;",
        },
        {
          id: "cb-12",
          language: "js",
          code: "const { test, expect } = require('./axe-test');\n\ntest('example using custom fixture', async ({ page, makeAxeBuilder }) => {\n  await page.goto('https://your-site.com/');\n\n  const accessibilityScanResults = await makeAxeBuilder()\n      // Automatically uses the shared AxeBuilder configuration,\n      // but supports additional test-specific configuration too\n      .include('#specific-element-under-test')\n      .analyze();\n\n  expect(accessibilityScanResults.violations).toEqual([]);\n});",
        },
      ],
    },
  ],
  quiz: [],
}
