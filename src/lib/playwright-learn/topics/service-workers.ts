import type { PlaywrightTopic } from "../types"

export const serviceWorkersTopic: PlaywrightTopic = {
  slug: "service-workers",
  groupId: "guides",
  order: 268,
  level: "advanced",
  trackOrder: 21,
  sourceDoc: "service-workers-js-python.md",
  officialDocsUrl: "https://playwright.dev/docs/service-workers",
  title: {
    en: "Service Workers",
    uk: "Сервісні воркери",
  },
  summary: {
    en: "How Playwright handles service workers, how to disable them for predictable tests, and how to inspect service-worker-owned network traffic.",
    uk: "Як Playwright працює з service workers, як вимикати їх для передбачуваних тестів і як перевіряти мережеві запити, що належать service worker.",
  },
  sections: [
    {
      id: "when-it-matters",
      title: {
        en: "When it matters",
        uk: "Коли це важливо",
      },
      paragraphs: [
        {
          en: "Service workers can cache assets, proxy fetch requests, and provide offline behavior. Most ordinary end-to-end tests should not need to test the worker directly, but PWA, offline, caching, and network-routing scenarios often do.",
          uk: "Service workers можуть кешувати ресурси, проксувати fetch-запити й забезпечувати offline-поведінку. Звичайні end-to-end тести часто не мають тестувати worker напряму, але для PWA, offline-режимів, кешування й network-routing сценаріїв це буває важливо.",
        },
        {
          en: "If you only need regular network mocking, start with Playwright routing APIs such as `page.route()` or `browserContext.route()` first.",
          uk: "Якщо потрібно лише звичайне мокання мережі, спочатку використовуйте routing API Playwright: `page.route()` або `browserContext.route()`.",
        },
      ],
    },
    {
      id: "disable-service-workers",
      title: {
        en: "Disable service workers",
        uk: "Вимкнення service workers",
      },
      paragraphs: [
        {
          en: "For many test suites, disabling service workers makes network behavior more predictable. Configure this in `use` when the app does not need the worker behavior for the scenario.",
          uk: "У багатьох тестових наборах вимкнення service workers робить мережеву поведінку передбачуванішою. Налаштовуйте це в `use`, якщо сценарію не потрібна поведінка worker.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "ts",
          code: "import { defineConfig } from '@playwright/test';\n\nexport default defineConfig({\n  use: {\n    serviceWorkers: 'block',\n  },\n});",
        },
      ],
    },
    {
      id: "wait-for-service-worker",
      title: {
        en: "Wait for activation",
        uk: "Очікування активації",
      },
      paragraphs: [
        {
          en: "Use the browser context to wait for the `serviceworker` event when a page registers a worker. Before evaluating inside the worker, wait until it controls the page.",
          uk: "Використовуйте browser context, щоб дочекатися події `serviceworker`, коли сторінка реєструє worker. Перед виконанням коду всередині worker дочекайтеся, поки він почне контролювати сторінку.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "ts",
          code: "const serviceWorkerPromise = context.waitForEvent('serviceworker');\nawait page.goto('/example-with-a-service-worker.html');\nconst serviceWorker = await serviceWorkerPromise;\n\nawait page.evaluate(async () => {\n  const registration = await navigator.serviceWorker.getRegistration();\n  if (registration?.active?.state === 'activated') return;\n\n  await new Promise<void>((resolve) => {\n    navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), {\n      once: true,\n    });\n  });\n});\n\nawait serviceWorker.evaluate(() => self.location.href);",
        },
      ],
    },
    {
      id: "network-events",
      title: {
        en: "Network events",
        uk: "Мережеві події",
      },
      paragraphs: [
        {
          en: "Requests made by a service worker are reported on `browserContext`. For service-worker-owned requests, `request.serviceWorker()` is set and `request.frame()` throws.",
          uk: "Запити, зроблені service worker, видно на рівні `browserContext`. Для запитів, що належать service worker, `request.serviceWorker()` встановлений, а `request.frame()` кидає помилку.",
        },
        {
          en: "This lets you route only service-worker traffic and leave regular page traffic untouched.",
          uk: "Так можна обробляти лише трафік service worker і не чіпати звичайні запити сторінки.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "ts",
          code: "await context.route('**', async (route) => {\n  const request = route.request();\n\n  if (request.serviceWorker()) {\n    await route.fulfill({\n      contentType: 'text/plain',\n      status: 200,\n      body: 'from service worker route',\n    });\n    return;\n  }\n\n  await route.continue();\n});",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "When should you reach for service worker testing APIs instead of `page.route()`?",
        uk: "Коли варто використовувати API тестування service worker замість `page.route()`?",
      },
      options: [
        { id: "a", label: { en: "For every network mock — service worker APIs are more powerful.", uk: "Для будь-якого мокання мережі — API service worker потужніші." } },
        { id: "b", label: { en: "Only when the service worker itself is the subject of the test: PWA offline behavior, caching strategies, or worker-owned network routing.", uk: "Лише коли сам service worker є предметом тесту: PWA offline-поведінка, стратегії кешування або мережевий роутинг воркера." } },
        { id: "c", label: { en: "Whenever you need to intercept HTTPS requests.", uk: "Щоразу, коли потрібно перехоплювати HTTPS-запити." } },
        { id: "d", label: { en: "Only in CI environments where a real server is unavailable.", uk: "Лише у CI-оточеннях, де реальний сервер недоступний." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.route()` and `context.route()` handle most network mocking needs without service worker complexity. Reach for service worker APIs only when the test scenario specifically involves PWA offline mode, service-worker caching strategies, or intercepting worker-originated requests.",
        uk: "`page.route()` і `context.route()` задовольняють більшість потреб у моканні мережі без складності service worker. До API service worker варто звертатися лише коли сценарій тесту безпосередньо стосується PWA offline-режиму, стратегій кешування SW або перехоплення запитів, що надходять від воркера.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "How do you disable service workers for all tests in a project?",
        uk: "Як вимкнути service workers для всіх тестів у проєкті?",
      },
      options: [
        { id: "a", label: { en: "Set `serviceWorkers: 'block'` in the `use` section of `playwright.config.ts`.", uk: "Встановити `serviceWorkers: 'block'` у секції `use` файлу `playwright.config.ts`." } },
        { id: "b", label: { en: "Pass `--disable-service-workers` to the CLI.", uk: "Передати `--disable-service-workers` до CLI." } },
        { id: "c", label: { en: "Call `context.blockServiceWorkers()` before each test.", uk: "Викликати `context.blockServiceWorkers()` перед кожним тестом." } },
        { id: "d", label: { en: "Set `ignoreServiceWorkers: true` in the browser launch options.", uk: "Встановити `ignoreServiceWorkers: true` у launch options браузера." } },
      ],
      correctOptionId: "a",
      rationale: {
        en: "The `serviceWorkers` option in the `use` block of `playwright.config.ts` accepts `'block'` to prevent any service worker from registering. This makes network behavior more predictable when the tested scenario does not require service worker functionality.",
        uk: "Опція `serviceWorkers` у блоці `use` файлу `playwright.config.ts` приймає значення `'block'`, щоб запобігти реєстрації будь-якого service worker. Це робить мережеву поведінку передбачуванішою, коли тестований сценарій не потребує функціональності service worker.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Which event on the browser context fires when a page registers a service worker?",
        uk: "Яка подія на browser context спрацьовує, коли сторінка реєструє service worker?",
      },
      options: [
        { id: "a", label: { en: "`'workerregistered'`", uk: "`'workerregistered'`" } },
        { id: "b", label: { en: "`'worker'`", uk: "`'worker'`" } },
        { id: "c", label: { en: "`'serviceworker'`", uk: "`'serviceworker'`" } },
        { id: "d", label: { en: "`'serviceWorkerActivated'`", uk: "`'serviceWorkerActivated'`" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`context.waitForEvent('serviceworker')` resolves when a service worker is registered. You typically set up the promise before navigating: `const swPromise = context.waitForEvent('serviceworker'); await page.goto('/'); const sw = await swPromise;`",
        uk: "`context.waitForEvent('serviceworker')` резолвиться, коли service worker зареєстровано. Зазвичай обіцянку встановлюють до навігації: `const swPromise = context.waitForEvent('serviceworker'); await page.goto('/'); const sw = await swPromise;`",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "After navigating to a page with a service worker, how do you wait until the worker actually controls the page before running assertions?",
        uk: "Після навігації на сторінку зі service worker, як дочекатися, поки воркер дійсно контролює сторінку перед запуском перевірок?",
      },
      options: [
        { id: "a", label: { en: "Call `serviceWorker.waitUntilActive()` on the worker object.", uk: "Викликати `serviceWorker.waitUntilActive()` на об'єкті воркера." } },
        { id: "b", label: { en: "Listen for the `controllerchange` event on `navigator.serviceWorker` inside `page.evaluate()`.", uk: "Прослухати подію `controllerchange` на `navigator.serviceWorker` всередині `page.evaluate()`." } },
        { id: "c", label: { en: "Wait for `context.waitForEvent('load')`.", uk: "Дочекатися `context.waitForEvent('load')`." } },
        { id: "d", label: { en: "Check `serviceWorker.state === 'activated'` in a polling loop.", uk: "Перевіряти `serviceWorker.state === 'activated'` у циклі з опитуванням." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Inside `page.evaluate()` you check `navigator.serviceWorker.getRegistration()` to see if the active worker's state is already `'activated'`. If not, you attach a `controllerchange` listener that resolves a promise when the worker takes control. This avoids polling and race conditions.",
        uk: "Всередині `page.evaluate()` перевіряєте `navigator.serviceWorker.getRegistration()`, щоб дізнатися чи вже active worker має стан `'activated'`. Якщо ні, прикріплюєте слухача `controllerchange`, що резолвить обіцянку, коли воркер перебирає контроль. Це виключає polling і race conditions.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "Where are service-worker network requests reported in Playwright — on the `page` or on the `browserContext`?",
        uk: "Де репортуються мережеві запити service worker у Playwright — на `page` чи на `browserContext`?",
      },
      options: [
        { id: "a", label: { en: "On the `page` object, the same as all other requests.", uk: "На об'єкті `page`, як і всі інші запити." } },
        { id: "b", label: { en: "On the `browserContext` object.", uk: "На об'єкті `browserContext`." } },
        { id: "c", label: { en: "On a dedicated `ServiceWorker` event emitter.", uk: "На спеціальному `ServiceWorker` event emitter." } },
        { id: "d", label: { en: "They are not reported anywhere — you must intercept them in the worker script.", uk: "Вони ніде не репортуються — потрібно перехоплювати їх у скрипті воркера." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Requests originated by a service worker are visible on the `browserContext`, not on a specific `page`. You attach a `request` listener to `context` and filter using `request.serviceWorker()` to isolate worker-owned requests from page-owned ones.",
        uk: "Запити, що виходять від service worker, видно на рівні `browserContext`, а не окремої `page`. Ви прикріплюєте слухача `request` до `context` і фільтруєте через `request.serviceWorker()`, щоб відокремити запити воркера від запитів сторінки.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What happens when you call `request.frame()` on a request that was made by a service worker?",
        uk: "Що відбувається, коли ви викликаєте `request.frame()` на запиті, зробленому service worker?",
      },
      options: [
        { id: "a", label: { en: "It returns `null`.", uk: "Повертає `null`." } },
        { id: "b", label: { en: "It returns the main frame of the page.", uk: "Повертає головний фрейм сторінки." } },
        { id: "c", label: { en: "It throws an error.", uk: "Кидає помилку." } },
        { id: "d", label: { en: "It returns the service worker as a special frame.", uk: "Повертає service worker як спеціальний фрейм." } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "Service worker requests are not associated with any frame, so `request.frame()` throws. Use `request.serviceWorker()` instead to check whether a request is owned by a worker. This is also how you distinguish worker traffic from page traffic when routing.",
        uk: "Запити service worker не пов'язані з жодним фреймом, тому `request.frame()` кидає помилку. Натомість використовуйте `request.serviceWorker()`, щоб перевірити чи запит належить воркеру. Це також спосіб розрізняти трафік воркера від трафіку сторінки при роутингу.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you route only service-worker-originated requests while letting regular page requests pass through?",
        uk: "Як обробляти лише запити service worker, залишаючи звичайні запити сторінки без змін?",
      },
      options: [
        { id: "a", label: { en: "Use `page.route('**', ...)` and check `request.isServiceWorker()`.", uk: "Використати `page.route('**', ...)` і перевіряти `request.isServiceWorker()`." } },
        { id: "b", label: { en: "Use `context.route('**', ...)`, check `request.serviceWorker()` and `route.fulfill()` for worker requests, `route.continue()` for others.", uk: "Використати `context.route('**', ...)`, перевіряти `request.serviceWorker()` і викликати `route.fulfill()` для запитів воркера, `route.continue()` для решти." } },
        { id: "c", label: { en: "Use `serviceWorker.route('**', ...)` — there is a dedicated routing API on the worker object.", uk: "Використати `serviceWorker.route('**', ...)` — на об'єкті воркера є спеціальний routing API." } },
        { id: "d", label: { en: "Register a fetch event handler inside the service worker script itself.", uk: "Зареєструвати обробник події fetch безпосередньо в скрипті service worker." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "You use `context.route('**', handler)` because SW requests appear at context level. Inside the handler, call `request.serviceWorker()` — if it returns a Worker, call `route.fulfill()` with mock data; otherwise call `route.continue()`. There is no `serviceWorker.route()` method.",
        uk: "Ви використовуєте `context.route('**', handler)`, бо запити SW видно на рівні context. Всередині обробника викликайте `request.serviceWorker()` — якщо він повертає Worker, викличте `route.fulfill()` з mock-даними; інакше — `route.continue()`. Методу `serviceWorker.route()` не існує.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What is the correct way to set up the `serviceworker` event listener to avoid a race condition where the worker registers before the listener is attached?",
        uk: "Як правильно встановити слухача події `serviceworker`, щоб уникнути race condition, коли воркер реєструється до додавання слухача?",
      },
      options: [
        { id: "a", label: { en: "Call `context.on('serviceworker', ...)` after `page.goto()` completes.", uk: "Викликати `context.on('serviceworker', ...)` після завершення `page.goto()`." } },
        { id: "b", label: { en: "Create the promise with `context.waitForEvent('serviceworker')` before calling `page.goto()`, then await the promise after.", uk: "Створити обіцянку з `context.waitForEvent('serviceworker')` до виклику `page.goto()`, потім дочекатися її після." } },
        { id: "c", label: { en: "Use a `beforeAll` hook to register the listener once for the whole suite.", uk: "Використати хук `beforeAll`, щоб зареєструвати слухача один раз для всього suite." } },
        { id: "d", label: { en: "Add a `page.waitForTimeout(1000)` after `page.goto()` to give the worker time to register.", uk: "Додати `page.waitForTimeout(1000)` після `page.goto()`, щоб дати воркеру час зареєструватися." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The classic pattern is: `const swPromise = context.waitForEvent('serviceworker'); await page.goto('/'); const sw = await swPromise;`. Setting up the promise first means you won't miss the event even if the page loads and registers the worker very quickly. Attaching the listener after navigation creates a race condition.",
        uk: "Класичний патерн: `const swPromise = context.waitForEvent('serviceworker'); await page.goto('/'); const sw = await swPromise;`. Встановлення обіцянки першою гарантує, що ви не пропустите подію навіть якщо сторінка завантажується і реєструє воркер дуже швидко. Додавання слухача після навігації створює race condition.",
      },
    },
  ],
}
