import type { PlaywrightTopic } from "../../types"

export const testCliTopic: PlaywrightTopic = {
  slug: "test-cli",
  groupId: "test-runner",
  order: 320,
  sourceDoc: "test-cli-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-cli",
  title: {
    en: "Command line",
    uk: "Командний рядок",
  },
  summary: {
    en: "Playwright provides a powerful command line interface for running tests, generating code, debugging, and more. The most up to date list of commands and arguments available on the CLI can always be retrieved via `npx playwright --help`.",
    uk: "Playwright надає потужний інтерфейс командного рядка для запуску тестів, генерації коду, налагодження тощо. Актуальний список команд і аргументів CLI завжди можна отримати через `npx playwright --help`.",
  },
  sections: [
    {
      id: "overview",
      title: {
        en: "Overview",
        uk: "Огляд",
      },
      paragraphs: [
        {
          en: "Playwright provides a powerful command line interface for running tests, generating code, debugging, and more. The most up to date list of commands and arguments available on the CLI can always be retrieved via `npx playwright --help`.",
          uk: "Playwright надає потужний інтерфейс командного рядка для запуску тестів, генерації коду, налагодження тощо. Актуальний список команд і аргументів CLI завжди можна отримати через `npx playwright --help`.",
        },
      ],
    },
    {
      id: "essential-commands",
      title: {
        en: "Essential Commands",
        uk: "Основні команди",
      },
      paragraphs: [
        {
          en: "### Run Tests",
          uk: "### Запуск тестів",
        },
        {
          en: "Run your Playwright tests. [Read more about running tests](./running-tests.md).",
          uk: "Запустіть тести Playwright. [Докладніше про запуск тестів](./running-tests.md).",
        },
        {
          en: "#### Syntax",
          uk: "#### Синтаксис",
        },
        {
          en: "#### Examples",
          uk: "#### Приклади",
        },
        {
          en: "**Disable [parallelization](./test-parallel.md)**",
          uk: "**Вимкнути [паралелізацію](./test-parallel.md)**",
        },
        {
          en: "**Run in debug mode with [Playwright Inspector](./debug.md)**",
          uk: "**Запуск у режимі налагодження з [Playwright Inspector](./debug.md)**",
        },
        {
          en: "**Run tests in interactive [UI mode](./test-ui-mode.md)**",
          uk: "**Запуск тестів в інтерактивному [UI mode](./test-ui-mode.md)**",
        },
        {
          en: "#### Common Options",
          uk: "#### Поширені опції",
        },
        {
          en: "| Option | Description |\n| :--- | :--- |\n| `--debug` | Run tests with Playwright Inspector. Shortcut for `PWDEBUG=1` environment variable and `--timeout=0 --max-failures=1 --headed --workers=1` options. |\n| `--headed` | Run tests in headed browsers (default: headless). |\n| `-g ` or `--grep ` | Only run tests matching this regular expression (default: \".*\"). |\n| `--project ` | Only run tests from the specified list of projects, supports '*' wildcard (default: run all projects). |\n| `--ui` | Run tests in interactive UI mode. |\n| `-j ` or `--workers ` | Number of concurrent workers or percentage of logical CPU cores, use 1 to run in a single worker (default: 50%). |",
          uk: "| Опція | Опис |\n| :--- | :--- |\n| `--debug` | Запускає тести з Playwright Inspector. Скорочення для змінної середовища `PWDEBUG=1` і опцій `--timeout=0 --max-failures=1 --headed --workers=1`. |\n| `--headed` | Запускає тести в браузерах з інтерфейсом (за замовчуванням: headless). |\n| `-g ` or `--grep ` | Запускає лише тести, що відповідають цьому регулярному виразу (за замовчуванням: \".*\"). |\n| `--project ` | Запускає лише тести з вказаного списку проєктів; підтримує шаблон '*' (за замовчуванням: усі проєкти). |\n| `--ui` | Запускає тести в інтерактивному UI-режимі. |\n| `-j ` or `--workers ` | Кількість паралельних воркерів або відсоток логічних ядер CPU; 1 — один воркер (за замовчуванням: 50%). |",
        },
        {
          en: "#### All Options",
          uk: "#### Усі опції",
        },
        {
          en: '| Option | Description |\n| :--- | :--- |\n| Non-option arguments | Each argument is treated as a regular expression matched against the full test file path. Only tests from files matching the pattern will be executed. Special symbols like `$` or `*` should be escaped with `\\`. In many shells/terminals you may need to quote the arguments. |\n| `-c ` or `--config ` | Configuration file, or a test directory with optional "playwright.config.&#123;m,c&#125;?&#123;js,ts&#125;". Defaults to `playwright.config.ts` or `playwright.config.js` in the current directory. |\n| `--debug` | Run tests with Playwright Inspector. Shortcut for `PWDEBUG=1` environment variable and `--timeout=0 --max-failures=1 --headed --workers=1` options. |\n| `--fail-on-flaky-tests` | Fail if any test is flagged as flaky (default: false). |\n| `--forbid-only` | Fail if `test.only` is called (default: false). Useful on CI. |\n| `--fully-parallel` | Run all tests in parallel (default: false). |\n| `--global-timeout ` | Maximum time this test suite can run in milliseconds (default: unlimited). |\n| `-g ` or `--grep ` | Only run tests matching this regular expression (default: ".*"). |\n| `--grep-invert ` | Only run tests that do not match this regular expression. |\n| `--headed` | Run tests in headed browsers (default: headless). |\n| `--ignore-snapshots` | Ignore screenshot and snapshot expectations. |\n| `-j ` or `--workers ` | Number of concurrent workers or percentage of logical CPU cores, use 1 to run in a single worker (default: 50%). |\n| `--last-failed` | Only re-run the failures. |\n| `--list` | Collect all the tests and report them, but do not run. |\n| `--max-failures ` or `-x` | Stop after the first `N` failures. Passing `-x` stops after the first failure. |\n| `--no-deps` | Do not run project dependencies. |\n| `--output ` | Folder for output artifacts (default: "test-results"). |\n| `--only-changed [ref]` | Only run test files that have been changed between \'HEAD\' and \'ref\'. Defaults to running all uncommitted changes. Only supports Git. |\n| `--pass-with-no-tests` | Makes test run succeed even if no tests were found. |\n| `--project ` | Only run tests from the specified list of projects, supports \'*\' wildcard (default: run all projects). |\n| `--quiet` | Suppress stdio. |\n| `--repeat-each ` | Run each test `N` times (default: 1). |\n| `--reporter ` | Reporter to use, comma-separated, can be "dot", "line", "list", or others (default: "list"). You can also pass a path to a custom reporter file. |\n| `--retries ` | Maximum retry count for flaky tests, zero for no retries (default: no retries). |\n| `--shard ` | Shard tests and execute only the selected shard, specified in the form "current/all", 1-based, e.g., "3/5". |\n| `--test-list ` | Path to a file containing a list of tests to run. See [test list](#test-list) for details. |\n| `--test-list-invert ` | Path to a file containing a list of tests to skip. See [test list](#test-list) for details.  |\n| `--timeout ` | Specify test timeout threshold in milliseconds, zero for unlimited (default: 30 seconds). |\n| `--trace ` | Force tracing mode, can be `on`, `off`, `on-first-retry`, `on-all-retries`, `retain-on-failure`, `retain-on-first-failure`, `retain-on-failure-and-retries`. |\n| `--tsconfig ` | Path to a single tsconfig applicable to all imported files (default: look up tsconfig for each imported file separately). |\n| `--ui` | Run tests in interactive UI mode. |\n| `--ui-host ` | Host to serve UI on; specifying this option opens UI in a browser tab. |\n| `--ui-port ` | Port to serve UI on, 0 for any free port; specifying this option opens UI in a browser tab. |\n| `-u` or `--update-snapshots [mode]` | Update snapshots with actual results. Possible values are "all", "changed", "missing", and "none". Running tests without the flag defaults to "missing"; running tests with the flag but without a value defaults to "changed". |\n| `--update-source-method [mode]` | Update snapshots with actual results. Possible values are "patch" (default), "3way" and "overwrite". "Patch" creates a unified diff file that can be used to update the source code later. "3way" generates merge conflict markers in source code. "Overwrite" overwrites the source code with the new snapshot values.|\n| `-x` | Stop after the first failure. |',
          uk: '| Опція | Опис |\n| :--- | :--- |\n| Non-option arguments | Кожен аргумент трактується як регулярний вираз, який зіставляється з повним шляхом до тестового файлу. Виконуватимуться лише тести з файлів, що відповідають шаблону. Спеціальні символи на кшталт `$` або `*` слід екранувати за допомогою `\\`. У багатьох оболонках/терміналах аргументи варто брати в лапки. |\n| `-c ` or `--config ` | Файл конфігурації або каталог із тестами з опційним шляхом "playwright.config.&#123;m,c&#125;?&#123;js,ts&#125;". За замовчуванням — `playwright.config.ts` або `playwright.config.js` у поточному каталозі. |\n| `--debug` | Запускає тести з Playwright Inspector. Скорочення для змінної середовища `PWDEBUG=1` і опцій `--timeout=0 --max-failures=1 --headed --workers=1`. |\n| `--fail-on-flaky-tests` | Завершує з помилкою, якщо будь-який тест позначено як flaky (за замовчуванням: false). |\n| `--forbid-only` | Завершує з помилкою, якщо викликано `test.only` (за замовчуванням: false). Корисно на CI. |\n| `--fully-parallel` | Запускає всі тести паралельно (за замовчуванням: false). |\n| `--global-timeout ` | Максимальний час виконання набору тестів у мілісекундах (за замовчуванням: без обмеження). |\n| `-g ` or `--grep ` | Запускає лише тести, що відповідають цьому регулярному виразу (за замовчуванням: ".*"). |\n| `--grep-invert ` | Запускає лише тести, що не відповідають цьому регулярному виразу. |\n| `--headed` | Запускає тести в браузерах з інтерфейсом (за замовчуванням: headless). |\n| `--ignore-snapshots` | Ігнорує очікування скриншотів і snapshot. |\n| `-j ` or `--workers ` | Кількість паралельних воркерів або відсоток логічних ядер CPU; 1 — один воркер (за замовчуванням: 50%). |\n| `--last-failed` | Повторно запускає лише невдалі тести. |\n| `--list` | Збирає всі тести й виводить звіт без запуску. |\n| `--max-failures ` or `-x` | Зупиняється після перших `N` невдач. Передача `-x` зупиняє після першої невдачі. |\n| `--no-deps` | Не запускає залежності проєкту. |\n| `--output ` | Каталог для артефактів (за замовчуванням: "test-results"). |\n| `--only-changed [ref]` | Запускає лише тестові файли, змінені між \'HEAD\' і \'ref\'. За замовчуванням — усі незакомічені зміни. Підтримується лише Git. |\n| `--pass-with-no-tests` | Робить запуск успішним, навіть якщо тестів не знайдено. |\n| `--project ` | Запускає лише тести з вказаного списку проєктів; підтримує шаблон \'*\' (за замовчуванням: усі проєкти). |\n| `--quiet` | Приховує stdio. |\n| `--repeat-each ` | Запускає кожен тест `N` разів (за замовчуванням: 1). |\n| `--reporter ` | Репортер: через кому, можливі значення "dot", "line", "list" тощо (за замовчуванням: "list"). Можна передати шлях до власного файлу репортера. |\n| `--retries ` | Максимальна кількість повторів для flaky-тестів; 0 — без повторів (за замовчуванням: без повторів). |\n| `--shard ` | Розбиває тести на шарди й виконує лише вибраний шард у формі "current/all", відлік з 1, наприклад "3/5". |\n| `--test-list ` | Шлях до файлу зі списком тестів для запуску. Докладніше — [test list](#test-list). |\n| `--test-list-invert ` | Шлях до файлу зі списком тестів для пропуску. Докладніше — [test list](#test-list). |\n| `--timeout ` | Поріг таймауту тесту в мілісекундах; 0 — без обмеження (за замовчуванням: 30 секунд). |\n| `--trace ` | Примусовий режим трасування: `on`, `off`, `on-first-retry`, `on-all-retries`, `retain-on-failure`, `retain-on-first-failure`, `retain-on-failure-and-retries`. |\n| `--tsconfig ` | Шлях до одного tsconfig для всіх імпортованих файлів (за замовчуванням: окремий пошук tsconfig для кожного файлу). |\n| `--ui` | Запускає тести в інтерактивному UI-режимі. |\n| `--ui-host ` | Хост для UI; якщо вказано, UI відкриється у вкладці браузера. |\n| `--ui-port ` | Порт для UI; 0 — будь-який вільний порт; якщо вказано, UI відкриється у вкладці браузера. |\n| `-u` or `--update-snapshots [mode]` | Оновлює snapshot фактичними результатами. Можливі значення: "all", "changed", "missing", "none". Без прапорця за замовчуванням — "missing"; з прапорцем без значення — "changed". |\n| `--update-source-method [mode]` | Оновлює snapshot фактичними результатами. Можливі значення: "patch" (за замовчуванням), "3way" і "overwrite". "Patch" створює unified diff для подальшого оновлення коду. "3way" додає маркери конфлікту злиття. "Overwrite" перезаписує код новими значеннями snapshot. |\n| `-x` | Зупиняється після першої невдачі. |',
        },
        {
          en: "#### Test list",
          uk: "#### Список тестів",
        },
        {
          en: "Options `--test-list` and `--test-list-invert` accept a path to a test list file. This file should list tests in the format similar to the output produced in `--list` mode.",
          uk: "Опції `--test-list` і `--test-list-invert` приймають шлях до файлу зі списком тестів. Файл має містити тести у форматі, подібному до виводу режиму `--list`.",
        },
        {
          en: "### Show Report",
          uk: "### Показати звіт",
        },
        {
          en: "Display HTML report from previous test run. [Read more about the HTML reporter](./test-reporters#html-reporter).",
          uk: "Показує HTML-звіт з попереднього запуску тестів. [Докладніше про HTML reporter](./test-reporters#html-reporter).",
        },
        {
          en: "#### Syntax",
          uk: "#### Синтаксис",
        },
        {
          en: "#### Examples",
          uk: "#### Приклади",
        },
        {
          en: "#### Options",
          uk: "#### Опції",
        },
        {
          en: "| Option | Description |\n| :--- | :--- |\n| `--host ` | Host to serve report on (default: localhost) |\n| `--port ` | Port to serve report on (default: 9323) |",
          uk: "| Опція | Опис |\n| :--- | :--- |\n| `--host ` | Хост для звіту (за замовчуванням: localhost) |\n| `--port ` | Порт для звіту (за замовчуванням: 9323) |",
        },
        {
          en: "### Install Browsers",
          uk: "### Встановлення браузерів",
        },
        {
          en: "Install browsers required by Playwright. [Read more about Playwright's browser support](./browsers.md).",
          uk: "Встановлює браузери, потрібні Playwright. [Докладніше про підтримку браузерів](./browsers.md).",
        },
        {
          en: "#### Syntax",
          uk: "#### Синтаксис",
        },
        {
          en: "#### Examples",
          uk: "#### Приклади",
        },
        {
          en: "#### Install Options",
          uk: "#### Опції встановлення",
        },
        {
          en: "| Option | Description |\n| :--- | :--- |\n| `--force` | Force reinstall of stable browser channels |\n| `--with-deps` | Install browser system dependencies |\n| `--dry-run` | Don't perform installation, just print information |\n| `--only-shell` | Only install chromium-headless-shell instead of full Chromium |\n| `--no-shell` | Don't install chromium-headless-shell |",
          uk: "| Опція | Опис |\n| :--- | :--- |\n| `--force` | Примусово перевстановити стабільні канали браузерів |\n| `--with-deps` | Встановити системні залежності браузера |\n| `--dry-run` | Не встановлювати, лише вивести інформацію |\n| `--only-shell` | Встановити лише chromium-headless-shell замість повного Chromium |\n| `--no-shell` | Не встановлювати chromium-headless-shell |",
        },
        {
          en: "#### Install Deps Options",
          uk: "#### Опції встановлення залежностей",
        },
        {
          en: "| Option | Description |\n| :--- | :--- |\n| `--dry-run` | Don't modify the system. On Linux, simulates the install via apt-get and exits with a non-zero code if any required packages are missing — useful for non-interactive verification scripts. On Windows, prints the install command. |",
          uk: "| Опція | Опис |\n| :--- | :--- |\n| `--dry-run` | Не змінює систему. На Linux імітує встановлення через apt-get і завершує з ненульовим кодом, якщо бракує пакетів — корисно для неінтерактивних скриптів перевірки. На Windows виводить команду встановлення. |",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright test [options] [test-filter...]",
        },
        {
          id: "cb-2",
          language: "bash",
          code: '# Run all tests\nnpx playwright test\n\n# Run a single test file\nnpx playwright test tests/todo-page.spec.ts\n\n# Run a set of test files\nnpx playwright test tests/todo-page/ tests/landing-page/\n\n# Run tests at a specific line\nnpx playwright test my-spec.ts:42\n\n# Run tests by title\nnpx playwright test -g "add a todo item"\n\n# Run tests in headed browsers\nnpx playwright test --headed\n\n# Run tests for a specific project\nnpx playwright test --project=chromium\n\n# Get help\nnpx playwright test --help',
        },
        {
          id: "cb-3",
          language: "bash",
          code: "npx playwright test --workers=1",
        },
        {
          id: "cb-4",
          language: "bash",
          code: "npx playwright test --debug",
        },
        {
          id: "cb-5",
          language: "bash",
          code: "npx playwright test --ui",
        },
        {
          id: "cb-6",
          language: "txt",
          code: '# This is a test list file.\n# It can include comments and empty lines.\n\n# Run ALL tests in a file:\npath/to/example.spec.ts\n\n# Run all tests in a file for a specific project:\n[chromium] › path/to/example.spec.ts\n\n# Run all tests in a specific group/suite:\npath/to/example.spec.ts › suite name\n\n# Run all tests in a nested group:\npath/to/example.spec.ts › outer suite › inner suite\n\n# Fully qualified test with a project:\n[chromium] › path/to/example.spec.ts:3:9 › suite › nested suite › example test\n\n# This test is included for all projects:\npath/to/example.spec.ts:3:9 › example test\n\n# Use "›" or ">" as a separator:\n[firefox] > example.spec.ts > suite > nested suite > example test\n\n# Line/column numbers are completely ignored, you can omit them.\n# Three entries below refer to the same test:\nexample.spec.ts › example test\nexample.spec.ts:15 › example test\nexample.spec.ts:42:42 › example test',
        },
        {
          id: "cb-7",
          language: "bash",
          code: "npx playwright show-report [report] [options]",
        },
        {
          id: "cb-8",
          language: "bash",
          code: "# Show latest test report\nnpx playwright show-report\n\n# Show a specific report\nnpx playwright show-report playwright-report/\n\n# Show report on custom port\nnpx playwright show-report --port 8080",
        },
        {
          id: "cb-9",
          language: "bash",
          code: "npx playwright install [options] [browser...]\nnpx playwright install-deps [options] [browser...]\nnpx playwright uninstall",
        },
        {
          id: "cb-10",
          language: "bash",
          code: "# Install all browsers\nnpx playwright install\n\n# Install only Chromium\nnpx playwright install chromium\n\n# Install specific browsers\nnpx playwright install chromium webkit\n\n# Install browsers with dependencies\nnpx playwright install --with-deps",
        },
      ],
    },
    {
      id: "generation-debugging-tools",
      title: {
        en: "Generation & Debugging Tools",
        uk: "Генерація та інструменти налагодження",
      },
      paragraphs: [
        {
          en: "### Code Generation",
          uk: "### Генерація коду",
        },
        {
          en: "Record actions and generate tests for multiple languages. [Read more about Codegen](./codegen-intro.md).",
          uk: "Записує дії та генерує тести для кількох мов. [Докладніше про Codegen](./codegen-intro.md).",
        },
        {
          en: "#### Syntax",
          uk: "#### Синтаксис",
        },
        {
          en: "#### Examples",
          uk: "#### Приклади",
        },
        {
          en: "#### Options",
          uk: "#### Опції",
        },
        {
          en: "| Option | Description |\n| :--- | :--- |\n| `-b, --browser ` | Browser to use: chromium, firefox, or webkit (default: chromium) |\n| `-o, --output ` | Output file for the generated script |\n| `--target ` | Language to use: javascript, playwright-test, python, etc. |\n| `--test-id-attribute ` | Attribute to use for test IDs |",
          uk: "| Опція | Опис |\n| :--- | :--- |\n| `-b, --browser ` | Браузер: chromium, firefox або webkit (за замовчуванням: chromium) |\n| `-o, --output ` | Файл для згенерованого скрипта |\n| `--target ` | Мова: javascript, playwright-test, python тощо |\n| `--test-id-attribute ` | Атрибут для test ID |",
        },
        {
          en: "### Trace Viewer",
          uk: "### Trace Viewer",
        },
        {
          en: "Analyze and view test traces for debugging. [Read more about Trace Viewer](./trace-viewer.md).",
          uk: "Аналізує та показує трейси тестів для налагодження. [Докладніше про Trace Viewer](./trace-viewer.md).",
        },
        {
          en: "#### Syntax",
          uk: "#### Синтаксис",
        },
        {
          en: "#### Examples",
          uk: "#### Приклади",
        },
        {
          en: "#### Options",
          uk: "#### Опції",
        },
        {
          en: "| Option | Description |\n| :--- | :--- |\n| `-b, --browser ` | Browser to use: chromium, firefox, or webkit (default: chromium) |\n| `-h, --host ` | Host to serve trace on |\n| `-p, --port ` | Port to serve trace on |",
          uk: "| Опція | Опис |\n| :--- | :--- |\n| `-b, --browser ` | Браузер: chromium, firefox або webkit (за замовчуванням: chromium) |\n| `-h, --host ` | Хост для трейсу |\n| `-p, --port ` | Порт для трейсу |",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "bash",
          code: "npx playwright codegen [options] [url]",
        },
        {
          id: "cb-12",
          language: "bash",
          code: "# Start recording with interactive UI\nnpx playwright codegen\n\n# Record on specific site\nnpx playwright codegen https://playwright.dev\n\n# Generate Python code\nnpx playwright codegen --target=python",
        },
        {
          id: "cb-13",
          language: "bash",
          code: "npx playwright show-trace [options] [trace]",
        },
        {
          id: "cb-14",
          language: "bash",
          code: "# Open trace viewer without a specific trace (can load traces via UI)\nnpx playwright show-trace\n\n# View a trace file\nnpx playwright show-trace trace.zip\n\n# View trace from directory\nnpx playwright show-trace trace/",
        },
      ],
    },
    {
      id: "specialized-commands",
      title: {
        en: "Specialized Commands",
        uk: "Спеціалізовані команди",
      },
      paragraphs: [
        {
          en: "### Merge Reports",
          uk: "### Об'єднання звітів",
        },
        {
          en: "Read [blob](./test-reporters#blob-reporter) reports and combine them. [Read more about merge-reports](./test-sharding.md).",
          uk: "Читає [blob](./test-reporters#blob-reporter)-звіти та об'єднує їх. [Докладніше про merge-reports](./test-sharding.md).",
        },
        {
          en: "#### Syntax",
          uk: "#### Синтаксис",
        },
        {
          en: "#### Examples",
          uk: "#### Приклади",
        },
        {
          en: "#### Options",
          uk: "#### Опції",
        },
        {
          en: '| Option | Description |\n| :--- | :--- |\n| `-c, --config ` | Configuration file. Can be used to specify additional configuration for the output report |\n| `--reporter ` | Reporter to use, comma-separated, can be "list", "line", "dot", "json", "junit", "null", "github", "html", "blob" (default: "list") |',
          uk: '| Опція | Опис |\n| :--- | :--- |\n| `-c, --config ` | Файл конфігурації. Можна використати для додаткових налаштувань вихідного звіту |\n| `--reporter ` | Репортер через кому: "list", "line", "dot", "json", "junit", "null", "github", "html", "blob" (за замовчуванням: "list") |',
        },
        {
          en: "### Clear Cache",
          uk: "### Очищення кешу",
        },
        {
          en: "Clear all Playwright caches.",
          uk: "Очищає всі кеші Playwright.",
        },
        {
          en: "#### Syntax",
          uk: "#### Синтаксис",
        },
      ],
      codeBlocks: [
        {
          id: "cb-15",
          language: "bash",
          code: "npx playwright merge-reports [options]",
        },
        {
          id: "cb-16",
          language: "bash",
          code: "# Combine test reports\nnpx playwright merge-reports ./reports",
        },
        {
          id: "cb-17",
          language: "bash",
          code: "npx playwright clear-cache",
        },
      ],
    },
  ],
  quiz: [],
}
