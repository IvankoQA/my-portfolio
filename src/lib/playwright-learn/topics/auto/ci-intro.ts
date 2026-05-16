import type { PlaywrightTopic } from "../../types"

export const ciIntroTopic: PlaywrightTopic = {
  slug: "ci-intro",
  groupId: "ci",
  order: 145,
  level: "advanced",
  trackOrder: 6,
  sourceDoc: "ci-intro.md",
  officialDocsUrl: "https://playwright.dev/docs/ci-intro",
  title: {
    en: "Setting up CI",
    uk: "Налаштування CI",
  },
  summary: {
    en: "The first time I set up Playwright on GitHub Actions I forgot --with-deps and the browsers wouldn't launch. The YAML below is the minimal working setup: checkout → install → playwright install --with-deps → test → upload artifact. That's it.",
    uk: "Перший раз коли я налаштовував Playwright на GitHub Actions я забув --with-deps і браузери не запускалися. YAML нижче — мінімальне робоче налаштування: checkout → install → playwright install --with-deps → test → upload artifact. Ось і все.",
  },
  sections: [
    {
      id: "github-actions-yaml",
      title: {
        en: "The minimal working GitHub Actions workflow",
        uk: "Мінімальний робочий GitHub Actions workflow",
      },
      paragraphs: [
        {
          en: "This runs on every push and pull request to main. The critical line is `npx playwright install --with-deps` — without `--with-deps` the system libraries that browsers need aren't installed and you get a cryptic error about missing shared libraries.",
          uk: "Це запускається при кожному push і pull request у main. Критична лінія — `npx playwright install --with-deps` — без `--with-deps` системні бібліотеки потрібні браузерам не встановлюються і ти отримуєш загадкову помилку про відсутні shared libraries.",
        },
        {
          en: "The artifact upload uses `if: ${{ !cancelled() }}` so the report is saved even when tests fail — which is exactly when you need it most.",
          uk: "Завантаження артефакту використовує `if: ${{ !cancelled() }}` щоб репорт зберігався навіть коли тести падають — а це саме тоді коли він найбільше потрібен.",
        },
      ],
      codeBlocks: [
        {
          id: "github-actions",
          language: "yaml",
          code: `name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
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
      ],
    },
    {
      id: "viewing-results",
      title: {
        en: "Viewing test results in GitHub",
        uk: "Перегляд результатів тестів у GitHub",
      },
      paragraphs: [
        {
          en: "After a run, go to the **Actions** tab in your repo. Click the workflow run, then click **Run Playwright tests** to see the full console output — error messages, what was expected, what was received, and the call log.",
          uk: "Після запуску йди на вкладку **Actions** в репозиторії. Клацни на запуск workflow, потім на **Run Playwright tests** щоб побачити повний консольний вивід — повідомлення про помилки, що очікувалося, що отримали, і лог викликів.",
        },
        {
          en: "On Pull Requests you also get a status check — click **Details** next to the Playwright check to jump straight into the logs.",
          uk: "У Pull Request-ах також є status check — клацни **Details** поруч з перевіркою Playwright щоб одразу потрапити в логи.",
        },
      ],
    },
    {
      id: "html-report",
      title: {
        en: "Getting the HTML report from CI",
        uk: "Отримання HTML-репорту з CI",
      },
      paragraphs: [
        {
          en: "The workflow uploads the HTML report as an artifact. Go to the workflow run page → **Artifacts** section → click **playwright-report** to download the zip.",
          uk: "Workflow завантажує HTML-репорт як артефакт. Йди на сторінку запуску workflow → розділ **Artifacts** → клацни **playwright-report** щоб скачати zip.",
        },
        {
          en: "You can't just open `index.html` directly — the report needs a web server. Extract the zip and run `npx playwright show-report` pointing at the extracted folder.",
          uk: "Не можна просто відкрити `index.html` напряму — репорту потрібен вебсервер. Розпакуй zip і запусти `npx playwright show-report` вказуючи на розпаковану папку.",
        },
      ],
      codeBlocks: [
        {
          id: "show-report",
          language: "bash",
          code: `# Розпакуй zip, потім:
npx playwright show-report playwright-report

# Відкриється на http://localhost:9323`,
        },
      ],
    },
    {
      id: "viewing-trace",
      title: {
        en: "Opening traces from failed CI tests",
        uk: "Відкриття трейсів з CI-падінь",
      },
      paragraphs: [
        {
          en: "In the HTML report, failed tests have a trace icon next to the file name. Click it to open the Trace Viewer inline. You can also drag the `.zip` file directly to `trace.playwright.dev` — no local installation needed.",
          uk: "В HTML-репорті у падаючих тестів є іконка трейсу поруч з назвою файлу. Клацни її щоб відкрити Trace Viewer вбудовано. Також можна перетягнути `.zip` файл прямо на `trace.playwright.dev` — без локального встановлення.",
        },
        {
          en: "If traces aren't recording, check your config — for CI I always use `trace: 'on-first-retry'` so traces only capture when a test actually fails.",
          uk: "Якщо трейси не записуються — перевір конфіг. Для CI я завжди використовую `trace: 'on-first-retry'` щоб трейси захоплювалися тільки коли тест реально падає.",
        },
      ],
      codeBlocks: [
        {
          id: "trace-config",
          language: "ts",
          code: `// playwright.config.ts — trace тільки при першому retry на CI
export default defineConfig({
  use: {
    trace: process.env.CI ? 'on-first-retry' : 'off',
  },
})`,
        },
      ],
    },
    {
      id: "secrets",
      title: {
        en: "Test artifacts contain sensitive data",
        uk: "Артефакти тестів містять чутливі дані",
      },
      paragraphs: [
        {
          en: "Traces, HTML reports, and console logs can contain auth tokens, test user credentials, or staging API keys. Upload them only to trusted artifact stores (like private GitHub Actions artifacts with `retention-days: 30`). Don't post them in public Slack channels or share via insecure links.",
          uk: "Трейси, HTML-репорти і консольні логи можуть містити auth-токени, облікові дані тестових юзерів або ключі staging API. Завантажуй їх тільки в перевірені сховища артефактів (як приватні GitHub Actions artifacts з `retention-days: 30`). Не постить їх у публічних Slack-каналах і не ділись за небезпечними посиланнями.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your Playwright tests run fine locally but fail on GitHub Actions with 'error while loading shared libraries'. What's the most likely cause?",
        uk: "Твої Playwright-тести добре працюють локально але падають на GitHub Actions з помилкою 'error while loading shared libraries'. Яка найімовірніша причина?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The Node.js version on CI is different from local",
            uk: "Версія Node.js на CI відрізняється від локальної",
          },
        },
        {
          id: "b",
          label: {
            en: "You ran 'npx playwright install' without '--with-deps' — system libraries for browsers are missing",
            uk: "Ти запустив 'npx playwright install' без '--with-deps' — системні бібліотеки для браузерів відсутні",
          },
        },
        {
          id: "c",
          label: {
            en: "The playwright-report artifact wasn't uploaded",
            uk: "Артефакт playwright-report не був завантажений",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`npx playwright install` downloads the browser binaries but doesn't install OS-level dependencies (like libglib, libnss, etc.) that Chromium/Firefox need. `--with-deps` installs those system libraries. On macOS locally they're already present; on a fresh Ubuntu runner they're not. Always use `npx playwright install --with-deps` in CI.",
        uk: "`npx playwright install` завантажує бінарники браузерів але не встановлює OS-рівневі залежності (як libglib, libnss тощо) що потрібні Chromium/Firefox. `--with-deps` встановлює ці системні бібліотеки. На macOS локально вони вже є; на свіжому Ubuntu runner-і їх немає. Завжди використовуй `npx playwright install --with-deps` на CI.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Tests pass on CI but the HTML report wasn't saved. You used 'if: success()' on the upload step. What should you use instead?",
        uk: "Тести проходять на CI але HTML-репорт не зберігся. Ти використав 'if: success()' на кроці завантаження. Що використовувати замість цього?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "if: always() — upload on every run regardless of result",
            uk: "if: always() — завантажувати при кожному запуску незалежно від результату",
          },
        },
        {
          id: "b",
          label: {
            en: "if: ${{ !cancelled() }} — upload unless the job was manually cancelled",
            uk: "if: ${{ !cancelled() }} — завантажувати якщо job не був скасований вручну",
          },
        },
        {
          id: "c",
          label: {
            en: "if: failure() — upload only when tests fail",
            uk: "if: failure() — завантажувати тільки коли тести падають",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`if: ${{ !cancelled() }}` is the right default — it uploads the report whether tests passed or failed, but skips if you manually cancelled the job. `if: always()` also works but uploads even on cancellation. `if: failure()` skips the report when tests pass, which means you lose the passing baseline. The report is most needed on failures, but keeping passing reports for comparison is also useful.",
        uk: "`if: ${{ !cancelled() }}` — правильний дефолт: завантажує репорт і при проходженні і при падінні тестів, але пропускає якщо job скасований вручну. `if: always()` теж працює але завантажує навіть при скасуванні. `if: failure()` пропускає репорт коли тести проходять — втрачаєш базовий репорт для порівняння. Репорт найбільш потрібен при падіннях, але зберігати і пройдені для порівняння теж корисно.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "The ci-intro article focuses on setting up CI for Playwright. Which CI service does it primarily cover with a full working example?",
        uk: "Стаття ci-intro зосереджена на налаштуванні CI для Playwright. Який CI-сервіс вона в першу чергу розглядає з повним робочим прикладом?",
      },
      options: [
        { id: "a", label: { en: "GitLab CI", uk: "GitLab CI" } },
        { id: "b", label: { en: "CircleCI", uk: "CircleCI" } },
        { id: "c", label: { en: "GitHub Actions", uk: "GitHub Actions" } },
        { id: "d", label: { en: "Jenkins", uk: "Jenkins" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The article provides a complete minimal GitHub Actions YAML workflow as its primary example, including all five steps: checkout, setup-node, npm ci, npx playwright install --with-deps, npx playwright test, and artifact upload. Other CI providers are mentioned but not given a full working example in this intro article.",
        uk: "Стаття надає повний мінімальний YAML-workflow GitHub Actions як основний приклад, включаючи всі п'ять кроків: checkout, setup-node, npm ci, npx playwright install --with-deps, npx playwright test і завантаження артефакту. Інші CI-провайдери згадуються але повного робочого прикладу в цій вступній статті немає.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What are the correct ordered steps to set up basic Playwright CI on GitHub Actions according to the article?",
        uk: "Які правильні кроки у правильному порядку для базового налаштування Playwright CI на GitHub Actions за статтею?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "checkout → npx playwright install --with-deps → npm ci → npx playwright test → upload artifact",
            uk: "checkout → npx playwright install --with-deps → npm ci → npx playwright test → завантаження артефакту",
          },
        },
        {
          id: "b",
          label: {
            en: "checkout → setup-node → npm ci → npx playwright install --with-deps → npx playwright test → upload artifact",
            uk: "checkout → setup-node → npm ci → npx playwright install --with-deps → npx playwright test → завантаження артефакту",
          },
        },
        {
          id: "c",
          label: {
            en: "npm ci → checkout → npx playwright install → npx playwright test → upload artifact",
            uk: "npm ci → checkout → npx playwright install → npx playwright test → завантаження артефакту",
          },
        },
        {
          id: "d",
          label: {
            en: "checkout → npm ci → npx playwright test → npx playwright install --with-deps → upload artifact",
            uk: "checkout → npm ci → npx playwright test → npx playwright install --with-deps → завантаження артефакту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The correct order is: checkout the code first, then setup-node (to configure the Node.js version), then npm ci to install npm dependencies, then npx playwright install --with-deps to install browsers and OS libraries, then run the tests, then upload the artifact. Installing Playwright browsers before npm ci would fail because the Playwright CLI isn't available yet.",
        uk: "Правильний порядок: спочатку checkout коду, потім setup-node (щоб налаштувати версію Node.js), потім npm ci для встановлення npm-залежностей, потім npx playwright install --with-deps для браузерів і бібліотек ОС, потім запуск тестів, потім завантаження артефакту. Встановлення браузерів Playwright перед npm ci не вийде бо CLI Playwright ще не доступний.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you pass a dynamic base URL (for example, from a Vercel preview deployment) to Playwright tests running in GitHub Actions?",
        uk: "Як передати динамічний base URL (наприклад з preview-деплою Vercel) тестам Playwright що виконуються в GitHub Actions?",
      },
      options: [
        { id: "a", label: { en: "Hardcode the URL in playwright.config.ts before each CI run", uk: "Захардкодити URL у playwright.config.ts перед кожним CI-запуском" } },
        { id: "b", label: { en: "Pass it as an environment variable (e.g. PLAYWRIGHT_TEST_BASE_URL) in the workflow step's env block", uk: "Передати як змінну середовища (наприклад PLAYWRIGHT_TEST_BASE_URL) у блоці env кроку workflow" } },
        { id: "c", label: { en: "Use a GitHub Actions secret and reference it with ${{ secrets.BASE_URL }}", uk: "Використати GitHub Actions secret і посилатися на нього через ${{ secrets.BASE_URL }}" } },
        { id: "d", label: { en: "Add the URL as a query parameter in the test command: npx playwright test --base-url=https://...", uk: "Додати URL як query параметр у команду: npx playwright test --base-url=https://..." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The article shows passing `PLAYWRIGHT_TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}` in the `env` block of the test step. Playwright reads this environment variable and uses it as the base URL. This pattern works for any dynamic URL — Vercel, Netlify, or any platform that puts the preview URL in a deployment event. Hardcoding breaks the dynamic nature of previews; secrets are for static credentials, not dynamic URLs.",
        uk: "Стаття показує передачу `PLAYWRIGHT_TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}` у блоці `env` кроку тестів. Playwright читає цю змінну середовища і використовує як base URL. Цей патерн працює для будь-якого динамічного URL — Vercel, Netlify або будь-якої платформи що кладе preview URL у подію деплою. Захардкодити означає зламати динамічну природу превью; secrets для статичних облікових даних а не динамічних URL.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "A CI test fails. You open GitHub Actions but find no playwright-report artifact in the Artifacts section. You did NOT use if: ${{ !cancelled() }}. Why is the artifact missing?",
        uk: "Тест на CI падає. Відкриваєш GitHub Actions але в розділі Artifacts немає артефакту playwright-report. Ти НЕ використовував if: ${{ !cancelled() }}. Чому артефакт відсутній?",
      },
      options: [
        { id: "a", label: { en: "The artifact was deleted because the job ran too long", uk: "Артефакт видалили бо job виконувався занадто довго" } },
        { id: "b", label: { en: "GitHub Actions skips all subsequent steps by default when a step fails, so the upload step was never executed", uk: "GitHub Actions пропускає всі наступні кроки за замовчуванням коли крок падає тому крок завантаження ніколи не виконався" } },
        { id: "c", label: { en: "The playwright-report directory was empty so GitHub didn't create the artifact", uk: "Директорія playwright-report була порожньою тому GitHub не створив артефакт" } },
        { id: "d", label: { en: "Artifact uploads require manual approval in failed jobs", uk: "Завантаження артефактів вимагає ручного підтвердження у job що впав" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When a GitHub Actions step exits with a non-zero code (test failure), Actions marks the job as failed and skips all remaining steps unless they have an explicit condition. Without `if: ${{ !cancelled() }}` on the upload step, the upload is silently skipped whenever tests fail — exactly when you need the report most. Adding the condition makes Actions run the upload regardless of the test result.",
        uk: "Коли крок GitHub Actions завершується з ненульовим кодом (падіння тесту) Actions позначає job як невдалий і пропускає всі наступні кроки якщо вони не мають явної умови. Без `if: ${{ !cancelled() }}` на кроці завантаження — завантаження тихо пропускається щоразу коли тести падають, саме тоді коли звіт найбільше потрібен. Додавання умови змушує Actions виконати завантаження незалежно від результату тестів.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "After downloading a playwright-report zip artifact from CI, you try to open index.html directly in your browser but the report doesn't display correctly. What should you do instead?",
        uk: "Після скачування zip-артефакту playwright-report з CI спробуєш відкрити index.html напряму у браузері але звіт відображається неправильно. Що треба зробити натомість?",
      },
      options: [
        { id: "a", label: { en: "Upload the zip to trace.playwright.dev to view it online", uk: "Завантажити zip на trace.playwright.dev щоб переглянути онлайн" } },
        { id: "b", label: { en: "Extract the zip and run npx playwright show-report pointing at the extracted folder", uk: "Розпакувати zip і запустити npx playwright show-report вказуючи на розпаковану папку" } },
        { id: "c", label: { en: "Open the zip in VS Code and use the Live Preview extension", uk: "Відкрити zip у VS Code і використати розширення Live Preview" } },
        { id: "d", label: { en: "Re-run the test locally to generate a fresh report", uk: "Запустити тест локально щоб згенерувати свіжий звіт" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The HTML report uses relative paths and relies on a local web server to load assets correctly. Opening index.html directly via the file:// protocol causes CORS errors and missing assets. The correct approach is to extract the zip and run `npx playwright show-report playwright-report` which starts a local server at http://localhost:9323 and serves the report properly.",
        uk: "HTML-звіт використовує відносні шляхи і покладається на локальний вебсервер для правильного завантаження ресурсів. Відкриття index.html напряму через протокол file:// спричиняє CORS-помилки і відсутні ресурси. Правильний підхід — розпакувати zip і запустити `npx playwright show-report playwright-report` який запускає локальний сервер на http://localhost:9323 і правильно обслуговує звіт.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "On GitHub Actions, how do you run only the Playwright tests affected by a PR's changes to speed up feedback, while still running all tests on merge to main?",
        uk: "У GitHub Actions як запустити лише тести Playwright яких торкнувся PR щоб прискорити зворотний зв'язок, але все одно запускати всі тести при злитті в main?",
      },
      options: [
        { id: "a", label: { en: "Use npx playwright test --only-changed=origin/$GITHUB_BASE_REF on PRs, and npx playwright test (full) on push to main", uk: "Використовувати npx playwright test --only-changed=origin/$GITHUB_BASE_REF для PR і npx playwright test (повний) при push у main" } },
        { id: "b", label: { en: "Manually tag which tests are relevant in each PR description", uk: "Вручну позначати які тести релевантні в описі кожного PR" } },
        { id: "c", label: { en: "Use test.skip() in test files that haven't changed", uk: "Використовувати test.skip() у файлах тестів що не змінювалися" } },
        { id: "d", label: { en: "Configure GitHub Actions to cache test results and skip re-running unchanged files", uk: "Налаштувати GitHub Actions щоб кешував результати тестів і пропускав незмінені файли" } },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`--only-changed` makes Playwright analyze the dependency graph and run only test files that import or depend on the changed source files. The `origin/$GITHUB_BASE_REF` argument points to the PR's base branch for comparison. A separate step (without the flag) runs the full suite on direct pushes to main. The article warns this is a heuristic — it can miss some tests — so always follow with a full run after merging.",
        uk: "`--only-changed` змушує Playwright аналізувати граф залежностей і запускати тільки файли тестів що імпортують або залежать від змінених вихідних файлів. Аргумент `origin/$GITHUB_BASE_REF` вказує на базову гілку PR для порівняння. Окремий крок (без прапорця) запускає повний набір при прямих push у main. Стаття попереджає що це евристика і вона може пропустити деякі тести тому завжди запускай повний набір після злиття.",
      },
    },
  ],
}
