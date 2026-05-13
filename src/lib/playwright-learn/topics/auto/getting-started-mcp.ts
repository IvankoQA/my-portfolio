import type { PlaywrightTopic } from "../../types"

export const gettingStartedMcpTopic: PlaywrightTopic = {
  slug: "getting-started-mcp",
  groupId: "getting-started",
  order: 215,
  level: "beginner",
  trackOrder: 4,
  sourceDoc: "getting-started-mcp.md",
  officialDocsUrl: "https://playwright.dev/docs/getting-started-mcp",
  title: {
    en: "Playwright MCP",
    uk: "Playwright MCP",
  },
  summary: {
    en: "The Playwright MCP server provides browser automation capabilities through the [Model Context Protocol](https://modelcontextprotocol.io), enabling LLMs to interact with web pages using structured accessibility snapshots. It works with VS Code, Cursor, Windsurf, Claude Desktop, and any other MCP client — no vision models required.",
    uk: "Сервер Playwright MCP надає можливості автоматизації браузера через [Model Context Protocol](https://modelcontextprotocol.io), даючи LLM змогу взаємодіяти з вебсторінками за допомогою структурованих знімків доступності. Він працює з VS Code, Cursor, Windsurf, Claude Desktop і будь-яким іншим MCP-клієнтом — моделі зору не потрібні.",
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
          en: "The Playwright MCP server provides browser automation capabilities through the [Model Context Protocol](https://modelcontextprotocol.io), enabling LLMs to interact with web pages using structured accessibility snapshots. It works with VS Code, Cursor, Windsurf, Claude Desktop, and any other MCP client — no vision models required.",
          uk: "Сервер Playwright MCP надає можливості автоматизації браузера через [Model Context Protocol](https://modelcontextprotocol.io), даючи LLM змогу взаємодіяти з вебсторінками за допомогою структурованих знімків доступності. Він працює з VS Code, Cursor, Windsurf, Claude Desktop і будь-яким іншим MCP-клієнтом — моделі зору не потрібні.",
        },
      ],
    },
    {
      id: "prerequisites",
      title: {
        en: "Prerequisites",
        uk: "Передумови",
      },
      paragraphs: [
        {
          en: "Before you begin, make sure you have the following installed:\n- [Node.js](https://nodejs.org/) 18 or newer\n- An MCP client: VS Code, Cursor, Windsurf, Claude Code, Claude Desktop, or similar",
          uk: "Перш ніж почати, переконайтеся, що у вас установлено:\n- [Node.js](https://nodejs.org/) 18 або новішу версію\n- MCP-клієнт: VS Code, Cursor, Windsurf, Claude Code, Claude Desktop або подібний",
        },
      ],
    },
    {
      id: "getting-started",
      title: {
        en: "Getting Started",
        uk: "Початок роботи",
      },
      paragraphs: [
        {
          en: "### Installation",
          uk: "### Встановлення",
        },
        {
          en: "Add the Playwright MCP server to your client using the standard configuration:",
          uk: "Додайте сервер Playwright MCP до свого клієнта за допомогою стандартної конфігурації:",
        },
        {
          en: "#### VS Code",
          uk: "#### VS Code",
        },
        {
          en: "Click one of the buttons below to install directly:",
          uk: "Натисніть одну з кнопок нижче, щоб установити напряму:",
        },
        {
          en: '[<img src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Server&color=0098FF" alt="Install in VS Code" />](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522playwright%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522%2540playwright%252Fmcp%2540latest%2522%255D%257D) [<img alt="Install in VS Code Insiders" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Server&color=24bfa5" />](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522playwright%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522%2540playwright%252Fmcp%2540latest%2522%255D%257D)',
          uk: '[<img src="https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Server&color=0098FF" alt="Install in VS Code" />](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522playwright%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522%2540playwright%252Fmcp%2540latest%2522%255D%257D) [<img alt="Install in VS Code Insiders" src="https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Server&color=24bfa5" />](https://insiders.vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522playwright%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522%2540playwright%252Fmcp%2540latest%2522%255D%257D)',
        },
        {
          en: "Or install via the VS Code CLI:",
          uk: "Або встановіть через VS Code CLI:",
        },
        {
          en: "#### Cursor",
          uk: "#### Cursor",
        },
        {
          en: "[](https://cursor.com/en/install-mcp?name=Playwright&config=eyJjb21tYW5kIjoibnB4IEBwbGF5d3JpZ2h0L21jcEBsYXRlc3QifQ%3D%3D)",
          uk: "[](https://cursor.com/en/install-mcp?name=Playwright&config=eyJjb21tYW5kIjoibnB4IEBwbGF5d3JpZ2h0L21jcEBsYXRlc3QifQ%3D%3D)",
        },
        {
          en: "Or go to `Cursor Settings` → `MCP` → `Add new MCP Server` and use command type with `npx @playwright/mcp@latest`.",
          uk: "Або перейдіть до `Cursor Settings` → `MCP` → `Add new MCP Server` і використайте тип command з `npx @playwright/mcp@latest`.",
        },
        {
          en: "#### Claude Code",
          uk: "#### Claude Code",
        },
        {
          en: "#### Claude Desktop",
          uk: "#### Claude Desktop",
        },
        {
          en: "Follow the MCP install [guide](https://modelcontextprotocol.io/quickstart/user) and use the standard config above.",
          uk: "Дотримуйтесь [посібника](https://modelcontextprotocol.io/quickstart/user) зі встановлення MCP і використайте стандартну конфігурацію вище.",
        },
        {
          en: "#### Other clients",
          uk: "#### Інші клієнти",
        },
        {
          en: "The standard configuration works with most MCP clients, including Windsurf, Cline, Goose, Kiro, Codex, Copilot CLI, and others. Consult your client's MCP documentation for where to place the config.",
          uk: "Стандартна конфігурація працює з більшістю MCP-клієнтів, зокрема Windsurf, Cline, Goose, Kiro, Codex, Copilot CLI та іншими. Перегляньте MCP-документацію свого клієнта, щоб дізнатися, куди додати конфігурацію.",
        },
        {
          en: "### First interaction",
          uk: "### Перша взаємодія",
        },
        {
          en: "Once the server is connected, ask your AI assistant to interact with a web page:",
          uk: "Коли сервер підключено, попросіть свого AI-асистента взаємодіяти з вебсторінкою:",
        },
        {
          en: "The assistant will use Playwright MCP tools to open the browser, navigate to the page, and interact with elements — all through structured accessibility snapshots rather than screenshots.",
          uk: "Асистент використає інструменти Playwright MCP, щоб відкрити браузер, перейти на сторінку та взаємодіяти з елементами — усе через структуровані знімки доступності, а не скриншоти.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "json",
          code: '{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": [\n        "@playwright/mcp@latest"\n      ]\n    }\n  }\n}',
        },
        {
          id: "cb-2",
          language: "bash",
          code: 'code --add-mcp \'{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}\'',
        },
        {
          id: "cb-3",
          language: "bash",
          code: "claude mcp add playwright npx @playwright/mcp@latest",
        },
        {
          id: "cb-4",
          language: "txt",
          code: "Navigate to https://demo.playwright.dev/todomvc and add a few todo items.",
        },
      ],
    },
    {
      id: "core-features",
      title: {
        en: "Core Features",
        uk: "Основні можливості",
      },
      paragraphs: [
        {
          en: "### Accessibility snapshots",
          uk: "### Знімки доступності",
        },
        {
          en: "Playwright MCP operates on the page's accessibility tree, not pixels. When a tool runs, it returns a structured snapshot showing the page elements, their roles, and text content. The LLM uses element references from these snapshots to interact with the page:",
          uk: "Playwright MCP працює з деревом доступності сторінки, а не з пікселями. Коли запускається інструмент, він повертає структурований знімок, що показує елементи сторінки, їхні ролі та текстовий вміст. LLM використовує посилання на елементи з цих знімків для взаємодії зі сторінкою:",
        },
        {
          en: "The LLM reads this snapshot and uses `ref=e5` to type into the textbox or `ref=e10` to check the checkbox.",
          uk: "LLM читає цей знімок і використовує `ref=e5`, щоб вводити текст у поле, або `ref=e10`, щоб позначити прапорець.",
        },
        {
          en: "### Interacting with pages",
          uk: "### Взаємодія зі сторінками",
        },
        {
          en: "Playwright MCP provides tools for all common browser interactions:",
          uk: "Playwright MCP надає інструменти для всіх поширених взаємодій із браузером:",
        },
        {
          en: "-   **Navigation**: Open URLs, go back/forward, reload pages.\n-   **Clicking and typing**: Click elements, type text, fill forms, select dropdowns.\n-   **Screenshots**: Capture the current page or specific elements for visual verification.\n-   **Keyboard and mouse**: Press keys, hover, drag and drop.\n-   **Dialogs**: Accept or dismiss browser dialogs.\n-   **Tabs**: Create, close, and switch between browser tabs.",
          uk: "-   **Навігація**: відкривати URL, переходити назад/уперед, перезавантажувати сторінки.\n-   **Кліки та введення**: натискати елементи, вводити текст, заповнювати форми, вибирати значення зі списків.\n-   **Скриншоти**: знімати поточну сторінку або окремі елементи для візуальної перевірки.\n-   **Клавіатура й миша**: натискати клавіші, наводити курсор, перетягувати елементи.\n-   **Діалоги**: приймати або відхиляти браузерні діалоги.\n-   **Вкладки**: створювати, закривати й перемикатися між вкладками браузера.",
        },
        {
          en: "### Running Playwright code",
          uk: "### Запуск коду Playwright",
        },
        {
          en: "For complex interactions that go beyond individual tool calls, use the `browser_run_code_unsafe` tool to execute Playwright scripts directly. This tool runs arbitrary JavaScript in the Playwright server process and is RCE-equivalent — only enable it for trusted MCP clients:",
          uk: "Для складних взаємодій, що виходять за межі окремих викликів інструментів, використовуйте `browser_run_code_unsafe`, щоб виконувати скрипти Playwright напряму. Цей інструмент запускає довільний JavaScript у процесі сервера Playwright і еквівалентний RCE — вмикайте його лише для довірених MCP-клієнтів:",
        },
        {
          en: "### Network monitoring and mocking",
          uk: "### Моніторинг та імітація мережі",
        },
        {
          en: "Inspect network traffic and mock API responses:",
          uk: "Переглядайте мережевий трафік і імітуйте API-відповіді:",
        },
        {
          en: "-   **View network requests**: List all requests made since page load.\n-   **Mock routes**: Set up URL pattern matching to return custom responses.\n-   **Console messages**: Access browser console output for debugging.",
          uk: "-   **Перегляд мережевих запитів**: отримуйте список усіх запитів, зроблених після завантаження сторінки.\n-   **Імітація маршрутів**: налаштовуйте зіставлення URL-шаблонів, щоб повертати власні відповіді.\n-   **Повідомлення консолі**: отримуйте доступ до виводу браузерної консолі для налагодження.",
        },
        {
          en: "### Storage state",
          uk: "### Стан сховища",
        },
        {
          en: "Save and restore browser state including cookies and localStorage:",
          uk: "Зберігайте й відновлюйте стан браузера, зокрема cookies і localStorage:",
        },
        {
          en: "-   **Save state**: Persist authentication and session data to a file.\n-   **Restore state**: Load previously saved state into a new session.\n-   **Cookie management**: List, get, set, and delete individual cookies.",
          uk: "-   **Збереження стану**: записуйте дані автентифікації та сесії у файл.\n-   **Відновлення стану**: завантажуйте раніше збережений стан у нову сесію.\n-   **Керування cookies**: переглядайте, отримуйте, задавайте й видаляйте окремі cookies.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "txt",
          code: '- heading "todos" [level=1]\n- textbox "What needs to be done?" [ref=e5]\n- listitem:\n  - checkbox "Toggle Todo" [ref=e10]\n  - text: "Buy groceries"',
        },
        {
          id: "cb-6",
          language: "txt",
          code: "Run this Playwright code to verify the todo count:\nasync (page) => {\n  const count = await page.getByTestId('todo-count').textContent();\n  return count;\n}",
        },
      ],
    },
    {
      id: "configuration",
      title: {
        en: "Configuration",
        uk: "Конфігурація",
      },
      paragraphs: [
        {
          en: "### Headed mode",
          uk: "### Режим із видимим браузером",
        },
        {
          en: "By default, Playwright MCP runs the browser in headed mode so you can see what's happening. To run headless:",
          uk: "За замовчуванням Playwright MCP запускає браузер у режимі з видимим вікном, щоб ви бачили, що відбувається. Щоб запустити безголовий режим:",
        },
        {
          en: "### Browser selection",
          uk: "### Вибір браузера",
        },
        {
          en: "Choose which browser to use:",
          uk: "Виберіть, який браузер використовувати:",
        },
        {
          en: "Supported values: `chrome`, `firefox`, `webkit`, `msedge`.",
          uk: "Підтримувані значення: `chrome`, `firefox`, `webkit`, `msedge`.",
        },
        {
          en: "### User profile",
          uk: "### Профіль користувача",
        },
        {
          en: "Playwright MCP supports three profile modes:",
          uk: "Playwright MCP підтримує три режими профілю:",
        },
        {
          en: "-   **Persistent (default)**: Login state and cookies are preserved between sessions. The profile is stored in `ms-playwright/mcp-{channel}-{workspace-hash}` in your platform's cache directory, so different projects get separate profiles automatically. Override with `--user-data-dir`.\n-   **Isolated**: Each session starts fresh. Pass `--isolated` to enable. You can load initial state with `--storage-state`.\n-   **Browser extension**: Connect to your existing browser tabs with the [Playwright Extension](https://github.com/microsoft/playwright/blob/main/packages/extension/README.md). Pass `--extension` to enable.",
          uk: "-   **Постійний (типово)**: стан входу й cookies зберігаються між сесіями. Профіль зберігається в `ms-playwright/mcp-{channel}-{workspace-hash}` у директорії кешу вашої платформи, тож різні проєкти автоматично отримують окремі профілі. Перевизначити можна через `--user-data-dir`.\n-   **Ізольований**: кожна сесія починається з чистого стану. Передайте `--isolated`, щоб увімкнути. Початковий стан можна завантажити через `--storage-state`.\n-   **Розширення браузера**: підключайтеся до наявних вкладок браузера через [Playwright Extension](https://github.com/microsoft/playwright/blob/main/packages/extension/README.md). Передайте `--extension`, щоб увімкнути.",
        },
        {
          en: "### Configuration file",
          uk: "### Файл конфігурації",
        },
        {
          en: "For advanced configuration, use a JSON config file:",
          uk: "Для розширеної конфігурації використовуйте JSON-файл конфігурації:",
        },
        {
          en: "The config file supports browser options, context options, network rules, timeouts, and more. See the [Playwright MCP repository](https://github.com/microsoft/playwright-mcp/blob/main/config.d.ts) for the full schema.",
          uk: "Файл конфігурації підтримує параметри браузера, параметри контексту, мережеві правила, таймаути тощо. Повну схему дивіться в [репозиторії Playwright MCP](https://github.com/microsoft/playwright-mcp/blob/main/config.d.ts).",
        },
        {
          en: "### Standalone server",
          uk: "### Окремий сервер",
        },
        {
          en: "When running a headed browser on a system without a display or from IDE worker processes, start the MCP server separately with HTTP transport:",
          uk: "Коли запускаєте браузер із видимим вікном у системі без дисплея або з робочих процесів IDE, запустіть MCP-сервер окремо з HTTP-транспортом:",
        },
        {
          en: "Then point your MCP client to the HTTP endpoint:",
          uk: "Потім спрямуйте MCP-клієнт на HTTP-ендпоїнт:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "json",
          code: '{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": [\n        "@playwright/mcp@latest",\n        "--headless"\n      ]\n    }\n  }\n}',
        },
        {
          id: "cb-8",
          language: "json",
          code: '{\n  "mcpServers": {\n    "playwright": {\n      "command": "npx",\n      "args": [\n        "@playwright/mcp@latest",\n        "--browser=firefox"\n      ]\n    }\n  }\n}',
        },
        {
          id: "cb-9",
          language: "bash",
          code: "npx @playwright/mcp@latest --config path/to/config.json",
        },
        {
          id: "cb-10",
          language: "bash",
          code: "npx @playwright/mcp@latest --port 8931",
        },
        {
          id: "cb-11",
          language: "json",
          code: '{\n  "mcpServers": {\n    "playwright": {\n      "url": "http://localhost:8931/mcp"\n    }\n  }\n}',
        },
      ],
    },
    {
      id: "quick-reference",
      title: {
        en: "Quick Reference",
        uk: "Короткий довідник",
      },
      paragraphs: [
        {
          en: '| Action                    | How to do it                                                  |\n| ------------------------- | ------------------------------------------------------------- |\n| **Install server**        | Add standard config to your MCP client                        |\n| **Navigate to a page**    | Ask: "Go to https://example.com"                              |\n| **Click an element**      | Ask: "Click the Submit button"                                |\n| **Fill a form**           | Ask: "Fill in the email field with test@example.com"          |\n| **Take a screenshot**     | Ask: "Take a screenshot of the page"                          |\n| **Run Playwright code**   | Ask: "Run this Playwright code: ..."                          |\n| **Mock an API**           | Ask: "Mock the /api/users endpoint to return ..."             |\n| **Use headed mode**       | Default. Pass `--headless` to disable                         |\n| **Choose a browser**      | Pass `--browser=firefox` in args                              |',
          uk: '| Дія                       | Як це зробити                                                 |\n| ------------------------- | ------------------------------------------------------------- |\n| **Встановити сервер**     | Додайте стандартну конфігурацію до MCP-клієнта                |\n| **Перейти на сторінку**   | Попросіть: "Перейди на https://example.com"                   |\n| **Натиснути елемент**     | Попросіть: "Натисни кнопку Submit"                            |\n| **Заповнити форму**       | Попросіть: "Заповни поле email значенням test@example.com"    |\n| **Зробити скриншот**      | Попросіть: "Зроби скриншот сторінки"                          |\n| **Запустити код Playwright** | Попросіть: "Запусти цей код Playwright: ..."                  |\n| **Імітувати API**         | Попросіть: "Імітуй ендпоїнт /api/users, щоб він повертав ..." |\n| **Використати режим із видимим браузером** | Типово. Передайте `--headless`, щоб вимкнути                  |\n| **Вибрати браузер**       | Передайте `--browser=firefox` в args                          |',
        },
      ],
    },
    {
      id: "what-s-next",
      title: {
        en: "What's Next",
        uk: "Що далі",
      },
      paragraphs: [
        {
          en: "-   [Write tests using web-first assertions, page fixtures, and locators](./writing-tests.md)\n-   [Run your tests on CI](./ci-intro.md)\n-   [Learn more about the Trace Viewer](./trace-viewer.md)",
          uk: "-   [Пишіть тести з web-first перевірками, фікстурами сторінок і локаторами](./writing-tests.md)\n-   [Запускайте тести в CI](./ci-intro.md)\n-   [Дізнайтеся більше про Trace Viewer](./trace-viewer.md)",
        },
      ],
    },
  ],
  quiz: [],
}
