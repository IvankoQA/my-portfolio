"use client"

import { useEffect, useState } from "react"

export function useSandboxSession(): string | null {
  const [sessionKey, setSessionKey] = useState<string | null>(null)

  useEffect(() => {
    let key = localStorage.getItem("sandbox_session_key")
    if (!key) {
      key = crypto.randomUUID()
      localStorage.setItem("sandbox_session_key", key)
    }
    setSessionKey(key)
  }, [])

  return sessionKey
}
