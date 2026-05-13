import type { PlaywrightTopic } from "../../types"

export const gettingStartedVscodeTopic: PlaywrightTopic = {
  slug: "getting-started-vscode",
  groupId: "getting-started",
  order: 220,
  level: "beginner",
  trackOrder: 3,
  sourceDoc: "getting-started-vscode-js.md",
  officialDocsUrl: "https://playwright.dev/docs/getting-started-vscode",
  title: {
    en: "VS Code",
    uk: "VS Code",
  },
  summary: {
    en: "The Playwright VS Code extension brings the power of Playwright Test directly into your editor, allowing you to run, debug, and generate tests with a seamless UI-driven experience. This guide will walk you through setting up the extension and using its core features to supercharge your end-to-end testing workflow.",
    uk: "Розширення Playwright для VS Code переносить можливості Playwright Test безпосередньо у ваш редактор, даючи змогу запускати, налагоджувати й генерувати тести через зручний UI. У цьому посібнику показано, як налаштувати розширення та використовувати його основні можливості, щоб посилити робочий процес end-to-end тестування.",
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
          en: "The Playwright VS Code extension brings the power of Playwright Test directly into your editor, allowing you to run, debug, and generate tests with a seamless UI-driven experience. This guide will walk you through setting up the extension and using its core features to supercharge your end-to-end testing workflow.",
          uk: "Розширення Playwright для VS Code переносить можливості Playwright Test безпосередньо у ваш редактор, даючи змогу запускати, налагоджувати й генерувати тести через зручний UI. У цьому посібнику показано, як налаштувати розширення та використовувати його основні можливості, щоб посилити робочий процес end-to-end тестування.",
        },
      ],
    },
    {
      id: "prerequisites",
      title: {
        en: "Prerequisites",
        uk: "Передумови",
      },
      paragraphs: [
        {
          en: "Before you begin, make sure you have the following installed:\n- [Node.js](https://nodejs.org/) (LTS version recommended)\n- [Visual Studio Code](https://code.visualstudio.com/)",
          uk: "Перш ніж почати, переконайтеся, що у вас установлено:\n- [Node.js](https://nodejs.org/) (рекомендовано LTS-версію)\n- [Visual Studio Code](https://code.visualstudio.com/)",
        },
      ],
    },
    {
      id: "getting-started",
      title: {
        en: "Getting Started",
        uk: "Початок роботи",
      },
      paragraphs: [
        {
          en: "### Installation & Setup",
          uk: "### Встановлення та налаштування",
        },
        {
          en: '1.  **Install the Extension**: Open the Extensions view in VS Code (`Ctrl+Shift+X` or `Cmd+Shift+X`) and search for "Playwright". [Install the official extension from Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).',
          uk: '1.  **Встановіть розширення**: відкрийте подання Extensions у VS Code (`Ctrl+Shift+X` або `Cmd+Shift+X`) і знайдіть "Playwright". [Встановіть офіційне розширення від Microsoft](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright).',
        },
        {
          en: "![install playwright extension](./images/getting-started/vscode-extension.png)",
          uk: "![встановлення розширення playwright](./images/getting-started/vscode-extension.png)",
        },
        {
          en: "1.  **Install Playwright**: Once the extension is installed, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run the **Test: Install Playwright** command.",
          uk: "1.  **Встановіть Playwright**: після встановлення розширення відкрийте Command Palette (`Ctrl+Shift+P` або `Cmd+Shift+P`) і виконайте команду **Test: Install Playwright**.",
        },
        {
          en: "![install playwright](./images/getting-started/install-playwright.png)",
          uk: "![встановлення playwright](./images/getting-started/install-playwright.png)",
        },
        {
          en: "3.  **Select Browsers**: Choose the browsers you want for your tests (e.g., Chromium, Firefox, WebKit). You can also add a GitHub Actions workflow to run tests in CI. These settings can be changed later in your `playwright.config.ts` file.",
          uk: "3.  **Виберіть браузери**: оберіть браузери, потрібні для тестів (наприклад, Chromium, Firefox, WebKit). Також можна додати workflow GitHub Actions для запуску тестів у CI. Ці налаштування можна змінити пізніше у файлі `playwright.config.ts`.",
        },
        {
          en: "![install browsers](./images/getting-started/install-browsers.png)",
          uk: "![встановлення браузерів](./images/getting-started/install-browsers.png)",
        },
        {
          en: "### Opening the Testing Sidebar",
          uk: "### Відкриття бічної панелі Testing",
        },
        {
          en: "Click the **Testing icon** in the VS Code Activity Bar to open the Test Explorer. Here, you'll find your tests, as well as the Playwright sidebar for managing projects, tools, and settings.",
          uk: "Натисніть **іконку Testing** на Activity Bar у VS Code, щоб відкрити Test Explorer. Тут ви знайдете свої тести, а також бічну панель Playwright для керування проєктами, інструментами й налаштуваннями.",
        },
        {
          en: "![Testing Sidebar](./images/getting-started/testing-sidebar.png)",
          uk: "![бічна панель Testing](./images/getting-started/testing-sidebar.png)",
        },
      ],
    },
    {
      id: "core-features",
      title: {
        en: "Core Features",
        uk: "Основні можливості",
      },
      paragraphs: [
        {
          en: "### Running Your Tests",
          uk: "### Запуск тестів",
        },
        {
          en: '-   **Run a Single Test**: Click the green "play" icon next to any test to run it. The play button will change to a green checkmark if the test passes or a red X if the test fails. You\'ll be able to see how long the test took to run displayed next to the test name. Additionally, the Test Results panel will automatically open at the bottom of VS Code, showing a summary of the test execution including how many tests ran, how many passed, failed, or were skipped, along with the total execution time.',
          uk: '-   **Запустити один тест**: натисніть зелену іконку "play" поруч із будь-яким тестом, щоб запустити його. Кнопка запуску зміниться на зелену позначку, якщо тест пройде, або на червоний X, якщо тест впаде. Поруч із назвою тесту буде показано, скільки часу зайняв запуск. Крім того, внизу VS Code автоматично відкриється панель Test Results зі зведенням виконання тестів: скільки тестів запущено, скільки пройшли, впали або були пропущені, а також загальний час виконання.',
        },
        {
          en: "![run a single test](./images/getting-started/run-single-test.png)",
          uk: "![запуск одного тесту](./images/getting-started/run-single-test.png)",
        },
        {
          en: "-   **Run All Tests**: You can run all tests at different levels. Click the play icon next to a specific test file to run all tests within that file, or click the play icon at the very top of the Test Explorer to run all tests across your entire project.",
          uk: "-   **Запустити всі тести**: усі тести можна запускати на різних рівнях. Натисніть іконку play поруч із конкретним файлом тестів, щоб запустити всі тести в цьому файлі, або натисніть іконку play у верхній частині Test Explorer, щоб запустити всі тести в усьому проєкті.",
        },
        {
          en: "![run all tests](./images/getting-started/run-all-tests.png)",
          uk: "![запуск усіх тестів](./images/getting-started/run-all-tests.png)",
        },
        {
          en: "-   **Run on Multiple Browsers**: In the Playwright sidebar, check the boxes for the projects (browsers) you want to test against. Projects in Playwright represent different browser configurations - each project typically corresponds to a specific browser (like Chromium, Firefox, or WebKit) with its own settings such as viewport size, device emulation, or other browser-specific options. When you run a test, it will execute across all selected projects, allowing you to verify your application works consistently across different browsers and configurations.",
          uk: "-   **Запуск у кількох браузерах**: на бічній панелі Playwright позначте проєкти (браузери), у яких хочете виконати тести. Проєкти в Playwright представляють різні конфігурації браузера — кожен проєкт зазвичай відповідає певному браузеру (наприклад, Chromium, Firefox або WebKit) зі своїми налаштуваннями, як-от розмір viewport, емуляція пристрою або інші браузерні параметри. Коли ви запускаєте тест, він виконується в усіх вибраних проєктах, даючи змогу перевірити, що застосунок стабільно працює в різних браузерах і конфігураціях.",
        },
        {
          en: "![Selecting projects to run tests on](./images/getting-started/select-projects.png)",
          uk: "![вибір проєктів для запуску тестів](./images/getting-started/select-projects.png)",
        },
        {
          en: "-   **Show Browser**: To watch your tests execute in a live browser window, enable the **Show Browser** option in the sidebar. Disable it to run in headless mode (where tests run in the background without opening a visible browser window).",
          uk: "-   **Показувати браузер**: щоб спостерігати виконання тестів у живому вікні браузера, увімкніть параметр **Show Browser** на бічній панелі. Вимкніть його, щоб запускати тести в headless-режимі, коли вони виконуються у фоні без відкриття видимого вікна браузера.",
        },
        {
          en: "![show browsers while running tests](./images/getting-started/show-browser.png)",
          uk: "![показ браузерів під час запуску тестів](./images/getting-started/show-browser.png)",
        },
        {
          en: "### Debugging Your Tests",
          uk: "### Налагодження тестів",
        },
        {
          en: "The VS Code extension provides powerful debugging tools to help you identify and fix issues in your tests. You can set breakpoints, inspect variables, view detailed error messages, get AI-powered suggestions to resolve test failures, and use the comprehensive trace viewer to analyze test execution step-by-step.",
          uk: "Розширення VS Code надає потужні інструменти налагодження, які допомагають знаходити й виправляти проблеми в тестах. Ви можете ставити брейкпоїнти, переглядати змінні, бачити докладні повідомлення про помилки, отримувати AI-підказки для виправлення падінь тестів і використовувати повноцінний trace viewer для покрокового аналізу виконання тесту.",
        },
        {
          en: "-   **Using Breakpoints**: Set a breakpoint by clicking in the gutter next to a line number. Right-click the test and select **Debug Test**. The test will pause at your breakpoint, allowing you to inspect variables and step through the code.",
          uk: "-   **Використання брейкпоїнтів**: поставте брейкпоїнт, клацнувши в полі ліворуч від номера рядка. Клацніть тест правою кнопкою та виберіть **Debug Test**. Тест зупиниться на брейкпоїнті, і ви зможете переглянути змінні та покроково пройти код.",
        },
        {
          en: "![setting debug mode](./images/getting-started/debug-mode.png)",
          uk: "![налаштування режиму налагодження](./images/getting-started/debug-mode.png)",
        },
        {
          en: "-   **Live Debugging**: With **Show Browsers** enabled, click on a locator in your code. Playwright will highlight the corresponding element in the browser, making it easy to verify locators.",
          uk: "-   **Живе налагодження**: коли ввімкнено **Show Browsers**, клацніть локатор у коді. Playwright підсвітить відповідний елемент у браузері, тож локатори легко перевіряти.",
        },
        {
          en: "![live debugging in vs code](./images/getting-started/live-debugging.png)",
          uk: "![живе налагодження у vs code](./images/getting-started/live-debugging.png)",
        },
        {
          en: "-   **Viewing Error Messages**: If a test fails, the extension displays detailed error messages, including the expected vs. received values and a full call log, directly in the editor.",
          uk: "-   **Перегляд повідомлень про помилки**: якщо тест падає, розширення показує докладні повідомлення про помилки безпосередньо в редакторі, зокрема очікувані й отримані значення та повний журнал викликів.",
        },
        {
          en: "![error messaging in vs code](./images/getting-started/error-messaging.png)",
          uk: "![повідомлення про помилки у vs code](./images/getting-started/error-messaging.png)",
        },
        {
          en: "-   **Fix with AI**: When a test fails, click the sparkle icon next to the error to get an AI-powered fix suggestion from Copilot. Copilot analyzes the error and suggests a code change to resolve the issue.",
          uk: "-   **Виправлення за допомогою AI**: коли тест падає, натисніть іконку sparkle поруч із помилкою, щоб отримати від Copilot AI-пропозицію виправлення. Copilot аналізує помилку й пропонує зміну коду для розв'язання проблеми.",
        },
        {
          en: "![fix with ai in vs code](./images/getting-started/fix-with-ai.png)",
          uk: "![виправлення за допомогою ai у vs code](./images/getting-started/fix-with-ai.png)",
        },
        {
          en: "-   **Debugging with Trace Viewer**: For comprehensive debugging, enable the **Show Trace Viewer** option in the Playwright sidebar. When your test finishes, a detailed trace will automatically open, providing you with a complete timeline of your test execution. The trace viewer is particularly useful for:\n    - **Step-by-step analysis**: Navigate through each action your test performed with precise timestamps\n    - **DOM inspection**: View DOM snapshots at any point during test execution to see exactly what the page looked like\n    - **Network monitoring**: Examine all network requests and responses that occurred during the test\n    - **Console logs**: Access all console messages and errors from the browser\n    - **Source mapping**: Jump directly to the source code that executed each action\n    - **Visual debugging**: See screenshots and understand what the user would have seen at each step",
          uk: "-   **Налагодження через Trace Viewer**: для комплексного налагодження увімкніть параметр **Show Trace Viewer** на бічній панелі Playwright. Коли тест завершиться, автоматично відкриється докладна траса з повною часовою шкалою виконання тесту. Trace viewer особливо корисний для:\n    - **Покрокового аналізу**: переходьте між кожною дією тесту з точними часовими мітками\n    - **Інспекції DOM**: переглядайте DOM-знімки в будь-який момент виконання тесту, щоб точно бачити, який вигляд мала сторінка\n    - **Моніторингу мережі**: аналізуйте всі мережеві запити й відповіді, що відбулися під час тесту\n    - **Логів консолі**: отримуйте доступ до всіх повідомлень і помилок консолі з браузера\n    - **Source mapping**: переходьте безпосередньо до вихідного коду, який виконав кожну дію\n    - **Візуального налагодження**: переглядайте скриншоти й розумійте, що користувач бачив на кожному кроці",
        },
        {
          en: "The trace viewer is especially valuable when debugging flaky tests or understanding complex user interactions.",
          uk: "Trace viewer особливо корисний під час налагодження нестабільних тестів або розбору складних взаємодій користувача.",
        },
        {
          en: "![trace viewer debugging](./images/getting-started/trace-viewer-debug.png)",
          uk: "![налагодження у trace viewer](./images/getting-started/trace-viewer-debug.png)",
        },
        {
          en: "To learn more, see our [Trace Viewer guide](./trace-viewer.md).",
          uk: "Щоб дізнатися більше, перегляньте наш [посібник із Trace Viewer](./trace-viewer.md).",
        },
        {
          en: "### Generating Tests with CodeGen",
          uk: "### Генерування тестів за допомогою CodeGen",
        },
        {
          en: "CodeGen is Playwright's powerful test generation tool that automatically creates test code by recording your interactions with a web page. Instead of writing tests from scratch, you can simply navigate through your application while CodeGen captures your actions and converts them into reliable test code with proper locators and assertions.",
          uk: "CodeGen — це потужний інструмент Playwright для генерування тестів, який автоматично створює тестовий код, записуючи вашу взаємодію з вебсторінкою. Замість писати тести з нуля, ви можете просто пройтися застосунком, а CodeGen зафіксує ваші дії та перетворить їх на надійний тестовий код із правильними локаторами й перевірками.",
        },
        {
          en: "-   **Record a New Test**: Click **Record new** in the sidebar. A browser window will open. As you interact with the page, Playwright will automatically generate the test code. You can also generate assertions from the recording toolbar.",
          uk: "-   **Записати новий тест**: натисніть **Record new** на бічній панелі. Відкриється вікно браузера. Поки ви взаємодієте зі сторінкою, Playwright автоматично генеруватиме тестовий код. Також можна генерувати перевірки з панелі запису.",
        },
        {
          en: "![record a new test](./images/getting-started/record-new-test.png)",
          uk: "![запис нового тесту](./images/getting-started/record-new-test.png)",
        },
        {
          en: "-   **Record at Cursor**: Place your cursor inside an existing test and click **Record at cursor** to add new actions at that specific point.\n![record at cursor](./images/getting-started/record-at-cursor.png)",
          uk: "-   **Записати в позиції курсора**: поставте курсор усередині наявного тесту й натисніть **Record at cursor**, щоб додати нові дії саме в цьому місці.\n![запис у позиції курсора](./images/getting-started/record-at-cursor.png)",
        },
        {
          en: "-   **Pick a Locator**: Use the **Pick locator** tool to click on any element in the opened browser. Playwright will determine the best locator and copy it to your clipboard, ready to be pasted into your code.",
          uk: "-   **Вибрати локатор**: використайте інструмент **Pick locator**, щоб клацнути будь-який елемент у відкритому браузері. Playwright визначить найкращий локатор і скопіює його в буфер обміну, готовим до вставлення у ваш код.",
        },
        {
          en: "![pick locators](./images/getting-started/pick-locator.png)",
          uk: "![вибір локаторів](./images/getting-started/pick-locator.png)",
        },
        {
          en: "To learn more, see our [CodeGen guide](./codegen.md).",
          uk: "Щоб дізнатися більше, перегляньте наш [посібник із CodeGen](./codegen.md).",
        },
      ],
    },
    {
      id: "advanced-features",
      title: {
        en: "Advanced Features",
        uk: "Розширені можливості",
      },
      paragraphs: [
        {
          en: "### Project Dependencies",
          uk: "### Залежності проєктів",
        },
        {
          en: "Use [project dependencies](./test-projects.md) to define setup tests that run before other tests. For example, you can create a login test that runs first, then reuse that authenticated state across multiple tests without having to log in again for each test. In VS Code, you can see these setup tests in the Test Explorer and run them independently when needed.",
          uk: "Використовуйте [залежності проєктів](./test-projects.md), щоб визначати setup-тести, які запускаються перед іншими тестами. Наприклад, можна створити тест входу, який виконується першим, а потім повторно використовувати цей автентифікований стан у кількох тестах без потреби входити знову в кожному тесті. У VS Code ці setup-тести видно в Test Explorer, і за потреби їх можна запускати окремо.",
        },
        {
          en: "![setup tests in vscode](./images/getting-started/setup-tests.png)",
          uk: "![setup-тести у vscode](./images/getting-started/setup-tests.png)",
        },
        {
          en: "To learn more, see our [Project Dependencies guide](./test-projects.md).",
          uk: "Щоб дізнатися більше, перегляньте наш [посібник із залежностей проєктів](./test-projects.md).",
        },
        {
          en: "### Global Setup",
          uk: "### Глобальне налаштування",
        },
        {
          en: "For tasks that need to run only once before all tests (like seeding a database), use **Global Setup**. You can trigger the global setup and teardown manually from the Playwright sidebar.",
          uk: "Для завдань, які потрібно виконати лише один раз перед усіма тестами (наприклад, наповнення бази даних), використовуйте **Global Setup**. Глобальне налаштування й teardown можна запускати вручну з бічної панелі Playwright.",
        },
        {
          en: "![running global setup](./images/getting-started/global-setup.png)",
          uk: "![запуск global setup](./images/getting-started/global-setup.png)",
        },
        {
          en: "### Multiple Configurations",
          uk: "### Кілька конфігурацій",
        },
        {
          en: "If you have multiple `playwright.config.ts` files, you can switch between them using the gear icon in the Playwright sidebar. This allows you to easily work with different test suites or environments.",
          uk: "Якщо у вас є кілька файлів `playwright.config.ts`, між ними можна перемикатися за допомогою іконки шестерні на бічній панелі Playwright. Це дає змогу легко працювати з різними наборами тестів або середовищами.",
        },
        {
          en: "![Selecting a configuration file](./images/getting-started/selecting-configuration.png)",
          uk: "![вибір файлу конфігурації](./images/getting-started/selecting-configuration.png)",
        },
      ],
    },
    {
      id: "quick-reference",
      title: {
        en: "Quick Reference",
        uk: "Короткий довідник",
      },
      paragraphs: [
        {
          en: '| Action                  | How to do it in VS Code                                     |\n| ----------------------- | ----------------------------------------------------------- |\n| **Install Playwright**  | Command Palette → `Test: Install Playwright`                |\n| **Run a Test**          | Click the "play" icon next to the test                      |\n| **Debug a Test**        | Set a breakpoint, right-click the test → `Debug Test`       |\n| **Show Live Browser**   | Enable `Show Browsers` in the Playwright sidebar            |\n| **Record a New Test**   | Click `Record new` in the Playwright sidebar                |\n| **Pick a Locator**      | Click `Pick locator` in the Playwright sidebar              |\n| **View Test Trace**     | Enable `Show Trace Viewer` in the Playwright sidebar        |',
          uk: '| Дія                     | Як це зробити у VS Code                                    |\n| ----------------------- | ----------------------------------------------------------- |\n| **Встановити Playwright** | Command Palette → `Test: Install Playwright`              |\n| **Запустити тест**      | Натисніть іконку "play" поруч із тестом                    |\n| **Налагодити тест**     | Поставте брейкпоїнт, клацніть тест правою кнопкою → `Debug Test` |\n| **Показати живий браузер** | Увімкніть `Show Browsers` на бічній панелі Playwright      |\n| **Записати новий тест** | Натисніть `Record new` на бічній панелі Playwright          |\n| **Вибрати локатор**     | Натисніть `Pick locator` на бічній панелі Playwright        |\n| **Переглянути трасу тесту** | Увімкніть `Show Trace Viewer` на бічній панелі Playwright |',
        },
      ],
    },
    {
      id: "what-s-next",
      title: {
        en: "What's Next",
        uk: "Що далі",
      },
      paragraphs: [
        {
          en: "-   [Write tests using web-first assertions, page fixtures, and locators](./writing-tests.md)\n-   [Run your tests on CI](./ci-intro.md)\n-   [Learn more about the Trace Viewer](./trace-viewer.md)",
          uk: "-   [Пишіть тести з web-first перевірками, фікстурами сторінок і локаторами](./writing-tests.md)\n-   [Запускайте тести в CI](./ci-intro.md)\n-   [Дізнайтеся більше про Trace Viewer](./trace-viewer.md)",
        },
      ],
    },
  ],
  quiz: [],
}
