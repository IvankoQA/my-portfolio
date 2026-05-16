import type { PlaywrightTopic } from "../../types"

export const evaluatingTopic: PlaywrightTopic = {
  slug: "evaluating",
  groupId: "guides",
  order: 190,
  level: "intermediate",
  trackOrder: 22,
  sourceDoc: "evaluating.md",
  officialDocsUrl: "https://playwright.dev/docs/evaluating",
  title: {
    en: "Evaluating JavaScript",
    uk: "Виконання JavaScript",
  },
  summary: {
    en: "Your test code runs in Node.js. The page runs in the browser. They're separate processes — variables don't cross that boundary automatically. page.evaluate() is the bridge: pass a function, execute it in the browser, get the result back in Node.",
    uk: "Твій тестовий код виконується в Node.js. Сторінка виконується в браузері. Це окремі процеси — змінні не перетинають цей бар'єр автоматично. page.evaluate() — це міст: передаєш функцію, виконуєш у браузері, отримуєш результат назад у Node.",
  },
  sections: [
    {
      id: "two-environments",
      title: {
        en: "Two environments — the most important thing to understand",
        uk: "Два середовища — найважливіше що треба розуміти",
      },
      diagram: {
        mermaid: `flowchart LR
  subgraph N["Node.js — your test"]
    TC["test code\nconst id = 'ORD-42'"]
  end
  subgraph B["Browser — V8 / Blink"]
    PF["page.evaluate(() => {...})\nwindow / document / localStorage"]
  end
  TC -->|"page.evaluate(fn, id)\nexplicit arg passing"| PF
  PF -->|"serialized return value"| TC
  style N fill:#e8f5e9,stroke:#4caf50
  style B fill:#e3f2fd,stroke:#2196f3`,
        caption: {
          en: "Test code runs in Node.js; evaluate() code runs in the browser — pass data explicitly, return serializable values",
          uk: "Код тесту виконується в Node.js; код evaluate() — в браузері; передавайте дані явно, повертайте серіалізовані значення",
        },
      },
      paragraphs: [
        {
          en: "Your test runs in Node.js. The page runs in a browser (V8, Blink). They're separate VMs — JavaScript closures don't cross between them. When you write a function inside `page.evaluate()`, that function runs in the browser. It has access to `window`, `document`, `localStorage` — but NOT to variables from your test unless you pass them explicitly.",
          uk: "Твій тест виконується в Node.js. Сторінка виконується в браузері (V8, Blink). Це окремі VM — JavaScript-замикання не перетинаються між ними. Коли ти пишеш функцію всередині `page.evaluate()` — вона виконується в браузері. Вона має доступ до `window`, `document`, `localStorage`, але НЕ до змінних з твого тесту якщо ти їх явно не передав.",
        },
      ],
      codeBlocks: [
        {
          id: "two-envs",
          language: "ts",
          code: `const orderId = 'ORD-042'

// ❌ НЕПРАВИЛЬНО — orderId недоступна в браузері
const title = await page.evaluate(() => {
  return document.querySelector(\`[data-order="\${orderId}"]\`)?.textContent
  //                                      ^^^^^^^ ReferenceError: orderId is not defined
})

// ✅ ПРАВИЛЬНО — передати явно другим аргументом
const title = await page.evaluate((id) => {
  return document.querySelector(\`[data-order="\${id}"]\`)?.textContent
}, orderId)`,
        },
      ],
    },
    {
      id: "page-evaluate",
      title: {
        en: "page.evaluate() — read browser state",
        uk: "page.evaluate() — читати стан браузера",
      },
      paragraphs: [
        {
          en: "Use `page.evaluate()` when you need to read something from the browser that Playwright's locators can't reach — like `window.__APP_CONFIG__`, `localStorage`, computed styles, or scroll position.",
          uk: "Використовуй `page.evaluate()` коли треба прочитати щось з браузера що локатори Playwright не дістануть — наприклад `window.__APP_CONFIG__`, `localStorage`, обчислені стилі або позицію скролу.",
        },
      ],
      codeBlocks: [
        {
          id: "evaluate-examples",
          language: "ts",
          code: `// Прочитати з window
const appVersion = await page.evaluate(() => window.__APP_CONFIG__.version)
expect(appVersion).toBe('2.4.1')

// Прочитати з localStorage
const token = await page.evaluate(() => localStorage.getItem('auth_token'))
expect(token).not.toBeNull()

// Прочитати URL
const href = await page.evaluate(() => document.location.href)

// Перевірити позицію скролу
const scrollY = await page.evaluate(() => window.scrollY)
expect(scrollY).toBeGreaterThan(0)

// Прочитати computed стиль — те що CSS реально застосував
const color = await page.evaluate(() => {
  const btn = document.querySelector('[data-testid="primary-btn"]')
  return window.getComputedStyle(btn!).backgroundColor
})
expect(color).toBe('rgb(59, 130, 246)')`,
        },
      ],
    },
    {
      id: "evaluate-to-trigger",
      title: {
        en: "page.evaluate() — trigger browser-level actions",
        uk: "page.evaluate() — тригерити дії на рівні браузера",
      },
      paragraphs: [
        {
          en: "Sometimes I need to trigger something that only works from inside the browser — dispatch a custom event, call a global app method, or simulate a scroll. `evaluate` is the right tool.",
          uk: "Іноді потрібно тригернути щось що працює тільки зсередини браузера — відправити кастомну подію, викликати глобальний метод застосунку, або симулювати скрол. `evaluate` — правильний інструмент.",
        },
      ],
      codeBlocks: [
        {
          id: "evaluate-trigger",
          language: "ts",
          code: `// Тригернути кастомну подію (для тестування event listeners)
await page.evaluate(() => {
  window.dispatchEvent(new CustomEvent('order:updated', {
    detail: { orderId: 'ORD-042', status: 'shipped' }
  }))
})

// Скролити до низу сторінки
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

// Викликати глобальний метод застосунку (якщо є)
await page.evaluate(() => window.__APP__.resetState())

// Очистити localStorage перед тестом
await page.evaluate(() => localStorage.clear())`,
        },
      ],
    },
    {
      id: "addInitScript",
      title: {
        en: "page.addInitScript() — inject before any page JS runs",
        uk: "page.addInitScript() — впровадити до будь-якого JS сторінки",
      },
      paragraphs: [
        {
          en: "`page.evaluate()` runs after the page loads. If you need code to run before any page JavaScript — to mock a browser API, replace `Math.random`, or set up a global variable — use `page.addInitScript()`. It runs at navigation time, before the page's own scripts.",
          uk: "`page.evaluate()` виконується після завантаження сторінки. Якщо код потрібен до будь-якого JS сторінки — замокати браузерний API, замінити `Math.random`, або встановити глобальну змінну — використовуй `page.addInitScript()`. Він виконується при навігації, до власних скриптів сторінки.",
        },
      ],
      codeBlocks: [
        {
          id: "addInitScript",
          language: "ts",
          code: `// Зробити Math.random() детермінованим
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.42 // завжди 0.42 — стабільні тести рандомних речей
  })
})

// Передати значення з тесту
const seed = 12345
await page.addInitScript((seedValue) => {
  Math.random = () => (seedValue % 100) / 100
}, seed)

// Для всього контексту — застосовується до кожної нової сторінки
await context.addInitScript(() => {
  window.__TEST_MODE__ = true
})`,
        },
      ],
    },
    {
      id: "async-evaluate",
      title: {
        en: "Async evaluate — fetch inside the browser",
        uk: "Async evaluate — fetch всередині браузера",
      },
      paragraphs: [
        {
          en: "The function inside `evaluate` can be async. Playwright waits for the promise to resolve. Use this when you need to make a request from the browser context — with the browser's cookies and session — instead of from Node.js.",
          uk: "Функція всередині `evaluate` може бути async. Playwright чекає поки проміс розрезолвиться. Використовуй це коли треба зробити запит з контексту браузера — з cookies і сесією браузера — а не з Node.js.",
        },
      ],
      codeBlocks: [
        {
          id: "async-evaluate",
          language: "ts",
          code: `// Зробити запит від імені браузера (з його cookies/session)
const apiData = await page.evaluate(async () => {
  const response = await fetch('/api/orders?limit=5')
  return response.json()
})
expect(apiData).toHaveLength(5)

// Перевірити статус ендпоїнту зсередини браузера
const status = await page.evaluate(async (endpoint) => {
  const res = await fetch(endpoint)
  return res.status
}, '/api/health')
expect(status).toBe(200)`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You need to read a value from window.__APP_STATE__ in a test. Which approach is correct?",
        uk: "Тобі потрібно прочитати значення з window.__APP_STATE__ у тесті. Який підхід правильний?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "const state = window.__APP_STATE__ — access it directly in the test",
            uk: "const state = window.__APP_STATE__ — отримати напряму в тесті",
          },
        },
        {
          id: "b",
          label: {
            en: "const state = await page.evaluate(() => window.__APP_STATE__)",
            uk: "const state = await page.evaluate(() => window.__APP_STATE__)",
          },
        },
        {
          id: "c",
          label: {
            en: "const state = await page.locator('window.__APP_STATE__').textContent()",
            uk: "const state = await page.locator('window.__APP_STATE__').textContent()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Your test runs in Node.js — `window` doesn't exist there. `window.__APP_STATE__` only exists in the browser context. `page.evaluate()` is the bridge: the function runs in the browser where `window` is available, and the return value is serialized back to Node.js.",
        uk: "Твій тест виконується в Node.js — `window` там не існує. `window.__APP_STATE__` існує тільки в контексті браузера. `page.evaluate()` — це міст: функція виконується в браузері де `window` доступний, а повернуте значення серіалізується назад у Node.js.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You want to replace Math.random() with a fixed value for reproducible tests. When must you inject this replacement?",
        uk: "Хочеш замінити Math.random() фіксованим значенням для відтворюваних тестів. Коли потрібно впровадити цю заміну?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "After page.goto() — once the page is loaded",
            uk: "Після page.goto() — коли сторінка завантажена",
          },
        },
        {
          id: "b",
          label: {
            en: "Before page.goto() using page.addInitScript() — before any page JS runs",
            uk: "До page.goto() через page.addInitScript() — до виконання будь-якого JS сторінки",
          },
        },
        {
          id: "c",
          label: {
            en: "The order doesn't matter — Math.random is always replaceable",
            uk: "Порядок не важливий — Math.random завжди можна замінити",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "If the page uses `Math.random()` during its initialization, using `page.evaluate()` after `goto()` is too late — the page scripts have already run. `page.addInitScript()` injects code before the page's own scripts execute, guaranteeing the replacement is in place.",
        uk: "Якщо сторінка використовує `Math.random()` під час ініціалізації — `page.evaluate()` після `goto()` вже запізно, скрипти сторінки вже виконалися. `page.addInitScript()` впроваджує код до виконання власних скриптів сторінки, гарантуючи що заміна вже на місці.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Inside a `page.evaluate()` callback, you try to use a variable declared in your test scope. Why does this fail?",
        uk: "Всередині callback `page.evaluate()` ти намагаєшся використати змінну оголошену в контексті тесту. Чому це не працює?",
      },
      options: [
        { id: "a", label: { en: "Playwright doesn't support closures inside evaluate.", uk: "Playwright не підтримує замикання всередині evaluate." } },
        { id: "b", label: { en: "The callback runs in the browser process (a separate VM) — JavaScript closures don't cross the Node.js/browser boundary.", uk: "Callback виконується в процесі браузера (окремій VM) — JavaScript-замикання не перетинають межу Node.js/браузер." } },
        { id: "c", label: { en: "The variable is out of scope because `evaluate` runs asynchronously.", uk: "Змінна поза областю видимості бо `evaluate` виконується асинхронно." } },
        { id: "d", label: { en: "You need to use `page.evaluateHandle()` instead for variable access.", uk: "Потрібно використовувати `page.evaluateHandle()` для доступу до змінних." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Your test runs in Node.js; `page.evaluate()` serializes the function string and executes it in the browser's V8 instance. The browser has no knowledge of Node.js variables. To pass values in, provide them as the second argument to `page.evaluate(fn, arg)` — they're serialized via the DevTools Protocol.",
        uk: "Твій тест виконується в Node.js; `page.evaluate()` серіалізує рядок функції і виконує його в V8-інстансі браузера. Браузер нічого не знає про змінні Node.js. Щоб передати значення — надай їх другим аргументом `page.evaluate(fn, arg)` — вони серіалізуються через DevTools Protocol.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you read the `auth_token` value from `localStorage` in a Playwright test?",
        uk: "Як прочитати значення `auth_token` з `localStorage` у тесті Playwright?",
      },
      options: [
        { id: "a", label: { en: "`const token = localStorage.getItem('auth_token')`", uk: "`const token = localStorage.getItem('auth_token')`" } },
        { id: "b", label: { en: "`const token = await page.evaluate(() => localStorage.getItem('auth_token'))`", uk: "`const token = await page.evaluate(() => localStorage.getItem('auth_token'))`" } },
        { id: "c", label: { en: "`const token = await page.locator('localStorage').getAttribute('auth_token')`", uk: "`const token = await page.locator('localStorage').getAttribute('auth_token')`" } },
        { id: "d", label: { en: "`const token = await page.storageState().localStorage['auth_token']`", uk: "`const token = await page.storageState().localStorage['auth_token']`" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`localStorage` is a browser API — it only exists in the browser context. `page.evaluate()` runs the callback in the browser where `localStorage` is available, then serializes the return value back to Node.js. There is no `page.locator('localStorage')` and `page.storageState()` returns a snapshot, not a live accessor.",
        uk: "`localStorage` — браузерний API, існує лише в контексті браузера. `page.evaluate()` виконує callback у браузері де `localStorage` доступний, потім серіалізує повернуте значення назад у Node.js. `page.locator('localStorage')` не існує, а `page.storageState()` повертає знімок, а не живий accessor.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You want to dispatch a custom DOM event `'order:updated'` from your test. Which method do you use?",
        uk: "Хочеш відправити кастомну DOM-подію `'order:updated'` зі свого тесту. Який метод використати?",
      },
      options: [
        { id: "a", label: { en: "`page.dispatchEvent('order:updated', { detail: {} })`", uk: "`page.dispatchEvent('order:updated', { detail: {} })`" } },
        { id: "b", label: { en: "`page.evaluate(() => window.dispatchEvent(new CustomEvent('order:updated', { detail: {} })))`", uk: "`page.evaluate(() => window.dispatchEvent(new CustomEvent('order:updated', { detail: {} })))`" } },
        { id: "c", label: { en: "`page.emit('order:updated', { detail: {} })`", uk: "`page.emit('order:updated', { detail: {} })`" } },
        { id: "d", label: { en: "`page.trigger('order:updated')`", uk: "`page.trigger('order:updated')`" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Custom DOM events are dispatched inside the browser. Use `page.evaluate()` to run `window.dispatchEvent(new CustomEvent(...))` in the browser context. Note: `locator.dispatchEvent()` dispatches an event on a specific element, but for window-level custom events you need `page.evaluate()`.",
        uk: "Кастомні DOM-події відправляються всередині браузера. Використовуй `page.evaluate()` щоб виконати `window.dispatchEvent(new CustomEvent(...))` в контексті браузера. Примітка: `locator.dispatchEvent()` відправляє подію на конкретний елемент, але для window-рівневих кастомних подій потрібен `page.evaluate()`.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What does `context.addInitScript()` do differently from `page.addInitScript()`?",
        uk: "Чим `context.addInitScript()` відрізняється від `page.addInitScript()`?",
      },
      options: [
        { id: "a", label: { en: "`context.addInitScript()` runs the script after every page load; `page.addInitScript()` runs only once.", uk: "`context.addInitScript()` запускає скрипт після кожного завантаження сторінки; `page.addInitScript()` — лише один раз." } },
        { id: "b", label: { en: "`context.addInitScript()` applies the script to every new page opened in that context; `page.addInitScript()` applies only to that specific page.", uk: "`context.addInitScript()` застосовує скрипт до кожної нової сторінки відкритої в цьому контексті; `page.addInitScript()` — лише до цієї конкретної сторінки." } },
        { id: "c", label: { en: "They are identical — `context.addInitScript()` is just an alias.", uk: "Вони ідентичні — `context.addInitScript()` просто псевдонім." } },
        { id: "d", label: { en: "`context.addInitScript()` runs the script in Node.js, not in the browser.", uk: "`context.addInitScript()` запускає скрипт у Node.js, а не в браузері." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`context.addInitScript()` registers the script for the browser context — it runs on every page that opens within that context, including pages opened by the app itself (popups, links). `page.addInitScript()` registers for a single page only. Use the context variant when you need global mocks that should apply everywhere.",
        uk: "`context.addInitScript()` реєструє скрипт для browser context — він виконується на кожній сторінці що відкривається в цьому контексті, включаючи сторінки відкриті самим застосунком (popups, посилання). `page.addInitScript()` реєструє лише для однієї сторінки. Використовуй контекстний варіант коли потрібні глобальні моки що мають застосовуватись скрізь.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You need to make a fetch request from inside the browser (with the browser's own cookies/session) and get the result back in Node.js. Which approach works?",
        uk: "Потрібно зробити fetch-запит зсередини браузера (з cookies/сесією браузера) і отримати результат у Node.js. Який підхід працює?",
      },
      options: [
        { id: "a", label: { en: "Use `page.request.get('/api/orders')` — it runs in the browser context.", uk: "Використати `page.request.get('/api/orders')` — він виконується в контексті браузера." } },
        { id: "b", label: { en: "Use `page.evaluate(async () => { const r = await fetch('/api/orders'); return r.json() })` — async evaluate runs the fetch in the browser.", uk: "Використати `page.evaluate(async () => { const r = await fetch('/api/orders'); return r.json() })` — async evaluate виконує fetch у браузері." } },
        { id: "c", label: { en: "Use `node-fetch` in your test — it automatically shares browser cookies.", uk: "Використати `node-fetch` в тесті — він автоматично ділить cookies браузера." } },
        { id: "d", label: { en: "Use `page.route('/api/orders', handler)` to intercept and return the data.", uk: "Використати `page.route('/api/orders', handler)` для перехоплення і повернення даних." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "An async function inside `page.evaluate()` runs in the browser — it has access to `window.fetch`, the browser's cookie jar, session storage, and existing authentication. Playwright waits for the returned promise and serializes the result back to Node.js. `page.request` runs in Node.js (Playwright's APIRequestContext), not in the browser's credential-bearing context.",
        uk: "Async-функція всередині `page.evaluate()` виконується в браузері — вона має доступ до `window.fetch`, cookie jar браузера, session storage і наявної автентифікації. Playwright чекає повернутий проміс і серіалізує результат назад у Node.js. `page.request` виконується в Node.js (APIRequestContext Playwright), а не в credential-bearing контексті браузера.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What is the return value constraint for `page.evaluate()`?",
        uk: "Яке обмеження на повернуте значення у `page.evaluate()`?",
      },
      options: [
        { id: "a", label: { en: "It can return any JavaScript value including DOM nodes and functions.", uk: "Може повертати будь-яке JavaScript-значення включаючи DOM-вузли і функції." } },
        { id: "b", label: { en: "It must return a JSON-serializable value — DOM nodes, functions, and circular references are not supported.", uk: "Має повертати JSON-серіалізоване значення — DOM-вузли, функції та циклічні посилання не підтримуються." } },
        { id: "c", label: { en: "It can only return strings.", uk: "Може повертати лише рядки." } },
        { id: "d", label: { en: "It must return a Promise — synchronous return values are ignored.", uk: "Має повертати Promise — синхронні повернуті значення ігноруються." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.evaluate()` transfers the return value from the browser to Node.js via the DevTools Protocol, which serializes it as JSON. Primitives (strings, numbers, booleans), plain objects, and arrays work. DOM nodes, functions, `Map`, `Set`, and circular references don't serialize and will return `undefined` or throw. Use `page.evaluateHandle()` to work with non-serializable browser objects.",
        uk: "`page.evaluate()` передає повернуте значення з браузера до Node.js через DevTools Protocol, серіалізуючи як JSON. Примітиви (рядки, числа, булеві), звичайні об'єкти і масиви працюють. DOM-вузли, функції, `Map`, `Set` та циклічні посилання не серіалізуються і повернуть `undefined` або кинуть помилку. Використовуй `page.evaluateHandle()` для роботи з несерталізованими об'єктами браузера.",
      },
    },
  ],
}
