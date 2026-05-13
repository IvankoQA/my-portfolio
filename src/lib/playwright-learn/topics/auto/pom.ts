import type { PlaywrightTopic } from "../../types"

export const pomTopic: PlaywrightTopic = {
  slug: "pom",
  groupId: "guides",
  order: 280,
  level: "intermediate",
  trackOrder: 11,
  sourceDoc: "pom.md",
  officialDocsUrl: "https://playwright.dev/docs/pom",
  title: {
    en: "Page object models",
    uk: "Моделі об’єктів сторінки (Page Object)",
  },
  summary: {
    en: "Large test suites can be structured to optimize ease of authoring and maintenance. Page object models are one such approach to structure your test suite.",
    uk: "Великі тестові набори можна структурувати, щоб спростити написання й підтримку. Моделі об’єктів сторінки — один із підходів до організації тестів.",
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
          en: "Large test suites can be structured to optimize ease of authoring and maintenance. Page object models are one such approach to structure your test suite.",
          uk: "Великі тестові набори можна структурувати, щоб спростити написання й підтримку. Моделі об’єктів сторінки — один із підходів до організації тестів.",
        },
        {
          en: "A page object represents a part of your web application. An e-commerce web application might have a home page, a listings page and a checkout page. Each of them can be represented by page object models.",
          uk: "Об’єкт сторінки представляє частину вашого вебзастосунку. Наприклад, у e-commerce можуть бути головна, каталог і оформлення замовлення — кожну з них можна описати окремою моделлю об’єкта сторінки.",
        },
        {
          en: "Page objects **simplify authoring** by creating a higher-level API which suits your application and **simplify maintenance** by capturing element selectors in one place and create reusable code to avoid repetition.",
          uk: "Page objects **спрощують написання тестів**, даючи вищорівневий API, зручний для вашого застосунку, і **спрощують підтримку**, зосереджуючи селектори в одному місці та даючи перевикористовуваний код без дублювання.",
        },
      ],
    },
    {
      id: "implementation",
      title: {
        en: "Implementation",
        uk: "Реалізація",
      },
      paragraphs: [
        {
          en: "We will create a `PlaywrightDevPage` helper class to encapsulate common operations on the `playwright.dev` page. Internally, it will use the `page` object.",
          uk: "Створимо допоміжний клас `PlaywrightDevPage`, який інкапсулює типові дії на сторінці `playwright.dev`. Всередині він використовуватиме об’єкт `page`.",
        },
        {
          en: "Now we can use the `PlaywrightDevPage` class in our tests.",
          uk: "Тепер клас `PlaywrightDevPage` можна використовувати в тестах.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport class PlaywrightDevPage {\n  readonly page: Page;\n  readonly getStartedLink: Locator;\n  readonly gettingStartedHeader: Locator;\n  readonly pomLink: Locator;\n  readonly tocList: Locator;\n\n  constructor(page: Page) {\n    this.page = page;\n    this.getStartedLink = page.locator('a', { hasText: 'Get started' });\n    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });\n    this.pomLink = page.locator('li', {\n      hasText: 'Guides',\n    }).locator('a', {\n      hasText: 'Page Object Model',\n    });\n    this.tocList = page.locator('article div.markdown ul > li > a');\n  }\n\n  async goto() {\n    await this.page.goto('https://playwright.dev');\n  }\n\n  async getStarted() {\n    await this.getStartedLink.first().click();\n    await expect(this.gettingStartedHeader).toBeVisible();\n  }\n\n  async pageObjectModel() {\n    await this.getStarted();\n    await this.pomLink.click();\n  }\n}",
        },
        {
          id: "cb-2",
          language: "js",
          code: "class PlaywrightDevPage {\n  /**\n   * @param {import('playwright').Page} page\n   */\n  constructor(page) {\n    this.page = page;\n    this.getStartedLink = page.locator('a', { hasText: 'Get started' });\n    this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });\n    this.pomLink = page.locator('li', {\n      hasText: 'Playwright Test',\n    }).locator('a', {\n      hasText: 'Page Object Model',\n    });\n    this.tocList = page.locator('article div.markdown ul > li > a');\n  }\n  async getStarted() {\n    await this.getStartedLink.first().click();\n    await expect(this.gettingStartedHeader).toBeVisible();\n  }\n\n  async pageObjectModel() {\n    await this.getStarted();\n    await this.pomLink.click();\n  }\n}\nmodule.exports = { PlaywrightDevPage };",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\ntest('getting started should contain table of contents', async ({ page }) => {\n  const playwrightDev = new PlaywrightDevPage(page);\n  await playwrightDev.goto();\n  await playwrightDev.getStarted();\n  await expect(playwrightDev.tocList).toHaveText([\n    `How to install Playwright`,\n    `What's installed`,\n    `How to run the example test`,\n    `How to open the HTML test report`,\n    `Write tests using web-first assertions, fixtures and locators`,\n    `Run single or multiple tests; headed mode`,\n    `Generate tests with Codegen`,\n    `View a trace of your tests`,\n  ]);\n});\n\ntest('should show Page Object Model article', async ({ page }) => {\n  const playwrightDev = new PlaywrightDevPage(page);\n  await playwrightDev.goto();\n  await playwrightDev.pageObjectModel();\n  await expect(page.locator('article')).toContainText('Page Object Model is a common pattern');\n});",
        },
      ],
    },
  ],
  quiz: [],
}
