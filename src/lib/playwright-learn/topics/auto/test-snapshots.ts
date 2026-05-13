import type { PlaywrightTopic } from "../../types"

export const testSnapshotsTopic: PlaywrightTopic = {
  slug: "test-snapshots",
  groupId: "test-runner",
  order: 375,
  level: "advanced",
  trackOrder: 1,
  sourceDoc: "test-snapshots-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-snapshots",
  title: {
    en: "Visual comparisons",
    uk: "Візуальні порівняння",
  },
  summary: {
    en: "Playwright Test includes the ability to produce and visually compare screenshots using `await expect(page).toHaveScreenshot()`. On first execution, Playwright test will generate reference screenshots. Subsequent runs will compare against the reference.",
    uk: "Playwright Test уміє створювати скриншоти й візуально порівнювати їх через `await expect(page).toHaveScreenshot()`. Перший запуск генерує еталонні зображення; наступні прогони порівнюють з еталоном.",
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
          en: "Playwright Test includes the ability to produce and visually compare screenshots using `await expect(page).toHaveScreenshot()`. On first execution, Playwright test will generate reference screenshots. Subsequent runs will compare against the reference.",
          uk: "Playwright Test уміє створювати скриншоти й візуально порівнювати їх через `await expect(page).toHaveScreenshot()`. Перший запуск генерує еталонні зображення; наступні прогони порівнюють з еталоном.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\ntest('example test', async ({ page }) => {\n  await page.goto('https://playwright.dev');\n  await expect(page).toHaveScreenshot();\n});",
        },
      ],
    },
    {
      id: "generating-screenshots",
      title: {
        en: "Generating screenshots",
        uk: "Генерація скриншотів",
      },
      paragraphs: [
        {
          en: "When you run above for the first time, test runner will say:",
          uk: "Під час першого запуску раннер повідомить:",
        },
        {
          en: "That's because there was no golden file yet. This method took a bunch of screenshots until two consecutive\nscreenshots matched, and saved the last screenshot to file system. It is now ready to be added to the repository.",
          uk: "Так тому, що ще не було golden-файлу. Метод робив серію знімків, доки два поспіль не збіглися, і зберіг останній у файлову систему. Його можна додати до репозиторію.",
        },
        {
          en: "The name of the folder with the golden expectations starts with the name of your test file:",
          uk: "Назва каталогу з еталонними знімками починається з імені вашого тестового файлу:",
        },
        {
          en: "The snapshot name `example-test-1-chromium-darwin.png` consists of a few parts:\n- `example-test-1.png` - an auto-generated name of the snapshot. Alternatively you can specify snapshot name as the first argument of the `toHaveScreenshot()` method:",
          uk: "Ім’я знімка `example-test-1-chromium-darwin.png` складається з частин:\n- `example-test-1.png` — автоматично згенерована назва. Альтернативно назву можна передати першим аргументом `toHaveScreenshot()`:",
        },
        {
          en: "- `chromium-darwin` - the browser name and the platform. Screenshots differ between browsers and platforms due to different rendering, fonts and more, so you will need different snapshots for them. If you use multiple projects in your [configuration file](./test-configuration.md), project name will be used instead of `chromium`.",
          uk: "- `chromium-darwin` — браузер і платформа. Скриншоти відрізняються між браузерами й ОС через рендеринг, шрифти тощо, тому потрібні різні знімки. Якщо у [файлі конфігурації](./test-configuration.md) кілька проєктів, замість `chromium` використовується ім’я проєкту.",
        },
        {
          en: "The snapshot name and path can be configured with [`property: TestConfig.snapshotPathTemplate`] in the playwright config.",
          uk: "Ім’я та шлях знімка налаштовуються через [`property: TestConfig.snapshotPathTemplate`] у конфігурації Playwright.",
        },
        {
          en: "> Note that `toHaveScreenshot()` also accepts an array of path segments to the snapshot file such as `expect().toHaveScreenshot(['relative', 'path', 'to', 'snapshot.png'])`.\n> However, this path must stay within the snapshots directory for each test file (i.e. `a.spec.js-snapshots`), otherwise it will throw.",
          uk: "> Зверніть увагу: `toHaveScreenshot()` також приймає масив сегментів шляху до файлу знімка, наприклад `expect().toHaveScreenshot(['relative', 'path', 'to', 'snapshot.png'])`.\n> Шлях має залишатися в каталозі знімків для кожного тестового файлу (наприклад `a.spec.js-snapshots`), інакше буде виняток.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "txt",
          code: "Error: A snapshot doesn't exist at example.spec.ts-snapshots/example-test-1-chromium-darwin.png, writing actual.",
        },
        {
          id: "cb-3",
          language: "bash",
          code: "drwxr-xr-x  5 user  group  160 Jun  4 11:46 .\ndrwxr-xr-x  6 user  group  192 Jun  4 11:45 ..\n-rw-r--r--  1 user  group  231 Jun  4 11:16 example.spec.ts\ndrwxr-xr-x  3 user  group   96 Jun  4 11:46 example.spec.ts-snapshots",
        },
        {
          id: "cb-4",
          language: "js",
          code: "    await expect(page).toHaveScreenshot('landing.png');",
        },
      ],
    },
    {
      id: "updating-screenshots",
      title: {
        en: "Updating screenshots",
        uk: "Оновлення скриншотів",
      },
      paragraphs: [
        {
          en: "Sometimes you need to update the reference screenshot, for example when the page has changed. Do this with the  `--update-snapshots` flag.",
          uk: "Іноді потрібно оновити еталонний скриншот, наприклад після змін на сторінці. Для цього використовуйте прапорець `--update-snapshots`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "bash",
          code: "npx playwright test --update-snapshots",
        },
      ],
    },
    {
      id: "options",
      title: {
        en: "Options",
        uk: "Опції",
      },
      paragraphs: [
        {
          en: "### maxDiffPixels",
          uk: "### maxDiffPixels",
        },
        {
          en: "Playwright Test uses the [pixelmatch](https://github.com/mapbox/pixelmatch) library. You can [pass various options](./api/class-pageassertions.md#page-assertions-to-have-screenshot-1) to modify its behavior:",
          uk: "Playwright Test використовує бібліотеку [pixelmatch](https://github.com/mapbox/pixelmatch). Можна [передати різні опції](./api/class-pageassertions.md#page-assertions-to-have-screenshot-1), щоб змінити поведінку:",
        },
        {
          en: "If you'd like to share the default value among all the tests in the project, you can specify it in the playwright config, either globally or per project:",
          uk: "Щоб спільне значення за замовчуванням діяло для всіх тестів проєкту, задайте його в конфігурації Playwright глобально або для проєкту:",
        },
        {
          en: "### stylePath",
          uk: "### stylePath",
        },
        {
          en: "You can apply a custom stylesheet to your page while taking screenshot. This\nallows filtering out dynamic or volatile elements, hence improving the screenshot\ndeterminism.",
          uk: "Під час знімка можна застосувати власну таблицю стилів до сторінки. Це\nдозволяє приховати динамічні або нестабільні елементи й підвищити\nвідтворюваність скриншота.",
        },
        {
          en: "If you'd like to share the default value among all the tests in the project, you can specify it in the playwright config, either globally or per project:",
          uk: "Щоб спільне значення за замовчуванням діяло для всіх тестів проєкту, задайте його в конфігурації Playwright глобально або для проєкту:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "\ntest('example test', async ({ page }) => {\n  await page.goto('https://playwright.dev');\n  await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });\n});",
        },
        {
          id: "cb-7",
          language: "js",
          code: "\nexport default defineConfig({\n  expect: {\n    toHaveScreenshot: { maxDiffPixels: 100 },\n  },\n});",
        },
        {
          id: "cb-8",
          language: "css",
          code: "iframe {\n  visibility: hidden;\n}",
        },
        {
          id: "cb-9",
          language: "js",
          code: "\ntest('example test', async ({ page }) => {\n  await page.goto('https://playwright.dev');\n  await expect(page).toHaveScreenshot({ stylePath: path.join(__dirname, 'screenshot.css') });\n});",
        },
        {
          id: "cb-10",
          language: "js",
          code: "\nexport default defineConfig({\n  expect: {\n    toHaveScreenshot: {\n      stylePath: './screenshot.css'\n    },\n  },\n});",
        },
      ],
    },
    {
      id: "non-image-snapshots",
      title: {
        en: "Non-image snapshots",
        uk: "Неграфічні знімки",
      },
      paragraphs: [
        {
          en: "Apart from screenshots, you can use `expect(value).toMatchSnapshot(snapshotName)` to compare text or arbitrary binary data. Playwright Test auto-detects the content type and uses the appropriate comparison algorithm.",
          uk: "Окрім скриншотів, можна використовувати `expect(value).toMatchSnapshot(snapshotName)` для порівняння тексту або довільних бінарних даних. Playwright Test автоматично визначає тип вмісту й застосовує відповідний алгоритм порівняння.",
        },
        {
          en: "Here we compare text content against the reference.",
          uk: "Тут текстовий вміст порівнюється з еталоном.",
        },
        {
          en: "Snapshots are stored next to the test file, in a separate directory. For example, `my.spec.ts` file will produce and store snapshots in the `my.spec.ts-snapshots` directory. You should commit this directory to your version control (e.g. `git`), and review any changes to it.",
          uk: "Знімки зберігаються поруч із тестовим файлом в окремому каталозі. Наприклад, `my.spec.ts` створює й зберігає знімки в `my.spec.ts-snapshots`. Цей каталог варто комітити в систему контролю версій (наприклад `git`) і переглядати зміни в ньому.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "\ntest('example test', async ({ page }) => {\n  await page.goto('https://playwright.dev');\n  expect(await page.textContent('.hero__title')).toMatchSnapshot('hero.txt');\n});",
        },
      ],
    },
  ],
  quiz: [],
}
