import type { PlaywrightTopic } from "../../types"

export const testAnnotationsTopic: PlaywrightTopic = {
  slug: "test-annotations",
  groupId: "test-runner",
  order: 310,
  level: "intermediate",
  trackOrder: 1,
  sourceDoc: "test-annotations-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-annotations",
  title: {
    en: "Annotations",
    uk: "Анотації",
  },
  summary: {
    en: "Four built-in annotations control how tests run: skip (don't run), fixme (known failure, don't run), fail (expect failure, do run), slow (triple the timeout). I use test.skip(condition) constantly — it's how I handle browser-specific bugs without deleting the test.",
    uk: "Чотири вбудовані анотації контролюють як тести запускаються: skip (не запускати), fixme (відомий збій, не запускати), fail (очікується збій, запустити), slow (потроїти таймаут). Я постійно використовую test.skip(condition) — так обробляю браузерно-специфічні баги не видаляючи тест.",
  },
  sections: [
    {
      id: "four-built-in-annotations",
      title: {
        en: "The four built-in annotations",
        uk: "Чотири вбудовані анотації",
      },
      diagram: {
        mermaid: `flowchart LR
  A["test()"] --> SK["test.skip\nnot run, not reported"]
  A --> FX["test.fixme\nnot run — known breakage"]
  A --> FA["test.fail\nrun — assert it FAILS"]
  A --> SL["test.slow\nrun with 3× timeout"]
  FA -->|"if it passes"| WARN["⚠ warning: fixme this!"]`,
        caption: {
          en: "test.fail is the unusual one — Playwright runs it and expects failure; if it passes unexpectedly, you get an error",
          uk: "test.fail особливий — Playwright запускає тест і очікує падіння; якщо тест раптово проходить — ви отримаєте помилку",
        },
      },
      paragraphs: [
        {
          en: "Each one changes what Playwright does with the test in a different way.",
          uk: "Кожна змінює що Playwright робить з тестом по-різному.",
        },
      ],
      codeBlocks: [
        {
          id: "four-annotations",
          language: "ts",
          code: `// test.skip — не запускати (тест пропускається, зеленого/червоного немає)
test.skip('search not yet implemented', async ({ page }) => {
  await page.goto('/search')
  await expect(page.getByRole('searchbox')).toBeVisible()
})

// test.fixme — відомий збій, не запускати
// Різниця з skip: fixme = "я знаю що це зламано, треба виправити"
test.fixme('order export crashes on large datasets', async ({ page }) => {
  await page.goto('/orders')
  await page.getByRole('button', { name: 'Export all' }).click()
  await expect(page.getByRole('link', { name: 'Download CSV' })).toBeVisible()
})

// test.fail — очікується що тест ВПАДЕ
// Playwright запустить його і перевірить що він справді падає
// Якщо пройде — Playwright скаржиться! Значить фіча виправлена і анотацію можна прибрати
test.fail('pagination broken in Firefox — JIRA-142', async ({ page }) => {
  await page.goto('/orders')
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(page.getByTestId('order-row')).toHaveCount(10)
})

// test.slow — потроїти дефолтний таймаут
// Якщо тест займає 40+ секунд і 30-секундного дефолту не вистачає
test.slow('full report generation', async ({ page }) => {
  await page.goto('/reports/generate')
  await page.getByRole('button', { name: 'Generate report' }).click()
  await expect(page.getByTestId('report-ready')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "conditional-skip",
      title: {
        en: "Conditional skip — browser or environment specific",
        uk: "Умовний skip — специфічний браузер або середовище",
      },
      paragraphs: [
        {
          en: "The most useful pattern I know: skip a test only on a specific browser. The bug is real, the ticket is filed, but I don't want the whole test suite to be red just because of a Safari-specific issue.",
          uk: "Найкорисніший патерн який я знаю: пропустити тест тільки у конкретному браузері. Баг реальний, тікет є, але я не хочу щоб весь тест-сьют був червоним через Safari-специфічний баг.",
        },
      ],
      codeBlocks: [
        {
          id: "conditional-skip",
          language: "ts",
          code: `// Пропустити в конкретному браузері
test('drag and drop reorders items', async ({ page, browserName }) => {
  test.skip(browserName === 'firefox', 'JIRA-198: drag API behaves differently in Firefox')

  await page.goto('/orders')
  // ... drag and drop тест
})

// Пропустити на CI (наприклад, якщо тест потребує локального файлу)
test('import from CSV', async ({ page }) => {
  test.skip(!!process.env.CI, 'Requires local test fixture file')
  // ...
})

// Пропустити групу тестів умовно — через describe
test.describe('payment tests', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Payment widget — Chromium only')

  test('card payment flow', async ({ page }) => { /* ... */ })
  test('PayPal redirect', async ({ page }) => { /* ... */ })
})`,
        },
      ],
    },
    {
      id: "test-only",
      title: {
        en: "test.only — focus on one test locally",
        uk: "test.only — сфокусуватися на одному тесті локально",
      },
      paragraphs: [
        {
          en: "When debugging, add `test.only()` to run just that test. The whole file becomes focused on it. **Never commit `test.only`** — use `forbidOnly: !!process.env.CI` in config to make CI fail if you accidentally leave it in.",
          uk: "При дебагу — додай `test.only()` щоб запустити тільки цей тест. Весь файл стає зосередженим на ньому. **Ніколи не комітити `test.only`** — використовуй `forbidOnly: !!process.env.CI` у конфігурації щоб CI падав якщо ти випадково залишив це.",
        },
      ],
      codeBlocks: [
        {
          id: "test-only",
          language: "ts",
          code: `// Локально — запустити тільки цей тест
test.only('order status update', async ({ page }) => {
  await page.goto('/orders/42')
  await page.getByRole('combobox', { name: 'Status' }).selectOption('shipped')
  await expect(page.getByTestId('status-badge')).toHaveText('Shipped')
})

// В playwright.config.ts — заборонити test.only на CI
export default defineConfig({
  forbidOnly: !!process.env.CI, // якщо забудеш прибрати — CI завалиться
})`,
        },
      ],
    },
    {
      id: "tags",
      title: {
        en: "Tags — filter by @smoke, @slow, @critical",
        uk: "Теги — фільтрація по @smoke, @slow, @critical",
      },
      paragraphs: [
        {
          en: "Tags let you run subsets of tests. I tag tests as `@smoke` for the quick sanity check suite that runs on every deploy, and `@regression` for the full suite that runs nightly.",
          uk: "Теги дозволяють запускати підмножини тестів. Я позначаю тести як `@smoke` для швидкої перевірки що запускається на кожному деплої, і `@regression` для повного набору що запускається вночі.",
        },
      ],
      codeBlocks: [
        {
          id: "tags",
          language: "ts",
          code: `// Через властивість tag
test('login flow', { tag: '@smoke' }, async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/dashboard')
})

// Через @-токен у назві тесту
test('full report generation @regression @slow', async ({ page }) => {
  // ...
})

// Тег на групу
test.describe('checkout flow', { tag: '@smoke' }, () => {
  test('add to cart', async ({ page }) => { /* ... */ })
  test('proceed to payment', async ({ page }) => { /* ... */ })
})`,
        },
        {
          id: "tags-cli",
          language: "bash",
          code: `# Запустити тільки @smoke тести
npx playwright test --grep @smoke

# Запустити все КРІМ @slow
npx playwright test --grep-invert @slow

# @smoke АБО @critical
npx playwright test --grep "@smoke|@critical"`,
        },
      ],
    },
    {
      id: "annotations",
      title: {
        en: "Annotations — link tests to issues",
        uk: "Анотації — зв'язати тести з тікетами",
      },
      paragraphs: [
        {
          en: "Annotations are metadata attached to a test — type and description. They appear in the HTML report. I use them to link tests to JIRA tickets or GitHub issues, so when a test fails I can immediately see which issue it relates to.",
          uk: "Анотації — це метадані прикріплені до тесту: тип і опис. Вони відображаються в HTML-репорті. Я використовую їх щоб зв'язати тести з тікетами JIRA або GitHub Issues — коли тест падає одразу видно який тікет.",
        },
      ],
      codeBlocks: [
        {
          id: "annotations",
          language: "ts",
          code: `// Прив'язати тест до тікету
test('order export to CSV', {
  annotation: {
    type: 'issue',
    description: 'https://github.com/org/repo/issues/142',
  },
}, async ({ page }) => {
  // ...
})

// Кілька анотацій — тікет + перфоманс-нотатка
test('full dashboard load', {
  annotation: [
    { type: 'issue', description: 'https://jira.company.com/PROJ-789' },
    { type: 'performance', description: 'Should load in < 3s, currently ~8s' },
  ],
}, async ({ page }) => {
  // ...
})`,
        },
      ],
    },
    {
      id: "describe",
      title: {
        en: "test.describe — group related tests",
        uk: "test.describe — групувати пов'язані тести",
      },
      paragraphs: [
        {
          en: "`test.describe()` groups tests under a shared name and scopes `beforeEach`/`afterEach` hooks to just that group. I use it when a feature has multiple related scenarios that share setup.",
          uk: "`test.describe()` групує тести під спільною назвою і обмежує хуки `beforeEach`/`afterEach` лише цією групою. Я використовую це коли фіча має кілька пов'язаних сценаріїв що ділять setup.",
        },
      ],
      codeBlocks: [
        {
          id: "describe",
          language: "ts",
          code: `test.describe('order filters', () => {
  // beforeEach запускається тільки для тестів у цьому describe
  test.beforeEach(async ({ page }) => {
    await page.goto('/orders')
  })

  test('filter by pending status', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Status' }).selectOption('pending')
    await expect(page.getByTestId('order-row')).not.toHaveCount(0)
  })

  test('filter by date range', async ({ page }) => {
    await page.getByLabel('From date').fill('2024-01-01')
    await page.getByLabel('To date').fill('2024-01-31')
    await page.getByRole('button', { name: 'Apply filters' }).click()
    await expect(page.getByTestId('order-row')).toHaveCount(5)
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
        en: "There's a known bug in Safari — the date picker component crashes. You want to track the test but not break CI. Which annotation do you use?",
        uk: "Є відомий баг у Safari — компонент вибору дати падає. Хочеш відстежувати тест але не ламати CI. Яку анотацію використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "test.fail — run the test and expect it to fail",
            uk: "test.fail — запустити тест і очікувати що він впаде",
          },
        },
        {
          id: "b",
          label: {
            en: "test.fixme — mark as known failure, don't run",
            uk: "test.fixme — позначити як відомий збій, не запускати",
          },
        },
        {
          id: "c",
          label: {
            en: "test.skip(browserName === 'webkit') — skip only on Safari",
            uk: "test.skip(browserName === 'webkit') — пропустити тільки на Safari",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`test.skip(condition)` is the right tool when a bug is browser-specific and the test should still run on all other browsers. `test.fixme` skips the test entirely on all browsers. `test.fail` would run it and expect failure — but if the bug is intermittent or gets fixed, CI would then start failing again.",
        uk: "`test.skip(condition)` — правильний інструмент коли баг специфічний для браузера і тест повинен продовжувати виконуватися у всіх інших браузерах. `test.fixme` пропускає тест повністю у всіх браузерах. `test.fail` запустить його і очікуватиме падіння — але якщо баг нестабільний або виправлено, CI почне падати знову.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You annotate a test with test.fail(). The underlying bug gets fixed and the test now passes. What does Playwright do?",
        uk: "Ти анотуєш тест з test.fail(). Базовий баг виправлено і тест тепер проходить. Що робить Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The test is marked as passed — expected behavior",
            uk: "Тест позначається як успішний — очікувана поведінка",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright reports an error — the test was expected to fail but passed",
            uk: "Playwright повідомляє про помилку — тест мав впасти але пройшов",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright skips the test since it's annotated",
            uk: "Playwright пропускає тест оскільки він анотований",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.fail()` tells Playwright: 'I expect this test to fail.' If it actually passes, Playwright reports it as an unexpected success — the test shows as failed in the report. This is intentional: it's your signal to remove the `test.fail()` annotation now that the bug is fixed.",
        uk: "`test.fail()` каже Playwright: 'Я очікую що цей тест впаде.' Якщо він насправді проходить — Playwright повідомляє про несподіваний успіх: тест відображається як невдалий у репорті. Це навмисно: це твій сигнал прибрати анотацію `test.fail()` тепер коли баг виправлено.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does test.skip() do when called without any condition argument?",
        uk: "Що робить test.skip() коли викликається без аргументу-умови?",
      },
      options: [
        { id: "a", label: { en: "It skips the test only on CI environments", uk: "Воно пропускає тест лише в CI-середовищах" } },
        { id: "b", label: { en: "It marks the test as skipped unconditionally — it will never run", uk: "Воно безумовно позначає тест як пропущений — він ніколи не буде запущений" } },
        { id: "c", label: { en: "It skips only the next expect() assertion inside the test", uk: "Воно пропускає лише наступну перевірку expect() всередині тесту" } },
        { id: "d", label: { en: "It runs the test but ignores any failures", uk: "Воно запускає тест але ігнорує будь-які падіння" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Calling `test.skip()` with no condition is equivalent to always-skip — the test is excluded from the run unconditionally. To make skipping conditional (only on Firefox, only on CI), pass a boolean expression: `test.skip(browserName === 'firefox', 'reason')`. The static form `test.skip('title', async () => {})` also skips the whole test and is identical in effect.",
        uk: "Виклик `test.skip()` без умови еквівалентний завжди-пропускати — тест виключається з запуску безумовно. Щоб зробити пропуск умовним (лише на Firefox, лише на CI) — передай булевий вираз: `test.skip(browserName === 'firefox', 'причина')`. Статична форма `test.skip('назва', async () => {})` також пропускає весь тест і має ідентичний ефект.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What is the difference between test.skip() and test.fixme()?",
        uk: "Яка різниця між test.skip() і test.fixme()?",
      },
      options: [
        { id: "a", label: { en: "They are identical — fixme is just an alias for skip", uk: "Вони ідентичні — fixme є лише псевдонімом skip" } },
        { id: "b", label: { en: "test.fixme() runs the test but suppresses failure output; test.skip() doesn't run it at all", uk: "test.fixme() запускає тест але приховує вивід падіння; test.skip() взагалі не запускає його" } },
        { id: "c", label: { en: "Both skip the test, but test.fixme() signals intent — 'this is a known broken thing that needs to be fixed', not just 'skip for now'", uk: "Обидва пропускають тест але test.fixme() сигналізує намір — 'це відоме зламане місце що потрібно виправити' а не просто 'пропустити поки що'" } },
        { id: "d", label: { en: "test.fixme() only works inside test.describe() blocks", uk: "test.fixme() працює лише всередині блоків test.describe()" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "Both `test.skip()` and `test.fixme()` cause the test to not run and to appear as skipped in the report. The difference is semantic intent: `skip` means 'not applicable' or 'temporarily disabled', while `fixme` explicitly communicates 'this test is broken and must be fixed'. In a codebase grep for `fixme` surfaces known broken tests — a useful signal for tech debt tracking.",
        uk: "І `test.skip()` і `test.fixme()` призводять до того що тест не запускається і відображається як пропущений у звіті. Різниця в семантичному намірі: `skip` означає 'не застосовно' або 'тимчасово вимкнено', тоді як `fixme` явно комунікує 'цей тест зламаний і його потрібно виправити'. Пошук `fixme` в кодовій базі виявляє відомі зламані тести — корисний сигнал для відстеження технічного боргу.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does test.slow() do to the test timeout?",
        uk: "Що test.slow() робить з таймаутом тесту?",
      },
      options: [
        { id: "a", label: { en: "It sets the timeout to a fixed 120 seconds regardless of the global config", uk: "Воно встановлює таймаут у фіксовані 120 секунд незалежно від глобального конфігу" } },
        { id: "b", label: { en: "It triples the default timeout for that specific test", uk: "Воно потроює дефолтний таймаут для цього конкретного тесту" } },
        { id: "c", label: { en: "It doubles the default timeout for that specific test", uk: "Воно подвоює дефолтний таймаут для цього конкретного тесту" } },
        { id: "d", label: { en: "It disables the timeout entirely for that test", uk: "Воно повністю вимикає таймаут для цього тесту" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.slow()` multiplies the configured timeout by 3. If the global timeout is 30 seconds, a test annotated with `test.slow()` gets 90 seconds. This is useful for tests that involve long-running operations like report generation or large file uploads without hardcoding a specific timeout value — if the global timeout is later adjusted, the slow test automatically scales with it.",
        uk: "`test.slow()` множить налаштований таймаут на 3. Якщо глобальний таймаут 30 секунд — тест анотований `test.slow()` отримує 90 секунд. Корисно для тестів що включають тривалі операції як генерація звітів або завантаження великих файлів без хардкодингу конкретного значення таймауту — якщо глобальний таймаут пізніше змінюється, повільний тест автоматично масштабується разом з ним.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you apply a tag to a test so it can be filtered with --grep @smoke on the CLI?",
        uk: "Як застосувати тег до тесту щоб його можна було фільтрувати через --grep @smoke в CLI?",
      },
      options: [
        { id: "a", label: { en: "Add @smoke as a JavaScript decorator above the test function", uk: "Додати @smoke як JavaScript-декоратор над функцією тесту" } },
        { id: "b", label: { en: "Either include @smoke in the test title string, or pass { tag: '@smoke' } as the second argument to test()", uk: "Або включити @smoke в рядок назви тесту, або передати { tag: '@smoke' } як другий аргумент test()" } },
        { id: "c", label: { en: "Register the tag in playwright.config.ts tags[] array", uk: "Зареєструвати тег в масиві tags[] playwright.config.ts" } },
        { id: "d", label: { en: "Use test.tag('@smoke') before the test body", uk: "Використати test.tag('@smoke') перед тілом тесту" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright supports two ways to tag a test: include the tag token in the title string (`test('login flow @smoke', ...)`) or use the options object (`test('login flow', { tag: '@smoke' }, ...)`). Both work with `--grep @smoke` on the CLI. The options-object form also supports `test.describe({ tag: '@smoke' }, () => {...})` to tag an entire group. Multiple tags can be given as an array: `{ tag: ['@smoke', '@critical'] }`.",
        uk: "Playwright підтримує два способи тегування тесту: включити токен тегу в рядок назви (`test('login flow @smoke', ...)`) або використати об'єкт опцій (`test('login flow', { tag: '@smoke' }, ...)`). Обидва працюють з `--grep @smoke` в CLI. Форма з об'єктом опцій також підтримує `test.describe({ tag: '@smoke' }, () => {...})` щоб тегувати цілу групу. Кілька тегів можна задати масивом: `{ tag: ['@smoke', '@critical'] }`.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What is the purpose of test.info().annotations in a test body?",
        uk: "Яке призначення test.info().annotations в тілі тесту?",
      },
      options: [
        { id: "a", label: { en: "It returns the list of annotations attached to the currently running test, useful for conditional logic inside the test", uk: "Повертає список анотацій прикріплених до поточного тесту, корисно для умовної логіки всередині тесту" } },
        { id: "b", label: { en: "It adds a new annotation to the test at runtime", uk: "Додає нову анотацію до тесту під час виконання" } },
        { id: "c", label: { en: "It sends the annotation to the HTML report server immediately", uk: "Негайно відправляє анотацію на сервер HTML-звіту" } },
        { id: "d", label: { en: "It reads annotations from the playwright.config.ts file", uk: "Читає анотації з файлу playwright.config.ts" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Inside a test body you can add annotations dynamically with `test.info().annotations.push({ type: 'issue', description: 'https://...' })`. This is useful when the annotation value is only known at runtime (e.g. an ID returned from a seeding step). The annotations array already contains any static annotations defined in the test options — you're just appending to it.",
        uk: "Всередині тіла тесту можна додавати анотації динамічно через `test.info().annotations.push({ type: 'issue', description: 'https://...' })`. Корисно коли значення анотації відоме лише під час виконання (наприклад ID повернутий з кроку заповнення даних). Масив annotations вже містить будь-які статичні анотації визначені в опціях тесту — ти просто додаєш до нього.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want to prevent test.only() from ever being accidentally committed and breaking CI. What config option achieves this?",
        uk: "Хочеш запобігти тому щоб test.only() випадково потрапив у коміт і зламав CI. Яка опція конфігу досягає цього?",
      },
      options: [
        { id: "a", label: { en: "disableOnly: true in playwright.config.ts", uk: "disableOnly: true у playwright.config.ts" } },
        { id: "b", label: { en: "Add a lint rule that bans test.only in all files", uk: "Додати lint-правило що забороняє test.only у всіх файлах" } },
        { id: "c", label: { en: "forbidOnly: !!process.env.CI in playwright.config.ts", uk: "forbidOnly: !!process.env.CI у playwright.config.ts" } },
        { id: "d", label: { en: "Set only: false in each project's use block", uk: "Встановити only: false в блоці use кожного проєкту" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`forbidOnly: !!process.env.CI` evaluates to `true` on CI (where the CI environment variable is set) and `false` locally. When `forbidOnly` is true, Playwright exits with an error if it finds any `test.only()` in the suite — before any test runs. This is the recommended safety net: it's fast, doesn't require a linter, and gives a clear error message pointing to the offending file.",
        uk: "`forbidOnly: !!process.env.CI` дає `true` на CI (де встановлена змінна середовища CI) і `false` локально. Коли `forbidOnly` true — Playwright завершується з помилкою якщо знаходить будь-який `test.only()` у сьюті, ще до запуску будь-якого тесту. Це рекомендована сітка безпеки: швидка, не вимагає лінтера і дає чітке повідомлення про помилку що вказує на файл-порушник.",
      },
    },
  ],
}
