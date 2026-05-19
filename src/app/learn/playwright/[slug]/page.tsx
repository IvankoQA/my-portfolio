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
  getTrackPosition,
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
  if (!topic) return { title: "Topic not found · Learn Playwright" }
  return {
    title: `${topic.title.en} · Learn Playwright`,
    description: topic.summary.en,
  }
}

export default async function LearnPlaywrightTopicPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { slug } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) notFound()
  const adjacent = getAdjacentTopics(slug)
  const trackTopics = getTopicsByLevel(topic.level)
  const trackSlugs = trackTopics.map((t) => t.slug)
  const trackAdjacent = getAdjacentTopicsInTrack(slug)
  const trackPosition = getTrackPosition(slug)
  const nextLevelFirstSlug = getNextLevelFirstSlug(topic.level)
  return (
    <TopicView
      topic={topic}
      adjacent={adjacent}
      locale="en"
      trackPosition={trackPosition}
      trackAdjacent={trackAdjacent}
      trackSlugs={trackSlugs}
      nextLevelFirstSlug={nextLevelFirstSlug}
    />
  )
}
