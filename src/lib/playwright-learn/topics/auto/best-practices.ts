import type { PlaywrightTopic } from "../../types"

export const bestPracticesTopic: PlaywrightTopic = {
  slug: "best-practices",
  groupId: "guides",
  order: 125,
  level: "advanced",
  trackOrder: 26,
  sourceDoc: "best-practices-js.md",
  officialDocsUrl: "https://playwright.dev/docs/best-practices",
  title: {
    en: "Best Practices",
    uk: "Найкращі практики",
  },
  summary: {
    en: "A collection of rules I keep coming back to when reviewing Playwright test suites — things that make tests survive refactors, run reliably on CI, and stay readable months later.",
    uk: "Набір правил до яких я повертаюся при рев'ю тест-сьютів Playwright — те що робить тести стійкими до рефакторингу, надійними на CI і читабельними через місяці.",
  },
  sections: [
    {
      id: "test-behavior-not-implementation",
      title: {
        en: "Test what the user sees, not how it's built",
        uk: "Тестуй те що бачить користувач, не те як це зроблено",
      },
      paragraphs: [
        {
          en: "The most resilient tests click buttons by label, check text that users read, and don't care about CSS classes or component internals. When a developer renames `class=\"btn-primary\"` to `class=\"button-filled\"`, your tests shouldn't break — and they won't if you wrote them against visible behavior.",
          uk: "Найстійкіші тести клікають кнопки за підписом, перевіряють текст який бачать користувачі, і не залежать від CSS класів або внутрішнього устрою компонентів. Коли розробник перейменує `class=\"btn-primary\"` на `class=\"button-filled\"` — твої тести не повинні зламатись. І не зламаються, якщо ти писав їх на видиму поведінку.",
        },
      ],
      codeBlocks: [
        {
          id: "behavior-vs-impl",
          language: "ts",
          code: `// ❌ Крихкі локатори — ламаються при рефакторингу
await page.locator('.btn-primary.submit-order').click()
await expect(page.locator('#order-success-msg')).toBeVisible()

// ✅ Стійкі локатори — описують те що бачить користувач
await page.getByRole('button', { name: 'Оформити замовлення' }).click()
await expect(page.getByText('Замовлення прийнято')).toBeVisible()`,
        },
      ],
    },
    {
      id: "locator-priority",
      title: {
        en: "Locator priority: role > text > test-id > css",
        uk: "Пріоритет локаторів: role > text > test-id > css",
      },
      paragraphs: [
        {
          en: "Playwright recommends this order for locators, from most resilient to least:\n1. `getByRole()` — tests accessibility and behavior at once\n2. `getByText()` / `getByLabel()` — tied to visible content\n3. `getByTestId()` — stable explicit marker, add when role/text aren't enough\n4. CSS/XPath — last resort, use when nothing else works",
          uk: "Playwright рекомендує такий порядок локаторів від найстійкішого до найслабшого:\n1. `getByRole()` — перевіряє доступність і поведінку одночасно\n2. `getByText()` / `getByLabel()` — прив'язаний до видимого вмісту\n3. `getByTestId()` — стабільний явний маркер, додай коли role/text не вистачає\n4. CSS/XPath — останній варіант, коли нічого іншого не підходить",
        },
        {
          en: "When you need `getByTestId()`, agree with the dev team on a convention. I use `data-testid` as the attribute name — Playwright uses it by default, and it's easy to grep for in the codebase.",
          uk: "Коли потрібен `getByTestId()` — домовся з командою розробників про конвенцію. Я використовую `data-testid` як назву атрибута — Playwright використовує його за замовчуванням, і його легко знайти грепом по кодбейсу.",
        },
      ],
      codeBlocks: [
        {
          id: "locator-examples",
          language: "ts",
          code: `// getByRole — найкраще для інтерактивних елементів
await page.getByRole('button', { name: 'Зберегти' }).click()
await page.getByRole('link', { name: 'Замовлення' }).click()
await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com')

// getByLabel — для форм
await page.getByLabel('Пароль').fill('secret123')

// getByTestId — коли немає стабільного тексту
await page.getByTestId('order-status-badge').click()

// Ланцюжки — звужуємо до конкретної картки
const orderCard = page.getByRole('article').filter({ hasText: 'ORD-001' })
await orderCard.getByRole('button', { name: 'Деталі' }).click()`,
        },
      ],
    },
    {
      id: "isolation",
      title: {
        en: "Keep tests independent",
        uk: "Тримай тести незалежними",
      },
      paragraphs: [
        {
          en: "Each test should run correctly regardless of which tests ran before it or whether it runs in parallel. If test B relies on data that test A created, you have a hidden dependency — and when tests run in a different order, B breaks for no obvious reason.",
          uk: "Кожен тест має коректно виконуватись незалежно від того які тести були до нього або чи виконуються паралельно. Якщо тест B залежить від даних що створив тест A — це прихована залежність. Коли порядок запуску зміниться, B впаде без очевидної причини.",
        },
        {
          en: "Practical rule: if you can't run a test in isolation with `npx playwright test --grep \"test name\"` and have it pass, it's not truly isolated.",
          uk: "Практичне правило: якщо неможливо запустити тест ізольовано через `npx playwright test --grep \"назва тесту\"` і він проходить — він не є справді ізольованим.",
        },
      ],
      codeBlocks: [
        {
          id: "isolation-example",
          language: "ts",
          code: `// ❌ Тести залежать один від одного
test('create order', async ({ page }) => {
  // Створює замовлення — тест A
  await page.goto('/orders/new')
  await page.getByRole('button', { name: 'Підтвердити' }).click()
})

test('see order in list', async ({ page }) => {
  // ❌ Якщо "create order" не запустився — цей тест впаде
  await page.goto('/orders')
  await expect(page.getByRole('row')).toHaveCount(1)
})

// ✅ Кожен тест незалежний — сам створює свої дані
test('see order in list', async ({ page, request }) => {
  // Створюємо замовлення через API (швидко, без UI)
  await request.post('/api/orders', { data: { item: 'Laptop', qty: 1 } })

  await page.goto('/orders')
  await expect(page.getByRole('row')).toHaveCount(1)
})`,
        },
      ],
    },
    {
      id: "avoid-flaky-waits",
      title: {
        en: "Never hardcode waits",
        uk: "Ніколи не хардкодь затримки",
      },
      paragraphs: [
        {
          en: "`await page.waitForTimeout(2000)` is a 2-second gamble: too short on a slow CI machine, too long on a fast local machine. It makes tests slow, flaky, and hard to maintain. Playwright's auto-waiting and explicit assertions handle timing correctly — use those instead.",
          uk: "`await page.waitForTimeout(2000)` — це 2-секундна лотерея: мало для повільного CI, надто багато для швидкої локалки. Це робить тести повільними, нестабільними і важкими для підтримки. Auto-waiting і явні асерти Playwright правильно обробляють тайміни — використовуй їх.",
        },
      ],
      codeBlocks: [
        {
          id: "no-sleep",
          language: "ts",
          code: `// ❌ Хардкодна затримка
await page.waitForTimeout(2000)
await page.click('#submit')

// ✅ Явне очікування стану
await expect(page.getByRole('button', { name: 'Зберегти' })).toBeEnabled()
await page.getByRole('button', { name: 'Зберегти' }).click()

// ✅ Чекаємо поки мережевий запит завершиться
const responsePromise = page.waitForResponse('**/api/orders')
await page.getByRole('button', { name: 'Оновити' }).click()
await responsePromise

// ✅ Чекаємо поки елемент з'явиться
await expect(page.getByText('Завантаження...')).toBeHidden()
await expect(page.getByRole('table')).toBeVisible()`,
        },
      ],
    },
    {
      id: "mock-external",
      title: {
        en: "Mock external services",
        uk: "Мокай зовнішні сервіси",
      },
      paragraphs: [
        {
          en: "Third-party APIs, payment gateways, SMS providers — don't call them in tests. They're slow, rate-limited, cost money, and can return unexpected responses. Mock them with `page.route()` and return exactly the response your test needs.",
          uk: "Сторонні API, платіжні шлюзи, SMS провайдери — не викликай їх у тестах. Вони повільні, мають ліміти запитів, коштують грошей і можуть повернути несподівану відповідь. Підмінь їх через `page.route()` і повертай рівно ту відповідь що потрібна тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "mock-external",
          language: "ts",
          code: `test('payment success flow', async ({ page }) => {
  // Підмінюємо Stripe — не витрачаємо реальну картку
  await page.route('**/stripe.com/**', route =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'succeeded', id: 'pi_test_123' }),
    })
  )

  await page.goto('/checkout')
  await page.getByRole('button', { name: 'Оплатити' }).click()
  await expect(page.getByText('Оплата успішна')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "page-objects",
      title: {
        en: "Use Page Objects for repeated flows",
        uk: "Page Objects для повторюваних дій",
      },
      paragraphs: [
        {
          en: "If login, navigation, or form filling appears in 5+ tests, extract it to a Page Object. When the UI changes — you update one class, not 20 test files. Keep Page Objects thin: just locators and actions, no assertions. Assertions belong in tests.",
          uk: "Якщо логін, навігація або заповнення форми зустрічаються в 5+ тестах — витягни це в Page Object. Коли UI зміниться — оновиш один клас, а не 20 тестових файлів. Тримай Page Objects тонкими: лише локатори і дії, без асертів. Асерти належать тестам.",
        },
      ],
      codeBlocks: [
        {
          id: "page-object",
          language: "ts",
          code: `// pages/OrdersPage.ts
export class OrdersPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/orders')
  }

  async filterByStatus(status: 'pending' | 'shipped' | 'delivered') {
    await this.page.getByRole('combobox', { name: 'Статус' }).selectOption(status)
  }

  orderRow(orderId: string) {
    return this.page.getByRole('row').filter({ hasText: orderId })
  }
}

// tests/orders.spec.ts
test('filter shows only pending orders', async ({ page }) => {
  const orders = new OrdersPage(page)
  await orders.goto()
  await orders.filterByStatus('pending')
  await expect(orders.orderRow('ORD-001')).toBeVisible()
  await expect(orders.orderRow('ORD-002')).toBeHidden()
})`,
        },
      ],
    },
    {
      id: "ci-tips",
      title: {
        en: "CI-specific tips",
        uk: "Поради для CI",
      },
      paragraphs: [
        {
          en: "A few things that save pain on CI:\n1. Always run in headless mode — headed mode needs a display server\n2. Set `retries: 1` in config to catch flakiness without masking real bugs\n3. Use `--reporter=github` on GitHub Actions for inline test annotations\n4. Save traces on failure (`trace: 'on-first-retry'`) — you'll thank yourself when debugging\n5. Pin browser versions in `package.json` — `@playwright/test` version determines browser binaries",
          uk: "Кілька речей що рятують від болю на CI:\n1. Завжди запускай headless — headed режим потребує дисплей-сервера\n2. Встанови `retries: 1` в конфізі щоб ловити нестабільність без маскування реальних багів\n3. Використовуй `--reporter=github` на GitHub Actions для анотацій прямо в PR\n4. Зберігай traces при падінні (`trace: 'on-first-retry'`) — подякуєш собі при дебазі\n5. Прив'язуй версію браузерів через `@playwright/test` — версія пакета визначає версію бінарників",
        },
      ],
      codeBlocks: [
        {
          id: "ci-config",
          language: "ts",
          code: `// playwright.config.ts — типовий CI конфіг
export default defineConfig({
  retries: process.env.CI ? 1 : 0,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : 'list',
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Which locator is most resilient to UI refactoring?",
        uk: "Який локатор найстійкіший до рефакторингу UI?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.locator('.btn-primary')",
            uk: "page.locator('.btn-primary')",
          },
        },
        {
          id: "b",
          label: {
            en: "page.getByRole('button', { name: 'Save' })",
            uk: "page.getByRole('button', { name: 'Зберегти' })",
          },
        },
        {
          id: "c",
          label: {
            en: "page.locator('#save-btn')",
            uk: "page.locator('#save-btn')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`getByRole()` tests what users perceive — the button's role and accessible name. CSS classes and IDs are implementation details that change during refactoring. Role + name stay stable as long as the button does the same thing.",
        uk: "`getByRole()` перевіряє те що сприймають користувачі — роль кнопки та її доступне ім'я. CSS класи та ID — це деталі реалізації що змінюються при рефакторингу. Role + name залишаються стабільними поки кнопка виконує те саме.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What's wrong with page.waitForTimeout(3000) before an assertion?",
        uk: "Що не так з page.waitForTimeout(3000) перед асертом?",
      },
      options: [
        { id: "a", label: { en: "It's deprecated in newer Playwright versions.", uk: "Він deprecated в нових версіях Playwright." } },
        { id: "b", label: { en: "It adds a fixed delay — too slow on fast machines, too short on slow CI.", uk: "Додає фіксовану затримку — надто повільно на швидких машинах, надто мало на повільному CI." } },
        { id: "c", label: { en: "It only works in headed mode.", uk: "Він працює тільки в headed режимі." } },
        { id: "d", label: { en: "It blocks all network requests during the timeout.", uk: "Він блокує всі мережеві запити під час затримки." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Hardcoded waits are a gamble: 3 seconds might be too short on a slow CI runner and wastes time on a fast local machine. Use explicit assertions like `expect(element).toBeVisible()` — they retry automatically until the condition is met.",
        uk: "Хардкодні затримки — лотерея: 3 секунди може бути мало на повільному CI раннері і марна трата часу на швидкій локалці. Використовуй явні асерти на кшталт `expect(element).toBeVisible()` — вони автоматично повторюють перевірку до виконання умови.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Test B fails only when test A doesn't run first. What is this problem called, and how do you fix it?",
        uk: "Тест B падає тільки коли тест A не виконується перед ним. Як називається ця проблема і як її виправити?",
      },
      options: [
        { id: "a", label: { en: "Flakiness — fix it by adding retries in `playwright.config.ts`.", uk: "Нестабільність — виправити додавши retries в `playwright.config.ts`." } },
        { id: "b", label: { en: "Test coupling — fix it by making test B create its own data (e.g., via API call) instead of relying on test A's side effects.", uk: "Зв'язність тестів — виправити зробивши тест B самостійним у створенні своїх даних (напр. через API-запит) замість покладання на побічні ефекти тесту A." } },
        { id: "c", label: { en: "Race condition — fix it by adding `await page.waitForTimeout(1000)` between tests.", uk: "Race condition — виправити додавши `await page.waitForTimeout(1000)` між тестами." } },
        { id: "d", label: { en: "A worker conflict — fix it by setting `workers: 1` in config.", uk: "Конфлікт воркерів — виправити встановивши `workers: 1` в конфізі." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "This is test coupling (hidden dependency). Test B relies on state that test A created, so running B alone fails. The fix is making each test independent — test B should set up the data it needs itself, typically via a fast API call rather than re-running the UI flow.",
        uk: "Це зв'язність тестів (прихована залежність). Тест B покладається на стан що створив тест A, тому запуск B окремо падає. Виправлення — зробити кожен тест незалежним — тест B має сам підготувати необхідні дані, зазвичай через швидкий API-запит а не повторення UI-флоу.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "When should you use `getByTestId()` over `getByRole()` or `getByText()`?",
        uk: "Коли варто використовувати `getByTestId()` замість `getByRole()` або `getByText()`?",
      },
      options: [
        { id: "a", label: { en: "Always — test IDs are the most stable locator type.", uk: "Завжди — test IDs є найстабільнішим типом локаторів." } },
        { id: "b", label: { en: "When the element has no stable accessible role or visible text, and adding an accessible name would be impractical.", uk: "Коли елемент не має стабільної доступної ролі або видимого тексту, і додати доступне ім'я було б непрактично." } },
        { id: "c", label: { en: "Only for buttons — role-based locators don't work reliably for buttons.", uk: "Лише для кнопок — локатори на основі ролей ненадійно працюють для кнопок." } },
        { id: "d", label: { en: "In CI environments only — locally you should always use CSS selectors.", uk: "Тільки в CI-оточеннях — локально завжди варто використовувати CSS-селектори." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`getByRole()` and `getByText()` are preferred because they test the visible interface. Use `getByTestId()` as a fallback when there's no stable accessible role or text — for example, a status badge or a custom icon button with no label. Agree on a convention (e.g., `data-testid`) with your dev team.",
        uk: "`getByRole()` і `getByText()` переважніші бо перевіряють видимий інтерфейс. Використовуй `getByTestId()` як запасний варіант коли немає стабільної доступної ролі або тексту — наприклад статусний бейдж або кастомна кнопка-іконка без підпису. Домовся про конвенцію (напр. `data-testid`) з командою розробників.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You need to click a 'Details' button inside a specific order card (by order ID). Which approach is correct?",
        uk: "Потрібно клікнути кнопку 'Деталі' всередині конкретної картки замовлення (за ID замовлення). Який підхід правильний?",
      },
      options: [
        { id: "a", label: { en: "`page.getByRole('button', { name: 'Details' }).first().click()`", uk: "`page.getByRole('button', { name: 'Деталі' }).first().click()`" } },
        { id: "b", label: { en: "`page.locator('[data-orderid=\"ORD-001\"] button').click()`", uk: "`page.locator('[data-orderid=\"ORD-001\"] button').click()`" } },
        { id: "c", label: { en: "`page.getByRole('article').filter({ hasText: 'ORD-001' }).getByRole('button', { name: 'Details' }).click()`", uk: "`page.getByRole('article').filter({ hasText: 'ORD-001' }).getByRole('button', { name: 'Деталі' }).click()`" } },
        { id: "d", label: { en: "`page.locator('.order-card:first-child button.details').click()`", uk: "`page.locator('.order-card:first-child button.details').click()`" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "Chaining locators is the idiomatic approach: first narrow to the article (card) containing the order ID text using `.filter({ hasText: 'ORD-001' })`, then find the 'Details' button within that scope. This avoids positional assumptions (`.first()`) and fragile CSS selectors.",
        uk: "Ланцюжок локаторів — ідіоматичний підхід: спочатку звузити до article (картки) що містить текст ID замовлення через `.filter({ hasText: 'ORD-001' })`, потім знайти кнопку 'Деталі' в цьому контексті. Це уникає позиційних припущень (`.first()`) і крихких CSS-селекторів.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Where do assertions belong in a Page Object Model?",
        uk: "Де мають знаходитися асерти в моделі Page Object?",
      },
      options: [
        { id: "a", label: { en: "Inside the Page Object methods — keeps tests short.", uk: "Всередині методів Page Object — тести стають коротшими." } },
        { id: "b", label: { en: "In the tests — Page Objects contain only locators and actions.", uk: "В тестах — Page Objects містять лише локатори і дії." } },
        { id: "c", label: { en: "In a separate Assertions class that extends the Page Object.", uk: "В окремому класі Assertions що розширює Page Object." } },
        { id: "d", label: { en: "In `beforeEach` hooks — assertions there apply to all tests.", uk: "В хуках `beforeEach` — асерти там застосовуються до всіх тестів." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Keep Page Objects thin — only locators and action methods (click, fill, select). Assertions belong in tests because different tests on the same page may expect different outcomes. If you embed assertions in Page Object actions, you lose flexibility and make debugging harder.",
        uk: "Тримай Page Objects тонкими — лише локатори і методи дій (click, fill, select). Асерти належать тестам, бо різні тести на тій самій сторінці можуть очікувати різних результатів. Якщо вбудувати асерти в методи Page Object — втрачаєш гнучкість і ускладнюєш дебаг.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You're testing a payment flow that calls a real Stripe API. What should you do instead?",
        uk: "Ти тестуєш платіжний флоу що викликає реальний Stripe API. Що варто зробити натомість?",
      },
      options: [
        { id: "a", label: { en: "Use a Stripe test-mode API key — it's designed for automated testing.", uk: "Використати тестовий API-ключ Stripe — він призначений для автоматизованого тестування." } },
        { id: "b", label: { en: "Mock the Stripe endpoint with `page.route()` and return the exact response your test needs.", uk: "Змокати endpoint Stripe через `page.route()` і повернути саме ту відповідь що потрібна тесту." } },
        { id: "c", label: { en: "Skip the payment test in CI and run it only locally.", uk: "Пропускати тест оплати в CI і запускати лише локально." } },
        { id: "d", label: { en: "Add a `waitForTimeout(5000)` to allow the Stripe request to complete.", uk: "Додати `waitForTimeout(5000)` щоб дати Stripe-запиту завершитись." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Real third-party APIs are slow, rate-limited, cost money, and return inconsistent responses. Mock them with `page.route()` to intercept the network call and return exactly the JSON your test scenario requires. This makes tests fast, deterministic, and free of external dependencies.",
        uk: "Реальні сторонні API повільні, мають ліміти, коштують грошей і повертають непостійні відповіді. Підміняй їх через `page.route()` — перехоплюй мережевий виклик і повертай саме той JSON що потрібен твоєму тест-сценарію. Це робить тести швидкими, детермінованими і незалежними від зовнішніх сервісів.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Which `playwright.config.ts` setting saves traces for debugging failures without slowing down passing tests?",
        uk: "Яке налаштування `playwright.config.ts` зберігає trace для дебагу падінь, не сповільнюючи тести що проходять?",
      },
      options: [
        { id: "a", label: { en: "`trace: 'on'`", uk: "`trace: 'on'`" } },
        { id: "b", label: { en: "`trace: 'on-first-retry'`", uk: "`trace: 'on-first-retry'`" } },
        { id: "c", label: { en: "`trace: 'off'`", uk: "`trace: 'off'`" } },
        { id: "d", label: { en: "`trace: 'retain-on-failure'`", uk: "`trace: 'retain-on-failure'`" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`trace: 'on-first-retry'` records a trace only when a test fails and is retried, which is exactly when you need debugging information. `trace: 'on'` records for every test (slow), `trace: 'off'` never records, and `trace: 'retain-on-failure'` records all runs but keeps only failed ones.",
        uk: "`trace: 'on-first-retry'` записує trace лише коли тест падає і перезапускається — саме тоді потрібна інформація для дебагу. `trace: 'on'` записує для кожного тесту (повільно), `trace: 'off'` не записує ніколи, `trace: 'retain-on-failure'` записує всі запуски але зберігає лише провалені.",
      },
    },
  ],
}
