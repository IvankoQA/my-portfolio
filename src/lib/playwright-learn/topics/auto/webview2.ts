import type { PlaywrightTopic } from "../../types"

export const webview2Topic: PlaywrightTopic = {
  slug: "webview2",
  groupId: "integrations",
  order: 430,
  level: "advanced",
  trackOrder: 23,
  sourceDoc: "webview2.md",
  officialDocsUrl: "https://playwright.dev/docs/webview2",
  title: {
    en: "WebView2",
    uk: "WebView2",
  },
  summary: {
    en: "If you're testing a Windows desktop app that embeds a browser via WebView2 — Playwright connects to it over CDP. One environment variable enables the debug port, then connectOverCDP() gives you a Page object with the full Playwright API. The tricky part is parallel isolation: WebView2 reuses one user data directory by default, so parallel workers collide. Fix: a custom browser fixture that assigns each worker a unique CDP port and data directory.",
    uk: "Якщо тестуєш Windows-застосунок що вбудовує браузер через WebView2 — Playwright підключається до нього через CDP. Одна змінна середовища вмикає debug-порт, потім connectOverCDP() дає об'єкт Page з повним Playwright API. Складна частина: паралельна ізоляція. WebView2 перевикористовує один user data directory за замовчуванням, тому паралельні воркери конфліктують. Рішення: кастомна browser-фікстура що призначає кожному воркеру унікальний CDP-порт і data directory.",
  },
  sections: [
    {
      id: "enabling-cdp",
      title: {
        en: "Enabling the CDP debug port",
        uk: "Увімкнення CDP debug-порту",
      },
      paragraphs: [
        {
          en: "WebView2 listens for CDP connections only when the remote debugging port is enabled. There are two ways to set it — via environment variable or programmatically in the app code.",
          uk: "WebView2 слухає CDP-з'єднання лише коли увімкнений remote debugging порт. Є два способи: через змінну середовища або програмно в коді застосунку.",
        },
        {
          en: "The environment variable approach doesn't require code changes — useful for CI or when I don't control the app source:\n```\nWEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222\n```\n\nThe programmatic approach — call `EnsureCoreWebView2Async` with the debug flag, then listen for the initialization completed event to know when the control is ready:",
          uk: "Підхід через змінну середовища не потребує змін коду — корисно для CI або коли не контролюю вихідний код:\n```\nWEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9222\n```\n\nПрограмний підхід — викликати `EnsureCoreWebView2Async` з debug-прапором, потім слухати подію завершення ініціалізації щоб знати коли контрол готовий:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "csharp",
          code: `await this.webView.EnsureCoreWebView2Async(await CoreWebView2Environment.CreateAsync(null, null, new CoreWebView2EnvironmentOptions()
{
  AdditionalBrowserArguments = "--remote-debugging-port=9222",
})).ConfigureAwait(false);`,
        },
        {
          id: "cb-7",
          language: "csharp",
          code: `this.webView.CoreWebView2InitializationCompleted += (_, e) =>
{
    if (e.IsSuccess)
    {
        Console.WriteLine("WebView2 initialized");
    }
};`,
        },
      ],
    },
    {
      id: "connecting",
      title: {
        en: "Connecting Playwright via CDP",
        uk: "Підключення Playwright через CDP",
      },
      paragraphs: [
        {
          en: "Once the WebView2 app is running with the debug port open, I connect Playwright to it. The connection gives me an existing `BrowserContext` and `Page` — there's no `launch()` here, the app is already running.",
          uk: "Коли WebView2-застосунок запущено з відкритим debug-портом — підключаю Playwright до нього. З'єднання дає мені вже існуючий `BrowserContext` і `Page` — тут немає `launch()`, застосунок вже запущений.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "js",
          code: `const browser = await playwright.chromium.connectOverCDP('http://localhost:9222')
const context = browser.contexts()[0]
const page = context.pages()[0]`,
        },
      ],
    },
    {
      id: "parallel-isolation",
      title: {
        en: "Running tests in parallel — the isolation problem",
        uk: "Паралельні тести — проблема ізоляції",
      },
      paragraphs: [
        {
          en: "WebView2's default: all instances share the same user data directory. Run two workers simultaneously and they stomp on each other's sessions. The fix is a custom `browser` fixture that:\n1. Assigns each worker a unique CDP port (based on `workerIndex`)\n2. Sets `WEBVIEW2_USER_DATA_FOLDER` to a unique temp directory per worker\n3. Spawns the WebView2 process and waits for the \"initialized\" signal on stdout\n4. Connects via `connectOverCDP` and tears everything down after the test",
          uk: "WebView2 за замовчуванням: всі екземпляри спільно використовують один user data directory. Запусти двох воркерів одночасно — вони затирають одне одного. Рішення: кастомна `browser`-фікстура що:\n1. Призначає кожному воркеру унікальний CDP-порт (на основі `workerIndex`)\n2. Встановлює `WEBVIEW2_USER_DATA_FOLDER` в унікальну temp-директорію для кожного воркера\n3. Запускає процес WebView2 і чекає сигнал \"initialized\" у stdout\n4. Підключається через `connectOverCDP` і прибирає все після тесту",
        },
      ],
      codeBlocks: [
        {
          id: "cb-8",
          language: "js",
          code: `const EXECUTABLE_PATH = path.join(
    __dirname,
    '../../webview2-app/bin/Debug/net8.0-windows/webview2.exe',
);

export const test = base.extend({
  browser: async ({ playwright }, use, testInfo) => {
    const cdpPort = 10000 + testInfo.workerIndex;
    fs.accessSync(EXECUTABLE_PATH, fs.constants.X_OK);
    const userDataDir = path.join(
        fs.realpathSync.native(os.tmpdir()),
        \`playwright-webview2-tests/user-data-dir-\${testInfo.workerIndex}\`,
    );
    const webView2Process = childProcess.spawn(EXECUTABLE_PATH, [], {
      shell: true,
      env: {
        ...process.env,
        WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: \`--remote-debugging-port=\${cdpPort}\`,
        WEBVIEW2_USER_DATA_FOLDER: userDataDir,
      }
    });
    await new Promise(resolve => webView2Process.stdout.on('data', data => {
      if (data.toString().includes('WebView2 initialized'))
        resolve();
    }));
    const browser = await playwright.chromium.connectOverCDP(\`http://127.0.0.1:\${cdpPort}\`);
    await use(browser);
    await browser.close();
    childProcess.execSync(\`taskkill /pid \${webView2Process.pid} /T /F\`);
    fs.rmdirSync(userDataDir, { recursive: true });
  },
  context: async ({ browser }, use) => {
    const context = browser.contexts()[0];
    await use(context);
  },
  page: async ({ context }, use) => {
    const page = context.pages()[0];
    await use(page);
  },
});

export { expect } from '@playwright/test';`,
        },
        {
          id: "cb-9",
          language: "js",
          code: `test('test WebView2', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const getStarted = page.getByText('Get Started');
  await expect(getStarted).toBeVisible();
});`,
        },
      ],
    },
    {
      id: "debugging",
      title: {
        en: "Debugging inside the WebView2 control",
        uk: "Налагодження всередині WebView2",
      },
      paragraphs: [
        {
          en: "Right-click inside the WebView2 window and select \"Inspect\" to open DevTools, or press F12. I can also open it programmatically with `CoreWebView2.OpenDevToolsWindow()`. For debugging Playwright tests themselves — the standard Playwright debug tools work: `PWDEBUG=1 npx playwright test` opens Inspector.",
          uk: "Правий клік у вікні WebView2 і вибір «Inspect» відкриває DevTools, або F12. Можна також відкрити програмно через `CoreWebView2.OpenDevToolsWindow()`. Для налагодження самих Playwright-тестів — стандартні інструменти: `PWDEBUG=1 npx playwright test` відкриває Inspector.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You run two WebView2 tests in parallel with a fixture that hardcodes port 9222 and uses the default WebView2 user data folder. Both tests randomly fail with session-related errors. What's the root cause?",
        uk: "Запускаєш два WebView2-тести паралельно з фікстурою що жорстко кодує порт 9222 і використовує стандартну папку user data WebView2. Обидва тести випадково падають через помилки сесії. В чому корінь проблеми?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "connectOverCDP doesn't support simultaneous connections from multiple processes",
            uk: "connectOverCDP не підтримує одночасні з'єднання від кількох процесів",
          },
        },
        {
          id: "b",
          label: {
            en: "Two workers share the same CDP port (only one can connect) AND the same user data directory (session data collides). Fix: use workerIndex to assign each worker a unique port and a unique WEBVIEW2_USER_DATA_FOLDER path",
            uk: "Два воркери спільно використовують один CDP-порт (лише один може підключитися) ТА один user data directory (дані сесій конфліктують). Рішення: використовувати workerIndex щоб призначити кожному воркеру унікальний порт і унікальний шлях WEBVIEW2_USER_DATA_FOLDER",
          },
        },
        {
          id: "c",
          label: {
            en: "WebView2 tests must run serially — parallel execution is not supported",
            uk: "WebView2-тести повинні виконуватися послідовно — паралельне виконання не підтримується",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Both problems compound: the same port means only one worker can connect via CDP (the other fails immediately), and even if you fix the port, sharing the user data directory means both workers read/write the same session, cookies, and storage — causing random interference. The custom fixture pattern solves both: unique port `10000 + workerIndex` and unique data dir path using `workerIndex`. Parallel WebView2 testing is fully supported — it just requires this isolation setup.",
        uk: "Обидві проблеми посилюють одна одну: однаковий порт означає що лише один воркер може підключитися через CDP (інший одразу падає), і навіть якщо виправити порт — спільний user data directory означає що обидва воркери читають/пишуть ту саму сесію, куки і сховище — викликаючи випадкові конфлікти. Патерн кастомної фікстури вирішує обидва: унікальний порт `10000 + workerIndex` і унікальний шлях data dir з `workerIndex`. Паралельне тестування WebView2 повністю підтримується — воно просто потребує цього налаштування ізоляції.",
      },
    },
  ],
}
