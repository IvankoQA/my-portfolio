import type { AppLocale } from "@/lib/i18n/locale"

/** English route segment (without locale prefix). */
export const PLAYWRIGHT_LEARN_PATH = "/learn/playwright"

export function isPlaywrightLearnPath(pathname: string | null): boolean {
  if (!pathname) return false
  if (pathname === PLAYWRIGHT_LEARN_PATH) return true
  if (pathname.startsWith(`${PLAYWRIGHT_LEARN_PATH}/`)) return true
  const ukBase = `/uk${PLAYWRIGHT_LEARN_PATH}`
  if (pathname === ukBase) return true
  if (pathname.startsWith(`${ukBase}/`)) return true
  return false
}

export function learnIndexHref(locale: AppLocale): string {
  return locale === "uk" ? `/uk${PLAYWRIGHT_LEARN_PATH}` : PLAYWRIGHT_LEARN_PATH
}

export function learnTopicHref(locale: AppLocale, slug: string): string {
  const base = learnIndexHref(locale)
  return `${base}/${slug}`
}

export function learnTopicQuizHref(locale: AppLocale, slug: string): string {
  return `${learnTopicHref(locale, slug)}/quiz`
}

/**
 * Current topic slug from a Learn pathname, or null (index / unknown).
 * Handles `/learn/playwright/intro`, `/learn/playwright/intro/quiz`, UK variants.
 */
export function parseLearnTopicSlug(
  pathname: string | null,
  locale: AppLocale,
): string | null {
  if (!pathname) return null
  const prefix =
    locale === "uk"
      ? `/uk${PLAYWRIGHT_LEARN_PATH}/`
      : `${PLAYWRIGHT_LEARN_PATH}/`
  if (!pathname.startsWith(prefix)) return null
  const rest = pathname.slice(prefix.length)
  const parts = rest.split("/").filter(Boolean)
  if (parts.length === 0) return null
  const first = parts[0]
  if (!first || first === "quiz") return null
  return first
}
