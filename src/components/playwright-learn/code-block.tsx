"use client"

import { useState } from "react"
import type { AppLocale } from "@/lib/i18n/locale"
import { CheckIcon, CopyIcon } from "./icons"

type Props = {
  code: string
  language: string
  locale: AppLocale
}

const COPY_LABEL: Record<AppLocale, { idle: string; done: string }> = {
  en: { idle: "Copy", done: "Copied" },
  uk: { idle: "Копіювати", done: "Скопійовано" },
}

export function CodeBlock({ code, language, locale }: Props) {
  const [copied, setCopied] = useState(false)
  const label = COPY_LABEL[locale]

  if (!code.trim()) {
    return null
  }

  async function onCopy() {
    try {
      await globalThis.navigator.clipboard.writeText(code)
      setCopied(true)
      globalThis.setTimeout(() => setCopied(false), 1600)
    } catch {
      // ignore — clipboard may be unavailable (file://, denied permissions)
    }
  }

  return (
    <div
      style={{
        position: "relative",
        border: "1px solid var(--line)",
        borderRadius: 10,
        background: "var(--bg-tile)",
        overflow: "hidden",
        margin: "12px 0 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          background: "var(--chip-bg)",
          borderBottom: "1px solid var(--line)",
          fontSize: 11,
          color: "var(--ink-3)",
          fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
        }}
      >
        <span style={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
          {language}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? label.done : label.idle}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            border: "1px solid var(--line)",
            borderRadius: 6,
            background: "transparent",
            color: "var(--ink-2)",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          {copied ? label.done : label.idle}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "12px 14px",
          fontSize: 13,
          lineHeight: 1.55,
          color: "var(--ink)",
          fontFamily: "var(--font-jetbrains-mono, ui-monospace, monospace)",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  )
}
