import type { PlaywrightTopic } from "../../types"

export const mockTopic: PlaywrightTopic = {
  slug: "mock",
  groupId: "guides",
  order: 250,
  sourceDoc: "mock.md",
  officialDocsUrl: "https://playwright.dev/docs/mock",
  title: {
    en: "Mock APIs",
    uk: "Імітація API",
  },
  summary: {
    en: "Web APIs are usually implemented as HTTP endpoints. Playwright provides APIs to **mock** and **modify** network traffic, both HTTP and HTTPS. Any requests that a page does, including [XHRs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests, can be tracked, modified and mocked. With Playwright you can also mock using HAR…",
    uk: "Веб-API зазвичай реалізують як HTTP-ендпоїнти. Playwright надає API для **імітації** та **змінення** мережевого трафіку, як HTTP, так і HTTPS. Будь-які запити сторінки, зокрема [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) і запити [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), можна відстежувати, змінювати та імітувати. У Playwright також можна імітувати за допомогою HAR…",
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
          en: "Web APIs are usually implemented as HTTP endpoints. Playwright provides APIs to **mock** and **modify** network traffic, both HTTP and HTTPS. Any requests that a page does, including [XHRs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and\n[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests, can be tracked, modified and mocked. With Playwright you can also mock using HAR files that contain multiple network requests made by the page.",
          uk: "Веб-API зазвичай реалізують як HTTP-ендпоїнти. Playwright надає API для **імітації** та **змінення** мережевого трафіку, як HTTP, так і HTTPS. Будь-які запити сторінки, зокрема [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) і запити\n[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), можна відстежувати, змінювати та імітувати. У Playwright також можна імітувати за допомогою HAR-файлів, які містять кілька мережевих запитів, зроблених сторінкою.",
        },
      ],
    },
    {
      id: "mock-api-requests",
      title: {
        en: "Mock API requests",
        uk: "Імітація API-запитів",
      },
      paragraphs: [
        {
          en: "The following code will intercept all the calls to `*/**/api/v1/fruits` and will return a custom response instead. No requests to the API will be made. The test goes to the URL that uses the mocked route and asserts that mock data is present on the page.",
          uk: "Наведений нижче код перехопить усі виклики до `*/**/api/v1/fruits` і натомість поверне власну відповідь. Запити до API виконуватися не будуть. Тест переходить за URL, який використовує зімітований маршрут, і перевіряє, що імітовані дані присутні на сторінці.",
        },
        {
          en: "You can see from the trace of the example test that the API was never called, it was however fulfilled with the mock data.\n",
          uk: "У трасі прикладу тесту видно, що API жодного разу не викликався, але запит було виконано з імітованими даними.\n",
        },
        {
          en: "Read more about [advanced networking](./network.md).",
          uk: "Докладніше про [розширену роботу з мережею](./network.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "test(\"mocks a fruit and doesn't call api\", async ({ page }) => {\n  // Mock the api call before navigating\n  await page.route('*/**/api/v1/fruits', async route => {\n    const json = [{ name: 'Strawberry', id: 21 }];\n    await route.fulfill({ json });\n  });\n  // Go to the page\n  await page.goto('https://demo.playwright.dev/api-mocking');\n\n  // Assert that the Strawberry fruit is visible\n  await expect(page.getByText('Strawberry')).toBeVisible();\n});",
        },
      ],
    },
    {
      id: "modify-api-responses",
      title: {
        en: "Modify API responses",
        uk: "Змінення API-відповідей",
      },
      paragraphs: [
        {
          en: "Sometimes, it is essential to make an API request, but the response needs to be patched to\nallow for reproducible testing. In that case, instead of mocking the request, one\ncan perform the request and fulfill it with the modified response.",
          uk: "Іноді важливо виконати API-запит, але відповідь потрібно підправити,\nщоб тестування було відтворюваним. У такому разі замість імітації запиту можна\nвиконати запит і завершити його зміненою відповіддю.",
        },
        {
          en: "In the example below we intercept the call to the fruit API and add a new fruit called 'Loquat', to the data. We then go to the url and assert that this data is there:",
          uk: "У прикладі нижче ми перехоплюємо виклик до API фруктів і додаємо до даних новий фрукт під назвою 'Loquat'. Потім переходимо за URL і перевіряємо, що ці дані є на сторінці:",
        },
        {
          en: "In the trace of our test we can see that the API was called and the response was modified.\n",
          uk: "У трасі нашого тесту видно, що API було викликано, а відповідь змінено.\n",
        },
        {
          en: "By inspecting the response we can see that our new fruit was added to the list.\n",
          uk: "Переглянувши відповідь, бачимо, що наш новий фрукт було додано до списку.\n",
        },
        {
          en: "Read more about [advanced networking](./network.md).",
          uk: "Докладніше про [розширену роботу з мережею](./network.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "test('gets the json from api and adds a new fruit', async ({ page }) => {\n  // Get the response and add to it\n  await page.route('*/**/api/v1/fruits', async route => {\n    const response = await route.fetch();\n    const json = await response.json();\n    json.push({ name: 'Loquat', id: 100 });\n    // Fulfill using the original response, while patching the response body\n    // with the given JSON object.\n    await route.fulfill({ response, json });\n  });\n\n  // Go to the page\n  await page.goto('https://demo.playwright.dev/api-mocking');\n\n  // Assert that the new fruit is visible\n  await expect(page.getByText('Loquat', { exact: true })).toBeVisible();\n});",
        },
      ],
    },
    {
      id: "mocking-with-har-files",
      title: {
        en: "Mocking with HAR files",
        uk: "Імітація за допомогою HAR-файлів",
      },
      paragraphs: [
        {
          en: "A HAR file is an [HTTP Archive](http://www.softwareishard.com/blog/har-12-spec/) file that contains a record of all the network requests that are made when a page is loaded. It contains information about the request and response headers, cookies, content, timings, and more. You can use HAR files to mock network requests in your tests. You'll need to:",
          uk: "HAR-файл — це файл [HTTP Archive](http://www.softwareishard.com/blog/har-12-spec/), який містить запис усіх мережевих запитів, зроблених під час завантаження сторінки. Він містить інформацію про заголовки запитів і відповідей, cookies, вміст, таймінги тощо. HAR-файли можна використовувати для імітації мережевих запитів у тестах. Вам потрібно:",
        },
        {
          en: "1. Record a HAR file.\n1. Commit the HAR file alongside the tests.\n1. Route requests using the saved HAR files in the tests.",
          uk: "1. Записати HAR-файл.\n1. Закомітити HAR-файл поруч із тестами.\n1. Маршрутизувати запити в тестах за допомогою збережених HAR-файлів.",
        },
        {
          en: "### Recording a HAR file",
          uk: "### Запис HAR-файлу",
        },
        {
          en: "To record a HAR file we use [`method: Page.routeFromHAR`] or [`method: BrowserContext.routeFromHAR`] method. This method takes in the path to the HAR file and an optional object of options.\nThe options object can contain the URL so that only requests with the URL matching the specified glob pattern will be served from the HAR File. If not specified, all requests will be served from the HAR file.",
          uk: "Щоб записати HAR-файл, використовуємо метод [`method: Page.routeFromHAR`] або [`method: BrowserContext.routeFromHAR`]. Цей метод приймає шлях до HAR-файлу та необов'язковий об'єкт параметрів.\nОб'єкт параметрів може містити URL, щоб із HAR-файлу обслуговувалися лише запити, URL яких відповідає вказаному glob-шаблону. Якщо URL не вказано, з HAR-файлу обслуговуватимуться всі запити.",
        },
        {
          en: "Setting `update` option to true will create or update the HAR file with the actual network information instead of serving the requests from the HAR file. Use it when creating a test to populate the HAR with real data.",
          uk: "Якщо встановити параметр `update` у true, HAR-файл буде створено або оновлено фактичною мережевою інформацією замість обслуговування запитів із HAR-файлу. Використовуйте це під час створення тесту, щоб наповнити HAR реальними даними.",
        },
        {
          en: "Alternatively, you can also record HAR files by using the [`option: Browser.newContext.recordHar`] option in [`method: Browser.newContext`] when creating a browser context. This allows you to capture all network traffic for the entire context until the context is closed.",
          uk: "Також HAR-файли можна записувати за допомогою параметра [`option: Browser.newContext.recordHar`] у [`method: Browser.newContext`] під час створення контексту браузера. Це дає змогу захопити весь мережевий трафік для всього контексту, доки його не буде закрито.",
        },
        {
          en: "Alternatively, you can also record HAR files by using the [`option: Browser.newContext.recordHarPath`] option in [`method: Browser.newContext`] when creating a browser context. This allows you to capture all network traffic for the entire context until the context is closed.",
          uk: "Також HAR-файли можна записувати за допомогою параметра [`option: Browser.newContext.recordHarPath`] у [`method: Browser.newContext`] під час створення контексту браузера. Це дає змогу захопити весь мережевий трафік для всього контексту, доки його не буде закрито.",
        },
        {
          en: "### Modifying a HAR file",
          uk: "### Змінення HAR-файлу",
        },
        {
          en: "Once you have recorded a HAR file you can modify it by opening the hashed .txt file inside your 'hars' folder and editing the JSON. This file should be committed to your source control. Anytime you run this test with `update: true` it will update your HAR file with the request from the API.",
          uk: "Після запису HAR-файлу його можна змінити, відкривши хешований .txt-файл у папці 'hars' і відредагувавши JSON. Цей файл слід закомітити в систему контролю версій. Щоразу, коли ви запускаєте цей тест із `update: true`, він оновлюватиме ваш HAR-файл запитом з API.",
        },
        {
          en: "### Replaying from HAR",
          uk: "### Відтворення з HAR",
        },
        {
          en: "Now that you have the HAR file recorded and modified the mock data, it can be used to serve matching responses in the test. For this, just turn off or simply remove the `update` option. This will run the test against the HAR file instead of hitting the API.",
          uk: "Тепер, коли HAR-файл записано, а імітовані дані змінено, його можна використовувати для обслуговування відповідних відповідей у тесті. Для цього просто вимкніть або видаліть параметр `update`. Тест виконуватиметься проти HAR-файлу замість звернення до API.",
        },
        {
          en: "In the trace of our test we can see that the route was fulfilled from the HAR file and the API was not called.\n",
          uk: "У трасі нашого тесту видно, що маршрут було виконано з HAR-файлу, а API не викликався.\n",
        },
        {
          en: "If we inspect the response we can see our new fruit was added to the JSON, which was done by manually updating the hashed `.txt` file inside the `hars` folder.\n",
          uk: "Якщо переглянути відповідь, видно, що наш новий фрукт було додано до JSON. Це зроблено вручну через оновлення хешованого `.txt`-файлу в папці `hars`.\n",
        },
        {
          en: "HAR replay matches URL and HTTP method strictly. For POST requests, it also matches POST payloads strictly. If multiple recordings match a request, the one with the most matching headers is picked. An entry resulting in a redirect will be followed automatically.",
          uk: "Відтворення HAR суворо зіставляє URL і HTTP-метод. Для POST-запитів також суворо зіставляється POST-навантаження. Якщо запиту відповідає кілька записів, буде вибрано той, у якого найбільше відповідних заголовків. Запис, що призводить до перенаправлення, буде автоматично виконано далі.",
        },
        {
          en: "Similar to when recording, if given HAR file name ends with `.zip`, it is considered an archive containing the HAR file along with network payloads stored as separate entries. You can also extract this archive, edit payloads or HAR log manually and point to the extracted har file. All the payloads will be resolved relative to the extracted har file on the file system.",
          uk: "Як і під час запису, якщо вказана назва HAR-файлу закінчується на `.zip`, він вважається архівом, що містить HAR-файл разом із мережевими payload-даними, збереженими як окремі записи. Ви також можете розпакувати цей архів, вручну відредагувати payload-дані або HAR-журнал і вказати на розпакований har-файл. Усі payload-дані буде розв'язано відносно розпакованого har-файлу у файловій системі.",
        },
        {
          en: "#### Recording HAR with CLI",
          uk: "#### Запис HAR через CLI",
        },
        {
          en: "We recommend the `update` option to record HAR file for your test. However, you can also record the HAR with Playwright CLI.",
          uk: "Ми рекомендуємо параметр `update` для запису HAR-файлу для вашого тесту. Водночас HAR також можна записати через Playwright CLI.",
        },
        {
          en: "Open the browser with Playwright CLI and pass `--save-har` option to produce a HAR file. Optionally, use `--save-har-glob` to only save requests you are interested in, for example API endpoints. If the har file name ends with `.zip`, artifacts are written as separate files and are all compressed into a single `zip`.",
          uk: "Відкрийте браузер через Playwright CLI і передайте параметр `--save-har`, щоб створити HAR-файл. За потреби використайте `--save-har-glob`, щоб зберегти лише ті запити, які вас цікавлять, наприклад API-ендпоїнти. Якщо назва har-файлу закінчується на `.zip`, артефакти записуються як окремі файли й усі стискаються в один `zip`.",
        },
        {
          en: "Read more about [advanced networking](./network.md).",
          uk: "Докладніше про [розширену роботу з мережею](./network.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "test('records or updates the HAR file', async ({ page }) => {\n  // Get the response from the HAR file\n  await page.routeFromHAR('./hars/fruit.har', {\n    url: '*/**/api/v1/fruits',\n    update: true,\n  });\n\n  // Go to the page\n  await page.goto('https://demo.playwright.dev/api-mocking');\n\n  // Assert that the fruit is visible\n  await expect(page.getByText('Strawberry')).toBeVisible();\n});",
        },
        {
          id: "cb-16",
          language: "json",
          code: '[\n  {\n    "name": "Playwright",\n    "id": 100\n  },\n  // ... other fruits\n]',
        },
        {
          id: "cb-17",
          language: "js",
          code: "test('gets the json from HAR and checks the new fruit has been added', async ({ page }) => {\n  // Replay API requests from HAR.\n  // Either use a matching response from the HAR,\n  // or abort the request if nothing matches.\n  await page.routeFromHAR('./hars/fruit.har', {\n    url: '*/**/api/v1/fruits',\n    update: false,\n  });\n\n  // Go to the page\n  await page.goto('https://demo.playwright.dev/api-mocking');\n\n  // Assert that the Playwright fruit is visible\n  await expect(page.getByText('Playwright', { exact: true })).toBeVisible();\n});",
        },
        {
          id: "cb-22",
          language: "bash",
          code: '# Save API requests from example.com as "example.har" archive.\nnpx playwright open --save-har=example.har --save-har-glob="**/api/**" https://example.com',
        },
      ],
    },
    {
      id: "mock-websockets",
      title: {
        en: "Mock WebSockets",
        uk: "Імітація WebSocket",
      },
      paragraphs: [
        {
          en: 'The following code will intercept WebSocket connections and mock entire communication over the WebSocket, instead of connecting to the server. This example responds to a `"request"` with a `"response"`.',
          uk: 'Наведений нижче код перехоплює WebSocket-з\'єднання й імітує всю комунікацію через WebSocket замість підключення до сервера. У цьому прикладі на `"request"` повертається `"response"`.',
        },
        {
          en: "Alternatively, you may want to connect to the actual server, but intercept messages in-between and modify or block them. Here is an example that modifies some of the messages sent by the page to the server, and leaves the rest unmodified.",
          uk: "Або ж вам може знадобитися підключитися до справжнього сервера, але перехоплювати проміжні повідомлення та змінювати або блокувати їх. Ось приклад, який змінює частину повідомлень, надісланих сторінкою на сервер, а решту залишає без змін.",
        },
        {
          en: "For more details, see [WebSocketRoute].",
          uk: "Докладніше дивіться в [WebSocketRoute].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-26",
          language: "js",
          code: "await page.routeWebSocket('wss://example.com/ws', ws => {\n  ws.onMessage(message => {\n    if (message === 'request')\n      ws.send('response');\n  });\n});",
        },
        {
          id: "cb-31",
          language: "js",
          code: "await page.routeWebSocket('wss://example.com/ws', ws => {\n  const server = ws.connectToServer();\n  ws.onMessage(message => {\n    if (message === 'request')\n      server.send('request2');\n    else\n      server.send(message);\n  });\n});",
        },
      ],
    },
  ],
  quiz: [],
}
