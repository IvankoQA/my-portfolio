import type { PlaywrightTopic } from "../../types"

export const traceViewerTopic: PlaywrightTopic = {
  slug: "trace-viewer",
  groupId: "guides",
  order: 415,
  level: "advanced",
  trackOrder: 3,
  sourceDoc: "trace-viewer.md",
  officialDocsUrl: "https://playwright.dev/docs/trace-viewer",
  title: {
    en: "Trace viewer",
    uk: "Переглядач трас",
  },
  summary: {
    en: "The Trace Viewer is how I debug CI failures without reproducing locally. A trace is a complete recording of a test run: DOM snapshots at every action, all network requests, console logs, screenshots. I configure trace: 'on-first-retry' so traces only exist when a test actually fails.",
    uk: "Trace Viewer — це як я дебажу CI-падіння не відтворюючи їх локально. Трейс — це повний запис виконання тесту: DOM-snapshot-и при кожній дії, всі мережеві запити, логи консолі, скриншоти. Я налаштовую trace: 'on-first-retry' щоб трейси існували тільки коли тест реально падає.",
  },
  sections: [
    {
      id: "recording-traces",
      title: {
        en: "Recording traces",
        uk: "Запис трейсів",
      },
      paragraphs: [
        {
          en: "Five modes. I use `on-first-retry` on CI — records only when a test retries (which means it failed). No storage waste on passing tests. `retain-on-failure` is the alternative if you don't use retries but still want traces for failed tests.",
          uk: "П'ять режимів. Я використовую `on-first-retry` на CI — записує тільки коли тест повторюється (що означає він впав). Не витрачає місце на тестах що проходять. `retain-on-failure` — альтернатива якщо не використовуєш retries але все одно хочеш трейси для тестів що падають.",
        },
      ],
      codeBlocks: [
        {
          id: "trace-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  use: {
    // 'on-first-retry'    — тільки при першому повторі (рекомендую для CI)
    // 'retain-on-failure' — записувати, видаляти якщо тест пройшов
    // 'on'                — завжди (дорого за місцем, для локального дебагу)
    // 'off'               — не записувати
    trace: process.env.CI ? 'on-first-retry' : 'off',
  },
})`,
        },
        {
          id: "trace-cli",
          language: "bash",
          code: `# Локальний запуск з трейсом — для дебагу конкретного тесту
npx playwright test orders.spec.ts --trace on`,
        },
      ],
    },
    {
      id: "opening-traces",
      title: {
        en: "Opening traces",
        uk: "Відкриття трейсів",
      },
      paragraphs: [
        {
          en: "Three ways to open a trace. From HTML report is the easiest — run the tests, open the report, click the trace icon next to a failed test. Directly by path if you have the `trace.zip` file. Online at trace.playwright.dev if you want to share with someone without installing Playwright.",
          uk: "Три способи відкрити трейс. Через HTML-репорт — найпростіше: запусти тести, відкрий репорт, клацни іконку трейсу поруч з тестом що впав. Напряму за шляхом якщо маєш файл `trace.zip`. Онлайн на trace.playwright.dev якщо хочеш поділитися з кимось без встановлення Playwright.",
        },
      ],
      codeBlocks: [
        {
          id: "open-trace",
          language: "bash",
          code: `# Відкрити трейс з HTML-репорту
npx playwright show-report

# Відкрити трейс напряму за шляхом
npx playwright show-trace test-results/my-test/trace.zip

# Або перетягнути .zip на trace.playwright.dev`,
        },
      ],
    },
    {
      id: "navigating-trace",
      title: {
        en: "Reading a trace — workflow I use",
        uk: "Читання трейсу — workflow що я використовую",
      },
      diagram: {
        mermaid: `flowchart LR
  subgraph TV["Trace Viewer"]
    direction TB
    TL["Timeline strip\n(blue=action, green=nav, red=failure)"]
    TL --> ACT["Actions panel\nhover → DOM snapshot"]
    TL --> NET["Network tab\nrequests & responses"]
    TL --> CON["Console tab\nerrors & warnings"]
    TL --> LOG["Log tab\nactionability checks"]
  end`,
        caption: {
          en: "Click the red marker on the timeline to jump to the failure point, then use Actions and Network to diagnose why",
          uk: "Клацніть червоний маркер на таймлайні щоб перейти до точки падіння, потім використовуйте Actions і Network для діагностики",
        },
      },
      paragraphs: [
        {
          en: "My debugging flow: find the red marker on the timeline (where the test failed) → look at the failing assertion in the Actions panel → click it to see the Before/After DOM snapshots → check what the page actually looked like vs what I expected → if the DOM is right but the test failed, switch to Network tab to see what API responded.",
          uk: "Мій процес дебагу: знайти червоний маркер на таймлайні (де тест впав) → подивитися на перевірку що впала в панелі Actions → клацнути щоб побачити Before/After DOM-snapshot-и → перевірити як сторінка виглядала насправді проти того що очікував → якщо DOM правильний але тест впав — перейти на вкладку Network щоб подивитися що відповів API.",
        },
        {
          en: "**Timeline** — top strip with colored blocks: blue for actions, green for navigations. Red marker = failure point. Drag the slider to select a range and filter all other tabs to that timeframe.",
          uk: "**Timeline** — верхня смуга з кольоровими блоками: синій для дій, зелений для навігацій. Червоний маркер = точка падіння. Тягни слайдер щоб вибрати діапазон і відфільтрувати всі інші вкладки за цим часом.",
        },
        {
          en: "**Actions panel** — every locator call, click, fill. Hover to see DOM snapshot. Double-click to pin and filter Network/Console to that action. **Log tab** — what Playwright was waiting for, which actionability checks ran.",
          uk: "**Панель Actions** — кожен виклик локатора, клік, заповнення. Наводь курсор щоб бачити DOM-snapshot. Подвійний клік щоб закріпити і відфільтрувати Network/Console по цій дії. **Вкладка Log** — чого чекав Playwright, які перевірки actionability виконувалися.",
        },
      ],
    },
    {
      id: "dom-snapshots",
      title: {
        en: "DOM snapshots — Before, Action, After",
        uk: "DOM-snapshot-и — Before, Action, After",
      },
      paragraphs: [
        {
          en: "For each action, Playwright stores three snapshots: Before (the state before the action), Action (the moment of the click/fill — shows exactly where Playwright clicked), and After (the state after). The Action snapshot is the one that reveals 'Playwright was clicking here, not there'.",
          uk: "Для кожної дії Playwright зберігає три snapshot-и: Before (стан до дії), Action (момент кліку/заповнення — показує точно куди клікнув Playwright), і After (стан після). Snapshot Action — той що розкриває 'Playwright клікав тут, а не там'.",
        },
        {
          en: "You can also pop out the DOM snapshot into a separate browser window and use DevTools to inspect the HTML and CSS — useful when the visual snapshot isn't enough to understand the layout.",
          uk: "Також можна відкрити DOM-snapshot у окремому вікні браузера і використати DevTools для інспекції HTML і CSS — корисно коли візуального snapshot-у недостатньо щоб зрозуміти верстку.",
        },
      ],
    },
    {
      id: "sharing-traces",
      title: {
        en: "Sharing traces from CI",
        uk: "Ділитися трейсами з CI",
      },
      paragraphs: [
        {
          en: "Traces are uploaded as CI artifacts alongside the HTML report. Team members can download the zip from GitHub Actions → workflow run → Artifacts section. Or you can open a trace remotely by passing its URL to `npx playwright show-trace`.",
          uk: "Трейси завантажуються як CI-артефакти разом з HTML-репортом. Члени команди можуть скачати zip з GitHub Actions → запуск workflow → розділ Artifacts. Або можна відкрити трейс віддалено передаючи його URL в `npx playwright show-trace`.",
        },
        {
          en: "Note: traces can contain auth tokens and test user credentials — treat them as sensitive data and don't post to public Slack channels.",
          uk: "Увага: трейси можуть містити auth-токени і облікові дані тестових юзерів — поводься з ними як з чутливими даними і не постить у публічні Slack-канали.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A test fails on CI with 'element not found'. You have a trace. What's the first thing to check?",
        uk: "Тест падає на CI з 'element not found'. У тебе є трейс. Що перевіряти першим?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Check the Console tab for JavaScript errors that might have broken the page",
            uk: "Перевірити вкладку Console на JavaScript-помилки що могли зламати сторінку",
          },
        },
        {
          id: "b",
          label: {
            en: "Find the red failure marker on the timeline, click the failing action, check the Before/After DOM snapshots to see what was actually on the page",
            uk: "Знайти червоний маркер падіння на таймлайні, клацнути дію що впала, перевірити Before/After DOM-snapshot-и щоб побачити що реально було на сторінці",
          },
        },
        {
          id: "c",
          label: {
            en: "Check the Network tab to see if the page loaded correctly",
            uk: "Перевірити вкладку Network щоб побачити чи сторінка завантажилась правильно",
          },
        },
        {
          id: "d",
          label: {
            en: "Look at the Log tab to see which locator Playwright tried to match",
            uk: "Переглянути вкладку Log щоб побачити який локатор Playwright намагався зіставити",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The red marker on the timeline takes you directly to the failure point. The DOM snapshot at that action shows you exactly what was on the page — whether the element was missing entirely, had different text, was hidden, or was behind another element. The console and network tabs are useful secondary checks but the DOM snapshot is the most direct answer for 'element not found'.",
        uk: "Червоний маркер на таймлайні веде тебе прямо до точки падіння. DOM-snapshot при цій дії показує точно що було на сторінці — чи елемент був повністю відсутній, мав інший текст, був захований, або знаходився за іншим елементом. Вкладки консолі і мережі корисні як другорядні перевірки але DOM-snapshot — найпряміша відповідь на 'element not found'.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Which trace recording mode is recommended for CI and why?",
        uk: "Який режим запису трейсів рекомендований для CI і чому?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "trace: 'on' — always record so you have traces for every test whether it passes or fails",
            uk: "trace: 'on' — завжди записуй щоб мати трейси для кожного тесту незалежно від результату",
          },
        },
        {
          id: "b",
          label: {
            en: "trace: 'on-first-retry' — records only when a test actually fails (requires a retry), balancing debugging usefulness with storage cost",
            uk: "trace: 'on-first-retry' — записує лише коли тест реально падає (вимагає повтору), балансуючи корисність для дебагу з вартістю зберігання",
          },
        },
        {
          id: "c",
          label: {
            en: "trace: 'off' — traces slow down CI and the HTML report is enough for debugging",
            uk: "trace: 'off' — трейси сповільнюють CI і HTML-звіту достатньо для дебагу",
          },
        },
        {
          id: "d",
          label: {
            en: "trace: 'retain-on-failure' — records everything and discards only after a test passes, maximizing coverage",
            uk: "trace: 'retain-on-failure' — записує все і видаляє лише після проходження тесту, максимізуючи покриття",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`on-first-retry` is recommended for CI because: (1) it only records traces for tests that fail — a test that passes on the first attempt generates no trace and uses no storage; (2) with `retries: 2`, a flaky failure still gets captured. `retain-on-failure` is the alternative when you don't use retries but still want traces for failures. `trace: 'on'` records for every test — expensive on large suites. The five modes are: `off`, `on`, `on-first-retry`, `retain-on-failure`, and `on-all-retries`.",
        uk: "`on-first-retry` рекомендований для CI тому що: (1) записує трейси лише для тестів що падають — тест що проходить з першої спроби не генерує трейс і не використовує місце; (2) з `retries: 2` нестабільне падіння все одно захоплюється. `retain-on-failure` — альтернатива коли не використовуєш повтори але все одно хочеш трейси для падінь. `trace: 'on'` записує для кожного тесту — дорого для великих наборів. П'ять режимів: `off`, `on`, `on-first-retry`, `retain-on-failure` і `on-all-retries`.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "You downloaded a trace.zip from CI but don't have Playwright installed locally. How can you view the trace?",
        uk: "Ти скачав trace.zip з CI але не маєш Playwright встановленого локально. Як переглянути трейс?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Unzip the file and open index.html in any browser",
            uk: "Розпакуй файл і відкрий index.html в будь-якому браузері",
          },
        },
        {
          id: "b",
          label: {
            en: "Open trace.playwright.dev in a browser and drag the .zip file onto it",
            uk: "Відкрий trace.playwright.dev в браузері і перетягни .zip файл на нього",
          },
        },
        {
          id: "c",
          label: {
            en: "Use npx playwright show-trace — npx downloads Playwright temporarily",
            uk: "Використовуй npx playwright show-trace — npx тимчасово завантажує Playwright",
          },
        },
        {
          id: "d",
          label: {
            en: "Traces can only be viewed by whoever recorded them — they're machine-specific",
            uk: "Трейси може переглядати лише той хто їх записав — вони прив'язані до конкретної машини",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "trace.playwright.dev is a web-based trace viewer that works entirely in the browser — no Playwright installation required. Drag and drop the `trace.zip` file onto the page. It's also the easiest way to share a trace with someone: send them the zip, they open trace.playwright.dev and drag it in. The viewer is hosted by Playwright and fully processes the trace client-side. If Playwright is installed, `npx playwright show-trace` also works for local viewing.",
        uk: "trace.playwright.dev — вебовий переглядач трейсів що працює повністю в браузері без встановленого Playwright. Перетягни файл `trace.zip` на сторінку. Це також найпростіший спосіб поділитися трейсом: надіш zip, вони відкривають trace.playwright.dev і перетягують. Переглядач хоститься Playwright і повністю обробляє трейс на стороні клієнта. Якщо Playwright встановлений — `npx playwright show-trace` також працює для локального перегляду.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "In the Trace Viewer, what does the 'Action' DOM snapshot show (as opposed to 'Before' and 'After')?",
        uk: "У Trace Viewer що показує DOM-snapshot 'Action' (на відміну від 'Before' і 'After')?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The page state when the test started",
            uk: "Стан сторінки коли тест почався",
          },
        },
        {
          id: "b",
          label: {
            en: "The exact moment of the click or fill — shows precisely where Playwright's action landed, highlighted in the snapshot",
            uk: "Точний момент кліку або заповнення — показує саме куди потрапила дія Playwright, підсвічено в snapshot",
          },
        },
        {
          id: "c",
          label: {
            en: "The DOM tree parsed from the locator selector used in that action",
            uk: "DOM-дерево розпарсене з селектора локатора використаного в цій дії",
          },
        },
        {
          id: "d",
          label: {
            en: "The accessibility tree at the time of the action",
            uk: "Дерево доступності в момент дії",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Each action in the trace has three DOM snapshots: **Before** (the page state before the action began), **Action** (the moment of the click/fill — Playwright highlights exactly where it interacted with the page), and **After** (the page state after the action completed). The Action snapshot is the most useful for 'why did Playwright click the wrong thing?': it shows the actual click target highlighted in context, revealing if Playwright clicked an obscured element, a different position than expected, or the correct element when the locator resolved.",
        uk: "Кожна дія у трейсі має три DOM-snapshot-и: **Before** (стан сторінки до початку дії), **Action** (момент кліку/заповнення — Playwright підсвічує точно де він взаємодіяв зі сторінкою), і **After** (стан сторінки після завершення дії). Snapshot Action найкорисніший для питання 'чому Playwright клікнув не те?': показує фактичну ціль кліку підсвіченою в контексті, розкриваючи чи Playwright клікнув на перекритий елемент, іншу позицію ніж очікувалося, або правильний елемент коли локатор розрішився.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What information does the 'Log' tab in Trace Viewer show?",
        uk: "Яку інформацію показує вкладка 'Log' у Trace Viewer?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The raw browser console output during the test",
            uk: "Сирий вивід консолі браузера під час тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "What Playwright was waiting for — which actionability checks ran, which locator it tried to match, and the sequence of retries",
            uk: "Чого чекав Playwright — які перевірки actionability виконувалися, який локатор намагався зіставити і послідовність повторів",
          },
        },
        {
          id: "c",
          label: {
            en: "The test source code with each line highlighted as it executed",
            uk: "Вихідний код тесту з підсвіченим кожним рядком під час виконання",
          },
        },
        {
          id: "d",
          label: {
            en: "Network request/response pairs associated with the selected action",
            uk: "Пари запит/відповідь мережі пов'язані з вибраною дією",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The Log tab shows Playwright's internal decision process for the selected action: which actionability checks it ran (visible? enabled? in viewport? stable?), whether retries happened, and the final outcome. For a failed `click`, the log might show 'waiting for element to be visible' with a sequence of attempts — telling you the element was never found, was covered, or had a CSS issue. This is complementary to the DOM snapshot: the snapshot shows what was there, the log shows what Playwright was doing about it.",
        uk: "Вкладка Log показує внутрішній процес прийняття рішень Playwright для вибраної дії: які перевірки actionability виконувалися (видимий? увімкнений? у viewport? стабільний?), чи відбувалися повтори і кінцевий результат. Для невдалого `click` лог може показати 'waiting for element to be visible' з послідовністю спроб — повідомляючи що елемент ніколи не знайдено, перекритий або має CSS-проблему. Це доповнює DOM-snapshot: snapshot показує що там було, лог показує що Playwright з цим робив.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "A teammate shares a trace.zip from a CI failure. You know it contains auth tokens from the test user. What should you be careful about?",
        uk: "Колега ділиться trace.zip з CI-падіння. Ти знаєш що він містить auth-токени тестового юзера. Про що слід бути обережним?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Nothing — test environment credentials are disposable and not sensitive",
            uk: "Ні про що — облікові дані тестового середовища одноразові і не є чутливими",
          },
        },
        {
          id: "b",
          label: {
            en: "Don't post the trace to public Slack channels or GitHub issues — auth tokens visible in the trace could be used to access the test environment",
            uk: "Не постив трейс у публічні Slack-канали або GitHub issues — auth-токени видимі в трейсі можуть бути використані для доступу до тестового середовища",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright automatically redacts auth tokens from traces before saving",
            uk: "Playwright автоматично видаляє auth-токени з трейсів перед збереженням",
          },
        },
        {
          id: "d",
          label: {
            en: "Only traces from production runs contain real credentials — CI test credentials are auto-rotated",
            uk: "Лише трейси з продакшн-запусків містять реальні облікові дані — CI-облікові дані тестів автоматично ротуються",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Traces capture everything the browser did during the test — including cookies, localStorage (where auth tokens live), and network request headers with `Authorization: Bearer ...` values. The Playwright docs explicitly warn about this. Don't post trace files to public GitHub issues, public Slack channels, or any other public-facing system. Treat them like logs from production: share only with team members who need them, in private channels. Even test environment tokens are worth protecting — they often have write access to test databases.",
        uk: "Трейси захоплюють все що браузер робив під час тесту — включаючи cookies, localStorage (де зберігаються auth-токени) і заголовки мережевих запитів зі значеннями `Authorization: Bearer ...`. Документація Playwright явно попереджає про це. Не постив файли трейсів у публічні GitHub issues, публічні Slack-канали або будь-яку іншу публічну систему. Поводься з ними як з логами з продакшну: діли лише з членами команди яким вони потрібні, у приватних каналах. Навіть токени тестового середовища варто захищати — вони часто мають доступ на запис до тестових баз даних.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What does the colored timeline at the top of Trace Viewer represent?",
        uk: "Що представляє кольоровий таймлайн у верхній частині Trace Viewer?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "CPU and memory usage during the test run",
            uk: "Використання CPU і пам'яті під час виконання тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "A chronological view of actions and navigations — blue blocks for Playwright actions, green for navigations, with a red marker at the point of failure",
            uk: "Хронологічний вигляд дій і навігацій — сині блоки для дій Playwright, зелені для навігацій, з червоним маркером у точці падіння",
          },
        },
        {
          id: "c",
          label: {
            en: "Network waterfall — each bar represents a network request",
            uk: "Мережевий waterfall — кожна смужка представляє мережевий запит",
          },
        },
        {
          id: "d",
          label: {
            en: "Test steps as defined in test.step() blocks",
            uk: "Кроки тесту як визначені у блоках test.step()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The timeline strip at the top of Trace Viewer is a chronological view of the test run. Blue blocks represent Playwright actions (clicks, fills, assertions), green represents page navigations. The red marker indicates where the test failed. You can drag the slider to select a time range — all other tabs (Network, Console, Actions) filter to events within the selected range. This makes it easy to focus on what happened around the failure point without scrolling through the entire trace.",
        uk: "Смуга таймлайну у верхній частині Trace Viewer — хронологічний вигляд виконання тесту. Сині блоки представляють дії Playwright (кліки, заповнення, assertions), зелені — навігації сторінки. Червоний маркер вказує де тест впав. Ти можеш тягнути слайдер щоб вибрати часовий діапазон — всі інші вкладки (Network, Console, Actions) фільтруються до подій у вибраному діапазоні. Це дозволяє легко сфокусуватися на тому що відбувалося навколо точки падіння без прокрутки всього трейсу.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You click an action in the Actions panel and the DOM snapshot shows the page but the layout looks wrong. What can you do to inspect the CSS more closely?",
        uk: "Ти клікаєш дію в панелі Actions і DOM-snapshot показує сторінку але верстка виглядає неправильно. Що можна зробити щоб детальніше перевірити CSS?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use the Trace Viewer's built-in CSS inspector on the right side panel",
            uk: "Використовуй вбудований CSS-інспектор Trace Viewer на правій бічній панелі",
          },
        },
        {
          id: "b",
          label: {
            en: "Pop out the DOM snapshot into a separate browser window — you can then open DevTools and inspect the HTML and CSS",
            uk: "Відкрий DOM-snapshot у окремому вікні браузера — потім можна відкрити DevTools і перевірити HTML і CSS",
          },
        },
        {
          id: "c",
          label: {
            en: "Export the snapshot as HTML and open it in the browser",
            uk: "Експортуй snapshot як HTML і відкрий в браузері",
          },
        },
        {
          id: "d",
          label: {
            en: "The DOM snapshot is read-only — you can't inspect CSS in Trace Viewer",
            uk: "DOM-snapshot доступний лише для читання — CSS не можна перевірити в Trace Viewer",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The DOM snapshot panel in Trace Viewer has a 'pop out' button that opens the snapshot in a separate browser tab. In that separate tab, you have full access to browser DevTools — you can inspect the HTML, view computed CSS, measure element dimensions, and even run JavaScript against the snapshot. This is invaluable for layout debugging: you can see exactly why an element had `display: none` or was positioned off-screen at the moment of failure.",
        uk: "Панель DOM-snapshot у Trace Viewer має кнопку 'pop out' що відкриває snapshot в окремій вкладці браузера. У тій окремій вкладці маєш повний доступ до DevTools браузера — можна перевіряти HTML, переглядати обчислений CSS, вимірювати розміри елементів і навіть запускати JavaScript проти snapshot. Це безцінно для дебагу верстки: можна побачити точно чому елемент мав `display: none` або був позиціонований за межами екрана в момент падіння.",
      },
    },
  ],
}
