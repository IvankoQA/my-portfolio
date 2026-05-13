"use client"

import type { ReactNode } from "react"

export function LearnPlaywrightLayoutShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="learn-shell">
      <div className="learn-shell-inner">
        <main className="learn-shell-main">{children}</main>
      </div>
    </div>
  )
}
