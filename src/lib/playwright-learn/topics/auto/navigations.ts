import type { PlaywrightTopic } from "../../types"

export const navigationsTopic: PlaywrightTopic = {
  slug: "navigations",
  groupId: "guides",
  order: 260,
  level: "beginner",
  trackOrder: 8,
  sourceDoc: "navigations.md",
  officialDocsUrl: "https://playwright.dev/docs/navigations",
  title: {
    en: "Navigations",
    uk: "Навігація",
  },
  summary: {
    en: "page.goto() waits for the page to load. For anything beyond that — buttons that redirect, URL changes after form submit — there are waitForURL and load state options.",
    uk: "page.goto() чекає завантаження сторінки. Для всього іншого — кнопки що редиректять, зміни URL після сабміту — є waitForURL і параметри стану завантаження.",
  },
  sections: [
    {
      id: "basic-navigation",
      title: {
        en: "goto() and load states",
        uk: "goto() і стани завантаження",
      },
      paragraphs: [
        {
          en: "`page.goto(url)` navigates and waits for the `load` event by default — meaning all resources (scripts, styles, images) have loaded. For most tests this is the right default. For SPAs that load data after mount, `load` may complete before the data is visible — but that's fine because Playwright's locators wait for elements to appear anyway.",
          uk: "`page.goto(url)` переходить і чекає події `load` за замовчуванням — це означає що всі ресурси (скрипти, стилі, зображення) завантажені. Для більшості тестів це правильне значення за замовчуванням. Для SPA що завантажують дані після mount — `load` може завершитися до того як дані видимі, але це не проблема бо локатори Playwright все одно чекають появи елементів.",
        },
        {
          en: "If `load` takes too long (heavy page with images/iframes), use `waitUntil: 'domcontentloaded'` to wait only for the HTML to parse. Or `waitUntil: 'networkidle'` if you need to wait for all async requests to complete (use sparingly — it's slow).",
          uk: "Якщо `load` займає надто довго (важка сторінка з зображеннями/iframe), використовуй `waitUntil: 'domcontentloaded'` щоб чекати лише парсингу HTML. Або `waitUntil: 'networkidle'` якщо треба дочекатися всіх async запитів (використовуй рідко — це повільно).",
        },
      ],
      codeBlocks: [
        {
          id: "goto-examples",
          language: "ts",
          code: `// Звичайний перехід — чекає load event
await page.goto('/orders')

// Тільки HTML — без зображень і скриптів
await page.goto('/orders', { waitUntil: 'domcontentloaded' })

// Чекає поки мережа заспокоїться (немає запитів 500ms)
await page.goto('/dashboard', { waitUntil: 'networkidle' })

// Одразу — не чекає нічого (рідко потрібно)
await page.goto('/orders', { waitUntil: 'commit' })`,
        },
      ],
    },
    {
      id: "waiting-for-navigation",
      title: {
        en: "Waiting for URL changes",
        uk: "Очікування зміни URL",
      },
      diagram: {
        mermaid: `sequenceDiagram
  participant T as Test
  participant P as Page
  participant S as Server
  T->>P: page.goto('/login')
  P->>S: GET /login
  S-->>P: HTML loaded (load event)
  T->>P: click 'Sign in'
  P->>S: POST /auth
  S-->>P: 302 redirect → /dashboard
  T->>P: waitForURL('/dashboard')
  P-->>T: navigation complete ✓`,
        caption: {
          en: "After a click that triggers redirect, call waitForURL() to wait for the new URL before asserting page content",
          uk: "Після кліку що запускає редирект — викличте waitForURL() щоб дочекатися нового URL перш ніж перевіряти вміст",
        },
      },
      paragraphs: [
        {
          en: "When a button click triggers a redirect, Playwright doesn't automatically wait for the navigation to complete before the next line runs. Use `waitForURL` to assert you've arrived at the expected URL — or to wait for the redirect before doing anything else.",
          uk: "Коли клік по кнопці запускає редирект — Playwright автоматично не чекає завершення навігації перед наступним рядком. Використовуй `waitForURL` щоб перевірити що ти потрапив на очікуваний URL — або дочекатися редиректу перш ніж робити щось далі.",
        },
        {
          en: "I use `waitForURL` after form submissions and login flows — it's the most readable way to assert a successful redirect.",
          uk: "Я використовую `waitForURL` після сабмітів форм і логін-флоу — це найчитабельніший спосіб перевірити успішний редирект.",
        },
      ],
      codeBlocks: [
        {
          id: "wait-url-examples",
          language: "ts",
          code: `test('login redirects to dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // Чекаємо редиректу на dashboard
  await page.waitForURL('/dashboard')

  // Або з glob патерном
  await page.waitForURL('**/dashboard')
})

test('order submission redirects to confirmation', async ({ page }) => {
  await page.goto('/orders/new')
  await page.getByLabel('Item').fill('Laptop')
  await page.getByRole('button', { name: 'Submit' }).click()

  // URL може бути /orders/123/confirmation
  await page.waitForURL(/\/orders\/\d+\/confirmation/)
  await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "hydration-issue",
      title: {
        en: "The hydration trap",
        uk: "Пастка гідратації",
      },
      paragraphs: [
        {
          en: "This is a subtle bug that trips people up: the page renders a button (SSR), Playwright clicks it immediately, but the React/Vue/Svelte code hasn't hydrated yet so the click handler doesn't exist. The click does nothing. The test fails with a mysterious \"element not found\" or just the wrong state.",
          uk: "Це тонкий баг що плутає людей: сторінка рендерить кнопку (SSR), Playwright клікає одразу, але код React/Vue/Svelte ще не гідратував тому обробника кліку не існує. Клік нічого не робить. Тест падає з незрозумілим \"element not found\" або просто неправильним станом.",
        },
        {
          en: "The fix belongs to the app, not the test: disable interactive elements until hydration completes. In tests, you can work around it by waiting for a signal that hydration is done — like a specific element that only appears after client-side JS runs.",
          uk: "Виправлення — у застосунку, а не в тесті: вимикати інтерактивні елементи поки гідратація не завершиться. У тестах можна обійти через очікування сигналу про завершення гідратації — наприклад специфічного елемента що з'являється тільки після виконання клієнтського JS.",
        },
      ],
      codeBlocks: [
        {
          id: "hydration-workaround",
          language: "ts",
          code: `// Якщо застосунок показує loader під час гідратації
test('dashboard loads after hydration', async ({ page }) => {
  await page.goto('/dashboard')

  // Чекаємо поки loader зникне — сигнал що JS виконався
  await page.getByTestId('loading-spinner').waitFor({ state: 'hidden' })

  // Тепер безпечно взаємодіяти
  await page.getByRole('button', { name: 'Create order' }).click()
})`,
        },
      ],
    },
    {
      id: "back-forward",
      title: {
        en: "Browser history navigation",
        uk: "Навігація через історію браузера",
      },
      paragraphs: [
        {
          en: "For testing browser back/forward behavior — like \"does clicking back restore the filter state\" — Playwright has `page.goBack()` and `page.goForward()`.",
          uk: "Для тестування поведінки кнопок назад/вперед браузера — наприклад \"чи відновлює клік назад стан фільтру\" — у Playwright є `page.goBack()` і `page.goForward()`.",
        },
      ],
      codeBlocks: [
        {
          id: "history-examples",
          language: "ts",
          code: `test('back button restores order list filter', async ({ page }) => {
  await page.goto('/orders')
  await page.getByRole('combobox', { name: 'Status' }).selectOption('pending')

  // Перейшли до конкретного замовлення
  await page.getByRole('row').first().getByRole('link').click()
  await page.waitForURL(/\/orders\/\d+/)

  // Повертаємося назад
  await page.goBack()
  await page.waitForURL('/orders')

  // Фільтр має зберегтися
  await expect(page.getByRole('combobox', { name: 'Status' }))
    .toHaveValue('pending')
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "After clicking a Submit button, the app redirects to /orders/123/confirmation. What should you add after the click?",
        uk: "Після кліку Submit, застосунок перенаправляє на /orders/123/confirmation. Що треба додати після кліку?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.waitForTimeout(2000) to wait for redirect",
            uk: "await page.waitForTimeout(2000) щоб дочекатися редиректу",
          },
        },
        {
          id: "b",
          label: {
            en: "await page.waitForURL(/\\/orders\\/\\d+\\/confirmation/) to wait for the specific URL",
            uk: "await page.waitForURL(/\\/orders\\/\\d+\\/confirmation/) щоб дочекатися конкретного URL",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.reload() and then check the URL",
            uk: "await page.reload() і потім перевірити URL",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`waitForURL` with a regex waits until the page URL matches the pattern — it's precise and readable. `waitForTimeout` is a hardcoded delay that makes tests slow and flaky. `reload` defeats the purpose of testing the redirect.",
        uk: "`waitForURL` з regex чекає поки URL сторінки збіжиться з патерном — точно і читабельно. `waitForTimeout` — це хардкодна затримка що робить тести повільними і нестабільними. `reload` нівелює сенс тестування редиректу.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is the default `waitUntil` value when you call `page.goto(url)` with no options?",
        uk: "Яке значення `waitUntil` за замовчуванням при виклику `page.goto(url)` без опцій?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "'networkidle' — waits until there are no more than 0 network connections for 500ms.",
            uk: "'networkidle' — чекає поки не залишиться жодного мережевого з'єднання протягом 500мс.",
          },
        },
        {
          id: "b",
          label: {
            en: "'domcontentloaded' — waits only for the HTML to parse.",
            uk: "'domcontentloaded' — чекає лише парсингу HTML.",
          },
        },
        {
          id: "c",
          label: {
            en: "'load' — waits for the page load event, meaning all resources have loaded.",
            uk: "'load' — чекає події load сторінки, тобто всі ресурси завантажені.",
          },
        },
        {
          id: "d",
          label: {
            en: "'commit' — returns immediately after the response headers are received.",
            uk: "'commit' — повертається одразу після отримання заголовків відповіді.",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "By default `page.goto()` waits for the browser's `load` event, which fires when all resources (scripts, stylesheets, images) have finished loading. For most tests this is the right default. Use `'domcontentloaded'` for faster navigation on heavy pages, `'networkidle'` when you need to wait for all async XHR/fetch requests (slow — use sparingly), or `'commit'` when you only need the response headers.",
        uk: "За замовчуванням `page.goto()` чекає на подію `load` браузера, яка спрацьовує коли всі ресурси (скрипти, стилі, зображення) завершили завантаження. Для більшості тестів це правильне значення за замовчуванням. Використовуй `'domcontentloaded'` для швидшої навігації на важких сторінках, `'networkidle'` коли треба дочекатися всіх async XHR/fetch запитів (повільно — використовуй рідко) або `'commit'` коли потрібні лише заголовки відповіді.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the difference between `waitUntil: 'load'` and `waitUntil: 'networkidle'`?",
        uk: "У чому різниця між `waitUntil: 'load'` і `waitUntil: 'networkidle'`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are identical — both wait for all network activity to finish.",
            uk: "Вони однакові — обидва чекають завершення всієї мережевої активності.",
          },
        },
        {
          id: "b",
          label: {
            en: "'load' waits for the browser's load event (all initial resources); 'networkidle' additionally waits until there are no open network connections for 500ms, catching late async requests.",
            uk: "'load' чекає події load браузера (всі початкові ресурси); 'networkidle' додатково чекає поки не буде відкритих мережевих з'єднань протягом 500мс, захоплюючи пізні async запити.",
          },
        },
        {
          id: "c",
          label: {
            en: "'networkidle' is faster than 'load' because it does not wait for images.",
            uk: "'networkidle' швидший за 'load' бо не чекає зображень.",
          },
        },
        {
          id: "d",
          label: {
            en: "'load' only applies to initial page loads; 'networkidle' works for SPAs.",
            uk: "'load' застосовується лише до початкових завантажень сторінки; 'networkidle' працює для SPA.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`'load'` resolves when the browser fires its built-in `load` event — all synchronous resources are done. `'networkidle'` goes further: it waits until there are no open network connections for at least 500ms, which catches async API calls made after initial load. `'networkidle'` is useful but can be slow on pages with polling or analytics — prefer it only when you specifically need to wait for late requests.",
        uk: "`'load'` завершується коли браузер генерує вбудовану подію `load` — всі синхронні ресурси завантажені. `'networkidle'` іде далі: чекає поки не буде відкритих мережевих з'єднань принаймні 500мс, що захоплює async API виклики зроблені після початкового завантаження. `'networkidle'` корисний але може бути повільним на сторінках з polling або аналітикою — використовуй лише коли конкретно треба чекати пізніх запитів.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does `waitUntil: 'commit'` mean in a `page.goto()` call?",
        uk: "Що означає `waitUntil: 'commit'` у виклику `page.goto()`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Playwright waits for all JavaScript to execute before returning.",
            uk: "Playwright чекає виконання всього JavaScript перш ніж повернутися.",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright returns as soon as the response headers are received, before the HTML body is parsed.",
            uk: "Playwright повертається як тільки отримані заголовки відповіді, до парсингу тіла HTML.",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright commits the current browser state to disk and then navigates.",
            uk: "Playwright зберігає поточний стан браузера на диск і потім переходить.",
          },
        },
        {
          id: "d",
          label: {
            en: "Playwright waits for the DOM to be fully interactive.",
            uk: "Playwright чекає поки DOM стане повністю інтерактивним.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`'commit'` is the earliest possible wait state — Playwright resolves the `goto()` promise as soon as the HTTP response headers arrive and the browser has committed to the navigation (started loading the new URL). The HTML body has not been parsed yet. This is rarely needed but useful when you only care about the response status code or headers, not the page content.",
        uk: "`'commit'` — це найраніший можливий стан очікування — Playwright вирішує promise `goto()` як тільки прийшли HTTP заголовки відповіді і браузер взяв зобов'язання навігації (почав завантажувати новий URL). Тіло HTML ще не розібране. Рідко потрібно але корисно коли тебе цікавить лише код статусу відповіді або заголовки, а не вміст сторінки.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you test that clicking the browser's back button restores the previous page state?",
        uk: "Як перевірити що клік по кнопці 'назад' браузера відновлює попередній стан сторінки?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.goto('javascript:history.back()')",
            uk: "await page.goto('javascript:history.back()')",
          },
        },
        {
          id: "b",
          label: {
            en: "await page.keyboard.press('Alt+ArrowLeft')",
            uk: "await page.keyboard.press('Alt+ArrowLeft')",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.goBack() — Playwright's built-in method for browser back navigation.",
            uk: "await page.goBack() — вбудований метод Playwright для навігації назад у браузері.",
          },
        },
        {
          id: "d",
          label: {
            en: "await page.reload() — reloading simulates going back.",
            uk: "await page.reload() — перезавантаження симулює повернення назад.",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`page.goBack()` triggers the browser's native back navigation, equivalent to the user clicking the back button. It returns a Response object and waits for the navigation to complete. Use it to test that filter state, scroll position or form data is preserved when navigating back. `page.reload()` reloads the current page — it does not go back in history.",
        uk: "`page.goBack()` запускає нативну навігацію браузера назад, еквівалентно до того як користувач натискає кнопку назад. Повертає об'єкт Response і чекає завершення навігації. Використовуй для перевірки того, що стан фільтру, позиція прокрутки або дані форми зберігаються при навігації назад. `page.reload()` перезавантажує поточну сторінку — не повертається в історії.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "A button click triggers a client-side redirect. Which is the correct way to wait for the navigation to complete?",
        uk: "Клік по кнопці запускає клієнтський редирект. Який правильний спосіб дочекатися завершення навігації?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.click('#submit'); await page.waitForTimeout(1000);",
            uk: "await page.click('#submit'); await page.waitForTimeout(1000);",
          },
        },
        {
          id: "b",
          label: {
            en: "await Promise.all([page.waitForNavigation(), locator.click()]);",
            uk: "await Promise.all([page.waitForNavigation(), locator.click()]);",
          },
        },
        {
          id: "c",
          label: {
            en: "await locator.click(); await page.waitForURL('/expected-path');",
            uk: "await locator.click(); await page.waitForURL('/expected-path');",
          },
        },
        {
          id: "d",
          label: {
            en: "await locator.click(); await page.reload();",
            uk: "await locator.click(); await page.reload();",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The modern Playwright pattern is to click first, then `await page.waitForURL('/expected-path')`. `waitForURL` retries until the URL matches, which cleanly handles the async redirect. The old `Promise.all([page.waitForNavigation(), locator.click()])` pattern is deprecated in favor of `waitForURL`. Hardcoded `waitForTimeout` is fragile and should be avoided.",
        uk: "Сучасний патерн Playwright — спочатку клікнути, потім `await page.waitForURL('/expected-path')`. `waitForURL` повторює поки URL не збіжиться, що чисто обробляє async редирект. Старий патерн `Promise.all([page.waitForNavigation(), locator.click()])` застарів на користь `waitForURL`. Хардкодний `waitForTimeout` є крихким і його слід уникати.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you assert that the current page URL matches `/dashboard` using Playwright's web-first assertions?",
        uk: "Як перевірити що поточний URL сторінки збігається з `/dashboard` використовуючи web-first ассерції Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "assert(page.url() === '/dashboard')",
            uk: "assert(page.url() === '/dashboard')",
          },
        },
        {
          id: "b",
          label: {
            en: "expect(page.url()).toBe('/dashboard')",
            uk: "expect(page.url()).toBe('/dashboard')",
          },
        },
        {
          id: "c",
          label: {
            en: "await expect(page).toHaveURL('/dashboard')",
            uk: "await expect(page).toHaveURL('/dashboard')",
          },
        },
        {
          id: "d",
          label: {
            en: "await page.assertURL('/dashboard')",
            uk: "await page.assertURL('/dashboard')",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`await expect(page).toHaveURL('/dashboard')` is the web-first assertion for URL checking. It auto-retries until the URL matches — important because navigation may take a moment. `page.url()` returns the current URL as a string synchronously, so `expect(page.url()).toBe(...)` checks only the current instant without retrying. `page.assertURL()` is not a real API.",
        uk: "`await expect(page).toHaveURL('/dashboard')` — це web-first ассерція для перевірки URL. Вона авто-повторює поки URL не збіжиться — важливо бо навігація може зайняти мить. `page.url()` повертає поточний URL як рядок синхронно, тому `expect(page.url()).toBe(...)` перевіряє лише поточний момент без повторів. `page.assertURL()` — не реальний API.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What is the 'hydration trap' described in the article, and what is the recommended fix?",
        uk: "Що таке 'пастка гідратації' описана в статті, і яке рекомендоване виправлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The page runs out of memory during hydration. Fix: increase the browser memory limit.",
            uk: "Сторінка вичерпує пам'ять під час гідратації. Виправлення: збільшити ліміт пам'яті браузера.",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright clicks a server-rendered element before React/Vue/Svelte has hydrated it, so the click handler doesn't exist yet and nothing happens. Fix: the app should disable interactive elements until hydration completes.",
            uk: "Playwright клікає server-рендерений елемент до того як React/Vue/Svelte гідратував його, тому обробник кліку ще не існує і нічого не відбувається. Виправлення: застосунок повинен вимикати інтерактивні елементи поки гідратація не завершиться.",
          },
        },
        {
          id: "c",
          label: {
            en: "The test loses its session cookie during page hydration. Fix: re-authenticate in `test.beforeEach`.",
            uk: "Тест втрачає сесійну cookie під час гідратації сторінки. Виправлення: повторно автентифікуватися в `test.beforeEach`.",
          },
        },
        {
          id: "d",
          label: {
            en: "Hydration causes a race condition in Playwright's locator engine. Fix: use `--slowMo` flag.",
            uk: "Гідратація спричиняє гонку в рушії локаторів Playwright. Виправлення: використати прапорець `--slowMo`.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The hydration trap is a real and subtle bug: SSR renders the HTML including buttons, and Playwright can see and click them immediately. But the JavaScript framework hasn't run yet, so the click handler is missing — the click does nothing and the test mysteriously fails. The article notes the fix belongs to the app (disable elements until hydration), with a test-side workaround of waiting for a hydration signal element to appear before interacting.",
        uk: "Пастка гідратації — це реальний і тонкий баг: SSR рендерить HTML включаючи кнопки, і Playwright може бачити і клікати їх одразу. Але JavaScript фреймворк ще не виконався, тому обробник кліку відсутній — клік нічого не робить і тест загадково падає. Стаття зазначає що виправлення належить застосунку (вимикати елементи до гідратації), з обхідним шляхом на стороні тесту — чекати поки з'явиться сигнальний елемент гідратації перш ніж взаємодіяти.",
      },
    },
  ],
}
