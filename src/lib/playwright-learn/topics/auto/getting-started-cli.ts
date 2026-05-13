import type { PlaywrightTopic } from "../../types"

export const gettingStartedCliTopic: PlaywrightTopic = {
  slug: "getting-started-cli",
  groupId: "getting-started",
  order: 210,
  level: "beginner",
  trackOrder: 2,
  sourceDoc: "getting-started-cli.md",
  officialDocsUrl: "https://playwright.dev/docs/getting-started-cli",
  title: {
    en: "Coding agents",
    uk: "Агенти для кодування",
  },
  summary: {
    en: "Playwright comes with `playwright-cli`, a command-line interface for browser automation designed for coding agents. It provides token-efficient browser control through concise CLI commands and installable skills, making it ideal for agents that need to balance browser automation with large codebases and reasoning within limited context windows.",
    uk: "Playwright постачає `playwright-cli` — інтерфейс командного рядка для автоматизації браузера, орієнтований на агентів для кодування. Він дає економний за токенами контроль браузера через стислі команди CLI та встановлювані skills, що зручно, коли треба поєднати автоматизацію браузера з великою кодовою базою й обмеженим контекстом моделі.",
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
          en: "Playwright comes with `playwright-cli`, a command-line interface for browser automation designed for coding agents. It provides token-efficient browser control through concise CLI commands and installable skills, making it ideal for agents that need to balance browser automation with large codebases and reasoning within limited context windows.",
          uk: "Playwright постачає `playwright-cli` — інтерфейс командного рядка для автоматизації браузера, орієнтований на агентів для кодування. Він дає економний за токенами контроль браузера через стислі команди CLI та встановлювані skills, що зручно, коли треба поєднати автоматизацію браузера з великою кодовою базою й обмеженим контекстом моделі.",
        },
        {
          en: "### `playwright-cli` vs Playwright MCP",
          uk: "### `playwright-cli` проти Playwright MCP",
        },
        {
          en: "- **`playwright-cli`** is best for **coding agents** (Claude Code, GitHub Copilot, etc.) that favor token-efficient, skill-based workflows. CLI commands avoid loading large tool schemas and verbose accessibility trees into the model context.\n- **MCP** is best for specialized agentic loops that benefit from persistent state and iterative reasoning over page structure, such as exploratory automation or long-running autonomous workflows. See the [MCP getting started guide](./getting-started-mcp.md).",
          uk: "- **`playwright-cli`** зручний для **агентів для кодування** (Claude Code, GitHub Copilot тощо), які надають перевагу економним за токенами сценаріям на базі skills. Команди CLI не підвантажують великі схеми інструментів і розлогі дерева доступності в контекст моделі.\n- **MCP** краще підходить для спеціалізованих агентних циклів із постійним станом і ітеративним міркуванням над структурою сторінки — наприклад, розвідувальна автоматизація або довгі автономні сценарії.\n\nДив. [посібник зі старту MCP](./getting-started-mcp.md).",
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
          en: "Before you begin, make sure you have the following installed:\n- [Node.js](https://nodejs.org/) 18 or newer\n- A coding agent: Claude Code, GitHub Copilot, or similar",
          uk: "Перед початком переконайтеся, що встановлено:\n- [Node.js](https://nodejs.org/) 18 або новіше\n- агента для кодування: Claude Code, GitHub Copilot або аналог",
        },
      ],
    },
    {
      id: "installation",
      title: {
        en: "Installation",
        uk: "Встановлення",
      },
      paragraphs: [
        {
          en: "Install `playwright-cli` globally:",
          uk: "Глобальне встановлення `playwright-cli`:",
        },
        {
          en: "Alternatively, install `@playwright/cli` as a local dependency and use `npx`:",
          uk: "Або встановіть `@playwright/cli` як локальну залежність і використовуйте `npx`:",
        },
        {
          en: "### Installing skills",
          uk: "### Встановлення skills",
        },
        {
          en: "Coding agents like Claude Code and GitHub Copilot can use locally installed skills for richer context about available commands:",
          uk: "Агенти на кшталт Claude Code і GitHub Copilot можуть використовувати локально встановлені skills для кращого контексту щодо доступних команд:",
        },
        {
          en: "### Skills-less operation",
          uk: "### Робота без skills",
        },
        {
          en: "You can also point your agent at the CLI directly and let it discover commands on its own:",
          uk: "Можна також направити агента безпосередньо на CLI — він сам знайде команди:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npm install -g @playwright/cli@latest\nplaywright-cli --help",
        },
        {
          id: "cb-2",
          language: "bash",
          code: "npx playwright-cli --help",
        },
        {
          id: "cb-3",
          language: "bash",
          code: "playwright-cli install --skills",
        },
        {
          id: "cb-4",
          language: "txt",
          code: 'Test the "add todo" flow on https://demo.playwright.dev/todomvc using playwright-cli.\nCheck playwright-cli --help for available commands.',
        },
      ],
    },
    {
      id: "first-steps",
      title: {
        en: "First Steps",
        uk: "Перші кроки",
      },
      paragraphs: [
        {
          en: "### Interactive demo",
          uk: "### Інтерактивне демо",
        },
        {
          en: "Try asking your coding agent:",
          uk: "Спробуйте запитати свого агента для кодування:",
        },
        {
          en: "### Manual walkthrough",
          uk: "### Ручний прохід",
        },
        {
          en: "You can also run commands manually to see how the CLI works:",
          uk: "Команди можна виконувати вручну, щоб побачити, як працює CLI:",
        },
        {
          en: "After each command, the CLI outputs a snapshot of the current page state:",
          uk: "Після кожної команди CLI виводить знімок поточного стану сторінки:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "txt",
          code: "Use playwright skills to test https://demo.playwright.dev/todomvc/.\nTake screenshots for all successful and failing scenarios.",
        },
        {
          id: "cb-6",
          language: "bash",
          code: 'playwright-cli open https://demo.playwright.dev/todomvc/ --headed\nplaywright-cli type "Buy groceries"\nplaywright-cli press Enter\nplaywright-cli type "Water flowers"\nplaywright-cli press Enter\nplaywright-cli check e21\nplaywright-cli screenshot',
        },
        {
          id: "cb-7",
          language: "txt",
          code: "### Page\n- Page URL: https://demo.playwright.dev/todomvc/#/\n- Page Title: React • TodoMVC\n### Snapshot\n[Snapshot](.playwright-cli/page-2026-02-14T19-22-42-679Z.yml)",
        },
      ],
    },
    {
      id: "core-commands",
      title: {
        en: "Core Commands",
        uk: "Основні команди",
      },
      paragraphs: [
        {
          en: "### Interacting with pages",
          uk: "### Взаємодія зі сторінками",
        },
        {
          en: "### Targeting elements",
          uk: "### Вибір елементів",
        },
        {
          en: "Use element refs from snapshots to target elements:",
          uk: "Використовуйте посилання на елементи (refs) із знімків:",
        },
        {
          en: "You can also use CSS or role selectors:",
          uk: "Також можна застосовувати CSS-селектори або селектори за роллю:",
        },
        {
          en: "### Screenshots and snapshots",
          uk: "### Знімки екрана та структури сторінки",
        },
        {
          en: "### Navigation",
          uk: "### Навігація",
        },
        {
          en: "### Keyboard and mouse",
          uk: "### Клавіатура й миша",
        },
        {
          en: "### Tabs",
          uk: "### Вкладки",
        },
        {
          en: "### Network",
          uk: "### Мережа",
        },
        {
          en: "### Storage",
          uk: "### Сховище",
        },
        {
          en: "### DevTools",
          uk: "### DevTools",
        },
      ],
      codeBlocks: [
        {
          id: "cb-8",
          language: "bash",
          code: "playwright-cli open [url]               # open browser, optionally navigate to url\nplaywright-cli goto                # navigate to a url\nplaywright-cli click  [button]     # click an element\nplaywright-cli type               # type text into editable element\nplaywright-cli fill          # fill text into editable element\nplaywright-cli select       # select an option in a dropdown\nplaywright-cli check               # check a checkbox or radio button\nplaywright-cli uncheck             # uncheck a checkbox\nplaywright-cli hover               # hover over element\nplaywright-cli drag   # drag and drop between elements\nplaywright-cli upload             # upload files\nplaywright-cli close                    # close the page",
        },
        {
          id: "cb-9",
          language: "bash",
          code: "playwright-cli snapshot                 # get snapshot with element refs\nplaywright-cli click e15                # click using a ref",
        },
        {
          id: "cb-10",
          language: "bash",
          code: 'playwright-cli click "#main > button.submit"\nplaywright-cli click "role=button[name=Submit]"\nplaywright-cli click "#footer >> role=button[name=Submit]"',
        },
        {
          id: "cb-11",
          language: "bash",
          code: "playwright-cli snapshot                 # capture page snapshot\nplaywright-cli snapshot --filename=f    # save snapshot to specific file\nplaywright-cli screenshot               # screenshot of the current page\nplaywright-cli screenshot [ref]         # screenshot of a specific element\nplaywright-cli screenshot --filename=f  # save with specific filename\nplaywright-cli pdf                      # save page as PDF",
        },
        {
          id: "cb-12",
          language: "bash",
          code: "playwright-cli go-back                  # go back\nplaywright-cli go-forward               # go forward\nplaywright-cli reload                   # reload the page",
        },
        {
          id: "cb-13",
          language: "bash",
          code: "playwright-cli press               # press a key (e.g. Enter, ArrowLeft)\nplaywright-cli keydown             # key down\nplaywright-cli keyup               # key up\nplaywright-cli mousemove          # move mouse\nplaywright-cli mousedown [button]       # mouse button down\nplaywright-cli mouseup [button]         # mouse button up\nplaywright-cli mousewheel       # scroll",
        },
        {
          id: "cb-14",
          language: "bash",
          code: "playwright-cli tab-list                 # list all tabs\nplaywright-cli tab-new [url]            # create a new tab\nplaywright-cli tab-select        # select a tab\nplaywright-cli tab-close [index]        # close a tab",
        },
        {
          id: "cb-15",
          language: "bash",
          code: "playwright-cli requests                 # list network requests since page load\nplaywright-cli request             # show full details of a single request\nplaywright-cli route  [opts]   # mock network requests\nplaywright-cli route-list               # list active routes\nplaywright-cli unroute [pattern]        # remove routes",
        },
        {
          id: "cb-16",
          language: "bash",
          code: "playwright-cli state-save [filename]    # save storage state (cookies, localStorage)\nplaywright-cli state-load     # load storage state\n\n# Cookies\nplaywright-cli cookie-list [--domain]   # list cookies\nplaywright-cli cookie-get         # get a cookie\nplaywright-cli cookie-set    # set a cookie\nplaywright-cli cookie-delete      # delete a cookie\nplaywright-cli cookie-clear             # clear all cookies\n\n# localStorage\nplaywright-cli localstorage-list        # list entries\nplaywright-cli localstorage-get    # get value\nplaywright-cli localstorage-set   # set value\nplaywright-cli localstorage-delete   # delete entry\nplaywright-cli localstorage-clear       # clear all",
        },
        {
          id: "cb-17",
          language: "bash",
          code: "playwright-cli console [min-level]      # list console messages\nplaywright-cli eval  [ref]        # evaluate JavaScript on page\nplaywright-cli run-code           # run Playwright code snippet\nplaywright-cli tracing-start            # start trace recording\nplaywright-cli tracing-stop             # stop trace recording\nplaywright-cli video-start              # start video recording\nplaywright-cli video-chapter     # add chapter marker to video\nplaywright-cli video-stop --filename=f  # stop video recording",
        },
      ],
    },
    {
      id: "sessions",
      title: {
        en: "Sessions",
        uk: "Сесії",
      },
      paragraphs: [
        {
          en: "The CLI keeps the browser profile in memory by default — cookies and storage state are preserved between calls within a session but lost when the browser closes. Use `--persistent` to save the profile to disk.",
          uk: "За замовчуванням CLI тримає профіль браузера в пам’яті: cookies і стан сховища зберігаються між викликами в межах сесії, але губляться після закриття браузера. Прапорець `--persistent` зберігає профіль на диску.",
        },
        {
          en: "### Named sessions",
          uk: "### Іменовані сесії",
        },
        {
          en: "Run multiple browser instances for different projects:",
          uk: "Запуск кількох екземплярів браузера для різних проєктів:",
        },
        {
          en: "You can configure your coding agent to use a specific session:",
          uk: "Можна налаштувати агента для кодування на використання певної сесії:",
        },
        {
          en: "### Session management",
          uk: "### Керування сесіями",
        },
      ],
      codeBlocks: [
        {
          id: "cb-18",
          language: "bash",
          code: "playwright-cli open https://playwright.dev\nplaywright-cli -s=example open https://example.com --persistent\nplaywright-cli list                     # list all sessions",
        },
        {
          id: "cb-19",
          language: "bash",
          code: "PLAYWRIGHT_CLI_SESSION=todo-app claude .",
        },
        {
          id: "cb-20",
          language: "bash",
          code: "playwright-cli list                     # list all sessions\nplaywright-cli close-all                # close all browsers\nplaywright-cli kill-all                 # forcefully kill all browser processes\nplaywright-cli -s=name delete-data      # delete user data for a named session",
        },
      ],
    },
    {
      id: "monitoring",
      title: {
        en: "Monitoring",
        uk: "Моніторинг",
      },
      paragraphs: [
        {
          en: "Use `playwright-cli show` to open a visual dashboard for observing and controlling all running browser sessions:",
          uk: "Команда `playwright-cli show` відкриває візуальну панель для спостереження та керування всіма активними сесіями браузера:",
        },
        {
          en: "The dashboard provides:",
          uk: "Панель містить:",
        },
        {
          en: "- **Session grid** — all active sessions grouped by workspace, each with a live screencast preview, session name, current URL, and page title. Click any session to zoom in.\n- **Session detail** — a live view of the selected session with tab bar, navigation controls, and full remote control. Click into the viewport to take over mouse and keyboard; press Escape to release.",
          uk: "- **Сітка сесій** — усі активні сесії згруповані за робочим простором; для кожної є попередній перегляд screencast, ім’я сесії, поточний URL і заголовок сторінки. Клік по сесії збільшує її.\n- **Деталі сесії** — живий вигляд обраної сесії з панеллю вкладок, навігацією і повним віддаленим керуванням. Клік у viewport передає керування мишею та клавіатурою; Escape — звільняє.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-21",
          language: "bash",
          code: "playwright-cli show",
        },
      ],
    },
    {
      id: "configuration",
      title: {
        en: "Configuration",
        uk: "Налаштування",
      },
      paragraphs: [
        {
          en: "### Headed mode",
          uk: "### Режим з інтерфейсом (headed)",
        },
        {
          en: "The CLI runs headless by default. To see the browser:",
          uk: "За замовчуванням CLI працює у headless. Щоб бачити браузер:",
        },
        {
          en: "### Browser selection",
          uk: "### Вибір браузера",
        },
        {
          en: "### Configuration file",
          uk: "### Файл конфігурації",
        },
        {
          en: "For advanced settings, use a JSON config file:",
          uk: "Для розширених параметрів використовуйте JSON-файл конфігурації:",
        },
        {
          en: "The CLI also loads `.playwright/cli.config.json` automatically if present. The config file supports browser options, context options, network rules, timeouts, and more. Run `playwright-cli --help` for the full list of options.",
          uk: "CLI автоматично підвантажує `.playwright/cli.config.json`, якщо файл існує. У конфігурації підтримуються опції браузера та контексту, мережеві правила, таймаути тощо. Повний список — у `playwright-cli --help`.",
        },
        {
          en: "### Browser extension",
          uk: "### Розширення браузера",
        },
        {
          en: "Connect to your existing browser tabs instead of launching a new browser:",
          uk: "Підключення до вже відкритих вкладок замість запуску нового браузера:",
        },
        {
          en: "This requires the [Playwright Extension](https://github.com/microsoft/playwright/blob/main/packages/extension/README.md) to be installed.",
          uk: "Потрібно встановити [розширення Playwright](https://github.com/microsoft/playwright/blob/main/packages/extension/README.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-22",
          language: "bash",
          code: "playwright-cli open https://playwright.dev --headed",
        },
        {
          id: "cb-23",
          language: "bash",
          code: "playwright-cli open --browser=chrome    # use specific browser\nplaywright-cli open --browser=firefox\nplaywright-cli open --browser=webkit\nplaywright-cli open --browser=msedge",
        },
        {
          id: "cb-24",
          language: "bash",
          code: "playwright-cli --config path/to/config.json open example.com",
        },
        {
          id: "cb-25",
          language: "bash",
          code: "playwright-cli attach --extension",
        },
      ],
    },
    {
      id: "quick-reference",
      title: {
        en: "Quick Reference",
        uk: "Швидка довідка",
      },
      paragraphs: [
        {
          en: '| Action                    | Command                                             |\n| ------------------------- | --------------------------------------------------- |\n| **Install CLI**           | `npm install -g @playwright/cli@latest`             |\n| **Install skills**        | `playwright-cli install --skills`                   |\n| **Open a page**           | `playwright-cli open https://example.com`           |\n| **Click an element**      | `playwright-cli click e15`                          |\n| **Type text**             | `playwright-cli type "hello world"`                 |\n| **Take a screenshot**     | `playwright-cli screenshot`                         |\n| **Get page snapshot**     | `playwright-cli snapshot`                           |\n| **Run headed**            | `playwright-cli open https://example.com --headed`  |\n| **Use Firefox**           | `playwright-cli open --browser=firefox`             |\n| **Monitor sessions**      | `playwright-cli show`                               |',
          uk: '| Дія                       | Команда                                             |\n| ------------------------- | --------------------------------------------------- |\n| **Встановити CLI**        | `npm install -g @playwright/cli@latest`             |\n| **Встановити skills**     | `playwright-cli install --skills`                   |\n| **Відкрити сторінку**     | `playwright-cli open https://example.com`           |\n| **Клік по елементу**      | `playwright-cli click e15`                          |\n| **Ввести текст**          | `playwright-cli type "hello world"`                 |\n| **Знімок екрана**         | `playwright-cli screenshot`                         |\n| **Знімок структури**      | `playwright-cli snapshot`                           |\n| **З інтерфейсом**         | `playwright-cli open https://example.com --headed`  |\n| **Firefox**               | `playwright-cli open --browser=firefox`             |\n| **Моніторинг сесій**      | `playwright-cli show`                               |',
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
          en: "- [Write tests using web-first assertions, page fixtures, and locators](./writing-tests.md)\n- [Run your tests on CI](./ci-intro.md)\n- [Learn more about the Trace Viewer](./trace-viewer.md)",
          uk: "- [Писати тести з web-first assertions, фікстурами сторінки та локаторами](./writing-tests.md)\n- [Запускати тести в CI](./ci-intro.md)\n- [Дізнатися більше про Trace Viewer](./trace-viewer.md)",
        },
      ],
    },
  ],
  quiz: [],
}
