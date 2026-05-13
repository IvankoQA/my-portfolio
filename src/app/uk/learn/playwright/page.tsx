import type { Metadata } from "next"
import { LearnPlaywrightIntro } from "@/components/playwright-learn/learn-intro"

export const metadata: Metadata = {
  title: "Нотатки та тести з Playwright · Ivan Kozenko",
  description:
    "Стислі двомовні нотатки з Playwright і квізи після тем — компактний супутник до офіційної документації.",
}

export default function LearnPlaywrightIndexUkPage() {
  return <LearnPlaywrightIntro locale="uk" />
}
