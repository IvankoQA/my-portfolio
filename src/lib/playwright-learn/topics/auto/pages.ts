import type { PlaywrightTopic } from "../../types"

export const pagesTopic: PlaywrightTopic = {
  slug: "pages",
  groupId: "guides",
  order: 275,
  level: "beginner",
  trackOrder: 18,
  sourceDoc: "pages.md",
  officialDocsUrl: "https://playwright.dev/docs/pages",
  title: {
    en: "Pages",
    uk: "Сторінки",
  },
  summary: {
    en: "One page = one browser tab. You get one automatically in every test. The tricky part is when an action opens a NEW tab or popup — you need to capture that page object before interacting with it.",
    uk: "Одна сторінка = одна вкладка браузера. В кожному тесті ти отримуєш одну автоматично. Складна частина — коли дія відкриває НОВУ вкладку або popup. Треба перехопити той page об'єкт до взаємодії з ним.",
  },
  sections: [
    {
      id: "basic-page",
      title: {
        en: "The page fixture",
        uk: "Фікстура page",
      },
      paragraphs: [
        {
          en: "In every Playwright test you get a `page` fixture automatically — it's a fresh browser tab isolated from other tests. You use it to navigate, interact, and assert. One page per test is the default and works for most scenarios.",
          uk: "У кожному Playwright тесті ти автоматично отримуєш фікстуру `page` — це свіжа ізольована вкладка браузера. Через неї навігуєш, взаємодієш і перевіряєш. Одна сторінка на тест — це дефолт і підходить для більшості сценаріїв.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-page",
          language: "ts",
          code: `test('orders page loads', async ({ page }) => {
  // page — ізольована вкладка, свіжа для кожного тесту
  await page.goto('/orders')
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
  await expect(page).toHaveURL('/orders')
  await expect(page).toHaveTitle('Orders | My App')
})`,
        },
      ],
    },
    {
      id: "new-tab-popup",
      title: {
        en: "New tabs and popups",
        uk: "Нові вкладки і popup",
      },
      diagram: {
        mermaid: `flowchart LR
  CTX["BrowserContext\n(test isolation boundary)"] --> P1["page\n(main tab)"]
  CTX --> P2["new Page\n(target=_blank link)"]
  P1 -->|"waitForEvent('page')"| P2
  P1 --> PP["popup\n(window.open)"]
  P1 -->|"waitForEvent('popup')"| PP`,
        caption: {
          en: "New tabs and popups are separate Page objects — await context.waitForEvent('page') or page.waitForEvent('popup') BEFORE clicking",
          uk: "Нові вкладки і popup — окремі Page об'єкти; очікуйте context.waitForEvent('page') або page.waitForEvent('popup') ДО кліку",
        },
      },
      paragraphs: [
        {
          en: "When a link has `target=\"_blank\"` or JavaScript calls `window.open()`, a new browser tab opens. The new tab is a separate `Page` object. The pattern: set up the promise BEFORE clicking (just like `waitForResponse` or download events), then click, then await.",
          uk: "Коли посилання має `target=\"_blank\"` або JavaScript викликає `window.open()` — відкривається нова вкладка браузера. Нова вкладка — це окремий `Page` об'єкт. Паттерн: встанови проміс ДО кліку (так само як `waitForResponse` або події завантаження), потім клікни, потім очікуй.",
        },
      ],
      codeBlocks: [
        {
          id: "new-tab",
          language: "ts",
          code: `test('order receipt opens in new tab', async ({ page, context }) => {
  await page.goto('/orders/42')

  // Встановлюємо очікування ДО кліку
  const newPagePromise = context.waitForEvent('page')

  // Клік відкриває нову вкладку
  await page.getByRole('link', { name: 'View receipt' }).click()

  // Отримуємо нову сторінку
  const receiptPage = await newPagePromise
  await receiptPage.waitForLoadState()

  // Взаємодіємо з новою вкладкою нормально
  await expect(receiptPage).toHaveURL(/\/receipts\/\d+/)
  await expect(receiptPage.getByRole('heading', { name: 'Receipt' })).toBeVisible()
})`,
        },
        {
          id: "popup",
          language: "ts",
          code: `test('payment gateway opens in popup', async ({ page }) => {
  await page.goto('/checkout')

  // waitForEvent('popup') — для popup вікон (не нових вкладок)
  const popupPromise = page.waitForEvent('popup')

  await page.getByRole('button', { name: 'Pay now' }).click()

  const popup = await popupPromise
  await popup.waitForLoadState()

  // Взаємодіємо з popup
  await popup.getByLabel('Card number').fill('4242424242424242')
  await popup.getByRole('button', { name: 'Pay' }).click()
})`,
        },
      ],
    },
    {
      id: "multiple-pages",
      title: {
        en: "Multiple pages in one test",
        uk: "Кілька сторінок в одному тесті",
      },
      paragraphs: [
        {
          en: "Sometimes you need multiple tabs in one test — for example, testing that changes made in one tab appear in another (real-time sync). Create pages from `context` directly.",
          uk: "Іноді потрібні кілька вкладок в одному тесті — наприклад тестування що зміни в одній вкладці відображаються в іншій (real-time синхронізація). Створюй сторінки прямо з `context`.",
        },
      ],
      codeBlocks: [
        {
          id: "multiple-pages",
          language: "ts",
          code: `test('order update syncs between tabs', async ({ context }) => {
  // Відкриваємо дві вкладки в одному контексті (одна сесія)
  const adminTab = await context.newPage()
  const viewerTab = await context.newPage()

  await adminTab.goto('/orders/42')
  await viewerTab.goto('/orders/42')

  // Адмін оновлює статус
  await adminTab.getByRole('combobox', { name: 'Status' }).selectOption('shipped')
  await adminTab.getByRole('button', { name: 'Save' }).click()

  // Viewer бачить зміну (якщо є WebSocket або polling)
  await viewerTab.reload()
  await expect(viewerTab.getByTestId('status-badge')).toContainText('Shipped')
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A button click opens a new browser tab. How do you get a reference to that new tab?",
        uk: "Клік по кнопці відкриває нову вкладку браузера. Як отримати посилання на нову вкладку?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.newPage() — creates a new page handle",
            uk: "await page.newPage() — створює новий page handle",
          },
        },
        {
          id: "b",
          label: {
            en: "Set up context.waitForEvent('page') BEFORE clicking, then await after the click",
            uk: "Встановити context.waitForEvent('page') ДО кліку, потім очікувати після кліку",
          },
        },
        {
          id: "c",
          label: {
            en: "context.pages()[1] — get the second page from the context pages list",
            uk: "context.pages()[1] — отримати другу сторінку зі списку сторінок контексту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The new page event fires when the tab opens. If you call `context.pages()[1]` or `waitForEvent` AFTER clicking, the event might have already fired and you'll miss it. Set up the listener first, then click. `page.newPage()` doesn't exist on page — that's a `context` method for creating pages programmatically (not for intercepting user-opened tabs).",
        uk: "Подія нової сторінки спрацьовує коли вкладка відкривається. Якщо викликати `context.pages()[1]` або `waitForEvent` ПІСЛЯ кліку — подія вже могла спрацювати і ти її пропустиш. Встанови слухача спочатку, потім клікни. `page.newPage()` не існує на page — це метод `context` для програматичного створення сторінок (не для перехоплення відкритих користувачем вкладок).",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Why must you set up context.waitForEvent('page') BEFORE clicking the link, not after?",
        uk: "Чому потрібно налаштувати context.waitForEvent('page') ДО кліку по посиланню, а не після?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Because waitForEvent creates the new tab; the click alone can't open a new tab",
            uk: "Тому що waitForEvent створює нову вкладку; сам клік не може відкрити нову вкладку",
          },
        },
        {
          id: "b",
          label: {
            en: "Because the 'page' event fires as soon as the tab opens — if you register the listener after clicking, the event may have already fired and the promise never resolves",
            uk: "Тому що подія 'page' спрацьовує одразу як вкладка відкривається — якщо зареєструвати слухача після кліку, подія вже могла спрацювати і проміс ніколи не виконається",
          },
        },
        {
          id: "c",
          label: {
            en: "Because Playwright requires all event listeners to be registered in a specific order",
            uk: "Тому що Playwright вимагає реєстрації всіх слухачів подій у певному порядку",
          },
        },
        {
          id: "d",
          label: {
            en: "Because the click needs to know where to send the new page object before it fires",
            uk: "Тому що клік має знати куди надіслати новий page об'єкт перед тим як спрацювати",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The 'page' event is emitted the instant Playwright opens the new tab. If you await the click first and only then call waitForEvent, that event has already been emitted and the awaited promise will hang forever (or until timeout). The pattern — promise setup, click, await promise — ensures the listener is registered before the event can possibly fire.",
        uk: "Подія 'page' генерується в момент коли Playwright відкриває нову вкладку. Якщо спочатку очікувати клік і лише потім викликати waitForEvent, ця подія вже була згенерована і проміс що очікується буде висіти вічно (або до таймауту). Паттерн — налаштування промісу, клік, очікування промісу — гарантує що слухач зареєстрований до того як подія може спрацювати.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the difference between page.waitForEvent('popup') and context.waitForEvent('page')?",
        uk: "В чому різниця між page.waitForEvent('popup') і context.waitForEvent('page')?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are identical — 'popup' and 'page' events are synonyms",
            uk: "Вони ідентичні — події 'popup' і 'page' є синонімами",
          },
        },
        {
          id: "b",
          label: {
            en: "page.waitForEvent('popup') listens for windows opened by window.open() from the current page; context.waitForEvent('page') listens for any new page or tab opened in the context",
            uk: "page.waitForEvent('popup') слухає вікна відкриті через window.open() з поточної сторінки; context.waitForEvent('page') слухає будь-яку нову сторінку або вкладку відкриту в контексті",
          },
        },
        {
          id: "c",
          label: {
            en: "context.waitForEvent('page') only works for tabs with target='_blank' links",
            uk: "context.waitForEvent('page') працює тільки для вкладок з посиланнями target='_blank'",
          },
        },
        {
          id: "d",
          label: {
            en: "page.waitForEvent('popup') is deprecated and should not be used in new tests",
            uk: "page.waitForEvent('popup') є застарілим і не повинен використовуватись в нових тестах",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "page.waitForEvent('popup') is scoped to a specific page and resolves with the window opened by that page's script via window.open(). context.waitForEvent('page') is broader — it resolves for any new page created in the context, whether from target='_blank' links or window.open(). Use 'popup' when you want to be precise about which page triggered the new window.",
        uk: "page.waitForEvent('popup') обмежений конкретною сторінкою і розрішується вікном відкритим скриптом тієї сторінки через window.open(). context.waitForEvent('page') ширший — він розрішується для будь-якої нової сторінки створеної в контексті, чи то від посилань target='_blank' чи то від window.open(). Використовуй 'popup' коли хочеш бути точним щодо якої сторінки ініційоване нове вікно.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does page.waitForURL('/dashboard') do?",
        uk: "Що робить page.waitForURL('/dashboard')?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Navigates the page to /dashboard",
            uk: "Навігує сторінку до /dashboard",
          },
        },
        {
          id: "b",
          label: {
            en: "Waits until the page's current URL matches '/dashboard', then resolves",
            uk: "Чекає поки поточний URL сторінки не відповідатиме '/dashboard', потім розрішується",
          },
        },
        {
          id: "c",
          label: {
            en: "Asserts that the URL is '/dashboard' and fails immediately if it isn't",
            uk: "Перевіряє що URL є '/dashboard' і одразу падає якщо це не так",
          },
        },
        {
          id: "d",
          label: {
            en: "Blocks navigation away from '/dashboard'",
            uk: "Блокує навігацію з '/dashboard'",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "page.waitForURL() returns a promise that resolves once the page URL matches the given string, pattern, or regex. It's commonly used after a click that triggers a redirect — you wait for the redirect to complete before asserting page content. It's not an assertion; for assertions use await expect(page).toHaveURL('/dashboard') which also retries.",
        uk: "page.waitForURL() повертає проміс що розрішується коли URL сторінки відповідає заданому рядку, патерну або регексу. Зазвичай використовується після кліку що викликає редирект — чекаєш поки редирект завершиться перш ніж перевіряти вміст сторінки. Це не assertion; для assertions використовуй await expect(page).toHaveURL('/dashboard') що також повторює.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does context.pages() return?",
        uk: "Що повертає context.pages()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "A promise that resolves to the list of all open pages in the context",
            uk: "Проміс що розрішується у список всіх відкритих сторінок в контексті",
          },
        },
        {
          id: "b",
          label: {
            en: "A synchronous array of all currently open Page objects in the browser context",
            uk: "Синхронний масив всіх наразі відкритих Page об'єктів в браузерному контексті",
          },
        },
        {
          id: "c",
          label: {
            en: "The total number of pages that have been opened since the context was created",
            uk: "Загальна кількість сторінок що були відкриті з моменту створення контексту",
          },
        },
        {
          id: "d",
          label: {
            en: "An array of page URLs as strings",
            uk: "Масив URL сторінок у вигляді рядків",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "context.pages() is synchronous and returns the array of Page objects that are currently open in the context. It's useful for inspecting how many tabs exist after an action, or for closing a specific tab. Be careful relying on index (e.g. context.pages()[1]) to catch a newly opened tab — if you call it before the tab opens, the array won't contain it yet.",
        uk: "context.pages() є синхронним і повертає масив Page об'єктів що наразі відкриті в контексті. Корисно для перевірки кількості вкладок після дії або для закриття конкретної вкладки. Будь обережний покладаючись на індекс (наприклад context.pages()[1]) для перехоплення щойно відкритої вкладки — якщо викликати до відкриття вкладки, масив ще не міститиме її.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You need to test real-time sync between two browser tabs (same session). What is the correct approach?",
        uk: "Потрібно протестувати real-time синхронізацію між двома вкладками браузера (одна сесія). Який правильний підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Create two separate browser contexts — each with its own page",
            uk: "Створити два окремі браузерні контексти — кожен зі своєю сторінкою",
          },
        },
        {
          id: "b",
          label: {
            en: "Create two pages from the same context using context.newPage()",
            uk: "Створити дві сторінки з одного контексту за допомогою context.newPage()",
          },
        },
        {
          id: "c",
          label: {
            en: "Open both tabs using page.goto() with the tab= query parameter",
            uk: "Відкрити обидві вкладки за допомогою page.goto() з параметром запиту tab=",
          },
        },
        {
          id: "d",
          label: {
            en: "Use page.evaluate() to programmatically open a second tab from the browser",
            uk: "Використати page.evaluate() щоб програматично відкрити другу вкладку з браузера",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Pages in the same context share the same cookies, localStorage, and session state — they act like tabs opened by the same logged-in user. Creating two pages with context.newPage() gives you two independent Page objects in the same session. Separate contexts have separate storage and sessions, so they'd behave like different users.",
        uk: "Сторінки в одному контексті спільно використовують cookies, localStorage і стан сесії — вони діють як вкладки відкриті одним залогіненим користувачем. Створення двох сторінок через context.newPage() дає два незалежних Page об'єкти в одній сесії. Окремі контексти мають окреме сховище і сесії, тому вони б поводились як різні користувачі.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "After your test opens a new tab and finishes, does Playwright automatically close it?",
        uk: "Після того як тест відкрив нову вкладку і завершився, Playwright автоматично закриває її?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "No — you must call page.close() on every tab you open, or they will leak between tests",
            uk: "Ні — треба викликати page.close() для кожної відкритої вкладки, інакше вони протікатимуть між тестами",
          },
        },
        {
          id: "b",
          label: {
            en: "Yes — Playwright tears down the entire browser context at the end of each test, closing all pages in it",
            uk: "Так — Playwright знищує весь браузерний контекст після кожного тесту, закриваючи всі сторінки в ньому",
          },
        },
        {
          id: "c",
          label: {
            en: "Only if you return the page object from the test function",
            uk: "Тільки якщо ти повертаєш page об'єкт з функції тесту",
          },
        },
        {
          id: "d",
          label: {
            en: "Only tabs opened via context.waitForEvent('page') are auto-closed; others are not",
            uk: "Тільки вкладки відкриті через context.waitForEvent('page') закриваються автоматично; інші — ні",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Each Playwright test runs in its own browser context which is fully torn down after the test — all pages in that context are closed automatically. You don't need to call page.close() for cleanup. However, calling page.close() explicitly within a test is useful when you want to simulate the user closing a tab mid-test.",
        uk: "Кожен Playwright тест виконується у власному браузерному контексті який повністю знищується після тесту — всі сторінки в цьому контексті закриваються автоматично. Не потрібно викликати page.close() для очищення. Однак явний виклик page.close() всередині тесту корисний коли хочеш симулювати закриття вкладки користувачем під час тесту.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "A page navigation triggers a redirect. How do you correctly wait for the final URL to be /dashboard?",
        uk: "Навігація сторінки викликає редирект. Як правильно зачекати фінального URL /dashboard?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.waitForTimeout(2000) then check the URL manually",
            uk: "await page.waitForTimeout(2000) а потім вручну перевірити URL",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(page).toHaveURL('/dashboard') — the assertion retries until the URL matches",
            uk: "await expect(page).toHaveURL('/dashboard') — assertion повторює поки URL не відповідатиме",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.goto('/dashboard') to force navigation there",
            uk: "await page.goto('/dashboard') щоб примусово навігувати туди",
          },
        },
        {
          id: "d",
          label: {
            en: "page.on('load', () => { assert page.url() === '/dashboard' })",
            uk: "page.on('load', () => { assert page.url() === '/dashboard' })",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "await expect(page).toHaveURL('/dashboard') is the idiomatic Playwright way — it's a locator-style assertion that retries until the current URL matches the expected value or the timeout expires. It handles redirects and client-side routing automatically. waitForTimeout is fragile, goto would navigate away from the redirect flow, and listening to 'load' events in tests is error-prone.",
        uk: "await expect(page).toHaveURL('/dashboard') — це ідіоматичний спосіб Playwright: assertion у стилі локатора що повторює поки поточний URL не відповідатиме очікуваному значенню або не спливе таймаут. Він автоматично обробляє редиректи і клієнтський роутинг. waitForTimeout є крихким, goto відвів би від потоку редиректу, а прослуховування подій 'load' в тестах є схильним до помилок.",
      },
    },
  ],
}
