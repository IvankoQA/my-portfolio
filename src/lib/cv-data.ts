export type AppLang = "en" | "uk"

export type Skill = {
  id: string
  label: string
  aliases: string[]
  category: string
  weight: 1 | 2 | 3
  level?: string
}

export type AdjacentSkill = {
  id: string
  label: string
  aliases: string[]
  note: { en: string; ua: string }
}

export type Experience = {
  company: string
  role: { en: string; ua: string }
  from: string
  to: string | { en: string; ua: string }
  domainKey?: string
  bullets: { en: string[]; ua: string[] }
}

export type Win = {
  en: string
  ua: string
  tag: string
}

export type Stat = {
  value: string
  labelKey: string
}

export const CV = {
  name: "Ivan Kozenko",
  role: {
    en: "Senior Test Automation Engineer",
    ua: "Senior Test Automation Engineer",
  },
  location: {
    en: "Batumi, Georgia · Remote (CET)",
    ua: "Батумі, Грузія · Віддалено (CET)",
  },
  yearsExperience: 8,
  email: "ivan.kozenko.qa@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/ivan-kozenko-qa/",
    github: "https://github.com/IvankoQA",
    telegram: "https://t.me/IvanTryCry",
    youtube: "https://www.youtube.com/@IvanTryCry",
  },

  stats: [
    { value: "8+", labelKey: "home.years" },
    { value: "9000+", labelKey: "home.farmer" },
  ] satisfies Stat[],

  skills: [
    // Frameworks
    {
      id: "playwright",
      label: "Playwright",
      aliases: ["playwright"],
      category: "framework",
      weight: 3,
      level: "expert",
    },
    {
      id: "cypress",
      label: "Cypress",
      aliases: ["cypress"],
      category: "framework",
      weight: 2,
      level: "advanced",
    },
    {
      id: "webdriverio",
      label: "WebdriverIO",
      aliases: ["webdriverio", "webdriver io"],
      category: "framework",
      weight: 2,
      level: "advanced",
    },
    {
      id: "frameworkArch",
      label: "Framework architecture",
      aliases: [
        "framework architecture",
        "test architecture",
        "framework from scratch",
      ],
      category: "framework",
      weight: 3,
      level: "expert",
    },
    {
      id: "pom",
      label: "POM / COM",
      aliases: ["page object", "pom", "component object model", "com pattern"],
      category: "framework",
      weight: 2,
      level: "advanced",
    },
    {
      id: "crossbrowser",
      label: "Cross-browser & mobile emul.",
      aliases: [
        "cross-browser",
        "cross browser",
        "mobile emulation",
        "chromium",
        "webkit",
        "firefox",
      ],
      category: "framework",
      weight: 2,
      level: "advanced",
    },

    // Languages
    {
      id: "typescript",
      label: "TypeScript",
      aliases: ["typescript", "ts"],
      category: "language",
      weight: 3,
      level: "expert",
    },
    {
      id: "javascript",
      label: "JavaScript",
      aliases: ["javascript", "js"],
      category: "language",
      weight: 3,
      level: "expert",
    },
    {
      id: "sql",
      label: "SQL",
      aliases: ["sql", "postgres", "mysql", "mssql"],
      category: "language",
      weight: 2,
      level: "advanced",
    },
    {
      id: "fp",
      label: "Functional style",
      aliases: ["functional programming", "functional style"],
      category: "language",
      weight: 1,
      level: "advanced",
    },
    {
      id: "cleanCode",
      label: "Clean code & design patterns",
      aliases: ["clean code", "design patterns", "solid"],
      category: "language",
      weight: 2,
      level: "advanced",
    },

    // API
    {
      id: "postman",
      label: "Postman / Newman",
      aliases: ["postman", "newman"],
      category: "api",
      weight: 3,
      level: "expert",
    },
    {
      id: "rest",
      label: "REST",
      aliases: ["rest", "rest api"],
      category: "api",
      weight: 3,
      level: "expert",
    },
    {
      id: "contract",
      label: "Contract testing",
      aliases: ["contract testing", "pact"],
      category: "api",
      weight: 2,
      level: "advanced",
    },
    {
      id: "schema",
      label: "JSON Schema validation",
      aliases: ["json schema", "schema validation"],
      category: "api",
      weight: 2,
      level: "advanced",
    },
    {
      id: "mocking",
      label: "Mocking & stubs",
      aliases: ["mocking", "mock service", "stubs", "wiremock"],
      category: "api",
      weight: 2,
      level: "advanced",
    },
    {
      id: "db",
      label: "Database testing",
      aliases: ["database testing", "db testing", "data validation"],
      category: "api",
      weight: 2,
      level: "advanced",
    },

    // Performance
    {
      id: "k6",
      label: "k6",
      aliases: ["k6", "load testing", "stress testing"],
      category: "perf",
      weight: 2,
      level: "advanced",
    },

    // Infra
    {
      id: "ghactions",
      label: "GitHub Actions",
      aliases: ["github actions", "gh actions"],
      category: "infra",
      weight: 3,
      level: "expert",
    },
    {
      id: "docker",
      label: "Docker",
      aliases: ["docker"],
      category: "infra",
      weight: 2,
      level: "advanced",
    },
    {
      id: "cloud",
      label: "AWS / GCP (basic)",
      aliases: ["aws", "gcp", "google cloud", "amazon web services"],
      category: "infra",
      weight: 1,
      level: "intermediate",
    },
    {
      id: "jenkins",
      label: "Jenkins",
      aliases: ["jenkins"],
      category: "infra",
      weight: 2,
      level: "advanced",
    },
    {
      id: "azurePipelines",
      label: "Azure Pipelines",
      aliases: ["azure pipelines", "azure devops"],
      category: "infra",
      weight: 2,
      level: "advanced",
    },
    {
      id: "git",
      label: "Git",
      aliases: ["git"],
      category: "infra",
      weight: 3,
      level: "expert",
    },

    // Management
    {
      id: "allure",
      label: "Allure Reports",
      aliases: ["allure"],
      category: "mgmt",
      weight: 2,
      level: "advanced",
    },
    {
      id: "testrail",
      label: "TestRail",
      aliases: ["testrail"],
      category: "mgmt",
      weight: 2,
      level: "advanced",
    },
    {
      id: "xray",
      label: "Xray",
      aliases: ["xray", "x-ray for jira"],
      category: "mgmt",
      weight: 1,
      level: "advanced",
    },
    {
      id: "jira",
      label: "Jira",
      aliases: ["jira"],
      category: "mgmt",
      weight: 3,
      level: "expert",
    },
    {
      id: "strategy",
      label: "Test strategy planning",
      aliases: ["test strategy", "qa strategy", "test plan"],
      category: "mgmt",
      weight: 2,
      level: "advanced",
    },

    // AI
    {
      id: "cursor",
      label: "Cursor",
      aliases: ["cursor"],
      category: "ai",
      weight: 1,
      level: "advanced",
    },
    {
      id: "claudeCode",
      label: "Claude Code",
      aliases: ["claude code", "claude"],
      category: "ai",
      weight: 1,
      level: "advanced",
    },
    {
      id: "aiDev",
      label: "AI-assisted dev",
      aliases: ["ai-assisted", "ai assisted", "copilot"],
      category: "ai",
      weight: 1,
      level: "advanced",
    },

    // QA general
    {
      id: "exploratory",
      label: "Exploratory testing",
      aliases: ["exploratory testing", "exploratory"],
      category: "qa",
      weight: 3,
      level: "expert",
    },
    {
      id: "manual",
      label: "Manual QA",
      aliases: ["manual testing", "manual qa"],
      category: "qa",
      weight: 2,
      level: "advanced",
    },
    {
      id: "regression",
      label: "Regression suites",
      aliases: ["regression"],
      category: "qa",
      weight: 3,
      level: "expert",
    },
    {
      id: "e2e",
      label: "E2E testing",
      aliases: ["e2e", "end-to-end", "end to end"],
      category: "qa",
      weight: 3,
      level: "expert",
    },
    {
      id: "ci",
      label: "CI/CD pipelines",
      aliases: [
        "ci/cd",
        "ci cd",
        "continuous integration",
        "continuous delivery",
      ],
      category: "qa",
      weight: 3,
      level: "expert",
    },
    {
      id: "microservices",
      label: "Microservices testing",
      aliases: ["microservices"],
      category: "qa",
      weight: 2,
      level: "advanced",
    },
    {
      id: "fintech",
      label: "Fintech domain",
      aliases: ["fintech", "banking"],
      category: "domain",
      weight: 2,
    },
    {
      id: "gaming",
      label: "Gaming domain",
      aliases: ["gaming", "igaming", "game testing"],
      category: "domain",
      weight: 2,
    },
    {
      id: "adtech",
      label: "AdTech domain",
      aliases: ["adtech", "ad tech", "advertising platform"],
      category: "domain",
      weight: 1,
    },
    {
      id: "mentorship",
      label: "Mentorship",
      aliases: ["mentor", "mentorship", "coaching"],
      category: "qa",
      weight: 1,
    },
  ] satisfies Skill[],

  adjacent: [
    {
      id: "selenium",
      label: "Selenium",
      aliases: ["selenium", "webdriver"],
      note: {
        en: "Not on CV — adjacent to Playwright/Cypress.",
        ua: "Не в CV — суміжне з Playwright/Cypress.",
      },
    },
    {
      id: "java",
      label: "Java",
      aliases: ["java"],
      note: {
        en: "No professional Java experience — CV shows TypeScript/JavaScript automation only.",
        ua: "Немає професійного досвіду Java — у CV лише автоматизація на TypeScript/JavaScript.",
      },
    },
    {
      id: "python",
      label: "Python",
      aliases: ["python"],
      note: {
        en: "No professional Python experience — not listed on CV.",
        ua: "Немає професійного досвіду Python — у CV не зазначено.",
      },
    },
    {
      id: "appium",
      label: "Appium",
      aliases: ["appium"],
      note: {
        en: "Mobile-web emulation only.",
        ua: "Лише mobile-web emulation.",
      },
    },
    {
      id: "kotlin",
      label: "Kotlin",
      aliases: ["kotlin"],
      note: {
        en: "No Kotlin authoring on CV — mobile automation is WebdriverIO/Appium in TypeScript.",
        ua: "У CV немає Kotlin як авторського стеку — mobile-автоматизація на WebdriverIO/Appium мовою TypeScript.",
      },
    },
    {
      id: "ruby",
      label: "Ruby",
      aliases: ["ruby", "rspec"],
      note: { en: "Not on CV.", ua: "Не в CV." },
    },
    {
      id: "kubernetes",
      label: "Kubernetes",
      aliases: ["kubernetes", "k8s"],
      note: {
        en: "Read pods/logs, don't author.",
        ua: "Читаю pod/logs, не пишу.",
      },
    },
    {
      id: "performance",
      label: "Performance engineering",
      aliases: ["performance engineering", "load engineer"],
      note: {
        en: "k6 only, not full perf eng.",
        ua: "Лише k6, не full perf eng.",
      },
    },
    {
      id: "leadership",
      label: "Team lead",
      aliases: ["team lead", "tech lead", "lead qa"],
      note: { en: "Mentored, not titled.", ua: "Менторив, не мав титулу." },
    },
  ] satisfies AdjacentSkill[],

  sampleJD: {
    en: `Senior QA Automation Engineer — Remote (EU)

We're hiring a Senior QA Engineer to lead automation for our trading platform. You'll architect a Playwright + TypeScript framework from scratch, mentor 2 mid-level QAs, and own the CI pipeline (GitHub Actions).

Must have:
- 5+ years in QA Automation
- Strong Playwright or Cypress experience
- TypeScript / JavaScript fluency
- API testing (Postman, REST, GraphQL)
- CI/CD on GitHub Actions or Jenkins
- Experience in fintech or high-load domains
- Solid SQL skills for data validation

Nice to have:
- k6 or other load testing
- Datadog observability
- Allure reporting
- Selenium background (legacy suite)
- Java or Kotlin (we have a small mobile suite in Appium/Kotlin)
- Exposure to Kubernetes / AWS

You'll work closely with backend, write contract tests, run exploratory sessions for new features, and define our test strategy. We value clean code, design patterns, and people who can mentor.`,
    ua: `Senior QA Automation Engineer — Remote (EU)

Шукаємо Senior QA Engineer на trading-платформу. Ви будете архітектувати Playwright + TypeScript фреймворк з нуля, менторити 2 mid-QA, володіти CI (GitHub Actions).

Обов'язково:
- 5+ років у QA Automation
- Playwright або Cypress
- TypeScript / JavaScript
- API testing (Postman, REST, GraphQL)
- CI/CD GitHub Actions або Jenkins
- Fintech або high-load
- SQL

Буде плюсом:
- k6 або інший load testing
- Datadog
- Allure
- Selenium (legacy)
- Java або Kotlin (Appium/Kotlin для мобільного)
- Kubernetes / AWS`,
  },

  experience: [
    {
      company: "Forvana Gaming",
      role: {
        en: "Senior Automation QA Engineer",
        ua: "Senior Automation QA Engineer",
      },
      from: "04.2024",
      to: { en: "present", ua: "сьогодні" },
      domainKey: "gaming",
      bullets: {
        en: [
          "Build and maintain a Playwright/TypeScript automation ecosystem of 2,000+ tests for a high-load gaming platform, with parallelization and sharding.",
          "Design automation architecture with functional programming principles and the Component Object Model.",
          "Extend automation to mobile: Android and iOS flows with WebdriverIO and Appium.",
          "Enable self-service testing so feature teams can run and maintain E2E suites independently; improve testability through custom test IDs and API hooks.",
          "Use AI across the test lifecycle with Claude Code and Cursor: maintain a structured AI knowledge base and reusable Skills, coordinate several AI agents on multi-step QA tasks, and validate AI-generated code through review.",
          "Balance automated regression with exploratory testing for complex gaming mechanics and business-critical workflows.",
        ],
        ua: [
          "Розробляю та підтримую автоматизовану екосистему на Playwright/TypeScript: 2 000+ тестів для high-load ігрової платформи з паралелізацією та шардингом.",
          "Проєктую архітектуру автоматизації на принципах функціонального програмування та Component Object Model.",
          "Розширив автоматизацію на мобільні платформи: Android та iOS флоу на WebdriverIO та Appium.",
          "Налаштовую self-service тестування, щоб feature-команди самостійно запускали та підтримували E2E-набори; покращую testability через custom test IDs та API hooks.",
          "Використовую AI на всіх етапах тестування з Claude Code та Cursor: веду структуровану AI-базу знань і багаторазові Skills, координую кілька AI-агентів у багатокрокових QA-задачах та валідую згенерований код через review.",
          "Балансую автоматизовану регресію з exploratory-тестуванням для складних ігрових механік і критичних бізнес-сценаріїв.",
        ],
      },
    },
    {
      company: "Comparus UA",
      role: { en: "Senior Automation QA Engineer", ua: "Senior Automation QA Engineer" },
      from: "04.2021",
      to: "04.2024",
      domainKey: "fintech",
      bullets: {
        en: [
          "Designed and implemented 150+ automated E2E tests covering 20+ microservices in a multi-tenant fintech ecosystem.",
          "Built a modular API testing layer with Postman, contract testing and complex authentication scenarios.",
          "Developed SQL-based test data preparation scripts to improve environment isolation and test independence.",
          "Worked with backend and DevOps teams to optimize the test pyramid, contributing to a 4× increase in release frequency.",
        ],
        ua: [
          "Спроєктував і впровадив 150+ автоматизованих E2E-тестів для 20+ мікросервісів у multi-tenant fintech-екосистемі.",
          "Побудував модульний шар API-тестування на Postman з contract testing та складними сценаріями автентифікації.",
          "Розробив SQL-скрипти підготовки тестових даних для ізоляції середовищ і незалежності тестів.",
          "Разом із backend та DevOps оптимізував test pyramid, що дало 4× зростання частоти релізів.",
        ],
      },
    },
    {
      company: "Evoplay",
      role: { en: "Automation QA Engineer", ua: "Automation QA Engineer" },
      from: "02.2019",
      to: "04.2021",
      domainKey: "adtech",
      bullets: {
        en: [
          "Built cross-browser UI automation (Chromium, Firefox, WebKit) for AdTech products serving 100K+ users.",
          "Cut manual regression from 16 to 4 hours.",
          "Integrated automated suites into CI pipelines for faster feedback on every pull request.",
        ],
        ua: [
          "Побудував cross-browser UI-автоматизацію (Chromium, Firefox, WebKit) для AdTech-продуктів зі 100K+ користувачів.",
          "Скоротив ручну регресію з 16 до 4 годин.",
          "Інтегрував автотести в CI-пайплайни для швидкого фідбеку на кожен pull request.",
        ],
      },
    },
    {
      company: "Robota.ua",
      role: { en: "Manual QA Engineer", ua: "Manual QA Engineer" },
      from: "03.2018",
      to: "02.2019",
      domainKey: "hr-tech",
      bullets: {
        en: [
          "Functional, UI, API and database testing with Postman and SQL; defect investigation with development teams.",
        ],
        ua: [
          "Функціональне, UI, API та database-тестування з Postman і SQL; розслідування дефектів разом із командами розробки.",
        ],
      },
    },
  ] satisfies Experience[],

  wins: [
    {
      en: "Accelerated release frequency from bi-weekly to twice-a-week by optimizing the test pyramid: heavy logic moved to the API layer, lean E2E.",
      ua: "Прискорив релізи з bi-weekly до двох разів на тиждень, оптимізувавши test pyramid: важка логіка перенесена в API-шар, легкі E2E.",
      tag: "release",
    },
    {
      en: "Built a Playwright/TypeScript ecosystem of 2,000+ tests with parallelization and sharding for a high-load gaming platform, extended to Android and iOS.",
      ua: "Побудував Playwright/TypeScript-екосистему з 2 000+ тестів із паралелізацією та шардингом для high-load ігрової платформи, розширену на Android та iOS.",
      tag: "scale",
    },
  ] satisfies Win[],

  languages: [
    {
      lang: "English",
      level: "B2",
      levelLabel: "Upper-intermediate",
      icon: "EN",
    },
    { lang: "Ukrainian", level: "Native", levelLabel: "Native", icon: "UA" },
    { lang: "Russian", level: "Native", levelLabel: "Native", icon: "RU" },
  ],

  development: [
    { en: "Advanced Playwright training", ua: "Поглиблений Playwright" },
    { en: "Software Architecture training", ua: "Software Architecture" },
  ],

  beyond: [
    {
      titleEn: "YouTube",
      titleUa: "YouTube",
      bodyEn:
        "Documenting travels and experimenting with IT-related content — learning in public.",
      bodyUa:
        "Документую подорожі та експериментую з IT-контентом — вчуся публічно.",
    },
    {
      titleEn: "Technical mentorship",
      titleUa: "Технічне менторство",
      bodyEn:
        "Guided several peers into Manual & Automation QA roles — paying it forward.",
      bodyUa:
        "Допоміг колегам зайти у Manual та Automation QA — повертаю борг спільноті.",
    },
  ],
}
