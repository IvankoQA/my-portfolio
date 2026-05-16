import type { PlaywrightTopic } from "../../types"

export const debugTopic: PlaywrightTopic = {
  slug: "debug",
  groupId: "guides",
  order: 165,
  level: "beginner",
  trackOrder: 15,
  sourceDoc: "debug.md",
  officialDocsUrl: "https://playwright.dev/docs/debug",
  title: {
    en: "Debugging Tests",
    uk: "Дебаг тестів",
  },
  summary: {
    en: "When a test fails and you can't tell why, these are the tools to reach for — starting with the simplest and going deeper.",
    uk: "Коли тест падає і незрозуміло чому — ось інструменти в порядку від простого до глибокого.",
  },
  sections: [
    {
      id: "ui-mode",
      title: {
        en: "Start with UI mode",
        uk: "Починай з UI mode",
      },
      paragraphs: [
        {
          en: "UI mode is the first tool I open when a test fails. It shows a timeline of every action, a DOM snapshot at each step, network requests, and console output — all in one view. You can rewind to any point and see exactly what the page looked like.",
          uk: "UI mode — перший інструмент що я відкриваю коли тест падає. Він показує таймлайн кожної дії, DOM снепшот на кожному кроці, мережеві запити і консоль — все в одному вікні. Можна перемотати до будь-якого моменту і побачити як саме виглядала сторінка.",
        },
      ],
      codeBlocks: [
        {
          id: "ui-mode",
          language: "bash",
          code: `npx playwright test --ui

# Або конкретний файл
npx playwright test tests/orders.spec.ts --ui`,
        },
      ],
    },
    {
      id: "headed-debug",
      title: {
        en: "Run headed with --debug",
        uk: "Запуск headed з --debug",
      },
      paragraphs: [
        {
          en: "`--debug` opens Playwright Inspector alongside a visible browser. The test pauses at the start and you step through it manually — action by action. Useful when you need to see exactly which element gets clicked or what state the page is in at a specific moment.",
          uk: "`--debug` відкриває Playwright Inspector поруч з видимим браузером. Тест ставиться на паузу на початку і ти проходиш його вручну — дія за дією. Корисно коли треба точно побачити який елемент кликається або в якому стані сторінка в конкретний момент.",
        },
      ],
      codeBlocks: [
        {
          id: "debug-flag",
          language: "bash",
          code: `# Запустити з дебагером
npx playwright test tests/orders.spec.ts --debug

# Або конкретний тест
npx playwright test --debug -g "filter shows pending orders"`,
        },
      ],
    },
    {
      id: "breakpoints",
      title: {
        en: "Breakpoints in the test",
        uk: "Breakpoints в тесті",
      },
      paragraphs: [
        {
          en: "`await page.pause()` stops the test at that exact line and opens Playwright Inspector. Unlike `--debug` (which pauses at the start), `pause()` lets you run until a specific moment — skip the boring setup and stop right where the problem is.",
          uk: "`await page.pause()` зупиняє тест на тій конкретній лінії і відкриває Playwright Inspector. На відміну від `--debug` (що ставить паузу на початку), `pause()` дозволяє виконати нудний сетап і зупинитись прямо там де є проблема.",
        },
      ],
      codeBlocks: [
        {
          id: "pause",
          language: "ts",
          code: `test('filter orders', async ({ page }) => {
  await page.goto('/orders')
  await page.getByRole('combobox', { name: 'Статус' }).selectOption('pending')

  // Зупинити тут і подивитися що відбулося
  await page.pause()

  await expect(page.getByRole('row')).toHaveCount(5)
})`,
        },
      ],
    },
    {
      id: "vs-code",
      title: {
        en: "VS Code extension",
        uk: "Розширення VS Code",
      },
      paragraphs: [
        {
          en: "With the Playwright VS Code extension, you can run and debug tests without leaving the editor. Click the triangle next to a test name to run it, or right-click for \"Debug test\" to step through with breakpoints. The extension also has a **Pick locator** button — click it, then click any element in the browser, and the best locator is copied to your clipboard.",
          uk: "З розширенням Playwright для VS Code можна запускати і дебажити тести не виходячи з редактора. Клікни трикутник поруч з назвою тесту щоб запустити, або правою кнопкою для \"Debug test\" щоб проходити з breakpoints. У розширенні також є кнопка **Pick locator** — натисни її, потім клікни на елемент в браузері, і найкращий локатор скопіюється в буфер.",
        },
      ],
    },
    {
      id: "traces",
      title: {
        en: "Traces for CI failures",
        uk: "Traces для падінь на CI",
      },
      paragraphs: [
        {
          en: "When a test fails on CI and you can't reproduce locally, traces are the answer. A trace is a zip file containing every action, DOM snapshot, screenshot, network call and console log from the test run. Enable it in the config and Playwright saves it automatically on failure.",
          uk: "Коли тест падає на CI і не відтворюється локально — traces це відповідь. Trace — це zip файл що містить кожну дію, DOM снепшот, скріншот, мережевий запит і лог консолі за весь прогін тесту. Увімкни в конфізі і Playwright автоматично зберігає їх при падінні.",
        },
        {
          en: "Open a saved trace with `npx playwright show-trace path/to/trace.zip` — it opens the same Trace Viewer you know from UI mode, but for the CI run.",
          uk: "Відкрий збережений trace через `npx playwright show-trace path/to/trace.zip` — відкриється той самий Trace Viewer що ти знаєш з UI mode, але для прогону на CI.",
        },
      ],
      codeBlocks: [
        {
          id: "trace-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  use: {
    // Зберігати trace тільки при першому retry (найефективніший варіант)
    trace: 'on-first-retry',

    // Або завжди (більший розмір артефактів)
    // trace: 'on',
  },
})`,
        },
        {
          id: "show-trace",
          language: "bash",
          code: `# Відкрити trace локально
npx playwright show-trace test-results/orders-filter/trace.zip

# Або завантажити на trace.playwright.dev (публічний перегляд)`,
        },
      ],
    },
    {
      id: "console-network",
      title: {
        en: "Check console and network in tests",
        uk: "Консоль і мережа в тестах",
      },
      paragraphs: [
        {
          en: "You can listen to console messages and network requests directly in a test. This helps when the UI looks correct but something in the background is going wrong — an error logged to console, a failed API call, or a redirect that shouldn't happen.",
          uk: "Можна слухати консольні повідомлення і мережеві запити прямо в тесті. Це допомагає коли UI виглядає нормально але щось у фоні йде не так — помилка в консолі, падіння API запиту або редирект якого не повинно бути.",
        },
      ],
      codeBlocks: [
        {
          id: "console-network",
          language: "ts",
          code: `test('no JS errors on dashboard load', async ({ page }) => {
  const errors: string[] = []

  // Збираємо JS помилки
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })

  // Збираємо failed запити
  page.on('response', res => {
    if (!res.ok()) {
      errors.push(\`\${res.status()} \${res.url()}\`)
    }
  })

  await page.goto('/dashboard')
  await expect(page.getByRole('main')).toBeVisible()

  expect(errors).toHaveLength(0)
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want to pause the test at a specific line to inspect the browser state. What do you use?",
        uk: "Хочеш зупинити тест на конкретній лінії щоб перевірити стан браузера. Що використовуєш?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright test --debug (starts paused at the beginning)",
            uk: "npx playwright test --debug (стартує на паузі на початку)",
          },
        },
        {
          id: "b",
          label: {
            en: "await page.pause() at the exact line",
            uk: "await page.pause() на конкретній лінії",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.waitForTimeout(99999) to freeze the test",
            uk: "await page.waitForTimeout(99999) щоб заморозити тест",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.pause()` pauses exactly where you put it and opens Playwright Inspector. `--debug` pauses at the very start. `waitForTimeout` just sleeps and doesn't open any inspector.",
        uk: "`page.pause()` ставить паузу рівно там де ти його поставив і відкриває Playwright Inspector. `--debug` ставить паузу на самому початку. `waitForTimeout` просто чекає і не відкриває жодного інспектора.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is the environment variable that launches Playwright with the Inspector attached from the very start of the run?",
        uk: "Яка змінна середовища запускає Playwright з Inspector підключеним від самого початку запуску?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "DEBUG=playwright",
            uk: "DEBUG=playwright",
          },
        },
        {
          id: "b",
          label: {
            en: "PWDEBUG=1",
            uk: "PWDEBUG=1",
          },
        },
        {
          id: "c",
          label: {
            en: "PLAYWRIGHT_INSPECT=true",
            uk: "PLAYWRIGHT_INSPECT=true",
          },
        },
        {
          id: "d",
          label: {
            en: "NODE_DEBUG=playwright",
            uk: "NODE_DEBUG=playwright",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "PWDEBUG=1 is the dedicated Playwright environment variable. Setting it before running your test command (e.g. PWDEBUG=1 npx playwright test) opens Playwright Inspector automatically, runs the browser in headed mode, and pauses at the start — identical to the --debug CLI flag.",
        uk: "PWDEBUG=1 — це спеціальна змінна середовища Playwright. Встановлення її перед командою запуску тестів (наприклад PWDEBUG=1 npx playwright test) автоматично відкриває Playwright Inspector, запускає браузер у headed режимі і ставить паузу на початку — ідентично до CLI-прапорця --debug.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the key difference between UI mode (--ui) and running with --debug?",
        uk: "В чому ключова різниця між UI mode (--ui) і запуском з --debug?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "--debug runs faster because it doesn't record a trace",
            uk: "--debug працює швидше тому що не записує trace",
          },
        },
        {
          id: "b",
          label: {
            en: "UI mode shows a full timeline of actions, DOM snapshots, and network in a GUI you can scrub through; --debug opens Inspector and lets you step through the test live action by action",
            uk: "UI mode показує повний таймлайн дій, DOM-знімки і мережу в GUI через який можна скролити; --debug відкриває Inspector і дозволяє проходити тест наживо дія за дією",
          },
        },
        {
          id: "c",
          label: {
            en: "UI mode only works for TypeScript tests; --debug works for any language",
            uk: "UI mode працює тільки для TypeScript тестів; --debug працює для будь-якої мови",
          },
        },
        {
          id: "d",
          label: {
            en: "They are essentially the same tool with different launch commands",
            uk: "Вони по суті один і той самий інструмент з різними командами запуску",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "UI mode is a comprehensive visual test runner that records the full test run and lets you review the timeline after execution — useful for post-mortem analysis. --debug (or PWDEBUG=1) launches Inspector and pauses the test at the start so you can step through it interactively in real time. They complement each other but serve different workflows.",
        uk: "UI mode — це комплексний візуальний запускач тестів що записує повний прогін тесту і дозволяє переглядати таймлайн після виконання — корисний для посмертного аналізу. --debug (або PWDEBUG=1) запускає Inspector і ставить тест на паузу на початку щоб ти міг проходити його інтерактивно в реальному часі. Вони доповнюють один одного але слугують різним робочим процесам.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does Playwright Inspector show that makes it useful for debugging locator issues?",
        uk: "Що показує Playwright Inspector що робить його корисним для дебагу проблем з локаторами?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The source map of the compiled TypeScript file",
            uk: "Карту джерел скомпільованого TypeScript файлу",
          },
        },
        {
          id: "b",
          label: {
            en: "A list of all elements on the page that match the current locator, highlighted in the live browser",
            uk: "Список всіх елементів на сторінці що відповідають поточному локатору, підсвічених у живому браузері",
          },
        },
        {
          id: "c",
          label: {
            en: "The raw HTML source of the page at the time of failure",
            uk: "Вихідний HTML сторінки на момент падіння",
          },
        },
        {
          id: "d",
          label: {
            en: "The CPU and memory usage of each test step",
            uk: "Використання CPU і пам'яті кожного кроку тесту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright Inspector highlights matching elements in the live browser as you type or select a locator. This makes it immediately obvious if a locator matches zero elements, one element, or too many. You can also use the Pick Locator button to click an element and get a suggested locator — perfect for fixing selector issues without guessing.",
        uk: "Playwright Inspector підсвічує відповідні елементи в живому браузері коли ти вводиш або вибираєш локатор. Це одразу дає зрозуміти чи локатор відповідає нулю елементів, одному елементу або надто багатьом. Можна також використовувати кнопку Pick Locator щоб клікнути на елемент і отримати запропонований локатор — ідеально для виправлення проблем з селекторами без здогадок.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "With the VS Code Playwright extension, how do you add a breakpoint and step through a test?",
        uk: "За допомогою розширення Playwright для VS Code як додати breakpoint і крок за кроком пройти тест?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add await page.pause() calls in the code, then run normally",
            uk: "Додати виклики await page.pause() в код, потім запустити звично",
          },
        },
        {
          id: "b",
          label: {
            en: "Right-click the test name and choose 'Debug test'; VS Code debugger breakpoints in the .spec.ts file are then respected",
            uk: "Клікнути правою кнопкою на назву тесту і вибрати 'Debug test'; breakpoints у .spec.ts файлі в дебагері VS Code тоді враховуються",
          },
        },
        {
          id: "c",
          label: {
            en: "Set PWDEBUG=1 in the VS Code terminal and run the test",
            uk: "Встановити PWDEBUG=1 в терміналі VS Code і запустити тест",
          },
        },
        {
          id: "d",
          label: {
            en: "Install the Chrome DevTools extension separately for VS Code breakpoints to work",
            uk: "Встановити розширення Chrome DevTools окремо щоб breakpoints VS Code працювали",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The VS Code Playwright extension integrates with the standard VS Code debugger. Right-click a test and choose 'Debug test' (or use the debug triangle button) to start a debug session where standard editor breakpoints in the spec file are active. This is more ergonomic than page.pause() because you get the full VS Code debug UI with variable inspection and call stack.",
        uk: "Розширення Playwright для VS Code інтегрується зі стандартним дебагером VS Code. Клікни правою кнопкою на тест і вибери 'Debug test' (або використай кнопку debug трикутника) щоб розпочати debug-сесію де активні стандартні breakpoints редактора в spec-файлі. Це зручніше ніж page.pause() бо отримуєш повний debug UI VS Code з інспекцією змінних і стеком викликів.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "When is it best to use traces compared to running the test with --debug?",
        uk: "Коли краще використовувати traces порівняно з запуском тесту з --debug?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Traces are better for local development; --debug is better for CI failures",
            uk: "Traces краще для локальної розробки; --debug краще для падінь на CI",
          },
        },
        {
          id: "b",
          label: {
            en: "Traces are better when the failure happens on CI and you can't reproduce it locally; --debug is better when you can run the test interactively",
            uk: "Traces краще коли падіння трапляється на CI і ти не можеш відтворити його локально; --debug краще коли можна запустити тест інтерактивно",
          },
        },
        {
          id: "c",
          label: {
            en: "They are interchangeable — use whichever starts faster",
            uk: "Вони взаємозамінні — використовуй той що стартує швидше",
          },
        },
        {
          id: "d",
          label: {
            en: "Traces are only available in Playwright's paid enterprise plan",
            uk: "Traces доступні тільки в платному enterprise плані Playwright",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Traces are a post-mortem tool: enable them in config (trace: 'on-first-retry'), run the suite on CI, then download and open the trace.zip to see exactly what happened — every action, DOM snapshot, network call, and console error. --debug requires the test to be runnable interactively; it won't help for CI-only failures you can't reproduce.",
        uk: "Traces — це інструмент посмертного аналізу: увімкни їх в конфізі (trace: 'on-first-retry'), запусти сюіт на CI, потім завантаж і відкрий trace.zip щоб побачити що саме відбулося — кожну дію, DOM-знімок, мережевий запит і помилку консолі. --debug вимагає щоб тест можна було запустити інтерактивно; він не допоможе при падіннях тільки на CI які не вдається відтворити.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You listen to page.on('console') in a test. What types of messages can you capture?",
        uk: "Ти слухаєш page.on('console') в тесті. Які типи повідомлень можна перехопити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Only console.error() messages from the browser",
            uk: "Тільки повідомлення console.error() з браузера",
          },
        },
        {
          id: "b",
          label: {
            en: "All browser console output — log, info, warn, error, and debug — each with a type you can filter on",
            uk: "Весь консольний вивід браузера — log, info, warn, error і debug — кожен з типом по якому можна фільтрувати",
          },
        },
        {
          id: "c",
          label: {
            en: "Only network-related console messages like CORS errors",
            uk: "Тільки мережеві консольні повідомлення як CORS помилки",
          },
        },
        {
          id: "d",
          label: {
            en: "Console messages from the Playwright test runner itself, not from the browser",
            uk: "Консольні повідомлення від самого Playwright test runner, а не з браузера",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "page.on('console', msg => ...) fires for every console message emitted by the browser page — console.log, console.warn, console.error, console.info, and console.debug. The ConsoleMessage object exposes msg.type() so you can filter for just errors. This is how you detect JavaScript exceptions that don't cause visible test failures.",
        uk: "page.on('console', msg => ...) спрацьовує для кожного консольного повідомлення генерованого браузерною сторінкою — console.log, console.warn, console.error, console.info і console.debug. Об'єкт ConsoleMessage надає msg.type() щоб ти міг фільтрувати тільки помилки. Саме так виявляють JavaScript виключення що не викликають видимих падінь тесту.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What is the fastest way to get a locator for an element you can see in the browser during a debug session?",
        uk: "Який найшвидший спосіб отримати локатор для елемента видимого в браузері під час debug-сесії?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Inspect the element in Chrome DevTools and copy the CSS selector",
            uk: "Перевірити елемент в Chrome DevTools і скопіювати CSS-селектор",
          },
        },
        {
          id: "b",
          label: {
            en: "Use the Pick locator button in Playwright Inspector or VS Code extension — click the element and get the recommended locator copied to clipboard",
            uk: "Використати кнопку Pick locator в Playwright Inspector або розширенні VS Code — клікнути на елемент і отримати рекомендований локатор скопійованим в буфер обміну",
          },
        },
        {
          id: "c",
          label: {
            en: "Run npx playwright codegen and record a new test from scratch",
            uk: "Запустити npx playwright codegen і записати новий тест з нуля",
          },
        },
        {
          id: "d",
          label: {
            en: "Check the network tab for the element's data-testid attribute",
            uk: "Перевірити вкладку мережі для атрибуту data-testid елемента",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The Pick locator feature in Playwright Inspector (also available in the VS Code extension) lets you hover or click any element in the paused browser and instantly see Playwright's recommended locator — prioritizing role, label, and test ID over CSS selectors. The locator is copied to clipboard. This is much faster than manually reading the DOM or re-running codegen.",
        uk: "Функція Pick locator в Playwright Inspector (також доступна в розширенні VS Code) дозволяє навести курсор або клікнути на будь-який елемент у призупиненому браузері і одразу побачити рекомендований локатор Playwright — з пріоритетом ролі, мітки та test ID над CSS-селекторами. Локатор копіюється в буфер обміну. Це набагато швидше ніж вручну читати DOM або повторно запускати codegen.",
      },
    },
  ],
}
