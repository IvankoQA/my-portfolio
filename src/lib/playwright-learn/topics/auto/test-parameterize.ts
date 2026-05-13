import type { PlaywrightTopic } from "../../types"

export const testParameterizeTopic: PlaywrightTopic = {
  slug: "test-parameterize",
  groupId: "test-runner",
  order: 350,
  level: "intermediate",
  trackOrder: 12,
  sourceDoc: "test-parameterize-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-parameterize",
  title: {
    en: "Parameterize tests",
    uk: "Параметризація тестів",
  },
  summary: {
    en: "You can either parameterize tests on a test level or on a project level.",
    uk: "Тести можна параметризувати на рівні тесту або на рівні проєкту.",
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
          en: "You can either parameterize tests on a test level or on a project level.",
          uk: "Тести можна параметризувати на рівні тесту або на рівні проєкту.",
        },
      ],
    },
    {
      id: "parameterized-tests",
      title: {
        en: "Parameterized Tests",
        uk: "Параметризовані тести",
      },
      paragraphs: [
        {
          en: "### Before and after hooks",
          uk: "### Хуки до та після",
        },
        {
          en: "Most of the time you should put `beforeEach`, `beforeAll`, `afterEach` and `afterAll` hooks outside of `forEach`, so that hooks are executed just once:",
          uk: "Зазвичай хуки `beforeEach`, `beforeAll`, `afterEach` та `afterAll` слід розміщувати поза `forEach`, щоб вони виконувалися лише один раз:",
        },
        {
          en: "If you want to have hooks for each test, you can put them inside a `describe()` - so they are executed for each iteration / each individual test:",
          uk: "Якщо потрібні хуки для кожного тесту, їх можна розмістити всередині `describe()` — тоді вони виконуються для кожної ітерації / кожного окремого тесту:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "[\n  { name: 'Alice', expected: 'Hello, Alice!' },\n  { name: 'Bob', expected: 'Hello, Bob!' },\n  { name: 'Charlie', expected: 'Hello, Charlie!' },\n].forEach(({ name, expected }) => {\n  // You can also do it with test.describe() or with multiple tests as long the test name is unique.\n  test(`testing with ${name}`, async ({ page }) => {\n    await page.goto(`https://example.com/greet?name=${name}`);\n    await expect(page.getByRole('heading')).toHaveText(expected);\n  });\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "test.beforeEach(async ({ page }) => {\n  // ...\n});\n\ntest.afterEach(async ({ page }) => {\n  // ...\n});\n\n[\n  { name: 'Alice', expected: 'Hello, Alice!' },\n  { name: 'Bob', expected: 'Hello, Bob!' },\n  { name: 'Charlie', expected: 'Hello, Charlie!' },\n].forEach(({ name, expected }) => {\n  test(`testing with ${name}`, async ({ page }) => {\n    await page.goto(`https://example.com/greet?name=${name}`);\n    await expect(page.getByRole('heading')).toHaveText(expected);\n  });\n});",
        },
        {
          id: "cb-3",
          language: "js",
          code: "[\n  { name: 'Alice', expected: 'Hello, Alice!' },\n  { name: 'Bob', expected: 'Hello, Bob!' },\n  { name: 'Charlie', expected: 'Hello, Charlie!' },\n].forEach(({ name, expected }) => {\n  test.describe(() => {\n    test.beforeEach(async ({ page }) => {\n      await page.goto(`https://example.com/greet?name=${name}`);\n    });\n    test(`testing with ${expected}`, async ({ page }) => {\n      await expect(page.getByRole('heading')).toHaveText(expected);\n    });\n  });\n});",
        },
      ],
    },
    {
      id: "parameterized-projects",
      title: {
        en: "Parameterized Projects",
        uk: "Параметризовані проєкти",
      },
      paragraphs: [
        {
          en: "Playwright Test supports running multiple test projects at the same time. In the following example, we'll run two projects with different options.",
          uk: "Playwright Test підтримує одночасний запуск кількох тестових проєктів. У наведеному прикладі запускаються два проєкти з різними опціями.",
        },
        {
          en: "We declare the option `person` and set the value in the config. The first project runs with the value `Alice` and the second with the value `Bob`.",
          uk: "Оголошуємо опцію `person` і задаємо її значення в конфігурації. Перший проєкт виконується зі значенням `Alice`, другий — зі значенням `Bob`.",
        },
        {
          en: "We can use this option in the test, similarly to [fixtures](./test-fixtures.md).",
          uk: "Цю опцію можна використовувати в тесті так само, як [фікстури](./test-fixtures.md).",
        },
        {
          en: "Now, we can run tests in multiple configurations by using projects.",
          uk: "Тепер можна запускати тести в кількох конфігураціях за допомогою проєктів.",
        },
        {
          en: "We can also use the option in a fixture. Learn more about [fixtures](./test-fixtures.md).",
          uk: "Опцію також можна використати у фікстурі. Докладніше про [фікстури](./test-fixtures.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: "const base = require('@playwright/test');\n\nexports.test = base.test.extend({\n  // Define an option and provide a default value.\n  // We can later override it in the config.\n  person: ['John', { option: true }],\n});",
        },
        {
          id: "cb-5",
          language: "js",
          code: "\nexport type TestOptions = {\n  person: string;\n};\n\nexport const test = base.extend({\n  // Define an option and provide a default value.\n  // We can later override it in the config.\n  person: ['John', { option: true }],\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "\ntest('test 1', async ({ page, person }) => {\n  await page.goto(`/index.html`);\n  await expect(page.locator('#node')).toContainText(person);\n  // ...\n});",
        },
        {
          id: "cb-7",
          language: "js",
          code: "// @ts-check\n\nmodule.exports = defineConfig({\n  projects: [\n    {\n      name: 'alice',\n      use: { person: 'Alice' },\n    },\n    {\n      name: 'bob',\n      use: { person: 'Bob' },\n    },\n  ]\n});",
        },
        {
          id: "cb-8",
          language: "js",
          code: "\nexport default defineConfig({\n  projects: [\n    {\n      name: 'alice',\n      use: { person: 'Alice' },\n    },\n    {\n      name: 'bob',\n      use: { person: 'Bob' },\n    },\n  ]\n});",
        },
        {
          id: "cb-9",
          language: "js",
          code: "const base = require('@playwright/test');\n\nexports.test = base.test.extend({\n  // Define an option and provide a default value.\n  // We can later override it in the config.\n  person: ['John', { option: true }],\n\n  // Override default \"page\" fixture.\n  page: async ({ page, person }, use) => {\n    await page.goto('/chat');\n    // We use \"person\" parameter as a \"name\" for the chat room.\n    await page.getByLabel('User Name').fill(person);\n    await page.getByText('Enter chat room').click();\n    // Each test will get a \"page\" that already has the person name.\n    await use(page);\n  },\n});",
        },
        {
          id: "cb-10",
          language: "js",
          code: "\nexport type TestOptions = {\n  person: string;\n};\n\nexport const test = base.extend({\n  // Define an option and provide a default value.\n  // We can later override it in the config.\n  person: ['John', { option: true }],\n\n  // Override default \"page\" fixture.\n  page: async ({ page, person }, use) => {\n    await page.goto('/chat');\n    // We use \"person\" parameter as a \"name\" for the chat room.\n    await page.getByLabel('User Name').fill(person);\n    await page.getByText('Enter chat room').click();\n    // Each test will get a \"page\" that already has the person name.\n    await use(page);\n  },\n});",
        },
      ],
    },
    {
      id: "passing-environment-variables",
      title: {
        en: "Passing Environment Variables",
        uk: "Передача змінних середовища",
      },
      paragraphs: [
        {
          en: "You can use environment variables to configure tests from the command line.",
          uk: "Можна використовувати змінні середовища для налаштування тестів з командного рядка.",
        },
        {
          en: "For example, consider the following test file that needs a username and a password. It is usually a good idea not to store your secrets in the source code, so we'll need a way to pass secrets from outside.",
          uk: "Наприклад, розгляньте тестовий файл, якому потрібні ім’я користувача та пароль. Зазвичай секрети не варто зберігати в коді, тому їх слід передавати ззовні.",
        },
        {
          en: "You can run this test with your secret username and password set in the command line.",
          uk: "Цей тест можна запустити, задавши секретне ім’я користувача та пароль у командному рядку.",
        },
        {
          en: "Similarly, configuration file can also read environment variables passed through the command line.",
          uk: "Аналогічно файл конфігурації може читати змінні середовища, передані через командний рядок.",
        },
        {
          en: "Now, you can run tests against a staging or a production environment:",
          uk: "Тепер можна запускати тести проти середовища staging або production:",
        },
        {
          en: "### .env files",
          uk: "### Файли .env",
        },
        {
          en: "To make environment variables easier to manage, consider something like `.env` files. Here is an example that uses [`dotenv`](https://www.npmjs.com/package/dotenv) package to read environment variables directly in the configuration file.",
          uk: "Щоб простіше керувати змінними середовища, варто розглянути файли на кшталт `.env`. Ось приклад з пакетом [`dotenv`](https://www.npmjs.com/package/dotenv) для читання змінних безпосередньо у файлі конфігурації.",
        },
        {
          en: "Now, you can just edit `.env` file to set any variables you'd like.",
          uk: "Тепер достатньо відредагувати файл `.env`, щоб задати потрібні змінні.",
        },
        {
          en: "Run tests as usual, your environment variables should be picked up.",
          uk: "Запускайте тести як зазвичай — змінні середовища мають підхопитися.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "test(`example test`, async ({ page }) => {\n  // ...\n  await page.getByLabel('User Name').fill(process.env.USER_NAME);\n  await page.getByLabel('Password').fill(process.env.PASSWORD);\n});",
        },
        {
          id: "cb-12",
          language: "bash",
          code: "USER_NAME=me PASSWORD=secret npx playwright test",
        },
        {
          id: "cb-13",
          language: "batch",
          code: "set USER_NAME=me\nset PASSWORD=secret\nnpx playwright test",
        },
        {
          id: "cb-14",
          language: "powershell",
          code: "$env:USER_NAME=me\n$env:PASSWORD=secret\nnpx playwright test",
        },
        {
          id: "cb-15",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    baseURL: process.env.STAGING === '1' ? 'http://staging.example.test/' : 'http://example.test/',\n  }\n});",
        },
        {
          id: "cb-16",
          language: "bash",
          code: "STAGING=1 npx playwright test",
        },
        {
          id: "cb-17",
          language: "batch",
          code: "set STAGING=1\nnpx playwright test",
        },
        {
          id: "cb-18",
          language: "powershell",
          code: "$env:STAGING=1\nnpx playwright test",
        },
        {
          id: "cb-19",
          language: "js",
          code: "\n// Read from \".env\" file.\ndotenv.config({ path: path.resolve(__dirname, '.env') });\n\n// Alternatively, read from \"../my.env\" file.\ndotenv.config({ path: path.resolve(__dirname, '..', 'my.env') });\n\nexport default defineConfig({\n  use: {\n    baseURL: process.env.STAGING === '1' ? 'http://staging.example.test/' : 'http://example.test/',\n  }\n});",
        },
        {
          id: "cb-20",
          language: "bash",
          code: "# .env file\nSTAGING=0\nUSER_NAME=me\nPASSWORD=secret",
        },
        {
          id: "cb-21",
          language: "bash",
          code: "npx playwright test",
        },
      ],
    },
    {
      id: "create-tests-via-a-csv-file",
      title: {
        en: "Create tests via a CSV file",
        uk: "Створення тестів через CSV-файл",
      },
      paragraphs: [
        {
          en: "The Playwright test-runner runs in Node.js, this means you can directly read files from the file system and parse them with your preferred CSV library.",
          uk: "Тестовий раннер Playwright працює в Node.js, тож можна безпосередньо читати файли з диска й розбирати їх обраною CSV-бібліотекою.",
        },
        {
          en: "See for example this CSV file, in our example `input.csv`:",
          uk: "Наприклад, ось CSV-файл у нашому прикладі `input.csv`:",
        },
        {
          en: "Based on this we'll generate some tests by using the [csv-parse](https://www.npmjs.com/package/csv-parse) library from NPM:",
          uk: "На його основі згенеруємо тести за допомогою бібліотеки [csv-parse](https://www.npmjs.com/package/csv-parse) з NPM:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-22",
          language: "txt",
          code: '"test_case","some_value","some_other_value"\n"value 1","value 11","foobar1"\n"value 2","value 22","foobar21"\n"value 3","value 33","foobar321"\n"value 4","value 44","foobar4321"',
        },
        {
          id: "cb-23",
          language: "js",
          code: "\nconst records = parse(fs.readFileSync(path.join(__dirname, 'input.csv')), {\n  columns: true,\n  skip_empty_lines: true\n});\n\nfor (const record of records) {\n  test(`foo: ${record.test_case}`, async ({ page }) => {\n    console.log(record.test_case, record.some_value, record.some_other_value);\n  });\n}",
        },
      ],
    },
  ],
  quiz: [],
}
