import type { PlaywrightTopic } from "../../types"

export const testTimeoutsTopic: PlaywrightTopic = {
  slug: "test-timeouts",
  groupId: "test-runner",
  order: 380,
  level: "intermediate",
  trackOrder: 3,
  sourceDoc: "test-timeouts-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-timeouts",
  title: {
    en: "Timeouts",
    uk: "Тайм-аути",
  },
  summary: {
    en: "Three independent timeout layers: test timeout (30s — how long the whole test can run), expect timeout (5s — how long an assertion retries), and action timeout (none by default — per-click/fill/goto). The mistake I see most often: raising retries when the real problem is the 5-second expect timeout hitting a slow API.",
    uk: "Три незалежних шари тайм-аутів: тест-тайм-аут (30с — скільки може виконуватися весь тест), expect-тайм-аут (5с — скільки повторює перевірку), і action-тайм-аут (за замовчуванням немає — для кожного click/fill/goto). Помилка яку я бачу найчастіше: підіймають retries коли проблема насправді в 5-секундному expect-тайм-ауті що вбивається на повільному API.",
  },
  sections: [
    {
      id: "three-layers",
      title: {
        en: "Three independent layers",
        uk: "Три незалежних шари",
      },
      diagram: {
        mermaid: `flowchart TB
  GT["Global timeout — whole suite, optional"]
  TT["Test timeout — 30 s default\\n(beforeEach + test body + fixture setup)"]
  ET["Expect timeout — 5 s default\\nexpect(locator).toBeVisible() — assertion auto-retries"]
  AT["Action timeout — inherits test timeout\\nclick() / fill() / goto() — single action wait"]
  GT --> TT
  TT --> ET
  TT --> AT`,
        caption: {
          en: "The three timeout layers are independent — raising one does not affect the others",
          uk: "Три шари тайм-аутів незалежні — збільшення одного не впливає на інші",
        },
      },
      paragraphs: [
        {
          en: "Playwright has three timeout layers that work independently. Increasing one doesn't affect the others.",
          uk: "У Playwright три шари тайм-аутів що працюють незалежно. Збільшення одного не впливає на інші.",
        },
      ],
      codeBlocks: [
        {
          id: "overview",
          language: "ts",
          code: `// Шар 1 — тест-тайм-аут: скільки може виконуватися весь тест
// За замовчуванням: 30_000 ms
// Включає: тіло тесту + beforeEach + setup фікстур

// Шар 2 — expect-тайм-аут: скільки авто-повторює перевірка
// За замовчуванням: 5_000 ms
// Застосовується до: expect(locator).toBeVisible(), toHaveText(), тощо

// Шар 3 — action-тайм-аут: скільки чекати на одну дію
// За замовчуванням: немає (наслідує тест-тайм-аут)
// Застосовується до: click(), fill(), goto()`,
        },
      ],
    },
    {
      id: "test-timeout",
      title: {
        en: "Test timeout — 30 seconds by default",
        uk: "Тест-тайм-аут — 30 секунд за замовчуванням",
      },
      paragraphs: [
        {
          en: "The test timeout covers everything: test body, `beforeEach` hooks, and fixture setup. After teardown, the same timeout value applies again for fixture teardown and `afterEach` hooks.",
          uk: "Тест-тайм-аут покриває все: тіло тесту, хуки `beforeEach` і setup фікстур. Після завершення — той самий тайм-аут діє знову для teardown фікстур і хуків `afterEach`.",
        },
        {
          en: "When this timeout fires you see: `Timeout of 30000ms exceeded.` For slow tests I use `test.slow()` instead of hardcoding a large number — it triples the current timeout without touching config.",
          uk: "Коли цей тайм-аут спрацьовує бачиш: `Timeout of 30000ms exceeded.` Для повільних тестів я використовую `test.slow()` замість хардкоду великого числа — він потроює поточний тайм-аут без зміни конфігу.",
        },
      ],
      codeBlocks: [
        {
          id: "test-timeout-config",
          language: "ts",
          code: `// playwright.config.ts — глобальний тайм-аут
export default defineConfig({
  timeout: 60_000, // 60 секунд для всіх тестів
})`,
        },
        {
          id: "test-timeout-single",
          language: "ts",
          code: `// test.slow() — потроїти тайм-аут для одного тесту
test('generate full report', async ({ page }) => {
  test.slow() // 30s * 3 = 90s для цього тесту
  await page.goto('/reports/generate')
  await page.getByRole('button', { name: 'Generate' }).click()
  await expect(page.getByTestId('report-ready')).toBeVisible()
})

// test.setTimeout() — задати явно
test('import large dataset', async ({ page }) => {
  test.setTimeout(120_000) // 2 хвилини тільки для цього тесту
  await page.goto('/import')
  await page.getByRole('button', { name: 'Import all' }).click()
  await expect(page.getByTestId('import-complete')).toBeVisible()
})

// Розширити тайм-аут з beforeEach (наприклад, якщо setup повільний)
test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(testInfo.timeout + 30_000)
})`,
        },
      ],
    },
    {
      id: "expect-timeout",
      title: {
        en: "Expect timeout — 5 seconds by default",
        uk: "Expect-тайм-аут — 5 секунд за замовчуванням",
      },
      paragraphs: [
        {
          en: "This is the one that surprises people most. `expect(locator).toBeVisible()` doesn't just check once — it retries for up to 5 seconds. If the element appears in 4 seconds, the test passes. If it never appears, you get a timeout error.",
          uk: "Саме цей найбільше дивує людей. `expect(locator).toBeVisible()` не перевіряє один раз — він повторює до 5 секунд. Якщо елемент з'явиться за 4 секунди — тест проходить. Якщо ніколи не з'явиться — тайм-аут.",
        },
        {
          en: "For slow APIs or heavy animations I raise this to 10-15s globally, or pass a custom timeout per assertion.",
          uk: "Для повільних API або важких анімацій я підіймаю це до 10-15с глобально, або передаю кастомний тайм-аут у конкретну перевірку.",
        },
      ],
      codeBlocks: [
        {
          id: "expect-timeout-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  expect: {
    timeout: 10_000, // 10 секунд замість 5 для всіх перевірок
  },
})`,
        },
        {
          id: "expect-timeout-single",
          language: "ts",
          code: `// Кастомний тайм-аут для одного assertion
test('dashboard loads slow widget', async ({ page }) => {
  await page.goto('/dashboard')

  // Цей віджет завантажується з зовнішнього API — до 15 секунд
  await expect(page.getByTestId('analytics-widget'))
    .toBeVisible({ timeout: 15_000 })

  // Для звичайних елементів — стандартні 5 секунд
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "action-timeout",
      title: {
        en: "Action timeout — none by default",
        uk: "Action-тайм-аут — немає за замовчуванням",
      },
      paragraphs: [
        {
          en: "Actions like `click()`, `fill()`, `goto()` have no independent timeout by default — they're bounded by the test timeout. You can set a global action timeout in config, or pass a timeout per action. I use `actionTimeout: 10_000` on CI so a hung click fails fast instead of eating the full test timeout.",
          uk: "Дії типу `click()`, `fill()`, `goto()` не мають окремого тайм-ауту за замовчуванням — їх обмежує тест-тайм-аут. Можна задати глобальний action-тайм-аут у конфігу або передати тайм-аут у конкретну дію. Я використовую `actionTimeout: 10_000` на CI щоб зависла дія падала швидко замість того щоб з'їдати весь тест-тайм-аут.",
        },
      ],
      codeBlocks: [
        {
          id: "action-timeout-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  use: {
    // Кожна дія (click, fill, тощо) — максимум 10 секунд
    actionTimeout: 10_000,
    // Кожна навігація (goto, reload) — максимум 30 секунд
    navigationTimeout: 30_000,
  },
})`,
        },
        {
          id: "action-timeout-single",
          language: "ts",
          code: `// Кастомний тайм-аут для однієї дії
test('submit order', async ({ page }) => {
  await page.goto('/orders/new', { timeout: 30_000 })
  await page.getByLabel('Item').fill('Laptop Stand')

  // Клік по кнопці — 5 секунд (швидка дія)
  await page.getByRole('button', { name: 'Create' }).click({ timeout: 5_000 })

  await expect(page.getByTestId('order-created-banner')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "global-timeout",
      title: {
        en: "Global timeout — safety net for the whole run",
        uk: "Глобальний тайм-аут — страховка для всього запуску",
      },
      paragraphs: [
        {
          en: "No default. I set it to 1 hour on CI — if the whole suite takes longer than an hour, something is clearly wrong and I want CI to stop instead of running for hours eating up CI minutes.",
          uk: "За замовчуванням немає. Я встановлюю 1 годину на CI — якщо весь suite займає більше години значить щось явно пішло не так і хочу щоб CI зупинявся замість того щоб годинами їсти CI-хвилини.",
        },
      ],
      codeBlocks: [
        {
          id: "global-timeout",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  // Страховка: якщо весь запуск займає більше 60 хвилин — стоп
  globalTimeout: 60 * 60 * 1000, // 1 година
})`,
        },
      ],
    },
    {
      id: "fixture-timeout",
      title: {
        en: "Fixture timeout — for slow worker-scoped setup",
        uk: "Фікстура-тайм-аут — для повільного setup на рівні воркера",
      },
      paragraphs: [
        {
          en: "By default, fixtures share the test timeout. For slow worker-scoped fixtures — like seeding a database before the worker starts — I give them their own timeout so a slow seed doesn't eat into the test's 30 seconds.",
          uk: "За замовчуванням фікстури ділять тест-тайм-аут. Для повільних worker-scoped фікстур — наприклад, заповнення бази даних перед запуском воркера — я даю їм власний тайм-аут щоб повільний seed не з'їдав 30 секунд тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "fixture-timeout",
          language: "ts",
          code: `// Фікстура зі своїм тайм-аутом
export const test = base.extend({
  // Worker-scoped: запускається один раз перед усіма тестами воркера
  dbSeed: [async ({}, use) => {
    // Сидинг бази може займати до хвилини
    await seedTestDatabase()
    await use(null)
    await cleanupTestDatabase()
  }, { scope: 'worker', timeout: 60_000 }], // 60с — тільки для цієї фікстури
})

test('create order', async ({ page, dbSeed }) => {
  // Тест сам має стандартні 30с — фікстура їх не з'їдає
  await page.goto('/orders')
  await expect(page.getByTestId('order-list')).toBeVisible()
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A test fails with: 'Error: expect(received).toHaveText(expected) with timeout 5000ms'. The API response takes 8 seconds. What's the right fix?",
        uk: "Тест падає з помилкою: 'Error: expect(received).toHaveText(expected) with timeout 5000ms'. API-відповідь займає 8 секунд. Яке правильне рішення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add retries: 2 to the config — retrying the test will eventually pass",
            uk: "Додати retries: 2 до конфігу — повтори тесту врешті пройдуть",
          },
        },
        {
          id: "b",
          label: {
            en: "Increase expect.timeout to 10_000 in config, or pass { timeout: 10_000 } to the specific assertion",
            uk: "Збільшити expect.timeout до 10_000 у конфігу, або передати { timeout: 10_000 } у конкретну перевірку",
          },
        },
        {
          id: "c",
          label: {
            en: "Increase the test timeout to 60_000 — more test time means more time for assertions",
            uk: "Збільшити тест-тайм-аут до 60_000 — більше часу на тест означає більше часу на перевірки",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Test timeout and expect timeout are independent. The error clearly says 'with timeout 5000ms' — that's the expect timeout. Increasing test timeout doesn't help. Retries also don't help — the assertion will still time out on each retry. Fix the right layer: raise `expect.timeout` globally or pass `{ timeout: 10_000 }` to the specific `expect(...)` call.",
        uk: "Тест-тайм-аут і expect-тайм-аут незалежні. Помилка чітко каже 'with timeout 5000ms' — це expect-тайм-аут. Збільшення тест-тайм-ауту не допоможе. Retries теж не допоможуть — перевірка все одно буде тайм-аутитись при кожному повторі. Виправляй правильний шар: підійми `expect.timeout` глобально або передай `{ timeout: 10_000 }` у конкретний `expect(...)` виклик.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You have a worker-scoped fixture that seeds a test database — it takes up to 45 seconds. Tests themselves take 5-10 seconds. How do you prevent the seed from eating the test timeout?",
        uk: "У тебе є worker-scoped фікстура що заповнює тестову базу — займає до 45 секунд. Самі тести займають 5-10 секунд. Як не дати seed з'їсти тест-тайм-аут?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set the global test timeout to 120_000 — enough for seed + test",
            uk: "Встановити глобальний тест-тайм-аут 120_000 — достатньо для seed + тест",
          },
        },
        {
          id: "b",
          label: {
            en: "Give the fixture its own timeout: { scope: 'worker', timeout: 60_000 }",
            uk: "Дати фікстурі власний тайм-аут: { scope: 'worker', timeout: 60_000 }",
          },
        },
        {
          id: "c",
          label: {
            en: "Move the seed to globalSetup — it runs outside test timeouts",
            uk: "Перенести seed у globalSetup — він виконується поза тест-тайм-аутами",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Fixture-level timeout is exactly what this is for. Setting `{ scope: 'worker', timeout: 60_000 }` gives the fixture 60 seconds independently of the test timeout — tests keep their own 30s. Raising the global test timeout to 120s is a blunt instrument that makes slow tests harder to detect. globalSetup works but loses the fixture's ability to use worker-scoped state.",
        uk: "Фікстура-тайм-аут саме для цього існує. Задаючи `{ scope: 'worker', timeout: 60_000 }` ти даєш фікстурі 60 секунд незалежно від тест-тайм-ауту — тести зберігають свої 30с. Підіймати глобальний тест-тайм-аут до 120с — грубий інструмент що ускладнює виявлення повільних тестів. globalSetup працює але втрачаєш можливість фікстури використовувати worker-scoped стан.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the default test timeout in Playwright?",
        uk: "Який тест-тайм-аут за замовчуванням у Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "10 seconds",
            uk: "10 секунд",
          },
        },
        {
          id: "b",
          label: {
            en: "30 seconds",
            uk: "30 секунд",
          },
        },
        {
          id: "c",
          label: {
            en: "60 seconds",
            uk: "60 секунд",
          },
        },
        {
          id: "d",
          label: {
            en: "No timeout — tests run until they finish",
            uk: "Немає тайм-ауту — тести виконуються до завершення",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The default test timeout is 30 000 ms (30 seconds). This covers the test body, `beforeEach` hooks, and fixture setup combined. The default expect timeout is 5 000 ms (5 seconds) — a separate, independent value. Action timeout has no default — it inherits from the test timeout.",
        uk: "Тест-тайм-аут за замовчуванням — 30 000 мс (30 секунд). Це покриває тіло тесту, хуки `beforeEach` і setup фікстур разом. Expect-тайм-аут за замовчуванням — 5 000 мс (5 секунд) — окреме незалежне значення. Action-тайм-аут за замовчуванням відсутній — успадковується від тест-тайм-ауту.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How does `test.slow()` work and when should you use it?",
        uk: "Як працює `test.slow()` і коли його використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It sets the test timeout to 60 seconds unconditionally",
            uk: "Встановлює тест-тайм-аут на 60 секунд безумовно",
          },
        },
        {
          id: "b",
          label: {
            en: "It triples the current test timeout — useful for tests that are inherently slow without hardcoding a specific number",
            uk: "Потроює поточний тест-тайм-аут — корисно для тестів що є за природою повільними без хардкоду конкретного числа",
          },
        },
        {
          id: "c",
          label: {
            en: "It slows down every action by 3× to make the test more stable",
            uk: "Сповільнює кожну дію в 3 рази щоб зробити тест стабільнішим",
          },
        },
        {
          id: "d",
          label: {
            en: "It marks the test as slow in the reporter but does not change the timeout",
            uk: "Позначає тест як повільний у репортері але не змінює тайм-аут",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.slow()` triples the configured test timeout for that specific test. If the global timeout is 30s, calling `test.slow()` gives that test 90s. This is better than `test.setTimeout(90_000)` because it stays proportional — if you later change the global timeout to 60s, the slow test gets 180s automatically. Use it for tests like report generation or data import that genuinely need more time.",
        uk: "`test.slow()` потроює налаштований тест-тайм-аут для того конкретного тесту. Якщо глобальний тайм-аут 30с, виклик `test.slow()` дає тому тесту 90с. Краще ніж `test.setTimeout(90_000)` бо залишається пропорційним — якщо пізніше змінити глобальний тайм-аут на 60с, повільний тест автоматично отримає 180с. Використовуй для тестів типу генерації звітів або імпорту даних що справді потребують більше часу.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What is the default expect timeout and what does it control?",
        uk: "Який expect-тайм-аут за замовчуванням і що він контролює?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "30 seconds — same as the test timeout, controlling how long the whole test assertion block can take",
            uk: "30 секунд — те саме що тест-тайм-аут, контролює скільки може тривати весь блок перевірок тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "5 seconds — how long an auto-retrying assertion like expect(locator).toBeVisible() keeps retrying before giving up",
            uk: "5 секунд — скільки авто-повторювана перевірка типу expect(locator).toBeVisible() продовжує повторюватися перед здачею",
          },
        },
        {
          id: "c",
          label: {
            en: "1 second — assertions check once and fail immediately if the condition is not met",
            uk: "1 секунда — перевірки виконуються один раз і одразу падають якщо умова не виконана",
          },
        },
        {
          id: "d",
          label: {
            en: "No default — each assertion requires an explicit timeout parameter",
            uk: "Немає за замовчуванням — кожна перевірка вимагає явного параметра timeout",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The expect timeout (default: 5 000 ms) controls how long locator-based assertions like `toBeVisible()`, `toHaveText()`, `toBeEnabled()` keep polling before failing. They don't check once — they retry until the condition is met or the timeout expires. This is separate from the test timeout and from the action timeout. You can change it globally with `expect: { timeout: 10_000 }` in `defineConfig`.",
        uk: "Expect-тайм-аут (за замовчуванням: 5 000 мс) контролює скільки часу перевірки на основі локаторів типу `toBeVisible()`, `toHaveText()`, `toBeEnabled()` продовжують опитування перед падінням. Вони не перевіряють один раз — повторюють поки умова не виконана або тайм-аут не вичерпається. Це незалежно від тест-тайм-ауту і action-тайм-ауту. Можна змінити глобально через `expect: { timeout: 10_000 }` у `defineConfig`.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you set a global action timeout so every click(), fill(), and goto() fails after 10 seconds if not complete?",
        uk: "Як встановити глобальний action-тайм-аут щоб кожен click(), fill() і goto() падав після 10 секунд якщо не завершився?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set timeout: 10_000 at the top level of defineConfig",
            uk: "Встановити timeout: 10_000 на верхньому рівні defineConfig",
          },
        },
        {
          id: "b",
          label: {
            en: "Set actionTimeout: 10_000 inside the use: {} block",
            uk: "Встановити actionTimeout: 10_000 всередині блоку use: {}",
          },
        },
        {
          id: "c",
          label: {
            en: "Call page.setDefaultTimeout(10_000) in a beforeEach hook",
            uk: "Викликати page.setDefaultTimeout(10_000) у хуку beforeEach",
          },
        },
        {
          id: "d",
          label: {
            en: "Set clickTimeout: 10_000 and fillTimeout: 10_000 individually in the use block",
            uk: "Встановити clickTimeout: 10_000 і fillTimeout: 10_000 окремо у блоці use",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`actionTimeout` in the `use` block sets the maximum time for every individual action — click, fill, goto, etc. — across all tests. `page.setDefaultTimeout()` also works but must be called per test/fixture. The top-level `timeout` is the test timeout, not the action timeout. There are no separate `clickTimeout` or `fillTimeout` options.",
        uk: "`actionTimeout` у блоці `use` встановлює максимальний час для кожної окремої дії — click, fill, goto тощо — у всіх тестах. `page.setDefaultTimeout()` також працює але потрібно викликати в кожному тесті/фікстурі. Top-level `timeout` — це тест-тайм-аут, а не action-тайм-аут. Окремих опцій `clickTimeout` або `fillTimeout` немає.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What happens when the test timeout fires during a page.goto() call?",
        uk: "Що відбувається коли тест-тайм-аут спрацьовує під час виклику page.goto()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The goto() is cancelled and the test continues with the next line",
            uk: "goto() скасовується і тест продовжується з наступного рядка",
          },
        },
        {
          id: "b",
          label: {
            en: "The test is marked as failed with a timeout error; teardown and fixture cleanup still run",
            uk: "Тест позначається як невдалий з помилкою тайм-ауту; teardown і очищення фікстур все одно виконуються",
          },
        },
        {
          id: "c",
          label: {
            en: "The worker is killed immediately with no cleanup",
            uk: "Воркер негайно вбивається без жодного очищення",
          },
        },
        {
          id: "d",
          label: {
            en: "Playwright retries the goto() call automatically",
            uk: "Playwright автоматично повторює виклик goto()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When any timeout fires (test, action, or expect), Playwright interrupts the current operation and marks the test as failed with a `TimeoutError`. Importantly, fixture teardown still runs — so cleanup code in your fixtures (after `await use(value)`) executes even when the test times out. This ensures no leaked state even on timeout failures.",
        uk: "Коли спрацьовує будь-який тайм-аут (тест, action або expect), Playwright перериває поточну операцію і позначає тест як невдалий з `TimeoutError`. Важливо: teardown фікстур все одно виконується — тому код очищення у фікстурах (після `await use(value)`) виконується навіть коли тест отримує тайм-аут. Це гарантує що стан не витікає навіть при тайм-аут-падіннях.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Which config option sets a safety-net timeout for the entire test suite run — not for individual tests?",
        uk: "Яка опція конфігу встановлює захисний тайм-аут для всього запуску suite — а не для окремих тестів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "timeout — the top-level test timeout option",
            uk: "timeout — top-level опція тест-тайм-ауту",
          },
        },
        {
          id: "b",
          label: {
            en: "suiteTimeout — a dedicated option for the whole run",
            uk: "suiteTimeout — спеціальна опція для всього запуску",
          },
        },
        {
          id: "c",
          label: {
            en: "globalTimeout — stops the entire run if it exceeds the value",
            uk: "globalTimeout — зупиняє весь запуск якщо він перевищує значення",
          },
        },
        {
          id: "d",
          label: {
            en: "maxTime — only available as a CLI flag",
            uk: "maxTime — доступний лише як CLI-прапор",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`globalTimeout` in `defineConfig` sets a time limit for the entire test run. If all tests combined take longer than this value, Playwright stops the run and reports a timeout error. There is no default — you must opt into it. A common setting is 1 hour on CI to prevent runaway test runs from consuming all CI minutes. There is no `suiteTimeout` or `maxTime` option.",
        uk: "`globalTimeout` у `defineConfig` встановлює обмеження часу для всього запуску тестів. Якщо всі тести разом займають більше цього значення — Playwright зупиняє запуск і повідомляє про помилку тайм-ауту. За замовчуванням немає — треба явно встановити. Поширене значення — 1 година на CI щоб запуски що вийшли з-під контролю не з'їдали всі CI-хвилини. Опцій `suiteTimeout` або `maxTime` не існує.",
      },
    },
  ],
}
