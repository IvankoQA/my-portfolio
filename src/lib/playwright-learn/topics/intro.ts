import type { PlaywrightTopic } from "../types"

export const introTopic: PlaywrightTopic = {
  slug: "intro",
  groupId: "intro",
  order: 10,
  level: "beginner",
  trackOrder: 1,
  sourceDoc: "intro-js.md",
  officialDocsUrl: "https://playwright.dev/docs/intro",
  title: {
    en: "Introduction to Playwright",
    uk: "Вступ до Playwright",
  },
  summary: {
    en: "What Playwright is, why it’s used for end-to-end testing, and how the test runner ships out of the box.",
    uk: "Що таке Playwright, навіщо його використовують для end-to-end тестування і що дає вбудований test runner.",
  },
  sections: [
    {
      id: "what-is-playwright",
      title: {
        en: "What is Playwright",
        uk: "Що таке Playwright",
      },
      diagram: {
        mermaid: `flowchart LR
  PW["@playwright/test"] --> CR["Chromium\n(Chrome, Edge)"]
  PW --> FF["Firefox"]
  PW --> WK["WebKit\n(Safari)"]
  CR & FF & WK --> OS["Windows / macOS / Linux\nheadless or headed\ndesktop or mobile emulation"]`,
        caption: {
          en: "One API — three browser engines, any OS, any mode",
          uk: "Один API — три браузерних рушії, будь-яка ОС, будь-який режим",
        },
      },
      paragraphs: [
        {
          en: "Playwright is an open-source end-to-end testing framework built and maintained by Microsoft. A single API drives Chromium (Chrome, Edge), Firefox and WebKit (Safari) across Windows, macOS, Linux, headless or headed, desktop or mobile emulation.",
          uk: "Playwright — це open-source фреймворк для end-to-end тестування від Microsoft. Один і той самий API керує Chromium (Chrome, Edge), Firefox і WebKit (Safari) на Windows, macOS, Linux у режимах headless (без вікна браузера) і headed (з вікном браузера), на десктопі або з емуляцією мобільних пристроїв.",
        },
        {
          en: "It ships with @playwright/test — its own test runner with parallelism, fixtures, web-first assertions and rich tooling (Trace Viewer, codegen, UI mode). You do not need Jest, Mocha or a separate runner to start.",
          uk: "Він постачається з @playwright/test — власним раннером з паралелізмом, фікстурами, вбудованими перевірками та потужним тулінгом (Trace Viewer, codegen, UI mode).",
        },
      ],
    },
    {
      id: "install",
      title: {
        en: "Install in a new project",
        uk: "Встановлення в новий проєкт",
      },
      paragraphs: [
        {
          en: "The recommended way to bootstrap is the official init command. It scaffolds playwright.config.ts, an example test, GitHub Actions workflow and installs browser binaries.",
          uk: "Рекомендований спосіб старту — офіційна init-команда. Вона створює playwright.config.ts, приклад тесту, GitHub Actions workflow і встановлює браузери (Chromium, Firefox, WebKit).",
        },
      ],
      codeBlocks: [
        {
          id: "init",
          language: "bash",
          code: "npm init playwright@latest\n# or\npnpm create playwright",
        },
        {
          id: "first-test",
          language: "ts",
          code: `import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/')
  await expect(page).toHaveTitle(/Playwright/)
})`,
        },
      ],
    },
    {
      id: "run",
      title: { en: "Run your tests", uk: "Запуск тестів" },
      paragraphs: [
        {
          en: "Tests are launched with `npx playwright test`. By default Playwright runs every project from the config in parallel; pass --headed to see the browser, --debug to step through, --ui to open the watch-mode UI runner.",
          uk: "Тести запускаються командою `npx playwright test`. Playwright за замовчуванням виконує всі проєкти з конфігу паралельно; --headed показує браузер, --debug дозволяє пройти крок за кроком, --ui відкриває інтерактивний раннер.",
        },
      ],
      codeBlocks: [
        {
          id: "run-cmds",
          language: "bash",
          code: "npx playwright test\nnpx playwright test --headed\nnpx playwright test --ui\nnpx playwright show-report",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Which browsers does Playwright support out of the box?",
        uk: "Які браузери Playwright підтримує «з коробки»?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Chromium only",
            uk: "Лише Chromium",
          },
        },
        {
          id: "b",
          label: {
            en: "Chromium, Firefox and WebKit",
            uk: "Chromium, Firefox і WebKit",
          },
        },
        {
          id: "c",
          label: {
            en: "Internet Explorer and Edge Legacy",
            uk: "Internet Explorer і Edge Legacy",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A single Playwright API drives three engines: Chromium (Chrome/Edge), Firefox and WebKit (Safari). Legacy browsers like IE are not supported.",
        uk: "Один Playwright API керує трьома рушіями: Chromium (Chrome/Edge), Firefox і WebKit (Safari). Застарілі браузери на кшталт IE не підтримуються.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Which package contains the Playwright test runner?",
        uk: "Який пакет містить test runner Playwright?",
      },
      options: [
        { id: "a", label: { en: "playwright", uk: "playwright" } },
        { id: "b", label: { en: "@playwright/test", uk: "@playwright/test" } },
        { id: "c", label: { en: "jest-playwright", uk: "jest-playwright" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "@playwright/test is the official runner with fixtures, parallelism and web-first expect assertions. The plain `playwright` package only exposes the library API.",
        uk: "@playwright/test — це офіційний раннер з фікстурами, паралелізмом і вбудованими перевірками expect. Пакет `playwright` без `/test` дає лише бібліотечний API.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Which command scaffolds a new Playwright project (config, example test, CI workflow)?",
        uk: "Яка команда створює новий проєкт Playwright (конфіг, приклад тесту, CI workflow)?",
      },
      options: [
        {
          id: "a",
          label: { en: "npm install playwright", uk: "npm install playwright" },
        },
        {
          id: "b",
          label: { en: "npx playwright test", uk: "npx playwright test" },
        },
        {
          id: "c",
          label: {
            en: "npm init playwright@latest",
            uk: "npm init playwright@latest",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`npm init playwright@latest` runs the official initializer which creates playwright.config.ts, an example spec, a GitHub Actions workflow and installs browsers. Plain install does not scaffold anything.",
        uk: "`npm init playwright@latest` запускає офіційний ініціалізатор: створює playwright.config.ts, приклад спеки, GitHub Actions workflow і встановлює браузери. Звичайний install нічого не скаффолдить.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you open Playwright’s interactive UI mode runner?",
        uk: "Як відкрити інтерактивний UI mode раннер Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright test --ui",
            uk: "npx playwright test --ui",
          },
        },
        {
          id: "b",
          label: { en: "npx playwright open", uk: "npx playwright open" },
        },
        {
          id: "c",
          label: {
            en: "npx playwright show-trace",
            uk: "npx playwright show-trace",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "The flag --ui launches the time-travelling watch-mode UI. `open` starts a recorder browser session; `show-trace` opens a previously recorded trace.",
        uk: "Прапорець --ui запускає UI-режим з машиною часу та watch-режимом. `open` відкриває браузер для запису, `show-trace` — переглядач збереженого трейсу.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What is the difference between the `playwright` npm package and `@playwright/test`?",
        uk: "У чому різниця між пакетом `playwright` і `@playwright/test`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are identical — just two names for the same package.",
            uk: "Вони однакові — просто два імені для одного пакету.",
          },
        },
        {
          id: "b",
          label: {
            en: "`playwright` is the browser-control library; `@playwright/test` adds the test runner, fixtures, assertions and tooling on top.",
            uk: "`playwright` — це бібліотека керування браузером; `@playwright/test` додає test runner, фікстури, ассерції та тулінг поверх неї.",
          },
        },
        {
          id: "c",
          label: {
            en: "`@playwright/test` is only for TypeScript projects; `playwright` works with JavaScript.",
            uk: "`@playwright/test` лише для TypeScript проєктів; `playwright` — для JavaScript.",
          },
        },
        {
          id: "d",
          label: {
            en: "`playwright` includes the test runner; `@playwright/test` is just a type-definitions package.",
            uk: "`playwright` містить test runner; `@playwright/test` — лише пакет з типами.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The plain `playwright` package exposes only the browser automation API (launching browsers, creating pages). `@playwright/test` builds on top of it to provide the full test runner experience: parallelism, fixtures, web-first expect assertions, Trace Viewer, UI mode and codegen. You need `@playwright/test` to write `test()` blocks.",
        uk: "Пакет `playwright` надає лише API для автоматизації браузера (запуск браузерів, створення сторінок). `@playwright/test` будується поверх нього і дає повний досвід test runner-а: паралелізм, фікстури, web-first ассерції, Trace Viewer, UI mode і codegen. Для написання блоків `test()` потрібен `@playwright/test`.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What is the default browser mode when you run `npx playwright test`?",
        uk: "Який режим браузера використовується за замовчуванням при запуску `npx playwright test`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Headed — tests open a visible browser window.",
            uk: "Headed — тести відкривають видиме вікно браузера.",
          },
        },
        {
          id: "b",
          label: {
            en: "Headless — the browser runs without a visible window.",
            uk: "Headless — браузер запускається без видимого вікна.",
          },
        },
        {
          id: "c",
          label: {
            en: "UI mode — the test runner GUI opens automatically.",
            uk: "UI mode — GUI test runner відкривається автоматично.",
          },
        },
        {
          id: "d",
          label: {
            en: "Debug mode — the Playwright Inspector launches with each test.",
            uk: "Debug mode — Playwright Inspector запускається з кожним тестом.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By default Playwright runs tests headless — the browser executes in the background with no visible window. This is fast and suitable for CI. Add `--headed` to see the browser, `--ui` to open the watch-mode UI, or `--debug` to step through with the Inspector.",
        uk: "За замовчуванням Playwright запускає тести в headless-режимі — браузер виконується у фоні без видимого вікна. Це швидко і підходить для CI. Додай `--headed` щоб побачити браузер, `--ui` для watch-mode UI або `--debug` для покрокового дебагу через Inspector.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What is the Playwright Trace Viewer used for?",
        uk: "Для чого використовується Playwright Trace Viewer?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It generates test code automatically by recording browser interactions.",
            uk: "Він автоматично генерує код тестів записуючи взаємодії з браузером.",
          },
        },
        {
          id: "b",
          label: {
            en: "It displays network request logs from the server side.",
            uk: "Він відображає логи мережевих запитів з боку сервера.",
          },
        },
        {
          id: "c",
          label: {
            en: "It lets you inspect a recorded test execution step by step — screenshots, DOM snapshots, network and console at each action.",
            uk: "Він дозволяє переглядати записане виконання тесту крок за кроком — скріншоти, DOM-снапшоти, мережу і консоль на кожній дії.",
          },
        },
        {
          id: "d",
          label: {
            en: "It runs tests in parallel and traces their execution time.",
            uk: "Він запускає тести паралельно і відстежує час їх виконання.",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The Trace Viewer is a post-run debugging tool. It replays a recorded trace file that captures screenshots, DOM snapshots, network requests and console logs at every test action. You can time-travel through the test execution to understand exactly what happened. Code generation is a separate tool called codegen.",
        uk: "Trace Viewer — це інструмент дебагу після запуску. Він відтворює записаний файл трейсу що містить скріншоти, DOM-снапшоти, мережеві запити і логи консолі на кожній дії тесту. Можна переміщатися у часі по виконанню тесту щоб зрозуміти що саме сталося. Генерація коду — це окремий інструмент під назвою codegen.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What is `playwright.config.ts` primarily used for?",
        uk: "Для чого в першу чергу призначений `playwright.config.ts`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It stores test data and fixtures used across spec files.",
            uk: "Він зберігає тестові дані та фікстури що використовуються в spec файлах.",
          },
        },
        {
          id: "b",
          label: {
            en: "It configures test projects (browsers), base URL, timeouts, reporter, retries and shared `use` options for all tests.",
            uk: "Він налаштовує тестові проєкти (браузери), base URL, таймаути, репортер, ретраї та спільні опції `use` для всіх тестів.",
          },
        },
        {
          id: "c",
          label: {
            en: "It declares which test files exist so Playwright knows where to look.",
            uk: "Він оголошує які spec файли існують щоб Playwright знав де шукати.",
          },
        },
        {
          id: "d",
          label: {
            en: "It is a TypeScript compiler config for the test project.",
            uk: "Це конфіг TypeScript компілятора для тестового проєкту.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "playwright.config.ts is the central configuration file for the test suite. It defines projects (which browsers/devices to run), the base URL so tests can use relative paths, global timeouts, retry counts, which reporter to use, and shared `use` options like `headless`, `screenshot`, `video` and `trace` settings. The `npm init playwright@latest` command creates it automatically.",
        uk: "playwright.config.ts — це центральний файл конфігурації для тест-сьюту. Він визначає проєкти (які браузери/пристрої запускати), base URL щоб тести могли використовувати відносні шляхи, глобальні таймаути, кількість ретраїв, який репортер використовувати, та спільні опції `use` як `headless`, `screenshot`, `video` і `trace`. Команда `npm init playwright@latest` створює його автоматично.",
      },
    },
  ],
}
