import type { PlaywrightTopic } from "../../types"

export const extensibilityTopic: PlaywrightTopic = {
  slug: "extensibility",
  groupId: "guides",
  order: 200,
  level: "advanced",
  trackOrder: 19,
  sourceDoc: "extensibility.md",
  officialDocsUrl: "https://playwright.dev/docs/extensibility",
  title: {
    en: "Extensibility",
    uk: "Розширюваність",
  },
  summary: {
    en: "Playwright lets you register custom selector engines via playwright.selectors.register(). The engine defines query() and queryAll() functions that run in the browser to find elements. I've only needed this once — for an internal component library that used custom data attributes that didn't fit standard locator strategies. In most cases, getByTestId with a custom testIdAttribute in config is enough.",
    uk: "Playwright дозволяє реєструвати власні рушії селекторів через playwright.selectors.register(). Рушій визначає функції query() і queryAll() що виконуються в браузері для пошуку елементів. Мені це знадобилося лише раз — для внутрішньої бібліотеки компонентів що використовувала кастомні дата-атрибути які не вписувалися в стандартні стратегії локаторів. У більшості випадків вистачає getByTestId з кастомним testIdAttribute у конфігурації.",
  },
  sections: [
    {
      id: "when-you-need-this",
      title: {
        en: "When you'd actually need a custom selector engine",
        uk: "Коли насправді потрібен кастомний рушій селекторів",
      },
      paragraphs: [
        {
          en: "Almost never. The built-in locators cover almost everything: `getByRole`, `getByLabel`, `getByText`, `getByTestId`. If I need a custom test id attribute (say `data-qa` instead of `data-testid`), I just configure `testIdAttribute` in `playwright.config.ts` — that's usually enough.",
          uk: "Майже ніколи. Вбудовані локатори покривають майже все: `getByRole`, `getByLabel`, `getByText`, `getByTestId`. Якщо потрібен кастомний атрибут для test id (наприклад `data-qa` замість `data-testid`), просто налаштовую `testIdAttribute` у `playwright.config.ts` — зазвичай цього достатньо.",
        },
        {
          en: "The one real use case: an internal component library that exposes elements through a non-standard attribute or naming scheme that the built-in locators can't address. For example, a design system where all components have a `data-component` attribute with the component name — I can write an engine that finds elements by component name.",
          uk: "Єдиний реальний кейс: внутрішня бібліотека компонентів що надає елементи через нестандартний атрибут або схему іменування яку вбудовані локатори не можуть адресувати. Наприклад, система дизайну де всі компоненти мають атрибут `data-component` з іменем компонента — можна написати рушій який знаходить елементи за іменем компонента.",
        },
      ],
      codeBlocks: [
        {
          id: "config-testid",
          language: "ts",
          code: `// playwright.config.ts — зазвичай достатньо просто змінити атрибут
export default defineConfig({
  use: {
    // тепер page.getByTestId('save-btn') шукає data-qa="save-btn"
    testIdAttribute: 'data-qa',
  },
})`,
        },
      ],
    },
    {
      id: "custom-engine",
      title: {
        en: "Registering a custom selector engine",
        uk: "Реєстрація кастомного рушія селекторів",
      },
      paragraphs: [
        {
          en: "A selector engine needs two functions: `query()` (returns first match) and `queryAll()` (returns all matches). Both run in the browser context. The engine must be registered before creating the page — in a worker-scoped fixture.",
          uk: "Рушій селектора потребує двох функцій: `query()` (повертає перший збіг) і `queryAll()` (повертає всі збіги). Обидві виконуються в контексті браузера. Рушій потрібно зареєструвати до створення сторінки — у фікстурі з областю видимості worker.",
        },
        {
          en: "I register engines in a worker-scoped auto-fixture so the registration happens once per worker, not per test. This is important — registering the same engine name twice throws an error.",
          uk: "Реєструю рушії у worker-scoped auto-фікстурі щоб реєстрація відбувалася один раз на воркер, а не на тест. Це важливо — повторна реєстрація одного імені рушія кидає помилку.",
        },
      ],
      codeBlocks: [
        {
          id: "engine-example",
          language: "ts",
          code: `// fixtures.ts — реєстрація кастомного рушія
import { test as base } from '@playwright/test'

// Рушій що знаходить елементи за атрибутом data-component
const createComponentEngine = () => ({
  query(root: Element, selector: string) {
    return root.querySelector(\`[data-component="\${selector}"]\`)
  },
  queryAll(root: Element, selector: string) {
    return Array.from(root.querySelectorAll(\`[data-component="\${selector}"]\`))
  },
})

export const test = base.extend({
  // Реєструвати один раз на воркер (auto: true — запускається автоматично)
  selectorRegistration: [async ({ playwright }, use) => {
    await playwright.selectors.register('component', createComponentEngine)
    await use()
  }, { scope: 'worker', auto: true }],
})`,
        },
        {
          id: "use-engine",
          language: "ts",
          code: `// В тестах — тепер можна використовувати 'component=' префікс
import { test, expect } from './fixtures'

test('saves the order', async ({ page }) => {
  // Знайти елемент з data-component="OrderForm"
  const form = page.locator('component=OrderForm')

  // Поєднувати з вбудованими локаторами
  await form.getByLabel('Customer').fill('Acme Corp')
  await form.locator('component=SaveButton').click()

  await expect(page.locator('component=SuccessToast')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "content-script",
      title: {
        en: "Content script mode for safety",
        uk: "Режим content script для безпеки",
      },
      paragraphs: [
        {
          en: "By default, the engine runs in the same JavaScript context as the app — meaning the app could accidentally interfere with the engine (e.g., by overriding `Node.prototype` methods). Registering with `{ contentScript: true }` runs the engine in an isolated content script context, protected from the app's JavaScript.",
          uk: "За замовчуванням рушій виконується в тому ж JavaScript-контексті що й застосунок — тобто застосунок може випадково заважати рушію (наприклад, перевизначивши методи `Node.prototype`). Реєстрація з `{ contentScript: true }` запускає рушій в ізольованому контексті content script, захищеному від JavaScript застосунку.",
        },
        {
          en: "All built-in Playwright selector engines run as content scripts. I should do the same for any engine I write.",
          uk: "Всі вбудовані рушії селекторів Playwright виконуються як content scripts. Те саме варто робити для будь-якого написаного мною рушія.",
        },
      ],
      codeBlocks: [
        {
          id: "content-script",
          language: "ts",
          code: `// Реєстрація з ізоляцією content script
await playwright.selectors.register('component', createComponentEngine, {
  contentScript: true,
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your team uses data-qa attributes for all test identifiers instead of data-testid. What's the simplest way to make page.getByTestId() work with data-qa?",
        uk: "Твоя команда використовує атрибути data-qa для всіх тестових ідентифікаторів замість data-testid. Який найпростіший спосіб змусити page.getByTestId() працювати з data-qa?",
      },
      options: [
        { id: "a", label: { en: "Register a custom selector engine that queries by data-qa attribute.", uk: "Зареєструвати кастомний рушій селекторів який шукає за атрибутом data-qa." } },
        { id: "b", label: { en: "Set `testIdAttribute: 'data-qa'` in `playwright.config.ts` `use` block — no custom engine needed.", uk: "Встановити `testIdAttribute: 'data-qa'` у блоці `use` у `playwright.config.ts` — кастомний рушій не потрібен." } },
        { id: "c", label: { en: "Use `page.locator('[data-qa=...]')` everywhere instead of `getByTestId`.", uk: "Використовувати `page.locator('[data-qa=...]')` скрізь замість `getByTestId`." } },
        { id: "d", label: { en: "Override `getByTestId` in a base test fixture to use a custom attribute.", uk: "Перевизначити `getByTestId` в базовій test fixture для використання кастомного атрибута." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`testIdAttribute` in the config is exactly the escape hatch for teams that use a different attribute name for test IDs. Setting `testIdAttribute: 'data-qa'` globally means `page.getByTestId('save-btn')` looks for `data-qa=\"save-btn\"` — the locator API stays clean, no engine registration needed.",
        uk: "`testIdAttribute` у конфігурації — це саме запасний вихід для команд які використовують інше ім'я атрибута для test ID. Встановлення `testIdAttribute: 'data-qa'` глобально означає що `page.getByTestId('save-btn')` шукає `data-qa=\"save-btn\"` — API локатора залишається чистим, реєстрація рушія не потрібна.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What two functions must a custom selector engine define?",
        uk: "Які дві функції повинен визначати кастомний рушій селекторів?",
      },
      options: [
        { id: "a", label: { en: "`find()` and `findAll()`", uk: "`find()` і `findAll()`" } },
        { id: "b", label: { en: "`select()` and `selectAll()`", uk: "`select()` і `selectAll()`" } },
        { id: "c", label: { en: "`query()` and `queryAll()`", uk: "`query()` і `queryAll()`" } },
        { id: "d", label: { en: "`match()` and `matchAll()`", uk: "`match()` і `matchAll()`" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "A Playwright selector engine must implement `query(root, selector)` which returns the first matching element, and `queryAll(root, selector)` which returns all matching elements. Both functions run in the browser context where DOM APIs like `querySelector` and `querySelectorAll` are available.",
        uk: "Рушій селекторів Playwright повинен реалізувати `query(root, selector)` що повертає перший відповідний елемент, і `queryAll(root, selector)` що повертає всі відповідні елементи. Обидві функції виконуються в контексті браузера де доступні DOM API типу `querySelector` і `querySelectorAll`.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Where must you register a custom selector engine in a Playwright Test setup, and why?",
        uk: "Де потрібно реєструвати кастомний рушій селекторів у Playwright Test і чому?",
      },
      options: [
        { id: "a", label: { en: "In a `beforeEach` hook in each test file — to ensure registration before every test.", uk: "В хуку `beforeEach` у кожному файлі тесту — щоб гарантувати реєстрацію до кожного тесту." } },
        { id: "b", label: { en: "In a worker-scoped auto-fixture — registration happens once per worker and registering the same name twice throws an error.", uk: "У worker-scoped auto-fixture — реєстрація відбувається один раз на воркер, а повторна реєстрація того самого імені кидає помилку." } },
        { id: "c", label: { en: "In `globalSetup` — it runs once before all tests.", uk: "У `globalSetup` — виконується один раз до всіх тестів." } },
        { id: "d", label: { en: "In `playwright.config.ts` — the config accepts a `selectorEngines` array.", uk: "У `playwright.config.ts` — конфіг приймає масив `selectorEngines`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Registering via `playwright.selectors.register()` must happen before creating pages. A worker-scoped auto-fixture with `{ scope: 'worker', auto: true }` ensures the engine is registered once per Playwright worker process. If you register in `beforeEach`, the same name is registered multiple times — Playwright throws an error on the second registration.",
        uk: "Реєстрація через `playwright.selectors.register()` повинна відбуватися до створення сторінок. Worker-scoped auto-fixture з `{ scope: 'worker', auto: true }` гарантує що рушій реєструється один раз на воркер-процес Playwright. Якщо реєструвати в `beforeEach` — те саме ім'я реєструється кілька разів, Playwright кидає помилку при повторній реєстрації.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What is the benefit of registering a custom engine with `{ contentScript: true }`?",
        uk: "Яка перевага реєстрації кастомного рушія з `{ contentScript: true }`?",
      },
      options: [
        { id: "a", label: { en: "The engine can access browser extension APIs.", uk: "Рушій може мати доступ до API браузерного розширення." } },
        { id: "b", label: { en: "The engine runs in an isolated context protected from the page's JavaScript, preventing the app from interfering with the engine.", uk: "Рушій виконується в ізольованому контексті захищеному від JavaScript сторінки, запобігаючи втручанню застосунку в рушій." } },
        { id: "c", label: { en: "The engine runs faster because it bypasses the DevTools Protocol.", uk: "Рушій виконується швидше бо обходить DevTools Protocol." } },
        { id: "d", label: { en: "The engine is automatically applied to all frames in the page.", uk: "Рушій автоматично застосовується до всіх фреймів сторінки." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By default a custom engine runs in the same JavaScript context as the app. A rogue page (or even an accidental bug) could override `Node.prototype` methods that your engine depends on, causing subtle failures. `{ contentScript: true }` runs the engine in an isolated world — the same isolation that all built-in Playwright selector engines use.",
        uk: "За замовчуванням кастомний рушій виконується в тому ж JavaScript-контексті що й застосунок. Шкідлива сторінка (або навіть випадковий баг) може перевизначити методи `Node.prototype` від яких залежить твій рушій, спричиняючи непомітні збої. `{ contentScript: true }` запускає рушій в ізольованому середовищі — те саме ізолювання що використовують усі вбудовані рушії селекторів Playwright.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "After registering a custom engine named `'component'`, how do you use it in a locator?",
        uk: "Після реєстрації кастомного рушія з іменем `'component'`, як використовувати його в локаторі?",
      },
      options: [
        { id: "a", label: { en: "`page.getByComponent('OrderForm')`", uk: "`page.getByComponent('OrderForm')`" } },
        { id: "b", label: { en: "`page.locator('component=OrderForm')`", uk: "`page.locator('component=OrderForm')`" } },
        { id: "c", label: { en: "`page.selector('component', 'OrderForm')`", uk: "`page.selector('component', 'OrderForm')`" } },
        { id: "d", label: { en: "`page.engine('component').find('OrderForm')`", uk: "`page.engine('component').find('OrderForm')`" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Custom engines are used with the `engineName=selectorBody` syntax in `page.locator()`. So a registered `'component'` engine is invoked via `page.locator('component=OrderForm')`. The engine's `query()` function receives `'OrderForm'` as the selector string.",
        uk: "Кастомні рушії використовуються з синтаксисом `engineName=selectorBody` в `page.locator()`. Тому зареєстрований рушій `'component'` викликається через `page.locator('component=OrderForm')`. Функція `query()` рушія отримує `'OrderForm'` як рядок селектора.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "When is building a custom selector engine actually warranted?",
        uk: "Коли насправді виправдано створювати кастомний рушій селекторів?",
      },
      options: [
        { id: "a", label: { en: "Whenever you want faster element lookups than the built-in locators.", uk: "Щоразу коли хочеш швидшого пошуку елементів ніж вбудовані локатори." } },
        { id: "b", label: { en: "When an internal component library uses a non-standard attribute scheme that none of the built-in locators can address — and `testIdAttribute` alone is not enough.", uk: "Коли внутрішня бібліотека компонентів використовує нестандартну схему атрибутів яку жоден вбудований локатор не може адресувати — і `testIdAttribute` самого по собі недостатньо." } },
        { id: "c", label: { en: "Any time you use a CSS framework that generates unpredictable class names.", uk: "Щоразу коли використовуєш CSS-фреймворк що генерує непередбачувані класи." } },
        { id: "d", label: { en: "For all projects — custom engines are the Playwright best practice for enterprise testing.", uk: "Для всіх проєктів — кастомні рушії є best practice Playwright для enterprise-тестування." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The answer is almost never. `getByRole`, `getByLabel`, `getByText`, `getByTestId` (with `testIdAttribute` in config) cover virtually everything. The one real use case is an internal design system where all components have a custom attribute (like `data-component`) and you want a concise selection strategy across the entire test suite.",
        uk: "Відповідь — майже ніколи. `getByRole`, `getByLabel`, `getByText`, `getByTestId` (з `testIdAttribute` в конфізі) покривають практично все. Єдиний реальний кейс — внутрішня дизайн-система де всі компоненти мають кастомний атрибут (типу `data-component`) і ти хочеш лаконічну стратегію вибору для всього тест-сьюту.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Can you chain a custom selector engine locator with built-in locators?",
        uk: "Чи можна поєднувати локатор кастомного рушія з вбудованими локаторами?",
      },
      options: [
        { id: "a", label: { en: "No — custom engine locators can only be used as standalone selectors.", uk: "Ні — локатори кастомного рушія можна використовувати лише як самостійні селектори." } },
        { id: "b", label: { en: "Yes — `page.locator('component=OrderForm').getByLabel('Customer')` finds a label within the component.", uk: "Так — `page.locator('component=OrderForm').getByLabel('Customer')` знаходить підпис всередині компонента." } },
        { id: "c", label: { en: "Yes, but only with CSS selectors — not with semantic locators like `getByRole`.", uk: "Так, але лише з CSS-селекторами — не з семантичними локаторами типу `getByRole`." } },
        { id: "d", label: { en: "Only if the custom engine also implements `queryAllChildren()`.", uk: "Лише якщо кастомний рушій також реалізує `queryAllChildren()`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright locators are composable. `page.locator('component=OrderForm')` narrows the scope to the component element, then `.getByLabel('Customer')` finds the label input within that scope. You can chain `.locator('component=SaveButton')` too — mixing custom engines with built-in locators freely.",
        uk: "Локатори Playwright компонуються. `page.locator('component=OrderForm')` звужує область до елемента компонента, потім `.getByLabel('Customer')` знаходить підпис-інпут в цій області. Можна також ланцюгувати `.locator('component=SaveButton')` — вільно поєднуючи кастомні рушії з вбудованими локаторами.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Where in the code does the custom selector engine's `query()` function actually execute?",
        uk: "Де в коді фактично виконується функція `query()` кастомного рушія селекторів?",
      },
      options: [
        { id: "a", label: { en: "In the Node.js test process — it receives element data via the DevTools Protocol.", uk: "В процесі Node.js тесту — отримує дані елементів через DevTools Protocol." } },
        { id: "b", label: { en: "In the browser process — both `query()` and `queryAll()` run as browser-side JavaScript with full DOM access.", uk: "В процесі браузера — обидві `query()` і `queryAll()` виконуються як JavaScript на стороні браузера з повним доступом до DOM." } },
        { id: "c", label: { en: "In a shared worker thread between Node.js and the browser.", uk: "В спільному worker-потоці між Node.js і браузером." } },
        { id: "d", label: { en: "In the Playwright service that runs alongside the test.", uk: "У Playwright-сервісі що виконується поряд з тестом." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Selector engines are serialized and injected into the browser. When Playwright needs to find an element using a custom engine, it calls `query()` or `queryAll()` inside the browser's JavaScript context — which is why these functions have access to `document`, `root.querySelector()`, and any other browser DOM APIs.",
        uk: "Рушії селекторів серіалізуються і впроваджуються в браузер. Коли Playwright потребує знайти елемент за кастомним рушієм — він викликає `query()` або `queryAll()` всередині JavaScript-контексту браузера — саме тому ці функції мають доступ до `document`, `root.querySelector()` та будь-яких інших браузерних DOM API.",
      },
    },
  ],
}
