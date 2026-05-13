"use client"

import type { AppLocale } from "@/lib/i18n/locale"
import type { TopicSection } from "@/lib/playwright-learn/types"

type Props = {
  sections: TopicSection[]
  locale: AppLocale
  /** Extra id appended to fieldset/quiz so the TOC can include them. */
  extraItems?: { id: string; label: string }[]
}

const TITLE: Record<AppLocale, string> = {
  en: "On this page",
  uk: "На цій сторінці",
}

export function TableOfContents({ sections, locale, extraItems }: Props) {
  if (sections.length + (extraItems?.length ?? 0) <= 1) return null
  return (
    <nav
      className="learn-toc-nav"
      aria-label={TITLE[locale]}
      data-testid="learn-toc"
      style={{
        padding: "12px 14px",
        border: "1px solid var(--line)",
        borderRadius: 10,
        background: "var(--bg-elev)",
        fontSize: 13,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "var(--ink-3)",
          marginBottom: 8,
          fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
        }}
      >
        {TITLE[locale]}
      </div>
      <ul className="learn-toc-list">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>{s.title[locale]}</a>
          </li>
        ))}
        {extraItems?.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
