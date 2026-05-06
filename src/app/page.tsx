"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getLocaleFromPathname, localizePath } from "@/lib/i18n/locale"
import { CV } from "@/lib/cv-data"
import { useT, type AppLang } from "@/lib/i18n/strings"
import type { JdMatchOkBody } from "@/lib/jd-match-api-types"
import { analyzeJD, type JdResult } from "@/lib/jd-matcher"
import { useIsMobile } from "@/hooks/use-is-mobile"

// ─── Icon primitives ────────────────────────────────────────
type IconName =
  | "arrow-right"
  | "copy"
  | "check"
  | "x"
  | "target"
  | "spark"
  | "upload"
  | "download"
  | "mail"
  | "linkedin"
  | "github"
  | "telegram"
  | "youtube"

function SvgWithTitle({
  accessibleName,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"svg"> & {
  accessibleName: string
  children: React.ReactNode
}) {
  return (
    <svg {...rest}>
      <title>{accessibleName}</title>
      {children}
    </svg>
  )
}

function Icon({
  name,
  size = 16,
  stroke = 1.7,
  style: extra = {},
}: Readonly<{
  name: IconName
  size?: number
  stroke?: number
  style?: React.CSSProperties
}>) {
  const c = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style: extra,
  }
  switch (name) {
    case "arrow-right":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </SvgWithTitle>
      )
    case "copy":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </SvgWithTitle>
      )
    case "check":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <path d="M5 13l4 4L19 7" />
        </SvgWithTitle>
      )
    case "x":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <path d="M6 6l12 12M18 6L6 18" />
        </SvgWithTitle>
      )
    case "target":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </SvgWithTitle>
      )
    case "spark":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4" />
        </SvgWithTitle>
      )
    case "upload":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </SvgWithTitle>
      )
    case "download":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </SvgWithTitle>
      )
    case "mail":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </SvgWithTitle>
      )
    case "linkedin":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 17v-7" />
        </SvgWithTitle>
      )
    case "github":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <path d="M9 19c-4 1.5-4-2-6-2.5M15 22v-3.87a3.4 3.4 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.75 5 5 0 0 0-.09-3.77S17.5 3 15 4.77a13 13 0 0 0-7 0C5.5 3 4.09 3.5 4.09 3.5a5 5 0 0 0-.09 3.77 5.44 5.44 0 0 0-1.5 3.75c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 21.13V22" />
        </SvgWithTitle>
      )
    case "telegram":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <path d="M21 4L2 11l5 2 9-7-7 9 8 6z" />
        </SvgWithTitle>
      )
    case "youtube":
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <rect x="2" y="6" width="20" height="12" rx="3" />
          <path d="M10 9v6l5-3z" fill="currentColor" stroke="none" />
        </SvgWithTitle>
      )
    default:
      return (
        <SvgWithTitle {...c} accessibleName={name}>
          <circle cx="12" cy="12" r="3" />
        </SvgWithTitle>
      )
  }
}

// ─── Chip ────────────────────────────────────────────────────
function Chip({
  children,
  accent = false,
  sm = false,
  title,
}: Readonly<{
  children: React.ReactNode
  accent?: boolean
  sm?: boolean
  title?: string
}>) {
  return (
    <span
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: sm ? "3px 8px" : "5px 10px",
        fontSize: sm ? 11 : 12,
        lineHeight: 1,
        fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
        borderRadius: 999,
        background: accent ? "var(--accent-soft)" : "var(--chip-bg)",
        color: accent ? "var(--accent-color)" : "var(--ink-2)",
        border: accent
          ? "1px solid var(--accent-line)"
          : "1px solid var(--line)",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  )
}

// ─── Section header ──────────────────────────────────────────
function SectionHeader({
  eyebrow,
  title,
  sub,
}: Readonly<{
  eyebrow?: string
  title: string
  sub?: string
}>) {
  return (
    <div style={{ marginBottom: 24 }}>
      {eyebrow && (
        <div
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--ink-3)",
            letterSpacing: 0.4,
            marginBottom: 8,
            textTransform: "lowercase",
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: -0.6,
          lineHeight: 1.1,
          color: "var(--ink)",
        }}
      >
        {title}
      </h2>
      {sub && (
        <div
          style={{
            marginTop: 6,
            color: "var(--ink-3)",
            fontSize: 14,
            maxWidth: 540,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  )
}

// ─── Skill chip ──────────────────────────────────────────────
function SkillChip({ s }: Readonly<{ s: (typeof CV.skills)[number] }>) {
  let weightColor = "var(--ink-4)"
  if (s.weight === 3) {
    weightColor = "var(--accent-color)"
  } else if (s.weight === 2) {
    weightColor = "var(--ink-3)"
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 11px",
        borderRadius: 7,
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        fontSize: 12.5,
        fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
        color: "var(--ink-2)",
        letterSpacing: -0.1,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: 5,
          background: weightColor,
        }}
      />
      {s.label}
    </span>
  )
}

// ─── Stats bar ───────────────────────────────────────────────
function Stats({ t }: Readonly<{ t: ReturnType<typeof useT> }>) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      {CV.stats.map((s, i) => (
        <div
          key={s.labelKey}
          style={{
            padding: "16px 18px",
            borderRight: i < 1 ? "1px solid var(--line)" : "none",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: -1,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {s.value}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              marginTop: 6,
              letterSpacing: 0.2,
            }}
          >
            {t(s.labelKey as Parameters<typeof t>[0])}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Experience item ─────────────────────────────────────────
function ExperienceItem({
  x,
  lang,
  isMobile,
}: Readonly<{
  x: (typeof CV.experience)[number]
  lang: AppLang
  isMobile: boolean
}>) {
  const l = lang === "uk" ? "ua" : "en"
  const to =
    typeof x.to === "string"
      ? x.to
      : ((x.to as Record<string, string>)[l] ??
        (x.to as Record<string, string>).en)
  const role = (x.role as Record<string, string>)[l] ?? x.role.en
  const bullets = (x.bullets as Record<string, string[]>)[l] ?? x.bullets.en
  return (
    <article
      style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "180px 1fr",
        gap: isMobile ? 14 : 24,
        padding: "20px 0",
        borderTop: "1px solid var(--line)",
      }}
    >
      <div>
        <div
          className="mono"
          style={{ fontSize: 12, color: "var(--ink-3)", letterSpacing: 0.2 }}
        >
          {x.from} → {to}
        </div>
        {x.domainKey && (
          <div style={{ marginTop: 8 }}>
            <Chip sm>{x.domainKey}</Chip>
          </div>
        )}
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 4,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: -0.2,
            }}
          >
            {x.company}
          </h3>
          <span style={{ color: "var(--ink-3)", fontSize: 14 }}>· {role}</span>
        </div>
        <ul
          style={{
            margin: "10px 0 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {bullets.map((b) => (
            <li
              key={b}
              style={{
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "var(--ink-2)",
                paddingLeft: 16,
                position: "relative",
              }}
            >
              <span
                className="mono"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  color: "var(--ink-4)",
                }}
              >
                ›
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

const contactCardShell: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "14px 16px",
  borderRadius: 10,
  background: "var(--bg-elev)",
  border: "1px solid var(--line)",
  transition: "border-color .15s",
  minWidth: 0,
}

function contactCardHoverBorder(
  e: React.MouseEvent<HTMLElement>,
  color: string,
) {
  ;(e.currentTarget as HTMLElement).style.borderColor = color
}

// ─── Contact card ────────────────────────────────────────────
function ContactCard(
  props:
    | {
        variant: "link"
        icon: IconName
        label: string
        value: string
        href: string
      }
    | {
        variant: "copy"
        icon: IconName
        label: string
        value: string
        t: ReturnType<typeof useT>
      },
) {
  const [copied, setCopied] = useState(false)

  const body = (
    <>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "var(--bg-sunken)",
          border: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink-2)",
          flexShrink: 0,
        }}
      >
        <Icon name={props.icon} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            textTransform: "lowercase",
            letterSpacing: 0.2,
          }}
        >
          {props.label}
        </div>
        <span
          style={{
            fontSize: 13.5,
            fontWeight: 500,
            color: "var(--ink)",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {props.value}
        </span>
      </div>
    </>
  )

  if (props.variant === "copy") {
    function doCopy() {
      navigator.clipboard?.writeText(props.value).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    }
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: hover-only border on card shell
      <div
        style={{ ...contactCardShell, color: "inherit" }}
        onMouseEnter={(e) => contactCardHoverBorder(e, "var(--ink)")}
        onMouseLeave={(e) => contactCardHoverBorder(e, "var(--line)")}
      >
        {body}
        <button
          type="button"
          onClick={doCopy}
          title={props.t("contact.copy")}
          style={{
            height: 28,
            padding: "0 10px",
            fontSize: 11,
            fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
            background: copied ? "var(--accent-soft)" : "transparent",
            color: copied ? "var(--accent-color)" : "var(--ink-3)",
            border: "1px solid var(--line)",
            borderRadius: 6,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            flexShrink: 0,
          }}
        >
          {copied ? (
            <>
              <Icon name="check" size={11} stroke={2.4} />{" "}
              {props.t("contact.copied")}
            </>
          ) : (
            <>
              <Icon name="copy" size={11} /> {props.t("contact.copy")}
            </>
          )}
        </button>
      </div>
    )
  }

  const openInNewTab =
    props.href.startsWith("http://") || props.href.startsWith("https://")
  return (
    <a
      href={props.href}
      {...(openInNewTab
        ? { target: "_blank", rel: "noopener noreferrer" as const }
        : {})}
      style={{
        ...contactCardShell,
        color: "inherit",
        textDecoration: "none",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => contactCardHoverBorder(e, "var(--ink)")}
      onMouseLeave={(e) => contactCardHoverBorder(e, "var(--line)")}
    >
      {body}
      {openInNewTab ? (
        <span
          aria-hidden={true}
          style={{
            flexShrink: 0,
            color: "var(--ink-4)",
            fontSize: 12,
            fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
          }}
        >
          ↗
        </span>
      ) : null}
    </a>
  )
}

// ─── Score gauge ─────────────────────────────────────────────
function ScoreGauge({
  score,
  label,
  sub,
}: Readonly<{
  score: number
  label: string
  sub: string
}>) {
  const C = 2 * Math.PI * 54
  const offset = C - (score / 100) * C
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <title>{label}</title>
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke="var(--line)"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke="var(--accent-color)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
          style={{
            transition: "stroke-dashoffset .8s cubic-bezier(.2,.7,.3,1)",
          }}
        />
        <text
          x="64"
          y="68"
          textAnchor="middle"
          fontFamily="var(--font-inter-tight, system-ui)"
          fontSize="32"
          fontWeight="600"
          fill="var(--ink)"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {score}
        </text>
        <text
          x="64"
          y="86"
          textAnchor="middle"
          fontFamily="var(--font-jetbrains-mono, ui-monospace)"
          fontSize="10"
          fill="var(--ink-3)"
          letterSpacing="1"
        >
          / 100
        </text>
      </svg>
      <div>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            letterSpacing: 0.4,
            textTransform: "lowercase",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: -0.3,
            marginTop: 4,
          }}
        >
          {sub}
        </div>
      </div>
    </div>
  )
}

// ─── Fit group ───────────────────────────────────────────────
function FitGroup({
  title,
  count,
  dotColor,
  children,
  emptyText,
}: Readonly<{
  title: string
  count: number
  dotColor: string
  children: React.ReactNode
  emptyText: string
}>) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          style={{ width: 6, height: 6, borderRadius: 6, background: dotColor }}
        />
        <span
          className="mono"
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--ink-2)",
            letterSpacing: 0.2,
          }}
        >
          {title} <span style={{ color: "var(--ink-3)" }}>({count})</span>
        </span>
      </div>
      {count > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {children}
        </div>
      ) : (
        <div
          style={{ fontSize: 12, color: "var(--ink-3)", fontStyle: "italic" }}
        >
          {emptyText}
        </div>
      )}
    </div>
  )
}

// shared mini button styles
const ghostBtn: React.CSSProperties = {
  height: 30,
  padding: "0 10px",
  gap: 6,
  fontSize: 12,
  fontWeight: 400,
  background: "transparent",
  color: "var(--ink-2)",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
}
const secondaryBtn: React.CSSProperties = {
  height: 34,
  padding: "0 14px",
  gap: 6,
  fontSize: 12,
  fontWeight: 500,
  background: "transparent",
  color: "var(--ink)",
  border: "1px solid var(--line-strong)",
  borderRadius: 8,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
}

// ─── Job-fit checker ─────────────────────────────────────────
function JobFitChecker({
  lang,
  isMobile,
}: Readonly<{
  lang: AppLang
  isMobile: boolean
}>) {
  const t = useT(lang)
  const [text, setText] = useState("")
  const [state, setState] = useState<
    "idle" | "analyzing" | "results" | "error"
  >("idle")
  const [result, setResult] = useState<JdResult | null>(null)
  const [phase, setPhase] = useState(0)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function loadSample() {
    setText(CV.sampleJD[lang === "uk" ? "ua" : "en"])
    setState("idle")
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    void f
      .text()
      .then((content) => setText(content.slice(0, 30000)))
      .catch(() => {})
  }

  function doAnalyze() {
    if (!text.trim()) return
    setState("analyzing")
    setPhase(0)
    let p = 0
    const tick = setInterval(() => {
      p += 1
      setPhase(p)
      if (p >= 2) {
        clearInterval(tick)
        setTimeout(() => {
          void (async () => {
            try {
              const res = await fetch("/api/jd-match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  text,
                  lang: lang === "uk" ? "uk" : "en",
                }),
              })
              const payload = (await res.json()) as {
                error?: string
              } & Partial<JdMatchOkBody>
              if (res.status === 422 && payload.error === "noSignals") {
                setState("error")
                return
              }
              const r = payload.result ?? analyzeJD(text, "balanced")
              if (r.error === "noSignals") {
                setState("error")
                return
              }
              setResult(r)
              setState("results")
            } catch {
              const r = analyzeJD(text, "balanced")
              if (r.error === "noSignals") {
                setState("error")
                return
              }
              setResult(r)
              setState("results")
            }
          })()
        }, 400)
      }
    }, 500)
  }

  useEffect(() => {
    if (state === "results" && text.trim()) {
      const r = analyzeJD(text, "balanced")
      if (r && !r.error) {
        setResult(r)
      }
    }
  }, [state, text])

  function reset() {
    setState("idle")
    setResult(null)
    setText("")
  }

  function copySummary() {
    if (!result) return
    const tk = (k: string) => t(k as Parameters<typeof t>[0])
    const bandLabel = t(`fit.band.${result.band}` as Parameters<typeof t>[0])
    const lines = [
      `Job-fit summary — Ivan Kozenko (${result.score}/100, ${bandLabel})`,
      `Keyword match: ${result.rawScore}/100`,
      ...result.adjustments.map((a) => `${tk(a.labelKey)} (+${a.delta})`),
      `Overall score: ${result.score}/100 (includes portfolio boosts)`,
      `Strong matches: ${result.strong.map((s) => s.label).join(", ") || "—"}`,
      `Partial / adjacent: ${
        [
          ...result.partial.map((p) => p.label),
          ...result.gaps.map((g) => g.label),
        ].join(", ") || "—"
      }`,
    ]
    navigator.clipboard?.writeText(lines.join("\n")).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const phases = [t("fit.reading"), t("fit.matching"), t("fit.scoring")]

  return (
    <div
      style={{
        borderRadius: 14,
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        overflow: "hidden",
      }}
    >
      {/* Head */}
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 8,
                background: "var(--accent-color)",
              }}
            />
            <span
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: 0.4,
              }}
            >
              {t("fit.badge.local")}
            </span>
          </div>
          <h3
            style={{
              margin: "10px 0 4px",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: -0.4,
            }}
          >
            {t("fit.title")}
          </h3>
          <div style={{ fontSize: 13.5, color: "var(--ink-3)", maxWidth: 540 }}>
            {t("fit.subtitle")}
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          padding: 24,
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: 24,
          minHeight: 380,
        }}
      >
        {/* Left: input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("fit.placeholder")}
            disabled={state === "analyzing"}
            style={{
              minHeight: 280,
              resize: "vertical",
              padding: 16,
              fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
              fontSize: 12.5,
              lineHeight: 1.55,
              background: "var(--bg-sunken)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              outline: "none",
              width: "100%",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={doAnalyze}
              disabled={!text.trim() || state === "analyzing"}
              style={{
                height: 38,
                padding: "0 16px",
                gap: 8,
                fontSize: 13,
                fontWeight: 500,
                background: "var(--accent-color)",
                color: "var(--accent-ink)",
                border: "none",
                borderRadius: 8,
                cursor:
                  text.trim() && state !== "analyzing"
                    ? "pointer"
                    : "not-allowed",
                opacity: !text.trim() || state === "analyzing" ? 0.5 : 1,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Icon name="target" size={15} />
              {state === "analyzing" ? t("fit.analyzing") : t("fit.analyze")}
            </button>
            <button type="button" onClick={loadSample} style={ghostBtn}>
              <Icon name="spark" size={13} /> {t("fit.sample")}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={ghostBtn}
            >
              <Icon name="upload" size={13} /> {t("fit.upload")}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,text/*"
              onChange={onFile}
              style={{ display: "none" }}
            />
            <div style={{ flex: 1 }} />
            {state !== "idle" && (
              <button type="button" onClick={reset} style={ghostBtn}>
                <Icon name="x" size={13} /> {t("fit.reset")}
              </button>
            )}
          </div>
        </div>

        {/* Right: state panels */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {state === "idle" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 24,
                border: "1px dashed var(--line)",
                borderRadius: 10,
                color: "var(--ink-3)",
                gap: 12,
              }}
            >
              <Icon name="target" size={28} stroke={1.4} />
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-2)" }}
              >
                {t("fit.empty.title")}
              </div>
              <div style={{ fontSize: 12.5, maxWidth: 260 }}>
                {t("fit.empty.body")}
              </div>
            </div>
          )}
          {state === "analyzing" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: 24,
                gap: 16,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--ink-3)",
                  letterSpacing: 0.5,
                }}
              >
                {/* processing */}
              </div>
              {phases.map((p, i) => {
                const isCompleted = i < phase
                const isCurrent = i === phase
                let markerBackground = "var(--bg-sunken)"
                if (isCompleted) markerBackground = "var(--ok)"
                if (isCurrent) markerBackground = "transparent"
                const markerBorder = isCurrent
                  ? "2px solid var(--accent-color)"
                  : "1px solid var(--line)"

                return (
                  <div
                    key={p}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 18,
                        background: markerBackground,
                        border: markerBorder,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isCompleted && (
                        <Icon
                          name="check"
                          size={11}
                          stroke={2.4}
                          style={{ color: "var(--bg)" }}
                        />
                      )}
                      {isCurrent && (
                        <div
                          className="spin"
                          style={{
                            width: 10,
                            height: 10,
                            border: "2px solid var(--accent-color)",
                            borderTopColor: "transparent",
                            borderRadius: 5,
                          }}
                        />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: i <= phase ? "var(--ink)" : "var(--ink-3)",
                        fontWeight: isCurrent ? 500 : 400,
                      }}
                    >
                      {p}
                    </div>
                  </div>
                )
              })}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {["60%", "85%", "70%"].map((w) => (
                  <div
                    key={w}
                    className="skel"
                    style={{ height: 12, width: w }}
                  />
                ))}
              </div>
            </div>
          )}
          {state === "error" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: 24,
                border: "1px solid var(--err)",
                borderRadius: 10,
                color: "var(--err)",
                gap: 12,
                background: "rgba(209,75,75,0.04)",
              }}
            >
              <Icon name="x" size={28} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {t("fit.error.title")}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                {t("fit.error.body")}
              </div>
              <button type="button" onClick={reset} style={secondaryBtn}>
                {t("fit.reset")}
              </button>
            </div>
          )}
          {state === "results" && result && (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <ScoreGauge
                score={result.score}
                label={t("fit.score.label")}
                sub={t(`fit.band.${result.band}` as Parameters<typeof t>[0])}
              />
              <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                {t("fit.score.based")}
              </div>
              {result.adjustments.length > 0 && (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid var(--line)",
                    background: "var(--bg-sunken)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: 0.3,
                      color: "var(--ink-2)",
                      textTransform: "uppercase",
                    }}
                  >
                    {t("fit.breakdown.title")}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--ink)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>{t("fit.breakdown.keyword")}</span>
                    <span
                      className="mono"
                      style={{ fontWeight: 600, color: "var(--ink)" }}
                    >
                      {result.rawScore}%
                    </span>
                  </div>
                  {result.adjustments.map((a) => (
                    <div
                      key={a.id}
                      style={{
                        fontSize: 12,
                        color: "var(--ink-2)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span style={{ lineHeight: 1.45 }}>
                        {t(a.labelKey as Parameters<typeof t>[0])}
                      </span>
                      <span
                        className="mono"
                        style={{
                          color: "var(--ok)",
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        +{a.delta}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <FitGroup
                  title={t("fit.match.strong")}
                  count={result.strong.length}
                  dotColor="var(--ok)"
                  emptyText={t("fit.match.none")}
                >
                  {result.strong.map((s) => (
                    <Chip key={s.id} accent>
                      {s.label}
                      {s.hits > 1 && (
                        <span style={{ opacity: 0.6 }}>·{s.hits}</span>
                      )}
                    </Chip>
                  ))}
                </FitGroup>
                <FitGroup
                  title={t("fit.match.partial")}
                  count={result.partial.length + result.gaps.length}
                  dotColor="var(--warn)"
                  emptyText={t("fit.match.none")}
                >
                  {result.partial.map((p) => (
                    <Chip
                      key={p.id}
                      title={p.note[lang === "uk" ? "ua" : "en"]}
                    >
                      {p.label}
                    </Chip>
                  ))}
                  {result.gaps.map((g) => (
                    <Chip key={`gap:${g.label}`}>
                      <span style={{ color: "var(--err)" }}>{g.label}</span>
                    </Chip>
                  ))}
                </FitGroup>
              </div>
              <div style={{ marginTop: "auto", paddingTop: 8 }}>
                <button
                  type="button"
                  onClick={copySummary}
                  style={secondaryBtn}
                >
                  <Icon name={copied ? "check" : "copy"} size={13} />
                  {copied ? t("fit.copied") : t("fit.copy")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Skill category config ───────────────────────────────────
const SKILL_CATS = [
  { id: "framework", enLabel: "Automation Frameworks", uaLabel: "Фреймворки" },
  {
    id: "language",
    enLabel: "Languages & Patterns",
    uaLabel: "Мови & патерни",
  },
  { id: "api", enLabel: "API & Data", uaLabel: "API & Data" },
  {
    id: "perf",
    enLabel: "Performance & Security",
    uaLabel: "Performance & Security",
  },
  {
    id: "infra",
    enLabel: "Infrastructure & CI/CD",
    uaLabel: "Infrastructure & CI/CD",
  },
  { id: "mgmt", enLabel: "Observability & Mgmt", uaLabel: "Менеджмент" },
  { id: "ai", enLabel: "AI & Productivity", uaLabel: "AI & Productivity" },
]

// ─── HOME PAGE ───────────────────────────────────────────────
export default function Page() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const lang: AppLang = locale === "uk" ? "uk" : "en"
  const t = useT(lang)
  const sandboxPath = localizePath("/sandbox", locale)
  const isMobile = useIsMobile()

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }} id="top">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 40px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr",
            gap: isMobile ? 32 : 60,
            alignItems: "stretch",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px 5px 8px",
                border: "1px solid var(--line)",
                borderRadius: 999,
                marginBottom: 24,
                background: "var(--bg-elev)",
              }}
            >
              <span className="pulse-dot" />
              <span
                className="mono"
                style={{
                  fontSize: 11.5,
                  color: "var(--ink-2)",
                  letterSpacing: 0.2,
                }}
              >
                {t("home.status.available")}
              </span>
            </div>
            <div
              className="mono"
              style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}
            >
              <span style={{ color: "var(--ok)" }}>$</span> whoami
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(44px, 6vw, 84px)",
                lineHeight: 0.95,
                fontWeight: 600,
                letterSpacing: -2.4,
                color: "var(--ink)",
              }}
            >
              {CV.name}.
            </h1>
            <div
              style={{
                marginTop: 14,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: 17, fontWeight: 500, color: "var(--ink-2)" }}
              >
                {(CV.role as Record<string, string>)[
                  lang === "uk" ? "ua" : "en"
                ] ?? CV.role.en}
              </span>
              <span style={{ color: "var(--ink-4)" }}>·</span>
              <span
                className="mono"
                style={{ fontSize: 13, color: "var(--ink-3)" }}
              >
                {(CV.location as Record<string, string>)[
                  lang === "uk" ? "ua" : "en"
                ] ?? CV.location.en}
              </span>
            </div>
            <p
              style={{
                marginTop: 28,
                marginBottom: 0,
                fontSize: 19,
                lineHeight: 1.5,
                color: "var(--ink-2)",
                maxWidth: 560,
                letterSpacing: -0.2,
                order: isMobile ? 2 : 0,
              }}
            >
              {t("home.tagline")}
            </p>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                order: isMobile ? 1 : 0,
              }}
            >
              <Link
                href={sandboxPath}
                style={{
                  height: 48,
                  padding: "0 22px",
                  gap: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  background: "var(--accent-color)",
                  color: "var(--accent-ink)",
                  border: "1px solid var(--accent-color)",
                  borderRadius: 8,
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.opacity = "0.88"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.opacity = "1"
                }}
              >
                {t("home.cta.primary")} <Icon name="arrow-right" size={18} />
              </Link>
              <a
                href="/cv/CV_Ivan_Kozenko_AQA_Senior.pdf"
                download
                style={{
                  height: 48,
                  padding: "0 22px",
                  gap: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  background: "transparent",
                  color: "var(--ink)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: 8,
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.opacity = "0.75"
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.opacity = "1"
                }}
              >
                <Icon name="download" size={18} />
                {lang === "uk"
                  ? "Завантажити PDF резюме"
                  : "Download PDF resume"}
              </a>
            </div>
          </div>

          {/* Right: terminal */}
          <div
            style={{
              background: "var(--term-bg)",
              borderRadius: 12,
              border: "1px solid var(--line)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderBottom: "1px solid rgba(255,255,255,.08)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: c,
                  }}
                />
              ))}
              <span
                className="mono"
                style={{
                  marginLeft: 10,
                  fontSize: 11,
                  color: "rgba(240,237,229,.6)",
                }}
              >
                ~/portfolio — zsh
              </span>
            </div>
            <div
              className="mono"
              style={{
                padding: 18,
                fontSize: 12.5,
                lineHeight: 1.7,
                color: "var(--term-ink)",
                flex: 1,
              }}
            >
              <div>
                <span style={{ color: "#7CFF6B" }}>ivan@portfolio</span>
                <span style={{ opacity: 0.5 }}>:</span>
                <span style={{ color: "#6BB6FF" }}>~</span>
                <span style={{ opacity: 0.5 }}> $ </span>cat about.txt
              </div>
              <div
                style={{
                  color: "rgba(240,237,229,.85)",
                  marginTop: 6,
                  marginBottom: 10,
                  whiteSpace: "pre-wrap",
                }}
              >
                {t("home.summary")}
              </div>
              <div>
                <span style={{ color: "#7CFF6B" }}>ivan@portfolio</span>
                <span style={{ opacity: 0.5 }}>:</span>
                <span style={{ color: "#6BB6FF" }}>~</span>
                <span style={{ opacity: 0.5 }}> $ </span>npx playwright test
                --shard=1/3
              </div>
              <div style={{ color: "rgba(240,237,229,.7)", marginTop: 4 }}>
                Running 47 tests using 4 workers
              </div>
              <div style={{ color: "#7CFF6B", marginTop: 2 }}>
                {" "}
                ✓ 47 passed (1m 38s)
              </div>
              <div style={{ color: "rgba(240,237,229,.5)", marginTop: 2 }}>
                <span style={{ color: "#FFB36B" }}>Slowest:</span> auth › 2FA
                flow (12.4s)
              </div>
              <div style={{ marginTop: 10 }}>
                <span style={{ color: "#7CFF6B" }}>ivan@portfolio</span>
                <span style={{ opacity: 0.5 }}>:</span>
                <span style={{ color: "#6BB6FF" }}>~</span>
                <span style={{ opacity: 0.5 }}> $ </span>
                <span
                  style={{
                    background: "var(--term-ink)",
                    color: "var(--term-bg)",
                    padding: "0 3px",
                    animation: "blink 1.1s steps(2) infinite",
                  }}
                >
                  _
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <Stats t={t} />
        </div>
      </section>

      {/* ── KEY WINS ─────────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 0" }}
      >
        <SectionHeader
          eyebrow={t("home.section.wins")}
          title={lang === "uk" ? "Ключові досягнення" : "Key wins"}
        />
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
          {CV.wins.map((w) => (
            <div
              key={w.tag}
              style={{
                padding: "22px 24px",
                borderRadius: 14,
                background: "var(--bg-elev)",
                border: "1px solid var(--line)",
                position: "relative",
              }}
            >
              <div
                className="mono"
                style={{
                  position: "absolute",
                  top: 14,
                  right: 16,
                  fontSize: 10,
                  color: "var(--ink-4)",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {w.tag}
              </div>
              <div
                style={{ fontSize: 15, lineHeight: 1.5, color: "var(--ink-2)" }}
              >
                {lang === "uk" ? w.ua : w.en}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ───────────────────────────────────────── */}
      <section
        id="experience"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 32px 0",
          scrollMarginTop: 80,
        }}
      >
        <SectionHeader
          eyebrow={t("home.section.experience")}
          title={lang === "uk" ? "Досвід роботи" : "Experience"}
        />
        <div>
          {CV.experience.map((x) => (
            <ExperienceItem
              key={x.company}
              x={x}
              lang={lang}
              isMobile={isMobile}
            />
          ))}
          <div style={{ borderTop: "1px solid var(--line)" }} />
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────────────────── */}
      <section
        id="stack"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 32px 0",
          scrollMarginTop: 80,
        }}
      >
        <SectionHeader
          eyebrow={t("home.section.stack")}
          title={lang === "uk" ? "Технологічний стек" : "Tech stack"}
          sub={
            lang === "uk"
              ? "Розмір крапки = глибина експертизи"
              : "Dot size indicates depth of expertise"
          }
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SKILL_CATS.map((c) => {
            const items = CV.skills.filter((s) => s.category === c.id)
            if (!items.length) return null
            return (
              <div
                key={c.id}
                style={{
                  padding: 20,
                  borderRadius: 12,
                  background: "var(--bg-elev)",
                  border: "1px solid var(--line)",
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
                  {lang === "uk" ? c.uaLabel : c.enLabel}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {items.map((s) => (
                    <SkillChip key={s.id} s={s} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── BEYOND ───────────────────────────────────────────── */}
      <section
        style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1.2fr",
            gap: isMobile ? 14 : 18,
          }}
        >
          {/* Languages */}
          <div
            style={{
              padding: 22,
              borderRadius: 12,
              background: "var(--bg-elev)",
              border: "1px solid var(--line)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 14,
              }}
            >
              {t("home.section.languages")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {CV.languages.map((l) => (
                <div
                  key={l.lang}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 24,
                      borderRadius: 4,
                      background: "var(--bg-sunken)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily:
                        "var(--font-jetbrains-mono, ui-monospace, monospace)",
                      fontSize: 10.5,
                      fontWeight: 600,
                      color: "var(--ink-2)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    {l.icon}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {l.lang}
                  </span>
                  <span style={{ flex: 1 }} />
                  <span
                    className="mono"
                    style={{ fontSize: 11.5, color: "var(--ink-3)" }}
                  >
                    {l.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Development */}
          <div
            style={{
              padding: 22,
              borderRadius: 12,
              background: "var(--bg-elev)",
              border: "1px solid var(--line)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 14,
              }}
            >
              {t("home.section.education")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CV.development.map((d) => (
                <div
                  key={d.en}
                  style={{
                    fontSize: 13.5,
                    color: "var(--ink-2)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                  }}
                >
                  <Icon
                    name="check"
                    size={14}
                    style={{ color: "var(--ok)", marginTop: 2, flexShrink: 0 }}
                  />
                  {lang === "uk" ? d.ua : d.en}
                </div>
              ))}
            </div>
          </div>
          {/* Beyond */}
          <div
            style={{
              padding: 22,
              borderRadius: 12,
              background: "var(--bg-elev)",
              border: "1px solid var(--line)",
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                textTransform: "uppercase",
                letterSpacing: 0.6,
                marginBottom: 14,
              }}
            >
              {t("home.section.beyond")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CV.beyond.map((b) => (
                <div key={b.titleEn}>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {lang === "uk" ? b.titleUa : b.titleEn}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--ink-3)",
                      lineHeight: 1.5,
                    }}
                  >
                    {lang === "uk" ? b.bodyUa : b.bodyEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── JOB-FIT CHECKER ──────────────────────────────────── */}
      <section
        id="fit"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 32px 0",
          scrollMarginTop: 80,
        }}
      >
        <SectionHeader
          eyebrow={t("home.section.fit")}
          title={
            lang === "uk"
              ? "Перевірка під вашу вакансію"
              : "Job-fit checker for recruiters"
          }
          sub={
            lang === "uk"
              ? "Швидкий чесний матчинг — без BS-метрик."
              : "Quick honest match — no inflated buzzword bingo."
          }
        />
        <JobFitChecker lang={lang} isMobile={isMobile} />
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 32px 0",
          scrollMarginTop: 80,
        }}
      >
        <SectionHeader
          eyebrow={t("home.section.contact")}
          title={lang === "uk" ? "Зв'яжіться зі мною" : "Get in touch"}
          sub={
            lang === "uk"
              ? "Найшвидше — Telegram або LinkedIn."
              : "Fastest reply on Telegram or LinkedIn."
          }
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          <ContactCard
            variant="copy"
            icon="mail"
            label={t("contact.email")}
            value={CV.email}
            t={t}
          />
          <ContactCard
            variant="link"
            icon="linkedin"
            label={t("contact.linkedin")}
            value="ivan-kozenko-qa"
            href={CV.links.linkedin}
          />
          <ContactCard
            variant="link"
            icon="telegram"
            label={t("contact.telegram")}
            value="@IvanTryCry"
            href={CV.links.telegram}
          />
          <ContactCard
            variant="link"
            icon="github"
            label={t("contact.github")}
            value="IvankoQA"
            href={CV.links.github}
          />
          <ContactCard
            variant="link"
            icon="youtube"
            label={t("contact.youtube")}
            value="@IvanTryCry"
            href={CV.links.youtube}
          />
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        style={{
          marginTop: 100,
          padding: "32px",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 11.5, color: "var(--ink-3)" }}
          >
            <span style={{ color: "var(--ok)" }}>$</span> exit 0 ·{" "}
            {new Date().getFullYear()} · Built with too much coffee.
          </div>
          <div
            className="mono"
            style={{ fontSize: 11.5, color: "var(--ink-3)" }}
          >
            v2.4.1 · last commit: 2 days ago · ✓ green
          </div>
        </div>
      </footer>
    </div>
  )
}
