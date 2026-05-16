import type { PlaywrightTopic } from "../../types"

export const testRetriesTopic: PlaywrightTopic = {
  slug: "test-retries",
  groupId: "test-runner",
  order: 365,
  level: "intermediate",
  trackOrder: 2,
  sourceDoc: "test-retries-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-retries",
  title: {
    en: "Retries",
    uk: "Повторні спроби",
  },
  summary: {
    en: "Retries exist for flaky tests — ones that sometimes pass and sometimes fail without code changes. My rule: fix the root cause first, add retries second. Retries mask real problems if overused. On CI I set retries: 2. Locally, retries: 0 — if it fails, I want to know immediately.",
    uk: "Повтори існують для flaky-тестів — тих що іноді проходять і іноді падають без змін коду. Моє правило: спочатку виправити першопричину, потім додати повтори. Повтори маскують реальні проблеми при надмірному використанні. На CI я встановлюю retries: 2. Локально — retries: 0, якщо падає хочу знати одразу.",
  },
  sections: [
    {
      id: "configure-retries",
      title: {
        en: "Configure retries",
        uk: "Налаштувати повторні спроби",
      },
      paragraphs: [
        {
          en: "Set `retries` globally in config, or override with `--retries` CLI flag. When a test fails, Playwright retries it in a new worker process with a fresh browser — no shared state from the previous attempt.",
          uk: "Встановити `retries` глобально в конфіг, або перевизначити через CLI-прапор `--retries`. Коли тест падає, Playwright повторює його в новому процесі воркера зі свіжим браузером — без спільного стану з попередньої спроби.",
        },
      ],
      codeBlocks: [
        {
          id: "configure",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  // На CI — 2 повтори; локально — 0
  retries: process.env.CI ? 2 : 0,
})`,
        },
        {
          id: "cli-retries",
          language: "bash",
          code: `# Перевизначити через CLI (корисно для дебагу)
npx playwright test --retries=3

# Запустити з повторами для одного файлу
npx playwright test orders.spec.ts --retries=2`,
        },
      ],
    },
    {
      id: "flaky-classification",
      title: {
        en: "How Playwright classifies tests after retries",
        uk: "Як Playwright класифікує тести після повторів",
      },
      diagram: {
        mermaid: `flowchart TD
  RUN["Test run\n(retries: 2)"] --> A1["Attempt 1"]
  A1 -->|"✓ pass"| PASS["✓ passed"]
  A1 -->|"✗ fail"| A2["Attempt 2\n(fresh worker)"]
  A2 -->|"✓ pass"| FLAKY["⚠ flaky"]
  A2 -->|"✗ fail"| A3["Attempt 3\n(fresh worker)"]
  A3 -->|"✓ pass"| FLAKY
  A3 -->|"✗ fail"| FAIL["✗ failed"]`,
        caption: {
          en: "Retry classification: passed = first attempt only, flaky = later retry succeeded, failed = all attempts failed",
          uk: "Класифікація після повторів: passed = лише перша спроба, flaky = пізніша спроба успішна, failed = всі спроби невдалі",
        },
      },
      paragraphs: [
        {
          en: "The HTML report shows three categories. The \"flaky\" category is especially useful — it means the test is not consistently reliable and should be investigated.",
          uk: "HTML-репорт показує три категорії. Категорія «flaky» особливо корисна — означає що тест нестабільний і варто розслідувати причину.",
        },
      ],
      codeBlocks: [
        {
          id: "classification",
          language: "text",
          code: `Після запуску з retries: 2:

✓ passed   — пройшов з першого разу
⚠ flaky    — впав на першому запуску, пройшов після повтору
✗ failed   — впав і всі повтори теж впали`,
        },
      ],
    },
    {
      id: "detect-retry-in-test",
      title: {
        en: "Detect retry inside a test",
        uk: "Виявити повторну спробу всередині тесту",
      },
      paragraphs: [
        {
          en: "`testInfo.retry` is the retry attempt number — `0` on the first run, `1` on the first retry, etc. Use it to clear server state between retries, or to do extra logging on the retry attempt.",
          uk: "`testInfo.retry` — номер спроби повтору: `0` при першому запуску, `1` при першому повторі тощо. Використовуй щоб очистити серверний стан між повторами або додати додаткове логування при повторній спробі.",
        },
      ],
      codeBlocks: [
        {
          id: "detect-retry",
          language: "ts",
          code: `test('create order', async ({ page }, testInfo) => {
  // Якщо це повтор — очистити сміття від попередньої спроби
  if (testInfo.retry > 0) {
    await page.request.delete('/api/test/cleanup-orders')
    console.log(\`Retry #\${testInfo.retry} — cleaned up previous test data\`)
  }

  await page.goto('/orders/new')
  await page.getByLabel('Item').fill('Laptop Stand')
  await page.getByRole('button', { name: 'Create' }).click()
  await expect(page.getByTestId('order-created-banner')).toBeVisible()
})

// Або в фікстурі — очищення відбувається централізовано
export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    if (testInfo.retry > 0) {
      await page.request.delete('/api/test/reset')
    }
    await use(page)
  },
})`,
        },
      ],
    },
    {
      id: "serial-mode",
      title: {
        en: "Serial mode — dependent tests that must run in order",
        uk: "Serial режим — залежні тести що мають виконуватися по черзі",
      },
      paragraphs: [
        {
          en: "By default, tests in a file run independently — if one fails, others still run normally. `test.describe.configure({ mode: 'serial' })` changes this: if one test fails, all subsequent tests in the group are skipped. When retrying, the entire group restarts from the beginning.",
          uk: "За замовчуванням тести у файлі виконуються незалежно — якщо один падає, інші все одно виконуються нормально. `test.describe.configure({ mode: 'serial' })` змінює це: якщо один тест падає, всі наступні тести в групі пропускаються. При повторі — вся група перезапускається з початку.",
        },
        {
          en: "Use serial mode only when tests genuinely depend on each other — like a multi-step workflow where step 2 can't run without step 1 completing. For most tests, keep them independent.",
          uk: "Використовуй serial mode тільки коли тести справді залежать один від одного — наприклад багатокроковий workflow де крок 2 не може виконатися без завершення кроку 1. Для більшості тестів — тримай їх незалежними.",
        },
      ],
      codeBlocks: [
        {
          id: "serial",
          language: "ts",
          code: `test.describe('order creation flow', () => {
  // Вся група — sequential; якщо один впав — решта пропускається
  test.describe.configure({ mode: 'serial' })

  let createdOrderId: string

  test('create order', async ({ page }) => {
    await page.goto('/orders/new')
    await page.getByLabel('Item').fill('Laptop Stand')
    await page.getByRole('button', { name: 'Create' }).click()

    await page.waitForURL(/\\/orders\\/\\d+/)
    // Зберегти ID для наступного тесту
    createdOrderId = page.url().match(/\\/orders\\/(\\d+)/)?.[1] ?? ''
  })

  test('update order status', async ({ page }) => {
    // Цей тест залежить від попереднього (createdOrderId)
    await page.goto(\`/orders/\${createdOrderId}\`)
    await page.getByRole('combobox', { name: 'Status' }).selectOption('shipped')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByTestId('status-badge')).toHaveText('Shipped')
  })

  test('verify order in list', async ({ page }) => {
    await page.goto('/orders')
    await expect(
      page.getByTestId('order-row').filter({ hasText: createdOrderId })
        .getByTestId('status-badge')
    ).toHaveText('Shipped')
  })
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A test passes locally but fails intermittently on CI. After adding retries: 2, the HTML report shows it as 'flaky'. What does that mean?",
        uk: "Тест проходить локально але нестабільно падає на CI. Після додавання retries: 2, HTML-репорт показує його як 'flaky'. Що це означає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The test passed — 'flaky' is just an informational badge, not a failure",
            uk: "Тест пройшов — 'flaky' просто інформаційний бейдж, не падіння",
          },
        },
        {
          id: "b",
          label: {
            en: "The test failed on the first run but passed after a retry — it's unreliable and should be investigated",
            uk: "Тест впав при першому запуску але пройшов після повтору — він ненадійний і потребує розслідування",
          },
        },
        {
          id: "c",
          label: {
            en: "The test was skipped because it's marked as flaky",
            uk: "Тест був пропущений бо позначений як flaky",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "'Flaky' means: failed attempt 1, passed on retry. The build may show as passing but this is a warning sign — the test is not deterministic. Investigate the root cause: timing issues, external dependencies, or test isolation problems. Don't just add more retries.",
        uk: "'Flaky' означає: впав при першій спробі, пройшов при повторі. Збірка може відображатися як успішна але це попереджувальний знак — тест не є детермінованим. Розслідуй першопричину: проблеми тайміногу, зовнішні залежності або проблеми ізоляції тестів. Не просто додавай більше повторів.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "When does test.describe.configure({ mode: 'serial' }) make sense?",
        uk: "Коли test.describe.configure({ mode: 'serial' }) має сенс?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Always — serial mode makes tests more reliable",
            uk: "Завжди — serial режим робить тести надійнішими",
          },
        },
        {
          id: "b",
          label: {
            en: "When tests genuinely depend on each other — like a multi-step flow where step 2 needs step 1's output",
            uk: "Коли тести справді залежать один від одного — наприклад багатокроковий flow де крок 2 потребує результату кроку 1",
          },
        },
        {
          id: "c",
          label: {
            en: "Only when running on CI to avoid parallel execution issues",
            uk: "Тільки при запуску на CI щоб уникнути проблем паралельного виконання",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Serial mode makes sense only when tests have real data dependencies between them. For most tests, keep them independent — serial mode means one failure skips all subsequent tests in the group, making failures harder to diagnose. If you find yourself wanting serial mode often, it's usually a sign that tests need better isolation or fixtures.",
        uk: "Serial режим має сенс тільки коли між тестами є справжні залежності за даними. Для більшості тестів — тримай їх незалежними. Serial mode означає що одне падіння пропускає всі наступні тести в групі, роблячи падіння важчими для діагностики. Якщо часто хочеться serial mode — це зазвичай знак що тестам потрібна краща ізоляція або фікстури.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "How do you set retries globally for all tests in a project?",
        uk: "Як встановити повторні спроби глобально для всіх тестів у проєкті?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add retries: 2 inside the use: {} block of playwright.config.ts",
            uk: "Додати retries: 2 всередині блоку use: {} у playwright.config.ts",
          },
        },
        {
          id: "b",
          label: {
            en: "Set retries: 2 at the top level of defineConfig in playwright.config.ts",
            uk: "Встановити retries: 2 на верхньому рівні defineConfig у playwright.config.ts",
          },
        },
        {
          id: "c",
          label: {
            en: "Call test.retry(2) at the top of every test file",
            uk: "Викликати test.retry(2) на початку кожного файлу тестів",
          },
        },
        {
          id: "d",
          label: {
            en: "Pass --retry=2 when running npm test",
            uk: "Передати --retry=2 при запуску npm test",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`retries` is a top-level runner option in `defineConfig` — the same level as `timeout`, `workers`, and `reporter`. Placing it in `use` does nothing. The correct CLI flag is `--retries` (plural), not `--retry`. There is no `test.retry()` API — you check `testInfo.retry` to read the current attempt number.",
        uk: "`retries` — top-level опція раннера у `defineConfig` — того ж рівня що `timeout`, `workers` і `reporter`. Розміщення в `use` нічого не дає. Правильний CLI-прапор — `--retries` (множина), а не `--retry`. API `test.retry()` не існує — ти читаєш `testInfo.retry` щоб дізнатися поточний номер спроби.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What is the value of `testInfo.retry` on the very first run of a test (before any retries)?",
        uk: "Яке значення `testInfo.retry` при першому запуску тесту (до будь-яких повторів)?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "1 — the first attempt is retry number 1",
            uk: "1 — перша спроба є повтором номер 1",
          },
        },
        {
          id: "b",
          label: {
            en: "0 — the first run is attempt 0; the first retry is 1",
            uk: "0 — перший запуск є спробою 0; перший повтор є 1",
          },
        },
        {
          id: "c",
          label: {
            en: "undefined — it is only set when a retry actually happens",
            uk: "undefined — встановлюється лише коли справді відбувається повтор",
          },
        },
        {
          id: "d",
          label: {
            en: "null — representing no retry yet",
            uk: "null — означає що повтору ще не було",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`testInfo.retry` is `0` on the first run, `1` on the first retry, `2` on the second retry, and so on. This lets you write `if (testInfo.retry > 0)` to run cleanup code only when the test is actually being retried — not on the very first attempt. It is always a number, never `undefined` or `null`.",
        uk: "`testInfo.retry` дорівнює `0` при першому запуску, `1` при першому повторі, `2` при другому повторі тощо. Це дозволяє писати `if (testInfo.retry > 0)` щоб запускати код очищення лише коли тест справді повторюється — не при першій спробі. Це завжди число, ніколи `undefined` або `null`.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What is the difference between `retries` and `--repeat-each` in Playwright?",
        uk: "Яка різниця між `retries` і `--repeat-each` у Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are the same — both re-run a failing test",
            uk: "Вони однакові — обидва перезапускають тест що впав",
          },
        },
        {
          id: "b",
          label: {
            en: "retries only re-runs a test when it fails; --repeat-each runs every test N times regardless of pass or fail",
            uk: "retries перезапускає тест лише коли він падає; --repeat-each запускає кожен тест N разів незалежно від результату",
          },
        },
        {
          id: "c",
          label: {
            en: "retries is for the whole suite; --repeat-each is for a single test file",
            uk: "retries для всього suite; --repeat-each для одного файлу тестів",
          },
        },
        {
          id: "d",
          label: {
            en: "--repeat-each is the CLI equivalent of retries in the config file",
            uk: "--repeat-each є CLI-еквівалентом retries у файлі конфігу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`retries` is conditional — it only re-runs a test when that test fails. `--repeat-each N` is unconditional — it runs every test exactly N times whether it passes or fails. `--repeat-each` is used to expose flaky tests (run everything 5 times to see if any test sometimes fails) rather than to handle failures in production CI.",
        uk: "`retries` — умовний: перезапускає тест лише коли він падає. `--repeat-each N` — безумовний: запускає кожен тест рівно N разів незалежно від того чи він проходить. `--repeat-each` використовується щоб виявити flaky-тести (запустити все 5 разів щоб побачити чи якийсь тест іноді падає), а не для обробки падінь у продакшн CI.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "When a test is retried, what state does it start with?",
        uk: "З яким станом починається тест при повторній спробі?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The exact browser state from the end of the failed attempt — cookies, localStorage and all",
            uk: "Точний стан браузера з кінця невдалої спроби — cookies, localStorage і все",
          },
        },
        {
          id: "b",
          label: {
            en: "A completely fresh state — new worker process, new browser, all fixtures re-run from scratch",
            uk: "Повністю свіжий стан — новий процес воркера, новий браузер, всі фікстури перезапускаються з нуля",
          },
        },
        {
          id: "c",
          label: {
            en: "The same browser but with cookies cleared",
            uk: "Той самий браузер але з очищеними cookies",
          },
        },
        {
          id: "d",
          label: {
            en: "The state depends on whether storageState is set in the config",
            uk: "Стан залежить від того чи встановлено storageState у конфігу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A retry starts completely fresh: the old worker is killed, a new worker process starts, and all fixtures (including `page`, `context`, and any custom fixtures) are re-instantiated from scratch. This is why you can use `testInfo.retry > 0` to detect a retry and run extra cleanup — because the test itself starts clean, but server-side state from the previous attempt might still exist.",
        uk: "Повтор починається повністю з нуля: старий воркер вбивається, стартує новий процес воркера, і всі фікстури (включаючи `page`, `context` та будь-які кастомні) перестворюються з нуля. Ось чому можна використовувати `testInfo.retry > 0` щоб виявити повтор і запустити додаткове очищення — сам тест починається чистим, але серверний стан від попередньої спроби може ще існувати.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to override the global retries count for one specific describe block. Which API do you use?",
        uk: "Хочеш перевизначити глобальну кількість повторів для одного конкретного describe-блоку. Який API використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "test.use({ retries: 3 }) inside the describe block",
            uk: "test.use({ retries: 3 }) всередині describe-блоку",
          },
        },
        {
          id: "b",
          label: {
            en: "test.describe.configure({ retries: 3 }) inside the describe block",
            uk: "test.describe.configure({ retries: 3 }) всередині describe-блоку",
          },
        },
        {
          id: "c",
          label: {
            en: "test.setTimeout(retries: 3) inside the describe block",
            uk: "test.setTimeout(retries: 3) всередині describe-блоку",
          },
        },
        {
          id: "d",
          label: {
            en: "It is not possible to override retries per describe block",
            uk: "Неможливо перевизначити повтори на рівні describe-блоку",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.describe.configure({ retries: N })` overrides the global retries count for all tests in that specific describe block. This is useful when a subset of tests is known to be flaky due to an external dependency — you can give them more retries without inflating the count for the entire suite. `test.use()` is for browser/page options, not runner options.",
        uk: "`test.describe.configure({ retries: N })` перевизначає глобальну кількість повторів для всіх тестів у тому конкретному describe-блоку. Корисно коли підмножина тестів відома як нестабільна через зовнішню залежність — можна дати їм більше повторів не роздуваючи кількість для всього suite. `test.use()` — для опцій браузера/сторінки, а не опцій раннера.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "A test creates a record in the database on the first run, then fails. On the retry, the test tries to create the same unique record and gets a duplicate key error. What is the best fix?",
        uk: "Тест створює запис у базі при першому запуску, потім падає. При повторній спробі тест намагається створити той самий унікальний запис і отримує помилку дублікату ключа. Яке найкраще рішення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Disable retries for tests that write to the database",
            uk: "Вимкнути повтори для тестів що записують у базу",
          },
        },
        {
          id: "b",
          label: {
            en: "Use testInfo.retry > 0 to delete the record created by the previous attempt before re-running the test logic",
            uk: "Використовувати testInfo.retry > 0 щоб видалити запис створений попередньою спробою перед повторним виконанням логіки тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "Use a random UUID for the record key so duplicates are impossible",
            uk: "Використовувати випадковий UUID для ключа запису щоб дублікати були неможливі",
          },
        },
        {
          id: "d",
          label: {
            en: "Move the database write to a beforeEach hook so it does not run on retries",
            uk: "Перенести запис до бази у хук beforeEach щоб він не виконувався при повторах",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Check `testInfo.retry > 0` at the start of the test and clean up server-side state from the previous attempt before proceeding. This is the intended pattern for tests that have side effects — the retry starts with a clean browser but not a clean server. Option C (random UUID) can also work but makes assertions harder and doesn't clean up orphaned records.",
        uk: "Перевіряй `testInfo.retry > 0` на початку тесту і очищуй серверний стан від попередньої спроби перед продовженням. Це призначений патерн для тестів що мають побічні ефекти — повтор починається з чистим браузером але не з чистим сервером. Варіант C (випадковий UUID) також може спрацювати але ускладнює перевірки і не очищує осиротілі записи.",
      },
    },
  ],
}
