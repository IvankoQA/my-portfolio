import type { PlaywrightTopic } from "../../types"

export const networkTopic: PlaywrightTopic = {
  slug: "network",
  groupId: "guides",
  order: 265,
  level: "intermediate",
  trackOrder: 14,
  sourceDoc: "network.md",
  officialDocsUrl: "https://playwright.dev/docs/network",
  title: {
    en: "Network",
    uk: "Мережа",
  },
  summary: {
    en: "Playwright lets you intercept, mock, modify and block any HTTP request the browser makes — without a proxy or third-party tool.",
    uk: "Playwright дозволяє перехоплювати, підміняти, модифікувати і блокувати будь-який HTTP запит браузера — без проксі і сторонніх інструментів.",
  },
  sections: [
    {
      id: "how-routing-works",
      title: {
        en: "How network routing works",
        uk: "Як працює мережевий routing",
      },
      diagram: {
        mermaid: `sequenceDiagram
  participant T as Test
  participant P as Page
  participant R as Route handler
  participant A as API
  T->>P: page.route('/api/orders', handler)
  P->>R: GET /api/orders
  R-->>P: fulfill({ json: mockData })
  Note over A: API never called`,
        caption: {
          en: "route() intercepts the request before it reaches the server",
          uk: "route() перехоплює запит до того як він досягне сервера",
        },
      },
      paragraphs: [
        {
          en: "`page.route(pattern, handler)` registers a function that Playwright calls every time the browser makes a request matching the pattern. Inside the handler you decide what happens: fulfill with fake data, forward to the real server, modify headers, or abort entirely.",
          uk: "`page.route(pattern, handler)` реєструє функцію яку Playwright викликає кожного разу коли браузер робить запит що відповідає патерну. Всередині хендлера ти вирішуєш що відбудеться: повернути підмінні дані, переслати на реальний сервер, змінити заголовки або скасувати запит.",
        },
        {
          en: "The pattern can be a glob string (`'**/api/orders'`), a regex (`/\\.png$/`), or a full URL. Use `context.route()` if you want the handler to apply to all pages in the test, or `page.route()` for one page only.",
          uk: "Патерн може бути glob рядком (`'**/api/orders'`), regex (`/\\.png$/`) або повним URL. Використовуй `context.route()` щоб хендлер застосовувався до всіх сторінок тесту, або `page.route()` лише для однієї сторінки.",
        },
      ],
    },
    {
      id: "mock-api",
      title: {
        en: "Mock an API endpoint",
        uk: "Підміна API ендпоінта",
      },
      paragraphs: [
        {
          en: "The most common use case: return fake JSON from an API call instead of hitting the real backend. Useful for testing edge cases (empty list, error state, paginated results) that are hard to reproduce with real data.",
          uk: "Найчастіший кейс: повернути підмінний JSON замість звернення до реального бекенду. Зручно для тестування граничних випадків (порожній список, стан помилки, пагінація) які важко відтворити з реальними даними.",
        },
      ],
      codeBlocks: [
        {
          id: "mock-fulfill",
          language: "ts",
          code: `test('shows empty state when no orders', async ({ page }) => {
  // Перехоплюємо запит до API замовлень
  await page.route('**/api/orders', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ orders: [], total: 0 }),
    })
  )

  await page.goto('/orders')
  await expect(page.getByText('Замовлень ще немає')).toBeVisible()
})

test('shows error state when API fails', async ({ page }) => {
  await page.route('**/api/orders', route =>
    route.fulfill({ status: 500, body: 'Internal Server Error' })
  )

  await page.goto('/orders')
  await expect(page.getByRole('alert')).toContainText('Не вдалося завантажити')
})`,
        },
      ],
    },
    {
      id: "wait-for-response",
      title: {
        en: "Wait for a specific API response",
        uk: "Очікування конкретної відповіді API",
      },
      paragraphs: [
        {
          en: "When a user action triggers an API call, you often want to assert after the call completes — not after an arbitrary timeout. `page.waitForResponse()` waits for a response matching a pattern before your assertion. The key detail: set up the promise BEFORE the action that triggers the request.",
          uk: "Коли дія користувача запускає API запит, часто потрібно перевірити результат після завершення цього запиту — а не після довільного таймауту. `page.waitForResponse()` чекає відповідь що відповідає патерну перед перевіркою. Важливий момент: встанови проміс ДО дії що запускає запит.",
        },
      ],
      codeBlocks: [
        {
          id: "wait-response",
          language: "ts",
          code: `test('save button triggers API and shows success', async ({ page }) => {
  await page.goto('/settings/profile')

  // Встановлюємо очікування ДО кліку (інакше запит може завершитися раніше)
  const responsePromise = page.waitForResponse('**/api/profile')

  await page.getByRole('button', { name: 'Зберегти' }).click()

  const response = await responsePromise
  expect(response.status()).toBe(200)
  await expect(page.getByText('Зміни збережено')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "abort-requests",
      title: {
        en: "Block requests",
        uk: "Блокування запитів",
      },
      paragraphs: [
        {
          en: "Blocking requests speeds up tests that don't need images, fonts or analytics. Block what's irrelevant and the page loads faster — especially useful on slow CI machines.",
          uk: "Блокування запитів прискорює тести яким не потрібні зображення, шрифти або аналітика. Блокуй те що не стосується тесту — сторінка завантажиться швидше, особливо помітно на повільних CI машинах.",
        },
      ],
      codeBlocks: [
        {
          id: "abort",
          language: "ts",
          code: `// Блокуємо всі зображення для тестів що перевіряють текст
test.beforeEach(async ({ page }) => {
  await page.route(/\\.(png|jpg|jpeg|gif|webp|svg)$/, route => route.abort())
})

// Або блокуємо за типом ресурсу
test('page works without stylesheets', async ({ page }) => {
  await page.route('**/*', route => {
    if (route.request().resourceType() === 'stylesheet') {
      return route.abort()
    }
    return route.continue()
  })

  await page.goto('/orders')
  await expect(page.getByRole('table')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "modify-requests",
      title: {
        en: "Modify requests and responses",
        uk: "Модифікація запитів і відповідей",
      },
      paragraphs: [
        {
          en: "Sometimes you need to add a header, change the method, or tweak the response body without replacing it entirely. `route.continue()` forwards the request with modifications. `route.fetch()` + `route.fulfill()` lets you get the real response and modify it before the browser sees it.",
          uk: "Іноді треба додати заголовок, змінити метод або трохи підправити тіло відповіді без повної заміни. `route.continue()` пересилає запит з модифікаціями. `route.fetch()` + `route.fulfill()` дозволяє отримати реальну відповідь і змінити її до того як браузер її побачить.",
        },
      ],
      codeBlocks: [
        {
          id: "modify",
          language: "ts",
          code: `// Додаємо заголовок авторизації до всіх запитів
await page.route('**/api/**', async route => {
  await route.continue({
    headers: {
      ...route.request().headers(),
      'X-Test-Auth': 'internal-token',
    },
  })
})

// Отримуємо реальну відповідь і підправляємо JSON
await page.route('**/api/orders', async route => {
  const response = await route.fetch()
  const json = await response.json()

  // Додаємо тестовий запис на початок списку
  json.orders.unshift({ id: 'TEST-001', status: 'pending' })

  await route.fulfill({ response, json })
})`,
        },
      ],
    },
    {
      id: "network-events",
      title: {
        en: "Listen to network events",
        uk: "Підписка на мережеві події",
      },
      paragraphs: [
        {
          en: "If you need to log or inspect requests without intercepting them, subscribe to `page.on('request')` and `page.on('response')`. This doesn't affect the requests — they proceed normally. Useful for debugging or building assertions based on what the page fetches.",
          uk: "Якщо треба логувати або інспектувати запити без перехоплення — підпишись на `page.on('request')` і `page.on('response')`. Це не впливає на запити — вони проходять нормально. Корисно для дебагу або побудови перевірок на основі того що сторінка завантажує.",
        },
      ],
      codeBlocks: [
        {
          id: "events",
          language: "ts",
          code: `test('track API calls during page load', async ({ page }) => {
  const apiCalls: string[] = []

  page.on('request', req => {
    if (req.url().includes('/api/')) {
      apiCalls.push(\`\${req.method()} \${req.url()}\`)
    }
  })

  page.on('response', res => {
    if (!res.ok() && res.url().includes('/api/')) {
      console.warn('Failed API call:', res.status(), res.url())
    }
  })

  await page.goto('/dashboard')
  console.log('API calls made:', apiCalls)
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want to test how your app handles a 500 error from /api/orders. What do you use?",
        uk: "Ти хочеш перевірити як застосунок поводиться при 500 помилці від /api/orders. Що використовуєш?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.on('response', ...) to listen for the error",
            uk: "page.on('response', ...) щоб слухати помилку",
          },
        },
        {
          id: "b",
          label: {
            en: "page.route('**/api/orders', route => route.fulfill({ status: 500 }))",
            uk: "page.route('**/api/orders', route => route.fulfill({ status: 500 }))",
          },
        },
        {
          id: "c",
          label: {
            en: "page.waitForResponse('/api/orders')",
            uk: "page.waitForResponse('/api/orders')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.route()` with `route.fulfill()` lets you intercept the request and return a custom response — including error status codes. `on('response')` only listens, `waitForResponse` only waits.",
        uk: "`page.route()` з `route.fulfill()` дозволяє перехопити запит і повернути довільну відповідь — включно з кодами помилок. `on('response')` лише слухає, `waitForResponse` лише чекає.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Why should you set up page.waitForResponse() BEFORE the click that triggers the request?",
        uk: "Чому треба встановлювати page.waitForResponse() ДО кліку що запускає запит?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It doesn't matter — Playwright queues all responses",
            uk: "Не має значення — Playwright ставить всі відповіді в чергу",
          },
        },
        {
          id: "b",
          label: {
            en: "The response might arrive before waitForResponse() is called, causing a race",
            uk: "Відповідь може прийти до того як waitForResponse() буде встановлено — виникне гонка",
          },
        },
        {
          id: "c",
          label: {
            en: "page.waitForResponse() requires the request URL to be registered first",
            uk: "page.waitForResponse() вимагає попередньої реєстрації URL запиту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "If the response arrives before your `await waitForResponse()` call, Playwright misses it and the test hangs or times out. Set up the promise first, then trigger the action.",
        uk: "Якщо відповідь прийде до твого `await waitForResponse()` — Playwright її пропустить і тест зависне або впаде по таймауту. Спочатку встанови проміс, потім запускай дію.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Which method do you call inside a route handler to prevent a request from ever reaching the server?",
        uk: "Який метод викликати всередині route-обробника щоб запит ніколи не досяг сервера?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "route.continue()",
            uk: "route.continue()",
          },
        },
        {
          id: "b",
          label: {
            en: "route.fulfill({ status: 0 })",
            uk: "route.fulfill({ status: 0 })",
          },
        },
        {
          id: "c",
          label: {
            en: "route.abort()",
            uk: "route.abort()",
          },
        },
        {
          id: "d",
          label: {
            en: "route.stop()",
            uk: "route.stop()",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`route.abort()` cancels the request entirely — the browser receives a network error and the server is never contacted. This is used to block images, analytics, or any request that would slow down the test or introduce external dependencies.",
        uk: "`route.abort()` скасовує запит повністю — браузер отримує мережеву помилку, а сервер ніколи не звертається. Це використовується для блокування зображень, аналітики або будь-якого запиту що сповільнює тест або вносить зовнішні залежності.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You want to intercept /api/orders, get the real server response, add a field to the first item, and return the modified data to the page. Which combination achieves this?",
        uk: "Хочеш перехопити /api/orders, отримати реальну відповідь сервера, додати поле до першого елемента і повернути змінені дані сторінці. Яка комбінація це досягає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "route.continue() with modified headers only",
            uk: "route.continue() лише зі зміненими заголовками",
          },
        },
        {
          id: "b",
          label: {
            en: "route.fetch() to get the real response, then route.fulfill({ response, json: modified }) to send the patched version",
            uk: "route.fetch() щоб отримати реальну відповідь, потім route.fulfill({ response, json: modified }) щоб надіслати виправлену версію",
          },
        },
        {
          id: "c",
          label: {
            en: "page.waitForResponse() then mutate the response object in place",
            uk: "page.waitForResponse() потім змінити об'єкт відповіді напряму",
          },
        },
        {
          id: "d",
          label: {
            en: "route.fulfill({ json: {} }) to replace everything with empty data",
            uk: "route.fulfill({ json: {} }) щоб замінити все порожніми даними",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`route.fetch()` makes the real HTTP request and returns the response. You can then call `response.json()` to parse it, mutate the JavaScript object, and call `route.fulfill({ response, json: modified })`. Passing the original `response` object preserves status code, headers, and cookies — only the body is replaced.",
        uk: "`route.fetch()` виконує реальний HTTP-запит і повертає відповідь. Потім можна викликати `response.json()` для парсингу, змінити JavaScript-об'єкт і викликати `route.fulfill({ response, json: modified })`. Передача оригінального об'єкта `response` зберігає код статусу, заголовки і cookies — замінюється лише тіло.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You want to add an Authorization header to every request that goes to /api/**. Which approach is correct?",
        uk: "Хочеш додати заголовок Authorization до кожного запиту що йде на /api/**. Який підхід правильний?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.on('request', req => req.headers()['Authorization'] = 'token')",
            uk: "page.on('request', req => req.headers()['Authorization'] = 'token')",
          },
        },
        {
          id: "b",
          label: {
            en: "page.route('**/api/**', async route => route.continue({ headers: { ...route.request().headers(), 'Authorization': 'token' } }))",
            uk: "page.route('**/api/**', async route => route.continue({ headers: { ...route.request().headers(), 'Authorization': 'token' } }))",
          },
        },
        {
          id: "c",
          label: {
            en: "page.waitForRequest('**/api/**').then(req => req.setHeader('Authorization', 'token'))",
            uk: "page.waitForRequest('**/api/**').then(req => req.setHeader('Authorization', 'token'))",
          },
        },
        {
          id: "d",
          label: {
            en: "page.setExtraHTTPHeaders({ Authorization: 'token' }) applies to route handlers automatically",
            uk: "page.setExtraHTTPHeaders({ Authorization: 'token' }) застосовується до route-обробників автоматично",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`route.continue()` forwards the request to the server with optional modifications — you can override headers, method, URL, and body. Spreading `route.request().headers()` first preserves all existing headers, then you add your new one. `page.on('request')` is read-only and cannot modify requests in flight.",
        uk: "`route.continue()` пересилає запит до сервера з необов'язковими модифікаціями — можна перевизначити заголовки, метод, URL і тіло. Розпакування `route.request().headers()` спочатку зберігає всі існуючі заголовки, потім додається новий. `page.on('request')` лише для читання і не може змінювати запити в польоті.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What does page.on('request') do compared to page.route()?",
        uk: "Що робить page.on('request') порівняно з page.route()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.on('request') intercepts and can block the request; page.route() only observes it",
            uk: "page.on('request') перехоплює і може заблокувати запит; page.route() лише спостерігає",
          },
        },
        {
          id: "b",
          label: {
            en: "page.on('request') observes requests without affecting them; page.route() intercepts and lets you fulfill, abort, or continue",
            uk: "page.on('request') спостерігає запити без впливу на них; page.route() перехоплює і дозволяє виконати, скасувати або продовжити",
          },
        },
        {
          id: "c",
          label: {
            en: "They are identical — both intercept and modify requests",
            uk: "Вони однакові — обидва перехоплюють і змінюють запити",
          },
        },
        {
          id: "d",
          label: {
            en: "page.on('request') only works for XHR; page.route() works for all resource types",
            uk: "page.on('request') працює лише для XHR; page.route() — для всіх типів ресурсів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.on('request')` is a passive listener — it fires for every request but the request still proceeds normally. You can log URLs, collect data, or build debugging tools with it. `page.route()` actively intercepts the request and holds it until you call `route.fulfill()`, `route.abort()`, or `route.continue()` — giving you full control over what the browser sees.",
        uk: "`page.on('request')` — пасивний слухач: він спрацьовує для кожного запиту але запит продовжується нормально. Можна логувати URL, збирати дані або будувати інструменти дебагу. `page.route()` активно перехоплює запит і утримує його поки ти не викличеш `route.fulfill()`, `route.abort()` або `route.continue()` — надаючи повний контроль над тим що бачить браузер.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to record all network traffic during a complex checkout flow and replay it in CI without a real backend. Which Playwright feature supports this?",
        uk: "Хочеш записати весь мережевий трафік під час складного checkout flow і відтворити його в CI без реального бекенду. Яка функція Playwright підтримує це?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.on('response') with fs.writeFileSync() to save each response",
            uk: "page.on('response') з fs.writeFileSync() для збереження кожної відповіді",
          },
        },
        {
          id: "b",
          label: {
            en: "page.route() with route.fulfill() for every possible URL",
            uk: "page.route() з route.fulfill() для кожного можливого URL",
          },
        },
        {
          id: "c",
          label: {
            en: "page.routeFromHAR() — record with update: true, then replay with update: false",
            uk: "page.routeFromHAR() — записати з update: true, потім відтворити з update: false",
          },
        },
        {
          id: "d",
          label: {
            en: "context.setOffline(true) to simulate no network",
            uk: "context.setOffline(true) для симуляції відсутності мережі",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`page.routeFromHAR()` with `update: true` records all matching requests and responses to a HAR file. Once committed, switching to `update: false` replays those responses from the file — the test runs identically in CI without needing the real server. The HAR file is committed to the repository alongside the test.",
        uk: "`page.routeFromHAR()` з `update: true` записує всі відповідні запити і відповіді у HAR-файл. Після комміту перехід на `update: false` відтворює ці відповіді з файлу — тест виконується однаково в CI без потреби в реальному сервері. HAR-файл комітується в репозиторій разом із тестом.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What is the difference between using page.route() and context.route() for request interception?",
        uk: "В чому різниця між використанням page.route() і context.route() для перехоплення запитів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "context.route() is faster because it runs at the network level",
            uk: "context.route() швидший бо виконується на мережевому рівні",
          },
        },
        {
          id: "b",
          label: {
            en: "page.route() applies only to that page; context.route() applies to all pages (tabs) created in the same browser context",
            uk: "page.route() застосовується лише до тієї сторінки; context.route() — до всіх сторінок (вкладок) створених в тому самому browser context",
          },
        },
        {
          id: "c",
          label: {
            en: "context.route() can only block requests; page.route() can fulfill them",
            uk: "context.route() може лише блокувати запити; page.route() може виконувати їх",
          },
        },
        {
          id: "d",
          label: {
            en: "They are identical — context is just an alias for page in this context",
            uk: "Вони однакові — context просто псевдонім для page в цьому контексті",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.route()` intercepts requests from one specific page only. `context.route()` intercepts requests from all pages within the same browser context — including new tabs or popups opened during the test. Use `context.route()` in `beforeEach` or fixtures when you want the mock to cover every page the test might open.",
        uk: "`page.route()` перехоплює запити лише з однієї конкретної сторінки. `context.route()` перехоплює запити з усіх сторінок в тому самому browser context — включаючи нові вкладки або popup-вікна відкриті під час тесту. Використовуй `context.route()` в `beforeEach` або fixtures коли хочеш щоб мок охоплював кожну сторінку яку може відкрити тест.",
      },
    },
  ],
}
