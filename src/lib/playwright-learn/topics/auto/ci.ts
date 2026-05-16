import type { PlaywrightTopic } from "../../types"

export const ciTopic: PlaywrightTopic = {
  slug: "ci",
  groupId: "ci",
  order: 140,
  level: "advanced",
  trackOrder: 7,
  sourceDoc: "ci.md",
  officialDocsUrl: "https://playwright.dev/docs/ci",
  title: {
    en: "Continuous Integration",
    uk: "Безперервна інтеграція (CI)",
  },
  summary: {
    en: "The pattern that works for me in every CI provider: install deps, install Playwright with --with-deps (that flag is the one everyone forgets), run tests with workers: 1 for stability, upload the report with if: !cancelled() so you actually get the artifact when tests fail. The rest is boilerplate.",
    uk: "Патерн який працює у мене в кожному CI-провайдері: встанови залежності, встанови Playwright з --with-deps (цей прапорець всі забувають), запускай тести з workers: 1 для стабільності, завантажуй звіт з if: !cancelled() щоб артефакт реально з'явився коли тести падають. Решта — бойлерплейт.",
  },
  sections: [
    {
      id: "three-steps",
      title: {
        en: "The three steps that actually matter",
        uk: "Три кроки що насправді важливі",
      },
      diagram: {
        mermaid: `flowchart LR
  A["npm ci\ninstall packages"] --> B["npx playwright install --with-deps\nbrowsers + OS libraries"]
  B --> C["npx playwright test\nrun tests"]
  C --> D["upload-artifact\nif: !cancelled()"]
  style B fill:#fff3cd,stroke:#ffc107`,
        caption: {
          en: "--with-deps installs OS-level browser libraries; without it the browser binary fails to launch with cryptic errors",
          uk: "--with-deps встановлює браузерні бібліотеки на рівні ОС; без нього браузер не запускається з незрозумілими помилками",
        },
      },
      paragraphs: [
        {
          en: "Every CI setup for Playwright boils down to the same three things. The `--with-deps` flag on step 2 is what trips people up most — it installs the OS-level browser dependencies (libglib, libnss, etc.) that the browser binary needs to actually launch. Without it you get 'Failed to launch browser' errors that look like a Playwright bug.",
          uk: "Кожне CI-налаштування для Playwright зводиться до трьох речей. Прапорець `--with-deps` на кроці 2 — те на чому найчастіше спотикаються: він встановлює браузерні залежності на рівні ОС (libglib, libnss тощо) які бінарному файлу браузера потрібні щоб запуститися. Без нього отримуєш помилки 'Failed to launch browser' що виглядають як баг Playwright.",
        },
      ],
      codeBlocks: [
        {
          id: "three-steps",
          language: "bash",
          code: `# Крок 1: встанови NPM-пакети
npm ci

# Крок 2: встанови браузери Playwright + системні залежності ОС
npx playwright install --with-deps

# Крок 3: запусти тести
npx playwright test`,
        },
      ],
    },
    {
      id: "workers-on-ci",
      title: {
        en: "Workers on CI — use 1, not the default",
        uk: "Воркери на CI — використовуй 1, не дефолт",
      },
      paragraphs: [
        {
          en: "By default Playwright uses all available CPU cores as workers. On a shared CI runner those cores are often virtual and shared with other jobs — running many workers in parallel leads to flaky tests from resource contention. I set `workers: 1` on CI. If you need speed, use sharding across multiple machines rather than workers on one.",
          uk: "За замовчуванням Playwright використовує всі доступні ядра CPU як воркери. На спільному CI-runner ці ядра часто віртуальні і поділяються з іншими job — запуск багатьох воркерів паралельно призводить до flaky-тестів через конкуренцію за ресурси. Я встановлюю `workers: 1` на CI. Якщо потрібна швидкість — використовуй шардинг між кількома машинами а не воркери на одній.",
        },
      ],
      codeBlocks: [
        {
          id: "workers-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 1 : undefined,
})`,
        },
      ],
    },
    {
      id: "github-actions",
      title: {
        en: "GitHub Actions — the config I actually use",
        uk: "GitHub Actions — конфіг який я реально використовую",
      },
      paragraphs: [
        {
          en: "The `if: ${{ !cancelled() }}` on the artifact upload is critical. When a test fails, the job is marked as failed — and by default any subsequent steps are skipped. Without this condition, you never get the HTML report when you need it most (when tests fail).",
          uk: "Умова `if: ${{ !cancelled() }}` на завантаженні артефакту — критична. Коли тест падає job позначається як невдалий — і за замовчуванням наступні кроки пропускаються. Без цієї умови ніколи не отримаєш HTML-звіт саме тоді коли він найбільш потрібен (коли тести падають).",
        },
        {
          en: "On deployment trigger: I use `github.event.deployment_status.state == 'success'` when testing against a preview URL. Vercel and similar platforms fire the `deployment_status` event and put the URL in `deployment_status.target_url` — I pass that as `PLAYWRIGHT_TEST_BASE_URL`.",
          uk: "На тригер деплою: я використовую `github.event.deployment_status.state == 'success'` коли тестую проти preview URL. Vercel і подібні платформи надсилають подію `deployment_status` і кладуть URL в `deployment_status.target_url` — передаю це як `PLAYWRIGHT_TEST_BASE_URL`.",
        },
      ],
      codeBlocks: [
        {
          id: "github-actions-basic",
          language: "yaml",
          code: `name: Playwright Tests
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v4
      if: \${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30`,
        },
        {
          id: "github-actions-deploy",
          language: "yaml",
          code: `# Тести після деплою на Vercel/Netlify/etc
name: Playwright Tests
on:
  deployment_status:
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
      env:
        PLAYWRIGHT_TEST_BASE_URL: \${{ github.event.deployment_status.target_url }}`,
        },
      ],
    },
    {
      id: "fail-fast-prs",
      title: {
        en: "Faster feedback on PRs — --only-changed",
        uk: "Швидший зворотний зв'язок на PR — --only-changed",
      },
      paragraphs: [
        {
          en: "`--only-changed` runs only the test files affected by the current changeset. Playwright analyzes the dependency graph to figure out which test files import or depend on the changed source files. On a large project this can cut CI time from 15 minutes to 2 minutes for a small PR.",
          uk: "`--only-changed` запускає тільки файли тестів яких торкнувся поточний набір змін. Playwright аналізує граф залежностей щоб з'ясувати які файли тестів імпортують або залежать від змінених вихідних файлів. На великому проекті це може скоротити час CI з 15 хвилин до 2 хвилин для невеликого PR.",
        },
        {
          en: "Important: this is a heuristic, not a guarantee. It can miss tests if the dependency analysis doesn't catch all relationships. I always follow it with a full test run after the PR merges to main.",
          uk: "Важливо: це евристика, а не гарантія. Можна пропустити тести якщо аналіз залежностей не вловить всі зв'язки. Я завжди слідую за цим повним запуском тестів після злиття PR в main.",
        },
      ],
      codeBlocks: [
        {
          id: "only-changed",
          language: "yaml",
          code: `# В GitHub Actions — тільки для PR
- name: Run changed Playwright tests
  run: npx playwright test --only-changed=origin/\$GITHUB_BASE_REF
  if: github.event_name == 'pull_request'
- name: Run all Playwright tests
  run: npx playwright test`,
        },
      ],
    },
    {
      id: "debugging-ci",
      title: {
        en: "When the browser won't launch on CI",
        uk: "Коли браузер не запускається на CI",
      },
      paragraphs: [
        {
          en: "`Error: Failed to launch browser` on CI is almost always a missing system dependency. First check: did you run `--with-deps`? If yes, try `DEBUG=pw:browser` to see exactly what the browser binary says when it fails to start.",
          uk: "`Error: Failed to launch browser` на CI — майже завжди відсутня системна залежність. Перша перевірка: чи запускав `--with-deps`? Якщо так — спробуй `DEBUG=pw:browser` щоб побачити точно що каже бінарний файл браузера коли не може запуститися.",
        },
        {
          en: "Don't cache browser binaries between CI runs. The time to restore from cache is similar to re-downloading, and on Linux the OS dependencies aren't cacheable anyway. Just always reinstall.",
          uk: "Не кешуй бінарні файли браузерів між запусками CI. Час відновлення з кешу схожий на повторне скачування, і на Linux системні залежності все одно не кешуються. Просто завжди переінстальовуй.",
        },
      ],
      codeBlocks: [
        {
          id: "debug-browser",
          language: "bash",
          code: `# Дебаг запуску браузера — виводить детальний лог
DEBUG=pw:browser npx playwright test`,
        },
      ],
    },
    {
      id: "other-ci-providers",
      title: {
        en: "Other CI providers",
        uk: "Інші CI-провайдери",
      },
      paragraphs: [
        {
          en: "For all other providers the approach is the same — the only difference is the YAML syntax. Most use the official Playwright Docker image (`mcr.microsoft.com/playwright:v1.x-noble`) to skip the browser installation step entirely. The image already has all browsers and system dependencies installed.",
          uk: "Для всіх інших провайдерів підхід той самий — різниця тільки в синтаксисі YAML. Більшість використовує офіційний Docker-образ Playwright (`mcr.microsoft.com/playwright:v1.x-noble`) щоб повністю пропустити крок встановлення браузерів. В образі вже є всі браузери і системні залежності.",
        },
      ],
      codeBlocks: [
        {
          id: "azure-pipelines",
          language: "yaml",
          code: `# Azure Pipelines
trigger:
- main
pool:
  vmImage: ubuntu-latest
steps:
- task: UseNode@1
  inputs:
    version: '22'
- script: npm ci
- script: npx playwright install --with-deps
- script: npx playwright test
  env:
    CI: 'true'
- task: PublishPipelineArtifact@1
  inputs:
    targetPath: playwright-report
    artifact: playwright-report
  condition: succeededOrFailed()`,
        },
        {
          id: "gitlab-ci",
          language: "yaml",
          code: `# GitLab CI
stages:
  - test
tests:
  stage: test
  image: mcr.microsoft.com/playwright:v1.50.0-noble
  script:
    - npm ci
    - npx playwright test`,
        },
        {
          id: "jenkins",
          language: "groovy",
          code: `// Jenkins Pipeline
pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.50.0-noble' } }
  stages {
    stage('e2e-tests') {
      steps {
        sh 'npm ci'
        sh 'npx playwright test'
      }
    }
  }
}`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your GitHub Actions workflow runs 'npx playwright install' (without --with-deps) and gets 'Error: Failed to launch browser'. What's happening and how do you fix it?",
        uk: "Твій GitHub Actions workflow запускає 'npx playwright install' (без --with-deps) і отримує 'Error: Failed to launch browser'. Що відбувається і як виправити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The Playwright version is incompatible with the Node.js version — update Node.js",
            uk: "Версія Playwright несумісна з версією Node.js — оновити Node.js",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright install downloads browser binaries but not OS-level system dependencies — change to npx playwright install --with-deps to also install libglib, libnss, and other Linux libs the browser needs",
            uk: "npx playwright install завантажує бінарні файли браузера але не системні залежності ОС — змінити на npx playwright install --with-deps щоб також встановити libglib, libnss та інші Linux-бібліотеки які потрібні браузеру",
          },
        },
        {
          id: "c",
          label: {
            en: "The ubuntu-latest runner doesn't support Chromium — switch to a different browser",
            uk: "Runner ubuntu-latest не підтримує Chromium — переключитися на інший браузер",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`npx playwright install` downloads only the browser binary (Chromium, Firefox, WebKit). But browsers depend on dozens of system libraries like libglib, libnss, libatk that aren't present on a fresh Ubuntu runner. `--with-deps` runs `sudo apt-get install` for all those libraries automatically. ubuntu-latest works fine with all browsers — it just needs the system deps installed first.",
        uk: "`npx playwright install` завантажує тільки бінарний файл браузера (Chromium, Firefox, WebKit). Але браузери залежать від десятків системних бібліотек як libglib, libnss, libatk яких немає на свіжому Ubuntu runner. `--with-deps` автоматично запускає `sudo apt-get install` для всіх цих бібліотек. ubuntu-latest відмінно працює з усіма браузерами — просто спочатку потрібно встановити системні залежності.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "A Playwright test fails on CI. You check GitHub Actions and there's no playwright-report artifact to download. What configuration change would have prevented this?",
        uk: "Тест Playwright падає на CI. Перевіряєш GitHub Actions — артефакту playwright-report немає для скачування. Яка зміна конфігурації запобігла б цьому?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add continue-on-error: true to the test step so the job doesn't fail",
            uk: "Додати continue-on-error: true до кроку тестів щоб job не падав",
          },
        },
        {
          id: "b",
          label: {
            en: "Add if: ${{ !cancelled() }} to the artifact upload step — without it, a failed job skips all remaining steps including the upload",
            uk: "Додати if: ${{ !cancelled() }} до кроку завантаження артефакту — без цього невдалий job пропускає всі наступні кроки включаючи завантаження",
          },
        },
        {
          id: "c",
          label: {
            en: "Move the artifact upload step before the test step",
            uk: "Перемістити крок завантаження артефакту перед кроком тестів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When a step fails, GitHub Actions marks the job as failed and skips all subsequent steps by default. Since the report upload step comes after the test step, a test failure prevents the upload. `if: ${{ !cancelled() }}` tells Actions to run the step regardless of whether previous steps succeeded or failed — only skip if the workflow was manually cancelled. `continue-on-error` would hide the failure in the job status, which defeats the purpose. Moving the upload before tests would upload an empty report.",
        uk: "Коли крок завершується невдачею GitHub Actions позначає job як невдалий і пропускає всі наступні кроки за замовчуванням. Оскільки крок завантаження звіту стоїть після кроку тестів — невдача тесту запобігає завантаженню. `if: ${{ !cancelled() }}` каже Actions запускати крок незалежно від того чи попередні кроки пройшли чи впали — пропустити тільки якщо workflow вручну скасовано. `continue-on-error` приховало б невдачу у статусі job що руйнує мету. Переміщення завантаження перед тестами завантажило б порожній звіт.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Which GitHub Actions YAML trigger runs Playwright tests on every push to main and every pull request targeting main?",
        uk: "Який тригер у GitHub Actions YAML запускає Playwright-тести при кожному push у main і кожному pull request до main?",
      },
      options: [
        { id: "a", label: { en: "on: [push]", uk: "on: [push]" } },
        {
          id: "b",
          label: {
            en: "on:\\n  push:\\n    branches: [ main ]\\n  pull_request:\\n    branches: [ main ]",
            uk: "on:\\n  push:\\n    branches: [ main ]\\n  pull_request:\\n    branches: [ main ]",
          },
        },
        { id: "c", label: { en: "on: workflow_dispatch", uk: "on: workflow_dispatch" } },
        {
          id: "d",
          label: {
            en: "on:\\n  deployment_status:",
            uk: "on:\\n  deployment_status:",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `on.push.branches` + `on.pull_request.branches` combination fires the workflow on direct commits to main AND on PRs whose base branch is main. `on: [push]` triggers on every push to every branch. `workflow_dispatch` is for manual runs. `deployment_status` fires when a deployment finishes, which is used for post-deploy testing.",
        uk: "Комбінація `on.push.branches` + `on.pull_request.branches` запускає workflow при прямих комітах у main І при PR де базова гілка — main. `on: [push]` спрацьовує при кожному push у будь-яку гілку. `workflow_dispatch` — для ручного запуску. `deployment_status` спрацьовує після завершення деплою і використовується для тестування після деплою.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "Why does Playwright run in headless mode by default on CI?",
        uk: "Чому Playwright запускається в headless-режимі за замовчуванням на CI?",
      },
      options: [
        { id: "a", label: { en: "Headless is faster because it uses less CPU", uk: "Headless швидший бо використовує менше CPU" } },
        { id: "b", label: { en: "CI runners don't have a display server, so headed mode would crash immediately", uk: "CI-runner-и не мають дисплей-сервера тому headed-режим одразу б впав" } },
        { id: "c", label: { en: "Headless produces smaller trace files", uk: "Headless створює менші файли трейсів" } },
        { id: "d", label: { en: "Playwright requires headless on Linux regardless of environment", uk: "Playwright вимагає headless на Linux незалежно від середовища" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "CI runners (like GitHub Actions ubuntu-latest) have no graphical display server. Headed mode requires a display to render pixels. Without one, the browser process crashes. Headless mode renders without a display, so it works on any server. Headless isn't inherently faster or smaller — it just doesn't need a display.",
        uk: "CI-runner-и (як GitHub Actions ubuntu-latest) не мають графічного дисплей-сервера. Headed-режим вимагає дисплей для рендерингу пікселів. Без нього процес браузера одразу падає. Headless-режим рендерить без дисплея тому працює на будь-якому сервері. Headless сам по собі не швидший і не компактніший — він просто не потребує дисплея.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You want to upload the Playwright HTML report as an artifact that is retained for 30 days and available even when tests fail. Which step configuration achieves this?",
        uk: "Ти хочеш завантажити HTML-репорт Playwright як артефакт що зберігається 30 днів і доступний навіть якщо тести падають. Яка конфігурація кроку це забезпечить?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "uses: actions/upload-artifact@v4 with path: playwright-report/ and no condition",
            uk: "uses: actions/upload-artifact@v4 з path: playwright-report/ і без умови",
          },
        },
        {
          id: "b",
          label: {
            en: "uses: actions/upload-artifact@v4 with if: success() and retention-days: 30",
            uk: "uses: actions/upload-artifact@v4 з if: success() і retention-days: 30",
          },
        },
        {
          id: "c",
          label: {
            en: "uses: actions/upload-artifact@v4 with if: ${{ !cancelled() }} and retention-days: 30",
            uk: "uses: actions/upload-artifact@v4 з if: ${{ !cancelled() }} і retention-days: 30",
          },
        },
        {
          id: "d",
          label: {
            en: "uses: actions/upload-artifact@v4 with if: failure() and retention-days: 30",
            uk: "uses: actions/upload-artifact@v4 з if: failure() і retention-days: 30",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`if: ${{ !cancelled() }}` ensures the upload step runs whether tests passed or failed — it only skips if the workflow is manually cancelled. No condition at all would only upload on success (same as `if: success()`). `if: failure()` skips the upload when tests pass, losing passing baselines. `retention-days: 30` controls how long GitHub keeps the artifact.",
        uk: "`if: ${{ !cancelled() }}` забезпечує що крок завантаження виконується і при проходженні і при падінні тестів — пропускається лише якщо workflow скасований вручну. Відсутність умови завантажує тільки при успіху (те саме що `if: success()`). `if: failure()` пропускає завантаження коли тести проходять — втрачаються пройдені базові звіти. `retention-days: 30` визначає скільки GitHub зберігає артефакт.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You have 800 tests and want to split them across 4 CI machines using sharding and then get one combined report. Which reporter should each shard use?",
        uk: "У тебе 800 тестів і хочеш розбити їх між 4 CI-машинами через шардинг і отримати один об'єднаний звіт. Який репортер має використовувати кожен шард?",
      },
      options: [
        { id: "a", label: { en: "reporter: 'html' — HTML reports from each shard get merged automatically", uk: "reporter: 'html' — HTML-звіти кожного шарду зливаються автоматично" } },
        { id: "b", label: { en: "reporter: 'list' — lightweight output that CI can merge", uk: "reporter: 'list' — легкий вивід який CI може злити" } },
        { id: "c", label: { en: "reporter: 'blob' — produces a zip with raw test data that can be merged with npx playwright merge-reports", uk: "reporter: 'blob' — створює zip з сирими даними тестів який можна злити через npx playwright merge-reports" } },
        { id: "d", label: { en: "reporter: 'json' — JSON files from all shards can be concatenated", uk: "reporter: 'json' — JSON файли з усіх шардів можна конкатенувати" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The blob reporter writes all raw test data (results, traces, screenshots, attachments) into a structured zip file. After all shards finish, a merge job downloads all blob zips and runs `npx playwright merge-reports --reporter html` to produce one combined HTML report. HTML reports are static and can't be merged. JSON files don't carry trace attachments. The list reporter is for console output only.",
        uk: "Blob-репортер записує всі сирі дані тестів (результати, трейси, скриншоти, вкладення) у структурований zip-файл. Після завершення всіх шардів merge-job скачує всі blob-zip-и і запускає `npx playwright merge-reports --reporter html` щоб отримати один об'єднаний HTML-звіт. HTML-звіти статичні і не можна злити. JSON-файли не несуть вкладення трейсів. Репортер list тільки для консольного виводу.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "The article recommends NOT caching browser binaries between CI runs. What is the main reason?",
        uk: "Стаття рекомендує НЕ кешувати бінарники браузерів між CI-запусками. Яка основна причина?",
      },
      options: [
        { id: "a", label: { en: "Caching browser binaries is not supported by GitHub Actions", uk: "Кешування бінарників браузерів не підтримується GitHub Actions" } },
        { id: "b", label: { en: "The time to restore from cache is similar to re-downloading, and on Linux the OS dependencies aren't cacheable anyway", uk: "Час відновлення з кешу схожий на повторне скачування, і на Linux системні залежності все одно не кешуються" } },
        { id: "c", label: { en: "Cached binaries can become corrupted and cause flaky tests", uk: "Кешовані бінарники можуть пошкодитися і призводити до flaky-тестів" } },
        { id: "d", label: { en: "Each browser version requires a separate cache key that is hard to manage", uk: "Кожна версія браузера вимагає окремого cache key який важко підтримувати" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Browser binaries download quickly from Microsoft's CDN, so cache restoration doesn't save significant time. More importantly, on Linux, system-level browser dependencies (libglib, libnss, etc.) installed by `--with-deps` are OS packages managed by apt — they can't be cached in a GitHub Actions cache. Since you have to run `--with-deps` anyway for the OS packages, just always reinstall everything freshly.",
        uk: "Бінарники браузерів швидко завантажуються з CDN Microsoft тому відновлення з кешу не економить значного часу. Важливіше те що на Linux системні залежності браузера (libglib, libnss тощо) встановлені через `--with-deps` — це пакети ОС керовані apt і їх не можна кешувати в GitHub Actions cache. Оскільки `--with-deps` все одно треба запускати для пакетів ОС — просто завжди перевстановлюй все заново.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What does `npx playwright install --with-deps` do that plain `npx playwright install` does not?",
        uk: "Що робить `npx playwright install --with-deps` чого не робить звичайний `npx playwright install`?",
      },
      options: [
        { id: "a", label: { en: "It installs the latest version of Playwright instead of the version pinned in package.json", uk: "Він встановлює найновішу версію Playwright замість версії з package.json" } },
        { id: "b", label: { en: "It installs all three browsers (Chromium, Firefox, WebKit) instead of just Chromium", uk: "Він встановлює всі три браузери (Chromium, Firefox, WebKit) замість тільки Chromium" } },
        { id: "c", label: { en: "It runs sudo apt-get install for OS-level libraries (libglib, libnss, libatk, etc.) that browser binaries depend on", uk: "Він запускає sudo apt-get install для бібліотек рівня ОС (libglib, libnss, libatk тощо) від яких залежать бінарники браузерів" } },
        { id: "d", label: { en: "It also installs the Playwright VS Code extension automatically", uk: "Він також автоматично встановлює розширення Playwright для VS Code" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`npx playwright install` downloads only the browser binaries (Chromium, Firefox, WebKit builds). The `--with-deps` flag additionally invokes the system package manager (apt on Ubuntu) to install OS-level shared libraries that browsers need: libglib, libnss, libatk, libdrm, libgbm, and many others. Without these, the browser binary exists but crashes on launch with 'Failed to launch browser' or 'error while loading shared libraries'. The flag installs all browsers regardless — it doesn't change which browsers are downloaded.",
        uk: "`npx playwright install` завантажує лише бінарники браузерів (збірки Chromium, Firefox, WebKit). Прапорець `--with-deps` додатково викликає системний менеджер пакетів (apt на Ubuntu) щоб встановити спільні бібліотеки рівня ОС які потрібні браузерам: libglib, libnss, libatk, libdrm, libgbm та багато інших. Без них бінарник браузера є але падає при запуску з помилкою 'Failed to launch browser' або 'error while loading shared libraries'. Прапорець не змінює які браузери завантажуються — він встановлює системні залежності для всіх.",
      },
    },
  ],
}
