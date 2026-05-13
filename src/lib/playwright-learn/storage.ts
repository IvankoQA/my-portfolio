import { PLAYWRIGHT_LEARN_STORAGE_KEY } from "./constants"
import type { TopicLevel } from "./types"

export type PlaywrightLearnStoredTopic = {
  quizCompletedOnce?: boolean
  lastSubmittedAt?: string
  lastScore?: { correct: number; total: number }
}

export type PlaywrightLearnProgressV1 = {
  v: 1
  topics: Record<string, PlaywrightLearnStoredTopic>
  // Version stays at 1 — this field is additive and optional.
  // Do NOT bump to v:2; that would wipe existing user progress.
  completedTracks?: TopicLevel[]
}

function emptyProgress(): PlaywrightLearnProgressV1 {
  return { v: 1, topics: {} }
}

export function loadPlaywrightLearnProgress(): PlaywrightLearnProgressV1 {
  if (typeof globalThis.window === "undefined") return emptyProgress()
  try {
    const raw = globalThis.localStorage.getItem(PLAYWRIGHT_LEARN_STORAGE_KEY)
    if (!raw) return emptyProgress()
    const trimmed = raw.trim()
    let parsed: unknown
    try {
      parsed = JSON.parse(trimmed) as PlaywrightLearnProgressV1
    } catch {
      const firstBrace = trimmed.indexOf("{")
      if (firstBrace === -1) return emptyProgress()
      let depth = 0
      let end = -1
      for (let i = firstBrace; i < trimmed.length; i++) {
        const ch = trimmed[i]
        if (ch === "{") depth++
        else if (ch === "}") {
          depth--
          if (depth === 0) {
            end = i + 1
            break
          }
        }
      }
      if (end === -1) return emptyProgress()
      parsed = JSON.parse(
        trimmed.slice(firstBrace, end),
      ) as PlaywrightLearnProgressV1
    }
    const p = parsed as PlaywrightLearnProgressV1
    if (p?.v !== 1 || typeof p.topics !== "object" || !p.topics) {
      return emptyProgress()
    }
    return p
  } catch {
    return emptyProgress()
  }
}

export function savePlaywrightLearnProgress(data: PlaywrightLearnProgressV1) {
  if (typeof globalThis.window === "undefined") return
  try {
    globalThis.localStorage.setItem(
      PLAYWRIGHT_LEARN_STORAGE_KEY,
      JSON.stringify(data),
    )
  } catch {
    // ignore quota / private mode failures
  }
}

export function recordTopicQuizSubmission(
  slug: string,
  score: { correct: number; total: number },
) {
  const prev = loadPlaywrightLearnProgress()
  const next: PlaywrightLearnProgressV1 = {
    v: 1,
    topics: {
      ...prev.topics,
      [slug]: {
        ...prev.topics[slug],
        quizCompletedOnce: true,
        lastSubmittedAt: new Date().toISOString(),
        lastScore: score,
      },
    },
  }
  savePlaywrightLearnProgress(next)
}
