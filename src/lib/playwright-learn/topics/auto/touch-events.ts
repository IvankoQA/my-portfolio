import type { PlaywrightTopic } from "../../types"

export const touchEventsTopic: PlaywrightTopic = {
  slug: "touch-events",
  groupId: "guides",
  order: 410,
  level: "advanced",
  trackOrder: 24,
  sourceDoc: "touch-events.md",
  officialDocsUrl: "https://playwright.dev/docs/touch-events",
  title: {
    en: "Touch events (legacy)",
    uk: "Події дотику (legacy)",
  },
  summary: {
    en: "Web applications that handle legacy [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) to respond to gestures like swipe, pinch, and tap can be tested by manually dispatching [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)s to the page. The examples below demonstrate how to use [`method: Locator.dispatchEvent`] and pass [Touch](https://developer.mozil…",
    uk: "Вебзастосунки, що обробляють застарілі [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) для жестів на кшталт свайпу, щипка й тапу, можна тестувати, вручну диспетчеруючи на сторінку події [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)s. Нижче показано, як використовувати [`method: Locator.dispatchEvent`] і передавати [Touch](https://developer.mozil…",
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
          en: "Web applications that handle legacy [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) to respond to gestures like swipe, pinch, and tap can be tested by manually dispatching [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)s to the page. The examples below demonstrate how to use [`method: Locator.dispatchEvent`] and pass [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) points as arguments.",
          uk: "Вебзастосунки, що обробляють застарілі [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) для відповіді на жести на кшталт свайпу, щипка й тапу, можна тестувати, вручну диспетчеруючи на сторінку події [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)s. Нижче показано, як використовувати [`method: Locator.dispatchEvent`] і передавати точки [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) як аргументи.",
        },
        {
          en: "Note that [`method: Locator.dispatchEvent`] does not set [`Event.isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted) property. If your web page relies on it, make sure to disable `isTrusted` check during the test.",
          uk: "Зауважте: [`method: Locator.dispatchEvent`] не встановлює властивість [`Event.isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted). Якщо сторінка на це спирається, під час тесту вимкніть перевірку `isTrusted`.",
        },
        {
          en: "### Emulating pan gesture",
          uk: "### Емуляція жесту pan",
        },
        {
          en: "In the example below, we emulate pan gesture that is expected to move the map. The app under test only uses `clientX/clientY` coordinates of the touch point, so we initialize just that. In a more complex scenario you may need to also set `pageX/pageY/screenX/screenY`, if your app needs them.",
          uk: "У прикладі нижче емулюється жест pan, який має зрушити карту. Тестований застосунок використовує лише координати `clientX/clientY` точки дотику, тому ініціалізуємо лише їх. У складнішому сценарії може знадобитися також задати `pageX/pageY/screenX/screenY`, якщо цього вимагає застосунок.",
        },
        {
          en: "### Emulating pinch gesture",
          uk: "### Емуляція жесту pinch",
        },
        {
          en: "In the example below, we emulate pinch gesture, i.e. two touch points moving closer to each other. It is expected to zoom out the map. The app under test only uses `clientX/clientY` coordinates of touch points, so we initialize just that. In a more complex scenario you may need to also set `pageX/pageY/screenX/screenY`, if your app needs them.",
          uk: "У прикладі нижче емулюється жест pinch: дві точки дотику зближуються. Очікується віддалення карти (zoom out). Тестований застосунок використовує лише координати `clientX/clientY` точок дотику, тому ініціалізуємо лише їх. У складнішому сценарії може знадобитися також задати `pageX/pageY/screenX/screenY`, якщо цього вимагає застосунок.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\ntest.use({ ...devices['Pixel 7'] });\n\nasync function pan(locator: Locator, deltaX?: number, deltaY?: number, steps?: number) {\n  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {\n    const bounds = target.getBoundingClientRect();\n    const centerX = bounds.left + bounds.width / 2;\n    const centerY = bounds.top + bounds.height / 2;\n    return { centerX, centerY };\n  });\n\n  // Providing only clientX and clientY as the app only cares about those.\n  const touches = [{\n    identifier: 0,\n    clientX: centerX,\n    clientY: centerY,\n  }];\n  await locator.dispatchEvent('touchstart',\n      { touches, changedTouches: touches, targetTouches: touches });\n\n  steps = steps ?? 5;\n  deltaX = deltaX ?? 0;\n  deltaY = deltaY ?? 0;\n  for (let i = 1; i <= steps; i++) {\n    const touches = [{\n      identifier: 0,\n      clientX: centerX + deltaX * i / steps,\n      clientY: centerY + deltaY * i / steps,\n    }];\n    await locator.dispatchEvent('touchmove',\n        { touches, changedTouches: touches, targetTouches: touches });\n  }\n\n  await locator.dispatchEvent('touchend');\n}\n\ntest(`pan gesture to move the map`, async ({ page }) => {\n  await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z',\n      { waitUntil: 'commit' });\n  await page.getByRole('button', { name: 'Keep using web' }).click();\n  await expect(page.getByRole('button', { name: 'Keep using web' })).not.toBeVisible();\n  // Get the map element.\n  const met = page.locator('[data-test-id=\"met\"]');\n  for (let i = 0; i < 5; i++)\n    await pan(met, 200, 100);\n  // Ensure the map has been moved.\n  await expect(met).toHaveScreenshot();\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "\ntest.use({ ...devices['Pixel 7'] });\n\nasync function pinch(locator: Locator,\n  arg: { deltaX?: number, deltaY?: number, steps?: number, direction?: 'in' | 'out' }) {\n  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {\n    const bounds = target.getBoundingClientRect();\n    const centerX = bounds.left + bounds.width / 2;\n    const centerY = bounds.top + bounds.height / 2;\n    return { centerX, centerY };\n  });\n\n  const deltaX = arg.deltaX ?? 50;\n  const steps = arg.steps ?? 5;\n  const stepDeltaX = deltaX / (steps + 1);\n\n  // Two touch points equally distant from the center of the element.\n  const touches = [\n    {\n      identifier: 0,\n      clientX: centerX - (arg.direction === 'in' ? deltaX : stepDeltaX),\n      clientY: centerY,\n    },\n    {\n      identifier: 1,\n      clientX: centerX + (arg.direction === 'in' ? deltaX : stepDeltaX),\n      clientY: centerY,\n    },\n  ];\n  await locator.dispatchEvent('touchstart',\n      { touches, changedTouches: touches, targetTouches: touches });\n\n  // Move the touch points towards or away from each other.\n  for (let i = 1; i <= steps; i++) {\n    const offset = (arg.direction === 'in' ? (deltaX - i * stepDeltaX) : (stepDeltaX * (i + 1)));\n    const touches = [\n      {\n        identifier: 0,\n        clientX: centerX - offset,\n        clientY: centerY,\n      },\n      {\n        identifier: 0,\n        clientX: centerX + offset,\n        clientY: centerY,\n      },\n    ];\n    await locator.dispatchEvent('touchmove',\n        { touches, changedTouches: touches, targetTouches: touches });\n  }\n\n  await locator.dispatchEvent('touchend', { touches: [], changedTouches: [], targetTouches: [] });\n}\n\ntest(`pinch in gesture to zoom out the map`, async ({ page }) => {\n  await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z',\n      { waitUntil: 'commit' });\n  await page.getByRole('button', { name: 'Keep using web' }).click();\n  await expect(page.getByRole('button', { name: 'Keep using web' })).not.toBeVisible();\n  // Get the map element.\n  const met = page.locator('[data-test-id=\"met\"]');\n  for (let i = 0; i < 5; i++)\n    await pinch(met, { deltaX: 40, direction: 'in' });\n  // Ensure the map has been zoomed out.\n  await expect(met).toHaveScreenshot();\n});",
        },
      ],
    },
  ],
  quiz: [],
}
