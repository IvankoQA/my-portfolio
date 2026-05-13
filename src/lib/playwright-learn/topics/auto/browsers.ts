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
  sourceDoc: "browsers.md",
  officialDocsUrl: "https://playwright.dev/docs/browsers",
  title: {
    en: "Browsers",
    uk: "Браузери",
  },
  summary: {
    en: "Install browser binaries with the Playwright CLI, align them with your `@playwright/test` version, and run tests across Chromium, WebKit, and Firefox from `playwright.config`.",
    uk: "Інсталюйте бінарники браузерів через CLI Playwright, узгоджуйте їх із версією `@playwright/test` і запускайте тести в Chromium, WebKit і Firefox через `playwright.config`.",
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
          uk: "Кожна версія Playwright очікує відповідні збірки браузерів. Інсталюйте їх через CLI Playwright (`npx playwright install`), щоб локальні запуски й CI використовували ті самі бінарники, що й ваш тестовий пакет.",
        },
        {
          en: "After upgrading `@playwright/test`, run `npx playwright install` again so browsers stay in sync.",
          uk: "Після оновлення `@playwright/test` знову виконайте `npx playwright install`, щоб браузери залишалися узгодженими.",
        },
      ],
    },
    {
      id: "install-browsers",
      title: {
        en: "Install browsers",
        uk: "Інсталяція браузерів",
      },
      sequence: [
        seqText(
          "Install the default browser bundle (Chromium, Firefox, WebKit) for your project:",
          "Інсталюйте типовий набір браузерів (Chromium, Firefox, WebKit) для проєкту:",
        ),
        seqCode("b-in-1", "bash", "npx playwright install"),
        seqText(
          "Install only one engine when you do not need the full set:",
          "Інсталюйте лише один рушій, якщо повний набір не потрібен:",
        ),
        seqCode("b-in-2", "bash", "npx playwright install webkit"),
        seqText(
          "List supported browser names and installer flags:",
          "Перегляньте підтримувані назви браузерів і прапорці інсталятора:",
        ),
        seqCode("b-in-3", "bash", "npx playwright install --help"),
      ],
    },
    {
      id: "install-system-dependencies",
      title: {
        en: "Install system dependencies",
        uk: "Інсталяція системних залежностей",
      },
      sequence: [
        seqText(
          "On Linux, install OS packages Playwright needs (fonts, libraries). Useful in CI images:",
          "У Linux інсталюйте системні пакети, які потрібні Playwright (шрифти, бібліотеки). Корисно для CI-образів:",
        ),
        seqCode("b-sys-1", "bash", "npx playwright install-deps"),
        seqText(
          "Install dependencies for a single browser only:",
          "Інсталюйте залежності лише для одного браузера:",
        ),
        seqCode("b-sys-2", "bash", "npx playwright install-deps chromium"),
        seqText(
          "Install browsers and system dependencies in one step (typical for fresh agents):",
          "За одну команду інсталюйте браузери й системні залежності (зручно для чистих агентів):",
        ),
        seqCode(
          "b-sys-3",
          "bash",
          "npx playwright install --with-deps chromium",
        ),
        seqText(
          "See [system requirements](https://playwright.dev/docs/intro#system-requirements) for supported operating systems.",
          "Див. [системні вимоги](https://playwright.dev/docs/intro#system-requirements) щодо підтримуваних ОС.",
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
          "Оновіть тестовий раннер, потім перевстановіть браузери, щоб версії збігалися:",
        ),
        seqCode(
          "b-up-1",
          "bash",
          "npm install -D @playwright/test@latest\nnpx playwright install",
        ),
        seqText(
          "Print the CLI version you are on:",
          "Виведіть версію CLI, якою користуєтеся:",
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
          "Playwright Test can target Chromium, WebKit, Firefox, emulated mobile profiles, and branded Chrome/Edge through **projects** in `playwright.config`. Device presets live in Playwright’s [device registry](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json).",
          "Playwright Test може націлюватися на Chromium, WebKit, Firefox, емульовані мобільні профілі та фірмові Chrome/Edge через **projects** у `playwright.config`. Пресети пристроїв — у [реєстрі пристроїв](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/deviceDescriptorsSource.json) Playwright.",
        ),
        seqText(
          "### Example: multiple projects",
          "### Приклад: кілька проєктів",
        ),
        seqText(
          "Define one project per browser or device. Each entry sets `use` (and optional `channel` for branded builds):",
          "Задайте один проєкт на браузер або пристрій. У кожному записі налаштовується `use` (і за потреби `channel` для фірмових збірок):",
        ),
        seqCode("b-cf-1", "typescript", projectsConfig),
        seqText(
          "Run every project (all browsers) from the CLI:",
          "Запустіть усі проєкти (усі браузери) з CLI:",
        ),
        seqCode(
          "b-cf-2",
          "bash",
          "npx playwright test\n\nRunning 7 tests using 5 workers\n\n  ✓ [chromium] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [webkit] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Mobile Chrome] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Mobile Safari] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Google Chrome] › example.spec.ts:3:1 › basic test (2s)\n  ✓ [Microsoft Edge] › example.spec.ts:3:1 › basic test (2s)",
        ),
        seqText(
          "Run a single project by name:",
          "Запустіть один проєкт за назвою:",
        ),
        seqCode(
          "b-cf-3",
          "bash",
          "npx playwright test --project=firefox\n\nRunning 1 test using 1 worker\n\n  ✓ [firefox] › example.spec.ts:3:1 › basic test (2s)",
        ),
        seqText(
          "In VS Code, use the Playwright sidebar: tick the browsers you want. Names match the `projects` array in your config (default template ships Chromium, Firefox, WebKit).",
          "У VS Code скористайтеся бічною панеллю Playwright: позначте потрібні браузери. Назви відповідають масиву `projects` у конфігурації (типовий шаблон — Chromium, Firefox, WebKit).",
        ),
        seqText(
          "![Projects section in VS Code extension](./images/vscode-projects-section.png)",
          "![Розділ проєктів у розширенні VS Code](./images/vscode-projects-section.png)",
        ),
        seqText(
          '',
          '',
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
          "Безінтерфейсні запуски можуть використовувати окремий headless shell. У CI, якщо потрібен лише він, зменште обсяг завантаження:",
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
          "Підключіть новіший headless-стек через канал `chromium` у конфігурації:",
        ),
        seqCode("b-cf-5", "typescript", chromiumChannelConfig),
        seqText(
          "If you rely on that mode, skip downloading the legacy headless shell during install:",
          "Якщо ви покладаєтеся на цей режим, під час інсталяції можна пропустити завантаження старого headless shell:",
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
          "Playwright can drive locally installed Chrome or Edge (`chrome`, `msedge`, beta/dev/canary channels). It does not install them automatically—use `npx playwright install msedge` (or `chrome`) when you need the installer to fetch a branded build.",
          "Playwright може керувати локально встановленими Chrome або Edge (канали `chrome`, `msedge`, beta/dev/canary). Він не інсталює їх автоматично — використовуйте `npx playwright install msedge` (або `chrome`), коли потрібно завантажити фірмову збірку через інсталятор.",
        ),
        seqText(
          "Install Microsoft Edge for testing if it is missing:",
          "Інсталюйте Microsoft Edge для тестів, якщо його немає:",
        ),
        seqCode("b-cf-7", "bash", "npx playwright install msedge"),
        seqText(
          "Point projects at branded channels when policy requires testing the same binaries users run:",
          "Налаштуйте проєкти на фірмові канали, якщо політика вимагає тестувати ті самі бінарники, що й у користувачів:",
        ),
        seqCode("b-cf-8", "typescript", brandedConfig),
        seqText(
          "### Firefox",
          "### Firefox",
        ),
        seqText(
          "Playwright bundles a recent Firefox stable build patched for automation. Stock Firefox installs are not used directly.",
          "Playwright постачає недавню збірку Firefox Stable з патчами для автоматизації. Звичайний інстальований Firefox напряму не використовується.",
        ),
        seqText(
          "### WebKit",
          "### WebKit",
        ),
        seqText(
          "Playwright’s WebKit tracks upstream WebKit; it may differ slightly from consumer Safari builds. Use it for cross-engine coverage on macOS or Linux CI.",
          "WebKit у Playwright відстежує апстрим WebKit і може трохи відрізнятися від Safari для користувачів. Використовуйте його для крос-рушійного покриття на macOS або Linux CI.",
        ),
      ],
    },
    {
      id: "install-behind-a-firewall-or-a-proxy",
      title: {
        en: "Install behind a firewall or a proxy",
        uk: "Інсталяція за файрволом або через проксі",
      },
      sequence: [
        seqText(
          "Playwright downloads browsers from Microsoft’s CDN by default. Behind a corporate proxy, set `HTTPS_PROXY` before `npx playwright install`.",
          "За замовчуванням Playwright завантажує браузери з CDN Microsoft. За корпоративним проксі задайте `HTTPS_PROXY` перед `npx playwright install`.",
        ),
        seqCode(
          "b-fw-1",
          "bash",
          "HTTPS_PROXY=https://192.0.2.1 npx playwright install",
        ),
        seqText(
          "Custom CA for TLS interception: point Node at your root bundle before installing:",
          "Власний CA при перехопленні TLS: вкажіть Node на кореневий пакет сертифікатів перед інсталяцією:",
        ),
        seqCode(
          "b-fw-2",
          "bash",
          'export NODE_EXTRA_CA_CERTS="/path/to/cert.pem"',
        ),
        seqText(
          "Slow link to the CDN? Increase the download connection timeout (milliseconds):",
          "Повільне з’єднання з CDN? Збільште тайм-аут завантаження (мілісекунди):",
        ),
        seqCode(
          "b-fw-3",
          "bash",
          "PLAYWRIGHT_DOWNLOAD_CONNECTION_TIMEOUT=120000 npx playwright install",
        ),
        seqText(
          "When running `install-deps` with sudo on Linux, export proxy variables in the same root shell so apt sees them.",
          "Для `install-deps` з sudo в Linux експортуйте змінні проксі в тій самій root-сесії, щоб apt їх бачив.",
        ),
        seqCode(
          "b-fw-4",
          "bash",
          "sudo HTTPS_PROXY=https://192.0.2.1 npx playwright install-deps",
        ),
      ],
    },
    {
      id: "download-from-artifact-repository",
      title: {
        en: "Download from an artifact mirror",
        uk: "Завантаження з дзеркала артефактів",
      },
      sequence: [
        seqText(
          "Host mirrors can override the CDN with `PLAYWRIGHT_DOWNLOAD_HOST` (or per-browser `PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST`, etc.):",
          "Дзеркала можуть замінити CDN через `PLAYWRIGHT_DOWNLOAD_HOST` (або окремі `PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST` тощо):",
        ),
        seqCode(
          "b-art-1",
          "bash",
          "PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 npx playwright install",
        ),
        seqText(
          "Combine host overrides when different engines are mirrored separately:",
          "Поєднайте хости, коли різні рушії дзеркаляться окремо:",
        ),
        seqCode(
          "b-art-2",
          "bash",
          "PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST=http://203.0.113.3 PLAYWRIGHT_DOWNLOAD_HOST=http://192.0.2.1 npx playwright install",
        ),
      ],
    },
    {
      id: "using-a-pre-installed-node-js",
      title: {
        en: "Using a pre-installed Node.js",
        uk: "Використання заздалегідь встановленого Node.js",
      },
      sequence: [
        seqText(
          "Playwright bundles a Node runtime for installer scripts. To force a specific system `node` binary, set `PLAYWRIGHT_NODEJS_PATH` before `npx playwright install`:",
          "Playwright постачає Node для інсталяційних скриптів. Щоб примусово використати системний `node`, задайте `PLAYWRIGHT_NODEJS_PATH` перед `npx playwright install`:",
        ),
        seqCode(
          "b-node-1",
          "bash",
          'PLAYWRIGHT_NODEJS_PATH="/usr/local/bin/node" npx playwright install',
        ),
        seqCode(
          "b-node-2",
          "batch",
          "set PLAYWRIGHT_NODEJS_PATH=C:\\Program Files\\nodejs\\node.exe\nnpx playwright install",
        ),
        seqCode(
          "b-node-3",
          "powershell",
          '$Env:PLAYWRIGHT_NODEJS_PATH="C:\\Program Files\\nodejs\\node.exe"\nnpx playwright install',
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
          "Кеші: `%USERPROFILE%\\AppData\\Local\\ms-playwright` (Windows), `~/Library/Caches/ms-playwright` (macOS) або `~/.cache/ms-playwright` (Linux). Перевірте місце на диску:",
        ),
        seqCode(
          "b-mg-1",
          "bash",
          "du -hs ~/Library/Caches/ms-playwright/*\n281M  chromium-XXXXXX\n187M  firefox-XXXX\n180M  webkit-XXXX",
        ),
        seqText(
          "Share a single download directory across workspaces with `PLAYWRIGHT_BROWSERS_PATH`:",
          "Спільна тека завантажень для кількох робочих просторів — `PLAYWRIGHT_BROWSERS_PATH`:",
        ),
        seqCode(
          "b-mg-2",
          "bash",
          "PLAYWRIGHT_BROWSERS_PATH=$HOME/pw-browsers npx playwright install",
        ),
        seqText(
          "Point test runs at the same path:",
          "Направте запуски тестів у ту саму теку:",
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
          "Тримайте бінарники в `node_modules` для відтворюваних кешів CI:",
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
          "Якщо браузери надаються окремо, пропустіть крок завантаження під час інсталяції:",
        ),
        seqCode(
          "b-mg-5",
          "bash",
          "PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npx playwright install",
        ),
        seqText(
          "### Garbage collection",
          "### Збирання сміття",
        ),
        seqText(
          "Playwright removes browser versions that no longer have referencing packages. Opt out with `PLAYWRIGHT_SKIP_BROWSER_GC=1` if you must keep every build.",
          "Playwright видаляє версії браузерів, на які більше не посилаються пакети. Щоб вимкнути очищення, задайте `PLAYWRIGHT_SKIP_BROWSER_GC=1`, якщо потрібно зберігати всі збірки.",
        ),
        seqText(
          "### List and uninstall",
          "### Перелік і видалення",
        ),
        seqText(
          "List everything Playwright sees on the machine, then remove only the current install or all installs:",
          "Перелічіть усе, що бачить Playwright на машині, потім видаліть лише поточну інсталяцію або всі:",
        ),
        seqCode("b-mg-6", "bash", "npx playwright install --list"),
        seqCode("b-mg-7", "bash", "npx playwright uninstall"),
        seqCode("b-mg-8", "bash", "npx playwright uninstall --all"),
      ],
    },
  ],
  quiz: [],
}
