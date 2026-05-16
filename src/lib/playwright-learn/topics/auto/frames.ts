import type { PlaywrightTopic } from "../../types"

export const framesTopic: PlaywrightTopic = {
  slug: "frames",
  groupId: "guides",
  order: 205,
  level: "intermediate",
  trackOrder: 19,
  sourceDoc: "frames.md",
  officialDocsUrl: "https://playwright.dev/docs/frames",
  title: {
    en: "Frames",
    uk: "Фрейми",
  },
  summary: {
    en: "When a page embeds an iframe — a payment widget, a chat, a map — Playwright can't interact with elements inside it directly through page locators. I use page.frameLocator() to get a locator scoped to the iframe's DOM, then use standard locators inside it. The most common real-world case: testing a Stripe or PayPal embedded payment form.",
    uk: "Коли сторінка вбудовує iframe — платіжний віджет, чат, карту — Playwright не може напряму взаємодіяти з елементами всередині через page-локатори. Використовую page.frameLocator() щоб отримати локатор прив'язаний до DOM iframe, потім стандартні локатори всередині. Найпоширеніший реальний кейс: тестування вбудованої платіжної форми Stripe або PayPal.",
  },
  sections: [
    {
      id: "why-frames-need-special-handling",
      title: {
        en: "Why iframes need special handling",
        uk: "Чому iframes потребують спеціальної обробки",
      },
      diagram: {
        mermaid: `flowchart TD
  PG["Page (main document)\nexample.com"] --> MD["Main DOM"]
  PG --> IF["&lt;iframe&gt;\nstripe.com/embed"]
  MD -->|"page.getByRole() ✓"| ME["main elements"]
  IF --> FD["Frame DOM\n(own JS context, own origin)"]
  FD -->|"page.frameLocator() required ✓"| FE["frame elements\n(card number, CVC...)"]`,
        caption: {
          en: "An iframe is a separate document — page locators stop at the boundary, frameLocator() crosses it",
          uk: "iframe — окремий документ: page-локатори зупиняються на межі, frameLocator() перетинає її",
        },
      },
      paragraphs: [
        {
          en: "An iframe is a separate HTML document embedded inside the main page. It has its own DOM, its own JavaScript context, and its own origin (often a different domain). `page.getByRole()` and other locators only search the main frame's DOM — they don't cross iframe boundaries.",
          uk: "iframe — це окремий HTML-документ вбудований в основну сторінку. Він має власний DOM, власний JavaScript-контекст і власний origin (часто інший домен). `page.getByRole()` та інші локатори шукають лише в DOM основного фрейму — вони не перетинають межі iframe.",
        },
        {
          en: "The solution: `page.frameLocator(selector)` returns a `FrameLocator` — a locator object that's scoped to the iframe's content. I chain standard locators on it just like on `page`.",
          uk: "Рішення: `page.frameLocator(selector)` повертає `FrameLocator` — об'єкт локатора прив'язаний до вмісту iframe. Ланцюгую стандартні локатори до нього так само як до `page`.",
        },
      ],
    },
    {
      id: "framelocator",
      title: {
        en: "frameLocator — the preferred approach",
        uk: "frameLocator — preferred підхід",
      },
      paragraphs: [
        {
          en: "`frameLocator` returns a locator that scopes all subsequent locator calls to the iframe's DOM. I target the iframe by its CSS selector (usually a class, id, or title attribute), then use normal locators inside.",
          uk: "`frameLocator` повертає локатор що прив'язує всі наступні виклики локаторів до DOM iframe. Цілюся в iframe через його CSS-селектор (зазвичай клас, id або атрибут title), потім використовую звичайні локатори всередині.",
        },
        {
          en: "The most common real-world scenario — embedded payment form where the card fields are inside a Stripe iframe:",
          uk: "Найпоширеніший реальний сценарій — вбудована платіжна форма де поля картки знаходяться всередині Stripe iframe:",
        },
      ],
      codeBlocks: [
        {
          id: "framelocator-example",
          language: "ts",
          code: `// Базове використання frameLocator
const frame = page.frameLocator('.frame-class')
await frame.getByLabel('User Name').fill('John')

// Реальний кейс: Stripe payment form
const stripeFrame = page.frameLocator('iframe[title="Stripe payment form"]')
await stripeFrame.getByLabel('Card number').fill('4242 4242 4242 4242')
await stripeFrame.getByLabel('Expiry').fill('12/26')
await stripeFrame.getByLabel('CVC').fill('123')

// Або через індекс якщо немає інших атрибутів
const firstFrame = page.frameLocator('iframe').first()`,
        },
      ],
    },
    {
      id: "frame-objects",
      title: {
        en: "Frame objects — direct access",
        uk: "Об'єкти Frame — прямий доступ",
      },
      paragraphs: [
        {
          en: "`page.frame()` gives access to the raw `Frame` object, which is useful when I need to run JavaScript inside the frame, evaluate expressions, or access frame metadata like the URL. I target frames by name attribute or URL pattern.",
          uk: "`page.frame()` дає доступ до сирого об'єкта `Frame`, корисного коли потрібно виконати JavaScript всередині фрейму, обчислити вирази або отримати метадані фрейму як URL. Цілюся у фрейми за атрибутом name або патерном URL.",
        },
      ],
      codeBlocks: [
        {
          id: "frame-objects",
          language: "ts",
          code: `// Отримати фрейм за атрибутом name
const frame = page.frame('frame-login')
if (frame) {
  await frame.fill('#username-input', 'John')
}

// Отримати фрейм за URL (regex)
const paymentFrame = page.frame({ url: /stripe\.com/ })

// Виконати JavaScript всередині фрейму
const iframeTitle = await frame?.evaluate(() => document.title)

// Список всіх фреймів на сторінці
const allFrames = page.frames()
console.log(allFrames.map(f => f.url()))`,
        },
      ],
    },
    {
      id: "nested-frames",
      title: {
        en: "Nested iframes",
        uk: "Вкладені iframes",
      },
      paragraphs: [
        {
          en: "When a frame contains another iframe, I chain `frameLocator` calls. Each level scopes the search to the next iframe:",
          uk: "Коли фрейм містить інший iframe — ланцюгую виклики `frameLocator`. Кожен рівень прив'язує пошук до наступного iframe:",
        },
      ],
      codeBlocks: [
        {
          id: "nested-frames",
          language: "ts",
          code: `// Вкладені iframes: зовнішній → внутрішній → елемент
const button = page
  .frameLocator('#outer-frame')
  .frameLocator('#inner-frame')
  .getByRole('button', { name: 'Submit' })

await button.click()`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your checkout page embeds a payment form inside an iframe from a payment provider. You try page.getByLabel('Card number').fill('4242...') but Playwright throws 'No element found'. Why, and how do you fix it?",
        uk: "Сторінка оформлення замовлення вбудовує платіжну форму в iframe від платіжного провайдера. Ти пробуєш page.getByLabel('Card number').fill('4242...') але Playwright кидає 'No element found'. Чому і як виправити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The label text is wrong — check the actual label in DevTools",
            uk: "Текст мітки неправильний — перевір реальну мітку в DevTools",
          },
        },
        {
          id: "b",
          label: {
            en: "page locators only search the main frame's DOM — the input is inside an iframe. Fix: use page.frameLocator('iframe[title=...]').getByLabel('Card number').fill('4242...')",
            uk: "page-локатори шукають лише в DOM основного фрейму — поле знаходиться всередині iframe. Виправлення: page.frameLocator('iframe[title=...]').getByLabel('Card number').fill('4242...')",
          },
        },
        {
          id: "c",
          label: {
            en: "Payment iframes block automation — you need to use the API to test payment flows",
            uk: "Платіжні iframes блокують автоматизацію — потрібно використовувати API для тестування платіжних флоу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.getByLabel()`, `page.getByRole()`, and all other `page.*` locators only search the main document — they don't cross iframe boundaries. Elements inside an iframe live in a separate DOM. `page.frameLocator(selector)` returns a `FrameLocator` object that scopes all subsequent locator calls to that iframe's DOM. Once I have a `frameLocator`, I use standard locators on it just like on `page`. For Stripe specifically, the iframe is typically identified by title attribute.",
        uk: "`page.getByLabel()`, `page.getByRole()` та всі інші `page.*` локатори шукають лише в основному документі — вони не перетинають межі iframe. Елементи всередині iframe знаходяться в окремому DOM. `page.frameLocator(selector)` повертає об'єкт `FrameLocator` що прив'язує всі наступні виклики локаторів до DOM того iframe. Маючи `frameLocator` — використовую стандартні локатори до нього так само як до `page`. Для Stripe зокрема iframe зазвичай ідентифікується через атрибут title.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "How do you get a Frame object by its name attribute using the Playwright API?",
        uk: "Як отримати об'єкт Frame за атрибутом name через Playwright API?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.frameLocator('[name=\"frame-login\"]')",
            uk: "page.frameLocator('[name=\"frame-login\"]')",
          },
        },
        {
          id: "b",
          label: {
            en: "page.frame('frame-login') — passing the name string directly",
            uk: "page.frame('frame-login') — передаючи рядок name напряму",
          },
        },
        {
          id: "c",
          label: {
            en: "page.querySelector('iframe[name=\"frame-login\"]').contentDocument",
            uk: "page.querySelector('iframe[name=\"frame-login\"]').contentDocument",
          },
        },
        {
          id: "d",
          label: {
            en: "page.frames().find(f => f.name === 'frame-login')",
            uk: "page.frames().find(f => f.name === 'frame-login')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.frame('frame-login')` returns the `Frame` object whose `name` attribute matches the string. You can also use `page.frame({ url: /pattern/ })` to find a frame by its URL. This gives you the raw `Frame` object which is useful for running JavaScript (`frame.evaluate()`) or accessing frame metadata. For element interaction, `page.frameLocator()` is preferred because it returns a locator-based API.",
        uk: "`page.frame('frame-login')` повертає об'єкт `Frame` чий атрибут `name` відповідає рядку. Також можна використовувати `page.frame({ url: /pattern/ })` для пошуку фрейму за URL. Це дає сирий об'єкт `Frame` що корисно для виконання JavaScript (`frame.evaluate()`) або отримання метаданих фрейму. Для взаємодії з елементами `page.frameLocator()` є preferred бо повертає API на основі локаторів.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the key difference between page.frameLocator() and page.frame()?",
        uk: "В чому ключова різниця між page.frameLocator() і page.frame()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "frameLocator() is faster; frame() is more accurate",
            uk: "frameLocator() швидший; frame() точніший",
          },
        },
        {
          id: "b",
          label: {
            en: "frameLocator() returns a FrameLocator for element interaction using locators; frame() returns the raw Frame object for JavaScript evaluation and metadata access",
            uk: "frameLocator() повертає FrameLocator для взаємодії з елементами через локатори; frame() повертає сирий об'єкт Frame для виконання JavaScript і доступу до метаданих",
          },
        },
        {
          id: "c",
          label: {
            en: "frameLocator() works for nested iframes; frame() only works for top-level iframes",
            uk: "frameLocator() працює для вкладених iframes; frame() працює лише для iframes верхнього рівня",
          },
        },
        {
          id: "d",
          label: {
            en: "They are identical — frameLocator is deprecated in favor of frame",
            uk: "Вони однакові — frameLocator застарілий на користь frame",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.frameLocator()` returns a `FrameLocator` that you use like a `page` — chaining `.getByRole()`, `.getByLabel()`, and other locator methods scoped to the iframe's DOM. `page.frame()` returns the raw `Frame` object which exposes lower-level APIs like `.evaluate()`, `.url()`, `.title()`, and `.childFrames()`. For most testing tasks, `frameLocator()` is preferred because it gives you all the modern locator capabilities.",
        uk: "`page.frameLocator()` повертає `FrameLocator` що використовується як `page` — ланцюгування `.getByRole()`, `.getByLabel()` та інших методів локаторів прив'язаних до DOM iframe. `page.frame()` повертає сирий об'єкт `Frame` що надає API нижчого рівня як `.evaluate()`, `.url()`, `.title()` і `.childFrames()`. Для більшості тестових задач `frameLocator()` є preferred бо надає всі можливості сучасних локаторів.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you interact with an element inside a nested iframe (an iframe inside an iframe)?",
        uk: "Як взаємодіяти з елементом всередині вкладеного iframe (iframe всередині iframe)?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.frame('#outer-frame').frame('#inner-frame').getByRole('button')",
            uk: "page.frame('#outer-frame').frame('#inner-frame').getByRole('button')",
          },
        },
        {
          id: "b",
          label: {
            en: "page.frameLocator('#outer-frame').frameLocator('#inner-frame').getByRole('button')",
            uk: "page.frameLocator('#outer-frame').frameLocator('#inner-frame').getByRole('button')",
          },
        },
        {
          id: "c",
          label: {
            en: "page.getByRole('button') — Playwright automatically searches all nested iframes",
            uk: "page.getByRole('button') — Playwright автоматично шукає у всіх вкладених iframes",
          },
        },
        {
          id: "d",
          label: {
            en: "Nested iframes are not supported — you must flatten them first",
            uk: "Вкладені iframes не підтримуються — потрібно спочатку їх розгорнути",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "You chain `frameLocator()` calls to drill into nested iframes. Each `.frameLocator()` call scopes the search to the next level's DOM. The pattern is: `page.frameLocator('#outer').frameLocator('#inner').getByRole('button')`. This works for any depth of nesting — just keep chaining.",
        uk: "Ланцюгуй виклики `frameLocator()` для занурення у вкладені iframes. Кожен виклик `.frameLocator()` прив'язує пошук до DOM наступного рівня. Патерн: `page.frameLocator('#outer').frameLocator('#inner').getByRole('button')`. Це працює для будь-якої глибини вкладення — просто продовжуй ланцюгування.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You need to get the URL of a frame to verify it loaded the correct page. Which API do you use?",
        uk: "Потрібно отримати URL фрейму щоб перевірити що він завантажив правильну сторінку. Який API використовуєш?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.frameLocator('iframe').url()",
            uk: "page.frameLocator('iframe').url()",
          },
        },
        {
          id: "b",
          label: {
            en: "page.frame({ url: /pattern/ }) to find it, then frame.url() on the Frame object",
            uk: "page.frame({ url: /pattern/ }) щоб знайти його, потім frame.url() на об'єкті Frame",
          },
        },
        {
          id: "c",
          label: {
            en: "page.evaluate(() => document.querySelector('iframe').src)",
            uk: "page.evaluate(() => document.querySelector('iframe').src)",
          },
        },
        {
          id: "d",
          label: {
            en: "page.getAttribute('iframe', 'src') — src always equals the current URL",
            uk: "page.getAttribute('iframe', 'src') — src завжди дорівнює поточному URL",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`FrameLocator` (returned by `page.frameLocator()`) is only for locating elements — it doesn't expose a `.url()` method. To get frame metadata like URL, you need the raw `Frame` object from `page.frame()`. Call `frame.url()` to get the current URL of the frame's document. Note that `iframe.src` reflects the original attribute, while `frame.url()` reflects the actual current URL after any redirects.",
        uk: "`FrameLocator` (який повертає `page.frameLocator()`) лише для пошуку елементів — він не має методу `.url()`. Для отримання метаданих фрейму як URL потрібен сирий об'єкт `Frame` з `page.frame()`. Виклич `frame.url()` щоб отримати поточний URL документа фрейму. Зауважу що `iframe.src` відображає оригінальний атрибут, а `frame.url()` — фактичний поточний URL після будь-яких редиректів.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you wait for a specific iframe to finish loading before interacting with its contents?",
        uk: "Як дочекатися завершення завантаження конкретного iframe перед взаємодією з його вмістом?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.waitForTimeout(2000) before accessing the frame",
            uk: "await page.waitForTimeout(2000) перед доступом до фрейму",
          },
        },
        {
          id: "b",
          label: {
            en: "Use frameLocator().getByRole() — Playwright auto-waits for the element to appear inside the frame",
            uk: "Використовувати frameLocator().getByRole() — Playwright автоматично очікує появи елемента всередині фрейму",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.frame('myFrame').waitForLoadState('networkidle')",
            uk: "await page.frame('myFrame').waitForLoadState('networkidle')",
          },
        },
        {
          id: "d",
          label: {
            en: "Both b and c are correct approaches",
            uk: "І b, і c є правильними підходами",
          },
        },
      ],
      correctOptionId: "d",
      rationale: {
        en: "Both approaches work. When using `frameLocator()` and chaining a locator, Playwright's auto-wait kicks in — it retries until the element appears inside the frame, handling the load naturally. Alternatively, `page.frame('name').waitForLoadState('networkidle')` explicitly waits for the frame's network to go idle. For most cases, relying on locator auto-wait is simpler. Use `waitForLoadState` when you need explicit control over the load state.",
        uk: "Обидва підходи працюють. При використанні `frameLocator()` і ланцюгування локатора — автоочікування Playwright вмикається: він повторює спроби поки елемент не з'явиться всередині фрейму, природно обробляючи завантаження. Альтернативно, `page.frame('name').waitForLoadState('networkidle')` явно чекає поки мережа фрейму стане idle. Для більшості випадків покладатися на автоочікування локатора простіше. Використовуй `waitForLoadState` коли потрібен явний контроль над станом завантаження.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What does page.frames() return?",
        uk: "Що повертає page.frames()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "An array of FrameLocator objects for all iframes on the page",
            uk: "Масив об'єктів FrameLocator для всіх iframes на сторінці",
          },
        },
        {
          id: "b",
          label: {
            en: "An array of all Frame objects currently attached to the page, including the main frame",
            uk: "Масив всіх об'єктів Frame поточно прикріплених до сторінки, включаючи головний фрейм",
          },
        },
        {
          id: "c",
          label: {
            en: "Only the child iframes — the main frame is excluded",
            uk: "Лише дочірні iframes — головний фрейм виключений",
          },
        },
        {
          id: "d",
          label: {
            en: "An array of iframe DOM elements (HTMLIFrameElement)",
            uk: "Масив DOM-елементів iframe (HTMLIFrameElement)",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.frames()` returns an array of all `Frame` objects attached to the page — the main frame is always at index 0, followed by any child iframes. You can iterate over them to inspect their URLs, names, or content. This is useful for debugging when you don't know exactly how many frames exist or what their names are.",
        uk: "`page.frames()` повертає масив всіх об'єктів `Frame` прикріплених до сторінки — головний фрейм завжди знаходиться за індексом 0, далі дочірні iframes. Можна ітерувати по ним щоб перевіряти їх URL, назви або вміст. Корисно для дебагу коли не знаєш точно скільки фреймів існує або які їх назви.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want to run JavaScript inside a specific iframe to read a value from its window object. Which approach is correct?",
        uk: "Хочеш виконати JavaScript всередині конкретного iframe щоб прочитати значення з його об'єкту window. Який підхід правильний?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.evaluate(() => window.iframeValue) — evaluate runs in all frames",
            uk: "page.evaluate(() => window.iframeValue) — evaluate виконується у всіх фреймах",
          },
        },
        {
          id: "b",
          label: {
            en: "const frame = page.frame('myFrame'); const value = await frame.evaluate(() => window.iframeValue)",
            uk: "const frame = page.frame('myFrame'); const value = await frame.evaluate(() => window.iframeValue)",
          },
        },
        {
          id: "c",
          label: {
            en: "page.frameLocator('iframe').evaluate(() => window.iframeValue)",
            uk: "page.frameLocator('iframe').evaluate(() => window.iframeValue)",
          },
        },
        {
          id: "d",
          label: {
            en: "You cannot run JavaScript inside iframes from Playwright tests",
            uk: "Неможливо виконувати JavaScript всередині iframes з тестів Playwright",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.evaluate()` runs in the main frame's JavaScript context — it cannot access another frame's `window`. To run code inside a specific frame, get the `Frame` object with `page.frame()` and call `.evaluate()` on it. The function you pass runs inside that frame's JavaScript context and has access to that frame's `window`, `document`, and other globals. `FrameLocator` does not expose `.evaluate()`.",
        uk: "`page.evaluate()` виконується в JavaScript-контексті головного фрейму — він не може отримати доступ до `window` іншого фрейму. Щоб виконати код всередині конкретного фрейму — отримай об'єкт `Frame` через `page.frame()` і виклич `.evaluate()` на ньому. Функція що ти передаєш виконується всередині JavaScript-контексту того фрейму і має доступ до його `window`, `document` та інших глобалів. `FrameLocator` не надає `.evaluate()`.",
      },
    },
  ],
}
