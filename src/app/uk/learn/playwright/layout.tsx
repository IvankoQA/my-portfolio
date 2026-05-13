import type { Metadata } from "next"
import type { ReactNode } from "react"
import { LearnPlaywrightLayoutShell } from "@/components/playwright-learn/learn-shell"
import { getTopicNavByGroup } from "@/lib/playwright-learn/catalog"

export const metadata: Metadata = {
  title: "Навчання Playwright · Ivan Kozenko",
  description:
    "Стислі двомовні конспекти з Playwright, приклади коду та тест для самоперевірки.",
}

export default function LearnPlaywrightUkLayout({
  children,
}: {
  children: ReactNode
}) {
  const topicNav = getTopicNavByGroup()
  return (
    <LearnPlaywrightLayoutShell locale="uk" topicNav={topicNav}>
      {children}
    </LearnPlaywrightLayoutShell>
  )
}
