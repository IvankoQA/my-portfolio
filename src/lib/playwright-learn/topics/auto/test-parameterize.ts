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
    en: "Instead of copying the same test 5 times for different inputs, run it against a data array. Two levels: test-level (forEach over cases) and project-level (different use options per project run). The forEach approach is 80% of what you need.",
    uk: "Замість того щоб копіювати один і той самий тест 5 разів для різних вхідних даних — запусти його проти масиву даних. Два рівні: рівень тесту (forEach по кейсах) і рівень project (різні use-опції на кожен запуск). Підхід з forEach — це 80% того що тобі потрібно.",
  },
  sections: [
    {
      id: "test-level-forEach",
      title: {
        en: "Test-level: forEach over a data array",
        uk: "Рівень тесту: forEach по масиву даних",
      },
      paragraphs: [
        {
          en: "The simplest pattern: loop over an array of inputs before `test()`. Playwright generates a separate test for each item. The test name includes the parameter so you can see exactly which case failed.",
          uk: "Найпростіший патерн: перебрати масив вхідних даних перед `test()`. Playwright генерує окремий тест для кожного елементу. Назва тесту включає параметр — одразу видно який кейс впав.",
        },
        {
          en: "I use this when testing order status transitions — the same flow (create → update → check), different status values.",
          uk: "Я використовую це при тестуванні переходів статусу замовлення — той самий flow (створити → оновити → перевірити), різні значення статусів.",
        },
      ],
      codeBlocks: [
        {
          id: "foreach-basic",
          language: "ts",
          code: `// Тест статус-badge для кожного статусу замовлення
const orderStatuses = [
  { status: 'pending',   badge: 'Pending',    color: 'yellow' },
  { status: 'shipped',   badge: 'Shipped',    color: 'blue'   },
  { status: 'delivered', badge: 'Delivered',  color: 'green'  },
  { status: 'cancelled', badge: 'Cancelled',  color: 'red'    },
]

for (const { status, badge, color } of orderStatuses) {
  test(\`order with status "\${status}" shows correct badge\`, async ({ page }) => {
    // Мокуємо конкретний статус
    await page.route('*/**/api/orders/42', async route => {
      await route.fulfill({ json: { id: 'ORD-042', status } })
    })

    await page.goto('/orders/42')

    // Назва тесту включає status — зразу видно який впав
    await expect(page.getByTestId('status-badge')).toHaveText(badge)
    await expect(page.getByTestId('status-badge')).toHaveCSS('background-color', color)
  })
}`,
        },
      ],
    },
    {
      id: "hooks-with-parameterized",
      title: {
        en: "Hooks with parameterized tests",
        uk: "Хуки з параметризованими тестами",
      },
      paragraphs: [
        {
          en: "If you add `beforeEach` outside the loop, it runs once before the whole group. If you want hooks per iteration, put them inside `test.describe()` inside the loop.",
          uk: "Якщо додати `beforeEach` поза циклом — він запускається один раз перед всією групою. Якщо потрібні хуки для кожної ітерації — поміщай їх всередину `test.describe()` всередині циклу.",
        },
      ],
      codeBlocks: [
        {
          id: "hooks-placement",
          language: "ts",
          code: `// beforeEach ПОЗА forEach — виконується один раз для всіх тестів
test.beforeEach(async ({ page }) => {
  await page.goto('/orders')
})

for (const status of ['pending', 'shipped', 'delivered']) {
  test(\`filter by \${status}\`, async ({ page }) => {
    await page.getByRole('combobox', { name: 'Status' }).selectOption(status)
    // Перевіряємо що відображаються тільки потрібні замовлення
    await expect(page.getByTestId('order-row')).not.toHaveCount(0)
  })
}

// --

// beforeEach ВСЕРЕДИНІ describe — виконується для кожної ітерації
for (const status of ['pending', 'shipped']) {
  test.describe(\`\${status} orders\`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(\`/orders?status=\${status}\`)
    })

    test('list loads', async ({ page }) => {
      await expect(page.getByTestId('order-row').first()).toBeVisible()
    })

    test('export button is visible', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Export' })).toBeVisible()
    })
  })
}`,
        },
      ],
    },
    {
      id: "env-variables",
      title: {
        en: "Environment variables — credentials and environment switching",
        uk: "Змінні середовища — облікові дані і перемикання середовища",
      },
      paragraphs: [
        {
          en: "Never hardcode credentials in tests. Read them from environment variables. For local dev, use a `.env` file with `dotenv`. For CI, set them as repository secrets.",
          uk: "Ніколи не хардкоди облікові дані в тестах. Читай їх зі змінних середовища. Для локальної розробки — `.env` файл з `dotenv`. Для CI — виставляй їх як секрети репозиторію.",
        },
      ],
      codeBlocks: [
        {
          id: "env-vars",
          language: "ts",
          code: `// tests/auth.spec.ts — читаємо зі змінних середовища
test('admin login', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill(process.env.ADMIN_EMAIL!)
  await page.getByLabel('Password').fill(process.env.ADMIN_PASSWORD!)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/dashboard')
})`,
        },
        {
          id: "dotenv-config",
          language: "ts",
          code: `// playwright.config.ts — підключаємо .env перед конфігом
import * as dotenv from 'dotenv'
import { defineConfig } from '@playwright/test'

dotenv.config({ path: '.env.test' })

export default defineConfig({
  use: {
    // Перемикання між staging і production одним env var
    baseURL: process.env.STAGING === '1'
      ? 'https://staging.myapp.com'
      : 'http://localhost:3000',
  },
})

// .env.test
// ADMIN_EMAIL=admin@example.com
// ADMIN_PASSWORD=test-password-123
// STAGING=0`,
        },
        {
          id: "env-cli",
          language: "bash",
          code: `# Локально — читає з .env.test
npx playwright test

# CI — змінні задані як secrets, STAGING=1 перемикає URL
STAGING=1 npx playwright test

# Або через cross-env для кросс-платформеності
cross-env STAGING=1 npx playwright test`,
        },
      ],
    },
    {
      id: "project-level-params",
      title: {
        en: "Project-level: different options per run",
        uk: "Рівень project: різні опції на кожен запуск",
      },
      paragraphs: [
        {
          en: "For advanced cases — testing the same feature as different user roles — you can declare a custom fixture option and override it per project. Each project runs the full suite with its own `use` value.",
          uk: "Для просунутих кейсів — тестування однієї фічі під різними ролями — можна оголосити власну fixture-опцію і перевизначити її per project. Кожен project запускає весь набір зі своїм значенням `use`.",
        },
      ],
      codeBlocks: [
        {
          id: "project-options",
          language: "ts",
          code: `// fixtures/index.ts — оголошуємо опцію
import { test as base } from '@playwright/test'

export type TestOptions = {
  userRole: 'admin' | 'manager' | 'viewer'
}

export const test = base.extend<TestOptions>({
  // Дефолтне значення + option: true = може бути перевизначена з config
  userRole: ['viewer', { option: true }],
})`,
        },
        {
          id: "project-config",
          language: "ts",
          code: `// playwright.config.ts — три проекти, три ролі
export default defineConfig({
  projects: [
    {
      name: 'admin',
      use: {
        ...devices['Desktop Chrome'],
        userRole: 'admin',
        storageState: 'playwright/.auth/admin.json',
      },
    },
    {
      name: 'manager',
      use: {
        ...devices['Desktop Chrome'],
        userRole: 'manager',
        storageState: 'playwright/.auth/manager.json',
      },
    },
    {
      name: 'viewer',
      use: {
        ...devices['Desktop Chrome'],
        userRole: 'viewer',
        storageState: 'playwright/.auth/viewer.json',
      },
    },
  ],
})`,
        },
        {
          id: "project-test",
          language: "ts",
          code: `// tests/permissions.spec.ts — використовує userRole з проекту
import { test, expect } from '../fixtures'

test('delete button visibility by role', async ({ page, userRole }) => {
  await page.goto('/orders/42')

  const deleteButton = page.getByRole('button', { name: 'Delete order' })

  if (userRole === 'admin') {
    await expect(deleteButton).toBeVisible()
  } else {
    await expect(deleteButton).not.toBeVisible()
  }
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want to test the same form validation with 5 invalid inputs. What's the cleanest approach?",
        uk: "Хочеш протестувати одну й ту саму валідацію форми з 5 невалідними значеннями. Який найчистіший підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Write 5 separate test() functions with different input values",
            uk: "Написати 5 окремих функцій test() з різними значеннями",
          },
        },
        {
          id: "b",
          label: {
            en: "Loop over an array of inputs with for...of and generate a test() for each",
            uk: "Перебрати масив значень через for...of і генерувати test() для кожного",
          },
        },
        {
          id: "c",
          label: {
            en: "Put all 5 checks inside a single test with multiple expect() calls",
            uk: "Помістити всі 5 перевірок всередину одного тесту з кількома expect()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A `for...of` loop over a data array generates separate named tests — each case is isolated, has its own result in the report, and can be run individually. Writing 5 separate test functions is duplication. Putting all in one test means a single failure stops checking the remaining cases.",
        uk: "Цикл `for...of` по масиву даних генерує окремі іменовані тести — кожен кейс ізольований, має свій результат у репорті і може бути запущений окремо. Писати 5 окремих тестів — це дублювання. Все в один тест означає що перше падіння зупиняє перевірку решти кейсів.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "How does Playwright name each generated test when you use a for...of loop to create parameterized tests?",
        uk: "Як Playwright іменує кожен згенерований тест коли ти використовуєш цикл for...of для створення параметризованих тестів?",
      },
      options: [
        { id: "a", label: { en: "All generated tests share the same name — only the index differs in the report", uk: "Всі згенеровані тести мають однакову назву — у звіті відрізняється лише індекс" } },
        { id: "b", label: { en: "Each test title is whatever string you pass to the test() call, which typically includes the parameter value via a template literal", uk: "Назва кожного тесту — це рядок переданий у виклик test(), який зазвичай включає значення параметра через template literal" } },
        { id: "c", label: { en: "Playwright appends [1], [2], [3] to the base test name automatically", uk: "Playwright автоматично додає [1], [2], [3] до базової назви тесту" } },
        { id: "d", label: { en: "The test names are read from the data array keys", uk: "Назви тестів зчитуються з ключів масиву даних" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "In the for...of pattern you control the test title yourself. The convention is to embed the parameter in a template literal: `test(\\`order with status \"\\${status}\" shows correct badge\\`, ...)`. The title appears exactly as-written in the HTML report and in the terminal, so a failing test clearly shows which parameter value caused the failure.",
        uk: "У патерні for...of ти сам контролюєш назву тесту. Угода — вбудовувати параметр у template literal: `` test(`order with status \"${status}\" shows correct badge`, ...) ``. Назва відображається точно як написана в HTML-звіті та терміналі, тому тест що падає чітко показує яке значення параметра спричинило падіння.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "You place a beforeEach hook outside the for...of loop that generates parameterized tests. How many times does beforeEach run per test run?",
        uk: "Ти розміщуєш хук beforeEach поза циклом for...of що генерує параметризовані тести. Скільки разів виконується beforeEach за один запуск?",
      },
      options: [
        { id: "a", label: { en: "Once before the entire loop starts", uk: "Один раз перед початком всього циклу" } },
        { id: "b", label: { en: "Once before each generated test — same as with manually written tests", uk: "Один раз перед кожним згенерованим тестом — так само як з вручну написаними тестами" } },
        { id: "c", label: { en: "Once per iteration of the loop, not per test", uk: "Один раз на ітерацію циклу а не на тест" } },
        { id: "d", label: { en: "Never — beforeEach is ignored when tests are generated in a loop", uk: "Ніколи — beforeEach ігнорується коли тести генеруються в циклі" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A `beforeEach` placed outside the loop applies to all tests in the same file scope — whether they're written manually or generated in a loop. It runs once before each individual generated test. The loop is JavaScript that runs at module load time to register tests; by the time Playwright executes them, they're indistinguishable from hand-written tests.",
        uk: "`beforeEach` розміщений поза циклом застосовується до всіх тестів у тій самій файловій області — незалежно чи написані вручну чи згенеровані в циклі. Він виконується один раз перед кожним окремим згенерованим тестом. Цикл — це JavaScript що виконується під час завантаження модуля для реєстрації тестів; до моменту їх виконання Playwright вони невідрізнювані від рукописних тестів.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How can you run parameterized tests for the same data set in parallel within one test file?",
        uk: "Як можна запустити параметризовані тести для одного й того самого набору даних паралельно в межах одного тест-файлу?",
      },
      options: [
        { id: "a", label: { en: "Add parallel: true to each test() options object", uk: "Додати parallel: true до об'єкту опцій кожного test()" } },
        { id: "b", label: { en: "Add test.describe.configure({ mode: 'parallel' }) at the top of the file or inside the describe block containing the loop", uk: "Додати test.describe.configure({ mode: 'parallel' }) на початку файлу або всередині describe-блоку що містить цикл" } },
        { id: "c", label: { en: "Use test.concurrent() instead of test() for each generated test", uk: "Використовувати test.concurrent() замість test() для кожного згенерованого тесту" } },
        { id: "d", label: { en: "Set workers: 'auto' in the playwright.config.ts for that project", uk: "Встановити workers: 'auto' у playwright.config.ts для цього проєкту" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.describe.configure({ mode: 'parallel' })` at the top of a file (or inside a `describe` block) switches those tests to run in parallel across workers instead of the default serial execution within a file. This is the standard way to parallelise a data-driven suite: loop generates 10 tests, configure parallel mode, and they run simultaneously up to the configured `workers` limit.",
        uk: "`test.describe.configure({ mode: 'parallel' })` на початку файлу (або всередині `describe`-блоку) перемикає ці тести на паралельне виконання між воркерами замість дефолтного послідовного виконання в межах файлу. Це стандартний спосіб паралелізувати data-driven сьют: цикл генерує 10 тестів, налаштовуєш паралельний режим і вони виконуються одночасно до налаштованого ліміту `workers`.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You have test data in a CSV file. What is the typical approach to load it for parameterized Playwright tests?",
        uk: "У тебе є тестові дані у CSV-файлі. Який типовий підхід для їх завантаження в параметризованих тестах Playwright?",
      },
      options: [
        { id: "a", label: { en: "Use a built-in Playwright CSV reader: test.loadCSV('data.csv')", uk: "Використати вбудований CSV-reader Playwright: test.loadCSV('data.csv')" } },
        { id: "b", label: { en: "Read and parse the file with Node.js fs and a CSV parser before the for...of loop, then iterate over the resulting array", uk: "Прочитати і розпарсити файл через Node.js fs та CSV-парсер перед циклом for...of, потім ітерувати по отриманому масиву" } },
        { id: "c", label: { en: "Store the CSV in the playwright.config.ts testData field and Playwright will import it automatically", uk: "Зберегти CSV у полі testData playwright.config.ts і Playwright імпортує його автоматично" } },
        { id: "d", label: { en: "Embed the CSV rows as a multiline string inside the test file", uk: "Вбудувати рядки CSV як multiline рядок всередині тест-файлу" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright has no built-in CSV reader. The standard approach is to use Node.js APIs at module load time — read the file with `fs.readFileSync`, split by newline, parse each row, and build a JavaScript array. Then the `for...of` loop iterates over that array to register tests. JSON files work the same way with `JSON.parse`. This keeps test data separate from test code without any Playwright-specific magic.",
        uk: "Playwright не має вбудованого CSV-reader. Стандартний підхід — використовувати Node.js API під час завантаження модуля: прочитати файл через `fs.readFileSync`, розбити по новому рядку, розпарсити кожен рядок і побудувати JavaScript-масив. Потім цикл `for...of` ітерує по цьому масиву щоб реєструвати тести. JSON-файли працюють так само через `JSON.parse`. Це тримає тестові дані окремо від тест-коду без будь-якої Playwright-специфічної магії.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What is the project-level parameterization approach and when would you choose it over test-level forEach?",
        uk: "Що таке параметризація на рівні project і коли б ти вибрав її замість test-level forEach?",
      },
      options: [
        { id: "a", label: { en: "Project-level means running each test with a random seed — use it for security testing", uk: "Project-level означає запуск кожного тесту з випадковим seed — використовуй для тестування безпеки" } },
        { id: "b", label: { en: "Project-level means declaring a custom fixture option and creating one project per value (e.g. one per user role) — use it when the entire test suite should run as different personas", uk: "Project-level означає оголошення власної fixture-опції і створення одного project на значення (наприклад один на роль користувача) — використовуй коли весь тест-сьют має запускатися як різні персони" } },
        { id: "c", label: { en: "Project-level parameterization runs tests against multiple baseURLs sequentially in a single project", uk: "Параметризація рівня project запускає тести проти кількох baseURL послідовно в одному project" } },
        { id: "d", label: { en: "It is the same as test-level forEach but the loop is declared inside playwright.config.ts", uk: "Це те саме що test-level forEach але цикл оголошений всередині playwright.config.ts" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Project-level parameterization is used when you want the *same test files* to run with different configurations — typically different user roles (admin, manager, viewer) or different environments. You declare a custom option with `option: true` in a base fixture, then each project overrides it in its `use` block. Tests read the option value and branch their assertions accordingly. Use forEach when the data varies *within* a single configuration; use projects when the configuration itself varies.",
        uk: "Параметризація рівня project використовується коли хочеш щоб *ті самі тест-файли* виконувалися з різними конфігураціями — зазвичай різними ролями користувачів (адмін, менеджер, глядач) або різними середовищами. Оголошуєш власну опцію з `option: true` у базовій фікстурі, потім кожен project перевизначає її у своєму блоці `use`. Тести читають значення опції та гілкують свої перевірки відповідно. Використовуй forEach коли дані варіюються *всередині* одної конфігурації; використовуй projects коли сама конфігурація варіюється.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to switch the tested environment (staging vs production) using an environment variable. Where do you read the variable to set baseURL?",
        uk: "Хочеш перемикати тестоване середовище (staging vs production) за допомогою змінної середовища. Де читати змінну щоб встановити baseURL?",
      },
      options: [
        { id: "a", label: { en: "Inside each test using process.env before calling page.goto()", uk: "Всередині кожного тесту через process.env перед викликом page.goto()" } },
        { id: "b", label: { en: "In playwright.config.ts in the use.baseURL field, evaluated at config load time", uk: "У playwright.config.ts в полі use.baseURL, обчисленому під час завантаження конфігу" } },
        { id: "c", label: { en: "In a globalSetup file and stored back to process.env", uk: "У файлі globalSetup і збережений назад у process.env" } },
        { id: "d", label: { en: "In a .env file that each test imports directly", uk: "У .env файлі який кожен тест імпортує напряму" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `baseURL` in the `use` block of playwright.config.ts is evaluated once when the config is loaded. Reading `process.env.STAGING` there (after loading the .env file with dotenv at the top of the config) sets the right base URL for the entire run without touching individual tests. Tests then use relative paths like `page.goto('/orders')` and automatically hit the right environment.",
        uk: "`baseURL` в блоці `use` playwright.config.ts обчислюється один раз при завантаженні конфігу. Читання `process.env.STAGING` там (після завантаження .env файлу через dotenv на початку конфігу) встановлює правильний base URL для всього запуску без торкання окремих тестів. Тести потім використовують відносні шляхи типу `page.goto('/orders')` і автоматично потрапляють у правильне середовище.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Which of these is NOT a valid reason to use test-level parameterization with a for...of loop?",
        uk: "Що з перерахованого НЕ є валідною причиною використовувати параметризацію на рівні тесту через цикл for...of?",
      },
      options: [
        { id: "a", label: { en: "Testing the same form submission with multiple invalid inputs", uk: "Тестування однієї форми з кількома невалідними значеннями" } },
        { id: "b", label: { en: "Running the same test against multiple browsers (chromium, firefox, webkit)", uk: "Запуск одного тесту проти кількох браузерів (chromium, firefox, webkit)" } },
        { id: "c", label: { en: "Checking multiple order status badges render with the correct colours", uk: "Перевірка що кілька статус-бейджів замовлення рендеряться з правильними кольорами" } },
        { id: "d", label: { en: "Verifying that five different locale-specific date formats display correctly", uk: "Перевірка що п'ять різних локально-специфічних форматів дат відображаються правильно" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Running the same tests across multiple browsers is a project-level concern — you create one project per browser in playwright.config.ts. Playwright then runs the full test suite in each browser automatically. A for...of loop inside a test file is for data-level variation (different inputs, different statuses, different locales) within a single browser/configuration, not for cross-browser execution.",
        uk: "Запуск тих самих тестів у кількох браузерах — це турбота рівня project: створюєш один project на браузер у playwright.config.ts. Playwright потім автоматично запускає весь тест-сьют у кожному браузері. Цикл for...of всередині тест-файлу призначений для варіації даних (різні введення, різні статуси, різні локалі) в межах однієї конфігурації браузера, а не для крос-браузерного виконання.",
      },
    },
  ],
}
