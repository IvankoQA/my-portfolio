import { getAllSlugs } from "../../src/lib/playwright-learn/catalog"

/** Ukrainian learn Playwright index (no trailing slash). */
export const UK_LEARN_PLAYWRIGHT_INDEX = "/uk/learn/playwright"

export function ukLearnTopicPath(slug: string): string {
  return `${UK_LEARN_PLAYWRIGHT_INDEX}/${slug}`
}

export function ukLearnQuizPath(slug: string): string {
  return `${ukLearnTopicPath(slug)}/quiz`
}

/** Index + every topic and quiz path under the UK learn tree. */
export function allUkLearnPlaywrightPaths(): string[] {
  const slugs = getAllSlugs()
  return [
    UK_LEARN_PLAYWRIGHT_INDEX,
    ...slugs.flatMap((slug) => [ukLearnTopicPath(slug), ukLearnQuizPath(slug)]),
  ]
}

export { getAllSlugs }
