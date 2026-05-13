import type { PlaywrightTopic } from "../../types"

export const mockBrowserApisTopic: PlaywrightTopic = {
  slug: "mock-browser-apis",
  groupId: "guides",
  order: 255,
  sourceDoc: "mock-browser-js.md",
  officialDocsUrl: "https://playwright.dev/docs/mock-browser-apis",
  title: {
    en: "Mock browser APIs",
    uk: "Мокання браузерних API",
  },
  summary: {
    en: "Playwright provides native support for most of the browser features. However, there are some experimental APIs and APIs which are not (yet) fully supported by all browsers. Playwright usually doesn't provide dedicated automation APIs in such cases. You can use mocks to test the behavior of your application in such cases. This guide gives a few examples.",
    uk: "Playwright нативно підтримує більшість можливостей браузера. Проте є експериментальні або ще не повністю підтримувані в усіх браузерах API — тоді Playwright зазвичай не дає окремих automation API. У таких випадках можна мокати поведінку застосунку; у цьому посібнику — кілька прикладів.",
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
          en: "Playwright provides native support for most of the browser features. However, there are some experimental APIs\nand APIs which are not (yet) fully supported by all browsers. Playwright usually doesn't provide dedicated\nautomation APIs in such cases. You can use mocks to test the behavior of your application in such cases. This guide gives a few examples.",
          uk: "Playwright нативно підтримує більшість можливостей браузера. Проте є експериментальні API\nта API, які ще не повністю підтримуються в усіх браузерах. У таких випадках Playwright зазвичай не надає окремих\nautomation API. Можна мокати поведінку застосунку; нижче — кілька прикладів.",
        },
        {
          en: "Let's consider a web app that uses [battery API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery)\nto show your device's battery status. We'll mock the battery API and check that the page correctly displays the\nbattery status.",
          uk: "Розглянемо вебзастосунок, який використовує [Battery API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery),\nщоб показувати стан батареї. Замокаємо цей API і перевіримо, що сторінка коректно відображає\nстан заряду.",
        },
      ],
    },
    {
      id: "creating-mocks",
      title: {
        en: "Creating mocks",
        uk: "Створення моків",
      },
      paragraphs: [
        {
          en: "Since the page may be calling the API very early while loading it's important to setup all the mocks before the page started loading. The easiest way to achieve that is to call [`method: Page.addInitScript`]:",
          uk: "Сторінка може викликати API дуже рано під час завантаження, тому всі моки варто налаштувати до початку завантаження. Найпростіше — [`method: Page.addInitScript`]:",
        },
        {
          en: "Once this is done you can navigate the page and check its UI state:",
          uk: "Після цього можна перейти на сторінку й перевірити стан інтерфейсу:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "await page.addInitScript(() => {\n  const mockBattery = {\n    level: 0.75,\n    charging: true,\n    chargingTime: 1800,\n    dischargingTime: Infinity,\n    addEventListener: () => { }\n  };\n  // Override the method to always return mock battery info.\n  window.navigator.getBattery = async () => mockBattery;\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "// Configure mock API before each test.\ntest.beforeEach(async ({ page }) => {\n  await page.addInitScript(() => {\n    const mockBattery = {\n      level: 0.90,\n      charging: true,\n      chargingTime: 1800, // seconds\n      dischargingTime: Infinity,\n      addEventListener: () => { }\n    };\n    // Override the method to always return mock battery info.\n    window.navigator.getBattery = async () => mockBattery;\n  });\n});\n\ntest('show battery status', async ({ page }) => {\n  await page.goto('/');\n  await expect(page.locator('.battery-percentage')).toHaveText('90%');\n  await expect(page.locator('.battery-status')).toHaveText('Adapter');\n  await expect(page.locator('.battery-fully')).toHaveText('00:30');\n});",
        },
      ],
    },
    {
      id: "mocking-read-only-apis",
      title: {
        en: "Mocking read-only APIs",
        uk: "Мокання лише для читання API",
      },
      paragraphs: [
        {
          en: "Some APIs are read-only so you won't be able to assign to a navigator property. For example,",
          uk: "Деякі API лише для читання — не вдасться просто присвоїти властивість `navigator`. Наприклад:",
        },
        {
          en: "However, if the property is [configurable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#configurable), you can still override it using the plain JavaScript:",
          uk: "Якщо ж властивість [configurable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#configurable), її можна перевизначити звичайним JavaScript:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "// Following line will have no effect.\nnavigator.cookieEnabled = true;",
        },
        {
          id: "cb-4",
          language: "js",
          code: "await page.addInitScript(() => {\n  Object.defineProperty(Object.getPrototypeOf(navigator), 'cookieEnabled', { value: false });\n});",
        },
      ],
    },
    {
      id: "verifying-api-calls",
      title: {
        en: "Verifying API calls",
        uk: "Перевірка викликів API",
      },
      paragraphs: [
        {
          en: "Sometimes it is useful to check if the page made all expected APIs calls. You can\nrecord all API method invocations and then compare them with golden result.\n[`method: Page.exposeFunction`] may come in handy for passing message from\nthe page back to the test code:",
          uk: "Інколи корисно переконатися, що сторінка зробила всі очікувані виклики API.\nМожна записувати виклики методів і порівнювати з еталоном.\n[`method: Page.exposeFunction`] зручний, щоб передавати повідомлення\nзі сторінки назад у тест:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "test('log battery calls', async ({ page }) => {\n  const log = [];\n  // Expose function for pushing messages to the Node.js script.\n  await page.exposeFunction('logCall', msg => log.push(msg));\n  await page.addInitScript(() => {\n    const mockBattery = {\n      level: 0.75,\n      charging: true,\n      chargingTime: 1800,\n      dischargingTime: Infinity,\n      // Log addEventListener calls.\n      addEventListener: (name, cb) => logCall(`addEventListener:${name}`)\n    };\n    // Override the method to always return mock battery info.\n    window.navigator.getBattery = async () => {\n      logCall('getBattery');\n      return mockBattery;\n    };\n  });\n\n  await page.goto('/');\n  await expect(page.locator('.battery-percentage')).toHaveText('75%');\n\n  // Compare actual calls with golden.\n  expect(log).toEqual([\n    'getBattery',\n    'addEventListener:chargingchange',\n    'addEventListener:levelchange'\n  ]);\n});",
        },
      ],
    },
    {
      id: "updating-mock",
      title: {
        en: "Updating mock",
        uk: "Оновлення мока",
      },
      paragraphs: [
        {
          en: "To test that the app correctly reflects battery status updates it's important to\nmake sure that the mock battery object fires same events that the browser implementation\nwould. The following test demonstrates how to achieve that:",
          uk: "Щоб перевірити, що застосунок коректно реагує на оновлення стану батареї, важливо,\nщоб об’єкт мока генерував ті самі події, що й реалізація в браузері.\nНижче — приклад тесту:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "test('update battery status (no golden)', async ({ page }) => {\n  await page.addInitScript(() => {\n    // Mock class that will notify corresponding listeners when battery status changes.\n    class BatteryMock {\n      level = 0.10;\n      charging = false;\n      chargingTime = 1800;\n      dischargingTime = Infinity;\n      _chargingListeners = [];\n      _levelListeners = [];\n      addEventListener(eventName, listener) {\n        if (eventName === 'chargingchange')\n          this._chargingListeners.push(listener);\n        if (eventName === 'levelchange')\n          this._levelListeners.push(listener);\n      }\n      // Will be called by the test.\n      _setLevel(value) {\n        this.level = value;\n        this._levelListeners.forEach(cb => cb());\n      }\n      _setCharging(value) {\n        this.charging = value;\n        this._chargingListeners.forEach(cb => cb());\n      }\n    }\n    const mockBattery = new BatteryMock();\n    // Override the method to always return mock battery info.\n    window.navigator.getBattery = async () => mockBattery;\n    // Save the mock object on window for easier access.\n    window.mockBattery = mockBattery;\n  });\n\n  await page.goto('/');\n  await expect(page.locator('.battery-percentage')).toHaveText('10%');\n\n  // Update level to 27.5%\n  await page.evaluate(() => window.mockBattery._setLevel(0.275));\n  await expect(page.locator('.battery-percentage')).toHaveText('27.5%');\n  await expect(page.locator('.battery-status')).toHaveText('Battery');\n\n  // Emulate connected adapter\n  await page.evaluate(() => window.mockBattery._setCharging(true));\n  await expect(page.locator('.battery-status')).toHaveText('Adapter');\n  await expect(page.locator('.battery-fully')).toHaveText('00:30');\n});",
        },
      ],
    },
  ],
  quiz: [],
}
