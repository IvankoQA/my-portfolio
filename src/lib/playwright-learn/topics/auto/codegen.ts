import type { PlaywrightTopic } from "../../types"

export const codegenTopic: PlaywrightTopic = {
  slug: "codegen",
  groupId: "getting-started",
  order: 155,
  sourceDoc: "codegen.md",
  officialDocsUrl: "https://playwright.dev/docs/codegen",
  title: {
    en: "Test generator",
    uk: "Генератор тестів",
  },
  summary: {
    en: "Playwright comes with the ability to generate tests for you as you perform actions in the browser and is a great way to quickly get started with testing. Playwright will look at your page and figure out the best locator, prioritizing [role, text and test id locators](./locators.md). If the generator finds multiple elements matching the locator, it will improve the locator to make it resilient that uniquely identif…",
    uk: "Генератор тестів: Playwright записує дії в браузері й підбирає стійкі локатори (наприклад [роль, текст і test id](./locators.md)), щоб швидко почати з автотестів.",
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
          en: "Playwright comes with the ability to generate tests for you as you perform actions in the browser and is a great way to quickly get started with testing. Playwright will look at your page and figure out the best locator, prioritizing [role, text and test id locators](./locators.md). If the generator finds multiple elements matching the locator, it will improve the locator to make it resilient that uniquely identify the target element.",
          uk: "Playwright вміє генерувати тести автоматично в процесі ваших дій у браузері — це відмінний спосіб швидко розпочати тестування. Playwright аналізує сторінку і підбирає найкращий локатор, надаючи перевагу [локаторам за роллю, текстом і test id](./locators.md). Якщо генератор знаходить кілька елементів, що відповідають локатору, він покращує його, щоб той однозначно ідентифікував цільовий елемент.",
        },
      ],
    },
    {
      id: "generate-tests-in-vs-code",
      title: {
        en: "Generate tests in VS Code",
        uk: "Генерація тестів у VS Code",
      },
      paragraphs: [
        {
          en: "Install the VS Code extension and generate tests directly from VS Code. The extension is available on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). Check out our guide on [getting started with VS Code](./getting-started-vscode.md).",
          uk: "Встановіть розширення VS Code і генеруйте тести безпосередньо у VS Code. Розширення доступне на [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). Ознайомтеся з нашим посібником із [початку роботи у VS Code](./getting-started-vscode.md).",
        },
        {
          en: "### Record a New Test",
          uk: "### Запис нового тесту",
        },
        {
          en: "To record a test click on the **Record new** button from the Testing sidebar. This will create a `test-1.spec.ts` file as well as open up a browser window.",
          uk: "Щоб записати тест, натисніть кнопку **Record new** у бічній панелі Testing. Це створить файл `test-1.spec.ts` і відкриє вікно браузера.",
        },
        {
          en: "In the browser go to the URL you wish to test and start clicking around to record your user actions.",
          uk: "У браузері перейдіть на URL, який ви хочете тестувати, і почніть клікати, щоб записувати дії користувача.",
        },
        {
          en: "Playwright will record your actions and generate the test code directly in VS Code. You can also generate assertions by choosing one of the icons in the toolbar and then clicking on an element on the page to assert against. The following assertions can be generated:\n  * `'assert visibility'` to assert that an element is visible\n  * `'assert text'` to assert that an element contains specific text\n  * `'assert value'` to assert that an element has a specific value",
          uk: "Playwright запише ваші дії і згенерує код тесту безпосередньо у VS Code. Також можна генерувати перевірки, обравши одну з іконок на панелі інструментів і клікнувши на елемент сторінки для перевірки. Можна генерувати такі перевірки:\n  * `'assert visibility'` — перевіряє видимість елемента\n  * `'assert text'` — перевіряє, чи елемент містить певний текст\n  * `'assert value'` — перевіряє, чи елемент має певне значення",
        },
        {
          en: "Once you are done recording click the **cancel** button or close the browser window. You can then inspect your `test-1.spec.ts` file and manually improve it if needed.",
          uk: "Після завершення запису натисніть кнопку **cancel** або закрийте вікно браузера. Потім можна перевірити файл `test-1.spec.ts` і за потреби доопрацювати його вручну.",
        },
        {
          en: "### Record at Cursor",
          uk: "### Запис у позиції курсору",
        },
        {
          en: "To record from a specific point in your test move your cursor to where you want to record more actions and then click the **Record at cursor** button from the Testing sidebar. If your browser window is not already open then first run the test with 'Show browser' checked and then click the **Record at cursor** button.",
          uk: "Щоб записати дії з певної точки тесту, помістіть курсор туди, де хочете продовжити запис, і натисніть **Record at cursor** у бічній панелі Testing. Якщо вікно браузера ще не відкрито, спочатку запустіть тест із позначкою 'Show browser', а потім натисніть **Record at cursor**.",
        },
        {
          en: "In the browser window start performing the actions you want to record.",
          uk: "У вікні браузера виконайте дії, які хочете записати.",
        },
        {
          en: "In the test file in VS Code you will see your new generated actions added to your test at the cursor position.",
          uk: "У файлі тесту у VS Code побачите нові згенеровані дії, додані в позиції курсору.",
        },
        {
          en: "### Generating locators",
          uk: "### Генерація локаторів",
        },
        {
          en: "You can generate locators with the test generator.\n- Click on the **Pick locator** button from the testing sidebar and then hover over elements in the browser window to see the [locator](./locators.md) highlighted underneath each element.\n- Click the element you require and it will now show up in the **Pick locator** box in VS Code.\n- Press Enter on your keyboard to copy the locator into the clipboard and then paste anywhere in your code. Or press 'escape' if you want to cancel.",
          uk: "Локатори можна генерувати за допомогою генератора тестів.\n- Натисніть **Pick locator** у бічній панелі Testing і наведіть курсор на елементи у вікні браузера — [локатор](./locators.md) підсвічуватиметься під кожним елементом.\n- Натисніть потрібний елемент — його локатор з'явиться у полі **Pick locator** у VS Code.\n- Натисніть Enter, щоб скопіювати локатор у буфер обміну і вставити в потрібне місце коду.\n\nАбо Escape для скасування.",
        },
      ],
    },
    {
      id: "generate-tests-with-the-playwright-inspector",
      title: {
        en: "Generate tests with the Playwright Inspector",
        uk: "Генерація тестів через Playwright Inspector",
      },
      paragraphs: [
        {
          en: "When running the `codegen` command two windows will be opened, a browser window where you interact with the website you wish to test and the Playwright Inspector window where you can record your tests and then copy them into your editor.",
          uk: "Після виконання команди `codegen` відкриються два вікна: вікно браузера для взаємодії з сайтом і вікно Playwright Inspector для запису тестів і копіювання в редактор.",
        },
        {
          en: "### Running Codegen",
          uk: "### Запуск Codegen",
        },
        {
          en: "Use the `codegen` command to run the test generator followed by the URL of the website you want to generate tests for. The URL is optional and you can always run the command without it and then add the URL directly into the browser window instead.",
          uk: "Виконайте команду `codegen` із зазначенням URL сайту, для якого хочете генерувати тести. URL не обов'язковий — його можна додати прямо у вікні браузера.",
        },
        {
          en: "### Recording a test",
          uk: "### Запис тесту",
        },
        {
          en: "Run the `codegen` command and perform actions in the browser window. Playwright will generate the code for the user interactions which you can see in the Playwright Inspector window. Once you have finished recording your test stop the recording and press the **copy** button to copy your generated test into your editor.",
          uk: "Запустіть `codegen` і виконуйте дії у вікні браузера. Playwright генерує код для взаємодій користувача, який можна бачити у вікні Playwright Inspector. Після завершення зупиніть запис і натисніть кнопку **copy**, щоб скопіювати згенерований тест у редактор.",
        },
        {
          en: "With the test generator you can record:\n* Actions like click or fill by simply interacting with the page\n* Assertions by clicking on one of the icons in the toolbar and then clicking on an element on the page to assert against. You can choose:\n  * `'assert visibility'` to assert that an element is visible\n  * `'assert text'` to assert that an element contains specific text\n  * `'assert value'` to assert that an element has a specific value",
          uk: "За допомогою генератора тестів можна записати:\n* Дії: клік, заповнення поля — просто взаємодіючи зі сторінкою\n* Перевірки: натисніть іконку на панелі, потім елемент для перевірки. Можна вибрати:\n  * `'assert visibility'` — перевіряє видимість елемента\n  * `'assert text'` — перевіряє текстовий вміст елемента\n  * `'assert value'` — перевіряє значення елемента",
        },
        {
          en: "When you have finished interacting with the page, press the **record** button to stop the recording and use the **copy** button to copy the generated code to your editor.",
          uk: "Після завершення взаємодії натисніть кнопку **record**, щоб зупинити запис, і кнопку **copy**, щоб скопіювати згенерований код у редактор.",
        },
        {
          en: "Use the **clear** button to clear the code to start recording again. Once finished, close the Playwright inspector window or stop the terminal command.",
          uk: "Натисніть **clear**, щоб очистити код і почати запис знову. Після завершення закрийте вікно Playwright Inspector або зупиніть команду в терміналі.",
        },
        {
          en: "### Generating locators\nYou can generate [locators](/locators.md) with the test generator.",
          uk: "### Генерація локаторів\nЛокатори можна генерувати за допомогою генератора тестів.",
        },
        {
          en: "* Press the `'Record'` button to stop the recording and the `'Pick Locator'` button will appear.\n* Click on the `'Pick Locator'` button and then hover over elements in the browser window to see the locator highlighted underneath each element.\n* To choose a locator, click on the element you would like to locate and the code for that locator will appear in the field next to the Pick Locator button.\n* You can then edit the locator in this field to fine tune it or use the copy button to copy it and paste it into your code.",
          uk: "* Натисніть кнопку `'Record'`, щоб зупинити запис — з'явиться кнопка `'Pick Locator'`.\n* Натисніть `'Pick Locator'` і наведіть курсор на елементи у вікні браузера — локатор підсвічуватиметься під кожним елементом.\n* Натисніть потрібний елемент — його код локатора з'явиться у полі поряд із кнопкою Pick Locator.\n* Відредагуйте локатор у цьому полі або скористайтесь кнопкою копіювання, щоб вставити його у свій код.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright codegen demo.playwright.dev/todomvc",
        },
      ],
    },
    {
      id: "emulation",
      title: {
        en: "Emulation",
        uk: "Емуляція",
      },
      paragraphs: [
        {
          en: "You can use the test generator to generate tests using emulation so as to generate a test for a specific viewport, device, color scheme, as well as emulate the geolocation, language or timezone. The test generator can also generate a test while preserving authenticated state.",
          uk: "За допомогою генератора тестів можна генерувати тести з емуляцією для певного розміру вьюпорту, пристрою, кольорової схеми, а також з емуляцією геолокації, мови чи часового поясу. Генератор тестів також може зберігати автентифікований стан.",
        },
        {
          en: "### Emulate viewport size",
          uk: "### Емуляція розміру вьюпорту",
        },
        {
          en: "Playwright opens a browser window with its viewport set to a specific width and height and is not responsive as tests need to be run under the same conditions. Use the `--viewport` option to generate tests with a different viewport size.",
          uk: "Playwright відкриває вікно браузера із фіксованими шириною і висотою вьюпорту — тести мають запускатися в однакових умовах. Використовуйте опцію `--viewport`, щоб генерувати тести з іншим розміром вьюпорту.",
        },
        {
          en: "### Emulate devices",
          uk: "### Емуляція пристроїв",
        },
        {
          en: "Record scripts and tests while emulating a mobile device using the `--device` option which sets the viewport size and user agent among others.",
          uk: "Записуйте скрипти та тести з емуляцією мобільного пристрою за допомогою опції `--device`, яка задає, серед іншого, розмір вьюпорту і user agent.",
        },
        {
          en: "### Emulate color scheme",
          uk: "### Емуляція кольорової схеми",
        },
        {
          en: "Record scripts and tests while emulating the color scheme with the `--color-scheme` option.",
          uk: "Записуйте скрипти та тести з емуляцією кольорової схеми за допомогою опції `--color-scheme`.",
        },
        {
          en: "### Emulate geolocation, language and timezone",
          uk: "### Емуляція геолокації, мови та часового поясу",
        },
        {
          en: "Record scripts and tests while emulating timezone, language & location using the `--timezone`, `--geolocation` and `--lang` options. Once the page opens:",
          uk: "Записуйте скрипти та тести з емуляцією часового поясу, мови та локації за допомогою опцій `--timezone`, `--geolocation` та `--lang`. Після відкриття сторінки:",
        },
        {
          en: "1. Accept the cookies\n1. On the top right, click on the locate me button to see geolocation in action.",
          uk: "1. Прийміть файли cookie\n1. Натисніть кнопку «визначити місцезнаходження» у верхньому правому куті, щоб побачити геолокацію в дії.",
        },
        {
          en: "### Preserve authenticated state",
          uk: "### Збереження автентифікованого стану",
        },
        {
          en: "Run `codegen` with `--save-storage` to save [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) data at the end of the session. This is useful to separately record an authentication step and reuse it later when recording more tests.",
          uk: "Запустіть `codegen` із `--save-storage`, щоб зберегти [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) та [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) після сесії. Це корисно, щоб окремо записати крок автентифікації та використовувати його потім при записі нових тестів.",
        },
        {
          en: "#### Login",
          uk: "#### Вхід",
        },
        {
          en: "After performing authentication and closing the browser, `auth.json` will contain the storage state which you can then reuse in your tests.",
          uk: "Після автентифікації та закриття браузера `auth.json` міститиме стан зберігання, який можна перевикористовувати в тестах.",
        },
        {
          en: "Make sure you only use the `auth.json` locally as it contains sensitive information. Add it to your `.gitignore` or delete it once you have finished generating your tests.",
          uk: "Використовуйте `auth.json` лише локально — він містить чутливі дані. Додайте його до `.gitignore` або видаліть після генерації тестів.",
        },
        {
          en: "#### Load authenticated state",
          uk: "#### Завантаження автентифікованого стану",
        },
        {
          en: "Run with `--load-storage` to consume the previously loaded storage from the `auth.json`. This way, all [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) data will be restored, bringing most web apps to the authenticated state without the need to login again. This means you can continue generating tests from the logged in state.",
          uk: "Запустіть із `--load-storage`, щоб відновити раніше збережений стан з `auth.json`. Усі [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) та [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) відновляться, переводячи більшість вебзастосунків у автентифікований стан без повторного входу.\n\nЦе дозволяє продовжити генерацію тестів із авторизованого стану.",
        },
        {
          en: "#### Use existing userDataDir",
          uk: "#### Використання наявної userDataDir",
        },
        {
          en: "Run `codegen` with `--user-data-dir` to set a fixed [user data directory](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir) for the browser session. If you create a custom browser user data directory, codegen will use this existing browser profile and have access to any authentication state present in that profile.",
          uk: "Запустіть `codegen` із `--user-data-dir`, щоб задати фіксовану [директорію даних користувача](https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context-option-user-data-dir) для сесії браузера. Якщо ви створюєте власну директорію даних браузера, codegen буде використовувати цей профіль і матиме доступ до будь-якого автентифікованого стану в ньому.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "bash",
          code: 'npx playwright codegen --viewport-size="800,600" playwright.dev',
        },
        {
          id: "cb-9",
          language: "bash",
          code: 'npx playwright codegen --device="iPhone 13" playwright.dev',
        },
        {
          id: "cb-13",
          language: "bash",
          code: "npx playwright codegen --color-scheme=dark playwright.dev",
        },
        {
          id: "cb-17",
          language: "bash",
          code: 'npx playwright codegen --timezone="Europe/Rome" --geolocation="41.890221,12.492348" --lang="it-IT" bing.com/maps',
        },
        {
          id: "cb-21",
          language: "bash",
          code: "npx playwright codegen github.com/microsoft/playwright --save-storage=auth.json",
        },
        {
          id: "cb-25",
          language: "bash",
          code: "npx playwright codegen --load-storage=auth.json github.com/microsoft/playwright",
        },
        {
          id: "cb-29",
          language: "bash",
          code: "npx playwright codegen --user-data-dir=/path/to/your/browser/data/ github.com/microsoft/playwright",
        },
      ],
    },
    {
      id: "record-using-custom-setup",
      title: {
        en: "Record using custom setup",
        uk: "Запис із нестандартним налаштуванням",
      },
      paragraphs: [
        {
          en: "If you would like to use codegen in some non-standard setup (for example, use [`method: BrowserContext.route`]), it is possible to call [`method: Page.pause`] that will open a separate window with codegen controls.",
          uk: "Якщо ви хочете використовувати codegen із нестандартним налаштуванням (наприклад, з [`method: BrowserContext.route`]), можна викликати [`method: Page.pause`], що відкриє окреме вікно з елементами керування codegen.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-33",
          language: "typescript",
          code: "import { chromium } from '@playwright/test';\n\n(async () => {\n  // Make sure to run headed.\n  const browser = await chromium.launch({ headless: false });\n\n  // Setup context however you like.\n  const context = await browser.newContext({ /* pass any options */ });\n  await context.route('**/*', (route) => route.continue());\n\n  // Pause the page, and start recording manually.\n  const page = await context.newPage();\n  await page.pause();\n})();",
        },
      ],
    },
  ],
  quiz: [],
}
