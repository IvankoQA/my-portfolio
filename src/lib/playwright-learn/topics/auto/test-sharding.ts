import type { PlaywrightTopic } from "../../types"

export const testShardingTopic: PlaywrightTopic = {
  slug: "test-sharding",
  groupId: "test-runner",
  order: 370,
  level: "advanced",
  trackOrder: 5,
  sourceDoc: "test-sharding-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-sharding",
  title: {
    en: "Sharding",
    uk: "Шардинг",
  },
  summary: {
    en: "When I hit 800+ e2e tests, parallel workers on one machine stopped being enough. Sharding splits your test suite across multiple CI machines so they run simultaneously. The setup is two lines of YAML — the reporting part takes a bit more work to wire up properly.",
    uk: "Коли у мене стало 800+ e2e-тестів, паралельних воркерів на одній машині перестало вистачати. Шардинг розбиває набір тестів між кількома CI-машинами щоб вони виконувалися одночасно. Налаштування — два рядки YAML, а от з репортингом трохи більше роботи.",
  },
  sections: [
    {
      id: "the-flag",
      title: {
        en: "The --shard flag",
        uk: "Прапорець --shard",
      },
      diagram: {
        mermaid: `flowchart LR
  TS["Test suite\n(400 tests)"] --> S1["Shard 1/4\nCI machine A"]
  TS --> S2["Shard 2/4\nCI machine B"]
  TS --> S3["Shard 3/4\nCI machine C"]
  TS --> S4["Shard 4/4\nCI machine D"]
  S1 & S2 & S3 & S4 --> BR["blob reports"]
  BR -->|"merge-reports"| HR["HTML report"]`,
        caption: {
          en: "Sharding distributes tests across CI machines; blob reports are merged into one HTML report after all shards finish",
          uk: "Шардинг розподіляє тести між CI-машинами; blob-звіти об'єднуються в один HTML-звіт після завершення всіх шардів",
        },
      },
      paragraphs: [
        {
          en: "One flag, and each CI job runs its own slice. If I have 4 machines, I run these four commands in parallel — each machine picks up its quarter of the test suite and ignores the rest.",
          uk: "Один прапорець — і кожен CI-job виконує свою частину. Якщо у мене 4 машини, запускаю ці чотири команди паралельно: кожна машина бере свою чверть набору і ігнорує решту.",
        },
        {
          en: "Playwright distributes by test file by default. So if shard 1/4 gets 10 files and shard 2/4 gets 2 files, the timing will be uneven. That's where `fullyParallel` helps.",
          uk: "За замовчуванням Playwright розподіляє по файлах тестів. Тому якщо шард 1/4 отримає 10 файлів а шард 2/4 отримає 2 файли — час виконання буде нерівномірним. Тут допомагає `fullyParallel`.",
        },
      ],
      codeBlocks: [
        {
          id: "shard-commands",
          language: "bash",
          code: `npx playwright test --shard=1/4
npx playwright test --shard=2/4
npx playwright test --shard=3/4
npx playwright test --shard=4/4`,
        },
      ],
    },
    {
      id: "balancing",
      title: {
        en: "Getting even distribution — fullyParallel",
        uk: "Рівномірний розподіл — fullyParallel",
      },
      paragraphs: [
        {
          en: "Without `fullyParallel`, Playwright splits at the file level. A file with 50 tests counts the same as a file with 2 tests. One shard ends up doing most of the work while others finish early and sit idle.",
          uk: "Без `fullyParallel` Playwright ділить на рівні файлів. Файл із 50 тестами рахується так само як файл із 2 тестами. Один шард робить більшість роботи поки інші вже закінчили і простоюють.",
        },
        {
          en: "With `fullyParallel: true`, Playwright splits at the individual test level. 400 tests across 4 shards = ~100 tests per shard, regardless of how they're distributed across files. I always use this when sharding.",
          uk: "З `fullyParallel: true` Playwright ділить на рівні окремих тестів. 400 тестів на 4 шарди = ~100 тестів на шард, незалежно від того як вони розподілені по файлах. Я завжди використовую це при шардингу.",
        },
      ],
      codeBlocks: [
        {
          id: "fully-parallel-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  fullyParallel: true,  // ← тест-рівневий розподіл, а не файл-рівневий
  reporter: process.env.CI ? 'blob' : 'html',
})`,
        },
      ],
    },
    {
      id: "blob-reporter",
      title: {
        en: "Blob reporter — collecting results from all shards",
        uk: "Blob-репортер — збирати результати з усіх шардів",
      },
      paragraphs: [
        {
          en: "Each shard produces its own test report. To get one combined report after all shards finish, I use the blob reporter on CI. It saves raw test data (including traces, screenshots, all attachments) to a zip file that can be merged later.",
          uk: "Кожен шард створює свій звіт. Щоб отримати один об'єднаний звіт після завершення всіх шардів — використовую blob-репортер на CI. Він зберігає сирі дані тестів (включаючи трейси, скриншоти, всі вкладення) у zip-файл який можна злити пізніше.",
        },
        {
          en: "After downloading all blob reports from CI artifacts into one directory, I merge them into a single HTML report. The blob file names include the shard number so they never conflict.",
          uk: "Після скачування всіх blob-звітів з CI-артефактів в один каталог — зливаю їх в один HTML-звіт. В іменах blob-файлів є номер шарду тому конфліктів не буде.",
        },
      ],
      codeBlocks: [
        {
          id: "merge-command",
          language: "bash",
          code: `# Злити blob-звіти з усіх шардів в один HTML-звіт
npx playwright merge-reports --reporter html ./all-blob-reports`,
        },
      ],
    },
    {
      id: "github-actions",
      title: {
        en: "GitHub Actions setup — matrix strategy",
        uk: "Налаштування GitHub Actions — matrix-стратегія",
      },
      paragraphs: [
        {
          en: "GitHub Actions matrix lets each shard run as an independent job. I define `shardIndex` as an array and `shardTotal` as a fixed number — GitHub spawns one job per index value, each referencing both variables.",
          uk: "Matrix в GitHub Actions дозволяє кожному шарду виконуватися як незалежний job. Я визначаю `shardIndex` як масив і `shardTotal` як фіксоване число — GitHub створює один job на кожне значення індексу, кожен посилається на обидві змінні.",
        },
        {
          en: "The artifact upload step has `if: ${{ !cancelled() }}` — without this, if a test fails (the job fails), the artifact upload is skipped and you have no report to look at. This condition runs the upload even when the job failed.",
          uk: "Крок завантаження артефакту має `if: ${{ !cancelled() }}` — без цього якщо тест впав (job провалився) — завантаження артефакту пропускається і немає звіту щоб подивитися. Ця умова запускає завантаження навіть коли job впав.",
        },
        {
          en: "Then a separate `merge-reports` job waits for all shards via `needs: [playwright-tests]`, downloads all blob artifacts, and merges them into one HTML report.",
          uk: "Потім окремий job `merge-reports` чекає на всі шарди через `needs: [playwright-tests]`, скачує всі blob-артефакти і зливає їх в один HTML-звіт.",
        },
      ],
      codeBlocks: [
        {
          id: "github-actions-shards",
          language: "yaml",
          code: `name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  playwright-tests:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test --shard=\${{ matrix.shardIndex }}/\${{ matrix.shardTotal }}
    - name: Upload blob report
      if: \${{ !cancelled() }}
      uses: actions/upload-artifact@v4
      with:
        name: blob-report-\${{ matrix.shardIndex }}
        path: blob-report
        retention-days: 1`,
        },
        {
          id: "github-actions-merge",
          language: "yaml",
          code: `  merge-reports:
    if: \${{ !cancelled() }}
    needs: [playwright-tests]
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Download blob reports
      uses: actions/download-artifact@v5
      with:
        path: all-blob-reports
        pattern: blob-report-*
        merge-multiple: true
    - name: Merge into HTML Report
      run: npx playwright merge-reports --reporter html ./all-blob-reports
    - name: Upload HTML report
      uses: actions/upload-artifact@v4
      with:
        name: html-report--attempt-\${{ github.run_attempt }}
        path: playwright-report
        retention-days: 14`,
        },
      ],
    },
    {
      id: "multiple-environments",
      title: {
        en: "Merging reports from different environments",
        uk: "Злиття звітів з різних середовищ",
      },
      paragraphs: [
        {
          en: "If I run the same tests against staging and production simultaneously, I tag each run with the environment name via `TestConfig.tag`. The blob report picks up this tag automatically, so the merged report shows which results came from which environment.",
          uk: "Якщо запускаю ті самі тести проти staging і production одночасно — позначаю кожен запуск назвою середовища через `TestConfig.tag`. Blob-звіт підхоплює цей тег автоматично, тому в об'єднаному звіті видно з якого середовища прийшли які результати.",
        },
      ],
      codeBlocks: [
        {
          id: "environment-tag",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  reporter: process.env.CI ? 'blob' : 'html',
  tag: process.env.CI_ENVIRONMENT_NAME,  // наприклад "@staging" або "@production"
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You set up 4 shards in CI. Three shards finish in 3 minutes, one takes 12 minutes. The total CI time is 12 minutes instead of the expected ~3. What's most likely causing the imbalance?",
        uk: "Налаштував 4 шарди в CI. Три шарди завершуються за 3 хвилини, один займає 12 хвилин. Загальний час CI — 12 хвилин замість очікуваних ~3. Що найімовірніше спричиняє дисбаланс?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "One machine has slower hardware than the others",
            uk: "Одна машина має повільніше залізо ніж інші",
          },
        },
        {
          id: "b",
          label: {
            en: "fullyParallel is not enabled — Playwright splits by file, so one large file lands on one shard and dominates its runtime",
            uk: "fullyParallel не увімкнений — Playwright ділить по файлах, тому один великий файл потрапляє на один шард і домінує у часі виконання",
          },
        },
        {
          id: "c",
          label: {
            en: "The blob reporter is causing overhead on that shard",
            uk: "Blob-репортер спричиняє накладні витрати на тому шарді",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Without `fullyParallel: true`, Playwright assigns whole test files to shards. If one file has 200 tests and others have 10, that file's shard runs much longer. `fullyParallel: true` splits at the individual test level — 800 tests across 4 shards is ~200 per shard regardless of file structure. Hardware differences are rarely this dramatic; the blob reporter adds milliseconds, not minutes.",
        uk: "Без `fullyParallel: true` Playwright призначає цілі файли тестів шардам. Якщо один файл має 200 тестів а інші по 10 — шард цього файлу виконується набагато довше. `fullyParallel: true` ділить на рівні окремих тестів: 800 тестів на 4 шарди = ~200 на шард незалежно від структури файлів. Різниця в залізі рідко буває такою драматичною; blob-репортер додає мілісекунди, не хвилини.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "After all 4 shards finish, you want to see a single HTML report with all results combined. What do you need to configure and run?",
        uk: "Після завершення всіх 4 шардів хочеш побачити один HTML-звіт з усіма об'єднаними результатами. Що потрібно налаштувати і запустити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use reporter: 'html' on all shards — HTML reports automatically merge when uploaded to the same artifact",
            uk: "Використовувати reporter: 'html' на всіх шардах — HTML-звіти автоматично зливаються при завантаженні в один артефакт",
          },
        },
        {
          id: "b",
          label: {
            en: "Use reporter: 'blob' on CI, upload each shard's blob-report as an artifact, then run npx playwright merge-reports in a separate job after all shards complete",
            uk: "Використовувати reporter: 'blob' на CI, завантажити blob-report кожного шарду як артефакт, потім запустити npx playwright merge-reports в окремому job після завершення всіх шардів",
          },
        },
        {
          id: "c",
          label: {
            en: "Run npx playwright test --merge on the last shard — it automatically collects results from previous shards",
            uk: "Запустити npx playwright test --merge на останньому шарді — він автоматично збирає результати з попередніх шардів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "HTML reports can't be merged — they're static files that don't know about each other. The blob reporter produces a structured zip that contains all test data. Each shard uploads its blob to CI artifacts. A final merge job downloads all blobs into one directory and runs `npx playwright merge-reports --reporter html ./all-blob-reports` to produce the combined HTML report. There's no --merge flag on the test command.",
        uk: "HTML-звіти не можна злити — це статичні файли що не знають одне про одного. Blob-репортер створює структурований zip що містить всі дані тестів. Кожен шард завантажує свій blob в CI-артефакти. Фінальний merge-job скачує всі blob в один каталог і запускає `npx playwright merge-reports --reporter html ./all-blob-reports` щоб отримати об'єднаний HTML-звіт. Прапорця --merge у команді тестів немає.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the correct syntax to run the second shard out of four total shards?",
        uk: "Яка правильна синтаксична форма для запуску другого шарду з чотирьох загальних?",
      },
      options: [
        { id: "a", label: { en: "npx playwright test --shard=2-4", uk: "npx playwright test --shard=2-4" } },
        { id: "b", label: { en: "npx playwright test --shard=2 --total=4", uk: "npx playwright test --shard=2 --total=4" } },
        { id: "c", label: { en: "npx playwright test --shard=2/4", uk: "npx playwright test --shard=2/4" } },
        { id: "d", label: { en: "npx playwright test --shard-index=2 --shard-count=4", uk: "npx playwright test --shard-index=2 --shard-count=4" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The `--shard` flag uses the format `{currentIndex}/{totalShards}`. So for shard 2 of 4, the syntax is `--shard=2/4`. This tells Playwright: 'I have 4 total machines; this one should run the 2nd slice of tests.' Each machine runs the command with its own index number (1/4, 2/4, 3/4, 4/4) in parallel.",
        uk: "Прапорець `--shard` використовує формат `{поточнийІндекс}/{всьогоШардів}`. Для шарду 2 з 4 синтаксис — `--shard=2/4`. Це каже Playwright: 'У мене 4 машини загалом; ця має виконати 2-ий зріз тестів.' Кожна машина запускає команду зі своїм індексом (1/4, 2/4, 3/4, 4/4) паралельно.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How does Playwright distribute tests across shards by default (without fullyParallel)?",
        uk: "Як Playwright розподіляє тести між шардами за замовчуванням (без fullyParallel)?",
      },
      options: [
        { id: "a", label: { en: "By test count — it counts all tests and divides them evenly", uk: "За кількістю тестів — рахує всі тести і ділить рівномірно" } },
        { id: "b", label: { en: "By file — whole test files are assigned to shards, so a file with 50 tests counts the same as a file with 2 tests", uk: "За файлами — цілі файли тестів призначаються шардам тому файл з 50 тестами рахується так само як файл з 2 тестами" } },
        { id: "c", label: { en: "By test duration from the previous run", uk: "За тривалістю тестів з попереднього запуску" } },
        { id: "d", label: { en: "Alphabetically by test name", uk: "За алфавітом за назвою тесту" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Without `fullyParallel: true`, Playwright assigns test files to shards. Each file is treated as an atomic unit — a file with 50 tests and a file with 2 tests both count as 'one file' for distribution purposes. This causes uneven shard runtimes when test files vary greatly in size. With `fullyParallel: true`, Playwright splits at the individual test level, giving roughly equal counts per shard.",
        uk: "Без `fullyParallel: true` Playwright призначає файли тестів шардам. Кожен файл розглядається як атомарна одиниця — файл з 50 тестами і файл з 2 тестами обидва рахуються як 'один файл' для цілей розподілу. Це спричиняє нерівномірний час виконання шардів коли файли тестів сильно різняться за розміром. З `fullyParallel: true` Playwright ділить на рівні окремих тестів надаючи приблизно рівну кількість на шард.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "In a GitHub Actions matrix strategy for sharding, what does fail-fast: false do and why is it important?",
        uk: "У матричній стратегії GitHub Actions для шардингу — що робить fail-fast: false і чому це важливо?",
      },
      options: [
        { id: "a", label: { en: "It makes failing tests retry automatically without stopping", uk: "Воно змушує тести що падають автоматично повторюватися без зупинки" } },
        { id: "b", label: { en: "It allows all shard jobs to complete even if one shard fails, so you collect blob reports from all shards for a complete picture", uk: "Воно дозволяє всім job шардів завершитися навіть якщо один шард впав щоб отримати blob-звіти з усіх шардів для повної картини" } },
        { id: "c", label: { en: "It disables the timeout on slow shards", uk: "Воно вимикає timeout для повільних шардів" } },
        { id: "d", label: { en: "It makes the matrix ignore errors and always report success", uk: "Воно змушує матрицю ігнорувати помилки і завжди звітувати про успіх" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By default, GitHub Actions matrix uses `fail-fast: true`, meaning if any matrix job fails, all other running jobs are cancelled immediately. For Playwright sharding, this would prevent the merge job from receiving blob reports from the shards that hadn't finished yet. Setting `fail-fast: false` lets all shard jobs run to completion regardless of failures, ensuring you get a full picture in the merged report.",
        uk: "За замовчуванням матриця GitHub Actions використовує `fail-fast: true` — тобто якщо будь-який матричний job падає всі інші запущені job негайно скасовуються. Для шардингу Playwright це б перешкодило merge-job отримати blob-звіти від шардів що ще не завершилися. Встановлення `fail-fast: false` дозволяє всім job шардів виконатися до кінця незалежно від падінь забезпечуючи повну картину в об'єднаному звіті.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "A test retries once and passes on the retry. Which shard runs the retry — the same shard that had the original failure, or potentially a different one?",
        uk: "Тест повторюється один раз і проходить при повторі. Який шард виконує повтор — той самий що мав початкове падіння чи потенційно інший?",
      },
      options: [
        { id: "a", label: { en: "A different shard is selected based on the retry number", uk: "Інший шард вибирається на основі номера повтору" } },
        { id: "b", label: { en: "The same shard — retries happen within the same CI job that originally ran the test", uk: "Той самий шард — повтори відбуваються в тому самому CI-job що спочатку запустив тест" } },
        { id: "c", label: { en: "A new CI machine is spawned specifically for the retry", uk: "Для повтору запускається нова CI-машина" } },
        { id: "d", label: { en: "Retries are disabled when sharding is enabled", uk: "Повтори вимикаються коли увімкнений шардинг" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Retries happen within the same shard job. When a test fails, the Playwright runner on that specific machine retries the test according to the `retries` config. The retry is not distributed to another shard — shards are independent jobs that each run their assigned slice of tests, including any retries for tests within that slice.",
        uk: "Повтори відбуваються в тому самому job шарду. Коли тест падає Playwright runner на цій конкретній машині повторює тест відповідно до конфігу `retries`. Повтор не розподіляється на інший шард — шарди незалежні job кожен з яких виконує свій призначений зріз тестів включаючи будь-які повтори для тестів у цьому зрізі.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You have 400 tests and use 4 shards, each with workers: 2. How many tests can run simultaneously at peak?",
        uk: "У тебе 400 тестів і 4 шарди кожен з workers: 2. Скільки тестів може виконуватися одночасно на піку?",
      },
      options: [
        { id: "a", label: { en: "4 — one per shard", uk: "4 — один на шард" } },
        { id: "b", label: { en: "2 — the worker count only", uk: "2 — тільки кількість воркерів" } },
        { id: "c", label: { en: "8 — 4 shards × 2 workers each", uk: "8 — 4 шарди × 2 воркери кожен" } },
        { id: "d", label: { en: "400 — all tests run at once", uk: "400 — всі тести виконуються одразу" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "Shards and workers operate at different levels. Each shard is an independent CI machine (process/job). Workers are parallel test runners within one shard. With 4 shards and 2 workers per shard, you have 4 × 2 = 8 tests running simultaneously across the cluster. Sharding multiplies the concurrency — it's additive: total parallelism = shards × workers per shard.",
        uk: "Шарди і воркери діють на різних рівнях. Кожен шард — це незалежна CI-машина (процес/job). Воркери — паралельні виконавці тестів всередині одного шарду. З 4 шардами і 2 воркерами на шард маємо 4 × 2 = 8 тестів виконуваних одночасно по всьому кластеру. Шардинг множить конкурентність — вона адитивна: загальна паралельність = шарди × воркери на шард.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "After all shards finish and upload their blob reports, what command merges them into a single HTML report?",
        uk: "Після завершення всіх шардів і завантаження їхніх blob-звітів — яка команда зливає їх в один HTML-звіт?",
      },
      options: [
        { id: "a", label: { en: "npx playwright merge-reports --reporter html ./all-blob-reports", uk: "npx playwright merge-reports --reporter html ./all-blob-reports" } },
        { id: "b", label: { en: "npx playwright show-report --merge ./all-blob-reports", uk: "npx playwright show-report --merge ./all-blob-reports" } },
        { id: "c", label: { en: "npx playwright test --merge-from ./all-blob-reports", uk: "npx playwright test --merge-from ./all-blob-reports" } },
        { id: "d", label: { en: "npx playwright report --combine ./all-blob-reports --output html", uk: "npx playwright report --combine ./all-blob-reports --output html" } },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`npx playwright merge-reports` is the dedicated command for combining blob reports. The `--reporter html` flag specifies the output format. The directory argument (`./all-blob-reports`) is where all the downloaded blob zip files are stored. The command reads all zips in that directory, combines the test data, and generates a single HTML report in the `playwright-report` folder.",
        uk: "`npx playwright merge-reports` — спеціальна команда для об'єднання blob-звітів. Прапорець `--reporter html` задає формат виводу. Аргумент директорії (`./all-blob-reports`) — де зберігаються всі скачані blob-zip файли. Команда читає всі zip у цій директорії об'єднує дані тестів і генерує один HTML-звіт у папці `playwright-report`.",
      },
    },
  ],
}
