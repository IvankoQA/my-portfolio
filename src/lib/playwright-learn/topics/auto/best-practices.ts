import type { PlaywrightTopic } from "../../types"

export const bestPracticesTopic: PlaywrightTopic = {
  slug: "best-practices",
  groupId: "guides",
  order: 125,
  sourceDoc: "best-practices-js.md",
  officialDocsUrl: "https://playwright.dev/docs/best-practices",
  title: {
    en: "Best Practices",
    uk: "Найкращі практики",
  },
  summary: {
    en: "This guide should help you to make sure you are following our best practices and writing tests that are more resilient.",
    uk: "Цей посібник допоможе дотримуватися рекомендованих практик і писати стійкіші тести.",
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
          en: "This guide should help you to make sure you are following our best practices and writing tests that are more resilient.",
          uk: "Цей посібник допоможе дотримуватися рекомендованих практик і писати стійкіші тести.",
        },
      ],
    },
    {
      id: "testing-philosophy",
      title: {
        en: "Testing philosophy",
        uk: "Філософія тестування",
      },
      paragraphs: [
        {
          en: "### Test user-visible behavior",
          uk: "### Тестуйте те, що бачить користувач",
        },
        {
          en: "Automated tests should verify that the application code works for the end users, and avoid relying on implementation details such as things which users will not typically use, see, or even know about such as the name of a function, whether something is an array, or the CSS class of some element. The end user will see or interact with what is rendered on the page, so your test should typically only see/interact with the same rendered output.",
          uk: "Автотести мають перевіряти поведінку для кінцевого користувача, а не деталі реалізації — назви функцій, те, чи значення є масивом, CSS-класи тощо. Користувач бачить зрендерену сторінку, тому тест теж має орієнтуватися на той самий видимий результат.",
        },
        {
          en: "### Make tests as isolated as possible",
          uk: "### Максимально ізолюйте тести",
        },
        {
          en: "Each test should be completely isolated from another test and should run independently with its own local storage, session storage, data, cookies etc. [Test isolation](./browser-contexts.md) improves reproducibility, makes debugging easier and prevents cascading test failures.",
          uk: "Кожен тест має бути незалежним: свій local storage, session storage, дані, куки тощо. [Ізоляція тестів](./browser-contexts.md) підвищує відтворюваність, спрощує дебаг і запобігає ланцюговим падінням.",
        },
        {
          en: "In order to avoid repetition for a particular part of your test you can use [before and after hooks](https://playwright.dev/api/class-test.md). Within your test file add a before hook to run a part of your test before each test such as going to a particular URL or logging in to a part of your app. This keeps your tests isolated as no test relies on another. However it is also ok to have a little duplication when tests are simple enough especially if it keeps your tests clearer and easier to read and maintain.",
          uk: "Щоб не повторювати однакові кроки, використовуйте [before/after hooks](https://playwright.dev/api/class-test.md): наприклад, `beforeEach` для переходу на URL або входу в частину застосунку. Тести лишаються ізольованими, бо жоден не залежить від іншого.\n\nНевелике дублювання у простих тестах теж нормально, якщо так код читабельніший.",
        },
        {
          en: "You can also reuse the signed-in state in the tests with [setup project](./auth.md#basic-shared-account-in-all-tests). That way you can log in only once and then skip the log in step for all of the tests.",
          uk: "Можна повторно використовувати стан входу через [setup project](./auth.md#basic-shared-account-in-all-tests): залогінитися один раз і не повторювати це в кожному тесті.",
        },
        {
          en: "### Avoid testing third-party dependencies",
          uk: "### Не тестуйте сторонні залежності",
        },
        {
          en: "Only test what you control. Don't try to test links to external sites or third party servers that you do not control. Not only is it time consuming and can slow down your tests but also you cannot control the content of the page you are linking to, or if there are cookie banners or overlay pages or anything else that might cause your test to fail.",
          uk: "Тестуйте лише те, що контролюєте. Не варто ганяти реальні зовнішні сайти чи чужі сервери: це повільно, а контент, банери кук, оверлеї можуть зламати тест без вашої провини.",
        },
        {
          en: "Instead, use the [Playwright Network API](/network.md#handle-requests) and guarantee the response needed.",
          uk: "Краще перехоплювати мережу через [Playwright Network API](/network.md#handle-requests) і підставляти потрібну відповідь.",
        },
        {
          en: "### Testing with a database",
          uk: "### Тести з базою даних",
        },
        {
          en: "If working with a database then make sure you control the data. Test against a staging environment and make sure it doesn't change. For visual regression tests make sure the operating system and browser versions are the same.",
          uk: "Якщо є БД — контролюйте дані, тестуйте на стабільному staging. Для візуальних регресій узгодьте ОС і версії браузерів.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\ntest.beforeEach(async ({ page }) => {\n  // Runs before each test and signs in each page.\n  await page.goto('https://github.com/login');\n  await page.getByLabel('Username or email address').fill('username');\n  await page.getByLabel('Password').fill('password');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n});\n\ntest('first', async ({ page }) => {\n  // page is signed in.\n});\n\ntest('second', async ({ page }) => {\n  // page is signed in.\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "await page.route('**/api/fetch_data_third_party_dependency', route => route.fulfill({\n  status: 200,\n  body: testData,\n}));\nawait page.goto('https://example.com');",
        },
      ],
    },
    {
      id: "best-practices",
      title: {
        en: "Best Practices",
        uk: "Найкращі практики",
      },
      paragraphs: [
        {
          en: "### Use locators",
          uk: "### Використовуйте локатори",
        },
        {
          en: "In order to write end to end tests we need to first find elements on the webpage. We can do this by using Playwright's built in [locators](./locators.md). Locators come with auto waiting and retry-ability. Auto waiting means that Playwright performs a range of actionability checks on the elements, such as ensuring the element is visible and enabled before it performs the click. To make tests resilient, we recommend prioritizing user-facing attributes and explicit contracts.",
          uk: "Для e2e потрібно знаходити елементи на сторінці — для цього є вбудовані [locators](./locators.md) з автоочікуванням і повторними спробами: Playwright перевіряє, що елемент видимий і доступний, перш ніж клікнути. Для стійкості орієнтуйтеся на те, що бачить користувач, і на явні «контракти» в розмітці.",
        },
        {
          en: "#### Use chaining and filtering",
          uk: "#### Ланцюжки та фільтрація",
        },
        {
          en: "Locators can be [chained](./locators.md#matching-inside-a-locator) to narrow down the search to a particular part of the page.",
          uk: "Локатори можна [ланцюжити](./locators.md#matching-inside-a-locator), щоб звузити пошук до частини сторінки.",
        },
        {
          en: "You can also [filter locators](./locators.md#filtering-locators) by text or by another locator.",
          uk: "Також можна [фільтрувати локатори](./locators.md#filtering-locators) за текстом або іншим локатором.",
        },
        {
          en: "#### Prefer user-facing attributes to XPath or CSS selectors",
          uk: "#### Надавайте перевагу атрибутам для користувача, а не XPath/CSS «наосліп»",
        },
        {
          en: "Your DOM can easily change so having your tests depend on your DOM structure can lead to failing tests. For example consider selecting this button by its CSS classes. Should the designer change something then the class might change, thus breaking your test.",
          uk: "DOM часто змінюється; якщо тест жорстко прив’язаний до структури або CSS-класів, дизайнер може зламати тест однією правкою.",
        },
        {
          en: "Use locators that are resilient to changes in the DOM.",
          uk: "Обирайте локатори, стійкі до змін DOM.",
        },
        {
          en: "### Generate locators",
          uk: "### Генерація локаторів",
        },
        {
          en: "Playwright has a [test generator](./codegen.md) that can generate tests and pick locators for you. It will look at your page and figure out the best locator, prioritizing role, text and test id locators. If the generator finds multiple elements matching the locator, it will improve the locator to make it resilient and uniquely identify the target element, so you don't have to worry about failing tests due to locators.",
          uk: "Є [генератор тестів](./codegen.md), який підбирає локатори: пріоритет — role, text і test id; за потреби локатор уточнюється, щоб унікально вказувати на елемент.",
        },
        {
          en: "#### Use `codegen` to generate locators",
          uk: "#### `codegen` для локаторів",
        },
        {
          en: "To pick a locator run the `codegen` command followed by the URL that you would like to pick a locator from.",
          uk: "Запустіть `codegen` і вкажіть URL сторінки, з якої хочете зняти локатор.",
        },
        {
          en: "This will open a new browser window as well as the Playwright inspector. To pick a locator first click on the 'Record' button to stop the recording. By default when you run the `codegen` command it will start a new recording. Once you stop the recording the 'Pick Locator' button will be available to click.",
          uk: "Відкриється браузер і Playwright Inspector. Щоб підібрати локатор, спочатку натисніть «Record», щоб зупинити запис (за замовчуванням `codegen` починає новий запис). Після зупинки з’явиться кнопка «Pick Locator».",
        },
        {
          en: "You can then hover over any element on your page in the browser window and see the locator highlighted below your cursor. Clicking on an element will add the locator into the Playwright inspector. You can either copy the locator and paste into your test file or continue to explore the locator by editing it in the Playwright Inspector, for example by modifying the text, and seeing the results in the browser window.",
          uk: "Наведіть курсор на елемент — під ним підсвітиться локатор. Клік додасть його в Inspector; можна скопіювати в тест або відредагувати в Inspector і одразу бачити результат у вікні браузера.",
        },
        {
          en: "#### Use the VS Code extension to generate locators",
          uk: "#### Розширення VS Code для локаторів",
        },
        {
          en: "You can also use the [VS Code Extension](./getting-started-vscode.md) to generate locators as well as record a test. The VS Code extension also gives you a great developer experience when writing, running, and debugging tests.",
          uk: "Також можна [розширення VS Code](./getting-started-vscode.md): генерація локаторів, запис тестів і зручний цикл написання, запуску та дебагу.",
        },
        {
          en: "### Use web first assertions",
          uk: "### Web-first assertions",
        },
        {
          en: "Assertions are a way to verify that the expected result and the actual result matched or not. By using [web first assertions](./test-assertions.md) Playwright will wait until the expected condition is met. For example, when testing an alert message, a test would click a button that makes a message appear and check that the alert message is there. If the alert message takes half a second to appear, assertions such as `toBeVisible()` will wait and retry if needed.",
          uk: "Асершени перевіряють очікуваний результат. [Web-first assertions](./test-assertions.md) чекають на умову: наприклад, після кліку повідомлення з’являється з затримкою — `toBeVisible()` дочекається й повторить спроби.",
        },
        {
          en: "#### Don't use manual assertions",
          uk: "#### Не використовуйте «ручні» асершени без очікування",
        },
        {
          en: "Don't use manual assertions that are not awaiting the expect. In the code below the await is inside the expect rather than before it. When using assertions such as `isVisible()` the test won't wait a single second, it will just check the locator is there and return immediately.",
          uk: "Не залишайте `await` лише всередині «сирих» перевірок без web-first expect: виклики на кшталт `isVisible()` без очікування миттєво повернуть результат і тест може бути flaky.",
        },
        {
          en: "Use web first assertions such as `toBeVisible()` instead.",
          uk: "Краще `await expect(...).toBeVisible()` та інші web-first matchers.",
        },
        {
          en: "### Configure debugging",
          uk: "### Налаштування дебагу",
        },
        {
          en: "#### Local debugging",
          uk: "#### Локальний дебаг",
        },
        {
          en: "For local debugging we recommend you [debug your tests live in VS Code](./getting-started-vscode.md#debugging-your-tests) by installing the [VS Code extension](./getting-started-vscode.md). You can run tests in debug mode by right-clicking on the line next to the test you want to run which will open a browser window and pause at where the breakpoint is set.",
          uk: "Локально зручно [дебажити в VS Code](./getting-started-vscode.md#debugging-your-tests) через [розширення](./getting-started-vscode.md): правий клік біля тесту — Debug, відкриється браузер і зупинка на breakpoint.",
        },
        {
          en: "You can live debug your test by clicking or editing the locators in your test in VS Code which will highlight this locator in the browser window as well as show you any other matching locators found on the page.",
          uk: "Можна клікати або редагувати локатори в коді — вони підсвічуються в браузері, видно й інші збіги на сторінці.",
        },
        {
          en: "You can also debug your tests with the Playwright inspector by running your tests with the `--debug` flag.",
          uk: "Також можна дебажити через Playwright Inspector з прапором `--debug`.",
        },
        {
          en: "You can then step through your test, view actionability logs and edit the locator live and see it highlighted in the browser window. This will show you which locators match, how many of them there are.",
          uk: "Далі крок за кроком проходьте тест, дивіться логи actionability, редагуйте локатор у реальному часі й бачте підсвітку в браузері та кількість збігів.",
        },
        {
          en: "To debug a specific test add the name of the test file and the line number of the test followed by the `--debug` flag.",
          uk: "Щоб дебажити один тест, вкажіть файл і номер рядка тесту та прапор `--debug`.",
        },
        {
          en: "#### Debugging on CI",
          uk: "#### Дебаг на CI",
        },
        {
          en: "For CI failures, use the Playwright [trace viewer](./trace-viewer.md) instead of videos and screenshots. The trace viewer gives you a full trace of your tests as a local Progressive Web App (PWA) that can easily be shared. With the trace viewer you can view the timeline, inspect DOM snapshots for each action using dev tools, view network requests and more.",
          uk: "Для падінь на CI краще [trace viewer](./trace-viewer.md), ніж лише відео чи скриншоти: повний трейс як локальний PWA, який легко передати; таймлайн, знімки DOM на кожну дію, мережа тощо.",
        },
        {
          en: "Traces are configured in the Playwright config file and are set to run on CI on the first retry of a failed test. We don't recommend setting this to `on` so that traces are run on every test as it's very performance heavy. However you can run a trace locally when developing with the `--trace` flag.",
          uk: "Трейси налаштовуються в конфігу; на CI зручно знімати їх на першому retry після падіння. Режим `on` для кожного тесту не рекомендуємо — дуже важко для продуктивності. Локально під час розробки можна `--trace`.",
        },
        {
          en: "Once you run this command your traces will be recorded for each test and can be viewed directly from the HTML report.",
          uk: "Після запуску команди трейси збережуться для кожного тесту й відкриються з HTML-звіту.",
        },
        {
          en: "Traces can be opened by clicking on the icon next to the test file name or by opening each of the test reports and scrolling down to the traces section.",
          uk: "Трейс відкривається іконкою біля назви файлу тесту або в картці тесту внизу звіту.",
        },
        {
          en: "### Use Playwright's Tooling",
          uk: "### Інструменти Playwright",
        },
        {
          en: "Playwright comes with a range of tooling to help you write tests.\n- The [VS Code extension](./getting-started-vscode.md) gives you a great developer experience when writing, running, and debugging tests.\n- The [test generator](./codegen.md) can generate tests and pick locators for you.\n- The [trace viewer](./trace-viewer.md) gives you a full trace of your tests as a local PWA that can easily be shared. With the trace viewer you can view the timeline, inspect DOM snapshots for each action, view network requests and more.\n- The [UI Mode](./test-ui-mode) lets you explore, run and debug tests with a time travel experience complete with watch mode. All test files are loaded into the testing sidebar where you can expand each file and describe block to individually run, view, watch and debug each test.\n- [TypeScript](./test-typescript) in Playwright works out of the box and gives you better IDE integrations. Your IDE will show you everything you can do and highlight when you do something wrong. No TypeScript experience is needed and it is not necessary for your code to be in TypeScript, all you need to do is create your tests with a `.ts` extension.",
          uk: "Playwright постачає набір інструментів для написання тестів.\n- [Розширення VS Code](./getting-started-vscode.md) — зручний цикл написання, запуску й дебагу.\n- [Генератор тестів](./codegen.md) — запис і підбір локаторів.\n- [Trace viewer](./trace-viewer.md) — повний трейс як локальний PWA; таймлайн, знімки DOM на дію, мережа тощо.\n- [UI Mode](./test-ui-mode) — перегляд, запуск і дебаг з «подорожжю в часі» і watch; усі файли в сайдбарі, можна розгортати `describe` і ганяти окремі тести.\n- [TypeScript](./test-typescript) працює з коробки й покращує підказки IDE. Досвід TS не обов’язковий — достатньо розширення `.ts` для тестів.",
        },
        {
          en: "### Test across all browsers",
          uk: "### Тестуйте в усіх браузерах",
        },
        {
          en: "Playwright makes it easy to test your site across all [browsers](./test-projects.md#configure-projects-for-multiple-browsers) no matter what platform you are on. Testing across all browsers ensures your app works for all users. In your config file you can set up projects adding the name and which browser or device to use.",
          uk: "Легко ганяти сайт у всіх [браузерах](./test-projects.md#configure-projects-for-multiple-browsers) незалежно від вашої ОС. У конфігу додайте проєкти з іменами та потрібним браузером або пристроєм.",
        },
        {
          en: "### Keep your Playwright dependency up to date",
          uk: "### Оновлюйте залежність Playwright",
        },
        {
          en: "By keeping your Playwright version up to date you will be able to test your app on the latest browser versions and catch failures before the latest browser version is released to the public.",
          uk: "Актуальна версія Playwright дає свіжі збірки браузерів і допомагає зловити регресії до публічного релізу браузера.",
        },
        {
          en: "Check the [release notes](./release-notes.md) to see what the latest version is and what changes have been released.",
          uk: "Дивіться [release notes](./release-notes.md) — остання версія та зміни.",
        },
        {
          en: "You can see what version of Playwright you have by running the following command.",
          uk: "Поточну версію можна подивитися командою нижче.",
        },
        {
          en: "### Run tests on CI",
          uk: "### Запуск тестів на CI",
        },
        {
          en: "Setup CI/CD and run your tests frequently. The more often you run your tests the better. Ideally you should run your tests on each commit and pull request. Playwright comes with a [GitHub actions workflow](/ci-intro.md) so that tests will run on CI for you with no setup required. Playwright can also be setup on the [CI environment](/ci.md) of your choice.",
          uk: "Налаштуйте CI/CD і ганяйте тести якнайчастіше — ідеально на кожен коміт і PR. Є готовий [GitHub Actions workflow](/ci-intro.md); Playwright ставиться й на [інший CI](/ci.md) за вашим вибором.",
        },
        {
          en: "Use Linux when running your tests on CI as it is cheaper. Developers can use whatever environment when running locally but use linux on CI. Consider setting up [Sharding](./test-sharding.md) to make CI faster.",
          uk: "На CI зручніший Linux (дешевше). Локально — будь-яка ОС. Для швидкості додайте [шардінг](./test-sharding.md).",
        },
        {
          en: "#### Optimize browser downloads on CI",
          uk: "#### Оптимізація завантаження браузерів на CI",
        },
        {
          en: "Only install the browsers that you actually need, especially on CI. For example, if you're only testing with Chromium, install just Chromium.",
          uk: "Встановлюйте лише потрібні браузери, особливо на CI — наприклад, лише Chromium.",
        },
        {
          en: "This saves both download time and disk space on your CI machines.",
          uk: "Це економить час завантаження й місце на диску.",
        },
        {
          en: "### Lint your tests",
          uk: "### Лінтуйте тести",
        },
        {
          en: "We recommend TypeScript and linting with ESLint for your tests to catch errors early. Use [`@typescript-eslint/no-floating-promises`](https://typescript-eslint.io/rules/no-floating-promises/) [ESLint](https://eslint.org) rule to make sure there are no missing awaits before the asynchronous calls to the Playwright API. On your CI you can run `tsc --noEmit` to ensure that functions are called with the right signature.",
          uk: "Рекомендуємо TypeScript і ESLint, щоб ловити помилки раніше. Правило [`@typescript-eslint/no-floating-promises`](https://typescript-eslint.io/rules/no-floating-promises/) у [ESLint](https://eslint.org) допоможе не забувати `await` перед асинхронними викликами Playwright. На CI можна `tsc --noEmit` для перевірки сигнатур.",
        },
        {
          en: "### Use parallelism and sharding",
          uk: "### Паралелізм і шардінг",
        },
        {
          en: "Playwright runs tests in [parallel](./test-parallel.md) by default. Tests in a single file are run in order, in the same worker process. If you have many independent tests in a single file, you might want to run them in parallel",
          uk: "За замовчуванням тести [паралельні](./test-parallel.md). У межах одного файлу вони йдуть по черзі в одному воркері. Якщо багато незалежних тестів у файлі — увімкніть паралельний режим для них.",
        },
        {
          en: "Playwright can [shard](./test-parallel.md#shard-tests-between-multiple-machines) a test suite, so that it can be executed on multiple machines.",
          uk: "Набір тестів можна [розбити на шарди](./test-parallel.md#shard-tests-between-multiple-machines) між кількома машинами.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "// 👍\npage.getByRole('button', { name: 'submit' });",
        },
        {
          id: "cb-4",
          language: "js",
          code: "const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });",
        },
        {
          id: "cb-5",
          language: "js",
          code: "await page\n    .getByRole('listitem')\n    .filter({ hasText: 'Product 2' })\n    .getByRole('button', { name: 'Add to cart' })\n    .click();",
        },
        {
          id: "cb-6",
          language: "js",
          code: "// 👎\npage.locator('button.buttonIcon.episode-actions-later');",
        },
        {
          id: "cb-7",
          language: "js",
          code: "// 👍\npage.getByRole('button', { name: 'submit' });",
        },
        {
          id: "cb-8",
          language: "js",
          code: "// 👍\nawait expect(page.getByText('welcome')).toBeVisible();\n\n// 👎\nexpect(await page.getByText('welcome').isVisible()).toBe(true);",
        },
        {
          id: "cb-9",
          language: "js",
          code: "// 👎\nexpect(await page.getByText('welcome').isVisible()).toBe(true);",
        },
        {
          id: "cb-10",
          language: "js",
          code: "// 👍\nawait expect(page.getByText('welcome')).toBeVisible();",
        },
        {
          id: "cb-11",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'chromium',\n      use: { ...devices['Desktop Chrome'] },\n    },\n    {\n      name: 'firefox',\n      use: { ...devices['Desktop Firefox'] },\n    },\n    {\n      name: 'webkit',\n      use: { ...devices['Desktop Safari'] },\n    },\n  ],\n});",
        },
        {
          id: "cb-12",
          language: "bash",
          code: "# Instead of installing all browsers\nnpx playwright install --with-deps\n\n# Install only Chromium\nnpx playwright install chromium --with-deps",
        },
        {
          id: "cb-13",
          language: "js",
          code: "\ntest.describe.configure({ mode: 'parallel' });\n\ntest('runs in parallel 1', async ({ page }) => { /* ... */ });\ntest('runs in parallel 2', async ({ page }) => { /* ... */ });",
        },
      ],
    },
    {
      id: "productivity-tips",
      title: {
        en: "Productivity tips",
        uk: "Поради продуктивності",
      },
      paragraphs: [
        {
          en: "### Use Soft assertions",
          uk: "### М’які (soft) асершени",
        },
        {
          en: "If your test fails, Playwright will give you an error message showing what part of the test failed which you can see either in VS Code, the terminal, the HTML report, or the trace viewer. However, you can also use [soft assertions](/test-assertions.md#soft-assertions). These do not immediately terminate the test execution, but rather compile and display a list of failed assertions once the test ended.",
          uk: "При падінні тесту Playwright покаже, що зламалося — у VS Code, терміналі, HTML-звіті або trace viewer. Альтернатива — [soft assertions](/test-assertions.md#soft-assertions): тест не зупиняється одразу, а наприкінці збирається список невдалих перевірок.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-14",
          language: "js",
          code: "// Make a few checks that will not stop the test when failed...\nawait expect.soft(page.getByTestId('status')).toHaveText('Success');\n\n// ... and continue the test to check more things.\nawait page.getByRole('link', { name: 'next page' }).click();",
        },
      ],
    },
  ],
  quiz: [],
}
