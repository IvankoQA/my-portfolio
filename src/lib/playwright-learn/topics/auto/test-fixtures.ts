import type { PlaywrightTopic } from "../../types"

export const testFixturesTopic: PlaywrightTopic = {
  slug: "test-fixtures",
  groupId: "test-runner",
  order: 335,
  level: "intermediate",
  trackOrder: 4,
  sourceDoc: "test-fixtures-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-fixtures",
  title: {
    en: "Fixtures",
    uk: "Фікстури",
  },
  summary: {
    en: "Playwright Test is based on the concept of test fixtures. Test fixtures are used to establish the environment for each test, giving the test everything it needs and nothing else. Test fixtures are isolated between tests. With fixtures, you can group tests based on their meaning, instead of their common setup.",
    uk: "Playwright Test базується на концепції тестових фікстур. Фікстури готують середовище для кожного тесту: дають лише те, що потрібно, і нічого зайвого. Фікстури ізольовані між тестами. З ними можна групувати тести за змістом, а не за спільним setup.",
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
          en: "Playwright Test is based on the concept of test fixtures. Test fixtures are used to establish the environment for each test, giving the test everything it needs and nothing else. Test fixtures are isolated between tests. With fixtures, you can group tests based on their meaning, instead of their common setup.",
          uk: "Playwright Test базується на концепції тестових фікстур. Фікстури готують середовище для кожного тесту: дають лише те, що потрібно, і нічого зайвого. Фікстури ізольовані між тестами. З ними можна групувати тести за змістом, а не за спільним setup.",
        },
        {
          en: "### Built-in fixtures",
          uk: "### Вбудовані фікстури",
        },
        {
          en: "You have already used test fixtures in your first test.",
          uk: "Ви вже використовували фікстури в першому тесті.",
        },
        {
          en: "The `{ page }` argument tells Playwright Test to set up the `page` fixture and provide it to your test function.",
          uk: "Аргумент `{ page }` каже Playwright Test підготувати фікстуру `page` і передати її у функцію тесту.",
        },
        {
          en: "Here is a list of the pre-defined fixtures that you are likely to use most of the time:",
          uk: "Ось попередньо визначені фікстури, які найчастіше знадобляться:",
        },
        {
          en: "|Fixture    |Type               |Description                      |\n|:----------|:------------------|:--------------------------------|\n|page       |[Page]             |Isolated page for this test run. |\n|context    |[BrowserContext]   |Isolated context for this test run. The `page` fixture belongs to this context as well. Learn how to [configure context](./test-configuration.md). |\n|browser    |[Browser]          |Browsers are shared across tests to optimize resources. Learn how to [configure browsers](./test-configuration.md). |\n|browserName|[string]           |The name of the browser currently running the test. Either `chromium`, `firefox` or `webkit`.|\n|request    |[APIRequestContext]|Isolated [APIRequestContext](./api/class-apirequestcontext.md) instance for this test run.|",
          uk: "|Фікстура   |Тип                |Опис                             |\n|:----------|:------------------|:--------------------------------|\n|page       |[Page]             |Ізольована сторінка для цього запуску тесту. |\n|context    |[BrowserContext]   |Ізольований контекст для цього запуску тесту. Фікстура `page` також належить цьому контексту. Див. [налаштування контексту](./test-configuration.md). |\n|browser    |[Browser]          |Браузери спільні між тестами для економії ресурсів. Див. [налаштування браузерів](./test-configuration.md). |\n|browserName|[string]           |Назва браузера, у якому зараз виконується тест: `chromium`, `firefox` або `webkit`.|\n|request    |[APIRequestContext]|Ізольований екземпляр [APIRequestContext](./api/class-apirequestcontext.md) для цього запуску тесту.|",
        },
        {
          en: "### Without fixtures",
          uk: "### Без фікстур",
        },
        {
          en: "Here is how a typical test environment setup differs between the traditional test style and the fixture-based one.",
          uk: "Ось чим типове налаштування середовища тестів відрізняється між класичним стилем і підходом на фікстурах.",
        },
        {
          en: '`TodoPage` is a class that helps us interact with a "todo list" page of the web app, following the [Page Object Model](./pom.md) pattern. It uses Playwright\'s `page` internally.',
          uk: "`TodoPage` — клас для роботи зі сторінкою «todo list» вебзастосунку за патерном [Page Object Model](./pom.md). Всередині використовує `page` Playwright.",
        },
        {
          en: "Click to expand the code for the TodoPage",
          uk: "Натисніть, щоб розгорнути код TodoPage",
        },
        {
          en: "### With fixtures",
          uk: "### З фікстурами",
        },
        {
          en: "Fixtures have a number of advantages over before/after hooks:\n- Fixtures **encapsulate** setup and teardown in the same place so it is easier to write. So if you have an after hook that tears down what was created in a before hook, consider turning them into a fixture.\n- Fixtures are **reusable** between test files - you can define them once and use them in all your tests. That's how Playwright's built-in `page` fixture works. So if you have a helper function that is used in multiple tests, consider turning it into a fixture.\n- Fixtures are **on-demand** - you can define as many fixtures as you'd like, and Playwright Test will setup only the ones needed by your test and nothing else.\n- Fixtures are **composable** - they can depend on each other to provide complex behaviors.\n- Fixtures are **flexible**. Tests can use any combination of fixtures to precisely tailor the environment to their needs, without affecting other tests.\n- Fixtures simplify **grouping**. You no longer need to wrap tests in `describe`s that set up their environment, and are free to group your tests by their meaning instead.",
          uk: "Фікстури мають низку переваг над хуками before/after:\n- Фікстури **інкапсулюють** setup і teardown в одному місці — простіше писати. Якщо after знімає те, що створив before, краще об’єднати це в одну фікстуру.\n- Фікстури **повторно використовуються** між файлами тестів — визначте один раз і використовуйте скрізь. Так працює вбудована фікстура `page`. Якщо хелпер викликається в багатьох тестах, зробіть із нього фікстуру.\n- Фікстури **за запитом** — можна оголосити скільки завгодно, а Playwright Test підготує лише ті, що потрібні конкретному тесту.\n- Фікстури **компонуються** — можуть залежати одна від одної для складної поведінки.\n- Фікстури **гнучкі**. Тест може комбінувати їх довільно, підлаштовуючи середовище, не впливаючи на інші тести.\n- Фікстури спрощують **групування**. Не потрібно обгортати тести в `describe` лише заради середовища — групуйте за змістом.",
        },
        {
          en: "Click to expand the code for the TodoPage",
          uk: "Натисніть, щоб розгорнути код TodoPage",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\ntest('basic test', async ({ page }) => {\n  await page.goto('https://playwright.dev/');\n\n  await expect(page).toHaveTitle(/Playwright/);\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "\nexport class TodoPage {\n  private readonly inputBox: Locator;\n  private readonly todoItems: Locator;\n\n  constructor(public readonly page: Page) {\n    this.inputBox = this.page.locator('input.new-todo');\n    this.todoItems = this.page.getByTestId('todo-item');\n  }\n\n  async goto() {\n    await this.page.goto('https://demo.playwright.dev/todomvc/');\n  }\n\n  async addToDo(text: string) {\n    await this.inputBox.fill(text);\n    await this.inputBox.press('Enter');\n  }\n\n  async remove(text: string) {\n    const todo = this.todoItems.filter({ hasText: text });\n    await todo.hover();\n    await todo.getByLabel('Delete').click();\n  }\n\n  async removeAll() {\n    while ((await this.todoItems.count()) > 0) {\n      await this.todoItems.first().hover();\n      await this.todoItems.getByLabel('Delete').first().click();\n    }\n  }\n}",
        },
        {
          id: "cb-3",
          language: "js",
          code: "const { test } = require('@playwright/test');\nconst { TodoPage } = require('./todo-page');\n\ntest.describe('todo tests', () => {\n  let todoPage;\n\n  test.beforeEach(async ({ page }) => {\n    todoPage = new TodoPage(page);\n    await todoPage.goto();\n    await todoPage.addToDo('item1');\n    await todoPage.addToDo('item2');\n  });\n\n  test.afterEach(async () => {\n    await todoPage.removeAll();\n  });\n\n  test('should add an item', async () => {\n    await todoPage.addToDo('my item');\n    // ...\n  });\n\n  test('should remove an item', async () => {\n    await todoPage.remove('item1');\n    // ...\n  });\n});",
        },
        {
          id: "cb-4",
          language: "js",
          code: "\nexport class TodoPage {\n  private readonly inputBox: Locator;\n  private readonly todoItems: Locator;\n\n  constructor(public readonly page: Page) {\n    this.inputBox = this.page.locator('input.new-todo');\n    this.todoItems = this.page.getByTestId('todo-item');\n  }\n\n  async goto() {\n    await this.page.goto('https://demo.playwright.dev/todomvc/');\n  }\n\n  async addToDo(text: string) {\n    await this.inputBox.fill(text);\n    await this.inputBox.press('Enter');\n  }\n\n  async remove(text: string) {\n    const todo = this.todoItems.filter({ hasText: text });\n    await todo.hover();\n    await todo.getByLabel('Delete').click();\n  }\n\n  async removeAll() {\n    while ((await this.todoItems.count()) > 0) {\n      await this.todoItems.first().hover();\n      await this.todoItems.getByLabel('Delete').first().click();\n    }\n  }\n}",
        },
        {
          id: "cb-5",
          language: "js",
          code: "\n// Extend basic test by providing a \"todoPage\" fixture.\nconst test = base.extend({\n  todoPage: async ({ page }, use) => {\n    const todoPage = new TodoPage(page);\n    await todoPage.goto();\n    await todoPage.addToDo('item1');\n    await todoPage.addToDo('item2');\n    await use(todoPage);\n    await todoPage.removeAll();\n  },\n});\n\ntest('should add an item', async ({ todoPage }) => {\n  await todoPage.addToDo('my item');\n  // ...\n});\n\ntest('should remove an item', async ({ todoPage }) => {\n  await todoPage.remove('item1');\n  // ...\n});",
        },
      ],
    },
    {
      id: "creating-a-fixture",
      title: {
        en: "Creating a fixture",
        uk: "Створення фікстури",
      },
      paragraphs: [
        {
          en: "To create your own fixture, use [`method: Test.extend`] to create a new `test` object that will include it.",
          uk: "Щоб створити власну фікстуру, використайте [`method: Test.extend`] і отримайте новий об’єкт `test`, який її міститиме.",
        },
        {
          en: "Below we create two fixtures `todoPage` and `settingsPage` that follow the [Page Object Model](./pom.md) pattern.",
          uk: "Нижче створюємо дві фікстури — `todoPage` і `settingsPage` — за патерном [Page Object Model](./pom.md).",
        },
        {
          en: "Click to expand the code for the TodoPage and SettingsPage",
          uk: "Натисніть, щоб розгорнути код TodoPage і SettingsPage",
        },
        {
          en: "SettingsPage is similar:",
          uk: "SettingsPage влаштований подібно:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "\nexport class TodoPage {\n  private readonly inputBox: Locator;\n  private readonly todoItems: Locator;\n\n  constructor(public readonly page: Page) {\n    this.inputBox = this.page.locator('input.new-todo');\n    this.todoItems = this.page.getByTestId('todo-item');\n  }\n\n  async goto() {\n    await this.page.goto('https://demo.playwright.dev/todomvc/');\n  }\n\n  async addToDo(text: string) {\n    await this.inputBox.fill(text);\n    await this.inputBox.press('Enter');\n  }\n\n  async remove(text: string) {\n    const todo = this.todoItems.filter({ hasText: text });\n    await todo.hover();\n    await todo.getByLabel('Delete').click();\n  }\n\n  async removeAll() {\n    while ((await this.todoItems.count()) > 0) {\n      await this.todoItems.first().hover();\n      await this.todoItems.getByLabel('Delete').first().click();\n    }\n  }\n}",
        },
        {
          id: "cb-7",
          language: "js",
          code: "\nexport class SettingsPage {\n  constructor(public readonly page: Page) {\n  }\n\n  async switchToDarkMode() {\n    // ...\n  }\n}",
        },
        {
          id: "cb-8",
          language: "js",
          code: "\n// Declare the types of your fixtures.\ntype MyFixtures = {\n  todoPage: TodoPage;\n  settingsPage: SettingsPage;\n};\n\n// Extend base test by providing \"todoPage\" and \"settingsPage\".\n// This new \"test\" can be used in multiple test files, and each of them will get the fixtures.\nexport const test = base.extend({\n  todoPage: async ({ page }, use) => {\n    // Set up the fixture.\n    const todoPage = new TodoPage(page);\n    await todoPage.goto();\n    await todoPage.addToDo('item1');\n    await todoPage.addToDo('item2');\n\n    // Use the fixture value in the test.\n    await use(todoPage);\n\n    // Clean up the fixture.\n    await todoPage.removeAll();\n  },\n\n  settingsPage: async ({ page }, use) => {\n    await use(new SettingsPage(page));\n  },\n});\nexport { expect } from '@playwright/test';",
        },
      ],
    },
    {
      id: "using-a-fixture",
      title: {
        en: "Using a fixture",
        uk: "Використання фікстури",
      },
      paragraphs: [
        {
          en: "Just mention a fixture in your test function argument, and the test runner will take care of it. Fixtures are also available in hooks and other fixtures. If you use TypeScript, fixtures will be type safe.",
          uk: "Просто вкажіть фікстуру в аргументах функції тесту — тестраннер підготує її сам. Фікстури доступні в хуках і в інших фікстурах. У TypeScript вони типобезпечні.",
        },
        {
          en: "Below we use the `todoPage` and `settingsPage` fixtures that we defined above.",
          uk: "Нижче використовуємо фікстури `todoPage` і `settingsPage`, визначені вище.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "js",
          code: "\ntest.beforeEach(async ({ settingsPage }) => {\n  await settingsPage.switchToDarkMode();\n});\n\ntest('basic test', async ({ todoPage, page }) => {\n  await todoPage.addToDo('something nice');\n  await expect(page.getByTestId('todo-title')).toContainText(['something nice']);\n});",
        },
      ],
    },
    {
      id: "overriding-fixtures",
      title: {
        en: "Overriding fixtures",
        uk: "Перевизначення фікстур",
      },
      paragraphs: [
        {
          en: "In addition to creating your own fixtures, you can also override existing fixtures to fit your needs. Consider the following example which overrides the `page` fixture by automatically navigating to the `baseURL`:",
          uk: "Окрім власних фікстур, можна перевизначати наявні під свої потреби. У прикладі нижче фікстура `page` автоматично переходить на `baseURL`:",
        },
        {
          en: "Notice that in this example, the `page` fixture is able to depend on other built-in fixtures such as [`property: TestOptions.baseURL`]. We can now configure `baseURL` in the configuration file, or locally in the test file with [`method: Test.use`].",
          uk: "Тут фікстура `page` залежить від інших вбудованих, зокрема [`property: TestOptions.baseURL`]. `baseURL` можна задати в конфігурації або локально в файлі тестів через [`method: Test.use`].",
        },
        {
          en: "Fixtures can also be overridden, causing the base fixture to be completely replaced with something different. For example, we could override the [`property: TestOptions.storageState`] fixture to provide our own data.",
          uk: "Фікстуру можна перевизначити так, що базова версія повністю замінюється. Наприклад, перевизначити [`property: TestOptions.storageState`], щоб підставити власні дані.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-10",
          language: "js",
          code: "\nexport const test = base.extend({\n  page: async ({ baseURL, page }, use) => {\n    await page.goto(baseURL);\n    await use(page);\n  },\n});",
        },
        {
          id: "cb-11",
          language: "js",
          code: "\ntest.use({ baseURL: 'https://playwright.dev' });",
        },
        {
          id: "cb-12",
          language: "js",
          code: "\nexport const test = base.extend({\n  storageState: async ({}, use) => {\n    const cookie = await getAuthCookie();\n    await use({ cookies: [cookie] });\n  },\n});",
        },
      ],
    },
    {
      id: "worker-scoped-fixtures",
      title: {
        en: "Worker-scoped fixtures",
        uk: "Фікстури рівня worker",
      },
      paragraphs: [
        {
          en: "Playwright Test uses [worker processes](./test-parallel.md) to run test files. Similar to how test fixtures are set up for individual test runs, worker fixtures are set up for each worker process. That's where you can set up services, run servers, etc. Playwright Test will reuse the worker process for as many test files as it can, provided their worker fixtures match and hence environments are identical.",
          uk: "Playwright Test запускає файли тестів у [воркер-процесах](./test-parallel.md). Як тестові фікстури готуються для кожного тесту, worker-фікстури — для кожного воркера. Тут зручно піднімати сервіси, сервери тощо. Воркер перевикористовується для якомога більшої кількості файлів, якщо worker-фікстури збігаються й середовище ідентичне.",
        },
        {
          en: "Below we'll create an `account` fixture that will be shared by all tests in the same worker, and override the `page` fixture to log in to this account for each test. To generate unique accounts, we'll use the [`property: WorkerInfo.workerIndex`] that is available to any test or fixture. Note the tuple-like syntax for the worker fixture - we have to pass `{scope: 'worker'}` so that test runner sets this fixture up once per worker.",
          uk: "Нижче створюємо фікстуру `account`, спільну для всіх тестів одного воркера, і перевизначаємо `page`, щоб кожен тест входив у цей акаунт. Для унікальних акаунтів використаємо [`property: WorkerInfo.workerIndex`], доступний у будь-якому тесті чи фікстурі. Для worker-фікстури — кортежний синтаксис і `{scope: 'worker'}`, щоб тестраннер підготував її один раз на воркер.",
        },
        {
          en: "In addition to only being run once per worker, worker-scoped fixtures also get a separate timeout equal to the default test timeout. You can change it by passing the `timeout` option. See [fixture timeout](#fixture-timeout) for more details.",
          uk: "Окрім одноразового запуску на воркер, worker-фікстури мають окремий таймаут, рівний дефолтному таймауту тесту. Його можна змінити опцією `timeout`. Деталі — у розділі [fixture timeout](#fixture-timeout).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-13",
          language: "js",
          code: "\ntype Account = {\n  username: string;\n  password: string;\n};\n\n// Note that we pass worker fixture types as a second template parameter.\nexport const test = base.extend({\n  account: [async ({ browser }, use, workerInfo) => {\n    // Unique username.\n    const username = 'user' + workerInfo.workerIndex;\n    const password = 'verysecure';\n\n    // Create the account with Playwright.\n    const page = await browser.newPage();\n    await page.goto('/signup');\n    await page.getByLabel('User Name').fill(username);\n    await page.getByLabel('Password').fill(password);\n    await page.getByText('Sign up').click();\n    // Make sure everything is ok.\n    await expect(page.getByTestId('result')).toHaveText('Success');\n    // Do not forget to cleanup.\n    await page.close();\n\n    // Use the account value.\n    await use({ username, password });\n  }, { scope: 'worker' }],\n\n  page: async ({ page, account }, use) => {\n    // Sign in with our account.\n    const { username, password } = account;\n    await page.goto('/signin');\n    await page.getByLabel('User Name').fill(username);\n    await page.getByLabel('Password').fill(password);\n    await page.getByText('Sign in').click();\n    await expect(page.getByTestId('userinfo')).toHaveText(username);\n\n    // Use signed-in page in the test.\n    await use(page);\n  },\n});\nexport { expect } from '@playwright/test';",
        },
      ],
    },
    {
      id: "automatic-fixtures",
      title: {
        en: "Automatic fixtures",
        uk: "Автоматичні фікстури",
      },
      paragraphs: [
        {
          en: "Automatic fixtures are set up for each test/worker, even when the test does not list them directly. To create an automatic fixture, use the tuple syntax and pass `{ auto: true }`.",
          uk: "Автоматичні фікстури підготовлюються для кожного тесту/воркера, навіть якщо тест їх явно не перелічує. Створюйте їх кортежним синтаксисом з `{ auto: true }`.",
        },
        {
          en: "Here is an example fixture that automatically attaches debug logs when the test fails, so we can later review the logs in the reporter. Note how it uses the [TestInfo] object that is available in each test/fixture to retrieve metadata about the test being run.",
          uk: "Приклад фікстури, яка автоматично додає debug-логи при падінні тесту, щоб потім переглянути їх у репортері. Використовується об’єкт [TestInfo], доступний у кожному тесті/фікстурі для метаданих про запуск.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-14",
          language: "js",
          code: "\nexport const test = base.extend({\n  saveLogs: [async ({}, use, testInfo) => {\n    // Collecting logs during the test.\n    const logs = [];\n    debug.log = (...args) => logs.push(args.map(String).join(''));\n    debug.enable('myserver');\n\n    await use();\n\n    // After the test we can check whether the test passed or failed.\n    if (testInfo.status !== testInfo.expectedStatus) {\n      // outputPath() API guarantees a unique file name.\n      const logFile = testInfo.outputPath('logs.txt');\n      await fs.promises.writeFile(logFile, logs.join('\\n'), 'utf8');\n      testInfo.attachments.push({ name: 'logs', contentType: 'text/plain', path: logFile });\n    }\n  }, { auto: true }],\n});\nexport { expect } from '@playwright/test';",
        },
      ],
    },
    {
      id: "fixture-timeout",
      title: {
        en: "Fixture timeout",
        uk: "Таймаут фікстури",
      },
      paragraphs: [
        {
          en: "Fixture is considered to be a part of a test, and so its setup and teardown running time counts towards the test timeout. Therefore, a slow fixture may cause test timeouts. You can set a separate larger timeout for such a fixture, and keep the overall test timeout small.",
          uk: "Фікстура вважається частиною тесту: час setup і teardown входить у таймаут тесту. Повільна фікстура може спричинити таймаут. Для неї можна задати окремий більший таймаут, залишивши загальний таймаут тесту малим.",
        },
        {
          en: "Unlike regular test-scoped fixtures, each [worker-scoped](#worker-scoped-fixtures) fixture has its own timeout, equal to the test timeout. You can change the timeout for a worker-scoped fixture in the same way.",
          uk: "На відміну від звичайних тестових фікстур, кожна [worker-scoped](#worker-scoped-fixtures) фікстура має власний таймаут, рівний таймауту тесту. Змінити його можна так само.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-15",
          language: "js",
          code: "\nconst test = base.extend({\n  slowFixture: [async ({}, use) => {\n    // ... perform a slow operation ...\n    await use('hello');\n  }, { timeout: 60000 }]\n});\n\ntest('example test', async ({ slowFixture }) => {\n  // ...\n});",
        },
      ],
    },
    {
      id: "fixtures-options",
      title: {
        en: "Fixtures-options",
        uk: "Опції-фікстури",
      },
      paragraphs: [
        {
          en: 'Playwright Test supports running multiple test projects that can be configured separately. You can use "option" fixtures to make your configuration options declarative and type safe. Learn more about [parameterizing tests](./test-parameterize.md).',
          uk: "Playwright Test підтримує кілька тестових проєктів з окремою конфігурацією. «Опційні» фікстури роблять опції декларативними й типобезпечними. Див. [параметризацію тестів](./test-parameterize.md).",
        },
        {
          en: "Below we'll create a `defaultItem` option in addition to the `todoPage` fixture from other examples. This option will be set in the configuration file. Note the tuple syntax and `{ option: true }` argument.",
          uk: "Нижче додаємо опцію `defaultItem` поруч із фікстурою `todoPage` з інших прикладів. Значення задається в конфігу. Зверніть увагу на кортежний синтаксис і аргумент `{ option: true }`.",
        },
        {
          en: "Click to expand the code for the TodoPage",
          uk: "Натисніть, щоб розгорнути код TodoPage",
        },
        {
          en: "We can now use the `todoPage` fixture as usual, and set the `defaultItem` option in the configuration file.",
          uk: "Фікстуру `todoPage` використовуємо як завжди, а `defaultItem` задаємо в конфігураційному файлі.",
        },
        {
          en: "**Array as an option value**",
          uk: "**Масив як значення опції**",
        },
        {
          en: "If the value of your option is an array, for example `[{ name: 'Alice' }, { name: 'Bob' }]`, you'll need to wrap it into an extra array when providing the value. This is best illustrated with an example.",
          uk: "Якщо значення опції — масив, наприклад `[{ name: 'Alice' }, { name: 'Bob' }]`, його треба обгорнути в додатковий масив під час передачі. Краще видно на прикладі.",
        },
        {
          en: "**Reset an option**",
          uk: "**Скидання опції**",
        },
        {
          en: "You can reset an option to the value defined in the config file by setting it to `undefined`. Consider the following config that sets a `baseURL`:",
          uk: "Опцію можна повернути до значення з конфігу, встановивши `undefined`. Наприклад, конфіг із `baseURL`:",
        },
        {
          en: "You can now configure `baseURL` for a file, and also opt-out for a single test.",
          uk: "Тепер можна задати `baseURL` для файлу й відмовитися від нього для одного тесту.",
        },
        {
          en: "If you would like to completely reset the value to `undefined`, use a long-form fixture notation.",
          uk: "Щоб повністю скинути значення до `undefined`, використайте довгу форму запису фікстури.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-16",
          language: "js",
          code: "\nexport class TodoPage {\n  private readonly inputBox: Locator;\n  private readonly todoItems: Locator;\n\n  constructor(public readonly page: Page) {\n    this.inputBox = this.page.locator('input.new-todo');\n    this.todoItems = this.page.getByTestId('todo-item');\n  }\n\n  async goto() {\n    await this.page.goto('https://demo.playwright.dev/todomvc/');\n  }\n\n  async addToDo(text: string) {\n    await this.inputBox.fill(text);\n    await this.inputBox.press('Enter');\n  }\n\n  async remove(text: string) {\n    const todo = this.todoItems.filter({ hasText: text });\n    await todo.hover();\n    await todo.getByLabel('Delete').click();\n  }\n\n  async removeAll() {\n    while ((await this.todoItems.count()) > 0) {\n      await this.todoItems.first().hover();\n      await this.todoItems.getByLabel('Delete').first().click();\n    }\n  }\n}",
        },
        {
          id: "cb-17",
          language: "js",
          code: "\n// Declare your options to type-check your configuration.\nexport type MyOptions = {\n  defaultItem: string;\n};\ntype MyFixtures = {\n  todoPage: TodoPage;\n};\n\n// Specify both option and fixture types.\nexport const test = base.extend({\n  // Define an option and provide a default value.\n  // We can later override it in the config.\n  defaultItem: ['Something nice', { option: true }],\n\n  // Our \"todoPage\" fixture depends on the option.\n  todoPage: async ({ page, defaultItem }, use) => {\n    const todoPage = new TodoPage(page);\n    await todoPage.goto();\n    await todoPage.addToDo(defaultItem);\n    await use(todoPage);\n    await todoPage.removeAll();\n  },\n});\nexport { expect } from '@playwright/test';",
        },
        {
          id: "cb-18",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'shopping',\n      use: { defaultItem: 'Buy milk' },\n    },\n    {\n      name: 'wellbeing',\n      use: { defaultItem: 'Exercise!' },\n    },\n  ]\n});",
        },
        {
          id: "cb-19",
          language: "js",
          code: "type Person = { name: string };\nconst test = base.extend({\n  // Declare the option, default value is an empty array.\n  persons: [[], { option: true }],\n});\n\n// Option value is an array of persons.\nconst actualPersons = [{ name: 'Alice' }, { name: 'Bob' }];\ntest.use({\n  // CORRECT: Wrap the value into an array and pass the scope.\n  persons: [actualPersons, { scope: 'test' }],\n});\n\ntest.use({\n  // WRONG: passing an array value directly will not work.\n  persons: actualPersons,\n});",
        },
        {
          id: "cb-20",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    baseURL: 'https://playwright.dev',\n  },\n});",
        },
        {
          id: "cb-21",
          language: "js",
          code: "\n// Configure baseURL for this file.\ntest.use({ baseURL: 'https://playwright.dev/docs/intro' });\n\ntest('check intro contents', async ({ page }) => {\n  // This test will use \"https://playwright.dev/docs/intro\" base url as defined above.\n});\n\ntest.describe(() => {\n  // Reset the value to a config-defined one.\n  test.use({ baseURL: undefined });\n\n  test('can navigate to intro from the home page', async ({ page }) => {\n    // This test will use \"https://playwright.dev\" base url as defined in the config.\n  });\n});",
        },
        {
          id: "cb-22",
          language: "js",
          code: "\n// Completely unset baseURL for this file.\ntest.use({\n  baseURL: [async ({}, use) => use(undefined), { scope: 'test' }],\n});\n\ntest('no base url', async ({ page }) => {\n  // This test will not have a base url.\n});",
        },
      ],
    },
    {
      id: "execution-order",
      title: {
        en: "Execution order",
        uk: "Порядок виконання",
      },
      paragraphs: [
        {
          en: "Each fixture has a setup and teardown phase before and after the `await use()` call in the fixture. Setup is executed before the test/hook requiring it is run, and teardown is executed when the fixture is no longer being used by the test/hook.",
          uk: "У кожної фікстури є фази setup і teardown до й після `await use()` у її коді. Setup виконується перед тестом/хуком, який її потребує; teardown — коли тест/хук більше не використовує фікстуру.",
        },
        {
          en: "Fixtures follow these rules to determine the execution order:\n* When fixture A depends on fixture B: B is always set up before A and torn down after A.\n* Non-automatic fixtures are executed lazily, only when the test/hook needs them.\n* Test-scoped fixtures are torn down after each test, while worker-scoped fixtures are only torn down when the worker process executing tests is torn down.",
          uk: "Фікстури дотримуються таких правил порядку:\n* Якщо фікстура A залежить від B: B завжди підготовлюється перед A і знімається після A.\n* Неавтоматичні фікстури виконуються ліниво — лише коли їх потребує тест/хук.\n* Тестові фікстури знімаються після кожного тесту; worker-фікстури — лише коли завершується воркер, що виконує тести.",
        },
        {
          en: "Consider the following example:",
          uk: "Розгляньте такий приклад:",
        },
        {
          en: "Normally, if all tests pass and no errors are thrown, the order of execution is as following.\n* worker setup and `beforeAll` section:\n  * `browser` setup because it is required by `autoWorkerFixture`.\n  * `autoWorkerFixture` setup because automatic worker fixtures are always set up before anything else.\n  * `beforeAll` runs.\n* `first test` section:\n  * `autoTestFixture` setup because automatic test fixtures are always set up before test and `beforeEach` hooks.\n  * `page` setup because it is required in `beforeEach` hook.\n  * `beforeEach` runs.\n  * `first test` runs.\n  * `afterEach` runs.\n  * `page` teardown because it is a test-scoped fixture and should be torn down after the test finishes.\n  * `autoTestFixture` teardown because it is a test-scoped fixture and should be torn down after the test finishes.\n* `second test` section:\n  * `autoTestFixture` setup because automatic test fixtures are always set up before test and `beforeEach` hooks.\n  * `page` setup because it is required in `beforeEach` hook.\n  * `beforeEach` runs.\n  * `workerFixture` setup because it is required by `testFixture` that is required by the `second test`.\n  * `testFixture` setup because it is required by the `second test`.\n  * `second test` runs.\n  * `afterEach` runs.\n  * `testFixture` teardown because it is a test-scoped fixture and should be torn down after the test finishes.\n  * `page` teardown because it is a test-scoped fixture and should be torn down after the test finishes.\n  * `autoTestFixture` teardown because it is a test-scoped fixture and should be torn down after the test finishes.\n* `afterAll` and worker teardown section:\n  * `afterAll` runs.\n  * `workerFixture` teardown because it is a workers-scoped fixture and should be torn down once at the end.\n  * `autoWorkerFixture` teardown because it is a workers-scoped fixture and should be torn down once at the end.\n  * `browser` teardown because it is a workers-scoped fixture and should be torn down once at the end.",
          uk: "Зазвичай, якщо всі тести проходять без помилок, порядок такий.\n* Підготовка воркера та секція `beforeAll`:\n  * setup `browser`, бо його потребує `autoWorkerFixture`.\n  * setup `autoWorkerFixture`, бо автоматичні worker-фікстури завжди першими.\n  * виконується `beforeAll`.\n* Секція `first test`:\n  * setup `autoTestFixture`, бо автоматичні тестові фікстури перед тестом і `beforeEach`.\n  * setup `page`, бо він потрібен у `beforeEach`.\n  * виконується `beforeEach`.\n  * виконується `first test`.\n  * виконується `afterEach`.\n  * teardown `page` (тестова фікстура після тесту).\n  * teardown `autoTestFixture` (тестова фікстура після тесту).\n* Секція `second test`:\n  * setup `autoTestFixture`.\n  * setup `page` для `beforeEach`.\n  * `beforeEach`.\n  * setup `workerFixture`, бо він потрібен `testFixture`, яку потребує `second test`.\n  * setup `testFixture` для `second test`.\n  * `second test`.\n  * `afterEach`.\n  * teardown `testFixture`.\n  * teardown `page`.\n  * teardown `autoTestFixture`.\n* Секція `afterAll` і завершення воркера:\n  * `afterAll`.\n  * teardown `workerFixture` (worker-scoped — один раз наприкінці).\n  * teardown `autoWorkerFixture`.\n  * teardown `browser`.",
        },
        {
          en: "A few observations:\n* `page` and `autoTestFixture` are set up and torn down for each test, as test-scoped fixtures.\n* `unusedFixture` is never set up because it is not used by any tests/hooks.\n* `testFixture` depends on `workerFixture` and triggers its setup.\n* `workerFixture` is lazily set up before the second test, but torn down once during worker shutdown, as a worker-scoped fixture.\n* `autoWorkerFixture` is set up for `beforeAll` hook, but `autoTestFixture` is not.",
          uk: "Кілька спостережень:\n* `page` і `autoTestFixture` — тестові: setup і teardown на кожен тест.\n* `unusedFixture` не запускається, бо ніхто її не використовує.\n* `testFixture` залежить від `workerFixture` і ініціює його setup.\n* `workerFixture` ліниво підготовлюється перед другим тестом і знімається один раз при завершенні воркера.\n* `autoWorkerFixture` готується для `beforeAll`, а `autoTestFixture` — ні.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-23",
          language: "js",
          code: "\nconst test = base.extend<{\n  testFixture: string,\n  autoTestFixture: string,\n  unusedFixture: string,\n}, {\n  workerFixture: string,\n  autoWorkerFixture: string,\n}>({\n  workerFixture: [async ({ browser }) => {\n    // workerFixture setup...\n    await use('workerFixture');\n    // workerFixture teardown...\n  }, { scope: 'worker' }],\n\n  autoWorkerFixture: [async ({ browser }) => {\n    // autoWorkerFixture setup...\n    await use('autoWorkerFixture');\n    // autoWorkerFixture teardown...\n  }, { scope: 'worker', auto: true }],\n\n  testFixture: [async ({ page, workerFixture }) => {\n    // testFixture setup...\n    await use('testFixture');\n    // testFixture teardown...\n  }, { scope: 'test' }],\n\n  autoTestFixture: [async () => {\n    // autoTestFixture setup...\n    await use('autoTestFixture');\n    // autoTestFixture teardown...\n  }, { scope: 'test', auto: true }],\n\n  unusedFixture: [async ({ page }) => {\n    // unusedFixture setup...\n    await use('unusedFixture');\n    // unusedFixture teardown...\n  }, { scope: 'test' }],\n});\n\ntest.beforeAll(async () => { /* ... */ });\ntest.beforeEach(async ({ page }) => { /* ... */ });\ntest('first test', async ({ page }) => { /* ... */ });\ntest('second test', async ({ testFixture }) => { /* ... */ });\ntest.afterEach(async () => { /* ... */ });\ntest.afterAll(async () => { /* ... */ });",
        },
      ],
    },
    {
      id: "combine-custom-fixtures-from-multiple-modules",
      title: {
        en: "Combine custom fixtures from multiple modules",
        uk: "Об’єднання власних фікстур із кількох модулів",
      },
      paragraphs: [
        {
          en: "You can merge test fixtures from multiple files or modules:",
          uk: "Можна об’єднати тестові фікстури з кількох файлів або модулів:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-24",
          language: "js",
          code: "\nexport const test = mergeTests(dbTest, a11yTest);",
        },
        {
          id: "cb-25",
          language: "js",
          code: "\ntest('passes', async ({ database, page, a11y }) => {\n  // use database and a11y fixtures.\n});",
        },
      ],
    },
    {
      id: "box-fixtures",
      title: {
        en: "Box fixtures",
        uk: "Box-фікстури",
      },
      paragraphs: [
        {
          en: 'Usually, custom fixtures are reported as separate steps in the UI mode, Trace Viewer and various test reports. They also appear in error messages from the test runner. For frequently used fixtures, this can mean lots of noise. You can stop the fixtures steps from being shown in the UI by "boxing" it.',
          uk: "Зазвичай власні фікстури показуються окремими кроками в UI mode, Trace Viewer і звітах. Вони також з’являються в повідомленнях про помилки. Для частих фікстур це шум. Можна приховати кроки фікстури в UI через «boxing».",
        },
        {
          en: "This is useful for non-interesting helper fixtures. For example, an [automatic](./test-fixtures.md#automatic-fixtures) fixture that sets up some common data can be safely hidden from a test report.",
          uk: "Корисно для допоміжних фікстур «без сюжету». Наприклад, [автоматичну](./test-fixtures.md#automatic-fixtures) фікстуру зі спільними даними можна приховати зі звіту.",
        },
        {
          en: "You can also mark the fixture as `box: 'self'` to only hide that particular fixture, but include all the steps inside the fixture in the test report.",
          uk: "Можна позначити фікстуру як `box: 'self'`, щоб приховати лише її оболонку, але залишити в звіті всі кроки всередині фікстури.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-26",
          language: "js",
          code: "\nexport const test = base.extend({\n  helperFixture: [async ({}, use, testInfo) => {\n    // ...\n  }, { box: true }],\n});",
        },
      ],
    },
    {
      id: "custom-fixture-title",
      title: {
        en: "Custom fixture title",
        uk: "Власний заголовок фікстури",
      },
      paragraphs: [
        {
          en: "Instead of the usual fixture name, you can give fixtures a custom title that will be shown in test reports and error messages.",
          uk: "Замість звичайної назви фікстури можна задати власний заголовок для звітів і повідомлень про помилки.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-27",
          language: "js",
          code: "\nexport const test = base.extend({\n  innerFixture: [async ({}, use, testInfo) => {\n    // ...\n  }, { title: 'my fixture' }],\n});",
        },
      ],
    },
    {
      id: "adding-global-beforeeach-aftereach-hooks",
      title: {
        en: "Adding global beforeEach/afterEach hooks",
        uk: "Глобальні хуки beforeEach/afterEach",
      },
      paragraphs: [
        {
          en: "[`method: Test.beforeEach`] and [`method: Test.afterEach`] hooks run before/after each test declared in the same file and same [`method: Test.describe`] block (if any). If you want to declare hooks that run before/after each test globally, you can declare them as auto fixtures like this:",
          uk: "[`method: Test.beforeEach`] і [`method: Test.afterEach`] виконуються перед/після кожного тесту в тому самому файлі та блоці [`method: Test.describe`] (якщо є). Щоб хуки спрацьовували глобально перед/після кожного тесту, оголосіть їх як auto-фікстури:",
        },
        {
          en: "And then import the fixtures in all your tests:",
          uk: "Потім імпортуйте фікстури в усіх тестах:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-28",
          language: "js",
          code: "\nexport const test = base.extend({\n  forEachTest: [async ({ page }, use) => {\n    // This code runs before every test.\n    await page.goto('http://localhost:8000');\n    await use();\n    // This code runs after every test.\n    console.log('Last URL:', page.url());\n  }, { auto: true }],  // automatically starts for every test.\n});",
        },
        {
          id: "cb-29",
          language: "js",
          code: "\ntest('basic', async ({ page }) => {\n  expect(page).toHaveURL('http://localhost:8000');\n  await page.goto('https://playwright.dev');\n});",
        },
      ],
    },
    {
      id: "adding-global-beforeall-afterall-hooks",
      title: {
        en: "Adding global beforeAll/afterAll hooks",
        uk: "Глобальні хуки beforeAll/afterAll",
      },
      paragraphs: [
        {
          en: "[`method: Test.beforeAll`] and [`method: Test.afterAll`] hooks run before/after all tests declared in the same file and same [`method: Test.describe`] block (if any), once per worker process. If you want to declare hooks\nthat run before/after all tests in every file, you can declare them as auto fixtures with `scope: 'worker'` as follows:",
          uk: "[`method: Test.beforeAll`] і [`method: Test.afterAll`] виконуються перед/після всіх тестів у тому самому файлі та блоці [`method: Test.describe`] (якщо є), один раз на воркер. Щоб хуки спрацьовували перед/після всіх тестів у кожному файлі, оголосіть auto-фікстури з `scope: 'worker'`:",
        },
        {
          en: "And then import the fixtures in all your tests:",
          uk: "Потім імпортуйте фікстури в усіх тестах:",
        },
        {
          en: "Note that the fixtures will still run once per [worker process](./test-parallel.md#worker-processes), but you don't need to redeclare them in every file.",
          uk: "Фікстури все одно виконуються один раз на [воркер-процес](./test-parallel.md#worker-processes), але не потрібно повторно оголошувати їх у кожному файлі.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-30",
          language: "js",
          code: "\nexport const test = base.extend({\n  forEachWorker: [async ({}, use) => {\n    // This code runs before all the tests in the worker process.\n    console.log(`Starting test worker ${test.info().workerIndex}`);\n    await use();\n    // This code runs after all the tests in the worker process.\n    console.log(`Stopping test worker ${test.info().workerIndex}`);\n  }, { scope: 'worker', auto: true }],  // automatically starts for every worker.\n});",
        },
        {
          id: "cb-31",
          language: "js",
          code: "\ntest('basic', async ({ }) => {\n  // ...\n});",
        },
      ],
    },
  ],
  quiz: [],
}
