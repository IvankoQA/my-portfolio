"use client"

import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks/use-is-mobile"
import type { AppLocale } from "@/lib/i18n/locale"
import { vibeSandboxT } from "@/lib/i18n/vibe-sandbox-strings"
import { VIBE_AUTO_TEST_RUN } from "@/lib/sandbox/vibe-auto-tests"
import { SB_BUGS } from "@/lib/sandbox/vibe-store-data"
import { VibeButton, VibeIcon } from "./vibe-sandbox-ui-bits"

type Props = {
  lang: AppLocale
  foundBugIds: string[]
  onBack: () => void
}

export function VibeAutoTestReport({ lang, foundBugIds, onBack }: Props) {
  const t = (key: string) => vibeSandboxT(lang, key)
  const isMobile = useIsMobile()
  const foundBugSet = new Set(foundBugIds)
  const bugTitleLang = lang === "uk" ? "ua" : "en"
  const foundCount = SB_BUGS.filter((bug) => foundBugSet.has(bug.id)).length
  const missedCount = SB_BUGS.length - foundCount
  const [targetRunMs] = useState(() => 5200 + Math.round(Math.random() * 4300))
  const [phase, setPhase] = useState<"running" | "done">(() => {
    if (typeof window === "undefined") return "running"
    return window.sessionStorage.getItem("vibe_sandbox_view_v1") === "auto"
      ? "done"
      : "running"
  })
  const [shownDurationMs, setShownDurationMs] = useState(0)
  const reportIframeRef = useRef<HTMLIFrameElement | null>(null)

  function patchEmbeddedReport() {
    const iframe = reportIframeRef.current
    const doc = iframe?.contentDocument
    if (!doc) return

    // Playwright report shows "M/D/YYYY, H:MM:SS AM/PM" near the top.
    const dateRegex =
      /\b\d{1,2}\/\d{1,2}\/\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+(?:AM|PM)\b/

    const all = Array.from(doc.querySelectorAll<HTMLElement>("*"))
    for (const el of all) {
      const txt = (el.textContent ?? "").trim()
      if (txt && dateRegex.test(txt)) {
        el.style.display = "none"
      }
    }

    // Keep wording focused on manual testing vs auto tests.
    const replacements: Array<[string, string]> = [
      ["HUMAN VS ROBOT", "MANUAL TESTING VS AUTOTESTS"],
      ["Human vs robot", "Manual testing vs automated tests"],
      ["ЛЮДИНА ПРОТИ РОБОТА", "РУЧНЕ ТЕСТУВАННЯ VS АВТОТЕСТИ"],
      ["Людина проти робота", "Ручне тестування vs автотести"],
    ]
    for (const el of all) {
      const text = el.textContent
      if (!text) continue
      let next = text
      for (const [from, to] of replacements) {
        next = next.split(from).join(to)
      }
      if (next !== text) {
        el.textContent = next
      }
    }

    // Keep trace links canonical even after navigating within trace viewer.
    const links = Array.from(doc.querySelectorAll<HTMLAnchorElement>("a[href]"))
    for (const link of links) {
      const href = link.getAttribute("href") ?? ""
      if (!href.includes("index.html?trace=")) continue
      const normalized = href.replace(
        /\/sandbox-test-report\/(?:trace\/)+index\.html\?trace=/,
        "/sandbox-test-report/trace/index.html?trace=",
      )
      const absolute = new URL(normalized, window.location.origin)
      const traceValue = absolute.searchParams.get("trace")
      if (traceValue) {
        link.setAttribute(
          "href",
          `/sandbox-test-report/open-trace?trace=${encodeURIComponent(traceValue)}`,
        )
      } else {
        link.setAttribute("href", normalized)
      }
      link.setAttribute("target", "_blank")
      link.setAttribute("rel", "noopener noreferrer")
    }
  }

  useEffect(() => {
    if (phase === "done") {
      setShownDurationMs(targetRunMs)
      return
    }
    const startedAt = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startedAt
      setShownDurationMs(Math.min(elapsed, targetRunMs))
    }
    tick()
    const intervalId = setInterval(tick, 100)
    const doneTimeoutId = window.setTimeout(() => {
      setShownDurationMs(targetRunMs)
      setPhase("done")
    }, targetRunMs)
    return () => {
      clearInterval(intervalId)
      window.clearTimeout(doneTimeoutId)
    }
  }, [phase, targetRunMs])

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        padding: isMobile ? "16px 16px 24px" : "24px 24px 24px",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <div
          style={{
            borderBottom: "1px solid var(--line)",
            paddingBottom: 12,
            marginBottom: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              minWidth: 0,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={onBack}
              style={{
                height: 30,
                padding: "0 10px",
                border: "1px solid var(--line)",
                background: "var(--bg-elev)",
                color: "var(--ink-2)",
                borderRadius: 7,
                cursor: "pointer",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <VibeIcon name="arrow-left" size={12} />
              {t("auto.back")}
            </button>
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                whiteSpace: "nowrap",
              }}
            >
              {t("auto.context")}
            </div>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? 23 : 28,
              fontWeight: 600,
              letterSpacing: -0.8,
              lineHeight: 1.1,
              textAlign: "left",
            }}
          >
            {t("auto.title")}
          </h1>
        </div>

        {phase === "running" && (
          <div style={{ marginBottom: 24 }}>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}
            >
              {Math.round((shownDurationMs / targetRunMs) * 100)}%
            </div>
            <div
              style={{
                height: 4,
                background: "var(--bg-sunken)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(shownDurationMs / targetRunMs) * 100}%`,
                  height: "100%",
                  background: "var(--accent-color)",
                  transition: "width .15s linear",
                }}
              />
            </div>
          </div>
        )}

        <div
          style={{
            marginBottom: 16,
            background: "var(--bg-elev)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: isMobile ? 10 : 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? 14 : 15,
                fontWeight: 600,
              }}
            >
              {t("auto.bugs.title")}
            </h2>
            <span
              className="mono"
              style={{
                fontSize: 10.5,
                color: "var(--ink-3)",
              }}
            >
              {t("auto.bugs.foundCount")
                .replace("{found}", String(foundCount))
                .replace("{total}", String(SB_BUGS.length))}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 6,
              maxHeight: isMobile ? 230 : 280,
              overflowY: "auto",
              paddingRight: 2,
            }}
          >
            {SB_BUGS.map((bug) => {
              const isFound = foundBugSet.has(bug.id)
              return (
                <div
                  key={bug.id}
                  style={{
                    border: "1px solid var(--line)",
                    borderColor: isFound ? "var(--accent-line)" : "var(--line)",
                    background: isFound
                      ? "var(--accent-soft)"
                      : "var(--bg-card)",
                    borderRadius: 8,
                    padding: "6px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      className="mono"
                      style={{ fontSize: 10.5, color: "var(--ink-3)" }}
                    >
                      {bug.id}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--ink)",
                        lineHeight: 1.4,
                      }}
                    >
                      {bug.title[bugTitleLang]}
                    </div>
                  </div>
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: isFound ? "var(--accent-color)" : "var(--ink-3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isFound
                      ? t("auto.bugs.status.found")
                      : t("auto.bugs.status.missed")}
                  </span>
                </div>
              )
            })}
          </div>

          <div
            style={{
              marginTop: 10,
              paddingTop: 8,
              borderTop: "1px solid var(--line)",
              display: "grid",
              gap: 4,
            }}
          >
            <div
              style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.45 }}
            >
              {t("auto.bugs.praise")}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--ink-3)",
                lineHeight: 1.45,
              }}
            >
              {t("auto.bugs.reportHint")
                .replace("{missed}", String(missedCount))
                .replace("{trace}", "View Trace")}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-elev)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: "12px 0",
            marginBottom: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 12.5,
          }}
        >
          <div
            style={{
              padding: "0 18px 10px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderBottom: "1px solid var(--line)",
              color: "var(--ink-3)",
              fontSize: 11,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#fc625d",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#fdbc40",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                background: "#34c749",
              }}
            />
            <span style={{ marginLeft: 12 }}>
              $ {VIBE_AUTO_TEST_RUN.command}
            </span>
          </div>
          <div style={{ maxHeight: 520, overflow: "hidden", padding: 0 }}>
            {phase === "running" ? (
              <div
                style={{
                  padding: "8px 14px",
                  color: "var(--ink-3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  minHeight: 36,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                <span
                  className="pulse-dot"
                  style={{ width: 6, height: 6, display: "inline-block" }}
                />
                <span>{t("auto.runningLine")} …</span>
              </div>
            ) : (
              <iframe
                title="Sandbox auto tests report"
                src="/sandbox-test-report/index.html"
                ref={reportIframeRef}
                onLoad={() => {
                  // Patch report labels + hide run timestamp.
                  try {
                    patchEmbeddedReport()
                    // Report UI may render pieces a bit after iframe load.
                    window.setTimeout(() => patchEmbeddedReport(), 350)
                    window.setTimeout(() => patchEmbeddedReport(), 900)
                  } catch {
                    // ignore (best-effort)
                  }
                }}
                style={{
                  width: "100%",
                  height: isMobile ? 440 : 520,
                  border: 0,
                  display: "block",
                  background: "white",
                }}
              />
            )}
          </div>
        </div>

        {phase === "done" && (
          <div
            style={{
              paddingTop: 12,
              marginTop: 8,
              borderTop: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13.5,
                color: "var(--ink-2)",
                lineHeight: 1.45,
                textAlign: "left",
                flex: "1 1 320px",
              }}
            >
              {t("auto.outro")}
            </p>
            <div
              style={{
                display: "inline-flex",
                gap: 8,
                marginLeft: isMobile ? 0 : 12,
              }}
            >
              <VibeButton variant="primary" onClick={onBack}>
                {t("auto.cta.home")}
              </VibeButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
