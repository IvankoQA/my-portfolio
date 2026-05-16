import type { PlaywrightTopic } from "../../types"

export const browserContextsTopic: PlaywrightTopic = {
  slug: "browser-contexts",
  groupId: "guides",
  order: 130,
  level: "intermediate",
  trackOrder: 18,
  sourceDoc: "browser-contexts.md",
  officialDocsUrl: "https://playwright.dev/docs/browser-contexts",
  title: {
    en: "Isolation",
    uk: "Ізоляція",
  },
  summary: {
    en: "Every test in Playwright starts with a clean slate: its own cookies, localStorage and session — completely separate from every other test. That's browser contexts at work. The practical consequence: I never need to clean up state between tests, and I can run any test in any order without worrying about leftover state from another test.",
    uk: "Кожен тест у Playwright стартує з чистого аркуша: власні cookies, localStorage і сесія — повністю відокремлені від інших тестів. Це і є browser contexts. Практичний наслідок: не потрібно прибирати стан між тестами, і будь-який тест можна запускати в будь-якому порядку без побоювань щодо залишків стану від іншого тесту.",
  },
  sections: [
    {
      id: "what-is-a-browser-context",
      title: {
        en: "What is a browser context",
        uk: "Що таке browser context",
      },
      diagram: {
        mermaid: `flowchart LR
  B["Browser"] --> C1["Context 1\n(Test A)"]
  B --> C2["Context 2\n(Test B)"]
  C1 --> P1["Page"]
  C2 --> P2["Page"]`,
        caption: {
          en: "Each test gets its own context — isolated like a separate incognito window",
          uk: "Кожен тест отримує окремий context — ізольований як окреме вікно інкогніто",
        },
      },
      paragraphs: [
        {
          en: "A browser context is like a fresh incognito window — isolated from everything else. It has its own cookies, localStorage, sessionStorage and cache. Playwright creates one per test automatically. When the test finishes, the context is thrown away.",
          uk: "Browser context — це як свіже вікно інкогніто: ізольоване від усього іншого. Свої cookies, localStorage, sessionStorage і кеш. Playwright створює один context на кожен тест автоматично. Коли тест завершується — context знищується.",
        },
        {
          en: "The key thing about isolation: tests can't affect each other. If test A logs in and stores a session cookie, test B starts from zero — no cookie, no session, no state carryover.",
          uk: "Головне в ізоляції: тести не можуть впливати один на одного. Якщо тест A залогінився і отримав session cookie — тест B стартує з нуля: без cookie, без сесії, без залежності.",
        },
      ],
    },
    {
      id: "why-isolation-matters",
      title: {
        en: "Why isolation matters",
        uk: "Навіщо ізоляція потрібна",
      },
      paragraphs: [
        {
          en: "Without isolation, tests share state. One failed test can corrupt state for ten others. That's the worst kind of bug — a test fails, but the problem isn't in that test. Isolation solves this:\n1. A failing test only affects itself — no cascade\n2. You can run any single test in any order without setup\n3. Parallel execution just works — no race conditions on shared state",
          uk: "Без ізоляції тести ділять стан. Один падає — може зіпсувати стан для десяти інших. Це найгірший вид бага: тест падає, але проблема не в ньому. Ізоляція вирішує це:\n1. Падіння одного тесту не зачіпає інших\n2. Будь-який тест можна запустити окремо в будь-якому порядку\n3. Паралельний запуск просто працює — немає перегонів за спільний стан",
        },
        {
          en: "The alternative — cleaning up state between tests — sounds fine in theory but breaks in practice. You forget to clean something, or some things are impossible to clean (like visited link styles). Start fresh every time instead.",
          uk: "Альтернатива — прибирати стан між тестами — звучить непогано, але на практиці ламається. Забуваєш щось почистити, або деякі речі взагалі неможливо повернути (наприклад, стилі відвіданих посилань). Краще щоразу починати з нуля.",
        },
      ],
    },
    {
      id: "context-in-playwright-test",
      title: {
        en: "Context in Playwright Test",
        uk: "Context в Playwright Test",
      },
      paragraphs: [
        {
          en: "When you use `@playwright/test`, you get `page` and `context` as fixtures — both already set up and isolated for your test. You don't create them manually. Two tests running at the same time each get their own completely separate context.",
          uk: "Коли використовуєш `@playwright/test`, fixtures `page` і `context` вже готові й ізольовані для твого тесту. Не потрібно їх створювати вручну. Два тести що виконуються одночасно — кожен отримує окремий context.",
        },
      ],
      codeBlocks: [
        {
          id: "fixtures",
          language: "ts",
          code: `test('order page loads', async ({ page, context }) => {
  // context — це ізольований BrowserContext саме цього тесту
  // page — це Page всередині цього context
  await page.goto('/orders')
  await expect(page.getByRole('heading', { name: 'Замовлення' })).toBeVisible()
})

test('another test', async ({ page, context }) => {
  // context і page тут — повністю відокремлені від попереднього тесту
  // жодних спільних cookies чи localStorage
  await page.goto('/dashboard')
})`,
        },
      ],
    },
    {
      id: "multiple-contexts",
      title: {
        en: "Multiple contexts in one test",
        uk: "Кілька контекстів в одному тесті",
      },
      paragraphs: [
        {
          en: "Sometimes you need two users at once — for example, testing a chat or checking that admin actions affect regular users. You can create multiple contexts manually within a single test, each acting as a different user.",
          uk: "Іноді потрібні два користувачі одночасно — наприклад, тестування чату або перевірка що дії адміна впливають на звичайного користувача. Можна створити кілька контекстів вручну в межах одного тесту, кожен як окремий юзер.",
        },
      ],
      codeBlocks: [
        {
          id: "multi-context",
          language: "ts",
          code: `test('admin bans user — user sees ban message', async ({ browser }) => {
  const adminCtx = await browser.newContext()
  const userCtx = await browser.newContext()

  const adminPage = await adminCtx.newPage()
  const userPage = await userCtx.newPage()

  // Адмін логіниться і банить
  await adminPage.goto('/admin/users')
  await adminPage.getByRole('button', { name: 'Ban user123' }).click()

  // Юзер бачить повідомлення про бан
  await userPage.goto('/dashboard')
  await expect(userPage.getByText('Your account has been suspended')).toBeVisible()

  await adminCtx.close()
  await userCtx.close()
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Test A logs in as admin, sets a session cookie, and passes. Test B (which tests the login page) starts immediately after. Does test B see the admin session cookie?",
        uk: "Тест A логіниться як адмін, отримує session cookie і проходить. Тест B (який тестує сторінку логіну) стартує одразу після. Чи бачить тест B session cookie адміна?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Yes — tests share the same browser, so cookies persist between them",
            uk: "Так — тести ділять той самий браузер, тому cookies зберігаються між ними",
          },
        },
        {
          id: "b",
          label: {
            en: "No — each test runs in its own isolated browser context; test B starts with zero cookies regardless of what test A did",
            uk: "Ні — кожен тест виконується у власному ізольованому browser context; тест B починається з нульовим набором cookies незалежно від того що зробив тест A",
          },
        },
        {
          id: "c",
          label: {
            en: "It depends on whether the tests run sequentially or in parallel",
            uk: "Залежить від того чи тести виконуються послідовно або паралельно",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright creates a fresh, isolated browser context for every test — regardless of test order or execution mode (sequential or parallel). A browser context is like a separate incognito window: it has its own cookies, localStorage, sessionStorage, and cache. Nothing leaks from one context to another. Test B always starts from a blank slate. This is the entire point of browser context isolation — tests don't interfere with each other.",
        uk: "Playwright створює новий ізольований browser context для кожного тесту — незалежно від порядку тестів або режиму виконання (послідовний або паралельний). Browser context — це як окреме вікно інкогніто: власні cookies, localStorage, sessionStorage і кеш. Нічого не витікає з одного context в інший. Тест B завжди починається з чистого аркуша. Це і є весь сенс ізоляції browser context — тести не заважають один одному.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is a browser context in Playwright most analogous to?",
        uk: "З чим у Playwright найбільше схожий browser context?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "A browser tab — it shares cookies and storage with other tabs in the same window",
            uk: "Вкладка браузера — ділить cookies і storage з іншими вкладками того ж вікна",
          },
        },
        {
          id: "b",
          label: {
            en: "A fresh incognito window — completely isolated cookies, localStorage, and cache",
            uk: "Свіже вікно інкогніто — повністю ізольовані cookies, localStorage і кеш",
          },
        },
        {
          id: "c",
          label: {
            en: "A browser profile — shares extensions and bookmarks but not cookies",
            uk: "Профіль браузера — ділить розширення і закладки але не cookies",
          },
        },
        {
          id: "d",
          label: {
            en: "A separate browser process — completely isolated including network stack",
            uk: "Окремий процес браузера — повністю ізольований включаючи мережевий стек",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A browser context is exactly like a fresh incognito window: it has its own cookies, localStorage, sessionStorage, and HTTP cache, fully isolated from other contexts. Unlike a full browser process, it reuses the same underlying browser engine — so it is fast to create. Unlike a tab, it does not share any storage with other contexts in the same browser.",
        uk: "Browser context — це точно як свіже вікно інкогніто: власні cookies, localStorage, sessionStorage і HTTP-кеш, повністю ізольовані від інших контекстів. На відміну від повного процесу браузера — повторно використовує той самий базовий рушій браузера, тому швидко створюється. На відміну від вкладки — не ділить жодне сховище з іншими контекстами того ж браузера.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the correct hierarchy from largest to smallest in Playwright's browser model?",
        uk: "Яка правильна ієрархія від найбільшого до найменшого у моделі браузера Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Page → Context → Browser",
            uk: "Page → Context → Browser",
          },
        },
        {
          id: "b",
          label: {
            en: "Browser → Context → Page",
            uk: "Browser → Context → Page",
          },
        },
        {
          id: "c",
          label: {
            en: "Browser → Page → Context",
            uk: "Browser → Page → Context",
          },
        },
        {
          id: "d",
          label: {
            en: "Context → Browser → Page",
            uk: "Context → Browser → Page",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The hierarchy is Browser → Context → Page. One Browser can contain many Contexts (each isolated like an incognito window). Each Context can contain many Pages (browser tabs). Playwright's built-in fixtures give you one Context per test (with one Page in it) automatically. You can create additional Pages within the same Context using `context.newPage()`.",
        uk: "Ієрархія: Browser → Context → Page. Один Browser може містити багато Context-ів (кожен ізольований як вікно інкогніто). Кожен Context може містити багато Pages (вкладок браузера). Вбудовані фікстури Playwright автоматично дають тобі один Context на тест (з одним Page у ньому). Можна створювати додаткові Pages у тому самому Context за допомогою `context.newPage()`.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you create a second browser context manually within a single test?",
        uk: "Як вручну створити другий browser context у межах одного тесту?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Call page.newContext() to fork the current context",
            uk: "Викликати page.newContext() щоб розгалузити поточний context",
          },
        },
        {
          id: "b",
          label: {
            en: "Request the browser fixture and call browser.newContext() to create a second isolated context",
            uk: "Запросити фікстуру browser і викликати browser.newContext() щоб створити другий ізольований context",
          },
        },
        {
          id: "c",
          label: {
            en: "Use test.extend() to declare a second context fixture",
            uk: "Використати test.extend() щоб оголосити другу фікстуру context",
          },
        },
        {
          id: "d",
          label: {
            en: "Call context.clone() to create a copy of the current context",
            uk: "Викликати context.clone() щоб створити копію поточного context",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "To create additional contexts in a test, request the `browser` fixture and call `browser.newContext()`. This returns a new, completely isolated BrowserContext. You must close it manually at the end of the test with `await ctx.close()`. This pattern is common for multi-user scenarios like testing admin actions that affect another user's view.",
        uk: "Щоб створити додаткові контексти в тесті — запроси фікстуру `browser` і виклич `browser.newContext()`. Це повертає новий повністю ізольований BrowserContext. Потрібно закрити його вручну в кінці тесту через `await ctx.close()`. Цей патерн поширений для сценаріїв з кількома користувачами — наприклад тестування дій адміна що впливають на перегляд іншого користувача.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You want to run a test already logged in as a specific user without repeating the login flow every time. Which approach uses browser context storageState correctly?",
        uk: "Хочеш запустити тест вже залогіненим як конкретний користувач без повторення flow входу кожного разу. Який підхід правильно використовує storageState браузерного контексту?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Log in in each beforeEach hook and save the session to a global variable",
            uk: "Логінитися в кожному хуку beforeEach і зберігати сесію у глобальну змінну",
          },
        },
        {
          id: "b",
          label: {
            en: "Save auth state to a JSON file in a setup step, then set storageState to that file in the config or per test",
            uk: "Зберегти стан авторизації у JSON-файл на кроці setup, потім встановити storageState на той файл у конфігу або на рівні тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "Pass cookies directly to page.goto() as query parameters",
            uk: "Передати cookies напряму до page.goto() як параметри запиту",
          },
        },
        {
          id: "d",
          label: {
            en: "Use page.evaluate() to set document.cookie before each test",
            uk: "Використовувати page.evaluate() щоб встановити document.cookie перед кожним тестом",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The recommended pattern: in a global setup or a setup project, log in once and call `context.storageState({ path: 'auth.json' })` to save cookies and localStorage to a file. Then set `storageState: 'auth.json'` in the config `use` block (or per project). Every new test context will be initialised with that saved state — no login flow needed per test.",
        uk: "Рекомендований патерн: у глобальному setup або setup-проєкті залогінитися один раз і викликати `context.storageState({ path: 'auth.json' })` щоб зберегти cookies і localStorage у файл. Потім встановити `storageState: 'auth.json'` у блоці `use` конфігу (або на рівні проєкту). Кожен новий test context ініціалізується з тим збереженим станом — не потрібен flow входу для кожного тесту.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What is a persistent context in Playwright and when would you use it?",
        uk: "Що таке persistent context у Playwright і коли його використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "A context shared between all tests in a suite — used to avoid repeated browser launches",
            uk: "Context що ділиться між усіма тестами в suite — використовується щоб уникнути повторних запусків браузера",
          },
        },
        {
          id: "b",
          label: {
            en: "A context that launches a browser with a real user profile directory — cookies and localStorage persist to disk across sessions",
            uk: "Context що запускає браузер з реальною директорією профілю користувача — cookies і localStorage зберігаються на диск між сесіями",
          },
        },
        {
          id: "c",
          label: {
            en: "A context that automatically retries failed network requests",
            uk: "Context що автоматично повторює невдалі мережеві запити",
          },
        },
        {
          id: "d",
          label: {
            en: "A context that keeps its storage state between test.describe blocks",
            uk: "Context що зберігає стан сховища між блоками test.describe",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A persistent context (`chromium.launchPersistentContext(userDataDir)`) launches the browser with a real user data directory on disk — just like a regular Chrome profile. Cookies, localStorage, extensions, and settings persist between runs. Use it when you need to test browser extensions, or when you want to preserve real browser state across test sessions. For most tests, the ephemeral default context is better.",
        uk: "Persistent context (`chromium.launchPersistentContext(userDataDir)`) запускає браузер з реальною директорією даних користувача на диску — як звичайний профіль Chrome. Cookies, localStorage, розширення і налаштування зберігаються між запусками. Використовуй коли потрібно тестувати розширення браузера або коли хочеш зберегти реальний стан браузера між тестовими сесіями. Для більшості тестів кращий тимчасовий дефолтний context.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Why is 'cleaning up state between tests' considered worse than Playwright's context isolation approach?",
        uk: "Чому 'очищення стану між тестами' вважається гіршим ніж підхід Playwright з ізоляцією контексту?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Cleaning up is slower than creating a new context",
            uk: "Очищення повільніше ніж створення нового контексту",
          },
        },
        {
          id: "b",
          label: {
            en: "Cleanup is error-prone — you can forget items, and some browser state (like visited link styles) cannot be reset without a new context",
            uk: "Очищення схильне до помилок — можна забути елементи, і деякий стан браузера (як стилі відвіданих посилань) неможливо скинути без нового контексту",
          },
        },
        {
          id: "c",
          label: {
            en: "It requires additional test permissions that are not available by default",
            uk: "Вимагає додаткових дозволів тесту що недоступні за замовчуванням",
          },
        },
        {
          id: "d",
          label: {
            en: "Playwright does not provide any API for clearing browser state manually",
            uk: "Playwright не надає жодного API для ручного очищення стану браузера",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Manual cleanup is risky because you must know exactly what to clean — and some things cannot be cleaned at all (like visited link styles, which only reset when a new context is created). Forgetting to clean one thing can cause a cascade of unrelated test failures. Starting from a fresh context every time eliminates this entire category of problem — it's automatic, complete, and requires zero maintenance.",
        uk: "Ручне очищення ризиковане бо треба точно знати що чистити — і деякі речі взагалі не можна очистити (наприклад стилі відвіданих посилань, які скидаються лише при створенні нового контексту). Забувши очистити одну річ можна спричинити каскад несвязаних падінь тестів. Починаючи щоразу зі свіжого контексту — усуваєш цілу категорію проблем: автоматично, повністю, без жодного обслуговування.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "In a test that uses `browser.newContext()` to create two contexts, what must you do before the test ends?",
        uk: "У тесті що використовує `browser.newContext()` для створення двох контекстів — що потрібно зробити перед завершенням тесту?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Nothing — Playwright automatically closes all contexts when the test finishes",
            uk: "Нічого — Playwright автоматично закриває всі контексти коли тест завершується",
          },
        },
        {
          id: "b",
          label: {
            en: "Call context.dispose() on each manually created context",
            uk: "Викликати context.dispose() для кожного вручну створеного context",
          },
        },
        {
          id: "c",
          label: {
            en: "Call context.close() on each manually created context to release browser resources",
            uk: "Викликати context.close() для кожного вручну створеного context щоб звільнити ресурси браузера",
          },
        },
        {
          id: "d",
          label: {
            en: "Call browser.close() to clean up all contexts at once",
            uk: "Викликати browser.close() щоб одразу прибрати всі контексти",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "Contexts created manually with `browser.newContext()` are not automatically closed by Playwright — only the context created by the built-in `context` fixture is managed automatically. You must call `await ctx.close()` on each manually created context, ideally after the assertions. Calling `browser.close()` would close the shared browser used by all tests in that worker, breaking subsequent tests.",
        uk: "Контексти створені вручну через `browser.newContext()` Playwright не закриває автоматично — автоматично управляється лише context створений вбудованою фікстурою `context`. Потрібно викликати `await ctx.close()` для кожного вручну створеного context — бажано після перевірок. Виклик `browser.close()` закрив би спільний браузер що використовується всіма тестами в тому воркері, ламаючи наступні тести.",
      },
    },
  ],
}
