import type { PlaywrightTopic } from "../../types"

export const codegenTopic: PlaywrightTopic = {
  slug: "codegen",
  groupId: "getting-started",
  order: 155,
  level: "beginner",
  trackOrder: 14,
  sourceDoc: "codegen.md",
  officialDocsUrl: "https://playwright.dev/docs/codegen",
  title: {
    en: "Test generator",
    uk: "Генератор тестів",
  },
  summary: {
    en: "The full codegen reference: CLI flags for viewport/device/locale emulation, saving and loading auth state for sessions, and recording at cursor from VS Code. I use this when I need more control than the basic 'npx playwright codegen URL' — for example, recording a flow that requires being logged in, or testing on a specific device.",
    uk: "Повна довідка codegen: CLI-прапорці для емуляції viewport/пристрою/локалі, збереження і завантаження auth-стану між сесіями, запис у позиції курсору з VS Code. Використовую коли потрібно більше контролю ніж базовий 'npx playwright codegen URL' — наприклад, записати флоу що вимагає авторизації або тестувати на конкретному пристрої.",
  },
  sections: [
    {
      id: "vs-code-recording",
      title: {
        en: "Recording from VS Code",
        uk: "Запис з VS Code",
      },
      paragraphs: [
        {
          en: "With the Playwright VS Code extension installed, I can record tests directly in the editor without opening a terminal. Two modes I use regularly:",
          uk: "Маючи встановлене розширення Playwright для VS Code, можна записувати тести прямо в редакторі без відкриття терміналу. Два режими які я регулярно використовую:",
        },
        {
          en: "**Record new** — opens a new browser window and creates a new spec file. I click around in the app, assertions appear in the file, I stop recording and clean up the result.",
          uk: "**Record new** — відкриває нове вікно браузера і створює новий spec-файл. Клікаю в застосунку, assertions з'являються у файлі, зупиняю запис і прибираю результат.",
        },
        {
          en: "**Record at cursor** — I place the cursor at a specific line inside an existing test and click Record at cursor. The browser opens at that point in the test execution and any new actions I take are inserted at the cursor position. This is useful when I want to add steps to the middle of an existing test.",
          uk: "**Record at cursor** — ставлю курсор на конкретний рядок усередині існуючого тесту і клікаю Record at cursor. Браузер відкривається на тій точці виконання тесту і нові дії вставляються в позиції курсору. Корисно коли хочу додати кроки всередину існуючого тесту.",
        },
        {
          en: "**Pick locator** — no recording, just hover over elements to see the recommended locator. I press Enter to copy it to clipboard.",
          uk: "**Pick locator** — без запису, просто наводжу на елементи щоб побачити рекомендований локатор. Натискаю Enter щоб скопіювати в буфер.",
        },
      ],
    },
    {
      id: "emulation-flags",
      title: {
        en: "Emulation flags",
        uk: "Прапорці емуляції",
      },
      paragraphs: [
        {
          en: "I pass emulation flags directly to the `codegen` command when I want the recorded test to include device-specific settings. The generated test code will include the emulation settings so the test runs with the same configuration when executed.",
          uk: "Передаю прапорці емуляції напряму в команду `codegen` коли хочу щоб записаний тест включав специфічні налаштування пристрою. Згенерований код тесту включатиме ці налаштування щоб тест виконувався з такою ж конфігурацією.",
        },
      ],
      codeBlocks: [
        {
          id: "emulation-examples",
          language: "bash",
          code: `# Конкретний розмір вьюпорту
npx playwright codegen --viewport-size="1280,720" http://localhost:3000

# Емуляція мобільного пристрою (viewport + user agent)
npx playwright codegen --device="iPhone 13" http://localhost:3000/orders

# Темна кольорова схема
npx playwright codegen --color-scheme=dark http://localhost:3000

# Геолокація + часовий пояс + локаль
npx playwright codegen --timezone="Europe/Kyiv" --geolocation="50.45,30.52" --lang="uk-UA" http://localhost:3000`,
        },
      ],
    },
    {
      id: "auth-state",
      title: {
        en: "Recording with saved auth state",
        uk: "Запис зі збереженим auth-станом",
      },
      paragraphs: [
        {
          en: "The most useful codegen workflow I've found for authenticated apps: first record a login session and save the auth state to a file. Then load that state in subsequent sessions — I start already logged in, so I can record flows that require authentication without re-logging in each time.",
          uk: "Найкорисніший codegen workflow для застосунків з авторизацією: спочатку записую сесію логіну і зберігаю auth-стан у файл. Потім завантажую цей стан у наступних сесіях — починаю вже залогованим і можу записувати флоу що вимагають авторизації без повторного логіну кожного разу.",
        },
        {
          en: "Important: `auth.json` contains cookies and localStorage — sensitive data. I always add it to `.gitignore` and delete it when I'm done.",
          uk: "Важливо: `auth.json` містить cookies і localStorage — чутливі дані. Завжди додаю його до `.gitignore` і видаляю коли закінчу.",
        },
      ],
      codeBlocks: [
        {
          id: "save-auth",
          language: "bash",
          code: `# Крок 1: Записати логін і зберегти стан
npx playwright codegen --save-storage=auth.json http://localhost:3000/login
# → логінюсь, закриваю браузер → auth.json містить cookies + localStorage

# Крок 2: Записати флоу починаючи вже авторизованим
npx playwright codegen --load-storage=auth.json http://localhost:3000/orders
# → відкривається вже залогована сторінка /orders`,
        },
        {
          id: "gitignore",
          language: "bash",
          code: `# .gitignore — ніколи не комітити auth-стан
auth.json
playwright/.auth/`,
        },
      ],
    },
    {
      id: "custom-setup",
      title: {
        en: "Recording with a custom browser setup",
        uk: "Запис з нестандартним налаштуванням браузера",
      },
      paragraphs: [
        {
          en: "Sometimes I want to record actions in a browser that's already configured — with request mocking, custom headers, or a specific base URL. For this I use `page.pause()` in a script: Playwright opens Inspector with the Codegen panel, and I can interact and record from that pre-configured state.",
          uk: "Іноді хочу записувати дії в браузері який вже налаштований — з мокуванням запитів, кастомними заголовками або конкретним базовим URL. Для цього використовую `page.pause()` у скрипті: Playwright відкриває Inspector з панеллю Codegen і я можу взаємодіяти та записувати з того попередньо налаштованого стану.",
        },
      ],
      codeBlocks: [
        {
          id: "page-pause",
          language: "ts",
          code: `// record-custom.ts — запуск у headed-режимі з кастомним налаштуванням
import { chromium } from '@playwright/test'

;(async () => {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: { 'X-Test-Mode': 'true' },
  })

  // Перехопити запити до /api/external перед записом
  await context.route('**/api/external/**', route => route.fulfill({ json: { mocked: true } }))

  const page = await context.newPage()
  await page.goto('/orders')

  // Відкрити Inspector — тепер можна клікати і записувати
  await page.pause()

  await browser.close()
})()`,
        },
        {
          id: "run-custom",
          language: "bash",
          code: `npx ts-node record-custom.ts`,
        },
      ],
    },
    {
      id: "output-to-file",
      title: {
        en: "Saving generated code to a file",
        uk: "Збереження згенерованого коду у файл",
      },
      paragraphs: [
        {
          en: "By default codegen copies code to the clipboard. To save directly to a file:",
          uk: "За замовчуванням codegen копіює код у буфер обміну. Щоб зберегти прямо у файл:",
        },
      ],
      codeBlocks: [
        {
          id: "output-flag",
          language: "bash",
          code: `# Зберегти прямо у spec-файл
npx playwright codegen --output=tests/orders.spec.ts http://localhost:3000/orders

# Генерувати Python-код замість TypeScript
npx playwright codegen --target=python http://localhost:3000

# Генерувати для конкретної мови
npx playwright codegen --target=java http://localhost:3000`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want to record a test for the /orders page but it requires authentication. The login flow is complex (MFA, redirects). What's the most efficient approach?",
        uk: "Хочеш записати тест для сторінки /orders але вона вимагає авторизації. Флоу логіну складний (MFA, редиректи). Який найефективніший підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Record the full test including login every time",
            uk: "Записувати повний тест включаючи логін щоразу",
          },
        },
        {
          id: "b",
          label: {
            en: "Record login once with --save-storage=auth.json, then record the /orders flow with --load-storage=auth.json — start already authenticated",
            uk: "Записати логін один раз з --save-storage=auth.json, потім записати флоу /orders з --load-storage=auth.json — починати вже авторизованим",
          },
        },
        {
          id: "c",
          label: {
            en: "Manually set up auth state in the test file before recording",
            uk: "Вручну налаштувати auth-стан у файлі тесту перед записом",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`--save-storage` captures all cookies, localStorage, and IndexedDB at the end of the codegen session. `--load-storage` restores exactly that state at the start of the next session. This means I go through the complex login flow once, save it, and all subsequent codegen sessions start already on the authenticated page. The same `auth.json` file can then be used in tests via `storageState` in playwright.config.ts.",
        uk: "`--save-storage` захоплює всі cookies, localStorage і IndexedDB в кінці сесії codegen. `--load-storage` відновлює саме цей стан на початку наступної сесії. Тобто проходжу складний флоу логіну один раз, зберігаю, і всі наступні сесії codegen починаються вже на авторизованій сторінці. Той самий файл `auth.json` потім можна використовувати в тестах через `storageState` у playwright.config.ts.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Which CLI command runs codegen and opens a browser at a specific URL?",
        uk: "Яка CLI-команда запускає codegen і відкриває браузер за конкретним URL?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright record http://localhost:3000",
            uk: "npx playwright record http://localhost:3000",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright codegen http://localhost:3000",
            uk: "npx playwright codegen http://localhost:3000",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright open --record http://localhost:3000",
            uk: "npx playwright open --record http://localhost:3000",
          },
        },
        {
          id: "d",
          label: {
            en: "npx playwright test --codegen http://localhost:3000",
            uk: "npx playwright test --codegen http://localhost:3000",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "'npx playwright codegen <URL>' is the correct subcommand. It opens a headed browser at that URL and the Playwright Inspector side by side. The other variants ('record', 'open --record', 'test --codegen') are not valid Playwright CLI commands.",
        uk: "'npx playwright codegen <URL>' — правильна підкоманда. Вона відкриває headed-браузер за тим URL і Playwright Inspector поруч. Інші варіанти ('record', 'open --record', 'test --codegen') не є дійсними командами Playwright CLI.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "In the Playwright Inspector during a codegen session, how do you switch to Pick Locator mode without adding new action code?",
        uk: "У Playwright Inspector під час сесії codegen, як перейти в режим Pick Locator без додавання нового коду дій?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Press Escape — this pauses recording and activates Pick Locator automatically",
            uk: "Натиснути Escape — це призупиняє запис і автоматично активує Pick Locator",
          },
        },
        {
          id: "b",
          label: {
            en: "Click Stop to pause recording, then click the Pick Locator button in the Inspector toolbar",
            uk: "Клацнути Stop щоб призупинити запис, потім клацнути кнопку Pick Locator на панелі інструментів Inspector",
          },
        },
        {
          id: "c",
          label: {
            en: "Open a new codegen session with the --pick-locator flag",
            uk: "Відкрити нову сесію codegen з прапорцем --pick-locator",
          },
        },
        {
          id: "d",
          label: {
            en: "Right-click the element in the browser and choose 'Copy Playwright locator'",
            uk: "Клацнути правою кнопкою на елементі в браузері і вибрати 'Copy Playwright locator'",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "You must first press Stop (or click the record button to pause) so your browser clicks don't generate action code. Then click Pick Locator in the Inspector. Now hovering over elements shows the suggested locator in real time — click the element to lock the locator in the playground where you can also edit and test it before copying.",
        uk: "Потрібно спочатку натиснути Stop (або клацнути кнопку запису для паузи) щоб кліки в браузері не генерували код дій. Потім клацнути Pick Locator в Inspector. Тепер наведення на елементи показує запропонований локатор в реальному часі — клацни елемент щоб зафіксувати локатор в playground де також можна відредагувати і протестувати його перед копіюванням.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does the generated test code from codegen look like after clicking a button and asserting a success message?",
        uk: "Як виглядає згенерований код тесту з codegen після кліку на кнопку і assertion повідомлення успіху?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Raw JavaScript with document.querySelector and no await keywords",
            uk: "Чистий JavaScript з document.querySelector і без ключових слів await",
          },
        },
        {
          id: "b",
          label: {
            en: "A Playwright test with async/await, page.goto(), getByRole() clicks, and expect().toBeVisible() assertions",
            uk: "Тест Playwright з async/await, page.goto(), кліками getByRole() і assertions expect().toBeVisible()",
          },
        },
        {
          id: "c",
          label: {
            en: "Selenium-style code using driver.findElement() and explicit waits",
            uk: "Код у стилі Selenium з driver.findElement() і явними очікуваннями",
          },
        },
        {
          id: "d",
          label: {
            en: "A JSON file describing actions that Playwright reads and executes",
            uk: "JSON-файл що описує дії які Playwright читає і виконує",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Codegen generates proper TypeScript (or the target language you specify) with the Playwright test framework. The output includes the test() wrapper, async page parameter, page.goto() for navigation, getByRole()/getByLabel()/getByText() locators with await for actions, and expect() assertions. Await is placed correctly on every async operation — the generated code is idiomatic Playwright.",
        uk: "Codegen генерує правильний TypeScript (або цільову мову яку вкажеш) з тестовим фреймворком Playwright. Вивід включає обгортку test(), async параметр page, page.goto() для навігації, локатори getByRole()/getByLabel()/getByText() з await для дій і assertions expect(). Await розставляється правильно на кожній асинхронній операції — згенерований код є ідіоматичним Playwright.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you record a codegen session that emulates an iPhone 13 device?",
        uk: "Як записати сесію codegen що емулює пристрій iPhone 13?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Drag the browser window to a mobile screen size during recording",
            uk: "Перетягнути вікно браузера до розміру мобільного екрана під час запису",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright codegen --device=\"iPhone 13\" http://localhost:3000",
            uk: "npx playwright codegen --device=\"iPhone 13\" http://localhost:3000",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright codegen --mobile http://localhost:3000",
            uk: "npx playwright codegen --mobile http://localhost:3000",
          },
        },
        {
          id: "d",
          label: {
            en: "npx playwright codegen --viewport=390x844 --useragent=mobile http://localhost:3000",
            uk: "npx playwright codegen --viewport=390x844 --useragent=mobile http://localhost:3000",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The --device flag accepts a device name from Playwright's built-in device list (e.g., 'iPhone 13', 'Pixel 5', 'iPad Pro'). It sets the correct viewport, user agent, and device scale factor for that device. The generated test code will include the device emulation settings so the test runs with the same configuration. --mobile and manually specifying viewport+useragent are not how Playwright's device emulation works.",
        uk: "Прапорець --device приймає назву пристрою зі вбудованого списку пристроїв Playwright (наприклад 'iPhone 13', 'Pixel 5', 'iPad Pro'). Він встановлює правильний viewport, user agent і device scale factor для того пристрою. Згенерований код тесту буде включати налаштування емуляції пристрою щоб тест запускався з такою ж конфігурацією. --mobile і ручне вказання viewport+useragent — це не те як працює емуляція пристроїв Playwright.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You use --save-storage=auth.json with codegen. What does this file contain and why should you add it to .gitignore?",
        uk: "Ти використовуєш --save-storage=auth.json з codegen. Що містить цей файл і чому його потрібно додати до .gitignore?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The recorded test code — .gitignore is needed to avoid committing auto-generated tests",
            uk: "Записаний код тесту — .gitignore потрібен щоб уникнути комміту автоматично згенерованих тестів",
          },
        },
        {
          id: "b",
          label: {
            en: "Cookies, localStorage, and IndexedDB from the browser session — sensitive auth data that should never be committed to source control",
            uk: "Cookies, localStorage і IndexedDB з сесії браузера — чутливі auth-дані які ніколи не повинні потрапляти в систему контролю версій",
          },
        },
        {
          id: "c",
          label: {
            en: "Browser configuration settings that are machine-specific and would conflict with other developers",
            uk: "Налаштування браузера специфічні для машини які конфліктували б з іншими розробниками",
          },
        },
        {
          id: "d",
          label: {
            en: "A Playwright config snapshot — only needed to avoid large file size in git history",
            uk: "Snapshot конфігурації Playwright — потрібен тільки щоб уникнути великого розміру файлу в git history",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "auth.json captured by --save-storage contains all browser session data: cookies (including session tokens), localStorage entries, and IndexedDB. These are real credentials that would allow anyone who has the file to authenticate as you. Committing this to git — especially a public repo — is a security incident. Always add auth.json and playwright/.auth/ to .gitignore immediately after creating them.",
        uk: "auth.json захоплений --save-storage містить всі дані сесії браузера: cookies (включно з токенами сесій), записи localStorage і IndexedDB. Це реальні облікові дані які дозволять будь-кому хто має файл автентифікуватися як ти. Комміт цього в git — особливо в публічний репозиторій — це інцидент безпеки. Завжди додавай auth.json і playwright/.auth/ до .gitignore одразу після їх створення.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you save the generated code directly to a file instead of relying on the clipboard?",
        uk: "Як зберегти згенерований код прямо у файл замість того щоб покладатися на буфер обміну?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright codegen --output=tests/orders.spec.ts http://localhost:3000",
            uk: "npx playwright codegen --output=tests/orders.spec.ts http://localhost:3000",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright codegen http://localhost:3000 > tests/orders.spec.ts",
            uk: "npx playwright codegen http://localhost:3000 > tests/orders.spec.ts",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright codegen --save tests/orders.spec.ts http://localhost:3000",
            uk: "npx playwright codegen --save tests/orders.spec.ts http://localhost:3000",
          },
        },
        {
          id: "d",
          label: {
            en: "npx playwright codegen --file=tests/orders.spec.ts http://localhost:3000",
            uk: "npx playwright codegen --file=tests/orders.spec.ts http://localhost:3000",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "The --output flag writes the generated test code directly to the specified file path as you record. This is cleaner than copying from the clipboard, especially for longer recordings. Shell redirection (option b) doesn't work because codegen is an interactive GUI tool, not a command that prints to stdout. The --save and --file flags do not exist in Playwright's codegen CLI.",
        uk: "Прапорець --output записує згенерований код тесту прямо у вказаний шлях до файлу в процесі запису. Це зручніше ніж копіювання з буфера обміну, особливо для довших записів. Перенаправлення shell (варіант б) не працює бо codegen — це інтерактивний GUI-інструмент а не команда що виводить в stdout. Прапорці --save і --file не існують в CLI codegen Playwright.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What is the purpose of 'Record at cursor' in the VS Code Playwright extension?",
        uk: "Яка мета 'Record at cursor' у розширенні Playwright для VS Code?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It creates a new test file and starts recording from scratch",
            uk: "Створює новий файл тесту і починає запис з нуля",
          },
        },
        {
          id: "b",
          label: {
            en: "It inserts new recorded actions at a specific line inside an existing test, starting the browser at that point in the test's execution",
            uk: "Вставляє нові записані дії на конкретний рядок всередині існуючого тесту, відкриваючи браузер на тій точці виконання тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "It replays the test up to the cursor line and then pauses",
            uk: "Відтворює тест до рядка курсора і потім зупиняється",
          },
        },
        {
          id: "d",
          label: {
            en: "It records only the locator on the line where the cursor is placed",
            uk: "Записує тільки локатор на рядку де знаходиться курсор",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Record at cursor is for adding steps to an existing test without re-recording the whole thing. You place your cursor at the exact line where you want new actions inserted, click Record at cursor, and the browser opens already at that execution point (meaning earlier setup steps have already run). Any interactions you do are inserted at the cursor position. This is very useful when a test is missing a middle step.",
        uk: "Record at cursor призначений для додавання кроків до існуючого тесту без перезапису всього. Ставиш курсор на точний рядок де хочеш вставити нові дії, клацаєш Record at cursor, і браузер відкривається вже на тій точці виконання (тобто попередні кроки setup вже виконані). Будь-які взаємодії вставляються в позиції курсора. Дуже корисно коли в тесті не вистачає середнього кроку.",
      },
    },
  ],
}
