import type { PlaywrightTopic } from "../../types"

export const traceViewerTopic: PlaywrightTopic = {
  slug: "trace-viewer",
  groupId: "guides",
  order: 415,
  level: "advanced",
  trackOrder: 3,
  sourceDoc: "trace-viewer.md",
  officialDocsUrl: "https://playwright.dev/docs/trace-viewer",
  title: {
    en: "Trace viewer",
    uk: "Переглядач трас",
  },
  summary: {
    en: "Playwright Trace Viewer is a GUI tool that helps you explore recorded Playwright traces after the script has run. Traces are a great way for debugging your tests when they fail on CI. You can open traces [locally](#opening-trace-viewer) or in your browser on [trace.playwright.dev](https://trace.playwright.dev).",
    uk: "Playwright Trace Viewer — це GUI-інструмент, який допомагає досліджувати записані траси Playwright після виконання сценарію. Траси зручні для налагодження тестів, коли вони падають на CI. Відкрити траси можна [локально](#opening-trace-viewer) або в браузері на [trace.playwright.dev](https://trace.playwright.dev).",
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
          en: "Playwright Trace Viewer is a GUI tool that helps you explore recorded Playwright traces after the script has run. Traces are a great way for debugging your tests when they fail on CI. You can open traces [locally](#opening-trace-viewer) or in your browser on [trace.playwright.dev](https://trace.playwright.dev).",
          uk: "Playwright Trace Viewer — це GUI-інструмент, який допомагає досліджувати записані траси Playwright після виконання сценарію. Траси зручні для налагодження тестів, коли вони падають на CI. Відкрити траси можна [локально](#opening-trace-viewer) або в браузері на [trace.playwright.dev](https://trace.playwright.dev).",
        },
      ],
    },
    {
      id: "opening-trace-viewer",
      title: {
        en: "Opening Trace Viewer",
        uk: "Відкриття Trace Viewer",
      },
      paragraphs: [
        {
          en: "You can open a saved trace using either the Playwright CLI or in the browser at [trace.playwright.dev](https://trace.playwright.dev). Make sure to add the full path to where your `trace.zip` file is located.",
          uk: "Збережену трасу можна відкрити через Playwright CLI або в браузері на [trace.playwright.dev](https://trace.playwright.dev). Вкажіть повний шлях до файлу `trace.zip`.",
        },
        {
          en: "### Using [trace.playwright.dev](https://trace.playwright.dev)",
          uk: "### Використання [trace.playwright.dev](https://trace.playwright.dev)",
        },
        {
          en: "[trace.playwright.dev](https://trace.playwright.dev) is a statically hosted variant of the Trace Viewer. You can upload a trace file using drag and drop or via the `Select file` button.",
          uk: "[trace.playwright.dev](https://trace.playwright.dev) — це статично зібраний варіант Trace Viewer. Файл траси можна завантажити перетягуванням або кнопкою `Select file`.",
        },
        {
          en: "Trace Viewer loads the trace entirely in your browser and does not transmit any data externally.",
          uk: "Trace Viewer повністю завантажує трасу в вашому браузері і не передає дані назовні.",
        },
        {
          en: "### Viewing remote traces",
          uk: "### Перегляд віддалених трас",
        },
        {
          en: "You can open remote traces directly using its URL. This makes it easy to view the remote trace without having to manually download the file from CI runs, for example.",
          uk: "Віддалені траси можна відкрити безпосередньо за URL — зручно переглядати трасу без ручного завантаження файлу з CI тощо.",
        },
        {
          en: "When using [trace.playwright.dev](https://trace.playwright.dev), you can also pass the URL of your uploaded trace at some accessible storage (e.g. inside your CI) as a query parameter. CORS (Cross-Origin Resource Sharing) rules might apply.",
          uk: "На [trace.playwright.dev](https://trace.playwright.dev) можна також передати URL завантаженої траси з доступного сховища (наприклад у CI) як параметр запиту. Можуть діяти правила CORS (Cross-Origin Resource Sharing).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright show-trace path/to/trace.zip",
        },
        {
          id: "cb-5",
          language: "bash",
          code: "npx playwright show-trace https://example.com/trace.zip",
        },
        {
          id: "cb-9",
          language: "txt",
          code: "https://trace.playwright.dev/?trace=https://demo.playwright.dev/reports/todomvc/data/e6099cadf79aa753d5500aa9508f9d1dbd87b5ee.zip",
        },
      ],
    },
    {
      id: "recording-a-trace",
      title: {
        en: "Recording a trace",
        uk: "Запис траси",
      },
      paragraphs: [
        {
          en: "### Tracing locally",
          uk: "### Локальний трасинг",
        },
        {
          en: "To record a trace during development mode set the `--trace` flag to `on` when running your tests. You can also use [UI Mode](./test-ui-mode.md) for a better developer experience, as it traces each test automatically.",
          uk: "Щоб записувати трасу під час розробки, запускайте тести з прапорцем `--trace` у значенні `on`. Також можна скористатися [UI Mode](./test-ui-mode.md) для зручнішого досвіду — там кожен тест трасується автоматично.",
        },
        {
          en: "You can then open the HTML report and click on the trace icon to open the trace.",
          uk: "Потім відкрийте HTML-звіт і натисніть іконку траси, щоб відкрити її.",
        },
        {
          en: "### Tracing on CI",
          uk: "### Трасинг на CI",
        },
        {
          en: "Traces should be run on continuous integration on the first retry of a failed test\nby setting the `trace: 'on-first-retry'` option in the test configuration file. This will produce a `trace.zip` file for each test that was retried.",
          uk: "У середовищі CI траси варто вмикати на першому повторному запуску невдалого тесту — для цього у файлі конфігурації встановіть `trace: 'on-first-retry'`. Для кожного такого повтору з’явиться файл `trace.zip`.",
        },
        {
          en: "Available options to record a trace:\n- `'on-first-retry'` - Record a trace only when retrying a test for the first time.\n- `'on-all-retries'` - Record traces for all test retries.\n- `'off'` - Do not record a trace.\n- `'on'` - Record a trace for each test. (not recommended as it's performance heavy)\n- `'retain-on-failure'` - Record a trace for each test, but remove it from successful test runs.",
          uk: "Доступні варіанти запису траси:\n- `'on-first-retry'` — записувати трасу лише під час першого повтору тесту.\n- `'on-all-retries'` — записувати траси для усіх повторів.\n- `'off'` — не записувати трасу.\n- `'on'` — записувати трасу для кожного тесту (не рекомендується через навантаження).\n- `'retain-on-failure'` — записувати трасу для кожного тесту, але видаляти після успішних прогонів.",
        },
        {
          en: "You can also use `trace: 'retain-on-failure'` if you do not enable retries but still want traces for failed tests.",
          uk: "Також можна використати `trace: 'retain-on-failure'`, якщо повтори вимкнені, але потрібні траси для невдалих тестів.",
        },
        {
          en: "There are more granular options available, see [`property: TestOptions.trace`].",
          uk: "Є детальніші опції — див. [`property: TestOptions.trace`].",
        },
        {
          en: "If you are not using Playwright as a Test Runner, use the [`property: BrowserContext.tracing`] API instead.",
          uk: "Якщо Playwright Test не використовується як раннер, застосовуйте API [`property: BrowserContext.tracing`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-10",
          language: "bash",
          code: "npx playwright test --trace on",
        },
        {
          id: "cb-11",
          language: "bash",
          code: "npx playwright show-report",
        },
        {
          id: "cb-12",
          language: "js",
          code: "\nexport default defineConfig({\n  retries: 1,\n  use: {\n    trace: 'on-first-retry',\n  },\n});",
        },
        {
          id: "cb-13",
          language: "js",
          code: "const browser = await chromium.launch();\nconst context = await browser.newContext();\n\n// Start tracing before creating / navigating a page.\nawait context.tracing.start({ screenshots: true, snapshots: true });\n\nconst page = await context.newPage();\nawait page.goto('https://playwright.dev');\n\n// Stop tracing and export it into a zip archive.\nawait context.tracing.stop({ path: 'trace.zip' });",
        },
      ],
    },
    {
      id: "run-trace-only-on-failure",
      title: {
        en: "Run trace only on failure",
        uk: "Трасу лише при збої",
      },
      paragraphs: [
        {
          en: "Prefer `trace: 'on-first-retry'` or `trace: 'retain-on-failure'` in `playwright.config.ts` so CI keeps traces for failing tests without recording every passing run.",
          uk: "У `playwright.config.ts` використовуйте `trace: 'on-first-retry'` або `trace: 'retain-on-failure'`, щоб на CI зберігати траси для невдалих тестів без запису кожного успішного прогону.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-trace-fail",
          language: "js",
          code: "export default defineConfig({\n  use: {\n    trace: 'retain-on-failure',\n  },\n});",
        },
      ],
    },
    {
      id: "trace-viewer-features",
      title: {
        en: "Trace Viewer features",
        uk: "Можливості Trace Viewer",
      },
      paragraphs: [
        {
          en: "### Actions",
          uk: "### Дії (Actions)",
        },
        {
          en: "In the Actions tab you can see what locator was used for every action and how long each one took to run. Hover over each action of your test and visually see the change in the DOM snapshot. Go back and forward in time and click an action to inspect and debug. Use the Before and After tabs to visually see what happened before and after the action.",
          uk: "На вкладці Actions видно, який локатор використано для кожної дії та скільки вона тривала. Наведіть курсор на дію тесту й перегляньте зміну в DOM-знімку. Переміщайтеся в часі та клацайте дію для аналізу й налагодження. Вкладки Before і After показують стан до й після дії.",
        },
        {
          en: "**Selecting each action reveals:**\n- Action snapshots\n- Action log\n- Source code location",
          uk: "**Після вибору дії відображається:**\n- знімки дії (snapshots)\n- журнал дії\n- місце у вихідному коді",
        },
        {
          en: "### Screenshots",
          uk: "### Знімки екрана (Screenshots)",
        },
        {
          en: "When tracing with the [`option: Tracing.start.screenshots`] option turned on (default), each trace records a screencast and renders it as a film strip. You can hover over the film strip to see a magnified image of for each action and state which helps you easily find the action you want to inspect.",
          uk: "Якщо під час трасингу ввімкнено [`option: Tracing.start.screenshots`] (за замовчуванням так), у трасі зберігається скрінкаст і показується як плівка кадрів. Наведіть курсор на плівку, щоб збільшити кадр для кожної дії та стану — так легше знайти потрібну дію.",
        },
        {
          en: "Double click on an action to see the time range for that action. You can use the slider in the timeline to increase the actions selected and these will be shown in the Actions tab and all console logs and network logs will be filtered to only show the logs for the actions selected.",
          uk: "Подвійний клік по дії показує часовий діапазон цієї дії. Повзунок на шкалі часу розширює вибір дій — на вкладці Actions з’являться відповідні дії, а журнали консолі та мережі відфільтруються лише для вибраних дій.",
        },
        {
          en: "### Snapshots",
          uk: "### Знімки DOM (Snapshots)",
        },
        {
          en: "When tracing with the [`option: Tracing.start.snapshots`] option turned on (default), Playwright captures a set of complete DOM snapshots for each action. Depending on the type of the action, it will capture:",
          uk: "Якщо ввімкнено [`option: Tracing.start.snapshots`] (за замовчуванням), Playwright зберігає повні DOM-знімки для кожної дії. Залежно від типу дії фіксується:",
        },
        {
          en: "| Type | Description |\n|------|-------------|\n|Before|A snapshot at the time action is called.|\n|Action|A snapshot at the moment of the performed input. This type of snapshot is especially useful when exploring where exactly Playwright clicked.|\n|After|A snapshot after the action.|",
          uk: "| Тип | Опис |\n|------|------|\n|Before|Знімок на момент виклику дії.|\n|Action|Знімок у момент введення (кліку тощо). Особливо корисно, щоб побачити, куди саме клікнув Playwright.|\n|After|Знімок після виконання дії.|",
        },
        {
          en: "Here is what the typical Action snapshot looks like:",
          uk: "Типовий вигляд знімка типу Action:",
        },
        {
          en: "Notice how it highlights both, the DOM Node as well as the exact click position.",
          uk: "Підсвічуються і вузол DOM, і точна позиція кліку.",
        },
        {
          en: "### Source",
          uk: "### Вихідний код (Source)",
        },
        {
          en: "When you click on an action in the sidebar, the line of code for that action is highlighted in the source panel.",
          uk: "Коли ви обираєте дію на бічній панелі, відповідний рядок коду підсвічується на вкладці Source.",
        },
        {
          en: "### Call",
          uk: "### Виклик (Call)",
        },
        {
          en: "The call tab shows you information about the action such as the time it took, what locator was used, if in strict mode and what key was used.",
          uk: "Вкладка Call показує тривалість дії, використаний локатор, чи ввімкнено strict mode і яку клавішу було використано.",
        },
        {
          en: "### Log",
          uk: "### Журнал (Log)",
        },
        {
          en: "See a full log of your test to better understand what Playwright is doing behind the scenes such as scrolling into view, waiting for element to be visible, enabled and stable and performing actions such as click, fill, press etc.",
          uk: "Повний журнал тесту допомагає зрозуміти, що Playwright робить «за лаштунками»: прокрутку до видимості, очікування видимості, увімкненості й стабільності елемента, виконання click, fill, press тощо.",
        },
        {
          en: "### Errors",
          uk: "### Помилки (Errors)",
        },
        {
          en: "If your test fails you will see the error messages for each test in the Errors tab. The timeline will also show a red line highlighting where the error occurred. You can also click on the source tab to see on which line of the source code the error is.",
          uk: "Якщо тест упав, повідомлення про помилку з’являться на вкладці Errors; на шкалі часу буде червона позначка. На вкладці Source видно рядок коду з помилкою.",
        },
        {
          en: "### Console",
          uk: "### Консоль (Console)",
        },
        {
          en: "See console logs from the browser as well as from your test. Different icons are displayed to show you if the console log came from the browser or from the test file.",
          uk: "Показуються записи консолі з браузера й з тесту; різні піктограми відрізняють повідомлення браузера від повідомлень тестового файлу.",
        },
        {
          en: "Double click on an action from your test in the actions sidebar. This will filter the console to only show the logs that were made during that action. Click the *Show all* button to see all console logs again.",
          uk: "Подвійний клік по дії на бічній панелі відфільтрує консоль лише записами цієї дії. Кнопка *Show all* знову показує всі записи.",
        },
        {
          en: "Use the timeline to filter actions, by clicking a start point and dragging to an ending point. The console tab will also be filtered to only show the logs that were made during the actions selected.",
          uk: "На шкалі часу виділіть діапазон клацанням і перетягуванням — вкладка Console покаже лише записи за вибрані дії.",
        },
        {
          en: "### Network",
          uk: "### Мережа (Network)",
        },
        {
          en: "The Network tab shows you all the network requests that were made during your test. You can sort by different types of requests, status code, method, request, content type, duration and size. Click on a request to see more information about it such as the request headers, response headers, request body and response body.",
          uk: "Вкладка Network містить усі мережеві запити під час тесту. Можна сортувати за типом, кодом стану, методом, URL, типом вмісту, тривалістю та розміром. Клік по запиту відкриває заголовки запиту й відповіді, тіло запиту та відповіді.",
        },
        {
          en: "Double click on an action from your test in the actions sidebar. This will filter the network requests to only show the requests that were made during that action. Click the *Show all* button to see all network requests again.",
          uk: "Подвійний клік по дії на бічній панелі залишить лише запити, зроблені під час цієї дії. *Show all* повертає повний список.",
        },
        {
          en: "Use the timeline to filter actions, by clicking a start point and dragging to an ending point. The network tab will also be filtered to only show the network requests that were made during the actions selected.",
          uk: "Виділення інтервалу на шкалі часу відфільтрує й вкладку Network за вибраними діями.",
        },
        {
          en: "### Metadata",
          uk: "### Метадані (Metadata)",
        },
        {
          en: "Next to the Actions tab you will find the Metadata tab which will show you more information on your test such as the Browser, viewport size, test duration and more.",
          uk: "Поруч із вкладкою Actions — вкладка Metadata: браузер, розмір в’юпорту, тривалість тесту та інші дані.",
        },
        {
          en: "### Attachments",
          uk: "### Вкладення (Attachments)",
        },
        {
          en: "The \"Attachments\" tab allows you to explore attachments. If you're doing [visual regression testing](./test-snapshots.md), you'll be able to compare screenshots by examining the image diff, the actual image and the expected image. When you click on the expected image you can use the slider to slide one image over the other so you can easily see the differences in your screenshots.",
          uk: "На вкладці «Attachments» переглядають вкладення. Для [візуального регресійного тестування](./test-snapshots.md) можна порівняти знімки: diff, фактичний і очікуваний. На очікуваному знімку повзунок накладає зображення одне на одне, щоб побачити відмінності.",
        },
      ],
    },
  ],
  quiz: [],
}
