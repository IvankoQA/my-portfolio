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

type TokenKind = "keyword" | "string" | "comment" | "number" | "plain"

type Token = { kind: TokenKind; text: string; offset: number }

const JS_KEYWORDS = new Set([
  "async",
  "await",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "interface",
  "let",
  "new",
  "null",
  "of",
  "return",
  "static",
  "super",
  "switch",
  "test",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "var",
  "void",
  "while",
  // testing helpers
  "describe",
  "it",
  "expect",
  "beforeAll",
  "afterAll",
  "beforeEach",
  "afterEach",
])

const CS_KEYWORDS = new Set([
  "abstract",
  "as",
  "async",
  "await",
  "base",
  "bool",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "checked",
  "class",
  "const",
  "continue",
  "decimal",
  "default",
  "delegate",
  "do",
  "double",
  "else",
  "enum",
  "event",
  "explicit",
  "extern",
  "false",
  "finally",
  "fixed",
  "float",
  "for",
  "foreach",
  "goto",
  "if",
  "implicit",
  "in",
  "int",
  "interface",
  "internal",
  "is",
  "lock",
  "long",
  "namespace",
  "new",
  "null",
  "object",
  "operator",
  "out",
  "override",
  "params",
  "private",
  "protected",
  "public",
  "readonly",
  "ref",
  "return",
  "sbyte",
  "sealed",
  "short",
  "sizeof",
  "stackalloc",
  "static",
  "string",
  "struct",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "uint",
  "ulong",
  "unchecked",
  "unsafe",
  "ushort",
  "using",
  "virtual",
  "void",
  "volatile",
  "while",
  "var",
  "async",
  "partial",
  "where",
])

function tokenize(code: string, lang: string): Token[] {
  const isCs = lang === "csharp" || lang === "cs"
  const isBash = lang === "bash" || lang === "sh" || lang === "shell"
  const keywords = isCs ? CS_KEYWORDS : JS_KEYWORDS

  const tokens: Token[] = []
  let i = 0

  function pushPlain(ch: string) {
    const last = tokens[tokens.length - 1]
    if (last?.kind === "plain") {
      last.text += ch
    } else {
      tokens.push({ kind: "plain", text: ch, offset: i })
    }
  }

  while (i < code.length) {
    const ch = code[i]

    // Bash # comment
    if (isBash && ch === "#") {
      const end = code.indexOf("\n", i)
      const text = end >= 0 ? code.slice(i, end) : code.slice(i)
      tokens.push({ kind: "comment", text, offset: i })
      i += text.length
      continue
    }

    // Line comment //
    if (ch === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i)
      const text = end >= 0 ? code.slice(i, end) : code.slice(i)
      tokens.push({ kind: "comment", text, offset: i })
      i += text.length
      continue
    }

    // Block comment /* */
    if (ch === "/" && code[i + 1] === "*") {
      const end = code.indexOf("*/", i + 2)
      const text = end >= 0 ? code.slice(i, end + 2) : code.slice(i)
      tokens.push({ kind: "comment", text, offset: i })
      i += text.length
      continue
    }

    // Template literal
    if (ch === "`") {
      let j = i + 1
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2
          continue
        }
        if (code[j] === "`") {
          j++
          break
        }
        j++
      }
      tokens.push({ kind: "string", text: code.slice(i, j), offset: i })
      i = j
      continue
    }

    // Double-quoted string
    if (ch === '"') {
      let j = i + 1
      while (j < code.length && code[j] !== '"' && code[j] !== "\n") {
        if (code[j] === "\\") j++
        j++
      }
      tokens.push({ kind: "string", text: code.slice(i, j + 1), offset: i })
      i = j + 1
      continue
    }

    // Single-quoted string
    if (ch === "'") {
      let j = i + 1
      while (j < code.length && code[j] !== "'" && code[j] !== "\n") {
        if (code[j] === "\\") j++
        j++
      }
      tokens.push({ kind: "string", text: code.slice(i, j + 1), offset: i })
      i = j + 1
      continue
    }

    // Number (only at word boundary)
    if (/\d/.test(ch) && (i === 0 || !/[a-zA-Z0-9_$]/.test(code[i - 1]))) {
      let j = i
      while (j < code.length && /[\d.xXa-fA-F_]/.test(code[j])) j++
      tokens.push({ kind: "number", text: code.slice(i, j), offset: i })
      i = j
      continue
    }

    // Identifier / keyword
    if (/[a-zA-Z_$]/.test(ch)) {
      let j = i
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++
      const word = code.slice(i, j)
      tokens.push({
        kind: keywords.has(word) ? "keyword" : "plain",
        text: word,
        offset: i,
      })
      i = j
      continue
    }

    pushPlain(ch)
    i++
  }

  return tokens
}

const TOKEN_COLORS: Record<Exclude<TokenKind, "plain">, string> = {
  keyword: "var(--syntax-keyword)",
  string: "var(--syntax-string)",
  comment: "var(--syntax-comment)",
  number: "var(--syntax-number)",
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
      // ignore — clipboard may be unavailable
    }
  }

  const tokens = tokenize(code, language)

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
        <code>
          {tokens.map((tok) =>
            tok.kind === "plain" ? (
              tok.text
            ) : (
              <span key={tok.offset} style={{ color: TOKEN_COLORS[tok.kind] }}>
                {tok.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  )
}
