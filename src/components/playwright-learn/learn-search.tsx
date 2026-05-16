"use client"

import { useState, useMemo, useId } from "react"
import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import type { TopicGroupId } from "@/lib/playwright-learn/types"
import { TOPIC_GROUP_TITLES } from "@/lib/playwright-learn/types"
import {
  learnTopicHref,
  learnTopicQuizHref,
} from "@/lib/playwright-learn/paths"

export type SearchableTopic = {
  slug: string
  title: { en: string; uk: string }
  summary: { en: string; uk: string }
  groupId: TopicGroupId
  hasQuiz: boolean
}

type Props = {
  topics: SearchableTopic[]
  locale: AppLocale
  /** Called whenever the query changes — parent can show/hide content below. */
  onQueryChange?: (hasQuery: boolean) => void
}

const STRINGS = {
  en: {
    placeholder: "Search topics…",
    noResults: "No topics match your search.",
    read: "Read",
    quiz: "Quiz",
    results: (n: number) => `${n} result${n === 1 ? "" : "s"}`,
    clear: "Clear",
  },
  uk: {
    placeholder: "Пошук тем…",
    noResults: "За вашим запитом тем не знайдено.",
    read: "Читати",
    quiz: "Квіз",
    results: (n: number) =>
      `${n} ${n === 1 ? "результат" : n < 5 ? "результати" : "результатів"}`,
    clear: "Очистити",
  },
} as const

/** Wrap all occurrences of `query` in <mark> inside `text`. Returns JSX. */
function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  const parts: React.ReactNode[] = []
  let cursor = 0
  while (cursor < text.length) {
    const idx = lower.indexOf(q, cursor)
    if (idx === -1) {
      parts.push(text.slice(cursor))
      break
    }
    if (idx > cursor) parts.push(text.slice(cursor, idx))
    parts.push(
      <mark
        key={idx}
        style={{
          background: "var(--accent-color, #0077cc)22",
          color: "inherit",
          borderRadius: 2,
          padding: "0 1px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </mark>,
    )
    cursor = idx + query.length
  }
  return <>{parts}</>
}

export function LearnSearch({ topics, locale, onQueryChange }: Props) {
  const [query, setQuery] = useState("")
  const inputId = useId()
  const t = STRINGS[locale]

  const trimmed = query.trim()

  const results = useMemo(() => {
    const q = trimmed.toLowerCase()
    if (!q) return []
    return topics.filter((topic) => {
      const fields = [topic.title.en, topic.title.uk, topic.summary[locale]]
      return fields.some((f) => f.toLowerCase().includes(q))
    })
  }, [trimmed, topics, locale])

  function handleChange(value: string) {
    setQuery(value)
    onQueryChange?.(value.trim().length > 0)
  }

  function handleClear() {
    setQuery("")
    onQueryChange?.(false)
  }

  return (
    <div style={{ marginTop: 28 }}>
      {/* Search input */}
      <div style={{ position: "relative" }}>
        <label htmlFor={inputId} style={{ display: "none" }}>
          {t.placeholder}
        </label>
        {/* Search icon */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--ink-3)",
            pointerEvents: "none",
            fontSize: 15,
          }}
        >
          ⌕
        </span>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          spellCheck={false}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 40px 10px 36px",
            fontSize: 15,
            borderRadius: 10,
            border: "1px solid var(--line)",
            background: "var(--bg-card)",
            color: "var(--ink)",
            outline: "none",
            appearance: "none",
            WebkitAppearance: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-color, #0077cc)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--line)"
          }}
        />
        {trimmed && (
          <button
            type="button"
            aria-label={t.clear}
            onClick={handleClear}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-3)",
              fontSize: 16,
              lineHeight: 1,
              padding: "2px 4px",
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Results */}
      {trimmed && (
        <div style={{ marginTop: 16 }}>
          {results.length === 0 ? (
            <p
              style={{
                fontSize: 14,
                color: "var(--ink-3)",
                margin: 0,
                padding: "12px 0",
              }}
            >
              {t.noResults}
            </p>
          ) : (
            <>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-3)",
                  marginBottom: 12,
                }}
              >
                {t.results(results.length)}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {results.map((topic) => {
                  const sum = topic.summary[locale]
                  return (
                    <li
                      key={topic.slug}
                      style={{
                        border: "1px solid var(--line)",
                        borderRadius: 12,
                        padding: "14px 16px",
                        background: "var(--bg-card)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--ink-3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: 4,
                        }}
                      >
                        {TOPIC_GROUP_TITLES[topic.groupId][locale]}
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: "var(--ink)",
                        }}
                      >
                        {highlight(topic.title[locale], trimmed)}
                      </div>
                      {sum && (
                        <p
                          style={{
                            margin: "6px 0 10px",
                            fontSize: 14,
                            lineHeight: 1.55,
                            color: "var(--ink-2)",
                          }}
                        >
                          {highlight(sum, trimmed)}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        <Link
                          href={learnTopicHref(locale, topic.slug)}
                          style={{ color: "var(--accent-color, #0077cc)" }}
                        >
                          {t.read}
                        </Link>
                        {topic.hasQuiz && (
                          <Link
                            href={learnTopicQuizHref(locale, topic.slug)}
                            style={{ color: "var(--ink-3)" }}
                          >
                            {t.quiz}
                          </Link>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}
