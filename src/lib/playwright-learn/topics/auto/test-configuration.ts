import type { PlaywrightTopic } from "../../types"

export const testConfigurationTopic: PlaywrightTopic = {
  slug: "test-configuration",
  groupId: "test-runner",
  order: 330,
  level: "intermediate",
  trackOrder: 6,
  sourceDoc: "test-configuration-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-configuration",
  title: {
    en: "Configuration",
    uk: "Конфігурація",
  },
  summary: {
    en: "playwright.config.ts is the single place that controls browsers, base URL, parallelism, retries, artifacts, and timeouts. I keep one config for all environments — CI vs local is handled by process.env.CI conditions inside the same file.",
    uk: "playwright.config.ts — єдине місце що контролює браузери, базовий URL, паралельність, повтори, артефакти і таймаути. Я тримаю один конфіг для всіх середовищ — різниця між CI і локальним вирішується через умови process.env.CI всередині того самого файлу.",
  },
  sections: [
    {
      id: "minimal-real-config",
      title: {
        en: "A real config that actually works",
        uk: "Реальний конфіг що справді працює",
      },
      paragraphs: [
        {
          en: "This is the shape I use in every project. The key split: top-level options control the test runner (retries, workers, parallelism), `use` controls what every test gets by default (baseURL, viewport, credentials).",
          uk: "Ось структура яку я використовую в кожному проекті. Ключовий поділ: top-level опції контролюють тест-раннер (retries, workers, паралельність), `use` контролює що кожен тест отримує за замовчуванням (baseURL, viewport, credentials).",
        },
        {
          en: "One mistake I see often: putting `retries` or `workers` inside `use: {}`. They don't work there — they must be at the top level.",
          uk: "Одна помилка яку я часто бачу: `retries` або `workers` поміщають всередину `use: {}`. Там вони не працюють — вони мають бути на верхньому рівні.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-config",
          language: "ts",
          code: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',

  // Запустити всі тести паралельно
  fullyParallel: true,

  // На CI — заборонити test.only (забудеш прибрати)
  forbidOnly: !!process.env.CI,

  // На CI — 2 повтори при падінні; локально — 0
  retries: process.env.CI ? 2 : 0,

  // На CI — 1 воркер (стабільніше); локально — авто (= кількість CPU)
  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',

    // Зберігати trace при першому повторі — відкриваєш у npx playwright show-trace
    trace: 'on-first-retry',

    // Screenshot при падінні — видно в HTML репорті
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  // Запустити dev-сервер перед тестами (якщо не запущений)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})`,
        },
      ],
    },
    {
      id: "use-section",
      title: {
        en: "The use section — defaults for every test",
        uk: "Секція use — дефолти для кожного тесту",
      },
      paragraphs: [
        {
          en: "`use` options apply to every test automatically. The most important: `baseURL` lets you write `page.goto('/orders')` instead of the full URL everywhere. Other useful defaults:",
          uk: "Опції в `use` застосовуються до кожного тесту автоматично. Найважливіше: `baseURL` дозволяє писати `page.goto('/orders')` замість повного URL скрізь. Інші корисні дефолти:",
        },
      ],
      codeBlocks: [
        {
          id: "use-options",
          language: "ts",
          code: `use: {
  baseURL: 'http://localhost:3000',

  // Viewport для всіх тестів
  viewport: { width: 1280, height: 720 },

  // Зберігати стан авторизації — не логінитися в кожному тесті
  storageState: 'playwright/.auth/admin.json',

  // Headless або ні (false = бачиш браузер)
  headless: true,

  // Записати відео при падінні
  video: 'on-first-retry',

  // Trace — детальна запис кожного кроку
  trace: 'on-first-retry',

  // Locale і timezone для тестів дат
  locale: 'uk-UA',
  timezoneId: 'Europe/Kyiv',

  // Extra HTTP заголовок для всіх запитів
  extraHTTPHeaders: {
    'x-test-run': 'playwright',
  },
},`,
        },
      ],
    },
    {
      id: "projects",
      title: {
        en: "Projects — multiple browsers or configs",
        uk: "Projects — кілька браузерів або конфігурацій",
      },
      diagram: {
        mermaid: `flowchart LR
  CFG["playwright.config.ts"] --> PC["chromium project\nDesktop Chrome"]
  CFG --> PF["firefox project\nDesktop Firefox"]
  CFG --> PW["webkit project\nDesktop Safari"]
  CFG --> PM["mobile-chrome\nPixel 5"]
  PC & PF & PW & PM -->|"same test suite\ndifferent browser/viewport"| TS["All tests\n*.spec.ts"]`,
        caption: {
          en: "Each project runs the full test suite with its own browser and settings — one config, many environments",
          uk: "Кожен project запускає весь набір тестів зі своїм браузером та налаштуваннями — один конфіг, багато середовищ",
        },
      },
      paragraphs: [
        {
          en: "Each project runs the full test suite with its own settings. The common use case: run on Chromium, Firefox, and WebKit. Another pattern: separate projects for authenticated and unauthenticated tests.",
          uk: "Кожен project запускає весь набір тестів зі своїми налаштуваннями. Типовий кейс: запустити на Chromium, Firefox і WebKit. Ще патерн: окремі projects для авторизованих і неавторизованих тестів.",
        },
      ],
      codeBlocks: [
        {
          id: "projects-browsers",
          language: "ts",
          code: `// Три браузери — один рядок кожен
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit',   use: { ...devices['Desktop Safari'] } },

  // Мобільний — viewport і touch автоматично
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
],`,
        },
        {
          id: "projects-auth",
          language: "ts",
          code: `// Патерн: setup project логіниться, решта залежить від нього
projects: [
  // 1. Спочатку логінимось і зберігаємо стан
  {
    name: 'setup',
    testMatch: /.*\\.setup\\.ts/,
  },

  // 2. Тести адміна — залежать від setup
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: 'playwright/.auth/admin.json',
    },
    dependencies: ['setup'],
  },
],`,
        },
      ],
    },
    {
      id: "timeouts",
      title: {
        en: "Timeouts — test, expect, action",
        uk: "Таймаути — тест, expect, дія",
      },
      paragraphs: [
        {
          en: "There are three independent timeouts to know. Mixing them up is a common source of confusion.",
          uk: "Є три незалежні таймаути які варто знати. Їх плутанина — часте джерело розгубленості.",
        },
      ],
      codeBlocks: [
        {
          id: "timeouts",
          language: "ts",
          code: `export default defineConfig({
  // Максимальний час одного тесту (за замовчуванням: 30000ms)
  timeout: 30000,

  expect: {
    // Максимальний час очікування для expect(locator).toBeVisible() тощо
    // (за замовчуванням: 5000ms)
    timeout: 5000,
  },

  use: {
    // Максимальний час для однієї дії: click, fill, goto тощо
    // (за замовчуванням: не обмежено — береться з timeout тесту)
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },
})

// Перевизначити для одного тесту:
test('slow report generation', async ({ page }) => {
  test.setTimeout(120000) // 2 хвилини для цього тесту
  await page.goto('/reports/generate')
  await expect(page.getByTestId('report-ready')).toBeVisible({ timeout: 90000 })
})`,
        },
      ],
    },
    {
      id: "global-setup",
      title: {
        en: "Global setup and teardown",
        uk: "Глобальний setup і teardown",
      },
      paragraphs: [
        {
          en: "Global setup runs once before any test starts. I use it to seed the database, create test users, or save an auth state file that all tests share. Global teardown runs once after all tests finish — clean up.",
          uk: "Global setup виконується один раз до початку будь-якого тесту. Я використовую його для наповнення бази, створення тестових користувачів або збереження auth-стану який ділять всі тести. Global teardown виконується один раз після завершення всіх тестів — прибирання.",
        },
      ],
      codeBlocks: [
        {
          id: "global-setup",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
})

// global-setup.ts
import { chromium } from '@playwright/test'

export default async function globalSetup() {
  // Логінимось один раз, зберігаємо стан для всіх тестів
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:3000/login')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/dashboard')

  // Зберігаємо cookies + localStorage
  await page.context().storageState({ path: 'playwright/.auth/admin.json' })
  await browser.close()
}`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want retries: 2 to apply to every test. Where do you put it in playwright.config.ts?",
        uk: "Хочеш щоб retries: 2 застосовувався до кожного тесту. Де поміщати його у playwright.config.ts?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Inside use: { retries: 2 }",
            uk: "Всередині use: { retries: 2 }",
          },
        },
        {
          id: "b",
          label: {
            en: "At the top level: defineConfig({ retries: 2 })",
            uk: "На верхньому рівні: defineConfig({ retries: 2 })",
          },
        },
        {
          id: "c",
          label: {
            en: "Inside each project: projects: [{ name: 'chromium', retries: 2 }]",
            uk: "Всередині кожного project: projects: [{ name: 'chromium', retries: 2 }]",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`retries`, `workers`, `timeout`, `reporter`, and `fullyParallel` are test runner options — they belong at the top level of `defineConfig`. The `use` section is only for browser/page defaults like baseURL, viewport, storageState. Putting runner options in `use` silently does nothing.",
        uk: "`retries`, `workers`, `timeout`, `reporter` і `fullyParallel` — це опції тест-раннера, вони належать верхньому рівню `defineConfig`. Секція `use` — тільки для дефолтів браузера/сторінки: baseURL, viewport, storageState. Якщо поставиш runner-опції в `use` — вони мовчки не матимуть жодного ефекту.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What does webServer: { reuseExistingServer: !process.env.CI } do?",
        uk: "Що робить webServer: { reuseExistingServer: !process.env.CI }?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "On CI it starts a fresh server every time; locally it reuses an already-running server",
            uk: "На CI щоразу запускає свіжий сервер; локально — використовує вже запущений",
          },
        },
        {
          id: "b",
          label: {
            en: "On CI it skips starting the server; locally it always starts a new one",
            uk: "На CI пропускає запуск сервера; локально завжди запускає новий",
          },
        },
        {
          id: "c",
          label: {
            en: "It only affects how many server instances are started in parallel",
            uk: "Впливає тільки на кількість паралельних інстансів сервера",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`reuseExistingServer: true` means: if a server is already running at the URL, don't start another one. Locally, your dev server is often already running so you don't want Playwright to start a duplicate. On CI, no server is running yet, so `reuseExistingServer: false` ensures Playwright starts one fresh.",
        uk: "`reuseExistingServer: true` означає: якщо сервер вже запущений на вказаному URL — не запускати ще один. Locally твій dev-сервер часто вже запущений тому не хочеш щоб Playwright запускав дублікат. На CI ніякого сервера ще немає, тому `reuseExistingServer: false` гарантує що Playwright запустить новий.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the purpose of `testDir` in playwright.config.ts?",
        uk: "Яке призначення `testDir` у playwright.config.ts?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It sets the directory where Playwright stores test results and screenshots",
            uk: "Вказує директорію де Playwright зберігає результати тестів і скриншоти",
          },
        },
        {
          id: "b",
          label: {
            en: "It tells Playwright where to look for test files to run",
            uk: "Вказує Playwright де шукати файли тестів для запуску",
          },
        },
        {
          id: "c",
          label: {
            en: "It defines the working directory for the webServer command",
            uk: "Визначає робочу директорію для команди webServer",
          },
        },
        {
          id: "d",
          label: {
            en: "It controls which directory fixtures are loaded from",
            uk: "Контролює з якої директорії завантажуються фікстури",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`testDir` points Playwright to the folder containing your test files (e.g. `'./tests'` or `'./e2e'`). Playwright recursively scans that directory for files matching the `testMatch` pattern (default: `**/*.spec.ts`). It has nothing to do with output directories — that is `outputDir`.",
        uk: "`testDir` вказує Playwright на папку що містить файли тестів (наприклад `'./tests'` або `'./e2e'`). Playwright рекурсивно сканує цю директорію на файли що відповідають шаблону `testMatch` (за замовчуванням: `**/*.spec.ts`). Це не пов'язано з директоріями виводу — за це відповідає `outputDir`.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does `forbidOnly: !!process.env.CI` do in the config?",
        uk: "Що робить `forbidOnly: !!process.env.CI` у конфігу?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It prevents tests from running in parallel on CI",
            uk: "Забороняє паралельний запуск тестів на CI",
          },
        },
        {
          id: "b",
          label: {
            en: "It causes the test run to fail if any test or describe block is marked with .only on CI",
            uk: "Спричиняє падіння запуску якщо будь-який тест або describe-блок позначений .only на CI",
          },
        },
        {
          id: "c",
          label: {
            en: "It prevents test.skip() from being used on CI",
            uk: "Забороняє використання test.skip() на CI",
          },
        },
        {
          id: "d",
          label: {
            en: "It makes all tests run in strict mode on CI",
            uk: "Змушує всі тести виконуватися в строгому режимі на CI",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`forbidOnly: true` makes the test runner fail immediately if it finds any `test.only()` or `describe.only()` in the codebase. This is a CI safeguard — if a developer commits a `.only` they left in by mistake, CI fails fast instead of silently running only that one test and giving a false pass for the whole suite.",
        uk: "`forbidOnly: true` змушує тест-раннер негайно падати якщо він знаходить будь-який `test.only()` або `describe.only()` у кодовій базі. Це захист CI — якщо розробник закомітив `.only` що забув прибрати, CI падає швидко замість того щоб мовчки запускати тільки той один тест і давати хибний успіх для всього suite.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does `extraHTTPHeaders` in the `use` block do?",
        uk: "Що робить `extraHTTPHeaders` у блоці `use`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It adds custom HTTP headers to every request made by page.goto() and all network requests from the browser",
            uk: "Додає власні HTTP-заголовки до кожного запиту з page.goto() та всіх мережевих запитів браузера",
          },
        },
        {
          id: "b",
          label: {
            en: "It adds headers only to requests made with page.request (the API testing client), not to browser page requests",
            uk: "Додає заголовки лише до запитів зроблених через page.request (API-клієнт), а не до запитів браузерної сторінки",
          },
        },
        {
          id: "c",
          label: {
            en: "It intercepts responses and injects headers into them before Playwright sees them",
            uk: "Перехоплює відповіді та вставляє в них заголовки перед тим як Playwright їх бачить",
          },
        },
        {
          id: "d",
          label: {
            en: "It sets the Content-Type header for all form submissions",
            uk: "Встановлює заголовок Content-Type для всіх відправлень форм",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`extraHTTPHeaders` sends the specified headers with every browser request for that context — including `page.goto()`, XHR, fetch calls, and API requests. A common use case: adding an `X-Internal-Token` header that the staging environment requires, or an `Authorization` header for API tests. It applies to all outgoing requests from the browser context.",
        uk: "`extraHTTPHeaders` надсилає вказані заголовки з кожним запитом браузера для того контексту — включаючи `page.goto()`, XHR, fetch-виклики і API-запити. Типовий кейс: додавання заголовка `X-Internal-Token` який вимагає staging-середовище, або заголовка `Authorization` для API-тестів. Застосовується до всіх вихідних запитів з browser context.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Where should you configure the HTML reporter in playwright.config.ts?",
        uk: "Де потрібно налаштовувати HTML-репортер у playwright.config.ts?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Inside the use: {} block alongside baseURL and viewport",
            uk: "Всередині блоку use: {} поряд з baseURL і viewport",
          },
        },
        {
          id: "b",
          label: {
            en: "At the top level of defineConfig — reporter: 'html'",
            uk: "На верхньому рівні defineConfig — reporter: 'html'",
          },
        },
        {
          id: "c",
          label: {
            en: "Inside each project definition under projects: [{ reporter: 'html' }]",
            uk: "Всередині кожного визначення проєкту під projects: [{ reporter: 'html' }]",
          },
        },
        {
          id: "d",
          label: {
            en: "In a separate reporter.config.ts file that Playwright picks up automatically",
            uk: "В окремому файлі reporter.config.ts який Playwright підхоплює автоматично",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`reporter` is a top-level runner option in `defineConfig` — the same level as `retries`, `workers`, and `timeout`. It cannot be set inside `use` or inside individual project definitions. You can pass a string (`'html'`), an array of reporters (`[['html'], ['list']]`), or configure the reporter with options (`[['html', { open: 'never' }]]`).",
        uk: "`reporter` — це top-level опція раннера у `defineConfig` — того ж рівня що `retries`, `workers` і `timeout`. Її не можна задати всередині `use` або всередині окремих визначень проєктів. Можна передати рядок (`'html'`), масив репортерів (`[['html'], ['list']]`) або налаштувати репортер з опціями (`[['html', { open: 'never' }]]`).",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want test output files (screenshots, videos, traces) stored in a specific folder. Which config option controls that?",
        uk: "Хочеш щоб файли результатів тестів (скриншоти, відео, трейси) зберігалися в окремій папці. Яка опція конфігу це контролює?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "testDir — the same directory where test files are found",
            uk: "testDir — та сама директорія де знаходяться файли тестів",
          },
        },
        {
          id: "b",
          label: {
            en: "artifactsDir — a dedicated artifacts storage path",
            uk: "artifactsDir — окремий шлях для зберігання артефактів",
          },
        },
        {
          id: "c",
          label: {
            en: "outputDir — defaults to test-results/ in the project root",
            uk: "outputDir — за замовчуванням test-results/ у корені проєкту",
          },
        },
        {
          id: "d",
          label: {
            en: "storageDir — configured inside the use block",
            uk: "storageDir — налаштовується всередині блоку use",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`outputDir` is the top-level config option that controls where Playwright writes screenshots, videos, and traces for failed tests. It defaults to `test-results/` in the project root. You can change it to keep artifacts organized or to match your CI artifact upload path. `testDir` is only for finding test files, not for output.",
        uk: "`outputDir` — це top-level опція конфігу що контролює куди Playwright записує скриншоти, відео і трейси для тестів що впали. За замовчуванням — `test-results/` у корені проєкту. Можна змінити щоб тримати артефакти організованими або відповідати шляху завантаження артефактів на CI. `testDir` — лише для пошуку файлів тестів, не для виводу.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What is `baseURL` in the `use` block used for?",
        uk: "Для чого використовується `baseURL` у блоці `use`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It sets the URL of the webServer that Playwright will start before running tests",
            uk: "Встановлює URL веб-сервера який Playwright запустить перед тестами",
          },
        },
        {
          id: "b",
          label: {
            en: "It allows page.goto('/path') to work by prepending the base so you don't repeat the full URL in every test",
            uk: "Дозволяє page.goto('/path') працювати шляхом додавання бази — не треба повторювати повний URL у кожному тесті",
          },
        },
        {
          id: "c",
          label: {
            en: "It restricts network requests so only calls to that domain are allowed",
            uk: "Обмежує мережеві запити щоб дозволялися лише виклики до того домену",
          },
        },
        {
          id: "d",
          label: {
            en: "It sets the URL that Playwright navigates to when a new page is opened",
            uk: "Встановлює URL на який Playwright переходить при відкритті нової сторінки",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`baseURL` in `use` resolves relative paths in `page.goto()`. With `baseURL: 'http://localhost:3000'`, calling `page.goto('/orders')` navigates to `http://localhost:3000/orders`. This keeps test code clean and makes it easy to point the entire suite at a different host (staging, production) by changing one line in config. It does not auto-navigate or restrict requests.",
        uk: "`baseURL` у `use` вирішує відносні шляхи в `page.goto()`. З `baseURL: 'http://localhost:3000'` виклик `page.goto('/orders')` переходить на `http://localhost:3000/orders`. Це робить код тестів чистим і дозволяє легко перенаправити весь suite на інший хост (staging, production) змінивши один рядок у конфігу. Він не виконує автоматичну навігацію і не обмежує запити.",
      },
    },
  ],
}
