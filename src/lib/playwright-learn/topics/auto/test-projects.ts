import type { PlaywrightTopic } from "../../types"

export const testProjectsTopic: PlaywrightTopic = {
  slug: "test-projects",
  groupId: "test-runner",
  order: 355,
  level: "intermediate",
  trackOrder: 8,
  sourceDoc: "test-projects-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-projects",
  title: {
    en: "Projects",
    uk: "Проєкти",
  },
  summary: {
    en: "A project is a named configuration that tests run with. I use projects for three things: running the same tests across browsers (chromium/firefox/webkit), running the same tests against staging vs production, and setting up a 'setup' project that logs in once before all other tests run. The setup project with dependencies is the pattern I use most.",
    uk: "Проєкт — це іменована конфігурація з якою виконуються тести. Я використовую проєкти для трьох речей: запуск тих самих тестів у різних браузерах (chromium/firefox/webkit), запуск тих самих тестів проти staging vs production, і налаштування проєкту 'setup' який логіниться один раз перед виконанням всіх інших тестів. Проєкт setup із залежностями — патерн який я використовую найчастіше.",
  },
  sections: [
    {
      id: "multi-browser",
      title: {
        en: "Cross-browser testing",
        uk: "Тестування в кількох браузерах",
      },
      paragraphs: [
        {
          en: "The most common use of projects: run everything in three browsers. `devices['Desktop Chrome']` spreads in all the Chrome-specific settings (viewport, user agent, etc.). I pick the browsers based on the product's target audience — for a B2B SaaS I usually test Chromium and Firefox, skip WebKit unless the product has Mac users doing critical flows.",
          uk: "Найпоширеніше використання проєктів: запуск всього в трьох браузерах. `devices['Desktop Chrome']` розгортає всі Chrome-специфічні налаштування (viewport, user agent тощо). Я вибираю браузери виходячи з цільової аудиторії продукту — для B2B SaaS зазвичай тестую Chromium і Firefox, пропускаю WebKit якщо у продукту немає Mac-користувачів на критичних flow.",
        },
      ],
      codeBlocks: [
        {
          id: "multi-browser-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Мобільні пристрої
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
})`,
        },
        {
          id: "run-specific-project",
          language: "bash",
          code: `# Запустити всі проєкти
npx playwright test

# Запустити тільки Firefox
npx playwright test --project=firefox`,
        },
      ],
    },
    {
      id: "multi-environment",
      title: {
        en: "Testing against multiple environments",
        uk: "Тестування в кількох середовищах",
      },
      paragraphs: [
        {
          en: "I use this pattern when I want to run the same tests against staging (with retries, more lenient) and production (no retries, must pass clean). Each project gets its own `baseURL` and retry count. The global `timeout` is shared.",
          uk: "Цей патерн використовую коли хочу запустити ті самі тести проти staging (з повторами, більш поблажливо) і production (без повторів, має пройти чисто). Кожен проєкт отримує власний `baseURL` і кількість повторів. Глобальний `timeout` спільний.",
        },
      ],
      codeBlocks: [
        {
          id: "multi-env-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  timeout: 60000,
  projects: [
    {
      name: 'staging',
      use: { baseURL: 'https://staging.mycrm.com' },
      retries: 2,
    },
    {
      name: 'production',
      use: { baseURL: 'https://mycrm.com' },
      retries: 0,
    },
  ],
})`,
        },
      ],
    },
    {
      id: "setup-project",
      title: {
        en: "Setup project — login once, share auth state",
        uk: "Setup-проєкт — логін один раз, ділитися станом авторизації",
      },
      diagram: {
        mermaid: `flowchart LR
  SP["setup project\nauth.setup.ts\n(log in once)"] -->|"saves storageState"| SF["playwright/.auth/user.json"]
  SF --> CP["chromium project\n(reads storageState)"]
  SF --> FP["firefox project\n(reads storageState)"]
  SF --> WP["webkit project\n(reads storageState)"]
  SP -.->|"dependency"| CP & FP & WP`,
        caption: {
          en: "The setup project runs once; all browser projects depend on it and load the saved auth state — no test logs in again",
          uk: "Setup-проєкт виконується один раз; всі браузерні проєкти залежать від нього і завантажують збережений стан авторизації",
        },
      },
      paragraphs: [
        {
          en: "This is the pattern I use most. A `setup` project runs `auth.setup.ts` which logs into the CRM, saves the auth state to a file. Then the browser projects list `setup` as a dependency — they wait for setup to finish, then start in parallel using the saved auth state. No test has to log in again.",
          uk: "Це патерн який я використовую найчастіше. Проєкт `setup` запускає `auth.setup.ts` який логіниться в CRM, зберігає стан авторизації у файл. Потім браузерні проєкти вказують `setup` як залежність — вони чекають завершення setup, потім стартують паралельно використовуючи збережений стан авторизації. Жодному тесту більше не потрібно логінитися.",
        },
        {
          en: "The `storageState` path in each browser project points to the file that the setup project created. Playwright automatically passes this state to every browser context in that project.",
          uk: "Шлях `storageState` у кожному браузерному проєкті вказує на файл який створив setup-проєкт. Playwright автоматично передає цей стан кожному browser context у тому проєкті.",
        },
      ],
      codeBlocks: [
        {
          id: "setup-project-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
})`,
        },
        {
          id: "auth-setup-file",
          language: "ts",
          code: `// auth.setup.ts
import { test as setup } from '@playwright/test'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('test@mycrm.com')
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/dashboard')

  // Зберегти стан авторизації для всіх тестів
  await page.context().storageState({ path: 'playwright/.auth/user.json' })
})`,
        },
      ],
    },
    {
      id: "splitting-by-type",
      title: {
        en: "Splitting tests by type — smoke vs full suite",
        uk: "Розподіл тестів за типом — smoke vs повний набір",
      },
      paragraphs: [
        {
          en: "I use `testMatch` and `testIgnore` to create a smoke project that runs only the most critical tests without retries, and a full project that runs everything with retries. On PRs I run only smoke; on merge to main I run the full suite.",
          uk: "Використовую `testMatch` і `testIgnore` щоб створити smoke-проєкт який виконує лише найкритичніші тести без повторів, і повний проєкт який виконує все з повторами. На PR запускаю тільки smoke; на злиття в main — повний набір.",
        },
      ],
      codeBlocks: [
        {
          id: "split-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  timeout: 60000,
  projects: [
    {
      name: 'Smoke',
      testMatch: /.*smoke\.spec\.ts/,
      retries: 0,
    },
    {
      name: 'Full',
      testIgnore: /.*smoke\.spec\.ts/,
      retries: 2,
    },
  ],
})`,
        },
        {
          id: "run-smoke",
          language: "bash",
          code: `# Запустити тільки smoke тести на PR
npx playwright test --project=Smoke

# Запустити всі тести на злиття
npx playwright test --project=Full`,
        },
      ],
    },
    {
      id: "teardown",
      title: {
        en: "Teardown — cleanup after all tests finish",
        uk: "Teardown — прибирання після завершення всіх тестів",
      },
      paragraphs: [
        {
          en: "If the setup project creates data (test users, seeded orders), I add a teardown project to clean up after all tests finish. The `teardown` property on the setup project points to the project that runs the cleanup. Teardown runs after all dependent projects complete — even if some tests failed.",
          uk: "Якщо setup-проєкт створює дані (тестові юзери, засіяні замовлення) — додаю teardown-проєкт щоб прибрати після завершення всіх тестів. Властивість `teardown` на setup-проєкті вказує на проєкт який виконує прибирання. Teardown виконується після завершення всіх залежних проєктів — навіть якщо деякі тести впали.",
        },
      ],
      codeBlocks: [
        {
          id: "teardown-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: '**/*.setup.ts',
      teardown: 'cleanup',
    },
    {
      name: 'cleanup',
      testMatch: '**/*.teardown.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your setup project creates a test user and saves auth state. The chromium and firefox projects both depend on it. The setup project's test fails. What happens to the chromium and firefox tests?",
        uk: "Твій setup-проєкт створює тестового юзера і зберігає стан авторизації. Проєкти chromium і firefox обидва залежать від нього. Тест setup-проєкту падає. Що відбувається з тестами chromium і firefox?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Chromium and firefox tests run anyway using whatever auth state exists from a previous run",
            uk: "Тести chromium і firefox запускаються в будь-якому випадку використовуючи будь-який стан авторизації що існує з попереднього запуску",
          },
        },
        {
          id: "b",
          label: {
            en: "Chromium and firefox tests are skipped — Playwright won't run tests from a project if its dependency project failed",
            uk: "Тести chromium і firefox пропускаються — Playwright не запустить тести з проєкту якщо його залежний проєкт впав",
          },
        },
        {
          id: "c",
          label: {
            en: "Chromium and firefox tests run but each test gets a fresh login instead of using the saved auth state",
            uk: "Тести chromium і firefox запускаються але кожен тест отримує свіжий логін замість використання збереженого стану авторизації",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When a dependency project fails, Playwright skips all projects that depend on it. This is by design — if the setup failed, the dependent tests would likely fail too (missing auth state, missing test data), and running them would just produce noisy false failures. The reported outcome clearly shows the setup failure as the root cause. You can bypass this with `--no-deps` if you want to run the dependent projects anyway, but that's usually not what you want.",
        uk: "Коли залежний проєкт падає, Playwright пропускає всі проєкти що залежать від нього. Це навмисно — якщо setup впав, залежні тести теж, швидше за все, впадуть (відсутній стан авторизації, відсутні тестові дані), і їх запуск просто продукує галасливі false-падіння. У звіті падіння setup чітко відображається як першопричина. Можна обійти це через `--no-deps` якщо все одно хочеш запустити залежні проєкти, але зазвичай це не те що потрібно.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is a 'project' in the context of playwright.config.ts?",
        uk: "Що таке 'project' в контексті playwright.config.ts?",
      },
      options: [
        { id: "a", label: { en: "A separate npm package that contains a subset of tests", uk: "Окремий npm-пакет що містить підмножину тестів" } },
        { id: "b", label: { en: "A named configuration block in the projects array that determines which tests run and with what browser/use settings", uk: "Іменований блок конфігурації в масиві projects що визначає які тести запускаються і з якими налаштуваннями браузера/use" } },
        { id: "c", label: { en: "A GitHub Actions job that runs a subset of the test suite", uk: "GitHub Actions job що запускає підмножину тест-сьюту" } },
        { id: "d", label: { en: "A test file that exports a project configuration object", uk: "Тест-файл що експортує об'єкт конфігурації project" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "In Playwright a project is a named entry in the `projects` array of `playwright.config.ts`. Each project has a `name`, an optional `use` block that overrides global settings (browser, viewport, storageState, etc.), optional `testMatch`/`testIgnore` filters, and optional `dependencies`. Running `npx playwright test` executes all projects; `--project=firefox` runs only the named one.",
        uk: "У Playwright project — це іменований запис у масиві `projects` файлу `playwright.config.ts`. Кожен project має `name`, опціональний блок `use` що перевизначає глобальні налаштування (браузер, viewport, storageState тощо), опціональні фільтри `testMatch`/`testIgnore` та опціональні `dependencies`. Запуск `npx playwright test` виконує всі projects; `--project=firefox` запускає лише вказаний.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does spreading devices['Desktop Chrome'] into a project's use block do?",
        uk: "Що робить розгортання devices['Desktop Chrome'] в блок use проєкту?",
      },
      options: [
        { id: "a", label: { en: "It downloads the Chrome browser binary for that project", uk: "Завантажує бінарний файл браузера Chrome для цього проєкту" } },
        { id: "b", label: { en: "It applies a preset of Chrome-specific settings: viewport size, user agent, default device scale factor, and browser channel", uk: "Застосовує пресет Chrome-специфічних налаштувань: розмір viewport, user agent, масштабний коефіцієнт пристрою та канал браузера" } },
        { id: "c", label: { en: "It restricts the project to only run on machines that have Chrome installed", uk: "Обмежує project запуском лише на машинах де встановлено Chrome" } },
        { id: "d", label: { en: "It enables Chrome-specific APIs like the Chrome DevTools Protocol", uk: "Вмикає Chrome-специфічні API типу Chrome DevTools Protocol" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`devices` is a map exported by `@playwright/test` that contains real device presets. `devices['Desktop Chrome']` includes the viewport (`1280x720`), the Chrome user agent string, `defaultBrowserType: 'chromium'`, and other settings. Spreading it with `...devices['Desktop Chrome']` merges those settings into the project's `use` block, so you get realistic Chrome defaults without manually specifying every property.",
        uk: "`devices` — це map що експортується з `@playwright/test` і містить реальні пресети пристроїв. `devices['Desktop Chrome']` включає viewport (`1280x720`), рядок user agent Chrome, `defaultBrowserType: 'chromium'` та інші налаштування. Розгортання через `...devices['Desktop Chrome']` зливає ці налаштування в блок `use` проєкту, тому отримуєш реалістичні дефолти Chrome без ручного задання кожної властивості.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You want Chromium and Firefox projects to run tests from all files, but a third 'Mobile Safari' project should only run files matching **/*.mobile.spec.ts. How do you configure this?",
        uk: "Хочеш щоб проєкти Chromium і Firefox запускали тести з усіх файлів, але третій проєкт 'Mobile Safari' — лише файли що відповідають **/*.mobile.spec.ts. Як це налаштувати?",
      },
      options: [
        { id: "a", label: { en: "Add a testFilter array to the Mobile Safari project listing the allowed file patterns", uk: "Додати масив testFilter до проєкту Mobile Safari з переліком дозволених патернів файлів" } },
        { id: "b", label: { en: "Set testMatch: '**/*.mobile.spec.ts' on the Mobile Safari project — it overrides the global testMatch for that project only", uk: "Встановити testMatch: '**/*.mobile.spec.ts' на проєкті Mobile Safari — це перевизначає глобальний testMatch лише для цього проєкту" } },
        { id: "c", label: { en: "Add a @mobile tag to matching test files and run the Mobile Safari project with --grep @mobile", uk: "Додати тег @mobile до відповідних тест-файлів і запустити проєкт Mobile Safari з --grep @mobile" } },
        { id: "d", label: { en: "Move all mobile tests into a separate testDir and point the Mobile Safari project's testDir to that folder", uk: "Перемістити всі мобільні тести в окремий testDir і вказати testDir проєкту Mobile Safari на цю теку" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Each project can override the global `testMatch` (or `testDir`) with its own value. Setting `testMatch: '**/*.mobile.spec.ts'` on the Mobile Safari project means only files matching that glob will be collected for that project, while Chromium and Firefox — which have no `testMatch` override — collect from the global `testMatch` (defaulting to `**/*.spec.ts`). This is the cleanest way to split tests across projects without tagging.",
        uk: "Кожен project може перевизначити глобальний `testMatch` (або `testDir`) власним значенням. Встановлення `testMatch: '**/*.mobile.spec.ts'` на проєкті Mobile Safari означає що лише файли що відповідають цьому glob будуть зібрані для цього проєкту, тоді як Chromium і Firefox — які не мають перевизначення `testMatch` — збирають з глобального `testMatch` (дефолт `**/*.spec.ts`). Це найчистіший спосіб розподілити тести між проєктами без тегування.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "A setting in the global use block conflicts with a setting in a specific project's use block. Which value wins?",
        uk: "Налаштування в глобальному блоці use конфліктує з налаштуванням в блоці use конкретного проєкту. Яке значення перемагає?",
      },
      options: [
        { id: "a", label: { en: "The global use block always wins — project-level settings are ignored", uk: "Глобальний блок use завжди перемагає — налаштування рівня project ігноруються" } },
        { id: "b", label: { en: "The project-level use block wins — it overrides the global setting for that project", uk: "Блок use рівня project перемагає — він перевизначає глобальне налаштування для цього проєкту" } },
        { id: "c", label: { en: "Playwright merges both blocks using a deep merge — no setting wins, they combine", uk: "Playwright зливає обидва блоки через deep merge — жодне налаштування не перемагає, вони об'єднуються" } },
        { id: "d", label: { en: "Playwright throws a configuration error when there is a conflict", uk: "Playwright кидає помилку конфігурації при конфлікті" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Project-level `use` settings override global `use` settings for that project. This is the standard configuration inheritance pattern: set shared defaults globally (e.g. `baseURL`, `trace: 'on-first-retry'`) and let projects override what differs (e.g. `storageState`, `viewport`, `browserName`). Non-conflicting global settings are inherited by all projects.",
        uk: "Налаштування `use` рівня project перевизначають глобальні налаштування `use` для цього project. Це стандартний патерн успадкування конфігурації: встановлюй спільні дефолти глобально (наприклад `baseURL`, `trace: 'on-first-retry'`) і дозволяй projects перевизначати те що відрізняється (наприклад `storageState`, `viewport`, `browserName`). Неконфліктуючі глобальні налаштування успадковуються всіма projects.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you configure a teardown project that cleans up test data after all tests finish?",
        uk: "Як налаштувати teardown-проєкт що прибирає тестові дані після завершення всіх тестів?",
      },
      options: [
        { id: "a", label: { en: "Add afterAll: 'cleanup' to the top-level playwright.config.ts object", uk: "Додати afterAll: 'cleanup' до об'єкту верхнього рівня playwright.config.ts" } },
        { id: "b", label: { en: "Add teardown: 'cleanup' to the setup project, and create a separate 'cleanup' project with testMatch pointing to teardown files", uk: "Додати teardown: 'cleanup' до setup-проєкту і створити окремий 'cleanup' проєкт з testMatch що вказує на teardown-файли" } },
        { id: "c", label: { en: "Set globalTeardown to a teardown file path in playwright.config.ts", uk: "Встановити globalTeardown на шлях до teardown-файлу у playwright.config.ts" } },
        { id: "d", label: { en: "Use afterAll inside the test file and it will automatically run after the last test in the project", uk: "Використати afterAll всередині тест-файлу і він автоматично запуститься після останнього тесту в проєкті" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The project-dependency teardown system works via the `teardown` property on the setup project pointing to another project's name. The teardown project has its own `testMatch` (e.g. `**/*.teardown.ts`) and runs after all projects that depended on the setup project finish — even if tests failed. This is preferable to `globalTeardown` because it shows in the HTML report and supports Playwright fixtures.",
        uk: "Система teardown залежностей projects працює через властивість `teardown` на setup-проєкті що вказує на назву іншого project. Teardown-project має власний `testMatch` (наприклад `**/*.teardown.ts`) і виконується після завершення всіх projects що залежали від setup-project — навіть якщо тести впали. Це краще ніж `globalTeardown` тому що відображається у HTML-звіті і підтримує фікстури Playwright.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You run npx playwright test --project=chromium. Which projects execute?",
        uk: "Ти запускаєш npx playwright test --project=chromium. Які projects виконуються?",
      },
      options: [
        { id: "a", label: { en: "Only the chromium project — dependency projects are skipped", uk: "Лише проєкт chromium — залежні projects пропускаються" } },
        { id: "b", label: { en: "The chromium project and any projects listed in its dependencies array", uk: "Проєкт chromium та будь-які projects перераховані в його масиві dependencies" } },
        { id: "c", label: { en: "All projects run regardless of the --project flag", uk: "Всі projects запускаються незалежно від прапорця --project" } },
        { id: "d", label: { en: "Only projects whose name starts with 'chromium'", uk: "Лише projects назва яких починається з 'chromium'" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When you target a specific project with `--project=chromium`, Playwright also runs that project's `dependencies` (e.g. the `setup` project) automatically. Without the dependency running first, the chromium project would have no auth state to load. To skip dependencies explicitly (for local debugging), use `--no-deps`.",
        uk: "Коли ти вказуєш конкретний project через `--project=chromium` — Playwright також автоматично запускає `dependencies` цього project (наприклад setup-project). Без попереднього виконання залежності chromium-project не матиме стану авторизації для завантаження. Щоб явно пропустити залежності (для локального дебагу) — використовуй `--no-deps`.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Which CLI command runs only the project named 'firefox' from a multi-project configuration?",
        uk: "Яка CLI-команда запускає лише проєкт з назвою 'firefox' з конфігурації з кількома projects?",
      },
      options: [
        { id: "a", label: { en: "npx playwright test --browser=firefox", uk: "npx playwright test --browser=firefox" } },
        { id: "b", label: { en: "npx playwright test --project=firefox", uk: "npx playwright test --project=firefox" } },
        { id: "c", label: { en: "npx playwright test --run=firefox", uk: "npx playwright test --run=firefox" } },
        { id: "d", label: { en: "npx playwright test --filter-project=firefox", uk: "npx playwright test --filter-project=firefox" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`--project=<name>` is the CLI flag to select a specific project by its `name` field in the config. It matches exactly on the name string. You can pass `--project` multiple times to run several projects: `npx playwright test --project=firefox --project=webkit`. The `--browser` flag does not exist in Playwright's CLI — browsers are configured inside project `use` blocks.",
        uk: "`--project=<name>` — це CLI-прапорець для вибору конкретного project за його полем `name` у конфізі. Збігається точно по рядку назви. Можна передавати `--project` кілька разів щоб запустити кілька projects: `npx playwright test --project=firefox --project=webkit`. Прапорець `--browser` не існує в CLI Playwright — браузери налаштовуються всередині блоків `use` projects.",
      },
    },
  ],
}
