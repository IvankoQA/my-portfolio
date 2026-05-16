import type { PlaywrightTopic } from "../../types"

export const testCliTopic: PlaywrightTopic = {
  slug: "test-cli",
  groupId: "test-runner",
  order: 320,
  level: "beginner",
  trackOrder: 12,
  sourceDoc: "test-cli-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-cli",
  title: {
    en: "Command line",
    uk: "Командний рядок",
  },
  summary: {
    en: "The flags I use every day: --grep to run a specific test by name, --last-failed to re-run only what broke, --project=firefox to test one browser, --debug to open Inspector and step through. On CI I always add --forbid-only so test.only() left in by accident fails the build.",
    uk: "Прапорці які я використовую щодня: --grep щоб запустити конкретний тест за назвою, --last-failed щоб повторно запустити лише те що зламалося, --project=firefox щоб тестувати один браузер, --debug щоб відкрити Inspector і проходити крок за кроком. На CI завжди додаю --forbid-only щоб test.only() залишений випадково провалював збірку.",
  },
  sections: [
    {
      id: "run-tests",
      title: {
        en: "Running tests — the commands I use most",
        uk: "Запуск тестів — команди які я використовую найчастіше",
      },
      paragraphs: [
        {
          en: "The most common thing: run a specific file, filter by test title, or target one browser. I almost never run all tests locally — too slow. I run the specific test or file I'm working on.",
          uk: "Найбільш поширене: запуск конкретного файлу, фільтрація за назвою тесту або цільовий один браузер. Я майже ніколи не запускаю всі тести локально — надто повільно. Запускаю конкретний тест або файл над яким працюю.",
        },
      ],
      codeBlocks: [
        {
          id: "common-commands",
          language: "bash",
          code: `# Запустити всі тести
npx playwright test

# Конкретний файл
npx playwright test tests/orders.spec.ts

# За назвою тесту (regex)
npx playwright test -g "create order"

# Конкретний рядок у файлі
npx playwright test orders.spec.ts:42

# Конкретний проєкт (браузер)
npx playwright test --project=firefox

# Тільки те що впало востаннє
npx playwright test --last-failed

# Дебаг режим (відкрити Inspector)
npx playwright test --debug

# Інтерактивний UI mode
npx playwright test --ui`,
        },
      ],
    },
    {
      id: "ci-flags",
      title: {
        en: "CI-specific flags",
        uk: "Прапорці специфічні для CI",
      },
      paragraphs: [
        {
          en: "`--forbid-only` is the one I add on CI to prevent `test.only()` from accidentally running only one test — if someone commits a file with `test.only`, CI fails loudly instead of silently running only that test and passing everything green.",
          uk: "`--forbid-only` — той що я додаю на CI щоб запобігти `test.only()` від випадкового запуску лише одного тесту: якщо хтось закомітив файл з `test.only` — CI голосно провалюється замість тихого запуску тільки того тесту і позеленіння всього.",
        },
        {
          en: "`--only-changed` runs only the test files affected by the current branch changes. Playwright analyzes import graphs — if I change `orders.service.ts`, it runs `orders.spec.ts` but not `dashboard.spec.ts`. Useful for fast PR feedback.",
          uk: "`--only-changed` запускає лише файли тестів яких торкнулися зміни поточної гілки. Playwright аналізує графи імпортів — якщо я змінюю `orders.service.ts`, він запускає `orders.spec.ts` але не `dashboard.spec.ts`. Корисно для швидкого зворотного зв'язку на PR.",
        },
      ],
      codeBlocks: [
        {
          id: "ci-commands",
          language: "bash",
          code: `# Провалити збірку якщо хтось залишив test.only()
npx playwright test --forbid-only

# Один воркер на CI (стабільніше на shared runners)
npx playwright test --workers=1

# Тільки тести змінені у поточному PR
npx playwright test --only-changed=origin/main

# Шардинг: цей job запускає 1/4 тестів
npx playwright test --shard=1/4`,
        },
      ],
    },
    {
      id: "output-and-debugging",
      title: {
        en: "Output and debugging flags",
        uk: "Прапорці виводу і дебагу",
      },
      paragraphs: [
        {
          en: "`--trace on` forces trace recording for every test — useful when I want a trace for a specific passing test to understand what it's doing. On CI I use `on-first-retry` in the config instead.",
          uk: "`--trace on` примусово записує трейс для кожного тесту — корисно коли хочу трейс для конкретного тесту що проходить щоб зрозуміти що він робить. На CI замість цього використовую `on-first-retry` у конфігурації.",
        },
      ],
      codeBlocks: [
        {
          id: "debug-commands",
          language: "bash",
          code: `# Headed режим (бачити браузер)
npx playwright test --headed

# Записати трейс для всіх тестів
npx playwright test --trace on

# Запустити кожен тест 5 разів (перевірка на flakiness)
npx playwright test --repeat-each=5

# Зупинитись після першої невдачі
npx playwright test -x

# Зупинитись після 3 невдач
npx playwright test --max-failures=3

# Показати тести без запуску
npx playwright test --list`,
        },
      ],
    },
    {
      id: "show-report",
      title: {
        en: "Show report and trace viewer",
        uk: "Показати звіт і переглядач трейсів",
      },
      paragraphs: [
        {
          en: "After tests finish, `npx playwright show-report` opens the HTML report in a browser. From there I can click on a failing test to see its trace, screenshots, and error details. I can also open a specific trace file or a downloaded CI artifact zip.",
          uk: "Після завершення тестів `npx playwright show-report` відкриває HTML-звіт у браузері. Звідти можна клікнути на тест що впав щоб побачити його трейс, скриншоти і деталі помилки. Також можна відкрити конкретний файл трейсу або скачаний CI-артефакт zip.",
        },
      ],
      codeBlocks: [
        {
          id: "report-commands",
          language: "bash",
          code: `# Відкрити останній звіт
npx playwright show-report

# Відкрити конкретну теку звіту
npx playwright show-report my-report/

# Відкрити zip з CI артефакту
npx playwright show-report playwright-report.zip

# Відкрити конкретний трейс
npx playwright show-trace test-results/my-test/trace.zip`,
        },
      ],
    },
    {
      id: "codegen",
      title: {
        en: "Code generation and other tools",
        uk: "Генерація коду та інші інструменти",
      },
      paragraphs: [
        {
          en: "`codegen` opens a browser where every click and fill automatically generates test code. I use it to quickly get the locators for new UI elements — faster than writing `getByRole()` calls manually when I don't know the element structure.",
          uk: "`codegen` відкриває браузер де кожен клік і заповнення автоматично генерує код тесту. Використовую щоб швидко отримати локатори для нових UI-елементів — швидше ніж вручну писати виклики `getByRole()` коли не знаю структуру елемента.",
        },
      ],
      codeBlocks: [
        {
          id: "codegen-commands",
          language: "bash",
          code: `# Відкрити codegen (записує в буфер обміну)
npx playwright codegen

# Codegen з конкретного URL
npx playwright codegen http://localhost:3000/orders

# Генерувати Python-код
npx playwright codegen --target=python

# Встановити/оновити браузери
npx playwright install --with-deps

# Злити blob-звіти з шардів
npx playwright merge-reports --reporter html ./all-blob-reports`,
        },
      ],
    },
    {
      id: "all-options",
      title: {
        en: "Full options reference",
        uk: "Повна довідка опцій",
      },
      paragraphs: [
        {
          en: "The complete list of CLI options for `npx playwright test`. I don't use most of these daily but they're useful to know.",
          uk: "Повний список CLI-опцій для `npx playwright test`. Більшість з них я не використовую щодня але корисно знати.",
        },
      ],
      codeBlocks: [
        {
          id: "all-options-table",
          language: "bash",
          code: `npx playwright test --help

# Найбільш корисні:
# --debug               Відкрити Playwright Inspector
# --headed              Запустити з видимим браузером
# -g, --grep            Фільтр за regex назви тесту
# --project             Запустити конкретний проєкт
# --ui                  Інтерактивний UI mode
# -j, --workers         Кількість паралельних воркерів
# --last-failed         Запустити тільки тести що впали
# --only-changed        Запустити тільки змінені тести
# --shard               Шард у форматі 1/4
# --repeat-each         Запустити кожен тест N разів
# --forbid-only         Провалити якщо є test.only()
# --trace               Режим запису трейсу
# --timeout             Тайм-аут тесту в мс
# --retries             Кількість повторів для flaky тестів
# -x                    Зупинитись після першої невдачі
# --update-snapshots    Оновити snapshot-очікування`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A developer commits a test file with test.only() left in by accident. All tests run on CI pass green. Why is this a problem and how do you prevent it?",
        uk: "Розробник закомітив файл тестів з випадково залишеним test.only(). Всі тести на CI проходять зеленим. Чому це проблема і як це запобігти?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It's not a problem — test.only() still runs all tests, just marks one as focused",
            uk: "Це не проблема — test.only() все одно запускає всі тести, просто позначає один як сфокусований",
          },
        },
        {
          id: "b",
          label: {
            en: "test.only() makes CI run only that one test — all others are silently skipped, giving false confidence. Add --forbid-only to CI to make test.only() fail the build",
            uk: "test.only() змушує CI запускати тільки той один тест — всі інші мовчки пропускаються, даючи хибну впевненість. Додай --forbid-only до CI щоб test.only() провалював збірку",
          },
        },
        {
          id: "c",
          label: {
            en: "The fix is to use test.skip() instead — it marks the test as skipped and is safe to commit",
            uk: "Виправлення — використати test.skip() замість цього — він позначає тест як пропущений і безпечний для комміту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.only()` causes Playwright to skip all other tests in the file (or across files if multiple .only() calls exist). The CI run shows 'all tests passed' but you've only actually run one. This is dangerous — a regression could ship undetected. `--forbid-only` tells Playwright to exit with an error code if any test.only() is found, which fails the CI job. This is a standard CI guard I always add.",
        uk: "`test.only()` змушує Playwright пропускати всі інші тести у файлі (або між файлами якщо є кілька .only() викликів). CI-запуск показує 'всі тести пройшли' але фактично запущено лише один. Це небезпечно — регресія може потрапити непоміченою. `--forbid-only` каже Playwright виходити з кодом помилки якщо знайдено будь-який test.only(), що провалює CI-job. Це стандартний CI-захист який я завжди додаю.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You want to send test results to a JUnit XML file for your CI system. Which CLI flag do you use?",
        uk: "Хочеш надсилати результати тестів у JUnit XML файл для своєї CI-системи. Який CLI-прапорець використати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "--output=junit",
            uk: "--output=junit",
          },
        },
        {
          id: "b",
          label: {
            en: "--reporter=junit",
            uk: "--reporter=junit",
          },
        },
        {
          id: "c",
          label: {
            en: "--format=xml",
            uk: "--format=xml",
          },
        },
        {
          id: "d",
          label: {
            en: "--export=junit",
            uk: "--export=junit",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The --reporter flag controls how test results are formatted and where they go. Built-in reporters include 'junit', 'html', 'dot', 'line', 'list', and 'json'. You can also combine reporters: '--reporter=html,junit'. The --output flag controls where test artifacts (traces, screenshots) are stored, not the report format.",
        uk: "Прапорець --reporter контролює як форматуються результати тестів і куди вони надсилаються. Вбудовані репортери включають 'junit', 'html', 'dot', 'line', 'list' і 'json'. Також можна комбінувати репортери: '--reporter=html,junit'. Прапорець --output контролює де зберігаються артефакти тестів (трейси, скриншоти) а не формат звіту.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Your CI has 4 parallel jobs and you want to split the test suite evenly across them. Which command runs the second job's share?",
        uk: "Твій CI має 4 паралельних jobs і хочеш рівномірно розподілити набір тестів між ними. Яка команда запускає частку другого job?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright test --split=2/4",
            uk: "npx playwright test --split=2/4",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright test --shard=2/4",
            uk: "npx playwright test --shard=2/4",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright test --parallel-index=2 --parallel-total=4",
            uk: "npx playwright test --parallel-index=2 --parallel-total=4",
          },
        },
        {
          id: "d",
          label: {
            en: "npx playwright test --chunk=2 --chunks=4",
            uk: "npx playwright test --chunk=2 --chunks=4",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "--shard=<index>/<total> is the correct syntax. Each CI job gets a different shard index (1/4, 2/4, 3/4, 4/4). Playwright distributes the tests evenly so no job overlaps with another. After all shards finish, you can merge the results with 'npx playwright merge-reports'. The --split and --chunk flags do not exist in Playwright.",
        uk: "--shard=<index>/<total> — правильний синтаксис. Кожен CI job отримує інший індекс шарду (1/4, 2/4, 3/4, 4/4). Playwright рівномірно розподіляє тести щоб жоден job не перекривався з іншим. Після завершення всіх шардів можна об'єднати результати через 'npx playwright merge-reports'. Прапорці --split і --chunk не існують у Playwright.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You are running a flaky test suite and want CI to stop as soon as 3 tests fail. Which flag achieves this?",
        uk: "Ти запускаєш нестабільний набір тестів і хочеш щоб CI зупинявся як тільки впадуть 3 тести. Який прапорець це забезпечує?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "--stop-after=3",
            uk: "--stop-after=3",
          },
        },
        {
          id: "b",
          label: {
            en: "--max-failures=3",
            uk: "--max-failures=3",
          },
        },
        {
          id: "c",
          label: {
            en: "--fail-fast=3",
            uk: "--fail-fast=3",
          },
        },
        {
          id: "d",
          label: {
            en: "--abort-on-failure=3",
            uk: "--abort-on-failure=3",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "--max-failures=N stops the test run after N tests have failed. This is useful on CI to avoid waiting for the full suite when a large number of tests are already failing. The shorthand -x (equivalent to --max-failures=1) stops on the first failure. --fail-fast, --stop-after, and --abort-on-failure are not valid Playwright CLI flags.",
        uk: "--max-failures=N зупиняє запуск тестів після N провалених тестів. Це корисно на CI щоб не чекати завершення всього набору коли вже провалилося багато тестів. Скорочення -x (еквівалент --max-failures=1) зупиняється на першій невдачі. --fail-fast, --stop-after і --abort-on-failure не є дійсними прапорцями Playwright CLI.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "A directory has no test files matching the pattern you specified. By default Playwright exits with an error. How do you make it exit successfully in this case?",
        uk: "Директорія не має файлів тестів що відповідають вказаному шаблону. За замовчуванням Playwright виходить з помилкою. Як змусити його виходити успішно в цьому випадку?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "--ignore-empty",
            uk: "--ignore-empty",
          },
        },
        {
          id: "b",
          label: {
            en: "--pass-with-no-tests",
            uk: "--pass-with-no-tests",
          },
        },
        {
          id: "c",
          label: {
            en: "--allow-empty",
            uk: "--allow-empty",
          },
        },
        {
          id: "d",
          label: {
            en: "--no-fail-on-empty",
            uk: "--no-fail-on-empty",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "--pass-with-no-tests exits with code 0 (success) even when no test files are found. This is useful in monorepos or feature-flag setups where some CI runs might legitimately have no tests to run for a given package or path. Without this flag, Playwright treats 'no tests found' as an error.",
        uk: "--pass-with-no-tests виходить з кодом 0 (успіх) навіть коли файли тестів не знайдені. Це корисно в монорепозиторіях або налаштуваннях з feature-флагами де деякі CI-запуски можуть законно не мати тестів для запуску для конкретного пакету або шляху. Без цього прапорця Playwright вважає 'тести не знайдені' помилкою.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You want to see all tests that will run (with their full names and file paths) without actually executing them. Which flag does this?",
        uk: "Хочеш побачити всі тести що будуть запущені (з повними назвами і шляхами файлів) без фактичного їх виконання. Який прапорець це робить?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "--dry-run",
            uk: "--dry-run",
          },
        },
        {
          id: "b",
          label: {
            en: "--list",
            uk: "--list",
          },
        },
        {
          id: "c",
          label: {
            en: "--preview",
            uk: "--preview",
          },
        },
        {
          id: "d",
          label: {
            en: "--show-tests",
            uk: "--show-tests",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "--list prints all test names, their file locations, and which projects they belong to — without running any of them. This is useful for verifying that your --grep filter matches the right tests, or auditing which tests exist before running a large suite. --dry-run, --preview, and --show-tests are not Playwright CLI flags.",
        uk: "--list виводить всі назви тестів, їхні розташування файлів і до яких проєктів вони належать — без запуску будь-якого з них. Це корисно для перевірки що фільтр --grep відповідає правильним тестам або аудиту існуючих тестів перед запуском великого набору. --dry-run, --preview і --show-tests не є прапорцями Playwright CLI.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "A test is consistently timing out after 30 seconds. You want to increase the per-test timeout to 60 seconds for a single run without changing the config file. Which flag do you use?",
        uk: "Тест постійно вичерпує timeout після 30 секунд. Хочеш збільшити timeout на тест до 60 секунд для одного запуску без зміни файлу конфігурації. Який прапорець використати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "--wait=60000",
            uk: "--wait=60000",
          },
        },
        {
          id: "b",
          label: {
            en: "--timeout=60000",
            uk: "--timeout=60000",
          },
        },
        {
          id: "c",
          label: {
            en: "--max-time=60",
            uk: "--max-time=60",
          },
        },
        {
          id: "d",
          label: {
            en: "--test-timeout=60s",
            uk: "--test-timeout=60s",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "--timeout sets the per-test timeout in milliseconds, overriding whatever is in playwright.config.ts for that run. So --timeout=60000 gives each test 60 seconds. Note this is different from the global test suite timeout. The value is always in milliseconds — --max-time=60 and --test-timeout=60s are not valid Playwright flags.",
        uk: "--timeout встановлює timeout на тест у мілісекундах, перевизначаючи те що в playwright.config.ts для того запуску. Тобто --timeout=60000 дає кожному тесту 60 секунд. Зверни увагу що це відрізняється від глобального timeout всього набору тестів. Значення завжди в мілісекундах — --max-time=60 і --test-timeout=60s не є дійсними прапорцями Playwright.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want to speed up a test run on your local machine. Which flag controls how many tests run in parallel?",
        uk: "Хочеш прискорити запуск тестів на локальній машині. Який прапорець контролює скільки тестів виконується паралельно?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "--concurrency=4",
            uk: "--concurrency=4",
          },
        },
        {
          id: "b",
          label: {
            en: "--workers=4 (or -j 4)",
            uk: "--workers=4 (або -j 4)",
          },
        },
        {
          id: "c",
          label: {
            en: "--parallel=4",
            uk: "--parallel=4",
          },
        },
        {
          id: "d",
          label: {
            en: "--threads=4",
            uk: "--threads=4",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "--workers=N (shorthand: -j N) sets the number of parallel worker processes. By default Playwright uses half the available CPU cores. On CI with shared runners you might set --workers=1 for stability. Locally with a fast machine you can set it higher to speed up the suite. --concurrency, --parallel, and --threads are not valid Playwright flags.",
        uk: "--workers=N (скорочення: -j N) встановлює кількість паралельних worker-процесів. За замовчуванням Playwright використовує половину доступних ядер CPU. На CI з shared runners можна встановити --workers=1 для стабільності. Локально на швидкій машині можна встановити вище щоб прискорити набір. --concurrency, --parallel і --threads не є дійсними прапорцями Playwright.",
      },
    },
  ],
}
