import type { PlaywrightTopic } from "../../types"

export const dockerTopic: PlaywrightTopic = {
  slug: "docker",
  groupId: "ci",
  order: 175,
  level: "advanced",
  trackOrder: 8,
  sourceDoc: "docker.md",
  officialDocsUrl: "https://playwright.dev/docs/docker",
  title: {
    en: "Docker",
    uk: "Docker",
  },
  summary: {
    en: "The official Playwright Docker image already has all three browsers and every system dependency installed. Using it in CI means I skip the 'npx playwright install --with-deps' step entirely — I just npm ci and run tests. The two flags I always add: --ipc=host (Chromium crashes without it) and --init (zombie process prevention).",
    uk: "Офіційний Docker-образ Playwright вже має всі три браузери і всі системні залежності встановлені. Використання в CI означає пропускаю крок 'npx playwright install --with-deps' повністю — просто npm ci і запускаю тести. Два прапорці які завжди додаю: --ipc=host (Chromium падає без нього) і --init (запобігання зомбі-процесам).",
  },
  sections: [
    {
      id: "why-docker",
      title: {
        en: "Why use the Docker image instead of installing browsers on the runner",
        uk: "Навіщо Docker-образ замість встановлення браузерів на runner",
      },
      diagram: {
        mermaid: `flowchart LR
  subgraph DC["mcr.microsoft.com/playwright Docker image"]
    direction TB
    NJ["Node.js (not included — you run npm ci)"]
    PW["Playwright package (not included — you run npm ci)"]
    BR["Chromium / Firefox / WebKit binaries"]
    SL["OS system libs\nlibglib, libnss, libpango…"]
  end
  T["Your tests\n(npm ci → npm test)"] --> DC`,
        caption: {
          en: "The Docker image provides browsers and OS libraries only — you still install Node dependencies with npm ci",
          uk: "Docker-образ надає лише браузери та системні бібліотеки — Node-залежності все одно встановлюються через npm ci",
        },
      },
      paragraphs: [
        {
          en: "The main reason I use the Docker image on CI: consistency. The same Ubuntu base, the same browser versions, the same system libraries — regardless of which runner picks up the job. I've had visual regression tests fail because the runner had a slightly different libpango version that changed text rendering. Docker eliminates that class of problem.",
          uk: "Головна причина чому я використовую Docker-образ на CI: консистентність. Та сама Ubuntu-база, ті самі версії браузерів, ті самі системні бібліотеки — незалежно від того який runner підхопить job. У мене були падіння visual regression тестів через те що runner мав трохи іншу версію libpango яка змінила рендеринг тексту. Docker усуває такий клас проблем.",
        },
        {
          en: "The image is at `mcr.microsoft.com/playwright:v1.x-noble` (Ubuntu 24.04) or `v1.x-jammy` (Ubuntu 22.04). The Playwright npm package itself is NOT in the image — you still run `npm ci` to install it. The image only provides browsers and system dependencies.",
          uk: "Образ знаходиться на `mcr.microsoft.com/playwright:v1.x-noble` (Ubuntu 24.04) або `v1.x-jammy` (Ubuntu 22.04). Сам npm-пакет Playwright НЕ включений в образ — все одно запускаєш `npm ci` щоб встановити його. Образ надає лише браузери і системні залежності.",
        },
      ],
      codeBlocks: [
        {
          id: "pull-image",
          language: "bash",
          code: `# Отримати образ (зазвичай CI робить це автоматично)
docker pull mcr.microsoft.com/playwright:v1.50.0-noble`,
        },
      ],
    },
    {
      id: "run-flags",
      title: {
        en: "The flags that actually matter when running",
        uk: "Прапорці які реально важливі при запуску",
      },
      paragraphs: [
        {
          en: "`--ipc=host` — this one bites people. Chromium uses shared memory between the browser process and renderer processes. Docker containers have a tiny `/dev/shm` by default (64MB). Chromium exceeds this and crashes with cryptic errors. `--ipc=host` makes the container share the host's IPC namespace, giving Chromium enough memory.",
          uk: "`--ipc=host` — цей завжди когось кусає. Chromium використовує спільну пам'ять між процесом браузера і процесами рендерера. Docker-контейнери мають крихітний `/dev/shm` за замовчуванням (64MB). Chromium перевищує це і падає з незрозумілими помилками. `--ipc=host` змушує контейнер ділитися IPC-простором імен хоста — дає Chromium достатньо пам'яті.",
        },
        {
          en: "`--init` — without it, PID 1 inside the container is your shell or Node process. PID 1 has special signal-handling behavior that can cause child processes (browser sub-processes) to become zombies that never get cleaned up. `--init` puts a proper init process at PID 1.",
          uk: "`--init` — без нього PID 1 всередині контейнера — твій shell або Node-процес. PID 1 має особливу поведінку обробки сигналів яка може спричинити що дочірні процеси (підпроцеси браузера) стають зомбі і ніколи не прибираються. `--init` ставить правильний init-процес на PID 1.",
        },
      ],
      codeBlocks: [
        {
          id: "run-container",
          language: "bash",
          code: `# Запустити контейнер для e2e тестів (довірений код)
docker run -it --rm --init --ipc=host \
  mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash`,
        },
        {
          id: "run-scraping",
          language: "bash",
          code: `# Для скрейпінгу ненадійних сайтів — окремий користувач + seccomp
docker run -it --rm --init --ipc=host \
  --user pwuser \
  --security-opt seccomp=seccomp_profile.json \
  mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash`,
        },
      ],
    },
    {
      id: "in-ci",
      title: {
        en: "Using the image in CI",
        uk: "Використання образу в CI",
      },
      paragraphs: [
        {
          en: "In GitHub Actions, using the image as a container means I skip the browser install step. The CI job just installs npm packages and runs tests — browsers are already there.",
          uk: "В GitHub Actions використання образу як контейнера означає пропускаю крок встановлення браузерів. CI-job просто встановлює npm-пакети і запускає тести — браузери вже є.",
        },
        {
          en: "Note the `--user 1001` option — GitHub Actions runs as a non-root user by default, and the container needs to match. Without this you get permission errors on the workspace files.",
          uk: "Зверни увагу на опцію `--user 1001` — GitHub Actions за замовчуванням виконується від non-root юзера, і контейнер має відповідати. Без цього отримаєш помилки дозволів на файлах workspace.",
        },
      ],
      codeBlocks: [
        {
          id: "github-actions-docker",
          language: "yaml",
          code: `# GitHub Actions з Docker-образом
name: Playwright Tests
on:
  push:
    branches: [ main ]
jobs:
  playwright:
    name: Playwright Tests
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.50.0-noble
      options: --user 1001
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npx playwright test`,
        },
      ],
    },
    {
      id: "remote-server",
      title: {
        en: "Running Playwright server in Docker, tests on the host",
        uk: "Запуск Playwright-сервера в Docker, тестів на хості",
      },
      paragraphs: [
        {
          en: "Sometimes I want browsers inside Docker but the tests running locally — useful when I'm on a Mac but need Linux browser behavior. I start the Playwright server in Docker and connect to it via websocket.",
          uk: "Іноді хочу браузери всередині Docker але тести запускати локально — корисно коли я на Mac але потрібна поведінка Linux-браузера. Запускаю Playwright-сервер в Docker і підключаюся до нього через websocket.",
        },
      ],
      codeBlocks: [
        {
          id: "remote-server",
          language: "bash",
          code: `# Запустити Playwright-сервер в Docker
docker run -p 3000:3000 --rm --init -it \
  --workdir /home/pwuser --user pwuser \
  mcr.microsoft.com/playwright:v1.50.0-noble \
  /bin/sh -c "npx -y playwright@1.50.0 run-server --port 3000 --host 0.0.0.0"

# Підключити тести до сервера
PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:3000/ npx playwright test`,
        },
      ],
    },
    {
      id: "image-tags",
      title: {
        en: "Choosing the right image tag",
        uk: "Вибір правильного тегу образу",
      },
      paragraphs: [
        {
          en: "Always pin to an exact Playwright version (`v1.50.0-noble`, not `latest`). Using `latest` means CI can silently switch to a newer browser version and break your visual regression baselines. I update the version intentionally when I'm ready to update the baselines too.",
          uk: "Завжди закріплюй до точної версії Playwright (`v1.50.0-noble`, а не `latest`). Використання `latest` означає CI може тихо переключитися на новішу версію браузера і зламати твої visual regression базові лінії. Я оновлюю версію навмисно коли готовий також оновити базові лінії.",
        },
        {
          en: "Don't use Alpine-based images for Playwright. Firefox and WebKit are compiled against glibc — they simply won't run on Alpine which uses musl. Only Chromium works on Alpine, and even then it requires workarounds.",
          uk: "Не використовуй Alpine-образи для Playwright. Firefox і WebKit скомпільовані проти glibc — вони просто не запустяться на Alpine яка використовує musl. Тільки Chromium працює на Alpine, і навіть тоді вимагає обхідних рішень.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You're using the Playwright Docker image in CI but Chromium keeps crashing with out-of-memory errors. What's the most likely fix?",
        uk: "Ти використовуєш Docker-образ Playwright в CI але Chromium постійно падає з помилками нестачі пам'яті. Яке найімовірніше виправлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Increase the CI runner's RAM by upgrading to a larger machine",
            uk: "Збільшити RAM CI-runner через перехід на більшу машину",
          },
        },
        {
          id: "b",
          label: {
            en: "Add --ipc=host to the docker run command — Docker limits /dev/shm to 64MB by default and Chromium needs more shared memory",
            uk: "Додати --ipc=host до команди docker run — Docker обмежує /dev/shm до 64MB за замовчуванням а Chromium потребує більше спільної пам'яті",
          },
        },
        {
          id: "c",
          label: {
            en: "Switch from Chromium to Firefox which uses less memory",
            uk: "Переключитися з Chromium на Firefox який використовує менше пам'яті",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Chromium uses shared memory (`/dev/shm`) for communication between the browser process and its renderer processes. Docker containers default to 64MB for `/dev/shm`, which Chromium exhausts quickly. `--ipc=host` makes the container share the host's IPC namespace, giving Chromium access to the full shared memory space. This is the most common Chromium-in-Docker crash cause. Upgrading the machine helps with actual RAM but not this specific shared memory limit.",
        uk: "Chromium використовує спільну пам'ять (`/dev/shm`) для комунікації між процесом браузера і його процесами рендерера. Docker-контейнери за замовчуванням мають 64MB для `/dev/shm`, яку Chromium швидко вичерпує. `--ipc=host` змушує контейнер ділитися IPC-простором імен хоста — дає Chromium доступ до повного простору спільної пам'яті. Це найпоширеніша причина падіння Chromium в Docker. Оновлення машини допомагає з реальною RAM але не з цим конкретним обмеженням спільної пам'яті.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What is the correct registry path for the official Playwright Docker image on Ubuntu 24.04?",
        uk: "Яка правильна адреса реєстру для офіційного Docker-образу Playwright на Ubuntu 24.04?",
      },
      options: [
        { id: "a", label: { en: "docker.io/playwright/playwright:latest", uk: "docker.io/playwright/playwright:latest" } },
        { id: "b", label: { en: "mcr.microsoft.com/playwright:v1.x-noble", uk: "mcr.microsoft.com/playwright:v1.x-noble" } },
        { id: "c", label: { en: "ghcr.io/microsoft/playwright:latest", uk: "ghcr.io/microsoft/playwright:latest" } },
        { id: "d", label: { en: "playwright/chromium:noble", uk: "playwright/chromium:noble" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The official Playwright Docker image is hosted on Microsoft Container Registry (mcr.microsoft.com). The tag format is `v{version}-{ubuntu-codename}` — `noble` is Ubuntu 24.04, `jammy` is Ubuntu 22.04. Always pin to an explicit version like `v1.50.0-noble` rather than using `latest` to avoid silent browser version upgrades breaking visual regression baselines.",
        uk: "Офіційний Docker-образ Playwright розміщений у Microsoft Container Registry (mcr.microsoft.com). Формат тегу — `v{версія}-{codename Ubuntu}` — `noble` це Ubuntu 24.04, `jammy` — Ubuntu 22.04. Завжди закріплюй до явної версії типу `v1.50.0-noble` а не `latest` щоб уникнути тихих оновлень версії браузера які ламають visual regression базові лінії.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Why do teams use the Playwright Docker image in CI instead of installing browsers on the runner directly?",
        uk: "Чому команди використовують Docker-образ Playwright у CI замість встановлення браузерів прямо на runner?",
      },
      options: [
        { id: "a", label: { en: "Docker images are faster to start than bare runners", uk: "Docker-образи запускаються швидше ніж bare runner-и" } },
        { id: "b", label: { en: "The Docker image costs less in CI minutes", uk: "Docker-образ коштує менше хвилин CI" } },
        { id: "c", label: { en: "The Docker image provides consistent browser versions and system libraries across all runners, eliminating environment-specific test failures", uk: "Docker-образ забезпечує однакові версії браузерів і системних бібліотек на всіх runner-ах усуваючи падіння тестів через відмінності середовища" } },
        { id: "d", label: { en: "Docker images automatically update browsers when Playwright is updated", uk: "Docker-образи автоматично оновлюють браузери при оновленні Playwright" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The article's primary reason for Docker is consistency: the same Ubuntu base, the same browser versions, the same system libraries on every runner. A real example from the article: visual regression tests failing because a runner had a slightly different libpango version that changed text rendering. Docker eliminates this entire class of environment-related test failures. Docker isn't inherently faster or cheaper — it trades flexibility for reproducibility.",
        uk: "Основна причина Docker у статті — консистентність: та сама база Ubuntu, ті самі версії браузерів, ті самі системні бібліотеки на кожному runner-і. Реальний приклад зі статті: падіння visual regression тестів через те що runner мав трохи іншу версію libpango яка змінила рендеринг тексту. Docker усуває весь цей клас падінь через відмінності середовища. Docker не є швидшим або дешевшим сам по собі — він обмінює гнучкість на відтворюваність.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You want to run Playwright tests inside a Docker container. Which command correctly starts the container with the required flags?",
        uk: "Хочеш запустити тести Playwright всередині Docker-контейнера. Яка команда правильно запускає контейнер з потрібними прапорцями?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "docker run -it --rm mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash",
            uk: "docker run -it --rm mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash",
          },
        },
        {
          id: "b",
          label: {
            en: "docker run -it --rm --init --ipc=host mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash",
            uk: "docker run -it --rm --init --ipc=host mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash",
          },
        },
        {
          id: "c",
          label: {
            en: "docker run -it --rm --privileged mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash",
            uk: "docker run -it --rm --privileged mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash",
          },
        },
        {
          id: "d",
          label: {
            en: "docker run -it --rm --memory=4g mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash",
            uk: "docker run -it --rm --memory=4g mcr.microsoft.com/playwright:v1.50.0-noble /bin/bash",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Both `--init` and `--ipc=host` are required. `--init` puts a proper init process at PID 1 to prevent zombie browser sub-processes. `--ipc=host` shares the host's IPC namespace so Chromium gets enough shared memory (Docker's default /dev/shm of 64MB is too small). `--privileged` grants excessive permissions. `--memory` addresses a different problem (actual RAM, not shared memory). Running without these flags leads to Chromium crashes or zombie processes.",
        uk: "Потрібні обидва прапорці `--init` і `--ipc=host`. `--init` ставить правильний init-процес на PID 1 щоб запобігти зомбі-підпроцесам браузера. `--ipc=host` ділиться IPC-простором хоста щоб Chromium отримав достатньо спільної пам'яті (стандартний /dev/shm Docker 64MB занадто малий). `--privileged` надає надмірні права. `--memory` вирішує іншу проблему (реальна RAM а не спільна пам'ять). Запуск без цих прапорців призводить до падіння Chromium або зомбі-процесів.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does the --ipc=host flag do when running Playwright in Docker?",
        uk: "Що робить прапорець --ipc=host при запуску Playwright в Docker?",
      },
      options: [
        { id: "a", label: { en: "It exposes port 3000 from the container to the host machine", uk: "Він відкриває порт 3000 з контейнера на хост-машину" } },
        { id: "b", label: { en: "It makes the container share the host's IPC namespace, giving Chromium access to adequate shared memory beyond Docker's 64MB /dev/shm limit", uk: "Він змушує контейнер ділитися IPC-простором хоста надаючи Chromium доступ до достатньої спільної пам'яті понад ліміт Docker 64MB /dev/shm" } },
        { id: "c", label: { en: "It enables inter-process communication between test workers", uk: "Він вмикає міжпроцесну комунікацію між воркерами тестів" } },
        { id: "d", label: { en: "It installs additional system packages required by Chromium", uk: "Він встановлює додаткові системні пакети потрібні Chromium" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Chromium uses shared memory (`/dev/shm`) to communicate between its browser process and renderer processes. Docker containers have a 64MB `/dev/shm` by default, which Chromium quickly exhausts, causing cryptic crash errors. `--ipc=host` makes the container share the host machine's IPC namespace, effectively giving Chromium unlimited access to shared memory. This is the standard fix for Chromium-in-Docker crashes.",
        uk: "Chromium використовує спільну пам'ять (`/dev/shm`) для комунікації між процесом браузера і процесами рендерера. Docker-контейнери мають 64MB `/dev/shm` за замовчуванням, яку Chromium швидко вичерпує спричиняючи незрозумілі помилки краш. `--ipc=host` змушує контейнер ділитися IPC-простором хост-машини ефективно надаючи Chromium необмежений доступ до спільної пам'яті. Це стандартне виправлення для падінь Chromium в Docker.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "In a GitHub Actions workflow using the Playwright Docker image as a container, what extra option must you add to avoid permission errors on workspace files?",
        uk: "У workflow GitHub Actions що використовує Docker-образ Playwright як контейнер — яку додаткову опцію треба додати щоб уникнути помилок дозволів на файлах workspace?",
      },
      options: [
        { id: "a", label: { en: "volumes: - ${{ github.workspace }}:/workspace", uk: "volumes: - ${{ github.workspace }}:/workspace" } },
        { id: "b", label: { en: "options: --user 1001", uk: "options: --user 1001" } },
        { id: "c", label: { en: "permissions: write-all", uk: "permissions: write-all" } },
        { id: "d", label: { en: "env: RUNNER_USER=root", uk: "env: RUNNER_USER=root" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "GitHub Actions runs as a non-root user (UID 1001) by default. The Playwright Docker image defaults to the root user. When the container mounts the Actions workspace, the root container user can't write files that the non-root runner expects to own. Adding `options: --user 1001` makes the container run as the same UID as the Actions runner, avoiding the permission mismatch.",
        uk: "GitHub Actions за замовчуванням виконується від non-root користувача (UID 1001). Docker-образ Playwright за замовчуванням використовує root-користувача. Коли контейнер монтує workspace Actions root-користувач контейнера не може писати файли які non-root runner очікує як свої. Додавання `options: --user 1001` змушує контейнер виконуватися під тим самим UID що й Actions runner уникаючи невідповідності прав.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Why should you never use Alpine-based Docker images for running Playwright tests with Firefox or WebKit?",
        uk: "Чому ніколи не треба використовувати Alpine-based Docker-образи для запуску тестів Playwright з Firefox або WebKit?",
      },
      options: [
        { id: "a", label: { en: "Alpine images don't support Docker volumes", uk: "Alpine-образи не підтримують Docker volumes" } },
        { id: "b", label: { en: "Alpine uses musl libc, but Firefox and WebKit are compiled against glibc and simply won't run on Alpine", uk: "Alpine використовує musl libc але Firefox і WebKit скомпільовані проти glibc і просто не запускаються на Alpine" } },
        { id: "c", label: { en: "Alpine images don't include Node.js", uk: "Alpine-образи не включають Node.js" } },
        { id: "d", label: { en: "Alpine is not supported by the Playwright Docker documentation", uk: "Alpine не підтримується документацією Playwright Docker" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Firefox and WebKit are compiled against glibc (GNU C Library). Alpine Linux uses musl libc instead, which is a different, incompatible C library implementation. Because of this fundamental incompatibility, Firefox and WebKit binaries simply cannot execute on Alpine. Only Chromium works on Alpine, and even that requires workarounds. Use Ubuntu-based images (noble or jammy) for full browser support.",
        uk: "Firefox і WebKit скомпільовані проти glibc (GNU C Library). Alpine Linux використовує musl libc — іншу несумісну реалізацію C-бібліотеки. Через цю фундаментальну несумісність бінарники Firefox і WebKit просто не можуть виконуватися на Alpine. Тільки Chromium працює на Alpine і навіть це вимагає обхідних рішень. Використовуй Ubuntu-based образи (noble або jammy) для повної підтримки браузерів.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Why does the article recommend always pinning to an exact version tag (e.g. v1.50.0-noble) instead of using the 'latest' tag for the Playwright Docker image?",
        uk: "Чому стаття рекомендує завжди закріплювати до точного тегу версії (наприклад v1.50.0-noble) замість тегу 'latest' для Docker-образу Playwright?",
      },
      options: [
        { id: "a", label: { en: "The 'latest' tag is not available on mcr.microsoft.com", uk: "Тег 'latest' недоступний на mcr.microsoft.com" } },
        { id: "b", label: { en: "Using 'latest' means CI can silently switch to a newer browser version, breaking visual regression baselines without any code change", uk: "Використання 'latest' означає CI може тихо переключитися на новішу версію браузера ламаючи visual regression базові лінії без жодних змін коду" } },
        { id: "c", label: { en: "Pinning is required by the GitHub Actions security policy", uk: "Закріплення вимагається політикою безпеки GitHub Actions" } },
        { id: "d", label: { en: "The 'latest' tag always points to a beta version", uk: "Тег 'latest' завжди вказує на beta-версію" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The article explicitly states: 'Using `latest` means CI can silently switch to a newer browser version and break your visual regression baselines.' When you pin to `v1.50.0-noble`, you control when browser versions change. You intentionally update the version tag when you're ready to review and update the visual baselines too. Uncontrolled browser upgrades are a common cause of mysterious CI failures in projects with screenshot tests.",
        uk: "Стаття прямо стверджує: 'Використання `latest` означає CI може тихо переключитися на новішу версію браузера і зламати твої visual regression базові лінії.' Коли закріплюєш до `v1.50.0-noble` — контролюєш коли версії браузерів змінюються. Навмисно оновлюєш тег версії коли готовий переглянути й оновити візуальні базові лінії. Неконтрольовані оновлення браузерів — часта причина загадкових падінь CI у проектах зі screenshot-тестами.",
      },
    },
  ],
}
