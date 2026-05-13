import type { PlaywrightTopic } from "../../types"

export const protractorTopic: PlaywrightTopic = {
  slug: "protractor",
  groupId: "migration",
  order: 285,
  level: "advanced",
  trackOrder: 27,
  sourceDoc: "protractor-js.md",
  officialDocsUrl: "https://playwright.dev/docs/protractor",
  title: {
    en: "Migrating from Protractor",
    uk: "Міграція з Protractor",
  },
  summary: {
    en: '- No need for "webdriver-manager" / Selenium. - Protractor’s [ElementFinder] ⇄ [Playwright Test Locator](./api/class-locator) - Protractor’s [`waitForAngular`] ⇄ Playwright Test [auto-waiting](./actionability.md) - Don’t forget to await in Playwright Test',
    uk: "- Не потрібні «webdriver-manager» / Selenium. - [ElementFinder] у Protractor ⇄ [локатор Playwright Test](./api/class-locator) - [`waitForAngular`] у Protractor ⇄ [автоочікування](./actionability.md) у Playwright Test - У Playwright Test не забувайте про `await`",
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
          en: '- No need for "webdriver-manager" / Selenium.\n- Protractor’s [ElementFinder] ⇄ [Playwright Test Locator](./api/class-locator)\n- Protractor’s [`waitForAngular`] ⇄ Playwright Test [auto-waiting](./actionability.md)\n- Don’t forget to await in Playwright Test',
          uk: "- Не потрібні «webdriver-manager» / Selenium.\n- [ElementFinder] у Protractor ⇄ [локатор Playwright Test](./api/class-locator)\n- [`waitForAngular`] у Protractor ⇄ [автоочікування](./actionability.md) у Playwright Test\n- У Playwright Test не забувайте про `await`",
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
          en: "| Protractor                                        | Playwright Test                         |\n|---------------------------------------------------|-----------------------------------------|\n| `element(by.buttonText('...'))`                   | `page.locator('button, input[type=\"button\"], input[type=\"submit\"] >> text=\"...\"')` |\n| `element(by.css('...'))`                          | `page.locator('...')`                   |\n| `element(by.cssContainingText('..1..', '..2..'))` | `page.locator('..1.. >> text=..2..')`   |\n| `element(by.id('...'))`                           | `page.locator('#...')`                  |\n| `element(by.model('...'))`                        | `page.locator('[ng-model=\"...\"]')`      |\n| `element(by.repeater('...'))`                     | `page.locator('[ng-repeat=\"...\"]')`     |\n| `element(by.xpath('...'))`                        | `page.locator('xpath=...')`             |\n| `element.all`                                     | `page.locator`                          |\n| `browser.get(url)`                                | `await page.goto(url)`                  |\n| `browser.getCurrentUrl()`                         | `page.url()`                            |",
          uk: "| Protractor                                        | Playwright Test                         |\n|---------------------------------------------------|-----------------------------------------|\n| `element(by.buttonText('...'))`                   | `page.locator('button, input[type=\"button\"], input[type=\"submit\"] >> text=\"...\"')` |\n| `element(by.css('...'))`                          | `page.locator('...')`                   |\n| `element(by.cssContainingText('..1..', '..2..'))` | `page.locator('..1.. >> text=..2..')`   |\n| `element(by.id('...'))`                           | `page.locator('#...')`                  |\n| `element(by.model('...'))`                        | `page.locator('[ng-model=\"...\"]')`      |\n| `element(by.repeater('...'))`                     | `page.locator('[ng-repeat=\"...\"]')`     |\n| `element(by.xpath('...'))`                        | `page.locator('xpath=...')`             |\n| `element.all`                                     | `page.locator`                          |\n| `browser.get(url)`                                | `await page.goto(url)`                  |\n| `browser.getCurrentUrl()`                         | `page.url()`                            |",
        },
      ],
    },
    {
      id: "example",
      title: {
        en: "Example",
        uk: "Приклад",
      },
      paragraphs: [
        {
          en: "Protractor:",
          uk: "Protractor:",
        },
        {
          en: "Line-by-line migration to Playwright Test:",
          uk: "Покрокова міграція на Playwright Test:",
        },
        {
          en: "Migration highlights (see inline comments in the Playwright Test code snippet):",
          uk: "Ключові моменти міграції (див. вбудовані коментарі у фрагменті коду Playwright Test):",
        },
        {
          en: "1. Each Playwright Test file has explicit import of the `test` and `expect` functions\n1. Test function is marked with `async`\n1. Playwright Test is given a `page` as one of its parameters. This is one of the many [useful fixtures](./api/class-fixtures) in Playwright Test.\n1. Almost all Playwright calls are prefixed with `await`\n1. Locator creation with [`method: Page.locator`] is one of the few methods that is sync.",
          uk: "1. У кожному файлі Playwright Test є явний імпорт функцій `test` та `expect`\n1. Функція тесту позначена як `async`\n1. Playwright Test передає `page` як один із параметрів. Це одна з багатьох [корисних фікстур](./api/class-fixtures) у Playwright Test.\n1. Майже всі виклики Playwright мають префікс `await`\n1. Створення локатора через [`method: Page.locator`] — один із небагатьох синхронних методів.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "describe('angularjs homepage todo list', function() {\n  it('should add a todo', function() {\n    browser.get('https://angularjs.org');\n\n    element(by.model('todoList.todoText')).sendKeys('first test');\n    element(by.css('[value=\"add\"]')).click();\n\n    const todoList = element.all(by.repeater('todo in todoList.todos'));\n    expect(todoList.count()).toEqual(3);\n    expect(todoList.get(2).getText()).toEqual('first test');\n\n    // You wrote your first test, cross it off the list\n    todoList.get(2).element(by.css('input')).click();\n    const completedAmount = element.all(by.css('.done-true'));\n    expect(completedAmount.count()).toEqual(2);\n  });\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "const { test, expect } = require('@playwright/test'); // 1\n\ntest.describe('angularjs homepage todo list', () => {\n  test('should add a todo', async ({ page }) => { // 2, 3\n    await page.goto('https://angularjs.org'); // 4\n\n    await page.locator('[ng-model=\"todoList.todoText\"]').fill('first test');\n    await page.locator('[value=\"add\"]').click();\n\n    const todoList = page.locator('[ng-repeat=\"todo in todoList.todos\"]'); // 5\n    await expect(todoList).toHaveCount(3);\n    await expect(todoList.nth(2)).toHaveText('first test', {\n      useInnerText: true,\n    });\n\n    // You wrote your first test, cross it off the list\n    await todoList.nth(2).getByRole('textbox').click();\n    const completedAmount = page.locator('.done-true');\n    await expect(completedAmount).toHaveCount(2);\n  });\n});",
        },
      ],
    },
    {
      id: "polyfilling-waitforangular",
      title: {
        en: "Polyfilling `waitForAngular`",
        uk: "Поліфіл для `waitForAngular`",
      },
      paragraphs: [
        {
          en: "Playwright Test has built-in [auto-waiting](./actionability.md) that makes protractor's [`waitForAngular`] unneeded in general case.",
          uk: "У Playwright Test є вбудоване [автоочікування](./actionability.md), тож [`waitForAngular`] з Protractor зазвичай не потрібен.",
        },
        {
          en: "However, it might come handy in some edge cases.\nHere's how to polyfill `waitForAngular` function in Playwright Test:",
          uk: "Проте в окремих крайніх випадках він може стати в пригоді.\nОсь як додати поліфіл для `waitForAngular` у Playwright Test:",
        },
        {
          en: "1. Make sure you have protractor installed in your package.json\n1. Polyfill function",
          uk: "1. Переконайтеся, що protractor указаний у вашому `package.json`\n1. Функція-поліфіл",
        },
        {
          en: "If you don't want to keep a version protractor around, you can also use this simpler approach using this function (only works for Angular 2+):\n    \n1. Polyfill usage",
          uk: "Якщо не хочете тримати protractor у залежностях, можна скористатися простішим варіантом цієї функції (лише для Angular 2+):\n    \n1. Використання поліфіла",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "    async function waitForAngular(page) {\n      const clientSideScripts = require('protractor/built/clientsidescripts.js');\n\n      async function executeScriptAsync(page, script, ...scriptArgs) {\n        await page.evaluate(`\n          new Promise((resolve, reject) => {\n            const callback = (errMessage) => {\n              if (errMessage)\n                reject(new Error(errMessage));\n              else\n                resolve();\n            };\n            (function() {${script}}).apply(null, [...${JSON.stringify(scriptArgs)}, callback]);\n          })\n        `);\n      }\n\n      await executeScriptAsync(page, clientSideScripts.waitForAngular, '');\n    }",
        },
        {
          id: "cb-4",
          language: "js",
          code: "    async function waitForAngular(page) {\n      await page.evaluate(async () => {\n        // @ts-expect-error\n        if (window.getAllAngularTestabilities) {\n          // @ts-expect-error\n          await Promise.all(window.getAllAngularTestabilities().map(whenStable));\n          // @ts-expect-error\n          async function whenStable(testability) {\n            return new Promise(res => testability.whenStable(res));\n          }\n        }\n      });\n    }",
        },
        {
          id: "cb-5",
          language: "js",
          code: "    const page = await context.newPage();\n    await page.goto('https://example.org');\n    await waitForAngular(page);",
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
          en: "- Full zero-configuration TypeScript support\n- Run tests across **all web engines** (Chrome, Firefox, Safari) on **any popular operating system** (Windows, macOS, Ubuntu)\n- Full support for multiple origins, [(i)frames](./api/class-frame), [tabs and contexts](./pages)\n- Run tests in parallel across multiple browsers\n- Built-in test [artifact collection](./test-use-options.md#recording-options)",
          uk: "- Повна підтримка TypeScript «з коробки» без додаткової конфігурації\n- Запуск тестів у **всіх основних рушіях** (Chrome, Firefox, Safari) на **будь-якій поширеній ОС** (Windows, macOS, Ubuntu)\n- Повна підтримка кількох origin, [(i)фреймів](./api/class-frame), [вкладок і контекстів](./pages)\n- Паралельний запуск тестів у кількох браузерах\n- Вбудований [збір артефактів](./test-use-options.md#recording-options) тестів",
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
          en: "- [Getting Started](./intro)\n- [Fixtures](./test-fixtures)\n- [Locators](./locators)\n- [Assertions](./test-assertions)\n- [Auto-waiting](./actionability)",
          uk: "- [Початок роботи](./intro)\n- [Фікстури](./test-fixtures)\n- [Локатори](./locators)\n- [Твердження](./test-assertions)\n- [Автоочікування](./actionability)",
        },
        {
          en: "[ElementFinder]: https://www.protractortest.org/#/api?view=ElementFinder\n[`waitForAngular`]: https://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.waitForAngular",
          uk: "[ElementFinder]: https://www.protractortest.org/#/api?view=ElementFinder\n[`waitForAngular`]: https://www.protractortest.org/#/api?view=ProtractorBrowser.prototype.waitForAngular",
        },
      ],
    },
  ],
  quiz: [],
}
