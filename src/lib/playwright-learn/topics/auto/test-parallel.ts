import type { PlaywrightTopic } from "../../types"

export const testParallelTopic: PlaywrightTopic = {
  slug: "test-parallel",
  groupId: "test-runner",
  order: 345,
  level: "intermediate",
  trackOrder: 5,
  sourceDoc: "test-parallel-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-parallel",
  title: {
    en: "Parallelism",
    uk: "Паралелізм",
  },
  summary: {
    en: "By default: test files run in parallel across workers, tests within one file run sequentially. That's almost always what you want. I set workers: 2 on CI for predictability, and use workerIndex to isolate test data between parallel workers.",
    uk: "За замовчуванням: файли тестів виконуються паралельно між воркерами, тести всередині одного файлу — послідовно. Це майже завжди те що треба. На CI я встановлюю workers: 2 для передбачуваності, і використовую workerIndex для ізоляції тестових даних між паралельними воркерами.",
  },
  sections: [
    {
      id: "how-workers-work",
      title: {
        en: "How workers work",
        uk: "Як працюють воркери",
      },
      diagram: {
        mermaid: `flowchart LR
  PW["Playwright\norchestrator"] --> W1 & W2 & W3
  subgraph W1["Worker 1 — OS process"]
    F1["orders.spec.ts"] --> F2["reports.spec.ts"]
  end
  subgraph W2["Worker 2 — OS process"]
    F3["login.spec.ts"] --> F4["dashboard.spec.ts"]
  end
  subgraph W3["Worker 3 — OS process"]
    F5["filters.spec.ts"] --> F6["checkout.spec.ts"]
  end`,
        caption: {
          en: "Each worker is an isolated OS process; files run sequentially inside a worker, workers run in parallel",
          uk: "Кожен воркер — ізольований OS-процес; файли виконуються послідовно всередині воркера, воркери — паралельно",
        },
      },
      paragraphs: [
        {
          en: "Each worker is a separate OS process — its own Node.js instance, its own browser, no shared memory with other workers. Workers can't talk to each other. Playwright reuses a worker for multiple test files to avoid the browser startup cost — when one file finishes, the next file runs in the same worker.",
          uk: "Кожен воркер — окремий OS-процес: свій Node.js, свій браузер, нема спільної пам'яті з іншими воркерами. Воркери не можуть спілкуватися між собою. Playwright повторно використовує воркер для кількох файлів щоб уникнути витрат на запуск браузера — коли один файл закінчується, наступний виконується в тому ж воркері.",
        },
        {
          en: "After a test failure, the worker is always killed and a fresh one starts — guaranteeing no stale state bleeds into subsequent tests.",
          uk: "Після падіння тесту воркер завжди вбивається і стартує новий — гарантуючи що брудний стан не потрапляє в наступні тести.",
        },
      ],
      codeBlocks: [
        {
          id: "workers-diagram",
          language: "text",
          code: `Запуск: 6 файлів, 3 воркери

Worker 1: [orders.spec.ts] → [reports.spec.ts]
Worker 2: [login.spec.ts] → [dashboard.spec.ts]
Worker 3: [filters.spec.ts] → [checkout.spec.ts]

Тести всередині orders.spec.ts — послідовно в Worker 1`,
        },
      ],
    },
    {
      id: "limit-workers",
      title: {
        en: "Control the number of workers",
        uk: "Керувати кількістю воркерів",
      },
      paragraphs: [
        {
          en: "By default Playwright uses half the CPU cores. On CI I pin workers to a fixed number — too many workers on a shared runner causes resource contention and flaky tests. Locally I let it use defaults.",
          uk: "За замовчуванням Playwright використовує половину ядер CPU. На CI я фіксую workers у конкретне число — надто багато воркерів на shared runner-і спричиняє конкуренцію за ресурси і flaky тести. Локально — залишаю дефолт.",
        },
      ],
      codeBlocks: [
        {
          id: "limit-workers",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  // На CI — 2 воркери (predictable); локально — дефолт (усі ядра / 2)
  workers: process.env.CI ? 2 : undefined,
})`,
        },
        {
          id: "workers-cli",
          language: "bash",
          code: `# Перевизначити через CLI
npx playwright test --workers 4

# Запустити без паралелізму (для дебагу)
npx playwright test --workers=1`,
        },
      ],
    },
    {
      id: "fully-parallel",
      title: {
        en: "fullyParallel — run tests within a file in parallel too",
        uk: "fullyParallel — паралельний запуск тестів усередині файлу",
      },
      paragraphs: [
        {
          en: "By default, tests within one file always run sequentially — that's fine for most cases. `fullyParallel: true` makes every individual test run in its own worker. Useful if you have large files with many independent tests. The downside: shared state (like `let orderId` between tests) breaks because each test runs in a separate process.",
          uk: "За замовчуванням тести всередині одного файлу завжди виконуються послідовно — для більшості це нормально. `fullyParallel: true` запускає кожен окремий тест у власному воркері. Корисно якщо є великі файли з багатьма незалежними тестами. Мінус: спільний стан (як `let orderId` між тестами) ламається бо кожен тест у своєму процесі.",
        },
      ],
      codeBlocks: [
        {
          id: "fully-parallel-config",
          language: "ts",
          code: `// Глобально — кожен тест у своєму воркері
export default defineConfig({
  fullyParallel: true,
})`,
        },
        {
          id: "fully-parallel-file",
          language: "ts",
          code: `// Тільки для конкретного файлу або describe
test.describe.configure({ mode: 'parallel' })

test('filter by status', async ({ page }) => {
  await page.goto('/orders')
  await page.getByRole('combobox', { name: 'Status' }).selectOption('pending')
  await expect(page.getByTestId('order-row')).not.toHaveCount(0)
})

test('filter by date', async ({ page }) => {
  await page.goto('/orders')
  await page.getByLabel('From date').fill('2024-01-01')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page.getByTestId('order-row')).toHaveCount(5)
})`,
        },
        {
          id: "opt-out",
          language: "ts",
          code: `// Якщо fullyParallel увімкнено глобально — можна відключити для одного describe
test.describe('checkout flow', () => {
  test.describe.configure({ mode: 'default' }) // Sequential навіть при fullyParallel

  test('step 1: add to cart', async ({ page }) => { /* ... */ })
  test('step 2: enter shipping', async ({ page }) => { /* ... */ })
})`,
        },
      ],
    },
    {
      id: "worker-index",
      title: {
        en: "workerIndex — isolate test data between workers",
        uk: "workerIndex — ізолювати тестові дані між воркерами",
      },
      paragraphs: [
        {
          en: "When multiple workers run at the same time, they can't share a test user — they'd overwrite each other's data. I use `workerIndex` to give each worker its own user. Each worker gets a unique index (starting at 0), and I create a separate user per index.",
          uk: "Коли кілька воркерів виконуються одночасно — вони не можуть ділити тестового користувача, вони затрутять дані один одного. Я використовую `workerIndex` щоб дати кожному воркеру свого користувача. Кожен воркер отримує унікальний індекс (починаючи з 0), і я створюю окремого юзера на кожний індекс.",
        },
      ],
      codeBlocks: [
        {
          id: "worker-fixture",
          language: "ts",
          code: `// fixtures.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  // Worker-scoped: один раз на воркер, не на кожен тест
  testUser: [async ({}, use, workerInfo) => {
    const userName = \`worker-\${workerInfo.workerIndex}@example.com\`

    // Створити юзера для цього воркера
    await createUser(userName)
    await use(userName)

    // Прибрати після всіх тестів воркера
    await deleteUser(userName)
  }, { scope: 'worker' }],
})`,
        },
        {
          id: "worker-index-usage",
          language: "ts",
          code: `// test-worker-index через process.env (якщо не використовуєш фікстуру)
test('create order', async ({ page }, testInfo) => {
  const workerIdx = testInfo.workerIndex
  await page.goto(\`/login?user=worker-\${workerIdx}\`)
  // ... тест використовує ізольованого юзера
})`,
        },
      ],
    },
    {
      id: "fail-fast",
      title: {
        en: "maxFailures — stop early when things break",
        uk: "maxFailures — зупинятися раньше коли все ламається",
      },
      paragraphs: [
        {
          en: "If 50 tests fail in the first minute, there's no point running the other 950. `maxFailures` stops the whole run after hitting the limit — saves CI time when there's a fundamental problem.",
          uk: "Якщо за першу хвилину впали 50 тестів — немає сенсу запускати ще 950. `maxFailures` зупиняє весь запуск після досягнення ліміту — економить CI-час коли є фундаментальна проблема.",
        },
      ],
      codeBlocks: [
        {
          id: "max-failures",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  // На CI: зупинитися після 10 падінь — не витрачати ресурси на зламаний suite
  maxFailures: process.env.CI ? 10 : undefined,
})`,
        },
        {
          id: "max-failures-cli",
          language: "bash",
          code: `# Або через CLI
npx playwright test --max-failures=5`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "By default, how does Playwright run tests? Which statement is correct?",
        uk: "Як за замовчуванням Playwright запускає тести? Яке твердження правильне?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "All tests in all files run sequentially in a single process",
            uk: "Всі тести у всіх файлах виконуються послідовно в одному процесі",
          },
        },
        {
          id: "b",
          label: {
            en: "Test files run in parallel across workers; tests within one file run sequentially in the same worker",
            uk: "Файли тестів виконуються паралельно між воркерами; тести всередині одного файлу — послідовно в тому ж воркері",
          },
        },
        {
          id: "c",
          label: {
            en: "Every individual test runs in its own worker process",
            uk: "Кожен окремий тест виконується у власному воркер-процесі",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The default: files are parallelized, tests within a file run in order. This is the right default for most projects — files are the natural isolation boundary. Option C describes `fullyParallel: true`, which you opt into explicitly. Option A describes `workers: 1`.",
        uk: "Дефолт: файли паралелізуються, тести всередині файлу виконуються по порядку. Це правильний дефолт для більшості проєктів — файли є природною межею ізоляції. Варіант C описує `fullyParallel: true`, що вмикається явно. Варіант A описує `workers: 1`.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You have 4 parallel workers and tests that create orders in the database. Without isolation, workers overwrite each other's data. What's the best approach?",
        uk: "У тебе 4 паралельних воркери і тести що створюють замовлення в базі. Без ізоляції воркери затирають дані один одного. Який найкращий підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set workers: 1 — no parallelism means no isolation problem",
            uk: "Встановити workers: 1 — без паралелізму немає проблеми ізоляції",
          },
        },
        {
          id: "b",
          label: {
            en: "Use workerIndex to create a separate test user per worker, scoped at the worker level",
            uk: "Використати workerIndex для створення окремого тестового юзера на кожен воркер, з worker-scope",
          },
        },
        {
          id: "c",
          label: {
            en: "Delete all test data in afterEach — clean state guarantees isolation",
            uk: "Видаляти всі тестові дані в afterEach — чистий стан гарантує ізоляцію",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "workerIndex gives each worker a unique identifier (0, 1, 2, 3). Create a separate user per index in a worker-scoped fixture, and all tests in that worker use that isolated user. Option A works but loses all parallelism benefits. Option C creates race conditions — while one worker is cleaning up, another is starting a new test with the same data.",
        uk: "workerIndex дає кожному воркеру унікальний ідентифікатор (0, 1, 2, 3). Створи окремого юзера на кожен індекс у worker-scoped фікстурі, і всі тести в цьому воркері використовують ізольованого юзера. Варіант A працює але втрачає всі переваги паралелізму. Варіант C створює race condition — поки один воркер чистить, інший вже починає новий тест з тими ж даними.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What happens to a worker after one of its tests fails?",
        uk: "Що відбувається з воркером після того як один з його тестів падає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The worker pauses and waits for the other workers to finish before restarting",
            uk: "Воркер зупиняється і чекає поки інші воркери завершать перед перезапуском",
          },
        },
        {
          id: "b",
          label: {
            en: "The worker is killed and a fresh worker process starts for the next test — no stale state carries over",
            uk: "Воркер вбивається і для наступного тесту стартує новий процес воркера — ніякого брудного стану",
          },
        },
        {
          id: "c",
          label: {
            en: "The worker continues running remaining tests in the file after logging the failure",
            uk: "Воркер продовжує виконувати тести що залишилися у файлі після логування падіння",
          },
        },
        {
          id: "d",
          label: {
            en: "The worker retries the failed test immediately before moving on",
            uk: "Воркер негайно повторює тест що впав перед тим як рухатися далі",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "After any test failure, Playwright kills the worker process entirely and starts a brand new one for the next test. This is a deliberate design choice — it guarantees that a test failure cannot corrupt state and make subsequent tests flaky. The browser process is also restarted, giving the next test a completely clean environment.",
        uk: "Після будь-якого падіння тесту Playwright повністю вбиває процес воркера і запускає новий для наступного тесту. Це свідоме архітектурне рішення — гарантує що падіння тесту не може зіпсувати стан і зробити наступні тести нестабільними. Процес браузера також перезапускається, даючи наступному тесту повністю чисте середовище.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you enable fully parallel execution so every individual test runs in its own worker?",
        uk: "Як увімкнути повністю паралельне виконання щоб кожен окремий тест виконувався у власному воркері?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set workers to a very high number like workers: 100",
            uk: "Встановити workers на дуже велике число наприклад workers: 100",
          },
        },
        {
          id: "b",
          label: {
            en: "Set fullyParallel: true in defineConfig, or use test.describe.configure({ mode: 'parallel' }) in a specific file",
            uk: "Встановити fullyParallel: true у defineConfig, або використати test.describe.configure({ mode: 'parallel' }) у конкретному файлі",
          },
        },
        {
          id: "c",
          label: {
            en: "Add --parallel flag when running npx playwright test",
            uk: "Додати прапор --parallel при запуску npx playwright test",
          },
        },
        {
          id: "d",
          label: {
            en: "Set parallel: true inside each test.describe block",
            uk: "Встановити parallel: true всередині кожного блоку test.describe",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`fullyParallel: true` in the global config makes every test run in its own worker — even tests within the same file. You can also enable it for a specific file or describe block with `test.describe.configure({ mode: 'parallel' })`. Be careful: this breaks any shared mutable state between tests in the same file (like a shared `let orderId` variable).",
        uk: "`fullyParallel: true` у глобальному конфігу змушує кожен тест виконуватися у власному воркері — навіть тести в одному файлі. Також можна увімкнути для конкретного файлу або describe-блоку через `test.describe.configure({ mode: 'parallel' })`. Обережно: це ламає будь-який спільний мутабельний стан між тестами в одному файлі (наприклад спільну змінну `let orderId`).",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You want to run tests with exactly 4 workers from the command line without changing the config file. Which command is correct?",
        uk: "Хочеш запустити тести рівно з 4 воркерами з командного рядка без зміни файлу конфігу. Яка команда правильна?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright test --workers 4",
            uk: "npx playwright test --workers 4",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright test --parallel=4",
            uk: "npx playwright test --parallel=4",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright test --concurrency 4",
            uk: "npx playwright test --concurrency 4",
          },
        },
        {
          id: "d",
          label: {
            en: "npx playwright test --threads=4",
            uk: "npx playwright test --threads=4",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "The `--workers` flag (or `--workers=4`) overrides the `workers` value from the config file for that single run. This is useful for quick experiments — running single-threaded for debugging (`--workers=1`) or stress-testing parallelism (`--workers=8`). There is no `--parallel`, `--concurrency`, or `--threads` flag in Playwright.",
        uk: "Прапор `--workers` (або `--workers=4`) перевизначає значення `workers` з файлу конфігу для того одного запуску. Корисно для швидких експериментів — запуск в один потік для дебагу (`--workers=1`) або стрес-тест паралелізму (`--workers=8`). У Playwright немає прапорів `--parallel`, `--concurrency` або `--threads`.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What is the default number of workers Playwright uses if you do not set `workers` in the config?",
        uk: "Яка кількість воркерів за замовчуванням використовується Playwright якщо не встановити `workers` у конфігу?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "1 — sequential by default for stability",
            uk: "1 — послідовно за замовчуванням для стабільності",
          },
        },
        {
          id: "b",
          label: {
            en: "Half the number of CPU cores on the machine",
            uk: "Половина кількості ядер CPU на машині",
          },
        },
        {
          id: "c",
          label: {
            en: "All available CPU cores — maximum parallelism",
            uk: "Всі доступні ядра CPU — максимальний паралелізм",
          },
        },
        {
          id: "d",
          label: {
            en: "4 workers regardless of the machine",
            uk: "4 воркери незалежно від машини",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By default Playwright uses half the available CPU cores as the worker count. On a machine with 8 cores, that's 4 workers. This is a reasonable default that balances speed and resource usage. On CI, it's common to pin `workers` to a specific number (e.g. 1 or 2) because shared CI runners often have limited or inconsistent CPU resources.",
        uk: "За замовчуванням Playwright використовує половину доступних ядер CPU як кількість воркерів. На машині з 8 ядрами — це 4 воркери. Це розумний дефолт що балансує швидкість і використання ресурсів. На CI зазвичай фіксують `workers` на конкретне число (наприклад 1 або 2) бо спільні CI-раннери часто мають обмежені або непостійні ресурси CPU.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You have `fullyParallel: true` globally but one describe block has tests that share a `let orderId` variable between them. What will happen?",
        uk: "У тебе `fullyParallel: true` глобально але один describe-блок має тести що ділять змінну `let orderId` між собою. Що відбудеться?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The tests will pass — Playwright automatically synchronises shared variables between parallel tests",
            uk: "Тести пройдуть — Playwright автоматично синхронізує спільні змінні між паралельними тестами",
          },
        },
        {
          id: "b",
          label: {
            en: "The tests will break — each test runs in a separate process, so the shared variable is undefined in tests that depend on it",
            uk: "Тести зламаються — кожен тест виконується в окремому процесі тому спільна змінна undefined у тестах що від неї залежать",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright will automatically switch that describe block to serial mode",
            uk: "Playwright автоматично перемкне той describe-блок у serial-режим",
          },
        },
        {
          id: "d",
          label: {
            en: "The tests will run sequentially within the describe block even with fullyParallel enabled",
            uk: "Тести виконуватимуться послідовно всередині describe-блоку навіть при увімкненому fullyParallel",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Workers are separate OS processes with no shared memory. If test B sets `orderId = '123'` and test C reads it, test C runs in a different process and sees `orderId` as `undefined`. To fix this: make each test independent (don't share state), or use `test.describe.configure({ mode: 'default' })` inside that describe block to opt out of parallel execution for that group.",
        uk: "Воркери — окремі OS-процеси без спільної пам'яті. Якщо тест B встановлює `orderId = '123'` а тест C його читає — тест C виконується в іншому процесі і бачить `orderId` як `undefined`. Щоб виправити: зроби кожен тест незалежним (не ділити стан), або використай `test.describe.configure({ mode: 'default' })` всередині того describe-блоку щоб відмовитися від паралельного виконання для тієї групи.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What does `test.describe.configure({ mode: 'serial' })` do in the context of parallelism?",
        uk: "Що робить `test.describe.configure({ mode: 'serial' })` у контексті паралелізму?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Forces all tests in the describe block to run in one worker, sequentially, even when fullyParallel is enabled globally",
            uk: "Змушує всі тести в describe-блоку виконуватися в одному воркері послідовно навіть якщо fullyParallel увімкнено глобально",
          },
        },
        {
          id: "b",
          label: {
            en: "Makes the tests run faster by serialising browser operations",
            uk: "Прискорює виконання тестів шляхом серіалізації операцій браузера",
          },
        },
        {
          id: "c",
          label: {
            en: "Pins those tests to a specific worker index so they always use the same browser",
            uk: "Прив'язує ті тести до конкретного індексу воркера щоб вони завжди використовували той самий браузер",
          },
        },
        {
          id: "d",
          label: {
            en: "Enables serial output in the reporter so test results print one by one",
            uk: "Вмикає послідовний вивід у репортері щоб результати тестів друкувалися по одному",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`mode: 'serial'` keeps the entire describe group running sequentially within a single worker, overriding `fullyParallel`. It also adds the behaviour that if one test fails, remaining tests in the group are skipped, and on retry the whole group restarts from the beginning. Use it only for genuinely dependent tests — for everything else, keep tests independent.",
        uk: "`mode: 'serial'` тримає всю describe-групу виконуючись послідовно в одному воркері, перевизначаючи `fullyParallel`. Також додає поведінку: якщо один тест падає — решта тестів у групі пропускаються, а при повторі вся група перезапускається з початку. Використовуй лише для справді залежних тестів — для всього іншого тримай тести незалежними.",
      },
    },
  ],
}
