import type { PlaywrightTopic } from "../../types"

export const gettingStartedMcpTopic: PlaywrightTopic = {
  slug: "getting-started-mcp",
  groupId: "getting-started",
  order: 215,
  level: "intermediate",
  trackOrder: 27,
  sourceDoc: "getting-started-mcp.md",
  officialDocsUrl: "https://playwright.dev/docs/getting-started-mcp",
  title: {
    en: "Playwright MCP",
    uk: "Playwright MCP",
  },
  summary: {
    en: "Playwright MCP lets AI assistants control a browser through the Model Context Protocol. Instead of processing screenshots, the model reads a structured accessibility tree — which elements exist, their roles, their text. Works with VS Code, Claude, Cursor, and any MCP client. No vision model required.",
    uk: "Playwright MCP дозволяє AI-асистентам керувати браузером через Model Context Protocol. Замість обробки скриншотів — модель читає структуроване дерево доступності: які елементи є, їхні ролі, їхній текст. Працює з VS Code, Claude, Cursor і будь-яким MCP-клієнтом. Модель зору не потрібна.",
  },
  sections: [
    {
      id: "installation",
      title: {
        en: "Installation — add to your MCP client config",
        uk: "Встановлення — додати до конфігу MCP-клієнта",
      },
      paragraphs: [
        {
          en: "The same config works for most MCP clients. Add it to the appropriate config file for your client:",
          uk: "Той самий конфіг підходить для більшості MCP-клієнтів. Додай його до відповідного файлу конфігурації свого клієнта:",
        },
      ],
      codeBlocks: [
        {
          id: "mcp-config",
          language: "json",
          code: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}`,
        },
        {
          id: "claude-code",
          language: "bash",
          code: `# Claude Code — одна команда
claude mcp add playwright npx @playwright/mcp@latest

# VS Code — через CLI
code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}'`,
        },
      ],
    },
    {
      id: "how-it-works",
      title: {
        en: "How it works — accessibility tree, not screenshots",
        uk: "Як це працює — дерево доступності, не скриншоти",
      },
      paragraphs: [
        {
          en: "When a tool runs, it returns a structured snapshot of the page — elements with their roles, text, and refs. The model uses those refs to interact. No need to parse pixel positions or describe what it 'sees' in an image.",
          uk: "Коли інструмент запускається — він повертає структурований snapshot сторінки: елементи з їхніми ролями, текстом і refs. Модель використовує ті refs для взаємодії. Не потрібно парсити позиції пікселів або описувати що 'видно' на зображенні.",
        },
      ],
      codeBlocks: [
        {
          id: "snapshot-example",
          language: "text",
          code: `// Приклад того що бачить модель після browser_snapshot
- heading "Orders" [level=1]
- textbox "Search orders" [ref=e5]
- button "Create order" [ref=e8]
- listitem:
  - text "ORD-042 — Laptop Stand"
  - button "Edit" [ref=e15]

// Модель може відразу: browser_click ref=e8`,
        },
      ],
    },
    {
      id: "what-you-can-do",
      title: {
        en: "What you can ask the AI to do",
        uk: "Що можна попросити AI зробити",
      },
      paragraphs: [
        {
          en: "After connecting MCP, just describe what you need in natural language. The assistant picks the right tools automatically.",
          uk: "Після підключення MCP — просто описуй що потрібно природною мовою. Асистент сам підбирає правильні інструменти.",
        },
      ],
      codeBlocks: [
        {
          id: "prompts",
          language: "text",
          code: `// Тестування flow
Перейди на http://localhost:3000/orders і перевір що таблиця
замовлень відображається з правильними колонками.

// Заповнення форм
Відкрий /orders/new, заповни форму: Item = "Laptop Stand",
Quantity = 2, натисни Create. Перевір що з'явився success banner.

// Мокування API
Замокай GET /api/orders щоб повертав порожній масив.
Перевір що сторінка показує "No orders yet" замість таблиці.

// Дебаг
Відкрий /dashboard і перевір наявність JavaScript-помилок
в консолі браузера.`,
        },
      ],
    },
    {
      id: "configuration",
      title: {
        en: "Configuration options",
        uk: "Опції конфігурації",
      },
      paragraphs: [
        {
          en: "By default: headed browser (you can see it), persistent profile (cookies preserved between sessions). Override with flags in the `args` array.",
          uk: "За замовчуванням: браузер з вікном (ти його бачиш), постійний профіль (cookies зберігаються між сесіями). Перевизнач через прапорці в масиві `args`.",
        },
      ],
      codeBlocks: [
        {
          id: "config-options",
          language: "json",
          code: `{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--headless",         // без видимого вікна
        "--browser=firefox",  // firefox замість chromium
        "--isolated"          // кожна сесія з чистим станом
      ]
    }
  }
}`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Why does Playwright MCP use an accessibility tree instead of screenshots to let the model interact with the page?",
        uk: "Чому Playwright MCP використовує дерево доступності замість скриншотів щоб модель взаємодіяла зі сторінкою?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Screenshots are too large to transmit over MCP",
            uk: "Скриншоти занадто великі для передачі через MCP",
          },
        },
        {
          id: "b",
          label: {
            en: "The accessibility tree is structured text — the model can read element refs and act on them without needing a vision model to parse pixel positions",
            uk: "Дерево доступності — це структурований текст: модель може читати refs елементів і діяти з ними без потреби у vision-моделі для парсингу позицій пікселів",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright can't take screenshots in MCP mode",
            uk: "Playwright не може робити скриншоти в MCP-режимі",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The accessibility tree gives the model structured, reliable data: element roles, text, and refs like `ref=e15`. The model clicks `ref=e15` without needing to know pixel coordinates. Vision models that parse screenshots are slower, more expensive, and error-prone (they can misread positions or miss elements in complex layouts). The accessibility tree also works in headless mode where there's no visual output at all.",
        uk: "Дерево доступності дає моделі структуровані надійні дані: ролі елементів, текст і refs типу `ref=e15`. Модель клацає `ref=e15` без необхідності знати пікселеві координати. Vision-моделі що парсять скриншоти — повільніші, дорожчі і схильні до помилок (можуть неправильно читати позиції або пропускати елементи в складних верстках). Дерево доступності також працює в headless-режимі де взагалі немає візуального виводу.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is the minimum config change needed to add Playwright MCP to a supported AI client?",
        uk: "Яка мінімальна зміна конфігурації потрібна щоб додати Playwright MCP до підтримуваного AI-клієнта?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Install @playwright/mcp globally with npm and restart the client — no config change needed",
            uk: "Встановити @playwright/mcp глобально через npm і перезапустити клієнт — зміна конфігурації не потрібна",
          },
        },
        {
          id: "b",
          label: {
            en: "Add a 'playwright' entry under 'mcpServers' in the client's config file pointing to 'npx @playwright/mcp@latest'",
            uk: "Додати запис 'playwright' під 'mcpServers' у файлі конфігурації клієнта що вказує на 'npx @playwright/mcp@latest'",
          },
        },
        {
          id: "c",
          label: {
            en: "Set the PLAYWRIGHT_MCP=true environment variable and restart the AI client",
            uk: "Встановити змінну середовища PLAYWRIGHT_MCP=true і перезапустити AI-клієнт",
          },
        },
        {
          id: "d",
          label: {
            en: "Install the Playwright VS Code extension — it automatically registers MCP for all clients",
            uk: "Встановити розширення Playwright для VS Code — воно автоматично реєструє MCP для всіх клієнтів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright MCP is configured by adding a JSON entry under 'mcpServers' in the client's config file. The entry specifies 'command: npx' and 'args: [\"@playwright/mcp@latest\"]'. For Claude Code this can be done with one CLI command: 'claude mcp add playwright npx @playwright/mcp@latest'. The same JSON config works across VS Code, Claude, Cursor, and other MCP-compatible clients.",
        uk: "Playwright MCP налаштовується додаванням JSON-запису під 'mcpServers' у файлі конфігурації клієнта. Запис вказує 'command: npx' і 'args: [\"@playwright/mcp@latest\"]'. Для Claude Code це можна зробити однією CLI-командою: 'claude mcp add playwright npx @playwright/mcp@latest'. Той самий JSON-конфіг працює в VS Code, Claude, Cursor та інших MCP-сумісних клієнтах.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "After connecting Playwright MCP, what kinds of browser automation tools become available to the AI assistant?",
        uk: "Після підключення Playwright MCP які інструменти автоматизації браузера стають доступними AI-асистенту?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Only navigation and screenshot — no interaction tools are exposed",
            uk: "Тільки навігація і скриншот — жодних інструментів взаємодії не надається",
          },
        },
        {
          id: "b",
          label: {
            en: "Navigation, clicking, form filling, snapshot, screenshot, API mocking, and console log reading — the full browser automation toolkit",
            uk: "Навігація, кліки, заповнення форм, snapshot, screenshot, мокування API і читання логів консолі — повний набір інструментів автоматизації браузера",
          },
        },
        {
          id: "c",
          label: {
            en: "Only read-only tools — MCP cannot interact with the page, only observe it",
            uk: "Тільки інструменти тільки для читання — MCP не може взаємодіяти зі сторінкою, тільки спостерігати за нею",
          },
        },
        {
          id: "d",
          label: {
            en: "The same tools as the Playwright test runner — including test assertions and fixtures",
            uk: "Ті самі інструменти що й у test runner Playwright — включно з assertions тестів і fixtures",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright MCP exposes the full browser automation toolkit as MCP tools: browser_navigate, browser_click, browser_fill, browser_snapshot, browser_screenshot, browser_network_intercept (for API mocking), browser_console_messages, and more. The AI assistant can navigate, interact with forms, assert page state via snapshots, intercept network requests, and inspect console errors — all through natural language instructions.",
        uk: "Playwright MCP надає повний набір інструментів автоматизації браузера як MCP-інструменти: browser_navigate, browser_click, browser_fill, browser_snapshot, browser_screenshot, browser_network_intercept (для мокування API), browser_console_messages та інші. AI-асистент може навігувати, взаємодіяти з формами, перевіряти стан сторінки через snapshots, перехоплювати мережеві запити і перевіряти помилки консолі — все через інструкції природною мовою.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does adding '--headless' to the Playwright MCP args array change?",
        uk: "Що змінює додавання '--headless' до масиву args Playwright MCP?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The MCP server itself runs without a head process — it uses less CPU",
            uk: "Сам MCP-сервер запускається без head-процесу — використовує менше CPU",
          },
        },
        {
          id: "b",
          label: {
            en: "The browser runs without a visible window — useful for CI or when you don't need to watch the session",
            uk: "Браузер запускається без видимого вікна — корисно для CI або коли не потрібно спостерігати за сесією",
          },
        },
        {
          id: "c",
          label: {
            en: "Screenshots are disabled — only accessibility snapshots are available",
            uk: "Скриншоти вимкнені — доступні тільки accessibility snapshots",
          },
        },
        {
          id: "d",
          label: {
            en: "The AI model receives only text, not any visual output",
            uk: "AI-модель отримує тільки текст, без жодного візуального виводу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The --headless flag makes the browser run without creating a visible window. By default Playwright MCP uses a headed (visible) browser so you can watch the AI interact with the page. In headless mode the browser still processes pages and returns snapshots/screenshots — it just doesn't show a window on screen. This is the right choice for CI environments or unattended agent runs.",
        uk: "Прапорець --headless змушує браузер запускатися без створення видимого вікна. За замовчуванням Playwright MCP використовує headed (видимий) браузер щоб можна було спостерігати як AI взаємодіє зі сторінкою. В headless-режимі браузер все одно обробляє сторінки і повертає snapshots/screenshots — просто не показує вікно на екрані. Це правильний вибір для CI-середовищ або автономних запусків агента.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does the '--isolated' flag do in the Playwright MCP configuration?",
        uk: "Що робить прапорець '--isolated' у конфігурації Playwright MCP?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It prevents the MCP server from accessing the file system",
            uk: "Запобігає доступу MCP-сервера до файлової системи",
          },
        },
        {
          id: "b",
          label: {
            en: "Each session starts with a clean browser state — no cookies or localStorage carried over from previous sessions",
            uk: "Кожна сесія починається з чистим станом браузера — жодних cookies або localStorage перенесених з попередніх сесій",
          },
        },
        {
          id: "c",
          label: {
            en: "It runs the browser in a Docker container for security isolation",
            uk: "Запускає браузер у Docker-контейнері для ізоляції безпеки",
          },
        },
        {
          id: "d",
          label: {
            en: "It disables network access so the browser can only load local files",
            uk: "Вимикає мережевий доступ щоб браузер міг завантажувати тільки локальні файли",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By default, Playwright MCP uses a persistent browser profile — cookies and localStorage are preserved between sessions (like a real browser). The --isolated flag changes this: each new session starts with a completely clean browser state. This is useful when you want predictable, reproducible sessions without interference from previous auth state or site data.",
        uk: "За замовчуванням Playwright MCP використовує постійний профіль браузера — cookies і localStorage зберігаються між сесіями (як реальний браузер). Прапорець --isolated змінює це: кожна нова сесія починається з повністю чистим станом браузера. Це корисно коли потрібні передбачувані, відтворювані сесії без впливу попереднього auth-стану або даних сайту.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "In a browser_snapshot output, what are 'ref' values like 'ref=e8' used for?",
        uk: "У виводі browser_snapshot для чого використовуються значення 'ref' типу 'ref=e8'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are CSS class names that can be used as selectors in test code",
            uk: "Це CSS-класи які можна використовувати як селектори в коді тестів",
          },
        },
        {
          id: "b",
          label: {
            en: "They are stable element identifiers the model uses to target specific elements in browser_click, browser_fill, and other interaction tools",
            uk: "Це стабільні ідентифікатори елементів які модель використовує для адресації конкретних елементів у browser_click, browser_fill та інших інструментах взаємодії",
          },
        },
        {
          id: "c",
          label: {
            en: "They are internal Playwright IDs used only for debugging — you cannot use them in commands",
            uk: "Це внутрішні ID Playwright що використовуються тільки для дебагу — не можна використовувати їх у командах",
          },
        },
        {
          id: "d",
          label: {
            en: "They reference line numbers in the page's source code",
            uk: "Вони посилаються на номери рядків у вихідному коді сторінки",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Refs in snapshot output (like 'button \"Create order\" [ref=e8]') are stable element identifiers assigned by Playwright. The AI model reads the snapshot, identifies the element it wants to interact with by its ref, and passes that ref to the next tool call — e.g., browser_click with ref=e8. This allows precise targeting without pixel coordinates or fragile CSS selectors.",
        uk: "Refs у виводі snapshot (типу 'button \"Create order\" [ref=e8]') — це стабільні ідентифікатори елементів призначені Playwright. AI-модель читає snapshot, визначає елемент з яким хоче взаємодіяти за його ref, і передає той ref наступному виклику інструменту — наприклад browser_click з ref=e8. Це дозволяє точне адресування без пікселевих координат або крихких CSS-селекторів.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Which AI clients and editors are compatible with Playwright MCP?",
        uk: "Які AI-клієнти та редактори сумісні з Playwright MCP?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Only Claude — MCP is an Anthropic-specific protocol",
            uk: "Тільки Claude — MCP є протоколом специфічним для Anthropic",
          },
        },
        {
          id: "b",
          label: {
            en: "Any MCP-compatible client: VS Code, Claude (desktop and Claude Code), Cursor, and others that support the Model Context Protocol",
            uk: "Будь-який MCP-сумісний клієнт: VS Code, Claude (desktop і Claude Code), Cursor та інші що підтримують Model Context Protocol",
          },
        },
        {
          id: "c",
          label: {
            en: "Only editors with a built-in browser extension — standalone AI assistants are not supported",
            uk: "Тільки редактори з вбудованим розширенням браузера — автономні AI-асистенти не підтримуються",
          },
        },
        {
          id: "d",
          label: {
            en: "Only CLI-based tools — graphical AI clients cannot connect to MCP servers",
            uk: "Тільки CLI-інструменти — графічні AI-клієнти не можуть підключатися до MCP-серверів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "MCP (Model Context Protocol) is an open protocol, not specific to any one AI provider. Playwright MCP works with any client that supports MCP: VS Code with Copilot, Claude desktop app, Claude Code CLI, Cursor, and others. The same JSON config block ('mcpServers') is recognized by all of them — only the config file location differs between clients.",
        uk: "MCP (Model Context Protocol) — відкритий протокол, не специфічний для жодного одного AI-провайдера. Playwright MCP працює з будь-яким клієнтом що підтримує MCP: VS Code з Copilot, настільний додаток Claude, Claude Code CLI, Cursor та інші. Той самий JSON-блок конфігурації ('mcpServers') розпізнається всіма ними — відрізняється лише розташування файлу конфігурації між клієнтами.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want Playwright MCP to use Firefox instead of the default Chromium. How do you configure this?",
        uk: "Хочеш щоб Playwright MCP використовував Firefox замість Chromium за замовчуванням. Як це налаштувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set PLAYWRIGHT_BROWSER=firefox as an environment variable before starting the AI client",
            uk: "Встановити змінну середовища PLAYWRIGHT_BROWSER=firefox перед запуском AI-клієнта",
          },
        },
        {
          id: "b",
          label: {
            en: "Add '--browser=firefox' to the args array in the mcpServers config",
            uk: "Додати '--browser=firefox' до масиву args у конфігурації mcpServers",
          },
        },
        {
          id: "c",
          label: {
            en: "Install the Firefox MCP package separately: npx @playwright/mcp-firefox@latest",
            uk: "Встановити пакет Firefox MCP окремо: npx @playwright/mcp-firefox@latest",
          },
        },
        {
          id: "d",
          label: {
            en: "Browser selection is not configurable in Playwright MCP — it always uses Chromium",
            uk: "Вибір браузера не налаштовується в Playwright MCP — він завжди використовує Chromium",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Browser and other options are passed as extra entries in the 'args' array alongside '@playwright/mcp@latest'. Adding '--browser=firefox' tells the MCP server to launch Firefox. Similarly '--browser=webkit' uses WebKit (Safari). This is part of the same config block — no separate package or environment variable needed.",
        uk: "Браузер та інші параметри передаються як додаткові записи в масиві 'args' поруч з '@playwright/mcp@latest'. Додавання '--browser=firefox' каже MCP-серверу запускати Firefox. Аналогічно '--browser=webkit' використовує WebKit (Safari). Це частина того самого блоку конфігурації — не потрібен окремий пакет або змінна середовища.",
      },
    },
  ],
}
