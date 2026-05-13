import type { PlaywrightTopic } from "../../types"

export const networkTopic: PlaywrightTopic = {
  slug: "network",
  groupId: "guides",
  order: 265,
  sourceDoc: "network.md",
  officialDocsUrl: "https://playwright.dev/docs/network",
  title: {
    en: "Network",
    uk: "Мережа",
  },
  summary: {
    en: "Playwright provides APIs to **monitor** and **modify** browser network traffic, both HTTP and HTTPS. Any requests that a page does, including [XHRs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests, can be tracked, modified and handled.",
    uk: "Playwright надає API для **моніторингу** та **модифікації** мережевого трафіку браузера — як HTTP, так і HTTPS. Усі запити, які виконує сторінка, включно з [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) і запитами [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), можна відстежувати, змінювати та обробляти.",
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
          en: "Playwright provides APIs to **monitor** and **modify** browser network traffic, both HTTP and HTTPS. Any requests that a page does, including [XHRs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and\n[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests, can be tracked, modified and handled.",
          uk: "Playwright надає API для **моніторингу** та **модифікації** мережевого трафіку браузера — як HTTP, так і HTTPS. Усі запити, які виконує сторінка, включно з [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) і\nзапитами [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), можна відстежувати, змінювати та обробляти.",
        },
      ],
    },
    {
      id: "mock-apis",
      title: {
        en: "Mock APIs",
        uk: "Підміна API",
      },
      paragraphs: [
        {
          en: "Check out our [API mocking guide](./mock.md) to learn more on how to\n- mock API requests and never hit the API\n- perform the API request and modify the response\n- use HAR files to mock network requests.",
          uk: "Перегляньте наш [посібник із підміни API](./mock.md), щоб дізнатися більше:\n- як підміняти API-запити й не звертатися до API\n- як виконати запит до API й змінити відповідь\n- як використовувати HAR-файли для підміни мережевих запитів.",
        },
      ],
    },
    {
      id: "network-mocking",
      title: {
        en: "Network mocking",
        uk: "Підміна мережі",
      },
      paragraphs: [
        {
          en: "You don't have to configure anything to mock network requests. Just define a custom [Route] that mocks network for a browser context.",
          uk: "Щоб підміняти мережеві запити, нічого додатково налаштовувати не потрібно. Достатньо визначити власний [Route], який підміняє мережу для контексту браузера.",
        },
        {
          en: "Alternatively, you can use [`method: Page.route`] to mock network in a single page.",
          uk: "Альтернативно можна використати [`method: Page.route`], щоб підміняти мережу на одній сторінці.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\ntest.beforeEach(async ({ context }) => {\n  // Block any css requests for each test in this file.\n  await context.route(/.css$/, route => route.abort());\n});\n\ntest('loads page without css', async ({ page }) => {\n  await page.goto('https://playwright.dev');\n  // ... test goes here\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\ntest('loads page without images', async ({ page }) => {\n  // Block png and jpeg images.\n  await page.route(/(png|jpeg)$/, route => route.abort());\n\n  await page.goto('https://playwright.dev');\n  // ... test goes here\n});",
        },
      ],
    },
    {
      id: "http-authentication",
      title: {
        en: "HTTP Authentication",
        uk: "HTTP-автентифікація",
      },
      paragraphs: [
        {
          en: "Perform HTTP Authentication.",
          uk: "Виконання HTTP-автентифікації.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    httpCredentials: {\n      username: 'bill',\n      password: 'pa55w0rd',\n    }\n  }\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "const context = await browser.newContext({\n  httpCredentials: {\n    username: 'bill',\n    password: 'pa55w0rd',\n  },\n});\nconst page = await context.newPage();\nawait page.goto('https://example.com');",
        },
      ],
    },
    {
      id: "http-proxy",
      title: {
        en: "HTTP Proxy",
        uk: "HTTP-проксі",
      },
      paragraphs: [
        {
          en: "You can configure pages to load over the HTTP(S) proxy or SOCKSv5. Proxy can be either set globally\nfor the entire browser, or for each browser context individually.",
          uk: "Можна налаштувати завантаження сторінок через HTTP(S) проксі або SOCKSv5. Проксі можна задати глобально\nдля всього браузера або окремо для кожного контексту браузера.",
        },
        {
          en: "You can optionally specify username and password for HTTP(S) proxy, you can also specify hosts to bypass the [`option: Browser.newContext.proxy`] for.",
          uk: "За потреби можна вказати ім’я користувача й пароль для HTTP(S) проксі, а також хости, для яких слід обійти [`option: Browser.newContext.proxy`].",
        },
        {
          en: "Here is an example of a global proxy:",
          uk: "Ось приклад глобального проксі:",
        },
        {
          en: "Its also possible to specify it per context:",
          uk: "Також можна задати проксі для кожного контексту окремо:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    proxy: {\n      server: 'http://myproxy.com:3128',\n      username: 'usr',\n      password: 'pwd'\n    }\n  }\n});",
        },
        {
          id: "cb-10",
          language: "js",
          code: "const browser = await chromium.launch({\n  proxy: {\n    server: 'http://myproxy.com:3128',\n    username: 'usr',\n    password: 'pwd'\n  }\n});",
        },
        {
          id: "cb-15",
          language: "js",
          code: "\ntest('should use custom proxy on a new context', async ({ browser }) => {\n  const context = await browser.newContext({\n    proxy: {\n      server: 'http://myproxy.com:3128',\n    }\n  });\n  const page = await context.newPage();\n\n  await context.close();\n});",
        },
        {
          id: "cb-16",
          language: "js",
          code: "const browser = await chromium.launch();\nconst context = await browser.newContext({\n  proxy: { server: 'http://myproxy.com:3128' }\n});",
        },
      ],
    },
    {
      id: "network-events",
      title: {
        en: "Network events",
        uk: "Мережеві події",
      },
      paragraphs: [
        {
          en: "You can monitor all the [Request]s and [Response]s:",
          uk: "Можна відстежувати всі [Request] та [Response]:",
        },
        {
          en: "Or wait for a network response after the button click with [`method: Page.waitForResponse`]:",
          uk: "Або дочекатися мережевої відповіді після кліку кнопки за допомогою [`method: Page.waitForResponse`]:",
        },
        {
          en: "#### Variations",
          uk: "#### Варіанти",
        },
        {
          en: "Wait for [Response]s with [`method: Page.waitForResponse`]",
          uk: "Очікування [Response] за допомогою [`method: Page.waitForResponse`]",
        },
      ],
      codeBlocks: [
        {
          id: "cb-21",
          language: "js",
          code: "// Subscribe to 'request' and 'response' events.\npage.on('request', request => console.log('>>', request.method(), request.url()));\npage.on('response', response => console.log('<<', response.status(), response.url()));\n\nawait page.goto('https://example.com');",
        },
        {
          id: "cb-26",
          language: "js",
          code: "// Use a glob URL pattern. Note no await.\nconst responsePromise = page.waitForResponse('**/api/fetch_data');\nawait page.getByText('Update').click();\nconst response = await responsePromise;",
        },
        {
          id: "cb-31",
          language: "js",
          code: "// Use a RegExp. Note no await.\nconst responsePromise = page.waitForResponse(/\\.jpeg$/);\nawait page.getByText('Update').click();\nconst response = await responsePromise;\n\n// Use a predicate taking a Response object. Note no await.\nconst responsePromise = page.waitForResponse(response => response.url().includes(token));\nawait page.getByText('Update').click();\nconst response = await responsePromise;",
        },
      ],
    },
    {
      id: "handle-requests",
      title: {
        en: "Handle requests",
        uk: "Обробка запитів",
      },
      paragraphs: [
        {
          en: "You can mock API endpoints via handling the network requests in your Playwright script.",
          uk: "Можна підміняти кінцеві точки API, обробляючи мережеві запити у скрипті Playwright.",
        },
        {
          en: "#### Variations",
          uk: "#### Варіанти",
        },
        {
          en: "Set up route on the entire browser context with [`method: BrowserContext.route`] or page with [`method: Page.route`]. It will apply to popup windows and opened links.",
          uk: "Налаштуйте маршрут для всього контексту браузера через [`method: BrowserContext.route`] або для сторінки через [`method: Page.route`]. Це поширюється на спливаючі вікна та відкриті посилання.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-36",
          language: "js",
          code: "await page.route('**/api/fetch_data', route => route.fulfill({\n  status: 200,\n  body: testData,\n}));\nawait page.goto('https://example.com');",
        },
        {
          id: "cb-40",
          language: "js",
          code: "await browserContext.route('**/api/login', route => route.fulfill({\n  status: 200,\n  body: 'accept',\n}));\nawait page.goto('https://example.com');",
        },
      ],
    },
    {
      id: "modify-requests",
      title: {
        en: "Modify requests",
        uk: "Модифікація запитів",
      },
      paragraphs: [
        {
          en: "You can continue requests with modifications. Example above removes an HTTP header from the outgoing requests.",
          uk: "Можна продовжувати запити зі змінами. У наведеному вище прикладі з вихідних запитів видаляється HTTP-заголовок.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-45",
          language: "js",
          code: "// Delete header\nawait page.route('**/*', async route => {\n  const headers = route.request().headers();\n  delete headers['X-Secret'];\n  await route.continue({ headers });\n});\n\n// Continue requests as POST.\nawait page.route('**/*', route => route.continue({ method: 'POST' }));",
        },
      ],
    },
    {
      id: "abort-requests",
      title: {
        en: "Abort requests",
        uk: "Скасування запитів",
      },
      paragraphs: [
        {
          en: "You can abort requests using [`method: Page.route`] and [`method: Route.abort`].",
          uk: "Скасувати запити можна за допомогою [`method: Page.route`] та [`method: Route.abort`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-50",
          language: "js",
          code: "await page.route('**/*.{png,jpg,jpeg}', route => route.abort());\n\n// Abort based on the request type\nawait page.route('**/*', route => {\n  return route.request().resourceType() === 'image' ? route.abort() : route.continue();\n});",
        },
      ],
    },
    {
      id: "modify-responses",
      title: {
        en: "Modify responses",
        uk: "Модифікація відповідей",
      },
      paragraphs: [
        {
          en: "To modify a response use [APIRequestContext] to get the original response and then pass the response to [`method: Route.fulfill`]. You can override individual fields on the response via options:",
          uk: "Щоб змінити відповідь, скористайтеся [APIRequestContext], щоб отримати початкову відповідь, а потім передайте її до [`method: Route.fulfill`]. Окремі поля відповіді можна перевизначити через параметри:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-55",
          language: "js",
          code: "await page.route('**/title.html', async route => {\n  // Fetch original response.\n  const response = await route.fetch();\n  // Add a prefix to the title.\n  let body = await response.text();\n  body = body.replace('', 'My prefix:');\n  await route.fulfill({\n    // Pass all fields from the response.\n    response,\n    // Override response body.\n    body,\n    // Force content type to be html.\n    headers: {\n      ...response.headers(),\n      'content-type': 'text/html'\n    }\n  });\n});",
        },
      ],
    },
    {
      id: "glob-url-patterns",
      title: {
        en: "Glob URL patterns",
        uk: "Шаблони URL (glob)",
      },
      paragraphs: [
        {
          en: "Playwright uses simplified glob patterns for URL matching in network interception methods like [`method: Page.route`] or [`method: Page.waitForResponse`]. These patterns support basic wildcards:",
          uk: "Playwright використовує спрощені glob-шаблони для збігу URL у методах перехоплення мережі, як-от [`method: Page.route`] або [`method: Page.waitForResponse`]. Ці шаблони підтримують базові підстановки:",
        },
        {
          en: "1. Asterisks:\n  - A single `*` matches any characters except `/`\n  - A double `**` matches any characters including `/`\n1. Question mark `?` matches only question mark `?`. If you want to match any character, use `*` instead.\n1. Curly braces `{}` can be used to match a list of options separated by commas `,`\n1. Backslash `\\` can be used to escape any of special characters (note to escape backslash itself as `\\\\`)",
          uk: "1. Зірочки:\n  - Одна `*` відповідає будь-яким символам, крім `/`\n  - Подвійна `**` відповідає будь-яким символам, включно з `/`\n1. Знак питання `?` збігається лише з символом `?`. Якщо потрібен будь-який символ, використовуйте `*`.\n1. Фігурні дужки `{}` дозволяють задати список варіантів через кому `,`\n1. Зворотна коса риска `\\` екранує спеціальні символи (саму `\\` екрануйте як `\\\\`)",
        },
        {
          en: "Examples:\n- `https://example.com/*.js` matches `https://example.com/file.js` but not `https://example.com/path/file.js`\n- `https://example.com/?page=1` matches `https://example.com/?page=1` but not `https://example.com`\n- `**/*.js` matches both `https://example.com/file.js` and `https://example.com/path/file.js`\n- `**/*.{png,jpg,jpeg}` matches all image requests",
          uk: "Приклади:\n- `https://example.com/*.js` збігається з `https://example.com/file.js`, але не з `https://example.com/path/file.js`\n- `https://example.com/?page=1` збігається з `https://example.com/?page=1`, але не з `https://example.com`\n- `**/*.js` збігається і з `https://example.com/file.js`, і з `https://example.com/path/file.js`\n- `**/*.{png,jpg,jpeg}` збігається з усіма запитами зображень",
        },
        {
          en: "Important notes:",
          uk: "Важливо:",
        },
        {
          en: "- The glob pattern must match the entire URL, not just a part of it.\n- When using globs for URL matching, consider the full URL structure, including the protocol and path separators.\n- For more complex matching requirements, consider using [RegExp] instead of glob patterns.",
          uk: "- Glob-шаблон має збігатися з усім URL, а не лише з його частиною.\n- Під час збігу URL за glob враховуйте повну структуру URL, включно з протоколом і роздільниками шляху.\n- Для складніших правил збігу краще використовуйте [RegExp] замість glob-шаблонів.",
        },
      ],
    },
    {
      id: "websockets",
      title: {
        en: "WebSockets",
        uk: "WebSockets",
      },
      paragraphs: [
        {
          en: "Playwright supports [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) inspection, mocking and modifying out of the box. See our [API mocking guide](./mock.md#mock-websockets) to learn how to mock WebSockets.",
          uk: "Playwright підтримує перевірку, підміну та зміну [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) «з коробки». Дивіться наш [посібник із підміни API](./mock.md#mock-websockets), щоб дізнатися, як підміняти WebSockets.",
        },
        {
          en: "Every time a WebSocket is created, the [`event: Page.webSocket`] event is fired. This event contains the [WebSocket] instance for further web socket frames inspection:",
          uk: "Щоразу, коли створюється WebSocket, спрацьовує подія [`event: Page.webSocket`]. У ній є екземпляр [WebSocket] для подальшого аналізу кадрів сокета:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-60",
          language: "js",
          code: "page.on('websocket', ws => {\n  console.log(`WebSocket opened: ${ws.url()}>`);\n  ws.on('framesent', event => console.log(event.payload));\n  ws.on('framereceived', event => console.log(event.payload));\n  ws.on('close', () => console.log('WebSocket closed'));\n});",
        },
      ],
    },
    {
      id: "missing-network-events-and-service-workers",
      title: {
        en: "Missing Network Events and Service Workers",
        uk: "Відсутні мережеві події та Service Workers",
      },
      paragraphs: [
        {
          en: "Playwright's built-in [`method: BrowserContext.route`] and [`method: Page.route`] allow your tests to natively route requests and perform mocking and interception.",
          uk: "Вбудовані в Playwright [`method: BrowserContext.route`] та [`method: Page.route`] дозволяють тестам нативно маршрутизувати запити й виконувати підміну та перехоплення.",
        },
        {
          en: "If you're using Playwright's native [`method: BrowserContext.route`] and [`method: Page.route`], and it appears network events are missing, disable Service Workers by setting [`option: Browser.newContext.serviceWorkers`] to `'block'`.",
          uk: "Якщо ви використовуєте нативні [`method: BrowserContext.route`] та [`method: Page.route`], а мережеві події ніби зникають, вимкніть Service Workers, установивши [`option: Browser.newContext.serviceWorkers`] у `'block'`.",
        },
        {
          en: "It might be that you are using a mock tool such as Mock Service Worker (MSW). While this tool works out of the box for mocking responses, it adds its own Service Worker that takes over the network requests, hence making them invisible to [`method: BrowserContext.route`] and [`method: Page.route`]. If you are interested in both network testing and mocking, consider using built-in [`method: BrowserContext.route`] and [`method: Page.route`] for [response mocking](#handle-requests).",
          uk: "Можливо, ви використовуєте інструмент підміни на кшталт Mock Service Worker (MSW). Хоч він зручний для підміни відповідей, він додає власний Service Worker, який перехоплює мережеві запити, тож вони стають невидимими для [`method: BrowserContext.route`] та [`method: Page.route`].\n\nЯкщо вам потрібні і мережеве тестування, і підміна, розгляньте вбудовані [`method: BrowserContext.route`] та [`method: Page.route`] для [підміни відповідей](#handle-requests).",
        },
        {
          en: "If you're interested in not solely using Service Workers for testing and network mocking, but in routing and listening for requests made by Service Workers themselves, please see [this guide](./service-workers.md).",
          uk: "Якщо вас цікавить не лише використання Service Workers для тестів і підміни мережі, а й маршрутизація та прослуховування запитів, які виконують самі Service Workers, дивіться [цей посібник](./service-workers.md).",
        },
      ],
    },
  ],
  quiz: [],
}
