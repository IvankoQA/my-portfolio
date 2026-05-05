import { SB_BUG_ID_SET } from "@/lib/sandbox/vibe-store-data"

export const VIBE_SANDBOX_CHALLENGE_STORAGE_KEY = "vibe_sandbox_challenge_v1"

type PersistedChallengeV1 = {
  v: 1
  expiresAtMs: number
  foundBugIds: string[]
}

export type HydratedChallengeState = {
  foundBugIds: string[]
  timeLeftSec: number
}

export function hydrateVibeSandboxChallenge(): HydratedChallengeState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(VIBE_SANDBOX_CHALLENGE_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistedChallengeV1
    if (data.v !== 1 || !Array.isArray(data.foundBugIds)) return null
    if (
      typeof data.expiresAtMs !== "number" ||
      !Number.isFinite(data.expiresAtMs)
    ) {
      return null
    }
    const now = Date.now()
    const leftMs = Math.max(0, data.expiresAtMs - now)
    const timeLeftSec = Math.ceil(leftMs / 1000)
    const foundBugIds = data.foundBugIds.filter((id): id is string => {
      return typeof id === "string" && SB_BUG_ID_SET.has(id)
    })
    return { foundBugIds, timeLeftSec }
  } catch {
    return null
  }
}

export function persistVibeSandboxChallenge(
  foundBugIds: string[],
  timeLeftSec: number,
): void {
  if (typeof window === "undefined") return
  const safeTimeLeftSec = Math.max(0, Math.floor(timeLeftSec))
  const payload: PersistedChallengeV1 = {
    v: 1,
    expiresAtMs: Date.now() + safeTimeLeftSec * 1000,
    foundBugIds: foundBugIds.filter((id) => SB_BUG_ID_SET.has(id)),
  }
  try {
    localStorage.setItem(
      VIBE_SANDBOX_CHALLENGE_STORAGE_KEY,
      JSON.stringify(payload),
    )
  } catch {
    // quota / private mode
  }
}

export function clearVibeSandboxChallengeStorage(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(VIBE_SANDBOX_CHALLENGE_STORAGE_KEY)
  } catch {
    // ignore
  }
}
