import type { PlaywrightTopic } from "../../types"

export const authTopic: PlaywrightTopic = {
  slug: "auth",
  groupId: "guides",
  order: 120,
  level: "intermediate",
  trackOrder: 17,
  sourceDoc: "auth.md",
  officialDocsUrl: "https://playwright.dev/docs/auth",
  title: {
    en: "Authentication",
    uk: "Автентифікація",
  },
  summary: {
    en: "Playwright executes tests in isolated environments called [browser contexts](./browser-contexts.md). This isolation model improves reproducibility and prevents cascading test failures. Tests can load existing authenticated state. This eliminates the need to authenticate in every test and speeds up test execution.",
    uk: "Playwright запускає тести в ізольованих середовищах — [browser contexts](./browser-contexts.md). Це підвищує відтворюваність і запобігає ланцюговим падінням. Тести можуть підвантажувати вже збережений автентифікований стан, щоб не логінитися в кожному тесті й прискорити прогін.",
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
          en: "Playwright executes tests in isolated environments called [browser contexts](./browser-contexts.md). This isolation model improves reproducibility and prevents cascading test failures. Tests can load existing authenticated state. This eliminates the need to authenticate in every test and speeds up test execution.",
          uk: "Playwright запускає тести в ізольованих середовищах — [browser contexts](./browser-contexts.md). Це підвищує відтворюваність і запобігає ланцюговим падінням. Тести можуть підвантажувати вже збережений автентифікований стан, щоб не логінитися в кожному тесті й прискорити прогін.",
        },
      ],
    },
    {
      id: "core-concepts",
      title: {
        en: "Core concepts",
        uk: "Основні поняття",
      },
      paragraphs: [
        {
          en: "Regardless of the authentication strategy you choose, you are likely to store authenticated browser state on the file system.",
          uk: "Незалежно від обраної стратегії автентифікації, стан браузера зазвичай зберігають у файловій системі.",
        },
        {
          en: "We recommend to create `playwright/.auth` directory and add it to your `.gitignore`. Your authentication routine will produce authenticated browser state and save it to a file in this `playwright/.auth` directory. Later on, tests will reuse this state and start already authenticated.",
          uk: "Створіть каталог `playwright/.auth` і додайте його до `.gitignore`. Процедура логіну збере автентифікований стан браузера у файл у цьому каталозі; далі тести підхоплюватимуть цей стан і стартуватимуть уже з сесією.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "mkdir -p playwright/.auth\necho $'\\nplaywright/.auth' >> .gitignore",
        },
        {
          id: "cb-2",
          language: "batch",
          code: 'md playwright\\.auth\necho. >> .gitignore\necho "playwright/.auth" >> .gitignore',
        },
        {
          id: "cb-3",
          language: "powershell",
          code: 'New-Item -ItemType Directory -Force -Path playwright\\.auth\nAdd-Content -path .gitignore "`r`nplaywright/.auth"',
        },
      ],
    },
    {
      id: "basic-shared-account-in-all-tests",
      title: {
        en: "Basic: shared account in all tests",
        uk: "Базовий рівень: спільний обліковий запис у всіх тестах",
      },
      paragraphs: [
        {
          en: "This is the **recommended** approach for tests **without server-side state**. Authenticate once in the **setup project**, save the authentication state, and then reuse it to bootstrap each test already authenticated.",
          uk: "**Рекомендовано** для тестів **без зміни серверного стану**: один раз автентифікуйтеся в **setup project**, збережіть стан і підвантажуйте його в кожному тесті.",
        },
        {
          en: "**When to use**\n- When you can imagine all your tests running at the same time with the same account, without affecting each other.",
          uk: "**Коли підходить**\n- Усі тести можуть одночасно працювати з одним обліковим записом і не заважати одне одному.",
        },
        {
          en: "**When not to use**\n- Your tests modify server-side state. For example, one test checks the rendering of the settings page, while the other test is changing the setting, and you run tests in parallel. In this case, tests must use different accounts.\n- Your authentication is browser-specific.",
          uk: "**Коли не підходить**\n- Тести змінюють серверний стан (наприклад, один рендерить сторінку налаштувань, інший змінює налаштування при паралельному запуску) — потрібні різні облікові записи.\n- Автентифікація прив’язана до конкретного браузера.",
        },
        {
          en: "**Details**",
          uk: "**Деталі**",
        },
        {
          en: "Create `tests/auth.setup.ts` that will prepare authenticated browser state for all other tests.",
          uk: "Створіть `tests/auth.setup.ts`, який підготує автентифікований стан браузера для інших тестів.",
        },
        {
          en: "Create a new `setup` project in the config and declare it as a [dependency](./test-projects.md#dependencies) for all your testing projects. This project will always run and authenticate before all the tests. All testing projects should use the authenticated state as `storageState`.",
          uk: "Додайте проєкт `setup` у конфіг і оголосіть його [залежністю](./test-projects.md#dependencies) для тестових проєктів. Він завжди виконається першим і виконає логін. Усі тестові проєкти мають використовувати збережений стан через `storageState`.",
        },
        {
          en: "Tests start already authenticated because we specified `storageState` in the config.",
          uk: "Тести стартують уже з сесією, бо в конфігу вказано `storageState`.",
        },
        {
          en: "Note that you need to delete the stored state when it expires. If you don't need to keep the state between test runs, write the browser state under [`property: TestProject.outputDir`], which is automatically cleaned up before every test run.",
          uk: "Коли термін дії стану минув — видаліть файл. Якщо стан не потрібен між прогонами, пишіть його в [`property: TestProject.outputDir`]: каталог очищується перед кожним запуском.",
        },
        {
          en: "### Authenticating in UI mode",
          uk: "### Автентифікація в UI mode",
        },
        {
          en: "UI mode will not run the `setup` project by default to improve testing speed. We recommend to authenticate by manually running the `auth.setup.ts` from time to time, whenever existing authentication expires.",
          uk: "У UI mode проєкт `setup` за замовчуванням не запускається (швидкість). Періодично вручну запускайте `auth.setup.ts`, коли сесія протермінується.",
        },
        {
          en: "First [enable the `setup` project in the filters](./test-ui-mode#filtering-tests), then click the triangle button next to `auth.setup.ts` file, and then disable the `setup` project in the filters again.",
          uk: "Спочатку [увімкніть `setup` у фільтрах](./test-ui-mode#filtering-tests), натисніть трикутник біля `auth.setup.ts`, потім знову вимкніть `setup` у фільтрах.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: "\nconst authFile = path.join(__dirname, '../playwright/.auth/user.json');\n\nsetup('authenticate', async ({ page }) => {\n  // Perform authentication steps. Replace these actions with your own.\n  await page.goto('https://github.com/login');\n  await page.getByLabel('Username or email address').fill('username');\n  await page.getByLabel('Password').fill('password');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  // Wait until the page receives the cookies.\n  //\n  // Sometimes login flow sets cookies in the process of several redirects.\n  // Wait for the final URL to ensure that the cookies are actually set.\n  await page.waitForURL('https://github.com/');\n  // Alternatively, you can wait until the page reaches a state where all cookies are set.\n  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();\n\n  // End of authentication steps.\n\n  await page.context().storageState({ path: authFile });\n});",
        },
        {
          id: "cb-5",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    // Setup project\n    { name: 'setup', testMatch: /.*\\.setup\\.ts/ },\n\n    {\n      name: 'chromium',\n      use: {\n        ...devices['Desktop Chrome'],\n        // Use prepared auth state.\n        storageState: 'playwright/.auth/user.json',\n      },\n      dependencies: ['setup'],\n    },\n\n    {\n      name: 'firefox',\n      use: {\n        ...devices['Desktop Firefox'],\n        // Use prepared auth state.\n        storageState: 'playwright/.auth/user.json',\n      },\n      dependencies: ['setup'],\n    },\n  ],\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "\ntest('test', async ({ page }) => {\n  // page is authenticated\n});",
        },
      ],
    },
    {
      id: "moderate-one-account-per-parallel-worker",
      title: {
        en: "Moderate: one account per parallel worker",
        uk: "Середній рівень: один обліковий запис на паралельного воркера",
      },
      paragraphs: [
        {
          en: "This is the **recommended** approach for tests that **modify server-side state**. In Playwright, worker processes run in parallel. In this approach, each parallel worker is authenticated once. All tests ran by worker are reusing the same authentication state. We will need multiple testing accounts, one per each parallel worker.",
          uk: "**Рекомендовано**, коли тести **змінюють серверний стан**: воркери Playwright працюють паралельно; кожен воркер логіниться один раз і всі його тести ділять один `storageState`. Потрібно кілька тестових облікових записів — по одному на воркер.",
        },
        {
          en: "**When to use**\n- Your tests modify shared server-side state. For example, one test checks the rendering of the settings page, while the other test is changing the setting.",
          uk: "**Коли підходить**\n- Тести змінюють спільний серверний стан (наприклад, один перевіряє рендер налаштувань, інший їх змінює).",
        },
        {
          en: "**When not to use**\n- Your tests do not modify any shared server-side state. In this case, all tests can use a single shared account.",
          uk: "**Коли не підходить**\n- Немає спільних змін на сервері — достатньо одного спільного облікового запису.",
        },
        {
          en: "**Details**",
          uk: "**Деталі**",
        },
        {
          en: "We will authenticate once per [worker process](./test-parallel.md#worker-processes), each with a unique account.",
          uk: "Логін виконується один раз на [worker process](./test-parallel.md#worker-processes) з унікальним обліковим записом.",
        },
        {
          en: "Create `playwright/fixtures.ts` file that will [override `storageState` fixture](./test-fixtures.md#overriding-fixtures) to authenticate once per worker. Use [`property: TestInfo.parallelIndex`] to differentiate between workers.",
          uk: "Створіть `playwright/fixtures.ts` і [перевизначте фікстуру `storageState`](./test-fixtures.md#overriding-fixtures), щоб автентифікуватися раз на воркер. Розрізняйте воркери через [`property: TestInfo.parallelIndex`].",
        },
        {
          en: "Now, each test file should import `test` from our fixtures file instead of `@playwright/test`. No changes are needed in the config.",
          uk: "У файлах тестів імпортуйте `test` з вашого `fixtures`, а не з `@playwright/test`. Конфіг змінювати не обов’язково.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "js",
          code: "\nexport * from '@playwright/test';\nexport const test = baseTest.extend({\n  // Use the same storage state for all tests in this worker.\n  storageState: ({ workerStorageState }, use) => use(workerStorageState),\n\n  // Authenticate once per worker with a worker-scoped fixture.\n  workerStorageState: [async ({ browser }, use) => {\n    // Use parallelIndex as a unique identifier for each worker.\n    const id = test.info().parallelIndex;\n    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);\n\n    if (fs.existsSync(fileName)) {\n      // Reuse existing authentication state if any.\n      await use(fileName);\n      return;\n    }\n\n    // Important: make sure we authenticate in a clean environment by unsetting storage state.\n    const page = await browser.newPage({ storageState: undefined });\n\n    // Acquire a unique account, for example create a new one.\n    // Alternatively, you can have a list of precreated accounts for testing.\n    // Make sure that accounts are unique, so that multiple team members\n    // can run tests at the same time without interference.\n    const account = await acquireAccount(id);\n\n    // Perform authentication steps. Replace these actions with your own.\n    await page.goto('https://github.com/login');\n    await page.getByLabel('Username or email address').fill(account.username);\n    await page.getByLabel('Password').fill(account.password);\n    await page.getByRole('button', { name: 'Sign in' }).click();\n    // Wait until the page receives the cookies.\n    //\n    // Sometimes login flow sets cookies in the process of several redirects.\n    // Wait for the final URL to ensure that the cookies are actually set.\n    await page.waitForURL('https://github.com/');\n    // Alternatively, you can wait until the page reaches a state where all cookies are set.\n    await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();\n\n    // End of authentication steps.\n\n    await page.context().storageState({ path: fileName });\n    await page.close();\n    await use(fileName);\n  }, { scope: 'worker' }],\n});",
        },
        {
          id: "cb-8",
          language: "js",
          code: "// Important: import our fixtures.\n\ntest('test', async ({ page }) => {\n  // page is authenticated\n});",
        },
      ],
    },
    {
      id: "signing-in-before-each-test",
      title: {
        en: "Signing in before each test",
        uk: "Вхід перед кожним тестом",
      },
      paragraphs: [
        {
          en: "The Playwright API can [automate interaction](./input.md) with a login form.",
          uk: "Playwright API може [автоматизувати взаємодію](./input.md) з формою входу.",
        },
        {
          en: "The following example logs into GitHub. Once these steps are executed,\nthe browser context will be authenticated.",
          uk: "Нижче — приклад входу в GitHub. Після цих кроків\nbrowser context буде автентифікований.",
        },
        {
          en: "Redoing login for every test can slow down test execution. To mitigate that, reuse\nexisting authentication state instead.",
          uk: "Повторний логін у кожному тесті сповільнює прогін. Краще повторно використовувати\nзбережений стан автентифікації.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "ts",
          code: "import { test, expect } from '@playwright/test';\n\ntest('sign in on GitHub', async ({ page }) => {\n  await page.goto('https://github.com/login');\n  await page.getByLabel('Username or email address').fill('username');\n  await page.getByLabel('Password').fill('password');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();\n});",
        },
      ],
    },
    {
      id: "reusing-signed-in-state",
      title: {
        en: "Reusing signed in state",
        uk: "Повторне використання стану входу",
      },
      paragraphs: [
        {
          en: "Playwright provides a way to reuse the signed-in state in the tests. That way you can log\nin only once and then skip the log in step for all of the tests.",
          uk: "Playwright дозволяє повторно використовувати стан входу в тестах: залогінитися один раз\nі пропускати крок входу в решті тестів.",
        },
        {
          en: "Web apps use cookie-based or token-based authentication, where authenticated state is stored as [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), in [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) or in [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Playwright provides [`method: BrowserContext.storageState`] method that can be used to retrieve storage state from authenticated contexts and then create new contexts with prepopulated state.",
          uk: "Вебзастосунки зберігають автентифікацію в [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) або [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Метод [`method: BrowserContext.storageState`] зчитує стан з автентифікованого context і дозволяє створювати нові context з уже заповненим станом.",
        },
        {
          en: "Cookies, local storage and IndexedDB state can be used across different browsers. They depend on your application's authentication model which may require some combination of cookies, local storage or IndexedDB.",
          uk: "Cookies, local storage і IndexedDB можна переносити між браузерами залежно від моделі автентифікації застосунку (комбінація цих сховищ).",
        },
        {
          en: "The following code snippet retrieves state from an authenticated context and creates a new context with that state.",
          uk: "Фрагмент коду нижче зберігає стан з автентифікованого context і відкриває новий context з цим станом.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-13",
          language: "ts",
          code: "// After interactive login in a test, persist cookies/storage to a file:\nawait page.context().storageState({ path: 'playwright/.auth/state.json' });\n\n// Later — open a new browser context with the same authentication:\nimport { chromium } from '@playwright/test';\n\nconst browser = await chromium.launch();\nconst context = await browser.newContext({\n  storageState: 'playwright/.auth/state.json',\n});\nconst newPage = await context.newPage();",
        },
      ],
    },
    {
      id: "advanced-scenarios",
      title: {
        en: "Advanced scenarios",
        uk: "Складні сценарії",
      },
      paragraphs: [
        {
          en: "### Authenticate with API request",
          uk: "### Автентифікація через API-запит",
        },
        {
          en: "**When to use**\n- Your web application supports authenticating via API that is easier/faster than interacting with the app UI.",
          uk: "**Коли підходить**\n- Застосунок підтримує вхід через API швидше/простіше, ніж через UI.",
        },
        {
          en: "**Details**",
          uk: "**Деталі**",
        },
        {
          en: "We will send the API request with [APIRequestContext] and then save authenticated state as usual.",
          uk: "Надішліть запит через [APIRequestContext], потім збережіть стан так само, як при UI-логіні.",
        },
        {
          en: "In the [setup project](#basic-shared-account-in-all-tests):",
          uk: "У [setup project](#basic-shared-account-in-all-tests):",
        },
        {
          en: "Alternatively, in a [worker fixture](#moderate-one-account-per-parallel-worker):",
          uk: "Або в [worker fixture](#moderate-one-account-per-parallel-worker):",
        },
        {
          en: "### Multiple signed in roles",
          uk: "### Кілька ролей з різним входом",
        },
        {
          en: "**When to use**\n- You have more than one role in your end to end tests, but you can reuse accounts across all tests.",
          uk: "**Коли підходить**\n- У e2e є кілька ролей, але облікові записи можна повторно використовувати в усіх тестах.",
        },
        {
          en: "**Details**",
          uk: "**Деталі**",
        },
        {
          en: "We will authenticate multiple times in the setup project.",
          uk: "У setup project виконуємо кілька окремих входів.",
        },
        {
          en: "After that, specify `storageState` for each test file or test group, **instead of** setting it in the config.",
          uk: "Далі вказуйте `storageState` для кожного файла або групи тестів, **а не** глобально в конфігу.",
        },
        {
          en: "See also about [authenticating in the UI mode](#authenticating-in-ui-mode).",
          uk: "Див. також [автентифікацію в UI mode](#authenticating-in-ui-mode).",
        },
        {
          en: "### Testing multiple roles together",
          uk: "### Тестування кількох ролей разом",
        },
        {
          en: "**When to use**\n- You need to test how multiple authenticated roles interact together, in a single test.",
          uk: "**Коли підходить**\n- Потрібно перевірити взаємодію кількох автентифікованих ролей в одному тесті.",
        },
        {
          en: "**Details**",
          uk: "**Деталі**",
        },
        {
          en: "Use multiple [BrowserContext]s and [Page]s with different storage states in the same test.",
          uk: "У межах одного тесту використовуйте кілька [BrowserContext] і [Page] з різним `storageState`.",
        },
        {
          en: "### Testing multiple roles with POM fixtures",
          uk: "### Кілька ролей через POM-фікстури",
        },
        {
          en: "**When to use**\n- You need to test how multiple authenticated roles interact together, in a single test.",
          uk: "**Коли підходить**\n- Потрібно перевірити взаємодію кількох автентифікованих ролей в одному тесті.",
        },
        {
          en: "**Details**",
          uk: "**Деталі**",
        },
        {
          en: "You can introduce fixtures that will provide a page authenticated as each role.",
          uk: "Додайте фікстури, що повертають сторінку вже залогінену під кожну роль.",
        },
        {
          en: "Below is an example that [creates fixtures](./test-fixtures.md#creating-a-fixture) for two [Page Object Models](./pom.md) - admin POM and user POM. It assumes `adminStorageState.json` and `userStorageState.json` files were created in the global setup.",
          uk: "Нижче — приклад [створення фікстур](./test-fixtures.md#creating-a-fixture) для двох [Page Object Models](./pom.md): адмін і користувач. Передбачається, що файли `adminStorageState.json` і `userStorageState.json` створені в global setup.",
        },
        {
          en: "### Session storage",
          uk: "### Session storage",
        },
        {
          en: "Reusing authenticated state covers [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) and [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) based authentication. Rarely, [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) is used for storing information associated with the signed-in state. Session storage is specific to a particular domain and is not persisted across page loads. Playwright does not provide API to persist session storage, but the following snippet can be used to save/load session storage.",
          uk: "Повторне використання стану покриває автентифікацію на [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage) і [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Рідше стан тримають у [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage): він прив’язаний до домену й не переживає перезавантаження сторінки. Окремого API Playwright для збереження session storage немає, але можна зберегти/відновити вручну, як у фрагменті нижче.",
        },
        {
          en: "### Avoid authentication in some tests",
          uk: "### Обійти автентифікацію в окремих тестах",
        },
        {
          en: "You can reset storage state in a test file to avoid authentication that was set up for the whole project.",
          uk: "У файлі тесту можна скинути `storageState`, щоб не використовувати проєктний логін.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-17",
          language: "js",
          code: "\nconst authFile = 'playwright/.auth/user.json';\n\nsetup('authenticate', async ({ request }) => {\n  // Send authentication request. Replace with your own.\n  await request.post('https://github.com/login', {\n    form: {\n      'user': 'user',\n      'password': 'password'\n    }\n  });\n  await request.storageState({ path: authFile });\n});",
        },
        {
          id: "cb-18",
          language: "js",
          code: "\nexport * from '@playwright/test';\nexport const test = baseTest.extend({\n  // Use the same storage state for all tests in this worker.\n  storageState: ({ workerStorageState }, use) => use(workerStorageState),\n\n  // Authenticate once per worker with a worker-scoped fixture.\n  workerStorageState: [async ({}, use) => {\n    // Use parallelIndex as a unique identifier for each worker.\n    const id = test.info().parallelIndex;\n    const fileName = path.resolve(test.info().project.outputDir, `.auth/${id}.json`);\n\n    if (fs.existsSync(fileName)) {\n      // Reuse existing authentication state if any.\n      await use(fileName);\n      return;\n    }\n\n    // Important: make sure we authenticate in a clean environment by unsetting storage state.\n    const context = await request.newContext({ storageState: undefined });\n\n    // Acquire a unique account, for example create a new one.\n    // Alternatively, you can have a list of precreated accounts for testing.\n    // Make sure that accounts are unique, so that multiple team members\n    // can run tests at the same time without interference.\n    const account = await acquireAccount(id);\n\n    // Send authentication request. Replace with your own.\n    await context.post('https://github.com/login', {\n      form: {\n        'user': 'user',\n        'password': 'password'\n      }\n    });\n\n    await context.storageState({ path: fileName });\n    await context.dispose();\n    await use(fileName);\n  }, { scope: 'worker' }],\n});",
        },
        {
          id: "cb-19",
          language: "js",
          code: "\nconst adminFile = 'playwright/.auth/admin.json';\n\nsetup('authenticate as admin', async ({ page }) => {\n  // Perform authentication steps. Replace these actions with your own.\n  await page.goto('https://github.com/login');\n  await page.getByLabel('Username or email address').fill('admin');\n  await page.getByLabel('Password').fill('password');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  // Wait until the page receives the cookies.\n  //\n  // Sometimes login flow sets cookies in the process of several redirects.\n  // Wait for the final URL to ensure that the cookies are actually set.\n  await page.waitForURL('https://github.com/');\n  // Alternatively, you can wait until the page reaches a state where all cookies are set.\n  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();\n\n  // End of authentication steps.\n\n  await page.context().storageState({ path: adminFile });\n});\n\nconst userFile = 'playwright/.auth/user.json';\n\nsetup('authenticate as user', async ({ page }) => {\n  // Perform authentication steps. Replace these actions with your own.\n  await page.goto('https://github.com/login');\n  await page.getByLabel('Username or email address').fill('user');\n  await page.getByLabel('Password').fill('password');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  // Wait until the page receives the cookies.\n  //\n  // Sometimes login flow sets cookies in the process of several redirects.\n  // Wait for the final URL to ensure that the cookies are actually set.\n  await page.waitForURL('https://github.com/');\n  // Alternatively, you can wait until the page reaches a state where all cookies are set.\n  await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();\n\n  // End of authentication steps.\n\n  await page.context().storageState({ path: userFile });\n});",
        },
        {
          id: "cb-20",
          language: "js",
          code: "\ntest.use({ storageState: 'playwright/.auth/admin.json' });\n\ntest('admin test', async ({ page }) => {\n  // page is authenticated as admin\n});\n\ntest.describe(() => {\n  test.use({ storageState: 'playwright/.auth/user.json' });\n\n  test('user test', async ({ page }) => {\n    // page is authenticated as a user\n  });\n});",
        },
        {
          id: "cb-21",
          language: "js",
          code: "\ntest('admin and user', async ({ browser }) => {\n  // adminContext and all pages inside, including adminPage, are signed in as \"admin\".\n  const adminContext = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });\n  const adminPage = await adminContext.newPage();\n\n  // userContext and all pages inside, including userPage, are signed in as \"user\".\n  const userContext = await browser.newContext({ storageState: 'playwright/.auth/user.json' });\n  const userPage = await userContext.newPage();\n\n  // ... interact with both adminPage and userPage ...\n\n  await adminContext.close();\n  await userContext.close();\n});",
        },
        {
          id: "cb-22",
          language: "js",
          code: '\n// Page Object Model for the "admin" page.\n// Here you can add locators and helper methods specific to the admin page.\nclass AdminPage {\n  // Page signed in as "admin".\n  page: Page;\n\n  // Example locator pointing to "Welcome, Admin" greeting.\n  greeting: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.greeting = page.locator(\'#greeting\');\n  }\n}\n\n// Page Object Model for the "user" page.\n// Here you can add locators and helper methods specific to the user page.\nclass UserPage {\n  // Page signed in as "user".\n  page: Page;\n\n  // Example locator pointing to "Welcome, User" greeting.\n  greeting: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.greeting = page.locator(\'#greeting\');\n  }\n}\n\n// Declare the types of your fixtures.\ntype MyFixtures = {\n  adminPage: AdminPage;\n  userPage: UserPage;\n};\n\nexport * from \'@playwright/test\';\nexport const test = base.extend({\n  adminPage: async ({ browser }, use) => {\n    const context = await browser.newContext({ storageState: \'playwright/.auth/admin.json\' });\n    const adminPage = new AdminPage(await context.newPage());\n    await use(adminPage);\n    await context.close();\n  },\n  userPage: async ({ browser }, use) => {\n    const context = await browser.newContext({ storageState: \'playwright/.auth/user.json\' });\n    const userPage = new UserPage(await context.newPage());\n    await use(userPage);\n    await context.close();\n  },\n});',
        },
        {
          id: "cb-23",
          language: "js",
          code: "// Import test with our new fixtures.\n\n// Use adminPage and userPage fixtures in the test.\ntest('admin and user', async ({ adminPage, userPage }) => {\n  // ... interact with both adminPage and userPage ...\n  await expect(adminPage.greeting).toHaveText('Welcome, Admin');\n  await expect(userPage.greeting).toHaveText('Welcome, User');\n});",
        },
        {
          id: "cb-24",
          language: "js",
          code: "// Get session storage and store as env variable\nconst sessionStorage = await page.evaluate(() => JSON.stringify(sessionStorage));\nfs.writeFileSync('playwright/.auth/session.json', sessionStorage, 'utf-8');\n\n// Set session storage in a new context\nconst sessionStorage = JSON.parse(fs.readFileSync('playwright/.auth/session.json', 'utf-8'));\nawait context.addInitScript(storage => {\n  if (window.location.hostname === 'example.com') {\n    for (const [key, value] of Object.entries(storage))\n      window.sessionStorage.setItem(key, value);\n  }\n}, sessionStorage);",
        },
        {
          id: "cb-29",
          language: "js",
          code: "\n// Reset storage state for this file to avoid being authenticated\ntest.use({ storageState: { cookies: [], origins: [] } });\n\ntest('not signed in test', async ({ page }) => {\n  // ...\n});",
        },
      ],
    },
  ],
  quiz: [],
}
