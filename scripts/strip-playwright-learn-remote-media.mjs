#!/usr/bin/env node
/**
 * Strip embedded docs screenshots from playwright-learn topic TS files:
 * - <img src="https://user-images.githubusercontent.com/...">
 * - <img src="https://github.com/microsoft/playwright/assets/...">
 * - <source src="https://user-images.githubusercontent.com/..."> (e.g. mp4)
 *
 * Removes whole tags. Cleans up empty-only paragraph objects left behind.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const learnRoot = path.join(root, "src/lib/playwright-learn")

/** <img ... src="allowed host..." ... /> or > */
const RE_IMG =
  /<img(?=[^>]*\bsrc="https:\/\/(?:user-images\.githubusercontent\.com\/[^"]+|github\.com\/microsoft\/playwright\/assets\/[^"]+)")[^>]*(?:\/>|>)/g

const RE_SOURCE =
  /<source[^>]*\bsrc="https:\/\/user-images\.githubusercontent\.com\/[^"]*"[^>]*\/>/g

/** Paragraph entries that became empty after stripping */
const RE_EMPTY_PARA = /\n {8}{\n {10}en: '',\n {10}uk: '',\n {8}},/g
const RE_EMPTY_PARA_LAST = /\n {8}{\n {10}en: '',\n {10}uk: '',\n {8}}\n/g
const RE_WS_ONLY_PARA = /\n {8}{\n {10}en: '\s*',\n {10}uk: '\s*',\n {8}},/g
const RE_WS_ONLY_PARA_LAST =
  /\n {8}{\n {10}en: '\s*',\n {10}uk: '\s*',\n {8}}\n/g

/** Collapse triple backslash-n in code strings (heuristic after img removal). */
function collapseDoubleNewlinesInParagraphs(s) {
  return s.replaceAll("\\n\\n\\n", "\\n\\n")
}

function stripFile(content) {
  let out = content.replace(RE_IMG, "").replace(RE_SOURCE, "")
  out = out.replace(RE_EMPTY_PARA, "")
  out = out.replace(RE_EMPTY_PARA_LAST, "\n")
  out = out.replace(RE_WS_ONLY_PARA, "")
  out = out.replace(RE_WS_ONLY_PARA_LAST, "\n")
  out = collapseDoubleNewlinesInParagraphs(out)
  return out
}

function walkTs(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name)
    if (name.isDirectory()) walkTs(p, out)
    else if (name.name.endsWith(".ts")) out.push(p)
  }
  return out
}

function main() {
  const files = walkTs(learnRoot)
  let changed = 0
  for (const fp of files) {
    const raw = fs.readFileSync(fp, "utf8")
    if (
      !raw.includes("user-images.githubusercontent.com") &&
      !raw.includes("github.com/microsoft/playwright/assets/")
    ) {
      continue
    }
    const next = stripFile(raw)
    if (next !== raw) {
      fs.writeFileSync(fp, next, "utf8")
      changed++
      console.log("updated", path.relative(root, fp))
    }
  }
  console.log(`Done. ${changed} files modified.`)
}

main()
