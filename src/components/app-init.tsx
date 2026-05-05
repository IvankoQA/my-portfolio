"use client"

import { useMutation } from "convex/react"
import { useEffect, useRef } from "react"
import { api } from "../../convex/_generated/api"

export function AppInit() {
  const seedDefaults = useMutation(api.seed.seedDefaults)
  const seedSandboxData = useMutation(api.seed.seedSandboxData)
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true
    seedDefaults().catch(() => {})
    seedSandboxData().catch(() => {})
  }, [seedDefaults, seedSandboxData])

  return null
}
