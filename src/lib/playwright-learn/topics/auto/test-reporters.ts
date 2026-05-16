import type { PlaywrightTopic } from "../../types"

export const testReportersTopic: PlaywrightTopic = {
  slug: "test-reporters",
  groupId: "test-runner",
  order: 360,
  level: "intermediate",
  trackOrder: 9,
  sourceDoc: "test-reporters-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-reporters",
  title: {
    en: "Reporters",
    uk: "Репортери",
  },
  summary: {
    en: "My CI config always uses two reporters simultaneously: 'dot' for terminal output (quiet, one char per test) and 'blob' when sharding for later merging. Locally I use 'html' so failures open automatically in the browser with traces attached. The 'github' reporter adds inline annotations to PR diffs — worth adding if the team reviews failures directly in GitHub.",
    uk: "Мій CI-конфіг завжди використовує два репортери одночасно: 'dot' для термінального виводу (тихий, один символ на тест) і 'blob' при шардингу для подальшого злиття. Локально використовую 'html' щоб падіння відкривалися автоматично в браузері з прикріпленими трейсами. Репортер 'github' додає вбудовані анотації до PR-дифів — варто додати якщо команда переглядає падіння прямо в GitHub.",
  },
  sections: [
    {
      id: "choosing-reporters",
      title: {
        en: "Which reporter to use and when",
        uk: "Який репортер вибрати і коли",
      },
      diagram: {
        mermaid: `flowchart TD
  TR["Test run"] --> L["list / dot / line\nterminal output"]
  TR --> H["html\nstatic report site"]
  TR --> B["blob\nCI shard artifact"]
  TR --> G["github\nPR annotations"]
  TR --> J["json / junit\nmachine-readable"]
  B -->|"npx playwright merge-reports"| H`,
        caption: {
          en: "Reporters can be combined; use blob on sharded CI runs and merge-reports to produce one HTML report from all shards",
          uk: "Репортери можна комбінувати; використовуйте blob при шардингу і merge-reports для об'єднання в один HTML-звіт",
        },
      },
      paragraphs: [
        {
          en: "The default is `list` locally and `dot` on CI. I usually override CI to use `dot` explicitly to avoid the verbose list output. You can combine reporters — the config takes an array, so I get terminal output AND a file simultaneously.",
          uk: "За замовчуванням — `list` локально і `dot` на CI. Зазвичай явно перевизначаю CI на `dot` щоб уникнути деталізованого list-виводу. Можна комбінувати репортери — конфіг приймає масив, тому отримую термінальний вивід І файл одночасно.",
        },
      ],
      codeBlocks: [
        {
          id: "multiple-reporters",
          language: "ts",
          code: `// playwright.config.ts — два репортери одночасно
export default defineConfig({
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
  ],
})`,
        },
        {
          id: "ci-vs-local",
          language: "ts",
          code: `// playwright.config.ts — різні репортери для CI і локально
export default defineConfig({
  reporter: process.env.CI ? 'dot' : 'list',
})`,
        },
      ],
    },
    {
      id: "terminal-reporters",
      title: {
        en: "Terminal reporters — list, line, dot",
        uk: "Термінальні репортери — list, line, dot",
      },
      paragraphs: [
        {
          en: "`list` — one line per test, shows time. Good for local runs with <100 tests. `line` — one line for the last running test, updates in place. Good for large suites where you just want to see progress. `dot` — one character per test. `·` = pass, `F` = fail, `×` = fail+retry pending, `±` = flaky (passed after retry). I use dot on CI to keep logs readable.",
          uk: "`list` — один рядок на тест, показує час. Добре для локальних запусків з <100 тестів. `line` — один рядок для останнього запущеного тесту, оновлюється на місці. Добре для великих наборів де хочеш тільки бачити прогрес. `dot` — один символ на тест. `·` = пройдено, `F` = впало, `×` = впало+очікує повтору, `±` = нестабільний (пройшов після повтору). Використовую dot на CI щоб логи залишалися читабельними.",
        },
      ],
      codeBlocks: [
        {
          id: "dot-output-example",
          language: "bash",
          code: `npx playwright test --reporter=dot
Running 124 tests using 6 workers
······F·············±···T···········`,
        },
      ],
    },
    {
      id: "html-reporter",
      title: {
        en: "HTML reporter — the one I use for debugging",
        uk: "HTML-репортер — той що я використовую для дебагу",
      },
      paragraphs: [
        {
          en: "The HTML report is a self-contained web page with all test results, traces, screenshots, and videos. By default it opens automatically when tests fail. I set `open: 'never'` on CI (no browser to open) and `open: 'on-failure'` locally.",
          uk: "HTML-звіт — це самодостатня вебсторінка з усіма результатами тестів, трейсами, скриншотами і відео. За замовчуванням відкривається автоматично коли тести падають. Встановлюю `open: 'never'` на CI (немає браузера щоб відкрити) і `open: 'on-failure'` локально.",
        },
        {
          en: "To view the last report: `npx playwright show-report`. To view a downloaded CI artifact zip: `npx playwright show-report playwright-report.zip`.",
          uk: "Щоб переглянути останній звіт: `npx playwright show-report`. Щоб переглянути скачаний CI-артефакт zip: `npx playwright show-report playwright-report.zip`.",
        },
      ],
      codeBlocks: [
        {
          id: "html-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  reporter: [
    ['html', {
      open: process.env.CI ? 'never' : 'on-failure',
      outputFolder: 'playwright-report',
    }],
  ],
})`,
        },
        {
          id: "show-report",
          language: "bash",
          code: `# Відкрити останній звіт
npx playwright show-report

# Відкрити конкретну теку
npx playwright show-report my-report

# Відкрити zip з CI артефакту
npx playwright show-report playwright-report.zip`,
        },
      ],
    },
    {
      id: "blob-reporter",
      title: {
        en: "Blob reporter — for sharded CI runs",
        uk: "Blob-репортер — для шардованих CI-запусків",
      },
      paragraphs: [
        {
          en: "The blob reporter saves raw test data (results, traces, screenshots) to a zip file. Its entire purpose is sharding: each shard produces a blob, you download all blobs, then merge them into one HTML report. Without blob you'd have 4 separate HTML reports with no way to combine them.",
          uk: "Blob-репортер зберігає сирі дані тестів (результати, трейси, скриншоти) у zip-файл. Весь його сенс — шардинг: кожен шард виробляє blob, ти скачуєш всі blob, потім зливаєш їх в один HTML-звіт. Без blob у тебе було б 4 окремих HTML-звіти без способу їх об'єднати.",
        },
      ],
      codeBlocks: [
        {
          id: "blob-config",
          language: "ts",
          code: `// playwright.config.ts — blob для CI (шардованих запусків)
export default defineConfig({
  reporter: process.env.CI ? 'blob' : 'html',
})`,
        },
        {
          id: "blob-merge",
          language: "bash",
          code: `# Після скачування всіх blob-артефактів в ./all-blob-reports
npx playwright merge-reports --reporter html ./all-blob-reports`,
        },
      ],
    },
    {
      id: "ci-integrations",
      title: {
        en: "CI integrations — GitHub annotations, JUnit for Azure",
        uk: "CI-інтеграції — GitHub-анотації, JUnit для Azure",
      },
      paragraphs: [
        {
          en: "The `github` reporter adds failure annotations directly to the PR diff — clicking on a failure in the GitHub Actions summary takes you to the failing line of code. I combine it with `dot` so I get both annotation and terminal output.",
          uk: "Репортер `github` додає анотації про падіння прямо до PR-дифу — клік на падіння в зведенні GitHub Actions переводить до рядка коду що впав. Комбінуї його з `dot` щоб отримати і анотацію і термінальний вивід.",
        },
        {
          en: "JUnit reporter produces XML output that Azure DevOps, Jenkins, and similar tools can import into their test dashboards. I use it when the team wants to see trend data in their CI tool rather than opening the Playwright HTML report.",
          uk: "JUnit-репортер виробляє XML-вивід який Azure DevOps, Jenkins та подібні інструменти можуть імпортувати у свої тест-дашборди. Використовую його коли команда хоче бачити дані тренду у своєму CI-інструменті а не відкривати HTML-звіт Playwright.",
        },
      ],
      codeBlocks: [
        {
          id: "github-reporter",
          language: "ts",
          code: `// playwright.config.ts — GitHub-анотації + термінальний вивід
export default defineConfig({
  reporter: process.env.CI
    ? [['github'], ['dot']]
    : 'list',
})`,
        },
        {
          id: "junit-reporter",
          language: "ts",
          code: `// playwright.config.ts — JUnit для Azure DevOps / Jenkins
export default defineConfig({
  reporter: [
    ['junit', { outputFile: 'test-results/e2e-junit-results.xml' }],
    ['dot'],
  ],
})`,
        },
      ],
    },
    {
      id: "custom-reporter",
      title: {
        en: "Custom reporters",
        uk: "Власні репортери",
      },
      paragraphs: [
        {
          en: "When built-in reporters aren't enough — for example when I need to post test results to Slack or write to a custom database — I implement the `Reporter` interface. The key methods are `onTestEnd` (called after every test) and `onEnd` (called when the run finishes).",
          uk: "Коли вбудованих репортерів недостатньо — наприклад коли потрібно відправити результати тестів у Slack або записати в кастомну базу даних — реалізую інтерфейс `Reporter`. Ключові методи: `onTestEnd` (викликається після кожного тесту) і `onEnd` (викликається коли запуск завершується).",
        },
      ],
      codeBlocks: [
        {
          id: "custom-reporter-impl",
          language: "ts",
          code: `// my-reporter.ts
import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter'

class MyReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed') {
      console.log(\`FAIL: \${test.title} — \${result.error?.message}\`)
    }
  }

  onEnd(result: FullResult) {
    console.log(\`Run finished: \${result.status}\`)
  }
}

export default MyReporter`,
        },
        {
          id: "custom-reporter-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  reporter: ['./my-reporter.ts'],
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You're running tests with 4 shards on GitHub Actions. Each shard finishes and you want one combined HTML report. Which reporter setup achieves this?",
        uk: "Ти запускаєш тести з 4 шардами на GitHub Actions. Кожен шард завершується і ти хочеш один об'єднаний HTML-звіт. Яке налаштування репортера досягає цього?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use reporter: 'html' on all shards and merge the playwright-report folders manually",
            uk: "Використовувати reporter: 'html' на всіх шардах і зливати теки playwright-report вручну",
          },
        },
        {
          id: "b",
          label: {
            en: "Use reporter: 'blob' on CI, upload each shard's blob-report artifact, then run npx playwright merge-reports in a final job",
            uk: "Використовувати reporter: 'blob' на CI, завантажувати артефакт blob-report кожного шарду, потім запускати npx playwright merge-reports у фінальному job",
          },
        },
        {
          id: "c",
          label: {
            en: "Use reporter: 'json' and write a custom script to combine the JSON files",
            uk: "Використовувати reporter: 'json' і написати кастомний скрипт для об'єднання JSON-файлів",
          },
        },
        {
          id: "d",
          label: {
            en: "Use reporter: 'list' — it automatically aggregates shard results to stdout",
            uk: "Використовувати reporter: 'list' — він автоматично агрегує результати шардів у stdout",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "HTML reports can't be merged — they're static sites that reference their own data directories. The blob reporter produces structured zip files that contain all test data including traces and attachments. The `merge-reports` command knows how to combine them into a single coherent HTML report. This is exactly what the blob reporter was designed for. Combining JSON manually works but loses traces and visual diff data.",
        uk: "HTML-звіти не можна злити — це статичні сайти що посилаються на власні каталоги з даними. Blob-репортер виробляє структуровані zip-файли що містять всі дані тестів включаючи трейси і вкладення. Команда `merge-reports` знає як об'єднати їх в один цільний HTML-звіт. Саме для цього і призначений blob-репортер. Об'єднання JSON вручну працює але втрачає трейси і дані visual diff.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "In the dot reporter output `··F·±·×`, what does `±` mean?",
        uk: "У виводі dot-репортера `··F·±·×`, що означає `±`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Test was skipped due to a test.skip() annotation",
            uk: "Тест пропущений через анотацію test.skip()",
          },
        },
        {
          id: "b",
          label: {
            en: "Test is flaky — it failed at least once but passed on a retry",
            uk: "Тест нестабільний (flaky) — він впав хоча б один раз але пройшов при повторі",
          },
        },
        {
          id: "c",
          label: {
            en: "Test timed out and was marked as a partial pass",
            uk: "Тест перевищив тайм-аут і позначений як частковий прохід",
          },
        },
        {
          id: "d",
          label: {
            en: "Test passed with warnings about deprecated API usage",
            uk: "Тест пройшов з попередженнями про використання застарілого API",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "In the dot reporter: `·` = passed on first attempt, `F` = failed (all retries exhausted), `×` = failed and a retry is still pending or in progress, `±` = flaky (failed initially but passed on a subsequent retry). Tracking flaky tests is important — `±` tells you which tests are passing inconsistently. A test that's `±` in CI may be hiding a real intermittent bug or a race condition worth fixing even though it's not blocking the build.",
        uk: "У dot-репортері: `·` = пройшов з першої спроби, `F` = впав (всі повтори вичерпані), `×` = впав і повтор ще очікує або виконується, `±` = нестабільний (спочатку впав але пройшов при наступному повторі). Відстеження нестабільних тестів важливе — `±` показує які тести проходять непослідовно. Тест з `±` на CI може приховувати справжній переривчастий баг або race condition варто виправити навіть якщо він не блокує збірку.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "You configure `reporter: [['html', { open: 'on-failure' }]]` locally. On CI, the HTML report should generate but never auto-open a browser. What's the standard way to handle this?",
        uk: "Ти налаштовуєш `reporter: [['html', { open: 'on-failure' }]]` локально. На CI HTML-звіт має генеруватися але ніколи не відкривати браузер автоматично. Який стандартний спосіб це вирішити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use DISPLAY=:0 on CI to suppress browser windows",
            uk: "Використовуй DISPLAY=:0 на CI щоб приховати вікна браузера",
          },
        },
        {
          id: "b",
          label: {
            en: "Set open: process.env.CI ? 'never' : 'on-failure' in the HTML reporter config",
            uk: "Встановити open: process.env.CI ? 'never' : 'on-failure' у конфігурації HTML-репортера",
          },
        },
        {
          id: "c",
          label: {
            en: "Use a separate playwright.ci.config.ts file that omits the HTML reporter",
            uk: "Використовуй окремий файл playwright.ci.config.ts що не включає HTML-репортер",
          },
        },
        {
          id: "d",
          label: {
            en: "HTML reporter never opens a browser on CI automatically — no config needed",
            uk: "HTML-репортер ніколи не відкриває браузер на CI автоматично — конфігурація не потрібна",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `open` option controls when the HTML report auto-opens: `'always'`, `'on-failure'`, or `'never'`. `process.env.CI` is set to `'true'` by GitHub Actions, CircleCI, Jenkins, and most other CI platforms — so `process.env.CI ? 'never' : 'on-failure'` is the standard pattern. Without setting `'never'` on CI, Playwright tries to launch a browser to display the report, which fails on headless CI environments and blocks the job.",
        uk: "Опція `open` контролює коли HTML-звіт відкривається автоматично: `'always'`, `'on-failure'` або `'never'`. `process.env.CI` встановлюється в `'true'` GitHub Actions, CircleCI, Jenkins та більшістю інших CI-платформ — тому `process.env.CI ? 'never' : 'on-failure'` є стандартним шаблоном. Без встановлення `'never'` на CI, Playwright намагається запустити браузер для відображення звіту що провалюється в headless CI-середовищах і блокує задачу.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you configure two reporters to run simultaneously — list output in the terminal AND a JSON file?",
        uk: "Як налаштувати два репортери щоб виконувалися одночасно — список у терміналі І JSON-файл?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set reporter twice: reporter: 'list' and then reporter: 'json' — the second overrides the first",
            uk: "Встановити reporter двічі: reporter: 'list' і потім reporter: 'json' — другий перевизначає перший",
          },
        },
        {
          id: "b",
          label: {
            en: "Use an array: reporter: [['list'], ['json', { outputFile: 'results.json' }]]",
            uk: "Використовуй масив: reporter: [['list'], ['json', { outputFile: 'results.json' }]]",
          },
        },
        {
          id: "c",
          label: {
            en: "Use reporter: 'list,json' — comma-separated string",
            uk: "Використовуй reporter: 'list,json' — рядок через кому",
          },
        },
        {
          id: "d",
          label: {
            en: "Reporters can't run simultaneously — pick one per run",
            uk: "Репортери не можуть виконуватися одночасно — вибирай один на запуск",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `reporter` option accepts either a string shorthand (single reporter) or an array of tuples for multiple simultaneous reporters. Each tuple is `['reporter-name', { ...options }]`. This is how you get terminal output AND a file at the same time. Common CI setup: `[['dot'], ['blob']]` for quiet terminal output plus a shard-mergeable artifact, or `[['github'], ['dot']]` for PR annotations plus terminal.",
        uk: "Опція `reporter` приймає або скорочений рядок (один репортер) або масив кортежів для кількох одночасних репортерів. Кожен кортеж — `['reporter-name', { ...options }]`. Ось як отримати термінальний вивід І файл одночасно. Поширене налаштування CI: `[['dot'], ['blob']]` для тихого термінального виводу плюс артефакт що зливається з шардів, або `[['github'], ['dot']]` для PR-анотацій плюс термінал.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does the 'github' reporter add on GitHub Actions?",
        uk: "Що додає репортер 'github' на GitHub Actions?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Uploads test results to GitHub's testing API for the PR Checks status",
            uk: "Завантажує результати тестів у тестовий API GitHub для статусу PR Checks",
          },
        },
        {
          id: "b",
          label: {
            en: "Adds inline failure annotations directly to the PR diff — clicking a failure in the Actions summary shows the failing line of code",
            uk: "Додає вбудовані анотації про падіння прямо до PR-дифу — клік на падіння в зведенні Actions показує рядок коду що впав",
          },
        },
        {
          id: "c",
          label: {
            en: "Creates a GitHub issue for each test failure automatically",
            uk: "Автоматично створює GitHub issue для кожного падіння тесту",
          },
        },
        {
          id: "d",
          label: {
            en: "Posts a comment on the PR with the full test results table",
            uk: "Публікує коментар до PR з повною таблицею результатів тестів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `github` reporter uses GitHub Actions' workflow commands to emit annotation messages. When a test fails, it outputs a `::error file=...,line=...,col=...::message` command that GitHub Actions renders as inline annotations in the PR diff. Team members reviewing the PR can see exactly which file and line caused the failure without opening a separate report. Combine it with `dot` to keep terminal output quiet: `reporter: [['github'], ['dot']]`.",
        uk: "Репортер `github` використовує workflow-команди GitHub Actions для виведення повідомлень-анотацій. Коли тест падає — виводиться команда `::error file=...,line=...,col=...::message` яку GitHub Actions рендерить як вбудовані анотації в PR-дифі. Члени команди що переглядають PR можуть бачити точно який файл і рядок спричинив падіння без відкриття окремого звіту. Комбінуй з `dot` щоб термінальний вивід залишався тихим: `reporter: [['github'], ['dot']]`.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Your CI platform is Azure DevOps and the team wants failures to appear in the Azure Test Plans dashboard. Which reporter produces the right format?",
        uk: "Ваша CI-платформа — Azure DevOps і команда хоче щоб падіння відображалися в дашборді Azure Test Plans. Який репортер виробляє правильний формат?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "html — Azure DevOps can render Playwright HTML reports natively",
            uk: "html — Azure DevOps може рендерити HTML-звіти Playwright нативно",
          },
        },
        {
          id: "b",
          label: {
            en: "junit — produces XML that Azure DevOps, Jenkins, and similar tools import into their test dashboards",
            uk: "junit — виробляє XML який Azure DevOps, Jenkins та подібні інструменти імпортують у свої тест-дашборди",
          },
        },
        {
          id: "c",
          label: {
            en: "azure — the dedicated Playwright reporter for Azure DevOps integration",
            uk: "azure — спеціальний Playwright-репортер для інтеграції з Azure DevOps",
          },
        },
        {
          id: "d",
          label: {
            en: "json — Azure DevOps has a built-in JSON test result parser",
            uk: "json — Azure DevOps має вбудований парсер результатів тестів у JSON",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The JUnit reporter produces XML in the JUnit test result format — a de facto standard that Azure DevOps, Jenkins, CircleCI, TeamCity, and many other CI tools understand natively. Configure it with an `outputFile` path and point your CI tool at that file to get test trend data, failure history, and dashboard integration. There is no built-in `azure` reporter in Playwright — JUnit is the standard interface for CI platform dashboards.",
        uk: "JUnit-репортер виробляє XML у форматі результатів тестів JUnit — де-факто стандарт який Azure DevOps, Jenkins, CircleCI, TeamCity та багато інших CI-інструментів розуміють нативно. Налаштуй його з шляхом `outputFile` і вкажи своєму CI-інструменту на цей файл щоб отримати дані тренду тестів, історію падінь і інтеграцію з дашбордом. У Playwright немає вбудованого репортера `azure` — JUnit є стандартним інтерфейсом для дашбордів CI-платформ.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You need to post a Slack message with failure details after each test. Which Reporter interface method should you implement?",
        uk: "Потрібно надсилати Slack-повідомлення з деталями падіння після кожного тесту. Який метод інтерфейсу Reporter слід реалізувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "onEnd(result) — called once after the entire run finishes",
            uk: "onEnd(result) — викликається один раз після завершення всього запуску",
          },
        },
        {
          id: "b",
          label: {
            en: "onTestEnd(test, result) — called after every individual test with its result",
            uk: "onTestEnd(test, result) — викликається після кожного окремого тесту з його результатом",
          },
        },
        {
          id: "c",
          label: {
            en: "onStepEnd(test, result, step) — called after each step within a test",
            uk: "onStepEnd(test, result, step) — викликається після кожного кроку всередині тесту",
          },
        },
        {
          id: "d",
          label: {
            en: "onError(error) — called when any test throws an error",
            uk: "onError(error) — викликається коли будь-який тест кидає помилку",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`onTestEnd(test: TestCase, result: TestResult)` is called after every individual test completes. The `result.status` tells you whether it passed, failed, timed out, or was skipped. `result.error` contains the failure message. This is the right hook for per-test notifications like Slack messages. `onEnd` is better for sending a summary after the entire run. `onStepEnd` is for detailed step-level tracking, not test outcomes.",
        uk: "`onTestEnd(test: TestCase, result: TestResult)` викликається після завершення кожного окремого тесту. `result.status` повідомляє чи він пройшов, впав, перевищив тайм-аут або пропущений. `result.error` містить повідомлення про падіння. Це правильний хук для сповіщень для кожного тесту як Slack-повідомлення. `onEnd` краще для надсилання зведення після всього запуску. `onStepEnd` для детального відстеження на рівні кроків, не для результатів тестів.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You downloaded a playwright-report.zip artifact from a failed CI run. How do you view it?",
        uk: "Ти скачав артефакт playwright-report.zip з невдалого CI-запуску. Як переглянути його?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Unzip it and open index.html directly in a browser",
            uk: "Розпакуй і відкрий index.html напряму в браузері",
          },
        },
        {
          id: "b",
          label: {
            en: "Run npx playwright show-report playwright-report.zip — it serves the report on a local port",
            uk: "Запусти npx playwright show-report playwright-report.zip — він роздає звіт на локальному порту",
          },
        },
        {
          id: "c",
          label: {
            en: "Upload it to trace.playwright.dev for remote viewing",
            uk: "Завантаж його на trace.playwright.dev для перегляду онлайн",
          },
        },
        {
          id: "d",
          label: {
            en: "Run npx playwright extract-report playwright-report.zip first, then use show-report",
            uk: "Спочатку запусти npx playwright extract-report playwright-report.zip, потім використовуй show-report",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`npx playwright show-report` accepts a path to either a directory or a `.zip` file. It starts a local web server and opens the report in your default browser. Opening `index.html` directly from an unzipped directory doesn't work because the HTML report uses relative paths that require a server to resolve correctly — many assets and trace data won't load when opened via `file://` protocol. `trace.playwright.dev` is for individual trace files, not full HTML reports.",
        uk: "`npx playwright show-report` приймає шлях до теки або `.zip`-файлу. Він запускає локальний веб-сервер і відкриває звіт у твоєму браузері за замовчуванням. Відкриття `index.html` напряму з розпакованої теки не працює тому що HTML-звіт використовує відносні шляхи що вимагають сервер для правильного розрішення — багато ресурсів і даних трейсів не завантажаться при відкритті через протокол `file://`. `trace.playwright.dev` призначений для окремих файлів трейсів, не для повних HTML-звітів.",
      },
    },
  ],
}
