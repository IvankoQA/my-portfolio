#!/usr/bin/env node
/**
 * Remove code block objects with language java | python | csharp from
 * playwright learn topic files (TS-first track).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const REMOVE = new Set(["java", "python", "csharp"])

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const topicsDir = path.join(root, "src/lib/playwright-learn/topics/auto")

/** Skip catalog-excluded slugs (still on disk; optional cleanup). */
const SKIP_FILES = new Set([
  "webview2.ts",
  "selenium-grid.ts",
  "languages.ts",
  "puppeteer.ts",
  "protractor.ts",
])

/**
 * @param {string} s
 * @param {number} pos index of first char inside string (after opening quote)
 * @param {string} q '"' | "'" | '`'
 * @returns {number} index after closing quote
 */
function skipStringContents(s, pos, q) {
  let i = pos
  while (i < s.length) {
    const c = s[i]
    if (c === "\\") {
      i += 2
      continue
    }
    if (c === q) {
      return i + 1
    }
    i++
  }
  throw new Error(`Unclosed ${q} string from ${pos}`)
}

/**
 * @param {string} s
 * @param {number} pos first char after `code:`
 */
function skipCodeValue(s, pos) {
  let i = pos
  while (i < s.length && (s[i] === " " || s[i] === "\t")) i++
  const q = s[i]
  if (q !== '"' && q !== "'" && q !== "`") {
    throw new Error(
      `Expected code string at ${i}, got ${JSON.stringify(s.slice(i, i + 20))}`,
    )
  }
  return skipStringContents(s, i + 1, q)
}

const BLOCK_OPEN = "\n        {\n          id:"

/**
 * @param {string} s
 * @param {number} langLineStart index of newline before `          language`
 */
function tryRemoveBlock(s, langLineStart) {
  const from = s.slice(langLineStart)
  const langMatch = from.match(
    /^\n( +)language: "(java|python|csharp)"\s*,\s*\n\1code:\s*/,
  )
  if (!langMatch || !REMOVE.has(langMatch[2])) return null

  const codeValStart = langLineStart + langMatch[0].length
  const afterCode = skipCodeValue(s, codeValStart)

  const tail = s.slice(afterCode)
  const closeM = tail.match(/^,\s*\n {8}\},/)
  if (!closeM) {
    throw new Error(
      `No closing \\n        }, after code near ${afterCode} (${s.slice(afterCode, afterCode + 40)})`,
    )
  }
  const blockEnd = afterCode + closeM[0].length

  const blockStart = s.lastIndexOf(BLOCK_OPEN, langLineStart)
  if (blockStart === -1) {
    throw new Error(`No block open before language at ${langLineStart}`)
  }
  return { blockStart, blockEnd }
}

/**
 * @param {string} content
 */
function stripBlocks(content) {
  let out = content
  let guard = 0
  while (guard++ < 50000) {
    const m = out.match(
      /\n( +)language: "(java|python|csharp)"\s*,\s*\n\1code:\s*/,
    )
    if (!m) break
    const langLineStart = m.index
    const cut = tryRemoveBlock(out, langLineStart)
    if (!cut) {
      throw new Error(`Could not remove block at ${langLineStart}`)
    }
    out = out.slice(0, cut.blockStart) + out.slice(cut.blockEnd)
  }
  return out
}

function main() {
  const names = fs.readdirSync(topicsDir).filter((f) => f.endsWith(".ts"))
  let changed = 0
  for (const name of names) {
    if (SKIP_FILES.has(name)) continue
    const fp = path.join(topicsDir, name)
    const raw = fs.readFileSync(fp, "utf8")
    if (
      !raw.includes('language: "java"') &&
      !raw.includes('language: "python"') &&
      !raw.includes('language: "csharp"')
    ) {
      continue
    }
    const next = stripBlocks(raw)
    if (next !== raw) {
      fs.writeFileSync(fp, next, "utf8")
      changed++
      console.log("updated", name)
    }
  }
  console.log(`Done. ${changed} files modified.`)
}

main()
