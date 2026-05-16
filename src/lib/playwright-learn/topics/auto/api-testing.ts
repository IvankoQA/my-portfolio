import type { PlaywrightTopic } from "../../types"

export const apiTestingTopic: PlaywrightTopic = {
  slug: "api-testing",
  groupId: "guides",
  order: 110,
  level: "intermediate",
  trackOrder: 16,
  sourceDoc: "api-testing-js.md",
  officialDocsUrl: "https://playwright.dev/docs/api-testing",
  title: {
    en: "API testing",
    uk: "Тестування API",
  },
  summary: {
    en: "Playwright can make HTTP requests directly from the test — no browser needed. Useful for setting up test data, calling REST APIs, and checking server-side state.",
    uk: "Playwright може виконувати HTTP запити прямо з тесту — без браузера. Корисно для підготовки тестових даних, виклику REST API і перевірки стану на сервері.",
  },
  sections: [
    {
      id: "why-api-in-tests",
      title: {
        en: "Why call the API from tests",
        uk: "Навіщо викликати API з тестів",
      },
      diagram: {
        mermaid: `flowchart LR
  T["Test"] --> R["request fixture\nAPIRequestContext"]
  T --> P["page fixture\nPage"]
  R -->|"POST /api/orders\nseed data fast"| SRV["Backend API"]
  SRV -->|"data exists in DB"| P
  P -->|"goto('/orders')\nassert UI shows order"| UI["Browser UI"]`,
        caption: {
          en: "Use the request fixture to seed data via API (fast), then use the page fixture to verify it in the UI",
          uk: "Використовуйте фікстуру request для підготовки даних через API (швидко), потім page для перевірки в UI",
        },
      },
      paragraphs: [
        {
          en: "Browser tests are slow for setup. If your test needs 10 orders in the database before it runs, creating them through the UI takes 10 form submissions. Creating them via API takes 10 HTTP calls — 10-50x faster. I use API calls for three things in my tests:\n1. Seed test data before the UI test starts\n2. Call the API directly and verify the JSON response\n3. Check server state after a UI action (did the record actually get saved?)",
          uk: "Браузерні тести — повільний спосіб підготовки. Якщо тест потребує 10 замовлень в базі перед запуском, їх створення через UI займе 10 відправок форм. Через API — 10 HTTP запитів, в 10-50 разів швидше. Я використовую API виклики в тестах для трьох речей:\n1. Підготовка тестових даних перед UI тестом\n2. Прямий виклик API і перевірка JSON відповіді\n3. Перевірка стану сервера після UI дії (чи запис дійсно збережено?)",
        },
      ],
    },
    {
      id: "request-fixture",
      title: {
        en: "The request fixture",
        uk: "Фікстура request",
      },
      paragraphs: [
        {
          en: "Playwright Test gives you a `request` fixture in every test — it's an `APIRequestContext` that can make GET, POST, PUT, DELETE and other HTTP requests. It shares cookies with the test's browser context, so if you're logged in via the UI, the API calls are also authenticated.",
          uk: "Playwright Test дає тобі фікстуру `request` у кожному тесті — це `APIRequestContext` що може виконувати GET, POST, PUT, DELETE та інші HTTP запити. Вона ділить cookies з browser context тесту, тому якщо ти залогінений через UI, API виклики теж автентифіковані.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-request",
          language: "ts",
          code: `import { test, expect } from '@playwright/test'

test('GET /api/orders returns list', async ({ request }) => {
  const response = await request.get('/api/orders')

  expect(response.status()).toBe(200)
  const body = await response.json()
  expect(body.orders).toBeInstanceOf(Array)
  expect(body.total).toBeGreaterThanOrEqual(0)
})

test('POST /api/orders creates an order', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: {
      item: 'Laptop',
      quantity: 1,
      customerId: 'cust-001',
    },
  })

  expect(response.status()).toBe(201)
  const order = await response.json()
  expect(order.id).toBeTruthy()
  expect(order.status).toBe('pending')
})`,
        },
      ],
    },
    {
      id: "seed-data",
      title: {
        en: "Seed data before UI tests",
        uk: "Підготовка даних перед UI тестами",
      },
      paragraphs: [
        {
          en: "The most practical use: create test data via API, then verify it in the UI. This avoids clicking through forms just to set up a starting state. The UI test focuses on what it's actually testing.",
          uk: "Найпрактичніше застосування: створити тестові дані через API, потім перевірити їх в UI. Це дозволяє не клікати по формах лише для підготовки стартового стану. UI тест фокусується на тому що він справді перевіряє.",
        },
      ],
      codeBlocks: [
        {
          id: "seed-and-test",
          language: "ts",
          code: `test('order appears in dashboard after creation', async ({ request, page }) => {
  // Створюємо замовлення через API (швидко, без форм)
  const res = await request.post('/api/orders', {
    data: { item: 'Keyboard', quantity: 2 },
  })
  const { id: orderId } = await res.json()

  // Перевіряємо в UI що воно з'явилось
  await page.goto('/dashboard')
  await expect(page.getByRole('row').filter({ hasText: orderId })).toBeVisible()
})

test('deleting from UI removes from API', async ({ request, page }) => {
  // Seed через API
  const res = await request.post('/api/orders', {
    data: { item: 'Mouse', quantity: 1 },
  })
  const { id: orderId } = await res.json()

  // Видаляємо через UI
  await page.goto('/orders')
  await page.getByRole('row').filter({ hasText: orderId })
    .getByRole('button', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()

  // Перевіряємо що API повертає 404
  const checkRes = await request.get(\`/api/orders/\${orderId}\`)
  expect(checkRes.status()).toBe(404)
})`,
        },
      ],
    },
    {
      id: "base-url",
      title: {
        en: "Configure base URL",
        uk: "Базовий URL для API",
      },
      paragraphs: [
        {
          en: "Set `baseURL` in the config and you can use relative paths in all requests — both in `page.goto()` and in `request.get()`. This makes it easy to switch between local, staging, and production environments.",
          uk: "Встанови `baseURL` в конфізі і можна використовувати відносні шляхи у всіх запитах — і в `page.goto()`, і в `request.get()`. Це спрощує перемикання між локальним, staging і production оточеннями.",
        },
      ],
      codeBlocks: [
        {
          id: "base-url",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'https://app.example.com',
  },
})

// В тесті — відносні шляхи
test('api and ui share base url', async ({ request, page }) => {
  await page.goto('/orders')         // → https://app.example.com/orders
  const res = await request.get('/api/orders')  // → https://app.example.com/api/orders
})`,
        },
      ],
    },
    {
      id: "standalone-context",
      title: {
        en: "API context without a browser",
        uk: "API context без браузера",
      },
      paragraphs: [
        {
          en: "For pure API tests — no browser needed at all — use `request.newContext()` to create a standalone `APIRequestContext`. This is faster and uses fewer resources than launching a full browser context.",
          uk: "Для чисто API тестів — без браузера взагалі — використовуй `request.newContext()` щоб створити окремий `APIRequestContext`. Це швидше і менш ресурсомістке ніж запуск повного browser context.",
        },
      ],
      codeBlocks: [
        {
          id: "standalone",
          language: "ts",
          code: `import { test, expect, request } from '@playwright/test'

test('create and fetch order via API only', async () => {
  const apiCtx = await request.newContext({
    baseURL: 'https://app.example.com',
    extraHTTPHeaders: {
      'Authorization': \`Bearer \${process.env.API_TOKEN}\`,
    },
  })

  const createRes = await apiCtx.post('/api/orders', {
    data: { item: 'Monitor', quantity: 1 },
  })
  expect(createRes.status()).toBe(201)

  const { id } = await createRes.json()
  const getRes = await apiCtx.get(\`/api/orders/\${id}\`)
  expect(getRes.status()).toBe(200)

  await apiCtx.dispose()
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Why use API calls to seed test data instead of driving the UI?",
        uk: "Навіщо використовувати API виклики для підготовки даних замість UI?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "API calls are more readable than UI interactions",
            uk: "API виклики більш читабельні ніж UI взаємодії",
          },
        },
        {
          id: "b",
          label: {
            en: "API calls are 10-50x faster and don't need a visible browser",
            uk: "API виклики в 10-50 разів швидші і не потребують видимого браузера",
          },
        },
        {
          id: "c",
          label: {
            en: "API calls automatically clean up test data after the test",
            uk: "API виклики автоматично прибирають тестові дані після тесту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Creating data via API skips form loading, filling and submission — each of which involves network round-trips and browser rendering. API calls are orders of magnitude faster for setup, letting the UI test focus on what it's actually verifying.",
        uk: "Створення даних через API пропускає завантаження форм, заповнення і відправку — кожне з яких включає мережеві запити і рендеринг браузера. API виклики на порядки швидші для підготовки, дозволяючи UI тесту фокусуватися на тому що він справді перевіряє.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What does the `request` fixture in Playwright Test provide?",
        uk: "Що надає фікстура `request` в Playwright Test?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "An object to intercept browser network requests via page.route()",
            uk: "Об'єкт для перехоплення мережевих запитів браузера через page.route()",
          },
        },
        {
          id: "b",
          label: {
            en: "An APIRequestContext that can make HTTP requests (GET, POST, PUT, DELETE) directly from Node.js",
            uk: "APIRequestContext що може виконувати HTTP-запити (GET, POST, PUT, DELETE) напряму з Node.js",
          },
        },
        {
          id: "c",
          label: {
            en: "A mock server that replaces the real backend automatically",
            uk: "Мок-сервер що автоматично замінює реальний бекенд",
          },
        },
        {
          id: "d",
          label: {
            en: "A reference to the browser's fetch() function",
            uk: "Посилання на функцію fetch() браузера",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `request` fixture is an `APIRequestContext` — Playwright's built-in HTTP client that runs in Node.js. It shares cookies with the test's browser context, so authenticated sessions are reflected in API calls. You use it with `request.get()`, `request.post()`, `request.put()`, and `request.delete()`.",
        uk: "Фікстура `request` — це `APIRequestContext`, вбудований HTTP-клієнт Playwright що виконується в Node.js. Він ділить cookies з browser context тесту, тому автентифіковані сесії відображаються в API-викликах. Використовується з `request.get()`, `request.post()`, `request.put()` і `request.delete()`.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Where do you configure the base URL so that request.get('/api/orders') resolves to the correct host?",
        uk: "Де налаштовувати base URL щоб request.get('/api/orders') розрезолвився до правильного хосту?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Pass it as the first argument to every request call: request.get('https://app.example.com/api/orders')",
            uk: "Передавати як перший аргумент кожного виклику: request.get('https://app.example.com/api/orders')",
          },
        },
        {
          id: "b",
          label: {
            en: "Set baseURL in playwright.config.ts under the use key",
            uk: "Встановити baseURL в playwright.config.ts в ключі use",
          },
        },
        {
          id: "c",
          label: {
            en: "Set process.env.BASE_URL in the test file",
            uk: "Встановити process.env.BASE_URL в тестовому файлі",
          },
        },
        {
          id: "d",
          label: {
            en: "request fixture always requires absolute URLs",
            uk: "Фікстура request завжди вимагає абсолютних URL",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Setting `baseURL` in `playwright.config.ts` under `use: { baseURL: 'https://app.example.com' }` applies to both `page.goto()` and `request.*` calls. Relative paths like `/api/orders` are resolved against this base URL. This makes it easy to switch environments — change one line in the config, not every individual test.",
        uk: "Встановлення `baseURL` в `playwright.config.ts` під `use: { baseURL: 'https://app.example.com' }` застосовується до обох викликів `page.goto()` і `request.*`. Відносні шляхи як `/api/orders` розрезолвляються відносно цього base URL. Це спрощує перемикання оточень — змінити один рядок в конфізі, а не кожен окремий тест.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does request.post('/api/orders', { data: { item: 'Laptop' } }) return?",
        uk: "Що повертає request.post('/api/orders', { data: { item: 'Laptop' } })?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The parsed JSON body of the response directly",
            uk: "Безпосередньо розпарсоване JSON-тіло відповіді",
          },
        },
        {
          id: "b",
          label: {
            en: "An APIResponse object — you need to call response.json() or response.text() to read the body",
            uk: "Об'єкт APIResponse — потрібно викликати response.json() або response.text() щоб прочитати тіло",
          },
        },
        {
          id: "c",
          label: {
            en: "A Promise<boolean> indicating success or failure",
            uk: "Promise<boolean> що вказує на успіх або невдачу",
          },
        },
        {
          id: "d",
          label: {
            en: "The HTTP status code as a number",
            uk: "HTTP-код статусу як число",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "All `request.*` methods return a `Promise<APIResponse>`. The `APIResponse` object has `.status()` for the HTTP status code, `.ok()` which is true for 2xx statuses, `.json()` to parse the body as JSON, `.text()` to get the body as a string, and `.headers()` to inspect response headers.",
        uk: "Всі методи `request.*` повертають `Promise<APIResponse>`. Об'єкт `APIResponse` має `.status()` для HTTP-коду статусу, `.ok()` що є true для статусів 2xx, `.json()` для парсингу тіла як JSON, `.text()` для отримання тіла як рядка і `.headers()` для перевірки заголовків відповіді.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What is the difference between the `request` fixture and `request.newContext()` (also imported as `playwright.request.newContext()`)?",
        uk: "В чому різниця між фікстурою `request` і `request.newContext()` (також імпортується як `playwright.request.newContext()`)?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are identical — newContext() is just an alias",
            uk: "Вони однакові — newContext() просто псевдонім",
          },
        },
        {
          id: "b",
          label: {
            en: "The `request` fixture shares cookies with the browser context; newContext() creates an isolated context with its own cookie jar and headers",
            uk: "Фікстура `request` ділить cookies з browser context; newContext() створює ізольований контекст з власним jar cookies і заголовками",
          },
        },
        {
          id: "c",
          label: {
            en: "newContext() supports POST requests; the fixture only supports GET",
            uk: "newContext() підтримує POST-запити; фікстура підтримує лише GET",
          },
        },
        {
          id: "d",
          label: {
            en: "The `request` fixture requires a browser; newContext() does not",
            uk: "Фікстура `request` вимагає браузера; newContext() — ні",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `request` fixture is automatically scoped to the test's browser context — it shares the same cookies, so logging in via the browser also authenticates the API calls. `request.newContext()` creates a standalone context with its own isolated cookie jar, custom headers, and baseURL. Use it for pure API tests that need separate authentication or for global setup/teardown where no browser is needed.",
        uk: "Фікстура `request` автоматично прив'язана до browser context тесту — вона ділить ті самі cookies, тому логін через браузер також автентифікує API-виклики. `request.newContext()` створює автономний контекст з власним ізольованим jar cookies, кастомними заголовками і baseURL. Використовуй для чисто API-тестів що потребують окремої автентифікації або для глобального setup/teardown де браузер не потрібен.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you check that an API response returned HTTP 201 Created?",
        uk: "Як перевірити що API-відповідь повернула HTTP 201 Created?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "expect(response).toBe(201)",
            uk: "expect(response).toBe(201)",
          },
        },
        {
          id: "b",
          label: {
            en: "expect(response.status()).toBe(201)",
            uk: "expect(response.status()).toBe(201)",
          },
        },
        {
          id: "c",
          label: {
            en: "expect(response.ok()).toBe(201)",
            uk: "expect(response.ok()).toBe(201)",
          },
        },
        {
          id: "d",
          label: {
            en: "expect(await response.json().status).toBe(201)",
            uk: "expect(await response.json().status).toBe(201)",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`response.status()` returns the HTTP status code as a number. `expect(response.status()).toBe(201)` checks for exactly 201 Created. `response.ok()` returns a boolean (true for 2xx codes) — it won't distinguish between 200, 201, and 204. For precise status assertions always use `.status()`.",
        uk: "`response.status()` повертає HTTP-код статусу як число. `expect(response.status()).toBe(201)` перевіряє точно 201 Created. `response.ok()` повертає boolean (true для кодів 2xx) — воно не розрізняє 200, 201 і 204. Для точних assertions статусу завжди використовуй `.status()`.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You need to authenticate with a token and make API calls without a browser in a global setup file. What do you use?",
        uk: "Потрібно автентифікуватися з токеном і робити API-виклики без браузера в файлі глобального setup. Що використовуєш?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The `request` fixture — it works in globalSetup too",
            uk: "Фікстура `request` — вона теж працює в globalSetup",
          },
        },
        {
          id: "b",
          label: {
            en: "import { request } from '@playwright/test'; const apiCtx = await request.newContext({ extraHTTPHeaders: { Authorization: 'Bearer token' } })",
            uk: "import { request } from '@playwright/test'; const apiCtx = await request.newContext({ extraHTTPHeaders: { Authorization: 'Bearer token' } })",
          },
        },
        {
          id: "c",
          label: {
            en: "Use Node.js fetch() — Playwright API testing only works inside test() blocks",
            uk: "Використовуй Node.js fetch() — API тестування Playwright працює лише всередині блоків test()",
          },
        },
        {
          id: "d",
          label: {
            en: "Launch a browser with request.newBrowser() and use page.goto() for API calls",
            uk: "Запустити браузер з request.newBrowser() і використовувати page.goto() для API-викликів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "In global setup files, there's no `request` fixture because fixtures only exist inside `test()` blocks. Instead, import `request` from `@playwright/test` and call `request.newContext()` to create a standalone `APIRequestContext`. Pass `extraHTTPHeaders` for authentication tokens. Remember to call `await apiCtx.dispose()` at the end of global setup to release resources.",
        uk: "У файлах глобального setup немає фікстури `request` бо фікстури існують лише всередині блоків `test()`. Замість цього імпортуй `request` з `@playwright/test` і викликай `request.newContext()` для створення автономного `APIRequestContext`. Передавай `extraHTTPHeaders` для токенів автентифікації. Пам'ятай викликати `await apiCtx.dispose()` в кінці глобального setup для звільнення ресурсів.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "After your UI test deletes an order, how do you verify on the server side that the record is actually gone?",
        uk: "Після того як твій UI-тест видаляє замовлення, як перевірити на стороні сервера що запис дійсно зник?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Check that the row is not visible on the page with expect(page.getByText(orderId)).not.toBeVisible()",
            uk: "Перевірити що рядок не видимий на сторінці через expect(page.getByText(orderId)).not.toBeVisible()",
          },
        },
        {
          id: "b",
          label: {
            en: "Make a GET request to /api/orders/:id using the `request` fixture and assert response.status() is 404",
            uk: "Зробити GET-запит до /api/orders/:id через фікстуру `request` і перевірити що response.status() дорівнює 404",
          },
        },
        {
          id: "c",
          label: {
            en: "Reload the page and check localStorage",
            uk: "Перезавантажити сторінку і перевірити localStorage",
          },
        },
        {
          id: "d",
          label: {
            en: "Trust the UI — if the row disappears, the server must have deleted it",
            uk: "Довіряти UI — якщо рядок зникає, сервер мусив видалити його",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Asserting the UI row is gone only proves the frontend updated — it doesn't confirm the server actually deleted the record. The backend could have returned an error that the UI silently ignored. Making a direct API call with `request.get('/api/orders/:id')` and asserting `response.status() === 404` proves the server-side deletion actually happened.",
        uk: "Перевірка що рядок UI зник лише доводить що фронтенд оновився — це не підтверджує що сервер дійсно видалив запис. Бекенд міг повернути помилку яку UI тихо проігнорував. Прямий API-виклик через `request.get('/api/orders/:id')` і перевірка `response.status() === 404` доводить що видалення на стороні сервера дійсно відбулося.",
      },
    },
  ],
}
