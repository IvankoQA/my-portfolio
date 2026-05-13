import type { PlaywrightTopic } from "../../types"

export const testGlobalSetupTeardownTopic: PlaywrightTopic = {
  slug: "test-global-setup-teardown",
  groupId: "test-runner",
  order: 340,
  level: "intermediate",
  trackOrder: 13,
  sourceDoc: "test-global-setup-teardown-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-global-setup-teardown",
  title: {
    en: "Global setup and teardown",
    uk: "Глобальний setup і teardown",
  },
  summary: {
    en: "There are two ways to configure global setup and teardown: using a global setup file and setting it in the config under [`globalSetup`](#option-2-configure-globalsetup-and-globalteardown) or using [project dependencies](#option-1-project-dependencies). With project dependencies, you define a project that runs before all other projects. This is the recommended approach, as it integrates better with the Playwright t…",
    uk: "Є два способи налаштувати глобальний setup і teardown: через файл global setup у конфігу [`globalSetup`](#option-2-configure-globalsetup-and-globalteardown) або через [залежності проєктів](#option-1-project-dependencies). Залежностями ви задаєте проєкт, що виконується перед усіма іншими. Це рекомендований підхід — він краще інтегрується з Playwright t…",
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
          en: "There are two ways to configure global setup and teardown: using a global setup file and setting it in the config under [`globalSetup`](#option-2-configure-globalsetup-and-globalteardown) or using [project dependencies](#option-1-project-dependencies). With project dependencies, you define a project that runs before all other projects. This is the recommended approach, as it integrates better with the Playwright test runner: your HTML report will include the global setup, traces will be recorded, and fixtures can be used. For a detailed comparison of the two approaches, see the table below.",
          uk: "Є два способи налаштувати глобальний setup і teardown: через файл global setup у конфігу [`globalSetup`](#option-2-configure-globalsetup-and-globalteardown) або через [залежності проєктів](#option-1-project-dependencies). Залежностями ви задаєте проєкт, що виконується перед усіма іншими. Це рекомендований підхід — він краще інтегрується з тестраннером Playwright: у HTML-звіті з’явиться global setup, записуватимуться трейси, можна використовувати фікстури. Детальне порівняння — у таблиці нижче.",
        },
        {
          en: "| Feature                          | Project Dependencies (recommended) | `globalSetup` (config option)      |\n|----------------------------------|-------------------------------------|-----------------------------------|\n| Runs before all tests            | ✅ Yes                              | ✅ Yes         |\n| HTML report visibility           | ✅ Shown as a separate project      | ❌ Not shown                       |\n| Trace recording                  | ✅ Full trace available             | ❌ Not supported                   |\n| Playwright fixtures              | ✅ Fully supported                  | ❌ Not supported                   |\n| Browser management               | ✅ Via `browser` fixture            | ❌ Fully manual via `browserType.launch()` |\n| Parallelism and retries          | ✅ Supported via standard config    | ❌ Not applicable                  |\n| Config options like `headless` or `testIdAttribute`  | ✅ Automatically applied            | ❌ Ignored                              |",
          uk: "| Можливість                      | Залежності проєктів (рекомендовано) | `globalSetup` (опція конфігу)    |\n|----------------------------------|-------------------------------------|-----------------------------------|\n| Запуск перед усіма тестами       | ✅ Так                              | ✅ Так         |\n| Видимість у HTML-звіті           | ✅ Окремий проєкт                  | ❌ Не показується                  |\n| Запис трейсів                    | ✅ Повний трейс доступний          | ❌ Не підтримується                |\n| Фікстури Playwright              | ✅ Повністю підтримуються          | ❌ Не підтримуються                |\n| Керування браузером              | ✅ Через фікстуру `browser`        | ❌ Повністю вручну через `browserType.launch()` |\n| Паралелізм і повтори             | ✅ Через стандартний конфіг        | ❌ Не застосовується               |\n| Опції на кшталт `headless` чи `testIdAttribute` | ✅ Застосовуються автоматично | ❌ Ігноруються                    |",
        },
      ],
    },
    {
      id: "option-1-project-dependencies",
      title: {
        en: "Option 1: Project Dependencies",
        uk: "Варіант 1: залежності проєктів",
      },
      paragraphs: [
        {
          en: "[Project dependencies](./api/class-testproject#test-project-dependencies) are a list of projects that need to run before the tests in another project run. They can be useful for configuring the global setup actions so that one project depends on this running first. Using dependencies allows global setup to produce traces and other artifacts.",
          uk: "[Залежності проєктів](./api/class-testproject#test-project-dependencies) — це список проєктів, які мають виконатися перед тестами іншого проєкту. Зручно для глобального setup: один проєкт залежить від іншого, що виконується першим. Залежності дозволяють global setup створювати трейси та інші артефакти.",
        },
        {
          en: "### Setup",
          uk: "### Налаштування",
        },
        {
          en: "First we add a new project with the name 'setup db'. We then give it a [`property: TestProject.testMatch`] property in order to match the file called `global.setup.ts`:",
          uk: "Спочатку додаємо новий проєкт з іменем «setup db» і задаємо [`property: TestProject.testMatch`], щоб підхоплювався файл `global.setup.ts`:",
        },
        {
          en: "Then we add the [`property: TestProject.dependencies`] property to our projects that depend on the setup project and pass into the array the name of our dependency project, which we defined in the previous step:",
          uk: "Потім додаємо [`property: TestProject.dependencies`] до проєктів, які залежать від setup-проєкту, і передаємо в масив ім’я залежності з попереднього кроку:",
        },
        {
          en: "In this example the 'chromium with db' project depends on the 'setup db' project. We then create a setup test, stored at root level of your project (note that setup and teardown code must be defined as regular tests by calling [test()](./api/class-test#test-call) function):",
          uk: "У прикладі проєкт «chromium with db» залежить від «setup db». Далі створюємо setup-тест на корені проєкту (код setup/teardown має бути звичайними тестами через [test()](./api/class-test#test-call)):",
        },
        {
          en: "### Teardown",
          uk: "### Teardown",
        },
        {
          en: "You can teardown your setup by adding a [`property: TestProject.teardown`] property to your setup project. This will run after all dependent projects have run.",
          uk: "Щоб виконати teardown після setup, додайте до setup-проєкту властивість [`property: TestProject.teardown`]. Вона виконається після всіх залежних проєктів.",
        },
        {
          en: "First we add the [`property: TestProject.teardown`] property to our setup project with the name 'cleanup db' which is the name we gave to our teardown project in the previous step:",
          uk: "Спочатку додаємо [`property: TestProject.teardown`] до setup-проєкту зі значенням «cleanup db» — ім’ям teardown-проєкту з попереднього кроку:",
        },
        {
          en: "Then we create a `global.teardown.ts` file in the tests directory of your project. This will be used to delete the data from the database after all tests have run.",
          uk: "Потім створюємо файл `global.teardown.ts` у каталозі тестів — він видалить дані з БД після виконання всіх тестів.",
        },
        {
          en: "### Test filtering",
          uk: "### Фільтрація тестів",
        },
        {
          en: "All test filtering options, such as `--grep`/`--grep-invert`, `--shard`, filtering directly by location in the command line, or using [`test.only()`](./api/class-test.md#test-only), directly select the primary tests to be run. If those tests belong to a project with dependencies, all tests from those dependencies will also run.",
          uk: "Усі опції фільтрації (`--grep`/`--grep-invert`, `--shard`, фільтр за шляхом у CLI або [`test.only()`](./api/class-test.md#test-only)) обирають основні тести для запуску. Якщо вони належать проєкту з залежностями, також виконаються всі тести з цих залежностей.",
        },
        {
          en: "You can pass `--no-deps` command line option to ignore all dependencies and teardowns. Only your directly selected projects will run.",
          uk: "Опція CLI `--no-deps` ігнорує залежності та teardown — запустяться лише явно обрані проєкти.",
        },
        {
          en: "### More examples",
          uk: "### Більше прикладів",
        },
        {
          en: "For more detailed examples check out:\n- our [authentication](./auth.md) guide\n- our blog post [A better global setup in Playwright reusing login with project dependencies](https://dev.to/playwright/a-better-global-setup-in-playwright-reusing-login-with-project-dependencies-14)\n- [v1.31 release video](https://youtu.be/PI50YAPTAs4) to see the demo",
          uk: "Докладніші приклади:\n- наш посібник з [автентифікації](./auth.md)\n- стаття в блозі [A better global setup in Playwright reusing login with project dependencies](https://dev.to/playwright/a-better-global-setup-in-playwright-reusing-login-with-project-dependencies-14)\n- [відео релізу v1.31](https://youtu.be/PI50YAPTAs4) з демо",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  testDir: './tests',\n  // ...\n  projects: [\n    {\n      name: 'setup db',\n      testMatch: /global\\.setup\\.ts/,\n    },\n    // {\n    //   other project\n    // }\n  ]\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\nexport default defineConfig({\n  testDir: './tests',\n  // ...\n  projects: [\n    {\n      name: 'setup db',\n      testMatch: /global\\.setup\\.ts/,\n    },\n    {\n      name: 'chromium with db',\n      use: { ...devices['Desktop Chrome'] },\n      dependencies: ['setup db'],\n    },\n  ]\n});",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\nsetup('create new database', async ({ }) => {\n  console.log('creating new database...');\n  // Initialize the database\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "\ntest('menu', async ({ page }) => {\n  // Your test that depends on the database\n});",
        },
        {
          id: "cb-5",
          language: "js",
          code: "\nexport default defineConfig({\n  testDir: './tests',\n  // ...\n  projects: [\n    {\n      name: 'setup db',\n      testMatch: /global\\.setup\\.ts/,\n      teardown: 'cleanup db',\n    },\n    {\n      name: 'cleanup db',\n      testMatch: /global\\.teardown\\.ts/,\n    },\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n      dependencies: ['setup db'],\n    },\n  ]\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "\nteardown('delete database', async ({ }) => {\n  console.log('deleting test database...');\n  // Delete the database\n});",
        },
      ],
    },
    {
      id: "option-2-configure-globalsetup-and-globalteardown",
      title: {
        en: "Option 2: Configure globalSetup and globalTeardown",
        uk: "Варіант 2: `globalSetup` і `globalTeardown` у конфігу",
      },
      paragraphs: [
        {
          en: "You can use the `globalSetup` option in the [configuration file](./test-configuration.md#advanced-configuration) to set something up once before running all tests. The global setup file must export a single function that takes a config object. This function will be run once before all the tests.",
          uk: "Опція `globalSetup` у [конфігураційному файлі](./test-configuration.md#advanced-configuration) дозволяє щось один раз налаштувати перед усіма тестами. Файл global setup має експортувати одну функцію з аргументом — об’єкт конфігу. Вона виконається один раз перед усіма тестами.",
        },
        {
          en: "Similarly, use `globalTeardown` to run something once after all the tests. Alternatively, let `globalSetup` return a function that will be used as a global teardown. You can pass data such as port number, authentication tokens, etc. from your global setup to your tests using environment variables.",
          uk: "Аналогічно `globalTeardown` виконує код один раз після всіх тестів. Або нехай `globalSetup` поверне функцію — її використають як global teardown. Дані (порт, токени тощо) з global setup можна передати в тести через змінні середовища.",
        },
        {
          en: "### Example",
          uk: "### Приклад",
        },
        {
          en: "Here is a global setup example that authenticates once and reuses authentication state in tests. It uses the `baseURL` and `storageState` options from the configuration file.",
          uk: "Приклад global setup: один раз логін і повторне використання стану автентифікації в тестах через опції `baseURL` і `storageState` з конфігу.",
        },
        {
          en: "Specify `globalSetup`, `baseURL` and `storageState` in the configuration file.",
          uk: "У конфігу вкажіть `globalSetup`, `baseURL` і `storageState`.",
        },
        {
          en: "Tests start already authenticated because we specify `storageState` that was populated by global setup.",
          uk: "Тести починаються вже з автентифікацією, бо `storageState` заповнюється в global setup.",
        },
        {
          en: "You can make arbitrary data available in your tests from your global setup file by setting them as environment variables via `process.env`.",
          uk: "Будь-які дані з global setup можна передати в тести через змінні `process.env`.",
        },
        {
          en: "Tests have access to the `process.env` properties set in the global setup.",
          uk: "У тестах доступні властивості `process.env`, задані в global setup.",
        },
        {
          en: "### Capturing trace of failures during global setup",
          uk: "### Запис трейсу при збоях global setup",
        },
        {
          en: "In some instances, it may be useful to capture a trace of failures encountered during the global setup. In order to do this, you must [start tracing](./api/class-tracing.md#tracing-start) in your setup, and you must ensure that you [stop tracing](./api/class-tracing.md#tracing-stop) if an error occurs before that error is thrown. This can be achieved by wrapping your setup in a `try...catch` block.  Here is an example that expands the global setup example to capture a trace.",
          uk: "Інколи корисно зберегти трейс збою під час global setup. Для цього треба [увімкнути трейсинг](./api/class-tracing.md#tracing-start) у setup і гарантовано [зупинити трейсинг](./api/class-tracing.md#tracing-stop) при помилці до її викидання — зручно обгорнути setup у `try...catch`. Нижче — розширений приклад global setup із записом трейсу.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "js",
          code: "\nexport default defineConfig({\n  globalSetup: require.resolve('./global-setup'),\n  globalTeardown: require.resolve('./global-teardown'),\n});",
        },
        {
          id: "cb-8",
          language: "js",
          code: "\nasync function globalSetup(config: FullConfig) {\n  const { baseURL, storageState } = config.projects[0].use;\n  const browser = await chromium.launch();\n  const page = await browser.newPage();\n  await page.goto(baseURL!);\n  await page.getByLabel('User Name').fill('user');\n  await page.getByLabel('Password').fill('password');\n  await page.getByText('Sign in').click();\n  await page.context().storageState({ path: storageState as string });\n  await browser.close();\n}\n\nexport default globalSetup;",
        },
        {
          id: "cb-9",
          language: "js",
          code: "\nexport default defineConfig({\n  globalSetup: require.resolve('./global-setup'),\n  use: {\n    baseURL: 'http://localhost:3000/',\n    storageState: 'state.json',\n  },\n});",
        },
        {
          id: "cb-10",
          language: "js",
          code: "\ntest('test', async ({ page }) => {\n  await page.goto('/');\n  // You are signed in!\n});",
        },
        {
          id: "cb-11",
          language: "js",
          code: "\nasync function globalSetup(config: FullConfig) {\n  process.env.FOO = 'some data';\n  // Or a more complicated data structure as JSON:\n  process.env.BAR = JSON.stringify({ some: 'data' });\n}\n\nexport default globalSetup;",
        },
        {
          id: "cb-12",
          language: "js",
          code: "\ntest('test', async ({ page }) => {\n  // environment variables which are set in globalSetup are only available inside test().\n  const { FOO, BAR } = process.env;\n\n  // FOO and BAR properties are populated.\n  expect(FOO).toEqual('some data');\n\n  const complexData = JSON.parse(BAR);\n  expect(BAR).toEqual({ some: 'data' });\n});",
        },
        {
          id: "cb-13",
          language: "js",
          code: "\nasync function globalSetup(config: FullConfig) {\n  const { baseURL, storageState } = config.projects[0].use;\n  const browser = await chromium.launch();\n  const context = await browser.newContext();\n  const page = await context.newPage();\n  try {\n    await context.tracing.start({ screenshots: true, snapshots: true });\n    await page.goto(baseURL!);\n    await page.getByLabel('User Name').fill('user');\n    await page.getByLabel('Password').fill('password');\n    await page.getByText('Sign in').click();\n    await context.storageState({ path: storageState as string });\n    await context.tracing.stop({\n      path: './test-results/setup-trace.zip',\n    });\n    await browser.close();\n  } catch (error) {\n    await context.tracing.stop({\n      path: './test-results/failed-setup-trace.zip',\n    });\n    await browser.close();\n    throw error;\n  }\n}\n\nexport default globalSetup;",
        },
      ],
    },
  ],
  quiz: [],
}
