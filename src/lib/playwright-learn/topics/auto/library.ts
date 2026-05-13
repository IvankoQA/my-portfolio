import type { PlaywrightTopic } from "../../types"

export const libraryTopic: PlaywrightTopic = {
  slug: "library",
  groupId: "guides",
  order: 240,
  sourceDoc: "library-js.md",
  officialDocsUrl: "https://playwright.dev/docs/library",
  title: {
    en: "Library",
    uk: "Бібліотека",
  },
  summary: {
    en: "Playwright Library provides unified APIs for launching and interacting with browsers, while Playwright Test provides all this plus a fully managed end-to-end Test Runner and experience.",
    uk: "Playwright Library надає уніфіковані API для запуску браузерів і взаємодії з ними, тоді як Playwright Test додає до цього повністю керований наскрізний Test Runner і весь супутній досвід.",
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
          en: "Playwright Library provides unified APIs for launching and interacting with browsers, while Playwright Test provides all this plus a fully managed end-to-end Test Runner and experience.",
          uk: "Playwright Library надає уніфіковані API для запуску браузерів і взаємодії з ними, тоді як Playwright Test додає до цього повністю керований наскрізний Test Runner і весь супутній досвід.",
        },
        {
          en: "Under most circumstances, for end-to-end testing, you'll want to use `@playwright/test` (Playwright Test), and not `playwright` (Playwright Library) directly. To get started with Playwright Test, follow the [Getting Started Guide](./intro.md).",
          uk: "У більшості випадків для наскрізного тестування варто використовувати `@playwright/test` (Playwright Test), а не напряму пакет `playwright` (Playwright Library). Щоб почати з Playwright Test, дотримуйтесь [посібника «Початок роботи»](./intro.md).",
        },
      ],
    },
    {
      id: "differences-when-using-library",
      title: {
        en: "Differences when using library",
        uk: "Відмінності при використанні бібліотеки",
      },
      paragraphs: [
        {
          en: "### Library Example",
          uk: "### Приклад із бібліотекою",
        },
        {
          en: "The following is an example of using the Playwright Library directly to launch Chromium, go to a page, and check its title:",
          uk: "Нижче — приклад прямого використання Playwright Library: запуск Chromium, перехід на сторінку й перевірка заголовка:",
        },
        {
          en: "Run it with `node my-script.js`.",
          uk: "Запустіть командою `node my-script.js`.",
        },
        {
          en: "### Test Example",
          uk: "### Приклад тесту",
        },
        {
          en: "A test to achieve similar behavior, would look like:",
          uk: "Тест із подібною поведінкою виглядатиме так:",
        },
        {
          en: "Run it with `npx playwright test`.",
          uk: "Запустіть командою `npx playwright test`.",
        },
        {
          en: "### Key Differences",
          uk: "### Ключові відмінності",
        },
        {
          en: "The key differences to note are as follows:",
          uk: "Ось основні відмінності, на які варто звернути увагу:",
        },
        {
          en: "| | Library | Test |\n| - | - | - |\n| Installation | `npm install playwright` | `npm init playwright@latest` - note `install` vs. `init` |\n| Install browsers | Install `@playwright/browser-chromium`, `@playwright/browser-firefox` and/or `@playwright/browser-webkit` | `npx playwright install` or `npx playwright install chromium` for a single one |\n| `import` from | `playwright` | `@playwright/test` |\n| Initialization | Explicitly need to: Pick a browser to use, e.g. `chromium`Launch browser with [`method: BrowserType.launch`]Create a context with [`method: Browser.newContext`], and pass any context options explicitly, e.g. `devices['iPhone 11']`Create a page with [`method: BrowserContext.newPage`] | An isolated `page` and `context` are provided to each test out-of the box, along with other [built-in fixtures](./test-fixtures.md#built-in-fixtures). No explicit creation. If referenced by the test in its arguments, the Test Runner will create them for the test. (i.e. lazy-initialization) |\n| Assertions | No built-in Web-First Assertions | [Web-First assertions](./test-assertions.md) like: [`method: PageAssertions.toHaveTitle`][`method: PageAssertions.toHaveScreenshot#1`] which auto-wait and retry for the condition to be met.|\n| Timeouts | Defaults to 30s for most operations. | Most operations don't time out, but every test has a timeout that makes it fail (30s by default). |\n| Cleanup | Explicitly need to: Close context with [`method: BrowserContext.close`]Close browser with [`method: Browser.close`] | No explicit close of [built-in fixtures](./test-fixtures.md#built-in-fixtures); the Test Runner will take care of it.\n| Running | When using the Library, you run the code as a node script, possibly with some compilation first. | When using the Test Runner, you use the `npx playwright test` command. Along with your [config](./test-configuration.md), the Test Runner handles any compilation and choosing what to run and how to run it. |",
          uk: "| | Бібліотека | Test |\n| - | - | - |\n| Встановлення | `npm install playwright` | `npm init playwright@latest` — зверніть увагу: `install` проти `init` |\n| Встановлення браузерів | Встановіть `@playwright/browser-chromium`, `@playwright/browser-firefox` та/або `@playwright/browser-webkit` | `npx playwright install` або `npx playwright install chromium` для одного браузера |\n| `import` з | `playwright` | `@playwright/test` |\n| Ініціалізація | Явно потрібно: обрати браузер, напр. `chromium`, запустити браузер через [`method: BrowserType.launch`], створити контекст [`method: Browser.newContext`] з явними опціями, напр. `devices['iPhone 11']`, створити сторінку [`method: BrowserContext.newPage`] | Кожному тесту «з коробки» надаються ізольовані `page` та `context` разом із іншими [вбудованими фікстурами](./test-fixtures.md#built-in-fixtures). Явного створення немає. Якщо тест згадує їх у параметрах, Test Runner створить їх для тесту (лінива ініціалізація). |\n| Перевірки (assertions) | Немає вбудованих Web-First Assertions | [Web-First assertions](./test-assertions.md), зокрема [`method: PageAssertions.toHaveTitle`][`method: PageAssertions.toHaveScreenshot#1`], які автоматично чекають і повторюють спробу, доки умова не виконається.|\n| Таймаути | За замовчуванням 30 с для більшості операцій. | Більшість операцій не мають таймауту, але кожен тест має таймаут, після якого він падає (за замовчуванням 30 с). |\n| Завершення | Явно потрібно: закрити контекст через [`method: BrowserContext.close`], закрити браузер через [`method: Browser.close`] | Явного закриття [вбудованих фікстур](./test-fixtures.md#built-in-fixtures) не потрібно — це робить Test Runner.\n| Запуск | З бібліотекою ви запускаєте код як Node.js-скрипт, інколи з попередньою компіляцією. | З Test Runner використовується команда `npx playwright test`. Разом із вашим [конфігом](./test-configuration.md) раннер керує компіляцією, вибором тестів і способом їх запуску. |",
        },
        {
          en: "In addition to the above, Playwright Test, as a full-featured Test Runner, includes:",
          uk: "На додаток до зазначеного Playwright Test як повноцінний Test Runner також містить:",
        },
        {
          en: "- [Configuration Matrix and Projects](./test-configuration.md): In the above example, in the Playwright Library version, if we wanted to run with a different device or browser, we'd have to modify the script and plumb the information through. With Playwright Test, we can just specify the [matrix of configurations](./test-configuration.md) in one place, and it will create run the one test under each of these configurations.\n- [Parallelization](./test-parallel.md)\n- [Web-First Assertions](./test-assertions.md)\n- [Reporting](./test-reporters.md)\n- [Retries](./test-retries.md)\n- [Easily Enabled Tracing](./trace-viewer-intro.md)\n- and more…",
          uk: "- [Матриця конфігурацій і проєкти](./test-configuration.md): у наведеному прикладі з Playwright Library для іншого пристрою чи браузера довелося б змінювати скрипт і протягувати параметри вручну. У Playwright Test достатньо задати [матрицю конфігурацій](./test-configuration.md) в одному місці — і той самий тест виконається для кожної з них.\n- [Паралелізація](./test-parallel.md)\n- [Web-First Assertions](./test-assertions.md)\n- [Звітність](./test-reporters.md)\n- [Повторні спроби](./test-retries.md)\n- [Просте ввімкнення трасування](./trace-viewer-intro.md)\n- та інше…",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\n(async () => {\n  // Setup\n  const browser = await chromium.launch();\n  const context = await browser.newContext(devices['iPhone 11']);\n  const page = await context.newPage();\n\n  // The actual interesting bit\n  await context.route('**.jpg', route => route.abort());\n  await page.goto('https://example.com/');\n\n  assert(await page.title() === 'Example Domain'); // 👎 not a Web First assertion\n\n  // Teardown\n  await context.close();\n  await browser.close();\n})();",
        },
        {
          id: "cb-2",
          language: "js",
          code: "const assert = require('node:assert');\nconst { chromium, devices } = require('playwright');\n\n(async () => {\n  // Setup\n  const browser = await chromium.launch();\n  const context = await browser.newContext(devices['iPhone 11']);\n  const page = await context.newPage();\n\n  // The actual interesting bit\n  await context.route('**.jpg', route => route.abort());\n  await page.goto('https://example.com/');\n\n  assert(await page.title() === 'Example Domain'); // 👎 not a Web First assertion\n\n  // Teardown\n  await context.close();\n  await browser.close();\n})();",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\ntest.use(devices['iPhone 11']);\n\ntest('should be titled', async ({ page, context }) => {\n  await context.route('**.jpg', route => route.abort());\n  await page.goto('https://example.com/');\n\n  await expect(page).toHaveTitle('Example');\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "const { expect, test, devices } = require('@playwright/test');\n\ntest.use(devices['iPhone 11']);\n\ntest('should be titled', async ({ page, context }) => {\n  await context.route('**.jpg', route => route.abort());\n  await page.goto('https://example.com/');\n\n  await expect(page).toHaveTitle('Example');\n});",
        },
      ],
    },
    {
      id: "usage",
      title: {
        en: "Usage",
        uk: "Використання",
      },
      paragraphs: [
        {
          en: "Use npm or Yarn to install Playwright library in your Node.js project. See [system requirements](./intro.md#system-requirements).",
          uk: "Установіть Playwright Library у проєкті Node.js через npm або Yarn. Див. [системні вимоги](./intro.md#system-requirements).",
        },
        {
          en: "You will also need to install browsers - either manually or by adding a package that will do it for you automatically.",
          uk: "Також потрібно встановити браузери — вручну або додавши пакет, який зробить це автоматично.",
        },
        {
          en: "See [managing browsers](./browsers.md#managing-browser-binaries) for more options.",
          uk: "Додаткові варіанти — у розділі [керування браузерами](./browsers.md#managing-browser-binaries).",
        },
        {
          en: "Once installed, you can import Playwright in a Node.js script, and launch any of the 3 browsers (`chromium`, `firefox` and `webkit`).",
          uk: "Після встановлення імпортуйте Playwright у скрипті Node.js і запускайте будь-який із трьох браузерів (`chromium`, `firefox` та `webkit`).",
        },
        {
          en: "Playwright APIs are asynchronous and return Promise objects. Our code examples use [the async/await pattern](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) to ease readability. The code is wrapped in an unnamed async arrow function which is invoking itself.",
          uk: "API Playwright асинхронні й повертають об’єкти Promise. У прикладах ми використовуємо [патерн async/await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) для читабельності. Код обгорнуто в безіменну асинхронну стрілкову функцію, яка одразу викликає сама себе.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "bash",
          code: "npm i -D playwright",
        },
        {
          id: "cb-6",
          language: "bash",
          code: "# Download the Chromium, Firefox and WebKit browser\nnpx playwright install chromium firefox webkit\n\n# Alternatively, add packages that will download a browser upon npm install\nnpm i -D @playwright/browser-chromium @playwright/browser-firefox @playwright/browser-webkit",
        },
        {
          id: "cb-7",
          language: "js",
          code: "const { chromium } = require('playwright');\n\n(async () => {\n  const browser = await chromium.launch();\n  // Create pages, interact with UI elements, assert values\n  await browser.close();\n})();",
        },
        {
          id: "cb-8",
          language: "js",
          code: "(async () => { // Start of async arrow function\n  // Function code\n  // ...\n})(); // End of the function and () to invoke itself",
        },
      ],
    },
    {
      id: "first-script",
      title: {
        en: "First script",
        uk: "Перший скрипт",
      },
      paragraphs: [
        {
          en: "In our first script, we will navigate to `https://playwright.dev/` and take a screenshot in WebKit.",
          uk: "У першому скрипті перейдемо на `https://playwright.dev/` і зробимо знімок екрана в WebKit.",
        },
        {
          en: "By default, Playwright runs the browsers in headless mode. To see the browser UI, pass the `headless: false` flag while launching the browser. You can also use `slowMo` to slow down execution. Learn more in the debugging tools [section](./debug.md).",
          uk: "За замовчуванням Playwright запускає браузери в headless-режимі. Щоб бачити інтерфейс, передайте прапорець `headless: false` під час запуску. Можна також використати `slowMo`, щоб сповільнити виконання. Докладніше в [розділі](./debug.md) про інструменти дебагу.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "js",
          code: "const { webkit } = require('playwright');\n\n(async () => {\n  const browser = await webkit.launch();\n  const page = await browser.newPage();\n  await page.goto('https://playwright.dev/');\n  await page.screenshot({ path: `example.png` });\n  await browser.close();\n})();",
        },
        {
          id: "cb-10",
          language: "js",
          code: "firefox.launch({ headless: false, slowMo: 50 });",
        },
      ],
    },
    {
      id: "record-scripts",
      title: {
        en: "Record scripts",
        uk: "Запис скриптів",
      },
      paragraphs: [
        {
          en: "[Command line tools](./test-cli.md) can be used to record user interactions and generate JavaScript code.",
          uk: "[Інструменти командного рядка](./test-cli.md) дозволяють записувати дії користувача й генерувати код на JavaScript.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "bash",
          code: "npx playwright codegen wikipedia.org",
        },
      ],
    },
    {
      id: "browser-downloads",
      title: {
        en: "Browser downloads",
        uk: "Завантаження браузерів",
      },
      paragraphs: [
        {
          en: "To download Playwright browsers run:",
          uk: "Щоб завантажити браузери Playwright, виконайте:",
        },
        {
          en: "Alternatively, you can add `@playwright/browser-chromium`, `@playwright/browser-firefox` and `@playwright/browser-webkit` packages to automatically download the respective browser during the package installation.",
          uk: "Або додайте пакети `@playwright/browser-chromium`, `@playwright/browser-firefox` та `@playwright/browser-webkit`, щоб відповідний браузер завантажувався під час `npm install`.",
        },
        {
          en: "**Download behind a firewall or a proxy**",
          uk: "**Завантаження за файрволом або через проксі**",
        },
        {
          en: "Pass `HTTPS_PROXY` environment variable to download through a proxy.",
          uk: "Для завантаження через проксі задайте змінну середовища `HTTPS_PROXY`.",
        },
        {
          en: "**Download from artifact repository**",
          uk: "**Завантаження з артефактного сховища**",
        },
        {
          en: "By default, Playwright downloads browsers from Microsoft's CDN. Pass `PLAYWRIGHT_DOWNLOAD_HOST` environment variable to download from an internal artifacts repository instead.",
          uk: "За замовчуванням браузери завантажуються з CDN Microsoft. Щоб брати їх із внутрішнього артефактного репозиторію, задайте `PLAYWRIGHT_DOWNLOAD_HOST`.",
        },
        {
          en: "**Skip browser download**",
          uk: "**Пропустити завантаження браузера**",
        },
        {
          en: "In certain cases, it is desired to avoid browser downloads altogether because browser binaries are managed separately. This can be done by setting `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` variable before installing packages.",
          uk: "Інколи завантаження браузерів не потрібне, бо бінарники керуються окремо. Для цього перед встановленням пакетів задайте `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-12",
          language: "bash",
          code: "# Explicitly download browsers\nnpx playwright install",
        },
        {
          id: "cb-13",
          language: "bash",
          code: "# Use a helper package that downloads a browser on npm install\nnpm install @playwright/browser-chromium",
        },
        {
          id: "cb-14",
          language: "bash",
          code: "# Manual\nHTTPS_PROXY=https://192.0.2.1 npx playwright install\n\n# Through @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\nHTTPS_PROXY=https://192.0.2.1 npm install",
        },
        {
          id: "cb-15",
          language: "batch",
          code: "# Manual\nset HTTPS_PROXY=https://192.0.2.1\nnpx playwright install\n\n# Through @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\nset HTTPS_PROXY=https://192.0.2.1\nnpm install",
        },
        {
          id: "cb-16",
          language: "powershell",
          code: "# Manual\n$Env:HTTPS_PROXY=https://192.0.2.1\nnpx playwright install\n\n# Through @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\n$Env:HTTPS_PROXY=https://192.0.2.1\nnpm install",
        },
        {
          id: "cb-17",
          language: "bash",
          code: "# Manual\nPLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1 npx playwright install\n\n# Through @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\nPLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1 npm install",
        },
        {
          id: "cb-18",
          language: "batch",
          code: "# Manual\nset PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1\nnpx playwright install\n\n# Through @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\nset PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1\nnpm install",
        },
        {
          id: "cb-19",
          language: "powershell",
          code: "# Manual\n$Env:PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1\nnpx playwright install\n\n# Through @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\n$Env:PLAYWRIGHT_DOWNLOAD_HOST=192.0.2.1\nnpm install",
        },
        {
          id: "cb-20",
          language: "bash",
          code: "# When using @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\nPLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install",
        },
        {
          id: "cb-21",
          language: "batch",
          code: "# When using @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\nset PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1\nnpm install",
        },
        {
          id: "cb-22",
          language: "powershell",
          code: "# When using @playwright/browser-chromium, @playwright/browser-firefox\n# and @playwright/browser-webkit helper packages\n$Env:PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1\nnpm install",
        },
      ],
    },
    {
      id: "typescript-support",
      title: {
        en: "TypeScript support",
        uk: "Підтримка TypeScript",
      },
      paragraphs: [
        {
          en: "Playwright includes built-in support for TypeScript. Type definitions will be imported automatically. It is recommended to use type-checking to improve the IDE experience.",
          uk: "Playwright має вбудовану підтримку TypeScript: визначення типів підтягуються автоматично. Рекомендується вмикати перевірку типів для зручнішої роботи в IDE.",
        },
        {
          en: "### In JavaScript\nAdd the following to the top of your JavaScript file to get type-checking in VS Code or WebStorm.",
          uk: "### У JavaScript\nДодайте на початок JS-файлу, щоб увімкнути перевірку типів у VS Code або WebStorm:",
        },
        {
          en: "Alternatively, you can use JSDoc to set types for variables.",
          uk: "Або задайте типи змінних через JSDoc.",
        },
        {
          en: "### In TypeScript\nTypeScript support will work out-of-the-box. Types can also be imported explicitly.",
          uk: "### У TypeScript\nПідтримка TypeScript працює «з коробки». Типи також можна імпортувати явно.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-23",
          language: "js",
          code: "// @ts-check\n// ...",
        },
        {
          id: "cb-24",
          language: "js",
          code: "/** @type {import('playwright').Page} */\nlet page;",
        },
        {
          id: "cb-25",
          language: "js",
          code: "let page: import('playwright').Page;",
        },
      ],
    },
  ],
  quiz: [],
}
