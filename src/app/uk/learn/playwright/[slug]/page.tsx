import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { TopicView } from "@/components/playwright-learn/topic-view"
import {
  getAdjacentTopics,
  getAdjacentTopicsInTrack,
  getAllSlugs,
  getNextLevelFirstSlug,
  getTopicBySlug,
  getTopicsByLevel,
} from "@/lib/playwright-learn/catalog"

type PageParams = { slug: string }

export function generateStaticParams(): PageParams[] {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { slug } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) return { title: "Тему не знайдено · Навчання Playwright" }
  return {
    title: `${topic.title.uk} · Навчання Playwright`,
    description: topic.summary.uk,
  }
}

export default async function LearnPlaywrightTopicUkPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { slug } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) notFound()
  const adjacent = getAdjacentTopics(slug)
  const trackTopics = getTopicsByLevel(topic.level)
  const trackTotal = trackTopics.length
  const trackSlugs = trackTopics.map((t) => t.slug)
  const trackAdjacent = getAdjacentTopicsInTrack(slug)
  const nextLevelFirstSlug = getNextLevelFirstSlug(topic.level)
  return (
    <TopicView
      topic={topic}
      adjacent={adjacent}
      locale="uk"
      trackTotal={trackTotal}
      trackAdjacent={trackAdjacent}
      trackSlugs={trackSlugs}
      nextLevelFirstSlug={nextLevelFirstSlug}
    />
  )
}
