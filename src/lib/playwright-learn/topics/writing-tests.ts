import type { PlaywrightTopic } from "../types"

export const writingTestsTopic: PlaywrightTopic = {
  slug: "writing-tests",
  groupId: "writing-tests",
  order: 20,
  level: "beginner",
  trackOrder: 3,
  sourceDoc: "writing-tests-js.md",
  officialDocsUrl: "https://playwright.dev/docs/writing-tests",
  title: {
    en: "Writing your first tests",
    uk: "Як писати перші тести",
  },
  summary: {
    en: "test() blocks, locators, web-first expect assertions, and the page fixture.",
    uk: "Блок test(), локатори, web-first ассерції expect і фікстура page.",
  },
  sections: [
    {
      id: "anatomy",
      title: { en: "Anatomy of a test", uk: "Будова тесту" },
      paragraphs: [
        {
          en: "A test is a function passed to `test('name', async ({ page }) => { ... })`. Playwright injects fixtures (page, context, request, …) into the destructured argument. Each test gets a fresh isolated browser context, so there is no shared cookie or storage pollution between tests by default.",
          uk: "Тест — це функція в `test('name', async ({ page }) => { ... })`. Playwright інжектить фікстури (page, context, request, …) у деструктурований аргумент. Кожен тест отримує свіжий ізольований браузерний контекст — без спільних кук і storage між тестами.",
        },
      ],
      codeBlocks: [
        {
          id: "basic",
          language: "ts",
          code: `import { test, expect } from '@playwright/test'

test('homepage has title and CTA', async ({ page }) => {
  await page.goto('https://playwright.dev/')

  await expect(page).toHaveTitle(/Playwright/)
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "locators",
      title: { en: "Locators", uk: "Локатори" },
      paragraphs: [
        {
          en: "Locators are how Playwright finds elements. Prefer user-facing locators: getByRole, getByLabel, getByText, getByPlaceholder, getByAltText, getByTitle. They are auto-waiting and re-resolving: every action retries until the locator points to exactly one actionable element or the timeout is reached.",
          uk: "Локатори — це спосіб Playwright знаходити елементи. Перевага у user-facing варіантів: getByRole, getByLabel, getByText, getByPlaceholder, getByAltText, getByTitle. Локатори auto-waiting та re-resolving: кожна дія повторюється, доки локатор не вкаже саме на один інтерактивний елемент або не вийде таймаут.",
        },
        {
          en: "Use CSS or XPath only when there is no semantic alternative. Locators chain: page.getByRole('list').getByRole('listitem').nth(0).",
          uk: "CSS чи XPath варто залишити на випадки, коли семантичного варіанта немає. Локатори ланцюгуються: page.getByRole('list').getByRole('listitem').nth(0).",
        },
      ],
      codeBlocks: [
        {
          id: "loc-examples",
          language: "ts",
          code: `await page.getByRole('button', { name: 'Sign in' }).click()
await page.getByLabel('Email').fill('user@example.com')
await page.getByPlaceholder('Search').press('Enter')
await page.getByText('Welcome', { exact: false }).waitFor()`,
        },
      ],
    },
    {
      id: "assertions",
      title: { en: "Web-first assertions", uk: "Web-first ассерції" },
      paragraphs: [
        {
          en: "expect() from @playwright/test auto-retries until the assertion passes or the assertion timeout expires. This removes most manual waitFor calls and the dreaded sleep(...). Prefer assertions like toBeVisible, toHaveText, toHaveURL over checking DOM state immediately.",
          uk: "expect() з @playwright/test авто-ретраїть, поки ассерція не пройде або не вичерпається таймаут. Це прибирає більшість ручних waitFor та сумнозвісний sleep(...). Краще писати toBeVisible, toHaveText, toHaveURL замість миттєвої перевірки DOM.",
        },
      ],
      codeBlocks: [
        {
          id: "expects",
          language: "ts",
          code: `await expect(page.getByRole('alert')).toHaveText('Saved')
await expect(page).toHaveURL(/\\/dashboard$/)
await expect(page.getByTestId('cart-count')).toHaveText('3')`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Which locator should you reach for FIRST when targeting a button labelled “Sign in”?",
        uk: "Який локатор обрати ПЕРШИМ для кнопки з текстом «Sign in»?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.locator('button.signin')",
            uk: "page.locator('button.signin')",
          },
        },
        {
          id: "b",
          label: {
            en: "page.getByRole('button', { name: 'Sign in' })",
            uk: "page.getByRole('button', { name: 'Sign in' })",
          },
        },
        {
          id: "c",
          label: {
            en: "page.$('//button[contains(., \"Sign in\")]')",
            uk: "page.$('//button[contains(., \"Sign in\")]')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright recommends user-facing role-based locators because they survive CSS refactors and match how assistive tech sees the page. CSS and XPath are last-resort fallbacks.",
        uk: "Playwright радить user-facing role-локатори: вони переживають рефакторинги CSS і збігаються з тим, як сторінку бачать асистивні технології. CSS і XPath — останній варіант.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What does `await expect(locator).toBeVisible()` do?",
        uk: "Що робить `await expect(locator).toBeVisible()`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Checks once immediately and throws if the element is not visible right now.",
            uk: "Перевіряє одразу один раз і кидає помилку, якщо елемент не видимий саме зараз.",
          },
        },
        {
          id: "b",
          label: {
            en: "Polls until the element becomes visible or the assertion timeout is reached.",
            uk: "Опитує, доки елемент не стане видимим або не вичерпається таймаут.",
          },
        },
        {
          id: "c",
          label: {
            en: "Sleeps for 5 seconds and then checks visibility.",
            uk: "Спить 5 секунд і потім перевіряє видимість.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "expect from @playwright/test is web-first — assertions auto-retry until they pass or the timeout fires. That is why hardcoded waits are not needed in well-written tests.",
        uk: "expect із @playwright/test є web-first — ассерції повторюються, доки не пройдуть, або поки не спрацює таймаут. Тому жорсткі sleep’и у нормальних тестах не потрібні.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Why does each test get its own browser context by default?",
        uk: "Чому кожен тест за замовчуванням отримує власний browser context?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "To make tests slower so they appear thorough.",
            uk: "Щоб тести виглядали ретельнішими через повільність.",
          },
        },
        {
          id: "b",
          label: {
            en: "To isolate cookies, storage and permissions so tests don’t affect each other.",
            uk: "Щоб ізолювати куки, storage та дозволи — тести не впливають один на одного.",
          },
        },
        {
          id: "c",
          label: {
            en: "Because Playwright cannot reuse browser contexts across tests.",
            uk: "Бо Playwright нібито не вміє перевикористовувати browser context.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Fresh BrowserContexts per test give isolation (cookies, localStorage, permissions, service workers) which makes parallel execution safe and reproducible. Contexts are cheap so this is also fast.",
        uk: "Свіжий BrowserContext на тест дає ізоляцію (куки, localStorage, дозволи, service worker’и). Це робить паралельний запуск безпечним і відтворюваним; контексти дешеві, тож це ще й швидко.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What is `test.describe` used for?",
        uk: "Для чого використовується `test.describe`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "To mark a test as skipped and add a description of why.",
            uk: "Щоб позначити тест як пропущений і додати опис чому.",
          },
        },
        {
          id: "b",
          label: {
            en: "To group related tests together under a shared name, enabling scoped hooks and better reporting.",
            uk: "Щоб згрупувати пов’язані тести під спільною назвою, що дозволяє scoped хуки і кращу звітність.",
          },
        },
        {
          id: "c",
          label: {
            en: "To run a single test in isolation from the rest of the suite.",
            uk: "Щоб запустити один тест ізольовано від решти сьюту.",
          },
        },
        {
          id: "d",
          label: {
            en: "To add a description string to an assertion error message.",
            uk: "Щоб додати рядок опису до повідомлення про помилку ассерції.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.describe(‘name’, () => { ... })` groups related tests under a logical name. This improves readability in reports and allows `test.beforeEach` / `test.afterEach` hooks declared inside the block to apply only to tests in that group — not to the whole file.",
        uk: "`test.describe(‘name’, () => { ... })` групує пов’язані тести під логічною назвою. Це покращує читабельність у звітах і дозволяє хукам `test.beforeEach` / `test.afterEach` оголошеним всередині блоку застосовуватися лише до тестів цієї групи — а не до всього файлу.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "Where should you put repeated setup steps (like navigating to a page) that every test in a file needs?",
        uk: "Куди треба помістити повторювані кроки налаштування (наприклад перехід на сторінку) що потрібні кожному тесту у файлі?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Copy them into each test — there is no way to share setup code.",
            uk: "Скопіювати їх у кожен тест — немає способу ділитися кодом налаштування.",
          },
        },
        {
          id: "b",
          label: {
            en: "Put them in a `test.beforeAll` block so they run once for the whole file.",
            uk: "Помістити їх у блок `test.beforeAll` щоб вони виконалися один раз для всього файлу.",
          },
        },
        {
          id: "c",
          label: {
            en: "Put them in a `test.beforeEach` block so they run automatically before every test.",
            uk: "Помістити їх у блок `test.beforeEach` щоб вони запускалися автоматично перед кожним тестом.",
          },
        },
        {
          id: "d",
          label: {
            en: "Write a helper function and call it manually at the start of each test.",
            uk: "Написати допоміжну функцію і викликати її вручну на початку кожного тесту.",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`test.beforeEach` runs the setup callback before every individual test in the current scope. It receives the same fixtures (like `page`) that the tests do, so you can navigate, authenticate or seed data once per test in a clean, DRY way. `beforeAll` runs once for the whole describe block and shares state — use it with care since it can create test interdependencies.",
        uk: "`test.beforeEach` запускає callback налаштування перед кожним окремим тестом у поточному scope. Він отримує ті самі фікстури (наприклад `page`) що й самі тести, тому можна переходити на сторінку, автентифікуватися або підготовлювати дані один раз на тест чистим DRY-способом. `beforeAll` запускається один раз для всього describe блоку і ділиться станом — використовуй з обережністю, бо може створювати залежності між тестами.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What does the `context` fixture give you, compared to the `page` fixture?",
        uk: "Що дає фікстура `context` порівняно з фікстурою `page`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It is the same as `page` — just an alias.",
            uk: "Це те саме що `page` — просто псевдонім.",
          },
        },
        {
          id: "b",
          label: {
            en: "It gives you the BrowserContext so you can open multiple pages, set cookies, or grant permissions for the whole context.",
            uk: "Він дає BrowserContext щоб відкривати кілька сторінок, встановлювати куки або надавати дозволи для всього контексту.",
          },
        },
        {
          id: "c",
          label: {
            en: "It provides access to the browser process for launching additional browser types.",
            uk: "Він надає доступ до процесу браузера для запуску додаткових типів браузерів.",
          },
        },
        {
          id: "d",
          label: {
            en: "It is only available in `test.beforeAll` blocks, not in individual tests.",
            uk: "Він доступний лише в блоках `test.beforeAll`, не в окремих тестах.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `page` fixture gives you a single browser tab. The `context` fixture gives you the underlying BrowserContext — the container that holds cookies, localStorage, permissions and service workers. You use `context` when you need to open a second page (`context.newPage()`), preset cookies before navigation, or grant geolocation permissions for the test.",
        uk: "Фікстура `page` дає тобі одну вкладку браузера. Фікстура `context` дає базовий BrowserContext — контейнер що тримає куки, localStorage, дозволи і service worker’и. `context` використовують коли треба відкрити другу сторінку (`context.newPage()`), встановити куки перед навігацією або надати дозволи геолокації для тесту.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you scope a locator search to only look inside a specific element, such as a dialog?",
        uk: "Як обмежити пошук локатора лише всередині певного елемента, наприклад діалогового вікна?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Pass a CSS ancestor selector as the second argument to every locator method.",
            uk: "Передати CSS селектор предка другим аргументом до кожного методу локатора.",
          },
        },
        {
          id: "b",
          label: {
            en: "Chain locators — call the next locator method on the parent locator instead of on `page`.",
            uk: "Ланцюгувати локатори — викликати наступний метод локатора на батьківському локаторі замість `page`.",
          },
        },
        {
          id: "c",
          label: {
            en: "Use `page.frame()` to switch context to the dialog.",
            uk: "Використати `page.frame()` щоб переключити контекст на діалог.",
          },
        },
        {
          id: "d",
          label: {
            en: "There is no way to scope a locator — all searches are always page-wide.",
            uk: "Немає способу обмежити локатор — всі пошуки завжди охоплюють всю сторінку.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Locators chain in Playwright: `page.getByRole(‘dialog’).getByRole(‘button’, { name: ‘Save’ })` first finds the dialog, then searches for the Save button only within it. This prevents accidentally matching buttons outside the dialog and makes the intent self-documenting. `page.frame()` is for iframes, not dialogs.",
        uk: "Локатори ланцюгуються у Playwright: `page.getByRole(‘dialog’).getByRole(‘button’, { name: ‘Save’ })` спочатку знаходить діалог, потім шукає кнопку Save лише всередині нього. Це запобігає випадковому збігу кнопок поза діалогом і робить намір самодокументованим. `page.frame()` — для iframe, не для діалогів.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Why does almost every Playwright action and assertion need `await`?",
        uk: "Чому майже кожна дія і ассерція Playwright потребує `await`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It is just a convention — the tests also work without `await` but produce warnings.",
            uk: "Це просто конвенція — тести також працюють без `await` але видають попередження.",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright actions return Promises; without `await` the action is queued but the test moves on immediately, so assertions run before the action completes.",
            uk: "Дії Playwright повертають Promise; без `await` дія ставиться в чергу але тест одразу рухається далі, тому ассерції виконуються до завершення дії.",
          },
        },
        {
          id: "c",
          label: {
            en: "`await` enables the auto-retry mechanism — without it, locators cannot poll the DOM.",
            uk: "`await` вмикає механізм авто-ретрай — без нього локатори не можуть опитувати DOM.",
          },
        },
        {
          id: "d",
          label: {
            en: "TypeScript requires `await` for any method that includes the word ‘async’.",
            uk: "TypeScript вимагає `await` для будь-якого методу що містить слово ‘async’.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright’s browser automation is inherently asynchronous — every action (click, fill, navigation) communicates with the browser over a protocol and returns a Promise. If you omit `await`, JavaScript schedules the action but continues to the next line immediately. This means your assertion can run before the click has finished, causing intermittent failures. Always `await` every Playwright call.",
        uk: "Автоматизація браузера у Playwright за суттю асинхронна — кожна дія (клік, fill, навігація) спілкується з браузером через протокол і повертає Promise. Якщо пропустити `await`, JavaScript планує дію але одразу переходить до наступного рядка. Це означає що ассерція може виконатися до завершення кліку, спричиняючи нестабільні падіння. Завжди вживай `await` для кожного виклику Playwright.",
      },
    },
  ],
}
