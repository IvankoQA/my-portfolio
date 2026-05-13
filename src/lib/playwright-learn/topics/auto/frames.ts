import type { PlaywrightTopic } from "../../types"

export const framesTopic: PlaywrightTopic = {
  slug: "frames",
  groupId: "guides",
  order: 205,
  level: "intermediate",
  trackOrder: 19,
  sourceDoc: "frames.md",
  officialDocsUrl: "https://playwright.dev/docs/frames",
  title: {
    en: "Frames",
    uk: "Фрейми",
  },
  summary: {
    en: "A [Page] can have one or more [Frame] objects attached to it. Each page has a main frame and page-level interactions (like `click`) are assumed to operate in the main frame.",
    uk: "До [Page] може бути прив’язано один або кілька об’єктів [Frame]. У кожної сторінки є головний фрейм; дії на рівні сторінки (наприклад `click`) за замовчуванням виконуються в ньому.",
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
          en: "A [Page] can have one or more [Frame] objects attached to it. Each page has a main frame and page-level interactions\n(like `click`) are assumed to operate in the main frame.",
          uk: "До [Page] може бути прив’язано один або кілька об’єктів [Frame]. У кожної сторінки є головний фрейм; дії на рівні сторінки\n(наприклад `click`) за замовчуванням виконуються в ньому.",
        },
        {
          en: "A page can have additional frames attached with the `iframe` HTML tag. These frames can be accessed for interactions\ninside the frame.",
          uk: "Додаткові фрейми підключаються через HTML-тег `iframe`. До них можна звертатися для взаємодії\nвсередині фрейму.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "// Locate element inside frame\nconst username = await page.frameLocator('.frame-class').getByLabel('User Name');\nawait username.fill('John');",
        },
      ],
    },
    {
      id: "frame-objects",
      title: {
        en: "Frame objects",
        uk: "Об’єкти Frame",
      },
      paragraphs: [
        {
          en: "One can access frame objects using the [`method: Page.frame`] API:",
          uk: "Доступ до об’єктів фрейму — через API [`method: Page.frame`]:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "// Get frame using the frame's name attribute\nconst frame = page.frame('frame-login');\n\n// Get frame using frame's URL\nconst frame = page.frame({ url: /.*domain.*/ });\n\n// Interact with the frame\nawait frame.fill('#username-input', 'John');",
        },
      ],
    },
  ],
  quiz: [],
}
