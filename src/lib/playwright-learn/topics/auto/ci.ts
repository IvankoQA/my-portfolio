import type { PlaywrightTopic } from "../../types"

export const ciTopic: PlaywrightTopic = {
  slug: "ci",
  groupId: "ci",
  order: 140,
  sourceDoc: "ci.md",
  officialDocsUrl: "https://playwright.dev/docs/ci",
  title: {
    en: "Continuous Integration",
    uk: "Безперервна інтеграція (CI)",
  },
  summary: {
    en: "Playwright tests can be executed in CI environments. We have created sample configurations for common CI providers.",
    uk: "Тести Playwright можна запускати в CI; у документації є готові приклади конфігурацій для поширених провайдерів.",
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
          en: "Playwright tests can be executed in CI environments. We have created sample\nconfigurations for common CI providers.",
          uk: "Тести Playwright можна запускати в CI-середовищах. Для поширених CI-провайдерів підготовлено готові приклади конфігурацій.",
        },
        {
          en: "3 steps to get your tests running on CI:",
          uk: "3 кроки для запуску тестів у CI:",
        },
        {
          en: "1. **Ensure CI agent can run browsers**: Use [our Docker image](./docker.md)\n   in Linux agents or install your dependencies using the [CLI](./browsers#install-system-dependencies).\n1. **Install Playwright**:",
          uk: "1. **Переконайтеся, що CI-агент може запускати браузери**: використовуйте [наш Docker-образ](./docker.md)\n   на Linux-агентах або встановіть залежності через [CLI](./browsers#install-system-dependencies).\n1. **Встановіть Playwright**:",
        },
        {
          en: "1. **Run your tests**:",
          uk: "1. **Запустіть тести**:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "   # Install NPM packages\n   npm ci\n\n   # Install Playwright browsers and dependencies\n   npx playwright install --with-deps",
        },
        {
          id: "cb-5",
          language: "bash",
          code: "   npx playwright test",
        },
      ],
    },
    {
      id: "workers",
      title: {
        en: "Workers",
        uk: "Воркери",
      },
      paragraphs: [
        {
          en: 'We recommend setting [workers](./api/class-testconfig.md#test-config-workers) to "1" in CI environments to prioritize stability and reproducibility. Running tests sequentially ensures each test gets the full system resources, avoiding potential conflicts. However, if you have a powerful self-hosted CI system, you may enable [parallel](./test-parallel.md) tests. For wider parallelization, consider [sharding](./test-parallel.md#shard-tests-between-multiple-machines) - distributing tests across multiple CI jobs.',
          uk: 'У CI-середовищах рекомендується встановлювати [workers](./api/class-testconfig.md#test-config-workers) у значення `"1"`, щоб забезпечити стабільність і відтворюваність. Послідовне виконання тестів гарантує кожному тесту повний доступ до системних ресурсів і виключає конфлікти. Якщо у вас потужний self-hosted CI, можна увімкнути [паралельне](./test-parallel.md) виконання тестів.\n\nДля ширшого паралелізму розгляньте [шардинг](./test-parallel.md#shard-tests-between-multiple-machines) — розподіл тестів між кількома CI-завданнями.',
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "js",
          code: "\nexport default defineConfig({\n  // Opt out of parallel tests on CI.\n  workers: process.env.CI ? 1 : undefined,\n});",
        },
      ],
    },
    {
      id: "ci-configurations",
      title: {
        en: "CI configurations",
        uk: "CI-конфігурації",
      },
      paragraphs: [
        {
          en: "The [Command line tools](./browsers#install-system-dependencies) can be used to install all operating system dependencies in CI.",
          uk: "За допомогою [CLI-інструментів](./browsers#install-system-dependencies) можна встановити всі системні залежності ОС у CI.",
        },
        {
          en: "### GitHub Actions",
          uk: "### GitHub Actions",
        },
        {
          en: "#### On push/pull_request",
          uk: "#### При push/pull_request",
        },
        {
          en: "Tests will run on push or pull request on branches main/master. The [workflow](https://docs.github.com/en/actions/using-workflows/about-workflows) will install all dependencies, install Playwright and then run the tests. It will also create the HTML report.",
          uk: "Тести запускаються при push або pull request у гілки main/master. [Workflow](https://docs.github.com/en/actions/using-workflows/about-workflows) встановлює всі залежності, Playwright і виконує тести. Також створюється HTML-звіт.",
        },
        {
          en: "#### On push/pull_request (sharded)",
          uk: "#### При push/pull_request (з шардингом)",
        },
        {
          en: "GitHub Actions supports [sharding tests between multiple jobs](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs). Check out our [sharding doc](./test-sharding) to learn more about sharding and to see a [GitHub actions example](./test-sharding.md#github-actions-example) of how to configure a job to run your tests on multiple machines as well as how to merge the HTML reports.",
          uk: "GitHub Actions підтримує [розподіл тестів між кількома завданнями](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs). Детальніше — у [документації з шардингу](./test-sharding), включно з [прикладом для GitHub Actions](./test-sharding.md#github-actions-example) налаштування завдань для запуску тестів на кількох машинах і об'єднання HTML-звітів.",
        },
        {
          en: "#### Via Containers",
          uk: "#### Через контейнери",
        },
        {
          en: "GitHub Actions support [running jobs in a container](https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container) by using the [`jobs.<job_id>.container`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer) option. This is useful to not pollute the host environment with dependencies and to have a consistent environment for e.g. screenshots/visual regression testing across different operating systems.",
          uk: "GitHub Actions підтримує [запуск завдань у контейнері](https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container) за допомогою параметра [`jobs.<job_id>.container`](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idcontainer). Це корисно, щоб не засмічувати середовище хоста залежностями й мати узгоджене середовище, наприклад для скриншотів/візуального регресійного тестування на різних ОС.",
        },
        {
          en: "#### On deployment",
          uk: "#### При деплої",
        },
        {
          en: "This will start the tests after a [GitHub Deployment](https://developer.github.com/v3/repos/deployments/) went into the `success` state.\nServices like Vercel use this pattern so you can run your end-to-end tests on their deployed environment.",
          uk: "Тести запустяться після того, як [GitHub Deployment](https://developer.github.com/v3/repos/deployments/) перейде у стан `success`.\nТак працюють такі сервіси, як Vercel — вони дозволяють запускати end-to-end тести в задеплоєному середовищі.",
        },
        {
          en: "#### Fail-Fast",
          uk: "#### Fail-Fast",
        },
        {
          en: "Large test suites can take very long to execute. By executing a preliminary test run with the `--only-changed` flag, you can run test files that are likely to fail first.\nThis will give you a faster feedback loop and slightly lower CI consumption while working on Pull Requests.\nTo detect test files affected by your changeset, `--only-changed` analyses your suites' dependency graph. This is a heuristic and might miss tests, so it's important that you always run the full test suite after the preliminary test run.",
          uk: "Великі тестові набори можуть виконуватися дуже довго. Попередній запуск із прапором `--only-changed` дозволяє спочатку виконати тести, що, швидше за все, впадуть.\nЦе прискорює зворотний зв'язок і трохи знижує використання CI при роботі над Pull Request.\nЩоб виявити тестові файли, яких торкнулася ваша зміна, `--only-changed` аналізує граф залежностей тестового набору.\n\nЦе евристика, яка може пропустити деякі тести — тому завжди важливо після попереднього запуску виконати повний тестовий набір.",
        },
        {
          en: "### Docker",
          uk: "### Docker",
        },
        {
          en: "We have a [pre-built Docker image](./docker.md) which can either be used directly or as a reference to update your existing Docker definitions. Make sure to follow the [Recommended Docker Configuration](./docker.md#recommended-docker-configuration) to ensure the best performance.",
          uk: "Є [готовий Docker-образ](./docker.md), який можна використовувати безпосередньо або як зразок для оновлення наявних Docker-визначень. Обов'язково дотримуйтесь [рекомендованої конфігурації Docker](./docker.md#recommended-docker-configuration) для найкращої продуктивності.",
        },
        {
          en: "### Azure Pipelines",
          uk: "### Azure Pipelines",
        },
        {
          en: "For Windows or macOS agents, no additional configuration is required, just install Playwright and run your tests.",
          uk: "Для Windows або macOS агентів додаткової конфігурації не потрібно — просто встановіть Playwright і запустіть тести.",
        },
        {
          en: "For Linux agents, you can use [our Docker container](./docker.md) with Azure\nPipelines support [running containerized\njobs](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/container-phases?view=azure-devops).\nAlternatively, you can use [Command line tools](./browsers#install-system-dependencies) to install all necessary dependencies.",
          uk: "Для Linux-агентів можна використовувати [наш Docker-контейнер](./docker.md) з Azure\nPipelines, що підтримує [запуск у контейнерах](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/container-phases?view=azure-devops).\nАбо скористайтесь [CLI-інструментами](./browsers#install-system-dependencies) для встановлення всіх необхідних залежностей.",
        },
        {
          en: "For running the Playwright tests use this pipeline task:",
          uk: "Для запуску тестів Playwright використовуйте таке pipeline-завдання:",
        },
        {
          en: "#### Uploading playwright-report folder with Azure Pipelines",
          uk: "#### Завантаження папки playwright-report через Azure Pipelines",
        },
        {
          en: "This will make the pipeline run fail if any of the playwright tests fails.\nIf you also want to integrate the test results with Azure DevOps, use the task `PublishTestResults` task like so:",
          uk: "Це призведе до завершення pipeline з помилкою, якщо будь-який тест Playwright не пройде.\nЯкщо ви також хочете інтегрувати результати тестів із Azure DevOps, використовуйте завдання `PublishTestResults` ось так:",
        },
        {
          en: "Note: The JUnit reporter needs to be configured accordingly via",
          uk: "Примітка: JUnit-репортер потрібно відповідно налаштувати через",
        },
        {
          en: "in `playwright.config.ts`.",
          uk: "у `playwright.config.ts`.",
        },
        {
          en: "#### Azure Pipelines (sharded)",
          uk: "#### Azure Pipelines (з шардингом)",
        },
        {
          en: "#### Azure Pipelines (containerized)",
          uk: "#### Azure Pipelines (у контейнері)",
        },
        {
          en: "### CircleCI",
          uk: "### CircleCI",
        },
        {
          en: "Running Playwright on CircleCI is very similar to running on GitHub Actions. In order to specify the pre-built Playwright [Docker image](./docker.md), simply modify the agent definition with `docker:` in your config like so:",
          uk: "Запуск Playwright у CircleCI дуже схожий на GitHub Actions. Щоб вказати готовий Docker-образ [Playwright](./docker.md), змініть визначення агента, додавши `docker:` у конфіг:",
        },
        {
          en: "Note: When using the docker agent definition, you are specifying the resource class of where playwright runs to the 'medium' tier [here](https://circleci.com/docs/configuration-reference?#docker-execution-environment). The default behavior of Playwright is to set the number of workers to the detected core count (2 in the case of the medium tier). Overriding the number of workers to greater than this number will cause unnecessary timeouts and failures.",
          uk: "Примітка: при використанні визначення агента docker, ви вказуєте клас ресурсів для Playwright — 'medium' рівень [тут](https://circleci.com/docs/configuration-reference?#docker-execution-environment). За замовчуванням Playwright встановлює кількість воркерів відповідно до кількості виявлених ядер (2 для 'medium'). Перевищення цього значення призведе до зайвих тайм-аутів і збоїв.",
        },
        {
          en: "#### Sharding in CircleCI",
          uk: "#### Шардинг у CircleCI",
        },
        {
          en: "Sharding in CircleCI is indexed with 0 which means that you will need to override the default parallelism ENV VARS. The following example demonstrates how to run Playwright with a CircleCI Parallelism of 4 by adding 1 to the `CIRCLE_NODE_INDEX` to pass into the `--shard` cli arg.",
          uk: "Шардинг у CircleCI індексується з 0 — тому потрібно перевизначити ENV-змінні паралелізму за замовчуванням. У прикладі нижче показано, як запустити Playwright із CircleCI Parallelism = 4, додаючи 1 до `CIRCLE_NODE_INDEX` для передачі в аргумент CLI `--shard`.",
        },
        {
          en: "### Jenkins",
          uk: "### Jenkins",
        },
        {
          en: "Jenkins supports Docker agents for pipelines. Use the [Playwright Docker image](./docker.md)\nto run tests on Jenkins.",
          uk: "Jenkins підтримує Docker-агенти для pipeline. Використовуйте [Docker-образ Playwright](./docker.md)\nдля запуску тестів у Jenkins.",
        },
        {
          en: "### Bitbucket Pipelines",
          uk: "### Bitbucket Pipelines",
        },
        {
          en: "Bitbucket Pipelines can use public [Docker images as build environments](https://confluence.atlassian.com/bitbucket/use-docker-images-as-build-environments-792298897.html). To run Playwright tests on Bitbucket, use our public Docker image ([see Dockerfile](./docker.md)).",
          uk: "Bitbucket Pipelines може використовувати публічні [Docker-образи як середовища збірки](https://confluence.atlassian.com/bitbucket/use-docker-images-as-build-environments-792298897.html). Для запуску тестів Playwright у Bitbucket використовуйте наш публічний Docker-образ ([переглянути Dockerfile](./docker.md)).",
        },
        {
          en: "### GitLab CI",
          uk: "### GitLab CI",
        },
        {
          en: "To run Playwright tests on GitLab, use our public Docker image ([see Dockerfile](./docker.md)).",
          uk: "Для запуску тестів Playwright у GitLab використовуйте наш публічний Docker-образ ([переглянути Dockerfile](./docker.md)).",
        },
        {
          en: "#### Sharding",
          uk: "#### Шардинг",
        },
        {
          en: "GitLab CI supports [sharding tests between multiple jobs](https://docs.gitlab.com/ee/ci/jobs/job_control.html#parallelize-large-jobs) using the [parallel](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel) keyword. The test job will be split into multiple smaller jobs that run in parallel. Parallel jobs are named sequentially from `job_name 1/N` to `job_name N/N`.",
          uk: "GitLab CI підтримує [розподіл тестів між кількома завданнями](https://docs.gitlab.com/ee/ci/jobs/job_control.html#parallelize-large-jobs) за допомогою ключового слова [parallel](https://docs.gitlab.com/ee/ci/yaml/index.html#parallel). Тестове завдання розбивається на кілька менших завдань, що виконуються паралельно. Паралельні завдання іменуються послідовно від `job_name 1/N` до `job_name N/N`.",
        },
        {
          en: "GitLab CI also supports sharding tests between multiple jobs using the [parallel:matrix](https://docs.gitlab.com/ee/ci/yaml/index.html#parallelmatrix) option. The test job will run multiple times in parallel in a single pipeline, but with different variable values for each instance of the job. In the example below, we have 2 `PROJECT` values and 10 `SHARD` values, resulting in a total of 20 jobs to be run.",
          uk: "GitLab CI також підтримує шардинг між кількома завданнями за допомогою параметра [parallel:matrix](https://docs.gitlab.com/ee/ci/yaml/index.html#parallelmatrix). Тестове завдання запускається кілька разів паралельно в одному pipeline, але з різними значеннями змінних. У прикладі нижче — 2 значення `PROJECT` і 10 значень `SHARD`, усього 20 завдань.",
        },
        {
          en: "### Google Cloud Build",
          uk: "### Google Cloud Build",
        },
        {
          en: "To run Playwright tests on Google Cloud Build, use our public Docker image ([see Dockerfile](./docker.md)).",
          uk: "Для запуску тестів Playwright у Google Cloud Build використовуйте наш публічний Docker-образ ([переглянути Dockerfile](./docker.md)).",
        },
        {
          en: "### Drone",
          uk: "### Drone",
        },
        {
          en: "To run Playwright tests on Drone, use our public Docker image ([see Dockerfile](./docker.md)).",
          uk: "Для запуску тестів Playwright у Drone використовуйте наш публічний Docker-образ ([переглянути Dockerfile](./docker.md)).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-10",
          language: "yml",
          code: "name: Playwright Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\njobs:\n  test:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v5\n    - uses: actions/setup-node@v6\n      with:\n        node-version: lts/*\n    - name: Install dependencies\n      run: npm ci\n    - name: Install Playwright Browsers\n      run: npx playwright install --with-deps\n    - name: Run Playwright tests\n      run: npx playwright test\n    - uses: actions/upload-artifact@v5\n      if: ${{ !cancelled() }}\n      with:\n        name: playwright-report\n        path: playwright-report/\n        retention-days: 30",
        },
        {
          id: "cb-14",
          language: "yml",
          code: "name: Playwright Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\njobs:\n  playwright:\n    name: 'Playwright Tests'\n    runs-on: ubuntu-latest\n    container:\n      image: mcr.microsoft.com/playwright:v%%VERSION%%-noble\n      options: --user 1001\n    steps:\n      - uses: actions/checkout@v5\n      - uses: actions/setup-node@v6\n        with:\n          node-version: lts/*\n      - name: Install dependencies\n        run: npm ci\n      - name: Run your tests\n        run: npx playwright test",
        },
        {
          id: "cb-18",
          language: "yml",
          code: "name: Playwright Tests\non:\n  deployment_status:\njobs:\n  test:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    if: github.event.deployment_status.state == 'success'\n    steps:\n    - uses: actions/checkout@v5\n    - uses: actions/setup-node@v6\n      with:\n        node-version: lts/*\n    - name: Install dependencies\n      run: npm ci\n    - name: Install Playwright\n      run: npx playwright install --with-deps\n    - name: Run Playwright tests\n      run: npx playwright test\n      env:\n        PLAYWRIGHT_TEST_BASE_URL: ${{ github.event.deployment_status.target_url }}",
        },
        {
          id: "cb-22",
          language: "yml",
          code: "name: Playwright Tests\non:\n  push:\n    branches: [ main, master ]\n  pull_request:\n    branches: [ main, master ]\njobs:\n  test:\n    timeout-minutes: 60\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v5\n      with:\n        # Force a non-shallow checkout, so that we can reference $GITHUB_BASE_REF.\n        # See https://github.com/actions/checkout for more details.\n        fetch-depth: 0\n    - uses: actions/setup-node@v6\n      with:\n        node-version: lts/*\n    - name: Install dependencies\n      run: npm ci\n    - name: Install Playwright Browsers\n      run: npx playwright install --with-deps\n    - name: Run changed Playwright tests\n      run: npx playwright test --only-changed=origin/$GITHUB_BASE_REF\n      if: github.event_name == 'pull_request'\n    - name: Run Playwright tests\n      run: npx playwright test\n    - uses: actions/upload-artifact@v5\n      if: ${{ !cancelled() }}\n      with:\n        name: playwright-report\n        path: playwright-report/\n        retention-days: 30",
        },
        {
          id: "cb-23",
          language: "yml",
          code: "trigger:\n- main\n\npool:\n  vmImage: ubuntu-latest\n\nsteps:\n- task: UseNode@1\n  inputs:\n    version: '22'\n  displayName: 'Install Node.js'\n- script: npm ci\n  displayName: 'npm ci'\n- script: npx playwright install --with-deps\n  displayName: 'Install Playwright browsers'\n- script: npx playwright test\n  displayName: 'Run Playwright tests'\n  env:\n    CI: 'true'",
        },
        {
          id: "cb-27",
          language: "yml",
          code: "trigger:\n- main\n\npool:\n  vmImage: ubuntu-latest\n\nsteps:\n- task: UseNode@1\n  inputs:\n    version: '22'\n  displayName: 'Install Node.js'\n\n- script: npm ci\n  displayName: 'npm ci'\n- script: npx playwright install --with-deps\n  displayName: 'Install Playwright browsers'\n- script: npx playwright test\n  displayName: 'Run Playwright tests'\n  env:\n    CI: 'true'\n- task: PublishTestResults@2\n  displayName: 'Publish test results'\n  inputs:\n    searchFolder: 'test-results'\n    testResultsFormat: 'JUnit'\n    testResultsFiles: 'e2e-junit-results.xml'\n    mergeTestResults: true\n    failTaskOnFailedTests: true\n    testRunTitle: 'My End-To-End Tests'\n  condition: succeededOrFailed()\n- task: PublishPipelineArtifact@1\n  inputs:\n    targetPath: playwright-report\n    artifact: playwright-report\n    publishLocation: 'pipeline'\n  condition: succeededOrFailed()",
        },
        {
          id: "cb-28",
          language: "js",
          code: "\nexport default defineConfig({\n  reporter: [['junit', { outputFile: 'test-results/e2e-junit-results.xml' }]],\n});",
        },
        {
          id: "cb-29",
          language: "yaml",
          code: "trigger:\n- main\n\npool:\n  vmImage: ubuntu-latest\n\nstrategy:\n  matrix:\n    chromium-1:\n      project: chromium\n      shard: 1/3\n    chromium-2:\n      project: chromium\n      shard: 2/3\n    chromium-3:\n      project: chromium\n      shard: 3/3\n    firefox-1:\n      project: firefox\n      shard: 1/3\n    firefox-2:\n      project: firefox\n      shard: 2/3\n    firefox-3:\n      project: firefox\n      shard: 3/3\n    webkit-1:\n      project: webkit\n      shard: 1/3\n    webkit-2:\n      project: webkit\n      shard: 2/3\n    webkit-3:\n      project: webkit\n      shard: 3/3\nsteps:\n- task: UseNode@1\n  inputs:\n    version: '22'\n  displayName: 'Install Node.js'\n\n- script: npm ci\n  displayName: 'npm ci'\n- script: npx playwright install --with-deps\n  displayName: 'Install Playwright browsers'\n- script: npx playwright test --project=$(project) --shard=$(shard)\n  displayName: 'Run Playwright tests'\n  env:\n    CI: 'true'",
        },
        {
          id: "cb-30",
          language: "yml",
          code: "trigger:\n- main\n\npool:\n  vmImage: ubuntu-latest\ncontainer: mcr.microsoft.com/playwright:v%%VERSION%%-noble\n\nsteps:\n- task: UseNode@1\n  inputs:\n    version: '22'\n  displayName: 'Install Node.js'\n\n- script: npm ci\n  displayName: 'npm ci'\n- script: npx playwright test\n  displayName: 'Run Playwright tests'\n  env:\n    CI: 'true'",
        },
        {
          id: "cb-34",
          language: "yml",
          code: "executors:\n  pw-noble-development:\n    docker:\n      - image: mcr.microsoft.com/playwright:v%%VERSION%%-noble",
        },
        {
          id: "cb-38",
          language: "yml",
          code: `    playwright-job-name:\n      executor: pw-noble-development\n      parallelism: 4\n      steps:\n        - run: SHARD="$((\${CIRCLE_NODE_INDEX}+1))"; npx playwright test --shard=\${SHARD}/\${CIRCLE_NODE_TOTAL}`,
        },
        {
          id: "cb-39",
          language: "groovy",
          code: "pipeline {\n   agent { docker { image 'mcr.microsoft.com/playwright:v%%VERSION%%-noble' } }\n   stages {\n      stage('e2e-tests') {\n         steps {\n            sh 'npm ci'\n            sh 'npx playwright test'\n         }\n      }\n   }\n}",
        },
        {
          id: "cb-43",
          language: "yml",
          code: "image: mcr.microsoft.com/playwright:v%%VERSION%%-noble",
        },
        {
          id: "cb-47",
          language: "yml",
          code: "stages:\n  - test\n\ntests:\n  stage: test\n  image: mcr.microsoft.com/playwright:v%%VERSION%%-noble\n  script:\n  ...",
        },
        {
          id: "cb-51",
          language: "yml",
          code: "stages:\n  - test\n\ntests:\n  stage: test\n  image: mcr.microsoft.com/playwright:v%%VERSION%%-noble\n  parallel: 7\n  script:\n    - npm ci\n    - npx playwright test --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL",
        },
        {
          id: "cb-52",
          language: "yml",
          code: "stages:\n  - test\n\ntests:\n  stage: test\n  image: mcr.microsoft.com/playwright:v%%VERSION%%-noble\n  parallel:\n    matrix:\n      - PROJECT: ['chromium', 'webkit']\n        SHARD: ['1/10', '2/10', '3/10', '4/10', '5/10', '6/10', '7/10', '8/10', '9/10', '10/10']\n  script:\n    - npm ci\n    - npx playwright test --project=$PROJECT --shard=$SHARD",
        },
        {
          id: "cb-53",
          language: "yml",
          code: "steps:\n- name: mcr.microsoft.com/playwright:v%%VERSION%%-noble\n  script: \n  ...\n  env:\n  - 'CI=true'",
        },
        {
          id: "cb-54",
          language: "yml",
          code: "kind: pipeline\nname: default\ntype: docker\n\nsteps:\n  - name: test\n    image: mcr.microsoft.com/playwright:v%%VERSION%%-noble\n    commands:\n      - npx playwright test",
        },
      ],
    },
    {
      id: "caching-browsers",
      title: {
        en: "Caching browsers",
        uk: "Кешування браузерів",
      },
      paragraphs: [
        {
          en: "Caching browser binaries is not recommended, since the amount of time it takes to restore the cache is comparable to the time it takes to download the binaries. Especially under Linux, [operating system dependencies](./browsers.md#install-system-dependencies) need to be installed, which are not cacheable.",
          uk: "Кешування бінарних файлів браузерів не рекомендується — час відновлення кешу порівнянний із часом їх завантаження. Особливо на Linux потрібно встановлювати [системні залежності ОС](./browsers.md#install-system-dependencies), які не кешуються.",
        },
        {
          en: "If you still want to cache the browser binaries between CI runs, cache [these directories](./browsers.md#managing-browser-binaries) in your CI configuration, against a hash of the Playwright version.",
          uk: "Якщо все ж хочете кешувати бінарні файли браузерів між запусками CI, закешуйте [ці директорії](./browsers.md#managing-browser-binaries) у своїй CI-конфігурації, прив'язавши кеш до хешу версії Playwright.",
        },
      ],
    },
    {
      id: "debugging-browser-launches",
      title: {
        en: "Debugging browser launches",
        uk: "Налагодження запуску браузерів",
      },
      paragraphs: [
        {
          en: "Playwright supports the `DEBUG` environment variable to output debug logs during execution. Setting it to `pw:browser` is helpful while debugging `Error: Failed to launch browser` errors.",
          uk: "Playwright підтримує змінну середовища `DEBUG` для виведення налагоджувальних логів під час виконання. Встановлення значення `pw:browser` допомагає при налагодженні помилок `Error: Failed to launch browser`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-55",
          language: "bash",
          code: "DEBUG=pw:browser npx playwright test",
        },
      ],
    },
    {
      id: "running-headed",
      title: {
        en: "Running headed",
        uk: "Запуск у режимі headed",
      },
      paragraphs: [
        {
          en: "By default, Playwright launches browsers in headless mode. See in our [Running tests](./running-tests.md#run-tests-in-headed-mode) guide how to run tests in headed mode.",
          uk: "За замовчуванням Playwright запускає браузери у headless-режимі. Дивіться у нашому посібнику [Запуск тестів](./running-tests.md#run-tests-in-headed-mode), як запускати тести у headed-режимі.",
        },
        {
          en: "On Linux agents, headed execution requires [Xvfb](https://en.wikipedia.org/wiki/Xvfb) to be installed. Our [Docker image](./docker.md) and GitHub Action have Xvfb pre-installed. To run browsers in headed mode with Xvfb, add `xvfb-run` before the actual command.",
          uk: "На Linux-агентах для запуску в headed-режимі потрібно встановити [Xvfb](https://en.wikipedia.org/wiki/Xvfb). Наш [Docker-образ](./docker.md) і GitHub Action мають Xvfb попередньо встановленим. Щоб запустити браузери у headed-режимі з Xvfb, додайте `xvfb-run` перед основною командою.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-59",
          language: "bash",
          code: "xvfb-run npx playwright test",
        },
      ],
    },
  ],
  quiz: [],
}
