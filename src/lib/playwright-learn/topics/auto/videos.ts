import type { PlaywrightTopic } from "../../types"

export const videosTopic: PlaywrightTopic = {
  slug: "videos",
  groupId: "guides",
  order: 425,
  sourceDoc: "videos.md",
  officialDocsUrl: "https://playwright.dev/docs/videos",
  title: {
    en: "Videos",
    uk: "Відео",
  },
  summary: {
    en: "With Playwright you can record videos for your tests.",
    uk: "У Playwright можна записувати відео для ваших тестів.",
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
          en: "With Playwright you can record videos for your tests.",
          uk: "У Playwright можна записувати відео для ваших тестів.",
        },
      ],
    },
    {
      id: "record-video",
      title: {
        en: "Record video",
        uk: "Запис відео",
      },
      paragraphs: [
        {
          en: "Playwright Test can record videos for your tests, controlled by the `video` option in your Playwright config. By default videos are off.",
          uk: "Playwright Test записує відео тестів; це керується опцією `video` у конфігурації Playwright. За замовчуванням відео вимкнено.",
        },
        {
          en: "- `'off'` - Do not record video.\n- `'on'` - Record video for each test.\n- `'retain-on-failure'` - Record video for each test, but remove all videos from successful test runs.\n- `'on-first-retry'` - Record video only when retrying a test for the first time.",
          uk: "- `'off'` — не записувати відео.\n- `'on'` — записувати для кожного тесту.\n- `'retain-on-failure'` — записувати для кожного тесту, але видаляти після успішних прогонів.\n- `'on-first-retry'` — записувати лише під час першого повтору тесту.",
        },
        {
          en: "Video files will appear in the test output directory, typically `test-results`. See [`property: TestOptions.video`] for advanced video configuration.",
          uk: "Файли відео з’являться в каталозі виводу тестів, зазвичай `test-results`. Розширені налаштування — у [`property: TestOptions.video`].",
        },
        {
          en: "Videos are saved upon [browser context](./browser-contexts.md) closure at the end of a test. If you create a browser context manually, make sure to await [`method: BrowserContext.close`].",
          uk: "Відео зберігаються після закриття [контексту браузера](./browser-contexts.md) наприкінці тесту. Якщо контекст створюєте вручну, обов’язково виконайте await [`method: BrowserContext.close`].",
        },
        {
          en: "You can also specify video size and annotation. The video size defaults to the viewport size scaled down to fit 800x800. The video of the viewport is placed in the top-left corner of the output video, scaled down to fit if necessary. You may need to set the viewport size to match your desired video size.",
          uk: "Можна задати розмір відео й анотації. За замовчуванням розмір відповідає в’юпорту з масштабуванням до 800×800. Зображення в’юпорту розміщується у лівому верхньому куті вихідного відео зі зменшенням за потреби. Можливо, доведеться налаштувати розмір в’юпорту під бажаний розмір відео.",
        },
        {
          en: "When `show: { actions }` is specified, each action will be visually highlighted in the video with the element outline and action title subtitle. The optional `duration` property controls how long each annotation is displayed (defaults to `500`ms).",
          uk: "Якщо вказано `show: { actions }`, кожна дія підсвічується на відео контуром елемента й підписом дії. Опційна властивість `duration` задає тривалість показу анотації (за замовчуванням `500` мс).",
        },
        {
          en: "When `show: { test }` is specified, video will be annotated with the current test information with configurable `level`.",
          uk: "Якщо вказано `show: { test }`, на відео накладається інформація про поточний тест із налаштовуваним `level`.",
        },
        {
          en: "For multi-page scenarios, you can access the video file associated with the page via the\n[`method: Page.video`].",
          uk: "У сценаріях з кількома сторінками доступ до файлу відео сторінки — через\n[`method: Page.video`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    video: 'on-first-retry',\n  },\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });\n// Make sure to await close, so that videos are saved.\nawait context.close();",
        },
        {
          id: "cb-3",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    video: {\n      mode: 'on-first-retry',\n      size: { width: 640, height: 480 },\n      show: {\n        actions: {\n          duration: 500,\n          position: 'top-right',\n          fontSize: 14,\n        },\n        test: {\n          level: 'step',\n          position: 'top-left',\n          fontSize: 12,\n        }\n      },\n    },\n  },\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "const path = await page.video().path();",
        },
      ],
    },
    {
      id: "record-video",
      title: {
        en: "Record video",
        uk: "Запис відео",
      },
      paragraphs: [
        {
          en: "Videos are saved upon [browser context](./browser-contexts.md) closure at the end of a test. If you create a browser context manually, make sure to await [`method: BrowserContext.close`].",
          uk: "Відео зберігаються після закриття [контексту браузера](./browser-contexts.md) наприкінці тесту. Якщо контекст створюєте вручну, обов’язково виконайте await [`method: BrowserContext.close`].",
        },
        {
          en: "You can also specify video size. The video size defaults to the viewport size scaled down to fit 800x800. The video of the viewport is placed in the top-left corner of the output video, scaled down to fit if necessary. You may need to set the viewport size to match your desired video size.",
          uk: "Можна задати розмір відео. За замовчуванням він відповідає в’юпорту з масштабуванням до 800×800; кадр в’юпорту — у лівому верхньому куті зі зменшенням за потреби. Можливо, варто узгодити розмір в’юпорту з бажаним розміром відео.",
        },
        {
          en: "Saved video files will appear in the specified folder. They all have generated unique names.\nFor the multi-page scenarios, you can access the video file associated with the page via the\n[`method: Page.video`].",
          uk: "Збережені файли відео з’являться в указаному каталозі; імена генеруються унікальні.\nУ сценаріях з кількома сторінками доступ до відео сторінки — через\n[`method: Page.video`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });\n// Make sure to await close, so that videos are saved.\nawait context.close();",
        },
        {
          id: "cb-10",
          language: "js",
          code: "const context = await browser.newContext({\n  recordVideo: {\n    dir: 'videos/',\n    size: { width: 640, height: 480 },\n  }\n});",
        },
        {
          id: "cb-15",
          language: "js",
          code: "const path = await page.video().path();",
        },
      ],
    },
  ],
  quiz: [],
}
