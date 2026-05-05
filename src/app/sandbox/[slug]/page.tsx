"use client"

import { useEffect } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { getLocaleFromPathname, localizePath } from "@/lib/i18n/locale"

export default function ScenarioPage() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ slug: string }>()
  const locale = getLocaleFromPathname(pathname || "/")

  useEffect(() => {
    const slug = params?.slug
    if (slug) {
      router.replace(localizePath("/sandbox", locale))
    }
  }, [params?.slug, router, locale])

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Redirecting to unified sandbox challenge…
    </div>
  )
}
