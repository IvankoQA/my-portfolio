import type { PlaywrightTopic } from "../../types"

export const testUiModeTopic: PlaywrightTopic = {
  slug: "test-ui-mode",
  groupId: "test-runner",
  order: 390,
  level: "advanced",
  trackOrder: 2,
  sourceDoc: "test-ui-mode-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-ui-mode",
  title: {
    en: "UI Mode",
    uk: "UI Mode",
  },
  summary: {
    en: "UI Mode is how I debug failing tests locally. It's a visual runner with time travel — I hover over any action in the timeline and see exactly what the DOM looked like at that moment. Watch mode auto-reruns tests when I save the file. It's faster than running tests from the terminal and re-reading logs.",
    uk: "UI Mode — це як я дебажу тести що падають локально. Це візуальний раннер з подорожжю в часі — наводжу курсор на будь-яку дію в таймлайні і бачу точно який DOM був в той момент. Watch mode автоматично перезапускає тести коли зберігаю файл. Це швидше ніж запускати тести з терміналу і перечитувати логи.",
  },
  sections: [
    {
      id: "launching",
      title: {
        en: "Launching UI Mode",
        uk: "Запуск UI Mode",
      },
      paragraphs: [
        {
          en: "One command opens a browser window with all your tests. From there you run, filter, and debug without touching the terminal again.",
          uk: "Одна команда відкриває вікно браузера з усіма твоїми тестами. Звідти запускаєш, фільтруєш і дебажиш без повернення до терміналу.",
        },
      ],
      codeBlocks: [
        {
          id: "launch",
          language: "bash",
          code: `npx playwright test --ui

# Для Docker і GitHub Codespaces — пробрасувати на 0.0.0.0
npx playwright test --ui-host=0.0.0.0 --ui-port=8080`,
        },
      ],
    },
    {
      id: "running-tests",
      title: {
        en: "Running and filtering tests",
        uk: "Запуск і фільтрація тестів",
      },
      paragraphs: [
        {
          en: "The left sidebar shows all test files and describe blocks. Click the triangle next to any item to run just that. Filter by name, `@tag`, project (Chromium/Firefox/WebKit from your config), or status (passed/failed/skipped).",
          uk: "Лівий сайдбар показує всі файли тестів і describe-блоки. Клацни трикутник поруч з будь-яким елементом щоб запустити тільки його. Фільтруй за назвою, `@tag`, проєктом (Chromium/Firefox/WebKit з твого конфігу) або статусом (пройшов/впав/пропущений).",
        },
        {
          en: "Watch mode: click the eye icon next to a test to auto-rerun it every time you save the test file. I keep this on during development — edit code, save, see the result immediately.",
          uk: "Watch mode: клацни іконку ока поруч з тестом щоб він автоматично перезапускався кожного разу як зберігаєш файл. Тримаю це увімкненим під час розробки — редагую код, зберігаю, одразу бачу результат.",
        },
      ],
    },
    {
      id: "time-travel",
      title: {
        en: "Time travel — see DOM at any moment",
        uk: "Подорож у часі — бачити DOM у будь-який момент",
      },
      paragraphs: [
        {
          en: "This is the killer feature. After running a test, hover over any action in the Actions panel on the left. The DOM snapshot on the right updates to show exactly what the page looked like at that moment — before and after the action. Use the Before/After tabs to see what changed.",
          uk: "Це вбивча фіча. Після запуску тесту — наводь курсор на будь-яку дію в панелі Actions зліва. DOM-snapshot справа оновлюється щоб показати точно як виглядала сторінка в той момент — до і після дії. Використовуй вкладки Before/After щоб побачити що змінилося.",
        },
        {
          en: "The timeline at the top shows the full test visually — blue for actions, green for navigations. Drag the slider to scrub through time. When a test fails, there's a red marker exactly where the failure happened.",
          uk: "Таймлайн зверху показує весь тест візуально — синій для дій, зелений для навігацій. Тягни слайдер щоб прокручувати в часі. Коли тест падає — є червоний маркер точно там де сталося падіння.",
        },
      ],
    },
    {
      id: "pick-locator",
      title: {
        en: "Pick Locator — find the right locator interactively",
        uk: "Pick Locator — знайти правильний локатор інтерактивно",
      },
      paragraphs: [
        {
          en: "When I'm not sure what locator to use for an element, I click **Pick locator** in UI Mode and hover over the DOM snapshot. Playwright shows the recommended locator for whatever I hover on. Click to pin it, tweak it in the input field, and copy when it looks right.",
          uk: "Коли не впевнений який локатор використовувати для елемента — клацаю **Pick locator** в UI Mode і наводжу курсор на DOM-snapshot. Playwright показує рекомендований локатор для всього на що наводжу. Клацни щоб закріпити, підправ у полі вводу, і скопіюй коли виглядає правильно.",
        },
      ],
    },
    {
      id: "debugging-tabs",
      title: {
        en: "Debugging tabs — Console, Network, Errors, Log",
        uk: "Вкладки для дебагу — Console, Network, Errors, Log",
      },
      paragraphs: [
        {
          en: "Each action has four tabs worth knowing:",
          uk: "Кожна дія має чотири вкладки що варто знати:",
        },
        {
          en: "**Errors** — error messages with the exact line of code. **Log** — Playwright's internal log: what it was waiting for, whether actionability checks passed, how long each step took. **Console** — browser console output (not test output). **Network** — every request with status, size, timing.",
          uk: "**Errors** — повідомлення про помилки з точним рядком коду. **Log** — внутрішній лог Playwright: чого він чекав, чи пройшли перевірки actionability, скільки часу зайняв кожен крок. **Console** — вивід консолі браузера (не тестовий вивід). **Network** — кожен запит зі статусом, розміром, часом.",
        },
        {
          en: "The Source panel shows the test code and highlights the current line as you hover actions. The **Open in VSCode** button jumps directly to that line.",
          uk: "Панель Source показує код тесту і підсвічує поточний рядок коли наводиш на дії. Кнопка **Open in VSCode** переходить прямо на цей рядок.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A test clicks a button and then the assertion fails — but you can't tell why from the error message alone. How does UI Mode help?",
        uk: "Тест клацає кнопку і потім перевірка падає — але з повідомлення про помилку не зрозуміло чому. Як UI Mode допомагає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It shows the full test log in the terminal with more detail than the regular run",
            uk: "Він показує повний лог тесту в терміналі з більшими деталями ніж звичайний запуск",
          },
        },
        {
          id: "b",
          label: {
            en: "Hover over the failing assertion in the Actions panel to see the DOM snapshot at that exact moment — you can visually inspect what was on the page when it failed",
            uk: "Наведи курсор на перевірку що падає в панелі Actions щоб побачити DOM-snapshot в той точний момент — можна візуально перевірити що було на сторінці коли вона впала",
          },
        },
        {
          id: "c",
          label: {
            en: "UI Mode automatically fixes common assertion failures",
            uk: "UI Mode автоматично виправляє поширені помилки перевірок",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The time travel feature is the key: each action in the Actions panel stores a DOM snapshot. Hovering over the failing assertion shows what the page looked like at that point — you can see if the element was missing, had wrong text, was hidden behind another element, etc. The Log tab also shows exactly what Playwright was waiting for and what actionability checks failed.",
        uk: "Фіча подорожі в часі — ключова: кожна дія в панелі Actions зберігає DOM-snapshot. Наведення курсору на перевірку що падає показує як виглядала сторінка в той момент — можна побачити чи елемент був відсутній, мав неправильний текст, був захований за іншим елементом тощо. Вкладка Log також показує точно чого чекав Playwright і які перевірки actionability не пройшли.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You're writing a new test and keep running it to check your locators. What's the fastest workflow?",
        uk: "Ти пишеш новий тест і постійно перезапускаєш його щоб перевірити локатори. Який найшвидший workflow?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Run npx playwright test after each change — it's fast enough",
            uk: "Запускати npx playwright test після кожної зміни — це достатньо швидко",
          },
        },
        {
          id: "b",
          label: {
            en: "Open UI Mode, enable watch mode on that test (eye icon), and use Pick Locator to find the right selectors",
            uk: "Відкрити UI Mode, увімкнути watch mode на цьому тесті (іконка ока), і використати Pick Locator для знаходження правильних селекторів",
          },
        },
        {
          id: "c",
          label: {
            en: "Use Codegen to record interactions and generate locators automatically",
            uk: "Використати Codegen щоб записати взаємодії і автоматично згенерувати локатори",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Watch mode + Pick Locator is the fastest iteration loop: save the file and the test reruns automatically — no switching to terminal. Pick Locator lets you find selectors by hovering on the DOM snapshot instead of guessing. Codegen is useful for the initial recording but doesn't help when you're iterating on existing locators.",
        uk: "Watch mode + Pick Locator — найшвидша ітераційна петля: збережи файл і тест перезапускається автоматично — без переключення на термінал. Pick Locator дозволяє знаходити селектори наводячи на DOM-snapshot замість того щоб вгадувати. Codegen корисний для початкового запису але не допомагає коли ти ітерієш на існуючих локаторах.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What command launches Playwright UI Mode?",
        uk: "Яка команда запускає Playwright UI Mode?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright open",
            uk: "npx playwright open",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright test --ui",
            uk: "npx playwright test --ui",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright debug",
            uk: "npx playwright debug",
          },
        },
        {
          id: "d",
          label: {
            en: "npx playwright show-report --ui",
            uk: "npx playwright show-report --ui",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`npx playwright test --ui` is the command that opens the UI Mode browser window. For Docker or GitHub Codespaces where you need to expose the server externally, you additionally pass `--ui-host=0.0.0.0 --ui-port=8080`. `npx playwright show-report` opens the HTML report, not UI Mode.",
        uk: "`npx playwright test --ui` — це команда що відкриває вікно браузера UI Mode. Для Docker або GitHub Codespaces де потрібно зовнішньо виставити сервер — додатково передається `--ui-host=0.0.0.0 --ui-port=8080`. `npx playwright show-report` відкриває HTML-звіт, а не UI Mode.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "In UI Mode, what does the watch mode (eye icon) do when enabled on a test?",
        uk: "В UI Mode що робить watch mode (іконка ока) коли увімкнений на тесті?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It runs the test in slow motion so you can watch each step",
            uk: "Він запускає тест у повільному режимі щоб можна було спостерігати за кожним кроком",
          },
        },
        {
          id: "b",
          label: {
            en: "It automatically reruns the test every time the test file is saved",
            uk: "Він автоматично перезапускає тест кожного разу коли зберігається файл тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "It records a video of the test run",
            uk: "Він записує відео тестового запуску",
          },
        },
        {
          id: "d",
          label: {
            en: "It monitors network requests and highlights any that are slow",
            uk: "Він моніторить мережеві запити і підсвічує ті що є повільними",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Watch mode in UI Mode sets up a file watcher on the test file. Every time you save, the test reruns automatically inside the UI Mode window — no need to click Run or switch to the terminal. This creates a tight feedback loop: edit the test or the app, hit save, immediately see the result.",
        uk: "Watch mode у UI Mode налаштовує file watcher на файл тесту. Кожного разу коли зберігаєш — тест автоматично перезапускається всередині вікна UI Mode без потреби клікати Run або перемикатися на термінал. Це створює щільну петлю зворотного зв'язку: редагуй тест або застосунок, натисни зберегти, одразу побач результат.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How does the time-travel debugging feature work in UI Mode?",
        uk: "Як працює функція time-travel debugging в UI Mode?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It replays the entire test in real time at adjustable speed",
            uk: "Він відтворює весь тест у реальному часі з регульованою швидкістю",
          },
        },
        {
          id: "b",
          label: {
            en: "Hovering over any action in the Actions panel updates the DOM snapshot on the right to show what the page looked like at that exact moment",
            uk: "Наведення курсору на будь-яку дію в панелі Actions оновлює DOM snapshot справа щоб показати як виглядала сторінка в той точний момент",
          },
        },
        {
          id: "c",
          label: {
            en: "It uses git history to restore the page to a previous version",
            uk: "Він використовує git-історію щоб відновити сторінку до попередньої версії",
          },
        },
        {
          id: "d",
          label: {
            en: "It inserts breakpoints into the test and pauses at each one for inspection",
            uk: "Він вставляє точки зупинки в тест і зупиняється на кожній для інспекції",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "After a test run, the Actions panel stores a DOM snapshot for every action. Hovering over any action — including the failing assertion — updates the right pane to show the page state at that moment, with Before/After tabs to see what changed. The timeline at the top provides a visual overview with color-coded markers (blue for actions, green for navigations, red for failures).",
        uk: "Після тестового запуску панель Actions зберігає DOM snapshot для кожної дії. Наведення курсору на будь-яку дію — включно з assertion що падає — оновлює праву панель щоб показати стан сторінки в той момент, з вкладками Before/After щоб побачити що змінилося. Таймлайн зверху надає візуальний огляд з кольоровими маркерами (синій для дій, зелений для навігацій, червоний для збоїв).",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You want to run only the tests tagged `@smoke` in a specific project (Chromium) from UI Mode. How do you achieve this?",
        uk: "Ти хочеш запустити лише тести з тегом `@smoke` у конкретному проекті (Chromium) з UI Mode. Як це зробити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "You must use the CLI — filtering by both tag and project at once is not possible in UI Mode",
            uk: "Потрібно використати CLI — фільтрація одночасно за тегом і проектом не можлива в UI Mode",
          },
        },
        {
          id: "b",
          label: {
            en: "Type `@smoke` in the filter box and select Chromium from the project dropdown in the left sidebar",
            uk: "Вводь `@smoke` у поле фільтра і вибери Chromium зі спадного меню проекту в лівому сайдбарі",
          },
        },
        {
          id: "c",
          label: {
            en: "Right-click any test and choose 'Run with tag and project'",
            uk: "Клацни правою кнопкою на будь-якому тесті і вибери 'Run with tag and project'",
          },
        },
        {
          id: "d",
          label: {
            en: "Modify playwright.config.ts to hardcode the filter before opening UI Mode",
            uk: "Змінити playwright.config.ts щоб хардкодити фільтр перед відкриттям UI Mode",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "UI Mode's left sidebar has a filter input that accepts test names and tag strings like `@smoke`, and a project selector dropdown that lets you pick which browser configuration to run. These filters compose — you can show only `@smoke` tests AND only the Chromium project simultaneously, making it easy to run a targeted subset without leaving the UI.",
        uk: "Лівий сайдбар UI Mode має поле фільтра що приймає назви тестів і рядки тегів типу `@smoke`, і спадне меню вибору проекту що дозволяє вибрати яку конфігурацію браузера запускати. Ці фільтри поєднуються — можна показати лише тести `@smoke` І лише проект Chromium одночасно, що дозволяє легко запускати цільову підмножину без виходу з UI.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How does UI Mode differ from Trace Viewer?",
        uk: "Чим UI Mode відрізняється від Trace Viewer?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are identical tools with different names",
            uk: "Це ідентичні інструменти з різними назвами",
          },
        },
        {
          id: "b",
          label: {
            en: "UI Mode is a live interactive runner for running and debugging tests; Trace Viewer is a read-only viewer for examining a pre-recorded trace file",
            uk: "UI Mode — це живий інтерактивний раннер для запуску і дебагу тестів; Trace Viewer — це read-only переглядач для вивчення заздалегідь записаного trace-файлу",
          },
        },
        {
          id: "c",
          label: {
            en: "Trace Viewer is only for CI; UI Mode is only for local development",
            uk: "Trace Viewer тільки для CI; UI Mode тільки для локальної розробки",
          },
        },
        {
          id: "d",
          label: {
            en: "UI Mode shows code coverage; Trace Viewer shows network traffic",
            uk: "UI Mode показує покриття коду; Trace Viewer показує мережевий трафік",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "UI Mode is an interactive runner: you can launch it, run tests, watch them rerun on save, pick locators, and filter — all live. Trace Viewer (`npx playwright show-trace`) opens a pre-recorded `.zip` trace file that was captured during a past run. It has the same DOM snapshot time-travel but is read-only and offline — useful for investigating CI failures by downloading the trace artifact.",
        uk: "UI Mode — інтерактивний раннер: можна запустити, запускати тести, спостерігати їх перезапуск при збереженні, вибирати локатори, фільтрувати — все в реальному часі. Trace Viewer (`npx playwright show-trace`) відкриває заздалегідь записаний `.zip` trace-файл що був захоплений під час минулого запуску. Він має такий же time-travel DOM snapshot але read-only і офлайн — корисний для дослідження збоїв CI шляхом завантаження артефакту трейсу.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "In UI Mode, what does the Log tab show for a selected action?",
        uk: "В UI Mode що показує вкладка Log для вибраної дії?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The browser console output at the time of the action",
            uk: "Вивід консолі браузера під час дії",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright's internal log: what it was waiting for, whether actionability checks passed, and how long each step took",
            uk: "Внутрішній лог Playwright: чого він чекав, чи пройшли перевірки actionability і скільки часу зайняв кожен крок",
          },
        },
        {
          id: "c",
          label: {
            en: "The git commit history for the test file",
            uk: "Історія git-комітів для файлу тесту",
          },
        },
        {
          id: "d",
          label: {
            en: "All network requests made during the entire test run",
            uk: "Всі мережеві запити зроблені протягом усього тестового запуску",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The Log tab shows Playwright's internal diagnostic log for the selected action — what condition it was retrying, which actionability checks ran (visible, stable, enabled, editable), and timing information. This is the most useful tab when a `click()` or `fill()` fails unexpectedly: the log tells you exactly whether the element was found but not visible, or visible but not enabled.",
        uk: "Вкладка Log показує внутрішній діагностичний лог Playwright для вибраної дії — яку умову він повторював, які перевірки actionability виконувалися (visible, stable, enabled, editable) і інформацію про час. Це найкорисніша вкладка коли `click()` або `fill()` несподівано падає: лог точно повідомляє чи елемент знайдено але не видимий, або видимий але не увімкнений.",
      },
    },
  ],
}
