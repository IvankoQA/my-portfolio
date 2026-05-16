import type { PlaywrightTopic } from "../../types"

export const gettingStartedCliTopic: PlaywrightTopic = {
  slug: "getting-started-cli",
  groupId: "getting-started",
  order: 210,
  level: "intermediate",
  trackOrder: 26,
  sourceDoc: "getting-started-cli.md",
  officialDocsUrl: "https://playwright.dev/docs/getting-started-cli",
  title: {
    en: "Coding agents",
    uk: "Агенти для кодування",
  },
  summary: {
    en: "playwright-cli is a token-efficient browser automation CLI built for coding agents like Claude Code. Instead of loading full tool schemas and accessibility trees into the model context, it exposes concise commands: open, click, type, screenshot, snapshot. Each command outputs minimal state.",
    uk: "playwright-cli — це token-efficient CLI для автоматизації браузера, побудований для агентів типу Claude Code. Замість завантаження повних схем інструментів і дерев доступності в контекст моделі — надає стислі команди: open, click, type, screenshot, snapshot. Кожна команда виводить мінімальний стан.",
  },
  sections: [
    {
      id: "what-is-playwright-cli",
      title: {
        en: "What playwright-cli is and why it exists",
        uk: "Що таке playwright-cli і навіщо він існує",
      },
      paragraphs: [
        {
          en: "Regular Playwright MCP exposes full browser state to the model — useful for deep exploration, but expensive in tokens. `playwright-cli` takes the opposite approach: short commands, minimal output, designed for agents that need to balance browser automation with large codebases and limited context windows.",
          uk: "Звичайний Playwright MCP надає повний стан браузера моделі — корисно для глибокого дослідження, але дорого в токенах. `playwright-cli` йде протилежним шляхом: короткі команди, мінімальний вивід, розроблено для агентів що поєднують автоматизацію браузера з великою кодовою базою і обмеженим контекстом.",
        },
        {
          en: "Use `playwright-cli` when: the agent is working on a codebase and occasionally needs to check something in the browser. Use MCP when: the agent needs to explore page structure deeply and reason over it iteratively.",
          uk: "Використовуй `playwright-cli` коли: агент працює з кодовою базою і час від часу потребує перевірити щось у браузері. Використовуй MCP коли: агент потребує глибоко досліджувати структуру сторінки і ітеративно міркувати над нею.",
        },
      ],
      codeBlocks: [
        {
          id: "install",
          language: "bash",
          code: `# Встановити глобально
npm install -g @playwright/cli@latest

# Або через npx (без глобального встановлення)
npx playwright-cli --help

# Встановити skills для кращого контексту в агентах
playwright-cli install --skills`,
        },
      ],
    },
    {
      id: "core-commands",
      title: {
        en: "Core commands",
        uk: "Основні команди",
      },
      paragraphs: [
        {
          en: "The most common commands I use when asking an agent to test something in the browser:",
          uk: "Найпоширеніші команди які я використовую коли прошу агента протестувати щось у браузері:",
        },
      ],
      codeBlocks: [
        {
          id: "basic-flow",
          language: "bash",
          code: `# Відкрити сторінку
playwright-cli open https://localhost:3000/orders

# Взаємодіяти
playwright-cli click "role=button[name=Create order]"
playwright-cli fill "label=Item name" "Laptop Stand"
playwright-cli press Enter

# Перевірити стан
playwright-cli snapshot         # структура сторінки (для агента)
playwright-cli screenshot       # візуальний знімок

# Навігація
playwright-cli goto /orders/42
playwright-cli go-back`,
        },
        {
          id: "element-refs",
          language: "bash",
          code: `# snapshot повертає refs для кожного елементу
playwright-cli snapshot
# → [e15] Create order button
# → [e22] Item name input

# Використати ref для точного кліку
playwright-cli click e15
playwright-cli fill e22 "Laptop Stand"`,
        },
      ],
    },
    {
      id: "sessions",
      title: {
        en: "Sessions — keep browser state between commands",
        uk: "Сесії — зберігати стан браузера між командами",
      },
      paragraphs: [
        {
          en: "By default, CLI keeps browser state in memory — cookies and localStorage persist between calls within a session but reset when the browser closes. Named sessions let you run multiple browsers for different contexts.",
          uk: "За замовчуванням CLI зберігає стан браузера в пам'яті — cookies і localStorage зберігаються між викликами в межах сесії але скидаються коли браузер закривається. Іменовані сесії дозволяють запускати кілька браузерів для різних контекстів.",
        },
      ],
      codeBlocks: [
        {
          id: "sessions",
          language: "bash",
          code: `# Іменована сесія — для ізоляції різних проєктів
playwright-cli -s=crm open https://localhost:3000 --persistent
playwright-cli -s=admin open https://localhost:3000/admin

# Переглянути активні сесії
playwright-cli list

# Передати сесію агенту через env
PLAYWRIGHT_CLI_SESSION=crm claude .`,
        },
      ],
    },
    {
      id: "monitoring",
      title: {
        en: "Monitoring all sessions",
        uk: "Моніторинг всіх сесій",
      },
      paragraphs: [
        {
          en: "`playwright-cli show` opens a visual dashboard in the browser where you can see all running sessions with live screencasts. You can click into any session to take over mouse and keyboard control.",
          uk: "`playwright-cli show` відкриває візуальну панель у браузері де видно всі запущені сесії з live screencasts. Можна клацнути на будь-яку сесію щоб перейняти контроль мишкою і клавіатурою.",
        },
      ],
      codeBlocks: [
        {
          id: "monitor",
          language: "bash",
          code: `# Відкрити панель моніторингу
playwright-cli show`,
        },
      ],
    },
    {
      id: "asking-agent",
      title: {
        en: "How to ask a coding agent to use playwright-cli",
        uk: "Як просити агента використовувати playwright-cli",
      },
      paragraphs: [
        {
          en: "The simplest way: just describe what to test and mention playwright-cli. The agent will discover commands via `playwright-cli --help` or use installed skills.",
          uk: "Найпростіший спосіб: просто опиши що протестувати і згадай playwright-cli. Агент знайде команди через `playwright-cli --help` або використає встановлені skills.",
        },
      ],
      codeBlocks: [
        {
          id: "agent-prompt",
          language: "text",
          code: `Протестуй flow створення замовлення на http://localhost:3000
використовуючи playwright-cli.

1. Відкрий /orders/new
2. Заповни форму: Item = "Laptop Stand", Quantity = 2
3. Підтвердь замовлення
4. Перевір що з'явився banner "Order created"
5. Зроби screenshot фінального стану`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "What's the main advantage of playwright-cli over Playwright MCP for coding agents?",
        uk: "Яка головна перевага playwright-cli перед Playwright MCP для агентів для кодування?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "playwright-cli supports more browsers than MCP",
            uk: "playwright-cli підтримує більше браузерів ніж MCP",
          },
        },
        {
          id: "b",
          label: {
            en: "playwright-cli uses fewer tokens — concise commands and minimal output instead of full accessibility trees",
            uk: "playwright-cli використовує менше токенів — стислі команди і мінімальний вивід замість повних дерев доступності",
          },
        },
        {
          id: "c",
          label: {
            en: "playwright-cli is faster because it doesn't use a browser",
            uk: "playwright-cli швидший бо не використовує браузер",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Token efficiency is the whole point. MCP exposes full page structure and tool schemas into the model context — useful for exploration but expensive. playwright-cli outputs just what the agent needs to proceed. When an agent is working on a codebase and needs to occasionally check browser behavior, burning the context on full accessibility trees hurts its ability to reason over code.",
        uk: "Економія токенів — весь сенс. MCP надає повну структуру сторінки і схеми інструментів у контекст моделі — корисно для дослідження але дорого. playwright-cli виводить тільки те що агенту потрібно для продовження. Коли агент працює з кодовою базою і час від часу перевіряє поведінку браузера — витрачати контекст на повні дерева доступності шкодить його здатності міркувати про код.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "How do browser sessions work in playwright-cli within a single session?",
        uk: "Як працюють сесії браузера в playwright-cli в межах однієї сесії?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Each command opens a fresh browser with no cookies or localStorage",
            uk: "Кожна команда відкриває свіжий браузер без cookies або localStorage",
          },
        },
        {
          id: "b",
          label: {
            en: "Browser state (cookies, localStorage) persists between commands within a session but resets when the browser closes",
            uk: "Стан браузера (cookies, localStorage) зберігається між командами в межах сесії але скидається коли браузер закривається",
          },
        },
        {
          id: "c",
          label: {
            en: "All state is stored on disk and persists indefinitely until manually cleared",
            uk: "Весь стан зберігається на диску і зберігається безстроково поки не буде вручну очищений",
          },
        },
        {
          id: "d",
          label: {
            en: "Sessions in playwright-cli are stateless — you must pass auth tokens with every command",
            uk: "Сесії в playwright-cli не мають стану — потрібно передавати токени авторизації з кожною командою",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Within a playwright-cli session, the browser keeps state in memory — cookies set by one command are available to the next command in the same session. This means a login done with 'playwright-cli fill' persists for subsequent 'playwright-cli click' calls. When the browser closes (or the session ends), state is lost. Named sessions (playwright-cli -s=name) allow running multiple isolated browsers simultaneously.",
        uk: "В межах сесії playwright-cli браузер зберігає стан в пам'яті — cookies встановлені однією командою доступні наступній команді в тій же сесії. Це означає що логін виконаний через 'playwright-cli fill' зберігається для наступних викликів 'playwright-cli click'. Коли браузер закривається (або сесія завершується) стан втрачається. Іменовані сесії (playwright-cli -s=name) дозволяють одночасно запускати кілька ізольованих браузерів.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the difference between 'playwright-cli snapshot' and 'playwright-cli screenshot'?",
        uk: "Яка різниця між 'playwright-cli snapshot' і 'playwright-cli screenshot'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "snapshot saves a full HTML file; screenshot saves a PNG — both are for human review",
            uk: "snapshot зберігає повний HTML файл; screenshot зберігає PNG — обидва для людського перегляду",
          },
        },
        {
          id: "b",
          label: {
            en: "snapshot outputs a structured text representation of page elements (for agent reasoning); screenshot saves a visual PNG image (for human review or visual comparison)",
            uk: "snapshot виводить структурований текстовий опис елементів сторінки (для міркування агента); screenshot зберігає візуальне PNG зображення (для людського перегляду або візуального порівняння)",
          },
        },
        {
          id: "c",
          label: {
            en: "They are identical — 'snapshot' is just an alias for 'screenshot'",
            uk: "Вони ідентичні — 'snapshot' просто псевдонім для 'screenshot'",
          },
        },
        {
          id: "d",
          label: {
            en: "snapshot captures network requests; screenshot captures the DOM",
            uk: "snapshot захоплює мережеві запити; screenshot захоплює DOM",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "snapshot outputs a structured accessibility-tree-like text representation of the page — element roles, text, and refs. This is what the AI agent reads to understand page structure without needing vision capabilities. screenshot produces a PNG image file, useful for human review or when you need to verify visual layout. In a token-efficient workflow, prefer snapshot over screenshot whenever possible.",
        uk: "snapshot виводить структурований текстовий опис сторінки схожий на дерево доступності — ролі елементів, текст і refs. Це те що AI-агент читає щоб розуміти структуру сторінки без потреби у візуальних можливостях. screenshot створює PNG-файл зображення, корисний для людського перегляду або коли потрібно перевірити візуальний макет. В token-efficient workflow надавай перевагу snapshot над screenshot коли можливо.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "After running 'playwright-cli snapshot', you see output like '[e15] Create order button'. How do you click that element?",
        uk: "Після запуску 'playwright-cli snapshot' бачиш вивід '[e15] Create order button'. Як клікнути на той елемент?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "playwright-cli click \"Create order button\"",
            uk: "playwright-cli click \"Create order button\"",
          },
        },
        {
          id: "b",
          label: {
            en: "playwright-cli click e15",
            uk: "playwright-cli click e15",
          },
        },
        {
          id: "c",
          label: {
            en: "playwright-cli click --ref=e15",
            uk: "playwright-cli click --ref=e15",
          },
        },
        {
          id: "d",
          label: {
            en: "playwright-cli click \"role=button[name=Create order]\"",
            uk: "playwright-cli click \"role=button[name=Create order]\"",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Refs like 'e15' in snapshot output are element references that playwright-cli uses for precise targeting. You pass the ref directly as the argument to 'click', 'fill', and other interaction commands. This avoids having to re-describe the locator — the agent reads the snapshot, picks the ref, and acts on it immediately. This is the core interaction pattern that makes playwright-cli efficient for agents.",
        uk: "Refs типу 'e15' у виводі snapshot — це посилання на елементи які playwright-cli використовує для точного адресування. Ти передаєш ref напряму як аргумент до 'click', 'fill' та інших команд взаємодії. Це уникає необхідності повторно описувати локатор — агент читає snapshot, вибирає ref і одразу діє на нього. Це основний шаблон взаємодії що робить playwright-cli ефективним для агентів.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does 'playwright-cli show' open?",
        uk: "Що відкриває 'playwright-cli show'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "A terminal dashboard listing all CLI commands and their usage",
            uk: "Термінальна панель що виводить всі CLI-команди та їх використання",
          },
        },
        {
          id: "b",
          label: {
            en: "A visual browser dashboard showing all running sessions with live screencasts, where you can take over mouse and keyboard control",
            uk: "Візуальна панель браузера що показує всі запущені сесії з live screencasts, де можна перейняти контроль мишкою і клавіатурою",
          },
        },
        {
          id: "c",
          label: {
            en: "The Playwright HTML test report for the last test run",
            uk: "HTML-звіт тестів Playwright для останнього запуску",
          },
        },
        {
          id: "d",
          label: {
            en: "A JSON file with the current page state and active sessions",
            uk: "JSON-файл з поточним станом сторінки і активними сесіями",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "'playwright-cli show' opens a visual monitoring dashboard in your default browser. It displays all currently running playwright-cli sessions with live screencast previews so you can see what each agent session is doing in real time. You can click into any session to take over with your own mouse and keyboard — useful for debugging or manually completing a step an agent got stuck on.",
        uk: "'playwright-cli show' відкриває візуальну моніторингову панель у твоєму браузері за замовчуванням. Вона показує всі поточні запущені сесії playwright-cli з live screencast превью щоб бачити що робить кожна агентська сесія в реальному часі. Можна клацнути на будь-яку сесію щоб перейняти контроль своєю мишкою і клавіатурою — корисно для дебагу або ручного завершення кроку на якому агент застрягнув.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "When should you choose playwright-cli over writing standard Playwright tests?",
        uk: "Коли варто вибирати playwright-cli замість написання стандартних тестів Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Always — playwright-cli is a superset of Playwright tests and replaces them entirely",
            uk: "Завжди — playwright-cli є надмножиною тестів Playwright і повністю замінює їх",
          },
        },
        {
          id: "b",
          label: {
            en: "When a coding agent needs to occasionally check browser state while working on a codebase — playwright-cli keeps token cost low",
            uk: "Коли агенту для кодування потрібно час від часу перевіряти стан браузера поки він працює з кодовою базою — playwright-cli тримає вартість токенів низькою",
          },
        },
        {
          id: "c",
          label: {
            en: "Only for mobile device testing — playwright-cli has better mobile support than standard Playwright",
            uk: "Тільки для тестування мобільних пристроїв — playwright-cli має кращу підтримку мобільних ніж стандартний Playwright",
          },
        },
        {
          id: "d",
          label: {
            en: "When tests need to run in parallel — playwright-cli handles parallelism automatically",
            uk: "Коли тести потрібно запускати паралельно — playwright-cli автоматично обробляє паралелізм",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "playwright-cli fills a specific niche: coding agents that primarily work with code and only occasionally need to interact with a browser. For that use case, loading full MCP tool schemas and accessibility trees into the context is wasteful. playwright-cli's minimal output keeps the agent's context window available for code reasoning. For persistent test suites that run on CI, standard Playwright tests remain the right choice.",
        uk: "playwright-cli займає конкретну нішу: агенти для кодування які переважно працюють з кодом і лише час від часу потребують взаємодії з браузером. Для цього випадку завантаження повних схем інструментів MCP і дерев доступності в контекст є марнотратним. Мінімальний вивід playwright-cli зберігає контекстне вікно агента доступним для міркування про код. Для постійних наборів тестів що виконуються на CI стандартні тести Playwright залишаються правильним вибором.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you install playwright-cli and then install skills for better agent context?",
        uk: "Як встановити playwright-cli і потім встановити skills для кращого контексту агента?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npm install playwright-cli && playwright-cli --setup",
            uk: "npm install playwright-cli && playwright-cli --setup",
          },
        },
        {
          id: "b",
          label: {
            en: "npm install -g @playwright/cli@latest && playwright-cli install --skills",
            uk: "npm install -g @playwright/cli@latest && playwright-cli install --skills",
          },
        },
        {
          id: "c",
          label: {
            en: "npx @playwright/mcp@latest install && mcp install --skills",
            uk: "npx @playwright/mcp@latest install && mcp install --skills",
          },
        },
        {
          id: "d",
          label: {
            en: "npm install @playwright/test && playwright install --skills",
            uk: "npm install @playwright/test && playwright install --skills",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The package name is '@playwright/cli' (scoped under @playwright). Installing globally with -g makes 'playwright-cli' available as a shell command. The 'playwright-cli install --skills' command adds context files that help coding agents discover available commands and workflows without needing to explore the CLI manually.",
        uk: "Назва пакету — '@playwright/cli' (у просторі імен @playwright). Глобальне встановлення через -g робить 'playwright-cli' доступним як shell-команда. Команда 'playwright-cli install --skills' додає контекстні файли які допомагають агентам для кодування знаходити доступні команди і workflows без необхідності досліджувати CLI вручну.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want an agent to test multiple users simultaneously — admin and a regular user — in isolated browser contexts. How do named sessions help?",
        uk: "Хочеш щоб агент тестував кількох користувачів одночасно — адміна і звичайного користувача — в ізольованих браузерних контекстах. Як іменовані сесії допомагають?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Named sessions are not possible — playwright-cli only supports one browser at a time",
            uk: "Іменовані сесії неможливі — playwright-cli підтримує лише один браузер одночасно",
          },
        },
        {
          id: "b",
          label: {
            en: "Use 'playwright-cli -s=admin' and 'playwright-cli -s=user' — each named session runs its own isolated browser with separate cookies and localStorage",
            uk: "Використовувати 'playwright-cli -s=admin' і 'playwright-cli -s=user' — кожна іменована сесія запускає свій ізольований браузер з окремими cookies і localStorage",
          },
        },
        {
          id: "c",
          label: {
            en: "Open two terminal windows and run playwright-cli in each — they automatically use different browsers",
            uk: "Відкрити два вікна терміналу і запустити playwright-cli в кожному — вони автоматично використовують різні браузери",
          },
        },
        {
          id: "d",
          label: {
            en: "Pass --isolated to playwright-cli open to create a new incognito context each time",
            uk: "Передати --isolated до playwright-cli open щоб щоразу створювати новий incognito контекст",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Named sessions (playwright-cli -s=<name>) spin up separate browser instances that are fully isolated from each other. The admin session has its own cookies, localStorage, and navigation state independent from the user session. You can also pass the session name to an agent via the PLAYWRIGHT_CLI_SESSION environment variable so it automatically uses the right session. This makes multi-user testing scenarios straightforward.",
        uk: "Іменовані сесії (playwright-cli -s=<name>) запускають окремі екземпляри браузера які повністю ізольовані один від одного. Сесія адміна має власні cookies, localStorage і стан навігації незалежно від сесії користувача. Також можна передати назву сесії агенту через змінну середовища PLAYWRIGHT_CLI_SESSION щоб він автоматично використовував правильну сесію. Це робить сценарії тестування для кількох користувачів простими.",
      },
    },
  ],
}
