import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { QuizTopicView } from "@/components/playwright-learn/quiz-topic-view"
import { getAllSlugs, getTopicBySlug } from "@/lib/playwright-learn/catalog"

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
  if (!topic) return { title: "Тест · Навчання Playwright" }
  return {
    title: `Тест: ${topic.title.uk} · Навчання Playwright`,
    description: topic.summary.uk,
  }
}

export default async function LearnPlaywrightQuizUkPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const { slug } = await params
  const topic = getTopicBySlug(slug)
  if (!topic) notFound()
  return <QuizTopicView topic={topic} locale="uk" />
}
