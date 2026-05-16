import type { PlaywrightTopic } from "../../types"

export const locatorsTopic: PlaywrightTopic = {
  slug: "locators",
  groupId: "guides",
  order: 245,
  level: "beginner",
  trackOrder: 6,
  sourceDoc: "locators.md",
  officialDocsUrl: "https://playwright.dev/docs/locators",
  title: {
    en: "Locators",
    uk: "Локатори",
  },
  summary: {
    en: "The question I ask first when reading someone's Playwright tests: are they using getByRole or CSS selectors? The answer tells me how brittle the test suite is. Locators are how you find elements — picking the right one makes tests survive refactors.",
    uk: "Перше що я перевіряю в чужих Playwright тестах: getByRole чи CSS селектори? Відповідь одразу говорить наскільки крихка ця тест-сюїта. Локатори — це спосіб знайти елемент. Правильний вибір робить тести стійкими до рефакторингу.",
  },
  sections: [
    {
      id: "locator-priority",
      title: {
        en: "The locator priority order",
        uk: "Пріоритетний порядок локаторів",
      },
      diagram: {
        mermaid: `flowchart TD
  A["getByRole (кнопка, заголовок, посилання)"] --> B["getByLabel (поля форми)"]
  B --> C["getByPlaceholder (поля без label)"]
  C --> D["getByText (некліковний текст)"]
  D --> E["getByTestId (data-testid)"]
  E --> F["CSS / XPath ⚠️ last resort"]
  style A fill:#22c55e,color:#fff
  style B fill:#22c55e,color:#fff
  style C fill:#86efac,color:#000
  style D fill:#86efac,color:#000
  style E fill:#fbbf24,color:#000
  style F fill:#ef4444,color:#fff`,
        caption: {
          en: "Start at the top. Drop down only when the element genuinely has no role, label, or text.",
          uk: "Починай зверху. Йди нижче тільки якщо елемент справді не має ролі, підпису або тексту.",
        },
      },
      paragraphs: [
        {
          en: "Every locator in Playwright is lazy — it doesn't find the element until you use it. When you call `.click()` or `expect()`, Playwright searches the page at that moment, waits for the element to appear, and retries automatically. This auto-wait only works through locators — not through raw DOM handles.",
          uk: "Кожен локатор у Playwright ледачий — він не шукає елемент поки ти його не використаєш. Коли викликаєш `.click()` або `expect()` — Playwright шукає елемент прямо зараз, чекає поки він з'явиться і автоматично перезапитує. Це авто-очікування працює лише через локатори, не через звичайні DOM handles.",
        },
        {
          en: "The locator you pick determines how resilient the test is. If a developer renames a CSS class or changes a `div` to a `section`, CSS selectors break. If they rename a button's label from \"Save\" to \"Save changes\", `getByText('Save')` breaks. But `getByRole('button', { name: /save/i })` — that survives because it matches how the browser exposes the element to screen readers.",
          uk: "Локатор що ти обрав визначає наскільки стійкий тест. Якщо розробник перейменує CSS клас або змінить `div` на `section` — CSS селектори зламаються. Якщо перейменує кнопку з \"Save\" на \"Save changes\" — `getByText('Save')` зламається. Але `getByRole('button', { name: /save/i })` — виживе, бо збігається з тим як браузер показує елемент screen reader-у.",
        },
      ],
    },
    {
      id: "get-by-role",
      title: {
        en: "getByRole — the one to use by default",
        uk: "getByRole — перший вибір за замовчуванням",
      },
      paragraphs: [
        {
          en: '`getByRole` matches elements by their ARIA role and accessible name. The role is either declared explicitly (`role="button"`) or inferred from the HTML tag — `<button>` is a `button`, `<a>` is a `link`, `<h1>` is a `heading`. The accessible name is what a screen reader would announce for that element.',
          uk: '`getByRole` шукає елементи за ARIA роллю і доступною назвою. Роль або явно задана (`role="button"`) або виводиться з HTML тегу — `<button>` це `button`, `<a>` це `link`, `<h1>` це `heading`. Доступна назва — це те що screen reader оголосив би для цього елемента.',
        },
        {
          en: "In practice: for any interactive element (button, link, checkbox, select, input with a label), `getByRole` is the answer. It tests the right thing — the semantics — not the implementation.",
          uk: "На практиці: для будь-якого інтерактивного елемента (кнопка, посилання, чекбокс, select, input з підписом) — `getByRole` це відповідь. Воно тестує правильну річ — семантику — а не реалізацію.",
        },
      ],
      codeBlocks: [
        {
          id: "role-examples",
          language: "ts",
          code: `test('order dashboard interactions', async ({ page }) => {
  await page.goto('/dashboard')

  // Кнопки
  await page.getByRole('button', { name: 'Create order' }).click()
  await page.getByRole('button', { name: /save/i }).click()

  // Посилання
  await page.getByRole('link', { name: 'Orders' }).click()

  // Заголовки
  await expect(page.getByRole('heading', { name: 'My Orders' })).toBeVisible()

  // Таблиця
  const table = page.getByRole('table')
  await expect(table.getByRole('row')).toHaveCount(6) // 5 рядків + header

  // Checkbox
  await page.getByRole('checkbox', { name: 'Select all' }).check()

  // Combobox (select)
  await page.getByRole('combobox', { name: 'Status' }).selectOption('pending')
})`,
        },
      ],
    },
    {
      id: "get-by-label",
      title: {
        en: "getByLabel — for form inputs",
        uk: "getByLabel — для полів форм",
      },
      paragraphs: [
        {
          en: "For form fields with a `<label>` — use `getByLabel`. It works even when the label is linked via `htmlFor`/`id` rather than wrapping the input. This is what I use for login forms, order creation forms, settings pages.",
          uk: "Для полів форми з `<label>` — використовуй `getByLabel`. Він знаходить поле за текстом підпису — незалежно від того, як підпис і поле пов'язані в HTML. Саме це я використовую для форм логіну, створення замовлень, сторінок налаштувань.",
        },
      ],
      codeBlocks: [
        {
          id: "label-examples",
          language: "ts",
          code: `test('login with valid credentials', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL('/dashboard')
})

test('create order form', async ({ page }) => {
  await page.goto('/orders/new')

  await page.getByLabel('Customer name').fill('Ivan Kozenko')
  await page.getByLabel('Item').fill('Laptop')
  await page.getByLabel('Quantity').fill('2')
  await page.getByRole('button', { name: 'Submit' }).click()
})`,
        },
      ],
    },
    {
      id: "get-by-placeholder",
      title: {
        en: "getByPlaceholder — when there's no label",
        uk: "getByPlaceholder — коли немає підпису",
      },
      paragraphs: [
        {
          en: "Some inputs have no visible label — they rely on placeholder text. `getByPlaceholder` finds them. Not ideal (missing labels are an accessibility problem), but if the app is built this way and you can't change it, this is the locator to use.",
          uk: "Деякі поля не мають видимого підпису — вони покладаються на placeholder. `getByPlaceholder` їх знаходить. Не ідеально (відсутній підпис — проблема доступності), але якщо застосунок так побудований і ти не можеш змінити — це правильний локатор.",
        },
      ],
      codeBlocks: [
        {
          id: "placeholder-examples",
          language: "ts",
          code: `test('search orders', async ({ page }) => {
  await page.goto('/orders')

  // Поле пошуку без label але з placeholder
  await page.getByPlaceholder('Search orders...').fill('keyboard')
  await page.getByPlaceholder('Search orders...').press('Enter')

  await expect(page.getByRole('row')).toHaveCount(3)
})`,
        },
      ],
    },
    {
      id: "get-by-text",
      title: {
        en: "getByText — for non-interactive content",
        uk: "getByText — для неінтерактивного контенту",
      },
      paragraphs: [
        {
          en: "`getByText` is for content you want to assert on — paragraphs, status labels, table cells. I avoid using it to find clickable elements since roles are more stable. It supports exact match, substring, and regex.",
          uk: "`getByText` — для контенту який треба перевірити: параграфи, статусні мітки, комірки таблиць. Я уникаю використання для кліку, бо ролі стабільніші. Підтримує точний збіг, підрядок і regex.",
        },
      ],
      codeBlocks: [
        {
          id: "text-examples",
          language: "ts",
          code: `test('order status is shown correctly', async ({ page }) => {
  await page.goto('/orders')

  // Перевірка тексту статусу
  await expect(page.getByText('Order confirmed')).toBeVisible()

  // Точний збіг
  await expect(page.getByText('Pending', { exact: true })).toBeVisible()

  // Regex — коли текст може трохи відрізнятися
  await expect(page.getByText(/order #\d+ created/i)).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "get-by-test-id",
      title: {
        en: "getByTestId — the escape hatch",
        uk: "getByTestId — запасний варіант",
      },
      paragraphs: [
        {
          en: "`getByTestId` finds elements by `data-testid` attribute. I use it when an element has no semantic role, no label, and no stable text — for example, a custom chart component, a drag-and-drop card, or a canvas element. It requires developers to add `data-testid` attributes, which is a small coordination cost but creates stable, explicit test targets.",
          uk: "`getByTestId` шукає за атрибутом `data-testid`. Я використовую коли елемент не має семантичної ролі, підпису чи стабільного тексту — наприклад кастомний графік, drag-and-drop картка або canvas. Вимагає щоб розробники додали атрибути `data-testid` — невелика координаційна вартість але створює стабільні явні цілі для тестів.",
        },
        {
          en: "You can configure a custom attribute name instead of `data-testid` in the config:",
          uk: "Можна налаштувати свою назву атрибута замість `data-testid` у конфізі:",
        },
      ],
      codeBlocks: [
        {
          id: "testid-examples",
          language: "ts",
          code: `// HTML: <div data-testid="revenue-chart">...</div>
test('revenue chart renders after data loads', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByTestId('revenue-chart')).toBeVisible()
})`,
        },
        {
          id: "testid-config",
          language: "ts",
          code: `// playwright.config.ts — кастомний атрибут
export default defineConfig({
  use: {
    testIdAttribute: 'data-qa', // замість data-testid
  },
})

// HTML: <button data-qa="submit-order">Submit</button>
// В тесті:
await page.getByTestId('submit-order').click()`,
        },
      ],
    },
    {
      id: "filtering",
      title: {
        en: "Filtering locators",
        uk: "Фільтрація локаторів",
      },
      paragraphs: [
        {
          en: "When `getByRole('row')` returns 20 rows, you need to narrow down to the one you care about. `.filter()` lets you add conditions — by visible text or by another locator inside it. This is how I target specific rows in order tables without resorting to nth-child selectors.",
          uk: "Коли `getByRole('row')` повертає 20 рядків — треба звузити до потрібного. `.filter()` дозволяє додати умови — за видимим текстом або за іншим локатором всередині. Саме так я знаходжу конкретні рядки в таблицях замовлень.",
        },
      ],
      codeBlocks: [
        {
          id: "filter-examples",
          language: "ts",
          code: `test('cancel specific order from list', async ({ page }) => {
  await page.goto('/orders')

  // Знайти рядок що містить 'ORDER-042' і клікнути Cancel в ньому
  const targetRow = page.getByRole('row').filter({ hasText: 'ORDER-042' })
  await targetRow.getByRole('button', { name: 'Cancel' }).click()

  await page.getByRole('button', { name: 'Confirm cancellation' }).click()
  await expect(targetRow.getByText('Cancelled')).toBeVisible()
})

// Фільтр за вкладеним локатором
const pendingRows = page.getByRole('row').filter({
  has: page.getByRole('cell', { name: 'Pending' })
})
await expect(pendingRows).toHaveCount(3)`,
        },
      ],
    },
    {
      id: "chaining",
      title: {
        en: "Chaining and scoping",
        uk: "Ланцюгування і scope",
      },
      paragraphs: [
        {
          en: "Locators can be chained — each call narrows the search to within the previous result. This is cleaner than long CSS selectors and more readable: `page.getByRole('dialog').getByRole('button', { name: 'Save' })` is self-documenting.",
          uk: "Локатори можна ланцюгувати — кожен виклик звужує пошук всередині попереднього результату. Це чистіше ніж довгі CSS і читабельніше: `page.getByRole('dialog').getByRole('button', { name: 'Save' })` сам себе документує.",
        },
      ],
      codeBlocks: [
        {
          id: "chain-examples",
          language: "ts",
          code: `test('edit order in modal', async ({ page }) => {
  await page.goto('/orders')

  // Клікнути Edit для конкретного замовлення
  await page.getByRole('row').filter({ hasText: 'ORDER-007' })
    .getByRole('button', { name: 'Edit' })
    .click()

  // Всі наступні пошуки — всередині dialog, не по всій сторінці
  const modal = page.getByRole('dialog')
  await modal.getByLabel('Status').selectOption('shipped')
  await modal.getByRole('button', { name: 'Save changes' }).click()

  await expect(modal).not.toBeVisible()
})`,
        },
      ],
    },
    {
      id: "lists",
      title: {
        en: "Working with lists",
        uk: "Робота зі списками",
      },
      paragraphs: [
        {
          en: "When you have a list of similar items — an order list, a product grid, a notification stack — you often need to assert on the count, check all items, or find one specific item. `all()` returns the current elements as an array, `nth()` picks by index.",
          uk: "Коли є список схожих елементів — список замовлень, сітка продуктів, стек сповіщень — часто треба перевірити кількість, обійти всі елементи або знайти конкретний. `all()` повертає поточні елементи масивом, `nth()` вибирає за індексом.",
        },
      ],
      codeBlocks: [
        {
          id: "list-examples",
          language: "ts",
          code: `test('order list has correct items', async ({ page }) => {
  await page.goto('/orders')

  const rows = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') })

  // Перевірити кількість
  await expect(rows).toHaveCount(5)

  // Перший рядок — найновіше замовлення
  await expect(rows.nth(0)).toContainText('ORDER-042')

  // Обійти всі рядки
  for (const row of await rows.all()) {
    await expect(row.getByRole('cell', { name: /ORDER-\d+/ })).toBeVisible()
  }
})

// last() — останній елемент
await expect(page.getByRole('listitem').last()).toContainText('No more items')`,
        },
      ],
    },
    {
      id: "strictness",
      title: {
        en: "Strict mode — one match expected",
        uk: "Строгий режим — очікується один збіг",
      },
      paragraphs: [
        {
          en: "By default, if a locator matches more than one element, calling an action on it throws — Playwright wants you to be precise. This prevents accidental clicks on the wrong element when there are multiple matches. If you intentionally want multiple elements, use `all()` or `count()`.",
          uk: "За замовчуванням якщо локатор збігається з більш ніж одним елементом — виклик дії кидає помилку. Playwright вимагає точності. Це запобігає випадковому кліку не на той елемент коли є кілька збігів. Якщо навмисно хочеш кілька елементів — використовуй `all()` або `count()`.",
        },
      ],
      codeBlocks: [
        {
          id: "strict-examples",
          language: "ts",
          code: `// ❌ Кидає: strict mode violation: getByRole('button') resolved to 8 elements
await page.getByRole('button').click()

// ✅ Уточни яку кнопку
await page.getByRole('button', { name: 'Submit order' }).click()

// ✅ Або звузь scope
await page.getByRole('form', { name: 'Create order' })
  .getByRole('button', { name: 'Submit' }).click()

// ✅ Або візьми конкретний за індексом (якщо порядок важливий)
await page.getByRole('button', { name: 'Delete' }).nth(2).click()

// Перевірити кількість без strict mode violation
await expect(page.getByRole('button', { name: 'Delete' })).toHaveCount(5)`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A developer renames the CSS class on a Submit button from .btn-submit to .btn-primary. Which locator will NOT break?",
        uk: "Розробник перейменовує CSS клас кнопки Submit з .btn-submit на .btn-primary. Який локатор НЕ зламається?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.locator('.btn-submit')",
            uk: "page.locator('.btn-submit')",
          },
        },
        {
          id: "b",
          label: {
            en: "page.getByRole('button', { name: 'Submit' })",
            uk: "page.getByRole('button', { name: 'Submit' })",
          },
        },
        {
          id: "c",
          label: {
            en: "page.locator('button.btn-primary')",
            uk: "page.locator('button.btn-primary')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`getByRole` matches on the button's accessible name, not CSS classes. Class renames don't affect it. The CSS selectors in A and C both depend on the class name and would break as soon as it changes.",
        uk: "`getByRole` збігається за доступною назвою кнопки, а не CSS класами. Перейменування класу на нього не впливає. CSS селектори в A і C залежать від назви класу і зламаються одразу після зміни.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You have a table with 20 order rows. You want to click the 'Cancel' button only in the row that contains 'ORDER-042'. What do you use?",
        uk: "У тебе таблиця з 20 рядками замовлень. Хочеш клікнути кнопку 'Cancel' лише в рядку що містить 'ORDER-042'. Що використовуєш?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.getByText('Cancel').nth(5).click() — count the row manually",
            uk: "page.getByText('Cancel').nth(5).click() — порахувати рядок вручну",
          },
        },
        {
          id: "b",
          label: {
            en: "page.getByRole('row').filter({ hasText: 'ORDER-042' }).getByRole('button', { name: 'Cancel' }).click()",
            uk: "page.getByRole('row').filter({ hasText: 'ORDER-042' }).getByRole('button', { name: 'Cancel' }).click()",
          },
        },
        {
          id: "c",
          label: {
            en: "page.locator('tr:has-text(\"ORDER-042\") button.cancel').click()",
            uk: "page.locator('tr:has-text(\"ORDER-042\") button.cancel').click()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Chaining `.filter({ hasText: 'ORDER-042' })` scopes the locator to the right row, then `.getByRole('button', { name: 'Cancel' })` finds the button within that row. This is readable and doesn't depend on row order or CSS classes. `nth()` is fragile when data changes; the CSS locator depends on class names.",
        uk: "Ланцюгування `.filter({ hasText: 'ORDER-042' })` звужує локатор до потрібного рядка, потім `.getByRole('button', { name: 'Cancel' })` знаходить кнопку в ньому. Читабельно і не залежить від порядку рядків або CSS класів. `nth()` крихкий при зміні даних; CSS локатор залежить від класів.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Playwright throws 'strict mode violation: locator resolved to 5 elements' when you call .click(). What does this mean?",
        uk: "Playwright кидає 'strict mode violation: locator resolved to 5 elements' при виклику .click(). Що це означає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The page has a JavaScript error that prevents clicking",
            uk: "На сторінці є JavaScript помилка що заважає кліку",
          },
        },
        {
          id: "b",
          label: {
            en: "The locator matches 5 elements — Playwright refuses to click an ambiguous target",
            uk: "Локатор збігається з 5 елементами — Playwright відмовляється клікати неоднозначну ціль",
          },
        },
        {
          id: "c",
          label: {
            en: "The click timed out after 5 retries",
            uk: "Клік завершився по таймауту після 5 спроб",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's strict mode requires a locator to match exactly one element before performing an action. When 5 elements match, it refuses to guess which one you meant. Fix: add a name filter, chain with a parent scope, or use .nth() if the position is meaningful.",
        uk: "Строгий режим Playwright вимагає щоб локатор збігався рівно з одним елементом перед виконанням дії. Коли збігається 5 елементів — він відмовляється здогадуватися який ти мав на увазі. Виправлення: додай фільтр за назвою, ланцюгуй з батьківським scope, або використай .nth() якщо позиція важлива.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "An element has no accessible role, no label, and no stable visible text. When is `getByTestId` the right choice?",
        uk: "Елемент не має доступної ролі, підпису і стабільного видимого тексту. Коли `getByTestId` є правильним вибором?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Always — `getByTestId` is the most reliable locator for every element type.",
            uk: "Завжди — `getByTestId` є найнадійнішим локатором для будь-якого типу елемента.",
          },
        },
        {
          id: "b",
          label: {
            en: "Never — test IDs couple tests to implementation details.",
            uk: "Ніколи — test ID прив'язують тести до деталей реалізації.",
          },
        },
        {
          id: "c",
          label: {
            en: "When the element genuinely has no semantic role or accessible name — for example a custom chart, canvas, or drag-and-drop card — and developers add a `data-testid` attribute as an explicit test hook.",
            uk: "Коли елемент справді не має семантичної ролі або доступної назви — наприклад кастомний графік, canvas або drag-and-drop картка — і розробники додають атрибут `data-testid` як явний хук для тестів.",
          },
        },
        {
          id: "d",
          label: {
            en: "Only in `test.beforeEach` setup steps, not in assertions.",
            uk: "Лише в кроках налаштування `test.beforeEach`, не в ассерціях.",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`getByTestId` is the last semantic resort before CSS/XPath. It is appropriate when an element has no meaningful ARIA role, label or stable text — think custom chart widgets, canvas elements or drag handles. It requires a `data-testid` attribute on the element, which is a small coordination cost with developers but produces a stable, explicit test anchor.",
        uk: "`getByTestId` — це останній семантичний варіант перед CSS/XPath. Він підходить коли елемент не має значущої ARIA ролі, підпису або стабільного тексту — наприклад кастомні графіки, canvas-елементи або drag handles. Потрібен атрибут `data-testid` на елементі — невелика координаційна вартість з розробниками але дає стабільний явний якір для тестів.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does `page.getByRole('listitem').nth(2)` return?",
        uk: "Що повертає `page.getByRole('listitem').nth(2)`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The last list item on the page.",
            uk: "Останній елемент списку на сторінці.",
          },
        },
        {
          id: "b",
          label: {
            en: "A locator scoped to the third list item (index 2, zero-based).",
            uk: "Локатор обмежений третім елементом списку (індекс 2, починаючи з нуля).",
          },
        },
        {
          id: "c",
          label: {
            en: "The second list item (index 2, one-based).",
            uk: "Другий елемент списку (індекс 2, починаючи з одиниці).",
          },
        },
        {
          id: "d",
          label: {
            en: "It throws because `nth()` is only valid on `locator()` calls, not `getByRole()`.",
            uk: "Кидає помилку бо `nth()` валідний лише для викликів `locator()`, а не `getByRole()`.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`nth()` is zero-indexed: `nth(0)` is the first match, `nth(1)` is the second, `nth(2)` is the third. It works on any locator — including all `getBy*` methods — and returns a new locator scoped to that specific element. Use it when position is semantically meaningful (e.g. the most recent item in a sorted list).",
        uk: "`nth()` використовує індексацію з нуля: `nth(0)` — перший збіг, `nth(1)` — другий, `nth(2)` — третій. Він працює з будь-яким локатором — включаючи всі методи `getBy*` — і повертає новий локатор обмежений цим конкретним елементом. Використовуй коли позиція семантично важлива (наприклад найновіший елемент у відсортованому списку).",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "When is `getByAltText` the appropriate locator?",
        uk: "Коли `getByAltText` є відповідним локатором?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "When you want to find any element with a visible text label.",
            uk: "Коли хочеш знайти будь-який елемент з видимим текстовим підписом.",
          },
        },
        {
          id: "b",
          label: {
            en: "When finding an `<img>` element (or similar) by its `alt` attribute — useful for image-based buttons or icons that have no visible text.",
            uk: "При пошуку елемента `<img>` (або подібного) за атрибутом `alt` — корисно для кнопок або іконок на основі зображень що не мають видимого тексту.",
          },
        },
        {
          id: "c",
          label: {
            en: "For tooltip text that appears on hover.",
            uk: "Для тексту підказки що з'являється при наведенні.",
          },
        },
        {
          id: "d",
          label: {
            en: "Only for `<area>` elements inside image maps.",
            uk: "Лише для елементів `<area>` всередині image map.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`getByAltText` finds elements — typically `<img>` tags — by their `alt` attribute value. This is the right locator when an image itself is the interactive element or when you want to assert an image is present by its descriptive alt text. It is not for visible text labels (use `getByText`) or tooltips.",
        uk: "`getByAltText` знаходить елементи — зазвичай теги `<img>` — за значенням атрибута `alt`. Це правильний локатор коли саме зображення є інтерактивним елементом або коли хочеш перевірити наявність зображення за його описовим alt-текстом. Не для видимих текстових підписів (використовуй `getByText`) або підказок.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to find the 'Edit' button only inside a specific row of a table. How should you write this?",
        uk: "Хочеш знайти кнопку 'Edit' лише всередині конкретного рядка таблиці. Як це написати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.getByRole('button', { name: 'Edit' }) — Playwright automatically picks the right one.",
            uk: "page.getByRole('button', { name: 'Edit' }) — Playwright автоматично вибере правильну.",
          },
        },
        {
          id: "b",
          label: {
            en: "page.locator('tr button:text(\"Edit\")') — CSS with text pseudo-class narrows it down.",
            uk: "page.locator('tr button:text(\"Edit\")') — CSS з псевдокласом text звузить вибір.",
          },
        },
        {
          id: "c",
          label: {
            en: "page.getByRole('row').filter({ hasText: 'ORDER-007' }).getByRole('button', { name: 'Edit' })",
            uk: "page.getByRole('row').filter({ hasText: 'ORDER-007' }).getByRole('button', { name: 'Edit' })",
          },
        },
        {
          id: "d",
          label: {
            en: "page.getByRole('button', { name: 'Edit', within: 'tr' })",
            uk: "page.getByRole('button', { name: 'Edit', within: 'tr' })",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "Chaining locators is the idiomatic Playwright approach: first filter rows to the one you care about using `.filter({ hasText: '...' })`, then call `.getByRole('button', { name: 'Edit' })` on that scoped locator. Option A breaks on strict mode if multiple Edit buttons exist. Option B uses CSS which is fragile. Option D uses a non-existent `within` option.",
        uk: "Ланцюгування локаторів — це ідіоматичний підхід Playwright: спочатку відфільтруй рядки до потрібного через `.filter({ hasText: '...' })`, потім виклич `.getByRole('button', { name: 'Edit' })` на цьому обмеженому локаторі. Варіант А падає зі strict mode якщо існує кілька кнопок Edit. Варіант Б використовує CSS що є крихким. Варіант Г використовує неіснуючу опцію `within`.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "If you call `.click()` on a locator that matches 3 elements, what happens?",
        uk: "Якщо викликати `.click()` на локаторі що збігається з 3 елементами, що станеться?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Playwright clicks all 3 elements in sequence.",
            uk: "Playwright клікає всі 3 елементи по черзі.",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright clicks the first matching element automatically.",
            uk: "Playwright автоматично клікає перший відповідний елемент.",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright throws a strict mode violation error because the locator is ambiguous.",
            uk: "Playwright кидає помилку strict mode violation бо локатор неоднозначний.",
          },
        },
        {
          id: "d",
          label: {
            en: "The click is silently skipped and the test continues.",
            uk: "Клік мовчки пропускається і тест продовжується.",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "Playwright enforces strict mode for action methods: when a locator resolves to more than one element, calling `.click()`, `.fill()`, or any other action throws a 'strict mode violation' error. This is intentional — Playwright refuses to guess which element you meant. To fix it, narrow the locator using a name filter, scope chain, or `.nth()` if the index is stable.",
        uk: "Playwright застосовує strict mode для методів дій: коли локатор збігається більш ніж з одним елементом, виклик `.click()`, `.fill()` або будь-якої іншої дії кидає помилку 'strict mode violation'. Це навмисно — Playwright відмовляється здогадуватися який елемент ти мав на увазі. Щоб виправити — звузь локатор фільтром за назвою, ланцюгом scope або `.nth()` якщо індекс стабільний.",
      },
    },
  ],
}
