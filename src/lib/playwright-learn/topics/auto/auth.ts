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
    en: "Login once, run all tests already authenticated. Playwright saves browser state to a file and reuses it — no login flow repeated for every test.",
    uk: "Залогінитися один раз — і всі тести стартують вже з сесією. Playwright зберігає стан браузера у файл і повторно використовує його.",
  },
  sections: [
    {
      id: "the-problem",
      title: {
        en: "The problem: login in every test",
        uk: "Проблема: логін у кожному тесті",
      },
      diagram: {
        mermaid: `sequenceDiagram
  participant S as Setup project
  participant F as Auth file
  participant T as Tests (parallel)
  S->>S: goto /login, fill, click
  S->>F: storageState → user.json
  T->>F: read user.json
  T->>T: start already authenticated`,
        caption: {
          en: "Login once in setup, share the auth file across all tests",
          uk: "Логін один раз у setup, auth файл ділиться між усіма тестами",
        },
      },
      paragraphs: [
        {
          en: "If you have 80 tests that all need to be logged in — and you log in at the start of each one — that's 80 login flows per run. Each login is a network round-trip, a page load, a form fill. On a real app this adds up fast.",
          uk: "Якщо у тебе 80 тестів які всі потребують сесії — і ти логінишся на початку кожного — це 80 логінів за прогін. Кожен логін — це мережевий запит, завантаження сторінки, заповнення форми. На реальному застосунку це накопичується швидко.",
        },
        {
          en: "The solution: log in once, save the browser state (cookies + localStorage) to a JSON file, and tell every test to start from that file. Playwright calls this `storageState`.",
          uk: "Рішення: залогінитися один раз, зберегти стан браузера (cookies + localStorage) у JSON файл і сказати кожному тесту стартувати з цього файлу. Playwright називає це `storageState`.",
        },
      ],
    },
    {
      id: "setup-project",
      title: {
        en: "Recommended setup: auth setup project",
        uk: "Рекомендований підхід: auth setup project",
      },
      paragraphs: [
        {
          en: "The cleanest approach: create a separate `setup` project that runs before your tests. It logs in and saves the state to `playwright/.auth/user.json`. Then every test project uses that file as its starting `storageState`.",
          uk: "Найчистіший підхід: окремий проєкт `setup` що запускається перед тестами. Він логіниться і зберігає стан у `playwright/.auth/user.json`. Кожен тестовий проєкт використовує цей файл як стартовий `storageState`.",
        },
        {
          en: "First, create the directory and add it to `.gitignore` — you don't want auth files in your repo:",
          uk: "Спочатку створи директорію і додай її до `.gitignore` — auth файли не потрібні в репозиторії:",
        },
      ],
      codeBlocks: [
        {
          id: "mkdir",
          language: "bash",
          code: "mkdir -p playwright/.auth\necho '\\nplaywright/.auth' >> .gitignore",
        },
        {
          id: "auth-setup",
          language: "ts",
          code: `// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../playwright/.auth/user.json')

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Wait for redirect — cookies are set after this
  await page.waitForURL('/dashboard')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

  // Save cookies + localStorage to file
  await page.context().storageState({ path: authFile })
})`,
        },
        {
          id: "config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  projects: [
    // This project runs first and produces playwright/.auth/user.json
    { name: 'setup', testMatch: /.*\\.setup\\.ts/ },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json', // start every test authenticated
      },
      dependencies: ['setup'], // always run setup first
    },
  ],
})`,
        },
      ],
    },
    {
      id: "per-worker-auth",
      title: {
        en: "Multiple accounts for parallel tests",
        uk: "Кілька акаунтів для паралельних тестів",
      },
      paragraphs: [
        {
          en: "The shared auth file works great when tests only read data. If your tests modify server state (create orders, change settings), parallel tests will step on each other's changes when sharing one account. The fix: one account per parallel worker.",
          uk: "Спільний auth файл добре працює коли тести тільки читають дані. Якщо тести змінюють стан сервера (створюють замовлення, змінюють налаштування) — паралельні тести будуть заважати один одному при спільному акаунті. Рішення: один акаунт на паралельний воркер.",
        },
        {
          en: "Each worker gets its own auth file named by its index (`0.json`, `1.json`, ...). The worker logs in once, saves state, and all its tests reuse that state.",
          uk: "Кожен воркер отримує свій auth файл названий за індексом (`0.json`, `1.json`, ...). Воркер логіниться один раз, зберігає стан, і всі його тести використовують цей стан.",
        },
      ],
      codeBlocks: [
        {
          id: "worker-auth",
          language: "ts",
          code: `// playwright/fixtures.ts
import { test as base, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

export const test = base.extend({
  storageState: ({ workerStorageState }, use) => use(workerStorageState),

  workerStorageState: [async ({ browser }, use) => {
    const workerId = test.info().parallelIndex
    const authFile = path.resolve(
      test.info().project.outputDir,
      \`.auth/\${workerId}.json\`
    )

    if (fs.existsSync(authFile)) {
      await use(authFile)
      return
    }

    // First run for this worker — log in and save
    const page = await browser.newPage({ storageState: undefined })
    await page.goto('/login')
    await page.getByLabel('Email').fill(\`worker\${workerId}@example.com\`)
    await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('/dashboard')
    await page.context().storageState({ path: authFile })
    await page.close()
    await use(authFile)
  }, { scope: 'worker' }],
})`,
        },
      ],
    },
    {
      id: "api-auth",
      title: {
        en: "Faster: authenticate via API",
        uk: "Швидше: автентифікація через API",
      },
      paragraphs: [
        {
          en: "If your app has a login API endpoint, you can skip the browser form entirely and get a token or session cookie directly via an HTTP request. This is much faster than driving a login form through the UI.",
          uk: "Якщо твій застосунок має API ендпоінт для логіну — можна пропустити браузерну форму і отримати токен або session cookie напряму через HTTP запит. Це значно швидше ніж вводити форму через UI.",
        },
      ],
      codeBlocks: [
        {
          id: "api-auth-code",
          language: "ts",
          code: `// tests/auth.setup.ts — API login approach
import { test as setup, request } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate via API', async ({ }) => {
  const apiCtx = await request.newContext()

  const response = await apiCtx.post('/api/auth/login', {
    data: {
      email: 'admin@example.com',
      password: process.env.TEST_PASSWORD,
    }
  })

  // Save cookies from the API response to the auth file
  await apiCtx.storageState({ path: authFile })
  await apiCtx.dispose()
})`,
        },
      ],
    },
    {
      id: "multiple-roles",
      title: {
        en: "Multiple roles: admin and user",
        uk: "Кілька ролей: адмін і користувач",
      },
      paragraphs: [
        {
          en: "If your app has roles (admin, manager, viewer), create a separate auth file for each. Then in the test fixture, pick the right file based on what the test needs.",
          uk: "Якщо в застосунку є ролі (адмін, менеджер, читач) — створи окремий auth файл для кожної. У фікстурі тесту вибирай потрібний файл залежно від того що потрібно тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "multi-role",
          language: "ts",
          code: `// playwright.config.ts — два проєкти з різними ролями
projects: [
  { name: 'setup', testMatch: /.*\\.setup\\.ts/ },

  {
    name: 'admin tests',
    use: { storageState: 'playwright/.auth/admin.json' },
    dependencies: ['setup'],
    testMatch: '**/admin/**/*.spec.ts',
  },
  {
    name: 'user tests',
    use: { storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
    testMatch: '**/user/**/*.spec.ts',
  },
]`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "What does Playwright's storageState save?",
        uk: "Що зберігає storageState в Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Only session cookies",
            uk: "Лише session cookies",
          },
        },
        {
          id: "b",
          label: {
            en: "Cookies, localStorage and sessionStorage",
            uk: "Cookies, localStorage і sessionStorage",
          },
        },
        {
          id: "c",
          label: {
            en: "The full browser cache including images",
            uk: "Повний кеш браузера включно з зображеннями",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`storageState` captures cookies, localStorage and sessionStorage — everything that maintains browser-side session state. It doesn't include the network cache or IndexedDB.",
        uk: "`storageState` зберігає cookies, localStorage і sessionStorage — все що підтримує сесію на стороні браузера. Мережевий кеш і IndexedDB не включаються.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You have 60 tests. Most just read data, but 5 create new records. What's the best auth strategy?",
        uk: "У тебе 60 тестів. Більшість читають дані, але 5 створюють нові записи. Яка краща стратегія auth?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Log in at the start of every test",
            uk: "Логінитися на початку кожного тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "Shared auth file for all tests",
            uk: "Спільний auth файл для всіх тестів",
          },
        },
        {
          id: "c",
          label: {
            en: "Separate auth per parallel worker",
            uk: "Окремий auth на кожний паралельний воркер",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "When tests create/modify records, they can interfere with each other when sharing one account in parallel. One account per worker ensures each worker operates in its own data space.",
        uk: "Коли тести створюють або змінюють записи, вони можуть заважати одне одному при спільному акаунті в паралелі. Один акаунт на воркер гарантує що кожен воркер працює у своєму просторі даних.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Where should the playwright/.auth directory be added to avoid committing session tokens to the repository?",
        uk: "Куди потрібно додати директорію playwright/.auth щоб уникнути коміту токенів сесії в репозиторій?",
      },
      options: [
        { id: "a", label: { en: ".npmignore", uk: ".npmignore" } },
        { id: "b", label: { en: ".gitignore", uk: ".gitignore" } },
        { id: "c", label: { en: ".dockerignore", uk: ".dockerignore" } },
        { id: "d", label: { en: "playwright.config.ts excludes field", uk: "поле excludes у playwright.config.ts" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The playwright/.auth directory contains JSON files with cookies and localStorage — real session data that should never be committed. Adding it to .gitignore ensures the auth files are only on the local machine or CI runner and are never pushed to the repository.",
        uk: "Директорія playwright/.auth містить JSON-файли з cookies та localStorage — справжні дані сесії які ніколи не повинні потрапляти в коміт. Додавання до .gitignore гарантує що auth-файли залишаються лише на локальній машині або CI-рунері і ніколи не пушаться в репозиторій.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you tell a test project in playwright.config.ts to start every browser context already authenticated?",
        uk: "Як вказати тест-проєкту в playwright.config.ts щоб кожен browser context стартував вже авторизованим?",
      },
      options: [
        { id: "a", label: { en: "Set authFile: 'playwright/.auth/user.json' in the project use block", uk: "Встановити authFile: 'playwright/.auth/user.json' в блоці use проєкту" } },
        { id: "b", label: { en: "Set storageState: 'playwright/.auth/user.json' in the project use block", uk: "Встановити storageState: 'playwright/.auth/user.json' в блоці use проєкту" } },
        { id: "c", label: { en: "Import the JSON file and pass it to page.context().addCookies()", uk: "Імпортувати JSON-файл і передати його в page.context().addCookies()" } },
        { id: "d", label: { en: "Set sessionFile: 'playwright/.auth/user.json' in the global use block", uk: "Встановити sessionFile: 'playwright/.auth/user.json' в глобальному блоці use" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `storageState` option in the project's `use` block tells Playwright to load the given JSON file into every browser context before any test in that project runs. This restores cookies and localStorage so the test starts fully authenticated without going through the login UI.",
        uk: "Опція `storageState` в блоці `use` проєкту говорить Playwright завантажити вказаний JSON-файл у кожний browser context перед будь-яким тестом у цьому проєкті. Це відновлює cookies та localStorage, тому тест стартує повністю авторизованим без проходження через UI логіну.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "In playwright.config.ts, which property on a test project ensures the setup project runs before it?",
        uk: "Яка властивість тест-проєкту в playwright.config.ts гарантує що setup-проєкт виконається раніше нього?",
      },
      options: [
        { id: "a", label: { en: "requires: ['setup']", uk: "requires: ['setup']" } },
        { id: "b", label: { en: "before: ['setup']", uk: "before: ['setup']" } },
        { id: "c", label: { en: "dependencies: ['setup']", uk: "dependencies: ['setup']" } },
        { id: "d", label: { en: "runAfter: ['setup']", uk: "runAfter: ['setup']" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The `dependencies` array on a project lists other project names that must complete successfully before this project starts. If the dependency project fails, the dependent project is skipped entirely. This is the standard way to ensure a setup project (login, seed data) runs before the main browser tests.",
        uk: "Масив `dependencies` на проєкті перераховує назви інших проєктів які мають успішно завершитися перш ніж цей проєкт стартує. Якщо залежний проєкт падає — поточний проєкт пропускається повністю. Це стандартний спосіб гарантувати що setup-проєкт (логін, заповнення даних) виконується перед основними браузерними тестами.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Why is authenticating via an API endpoint faster than driving the login form through the browser UI?",
        uk: "Чому автентифікація через API-ендпоінт швидша ніж заповнення форми логіну через браузерний UI?",
      },
      options: [
        { id: "a", label: { en: "The API skips TLS handshake so the connection is faster", uk: "API пропускає TLS-handshake тому з'єднання швидше" } },
        { id: "b", label: { en: "API auth avoids launching a browser page, loading assets, and simulating user interactions — it's a single HTTP request", uk: "API-авторизація уникає запуску сторінки браузера, завантаження ресурсів і симуляції дій користувача — це єдиний HTTP-запит" } },
        { id: "c", label: { en: "Playwright caches API responses so subsequent runs skip the request entirely", uk: "Playwright кешує відповіді API тому наступні запуски пропускають запит повністю" } },
        { id: "d", label: { en: "API auth uses a different browser process that starts faster", uk: "API-авторизація використовує інший процес браузера який стартує швидше" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "UI login requires launching a browser page, loading all its assets (HTML, CSS, JS), and then simulating typed keystrokes and button clicks. An API login is a direct HTTP POST — no page load, no DOM rendering, no user input simulation. The result is the same (a session cookie), but it arrives in milliseconds instead of seconds.",
        uk: "UI-логін вимагає запуску сторінки браузера, завантаження всіх її ресурсів (HTML, CSS, JS), і потім симуляції натискань клавіш та кнопок. API-логін — це прямий HTTP POST: без завантаження сторінки, без рендерингу DOM, без симуляції вводу. Результат той самий (session cookie) але приходить за мілісекунди а не секунди.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Your app has admin and regular user roles. How do you handle multiple auth files in playwright.config.ts?",
        uk: "Твій застосунок має ролі адміна і звичайного користувача. Як обробити кілька auth-файлів у playwright.config.ts?",
      },
      options: [
        { id: "a", label: { en: "Use one storageState file and switch roles inside each test using page.evaluate()", uk: "Використовувати один storageState-файл і перемикати ролі всередині кожного тесту через page.evaluate()" } },
        { id: "b", label: { en: "Create a separate test project per role, each with its own storageState path pointing to a different auth file", uk: "Створити окремий тест-проєкт для кожної ролі, кожен зі своїм шляхом storageState що вказує на інший auth-файл" } },
        { id: "c", label: { en: "Store all roles in one JSON file and pick the role with an environment variable", uk: "Зберегти всі ролі в одному JSON-файлі і вибирати роль через змінну середовища" } },
        { id: "d", label: { en: "Pass a roles array to the storageState option", uk: "Передати масив ролей в опцію storageState" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Each role gets its own auth file (admin.json, user.json) produced by a setup step that logs in as that role. Each test project points its `storageState` to the appropriate file and optionally uses `testMatch` to run only tests relevant to that role. This keeps role-specific tests cleanly separated and each test project starts already authenticated as the right user.",
        uk: "Кожна роль отримує власний auth-файл (admin.json, user.json), створений кроком setup який логіниться під цією роллю. Кожен тест-проєкт вказує свій `storageState` на відповідний файл і опціонально використовує `testMatch` щоб запускати лише тести відповідні цій ролі. Це тримає рольово-специфічні тести чітко розділеними і кожен тест-проєкт стартує вже авторизованим як правильний користувач.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What testMatch pattern is typically used on the setup project to match only auth setup files?",
        uk: "Який патерн testMatch зазвичай використовується на setup-проєкті щоб знаходити лише auth setup-файли?",
      },
      options: [
        { id: "a", label: { en: "/.*\\.spec\\.ts/", uk: "/.*\\.spec\\.ts/" } },
        { id: "b", label: { en: "/.*\\.setup\\.ts/", uk: "/.*\\.setup\\.ts/" } },
        { id: "c", label: { en: "/.*\\.before\\.ts/", uk: "/.*\\.before\\.ts/" } },
        { id: "d", label: { en: "'**/*.config.ts'", uk: "'**/*.config.ts'" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By convention Playwright setup files are named with a `.setup.ts` suffix (e.g. `auth.setup.ts`). Using `testMatch: /.*\\.setup\\.ts/` ensures the setup project picks up only those files and not regular `.spec.ts` test files. This keeps the setup and test projects cleanly separated.",
        uk: "За угодою setup-файли Playwright іменуються з суфіксом `.setup.ts` (наприклад `auth.setup.ts`). Використання `testMatch: /.*\\.setup\\.ts/` гарантує що setup-проєкт підбирає лише ці файли а не звичайні `.spec.ts` тест-файли. Це тримає setup і тест-проєкти чітко розділеними.",
      },
    },
  ],
}
