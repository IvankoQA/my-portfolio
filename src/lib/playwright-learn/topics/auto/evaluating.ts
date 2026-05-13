import type { PlaywrightTopic } from "../../types"

export const evaluatingTopic: PlaywrightTopic = {
  slug: "evaluating",
  groupId: "guides",
  order: 190,
  sourceDoc: "evaluating.md",
  officialDocsUrl: "https://playwright.dev/docs/evaluating",
  title: {
    en: "Evaluating JavaScript",
    uk: "Виконання JavaScript",
  },
  summary: {
    en: "Playwright scripts run in your Playwright environment. Your page scripts run in the browser page environment. Those environments don't intersect, they are running in different virtual machines in different processes and even potentially on different computers.",
    uk: "Скрипти Playwright виконуються у вашому середовищі Playwright, а скрипти сторінки — у середовищі браузера. Ці середовища не перетинаються: вони працюють у різних віртуальних машинах, процесах і навіть на різних комп’ютерах.",
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
          en: "Playwright scripts run in your Playwright environment. Your page scripts run in the browser page environment. Those environments don't intersect, they are running in different virtual machines in different processes and even potentially on different computers.",
          uk: "Скрипти Playwright виконуються у вашому середовищі Playwright, а скрипти сторінки — у середовищі браузера. Ці середовища не перетинаються: вони працюють у різних віртуальних машинах, процесах і навіть на різних комп’ютерах.",
        },
        {
          en: "The [`method: Page.evaluate`] API can run a JavaScript function in the context\nof the web page and bring results back to the Playwright environment. Browser globals like\n`window` and `document` can be used in `evaluate`.",
          uk: "API [`method: Page.evaluate`] запускає функцію JavaScript у контексті\nвебсторінки й повертає результат у середовище Playwright. У `evaluate` доступні глобальні об’єкти браузера,\nнаприклад `window` і `document`.",
        },
        {
          en: "If the result is a Promise or if the function is asynchronous evaluate will automatically wait until it's resolved:",
          uk: "Якщо результат — Promise або функція асинхронна, `evaluate` автоматично дочекається її завершення:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "const href = await page.evaluate(() => document.location.href);",
        },
        {
          id: "cb-6",
          language: "js",
          code: "const status = await page.evaluate(async () => {\n  const response = await fetch(location.href);\n  return response.status;\n});",
        },
      ],
    },
    {
      id: "different-environments",
      title: {
        en: "Different environments",
        uk: "Різні середовища",
      },
      paragraphs: [
        {
          en: "Evaluated scripts run in the browser environment, while your test runs in a testing environments. This means you cannot use variables from your test in the page and vice versa. Instead, you should pass them explicitly as an argument.",
          uk: "Оцінюваний код виконується в середовищі браузера, а тест — у середовищі тестів. Тому змінні з тесту недоступні на сторінці й навпаки. Передавайте їх явно аргументом.",
        },
        {
          en: "The following snippet is **WRONG** because it uses the variable directly:",
          uk: "Наступний фрагмент **НЕПРАВИЛЬНИЙ**, бо змінна використовується напряму:",
        },
        {
          en: "The following snippet is **CORRECT** because it passes the value explicitly as an argument:",
          uk: "Наступний фрагмент **ПРАВИЛЬНИЙ**, бо значення передається явно аргументом:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "const data = 'some data';\nconst result = await page.evaluate(() => {\n  // WRONG: there is no \"data\" in the web page.\n  window.myApp.use(data);\n});",
        },
        {
          id: "cb-16",
          language: "js",
          code: "const data = 'some data';\n// Pass |data| as a parameter.\nconst result = await page.evaluate(data => {\n  window.myApp.use(data);\n}, data);",
        },
      ],
    },
    {
      id: "evaluation-argument",
      title: {
        en: "Evaluation Argument",
        uk: "Аргумент оцінювання",
      },
      paragraphs: [
        {
          en: "Playwright evaluation methods like [`method: Page.evaluate`] take a single optional argument. This argument can be a mix of [Serializable] values and [JSHandle] instances. Handles are automatically converted to the value they represent.",
          uk: "Методи оцінювання Playwright, зокрема [`method: Page.evaluate`], приймають один необов’язковий аргумент. Це може бути поєднання значень типу [Serializable] та екземплярів [JSHandle]. Дескриптори автоматично перетворюються на відповідні значення.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-21",
          language: "js",
          code: "// A primitive value.\nawait page.evaluate(num => num, 42);\n\n// An array.\nawait page.evaluate(array => array.length, [1, 2, 3]);\n\n// An object.\nawait page.evaluate(object => object.foo, { foo: 'bar' });\n\n// A single handle.\nconst button = await page.evaluateHandle('window.button');\nawait page.evaluate(button => button.textContent, button);\n\n// Alternative notation using JSHandle.evaluate.\nawait button.evaluate((button, from) => button.textContent.substring(from), 5);\n\n// Object with multiple handles.\nconst button1 = await page.evaluateHandle('window.button1');\nconst button2 = await page.evaluateHandle('window.button2');\nawait page.evaluate(\n    o => o.button1.textContent + o.button2.textContent,\n    { button1, button2 });\n\n// Object destructuring works. Note that property names must match\n// between the destructured object and the argument.\n// Also note the required parenthesis.\nawait page.evaluate(\n    ({ button1, button2 }) => button1.textContent + button2.textContent,\n    { button1, button2 });\n\n// Array works as well. Arbitrary names can be used for destructuring.\n// Note the required parenthesis.\nawait page.evaluate(\n    ([b1, b2]) => b1.textContent + b2.textContent,\n    [button1, button2]);\n\n// Any mix of serializables and handles works.\nawait page.evaluate(\n    x => x.button1.textContent + x.list[0].textContent + String(x.foo),\n    { button1, list: [button2], foo: null });",
        },
      ],
    },
    {
      id: "init-scripts",
      title: {
        en: "Init scripts",
        uk: "Початкові скрипти",
      },
      paragraphs: [
        {
          en: "Sometimes it is convenient to evaluate something in the page before it starts loading. For example, you might want to setup some mocks or test data.",
          uk: "Інколи зручно виконати код на сторінці до початку завантаження — наприклад, підготувати моки або тестові дані.",
        },
        {
          en: "In this case, use [`method: Page.addInitScript`] or [`method: BrowserContext.addInitScript`]. In the example below, we will replace `Math.random()` with a constant value.",
          uk: "Для цього використовуйте [`method: Page.addInitScript`] або [`method: BrowserContext.addInitScript`]. У прикладі нижче `Math.random()` замінюється на константу.",
        },
        {
          en: "First, create a `preload.js` file that contains the mock.",
          uk: "Спочатку створіть файл `preload.js` із моком.",
        },
        {
          en: "Next, add init script to the page.",
          uk: "Далі додайте початковий скрипт до сторінки.",
        },
        {
          en: "######",
          uk: "######",
        },
        {
          en: "Alternatively, you can pass a function instead of creating a preload script file. This is more convenient for short or one-off scripts. You can also pass an argument this way.",
          uk: "Або передайте функцію замість окремого файлу — зручніше для коротких або разових скриптів. Аргумент також можна передати таким чином.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-26",
          language: "js",
          code: "// preload.js\nMath.random = () => 42;",
        },
        {
          id: "cb-27",
          language: "js",
          code: "\ntest.beforeEach(async ({ page }) => {\n  // Add script for every test in the beforeEach hook.\n  // Make sure to correctly resolve the script path.\n  await page.addInitScript({ path: path.resolve(__dirname, '../mocks/preload.js') });\n});",
        },
        {
          id: "cb-32",
          language: "js",
          code: "\n// Add script for every test in the beforeEach hook.\ntest.beforeEach(async ({ page }) => {\n  const value = 42;\n  await page.addInitScript(value => {\n    Math.random = () => value;\n  }, value);\n});",
        },
      ],
    },
  ],
  quiz: [],
}
