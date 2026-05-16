"use client"

import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import {
  learnTopicHref,
  learnTopicQuizHref,
} from "@/lib/playwright-learn/paths"
import type {
  AdjacentTopics,
  PlaywrightTopic,
} from "@/lib/playwright-learn/types"
import { ArrowLeftIcon, ArrowRightIcon } from "./icons"
import { Quiz } from "./quiz"

type Props = {
  topic: PlaywrightTopic
  locale: AppLocale
  adjacent?: AdjacentTopics
}

const STRINGS = {
  en: {
    backToTopic: "Back to topic",
    quizHeading: "Quiz",
    prev: "Previous",
    next: "Next",
  },
  uk: {
    backToTopic: "Назад до теми",
    quizHeading: "Тест",
    prev: "Попередня",
    next: "Наступна",
  },
} as const

function QuizAdjacentNav({
  adjacent,
  locale,
}: {
  adjacent: AdjacentTopics
  locale: AppLocale
}) {
  const t = STRINGS[locale]
  const { prev, next } = adjacent
  if (!prev && !next) return null
  const linkBase = {
    padding: "10px 12px",
    border: "1px solid var(--line)",
    borderRadius: 10,
    color: "var(--ink)",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    background: "var(--bg-card)",
    minWidth: 0,
    width: "max-content" as const,
    maxWidth: "100%",
    boxSizing: "border-box" as const,
  }
  return (
    <nav
      aria-label={`${t.prev} / ${t.next}`}
      style={{
        marginTop: 32,
        display: "flex",
        flexWrap: "wrap" as const,
        alignItems: "center",
        gap: 10,
        justifyContent: "space-between",
      }}
    >
      {prev ? (
        <Link
          href={learnTopicQuizHref(locale, prev.slug)}
          data-testid="learn-quiz-prev-topic"
          style={linkBase}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <ArrowLeftIcon size={11} /> {t.prev}
          </span>
          <span style={{ fontSize: 14, fontWeight: 500, minWidth: 0 }}>
            {prev.title[locale]}
          </span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={learnTopicQuizHref(locale, next.slug)}
          data-testid="learn-quiz-next-topic"
          style={{
            ...linkBase,
            justifyContent: "flex-end",
            marginLeft: prev ? undefined : "auto",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              minWidth: 0,
              textAlign: "right",
            }}
          >
            {next.title[locale]}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {t.next} <ArrowRightIcon size={11} />
          </span>
        </Link>
      ) : null}
    </nav>
  )
}

export function QuizTopicView({ topic, locale, adjacent }: Props) {
  const t = STRINGS[locale]

  return (
    <article
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "32px 24px 80px",
        color: "var(--ink)",
      }}
    >
      <Link
        href={learnTopicHref(locale, topic.slug)}
        data-testid="learn-quiz-back-to-topic"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12.5,
          color: "var(--ink-3)",
          marginBottom: 14,
        }}
      >
        <ArrowLeftIcon size={12} /> {t.backToTopic}
      </Link>

      <header style={{ marginBottom: 8 }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 0.04,
            textTransform: "uppercase",
            color: "var(--ink-3)",
          }}
        >
          {t.quizHeading}
        </p>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: -0.35,
            margin: "6px 0 0",
            color: "var(--ink)",
          }}
        >
          {topic.title[locale]}
        </h1>
      </header>

      <Quiz slug={topic.slug} questions={topic.quiz} locale={locale} />

      {adjacent ? (
        <QuizAdjacentNav adjacent={adjacent} locale={locale} />
      ) : null}
    </article>
  )
}
