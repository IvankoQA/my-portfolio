import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import {
  getTopicsByGroup,
  getTopicsByLevel,
  TRACK_META,
} from "@/lib/playwright-learn/catalog"
import { stripDocsImportMarkers } from "@/lib/playwright-learn/strip-docs-import-markers"
import {
  LearnIntroClient,
  type TrackData,
  type GroupData,
} from "./learn-intro-client"

const OFFICIAL_DOCS = "https://playwright.dev/docs/intro"

const LEVELS = ["beginner", "intermediate", "advanced"] as const

const COPY = {
  en: {
    title: "Playwright notes & quizzes",
    intro:
      "Playwright is a testing framework that lets you write automated browser tests in TypeScript. These notes cover the official documentation topic by topic — short sections, runnable TypeScript examples, and an optional quiz after each topic to check your understanding.",
    aside:
      "All of this (and much more) already lives on playwright.dev — I'm not replacing it. I wanted a version on my own site with end-of-topic quizzes, less noise, and a tighter reading flow.",
    officialLabel: "Official Playwright docs",
    tracksTitle: "Learning tracks",
    modulesTitle: "Browse by module",
    read: "Read",
    quiz: "Quiz",
  },
  uk: {
    title: "Нотатки та тести з Playwright",
    intro:
      "Playwright — це фреймворк для автоматизованого тестування браузерів. Тут зібрані нотатки з офіційної документації: кожна тема — короткий текст, приклади коду на TypeScript і необов'язковий квіз для самоперевірки.",
    aside:
      "Усе це (і значно більше) вже є на playwright.dev — це не заміна. Хотілося мати власну версію з квізами після тем, без зайвого шуму й зручнішим для читання ритмом.",
    officialLabel: "Офіційна документація Playwright",
    tracksTitle: "Навчальні треки",
    modulesTitle: "Перегляд за розділами",
    read: "Читати",
    quiz: "Квіз",
  },
} as const

type Props = {
  locale: AppLocale
}

export function LearnPlaywrightIntro({ locale }: Props) {
  const t = COPY[locale]
  const groups = getTopicsByGroup()

  const trackData: TrackData[] = LEVELS.map((level) => {
    const topics = getTopicsByLevel(level)
    const meta = TRACK_META[level]
    return {
      level,
      slugs: topics.map((tp) => tp.slug),
      firstSlug: topics[0]?.slug ?? "",
      topics: topics.map((tp) => ({ slug: tp.slug, title: tp.title })),
      label: meta.label,
      description: meta.description,
      outcomes: meta.outcomes,
      color: meta.color,
    }
  })

  const groupData: GroupData[] = groups.map(({ groupId, topics }) => ({
    groupId,
    topics: topics.map((tp) => ({
      slug: tp.slug,
      title: tp.title,
      summary: {
        en: stripDocsImportMarkers(tp.summary.en) ?? "",
        uk: stripDocsImportMarkers(tp.summary.uk) ?? "",
      },
      groupId: tp.groupId,
      hasQuiz: tp.quiz.length > 0,
    })),
  }))

  // Flatten all topics for search
  const allTopics = groupData.flatMap((g) => g.topics)

  return (
    <article
      className="learn-intro"
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "28px 24px 64px",
        color: "var(--ink)",
      }}
    >
      <header>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: -0.4,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {t.title}
        </h1>
        <p
          style={{
            marginTop: 14,
            fontSize: 16,
            lineHeight: 1.65,
            color: "var(--ink-2)",
          }}
        >
          {t.intro}
        </p>
        <p
          style={{
            marginTop: 12,
            fontSize: 15,
            lineHeight: 1.65,
            color: "var(--ink-2)",
          }}
        >
          {t.aside}{" "}
          <Link
            href={OFFICIAL_DOCS}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-color)", fontWeight: 600 }}
          >
            {t.officialLabel}
          </Link>
          .
        </p>
      </header>

      <LearnIntroClient
        locale={locale}
        trackData={trackData}
        groups={groupData}
        allTopics={allTopics}
        copy={{
          tracksTitle: t.tracksTitle,
          modulesTitle: t.modulesTitle,
          read: t.read,
          quiz: t.quiz,
        }}
      />
    </article>
  )
}
