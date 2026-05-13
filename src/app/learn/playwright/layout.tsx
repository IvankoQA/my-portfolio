import type { Metadata } from "next"
import type { ReactNode } from "react"
import { LearnPlaywrightLayoutShell } from "@/components/playwright-learn/learn-shell"

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
  return <LearnPlaywrightLayoutShell>{children}</LearnPlaywrightLayoutShell>
}
