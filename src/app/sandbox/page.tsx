"use client"

import { usePathname } from "next/navigation"
import { VibeSandboxShell } from "@/components/sandbox/vibe-store/vibe-sandbox-store"
import { getLocaleFromPathname } from "@/lib/i18n/locale"

export default function SandboxPage() {
  const pathname = usePathname()
  const appLocale = getLocaleFromPathname(pathname)

  return <VibeSandboxShell appLocale={appLocale} />
}
