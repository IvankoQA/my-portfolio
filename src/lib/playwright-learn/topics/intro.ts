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
      paragraphs: [
        {
          en: "Playwright is an open-source end-to-end testing framework built and maintained by Microsoft. A single API drives Chromium (Chrome, Edge), Firefox and WebKit (Safari) across Windows, macOS, Linux, headless or headed, desktop or mobile emulation.",
          uk: "Playwright — це open-source фреймворк для end-to-end тестування від Microsoft. Один і той самий API керує Chromium (Chrome, Edge), Firefox і WebKit (Safari) на Windows, macOS, Linux у режимах headless/headed, на десктопі або з емуляцією мобільних пристроїв.",
        },
        {
          en: "It ships with @playwright/test — its own test runner with parallelism, fixtures, web-first assertions and rich tooling (Trace Viewer, codegen, UI mode). You do not need Jest, Mocha or a separate runner to start.",
          uk: "Він постачається з @playwright/test — власним раннером з паралелізмом, фікстурами, web-first ассерціями та потужним тулінгом (Trace Viewer, codegen, UI mode). Jest або Mocha для старту не потрібні.",
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
          uk: "Рекомендований спосіб старту — офіційна init-команда. Вона створює playwright.config.ts, приклад тесту, GitHub Actions workflow і встановлює бінарники браузерів.",
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
        uk: "@playwright/test — це офіційний раннер з фікстурами, паралелізмом і web-first ассерціями expect. Пакет `playwright` без `/test` дає лише бібліотечний API.",
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
  ],
}
