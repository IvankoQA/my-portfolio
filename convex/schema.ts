import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  profile: defineTable({
    fullName: v.string(),
    title: v.string(),
    tagline: v.string(),
    summary: v.string(),
    cvUrl: v.optional(v.string()),
    location: v.optional(v.string()),
    email: v.optional(v.string()),
  }),

  experience_items: defineTable({
    company: v.string(),
    role: v.string(),
    period: v.string(),
    highlights: v.array(v.string()),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_company_and_role_and_period", ["company", "role", "period"]),

  skills: defineTable({
    name: v.string(),
    category: v.string(),
    order: v.number(),
    sandboxTab: v.optional(
      v.union(v.literal("interactive"), v.literal("chat"), v.literal("tools")),
    ),
    reportHintType: v.optional(
      v.union(
        v.literal("smoke"),
        v.literal("regression"),
        v.literal("performance"),
      ),
    ),
  })
    .index("by_order", ["order"])
    .index("by_name", ["name"]),

  sandbox_sessions: defineTable({
    sessionKey: v.string(),
    role: v.union(v.literal("guest"), v.literal("user"), v.literal("admin")),
    activeTab: v.union(
      v.literal("interactive"),
      v.literal("chat"),
      v.literal("tools"),
    ),
    activeScenario: v.optional(v.string()),
    challengeStatus: v.optional(
      v.union(
        v.literal("idle"),
        v.literal("active"),
        v.literal("completed_timeout"),
        v.literal("completed_early"),
        v.literal("reviewing_demo_tests"),
      ),
    ),
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    durationSec: v.optional(v.number()),
    challengeActiveTab: v.optional(
      v.union(
        v.literal("wizard"),
        v.literal("cascading"),
        v.literal("realtime"),
        v.literal("race"),
        v.literal("heavy"),
      ),
    ),
    // Legacy store sub-tab (e.g. "cart"); not written by current mutations.
    productActiveTab: v.optional(v.string()),
    foundBugIds: v.optional(v.array(v.string())),
    lastDemoRunId: v.optional(v.string()),
    authUserEmail: v.optional(v.string()),
    authUserName: v.optional(v.string()),
    authUserRole: v.optional(
      v.union(v.literal("qa"), v.literal("developer"), v.literal("manager")),
    ),
    updatedAt: v.number(),
  }).index("by_sessionKey", ["sessionKey"]),

  sandbox_users: defineTable({
    sessionKey: v.string(),
    name: v.string(),
    email: v.string(),
    passwordMasked: v.string(),
    passwordDemo: v.string(),
    role: v.union(
      v.literal("qa"),
      v.literal("developer"),
      v.literal("manager"),
    ),
    createdAt: v.number(),
  })
    .index("by_sessionKey_and_createdAt", ["sessionKey", "createdAt"])
    .index("by_email", ["email"]),

  sandbox_work_items: defineTable({
    sessionKey: v.string(),
    key: v.string(),
    title: v.string(),
    type: v.union(v.literal("bug"), v.literal("task"), v.literal("story")),
    status: v.union(
      v.literal("backlog"),
      v.literal("in_progress"),
      v.literal("in_review"),
      v.literal("qa"),
      v.literal("done"),
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical"),
    ),
    assignee: v.string(),
    reporter: v.string(),
    storyPoints: v.number(),
    labels: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_sessionKey_and_createdAt", ["sessionKey", "createdAt"])
    .index("by_sessionKey_and_status", ["sessionKey", "status"])
    .index("by_sessionKey_and_assignee", ["sessionKey", "assignee"])
    .index("by_sessionKey_and_key", ["sessionKey", "key"]),

  sandbox_activity_events: defineTable({
    sessionKey: v.string(),
    type: v.union(
      v.literal("user_registered"),
      v.literal("profile_updated"),
      v.literal("chat_message"),
      v.literal("file_uploaded"),
      // Legacy rows from pre–HTTP-removal builds; not written by current code.
      v.literal("swagger_request"),
    ),
    message: v.string(),
    meta: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_sessionKey_and_createdAt", ["sessionKey", "createdAt"]),

  sandbox_uploads: defineTable({
    sessionKey: v.string(),
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    size: v.number(),
    status: v.union(
      v.literal("uploaded"),
      v.literal("processed"),
      v.literal("failed"),
    ),
    preview: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_sessionKey_and_createdAt", ["sessionKey", "createdAt"]),

  sandbox_chat_messages: defineTable({
    sessionKey: v.string(),
    author: v.string(),
    text: v.string(),
    edited: v.boolean(),
    deleted: v.boolean(),
    reactions: v.array(
      v.object({
        emoji: v.string(),
        count: v.number(),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_sessionKey_and_createdAt", ["sessionKey", "createdAt"]),

  sandbox_products: defineTable({
    sku: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    titleUk: v.optional(v.string()),
    titleRu: v.optional(v.string()),
    descriptionUk: v.optional(v.string()),
    descriptionRu: v.optional(v.string()),
    categoryUk: v.optional(v.string()),
    categoryRu: v.optional(v.string()),
    price: v.number(),
    discountPercent: v.number(),
    badge: v.optional(v.string()),
    active: v.boolean(),
    order: v.number(),
  })
    .index("by_sku", ["sku"])
    .index("by_order", ["order"]),

  sandbox_cart_items: defineTable({
    sessionKey: v.string(),
    sku: v.string(),
    qty: v.number(),
    unitPrice: v.number(),
    discountPercent: v.number(),
    updatedAt: v.number(),
  })
    .index("by_sessionKey_and_sku", ["sessionKey", "sku"])
    .index("by_sessionKey_and_updatedAt", ["sessionKey", "updatedAt"]),

  sandbox_promocodes: defineTable({
    code: v.string(),
    discountPercent: v.number(),
    active: v.boolean(),
  }).index("by_code", ["code"]),

  sandbox_bug_catalog: defineTable({
    bugId: v.string(),
    title: v.string(),
    description: v.string(),
    tab: v.union(
      v.literal("wizard"),
      v.literal("cascading"),
      v.literal("realtime"),
      v.literal("race"),
      v.literal("heavy"),
    ),
    severity: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical"),
    ),
    hint: v.string(),
    expected: v.string(),
    actual: v.string(),
    endpoint: v.optional(v.string()),
    active: v.boolean(),
  })
    .index("by_bugId", ["bugId"])
    .index("by_tab_and_bugId", ["tab", "bugId"]),

  sandbox_demo_test_runs: defineTable({
    runId: v.string(),
    sessionKey: v.string(),
    durationMs: v.number(),
    totalChecks: v.number(),
    passed: v.number(),
    failed: v.number(),
    createdAt: v.number(),
  })
    .index("by_runId", ["runId"])
    .index("by_sessionKey_and_createdAt", ["sessionKey", "createdAt"]),

  sandbox_demo_test_results: defineTable({
    runId: v.string(),
    sessionKey: v.string(),
    bugId: v.string(),
    status: v.union(v.literal("passed"), v.literal("failed")),
    message: v.string(),
    createdAt: v.number(),
  })
    .index("by_runId_and_bugId", ["runId", "bugId"])
    .index("by_sessionKey_and_createdAt", ["sessionKey", "createdAt"]),

  sandbox_elements: defineTable({
    tab: v.union(v.literal("interactive"), v.literal("tools")),
    key: v.string(),
    label: v.string(),
    value: v.string(),
    type: v.union(
      v.literal("input"),
      v.literal("select"),
      v.literal("checkbox"),
      v.literal("todo_input"),
      v.literal("calculator_display"),
      v.literal("media_url"),
      v.literal("image_url"),
    ),
    styles: v.object({
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      x: v.optional(v.number()),
      y: v.optional(v.number()),
    }),
    editableByAdmin: v.boolean(),
  }).index("by_tab_and_key", ["tab", "key"]),

  chat_messages: defineTable({
    sessionKey: v.string(),
    sender: v.union(v.literal("userA"), v.literal("userB")),
    text: v.string(),
    createdAt: v.number(),
  }).index("by_sessionKey_and_createdAt", ["sessionKey", "createdAt"]),

  test_runs: defineTable({
    runType: v.union(
      v.literal("smoke"),
      v.literal("regression"),
      v.literal("performance"),
    ),
    status: v.union(v.literal("passed"), v.literal("failed")),
    reportUrl: v.string(),
    traceUrl: v.optional(v.string()),
    summary: v.optional(v.string()),
    ranAt: v.number(),
    durationMs: v.optional(v.number()),
  }).index("by_runType_and_ranAt", ["runType", "ranAt"]),

  social_links: defineTable({
    platform: v.string(),
    title: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_platform", ["platform"]),

  projects: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    repoUrl: v.optional(v.string()),
    demoUrl: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  feedback_messages: defineTable({
    name: v.string(),
    contact: v.string(),
    message: v.string(),
    sourcePage: v.union(
      v.literal("home"),
      v.literal("sandbox"),
      v.literal("links"),
    ),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  sandbox_defaults: defineTable({
    scope: v.literal("global"),
    payload: v.string(),
    updatedAt: v.number(),
  }).index("by_scope", ["scope"]),

  sandbox_scenarios: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    difficulty: v.union(
      v.literal("beginner"),
      v.literal("intermediate"),
      v.literal("advanced"),
    ),
    tags: v.array(v.string()),
    automationFocus: v.string(),
    perfRelevant: v.boolean(),
    order: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_order", ["order"]),

  sandbox_presets: defineTable({
    name: v.string(),
    scenarioSlug: v.string(),
    payload: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_scenarioSlug", ["scenarioSlug"]),

  sandbox_chaos_config: defineTable({
    sessionKey: v.string(),
    scenarioSlug: v.string(),
    latencyMs: v.number(),
    errorRate: v.number(),
    enabled: v.boolean(),
    updatedAt: v.number(),
  }).index("by_sessionKey_and_scenarioSlug", ["sessionKey", "scenarioSlug"]),

  inventory: defineTable({
    itemSlug: v.string(),
    name: v.string(),
    stock: v.number(),
    version: v.number(),
    updatedAt: v.number(),
  }).index("by_itemSlug", ["itemSlug"]),

  wizard_states: defineTable({
    sessionKey: v.string(),
    step: v.number(),
    formData: v.string(),
    error: v.optional(v.string()),
    resetCount: v.number(),
    updatedAt: v.number(),
  }).index("by_sessionKey", ["sessionKey"]),

  list_items: defineTable({
    title: v.string(),
    category: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("archived"),
      v.literal("pending"),
    ),
    value: v.number(),
    order: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_category_and_status", ["category", "status"]),
})
