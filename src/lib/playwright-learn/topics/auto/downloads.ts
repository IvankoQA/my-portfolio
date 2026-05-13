import type { PlaywrightTopic } from "../../types"

export const downloadsTopic: PlaywrightTopic = {
  slug: "downloads",
  groupId: "guides",
  order: 180,
  sourceDoc: "downloads.md",
  officialDocsUrl: "https://playwright.dev/docs/downloads",
  title: {
    en: "Downloads",
    uk: "Завантаження файлів",
  },
  summary: {
    en: "For every attachment downloaded by the page, [`event: Page.download`] event is emitted. All these attachments are downloaded into a temporary folder. You can obtain the download url, file name and payload stream using the [Download] object from the event.",
    uk: "За кожне завантаження зі сторінки випромінюється подія [`event: Page.download`]. Файли потрапляють у тимчасову теку. Через об’єкт [Download] з події можна отримати URL, ім’я файлу та потік даних.",
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
          en: "For every attachment downloaded by the page, [`event: Page.download`] event is emitted. All these attachments are downloaded into a temporary folder. You can obtain the download url, file name and payload stream using the [Download] object from the event.",
          uk: "За кожне завантаження зі сторінки випромінюється подія [`event: Page.download`]. Файли потрапляють у тимчасову теку. Через об’єкт [Download] з події можна отримати URL, ім’я файлу та потік даних.",
        },
        {
          en: "You can specify where to persist downloaded files using the [`option: BrowserType.launch.downloadsPath`] option in [`method: BrowserType.launch`].",
          uk: "Куди зберігати завантаження, задається опцією [`option: BrowserType.launch.downloadsPath`] у [`method: BrowserType.launch`].",
        },
        {
          en: "Here is the simplest way to handle the file download:",
          uk: "Найпростіший спосіб обробити завантаження файлу:",
        },
        {
          en: "#### Variations",
          uk: "#### Варіанти",
        },
        {
          en: "If you have no idea what initiates the download, you can still handle the event:",
          uk: "Якщо невідомо, що саме запускає завантаження, подію все одно можна обробити:",
        },
        {
          en: "Note that handling the event forks the control flow and makes the script harder to follow. Your scenario might end while you are downloading a file since your main control flow is not awaiting for this operation to resolve.",
          uk: "Увага: обробка події розгалужує потік керування й ускладнює читання сценарію. Основний потік може завершитися до кінця завантаження, якщо ви не чекаєте (`await`) на завершення цієї операції.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "// Start waiting for download before clicking. Note no await.\nconst downloadPromise = page.waitForEvent('download');\nawait page.getByText('Download file').click();\nconst download = await downloadPromise;\n\n// Wait for the download process to complete and save the downloaded file somewhere.\nawait download.saveAs('/path/to/save/at/' + download.suggestedFilename());",
        },
        {
          id: "cb-6",
          language: "js",
          code: "page.on('download', download => download.path().then(console.log));",
        },
      ],
    },
  ],
  quiz: [],
}
