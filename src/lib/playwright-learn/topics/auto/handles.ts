import type { PlaywrightTopic } from "../../types"

export const handlesTopic: PlaywrightTopic = {
  slug: "handles",
  groupId: "guides",
  order: 225,
  level: "intermediate",
  trackOrder: 23,
  sourceDoc: "handles.md",
  officialDocsUrl: "https://playwright.dev/docs/handles",
  title: {
    en: "Handles",
    uk: "Дескриптори (handles)",
  },
  summary: {
    en: "Handles are references to JavaScript objects (JSHandle) or DOM elements (ElementHandle) that live in the browser. I almost never use ElementHandle directly anymore — Locators replaced them and are much better. The one case I still reach for JSHandle: when I need to hold a reference to a browser-side object across multiple evaluate() calls without serializing it each time.",
    uk: "Handles — це посилання на JavaScript-об'єкти (JSHandle) або DOM-елементи (ElementHandle) що живуть у браузері. ElementHandle напряму майже ніколи більше не використовую — Locators замінили їх і значно кращі. Єдиний кейс де все ще беруся за JSHandle: коли потрібно утримувати посилання на об'єкт на стороні браузера між кількома викликами evaluate() без серіалізації кожного разу.",
  },
  sections: [
    {
      id: "locator-vs-elementhandle",
      title: {
        en: "Locator vs ElementHandle — why Locator wins",
        uk: "Locator проти ElementHandle — чому Locator кращий",
      },
      diagram: {
        mermaid: `sequenceDiagram
  participant T as Test
  participant PW as Playwright
  participant DOM as Browser DOM
  Note over T,DOM: ElementHandle (risky)
  T->>PW: page.$('text=Submit') → handle
  PW->>DOM: capture DOM node reference
  Note over DOM: React re-renders, node replaced
  T->>PW: handle.click()
  PW->>DOM: operate on stale detached node ⚠
  Note over T,DOM: Locator (safe)
  T->>PW: page.getByText('Submit') → locator
  Note over PW: stores query logic only
  T->>PW: locator.click()
  PW->>DOM: fresh query → find current node ✓`,
        caption: {
          en: "ElementHandle holds a stale reference after re-render; Locator re-queries the DOM on every use",
          uk: "ElementHandle зберігає застаріле посилання після перерендеру; Locator заново робить запит до DOM при кожному використанні",
        },
      },
      paragraphs: [
        {
          en: "An `ElementHandle` points to a **specific DOM node** captured at a moment in time. If React re-renders and replaces that node with a new one, the handle is stale — it still points to the old detached node. This causes subtle bugs where actions succeed but operate on a ghost element.",
          uk: "`ElementHandle` вказує на **конкретний DOM-вузол** зафіксований в момент часу. Якщо React перерендерить і замінить цей вузол новим — handle застарів: він досі вказує на старий від'єднаний вузол. Це спричиняє непомітні баги коли дії виконуються але над примарним елементом.",
        },
        {
          en: "A `Locator` stores the **query logic**, not the element. Every time I call `.click()`, `.fill()`, or any assertion, Playwright re-queries the DOM fresh. This means locators work correctly even after React re-renders, navigation within a SPA, or any DOM mutation.",
          uk: "`Locator` зберігає **логіку запиту**, а не елемент. Щоразу коли викликаю `.click()`, `.fill()` або будь-який assertion — Playwright заново робить запит до DOM. Це означає що локатори коректно працюють навіть після перерендеру React, навігації в межах SPA або будь-якої мутації DOM.",
        },
      ],
      codeBlocks: [
        {
          id: "locator-vs-handle",
          language: "ts",
          code: `// ElementHandle — вказує на конкретний вузол DOM (застаріє при перерендері)
const handle = await page.$('text=Submit')
// ... React може перерендерити між цим і наступним рядком ...
await handle.hover()   // може оперувати над старим вузлом!
await handle.click()

// Locator — заново робить запит при кожному використанні (безпечно)
const locator = page.getByText('Submit')
// ... перерендер не проблема ...
await locator.hover()  // знаходить поточний елемент
await locator.click()  // знаходить його знову`,
        },
      ],
    },
    {
      id: "jshandle",
      title: {
        en: "JSHandle — when I actually use it",
        uk: "JSHandle — коли я насправді його використовую",
      },
      paragraphs: [
        {
          en: "A `JSHandle` is a reference to any JavaScript object in the browser — including non-DOM objects like `window`, arrays, or complex objects from the page's JavaScript environment. The object stays alive in the browser; the handle is just a pointer from Node.js.",
          uk: "`JSHandle` — посилання на будь-який JavaScript-об'єкт у браузері — включаючи не-DOM об'єкти як `window`, масиви або складні об'єкти з JavaScript-середовища сторінки. Об'єкт залишається живим у браузері; handle — це лише вказівник з Node.js.",
        },
        {
          en: "The use case where JSHandle saves multiple round-trips: when I create a large JavaScript object in the browser and want to call multiple operations on it without serializing and deserializing the whole thing over the protocol each time.",
          uk: "Кейс де JSHandle економить кілька round-trips: коли створюю великий JavaScript-об'єкт у браузері і хочу викликати кілька операцій над ним без серіалізації і десеріалізації всього через протокол кожного разу.",
        },
      ],
      codeBlocks: [
        {
          id: "jshandle-example",
          language: "ts",
          code: `// Отримати посилання на window (не серіалізується)
const windowHandle = await page.evaluateHandle('window')

// Передати handle в evaluate — не потрібно його серіалізувати
const userAgent = await page.evaluate(win => win.navigator.userAgent, windowHandle)

// Використовувати JSHandle для роботи з масивом в браузері
const arrayHandle = await page.evaluateHandle(() => {
  window.myArray = [1, 2, 3]
  return window.myArray
})

// Кілька операцій над тим самим об'єктом браузера без повторної серіалізації
const length = await page.evaluate(arr => arr.length, arrayHandle)
await page.evaluate(arr => arr.push(4), arrayHandle)
const newLength = await page.evaluate(arr => arr.length, arrayHandle)

// Завжди звільняти handle коли більше не потрібен
await arrayHandle.dispose()`,
        },
      ],
    },
    {
      id: "element-handles",
      title: {
        en: "ElementHandle — legacy, use Locator instead",
        uk: "ElementHandle — legacy, краще використовувати Locator",
      },
      paragraphs: [
        {
          en: "The old way to interact with elements before Locators existed. `page.$()` returns an `ElementHandle` (equivalent to `document.querySelector`). I might see this in older codebases — the migration path is to replace `page.$()` calls with `page.locator()` or `getBy*` locators.",
          uk: "Старий спосіб взаємодії з елементами до появи Locators. `page.$()` повертає `ElementHandle` (еквівалент `document.querySelector`). Можу зустріти це в старих кодових базах — шлях міграції: замінити виклики `page.$()` на `page.locator()` або `getBy*` локатори.",
        },
        {
          en: "The one remaining legitimate use: `ElementHandle.boundingBox()` to get an element's pixel coordinates for visual assertions or manual gesture simulations. Locators don't expose `boundingBox()` directly.",
          uk: "Єдиний легітимний кейс що залишився: `ElementHandle.boundingBox()` щоб отримати піксельні координати елемента для візуальних assertions або ручної симуляції жестів. Locators не надають `boundingBox()` напряму.",
        },
      ],
      codeBlocks: [
        {
          id: "element-handle-boundingbox",
          language: "ts",
          code: `// Єдиний кейс де ElementHandle може знадобитися: boundingBox()
const element = await page.waitForSelector('#chart-canvas')
const box = await element.boundingBox()
if (box) {
  // Клік у конкретній точці елемента (наприклад, координати на canvas)
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
}

// Старий стиль (не рекомендовано) — використовуй замість цього Locator:
// const el = await page.$('text=Submit')
// await el?.click()
// ↓ Новий стиль:
// await page.getByText('Submit').click()`,
        },
      ],
    },
    {
      id: "handle-lifecycle",
      title: {
        en: "Handle lifecycle — dispose when done",
        uk: "Lifecycle handle — звільняти коли більше не потрібен",
      },
      paragraphs: [
        {
          en: "Handles keep the referenced JavaScript object alive in the browser, preventing garbage collection. When I'm done with a handle, I should call `dispose()` to release it. If the page navigates, all handles become invalid automatically.",
          uk: "Handles утримують об'єкт JavaScript живим у браузері, запобігаючи збору сміття. Коли закінчив з handle — потрібно викликати `dispose()` щоб звільнити його. Якщо сторінка навігує — всі handles автоматично стають недійсними.",
        },
      ],
      codeBlocks: [
        {
          id: "dispose",
          language: "ts",
          code: `// Звільнення handle після використання
const handle = await page.evaluateHandle(() => ({ large: 'data object' }))
// ... використати handle ...
await handle.dispose()  // звільнити посилання, дозволити GC

// При навігації — всі handles автоматично недійсні
await page.goto('/other-page')
// handle тут вже недійсний`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You have code that does: const handle = await page.$('button.submit'); // React re-renders; await handle.click(). What's the risk and how do you fix it?",
        uk: "Є код: const handle = await page.$('button.submit'); // React перерендерить; await handle.click(). Який ризик і як виправити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "No risk — ElementHandle tracks DOM changes automatically",
            uk: "Немає ризику — ElementHandle автоматично відстежує зміни DOM",
          },
        },
        {
          id: "b",
          label: {
            en: "The handle points to the specific DOM node captured at page.$() time. If React replaces that node during re-render, the handle is stale and click() operates on a detached element. Fix: replace with page.locator('button.submit').click() — locators re-query on each use",
            uk: "Handle вказує на конкретний DOM-вузол зафіксований у момент page.$(). Якщо React замінює цей вузол під час перерендеру — handle застарів і click() оперує над від'єднаним елементом. Виправлення: замінити на page.locator('button.submit').click() — локатори роблять повторний запит при кожному використанні",
          },
        },
        {
          id: "c",
          label: {
            en: "The code will throw an error immediately when the element is detached",
            uk: "Код одразу кине помилку коли елемент від'єднаний",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "This is exactly why Playwright introduced Locators as the preferred API. `page.$()` returns an `ElementHandle` — a snapshot reference to a specific DOM node. When React re-renders, it often creates new DOM nodes and removes old ones. The old handle is now 'stale' — it references a detached node that's no longer in the page. `Locator` solves this by re-querying the DOM on every interaction, always finding the current element.",
        uk: "Саме тому Playwright ввів Locators як preferred API. `page.$()` повертає `ElementHandle` — snapshot-посилання на конкретний DOM-вузол. Коли React перерендерить — часто створює нові DOM-вузли і видаляє старі. Старий handle тепер 'застарів' — він посилається на від'єднаний вузол якого більше немає на сторінці. `Locator` вирішує це повторним запитом DOM при кожній взаємодії, завжди знаходячи поточний елемент.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is the key difference between a `Locator` and an `ElementHandle`?",
        uk: "У чому ключова різниця між `Locator` і `ElementHandle`?",
      },
      options: [
        { id: "a", label: { en: "`Locator` is faster because it caches the element reference.", uk: "`Locator` швидший бо кешує посилання на елемент." } },
        { id: "b", label: { en: "`Locator` stores query logic and re-queries the DOM fresh on every interaction; `ElementHandle` points to a specific DOM node that can become stale.", uk: "`Locator` зберігає логіку запиту і заново робить запит DOM при кожній взаємодії; `ElementHandle` вказує на конкретний DOM-вузол який може застаріти." } },
        { id: "c", label: { en: "`ElementHandle` supports more methods than `Locator`.", uk: "`ElementHandle` підтримує більше методів ніж `Locator`." } },
        { id: "d", label: { en: "They are equivalent — `Locator` is just a newer name for `ElementHandle`.", uk: "Вони еквівалентні — `Locator` просто новіша назва для `ElementHandle`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A `Locator` is a description of how to find an element — the query runs fresh on every `.click()`, `.fill()`, or assertion. An `ElementHandle` is a handle to a specific DOM node captured at a point in time. After React re-renders or any DOM mutation, the handle may be stale while a locator always finds the current node.",
        uk: "`Locator` — це опис того як знайти елемент — запит виконується заново при кожному `.click()`, `.fill()` або assertion. `ElementHandle` — handle до конкретного DOM-вузла зафіксованого в момент часу. Після перерендеру React або будь-якої мутації DOM handle може застаріти, тоді як локатор завжди знаходить поточний вузол.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "When is a `JSHandle` useful compared to `page.evaluate()`?",
        uk: "Коли `JSHandle` корисніший порівняно з `page.evaluate()`?",
      },
      options: [
        { id: "a", label: { en: "`JSHandle` is the only way to read browser state — `page.evaluate()` can only trigger actions.", uk: "`JSHandle` — єдиний спосіб читати стан браузера — `page.evaluate()` може лише тригерити дії." } },
        { id: "b", label: { en: "When you need to hold a reference to a non-serializable browser object (like `window` or a large array) and perform multiple operations on it without serializing it each time.", uk: "Коли потрібно утримувати посилання на несеріалізований об'єкт браузера (типу `window` або великий масив) і виконувати кілька операцій над ним без серіалізації щоразу." } },
        { id: "c", label: { en: "`JSHandle` is required for async operations in the browser.", uk: "`JSHandle` потрібен для async-операцій у браузері." } },
        { id: "d", label: { en: "`JSHandle` runs faster than `page.evaluate()` for all use cases.", uk: "`JSHandle` виконується швидше ніж `page.evaluate()` для всіх кейсів." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.evaluate()` serializes the return value to Node.js via the DevTools Protocol — large or non-JSON-serializable objects can't cross. A `JSHandle` keeps the object alive in the browser and lets you pass it back to subsequent `evaluate()` calls. This avoids repeated serialization round-trips when working with complex browser-side objects across multiple steps.",
        uk: "`page.evaluate()` серіалізує повернуте значення до Node.js через DevTools Protocol — великі або не-JSON-серіалізовані об'єкти не можуть перетнути. `JSHandle` тримає об'єкт живим у браузері і дозволяє передавати його назад у наступні виклики `evaluate()`. Це уникає повторних round-trip серіалізацій при роботі зі складними об'єктами браузера через кілька кроків.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does `evaluateHandle()` return compared to `evaluate()`?",
        uk: "Що повертає `evaluateHandle()` порівняно з `evaluate()`?",
      },
      options: [
        { id: "a", label: { en: "`evaluateHandle()` returns a serialized JSON value; `evaluate()` returns a handle.", uk: "`evaluateHandle()` повертає серіалізоване JSON-значення; `evaluate()` повертає handle." } },
        { id: "b", label: { en: "`evaluateHandle()` returns a `JSHandle` (a browser-side object reference); `evaluate()` returns a serialized JSON value.", uk: "`evaluateHandle()` повертає `JSHandle` (посилання на об'єкт браузера); `evaluate()` повертає серіалізоване JSON-значення." } },
        { id: "c", label: { en: "They are identical — both return serialized values.", uk: "Вони ідентичні — обидва повертають серіалізовані значення." } },
        { id: "d", label: { en: "`evaluateHandle()` returns an `ElementHandle`; `evaluate()` returns a `JSHandle`.", uk: "`evaluateHandle()` повертає `ElementHandle`; `evaluate()` повертає `JSHandle`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`evaluate()` transfers the result to Node.js by serializing it as JSON — works for primitives and plain objects. `evaluateHandle()` keeps the object in the browser and returns a `JSHandle` reference to it — no serialization. Use `evaluateHandle()` for objects that can't be serialized (DOM nodes, functions, `window`) or when you plan to pass the handle back to another `evaluate()` call.",
        uk: "`evaluate()` передає результат до Node.js серіалізуючи як JSON — працює для примітивів і простих об'єктів. `evaluateHandle()` тримає об'єкт у браузері і повертає `JSHandle`-посилання на нього — без серіалізації. Використовуй `evaluateHandle()` для об'єктів що не можна серіалізувати (DOM-вузли, функції, `window`) або коли плануєш передавати handle назад у інший виклик `evaluate()`.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What happens to all handles when the page navigates to a new URL?",
        uk: "Що відбувається з усіма handles коли сторінка навігує на новий URL?",
      },
      options: [
        { id: "a", label: { en: "Handles are automatically updated to point to elements on the new page.", uk: "Handles автоматично оновлюються щоб вказувати на елементи нової сторінки." } },
        { id: "b", label: { en: "All handles become invalid — the browser context creates a new JavaScript environment on navigation.", uk: "Всі handles стають недійсними — browser context створює нове JavaScript-середовище при навігації." } },
        { id: "c", label: { en: "Handles remain valid as long as the element ID is the same.", uk: "Handles залишаються дійсними поки ID елемента однаковий." } },
        { id: "d", label: { en: "Only `ElementHandle`s become invalid; `JSHandle`s survive navigation.", uk: "Лише `ElementHandle`и стають недійсними; `JSHandle`и переживають навігацію." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Navigation destroys the current JavaScript context and creates a new one for the new page. All existing handles — both `JSHandle` and `ElementHandle` — become invalid and throw when used. You must re-query or re-create handles after any navigation.",
        uk: "Навігація знищує поточний JavaScript-контекст і створює новий для нової сторінки. Всі наявні handles — і `JSHandle`, і `ElementHandle` — стають недійсними і кидають помилку при використанні. Потрібно повторно запитувати або створювати handles після будь-якої навігації.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What is the remaining legitimate use case for `ElementHandle` (over Locator)?",
        uk: "Який залишається легітимний кейс для `ElementHandle` (над Locator)?",
      },
      options: [
        { id: "a", label: { en: "Clicking elements — `ElementHandle.click()` is more reliable.", uk: "Клікання елементів — `ElementHandle.click()` надійніший." } },
        { id: "b", label: { en: "Getting pixel coordinates via `ElementHandle.boundingBox()` for manual gesture simulations on canvas or custom gesture libraries.", uk: "Отримання піксельних координат через `ElementHandle.boundingBox()` для ручної симуляції жестів на canvas або кастомних бібліотеках жестів." } },
        { id: "c", label: { en: "Form filling — `ElementHandle.fill()` triggers different browser events.", uk: "Заповнення форм — `ElementHandle.fill()` тригерить різні події браузера." } },
        { id: "d", label: { en: "There is no remaining use case — `ElementHandle` is fully deprecated.", uk: "Немає жодного кейсу що залишився — `ElementHandle` повністю deprecated." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`Locator` doesn't expose `boundingBox()` directly. If you need an element's exact pixel coordinates — for example to click at a specific point on a `<canvas>`, simulate a precise gesture, or calculate the center of an element for manual mouse operations — you can use `page.waitForSelector()` to get an `ElementHandle` and then call `.boundingBox()` to get `{x, y, width, height}`.",
        uk: "`Locator` не надає `boundingBox()` напряму. Якщо потрібні точні піксельні координати елемента — наприклад щоб клікнути у конкретній точці `<canvas>`, симулювати точний жест або обчислити центр елемента для ручних операцій з мишею — можна використати `page.waitForSelector()` щоб отримати `ElementHandle` і викликати `.boundingBox()` для отримання `{x, y, width, height}`.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Why should you call `handle.dispose()` when you're done with a JSHandle?",
        uk: "Чому потрібно викликати `handle.dispose()` після завершення роботи з JSHandle?",
      },
      options: [
        { id: "a", label: { en: "To close the browser connection.", uk: "Щоб закрити з'єднання з браузером." } },
        { id: "b", label: { en: "To release the browser-side object and allow garbage collection — handles prevent GC from collecting the referenced object.", uk: "Щоб звільнити об'єкт на стороні браузера і дозволити збирання сміття — handles запобігають GC від збирання об'єкту на який посилаються." } },
        { id: "c", label: { en: "To commit any pending changes to the DOM.", uk: "Щоб зафіксувати будь-які очікуючі зміни DOM." } },
        { id: "d", label: { en: "It's optional — Playwright automatically disposes all handles at test end.", uk: "Це необов'язково — Playwright автоматично звільняє всі handles наприкінці тесту." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A `JSHandle` keeps the referenced JavaScript object alive in the browser's heap, preventing garbage collection. Calling `dispose()` releases the reference. While Playwright does clean up handles when the page closes, for long-running tests with many intermediate handles, explicit disposal avoids memory pressure in the browser process.",
        uk: "`JSHandle` тримає об'єкт JavaScript живим у heap браузера, запобігаючи збиранню сміття. Виклик `dispose()` звільняє посилання. Хоча Playwright прибирає handles при закритті сторінки — для довгих тестів з багатьма проміжними handles явне звільнення уникає тиску на пам'ять у процесі браузера.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want to call multiple operations on a large JavaScript array stored in the browser without serializing it each time. What is the correct approach?",
        uk: "Хочеш викликати кілька операцій над великим масивом JavaScript збереженим у браузері без серіалізації щоразу. Який правильний підхід?",
      },
      options: [
        { id: "a", label: { en: "Use `page.evaluate()` to serialize the full array each time.", uk: "Використовувати `page.evaluate()` для серіалізації повного масиву щоразу." } },
        { id: "b", label: { en: "Use `page.evaluateHandle()` to get a `JSHandle` to the array, pass that handle to subsequent `page.evaluate()` calls, and `dispose()` when done.", uk: "Використовувати `page.evaluateHandle()` щоб отримати `JSHandle` на масив, передавати цей handle у наступні виклики `page.evaluate()` і викликати `dispose()` по завершенні." } },
        { id: "c", label: { en: "Store the array in `localStorage` and read it in each `evaluate()` call.", uk: "Зберігати масив у `localStorage` і читати його у кожному виклику `evaluate()`." } },
        { id: "d", label: { en: "Create a new `BrowserContext` for each operation to avoid serialization overhead.", uk: "Створювати новий `BrowserContext` для кожної операції щоб уникнути накладних витрат серіалізації." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.evaluateHandle(() => window.myArray)` returns a `JSHandle` to the array. You can then pass this handle as the argument to `page.evaluate((arr) => arr.length, arrayHandle)`, `page.evaluate((arr) => arr.push(4), arrayHandle)`, etc. The array stays in the browser's memory — no serialization on each call. Call `dispose()` when done to free the reference.",
        uk: "`page.evaluateHandle(() => window.myArray)` повертає `JSHandle` на масив. Потім можна передавати цей handle як аргумент у `page.evaluate((arr) => arr.length, arrayHandle)`, `page.evaluate((arr) => arr.push(4), arrayHandle)` тощо. Масив залишається в пам'яті браузера — жодної серіалізації при кожному виклику. Виклич `dispose()` по завершенні щоб звільнити посилання.",
      },
    },
  ],
}
