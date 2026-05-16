import type { PlaywrightTopic } from "../../types"

export const mockBrowserApisTopic: PlaywrightTopic = {
  slug: "mock-browser-apis",
  groupId: "guides",
  order: 255,
  level: "advanced",
  trackOrder: 15,
  sourceDoc: "mock-browser-js.md",
  officialDocsUrl: "https://playwright.dev/docs/mock-browser-apis",
  title: {
    en: "Mock browser APIs",
    uk: "Мокання браузерних API",
  },
  summary: {
    en: "For browser APIs that Playwright doesn't have a dedicated method for — Battery, cookieEnabled, matchMedia — you inject a mock object before the page loads using page.addInitScript(). The script runs in the browser context, before any page JS, so the app never knows it's talking to a fake.",
    uk: "Для браузерних API яких у Playwright немає окремого методу — Battery, cookieEnabled, matchMedia — ти впроваджуєш мок-об'єкт до завантаження сторінки через page.addInitScript(). Скрипт виконується в контексті браузера до будь-якого JS сторінки, тому застосунок ніколи не знає що спілкується з фейком.",
  },
  sections: [
    {
      id: "addInitScript-basics",
      title: {
        en: "page.addInitScript — inject before the page loads",
        uk: "page.addInitScript — впровадити до завантаження сторінки",
      },
      paragraphs: [
        {
          en: "`page.addInitScript()` runs your callback in the browser context before any page JavaScript. The page loads, your mock is already in place — the app sees a fake `navigator.getBattery` and never questions it.",
          uk: "`page.addInitScript()` запускає твій callback у контексті браузера до будь-якого JS сторінки. Сторінка завантажується, а мок вже на місці — застосунок бачить фейковий `navigator.getBattery` і навіть не підозрює.",
        },
        {
          en: "Our dashboard shows a battery warning banner when the device is below 20%. The Battery API isn't fully supported in all browsers and I can't drain a laptop to test it. So I mock it.",
          uk: "Наш dashboard показує банер про низький заряд коли пристрій нижче 20%. Battery API підтримується не в усіх браузерах і я не можу розрядити ноутбук щоб протестувати це. Тому я мокую його.",
        },
      ],
      codeBlocks: [
        {
          id: "battery-mock",
          language: "ts",
          code: `test('low battery warning banner appears below 20%', async ({ page }) => {
  // Впроваджуємо до goto — скрипт виконається до JS сторінки
  await page.addInitScript(() => {
    const mockBattery = {
      level: 0.15,       // 15% — нижче порогу
      charging: false,
      chargingTime: Infinity,
      dischargingTime: 3600,
      addEventListener: () => {},
    }
    window.navigator.getBattery = async () => mockBattery
  })

  await page.goto('/dashboard')

  // Банер з'являється тільки при level < 0.2
  await expect(page.getByTestId('battery-warning')).toBeVisible()
  await expect(page.getByTestId('battery-warning')).toContainText('15%')
})

test('no battery warning when charged', async ({ page }) => {
  await page.addInitScript(() => {
    window.navigator.getBattery = async () => ({
      level: 0.90,
      charging: true,
      chargingTime: 1800,
      dischargingTime: Infinity,
      addEventListener: () => {},
    })
  })

  await page.goto('/dashboard')
  await expect(page.getByTestId('battery-warning')).not.toBeVisible()
})`,
        },
      ],
    },
    {
      id: "read-only-properties",
      title: {
        en: "Read-only navigator properties",
        uk: "Read-only властивості navigator",
      },
      paragraphs: [
        {
          en: "Some browser properties are read-only — direct assignment silently does nothing. `navigator.cookieEnabled = false` has zero effect. For configurable properties, use `Object.defineProperty` to override the getter.",
          uk: "Деякі браузерні властивості read-only — пряме присвоєння мовчки нічого не робить. `navigator.cookieEnabled = false` не має жодного ефекту. Для configurable властивостей — використовуй `Object.defineProperty` щоб перевизначити геттер.",
        },
        {
          en: "I use this to test the 'cookies disabled' warning page. Our app shows a special error screen when cookies are blocked — which I can't reproduce naturally in a test.",
          uk: "Я використовую це щоб тестувати сторінку попередження 'cookies вимкнено'. Наш застосунок показує спеціальний екран помилки коли cookies заблоковані — відтворити це природним чином у тесті неможливо.",
        },
      ],
      codeBlocks: [
        {
          id: "read-only-mock",
          language: "ts",
          code: `// navigator.cookieEnabled = false — не працює, властивість read-only
// Правильно: Object.defineProperty
test('app shows cookies-disabled error page', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(
      Object.getPrototypeOf(navigator),
      'cookieEnabled',
      { get: () => false, configurable: true }
    )
  })

  await page.goto('/dashboard')

  // Застосунок перевіряє navigator.cookieEnabled при завантаженні
  await expect(page.getByTestId('cookies-disabled-error')).toBeVisible()
  await expect(page.getByTestId('cookies-disabled-error'))
    .toContainText('Enable cookies to continue')
})`,
        },
      ],
    },
    {
      id: "verifying-api-calls",
      title: {
        en: "Verify which browser APIs the page calls",
        uk: "Перевірити які браузерні API викликає сторінка",
      },
      paragraphs: [
        {
          en: "Sometimes I need to check that the app called the right browser API in the right order. `page.exposeFunction()` bridges the browser context back to Node.js — the mock in the browser calls a function that appends to a log array in the test.",
          uk: "Іноді потрібно перевірити що застосунок викликав правильний браузерний API у правильному порядку. `page.exposeFunction()` будує міст з контексту браузера назад до Node.js — мок у браузері викликає функцію яка додає до log-масиву в тесті.",
        },
      ],
      codeBlocks: [
        {
          id: "verify-calls",
          language: "ts",
          code: `test('dashboard subscribes to battery events correctly', async ({ page }) => {
  const calls: string[] = []

  // ExposeFunction — доступна в браузері як window.logCall
  await page.exposeFunction('logCall', (msg: string) => calls.push(msg))

  await page.addInitScript(() => {
    window.navigator.getBattery = async () => {
      window.logCall('getBattery')
      return {
        level: 0.75,
        charging: true,
        chargingTime: 1800,
        dischargingTime: Infinity,
        addEventListener: (name: string) => window.logCall(\`addEventListener:\${name}\`),
      }
    }
  })

  await page.goto('/dashboard')

  // Переконуємося що застосунок викликав API в правильному порядку
  expect(calls).toEqual([
    'getBattery',
    'addEventListener:chargingchange',
    'addEventListener:levelchange',
  ])
})`,
        },
      ],
    },
    {
      id: "dynamic-updates",
      title: {
        en: "Simulate runtime API changes",
        uk: "Симулювати зміни API в рантаймі",
      },
      paragraphs: [
        {
          en: "Static mocks only test the initial state. To test that the UI reacts to changes — like the battery level dropping mid-session — I expose the mock object on `window` so the test can trigger updates via `page.evaluate()`.",
          uk: "Статичні моки тестують лише початковий стан. Щоб перевірити що UI реагує на зміни — наприклад рівень заряду падає під час сесії — я виставляю мок-об'єкт на `window` щоб тест міг тригерити оновлення через `page.evaluate()`.",
        },
      ],
      codeBlocks: [
        {
          id: "dynamic-mock",
          language: "ts",
          code: `test('battery warning appears when level drops below 20%', async ({ page }) => {
  await page.addInitScript(() => {
    class BatteryMock {
      level = 0.80
      charging = false
      chargingTime = Infinity
      dischargingTime = 7200
      _listeners: Record<string, (() => void)[]> = {}

      addEventListener(event: string, cb: () => void) {
        this._listeners[event] = this._listeners[event] || []
        this._listeners[event].push(cb)
      }

      _setLevel(value: number) {
        this.level = value
        this._listeners['levelchange']?.forEach(cb => cb())
      }
    }

    const mock = new BatteryMock()
    window.navigator.getBattery = async () => mock
    // @ts-ignore — зберігаємо для page.evaluate()
    window.__batteryMock = mock
  })

  await page.goto('/dashboard')
  await expect(page.getByTestId('battery-warning')).not.toBeVisible()

  // Симулюємо падіння заряду
  await page.evaluate(() => (window as any).__batteryMock._setLevel(0.15))

  await expect(page.getByTestId('battery-warning')).toBeVisible()
  await expect(page.getByTestId('battery-warning')).toContainText('15%')
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Why must page.addInitScript() be called BEFORE page.goto()?",
        uk: "Чому page.addInitScript() потрібно викликати ДО page.goto()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It's just convention — the order doesn't actually matter",
            uk: "Це просто конвенція — порядок насправді не важливий",
          },
        },
        {
          id: "b",
          label: {
            en: "The page may call the browser API early during load — the mock must be in place before any page JS runs",
            uk: "Сторінка може викликати браузерний API рано під час завантаження — мок повинен бути на місці до виконання будь-якого JS сторінки",
          },
        },
        {
          id: "c",
          label: {
            en: "page.addInitScript() doesn't work after navigation",
            uk: "page.addInitScript() не працює після навігації",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Browser APIs like `getBattery` or `navigator.cookieEnabled` are often read as soon as the page's JavaScript starts executing. If you add the mock after `goto()`, the page has already read the real value. `addInitScript` runs before any page scripts, guaranteeing the mock is in place.",
        uk: "Браузерні API типу `getBattery` або `navigator.cookieEnabled` часто зчитуються щойно починає виконуватися JS сторінки. Якщо додати мок після `goto()` — сторінка вже прочитала реальне значення. `addInitScript` виконується до будь-яких скриптів сторінки, гарантуючи що мок вже на місці.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You want to test a feature that checks `navigator.cookieEnabled`. But `navigator.cookieEnabled = false` has no effect. Why, and what's the fix?",
        uk: "Хочеш протестувати функцію що перевіряє `navigator.cookieEnabled`. Але `navigator.cookieEnabled = false` не має ефекту. Чому, і яке виправлення?",
      },
      options: [
        { id: "a", label: { en: "Use `page.evaluate(() => navigator.cookieEnabled = false)` — direct assignment only works from inside the browser.", uk: "Використати `page.evaluate(() => navigator.cookieEnabled = false)` — пряме присвоєння працює лише зсередини браузера." } },
        { id: "b", label: { en: "`navigator.cookieEnabled` is read-only — use `Object.defineProperty(Object.getPrototypeOf(navigator), 'cookieEnabled', { get: () => false, configurable: true })` inside `addInitScript()`.", uk: "`navigator.cookieEnabled` — read-only, використовуй `Object.defineProperty(Object.getPrototypeOf(navigator), 'cookieEnabled', { get: () => false, configurable: true })` всередині `addInitScript()`." } },
        { id: "c", label: { en: "Set `cookiesEnabled: false` in the browser launch options.", uk: "Встановити `cookiesEnabled: false` в browser launch options." } },
        { id: "d", label: { en: "Use `context.clearCookies()` to simulate a state where cookies are blocked.", uk: "Використати `context.clearCookies()` щоб симулювати стан де cookies заблоковані." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`navigator.cookieEnabled` is defined on the navigator prototype as a read-only property — direct assignment (`= false`) silently fails because it's non-writable. To override a read-only property in JavaScript, use `Object.defineProperty()` with a custom getter on the prototype. This must be done inside `addInitScript()` so it runs before the page reads the property.",
        uk: "`navigator.cookieEnabled` визначено на прототипі navigator як read-only властивість — пряме присвоєння (`= false`) мовчки не спрацьовує бо властивість non-writable. Щоб перевизначити read-only властивість в JavaScript — використовуй `Object.defineProperty()` з кастомним геттером на прототипі. Це потрібно робити всередині `addInitScript()` щоб виконалось до того як сторінка прочитає властивість.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "How do you test that a battery warning banner appears when the battery level drops below 20% mid-session (not just on initial load)?",
        uk: "Як протестувати що банер про низький заряд з'являється коли рівень батареї падає нижче 20% в середині сесії (не лише при початковому завантаженні)?",
      },
      options: [
        { id: "a", label: { en: "Reload the page with a different mock battery level for each test.", uk: "Перезавантажити сторінку з іншим рівнем батареї в кожному тесті." } },
        { id: "b", label: { en: "Expose the mock battery object on `window` via `addInitScript()`, then trigger level changes via `page.evaluate(() => window.__batteryMock._setLevel(0.15))`.", uk: "Виставити мок-об'єкт батареї на `window` через `addInitScript()`, потім тригерити зміни рівня через `page.evaluate(() => window.__batteryMock._setLevel(0.15))`." } },
        { id: "c", label: { en: "Use `context.setOffline(true)` — it triggers battery-related events.", uk: "Використати `context.setOffline(true)` — він тригерує battery-related події." } },
        { id: "d", label: { en: "Call `navigator.getBattery()` directly from Node.js to change the mock state.", uk: "Викликати `navigator.getBattery()` напряму з Node.js щоб змінити стан моку." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The key technique for dynamic browser API mocking is: create a mock object with an event system, store a reference to it on `window` in `addInitScript()`, then mutate it from Node.js via `page.evaluate()`. When `_setLevel()` changes the level and fires `levelchange` listeners, the real app code reacts exactly as it would to a real hardware event.",
        uk: "Ключова техніка для динамічного мокування браузерного API: створити мок-об'єкт з системою подій, зберегти посилання на нього на `window` в `addInitScript()`, потім мутувати його з Node.js через `page.evaluate()`. Коли `_setLevel()` змінює рівень і запускає `levelchange` слухачів — реальний код застосунку реагує точно так само як на реальну hardware-подію.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does `page.exposeFunction('logCall', handler)` do?",
        uk: "Що робить `page.exposeFunction('logCall', handler)`?",
      },
      options: [
        { id: "a", label: { en: "It exposes a browser-side function to Node.js for inspection.", uk: "Він виставляє браузерну функцію для Node.js для перевірки." } },
        { id: "b", label: { en: "It makes `window.logCall` available in the browser — when called, it invokes the `handler` function in Node.js.", uk: "Він робить `window.logCall` доступним у браузері — при виклику він викликає функцію `handler` у Node.js." } },
        { id: "c", label: { en: "It adds a console.log wrapper around all browser API calls.", uk: "Він додає обгортку console.log навколо всіх викликів браузерного API." } },
        { id: "d", label: { en: "It creates a shared memory space between Node.js and the browser.", uk: "Він створює спільну пам'ять між Node.js і браузером." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.exposeFunction()` bridges the Node.js/browser boundary in the opposite direction from `page.evaluate()`. It makes a Node.js function callable from browser-side JavaScript as `window.logCall(...)`. This is useful for collecting call logs — the mock in the browser calls `window.logCall('getBattery')`, which appends to an array in Node.js.",
        uk: "`page.exposeFunction()` будує міст між Node.js і браузером у протилежному напрямку від `page.evaluate()`. Він робить Node.js-функцію викликуваною з браузерного JavaScript як `window.logCall(...)`. Це корисно для збору журналів викликів — мок у браузері викликає `window.logCall('getBattery')`, що додає до масиву в Node.js.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "Your app checks `navigator.getBattery()` on page load. You write a mock in `page.evaluate()` after `page.goto()`. The mock doesn't take effect. Why?",
        uk: "Твій застосунок перевіряє `navigator.getBattery()` при завантаженні сторінки. Ти пишеш мок в `page.evaluate()` після `page.goto()`. Мок не спрацьовує. Чому?",
      },
      options: [
        { id: "a", label: { en: "You must use `page.route()` to intercept the Battery API.", uk: "Потрібно використовувати `page.route()` щоб перехопити Battery API." } },
        { id: "b", label: { en: "The page already called `getBattery()` during initialization — `page.evaluate()` runs after the page loads, so the mock is too late.", uk: "Сторінка вже викликала `getBattery()` під час ініціалізації — `page.evaluate()` виконується після завантаження сторінки, тому мок запізнюється." } },
        { id: "c", label: { en: "The Battery API cannot be mocked at all in Playwright.", uk: "Battery API взагалі не можна замокати в Playwright." } },
        { id: "d", label: { en: "You need to use `page.on('getBattery', handler)` to intercept the call.", uk: "Потрібно використовувати `page.on('getBattery', handler)` щоб перехопити виклик." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.evaluate()` runs JavaScript in the browser but only after the page has loaded. If the app reads `navigator.getBattery()` during page initialization, it already received the real value before your mock is in place. The fix: use `page.addInitScript()` which runs before any page JavaScript executes.",
        uk: "`page.evaluate()` виконує JavaScript у браузері але лише після завантаження сторінки. Якщо застосунок читає `navigator.getBattery()` під час ініціалізації — він вже отримав реальне значення до того як твій мок на місці. Виправлення: використовуй `page.addInitScript()` який виконується до будь-якого JavaScript сторінки.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Which scenario is a good use case for mocking browser APIs with `addInitScript()`, rather than using `page.route()`?",
        uk: "Який сценарій добре підходить для мокування браузерних API через `addInitScript()`, а не через `page.route()`?",
      },
      options: [
        { id: "a", label: { en: "Intercepting HTTP API calls to your backend.", uk: "Перехоплення HTTP API-викликів до бекенду." } },
        { id: "b", label: { en: "Faking device hardware APIs like battery level, geolocation (beyond context config), or `matchMedia` that don't involve HTTP requests.", uk: "Підміна hardware-API пристрою типу рівня батареї, геолокації (поза конфігурацією контексту) або `matchMedia` що не передбачають HTTP-запитів." } },
        { id: "c", label: { en: "Blocking third-party analytics scripts.", uk: "Блокування сторонніх аналітичних скриптів." } },
        { id: "d", label: { en: "Mocking REST API responses with specific status codes.", uk: "Мокування відповідей REST API з конкретними статус-кодами." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.route()` intercepts HTTP/HTTPS network requests. It's the right tool for API calls. `page.addInitScript()` is for injecting JavaScript that overrides browser-native APIs (Battery, `matchMedia`, `navigator.cookieEnabled`, `navigator.onLine`) that don't make network requests but are read directly from the browser environment.",
        uk: "`page.route()` перехоплює HTTP/HTTPS мережеві запити. Це правильний інструмент для API-викликів. `page.addInitScript()` — для впровадження JavaScript що перевизначає нативні API браузера (Battery, `matchMedia`, `navigator.cookieEnabled`, `navigator.onLine`) які не роблять мережевих запитів але зчитуються безпосередньо з середовища браузера.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to verify that the app correctly subscribes to `chargingchange` and `levelchange` battery events. How do you capture which events the app actually listened for?",
        uk: "Хочеш перевірити що застосунок правильно підписується на події батареї `chargingchange` і `levelchange`. Як захопити до яких подій застосунок насправді слухав?",
      },
      options: [
        { id: "a", label: { en: "Use `page.on('customevent', handler)` to observe DOM custom events.", uk: "Використати `page.on('customevent', handler)` для спостереження за DOM-кастомними подіями." } },
        { id: "b", label: { en: "Use `page.exposeFunction('logCall', msg => calls.push(msg))`, then in the mock's `addEventListener`, call `window.logCall('addEventListener:' + eventName)`.", uk: "Використати `page.exposeFunction('logCall', msg => calls.push(msg))`, потім у `addEventListener` моку викликати `window.logCall('addEventListener:' + eventName)`." } },
        { id: "c", label: { en: "Use `page.evaluate(() => window.__batteryListeners)` after goto to read the listener list.", uk: "Використати `page.evaluate(() => window.__batteryListeners)` після goto щоб прочитати список слухачів." } },
        { id: "d", label: { en: "Use `page.waitForEvent('chargingchange')` — Playwright tracks battery events natively.", uk: "Використати `page.waitForEvent('chargingchange')` — Playwright відстежує battery-події нативно." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.exposeFunction()` creates a bridge: `window.logCall` is callable from browser-side JavaScript and invokes the Node.js handler. In the mock's `addEventListener` implementation, call `window.logCall('addEventListener:' + name)`. After `page.goto()`, the `calls` array in Node.js contains the exact sequence of API calls the app made — verifiable with a simple `expect(calls).toEqual([...])` assertion.",
        uk: "`page.exposeFunction()` створює міст: `window.logCall` викликається з браузерного JavaScript і викликає Node.js handler. В реалізації `addEventListener` моку викличте `window.logCall('addEventListener:' + name)`. Після `page.goto()` масив `calls` у Node.js містить точну послідовність API-викликів застосунку — що перевіряється простим `expect(calls).toEqual([...])` assertion.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "The Battery API mock returns `level: 0.15` on page load. Your test asserts the warning banner is visible. But the test is flaky — sometimes the banner doesn't appear. What's the most likely cause?",
        uk: "Мок Battery API повертає `level: 0.15` при завантаженні сторінки. Твій тест перевіряє що банер попередження видимий. Але тест нестабільний — іноді банер не з'являється. Яка найімовірніша причина?",
      },
      options: [
        { id: "a", label: { en: "The `level: 0.15` value is too close to the 0.20 threshold — use a lower value.", uk: "Значення `level: 0.15` надто близьке до порогу 0.20 — використай менше значення." } },
        { id: "b", label: { en: "The `addInitScript()` call is placed after `page.goto()` — the page occasionally reads the real battery state before the mock is registered.", uk: "Виклик `addInitScript()` знаходиться після `page.goto()` — сторінка іноді читає реальний стан батареї до реєстрації моку." } },
        { id: "c", label: { en: "The Battery API is asynchronous — the test should await a longer timeout for the banner.", uk: "Battery API асинхронний — тест має очікувати довший timeout для банера." } },
        { id: "d", label: { en: "The mock object needs a `dispose()` call to activate it.", uk: "Мок-об'єкт потребує виклику `dispose()` щоб активуватися." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "If `addInitScript()` is called after `page.goto()`, there's a race condition: the page may have already read `navigator.getBattery()` during its initialization before the mock was registered. The fix is to call `addInitScript()` before `page.goto()` — the init script then runs before any page JavaScript and the mock is always in place.",
        uk: "Якщо `addInitScript()` викликається після `page.goto()` — є race condition: сторінка могла вже прочитати `navigator.getBattery()` під час ініціалізації до реєстрації моку. Виправлення: виклик `addInitScript()` до `page.goto()` — init-скрипт виконується до будь-якого JS сторінки і мок завжди на місці.",
      },
    },
  ],
}
