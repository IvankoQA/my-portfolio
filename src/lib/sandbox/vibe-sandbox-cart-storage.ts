import { SB_PRODUCTS, type VibeProduct } from "@/lib/sandbox/vibe-store-data"

/** One cart for EN + UK sandbox routes (same origin, same key). */
export const VIBE_SANDBOX_CHECKOUT_STORAGE_KEY = "vibe_sandbox_checkout_v1"

export type VibeSandboxCartLine = VibeProduct & { q: number }

type PersistedV1 = {
  v: 1
  lines: { id: string; q: number }[]
  promo: { code: string; applied: number; percent: number } | null
  promoInput: string
}

function normalizePromo(p: PersistedV1["promo"]): PersistedV1["promo"] {
  if (!p || p.code !== "VIBES10") return null
  return { code: "VIBES10", applied: p.applied, percent: 10 }
}

export function hydrateVibeSandboxCheckout(): {
  cart: VibeSandboxCartLine[]
  promo: PersistedV1["promo"]
  promoInput: string
} | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(VIBE_SANDBOX_CHECKOUT_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as PersistedV1
    if (data.v !== 1 || !Array.isArray(data.lines)) return null
    const cart: VibeSandboxCartLine[] = []
    for (const row of data.lines) {
      if (!row || typeof row.id !== "string") continue
      const p = SB_PRODUCTS.find((x) => x.id === row.id)
      if (!p || p.stock <= 0) continue
      const q = Math.min(Math.max(0, Math.floor(Number(row.q))), p.stock)
      if (q <= 0) continue
      cart.push({ ...p, q })
    }
    return {
      cart,
      promo: normalizePromo(data.promo),
      promoInput: typeof data.promoInput === "string" ? data.promoInput : "",
    }
  } catch {
    return null
  }
}

export function persistVibeSandboxCheckout(
  cart: VibeSandboxCartLine[],
  promo: PersistedV1["promo"],
  promoInput: string,
): void {
  if (typeof window === "undefined") return
  const lines = cart.map((x) => ({ id: x.id, q: x.q }))
  const payload: PersistedV1 = {
    v: 1,
    lines,
    promo: normalizePromo(promo),
    promoInput,
  }
  try {
    localStorage.setItem(
      VIBE_SANDBOX_CHECKOUT_STORAGE_KEY,
      JSON.stringify(payload),
    )
  } catch {
    // quota / private mode
  }
}

export function clearVibeSandboxCheckoutStorage(): void {
  if (typeof window === "undefined") return
  try {
    localStorage.removeItem(VIBE_SANDBOX_CHECKOUT_STORAGE_KEY)
  } catch {
    // ignore
  }
}
