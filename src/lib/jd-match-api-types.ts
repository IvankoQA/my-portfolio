import type { JdResult } from "@/lib/jd-matcher"

/** Successful POST /api/jd-match body (no `error` field). */
export type JdMatchOkBody = {
  source: "local"
  result: JdResult
  aiNarrative: null
  aiStrongNote: null
  aiPartialGapsNote: null
}
