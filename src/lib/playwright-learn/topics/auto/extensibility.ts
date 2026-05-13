import type { PlaywrightTopic } from "../../types"

export const extensibilityTopic: PlaywrightTopic = {
  slug: "extensibility",
  groupId: "guides",
  order: 200,
  sourceDoc: "extensibility.md",
  officialDocsUrl: "https://playwright.dev/docs/extensibility",
  title: {
    en: "Extensibility",
    uk: "Розширюваність",
  },
  summary: {
    en: "Playwright supports custom selector engines, registered with [`method: Selectors.register`].",
    uk: "Playwright підтримує власні рушії селекторів, які реєструються через [`method: Selectors.register`].",
  },
  sections: [
    {
      id: "custom-selector-engines",
      title: {
        en: "Custom selector engines",
        uk: "Власні рушії селекторів",
      },
      paragraphs: [
        {
          en: "Playwright supports custom selector engines, registered with [`method: Selectors.register`].",
          uk: "Playwright підтримує власні рушії селекторів, які реєструються через [`method: Selectors.register`].",
        },
        {
          en: "Selector engine should have the following properties:\n- `query` function to query first element matching `selector` relative to the `root`.\n- `queryAll` function to query all elements matching `selector` relative to the `root`.",
          uk: "Рушій селекторів має містити:\n- функцію `query` — перший елемент, що відповідає `selector`, відносно `root`;\n- функцію `queryAll` — усі такі елементи відносно `root`.",
        },
        {
          en: "By default the engine is run directly in the frame's JavaScript context and, for example, can call an\napplication-defined function. To isolate the engine from any JavaScript in the frame, but leave access to the DOM,\nregister the engine with `{contentScript: true}` option. Content script engine is safer because it is protected from any\ntampering with the global objects, for example altering `Node.prototype` methods. All built-in selector engines run as\ncontent scripts.\n\nNote that running as a content script is not guaranteed when the engine is used together with other\ncustom engines.",
          uk: "За замовчуванням рушій виконується безпосередньо в JavaScript-контексті фрейму і, наприклад, може викликати функцію застосунку. Щоб ізолювати рушій від довільного JS у фреймі, залишивши доступ до DOM, зареєструйте його з опцією `{contentScript: true}`. Рушій як content script безпечніший: його не можна підмінити через глобальні об’єкти, наприклад змінивши методи `Node.prototype`. Усі вбудовані рушії працюють як content scripts.\n\nУвага: режим content script не гарантований, якщо рушій використовується разом з іншими користувацькими рушіями.",
        },
        {
          en: "Selectors must be registered before creating the page.",
          uk: "Селектори слід зареєструвати до створення сторінки.",
        },
        {
          en: "An example of registering selector engine that queries elements based on a tag name:",
          uk: "Приклад реєстрації рушія, який шукає елементи за ім’ям тега:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport { expect } from '@playwright/test';\n\n// Must be a function that evaluates to a selector engine instance.\nconst createTagNameEngine = () => ({\n  // Returns the first element matching given selector in the root's subtree.\n  query(root, selector) {\n    return root.querySelector(selector);\n  },\n\n  // Returns all elements matching given selector in the root's subtree.\n  queryAll(root, selector) {\n    return Array.from(root.querySelectorAll(selector));\n  }\n});\n\nexport const test = base.extend({\n  // Register selectors once per worker.\n  selectorRegistration: [async ({ playwright }, use) => {\n    // Register the engine. Selectors will be prefixed with \"tag=\".\n    await playwright.selectors.register('tag', createTagNameEngine);\n    await use();\n  }, { scope: 'worker', auto: true }],\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\ntest('selector engine test', async ({ page }) => {\n  // Now we can use 'tag=' selectors.\n  const button = page.locator('tag=button');\n  await button.click();\n\n  // We can combine it with built-in locators.\n  await page.locator('tag=div').getByText('Click me').click();\n\n  // We can use it in any methods supporting selectors.\n  await expect(page.locator('tag=button')).toHaveCount(3);\n});",
        },
      ],
    },
  ],
  quiz: [],
}
