import type { PlaywrightTopic } from "../../types"

export const traceViewerIntroTopic: PlaywrightTopic = {
  slug: "trace-viewer-intro",
  groupId: "guides",
  order: 420,
  level: "beginner",
  trackOrder: 16,
  sourceDoc: "trace-viewer-intro-js.md",
  officialDocsUrl: "https://playwright.dev/docs/trace-viewer-intro",
  title: {
    en: "Trace viewer",
    uk: "Переглядач трас",
  },
  summary: {
    en: "Before I discovered traces, I was manually adding page.screenshot() calls everywhere to debug failures. Now I just open the trace — it records every action, network request, console error, and a DOM snapshot you can interact with. Time travel through your test.",
    uk: "До того як я відкрив для себе traces, я вручну додавав page.screenshot() скрізь щоб дебажити падіння. Тепер просто відкриваю trace — він записує кожну дію, мережевий запит, помилку консолі і DOM-знімок з яким можна взаємодіяти. Подорож у часі крізь твій тест.",
  },
  sections: [
    {
      id: "enable-tracing",
      title: {
        en: "Enable tracing in config",
        uk: "Увімкнути трасування у конфігурації",
      },
      paragraphs: [
        {
          en: "Add `trace: 'on-first-retry'` to the `use` section of your config. This records a trace only when a test fails and is retried — so you get the trace exactly when you need it, and don't waste disk space on passing tests.",
          uk: "Додай `trace: 'on-first-retry'` до секції `use` у конфігурації. Це записує trace тільки коли тест падає і перезапускається — отримуєш trace саме тоді коли він потрібен, без марного використання місця на диску для тестів що проходять.",
        },
        {
          en: "To force a trace locally for debugging, run with `--trace on`.",
          uk: "Щоб примусово отримати trace локально при дебагу — запусти з `--trace on`.",
        },
      ],
      codeBlocks: [
        {
          id: "trace-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,

  use: {
    // 'off'            — не записувати (за замовчуванням)
    // 'on'             — записувати завжди
    // 'on-first-retry' — тільки при першому повторі падаючого тесту (рекомендовано)
    // 'retain-on-failure' — зберегти якщо впав (навіть без retry)
    trace: 'on-first-retry',
  },
})`,
        },
        {
          id: "trace-force",
          language: "bash",
          code: `# Записати trace для всіх тестів (дебаг конкретного випадку)
npx playwright test --trace on

# Записати trace тільки для одного файлу
npx playwright test orders.spec.ts --trace on`,
        },
      ],
    },
    {
      id: "open-trace",
      title: {
        en: "Open the trace — two ways",
        uk: "Відкрити trace — два способи",
      },
      paragraphs: [
        {
          en: "After a run with traces, Playwright creates a `trace.zip` file in `test-results/`. Two ways to open it.",
          uk: "Після запуску з трасуванням Playwright створює файл `trace.zip` у `test-results/`. Є два способи відкрити його.",
        },
      ],
      codeBlocks: [
        {
          id: "open-report",
          language: "bash",
          code: `# Спосіб 1: HTML репорт — натисни на іконку trace поруч з тестом
npx playwright show-report

# Спосіб 2: Відкрити .zip напряму
npx playwright show-trace test-results/orders-test/trace.zip

# Або через https://trace.playwright.dev/ — перетягни .zip у браузер`,
        },
      ],
    },
    {
      id: "what-you-see",
      title: {
        en: "What's inside the trace",
        uk: "Що всередині trace",
      },
      paragraphs: [
        {
          en: "The trace viewer has several panels. The key ones I use for debugging:",
          uk: "Переглядач трас має кілька панелей. Ключові які я використовую для дебагу:",
        },
      ],
      codeBlocks: [
        {
          id: "trace-panels",
          language: "text",
          code: `Timeline (верх)
  — скролиш горизонтально; кожен скріншот = момент після дії
  — бачиш де тест завис або де щось пішло не так

Actions (ліво)
  — список всіх кроків: goto, click, fill, expect
  — падаюча перевірка підсвічена червоним
  — натисни будь-яку дію — побачиш сторінку в той момент

DOM Snapshot (центр)
  — інтерактивний знімок — можна клікати, наводити курсор
  — пікер елементів — клікни на елемент, побачиш його локатор

Network (права вкладка)
  — всі HTTP запити з timing, статусами, payload
  — одразу видно якщо API повернуло 500 або не відповів

Console (права вкладка)
  — console.log, console.error з контекстом кожного кроку
  — JavaScript помилки видні тут`,
        },
      ],
    },
    {
      id: "debugging-workflow",
      title: {
        en: "My debugging workflow with traces",
        uk: "Мій workflow дебагу з traces",
      },
      paragraphs: [
        {
          en: "When a test fails in CI and I can't reproduce it locally, the trace is the only window into what actually happened. Here's how I read it:",
          uk: "Коли тест падає у CI і я не можу відтворити це локально — trace є єдиним вікном у те що реально відбулося. Ось як я його читаю:",
        },
      ],
      codeBlocks: [
        {
          id: "debugging-steps",
          language: "text",
          code: `1. Відкриваю HTML-репорт → натискаю trace-іконку поруч з падаючим тестом

2. Дивлюся на Actions — знаходжу рядок підсвічений червоним
   (зазвичай expect() яка не виконалася або click() який завис)

3. Натискаю на дію ПЕРЕД падінням — дивлюся DOM Snapshot
   Питання: "Що сторінка показувала прямо перед тим?"

4. Вкладка Network — чи прийшов API-запит? Який статус?
   Якщо 401 — проблема з авторизацією; якщо 500 — проблема сервера

5. Вкладка Console — JS-помилки які не видно у тесті

6. Якщо все виглядає правильно — перевіряю Timeline
   Чи не було race condition? Чи не завантажилась сторінка занадто повільно?`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "What does trace: 'on-first-retry' do?",
        uk: "Що робить trace: 'on-first-retry'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Records a trace for every test run, both passing and failing",
            uk: "Записує trace для кожного запуску тесту, і успішних і невдалих",
          },
        },
        {
          id: "b",
          label: {
            en: "Records a trace only when a failed test is retried for the first time",
            uk: "Записує trace тільки коли невдалий тест перезапускається вперше",
          },
        },
        {
          id: "c",
          label: {
            en: "Records a trace only for the first test in each spec file",
            uk: "Записує trace тільки для першого тесту в кожному spec-файлі",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`on-first-retry` means: if a test fails and there are retries configured, record the trace during the first retry attempt. This is the recommended setting — you get a trace when debugging is needed (failure), but not for every passing test (would waste disk space and slow things down).",
        uk: "`on-first-retry` означає: якщо тест впав і є налаштовані повтори — записати trace під час першої спроби повтору. Це рекомендоване налаштування — отримуєш trace коли потрібен дебаг (падіння), але не для кожного тесту що проходить (це витрачало б місце на диску і сповільнювало б запуски).",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is the difference between trace: 'on-first-retry' and trace: 'retain-on-failure'?",
        uk: "В чому різниця між trace: 'on-first-retry' і trace: 'retain-on-failure'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are the same — both save the trace only when the test fails",
            uk: "Вони однакові — обидва зберігають trace тільки коли тест падає",
          },
        },
        {
          id: "b",
          label: {
            en: "'on-first-retry' records a trace only during the first retry of a failed test; 'retain-on-failure' records a trace for every run but deletes it if the test passes",
            uk: "'on-first-retry' записує trace тільки під час першого повтору невдалого тесту; 'retain-on-failure' записує trace для кожного запуску але видаляє його якщо тест проходить",
          },
        },
        {
          id: "c",
          label: {
            en: "'retain-on-failure' only works on CI, while 'on-first-retry' works locally too",
            uk: "'retain-on-failure' працює тільки на CI, тоді як 'on-first-retry' працює і локально",
          },
        },
        {
          id: "d",
          label: {
            en: "'on-first-retry' captures network requests; 'retain-on-failure' only captures DOM snapshots",
            uk: "'on-first-retry' захоплює мережеві запити; 'retain-on-failure' захоплює тільки DOM-знімки",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Both modes result in having a trace only for failing tests, but the mechanism differs. 'on-first-retry' requires retries to be configured — no retry means no trace. 'retain-on-failure' always records but throws the trace away if the test ultimately passes, so it works even with retries: 0. Use 'retain-on-failure' when you want traces for tests that fail on the first attempt without retries.",
        uk: "Обидва режими призводять до наявності trace тільки для невдалих тестів, але механізм відрізняється. 'on-first-retry' вимагає налаштованих повторів — без повторів немає trace. 'retain-on-failure' завжди записує але викидає trace якщо тест врешті проходить, тому він працює навіть з retries: 0. Використовуй 'retain-on-failure' коли хочеш traces для тестів що падають при першій спробі без повторів.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Where does Playwright save the trace.zip file after a test run?",
        uk: "Де Playwright зберігає файл trace.zip після запуску тесту?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "In the project root as trace.zip",
            uk: "В кореневій директорії проєкту як trace.zip",
          },
        },
        {
          id: "b",
          label: {
            en: "In the test-results/ directory, in a sub-folder named after the test",
            uk: "В директорії test-results/, у підпапці названій після тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "Inside node_modules/.playwright/traces/",
            uk: "Всередині node_modules/.playwright/traces/",
          },
        },
        {
          id: "d",
          label: {
            en: "Alongside the spec file in the same directory",
            uk: "Поряд зі spec-файлом в тій самій директорії",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright writes test artifacts (traces, screenshots, videos) into test-results/, with each test getting its own sub-directory named after the spec file and test title. The trace file is located at test-results/<spec>-<test-title>/trace.zip. You can open it with npx playwright show-trace path/to/trace.zip.",
        uk: "Playwright записує артефакти тестів (traces, screenshots, відео) в test-results/, де кожен тест отримує власну піддиректорію названу після spec-файлу і назви тесту. Файл trace знаходиться за адресою test-results/<spec>-<назва-тесту>/trace.zip. Його можна відкрити через npx playwright show-trace path/to/trace.zip.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You open a trace and want to see what the page looked like just before a failing expect() assertion. What do you click in Trace Viewer?",
        uk: "Ти відкриваєш trace і хочеш побачити як виглядала сторінка безпосередньо перед невдалим expect() assertion. На що клікати в Trace Viewer?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The Console tab to read the error message",
            uk: "Вкладку Console щоб прочитати повідомлення помилки",
          },
        },
        {
          id: "b",
          label: {
            en: "The action immediately before the highlighted failing step in the Actions list, then inspect the DOM Snapshot",
            uk: "Дію безпосередньо перед підсвіченим невдалим кроком у списку Actions, потім перевірити DOM Snapshot",
          },
        },
        {
          id: "c",
          label: {
            en: "The Network tab to check what API requests were made",
            uk: "Вкладку Network щоб перевірити які API-запити були зроблені",
          },
        },
        {
          id: "d",
          label: {
            en: "The failing step itself — it shows the DOM state at that exact point",
            uk: "Сам невдалий крок — він показує стан DOM в той точний момент",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The Actions panel highlights the failing step in red. Clicking the action immediately before it shows the DOM Snapshot of the page at that moment — this tells you what state the UI was in right before the failure. Clicking the failing step itself often shows the state during or after the failure, which can be less informative for understanding why the condition wasn't met.",
        uk: "Панель Actions підсвічує невдалий крок червоним. Клік на дії безпосередньо перед ним показує DOM Snapshot сторінки в той момент — це говорить тобі в якому стані був UI безпосередньо перед падінням. Клік на самому невдалому кроці часто показує стан під час або після падіння, що може бути менш інформативним для розуміння чому умова не була виконана.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you open a trace file without using the terminal?",
        uk: "Як відкрити файл trace без використання терміналу?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Double-click the trace.zip file in the file explorer",
            uk: "Двічі клікнути на файл trace.zip в провіднику файлів",
          },
        },
        {
          id: "b",
          label: {
            en: "Drag and drop the trace.zip file onto https://trace.playwright.dev/ in a browser",
            uk: "Перетягнути файл trace.zip на https://trace.playwright.dev/ у браузері",
          },
        },
        {
          id: "c",
          label: {
            en: "Open it from within Playwright Inspector using File > Open Trace",
            uk: "Відкрити з Playwright Inspector через File > Open Trace",
          },
        },
        {
          id: "d",
          label: {
            en: "Run npx playwright open trace.zip",
            uk: "Запустити npx playwright open trace.zip",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "https://trace.playwright.dev/ is Playwright's public web-based trace viewer. You can drag and drop a trace.zip file onto the page and explore it entirely in the browser — no terminal, no local install needed. This is handy for sharing traces with team members or viewing CI artifacts directly from a browser.",
        uk: "https://trace.playwright.dev/ — це публічний веб-переглядач трас Playwright. Можна перетягнути файл trace.zip на сторінку і досліджувати його повністю в браузері — без терміналу, без локальної інсталяції. Зручно для обміну traces з членами команди або перегляду CI-артефактів прямо з браузера.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "A test fails on CI with a 401 Unauthorized error. How would you use the trace to confirm this?",
        uk: "Тест падає на CI з помилкою 401 Unauthorized. Як використати trace щоб підтвердити це?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Check the DOM Snapshot panel for any text that says '401'",
            uk: "Перевірити панель DOM Snapshot на наявність тексту '401'",
          },
        },
        {
          id: "b",
          label: {
            en: "Open the Network tab in Trace Viewer — it shows every HTTP request with status codes, headers, and response bodies",
            uk: "Відкрити вкладку Network в Trace Viewer — вона показує кожен HTTP-запит зі статус-кодами, заголовками і тілами відповідей",
          },
        },
        {
          id: "c",
          label: {
            en: "Look at the Timeline at the top — 401 errors appear as red bars",
            uk: "Подивитись на Timeline вгорі — помилки 401 відображаються як червоні смуги",
          },
        },
        {
          id: "d",
          label: {
            en: "Check the Console tab — 401 errors are always logged there",
            uk: "Перевірити вкладку Console — помилки 401 завжди логуються там",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The Network tab in Trace Viewer lists every HTTP request made during the test run, including the URL, method, status code, request headers, and response body. A 401 will appear as a request with status 401 — you can click it to see the full request and response. This makes it easy to spot authentication failures that caused the test to fail without visible UI changes.",
        uk: "Вкладка Network в Trace Viewer перераховує кожен HTTP-запит зроблений під час запуску тесту, включаючи URL, метод, статус-код, заголовки запиту і тіло відповіді. 401 з'явиться як запит зі статусом 401 — можна клікнути на нього щоб побачити повний запит і відповідь. Це дозволяє легко виявити помилки авторизації що спричинили падіння тесту без видимих змін UI.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What can you do with the DOM Snapshot panel in Trace Viewer that you cannot do with a regular screenshot?",
        uk: "Що можна робити з панеллю DOM Snapshot в Trace Viewer чого не можна зробити зі звичайним знімком?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Nothing — DOM Snapshot and a screenshot show the same information",
            uk: "Нічого — DOM Snapshot і знімок показують однакову інформацію",
          },
        },
        {
          id: "b",
          label: {
            en: "Hover over and click elements in the snapshot to see their locators, inspect styles, and understand element hierarchy — it's an interactive live DOM reconstruction",
            uk: "Наводити курсор на елементи і клікати по ним в знімку щоб побачити їх локатори, перевірити стилі і розуміти ієрархію елементів — це інтерактивна реконструкція живого DOM",
          },
        },
        {
          id: "c",
          label: {
            en: "DOM Snapshot lets you rerun the failed assertion against the captured DOM",
            uk: "DOM Snapshot дозволяє повторно запустити невдалий assertion проти захопленого DOM",
          },
        },
        {
          id: "d",
          label: {
            en: "DOM Snapshot allows you to download and replay the full test from that point",
            uk: "DOM Snapshot дозволяє завантажити і відтворити повний тест з того моменту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The DOM Snapshot is an interactive reconstruction of the page at that moment in the test — not just a flat image. You can hover over elements to see their bounding boxes and Playwright-suggested locators, inspect CSS, and navigate the element tree. This is far more powerful than a screenshot for diagnosing locator failures or layout issues.",
        uk: "DOM Snapshot — це інтерактивна реконструкція сторінки в той момент тесту — не просто плоске зображення. Можна наводити курсор на елементи щоб побачити їх bounding box і рекомендовані Playwright локатори, перевіряти CSS і навігувати по дереву елементів. Це набагато потужніше ніж знімок для діагностики помилок локаторів або проблем з макетом.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "How do you force a trace to be recorded for a single test run locally, even though the config has trace: 'on-first-retry'?",
        uk: "Як примусово записати trace для одного запуску тесту локально, навіть якщо в конфізі встановлено trace: 'on-first-retry'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Change the config to trace: 'on' temporarily",
            uk: "Тимчасово змінити конфіг на trace: 'on'",
          },
        },
        {
          id: "b",
          label: {
            en: "Run npx playwright test --trace on — the CLI flag overrides the config value",
            uk: "Запустити npx playwright test --trace on — CLI-прапорець перевизначає значення конфігу",
          },
        },
        {
          id: "c",
          label: {
            en: "Add await page.context().tracing.start() at the top of the test",
            uk: "Додати await page.context().tracing.start() на початку тесту",
          },
        },
        {
          id: "d",
          label: {
            en: "Set PWDEBUG=1 — it also enables trace recording",
            uk: "Встановити PWDEBUG=1 — це також вмикає запис trace",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The --trace CLI flag overrides whatever trace setting is in playwright.config.ts. Running npx playwright test --trace on records a trace for every test in that run, regardless of config. This is the fastest way to force a trace locally for debugging a specific test without touching the config file.",
        uk: "CLI-прапорець --trace перевизначає будь-яке налаштування trace в playwright.config.ts. Запуск npx playwright test --trace on записує trace для кожного тесту в тому запуску, незалежно від конфігу. Це найшвидший спосіб примусово записати trace локально для дебагу конкретного тесту без зміни файлу конфігурації.",
      },
    },
  ],
}
