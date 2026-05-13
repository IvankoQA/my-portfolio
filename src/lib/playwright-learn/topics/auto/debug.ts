import type { PlaywrightTopic } from "../../types"

export const debugTopic: PlaywrightTopic = {
  slug: "debug",
  groupId: "guides",
  order: 165,
  sourceDoc: "debug.md",
  officialDocsUrl: "https://playwright.dev/docs/debug",
  title: {
    en: "Debugging Tests",
    uk: "Дебаг тестів",
  },
  summary: {
    en: "Debug Playwright tests in VS Code, the Inspector, and Chrome DevTools — with a TypeScript-first workflow.",
    uk: "Дебаг тестів Playwright у VS Code, Inspector і Chrome DevTools — з акцентом на TypeScript.",
  },
  sections: [
    {
      id: "vs-code-debugger",
      title: {
        en: "VS Code debugger",
        uk: "Дебагер VS Code",
      },
      paragraphs: [
        {
          en: "We recommend using the [VS Code Extension](./getting-started-vscode.md) for debugging for a better developer experience. With the VS Code extension you can debug your tests right in VS Code, see error messages, set breakpoints and step through your tests.",
          uk: "Для дебагу зручно [розширення VS Code](./getting-started-vscode.md): помилки в редакторі, breakpoints, покроковий прохід тесту.",
        },
        {
          en: "### Error Messages",
          uk: "### Повідомлення про помилки",
        },
        {
          en: "If your test fails VS Code will show you error messages right in the editor showing what was expected, what was received as well as a complete call log.",
          uk: "Якщо тест падає, VS Code покаже очікуване й фактичне значення та повний call log прямо в редакторі.",
        },
        {
          en: "### Live Debugging",
          uk: "### Живий дебаг",
        },
        {
          en: "You can debug your test live in VS Code. After running a test with the `Show Browser` option checked, click on any of the locators in VS Code and it will be highlighted in the Browser window. Playwright will also show you if there are multiple matches.",
          uk: "Можна дебажити «вживу»: увімкніть `Show Browser`, клікніть по локатору в коді — він підсвітиться у вікні браузера; видно також кілька збігів.",
        },
        {
          en: "You can also edit the locators in VS Code and Playwright will show you the changes live in the browser window.",
          uk: "Редагування локатора в VS Code одразу відображається в браузері.",
        },
        {
          en: "### Picking a Locator",
          uk: "### Підбір локатора",
        },
        {
          en: "Pick a [locator](./locators.md) and copy it into your test file by clicking the **Pick locator** button from the testing sidebar. Then in the browser click the element you require and it will now show up in the **Pick locator** box in VS Code. Press 'enter' on your keyboard to copy the locator into the clipboard and then paste anywhere in your code. Or press 'escape' if you want to cancel.",
          uk: "Натисніть **Pick locator** у панелі тестів, клікніть потрібний елемент у браузері — рядок з’явиться в полі **Pick locator** у VS Code. Enter копіює в буфер, Escape скасовує. Детальніше про [locators](./locators.md).",
        },
        {
          en: "Playwright will look at your page and figure out the best locator, prioritizing [role, text and test id locators](./locators.md). If Playwright finds multiple elements matching the locator, it will improve the locator to make it resilient and uniquely identify the target element, so you don't have to worry about failing tests due to locators.",
          uk: "Playwright підбере стійкий локатор з пріоритетом [role, text і test id](./locators.md); за кількох збігів уточнить вираз, щоб унікально вказати на елемент.",
        },
        {
          en: "### Run in Debug Mode",
          uk: "### Запуск у режимі дебагу",
        },
        {
          en: "To set a breakpoint click next to the line number where you want the breakpoint to be until a red dot appears. Run the tests in debug mode by right clicking on the line next to the test you want to run.",
          uk: "Клікніть ліворуч від номера рядка, щоб з’явилася червона крапка (breakpoint). Правий клік біля тесту — запуск у debug mode.",
        },
        {
          en: "A browser window will open and the test will run and pause at where the breakpoint is set. You can step through the tests, pause the test and rerun the tests from the menu in VS Code.",
          uk: "Відкриється браузер, виконання зупиниться на breakpoint. Далі — кроки, пауза й повторний запуск з меню VS Code.",
        },
        {
          en: "### Debug Tests Using Chrome DevTools",
          uk: "### Дебаг через Chrome DevTools",
        },
        {
          en: "Instead of using `Debug Test`, choose `Run Test` in VS Code. With `Show Browser` enabled, the browser session is reused, letting you open Chrome DevTools for continuous debugging of your tests and the web application.",
          uk: "Замість `Debug Test` оберіть `Run Test` і `Show Browser`: сесія браузера лишається відкритою, можна користуватися Chrome DevTools для дебагу тесту й застосунку.",
        },
        {
          en: "### Debug in different Browsers",
          uk: "### Дебаг у різних браузерах",
        },
        {
          en: "By default, debugging is done using the Chromium profile. You can debug your tests on different browsers by right clicking on the debug icon in the testing sidebar and clicking on the 'Select Default Profile' option from the dropdown.",
          uk: "За замовчуванням використовується профіль Chromium. Інший браузер — правий клік по іконці дебагу в сайдбарі тестів → «Select Default Profile».",
        },
        {
          en: "Then choose the test profile you would like to use for debugging your tests. Each time you run your test in debug mode it will use the profile you selected. You can run tests in debug mode by right clicking the line number where your test is and selecting 'Debug Test' from the menu.",
          uk: "Оберіть профіль — він використовуватиметься при кожному debug. Запуск: правий клік на номері рядка тесту → Debug Test.",
        },
        {
          en: "To learn more about debugging, see [Debugging in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging).",
          uk: "Докладніше: [Debugging in Visual Studio Code](https://code.visualstudio.com/docs/editor/debugging).",
        },
      ],
    },
    {
      id: "playwright-inspector",
      title: {
        en: "Playwright Inspector",
        uk: "Playwright Inspector",
      },
      paragraphs: [
        {
          en: "The Playwright Inspector is a GUI tool to help you debug your Playwright tests. It allows you to step through your tests, live edit locators, pick locators and see actionability logs.",
          uk: "Playwright Inspector — графічний інструмент для дебагу: покроковий прохід, живе редагування та підбір локаторів, логи actionability.",
        },
        {
          en: "### Run in debug mode",
          uk: "### Запуск у режимі дебагу",
        },
        {
          en: "Run your tests with the `--debug` flag to open the inspector. This configures Playwright for debugging and opens the inspector. Additional useful defaults are configured when `--debug` is used:",
          uk: "Запустіть тести з `--debug` — відкриється Inspector і ввімкнуться типові налаштування для дебагу:",
        },
        {
          en: "- Browsers launch in headed mode\n- Default timeout is set to 0 (= no timeout)",
          uk: "- Браузер у headed-режимі\n- Таймаут за замовчуванням 0 (без обмеження)",
        },
        {
          en: "#### Debug all tests on all browsers",
          uk: "#### Усі тести в усіх браузерах",
        },
        {
          en: "To debug all tests run the test command with the `--debug` flag. This will run tests one by one, and open the inspector and a browser window for each test.",
          uk: "`--debug` для всіх тестів: вони йдуть по одному, для кожного відкриваються Inspector і вікно браузера.",
        },
        {
          en: "#### Debug one test on all browsers",
          uk: "#### Один тест у всіх браузерах",
        },
        {
          en: "To debug one test on a specific line, run the test command followed by the name of the test file and the line number of the test you want to debug, followed by the `--debug` flag. This will run a single test in each browser configured in your [`playwright.config`](./test-projects.md#configure-projects-for-multiple-browsers) and open the inspector.",
          uk: "Вкажіть файл і номер рядка тесту та `--debug` — один тест прогониться в кожному браузері з [`playwright.config`](./test-projects.md#configure-projects-for-multiple-browsers) з відкритим Inspector.",
        },
        {
          en: "#### Debug on a specific browser",
          uk: "#### Один браузер / проєкт",
        },
        {
          en: "In Playwright you can configure projects in your [`playwright.config`](./test-projects.md#configure-projects-for-multiple-browsers). Once configured you can then debug your tests on a specific browser or mobile viewport using the `--project` flag followed by the name of the project configured in your `playwright.config`.",
          uk: "У [`playwright.config`](./test-projects.md#configure-projects-for-multiple-browsers) задайте проєкти, потім `--project=<ім’я>` для дебагу в конкретному браузері або viewport.",
        },
        {
          en: "#### Debug one test on a specific browser",
          uk: "#### Один тест у конкретному браузері",
        },
        {
          en: "To run one test on a specific browser add the name of the test file and the line number of the test you want to debug as well as the `--project` flag followed by the name of the project.",
          uk: "Комбінуйте файл:рядок тесту з `--project=<ім’я проєкту>`.",
        },
        {
          en: "### Run in debug mode from the terminal",
          uk: "### Запуск у режимі дебагу з терміналу",
        },
        {
          en: "Set the `PWDEBUG` environment variable to run your Playwright tests in debug mode. This\nconfigures Playwright for debugging and opens the inspector. Additional useful defaults are configured when `PWDEBUG=1` is set:",
          uk: "Змінна середовища `PWDEBUG=1` увімкне дебаг і Inspector з тими самими корисними дефолтами:",
        },
        {
          en: "- Browsers launch in headed mode\n- Default timeout is set to 0 (= no timeout)",
          uk: "- Браузер у headed-режимі\n- Таймаут за замовчуванням 0 (без обмеження)",
        },
        {
          en: "#### Configure source location (Java)",
          uk: "#### Шлях до вихідного коду (Java)",
        },
        {
          en: "To tell Playwright where to look for the source code that you are debugging, pass\na list of the source directories via `PLAYWRIGHT_JAVA_SRC` environment variable. Paths in\nthe list should be separated by : on macOS and Linux, and by ; on Windows.",
          uk: "Щоб Inspector мапив стек на Java-файли, задайте каталоги в `PLAYWRIGHT_JAVA_SRC` (розділювач `:` на macOS/Linux, `;` на Windows).",
        },
        {
          en: "### Stepping through your tests",
          uk: "### Покроковий прохід",
        },
        {
          en: "You can play, pause or step through each action of your test using the toolbar at the top of the Inspector. You can see the current action highlighted in the test code, and matching elements highlighted in the browser window.",
          uk: "Панель Inspector: play/pause/крок. Поточна дія підсвічена в коді, збіги — у вікні браузера.",
        },
        {
          en: "### Run a test from a specific breakpoint",
          uk: "### Зупинка на `page.pause()`",
        },
        {
          en: "To speed up the debugging process you can add a [`method: Page.pause`] method to your test. This way you won't have to step through each action of your test to get to the point where you want to debug.",
          uk: "Додайте [`method: Page.pause`], щоб одразу зупинитися в потрібному місці без покрокового проходу всього тесту.",
        },
        {
          en: 'Once you add a `page.pause()` call, run your tests in debug mode. Clicking the "Resume" button in the Inspector will run the test and only stop on the `page.pause()`.',
          uk: "Після `page.pause()` запустіть дебаг; кнопка Resume докрутить тест до наступного `page.pause()`.",
        },
        {
          en: "### Live editing locators",
          uk: "### Живе редагування локаторів",
        },
        {
          en: "While running in debug mode you can live edit the locators. Next to the 'Pick Locator' button there is a field showing the [locator](./locators.md) that the test is paused on. You can edit this locator directly in the **Pick Locator** field, and matching elements will be highlighted in the browser window.",
          uk: "У дебаг-режимі редагуйте [локатор](./locators.md) у полі **Pick Locator** — збіги одразу видно в браузері.",
        },
        {
          en: "### Picking locators",
          uk: "### Підбір локаторів",
        },
        {
          en: "While debugging, you might need to choose a more resilient locator. You can do this by clicking on the **Pick Locator** button and hovering over any element in the browser window. While hovering over an element you will see the code needed to locate this element highlighted below. Clicking an element in the browser will add the locator into the field where you can then either tweak it or copy it into your code.",
          uk: "**Pick Locator** + наведення на елемент показує код локатора; клік додає його в поле для правок або копіювання.",
        },
        {
          en: "Playwright will look at your page and figure out the best locator, prioritizing [role, text and test id locators](./locators.md). If Playwright finds multiple elements matching the locator, it will improve the locator to make it resilient and uniquely identify the target element, so you don't have to worry about failing tests due to locators.",
          uk: "Playwright підбере стійкий локатор з пріоритетом [role, text і test id](./locators.md); за потреби уточнить вираз для унікального збігу.",
        },
        {
          en: "### Actionability logs",
          uk: "### Логи actionability",
        },
        {
          en: "By the time Playwright has paused on a click action, it has already performed [actionability checks](./actionability.md) that can be found in the log. This can help you understand what happened during your test and what Playwright did or tried to do. The log tells you if the element was visible, enabled and stable, if the locator resolved to an element, scrolled into view, and so much more. If actionability can't be reached, it will show the action as pending.",
          uk: "Після паузи на кліку в логах видно [перевірки actionability](./actionability.md): видимість, enabled, стабільність, прокрутка в зону видимості тощо. Якщо умови не виконані — дія в статусі pending.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright test --debug",
        },
        {
          id: "cb-2",
          language: "bash",
          code: "npx playwright test example.spec.ts:10 --debug",
        },
        {
          id: "cb-3",
          language: "bash",
          code: 'npx playwright test --project=chromium --debug\nnpx playwright test --project="Mobile Safari" --debug\nnpx playwright test --project="Microsoft Edge" --debug',
        },
        {
          id: "cb-4",
          language: "bash",
          code: "npx playwright test example.spec.ts:10 --project=webkit --debug",
        },
        {
          id: "cb-14",
          language: "js",
          code: "await page.pause();",
        },
      ],
    },
    {
      id: "trace-viewer",
      title: {
        en: "Trace Viewer",
        uk: "Trace Viewer",
      },
      paragraphs: [
        {
          en: "Playwright [Trace Viewer](/trace-viewer.md) is a GUI tool that lets you explore recorded Playwright traces of your tests. You can go back and forward through each action on the left side, and visually see what was happening during the action. In the middle of the screen, you can see a DOM snapshot for the action. On the right side you can see action details, such as time, parameters, return value and log. You can also explore console messages, network requests and the source code.",
          uk: "[Trace Viewer](/trace-viewer.md) у Playwright — інтерфейс для перегляду записаних трейсів: зліва кроки туди-назад, по центру знімок DOM на дію, справа час, параметри, повернене значення й лог; також консоль, мережа та вихідний код.",
        },
        {
          en: "To learn more about how to record traces and use the Trace Viewer, check out the [Trace Viewer](/trace-viewer.md) guide.",
          uk: "Як записувати трейси й користуватися переглядачем — у посібнику [Trace Viewer](/trace-viewer.md).",
        },
      ],
    },
    {
      id: "browser-developer-tools",
      title: {
        en: "Browser Developer Tools",
        uk: "Інструменти розробника браузера",
      },
      paragraphs: [
        {
          en: "When running in Debug Mode with `PWDEBUG=console`, a `playwright` object is available in the Developer tools console. Developer tools can help you to:",
          uk: "З `PWDEBUG=console` у консолі DevTools доступний об’єкт `playwright`. Це допомагає:",
        },
        {
          en: "- Inspect the DOM tree and **find element selectors**\n- **See console logs** during execution (or learn how to [read logs via API](./api/class-page.md#page-event-console))\n- Check **network activity** and other developer tools features",
          uk: "- Переглядати DOM і **підбирати селектори**\n- **Бачити логи консолі** під час виконання (або [читати логи через API](./api/class-page.md#page-event-console))\n- Дивитися **мережу** та інші можливості DevTools",
        },
        {
          en: "To debug your tests using the browser developer tools, start by setting a breakpoint in your test to pause the execution using the [`method: Page.pause`] method.",
          uk: "Для дебагу через DevTools поставте паузу в тесті через [`method: Page.pause`].",
        },
        {
          en: "Once you have set a breakpoint in your test, you can then run your test with `PWDEBUG=console`.",
          uk: "Потім запустіть тести з `PWDEBUG=console`.",
        },
        {
          en: "Once Playwright launches the browser window, you can open the developer tools.\nThe `playwright` object will be available in the console panel.",
          uk: "Після відкриття вікна браузера відкрийте DevTools — об’єкт `playwright` з’явиться в консолі.",
        },
        {
          en: "#### playwright.$(selector)",
          uk: "#### playwright.$(selector)",
        },
        {
          en: "Query the Playwright selector, using the actual Playwright query engine, for example:",
          uk: "Запит селектора рушієм Playwright, наприклад:",
        },
        {
          en: "#### playwright.$$(selector)",
          uk: "#### playwright.$$(selector)",
        },
        {
          en: "Same as `playwright.$`, but returns all matching elements.",
          uk: "Як `playwright.$`, але повертає усі збіги.",
        },
        {
          en: "#### playwright.inspect(selector)",
          uk: "#### playwright.inspect(selector)",
        },
        {
          en: "Reveal element in the Elements panel.",
          uk: "Показати елемент на панелі Elements.",
        },
        {
          en: "#### playwright.locator(selector)",
          uk: "#### playwright.locator(selector)",
        },
        {
          en: "Create a locator and query matching elements, for example:",
          uk: "Створити локатор і знайти елементи, наприклад:",
        },
        {
          en: "#### playwright.selector(element)",
          uk: "#### playwright.selector(element)",
        },
        {
          en: "Generates selector for the given element. For example, select an element in the Elements panel and pass `$0`:",
          uk: "Генерує селектор для елемента: виділіть вузол у Elements і передайте `$0`:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-19",
          language: "js",
          code: "await page.pause();",
        },
        {
          id: "cb-24",
          language: "bash",
          code: "PWDEBUG=console npx playwright test",
        },
        {
          id: "cb-25",
          language: "batch",
          code: "set PWDEBUG=console\nnpx playwright test",
        },
        {
          id: "cb-26",
          language: "powershell",
          code: '$env:PWDEBUG="console"\nnpx playwright test',
        },
        {
          id: "cb-36",
          language: "bash",
          code: "playwright.$('.auth-form >> text=Log in');\n\nLog in",
        },
        {
          id: "cb-37",
          language: "bash",
          code: "playwright.$$('li >> text=John')\n\n[, , , ]",
        },
        {
          id: "cb-38",
          language: "bash",
          code: "playwright.inspect('text=Log in')",
        },
        {
          id: "cb-39",
          language: "bash",
          code: "playwright.locator('.auth-form', { hasText: 'Log in' });\n\nLocator ()\n  - element: button\n  - elements: [button]",
        },
        {
          id: "cb-40",
          language: "bash",
          code: 'playwright.selector($0)\n\n"div[id="glow-ingress-block"] >> text=/.*Hello.*/"',
        },
      ],
    },
    {
      id: "verbose-api-logs",
      title: {
        en: "Verbose API logs",
        uk: "Детальні логи API",
      },
      paragraphs: [
        {
          en: "Playwright supports verbose logging with the `DEBUG` environment variable.",
          uk: "Детальне логування вмикається змінною середовища `DEBUG`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-41",
          language: "bash",
          code: "DEBUG=pw:api npx playwright test",
        },
        {
          id: "cb-42",
          language: "batch",
          code: "set DEBUG=pw:api\nnpx playwright test",
        },
        {
          id: "cb-43",
          language: "powershell",
          code: '$env:DEBUG="pw:api"\nnpx playwright test',
        },
      ],
    },
    {
      id: "headed-mode",
      title: {
        en: "Headed mode",
        uk: "Режим з видимим вікном (headed)",
      },
      paragraphs: [
        {
          en: "Playwright runs browsers in headless mode by default. To change this behavior,\nuse `headless: false` as a launch option.",
          uk: "За замовчуванням браузер у headless. Щоб бачити вікно,\nпередайте `headless: false` при запуску.",
        },
        {
          en: "You can also use the [`option: BrowserType.launch.slowMo`] option\nto slow down execution (by N milliseconds per operation) and follow along while debugging.",
          uk: "Опція [`option: BrowserType.launch.slowMo`]\nсповільнює кожну операцію на N мс — зручно стежити під час дебагу.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-53",
          language: "js",
          code: "// Chromium, Firefox, or WebKit\nawait chromium.launch({ headless: false, slowMo: 100 });",
        },
      ],
    },
  ],
  quiz: [],
}
