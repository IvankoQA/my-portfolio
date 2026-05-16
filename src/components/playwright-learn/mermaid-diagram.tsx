"use client"

import { useEffect, useRef, useState } from "react"

interface MermaidDiagramProps {
  definition: string
  caption?: string
}

export function MermaidDiagram({ definition, caption }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function render() {
      if (!ref.current) return
      const theme =
        document.documentElement.dataset.theme === "dark" ? "dark" : "default"

      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({ startOnLoad: false, theme })

        const uid = `md-${Date.now()}-${Math.random().toString(36).slice(2)}`
        const { svg } = await mermaid.render(uid, definition)

        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
          setError(false)
        }
      } catch (e) {
        console.warn("[MermaidDiagram]", e)
        if (!cancelled) setError(true)
      }
    }

    render()

    const observer = new MutationObserver(() => render())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [definition])

  if (error) {
    return (
      <figure className="my-4">
        <pre className="rounded bg-muted p-3 text-xs text-muted-foreground whitespace-pre-wrap">
          {`Diagram unavailable\n\n${definition}`}
        </pre>
        {caption && (
          <figcaption className="mt-1 text-center text-xs text-muted-foreground">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <figure className="my-6 flex flex-col items-center">
      <div ref={ref} className="w-full overflow-x-auto" />
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
