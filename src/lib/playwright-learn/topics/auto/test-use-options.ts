import type { PlaywrightTopic } from "../../types"

export const testUseOptionsTopic: PlaywrightTopic = {
  slug: "test-use-options",
  groupId: "test-runner",
  order: 395,
  level: "intermediate",
  trackOrder: 7,
  sourceDoc: "test-use-options-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-use-options",
  title: {
    en: "Configuration (use)",
    uk: "Конфігурація (use)",
  },
  summary: {
    en: "The use: {} block in playwright.config.ts is where I set defaults for every test: baseURL so I write page.goto('/orders') instead of the full URL, storageState for auth, trace and screenshot modes for CI. I can override any of these per-project, per-file, or inside a describe block.",
    uk: "Блок use: {} у playwright.config.ts — місце де я задаю дефолти для кожного тесту: baseURL щоб писати page.goto('/orders') замість повного URL, storageState для авторизації, режими trace і screenshot для CI. Будь-що з цього можна перевизначити на рівні проєкту, файлу або describe-блоку.",
  },
  sections: [
    {
      id: "basic-options",
      title: {
        en: "The two options I always set",
        uk: "Два параметри які я завжди встановлюю",
      },
      paragraphs: [
        {
          en: "`baseURL` is the one I miss most when it's not set. Without it every `page.goto()` needs the full `http://localhost:3000` prefix. With it, I write `/orders`, `/dashboard`, `/login` and Playwright prepends the base. `storageState` points to a saved auth file — so every test starts already logged in without repeating the login flow.",
          uk: "`baseURL` — те чого найбільше не вистачає коли його немає. Без нього кожен `page.goto()` потребує повного префіксу `http://localhost:3000`. З ним пишу `/orders`, `/dashboard`, `/login` і Playwright сам додає базу. `storageState` вказує на збережений файл авторизації — кожен тест починається вже залогіненим без повторення flow входу.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-use",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    storageState: 'playwright/.auth/user.json',
  },
})`,
        },
      ],
    },
    {
      id: "recording-options",
      title: {
        en: "Recording options — screenshots, traces, video",
        uk: "Опції запису — скриншоти, трейси, відео",
      },
      paragraphs: [
        {
          en: "My standard CI setup: `trace: 'on-first-retry'` records a trace only when a test retries (meaning it failed). `screenshot: 'only-on-failure'` grabs a screenshot when the test fails. Both go to `test-results/` and get uploaded as artifacts. I never use `'on'` for either in CI — storage costs add up fast.",
          uk: "Мій стандартний CI-набір: `trace: 'on-first-retry'` записує трейс тільки коли тест повторюється (тобто впав). `screenshot: 'only-on-failure'` робить скриншот при падінні тесту. Обидва йдуть у `test-results/` і завантажуються як артефакти. Ніколи не використовую `'on'` для жодного з них на CI — витрати на зберігання швидко накопичуються.",
        },
        {
          en: "Video is expensive (CPU and storage). I use `'retain-on-failure'` rather than `'on-first-retry'` for video because video is useful even on the first failure, not just retries.",
          uk: "Відео дороге (CPU і зберігання). Використовую `'retain-on-failure'` а не `'on-first-retry'` для відео бо відео корисне навіть при першому падінні, не тільки при повторі.",
        },
      ],
      codeBlocks: [
        {
          id: "recording-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
})`,
        },
      ],
    },
    {
      id: "emulation-options",
      title: {
        en: "Emulation — locale, timezone, viewport, color scheme",
        uk: "Емуляція — локаль, часовий пояс, viewport, кольорова схема",
      },
      paragraphs: [
        {
          en: "I reach for these when testing locale-specific behavior (date formats, currency display) or when I need to verify dark mode. Setting `locale` here means every test sees the same locale without any per-test setup.",
          uk: "Беруся за ці параметри коли тестую локале-специфічну поведінку (формати дат, відображення валюти) або коли треба перевірити темний режим. Встановлення `locale` тут означає кожен тест бачить одну локаль без будь-якого налаштування на рівні тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "emulation-config",
          language: "ts",
          code: `// playwright.config.ts — емуляція для тестування локалізації
export default defineConfig({
  use: {
    locale: 'uk-UA',
    timezoneId: 'Europe/Kyiv',
    colorScheme: 'dark',
    viewport: { width: 1280, height: 720 },
    geolocation: { longitude: 30.523, latitude: 50.452 },
    permissions: ['geolocation'],
  },
})`,
        },
      ],
    },
    {
      id: "network-options",
      title: {
        en: "Network options",
        uk: "Мережеві опції",
      },
      paragraphs: [
        {
          en: "`extraHTTPHeaders` is useful when the app expects an internal auth header (`X-Internal-Token`) that the browser doesn't add automatically. `ignoreHTTPSErrors` I turn on for staging environments where the SSL cert isn't always valid. `offline: true` is for testing the 'no connection' UI path.",
          uk: "`extraHTTPHeaders` корисний коли застосунок очікує внутрішній auth-заголовок (`X-Internal-Token`) який браузер не додає автоматично. `ignoreHTTPSErrors` вмикаю для staging-середовищ де SSL-сертифікат не завжди дійсний. `offline: true` — для тестування UI-шляху 'немає з'єднання'.",
        },
      ],
      codeBlocks: [
        {
          id: "network-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  use: {
    extraHTTPHeaders: {
      'X-Internal-Token': process.env.INTERNAL_TOKEN ?? '',
    },
    ignoreHTTPSErrors: true,  // для staging з самопідписаним cert
  },
})`,
        },
      ],
    },
    {
      id: "configuration-scopes",
      title: {
        en: "Overriding use options — global, project, file, describe",
        uk: "Перевизначення use-опцій — глобально, проєкт, файл, describe",
      },
      paragraphs: [
        {
          en: "The cascade: global `use` → project-level `use` → `test.use()` in a file. Each level overrides the previous. In practice I use this for locale testing — global config sets `en-US`, a specific test file overrides to `fr-FR` for French locale tests.",
          uk: "Каскад: глобальний `use` → `use` на рівні проєкту → `test.use()` у файлі. Кожен рівень перевизначає попередній. На практиці використовую для тестування локалі: глобальний конфіг встановлює `en-US`, конкретний файл тестів перевизначає на `fr-FR` для французьких тестів.",
        },
        {
          en: "To reset an option back to the config-level value, set it to `undefined`. To completely unset it (so not even the config default applies), use the long-form fixture notation.",
          uk: "Щоб скинути опцію до значення рівня конфігу — встанови `undefined`. Щоб повністю скасувати її (щоб навіть дефолт конфігу не застосовувався) — використовуй довгу форму запису фікстури.",
        },
      ],
      codeBlocks: [
        {
          id: "project-override",
          language: "ts",
          code: `// playwright.config.ts — глобальна локаль + перевизначення на рівні проєкту
export default defineConfig({
  use: { locale: 'en-US' },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], locale: 'de-DE' },
    },
  ],
})`,
        },
        {
          id: "file-override",
          language: "ts",
          code: `// french-locale.spec.ts — перевизначення у файлі
test.use({ locale: 'fr-FR' })

test('date format shows DD/MM/YYYY', async ({ page }) => {
  await page.goto('/orders')
  // тест бачить fr-FR локаль
})`,
        },
        {
          id: "describe-override",
          language: "ts",
          code: `// Перевизначення всередині describe-блоку
test.describe('french locale', () => {
  test.use({ locale: 'fr-FR' })

  test('currency shows €', async ({ page }) => {
    await page.goto('/dashboard')
  })
})`,
        },
        {
          id: "reset-option",
          language: "ts",
          code: `// Скинути baseURL до значення конфігу для одного тесту
test.use({ baseURL: 'https://staging.example.com' })

test.describe(() => {
  test.use({ baseURL: undefined })  // повертає до конфігу

  test('uses config baseURL', async ({ page }) => {
    await page.goto('/orders')
  })
})`,
        },
      ],
    },
    {
      id: "other-options",
      title: {
        en: "Other options worth knowing",
        uk: "Інші опції які варто знати",
      },
      paragraphs: [
        {
          en: "`actionTimeout: 0` means no timeout per action — the default. I override this to `5000` when the app is slow to respond to clicks. `testIdAttribute` I change when the team uses `data-cy` instead of `data-testid` — then `getByTestId()` works with their attribute. `headless: false` for local debugging runs.",
          uk: "`actionTimeout: 0` означає немає тайм-ауту на дію — дефолт. Перевизначаю на `5000` коли застосунок повільно відповідає на кліки. `testIdAttribute` змінюю коли команда використовує `data-cy` замість `data-testid` — тоді `getByTestId()` працює з їхнім атрибутом. `headless: false` для локальних дебаг-запусків.",
        },
      ],
      codeBlocks: [
        {
          id: "other-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  use: {
    actionTimeout: 5000,
    testIdAttribute: 'data-cy',  // якщо команда використовує Cypress-атрибути
    headless: !process.env.PWDEBUG,  // headed коли PWDEBUG задано
  },
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You have baseURL: 'http://localhost:3000' in the global use config. One test file needs to test against 'http://localhost:4000' (a different microservice). How do you override it just for that file without affecting other tests?",
        uk: "У тебе baseURL: 'http://localhost:3000' в глобальному use-конфігу. Один файл тестів потребує тестувати проти 'http://localhost:4000' (інший мікросервіс). Як перевизначити це лише для того файлу не впливаючи на інші тести?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Change the global baseURL in playwright.config.ts and use environment variables to switch",
            uk: "Змінити глобальний baseURL в playwright.config.ts і використовувати змінні середовища для перемикання",
          },
        },
        {
          id: "b",
          label: {
            en: "Add test.use({ baseURL: 'http://localhost:4000' }) at the top of the test file — it overrides only for tests in that file",
            uk: "Додати test.use({ baseURL: 'http://localhost:4000' }) на початку файлу тестів — перевизначає лише для тестів у тому файлі",
          },
        },
        {
          id: "c",
          label: {
            en: "Pass the URL directly to every page.goto() call in that file instead of using baseURL",
            uk: "Передавати URL напряму кожному виклику page.goto() у тому файлі замість використання baseURL",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.use()` at the file level overrides the config for all tests in that file only. It's the cleanest way — other test files are unaffected, no environment variables needed, and you still write `page.goto('/endpoint')` with the new base. Changing the global config breaks all other tests. Passing full URLs to every goto() is tedious and makes tests fragile if the port ever changes.",
        uk: "`test.use()` на рівні файлу перевизначає конфіг для всіх тестів лише у тому файлі. Це найчистіший спосіб — інші файли тестів не зачіпаються, не потрібні змінні середовища, і ти все одно пишеш `page.goto('/endpoint')` з новою базою. Зміна глобального конфігу ламає всі інші тести. Передача повних URL кожному goto() — клопітка і робить тести крихкими якщо порт коли-небудь зміниться.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What does `storageState` in the `use` block do?",
        uk: "Що робить `storageState` у блоці `use`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It defines where Playwright saves screenshots and trace files",
            uk: "Визначає куди Playwright зберігає скриншоти і файли трейсів",
          },
        },
        {
          id: "b",
          label: {
            en: "It loads a previously saved authentication state (cookies, localStorage) into every new browser context so tests start already logged in",
            uk: "Завантажує раніше збережений стан авторизації (cookies, localStorage) у кожен новий browser context щоб тести починалися вже залогіненими",
          },
        },
        {
          id: "c",
          label: {
            en: "It sets the directory where Playwright stores browser data between test runs",
            uk: "Встановлює директорію де Playwright зберігає дані браузера між запусками тестів",
          },
        },
        {
          id: "d",
          label: {
            en: "It enables localStorage persistence across tests in the same file",
            uk: "Вмикає збереження localStorage між тестами в одному файлі",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`storageState` points to a JSON file that contains saved cookies and localStorage. When set in `use`, every new browser context is initialised with that saved auth state — tests start as if the user is already logged in. The file is typically created in a setup step using `context.storageState({ path: 'playwright/.auth/user.json' })`. This avoids repeating the login flow in every test.",
        uk: "`storageState` вказує на JSON-файл що містить збережені cookies і localStorage. При встановленні у `use` кожен новий browser context ініціалізується з тим збереженим auth-станом — тести починаються як ніби користувач вже залогінений. Файл зазвичай створюється на кроці setup через `context.storageState({ path: 'playwright/.auth/user.json' })`. Це уникає повторення flow входу в кожному тесті.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "You need all tests to simulate a device in dark mode with a Ukrainian locale. Where do you put these settings?",
        uk: "Потрібно щоб всі тести симулювали пристрій у темному режимі з українською локаллю. Де розмістити ці налаштування?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "In a beforeEach hook in every test file",
            uk: "У хуку beforeEach у кожному файлі тестів",
          },
        },
        {
          id: "b",
          label: {
            en: "In the use: {} block of playwright.config.ts — colorScheme: 'dark' and locale: 'uk-UA'",
            uk: "У блоці use: {} playwright.config.ts — colorScheme: 'dark' і locale: 'uk-UA'",
          },
        },
        {
          id: "c",
          label: {
            en: "In package.json under a playwright key",
            uk: "У package.json під ключем playwright",
          },
        },
        {
          id: "d",
          label: {
            en: "In an environment variable PLAYWRIGHT_LOCALE and PLAYWRIGHT_COLOR_SCHEME",
            uk: "У змінних середовища PLAYWRIGHT_LOCALE і PLAYWRIGHT_COLOR_SCHEME",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`colorScheme`, `locale`, `timezoneId`, `viewport`, and `permissions` are all emulation options that belong in the `use` block of `playwright.config.ts`. Setting them there applies them to every test automatically. Individual test files can override them with `test.use({ colorScheme: 'light' })` when needed.",
        uk: "`colorScheme`, `locale`, `timezoneId`, `viewport` і `permissions` — всі це опції емуляції що належать блоку `use` у `playwright.config.ts`. Встановлення там автоматично застосовує їх до кожного тесту. Окремі файли тестів можуть перевизначити їх через `test.use({ colorScheme: 'light' })` коли потрібно.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does `viewport: { width: 1280, height: 720 }` in the `use` block do?",
        uk: "Що робить `viewport: { width: 1280, height: 720 }` у блоці `use`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It sets the resolution of screenshots captured during the test",
            uk: "Встановлює роздільну здатність скриншотів зроблених під час тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "It sets the browser window size for every test, affecting layout and responsive design behaviour",
            uk: "Встановлює розмір вікна браузера для кожного тесту, впливаючи на компонування і поведінку адаптивного дизайну",
          },
        },
        {
          id: "c",
          label: {
            en: "It sets the minimum screen resolution required to run the tests",
            uk: "Встановлює мінімальну роздільну здатність екрану необхідну для запуску тестів",
          },
        },
        {
          id: "d",
          label: {
            en: "It only affects video recordings — not the actual browser window",
            uk: "Впливає лише на відеозаписи — не на реальне вікно браузера",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`viewport` sets the size of the browser viewport for every test. This affects responsive CSS breakpoints, element visibility, and any layout that changes based on screen size. If your app has a mobile hamburger menu at 768px, setting `viewport: { width: 375, height: 667 }` lets you test that behaviour. Each Playwright `devices` preset includes a matching viewport.",
        uk: "`viewport` встановлює розмір вьюпорту браузера для кожного тесту. Це впливає на CSS-брейкпоінти адаптивного дизайну, видимість елементів і будь-яке компонування що змінюється залежно від розміру екрану. Якщо застосунок має мобільне гамбургер-меню при 768px — встановлення `viewport: { width: 375, height: 667 }` дозволяє тестувати цю поведінку. Кожен пресет Playwright `devices` включає відповідний viewport.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What is the cascade order when `test.use()` is called both at the file level and inside a `test.describe()` block?",
        uk: "Який порядок каскаду коли `test.use()` викликається і на рівні файлу і всередині блоку `test.describe()`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The file-level use always wins over describe-level use",
            uk: "test.use() на рівні файлу завжди перемагає над рівнем describe",
          },
        },
        {
          id: "b",
          label: {
            en: "The describe-level use overrides the file-level use for tests inside that describe block",
            uk: "test.use() на рівні describe перевизначає рівень файлу для тестів всередині того describe-блоку",
          },
        },
        {
          id: "c",
          label: {
            en: "Both are applied and merged — the last one wins for conflicting keys",
            uk: "Обидва застосовуються і об'єднуються — останній виграє для конфліктуючих ключів",
          },
        },
        {
          id: "d",
          label: {
            en: "Only one test.use() can be active at a time — the second call throws an error",
            uk: "Одночасно може бути активний лише один test.use() — другий виклик кидає помилку",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The cascade is: global config `use` → project-level `use` → file-level `test.use()` → describe-level `test.use()`. Each inner level overrides the outer level for tests in that scope. Tests outside the describe block still see the file-level value. This allows fine-grained control: set English globally, override to French in a specific describe block.",
        uk: "Каскад: глобальний `use` конфігу → `use` на рівні проєкту → `test.use()` на рівні файлу → `test.use()` на рівні describe. Кожен внутрішній рівень перевизначає зовнішній для тестів у тому скоупі. Тести поза describe-блоком все одно бачать значення рівня файлу. Це дозволяє точне управління: встановити англійську глобально, перевизначити на французьку в конкретному describe-блоці.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You want to test that your app correctly requests the user's location. Which `use` options do you set?",
        uk: "Хочеш перевірити що застосунок коректно запитує геолокацію користувача. Які опції `use` встановити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set geoLocation to the coordinates and allowGeo: true",
            uk: "Встановити geoLocation на координати і allowGeo: true",
          },
        },
        {
          id: "b",
          label: {
            en: "Set geolocation to the coordinates and include 'geolocation' in the permissions array",
            uk: "Встановити geolocation на координати і включити 'geolocation' у масив permissions",
          },
        },
        {
          id: "c",
          label: {
            en: "Use page.setGeolocation() inside each test — there is no use option for this",
            uk: "Використовувати page.setGeolocation() всередині кожного тесту — немає use-опції для цього",
          },
        },
        {
          id: "d",
          label: {
            en: "Set locationServices: { latitude: 50, longitude: 30 } in the use block",
            uk: "Встановити locationServices: { latitude: 50, longitude: 30 } у блоці use",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "To emulate geolocation you need two things: `geolocation: { latitude: 50.45, longitude: 30.52 }` to set the coordinates, and `permissions: ['geolocation']` to grant the permission automatically (otherwise the browser shows a permission prompt that blocks the test). Both go in the `use` block. You can also call `context.grantPermissions(['geolocation'])` per test.",
        uk: "Для емуляції геолокації потрібні дві речі: `geolocation: { latitude: 50.45, longitude: 30.52 }` щоб встановити координати, і `permissions: ['geolocation']` щоб автоматично надати дозвіл (інакше браузер показує запит дозволу що блокує тест). Обидва йдуть у блок `use`. Також можна викликати `context.grantPermissions(['geolocation'])` на рівні тесту.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What does `timezoneId` in the `use` block affect in tests?",
        uk: "На що впливає `timezoneId` у блоці `use` у тестах?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The timezone of the CI server running the tests",
            uk: "Часовий пояс CI-сервера що запускає тести",
          },
        },
        {
          id: "b",
          label: {
            en: "The timezone seen by the browser's JavaScript — new Date() and Intl APIs return times in that timezone",
            uk: "Часовий пояс який бачить JavaScript браузера — new Date() і Intl API повертають час у тому часовому поясі",
          },
        },
        {
          id: "c",
          label: {
            en: "The timezone used by Playwright for logging test start and end times",
            uk: "Часовий пояс що використовує Playwright для логування часу початку і завершення тестів",
          },
        },
        {
          id: "d",
          label: {
            en: "The system timezone of the machine running the tests",
            uk: "Системний часовий пояс машини що запускає тести",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`timezoneId` emulates a timezone inside the browser context. JavaScript's `new Date()`, `Date.toLocaleString()`, and `Intl.DateTimeFormat` all use this timezone instead of the host machine's timezone. This is critical for testing date-related features — without it, tests that check date formatting will behave differently on CI (likely UTC) vs locally (your local timezone).",
        uk: "`timezoneId` емулює часовий пояс всередині browser context. JavaScript-`new Date()`, `Date.toLocaleString()` і `Intl.DateTimeFormat` використовують цей часовий пояс замість часового поясу хост-машини. Це критично для тестування функцій пов'язаних з датами — без цього тести що перевіряють форматування дат поводитимуться по-різному на CI (скоріш за все UTC) і локально (твій локальний часовий пояс).",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What does `ignoreHTTPSErrors: true` in the `use` block do?",
        uk: "Що робить `ignoreHTTPSErrors: true` у блоці `use`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It allows the app to make HTTP requests instead of HTTPS",
            uk: "Дозволяє застосунку робити HTTP-запити замість HTTPS",
          },
        },
        {
          id: "b",
          label: {
            en: "It suppresses TLS/SSL certificate errors so tests can run against environments with self-signed or invalid certificates",
            uk: "Пригнічує помилки TLS/SSL-сертифіката щоб тести могли виконуватися проти середовищ з самопідписаними або недійсними сертифікатами",
          },
        },
        {
          id: "c",
          label: {
            en: "It disables HTTPS for all requests and forces them to use HTTP",
            uk: "Вимикає HTTPS для всіх запитів і змушує їх використовувати HTTP",
          },
        },
        {
          id: "d",
          label: {
            en: "It hides network errors from the test reporter",
            uk: "Приховує мережеві помилки від репортера тестів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`ignoreHTTPSErrors: true` tells Playwright to proceed even when the server presents an invalid, expired, or self-signed TLS certificate. This is commonly needed for staging or dev environments where a proper certificate isn't set up. In production testing you should not use this — certificate errors should fail the test so you catch misconfigured environments.",
        uk: "`ignoreHTTPSErrors: true` вказує Playwright продовжувати навіть коли сервер представляє недійсний, прострочений або самопідписаний TLS-сертифікат. Це зазвичай потрібно для staging або dev-середовищ де належний сертифікат не налаштований. При тестуванні production не варто використовувати це — помилки сертифіката повинні зупиняти тест щоб ти виявляв неправильно налаштовані середовища.",
      },
    },
  ],
}
