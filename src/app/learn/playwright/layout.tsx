import type { Metadata } from "next"
import type { ReactNode } from "react"
import { LearnPlaywrightLayoutShell } from "@/components/playwright-learn/learn-shell"
import { getTopicNavByGroup } from "@/lib/playwright-learn/catalog"

export const metadata: Metadata = {
  title: "Learn Playwright · Ivan Kozenko",
  description:
    "Bilingual EN/UK short notes on Playwright with examples and a self-check quiz per topic.",
}

export default function LearnPlaywrightLayout({
  children,
}: {
  children: ReactNode
}) {
  const topicNav = getTopicNavByGroup()
  return (
    <LearnPlaywrightLayoutShell locale="en" topicNav={topicNav}>
      {children}
    </LearnPlaywrightLayoutShell>
  )
}
