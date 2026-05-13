import type { PlaywrightTopic } from "../../types"

export const testProjectsTopic: PlaywrightTopic = {
  slug: "test-projects",
  groupId: "test-runner",
  order: 355,
  sourceDoc: "test-projects-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-projects",
  title: {
    en: "Projects",
    uk: "Проєкти",
  },
  summary: {
    en: "A project is logical group of tests running with the same configuration. We use projects so we can run tests on different browsers and devices. Projects are configured in the `playwright.config.ts` file and once configured you can then run your tests on all projects or only on a specific project. You can also use projects to run the same tests in different configurations. For example, you can run the same tests in…",
    uk: "Проєкт — це логічна група тестів, що виконується з однаковою конфігурацією. Проєкти дозволяють запускати тести в різних браузерах і на різних пристроях. Вони налаштовуються у файлі `playwright.config.ts`; після налаштування можна запускати тести на всіх проєктах або лише на вибраному. Проєкти також можна використовувати, щоб прогоняти ті самі тести в різних конфігураціях. Наприклад, ті самі тести можна запускати в…",
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
          en: "A project is logical group of tests running with the same configuration. We use projects so we can run tests on different browsers and devices. Projects are configured in the `playwright.config.ts` file and once configured you can then run your tests on all projects or only on a specific project. You can also use projects to run the same tests in different configurations. For example, you can run the same tests in a logged-in and logged-out state.",
          uk: "Проєкт — це логічна група тестів, що виконується з однаковою конфігурацією. Проєкти дозволяють запускати тести в різних браузерах і на різних пристроях. Вони налаштовуються у файлі `playwright.config.ts`; після налаштування можна запускати тести на всіх проєктах або лише на вибраному. Проєкти також можна використовувати, щоб прогоняти ті самі тести в різних конфігураціях. Наприклад, ті самі тести можна запускати в стані входу в систему та без нього.",
        },
        {
          en: "By setting up projects you can also run a group of tests with different timeouts or retries or a group of tests against different environments such as staging and production, splitting tests per package/functionality and more.",
          uk: "Налаштувавши проєкти, можна також запускати групу тестів з різними таймаутами чи повтореннями або проти різних середовищ (наприклад staging і production), розбивати тести за пакетом/функціональністю тощо.",
        },
      ],
    },
    {
      id: "configure-projects-for-multiple-browsers",
      title: {
        en: "Configure projects for multiple browsers",
        uk: "Налаштування проєктів для кількох браузерів",
      },
      paragraphs: [
        {
          en: "By using **projects** you can run your tests in multiple browsers such as chromium, webkit and firefox as well as branded browsers such as Google Chrome and Microsoft Edge. Playwright can also run on emulated tablet and mobile devices. See the [registry of device parameters](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json) for a complete list of selected desktop, tablet and mobile devices.",
          uk: "За допомогою **проєктів** можна запускати тести в кількох браузерах — chromium, webkit і firefox, а також у брендованих браузерах Google Chrome та Microsoft Edge. Playwright також може працювати на емульованих планшетах і мобільних пристроях. Повний перелік обраних настільних, планшетних і мобільних пристроїв — у [реєстрі параметрів пристроїв](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n\n    {\n      name: 'firefox',\n      use: { ...devices['Desktop Firefox'] },\n    },\n\n    {\n      name: 'webkit',\n      use: { ...devices['Desktop Safari'] },\n    },\n\n    /* Test against mobile viewports. */\n    {\n      name: 'Mobile Chrome',\n      use: { ...devices['Pixel 5'] },\n    },\n    {\n      name: 'Mobile Safari',\n      use: { ...devices['iPhone 12'] },\n    },\n\n    /* Test against branded browsers. */\n    {\n      name: 'Microsoft Edge',\n      use: {\n        ...devices['Desktop Edge'],\n        channel: 'msedge'\n      },\n    },\n    {\n      name: 'Google Chrome',\n      use: {\n        ...devices['Desktop Chrome'],\n        channel: 'chrome'\n      },\n    },\n  ],\n});",
        },
      ],
    },
    {
      id: "run-projects",
      title: {
        en: "Run projects",
        uk: "Запуск проєктів",
      },
      paragraphs: [
        {
          en: "Playwright will run all projects by default.",
          uk: "За замовчуванням Playwright запускає всі проєкти.",
        },
        {
          en: "Use the `--project` command line option to run a single project.",
          uk: "Щоб запустити один проєкт, використовуйте опцію командного рядка `--project`.",
        },
        {
          en: "The VS Code test runner runs your tests on the default browser of Chrome. To run on other/multiple browsers click the play button's dropdown from the testing sidebar and choose another profile or modify the default profile by clicking **Select Default Profile** and select the browsers you wish to run your tests on.",
          uk: "Тестовий раннер VS Code за замовчуванням запускає тести в Chrome. Щоб запускати в інших або кількох браузерах, натисніть спадне меню кнопки відтворення на бічній панелі тестів і виберіть інший профіль або змініть типовий профіль, натиснувши **Select Default Profile**, і позначте потрібні браузери.",
        },
        {
          en: "Choose a specific profile, various profiles or all profiles to run tests on.",
          uk: "Виберіть конкретний профіль, кілька профілів або всі профілі для запуску тестів.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "bash",
          code: "npx playwright test\n\nRunning 7 tests using 5 workers\n\n  ✓ [chromium] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [webkit] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Mobile Chrome] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Mobile Safari] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Microsoft Edge] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Google Chrome] › example.spec.ts:3:1 › basic test (2s)",
        },
        {
          id: "cb-3",
          language: "bash",
          code: "npx playwright test --project=firefox\n\nRunning 1 test using 1 worker\n\n  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)",
        },
      ],
    },
    {
      id: "configure-projects-for-multiple-environments",
      title: {
        en: "Configure projects for multiple environments",
        uk: "Налаштування проєктів для кількох середовищ",
      },
      paragraphs: [
        {
          en: "By setting up projects we can also run a group of tests with different timeouts or retries or run a group of tests against different environments. For example we can run our tests against a staging environment with 2 retries as well as against a production environment with 0 retries.",
          uk: "Налаштувавши проєкти, можна запускати групу тестів з різними таймаутами чи повтореннями або проти різних середовищ. Наприклад, тести можна гнати проти staging з 2 повтореннями та проти production з 0 повторень.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: "\nexport default defineConfig({\n  timeout: 60000, // Timeout is shared between all tests.\n  projects: [\n    {\n      name: 'staging',\n      use: {\n        baseURL: 'staging.example.com',\n      },\n      retries: 2,\n    },\n    {\n      name: 'production',\n      use: {\n        baseURL: 'production.example.com',\n      },\n      retries: 0,\n    },\n  ],\n});",
        },
      ],
    },
    {
      id: "splitting-tests-into-projects",
      title: {
        en: "Splitting tests into projects",
        uk: "Розподіл тестів по проєктах",
      },
      paragraphs: [
        {
          en: "We can split tests into projects and use filters to run a subset of tests. For example, we can create a project that runs tests using a filter matching all tests with a specific file name. We can then have another group of tests that ignore specific test files.",
          uk: "Тести можна розбити на проєкти й використовувати фільтри для підмножини тестів. Наприклад, можна створити проєкт, який запускає тести за фільтром за іменем файлу, і мати іншу групу, що ігнорує певні тестові файли.",
        },
        {
          en: 'Here is an example that defines a common timeout and two projects. The "Smoke" project runs a small subset of tests without retries, and "Default" project runs all other tests with retries.',
          uk: "Ось приклад із спільним таймаутом і двома проєктами: проєкт «Smoke» запускає невелику підмножину тестів без повторень, а проєкт «Default» — усі інші тести з повтореннями.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "\nexport default defineConfig({\n  timeout: 60000, // Timeout is shared between all tests.\n  projects: [\n    {\n      name: 'Smoke',\n      testMatch: /.*smoke.spec.ts/,\n      retries: 0,\n    },\n    {\n      name: 'Default',\n      testIgnore: /.*smoke.spec.ts/,\n      retries: 2,\n    },\n  ],\n});",
        },
      ],
    },
    {
      id: "dependencies",
      title: {
        en: "Dependencies",
        uk: "Залежності",
      },
      paragraphs: [
        {
          en: "Dependencies are a list of projects that need to run before the tests in another project run. They can be useful for configuring the global setup actions so that one project depends on this running first. When using project dependencies, [test reporters](./test-reporters.md) will show the setup tests and the [trace viewer](/trace-viewer.md) will record traces of the setup.\n\nYou can use the inspector to inspect the DOM snapshot of the trace of your setup tests and you can also use [fixtures](./test-fixtures.md) inside your setup.",
          uk: "Залежності — це перелік проєктів, які мають виконатися перед тестами іншого проєкту. Вони корисні для глобального налаштування, коли один проєкт залежить від попереднього запуску. Якщо використовувати залежності проєктів, [репортери тестів](./test-reporters.md) покажуть setup-тести, а [переглядач трейсів](/trace-viewer.md) запише трейси setup.\n\nІнспектором можна переглянути DOM-знімок трейсу setup-тестів; у setup також можна використовувати [фікстури](./test-fixtures.md).",
        },
        {
          en: "In this example the chromium, firefox and webkit projects depend on the setup project.",
          uk: "У цьому прикладі проєкти chromium, firefox і webkit залежать від проєкту setup.",
        },
        {
          en: "### Running Sequence",
          uk: "### Порядок виконання",
        },
        {
          en: "When working with tests that have a dependency, the dependency will always run first and once all tests from this project have passed, then the other projects will run in parallel.",
          uk: "Якщо у тестів є залежність, залежний проєкт завжди виконується першим; після успішного проходження всіх його тестів інші проєкти запускаються паралельно.",
        },
        {
          en: "Running order:\n1. Tests in the 'setup' project run. Once all tests from this project have passed, then the tests from the dependent projects will start running.",
          uk: "Порядок виконання:\n1. Запускаються тести проєкту «setup». Після успішного завершення всіх його тестів починаються тести залежних проєктів.",
        },
        {
          en: "2. Tests in the 'chromium', 'webkit' and 'firefox' projects run together. By default, these projects will [run in parallel](./test-parallel.md), subject to the maximum workers limit.",
          uk: "2. Тести проєктів «chromium», «webkit» і «firefox» виконуються разом. За замовчуванням вони [працюють паралельно](./test-parallel.md) з урахуванням обмеження на максимальну кількість воркерів.",
        },
        {
          en: "If there are more than one dependency then these project dependencies will be run first and in parallel. If the tests from a dependency fails then the tests that rely on this project will not be run.",
          uk: "Якщо залежностей кілька, спочатку паралельно виконуються ці проєкти-залежності. Якщо тести залежності завершуються з помилкою, тести, що покладаються на цей проєкт, не запускаються.",
        },
        {
          en: "Running order:\n1. Tests in the 'Browser Login' and 'DataBase' projects run in parallel:\n  - 'Browser Login' passes\n  - ❌ 'DataBase' fails!",
          uk: "Порядок виконання:\n1. Тести проєктів «Browser Login» і «DataBase» виконуються паралельно:\n  - «Browser Login» проходить\n  - ❌ «DataBase» падає!",
        },
        {
          en: "1. The 'e2e tests' project is not run!",
          uk: "1. Проєкт «e2e tests» не виконується!",
        },
        {
          en: "### Teardown",
          uk: "### Teardown",
        },
        {
          en: "You can also teardown your setup by adding a [`property: TestProject.teardown`] property to your setup project. Teardown will run after all dependent projects have run. See the [teardown guide](./test-global-setup-teardown.md#teardown) for more information.",
          uk: "Setup можна завершити teardown, додавши властивість [`property: TestProject.teardown`] до проєкту setup. Teardown виконається після всіх залежних проєктів. Докладніше — у [посібнику з teardown](./test-global-setup-teardown.md#teardown).",
        },
        {
          en: "### Test filtering",
          uk: "### Фільтрація тестів",
        },
        {
          en: "All test filtering options, such as `--grep`/`--grep-invert`, `--shard`, filtering directly by location in the command line, or using [`test.only()`](./api/class-test.md#test-only), directly select the primary tests to be run. If those tests belong to a project with dependencies, all tests from those dependencies will also run.",
          uk: "Усі опції фільтрації тестів — наприклад `--grep`/`--grep-invert`, `--shard`, фільтрація за розташуванням у командному рядку або [`test.only()`](./api/class-test.md#test-only) — безпосередньо визначають основні тести для запуску. Якщо ці тести належать проєкту з залежностями, також виконаються всі тести з цих залежностей.",
        },
        {
          en: "You can pass `--no-deps` command line option to ignore all dependencies and teardowns. Only your directly selected projects will run.",
          uk: "Опція командного рядка `--no-deps` ігнорує всі залежності та teardown. Виконаються лише безпосередньо вибрані вами проєкти.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'setup',\n      testMatch: '**/*.setup.ts',\n    },\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n      dependencies: ['setup'],\n    },\n    {\n      name: 'firefox',\n      use: { ...devices['Desktop Firefox'] },\n      dependencies: ['setup'],\n    },\n    {\n      name: 'webkit',\n      use: { ...devices['Desktop Safari'] },\n      dependencies: ['setup'],\n    },\n  ],\n});",
        },
      ],
    },
    {
      id: "custom-project-parameters",
      title: {
        en: "Custom project parameters",
        uk: "Користувацькі параметри проєкту",
      },
      paragraphs: [
        {
          en: "Projects can be also used to parametrize tests with your custom configuration - take a look at [this separate guide](./test-parameterize.md#parameterized-projects).",
          uk: "Проєкти також можна використовувати для параметризації тестів із власною конфігурацією — див. [окремий посібник](./test-parameterize.md#parameterized-projects).",
        },
      ],
    },
  ],
  quiz: [],
}
