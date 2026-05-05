import { mutation, query, type MutationCtx } from "./_generated/server"
import { v } from "convex/values"
import type { Doc } from "./_generated/dataModel"

const CHALLENGE_DURATION_SEC = 15 * 60

const bugCatalog = [
  {
    bugId: "wizard-step-reset-loss",
    tab: "wizard",
    message: "Wizard step transition loses state.",
  },
  {
    bugId: "wizard-validation-bypass",
    tab: "wizard",
    message: "Wizard validation accepts malformed email.",
  },
  {
    bugId: "cascading-stale-city",
    tab: "cascading",
    message: "City is not reset after country change.",
  },
  {
    bugId: "cascading-delivery-mismatch",
    tab: "cascading",
    message: "Delivery options can mismatch selected city.",
  },
  {
    bugId: "realtime-out-of-order",
    tab: "realtime",
    message: "Realtime chat ordering can be inconsistent.",
  },
  {
    bugId: "realtime-alert-noise",
    tab: "realtime",
    message: "Keyword alerting is too noisy.",
  },
  {
    bugId: "race-oversell-window",
    tab: "race",
    message: "Race condition can oversell remaining stock.",
  },
  {
    bugId: "race-retry-double-charge",
    tab: "race",
    message: "Retry behavior is not idempotent.",
  },
  {
    bugId: "heavy-p95-spike",
    tab: "heavy",
    message: "Heavy endpoint latency spikes in highLoad mode.",
  },
  {
    bugId: "heavy-response-shape-drift",
    tab: "heavy",
    message: "Heavy endpoint schema can drift by mode.",
  },
] as const

type ChallengeStatus =
  | "idle"
  | "active"
  | "completed_timeout"
  | "completed_early"
  | "reviewing_demo_tests"

async function requireSession(ctx: MutationCtx, sessionKey: string) {
  const session = await ctx.db
    .query("sandbox_sessions")
    .withIndex("by_sessionKey", (q) => q.eq("sessionKey", sessionKey))
    .unique()
  if (!session) throw new Error("SESSION_NOT_FOUND")
  return session
}

function getStatusForSession(
  session: Doc<"sandbox_sessions">,
): ChallengeStatus {
  return (session.challengeStatus as ChallengeStatus | undefined) ?? "idle"
}

function toSummary(
  run: Doc<"test_runs"> | undefined,
): { status: "passed" | "failed"; ranAt: number } | null {
  if (!run) return null
  return { status: run.status, ranAt: run.ranAt }
}

export const getView = query({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const sessionDoc = await ctx.db
      .query("sandbox_sessions")
      .withIndex("by_sessionKey", (q) => q.eq("sessionKey", args.sessionKey))
      .unique()

    const session = sessionDoc
      ? { role: sessionDoc.role, activeTab: sessionDoc.activeTab }
      : { role: "user" as const, activeTab: "interactive" as const }

    const [interactive, tools, smokeRuns, regressionRuns, performanceRuns] =
      await Promise.all([
        ctx.db
          .query("sandbox_elements")
          .withIndex("by_tab_and_key", (q) => q.eq("tab", "interactive"))
          .take(20),
        ctx.db
          .query("sandbox_elements")
          .withIndex("by_tab_and_key", (q) => q.eq("tab", "tools"))
          .take(20),
        ctx.db
          .query("test_runs")
          .withIndex("by_runType_and_ranAt", (q) => q.eq("runType", "smoke"))
          .order("desc")
          .take(1),
        ctx.db
          .query("test_runs")
          .withIndex("by_runType_and_ranAt", (q) =>
            q.eq("runType", "regression"),
          )
          .order("desc")
          .take(1),
        ctx.db
          .query("test_runs")
          .withIndex("by_runType_and_ranAt", (q) =>
            q.eq("runType", "performance"),
          )
          .order("desc")
          .take(1),
      ])

    return {
      session,
      elements: { interactive, tools },
      testRunsSummary: {
        smoke: toSummary(smokeRuns[0]),
        regression: toSummary(regressionRuns[0]),
        performance: toSummary(performanceRuns[0]),
      },
    }
  },
})

export const getChatMessages = query({
  args: {
    sessionKey: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("chat_messages")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .order("desc")
      .take(args.limit)
    return rows.slice().reverse()
  },
})

export const initSession = mutation({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sandbox_sessions")
      .withIndex("by_sessionKey", (q) => q.eq("sessionKey", args.sessionKey))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: Date.now() })
    } else {
      await ctx.db.insert("sandbox_sessions", {
        sessionKey: args.sessionKey,
        role: "user",
        activeTab: "interactive",
        challengeStatus: "idle",
        durationSec: CHALLENGE_DURATION_SEC,
        foundBugIds: [],
        challengeActiveTab: "wizard",
        updatedAt: Date.now(),
      })
    }
  },
})

export const getChallengeStatus = query({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sandbox_sessions")
      .withIndex("by_sessionKey", (q) => q.eq("sessionKey", args.sessionKey))
      .unique()
    if (!session) return null
    const status = getStatusForSession(session)
    const startedAt = session.startedAt ?? null
    const endedAt = session.endedAt ?? null
    const now = Date.now()
    const elapsedSec =
      status === "active" && startedAt
        ? Math.floor((now - startedAt) / 1000)
        : 0
    const secondsLeft =
      status === "active" ? Math.max(0, CHALLENGE_DURATION_SEC - elapsedSec) : 0
    return {
      status,
      startedAt,
      endedAt,
      durationSec: session.durationSec ?? CHALLENGE_DURATION_SEC,
      secondsLeft,
      foundBugIds: session.foundBugIds ?? [],
      activeTab: session.challengeActiveTab ?? "wizard",
      lastDemoRunId: session.lastDemoRunId ?? null,
    }
  },
})

export const startChallenge = mutation({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    await ctx.db.patch(session._id, {
      challengeStatus: "active",
      startedAt: Date.now(),
      endedAt: undefined,
      durationSec: CHALLENGE_DURATION_SEC,
      foundBugIds: [],
      challengeActiveTab: "wizard",
      lastDemoRunId: undefined,
      updatedAt: Date.now(),
    })
    return { ok: true }
  },
})

export const finishChallenge = mutation({
  args: {
    sessionKey: v.string(),
    reason: v.union(v.literal("timeout"), v.literal("early")),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    const status = getStatusForSession(session)
    if (status !== "active") {
      throw new Error("INVALID_SESSION_STATE")
    }
    await ctx.db.patch(session._id, {
      challengeStatus:
        args.reason === "timeout" ? "completed_timeout" : "completed_early",
      endedAt: Date.now(),
      updatedAt: Date.now(),
    })
    return { ok: true }
  },
})

export const restartChallenge = mutation({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    await ctx.db.patch(session._id, {
      challengeStatus: "idle",
      startedAt: undefined,
      endedAt: undefined,
      durationSec: CHALLENGE_DURATION_SEC,
      foundBugIds: [],
      challengeActiveTab: "wizard",
      lastDemoRunId: undefined,
      updatedAt: Date.now(),
    })
    return { ok: true }
  },
})

export const setChallengeActiveTab = mutation({
  args: {
    sessionKey: v.string(),
    tab: v.union(
      v.literal("wizard"),
      v.literal("cascading"),
      v.literal("realtime"),
      v.literal("race"),
      v.literal("heavy"),
    ),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    await ctx.db.patch(session._id, {
      challengeActiveTab: args.tab,
      updatedAt: Date.now(),
    })
    return { ok: true }
  },
})

export const listBugCatalog = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("sandbox_bug_catalog")
      .withIndex("by_tab_and_bugId", (q) => q.eq("tab", "wizard"))
      .take(100)
    if (rows.length > 0) {
      const all = await Promise.all([
        ctx.db
          .query("sandbox_bug_catalog")
          .withIndex("by_tab_and_bugId", (q) => q.eq("tab", "wizard"))
          .take(20),
        ctx.db
          .query("sandbox_bug_catalog")
          .withIndex("by_tab_and_bugId", (q) => q.eq("tab", "cascading"))
          .take(20),
        ctx.db
          .query("sandbox_bug_catalog")
          .withIndex("by_tab_and_bugId", (q) => q.eq("tab", "realtime"))
          .take(20),
        ctx.db
          .query("sandbox_bug_catalog")
          .withIndex("by_tab_and_bugId", (q) => q.eq("tab", "race"))
          .take(20),
        ctx.db
          .query("sandbox_bug_catalog")
          .withIndex("by_tab_and_bugId", (q) => q.eq("tab", "heavy"))
          .take(20),
      ])
      return all.flat()
    }
    return bugCatalog.map((bug) => ({
      ...bug,
      title: bug.bugId,
      description: bug.message,
      severity: "medium" as const,
      hint: bug.message,
      expected: "Expected stable behavior.",
      actual: bug.message,
      endpoint: bug.tab === "heavy" ? "/api/sandbox/heavy" : undefined,
      active: true,
    }))
  },
})

export const markBugFound = mutation({
  args: { sessionKey: v.string(), bugId: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    const bugExists = bugCatalog.some((b) => b.bugId === args.bugId)
    if (!bugExists) throw new Error("BUG_NOT_FOUND")
    const next = Array.from(
      new Set([...(session.foundBugIds ?? []), args.bugId]),
    )
    await ctx.db.patch(session._id, {
      foundBugIds: next,
      updatedAt: Date.now(),
    })
    return { foundBugIds: next }
  },
})

export const unmarkBugFound = mutation({
  args: { sessionKey: v.string(), bugId: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    const next = (session.foundBugIds ?? []).filter((id) => id !== args.bugId)
    await ctx.db.patch(session._id, {
      foundBugIds: next,
      updatedAt: Date.now(),
    })
    return { foundBugIds: next }
  },
})

export const listFoundBugs = query({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sandbox_sessions")
      .withIndex("by_sessionKey", (q) => q.eq("sessionKey", args.sessionKey))
      .unique()
    if (!session) throw new Error("SESSION_NOT_FOUND")
    return session.foundBugIds ?? []
  },
})

export const runDemoTests = mutation({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    const foundBugIds = new Set(session.foundBugIds ?? [])
    const started = Date.now()
    const results = bugCatalog.map((bug) => {
      const passed = foundBugIds.has(bug.bugId)
      return {
        bugId: bug.bugId,
        status: passed ? ("passed" as const) : ("failed" as const),
        message: passed
          ? "Manual finding matches automated check."
          : `Automated check found: ${bug.message}`,
      }
    })
    const durationMs = Math.max(
      3000,
      Math.min(6000, 3000 + ((bugCatalog.length * 123) % 2500)),
    )
    const runId = crypto.randomUUID()
    const passed = results.filter((r) => r.status === "passed").length
    const failed = results.length - passed

    await ctx.db.insert("sandbox_demo_test_runs", {
      runId,
      sessionKey: args.sessionKey,
      durationMs,
      totalChecks: results.length,
      passed,
      failed,
      createdAt: started,
    })
    for (const result of results) {
      await ctx.db.insert("sandbox_demo_test_results", {
        runId,
        sessionKey: args.sessionKey,
        bugId: result.bugId,
        status: result.status,
        message: result.message,
        createdAt: started,
      })
    }
    await ctx.db.patch(session._id, {
      challengeStatus: "reviewing_demo_tests",
      lastDemoRunId: runId,
      updatedAt: Date.now(),
    })
    return {
      runId,
      durationMs,
      totalChecks: results.length,
      passed,
      failed,
      results,
    }
  },
})

export const getDemoTestRun = query({
  args: { sessionKey: v.string(), runId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let run: Doc<"sandbox_demo_test_runs"> | null = null
    if (args.runId !== undefined) {
      const runId = args.runId
      run = await ctx.db
        .query("sandbox_demo_test_runs")
        .withIndex("by_runId", (q) => q.eq("runId", runId))
        .unique()
    } else {
      const runs = await ctx.db
        .query("sandbox_demo_test_runs")
        .withIndex("by_sessionKey_and_createdAt", (q) =>
          q.eq("sessionKey", args.sessionKey),
        )
        .order("desc")
        .take(1)
      run = runs[0] ?? null
    }
    if (!run) return null
    const results = await ctx.db
      .query("sandbox_demo_test_results")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .order("desc")
      .take(200)
    return {
      runId: run.runId,
      durationMs: run.durationMs,
      totalChecks: run.totalChecks,
      passed: run.passed,
      failed: run.failed,
      results: results
        .filter((r) => r.runId === run.runId)
        .map((r) => ({
          bugId: r.bugId,
          status: r.status,
          message: r.message,
        })),
    }
  },
})

export const switchRole = mutation({
  args: {
    sessionKey: v.string(),
    role: v.union(v.literal("guest"), v.literal("user"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    await ctx.db.patch(session._id, { role: args.role, updatedAt: Date.now() })
  },
})

export const setActiveTab = mutation({
  args: {
    sessionKey: v.string(),
    tab: v.union(
      v.literal("interactive"),
      v.literal("chat"),
      v.literal("tools"),
    ),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    await ctx.db.patch(session._id, {
      activeTab: args.tab,
      updatedAt: Date.now(),
    })
  },
})

export const sendChatMessage = mutation({
  args: {
    sessionKey: v.string(),
    sender: v.union(v.literal("userA"), v.literal("userB")),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmedText = args.text.trim()
    if (!trimmedText) throw new Error("text must not be empty")

    await ctx.db.insert("chat_messages", {
      sessionKey: args.sessionKey,
      sender: args.sender,
      text: trimmedText,
      createdAt: Date.now(),
    })
  },
})

async function requireAdmin(ctx: MutationCtx, sessionKey: string) {
  const session = await ctx.db
    .query("sandbox_sessions")
    .withIndex("by_sessionKey", (q) => q.eq("sessionKey", sessionKey))
    .unique()
  if (!session) throw new Error("SESSION_NOT_FOUND")
  if (session.role !== "admin") throw new Error("FORBIDDEN_ADMIN_ONLY")
  return session
}

export const updateElement = mutation({
  args: {
    sessionKey: v.string(),
    key: v.string(),
    patch: v.object({
      label: v.optional(v.string()),
      value: v.optional(v.string()),
      styles: v.optional(
        v.object({
          width: v.optional(v.number()),
          height: v.optional(v.number()),
          x: v.optional(v.number()),
          y: v.optional(v.number()),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionKey)

    const [fromInteractive, fromTools] = await Promise.all([
      ctx.db
        .query("sandbox_elements")
        .withIndex("by_tab_and_key", (q) =>
          q.eq("tab", "interactive").eq("key", args.key),
        )
        .unique(),
      ctx.db
        .query("sandbox_elements")
        .withIndex("by_tab_and_key", (q) =>
          q.eq("tab", "tools").eq("key", args.key),
        )
        .unique(),
    ])

    const element = fromInteractive ?? fromTools
    if (!element) throw new Error("ELEMENT_NOT_FOUND")

    const patchData: {
      label?: string
      value?: string
      styles?: { width?: number; height?: number; x?: number; y?: number }
    } = {}
    if (args.patch.label !== undefined) patchData.label = args.patch.label
    if (args.patch.value !== undefined) patchData.value = args.patch.value
    if (args.patch.styles !== undefined) patchData.styles = args.patch.styles

    await ctx.db.patch(element._id, patchData)
  },
})

export const resetSandbox = mutation({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.sessionKey)

    const defaults = await ctx.db
      .query("sandbox_defaults")
      .withIndex("by_scope", (q) => q.eq("scope", "global"))
      .unique()
    if (!defaults) throw new Error("RESET_BASELINE_NOT_FOUND")

    let parsed: unknown
    try {
      parsed = JSON.parse(defaults.payload)
    } catch {
      throw new Error("RESET_PAYLOAD_INVALID")
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !Array.isArray((parsed as Record<string, unknown>).elements)
    ) {
      throw new Error("RESET_PAYLOAD_INVALID")
    }

    type BaselineElement = {
      tab: "interactive" | "tools"
      key: string
      label: string
      value: string
      type:
        | "input"
        | "select"
        | "checkbox"
        | "todo_input"
        | "calculator_display"
        | "media_url"
        | "image_url"
      styles: { width?: number; height?: number; x?: number; y?: number }
      editableByAdmin: boolean
    }

    const baseline = (parsed as { elements: BaselineElement[] }).elements

    const [existingInteractive, existingTools] = await Promise.all([
      ctx.db
        .query("sandbox_elements")
        .withIndex("by_tab_and_key", (q) => q.eq("tab", "interactive"))
        .take(100),
      ctx.db
        .query("sandbox_elements")
        .withIndex("by_tab_and_key", (q) => q.eq("tab", "tools"))
        .take(100),
    ])

    const existingAll = [...existingInteractive, ...existingTools]
    const existingMap = new Map<string, Doc<"sandbox_elements">>()
    for (const elem of existingAll) {
      existingMap.set(`${elem.tab}|${elem.key}`, elem)
    }

    const baselineKeys = new Set<string>()
    for (const elem of baseline) {
      baselineKeys.add(`${elem.tab}|${elem.key}`)
    }

    for (const elem of baseline) {
      const compositeKey = `${elem.tab}|${elem.key}`
      const existing = existingMap.get(compositeKey)
      if (existing) {
        await ctx.db.patch(existing._id, {
          label: elem.label,
          value: elem.value,
          type: elem.type,
          styles: elem.styles,
          editableByAdmin: elem.editableByAdmin,
        })
      } else {
        await ctx.db.insert("sandbox_elements", {
          tab: elem.tab,
          key: elem.key,
          label: elem.label,
          value: elem.value,
          type: elem.type,
          styles: elem.styles,
          editableByAdmin: elem.editableByAdmin,
        })
      }
    }

    for (const elem of existingAll) {
      if (!baselineKeys.has(`${elem.tab}|${elem.key}`)) {
        await ctx.db.delete(elem._id)
      }
    }
  },
})

export const getLatestTestRuns = query({
  args: {},
  handler: async (ctx) => {
    const [smokeRuns, regressionRuns, performanceRuns] = await Promise.all([
      ctx.db
        .query("test_runs")
        .withIndex("by_runType_and_ranAt", (q) => q.eq("runType", "smoke"))
        .order("desc")
        .take(1),
      ctx.db
        .query("test_runs")
        .withIndex("by_runType_and_ranAt", (q) => q.eq("runType", "regression"))
        .order("desc")
        .take(1),
      ctx.db
        .query("test_runs")
        .withIndex("by_runType_and_ranAt", (q) =>
          q.eq("runType", "performance"),
        )
        .order("desc")
        .take(1),
    ])

    return {
      smoke: smokeRuns[0] ?? null,
      regression: regressionRuns[0] ?? null,
      performance: performanceRuns[0] ?? null,
    }
  },
})

export const setActiveScenario = mutation({
  args: { sessionKey: v.string(), scenarioSlug: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    await ctx.db.patch(session._id, {
      activeScenario: args.scenarioSlug,
      updatedAt: Date.now(),
    })
  },
})

export const listScenarios = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sandbox_scenarios")
      .withIndex("by_order")
      .order("asc")
      .take(20)
  },
})

export const getScenarioBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sandbox_scenarios")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()
  },
})

export const getPresets = query({
  args: { scenarioSlug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sandbox_presets")
      .withIndex("by_scenarioSlug", (q) =>
        q.eq("scenarioSlug", args.scenarioSlug),
      )
      .take(10)
  },
})

export const applyPreset = mutation({
  args: { sessionKey: v.string(), presetName: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)

    const preset = await ctx.db
      .query("sandbox_presets")
      .withIndex("by_name", (q) => q.eq("name", args.presetName))
      .unique()
    if (!preset) throw new Error("PRESET_NOT_FOUND")

    let parsed: unknown
    try {
      parsed = JSON.parse(preset.payload)
    } catch {
      throw new Error("PRESET_PAYLOAD_INVALID")
    }
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("PRESET_PAYLOAD_INVALID")
    }

    const payload = parsed as Record<string, unknown>
    const slug = preset.scenarioSlug

    if (slug === "wizard-failure-recovery") {
      const existing = await ctx.db
        .query("wizard_states")
        .withIndex("by_sessionKey", (q) => q.eq("sessionKey", args.sessionKey))
        .unique()
      const resetData = {
        step: 1,
        formData: "{}",
        error: undefined,
        resetCount: (existing?.resetCount ?? 0) + 1,
        updatedAt: Date.now(),
      }
      if (existing) {
        await ctx.db.patch(existing._id, resetData)
      } else {
        await ctx.db.insert("wizard_states", {
          sessionKey: args.sessionKey,
          ...resetData,
        })
      }
    } else if (slug === "race-condition-checkout") {
      const itemSlug =
        typeof payload.itemSlug === "string"
          ? payload.itemSlug
          : "limited-item-1"
      const stock =
        typeof payload.stock === "number" &&
        Number.isFinite(payload.stock) &&
        payload.stock >= 0
          ? Math.floor(payload.stock)
          : 1
      const item = await ctx.db
        .query("inventory")
        .withIndex("by_itemSlug", (q) => q.eq("itemSlug", itemSlug))
        .unique()
      const now = Date.now()
      if (item) {
        await ctx.db.patch(item._id, {
          stock,
          version: 0,
          updatedAt: now,
        })
      } else {
        await ctx.db.insert("inventory", {
          itemSlug,
          name:
            itemSlug === "limited-item-1"
              ? "Limited Edition Widget"
              : `Item ${itemSlug}`,
          stock,
          version: 0,
          updatedAt: now,
        })
      }
    } else if (
      slug === "heavy-endpoint-benchmark" ||
      slug === "cascading-inputs" ||
      slug === "realtime-chat-alerts" ||
      slug === "large-list-virtualization"
    ) {
      // no persistent state to reset for these scenarios
    }

    return { applied: true, scenarioSlug: slug }
  },
})

function maskPassword(password: string) {
  if (password.length <= 2) return "*".repeat(password.length)
  return `${password[0]}${"*".repeat(Math.max(1, password.length - 2))}${password[password.length - 1]}`
}

async function createActivityEvent(
  ctx: MutationCtx,
  sessionKey: string,
  type: "user_registered" | "profile_updated" | "chat_message",
  message: string,
  meta?: string,
) {
  await ctx.db.insert("sandbox_activity_events", {
    sessionKey,
    type,
    message,
    meta,
    createdAt: Date.now(),
  })
}

export const getProductView = query({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const [latestUsers, latestEvents, chatCount, cartCount] = await Promise.all(
      [
        ctx.db
          .query("sandbox_users")
          .withIndex("by_sessionKey_and_createdAt", (q) =>
            q.eq("sessionKey", args.sessionKey),
          )
          .order("desc")
          .take(10),
        ctx.db
          .query("sandbox_activity_events")
          .withIndex("by_sessionKey_and_createdAt", (q) =>
            q.eq("sessionKey", args.sessionKey),
          )
          .order("desc")
          .take(20),
        ctx.db
          .query("sandbox_chat_messages")
          .withIndex("by_sessionKey_and_createdAt", (q) =>
            q.eq("sessionKey", args.sessionKey),
          )
          .order("desc")
          .take(1),
        ctx.db
          .query("sandbox_cart_items")
          .withIndex("by_sessionKey_and_updatedAt", (q) =>
            q.eq("sessionKey", args.sessionKey),
          )
          .order("desc")
          .take(100),
      ],
    )

    return {
      latestUsers,
      latestEvents,
      stats: {
        chatCount: chatCount.length,
        cartCount: cartCount.length,
      },
    }
  },
})

export const registerUser = mutation({
  args: {
    sessionKey: v.string(),
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(
      v.literal("qa"),
      v.literal("developer"),
      v.literal("manager"),
    ),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    const name = args.name.trim()
    const email = args.email.trim().toLowerCase()
    const password = args.password.trim()
    if (!name) throw new Error("NAME_REQUIRED")
    if (name.length > 120) throw new Error("NAME_TOO_LONG")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length < 6)
      throw new Error("EMAIL_INVALID")
    if (password.length < 8) throw new Error("PASSWORD_TOO_SHORT")

    const sessionUsers = await ctx.db
      .query("sandbox_users")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .take(200)
    if (sessionUsers.some((row) => row.email === email))
      throw new Error("EMAIL_ALREADY_EXISTS")

    const globalCollision = await ctx.db
      .query("sandbox_users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique()
    if (globalCollision && globalCollision.sessionKey !== args.sessionKey)
      throw new Error("EMAIL_RESERVED")

    // Planted QA defect (vs-05): login compares passwordDemo strictly; hidden
    // char makes post-registration login fail until seed is removed.
    const passwordDemo = `\u200b${password}`

    const userId = await ctx.db.insert("sandbox_users", {
      sessionKey: args.sessionKey,
      name,
      email,
      passwordMasked: maskPassword(password),
      passwordDemo,
      role: args.role,
      createdAt: Date.now(),
    })

    await ctx.db.patch(session._id, {
      authUserEmail: email,
      authUserName: name,
      authUserRole: args.role,
      updatedAt: Date.now(),
    })

    await createActivityEvent(
      ctx,
      args.sessionKey,
      "user_registered",
      `Registered user ${name} (${args.role})`,
      JSON.stringify({ email }),
    )

    return { userId }
  },
})

export const listUsers = query({
  args: {
    sessionKey: v.string(),
    limit: v.number(),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit, 200))
    let rows = await ctx.db
      .query("sandbox_users")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .order("desc")
      .take(limit)
    if (args.search?.trim()) {
      const q = args.search.trim().toLowerCase()
      rows = rows.filter(
        (row) =>
          row.email.toLowerCase().includes(q) ||
          row.name.toLowerCase().includes(q),
      )
    }
    return rows
  },
})

export const loginUser = mutation({
  args: {
    sessionKey: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    const email = args.email.trim().toLowerCase()
    const password = args.password.trim()
    if (!email || !password) throw new Error("LOGIN_FIELDS_REQUIRED")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length < 6)
      throw new Error("EMAIL_INVALID")
    if (password.length < 8) throw new Error("PASSWORD_TOO_SHORT")

    const user = await ctx.db
      .query("sandbox_users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique()
    if (!user || user.sessionKey !== args.sessionKey) {
      throw new Error("LOGIN_INVALID_CREDENTIALS")
    }
    if (user.passwordDemo !== password) {
      throw new Error("LOGIN_INVALID_CREDENTIALS")
    }

    await ctx.db.patch(session._id, {
      authUserEmail: user.email,
      authUserName: user.name,
      authUserRole: user.role,
      updatedAt: Date.now(),
    })
    return {
      ok: true,
      user: { name: user.name, email: user.email, role: user.role },
    }
  },
})

export const logoutUser = mutation({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    await ctx.db.patch(session._id, {
      authUserEmail: undefined,
      authUserName: undefined,
      authUserRole: undefined,
      updatedAt: Date.now(),
    })
    return { ok: true }
  },
})

export const updateSandboxProfile = mutation({
  args: {
    sessionKey: v.string(),
    name: v.string(),
    role: v.union(
      v.literal("qa"),
      v.literal("developer"),
      v.literal("manager"),
    ),
  },
  handler: async (ctx, args) => {
    const session = await requireSession(ctx, args.sessionKey)
    const email = session.authUserEmail
    if (!email) throw new Error("PROFILE_NOT_AUTHENTICATED")

    const name = args.name.trim()
    if (!name) throw new Error("NAME_REQUIRED")
    if (name.length > 120) throw new Error("NAME_TOO_LONG")

    const user = await ctx.db
      .query("sandbox_users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique()
    if (!user || user.sessionKey !== args.sessionKey) {
      throw new Error("PROFILE_USER_NOT_FOUND")
    }

    await ctx.db.patch(user._id, {
      name,
      role: args.role,
    })
    await ctx.db.patch(session._id, {
      authUserName: name,
      authUserRole: args.role,
      updatedAt: Date.now(),
    })

    await createActivityEvent(
      ctx,
      args.sessionKey,
      "profile_updated",
      `Updated profile for ${name} (${args.role})`,
      JSON.stringify({ email }),
    )

    return { ok: true, name, role: args.role, email }
  },
})

export const getSessionAuthState = query({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sandbox_sessions")
      .withIndex("by_sessionKey", (q) => q.eq("sessionKey", args.sessionKey))
      .unique()
    if (!session?.authUserEmail) return null
    return {
      name: session.authUserName ?? "Unknown",
      email: session.authUserEmail,
      role: session.authUserRole ?? "qa",
    }
  },
})

const WORK_ITEM_SEED = [
  {
    key: "QA-101",
    title: "Checkout retries duplicate order id in rare timeout case",
    type: "bug" as const,
    status: "in_progress" as const,
    priority: "high" as const,
    assignee: "Olena QA",
    reporter: "Ivan PM",
    storyPoints: 5,
    labels: ["checkout", "payments", "regression"],
  },
  {
    key: "QA-102",
    title: "Add smoke automation for registration + login happy path",
    type: "task" as const,
    status: "qa" as const,
    priority: "medium" as const,
    assignee: "Dmytro AQA",
    reporter: "Olena QA",
    storyPoints: 3,
    labels: ["automation", "smoke"],
  },
  {
    key: "QA-103",
    title: "As user I want promo hints in cart before checkout",
    type: "story" as const,
    status: "backlog" as const,
    priority: "medium" as const,
    assignee: "Nadia FE",
    reporter: "Ivan PM",
    storyPoints: 8,
    labels: ["ux", "cart", "promo"],
  },
  {
    key: "QA-104",
    title: "Realtime chat message order drifts under high latency",
    type: "bug" as const,
    status: "in_review" as const,
    priority: "critical" as const,
    assignee: "Artem BE",
    reporter: "Dmytro AQA",
    storyPoints: 5,
    labels: ["realtime", "websocket"],
  },
  {
    key: "QA-105",
    title: "Refine API examples for cart and chat operations",
    type: "task" as const,
    status: "done" as const,
    priority: "low" as const,
    assignee: "Nadia FE",
    reporter: "Artem BE",
    storyPoints: 2,
    labels: ["docs", "api"],
  },
]

export const ensureWorkItems = mutation({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    const existing = await ctx.db
      .query("sandbox_work_items")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .take(200)
    if (existing.length >= 100) return { ok: true }

    const now = Date.now()
    const generatedItems = Array.from({ length: 100 }, (_, idx) => {
      const base = WORK_ITEM_SEED[idx % WORK_ITEM_SEED.length]
      return {
        ...base,
        key: `QA-${101 + idx}`,
        title: `${base.title} [${idx + 1}]`,
      }
    })
    const existingKeys = new Set(existing.map((item) => item.key))
    const missingItems = generatedItems.filter(
      (item) => !existingKeys.has(item.key),
    )
    for (const [idx, item] of missingItems.entries()) {
      await ctx.db.insert("sandbox_work_items", {
        sessionKey: args.sessionKey,
        ...item,
        createdAt: now + idx,
        updatedAt: now + idx,
      })
    }
    return { ok: true }
  },
})

export const listWorkItems = query({
  args: {
    sessionKey: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit, 200))
    return await ctx.db
      .query("sandbox_work_items")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .order("desc")
      .take(limit)
  },
})

export const updateWorkItem = mutation({
  args: {
    sessionKey: v.string(),
    key: v.string(),
    title: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("backlog"),
        v.literal("in_progress"),
        v.literal("in_review"),
        v.literal("qa"),
        v.literal("done"),
      ),
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical"),
      ),
    ),
    assignee: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    const workItem = await ctx.db
      .query("sandbox_work_items")
      .withIndex("by_sessionKey_and_key", (q) =>
        q.eq("sessionKey", args.sessionKey).eq("key", args.key),
      )
      .unique()
    if (!workItem) throw new Error("WORK_ITEM_NOT_FOUND")

    const patch: {
      status?: "backlog" | "in_progress" | "in_review" | "qa" | "done"
      priority?: "low" | "medium" | "high" | "critical"
      assignee?: string
      title?: string
      updatedAt: number
    } = {
      updatedAt: Date.now(),
    }
    if (args.title !== undefined) patch.title = args.title.trim()
    if (args.status !== undefined) patch.status = args.status
    if (args.priority !== undefined) patch.priority = args.priority
    if (args.assignee !== undefined) patch.assignee = args.assignee.trim()

    await ctx.db.patch(workItem._id, patch)
    return { ok: true }
  },
})

export const addRealtimeMessage = mutation({
  args: {
    sessionKey: v.string(),
    author: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    const author = args.author.trim() || "Guest"
    const text = args.text.trim()
    if (!text) throw new Error("TEXT_REQUIRED")

    const messageId = await ctx.db.insert("sandbox_chat_messages", {
      sessionKey: args.sessionKey,
      author,
      text,
      edited: false,
      deleted: false,
      reactions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    await createActivityEvent(
      ctx,
      args.sessionKey,
      "chat_message",
      `${author}: ${text}`,
    )
    return { messageId }
  },
})

export const editRealtimeMessage = mutation({
  args: {
    sessionKey: v.string(),
    messageId: v.id("sandbox_chat_messages"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    const message = await ctx.db.get(args.messageId)
    if (!message || message.sessionKey !== args.sessionKey)
      throw new Error("MESSAGE_NOT_FOUND")
    const text = args.text.trim()
    if (!text) throw new Error("TEXT_REQUIRED")
    await ctx.db.patch(args.messageId, {
      text,
      edited: true,
      updatedAt: Date.now(),
    })
    return { ok: true }
  },
})

export const deleteRealtimeMessage = mutation({
  args: {
    sessionKey: v.string(),
    messageId: v.id("sandbox_chat_messages"),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    const message = await ctx.db.get(args.messageId)
    if (!message || message.sessionKey !== args.sessionKey)
      throw new Error("MESSAGE_NOT_FOUND")
    await ctx.db.patch(args.messageId, {
      deleted: true,
      text: "[deleted]",
      updatedAt: Date.now(),
    })
    return { ok: true }
  },
})

export const reactToRealtimeMessage = mutation({
  args: {
    sessionKey: v.string(),
    messageId: v.id("sandbox_chat_messages"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    const message = await ctx.db.get(args.messageId)
    if (!message || message.sessionKey !== args.sessionKey)
      throw new Error("MESSAGE_NOT_FOUND")
    const emoji = args.emoji.trim()
    if (!emoji) throw new Error("EMOJI_REQUIRED")
    const next = [...message.reactions]
    const idx = next.findIndex((item) => item.emoji === emoji)
    if (idx === -1) next.push({ emoji, count: 1 })
    else next[idx] = { emoji, count: next[idx].count + 1 }
    await ctx.db.patch(args.messageId, {
      reactions: next,
      updatedAt: Date.now(),
    })
    return { ok: true }
  },
})

export const listRealtimeMessages = query({
  args: {
    sessionKey: v.string(),
    limit: v.number(),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit, 200))
    let rows = await ctx.db
      .query("sandbox_chat_messages")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .order("desc")
      .take(limit)
    if (args.search?.trim()) {
      const q = args.search.trim().toLowerCase()
      rows = rows.filter(
        (row) =>
          row.text.toLowerCase().includes(q) ||
          row.author.toLowerCase().includes(q),
      )
    }
    return rows
  },
})

export const listActivityFeed = query({
  args: {
    sessionKey: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit, 200))
    return await ctx.db
      .query("sandbox_activity_events")
      .withIndex("by_sessionKey_and_createdAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .order("desc")
      .take(limit)
  },
})

const catalogLocaleValidator = v.union(
  v.literal("en"),
  v.literal("uk"),
  v.literal("ru"),
)

type CatalogLocale = "en" | "uk" | "ru"

function pickCatalogStrings(
  product: {
    title: string
    description?: string
    category?: string
    titleUk?: string
    titleRu?: string
    descriptionUk?: string
    descriptionRu?: string
    categoryUk?: string
    categoryRu?: string
  },
  locale: CatalogLocale,
): { title: string; description?: string; category?: string } {
  if (locale === "uk") {
    return {
      title: product.titleUk ?? product.title,
      description: product.descriptionUk ?? product.description,
      category: product.categoryUk ?? product.category,
    }
  }
  if (locale === "ru") {
    return {
      title: product.titleRu ?? product.title,
      description: product.descriptionRu ?? product.description,
      category: product.categoryRu ?? product.category,
    }
  }
  return {
    title: product.title,
    description: product.description,
    category: product.category,
  }
}

function campaignRulesForLocale(locale: CatalogLocale) {
  if (locale === "uk") {
    return [
      {
        id: "bundle-keyboard-mouse" as const,
        title: "Комбо клавіатура + миша",
        condition: "Додайте клавіатуру SKU-001 і мишу SKU-002",
        benefit: "Додаткові −10% на ці позиції в кошику",
      },
      {
        id: "workstation-pack" as const,
        title: "Робоча станція",
        condition: "Монітор SKU-004 і USB-хаб SKU-003 разом",
        benefit: "Розблокує промокод WORKSET15",
      },
      {
        id: "bulk-qa-order" as const,
        title: "Масове QA-замовлення",
        condition: "3+ одиниць товару в кошику загалом",
        benefit: "Розблокує промокод TEAM5",
      },
      {
        id: "high-value" as const,
        title: "Кошик преміум-класу",
        condition: "Підсумок після знижок товарів ≥ $300",
        benefit: "Авто −$20 з усього кошика",
      },
    ]
  }
  if (locale === "ru") {
    return [
      {
        id: "bundle-keyboard-mouse" as const,
        title: "Бандл клавиатура + мышь",
        condition: "Добавьте клавиатуру SKU-001 и мышь SKU-002",
        benefit: "Ещё −10% на эти строки корзины",
      },
      {
        id: "workstation-pack" as const,
        title: "Рабочая станция",
        condition: "Монитор SKU-004 и USB-хаб SKU-003 вместе",
        benefit: "Открывает промокод WORKSET15",
      },
      {
        id: "bulk-qa-order" as const,
        title: "Опт для QA",
        condition: "3+ позиций в корзине всего",
        benefit: "Открывает промокод TEAM5",
      },
      {
        id: "high-value" as const,
        title: "Дорогая корзина",
        condition: "Сумма после скидок по товарам ≥ $300",
        benefit: "Авто −$20 со всей корзины",
      },
    ]
  }
  return [
    {
      id: "bundle-keyboard-mouse" as const,
      title: "Keyboard + Mouse bundle",
      condition: "Add SKU-001 keyboard + SKU-002 mouse",
      benefit: "Extra 10% off these cart lines",
    },
    {
      id: "workstation-pack" as const,
      title: "Workstation pack",
      condition: "Add monitor SKU-004 + USB-C hub SKU-003",
      benefit: "Unlock promo code WORKSET15",
    },
    {
      id: "bulk-qa-order" as const,
      title: "Bulk QA order",
      condition: "Add 3+ total items to cart",
      benefit: "Unlock promo code TEAM5",
    },
    {
      id: "high-value" as const,
      title: "High value cart",
      condition: "Subtotal after item discounts >= $300",
      benefit: "Automatic extra $20 cart discount",
    },
  ]
}

const PRODUCT_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80",
] as const

const CATEGORY_EN = [
  "Vibecoder ears — clean sound before the blame retro",
  "Cursor turbo — mice that sprint to Done",
  "Pixel truth — monitors that shame low-DPI dreams",
  "Deploy karaoke — mics that forgive bad releases",
  "Stream guilt — lights for innocent thumbnails",
  "Infinite stash — drives that swallow git history",
  "Desk mystique — cables nobody understands",
  "Smart desk — standing meetings nobody wanted",
] as const

const CATEGORY_UK = [
  "Вуха вайбкодера — кришталевий звук перед ретро звинувачень",
  "Турбо курсора — миші, що летять у Done самі",
  "Піксельна правда — монітори, що соромлять мрії про 720p",
  "Караоке релізу — мікрофони, що пробачають погані деплої",
  "Стрім провини — світло для невинних прев'ю",
  "Нескінченний схов — диски, що ковтають історію git",
  "Містика столу — кабелі, які ніхто не пояснить",
  "Розумний стіл — стендапи стоячи, яких ніхто не просив",
] as const

const CATEGORY_RU = [
  "Уши вайбкодера — кристальный звук перед ретро обвинений",
  "Турбо курсора — мыши, которые сами улетают в Done",
  "Пиксельная правда — мониторы, стыдящие мечты о 720p",
  "Караоке релиза — микрофоны, прощающие плохие деплои",
  "Стрим вины — свет для невинных превью",
  "Бесконечный тайник — диски, глотающие историю git",
  "Мистика стола — кабели, которые никто не объяснит",
  "Умный стол — стендапы стоя, которых никто не просил",
] as const

const TITLE_EN = [
  "Fashion vibecoder headphones with suspiciously clean highs",
  "Super vibecoder mouse — DPI high enough to reopen closed tickets",
  "Mechanical keyboard that types 'LGTM' before you think",
  "4K monitor for counting every pixel of technical debt",
  "USB-C hub that connects chaos to a single dongle of hope",
  "Webcam that blames lighting for every bad standup take",
  "Mic arm strong enough to hold your imposter syndrome",
  "Ring light for influencers who only ship hotfixes",
  "NVMe drive faster than your PM changing priorities",
  "Portable SSD for repos you swear you will trim someday",
  "Cable organizer that hides shame better than .gitignore",
  "Desk mat with extra cushioning for forehead-driven debugging",
  "Laptop stand elevating both screen and fragile ego",
  "Noise gate pedal for Slack huddles nobody asked for",
  "Stream deck with macros for 'restarting local'",
] as const

const TITLE_UK = [
  "Модні навушники вайбкодера з підозріло чистими верхами",
  "Супермиш вайбкодера — DPI, щоб знову відкрити закриті тікети",
  "Механіка, що набирає «LGTM» швидше за думку",
  "4K монітор для підрахунку кожного пікселя техборгу",
  "USB-C хаб, що зводить хаос до одного адаптера надії",
  "Вебкамера, що звинувачує світло у кожному поганому стендапі",
  "Рука для міцнішої за ваш синдром самозванця",
  "Кільцеве світло для тих, хто шипить лише хотфікси",
  "NVMe швидший за зміну пріоритетів PM",
  "Зовнішній SSD для реп, які ви «ось-ось» почищете",
  "Органайзер кабелів — приховує сором краще за .gitignore",
  "Килимок з амортизацією для лобового дебагу",
  "Підставка для ноутбука — піднімає екран і крихке ego",
  "Педаль шумодаву для хадлів у Slack, яких не просили",
  "Стрім-дек з макросами «перезапускаю локалку»",
] as const

const TITLE_RU = [
  "Модные наушники вайбкодера с подозрительно чистыми верхами",
  "Супермышь вайбкодера — DPI, чтобы снова открыть закрытые тикеты",
  "Механика, которая печатает «LGTM» быстрее мысли",
  "4K монитор для подсчёта каждого пикселя техдолга",
  "USB-C хаб, сводящий хаос к одному адаптеру надежды",
  "Вебкамера, винящая свет в каждом плохом стендапе",
  "Рука для мика крепче вашего синдрома самозванца",
  "Кольцевой свет для тех, кто шипит только хотфиксы",
  "NVMe быстрее смены приоритетов PM",
  "Внешний SSD для реп, которые вы «вот-вот» подчистите",
  "Органайзер кабелей — прячет стыд лучше .gitignore",
  "Коврик с амортизацией для лобового дебага",
  "Подставка для ноутбука — поднимает экран и хрупкое ego",
  "Педаль шумодава для хадлов в Slack, которых не просили",
  "Стрим-дек с макросами «перезапускаю локалку»",
] as const

const DESC_TPL_EN = [
  "QA-grade {cat}: sniff regressions faster and panic 20% less before demos.",
  "Junior vibecoder classic — plug in, press run, pretend flaky tests were always green.",
  "Rubber-duck certified {cat} with meme-tier motivation for midnight marathons.",
  "Side effects: sudden productivity, dramatic keyboard solos, fewer 'works on my machine' excuses.",
  "Built for standups that need a miracle: this {cat} item adds +10 to bug charisma.",
  "Recommended by 9/10 rubber ducks; the tenth is still in code review.",
] as const

const DESC_TPL_UK = [
  "QA-клас {cat}: швидше нюхати регресії і на 20% менше паніки перед демо.",
  "Класика джуніор-вайбкодера — увімкни, натисни run, уяви що флейкі завжди були зелені.",
  "Сертифіковано качкою для коду; мемна мотивація для нічних марафонів.",
  "Побічні ефекти: раптова продуктивність, драматичні соло на клавіатурі.",
  "Для стендапів, де потрібне диво: цей {cat} дає +10 до харизми багів.",
  "9 з 10 гумових качок рекомендують; десята ще в code review.",
] as const

const DESC_TPL_RU = [
  "QA-класс {cat}: быстрее чуять регрессы и на 20% меньше паники перед демо.",
  "Классика джуниор-вайбкодера — включи, жми run, представь что флейки всегда были зелёные.",
  "Сертифицировано резиновой уткой; мемная мотивация для ночных марафонов.",
  "Побочные эффекты: внезапная продуктивность, драматичные соло на клавиатуре.",
  "Для стендапов, где нужно чудо: этот {cat} даёт +10 к харизме багов.",
  "9 из 10 резиновых уток рекомендуют; десятая ещё в code review.",
] as const

type DefaultCatalogRow = {
  sku: string
  title: string
  titleUk: string
  titleRu: string
  description: string
  descriptionUk: string
  descriptionRu: string
  category: string
  categoryUk: string
  categoryRu: string
  imageUrl: string
  price: number
  discountPercent: number
  badge: string
  order: number
}

const DEFAULT_PRODUCTS: DefaultCatalogRow[] = Array.from(
  { length: 200 },
  (_, idx) => {
    const number = idx + 1
    const ci = idx % CATEGORY_EN.length
    const ti = idx % TITLE_EN.length
    const di = idx % DESC_TPL_EN.length
    const category = CATEGORY_EN[ci]
    const categoryUk = CATEGORY_UK[ci]
    const categoryRu = CATEGORY_RU[ci]
    const imageUrl = PRODUCT_IMAGE_POOL[idx % PRODUCT_IMAGE_POOL.length]
    const basePrice = 25 + (idx % 20) * 12
    const discountPercent = idx % 5 === 0 ? 20 : idx % 3 === 0 ? 10 : 0
    const badge =
      discountPercent >= 20 ? "Sale" : discountPercent > 0 ? "Hot" : "New"
    const title = `${TITLE_EN[ti]} (#${number})`
    const titleUk = `${TITLE_UK[ti]} (#${number})`
    const titleRu = `${TITLE_RU[ti]} (#${number})`
    const description = DESC_TPL_EN[di].replace("{cat}", category.toLowerCase())
    const descriptionUk = DESC_TPL_UK[di].replace(
      "{cat}",
      categoryUk.toLowerCase(),
    )
    const descriptionRu = DESC_TPL_RU[di].replace(
      "{cat}",
      categoryRu.toLowerCase(),
    )
    return {
      sku: `SKU-${String(number).padStart(3, "0")}`,
      title,
      titleUk,
      titleRu,
      description,
      descriptionUk,
      descriptionRu,
      category,
      categoryUk,
      categoryRu,
      imageUrl,
      price: basePrice,
      discountPercent,
      badge,
      order: number,
    }
  },
)

async function ensureCatalogSeed(ctx: MutationCtx) {
  const existing = await ctx.db
    .query("sandbox_products")
    .withIndex("by_order")
    .take(1)
  if (existing.length > 0) {
    for (const product of DEFAULT_PRODUCTS) {
      const row = await ctx.db
        .query("sandbox_products")
        .withIndex("by_sku", (q) => q.eq("sku", product.sku))
        .unique()
      if (!row) {
        await ctx.db.insert("sandbox_products", {
          ...product,
          active: true,
        })
        continue
      }
      const patch: {
        title?: string
        titleUk?: string
        titleRu?: string
        description?: string
        descriptionUk?: string
        descriptionRu?: string
        imageUrl?: string
        category?: string
        categoryUk?: string
        categoryRu?: string
      } = {}
      const isLegacyTitle = row.title.startsWith("VibeCoder ")
      const isBrokenLegacyImage =
        row.imageUrl ===
        "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
      const needsTrilingual =
        row.titleUk === undefined ||
        row.titleRu === undefined ||
        row.descriptionUk === undefined ||
        row.descriptionRu === undefined ||
        row.categoryUk === undefined ||
        row.categoryRu === undefined
      if (needsTrilingual || isLegacyTitle) {
        patch.title = product.title
        patch.titleUk = product.titleUk
        patch.titleRu = product.titleRu
        patch.description = product.description
        patch.descriptionUk = product.descriptionUk
        patch.descriptionRu = product.descriptionRu
        patch.category = product.category
        patch.categoryUk = product.categoryUk
        patch.categoryRu = product.categoryRu
      }
      if (!row.description || isLegacyTitle) {
        patch.description = product.description
        patch.descriptionUk = product.descriptionUk
        patch.descriptionRu = product.descriptionRu
      }
      if (!row.imageUrl || isBrokenLegacyImage)
        patch.imageUrl = product.imageUrl
      if (!row.category) patch.category = product.category
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(row._id, patch)
      }
    }
    return
  }
  for (const product of DEFAULT_PRODUCTS) {
    await ctx.db.insert("sandbox_products", {
      ...product,
      active: true,
    })
  }
  await ctx.db.insert("sandbox_promocodes", {
    code: "SAVE10",
    discountPercent: 10,
    active: true,
  })
  await ctx.db.insert("sandbox_promocodes", {
    code: "QA20",
    discountPercent: 20,
    active: true,
  })
}

export const listCatalogProducts = query({
  args: { locale: catalogLocaleValidator },
  handler: async (ctx, args) => {
    const locale = args.locale as CatalogLocale
    const rows = await ctx.db
      .query("sandbox_products")
      .withIndex("by_order")
      .order("asc")
      .take(220)
    return rows.map((row) => {
      const strings = pickCatalogStrings(row, locale)
      return {
        _id: row._id,
        sku: row.sku,
        title: strings.title,
        description: strings.description,
        category: strings.category,
        imageUrl: row.imageUrl,
        price: row.price,
        discountPercent: row.discountPercent,
        badge: row.badge,
        order: row.order,
        active: row.active,
      }
    })
  },
})

export const ensureCatalog = mutation({
  args: { sessionKey: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    await ensureCatalogSeed(ctx)
    return { ok: true }
  },
})

export const addCartItem = mutation({
  args: {
    sessionKey: v.string(),
    sku: v.string(),
    qty: v.number(),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    await ensureCatalogSeed(ctx)
    const qty = Math.max(1, Math.min(args.qty, 20))
    const product = await ctx.db
      .query("sandbox_products")
      .withIndex("by_sku", (q) => q.eq("sku", args.sku))
      .unique()
    if (!product) throw new Error("PRODUCT_NOT_FOUND")
    const existing = await ctx.db
      .query("sandbox_cart_items")
      .withIndex("by_sessionKey_and_sku", (q) =>
        q.eq("sessionKey", args.sessionKey).eq("sku", args.sku),
      )
      .unique()
    if (existing) {
      await ctx.db.patch(existing._id, {
        qty: Math.min(existing.qty + qty, 20),
        updatedAt: Date.now(),
      })
    } else {
      await ctx.db.insert("sandbox_cart_items", {
        sessionKey: args.sessionKey,
        sku: args.sku,
        qty,
        unitPrice: product.price,
        discountPercent: product.discountPercent,
        updatedAt: Date.now(),
      })
    }
    return { ok: true }
  },
})

export const updateCartItemQty = mutation({
  args: {
    sessionKey: v.string(),
    sku: v.string(),
    qty: v.number(),
  },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    const item = await ctx.db
      .query("sandbox_cart_items")
      .withIndex("by_sessionKey_and_sku", (q) =>
        q.eq("sessionKey", args.sessionKey).eq("sku", args.sku),
      )
      .unique()
    if (!item) throw new Error("CART_ITEM_NOT_FOUND")
    const qty = Math.max(0, Math.min(args.qty, 20))
    if (qty === 0) {
      await ctx.db.delete(item._id)
    } else {
      await ctx.db.patch(item._id, { qty, updatedAt: Date.now() })
    }
    return { ok: true }
  },
})

export const removeCartItem = mutation({
  args: { sessionKey: v.string(), sku: v.string() },
  handler: async (ctx, args) => {
    await requireSession(ctx, args.sessionKey)
    const item = await ctx.db
      .query("sandbox_cart_items")
      .withIndex("by_sessionKey_and_sku", (q) =>
        q.eq("sessionKey", args.sessionKey).eq("sku", args.sku),
      )
      .unique()
    if (!item) return { ok: true }
    await ctx.db.delete(item._id)
    return { ok: true }
  },
})

export const getCartState = query({
  args: {
    sessionKey: v.string(),
    promoCode: v.optional(v.string()),
    locale: v.optional(catalogLocaleValidator),
  },
  handler: async (ctx, args) => {
    const locale = (args.locale ?? "en") as CatalogLocale
    const items = await ctx.db
      .query("sandbox_cart_items")
      .withIndex("by_sessionKey_and_updatedAt", (q) =>
        q.eq("sessionKey", args.sessionKey),
      )
      .order("desc")
      .take(100)
    const products = await ctx.db
      .query("sandbox_products")
      .withIndex("by_order")
      .order("asc")
      .take(220)

    const productBySku = new Map(
      products.map((product) => [product.sku, product]),
    )
    const rows = items.map((item) => {
      const product = productBySku.get(item.sku)
      const base = item.unitPrice * item.qty
      const itemDiscount = (base * item.discountPercent) / 100
      const title = product
        ? pickCatalogStrings(product, locale).title
        : item.sku
      return {
        ...item,
        title,
        badge: product?.badge ?? null,
        lineBase: base,
        lineDiscount: itemDiscount,
        lineTotal: base - itemDiscount,
      }
    })

    const subtotal = rows.reduce((sum, row) => sum + row.lineBase, 0)
    const discountFromItems = rows.reduce(
      (sum, row) => sum + row.lineDiscount,
      0,
    )
    const qtyTotal = rows.reduce((sum, row) => sum + row.qty, 0)
    const hasKeyboard = rows.some((row) => row.sku === "SKU-001")
    const hasMouse = rows.some((row) => row.sku === "SKU-002")
    const hasHub = rows.some((row) => row.sku === "SKU-003")
    const hasMonitor = rows.some((row) => row.sku === "SKU-004")
    const subtotalAfterItems = Math.max(0, subtotal - discountFromItems)

    const campaignRules = campaignRulesForLocale(locale)

    let campaignDiscount = 0
    const unlockedPromoCodes: string[] = []
    const appliedCampaignIds: string[] = []

    if (hasKeyboard && hasMouse) {
      const bundleRows = rows.filter(
        (row) => row.sku === "SKU-001" || row.sku === "SKU-002",
      )
      const bundleBase = bundleRows.reduce((sum, row) => sum + row.lineTotal, 0)
      campaignDiscount += bundleBase * 0.1
      appliedCampaignIds.push("bundle-keyboard-mouse")
    }
    if (hasMonitor && hasHub) {
      unlockedPromoCodes.push("WORKSET15")
      appliedCampaignIds.push("workstation-pack")
    }
    if (qtyTotal >= 3) {
      unlockedPromoCodes.push("TEAM5")
      appliedCampaignIds.push("bulk-qa-order")
    }
    if (subtotalAfterItems >= 300) {
      campaignDiscount += 20
      appliedCampaignIds.push("high-value")
    }

    let promoDiscountPercent = 0
    if (args.promoCode?.trim()) {
      const normalizedPromoCode = args.promoCode.trim().toUpperCase()
      const promo = await ctx.db
        .query("sandbox_promocodes")
        .withIndex("by_code", (q) => q.eq("code", normalizedPromoCode))
        .unique()
      if (promo?.active) {
        promoDiscountPercent = promo.discountPercent
      }
    }
    const clampedCampaignDiscount = Math.min(
      campaignDiscount,
      subtotalAfterItems,
    )
    const subtotalAfterCampaigns = Math.max(
      0,
      subtotalAfterItems - clampedCampaignDiscount,
    )
    const promoDiscount = (subtotalAfterCampaigns * promoDiscountPercent) / 100
    const campaignDiagnostics = campaignRules.map((rule) => ({
      ...rule,
      applied: appliedCampaignIds.includes(rule.id),
    }))
    return {
      items: rows,
      totals: {
        subtotal,
        itemDiscount: discountFromItems,
        campaignDiscount: clampedCampaignDiscount,
        promoDiscount,
        total: Math.max(0, subtotalAfterCampaigns - promoDiscount),
      },
      promoApplied: promoDiscountPercent > 0,
      promoDiscountPercent,
      unlockedPromoCodes,
      campaignDiagnostics,
    }
  },
})
