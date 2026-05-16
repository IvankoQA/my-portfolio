import type { PlaywrightTopic } from "../../types"

export const pomTopic: PlaywrightTopic = {
  slug: "pom",
  groupId: "guides",
  order: 280,
  level: "intermediate",
  trackOrder: 11,
  sourceDoc: "pom.md",
  officialDocsUrl: "https://playwright.dev/docs/pom",
  title: {
    en: "Page object models",
    uk: "Моделі об'єктів сторінки (Page Object)",
  },
  summary: {
    en: "When 10 tests all interact with the orders page, any selector change breaks all 10. A page object wraps those locators in one class — fix the selector once, tests are fixed. That's the whole point.",
    uk: "Коли 10 тестів взаємодіють зі сторінкою замовлень — будь-яка зміна селектора ламає всі 10. Page object огортає ці локатори в один клас — виправив селектор раз, і тести виправлені. Ось і весь сенс.",
  },
  sections: [
    {
      id: "why-page-objects",
      title: {
        en: "When you need page objects",
        uk: "Коли потрібні page objects",
      },
      diagram: {
        mermaid: `flowchart LR
  T1["orders.spec.ts"] --> POM["OrdersPage\n(page object)"]
  T2["reports.spec.ts"] --> POM
  T3["dashboard.spec.ts"] --> POM
  POM -->|"locators + actions"| BR["Browser\n/orders UI"]
  style POM fill:#e8f4fd,stroke:#2196f3`,
        caption: {
          en: "Multiple test files share one page object — change a selector once and all tests are fixed",
          uk: "Кілька тестових файлів спільно використовують один page object — змінив селектор раз, і всі тести виправлені",
        },
      },
      paragraphs: [
        {
          en: "Page objects make sense when the same UI is accessed by multiple test files. If only one test touches the orders page, an inline helper is fine. When 5+ tests all do `page.getByRole('button', { name: 'Create order' })` — that's the signal to extract an `OrdersPage` class.",
          uk: "Page objects мають сенс коли один і той самий UI доступний з кількох тестових файлів. Якщо лише один тест торкається сторінки замовлень — inline хелпера достатньо. Коли 5+ тестів роблять `page.getByRole('button', { name: 'Create order' })` — це сигнал витягнути клас `OrdersPage`.",
        },
        {
          en: "The key rule: page objects contain locators and actions, not assertions. Assertions belong in the test — that's where the intent is documented. If a page object method throws or returns a boolean based on state, you've gone too far.",
          uk: "Ключове правило: page objects містять локатори і дії, а не перевірки. Перевірки належать тесту — там документується намір. Якщо метод page object кидає помилку або повертає boolean залежно від стану — ти зайшов занадто далеко.",
        },
      ],
    },
    {
      id: "implementation",
      title: {
        en: "Creating a page object",
        uk: "Створення page object",
      },
      paragraphs: [
        {
          en: "A page object is a TypeScript class that takes `page` in the constructor, defines locators as properties, and exposes methods for common interactions. Locators are defined once in the constructor — they're lazy by default so they don't cause issues until used.",
          uk: "Page object — це TypeScript клас що приймає `page` в конструкторі, визначає локатори як властивості і надає методи для типових взаємодій. Локатори визначаються один раз у конструкторі — вони ледачі за замовчуванням тому не спричиняють проблем поки не використані.",
        },
      ],
      codeBlocks: [
        {
          id: "orders-page-class",
          language: "ts",
          code: `// pages/orders-page.ts
import type { Page, Locator } from '@playwright/test'

export class OrdersPage {
  readonly page: Page
  readonly createOrderButton: Locator
  readonly orderList: Locator
  readonly statusFilter: Locator

  constructor(page: Page) {
    this.page = page
    this.createOrderButton = page.getByRole('button', { name: 'Create order' })
    this.orderList = page.getByRole('table')
    this.statusFilter = page.getByRole('combobox', { name: 'Status' })
  }

  async goto() {
    await this.page.goto('/orders')
  }

  async createOrder(item: string, quantity: number) {
    await this.createOrderButton.click()
    await this.page.getByLabel('Item').fill(item)
    await this.page.getByLabel('Quantity').fill(String(quantity))
    await this.page.getByRole('button', { name: 'Submit' }).click()
  }

  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status)
  }

  async cancelOrder(orderId: string) {
    await this.orderList.getByRole('row').filter({ hasText: orderId })
      .getByRole('button', { name: 'Cancel' }).click()
    await this.page.getByRole('button', { name: 'Confirm' }).click()
  }

  // Повертає локатор — тест сам робить expect
  getOrderRow(orderId: string): Locator {
    return this.orderList.getByRole('row').filter({ hasText: orderId })
  }
}`,
        },
      ],
    },
    {
      id: "using-page-objects",
      title: {
        en: "Use in tests",
        uk: "Використання в тестах",
      },
      paragraphs: [
        {
          en: "Tests become readable English: \"go to orders, filter by pending, check count\". The locator details are in the page object. The intent is in the test.",
          uk: "Тести стають читабельним текстом: \"перейти до замовлень, відфільтрувати pending, перевірити кількість\". Деталі локаторів — у page object. Намір — у тесті.",
        },
      ],
      codeBlocks: [
        {
          id: "tests-with-pom",
          language: "ts",
          code: `import { test, expect } from '@playwright/test'
import { OrdersPage } from '../pages/orders-page'

test('filter shows only pending orders', async ({ page }) => {
  const orders = new OrdersPage(page)
  await orders.goto()
  await orders.filterByStatus('pending')

  // Перевірка — у тесті, не в page object
  await expect(orders.orderList.getByRole('row').filter({
    hasNot: orders.page.getByRole('cell', { name: 'Pending' })
  })).toHaveCount(0)
})

test('cancel order removes it from list', async ({ page }) => {
  const orders = new OrdersPage(page)
  await orders.goto()

  await orders.cancelOrder('ORDER-042')

  // getOrderRow повертає локатор — expect у тесті
  await expect(orders.getOrderRow('ORDER-042')).not.toBeVisible()
})

test('create order appears in list', async ({ page }) => {
  const orders = new OrdersPage(page)
  await orders.goto()

  await orders.createOrder('Laptop Stand', 2)

  await expect(orders.orderList).toContainText('Laptop Stand')
})`,
        },
      ],
    },
    {
      id: "pom-with-fixtures",
      title: {
        en: "Combine with fixtures",
        uk: "Комбінація з фікстурами",
      },
      paragraphs: [
        {
          en: "The cleanest pattern: page objects for locator/action abstraction, fixtures for setup/teardown. The fixture creates the page object, navigates, seeds data — and the test gets a ready-to-use page object.",
          uk: "Найчистіший патерн: page objects для абстракції локаторів/дій, фікстури для setup/teardown. Фікстура створює page object, переходить на сторінку, засіває дані — і тест отримує готовий page object.",
        },
      ],
      codeBlocks: [
        {
          id: "pom-fixture",
          language: "ts",
          code: `// fixtures/index.ts
import { test as base } from '@playwright/test'
import { OrdersPage } from '../pages/orders-page'

export const test = base.extend<{ ordersPage: OrdersPage }>({
  ordersPage: async ({ page }, use) => {
    const orders = new OrdersPage(page)
    await orders.goto()
    await use(orders)
  },
})

// tests/orders.spec.ts
import { test, expect } from '../fixtures'

// Тест отримує вже готову сторінку — без goto() всередині
test('orders page loads', async ({ ordersPage }) => {
  await expect(ordersPage.orderList).toBeVisible()
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Should a page object method contain an expect() assertion?",
        uk: "Чи повинен метод page object містити перевірку expect()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Yes — it's cleaner to assert in the page object so tests are shorter",
            uk: "Так — чистіше перевіряти в page object щоб тести були коротшими",
          },
        },
        {
          id: "b",
          label: {
            en: "No — assertions belong in the test. Page objects handle locators and actions only",
            uk: "Ні — перевірки належать тесту. Page objects обробляють лише локатори і дії",
          },
        },
        {
          id: "c",
          label: {
            en: "Only for assertions that are needed to make the action safe",
            uk: "Тільки для перевірок потрібних щоб зробити дію безпечною",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Assertions in page objects hide the test's intent — you can't tell what a test is verifying without reading the page object implementation. Return locators instead (`getOrderRow(id): Locator`) so tests can call `expect(locator).toBeVisible()` directly. One exception: sometimes an action-level assertion is needed to make a multi-step action safe (like waiting for a modal before filling it), but the final test assertion always belongs in the test.",
        uk: "Перевірки в page objects ховають намір тесту — не можна зрозуміти що перевіряє тест не читаючи реалізацію page object. Натомість повертай локатори (`getOrderRow(id): Locator`) щоб тести могли самі викликати `expect(locator).toBeVisible()`. Виняток: іноді action-рівнева перевірка потрібна щоб зробити багатокрокову дію безпечною (наприклад очікування модального перед його заповненням), але фінальна перевірка тесту завжди в тесті.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is the Page Object Model (POM) pattern primarily used for in Playwright tests?",
        uk: "Для чого переважно використовується патерн Page Object Model (POM) у тестах Playwright?",
      },
      options: [
        { id: "a", label: { en: "To speed up test execution by caching page loads", uk: "Щоб прискорити виконання тестів через кешування завантажень сторінок" } },
        { id: "b", label: { en: "To centralise locators and interactions for a UI so changes need to be fixed in only one place", uk: "Щоб централізувати локатори та взаємодії для UI так щоб зміни потрібно було виправляти лише в одному місці" } },
        { id: "c", label: { en: "To generate test data automatically from the page structure", uk: "Щоб автоматично генерувати тестові дані зі структури сторінки" } },
        { id: "d", label: { en: "To replace fixtures entirely with class-based setup", uk: "Щоб повністю замінити фікстури class-based setup" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "POM wraps the locators and actions for a specific page in one class. When a selector changes, you update it once in the page object and all tests that use that class are automatically fixed. Without POM, the same `getByRole('button', { name: 'Create order' })` could be scattered across 10 test files — each one needing a manual update.",
        uk: "POM огортає локатори та дії для конкретної сторінки в одному класі. Коли селектор змінюється — оновлюєш його один раз у page object і всі тести що використовують цей клас автоматично виправлені. Без POM один і той самий `getByRole('button', { name: 'Create order' })` міг би бути розсіяний у 10 тест-файлах — кожен потребує ручного оновлення.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "In a Page Object class, what argument does the constructor always receive?",
        uk: "Який аргумент завжди отримує конструктор класу Page Object?",
      },
      options: [
        { id: "a", label: { en: "A browser instance", uk: "Екземпляр браузера" } },
        { id: "b", label: { en: "A Playwright config object", uk: "Об'єкт конфігурації Playwright" } },
        { id: "c", label: { en: "A Page instance", uk: "Екземпляр Page" } },
        { id: "d", label: { en: "A BrowserContext instance", uk: "Екземпляр BrowserContext" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "A page object is constructed with `new OrdersPage(page)` inside the test. The `page` parameter is typed as `Page` from `@playwright/test`. All locators and navigation actions are defined relative to this page, making the class completely portable across any test that has a page fixture.",
        uk: "Page object конструюється через `new OrdersPage(page)` всередині тесту. Параметр `page` типізований як `Page` з `@playwright/test`. Всі локатори та навігаційні дії визначені відносно цієї сторінки, що робить клас повністю портабельним у будь-який тест що має page фікстуру.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "Where should locators be defined in a Page Object class?",
        uk: "Де повинні бути визначені локатори в класі Page Object?",
      },
      options: [
        { id: "a", label: { en: "As local variables inside each method that needs them", uk: "Як локальні змінні всередині кожного методу що їх потребує" } },
        { id: "b", label: { en: "As readonly class properties, assigned once in the constructor", uk: "Як readonly властивості класу, призначені один раз у конструкторі" } },
        { id: "c", label: { en: "In a separate constants file imported by the page object", uk: "В окремому файлі констант що імпортується page object" } },
        { id: "d", label: { en: "As static class properties shared across all instances", uk: "Як статичні властивості класу що спільні для всіх екземплярів" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright locators are lazy — they don't interact with the DOM until used. Defining them as `readonly` class properties in the constructor keeps all selectors in one visible place, makes them reusable across multiple methods, and allows the test to reference them directly for its own `expect()` assertions (e.g. `orders.orderList`).",
        uk: "Локатори Playwright ледачі — вони не взаємодіють з DOM поки не використані. Визначення їх як `readonly` властивостей класу в конструкторі тримає всі селектори в одному видимому місці, робить їх повторно використовуваними в кількох методах, і дозволяє тесту посилатися на них безпосередньо для власних `expect()` перевірок (наприклад `orders.orderList`).",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What is the main maintenance advantage of Page Object Model when a UI selector changes?",
        uk: "Яка головна перевага Page Object Model для підтримки коду коли змінюється UI-селектор?",
      },
      options: [
        { id: "a", label: { en: "Playwright automatically detects the new selector and updates the page object", uk: "Playwright автоматично виявляє новий селектор і оновлює page object" } },
        { id: "b", label: { en: "You only need to update the selector in the page object class — all tests using that class are fixed automatically", uk: "Потрібно оновити селектор лише в класі page object — всі тести що використовують цей клас виправляються автоматично" } },
        { id: "c", label: { en: "The page object regenerates selectors from the page at runtime so no code change is needed", uk: "Page object перегенерує селектори зі сторінки під час виконання тому зміни коду не потрібні" } },
        { id: "d", label: { en: "Test failures point directly to the selector in the page object so you know which file to open", uk: "Падіння тестів вказують безпосередньо на селектор у page object тому знаєш який файл відкрити" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "This is the core value proposition of POM. Without it, the same selector string might appear in 10 different test files. When the UI changes the button label or role, you hunt through all 10. With POM the selector exists once — fix it in the `OrdersPage` constructor and every test that uses `OrdersPage` picks up the change without touching the test files.",
        uk: "Це основна цінність POM. Без нього один і той самий рядок селектора може з'являтися в 10 різних тест-файлах. Коли UI змінює підпис або роль кнопки — доводиться шукати по всіх 10. З POM селектор існує один раз — виправляєш його в конструкторі `OrdersPage` і кожен тест що використовує `OrdersPage` підбирає зміну без торкання тест-файлів.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do Playwright fixtures complement Page Object Model in a test suite?",
        uk: "Як фікстури Playwright доповнюють Page Object Model у тест-сьюті?",
      },
      options: [
        { id: "a", label: { en: "Fixtures replace page objects entirely — you don't need both", uk: "Фікстури повністю замінюють page objects — не потрібні обидва" } },
        { id: "b", label: { en: "Fixtures handle setup/teardown (navigate, seed data) and deliver a ready-to-use page object to the test", uk: "Фікстури обробляють setup/teardown (навігацію, заповнення даних) і передають готовий page object тесту" } },
        { id: "c", label: { en: "Fixtures store the locator strings that page objects then import", uk: "Фікстури зберігають рядки локаторів які page objects потім імпортують" } },
        { id: "d", label: { en: "Fixtures automatically generate page objects from the page HTML structure", uk: "Фікстури автоматично генерують page objects зі структури HTML сторінки" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The recommended pattern: page objects handle *what* (locators and actions on the page), fixtures handle *when* (navigation, data seeding, teardown). The fixture creates and navigates the page object, then yields it to the test. The test receives a ready-to-use object and never calls `goto()` itself — that's clean separation of concerns.",
        uk: "Рекомендований патерн: page objects обробляють *що* (локатори та дії на сторінці), фікстури обробляють *коли* (навігацію, заповнення даних, teardown). Фікстура створює і навігує page object, потім передає його тесту. Тест отримує готовий об'єкт і ніколи сам не викликає `goto()` — це чисте розділення відповідальності.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "A page object method `createOrder` performs several actions. Should it return `this` to allow chaining?",
        uk: "Метод page object `createOrder` виконує кілька дій. Чи повинен він повертати `this` для дозволу ланцюжка?",
      },
      options: [
        { id: "a", label: { en: "Yes — returning this from every method is required by Playwright's page object API", uk: "Так — повернення this з кожного методу вимагається API page object Playwright" } },
        { id: "b", label: { en: "Yes — returning this from action methods allows test code like orders.goto().createOrder('Laptop', 2).filterByStatus('pending')", uk: "Так — повернення this з методів дій дозволяє код тесту типу orders.goto().createOrder('Laptop', 2).filterByStatus('pending')" } },
        { id: "c", label: { en: "No — async methods cannot return this in TypeScript", uk: "Ні — async-методи не можуть повертати this у TypeScript" } },
        { id: "d", label: { en: "No — page object methods must always return void", uk: "Ні — методи page object завжди мають повертати void" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Returning `this` from async action methods (typed as `Promise<this>`) enables a fluent chaining style. Each method awaits its work then returns the page object instance, so tests can chain calls: `await orders.goto().then(o => o.createOrder('item', 1)).then(o => o.filterByStatus('shipped'))`. It's optional — many teams prefer explicit `await` on each line for readability.",
        uk: "Повернення `this` з async-методів дій (типізованих як `Promise<this>`) дозволяє fluent-стиль ланцюжка. Кожен метод виконує роботу і повертає екземпляр page object, тому тести можуть ланцюгувати виклики. Це опціонально — багато команд воліють явний `await` на кожному рядку для читабельності.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "When does it make sense to extract a Page Object class rather than use inline locators directly in the test?",
        uk: "Коли має сенс витягувати клас Page Object замість використання inline-локаторів безпосередньо в тесті?",
      },
      options: [
        { id: "a", label: { en: "For every test file, even if only one test accesses that page", uk: "Для кожного тест-файлу навіть якщо лише один тест звертається до цієї сторінки" } },
        { id: "b", label: { en: "Only when the page has more than 20 elements", uk: "Лише коли сторінка має більше 20 елементів" } },
        { id: "c", label: { en: "When the same UI is accessed by multiple test files and the duplication becomes a maintenance burden", uk: "Коли той самий UI доступний з кількох тест-файлів і дублювання стає тягарем для підтримки" } },
        { id: "d", label: { en: "Only when the project uses TypeScript, not JavaScript", uk: "Лише коли проєкт використовує TypeScript а не JavaScript" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The signal to create a page object is duplication: when 5 or more tests call the same `page.getByRole('button', { name: 'Create order' })`, extracting `OrdersPage` pays off. If only one test touches a page, an inline locator or a small helper function is simpler. POM is a maintenance tool, not a rule for all pages.",
        uk: "Сигнал для створення page object — дублювання: коли 5 або більше тестів викликають той самий `page.getByRole('button', { name: 'Create order' })` — витягування `OrdersPage` окупається. Якщо лише один тест звертається до сторінки — inline-локатор або маленька helper-функція простіша. POM — це інструмент підтримки а не правило для всіх сторінок.",
      },
    },
  ],
}
