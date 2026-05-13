import type { PlaywrightTopic } from "../../types"

export const testWebserverTopic: PlaywrightTopic = {
  slug: "test-webserver",
  groupId: "test-runner",
  order: 400,
  sourceDoc: "test-webserver-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-webserver",
  title: {
    en: "Web server",
    uk: "Вебсервер",
  },
  summary: {
    en: "Playwright comes with a `webServer` option in the config file which gives you the ability to launch a local dev server before running your tests. This is ideal for when writing your tests during development and when you don't have a staging or production url to test against.",
    uk: "У Playwright є опція `webServer` у конфігураційному файлі: можна запустити локальний dev-сервер перед прогоном тестів. Це зручно під час розробки, коли немає staging- чи production-URL для перевірки.",
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
          en: "Playwright comes with a `webServer` option in the config file which gives you the ability to launch a local dev server before running your tests. This is ideal for when writing your tests during development and when you don't have a staging or production url to test against.",
          uk: "У Playwright є опція `webServer` у конфігураційному файлі: можна запустити локальний dev-сервер перед прогоном тестів. Це зручно під час розробки, коли немає staging- чи production-URL для перевірки.",
        },
      ],
    },
    {
      id: "configuring-a-web-server",
      title: {
        en: "Configuring a web server",
        uk: "Налаштування вебсервера",
      },
      paragraphs: [
        {
          en: "Use the `webServer` property in your Playwright config to launch a development web server during the tests.",
          uk: "Використовуйте властивість `webServer` у конфігурації Playwright, щоб запускати dev-сервер під час тестів.",
        },
        {
          en: '| Property | Description |\n| :- | :- |\n| [`property: TestConfig.webServer`] | Launch a development web server (or multiple) during the tests. |\n| `command`| Shell command to start the local dev server of your app. |\n| `cwd` | Current working directory of the spawned process, defaults to the directory of the configuration file. |\n| `env` | Environment variables for the command. Defaults to inheriting `process.env` with `PLAYWRIGHT_TEST=1` added. |\n| `gracefulShutdown` | How to shut down the process. If unspecified, the process group is forcefully `SIGKILL`ed. If set to `{ signal: \'SIGTERM\', timeout: 500 }`, the process group is sent a `SIGTERM` signal, followed by `SIGKILL` if it doesn\'t exit within 500ms. You can also use `SIGINT` as the signal instead. A `0` timeout means no `SIGKILL` will be sent. Windows doesn\'t support `SIGTERM` and `SIGINT` signals, so this option is ignored on Windows. Note that shutting down a Docker container requires `SIGTERM`. |\n| `ignoreHTTPSErrors` | Whether to ignore HTTPS errors when fetching the `url`. Defaults to `false`. |\n| `name` | Specifies a custom name for the web server. This name will be prefixed to log messages. Defaults to `[WebServer]`. |\n| `port` | **Deprecated**. Use `url` instead. The port that your http server is expected to appear on. It does wait until it accepts connections. Either `port` or `url` should be specified. |\n| `reuseExistingServer`| If `true`, it will re-use an existing server on the `port` or `url` when available. If no server is running on that `port` or `url`, it will run the command to start a new server. If `false`, it will throw if an existing process is listening on the `port` or `url`. This should be commonly set to `!process.env.CI` to allow the local dev server when running tests locally. |\n| `stderr` | Whether to pipe the stderr of the command to the process stderr or ignore it. Defaults to `"pipe"`. |\n| `stdout` | If `"pipe"`, it will pipe the stdout of the command to the process stdout. If `"ignore"`, it will ignore the stdout of the command. Default to `"ignore"`. |\n| `timeout` | How long to wait for the process to start up and be available in milliseconds. Defaults to 60000. |\n| `url`| URL of your http server that is expected to return a 2xx, 3xx, 400, 401, 402, or 403 status code when the server is ready to accept connections. Either `port` or `url` should be specified. If both `url` and `wait` are specified, the server is considered started when at least one of the conditions is met. |\n| `wait` | Consider command started only when given output has been produced. Takes an object with optional `stdout` and/or `stderr` regular expressions. Named capture groups in the regex are stored in the environment, for example `/Listening on port (?\\d+)/` will store the port number in `process.env[\'MY_SERVER_PORT\']`. If both `url` and `wait` are specified, the server is considered started when at least one of the conditions is met. |',
          uk: '| Property | Description |\n| :- | :- |\n| [`property: TestConfig.webServer`] | Запуск dev-вебсервера (або кількох) під час тестів. |\n| `command`| Команда shell для старту локального dev-сервера застосунку. |\n| `cwd` | Поточний робочий каталог породженого процесу; за замовчуванням — каталог конфігураційного файлу. |\n| `env` | Змінні середовища для команди. За замовчуванням успадковується `process.env` з додаванням `PLAYWRIGHT_TEST=1`. |\n| `gracefulShutdown` | Як завершувати процес. Якщо не вказано, група процесів примусово завершується через `SIGKILL`. Якщо задано `{ signal: \'SIGTERM\', timeout: 500 }`, групі надсилається `SIGTERM`, а потім `SIGKILL`, якщо за 500 мс не вийшла. Можна використати `SIGINT`. Тайм-аут `0` означає, що `SIGKILL` не надсилається. Windows не підтримує `SIGTERM` і `SIGINT`, тож опція ігнорується. Для зупинки Docker-контейнера потрібен `SIGTERM`. |\n| `ignoreHTTPSErrors` | Чи ігнорувати помилки HTTPS під час запиту `url`. За замовчуванням `false`. |\n| `name` | Власна назва вебсервера; префікс у повідомленнях журналу. За замовчуванням `[WebServer]`. |\n| `port` | **Застаріло**. Замість цього використовуйте `url`. Порт, на якому очікується HTTP-сервер; очікується, доки він почне приймати з’єднання. Потрібно вказати або `port`, або `url`. |\n| `reuseExistingServer`| Якщо `true`, повторно використовується наявний сервер на `port` або `url`, коли він є. Якщо на `port`/`url` нікого немає, виконується команда для нового сервера. Якщо `false`, буде виняток, якщо порт/URL уже зайняті. Зазвичай ставлять `!process.env.CI`, щоб локально дозволити вже запущений dev-сервер. |\n| `stderr` | Чи перенаправляти stderr команди в stderr процесу чи ігнорувати. За замовчуванням `"pipe"`. |\n| `stdout` | Якщо `"pipe"`, stdout команди йде в stdout процесу. Якщо `"ignore"`, stdout ігнорується. За замовчуванням `"ignore"`. |\n| `timeout` | Скільки чекати запуску процесу й готовності, у мілісекундах. За замовчуванням 60000. |\n| `url`| URL вашого HTTP-сервера, який має повернути код 2xx, 3xx, 400, 401, 402 або 403, коли сервер готовий приймати з’єднання. Потрібно вказати або `port`, або `url`. Якщо задано і `url`, і `wait`, сервер вважається запущеним, коли виконується хоча б одна з умов. |\n| `wait` | Вважати команду запущеною лише після появи заданого виводу. Об’єкт із необов’язковими регулярними виразами для `stdout` і/або `stderr`. Іменовані групи захоплення зберігаються в середовищі, наприклад `/Listening on port (?\\d+)/` збере номер порту в `process.env[\'MY_SERVER_PORT\']`. Якщо задано і `url`, і `wait`, сервер вважається запущеним, коли виконується хоча б одна з умов. |',
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  // Run your local dev server before starting the tests\n  webServer: {\n    command: 'npm run start',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n    stdout: 'ignore',\n    stderr: 'pipe',\n  },\n});",
        },
      ],
    },
    {
      id: "adding-a-server-timeout",
      title: {
        en: "Adding a server timeout",
        uk: "Додавання тайм-ауту сервера",
      },
      paragraphs: [
        {
          en: "Webservers can sometimes take longer to boot up. In this case, you can increase the timeout to wait for the server to start.",
          uk: "Іноді вебсерверу потрібно більше часу на старт. Тоді можна збільшити тайм-аут очікування запуску.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "js",
          code: "\nexport default defineConfig({\n  // Rest of your config...\n\n  // Run your local dev server before starting the tests\n  webServer: {\n    command: 'npm run start',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n    timeout: 120 * 1000,\n  },\n});",
        },
      ],
    },
    {
      id: "adding-a-baseurl",
      title: {
        en: "Adding a baseURL",
        uk: "Додавання baseURL",
      },
      paragraphs: [
        {
          en: "It is also recommended to specify the `baseURL` in the `use: {}` section of your config, so that tests can use relative urls and you don't have to specify the full URL over and over again.",
          uk: "Також рекомендується вказати `baseURL` у секції `use: {}` конфігурації, щоб у тестах можна було використовувати відносні URL і не повторювати повну адресу щоразу.",
        },
        {
          en: "When using [`method: Page.goto`], [`method: Page.route`], [`method: Page.waitForURL`], [`method: Page.waitForRequest`], or [`method: Page.waitForResponse`] it takes the base URL in consideration by using the [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) constructor for building the corresponding URL. For Example, by setting the baseURL to `http://localhost:3000` and navigating to `/login` in your tests, Playwright will run the test using `http://localhost:3000/login`.",
          uk: "Під час використання [`method: Page.goto`], [`method: Page.route`], [`method: Page.waitForURL`], [`method: Page.waitForRequest`] або [`method: Page.waitForResponse`] базова URL враховується через конструктор [`URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL). Наприклад, якщо `baseURL` дорівнює `http://localhost:3000`, а в тесті перехід на `/login`, Playwright відкриє `http://localhost:3000/login`.",
        },
        {
          en: "Now you can use a relative path when navigating the page:",
          uk: "Тепер можна переходити за відносним шляхом:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "\nexport default defineConfig({\n  // Rest of your config...\n\n  // Run your local dev server before starting the tests\n  webServer: {\n    command: 'npm run start',\n    url: 'http://localhost:3000',\n    reuseExistingServer: !process.env.CI,\n  },\n  use: {\n    baseURL: 'http://localhost:3000',\n  },\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "\ntest('test', async ({ page }) => {\n  // This will navigate to http://localhost:3000/login\n  await page.goto('./login');\n});",
        },
      ],
    },
    {
      id: "multiple-web-servers",
      title: {
        en: "Multiple web servers",
        uk: "Кілька вебсерверів",
      },
      paragraphs: [
        {
          en: "Multiple web servers (or background processes) can be launched simultaneously by providing an array of `webServer` configurations. See [`property: TestConfig.webServer`] for more info.",
          uk: "Кілька вебсерверів (або фонових процесів) можна запустити одночасно, передавши масив конфігурацій `webServer`. Докладніше — [`property: TestConfig.webServer`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "\nexport default defineConfig({\n  webServer: [\n    {\n      command: 'npm run start',\n      url: 'http://localhost:3000',\n      name: 'Frontend',\n      timeout: 120 * 1000,\n      reuseExistingServer: !process.env.CI,\n    },\n    {\n      command: 'npm run backend',\n      url: 'http://localhost:3333',\n      name: 'Backend',\n      timeout: 120 * 1000,\n      reuseExistingServer: !process.env.CI,\n    }\n  ],\n  use: {\n    baseURL: 'http://localhost:3000',\n  },\n});",
        },
      ],
    },
  ],
  quiz: [],
}
