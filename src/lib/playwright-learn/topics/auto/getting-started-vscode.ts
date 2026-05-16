import type { PlaywrightTopic } from "../../types"

export const gettingStartedVscodeTopic: PlaywrightTopic = {
  slug: "getting-started-vscode",
  groupId: "getting-started",
  order: 220,
  level: "beginner",
  trackOrder: 2,
  sourceDoc: "getting-started-vscode-js.md",
  officialDocsUrl: "https://playwright.dev/docs/getting-started-vscode",
  title: {
    en: "VS Code",
    uk: "VS Code",
  },
  summary: {
    en: "The VS Code extension is how I run tests while writing them. Click the play button next to a test, watch it execute in a browser window, and see errors inline without leaving the editor. The three features I use daily: Show Browser (see what's happening live), Pick Locator (find selectors by clicking), and Show Trace Viewer (debug failures).",
    uk: "Розширення VS Code — це як я запускаю тести поки їх пишу. Натискаю play поруч з тестом, спостерігаю виконання у вікні браузера, і бачу помилки inline не виходячи з редактора. Три фічі які використовую щодня: Show Browser (бачити що відбувається в реальному часі), Pick Locator (знаходити селектори клацанням), і Show Trace Viewer (дебажити падіння).",
  },
  sections: [
    {
      id: "installation",
      title: {
        en: "Installing the extension",
        uk: "Встановлення розширення",
      },
      paragraphs: [
        {
          en: "Search for \"Playwright\" in the VS Code Extensions panel and install the official one from Microsoft. After that, open Command Palette (`Cmd+Shift+P`) and run **Test: Install Playwright** — this walks you through browser selection and creates the initial `playwright.config.ts`.",
          uk: "Знайди \"Playwright\" в панелі Extensions VS Code і встанови офіційне від Microsoft. Після цього відкрий Command Palette (`Cmd+Shift+P`) і запусти **Test: Install Playwright** — це проведе тебе через вибір браузерів і створить початковий `playwright.config.ts`.",
        },
        {
          en: "After installation, click the **Testing icon** in the Activity Bar to see the Test Explorer — all your test files and describe blocks listed there.",
          uk: "Після встановлення — клацни іконку **Testing** на Activity Bar щоб побачити Test Explorer зі всіма файлами тестів і describe-блоками.",
        },
      ],
    },
    {
      id: "running-tests",
      title: {
        en: "Running tests — green play button",
        uk: "Запуск тестів — зелена кнопка play",
      },
      paragraphs: [
        {
          en: "Click the play triangle next to any test, describe block, or file to run it. Results appear inline — green checkmark for pass, red X for fail, with time shown next to the name.",
          uk: "Клацни трикутник play поруч з будь-яким тестом, describe-блоком або файлом щоб запустити. Результати з'являються inline — зелена позначка для проходження, червоний X для падіння, час показується поруч з назвою.",
        },
        {
          en: "**Show Browser** in the sidebar opens a visible browser window while tests run — I keep this on when I'm writing tests, and turn it off for CI speed. To test against multiple browsers, check the boxes next to Chromium/Firefox/WebKit projects in the sidebar.",
          uk: "**Show Browser** в сайдбарі відкриває видиме вікно браузера поки тести виконуються — тримаю це увімкненим коли пишу тести, і вимикаю для швидкості на CI. Щоб тестувати в кількох браузерах — встанови прапорці поруч з проєктами Chromium/Firefox/WebKit в сайдбарі.",
        },
      ],
    },
    {
      id: "debugging",
      title: {
        en: "Debugging — breakpoints and live highlighting",
        uk: "Дебаг — брейкпоїнти і живе підсвічування",
      },
      paragraphs: [
        {
          en: "Set a breakpoint by clicking in the gutter next to a line number. Then right-click the test → **Debug Test**. The test pauses at your breakpoint and you can inspect variables in the Debug panel.",
          uk: "Встанови брейкпоїнт клацнувши в полі ліворуч від номера рядка. Потім клацни правою кнопкою на тесті → **Debug Test**. Тест зупиниться на брейкпоїнті і ти зможеш переглянути змінні в панелі Debug.",
        },
        {
          en: "With **Show Browsers** enabled, clicking on any locator in the test code highlights the matching element in the live browser window — great for verifying locators without running the test.",
          uk: "При увімкненому **Show Browsers** — клацання на будь-якому локаторі в коді тесту підсвічує відповідний елемент у живому вікні браузера — зручно для перевірки локаторів без запуску всього тесту.",
        },
        {
          en: "**Show Trace Viewer** in the sidebar: after a test run, the trace opens automatically showing the full timeline, DOM snapshots, and network tab.",
          uk: "**Show Trace Viewer** в сайдбарі: після запуску тесту трейс відкривається автоматично показуючи повний таймлайн, DOM-snapshot-и і вкладку мережі.",
        },
      ],
    },
    {
      id: "codegen",
      title: {
        en: "Recording tests with Codegen",
        uk: "Запис тестів через Codegen",
      },
      paragraphs: [
        {
          en: "**Record new** opens a browser and records your clicks, fills, and navigation into test code automatically. **Record at cursor** adds actions at a specific point inside an existing test — useful for filling in missing steps.",
          uk: "**Record new** відкриває браузер і записує кліки, заповнення і навігацію в код тесту автоматично. **Record at cursor** додає дії в конкретне місце всередині існуючого тесту — корисно для доповнення пропущених кроків.",
        },
        {
          en: "**Pick locator**: click this button, then click any element in the browser window — Playwright suggests the best locator and copies it to clipboard. I use this constantly when I don't know the right selector for an element.",
          uk: "**Pick locator**: клацни цю кнопку, потім клацни будь-який елемент у вікні браузера — Playwright пропонує найкращий локатор і копіює в буфер обміну. Я постійно використовую це коли не знаю правильний селектор для елемента.",
        },
      ],
    },
    {
      id: "project-setup",
      title: {
        en: "Project dependencies and global setup",
        uk: "Залежності проєктів і глобальний setup",
      },
      paragraphs: [
        {
          en: "If you use project dependencies (like a login setup project that runs before all others), those setup tests appear in the Test Explorer and can be run manually. Global setup and teardown can also be triggered from the Playwright sidebar.",
          uk: "Якщо використовуєш залежності проєктів (наприклад проєкт setup для логіну який виконується перед всіма іншими) — ці setup-тести з'являються в Test Explorer і можуть запускатися вручну. Глобальний setup і teardown також можна запустити з сайдбару Playwright.",
        },
        {
          en: "If you have multiple `playwright.config.ts` files (like one for unit and one for e2e), switch between them using the gear icon in the sidebar.",
          uk: "Якщо є кілька файлів `playwright.config.ts` (наприклад для unit і для e2e) — перемикайся між ними через іконку шестерні в сайдбарі.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want to find the right locator for a button that's hard to select. You're in VS Code with the extension installed. What's the fastest way?",
        uk: "Хочеш знайти правильний локатор для кнопки яку важко виділити. Ти в VS Code з встановленим розширенням. Який найшвидший спосіб?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Open browser DevTools → right-click → Copy selector",
            uk: "Відкрити DevTools браузера → правий клік → Copy selector",
          },
        },
        {
          id: "b",
          label: {
            en: "Click 'Pick locator' in the Playwright sidebar — click the element in the browser, Playwright suggests the best locator",
            uk: "Клацнути 'Pick locator' в сайдбарі Playwright — клацнути елемент в браузері, Playwright пропонує найкращий локатор",
          },
        },
        {
          id: "c",
          label: {
            en: "Use page.locator() with a CSS selector guessed from the class names",
            uk: "Використати page.locator() з CSS-селектором підібраним за назвами класів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Pick Locator is exactly what the extension is for. It opens an interactive mode where you hover over elements in the browser and Playwright shows the recommended locator (preferring role-based and getByText/getByLabel over CSS selectors). DevTools Copy selector gives you raw CSS that's often fragile. Guessing by class names can work but produces brittle selectors.",
        uk: "Pick Locator — це саме для чого розширення існує. Воно відкриває інтерактивний режим де ти наводиш на елементи в браузері і Playwright показує рекомендований локатор (надаючи перевагу role-based і getByText/getByLabel перед CSS-селекторами). DevTools Copy selector дає сирий CSS який часто крихкий. Підбір за класами може спрацювати але дає нестабільні селектори.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "How do you install the Playwright VS Code extension and create the initial playwright.config.ts?",
        uk: "Як встановити розширення Playwright для VS Code і створити початковий playwright.config.ts?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Run npx playwright install in the terminal — it installs both the extension and config automatically",
            uk: "Запустити npx playwright install у терміналі — він встановлює і розширення і конфіг автоматично",
          },
        },
        {
          id: "b",
          label: {
            en: "Search 'Playwright' in the Extensions panel, install the Microsoft extension, then open Command Palette and run 'Test: Install Playwright'",
            uk: "Знайти 'Playwright' в панелі Extensions, встановити розширення від Microsoft, потім відкрити Command Palette і запустити 'Test: Install Playwright'",
          },
        },
        {
          id: "c",
          label: {
            en: "Copy a playwright.config.ts from GitHub and install the extension from the VS Code marketplace website",
            uk: "Скопіювати playwright.config.ts з GitHub і встановити розширення з веб-сайту VS Code marketplace",
          },
        },
        {
          id: "d",
          label: {
            en: "Install via npm install @playwright/test and reload the editor — VS Code detects it automatically",
            uk: "Встановити через npm install @playwright/test і перезавантажити редактор — VS Code виявляє його автоматично",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The two-step process is: first install the official Microsoft Playwright extension from the Extensions panel, then use Command Palette (Cmd+Shift+P) → 'Test: Install Playwright'. The second step walks you through browser selection and creates playwright.config.ts. Running npx playwright install only installs browser binaries, not the VS Code extension or config.",
        uk: "Двокроковий процес: спочатку встанови офіційне розширення Microsoft Playwright з панелі Extensions, потім через Command Palette (Cmd+Shift+P) → 'Test: Install Playwright'. Другий крок проводить через вибір браузерів і створює playwright.config.ts. Команда npx playwright install встановлює лише бінарні файли браузерів, а не розширення VS Code або конфіг.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does the 'Show Browser' feature do in the Playwright VS Code extension?",
        uk: "Що робить функція 'Show Browser' у розширенні Playwright для VS Code?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It opens a browser screenshot in the editor sidebar after the test finishes",
            uk: "Відкриває скриншот браузера в бічній панелі редактора після завершення тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "It launches a visible browser window while tests run so you can watch them execute in real time",
            uk: "Запускає видиме вікно браузера під час виконання тестів щоб спостерігати за ними в реальному часі",
          },
        },
        {
          id: "c",
          label: {
            en: "It opens the Playwright Trace Viewer in the browser after test failure",
            uk: "Відкриває Playwright Trace Viewer у браузері після падіння тесту",
          },
        },
        {
          id: "d",
          label: {
            en: "It displays a list of all browsers installed on the system",
            uk: "Показує список всіх браузерів встановлених на системі",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Show Browser opens a real, visible browser window while tests run — you can watch every click, navigation, and assertion happening live. This is very useful when writing new tests. For CI or fast feedback loops, you turn it off to run headless. It is separate from Trace Viewer, which is for post-run debugging of failures.",
        uk: "Show Browser відкриває справжнє видиме вікно браузера поки тести виконуються — можна спостерігати кожен клік, навігацію і assertion в реальному часі. Дуже зручно при написанні нових тестів. Для CI або швидкого зворотного зв'язку вимикають щоб запускати headless. Це окремо від Trace Viewer який призначений для дебагу падінь після запуску.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You right-click a test in the VS Code Test Explorer and see 'Debug Test'. What happens when you click it after setting a breakpoint?",
        uk: "Ти клацаєш правою кнопкою на тесті в VS Code Test Explorer і бачиш 'Debug Test'. Що станеться після кліку якщо встановлено брейкпоїнт?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The test runs in headed mode and a trace is automatically recorded",
            uk: "Тест запускається в headed-режимі і автоматично записується трейс",
          },
        },
        {
          id: "b",
          label: {
            en: "The test pauses at the breakpoint and you can inspect variables in the VS Code Debug panel",
            uk: "Тест зупиняється на брейкпоїнті і можна перевіряти змінні в панелі Debug VS Code",
          },
        },
        {
          id: "c",
          label: {
            en: "The Playwright Inspector opens and you can step through actions one by one",
            uk: "Відкривається Playwright Inspector і можна проходити дії крок за кроком",
          },
        },
        {
          id: "d",
          label: {
            en: "The test runs twice — once normally and once in slow motion",
            uk: "Тест запускається двічі — один раз звично і один раз уповільнено",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Debug Test uses the VS Code debugger integration. You set a breakpoint by clicking in the gutter next to a line number, then Debug Test pauses at that exact line. From there you can inspect all variables, call stack, and locals in the VS Code Debug panel — the same way you would debug any Node.js code. The Playwright Inspector (option c) is a different tool opened with --debug from the CLI.",
        uk: "Debug Test використовує інтеграцію дебагера VS Code. Встановлюєш брейкпоїнт клацаючи в полі ліворуч від номера рядка, потім Debug Test зупиняється саме на тому рядку. Звідти можна перевіряти всі змінні, стек викликів і локальні змінні в панелі Debug VS Code — так само як дебажиш будь-який Node.js код. Playwright Inspector (варіант в) — це інший інструмент що відкривається через --debug з CLI.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does 'Show Trace Viewer' do in the VS Code Playwright sidebar?",
        uk: "Що робить 'Show Trace Viewer' в сайдбарі Playwright у VS Code?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It opens the Trace Viewer after a test run, showing the full timeline, DOM snapshots, and network tab for debugging failures",
            uk: "Відкриває Trace Viewer після запуску тесту, показуючи повний таймлайн, DOM-снапшоти і вкладку мережі для дебагу падінь",
          },
        },
        {
          id: "b",
          label: {
            en: "It records a video of the test run and plays it back in slow motion",
            uk: "Записує відео запуску тесту і відтворює його в уповільненому режимі",
          },
        },
        {
          id: "c",
          label: {
            en: "It shows CPU and memory usage of the browser during the test",
            uk: "Показує використання CPU і пам'яті браузера під час тесту",
          },
        },
        {
          id: "d",
          label: {
            en: "It displays the browser console logs inline in the editor",
            uk: "Відображає логи консолі браузера inline в редакторі",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "Show Trace Viewer opens the trace automatically after a test run. The trace is a full recording of the test execution: a timeline of actions, DOM snapshots before and after each step, network requests, and console logs. It lets you scrub through the test like a video and inspect the exact page state at any point. This is the primary debugging tool for understanding why a test failed.",
        uk: "Show Trace Viewer відкриває трейс автоматично після запуску тесту. Трейс — це повний запис виконання тесту: таймлайн дій, DOM-снапшоти до і після кожного кроку, мережеві запити і логи консолі. Дозволяє перемотувати тест як відео і перевіряти точний стан сторінки в будь-який момент. Це основний інструмент дебагу для розуміння чому впав тест.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You have three browser projects configured (Chromium, Firefox, WebKit). How do you run tests against only Firefox from the VS Code Test Explorer?",
        uk: "У тебе налаштовані три проєкти браузерів (Chromium, Firefox, WebKit). Як запустити тести тільки для Firefox з VS Code Test Explorer?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Edit playwright.config.ts to comment out Chromium and WebKit, then run",
            uk: "Відредагувати playwright.config.ts щоб закоментувати Chromium і WebKit, потім запустити",
          },
        },
        {
          id: "b",
          label: {
            en: "Check only the Firefox checkbox in the browser projects section of the Playwright sidebar, then run tests",
            uk: "Встановити прапорець тільки для Firefox у розділі browser projects сайдбару Playwright, потім запустити тести",
          },
        },
        {
          id: "c",
          label: {
            en: "Use the terminal and run npx playwright test --project=firefox — the VS Code UI has no way to filter by project",
            uk: "Використати термінал і запустити npx playwright test --project=firefox — у VS Code UI немає способу фільтрувати за проєктом",
          },
        },
        {
          id: "d",
          label: {
            en: "Right-click the test file and choose 'Run with Firefox'",
            uk: "Клацнути правою кнопкою на файлі тесту і вибрати 'Run with Firefox'",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The Playwright sidebar shows all configured browser projects with checkboxes. Checking only Firefox tells the extension to run tests against that project only — no config editing or terminal commands needed. This is one of the most convenient aspects of the VS Code extension compared to CLI usage.",
        uk: "Сайдбар Playwright показує всі налаштовані проєкти браузерів з прапорцями. Встановлення прапорця тільки для Firefox каже розширенню запускати тести лише проти того проєкту — не потрібно редагувати конфіг або використовувати термінал. Це одна з найзручніших особливостей розширення VS Code порівняно з використанням CLI.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "With 'Show Browser' enabled, you click on a locator expression in your test code. What happens in the browser window?",
        uk: "При увімкненому 'Show Browser' ти клацаєш на виразі локатора у коді тесту. Що відбувається у вікні браузера?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The test runs from that locator line onwards",
            uk: "Тест запускається починаючи з того рядка локатора",
          },
        },
        {
          id: "b",
          label: {
            en: "The matching element is highlighted in the live browser window",
            uk: "Відповідний елемент підсвічується у живому вікні браузера",
          },
        },
        {
          id: "c",
          label: {
            en: "VS Code shows the element's HTML in a hover tooltip",
            uk: "VS Code показує HTML елемента в підказці при наведенні",
          },
        },
        {
          id: "d",
          label: {
            en: "The locator is copied to clipboard for reuse",
            uk: "Локатор копіюється в буфер обміну для повторного використання",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When Show Browser is on and a test is open, clicking any locator expression in the code highlights the matched element directly in the live browser window. This is a fast way to verify that a locator targets the right element without running the entire test — you see the highlight immediately and can iterate on the locator string if needed.",
        uk: "Коли Show Browser увімкнено і тест відкритий, клацання будь-якого виразу локатора в коді підсвічує відповідний елемент прямо у живому вікні браузера. Це швидкий спосіб перевірити що локатор вказує на правильний елемент без запуску всього тесту — підсвічення з'являється миттєво і можна одразу підправити рядок локатора якщо потрібно.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You have two playwright.config.ts files — one for unit tests and one for e2e tests. How do you switch between them in VS Code?",
        uk: "У тебе є два файли playwright.config.ts — один для unit-тестів і один для e2e-тестів. Як перемикатися між ними у VS Code?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Rename the config file you want to use to playwright.config.ts and reload",
            uk: "Перейменувати файл конфігурації який хочеш використовувати в playwright.config.ts і перезавантажити",
          },
        },
        {
          id: "b",
          label: {
            en: "Use the gear icon in the Playwright sidebar to switch between config files",
            uk: "Використати іконку шестерні в сайдбарі Playwright щоб перемикатися між файлами конфігурації",
          },
        },
        {
          id: "c",
          label: {
            en: "Open VS Code settings and set the playwright.configFile preference",
            uk: "Відкрити налаштування VS Code і встановити параметр playwright.configFile",
          },
        },
        {
          id: "d",
          label: {
            en: "Set a PLAYWRIGHT_CONFIG environment variable before launching VS Code",
            uk: "Встановити змінну середовища PLAYWRIGHT_CONFIG перед запуском VS Code",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The gear icon in the Playwright sidebar lets you switch between multiple playwright.config.ts files in the same workspace. This is the built-in way to handle monorepos or projects that separate test types into different config files. No renaming or environment variables needed.",
        uk: "Іконка шестерні в сайдбарі Playwright дозволяє перемикатися між кількома файлами playwright.config.ts в одному workspace. Це вбудований спосіб роботи з монорепозиторіями або проєктами що розділяють типи тестів на різні файли конфігурації. Не потрібно перейменовувати файли або використовувати змінні середовища.",
      },
    },
  ],
}
