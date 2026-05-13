import type { Metadata } from "next"
import type { ReactNode } from "react"
import { LearnPlaywrightLayoutShell } from "@/components/playwright-learn/learn-shell"

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
  return <LearnPlaywrightLayoutShell>{children}</LearnPlaywrightLayoutShell>
}
