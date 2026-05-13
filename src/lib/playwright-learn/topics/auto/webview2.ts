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
    en: "The following will explain how to use Playwright with [Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/). WebView2 is a WinForms control, which will use Microsoft Edge under the hood to render web content. It is a part of the Microsoft Edge browser and is available on Windows 10 and Windows 11. Playwright can be used to automate WebView2 applications and can be used to test web co…",
    uk: "Нижче пояснено, як використовувати Playwright із [Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/). WebView2 — це елемент керування WinForms, який під капотом використовує Microsoft Edge для відображення вебвмісту. Він є частиною браузера Microsoft Edge і доступний у Windows 10 і Windows 11. Playwright можна застосовувати для автоматизації застосунків WebView2 і тестування вебвмісту в WebView2…",
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
          en: "The following will explain how to use Playwright with [Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/). WebView2 is a WinForms control, which will use Microsoft Edge under the hood to render web content. It is a part of the Microsoft Edge browser and is available on Windows 10 and Windows 11. Playwright can be used to automate WebView2 applications and can be used to test web content in WebView2. For connecting to WebView2, Playwright uses [`method: BrowserType.connectOverCDP`] which connects to it via the Chrome DevTools Protocol (CDP).",
          uk: "Нижче описано використання Playwright із [Microsoft Edge WebView2](https://docs.microsoft.com/en-us/microsoft-edge/webview2/). WebView2 — елемент керування WinForms, який під капотом використовує Microsoft Edge для відображення вебвмісту. Він є частиною браузера Microsoft Edge і доступний у Windows 10 і Windows 11. Playwright можна застосовувати для автоматизації застосунків WebView2 і тестування вебвмісту в WebView2. Підключення до WebView2 виконується через [`method: BrowserType.connectOverCDP`] за протоколом Chrome DevTools Protocol (CDP).",
        },
      ],
    },
    {
      id: "overview",
      title: {
        en: "Overview",
        uk: "Огляд",
      },
      paragraphs: [
        {
          en: "A WebView2 control can be instructed to listen to incoming CDP connections by setting either the `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` environment variable with `--remote-debugging-port=9222` or calling [EnsureCoreWebView2Async](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22) with the `--remote-debugging-port=9222` argument. This will start the WebView2 process with the Chrome DevTools Protocol enabled which allows the automation by Playwright. 9222 is an example port in this case, but any other unused port can be used as well.",
          uk: "Елемент WebView2 можна налаштувати на прийом CDP-з’єднань: або змінною середовища `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` з `--remote-debugging-port=9222`, або викликом [EnsureCoreWebView2Async](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22) з аргументом `--remote-debugging-port=9222`. Процес WebView2 запуститься з увімкненим Chrome DevTools Protocol, що дозволяє автоматизацію Playwright. 9222 тут — приклад порту; можна використати будь-який вільний.",
        },
        {
          en: "Once your application with the WebView2 control is running, you can connect to it via Playwright:",
          uk: "Коли застосунок із WebView2 уже запущено, підключайтеся через Playwright:",
        },
        {
          en: "To ensure that the WebView2 control is ready, you can wait for the [`CoreWebView2InitializationCompleted`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.corewebview2initializationcompleted?view=webview2-dotnet-1.0.1343.22) event:",
          uk: "Щоб переконатися, що WebView2 готовий, можна очікувати подію [`CoreWebView2InitializationCompleted`](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.corewebview2initializationcompleted?view=webview2-dotnet-1.0.1343.22):",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "csharp",
          code: 'await this.webView.EnsureCoreWebView2Async(await CoreWebView2Environment.CreateAsync(null, null, new CoreWebView2EnvironmentOptions()\n{\n  AdditionalBrowserArguments = "--remote-debugging-port=9222",\n})).ConfigureAwait(false);',
        },
        {
          id: "cb-2",
          language: "js",
          code: "const browser = await playwright.chromium.connectOverCDP('http://localhost:9222');\nconst context = browser.contexts()[0];\nconst page = context.pages()[0];",
        },
        {
          id: "cb-3",
          language: "java",
          code: 'Browser browser = playwright.chromium().connectOverCDP("http://localhost:9222");\nBrowserContext context = browser.contexts().get(0);\nPage page = context.pages().get(0);',
        },
        {
          id: "cb-4",
          language: "python",
          code: 'browser = await playwright.chromium.connect_over_cdp("http://localhost:9222")\ncontext = browser.contexts[0]\npage = context.pages[0]',
        },
        {
          id: "cb-5",
          language: "python",
          code: 'browser = playwright.chromium.connect_over_cdp("http://localhost:9222")\ncontext = browser.contexts[0]\npage = context.pages[0]',
        },
        {
          id: "cb-6",
          language: "csharp",
          code: 'var browser = await playwright.Chromium.ConnectOverCDPAsync("http://localhost:9222");\nvar context = browser.Contexts[0];\nvar page = context.Pages[0];',
        },
        {
          id: "cb-7",
          language: "csharp",
          code: 'this.webView.CoreWebView2InitializationCompleted += (_, e) =>\n{\n    if (e.IsSuccess)\n    {\n        Console.WriteLine("WebView2 initialized");\n    }\n};',
        },
      ],
    },
    {
      id: "writing-and-running-tests",
      title: {
        en: "Writing and running tests",
        uk: "Написання й запуск тестів",
      },
      paragraphs: [
        {
          en: "By default, the WebView2 control will use the same user data directory for all instances. This means that if you run multiple tests in parallel, they will interfere with each other. To avoid this, you should set the `WEBVIEW2_USER_DATA_FOLDER` environment variable (or use [WebView2.EnsureCoreWebView2Async Method](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22)) to a different folder for each test. This will make sure that each test runs in its own user data directory.",
          uk: "За замовчуванням WebView2 використовує один каталог user data для всіх екземплярів, тому паралельні тести можуть заважати одне одному. Щоб цього уникнути, задайте змінну середовища `WEBVIEW2_USER_DATA_FOLDER` (або скористайтеся [методом WebView2.EnsureCoreWebView2Async](https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.wpf.webview2.ensurecorewebview2async?view=webview2-dotnet-1.0.1343.22)) з окремим каталогом для кожного тесту — тоді кожен тест матиме власний user data directory.",
        },
        {
          en: "Using the following, Playwright will run your WebView2 application as a sub-process, assign a unique user data directory to it and provide the [Page] instance to your test:",
          uk: "У прикладі нижче Playwright запускає застосунок WebView2 як підпроцес, призначає унікальний каталог user data і надає тесту екземпляр [Page]:",
        },
        {
          en: "<!-- source code is available here to verify that the examples are working https://github.com/mxschmitt/playwright-webview2-demo -->",
          uk: "<!-- вихідний код для перевірки прикладів: https://github.com/mxschmitt/playwright-webview2-demo -->",
        },
      ],
      codeBlocks: [
        {
          id: "cb-8",
          language: "js",
          code: "\nconst EXECUTABLE_PATH = path.join(\n    __dirname,\n    '../../webview2-app/bin/Debug/net8.0-windows/webview2.exe',\n);\n\nexport const test = base.extend({\n  browser: async ({ playwright }, use, testInfo) => {\n    const cdpPort = 10000 + testInfo.workerIndex;\n    // Make sure that the executable exists and is executable\n    fs.accessSync(EXECUTABLE_PATH, fs.constants.X_OK);\n    const userDataDir = path.join(\n        fs.realpathSync.native(os.tmpdir()),\n        `playwright-webview2-tests/user-data-dir-${testInfo.workerIndex}`,\n    );\n    const webView2Process = childProcess.spawn(EXECUTABLE_PATH, [], {\n      shell: true,\n      env: {\n        ...process.env,\n        WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS: `--remote-debugging-port=${cdpPort}`,\n        WEBVIEW2_USER_DATA_FOLDER: userDataDir,\n      }\n    });\n    await new Promise(resolve => webView2Process.stdout.on('data', data => {\n      if (data.toString().includes('WebView2 initialized'))\n        resolve();\n    }));\n    const browser = await playwright.chromium.connectOverCDP(`http://127.0.0.1:${cdpPort}`);\n    await use(browser);\n    await browser.close();\n    childProcess.execSync(`taskkill /pid ${webView2Process.pid} /T /F`);\n    fs.rmdirSync(userDataDir, { recursive: true });\n  },\n  context: async ({ browser }, use) => {\n    const context = browser.contexts()[0];\n    await use(context);\n  },\n  page: async ({ context }, use) => {\n    const page = context.pages()[0];\n    await use(page);\n  },\n});\n\nexport { expect } from '@playwright/test';",
        },
        {
          id: "cb-9",
          language: "js",
          code: "\ntest('test WebView2', async ({ page }) => {\n  await page.goto('https://playwright.dev');\n  const getStarted = page.getByText('Get Started');\n  await expect(getStarted).toBeVisible();\n});",
        },
        {
          id: "cb-10",
          language: "java",
          code: 'package com.example;\n\npublic class WebView2Process {\n  public int cdpPort;\n  private Path _dataDir;\n  private Process _process;\n  private Path _executablePath = Path.of("../webview2-app/bin/Debug/net8.0-windows/webview2.exe");\n\n  public WebView2Process() throws IOException {\n    cdpPort = nextFreePort();\n    _dataDir = Files.createTempDirectory("pw-java-webview2-tests-");\n\n    if (!Files.exists(_executablePath)) {\n      throw new RuntimeException("Executable not found: " + _executablePath);\n    }\n    ProcessBuilder pb = new ProcessBuilder().command(_executablePath.toAbsolutePath().toString());\n    Map envMap = pb.environment();\n    envMap.put("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--remote-debugging-port=" + cdpPort);\n    envMap.put("WEBVIEW2_USER_DATA_FOLDER", _dataDir.toString());\n    _process = pb.start();\n    // wait until "WebView2 initialized" got printed\n    BufferedReader reader = new BufferedReader(new InputStreamReader(_process.getInputStream()));\n    while (true) {\n      String line = reader.readLine();\n      if (line == null) {\n        throw new RuntimeException("WebView2 process exited");\n      }\n      if (line.contains("WebView2 initialized")) {\n        break;\n      }\n    }\n  }\n\n  private static final AtomicInteger nextUnusedPort = new AtomicInteger(9000);\n\n  private static boolean available(int port) {\n    try (ServerSocket ignored = new ServerSocket(port)) {\n      return true;\n    } catch (IOException ignored) {\n      return false;\n    }\n  }\n\n  static int nextFreePort() {\n    for (int i = 0; i < 100; i++) {\n      int port = nextUnusedPort.getAndIncrement();\n      if (available(port)) {\n        return port;\n      }\n    }\n    throw new RuntimeException("Cannot find free port: " + nextUnusedPort.get());\n  }\n\n  public void dispose() {\n    _process.destroy();\n    try {\n      _process.waitFor();\n    } catch (InterruptedException e) {\n      throw new RuntimeException(e);\n    }\n  }\n}',
        },
        {
          id: "cb-11",
          language: "java",
          code: 'package com.example;\n\npublic class TestExample {\n  // Shared between all tests in this class.\n  static WebView2Process webview2Process;\n  static Playwright playwright;\n  static Browser browser;\n  static BrowserContext context;\n  static Page page;\n\n  @BeforeAll\n  static void launchBrowser() throws IOException {\n    playwright = Playwright.create();\n    webview2Process = new WebView2Process();\n    browser = playwright.chromium().connectOverCDP("http://127.0.0.1:" + webview2Process.cdpPort);\n    context = browser.contexts().get(0);\n    page = context.pages().get(0);\n  }\n\n  @AfterAll\n  static void closeBrowser() {\n    webview2Process.dispose();\n  }\n\n  @Test\n  public void shouldClickButton() {\n    page.navigate("https://playwright.dev");\n    Locator gettingStarted = page.getByText("Get started");\n    assertThat(gettingStarted).isVisible();\n  }\n}',
        },
        {
          id: "cb-12",
          language: "python",
          code: '\nfrom pathlib import Path\nfrom playwright.sync_api import Playwright, Browser, BrowserContext\n\nEXECUTABLE_PATH = (\n    Path(__file__).parent\n    / ".."\n    / "webview2-app"\n    / "bin"\n    / "Debug"\n    / "net8.0-windows"\n    / "webview2.exe"\n)\n\n@pytest.fixture(scope="session")\ndef data_dir():\n    with tempfile.TemporaryDirectory(\n        prefix="playwright-webview2-tests", ignore_cleanup_errors=True\n    ) as tmpdirname:\n        yield tmpdirname\n\n@pytest.fixture(scope="session")\ndef webview2_process_cdp_port(data_dir: str):\n    cdp_port = _find_free_port()\n    process = subprocess.Popen(\n        [EXECUTABLE_PATH],\n        env={\n            **dict(os.environ),\n            "WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS": f"--remote-debugging-port={cdp_port}",\n            "WEBVIEW2_USER_DATA_FOLDER": data_dir,\n        },\n        stdout=subprocess.PIPE,\n        stderr=subprocess.STDOUT,\n        universal_newlines=True,\n    )\n    while True:\n        line = process.stdout.readline()\n        if "WebView2 initialized" in line:\n            break\n    yield cdp_port\n    process.terminate()\n\n@pytest.fixture(scope="session")\ndef browser(playwright: Playwright, webview2_process_cdp_port: int):\n    browser = playwright.chromium.connect_over_cdp(\n        f"http://127.0.0.1:{webview2_process_cdp_port}"\n    )\n    yield browser\n\n@pytest.fixture(scope="function")\ndef context(browser: Browser):\n    context = browser.contexts[0]\n    yield context\n\n@pytest.fixture(scope="function")\ndef page(context: BrowserContext):\n    page = context.pages[0]\n    yield page\n\ndef _find_free_port(port=9000, max_port=65535):\n    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    while port <= max_port:\n        try:\n            sock.bind(("", port))\n            sock.close()\n            return port\n        except OSError:\n            port += 1\n    raise IOError("no free ports")',
        },
        {
          id: "cb-13",
          language: "python",
          code: 'from playwright.sync_api import Page, expect\n\ndef test_webview2(page: Page):\n    page.goto("https://playwright.dev")\n    get_started = page.get_by_text("Get Started")\n    expect(get_started).to_be_visible()',
        },
        {
          id: "cb-14",
          language: "csharp",
          code: '// WebView2Test.cs\nusing System.Diagnostics;\nusing Microsoft.Playwright;\nusing Microsoft.Playwright.MSTest;\n\nnamespace PlaywrightTests;\n\n[TestClass]\npublic class ExampleTest : PlaywrightTest\n{\n    public IBrowser Browser { get; internal set; } = null!;\n    public IBrowserContext Context { get; internal set; } = null!;\n    public IPage Page { get; internal set; } = null!;\n    private Process? _webView2Process = null;\n    private string _userDataDir = null!;\n    private string _executablePath = Path.Join(Directory.GetCurrentDirectory(), @"..\\..\\..\\..\\webview2-app\\bin\\Debug\\net8.0-windows\\webview2.exe");\n\n    [TestInitialize]\n    public async Task BrowserTestInitialize()\n    {\n        var cdpPort = 10000 + WorkerIndex;\n        Assert.IsTrue(File.Exists(_executablePath), "Make sure that the executable exists");\n        _userDataDir = Path.Join(Path.GetTempPath(), $"playwright-webview2-tests/user-data-dir-{WorkerIndex}");\n        // WebView2 does some lazy cleanups on shutdown so we can\'t clean it up after each test\n        if (Directory.Exists(_userDataDir))\n        {\n            Directory.Delete(_userDataDir, true);\n        }\n        _webView2Process = Process.Start(new ProcessStartInfo(_executablePath)\n        {\n            EnvironmentVariables =\n        {\n            ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = $"--remote-debugging-port={cdpPort}",\n            ["WEBVIEW2_USER_DATA_FOLDER"] = _userDataDir,\n        },\n            RedirectStandardOutput = true,\n        });\n        while (!_webView2Process!.HasExited)\n        {\n            var output = await _webView2Process!.StandardOutput.ReadLineAsync();\n            if (_webView2Process!.HasExited)\n            {\n                throw new Exception("WebView2 process exited unexpectedly");\n            }\n            if (output != null && output.Contains("WebView2 initialized"))\n            {\n                break;\n            }\n        }\n        var cdpAddress = $"http://127.0.0.1:{cdpPort}";\n        Browser = await Playwright.Chromium.ConnectOverCDPAsync(cdpAddress);\n        Context = Browser.Contexts[0];\n        Page = Context.Pages[0];\n    }\n\n    [TestCleanup]\n    public async Task BrowserTestCleanup()\n    {\n        _webView2Process!.Kill(true);\n        await Browser.CloseAsync();\n    }\n}',
        },
        {
          id: "cb-15",
          language: "csharp",
          code: '// UnitTest1.cs\nusing Microsoft.Playwright;\nusing Microsoft.Playwright.MSTest;\n\nnamespace PlaywrightTests;\n\n[TestClass]\npublic class ExampleTest : WebView2Test\n{\n    [TestMethod]\n    public async Task HomepageHasPlaywrightInTitleAndGetStartedLinkLinkingtoTheIntroPage()\n    {\n        await Page.GotoAsync("https://playwright.dev");\n        var getStarted = Page.GetByText("Get Started");\n        await Expect(getStarted).ToBeVisibleAsync();\n    }\n}',
        },
      ],
    },
    {
      id: "debugging",
      title: {
        en: "Debugging",
        uk: "Налагодження",
      },
      paragraphs: [
        {
          en: 'Inside your webview2 control, you can just right-click to open the context menu and select "Inspect" to open the DevTools or press F12. You can also use the [WebView2.CoreWebView2.OpenDevToolsWindow](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.opendevtoolswindow?view=webview2-dotnet-1.0.1462.37) method to open the DevTools programmatically.',
          uk: "У вікні WebView2 можна відкрити контекстне меню правим кліком і вибрати «Inspect» для DevTools або натиснути F12. Також можна програмно викликати [WebView2.CoreWebView2.OpenDevToolsWindow](https://learn.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2.opendevtoolswindow?view=webview2-dotnet-1.0.1462.37).",
        },
        {
          en: "For debugging tests, see the Playwright [Debugging guide](./debug).",
          uk: "Налагодження тестів — у [посібнику з налагодження](./debug) Playwright.",
        },
      ],
    },
  ],
  quiz: [],
}
