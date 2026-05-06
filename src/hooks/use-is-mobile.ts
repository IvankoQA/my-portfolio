"use client"

import { useEffect, useState } from "react"

const MOBILE_QUERY = "(max-width: 768px)"

/** SSR-safe: returns false until mounted, then tracks matchMedia. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = globalThis.matchMedia(MOBILE_QUERY)
    function update() {
      setIsMobile(mq.matches)
    }
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return isMobile
}
