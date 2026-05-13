import type { PlaywrightTopic } from "../types"

export const runningTestsTopic: PlaywrightTopic = {
  slug: "running-tests",
  groupId: "running-tests",
  order: 30,
  level: "beginner",
  trackOrder: 11,
  sourceDoc: "running-tests-js.md",
  officialDocsUrl: "https://playwright.dev/docs/running-tests",
  title: {
    en: "Running and debugging tests",
    uk: "Запуск та налагодження тестів",
  },
  summary: {
    en: "CLI flags, UI mode, debugging with --debug, headed runs, filtering by name/file/tag.",
    uk: "CLI-прапорці, UI mode, дебаг через --debug, headed-режим, фільтрація по імені/файлу/тегу.",
  },
  sections: [
    {
      id: "cli",
      title: { en: "The test CLI", uk: "Test CLI" },
      paragraphs: [
        {
          en: "`npx playwright test` runs every project from playwright.config.ts in parallel headless mode. The CLI is the single entry point: you filter, pick projects, choose reporters and debug from it.",
          uk: "`npx playwright test` запускає всі проєкти з playwright.config.ts паралельно в headless. CLI — єдиний вхід: тут і фільтрація, і вибір проєктів, і репортери, і дебаг.",
        },
      ],
      codeBlocks: [
        {
          id: "cli-examples",
          language: "bash",
          code: `# run every test
npx playwright test

# only a file or pattern
npx playwright test tests/auth.spec.ts
npx playwright test --grep "@smoke"

# only one project from the config
npx playwright test --project=chromium

# headed + slow motion to watch the browser
npx playwright test --headed --workers=1`,
        },
      ],
    },
    {
      id: "ui-mode",
      title: { en: "UI mode", uk: "UI mode" },
      paragraphs: [
        {
          en: "UI mode (`--ui`) opens a dedicated app: filter tests, watch them re-run on file change, inspect locator picks, time-travel through the trace, view network and console. This is the most productive way to author and debug tests.",
          uk: "UI mode (`--ui`) відкриває окремий додаток: фільтрація, ре-ран при зміні файлів, перегляд локаторів, машина часу для трейсу, мережа і консоль. Це найзручніший спосіб писати та налагоджувати тести.",
        },
      ],
      codeBlocks: [
        {
          id: "ui",
          language: "bash",
          code: "npx playwright test --ui",
        },
      ],
    },
    {
      id: "debug",
      title: { en: "Debug a single test", uk: "Дебаг одного тесту" },
      paragraphs: [
        {
          en: "Use `--debug` to launch the Playwright Inspector and step through the spec. Combine with a grep to focus on one test. In code, `page.pause()` pauses execution at that point.",
          uk: "`--debug` запускає Playwright Inspector і дозволяє йти крок за кроком. Зручно комбінувати з grep’ом, щоб сфокусуватися на одному тесті. У коді `page.pause()` зупиняє виконання у цій точці.",
        },
      ],
      codeBlocks: [
        {
          id: "debug-examples",
          language: "bash",
          code: `npx playwright test --debug
npx playwright test auth.spec.ts --debug --grep "login"`,
        },
        {
          id: "pause",
          language: "ts",
          code: `test('drill into a step', async ({ page }) => {
  await page.goto('/login')
  await page.pause() // opens the Inspector
  await page.getByLabel('Email').fill('a@b.c')
})`,
        },
      ],
    },
    {
      id: "report",
      title: { en: "HTML report", uk: "HTML-звіт" },
      paragraphs: [
        {
          en: "After a run, open the HTML report to see steps, screenshots, video and trace per test. Failed tests link directly into the trace viewer.",
          uk: "Після прогону відкрий HTML-звіт — побачиш кроки, скріншоти, відео й трейс по кожному тесту. Невдалі тести лінкують одразу в trace viewer.",
        },
      ],
      codeBlocks: [
        {
          id: "report-cmd",
          language: "bash",
          code: "npx playwright show-report",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Which command runs only tests tagged with @smoke in their title?",
        uk: "Яка команда запустить тільки тести з тегом @smoke у назві?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright test --tag smoke",
            uk: "npx playwright test --tag smoke",
          },
        },
        {
          id: "b",
          label: {
            en: 'npx playwright test --grep "@smoke"',
            uk: 'npx playwright test --grep "@smoke"',
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright test smoke",
            uk: "npx playwright test smoke",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright filters by test title with `--grep` (regex). Conventionally we put @tag suffixes into test names and grep on them. There is no built-in `--tag` flag.",
        uk: "Playwright фільтрує по назві тесту через `--grep` (regex). Зазвичай у назву додають суфікс @tag і грепають по ньому. Прапора `--tag` у CLI немає.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What does `page.pause()` do inside a test?",
        uk: "Що робить `page.pause()` всередині тесту?",
      },
      options: [
        {
          id: "a",
          label: { en: "Sleeps for 30 seconds.", uk: "Спить 30 секунд." },
        },
        {
          id: "b",
          label: {
            en: "Pauses execution and opens the Playwright Inspector to step through.",
            uk: "Зупиняє виконання і відкриває Playwright Inspector для покрокового дебагу.",
          },
        },
        {
          id: "c",
          label: {
            en: "Aborts the suite immediately.",
            uk: "Негайно перериває весь сьют.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "page.pause() suspends the test and gives you the Inspector — locator pick, step-by-step, resume. It is the in-code equivalent of running with --debug.",
        uk: "page.pause() призупиняє тест і відкриває Inspector — вибір локатора, крокування, продовження. Це in-code еквівалент --debug.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Which command opens the HTML report from the last test run?",
        uk: "Яка команда відкриває HTML-звіт після останнього прогону?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright show-report",
            uk: "npx playwright show-report",
          },
        },
        {
          id: "b",
          label: { en: "npx playwright report", uk: "npx playwright report" },
        },
        {
          id: "c",
          label: {
            en: "npx playwright open-report",
            uk: "npx playwright open-report",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`show-report` serves the previously generated HTML report. There is no `report` or `open-report` subcommand in the CLI.",
        uk: "`show-report` обслуговує раніше згенерований HTML-звіт. Команд `report` або `open-report` у CLI немає.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you run tests only in the `chromium` project from the config?",
        uk: "Як запустити тести лише з проєкту `chromium` із конфігу?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright test --browser=chromium",
            uk: "npx playwright test --browser=chromium",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright test --project=chromium",
            uk: "npx playwright test --project=chromium",
          },
        },
        {
          id: "c",
          label: {
            en: "BROWSER=chromium npx playwright test",
            uk: "BROWSER=chromium npx playwright test",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Projects are configured in playwright.config.ts and selected with --project=<name>. There is no --browser flag in the test runner.",
        uk: "Проєкти задаються в playwright.config.ts і обираються через --project=<name>. Прапора --browser у раннері немає.",
      },
    },
  ],
}
