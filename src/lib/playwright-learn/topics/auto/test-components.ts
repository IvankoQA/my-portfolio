import type { PlaywrightTopic } from "../../types"

export const testComponentsTopic: PlaywrightTopic = {
  slug: "test-components",
  groupId: "test-runner",
  order: 325,
  sourceDoc: "test-components-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-components",
  title: {
    en: "Components (experimental)",
    uk: "Компоненти (експериментально)",
  },
  summary: {
    en: "Playwright Test can now test your components.",
    uk: "Playwright Test тепер може тестувати ваші компоненти.",
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
          en: "Playwright Test can now test your components.",
          uk: "Playwright Test тепер може тестувати ваші компоненти.",
        },
      ],
    },
    {
      id: "example",
      title: {
        en: "Example",
        uk: "Приклад",
      },
      paragraphs: [
        {
          en: "Here is what a typical component test looks like:",
          uk: "Ось як зазвичай виглядає тест компонента:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "test('event should work', async ({ mount }) => {\n  let clicked = false;\n\n  // Mount a component. Returns locator pointing to the component.\n  const component = await mount(\n     { clicked = true }}>\n  );\n\n  // As with any Playwright test, assert locator text.\n  await expect(component).toContainText('Submit');\n\n  // Perform locator click. This will trigger the event.\n  await component.click();\n\n  // Assert that respective events have been fired.\n  expect(clicked).toBeTruthy();\n});",
        },
      ],
    },
    {
      id: "how-to-get-started",
      title: {
        en: "How to get started",
        uk: "Як почати",
      },
      paragraphs: [
        {
          en: "Adding Playwright Test to an existing project is easy. Below are the steps to enable Playwright Test for a React or Vue project.",
          uk: "Додати Playwright Test до наявного проєкту просто. Нижче — кроки, щоб увімкнути Playwright Test для React або Vue.",
        },
        {
          en: "### Step 1: Install Playwright Test for components for your respective framework",
          uk: "### Крок 1: установіть Playwright Test для компонентів для вашого фреймворка",
        },
        {
          en: "This step creates several files in your workspace:",
          uk: "На цьому кроці у робочій області створюються кілька файлів:",
        },
        {
          en: 'This file defines an html file that will be used to render components during testing.\nIt must contain element with `id="root"`, that\'s where components are mounted. It must\nalso link the script called `playwright/index.{js,ts,jsx,tsx}`.',
          uk: 'Цей файл задає HTML-сторінку для рендеру компонентів під час тестів.\nУ ньому має бути елемент з `id="root"` — туди монтуються компоненти. Також\nпотрібно підключити скрипт `playwright/index.{js,ts,jsx,tsx}`.',
        },
        {
          en: "You can include stylesheets, apply theme and inject code into the page where\ncomponent is mounted using this script. It can be either a `.js`, `.ts`, `.jsx` or `.tsx` file.",
          uk: "Через цей скрипт можна підключити стилі, застосувати тему та інжектити код на сторінку,\nде монтується компонент. Файл може бути `.js`, `.ts`, `.jsx` або `.tsx`.",
        },
        {
          en: "### Step 2. Create a test file `src/App.spec.{ts,tsx}`",
          uk: "### Крок 2. Створіть тестовий файл `src/App.spec.{ts,tsx}`",
        },
        {
          en: "### Step 3. Run the tests",
          uk: "### Крок 3. Запустіть тести",
        },
        {
          en: "You can run tests using the [VS Code extension](./getting-started-vscode.md) or the command line.",
          uk: "Тести можна запускати через [розширення VS Code](./getting-started-vscode.md) або командний рядок.",
        },
        {
          en: "### Further reading: configure reporting, browsers, tracing",
          uk: "### Додатково: звіти, браузери, трейсинг",
        },
        {
          en: "Refer to [Playwright config](./test-configuration.md) for configuring your project.",
          uk: "Див. [конфігурацію Playwright](./test-configuration.md), щоб налаштувати проєкт.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "// Apply theme here, add anything your component needs at runtime here.",
        },
        {
          id: "cb-4",
          language: "sh",
          code: "npm run test-ct",
        },
      ],
    },
    {
      id: "test-stories",
      title: {
        en: "Test stories",
        uk: "Тестові stories",
      },
      paragraphs: [
        {
          en: "When Playwright Test is used to test web components, tests run in Node.js, while components run in the real browser. This brings together the best of both worlds: components run in the real browser environment, real clicks are triggered, real layout is executed, visual regression is possible. At the same time, test can use all the powers of Node.js as well as all the Playwright Test features. As a result, the same parallel, parametrized tests with the same post-mortem Tracing story are available during component testing.",
          uk: "Коли Playwright Test тестує вебкомпоненти, тести виконуються в Node.js, а компоненти — у справжньому браузері. Це поєднує переваги обох світів: компоненти працюють у реальному середовищі браузера, справжні кліки, справжня верстка, можлива візуальна регресія. Паралельно тест може використовувати всі можливості Node.js і Playwright Test. У результаті під час компонентного тестування доступні ті самі паралельні, параметризовані тести та той самий сценарій постмортем Tracing.",
        },
        {
          en: "This however, is introducing a number of limitations:",
          uk: "Разом із тим з’являється низка обмежень:",
        },
        {
          en: "- You can't pass complex live objects to your component. Only plain JavaScript objects and built-in types like strings, numbers, dates etc. can be passed.",
          uk: "- Не можна передавати в компонент складні «живі» об’єкти. Лише прості JavaScript-об’єкти та вбудовані типи: рядки, числа, дати тощо.",
        },
        {
          en: "- You can't pass data to your component synchronously in a callback:",
          uk: "- Не можна синхронно передавати дані в компонент через колбек:",
        },
        {
          en: "Working around these and other limitations is quick and elegant: for every use case of the tested component, create a wrapper of this component designed specifically for test. Not only it will mitigate the limitations, but it will also offer powerful abstractions for testing where you would be able to define environment, theme and other aspects of your component rendering.",
          uk: "Обійти ці та інші обмеження можна швидко й елегантно: для кожного сценарію тестованого компонента створіть обгортку, призначену саме для тестів. Вона зменшить обмеження й дасть зручні абстракції для тестів — середовище, тему та інші аспекти рендеру компонента.",
        },
        {
          en: "Let's say you'd like to test following component:",
          uk: "Припустімо, потрібно протестувати такий компонент:",
        },
        {
          en: "Create a story file for your component:",
          uk: "Створіть story-файл для компонента:",
        },
        {
          en: "Then test the component via testing the story:",
          uk: "Потім тестуйте компонент через тестування story:",
        },
        {
          en: 'As a result, for every component you\'ll have a story file that exports all the stories that are actually tested.\nThese stories live in the browser and "convert" complex object into the simple objects that can be accessed in the test.',
          uk: "У підсумку для кожного компонента буде story-файл, який експортує всі stories, що реально тестуються.\nЦі stories виконуються в браузері й «перетворюють» складні об’єкти на прості, доступні з тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "test('this will work', async ({ mount }) => {\n  const component = await mount();\n});\n\ntest('this will not work', async ({ mount }) => {\n  // `process` is a Node object, we can't pass it to the browser and expect it to work.\n  const component = await mount();\n});",
        },
        {
          id: "cb-6",
          language: "js",
          code: "test('this will not work', async ({ mount }) => {\n  // () => 'red' callback lives in Node. If `ColorPicker` component in the browser calls the parameter function\n  // `colorGetter` it won't get result synchronously. It'll be able to get it via await, but that is not how\n  // components are typically built.\n  const component = await mount( 'red'}/>);\n});",
        },
        {
          id: "cb-7",
          language: "js",
          code: "\ntype InputMediaProps = {\n  // Media is a complex browser object we can't send to Node while testing.\n  onChange(media: Media): void;\n};\n\nexport function InputMedia(props: InputMediaProps) {\n  return <> as any;\n}",
        },
        {
          id: "cb-8",
          language: "js",
          code: "\ntype InputMediaForTestProps = {\n  onMediaChange(mediaName: string): void;\n};\n\nexport function InputMediaForTest(props: InputMediaForTestProps) {\n  // Instead of sending a complex `media` object to the test, send the media name.\n  return  props.onMediaChange(media.name)} />;\n}\n// Export more stories here.",
        },
        {
          id: "cb-9",
          language: "js",
          code: "\ntest('changes the image', async ({ mount }) => {\n  let mediaSelected: string | null = null;\n\n  const component = await mount(\n    <InputMediaForTest\n      onMediaChange={mediaName => {\n        mediaSelected = mediaName;\n      }}\n    />\n  );\n  await component\n    .getByTestId('imageInput')\n    .setInputFiles('src/assets/logo.png');\n\n  await expect(component.getByAltText(/selected image/i)).toBeVisible();\n  await expect.poll(() => mediaSelected).toBe('logo.png');\n});",
        },
      ],
    },
    {
      id: "under-the-hood",
      title: {
        en: "Under the hood",
        uk: "Під капотом",
      },
      paragraphs: [
        {
          en: "Here is how component testing works:",
          uk: "Ось як працює тестування компонентів:",
        },
        {
          en: "- Once the tests are executed, Playwright creates a list of components that the tests need.\n- It then compiles a bundle that includes these components and serves it using a local static web server.\n- Upon the `mount` call within the test, Playwright navigates to the facade page `/playwright/index.html` of this bundle and tells it to render the component.\n- Events are marshalled back to the Node.js environment to allow verification.",
          uk: "- Після запуску тестів Playwright збирає список компонентів, які потрібні тестам.\n- Потім збирає бандл із цими компонентами й віддає його через локальний статичний вебсервер.\n- Під час виклику `mount` у тесті Playwright переходить на фасадну сторінку `/playwright/index.html` цього бандла й просить відрендерити компонент.\n- Події передаються назад у середовище Node.js для перевірок.",
        },
        {
          en: "Playwright is using [Vite](https://vitejs.dev/) to create the components bundle and serve it.",
          uk: "Playwright використовує [Vite](https://vitejs.dev/) для збірки компонентів і їх віддачі.",
        },
      ],
    },
    {
      id: "best-practices-and-pitfalls",
      title: {
        en: "Best practices and pitfalls",
        uk: "Найкращі практики та підводні камені",
      },
      paragraphs: [
        {
          en: "Component tests are most reliable when they embrace the fact that the test runs in Node.js while the mounted component runs in the browser.",
          uk: "Тести компонентів найнадійніші, коли явно враховують: тест виконується в Node.js, а змонтований компонент — у браузері.",
        },
        {
          en: "### Prefer mounting inside each test",
          uk: "### Краще монтувати всередині кожного тесту",
        },
        {
          en: "Keep `mount()` close to the assertions that use it. Mounting in `beforeEach` makes it harder to see which component state belongs to which test and tends to hide accidental coupling between tests.",
          uk: "Тримайте `mount()` поруч із асертами, які його використовують. Монтування в `beforeEach` ускладнює бачення, який стан компонента належить якому тесту, і часто приховує випадкове зв’язування між тестами.",
        },
        {
          en: "### Module mocks do not cross the Node/browser boundary",
          uk: "### Модульні моки не перетинають межу Node/браузер",
        },
        {
          en: "Module-level mocks such as `vi.mock()` or `jest.mock()` run in the test process. The component bundle runs in the browser, so those mocks do not automatically affect what the component imports at runtime. Prefer passing test-specific behavior through [`hooksConfig`](#hooks) and configuring it in `playwright/index.{js,ts,jsx,tsx}` with `beforeMount`.",
          uk: "Модульні моки на кшталт `vi.mock()` або `jest.mock()` виконуються в процесі тестів. Бандл компонента працює у браузері, тому ці моки не змінюють автоматично те, що компонент імпортує під час виконання. Краще передавати поведінку для тестів через [`hooksConfig`](#hooks) і налаштовувати її в `playwright/index.{js,ts,jsx,tsx}` у `beforeMount`.",
        },
        {
          en: "### Reset browser state when a component depends on globals",
          uk: "### Скидайте стан браузера, якщо компонент залежить від глобальних речей",
        },
        {
          en: "Component testing may reuse the browser `context` and `page` between tests as a performance optimization. If a component depends on global browser state such as `localStorage`, cookies, singleton services, or router state, reset that state in your test setup or in [`beforeMount`](#hooks) so each test starts from a known baseline.",
          uk: "Компонентне тестування може повторно використовувати `context` і `page` між тестами для швидкості. Якщо компонент залежить від глобального стану браузера — `localStorage`, кукі, синглтонів чи стану роутера — скидайте цей стан у підготовці тесту або в [`beforeMount`](#hooks), щоб кожен тест починався з відомої базової лінії.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-10",
          language: "js",
          code: "test('renders the product name', async ({ mount }) => {\n  const component = await mount();\n  await expect(component).toContainText('Playwright');\n});",
        },
      ],
    },
    {
      id: "api-reference",
      title: {
        en: "API reference",
        uk: "Довідник API",
      },
      paragraphs: [
        {
          en: "### props",
          uk: "### props",
        },
        {
          en: "Provide props to a component when mounted.",
          uk: "Передає props компоненту під час монтування.",
        },
        {
          en: "### callbacks / events",
          uk: "### callbacks / events",
        },
        {
          en: "Provide callbacks/events to a component when mounted.",
          uk: "Передає колбеки/події компоненту під час монтування.",
        },
        {
          en: "### children / slots",
          uk: "### children / slots",
        },
        {
          en: "Provide children/slots to a component when mounted.",
          uk: "Передає children/slots компоненту під час монтування.",
        },
        {
          en: "### hooks",
          uk: "### hooks",
        },
        {
          en: "You can use `beforeMount` and `afterMount` hooks to configure your app. This lets you set up things like your app router, fake server etc. giving you the flexibility you need. You can also pass custom configuration from the `mount` call from a test, which is accessible from the `hooksConfig` fixture. This includes any config that needs to be run before or after mounting the component. An example of configuring a router is provided below:",
          uk: "Хуки `beforeMount` і `afterMount` налаштовують застосунок: роутер, фейковий сервер тощо — з потрібною гнучкістю. З виклику `mount` у тесті можна передати власну конфігурацію; вона доступна через фікстуру `hooksConfig`, включно з налаштуваннями до або після монтування. Нижче — приклад налаштування роутера:",
        },
        {
          en: "### unmount",
          uk: "### unmount",
        },
        {
          en: 'Unmount the mounted component from the DOM. This is useful for testing the component\'s behavior upon unmounting. Use cases include testing an "Are you sure you want to leave?" modal or ensuring proper cleanup of event handlers to prevent memory leaks.',
          uk: "Знімає змонтований компонент з DOM. Корисно для перевірки поведінки під час демонтування: наприклад, модалка «Ви впевнені, що хочете вийти?» або коректне прибирання обробників подій, щоб уникнути витоків пам’яті.",
        },
        {
          en: "### update",
          uk: "### update",
        },
        {
          en: "Update props, slots/children, and/or events/callbacks of a mounted component. These component inputs can change at any time and are typically provided by the parent component, but sometimes it is necessary to ensure that your components behave appropriately to new inputs.",
          uk: "Оновлює props, slots/children та/або події/колбеки змонтованого компонента. Ці вхідні дані можуть змінюватися в будь-який момент і зазвичай задаються батьківським компонентом; іноді потрібно переконатися, що компонент коректно реагує на нові вхідні дані.",
        },
        {
          en: "### Handling network requests",
          uk: "### Робота з мережевими запитами",
        },
        {
          en: "Playwright provides an **experimental** `router` fixture to intercept and handle network requests. There are two ways to use the `router` fixture:\n* Call `router.route(url, handler)` that behaves similarly to [`method: Page.route`]. See the [network mocking guide](./mock.md) for more details.\n* Call `router.use(handlers)` and pass [MSW library](https://mswjs.io/) request handlers to it.",
          uk: "Playwright надає **експериментальну** фікстуру `router` для перехоплення й обробки мережевих запитів. Є два способи:\n* `router.route(url, handler)` — схоже на [`method: Page.route`]. Деталі — у [посібнику з мокування мережі](./mock.md).\n* `router.use(handlers)` — передайте обробники запитів [бібліотеки MSW](https://mswjs.io/).",
        },
        {
          en: "Here is an example of reusing your existing MSW handlers in the test.",
          uk: "Приклад повторного використання наявних MSW-обробників у тесті.",
        },
        {
          en: "You can also introduce a one-off handler for a specific test.",
          uk: "Можна додати разовий обробник для конкретного тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "\ntest.beforeEach(async ({ router }) => {\n  // install common handlers before each test\n  await router.use(...handlers);\n});\n\ntest('example test', async ({ mount }) => {\n  // test as usual, your handlers are active\n  // ...\n});",
        },
        {
          id: "cb-12",
          language: "js",
          code: "\ntest('example test', async ({ mount, router }) => {\n  await router.use(http.get('/data', async ({ request }) => {\n    return HttpResponse.json({ value: 'mocked' });\n  }));\n\n  // test as usual, your handler is active\n  // ...\n});",
        },
      ],
    },
    {
      id: "frequently-asked-questions",
      title: {
        en: "Frequently asked questions",
        uk: "Часті запитання",
      },
      paragraphs: [
        {
          en: "### What's the difference between `@playwright/test` and `@playwright/experimental-ct-{react,vue}`?",
          uk: "### Чим `@playwright/test` відрізняється від `@playwright/experimental-ct-{react,vue}`?",
        },
        {
          en: "`@playwright/experimental-ct-{react,vue}` wrap `@playwright/test` to provide an additional built-in component-testing specific fixture called `mount`:",
          uk: "`@playwright/experimental-ct-{react,vue}` обгортає `@playwright/test` і додає вбудовану фікстуру для компонентних тестів — `mount`:",
        },
        {
          en: "Additionally, it adds some config options you can use in your `playwright-ct.config.{ts,js}`.",
          uk: "Також з’являються додаткові опції конфігурації в `playwright-ct.config.{ts,js}`.",
        },
        {
          en: "Finally, under the hood, each test re-uses the `context` and `page` fixture as a speed optimization for Component Testing.\nIt resets them in between each test so it should be functionally equivalent to `@playwright/test`'s guarantee that you get a new, isolated `context` and `page` fixture per-test.",
          uk: "Під капотом кожен тест повторно використовує фікстури `context` і `page` для швидкості компонентного тестування.\nМіж тестами вони скидаються, тож за поведінкою це близько до гарантії `@playwright/test`: нові ізольовані `context` і `page` на кожен тест.",
        },
        {
          en: "### I have a project that already uses Vite. Can I reuse the config?",
          uk: "### У проєкті вже є Vite. Чи можна перевикористати конфіг?",
        },
        {
          en: "At this point, Playwright is bundler-agnostic, so it is not reusing your existing Vite config. Your config might have a lot of things we won't be able to reuse. So for now, you would copy your path mappings and other high level settings into the `ctViteConfig` property of Playwright config.",
          uk: "Наразі Playwright не прив’язаний до бандлера й не підхоплює ваш існуючий Vite-конфіг. Багато з нього все одно не вдасться перевикористати. Поки що скопіюйте мапінги шляхів та інші високорівневі налаштування у властивість `ctViteConfig` у конфігурації Playwright.",
        },
        {
          en: "You can specify plugins via Vite config for testing settings. Note that once you start specifying plugins, you are responsible for specifying the framework plugin as well, `vue()` in this case:",
          uk: "Плагіни можна задати через Vite-конфіг для тестів. Якщо ви починаєте явно перелічувати плагіни, потрібно також підключити плагін фреймворку — у цьому прикладі `vue()`:",
        },
        {
          en: "### How do I use CSS imports?",
          uk: "### Як імпортувати CSS?",
        },
        {
          en: "If you have a component that imports CSS, Vite will handle it automatically. You can also use CSS pre-processors such as Sass, Less, or Stylus, and Vite will handle them as well without any additional configuration. However, corresponding CSS pre-processor needs to be installed.",
          uk: "Якщо компонент імпортує CSS, Vite обробить це автоматично. Підтримуються препроцесори Sass, Less, Stylus — також без додаткового конфігу, але відповідний препроцесор треба встановити.",
        },
        {
          en: "Vite has a hard requirement that all CSS Modules are named `*.module.[css extension]`. If you have a custom build config for your project normally and have imports of the form `import styles from 'styles.css'` you must rename your files to properly indicate they are to be treated as modules. You could also write a Vite plugin to handle this for you.",
          uk: "Vite вимагає, щоб CSS Modules називались `*.module.[розширення css]`. Якщо у власній збірці використовується `import styles from 'styles.css'`, перейменуйте файли, щоб явно позначити модулі, або напишіть Vite-плагін.",
        },
        {
          en: "Check [Vite documentation](https://vite.dev/guide/features#css) for more details.",
          uk: "Деталі — у [документації Vite](https://vite.dev/guide/features#css).",
        },
        {
          en: "### How can I test components that uses Pinia?",
          uk: "### Як тестувати компоненти з Pinia?",
        },
        {
          en: "Pinia needs to be initialized in `playwright/index.{js,ts,jsx,tsx}`. If you do this inside a `beforeMount` hook, the `initialState` can be overwritten on a per-test basis:",
          uk: "Pinia ініціалізуйте в `playwright/index.{js,ts,jsx,tsx}`. У хуку `beforeMount` можна перевизначати `initialState` для кожного тесту:",
        },
        {
          en: "### How do I access the component's methods or its instance?",
          uk: "### Як отримати доступ до методів компонента або його інстансу?",
        },
        {
          en: "Accessing a component's internal methods or its instance within test code is neither recommended nor supported. Instead, focus on observing and interacting with the component from a user's perspective, typically by clicking or verifying if something is visible on the page. Tests become less fragile and more valuable when they avoid interacting with internal implementation details, such as the component instance or its methods. Keep in mind that if a test fails when run from a user’s perspective, it likely means the automated test has uncovered a genuine bug in your code.",
          uk: "Доступ до внутрішніх методів чи інстансу компонента з тесту не рекомендується й не підтримується. Краще дивитися на компонент очима користувача: кліки, видимість елементів. Тести стійкіші й корисніші, якщо не чіпають внутрішню реалізацію.\n\nЯкщо тест падає з перспективи користувача, це часто означає справжню помилку в коді.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-13",
          language: "js",
          code: "test('…', async ({ mount, page, context }) => {\n  // …\n});",
        },
        {
          id: "cb-14",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    ctViteConfig: {\n      // ...\n    },\n  },\n});",
        },
        {
          id: "cb-15",
          language: "js",
          code: "\nexport default defineConfig({\n  testDir: './tests/component',\n  use: {\n    trace: 'on-first-retry',\n    ctViteConfig: {\n      plugins: [\n        vue(),\n        AutoImport({\n          imports: [\n            'vue',\n            'vue-router',\n            '@vueuse/head',\n            'pinia',\n            {\n              '@/store': ['useStore'],\n            },\n          ],\n          dts: 'src/auto-imports.d.ts',\n          eslintrc: {\n            enabled: true,\n          },\n        }),\n        Components({\n          dirs: ['src/components'],\n          extensions: ['vue'],\n        }),\n      ],\n      resolve: {\n        alias: {\n          '@': resolve(__dirname, './src'),\n        },\n      },\n    },\n  },\n});",
        },
        {
          id: "cb-16",
          language: "js",
          code: "\nexport type HooksConfig = {\n  store?: StoreState>;\n}\n\nbeforeMount(async ({ hooksConfig }) => {\n  createTestingPinia({\n    initialState: hooksConfig?.store,\n    /**\n     * Use http intercepting to mock api calls instead:\n     * https://playwright.dev/docs/mock#mock-api-requests\n     */\n    stubActions: false,\n    createSpy(args) {\n      console.log('spy', args)\n      return () => console.log('spy-returns')\n    },\n  });\n});",
        },
        {
          id: "cb-17",
          language: "js",
          code: "\ntest('override initialState ', async ({ mount }) => {\n  const component = await mount(Store, {\n    hooksConfig: {\n      store: { name: 'override initialState' }\n    }\n  });\n  await expect(component).toContainText('override initialState');\n});",
        },
      ],
    },
  ],
  quiz: [],
}
