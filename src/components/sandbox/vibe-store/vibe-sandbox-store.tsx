"use client"

import { useMutation, useQuery } from "convex/react"
import Image from "next/image"
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"
import { api } from "../../../../convex/_generated/api"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { useSandboxSession } from "@/hooks/use-sandbox-session"
import type { AppLocale } from "@/lib/i18n/locale"
import {
  vibeChallengeModalRules,
  vibeSandboxT,
} from "@/lib/i18n/vibe-sandbox-strings"
import {
  clearVibeSandboxCheckoutStorage,
  hydrateVibeSandboxCheckout,
  persistVibeSandboxCheckout,
  type VibeSandboxCartLine,
} from "@/lib/sandbox/vibe-sandbox-cart-storage"
import {
  clearVibeSandboxChallengeStorage,
  hydrateVibeSandboxChallenge,
  persistVibeSandboxChallenge,
} from "@/lib/sandbox/vibe-sandbox-challenge-storage"
import { vibeProductImageUrl } from "@/lib/sandbox/vibe-product-images"
import {
  SB_BUGS,
  SB_BUG_ID_SET,
  SB_CHALLENGE_AREAS,
  SB_CATEGORIES,
  SB_PRODUCTS,
  vibePickText,
  type VibeProduct,
  type VibeTextLang,
} from "@/lib/sandbox/vibe-store-data"
import { VibeAutoTestReport } from "./vibe-sandbox-auto-test"
import { VibeButton, VibeChip, VibeIcon } from "./vibe-sandbox-ui-bits"

const CHALLENGE_SEC = 900
const VIBE_SANDBOX_VIEW_STORAGE_KEY = "vibe_sandbox_view_v1"

/** Stable path from `el` up to `root` (dedupe manual bug marks). */
function sandboxPathFromRoot(el: Element, root: Element): string {
  const segs: string[] = []
  let cur: Element | null = el
  while (cur && cur !== root) {
    const tag = cur.tagName.toLowerCase()
    const parent: Element | null = cur.parentElement
    if (!parent) break
    const idx = Array.prototype.indexOf.call(parent.children, cur)
    const id = cur.id ? `#${cur.id}` : ""
    segs.push(`${tag}${id}[${idx}]`)
    cur = parent
  }
  if (cur !== root) return `detached:${el.tagName.toLowerCase()}`
  return segs.reverse().join("/")
}

function describePickTarget(target: Element, root: Element): string {
  const host =
    target.closest(
      "[data-testid],button,input,select,textarea,label,a,[role],[title]",
    ) ?? target
  const path = sandboxPathFromRoot(host, root)
  const testId = host.getAttribute("data-testid")
  if (testId) return `data-testid=${testId} @ ${path}`
  const ariaLabel = host.getAttribute("aria-label")
  if (ariaLabel) return `${ariaLabel} @ ${path}`
  const title = host.getAttribute("title")
  if (title) return `${title} @ ${path}`
  const text = host.textContent?.trim().replace(/\s+/g, " ")
  if (text) return `${text.slice(0, 64)} @ ${path}`
  return path
}

function pickHighlightHost(target: Element): Element {
  return (
    target.closest(
      "[data-testid],button,input,select,textarea,label,a,[role],[title]",
    ) ?? target
  )
}

function MarkBugControls({
  t,
  pickBugMode,
  onToggle,
  count,
  compact,
}: {
  t: (key: string) => string
  pickBugMode: boolean
  onToggle: () => void
  count: number
  compact?: boolean
}) {
  return (
    <div
      data-bug-pick-ignore
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? 4 : 8,
      }}
    >
      <button
        type="button"
        data-testid="mark-bug-toggle"
        aria-pressed={pickBugMode}
        title={pickBugMode ? t("sb.pickBug.cancel") : t("sb.pickBug.mark")}
        onClick={onToggle}
        style={{
          height: compact ? 28 : 30,
          padding: compact ? "0 7px" : "0 10px",
          border: pickBugMode
            ? "1px solid var(--accent-color)"
            : "1px solid var(--line)",
          borderRadius: 7,
          background: pickBugMode ? "var(--accent-soft)" : "transparent",
          color: pickBugMode ? "var(--accent-color)" : "var(--ink-2)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: compact ? 10.5 : 11.5,
          fontWeight: 600,
          fontFamily: "var(--font-mono)",
          whiteSpace: "nowrap",
        }}
      >
        <VibeIcon name="bug" size={compact ? 12 : 13} stroke={2.2} />
        {!compact
          ? pickBugMode
            ? t("sb.pickBug.cancel")
            : t("sb.pickBug.mark")
          : null}
      </button>
      <span
        className="mono"
        title={t("sb.pickBug.countTitle")}
        style={{
          fontSize: compact ? 10 : 11,
          fontWeight: 700,
          color: "var(--ink-2)",
          minWidth: compact ? 18 : 22,
          textAlign: "center",
        }}
      >
        {count}
      </span>
    </div>
  )
}

type CartLine = VibeSandboxCartLine

type Props = {
  appLocale: AppLocale
}

export function VibeSandboxShell({ appLocale }: Props) {
  const sessionKey = useSandboxSession()
  const initSession = useMutation(api.sandbox.initSession)
  const uiLang = appLocale
  const dataLang: VibeTextLang = appLocale === "uk" ? "ua" : "en"
  const t = useCallback((key: string) => vibeSandboxT(uiLang, key), [uiLang])

  useEffect(() => {
    if (!sessionKey) return
    void initSession({ sessionKey })
  }, [sessionKey, initSession])

  const [view, setView] = useState<"store" | "auto">(() => {
    if (typeof window === "undefined") return "store"
    return window.sessionStorage.getItem(VIBE_SANDBOX_VIEW_STORAGE_KEY) ===
      "auto"
      ? "auto"
      : "store"
  })
  const [showStartChallenge, setShowStartChallenge] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [challenge, setChallenge] = useState(false)
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const [foundBugIds, setFoundBugIds] = useState<string[]>([])
  const [, setMissedPickPaths] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(CHALLENGE_SEC)
  const [finishedEarly, setFinishedEarly] = useState(false)
  const [showLeavePrompt, setShowLeavePrompt] = useState(false)
  const [pendingLeaveHref, setPendingLeaveHref] = useState<string | null>(null)
  const [pendingHistoryBack, setPendingHistoryBack] = useState(false)
  const navBypassRef = useRef(false)
  const popstateGuardRef = useRef(false)
  const challengeHydratedRef = useRef(false)

  useEffect(() => {
    if (challengeHydratedRef.current) return
    challengeHydratedRef.current = true
    const restored = hydrateVibeSandboxChallenge()
    if (!restored) return
    if (restored.timeLeftSec <= 0) {
      clearVibeSandboxChallengeStorage()
      return
    }
    if (
      window.sessionStorage.getItem(VIBE_SANDBOX_VIEW_STORAGE_KEY) !== "auto"
    ) {
      setView("store")
    }
    setShowStartChallenge(false)
    setShowResults(false)
    setFinishedEarly(false)
    setChallengeCompleted(false)
    setFoundBugIds(restored.foundBugIds)
    setMissedPickPaths([])
    setTimeLeft(Math.min(CHALLENGE_SEC, restored.timeLeftSec))
    setChallenge(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      window.sessionStorage.setItem(VIBE_SANDBOX_VIEW_STORAGE_KEY, view)
    } catch {
      // ignore browser privacy/storage errors
    }
  }, [view])

  useEffect(() => {
    if (!challenge) return
    if (timeLeft <= 0) {
      setFinishedEarly(false)
      setShowResults(true)
      return
    }
    const id = setTimeout(() => setTimeLeft((x) => x - 1), 1000)
    return () => clearTimeout(id)
  }, [challenge, timeLeft])

  const markBug = useCallback((id: string) => {
    if (SB_BUGS.length === 0) return
    setFoundBugIds((arr) =>
      arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    )
  }, [])

  const markMissedPickPath = useCallback((path: string) => {
    setMissedPickPaths((prev) => (prev.includes(path) ? prev : [...prev, path]))
  }, [])

  function startChallenge() {
    setShowStartChallenge(false)
    setFoundBugIds([])
    setMissedPickPaths([])
    setTimeLeft(CHALLENGE_SEC)
    setFinishedEarly(false)
    setChallengeCompleted(false)
    setChallenge(true)
  }

  function finishChallenge() {
    setFinishedEarly(true)
    setChallengeCompleted(true)
    setShowResults(true)
  }

  function runAutoTests() {
    setChallengeCompleted(true)
    setShowResults(false)
    setView("auto")
  }

  function backFromAuto() {
    setView("store")
    setChallenge(false)
    setChallengeCompleted(true)
    setShowResults(false)
    setFoundBugIds([])
    setMissedPickPaths([])
    setTimeLeft(CHALLENGE_SEC)
  }

  function skipResults() {
    setShowResults(false)
    setChallenge(false)
    setChallengeCompleted(true)
    setMissedPickPaths([])
    setTimeLeft(CHALLENGE_SEC)
  }

  const challengeNavGuardActive =
    challenge && !showResults && !challengeCompleted && view === "store"

  useEffect(() => {
    const shouldPersistRun =
      challenge &&
      !challengeCompleted &&
      !showResults &&
      view === "store" &&
      timeLeft > 0
    if (!shouldPersistRun) {
      clearVibeSandboxChallengeStorage()
      return
    }
    persistVibeSandboxChallenge(foundBugIds, timeLeft)
  }, [challenge, challengeCompleted, foundBugIds, showResults, timeLeft, view])

  function resetPendingLeave() {
    setPendingLeaveHref(null)
    setPendingHistoryBack(false)
  }

  const openLeavePromptForHref = useCallback((href: string) => {
    setPendingLeaveHref(href)
    setPendingHistoryBack(false)
    setShowLeavePrompt(true)
  }, [])

  const openLeavePromptForBack = useCallback(() => {
    setPendingLeaveHref(null)
    setPendingHistoryBack(true)
    setShowLeavePrompt(true)
  }, [])

  function confirmLeavePage() {
    navBypassRef.current = true
    setChallenge(false)
    setChallengeCompleted(true)
    setShowResults(false)
    setShowStartChallenge(false)
    setFinishedEarly(false)
    setTimeLeft(CHALLENGE_SEC)
    setFoundBugIds([])
    setMissedPickPaths([])
    setShowLeavePrompt(false)

    if (pendingHistoryBack) {
      resetPendingLeave()
      window.history.back()
      return
    }
    const href = pendingLeaveHref
    resetPendingLeave()
    if (href) window.location.assign(href)
  }

  function cancelLeavePage() {
    setShowLeavePrompt(false)
    resetPendingLeave()
  }

  useEffect(() => {
    if (!challengeNavGuardActive) return

    const onDocumentClick = (event: MouseEvent) => {
      if (navBypassRef.current) return
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null
      if (!anchor) return
      if (anchor.target && anchor.target !== "_self") return
      if (anchor.hasAttribute("download")) return
      const rawHref = anchor.getAttribute("href")
      if (!rawHref) return
      if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) return

      const next = new URL(rawHref, window.location.href)
      if (next.origin !== window.location.origin) return
      const isSameDocument =
        next.pathname === window.location.pathname &&
        next.search === window.location.search
      if (isSameDocument) return

      event.preventDefault()
      openLeavePromptForHref(next.toString())
    }

    document.addEventListener("click", onDocumentClick, true)
    return () => document.removeEventListener("click", onDocumentClick, true)
  }, [challengeNavGuardActive, openLeavePromptForHref])

  useEffect(() => {
    if (!challengeNavGuardActive) {
      popstateGuardRef.current = false
      return
    }
    if (!popstateGuardRef.current) {
      window.history.pushState({ vibeGuard: true }, "", window.location.href)
      popstateGuardRef.current = true
    }

    const onPopState = () => {
      if (navBypassRef.current) return
      window.history.pushState({ vibeGuard: true }, "", window.location.href)
      openLeavePromptForBack()
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [challengeNavGuardActive, openLeavePromptForBack])

  const isMobileShell = useIsMobile()

  if (view === "auto") {
    return (
      <VibeAutoTestReport
        lang={uiLang}
        foundBugIds={foundBugIds}
        onBack={backFromAuto}
      />
    )
  }

  if (!sessionKey) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "#64748b",
        }}
      >
        …
      </div>
    )
  }

  return (
    <>
      <VibeSandboxStore
        appLocale={uiLang}
        dataLang={dataLang}
        t={t}
        sessionKey={sessionKey}
        challenge={challenge}
        onStartChallenge={() => setShowStartChallenge(true)}
        onMarkBug={markBug}
        onMarkMissPath={markMissedPickPath}
        foundBugIds={foundBugIds}
        onFinishChallenge={finishChallenge}
        timeLeft={timeLeft}
        totalBugs={SB_BUGS.length}
        onRunAutoTests={runAutoTests}
      />
      {showStartChallenge && (
        <ChallengeStartModal
          uiLang={uiLang}
          t={t}
          totalBugs={SB_BUGS.length}
          onStart={startChallenge}
          onCancel={() => setShowStartChallenge(false)}
          isMobile={isMobileShell}
        />
      )}
      {showResults && (
        <ChallengeResults
          t={t}
          foundCount={foundBugIds.length}
          totalBugs={SB_BUGS.length}
          timeLeft={timeLeft}
          onRunAuto={runAutoTests}
          onSkip={skipResults}
          finishedEarly={finishedEarly}
          isMobile={isMobileShell}
        />
      )}
      {showLeavePrompt && (
        <ChallengeLeaveConfirm
          t={t}
          onCancel={cancelLeavePage}
          onConfirm={confirmLeavePage}
          isMobile={isMobileShell}
        />
      )}
    </>
  )
}

function paginateBtn(disabled: boolean): CSSProperties {
  return {
    width: 32,
    height: 32,
    border: "1px solid var(--line)",
    background: "var(--bg-elev)",
    color: "var(--ink-2)",
    borderRadius: 6,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    fontSize: 13,
    fontFamily: "var(--font-mono)",
  }
}

type StoreFiltersCardProps = {
  t: (key: string) => string
  cat: string
  setCat: Dispatch<SetStateAction<string>>
  setPage: Dispatch<SetStateAction<number>>
  minRating: number
  setMinRating: Dispatch<SetStateAction<number>>
  maxPrice: number
  setMaxPrice: Dispatch<SetStateAction<number>>
  stockOnly: boolean
  setStockOnly: Dispatch<SetStateAction<boolean>>
  clearFilters: () => void
}

function StoreFiltersCard({
  t,
  cat,
  setCat,
  setPage,
  minRating,
  setMinRating,
  maxPrice,
  setMaxPrice,
  stockOnly,
  setStockOnly,
  clearFilters,
}: StoreFiltersCardProps) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        borderRadius: 12,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--ink-3)",
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 12,
        }}
      >
        {t("sb.filters")}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[{ id: "all" as const }, ...SB_CATEGORIES].map((c) => (
          <button
            key={c.id}
            type="button"
            data-testid={`filter-category-${c.id}`}
            data-vibe-bug-id={
              c.id === "book" || c.id === "snack" ? "vs-08" : undefined
            }
            onClick={() => {
              // vs-08: books & snacks category clicks ignored
              if (c.id === "book" || c.id === "snack") return
              setPage(1)
              setCat(c.id)
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 10px",
              border: "none",
              background: cat === c.id ? "var(--bg-sunken)" : "transparent",
              color: cat === c.id ? "var(--ink)" : "var(--ink-2)",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12.5,
              fontFamily: "var(--font-sans)",
              fontWeight: cat === c.id ? 600 : 400,
              textAlign: "left",
            }}
          >
            <span>{t(`sb.cat.${c.id}`)}</span>
            <span
              className="mono"
              style={{ fontSize: 10.5, color: "var(--ink-3)" }}
            >
              {c.id === "all"
                ? SB_PRODUCTS.length
                : SB_PRODUCTS.filter((p) => p.cat === c.id).length}
            </span>
          </button>
        ))}
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--line)",
          margin: "14px 0",
        }}
      />

      <div style={{ marginBottom: 12 }} data-vibe-bug-id="vs-10">
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            marginBottom: 6,
          }}
        >
          {t("sb.price")}:{" "}
          <span style={{ color: "var(--ink)" }}>${maxPrice}</span>
        </div>
        <input
          className="vibe-store-focus"
          type="range"
          data-testid="filter-price-max"
          min={5}
          max={500}
          step={5}
          value={maxPrice}
          onChange={(e) => {
            setPage(1)
            setMaxPrice(+e.target.value)
          }}
          style={{ width: "100%", accentColor: "var(--accent-color)" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            marginBottom: 6,
          }}
        >
          {t("sb.rating")}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              data-testid={
                r === 4.5 ? "filter-rating-4-5" : `filter-rating-${r}`
              }
              onClick={() => {
                setPage(1)
                setMinRating(r)
              }}
              style={{
                flex: 1,
                padding: "5px 0",
                border: "1px solid var(--line)",
                background: minRating === r ? "var(--ink)" : "var(--bg-card)",
                color: minRating === r ? "var(--bg)" : "var(--ink-2)",
                borderRadius: 5,
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              {r === 0 ? "all" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 12.5,
          color: "var(--ink-2)",
          cursor: "pointer",
          padding: "4px 0",
        }}
      >
        <input
          type="checkbox"
          data-testid="filter-in-stock-only"
          data-vibe-bug-id="vs-19"
          checked={stockOnly}
          onChange={(e) => {
            setPage(1)
            setStockOnly(e.target.checked)
          }}
        />
        {t("sb.stock")}
      </label>

      <button
        type="button"
        data-testid="filter-clear"
        onClick={clearFilters}
        style={{
          marginTop: 14,
          width: "100%",
          height: 30,
          border: "1px solid var(--line)",
          background: "var(--bg-card)",
          color: "var(--ink-2)",
          fontSize: 11.5,
          borderRadius: 6,
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
        }}
      >
        {t("sb.empty.cta")}
      </button>
    </div>
  )
}

type StoreProps = {
  appLocale: AppLocale
  dataLang: VibeTextLang
  t: (key: string) => string
  sessionKey: string
  challenge: boolean
  onStartChallenge: () => void
  onMarkBug: (id: string) => void
  onMarkMissPath: (path: string) => void
  foundBugIds: string[]
  onFinishChallenge: () => void
  timeLeft: number
  totalBugs: number
  onRunAutoTests: () => void
}

function VibeSandboxStore({
  appLocale,
  dataLang,
  t,
  sessionKey,
  challenge,
  onStartChallenge,
  onMarkBug,
  onMarkMissPath,
  foundBugIds,
  onFinishChallenge,
  timeLeft,
  totalBugs,
  onRunAutoTests,
}: StoreProps) {
  const [viewGrid, setViewGrid] = useState<"grid" | "list">("grid")
  const [query, setQuery] = useState("")
  const [cat, setCat] = useState("all")
  const [sort, setSort] = useState("featured")
  const [minRating, setMinRating] = useState(0)
  const [maxPrice, setMaxPrice] = useState(500)
  const [stockOnly, setStockOnly] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 12

  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutJokeOpen, setCheckoutJokeOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [pickBugMode, setPickBugMode] = useState(false)
  const [manualBugPaths, setManualBugPaths] = useState<string[]>([])
  const vibeSandboxRootRef = useRef<HTMLDivElement>(null)
  const hoveredPickHostRef = useRef<Element | null>(null)

  const isMobile = useIsMobile()
  const [isCompactDesktopToolbar, setIsCompactDesktopToolbar] = useState(false)

  const openChatPanel = useCallback(() => {
    setCartOpen(false)
    setAccountOpen(false)
    setChatOpen(true)
  }, [])

  const openAccountPanel = useCallback(() => {
    setCartOpen(false)
    setChatOpen(false)
    setAccountOpen(true)
  }, [])

  const openCartPanel = useCallback(() => {
    setChatOpen(false)
    setAccountOpen(false)
    setCartOpen(true)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const onResize = () => setIsCompactDesktopToolbar(window.innerWidth < 1220)
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const registerPickedBug = useCallback(
    (target: Element): boolean => {
      const root = vibeSandboxRootRef.current
      if (!root?.contains(target)) return false
      const bugHost = target.closest("[data-vibe-bug-id]")
      const id = bugHost?.getAttribute("data-vibe-bug-id") ?? null
      if (challenge) {
        if (id && SB_BUG_ID_SET.has(id)) {
          onMarkBug(id)
        } else {
          onMarkMissPath(describePickTarget(target, root))
        }
        return true
      }
      const path = sandboxPathFromRoot(target, root)
      setManualBugPaths((prev) =>
        prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path],
      )
      return true
    },
    [challenge, onMarkBug, onMarkMissPath],
  )

  const pickSnackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pickBugSnackOpen, setPickBugSnackOpen] = useState(false)

  const flashPickBugSnack = useCallback(() => {
    if (pickSnackTimerRef.current) clearTimeout(pickSnackTimerRef.current)
    setPickBugSnackOpen(true)
    pickSnackTimerRef.current = setTimeout(() => {
      setPickBugSnackOpen(false)
      pickSnackTimerRef.current = null
    }, 2800)
  }, [])

  useEffect(() => {
    return () => {
      if (pickSnackTimerRef.current) {
        clearTimeout(pickSnackTimerRef.current)
        pickSnackTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!pickBugMode) return
    const root = vibeSandboxRootRef.current
    if (!root) return
    const clearHoveredPick = () => {
      if (hoveredPickHostRef.current) {
        hoveredPickHostRef.current.removeAttribute("data-vibe-pick-hovered")
        hoveredPickHostRef.current = null
      }
    }

    const inPickTarget = (target: EventTarget | null): target is Element => {
      if (!(target instanceof Element)) return false
      if (!root.contains(target)) return false
      if (target.closest("[data-bug-pick-ignore]")) return false
      return true
    }

    const swallow = (e: Event) => {
      if (!inPickTarget(e.target)) return
      e.preventDefault()
      e.stopPropagation()
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      if (!inPickTarget(e.target)) return
      e.preventDefault()
      e.stopPropagation()
      if (registerPickedBug(e.target as Element)) {
        flashPickBugSnack()
        clearHoveredPick()
        setPickBugMode(false)
      }
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!inPickTarget(e.target)) {
        clearHoveredPick()
        return
      }
      const nextHovered = pickHighlightHost(e.target as Element)
      if (nextHovered === hoveredPickHostRef.current) return
      clearHoveredPick()
      if (nextHovered) {
        nextHovered.setAttribute("data-vibe-pick-hovered", "true")
        hoveredPickHostRef.current = nextHovered
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      swallow(e)
    }
    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return
      swallow(e)
    }
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return
      swallow(e)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPickBugMode(false)
    }

    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("pointermove", onPointerMove, true)
    document.addEventListener("mousedown", onMouseDown, true)
    document.addEventListener("mouseup", onMouseUp, true)
    document.addEventListener("click", onClick, true)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      clearHoveredPick()
      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("pointermove", onPointerMove, true)
      document.removeEventListener("mousedown", onMouseDown, true)
      document.removeEventListener("mouseup", onMouseUp, true)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [pickBugMode, registerPickedBug, flashPickBugSnack])

  const auth = useQuery(api.sandbox.getSessionAuthState, { sessionKey })
  const isAuthed = auth !== undefined && auth !== null
  const [promo, setPromo] = useState<{
    code: string
    applied: number
    percent: number
  } | null>(null)
  const [promoInput, setPromoInput] = useState("")
  const [checkoutHydrated, setCheckoutHydrated] = useState(false)
  const checkoutHydratedRef = useRef(false)
  const cartRef = useRef(cart)
  const promoRef = useRef(promo)
  const promoInputRef = useRef(promoInput)
  cartRef.current = cart
  promoRef.current = promo
  promoInputRef.current = promoInput

  function syncPersist(
    nextCart: CartLine[],
    nextPromo?: typeof promo | null,
    nextPromoInput?: string,
  ) {
    if (!checkoutHydratedRef.current) return
    persistVibeSandboxCheckout(
      nextCart,
      nextPromo !== undefined ? nextPromo : promoRef.current,
      nextPromoInput !== undefined ? nextPromoInput : promoInputRef.current,
    )
  }

  useEffect(() => {
    const h = hydrateVibeSandboxCheckout()
    if (h) {
      setCart(h.cart)
      setPromo(h.promo)
      setPromoInput(h.promoInput)
      cartRef.current = h.cart
      promoRef.current = h.promo
      promoInputRef.current = h.promoInput
    }
    checkoutHydratedRef.current = true
    setCheckoutHydrated(true)
  }, [])

  useEffect(() => {
    if (!checkoutHydrated) return
    persistVibeSandboxCheckout(cart, promo, promoInput)
  }, [checkoutHydrated, cart, promo, promoInput])

  function addToCart(p: VibeProduct) {
    if (p.stock <= 0) return
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id)
      let next: CartLine[]
      if (ex) {
        const nextQ = Math.min(ex.q + 1, p.stock)
        if (nextQ === ex.q) return c
        next = c.map((x) => (x.id === p.id ? { ...x, q: nextQ } : x))
      } else {
        next = [...c, { ...p, q: 1 }]
      }
      cartRef.current = next
      syncPersist(next)
      return next
    })
  }

  function removeFromCart(id: string) {
    setCart((c) => {
      // vs-14: with multiple lines, remove deletes another row
      let next: CartLine[]
      if (c.length > 1) {
        const i = c.findIndex((x) => x.id === id)
        if (i === -1) return c
        const victim = c[(i + 1) % c.length]
        if (!victim) return c
        next = c.filter((x) => x.id !== victim.id)
      } else {
        next = c.filter((x) => x.id !== id)
      }
      cartRef.current = next
      syncPersist(next)
      return next
    })
  }

  function updateQty(id: string, delta: number) {
    setCart((c) => {
      const next = c
        .map((x) => {
          if (x.id !== id) return x
          const cap = x.stock
          const nextQ = Math.max(0, Math.min(x.q + delta, cap))
          return { ...x, q: nextQ }
        })
        .filter((x) => x.q > 0)
      cartRef.current = next
      syncPersist(next)
      return next
    })
  }

  function applyPromo() {
    const raw = promoInput.trim()
    const code = raw.toUpperCase()
    if (code === "VIBES10") {
      if (promo?.code === "VIBES10") return
      // vs-12: label still says 10% in copy but discount is 50%
      const nextPromo = { code: "VIBES10", applied: 1, percent: 50 }
      setPromo(nextPromo)
      promoRef.current = nextPromo
      syncPersist(cartRef.current, nextPromo, promoInput)
      return
    }
    if (raw.length > 0) {
      // vs-13: any non-empty code applies 69%
      const nextPromo = { code: raw.toUpperCase(), applied: 1, percent: 69 }
      setPromo(nextPromo)
      promoRef.current = nextPromo
      syncPersist(cartRef.current, nextPromo, promoInput)
      return
    }
    setPromo(null)
    promoRef.current = null
    syncPersist(cartRef.current, null, promoInput)
  }

  const filtered = useMemo(() => {
    let list = SB_PRODUCTS.slice()
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((p) => {
        const ne = p.name.en.toLowerCase()
        const nu = p.name.ua.toLowerCase()
        const te = p.tagline.en.toLowerCase()
        const tu = p.tagline.ua.toLowerCase()
        const matches =
          ne.includes(q) ||
          nu.includes(q) ||
          p.id.toLowerCase().includes(q) ||
          te.includes(q) ||
          tu.includes(q)
        // vs-11: search shows non-matching products
        return !matches
      })
    }
    if (cat !== "all") list = list.filter((p) => p.cat === cat)
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating)
    // vs-10: at exactly $5 max, price filter does not apply
    if (maxPrice < 500 && maxPrice !== 5)
      list = list.filter((p) => p.price <= maxPrice)
    // vs-19: enabling "in stock only" hides the entire catalog instead of filtering
    if (stockOnly) list = []
    // vs-06: priceAsc uses same order as priceDesc
    if (sort === "priceAsc") list = [...list].sort((a, b) => b.price - a.price)
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price)
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating)
    if (sort === "new")
      list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    return list
  }, [query, cat, minRating, maxPrice, stockOnly, sort])

  function clearFilters() {
    setQuery("")
    setCat("all")
    setMaxPrice(500)
    setMinRating(0)
    setStockOnly(false)
    setPage(1)
  }

  const subtotal = cart.reduce((s, x) => s + x.price * x.q, 0)
  const promoDiscount = promo ? subtotal * (promo.percent / 100) : 0
  const total = Math.max(0, subtotal - promoDiscount)

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  useEffect(() => {
    setPage((p) => Math.max(1, Math.min(p, totalPages)))
  }, [totalPages])
  const pagedProducts = filtered.slice((page - 1) * perPage, page * perPage)

  const markBugPickCount = challenge
    ? foundBugIds.length
    : manualBugPaths.length

  const markBugBarDesktop = (
    <MarkBugControls
      t={t}
      pickBugMode={pickBugMode}
      onToggle={() => setPickBugMode((x) => !x)}
      count={markBugPickCount}
      compact={isCompactDesktopToolbar}
    />
  )
  const markBugBarCompact = (
    <MarkBugControls
      t={t}
      pickBugMode={pickBugMode}
      onToggle={() => setPickBugMode((x) => !x)}
      count={markBugPickCount}
      compact
    />
  )
  const markBugBarModalHeader = (
    <MarkBugControls
      t={t}
      pickBugMode={pickBugMode}
      onToggle={() => setPickBugMode((x) => !x)}
      count={markBugPickCount}
      compact={isMobile}
    />
  )
  const drawerPickBugFooter = pickBugMode ? (
    <>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 11.5,
          color: "var(--ink-3)",
          lineHeight: 1.4,
        }}
      >
        {t("sb.pickBug.drawerHint")}
      </p>
      {markBugBarDesktop}
    </>
  ) : null

  return (
    <div
      id="vibe-sandbox-root"
      ref={vibeSandboxRootRef}
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        paddingBottom: challenge ? 80 : pickBugMode ? 52 : 0,
        cursor: pickBugMode ? "crosshair" : undefined,
      }}
    >
      {pickBugMode ? (
        <style>{`
          #vibe-sandbox-root [data-vibe-pick-hovered="true"] {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
            box-shadow: 0 0 0 4px color-mix(in oklch, var(--accent-color) 22%, transparent);
          }
        `}</style>
      ) : null}
      {challenge && (
        <ChallengeBar
          t={t}
          timeLeft={timeLeft}
          foundCount={foundBugIds.length}
          totalBugs={totalBugs}
          onFinish={onFinishChallenge}
          isMobile={isMobile}
          foundBugIds={foundBugIds}
        />
      )}

      <header
        style={{
          position: "relative",
          zIndex: 20,
          background: "color-mix(in oklch, var(--bg) 92%, transparent)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: isMobile ? "10px 16px" : "12px 32px",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: isMobile ? "nowrap" : "wrap",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? 10 : 16,
          }}
        >
          {isMobile ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <a
                  href="#top"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 600,
                    fontSize: 13,
                    color: "inherit",
                    textDecoration: "none",
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      letterSpacing: -0.3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    }}
                  >
                    {t("sb.brand")}
                  </span>
                </a>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexShrink: 0,
                  }}
                >
                  {markBugBarCompact}
                  <button
                    type="button"
                    data-testid="chat-button"
                    onClick={openChatPanel}
                    title={t("sb.contact")}
                    aria-label={t("sb.contact")}
                    style={{
                      height: 30,
                      width: 30,
                      padding: 0,
                      border: "1px solid var(--line)",
                      borderRadius: 7,
                      background: "transparent",
                      color: "var(--ink-2)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VibeIcon name="chat" size={13} />
                  </button>
                  <button
                    type="button"
                    data-testid="account-button"
                    onClick={openAccountPanel}
                    title={
                      isAuthed && auth
                        ? auth.name ||
                          auth.email.split("@")[0] ||
                          t("sb.account")
                        : t("sb.account")
                    }
                    aria-label={t("sb.account")}
                    style={{
                      height: 30,
                      width: 30,
                      padding: 0,
                      border: "1px solid var(--line)",
                      borderRadius: 7,
                      background: isAuthed
                        ? "var(--accent-soft)"
                        : "transparent",
                      color: isAuthed ? "var(--accent-color)" : "var(--ink-2)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <VibeIcon name="user" size={13} />
                  </button>
                  <button
                    type="button"
                    data-testid="cart-button"
                    onClick={openCartPanel}
                    title={t("sb.cart")}
                    aria-label={t("sb.cart")}
                    style={{
                      height: 30,
                      padding: "0 8px",
                      border: "none",
                      borderRadius: 7,
                      background: "var(--ink)",
                      color: "var(--bg)",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    <VibeIcon name="cart" size={13} />
                    <span
                      className="mono"
                      style={{
                        background: "var(--accent-color)",
                        color: "var(--accent-ink)",
                        borderRadius: 4,
                        padding: "1px 5px",
                        fontSize: 10,
                      }}
                    >
                      {Math.max(
                        0,
                        cart.reduce((s, x) => s + x.q, 0),
                      )}
                    </span>
                  </button>
                </div>
              </div>
              <div
                data-vibe-bug-id="vs-11"
                style={{
                  width: "100%",
                  position: "relative",
                }}
              >
                <VibeIcon
                  name="search"
                  size={14}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ink-3)",
                  }}
                />
                <input
                  className="vibe-store-focus"
                  type="text"
                  data-testid="sandbox-search"
                  aria-label={t("sb.search")}
                  value={query}
                  onChange={(e) => {
                    setPage(1)
                    setQuery(e.target.value)
                  }}
                  placeholder={t("sb.search")}
                  style={{
                    width: "100%",
                    height: 36,
                    padding: "0 12px 0 34px",
                    background: "var(--bg-elev)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--ink)",
                    outline: "none",
                    fontFamily: "var(--font-sans)",
                  }}
                />
                {query ? (
                  <button
                    type="button"
                    data-testid="sandbox-search-clear"
                    onClick={() => {
                      setPage(1)
                      setQuery("")
                    }}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "var(--ink-3)",
                    }}
                  >
                    <VibeIcon name="x" size={13} />
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <a
                href="#top"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <span style={{ letterSpacing: -0.3 }}>{t("sb.brand")}</span>
              </a>

              <div
                data-vibe-bug-id="vs-11"
                style={{
                  flex: "1 1 420px",
                  maxWidth: 640,
                  minWidth: 220,
                  marginLeft: 10,
                  position: "relative",
                }}
              >
                <VibeIcon
                  name="search"
                  size={14}
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--ink-3)",
                  }}
                />
                <input
                  className="vibe-store-focus"
                  type="text"
                  data-testid="sandbox-search"
                  aria-label={t("sb.search")}
                  value={query}
                  onChange={(e) => {
                    setPage(1)
                    setQuery(e.target.value)
                  }}
                  placeholder={t("sb.search")}
                  style={{
                    width: "100%",
                    height: 36,
                    padding: "0 12px 0 34px",
                    background: "var(--bg-elev)",
                    border: "1px solid var(--line)",
                    borderRadius: 8,
                    fontSize: 13,
                    color: "var(--ink)",
                    outline: "none",
                    fontFamily: "var(--font-sans)",
                  }}
                />
                {query ? (
                  <button
                    type="button"
                    data-testid="sandbox-search-clear"
                    onClick={() => {
                      setPage(1)
                      setQuery("")
                    }}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "var(--ink-3)",
                    }}
                  >
                    <VibeIcon name="x" size={13} />
                  </button>
                ) : null}
              </div>

              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                  gap: 8,
                  minWidth: 0,
                  maxWidth: "100%",
                }}
              >
                {markBugBarDesktop}
                <button
                  type="button"
                  data-testid="chat-button"
                  onClick={openChatPanel}
                  style={{
                    height: 30,
                    padding: "0 10px",
                    border: "1px solid var(--line)",
                    borderRadius: 7,
                    background: "transparent",
                    color: "var(--ink-2)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                  }}
                >
                  <VibeIcon name="chat" size={13} />
                  {!isCompactDesktopToolbar ? t("sb.contact") : null}
                </button>
                <button
                  type="button"
                  data-testid="account-button"
                  onClick={openAccountPanel}
                  style={{
                    height: 30,
                    padding: "0 10px",
                    border: "1px solid var(--line)",
                    borderRadius: 7,
                    background: isAuthed ? "var(--accent-soft)" : "transparent",
                    color: isAuthed ? "var(--accent-color)" : "var(--ink-2)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                  }}
                >
                  <VibeIcon name="user" size={13} />
                  {!isCompactDesktopToolbar ? (
                    <span
                      style={{
                        display: "inline-block",
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {isAuthed && auth
                        ? auth.name ||
                          auth.email.split("@")[0] ||
                          t("sb.account")
                        : t("sb.account")}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  data-testid="cart-button"
                  onClick={openCartPanel}
                  style={{
                    height: 30,
                    padding: "0 12px",
                    border: "none",
                    borderRadius: 7,
                    background: "var(--ink)",
                    color: "var(--bg)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <VibeIcon name="cart" size={13} />
                  {!isCompactDesktopToolbar ? t("sb.cart") : null}
                  <span
                    className="mono"
                    style={{
                      background: "var(--accent-color)",
                      color: "var(--accent-ink)",
                      borderRadius: 4,
                      padding: "1px 5px",
                      fontSize: 10,
                      marginLeft: 2,
                    }}
                  >
                    {Math.max(
                      0,
                      cart.reduce((s, x) => s + x.q, 0),
                    )}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {!challenge && (
          <div
            style={{
              background: "var(--bg)",
              color: "var(--ink)",
              borderTop: "1px solid var(--line-2)",
            }}
          >
            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: isMobile ? "12px 16px" : "12px 32px",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                flexWrap: "wrap",
                alignItems: isMobile ? "stretch" : "center",
                justifyContent: "space-between",
                gap: isMobile ? 12 : 16,
              }}
            >
              <p
                style={{
                  margin: 0,
                  flex: isMobile ? "none" : "1 1 200px",
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  fontFamily: "var(--font-sans)",
                  color: "var(--ink)",
                }}
              >
                {t("ch.banner")}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  alignItems: "center",
                  justifyContent: isMobile ? "stretch" : "flex-end",
                }}
              >
                <button
                  type="button"
                  data-testid="sandbox-challenge-cta"
                  onClick={onStartChallenge}
                  style={{
                    background: "var(--accent-color)",
                    color: "var(--accent-ink)",
                    border: "none",
                    padding: isMobile ? "8px 12px" : "8px 14px",
                    borderRadius: 8,
                    fontSize: isMobile ? 11.5 : 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    textAlign: "center",
                    lineHeight: 1.25,
                    flex: isMobile ? 1 : "0 1 auto",
                    minWidth: 0,
                  }}
                >
                  <VibeIcon name="bug" size={13} stroke={2.4} />
                  {t("ch.cta.manual")}
                </button>
                <button
                  type="button"
                  data-testid="sandbox-run-autotests"
                  onClick={onRunAutoTests}
                  style={{
                    background: "transparent",
                    color: "var(--ink-2)",
                    border: "1px solid var(--line-strong)",
                    padding: isMobile ? "8px 12px" : "8px 14px",
                    borderRadius: 8,
                    fontSize: isMobile ? 11.5 : 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: isMobile ? 1 : "0 1 auto",
                    minWidth: 0,
                  }}
                >
                  {t("res.runAuto")}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: isMobile ? "16px" : "24px 32px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "240px 1fr",
          gap: isMobile ? 16 : 24,
        }}
        id="top"
      >
        {!isMobile ? (
          <aside
            style={{
              position: "sticky",
              top: challenge
                ? "calc(var(--site-header-h) + 52px)"
                : "calc(var(--site-header-h) + 12px)",
              alignSelf: "flex-start",
            }}
          >
            <StoreFiltersCard
              t={t}
              cat={cat}
              setCat={setCat}
              setPage={setPage}
              minRating={minRating}
              setMinRating={setMinRating}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              stockOnly={stockOnly}
              setStockOnly={setStockOnly}
              clearFilters={clearFilters}
            />

            {challenge ? (
              <BugAreaHintPanel t={t} foundBugIds={foundBugIds} />
            ) : null}
          </aside>
        ) : null}

        <main>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div
              className="mono"
              style={{ fontSize: 12, color: "var(--ink-3)" }}
            >
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                {filtered.length}
              </span>{" "}
              {t("sb.results")}
              {cat !== "all" && <> · {t(`sb.cat.${cat}`)}</>}
              {query && (
                <>
                  {" "}
                  · &quot;
                  <span style={{ color: "var(--ink)" }}>{query}</span>
                  &quot;
                </>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {isMobile ? (
                <button
                  type="button"
                  data-testid="filter-drawer-trigger"
                  onClick={() => setFiltersOpen(true)}
                  style={{
                    height: 30,
                    padding: "0 10px",
                    border: "1px solid var(--line)",
                    borderRadius: 7,
                    background: "var(--bg-elev)",
                    color: "var(--ink-2)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  <VibeIcon name="filter" size={13} /> {t("sb.filters")}
                </button>
              ) : null}
              <span
                data-vibe-bug-id="vs-06"
                style={{ display: "inline-block" }}
              >
                <select
                  className="vibe-store-focus"
                  data-testid="sort-select"
                  value={sort}
                  onChange={(e) => {
                    setPage(1)
                    setSort(e.target.value)
                  }}
                  style={{
                    height: 30,
                    padding: "0 10px",
                    border: "1px solid var(--line)",
                    borderRadius: 7,
                    background: "var(--bg-elev)",
                    color: "var(--ink-2)",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    outline: "none",
                  }}
                >
                  {["featured", "priceAsc", "priceDesc", "rating", "new"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {t(`sb.sort.${s === "featured" ? "featured" : s}`)}
                      </option>
                    ),
                  )}
                </select>
              </span>
              <div
                style={{
                  display: "flex",
                  border: "1px solid var(--line)",
                  borderRadius: 7,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  data-testid="view-grid"
                  title={t("sb.view.grid")}
                  onClick={() => setViewGrid("grid")}
                  style={{
                    width: 30,
                    height: 30,
                    border: "none",
                    background:
                      viewGrid === "grid" ? "var(--ink)" : "var(--bg-elev)",
                    color: viewGrid === "grid" ? "var(--bg)" : "var(--ink-2)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VibeIcon name="grid" size={13} />
                </button>
                <button
                  type="button"
                  data-testid="view-list"
                  title={t("sb.view.list")}
                  onClick={() => setViewGrid("list")}
                  style={{
                    width: 30,
                    height: 30,
                    border: "none",
                    background:
                      viewGrid === "list" ? "var(--ink)" : "var(--bg-elev)",
                    color: viewGrid === "list" ? "var(--bg)" : "var(--ink-2)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <VibeIcon name="list" size={13} />
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                padding: 60,
                textAlign: "center",
                border: "1px dashed var(--line)",
                borderRadius: 14,
                color: "var(--ink-3)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--ink-2)",
                }}
              >
                {t("sb.empty.title")}
              </div>
              <div
                data-vibe-bug-id="vs-09"
                style={{ display: "inline-block", marginTop: 14 }}
              >
                <VibeButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    /* vs-09: empty-state clear is a no-op; sidebar clear still works */
                  }}
                >
                  {t("sb.empty.cta")}
                </VibeButton>
              </div>
            </div>
          ) : viewGrid === "grid" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "repeat(2, 1fr)"
                  : "repeat(4, 1fr)",
                gap: isMobile ? 10 : 14,
              }}
            >
              {pagedProducts.map((p, i) => (
                <ProductCard
                  key={p.id}
                  p={p}
                  dataLang={dataLang}
                  onAdd={addToCart}
                  dense={isMobile}
                  imagePriority={i < (isMobile ? 4 : 8)}
                  t={t}
                />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pagedProducts.map((p, i) => (
                <ProductRow
                  key={p.id}
                  p={p}
                  dataLang={dataLang}
                  onAdd={addToCart}
                  imagePriority={i < 6}
                  t={t}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: 4,
                marginTop: 24,
                padding: "20px 0",
                maxWidth: "100%",
              }}
            >
              <button
                type="button"
                data-testid="pagination-prev"
                data-vibe-bug-id="vs-07"
                onClick={() => {
                  /* vs-07: prev/next disabled for QA hunt */
                }}
                disabled={page === 1}
                style={paginateBtn(page === 1)}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pn) => (
                <button
                  key={pn}
                  type="button"
                  onClick={() => setPage(pn)}
                  style={{
                    ...paginateBtn(false),
                    background: pn === page ? "var(--ink)" : "transparent",
                    color: pn === page ? "var(--bg)" : "var(--ink-2)",
                    fontWeight: pn === page ? 700 : 500,
                  }}
                >
                  {pn}
                </button>
              ))}
              <button
                type="button"
                data-testid="pagination-next"
                data-vibe-bug-id="vs-07"
                onClick={() => {
                  /* vs-07 */
                }}
                disabled={page === totalPages}
                style={paginateBtn(page === totalPages)}
              >
                ›
              </button>
            </div>
          )}
        </main>
      </div>

      {filtersOpen && (
        <Drawer
          fullWidth={isMobile}
          onClose={() => setFiltersOpen(false)}
          title={t("sb.filters")}
          headerActions={markBugBarModalHeader}
          footer={drawerPickBugFooter}
        >
          <StoreFiltersCard
            t={t}
            cat={cat}
            setCat={setCat}
            setPage={setPage}
            minRating={minRating}
            setMinRating={setMinRating}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            stockOnly={stockOnly}
            setStockOnly={setStockOnly}
            clearFilters={() => {
              clearFilters()
              setFiltersOpen(false)
            }}
          />
        </Drawer>
      )}
      {cartOpen && (
        <Drawer
          fullWidth={isMobile}
          onClose={() => setCartOpen(false)}
          title={appLocale === "uk" ? "Cart" : t("sb.cart")}
          closeClicksRequired={3}
          headerActions={markBugBarModalHeader}
          footer={drawerPickBugFooter}
        >
          <CartContents
            t={t}
            appLocale={appLocale}
            cart={cart}
            dataLang={dataLang}
            onRemove={removeFromCart}
            onQty={updateQty}
            subtotal={subtotal}
            promo={promo}
            promoDiscount={promoDiscount}
            total={total}
            promoInput={promoInput}
            setPromoInput={setPromoInput}
            onApplyPromo={applyPromo}
            onCheckoutClick={() => setCheckoutJokeOpen(true)}
          />
        </Drawer>
      )}
      {chatOpen && (
        <ContactChat
          t={t}
          onClose={() => setChatOpen(false)}
          isMobile={isMobile}
          headerActions={markBugBarModalHeader}
          bugPickFooter={drawerPickBugFooter}
        />
      )}
      {accountOpen && (
        <Drawer
          fullWidth={isMobile}
          onClose={() => setAccountOpen(false)}
          title={t("sb.account")}
          headerActions={markBugBarModalHeader}
          footer={drawerPickBugFooter}
        >
          <AccountPanel
            t={t}
            sessionKey={sessionKey}
            auth={auth}
            onLogoutAfter={() => {
              setCart([])
              setPromo(null)
              setPromoInput("")
              clearVibeSandboxCheckoutStorage()
            }}
          />
        </Drawer>
      )}
      {checkoutJokeOpen ? (
        <CheckoutJokeModal
          t={t}
          isMobile={isMobile}
          onClose={() => setCheckoutJokeOpen(false)}
        />
      ) : null}
      {pickBugSnackOpen ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: pickBugMode ? 100 : 24,
            zIndex: 220,
            maxWidth: "min(420px, calc(100vw - 32px))",
            padding: "12px 18px",
            borderRadius: 10,
            background: "var(--ink)",
            color: "var(--bg)",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "var(--shadow-lg)",
            fontFamily: "var(--font-sans)",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {t("sb.pickBug.snackbarAdded")}
        </div>
      ) : null}
      {pickBugMode ? (
        <div
          data-bug-pick-ignore
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            padding: "10px 16px",
            background:
              "color-mix(in oklch, var(--accent-color) 14%, var(--bg))",
            borderTop: "1px solid var(--accent-line)",
            fontSize: 11.5,
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            color: "var(--ink-2)",
            lineHeight: 1.45,
          }}
        >
          {t("sb.pickBug.banner")}
        </div>
      ) : null}
    </div>
  )
}

function ProductImageGradient({ p, size }: { p: VibeProduct; size: number }) {
  const initials = p.name.en
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  const seed = p.id.charCodeAt(1) + p.id.charCodeAt(2)
  const hues = [22, 200, 280, 145, 45, 320]
  const hue = hues[seed % hues.length]
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,.06) 0px, rgba(0,0,0,.06) 6px, transparent 6px, transparent 12px), linear-gradient(135deg, oklch(0.92 0.05 ${hue}), oklch(0.78 0.1 ${hue}))`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: size / 5,
        fontWeight: 700,
        color: "rgba(20,17,13,.55)",
        letterSpacing: -0.5,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {initials}
    </div>
  )
}

function ProductImage({
  p,
  dataLang,
  size = 120,
  priority = false,
}: {
  p: VibeProduct
  dataLang: VibeTextLang
  size?: number
  priority?: boolean
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const src = useMemo(() => vibeProductImageUrl(p), [p])
  const alt = vibePickText(p.name, dataLang)
  if (imgFailed || !src) {
    return <ProductImageGradient p={p} size={size} />
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--bg-sunken)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        priority={priority}
        style={{
          objectFit: "cover",
          borderRadius: 8,
        }}
        onError={() => setImgFailed(true)}
      />
    </div>
  )
}

function Stars({ value, count }: { value: number; count: number | undefined }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 11.5,
        color: "var(--ink-3)",
      }}
    >
      <span style={{ display: "inline-flex" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            style={{
              color:
                i < full
                  ? "var(--accent-color)"
                  : i === full && half
                    ? "var(--accent-color)"
                    : "var(--line-strong)",
              opacity: i === full && half ? 0.6 : 1,
              fontSize: 12,
            }}
          >
            ★
          </span>
        ))}
      </span>
      <span className="mono">{value.toFixed(1)}</span>
      {count != null && (
        <span className="mono" style={{ opacity: 0.6 }}>
          ({count})
        </span>
      )}
    </span>
  )
}

function ProductCard({
  p,
  dataLang,
  onAdd,
  dense,
  imagePriority,
  t,
}: {
  p: VibeProduct
  dataLang: VibeTextLang
  onAdd: (p: VibeProduct) => void
  dense: boolean
  imagePriority?: boolean
  t: (k: string) => string
}) {
  const [added, setAdded] = useState(false)
  const oos = p.stock === 0
  function add() {
    if (oos) return
    onAdd(p)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }
  return (
    <div
      className="vibe-product-card"
      data-testid={`product-card-${p.id}`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        padding: dense ? 12 : 16,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: dense ? 10 : 14,
          left: dense ? 10 : 14,
          display: "flex",
          gap: 4,
          zIndex: 1,
        }}
      >
        {p.isNew && (
          <span
            className="mono"
            data-testid={`product-badge-new-${p.id}`}
            style={{
              padding: "2px 7px",
              fontSize: 10,
              fontWeight: 600,
              background: "var(--ink)",
              color: "var(--bg)",
              borderRadius: 4,
            }}
          >
            NEW
          </span>
        )}
        {p.sale && (
          <span
            className="mono"
            data-testid={`product-badge-sale-${p.id}`}
            style={{
              padding: "2px 7px",
              fontSize: 10,
              fontWeight: 600,
              background: "var(--accent-color)",
              color: "var(--accent-ink)",
              borderRadius: 4,
            }}
          >
            SALE
          </span>
        )}
        {oos && (
          <span
            className="mono"
            style={{
              padding: "2px 7px",
              fontSize: 10,
              fontWeight: 600,
              background: "var(--bg-sunken)",
              color: "var(--ink-3)",
              borderRadius: 4,
              border: "1px solid var(--line)",
            }}
          >
            0 LEFT
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <ProductImage
          p={p}
          dataLang={dataLang}
          size={dense ? 90 : 120}
          priority={Boolean(imagePriority)}
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: dense ? 12.5 : 13.5,
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: 4,
            color: "var(--ink)",
          }}
        >
          {vibePickText(p.name, dataLang)}
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: "var(--ink-3)",
            lineHeight: 1.4,
            marginBottom: 10,
            minHeight: dense ? 0 : 32,
          }}
        >
          {vibePickText(p.tagline, dataLang)}
        </div>
        <Stars value={p.rating} count={p.reviews} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px dashed var(--line)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            flexWrap: "wrap",
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: dense ? 14 : 16,
              fontWeight: 700,
              fontFamily: "var(--font-mono)",
              color: "var(--ink)",
            }}
          >
            ${p.price}
          </span>
          {p.oldPrice ? (
            <span
              style={{
                fontSize: 11,
                color: "var(--ink-4)",
                textDecoration: "line-through",
                fontFamily: "var(--font-mono)",
              }}
            >
              ${p.oldPrice}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          data-testid={`add-to-cart-${p.id}`}
          onClick={add}
          disabled={oos}
          style={{
            height: 28,
            padding: "0 10px",
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            background: added
              ? "var(--ok)"
              : oos
                ? "var(--bg-sunken)"
                : "var(--ink)",
            color: added ? "#fff" : oos ? "var(--ink-4)" : "var(--bg)",
            border: "none",
            borderRadius: 6,
            cursor: oos ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            transition: "background .15s",
            opacity: oos ? 0.55 : 1,
          }}
        >
          {added ? (
            <>
              <VibeIcon name="check" size={11} stroke={2.5} /> {t("sb.added")}
            </>
          ) : (
            <>
              <VibeIcon name="plus" size={11} stroke={2.5} /> {t("sb.add")}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function ProductRow({
  p,
  dataLang,
  onAdd,
  imagePriority,
  t,
  isMobile,
}: {
  p: VibeProduct
  dataLang: VibeTextLang
  onAdd: (p: VibeProduct) => void
  imagePriority?: boolean
  t: (k: string) => string
  isMobile: boolean
}) {
  const [added, setAdded] = useState(false)
  const oos = p.stock === 0
  function add() {
    if (oos) return
    onAdd(p)
    setAdded(true)
    setTimeout(() => setAdded(false), 900)
  }
  if (isMobile) {
    return (
      <div
        data-testid={`product-row-${p.id}`}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: 12,
          padding: "12px 14px",
          background: "var(--bg-card)",
          border: "1px solid var(--line)",
          borderRadius: 10,
        }}
      >
        <ProductImage
          p={p}
          dataLang={dataLang}
          size={56}
          priority={Boolean(imagePriority)}
        />
        <div style={{ flex: "1 1 140px", minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>
              {vibePickText(p.name, dataLang)}
            </span>
            {p.isNew && (
              <VibeChip sm accent testId={`product-badge-new-${p.id}`}>
                NEW
              </VibeChip>
            )}
            {p.sale && (
              <VibeChip sm accent testId={`product-badge-sale-${p.id}`}>
                SALE
              </VibeChip>
            )}
            {oos && <VibeChip sm>OOS</VibeChip>}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
            {vibePickText(p.tagline, dataLang)}
          </div>
          <div style={{ marginTop: 8 }}>
            <Stars value={p.rating} count={p.reviews} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flex: "1 1 100%",
            borderTop: "1px dashed var(--line)",
            paddingTop: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            <span className="mono" style={{ fontSize: 14, fontWeight: 700 }}>
              ${p.price}
            </span>
            {p.oldPrice ? (
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--ink-4)",
                  textDecoration: "line-through",
                }}
              >
                was ${p.oldPrice}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            data-testid={`add-to-cart-${p.id}`}
            onClick={add}
            disabled={oos}
            style={{
              height: 30,
              padding: "0 12px",
              fontSize: 11.5,
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              background: added
                ? "var(--ok)"
                : oos
                  ? "var(--bg-sunken)"
                  : "var(--ink)",
              color: added ? "#fff" : oos ? "var(--ink-4)" : "var(--bg)",
              border: "none",
              borderRadius: 6,
              cursor: oos ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              opacity: oos ? 0.55 : 1,
              marginLeft: "auto",
            }}
          >
            {added ? (
              <>
                <VibeIcon name="check" size={11} stroke={2.5} /> {t("sb.added")}
              </>
            ) : (
              <>
                <VibeIcon name="plus" size={12} stroke={2.5} /> {t("sb.add")}
              </>
            )}
          </button>
        </div>
      </div>
    )
  }
  return (
    <div
      data-testid={`product-row-${p.id}`}
      style={{
        display: "grid",
        gridTemplateColumns: "70px 1fr 110px 140px 110px",
        gap: 16,
        alignItems: "center",
        padding: "12px 16px",
        background: "var(--bg-card)",
        border: "1px solid var(--line)",
        borderRadius: 10,
      }}
    >
      <ProductImage
        p={p}
        dataLang={dataLang}
        size={56}
        priority={Boolean(imagePriority)}
      />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>
            {vibePickText(p.name, dataLang)}
          </span>
          {p.isNew && (
            <VibeChip sm accent testId={`product-badge-new-${p.id}`}>
              NEW
            </VibeChip>
          )}
          {p.sale && (
            <VibeChip sm accent testId={`product-badge-sale-${p.id}`}>
              SALE
            </VibeChip>
          )}
          {oos && <VibeChip sm>OOS</VibeChip>}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
          {vibePickText(p.tagline, dataLang)}
        </div>
      </div>
      <Stars value={p.rating} count={p.reviews} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexWrap: "wrap",
          minWidth: 0,
        }}
      >
        <span className="mono" style={{ fontSize: 14, fontWeight: 700 }}>
          ${p.price}
        </span>
        {p.oldPrice ? (
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-4)",
              textDecoration: "line-through",
            }}
          >
            was ${p.oldPrice}
          </span>
        ) : null}
      </div>
      <button
        type="button"
        data-testid={`add-to-cart-${p.id}`}
        onClick={add}
        disabled={oos}
        style={{
          height: 30,
          padding: "0 12px",
          fontSize: 11.5,
          fontWeight: 600,
          fontFamily: "var(--font-mono)",
          background: added
            ? "var(--ok)"
            : oos
              ? "var(--bg-sunken)"
              : "var(--ink)",
          color: added ? "#fff" : oos ? "var(--ink-4)" : "var(--bg)",
          border: "none",
          borderRadius: 6,
          cursor: oos ? "not-allowed" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          opacity: oos ? 0.55 : 1,
        }}
      >
        {added ? (
          <>
            <VibeIcon name="check" size={11} stroke={2.5} /> {t("sb.added")}
          </>
        ) : (
          <>
            <VibeIcon name="plus" size={12} stroke={2.5} /> {t("sb.add")}
          </>
        )}
      </button>
    </div>
  )
}

function Drawer({
  children,
  title,
  onClose,
  fullWidth,
  headerActions,
  footer,
  closeClicksRequired = 1,
}: {
  children: ReactNode
  title: string
  onClose: () => void
  fullWidth?: boolean
  headerActions?: ReactNode
  footer?: ReactNode
  /** vs-18: cart drawer needs 3 taps before close */
  closeClicksRequired?: number
}) {
  const [closeArmed, setCloseArmed] = useState(0)
  const requestClose = () => {
    if (closeClicksRequired <= 1) {
      onClose()
      return
    }
    if (closeArmed + 1 >= closeClicksRequired) {
      setCloseArmed(0)
      onClose()
    } else {
      setCloseArmed((n) => n + 1)
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <button
        type="button"
        aria-label="Close drawer"
        data-bug-pick-ignore
        onClick={requestClose}
        style={{
          position: "absolute",
          inset: 0,
          border: "none",
          margin: 0,
          padding: 0,
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          cursor: "pointer",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: fullWidth ? "100vw" : 420,
          maxWidth: fullWidth ? "100vw" : 420,
          height: "100%",
          background: "var(--bg)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          flexDirection: "column",
          borderLeft: fullWidth ? "none" : "1px solid var(--line)",
          animation: "vibe-slide-in .25s ease",
        }}
      >
        <div
          data-bug-pick-ignore
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--line)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{title}</h3>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {headerActions}
            <button
              type="button"
              data-testid="drawer-close"
              data-vibe-bug-id={closeClicksRequired > 1 ? "vs-18" : undefined}
              onClick={requestClose}
              style={{
                width: 30,
                height: 30,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--ink-3)",
              }}
            >
              <VibeIcon name="x" size={16} />
            </button>
          </div>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>{children}</div>
        {footer ? (
          <div
            data-bug-pick-ignore
            style={{
              flexShrink: 0,
              padding: "14px 20px 18px",
              borderTop: "1px solid var(--line)",
              background: "var(--bg-elev)",
            }}
          >
            {footer}
          </div>
        ) : null}
      </div>
      <style>{`@keyframes vibe-slide-in { from { transform: translateX(40px); opacity: 0;} to { transform: translateX(0); opacity: 1;} }`}</style>
    </div>
  )
}

const qtyBtn: CSSProperties = {
  width: 22,
  height: 22,
  border: "1px solid var(--line)",
  background: "var(--bg-card)",
  color: "var(--ink-2)",
  borderRadius: 5,
  cursor: "pointer",
  fontSize: 12,
  lineHeight: 1,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-mono)",
}

function CartRow({
  label,
  value,
  bold,
}: {
  label: string
  value: string
  bold?: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: bold ? 700 : 400,
        fontSize: bold ? 16 : 13,
      }}
    >
      <span>{label}</span>
      <span className="mono">{value}</span>
    </div>
  )
}

function CartContents({
  t,
  appLocale,
  cart,
  dataLang,
  onRemove,
  onQty,
  subtotal,
  promo,
  promoDiscount,
  total,
  promoInput,
  setPromoInput,
  onApplyPromo,
  onCheckoutClick,
}: {
  t: (k: string) => string
  appLocale: AppLocale
  cart: CartLine[]
  dataLang: VibeTextLang
  onRemove: (id: string) => void
  onQty: (id: string, d: number) => void
  subtotal: number
  promo: { code: string; applied: number; percent: number } | null
  promoDiscount: number
  total: number
  promoInput: string
  setPromoInput: (v: string) => void
  onApplyPromo: () => void
  onCheckoutClick: () => void
}) {
  if (cart.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>
        <VibeIcon name="cart" size={36} stroke={1.4} />
        <div style={{ fontSize: 14, marginTop: 14 }}>{t("sb.cart.empty")}</div>
      </div>
    )
  }
  const cartLabelsEn = appLocale === "uk"
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {cart.map((x) => (
        <div
          key={x.id}
          style={{
            display: "flex",
            gap: 12,
            padding: 12,
            border: "1px solid var(--line)",
            borderRadius: 10,
            background: "var(--bg-elev)",
          }}
        >
          <ProductImage p={x} dataLang={dataLang} size={48} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>
              {vibePickText(x.name, dataLang)}
            </div>
            <div
              className="mono"
              style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}
            >
              ${x.price} × {x.q}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginTop: 6,
              }}
            >
              <button
                type="button"
                onClick={() => onQty(x.id, -1)}
                style={qtyBtn}
              >
                −
              </button>
              <span
                className="mono"
                style={{ fontSize: 12, minWidth: 18, textAlign: "center" }}
              >
                {x.q}
              </span>
              <button
                type="button"
                onClick={() => onQty(x.id, 1)}
                disabled={x.q >= x.stock}
                style={{
                  ...qtyBtn,
                  opacity: x.q >= x.stock ? 0.45 : 1,
                  cursor: x.q >= x.stock ? "not-allowed" : "pointer",
                }}
              >
                +
              </button>
              <span
                data-vibe-bug-id={cart.length > 1 ? "vs-14" : undefined}
                style={{ display: "inline-flex" }}
              >
                <button
                  type="button"
                  data-testid={`cart-remove-${x.id}`}
                  onClick={() => onRemove(x.id)}
                  style={{
                    ...qtyBtn,
                    marginLeft: 8,
                    color: "var(--err)",
                    border: "1px solid var(--line)",
                  }}
                >
                  <VibeIcon name="x" size={11} />
                </button>
              </span>
            </div>
          </div>
          <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>
            ${(x.price * x.q).toFixed(2)}
          </span>
        </div>
      ))}

      <div
        style={{
          marginTop: 12,
          padding: 12,
          background: "var(--bg-elev)",
          borderRadius: 10,
          border: "1px dashed var(--line)",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 10.5,
            color: "var(--ink-2)",
            marginBottom: 8,
            lineHeight: 1.35,
          }}
        >
          {t("sb.promo")}
        </div>
        <div
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}
        >
          {t("sb.cart.promoBlock")}
        </div>
        <div data-vibe-bug-id="vs-13" style={{ display: "flex", gap: 6 }}>
          <input
            className="vibe-store-focus"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="VIBES10"
            style={{
              flex: 1,
              height: 32,
              padding: "0 10px",
              border: "1px solid var(--line)",
              borderRadius: 6,
              background: "var(--bg-card)",
              color: "var(--ink)",
              fontSize: 12,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={onApplyPromo}
            className="vibe-store-focus"
            style={{
              height: 32,
              padding: "0 12px",
              border: "none",
              borderRadius: 6,
              background: "var(--ink)",
              color: "var(--bg)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t("sb.cart.apply")}
          </button>
        </div>
        {promo ? (
          <div
            data-vibe-bug-id={promo.code === "VIBES10" ? "vs-12" : undefined}
            className="mono"
            style={{ fontSize: 11, color: "var(--ok)", marginTop: 6 }}
          >
            {promo.code} · −{promo.percent}% applied
            {promo.applied > 1 ? ` (×${promo.applied}!)` : ""}
          </div>
        ) : null}
      </div>

      <div
        data-vibe-bug-id={cartLabelsEn ? "vs-17" : undefined}
        style={{
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          fontSize: 13,
        }}
      >
        <CartRow
          label={cartLabelsEn ? "Subtotal" : t("sb.cart.subtotal")}
          value={`$${subtotal.toFixed(2)}`}
        />
        {promo ? (
          <CartRow
            label={cartLabelsEn ? "Promo" : t("sb.cart.promoLine")}
            value={`−$${promoDiscount.toFixed(2)}`}
          />
        ) : null}
        <div
          style={{
            borderTop: "1px solid var(--line)",
            paddingTop: 8,
            marginTop: 4,
          }}
        >
          <CartRow
            label={cartLabelsEn ? "Total" : t("sb.cart.total")}
            value={`$${total.toFixed(2)}`}
            bold
          />
        </div>
      </div>
      <div data-vibe-bug-id={cartLabelsEn ? "vs-17" : undefined}>
        <VibeButton
          variant="primary"
          size="lg"
          full
          iconRight="arrow-right"
          style={{ marginTop: 16 }}
          testId="cart-checkout"
          onClick={onCheckoutClick}
        >
          {cartLabelsEn ? "Checkout (not really)" : t("sb.cart.checkout")}
        </VibeButton>
      </div>
    </div>
  )
}

const inputStyle: CSSProperties = {
  height: 36,
  padding: "0 12px",
  border: "1px solid var(--line)",
  borderRadius: 7,
  background: "var(--bg-elev)",
  color: "var(--ink)",
  fontSize: 13,
  outline: "none",
}

const SANDBOX_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const AUTH_ERR_CODES = [
  "NAME_REQUIRED",
  "NAME_TOO_LONG",
  "EMAIL_INVALID",
  "EMAIL_REQUIRED",
  "PASSWORD_REQUIRED",
  "PASSWORD_TOO_SHORT",
  "EMAIL_ALREADY_EXISTS",
  "EMAIL_RESERVED",
  "LOGIN_FIELDS_REQUIRED",
  "LOGIN_INVALID_CREDENTIALS",
  "PROFILE_NOT_AUTHENTICATED",
  "PROFILE_USER_NOT_FOUND",
] as const

function authErrMessage(raw: string, t: (k: string) => string): string {
  const hit = AUTH_ERR_CODES.find((c) => raw.includes(c))
  if (hit) return t(`sb.auth.err.${hit}`)
  return t("sb.auth.err.GENERIC")
}

type AuthFieldErrors = { name?: string; email?: string; password?: string }

function buildAuthFieldErrors(
  mode: "login" | "register",
  name: string,
  email: string,
  pass: string,
  t: (k: string) => string,
): AuthFieldErrors {
  const e: AuthFieldErrors = {}
  const em = email.trim()
  const pw = pass.trim()
  const nm = name.trim()
  if (mode === "register") {
    if (!nm) e.name = t("sb.auth.err.NAME_REQUIRED")
    else if (nm.length > 120) e.name = t("sb.auth.err.NAME_TOO_LONG")
  }
  // vs-03: no inline "email required" on register; invalid format still shown
  if (!em) {
    if (mode !== "register") e.email = t("sb.auth.err.EMAIL_REQUIRED")
  } else if (!SANDBOX_EMAIL_RE.test(em) || em.length < 6)
    e.email = t("sb.auth.err.EMAIL_INVALID")
  if (!pw) e.password = t("sb.auth.err.PASSWORD_REQUIRED")
  else if (pw.length < 8) e.password = t("sb.auth.err.PASSWORD_TOO_SHORT")
  return e
}

/** Sandbox-only: cryptographically random, meets min length + charset checks. */
function generateSandboxPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const lower = "abcdefghjkmnpqrstuvwxyz"
  const digits = "23456789"
  const symbols = "!@#$%&*"
  const all = upper + lower + digits + symbols
  const len = 16
  const pick = (set: string) => {
    const u = new Uint32Array(1)
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(u)
    } else {
      u[0] = (Math.random() * 0x100000000) >>> 0
    }
    return set[u[0] % set.length] ?? set[0]
  }
  const chars: string[] = [
    pick(upper),
    pick(lower),
    pick(digits),
    pick(symbols),
  ]
  for (let i = chars.length; i < len; i++) chars.push(pick(all))
  for (let i = chars.length - 1; i > 0; i--) {
    const u = new Uint32Array(1)
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(u)
    } else {
      u[0] = (Math.random() * 0x100000000) >>> 0
    }
    const j = u[0] % (i + 1)
    const a = chars[i]
    const b = chars[j]
    if (a === undefined || b === undefined) continue
    chars[i] = b
    chars[j] = a
  }
  return chars.join("")
}

type SandboxAuthRole = "qa" | "developer" | "manager"

function AccountPanel({
  t,
  sessionKey,
  auth,
  onLogoutAfter,
}: {
  t: (k: string) => string
  sessionKey: string
  auth: { name: string; email: string; role: string } | null | undefined
  onLogoutAfter: () => void
}) {
  const registerUser = useMutation(api.sandbox.registerUser)
  const loginUser = useMutation(api.sandbox.loginUser)
  const logoutUser = useMutation(api.sandbox.logoutUser)
  const updateProfile = useMutation(api.sandbox.updateSandboxProfile)

  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [role, setRole] = useState<SandboxAuthRole>("qa")
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)

  const [profileEditing, setProfileEditing] = useState(false)
  const [profileName, setProfileName] = useState("")
  const [profileRole, setProfileRole] = useState<SandboxAuthRole>("qa")
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileBusy, setProfileBusy] = useState(false)

  useEffect(() => {
    if (auth === undefined) return
    if (auth === null) {
      setProfileEditing(false)
      setProfileError(null)
      return
    }
    setProfileName(auth.name)
    setProfileRole(auth.role as SandboxAuthRole)
  }, [auth])

  if (auth === undefined) {
    return (
      <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
        …
      </div>
    )
  }

  if (auth) {
    return (
      <div>
        <div
          style={{
            padding: 16,
            background: "var(--bg-elev)",
            border: "1px solid var(--line)",
            borderRadius: 10,
          }}
        >
          {!profileEditing ? (
            <>
              <div
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-3)" }}
              >
                {t("sb.name")}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>
                {auth.name}
              </div>
              <div
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 10 }}
              >
                {t("sb.auth.emailLabel")}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, marginTop: 2 }}>
                {auth.email}
              </div>
              <VibeChip sm accent style={{ marginTop: 8 }}>
                {t(`sb.auth.role.${auth.role as SandboxAuthRole}`)}
              </VibeChip>
            </>
          ) : (
            <>
              <div
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}
              >
                {t("sb.name")}
              </div>
              <input
                className="vibe-store-focus"
                value={profileName}
                onChange={(e) => {
                  setProfileName(e.target.value)
                  setProfileError(null)
                }}
                placeholder={t("sb.name")}
                autoComplete="name"
                style={{
                  ...inputStyle,
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--ink-3)",
                  marginTop: 10,
                  marginBottom: 4,
                }}
              >
                {t("sb.auth.role")}
              </div>
              <select
                className="vibe-store-focus"
                value={profileRole}
                onChange={(e) => {
                  setProfileRole(e.target.value as SandboxAuthRole)
                  setProfileError(null)
                }}
                style={{
                  ...inputStyle,
                  width: "100%",
                  boxSizing: "border-box",
                  cursor: "pointer",
                }}
              >
                <option value="qa">{t("sb.auth.role.qa")}</option>
                <option value="developer">{t("sb.auth.role.developer")}</option>
                <option value="manager">{t("sb.auth.role.manager")}</option>
              </select>
              {profileError ? (
                <div
                  role="alert"
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "var(--err)",
                    lineHeight: 1.4,
                  }}
                >
                  {profileError}
                </div>
              ) : null}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <VibeButton
                  variant="secondary"
                  size="md"
                  style={{ flex: 1 }}
                  disabled={profileBusy}
                  onClick={() => {
                    setProfileEditing(false)
                    setProfileName(auth.name)
                    setProfileRole(auth.role as SandboxAuthRole)
                    setProfileError(null)
                  }}
                >
                  {t("sb.auth.profile.cancel")}
                </VibeButton>
                <VibeButton
                  variant="primary"
                  size="md"
                  style={{ flex: 1 }}
                  disabled={profileBusy}
                  onClick={() => void saveProfile()}
                >
                  {t("sb.auth.profile.save")}
                </VibeButton>
              </div>
            </>
          )}
        </div>
        {!profileEditing ? (
          <VibeButton
            variant="secondary"
            size="md"
            full
            style={{ marginTop: 12 }}
            onClick={() => {
              setProfileEditing(true)
              setProfileError(null)
              setProfileName(auth.name)
              setProfileRole(auth.role as SandboxAuthRole)
            }}
          >
            {t("sb.auth.profile.edit")}
          </VibeButton>
        ) : null}
        <VibeButton
          variant="secondary"
          size="md"
          full
          style={{ marginTop: 12 }}
          disabled={busy || profileBusy}
          testId="auth-logout"
          onClick={async () => {
            setBusy(true)
            try {
              await logoutUser({ sessionKey })
              onLogoutAfter()
            } finally {
              setBusy(false)
            }
          }}
        >
          {t("sb.logout")}
        </VibeButton>
      </div>
    )
  }

  async function saveProfile() {
    setProfileError(null)
    const nm = profileName.trim()
    if (!nm) {
      setProfileError(t("sb.auth.err.NAME_REQUIRED"))
      return
    }
    if (nm.length > 120) {
      setProfileError(t("sb.auth.err.NAME_TOO_LONG"))
      return
    }
    setProfileBusy(true)
    try {
      await updateProfile({ sessionKey, name: nm, role: profileRole })
      setProfileEditing(false)
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : String(e)
      setProfileError(authErrMessage(raw, t))
    } finally {
      setProfileBusy(false)
    }
  }

  async function submit() {
    setFormError(null)
    const fe = buildAuthFieldErrors(mode, name, email, pass, t)
    setFieldErrors(fe)
    if (Object.keys(fe).length > 0) return

    const em = email.trim()
    const pw = pass.trim()
    const nm = name.trim()

    setBusy(true)
    try {
      if (mode === "register") {
        await registerUser({
          sessionKey,
          name: nm,
          email: em,
          password: pw,
          role,
        })
        setName("")
        setEmail("")
        setPass("")
        setFieldErrors({})
      } else {
        await loginUser({ sessionKey, email: em, password: pw })
        setEmail("")
        setPass("")
        setFieldErrors({})
      }
    } catch (e: unknown) {
      const raw = e instanceof Error ? e.message : String(e)
      setFormError(authErrMessage(raw, t))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 3,
          background: "var(--bg-sunken)",
          borderRadius: 7,
          marginBottom: 16,
        }}
      >
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            type="button"
            data-testid={m === "login" ? "auth-tab-login" : "auth-tab-register"}
            onClick={() => {
              setFormError(null)
              setFieldErrors({})
              setMode(m)
            }}
            style={{
              flex: 1,
              height: 30,
              border: "none",
              borderRadius: 5,
              background: mode === m ? "var(--bg-card)" : "transparent",
              color: mode === m ? "var(--ink)" : "var(--ink-3)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: mode === m ? "var(--shadow-sm)" : "none",
            }}
          >
            {m === "login" ? t("sb.login") : t("sb.register")}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mode === "register" ? (
          <div>
            <input
              className="vibe-store-focus"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setFieldErrors((x) => ({ ...x, name: undefined }))
              }}
              onBlur={() => {
                const fe = buildAuthFieldErrors(mode, name, email, pass, t)
                if (fe.name) setFieldErrors((x) => ({ ...x, name: fe.name }))
              }}
              placeholder={t("sb.name")}
              autoComplete="name"
              style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
              aria-invalid={fieldErrors.name ? true : undefined}
            />
            {fieldErrors.name ? (
              <div
                role="alert"
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  color: "var(--err)",
                  lineHeight: 1.35,
                }}
              >
                {fieldErrors.name}
              </div>
            ) : null}
          </div>
        ) : null}
        <div data-vibe-bug-id={mode === "register" ? "vs-03" : undefined}>
          <input
            className="vibe-store-focus"
            data-testid="auth-email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setFieldErrors((x) => ({ ...x, email: undefined }))
            }}
            onBlur={() => {
              const fe = buildAuthFieldErrors(mode, name, email, pass, t)
              if (fe.email) setFieldErrors((x) => ({ ...x, email: fe.email }))
            }}
            placeholder={t("sb.auth.emailLabel")}
            type="email"
            autoComplete="email"
            style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
            aria-invalid={fieldErrors.email ? true : undefined}
          />
          {fieldErrors.email ? (
            <div
              role="alert"
              style={{
                marginTop: 4,
                fontSize: 11,
                color: "var(--err)",
                lineHeight: 1.35,
              }}
            >
              {fieldErrors.email}
            </div>
          ) : null}
        </div>
        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
            <input
              className="vibe-store-focus"
              type={
                mode === "register"
                  ? "password"
                  : showPassword
                    ? "text"
                    : "password"
              }
              value={pass}
              onChange={(e) => {
                setPass(e.target.value)
                setFieldErrors((x) => ({ ...x, password: undefined }))
              }}
              onBlur={() => {
                const fe = buildAuthFieldErrors(mode, name, email, pass, t)
                if (fe.password)
                  setFieldErrors((x) => ({ ...x, password: fe.password }))
              }}
              placeholder={t("sb.auth.passwordPlaceholder")}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              style={{ ...inputStyle, flex: 1, minWidth: 0 }}
              aria-invalid={fieldErrors.password ? true : undefined}
            />
            <button
              type="button"
              data-password-toggle
              data-vibe-bug-id={mode === "register" ? "vs-02" : undefined}
              onClick={() => setShowPassword((v) => !v)}
              title={
                showPassword
                  ? t("sb.auth.hidePassword")
                  : t("sb.auth.showPassword")
              }
              aria-pressed={showPassword}
              style={{
                flexShrink: 0,
                width: 40,
                height: 36,
                padding: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--line)",
                borderRadius: 7,
                background: "var(--bg-card)",
                color: "var(--ink-2)",
                cursor: "pointer",
              }}
            >
              <VibeIcon
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                stroke={2}
              />
            </button>
            {mode === "login" ? (
              <button
                type="button"
                data-password-generate
                data-vibe-bug-id="vs-01"
                onClick={() => {
                  setPass(generateSandboxPassword())
                  setFieldErrors((x) => ({ ...x, password: undefined }))
                  setShowPassword(true)
                }}
                title={t("sb.auth.generatePassword")}
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 36,
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--line)",
                  borderRadius: 7,
                  background: "var(--bg-card)",
                  color: "var(--ink-2)",
                  cursor: "pointer",
                }}
              >
                <VibeIcon name="sparkles" size={17} stroke={2} />
              </button>
            ) : (
              <button
                type="button"
                data-password-generate
                onClick={() => {
                  setPass(generateSandboxPassword())
                  setFieldErrors((x) => ({ ...x, password: undefined }))
                  setShowPassword(true)
                }}
                title={t("sb.auth.generatePassword")}
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 36,
                  padding: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--line)",
                  borderRadius: 7,
                  background: "var(--bg-card)",
                  color: "var(--ink-2)",
                  cursor: "pointer",
                }}
              >
                <VibeIcon name="sparkles" size={17} stroke={2} />
              </button>
            )}
          </div>
          {fieldErrors.password ? (
            <div
              role="alert"
              style={{
                marginTop: 4,
                fontSize: 11,
                color: "var(--err)",
                lineHeight: 1.35,
              }}
            >
              {fieldErrors.password}
            </div>
          ) : null}
        </div>
        {mode === "register" ? (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 11,
              color: "var(--ink-3)",
            }}
          >
            {t("sb.auth.role")}
            <div data-vibe-bug-id="vs-04" style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  fontSize: 13,
                  color: "var(--ink)",
                  zIndex: 1,
                  fontWeight: 500,
                }}
              >
                {t("sb.auth.role.qa")}
              </div>
              <select
                className="vibe-store-focus"
                value={role}
                onChange={(e) => setRole(e.target.value as SandboxAuthRole)}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  color: "transparent",
                }}
              >
                <option value="qa">{t("sb.auth.role.qa")}</option>
                <option value="developer">{t("sb.auth.role.developer")}</option>
                <option value="manager">{t("sb.auth.role.manager")}</option>
              </select>
            </div>
          </label>
        ) : null}
      </div>
      {formError ? (
        <div
          role="alert"
          style={{
            marginTop: 10,
            fontSize: 12,
            color: "var(--err)",
            lineHeight: 1.4,
          }}
        >
          {formError}
        </div>
      ) : null}
      <div
        data-vibe-bug-id={mode === "login" ? "vs-05" : undefined}
        style={{ marginTop: 14 }}
      >
        <VibeButton
          variant="primary"
          full
          size="md"
          disabled={busy}
          testId={
            mode === "login" ? "auth-submit-login" : "auth-submit-register"
          }
          onClick={() => void submit()}
        >
          {mode === "login" ? t("sb.login") : t("sb.register")}
        </VibeButton>
      </div>
    </div>
  )
}

type ChatMsg = { id: string; from: string; text: string }

function ContactChat({
  t,
  onClose,
  isMobile,
  headerActions,
  bugPickFooter,
}: {
  t: (k: string) => string
  onClose: () => void
  isMobile: boolean
  headerActions?: ReactNode
  bugPickFooter?: ReactNode
}) {
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => [
    { id: "greet", from: "bot", text: t("sb.contact.greet") },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const userSendsRef = useRef(0)

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  function send() {
    if (!input.trim()) return
    const priorUserSends = userSendsRef.current
    userSendsRef.current += 1
    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      from: "user",
      text: input,
    }
    setMsgs((m) => [...m, userMsg])
    scrollToBottom()
    setInput("")
    setTimeout(() => {
      // vs-15: from second user message onward, bot reply is literal "error"
      const isBrokenReply = priorUserSends >= 1
      setMsgs((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          from: "bot",
          text: isBrokenReply
            ? "error"
            : t(
                (
                  [
                    "sb.contact.bot.0",
                    "sb.contact.bot.1",
                    "sb.contact.bot.2",
                    "sb.contact.bot.3",
                  ] as const
                )[Math.floor(Math.random() * 4)],
              ),
        },
      ])
      scrollToBottom()
    }, 800)
  }

  return (
    <div
      data-testid="chat-drawer"
      style={{
        position: "fixed",
        ...(isMobile
          ? {
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "70vh",
              maxHeight: "560px",
              borderRadius: "14px 14px 0 0",
            }
          : {
              right: 20,
              bottom: 20,
              width: 340,
              height: 440,
              borderRadius: 14,
            }),
        background: "var(--bg)",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--line)",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        data-bug-pick-ignore
        data-vibe-bug-id="vs-16"
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#bbf7d0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pulse-dot" />
          <strong style={{ fontSize: 13 }}>{t("sb.contact.title")}</strong>
        </div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          {headerActions}
          <button
            type="button"
            data-testid="chat-drawer-close"
            onClick={onClose}
            style={{
              width: 26,
              height: 26,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--ink-3)",
            }}
          >
            <VibeIcon name="x" size={14} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: 14,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {msgs.map((m) => (
          <div
            key={m.id}
            data-vibe-bug-id={
              m.from === "bot" && m.text === "error" ? "vs-15" : undefined
            }
            style={{
              alignSelf: m.from === "user" ? "flex-end" : "flex-start",
              background: m.from === "user" ? "var(--ink)" : "var(--bg-elev)",
              color: m.from === "user" ? "var(--bg)" : "var(--ink)",
              padding: "8px 11px",
              borderRadius: 10,
              border: m.from === "user" ? "none" : "1px solid var(--line)",
              fontSize: 13,
              lineHeight: 1.4,
              maxWidth: "78%",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div
        data-bug-pick-ignore
        data-vibe-bug-id="vs-16"
        style={{
          padding: 12,
          borderTop: "1px solid var(--line)",
          display: "flex",
          gap: 6,
          background: "#bbf7d0",
        }}
      >
        <input
          className="vibe-store-focus"
          data-testid="chat-message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t("sb.contact.placeholder")}
          style={{
            flex: 1,
            height: 32,
            padding: "0 12px",
            border: "1px solid var(--line)",
            borderRadius: 7,
            background: "var(--bg-elev)",
            color: "var(--ink)",
            fontSize: 12.5,
            outline: "none",
          }}
        />
        <button
          type="button"
          data-testid="chat-send"
          onClick={send}
          style={{
            height: 32,
            padding: "0 12px",
            border: "none",
            borderRadius: 7,
            background: "var(--accent-color)",
            color: "var(--accent-ink)",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {t("sb.contact.send")}
        </button>
      </div>
      {bugPickFooter ? (
        <div
          data-bug-pick-ignore
          data-vibe-bug-id="vs-16"
          style={{
            padding: "10px 14px 14px",
            borderTop: "1px solid var(--line)",
            background: "#bbf7d0",
          }}
        >
          {bugPickFooter}
        </div>
      ) : null}
    </div>
  )
}

function ChallengeBar({
  t,
  timeLeft,
  foundCount,
  totalBugs,
  onFinish,
  isMobile,
  foundBugIds,
}: {
  t: (k: string) => string
  timeLeft: number
  foundCount: number
  totalBugs: number
  onFinish: () => void
  isMobile: boolean
  foundBugIds: string[]
}) {
  const m = Math.floor(timeLeft / 60)
  const s = timeLeft % 60
  const lowTime = timeLeft < 60
  return (
    <div
      data-bug-pick-ignore
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: lowTime ? "var(--err)" : "var(--ink)",
        color: lowTime ? "#fff" : "var(--bg)",
        transition: "background .3s",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: isMobile ? "10px 16px" : "10px 24px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: isMobile ? 8 : 16,
        }}
      >
        <div
          className="mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: isMobile ? 11 : 12,
            fontWeight: 600,
          }}
        >
          <VibeIcon name="bug" size={14} stroke={2.4} />
          <span style={{ display: isMobile ? "none" : "inline" }}>
            {t("ch.modeBadge")}
          </span>
          {isMobile ? <span style={{ fontWeight: 700 }}>QA hunt</span> : null}
        </div>
        {!isMobile ? (
          <div className="mono" style={{ fontSize: 12, opacity: 0.8 }}>
            ·
          </div>
        ) : null}
        <div className="mono" style={{ fontSize: isMobile ? 11 : 12 }}>
          {t("ch.found")}:{" "}
          <span data-testid="challenge-found-count" style={{ fontWeight: 700 }}>
            {foundCount} / {totalBugs}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <div
          className="mono"
          data-testid="challenge-timer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: isMobile ? 12 : 13,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <VibeIcon name="clock" size={13} />
          {t("ch.timer")}: {String(m).padStart(2, "0")}:
          {String(s).padStart(2, "0")}
        </div>
        <button
          type="button"
          data-testid="challenge-finish-early"
          onClick={onFinish}
          style={{
            height: 28,
            padding: "0 12px",
            background: "rgba(255,255,255,.15)",
            color: "inherit",
            border: "1px solid rgba(255,255,255,.3)",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 11.5,
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <VibeIcon name="flag" size={11} /> {t("ch.finish")}
        </button>
      </div>
      {isMobile ? (
        <details
          style={{
            margin: 0,
            padding: "0 16px 12px",
            borderTop: "1px solid rgba(255,255,255,.18)",
          }}
        >
          <summary
            style={{
              cursor: "pointer",
              padding: "10px 0 6px",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              listStyle: "none",
            }}
          >
            {t("ch.huntProgress")}
          </summary>
          <BugAreaHintPanel t={t} foundBugIds={foundBugIds} embedded />
        </details>
      ) : null}
    </div>
  )
}

function BugAreaHintPanel({
  t,
  foundBugIds,
  embedded,
}: {
  t: (k: string) => string
  foundBugIds: string[]
  embedded?: boolean
}) {
  const rows = useMemo(() => {
    const fd = new Set(foundBugIds)
    return SB_CHALLENGE_AREAS.map((area) => {
      const inArea = SB_BUGS.filter((b) => b.area === area)
      const total = inArea.length
      const nFound = inArea.filter((b) => fd.has(b.id)).length
      return { area, total, found: nFound }
    })
  }, [foundBugIds])

  const totalPlanted = SB_BUGS.length
  const totalFound = foundBugIds.length

  return (
    <div
      style={{
        marginTop: embedded ? 0 : 14,
        padding: 14,
        background: "var(--bg-elev)",
        border: "1px solid var(--accent-line)",
        borderRadius: 12,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--accent-color)",
          textTransform: "uppercase",
          letterSpacing: 0.6,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <VibeIcon name="bug" size={11} /> {t("sb.bugPanel.title")} ·{" "}
        {totalFound}/{totalPlanted}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          maxHeight: 320,
          overflow: "auto",
        }}
      >
        {rows.map(({ area, total, found: fa }) => (
          <div
            key={area}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "8px 10px",
              border: "1px solid var(--line)",
              borderRadius: 7,
              background: "var(--bg-card)",
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 500,
                color: "var(--ink-2)",
                lineHeight: 1.3,
              }}
            >
              {t(`sb.bugArea.${area}`)}
            </span>
            <span
              className="mono"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: fa > 0 ? "var(--accent-color)" : "var(--ink-3)",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
              }}
            >
              {fa}/{total}
            </span>
          </div>
        ))}
      </div>
      <div
        className="mono"
        style={{
          fontSize: 10,
          color: "var(--ink-3)",
          marginTop: 8,
          lineHeight: 1.4,
        }}
      >
        {t("sb.bugPanel.footer")}
      </div>
    </div>
  )
}

function CheckoutJokeModal({
  t,
  isMobile,
  onClose,
}: {
  t: (k: string) => string
  isMobile: boolean
  onClose: () => void
}) {
  return (
    <ModalShell onClose={onClose} isMobile={isMobile}>
      <div
        data-checkout-joke-modal
        style={{
          padding: isMobile ? 18 : 26,
          maxWidth: isMobile ? "100%" : 440,
        }}
      >
        <h2
          id="checkout-joke-title"
          style={{
            fontSize: 18,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.25,
            color: "var(--ink)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {t("sb.cart.checkoutModal.title")}
        </h2>
        <p
          style={{
            marginTop: 12,
            marginBottom: 0,
            fontSize: 14,
            lineHeight: 1.55,
            color: "var(--ink-2)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {t("sb.cart.checkoutModal.body")}
        </p>
        <VibeButton
          variant="primary"
          full
          size="md"
          style={{ marginTop: 22 }}
          onClick={onClose}
        >
          {t("sb.cart.checkoutModal.close")}
        </VibeButton>
      </div>
    </ModalShell>
  )
}

function ModalShell({
  children,
  onClose,
  isMobile,
}: {
  children: ReactNode
  onClose?: () => void
  isMobile?: boolean
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? 12 : 20,
        animation: "vibe-fade-in .2s",
        ...(onClose
          ? {}
          : {
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }),
      }}
    >
      {onClose ? (
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            border: "none",
            margin: 0,
            padding: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            cursor: "pointer",
          }}
        />
      ) : null}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          zIndex: 1,
          background: "var(--bg)",
          borderRadius: 16,
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--line)",
          maxHeight: "90vh",
          width: isMobile ? "min(100%, 100vw - 24px)" : undefined,
          maxWidth: isMobile ? "100%" : undefined,
          overflow: "auto",
          animation: "vibe-pop-in .25s cubic-bezier(.2,.7,.3,1.2)",
        }}
      >
        {children}
      </div>
      <style>{`@keyframes vibe-fade-in { from { opacity: 0;} to { opacity: 1;} } @keyframes vibe-pop-in { from { transform: scale(.92); opacity: 0;} to { transform: scale(1); opacity: 1;} }`}</style>
    </div>
  )
}

function ChallengeStartModal({
  uiLang,
  t,
  totalBugs,
  onStart,
  onCancel,
  isMobile,
}: {
  uiLang: AppLocale
  t: (k: string) => string
  totalBugs: number
  onStart: () => void
  onCancel: () => void
  isMobile: boolean
}) {
  const list = vibeChallengeModalRules(uiLang)
  const lede =
    totalBugs > 0
      ? t("ch.modal.ledeWithCount").replace("{n}", String(totalBugs))
      : t("ch.modal.ledeZero")

  return (
    <ModalShell onClose={onCancel} isMobile={isMobile}>
      <div
        style={{
          padding: isMobile ? 18 : 28,
          maxWidth: isMobile ? "100%" : 480,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--accent-color)",
            letterSpacing: 0.6,
            textTransform: "uppercase",
            marginBottom: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <VibeIcon name="bug" size={12} /> QA challenge
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: -0.5,
            lineHeight: 1.15,
          }}
        >
          {t("ch.modal.title")}
        </h2>
        <p
          style={{
            marginTop: 12,
            fontSize: 14.5,
            color: "var(--ink-2)",
            lineHeight: 1.55,
          }}
        >
          {lede}
        </p>
        <ul
          style={{
            margin: "20px 0 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {list.map((r, i) => (
            <li
              key={r}
              style={{
                fontSize: 13,
                color: "var(--ink-2)",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <span
                className="mono"
                style={{
                  color: "var(--accent-color)",
                  fontWeight: 700,
                  marginTop: 1,
                }}
              >
                0{i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
          <VibeButton variant="ghost" onClick={onCancel}>
            {t("ch.modal.cancel")}
          </VibeButton>
          <div style={{ flex: 1 }} />
          <VibeButton
            variant="accent"
            iconRight="arrow-right"
            onClick={onStart}
            size="md"
          >
            {t("ch.modal.go")}
          </VibeButton>
        </div>
      </div>
    </ModalShell>
  )
}

function ChallengeLeaveConfirm({
  t,
  onCancel,
  onConfirm,
  isMobile,
}: {
  t: (k: string) => string
  onCancel: () => void
  onConfirm: () => void
  isMobile: boolean
}) {
  return (
    <ModalShell onClose={onCancel} isMobile={isMobile}>
      <div
        style={{
          padding: isMobile ? 18 : 28,
          maxWidth: isMobile ? "100%" : 500,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: isMobile ? 22 : 24,
            fontWeight: 600,
            letterSpacing: -0.5,
            lineHeight: 1.15,
          }}
        >
          {t("ch.leave.title")}
        </h2>
        <p
          style={{
            marginTop: 12,
            marginBottom: 0,
            fontSize: 14.5,
            color: "var(--ink-2)",
            lineHeight: 1.55,
          }}
        >
          {t("ch.leave.body")}
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          <VibeButton variant="ghost" onClick={onCancel}>
            {t("ch.leave.cancel")}
          </VibeButton>
          <div style={{ flex: 1 }} />
          <VibeButton variant="accent" onClick={onConfirm}>
            {t("ch.leave.go")}
          </VibeButton>
        </div>
      </div>
    </ModalShell>
  )
}

function ChallengeResults({
  t,
  foundCount,
  totalBugs,
  timeLeft,
  onRunAuto,
  onSkip,
  finishedEarly,
  isMobile,
}: {
  t: (k: string) => string
  foundCount: number
  totalBugs: number
  timeLeft: number
  onRunAuto: () => void
  onSkip: () => void
  finishedEarly: boolean
  isMobile: boolean
}) {
  const pct = totalBugs > 0 ? Math.round((foundCount / totalBugs) * 100) : 0
  const splitPraise =
    totalBugs === 0
      ? "res.split.zero"
      : foundCount / totalBugs > 0.5
        ? "res.split.high"
        : "res.split.low"
  const m = Math.floor(timeLeft / 60)
  const s = timeLeft % 60
  const used = CHALLENGE_SEC - timeLeft
  const um = Math.floor(used / 60)
  const us = used % 60

  return (
    <ModalShell isMobile={isMobile}>
      <div
        style={{
          padding: isMobile ? 18 : 32,
          maxWidth: isMobile ? "100%" : 560,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--accent-color)",
            letterSpacing: 0.6,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          {t("res.runComplete")}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: -0.6,
            lineHeight: 1.15,
          }}
        >
          {finishedEarly ? t("res.title.early") : t("res.title")}
        </h2>
        <p style={{ marginTop: 10, fontSize: 14.5, color: "var(--ink-2)" }}>
          {t(splitPraise)}
        </p>

        <div
          style={{
            marginTop: 24,
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "1.5fr 1fr 1fr",
            gap: 0,
            border: "1px solid var(--line)",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--bg-elev)",
          }}
        >
          <div
            style={{
              padding: "16px 18px",
              borderRight: isMobile ? "none" : "1px solid var(--line)",
              borderBottom: isMobile ? "1px solid var(--line)" : "none",
              gridColumn: isMobile ? "span 2" : undefined,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10.5,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {t("res.found")}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 4,
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  fontFamily: "var(--font-display)",
                  letterSpacing: -1,
                  color: "var(--accent-color)",
                }}
              >
                {foundCount}
              </span>
              <span style={{ fontSize: 16, color: "var(--ink-3)" }}>
                {t("res.of")} {totalBugs} {t("res.bugs")}
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                height: 4,
                background: "var(--bg-sunken)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${pct}%`,
                  height: "100%",
                  background: "var(--accent-color)",
                  borderRadius: 4,
                  transition: "width .8s",
                }}
              />
            </div>
          </div>
          <div
            style={{
              padding: "16px 18px",
              borderRight: isMobile
                ? "1px solid var(--line)"
                : "1px solid var(--line)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10.5,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {t("res.timeLeft")}
            </div>
            <div
              className="mono"
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginTop: 6,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div
              className="mono"
              style={{
                fontSize: 10.5,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {t("res.timeUsed")}
            </div>
            <div
              className="mono"
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginTop: 6,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(um).padStart(2, "0")}:{String(us).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 8,
            alignItems: isMobile ? "stretch" : "center",
          }}
        >
          <VibeButton
            variant="ghost"
            onClick={onSkip}
            icon="x"
            testId="challenge-results-skip"
          >
            {t("res.skip")}
          </VibeButton>
          {!isMobile ? <div style={{ flex: 1 }} /> : null}
          <VibeButton
            variant="accent"
            size="lg"
            onClick={onRunAuto}
            iconRight="play-line"
            full={isMobile}
            testId="challenge-results-run-auto"
          >
            {t("res.runAuto")}
          </VibeButton>
        </div>
      </div>
    </ModalShell>
  )
}
