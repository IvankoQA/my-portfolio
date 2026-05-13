#!/usr/bin/env node
/**
 * Smoke-check UK learn Playwright routes (topic + quiz per slug, plus index).
 * Usage: BASE_URL=http://localhost:3000 node ./scripts/check-uk-learn-playwright-urls.mjs
 */
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function walkTsFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walkTsFiles(p, out)
    else if (name.endsWith(".ts") && !name.endsWith(".d.ts")) out.push(p)
  }
  return out
}

function collectSlugs(root) {
  const topicsDir = path.join(root, "src/lib/playwright-learn/topics")
  const slugs = new Set()
  const slugRe = /slug:\s*"([^"]+)"/g
  for (const file of walkTsFiles(topicsDir)) {
    const text = fs.readFileSync(file, "utf8")
    for (const m of text.matchAll(slugRe)) {
      slugs.add(m[1])
    }
  }
  return [...slugs].sort()
}

function loadExcludedCatalogSlugs(root) {
  const p = path.join(root, "src/lib/playwright-learn/constants.ts")
  const text = fs.readFileSync(p, "utf8")
  const m = text.match(
    /export const EXCLUDED_PLAYWRIGHT_LEARN_CATALOG_SLUGS = \[([\s\S]*?)\] as const/s,
  )
  if (!m) {
    throw new Error(
      "Missing EXCLUDED_PLAYWRIGHT_LEARN_CATALOG_SLUGS in constants.ts",
    )
  }
  const excluded = new Set()
  for (const sm of m[1].matchAll(/"([^"]+)"/g)) {
    excluded.add(sm[1])
  }
  return excluded
}

async function headOk(url) {
  const res = await fetch(url, { method: "GET", redirect: "follow" })
  return res.ok
}

async function main() {
  const excluded = loadExcludedCatalogSlugs(root)
  const slugs = collectSlugs(root).filter((s) => !excluded.has(s))
  const urls = [
    `${BASE}/uk/learn/playwright`,
    ...slugs.flatMap((slug) => [
      `${BASE}/uk/learn/playwright/${slug}`,
      `${BASE}/uk/learn/playwright/${slug}/quiz`,
    ]),
  ]
  const bad = []
  for (const url of urls) {
    try {
      if (!(await headOk(url))) bad.push({ url, status: "not-ok" })
    } catch (e) {
      bad.push({ url, status: `error:${e?.message ?? e}` })
    }
  }
  if (bad.length) {
    console.error(`Failed ${bad.length}/${urls.length}:`)
    for (const b of bad) console.error(`  ${b.url} (${b.status})`)
    process.exitCode = 1
  } else {
    console.log(`OK ${urls.length} URLs under ${BASE}/uk/learn/playwright`)
  }
}

main()
