"use client"

import { createElement, Fragment, useEffect, useState } from "react"
import Link from "next/link"
import type { AppLocale } from "@/lib/i18n/locale"
import {
  learnIndexHref,
  learnTopicHref,
  learnTopicQuizHref,
} from "@/lib/playwright-learn/paths"
import { stripDocsImportMarkers } from "@/lib/playwright-learn/strip-docs-import-markers"
import type {
  AdjacentTopics,
  PlaywrightTopic,
  TopicLevel,
  TopicSection,
  TopicSequenceItem,
} from "@/lib/playwright-learn/types"
import {
  loadPlaywrightLearnProgress,
  savePlaywrightLearnProgress,
} from "@/lib/playwright-learn/storage"
import { CodeBlock } from "./code-block"
import { renderInlineMarkdown } from "./inline-markdown"
import { ArrowLeftIcon, ArrowRightIcon, ExternalIcon } from "./icons"
import { TableOfContents } from "./toc"

type Props = {
  topic: PlaywrightTopic
  adjacent: AdjacentTopics
  locale: AppLocale
  trackTotal?: number
  trackAdjacent?: AdjacentTopics
  trackSlugs?: string[]
  nextLevelFirstSlug?: string
}

const TRACK_LEVEL_LABELS: Record<TopicLevel, { en: string; uk: string }> = {
  beginner: { en: "Beginner", uk: "Початківець" },
  intermediate: { en: "Intermediate", uk: "Середній" },
  advanced: { en: "Advanced", uk: "Просунутий" },
}

const STRINGS = {
  en: {
    backToIndex: "All topics",
    officialDocs: "Read on playwright.dev",
    prev: "Previous",
    next: "Next",
    takeQuiz: "Take the quiz",
    trackComplete: "track complete",
    continueTo: "Continue to",
    allTracksComplete: "All tracks complete",
  },
  uk: {
    backToIndex: "Усі теми",
    officialDocs: "Читати на playwright.dev",
    prev: "Попередня",
    next: "Наступна",
    takeQuiz: "Пройти тести",
    trackComplete: "трек завершено",
    continueTo: "Перейти до",
    allTracksComplete: "Всі треки завершено",
  },
} as const

function TopicAdjacentNav({
  adjacent,
  locale,
  testIdSuffix,
}: {
  adjacent: AdjacentTopics
  locale: AppLocale
  testIdSuffix: "" | "-top"
}) {
  const t = STRINGS[locale]
  const { prev, next } = adjacent
  const navStyle = {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  } as const
  const linkBase = {
    padding: "10px 12px",
    border: "1px solid var(--line)",
    borderRadius: 10,
    color: "var(--ink)",
    display: "flex",
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap" as const,
    background: "var(--bg-card)",
    minWidth: 0,
  }

  if (!prev && !next) {
    return null
  }

  return (
    <nav
      aria-label={`${t.prev} / ${t.next}`}
      style={testIdSuffix === "-top" ? { ...navStyle, marginTop: 0 } : navStyle}
    >
      {prev ? (
        <Link
          href={learnTopicHref(locale, prev.slug)}
          data-testid={`learn-prev-topic${testIdSuffix}`}
          data-topic-slug={prev.slug}
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
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              minWidth: 0,
            }}
          >
            {prev.title[locale]}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={learnTopicHref(locale, next.slug)}
          data-testid={`learn-next-topic${testIdSuffix}`}
          data-topic-slug={next.slug}
          style={{
            ...linkBase,
            justifyContent: "flex-end",
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
      ) : (
        <span />
      )}
    </nav>
  )
}

const subHeadingStyleBase = {
  fontSize: 17,
  fontWeight: 600,
  margin: "14px 0 0",
  color: "var(--ink)",
} as const

const paragraphStyleBase = {
  color: "var(--ink-2)",
  fontSize: 15,
  lineHeight: 1.65,
  marginTop: 10,
  whiteSpace: "pre-wrap" as const,
}

const orderedListStyleBase = {
  color: "var(--ink-2)",
  fontSize: 15,
  lineHeight: 1.65,
  marginTop: 10,
  paddingLeft: 22,
}

const listItemStyleBase = {
  marginTop: 4,
}

const ORDERED_ITEM_RE = /^\d+\.\s+/

function renderSectionParagraph(
  _sectionId: string,
  textRaw: string,
  paraKey: string,
) {
  const text = stripDocsImportMarkers(textRaw)
  if (text === null) return null
  const singleLine = !/\n/.test(text)
  const hm = singleLine && text.match(/^(#{3,6})\s+(.+)$/)
  if (hm) {
    const depth = hm[1].length
    if (depth >= 3 && depth <= 6) {
      const tag = `h${depth}` as "h3" | "h4" | "h5" | "h6"
      return createElement(
        tag,
        {
          key: paraKey,
          style: subHeadingStyleBase,
        },
        ...renderInlineMarkdown(hm[2], `${paraKey}-h`),
      )
    }
  }

  const lines = text.split("\n")
  const hasListItem = lines.some((l) => ORDERED_ITEM_RE.test(l))
  if (!hasListItem) {
    return (
      <p key={paraKey} style={paragraphStyleBase}>
        {renderInlineMarkdown(text, paraKey)}
      </p>
    )
  }

  type Seg =
    | { kind: "para"; lines: string[] }
    | { kind: "list"; items: string[] }
  const segs: Seg[] = []
  for (const line of lines) {
    if (ORDERED_ITEM_RE.test(line)) {
      const last = segs.at(-1)
      if (last?.kind === "list")
        last.items.push(line.replace(ORDERED_ITEM_RE, ""))
      else
        segs.push({ kind: "list", items: [line.replace(ORDERED_ITEM_RE, "")] })
    } else {
      const last = segs.at(-1)
      if (last?.kind === "para") last.lines.push(line)
      else segs.push({ kind: "para", lines: [line] })
    }
  }

  return (
    <Fragment key={paraKey}>
      {segs.map((seg) => {
        if (seg.kind === "list") {
          const olKey = `${paraKey}-ol-${seg.items[0].slice(0, 24)}`
          return (
            <ol key={olKey} style={orderedListStyleBase}>
              {seg.items.map((item) => (
                <li
                  key={`${paraKey}-li-${item.slice(0, 24)}`}
                  style={listItemStyleBase}
                >
                  {renderInlineMarkdown(
                    item,
                    `${paraKey}-li-${item.slice(0, 24)}`,
                  )}
                </li>
              ))}
            </ol>
          )
        }
        const txt = seg.lines.join("\n").trim()
        if (!txt) return null
        return (
          <p
            key={`${paraKey}-p-${txt.slice(0, 24)}`}
            style={paragraphStyleBase}
          >
            {renderInlineMarkdown(txt, `${paraKey}-p-${txt.slice(0, 24)}`)}
          </p>
        )
      })}
    </Fragment>
  )
}

function renderSequenceItems(
  section: TopicSection,
  locale: AppLocale,
  sequence: TopicSequenceItem[],
) {
  return sequence.map((item, si) => {
    if (item.kind === "code") {
      const b = item.block
      return (
        <CodeBlock
          key={`${section.id}:seq:${b.id}`}
          code={b.code}
          language={b.language}
          locale={locale}
        />
      )
    }
    const text = item[locale]
    const paraKey = `${section.id}:seq:${si}:${item.en.length}:${String(item.en.slice(0, 64))}`
    return renderSectionParagraph(section.id, text, paraKey)
  })
}

function SectionBlock({
  section,
  locale,
}: {
  section: TopicSection
  locale: AppLocale
}) {
  const useSequence = Boolean(section.sequence?.length)

  return (
    <section
      id={section.id}
      style={{
        marginTop: 28,
        scrollMarginTop: "calc(var(--site-header-h) + 16px)",
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: 600,
          margin: 0,
          color: "var(--ink)",
        }}
      >
        {section.title[locale]}
      </h2>
      {useSequence
        ? renderSequenceItems(section, locale, section.sequence ?? [])
        : section.paragraphs?.map((p, pi) => {
            const paraKey = `${section.id}:${pi}:${p.en.length}:${String(p.en.slice(0, 96))}`
            return renderSectionParagraph(section.id, p[locale], paraKey)
          })}
      {useSequence
        ? null
        : section.codeBlocks?.map((c) => (
            <CodeBlock
              key={c.id}
              code={c.code}
              language={c.language}
              locale={locale}
            />
          ))}
    </section>
  )
}

const TRACK_NEXT_LEVEL: Partial<Record<TopicLevel, TopicLevel>> = {
  beginner: "intermediate",
  intermediate: "advanced",
}

function TrackCompletionBanner({
  level,
  trackSlugs,
  nextLevelFirstSlug,
  locale,
}: {
  level: TopicLevel
  trackSlugs: string[]
  nextLevelFirstSlug: string | undefined
  locale: AppLocale
}) {
  const t = STRINGS[locale]
  const [show, setShow] = useState(false)

  useEffect(() => {
    const progress = loadPlaywrightLearnProgress()
    const allDone =
      trackSlugs.length > 0 &&
      trackSlugs.every((slug) => progress.topics[slug]?.quizCompletedOnce)
    setShow(allDone)
    if (allDone && !progress.completedTracks?.includes(level)) {
      savePlaywrightLearnProgress({
        ...progress,
        completedTracks: [...(progress.completedTracks ?? []), level],
      })
    }
  }, [level, trackSlugs])

  if (!show) return null

  const currentLabel = TRACK_LEVEL_LABELS[level][locale]
  const nextLevel = TRACK_NEXT_LEVEL[level]
  const nextLabel = nextLevel ? TRACK_LEVEL_LABELS[nextLevel][locale] : null

  return (
    <div
      style={{
        marginTop: 20,
        padding: "14px 18px",
        borderRadius: 12,
        background: "#22c55e14",
        border: "1px solid #22c55e33",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "8px 16px",
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, color: "#22c55e" }}>
        ✓ {currentLabel} {t.trackComplete}
      </span>
      {nextLabel && nextLevelFirstSlug ? (
        <Link
          href={learnTopicHref(locale, nextLevelFirstSlug)}
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#22c55e",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {t.continueTo} {nextLabel} <ArrowRightIcon size={12} />
        </Link>
      ) : (
        <span style={{ fontSize: 13, color: "#22c55e" }}>
          {t.allTracksComplete}
        </span>
      )}
    </div>
  )
}

export function TopicView({
  topic,
  adjacent,
  locale,
  trackTotal,
  trackAdjacent,
  trackSlugs,
  nextLevelFirstSlug,
}: Props) {
  const t = STRINGS[locale]
  const quizHref = learnTopicQuizHref(locale, topic.slug)
  const hasQuiz = topic.quiz.length > 0
  const nav = trackAdjacent ?? adjacent
  const showTopNav = Boolean(nav.prev || nav.next)
  const hasToc = topic.sections.length > 1
  const showTopBand = showTopNav || hasToc

  return (
    <article
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 24px 80px",
        color: "var(--ink)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        <Link
          href={learnIndexHref(locale)}
          data-testid="learn-back-to-index"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12.5,
            color: "var(--ink-3)",
          }}
        >
          <ArrowLeftIcon size={12} /> {t.backToIndex}
        </Link>
        {trackTotal != null && (
          <span
            style={{
              fontSize: 12,
              color: "var(--ink-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ opacity: 0.4 }}>·</span>
            {TRACK_LEVEL_LABELS[topic.level][locale]}
            <span style={{ opacity: 0.4 }}>·</span>
            {topic.trackOrder} / {trackTotal}
          </span>
        )}
      </div>

      <header>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: -0.4,
            margin: 0,
            color: "var(--ink)",
          }}
        >
          {topic.title[locale]}
        </h1>
        {(() => {
          const summaryText = stripDocsImportMarkers(topic.summary[locale])
          if (summaryText === null) return null
          return (
            <p
              style={{
                marginTop: 10,
                fontSize: 16,
                color: "var(--ink-2)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {renderInlineMarkdown(summaryText, "topic-summary")}
            </p>
          )
        })()}
      </header>

      {showTopBand ? (
        <div
          style={{
            marginTop: 20,
            paddingBottom: 20,
            borderBottom: "1px solid var(--line)",
          }}
        >
          {showTopNav ? (
            <TopicAdjacentNav
              adjacent={nav}
              locale={locale}
              testIdSuffix="-top"
            />
          ) : null}
          {hasToc ? (
            <div
              data-testid="learn-toc-inline"
              style={{ marginTop: showTopNav ? 16 : 0 }}
            >
              <TableOfContents sections={topic.sections} locale={locale} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 24,
          minWidth: 0,
        }}
      >
        {topic.sections.map((s) => (
          <SectionBlock key={s.id} section={s} locale={locale} />
        ))}

        <div style={{ marginTop: 36 }}>
          {hasQuiz ? (
            <Link
              href={quizHref}
              data-testid="learn-take-quiz"
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
              {t.takeQuiz}
            </Link>
          ) : null}
        </div>

        <footer
          style={{
            marginTop: 40,
            paddingTop: 20,
            borderTop: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px 20px",
            }}
          >
            <a
              href={topic.officialDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "var(--ink-3)",
              }}
            >
              {t.officialDocs} <ExternalIcon size={12} />
            </a>
            {topic.extraOfficialLinks?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: "var(--ink-3)",
                }}
              >
                {link.label[locale]} <ExternalIcon size={12} />
              </a>
            ))}
          </div>

          <TopicAdjacentNav adjacent={nav} locale={locale} testIdSuffix="" />
          {trackSlugs && trackSlugs.length > 0 ? (
            <TrackCompletionBanner
              level={topic.level}
              trackSlugs={trackSlugs}
              nextLevelFirstSlug={nextLevelFirstSlug}
              locale={locale}
            />
          ) : null}
        </footer>
      </div>
    </article>
  )
}
