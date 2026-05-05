"use client"

export type AppLocale = "en" | "uk"

export function getLocaleFromPathname(
  pathname: string | null | undefined,
): AppLocale {
  if (!pathname) return "en"
  return pathname === "/uk" || pathname.startsWith("/uk/") ? "uk" : "en"
}

export function localizePath(pathname: string, locale: AppLocale): string {
  const clean = pathname.startsWith("/uk/")
    ? pathname.slice(3)
    : pathname === "/uk"
      ? "/"
      : pathname
  if (locale === "uk") return clean === "/" ? "/uk" : `/uk${clean}`
  return clean
}
