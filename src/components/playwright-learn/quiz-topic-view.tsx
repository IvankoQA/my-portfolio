"use client"

import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import { learnTopicHref } from "@/lib/playwright-learn/paths"
import type { PlaywrightTopic } from "@/lib/playwright-learn/types"
import { ArrowLeftIcon } from "./icons"
import { Quiz } from "./quiz"

type Props = {
  topic: PlaywrightTopic
  locale: AppLocale
}

const STRINGS = {
  en: {
    backToTopic: "Back to topic",
    quizHeading: "Quiz",
  },
  uk: {
    backToTopic: "Назад до теми",
    quizHeading: "Тест",
  },
} as const

export function QuizTopicView({ topic, locale }: Props) {
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
    </article>
  )
}
