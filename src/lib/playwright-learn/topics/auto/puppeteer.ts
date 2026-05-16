import type { PlaywrightTopic } from "../../types"

export const puppeteerTopic: PlaywrightTopic = {
  slug: "puppeteer",
  groupId: "migration",
  order: 290,
  level: "advanced",
  trackOrder: 28,
  sourceDoc: "puppeteer-js.md",
  officialDocsUrl: "https://playwright.dev/docs/puppeteer",
  title: {
    en: "Migrating from Puppeteer",
    uk: "Міграція з Puppeteer",
  },
  summary: {
    en: "Coming from Puppeteer, the migration is mostly search-and-replace: puppeteer.launch() → playwright.chromium.launch(), page.type() → locator.fill(), page.$() → locator (stop using ElementHandle). The main things you gain that Puppeteer doesn't have: Firefox and WebKit support, auto-waiting that eliminates most explicit waits, and isolated browser contexts without the incognito workaround.",
    uk: "Прийшовши з Puppeteer — міграція здебільшого пошук-і-заміна: puppeteer.launch() → playwright.chromium.launch(), page.type() → locator.fill(), page.$() → locator (перестати використовувати ElementHandle). Головне що отримуєш чого немає в Puppeteer: підтримка Firefox і WebKit, auto-waiting що прибирає більшість явних очікувань, і ізольовані browser contexts без incognito-обходу.",
  },
  sections: [
    {
      id: "migration-principles",
      title: {
        en: "Key differences from Puppeteer",
        uk: "Ключові відмінності від Puppeteer",
      },
      paragraphs: [
        {
          en: "Most Puppeteer APIs exist in Playwright with the same name. The main behavioral differences:\n- **Cross-browser from the start** — `playwright.chromium`, `playwright.firefox`, `playwright.webkit`. Puppeteer only added Firefox experimentally.\n- **Locators over ElementHandle** — `page.$()` is discouraged. Use `page.locator()` or `getBy*` — they re-query on every action and don't go stale after React re-renders.\n- **Auto-waiting everywhere** — `page.waitForSelector()` and `waitForNavigation` are rarely needed. Every action and assertion already waits for the element to be ready.\n- **Browser contexts, not incognito** — `browser.createIncognitoBrowserContext()` → `browser.newContext()`. Contexts are first-class in Playwright and each test gets its own automatically.",
          uk: "Більшість API Puppeteer є у Playwright з тою самою назвою. Головні поведінкові відмінності:\n- **Кросбраузерність з початку** — `playwright.chromium`, `playwright.firefox`, `playwright.webkit`. Puppeteer додав Firefox лише експериментально.\n- **Locators замість ElementHandle** — `page.$()` не рекомендується. Використовуй `page.locator()` або `getBy*` — вони повторно запитують при кожній дії і не застарівають після React-перерендеру.\n- **Auto-waiting скрізь** — `page.waitForSelector()` і `waitForNavigation` рідко потрібні. Кожна дія і assertion вже чекає щоб елемент був готовий.\n- **Browser contexts, не incognito** — `browser.createIncognitoBrowserContext()` → `browser.newContext()`. Contexts є first-class у Playwright і кожен тест автоматично отримує свій.",
        },
      ],
    },
    {
      id: "cheat-sheet",
      title: {
        en: "Quick reference",
        uk: "Швидка довідка",
      },
      paragraphs: [
        {
          en: "| Puppeteer | Playwright |\n|---|---|\n| `await puppeteer.launch()` | `await playwright.chromium.launch()` |\n| `puppeteer.launch({product: 'firefox'})` | `await playwright.firefox.launch()` |\n| WebKit not supported | `await playwright.webkit.launch()` |\n| `await browser.createIncognitoBrowserContext(...)` | `await browser.newContext(...)` |\n| `await page.setViewport(...)` | `await page.setViewportSize(...)` |\n| `await page.waitForXPath(xpath)` | `await page.waitForSelector(xpath)` |\n| `await page.waitForNetworkIdle(...)` | `await page.waitForLoadState('networkidle')` |\n| `await page.$eval(...)` | Use assertions: `await expect(locator).toHaveText(...)` |\n| `await page.$(...)` | Discouraged — use `page.locator(...)` |\n| `await page.$x(xpath)` | Discouraged — use `page.locator(...)` |\n| No checkbox/radio helpers | `await page.locator(selector).check()` |\n| `await page.click(selector)` | `await page.locator(selector).click()` |\n| `await page.focus(selector)` | `await page.locator(selector).focus()` |\n| `await page.hover(selector)` | `await page.locator(selector).hover()` |\n| `await page.select(selector, values)` | `await page.locator(selector).selectOption(values)` |\n| `await page.tap(selector)` | `await page.locator(selector).tap()` |\n| `await page.type(selector, ...)` | `await page.locator(selector).fill(...)` |\n| `await elementHandle.uploadFile(...)` | `await page.locator(selector).setInputFiles(...)` |\n| `await page.cookies([...urls])` | `await browserContext.cookies([urls])` |\n| `await page.deleteCookie(...cookies)` | `await browserContext.clearCookies()` |\n| `await page.setCookie(...cookies)` | `await browserContext.addCookies(cookies)` |",
          uk: "| Puppeteer | Playwright |\n|---|---|\n| `await puppeteer.launch()` | `await playwright.chromium.launch()` |\n| `puppeteer.launch({product: 'firefox'})` | `await playwright.firefox.launch()` |\n| WebKit не підтримується | `await playwright.webkit.launch()` |\n| `await browser.createIncognitoBrowserContext(...)` | `await browser.newContext(...)` |\n| `await page.setViewport(...)` | `await page.setViewportSize(...)` |\n| `await page.waitForXPath(xpath)` | `await page.waitForSelector(xpath)` |\n| `await page.waitForNetworkIdle(...)` | `await page.waitForLoadState('networkidle')` |\n| `await page.$eval(...)` | Використовуй assertions: `await expect(locator).toHaveText(...)` |\n| `await page.$(...)` | Не рекомендується — використовуй `page.locator(...)` |\n| `await page.$x(xpath)` | Не рекомендується — використовуй `page.locator(...)` |\n| Немає хелперів для checkbox/radio | `await page.locator(selector).check()` |\n| `await page.click(selector)` | `await page.locator(selector).click()` |\n| `await page.focus(selector)` | `await page.locator(selector).focus()` |\n| `await page.hover(selector)` | `await page.locator(selector).hover()` |\n| `await page.select(selector, values)` | `await page.locator(selector).selectOption(values)` |\n| `await page.tap(selector)` | `await page.locator(selector).tap()` |\n| `await page.type(selector, ...)` | `await page.locator(selector).fill(...)` |\n| `await elementHandle.uploadFile(...)` | `await page.locator(selector).setInputFiles(...)` |\n| `await page.cookies([...urls])` | `await browserContext.cookies([urls])` |\n| `await page.deleteCookie(...cookies)` | `await browserContext.clearCookies()` |\n| `await page.setCookie(...cookies)` | `await browserContext.addCookies(cookies)` |",
        },
      ],
    },
    {
      id: "examples",
      title: {
        en: "Side by side examples",
        uk: "Приклади поруч",
      },
      paragraphs: [
        {
          en: "Automation script — screenshot workflow:",
          uk: "Скрипт автоматизації — знімок екрану:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: `// Puppeteer (до міграції)
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://playwright.dev/', { waitUntil: 'networkidle2' })
  await page.screenshot({ path: 'example.png' })
  await browser.close()
})()`,
        },
        {
          id: "cb-2",
          language: "js",
          code: `// Playwright (після міграції)
const { chromium } = require('playwright')  // явний імпорт браузера

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 800 })  // setViewport → setViewportSize
  await page.goto('https://playwright.dev/', {
    waitUntil: 'networkidle',  // networkidle2 → networkidle
  })
  await page.screenshot({ path: 'example.png' })
  await browser.close()
})()`,
        },
        {
          id: "cb-3",
          language: "js",
          code: `// Puppeteer + Jest (до міграції)
describe('Playwright homepage', () => {
  let browser
  let page

  beforeAll(async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
  })

  it('contains hero title', async () => {
    await page.goto('https://playwright.dev/')
    await page.waitForSelector('.hero__title')
    const text = await page.$eval('.hero__title', e => e.textContent)
    expect(text).toContain('Playwright enables reliable end-to-end testing')
  })

  afterAll(() => browser.close())
})`,
        },
        {
          id: "cb-4",
          language: "js",
          code: `// Playwright Test (після міграції)
test.describe('Playwright homepage', () => {
  test('contains hero title', async ({ page }) => {  // page як фікстура, не глобальна
    await page.goto('https://playwright.dev/')
    // waitForSelector + $eval → один assertion
    // toContainText auto-waits — waitForSelector не потрібен
    const titleLocator = page.locator('.hero__title')
    await expect(titleLocator).toContainText(
        'Playwright enables reliable end-to-end testing'
    )
  })
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "In Puppeteer you use page.type('#search', 'orders') then const text = await page.$eval('.result-count', el => el.textContent) to verify the result count. What's the idiomatic Playwright equivalent?",
        uk: "У Puppeteer використовуєш page.type('#search', 'orders') потім const text = await page.$eval('.result-count', el => el.textContent) щоб перевірити кількість результатів. Який ідіоматичний Playwright-еквівалент?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.fill('#search', 'orders') and const text = await page.evaluate(() => document.querySelector('.result-count').textContent)",
            uk: "page.fill('#search', 'orders') і const text = await page.evaluate(() => document.querySelector('.result-count').textContent)",
          },
        },
        {
          id: "b",
          label: {
            en: "await page.locator('#search').fill('orders') and await expect(page.locator('.result-count')).toHaveText('...') — locator.fill() replaces page.type(), and a web-first assertion replaces page.$eval() for verification",
            uk: "await page.locator('#search').fill('orders') і await expect(page.locator('.result-count')).toHaveText('...') — locator.fill() замінює page.type(), а web-first assertion замінює page.$eval() для перевірки",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.locator('#search').type('orders') and await page.locator('.result-count').textContent()",
            uk: "await page.locator('#search').type('orders') і await page.locator('.result-count').textContent()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.type()` dispatches key events character by character (useful for triggering keydown/keyup handlers). `locator.fill()` is the Playwright equivalent for form inputs — faster and more reliable. For verification, `page.$eval()` reads a value once and you assert on it in Node.js — if the DOM updates asynchronously, the assertion can fail. Playwright's web-first assertions (`expect(locator).toHaveText(...)`) auto-retry until the DOM matches or times out, so they're more resilient to async state changes. Option C is wrong: `locator.type()` exists but it's the slow character-by-character method (same as Puppeteer's type); `locator.fill()` is preferred.",
        uk: "`page.type()` диспетчеризує ключові події символ за символом (корисно для тригера keydown/keyup хендлерів). `locator.fill()` — Playwright-еквівалент для form inputs — швидший і надійніший. Для перевірки, `page.$eval()` читає значення один раз і ти asserting на ньому в Node.js — якщо DOM оновлюється асинхронно, assertion може впасти. Web-first assertions Playwright (`expect(locator).toHaveText(...)`) повторно перевіряють до збігу DOM або тайм-ауту, тому більш стійкі до async-змін стану. Варіант C неправильний: `locator.type()` існує але це повільний посимвольний метод (як Puppeteer's type); `locator.fill()` є кращим вибором.",
      },
    },
  ],
}
