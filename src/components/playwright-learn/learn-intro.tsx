import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import {
  getTopicsByGroup,
  PLAYWRIGHT_TOPICS,
} from "@/lib/playwright-learn/catalog"
import {
  learnTopicHref,
  learnTopicQuizHref,
} from "@/lib/playwright-learn/paths"
import { stripDocsImportMarkers } from "@/lib/playwright-learn/strip-docs-import-markers"
import { TOPIC_GROUP_TITLES } from "@/lib/playwright-learn/types"
import { renderInlineMarkdown } from "./inline-markdown"

const OFFICIAL_DOCS = "https://playwright.dev/docs/intro"

const COPY = {
  en: {
    title: "Playwright notes & quizzes",
    intro:
      "Here you’ll find a compact, opinionated walkthrough of Playwright’s official documentation: the same concepts you’d read on the site, reorganized into short sections with code samples.",
    aside:
      "All of this (and much more) already lives on playwright.dev — I’m not replacing it. I wanted a version on my own site with end-of-topic quizzes, less noise, and a tighter reading flow.",
    officialLabel: "Official Playwright docs",
    modulesTitle: "Modules",
    read: "Read",
    quiz: "Quiz",
    startCta: "Start with the introduction",
  },
  uk: {
    title: "Нотатки та тести з Playwright",
    intro:
      "Тут — стислий, суб’єктивний прохід по офіційній документації Playwright: ті самі ідеї, що на сайті, але короткими блоками з прикладами коду.",
    aside:
      "Усе це (і значно більше) вже є на playwright.dev — це не заміна. Хотілося мати власну версію з квізами після тем, без зайвого шуму й зручнішим для читання ритмом.",
    officialLabel: "Офіційна документація Playwright",
    modulesTitle: "Розділи",
    read: "Читати",
    quiz: "Квіз",
    startCta: "Почати з вступу",
  },
} as const

type Props = {
  locale: AppLocale
}

export function LearnPlaywrightIntro({ locale }: Props) {
  const t = COPY[locale]
  const groups = getTopicsByGroup()
  const firstTopic = PLAYWRIGHT_TOPICS[0]

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
          <a
            href={OFFICIAL_DOCS}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent-color)", fontWeight: 600 }}
          >
            {t.officialLabel}
          </a>
          .
        </p>
      </header>

      {firstTopic ? (
        <div style={{ marginTop: 22 }}>
          <Link
            href={learnTopicHref(locale, firstTopic.slug)}
            data-testid="learn-intro-start"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 44,
              padding: "0 20px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              color: "var(--accent-ink)",
              background: "var(--accent-color)",
              textDecoration: "none",
            }}
          >
            {t.startCta}
          </Link>
        </div>
      ) : null}

      <section
        style={{ marginTop: 40 }}
        aria-labelledby="learn-modules-heading"
      >
        <h2
          id="learn-modules-heading"
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            margin: "0 0 16px",
          }}
        >
          {t.modulesTitle}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {groups.map(({ groupId, topics }) => (
            <div key={groupId}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--ink-3)",
                  marginBottom: 10,
                }}
              >
                {TOPIC_GROUP_TITLES[groupId][locale]}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {topics.map((topic) => (
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
                        fontSize: 17,
                        fontWeight: 600,
                        color: "var(--ink)",
                      }}
                    >
                      {topic.title[locale]}
                    </div>
                    {(() => {
                      const sum = stripDocsImportMarkers(topic.summary[locale])
                      if (sum === null) return null
                      return (
                        <p
                          style={{
                            margin: "8px 0 12px",
                            fontSize: 14,
                            lineHeight: 1.55,
                            color: "var(--ink-2)",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {renderInlineMarkdown(sum, `intro-sum-${topic.slug}`)}
                        </p>
                      )
                    })()}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      <Link
                        href={learnTopicHref(locale, topic.slug)}
                        data-testid={`learn-intro-topic-${topic.slug}`}
                        style={{ color: "var(--accent-color)" }}
                      >
                        {t.read}
                      </Link>
                      {topic.quiz.length > 0 ? (
                        <Link
                          href={learnTopicQuizHref(locale, topic.slug)}
                          data-testid={`learn-intro-quiz-${topic.slug}`}
                          style={{ color: "var(--ink-3)" }}
                        >
                          {t.quiz}
                        </Link>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
