"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { createPortal } from "react-dom"
import { useEffect, useRef, useState, type ReactNode } from "react"
import type { AppLocale } from "@/lib/i18n/locale"
import {
  learnTopicHref,
  parseLearnTopicSlug,
} from "@/lib/playwright-learn/paths"
import type { TopicNavGrouped } from "@/lib/playwright-learn/types"
import { TOPIC_GROUP_TITLES } from "@/lib/playwright-learn/types"

const UI = {
  en: {
    menuTopics: "Topic menu",
    closeMenu: "Close menu",
    navLabel: "Playwright learn topics",
  },
  uk: {
    menuTopics: "Меню тем",
    closeMenu: "Закрити меню",
    navLabel: "Теми навчання Playwright",
  },
} as const

function TopicNavLinks({
  locale,
  topicNav,
  activeSlug,
  onNavigate,
}: {
  locale: AppLocale
  topicNav: TopicNavGrouped
  activeSlug: string | null
  onNavigate?: () => void
}) {
  return (
    <nav aria-label={UI[locale].navLabel} className="learn-shell-topic-nav">
      {topicNav.map(({ groupId, topics }) => (
        <div key={groupId} className="learn-shell-topic-group">
          <div className="learn-shell-topic-group-title">
            {TOPIC_GROUP_TITLES[groupId][locale]}
          </div>
          <ul className="learn-shell-topic-list">
            {topics.map((topic) => {
              const href = learnTopicHref(locale, topic.slug)
              const active = activeSlug === topic.slug
              return (
                <li key={topic.slug}>
                  <Link
                    href={href}
                    data-testid={`learn-nav-${topic.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={
                      active
                        ? "learn-shell-topic-link learn-shell-topic-link--active"
                        : "learn-shell-topic-link"
                    }
                    onClick={onNavigate}
                  >
                    {topic.title[locale]}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function LearnPlaywrightLayoutShell({
  locale,
  topicNav,
  children,
}: {
  locale: AppLocale
  topicNav: TopicNavGrouped
  children: ReactNode
}) {
  const pathname = usePathname()
  const activeSlug = parseLearnTopicSlug(pathname, locale)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const t = UI[locale]

  useEffect(() => {
    setPortalTarget(document.body)
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: close drawer on any route change (e.g. same slug → /quiz).
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!drawerOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [drawerOpen])

  useEffect(() => {
    if (!drawerOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false)
    }
    globalThis.addEventListener("keydown", onKey)
    return () => globalThis.removeEventListener("keydown", onKey)
  }, [drawerOpen])

  useEffect(() => {
    if (drawerOpen) closeBtnRef.current?.focus()
  }, [drawerOpen])

  const drawer =
    drawerOpen && portalTarget ? (
      <>
        <button
          type="button"
          className="learn-shell-drawer-backdrop"
          aria-label={t.closeMenu}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          id="learn-topic-drawer"
          className="learn-shell-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t.menuTopics}
        >
          <div className="learn-shell-drawer-header">
            <span className="learn-shell-drawer-title">{t.menuTopics}</span>
            <button
              ref={closeBtnRef}
              type="button"
              className="learn-shell-drawer-close"
              data-testid="learn-close-topic-menu"
              onClick={() => setDrawerOpen(false)}
            >
              {t.closeMenu}
            </button>
          </div>
          <div className="learn-shell-drawer-scroll">
            <TopicNavLinks
              locale={locale}
              topicNav={topicNav}
              activeSlug={activeSlug}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </aside>
      </>
    ) : null

  return (
    <div className="learn-shell">
      <div className="learn-shell-toolbar">
        <button
          type="button"
          className="learn-shell-menu-btn"
          aria-expanded={drawerOpen}
          aria-controls="learn-topic-drawer"
          data-testid="learn-open-topic-menu"
          onClick={() => setDrawerOpen(true)}
        >
          {t.menuTopics}
        </button>
      </div>

      <div className="learn-shell-inner">
        {drawer && portalTarget ? createPortal(drawer, portalTarget) : null}

        <main className="learn-shell-main">{children}</main>
      </div>
    </div>
  )
}
