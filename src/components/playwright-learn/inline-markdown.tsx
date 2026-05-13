import type { CSSProperties, ReactNode } from "react"

const PLAYWRIGHT_DOCS_BASE = "https://playwright.dev/docs"

const MD_LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g

const defaultLinkStyle: CSSProperties = {
  color: "var(--accent-color)",
  textDecoration: "underline",
  textUnderlineOffset: 2,
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
 * Minimal inline Markdown: `[label](url)` only (plus `resolveInlineMarkdownHref` for targets).
 * Plain text segments are returned as spans so line breaks / `pre-wrap` on the parent still work.
 */
export function renderInlineMarkdown(
  text: string,
  keyPrefix: string,
  linkStyle: CSSProperties = defaultLinkStyle,
): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let seq = 0
  const re = new RegExp(MD_LINK_RE.source, "g")
  for (const match of text.matchAll(re)) {
    const idx = match.index ?? 0
    if (idx > last) {
      nodes.push(
        <span key={`${keyPrefix}-s-${seq}`}>{text.slice(last, idx)}</span>,
      )
      seq += 1
    }
    const label = match[1] ?? ""
    const href = resolveInlineMarkdownHref(match[2] ?? "")
    const external = href.startsWith("http://") || href.startsWith("https://")
    nodes.push(
      <a
        key={`${keyPrefix}-a-${seq}`}
        href={href}
        style={linkStyle}
        {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
      >
        {label}
      </a>,
    )
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
