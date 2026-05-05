"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { getLocaleFromPathname, localizePath } from "@/lib/i18n/locale"

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
  const isSandboxPage =
    pathname === sandboxPath || pathname === `${sandboxPath}/`

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
              ivan-kozenko
              <span style={{ color: "var(--ink-3)" }}>-aqa</span>
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
          {[
            { href: fitHref, label: isUk ? "Аналіз CV" : "CV fit" },
            { href: contactHref, label: isUk ? "Контакти" : "Contact" },
          ].map(({ href, label }) => (
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
            title={
              themeMounted
                ? isDark
                  ? "Switch to light"
                  : "Switch to dark"
                : "Switch to dark"
            }
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

          {!isSandboxPage ? (
            <Link
              href={sandboxPath}
              title={
                isUk
                  ? "Спробувати себе в ролі тестувальника"
                  : "Try yourself as a QA tester"
              }
              aria-label={
                isUk
                  ? "Спробувати себе в ролі тестувальника"
                  : "Try yourself as a QA tester"
              }
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
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLElement).style.opacity = "0.88"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLElement).style.opacity = "1"
              }}
            >
              {isMobile ? (
                <ArrowRightIcon />
              ) : (
                <>
                  {isUk
                    ? "Спробувати себе в ролі тестувальника"
                    : "Try yourself as a QA tester"}
                  <ArrowRightIcon />
                </>
              )}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}
