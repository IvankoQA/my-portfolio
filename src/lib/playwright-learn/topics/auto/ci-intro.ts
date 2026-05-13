import type { PlaywrightTopic } from "../../types"

export const ciIntroTopic: PlaywrightTopic = {
  slug: "ci-intro",
  groupId: "ci",
  order: 145,
  sourceDoc: "ci-intro.md",
  officialDocsUrl: "https://playwright.dev/docs/ci-intro",
  title: {
    en: "Setting up CI",
    uk: "Налаштування CI",
  },
  summary: {
    en: "Short guide: run Playwright Test on GitHub Actions with Node.js, then view reports and traces.",
    uk: "Короткий посібник: GitHub Actions для Playwright Test (Node.js), перегляд HTML-звіту та трейсів.",
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
          en: "Playwright tests can be run on any CI provider. This guide covers one way of running tests on GitHub using GitHub Actions. If you would like to learn more, or how to configure other CI providers, check out our detailed [doc on Continuous Integration](./ci.md).",
          uk: "Тести Playwright можна запускати на будь-якому CI-провайдері. У цьому посібнику показано один зі способів — запуск тестів на GitHub із GitHub Actions. Щоб дізнатися більше або налаштувати інших CI-провайдерів, зверніться до детальної [документації з Continuous Integration](./ci.md).",
        },
        {
          en: "#### You will learn",
          uk: "#### Що ви дізнаєтесь",
        },
        {
          en: "- [How to set up GitHub Actions](/ci-intro.md#setting-up-github-actions)\n- [How to view test logs](/ci-intro.md#viewing-test-logs)\n- [How to view the HTML report](/ci-intro.md#viewing-the-html-report)\n- [How to view the trace](/ci-intro.md#viewing-the-trace)\n- [How to publish report on the web](/ci-intro.md#publishing-report-on-the-web)",
          uk: "- [Як налаштувати GitHub Actions](/ci-intro.md#setting-up-github-actions)\n- [Як переглядати логи тестів](/ci-intro.md#viewing-test-logs)\n- [Як переглядати HTML-звіт](/ci-intro.md#viewing-the-html-report)\n- [Як переглядати трасу](/ci-intro.md#viewing-the-trace)\n- [Як опублікувати звіт в Інтернеті](/ci-intro.md#publishing-report-on-the-web)",
        },
      ],
    },
    {
      id: "setting-up-github-actions",
      title: {
        en: "Setting up GitHub Actions",
        uk: "Налаштування GitHub Actions",
      },
      paragraphs: [
        {
          en: "When [installing Playwright](./intro.md) using the [VS Code extension](./getting-started-vscode.md) or with `npm init playwright@latest`, you are given the option to add a [GitHub Actions](https://docs.github.com/en/actions) workflow. This creates a `playwright.yml` file inside a `.github/workflows` folder containing everything you need so that your tests run on each push and pull request into the main/master branch. Here's how that file looks:",
          uk: "Коли ви [встановлюєте Playwright](./intro.md) через [розширення VS Code](./getting-started-vscode.md) або `npm init playwright@latest`, вам пропонується додати workflow для [GitHub Actions](https://docs.github.com/en/actions). Це створює файл `playwright.yml` у папці `.github/workflows`, який містить усе необхідне — тести запускатимуться при кожному push і pull request у гілку main/master. Ось як виглядає цей файл:",
        },
        {
          en: "The workflow performs these steps:",
          uk: "Workflow виконує такі кроки:",
        },
        {
          en: "1. Clone your repository\n1. Install Node.js\n1. Install NPM Dependencies\n1. Install Playwright Browsers\n1. Run Playwright tests\n1. Upload HTML report to the GitHub UI",
          uk: "1. Клонує репозиторій\n1. Встановлює Node.js\n1. Встановлює NPM-залежності\n1. Встановлює браузери Playwright\n1. Запускає тести Playwright\n1. Завантажує HTML-звіт у GitHub UI",
        },
        {
          en: 'To learn more about this, see ["Understanding GitHub Actions"](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).',
          uk: "Детальніше — у [«Understanding GitHub Actions»](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "yml",
          code: "name: Playwright Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\njobs:\n  test:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v5\n    - uses: actions/setup-node@v5\n      with:\n        node-version: lts/*\n    - name: Install dependencies\n      run: npm ci\n    - name: Install Playwright Browsers\n      run: npx playwright install --with-deps\n    - name: Run Playwright tests\n      run: npx playwright test\n    - uses: actions/upload-artifact@v4\n      if: ${{ !cancelled() }}\n      with:\n        name: playwright-report\n        path: playwright-report/\n        retention-days: 30",
        },
      ],
    },
    {
      id: "create-a-repo-and-push-to-github",
      title: {
        en: "Create a Repo and Push to GitHub",
        uk: "Створення репозиторію та завантаження на GitHub",
      },
      paragraphs: [
        {
          en: "Once you have your [GitHub Actions workflow](#setting-up-github-actions) setup, then all you need to do is [Create a repo on GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo) or push your code to an existing repository. Follow the instructions on GitHub and don't forget to [initialize a git repository](https://github.com/git-guides/git-init) using the `git init` command so you can [add](https://github.com/git-guides/git-add), [commit](https://github.com/git-guides/git-commit), and [push](https://github.com/git-guides/git-push) your code.",
          uk: "Після налаштування [GitHub Actions workflow](#setting-up-github-actions) достатньо [створити репозиторій на GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo) або завантажити код у наявний.\n\nДотримуйтесь інструкцій на GitHub і не забудьте [ініціалізувати git-репозиторій](https://github.com/git-guides/git-init) командою `git init`, щоб мати змогу [додавати](https://github.com/git-guides/git-add), [комітити](https://github.com/git-guides/git-commit) та [завантажувати](https://github.com/git-guides/git-push) код.",
        },
      ],
    },
    {
      id: "opening-the-workflows",
      title: {
        en: "Opening the Workflows",
        uk: "Відкриття Workflows",
      },
      paragraphs: [
        {
          en: "Click on the **Actions** tab to see the workflows. Here you see if your tests have passed or failed.",
          uk: "Натисніть вкладку **Actions**, щоб переглянути workflows. Тут видно, чи пройшли тести.",
        },
        {
          en: "On Pull Requests you can also click on the **Details** link in the [PR status check](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks).",
          uk: "У Pull Request також можна натиснути посилання **Details** у [статусній перевірці PR](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks).",
        },
      ],
    },
    {
      id: "viewing-test-logs",
      title: {
        en: "Viewing Test Logs",
        uk: "Перегляд логів тестів",
      },
      paragraphs: [
        {
          en: "Clicking on the workflow run shows you all the actions that GitHub performed and clicking on **Run Playwright tests** shows the error messages, what was expected and what was received as well as the call log.",
          uk: "Натисніть на запуск workflow — побачите всі дії, виконані GitHub. Натиснувши **Run Playwright tests**, відкриються повідомлення про помилки, очікувані та отримані значення, а також лог викликів.",
        },
      ],
    },
    {
      id: "html-report",
      title: {
        en: "HTML Report",
        uk: "HTML-звіт",
      },
      paragraphs: [
        {
          en: "The HTML Report shows you a full report of your tests. You can filter the report by browsers, passed tests, failed tests, skipped tests, and flaky tests.",
          uk: "HTML-звіт показує повну інформацію про тести. Можна фільтрувати за браузерами, успішними тестами, тестами, що впали, пропущеними та нестабільними (flaky) тестами.",
        },
        {
          en: "### Downloading the HTML Report",
          uk: "### Завантаження HTML-звіту",
        },
        {
          en: "In the Artifacts section, click on the **playwright-report** to download your report in the format of a zip file.",
          uk: "У розділі Artifacts натисніть **playwright-report**, щоб завантажити звіт у форматі zip-архіву.",
        },
        {
          en: "### Viewing the HTML Report",
          uk: "### Перегляд HTML-звіту",
        },
        {
          en: "Locally opening the report does not work as expected as you need a web server for everything to work correctly. First, extract the zip, preferably in a folder that already has Playwright installed. Using the command line, change into the directory where the report is and use `npx playwright show-report` followed by the name of the extracted folder. This serves up the report and enables you to view it in your browser.",
          uk: "Відкрити звіт локально звично не вийде — потрібен вебсервер. Спочатку розпакуйте zip-архів, бажано в теку з установленим Playwright. У командному рядку перейдіть у папку зі звітом і виконайте `npx playwright show-report` із іменем розпакованої теки. Це запустить сервер і дасть змогу переглянути звіт у браузері.",
        },
        {
          en: "To learn more about reports, check out our detailed guide on [HTML Reporter](/test-reporters.md#html-reporter)",
          uk: "Детальніше про звіти — у нашому посібнику [HTML Reporter](/test-reporters.md#html-reporter)",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "bash",
          code: "npx playwright show-report name-of-my-extracted-playwright-report",
        },
      ],
    },
    {
      id: "viewing-the-trace",
      title: {
        en: "Viewing the Trace",
        uk: "Перегляд трас",
      },
      paragraphs: [
        {
          en: "Once you have served the report using `npx playwright show-report`, click on the trace icon next to the test's file name as seen in the image above. You can then view the trace of your tests and inspect each action to try to find out why the tests are failing.",
          uk: "Після запуску звіту командою `npx playwright show-report` натисніть іконку трасу поряд із назвою файлу тесту (як показано на зображенні вище). Так можна переглянути трасу тестів і перевірити кожну дію, щоб зрозуміти причину збою.",
        },
        {
          en: "[trace.playwright.dev](https://trace.playwright.dev) is a statically hosted variant of the Trace Viewer. You can upload trace files using drag and drop.",
          uk: "[trace.playwright.dev](https://trace.playwright.dev) — статично розгорнутий варіант Trace Viewer. Файли трас можна завантажити перетягуванням.",
        },
        {
          en: "![playwright trace viewer](./images/getting-started/trace-viewer-failed-test.png)",
          uk: "![playwright trace viewer](./images/getting-started/trace-viewer-failed-test.png)",
        },
      ],
    },
    {
      id: "publishing-report-on-the-web",
      title: {
        en: "Publishing report on the web",
        uk: "Публікація звіту в Інтернеті",
      },
      paragraphs: [
        {
          en: "Downloading the HTML report as a zip file is not very convenient. However, we can utilize Azure Storage's static websites hosting capabilities to easily and efficiently serve HTML reports on the Internet, requiring minimal configuration.",
          uk: "Завантаження HTML-звіту як zip-архіву не надто зручне. Проте можна скористатися можливостями статичного хостингу Azure Storage для простої й ефективної публікації HTML-звітів в Інтернеті з мінімальним налаштуванням.",
        },
        {
          en: "1. Create an [Azure Storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create).\n1. Enable [Static website hosting](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-how-to#enable-static-website-hosting) for the storage account.\n1. Create a Service Principal in Azure and grant it access to Azure Blob storage. Upon successful execution, the command will display the credentials which will be used in the next step.",
          uk: "1. Створіть [обліковий запис Azure Storage](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create).\n1. Увімкніть [статичний хостинг сайтів](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-how-to#enable-static-website-hosting) для облікового запису.\n1. Створіть Service Principal в Azure та надайте йому доступ до Azure Blob Storage.\n\nПісля успішного виконання команда виведе облікові дані для наступного кроку.",
        },
        {
          en: "1. Use the credentials from the previous step to set up encrypted secrets in your GitHub repository. Go to your repository's settings, under [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository), and add the following secrets:",
          uk: "1. Використайте облікові дані з попереднього кроку, щоб налаштувати зашифровані секрети в репозиторії GitHub. Перейдіть до налаштувань репозиторію, у розділ [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository), і додайте такі секрети:",
        },
        {
          en: "- `AZCOPY_SPA_APPLICATION_ID`\n    - `AZCOPY_SPA_CLIENT_SECRET`\n    - `AZCOPY_TENANT_ID`",
          uk: "- `AZCOPY_SPA_APPLICATION_ID`\n    - `AZCOPY_SPA_CLIENT_SECRET`\n    - `AZCOPY_TENANT_ID`",
        },
        {
          en: "For a detailed guide on how to authorize a service principal using a client secret, refer to [this Microsoft documentation](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-authorize-azure-active-directory#authorize-a-service-principal-by-using-a-client-secret).\n1. Add a step that uploads the HTML report to Azure Storage.",
          uk: "Детальніше про авторизацію Service Principal із клієнтським секретом — у [цій документації Microsoft](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-authorize-azure-active-directory#authorize-a-service-principal-by-using-a-client-secret).\n1. Додайте крок завантаження HTML-звіту в Azure Storage.",
        },
        {
          en: "The contents of the `$web` storage container can be accessed from a browser by using the [public URL](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-portal#portal-find-url) of the website.",
          uk: "Вміст контейнера `$web` доступний через браузер за [публічною URL-адресою](https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-portal#portal-find-url) сайту.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "bash",
          code: '    az ad sp create-for-rbac --name "github-actions" --role "Storage Blob Data Contributor" --scopes /subscriptions//resourceGroups//providers/Microsoft.Storage/storageAccounts/',
        },
        {
          id: "cb-7",
          language: "yaml",
          code: "    ...\n        - name: Upload HTML report to Azure\n          shell: bash\n          run: |\n            REPORT_DIR='run-${{ github.run_id }}-${{ github.run_attempt }}'\n            azcopy cp --recursive \"./playwright-report/*\" \"https://.blob.core.windows.net/\\$web/$REPORT_DIR\"\n            echo \"::notice title=HTML report url::https://.z1.web.core.windows.net/$REPORT_DIR/index.html\"\n          env:\n            AZCOPY_AUTO_LOGIN_TYPE: SPN\n            AZCOPY_SPA_APPLICATION_ID: '${{ secrets.AZCOPY_SPA_APPLICATION_ID }}'\n            AZCOPY_SPA_CLIENT_SECRET: '${{ secrets.AZCOPY_SPA_CLIENT_SECRET }}'\n            AZCOPY_TENANT_ID: '${{ secrets.AZCOPY_TENANT_ID }}'",
        },
      ],
    },
    {
      id: "properly-handling-secrets",
      title: {
        en: "Properly handling Secrets",
        uk: "Безпечне поводження з секретами",
      },
      paragraphs: [
        {
          en: "Artifacts like trace files, HTML reports or even the console logs contain information about your test execution.\nThey can contain sensitive data like user credentials for a test user, access tokens to a staging backend, testing source code, or sometimes even your application source code. Treat these files just as carefully as you treat that sensitive data.\nIf you upload reports and traces as part of your CI workflow, make sure that you only upload them to trusted artifact stores, or that you encrypt the files before upload. The same is true for sharing artifacts with team members: Use a trusted file share or encrypt the files before sharing.",
          uk: "Артефакти на кшталт файлів трас, HTML-звітів чи навіть консольних логів містять інформацію про виконання тестів.\nВони можуть включати чутливі дані: облікові дані тестового користувача, токени доступу до staging-бекенду, вихідний код тестів чи навіть код застосунку.\n\nЗберігайте ці файли так само обережно, як і самі чутливі дані.\nЯкщо ви завантажуєте звіти й траси в рамках CI-workflow, переконайтесь, що вивантажуєте їх лише до перевірених сховищ артефактів або шифруєте файли перед завантаженням. Те саме стосується передачі артефактів членам команди: використовуйте перевірене сховище файлів або шифруйте перед відправкою.",
        },
      ],
    },
    {
      id: "what-s-next",
      title: {
        en: "What's Next",
        uk: "Що далі",
      },
      paragraphs: [
        {
          en: "- [Learn how to use Locators](./locators.md)\n- [Learn how to perform Actions](./input.md)\n- [Learn how to write Assertions](./test-assertions.md)\n- [Learn more about the Trace Viewer](/trace-viewer.md)\n- [Learn more ways of running tests on GitHub Actions](/ci.md#github-actions)\n- [Learn more about running tests on other CI providers](/ci.md)",
          uk: "- [Дізнатися, як використовувати локатори](./locators.md)\n- [Дізнатися, як виконувати дії](./input.md)\n- [Дізнатися, як писати перевірки](./test-assertions.md)\n- [Дізнатися більше про Trace Viewer](/trace-viewer.md)\n- [Більше способів запуску тестів у GitHub Actions](/ci.md#github-actions)\n- [Більше про запуск тестів в інших CI-провайдерах](/ci.md)",
        },
      ],
    },
  ],
  quiz: [],
}
