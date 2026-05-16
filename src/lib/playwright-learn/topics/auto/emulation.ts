import type { PlaywrightTopic } from "../../types"

export const emulationTopic: PlaywrightTopic = {
  slug: "emulation",
  groupId: "guides",
  order: 185,
  level: "advanced",
  trackOrder: 9,
  sourceDoc: "emulation.md",
  officialDocsUrl: "https://playwright.dev/docs/emulation",
  title: {
    en: "Emulation",
    uk: "Емуляція",
  },
  summary: {
    en: "When a client shows you a bug that only happens on mobile — this is how you reproduce it without picking up a phone. Playwright can fake any device, locale, timezone, geolocation, or color scheme.",
    uk: "Коли клієнт показує баг що виникає лише на мобільному — ось як його відтворити без телефону. Playwright може підмінити будь-який пристрій, локаль, часовий пояс, геолокацію або кольорову схему.",
  },
  sections: [
    {
      id: "devices",
      title: {
        en: "Device profiles",
        uk: "Профілі пристроїв",
      },
      diagram: {
        mermaid: `flowchart LR
  C[playwright.config.ts] --> D[devices\\n'iPhone 13']
  D --> UA[userAgent]
  D --> VP[viewport\\n390×844]
  D --> T[hasTouch: true]
  D --> M[isMobile: true]`,
        caption: {
          en: "One device profile sets all browser behavior at once",
          uk: "Один профіль пристрою одразу задає всю поведінку браузера",
        },
      },
      paragraphs: [
        {
          en: "Playwright ships with a built-in registry of ~60 device profiles — iPhone models, Pixel phones, iPad variants, desktop browsers. Each profile sets `userAgent`, `viewport`, `deviceScaleFactor`, `hasTouch` and `isMobile` in one spread. I use this constantly when testing responsive layouts or touch interactions.",
          uk: "Playwright постачається з вбудованим реєстром ~60 профілів пристроїв — моделі iPhone, Pixel, iPad, настільні браузери. Кожен профіль задає `userAgent`, `viewport`, `deviceScaleFactor`, `hasTouch` і `isMobile` одним spread-оператором. Я використовую це постійно для тестування адаптивних layout і touch-взаємодій.",
        },
        {
          en: "In `playwright.config.ts` you add a project per device. In the test file the page is already sized and touch-enabled — no extra setup.",
          uk: "У `playwright.config.ts` додаєш проєкт для кожного пристрою. У файлі тесту сторінка вже правильного розміру з підтримкою touch — жодного додаткового налаштування.",
        },
      ],
      codeBlocks: [
        {
          id: "device-config",
          language: "ts",
          code: `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'iPhone 13',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'iPad Pro 11',
      use: { ...devices['iPad Pro 11'] },
    },
  ],
})`,
        },
        {
          id: "device-test",
          language: "ts",
          code: `// Тест запускається з тими самими параметрами що в профілі
test('mobile nav shows hamburger menu', async ({ page }) => {
  await page.goto('/dashboard')
  // При viewport iPhone 13 desktop nav прихований, hamburger видимий
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible()
  await expect(page.getByRole('navigation')).not.toBeVisible()
})`,
        },
      ],
    },
    {
      id: "viewport",
      title: {
        en: "Override viewport per test",
        uk: "Перевизначення viewport для окремого тесту",
      },
      paragraphs: [
        {
          en: "The device profile sets a default viewport, but you can override it for a specific test or describe block. Useful when you need to test a specific breakpoint without creating a whole new project.",
          uk: "Профіль пристрою задає viewport за замовчуванням, але його можна перевизначити для конкретного тесту або блоку describe. Зручно коли треба перевірити конкретний breakpoint без створення цілого нового проєкту.",
        },
      ],
      codeBlocks: [
        {
          id: "viewport-test",
          language: "ts",
          code: `// Для всього файлу
test.use({ viewport: { width: 1440, height: 900 } })

// Або для конкретного describe
test.describe('tablet layout', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('sidebar collapses at tablet width', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.getByRole('complementary')).toHaveAttribute('data-collapsed', 'true')
  })
})

// Або прямо в тесті
test('wide screen shows split view', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/orders')
  await expect(page.getByTestId('split-view')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "locale-timezone",
      title: {
        en: "Locale and timezone",
        uk: "Локаль і часовий пояс",
      },
      paragraphs: [
        {
          en: "Date formatting, number separators, currency symbols — all of these depend on locale. If your app shows orders with dates, and you're testing a German customer, the date should be `14.05.2026`, not `05/14/2026`. Playwright lets you emulate any locale and timezone at the context level.",
          uk: "Формат дат, роздільники чисел, символи валют — все це залежить від локалі. Якщо твій застосунок показує замовлення з датами і ти тестуєш німецького клієнта — дата має бути `14.05.2026`, а не `05/14/2026`. Playwright дозволяє емулювати будь-яку локаль і часовий пояс на рівні context.",
        },
        {
          en: "Note: this affects only what the browser reports — `navigator.language`, `Intl` API, and timezone for JS date operations. It doesn't change the test runner's timezone.",
          uk: "Примітка: це впливає лише на те що браузер повідомляє — `navigator.language`, `Intl` API і timezone для JS date. Timezone самого test runner'а не змінюється.",
        },
      ],
      codeBlocks: [
        {
          id: "locale-config",
          language: "ts",
          code: `// playwright.config.ts — глобально для всіх тестів
export default defineConfig({
  use: {
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
  },
})`,
        },
        {
          id: "locale-test",
          language: "ts",
          code: `// Або для окремого тесту
test.use({
  locale: 'uk-UA',
  timezoneId: 'Europe/Kyiv',
})

test('order date shows in Ukrainian format', async ({ page }) => {
  await page.goto('/orders')
  // Дата має бути у форматі ДД.ММ.РРРР
  await expect(page.getByTestId('order-date').first()).toContainText(/\d{2}\.\d{2}\.\d{4}/)
})`,
        },
      ],
    },
    {
      id: "permissions",
      title: {
        en: "Browser permissions",
        uk: "Дозволи браузера",
      },
      paragraphs: [
        {
          en: "If your app asks for notifications, camera, or geolocation access — by default the browser blocks it with a permission dialog that Playwright can't click through. You need to grant the permission programmatically before the page even asks for it.",
          uk: "Якщо твій застосунок запитує доступ до сповіщень, камери або геолокації — браузер за замовчуванням блокує це діалогом який Playwright не може клікнути. Треба видати дозвіл програматично до того як сторінка його запитає.",
        },
      ],
      codeBlocks: [
        {
          id: "permissions-code",
          language: "ts",
          code: `// Глобально в конфізі
export default defineConfig({
  use: {
    permissions: ['notifications', 'geolocation'],
  },
})

// Або в тесті через context
test('notification opt-in flow works', async ({ page, context }) => {
  await context.grantPermissions(['notifications'])
  await page.goto('/settings/notifications')
  await page.getByRole('button', { name: 'Enable notifications' }).click()
  // Діалогу браузера немає — дозвіл вже виданий
  await expect(page.getByText('Notifications enabled')).toBeVisible()
})

// Скинути всі дозволи
await context.clearPermissions()`,
        },
      ],
    },
    {
      id: "geolocation",
      title: {
        en: "Geolocation",
        uk: "Геолокація",
      },
      paragraphs: [
        {
          en: "If the app shows location-based content — store locators, delivery zones, region-specific pricing — you need to fake the user's position. Set geolocation in the config or override it mid-test.",
          uk: "Якщо застосунок показує контент залежно від місця — пошук магазинів, зони доставки, регіональні ціни — треба підмінити позицію користувача. Задай геолокацію в конфізі або заміни її в середині тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "geolocation-code",
          language: "ts",
          code: `test.use({
  geolocation: { latitude: 50.4501, longitude: 30.5234 }, // Kyiv
  permissions: ['geolocation'],
})

test('shows Kyiv delivery zone', async ({ page }) => {
  await page.goto('/delivery-zones')
  await expect(page.getByText('Доставка по Києву')).toBeVisible()
})

test('location-based store finder', async ({ page, context }) => {
  await page.goto('/stores')

  // Змінити позицію прямо в тесті
  await context.setGeolocation({ latitude: 48.4647, longitude: 35.0462 }) // Dnipro
  await page.getByRole('button', { name: 'Find stores near me' }).click()
  await expect(page.getByText('Дніпро')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "color-scheme",
      title: {
        en: "Dark mode and color scheme",
        uk: "Темний режим і кольорова схема",
      },
      paragraphs: [
        {
          en: "If your app supports dark mode via `prefers-color-scheme`, tests run in light mode by default. To test dark mode components, set `colorScheme: 'dark'` — either globally or for a specific test.",
          uk: "Якщо твій застосунок підтримує темний режим через `prefers-color-scheme`, тести запускаються у світлому режимі за замовчуванням. Щоб тестувати компоненти в темному режимі, задай `colorScheme: 'dark'` — глобально або для конкретного тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "dark-mode-code",
          language: "ts",
          code: `test.describe('dark mode', () => {
  test.use({ colorScheme: 'dark' })

  test('dashboard looks right in dark mode', async ({ page }) => {
    await page.goto('/dashboard')
    // Перевіряємо що dark mode клас є на body
    await expect(page.locator('body')).toHaveClass(/dark/)
  })
})

// Або переключати в тесті через emulateMedia
test('color scheme toggle works', async ({ page }) => {
  await page.goto('/dashboard')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('[data-theme]')).toHaveAttribute('data-theme', 'light')
})`,
        },
      ],
    },
    {
      id: "offline",
      title: {
        en: "Offline mode",
        uk: "Офлайн режим",
      },
      paragraphs: [
        {
          en: "Set `offline: true` to simulate a dropped connection. Useful for testing error states — what does the app show when the API is unreachable? Better to test this with emulation than to actually kill the server.",
          uk: "Задай `offline: true` щоб симулювати відсутність з'єднання. Корисно для тестування стану помилки — що показує застосунок коли API недоступний? Краще тестувати це через емуляцію ніж насправді вимикати сервер.",
        },
      ],
      codeBlocks: [
        {
          id: "offline-code",
          language: "ts",
          code: `test('shows error banner when offline', async ({ page, context }) => {
  await page.goto('/orders')

  // Симулюємо обрив з'єднання
  await context.setOffline(true)

  await page.getByRole('button', { name: 'Refresh' }).click()
  await expect(page.getByRole('alert')).toContainText('Немає з\'єднання')

  // Відновлюємо
  await context.setOffline(false)
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want to run the same test on iPhone 13 and Desktop Chrome. What's the right approach?",
        uk: "Хочеш запустити той самий тест на iPhone 13 і Desktop Chrome. Який правильний підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Create two projects in playwright.config.ts using devices['iPhone 13'] and devices['Desktop Chrome']",
            uk: "Створити два проєкти в playwright.config.ts з devices['iPhone 13'] і devices['Desktop Chrome']",
          },
        },
        {
          id: "b",
          label: {
            en: "Call page.setViewportSize() at the start of each test",
            uk: "Викликати page.setViewportSize() на початку кожного тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "Use test.use({ isMobile: true }) inside a describe block",
            uk: "Використати test.use({ isMobile: true }) всередині describe блоку",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "Projects in the config are the right way — the test file stays unchanged and Playwright runs it with each device profile automatically. `setViewportSize` only changes the viewport, not userAgent or touch. `isMobile` alone doesn't set all the right properties.",
        uk: "Проєкти в конфізі — правильний підхід: файл тесту залишається незмінним, Playwright запускає його з кожним профілем автоматично. `setViewportSize` змінює лише viewport, а не userAgent або touch. `isMobile` сам по собі не задає всі потрібні властивості.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Your app asks for notification permission on page load. The test fails because Playwright can't interact with the browser permission dialog. How do you fix it?",
        uk: "Твій застосунок запитує дозвіл на сповіщення при завантаженні. Тест падає бо Playwright не може взаємодіяти з діалогом браузера. Як виправити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Click the dialog with page.click() using a CSS selector",
            uk: "Клікнути діалог через page.click() з CSS селектором",
          },
        },
        {
          id: "b",
          label: {
            en: "Call context.grantPermissions(['notifications']) before page.goto()",
            uk: "Викликати context.grantPermissions(['notifications']) перед page.goto()",
          },
        },
        {
          id: "c",
          label: {
            en: "Add a waitForTimeout(3000) to wait for the dialog to close",
            uk: "Додати waitForTimeout(3000) щоб дочекатися закриття діалогу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Browser permission dialogs are native OS dialogs — Playwright can't interact with them using page methods. `grantPermissions` tells the browser the permission is already granted before the page even asks, so the dialog never appears.",
        uk: "Діалоги дозволів браузера — це нативні діалоги ОС, Playwright не може взаємодіяти з ними через page методи. `grantPermissions` повідомляє браузеру що дозвіл вже видано до того як сторінка запитує, тому діалог взагалі не з'являється.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does a device profile (e.g., `devices['iPhone 13']`) set when used in a project?",
        uk: "Що задає профіль пристрою (напр. `devices['iPhone 13']`) при використанні в проєкті?",
      },
      options: [
        { id: "a", label: { en: "Only the viewport size.", uk: "Лише розмір viewport." } },
        { id: "b", label: { en: "`userAgent`, `viewport`, `deviceScaleFactor`, `hasTouch`, and `isMobile` — all in one spread.", uk: "`userAgent`, `viewport`, `deviceScaleFactor`, `hasTouch` і `isMobile` — усе одним spread." } },
        { id: "c", label: { en: "Only the user-agent string.", uk: "Лише рядок user-agent." } },
        { id: "d", label: { en: "The browser binary to download for that device.", uk: "Бінарник браузера для завантаження для цього пристрою." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A device profile is a preset object with multiple fields: `userAgent` (for server-side device detection), `viewport` (width/height), `deviceScaleFactor` (pixel density), `hasTouch` (enables touch events), and `isMobile`. Using `...devices['iPhone 13']` spreads all these at once into the project's `use` block.",
        uk: "Профіль пристрою — це пресет-об'єкт з кількома полями: `userAgent` (для серверного визначення пристрою), `viewport` (ширина/висота), `deviceScaleFactor` (піксельна щільність), `hasTouch` (вмикає touch-події) і `isMobile`. Використання `...devices['iPhone 13']` розгортає все це одразу в блок `use` проєкту.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You want to test date formatting for a German user (dates like `14.05.2026`). Where should you set `locale: 'de-DE'`?",
        uk: "Хочеш протестувати форматування дат для німецького користувача (дати типу `14.05.2026`). Де встановити `locale: 'de-DE'`?",
      },
      options: [
        { id: "a", label: { en: "In the test using `page.setLocale('de-DE')`.", uk: "В тесті через `page.setLocale('de-DE')`." } },
        { id: "b", label: { en: "In `playwright.config.ts` `use` block, or via `test.use({ locale: 'de-DE' })` in a test file.", uk: "В блоці `use` файлу `playwright.config.ts` або через `test.use({ locale: 'de-DE' })` у файлі тесту." } },
        { id: "c", label: { en: "Set the `LANG=de_DE` environment variable before running tests.", uk: "Встановити змінну середовища `LANG=de_DE` перед запуском тестів." } },
        { id: "d", label: { en: "In the test using `browser.setLocale('de-DE')`.", uk: "В тесті через `browser.setLocale('de-DE')`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `locale` setting lives in the `use` block — either globally in `playwright.config.ts` or scoped to specific tests/files with `test.use()`. This affects `navigator.language`, the `Intl` API, and how the browser formats dates and numbers. There is no `page.setLocale()` or `browser.setLocale()` method.",
        uk: "Налаштування `locale` знаходиться в блоці `use` — або глобально в `playwright.config.ts`, або обмежено конкретними тестами/файлами через `test.use()`. Це впливає на `navigator.language`, `Intl` API і форматування дат та чисел. Методів `page.setLocale()` або `browser.setLocale()` немає.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you simulate a dropped network connection mid-test to verify an error banner appears?",
        uk: "Як симулювати обрив мережевого з'єднання в середині тесту щоб перевірити появу банера помилки?",
      },
      options: [
        { id: "a", label: { en: "Call `page.route('**', route => route.abort())` to abort all requests.", uk: "Викликати `page.route('**', route => route.abort())` щоб скасувати всі запити." } },
        { id: "b", label: { en: "Call `context.setOffline(true)` to simulate a dropped connection.", uk: "Викликати `context.setOffline(true)` щоб симулювати обрив з'єднання." } },
        { id: "c", label: { en: "Use `process.env.OFFLINE = 'true'` before the test action.", uk: "Використати `process.env.OFFLINE = 'true'` перед тестовою дією." } },
        { id: "d", label: { en: "Use `page.setNetworkState('offline')` on the page object.", uk: "Використати `page.setNetworkState('offline')` на об'єкті page." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`context.setOffline(true)` tells the browser context to behave as if the network is disconnected — network requests fail with a connection error. Call `context.setOffline(false)` to restore connectivity. `page.route()` aborts requests individually but doesn't simulate a true offline state.",
        uk: "`context.setOffline(true)` каже browser context поводитись як при відсутності мережі — мережеві запити завершуються помилкою з'єднання. Виклик `context.setOffline(false)` відновлює з'єднання. `page.route()` скасовує запити по одному але не симулює справжній offline-стан.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You want to override the viewport to 768×1024 for a single `describe` block without affecting the rest of the file. What's the right approach?",
        uk: "Хочеш перевизначити viewport до 768×1024 для одного `describe` блоку без впливу на решту файлу. Який правильний підхід?",
      },
      options: [
        { id: "a", label: { en: "Call `page.setViewportSize({ width: 768, height: 1024 })` inside `beforeEach` within the describe.", uk: "Викликати `page.setViewportSize({ width: 768, height: 1024 })` всередині `beforeEach` у describe." } },
        { id: "b", label: { en: "Use `test.use({ viewport: { width: 768, height: 1024 } })` inside the `describe` block.", uk: "Використати `test.use({ viewport: { width: 768, height: 1024 } })` всередині блоку `describe`." } },
        { id: "c", label: { en: "Create a new `playwright.config.ts` file for the describe block.", uk: "Створити новий файл `playwright.config.ts` для describe блоку." } },
        { id: "d", label: { en: "Use `test.describe.configure({ viewport: { width: 768, height: 1024 } })`.", uk: "Використати `test.describe.configure({ viewport: { width: 768, height: 1024 } })`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.use()` inside a `describe` block scopes the override to that block only — tests outside are unaffected. `page.setViewportSize()` in `beforeEach` also works but is more verbose. Both approaches are valid, but `test.use()` is more declarative and idiomatic.",
        uk: "`test.use()` всередині блоку `describe` обмежує перевизначення лише цим блоком — тести зовні не зачіпаються. `page.setViewportSize()` в `beforeEach` також працює але більш багатослівний. Обидва підходи valid, але `test.use()` більш декларативний і ідіоматичний.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you test how your app looks and behaves in dark mode using `prefers-color-scheme`?",
        uk: "Як протестувати як виглядає і поводиться застосунок у темному режимі через `prefers-color-scheme`?",
      },
      options: [
        { id: "a", label: { en: "Click the dark mode toggle button in the app's UI.", uk: "Клікнути кнопку перемикання темного режиму в UI застосунку." } },
        { id: "b", label: { en: "Set `colorScheme: 'dark'` in `test.use()` or call `page.emulateMedia({ colorScheme: 'dark' })`.", uk: "Встановити `colorScheme: 'dark'` в `test.use()` або викликати `page.emulateMedia({ colorScheme: 'dark' })`." } },
        { id: "c", label: { en: "Add `@media (prefers-color-scheme: dark)` as a test tag.", uk: "Додати `@media (prefers-color-scheme: dark)` як тег тесту." } },
        { id: "d", label: { en: "Change the OS system preference to dark mode before running tests.", uk: "Змінити системне налаштування ОС на темний режим перед запуском тестів." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright can emulate `prefers-color-scheme` without changing the OS setting. Use `colorScheme: 'dark'` in `test.use()` for the entire file/describe, or call `page.emulateMedia({ colorScheme: 'dark' })` mid-test to switch. This sets the CSS media feature the browser reports, triggering `@media (prefers-color-scheme: dark)` styles.",
        uk: "Playwright може емулювати `prefers-color-scheme` без зміни системного налаштування ОС. Використовуй `colorScheme: 'dark'` в `test.use()` для всього файлу/describe, або виклич `page.emulateMedia({ colorScheme: 'dark' })` в середині тесту для переключення. Це задає CSS media feature яку браузер повідомляє, тригеруючи стилі `@media (prefers-color-scheme: dark)`.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "How do you fake the user's GPS position to test location-based features like a store finder?",
        uk: "Як підмінити GPS-позицію користувача для тестування функцій на основі локації, як-от пошук магазинів?",
      },
      options: [
        { id: "a", label: { en: "Mock the `navigator.geolocation` API using `page.evaluate()`.", uk: "Замокати API `navigator.geolocation` через `page.evaluate()`." } },
        { id: "b", label: { en: "Set `geolocation: { latitude, longitude }` in `test.use()` and grant the `'geolocation'` permission.", uk: "Встановити `geolocation: { latitude, longitude }` в `test.use()` і видати дозвіл `'geolocation'`." } },
        { id: "c", label: { en: "Use a VPN to route test traffic through the target location's IP.", uk: "Використати VPN для маршрутизації тестового трафіку через IP цільового місця." } },
        { id: "d", label: { en: "Set `GPS_LAT` and `GPS_LON` environment variables before running tests.", uk: "Встановити змінні середовища `GPS_LAT` і `GPS_LON` перед запуском тестів." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "You need two things together: `geolocation` in `test.use()` (or `context.setGeolocation()` for mid-test changes) to set the coordinates, AND the `'geolocation'` permission granted via `permissions: ['geolocation']`. Without the permission, the browser would show a dialog to ask the user — which Playwright can't click through.",
        uk: "Потрібні дві речі разом: `geolocation` в `test.use()` (або `context.setGeolocation()` для змін в середині тесту) щоб задати координати, І дозвіл `'geolocation'` виданий через `permissions: ['geolocation']`. Без дозволу браузер показував би діалог для запиту у користувача — який Playwright не може клікнути.",
      },
    },
  ],
}
