import type { PlaywrightTopic } from "../../types"

export const testComponentsTopic: PlaywrightTopic = {
  slug: "test-components",
  groupId: "test-runner",
  order: 325,
  level: "advanced",
  trackOrder: 14,
  sourceDoc: "test-components-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-components",
  title: {
    en: "Components (experimental)",
    uk: "Компоненти (експериментально)",
  },
  summary: {
    en: "Component testing mounts a React/Vue/Svelte component directly in a real browser and runs Playwright assertions against it — no JSDOM, real clicks, real layout. The key limitation: you can't pass live Node.js objects to the component, only plain data. I use it for testing complex UI components in isolation before wiring them into full e2e flows.",
    uk: "Компонентне тестування монтує React/Vue/Svelte компонент напряму у реальному браузері і запускає Playwright assertions проти нього — без JSDOM, реальні кліки, реальний лейаут. Ключове обмеження: не можна передавати 'живі' Node.js-об'єкти в компонент, лише прості дані. Використовую для тестування складних UI-компонентів в ізоляції перед їх підключенням до повних e2e флоу.",
  },
  sections: [
    {
      id: "what-it-is",
      title: {
        en: "What component testing actually is",
        uk: "Що таке компонентне тестування насправді",
      },
      paragraphs: [
        {
          en: "Standard Playwright tests open a full page in a browser. Component testing is different: I mount a single component (`<OrderForm />`) in isolation, pass it props, interact with it, and assert its output — without needing a running server or routing.",
          uk: "Стандартні тести Playwright відкривають повну сторінку в браузері. Компонентне тестування інше: монтую окремий компонент (`<OrderForm />`) в ізоляції, передаю йому props, взаємодію і перевіряю результат — без запущеного сервера або маршрутизації.",
        },
        {
          en: "The component runs in a **real browser** (not JSDOM), so CSS, layout, hover states, and scroll behavior all work correctly. The test logic runs in Node.js, and Playwright bridges the two. This is different from unit testing with Vitest which uses JSDOM.",
          uk: "Компонент виконується у **реальному браузері** (не JSDOM), тому CSS, лейаут, hover-стани і поведінка прокрутки — все працює правильно. Логіка тесту виконується в Node.js, Playwright є мостом між ними. Це відрізняється від юніт-тестування з Vitest який використовує JSDOM.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-example",
          language: "ts",
          code: `// Типовий тест компонента — монтуємо OrderForm і перевіряємо кнопку Submit
test('submit button fires event', async ({ mount }) => {
  let submitted = false

  const component = await mount(
    <OrderForm onSubmit={() => { submitted = true }} />
  )

  // Всі Playwright локатори і assertions працюють на змонтованому компоненті
  await expect(component).toContainText('Submit')
  await component.getByRole('button', { name: 'Submit' }).click()
  expect(submitted).toBeTruthy()
})`,
        },
      ],
    },
    {
      id: "setup",
      title: {
        en: "Getting started",
        uk: "Початок роботи",
      },
      paragraphs: [
        {
          en: "I install the framework-specific package (not `@playwright/test`). For React:",
          uk: "Встановлюю пакет специфічний для фреймворку (не `@playwright/test`). Для React:",
        },
        {
          en: "The install creates a few files: `playwright-ct.config.ts`, `playwright/index.html` (the HTML scaffold where components mount), and `playwright/index.ts` (where I add global styles and theme setup). Tests go in `src/` alongside component files with `.spec.tsx` extension.",
          uk: "Встановлення створює кілька файлів: `playwright-ct.config.ts`, `playwright/index.html` (HTML-скелет де монтуються компоненти) і `playwright/index.ts` (де додаю глобальні стилі і налаштування теми). Тести розміщуються в `src/` поруч з файлами компонентів з розширенням `.spec.tsx`.",
        },
        {
          en: "The index files look like this:",
          uk: "Ці файли виглядають так:",
        },
      ],
      codeBlocks: [
        {
          id: "install",
          language: "bash",
          code: `# React
npm install --save-dev @playwright/experimental-ct-react

# Vue
npm install --save-dev @playwright/experimental-ct-vue

# Svelte
npm install --save-dev @playwright/experimental-ct-svelte`,
        },
        {
          id: "index-files",
          language: "ts",
          code: `// playwright/index.ts — глобальна ініціалізація для всіх тестів компонентів
import '../src/styles/global.css'
import { theme } from '../src/theme'

// beforeMount запускається перед кожним mount()
// afterMount — після
export const parameters = {
  // передати конфігурацію
}`,
        },
        {
          id: "run-ct",
          language: "bash",
          code: `# Запустити компонентні тести
npm run test-ct

# Або напряму
npx playwright test --config=playwright-ct.config.ts`,
        },
      ],
    },
    {
      id: "node-browser-boundary",
      title: {
        en: "The Node/browser boundary — the key limitation",
        uk: "Межа Node/браузер — ключове обмеження",
      },
      paragraphs: [
        {
          en: "The most important thing to understand: the **test runs in Node.js**, the **component runs in the browser**. Serializable data (strings, numbers, plain objects, arrays) crosses the boundary fine. Non-serializable things (live objects, functions as callbacks that need to return complex data) cannot.",
          uk: "Найважливіше що треба розуміти: **тест виконується в Node.js**, **компонент виконується в браузері**. Серіалізовані дані (рядки, числа, прості об'єкти, масиви) перетинають межу нормально. Несеріалізовані речі (живі об'єкти, функції як колбеки що мають повертати складні дані) — ні.",
        },
        {
          en: "The workaround for complex props: create a test wrapper component that accepts simple props and internally converts them to the complex format the real component needs. This keeps the test boundary clean.",
          uk: "Обхідний шлях для складних props: створити тестову компонент-обгортку яка приймає прості props і всередині конвертує їх у складний формат що потрібен реальному компоненту. Це тримає межу тесту чистою.",
        },
      ],
      codeBlocks: [
        {
          id: "boundary-example",
          language: "ts",
          code: `// Не спрацює — Media це складний браузерний об'єкт
test('this will not work', async ({ mount }) => {
  const component = await mount(
    <ImagePicker onChange={(media: Media) => { /* Media - браузерний об'єкт */ }} />
  )
})

// Спрацює — обгортка передає лише рядок (ім'я файлу)
type ImagePickerForTestProps = {
  onMediaChange(fileName: string): void
}

function ImagePickerForTest({ onMediaChange }: ImagePickerForTestProps) {
  return <ImagePicker onChange={(media) => onMediaChange(media.name)} />
}

test('records selected file name', async ({ mount }) => {
  let selected = ''
  const component = await mount(
    <ImagePickerForTest onMediaChange={(name) => { selected = name }} />
  )
  await component.getByTestId('file-input').setInputFiles('logo.png')
  await expect.poll(() => selected).toBe('logo.png')
})`,
        },
      ],
    },
    {
      id: "hooks-config",
      title: {
        en: "beforeMount hooks — router, store, theme",
        uk: "Хуки beforeMount — роутер, стор, тема",
      },
      paragraphs: [
        {
          en: "For components that need a router or Pinia store, I configure them in `playwright/index.ts` using `beforeMount`. I can pass per-test configuration from the `mount()` call via `hooksConfig`.",
          uk: "Для компонентів яким потрібен роутер або Pinia-стор — налаштовую їх у `playwright/index.ts` через `beforeMount`. Можна передавати конфігурацію для кожного тесту з виклику `mount()` через `hooksConfig`.",
        },
      ],
      codeBlocks: [
        {
          id: "hooks-example",
          language: "ts",
          code: `// playwright/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'

export type HooksConfig = {
  routing?: boolean
  initialStore?: Record<string, unknown>
}

beforeMount(async ({ app, hooksConfig }) => {
  if (hooksConfig?.routing) {
    app.use(createRouter({ history: createWebHistory(), routes: [] }))
  }
  if (hooksConfig?.initialStore) {
    const pinia = createPinia()
    app.use(pinia)
    // ініціалізувати стор з тестовими даними
  }
})`,
        },
        {
          id: "use-hooks",
          language: "ts",
          code: `// Тест передає hooksConfig в mount()
test('renders with router', async ({ mount }) => {
  const component = await mount(OrdersPage, {
    hooksConfig: {
      routing: true,
      initialStore: { orders: [{ id: 1, name: 'Test order' }] }
    }
  })
  await expect(component.getByText('Test order')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "best-practices",
      title: {
        en: "Practical tips",
        uk: "Практичні поради",
      },
      paragraphs: [
        {
          en: "**Mount inside each test, not in `beforeEach`.** It makes tests self-contained and easier to debug. When `mount()` is in `beforeEach`, I have to look at two places to understand what the test is working with.",
          uk: "**Монтуй всередині кожного тесту, не в `beforeEach`.** Це робить тести самодостатніми і простішими для дебагу. Коли `mount()` у `beforeEach` — доводиться дивитися в два місця щоб зрозуміти з чим працює тест.",
        },
        {
          en: "**Module mocks (`vi.mock()`, `jest.mock()`) don't affect the component.** They run in Node.js but the component runs in the browser. To mock API calls, use `router` fixture or `context.route()` instead.",
          uk: "**Модульні моки (`vi.mock()`, `jest.mock()`) не впливають на компонент.** Вони виконуються в Node.js але компонент виконується в браузері. Щоб мокати API-виклики — використовуй фікстуру `router` або `context.route()` замість цього.",
        },
        {
          en: "**Don't access component instance or its methods.** Test from the user's perspective — clicks and visibility checks. If a test breaks when seen from the user's angle, it's a real bug.",
          uk: "**Не звертайся до інстансу компонента або його методів.** Тестуй з перспективи користувача — кліки і перевірки видимості. Якщо тест ламається з точки зору користувача — це реальний баг.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You're testing an OrderForm component. You write `vi.mock('./api/orders', () => ({ createOrder: vi.fn() }))` at the top of your component test file, expecting the mock to intercept API calls made by the component. But the component still calls the real API. Why?",
        uk: "Ти тестуєш компонент OrderForm. Пишеш `vi.mock('./api/orders', () => ({ createOrder: vi.fn() }))` на початку файлу компонентного тесту очікуючи що мок перехопить API-виклики компонента. Але компонент все одно викликає реальний API. Чому?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "vi.mock() syntax is wrong for Playwright component tests",
            uk: "Синтаксис vi.mock() неправильний для компонентних тестів Playwright",
          },
        },
        {
          id: "b",
          label: {
            en: "vi.mock() runs in Node.js (where the test runs) but the component runs in the browser — the browser's module system is separate, so the mock never reaches the component's API import",
            uk: "vi.mock() виконується в Node.js (де виконується тест) але компонент виконується в браузері — модульна система браузера окрема, тому мок ніколи не досягає API-імпорту компонента",
          },
        },
        {
          id: "c",
          label: {
            en: "You need to import the mock before the component import",
            uk: "Потрібно імпортувати мок перед імпортом компонента",
          },
        },
        {
          id: "d",
          label: {
            en: "Component tests don't support mocking at all",
            uk: "Компонентні тести взагалі не підтримують мокування",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "This is the key architectural fact of component testing: the test process (Node.js) and the component (browser) are different environments. Module mocks created with `vi.mock()` or `jest.mock()` only affect imports in the Node.js process. The browser runs its own bundled copy of the component with its own module resolution — the mock is invisible there. To intercept browser-side network requests, use `router.route()` from the router fixture, or `context.route()` in a `beforeMount` hook to mock API endpoints at the HTTP level.",
        uk: "Це ключовий архітектурний факт компонентного тестування: процес тесту (Node.js) і компонент (браузер) — різні середовища. Модульні моки створені з `vi.mock()` або `jest.mock()` впливають лише на імпорти в процесі Node.js. Браузер запускає власну збандлену копію компонента з власним розрішенням модулів — мок там невидимий. Щоб перехоплювати мережеві запити на стороні браузера — використовуй `router.route()` з фікстури router, або `context.route()` у хуку `beforeMount` для мокування API-ендпоінтів на рівні HTTP.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What environment does the component run in during a Playwright component test?",
        uk: "У якому середовищі виконується компонент під час компонентного тесту Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "JSDOM — a simulated browser environment in Node.js",
            uk: "JSDOM — симульоване браузерне середовище в Node.js",
          },
        },
        {
          id: "b",
          label: {
            en: "A real browser (Chromium, Firefox, or WebKit) — same engine as e2e tests",
            uk: "Реальний браузер (Chromium, Firefox або WebKit) — той самий рушій що і в e2e тестах",
          },
        },
        {
          id: "c",
          label: {
            en: "A headless Node.js VM with a virtual DOM",
            uk: "Безголовий Node.js VM з віртуальним DOM",
          },
        },
        {
          id: "d",
          label: {
            en: "A sandboxed iframe within the test runner process",
            uk: "Ізольований iframe в процесі тестового раннера",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright component testing runs components in a real browser — not JSDOM. This is the primary reason to choose it over Vitest/Jest: CSS actually applies, layout is computed, hover states and scroll work, and the browser engine matches production. JSDOM, used by Vitest and Jest by default, simulates many browser behaviors but cannot replicate layout, CSS, or real browser events accurately.",
        uk: "Компонентне тестування Playwright виконує компоненти у реальному браузері — не JSDOM. Це основна причина обирати його замість Vitest/Jest: CSS реально застосовується, лейаут обчислюється, hover-стани і прокрутка працюють, і рушій браузера відповідає продакшну. JSDOM, який Vitest і Jest використовують за замовчуванням, симулює багато браузерних поведінок але не може точно відтворити лейаут, CSS або реальні браузерні події.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "You're setting up Playwright component testing for a React project. Which package do you install?",
        uk: "Ти налаштовуєш компонентне тестування Playwright для React-проєкту. Який пакет встановлюєш?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "@playwright/test — the standard test runner works for components too",
            uk: "@playwright/test — стандартний тестовий раннер підходить і для компонентів",
          },
        },
        {
          id: "b",
          label: {
            en: "@playwright/experimental-ct-react — the framework-specific component testing package",
            uk: "@playwright/experimental-ct-react — пакет компонентного тестування для конкретного фреймворку",
          },
        },
        {
          id: "c",
          label: {
            en: "playwright-react — a community component testing adapter",
            uk: "playwright-react — адаптер компонентного тестування від спільноти",
          },
        },
        {
          id: "d",
          label: {
            en: "@playwright/react — the official React integration package",
            uk: "@playwright/react — офіційний пакет інтеграції з React",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`@playwright/experimental-ct-react` is the correct package for React component testing. There are framework-specific variants: `@playwright/experimental-ct-vue` for Vue and `@playwright/experimental-ct-svelte` for Svelte. The `experimental` prefix is intentional — the API is still evolving. Don't use `@playwright/test` for component tests; it doesn't have the `mount` fixture or the component test configuration. The install creates `playwright-ct.config.ts` and the `playwright/index.ts` scaffold.",
        uk: "`@playwright/experimental-ct-react` — правильний пакет для компонентного тестування React. Є варіанти для конкретних фреймворків: `@playwright/experimental-ct-vue` для Vue і `@playwright/experimental-ct-svelte` для Svelte. Префікс `experimental` навмисний — API ще розвивається. Не використовуй `@playwright/test` для компонентних тестів; у ньому немає фікстури `mount` або конфігурації компонентних тестів. При встановленні створюється `playwright-ct.config.ts` і скелет `playwright/index.ts`.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "Your OrderForm component accepts an `onSubmit(order: Order)` callback. `Order` contains a non-serializable `Date` object. You try to pass the callback directly via mount() but crossing the Node/browser boundary fails. What's the fix?",
        uk: "Твій компонент OrderForm приймає колбек `onSubmit(order: Order)`. `Order` містить несеріалізований об'єкт `Date`. Ти намагаєшся передати колбек напряму через mount() але перетин межі Node/браузер провалюється. Яке виправлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use JSON.stringify/parse to serialize the Date before passing",
            uk: "Використовуй JSON.stringify/parse для серіалізації Date перед передачею",
          },
        },
        {
          id: "b",
          label: {
            en: "Create a wrapper component that accepts only a serializable string (e.g., ISO date string) and internally converts it to Date before passing to OrderForm",
            uk: "Створи компонент-обгортку що приймає лише серіалізований рядок (наприклад ISO-рядок дати) і всередині конвертує його в Date перед передачею в OrderForm",
          },
        },
        {
          id: "c",
          label: {
            en: "Add a special Playwright serializer for the Date type",
            uk: "Додай спеціальний Playwright-серіалізатор для типу Date",
          },
        },
        {
          id: "d",
          label: {
            en: "Move the test to an e2e test that can handle complex objects",
            uk: "Перенеси тест в e2e-тест який може обробляти складні об'єкти",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The wrapper component pattern keeps the Node/browser boundary clean. Instead of passing a complex callback that returns a `Date`, create `OrderFormForTest` which accepts `onSubmit(dateString: string)` — a plain string. Inside the wrapper, it mounts `<OrderForm onSubmit={(order) => onSubmit(order.date.toISOString())} />`. The test stays simple, only serializable data crosses the boundary. This is the standard pattern for any prop type that can't be serialized (live objects, complex class instances, functions that return non-primitives).",
        uk: "Патерн компонента-обгортки тримає межу Node/браузер чистою. Замість передачі складного колбека що повертає `Date` — створи `OrderFormForTest` що приймає `onSubmit(dateString: string)`, простий рядок. Всередині обгортка монтує `<OrderForm onSubmit={(order) => onSubmit(order.date.toISOString())} />`. Тест залишається простим, через межу переходять лише серіалізовані дані. Це стандартний патерн для будь-якого типу prop що не може бути серіалізований (живі об'єкти, складні екземпляри класів, функції що повертають непримітиви).",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You're testing a Vue component that uses vue-router for navigation links. The component crashes because there's no router instance. How do you set up the router for all component tests?",
        uk: "Тестуєш Vue-компонент що використовує vue-router для навігаційних посилань. Компонент падає бо немає інстансу роутера. Як налаштувати роутер для всіх компонентних тестів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Import and install the router directly at the top of each test file",
            uk: "Імпортуй і встановлюй роутер напряму на початку кожного файлу тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "Use the beforeMount hook in playwright/index.ts to call app.use(createRouter(...)) before each mount",
            uk: "Використовуй хук beforeMount в playwright/index.ts щоб викликати app.use(createRouter(...)) перед кожним mount",
          },
        },
        {
          id: "c",
          label: {
            en: "Add a global router plugin in playwright.config.ts",
            uk: "Додай глобальний плагін роутера в playwright.config.ts",
          },
        },
        {
          id: "d",
          label: {
            en: "Pass a router instance as a prop to the component via mount()",
            uk: "Передай інстанс роутера як prop до компонента через mount()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`playwright/index.ts` is the global setup file for component tests — it's the right place for app-level plugins like router and Pinia. The `beforeMount` hook receives the `app` instance before every `mount()` call, so `app.use(createRouter(...))` installs the router globally. You can also make this conditional using `hooksConfig`: pass `{ routing: true }` from each test's `mount()` call, and check that flag in `beforeMount` to only add the router when needed.",
        uk: "`playwright/index.ts` — файл глобального налаштування для компонентних тестів, це правильне місце для плагінів рівня застосунку як роутер і Pinia. Хук `beforeMount` отримує інстанс `app` перед кожним викликом `mount()`, тому `app.use(createRouter(...))` встановлює роутер глобально. Також можна зробити це умовним використовуючи `hooksConfig`: передай `{ routing: true }` з виклику `mount()` кожного тесту і перевір цей прапорець у `beforeMount` щоб додавати роутер лише коли потрібно.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Which configuration object lets a specific test pass per-test data to the beforeMount hook in playwright/index.ts?",
        uk: "Який об'єкт конфігурації дозволяє конкретному тесту передавати дані для кожного тесту в хук beforeMount у playwright/index.ts?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "testInfo.config — the test configuration object",
            uk: "testInfo.config — об'єкт конфігурації тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "hooksConfig — passed as a property in the mount() options object",
            uk: "hooksConfig — передається як властивість в об'єкті опцій mount()",
          },
        },
        {
          id: "c",
          label: {
            en: "process.env — set environment variables before calling mount()",
            uk: "process.env — встановлюй змінні середовища перед викликом mount()",
          },
        },
        {
          id: "d",
          label: {
            en: "test.use() — the same mechanism used for playwright fixtures",
            uk: "test.use() — той самий механізм що використовується для playwright-фікстур",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`hooksConfig` is the dedicated mechanism for passing per-test setup data from `mount()` to the `beforeMount` hook. In the test: `await mount(MyComponent, { hooksConfig: { routing: true, initialStore: { items: [] } } })`. In `playwright/index.ts`, the `beforeMount({ app, hooksConfig })` callback receives that exact object. This keeps test-specific configuration close to the test itself while centralizing the actual plugin setup in the global index file.",
        uk: "`hooksConfig` — спеціальний механізм для передачі даних налаштування для кожного тесту з `mount()` в хук `beforeMount`. У тесті: `await mount(MyComponent, { hooksConfig: { routing: true, initialStore: { items: [] } } })`. У `playwright/index.ts` колбек `beforeMount({ app, hooksConfig })` отримує саме цей об'єкт. Це тримає конфігурацію для конкретного тесту близько до самого тесту водночас централізуючи фактичне налаштування плагінів у глобальному index-файлі.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Should you call mount() in beforeEach or inside each individual test?",
        uk: "Чи слід викликати mount() у beforeEach чи всередині кожного окремого тесту?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "In beforeEach — it avoids code repetition and the component reference is available to all tests in the describe block",
            uk: "У beforeEach — це уникає повторення коду і посилання на компонент доступне всім тестам у describe-блоці",
          },
        },
        {
          id: "b",
          label: {
            en: "Inside each test — tests are self-contained, easier to understand, and you can pass different props or hooksConfig per test without shared state leaking between tests",
            uk: "Всередині кожного тесту — тести самодостатні, легші для розуміння і можна передавати різні props або hooksConfig для кожного тесту без витоку спільного стану між тестами",
          },
        },
        {
          id: "c",
          label: {
            en: "Both are equivalent — use whichever your team prefers",
            uk: "Обидва еквівалентні — використовуй той що команда надає перевагу",
          },
        },
        {
          id: "d",
          label: {
            en: "In beforeAll — mount once and reuse the component across all tests for speed",
            uk: "У beforeAll — монтуй один раз і перевикористовуй компонент в усіх тестах для швидкодії",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Mounting inside each test is the recommended practice. A self-contained test shows everything it needs in one place — the reader doesn't have to scroll up to `beforeEach` to understand what the component looks like. It also makes it easy to pass different props per test: one test mounts with `initialCount: 0`, another with `initialCount: 5`. Shared state in `beforeEach` is a source of subtle inter-test dependencies that are hard to debug.",
        uk: "Монтування всередині кожного тесту — рекомендована практика. Самодостатній тест показує все що йому потрібно в одному місці — читачеві не доводиться прокручувати вгору до `beforeEach` щоб зрозуміти як виглядає компонент. Також легко передавати різні props для кожного тесту: один тест монтується з `initialCount: 0`, інший з `initialCount: 5`. Спільний стан у `beforeEach` — джерело тонких міжтестових залежностей які важко дебажити.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "A ProductCard component fetches `/api/product/123` on mount and renders the price. In a component test, you want to control what the API returns. What's the correct approach?",
        uk: "Компонент ProductCard робить запит до `/api/product/123` при монтуванні і рендерить ціну. У компонентному тесті хочеш контролювати що повертає API. Який правильний підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Mock the fetch module with vi.mock('node-fetch', ...) at the top of the test file",
            uk: "Мокуй модуль fetch через vi.mock('node-fetch', ...) на початку файлу тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "Use context.route('/api/product/*', route => route.fulfill({ json: { price: 99 } })) in a beforeMount hook to intercept the browser's HTTP request",
            uk: "Використовуй context.route('/api/product/*', route => route.fulfill({ json: { price: 99 } })) у хуку beforeMount щоб перехопити HTTP-запит браузера",
          },
        },
        {
          id: "c",
          label: {
            en: "Pass the mock data as a prop and skip the API call",
            uk: "Передавай mock-дані як prop і пропускай API-виклик",
          },
        },
        {
          id: "d",
          label: {
            en: "Start a real test server that responds to /api/product/123",
            uk: "Запусти реальний тестовий сервер що відповідає на /api/product/123",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`context.route()` intercepts network requests at the HTTP level in the browser — exactly where the component's `fetch('/api/product/123')` call goes. This works because Playwright controls the browser's network layer. `vi.mock()` won't work: it mocks Node.js imports, but the component runs in the browser where there are no Node.js modules. The typical setup: in `playwright/index.ts`, use a `beforeMount` hook that receives the `context` fixture and calls `context.route(...)` with the per-test data from `hooksConfig`.",
        uk: "`context.route()` перехоплює мережеві запити на рівні HTTP в браузері — саме туди йде виклик `fetch('/api/product/123')` компонента. Це працює тому що Playwright контролює мережевий рівень браузера. `vi.mock()` не спрацює: він мокує Node.js-імпорти але компонент виконується в браузері де немає Node.js-модулів. Типове налаштування: у `playwright/index.ts` використовуй хук `beforeMount` що отримує фікстуру `context` і викликає `context.route(...)` з даними для кожного тесту з `hooksConfig`.",
      },
    },
  ],
}
