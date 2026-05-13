import type { PlaywrightTopic } from "../types"

export const writingTestsTopic: PlaywrightTopic = {
  slug: "writing-tests",
  groupId: "writing-tests",
  order: 20,
  level: "beginner",
  trackOrder: 5,
  sourceDoc: "writing-tests-js.md",
  officialDocsUrl: "https://playwright.dev/docs/writing-tests",
  title: {
    en: "Writing your first tests",
    uk: "Як писати перші тести",
  },
  summary: {
    en: "test() blocks, locators, web-first expect assertions, and the page fixture.",
    uk: "Блок test(), локатори, web-first ассерції expect і фікстура page.",
  },
  sections: [
    {
      id: "anatomy",
      title: { en: "Anatomy of a test", uk: "Будова тесту" },
      paragraphs: [
        {
          en: "A test is a function passed to `test('name', async ({ page }) => { ... })`. Playwright injects fixtures (page, context, request, …) into the destructured argument. Each test gets a fresh isolated browser context, so there is no shared cookie or storage pollution between tests by default.",
          uk: "Тест — це функція в `test('name', async ({ page }) => { ... })`. Playwright інжектить фікстури (page, context, request, …) у деструктурований аргумент. Кожен тест отримує свіжий ізольований браузерний контекст — без спільних кук і storage між тестами.",
        },
      ],
      codeBlocks: [
        {
          id: "basic",
          language: "ts",
          code: `import { test, expect } from '@playwright/test'

test('homepage has title and CTA', async ({ page }) => {
  await page.goto('https://playwright.dev/')

  await expect(page).toHaveTitle(/Playwright/)
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "locators",
      title: { en: "Locators", uk: "Локатори" },
      paragraphs: [
        {
          en: "Locators are how Playwright finds elements. Prefer user-facing locators: getByRole, getByLabel, getByText, getByPlaceholder, getByAltText, getByTitle. They are auto-waiting and re-resolving: every action retries until the locator points to exactly one actionable element or the timeout is reached.",
          uk: "Локатори — це спосіб Playwright знаходити елементи. Перевага у user-facing варіантів: getByRole, getByLabel, getByText, getByPlaceholder, getByAltText, getByTitle. Локатори auto-waiting та re-resolving: кожна дія повторюється, доки локатор не вкаже саме на один інтерактивний елемент або не вийде таймаут.",
        },
        {
          en: "Use CSS or XPath only when there is no semantic alternative. Locators chain: page.getByRole('list').getByRole('listitem').nth(0).",
          uk: "CSS чи XPath варто залишити на випадки, коли семантичного варіанта немає. Локатори ланцюгуються: page.getByRole('list').getByRole('listitem').nth(0).",
        },
      ],
      codeBlocks: [
        {
          id: "loc-examples",
          language: "ts",
          code: `await page.getByRole('button', { name: 'Sign in' }).click()
await page.getByLabel('Email').fill('user@example.com')
await page.getByPlaceholder('Search').press('Enter')
await page.getByText('Welcome', { exact: false }).waitFor()`,
        },
      ],
    },
    {
      id: "assertions",
      title: { en: "Web-first assertions", uk: "Web-first ассерції" },
      paragraphs: [
        {
          en: "expect() from @playwright/test auto-retries until the assertion passes or the assertion timeout expires. This removes most manual waitFor calls and the dreaded sleep(...). Prefer assertions like toBeVisible, toHaveText, toHaveURL over checking DOM state immediately.",
          uk: "expect() з @playwright/test авто-ретраїть, поки ассерція не пройде або не вичерпається таймаут. Це прибирає більшість ручних waitFor та сумнозвісний sleep(...). Краще писати toBeVisible, toHaveText, toHaveURL замість миттєвої перевірки DOM.",
        },
      ],
      codeBlocks: [
        {
          id: "expects",
          language: "ts",
          code: `await expect(page.getByRole('alert')).toHaveText('Saved')
await expect(page).toHaveURL(/\\/dashboard$/)
await expect(page.getByTestId('cart-count')).toHaveText('3')`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Which locator should you reach for FIRST when targeting a button labelled “Sign in”?",
        uk: "Який локатор обрати ПЕРШИМ для кнопки з текстом «Sign in»?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.locator('button.signin')",
            uk: "page.locator('button.signin')",
          },
        },
        {
          id: "b",
          label: {
            en: "page.getByRole('button', { name: 'Sign in' })",
            uk: "page.getByRole('button', { name: 'Sign in' })",
          },
        },
        {
          id: "c",
          label: {
            en: "page.$('//button[contains(., \"Sign in\")]')",
            uk: "page.$('//button[contains(., \"Sign in\")]')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright recommends user-facing role-based locators because they survive CSS refactors and match how assistive tech sees the page. CSS and XPath are last-resort fallbacks.",
        uk: "Playwright радить user-facing role-локатори: вони переживають рефакторинги CSS і збігаються з тим, як сторінку бачать асистивні технології. CSS і XPath — останній варіант.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What does `await expect(locator).toBeVisible()` do?",
        uk: "Що робить `await expect(locator).toBeVisible()`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Checks once immediately and throws if the element is not visible right now.",
            uk: "Перевіряє одразу один раз і кидає помилку, якщо елемент не видимий саме зараз.",
          },
        },
        {
          id: "b",
          label: {
            en: "Polls until the element becomes visible or the assertion timeout is reached.",
            uk: "Опитує, доки елемент не стане видимим або не вичерпається таймаут.",
          },
        },
        {
          id: "c",
          label: {
            en: "Sleeps for 5 seconds and then checks visibility.",
            uk: "Спить 5 секунд і потім перевіряє видимість.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "expect from @playwright/test is web-first — assertions auto-retry until they pass or the timeout fires. That is why hardcoded waits are not needed in well-written tests.",
        uk: "expect із @playwright/test є web-first — ассерції повторюються, доки не пройдуть, або поки не спрацює таймаут. Тому жорсткі sleep’и у нормальних тестах не потрібні.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Why does each test get its own browser context by default?",
        uk: "Чому кожен тест за замовчуванням отримує власний browser context?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "To make tests slower so they appear thorough.",
            uk: "Щоб тести виглядали ретельнішими через повільність.",
          },
        },
        {
          id: "b",
          label: {
            en: "To isolate cookies, storage and permissions so tests don’t affect each other.",
            uk: "Щоб ізолювати куки, storage та дозволи — тести не впливають один на одного.",
          },
        },
        {
          id: "c",
          label: {
            en: "Because Playwright cannot reuse browser contexts across tests.",
            uk: "Бо Playwright нібито не вміє перевикористовувати browser context.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Fresh BrowserContexts per test give isolation (cookies, localStorage, permissions, service workers) which makes parallel execution safe and reproducible. Contexts are cheap so this is also fast.",
        uk: "Свіжий BrowserContext на тест дає ізоляцію (куки, localStorage, дозволи, service worker’и). Це робить паралельний запуск безпечним і відтворюваним; контексти дешеві, тож це ще й швидко.",
      },
    },
  ],
}
