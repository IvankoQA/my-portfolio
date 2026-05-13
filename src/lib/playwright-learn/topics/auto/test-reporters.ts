import type { PlaywrightTopic } from "../../types"

export const testReportersTopic: PlaywrightTopic = {
  slug: "test-reporters",
  groupId: "test-runner",
  order: 360,
  sourceDoc: "test-reporters-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-reporters",
  title: {
    en: "Reporters",
    uk: "Репортери",
  },
  summary: {
    en: "Playwright Test comes with a few built-in reporters for different needs and ability to provide custom reporters. The easiest way to try out built-in reporters is to pass `--reporter` [command line option](./test-cli.md).",
    uk: "Playwright Test постачає кілька вбудованих репортерів для різних сценаріїв і дає змогу підключати власні. Найпростіше спробувати вбудовані репортери — передати `--reporter` як [опцію командного рядка](./test-cli.md).",
  },
  sections: [
    {
      id: "introduction",
      title: {
        en: "Introduction",
        uk: "Вступ",
      },
      paragraphs: [
        {
          en: "Playwright Test comes with a few built-in reporters for different needs and ability to provide custom reporters. The easiest way to try out built-in reporters is to pass `--reporter` [command line option](./test-cli.md).",
          uk: "Playwright Test постачає кілька вбудованих репортерів для різних сценаріїв і дає змогу підключати власні. Найпростіше спробувати вбудовані репортери — передати `--reporter` як [опцію командного рядка](./test-cli.md).",
        },
        {
          en: "For more control, you can specify reporters programmatically in the [configuration file](./test-configuration.md).",
          uk: "Для тоншого керування репортери можна задати програмно у [файлі конфігурації](./test-configuration.md).",
        },
        {
          en: "### Multiple reporters",
          uk: "### Кілька репортерів",
        },
        {
          en: "You can use multiple reporters at the same time. For example  you can use `'list'` for nice terminal output and `'json'` to get a comprehensive json file with the test results.",
          uk: "Можна використовувати кілька репортерів одночасно. Наприклад, `'list'` — зручний вивід у термінал, а `'json'` — повний JSON-файл із результатами тестів.",
        },
        {
          en: "### Reporters on CI",
          uk: "### Репортери в CI",
        },
        {
          en: "You can use different reporters locally and on CI. For example, using concise `'dot'` reporter avoids too much output. This is the default on CI.",
          uk: "Локально й у CI можна використовувати різні репортери. Наприклад, стислий `'dot'` зменшує обсяг виводу; у CI він типовий за замовчуванням.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright test --reporter=line",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: 'line',\n});",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: [\n    ['list'],\n    ['json', {  outputFile: 'test-results.json' }]\n  ],\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "\nexport default defineConfig({\n  // Concise 'dot' for CI, default 'list' when running locally\n  reporter: process.env.CI ? 'dot' : 'list',\n});",
        },
      ],
    },
    {
      id: "built-in-reporters",
      title: {
        en: "Built-in reporters",
        uk: "Вбудовані репортери",
      },
      paragraphs: [
        {
          en: "All built-in reporters show detailed information about failures, and mostly differ in verbosity for successful runs.",
          uk: "Усі вбудовані репортери детально показують збої; для успішних прогонів вони переважно відрізняються деталізацією виводу.",
        },
        {
          en: "### List reporter",
          uk: "### Репортер list",
        },
        {
          en: "List reporter is default (except on CI where the `dot` reporter is default). It prints a line for each test being run.",
          uk: "Репортер `list` типовий за замовчуванням (на CI за замовчуванням — `dot`). Для кожного тесту друкується окремий рядок.",
        },
        {
          en: "Here is an example output in the middle of a test run. Failures will be listed at the end.",
          uk: "Ось приклад виводу під час прогону. Збої будуть перелічені в кінці.",
        },
        {
          en: "You can opt into the step rendering via passing the following config option:",
          uk: "Відображення кроків можна увімкнути такою опцією конфігурації:",
        },
        {
          en: "List report supports the following configuration options and environment variables:",
          uk: "Звіт list підтримує такі опції конфігурації та змінні середовища:",
        },
        {
          en: "| Environment Variable Name | Reporter Config Option| Description | Default\n|---|---|---|---|\n| `PLAYWRIGHT_LIST_PRINT_STEPS` | `printSteps` | Whether to print each step on its own line. | `false`\n| `PLAYWRIGHT_FORCE_TTY` | | Whether to produce output suitable for a live terminal. Supports `true`, `1`, `false`, `0`, `[WIDTH]`, and `[WIDTH]x[HEIGHT]`. `[WIDTH]` and `[WIDTH]x[HEIGHT]` specifies the TTY dimensions. | `true` when terminal is in TTY mode, `false` otherwise.\n| `FORCE_COLOR` | | Whether to produce colored output. | `true` when terminal is in TTY mode, `false` otherwise.",
          uk: "| Назва змінної середовища | Опція конфігурації репортера| Опис | Типово\n|---|---|---|---|\n| `PLAYWRIGHT_LIST_PRINT_STEPS` | `printSteps` | Чи друкувати кожен крок на окремому рядку. | `false`\n| `PLAYWRIGHT_FORCE_TTY` | | Чи формувати вивід, придатний для інтерактивного термінала. Підтримує `true`, `1`, `false`, `0`, `[WIDTH]` та `[WIDTH]x[HEIGHT]`. `[WIDTH]` і `[WIDTH]x[HEIGHT]` задають розміри TTY. | `true`, якщо термінал у режимі TTY, інакше `false`.\n| `FORCE_COLOR` | | Чи формувати кольоровий вивід. | `true`, якщо термінал у режимі TTY, інакше `false`.",
        },
        {
          en: "### Line reporter",
          uk: "### Репортер line",
        },
        {
          en: "Line reporter is more concise than the list reporter. It uses a single line to report last finished test, and prints failures when they occur. Line reporter is useful for large test suites where it shows the progress but does not spam the output by listing all the tests.",
          uk: "Репортер `line` стисліший за `list`: один рядок для останнього завершеного тесту, збої виводяться одразу. Зручний для великих збірок — видно прогрес без переліку всіх тестів.",
        },
        {
          en: "Here is an example output in the middle of a test run. Failures are reported inline.",
          uk: "Ось приклад виводу під час прогону. Збої показуються в тому ж потоці.",
        },
        {
          en: "Line report supports the following configuration options and environment variables:",
          uk: "Звіт line підтримує такі опції конфігурації та змінні середовища:",
        },
        {
          en: "| Environment Variable Name | Reporter Config Option| Description | Default\n|---|---|---|---|\n| `PLAYWRIGHT_FORCE_TTY` | | Whether to produce output suitable for a live terminal. Supports `true`, `1`, `false`, `0`, `[WIDTH]`, and `[WIDTH]x[HEIGHT]`. `[WIDTH]` and `[WIDTH]x[HEIGHT]` specifies the TTY dimensions. | `true` when terminal is in TTY mode, `false` otherwise.\n| `FORCE_COLOR` | | Whether to produce colored output. | `true` when terminal is in TTY mode, `false` otherwise.",
          uk: "| Назва змінної середовища | Опція конфігурації репортера| Опис | Типово\n|---|---|---|---|\n| `PLAYWRIGHT_FORCE_TTY` | | Чи формувати вивід, придатний для інтерактивного термінала. Підтримує `true`, `1`, `false`, `0`, `[WIDTH]` та `[WIDTH]x[HEIGHT]`. `[WIDTH]` і `[WIDTH]x[HEIGHT]` задають розміри TTY. | `true`, якщо термінал у режимі TTY, інакше `false`.\n| `FORCE_COLOR` | | Чи формувати кольоровий вивід. | `true`, якщо термінал у режимі TTY, інакше `false`.",
        },
        {
          en: "### Dot reporter",
          uk: "### Репортер dot",
        },
        {
          en: "Dot reporter is very concise - it only produces a single character per successful test run. It is the default on CI and useful where you don't want a lot of output.",
          uk: "Репортер `dot` дуже стислий — по одному символу на успішний тест. Типовий для CI, коли не потрібен великий вивід.",
        },
        {
          en: "Here is an example output in the middle of a test run. Failures will be listed at the end.",
          uk: "Ось приклад виводу під час прогону. Збої будуть перелічені в кінці.",
        },
        {
          en: "One character is displayed for each test that has run, indicating its status:",
          uk: "Для кожного виконаного тесту показується один символ зі статусом:",
        },
        {
          en: "| Character | Description\n|---|---|\n| `·` | Passed\n| `F` | Failed\n| `×` | Failed or timed out - and will be retried\n| `±` | Passed on retry (flaky)\n| `T` | Timed out\n| `°` | Skipped",
          uk: "| Символ | Опис\n|---|---|\n| `·` | Пройдено\n| `F` | Помилка\n| `×` | Помилка або тайм-аут — буде повтор\n| `±` | Пройдено після повтору (flaky)\n| `T` | Тайм-аут\n| `°` | Пропущено",
        },
        {
          en: "Dot report supports the following configuration options and environment variables:",
          uk: "Звіт dot підтримує такі опції конфігурації та змінні середовища:",
        },
        {
          en: "| Environment Variable Name | Reporter Config Option| Description | Default\n|---|---|---|---|\n| `PLAYWRIGHT_FORCE_TTY` | | Whether to produce output suitable for a live terminal. Supports `true`, `1`, `false`, `0`, `[WIDTH]`, and `[WIDTH]x[HEIGHT]`. `[WIDTH]` and `[WIDTH]x[HEIGHT]` specifies the TTY dimensions. | `true` when terminal is in TTY mode, `false` otherwise.\n| `FORCE_COLOR` | | Whether to produce colored output. | `true` when terminal is in TTY mode, `false` otherwise.",
          uk: "| Назва змінної середовища | Опція конфігурації репортера| Опис | Типово\n|---|---|---|---|\n| `PLAYWRIGHT_FORCE_TTY` | | Чи формувати вивід, придатний для інтерактивного термінала. Підтримує `true`, `1`, `false`, `0`, `[WIDTH]` та `[WIDTH]x[HEIGHT]`. `[WIDTH]` і `[WIDTH]x[HEIGHT]` задають розміри TTY. | `true`, якщо термінал у режимі TTY, інакше `false`.\n| `FORCE_COLOR` | | Чи формувати кольоровий вивід. | `true`, якщо термінал у режимі TTY, інакше `false`.",
        },
        {
          en: "### HTML reporter",
          uk: "### HTML-репортер",
        },
        {
          en: "HTML reporter produces a self-contained folder that contains report for the test run that can be served as a web page.",
          uk: "HTML-репортер створює автономну теку зі звітом про прогін, який можна відкрити як вебсторінку.",
        },
        {
          en: "By default, HTML report is opened automatically if some of the tests failed. You can control this behavior via the\n`open` property in the Playwright config or the `PLAYWRIGHT_HTML_OPEN` environmental variable. The possible values for that property are `always`, `never` and `on-failure`\n(default).",
          uk: "За замовчуванням HTML-звіт відкривається автоматично, якщо є невдалі тести. Поведінку керують властивістю `open` у конфігурації Playwright або змінною середовища `PLAYWRIGHT_HTML_OPEN`. Можливі значення: `always`, `never` та `on-failure`\n(типово).",
        },
        {
          en: "You can also configure `host` and `port` that are used to serve the HTML report.",
          uk: "Також можна задати `host` і `port` для роздачі HTML-звіту.",
        },
        {
          en: "By default, report is written into the `playwright-report` folder in the current working directory. One can override\nthat location using the `PLAYWRIGHT_HTML_OUTPUT_DIR` environment variable or a reporter configuration.",
          uk: "За замовчуванням звіт записується в теку `playwright-report` у поточному робочому каталозі. Розташування можна перевизначити змінною середовища `PLAYWRIGHT_HTML_OUTPUT_DIR` або конфігурацією репортера.",
        },
        {
          en: "In configuration file, pass options directly:",
          uk: "У файлі конфігурації передайте опції безпосередньо:",
        },
        {
          en: "If you are uploading attachments from a data folder to another location, you can use `attachmentsBaseURL` option to let html report know where to look for them.",
          uk: "Якщо вкладення з теки `data` вивантажуються в інше місце, використовуйте опцію `attachmentsBaseURL`, щоб HTML-звіт знав, де їх шукати.",
        },
        {
          en: "A quick way of opening the last test run report is:",
          uk: "Швидко відкрити звіт останнього прогону:",
        },
        {
          en: "Or if there is a custom folder name:",
          uk: "Або якщо використовується власна назва теки:",
        },
        {
          en: "You can also pass a `.zip` archive — for example one downloaded from a CI artifact. The archive must contain `index.html` at its top level. Playwright will extract it to a temporary directory and serve the report:",
          uk: "Також можна передати архів `.zip` — наприклад завантажений з артефакту CI. На верхньому рівні архіву має бути `index.html`. Playwright розпакує його в тимчасову теку й покаже звіт:",
        },
        {
          en: "HTML report supports the following configuration options and environment variables:",
          uk: "HTML-звіт підтримує такі опції конфігурації та змінні середовища:",
        },
        {
          en: "| Environment Variable Name | Reporter Config Option| Description | Default\n|---|---|---|---|\n| `PLAYWRIGHT_HTML_TITLE` | `title` | A title to display in the generated report. | No title is displayed by default\n| `PLAYWRIGHT_HTML_OUTPUT_DIR` | `outputFolder` | Directory to save the report to. | `playwright-report`\n| `PLAYWRIGHT_HTML_OPEN` | `open` | When to open the html report in the browser, one of `'always'`, `'never'` or `'on-failure'` | `'on-failure'`\n| `PLAYWRIGHT_HTML_HOST` | `host` | When report opens in the browser, it will be served bound to this hostname. | `localhost`\n| `PLAYWRIGHT_HTML_PORT` | `port` | When report opens in the browser, it will be served on this port. | `9323` or any available port when `9323` is not available.\n| `PLAYWRIGHT_HTML_ATTACHMENTS_BASE_URL` | `attachmentsBaseURL` | A separate location where attachments from the `data` subdirectory are uploaded. Only needed when you upload report and `data` separately to different locations. | `data/`\n| `PLAYWRIGHT_HTML_NO_COPY_PROMPT` | `noCopyPrompt` | If true, disable rendering of the Copy prompt for errors. Supports `true`, `1`, `false`, and `0`. | `false`\n| `PLAYWRIGHT_HTML_NO_SNIPPETS` | `noSnippets` | If true, disable rendering code snippets in the action log. If there is a top level error, that report section with code snippet will still render. Supports `true`, `1`, `false`, and `0`. | `false`\n| `PLAYWRIGHT_HTML_DO_NOT_INLINE_ASSETS` | `doNotInlineAssets` | If true, JavaScript, CSS and report data are written as separate files alongside `index.html` instead of being embedded inline. Use this when serving the report under a strict [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP) that disallows inline scripts and styles. Supports `true`, `1`, `false`, and `0`. | `false`",
          uk: "| Назва змінної середовища | Опція конфігурації репортера| Опис | Типово\n|---|---|---|---|\n| `PLAYWRIGHT_HTML_TITLE` | `title` | Заголовок у згенерованому звіті. | За замовчуванням заголовок не показується\n| `PLAYWRIGHT_HTML_OUTPUT_DIR` | `outputFolder` | Тека для збереження звіту. | `playwright-report`\n| `PLAYWRIGHT_HTML_OPEN` | `open` | Коли відкривати HTML-звіт у браузері: `'always'`, `'never'` або `'on-failure'` | `'on-failure'`\n| `PLAYWRIGHT_HTML_HOST` | `host` | Ім’я хоста, до якого прив’язується сервер при відкритті звіту. | `localhost`\n| `PLAYWRIGHT_HTML_PORT` | `port` | Порт сервера при відкритті звіту в браузері. | `9323` або вільний порт, якщо `9323` зайнятий.\n| `PLAYWRIGHT_HTML_ATTACHMENTS_BASE_URL` | `attachmentsBaseURL` | Окрема адреса, куди вивантажено вкладення з підтеки `data`. Потрібно лише якщо звіт і `data` вивантажуються окремо в різні місця. | `data/`\n| `PLAYWRIGHT_HTML_NO_COPY_PROMPT` | `noCopyPrompt` | Якщо true, вимкнути підказку Copy для помилок. Підтримує `true`, `1`, `false` та `0`. | `false`\n| `PLAYWRIGHT_HTML_NO_SNIPPETS` | `noSnippets` | Якщо true, вимкнути фрагменти коду в журналі дій. Якщо є помилка верхнього рівня, відповідний блок зі зрізом коду лишається. Підтримує `true`, `1`, `false` та `0`. | `false`\n| `PLAYWRIGHT_HTML_DO_NOT_INLINE_ASSETS` | `doNotInlineAssets` | Якщо true, JavaScript, CSS і дані звіту пишуться окремими файлами поруч із `index.html` замість вбудовування. Використовуйте під суворою [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), що забороняє інлайн-скрипти та стилі. Підтримує `true`, `1`, `false` та `0`. | `false`",
        },
        {
          en: "### Blob reporter",
          uk: "### Blob-репортер",
        },
        {
          en: "Blob reports contain all the details about the test run and can be used later to produce any other report. Their primary function is to facilitate the merging of reports from [sharded tests](./test-sharding.md).",
          uk: "Blob-звіти містять усі деталі прогону й згодом можуть бути перетворені на будь-який інший звіт. Головна роль — зручне [об’єднання звітів з шардів](./test-sharding.md).",
        },
        {
          en: "By default, the report is written into the `blob-report` directory in the package.json directory or current working directory (if no package.json is found).",
          uk: "За замовчуванням звіт записується в каталог `blob-report` поруч із `package.json` або в поточний робочий каталог, якщо `package.json` не знайдено.",
        },
        {
          en: "The report file name looks like `report-.zip` or `report--.zip` when [sharding](./test-sharding.md) is used. The hash is an optional value computed from `--grep`, `--grepInverted`, `--project`, [`property: TestConfig.tag`] and file filters passed as command line arguments. The hash guarantees that running Playwright with different command line options will produce different but stable between runs report names. The output file name can be overridden in the configuration file or passed as `'PLAYWRIGHT_BLOB_OUTPUT_FILE'` environment variable.",
          uk: "Ім’я файлу звіту виглядає як `report-.zip` або `report--.zip` при [шардингу](./test-sharding.md). Хеш (необов’язково) обчислюється з `--grep`, `--grepInverted`, `--project`, [`property: TestConfig.tag`] та фільтрів файлів з командного рядка. Хеш гарантує: різні опції командного рядка дають різні, але стабільні між прогонами імена файлів. Ім’я вихідного файлу можна перевизначити в конфігурації або змінною середовища `'PLAYWRIGHT_BLOB_OUTPUT_FILE'`.",
        },
        {
          en: "Blob report supports following configuration options and environment variables:",
          uk: "Blob-звіт підтримує такі опції конфігурації та змінні середовища:",
        },
        {
          en: "| Environment Variable Name | Reporter Config Option| Description | Default\n|---|---|---|---|\n| `PLAYWRIGHT_BLOB_OUTPUT_DIR` | `outputDir` | Directory to save the output. Existing content is deleted before writing the new report. | `blob-report`\n| `PLAYWRIGHT_BLOB_OUTPUT_NAME` | `fileName` | Report file name. | `report---.zip`\n| `PLAYWRIGHT_BLOB_OUTPUT_FILE` | `outputFile` | Full path to the output file. If defined, `outputDir` and `fileName` will be ignored. | `undefined`",
          uk: "| Назва змінної середовища | Опція конфігурації репортера| Опис | Типово\n|---|---|---|---|\n| `PLAYWRIGHT_BLOB_OUTPUT_DIR` | `outputDir` | Каталог для виводу. Перед записом наявний вміст видаляється. | `blob-report`\n| `PLAYWRIGHT_BLOB_OUTPUT_NAME` | `fileName` | Ім’я файлу звіту. | `report---.zip`\n| `PLAYWRIGHT_BLOB_OUTPUT_FILE` | `outputFile` | Повний шлях до вихідного файлу. Якщо задано, `outputDir` і `fileName` ігноруються. | `undefined`",
        },
        {
          en: "### JSON reporter",
          uk: "### JSON-репортер",
        },
        {
          en: "JSON reporter produces an object with all information about the test run.",
          uk: "JSON-репортер формує об’єкт з повною інформацією про прогін.",
        },
        {
          en: "Most likely you want to write the JSON to a file. When running with `--reporter=json`, use `PLAYWRIGHT_JSON_OUTPUT_NAME` environment variable:",
          uk: "Зазвичай JSON зберігають у файл. При `--reporter=json` використовуйте змінну середовища `PLAYWRIGHT_JSON_OUTPUT_NAME`:",
        },
        {
          en: "In configuration file, pass options directly:",
          uk: "У файлі конфігурації передайте опції безпосередньо:",
        },
        {
          en: "JSON report supports following configuration options and environment variables:",
          uk: "JSON-звіт підтримує такі опції конфігурації та змінні середовища:",
        },
        {
          en: "| Environment Variable Name | Reporter Config Option| Description | Default\n|---|---|---|---|\n| `PLAYWRIGHT_JSON_OUTPUT_DIR` | | Directory to save the output file. Ignored if output file is specified. | `cwd` or config directory.\n| `PLAYWRIGHT_JSON_OUTPUT_NAME` | `outputFile` | Base file name for the output, relative to the output dir. | JSON report is printed to the stdout.\n| `PLAYWRIGHT_JSON_OUTPUT_FILE` | `outputFile` | Full path to the output file. If defined, `PLAYWRIGHT_JSON_OUTPUT_DIR` and `PLAYWRIGHT_JSON_OUTPUT_NAME` will be ignored. | JSON report is printed to the stdout.",
          uk: "| Назва змінної середовища | Опція конфігурації репортера| Опис | Типово\n|---|---|---|---|\n| `PLAYWRIGHT_JSON_OUTPUT_DIR` | | Каталог для вихідного файлу. Ігнорується, якщо задано повний шлях виводу. | `cwd` або каталог конфігурації.\n| `PLAYWRIGHT_JSON_OUTPUT_NAME` | `outputFile` | Базове ім’я файлу відносно каталогу виводу. | JSON виводиться в stdout.\n| `PLAYWRIGHT_JSON_OUTPUT_FILE` | `outputFile` | Повний шлях до вихідного файлу. Якщо задано, `PLAYWRIGHT_JSON_OUTPUT_DIR` і `PLAYWRIGHT_JSON_OUTPUT_NAME` ігноруються. | JSON виводиться в stdout.",
        },
        {
          en: "### JUnit reporter",
          uk: "### JUnit-репортер",
        },
        {
          en: "JUnit reporter produces a JUnit-style xml report.",
          uk: "JUnit-репортер створює XML-звіт у стилі JUnit.",
        },
        {
          en: "Most likely you want to write the report to an xml file. When running with `--reporter=junit`, use `PLAYWRIGHT_JUNIT_OUTPUT_NAME` environment variable:",
          uk: "Зазвичай звіт зберігають у XML-файл. При `--reporter=junit` використовуйте `PLAYWRIGHT_JUNIT_OUTPUT_NAME`:",
        },
        {
          en: "In configuration file, pass options directly:",
          uk: "У файлі конфігурації передайте опції безпосередньо:",
        },
        {
          en: "JUnit report supports following configuration options and environment variables:",
          uk: "JUnit-звіт підтримує такі опції конфігурації та змінні середовища:",
        },
        {
          en: "| Environment Variable Name | Reporter Config Option| Description | Default\n|---|---|---|---|\n| `PLAYWRIGHT_JUNIT_OUTPUT_DIR` | | Directory to save the output file. Ignored if output file is not specified. | `cwd` or config directory.\n| `PLAYWRIGHT_JUNIT_OUTPUT_NAME` | `outputFile` | Base file name for the output, relative to the output dir. | JUnit report is printed to the stdout.\n| `PLAYWRIGHT_JUNIT_OUTPUT_FILE` | `outputFile` | Full path to the output file. If defined, `PLAYWRIGHT_JUNIT_OUTPUT_DIR` and `PLAYWRIGHT_JUNIT_OUTPUT_NAME` will be ignored. | JUnit report is printed to the stdout.\n| `PLAYWRIGHT_JUNIT_STRIP_ANSI` | `stripANSIControlSequences` | Whether to remove ANSI control sequences from the text before writing it in the report. | By default output text is added as is.\n| `PLAYWRIGHT_JUNIT_INCLUDE_PROJECT_IN_TEST_NAME` | `includeProjectInTestName` | Whether to include Playwright project name in every test case as a name prefix. | By default not included.\n| `PLAYWRIGHT_JUNIT_SUITE_ID` |  | Value of the `id` attribute on the root `` report entry. | Empty string.\n| `PLAYWRIGHT_JUNIT_SUITE_NAME` |  | Value of the `name` attribute on the root `` report entry. | Empty string.",
          uk: "| Назва змінної середовища | Опція конфігурації репортера| Опис | Типово\n|---|---|---|---|\n| `PLAYWRIGHT_JUNIT_OUTPUT_DIR` | | Каталог для вихідного файлу. Ігнорується, якщо вихідний файл не вказано. | `cwd` або каталог конфігурації.\n| `PLAYWRIGHT_JUNIT_OUTPUT_NAME` | `outputFile` | Базове ім’я файлу відносно каталогу виводу. | JUnit виводиться в stdout.\n| `PLAYWRIGHT_JUNIT_OUTPUT_FILE` | `outputFile` | Повний шлях до вихідного файлу. Якщо задано, `PLAYWRIGHT_JUNIT_OUTPUT_DIR` і `PLAYWRIGHT_JUNIT_OUTPUT_NAME` ігноруються. | JUnit виводиться в stdout.\n| `PLAYWRIGHT_JUNIT_STRIP_ANSI` | `stripANSIControlSequences` | Чи прибирати ANSI-керуючі послідовності з тексту перед записом у звіт. | За замовчуванням текст додається як є.\n| `PLAYWRIGHT_JUNIT_INCLUDE_PROJECT_IN_TEST_NAME` | `includeProjectInTestName` | Чи додавати ім’я проєкту Playwright як префікс назви кожного тест-кейсу. | За замовчуванням не додається.\n| `PLAYWRIGHT_JUNIT_SUITE_ID` |  | Значення атрибута `id` у кореневому записі звіту ``. | Порожній рядок.\n| `PLAYWRIGHT_JUNIT_SUITE_NAME` |  | Значення атрибута `name` у кореневому записі звіту ``. | Порожній рядок.",
        },
        {
          en: "### GitHub Actions annotations",
          uk: "### Анотації GitHub Actions",
        },
        {
          en: "You can use the built in `github` reporter to get automatic failure annotations when running in GitHub actions.",
          uk: "Вбудований репортер `github` додає автоматичні анотації про збої під час запуску в GitHub Actions.",
        },
        {
          en: "Note that all other reporters work on GitHub Actions as well, but do not provide annotations. Also, it is not recommended to\nuse this annotation type if running your tests with a matrix strategy as the stack trace failures will multiply and obscure the\nGitHub file view.",
          uk: "Інші репортери в GitHub Actions теж працюють, але без анотацій. Не варто використовувати цей тип анотацій з матричною стратегією: стеки помножаться й ускладнять перегляд файлів у GitHub.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "bash",
          code: "npx playwright test --reporter=list",
        },
        {
          id: "cb-6",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: 'list',\n});",
        },
        {
          id: "cb-7",
          language: "bash",
          code: "npx playwright test --reporter=list\nRunning 124 tests using 6 workers\n\n 1  ✓ should access error in env (438ms)\n 2  ✓ handle long test names (515ms)\n 3  x 1) render expected (691ms)\n 4  ✓ should timeout (932ms)\n 5    should repeat each:\n 6  ✓ should respect enclosing .gitignore (569ms)\n 7    should teardown env after timeout:\n 8    should respect excluded tests:\n 9  ✓ should handle env beforeEach error (638ms)\n10    should respect enclosing .gitignore:",
        },
        {
          id: "cb-8",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: [['list', { printSteps: true }]],\n});",
        },
        {
          id: "cb-9",
          language: "bash",
          code: "npx playwright test --reporter=line",
        },
        {
          id: "cb-10",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: 'line',\n});",
        },
        {
          id: "cb-11",
          language: "bash",
          code: "npx playwright test --reporter=line\nRunning 124 tests using 6 workers\n  1) dot-reporter.spec.ts:20:1 › render expected ===================================================\n\n    Error: expect(received).toBe(expected) // Object.is equality\n\n    Expected: 1\n    Received: 0\n\n[23/124] gitignore.spec.ts - should respect nested .gitignore",
        },
        {
          id: "cb-12",
          language: "bash",
          code: "npx playwright test --reporter=dot",
        },
        {
          id: "cb-13",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: 'dot',\n});",
        },
        {
          id: "cb-14",
          language: "bash",
          code: "npx playwright test --reporter=dot\nRunning 124 tests using 6 workers\n······F·············································",
        },
        {
          id: "cb-15",
          language: "bash",
          code: "npx playwright test --reporter=html",
        },
        {
          id: "cb-16",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: [['html', { open: 'never' }]],\n});",
        },
        {
          id: "cb-17",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: [['html', { outputFolder: 'my-report' }]],\n});",
        },
        {
          id: "cb-18",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: [['html', { attachmentsBaseURL: 'https://external-storage.com/' }]],\n});",
        },
        {
          id: "cb-19",
          language: "bash",
          code: "npx playwright show-report",
        },
        {
          id: "cb-20",
          language: "bash",
          code: "npx playwright show-report my-report",
        },
        {
          id: "cb-21",
          language: "bash",
          code: "npx playwright show-report playwright-report.zip",
        },
        {
          id: "cb-22",
          language: "bash",
          code: "npx playwright test --reporter=blob",
        },
        {
          id: "cb-23",
          language: "bash",
          code: "PLAYWRIGHT_JSON_OUTPUT_NAME=results.json npx playwright test --reporter=json",
        },
        {
          id: "cb-24",
          language: "batch",
          code: "set PLAYWRIGHT_JSON_OUTPUT_NAME=results.json\nnpx playwright test --reporter=json",
        },
        {
          id: "cb-25",
          language: "powershell",
          code: '$env:PLAYWRIGHT_JSON_OUTPUT_NAME="results.json"\nnpx playwright test --reporter=json',
        },
        {
          id: "cb-26",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: [['json', { outputFile: 'results.json' }]],\n});",
        },
        {
          id: "cb-27",
          language: "bash",
          code: "PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml npx playwright test --reporter=junit",
        },
        {
          id: "cb-28",
          language: "batch",
          code: "set PLAYWRIGHT_JUNIT_OUTPUT_NAME=results.xml\nnpx playwright test --reporter=junit",
        },
        {
          id: "cb-29",
          language: "powershell",
          code: '$env:PLAYWRIGHT_JUNIT_OUTPUT_NAME="results.xml"\nnpx playwright test --reporter=junit',
        },
        {
          id: "cb-30",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: [['junit', { outputFile: 'results.xml' }]],\n});",
        },
        {
          id: "cb-31",
          language: "js",
          code: "\nexport default defineConfig({\n  // 'github' for GitHub Actions CI to generate annotations, plus a concise 'dot'\n  // default 'list' when running locally\n  reporter: process.env.CI ? 'github' : 'list',\n});",
        },
      ],
    },
    {
      id: "custom-reporters",
      title: {
        en: "Custom reporters",
        uk: "Користувацькі репортери",
      },
      paragraphs: [
        {
          en: "You can create a custom reporter by implementing a class with some of the reporter methods. Learn more about the [Reporter] API.",
          uk: "Користувацький репортер можна створити, реалізувавши клас із частиною методів репортера. Докладніше — API [Reporter].",
        },
        {
          en: "Now use this reporter with [`property: TestConfig.reporter`].",
          uk: "Підключіть репортер через [`property: TestConfig.reporter`].",
        },
        {
          en: "Or just pass the reporter file path as `--reporter` command line option:",
          uk: "Або передайте шлях до файлу репортера як опцію `--reporter` у командному рядку:",
        },
        {
          en: "Here's a short list of open source reporter implementations that you can take a look at when writing your own reporter:",
          uk: "Короткий список відкритих реалізацій репортерів, на які варто зазирнути під час написання власного:",
        },
        {
          en: "* [Allure Reporter](https://github.com/allure-framework/allure-js/tree/main/packages/allure-playwright)\n* [Github Actions Reporter](https://github.com/estruyf/playwright-github-actions-reporter)\n* [Mail Reporter](https://github.com/estruyf/playwright-mail-reporter)\n* [ReportPortal](https://github.com/reportportal/agent-js-playwright)\n* [Monocart](https://github.com/cenfun/monocart-reporter)",
          uk: "* [Allure Reporter](https://github.com/allure-framework/allure-js/tree/main/packages/allure-playwright)\n* [Github Actions Reporter](https://github.com/estruyf/playwright-github-actions-reporter)\n* [Mail Reporter](https://github.com/estruyf/playwright-mail-reporter)\n* [ReportPortal](https://github.com/reportportal/agent-js-playwright)\n* [Monocart](https://github.com/cenfun/monocart-reporter)",
        },
      ],
      codeBlocks: [
        {
          id: "cb-32",
          language: "js",
          code: "\n  FullConfig, FullResult, Reporter, Suite, TestCase, TestResult\n} from '@playwright/test/reporter';\n\nclass MyReporter implements Reporter {\n  onBegin(config: FullConfig, suite: Suite) {\n    console.log(`Starting the run with ${suite.allTests().length} tests`);\n  }\n\n  onTestBegin(test: TestCase, result: TestResult) {\n    console.log(`Starting test ${test.title}`);\n  }\n\n  onTestEnd(test: TestCase, result: TestResult) {\n    console.log(`Finished test ${test.title}: ${result.status}`);\n  }\n\n  onEnd(result: FullResult) {\n    console.log(`Finished the run: ${result.status}`);\n  }\n}\n\nexport default MyReporter;",
        },
        {
          id: "cb-33",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: './my-awesome-reporter.ts',\n});",
        },
        {
          id: "cb-34",
          language: "bash",
          code: 'npx playwright test --reporter="./myreporter/my-awesome-reporter.ts"',
        },
      ],
    },
  ],
  quiz: [],
}
