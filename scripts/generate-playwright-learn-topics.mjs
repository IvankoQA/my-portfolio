#!/usr/bin/env node
/**
 * Local-only: scan Playwright docs/src root (*.md, no subdirs), emit
 * src/lib/playwright-learn/topics/auto/*.ts + topics/auto/index.ts
 *
 * Usage:
 *   node ./scripts/generate-playwright-learn-topics.mjs --docs-root=/path/to/playwright/docs/src
 *
 * Skips hand-maintained slugs: intro, writing-tests, running-tests.
 * Translates EN→UK via Lingva (Google proxy) → LibreTranslate public instances →
 * MyMemory + .cache/playwright-learn-translate.json (all free; no API keys).
 */

import crypto from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, "..")
const OUT_DIR = path.join(REPO_ROOT, "src/lib/playwright-learn/topics/auto")
const CACHE_PATH = path.join(
  REPO_ROOT,
  ".cache/playwright-learn-translate.json",
)

const HAND_SLUGS = new Set(["intro", "writing-tests", "running-tests"])

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function hash(s) {
  return crypto
    .createHash("sha256")
    .update(s, "utf8")
    .digest("hex")
    .slice(0, 32)
}

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"))
  } catch {
    return {}
  }
}

function saveCache(c) {
  fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true })
  fs.writeFileSync(CACHE_PATH, JSON.stringify(c, null, 2), "utf8")
}

/** Max path length for Lingva GET (URL + encoded body limits). */
const LINGVA_CHUNK = 1100

function splitTextForLingva(text) {
  if (text.length <= LINGVA_CHUNK) return [text]
  const parts = []
  let rest = text
  while (rest.length > LINGVA_CHUNK) {
    let cut = rest.lastIndexOf("\n\n", LINGVA_CHUNK)
    let advance = 2
    if (cut < LINGVA_CHUNK / 4) {
      cut = rest.lastIndexOf("\n", LINGVA_CHUNK)
      advance = 1
    }
    if (cut < LINGVA_CHUNK / 4) {
      cut = rest.lastIndexOf(". ", LINGVA_CHUNK)
      advance = 2
    }
    if (cut < LINGVA_CHUNK / 4) {
      cut = rest.lastIndexOf(" ", LINGVA_CHUNK)
      advance = 1
    }
    if (cut < 0) {
      cut = LINGVA_CHUNK
      advance = 0
    }
    const end = advance ? cut + advance : cut
    parts.push(rest.slice(0, end).trimEnd())
    rest = rest.slice(end).trimStart()
  }
  if (rest) parts.push(rest)
  return parts
}

async function tryLingva(text) {
  const bases = ["https://lingva.ml"]
  const chunks = splitTextForLingva(text)
  const out = []
  for (const chunk of chunks) {
    const enc = encodeURIComponent(chunk)
    if (enc.length > 1800) return null
    let got = null
    for (const base of bases) {
      const url = `${base}/api/v1/en/uk/${enc}`
      try {
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        })
        if (!res.ok) continue
        const j = await res.json()
        const tr = j?.translation
        if (typeof tr === "string" && tr.length) {
          got = tr
          break
        }
      } catch {
        /* next host */
      }
    }
    if (!got) return null
    out.push(got)
    if (chunks.length > 1) await sleep(120)
  }
  return out.join("\n\n")
}

async function tryLibreTranslate(text) {
  const endpoints = [
    "https://libretranslate.de/translate",
    "https://translate.argosopentech.com/translate",
    "https://translate.fedilab.app/translate",
    "https://translate.nick.yt/translate",
    "https://libretranslate.pussthecat.org/translate",
  ]
  const body = JSON.stringify({
    q: text,
    source: "en",
    target: "uk",
    format: "text",
  })
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      })
      if (!res.ok) continue
      const j = await res.json()
      const t = j.translatedText
      if (typeof t === "string" && t.length) return t
    } catch {
      /* try next */
    }
  }
  return null
}

async function tryMyMemory(text) {
  const u = new URL("https://api.mymemory.translated.net/get")
  u.searchParams.set("q", text.slice(0, 480))
  u.searchParams.set("langpair", "en|uk")
  const res = await fetch(u)
  if (!res.ok) return null
  const j = await res.json()
  const t = j?.responseData?.translatedText
  if (typeof t === "string" && t.length && !t.includes("MYMEMORY WARNING")) {
    return t
  }
  return null
}

async function translateEnUk(text, cache) {
  const t = text.trim()
  if (!t) return ""
  const h = hash(t)
  if (cache[h]) {
    const c = cache[h]
    // Drop stale identity “translations” from cache (e.g. API rate limits).
    if (!(c === t && t.length > 80)) return c
  }
  let uk =
    (await tryLingva(t)) ||
    (await tryLibreTranslate(t)) ||
    (await tryMyMemory(t))
  if (!uk) uk = t
  if (uk === t && t.length > 80 && /[A-Za-z]{4}/.test(t)) {
    await sleep(250)
    const u2 =
      (await tryLingva(t)) ||
      (await tryLibreTranslate(t)) ||
      (await tryMyMemory(t))
    if (u2 && u2 !== t) uk = u2
  }
  cache[h] = uk
  await sleep(45)
  return uk
}

async function mapPool(items, limit, mapper) {
  const results = new Array(items.length)
  let idx = 0
  async function worker() {
    while (true) {
      const j = idx++
      if (j >= items.length) return
      results[j] = await mapper(items[j], j)
    }
  }
  const n = Math.min(limit, Math.max(1, items.length))
  await Promise.all(Array.from({ length: n }, () => worker()))
  return results
}

async function translateLong(text, cache) {
  const t = text.trim()
  if (!t) return ""
  if (t.length <= 480) return translateEnUk(t, cache)
  const out = []
  let rest = t
  while (rest.length) {
    let chunk = rest.slice(0, 480)
    if (rest.length > 480) {
      const cut = Math.max(
        chunk.lastIndexOf("\n\n"),
        chunk.lastIndexOf(". "),
        chunk.lastIndexOf("! "),
      )
      if (cut > 120) chunk = rest.slice(0, cut + 1)
    }
    out.push(await translateEnUk(chunk, cache))
    rest = rest.slice(chunk.length).trimStart()
  }
  return out.join("\n\n")
}

function parseArgs(argv) {
  let docsRoot = ""
  let maxFiles = Infinity
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--docs-root=")) {
      docsRoot = a.slice("--docs-root=".length)
    } else if (a === "--docs-root" && argv[i + 1]) {
      docsRoot = argv[++i]
    } else if (a.startsWith("--max=")) {
      maxFiles = Number.parseInt(a.slice("--max=".length), 10)
    } else if (a === "--max" && argv[i + 1]) {
      maxFiles = Number.parseInt(argv[++i], 10)
    }
  }
  if (!docsRoot) {
    docsRoot =
      process.env.PLAYWRIGHT_DOCS_ROOT ||
      "/Users/ivan/Downloads/playwright-main-1/docs/src"
  }
  return { docsRoot, maxFiles }
}

function shouldIncludeFile(name) {
  if (!name.endsWith(".md") || name.includes("/")) return false
  if (name.startsWith("release-notes-")) return false
  if (name.startsWith("canary-")) return false
  if (name.endsWith("-python.md")) return false
  if (name.endsWith("-java.md")) return false
  if (name.endsWith("-csharp.md")) return false
  if (name === "test-assertions-csharp-java-python.md") return false
  if (name === "chrome-extensions-js-python.md") return false
  if (name === "service-workers-js-python.md") return false
  return true
}

function parseFrontMatter(raw) {
  if (!raw.startsWith("---")) return { data: {}, body: raw }
  const end = raw.indexOf("\n---", 3)
  if (end === -1) return { data: {}, body: raw }
  const yaml = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).trim()
  const data = {}
  for (const line of yaml.split("\n")) {
    const m = line.match(/^(\w+):\s*(.+)$/)
    if (!m) continue
    let v = m[2].trim()
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
    data[m[1]] = v
  }
  return { data, body }
}

function stripMdx(s) {
  let t = s
  t = t.replace(/^import .+$/gm, "")
  t = t.replace(/<Tabs[^>]*>[\s\S]*?<\/Tabs>/gi, "")
  t = t.replace(/<TabItem[^>]*>[\s\S]*?<\/TabItem>/gi, "")
  t = t.replace(/<Admonition[^>]*>[\s\S]*?<\/Admonition>/gi, "")
  t = t.replace(/<LiteYouTube[^>]*\/>/gi, "")
  t = t.replace(/<Card[^>]*>[\s\S]*?<\/Card>/gi, "")
  t = t.replace(/<[^>\n]{1,120}>/g, "")
  // Docusaurus :::note / :::tip … ::: blocks
  t = t.replace(/:::[a-zA-Z]*[^\n]*\n[\s\S]*?\n:::\s*/g, "\n")
  t = t.replace(/^:::+\s*$/gm, "")
  return t.replace(/\n{3,}/g, "\n\n").trim()
}

function fixDocLinks(s) {
  return s
    .replace(/\]\(\/docs\/([^)]+)\)/g, "](https://playwright.dev/docs/$1)")
    .replace(/\]\(\/api\/([^)]+)\)/g, "](https://playwright.dev/api/$1)")
}

function sectionIdFromHeading(heading) {
  const t = heading.trim()
  const anchor = t.match(/\{#([^}]+)\}\s*$/)
  if (anchor) return anchor[1].replace(/[^a-z0-9-]/gi, "-").toLowerCase()
  return (
    t
      .replace(/\{#([^}]+)\}\s*$/i, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 72) || "section"
  )
}

function extractFencedCode(text) {
  const codeBlocks = []
  let plain = ""
  let last = 0
  // First line after ``` may be "js", "js tab=js-ts", "ts {4-5}", etc. (not only [\w-]+)
  const re = /```([^\n]*)\r?\n([\s\S]*?)```/g
  for (;;) {
    const m = re.exec(text)
    if (!m) break
    plain += text.slice(last, m.index)
    const info = (m[1] || "").trim()
    const firstTok = info.split(/\s+/)[0] || ""
    const langMatch = firstTok.match(/^[\w.#@-]+/)
    const lang = (langMatch ? langMatch[0] : "txt").toLowerCase() || "txt"
    codeBlocks.push({
      language: lang,
      code: m[2].replace(/\r\n/g, "\n").trimEnd(),
    })
    last = m.index + m[0].length
  }
  plain += text.slice(last)
  return { plain: plain.trim(), codeBlocks }
}

function splitParagraphs(plain) {
  return plain
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Drop orphan fence lines left after partial MDX/tab stripping. */
function filterNoiseParagraphs(paras) {
  return paras.filter((p) => {
    const t = p.trim()
    if (!t) return false
    if (/^`{3,}\s*\S*$/.test(t)) return false
    return true
  })
}

function splitSections(body) {
  const cleaned = fixDocLinks(stripMdx(body))
  const parts = cleaned.split(/\n(?=## )/)
  const sections = []
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim()
    if (!p) continue
    let heading
    let rest
    if (p.startsWith("## ")) {
      const nl = p.indexOf("\n")
      heading = nl === -1 ? p.slice(3).trim() : p.slice(3, nl).trim()
      rest = nl === -1 ? "" : p.slice(nl + 1).trim()
    } else if (i === 0) {
      heading = "Overview"
      rest = p
    } else {
      heading =
        p
          .split("\n")[0]
          .replace(/^##\s*/, "")
          .trim() || "Section"
      rest = p.split("\n").slice(1).join("\n").trim()
    }
    const id = sectionIdFromHeading(heading)
    const { plain, codeBlocks } = extractFencedCode(rest)
    const paras = filterNoiseParagraphs(splitParagraphs(plain))
    sections.push({ id, heading, paras, codeBlocks })
  }
  if (sections.length === 0) {
    const { plain, codeBlocks } = extractFencedCode(cleaned)
    const paras = filterNoiseParagraphs(splitParagraphs(plain))
    sections.push({ id: "overview", heading: "Overview", paras, codeBlocks })
  }
  return sections
}

function groupIdFor(id) {
  if (id.startsWith("test-") || id === "library-js") return "test-runner"
  if (id.startsWith("ci") || id === "docker" || id === "selenium-grid")
    return "ci"
  if (id === "puppeteer" || id === "protractor") return "migration"
  if (
    id.startsWith("getting-started") ||
    id === "codegen-intro" ||
    id === "codegen" ||
    id === "getting-started-mcp"
  )
    return "getting-started"
  if (id === "junit-java" || id === "webview2") return "integrations"
  return "guides"
}

function exportNameFromSlug(slug) {
  const p = slug.split("-")
  const c =
    p[0] +
    p
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("")
  return `${c}Topic`
}

function buildSummaryFromSections(sections) {
  const first = sections[0]?.paras?.[0] || ""
  const t = first
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^#{1,6}\s+/, "")
  return t.length > 420 ? `${t.slice(0, 417)}…` : t
}

async function buildLocalizedTopic(meta, sectionsEn, cache) {
  const { slug, id, titleEn, sourceFile } = meta
  const titleUk = await translateEnUk(titleEn, cache)
  const summaryEn = buildSummaryFromSections(sectionsEn) || titleEn
  const summaryUk = await translateLong(summaryEn, cache)
  const sections = []
  let cb = 0
  for (const s of sectionsEn) {
    const headingEn = s.heading.replace(/\{#([^}]+)\}\s*$/i, "").trim()
    const title = {
      en: headingEn,
      uk: await translateEnUk(headingEn, cache),
    }
    const paragraphs = await mapPool(s.paras, 8, async (pe) => ({
      en: pe,
      uk: await translateLong(pe, cache),
    }))
    const codeBlocks = s.codeBlocks.map((b) => ({
      id: `cb-${++cb}`,
      language: b.language,
      code: b.code,
    }))
    sections.push({
      id: s.id,
      title,
      paragraphs: paragraphs.length ? paragraphs : undefined,
      codeBlocks: codeBlocks.length ? codeBlocks : undefined,
    })
  }
  return {
    slug,
    groupId: groupIdFor(id),
    order: meta.order,
    sourceDoc: sourceFile,
    officialDocsUrl: `https://playwright.dev/docs/${id}`,
    title: { en: titleEn, uk: titleUk },
    summary: { en: summaryEn, uk: summaryUk },
    sections,
    quiz: [],
  }
}

function emitTopicFile(topic, exportName) {
  const json = JSON.stringify(topic, null, 2)
  const body = `import type { PlaywrightTopic } from "../../types"\n\nexport const ${exportName}: PlaywrightTopic = ${json}\n`
  const file = path.join(OUT_DIR, `${topic.slug}.ts`)
  fs.writeFileSync(file, body, "utf8")
}

async function main() {
  const { docsRoot, maxFiles } = parseArgs(process.argv)
  if (!docsRoot || !fs.existsSync(docsRoot)) {
    console.error(
      "Missing or invalid --docs-root (path to playwright docs/src)",
    )
    process.exit(1)
  }
  const cache = loadCache()
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const names = fs
    .readdirSync(docsRoot)
    .filter((n) => shouldIncludeFile(n))
    .sort((a, b) => a.localeCompare(b))

  const picked = names.slice(0, maxFiles)
  const topicsMeta = []

  for (const name of picked) {
    const fp = path.join(docsRoot, name)
    const raw = fs.readFileSync(fp, "utf8")
    const { data, body } = parseFrontMatter(raw)
    const id = data.id
    const titleEn = data.title
    if (!id || !titleEn) {
      console.warn("skip (no id/title):", name)
      continue
    }
    if (HAND_SLUGS.has(id)) {
      console.warn("skip (hand):", id, name)
      continue
    }
    const sectionsEn = splitSections(body)
    topicsMeta.push({ slug: id, id, titleEn, sourceFile: name, sectionsEn })
  }

  topicsMeta.sort((a, b) => a.slug.localeCompare(b.slug))
  let order = 100
  const exports = []
  for (const m of topicsMeta) {
    m.order = order
    order += 5
    console.log("translate", m.slug, `(${m.sourceFile})`)
    const topic = await buildLocalizedTopic(m, m.sectionsEn, cache)
    const ex = exportNameFromSlug(topic.slug)
    emitTopicFile(topic, ex)
    exports.push({ ex, slug: topic.slug })
  }

  saveCache(cache)

  const indexLines = [
    `// Generated by scripts/generate-playwright-learn-topics.mjs — do not edit by hand.`,
    `import type { PlaywrightTopic } from "../../types"`,
    ...exports.map((e) => `import { ${e.ex} } from "./${e.slug}"`),
    "",
    `/** All auto-imported Playwright guide topics (EN from upstream, UK translated). */`,
    `export const autoGeneratedPlaywrightTopics: PlaywrightTopic[] = [${exports.map((e) => e.ex).join(", ")}]`,
    "",
  ]
  fs.writeFileSync(
    path.join(OUT_DIR, "index.ts"),
    indexLines.join("\n"),
    "utf8",
  )
  console.log("Wrote", exports.length, "topics to", OUT_DIR)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
