import type { PlaywrightTopic, TopicSequenceItem } from "../../types"

const projectsConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});`

const chromiumChannelConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
});`

const brandedConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});`

function seqText(en: string, uk: string): TopicSequenceItem {
  return { kind: "text", en, uk }
}

function seqCode(id: string, language: string, code: string): TopicSequenceItem {
  return { kind: "code", block: { id, language, code } }
}

export const browsersTopic: PlaywrightTopic = {
  slug: "browsers",
  groupId: "guides",
  order: 135,
  level: "advanced",
  trackOrder: 10,
  sourceDoc: "browsers.md",
  officialDocsUrl: "https://playwright.dev/docs/browsers",
  title: {
    en: "Browsers",
    uk: "Браузери",
  },
  summary: {
    en: "Playwright bundles its own browser builds — they're separate from anything you have installed. After every Playwright version bump I always run 'npx playwright install' again, otherwise tests run with mismatched binaries. The flag I use most often: '--with-deps' for CI runners that need OS-level libraries too.",
    uk: "Playwright постачає власні збірки браузерів — вони окремі від всього що у тебе встановлено. Після кожного оновлення версії Playwright завжди запускаю 'npx playwright install' знову, інакше тести виконуються з невідповідними бінарниками. Прапорець який використовую найчастіше: '--with-deps' для CI-runner-ів яким потрібні й системні бібліотеки.",
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
          en: "Each version of Playwright expects matching browser builds. Install them with the Playwright CLI (`npx playwright install`) so local runs and CI use the same binaries as your test package.",
          uk: "Кожна версія Playwright очікує відповідні збірки браузерів. Встановлюй їх через CLI Playwright (`npx playwright install`) щоб локальні запуски і CI використовували ті самі бінарники що й твій тестовий пакет.",
        },
        {
          en: "After upgrading `@playwright/test`, run `npx playwright install` again so browsers stay in sync.",
          uk: "Після оновлення `@playwright/test` запускай `npx playwright install` знову щоб браузери залишалися синхронізованими.",
        },
      ],
    },
    {
      id: "install-browsers",
      title: {
        en: "Install browsers",
        uk: "Встановлення браузерів",
      },
      sequence: [
        seqText(
          "Install the default browser bundle (Chromium, Firefox, WebKit) for your project:",
          "Встановити стандартний набір браузерів (Chromium, Firefox, WebKit) для проєкту:",
        ),
        seqCode("b-in-1", "bash", "npx playwright install"),
        seqText(
          "Install only one engine when you do not need the full set:",
          "Встановити тільки один рушій якщо повний набір не потрібен:",
        ),
        seqCode("b-in-2", "bash", "npx playwright install webkit"),
        seqText(
          "List supported browser names and installer flags:",
          "Переглянути підтримувані назви браузерів і прапорці інсталятора:",
        ),
        seqCode("b-in-3", "bash", "npx playwright install --help"),
      ],
    },
    {
      id: "install-system-dependencies",
      title: {
        en: "Install system dependencies",
        uk: "Встановлення системних залежностей",
      },
      sequence: [
        seqText(
          "On Linux CI runners, install OS packages Playwright needs (fonts, libraries). This is what '--with-deps' does — it's the shortcut I use on fresh agents:",
          "На Linux CI-runner-ах встановлювати пакети ОС які потрібні Playwright (шрифти, бібліотеки). Саме це робить '--with-deps' — це ярлик який я використовую на чистих агентах:",
        ),
        seqCode("b-sys-1", "bash", "npx playwright install-deps"),
        seqText(
          "Install dependencies for a single browser only:",
          "Встановити залежності тільки для одного браузера:",
        ),
        seqCode("b-sys-2", "bash", "npx playwright install-deps chromium"),
        seqText(
          "Install browsers and system dependencies in one step — what I always use on CI:",
          "Встановити браузери і системні залежності за одну команду — те що я завжди використовую на CI:",
        ),
        seqCode(
          "b-sys-3",
          "bash",
          "npx playwright install --with-deps chromium",
        ),
      ],
    },
    {
      id: "update-playwright-regularly",
      title: {
        en: "Keep Playwright and browsers in sync",
        uk: "Синхронізація Playwright і браузерів",
      },
      sequence: [
        seqText(
          "Bump the test runner, then reinstall browsers so versions match:",
          "Оновити тестовий раннер, потім перевстановити браузери щоб версії збігалися:",
        ),
        seqCode(
          "b-up-1",
          "bash",
          "npm install -D @playwright/test@latest\nnpx playwright install",
        ),
        seqText(
          "Print the CLI version you are on:",
          "Вивести версію CLI яку використовуєш:",
        ),
        seqCode("b-up-2", "bash", "npx playwright --version"),
      ],
    },
    {
      id: "configure-browsers",
      title: {
        en: "Configure browsers",
        uk: "Налаштування браузерів",
      },
      sequence: [
        seqText(
          "Playwright Test targets Chromium, WebKit, Firefox, emulated mobile profiles, and branded Chrome/Edge through **projects** in `playwright.config`. Device presets live in Playwright's device registry.",
          "Playwright Test націлюється на Chromium, WebKit, Firefox, емульовані мобільні профілі та фірмові Chrome/Edge через **projects** у `playwright.config`. Пресети пристроїв — у реєстрі пристроїв Playwright.",
        ),
        seqText(
          "### Example: multiple projects",
          "### Приклад: кілька проєктів",
        ),
        seqText(
          "Define one project per browser or device. Each entry sets `use` (and optional `channel` for branded builds):",
          "Один проєкт на браузер або пристрій. У кожному записі налаштовується `use` (і за потреби `channel` для фірмових збірок):",
        ),
        seqCode("b-cf-1", "typescript", projectsConfig),
        seqText(
          "Run every project (all browsers) from the CLI:",
          "Запустити всі проєкти (всі браузери) з CLI:",
        ),
        seqCode(
          "b-cf-2",
          "bash",
          "npx playwright test\n\nRunning 7 tests using 5 workers\n\n  ✓ [chromium] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [webkit] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Mobile Chrome] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Mobile Safari] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Google Chrome] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Microsoft Edge] › example.spec.ts:3:1 › basic test (2s)",
        ),
        seqText(
          "Run a single project by name:",
          "Запустити один проєкт за назвою:",
        ),
        seqCode(
          "b-cf-3",
          "bash",
          "npx playwright test --project=firefox\n\nRunning 1 test using 1 worker\n\n  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)",
        ),
        seqText(
          "### Chromium",
          "### Chromium",
        ),
        seqText(
          "For Chrome, Edge, and other Chromium-based browsers Playwright defaults to open-source Chromium builds. Chromium tip often tracks ahead of stable branded channels.",
          "Для Chrome, Edge та інших браузерів на Chromium Playwright за замовчуванням використовує збірки відкритого Chromium. Найсвіжіший Chromium часто випереджає стабільні фірмові канали.",
        ),
        seqText(
          "### Chromium: headless shell",
          "### Chromium: headless shell",
        ),
        seqText(
          "Headless runs can use the dedicated headless shell. On CI, if you only need that shell, save download time:",
          "Безінтерфейсні запуски можуть використовувати окремий headless shell. На CI якщо потрібен тільки він — скорочуй час завантаження:",
        ),
        seqCode(
          "b-cf-4",
          "bash",
          "npx playwright install --with-deps --only-shell",
        ),
        seqText(
          "### Chromium: new headless (`channel`)",
          "### Chromium: новий headless (`channel`)",
        ),
        seqText(
          "Opt into the newer headless stack with the `chromium` channel in config:",
          "Підключити новіший headless-стек через канал `chromium` у конфігурації:",
        ),
        seqCode("b-cf-5", "typescript", chromiumChannelConfig),
        seqText(
          "If you rely on that mode, skip downloading the legacy headless shell during install:",
          "Якщо покладаєшся на цей режим — пропускай завантаження старого headless shell при встановленні:",
        ),
        seqCode(
          "b-cf-6",
          "bash",
          "npx playwright install --with-deps --no-shell",
        ),
        seqText(
          "### Google Chrome and Microsoft Edge",
          "### Google Chrome і Microsoft Edge",
        ),
        seqText(
          "Playwright can drive locally installed Chrome or Edge (`chrome`, `msedge`, beta/dev/canary channels). It does not install them automatically — use `npx playwright install msedge` (or `chrome`) when you need the installer to fetch a branded build.",
          "Playwright може керувати локально встановленими Chrome або Edge (канали `chrome`, `msedge`, beta/dev/canary). Він не встановлює їх автоматично — використовуй `npx playwright install msedge` (або `chrome`) коли потрібно завантажити фірмову збірку.",
        ),
        seqCode("b-cf-7", "bash", "npx playwright install msedge"),
        seqText(
          "Point projects at branded channels when policy requires testing the same binaries users run:",
          "Налаштуй проєкти на фірмові канали коли політика вимагає тестувати ті самі бінарники що й у користувачів:",
        ),
        seqCode("b-cf-8", "typescript", brandedConfig),
        seqText(
          "### Firefox",
          "### Firefox",
        ),
        seqText(
          "Playwright bundles a recent Firefox stable build patched for automation. Stock Firefox installs are not used directly.",
          "Playwright постачає недавню збірку Firefox Stable з патчами для автоматизації. Звичайний встановлений Firefox напряму не використовується.",
        ),
        seqText(
          "### WebKit",
          "### WebKit",
        ),
        seqText(
          "Playwright's WebKit tracks upstream WebKit; it may differ slightly from consumer Safari builds. Use it for cross-engine coverage on macOS or Linux CI.",
          "WebKit у Playwright відстежує апстрим WebKit і може трохи відрізнятися від Safari для користувачів. Використовуй для крос-рушійного покриття на macOS або Linux CI.",
        ),
      ],
    },
    {
      id: "install-behind-a-firewall-or-a-proxy",
      title: {
        en: "Install behind a firewall or a proxy",
        uk: "Встановлення за файрволом або через проксі",
      },
      sequence: [
        seqText(
          "Playwright downloads browsers from Microsoft's CDN by default. Behind a corporate proxy, set `HTTPS_PROXY` before `npx playwright install`.",
          "Playwright завантажує браузери з CDN Microsoft за замовчуванням. За корпоративним проксі — встанови `HTTPS_PROXY` перед `npx playwright install`.",
        ),
        seqCode(
          "b-fw-1",
          "bash",
          "HTTPS_PROXY=https://192.0.2.1 npx playwright install",
        ),
        seqText(
          "Custom CA for TLS interception — point Node at your root bundle before installing:",
          "Власний CA при перехопленні TLS — вкажи Node на кореневий пакет сертифікатів перед встановленням:",
        ),
        seqCode(
          "b-fw-2",
          "bash",
          'export NODE_EXTRA_CA_CERTS="/path/to/cert.pem"',
        ),
        seqText(
          "Slow link to the CDN? Increase the download connection timeout (milliseconds):",
          "Повільне з'єднання з CDN? Збільш тайм-аут завантаження (мілісекунди):",
        ),
        seqCode(
          "b-fw-3",
          "bash",
          "PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=120000 npx playwright install",
        ),
        seqText(
          "When running `install-deps` with sudo on Linux, export proxy variables in the same root shell so apt sees them.",
          "Для `install-deps` з sudo в Linux — експортуй змінні проксі в тій самій root-сесії щоб apt їх бачив.",
        ),
        seqCode(
          "b-fw-4",
          "bash",
          "sudo HTTPS_PROXY=https://192.0.2.1 npx playwright install-deps",
        ),
      ],
    },
    {
      id: "managing-browser-binaries",
      title: {
        en: "Managing browser binaries",
        uk: "Керування бінарниками браузерів",
      },
      sequence: [
        seqText(
          "Caches live under `%USERPROFILE%\\AppData\\Local\\ms-playwright` (Windows), `~/Library/Caches/ms-playwright` (macOS), or `~/.cache/ms-playwright` (Linux). Check disk usage:",
          "Кеші: `%USERPROFILE%\\AppData\\Local\\ms-playwright` (Windows), `~/Library/Caches/ms-playwright` (macOS) або `~/.cache/ms-playwright` (Linux). Перевірити місце на диску:",
        ),
        seqCode(
          "b-mg-1",
          "bash",
          "du -hs ~/Library/Caches/ms-playwright/*\n281M  chromium-XXXXXX\n187M  firefox-XXXX\n180M  webkit-XXXX",
        ),
        seqText(
          "Share a single download directory across workspaces with `PLAYWRIGHT_BROWSERS_PATH`:",
          "Спільна тека завантажень для кількох workspaces — `PLAYWRIGHT_BROWSERS_PATH`:",
        ),
        seqCode(
          "b-mg-2",
          "bash",
          "PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers npx playwright install",
        ),
        seqText(
          "Point test runs at the same path:",
          "Направити запуски тестів у ту саму теку:",
        ),
        seqCode(
          "b-mg-3",
          "bash",
          "PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers npx playwright test",
        ),
        seqText(
          "### Hermetic install",
          "### Герметична інсталяція",
        ),
        seqText(
          "Keep binaries inside `node_modules` for reproducible CI caches:",
          "Тримати бінарники в `node_modules` для відтворюваних CI-кешів:",
        ),
        seqCode(
          "b-mg-4",
          "bash",
          "PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install",
        ),
        seqText(
          "### Skip browser downloads",
          "### Пропуск завантаження браузерів",
        ),
        seqText(
          "If browsers are provisioned elsewhere, skip the download step during installs:",
          "Якщо браузери надаються окремо — пропустити крок завантаження при встановленні:",
        ),
        seqCode(
          "b-mg-5",
          "bash",
          "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npx playwright install",
        ),
        seqText(
          "### List and uninstall",
          "### Перелік і видалення",
        ),
        seqCode("b-mg-6", "bash", "npx playwright install --list"),
        seqCode("b-mg-7", "bash", "npx playwright uninstall"),
        seqCode("b-mg-8", "bash", "npx playwright uninstall --all"),
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You update @playwright/test from 1.48 to 1.50. Your tests run but you see 'browserType.launch: Executable doesn't exist' errors. What did you miss?",
        uk: "Ти оновлюєш @playwright/test з 1.48 до 1.50. Тести запускаються але бачиш помилки 'browserType.launch: Executable doesn't exist'. Що ти пропустив?",
      },
      options: [
        { id: "a", label: { en: "The new version requires Node.js to be updated first.", uk: "Нова версія вимагає спочатку оновити Node.js." } },
        { id: "b", label: { en: "You forgot to run 'npx playwright install' after updating — each Playwright version expects matching browser builds that must be installed separately.", uk: "Ти забув запустити 'npx playwright install' після оновлення — кожна версія Playwright очікує відповідні збірки браузерів які треба встановити окремо." } },
        { id: "c", label: { en: "The browser was deleted by OS garbage collection — reinstall it through the system package manager.", uk: "Браузер видалено збирачем сміття ОС — перевстанови його через системний менеджер пакетів." } },
        { id: "d", label: { en: "The `playwright.config.ts` file needs to declare each browser explicitly.", uk: "Файл `playwright.config.ts` має явно оголошувати кожен браузер." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's browser binaries are versioned alongside the npm package. When you bump `@playwright/test`, the new version looks for a specific browser build hash that doesn't exist yet in your cache. Running `npx playwright install` downloads the matching builds. This is the most common mistake when updating Playwright.",
        uk: "Бінарники браузерів Playwright версіонуються разом з npm-пакетом. Коли ти оновлюєш `@playwright/test` — нова версія шукає конкретний хеш збірки браузера якого ще немає в кеші. Запуск `npx playwright install` завантажує відповідні збірки. Це найпоширеніша помилка при оновленні Playwright.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You need to run tests on a fresh Linux CI agent that has no OS-level fonts or media libraries. Which single command installs Playwright browsers AND all system dependencies?",
        uk: "Потрібно запустити тести на чистому Linux CI-агенті без системних шрифтів і медіабібліотек. Яка одна команда встановлює браузери Playwright І всі системні залежності?",
      },
      options: [
        { id: "a", label: { en: "`npx playwright install && npx playwright install-deps`", uk: "`npx playwright install && npx playwright install-deps`" } },
        { id: "b", label: { en: "`npx playwright install --with-deps chromium`", uk: "`npx playwright install --with-deps chromium`" } },
        { id: "c", label: { en: "`npx playwright install-deps --all`", uk: "`npx playwright install-deps --all`" } },
        { id: "d", label: { en: "`npx playwright setup --ci`", uk: "`npx playwright setup --ci`" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`npx playwright install --with-deps chromium` installs the Chromium browser binary AND all OS-level dependencies (fonts, media codecs, shared libraries) in one step. The `--with-deps` flag calls `install-deps` internally. You can replace `chromium` with `firefox`, `webkit`, or omit it to install all engines.",
        uk: "`npx playwright install --with-deps chromium` встановлює бінарник Chromium І всі системні залежності (шрифти, медіакодеки, shared-бібліотеки) за один крок. Прапор `--with-deps` викликає `install-deps` внутрішньо. Можна замінити `chromium` на `firefox`, `webkit` або пропустити щоб встановити всі рушії.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "How do you configure a project to run tests in the real Google Chrome browser (not Playwright's bundled Chromium)?",
        uk: "Як налаштувати проєкт для запуску тестів у реальному Google Chrome (не в bundled Chromium від Playwright)?",
      },
      options: [
        { id: "a", label: { en: "Set `browser: 'chrome'` in the project `use` block.", uk: "Встановити `browser: 'chrome'` в блоці `use` проєкту." } },
        { id: "b", label: { en: "Set `channel: 'chrome'` in the project `use` block.", uk: "Встановити `channel: 'chrome'` в блоці `use` проєкту." } },
        { id: "c", label: { en: "Pass `--browser=chrome` to the Playwright CLI.", uk: "Передати `--browser=chrome` у Playwright CLI." } },
        { id: "d", label: { en: "Set `executablePath: '/path/to/chrome'` in the project `use` block.", uk: "Встановити `executablePath: '/path/to/chrome'` в блоці `use` проєкту." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "In `playwright.config.ts` you add `channel: 'chrome'` in the project's `use` block (typically alongside a device preset). Playwright will then launch the locally installed Google Chrome rather than its bundled Chromium build. You may also need to run `npx playwright install chrome` to download it if not locally installed.",
        uk: "В `playwright.config.ts` додаєш `channel: 'chrome'` в блоці `use` проєкту (зазвичай поряд з пресетом пристрою). Playwright запустить локально встановлений Google Chrome замість власного bundled Chromium. Також може знадобитися `npx playwright install chrome` для завантаження якщо Chrome не встановлений локально.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install` do?",
        uk: "Що робить `PLAYWRIGHT_BROWSERS_PATH=0 npx playwright install`?",
      },
      options: [
        { id: "a", label: { en: "Skips downloading browsers entirely.", uk: "Пропускає завантаження браузерів повністю." } },
        { id: "b", label: { en: "Installs browsers into `node_modules` instead of the global cache — useful for hermetic CI caches.", uk: "Встановлює браузери в `node_modules` замість глобального кешу — корисно для відтворюваних CI-кешів." } },
        { id: "c", label: { en: "Installs zero browsers (empty install).", uk: "Встановлює нуль браузерів (порожнє встановлення)." } },
        { id: "d", label: { en: "Resets the browser cache to the default path.", uk: "Скидає кеш браузерів до шляху за замовчуванням." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Setting `PLAYWRIGHT_BROWSERS_PATH=0` tells Playwright to store browser binaries inside the `node_modules/.local-browsers` directory of the project rather than the global OS cache. This makes CI caching straightforward — you cache `node_modules` and get the browsers for free.",
        uk: "Встановлення `PLAYWRIGHT_BROWSERS_PATH=0` каже Playwright зберігати бінарники браузерів в директорії `node_modules/.local-browsers` проєкту замість глобального кешу ОС. Це спрощує CI-кешування — ти кешуєш `node_modules` і браузери отримуєш безплатно.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You are behind a corporate proxy that intercepts HTTPS traffic with a custom CA certificate. What must you export before running `npx playwright install`?",
        uk: "Ти за корпоративним проксі що перехоплює HTTPS-трафік з кастомним CA-сертифікатом. Що потрібно експортувати перед запуском `npx playwright install`?",
      },
      options: [
        { id: "a", label: { en: "`PLAYWRIGHT_CERT=/path/to/cert.pem`", uk: "`PLAYWRIGHT_CERT=/path/to/cert.pem`" } },
        { id: "b", label: { en: "`NODE_EXTRA_CA_CERTS=/path/to/cert.pem`", uk: "`NODE_EXTRA_CA_CERTS=/path/to/cert.pem`" } },
        { id: "c", label: { en: "`SSL_CERT_FILE=/path/to/cert.pem`", uk: "`SSL_CERT_FILE=/path/to/cert.pem`" } },
        { id: "d", label: { en: "`HTTPS_CERT=/path/to/cert.pem`", uk: "`HTTPS_CERT=/path/to/cert.pem`" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`NODE_EXTRA_CA_CERTS` is the standard Node.js environment variable for adding extra CA certificates to the trust store. Export it with the path to your PEM file before running `npx playwright install` so Node trusts the proxy's certificate when downloading browser binaries.",
        uk: "`NODE_EXTRA_CA_CERTS` — стандартна змінна середовища Node.js для додавання додаткових CA-сертифікатів до trust store. Експортуй її зі шляхом до PEM-файлу перед запуском `npx playwright install` щоб Node довіряв сертифікату проксі при завантаженні бінарників браузерів.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Playwright's bundled WebKit is slightly different from consumer Safari. What is the correct use case for Playwright's WebKit?",
        uk: "Bundled WebKit від Playwright трохи відрізняється від Safari для споживачів. Який правильний сценарій використання WebKit від Playwright?",
      },
      options: [
        { id: "a", label: { en: "It exactly replicates Safari on iPhone — use it for mobile Safari certification.", uk: "Він точно відтворює Safari на iPhone — використовуй для сертифікації mobile Safari." } },
        { id: "b", label: { en: "Cross-engine coverage on macOS or Linux CI — it lets you catch WebKit-specific bugs without requiring a macOS machine in your CI fleet.", uk: "Крос-рушійне покриття на macOS або Linux CI — дозволяє ловити WebKit-специфічні баги без потреби в macOS машині у CI-флоті." } },
        { id: "c", label: { en: "It is identical to desktop Safari — there is no meaningful difference.", uk: "Він ідентичний desktop Safari — немає суттєвої різниці." } },
        { id: "d", label: { en: "WebKit support is deprecated in Playwright — use Chrome instead.", uk: "Підтримка WebKit у Playwright deprecated — використовуй Chrome натомість." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's WebKit tracks upstream WebKit source and may differ slightly from consumer Safari builds (which include Apple-specific patches). Its value is cross-engine coverage — finding bugs that only occur in the WebKit rendering engine — especially on Linux CI where macOS Safari isn't available.",
        uk: "WebKit від Playwright відстежує upstream WebKit і може трохи відрізнятися від Safari для споживачів (який включає Apple-специфічні патчі). Його цінність — крос-рушійне покриття: знаходження багів що виникають лише в рушії WebKit — особливо на Linux CI де macOS Safari недоступний.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you install only the WebKit browser without also installing Chromium and Firefox?",
        uk: "Як встановити лише браузер WebKit без встановлення Chromium і Firefox?",
      },
      options: [
        { id: "a", label: { en: "`npx playwright install --only=webkit`", uk: "`npx playwright install --only=webkit`" } },
        { id: "b", label: { en: "`npx playwright install webkit`", uk: "`npx playwright install webkit`" } },
        { id: "c", label: { en: "`npx playwright install --browser webkit`", uk: "`npx playwright install --browser webkit`" } },
        { id: "d", label: { en: "`npx playwright install --skip=chromium,firefox`", uk: "`npx playwright install --skip=chromium,firefox`" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Pass the browser name as a positional argument: `npx playwright install webkit`. This downloads only the WebKit binary. You can similarly pass `chromium` or `firefox`. Without an argument, all three default engines are installed.",
        uk: "Передай назву браузера як позиційний аргумент: `npx playwright install webkit`. Це завантажує лише бінарник WebKit. Аналогічно можна передати `chromium` або `firefox`. Без аргументу встановлюються всі три рушії за замовчуванням.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want to run tests against multiple browsers and device profiles in one `npx playwright test` invocation. How do you configure this?",
        uk: "Хочеш запустити тести проти кількох браузерів і профілів пристроїв за одного виклику `npx playwright test`. Як це налаштувати?",
      },
      options: [
        { id: "a", label: { en: "Pass multiple `--browser` flags: `npx playwright test --browser=chromium --browser=firefox`.", uk: "Передати кілька прапорів `--browser`: `npx playwright test --browser=chromium --browser=firefox`." } },
        { id: "b", label: { en: "Define multiple entries in the `projects` array of `playwright.config.ts`, each with its own `use` block.", uk: "Визначити кілька записів у масиві `projects` у `playwright.config.ts`, кожен з власним блоком `use`." } },
        { id: "c", label: { en: "Create separate config files and merge them with `playwright.config.merge()`.", uk: "Створити окремі конфіг-файли і об'єднати їх через `playwright.config.merge()`." } },
        { id: "d", label: { en: "List browsers in `browsers: ['chromium', 'firefox', 'webkit']` in the top-level config.", uk: "Перелічити браузери в `browsers: ['chromium', 'firefox', 'webkit']` на верхньому рівні конфігу." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `projects` array in `playwright.config.ts` is the correct mechanism. Each project entry specifies a name and a `use` block containing the device/browser settings. Running `npx playwright test` executes all defined projects; `--project=<name>` selects a specific one. There is no `--browser` flag or `browsers` array key.",
        uk: "Масив `projects` у `playwright.config.ts` — правильний механізм. Кожен запис проєкту вказує ім'я і блок `use` з налаштуваннями пристрою/браузера. Запуск `npx playwright test` виконує всі визначені проєкти; `--project=<name>` обирає конкретний. Прапора `--browser` або ключа `browsers` не існує.",
      },
    },
  ],
}
