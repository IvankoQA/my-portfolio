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
    en: "Coming from Protractor, three main wins: no webdriver-manager or Selenium to install, waitForAngular is replaced by auto-waiting built into every Playwright action, and you get cross-browser testing (Firefox, WebKit) out of the box. The cheat sheet: element(by.model('x')) becomes page.locator('[ng-model=\"x\"]'), element(by.repeater('x')) becomes page.locator('[ng-repeat=\"x\"]'), and almost every call needs await.",
    uk: "Прийшовши з Protractor — три головних плюси: не потрібні webdriver-manager і Selenium, waitForAngular замінено вбудованим auto-waiting у кожній Playwright-дії, і кросбраузерне тестування (Firefox, WebKit) з коробки. Шпаргалка: element(by.model('x')) стає page.locator('[ng-model=\"x\"]'), element(by.repeater('x')) стає page.locator('[ng-repeat=\"x\"]'), і майже кожен виклик потребує await.",
  },
  sections: [
    {
      id: "migration-principles",
      title: {
        en: "Key differences from Protractor",
        uk: "Ключові відмінності від Protractor",
      },
      paragraphs: [
        {
          en: "Four things to know before starting migration:\n- **No Selenium/webdriver-manager** — Playwright manages browsers directly via CDP and WebKit protocol. No separate server process to run.\n- **ElementFinder → Locator** — Protractor's `element(by.*)` returns an ElementFinder. Playwright's equivalent is a Locator — it's lazy and re-queries the DOM on every action, so it doesn't go stale.\n- **waitForAngular → auto-waiting** — Playwright waits for elements to be actionable before every `.click()`, `.fill()`, and assertion. I almost never need explicit waits.\n- **Every call needs await** — Protractor had a control flow that handled async implicitly. In Playwright, every action and most assertions are async — add `await` everywhere.",
          uk: "Чотири речі що треба знати перед початком міграції:\n- **Без Selenium/webdriver-manager** — Playwright управляє браузерами напряму через CDP і WebKit protocol. Немає окремого серверного процесу для запуску.\n- **ElementFinder → Locator** — `element(by.*)` Protractor повертає ElementFinder. Еквівалент у Playwright — Locator — він ледачий і повторно запитує DOM при кожній дії, тому не застаріває.\n- **waitForAngular → auto-waiting** — Playwright чекає щоб елементи були actionable перед кожним `.click()`, `.fill()` і assertion. Явні очікування майже ніколи не потрібні.\n- **Кожен виклик потребує await** — Protractor мав control flow що неявно обробляв async. У Playwright кожна дія і більшість assertions є async — додавай `await` скрізь.",
        },
      ],
    },
    {
      id: "cheat-sheet",
      title: {
        en: "Quick reference",
        uk: "Швидка довідка",
      },
      paragraphs: [
        {
          en: "| Protractor | Playwright |\n|---|---|\n| `element(by.buttonText('...'))` | `page.locator('button, input[type=\"submit\"] >> text=\"...\"')` |\n| `element(by.css('...'))` | `page.locator('...')` |\n| `element(by.cssContainingText('..1..', '..2..'))` | `page.locator('..1.. >> text=..2..')` |\n| `element(by.id('...'))` | `page.locator('#...')` |\n| `element(by.model('...'))` | `page.locator('[ng-model=\"...\"]')` |\n| `element(by.repeater('...'))` | `page.locator('[ng-repeat=\"...\"]')` |\n| `element(by.xpath('...'))` | `page.locator('xpath=...')` |\n| `element.all(by.*)` | `page.locator(...)` (returns all by default) |\n| `browser.get(url)` | `await page.goto(url)` |\n| `browser.getCurrentUrl()` | `page.url()` |",
          uk: "| Protractor | Playwright |\n|---|---|\n| `element(by.buttonText('...'))` | `page.locator('button, input[type=\"submit\"] >> text=\"...\"')` |\n| `element(by.css('...'))` | `page.locator('...')` |\n| `element(by.cssContainingText('..1..', '..2..'))` | `page.locator('..1.. >> text=..2..')` |\n| `element(by.id('...'))` | `page.locator('#...')` |\n| `element(by.model('...'))` | `page.locator('[ng-model=\"...\"]')` |\n| `element(by.repeater('...'))` | `page.locator('[ng-repeat=\"...\"]')` |\n| `element(by.xpath('...'))` | `page.locator('xpath=...')` |\n| `element.all(by.*)` | `page.locator(...)` (повертає всі за замовчуванням) |\n| `browser.get(url)` | `await page.goto(url)` |\n| `browser.getCurrentUrl()` | `page.url()` |",
        },
      ],
    },
    {
      id: "example",
      title: {
        en: "Side by side example",
        uk: "Приклад поруч",
      },
      paragraphs: [
        {
          en: "An AngularJS todo list test migrated from Protractor to Playwright:",
          uk: "Тест AngularJS todo-списку мігрований з Protractor на Playwright:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: `// Protractor (до міграції)
describe('angularjs homepage todo list', function() {
  it('should add a todo', function() {
    browser.get('https://angularjs.org');

    element(by.model('todoList.todoText')).sendKeys('first test');
    element(by.css('[value="add"]')).click();

    const todoList = element.all(by.repeater('todo in todoList.todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('first test');

    todoList.get(2).element(by.css('input')).click();
    const completedAmount = element.all(by.css('.done-true'));
    expect(completedAmount.count()).toEqual(2);
  });
});`,
        },
        {
          id: "cb-2",
          language: "js",
          code: `// Playwright (після міграції)
const { test, expect } = require('@playwright/test');

test.describe('angularjs homepage todo list', () => {
  test('should add a todo', async ({ page }) => {  // тепер async, page — фікстура
    await page.goto('https://angularjs.org');  // await скрізь

    // by.model('...') → locator('[ng-model="..."]')
    await page.locator('[ng-model="todoList.todoText"]').fill('first test');
    await page.locator('[value="add"]').click();

    // by.repeater('...') → locator('[ng-repeat="..."]')
    const todoList = page.locator('[ng-repeat="todo in todoList.todos"]');
    await expect(todoList).toHaveCount(3);
    await expect(todoList.nth(2)).toHaveText('first test', { useInnerText: true });

    await todoList.nth(2).getByRole('textbox').click();
    const completedAmount = page.locator('.done-true');
    await expect(completedAmount).toHaveCount(2);
  });
});`,
        },
      ],
    },
    {
      id: "waitforangular",
      title: {
        en: "Replacing waitForAngular",
        uk: "Заміна waitForAngular",
      },
      paragraphs: [
        {
          en: "In almost all cases Playwright's auto-waiting covers what `waitForAngular` did — every `.click()`, `.fill()`, and assertion already waits for the element to be ready and stable. If I'm testing an older Angular app where async state changes don't trigger DOM mutations that Playwright can detect, I can polyfill `waitForAngular` using Angular's testability API (Angular 2+):",
          uk: "У майже всіх випадках auto-waiting Playwright покриває те що робив `waitForAngular` — кожен `.click()`, `.fill()` і assertion вже чекає щоб елемент був готовий і стабільний. Якщо тестую старший Angular-застосунок де async-зміни стану не викликають DOM-мутацій які Playwright може виявити, можу зробити поліфіл `waitForAngular` через Angular testability API (Angular 2+):",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: `async function waitForAngular(page) {
  await page.evaluate(async () => {
    // @ts-expect-error
    if (window.getAllAngularTestabilities) {
      // @ts-expect-error
      await Promise.all(window.getAllAngularTestabilities().map(whenStable))
      // @ts-expect-error
      async function whenStable(testability) {
        return new Promise(res => testability.whenStable(res))
      }
    }
  })
}

// Використання
const page = await context.newPage()
await page.goto('/orders')
await waitForAngular(page)`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You're migrating a Protractor test that uses element(by.model('user.email')) to fill a field and element.all(by.repeater('order in orders')) to count rows. What are the Playwright equivalents?",
        uk: "Мігруєш Protractor-тест що використовує element(by.model('user.email')) щоб заповнити поле і element.all(by.repeater('order in orders')) щоб порахувати рядки. Які Playwright-еквіваленти?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.getByLabel('user.email') and page.getByRole('row')",
            uk: "page.getByLabel('user.email') і page.getByRole('row')",
          },
        },
        {
          id: "b",
          label: {
            en: "page.locator('[ng-model=\"user.email\"]').fill('...') and page.locator('[ng-repeat=\"order in orders\"]') — by.model and by.repeater map directly to the Angular HTML attributes they targeted",
            uk: "page.locator('[ng-model=\"user.email\"]').fill('...') і page.locator('[ng-repeat=\"order in orders\"]') — by.model і by.repeater відображаються напряму на Angular HTML-атрибути на які вони цілилися",
          },
        },
        {
          id: "c",
          label: {
            en: "page.locator('#user-email') and page.locator('.order-row')",
            uk: "page.locator('#user-email') і page.locator('.order-row')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Protractor's `by.model('user.email')` found elements by their `ng-model` Angular attribute. Playwright's equivalent is the plain CSS attribute selector `[ng-model=\"user.email\"]`. Similarly, `by.repeater('order in orders')` matched elements with the `ng-repeat` attribute — so it becomes `[ng-repeat=\"order in orders\"]`. These are direct one-to-one mappings because Protractor was selecting by CSS attributes with Angular-specific names. No semantic locators (`getByLabel`, `getByRole`) are needed here unless the element also has accessible attributes.",
        uk: "Protractor's `by.model('user.email')` знаходив елементи за їх Angular-атрибутом `ng-model`. Еквівалент у Playwright — звичайний CSS-атрибутний селектор `[ng-model=\"user.email\"]`. Аналогічно, `by.repeater('order in orders')` знаходив елементи з атрибутом `ng-repeat` — тому стає `[ng-repeat=\"order in orders\"]`. Це прямі відображення один-до-одного оскільки Protractor по суті вибирав за CSS-атрибутами з Angular-специфічними іменами. Семантичні локатори (`getByLabel`, `getByRole`) тут не потрібні якщо елемент не має відповідних accessible-атрибутів.",
      },
    },
  ],
}
