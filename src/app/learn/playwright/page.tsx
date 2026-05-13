import type { Metadata } from "next"
import { LearnPlaywrightIntro } from "@/components/playwright-learn/learn-intro"

export const metadata: Metadata = {
  title: "Playwright notes & quizzes · Ivan Kozenko",
  description:
    "Compact bilingual notes on Playwright with per-topic quizzes — a tighter companion to the official docs.",
}

export default function LearnPlaywrightIndexPage() {
  return <LearnPlaywrightIntro locale="en" />
}
