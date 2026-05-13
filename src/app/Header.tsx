"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { getLocaleFromPathname, localizePath } from "@/lib/i18n/locale"
import {
  isPlaywrightLearnPath,
  learnIndexHref,
} from "@/lib/playwright-learn/paths"

function GlobeIcon() {
  return (
    <svg
      aria-hidden={true}
      width={12}
      height={12}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      aria-hidden={true}
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      aria-hidden={true}
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden={true}
      width={13}
      height={13}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

type MarkBugState = {
  visible: boolean
  count: number
  pickBugMode: boolean
}

type MarkBugControlProps = {
  state: MarkBugState
  onToggle: () => void
}

function MarkBugControl({ state, onToggle }: Readonly<MarkBugControlProps>) {
  return (
    <div
      data-bug-pick-ignore
      style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
    >
      <button
        type="button"
        data-testid="mark-bug-toggle"
        aria-pressed={state.pickBugMode}
        title="Mark bug"
        onClick={onToggle}
        style={{
          height: 30,
          padding: "0 10px",
          border: state.pickBugMode
            ? "1px solid var(--accent-color)"
            : "1px solid var(--line)",
          borderRadius: 7,
          background: state.pickBugMode ? "var(--accent-soft)" : "transparent",
          color: state.pickBugMode ? "var(--accent-color)" : "var(--ink-2)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11.5,
          fontWeight: 600,
          fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
          whiteSpace: "nowrap",
        }}
      >
        Mark bug
      </button>
      <span
        className="mono"
        title="Elements you marked on the page"
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "var(--ink-2)",
          minWidth: 22,
          textAlign: "center",
        }}
      >
        {state.count}
      </span>
    </div>
  )
}

type SandboxCtaProps = {
  isUk: boolean
  isMobile: boolean
  href: string
}

function SandboxCta({ isUk, isMobile, href }: Readonly<SandboxCtaProps>) {
  const label = isUk
    ? "Спробувати себе в ролі тестувальника"
    : "Try yourself as a QA tester"

  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      style={{
        height: 30,
        padding: isMobile ? "0 10px" : "0 12px",
        fontSize: 12,
        fontWeight: 500,
        background: "var(--accent-color)",
        color: "var(--accent-ink)",
        border: "1px solid var(--accent-color)",
        borderRadius: 8,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={(event) => {
        ;(event.currentTarget as HTMLElement).style.opacity = "0.88"
      }}
      onMouseLeave={(event) => {
        ;(event.currentTarget as HTMLElement).style.opacity = "1"
      }}
    >
      {isMobile ? (
        <ArrowRightIcon />
      ) : (
        <>
          {label}
          <ArrowRightIcon />
        </>
      )}
    </Link>
  )
}

function dispatchMarkBugToggle() {
  globalThis.dispatchEvent(new Event("sandbox-mark-bug-toggle"))
}

function getHeaderNavItems(
  isUk: boolean,
  fitHref: string,
  contactHref: string,
  learnHref: string,
) {
  return [
    { href: fitHref, label: isUk ? "Аналіз CV" : "CV fit" },
    { href: contactHref, label: isUk ? "Контакти" : "Contact" },
    {
      href: learnHref,
      label: isUk ? "Навчання" : "Learn",
    },
  ]
}

type LearnMobileCtaProps = {
  isUk: boolean
  href: string
}

function LearnMobileCta({ isUk, href }: Readonly<LearnMobileCtaProps>) {
  const label = isUk ? "Навчання" : "Learn"
  return (
    <Link
      href={href}
      data-testid="header-learn-mobile-cta"
      aria-label={label}
      style={{
        height: 30,
        padding: "0 10px",
        fontSize: 12,
        fontWeight: 500,
        background: "transparent",
        color: "var(--ink-2)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {label}
    </Link>
  )
}

function useSandboxMarkBugState(isSandboxPage: boolean) {
  const [markBugState, setMarkBugState] = useState<MarkBugState>({
    visible: false,
    count: 0,
    pickBugMode: false,
  })

  useEffect(() => {
    if (!globalThis.window) return
    const onMarkBugState = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          visible?: boolean
          count?: number
          pickBugMode?: boolean
        }>
      ).detail
      if (!detail) return
      setMarkBugState({
        visible: detail.visible ?? false,
        count: detail.count ?? 0,
        pickBugMode: detail.pickBugMode ?? false,
      })
    }
    globalThis.addEventListener("sandbox-mark-bug-state", onMarkBugState)
    return () =>
      globalThis.removeEventListener("sandbox-mark-bug-state", onMarkBugState)
  }, [])

  useEffect(() => {
    if (isSandboxPage) return
    setMarkBugState({ visible: false, count: 0, pickBugMode: false })
  }, [isSandboxPage])

  return markBugState
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = getLocaleFromPathname(pathname)
  const isUk = locale === "uk"
  const { resolvedTheme, setTheme } = useTheme()
  const [themeMounted, setThemeMounted] = useState(false)
  useEffect(() => {
    setThemeMounted(true)
  }, [])
  const isDark = themeMounted && resolvedTheme === "dark"
  const isMobile = useIsMobile()

  function toggleLang() {
    const next = isUk ? "en" : "uk"
    router.push(localizePath(pathname || "/", next))
  }

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const sandboxPath = localizePath("/sandbox", locale)
  const homeHref = localizePath("/", locale)
  const fitHref = `${homeHref}#fit`
  const contactHref = `${homeHref}#contact`
  const learnHref = learnIndexHref(locale)
  const isSandboxPage =
    pathname === sandboxPath || pathname === `${sandboxPath}/`
  const isLearnPage = isPlaywrightLearnPath(pathname)
  const markBugState = useSandboxMarkBugState(isSandboxPage)
  const navItems = getHeaderNavItems(isUk, fitHref, contactHref, learnHref)

  let themeTitle = "Switch to dark"
  if (themeMounted && isDark) {
    themeTitle = "Switch to light"
  }
  const shouldShowMarkBugControl = isSandboxPage && markBugState.visible

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        width: "100%",
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
          alignItems: "center",
          justifyContent: "flex-start",
          gap: isMobile ? 8 : 20,
        }}
      >
        {/* Logo */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Link
            href={localizePath("/", locale)}
            aria-label={isUk ? "Додому" : "Home"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: isMobile ? 6 : 10,
              fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
              fontSize: isMobile ? 12 : 13,
              fontWeight: 600,
              letterSpacing: -0.2,
              color: "var(--ink)",
              minWidth: 0,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: "var(--ink)",
                color: "var(--bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily:
                  "var(--font-jetbrains-mono, ui-monospace, monospace)",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              IK
            </span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              ivan-kozenko <span style={{ color: "var(--ink-3)" }}>-aqa</span>
            </span>
          </Link>
        </div>

        {/* Nav — hidden on small viewports to keep one row */}
        <nav
          style={{
            display: isMobile ? "none" : "flex",
            gap: 4,
            alignItems: "center",
            marginLeft: 12,
          }}
        >
          {navItems.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{
                padding: "7px 12px",
                fontSize: 13,
                color: "var(--ink-2)",
                borderRadius: 6,
                fontWeight: 450,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.background =
                  "var(--chip-bg)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.background =
                  "transparent"
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          {shouldShowMarkBugControl ? (
            <MarkBugControl
              state={markBugState}
              onToggle={dispatchMarkBugToggle}
            />
          ) : null}

          <button
            type="button"
            data-testid="locale-toggle"
            onClick={toggleLang}
            className="mono"
            style={{
              height: 30,
              padding: "0 10px",
              border: "1px solid var(--line)",
              borderRadius: 7,
              background: "transparent",
              color: "var(--ink-2)",
              fontSize: 11.5,
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <GlobeIcon /> {isUk ? "UA" : "EN"}
          </button>

          <button
            type="button"
            data-testid="theme-toggle"
            onClick={toggleTheme}
            title={themeTitle}
            aria-label="Toggle color theme"
            style={{
              height: 30,
              width: 30,
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
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {isMobile && !isLearnPage ? (
            <LearnMobileCta isUk={isUk} href={learnHref} />
          ) : null}

          {isSandboxPage ? null : (
            <SandboxCta isUk={isUk} isMobile={isMobile} href={sandboxPath} />
          )}
        </div>
      </div>
    </header>
  )
}
