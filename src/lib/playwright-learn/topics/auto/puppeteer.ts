import type { PlaywrightTopic } from "../../types"

export const puppeteerTopic: PlaywrightTopic = {
  slug: "puppeteer",
  groupId: "migration",
  order: 290,
  sourceDoc: "puppeteer-js.md",
  officialDocsUrl: "https://playwright.dev/docs/puppeteer",
  title: {
    en: "Migrating from Puppeteer",
    uk: "Міграція з Puppeteer",
  },
  summary: {
    en: "This guide describes migration to [Playwright Library](./library) and [Playwright Test](./intro.md) from Puppeteer. The APIs have similarities, but Playwright offers much more possibilities for web testing and cross-browser automation.",
    uk: "Цей посібник описує міграцію з Puppeteer на [Playwright Library](./library) та [Playwright Test](./intro.md). API схожі, але Playwright дає набагато більше можливостей для вебтестування та кросбраузерної автоматизації.",
  },
  sections: [
    {
      id: "migration-principles",
      title: {
        en: "Migration Principles",
        uk: "Принципи міграції",
      },
      paragraphs: [
        {
          en: "This guide describes migration to [Playwright Library](./library) and [Playwright Test](./intro.md) from Puppeteer. The APIs have similarities, but Playwright offers much more possibilities for web testing and cross-browser automation.",
          uk: "Цей посібник описує міграцію з Puppeteer на [Playwright Library](./library) та [Playwright Test](./intro.md). API схожі, але Playwright дає набагато більше можливостей для вебтестування та кросбраузерної автоматизації.",
        },
        {
          en: "- Most Puppeteer APIs can be used as is\n- The use of [ElementHandle] is discouraged, use [Locator] objects and web-first assertions instead.\n- Playwright is cross-browser\n- You probably don't need explicit wait",
          uk: "- Більшість API Puppeteer можна використовувати як є\n- Використання [ElementHandle] не рекомендується; натомість застосовуйте об’єкти [Locator] і web-first assertions\n- Playwright — кросбраузерний\n- Явні очікування, ймовірно, не знадобляться",
        },
      ],
    },
    {
      id: "cheat-sheet",
      title: {
        en: "Cheat Sheet",
        uk: "Шпаргалка",
      },
      paragraphs: [
        {
          en: "| Puppeteer                                          | Playwright Library                          |\n|----------------------------------------------------|---------------------------------------------|\n| `await puppeteer.launch()`                         | `await playwright.chromium.launch()`        |\n| `puppeteer.launch({product: 'firefox'})`           | `await playwright.firefox.launch()`         |\n|  WebKit is not supported by Puppeteer              | `await playwright.webkit.launch()`          |\n| `await browser.createIncognitoBrowserContext(...)` | `await browser.newContext(...)`             |\n| `await page.setViewport(...)`                      | `await page.setViewportSize(...)`           |\n| `await page.waitForXPath(XPathSelector)`           | `await page.waitForSelector(XPathSelector)` |\n| `await page.waitForNetworkIdle(...)`               | `await page.waitForLoadState('networkidle')` |\n| `await page.$eval(...)`                            | [Assertions](./test-assertions) can often be used instead to verify text, attribute, class... |\n| `await page.$(...)`                                | Discouraged, use [Locators](./api/class-locator) instead |\n| `await page.$x(xpath_selector)`                    | Discouraged, use [Locators](./api/class-locator) instead |\n| No methods dedicated to checkbox or radio input    | `await page.locator(selector).check()``await page.locator(selector).uncheck()` |\n| `await page.click(selector)`                       | `await page.locator(selector).click()`      |\n| `await page.focus(selector)`                       | `await page.locator(selector).focus()`      |\n| `await page.hover(selector)`                       | `await page.locator(selector).hover()`      |\n| `await page.select(selector, values)`              | `await page.locator(selector).selectOption(values)` |\n| `await page.tap(selector)`                         | `await page.locator(selector).tap()`        |\n| `await page.type(selector, ...)`                   | `await page.locator(selector).fill(...)` |\n| `await page.waitForFileChooser(...)``await elementHandle.uploadFile(...)` | `await page.locator(selector).setInputFiles(...)` |\n| `await page.cookies([...urls])`                    | `await browserContext.cookies([urls])`      |\n| `await page.deleteCookie(...cookies)`              | `await browserContext.clearCookies()`       |\n| `await page.setCookie(...cookies)`                 | `await browserContext.addCookies(cookies)`  |\n| `page.on(...)`                                     | `page.on(...)`In order to intercept and mutate requests, see [`method: Page.route`] |",
          uk: "| Puppeteer                                          | Playwright Library                          |\n|----------------------------------------------------|---------------------------------------------|\n| `await puppeteer.launch()`                         | `await playwright.chromium.launch()`        |\n| `puppeteer.launch({product: 'firefox'})`           | `await playwright.firefox.launch()`         |\n|  WebKit is not supported by Puppeteer              | `await playwright.webkit.launch()`          |\n| `await browser.createIncognitoBrowserContext(...)` | `await browser.newContext(...)`             |\n| `await page.setViewport(...)`                      | `await page.setViewportSize(...)`           |\n| `await page.waitForXPath(XPathSelector)`           | `await page.waitForSelector(XPathSelector)` |\n| `await page.waitForNetworkIdle(...)`               | `await page.waitForLoadState('networkidle')` |\n| `await page.$eval(...)`                            | [Assertions](./test-assertions) can often be used instead to verify text, attribute, class... |\n| `await page.$(...)`                                | Discouraged, use [Locators](./api/class-locator) instead |\n| `await page.$x(xpath_selector)`                    | Discouraged, use [Locators](./api/class-locator) instead |\n| No methods dedicated to checkbox or radio input    | `await page.locator(selector).check()``await page.locator(selector).uncheck()` |\n| `await page.click(selector)`                       | `await page.locator(selector).click()`      |\n| `await page.focus(selector)`                       | `await page.locator(selector).focus()`      |\n| `await page.hover(selector)`                       | `await page.locator(selector).hover()`      |\n| `await page.select(selector, values)`              | `await page.locator(selector).selectOption(values)` |\n| `await page.tap(selector)`                         | `await page.locator(selector).tap()`        |\n| `await page.type(selector, ...)`                   | `await page.locator(selector).fill(...)` |\n| `await page.waitForFileChooser(...)``await elementHandle.uploadFile(...)` | `await page.locator(selector).setInputFiles(...)` |\n| `await page.cookies([...urls])`                    | `await browserContext.cookies([urls])`      |\n| `await page.deleteCookie(...cookies)`              | `await browserContext.clearCookies()`       |\n| `await page.setCookie(...cookies)`                 | `await browserContext.addCookies(cookies)`  |\n| `page.on(...)`                                     | `page.on(...)`In order to intercept and mutate requests, see [`method: Page.route`] |",
        },
        {
          en: "`page.waitForNavigation` and `page.waitForSelector` remain, but in many cases will not be necessary due to [auto-waiting](./actionability).",
          uk: "`page.waitForNavigation` і `page.waitForSelector` лишаються, але в багатьох випадках не знадобляться завдяки [автоочікуванню](./actionability).",
        },
        {
          en: "The use of [ElementHandle] is discouraged, use [Locator] objects and web-first assertions instead.",
          uk: "Використання [ElementHandle] не рекомендується; натомість застосовуйте об’єкти [Locator] і web-first assertions.",
        },
        {
          en: "Locators are the central piece of Playwright's auto-waiting and retry-ability. Locators are strict. This means that all operations on locators that imply some target DOM element will throw an exception if more than one element matches a given selector.",
          uk: "Локатори — центральна частина автоочікування та повторних спроб у Playwright. Локатори суворі: будь-яка операція, що передбачає один цільовий елемент DOM, кине виняток, якщо селектору відповідає більше одного елемента.",
        },
      ],
    },
    {
      id: "examples",
      title: {
        en: "Examples",
        uk: "Приклади",
      },
      paragraphs: [
        {
          en: "### Automation example",
          uk: "### Приклад автоматизації",
        },
        {
          en: "Puppeteer:",
          uk: "Puppeteer:",
        },
        {
          en: "Line-by-line migration to Playwright:",
          uk: "Покрокова міграція на Playwright:",
        },
        {
          en: "Migration highlights (see inline comments in the Playwright code snippet):",
          uk: "Ключові моменти міграції (див. вбудовані коментарі у фрагменті коду Playwright):",
        },
        {
          en: "1. Each Playwright Library file has explicit import of `chromium`. Other browsers `webkit` or `firefox` can be used.\n1. For browser state isolation, consider [browser contexts](./browser-contexts.md)\n1. `setViewport` becomes `setViewportSize`\n1. `networkidle2` becomes `networkidle`. Please note that in most cases it is not useful, thanks to auto-waiting.",
          uk: "1. У кожному файлі Playwright Library є явний імпорт `chromium`; можна використовувати `webkit` або `firefox`\n1. Для ізоляції стану браузера розгляньте [контексти браузера](./browser-contexts.md)\n1. `setViewport` замінюється на `setViewportSize`\n1. `networkidle2` стає `networkidle`; зазвичай це мало користі завдяки автоочікуванню",
        },
        {
          en: "### Test example",
          uk: "### Приклад тесту",
        },
        {
          en: "Puppeteer with Jest:",
          uk: "Puppeteer з Jest:",
        },
        {
          en: "Line-by-line migration to Playwright Test:",
          uk: "Покрокова міграція на Playwright Test:",
        },
        {
          en: "1. Each Playwright Test file has explicit import of the `test` and `expect` functions\n1. Test function is marked with `async`\n1. Playwright Test is given a `page` as one of its parameters. This is one of the many [useful fixtures](./api/class-fixtures) in Playwright Test.\nPlaywright Test creates an isolated [Page] object for each test. However, if you'd like to reuse a single [Page] object between multiple tests, you can create your own in [`method: Test.beforeAll`] and close it in [`method: Test.afterAll`].\n1. Locator creation with [`method: Page.locator`] is one of the few methods that is sync.\n1. Use [assertions](./test-assertions) to verify the state instead of `page.$eval()`.",
          uk: "1. У кожному файлі Playwright Test є явний імпорт функцій `test` та `expect`\n1. Функція тесту позначена як `async`\n1. Playwright Test передає `page` як один із параметрів — це одна з багатьох [корисних фікстур](./api/class-fixtures).\nPlaywright Test створює ізольований об’єкт [Page] для кожного тесту. Якщо ж потрібно перевикористати один [Page] між кількома тестами, створіть його у [`method: Test.beforeAll`] і закрийте в [`method: Test.afterAll`].\n1. Створення локатора через [`method: Page.locator`] — один із небагатьох синхронних методів.\n1. Для перевірки стану використовуйте [assertions](./test-assertions) замість `page.$eval()`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "const puppeteer = require('puppeteer');\n\n(async () => {\n  const browser = await puppeteer.launch();\n  const page = await browser.newPage();\n  await page.setViewport({ width: 1280, height: 800 });\n  await page.goto('https://playwright.dev/', {\n    waitUntil: 'networkidle2',\n  });\n  await page.screenshot({ path: 'example.png' });\n  await browser.close();\n})();",
        },
        {
          id: "cb-2",
          language: "js",
          code: "const { chromium } = require('playwright'); // 1\n\n(async () => {\n  const browser = await chromium.launch();\n  const page = await browser.newPage(); // 2\n  await page.setViewportSize({ width: 1280, height: 800 }); // 3\n  await page.goto('https://playwright.dev/', {\n    waitUntil: 'networkidle', // 4\n  });\n  await page.screenshot({ path: 'example.png' });\n  await browser.close();\n})();",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\ndescribe('Playwright homepage', () => {\n  let browser;\n  let page;\n\n  beforeAll(async () => {\n    browser = await puppeteer.launch();\n    page = await browser.newPage();\n  });\n\n  it('contains hero title', async () => {\n    await page.goto('https://playwright.dev/');\n    await page.waitForSelector('.hero__title');\n    const text = await page.$eval('.hero__title', e => e.textContent);\n    expect(text).toContain('Playwright enables reliable end-to-end testing'); // 5\n  });\n\n  afterAll(() => browser.close());\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "\ntest.describe('Playwright homepage', () => {\n  test('contains hero title', async ({ page }) => { // 2, 3\n    await page.goto('https://playwright.dev/');\n    const titleLocator = page.locator('.hero__title'); // 4\n    await expect(titleLocator).toContainText( // 5\n        'Playwright enables reliable end-to-end testing'\n    );\n  });\n});",
        },
      ],
    },
    {
      id: "testing",
      title: {
        en: "Testing",
        uk: "Тестування",
      },
      paragraphs: [
        {
          en: "To improve testing, it is advised to use [Locators](./api/class-locator) and web-first [Assertions](./test-assertions). See [Writing Tests](./writing-tests)",
          uk: "Щоб покращити тести, радимо використовувати [локатори](./api/class-locator) і web-first [Assertions](./test-assertions). Див. [Написання тестів](./writing-tests)",
        },
        {
          en: "It is common with Puppeteer to use `page.evaluate()` or `page.$eval()` to inspect an [ElementHandle] and extract the value of text content, attribute, class... Web-first [Assertions](./test-assertions) offers several matchers for this purpose, it is more reliable and readable.",
          uk: "У Puppeteer часто використовують `page.evaluate()` або `page.$eval()`, щоб перевірити [ElementHandle] й отримати текст, атрибут, клас тощо. Web-first [Assertions](./test-assertions) дає зручні матчери для цього — надійніше й читабельніше.",
        },
        {
          en: "[Playwright Test](./intro.md) is our first-party recommended test runner to be used with Playwright. It provides several features like Page Object Model, parallelism, fixtures or reporters.",
          uk: "[Playwright Test](./intro.md) — наш офіційний рекомендований раннер для Playwright з підтримкою Page Object Model, паралелізму, фікстур і репортерів.",
        },
      ],
    },
    {
      id: "playwright-test-super-powers",
      title: {
        en: "Playwright Test Super Powers",
        uk: "Суперможливості Playwright Test",
      },
      paragraphs: [
        {
          en: "Once you're on Playwright Test, you get a lot!",
          uk: "Перейшовши на Playwright Test, ви отримуєте дуже багато!",
        },
        {
          en: "- Full zero-configuration TypeScript support\n- Run tests across **all web engines** (Chrome, Firefox, Safari) on **any popular operating system** (Windows, macOS, Ubuntu)\n- Full support for multiple origins, [(i)frames](./api/class-frame), [tabs and contexts](./pages)\n- Run tests in isolation in parallel across multiple browsers\n- Built-in test [artifact collection](./test-use-options.md#recording-options)",
          uk: "- Повна підтримка TypeScript «з коробки» без додаткової конфігурації\n- Запуск тестів у **всіх основних рушіях** (Chrome, Firefox, Safari) на **будь-якій поширеній ОС** (Windows, macOS, Ubuntu)\n- Повна підтримка кількох origin, [(i)фреймів](./api/class-frame), [вкладок і контекстів](./pages)\n- Ізольований паралельний запуск тестів у кількох браузерах\n- Вбудований [збір артефактів](./test-use-options.md#recording-options) тестів",
        },
        {
          en: "You also get all these ✨ awesome tools ✨ that come bundled with Playwright Test:\n- [Playwright Inspector](./debug.md)\n- [Playwright Test Code generation](./codegen-intro.md)\n- [Playwright Tracing](./trace-viewer.md) for post-mortem debugging",
          uk: "Також ви отримуєте ✨ чудові інструменти ✨ разом із Playwright Test:\n- [Playwright Inspector](./debug.md)\n- [генерацію коду Playwright Test](./codegen-intro.md)\n- [Playwright Tracing](./trace-viewer.md) для дебагу після збою",
        },
      ],
    },
    {
      id: "further-reading",
      title: {
        en: "Further Reading",
        uk: "Додаткові матеріали",
      },
      paragraphs: [
        {
          en: "Learn more about Playwright Test runner:",
          uk: "Дізнайтеся більше про раннер Playwright Test:",
        },
        {
          en: "- [Getting Started](./intro)\n- [Fixtures](./test-fixtures)\n- [Locators](./locators.md)\n- [Assertions](./test-assertions)\n- [Auto-waiting](./actionability)",
          uk: "- [Початок роботи](./intro)\n- [Фікстури](./test-fixtures)\n- [Локатори](./locators.md)\n- [Твердження](./test-assertions)\n- [Автоочікування](./actionability)",
        },
      ],
    },
  ],
  quiz: [],
}
