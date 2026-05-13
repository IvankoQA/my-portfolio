import type { PlaywrightTopic } from "../../types"

export const testUiModeTopic: PlaywrightTopic = {
  slug: "test-ui-mode",
  groupId: "test-runner",
  order: 390,
  level: "advanced",
  trackOrder: 2,
  sourceDoc: "test-ui-mode-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-ui-mode",
  title: {
    en: "UI Mode",
    uk: "UI Mode",
  },
  summary: {
    en: "UI Mode lets you explore, run, and debug tests with a time travel experience complete with a watch mode. All test files are displayed in the testing sidebar, allowing you to expand each file and describe block to individually run, view, watch, and debug each test. Filter tests by **name**, [**projects**](./test-projects) (set in your `playwright.config` file), **@tag**, or by the execution status of **passed**, **…",
    uk: "UI Mode дає змогу досліджувати, запускати й дебажити тести з ефектом «подорожі в часі» та режимом спостереження (watch). Усі тестові файли показані в бічній панелі тестування: можна розгорнути кожен файл і блок `describe`, щоб окремо запускати, переглядати, стежити й дебажити кожен тест. Фільтруйте тести за **назвою**, [**проєктами**](./test-projects) (заданими у файлі `playwright.config`), **@тегом** або за станом виконання: **успішні**, **…",
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
          en: "UI Mode lets you explore, run, and debug tests with a time travel experience complete with a watch mode. All test files are displayed in the testing sidebar, allowing you to expand each file and describe block to individually run, view, watch, and debug each test. Filter tests by **name**, [**projects**](./test-projects) (set in your `playwright.config` file), **@tag**, or by the execution status of **passed**, **failed**, and **skipped**. See a full trace of your tests and hover back and forward over each action to see what was happening during each step. You can also pop out the DOM snapshot of a given moment into a separate window for a better debugging experience.",
          uk: "UI Mode дає змогу досліджувати, запускати й дебажити тести з ефектом «подорожі в часі» та режимом спостереження (watch). Усі тестові файли показані в бічній панелі тестування: можна розгорнути кожен файл і блок `describe`, щоб окремо запускати, переглядати, стежити й дебажити кожен тест. Фільтруйте тести за **назвою**, [**проєктами**](./test-projects) (заданими у файлі `playwright.config`), **@тегом** або за станом виконання: **успішні**, **невдалі** та **пропущені**.\n\nПереглядайте повний трейс тестів і переводьте курсор туди-сюди над кожною дією, щоб бачити, що відбувалося на кожному кроці. Також можна винести знімок DOM певного моменту в окреме вікно для зручнішого дебагу.",
        },
      ],
    },
    {
      id: "opening-ui-mode",
      title: {
        en: "Opening UI Mode",
        uk: "Відкриття UI Mode",
      },
      paragraphs: [
        {
          en: "To open UI mode, run the following command in your terminal:",
          uk: "Щоб відкрити UI Mode, виконайте в терміналі таку команду:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright test --ui",
        },
      ],
    },
    {
      id: "running-your-tests",
      title: {
        en: "Running your tests",
        uk: "Запуск тестів",
      },
      paragraphs: [
        {
          en: "Once you launch UI Mode you will see a list of all your test files. You can run all your tests by clicking the triangle icon in the sidebar. You can also run a single test file, a block of tests or a single test by hovering over the name and clicking on the triangle next to it.",
          uk: "Після запуску UI Mode ви побачите список усіх тестових файлів. Усі тести можна запустити, натиснувши значок трикутника на бічній панелі. Також можна запустити один файл, блок тестів або один тест — наведіть курсор на назву й натисніть трикутник поруч.",
        },
      ],
    },
    {
      id: "filtering-tests",
      title: {
        en: "Filtering tests",
        uk: "Фільтрація тестів",
      },
      paragraphs: [
        {
          en: "Filter tests by text or `@tag` or by passed, failed or skipped tests. You can also filter by [projects](./test-projects) as set in your `playwright.config` file. If you are using project dependencies make sure to run your setup tests first before running the tests that depend on them. The UI mode will not take into consideration the setup tests and therefore you will have to manually run them first.",
          uk: "Фільтруйте тести за текстом або `@tag`, або за успішними, невдалими чи пропущеними. Також можна фільтрувати за [проєктами](./test-projects), заданими у `playwright.config`. Якщо використовуються залежності між проєктами, спочатку запустіть setup-тести, а вже потім тести, що від них залежать. UI Mode не враховує setup-тести автоматично, тож їх доведеться спочатку запустити вручну.",
        },
      ],
    },
    {
      id: "timeline-view",
      title: {
        en: "Timeline view",
        uk: "Вигляд часової шкали",
      },
      paragraphs: [
        {
          en: "At the top of the trace you can see a timeline view of your test with different colors to highlight navigation and actions. Hover back and forth to see an image snapshot for each action. Double click on an action to see the time range for that action. You can use the slider in the timeline to increase the actions selected and these will be shown in the Actions tab and all console logs and network logs will be filtered to only show the logs for the actions selected.",
          uk: "Угорі трейсу показано часову шкалу тесту з різними кольорами для навігації та дій. Переводьте курсор туди-сюди, щоб бачити знімок екрана для кожної дії. Подвійний клік по дії показує часовий діапазон цієї дії. Повзунком на шкалі можна розширити вибір дій — вони з’являться на вкладці Actions, а записи консолі та мережі будуть відфільтровані лише для вибраних дій.",
        },
      ],
    },
    {
      id: "actions",
      title: {
        en: "Actions",
        uk: "Дії",
      },
      paragraphs: [
        {
          en: "In the Actions tab you can see what locator was used for every action and how long each one took to run. Hover over each action of your test and visually see the change in the DOM snapshot. Go back and forward in time and click an action to inspect and debug. Use the Before and After tabs to visually see what happened before and after the action.\n",
          uk: "На вкладці Actions видно, який локатор використано для кожної дії та скільки вона тривала. Наведіть курсор на дію тесту й побачте зміни на знімку DOM. Переміщайтесь у часі та клацайте дію для перегляду й дебагу.\n\nВикористовуйте вкладки Before та After, щоб наочно побачити стан до й після дії.\n",
        },
      ],
    },
    {
      id: "pop-out-and-inspect-the-dom",
      title: {
        en: "Pop out and inspect the DOM",
        uk: "Винести знімок і перевірити DOM",
      },
      paragraphs: [
        {
          en: "Pop out the DOM snapshot into its own window for a better debugging experience by clicking on the pop out icon above the DOM snapshot. From there you can open the browser DevTools and inspect the HTML, CSS, Console etc. Go back to UI Mode and click on another action and pop that one out to easily compare the two side by side or debug each individually.",
          uk: "Винесіть знімок DOM в окреме вікно (іконка над знімком) для зручнішого дебагу. Там можна відкрити DevTools браузера й переглянути HTML, CSS, консоль тощо. Поверніться в UI Mode, оберіть іншу дію й винесіть її знімок — так легко порівняти два стани поруч або дебажити їх окремо.",
        },
      ],
    },
    {
      id: "pick-locator",
      title: {
        en: "Pick locator",
        uk: "Підібрати локатор",
      },
      paragraphs: [
        {
          en: "Click on the pick locator button and hover over the DOM snapshot to see the locator for each element highlighted as you hover. Click on an element to add the locator playground. You can modify the locator in the playground and see if your modified locator matches any locators in the DOM snapshot. Once you are satisfied with the locator you can use the copy button to copy the locator and paste it into your test.",
          uk: "Натисніть кнопку підбору локатора й наведіть курсор на знімок DOM — для кожного елемента підсвітиться відповідний локатор. Клацніть елемент, щоб відкрити playground локатора. Змінюйте локатор у playground і перевіряйте, чи збігається він з елементами на знімку. Коли локатор влаштовує, скопіюйте його кнопкою копіювання й вставте в тест.",
        },
      ],
    },
    {
      id: "source",
      title: {
        en: "Source",
        uk: "Код",
      },
      paragraphs: [
        {
          en: 'As you hover over each action of your test the line of code for that action is highlighted in the source panel. The button "Open in VSCode" is at the top-right of this section. Upon clicking the button, it will open your test in VS Code right at the line of code that you clicked on.',
          uk: "Коли ви наводите курсор на дію тесту, відповідний рядок коду підсвічується на панелі вихідного коду. Кнопка «Open in VSCode» розташована праворуч угорі цього блоку. Після натискання тест відкриється у VS Code саме на рядку, який ви обрали.",
        },
      ],
    },
    {
      id: "call",
      title: {
        en: "Call",
        uk: "Виклик",
      },
      paragraphs: [
        {
          en: "The call tab shows you information about the action such as the time it took, what locator was used, if in strict mode and what key was used.",
          uk: "Вкладка Call показує інформацію про дію: тривалість, використаний локатор, чи ввімкнено strict mode і яку клавішу було використано.",
        },
      ],
    },
    {
      id: "log",
      title: {
        en: "Log",
        uk: "Журнал",
      },
      paragraphs: [
        {
          en: "See a full log of your test to better understand what Playwright is doing behind the scenes such as scrolling into view, waiting for element to be visible, enabled and stable and performing actions such as click, fill, press etc.",
          uk: "Перегляньте повний журнал тесту, щоб краще зрозуміти, що Playwright робить «за лаштунками»: прокрутка до видимої області, очікування видимості, увімкненості й стабільності елемента, виконання дій на кшталт click, fill, press тощо.",
        },
      ],
    },
    {
      id: "errors",
      title: {
        en: "Errors",
        uk: "Помилки",
      },
      paragraphs: [
        {
          en: "If your test fails you will see the error messages for each test in the Errors tab. The timeline will also show a red line highlighting where the error occurred. You can also click on the source tab to see on which line of the source code the error is.",
          uk: "Якщо тест завершився з помилкою, повідомлення з’являться на вкладці Errors. На часовій шкалі також буде червона лінія, що позначає місце помилки. Можна відкрити вкладку з кодом і побачити рядок вихідного коду з помилкою.",
        },
      ],
    },
    {
      id: "console",
      title: {
        en: "Console",
        uk: "Консоль",
      },
      paragraphs: [
        {
          en: "See console logs from the browser as well as from your test. Different icons are displayed to show you if the console log came from the browser or from the test file.",
          uk: "Переглядайте записи консолі з браузера та з тесту. Різні піктограми показують, чи запис надійшов із браузера, чи з тестового файлу.",
        },
      ],
    },
    {
      id: "network",
      title: {
        en: "Network",
        uk: "Мережа",
      },
      paragraphs: [
        {
          en: "The Network tab shows you all the network requests that were made during your test. You can sort by different types of requests, status code, method, request, content type, duration and size. Click on a request to see more information about it such as the request headers, response headers, request body and response body.",
          uk: "Вкладка Network показує всі мережеві запити під час тесту. Можна сортувати за типом запиту, кодом стану, методом, URL, типом вмісту, тривалістю та розміром. Клацніть запит, щоб побачити заголовки запиту й відповіді, тіло запиту та відповіді.",
        },
      ],
    },
    {
      id: "attachments",
      title: {
        en: "Attachments",
        uk: "Вкладення",
      },
      paragraphs: [
        {
          en: "The \"Attachments\" tab allows you to explore attachments. If you're doing [visual regression testing](./test-snapshots.md), you'll be able to compare screenshots by examining the image diff, the actual image and the expected image. When you click on the expected image you can use the slider to slide one image over the other so you can easily see the differences in your screenshots.",
          uk: "Вкладка «Attachments» дає змогу переглядати вкладення. Якщо ви робите [візуальне регресійне тестування](./test-snapshots.md), можна порівнювати знімки екрана: diff, фактичний та очікуваний. Клацнувши очікуване зображення, можна повзунком накласти одне зображення на інше й легко побачити відмінності.",
        },
      ],
    },
    {
      id: "metadata",
      title: {
        en: "Metadata",
        uk: "Метадані",
      },
      paragraphs: [
        {
          en: "Next to the Actions tab you will find the Metadata tab which will show you more information on your test such as the Browser, viewport size, test duration and more.",
          uk: "Поруч із вкладкою Actions є вкладка Metadata з додатковою інформацією про тест: браузер, розмір в’юпорту, тривалість тесту тощо.",
        },
      ],
    },
    {
      id: "watch-mode",
      title: {
        en: "Watch mode",
        uk: "Режим спостереження (watch)",
      },
      paragraphs: [
        {
          en: "Next to the name of each test in the sidebar you will find an eye icon. Clicking on the icon will activate watch mode which will re-run the test when you make changes to it. You can watch a number of tests at the same time be clicking the eye icon next to each one or all tests by clicking the eye icon at the top of the sidebar.",
          uk: "Поруч із назвою кожного тесту на бічній панелі є значок ока. Натискання вмикає watch mode — тест перезапускатиметься після змін. Можна стежити за кількома тестами одночасно, натискаючи значок ока біля кожного, або за всіма тестами — значок ока вгорі бічної панелі.",
        },
      ],
    },
    {
      id: "docker-github-codespaces",
      title: {
        en: "Docker & GitHub Codespaces",
        uk: "Docker і GitHub Codespaces",
      },
      paragraphs: [
        {
          en: "For Docker and GitHub Codespaces environments, you can run UI mode in the browser. In order for an endpoint to be accessible outside of the container, it needs to be bound to the `0.0.0.0` interface:",
          uk: "У середовищах Docker і GitHub Codespaces UI Mode можна відкрити в браузері. Щоб кінцева точка була доступна ззовні контейнера, її потрібно прив’язати до інтерфейсу `0.0.0.0`:",
        },
        {
          en: "In the case of GitHub Codespaces, the port gets [forwarded automatically](https://docs.github.com/en/codespaces/developing-in-codespaces/forwarding-ports-in-your-codespace#about-forwarded-ports), so you can open UI mode in the browser by clicking on the link in the terminal.",
          uk: "У GitHub Codespaces порт [перенаправляється автоматично](https://docs.github.com/en/codespaces/developing-in-codespaces/forwarding-ports-in-your-codespace#about-forwarded-ports), тож UI Mode можна відкрити в браузері, перейшовши за посиланням у терміналі.",
        },
        {
          en: "To have a static port, you can pass the `--ui-port` flag:",
          uk: "Щоб зафіксувати порт, передайте прапорець `--ui-port`:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "bash",
          code: "npx playwright test --ui-host=0.0.0.0",
        },
        {
          id: "cb-3",
          language: "bash",
          code: "npx playwright test --ui-port=8080 --ui-host=0.0.0.0",
        },
      ],
    },
  ],
  quiz: [],
}
