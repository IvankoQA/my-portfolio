import { CV } from "@/lib/cv-data"

export type WeightMode = "strict" | "balanced" | "lenient"
export type Band = "poor" | "partial" | "solid" | "strong"

export type MatchedSkill = {
  id: string
  label: string
  hits: number
  weight: number
  level?: string
  category?: string
}

export type PartialSkill = {
  id: string
  label: string
  hits: number
  note: { en: string; ua: string }
}

export type GapSkill = {
  label: string
  hits: number
}

/** i18n key in [src/lib/i18n/strings.ts](src/lib/i18n/strings.ts) */
export type ScoreAdjustment = {
  id: string
  labelKey: string
  delta: number
}

export type JdResult = {
  empty: boolean
  error: string | null
  /** Keyword-only fit (0–100), before portfolio boosts */
  rawScore: number
  /** Human-readable line items: weak-match cushion, fixed portfolio bonuses, etc. */
  adjustments: ScoreAdjustment[]
  score: number
  band: Band
  strong: MatchedSkill[]
  partial: PartialSkill[]
  gaps: GapSkill[]
  totalSignals: number
  earned: number
}

const WEAK_MATCH_CUSHION_K = 0.2
const WEAK_MATCH_CUSHION_CAP = 12
const PORTFOLIO_HUMOR_BONUS = 10

const ADJUST_LABEL = {
  weakCushion: "fit.adjust.weakCushion",
  humor: "fit.adjust.humor",
} as const

function normalizeText(t: string): string {
  return (t || "")
    .toLowerCase()
    .replaceAll(/[‘’]/g, "'")
    .replaceAll(/[“”]/g, '"')
}

function countMatches(text: string, aliases: string[]): number {
  const norm = normalizeText(text)
  let count = 0
  for (const a of aliases) {
    const needle = normalizeText(a)
    const escapedNeedle = needle.replaceAll(
      /[.*+?^${}()|[\]\\]/g,
      String.raw`\$&`,
    )
    const re = new RegExp(`(^|[^a-z0-9])${escapedNeedle}([^a-z0-9]|$)`, "g")
    const m = norm.match(re)
    if (m) count += m.length
  }
  return count
}

const COMMON_JD_ASKS = [
  { label: "Selenium", aliases: ["selenium"] },
  { label: "Java", aliases: [" java "] },
  { label: "Kotlin", aliases: ["kotlin"] },
  { label: "Python", aliases: ["python"] },
  { label: "Appium", aliases: ["appium"] },
  { label: "Kubernetes", aliases: ["kubernetes", "k8s"] },
  { label: "AWS", aliases: ["aws"] },
  { label: "Azure", aliases: [" azure "] },
  { label: "Selenium Grid", aliases: ["selenium grid"] },
  {
    label: "Mobile-native testing",
    aliases: ["native mobile", "ios automation", "android automation"],
  },
  { label: "Ruby / RSpec", aliases: ["rspec", " ruby "] },
  {
    label: "Performance engineering (full)",
    aliases: ["jmeter", "gatling", "locust"],
  },
  {
    label: "Manager / Lead title",
    aliases: ["lead engineer", "engineering manager", "head of qa"],
  },
]

function bandFromScore(pct: number): Band {
  if (pct >= 80) return "strong"
  if (pct >= 65) return "solid"
  if (pct >= 45) return "partial"
  return "poor"
}

function buildAdjustments(rawScore: number): ScoreAdjustment[] {
  const out: ScoreAdjustment[] = []
  if (rawScore < 50) {
    const delta = Math.min(
      WEAK_MATCH_CUSHION_CAP,
      Math.round((50 - rawScore) * WEAK_MATCH_CUSHION_K),
    )
    if (delta > 0) {
      out.push({
        id: "weakCushion",
        labelKey: ADJUST_LABEL.weakCushion,
        delta,
      })
    }
  }
  out.push({
    id: "humor",
    labelKey: ADJUST_LABEL.humor,
    delta: PORTFOLIO_HUMOR_BONUS,
  })
  return out
}

function finalScoreFromRaw(
  raw: number,
  adjustments: ScoreAdjustment[],
): number {
  const extra = adjustments.reduce((s, a) => s + a.delta, 0)
  return Math.max(0, Math.min(100, raw + extra))
}

export function analyzeJD(
  jdText: string,
  weightMode: WeightMode = "balanced",
): JdResult {
  if (!jdText?.trim()) {
    return {
      empty: true,
      error: null,
      rawScore: 0,
      adjustments: [],
      score: 0,
      band: "poor",
      strong: [],
      partial: [],
      gaps: [],
      totalSignals: 0,
      earned: 0,
    }
  }
  const text = jdText.slice(0, 30000)
  const strong: MatchedSkill[] = []
  const partial: PartialSkill[] = []
  const gaps: GapSkill[] = []
  let totalJDSignals = 0
  let earned = 0

  for (const s of CV.skills) {
    const hits = countMatches(text, s.aliases)
    if (hits > 0) {
      totalJDSignals += s.weight
      earned += s.weight
      strong.push({
        id: s.id,
        label: s.label,
        hits,
        weight: s.weight,
        level: s.level,
        category: s.category,
      })
    }
  }

  for (const a of CV.adjacent) {
    const hits = countMatches(text, a.aliases)
    if (hits > 0) {
      const adjW = 2
      totalJDSignals += adjW
      let partialCredit = 0.85
      if (weightMode === "lenient") partialCredit = 1.4
      if (weightMode === "strict") partialCredit = 0.4
      earned += partialCredit
      partial.push({ id: a.id, label: a.label, hits, note: a.note })
    }
  }

  for (const ask of COMMON_JD_ASKS) {
    const hits = countMatches(text, ask.aliases)
    if (hits === 0) continue
    const inStrong = strong.some(
      (s) => s.label.toLowerCase() === ask.label.toLowerCase(),
    )
    const inPartial = partial.some(
      (p) => p.label.toLowerCase() === ask.label.toLowerCase(),
    )
    if (inStrong || inPartial) continue
    totalJDSignals += 2
    gaps.push({ label: ask.label, hits })
  }

  if (totalJDSignals === 0) {
    return {
      empty: false,
      error: "noSignals",
      rawScore: 0,
      adjustments: [],
      score: 0,
      band: "poor",
      strong: [],
      partial: [],
      gaps: [],
      totalSignals: 0,
      earned: 0,
    }
  }

  let rawScore = Math.round((earned / totalJDSignals) * 100)
  if (weightMode === "strict") rawScore = Math.max(0, rawScore - 8)
  if (weightMode === "lenient") rawScore = Math.min(100, rawScore + 8)
  if (strong.length >= 4) rawScore = Math.max(rawScore, 55)
  rawScore = Math.max(0, Math.min(100, rawScore))

  const adjustments = buildAdjustments(rawScore)
  const score = finalScoreFromRaw(rawScore, adjustments)
  const band = bandFromScore(score)

  strong.sort((a, b) => b.weight * 10 + b.hits - (a.weight * 10 + a.hits))
  partial.sort((a, b) => b.hits - a.hits)

  return {
    empty: false,
    error: null,
    rawScore,
    adjustments,
    score,
    band,
    strong,
    partial,
    gaps,
    totalSignals: totalJDSignals,
    earned: Math.round(earned * 10) / 10,
  }
}
