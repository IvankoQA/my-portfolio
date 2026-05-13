/** Bilingual copy for EN (`/`) and UK (`/uk/...`) routes. */
export type Localized = {
  en: string
  uk: string
}

export type TopicLevel = "beginner" | "intermediate" | "advanced"

export type TopicGroupId =
  | "intro"
  | "getting-started"
  | "writing-tests"
  | "running-tests"
  | "configuration"
  | "guides"
  | "integrations"
  /** @playwright/test runner, fixtures, reporters, etc. */
  | "test-runner"
  /** CI, Docker, sharding */
  | "ci"
  /** Puppeteer / Protractor migration */
  | "migration"

export type CodeBlock = {
  id: string
  language: string
  code: string
}

/** When set, renders in order (text ↔ code) instead of all paragraphs then all code blocks. */
export type TopicSequenceItem =
  | ({ kind: "text" } & Localized)
  | { kind: "code"; block: CodeBlock }

export type TopicSection = {
  /** Stable anchor id (ASCII), used for TOC links. */
  id: string
  title: Localized
  paragraphs?: Localized[]
  codeBlocks?: CodeBlock[]
  sequence?: TopicSequenceItem[]
}

export type QuizOption = {
  id: string
  label: Localized
}

export type QuizQuestion = {
  id: string
  prompt: Localized
  options: QuizOption[]
  correctOptionId: string
  /** Shown for every question in review mode (correct + incorrect answers). */
  rationale: Localized
}

export type PlaywrightTopic = {
  slug: string
  groupId: TopicGroupId
  /** Sort key within the full catalog (lower = earlier). */
  order: number
  /** Learning track this topic belongs to. */
  level: TopicLevel
  /** Sort key within the level track (lower = earlier). */
  trackOrder: number
  title: Localized
  /** Short line for the index card. */
  summary: Localized
  /** Optional upstream doc filename for coverage tracking. */
  sourceDoc?: string
  /** Official Playwright doc URL (footer + “read more”). */
  officialDocsUrl: string
  /** Extra official doc links (e.g. second upstream page for merged topics). */
  extraOfficialLinks?: { url: string; label: Localized }[]
  sections: TopicSection[]
  quiz: QuizQuestion[]
}

export type AdjacentTopics = {
  prev?: Pick<PlaywrightTopic, "slug" | "title">
  next?: Pick<PlaywrightTopic, "slug" | "title">
}

/** Lightweight nav payload for client layout (no full topic bodies). */
export type TopicNavTopic = Pick<PlaywrightTopic, "slug" | "title">

export type TopicNavGrouped = {
  groupId: TopicGroupId
  topics: TopicNavTopic[]
}[]

export const TOPIC_GROUP_TITLES: Record<TopicGroupId, Localized> = {
  intro: { en: "Introduction", uk: "Вступ" },
  "getting-started": { en: "Getting started", uk: "Початок роботи" },
  "writing-tests": { en: "Writing tests", uk: "Написання тестів" },
  "running-tests": { en: "Running tests", uk: "Запуск тестів" },
  configuration: { en: "Configuration", uk: "Конфігурація" },
  guides: { en: "Guides", uk: "Гайди" },
  integrations: { en: "Integrations", uk: "Інтеграції" },
  "test-runner": { en: "Playwright Test", uk: "Playwright Test" },
  ci: { en: "CI and tooling", uk: "CI та інструменти" },
  migration: { en: "Migration", uk: "Міграція" },
}
