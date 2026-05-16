"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import type { TopicLevel } from "@/lib/playwright-learn/types"
import { loadPlaywrightLearnProgress } from "@/lib/playwright-learn/storage"
import { learnTopicHref } from "@/lib/playwright-learn/paths"

export type TrackTopic = { slug: string; title: { en: string; uk: string } }

type Props = {
  level: TopicLevel
  slugs: string[]
  firstSlug: string
  label: { en: string; uk: string }
  description: { en: string; uk: string }
  outcomes: {
    en: { learn: string; skills: string }
    uk: { learn: string; skills: string }
  }
  topics: TrackTopic[]
  color: string
  locale: AppLocale
}

const STRINGS = {
  en: {
    start: "Start",
    continue: "Continue",
    review: "Review",
    complete: "Complete",
    topicsOf: (n: number, total: number) => `${n} / ${total} topics`,
    topics: "Topics in this track",
    skillsLabel: "After completing:",
  },
  uk: {
    start: "Почати",
    continue: "Продовжити",
    review: "Повторити",
    complete: "Завершено",
    topicsOf: (n: number, total: number) => `${n} / ${total} тем`,
    topics: "Теми цього треку",
    skillsLabel: "Після завершення:",
  },
} as const

export function TrackCard({
  slugs,
  firstSlug,
  label,
  description,
  outcomes,
  topics,
  color,
  locale,
}: Props) {
  const t = STRINGS[locale]
  const total = slugs.length
  const [completed, setCompleted] = useState(0)
  const [ctaSlug, setCtaSlug] = useState(firstSlug)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const progress = loadPlaywrightLearnProgress()
    let count = 0
    let firstUncompleted: string | null = null
    for (const slug of slugs) {
      if (progress.topics[slug]?.quizCompletedOnce) {
        count++
      } else if (firstUncompleted === null) {
        firstUncompleted = slug
      }
    }
    setCompleted(count)
    setCtaSlug(firstUncompleted ?? firstSlug)
  }, [slugs, firstSlug])

  const pct = total > 0 ? completed / total : 0
  const done = completed === total && total > 0
  const started = completed > 0

  const ctaLabel = done ? t.review : started ? t.continue : t.start
  const href = learnTopicHref(locale, done ? firstSlug : ctaSlug)

  const size = 56
  const track = 5
  const deg = pct * 360

  const outcome = outcomes[locale]

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 14,
        background: "var(--bg-card)",
        overflow: "hidden",
      }}
    >
      {/* Clickable header area */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "18px 20px 14px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          {/* Progress ring */}
          <div
            aria-hidden="true"
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: `conic-gradient(${color} ${deg}deg, var(--line) 0deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: size - track * 2,
                height: size - track * 2,
                borderRadius: "50%",
                background: "var(--bg-card)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: done ? color : "var(--ink-3)",
                  lineHeight: 1,
                }}
              >
                {Math.round(pct * 100)}%
              </span>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {label[locale]}
                {done && (
                  <span
                    style={{
                      fontSize: 11,
                      background: `${color}22`,
                      color,
                      borderRadius: 6,
                      padding: "2px 7px",
                      fontWeight: 600,
                    }}
                  >
                    {t.complete}
                  </span>
                )}
              </span>
              {/* Chevron */}
              <span
                aria-hidden="true"
                style={{
                  fontSize: 12,
                  color: "var(--ink-3)",
                  transition: "transform 0.2s",
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  display: "inline-block",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ▾
              </span>
            </div>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--ink-2)",
                textAlign: "left",
              }}
            >
              {description[locale]}
            </p>
            <div style={{ marginTop: 4, fontSize: 12, color: "var(--ink-3)" }}>
              {t.topicsOf(completed, total)}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid var(--line)",
            padding: "18px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* What you'll learn */}
          <div
            style={{
              background: `${color}0f`,
              borderLeft: `3px solid ${color}`,
              borderRadius: "0 8px 8px 0",
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--ink-2)",
            }}
          >
            {outcome.learn}
          </div>

          {/* Topic list */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
                marginBottom: 10,
              }}
            >
              {t.topics}
            </div>
            <ol
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {topics.map((tp, i) => (
                <li
                  key={tp.slug}
                  style={{ display: "flex", alignItems: "baseline", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color,
                      minWidth: 20,
                      flexShrink: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {i + 1}.
                  </span>
                  <Link
                    href={learnTopicHref(locale, tp.slug)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontSize: 14,
                      color: "var(--ink)",
                      textDecoration: "none",
                      lineHeight: 1.5,
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLAnchorElement).style.color =
                        color
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--ink)"
                    }}
                  >
                    {tp.title[locale]}
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* Skills outcome */}
          <p
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--ink-3)",
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>
              {t.skillsLabel}{" "}
            </span>
            {outcome.skills}
          </p>

          {/* CTA */}
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              background: done ? "transparent" : color,
              color: done ? color : "#fff",
              border: `1.5px solid ${color}`,
              textDecoration: "none",
              alignSelf: "flex-start",
            }}
          >
            {ctaLabel}
          </Link>
        </div>
      )}

      {/* Collapsed CTA */}
      {!expanded && (
        <div style={{ padding: "0 20px 18px" }}>
          <Link
            href={href}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              background: done ? "transparent" : color,
              color: done ? color : "#fff",
              border: `1.5px solid ${color}`,
              textDecoration: "none",
            }}
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  )
}
