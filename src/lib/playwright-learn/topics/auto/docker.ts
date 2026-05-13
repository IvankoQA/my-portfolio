import type { PlaywrightTopic } from "../../types"

export const dockerTopic: PlaywrightTopic = {
  slug: "docker",
  groupId: "ci",
  order: 175,
  sourceDoc: "docker.md",
  officialDocsUrl: "https://playwright.dev/docs/docker",
  title: {
    en: "Docker",
    uk: "Docker",
  },
  summary: {
    en: "[Dockerfile.noble] can be used to run Playwright scripts in Docker environment. This image includes the [Playwright browsers](./browsers.md#install-browsers) and [browser system dependencies](./browsers.md#install-system-dependencies). The Playwright package/dependency is not included in the image and should be installed separately.",
    uk: "Образ [Dockerfile.noble] підходить для запуску Playwright у Docker; у ньому вже є [браузери Playwright](./browsers.md#install-browsers) і [системні залежності](./browsers.md#install-system-dependencies). Пакет `playwright` потрібно встановлювати окремо.",
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
          en: "[Dockerfile.noble] can be used to run Playwright scripts in Docker environment. This image includes the [Playwright browsers](./browsers.md#install-browsers) and [browser system dependencies](./browsers.md#install-system-dependencies). The Playwright package/dependency is not included in the image and should be installed separately.",
          uk: "[Dockerfile.noble] підходить для запуску скриптів Playwright у Docker. Образ містить [браузери Playwright](./browsers.md#install-browsers) і [системні залежності браузерів](./browsers.md#install-system-dependencies). Пакет/залежність Playwright не включено до образу — його потрібно встановити окремо.",
        },
      ],
    },
    {
      id: "usage",
      title: {
        en: "Usage",
        uk: "Використання",
      },
      paragraphs: [
        {
          en: "This Docker image is published to [Microsoft Artifact Registry].",
          uk: "Цей Docker-образ опублікований у [Microsoft Artifact Registry].",
        },
        {
          en: "### Pull the image",
          uk: "### Отримання образу",
        },
        {
          en: "### Run the image",
          uk: "### Запуск образу",
        },
        {
          en: "By default, the Docker image will use the `root` user to run the browsers. This will disable the Chromium sandbox which is not available with root. If you run trusted code (e.g. End-to-end tests) and want to avoid the hassle of managing separate user then the root user may be fine. For web scraping or crawling, we recommend to create a separate user inside the Docker container and use the seccomp profile.",
          uk: "За замовчуванням Docker-образ запускає браузери від імені `root`. Це вимикає пісочницю Chromium, яка недоступна для root. Якщо ви запускаєте довірений код (наприклад, end-to-end тести) і хочете уникнути складнощів із окремим користувачем — root підійде. Для веб-скрейпінгу або краулінгу рекомендується створити окремого користувача всередині контейнера і використовувати seccomp-профіль.",
        },
        {
          en: "#### End-to-end tests",
          uk: "#### End-to-end тести",
        },
        {
          en: "On trusted websites, you can avoid creating a separate user and use root for it since you trust the code which will run on the browsers.",
          uk: "На довірених сайтах можна не створювати окремого користувача і використовувати root, оскільки ви довіряєте коду, що виконується в браузерах.",
        },
        {
          en: "#### Crawling and scraping",
          uk: "#### Краулінг і скрейпінг",
        },
        {
          en: "On untrusted websites, it's recommended to use a separate user for launching the browsers in combination with the seccomp profile. Inside the container or if you are using the Docker image as a base image you have to use `adduser` for it.",
          uk: "На ненадійних сайтах рекомендується використовувати окремого користувача для запуску браузерів разом із seccomp-профілем. Всередині контейнера або при використанні Docker-образу як базового — використовуйте `adduser`.",
        },
        {
          en: "[`seccomp_profile.json`](https://github.com/microsoft/playwright/blob/main/utils/docker/seccomp_profile.json) is needed to run Chromium with sandbox. This is a [default Docker seccomp profile](https://github.com/docker/engine/blob/d0d99b04cf6e00ed3fc27e81fc3d94e7eda70af3/profiles/seccomp/default.json) with extra user namespace cloning permissions:",
          uk: "[`seccomp_profile.json`](https://github.com/microsoft/playwright/blob/main/utils/docker/seccomp_profile.json) потрібен для запуску Chromium із пісочницею. Це [стандартний seccomp-профіль Docker](https://github.com/docker/engine/blob/d0d99b04cf6e00ed3fc27e81fc3d94e7eda70af3/profiles/seccomp/default.json) із додатковими правами клонування простору імен користувача:",
        },
        {
          en: "### Recommended Docker Configuration",
          uk: "### Рекомендована конфігурація Docker",
        },
        {
          en: "When running Playwright in Docker, the following configuration is recommended:",
          uk: "При запуску Playwright у Docker рекомендується така конфігурація:",
        },
        {
          en: "1. **Using [`--init`](https://docs.docker.com/reference/cli/docker/container/run/#init)** Docker flag is recommended to avoid special treatment for processes with PID=1. This is a common reason for zombie processes.",
          uk: "1. **Прапор [`--init`](https://docs.docker.com/reference/cli/docker/container/run/#init)** рекомендується, щоб уникнути особливої обробки процесів із PID=1. Це часта причина зомбі-процесів.",
        },
        {
          en: "1. **Using `--ipc=host`** is recommended when using Chromium. Without it, Chromium can run out of memory and crash. Learn more about this option in [Docker docs](https://docs.docker.com/reference/cli/docker/container/run/#ipc).",
          uk: "1. **`--ipc=host`** рекомендується при використанні Chromium. Без цього Chromium може вичерпати пам'ять і впасти. Детальніше про цю опцію — у [документації Docker](https://docs.docker.com/reference/cli/docker/container/run/#ipc).",
        },
        {
          en: "1. **If seeing weird errors when launching Chromium**, try running your container with `docker run --cap-add=SYS_ADMIN` when developing locally.",
          uk: "1. **Якщо виникають дивні помилки при запуску Chromium**, спробуйте запустити контейнер із `docker run --cap-add=SYS_ADMIN` при локальній розробці.",
        },
        {
          en: "### Using on CI",
          uk: "### Використання в CI",
        },
        {
          en: "See our [Continuous Integration guides](./ci.md) for sample configs.",
          uk: "Приклади конфігурацій — у [посібнику з Continuous Integration](./ci.md).",
        },
        {
          en: "### Remote Connection",
          uk: "### Віддалене підключення",
        },
        {
          en: "You can run Playwright Server in Docker while keeping your tests running on the host system or another machine. This is useful for running tests on unsupported Linux distributions or remote execution scenarios.",
          uk: "Playwright Server можна запускати в Docker, залишаючи тести на хост-системі або іншій машині. Це корисно для запуску тестів на непідтримуваних дистрибутивах Linux або у сценаріях віддаленого виконання.",
        },
        {
          en: "#### Running the Playwright Server",
          uk: "#### Запуск Playwright Server",
        },
        {
          en: "Start the Playwright Server in Docker:",
          uk: "Запустіть Playwright Server у Docker:",
        },
        {
          en: "#### Connecting to the Server",
          uk: "#### Підключення до сервера",
        },
        {
          en: "There are two ways to connect to the remote Playwright server:",
          uk: "Є два способи підключитися до віддаленого Playwright Server:",
        },
        {
          en: "1. Using environment variable with `@playwright/test`:",
          uk: "1. Використовуючи змінну середовища з `@playwright/test`:",
        },
        {
          en: "2. Using the [`method: BrowserType.connect`] API for other applications:",
          uk: "2. Використовуючи API [`method: BrowserType.connect`] для інших застосунків:",
        },
        {
          en: "#### Network Configuration",
          uk: "#### Мережева конфігурація",
        },
        {
          en: "If you need to access local servers from within the Docker container:",
          uk: "Якщо потрібно отримати доступ до локальних серверів зсередини Docker-контейнера:",
        },
        {
          en: "This makes `hostmachine` point to the host's localhost. Your tests should use `hostmachine` instead of `localhost` when accessing local servers.",
          uk: "Це задає `hostmachine` як вказівник на localhost хоста. У тестах слід використовувати `hostmachine` замість `localhost` для доступу до локальних серверів.",
        },
        {
          en: "### Connecting using noVNC and GitHub Codespaces",
          uk: "### Підключення через noVNC та GitHub Codespaces",
        },
        {
          en: "For Docker and GitHub Codespaces environments, you can view and generate tests using the `noVNC` viewer built into the Docker image. In order for the VNC webviewer to be accessible outside of the container, you can enable the `desktop-lite` feature and specify the `webPort` in your `.devcontainer/devcontainer.json` file:",
          uk: "Для середовищ Docker і GitHub Codespaces можна переглядати та генерувати тести за допомогою вбудованого `noVNC` viewer у Docker-образі. Щоб VNC-вьювер був доступний ззовні контейнера, увімкніть функцію `desktop-lite` і вкажіть `webPort` у файлі `.devcontainer/devcontainer.json`:",
        },
        {
          en: "Once this is enabled you can open the port specified in a new browser tab and you will have access to the `noVNC` web viewer. This will enable you to record tests, pick selectors, and use codegen directly on your container.",
          uk: "Після увімкнення відкрийте вказаний порт у новій вкладці браузера — матимете доступ до `noVNC` web viewer. Це дозволить записувати тести, вибирати селектори та використовувати codegen безпосередньо в контейнері.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "docker pull mcr.microsoft.com/playwright:v%%VERSION%%-noble",
        },
        {
          id: "cb-2",
          language: "bash",
          code: "docker pull mcr.microsoft.com/playwright/python:v%%VERSION%%-noble",
        },
        {
          id: "cb-3",
          language: "bash",
          code: "docker pull mcr.microsoft.com/playwright/dotnet:v%%VERSION%%-noble",
        },
        {
          id: "cb-4",
          language: "bash",
          code: "docker pull mcr.microsoft.com/playwright/java:v%%VERSION%%-noble",
        },
        {
          id: "cb-5",
          language: "bash",
          code: "docker run -it --rm --ipc=host mcr.microsoft.com/playwright:v%%VERSION%%-noble /bin/bash",
        },
        {
          id: "cb-6",
          language: "bash",
          code: "docker run -it --rm --ipc=host mcr.microsoft.com/playwright/python:v%%VERSION%%-noble /bin/bash",
        },
        {
          id: "cb-7",
          language: "bash",
          code: "docker run -it --rm --ipc=host mcr.microsoft.com/playwright/dotnet:v%%VERSION%%-noble /bin/bash",
        },
        {
          id: "cb-8",
          language: "bash",
          code: "docker run -it --rm --ipc=host mcr.microsoft.com/playwright/java:v%%VERSION%%-noble /bin/bash",
        },
        {
          id: "cb-9",
          language: "bash",
          code: "docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright:v%%VERSION%%-noble /bin/bash",
        },
        {
          id: "cb-10",
          language: "bash",
          code: "docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright/python:v%%VERSION%%-noble /bin/bash",
        },
        {
          id: "cb-11",
          language: "bash",
          code: "docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright/dotnet:v%%VERSION%%-noble /bin/bash",
        },
        {
          id: "cb-12",
          language: "bash",
          code: "docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright/java:v%%VERSION%%-noble /bin/bash",
        },
        {
          id: "cb-13",
          language: "json",
          code: '{\n  "comment": "Allow create user namespaces",\n  "names": [\n    "clone",\n    "setns",\n    "unshare"\n  ],\n  "action": "SCMP_ACT_ALLOW",\n  "args": [],\n  "includes": {},\n  "excludes": {}\n}',
        },
        {
          id: "cb-14",
          language: "bash",
          code: 'docker run -p 3000:3000 --rm --init -it --workdir /home/pwuser --user pwuser mcr.microsoft.com/playwright:v%%VERSION%%-noble /bin/sh -c "npx -y playwright@%%VERSION%% run-server --port 3000 --host 0.0.0.0"',
        },
        {
          id: "cb-15",
          language: "bash",
          code: "PW_TEST_CONNECT_WS_ENDPOINT=ws://127.0.0.1:3000/ npx playwright test",
        },
        {
          id: "cb-16",
          language: "js",
          code: "const browser = await playwright['chromium'].connect('ws://127.0.0.1:3000/');",
        },
        {
          id: "cb-21",
          language: "bash",
          code: 'docker run --add-host=hostmachine:host-gateway -p 3000:3000 --rm --init -it --workdir /home/pwuser --user pwuser mcr.microsoft.com/playwright:v%%VERSION%%-noble /bin/sh -c "npx -y playwright@%%VERSION%% run-server --port 3000 --host 0.0.0.0"',
        },
        {
          id: "cb-22",
          language: "json",
          code: '{\n  "image": "mcr.microsoft.com/playwright:v1.57.0",\n  "forwardPorts": [6080],\n  "features": {\n    "desktop-lite": {\n      "webPort": "6080"\n    }\n  }\n}',
        },
      ],
    },
    {
      id: "image-tags",
      title: {
        en: "Image tags",
        uk: "Теги образів",
      },
      paragraphs: [
        {
          en: "See [all available image tags].",
          uk: "Дивіться [всі доступні теги образів].",
        },
        {
          en: "We currently publish images with the following tags:\n- `:v%%VERSION%%` - Playwright v%%VERSION%% release docker image based on Ubuntu 24.04 LTS (Noble Numbat).\n- `:v%%VERSION%%-noble` - Playwright v%%VERSION%% release docker image based on Ubuntu 24.04 LTS (Noble Numbat).\n- `:v%%VERSION%%-jammy` - Playwright v%%VERSION%% release docker image based on Ubuntu 22.04 LTS (Jammy Jellyfish).",
          uk: "Наразі публікуються образи з такими тегами:\n- `:v%%VERSION%%` — Docker-образ Playwright v%%VERSION%% на основі Ubuntu 24.04 LTS (Noble Numbat).\n- `:v%%VERSION%%-noble` — Docker-образ Playwright v%%VERSION%% на основі Ubuntu 24.04 LTS (Noble Numbat).\n- `:v%%VERSION%%-jammy` — Docker-образ Playwright v%%VERSION%% на основі Ubuntu 22.04 LTS (Jammy Jellyfish).",
        },
        {
          en: "### Base images",
          uk: "### Базові образи",
        },
        {
          en: "We currently publish images based on the following [Ubuntu](https://hub.docker.com/_/ubuntu) versions:\n- **Ubuntu 24.04 LTS** (Noble Numbat), image tags include `noble`\n- **Ubuntu 22.04 LTS** (Jammy Jellyfish), image tags include `jammy`",
          uk: "Наразі публікуються образи на основі таких версій [Ubuntu](https://hub.docker.com/_/ubuntu):\n- **Ubuntu 24.04 LTS** (Noble Numbat), теги містять `noble`\n- **Ubuntu 22.04 LTS** (Jammy Jellyfish), теги містять `jammy`",
        },
        {
          en: "#### Alpine",
          uk: "#### Alpine",
        },
        {
          en: "Browser builds for Firefox and WebKit are built for the [glibc](https://en.wikipedia.org/wiki/Glibc) library. Alpine Linux and other distributions that are based on the [musl](https://en.wikipedia.org/wiki/Musl) standard library are not supported.",
          uk: "Збірки браузерів Firefox і WebKit компілюються для бібліотеки [glibc](https://en.wikipedia.org/wiki/Glibc). Alpine Linux та інші дистрибутиви на основі стандартної бібліотеки [musl](https://en.wikipedia.org/wiki/Musl) не підтримуються.",
        },
      ],
    },
    {
      id: "using-a-different-net-version",
      title: {
        en: "Using a different .NET version",
        uk: "Використання іншої версії .NET",
      },
      paragraphs: [
        {
          en: "You can use the [.NET install script](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-install-script) in order to install different SDK versions:",
          uk: "Можна скористатися [скриптом встановлення .NET](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-install-script) для встановлення різних версій SDK:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-23",
          language: "bash",
          code: "curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --install-dir /usr/share/dotnet --channel 9.0",
        },
      ],
    },
    {
      id: "build-your-own-image",
      title: {
        en: "Build your own image",
        uk: "Побудова власного образу",
      },
      paragraphs: [
        {
          en: "To run Playwright inside Docker, you need to have Node.js, [Playwright browsers](./browsers.md#install-browsers) and [browser system dependencies](./browsers.md#install-system-dependencies) installed. See the following Dockerfile:",
          uk: "Для запуску Playwright всередині Docker потрібно встановити Node.js, [браузери Playwright](./browsers.md#install-browsers) і [системні залежності браузерів](./browsers.md#install-system-dependencies). Ось приклад Dockerfile:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-24",
          language: "dockerfile",
          code: "FROM node:20-bookworm\n\nRUN npx -y playwright@%%VERSION%% install --with-deps",
        },
      ],
    },
  ],
  quiz: [],
}
