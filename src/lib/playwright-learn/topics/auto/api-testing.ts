import type { PlaywrightTopic } from "../../types"

export const apiTestingTopic: PlaywrightTopic = {
  slug: "api-testing",
  groupId: "guides",
  order: 110,
  sourceDoc: "api-testing-js.md",
  officialDocsUrl: "https://playwright.dev/docs/api-testing",
  title: {
    en: "API testing",
    uk: "Тестування API",
  },
  summary: {
    en: "Playwright can be used to get access to the [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API of your application.",
    uk: "За допомогою Playwright можна звертатися до [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API вашого застосунку.",
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
          en: "Playwright can be used to get access to the [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API of\nyour application.",
          uk: "За допомогою Playwright можна звертатися до [REST](https://en.wikipedia.org/wiki/Representational_state_transfer) API вашого застосунку.",
        },
        {
          en: "Sometimes you may want to send requests to the server directly from Node.js without loading a page and running js code in it.\nA few examples where it may come in handy:\n- Test your server API.\n- Prepare server side state before visiting the web application in a test.\n- Validate server side post-conditions after running some actions in the browser.",
          uk: "Іноді потрібно надсилати запити на сервер прямо з Node.js, не завантажуючи сторінку й не виконуючи на ній JavaScript.\nОсь кілька типових випадків:\n- перевірити API сервера;\n- підготувати стан на сервері перед переходом у вебзастосунок у тесті;\n- перевірити постумови на сервері після дій у браузері.",
        },
        {
          en: "All of that could be achieved via [APIRequestContext] methods.",
          uk: "Усе це можна зробити методами [APIRequestContext].",
        },
      ],
    },
    {
      id: "writing-api-test",
      title: {
        en: "Writing API Test",
        uk: "Написання API-тесту",
      },
      paragraphs: [
        {
          en: "[APIRequestContext] can send all kinds of HTTP(S) requests over network.",
          uk: "[APIRequestContext] може надсилати будь-які HTTP(S)-запити через мережу.",
        },
        {
          en: "The following example demonstrates how to use Playwright to test issues creation via [GitHub API](https://docs.github.com/en/rest). The test suite will do the following:\n- Create a new repository before running tests.\n- Create a few issues and validate server state.\n- Delete the repository after running tests.",
          uk: "Нижче показано, як за допомогою Playwright перевірити створення issues через [GitHub API](https://docs.github.com/en/rest). Набір тестів робить таке:\n- створює новий репозиторій перед запуском тестів;\n- створює кілька issues і перевіряє стан на сервері;\n- видаляє репозиторій після тестів.",
        },
        {
          en: "### Configuration",
          uk: "### Конфігурація",
        },
        {
          en: "GitHub API requires authorization, so we'll configure the token once for all tests. While at it, we'll also set the `baseURL` to simplify the tests. You can either put them in the configuration file, or in the test file with `test.use()`.",
          uk: "GitHub API вимагає авторизації, тому налаштуємо токен один раз для всіх тестів. Заодно задаємо `baseURL`, щоб спростити запити. Параметри можна винести в конфіг Playwright або задати у файлі тесту через `test.use()`.",
        },
        {
          en: "**Proxy configuration**",
          uk: "**Налаштування проксі**",
        },
        {
          en: "If your tests need to run behind a proxy, you can specify this in the config and the `request` fixture\nwill pick it up automatically:",
          uk: "Якщо тести мають ходити через проксі, вкажіть це в конфігурації — fixture `request`\nпідхопить налаштування автоматично:",
        },
        {
          en: "### Writing tests",
          uk: "### Написання тестів",
        },
        {
          en: "Playwright Test comes with the built-in `request` fixture that respects configuration options like `baseURL` or `extraHTTPHeaders` we specified and is ready to send some requests.",
          uk: "Playwright Test має вбудований fixture `request`, який враховує опції конфігурації (`baseURL`, `extraHTTPHeaders` тощо) і готовий надсилати HTTP-запити.",
        },
        {
          en: "Now we can add a few tests that will create new issues in the repository.",
          uk: "Далі можна додати тести, які створюватимуть нові issues в репозиторії.",
        },
        {
          en: "### Setup and teardown",
          uk: "### Підготовка та завершення",
        },
        {
          en: "These tests assume that repository exists. You probably want to create a new one before running tests and delete it afterwards. Use `beforeAll` and `afterAll` hooks for that.",
          uk: "Ці тести припускають, що репозиторій уже існує. Зазвичай його створюють перед тестами й видаляють після. Для цього зручно використати хуки `beforeAll` та `afterAll`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    // All requests we send go to this API endpoint.\n    baseURL: 'https://api.github.com',\n    extraHTTPHeaders: {\n      // We set this header per GitHub guidelines.\n      'Accept': 'application/vnd.github.v3+json',\n      // Add authorization token to all requests.\n      // Assuming personal access token available in the environment.\n      'Authorization': `token ${process.env.API_TOKEN}`,\n    },\n  }\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    proxy: {\n      server: 'http://my-proxy:8080',\n      username: 'user',\n      password: 'secret'\n    },\n  }\n});",
        },
        {
          id: "cb-3",
          language: "js",
          code: "const REPO = 'test-repo-1';\nconst USER = 'github-username';\n\ntest('should create a bug report', async ({ request }) => {\n  const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {\n    data: {\n      title: '[Bug] report 1',\n      body: 'Bug description',\n    }\n  });\n  expect(newIssue.ok()).toBeTruthy();\n\n  const issues = await request.get(`/repos/${USER}/${REPO}/issues`);\n  expect(issues.ok()).toBeTruthy();\n  expect(await issues.json()).toContainEqual(expect.objectContaining({\n    title: '[Bug] report 1',\n    body: 'Bug description'\n  }));\n});\n\ntest('should create a feature request', async ({ request }) => {\n  const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {\n    data: {\n      title: '[Feature] request 1',\n      body: 'Feature description',\n    }\n  });\n  expect(newIssue.ok()).toBeTruthy();\n\n  const issues = await request.get(`/repos/${USER}/${REPO}/issues`);\n  expect(issues.ok()).toBeTruthy();\n  expect(await issues.json()).toContainEqual(expect.objectContaining({\n    title: '[Feature] request 1',\n    body: 'Feature description'\n  }));\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "test.beforeAll(async ({ request }) => {\n  // Create a new repository\n  const response = await request.post('/user/repos', {\n    data: {\n      name: REPO\n    }\n  });\n  expect(response.ok()).toBeTruthy();\n});\n\ntest.afterAll(async ({ request }) => {\n  // Delete the repository\n  const response = await request.delete(`/repos/${USER}/${REPO}`);\n  expect(response.ok()).toBeTruthy();\n});",
        },
      ],
    },
    {
      id: "using-request-context",
      title: {
        en: "Using request context",
        uk: "Використання контексту запитів",
      },
      paragraphs: [
        {
          en: "Behind the scenes, [`request` fixture](./api/class-fixtures#fixtures-request) will actually call [`method: APIRequest.newContext`]. You can always do that manually if you'd like more control. Below is a standalone script that does the same as `beforeAll` and `afterAll` from above.",
          uk: "Усередині [`request` fixture](./api/class-fixtures#fixtures-request) фактично викликає [`method: APIRequest.newContext`]. Те саме можна зробити вручну, якщо потрібен більший контроль. Нижче — окремий скрипт, який повторює логіку `beforeAll` і `afterAll` з прикладу вище.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "\nconst REPO = 'test-repo-1';\nconst USER = 'github-username';\n\n(async () => {\n  // Create a context that will issue http requests.\n  const context = await request.newContext({\n    baseURL: 'https://api.github.com',\n  });\n\n  // Create a repository.\n  await context.post('/user/repos', {\n    headers: {\n      'Accept': 'application/vnd.github.v3+json',\n      // Add GitHub personal access token.\n      'Authorization': `token ${process.env.API_TOKEN}`,\n    },\n    data: {\n      name: REPO\n    }\n  });\n\n  // Delete a repository.\n  await context.delete(`/repos/${USER}/${REPO}`, {\n    headers: {\n      'Accept': 'application/vnd.github.v3+json',\n      // Add GitHub personal access token.\n      'Authorization': `token ${process.env.API_TOKEN}`,\n    }\n  });\n})();",
        },
      ],
    },
    {
      id: "sending-api-requests-from-ui-tests",
      title: {
        en: "Sending API requests from UI tests",
        uk: "API-запити з UI-тестів",
      },
      paragraphs: [
        {
          en: "While running tests inside browsers you may want to make calls to the HTTP API of your application. It may be helpful if you need to prepare server state before running a test or to check some postconditions on the server after performing some actions in the browser. All of that could be achieved via [APIRequestContext] methods.",
          uk: "Під час UI-тестів у браузері часто потрібно викликати HTTP API застосунку. Це зручно, щоб підготувати стан на сервері перед тестом або перевірити постумови після дій у браузері. Усе це робиться методами [APIRequestContext].",
        },
        {
          en: "### Establishing preconditions",
          uk: "### Передумови",
        },
        {
          en: "The following test creates a new issue via API and then navigates to the list of all issues in the\nproject to check that it appears at the top of the list.",
          uk: "У цьому тесті спочатку створюється issue через API, потім відкривається список issues у проєкті,\nщоб переконатися, що новий запис з’явився зверху списку.",
        },
        {
          en: "### Validating postconditions",
          uk: "### Перевірка постумов",
        },
        {
          en: "The following test creates a new issue via user interface in the browser and then checks if\nit was created via API:",
          uk: "У цьому тесті issue створюється через інтерфейс браузера, після чого перевіряється,\nчи з’явився він на сервері через API:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "\nconst REPO = 'test-repo-1';\nconst USER = 'github-username';\n\n// Request context is reused by all tests in the file.\nlet apiContext;\n\ntest.beforeAll(async ({ playwright }) => {\n  apiContext = await playwright.request.newContext({\n    // All requests we send go to this API endpoint.\n    baseURL: 'https://api.github.com',\n    extraHTTPHeaders: {\n      // We set this header per GitHub guidelines.\n      'Accept': 'application/vnd.github.v3+json',\n      // Add authorization token to all requests.\n      // Assuming personal access token available in the environment.\n      'Authorization': `token ${process.env.API_TOKEN}`,\n    },\n  });\n});\n\ntest.afterAll(async ({ }) => {\n  // Dispose all responses.\n  await apiContext.dispose();\n});\n\ntest('last created issue should be first in the list', async ({ page }) => {\n  const newIssue = await apiContext.post(`/repos/${USER}/${REPO}/issues`, {\n    data: {\n      title: '[Feature] request 1',\n    }\n  });\n  expect(newIssue.ok()).toBeTruthy();\n\n  await page.goto(`https://github.com/${USER}/${REPO}/issues`);\n  const firstIssue = page.locator(`a[data-hovercard-type='issue']`).first();\n  await expect(firstIssue).toHaveText('[Feature] request 1');\n});",
        },
        {
          id: "cb-7",
          language: "js",
          code: "\nconst REPO = 'test-repo-1';\nconst USER = 'github-username';\n\n// Request context is reused by all tests in the file.\nlet apiContext;\n\ntest.beforeAll(async ({ playwright }) => {\n  apiContext = await playwright.request.newContext({\n    // All requests we send go to this API endpoint.\n    baseURL: 'https://api.github.com',\n    extraHTTPHeaders: {\n      // We set this header per GitHub guidelines.\n      'Accept': 'application/vnd.github.v3+json',\n      // Add authorization token to all requests.\n      // Assuming personal access token available in the environment.\n      'Authorization': `token ${process.env.API_TOKEN}`,\n    },\n  });\n});\n\ntest.afterAll(async ({ }) => {\n  // Dispose all responses.\n  await apiContext.dispose();\n});\n\ntest('last created issue should be on the server', async ({ page }) => {\n  await page.goto(`https://github.com/${USER}/${REPO}/issues`);\n  await page.getByText('New Issue').click();\n  await page.getByRole('textbox', { name: 'Title' }).fill('Bug report 1');\n  await page.getByRole('textbox', { name: 'Comment body' }).fill('Bug description');\n  await page.getByText('Submit new issue').click();\n  const issueId = new URL(page.url()).pathname.split('/').pop();\n\n  const newIssue = await apiContext.get(\n      `https://api.github.com/repos/${USER}/${REPO}/issues/${issueId}`\n  );\n  expect(newIssue.ok()).toBeTruthy();\n  expect(newIssue.json()).toEqual(expect.objectContaining({\n    title: 'Bug report 1'\n  }));\n});",
        },
      ],
    },
    {
      id: "reusing-authentication-state",
      title: {
        en: "Reusing authentication state",
        uk: "Повторне використання стану автентифікації",
      },
      paragraphs: [
        {
          en: "Web apps use cookie-based or token-based authentication, where authenticated\nstate is stored as [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).\nPlaywright provides [`method: APIRequestContext.storageState`] method that can be used to\nretrieve storage state from an authenticated context and then create new contexts with that state.",
          uk: "Вебзастосунки часто використовують автентифікацію на кукі або токенах: стан після входу зберігається у [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies).\nPlaywright надає метод [`method: APIRequestContext.storageState`], за допомогою якого можна\nзчитати storage state з уже автентифікованого контексту й створити нові контексти з цим станом.",
        },
        {
          en: "Storage state is interchangeable between [BrowserContext] and [APIRequestContext]. You can\nuse it to log in via API calls and then create a new context with cookies already there.\nThe following code snippet retrieves state from an authenticated [APIRequestContext] and\ncreates a new [BrowserContext] with that state.",
          uk: "Storage state можна переносити між [BrowserContext] і [APIRequestContext].\nНаприклад, увійти через API, а потім відкрити новий браузерний контекст уже з куками.\nУ фрагменті нижче стан зчитується з автентифікованого [APIRequestContext] і\nпередається в новий [BrowserContext].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-8",
          language: "js",
          code: "const requestContext = await request.newContext({\n  httpCredentials: {\n    username: 'user',\n    password: 'passwd'\n  }\n});\nawait requestContext.get(`https://api.example.com/login`);\n// Save storage state into the file.\nawait requestContext.storageState({ path: 'state.json' });\n\n// Create a new context with the saved storage state.\nconst context = await browser.newContext({ storageState: 'state.json' });",
        },
      ],
    },
    {
      id: "context-request-vs-global-request",
      title: {
        en: "Context request vs global request",
        uk: "Запит у контексті браузера та ізольований запит",
      },
      paragraphs: [
        {
          en: "There are two types of [APIRequestContext]:\n* associated with a [BrowserContext]\n* isolated instance, created via [`method: APIRequest.newContext`]",
          uk: "Існує два види [APIRequestContext]:\n* пов’язаний із [BrowserContext];\n* ізольований екземпляр, створений через [`method: APIRequest.newContext`].",
        },
        {
          en: "The main difference is that [APIRequestContext] accessible via [`property: BrowserContext.request`] and\n[`property: Page.request`] will populate request's `Cookie` header from the browser context and will\nautomatically update browser cookies if [APIResponse] has `Set-Cookie` header:",
          uk: "Головна відмінність: [APIRequestContext], доступний через [`property: BrowserContext.request`] та\n[`property: Page.request`], підставляє заголовок `Cookie` запиту з браузерного контексту й\nоновлює куки в браузері, якщо [APIResponse] містить заголовок `Set-Cookie`:",
        },
        {
          en: "If you don't want [APIRequestContext] to use and update cookies from the browser context, you can manually\ncreate a new instance of [APIRequestContext] which will have its own isolated cookies:",
          uk: "Якщо не потрібно, щоб [APIRequestContext] використовував і оновлював куки з браузерного контексту,\nстворіть вручну новий [APIRequestContext] з власним ізольованим сховищем кук:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "js",
          code: "test('context request will share cookie storage with its browser context', async ({\n  page,\n  context,\n}) => {\n  await context.route('https://www.github.com/', async route => {\n    // Send an API request that shares cookie storage with the browser context.\n    const response = await context.request.fetch(route.request());\n    const responseHeaders = response.headers();\n\n    // The response will have 'Set-Cookie' header.\n    const responseCookies = new Map(responseHeaders['set-cookie']\n        .split('\\n')\n        .map(c => c.split(';', 2)[0].split('=')));\n    // The response will have 3 cookies in 'Set-Cookie' header.\n    expect(responseCookies.size).toBe(3);\n    const contextCookies = await context.cookies();\n    // The browser context will already contain all the cookies from the API response.\n    expect(new Map(contextCookies.map(({ name, value }) =>\n      [name, value])\n    )).toEqual(responseCookies);\n\n    await route.fulfill({\n      response,\n      headers: { ...responseHeaders, foo: 'bar' },\n    });\n  });\n  await page.goto('https://www.github.com/');\n});",
        },
        {
          id: "cb-10",
          language: "js",
          code: "test('global context request has isolated cookie storage', async ({\n  page,\n  context,\n  browser,\n  playwright\n}) => {\n  // Create a new instance of APIRequestContext with isolated cookie storage.\n  const request = await playwright.request.newContext();\n  await context.route('https://www.github.com/', async route => {\n    const response = await request.fetch(route.request());\n    const responseHeaders = response.headers();\n\n    const responseCookies = new Map(responseHeaders['set-cookie']\n        .split('\\n')\n        .map(c => c.split(';', 2)[0].split('=')));\n    // The response will have 3 cookies in 'Set-Cookie' header.\n    expect(responseCookies.size).toBe(3);\n    const contextCookies = await context.cookies();\n    // The browser context will not have any cookies from the isolated API request.\n    expect(contextCookies.length).toBe(0);\n\n    // Manually export cookie storage.\n    const storageState = await request.storageState();\n    // Create a new context and initialize it with the cookies from the global request.\n    const browserContext2 = await browser.newContext({ storageState });\n    const contextCookies2 = await browserContext2.cookies();\n    // The new browser context will already contain all the cookies from the API response.\n    expect(\n        new Map(contextCookies2.map(({ name, value }) => [name, value]))\n    ).toEqual(responseCookies);\n\n    await route.fulfill({\n      response,\n      headers: { ...responseHeaders, foo: 'bar' },\n    });\n  });\n  await page.goto('https://www.github.com/');\n  await request.dispose();\n});",
        },
      ],
    },
  ],
  quiz: [],
}
