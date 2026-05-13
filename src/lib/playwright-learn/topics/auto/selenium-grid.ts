import type { PlaywrightTopic } from "../../types"

export const seleniumGridTopic: PlaywrightTopic = {
  slug: "selenium-grid",
  groupId: "ci",
  order: 300,
  sourceDoc: "selenium-grid.md",
  officialDocsUrl: "https://playwright.dev/docs/selenium-grid",
  title: {
    en: "Selenium Grid (experimental)",
    uk: "Selenium Grid (експериментально)",
  },
  summary: {
    en: "Playwright can connect to [Selenium Grid Hub](https://www.selenium.dev/documentation/grid/) that runs Selenium 4 to launch **Google Chrome** or **Microsoft Edge** browser, instead of running browser on the local machine. Note this feature is **experimental** and is prioritized accordingly.",
    uk: "Playwright може підключатися до [Selenium Grid Hub](https://www.selenium.dev/documentation/grid/) на Selenium 4, щоб запускати **Google Chrome** або **Microsoft Edge** замість локального браузера. Ця можливість **експериментальна** і має відповідний пріоритет підтримки.",
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
          en: "Playwright can connect to [Selenium Grid Hub](https://www.selenium.dev/documentation/grid/) that runs Selenium 4 to launch **Google Chrome** or **Microsoft Edge** browser, instead of running browser on the local machine. Note this feature is **experimental** and is prioritized accordingly.",
          uk: "Playwright може підключатися до [Selenium Grid Hub](https://www.selenium.dev/documentation/grid/) на Selenium 4, щоб запускати **Google Chrome** або **Microsoft Edge** замість локального браузера. Ця можливість **експериментальна** і має відповідний пріоритет підтримки.",
        },
        {
          en: "Before connecting Playwright to your Selenium Grid, make sure that grid works with [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/). For example, run [one of the examples](https://github.com/SeleniumHQ/selenium/tree/trunk/javascript/selenium-webdriver/example) and pass `SELENIUM_REMOTE_URL` environment variable. If webdriver example does not work, look for any errors at your Selenium hub/node/standalone output and search [Selenium issues](https://github.com/SeleniumHQ/selenium/issues) for a possible solution.",
          uk: "Перед підключенням Playwright до Selenium Grid переконайтеся, що сітка працює з [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/). Наприклад, запустіть [один із прикладів](https://github.com/SeleniumHQ/selenium/tree/trunk/javascript/selenium-webdriver/example) і передайте змінну середовища `SELENIUM_REMOTE_URL`.\n\nЯкщо приклад з webdriver не працює, перевірте вивід hub/node/standalone на помилки та пошукайте рішення в [issues Selenium](https://github.com/SeleniumHQ/selenium/issues).",
        },
      ],
    },
    {
      id: "starting-selenium-grid",
      title: {
        en: "Starting Selenium Grid",
        uk: "Запуск Selenium Grid",
      },
      paragraphs: [
        {
          en: "If you run distributed Selenium Grid, Playwright needs selenium nodes to be registered with an accessible address, so that it could connect to the browsers. To make sure it works as expected, set `SE_NODE_GRID_URL` environment variable pointing to the hub when running selenium nodes.",
          uk: "Якщо ви використовуєте розподілений Selenium Grid, вузлам Selenium потрібна доступна адреса реєстрації, щоб Playwright міг підключатися до браузерів. Для коректної роботи задайте змінну середовища `SE_NODE_GRID_URL` на hub під час запуску вузлів.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: '# Start selenium node\nSE_NODE_GRID_URL="http://:4444" java -jar selenium-server-.jar node',
        },
      ],
    },
    {
      id: "connecting-playwright-to-selenium-grid",
      title: {
        en: "Connecting Playwright to Selenium Grid",
        uk: "Підключення Playwright до Selenium Grid",
      },
      paragraphs: [
        {
          en: "To connect Playwright to **Selenium Grid 4**, set `SELENIUM_REMOTE_URL` environment variable pointing to your Selenium Grid Hub. Note that this only works for Google Chrome and Microsoft Edge.",
          uk: "Щоб підключити Playwright до **Selenium Grid 4**, встановіть змінну середовища `SELENIUM_REMOTE_URL` на URL вашого Selenium Grid Hub. Працює лише для Google Chrome та Microsoft Edge.",
        },
        {
          en: "You don't have to change your code, just use your testing harness or [`method: BrowserType.launch`] as usual.",
          uk: "Код змінювати не обов’язково — використовуйте свій тестовий каркас або [`method: BrowserType.launch`] як зазвичай.",
        },
        {
          en: "### Passing additional capabilities",
          uk: "### Передача додаткових capabilities",
        },
        {
          en: "If your grid requires additional capabilities to be set (for example, you use an external service), you can set `SELENIUM_REMOTE_CAPABILITIES` environment variable to provide JSON-serialized capabilities.",
          uk: "Якщо сітці потрібні додаткові capabilities (наприклад, зовнішній сервіс), задайте змінну середовища `SELENIUM_REMOTE_CAPABILITIES` з JSON-серіалізованими capabilities.",
        },
        {
          en: "### Passing additional headers",
          uk: "### Передача додаткових заголовків",
        },
        {
          en: "If your grid requires additional headers to be set (for example, you should provide authorization token to use browsers in your cloud), you can set `SELENIUM_REMOTE_HEADERS` environment variable to provide JSON-serialized headers.",
          uk: "Якщо потрібні додаткові HTTP-заголовки (наприклад, токен авторизації для хмарних браузерів), задайте `SELENIUM_REMOTE_HEADERS` з JSON-серіалізованими заголовками.",
        },
        {
          en: "### Detailed logs",
          uk: "### Детальні журнали",
        },
        {
          en: "Run with `DEBUG=pw:browser*` environment variable to see how Playwright is connecting to Selenium Grid.",
          uk: "Запустіть із змінною середовища `DEBUG=pw:browser*`, щоб бачити, як Playwright підключається до Selenium Grid.",
        },
        {
          en: "If you file an issue, please include this log.",
          uk: "Якщо створюєте issue, додайте цей журнал.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 npx playwright test",
        },
        {
          id: "cb-3",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 pytest --browser chromium",
        },
        {
          id: "cb-4",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 mvn test",
        },
        {
          id: "cb-5",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 dotnet test",
        },
        {
          id: "cb-6",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 SELENIUM_REMOTE_CAPABILITIES=\"{'mygrid:options':{os:'windows',username:'John',password:'secure'}}\" npx playwright test",
        },
        {
          id: "cb-7",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 SELENIUM_REMOTE_CAPABILITIES=\"{'mygrid:options':{os:'windows',username:'John',password:'secure'}}\" pytest --browser chromium",
        },
        {
          id: "cb-8",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 SELENIUM_REMOTE_CAPABILITIES=\"{'mygrid:options':{os:'windows',username:'John',password:'secure'}}\" mvn test",
        },
        {
          id: "cb-9",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 SELENIUM_REMOTE_CAPABILITIES=\"{'mygrid:options':{os:'windows',username:'John',password:'secure'}}\" dotnet test",
        },
        {
          id: "cb-10",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 SELENIUM_REMOTE_HEADERS=\"{'Authorization':'Basic b64enc'}\" npx playwright test",
        },
        {
          id: "cb-11",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 SELENIUM_REMOTE_HEADERS=\"{'Authorization':'Basic b64enc'}\" pytest --browser chromium",
        },
        {
          id: "cb-12",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 SELENIUM_REMOTE_HEADERS=\"{'Authorization':'Basic b64enc'}\" mvn test",
        },
        {
          id: "cb-13",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 SELENIUM_REMOTE_HEADERS=\"{'Authorization':'Basic b64enc'}\" dotnet test",
        },
        {
          id: "cb-14",
          language: "bash",
          code: "DEBUG=pw:browser* SELENIUM_REMOTE_URL=http://internal.grid:4444 npx playwright test",
        },
        {
          id: "cb-15",
          language: "bash",
          code: "DEBUG=pw:browser* SELENIUM_REMOTE_URL=http://internal.grid:4444 pytest --browser chromium",
        },
        {
          id: "cb-16",
          language: "bash",
          code: "DEBUG=pw:browser* SELENIUM_REMOTE_URL=http://internal.grid:4444 mvn test",
        },
        {
          id: "cb-17",
          language: "bash",
          code: "DEBUG=pw:browser* SELENIUM_REMOTE_URL=http://internal.grid:4444 dotnet test",
        },
      ],
    },
    {
      id: "using-selenium-docker",
      title: {
        en: "Using Selenium Docker",
        uk: "Використання Selenium у Docker",
      },
      paragraphs: [
        {
          en: "One easy way to use Selenium Grid is to run official docker containers. Read more in [selenium docker images](https://github.com/SeleniumHQ/docker-selenium) documentation. For image tagging convention, [read more](https://github.com/SeleniumHQ/docker-selenium/wiki/Tagging-Convention#selenium-grid-4x-and-above).",
          uk: "Простий спосіб — офіційні Docker-контейнери Selenium Grid. Докладніше в документації [selenium docker images](https://github.com/SeleniumHQ/docker-selenium). Про тегування образів — [тут](https://github.com/SeleniumHQ/docker-selenium/wiki/Tagging-Convention#selenium-grid-4x-and-above).",
        },
        {
          en: "### Standalone mode",
          uk: "### Режим standalone",
        },
        {
          en: "Here is an example of running selenium standalone and connecting Playwright to it. Note that hub and node are on the same `localhost`, and we pass `SE_NODE_GRID_URL` environment variable pointing to it.",
          uk: "Приклад запуску selenium standalone і підключення Playwright. Hub і вузол на одному `localhost`; передаємо `SE_NODE_GRID_URL` на цю адресу.",
        },
        {
          en: "First start Selenium.",
          uk: "Спочатку запустіть Selenium.",
        },
        {
          en: "Then run Playwright.",
          uk: "Потім запустіть Playwright.",
        },
        {
          en: "### Hub and nodes mode",
          uk: "### Режим hub і вузлів",
        },
        {
          en: "Here is an example of running selenium hub and a single selenium node, and connecting Playwright to the hub. Note that hub and node have different IPs, and we pass `SE_NODE_GRID_URL` environment variable pointing to the hub when starting node containers.",
          uk: "Приклад: hub і один вузол, Playwright підключається до hub. У hub і вузла різні IP; при старті контейнерів вузлів задайте `SE_NODE_GRID_URL` на hub.",
        },
        {
          en: "First start the hub container and one or more node containers.",
          uk: "Спочатку запустіть контейнер hub і один або кілька контейнерів вузлів.",
        },
        {
          en: "Then run Playwright.",
          uk: "Потім запустіть Playwright.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-18",
          language: "bash",
          code: 'docker run -d -p 4444:4444 --shm-size="2g" -e SE_NODE_GRID_URL="http://localhost:4444" selenium/standalone-chromium:latest',
        },
        {
          id: "cb-19",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://localhost:4444 npx playwright test",
        },
        {
          id: "cb-20",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://localhost:4444 pytest --browser chromium",
        },
        {
          id: "cb-21",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://localhost:4444 mvn test",
        },
        {
          id: "cb-22",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://localhost:4444 dotnet test",
        },
        {
          id: "cb-23",
          language: "bash",
          code: 'docker run -d -p 4442-4444:4442-4444 --name selenium-hub selenium/hub:4.25.0\ndocker run -d -p 5555:5555 \\\n    --shm-size="2g" \\\n    -e SE_EVENT_BUS_HOST= \\\n    -e SE_EVENT_BUS_PUBLISH_PORT=4442 \\\n    -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 \\\n    -e SE_NODE_GRID_URL="http://:4444"\n    selenium/node-chromium:4.25.0',
        },
        {
          id: "cb-24",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 npx playwright test",
        },
        {
          id: "cb-25",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 pytest --browser chromium",
        },
        {
          id: "cb-26",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 mvn test",
        },
        {
          id: "cb-27",
          language: "bash",
          code: "SELENIUM_REMOTE_URL=http://:4444 dotnet test",
        },
      ],
    },
    {
      id: "selenium-3",
      title: {
        en: "Selenium 3",
        uk: "Selenium 3",
      },
      paragraphs: [
        {
          en: "Internally, Playwright connects to the browser using [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) websocket. Selenium 4 exposes this capability, while Selenium 3 does not.",
          uk: "Всередині Playwright підключається до браузера через WebSocket [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/). Selenium 4 надає цю можливість, Selenium 3 — ні.",
        },
        {
          en: "This means that Selenium 3 is supported in a best-effort manner, where Playwright tries to connect to the grid node directly. Grid nodes must be directly accessible from the machine that runs Playwright.",
          uk: "Тому Selenium 3 підтримується «як є»: Playwright намагається підключитися до вузла сітки напряму. Вузли мають бути прямо доступні з машини, де запущено Playwright.",
        },
      ],
    },
  ],
  quiz: [],
}
