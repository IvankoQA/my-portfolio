import type { PlaywrightTopic } from "../../types"

export const traceViewerIntroTopic: PlaywrightTopic = {
  slug: "trace-viewer-intro",
  groupId: "guides",
  order: 420,
  sourceDoc: "trace-viewer-intro-js.md",
  officialDocsUrl: "https://playwright.dev/docs/trace-viewer-intro",
  title: {
    en: "Trace viewer",
    uk: "Переглядач трас",
  },
  summary: {
    en: "Playwright Trace Viewer is a GUI tool that lets you explore recorded Playwright traces of your tests, meaning you can go back and forward through each action of your test and visually see what was happening during each action.",
    uk: "Playwright Trace Viewer — це GUI-інструмент для дослідження записаних трас ваших тестів: можна крокувати вперед і назад кожною дією тесту й наочно бачити, що відбувалося на кожному кроці.",
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
          en: "Playwright Trace Viewer is a GUI tool that lets you explore recorded Playwright traces of your tests, meaning you can go back and forward through each action of your test and visually see what was happening during each action.",
          uk: "Playwright Trace Viewer — це GUI-інструмент для дослідження записаних трас ваших тестів: можна крокувати вперед і назад кожною дією тесту й наочно бачити, що відбувалося на кожному кроці.",
        },
        {
          en: "**You will learn**",
          uk: "**У цьому посібнику**",
        },
        {
          en: "- [How to record a trace](/trace-viewer-intro.md#recording-a-trace)\n- [How to open the HTML report](/trace-viewer-intro.md#opening-the-html-report)\n- [How to open and view the trace](/trace-viewer-intro.md#opening-the-trace)",
          uk: "- [Як записати трасу](/trace-viewer-intro.md#recording-a-trace)\n- [Як відкрити HTML-звіт](/trace-viewer-intro.md#opening-the-html-report)\n- [Як відкрити й переглянути трасу](/trace-viewer-intro.md#opening-the-trace)",
        },
      ],
    },
    {
      id: "recording-a-trace",
      title: {
        en: "Recording a Trace",
        uk: "Запис траси",
      },
      paragraphs: [
        {
          en: "By default the [playwright.config](./trace-viewer.md#tracing-on-ci) file contains the configuration needed to create a `trace.zip` file for each test. Traces are setup to run `on-first-retry`, meaning they run on the first retry of a failed test. Also `retries` are set to 2 when running on CI and 0 locally. This means the traces are recorded on the first retry of a failed test but not on the first run and not on the second retry.",
          uk: "За замовчуванням файл [playwright.config](./trace-viewer.md#tracing-on-ci) містить налаштування для створення `trace.zip` для кожного тесту. Траси вмикаються з `on-first-retry`, тобто на першому повторі невдалого тесту. Також `retries` дорівнює 2 на CI і 0 локально: трасу записано на першому повторі невдалого тесту, але не під час першого запуску й не на другому повторі.",
        },
        {
          en: "To learn more about available options to record a trace check out our detailed guide on [Trace Viewer](/trace-viewer.md).",
          uk: "Усі варіанти запису траси описані в посібнику [Trace Viewer](/trace-viewer.md).",
        },
        {
          en: "Traces are normally run in a Continuous Integration (CI) environment, because locally you can use [UI Mode](/test-ui-mode.md) for developing and debugging tests. However, if you want to run traces locally without using [UI Mode](/test-ui-mode.md), you can force tracing to be on with `--trace on`.",
          uk: "Зазвичай траси збирають у середовищі Continuous Integration (CI), а локально для розробки й налагодження зручніший [UI Mode](/test-ui-mode.md). Якщо ж потрібні траси локально без [UI Mode](/test-ui-mode.md), увімкніть трасинг прапорцем `--trace on`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  retries: process.env.CI ? 2 : 0, // set to 2 when running on CI\n  // ...\n  use: {\n    trace: 'on-first-retry', // record traces on first retry of each test\n  },\n});",
        },
        {
          id: "cb-2",
          language: "bash",
          code: "npx playwright test --trace on",
        },
      ],
    },
    {
      id: "opening-the-html-report",
      title: {
        en: "Opening the HTML report",
        uk: "Відкриття HTML-звіту",
      },
      paragraphs: [
        {
          en: "The HTML report shows you a report of all your tests that have been run and on which browsers as well as how long they took. Tests can be filtered by passed tests, failed, flaky, or skipped tests. You can also search for a particular test. Clicking on a test opens the detailed view where you can see more information on your tests such as the errors, the test steps, and the trace.",
          uk: "HTML-звіт показує усі виконані тести, браузери та тривалість. Можна фільтрувати за успішними, невдалими, flaky чи пропущеними тестами й шукати конкретний тест. Клік по тесту відкриває детальний перегляд з помилками, кроками тесту та трасою.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "bash",
          code: "npx playwright show-report",
        },
      ],
    },
    {
      id: "opening-the-trace",
      title: {
        en: "Opening the trace",
        uk: "Відкриття траси",
      },
      paragraphs: [
        {
          en: "In the HTML report, click on the trace icon next to the test file name to directly open the trace for the required test.",
          uk: "У HTML-звіті натисніть іконку траси біля назви тестового файлу, щоб одразу відкрити трасу потрібного тесту.",
        },
        {
          en: "![playwright html report](./images/getting-started/html-report-failed-tests.png)",
          uk: "![HTML-звіт Playwright](./images/getting-started/html-report-failed-tests.png)",
        },
        {
          en: "You can also click to open the detailed view of the test and scroll down to the `'Traces'` tab and open the trace by clicking on the trace screenshot.",
          uk: "Також можна відкрити детальний перегляд тесту, прокрутити до вкладки `'Traces'` і відкрити трасу, клацнувши знімок траси.",
        },
        {
          en: "![playwright html report detailed view](./images/getting-started/html-report-trace.png)",
          uk: "![детальний перегляд HTML-звіту Playwright](./images/getting-started/html-report-trace.png)",
        },
        {
          en: "To learn more about reporters, check out our detailed guide on reporters including the [HTML Reporter](/test-reporters.md#html-reporter).",
          uk: "Докладніше про репортери — у посібнику, зокрема про [HTML Reporter](/test-reporters.md#html-reporter).",
        },
      ],
    },
    {
      id: "viewing-the-trace",
      title: {
        en: "Viewing the trace",
        uk: "Перегляд траси",
      },
      paragraphs: [
        {
          en: "View traces of your test by clicking through each action or hovering using the timeline and see the state of the page before and after the action. Inspect the log, source and network, errors, and console during each step of the test. The trace viewer creates a DOM snapshot so you can fully interact with it and open the browser DevTools to inspect the HTML, CSS, etc.",
          uk: "Переглядайте трасу, переходячи по діях або наводячи курсор на шкалу часу, щоб бачити сторінку до й після дії. На кожному кроці доступні журнал, вихідний код, мережа, помилки та консоль. Trace Viewer створює DOM-знімок, з яким можна взаємодіяти, і можна відкрити DevTools браузера для перегляду HTML, CSS тощо.",
        },
        {
          en: "![playwright trace viewer](./images/getting-started/trace-viewer-failed-test.png)",
          uk: "![Playwright Trace Viewer](./images/getting-started/trace-viewer-failed-test.png)",
        },
        {
          en: "To learn more about traces, check out our detailed guide on [Trace Viewer](/trace-viewer.md).",
          uk: "Більше про траси — у посібнику [Trace Viewer](/trace-viewer.md).",
        },
      ],
    },
    {
      id: "what-s-next",
      title: {
        en: "What's next",
        uk: "Що далі",
      },
      paragraphs: [
        {
          en: "- [Run tests on CI with GitHub Actions](/ci-intro.md)\n- [Learn more about Trace Viewer](/trace-viewer.md)",
          uk: "- [Запуск тестів на CI з GitHub Actions](/ci-intro.md)\n- [Докладніше про Trace Viewer](/trace-viewer.md)",
        },
      ],
    },
  ],
  quiz: [],
}
