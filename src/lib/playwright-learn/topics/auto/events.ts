import type { PlaywrightTopic } from "../../types"

export const eventsTopic: PlaywrightTopic = {
  slug: "events",
  groupId: "guides",
  order: 195,
  level: "intermediate",
  trackOrder: 24,
  sourceDoc: "events.md",
  officialDocsUrl: "https://playwright.dev/docs/events",
  title: {
    en: "Events",
    uk: "Події",
  },
  summary: {
    en: "Two patterns: waitForEvent (set up the promise BEFORE triggering the action, then await after) and page.on (listen to all occurrences continuously). The waitForEvent pattern is critical — get the order wrong and you miss the event.",
    uk: "Два патерни: waitForEvent (встанови проміс ДО тригерної дії, потім очікуй після) і page.on (слухай всі події безперервно). Патерн з waitForEvent критичний — переплутай порядок і пропустиш подію.",
  },
  sections: [
    {
      id: "waitForEvent",
      title: {
        en: "waitForEvent — the setup-before-trigger pattern",
        uk: "waitForEvent — патерн «встанови-до-тригеру»",
      },
      diagram: {
        mermaid: `sequenceDiagram
  participant T as Test
  participant PW as Playwright
  T->>PW: 1. const promise = context.waitForEvent('page')
  Note over PW: listener registered (not awaited yet)
  T->>PW: 2. await page.click('View receipt')
  PW-->>PW: new tab opens, event fires
  T->>PW: 3. const newPage = await promise
  PW-->>T: new Page object returned ✓
  Note over T: Wrong order: await before click<br/>→ event fires before listener = missed`,
        caption: {
          en: "Always register the waitForEvent promise BEFORE triggering the action — the event fires only once",
          uk: "Завжди реєструйте waitForEvent проміс ДО тригерної дії — подія спрацьовує лише один раз",
        },
      },
      paragraphs: [
        {
          en: "Some actions trigger events that fire once: a new tab opens, a file downloads, a dialog appears. The pattern is always the same: set up the event listener BEFORE the action, then trigger the action, then await the result. If you reverse the order, the event may have already fired before you start listening.",
          uk: "Деякі дії тригерять події що спрацьовують один раз: нова вкладка відкривається, файл завантажується, з'являється діалог. Патерн завжди однаковий: встанови слухача ДО дії, потім тригерни дію, потім очікуй результат. Переплутаєш порядок — подія вже могла спрацювати до того як ти почав слухати.",
        },
      ],
      codeBlocks: [
        {
          id: "waitForEvent-pattern",
          language: "ts",
          code: `// Нова вкладка — встановити ДО кліку
test('receipt opens in new tab', async ({ page, context }) => {
  await page.goto('/orders/42')

  // Крок 1: встановити очікування (не await!)
  const newPagePromise = context.waitForEvent('page')

  // Крок 2: тригернути дію
  await page.getByRole('link', { name: 'View receipt' }).click()

  // Крок 3: отримати результат
  const receiptPage = await newPagePromise
  await receiptPage.waitForLoadState()
  await expect(receiptPage).toHaveURL(/\\/receipts\\/\\d+/)
})

// Download — той самий патерн
test('export downloads CSV', async ({ page }) => {
  await page.goto('/orders')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export CSV' }).click()

  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/orders.*\\.csv/)
})

// Popup — page.waitForEvent (не context)
test('payment widget opens in popup', async ({ page }) => {
  await page.goto('/checkout')

  const popupPromise = page.waitForEvent('popup')
  await page.getByRole('button', { name: 'Pay now' }).click()

  const popup = await popupPromise
  await popup.waitForLoadState()
  await expect(popup.getByRole('heading', { name: 'Payment' })).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "page-on",
      title: {
        en: "page.on() — listen to all occurrences",
        uk: "page.on() — слухати всі появи",
      },
      paragraphs: [
        {
          en: "`page.on()` is for ongoing listening — log all requests, collect all console errors, capture all responses. Unlike `waitForEvent` which resolves once, `page.on` fires for every matching event.",
          uk: "`page.on()` — для постійного слухання: логувати всі запити, збирати всі помилки консолі, захоплювати всі відповіді. На відміну від `waitForEvent` що резолвиться один раз — `page.on` спрацьовує на кожну відповідну подію.",
        },
      ],
      codeBlocks: [
        {
          id: "page-on",
          language: "ts",
          code: `// Збирати JS-помилки консолі під час тесту
test('dashboard has no console errors', async ({ page }) => {
  const errors: string[] = []

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle')

  expect(errors).toHaveLength(0)
})

// Логувати всі мережеві запити до певного ендпоїнту
test('orders page makes correct API call', async ({ page }) => {
  const apiCalls: string[] = []

  page.on('request', request => {
    if (request.url().includes('/api/orders')) {
      apiCalls.push(request.url())
    }
  })

  await page.goto('/orders')
  await page.waitForLoadState('networkidle')

  expect(apiCalls).toHaveLength(1)
  expect(apiCalls[0]).toContain('/api/orders')
})

// Слідкувати за відповідями
page.on('response', response => {
  if (!response.ok()) {
    console.warn(\`Failed: \${response.status()} \${response.url()}\`)
  }
})`,
        },
      ],
    },
    {
      id: "page-once-off",
      title: {
        en: "page.once() and page.off() — one-shot and cleanup",
        uk: "page.once() і page.off() — одноразово і прибирання",
      },
      paragraphs: [
        {
          en: "`page.once()` registers a listener that fires only the next time the event occurs, then removes itself. Perfect for dialogs: handle the next alert, ignore any subsequent ones. `page.off()` removes a specific listener — useful for cleanup when the listening period ends.",
          uk: "`page.once()` реєструє слухача що спрацьовує тільки наступний раз коли подія трапляється, потім видаляє себе. Ідеально для діалогів: обробити наступний alert, ігнорувати наступні. `page.off()` видаляє конкретний слухач — корисно для прибирання після закінчення потрібного проміжку.",
        },
      ],
      codeBlocks: [
        {
          id: "once-off",
          language: "ts",
          code: `// page.once — обробити наступний dialog і більше нічого
page.once('dialog', dialog => dialog.accept())
await page.getByRole('button', { name: 'Delete order' }).click()
// Dialog accepted — подальші dialogs знову показуватимуться

// page.off — прибирати listener після потрібного проміжку
const logRequest = (request: Request) => {
  console.log('Request:', request.url())
}

page.on('request', logRequest)
await page.goto('/orders')          // логуємо запити тут
page.off('request', logRequest)     // прибираємо слухача
await page.goto('/dashboard')       // ці запити не логуються`,
        },
      ],
    },
    {
      id: "waitForRequest-waitForResponse",
      title: {
        en: "waitForRequest and waitForResponse",
        uk: "waitForRequest і waitForResponse",
      },
      paragraphs: [
        {
          en: "Specific helpers for network events. The same setup-before-trigger pattern applies — set up the waiter before the action that triggers the request.",
          uk: "Специфічні хелпери для мережевих подій. Той самий патерн «встанови-до-тригеру» — встанови waiter до дії що тригерить запит.",
        },
      ],
      codeBlocks: [
        {
          id: "network-events",
          language: "ts",
          code: `// Дочекатися конкретного запиту і перевірити його body
test('filter sends correct params', async ({ page }) => {
  await page.goto('/orders')

  // Встановити ДО кліку
  const requestPromise = page.waitForRequest(req =>
    req.url().includes('/api/orders') && req.method() === 'GET'
  )

  await page.getByRole('combobox', { name: 'Status' }).selectOption('pending')
  await page.getByRole('button', { name: 'Apply' }).click()

  const request = await requestPromise
  expect(new URL(request.url()).searchParams.get('status')).toBe('pending')
})

// Дочекатися конкретної відповіді і перевірити її
test('order creation returns 201', async ({ page }) => {
  await page.goto('/orders/new')

  const responsePromise = page.waitForResponse('/api/orders')
  await page.getByRole('button', { name: 'Create order' }).click()

  const response = await responsePromise
  expect(response.status()).toBe(201)

  const body = await response.json()
  expect(body.id).toMatch(/ORD-\\d+/)
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want to capture a new tab that opens when a button is clicked. Why must you set up context.waitForEvent('page') BEFORE clicking?",
        uk: "Хочеш перехопити нову вкладку що відкривається після кліку кнопки. Чому потрібно встановити context.waitForEvent('page') ДО кліку?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It's just a convention — the order doesn't actually matter",
            uk: "Це просто конвенція — порядок насправді не важливий",
          },
        },
        {
          id: "b",
          label: {
            en: "The 'page' event fires when the tab opens. If you set up the listener after clicking, the event may have already fired and you'll miss it",
            uk: "Подія 'page' спрацьовує коли вкладка відкривається. Якщо встановити слухача після кліку — подія вже могла спрацювати і ти її пропустиш",
          },
        },
        {
          id: "c",
          label: {
            en: "You need to set up the listener before clicking because Playwright blocks navigation until a listener is registered",
            uk: "Потрібно встановити слухача до кліку бо Playwright блокує навігацію поки слухач не зареєстрований",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The event fires at the moment the new tab opens, which can happen very quickly after the click. If you call `waitForEvent` after the click, the event may have already fired — the promise will never resolve. The pattern is: create the promise, trigger the action, then await the promise.",
        uk: "Подія спрацьовує в момент відкриття нової вкладки що може статися дуже швидко після кліку. Якщо викликати `waitForEvent` після кліку — подія вже могла спрацювати і проміс ніколи не резолвиться. Патерн: створити проміс, тригернути дію, потім очікувати проміс.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What's the difference between page.on('dialog') and page.once('dialog')?",
        uk: "В чому різниця між page.on('dialog') і page.once('dialog')?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.on fires for every dialog; page.once fires only for the next one and then removes itself",
            uk: "page.on спрацьовує для кожного dialog; page.once — тільки для наступного і потім видаляє себе",
          },
        },
        {
          id: "b",
          label: {
            en: "page.once is faster than page.on",
            uk: "page.once швидший за page.on",
          },
        },
        {
          id: "c",
          label: {
            en: "They're identical — 'once' is just an alias",
            uk: "Вони ідентичні — 'once' просто псевдонім",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`page.on()` keeps listening until you call `page.off()` — it fires for every subsequent event. `page.once()` fires once and then automatically removes the listener. Use `page.once('dialog')` when you know exactly one dialog will appear and you want clean, self-removing handling.",
        uk: "`page.on()` продовжує слухати поки ти не викличеш `page.off()` — спрацьовує для кожної наступної події. `page.once()` спрацьовує один раз і автоматично видаляє слухача. Використовуй `page.once('dialog')` коли знаєш що з'явиться рівно один dialog і хочеш чисте самовидаляюче обслуговування.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "You want to log all console errors that occur during a test run. Which pattern is correct?",
        uk: "Хочеш логувати всі помилки консолі що виникають під час тесту. Який патерн правильний?",
      },
      options: [
        { id: "a", label: { en: "Use `page.waitForEvent('console')` to capture each error one by one.", uk: "Використати `page.waitForEvent('console')` щоб захоплювати кожну помилку по одній." } },
        { id: "b", label: { en: "Use `page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })` before navigating.", uk: "Використати `page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })` до навігації." } },
        { id: "c", label: { en: "Use `browser.on('console', handler)` — console events fire on the browser, not the page.", uk: "Використати `browser.on('console', handler)` — події console спрацьовують на браузері, а не на сторінці." } },
        { id: "d", label: { en: "Enable `devtools: true` in the launch options — errors are auto-saved.", uk: "Увімкнути `devtools: true` в launch options — помилки зберігаються автоматично." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.on('console', handler)` fires for every console message. Check `msg.type() === 'error'` to filter only errors. Set up the listener before `page.goto()` to capture errors from page initialization. `waitForEvent('console')` only captures one event and blocks until it fires.",
        uk: "`page.on('console', handler)` спрацьовує для кожного повідомлення консолі. Перевіряй `msg.type() === 'error'` щоб фільтрувати лише помилки. Встанови слухача до `page.goto()` щоб захопити помилки ініціалізації сторінки. `waitForEvent('console')` захоплює лише одну подію і блокується поки вона не спрацює.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What is the key difference between `context.waitForEvent('page')` and `page.waitForEvent('popup')`?",
        uk: "У чому ключова різниця між `context.waitForEvent('page')` і `page.waitForEvent('popup')`?",
      },
      options: [
        { id: "a", label: { en: "They are identical — use either one interchangeably.", uk: "Вони ідентичні — використовуй будь-який." } },
        { id: "b", label: { en: "`context.waitForEvent('page')` captures any new page/tab in the context; `page.waitForEvent('popup')` captures popups opened specifically by that page (e.g., via `window.open()`).", uk: "`context.waitForEvent('page')` захоплює будь-яку нову сторінку/вкладку в контексті; `page.waitForEvent('popup')` захоплює popup відкриті конкретно цією сторінкою (напр. через `window.open()`)." } },
        { id: "c", label: { en: "`page.waitForEvent('popup')` works for new tabs; `context.waitForEvent('page')` works only for modal dialogs.", uk: "`page.waitForEvent('popup')` працює для нових вкладок; `context.waitForEvent('page')` — лише для модальних діалогів." } },
        { id: "d", label: { en: "`context.waitForEvent('page')` is deprecated — use `page.waitForEvent('popup')` instead.", uk: "`context.waitForEvent('page')` deprecated — натомість використовуй `page.waitForEvent('popup')`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`context.waitForEvent('page')` fires for any new page opened in the browser context — whether the user or the app opens it. `page.waitForEvent('popup')` fires specifically when the current page triggers a popup (via `window.open()` or `target=\"_blank\"` click). Use `popup` when you know which page opens it; use `context`'s `page` event when you need broader context-level tracking.",
        uk: "`context.waitForEvent('page')` спрацьовує для будь-якої нової сторінки відкритої в browser context — чи відкрив її користувач або застосунок. `page.waitForEvent('popup')` спрацьовує конкретно коли поточна сторінка відкриває popup (через `window.open()` або клік `target=\"_blank\"`). Використовуй `popup` коли знаєш яка сторінка його відкриває; використовуй подію `page` на `context` для ширшого відстеження на рівні контексту.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you wait for a specific API request to be made, then verify its query parameters?",
        uk: "Як дочекатися конкретного API-запиту і потім перевірити його query параметри?",
      },
      options: [
        { id: "a", label: { en: "Use `page.on('request', req => ...)` and check the URL after the action.", uk: "Використати `page.on('request', req => ...)` і перевірити URL після дії." } },
        { id: "b", label: { en: "Use `page.route()` to intercept the request and inspect it.", uk: "Використати `page.route()` щоб перехопити запит і перевірити його." } },
        { id: "c", label: { en: "Create `const reqPromise = page.waitForRequest(predicate)` before the action, trigger the action, then `const req = await reqPromise` and inspect `req.url()`.", uk: "Створити `const reqPromise = page.waitForRequest(predicate)` до дії, тригернути дію, потім `const req = await reqPromise` і перевірити `req.url()`." } },
        { id: "d", label: { en: "Use `page.waitForNavigation()` — it waits for all requests to complete.", uk: "Використати `page.waitForNavigation()` — він чекає завершення всіх запитів." } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`page.waitForRequest()` returns a Promise that resolves to the matching `Request` object. Set it up before the action (same setup-before-trigger pattern), then inspect `request.url()`, `request.method()`, or parse `new URL(request.url()).searchParams`. `page.on('request')` fires for all requests but doesn't give you a clean await point.",
        uk: "`page.waitForRequest()` повертає Promise що резолвиться відповідним об'єктом `Request`. Встанови до дії (той самий патерн «встанови-до-тригеру»), потім перевіряй `request.url()`, `request.method()`, або парси `new URL(request.url()).searchParams`. `page.on('request')` спрацьовує для всіх запитів але не дає чистої точки очікування.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "When should you use `page.off('request', handler)` after using `page.on('request', handler)`?",
        uk: "Коли варто використовувати `page.off('request', handler)` після `page.on('request', handler)`?",
      },
      options: [
        { id: "a", label: { en: "Always — Playwright leaks memory if you don't call `off`.", uk: "Завжди — Playwright витікає пам'ять якщо не викликати `off`." } },
        { id: "b", label: { en: "When you want to stop collecting events after a specific action and avoid picking up unrelated subsequent requests.", uk: "Коли хочеш зупинити збір подій після конкретної дії і уникнути захоплення непов'язаних наступних запитів." } },
        { id: "c", label: { en: "Never — Playwright automatically removes listeners when the test ends.", uk: "Ніколи — Playwright автоматично видаляє слухачів після завершення тесту." } },
        { id: "d", label: { en: "Only when testing multiple pages in the same test.", uk: "Лише при тестуванні кількох сторінок в одному тесті." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Listeners added with `page.on()` persist for the test's lifetime. If you only care about requests during a specific phase (e.g., after clicking 'Apply filter' but not during page load), use `page.on()` to start and `page.off()` to stop — passing the same function reference. Playwright does clean up at test end, but mid-test scoping improves clarity.",
        uk: "Слухачі додані через `page.on()` зберігаються протягом всього тесту. Якщо тебе цікавлять запити лише під час конкретної фази (напр. після кліку 'Apply filter' але не під час завантаження сторінки) — використовуй `page.on()` щоб почати і `page.off()` щоб зупинити, передаючи ту саму функцію. Playwright прибирає після тесту, але обмеження в межах тесту покращує читаність.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to verify the API response status after a form submission. Which is the correct approach?",
        uk: "Хочеш перевірити статус API-відповіді після відправки форми. Який правильний підхід?",
      },
      options: [
        { id: "a", label: { en: "After clicking submit, call `page.waitForResponse('/api/orders')` and check `.status()`.", uk: "Після кліку submit викликати `page.waitForResponse('/api/orders')` і перевірити `.status()`." } },
        { id: "b", label: { en: "Before clicking submit, create `const resPromise = page.waitForResponse('/api/orders')`, click submit, then `const res = await resPromise` and check `res.status()`.", uk: "До кліку submit створити `const resPromise = page.waitForResponse('/api/orders')`, клікнути submit, потім `const res = await resPromise` і перевірити `res.status()`." } },
        { id: "c", label: { en: "Use `page.on('response', res => ...)` and store the status in a variable.", uk: "Використати `page.on('response', res => ...)` і зберегти статус у змінній." } },
        { id: "d", label: { en: "Use `page.evaluate(() => fetch('/api/orders').then(r => r.status))`.", uk: "Використати `page.evaluate(() => fetch('/api/orders').then(r => r.status))`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The setup-before-trigger pattern applies here too: create the `waitForResponse` promise before the click so the listener is in place, trigger the action, then await. `waitForResponse` accepts a URL string, URL pattern, or predicate function and resolves to the `Response` object for inspection.",
        uk: "Патерн «встанови-до-тригеру» застосовується і тут: створюй `waitForResponse` проміс до кліку щоб слухач вже був, тригерни дію, потім очікуй. `waitForResponse` приймає рядок URL, патерн URL або predicate-функцію і резолвиться об'єктом `Response` для перевірки.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "A popup window opens when a payment button is clicked. Which event and object should you wait for?",
        uk: "Спливаюче вікно відкривається при кліку кнопки оплати. Яку подію і на якому об'єкті очікувати?",
      },
      options: [
        { id: "a", label: { en: "`context.waitForEvent('page')` — popups are new pages in the context.", uk: "`context.waitForEvent('page')` — popups це нові сторінки в контексті." } },
        { id: "b", label: { en: "`page.waitForEvent('popup')` — the popup was opened by this page.", uk: "`page.waitForEvent('popup')` — popup відкритий цією сторінкою." } },
        { id: "c", label: { en: "`browser.waitForEvent('window')` — windows are tracked on the browser object.", uk: "`browser.waitForEvent('window')` — вікна відстежуються на об'єкті browser." } },
        { id: "d", label: { en: "`page.waitForEvent('newpage')` — this event fires for all new windows.", uk: "`page.waitForEvent('newpage')` — ця подія спрацьовує для всіх нових вікон." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A payment popup triggered by a button click on the current page is a popup — use `page.waitForEvent('popup')`. The returned `Page` object is the popup. Set up the promise before clicking: `const popupPromise = page.waitForEvent('popup'); await page.getByRole('button', { name: 'Pay now' }).click(); const popup = await popupPromise;`",
        uk: "Платіжний popup запущений кнопкою на поточній сторінці — це popup, використовуй `page.waitForEvent('popup')`. Повернений об'єкт `Page` і є popup. Встанови проміс до кліку: `const popupPromise = page.waitForEvent('popup'); await page.getByRole('button', { name: 'Pay now' }).click(); const popup = await popupPromise;`",
      },
    },
  ],
}
