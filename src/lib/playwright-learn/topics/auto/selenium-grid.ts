import type { PlaywrightTopic } from "../../types"

export const seleniumGridTopic: PlaywrightTopic = {
  slug: "selenium-grid",
  groupId: "ci",
  order: 300,
  level: "advanced",
  trackOrder: 20,
  sourceDoc: "selenium-grid.md",
  officialDocsUrl: "https://playwright.dev/docs/selenium-grid",
  title: {
    en: "Selenium Grid (experimental)",
    uk: "Selenium Grid (експериментально)",
  },
  summary: {
    en: "If your team already has Selenium Grid 4 infrastructure, Playwright can run tests against it by setting one environment variable: SELENIUM_REMOTE_URL. No code changes required. Only works with Chrome and Edge (not Firefox or WebKit). The feature is experimental — use it as a migration bridge, not a permanent architecture.",
    uk: "Якщо команда вже має інфраструктуру Selenium Grid 4, Playwright може запускати тести проти неї встановивши одну змінну середовища: SELENIUM_REMOTE_URL. Зміни коду не потрібні. Працює лише з Chrome та Edge (не Firefox або WebKit). Функція експериментальна — використовуй її як міст для міграції, а не як постійну архітектуру.",
  },
  sections: [
    {
      id: "when-to-use",
      title: {
        en: "When this is useful",
        uk: "Коли це корисно",
      },
      paragraphs: [
        {
          en: "The main use case: a team that's migrating from Selenium to Playwright and already has a Selenium Grid running in their CI infrastructure. Instead of immediately switching all CI to run Playwright with local browsers, they can point the new Playwright tests at the existing Selenium Grid — and migrate the CI infrastructure separately on a different timeline.",
          uk: "Основний кейс: команда що мігрує з Selenium на Playwright і вже має Selenium Grid в CI-інфраструктурі. Замість миттєвого переходу всього CI на запуск Playwright з локальними браузерами — можна направити нові Playwright-тести на існуючий Selenium Grid і мігрувати CI-інфраструктуру окремо в іншому часовому вікні.",
        },
        {
          en: "Important limitations:\n- Only **Chrome** and **Edge** are supported (not Firefox, not WebKit/Safari)\n- Requires **Selenium 4** (Selenium 3 works in best-effort mode with limited support)\n- The feature is **experimental** — it's not tested as rigorously as the standard browser launch path",
          uk: "Важливі обмеження:\n- Підтримуються лише **Chrome** і **Edge** (не Firefox, не WebKit/Safari)\n- Потрібен **Selenium 4** (Selenium 3 підтримується в режимі 'як є' з обмеженою підтримкою)\n- Функція **експериментальна** — тестується не так ретельно як стандартний шлях запуску браузерів",
        },
      ],
    },
    {
      id: "connecting",
      title: {
        en: "Connecting to Selenium Grid",
        uk: "Підключення до Selenium Grid",
      },
      paragraphs: [
        {
          en: "No code changes are needed. Just set the `SELENIUM_REMOTE_URL` environment variable pointing to the Grid Hub before running tests. Playwright detects it and routes browser traffic through the Grid.",
          uk: "Зміни коду не потрібні. Просто встанови змінну середовища `SELENIUM_REMOTE_URL` вказуючи на Grid Hub перед запуском тестів. Playwright виявляє її і маршрутизує трафік браузера через Grid.",
        },
        {
          en: "Before connecting Playwright, verify the Grid is working with a basic Selenium WebDriver test. If that doesn't work, the issue is in the Grid setup, not in Playwright.",
          uk: "Перед підключенням Playwright перевір що Grid працює з базовим тестом Selenium WebDriver. Якщо це не працює — проблема в налаштуванні Grid, не в Playwright.",
        },
      ],
      codeBlocks: [
        {
          id: "connect-basic",
          language: "bash",
          code: `# Запустити Playwright тести проти Selenium Grid
SELENIUM_REMOTE_URL=http://selenium-hub:4444 npx playwright test

# Тільки Chrome (default для Selenium Grid)
SELENIUM_REMOTE_URL=http://selenium-hub:4444 npx playwright test --project=chromium`,
        },
        {
          id: "debug-connection",
          language: "bash",
          code: `# Детальні логи підключення — корисно для дебагу
DEBUG=pw:browser* SELENIUM_REMOTE_URL=http://selenium-hub:4444 npx playwright test`,
        },
      ],
    },
    {
      id: "docker-setup",
      title: {
        en: "Quick start with Selenium Docker",
        uk: "Швидкий старт із Selenium Docker",
      },
      paragraphs: [
        {
          en: "The easiest way to try this locally: run Selenium Grid as a Docker container. Selenium provides official images for standalone mode (hub + node together) and distributed mode (separate hub and nodes).",
          uk: "Найпростіший спосіб спробувати локально: запустити Selenium Grid як Docker-контейнер. Selenium надає офіційні образи для standalone режиму (hub + node разом) і розподіленого режиму (окремо hub і nodes).",
        },
      ],
      codeBlocks: [
        {
          id: "docker-standalone",
          language: "bash",
          code: `# Standalone режим — hub і node в одному контейнері
docker run -d -p 4444:4444 \\
  --shm-size="2g" \\
  -e SE_NODE_GRID_URL="http://localhost:4444" \\
  selenium/standalone-chromium:latest

# Потім запустити тести
SELENIUM_REMOTE_URL=http://localhost:4444 npx playwright test`,
        },
        {
          id: "docker-hub-nodes",
          language: "bash",
          code: `# Розподілений режим: окремий hub і node
docker run -d -p 4442-4444:4442-4444 --name selenium-hub selenium/hub:4.25.0

docker run -d \\
  --shm-size="2g" \\
  -e SE_EVENT_BUS_HOST=<hub-ip> \\
  -e SE_EVENT_BUS_PUBLISH_PORT=4442 \\
  -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 \\
  -e SE_NODE_GRID_URL="http://<hub-ip>:4444" \\
  selenium/node-chromium:4.25.0

# Запустити тести проти hub
SELENIUM_REMOTE_URL=http://<hub-ip>:4444 npx playwright test`,
        },
      ],
    },
    {
      id: "additional-options",
      title: {
        en: "Additional capabilities and headers",
        uk: "Додаткові capabilities і заголовки",
      },
      paragraphs: [
        {
          en: "For Grids that require extra capabilities (e.g., browser version pinning, OS selection) or authentication headers (e.g., cloud Grid services), I pass JSON-serialized values via environment variables:",
          uk: "Для Grid-ів що вимагають додаткові capabilities (наприклад, фіксацію версії браузера, вибір OS) або заголовки автентифікації (наприклад, хмарні Grid-сервіси) — передаю JSON-серіалізовані значення через змінні середовища:",
        },
      ],
      codeBlocks: [
        {
          id: "capabilities-and-headers",
          language: "bash",
          code: `# Додаткові capabilities (JSON)
SELENIUM_REMOTE_URL=http://grid:4444 \\
SELENIUM_REMOTE_CAPABILITIES='{"mygrid:options":{"os":"windows","browserVersion":"latest"}}' \\
npx playwright test

# Заголовки авторизації для хмарного Grid (BrowserStack, Sauce Labs тощо)
SELENIUM_REMOTE_URL=http://hub.browserstack.com/wd/hub \\
SELENIUM_REMOTE_HEADERS='{"Authorization":"Basic <base64-credentials>"}' \\
npx playwright test`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your team is migrating from Selenium to Playwright. You have 400 existing Playwright tests and a Selenium Grid already running in CI. What's the minimal change needed to run the Playwright tests against the existing Selenium Grid?",
        uk: "Команда мігрує з Selenium на Playwright. Є 400 існуючих Playwright-тестів і Selenium Grid вже запущений у CI. Яка мінімальна зміна потрібна щоб запустити Playwright-тести проти існуючого Selenium Grid?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Rewrite tests to use Selenium WebDriver API instead of Playwright API",
            uk: "Переписати тести щоб використовувати Selenium WebDriver API замість Playwright API",
          },
        },
        {
          id: "b",
          label: {
            en: "Set SELENIUM_REMOTE_URL env var pointing to the Grid Hub — no code changes needed",
            uk: "Встановити змінну середовища SELENIUM_REMOTE_URL вказуючи на Grid Hub — зміни коду не потрібні",
          },
        },
        {
          id: "c",
          label: {
            en: "Install the Selenium adapter package for Playwright",
            uk: "Встановити пакет адаптера Selenium для Playwright",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright detects the `SELENIUM_REMOTE_URL` environment variable at startup and automatically routes browser connections through the Selenium Grid instead of launching a local browser. No adapter, no code change — just the environment variable. The catch: this only works for Chrome and Edge (Playwright connects via Chrome DevTools Protocol, which Selenium 4 exposes). Firefox and WebKit tests will still need local browsers or a native Playwright remote server.",
        uk: "Playwright виявляє змінну середовища `SELENIUM_REMOTE_URL` при старті і автоматично маршрутизує підключення браузера через Selenium Grid замість запуску локального браузера. Без адаптера, без змін коду — лише змінна середовища. Нюанс: це працює лише для Chrome та Edge (Playwright підключається через Chrome DevTools Protocol який Selenium 4 надає). Тести Firefox і WebKit все одно потребуватимуть локальних браузерів або нативного Playwright remote server.",
      },
    },
  ],
}
