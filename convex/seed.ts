import { mutation } from "./_generated/server"

// PLACEHOLDER — replace with data parsed from public/cv/CV_Ivan_Kozenko_AQA_Senior.pdf
const EXPERIENCE_SEED = [
  {
    company: "Company A", // PLACEHOLDER
    role: "Senior QA Automation Engineer", // PLACEHOLDER
    period: "2022 — Present", // PLACEHOLDER
    highlights: [
      "Built Playwright-based automation framework from scratch",
      "Reduced regression suite runtime by 60% through parallelization",
      "Integrated test pipeline into CI/CD with GitHub Actions",
    ],
    order: 1,
  },
  {
    company: "Company B", // PLACEHOLDER
    role: "QA Automation Engineer", // PLACEHOLDER
    period: "2020 — 2022", // PLACEHOLDER
    highlights: [
      "Developed comprehensive E2E test suite with Cypress",
      "Established API testing layer with Postman and Newman",
      "Mentored two junior QA engineers",
    ],
    order: 2,
  },
  {
    company: "Company C", // PLACEHOLDER
    role: "QA Engineer", // PLACEHOLDER
    period: "2018 — 2020", // PLACEHOLDER
    highlights: [
      "Manual and exploratory testing of web applications",
      "Created test plans, test cases, and bug reports",
      "Collaborated with developers to resolve critical defects",
    ],
    order: 3,
  },
  {
    company: "Company D", // PLACEHOLDER
    role: "Junior QA Engineer", // PLACEHOLDER
    period: "2016 — 2018", // PLACEHOLDER
    highlights: [
      "Functional and regression testing",
      "Maintained bug tracking system",
      "Participated in sprint planning and review meetings",
    ],
    order: 4,
  },
]

// PLACEHOLDER — replace with skills from public/cv/CV_Ivan_Kozenko_AQA_Senior.pdf
const SKILLS_SEED = [
  {
    name: "Playwright",
    category: "automation",
    order: 1,
    sandboxTab: "interactive" as const,
    reportHintType: "regression" as const,
  },
  {
    name: "Cypress",
    category: "automation",
    order: 2,
    sandboxTab: "interactive" as const,
  },
  { name: "TypeScript", category: "languages", order: 3 },
  { name: "JavaScript", category: "languages", order: 4 },
  { name: "Python", category: "languages", order: 5 },
  { name: "Selenium", category: "automation", order: 6 },
  {
    name: "Postman",
    category: "tools",
    order: 7,
    reportHintType: "smoke" as const,
  },
  { name: "Jest", category: "tools", order: 8 },
  { name: "CI/CD", category: "methodology", order: 9 },
  {
    name: "Performance Testing",
    category: "methodology",
    order: 10,
    sandboxTab: "tools" as const,
    reportHintType: "performance" as const,
  },
]

// Canonical 7 sandbox_elements — single source of truth used in seed, payload, and acceptance checks
const SANDBOX_ELEMENTS_SEED = [
  {
    tab: "interactive" as const,
    key: "name_input",
    label: "Your Name",
    value: "",
    type: "input" as const,
    styles: {},
    editableByAdmin: false,
  },
  {
    tab: "interactive" as const,
    key: "env_select",
    label: "Environment",
    value: "staging",
    type: "select" as const,
    styles: {},
    editableByAdmin: false,
  },
  {
    tab: "interactive" as const,
    key: "agree_check",
    label: "I agree",
    value: "false",
    type: "checkbox" as const,
    styles: {},
    editableByAdmin: false,
  },
  {
    tab: "interactive" as const,
    key: "todo_input",
    label: "Add todo",
    value: "",
    type: "todo_input" as const,
    styles: {},
    editableByAdmin: false,
  },
  {
    tab: "tools" as const,
    key: "calc_display",
    label: "Result",
    value: "0",
    type: "calculator_display" as const,
    styles: {},
    editableByAdmin: false,
  },
  {
    tab: "tools" as const,
    key: "video_url",
    label: "Video URL",
    value: "",
    type: "media_url" as const,
    styles: { width: 560, height: 315 },
    editableByAdmin: true,
  },
  {
    tab: "tools" as const,
    key: "image_url",
    label: "Image Source",
    value: "",
    type: "image_url" as const,
    styles: { width: 400, height: 300, x: 0, y: 0 },
    editableByAdmin: true,
  },
]

// PLACEHOLDER — verify social URLs from public/cv/CV_Ivan_Kozenko_AQA_Senior.pdf
const SOCIAL_LINKS_SEED = [
  {
    platform: "linkedin",
    title: "LinkedIn",
    url: "https://linkedin.com/in/ivan-kozenko", // PLACEHOLDER — verify URL
    description: "Connect professionally",
    order: 1,
  },
  {
    platform: "github",
    title: "GitHub",
    url: "https://github.com/ivan-kozenko", // PLACEHOLDER — verify URL
    description: "Open source projects",
    order: 2,
  },
  {
    platform: "youtube",
    title: "YouTube",
    url: "https://youtube.com/@ivan-kozenko", // PLACEHOLDER — verify URL
    description: "QA tutorials and demos",
    order: 3,
  },
  {
    platform: "tiktok",
    title: "TikTok",
    url: "https://tiktok.com/@ivan-kozenko", // PLACEHOLDER — verify URL
    description: "Short QA tips",
    order: 4,
  },
]

const PROJECTS_SEED = [
  {
    slug: "qa-portfolio",
    name: "QA Portfolio",
    description:
      "Interactive portfolio demonstrating QA automation skills, test artifact previews, and engineering practices.",
    demoUrl: "/sandbox",
    order: 1,
  },
]

export const DEMO_SESSION_KEY = "demo_session"

const CHAT_MESSAGES_SEED = [
  {
    sender: "userA" as const,
    text: "Hey, I just finished setting up the new Playwright suite for the checkout flow.",
  },
  {
    sender: "userB" as const,
    text: "Nice! How many tests did you end up writing?",
  },
  {
    sender: "userA" as const,
    text: "Around 24 E2E scenarios — happy path and 3 edge cases per flow.",
  },
  {
    sender: "userB" as const,
    text: "Did you add retries for flaky network calls?",
  },
  {
    sender: "userA" as const,
    text: "Yes, set maxRetries to 2 and added a request interceptor for the payment gateway.",
  },
  {
    sender: "userB" as const,
    text: "Smart. What's the current run time on CI?",
  },
  {
    sender: "userA" as const,
    text: "About 4 minutes with 4 workers in parallel. Still optimizing.",
  },
  {
    sender: "userB" as const,
    text: "You could try sharding across 2 machines — that cut our suite time in half.",
  },
  {
    sender: "userA" as const,
    text: "Good idea. I'll check if our GitHub Actions config supports that.",
  },
  {
    sender: "userB" as const,
    text: "It does — use the matrix strategy with shard index and total shards.",
  },
]

const TEST_RUNS_SEED = [
  {
    runType: "smoke" as const,
    status: "passed" as const,
    reportUrl: "#",
    summary: "All 42 smoke tests passed",
    durationMs: 12_000,
  },
  {
    runType: "regression" as const,
    status: "passed" as const,
    reportUrl: "#",
    summary: "Full regression suite: 312/312 passed",
    durationMs: 185_000,
  },
  {
    runType: "performance" as const,
    status: "failed" as const,
    reportUrl: "#",
    summary: "3 tests exceeded threshold: /api/search p95 > 2s",
    durationMs: 240_000,
  },
] as const

export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()

    // profile — singleton, no unique index; skip if any doc exists
    const existingProfile = await ctx.db.query("profile").take(1)
    if (existingProfile.length === 0) {
      await ctx.db.insert("profile", {
        fullName: "Ivan Kozenko", // PLACEHOLDER — replace from CV PDF
        title: "Senior QA Automation Engineer", // PLACEHOLDER — replace from CV PDF
        tagline: "Building quality into every layer of the stack", // PLACEHOLDER — replace from CV PDF
        summary:
          "Senior QA Automation Engineer with extensive experience in test automation, CI/CD integration, and quality assurance across web and mobile platforms.", // PLACEHOLDER — replace from CV PDF
        cvUrl: "/cv/CV_Ivan_Kozenko_AQA_Senior.pdf",
        location: "Ukraine", // PLACEHOLDER — replace from CV PDF
        email: "ivan.kozenko.qa@gmail.com",
      })
    }

    // experience_items — per-record by (company, role, period)
    for (const item of EXPERIENCE_SEED) {
      const existing = await ctx.db
        .query("experience_items")
        .withIndex("by_company_and_role_and_period", (q) =>
          q
            .eq("company", item.company)
            .eq("role", item.role)
            .eq("period", item.period),
        )
        .take(1)
      if (existing.length === 0) {
        await ctx.db.insert("experience_items", { ...item })
      }
    }

    // skills — per-record by name
    for (const skill of SKILLS_SEED) {
      const existing = await ctx.db
        .query("skills")
        .withIndex("by_name", (q) => q.eq("name", skill.name))
        .take(1)
      if (existing.length === 0) {
        await ctx.db.insert("skills", { ...skill })
      }
    }

    // sandbox_elements — per-record by (tab, key)
    for (const elem of SANDBOX_ELEMENTS_SEED) {
      const existing = await ctx.db
        .query("sandbox_elements")
        .withIndex("by_tab_and_key", (q) =>
          q.eq("tab", elem.tab).eq("key", elem.key),
        )
        .take(1)
      if (existing.length === 0) {
        await ctx.db.insert("sandbox_elements", { ...elem })
      }
    }

    // chat_messages — batch-level guard: skip whole batch if demo session already has messages
    const existingChat = await ctx.db
      .query("chat_messages")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", DEMO_SESSION_KEY),
      )
      .take(1)
    if (existingChat.length === 0) {
      for (let i = 0; i < CHAT_MESSAGES_SEED.length; i++) {
        await ctx.db.insert("chat_messages", {
          sessionKey: DEMO_SESSION_KEY,
          sender: CHAT_MESSAGES_SEED[i].sender,
          text: CHAT_MESSAGES_SEED[i].text,
          createdAt: now - (CHAT_MESSAGES_SEED.length - 1 - i) * 60_000,
        })
      }
    }

    // test_runs — per runType; skip if any run of that type already exists
    for (const run of TEST_RUNS_SEED) {
      const existing = await ctx.db
        .query("test_runs")
        .withIndex("by_runType_and_ranAt", (q) => q.eq("runType", run.runType))
        .take(1)
      if (existing.length === 0) {
        await ctx.db.insert("test_runs", { ...run, ranAt: now })
      }
    }

    // social_links — per-record by platform
    for (const link of SOCIAL_LINKS_SEED) {
      const existing = await ctx.db
        .query("social_links")
        .withIndex("by_platform", (q) => q.eq("platform", link.platform))
        .take(1)
      if (existing.length === 0) {
        await ctx.db.insert("social_links", { ...link })
      }
    }

    // projects — per-record by slug
    for (const project of PROJECTS_SEED) {
      const existing = await ctx.db
        .query("projects")
        .withIndex("by_slug", (q) => q.eq("slug", project.slug))
        .take(1)
      if (existing.length === 0) {
        await ctx.db.insert("projects", { ...project })
      }
    }

    // sandbox_defaults — singleton by scope "global"
    const existingDefaults = await ctx.db
      .query("sandbox_defaults")
      .withIndex("by_scope", (q) => q.eq("scope", "global"))
      .take(1)
    if (existingDefaults.length === 0) {
      await ctx.db.insert("sandbox_defaults", {
        scope: "global",
        payload: JSON.stringify({
          defaultRole: "user",
          defaultActiveTab: "interactive",
          elements: SANDBOX_ELEMENTS_SEED,
        }),
        updatedAt: now,
      })
    }
  },
})

const SCENARIOS_SEED = [
  {
    slug: "wizard-failure-recovery",
    title: "Wizard Failure Recovery",
    description:
      "4-step form state machine with chaos-induced failure on step 3 and forced reset",
    difficulty: "intermediate" as const,
    tags: ["state-machine", "error-recovery", "forms", "chaos"],
    automationFocus: "state machine",
    perfRelevant: false,
    order: 1,
  },
  {
    slug: "cascading-inputs",
    title: "Cascading Inputs",
    description:
      "Country → city → delivery options chain with async loading states and deterministic fallback",
    difficulty: "beginner" as const,
    tags: ["async", "dependent-selects", "loading-states"],
    automationFocus: "async dependencies",
    perfRelevant: false,
    order: 2,
  },
  {
    slug: "realtime-chat-alerts",
    title: "Realtime Chat Alerts",
    description:
      "Two-sender chat powered by Convex subscriptions. Messages containing 'Error' trigger a red alert panel",
    difficulty: "beginner" as const,
    tags: ["realtime", "subscriptions", "alerts", "cross-tab"],
    automationFocus: "realtime",
    perfRelevant: false,
    order: 3,
  },
  {
    slug: "race-condition-checkout",
    title: "Race Condition Checkout",
    description:
      "Single-item inventory with OCC: first buyer wins, second gets a 409-style conflict",
    difficulty: "advanced" as const,
    tags: ["race-condition", "OCC", "concurrency", "inventory"],
    automationFocus: "concurrency",
    perfRelevant: true,
    order: 4,
  },
  {
    slug: "heavy-endpoint-benchmark",
    title: "Heavy Endpoint Benchmark",
    description:
      "HTTP action designed for k6 load testing. Configurable payload size and artificial latency mode",
    difficulty: "intermediate" as const,
    tags: ["performance", "HTTP", "benchmark", "k6"],
    automationFocus: "performance",
    perfRelevant: true,
    order: 5,
  },
  {
    slug: "large-list-virtualization",
    title: "Large List Virtualization",
    description:
      "500 seeded items with sort, filter, and pagination. Stable data-testid selectors for automation",
    difficulty: "beginner" as const,
    tags: ["virtualization", "lists", "pagination", "sorting"],
    automationFocus: "DOM performance",
    perfRelevant: true,
    order: 6,
  },
]

const PRESETS_SEED = [
  {
    name: "wizard-clean-state",
    scenarioSlug: "wizard-failure-recovery",
    payload: JSON.stringify({
      step: 1,
      formData: "{}",
      error: null,
      resetCount: 0,
    }),
  },
  {
    name: "wizard-chaos-on",
    scenarioSlug: "wizard-failure-recovery",
    payload: JSON.stringify({ latencyMs: 0, errorRate: 1, enabled: true }),
  },
  {
    name: "checkout-stock-reset",
    scenarioSlug: "race-condition-checkout",
    payload: JSON.stringify({ itemSlug: "limited-item-1", stock: 1 }),
  },
]

const LIST_ITEM_CATEGORIES = [
  "ui",
  "api",
  "performance",
  "accessibility",
  "security",
]
const LIST_ITEM_STATUSES = ["active", "archived", "pending"] as const

export const seedSandboxData = mutation({
  args: {},
  handler: async (ctx) => {
    // sandbox_scenarios — per-record by slug
    for (const scenario of SCENARIOS_SEED) {
      const existing = await ctx.db
        .query("sandbox_scenarios")
        .withIndex("by_slug", (q) => q.eq("slug", scenario.slug))
        .take(1)
      if (existing.length === 0) {
        await ctx.db.insert("sandbox_scenarios", { ...scenario })
      }
    }

    // sandbox_presets — per-record by name
    for (const preset of PRESETS_SEED) {
      const existing = await ctx.db
        .query("sandbox_presets")
        .withIndex("by_name", (q) => q.eq("name", preset.name))
        .take(1)
      if (existing.length === 0) {
        await ctx.db.insert("sandbox_presets", { ...preset })
      }
    }

    // inventory — single limited item
    const existingItem = await ctx.db
      .query("inventory")
      .withIndex("by_itemSlug", (q) => q.eq("itemSlug", "limited-item-1"))
      .take(1)
    if (existingItem.length === 0) {
      await ctx.db.insert("inventory", {
        itemSlug: "limited-item-1",
        name: "Limited Edition Widget",
        stock: 1,
        version: 0,
        updatedAt: Date.now(),
      })
    }

    // list_items — 500 items; skip if any already exist
    const existingListItem = await ctx.db
      .query("list_items")
      .withIndex("by_order")
      .take(1)
    if (existingListItem.length === 0) {
      for (let i = 1; i <= 500; i++) {
        const category =
          LIST_ITEM_CATEGORIES[(i - 1) % LIST_ITEM_CATEGORIES.length]
        const status = LIST_ITEM_STATUSES[(i - 1) % LIST_ITEM_STATUSES.length]
        await ctx.db.insert("list_items", {
          title: `Test Item ${i}`,
          category,
          status,
          value: (i * 7) % 1000,
          order: i,
        })
      }
    }
  },
})
