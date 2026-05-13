"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import type { TopicLevel } from "@/lib/playwright-learn/types"
import { loadPlaywrightLearnProgress } from "@/lib/playwright-learn/storage"
import { learnTopicHref } from "@/lib/playwright-learn/paths"

type Props = {
  level: TopicLevel
  slugs: string[]
  firstSlug: string
  label: { en: string; uk: string }
  description: { en: string; uk: string }
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
  },
  uk: {
    start: "Почати",
    continue: "Продовжити",
    review: "Повторити",
    complete: "Завершено",
    topicsOf: (n: number, total: number) => `${n} / ${total} тем`,
  },
} as const

export function TrackCard({
  slugs,
  firstSlug,
  label,
  description,
  color,
  locale,
}: Props) {
  const t = STRINGS[locale]
  const total = slugs.length
  const [completed, setCompleted] = useState(0)
  const [ctaSlug, setCtaSlug] = useState(firstSlug)

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

  return (
    <div
      style={{
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "18px 20px",
        background: "var(--bg-card)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
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
              gap: 8,
            }}
          >
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
          </div>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 14,
              lineHeight: 1.55,
              color: "var(--ink-2)",
            }}
          >
            {description[locale]}
          </p>
          <div style={{ marginTop: 4, fontSize: 12, color: "var(--ink-3)" }}>
            {t.topicsOf(completed, total)}
          </div>
        </div>
      </div>

      <Link
        href={href}
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
  )
}
