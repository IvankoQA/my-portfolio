import type { PlaywrightTopic } from "../../types"

export const testShardingTopic: PlaywrightTopic = {
  slug: "test-sharding",
  groupId: "test-runner",
  order: 370,
  sourceDoc: "test-sharding-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-sharding",
  title: {
    en: "Sharding",
    uk: "Шардинг",
  },
  summary: {
    en: 'By default, Playwright runs test files in [parallel](./test-parallel.md) and strives for optimal utilization of CPU cores on your machine. In order to achieve even greater parallelisation, you can further scale Playwright test execution by running tests on multiple machines simultaneously. We call this mode of operation "sharding". Sharding in Playwright means splitting your tests into smaller parts called "shards…',
    uk: "За замовчуванням Playwright запускає тестові файли [паралельно](./test-parallel.md) й намагається оптимально використовувати ядра CPU. Для ще більшого паралелізму можна масштабувати виконання тестів Playwright на кількох машинах одночасно. Цей режим називають «шардинг». У Playwright шардинг означає розбиття тестів на менші частини — «шарди…",
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
          en: 'By default, Playwright runs test files in [parallel](./test-parallel.md) and strives for optimal utilization of CPU cores on your machine. In order to achieve even greater parallelisation, you can further scale Playwright test execution by running tests on multiple machines simultaneously. We call this mode of operation "sharding". Sharding in Playwright means splitting your tests into smaller parts called "shards". Each shard is like a separate job that can run independently. The whole purpose is to divide your tests to speed up test runtime.',
          uk: "За замовчуванням Playwright запускає тестові файли [паралельно](./test-parallel.md) й намагається оптимально використовувати ядра CPU на вашій машині. Для ще більшого паралелізму можна масштабувати виконання тестів Playwright на кількох машинах одночасно. Цей режим називають «шардинг». У Playwright шардинг означає розбиття тестів на менші частини — «шарди». Кожен шард подібний до окремого завдання, яке може виконуватися незалежно. Мета — розподілити тести, щоб прискорити прогін.",
        },
        {
          en: "When you shard your tests, each shard can run on its own, utilizing the available CPU cores. This helps speed up the testing process by doing tasks simultaneously.",
          uk: "Після шардингу кожен шард може працювати окремо, використовуючи доступні ядра CPU. Це пришвидшує тестування завдяки одночасному виконанню завдань.",
        },
        {
          en: "In a CI pipeline, each shard can run as a separate job, making use of the hardware resources available in your CI pipeline, like CPU cores, to run tests faster.",
          uk: "У CI-пайплайні кожен шард може бути окремим job, використовуючи апаратні ресурси пайплайну (зокрема ядра CPU) для швидшого прогону тестів.",
        },
      ],
    },
    {
      id: "sharding-tests-between-multiple-machines",
      title: {
        en: "Sharding tests between multiple machines",
        uk: "Шардинг тестів між кількома машинами",
      },
      paragraphs: [
        {
          en: "To shard the test suite, pass `--shard=x/y` to the command line. For example, to split the suite into four shards, each running one fourth of the tests:",
          uk: "Щоб розбити збірку на шарди, передайте в командному рядку `--shard=x/y`. Наприклад, розділити на чотири шарди, кожен з яких виконує чвертину тестів:",
        },
        {
          en: "Now, if you run these shards in parallel on different jobs, your test suite completes four times faster.",
          uk: "Якщо запускати ці шарди паралельно в різних job, збірка завершиться приблизно вчетверо швидше.",
        },
        {
          en: "Note that Playwright can only shard tests that can be run in parallel. By default, this means Playwright will shard test files. Learn about other options in the [parallelism guide](./test-parallel.md).",
          uk: "Playwright може шардити лише тести, які можна запускати паралельно. За замовчуванням це означає шардинг на рівні тестових файлів. Інші варіанти — у [посібнику з паралелізму](./test-parallel.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright test --shard=1/4\nnpx playwright test --shard=2/4\nnpx playwright test --shard=3/4\nnpx playwright test --shard=4/4",
        },
      ],
    },
    {
      id: "balancing-shards",
      title: {
        en: "Balancing Shards",
        uk: "Балансування шардів",
      },
      paragraphs: [
        {
          en: "Sharding can be done at two levels of granularity depending on whether you use the [`property: TestProject.fullyParallel`] option or not. This affects how the tests are balanced across the shards.",
          uk: "Шардинг можна робити на двох рівнях деталізації залежно від того, чи використовується [`property: TestProject.fullyParallel`]. Це впливає на балансування тестів між шардами.",
        },
        {
          en: "**Sharding with fullyParallel**",
          uk: "**Шардинг з fullyParallel**",
        },
        {
          en: "When `fullyParallel: true` is enabled, Playwright Test runs individual tests in parallel across multiple shards, ensuring each shard receives an even distribution of tests. This allows for test-level granularity, meaning each shard will attempt to balance the number of individual tests it runs. This is the preferred mode for ensuring even load distribution when sharding, as Playwright can optimize shard execution based on the total number of tests.",
          uk: "Якщо ввімкнено `fullyParallel: true`, Playwright Test запускає окремі тести паралельно на кількох шардах, рівномірно розподіляючи їх між шардами. Це дає деталізацію на рівні тесту: кожен шард намагається збалансувати кількість окремих тестів. Це бажаний режим для рівномірного навантаження при шардингу, оскільки Playwright може оптимізувати виконання за загальною кількістю тестів.",
        },
        {
          en: "**Sharding without fullyParallel**",
          uk: "**Шардинг без fullyParallel**",
        },
        {
          en: "Without the fullyParallel setting, Playwright Test defaults to file-level granularity, meaning entire test files are assigned to shards (note that the same file may be assigned to different shards across different projects). In this case, the number of tests per file can greatly influence shard distribution. If your test files are not evenly sized (i.e., some files contain many more tests than others), certain shards may end up running significantly more tests, while others may run fewer or even none.",
          uk: "Без `fullyParallel` Playwright Test за замовчуванням працює на рівні файлів: цілі тестові файли призначаються шардам (той самий файл може потрапляти в різні шарди в різних проєктах). Тоді кількість тестів у файлі сильно впливає на розподіл. Якщо файли нерівномірні (деякі містять набагато більше тестів), одні шарди можуть виконати значно більше тестів, а інші — менше або взагалі жодного.",
        },
        {
          en: "**Key Takeaways:**",
          uk: "**Головне:**",
        },
        {
          en: "- **With** `fullyParallel: true`: Tests are split at the individual test level, leading to more balanced shard execution.\n- **Without** `fullyParallel`: Tests are split at the file level, so to balance the shards, it's important to keep your test files small and evenly sized.\n- To ensure the most effective use of sharding, especially in CI environments, it is recommended to use `fullyParallel: true` when aiming for balanced distribution across shards. Otherwise, you may need to manually organize your test files to avoid imbalances.",
          uk: "- **З** `fullyParallel: true`: розбиття на рівні окремих тестів — рівніше навантаження на шарди.\n- **Без** `fullyParallel`: розбиття на рівні файлів — для балансу важливо тримати файли невеликими й рівномірними.\n- Для ефективного шардингу, зокрема в CI, рекомендовано `fullyParallel: true`, якщо потрібен рівномірний розподіл. Інакше доведеться вручну організовувати файли, щоб уникнути перекосів.",
        },
      ],
    },
    {
      id: "merging-reports-from-multiple-shards",
      title: {
        en: "Merging reports from multiple shards",
        uk: "Об’єднання звітів з кількох шардів",
      },
      paragraphs: [
        {
          en: "In the previous example, each test shard has its own test report. If you want to have a combined report showing all the test results from all the shards, you can merge them.",
          uk: "У попередньому прикладі кожен шард має власний звіт. Щоб отримати спільний звіт з усіма результатами, їх можна об’єднати.",
        },
        {
          en: "Start with adding `blob` reporter to the config when running on CI:",
          uk: "Спочатку додайте репортер `blob` у конфігурацію для запуску в CI:",
        },
        {
          en: "Blob report contains information about all the tests that were run and their results as well as all test attachments such as traces and screenshot diffs. Blob reports can be merged and converted to any other Playwright report. By default, blob report will be generated into `blob-report` directory. You can learn about [blob report options here](./test-reporters.md#blob-reporter).",
          uk: "Blob-звіт містить інформацію про всі виконані тести й результати, а також усі вкладення (трейси, diff скриншотів тощо). Blob-звіти можна злити й перетворити на будь-який інший звіт Playwright. За замовчуванням він генерується в каталог `blob-report`. [Опції blob-репортера](./test-reporters.md#blob-reporter).",
        },
        {
          en: "To merge reports from multiple shards, put the blob report files into a single directory, for example `all-blob-reports`. Blob report names contain shard number, so they will not clash.",
          uk: "Щоб об’єднати звіти з кількох шардів, покладіть файли blob-звітів в один каталог, наприклад `all-blob-reports`. У іменах є номер шарду, тож конфліктів не буде.",
        },
        {
          en: "Afterwards, run `npx playwright merge-reports` command:",
          uk: "Потім виконайте команду `npx playwright merge-reports`:",
        },
        {
          en: "This will produce a standard HTML report into `playwright-report` directory.",
          uk: "Буде згенеровано стандартний HTML-звіт у каталозі `playwright-report`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-2",
          language: "js",
          code: "export default defineConfig({\n  testDir: './tests',\n  reporter: process.env.CI ? 'blob' : 'html',\n});",
        },
        {
          id: "cb-3",
          language: "bash",
          code: "npx playwright merge-reports --reporter html ./all-blob-reports",
        },
      ],
    },
    {
      id: "github-actions-example",
      title: {
        en: "GitHub Actions example",
        uk: "Приклад для GitHub Actions",
      },
      paragraphs: [
        {
          en: "GitHub Actions supports [sharding tests between multiple jobs](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) using the [`jobs..strategy.matrix`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix) option. The `matrix` option will run a separate job for every possible combination of the provided options.",
          uk: "GitHub Actions підтримує [шардинг тестів між кількома job](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs) через опцію [`jobs..strategy.matrix`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix). `matrix` запускає окремий job для кожної комбінації заданих опцій.",
        },
        {
          en: "The following example shows you how to configure a job to run your tests on four machines in parallel and then merge the reports into a single report. Don't forget to add `reporter: process.env.CI ? 'blob' : 'html',` to your `playwright.config.ts` file as in the example above.",
          uk: "Нижче — як налаштувати job для паралельного прогону на чотирьох машинах і злиття звітів в один. Не забудьте додати `reporter: process.env.CI ? 'blob' : 'html',` у `playwright.config.ts`, як у прикладі вище.",
        },
        {
          en: "1. First we add a `matrix` option to our job configuration with the `shardTotal: [4]` option containing the total number of shards we want to create and `shardIndex: [1, 2, 3, 4]` with an array of the shard numbers.",
          uk: "1. Додаємо до job опцію `matrix`: `shardTotal: [4]` — загальна кількість шардів і `shardIndex: [1, 2, 3, 4]` — масив номерів шардів.",
        },
        {
          en: "1. Then we run our Playwright tests with the `--shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}` option. This will run our test command for each shard.",
          uk: "1. Запускаємо тести Playwright з `--shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}` — команда виконається для кожного шарду.",
        },
        {
          en: "1. Finally we upload our blob report to the GitHub Actions Artifacts. This will make the blob report available to other jobs in the workflow.",
          uk: "1. Завантажуємо blob-звіт у GitHub Actions Artifacts, щоб інші job у workflow могли його використати.",
        },
        {
          en: "1. After all shards have completed, you can run a separate job that will merge the reports and produce a combined [HTML report](./test-reporters.md#html-reporter). To ensure the execution order, we make the `merge-reports` job [depend](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow#defining-prerequisite-jobs) on our sharded `playwright-tests` job by adding `needs: [playwright-tests]`.",
          uk: "1. Після завершення всіх шардів можна запустити окремий job, який злиє звіти в один [HTML-звіт](./test-reporters.md#html-reporter). Для порядку виконання job `merge-reports` [залежить](https://docs.github.com/en/actions/using-jobs/using-jobs-in-a-workflow#defining-prerequisite-jobs) від шардованого `playwright-tests` через `needs: [playwright-tests]`.",
        },
        {
          en: "You can now see the reports have been merged and a combined HTML report is available in the GitHub Actions Artifacts tab.",
          uk: "У вкладці Artifacts GitHub Actions з’явиться об’єднаний HTML-звіт.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "yaml",
          code: "name: Playwright Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\njobs:\n  playwright-tests:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    strategy:\n      fail-fast: false\n      matrix:\n        shardIndex: [1, 2, 3, 4]\n        shardTotal: [4]\n    steps:\n    - uses: actions/checkout@v5\n    - uses: actions/setup-node@v5\n      with:\n        node-version: lts/*\n    - name: Install dependencies\n      run: npm ci\n    - name: Install Playwright browsers\n      run: npx playwright install --with-deps\n\n    - name: Run Playwright tests\n      run: npx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}\n\n    - name: Upload blob report to GitHub Actions Artifacts\n      if: ${{ !cancelled() }}\n      uses: actions/upload-artifact@v4\n      with:\n        name: blob-report-${{ matrix.shardIndex }}\n        path: blob-report\n        retention-days: 1",
        },
        {
          id: "cb-5",
          language: "yaml",
          code: "jobs:\n...\n  merge-reports:\n    # Merge reports after playwright-tests, even if some shards have failed\n    if: ${{ !cancelled() }}\n    needs: [playwright-tests]\n\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v5\n    - uses: actions/setup-node@v5\n      with:\n        node-version: lts/*\n    - name: Install dependencies\n      run: npm ci\n\n    - name: Download blob reports from GitHub Actions Artifacts\n      uses: actions/download-artifact@v5\n      with:\n        path: all-blob-reports\n        pattern: blob-report-*\n        merge-multiple: true\n\n    - name: Merge into HTML Report\n      run: npx playwright merge-reports --reporter html ./all-blob-reports\n\n    - name: Upload HTML report\n      uses: actions/upload-artifact@v4\n      with:\n        name: html-report--attempt-${{ github.run_attempt }}\n        path: playwright-report\n        retention-days: 14",
        },
      ],
    },
    {
      id: "merging-reports-from-multiple-environments",
      title: {
        en: "Merging reports from multiple environments",
        uk: "Об’єднання звітів з кількох середовищ",
      },
      paragraphs: [
        {
          en: "If you want to run the same tests in multiple environments, as opposed to shard your tests onto multiple machines, you need to differentiate these environments.",
          uk: "Якщо потрібно запускати ті самі тести в кількох середовищах (а не шардити на кілька машин), ці середовища слід розрізняти.",
        },
        {
          en: "In this case, it is useful to specify the [`property: TestConfig.tag`] property, to tag all tests with the environment name. This tag will be automatically picked up by the blob report and later on by the merge tool.",
          uk: "Корисно задати [`property: TestConfig.tag`], щоб позначити всі тести назвою середовища. Тег автоматично потрапить у blob-звіт і згодом у інструмент злиття.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: process.env.CI ? 'blob' : 'html',\n  tag: process.env.CI_ENVIRONMENT_NAME,  // for example \"@APIv2\"\n});",
        },
      ],
    },
    {
      id: "merge-reports-cli",
      title: {
        en: "Merge-reports CLI",
        uk: "CLI merge-reports",
      },
      paragraphs: [
        {
          en: "`npx playwright merge-reports path/to/blob-reports-dir` reads all blob reports from the passed directory and merges them into a single report.",
          uk: "`npx playwright merge-reports path/to/blob-reports-dir` читає всі blob-звіти з переданого каталогу й об’єднує їх в один звіт.",
        },
        {
          en: "When merging reports from different OS'es you'll have to provide an explicit merge config to disambiguate which directory should be used as tests root.",
          uk: "При злитті звітів з різних ОС потрібна явна конфігурація merge, щоб однозначно вказати кореневий каталог тестів.",
        },
        {
          en: "Supported options:\n- `--reporter reporter-to-use`",
          uk: "Підтримувані опції:\n- `--reporter reporter-to-use`",
        },
        {
          en: "Which report to produce. Can be multiple reporters separated by comma.",
          uk: "Який звіт згенерувати. Можна кілька репортерів через кому.",
        },
        {
          en: "Example:",
          uk: "Приклад:",
        },
        {
          en: "- `--config path/to/config/file`",
          uk: "- `--config path/to/config/file`",
        },
        {
          en: "Specifies the Playwright configuration file with output reporters. Use this option to pass\n  additional configuration to the output reporter. This configuration file can differ from\n  the one used during the creation of blob reports.",
          uk: "Вказує файл конфігурації Playwright з вихідними репортерами. Через цю опцію передають\n  додаткову конфігурацію вихідному репортеру. Файл може відрізнятися від того,\n  що використовувався під час створення blob-звітів.",
        },
        {
          en: "Example:",
          uk: "Приклад:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "bash",
          code: "  npx playwright merge-reports --reporter=html,github ./blob-reports",
        },
        {
          id: "cb-8",
          language: "bash",
          code: "  npx playwright merge-reports --config=merge.config.ts ./blob-reports",
        },
        {
          id: "cb-9",
          language: "js",
          code: "  export default {\n    testDir: 'e2e',\n    reporter: [['html', { open: 'never' }]],\n  };",
        },
      ],
    },
  ],
  quiz: [],
}
