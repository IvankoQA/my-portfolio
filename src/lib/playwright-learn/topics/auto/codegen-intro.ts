import type { PlaywrightTopic } from "../../types"

export const codegenIntroTopic: PlaywrightTopic = {
  slug: "codegen-intro",
  groupId: "getting-started",
  order: 160,
  level: "beginner",
  trackOrder: 13,
  sourceDoc: "codegen-intro.md",
  officialDocsUrl: "https://playwright.dev/docs/codegen-intro",
  title: {
    en: "Generating tests",
    uk: "Автогенерація тестів",
  },
  summary: {
    en: "Playwright can generate tests automatically, providing a quick way to get started with testing. Codegen opens a browser window for interaction and the Playwright Inspector for recording, copying, and managing your generated tests.",
    uk: "Автогенерація тестів: вікно браузера для дій і Playwright Inspector для запису, копіювання та керування згенерованим кодом.",
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
          en: "Playwright can generate tests automatically, providing a quick way to get started with testing. Codegen opens a browser window for interaction and the Playwright Inspector for recording, copying, and managing your generated tests.",
          uk: "Playwright може автоматично генерувати тести — це швидкий спосіб розпочати тестування. Codegen відкриває вікно браузера для взаємодії та Playwright Inspector для запису, копіювання і керування згенерованими тестами.",
        },
        {
          en: "**You will learn**",
          uk: "**Що ви дізнаєтесь**",
        },
        {
          en: "- [How to record a test](/codegen.md#recording-a-test)\n- [How to generate locators](/codegen.md#generating-locators)",
          uk: "- [Як записати тест](/codegen.md#recording-a-test)\n- [Як генерувати локатори](/codegen.md#generating-locators)",
        },
      ],
    },
    {
      id: "running-codegen",
      title: {
        en: "Running Codegen",
        uk: "Запуск Codegen",
      },
      paragraphs: [
        {
          en: "Use the `codegen` command to run the test generator followed by the URL of the website you want to generate tests for. The URL is optional and can be added directly in the browser window if omitted.",
          uk: "Виконайте команду `codegen` із зазначенням URL сайту, для якого хочете генерувати тести. URL не обов'язковий — його можна додати прямо у вікні браузера.",
        },
        {
          en: "### Recording a test",
          uk: "### Запис тесту",
        },
        {
          en: "Run `codegen` and perform actions in the browser. Playwright generates code for your interactions automatically. Codegen analyzes the rendered page and recommends the best locator, prioritizing role, text, and test id locators. When multiple elements match a locator, the generator improves it to uniquely identify the target element, reducing test failures and flakiness.",
          uk: "Запустіть `codegen` і виконуйте дії в браузері. Playwright автоматично генерує код для ваших взаємодій. Codegen аналізує відрендерену сторінку і рекомендує найкращий локатор, надаючи перевагу локаторам за роллю, текстом і test id. Якщо кілька елементів відповідають локатору, генератор вдосконалює його, щоб однозначно ідентифікувати цільовий елемент — це зменшує кількість збоїв і нестабільних тестів.",
        },
        {
          en: "With the test generator you can record:\n* Actions like click or fill by interacting with the page\n* Assertions by clicking a toolbar icon, then clicking a page element to assert against. You can choose:\n  * `'assert visibility'` to assert that an element is visible\n  * `'assert text'` to assert that an element contains specific text\n  * `'assert value'` to assert that an element has a specific value",
          uk: "За допомогою генератора тестів можна записати:\n* Дії: клік, заповнення поля — взаємодіючи зі сторінкою\n* Перевірки: натисніть іконку на панелі, потім елемент для перевірки. Можна вибрати:\n  * `'assert visibility'` — перевіряє видимість елемента\n  * `'assert text'` — перевіряє текстовий вміст елемента\n  * `'assert value'` — перевіряє значення елемента",
        },
        {
          en: "![Recording a test](./images/getting-started/record-test-js.png)",
          uk: "![Recording a test](./images/getting-started/record-test-js.png)",
        },
        {
          en: "When you finish interacting with the page, press the `'record'` button to stop recording and use the `'copy'` button to copy the generated code to your editor.",
          uk: "Після завершення взаємодії натисніть кнопку `'record'`, щоб зупинити запис, і кнопку `'copy'`, щоб скопіювати згенерований код у редактор.",
        },
        {
          en: "Use the `'clear'` button to clear the code and start recording again. Once finished, close the Playwright Inspector window or stop the terminal command.",
          uk: "Натисніть `'clear'`, щоб очистити код і почати запис знову. Після завершення закрийте вікно Playwright Inspector або зупиніть команду в терміналі.",
        },
        {
          en: "To learn more about generating tests, check out our detailed guide on [Codegen](./codegen.md).",
          uk: "Щоб дізнатися більше про генерацію тестів, перегляньте детальний посібник [Codegen](./codegen.md).",
        },
        {
          en: "### Generating locators",
          uk: "### Генерація локаторів",
        },
        {
          en: "You can generate [locators](/locators.md) with the test generator.",
          uk: "Локатори можна генерувати за допомогою генератора тестів.",
        },
        {
          en: "* Press the `'Record'` button to stop recording and the `'Pick Locator'` button will appear\n* Click the `'Pick Locator'` button and hover over elements in the browser window to see the locator highlighted underneath each element\n* Click the element you want to locate and the code for that locator will appear in the locator playground next to the Pick Locator button\n* Edit the locator in the locator playground to fine-tune it and see the matching element highlighted in the browser window\n* Use the copy button to copy the locator and paste it into your code",
          uk: "* Натисніть кнопку `'Record'`, щоб зупинити запис — з'явиться кнопка `'Pick Locator'`\n* Натисніть `'Pick Locator'` і наведіть курсор на елементи у вікні браузера — локатор підсвічуватиметься під кожним елементом\n* Натисніть потрібний елемент — код локатора з'явиться в локаторному playground поряд із кнопкою Pick Locator\n* Відредагуйте локатор у playground для точного налаштування — відповідний елемент підсвітиться у вікні браузера\n* Скористайтесь кнопкою копіювання, щоб вставити локатор у свій код",
        },
        {
          en: "![picking a locator](./images/getting-started/pick-locator-js.png)",
          uk: "![picking a locator](./images/getting-started/pick-locator-js.png)",
        },
        {
          en: "### Emulation",
          uk: "### Емуляція",
        },
        {
          en: "You can generate tests using emulation for specific viewports, devices, color schemes, geolocation, language, or timezone. The test generator can also preserve authenticated state. Check out the [Test Generator](./codegen.md#emulation) guide to learn more.",
          uk: "Можна генерувати тести з емуляцією для певних вьюпортів, пристроїв, кольорових схем, геолокації, мови та часового поясу. Генератор тестів також може зберігати автентифікований стан. Детальніше — у посібнику [Генератор тестів](./codegen.md#emulation).",
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
      id: "what-s-next",
      title: {
        en: "What's Next",
        uk: "Що далі",
      },
      paragraphs: [
        {
          en: "- [See a trace of your tests](./trace-viewer-intro.md)",
          uk: "- [Переглянути трасу тестів](./trace-viewer-intro.md)",
        },
      ],
    },
  ],
  quiz: [],
}
