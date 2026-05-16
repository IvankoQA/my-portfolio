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
    en: "There are two ways to run code once before all tests: project dependencies (recommended) and globalSetup in config. I always use project dependencies — it shows in the HTML report, records traces, and supports fixtures. The main use case: log in once, save storageState, every test starts already authenticated.",
    uk: "Є два способи запустити код один раз перед усіма тестами: залежності проєктів (рекомендовано) і globalSetup у конфігу. Я завжди використовую залежності проєктів — показується у HTML-звіті, записує трейси, підтримує фікстури. Основний кейс: один раз логін, зберегти storageState, кожен тест починається вже авторизованим.",
  },
  sections: [
    {
      id: "why-global-setup",
      title: {
        en: "When I need global setup",
        uk: "Коли потрібен global setup",
      },
      paragraphs: [
        {
          en: "The most common reason I use global setup: authentication. Logging in before every test is slow — on a suite of 200 tests it adds 200 login flows. Instead I log in once in global setup, save the browser storage state (cookies + localStorage) to a file, and every test starts already authenticated by loading that file.",
          uk: "Найпоширеніша причина чому використовую global setup: автентифікація. Логін перед кожним тестом — повільно. На 200 тестах це 200 окремих логінів. Натомість один раз логінюсь у global setup, зберігаю стан браузерного сховища (cookies + localStorage) у файл, і кожен тест починається вже авторизованим завантажуючи цей файл.",
        },
        {
          en: "Other use cases: seeding a test database, creating fixtures in an API, setting environment variables that tests read.",
          uk: "Інші кейси: наповнення тестової бази даних, створення фікстур через API, встановлення змінних середовища які читають тести.",
        },
      ],
    },
    {
      id: "two-approaches",
      title: {
        en: "Two approaches — and which to pick",
        uk: "Два підходи — і який вибирати",
      },
      diagram: {
        mermaid: `flowchart LR
  subgraph OPT1["Option 1 — Project dependencies ✅ recommended"]
    direction TB
    SP["setup project\nglobal.setup.ts"] --> TP["test projects\nchromium / firefox / webkit"]
    TP --> CP["cleanup project\n(optional teardown)"]
  end
  subgraph OPT2["Option 2 — globalSetup config ⚠ limited"]
    direction TB
    GS["globalSetup function\n(runs before all tests)"] --> TP2["all tests"]
    TP2 --> GT["globalTeardown\n(optional)"]
  end`,
        caption: {
          en: "Project dependencies appear in the HTML report and support fixtures; globalSetup is invisible to the report and cannot use fixtures",
          uk: "Залежності проєктів видимі в HTML-звіті та підтримують фікстури; globalSetup невидимий у звіті і не підтримує фікстури",
        },
      },
      paragraphs: [
        {
          en: "**Option 1: Project dependencies** — I create a special 'setup' project in playwright.config.ts and list it as a dependency of my main test projects. The setup project runs first, then the tests run.\n\n**Option 2: globalSetup config option** — I point `globalSetup` in the config to a file that exports a function. That function runs once before all tests.\n\nI always use Option 1. Here's why:",
          uk: "**Варіант 1: Залежності проєктів** — створюю спеціальний 'setup' проєкт у playwright.config.ts і вказую його як залежність основних тест-проєктів. Setup-проєкт виконується першим, потім тести.\n\n**Варіант 2: Опція globalSetup у конфігу** — вказую `globalSetup` на файл що експортує функцію. Функція виконується один раз перед усіма тестами.\n\nЯ завжди використовую Варіант 1. Ось чому:",
        },
        {
          en: "| Feature | Project dependencies | globalSetup |\n|---|---|---|\n| Visible in HTML report | ✅ As separate project | ❌ Not shown |\n| Trace recording | ✅ Full trace | ❌ Not supported |\n| Playwright fixtures | ✅ Supported | ❌ Not supported |\n| Browser via fixture | ✅ `{ browser }` fixture | ❌ Manual `browserType.launch()` |",
          uk: "| Можливість | Залежності проєктів | globalSetup |\n|---|---|---|\n| Видимість у HTML-звіті | ✅ Окремий проєкт | ❌ Не показується |\n| Запис трейсів | ✅ Повний трейс | ❌ Не підтримується |\n| Фікстури Playwright | ✅ Підтримуються | ❌ Не підтримуються |\n| Браузер через фікстуру | ✅ Фікстура `{ browser }` | ❌ Вручну через `browserType.launch()` |",
        },
      ],
    },
    {
      id: "project-dependencies-setup",
      title: {
        en: "Project dependencies — login once pattern",
        uk: "Залежності проєктів — патерн одного логіну",
      },
      paragraphs: [
        {
          en: "This is the pattern I use for authentication in every project. The 'setup' project runs the login script, saves storageState to a file. The 'chromium' project depends on 'setup', so setup always runs first, and the chromium tests load the saved state.",
          uk: "Це патерн який я використовую для автентифікації в кожному проєкті. Проєкт 'setup' запускає скрипт логіну, зберігає storageState у файл. Проєкт 'chromium' залежить від 'setup', тому setup завжди виконується першим, а тести chromium завантажують збережений стан.",
        },
      ],
      codeBlocks: [
        {
          id: "config-deps",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  projects: [
    {
      name: 'setup',
      testMatch: /global\\.setup\\.ts/,
      teardown: 'cleanup',      // опційно — виконається після всіх тестів
    },
    {
      name: 'cleanup',
      testMatch: /global\\.teardown\\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',  // завантажити збережений логін
      },
      dependencies: ['setup'],   // ← setup виконається першим
    },
  ],
})`,
        },
        {
          id: "global-setup-file",
          language: "ts",
          code: `// tests/global.setup.ts
import { test as setup, expect } from '@playwright/test'
import path from 'path'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill('secret')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL('/dashboard')

  // Зберегти cookies і localStorage у файл
  await page.context().storageState({ path: authFile })
})`,
        },
        {
          id: "global-teardown-file",
          language: "ts",
          code: `// tests/global.teardown.ts
import { test as teardown } from '@playwright/test'

teardown('cleanup after tests', async ({ request }) => {
  // Наприклад: видалити тестові дані з API
  await request.delete('/api/test-data')
})`,
        },
      ],
    },
    {
      id: "option-2-global-setup",
      title: {
        en: "Option 2: globalSetup config (when fixtures don't matter)",
        uk: "Варіант 2: globalSetup у конфігу (коли фікстури не потрібні)",
      },
      paragraphs: [
        {
          en: "If I only need to set environment variables or call an API without browser interaction, I use `globalSetup` in the config. It's simpler for non-browser work but doesn't get traces or HTML report visibility.",
          uk: "Якщо потрібно лише встановити змінні середовища або викликати API без браузерної взаємодії — використовую `globalSetup` у конфігу. Простіше для роботи без браузера але не дає трейсів і видимості у HTML-звіті.",
        },
      ],
      codeBlocks: [
        {
          id: "global-setup-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
})`,
        },
        {
          id: "global-setup-simple",
          language: "ts",
          code: `// global-setup.ts
import type { FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Передати дані в тести через process.env
  process.env.API_TOKEN = await fetchTestToken()
  process.env.BASE_URL = config.projects[0].use.baseURL!
}

export default globalSetup`,
        },
        {
          id: "test-uses-env",
          language: "ts",
          code: `// Тест читає змінні встановлені в globalSetup
test('uses api token', async ({ request }) => {
  const response = await request.get('/api/orders', {
    headers: { Authorization: \`Bearer \${process.env.API_TOKEN}\` }
  })
  expect(response.ok()).toBeTruthy()
})`,
        },
      ],
    },
    {
      id: "filtering-and-deps",
      title: {
        en: "Test filtering with dependencies",
        uk: "Фільтрація тестів із залежностями",
      },
      paragraphs: [
        {
          en: "When I filter tests with `--grep` or run a specific file, Playwright still runs the setup project first if the selected tests depend on it. This is the expected behavior — I can't run tests that need auth without the auth setup.",
          uk: "Коли фільтрую тести через `--grep` або запускаю конкретний файл — Playwright все одно спочатку запускає setup-проєкт якщо вибрані тести залежать від нього. Це очікувана поведінка — не можна запускати тести які потребують авторизації без setup авторизації.",
        },
        {
          en: "To skip dependencies (for debugging or when I know the state is already set up): `--no-deps`. This runs only the directly selected tests without any dependent projects.",
          uk: "Щоб пропустити залежності (для дебагу або коли знаю що стан вже налаштований): `--no-deps`. Це запускає лише явно вибрані тести без залежних проєктів.",
        },
      ],
      codeBlocks: [
        {
          id: "no-deps",
          language: "bash",
          code: `# Запустити конкретний тест без виконання setup-проєкту
npx playwright test tests/orders.spec.ts --no-deps

# Фільтрувати за назвою — setup все одно виконається
npx playwright test --grep "create order"`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You set up a globalSetup function that logs in, saves storageState, and also starts tracing to capture what happens during login. But when login fails in CI, you get no trace file. Why?",
        uk: "Ти налаштував globalSetup функцію яка логіниться, зберігає storageState і також запускає трейсинг щоб захопити що відбувається під час логіну. Але коли логін падає на CI — файл трейсу відсутній. Чому?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "globalSetup doesn't support tracing at all",
            uk: "globalSetup взагалі не підтримує трейсинг",
          },
        },
        {
          id: "b",
          label: {
            en: "Tracing is supported in globalSetup but you must stop the trace in a try/catch before re-throwing the error — otherwise the trace file is never written because the error exits the function before tracing.stop() runs",
            uk: "Трейсинг підтримується в globalSetup але треба зупинити трейс у try/catch перед повторним кидком помилки — інакше файл трейсу ніколи не записується бо помилка виходить з функції до виконання tracing.stop()",
          },
        },
        {
          id: "c",
          label: {
            en: "Switch to project dependencies — they support tracing automatically without any extra code",
            uk: "Перейди на залежності проєктів — вони підтримують трейсинг автоматично без додаткового коду",
          },
        },
        {
          id: "d",
          label: {
            en: "The CI environment blocks file writes from globalSetup",
            uk: "CI-середовище блокує запис файлів з globalSetup",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Both B and C are valid answers, but B explains the specific bug. In `globalSetup`, if the login throws an error, execution jumps straight out of the function — any `tracing.stop()` call after the error is never reached. The fix: wrap the login in `try { ... await tracing.stop(...) } catch(e) { await tracing.stop({ path: 'failed-setup.zip' }); throw e }`. Option C (project dependencies) is the better long-term choice since tracing, fixtures, and HTML report visibility are all automatic — no extra code needed.",
        uk: "Обидві відповіді B і C правильні але B пояснює конкретний баг. У `globalSetup` якщо логін кидає помилку — виконання відразу виходить з функції, будь-який виклик `tracing.stop()` після помилки ніколи не досягається. Виправлення: обгорнути логін у `try { ... await tracing.stop(...) } catch(e) { await tracing.stop({ path: 'failed-setup.zip' }); throw e }`. Варіант C (залежності проєктів) — кращий довгостроковий вибір оскільки трейсинг, фікстури і видимість у HTML-звіті автоматичні — без додаткового коду.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Why does the documentation recommend project dependencies over globalSetup for the login-once pattern?",
        uk: "Чому документація рекомендує залежності проєктів замість globalSetup для патерну одного логіну?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Project dependencies run faster because they use parallel workers",
            uk: "Залежності проєктів виконуються швидше бо використовують паралельні воркери",
          },
        },
        {
          id: "b",
          label: {
            en: "Project dependencies appear in the HTML report, support full trace recording, and give access to Playwright fixtures like { browser } and { request } — globalSetup has none of these",
            uk: "Залежності проєктів відображаються у HTML-звіті, підтримують повний запис трейсів і дають доступ до Playwright-фікстур як { browser } і { request } — у globalSetup нічого з цього немає",
          },
        },
        {
          id: "c",
          label: {
            en: "globalSetup is deprecated and will be removed in a future Playwright version",
            uk: "globalSetup застаріло і буде видалено в майбутній версії Playwright",
          },
        },
        {
          id: "d",
          label: {
            en: "Project dependencies automatically retry failed setup steps",
            uk: "Залежності проєктів автоматично повторюють кроки setup що впали",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Project dependencies have three concrete advantages over `globalSetup`: (1) they appear in the HTML report as a separate named project — when login fails you see exactly which step failed and why; (2) they support trace recording automatically under the same `trace:` config option; (3) they have access to Playwright test fixtures including `{ browser }`, `{ request }`, and custom fixtures — `globalSetup` must launch browsers manually via `browserType.launch()`. `globalSetup` is still appropriate for non-browser work like setting environment variables or calling an external API.",
        uk: "Залежності проєктів мають три конкретні переваги над `globalSetup`: (1) вони відображаються у HTML-звіті як окремий іменований проєкт — коли логін падає видно точно який крок провалився і чому; (2) підтримують запис трейсів автоматично за тим самим налаштуванням `trace:`; (3) мають доступ до тестових фікстур Playwright включаючи `{ browser }`, `{ request }` і кастомні фікстури — `globalSetup` повинен запускати браузери вручну через `browserType.launch()`. `globalSetup` все ще підходить для роботи без браузера як встановлення змінних середовища або виклик зовнішнього API.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does `await page.context().storageState({ path: authFile })` save?",
        uk: "Що зберігає `await page.context().storageState({ path: authFile })`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Only the session cookies from the current domain",
            uk: "Лише сесійні cookies поточного домену",
          },
        },
        {
          id: "b",
          label: {
            en: "Both cookies and localStorage/sessionStorage for all domains visited — everything needed to restore the authenticated session",
            uk: "Як cookies так і localStorage/sessionStorage для всіх відвіданих доменів — все що потрібно для відновлення авторизованої сесії",
          },
        },
        {
          id: "c",
          label: {
            en: "The browser's full state including open tabs and navigation history",
            uk: "Повний стан браузера включаючи відкриті вкладки і історію навігації",
          },
        },
        {
          id: "d",
          label: {
            en: "Only the authentication token stored in localStorage",
            uk: "Лише токен авторизації збережений у localStorage",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`storageState()` captures all cookies (session cookies, persistent cookies) and all Web Storage data (localStorage and sessionStorage) for every origin the context visited. This is comprehensive enough to restore an authenticated session for almost any app — most auth systems use either cookies or localStorage tokens, and `storageState` captures both. The saved JSON file is then loaded in test projects via `use: { storageState: 'playwright/.auth/user.json' }`, giving every test a pre-authenticated starting state.",
        uk: "`storageState()` захоплює всі cookies (сесійні cookies, постійні cookies) і всі дані Web Storage (localStorage і sessionStorage) для кожного origin який відвідував context. Цього достатньо для відновлення авторизованої сесії майже для будь-якого застосунку — більшість систем авторизації використовують cookies або localStorage-токени, і `storageState` захоплює обидва. Збережений JSON-файл потім завантажується у тест-проєктах через `use: { storageState: 'playwright/.auth/user.json' }`, надаючи кожному тесту попередньо авторизований початковий стан.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "In playwright.config.ts, how do you make the 'chromium' project run only after the 'setup' project finishes?",
        uk: "У playwright.config.ts як змусити проєкт 'chromium' виконуватися лише після завершення проєкту 'setup'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set order: 1 in the 'setup' project and order: 2 in the 'chromium' project",
            uk: "Встановити order: 1 у проєкті 'setup' і order: 2 у проєкті 'chromium'",
          },
        },
        {
          id: "b",
          label: {
            en: "Add dependencies: ['setup'] in the 'chromium' project configuration",
            uk: "Додати dependencies: ['setup'] у конфігурацію проєкту 'chromium'",
          },
        },
        {
          id: "c",
          label: {
            en: "Name the setup project 'setup' — Playwright runs any project named 'setup' first automatically",
            uk: "Назви setup-проєкт 'setup' — Playwright автоматично запускає будь-який проєкт з назвою 'setup' першим",
          },
        },
        {
          id: "d",
          label: {
            en: "Use testProject.before() to declare setup as a prerequisite",
            uk: "Використовуй testProject.before() щоб оголосити setup як передумову",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `dependencies` array in a project config is how you declare ordering. `dependencies: ['setup']` means 'run the project named setup before this project'. The 'setup' name has no special meaning — Playwright doesn't auto-run any project based on its name. You also need to configure which test files the setup project runs via `testMatch: /global\\.setup\\.ts/`. The `teardown` option (pointing to a cleanup project) mirrors `dependencies`: it runs after all projects that depend on setup have finished.",
        uk: "Масив `dependencies` у конфігурації проєкту — ось як оголошується порядок. `dependencies: ['setup']` означає 'запустити проєкт з назвою setup перед цим проєктом'. Назва 'setup' не має особливого значення — Playwright не запускає жоден проєкт автоматично на основі його назви. Також потрібно налаштувати які тестові файли запускає setup-проєкт через `testMatch: /global\\.setup\\.ts/`. Опція `teardown` (що вказує на проєкт прибирання) дзеркалює `dependencies`: виконується після того як усі проєкти що залежать від setup завершаться.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You use globalSetup to seed a test database and store the seed IDs in `process.env`. Will the tests be able to read those environment variables?",
        uk: "Ти використовуєш globalSetup щоб наповнити тестову базу даних і зберігаєш ID seeds у `process.env`. Чи зможуть тести читати ці змінні середовища?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "No — globalSetup runs in a separate process, so process.env changes don't reach test workers",
            uk: "Ні — globalSetup виконується в окремому процесі тому зміни process.env не досягають тест-воркерів",
          },
        },
        {
          id: "b",
          label: {
            en: "Yes — Playwright serializes process.env changes from globalSetup and injects them into each test worker process",
            uk: "Так — Playwright серіалізує зміни process.env з globalSetup і впорскує їх в кожен процес тест-воркера",
          },
        },
        {
          id: "c",
          label: {
            en: "Only if you explicitly use dotenv to write the variables to a .env file",
            uk: "Лише якщо явно використовуєш dotenv щоб записати змінні в .env файл",
          },
        },
        {
          id: "d",
          label: {
            en: "Only on CI — locally process.env is isolated per process",
            uk: "Лише на CI — локально process.env ізольований для кожного процесу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright specifically handles this: `process.env` mutations made in `globalSetup` are serialized and propagated to all test worker processes. This is intentional and documented — it's the primary mechanism for passing runtime data (generated IDs, dynamic tokens, computed URLs) from global setup into tests. It's worth noting this only works one way: globalSetup → tests. Changes made by tests don't propagate back to globalSetup or to other tests.",
        uk: "Playwright спеціально обробляє це: мутації `process.env` зроблені в `globalSetup` серіалізуються і поширюються на всі процеси тест-воркерів. Це навмисно і задокументовано — основний механізм для передачі даних часу виконання (згенеровані ID, динамічні токени, обчислені URL) з глобального setup у тести. Варто зазначити що це працює лише в одному напрямку: globalSetup → тести. Зміни зроблені тестами не поширюються назад у globalSetup або в інші тести.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You're debugging a single test that depends on the 'setup' project. You know the storageState file already exists from the last run. How do you run just that test without re-running the login setup?",
        uk: "Ти дебажиш окремий тест що залежить від проєкту 'setup'. Ти знаєш що файл storageState вже існує з попереднього запуску. Як запустити лише цей тест без повторного виконання login setup?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Delete the dependencies array from the chromium project temporarily",
            uk: "Тимчасово видали масив dependencies з проєкту chromium",
          },
        },
        {
          id: "b",
          label: {
            en: "Run with --no-deps flag — skips dependent projects and runs only the selected test directly",
            uk: "Запускай з прапорцем --no-deps — пропускає залежні проєкти і запускає лише вибраний тест напряму",
          },
        },
        {
          id: "c",
          label: {
            en: "Run with --skip-setup — the dedicated flag for skipping setup projects",
            uk: "Запускай з --skip-setup — спеціальний прапорець для пропуску setup-проєктів",
          },
        },
        {
          id: "d",
          label: {
            en: "There's no way to skip dependencies — they always run for correctness",
            uk: "Немає способу пропустити залежності — вони завжди виконуються для коректності",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`--no-deps` tells Playwright to skip all dependent projects and run only the explicitly specified test. This is safe when you know the setup state is already in place (the storageState file exists, the database is seeded). It's a debugging shortcut — the storageState file is reused from the previous run. This is exactly the use case described in the docs: local debugging iteration where re-running login adds 10–20 seconds you don't need.",
        uk: "`--no-deps` говорить Playwright пропустити всі залежні проєкти і запустити лише явно вказаний тест. Це безпечно коли знаєш що стан setup вже на місці (файл storageState існує, база даних наповнена). Це ярлик для дебагу — файл storageState перевикористовується з попереднього запуску. Саме цей випадок описаний у документації: ітерація локального дебагу де повторний логін додає 10–20 секунд які тобі не потрібні.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "The 'setup' project has a `teardown: 'cleanup'` option. When does the cleanup project run?",
        uk: "Проєкт 'setup' має опцію `teardown: 'cleanup'`. Коли виконується проєкт cleanup?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Immediately after the setup project finishes, before any tests run",
            uk: "Відразу після завершення проєкту setup, до виконання будь-яких тестів",
          },
        },
        {
          id: "b",
          label: {
            en: "After all test projects that depend on 'setup' have finished running",
            uk: "Після того як усі тест-проєкти що залежать від 'setup' завершили виконання",
          },
        },
        {
          id: "c",
          label: {
            en: "After each individual test that depended on the setup project",
            uk: "Після кожного окремого тесту що залежав від setup-проєкту",
          },
        },
        {
          id: "d",
          label: {
            en: "Only if the tests fail — it's a failure handler",
            uk: "Лише якщо тести падають — це обробник помилок",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `teardown` project runs after all projects that depend on the setup project have completed — regardless of whether they passed or failed. This makes it the correct place for cleanup that must happen after the full suite: deleting test users, clearing seeded data, revoking test tokens. It does not run between individual tests. If you need per-test cleanup, use `afterEach` or fixture teardown in the test files.",
        uk: "Проєкт `teardown` виконується після того як усі проєкти що залежать від setup-проєкту завершились — незалежно від того чи вони пройшли чи впали. Це правильне місце для прибирання яке має відбутися після повного набору тестів: видалення тестових юзерів, очищення наповнених даних, відкликання тестових токенів. Він не виконується між окремими тестами. Якщо потрібне прибирання для кожного тесту — використовуй `afterEach` або teardown фікстур у файлах тестів.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You run `npx playwright test --grep 'checkout'` to filter tests. The checkout tests depend on the 'setup' project. Does the setup project still run?",
        uk: "Ти запускаєш `npx playwright test --grep 'checkout'` щоб відфільтрувати тести. Тести checkout залежать від проєкту 'setup'. Чи буде все одно виконуватися setup-проєкт?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "No — --grep only runs matching tests and skips all dependencies to save time",
            uk: "Ні — --grep запускає лише відповідні тести і пропускає всі залежності для економії часу",
          },
        },
        {
          id: "b",
          label: {
            en: "Yes — Playwright still runs dependent projects first; you need --no-deps to explicitly skip them",
            uk: "Так — Playwright все одно спочатку запускає залежні проєкти; потрібен --no-deps щоб явно їх пропустити",
          },
        },
        {
          id: "c",
          label: {
            en: "Only if the storageState file is missing — Playwright checks before running setup",
            uk: "Лише якщо файл storageState відсутній — Playwright перевіряє перед запуском setup",
          },
        },
        {
          id: "d",
          label: {
            en: "It depends on whether the setup project tests also match the --grep pattern",
            uk: "Залежить від того чи тести setup-проєкту також відповідають шаблону --grep",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Even when filtering with `--grep`, Playwright honors the `dependencies` declaration. If the selected tests depend on 'setup', setup runs first. This is the safe default: Playwright can't know whether the previous setup state is still valid. The `--no-deps` flag is explicitly for overriding this behavior when you're confident the setup state exists and is current. Without `--no-deps`, Playwright always runs dependencies for the selected tests.",
        uk: "Навіть при фільтрації через `--grep` Playwright дотримується оголошення `dependencies`. Якщо вибрані тести залежать від 'setup' — setup виконується першим. Це безпечне значення за замовчуванням: Playwright не може знати чи попередній стан setup все ще дійсний. Прапорець `--no-deps` призначений саме для перевизначення цієї поведінки коли впевнений що стан setup існує і актуальний. Без `--no-deps` Playwright завжди запускає залежності для вибраних тестів.",
      },
    },
  ],
}
