import type { PlaywrightTopic } from "../../types"

export const pagesTopic: PlaywrightTopic = {
  slug: "pages",
  groupId: "guides",
  order: 275,
  level: "beginner",
  trackOrder: 18,
  sourceDoc: "pages.md",
  officialDocsUrl: "https://playwright.dev/docs/pages",
  title: {
    en: "Pages",
    uk: "Сторінки",
  },
  summary: {
    en: "Each [BrowserContext] can have multiple pages. A [Page] refers to a single tab or a popup window within a browser context. It should be used to navigate to URLs and interact with the page content.",
    uk: "У кожного [BrowserContext] може бути кілька сторінок. [Page] — це одна вкладка або спливаюче вікно в контексті браузера. Через неї переходять за URL і взаємодіють із вмістом сторінки.",
  },
  sections: [
    {
      id: "pages",
      title: {
        en: "Pages",
        uk: "Сторінки",
      },
      paragraphs: [
        {
          en: "Each [BrowserContext] can have multiple pages. A [Page] refers to a single tab or a popup window within a browser\ncontext. It should be used to navigate to URLs and interact with the page content.",
          uk: "У кожного [BrowserContext] може бути кілька сторінок. [Page] — це одна вкладка або спливаюче вікно в контексті\nбраузера. Через неї переходять за URL і взаємодіють із вмістом сторінки.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "// Create a page.\nconst page = await context.newPage();\n\n// Navigate explicitly, similar to entering a URL in the browser.\nawait page.goto('http://example.com');\n// Fill an input.\nawait page.locator('#search').fill('query');\n\n// Navigate implicitly by clicking a link.\nawait page.locator('#submit').click();\n// Expect a new url.\nconsole.log(page.url());",
        },
      ],
    },
    {
      id: "multiple-pages",
      title: {
        en: "Multiple pages",
        uk: "Кілька сторінок",
      },
      paragraphs: [
        {
          en: "Each browser context can host multiple pages (tabs).\n* Each page behaves like a focused, active page. Bringing the page to front is not required.\n* Pages inside a context respect context-level emulation, like viewport sizes, custom network routes or browser\n  locale.",
          uk: "Контекст браузера може містити кілька сторінок (вкладок).\n* Кожна сторінка поводиться як активна з фокусом; окремо «виносити на передній план» не потрібно.\n* Сторінки в контексті дотримуються емуляції на рівні контексту: viewport, власні мережеві маршрути,\n  мова (locale) браузера тощо.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "// Create two pages\nconst pageOne = await context.newPage();\nconst pageTwo = await context.newPage();\n\n// Get pages of a browser context\nconst allPages = context.pages();",
        },
      ],
    },
    {
      id: "handling-new-pages",
      title: {
        en: "Handling new pages",
        uk: "Обробка нових сторінок",
      },
      paragraphs: [
        {
          en: 'The `page` event on browser contexts can be used to get new pages that are created in the context. This can be used to\nhandle new pages opened by `target="_blank"` links.',
          uk: 'Подія `page` на контексті браузера дозволяє отримувати нові сторінки, створені в цьому контексті. Так обробляють\nвкладки, відкриті посиланнями з `target="_blank"`.',
        },
        {
          en: "If the action that triggers the new page is unknown, the following pattern can be used.",
          uk: "Якщо невідомо, яка саме дія відкриє нову сторінку, можна використати такий шаблон:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "// Start waiting for new page before clicking. Note no await.\nconst pagePromise = context.waitForEvent('page');\nawait page.getByText('open new tab').click();\nconst newPage = await pagePromise;\n// Interact with the new page normally.\nawait newPage.getByRole('button').click();\nconsole.log(await newPage.title());",
        },
        {
          id: "cb-16",
          language: "js",
          code: "// Get all new pages (including popups) in the context\ncontext.on('page', async page => {\n  await page.waitForLoadState();\n  console.log(await page.title());\n});",
        },
      ],
    },
    {
      id: "handling-popups",
      title: {
        en: "Handling popups",
        uk: "Обробка спливаючих вікон",
      },
      paragraphs: [
        {
          en: 'If the page opens a pop-up (e.g. pages opened by `target="_blank"` links), you can get a reference to it by listening to the `popup` event on the page.',
          uk: 'Якщо сторінка відкриває pop-up (наприклад через `target="_blank"`), посилання на нього можна отримати, підписавшись на подію `popup` на сторінці.',
        },
        {
          en: "This event is emitted in addition to the `browserContext.on('page')` event, but only for popups relevant to this page.",
          uk: "Ця подія додаткова до `browserContext.on('page')`, але лише для pop-up, пов’язаних із цією сторінкою.",
        },
        {
          en: "If the action that triggers the popup is unknown, the following pattern can be used.",
          uk: "Якщо невідомо, яка дія відкриє pop-up, використовуйте такий шаблон:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-21",
          language: "js",
          code: "// Start waiting for popup before clicking. Note no await.\nconst popupPromise = page.waitForEvent('popup');\nawait page.getByText('open the popup').click();\nconst popup = await popupPromise;\n// Interact with the new popup normally.\nawait popup.getByRole('button').click();\nconsole.log(await popup.title());",
        },
        {
          id: "cb-26",
          language: "js",
          code: "// Get all popups when they open\npage.on('popup', async popup => {\n  await popup.waitForLoadState();\n  console.log(await popup.title());\n});",
        },
      ],
    },
  ],
  quiz: [],
}
