import type { PlaywrightTopic } from "../../types"

export const testWebserverTopic: PlaywrightTopic = {
  slug: "test-webserver",
  groupId: "test-runner",
  order: 400,
  level: "intermediate",
  trackOrder: 10,
  sourceDoc: "test-webserver-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-webserver",
  title: {
    en: "Web server",
    uk: "Вебсервер",
  },
  summary: {
    en: "The webServer option in playwright.config.ts starts your dev server before any test runs and kills it after. The setting I always set: reuseExistingServer: !process.env.CI — locally it reuses my already-running 'npm run dev' so tests start instantly, on CI it always starts fresh.",
    uk: "Опція webServer у playwright.config.ts запускає dev-сервер перед будь-яким тестом і вбиває його після. Налаштування яке я завжди встановлюю: reuseExistingServer: !process.env.CI — локально перевикористовує вже запущений 'npm run dev' щоб тести стартували миттєво, на CI завжди стартує з нуля.",
  },
  sections: [
    {
      id: "basic-setup",
      title: {
        en: "Basic setup — start a dev server for all tests",
        uk: "Базове налаштування — запуск dev-сервера для всіх тестів",
      },
      diagram: {
        mermaid: `sequenceDiagram
  participant PW as Playwright
  participant SRV as Dev server
  participant T as Tests
  PW->>SRV: npm run start
  loop poll every 100ms
    PW->>SRV: GET http://localhost:3000
    SRV-->>PW: 2xx/3xx?
  end
  Note over PW,SRV: server ready (or timeout after 60s)
  PW->>T: run tests
  T->>SRV: requests
  SRV-->>T: responses`,
        caption: {
          en: "Playwright starts the server and polls the url until it responds — tests only run after the server is ready",
          uk: "Playwright запускає сервер і опитує url поки той не відповість — тести запускаються лише після готовності сервера",
        },
      },
      paragraphs: [
        {
          en: "I add `webServer` when writing tests against a local app that isn't deployed anywhere yet. Playwright waits for the `url` to return a 2xx/3xx response before running the first test. If the server doesn't respond within `timeout` milliseconds, tests fail with a clear error.",
          uk: "Додаю `webServer` коли пишу тести проти локального застосунку який ще нікуди не задеплоєний. Playwright чекає поки `url` поверне 2xx/3xx відповідь перед запуском першого тесту. Якщо сервер не відповідає протягом `timeout` мілісекунд — тести падають з чіткою помилкою.",
        },
        {
          en: "`reuseExistingServer: !process.env.CI` is the key setting. Locally: if my dev server is already running (which it usually is), Playwright just uses it without starting a new one — tests start in seconds. On CI: `CI` is set, so `!process.env.CI` is `false`, Playwright always starts fresh.",
          uk: "`reuseExistingServer: !process.env.CI` — ключове налаштування. Локально: якщо dev-сервер вже запущений (що зазвичай так), Playwright просто використовує його без запуску нового — тести стартують за секунди. На CI: `CI` встановлено, тому `!process.env.CI` це `false`, Playwright завжди стартує з нуля.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-webserver",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
})`,
        },
      ],
    },
    {
      id: "slow-server",
      title: {
        en: "Slow server — increase timeout",
        uk: "Повільний сервер — збільшити тайм-аут",
      },
      paragraphs: [
        {
          en: "The default timeout is 60 seconds. For Next.js or other frameworks that do a full build on first start, I bump this to 120 seconds. On CI with a slow runner it can take even longer.",
          uk: "Стандартний тайм-аут — 60 секунд. Для Next.js або інших фреймворків що роблять повну збірку при першому старті — збільшую до 120 секунд. На CI з повільним runner-ом може займати ще довше.",
        },
      ],
      codeBlocks: [
        {
          id: "timeout-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,  // 2 хвилини замість 1
  },
})`,
        },
      ],
    },
    {
      id: "wait-for-output",
      title: {
        en: "Wait for server output instead of URL",
        uk: "Чекати на вивід сервера замість URL",
      },
      paragraphs: [
        {
          en: "Sometimes the URL check isn't the right signal — the server responds 200 before the database connection is ready. The `wait` option waits for a specific string in stdout or stderr instead. Named capture groups in the regex get stored as environment variables.",
          uk: "Іноді перевірка URL — не правильний сигнал: сервер відповідає 200 до того як готове підключення до бази даних. Опція `wait` чекає на конкретний рядок у stdout або stderr замість URL. Іменовані групи захоплення в regex зберігаються як змінні середовища.",
        },
      ],
      codeBlocks: [
        {
          id: "wait-output",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  webServer: {
    command: 'npm run start',
    wait: {
      // Чекати поки сервер виведе цей рядок в stdout
      stdout: /Server ready on port (?<port>\\d+)/,
    },
    // Якщо задані і url і wait — сервер вважається готовим
    // коли виконується хоча б одна умова
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})`,
        },
      ],
    },
    {
      id: "multiple-servers",
      title: {
        en: "Multiple servers — frontend + backend",
        uk: "Кілька серверів — frontend + backend",
      },
      paragraphs: [
        {
          en: "For projects where the frontend and backend run on different ports, I pass an array. Each server gets a `name` that prefixes its log output — makes it easy to see which server printed what in CI logs.",
          uk: "Для проєктів де frontend і backend запускаються на різних портах — передаю масив. Кожен сервер отримує `name` який префіксує його лог-вивід — дозволяє легко бачити який сервер що надрукував у CI-логах.",
        },
      ],
      codeBlocks: [
        {
          id: "multiple-servers-config",
          language: "ts",
          code: `// playwright.config.ts — frontend + backend разом
export default defineConfig({
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:3000',
      name: 'Frontend',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run backend',
      url: 'http://localhost:3333',
      name: 'Backend',
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
  use: {
    baseURL: 'http://localhost:3000',
  },
})`,
        },
      ],
    },
    {
      id: "using-with-baseur",
      title: {
        en: "Pairing webServer with baseURL",
        uk: "Поєднання webServer з baseURL",
      },
      paragraphs: [
        {
          en: "I always pair `webServer` with `baseURL` in the `use` section. Without `baseURL`, every `page.goto()` needs the full URL. With it, I write `page.goto('/orders')` and Playwright prepends `http://localhost:3000` automatically.",
          uk: "Завжди пов'язую `webServer` з `baseURL` у секції `use`. Без `baseURL` кожен `page.goto()` потребує повного URL. З ним пишу `page.goto('/orders')` і Playwright автоматично додає `http://localhost:3000`.",
        },
      ],
      codeBlocks: [
        {
          id: "baseur-usage",
          language: "ts",
          code: `// У тестах після налаштування webServer + baseURL
test('orders page loads', async ({ page }) => {
  await page.goto('/orders')  // → http://localhost:3000/orders
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
})

test('dashboard shows metrics', async ({ page }) => {
  await page.goto('/dashboard')  // → http://localhost:3000/dashboard
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You set reuseExistingServer: !process.env.CI in your webServer config. A teammate runs the tests locally without starting the dev server first. What happens?",
        uk: "Ти встановив reuseExistingServer: !process.env.CI у конфігурації webServer. Колега запускає тести локально без попереднього запуску dev-сервера. Що відбувається?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Tests fail immediately with 'connection refused' because no server is running",
            uk: "Тести одразу падають з 'connection refused' бо немає запущеного сервера",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright starts the dev server automatically using the configured command, waits for it to be ready, then runs tests",
            uk: "Playwright автоматично запускає dev-сервер використовуючи налаштовану команду, чекає поки він буде готовий, потім запускає тести",
          },
        },
        {
          id: "c",
          label: {
            en: "Tests are skipped because the server isn't available",
            uk: "Тести пропускаються бо сервер недоступний",
          },
        },
        {
          id: "d",
          label: {
            en: "Playwright tries to reuse the server, fails, and asks the user to start it manually",
            uk: "Playwright намагається перевикористати сервер, зазнає невдачі і просить користувача запустити його вручну",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`reuseExistingServer: true` means: if a server is already on that URL/port, reuse it; if not, start one. `reuseExistingServer: false` means: always start one and fail if the port is already occupied. `!process.env.CI` evaluates to `true` locally (CI env var isn't set), so locally it reuses if available OR starts if not. On CI it's `false` — always starts fresh. So your teammate is fine: Playwright runs `npm run start`, waits for the URL to respond, then starts tests.",
        uk: "`reuseExistingServer: true` означає: якщо сервер вже є на тому URL/порту — перевикористай; якщо ні — запусти. `reuseExistingServer: false` означає: завжди запускай новий і падай якщо порт вже зайнятий. `!process.env.CI` на локалі дає `true` (змінна CI не встановлена), тому локально перевикористовує якщо є АБО запускає якщо немає. На CI — `false`, завжди стартує з нуля. Тому колега нормально: Playwright запускає `npm run start`, чекає відповіді URL, потім стартує тести.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Your Next.js app takes 90 seconds to compile on the first start. Tests fail with a timeout error before the server is ready. What do you change?",
        uk: "Твій Next.js-застосунок компілюється 90 секунд при першому запуску. Тести падають з помилкою тайм-ауту до того як сервер готовий. Що змінюєш?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Increase the test timeout in playwright.config.ts — the server timeout is linked to the test timeout",
            uk: "Збільш тайм-аут тесту в playwright.config.ts — тайм-аут сервера пов'язаний з тайм-аутом тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "Add timeout: 120 * 1000 to the webServer config — the default is 60 seconds",
            uk: "Додай timeout: 120 * 1000 до конфігурації webServer — за замовчуванням 60 секунд",
          },
        },
        {
          id: "c",
          label: {
            en: "Set reuseExistingServer: true so tests wait indefinitely for the server",
            uk: "Встанови reuseExistingServer: true щоб тести чекали на сервер нескінченно",
          },
        },
        {
          id: "d",
          label: {
            en: "Use wait: { stdout: /ready/i } instead of url — stdout matching has no timeout",
            uk: "Використовуй wait: { stdout: /ready/i } замість url — зіставлення stdout не має тайм-ауту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `webServer.timeout` option (in milliseconds) controls how long Playwright waits for the server URL to respond before failing. The default is 60,000 ms (60 seconds). For slow servers like Next.js doing a full build, set `timeout: 120 * 1000` or higher. The test timeout and server startup timeout are independent settings. `reuseExistingServer: true` doesn't create an indefinite wait — it still times out after the configured `timeout`.",
        uk: "Опція `webServer.timeout` (у мілісекундах) контролює скільки Playwright чекає поки URL сервера відповість перед тим як впасти. За замовчуванням 60 000 мс (60 секунд). Для повільних серверів як Next.js що робить повну збірку — встанови `timeout: 120 * 1000` або більше. Тайм-аут тесту і тайм-аут запуску сервера — незалежні налаштування. `reuseExistingServer: true` не створює нескінченного очікування — він все одно завершується після налаштованого `timeout`.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Your server responds 200 to the health check URL immediately, but the database connection isn't ready for another 5 seconds — causing test failures. What webServer option handles this?",
        uk: "Твій сервер відповідає 200 на URL перевірки здоров'я відразу, але підключення до бази даних готове лише через 5 секунд — що спричиняє падіння тестів. Яка опція webServer це вирішує?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add a sleep of 5 seconds at the start of each test",
            uk: "Додай sleep на 5 секунд на початку кожного тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "Use the wait option with a stdout/stderr regex pattern — Playwright waits for that string to appear in server output before starting tests",
            uk: "Використовуй опцію wait зі шаблоном regex для stdout/stderr — Playwright чекає появи цього рядка у виводі сервера перед запуском тестів",
          },
        },
        {
          id: "c",
          label: {
            en: "Set a delay option: delay: 5000 in the webServer config",
            uk: "Встанови опцію delay: delay: 5000 у конфігурації webServer",
          },
        },
        {
          id: "d",
          label: {
            en: "Configure retries: 3 in playwright.config.ts so tests retry until the database is ready",
            uk: "Налаштуй retries: 3 у playwright.config.ts щоб тести повторювалися поки база даних не готова",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `wait` option in `webServer` lets you wait for a specific string in stdout or stderr instead of (or in addition to) a URL check. When the server logs 'Database connection established' or 'Server ready', you can match that with a regex: `wait: { stdout: /Database connection established/ }`. This is more reliable than the URL check when the app has multi-stage initialization. Named capture groups in the regex are stored as environment variables for tests to use.",
        uk: "Опція `wait` у `webServer` дозволяє чекати на конкретний рядок у stdout або stderr замість (або на додаток до) перевірки URL. Коли сервер логує 'Database connection established' або 'Server ready' — можна зіставити це з regex: `wait: { stdout: /Database connection established/ }`. Це надійніше за перевірку URL коли застосунок має багатоетапну ініціалізацію. Іменовані групи захоплення в regex зберігаються як змінні середовища для використання в тестах.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "Your project has a React frontend on port 3000 and a Node API on port 4000. Both need to be running before tests start. How do you configure this?",
        uk: "Твій проєкт має React-frontend на порту 3000 і Node API на порту 4000. Обидва мають бути запущені перед початком тестів. Як це налаштувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add a pre-test script in package.json that starts both servers",
            uk: "Додай pre-test скрипт у package.json що запускає обидва сервери",
          },
        },
        {
          id: "b",
          label: {
            en: "Set webServer to an array of two config objects, one for each server",
            uk: "Встанови webServer як масив двох об'єктів конфігурації, по одному для кожного сервера",
          },
        },
        {
          id: "c",
          label: {
            en: "Use a single webServer config with command: 'npm run frontend & npm run api'",
            uk: "Використовуй одну конфігурацію webServer з command: 'npm run frontend & npm run api'",
          },
        },
        {
          id: "d",
          label: {
            en: "Create two playwright.config.ts files and run them sequentially",
            uk: "Створи два файли playwright.config.ts і запускай їх послідовно",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When `webServer` is set to an array, Playwright starts all servers in parallel and waits for each one to be ready before running tests. Each server config can have its own `command`, `url`, `timeout`, `reuseExistingServer`, and `name` (which prefixes log output for easy identification). Using `&` in a single command works but gives you one shared timeout and no separate log prefixes. The array approach is cleaner and more configurable.",
        uk: "Коли `webServer` встановлено як масив — Playwright запускає всі сервери паралельно і чекає поки кожен буде готовий перед запуском тестів. Кожна конфігурація сервера може мати власні `command`, `url`, `timeout`, `reuseExistingServer` і `name` (який префіксує лог-вивід для легкої ідентифікації). Використання `&` в одній команді працює але дає один спільний тайм-аут і немає окремих префіксів логів. Підхід з масивом чистіший і більш налаштовуваний.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "After setting up webServer pointing to localhost:3000, your tests still use `await page.goto('http://localhost:3000/orders')` with the full URL. What simpler pattern does Playwright support?",
        uk: "Після налаштування webServer що вказує на localhost:3000, твої тести все ще використовують `await page.goto('http://localhost:3000/orders')` з повним URL. Який простіший шаблон підтримує Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set baseURL in the use section — page.goto('/orders') automatically prepends it",
            uk: "Встанови baseURL у секції use — page.goto('/orders') автоматично додає його на початок",
          },
        },
        {
          id: "b",
          label: {
            en: "Use page.goto({ path: '/orders' }) to separate origin from path",
            uk: "Використовуй page.goto({ path: '/orders' }) щоб відокремити origin від шляху",
          },
        },
        {
          id: "c",
          label: {
            en: "Declare SERVER_URL in process.env and reference it in each goto",
            uk: "Оголоси SERVER_URL у process.env і посилайся на нього в кожному goto",
          },
        },
        {
          id: "d",
          label: {
            en: "webServer automatically sets baseURL — no extra config needed",
            uk: "webServer автоматично встановлює baseURL — додаткова конфігурація не потрібна",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "Setting `use: { baseURL: 'http://localhost:3000' }` lets you write `page.goto('/orders')` instead of the full URL. Playwright prepends `baseURL` to any relative path passed to `goto`. `webServer` and `baseURL` are separate settings — configuring `webServer` does NOT automatically set `baseURL`. Always set both: `webServer` for starting the server, `use.baseURL` for relative navigation in tests.",
        uk: "Встановлення `use: { baseURL: 'http://localhost:3000' }` дозволяє писати `page.goto('/orders')` замість повного URL. Playwright додає `baseURL` на початок будь-якого відносного шляху переданого в `goto`. `webServer` і `baseURL` — окремі налаштування: налаштування `webServer` НЕ встановлює автоматично `baseURL`. Завжди встановлюй обидва: `webServer` для запуску сервера, `use.baseURL` для відносної навігації в тестах.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "On CI, what happens if the port that `webServer` is configured to use is already occupied by another process?",
        uk: "На CI що відбувається якщо порт налаштований для `webServer` вже зайнятий іншим процесом?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Playwright automatically picks the next available port",
            uk: "Playwright автоматично вибирає наступний доступний порт",
          },
        },
        {
          id: "b",
          label: {
            en: "The test run fails with an error because reuseExistingServer: false (CI) means always start fresh — a port conflict is fatal",
            uk: "Запуск тестів падає з помилкою бо reuseExistingServer: false (CI) означає завжди стартувати з нуля — конфлікт портів фатальний",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright kills the existing process and starts the configured server",
            uk: "Playwright вбиває існуючий процес і запускає налаштований сервер",
          },
        },
        {
          id: "d",
          label: {
            en: "Playwright reuses the existing server regardless of reuseExistingServer",
            uk: "Playwright перевикористовує існуючий сервер незалежно від reuseExistingServer",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`reuseExistingServer: false` (the CI value from `!process.env.CI`) means Playwright always tries to start the server with the configured `command`. If the port is already occupied, the server process fails to bind and Playwright reports a startup error — it does not kill existing processes or pick a new port. This is usually not a problem on CI where each job starts with a clean environment, but it can occur if a previous job leaked a process.",
        uk: "`reuseExistingServer: false` (значення CI з `!process.env.CI`) означає Playwright завжди намагається запустити сервер налаштованою `command`. Якщо порт вже зайнятий — процес сервера не може підключитися і Playwright повідомляє про помилку запуску: він не вбиває існуючі процеси і не вибирає новий порт. Зазвичай це не проблема на CI де кожна задача починається з чистого середовища але може виникнути якщо попередня задача залишила процес.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What does `stdout: 'ignore', stderr: 'pipe'` in the webServer config do?",
        uk: "Що робить `stdout: 'ignore', stderr: 'pipe'` у конфігурації webServer?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Suppresses all server output to keep CI logs clean",
            uk: "Пригнічує весь вивід сервера щоб CI-логи були чистими",
          },
        },
        {
          id: "b",
          label: {
            en: "Discards normal server output (stdout) but forwards error output (stderr) to the terminal — so startup errors are visible but routine logs are hidden",
            uk: "Відкидає звичайний вивід сервера (stdout) але перенаправляє вивід помилок (stderr) в термінал — тому помилки запуску видимі але звичайні логи приховані",
          },
        },
        {
          id: "c",
          label: {
            en: "Captures server output to a file for later analysis",
            uk: "Захоплює вивід сервера у файл для подальшого аналізу",
          },
        },
        {
          id: "d",
          label: {
            en: "Redirects server logs to the Playwright test output for each test",
            uk: "Перенаправляє логи сервера у тестовий вивід Playwright для кожного тесту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Dev servers are noisy — webpack/vite logs on every rebuild, Next.js prints build output. `stdout: 'ignore'` hides that routine chatter. `stderr: 'pipe'` keeps error output visible — if the server fails to start or crashes, the error message appears in the Playwright output. This is the recommended CI configuration: quiet unless something goes wrong. `stdout: 'pipe'` is useful locally when debugging server startup issues.",
        uk: "Dev-сервери шумні — webpack/vite логує кожну перебудову, Next.js виводить результати збірки. `stdout: 'ignore'` приховує цей звичайний галас. `stderr: 'pipe'` зберігає видимість виводу помилок — якщо сервер не може запуститися або падає, повідомлення про помилку з'являється у виводі Playwright. Це рекомендована конфігурація CI: тиха якщо щось не йде не так. `stdout: 'pipe'` корисний локально при дебагу проблем запуску сервера.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Where is the recommended place to read environment variables set by the webServer's `wait` regex named capture groups?",
        uk: "Де рекомендоване місце для читання змінних середовища встановлених іменованими групами захоплення regex у `wait` webServer?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "In playwright.config.ts after the webServer declaration",
            uk: "У playwright.config.ts після оголошення webServer",
          },
        },
        {
          id: "b",
          label: {
            en: "In test files via process.env — the variables are available to all tests after the server starts",
            uk: "У файлах тестів через process.env — змінні доступні всім тестам після запуску сервера",
          },
        },
        {
          id: "c",
          label: {
            en: "In globalSetup — it runs before tests and has access to webServer output",
            uk: "У globalSetup — він виконується перед тестами і має доступ до виводу webServer",
          },
        },
        {
          id: "d",
          label: {
            en: "In the webServer itself — named groups are only accessible within the webServer config",
            uk: "У самому webServer — іменовані групи доступні лише в конфігурації webServer",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Named capture groups in the `wait.stdout` or `wait.stderr` regex are extracted and set as `process.env` variables. For example, `wait: { stdout: /listening on port (?<PORT>\\d+)/ }` sets `process.env.PORT` to the matched port number. Tests can then read `process.env.PORT` normally. This is useful when the server binds to a dynamic port and you need tests to know the actual port at runtime.",
        uk: "Іменовані групи захоплення в regex `wait.stdout` або `wait.stderr` витягуються і встановлюються як змінні `process.env`. Наприклад, `wait: { stdout: /listening on port (?<PORT>\\d+)/ }` встановлює `process.env.PORT` на захоплений номер порту. Тести потім можуть читати `process.env.PORT` звичайним чином. Це корисно коли сервер підключається до динамічного порту і потрібно щоб тести знали фактичний порт під час виконання.",
      },
    },
  ],
}
