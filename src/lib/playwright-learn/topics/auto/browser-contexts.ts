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
    en: "Tests written with Playwright execute in isolated clean-slate environments called browser contexts. This isolation model improves reproducibility and prevents cascading test failures.",
    uk: "Тести Playwright виконуються в ізольованих «чистих» середовищах — browser context. Такий підхід підвищує відтворюваність і запобігає ланцюговим падінням тестів.",
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
          en: "Tests written with Playwright execute in isolated clean-slate environments called browser contexts. This isolation model improves reproducibility and prevents cascading test failures.",
          uk: "Тести Playwright виконуються в ізольованих «чистих» середовищах — browser context. Такий підхід підвищує відтворюваність і запобігає ланцюговим падінням тестів.",
        },
      ],
    },
    {
      id: "what-is-test-isolation",
      title: {
        en: "What is Test Isolation?",
        uk: "Що таке ізоляція тестів?",
      },
      paragraphs: [
        {
          en: "Test Isolation is when each test is completely isolated from another test. Every test runs independently from any other test. This means that each test has its own local storage, session storage, cookies etc. Playwright achieves this using [BrowserContext]s which are equivalent to incognito-like profiles. They are fast and cheap to create and are completely isolated, even when running in a single browser. Playwright creates a context for each test, and provides a default [Page] in that context.",
          uk: "Ізоляція тестів означає, що кожен тест повністю відокремлений від інших і виконується незалежно. У кожного свій local storage, session storage, куки тощо. Playwright досягає цього через [BrowserContext] — профілі на кшталт режиму інкогніто: їх швидко створювати, вони дешеві й повністю ізольовані навіть в одному браузері. Для кожного тесту створюється context і типова [Page] у цьому context.",
        },
      ],
    },
    {
      id: "why-is-test-isolation-important",
      title: {
        en: "Why is Test Isolation Important?",
        uk: "Навіщо потрібна ізоляція тестів?",
      },
      paragraphs: [
        {
          en: "- No failure carry-over. If one test fails it doesn't affect the other test.\n- Easy to debug errors or flakiness, because you can run just a single test as many times as you'd like. \n- Don't have to think about the order when running in parallel, sharding, etc.",
          uk: "- Помилка одного тесту не «перекидається» на інші.\n- Простіше шукати причини збоїв і нестабільності: можна ганяти один тест скільки завгодно разів.\n- Не потрібно підганяти порядок запуску при паралелі, шардінгу тощо.",
        },
      ],
    },
    {
      id: "two-ways-of-test-isolation",
      title: {
        en: "Two Ways of Test Isolation",
        uk: "Два підходи до ізоляції",
      },
      paragraphs: [
        {
          en: 'There are two different strategies when it comes to Test Isolation: start from scratch or cleanup in between. The problem with cleaning up in between tests is that it can be easy to forget to clean up and some things are impossible to clean up such as "visited links". State from one test can leak into the next test which could cause your test to fail and make debugging harder as the problem comes from another test. Starting from scratch means everything is new, so if the test fails you only have to look within that test to debug.',
          uk: "Є дві стратегії: починати з нуля або прибирати стан між тестами. Прибирання легко забути, а дещо не вичистити взагалі (наприклад, «відвідані посилання»). Тоді стан одного тесту може потрапити в наступний — падіння буде важко діагностувати. Якщо кожен раз новий чистий контекст, причина збою шукається лише в межах одного тесту.",
        },
      ],
    },
    {
      id: "how-playwright-achieves-test-isolation",
      title: {
        en: "How Playwright Achieves Test Isolation",
        uk: "Як Playwright забезпечує ізоляцію",
      },
      paragraphs: [
        {
          en: "Playwright uses browser contexts to achieve Test Isolation. Each test has its own Browser Context. Running the test creates a new browser context each time.  When using Playwright as a Test Runner, browser contexts are created by default. Otherwise, you can create browser contexts manually.",
          uk: "Playwright використовує browser context для ізоляції: у кожного тесту свій context, при кожному запуску він створюється заново. Якщо ви користуєтеся Playwright Test Runner, контексти створюються за замовчуванням; інакше їх можна створювати вручну.",
        },
        {
          en: "Browser contexts can also be used to emulate multi-page scenarios involving mobile devices, permissions, locale and color scheme. Check out our [Emulation](./emulation.md) guide for more details.",
          uk: "Через context можна емулювати мобільні пристрої, дозволи, локаль і тему оформлення. Детальніше — у посібнику [Emulation](./emulation.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: '\ntest(\'example test\', async ({ page, context }) => {\n  // "context" is an isolated BrowserContext, created for this specific test.\n  // "page" belongs to this context.\n});\n\ntest(\'another test\', async ({ page, context }) => {\n  // "context" and "page" in this second test are completely\n  // isolated from the first test.\n});',
        },
        {
          id: "cb-2",
          language: "js",
          code: "const browser = await chromium.launch();\nconst context = await browser.newContext();\nconst page = await context.newPage();",
        },
      ],
    },
    {
      id: "multiple-contexts-in-a-single-test",
      title: {
        en: "Multiple Contexts in a Single Test",
        uk: "Кілька контекстів в одному тесті",
      },
      paragraphs: [
        {
          en: "Playwright can create multiple browser contexts within a single scenario. This is useful when you want to test for multi-user functionality, like a chat.",
          uk: "У межах одного сценарію можна створити кілька browser context — зручно для багатокористувацьких сценаріїв, наприклад чату.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "js",
          code: "\ntest('admin and user', async ({ browser }) => {\n  // Create two isolated browser contexts\n  const adminContext = await browser.newContext();\n  const userContext = await browser.newContext();\n\n  // Create pages and interact with contexts independently\n  const adminPage = await adminContext.newPage();\n  const userPage = await userContext.newPage();\n});",
        },
        {
          id: "cb-8",
          language: "js",
          code: "const { chromium } = require('playwright');\n\n// Create a Chromium browser instance\nconst browser = await chromium.launch();\n\n// Create two isolated browser contexts\nconst userContext = await browser.newContext();\nconst adminContext = await browser.newContext();\n\n// Create pages and interact with contexts independently\nconst adminPage = await adminContext.newPage();\nconst userPage = await userContext.newPage();",
        },
      ],
    },
  ],
  quiz: [],
}
