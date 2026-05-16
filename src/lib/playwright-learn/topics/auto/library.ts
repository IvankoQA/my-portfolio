import type { PlaywrightTopic } from "../../types"

export const libraryTopic: PlaywrightTopic = {
  slug: "library",
  groupId: "guides",
  order: 240,
  level: "advanced",
  trackOrder: 12,
  sourceDoc: "library-js.md",
  officialDocsUrl: "https://playwright.dev/docs/library",
  title: {
    en: "Library",
    uk: "Бібліотека",
  },
  summary: {
    en: "There are two Playwright packages: 'playwright' (the library) and '@playwright/test' (the test runner). Unless you're writing a script or a tool that isn't a test suite, always use @playwright/test. It gives you web-first assertions, fixtures, retries, reporters, and automatic cleanup. The library requires you to manage all that yourself.",
    uk: "Є два пакети Playwright: 'playwright' (бібліотека) і '@playwright/test' (тестовий раннер). Якщо ти не пишеш скрипт або інструмент що не є тестовим набором — завжди використовуй @playwright/test. Він дає web-first assertions, фікстури, повтори, репортери і автоматичне прибирання. Бібліотека вимагає керувати всім цим самостійно.",
  },
  sections: [
    {
      id: "library-vs-test",
      title: {
        en: "Library vs @playwright/test — when to use each",
        uk: "Бібліотека vs @playwright/test — коли що використовувати",
      },
      paragraphs: [
        {
          en: "Use the **library** (`playwright` package) when you're writing a Node.js script that automates a browser — web scraping, generating PDFs, automating repetitive tasks. You manage the browser lifecycle manually: launch, create context, create page, do stuff, close everything.",
          uk: "Використовуй **бібліотеку** (пакет `playwright`) коли пишеш Node.js-скрипт що автоматизує браузер — веб-скрейпінг, генерація PDF, автоматизація повторюваних задач. Керуєш lifecycle браузера вручну: запуск, створення context, створення page, робота, закриття всього.",
        },
        {
          en: "Use **@playwright/test** for everything else — e2e tests, component testing, integration tests. It provides isolated page/context per test, automatic cleanup, web-first assertions that auto-retry, fixtures, parallel execution, HTML reports.",
          uk: "Використовуй **@playwright/test** для всього іншого — e2e тести, component testing, integration тести. Він надає ізольовану page/context на кожен тест, автоматичне прибирання, web-first assertions з авто-повтором, фікстури, паралельне виконання, HTML-звіти.",
        },
      ],
    },
    {
      id: "library-example",
      title: {
        en: "Library — everything is manual",
        uk: "Бібліотека — все вручну",
      },
      paragraphs: [
        {
          en: "With the library, I explicitly launch a browser, create a context (with any device emulation settings), create a page, do my work, then close context and browser. If I forget to close, the browser process leaks. No fixtures, no auto-retry assertions — just raw async code.",
          uk: "З бібліотекою явно запускаю браузер, створюю context (з будь-якими налаштуваннями емуляції пристрою), створюю page, виконую роботу, потім закриваю context і браузер. Якщо забуду закрити — процес браузера витікає. Немає фікстур, немає assertions з авто-повтором — просто сирий async-код.",
        },
      ],
      codeBlocks: [
        {
          id: "library-script",
          language: "ts",
          code: `// my-script.ts — використання бібліотеки напряму
import { chromium, devices } from 'playwright'

;(async () => {
  // Явне налаштування
  const browser = await chromium.launch()
  const context = await browser.newContext(devices['iPhone 11'])
  const page = await context.newPage()

  // Робота
  await context.route('**.jpg', route => route.abort())
  await page.goto('https://example.com/')

  const title = await page.title()
  console.assert(title === 'Example Domain')  // ← не Web-First assertion

  // Явне прибирання (забудеш — браузер залишиться відкритим)
  await context.close()
  await browser.close()
})()`,
        },
        {
          id: "run-library",
          language: "bash",
          code: `# Встановлення бібліотеки
npm install playwright

# Запустити скрипт
node my-script.js`,
        },
      ],
    },
    {
      id: "test-runner-example",
      title: {
        en: "@playwright/test — the right way for tests",
        uk: "@playwright/test — правильний спосіб для тестів",
      },
      paragraphs: [
        {
          en: "With the test runner, `page` and `context` are injected as fixtures — created fresh for each test, automatically closed after. `toHaveTitle()` is a web-first assertion: it auto-retries until the condition is met or timeout expires. No manual cleanup needed.",
          uk: "З тестовим раннером `page` і `context` впорскуються як фікстури — створюються свіжими для кожного тесту, автоматично закриваються після. `toHaveTitle()` — web-first assertion: авто-повторюється поки умова не виконається або не спливе тайм-аут. Ручне прибирання не потрібне.",
        },
      ],
      codeBlocks: [
        {
          id: "test-runner-example",
          language: "ts",
          code: `// orders.spec.ts — використання @playwright/test
import { test, expect, devices } from '@playwright/test'

test.use(devices['iPhone 11'])

test('orders page loads', async ({ page, context }) => {
  await context.route('**.jpg', route => route.abort())
  await page.goto('/orders')

  await expect(page).toHaveTitle('Orders')  // ← web-first assertion, авто-повтор
  // page і context автоматично закриваються після тесту
})`,
        },
        {
          id: "run-test-runner",
          language: "bash",
          code: `# Встановлення тестового раннера
npm init playwright@latest

# Запустити тести
npx playwright test`,
        },
      ],
    },
    {
      id: "key-differences",
      title: {
        en: "Key differences side by side",
        uk: "Ключові відмінності поруч",
      },
      paragraphs: [
        {
          en: "The biggest practical differences: assertions and cleanup. With the library, `page.title()` returns a Promise — you check it with `assert()` which doesn't retry. With the test runner, `expect(page).toHaveTitle()` retries automatically. With the library, you must `await context.close()` and `await browser.close()` every time. With the test runner, the framework handles it.",
          uk: "Найбільші практичні відмінності: assertions і прибирання. З бібліотекою `page.title()` повертає Promise — перевіряєш через `assert()` який не повторюється. З тестовим раннером `expect(page).toHaveTitle()` повторюється автоматично. З бібліотекою потрібно `await context.close()` і `await browser.close()` кожного разу. З тестовим раннером фреймворк це обробляє.",
        },
        {
          en: "Other things the test runner adds that the library doesn't have: projects (multi-browser config), retries, reporters (HTML, blob, JUnit), parallel workers, trace recording, fixtures for auth state sharing.",
          uk: "Інші речі які тестовий раннер додає а бібліотека не має: проєкти (мультибраузерна конфігурація), повтори, репортери (HTML, blob, JUnit), паралельні воркери, запис трейсів, фікстури для спільного стану авторизації.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You write a Node.js script that scrapes product prices from a competitor's website every night. Which Playwright package should you use?",
        uk: "Ти пишеш Node.js-скрипт що щовечора скрейпить ціни на товари з сайту конкурента. Який пакет Playwright слід використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "@playwright/test — it works for scripts too",
            uk: "@playwright/test — він працює і для скриптів",
          },
        },
        {
          id: "b",
          label: {
            en: "playwright (the library) — this is an automation script, not a test suite, so the library's manual control is appropriate",
            uk: "playwright (бібліотека) — це скрипт автоматизації а не тестовий набір, тому ручне керування бібліотеки підходить",
          },
        },
        {
          id: "c",
          label: {
            en: "Neither — use Puppeteer for scraping",
            uk: "Ні те ні інше — для скрейпінгу використовуй Puppeteer",
          },
        },
        {
          id: "d",
          label: {
            en: "playwright-core — the minimal package without browser binaries",
            uk: "playwright-core — мінімальний пакет без браузерних бінарників",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A nightly scraping script isn't a test — it doesn't have assertions that should retry, it doesn't produce test reports, and there's no test runner to manage. The `playwright` library package is exactly for this: launch a browser, navigate pages, extract data, close. Using `@playwright/test` for a script works but brings unnecessary overhead (test runner infrastructure, fixtures you don't need). Puppeteer is also fine for scraping but has fewer built-in capabilities than Playwright's browser API.",
        uk: "Нічний скрипт скрейпінгу — не тест: немає assertions що мають повторюватися, немає тест-репортів і немає тестового раннера для керування. Пакет бібліотеки `playwright` якраз для цього: запустити браузер, навігація по сторінках, витягти дані, закрити. Використання `@playwright/test` для скрипту працює але приносить зайві накладні витрати (інфраструктура тестового раннера, фікстури яких не потребуєш). Puppeteer теж підходить для скрейпінгу але має менше вбудованих можливостей ніж браузерний API Playwright.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "In a library script, you create a browser and context, run your code, but forget to call `context.close()` and `browser.close()`. What happens?",
        uk: "У скрипті бібліотеки ти створюєш браузер і контекст, виконуєш код але забуваєш викликати `context.close()` і `browser.close()`. Що відбувається?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Playwright automatically closes the browser when the Node.js process exits",
            uk: "Playwright автоматично закриває браузер при завершенні процесу Node.js",
          },
        },
        {
          id: "b",
          label: {
            en: "The browser process keeps running as a zombie process — consuming memory and file descriptors until the OS kills it",
            uk: "Процес браузера продовжує виконуватися як зомбі-процес, споживаючи пам'ять і файлові дескриптори поки ОС його не вб'є",
          },
        },
        {
          id: "c",
          label: {
            en: "The browser closes after 30 seconds of inactivity",
            uk: "Браузер закривається після 30 секунд неактивності",
          },
        },
        {
          id: "d",
          label: {
            en: "Node.js throws an unhandled rejection error on process exit",
            uk: "Node.js кидає помилку unhandled rejection при виході з процесу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Browser processes are separate from the Node.js process. When your script ends, Node.js exits but the browser subprocess lingers. On most operating systems it eventually gets cleaned up when the OS detects the parent process is gone, but this is non-deterministic and can cause resource leaks in long-running systems. The solution: always use a `try/finally` block — put `await browser.close()` in `finally` so it runs even if the script throws. With `@playwright/test`, fixture teardown handles this automatically.",
        uk: "Процеси браузера відокремлені від процесу Node.js. Коли скрипт завершується — Node.js виходить але підпроцес браузера залишається. На більшості операційних систем він зрештою прибирається коли ОС виявляє що батьківський процес зник, але це недетерміновано і може спричиняти витоки ресурсів у довгоживучих системах. Рішення: завжди використовуй блок `try/finally` — розміщуй `await browser.close()` в `finally` щоб він виконувався навіть якщо скрипт кидає виняток. З `@playwright/test` teardown фікстур обробляє це автоматично.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "In a library script you use `console.assert(title === 'Example')`. In @playwright/test you use `await expect(page).toHaveTitle('Example')`. What's the key behavioral difference?",
        uk: "У скрипті бібліотеки використовуєш `console.assert(title === 'Example')`. У @playwright/test використовуєш `await expect(page).toHaveTitle('Example')`. Яка ключова поведінкова відмінність?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "console.assert throws an error; expect().toHaveTitle() logs a warning",
            uk: "console.assert кидає помилку; expect().toHaveTitle() логує попередження",
          },
        },
        {
          id: "b",
          label: {
            en: "expect().toHaveTitle() auto-retries — if the page title isn't ready yet it keeps checking until timeout; console.assert checks once and either passes or fails immediately",
            uk: "expect().toHaveTitle() авто-повторюється — якщо заголовок сторінки ще не готовий продовжує перевіряти до тайм-ауту; console.assert перевіряє один раз і або проходить або відразу падає",
          },
        },
        {
          id: "c",
          label: {
            en: "Only the format of the error message is different — both check the condition once",
            uk: "Відрізняється лише формат повідомлення про помилку — обидва перевіряють умову один раз",
          },
        },
        {
          id: "d",
          label: {
            en: "console.assert works synchronously; toHaveTitle is async only because of the await keyword",
            uk: "console.assert працює синхронно; toHaveTitle асинхронний лише через ключове слово await",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Web-first assertions in `@playwright/test` (like `toHaveTitle`, `toBeVisible`, `toHaveText`) automatically retry by polling until the condition is true or the timeout expires. This is fundamental for testing async UIs — the page might not have loaded the title yet when the assertion first runs. `console.assert` and Node.js `assert` are synchronous, single-check assertions. `page.title()` returns a Promise, but reading it once may give the old or empty title if the page is still navigating.",
        uk: "Web-first assertions у `@playwright/test` (як `toHaveTitle`, `toBeVisible`, `toHaveText`) автоматично повторюються опитуванням поки умова не буде правдивою або не спливе тайм-аут. Це фундаментально для тестування async UI — сторінка може ще не завантажити заголовок коли assertion запускається вперше. `console.assert` і Node.js `assert` — синхронні одноразові assertions. `page.title()` повертає Promise але одноразове читання може дати старий або порожній заголовок якщо сторінка ще навігується.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You're building a browser automation tool for your team — not a test suite, but a tool that automates repetitive browser workflows. Which package is more appropriate?",
        uk: "Ти будуєш інструмент браузерної автоматизації для своєї команди — не тестовий набір, а інструмент що автоматизує повторювані браузерні workflow. Який пакет більш підходить?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "@playwright/test — the test runner provides useful infrastructure",
            uk: "@playwright/test — тестовий раннер забезпечує корисну інфраструктуру",
          },
        },
        {
          id: "b",
          label: {
            en: "playwright (library) — automation tools, scripts, and non-test browser work are the library's primary use case",
            uk: "playwright (бібліотека) — інструменти автоматизації, скрипти і браузерна робота без тестів є основним кейсом використання бібліотеки",
          },
        },
        {
          id: "c",
          label: {
            en: "Either is fine — they have identical APIs for browser control",
            uk: "Будь-який підходить — вони мають ідентичні API для керування браузером",
          },
        },
        {
          id: "d",
          label: {
            en: "playwright-core — it has the lowest overhead for production automation tools",
            uk: "playwright-core — він має найменші накладні витрати для продакшн інструментів автоматизації",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `playwright` library package is designed for automation beyond testing: scraping, form automation, PDF generation, workflow automation. It gives you full control over the browser lifecycle without test runner concepts (test cases, suites, reporters, fixtures). `@playwright/test` is optimized for writing and running test suites — its `test()` function, `expect` assertions, and fixture injection don't translate well to one-off automation scripts. Both have the same underlying browser control API, but the library is the cleaner choice for non-test automation.",
        uk: "Пакет бібліотеки `playwright` розроблений для автоматизації поза тестуванням: скрейпінг, автоматизація форм, генерація PDF, автоматизація workflow. Він дає повний контроль над lifecycle браузера без концепцій тестового раннера (тестові кейси, набори, репортери, фікстури). `@playwright/test` оптимізований для написання і запуску тестових наборів — його функція `test()`, assertions `expect` і впорскування фікстур погано перекладаються на одноразові скрипти автоматизації. Обидва мають той самий базовий API керування браузером але бібліотека — чистіший вибір для нетестової автоматизації.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does `@playwright/test` add on top of the `playwright` library that you'd have to build yourself with the library?",
        uk: "Що `@playwright/test` додає понад бібліотеку `playwright`, що тобі довелося б будувати самостійно з бібліотекою?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The browser API — page.click(), page.goto(), locators",
            uk: "Браузерний API — page.click(), page.goto(), локатори",
          },
        },
        {
          id: "b",
          label: {
            en: "Test isolation (fresh page/context per test), web-first assertions, retries, parallel workers, fixture system, reporters, and automatic cleanup",
            uk: "Ізоляція тестів (свіжа page/context для кожного тесту), web-first assertions, повтори, паралельні воркери, система фікстур, репортери і автоматичне прибирання",
          },
        },
        {
          id: "c",
          label: {
            en: "TypeScript support — the library only works with JavaScript",
            uk: "Підтримка TypeScript — бібліотека працює лише з JavaScript",
          },
        },
        {
          id: "d",
          label: {
            en: "Multi-browser support — the library can only use Chromium",
            uk: "Підтримка кількох браузерів — бібліотека може використовувати лише Chromium",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "@playwright/test wraps the library with a full test infrastructure layer. The key additions: each test gets its own `page` and `context` created fresh and cleaned up automatically (no shared state between tests). `expect(locator).toBeVisible()` retries automatically. The fixture system allows sharing setup/teardown code. Multiple workers run tests in parallel. `playwright.config.ts` defines projects for cross-browser runs. HTML, blob, and JUnit reporters format results. None of this exists in the raw library.",
        uk: "@playwright/test обгортає бібліотеку повним шаром тестової інфраструктури. Ключові доповнення: кожен тест отримує власну `page` і `context` що створюються свіжими і автоматично прибираються (жодного спільного стану між тестами). `expect(locator).toBeVisible()` повторюється автоматично. Система фікстур дозволяє спільне використання коду setup/teardown. Кілька воркерів запускають тести паралельно. `playwright.config.ts` визначає проєкти для міжбраузерних запусків. HTML, blob і JUnit репортери форматують результати. Нічого з цього немає в сирій бібліотеці.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "In the library, you call `chromium.launch()` without any options. What type of browser does this start?",
        uk: "У бібліотеці викликаєш `chromium.launch()` без жодних опцій. Який тип браузера це запускає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The system-installed Chrome browser",
            uk: "Системно встановлений браузер Chrome",
          },
        },
        {
          id: "b",
          label: {
            en: "A headless Chromium browser — no visible window, optimized for automation",
            uk: "Безголовий браузер Chromium — без видимого вікна, оптимізований для автоматизації",
          },
        },
        {
          id: "c",
          label: {
            en: "A headful Chromium browser with a visible window",
            uk: "Повноцінний браузер Chromium з видимим вікном",
          },
        },
        {
          id: "d",
          label: {
            en: "It depends on the operating system — macOS uses Safari, Linux uses headless Chromium",
            uk: "Залежить від операційної системи — macOS використовує Safari, Linux використовує headless Chromium",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`chromium.launch()` starts a headless Chromium browser by default — no window, no GUI. This is ideal for servers, CI, and scripts that don't need visual output. To see the browser window (for development and debugging), pass `{ headless: false }`. The library always uses Playwright's own Chromium build (installed by `npm install playwright`), not the system Chrome unless you specify `channel: 'chrome'` in the launch options.",
        uk: "`chromium.launch()` за замовчуванням запускає безголовий браузер Chromium — без вікна, без GUI. Ідеально для серверів, CI і скриптів що не потребують візуального виводу. Щоб побачити вікно браузера (для розробки і дебагу) — передай `{ headless: false }`. Бібліотека завжди використовує власну збірку Chromium Playwright (встановлену через `npm install playwright`), а не системний Chrome якщо не вказати `channel: 'chrome'` в опціях запуску.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you install the `playwright` library (not the test runner) and its browsers?",
        uk: "Як встановити бібліотеку `playwright` (не тестовий раннер) і її браузери?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npm init playwright@latest — the same setup command as the test runner",
            uk: "npm init playwright@latest — та сама команда налаштування що й у тестового раннера",
          },
        },
        {
          id: "b",
          label: {
            en: "npm install playwright, then npx playwright install — install the package then download browser binaries separately",
            uk: "npm install playwright, потім npx playwright install — встанови пакет потім окремо завантаж бінарники браузерів",
          },
        },
        {
          id: "c",
          label: {
            en: "npm install playwright-chromium — a dedicated package that includes the browser",
            uk: "npm install playwright-chromium — спеціальний пакет що включає браузер",
          },
        },
        {
          id: "d",
          label: {
            en: "npm install playwright — browsers are bundled and installed automatically",
            uk: "npm install playwright — браузери bundled і встановлюються автоматично",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`npm install playwright` installs the library package but does NOT download browser binaries — browser downloads are intentionally separated for size reasons. You then run `npx playwright install` to download the bundled Chromium, Firefox, and WebKit. To download only Chromium: `npx playwright install chromium`. `npm init playwright@latest` sets up `@playwright/test` with a config, tests directory, and CI workflow — not for a library-only script.",
        uk: "`npm install playwright` встановлює пакет бібліотеки але НЕ завантажує бінарники браузерів — завантаження браузерів навмисно відокремлено з міркувань розміру. Потім запускаєш `npx playwright install` щоб завантажити збандлений Chromium, Firefox і WebKit. Щоб завантажити лише Chromium: `npx playwright install chromium`. `npm init playwright@latest` налаштовує `@playwright/test` з конфігом, текою тестів і CI workflow — не для скрипту що використовує лише бібліотеку.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "A colleague suggests using `@playwright/test` for your automation script because 'the test runner has better error messages'. Is this a good reason?",
        uk: "Колега пропонує використовувати `@playwright/test` для твого скрипту автоматизації бо 'тестовий раннер має кращі повідомлення про помилки'. Це вагомий привід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Yes — better error messages alone justify using the test runner for any browser automation",
            uk: "Так — кращі повідомлення про помилки самі по собі виправдовують використання тестового раннера для будь-якої браузерної автоматизації",
          },
        },
        {
          id: "b",
          label: {
            en: "Partially — web-first assertions do have better error messages, but they come with test runner overhead. If the script genuinely benefits from assertions like toBeVisible(), it may be worth using @playwright/test",
            uk: "Частково — web-first assertions справді мають кращі повідомлення про помилки але вони йдуть з накладними витратами тестового раннера. Якщо скрипт реально отримує користь від assertions як toBeVisible() — може бути варто використовувати @playwright/test",
          },
        },
        {
          id: "c",
          label: {
            en: "No — error messages are identical between library and test runner",
            uk: "Ні — повідомлення про помилки ідентичні між бібліотекою і тестовим раннером",
          },
        },
        {
          id: "d",
          label: {
            en: "No — the library has all the same assertion utilities through the expect API",
            uk: "Ні — бібліотека має всі ті ж утиліти assertions через expect API",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The error messages for web-first assertions in `@playwright/test` ARE better — they show retry attempts, the expected vs actual state, and a helpful locator description. If your script's correctness depends on checking page state (e.g., 'wait for the order to appear before scraping'), the assertion infrastructure is genuinely useful. The question is proportionality: wrapping a 30-line scraping script in a `test()` function adds conceptual overhead without clear gain. For complex automation that needs retrying condition checks, `@playwright/test` becomes more justified.",
        uk: "Повідомлення про помилки для web-first assertions у `@playwright/test` СПРАВДІ кращі — вони показують спроби повтору, очікуваний проти фактичного стану і корисний опис локатора. Якщо коректність скрипту залежить від перевірки стану сторінки (наприклад 'дочекатися появи замовлення перед скрейпінгом') — інфраструктура assertions реально корисна. Питання в пропорційності: обгортання 30-рядкового скрипту скрейпінгу у функцію `test()` додає концептуальні накладні витрати без явної користі. Для складної автоматизації що потребує повторних перевірок умов — `@playwright/test` стає більш виправданим.",
      },
    },
  ],
}
