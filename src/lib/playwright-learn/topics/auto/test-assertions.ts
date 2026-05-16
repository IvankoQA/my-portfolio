import type { PlaywrightTopic } from "../../types"

export const testAssertionsTopic: PlaywrightTopic = {
  slug: "test-assertions",
  groupId: "test-runner",
  order: 315,
  level: "beginner",
  trackOrder: 10,
  sourceDoc: "test-assertions-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-assertions",
  title: {
    en: "Assertions",
    uk: "Перевірки (assertions)",
  },
  summary: {
    en: "The most important thing to understand: locator assertions auto-retry. expect(locator).toBeVisible() polls until the element appears — you don't write any waiting loops. Value assertions like expect(someString).toBe('x') are instant and can be flaky on async UIs.",
    uk: "Найважливіше що треба зрозуміти: locator assertions автоматично повторюються. expect(locator).toBeVisible() опитує поки елемент не з'явиться — жодних циклів очікування. Value assertions типу expect(someString).toBe('x') — миттєві і можуть бути нестабільними на async UI.",
  },
  sections: [
    {
      id: "auto-retrying",
      title: {
        en: "Locator assertions — they wait automatically",
        uk: "Locator assertions — вони чекають автоматично",
      },
      diagram: {
        mermaid: `flowchart LR
  A["expect(locator)\n.toBeVisible()"] --> LP{"condition\nmet?"}
  LP -->|"yes"| P["✓ assertion passes"]
  LP -->|"no"| W["wait & re-query DOM"]
  W --> LP
  W -->|"timeout (5s default)"| F["✗ assertion fails"]`,
        caption: {
          en: "Locator assertions poll the DOM in a loop — no manual waitFor needed",
          uk: "Locator assertions перевіряють DOM у циклі — ручний waitFor не потрібен",
        },
      },
      paragraphs: [
        {
          en: "Every assertion that takes a `Locator` retries until the condition is met or the timeout expires (default: 5 seconds). Playwright re-queries the element and checks the condition in a loop. You don't write `waitFor` manually — the assertion does it.",
          uk: "Кожна перевірка яка приймає `Locator` повторюється поки умова не виконається або не спливе таймаут (за замовчуванням: 5 секунд). Playwright повторно запитує елемент і перевіряє умову в циклі. Ти не пишеш `waitFor` вручну — assertion робить це сам.",
        },
        {
          en: "The most common ones I use every day:",
          uk: "Найбільш вживані які я використовую щодня:",
        },
      ],
      codeBlocks: [
        {
          id: "common-assertions",
          language: "ts",
          code: `// Видимість — найпоширеніша перевірка
await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
await expect(page.getByTestId('error-banner')).not.toBeVisible()
await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled()

// Текст — підрядок або повний збіг
await expect(page.getByTestId('status-badge')).toHaveText('Shipped')
await expect(page.getByTestId('order-count')).toContainText('24 orders')

// URL і заголовок
await expect(page).toHaveURL('/dashboard')
await expect(page).toHaveURL(/\\/orders\\/\\d+/)
await expect(page).toHaveTitle('Orders | CRM')

// Поля вводу
await expect(page.getByLabel('Email')).toHaveValue('admin@example.com')
await expect(page.getByLabel('Status')).toHaveValue('pending')

// Кількість рядків у таблиці
await expect(page.getByRole('row')).toHaveCount(11) // 1 header + 10 rows

// Checkbox
await expect(page.getByRole('checkbox', { name: 'Notify client' })).toBeChecked()`,
        },
      ],
    },
    {
      id: "non-retrying",
      title: {
        en: "Value assertions — instant, no retry",
        uk: "Value assertions — миттєві, без повтору",
      },
      paragraphs: [
        {
          en: "These assert plain JavaScript values — strings, numbers, arrays, objects. They run once and fail immediately if the condition isn't met. Use them for data you've already extracted from the page, not for UI state that might still be loading.",
          uk: "Вони перевіряють прості JavaScript значення — рядки, числа, масиви, об'єкти. Виконуються один раз і одразу падають якщо умова не виконана. Використовуй для даних які ти вже витягнув зі сторінки, не для стану UI який ще може завантажуватися.",
        },
      ],
      codeBlocks: [
        {
          id: "value-assertions",
          language: "ts",
          code: `// ✅ Правильно — витягуємо значення, потім перевіряємо
const count = await page.getByRole('row').count()
expect(count).toBeGreaterThan(0)

const title = await page.title()
expect(title).toContain('Orders')

// ✅ Перевірка об'єктів і масивів (не пов'язана з DOM)
const ids = ['ORD-001', 'ORD-002', 'ORD-003']
expect(ids).toHaveLength(3)
expect(ids).toContain('ORD-002')
expect(ids[0]).toMatch(/^ORD-\\d+/)

// ❌ Небезпечно — значення може ще не завантажитися
const text = await page.locator('.status').textContent()
expect(text).toBe('Shipped') // краще: await expect(locator).toHaveText('Shipped')`,
        },
      ],
    },
    {
      id: "negating",
      title: {
        en: "Negating with .not",
        uk: "Заперечення через .not",
      },
      paragraphs: [
        {
          en: "Any assertion can be negated with `.not`. It works on both locator and value assertions. For locator assertions, `.not` also waits — it retries until the condition becomes false.",
          uk: "Будь-яку перевірку можна заперечити через `.not`. Працює і для locator і для value assertions. Для locator assertions — `.not` також чекає: повторюється поки умова не стане хибною.",
        },
      ],
      codeBlocks: [
        {
          id: "negation",
          language: "ts",
          code: `// Після логауту — форма входу видима, dashboard — ні
await expect(page.getByRole('form', { name: 'Login' })).toBeVisible()
await expect(page.getByTestId('dashboard')).not.toBeVisible()

// Кнопка Submit вимкнена поки поля не заповнені
await expect(page.getByRole('button', { name: 'Submit' })).not.toBeEnabled()

// Значення не порожнє
expect(orderId).not.toBeUndefined()
expect(orderId).not.toBe('')`,
        },
      ],
    },
    {
      id: "soft-assertions",
      title: {
        en: "Soft assertions — fail later, not immediately",
        uk: "Soft assertions — впасти пізніше, не відразу",
      },
      paragraphs: [
        {
          en: "A normal assertion stops the test immediately when it fails. A soft assertion (`expect.soft`) marks the test as failed but lets it continue running. I use this when I want to check multiple things on a page and see all failures in one test run.",
          uk: "Звичайна перевірка зупиняє тест одразу при падінні. Soft assertion (`expect.soft`) позначає тест як невдалий але дозволяє йому продовжувати виконання. Я використовую це коли хочу перевірити кілька речей на сторінці і побачити всі падіння за один запуск.",
        },
      ],
      codeBlocks: [
        {
          id: "soft",
          language: "ts",
          code: `test('order confirmation page is complete', async ({ page }) => {
  await page.goto('/orders/42/confirmation')

  // Перевіряємо всі елементи — не зупиняємося при першій помилці
  await expect.soft(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
  await expect.soft(page.getByTestId('order-number')).toHaveText('ORD-042')
  await expect.soft(page.getByTestId('total-amount')).toContainText('$')
  await expect.soft(page.getByRole('link', { name: 'View all orders' })).toBeVisible()

  // Наприкінці — явно перевірити що не було soft-падінь
  // (опціонально, тест все одно зафейлиться якщо були)
  expect(test.info().errors).toHaveLength(0)
})`,
        },
      ],
    },
    {
      id: "expect-poll",
      title: {
        en: "expect.poll — retry any async check",
        uk: "expect.poll — повторити будь-яку async перевірку",
      },
      paragraphs: [
        {
          en: "`expect.poll` runs a function repeatedly until a value assertion passes. Use it when you need to check something that isn't a locator — like an API response, a database value, or a count you computed yourself.",
          uk: "`expect.poll` запускає функцію повторно поки value assertion не пройде. Використовуй коли потрібно перевірити щось що не є локатором — відповідь API, значення в базі, або підрахований тобою результат.",
        },
      ],
      codeBlocks: [
        {
          id: "poll",
          language: "ts",
          code: `// Polling API поки не повернеться 200
await expect.poll(async () => {
  const response = await page.request.get('/api/orders/42/status')
  return response.status()
}, {
  message: 'order export should eventually succeed',
  timeout: 15000,
}).toBe(200)

// Polling поки кількість рядків не збіжиться
await expect.poll(async () => {
  return await page.getByRole('row').count()
}, { timeout: 5000 }).toBe(11)`,
        },
      ],
    },
    {
      id: "custom-message",
      title: {
        en: "Add a message to assertions",
        uk: "Додати повідомлення до перевірки",
      },
      paragraphs: [
        {
          en: "Pass a second argument to `expect()` to label the assertion in reports. When the test fails, the message appears in the error output — much easier to find which assertion failed than reading a locator description.",
          uk: "Передай другий аргумент до `expect()` щоб підписати перевірку в репортах. Коли тест падає — повідомлення з'являється у виводі помилки, набагато зручніше знайти яка саме перевірка впала ніж читати опис локатора.",
        },
      ],
      codeBlocks: [
        {
          id: "message",
          language: "ts",
          code: `await expect(
  page.getByTestId('status-badge'),
  'order should be in shipped state after submit'
).toHaveText('Shipped')

// Якщо впаде — в репорті побачиш:
// Error: order should be in shipped state after submit
// Expected: "Shipped"
// Received: "Pending"`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You click Submit and expect a success banner to appear. The banner is shown by an async API call. Which assertion should you use?",
        uk: "Ти клікаєш Submit і очікуєш появи банера успіху. Банер з'являється після асинхронного API-запиту. Яку перевірку використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "const text = await page.locator('.banner').textContent(); expect(text).toBe('Success')",
            uk: "const text = await page.locator('.banner').textContent(); expect(text).toBe('Success')",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(page.getByTestId('success-banner')).toBeVisible()",
            uk: "await expect(page.getByTestId('success-banner')).toBeVisible()",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.waitForTimeout(2000); expect(await page.locator('.banner').isVisible()).toBe(true)",
            uk: "await page.waitForTimeout(2000); expect(await page.locator('.banner').isVisible()).toBe(true)",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`await expect(locator).toBeVisible()` retries automatically until the element appears — no sleep, no manual waitFor. Option A reads the text once and fails immediately if the API hasn't returned yet. Option C hardcodes a delay which is both slow and fragile.",
        uk: "`await expect(locator).toBeVisible()` автоматично повторюється поки елемент не з'явиться — без sleep, без ручного waitFor. Варіант A зчитує текст один раз і одразу падає якщо API ще не повернувся. Варіант C хардкодить затримку що і повільно і ненадійно.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You want to check 5 fields on a confirmation page and see ALL failures at once, not stop at the first one. What do you use?",
        uk: "Хочеш перевірити 5 полів на сторінці підтвердження і побачити ВСІ падіння відразу, не зупиняючись на першому. Що використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Regular expect() — it accumulates failures automatically",
            uk: "Звичайний expect() — він автоматично накопичує падіння",
          },
        },
        {
          id: "b",
          label: {
            en: "expect.soft() — marks the test as failed but continues running",
            uk: "expect.soft() — позначає тест як невдалий але продовжує виконання",
          },
        },
        {
          id: "c",
          label: {
            en: "expect.poll() — retries each check until it passes",
            uk: "expect.poll() — повторює кожну перевірку поки не пройде",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`expect.soft()` collects all failures and reports them together at the end. Regular `expect()` stops at the first failure. `expect.poll()` is for retrying async values — not for accumulating failures across multiple checks.",
        uk: "`expect.soft()` збирає всі падіння і репортить їх разом наприкінці. Звичайний `expect()` зупиняється на першому падінні. `expect.poll()` — для повторення async значень, не для накопичення падінь між кількома перевірками.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the difference between toHaveText() and toContainText()?",
        uk: "В чому різниця між toHaveText() і toContainText()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are the same — both do a full exact match",
            uk: "Вони однакові — обидва роблять точне повне порівняння",
          },
        },
        {
          id: "b",
          label: {
            en: "toHaveText() requires the full text to match exactly; toContainText() passes if the element's text includes the expected substring",
            uk: "toHaveText() вимагає точного збігу всього тексту; toContainText() проходить якщо текст елемента містить очікуваний підрядок",
          },
        },
        {
          id: "c",
          label: {
            en: "toContainText() checks the HTML content while toHaveText() checks only visible text",
            uk: "toContainText() перевіряє HTML-вміст тоді як toHaveText() перевіряє тільки видимий текст",
          },
        },
        {
          id: "d",
          label: {
            en: "toHaveText() retries automatically while toContainText() runs only once",
            uk: "toHaveText() повторює автоматично тоді як toContainText() виконується лише один раз",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "toHaveText('Shipped') fails if the element contains 'Order Shipped' — the text must match in full (after trimming whitespace). toContainText('Shipped') passes even if the element also has surrounding text. Both are locator assertions that retry automatically. Choose toContainText() when you only care about a partial match.",
        uk: "toHaveText('Shipped') падає якщо елемент містить 'Order Shipped' — текст має збігатися повністю (після видалення пробілів). toContainText('Shipped') проходить навіть якщо елемент має навколишній текст. Обидва є locator assertions що повторюють автоматично. Вибирай toContainText() коли потрібен лише частковий збіг.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You want to assert that a table has exactly 10 data rows. Which assertion is correct?",
        uk: "Хочеш перевірити що таблиця має рівно 10 рядків даних. Який assertion правильний?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "expect(await page.getByRole('row').count()).toBe(10)",
            uk: "expect(await page.getByRole('row').count()).toBe(10)",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(page.getByRole('row')).toHaveCount(10)",
            uk: "await expect(page.getByRole('row')).toHaveCount(10)",
          },
        },
        {
          id: "c",
          label: {
            en: "await expect(page.getByRole('row').length).toBe(10)",
            uk: "await expect(page.getByRole('row').length).toBe(10)",
          },
        },
        {
          id: "d",
          label: {
            en: "expect(page.getByRole('row')).toHaveLength(10)",
            uk: "expect(page.getByRole('row')).toHaveLength(10)",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "await expect(locator).toHaveCount(10) is the right tool — it's a locator assertion that retries until the locator resolves to exactly 10 elements. Option A works but is fragile because count() reads the DOM once and fails immediately if the table hasn't loaded yet. Options C and D don't exist as valid Playwright APIs.",
        uk: "await expect(locator).toHaveCount(10) — правильний інструмент: це locator assertion що повторює поки локатор не розрішиться в рівно 10 елементів. Варіант A працює але є крихким бо count() читає DOM один раз і одразу падає якщо таблиця ще не завантажилась. Варіанти C і D не існують як валідні API Playwright.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "A button should be disabled after a form is submitted. Which assertion correctly verifies this?",
        uk: "Кнопка має бути вимкнена після надсилання форми. Який assertion це правильно перевіряє?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "expect(await page.getByRole('button').getAttribute('disabled')).toBe('true')",
            uk: "expect(await page.getByRole('button').getAttribute('disabled')).toBe('true')",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled()",
            uk: "await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled()",
          },
        },
        {
          id: "c",
          label: {
            en: "await expect(page.getByRole('button', { name: 'Submit' })).not.toBeEnabled()",
            uk: "await expect(page.getByRole('button', { name: 'Submit' })).not.toBeEnabled()",
          },
        },
        {
          id: "d",
          label: {
            en: "Both B and C are correct",
            uk: "Обидва B і C правильні",
          },
        },
      ],
      correctOptionId: "d",
      rationale: {
        en: "toBeDisabled() and not.toBeEnabled() are equivalent locator assertions — both retry until the button is disabled. Option A reads the attribute once and also doesn't handle aria-disabled. In practice, toBeDisabled() reads more naturally and is preferred, but not.toBeEnabled() is equally valid.",
        uk: "toBeDisabled() і not.toBeEnabled() є еквівалентними locator assertions — обидва повторюють поки кнопка не стане вимкненою. Варіант A зчитує атрибут один раз і не враховує aria-disabled. На практиці toBeDisabled() читається природніше і є кращим вибором, але not.toBeEnabled() є рівно валідним.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you assert that an element has a specific HTML attribute value, for example data-status='active'?",
        uk: "Як перевірити що елемент має певне значення HTML-атрибута, наприклад data-status='active'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await expect(locator).toHaveText('active')",
            uk: "await expect(locator).toHaveText('active')",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(locator).toHaveAttribute('data-status', 'active')",
            uk: "await expect(locator).toHaveAttribute('data-status', 'active')",
          },
        },
        {
          id: "c",
          label: {
            en: "expect(await locator.getAttribute('data-status')).toBe('active')",
            uk: "expect(await locator.getAttribute('data-status')).toBe('active')",
          },
        },
        {
          id: "d",
          label: {
            en: "await expect(locator).toHaveValue('active')",
            uk: "await expect(locator).toHaveValue('active')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "toHaveAttribute(name, value) is the locator assertion for checking HTML attributes — it retries automatically if the attribute hasn't been set yet. Option C also works but reads the attribute once without retrying, making it fragile on async state changes. toHaveText() checks visible text content, and toHaveValue() is for form inputs.",
        uk: "toHaveAttribute(name, value) — це locator assertion для перевірки HTML-атрибутів: він повторює автоматично якщо атрибут ще не встановлений. Варіант C також працює але зчитує атрибут один раз без повторів, що робить його крихким при асинхронних змінах стану. toHaveText() перевіряє видимий текстовий вміст, а toHaveValue() — для полів форм.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "The default assertion timeout is 5 seconds. How do you change it to 10 seconds for all assertions in a project?",
        uk: "Дефолтний таймаут assertion — 5 секунд. Як змінити його на 10 секунд для всіх assertions в проєкті?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Pass { timeout: 10000 } to every individual expect() call",
            uk: "Передавати { timeout: 10000 } до кожного окремого виклику expect()",
          },
        },
        {
          id: "b",
          label: {
            en: "Set expect: { timeout: 10000 } in playwright.config.ts",
            uk: "Встановити expect: { timeout: 10000 } в playwright.config.ts",
          },
        },
        {
          id: "c",
          label: {
            en: "Set use: { actionTimeout: 10000 } in playwright.config.ts",
            uk: "Встановити use: { actionTimeout: 10000 } в playwright.config.ts",
          },
        },
        {
          id: "d",
          label: {
            en: "Call expect.setTimeout(10000) at the top of each test file",
            uk: "Викликати expect.setTimeout(10000) на початку кожного файлу тестів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The assertion timeout is configured separately from the action timeout. Setting expect: { timeout: 10000 } in playwright.config.ts applies the 10-second timeout to all locator assertions project-wide. actionTimeout controls how long actions like click() and fill() wait for actionability checks — a different setting.",
        uk: "Таймаут assertion налаштовується окремо від таймауту дій. Встановлення expect: { timeout: 10000 } в playwright.config.ts застосовує 10-секундний таймаут до всіх locator assertions у проєкті. actionTimeout контролює скільки дії типу click() і fill() чекають на перевірки actionability — це інше налаштування.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "When should you use expect.poll() instead of a regular locator assertion?",
        uk: "Коли варто використовувати expect.poll() замість звичайного locator assertion?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "When you want to assert something faster than the default retry interval",
            uk: "Коли хочеш перевіряти щось швидше ніж дефолтний інтервал повторів",
          },
        },
        {
          id: "b",
          label: {
            en: "When you need to retry an assertion on a non-locator value, like an API response status or a computed count",
            uk: "Коли потрібно повторювати assertion для значення що не є локатором, як статус API-відповіді або підрахований результат",
          },
        },
        {
          id: "c",
          label: {
            en: "When the locator assertion does not support the .not modifier",
            uk: "Коли locator assertion не підтримує модифікатор .not",
          },
        },
        {
          id: "d",
          label: {
            en: "When you want to run multiple assertions in parallel",
            uk: "Коли хочеш запускати кілька assertions паралельно",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "expect.poll() wraps any async function and retries the value assertion until it passes or the timeout expires. It's designed for things that aren't Playwright locators — API response codes, database counts, WebSocket message counts, or any custom async check. If you're asserting on a locator (DOM element), use the built-in locator assertions like toBeVisible() or toHaveText() instead.",
        uk: "expect.poll() обгортає будь-яку async функцію і повторює value assertion поки вона не пройде або не спливе таймаут. Він призначений для речей що не є Playwright locator — коди відповідей API, підрахунки в базі даних, кількість WebSocket повідомлень, або будь-яка користувацька async перевірка. Якщо ти перевіряєш locator (DOM елемент), використовуй вбудовані locator assertions типу toBeVisible() або toHaveText().",
      },
    },
  ],
}
