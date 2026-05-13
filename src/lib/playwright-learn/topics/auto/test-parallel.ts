import type { PlaywrightTopic } from "../../types"

export const testParallelTopic: PlaywrightTopic = {
  slug: "test-parallel",
  groupId: "test-runner",
  order: 345,
  level: "intermediate",
  trackOrder: 5,
  sourceDoc: "test-parallel-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-parallel",
  title: {
    en: "Parallelism",
    uk: "Паралелізм",
  },
  summary: {
    en: "Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time. By default, **test files** are run in parallel. Tests in a single file are run in order, in the same worker process.",
    uk: "Playwright Test запускає тести паралельно. Для цього він використовує кілька процесів-воркерів, які працюють одночасно. За замовчуванням **файли тестів** виконуються паралельно. Тести в одному файлі виконуються послідовно в тому ж процесі воркера.",
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
          en: "Playwright Test runs tests in parallel. In order to achieve that, it runs several worker processes that run at the same time. By default, **test files** are run in parallel. Tests in a single file are run in order, in the same worker process.",
          uk: "Playwright Test запускає тести паралельно. Для цього він використовує кілька процесів-воркерів, які працюють одночасно. За замовчуванням **файли тестів** виконуються паралельно. Тести в одному файлі виконуються послідовно в тому ж процесі воркера.",
        },
        {
          en: "- You can configure tests using [`test.describe.configure`](#parallelize-tests-in-a-single-file) to run **tests in a single file** in parallel.\n- You can configure **entire project** to have all tests in all files to run in parallel using [`property: TestProject.fullyParallel`] or [`property: TestConfig.fullyParallel`].\n- To **disable** parallelism limit the number of [workers to one](#disable-parallelism).",
          uk: "- Можна налаштувати тести за допомогою [`test.describe.configure`](#parallelize-tests-in-a-single-file), щоб **тести в одному файлі** виконувалися паралельно.\n- Можна налаштувати **весь проєкт** так, щоб усі тести в усіх файлах виконувалися паралельно, використовуючи [`property: TestProject.fullyParallel`] або [`property: TestConfig.fullyParallel`].\n- Щоб **вимкнути** паралелізм, обмежте кількість [воркерів до одного](#disable-parallelism).",
        },
        {
          en: "You can control the number of [parallel worker processes](#limit-workers) and [limit the number of failures](#limit-failures-and-fail-fast) in the whole test suite for efficiency.",
          uk: "Можна керувати кількістю [паралельних процесів-воркерів](#limit-workers) і [обмежувати кількість збоїв](#limit-failures-and-fail-fast) у всій тестовій збірці з міркувань ефективності.",
        },
      ],
    },
    {
      id: "worker-processes",
      title: {
        en: "Worker processes",
        uk: "Процеси воркерів",
      },
      paragraphs: [
        {
          en: "All tests run in worker processes. These processes are OS processes, running independently, orchestrated by the test runner. All workers have identical environments and each starts its own browser.",
          uk: "Усі тести виконуються в процесах-воркерах. Це процеси ОС, які працюють незалежно й координуються раннером тестів. Усі воркери мають однакове середовище, і кожен запускає власний браузер.",
        },
        {
          en: "You can't communicate between the workers. Playwright Test reuses a single worker as much as it can to make testing faster, so multiple test files are usually run in a single worker one after another.",
          uk: "Воркери не можуть спілкуватися між собою. Playwright Test максимально повторно використовує один воркер, щоб прискорити тестування, тому кілька тестових файлів зазвичай виконуються в одному воркері один за одним.",
        },
        {
          en: "Workers are always shutdown after a [test failure](./test-retries.md#failures) to guarantee pristine environment for following tests.",
          uk: "Після [збою тесту](./test-retries.md#failures) воркери завжди завершуються, щоб гарантувати чисте середовище для наступних тестів.",
        },
      ],
    },
    {
      id: "limit-workers",
      title: {
        en: "Limit workers",
        uk: "Обмеження воркерів",
      },
      paragraphs: [
        {
          en: "You can control the maximum number of parallel worker processes via [command line](./test-cli.md) or in the [configuration file](./test-configuration.md).",
          uk: "Можна керувати максимальною кількістю паралельних процесів-воркерів через [командний рядок](./test-cli.md) або у [файлі конфігурації](./test-configuration.md).",
        },
        {
          en: "From the command line:",
          uk: "З командного рядка:",
        },
        {
          en: "In the configuration file:",
          uk: "У файлі конфігурації:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright test --workers 4",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\nexport default defineConfig({\n  // Limit the number of workers on CI, use default locally\n  workers: process.env.CI ? 2 : undefined,\n});",
        },
      ],
    },
    {
      id: "disable-parallelism",
      title: {
        en: "Disable parallelism",
        uk: "Вимкнення паралелізму",
      },
      paragraphs: [
        {
          en: "You can disable any parallelism by allowing just a single worker at any time. Either set `workers: 1` option in the configuration file or pass `--workers=1` to the command line.",
          uk: "Можна повністю вимкнути паралелізм, дозволяючи лише одного воркера за раз. Або встановіть опцію `workers: 1` у файлі конфігурації, або передайте `--workers=1` у командному рядку.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "bash",
          code: "npx playwright test --workers=1",
        },
      ],
    },
    {
      id: "parallelize-tests-in-a-single-file",
      title: {
        en: "Parallelize tests in a single file",
        uk: "Паралелізація тестів в одному файлі",
      },
      paragraphs: [
        {
          en: "By default, tests in a single file are run in order. If you have many independent tests in a single file, you might want to run them in parallel with [`method: Test.describe.configure`].",
          uk: "За замовчуванням тести в одному файлі виконуються по черзі. Якщо в одному файлі багато незалежних тестів, їх можна запускати паралельно за допомогою [`method: Test.describe.configure`].",
        },
        {
          en: "Note that parallel tests are executed in separate worker processes and cannot share any state or global variables. Each test executes all relevant hooks just for itself, including `beforeAll` and `afterAll`.",
          uk: "Зверніть увагу: паралельні тести виконуються в окремих процесах-воркерах і не можуть спільно використовувати стан чи глобальні змінні. Кожен тест виконує усі відповідні хуки лише для себе, включно з `beforeAll` та `afterAll`.",
        },
        {
          en: "Alternatively, you can opt-in all tests into this fully-parallel mode in the configuration file:",
          uk: "Альтернативно можна увімкнути повністю паралельний режим для всіх тестів у файлі конфігурації:",
        },
        {
          en: "You can also opt in for fully-parallel mode for just a few projects:",
          uk: "Також можна увімкнути повністю паралельний режим лише для кількох проєктів:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: "\ntest.describe.configure({ mode: 'parallel' });\n\ntest('runs in parallel 1', async ({ page }) => { /* ... */ });\ntest('runs in parallel 2', async ({ page }) => { /* ... */ });",
        },
        {
          id: "cb-5",
          language: "js",
          code: "\nexport default defineConfig({\n  fullyParallel: true,\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "\nexport default defineConfig({\n  // runs all tests in all files of a specific project in parallel\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n      fullyParallel: true,\n    },\n  ]\n});",
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
          en: "You can annotate inter-dependent tests as serial. If one of the serial tests\nfails, all subsequent tests are skipped. All tests in a group are retried together.",
          uk: "Можна позначити взаємозалежні тести як послідовні (serial). Якщо один із таких тестів\nзавершується з помилкою, усі наступні тести пропускаються. Усі тести в групі повторюються разом.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "js",
          code: "\n// Annotate entire file as serial.\ntest.describe.configure({ mode: 'serial' });\n\nlet page: Page;\n\ntest.beforeAll(async ({ browser }) => {\n  page = await browser.newPage();\n});\n\ntest.afterAll(async () => {\n  await page.close();\n});\n\ntest('runs first', async () => {\n  await page.goto('https://playwright.dev/');\n});\n\ntest('runs second', async () => {\n  await page.getByText('Get Started').click();\n});",
        },
      ],
    },
    {
      id: "opt-out-of-fully-parallel-mode",
      title: {
        en: "Opt out of fully parallel mode",
        uk: "Відмова від повністю паралельного режиму",
      },
      paragraphs: [
        {
          en: "If your configuration applies parallel mode to all tests using [`property: TestConfig.fullyParallel`], you might still want to run some tests with default settings. You can override the mode per describe:",
          uk: "Якщо конфігурація застосовує паралельний режим до всіх тестів через [`property: TestConfig.fullyParallel`], деякі тести все одно можна запускати з типовими налаштуваннями. Режим можна перевизначити для кожного `describe`:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-8",
          language: "js",
          code: "test.describe('runs in parallel with other describes', () => {\n  test.describe.configure({ mode: 'default' });\n  test('in order 1', async ({ page }) => {});\n  test('in order 2', async ({ page }) => {});\n});",
        },
      ],
    },
    {
      id: "shard-tests-between-multiple-machines",
      title: {
        en: "Shard tests between multiple machines",
        uk: "Шардинг тестів між кількома машинами",
      },
      paragraphs: [
        {
          en: "Playwright Test can shard a test suite, so that it can be executed on multiple machines.\nSee [sharding guide](./test-sharding.md) for more details.",
          uk: "Playwright Test може розбити тестову збірку на шарди, щоб її можна було виконувати на кількох машинах.\nДетальніше — у [посібнику з шардингу](./test-sharding.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "bash",
          code: "npx playwright test --shard=2/3",
        },
      ],
    },
    {
      id: "limit-failures-and-fail-fast",
      title: {
        en: "Limit failures and fail fast",
        uk: "Обмеження збоїв і швидке завершення",
      },
      paragraphs: [
        {
          en: "You can limit the number of failed tests in the whole test suite by setting `maxFailures` config option or passing `--max-failures` command line flag.",
          uk: "Можна обмежити кількість невдалих тестів у всій збірці, встановивши опцію конфігурації `maxFailures` або передавши прапорець командного рядка `--max-failures`.",
        },
        {
          en: 'When running with "max failures" set, Playwright Test will stop after reaching this number of failed tests and skip any tests that were not executed yet. This is useful to avoid wasting resources on broken test suites.',
          uk: "Якщо встановлено «максимальну кількість збоїв», Playwright Test зупиниться після досягнення цієї кількості невдалих тестів і пропустить усі ще не виконані тести. Це корисно, щоб не витрачати ресурси на зламані тестові збірки.",
        },
        {
          en: "Passing command line option:",
          uk: "Передача опції командного рядка:",
        },
        {
          en: "Setting in the configuration file:",
          uk: "Налаштування у файлі конфігурації:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-10",
          language: "bash",
          code: "npx playwright test --max-failures=10",
        },
        {
          id: "cb-11",
          language: "js",
          code: "\nexport default defineConfig({\n  // Limit the number of failures on CI to save resources\n  maxFailures: process.env.CI ? 10 : undefined,\n});",
        },
      ],
    },
    {
      id: "worker-index-and-parallel-index",
      title: {
        en: "Worker index and parallel index",
        uk: "Індекс воркера та паралельний індекс",
      },
      paragraphs: [
        {
          en: "Each worker process is assigned two ids: a unique worker index that starts with 1, and a parallel index that is between `0` and `workers - 1`. When a worker is restarted, for example after a failure, the new worker process has the same `parallelIndex` and a new `workerIndex`.",
          uk: "Кожному процесу-воркеру присвоюються два ідентифікатори: унікальний індекс воркера, що починається з 1, і паралельний індекс у діапазоні від `0` до `workers - 1`. Після перезапуску воркера, наприклад через збій, новий процес має той самий `parallelIndex` і новий `workerIndex`.",
        },
        {
          en: "You can read an index from environment variables `process.env.TEST_WORKER_INDEX` and `process.env.TEST_PARALLEL_INDEX`, or access them through [`property: TestInfo.workerIndex`] and [`property: TestInfo.parallelIndex`].",
          uk: "Індекс можна прочитати зі змінних середовища `process.env.TEST_WORKER_INDEX` та `process.env.TEST_PARALLEL_INDEX` або отримати через [`property: TestInfo.workerIndex`] та [`property: TestInfo.parallelIndex`].",
        },
        {
          en: "### Isolate test data between parallel workers",
          uk: "### Ізоляція тестових даних між паралельними воркерами",
        },
        {
          en: "You can leverage `process.env.TEST_WORKER_INDEX` or [`property: TestInfo.workerIndex`] mentioned above to\nisolate user data in the database between tests running on different workers. All tests run by the worker\nreuse the same user.",
          uk: "Можна скористатися `process.env.TEST_WORKER_INDEX` або [`property: TestInfo.workerIndex`], згаданими вище,\nщоб ізолювати дані користувача в базі між тестами на різних воркерах. Усі тести, які виконує один воркер,\nповторно використовують того самого користувача.",
        },
        {
          en: "Create `playwright/fixtures.ts` file that will [create `dbUserName` fixture](./test-fixtures#creating-a-fixture)\nand initialize a new user in the test database. Use [`property: TestInfo.workerIndex`] to differentiate\nbetween workers.",
          uk: "Створіть файл `playwright/fixtures.ts`, який [створить фікстуру `dbUserName`](./test-fixtures#creating-a-fixture)\nі ініціалізує нового користувача в тестовій базі. Використовуйте [`property: TestInfo.workerIndex`], щоб розрізняти\nворкерів.",
        },
        {
          en: "Now, each test file should import `test` from our fixtures file instead of `@playwright/test`.",
          uk: "Тепер кожен тестовий файл має імпортувати `test` з нашого файлу фікстур замість `@playwright/test`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-12",
          language: "js",
          code: "\n// Import project utils for managing users in the test database.\n\nexport * from '@playwright/test';\nexport const test = baseTest.extend({\n  // Returns db user name unique for the worker.\n  dbUserName: [async ({ }, use) => {\n    // Use workerIndex as a unique identifier for each worker.\n    const userName = `user-${test.info().workerIndex}`;\n    // Initialize user in the database.\n    await createUserInTestDatabase(userName);\n    await use(userName);\n    // Clean up after the tests are done.\n    await deleteUserFromTestDatabase(userName);\n  }, { scope: 'worker' }],\n});",
        },
        {
          id: "cb-13",
          language: "js",
          code: "// Important: import our fixtures.\n\ntest('test', async ({ dbUserName }) => {\n  // Use the user name in the test.\n});",
        },
      ],
    },
    {
      id: "control-test-order",
      title: {
        en: "Control test order",
        uk: "Керування порядком тестів",
      },
      paragraphs: [
        {
          en: "Playwright Test runs tests from a single file in the order of declaration, unless you [parallelize tests in a single file](#parallelize-tests-in-a-single-file).",
          uk: "Playwright Test виконує тести з одного файлу в порядку оголошення, якщо ви не [паралелізуєте тести в одному файлі](#parallelize-tests-in-a-single-file).",
        },
        {
          en: 'There is no guarantee about the order of test execution across the files, because Playwright Test runs test files in parallel by default. However, if you [disable parallelism](#disable-parallelism), you can control test order by either naming your files in alphabetical order or using a "test list" file.',
          uk: "Порядок виконання тестів між файлами не гарантується, оскільки за замовчуванням Playwright Test запускає файли паралельно. Однак якщо [вимкнути паралелізм](#disable-parallelism), порядок можна керувати, називаючи файли в алфавітному порядку або використовуючи файл «списку тестів».",
        },
        {
          en: "### Sort test files alphabetically",
          uk: "### Сортування тестових файлів за алфавітом",
        },
        {
          en: "When you **disable parallel test execution**, Playwright Test runs test files in alphabetical order. You can use some naming convention to control the test order, for example `001-user-signin-flow.spec.ts`, `002-create-new-document.spec.ts` and so on.",
          uk: "Якщо **вимкнути паралельне виконання тестів**, Playwright Test запускає тестові файли в алфавітному порядку. Можна використати угоду про іменування, наприклад `001-user-signin-flow.spec.ts`, `002-create-new-document.spec.ts` тощо.",
        },
        {
          en: '### Use a "test list" file',
          uk: "### Використання файлу «списку тестів»",
        },
        {
          en: "You can put your tests in helper functions in multiple files. Consider the following example where tests are not defined directly in the file, but rather in a wrapper function.",
          uk: "Тести можна розмістити в допоміжних функціях у кількох файлах. Розгляньте приклад, коли тести визначені не безпосередньо в файлі, а в обгортковій функції.",
        },
        {
          en: "You can create a test list file that will control the order of tests - first run `feature-b` tests, then `feature-a` tests. Note how each test file is wrapped in a `test.describe()` block that calls the function where tests are defined. This way `test.use()` calls only affect tests from a single file.",
          uk: "Можна створити файл списку тестів, який керуватиме порядком: спочатку тести `feature-b`, потім `feature-a`. Зверніть увагу: кожен тестовий файл обгорнуто в блоці `test.describe()`, який викликає функцію з визначеннями тестів. Тоді виклики `test.use()` впливають лише на тести з одного файлу.",
        },
        {
          en: "Now **disable parallel execution** by setting workers to one, and specify your test list file.",
          uk: "Тепер **вимкніть паралельне виконання**, встановивши одного воркера, і вкажіть файл списку тестів.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-14",
          language: "js",
          code: "\nexport default function createTests() {\n  test('feature-a example test', async ({ page }) => {\n    // ... test goes here\n  });\n}",
        },
        {
          id: "cb-15",
          language: "js",
          code: "\nexport default function createTests() {\n  test.use({ viewport: { width: 500, height: 500 } });\n\n  test('feature-b example test', async ({ page }) => {\n    // ... test goes here\n  });\n}",
        },
        {
          id: "cb-16",
          language: "js",
          code: "\ntest.describe(featureBTests);\ntest.describe(featureATests);",
        },
        {
          id: "cb-17",
          language: "js",
          code: "\nexport default defineConfig({\n  workers: 1,\n  testMatch: 'test.list.ts',\n});",
        },
      ],
    },
  ],
  quiz: [],
}
