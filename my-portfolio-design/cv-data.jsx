// cv-data.jsx — Single source of truth for Ivan Kozenko's CV.
// Both the Home page and the Job-Fit checker read from this.
// Skill objects carry aliases so the matcher can recognise them in JD text.

const CV = {
  name: "Ivan Kozenko",
  role: { en: "Senior Automation QA Engineer", ua: "Senior Automation QA Engineer" },
  location: { en: "Poland · Remote", ua: "Польща · Віддалено" },
  yearsExperience: 7,
  email: "ivan.kozenko.qa@gmail.com",
  phone: "+48 453 101 079",
  links: {
    linkedin: "https://www.linkedin.com/in/ivan-kozenko-qa/",
    github: "https://github.com/ivan-kozenko-qa",
    telegram: "https://t.me/IvanTryCry",
    youtube: "https://www.youtube.com/@ivan-kozenko",
  },

  // Stats for the hero
  stats: [
    { value: "7+", labelKey: "home.years" },
    { value: "2×/wk", labelKey: "home.releases" },
    { value: "3", labelKey: "home.frameworks" },
    { value: "5+", labelKey: "home.mentees" },
  ],

  // Skills with aliases used by JD matcher.
  // weight: how central it is to my profile (1–3).
  // category: shown in chips.
  skills: [
    // Frameworks
    { id: "playwright", label: "Playwright", aliases: ["playwright"], category: "framework", weight: 3, level: "expert" },
    { id: "cypress", label: "Cypress", aliases: ["cypress"], category: "framework", weight: 2, level: "advanced" },
    { id: "frameworkArch", label: "Framework architecture", aliases: ["framework architecture", "test architecture", "framework from scratch"], category: "framework", weight: 3, level: "expert" },
    { id: "pom", label: "POM / COM", aliases: ["page object", "pom", "component object model", "com pattern"], category: "framework", weight: 2, level: "advanced" },
    { id: "crossbrowser", label: "Cross-browser & mobile emul.", aliases: ["cross-browser", "cross browser", "mobile emulation", "chromium", "webkit", "firefox"], category: "framework", weight: 2, level: "advanced" },

    // Languages
    { id: "typescript", label: "TypeScript", aliases: ["typescript", "ts"], category: "language", weight: 3, level: "expert" },
    { id: "javascript", label: "JavaScript", aliases: ["javascript", "js"], category: "language", weight: 3, level: "expert" },
    { id: "sql", label: "SQL", aliases: ["sql", "postgres", "mysql", "mssql"], category: "language", weight: 2, level: "advanced" },
    { id: "fp", label: "Functional style", aliases: ["functional programming", "functional style"], category: "language", weight: 1, level: "advanced" },
    { id: "cleanCode", label: "Clean code & design patterns", aliases: ["clean code", "design patterns", "solid"], category: "language", weight: 2, level: "advanced" },

    // API
    { id: "postman", label: "Postman / Newman", aliases: ["postman", "newman"], category: "api", weight: 3, level: "expert" },
    { id: "rest", label: "REST", aliases: ["rest", "rest api"], category: "api", weight: 3, level: "expert" },
    { id: "graphql", label: "GraphQL", aliases: ["graphql"], category: "api", weight: 2, level: "advanced" },
    { id: "contract", label: "Contract testing", aliases: ["contract testing", "pact"], category: "api", weight: 2, level: "advanced" },
    { id: "schema", label: "JSON Schema validation", aliases: ["json schema", "schema validation"], category: "api", weight: 2, level: "advanced" },
    { id: "mocking", label: "Mocking & stubs", aliases: ["mocking", "mock service", "stubs", "wiremock"], category: "api", weight: 2, level: "advanced" },
    { id: "db", label: "Database testing", aliases: ["database testing", "db testing", "data validation"], category: "api", weight: 2, level: "advanced" },

    // Performance & security
    { id: "k6", label: "k6", aliases: ["k6", "load testing", "stress testing"], category: "perf", weight: 2, level: "advanced" },
    { id: "lighthouse", label: "Lighthouse", aliases: ["lighthouse"], category: "perf", weight: 1, level: "intermediate" },
    { id: "owasp", label: "OWASP basics", aliases: ["owasp", "security testing", "security scanning"], category: "perf", weight: 1, level: "intermediate" },
    { id: "datadog", label: "Datadog", aliases: ["datadog"], category: "perf", weight: 2, level: "advanced" },

    // Infra
    { id: "ghactions", label: "GitHub Actions", aliases: ["github actions", "gh actions"], category: "infra", weight: 3, level: "expert" },
    { id: "docker", label: "Docker", aliases: ["docker"], category: "infra", weight: 2, level: "advanced" },
    { id: "jenkins", label: "Jenkins", aliases: ["jenkins"], category: "infra", weight: 2, level: "advanced" },
    { id: "azurePipelines", label: "Azure Pipelines", aliases: ["azure pipelines", "azure devops"], category: "infra", weight: 2, level: "advanced" },
    { id: "git", label: "Git", aliases: ["git"], category: "infra", weight: 3, level: "expert" },

    // Management
    { id: "allure", label: "Allure Reports", aliases: ["allure"], category: "mgmt", weight: 2, level: "advanced" },
    { id: "testrail", label: "TestRail", aliases: ["testrail"], category: "mgmt", weight: 2, level: "advanced" },
    { id: "xray", label: "Xray", aliases: ["xray", "x-ray for jira"], category: "mgmt", weight: 1, level: "advanced" },
    { id: "jira", label: "Jira", aliases: ["jira"], category: "mgmt", weight: 3, level: "expert" },
    { id: "confluence", label: "Confluence", aliases: ["confluence"], category: "mgmt", weight: 2, level: "advanced" },
    { id: "strategy", label: "Test strategy planning", aliases: ["test strategy", "qa strategy", "test plan"], category: "mgmt", weight: 2, level: "advanced" },

    // AI
    { id: "cursor", label: "Cursor", aliases: ["cursor"], category: "ai", weight: 1, level: "advanced" },
    { id: "claudeCode", label: "Claude Code", aliases: ["claude code", "claude"], category: "ai", weight: 1, level: "advanced" },
    { id: "aiDev", label: "AI-assisted dev", aliases: ["ai-assisted", "ai assisted", "copilot"], category: "ai", weight: 1, level: "advanced" },

    // QA general
    { id: "exploratory", label: "Exploratory testing", aliases: ["exploratory testing", "exploratory"], category: "qa", weight: 3, level: "expert" },
    { id: "manual", label: "Manual QA", aliases: ["manual testing", "manual qa"], category: "qa", weight: 2, level: "advanced" },
    { id: "regression", label: "Regression suites", aliases: ["regression"], category: "qa", weight: 3, level: "expert" },
    { id: "e2e", label: "E2E testing", aliases: ["e2e", "end-to-end", "end to end"], category: "qa", weight: 3, level: "expert" },
    { id: "ci", label: "CI/CD pipelines", aliases: ["ci/cd", "ci cd", "continuous integration", "continuous delivery"], category: "qa", weight: 3, level: "expert" },
    { id: "microservices", label: "Microservices testing", aliases: ["microservices"], category: "qa", weight: 2, level: "advanced" },
    { id: "fintech", label: "Fintech domain", aliases: ["fintech", "banking"], category: "domain", weight: 2 },
    { id: "gaming", label: "Gaming domain", aliases: ["gaming", "igaming", "game testing"], category: "domain", weight: 2 },
    { id: "adtech", label: "AdTech domain", aliases: ["adtech", "ad tech", "advertising platform"], category: "domain", weight: 1 },
    { id: "mentorship", label: "Mentorship", aliases: ["mentor", "mentorship", "coaching"], category: "qa", weight: 1 },
  ],

  // Adjacent: skills I don't list but JDs often want — will surface as "partial".
  adjacent: [
    { id: "selenium", label: "Selenium", aliases: ["selenium", "webdriver"], note: { en: "Not on CV — adjacent to Playwright/Cypress.", ua: "Не в CV — суміжне з Playwright/Cypress." } },
    { id: "java", label: "Java", aliases: ["java"], note: { en: "No professional Java experience — CV shows TypeScript/JavaScript automation only.", ua: "Немає професійного досвіду Java — у CV лише автоматизація на TypeScript/JavaScript." } },
    { id: "python", label: "Python", aliases: ["python"], note: { en: "No professional Python experience — not listed on CV.", ua: "Немає професійного досвіду Python — у CV не зазначено." } },
    { id: "appium", label: "Appium", aliases: ["appium"], note: { en: "Mobile-web emulation only.", ua: "Лише mobile-web emulation." } },
    { id: "kotlin", label: "Kotlin", aliases: ["kotlin"], note: { en: "No Kotlin/Appium authoring on CV — mobile coverage via browser emulation only.", ua: "У CV немає Kotlin/Appium як авторського стеку — mobile лише через browser emulation." } },
    { id: "ruby", label: "Ruby", aliases: ["ruby", "rspec"], note: { en: "Not on CV.", ua: "Не в CV." } },
    { id: "kubernetes", label: "Kubernetes", aliases: ["kubernetes", "k8s"], note: { en: "Read pods/logs, don't author.", ua: "Читаю pod/logs, не пишу." } },
    { id: "aws", label: "AWS", aliases: ["aws", "amazon web services"], note: { en: "Comfortable with S3/EC2 basics.", ua: "Базово S3/EC2." } },
    { id: "performance", label: "Performance engineering", aliases: ["performance engineering", "load engineer"], note: { en: "k6 only, not full perf eng.", ua: "Лише k6, не full perf eng." } },
    { id: "leadership", label: "Team lead", aliases: ["team lead", "tech lead", "lead qa"], note: { en: "Mentored, not titled.", ua: "Менторив, не мав титулу." } },
  ],

  // Used by JD matcher for sample text
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
      role: { en: "Senior Automation QA Engineer", ua: "Senior Automation QA Engineer" },
      from: "04.2024", to: { en: "present", ua: "сьогодні" },
      domainKey: "gaming",
      bullets: {
        en: [
          "Architected a scalable Playwright E2E framework for a high-load gaming platform using Functional style + COM.",
          "Optimized execution via parallelization and sharding to maintain performance at scale.",
          "Improved testability (custom IDs, API hooks); led code reviews for AQA scripts.",
          "Balanced automated suites with exploratory sessions for complex gaming mechanics.",
          "Used AI tools to accelerate framework setup and streamline failure analysis.",
          "Defined and rolled out unified testing standards & JS/TS best practices.",
        ],
        ua: [
          "Архітектував масштабований Playwright E2E фреймворк для high-load gaming платформи (Functional style + COM).",
          "Оптимізував виконання через паралелізацію та шардинг.",
          "Покращив testability (custom IDs, API hooks); лідив code review для AQA-скриптів.",
          "Балансував авто-сьюти з exploratory-сесіями для складних gaming-механік.",
          "Використовував AI-інструменти для прискорення setup і аналізу падінь.",
          "Запровадив єдині стандарти тестування та JS/TS best practices.",
        ],
      },
    },
    {
      company: "Comparus UA",
      role: { en: "Senior AQA Engineer", ua: "Senior AQA Engineer" },
      from: "04.2021", to: "04.2024",
      domainKey: "fintech",
      bullets: {
        en: [
          "Automated 150+ E2E tests for 20+ microservices in a multi-tenant fintech ecosystem.",
          "Aligned automation with DevOps/Backend; release frequency went up 4×.",
          "Built modular API testing (Postman) layer using design patterns — contract testing & complex auth.",
          "Architected SQL data prep scripts for environment isolation and test independence.",
        ],
        ua: [
          "Автоматизував 150+ E2E для 20+ мікросервісів у multi-tenant fintech.",
          "Узгодив автоматизацію з DevOps/Backend — частота релізів зросла у 4×.",
          "Побудував модульний API-шар (Postman) — contract testing та складна аутентифікація.",
          "Архітектував SQL-скрипти для ізоляції середовищ і незалежності тестів.",
        ],
      },
    },
    {
      company: "Evoplay",
      role: { en: "AQA Engineer", ua: "AQA Engineer" },
      from: "02.2019", to: "04.2021",
      domainKey: "adtech",
      bullets: {
        en: [
          "Developed a UI automation suite for AdTech supporting Chromium, Firefox & WebKit (100k+ users).",
          "Reduced manual regression from 16h to a 4h automated run.",
          "Integrated suites into CI for immediate feedback on every PR.",
        ],
        ua: [
          "Розробив UI-suite для AdTech з підтримкою Chromium, Firefox та WebKit (100k+ users).",
          "Скоротив ручний regression з 16 год до 4 год авто-запуску.",
          "Інтегрував suite у CI для миттєвого фідбеку на кожен PR.",
        ],
      },
    },
    {
      company: "Robota.ua",
      role: { en: "Manual QA Engineer", ua: "Manual QA Engineer" },
      from: "03.2018", to: "02.2019",
      bullets: {
        en: [
          "Performed requirement analysis and early defect detection across the SDLC.",
          "Verified system integrity across UI, API (Postman) and Database (SQL).",
        ],
        ua: [
          "Виконував requirement analysis та раннє виявлення дефектів.",
          "Перевіряв цілісність системи на UI, API (Postman) та DB (SQL).",
        ],
      },
    },
  ],

  wins: [
    {
      en: "Accelerated release frequency from bi-weekly → twice-a-week by optimizing the test pyramid (heavy logic to API layer, lean E2E).",
      ua: "Прискорив реліз-каденс з bi-weekly до двох разів на тиждень — оптимізував test pyramid (важка логіка в API, легкі E2E).",
      tag: "release",
    },
    {
      en: "Solution Architecture: Building Playwright & TS automation from the ground up. Prioritizing high-ROI business flows and delivering actionable quality insights to stakeholders.",
      ua: "Архітектура рішень: з нуля будуємо автоматизацію на Playwright і TypeScript. Пріоритет — бізнес-сценарії з найвищим ROI і практичні висновки про якість для стейкхолдерів.",
      tag: "scale",
    },
  ],

  languages: [
    { lang: "English", level: "B2", levelLabel: "Upper-intermediate", icon: "EN" },
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
      bodyEn: "Documenting travels and experimenting with IT-related content — learning in public.",
      bodyUa: "Документую подорожі та експериментую з IT-контентом — вчуся публічно.",
    },
    {
      titleEn: "Technical mentorship",
      titleUa: "Технічне менторство",
      bodyEn: "Guided several peers into Manual & Automation QA roles — paying it forward.",
      bodyUa: "Допоміг колегам зайти у Manual та Automation QA — повертаю борг спільноті.",
    },
  ],
};

window.CV = CV;
