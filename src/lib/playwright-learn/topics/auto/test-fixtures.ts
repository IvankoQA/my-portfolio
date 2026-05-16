import type { PlaywrightTopic } from "../../types"

export const testFixturesTopic: PlaywrightTopic = {
  slug: "test-fixtures",
  groupId: "test-runner",
  order: 335,
  level: "intermediate",
  trackOrder: 4,
  sourceDoc: "test-fixtures-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-fixtures",
  title: {
    en: "Fixtures",
    uk: "Фікстури",
  },
  summary: {
    en: "Fixtures are the better alternative to beforeEach/afterEach. They're composable, on-demand, and automatically cleaned up. Once you understand them, you won't go back to setup hooks.",
    uk: "Фікстури — краща альтернатива beforeEach/afterEach. Вони компонуються, запускаються за потреби і автоматично прибирають за собою. Як тільки розумієш їх — повертатися до хуків не хочеться.",
  },
  sections: [
    {
      id: "what-are-fixtures",
      title: {
        en: "What fixtures are",
        uk: "Що таке фікстури",
      },
      diagram: {
        mermaid: `sequenceDiagram
  participant PW as Playwright
  participant F as Fixture
  participant T as Test
  PW->>F: Setup (everything before use())
  F->>T: use(value) — тест отримує значення
  T->>T: Runs test body
  T->>F: Test done
  F->>F: Teardown (everything after use())`,
        caption: {
          en: "use() is the yield point — setup before, teardown after",
          uk: "use() — точка передачі. Setup до, teardown після",
        },
      },
      paragraphs: [
        {
          en: "A fixture is a function that prepares something for a test and cleans it up after. The split is at `await use(value)` — everything before is setup, everything after is teardown. When you request a fixture in a test's argument list, Playwright runs it automatically and passes the value.",
          uk: "Фікстура — це функція що готує щось для тесту і прибирає після. Точка розділення — `await use(value)`: все до — це setup, все після — teardown. Коли запитуєш фікстуру в списку аргументів тесту — Playwright автоматично запускає її і передає значення.",
        },
        {
          en: "Built-in fixtures you already use: `page`, `context`, `browser`, `request`. They all work this way — Playwright creates them before the test and cleans up after.",
          uk: "Вбудовані фікстури що ти вже використовуєш: `page`, `context`, `browser`, `request`. Всі вони працюють так само — Playwright створює їх до тесту і прибирає після.",
        },
      ],
    },
    {
      id: "fixtures-vs-hooks",
      title: {
        en: "Why fixtures beat beforeEach",
        uk: "Чому фікстури кращі за beforeEach",
      },
      paragraphs: [
        {
          en: "With `beforeEach`, setup and teardown are in separate blocks that have to share state through outer variables. The test has no way to know what was set up without reading all the hooks. Fixtures solve this: setup, value, and teardown are all in one place, and the test explicitly declares what it needs in its argument list.",
          uk: "З `beforeEach` — setup і teardown в окремих блоках що мають ділити стан через зовнішні змінні. Тест не може знати що було підготовлено без читання всіх хуків. Фікстури вирішують це: setup, значення і teardown — все в одному місці, і тест явно оголошує що йому потрібно у списку аргументів.",
        },
        {
          en: "Another advantage: fixtures are on-demand. If a test doesn't need `loggedInPage`, Playwright doesn't create it. With `beforeEach`, it runs for every test whether or not the test needs what it sets up.",
          uk: "Ще перевага: фікстури — за потреби. Якщо тест не потребує `loggedInPage` — Playwright не створює її. З `beforeEach` — запускається для кожного тесту незалежно від того чи потрібне те що він готує.",
        },
      ],
      codeBlocks: [
        {
          id: "hooks-vs-fixtures",
          language: "ts",
          code: `// ❌ З beforeEach — setup розкиданий по хуках
let ordersPage: OrdersPage

test.beforeEach(async ({ page }) => {
  ordersPage = new OrdersPage(page)
  await ordersPage.goto()
  await ordersPage.seedTestOrders()
})

test.afterEach(async () => {
  await ordersPage.cleanup()
})

test('filter by status', async () => {
  await ordersPage.filterByStatus('pending')
  // ...
})

// ✅ З fixtures — все разом, явно
const test = base.extend<{ ordersPage: OrdersPage }>({
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page)
    await ordersPage.goto()
    await ordersPage.seedTestOrders()
    await use(ordersPage)         // <-- тут тест запускається
    await ordersPage.cleanup()
  },
})

test('filter by status', async ({ ordersPage }) => {
  await ordersPage.filterByStatus('pending')
  // ...
})`,
        },
      ],
    },
    {
      id: "creating-fixtures",
      title: {
        en: "Create custom fixtures",
        uk: "Власні фікстури",
      },
      paragraphs: [
        {
          en: "Use `test.extend()` to add fixtures. Define types for your fixtures, then implement each one. Export the extended `test` and `expect` — your test files import from this instead of `@playwright/test`.",
          uk: "Використовуй `test.extend()` щоб додати фікстури. Визнач типи для своїх фікстур, потім реалізуй кожну. Експортуй розширений `test` і `expect` — файли тестів імпортують з цього файлу замість `@playwright/test`.",
        },
      ],
      codeBlocks: [
        {
          id: "create-fixture",
          language: "ts",
          code: `// fixtures/index.ts
import { test as base, expect } from '@playwright/test'
import { OrdersPage } from '../pages/orders-page'
import { LoginPage } from '../pages/login-page'

type Fixtures = {
  ordersPage: OrdersPage
  loggedInPage: Page
}

export const test = base.extend<Fixtures>({
  // Фікстура що залежить від page
  ordersPage: async ({ page }, use) => {
    const orders = new OrdersPage(page)
    await orders.goto()
    await use(orders)
    // Нічого не прибираємо — кожен тест отримує свій ізольований page
  },

  // Фікстура що залежить від іншої фікстури
  loggedInPage: async ({ page }, use) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('admin@example.com')
    await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('/dashboard')
    await use(page)
    // page прибирається автоматично вбудованою фікстурою
  },
})

export { expect }`,
        },
        {
          id: "use-fixture",
          language: "ts",
          code: `// tests/orders.spec.ts
import { test, expect } from '../fixtures'

// Тест явно оголошує що йому потрібно
test('create order', async ({ ordersPage }) => {
  await ordersPage.createOrder({ item: 'Laptop', quantity: 1 })
  await expect(ordersPage.orderList).toContainText('Laptop')
})

// Можна запитувати кілька фікстур одночасно
test('admin views all orders', async ({ loggedInPage, ordersPage }) => {
  await expect(ordersPage.orderList).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "overriding-fixtures",
      title: {
        en: "Override built-in fixtures",
        uk: "Перевизначення вбудованих фікстур",
      },
      paragraphs: [
        {
          en: "You can override the built-in `page` fixture to add behavior that applies to every test — like auto-navigating to the app's base URL, or listening for console errors.",
          uk: "Можна перевизначити вбудовану фікстуру `page` щоб додати поведінку що застосовується до кожного тесту — наприклад автоматичний перехід на базовий URL застосунку або прослуховування помилок консолі.",
        },
      ],
      codeBlocks: [
        {
          id: "override-page",
          language: "ts",
          code: `// Перевизначити page — auto-navigate і збирати console errors
export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })

    await page.goto(baseURL!)
    await use(page)

    // Після тесту — перевірити що не було JS помилок
    if (consoleErrors.length > 0) {
      console.warn('Console errors during test:', consoleErrors)
    }
  },
})`,
        },
      ],
    },
    {
      id: "worker-scoped-fixtures",
      title: {
        en: "Worker-scoped fixtures — share between tests",
        uk: "Worker-scoped фікстури — спільні між тестами",
      },
      diagram: {
        mermaid: `flowchart LR
  subgraph W1["Worker 1"]
    WF1["worker fixture\n(created once)"] --> T1A["test A"]
    WF1 --> T1B["test B"]
    WF1 --> T1C["test C"]
  end
  subgraph W2["Worker 2"]
    WF2["worker fixture\n(created once)"] --> T2A["test D"]
    WF2 --> T2B["test E"]
  end`,
        caption: {
          en: "Worker-scoped fixtures are created once per worker process and shared across all tests in that worker — ideal for expensive DB connections or login sessions",
          uk: "Worker-scoped фікстури створюються один раз на воркер-процес і діляться між усіма тестами — ідеально для дорогих підключень до БД або логін-сесій",
        },
      },
      paragraphs: [
        {
          en: "By default, fixtures are test-scoped — created fresh for each test. Worker-scoped fixtures are created once per parallel worker and shared across all tests in that worker. Use this for expensive operations like database connections or browser-level authentication.",
          uk: "За замовчуванням фікстури test-scoped — створюються заново для кожного тесту. Worker-scoped фікстури створюються один раз на паралельний worker і діляться між усіма тестами в ньому. Використовуй для дорогих операцій: підключення до бази або автентифікація на рівні браузера.",
        },
      ],
      codeBlocks: [
        {
          id: "worker-fixture",
          language: "ts",
          code: `// Авторизація один раз на worker, а не на кожний тест
export const test = base.extend({
  workerAuthState: [
    async ({ browser }, use) => {
      // Це виконується один раз на worker
      const page = await browser.newPage({ storageState: undefined })
      await page.goto('/login')
      await page.getByLabel('Email').fill(\`worker\${test.info().parallelIndex}@test.com\`)
      await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
      await page.getByRole('button', { name: 'Sign in' }).click()
      await page.waitForURL('/dashboard')

      const state = await page.context().storageState()
      await page.close()

      await use(state) // всі тести у worker'і отримують цей стан
    },
    { scope: 'worker' }, // <-- ключовий параметр
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
        en: "In a fixture, what happens AFTER await use(value)?",
        uk: "У фікстурі, що відбувається ПІСЛЯ await use(value)?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Nothing — the fixture function ends",
            uk: "Нічого — функція фікстури завершується",
          },
        },
        {
          id: "b",
          label: {
            en: "The teardown code runs — cleanup after the test",
            uk: "Запускається teardown код — прибирання після тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "The next test's setup begins",
            uk: "Починається setup наступного тесту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`await use(value)` is the yield point: the test runs while this line is 'awaiting'. When the test finishes, `use()` resolves and the fixture continues — running any cleanup code after it. This is why setup and teardown can be in the same function.",
        uk: "`await use(value)` — точка передачі: тест виконується поки цей рядок 'чекає'. Коли тест завершується — `use()` резолвиться і фікстура продовжується, виконуючи будь-який код прибирання після неї. Тому setup і teardown можуть бути в одній функції.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You want to create a database connection that's shared across all tests in a worker (not recreated per test). What scope do you use?",
        uk: "Хочеш створити підключення до бази що ділиться між усіма тестами у воркері (не перестворюється для кожного тесту). Який scope використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "{ scope: 'test' } — the default",
            uk: "{ scope: 'test' } — за замовчуванням",
          },
        },
        {
          id: "b",
          label: {
            en: "{ scope: 'worker' } — shared across all tests in one parallel worker",
            uk: "{ scope: 'worker' } — спільний між усіма тестами в одному паралельному воркері",
          },
        },
        {
          id: "c",
          label: {
            en: "{ scope: 'global' } — shared across all tests in the entire run",
            uk: "{ scope: 'global' } — спільний між усіма тестами всього запуску",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`{ scope: 'worker' }` creates the fixture once per parallel worker and shares it across all tests that run in that worker. There is no 'global' scope in Playwright — for global setup/teardown use globalSetup in the config instead.",
        uk: "`{ scope: 'worker' }` створює фікстуру один раз на паралельний worker і ділиться між усіма тестами що виконуються в ньому. 'global' scope у Playwright не існує — для глобального setup/teardown використовуй globalSetup у конфізі.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "How do you create a custom fixture and make it available to test files?",
        uk: "Як створити власну фікстуру і зробити її доступною для файлів тестів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Call test.addFixture() anywhere in the test file before using it",
            uk: "Викликати test.addFixture() будь-де у файлі тесту перед використанням",
          },
        },
        {
          id: "b",
          label: {
            en: "Use test.extend<Fixtures>({...}) to create a new test object and export it; test files import this extended test instead of @playwright/test",
            uk: "Використати test.extend<Fixtures>({...}) для створення нового об'єкта test і експортувати його; файли тестів імпортують цей розширений test замість @playwright/test",
          },
        },
        {
          id: "c",
          label: {
            en: "Register fixtures in playwright.config.ts under the fixtures key",
            uk: "Зареєструвати фікстури у playwright.config.ts під ключем fixtures",
          },
        },
        {
          id: "d",
          label: {
            en: "Declare fixtures as global variables and use beforeAll to initialise them",
            uk: "Оголосити фікстури як глобальні змінні і використовувати beforeAll для їхньої ініціалізації",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.extend<Fixtures>({...})` creates a new `test` object that includes your custom fixtures. You export this extended `test` (and `expect`) from a fixtures file, and all your test files import from there instead of directly from `@playwright/test`. This is the canonical pattern — there is no `fixtures` key in the config.",
        uk: "`test.extend<Fixtures>({...})` створює новий об'єкт `test` що включає твої власні фікстури. Ти експортуєш цей розширений `test` (і `expect`) з файлу фікстур, а всі файли тестів імпортують звідти замість `@playwright/test`. Це канонічний патерн — у конфігу немає ключа `fixtures`.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "A fixture is defined but a test does not list it in its argument list. When does Playwright run that fixture?",
        uk: "Фікстура визначена але тест не включає її в список аргументів. Коли Playwright виконує цю фікстуру?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Always — fixtures always run for every test whether or not they are requested",
            uk: "Завжди — фікстури завжди виконуються для кожного тесту незалежно від того чи вони запитані",
          },
        },
        {
          id: "b",
          label: {
            en: "Never — fixtures are on-demand and only run when a test explicitly requests them",
            uk: "Ніколи — фікстури запускаються за потреби і виконуються лише коли тест явно їх запитує",
          },
        },
        {
          id: "c",
          label: {
            en: "Only when the test file imports the fixture module",
            uk: "Лише коли файл тесту імпортує модуль фікстури",
          },
        },
        {
          id: "d",
          label: {
            en: "Only on the first test in the file",
            uk: "Лише для першого тесту у файлі",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Fixtures are on-demand. If a test does not include the fixture name in its argument list, Playwright does not run it. This is a key advantage over `beforeEach` — which runs for every test whether it needs the setup or not. On-demand fixtures keep tests faster and their dependencies explicit.",
        uk: "Фікстури — за потреби. Якщо тест не включає назву фікстури в список аргументів — Playwright її не запускає. Це ключова перевага над `beforeEach` — який виконується для кожного тесту незалежно від того чи потрібен йому setup. Фікстури за потреби роблять тести швидшими і їхні залежності явними.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "Which of the following are built-in Playwright fixtures available in every test without any custom setup?",
        uk: "Які з наведених є вбудованими фікстурами Playwright доступними в кожному тесті без додаткового налаштування?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page, context, browser, request, browserName",
            uk: "page, context, browser, request, browserName",
          },
        },
        {
          id: "b",
          label: {
            en: "page, context, fetch, driver, browserName",
            uk: "page, context, fetch, driver, browserName",
          },
        },
        {
          id: "c",
          label: {
            en: "page, window, storage, request, browserName",
            uk: "page, window, storage, request, browserName",
          },
        },
        {
          id: "d",
          label: {
            en: "page, context, browser, apiContext, platform",
            uk: "page, context, browser, apiContext, platform",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "The built-in Playwright fixtures are `page` (a new Page in an isolated context), `context` (the BrowserContext for that page), `browser` (the shared Browser instance), `request` (an APIRequestContext for API testing), and `browserName` (a string like 'chromium', 'firefox', 'webkit'). All others in the options are invented.",
        uk: "Вбудовані фікстури Playwright: `page` (нова Page в ізольованому контексті), `context` (BrowserContext для цієї сторінки), `browser` (спільний екземпляр Browser), `request` (APIRequestContext для API-тестування) і `browserName` (рядок типу 'chromium', 'firefox', 'webkit'). Решта варіантів — вигадані.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You want to override the built-in `page` fixture to automatically navigate to the base URL before every test. What is the correct approach?",
        uk: "Хочеш перевизначити вбудовану фікстуру `page` щоб автоматично переходити на базовий URL перед кожним тестом. Який правильний підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add a beforeEach hook in every test file that calls page.goto(baseURL)",
            uk: "Додати хук beforeEach у кожен файл тестів що викликає page.goto(baseURL)",
          },
        },
        {
          id: "b",
          label: {
            en: "Use test.extend({ page: async ({ baseURL, page }, use) => { await page.goto(baseURL!); await use(page) } }) and export the result",
            uk: "Використати test.extend({ page: async ({ baseURL, page }, use) => { await page.goto(baseURL!); await use(page) } }) і експортувати результат",
          },
        },
        {
          id: "c",
          label: {
            en: "Set autoNavigate: true in the playwright.config.ts use block",
            uk: "Встановити autoNavigate: true у блоці use playwright.config.ts",
          },
        },
        {
          id: "d",
          label: {
            en: "Override page in globalSetup by calling browser.newPage() with a startURL option",
            uk: "Перевизначити page у globalSetup викликавши browser.newPage() з опцією startURL",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "You can override built-in fixtures including `page` using `test.extend()`. The override receives the original `page` fixture as a dependency, adds behavior (navigation, console error tracking, etc.) before calling `await use(page)`, and can also add teardown after. There is no `autoNavigate` config option.",
        uk: "Можна перевизначити вбудовані фікстури включно з `page` за допомогою `test.extend()`. Перевизначення отримує оригінальну фікстуру `page` як залежність, додає поведінку (навігація, відстеження помилок консолі тощо) перед викликом `await use(page)` і може додавати teardown після. Опції `autoNavigate` у конфігу немає.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Why are fixtures considered better than beforeEach/afterEach for sharing setup and teardown?",
        uk: "Чому фікстури вважаються кращими за beforeEach/afterEach для спільного setup і teardown?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Fixtures run faster because they skip the browser startup step",
            uk: "Фікстури виконуються швидше бо пропускають крок запуску браузера",
          },
        },
        {
          id: "b",
          label: {
            en: "Fixtures keep setup, the value, and teardown in one place; tests declare dependencies explicitly; and fixtures only run when actually needed",
            uk: "Фікстури тримають setup, значення і teardown в одному місці; тести явно оголошують залежності; і фікстури виконуються лише коли справді потрібні",
          },
        },
        {
          id: "c",
          label: {
            en: "Fixtures are the only way to share state between parallel workers",
            uk: "Фікстури — єдиний спосіб ділити стан між паралельними воркерами",
          },
        },
        {
          id: "d",
          label: {
            en: "Fixtures automatically retry when they fail, unlike beforeEach hooks",
            uk: "Фікстури автоматично повторюються при падінні, на відміну від хуків beforeEach",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The three advantages of fixtures over hooks: (1) setup and teardown live in one function — no shared outer variables needed; (2) a test's argument list explicitly shows what it depends on, making tests self-documenting; (3) fixtures are on-demand — if a test doesn't need `loggedInPage`, Playwright doesn't create it. `beforeEach` always runs regardless.",
        uk: "Три переваги фікстур над хуками: (1) setup і teardown в одній функції — не потрібні спільні зовнішні змінні; (2) список аргументів тесту явно показує від чого він залежить — тести самодокументуються; (3) фікстури за потреби — якщо тест не потребує `loggedInPage` Playwright не створює її. `beforeEach` завжди виконується незалежно.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "A fixture function receives `({ page, browser }, use)` as arguments. What does this mean?",
        uk: "Функція фікстури отримує `({ page, browser }, use)` як аргументи. Що це означає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The fixture depends on both the page and browser fixtures — Playwright will create them first before running this fixture",
            uk: "Фікстура залежить від фікстур page і browser — Playwright створить їх спочатку перед запуском цієї фікстури",
          },
        },
        {
          id: "b",
          label: {
            en: "The fixture receives a copy of the page and browser objects from the previous test",
            uk: "Фікстура отримує копію об'єктів page і browser з попереднього тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "The fixture will run twice — once for page and once for browser",
            uk: "Фікстура запуститься двічі — один раз для page і один для browser",
          },
        },
        {
          id: "d",
          label: {
            en: "The fixture overrides both the page and browser built-in fixtures at the same time",
            uk: "Фікстура одночасно перевизначає вбудовані фікстури page і browser",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "Fixtures can declare other fixtures as dependencies simply by listing them in the first argument object. Playwright resolves the dependency graph automatically — `page` and `browser` are set up first, then passed into your fixture. This composability is what makes fixtures so powerful: you can build layered abstractions (e.g. a `loggedInPage` fixture that depends on `page`, which depends on `context`).",
        uk: "Фікстури можуть оголошувати інші фікстури як залежності — просто перераховуючи їх у першому об'єкті аргументів. Playwright автоматично вирішує граф залежностей — `page` і `browser` налаштовуються спочатку, потім передаються у твою фікстуру. Ця компонованість і робить фікстури такими потужними: можна будувати шаруваті абстракції (наприклад, фікстура `loggedInPage` залежить від `page`, яка залежить від `context`).",
      },
    },
  ],
}
