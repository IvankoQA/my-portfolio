"use client"

import { useState } from "react"
import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import type { TopicGroupId, TopicLevel } from "@/lib/playwright-learn/types"
import { TOPIC_GROUP_TITLES } from "@/lib/playwright-learn/types"
import {
  learnTopicHref,
  learnTopicQuizHref,
} from "@/lib/playwright-learn/paths"
import { renderInlineMarkdown } from "./inline-markdown"
import { TrackCard, type TrackTopic } from "./track-card"
import { LearnSearch, type SearchableTopic } from "./learn-search"

export type TrackData = {
  level: TopicLevel
  topics: TrackTopic[]
  firstSlug: string
  slugs: string[]
  label: { en: string; uk: string }
  description: { en: string; uk: string }
  outcomes: {
    en: { learn: string; skills: string }
    uk: { learn: string; skills: string }
  }
  color: string
}

export type GroupData = {
  groupId: TopicGroupId
  topics: SearchableTopic[]
}

type Props = {
  locale: AppLocale
  trackData: TrackData[]
  groups: GroupData[]
  allTopics: SearchableTopic[]
  copy: {
    tracksTitle: string
    modulesTitle: string
    read: string
    quiz: string
  }
}

export function LearnIntroClient({
  locale,
  trackData,
  groups,
  allTopics,
  copy,
}: Props) {
  const [searching, setSearching] = useState(false)

  return (
    <>
      {/* Search */}
      <LearnSearch
        topics={allTopics}
        locale={locale}
        onQueryChange={setSearching}
      />

      {/* Tracks + Modules — hidden while searching */}
      <div
        style={{
          display: searching ? "none" : "contents",
        }}
      >
        {/* Learning tracks */}
        <section
          style={{ marginTop: 36 }}
          aria-labelledby="learn-tracks-heading"
        >
          <h2
            id="learn-tracks-heading"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              margin: "0 0 14px",
            }}
          >
            {copy.tracksTitle}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {trackData.map((track) => (
              <TrackCard
                key={track.level}
                level={track.level}
                slugs={track.slugs}
                firstSlug={track.firstSlug}
                topics={track.topics}
                label={track.label}
                description={track.description}
                outcomes={track.outcomes}
                color={track.color}
                locale={locale}
              />
            ))}
          </div>
        </section>

        {/* Browse by module */}
        <section
          style={{ marginTop: 48 }}
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
            {copy.modulesTitle}
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
                  {topics.map((topic) => {
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
                            fontSize: 17,
                            fontWeight: 600,
                            color: "var(--ink)",
                          }}
                        >
                          {topic.title[locale]}
                        </div>
                        {sum && (
                          <p
                            style={{
                              margin: "8px 0 12px",
                              fontSize: 14,
                              lineHeight: 1.55,
                              color: "var(--ink-2)",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {renderInlineMarkdown(
                              sum,
                              `intro-sum-${topic.slug}`,
                            )}
                          </p>
                        )}
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
                            {copy.read}
                          </Link>
                          {topic.hasQuiz && (
                            <Link
                              href={learnTopicQuizHref(locale, topic.slug)}
                              data-testid={`learn-intro-quiz-${topic.slug}`}
                              style={{ color: "var(--ink-3)" }}
                            >
                              {copy.quiz}
                            </Link>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
