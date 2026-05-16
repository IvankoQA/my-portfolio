import type { CSSProperties, ReactNode } from "react"

const PLAYWRIGHT_DOCS_BASE = "https://playwright.dev/docs"

// Matches (in order): image ![alt](url) · link [label](url) · **bold** · `code`
const INLINE_RE =
  /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]*)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g

const defaultLinkStyle: CSSProperties = {
  color: "var(--accent-color)",
  textDecoration: "underline",
  textUnderlineOffset: 2,
}

const inlineCodeStyle: CSSProperties = {
  fontFamily: "var(--font-mono, monospace)",
  fontSize: "0.875em",
  backgroundColor: "var(--surface-code, rgba(0,0,0,0.06))",
  padding: "1px 4px",
  borderRadius: 4,
}

/**
 * Turn `./page.md`, `./api/class-foo.md#hash`, `#section` into usable hrefs
 * for this site (hash) or playwright.dev (relative .md).
 */
export function resolveInlineMarkdownHref(raw: string): string {
  const t = raw.trim()
  if (t.startsWith("http://") || t.startsWith("https://")) {
    return t
  }
  if (t.startsWith("#")) {
    return t
  }
  if (t.startsWith("./") || t.startsWith("../")) {
    let rest = t
    while (rest.startsWith("../")) {
      rest = rest.slice(3)
    }
    if (rest.startsWith("./")) {
      rest = rest.slice(2)
    }
    const hashIdx = rest.indexOf("#")
    const pathPart = hashIdx >= 0 ? rest.slice(0, hashIdx) : rest
    const hash = hashIdx >= 0 ? rest.slice(hashIdx) : ""
    const noMd = pathPart.replace(/\.md$/i, "").replace(/^\/+/, "")
    if (!noMd) {
      return hash || t
    }
    return `${PLAYWRIGHT_DOCS_BASE}/${noMd}${hash}`
  }
  /** Playwright docs use root paths like `/codegen.md#anchor` in some imports. */
  if (t.startsWith("/") && !t.startsWith("//")) {
    const hashIdx = t.indexOf("#")
    const pathPart = hashIdx >= 0 ? t.slice(0, hashIdx) : t
    const hash = hashIdx >= 0 ? t.slice(hashIdx) : ""
    const noMd = pathPart.replace(/\.md$/i, "").replace(/^\/+/, "")
    if (!noMd) {
      return hash || t
    }
    return `${PLAYWRIGHT_DOCS_BASE}/${noMd}${hash}`
  }
  return raw
}

/**
 * Inline Markdown renderer: [label](url) · **bold** · `code` · ![alt](url) (renders as alt text).
 * Plain text segments are wrapped in spans so pre-wrap on the parent still works.
 */
export function renderInlineMarkdown(
  text: string,
  keyPrefix: string,
  linkStyle: CSSProperties = defaultLinkStyle,
): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let seq = 0
  const re = new RegExp(INLINE_RE.source, "g")
  for (const match of text.matchAll(re)) {
    const idx = match.index ?? 0
    if (idx > last) {
      nodes.push(
        <span key={`${keyPrefix}-s-${seq}`}>{text.slice(last, idx)}</span>,
      )
      seq += 1
    }
    if (match[1] !== undefined || match[2] !== undefined) {
      // ![alt](url) — render alt text only, no image
      const alt = match[1] ?? ""
      nodes.push(<span key={`${keyPrefix}-img-${seq}`}>{alt}</span>)
    } else if (match[3] !== undefined || match[4] !== undefined) {
      // [label](url)
      const label = match[3] ?? ""
      const href = resolveInlineMarkdownHref(match[4] ?? "")
      const external = href.startsWith("http://") || href.startsWith("https://")
      nodes.push(
        <a
          key={`${keyPrefix}-a-${seq}`}
          href={href}
          style={linkStyle}
          {...(external
            ? { rel: "noopener noreferrer", target: "_blank" }
            : {})}
        >
          {label}
        </a>,
      )
    } else if (match[5] !== undefined) {
      // **bold**
      nodes.push(<strong key={`${keyPrefix}-b-${seq}`}>{match[5]}</strong>)
    } else if (match[6] !== undefined) {
      // `code`
      nodes.push(
        <code key={`${keyPrefix}-c-${seq}`} style={inlineCodeStyle}>
          {match[6]}
        </code>,
      )
    }
    seq += 1
    last = idx + match[0].length
  }
  if (last < text.length) {
    nodes.push(<span key={`${keyPrefix}-s-${seq}`}>{text.slice(last)}</span>)
  }
  return nodes.length > 0
    ? nodes
    : [<span key={`${keyPrefix}-all`}>{text}</span>]
}
