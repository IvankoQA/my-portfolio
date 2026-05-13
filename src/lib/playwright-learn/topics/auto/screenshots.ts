import type { PlaywrightTopic } from "../../types"

export const screenshotsTopic: PlaywrightTopic = {
  slug: "screenshots",
  groupId: "guides",
  order: 295,
  sourceDoc: "screenshots.md",
  officialDocsUrl: "https://playwright.dev/docs/screenshots",
  title: {
    en: "Screenshots",
    uk: "Знімки екрана",
  },
  summary: {
    en: "Here is a quick way to capture a screenshot and save it into a file:",
    uk: "Ось швидкий спосіб зробити знімок екрана й зберегти його у файл:",
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
          en: "Here is a quick way to capture a screenshot and save it into a file:",
          uk: "Ось швидкий спосіб зробити знімок екрана й зберегти його у файл:",
        },
        {
          en: "[Screenshots API](./api/class-page#page-screenshot) accepts many parameters for image format, clip area, quality, etc. Make sure to check them out.",
          uk: "[API знімків екрана](./api/class-page#page-screenshot) приймає багато параметрів — формат зображення, область обрізання, якість тощо. Обов’язково перегляньте їх.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "await page.screenshot({ path: 'screenshot.png' });",
        },
      ],
    },
    {
      id: "full-page-screenshots",
      title: {
        en: "Full page screenshots",
        uk: "Знімки всієї сторінки",
      },
      paragraphs: [
        {
          en: "Full page screenshot is a screenshot of a full scrollable page, as if you had a very\ntall screen and the page could fit it entirely.",
          uk: "Знімок усієї сторінки — це знімок повністю прокручуваної сторінки, ніби у вас дуже\nвисокий екран і сторінка повністю на ньому поміщається.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "await page.screenshot({ path: 'screenshot.png', fullPage: true });",
        },
      ],
    },
    {
      id: "capture-into-buffer",
      title: {
        en: "Capture into buffer",
        uk: "Захоплення в буфер",
      },
      paragraphs: [
        {
          en: "Rather than writing into a file, you can get a buffer with the image and post-process it or pass it to a third party pixel diff facility.",
          uk: "Замість запису у файл можна отримати буфер із зображенням, подальше обробити його або передати сторонньому інструменту порівняння пікселів.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "const buffer = await page.screenshot();\nconsole.log(buffer.toString('base64'));",
        },
      ],
    },
    {
      id: "element-screenshot",
      title: {
        en: "Element screenshot",
        uk: "Знімок окремого елемента",
      },
      paragraphs: [
        {
          en: "Sometimes it is useful to take a screenshot of a single element.",
          uk: "Інколи корисно зробити знімок лише одного елемента.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-16",
          language: "js",
          code: "await page.locator('.header').screenshot({ path: 'screenshot.png' });",
        },
      ],
    },
  ],
  quiz: [],
}
