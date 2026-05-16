import type { PlaywrightTopic } from "../../types"

export const mockTopic: PlaywrightTopic = {
  slug: "mock",
  groupId: "guides",
  order: 250,
  level: "intermediate",
  trackOrder: 15,
  sourceDoc: "mock.md",
  officialDocsUrl: "https://playwright.dev/docs/mock",
  title: {
    en: "Mock APIs",
    uk: "Імітація API",
  },
  summary: {
    en: "Three strategies: return fake JSON directly, fetch the real response and patch it, or record the whole session to a HAR file and replay. Each has its place. I use fake JSON for happy-path isolation, patching when I need 90% real data, and HAR when the interaction is too complex to hand-craft.",
    uk: "Три стратегії: повернути фейковий JSON напряму, отримати реальну відповідь і підправити її, або записати всю сесію у HAR-файл і відтворити. Кожна має своє місце. Я використовую фейковий JSON для ізоляції хеппі-пасу, патчинг коли потрібні 90% реальних даних, і HAR коли взаємодія надто складна для ручного написання.",
  },
  sections: [
    {
      id: "mock-api-requests",
      title: {
        en: "Return fake JSON — intercept and fulfill",
        uk: "Повернути фейковий JSON — перехопити і виконати",
      },
      diagram: {
        mermaid: `sequenceDiagram
  participant T as Test
  participant PW as Playwright
  participant S as Server
  T->>PW: page.route('**/api/orders', handler)
  T->>PW: page.goto('/orders')
  Note over PW: request intercepted by route handler
  PW->>PW: route.fulfill({ json: [...] })
  Note over S: server never called
  PW-->>T: page receives fake JSON`,
        caption: {
          en: "route.fulfill() short-circuits the request — the server is never called and the page always gets the exact data you specify",
          uk: "route.fulfill() перехоплює запит до сервера — сервер не викликається, сторінка завжди отримує точно ті дані що ви задали",
        },
      },
      paragraphs: [
        {
          en: "The most common case: intercept a URL pattern and return custom JSON. No real request goes to the server. I use this when I need the test to always see exactly two orders — regardless of what's in the database, regardless of environment.",
          uk: "Найпоширеніший кейс: перехопити URL-патерн і повернути власний JSON. Жодного реального запиту до сервера не відбувається. Я використовую це коли тест повинен завжди бачити рівно два замовлення — незалежно від того що є в базі, незалежно від оточення.",
        },
        {
          en: "Set up `page.route()` BEFORE navigating to the page. The pattern is a glob — `*/**/api/orders` matches any origin.",
          uk: "Встановлюй `page.route()` ДО переходу на сторінку. Патерн — glob: `*/**/api/orders` відповідає будь-якому origin.",
        },
      ],
      codeBlocks: [
        {
          id: "mock-fulfill",
          language: "ts",
          code: `test('orders page shows the mocked list', async ({ page }) => {
  // Перехоплюємо ДО goto — route активний до навігації
  await page.route('*/**/api/orders', async route => {
    await route.fulfill({
      json: [
        { id: 'ORD-001', status: 'pending', item: 'Laptop Stand', qty: 2 },
        { id: 'ORD-002', status: 'shipped', item: 'USB Hub',       qty: 1 },
      ],
    })
  })

  await page.goto('/orders')

  // Дані з мока — стабільні незалежно від бази
  await expect(page.getByText('Laptop Stand')).toBeVisible()
  await expect(page.getByText('USB Hub')).toBeVisible()
  await expect(page.getByRole('row')).toHaveCount(3) // header + 2 rows
})`,
        },
      ],
    },
    {
      id: "modify-api-responses",
      title: {
        en: "Fetch the real response and patch it",
        uk: "Отримати реальну відповідь і підправити її",
      },
      paragraphs: [
        {
          en: "Sometimes I need real data from the server — maybe 20 orders that are already seeded — but I want to force one of them into a specific state. Instead of fully mocking, I fetch the actual response and modify it before sending it to the page.",
          uk: "Іноді мені потрібні реальні дані з сервера — можливо 20 замовлень що вже наповнені — але я хочу примусово перевести одне з них у конкретний стан. Замість повного мокування — отримую реальну відповідь і модифікую її до відправки на сторінку.",
        },
        {
          en: "The key: `route.fetch()` makes the actual request, then you modify `json` and call `route.fulfill({ response, json })`. Passing the original `response` preserves headers, status, and cookies.",
          uk: "Ключове: `route.fetch()` виконує реальний запит, потім ти модифікуєш `json` і викликаєш `route.fulfill({ response, json })`. Передача оригінального `response` зберігає заголовки, статус і cookies.",
        },
      ],
      codeBlocks: [
        {
          id: "modify-response",
          language: "ts",
          code: `test('overdue order shows warning badge', async ({ page }) => {
  await page.route('*/**/api/orders', async route => {
    // Виконуємо реальний запит
    const response = await route.fetch()
    const orders = await response.json()

    // Модифікуємо перше замовлення — додаємо поле
    orders[0].overdue = true
    orders[0].dueDaysAgo = 5

    // Повертаємо оригінальну відповідь + патч
    await route.fulfill({ response, json: orders })
  })

  await page.goto('/orders')

  // Badge з'являється тільки для overdue замовлень
  await expect(page.getByTestId('overdue-badge')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "mocking-with-har-files",
      title: {
        en: "HAR files — record once, replay forever",
        uk: "HAR-файли — записати раз, відтворювати завжди",
      },
      paragraphs: [
        {
          en: "A HAR file captures every network request the page made: URL, method, headers, request body, response status, response body. Record the whole checkout flow once against a real backend, commit the HAR file, replay it in CI without touching the server.",
          uk: "HAR-файл захоплює кожен мережевий запит сторінки: URL, метод, заголовки, тіло запиту, статус відповіді, тіло відповіді. Записуєш весь checkout flow один раз проти реального бекенду, комітиш HAR-файл, відтворюєш у CI без звернення до сервера.",
        },
        {
          en: "**Step 1 — record**: run with `update: true`. Playwright makes real requests and saves them to the HAR file. **Step 2 — commit** the `.har` file. **Step 3 — replay**: switch to `update: false`. All requests are served from the file.",
          uk: "**Крок 1 — запис**: запустити з `update: true`. Playwright робить реальні запити і зберігає їх у HAR-файл. **Крок 2 — закомітити** `.har` файл. **Крок 3 — відтворення**: перейти на `update: false`. Всі запити обслуговуються з файлу.",
        },
        {
          en: "HAR replay matches URL and HTTP method strictly. For POST requests it also matches the payload. If multiple recorded entries match, the one with the most matching headers wins.",
          uk: "Відтворення HAR строго зіставляє URL і HTTP-метод. Для POST-запитів також зіставляється payload. Якщо кілька записів відповідають — перемагає той у якого більше збігів заголовків.",
        },
      ],
      codeBlocks: [
        {
          id: "har-record",
          language: "ts",
          code: `// Крок 1: запускаємо з update: true — записує реальний трафік
test('checkout flow (record mode)', async ({ page }) => {
  await page.routeFromHAR('./hars/checkout.har', {
    url: '*/**/api/**',
    update: true, // записує реальні відповіді у файл
  })

  await page.goto('/checkout')
  await page.getByLabel('Card number').fill('4242424242424242')
  await page.getByRole('button', { name: 'Pay' }).click()
  await page.waitForURL('/orders/*/confirmation')
})`,
        },
        {
          id: "har-replay",
          language: "ts",
          code: `// Крок 3: update: false — відтворює з HAR без реального сервера
test('checkout flow (replay mode)', async ({ page }) => {
  await page.routeFromHAR('./hars/checkout.har', {
    url: '*/**/api/**',
    update: false, // обслуговує з файлу, не йде до сервера
  })

  await page.goto('/checkout')
  await page.getByLabel('Card number').fill('4242424242424242')
  await page.getByRole('button', { name: 'Pay' }).click()
  await page.waitForURL('/orders/*/confirmation')

  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "mock-websockets",
      title: {
        en: "Mock WebSockets",
        uk: "Імітація WebSocket",
      },
      paragraphs: [
        {
          en: "The orders dashboard uses WebSocket for real-time status updates. In tests I don't want to depend on a real WebSocket server — I mock the connection and send controlled messages.",
          uk: "Dashboard замовлень використовує WebSocket для оновлень статусу в реальному часі. У тестах я не хочу залежати від реального WebSocket-сервера — мокую з'єднання і надсилаю контрольовані повідомлення.",
        },
        {
          en: "Two modes: fully mock the connection (no real server), or proxy to the real server and intercept specific messages. The proxy approach lets you test edge cases without breaking the full integration.",
          uk: "Два режими: повністю замокати з'єднання (без реального сервера), або проксіювати до реального сервера і перехоплювати конкретні повідомлення. Підхід з проксі дозволяє тестувати edge-кейси без поломки повної інтеграції.",
        },
      ],
      codeBlocks: [
        {
          id: "ws-mock",
          language: "ts",
          code: `// Повне мокування — без реального WS сервера
test('status update appears when WS message arrives', async ({ page }) => {
  await page.routeWebSocket('wss://app.example.com/ws', ws => {
    ws.onMessage(message => {
      // Можна реагувати на конкретні повідомлення
      if (message === 'subscribe:orders') {
        ws.send(JSON.stringify({
          type: 'order_update',
          orderId: 'ORD-001',
          status: 'shipped',
        }))
      }
    })
  })

  await page.goto('/dashboard')
  await expect(page.getByTestId('order-ORD-001-status')).toHaveText('Shipped')
})`,
        },
        {
          id: "ws-proxy",
          language: "ts",
          code: `// Проксі до реального сервера + перехоплення конкретних повідомлень
test('error state when server sends error frame', async ({ page }) => {
  await page.routeWebSocket('wss://app.example.com/ws', ws => {
    const server = ws.connectToServer()

    ws.onMessage(message => {
      // Підміняємо конкретне повідомлення, решту — пропускаємо
      if (message === 'get:dashboard') {
        server.send(JSON.stringify({ type: 'error', code: 'RATE_LIMITED' }))
      } else {
        server.send(message)
      }
    })
  })

  await page.goto('/dashboard')
  await expect(page.getByTestId('error-banner')).toContainText('Rate limited')
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want a test to always see exactly 3 orders regardless of the database state. Which approach is cleanest?",
        uk: "Хочеш щоб тест завжди бачив рівно 3 замовлення незалежно від стану бази. Який підхід найчистіший?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.route() with route.fulfill({ json: [...] }) — intercept and return your own JSON",
            uk: "page.route() з route.fulfill({ json: [...] }) — перехопити і повернути власний JSON",
          },
        },
        {
          id: "b",
          label: {
            en: "Record a HAR file with update: true, then replay with update: false",
            uk: "Записати HAR-файл з update: true, потім відтворити з update: false",
          },
        },
        {
          id: "c",
          label: {
            en: "route.fetch() the real response and filter it to 3 items",
            uk: "route.fetch() реальну відповідь і відфільтрувати до 3 елементів",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`route.fulfill({ json })` is the cleanest for controlled isolation — you specify exactly what the page sees. HAR is better for complex multi-request flows. `route.fetch()` still hits the real API which introduces external dependencies.",
        uk: "`route.fulfill({ json })` — найчистіший для контрольованої ізоляції: ти точно вказуєш що бачить сторінка. HAR краще підходить для складних потоків з кількома запитами. `route.fetch()` все одно звертається до реального API що вносить зовнішні залежності.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "When is a HAR file better than writing inline route handlers?",
        uk: "Коли HAR-файл кращий за написання inline route-обробників?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Always — HAR is the recommended approach for all mocking",
            uk: "Завжди — HAR є рекомендованим підходом для всього мокування",
          },
        },
        {
          id: "b",
          label: {
            en: "When the flow involves many requests with complex payloads that are too tedious to hand-craft",
            uk: "Коли flow включає багато запитів зі складними payload-даними які занадто важко писати вручну",
          },
        },
        {
          id: "c",
          label: {
            en: "Only when the API returns binary data like images",
            uk: "Тільки коли API повертає бінарні дані як зображення",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "HAR shines when you have a complex multi-step flow — login, add to cart, checkout, confirmation — where hand-crafting each request/response would be brittle. For simple cases (one endpoint, predictable JSON), an inline `route.fulfill()` is cleaner and easier to understand.",
        uk: "HAR відмінно підходить коли є складний багатокроковий flow — логін, додавання в кошик, checkout, підтвердження — де ручне написання кожного запиту/відповіді було б ненадійним. Для простих випадків (один ендпоїнт, передбачуваний JSON) — inline `route.fulfill()` чистіший і зрозуміліший.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the difference between route.fulfill() and route.abort() in a page.route() handler?",
        uk: "В чому різниця між route.fulfill() і route.abort() в обробнику page.route()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "route.fulfill() returns a response to the browser; route.abort() cancels the request so the browser gets a network error",
            uk: "route.fulfill() повертає відповідь браузеру; route.abort() скасовує запит тому браузер отримує мережеву помилку",
          },
        },
        {
          id: "b",
          label: {
            en: "route.abort() returns a 404; route.fulfill() returns a 500",
            uk: "route.abort() повертає 404; route.fulfill() повертає 500",
          },
        },
        {
          id: "c",
          label: {
            en: "They are identical — both prevent the request from reaching the server",
            uk: "Вони однакові — обидва запобігають досягненню сервера запитом",
          },
        },
        {
          id: "d",
          label: {
            en: "route.fulfill() only works with JSON; route.abort() works with any content type",
            uk: "route.fulfill() працює лише з JSON; route.abort() — з будь-яким типом вмісту",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`route.fulfill()` sends a synthetic HTTP response back to the browser — you control the status code, headers, and body. `route.abort()` cancels the request at the network level, causing a fetch error or network error in the browser (similar to being offline). Use `fulfill` to mock successful or error HTTP responses; use `abort` to simulate connectivity failures.",
        uk: "`route.fulfill()` надсилає синтетичну HTTP-відповідь браузеру — ти контролюєш код статусу, заголовки і тіло. `route.abort()` скасовує запит на мережевому рівні, спричиняючи помилку fetch або мережеву помилку в браузері (схоже на відсутність з'єднання). Використовуй `fulfill` для імітації успішних або HTTP-відповідей з помилками; `abort` — для симуляції збоїв підключення.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You have a route handler set up for '*/**/api/orders'. A request to '/api/users' is made. What happens to that request?",
        uk: "У тебе налаштований route-обробник для '*/**/api/orders'. Робиться запит до '/api/users'. Що відбувається з цим запитом?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It is blocked by default — all unmatched routes are aborted",
            uk: "Він блокується за замовчуванням — всі невідповідні маршрути скасовуються",
          },
        },
        {
          id: "b",
          label: {
            en: "It proceeds to the real server normally — unmatched requests are not intercepted",
            uk: "Він проходить до реального сервера нормально — неспівпадаючі запити не перехоплюються",
          },
        },
        {
          id: "c",
          label: {
            en: "It throws an error because no handler is registered for that URL",
            uk: "Кидається помилка бо для цього URL не зареєстрований обробник",
          },
        },
        {
          id: "d",
          label: {
            en: "It matches the handler because '**' is a wildcard that covers all paths",
            uk: "Він відповідає обробнику бо '**' є символом підстановки що охоплює всі шляхи",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Route handlers only intercept requests whose URL matches the registered pattern. `*/**/api/orders` matches any URL ending with `/api/orders`. A request to `/api/users` does not match that pattern and flows through to the real server without any interception. Only explicitly matched routes are handled.",
        uk: "Route-обробники перехоплюють лише запити URL яких відповідає зареєстрованому патерну. `*/**/api/orders` відповідає будь-якому URL що закінчується на `/api/orders`. Запит до `/api/users` не відповідає цьому патерну і проходить до реального сервера без будь-якого перехоплення. Обробляються лише явно відповідні маршрути.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you write a glob pattern in page.route() to match any URL containing '/api/orders' regardless of origin?",
        uk: "Як написати glob-патерн в page.route() щоб відповідати будь-якому URL що містить '/api/orders' незалежно від origin?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "'/api/orders'",
            uk: "'/api/orders'",
          },
        },
        {
          id: "b",
          label: {
            en: "'**/api/orders' or '*/**/api/orders'",
            uk: "'**/api/orders' або '*/**/api/orders'",
          },
        },
        {
          id: "c",
          label: {
            en: "'^/api/orders$' — use regex syntax in glob patterns",
            uk: "'^/api/orders$' — використовувати regex-синтаксис в glob-патернах",
          },
        },
        {
          id: "d",
          label: {
            en: "'http://*/api/orders'",
            uk: "'http://*/api/orders'",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "In Playwright glob patterns `**` matches any number of path segments including the protocol and host. `'**/api/orders'` matches `https://example.com/api/orders`, `http://localhost:3000/api/orders`, and any other origin. `'/api/orders'` would only match that exact string. You can also pass a RegExp directly to `page.route()` for more complex matching.",
        uk: "У glob-патернах Playwright `**` відповідає будь-якій кількості сегментів шляху включаючи протокол і хост. `'**/api/orders'` відповідає `https://example.com/api/orders`, `http://localhost:3000/api/orders` та будь-якому іншому origin. `'/api/orders'` відповідав би лише цьому точному рядку. Також можна передати RegExp напряму в `page.route()` для складнішого зіставлення.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You set up a route mock in a test but want to remove it partway through so subsequent requests go to the real server. What do you call?",
        uk: "Ти налаштував route-мок в тесті але хочеш видалити його в середині щоб подальші запити йшли до реального сервера. Що викликати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.route() with the same pattern again to overwrite it",
            uk: "page.route() з тим самим патерном знову щоб перезаписати його",
          },
        },
        {
          id: "b",
          label: {
            en: "page.unroute(pattern) to remove the handler for that pattern",
            uk: "page.unroute(pattern) щоб видалити обробник для цього патерну",
          },
        },
        {
          id: "c",
          label: {
            en: "route.continue() inside the handler to pass all requests through",
            uk: "route.continue() всередині обробника щоб пропускати всі запити",
          },
        },
        {
          id: "d",
          label: {
            en: "page.reload() clears all route handlers automatically",
            uk: "page.reload() автоматично очищує всі route-обробники",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.unroute(pattern)` removes the route handler registered for that pattern. After calling it, requests matching the pattern flow to the real server. You can optionally pass the specific handler function as the second argument to `page.unroute()` if multiple handlers were registered for the same pattern.",
        uk: "`page.unroute(pattern)` видаляє route-обробник зареєстрований для цього патерну. Після виклику запити що відповідають патерну йдуть до реального сервера. Можна додатково передати конкретну функцію-обробник другим аргументом до `page.unroute()` якщо для одного патерну було зареєстровано кілька обробників.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to mock an API endpoint using data from a local JSON file. What is the correct approach?",
        uk: "Хочеш замокати API-ендпоінт використовуючи дані з локального JSON-файлу. Який правильний підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.route('**/api/orders', route => route.fulfill({ path: './fixtures/orders.json' }))",
            uk: "page.route('**/api/orders', route => route.fulfill({ path: './fixtures/orders.json' }))",
          },
        },
        {
          id: "b",
          label: {
            en: "You cannot use local files — route.fulfill() only accepts inline JSON objects",
            uk: "Неможливо використовувати локальні файли — route.fulfill() приймає лише вбудовані JSON-об'єкти",
          },
        },
        {
          id: "c",
          label: {
            en: "page.route('**/api/orders', route => route.fulfill({ url: 'file://fixtures/orders.json' }))",
            uk: "page.route('**/api/orders', route => route.fulfill({ url: 'file://fixtures/orders.json' }))",
          },
        },
        {
          id: "d",
          label: {
            en: "import data from './fixtures/orders.json' then route.fulfill({ body: JSON.stringify(data) })",
            uk: "import data from './fixtures/orders.json' потім route.fulfill({ body: JSON.stringify(data) })",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`route.fulfill()` accepts a `path` option that reads a file from disk and uses it as the response body, automatically setting the content type based on the file extension. For JSON files, it sets `application/json`. This is the cleanest way to use fixture files — no manual `fs.readFileSync` needed.",
        uk: "`route.fulfill()` приймає опцію `path` що читає файл з диска і використовує його як тіло відповіді, автоматично встановлюючи тип вмісту на основі розширення файлу. Для JSON-файлів встановлюється `application/json`. Це найчистіший спосіб використовувати fixture-файли — ручний `fs.readFileSync` не потрібен.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "When using route.fetch() to get the real response and then route.fulfill({ response, json }), why do you pass the original response object?",
        uk: "При використанні route.fetch() для отримання реальної відповіді і потім route.fulfill({ response, json }), чому ти передаєш оригінальний об'єкт response?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It is required — route.fulfill() throws without a response object",
            uk: "Це обов'язково — route.fulfill() кидає помилку без об'єкта response",
          },
        },
        {
          id: "b",
          label: {
            en: "Passing the original response preserves its status code, headers, and cookies — only the body is replaced by json",
            uk: "Передача оригінального response зберігає його код статусу, заголовки і cookies — лише тіло замінюється значенням json",
          },
        },
        {
          id: "c",
          label: {
            en: "It is for logging purposes only — Playwright ignores the response object",
            uk: "Це лише для логування — Playwright ігнорує об'єкт response",
          },
        },
        {
          id: "d",
          label: {
            en: "It tells Playwright to replay the request if it fails",
            uk: "Це повідомляє Playwright повторити запит якщо він не вдасться",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When you call `route.fulfill({ response, json })`, Playwright uses the original response's status code, headers (including cookies and CORS headers) as the base and only replaces the body with your modified JSON. Without passing `response`, you would need to manually replicate all headers and the status code — which is error-prone and brittle.",
        uk: "Коли викликаєш `route.fulfill({ response, json })`, Playwright використовує код статусу, заголовки (включаючи cookies і CORS-заголовки) оригінального response як основу і замінює лише тіло твоїм зміненим JSON. Без передачі `response` потрібно було б вручну реплікувати всі заголовки і код статусу — що схильно до помилок і ненадійно.",
      },
    },
  ],
}
