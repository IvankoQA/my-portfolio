import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { QuizTopicView } from "@/components/playwright-learn/quiz-topic-view"
import {
  getAllSlugs,
  getAdjacentTopics,
  getTopicBySlug,
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
  if (!topic) return { title: "Quiz · Learn Playwright" }
  return {
    title: `Quiz: ${topic.title.en} · Learn Playwright`,
    description: topic.summary.en,
  }
}

export default async function LearnPlaywrightQuizPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { slug } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) notFound()
  const adjacent = getAdjacentTopics(slug)
  return <QuizTopicView topic={topic} locale="en" adjacent={adjacent} />
}
