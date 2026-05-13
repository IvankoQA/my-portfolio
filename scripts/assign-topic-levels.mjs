#!/usr/bin/env node
/**
 * Adds `level` and `trackOrder` fields to every PlaywrightTopic definition.
 * Run once: node scripts/assign-topic-levels.mjs
 */
import { readFileSync, writeFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { globSync } from "fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

// Level + trackOrder assignment for all 71 topics.
// trackOrder = sort position within the level track (1-based).
const ASSIGNMENT = {
  // ── BEGINNER (18 topics) ────────────────────────────────────────────────
  "intro":               { level: "beginner", trackOrder: 1 },
  "getting-started-cli": { level: "beginner", trackOrder: 2 },
  "getting-started-vscode": { level: "beginner", trackOrder: 3 },
  "getting-started-mcp": { level: "beginner", trackOrder: 4 },
  "writing-tests":       { level: "beginner", trackOrder: 5 },
  "locators":            { level: "beginner", trackOrder: 6 },
  "input":               { level: "beginner", trackOrder: 7 },
  "navigations":         { level: "beginner", trackOrder: 8 },
  "actionability":       { level: "beginner", trackOrder: 9 },
  "test-assertions":     { level: "beginner", trackOrder: 10 },
  "running-tests":       { level: "beginner", trackOrder: 11 },
  "test-cli":            { level: "beginner", trackOrder: 12 },
  "codegen-intro":       { level: "beginner", trackOrder: 13 },
  "codegen":             { level: "beginner", trackOrder: 14 },
  "debug":               { level: "beginner", trackOrder: 15 },
  "trace-viewer-intro":  { level: "beginner", trackOrder: 16 },
  "screenshots":         { level: "beginner", trackOrder: 17 },
  "pages":               { level: "beginner", trackOrder: 18 },

  // ── INTERMEDIATE (25 topics) ────────────────────────────────────────────
  "test-annotations":         { level: "intermediate", trackOrder: 1 },
  "test-retries":             { level: "intermediate", trackOrder: 2 },
  "test-timeouts":            { level: "intermediate", trackOrder: 3 },
  "test-fixtures":            { level: "intermediate", trackOrder: 4 },
  "test-parallel":            { level: "intermediate", trackOrder: 5 },
  "test-configuration":       { level: "intermediate", trackOrder: 6 },
  "test-use-options":         { level: "intermediate", trackOrder: 7 },
  "test-projects":            { level: "intermediate", trackOrder: 8 },
  "test-reporters":           { level: "intermediate", trackOrder: 9 },
  "test-webserver":           { level: "intermediate", trackOrder: 10 },
  "pom":                      { level: "intermediate", trackOrder: 11 },
  "test-parameterize":        { level: "intermediate", trackOrder: 12 },
  "test-global-setup-teardown": { level: "intermediate", trackOrder: 13 },
  "network":                  { level: "intermediate", trackOrder: 14 },
  "mock":                     { level: "intermediate", trackOrder: 15 },
  "api-testing":              { level: "intermediate", trackOrder: 16 },
  "auth":                     { level: "intermediate", trackOrder: 17 },
  "browser-contexts":         { level: "intermediate", trackOrder: 18 },
  "frames":                   { level: "intermediate", trackOrder: 19 },
  "dialogs":                  { level: "intermediate", trackOrder: 20 },
  "downloads":                { level: "intermediate", trackOrder: 21 },
  "evaluating":               { level: "intermediate", trackOrder: 22 },
  "handles":                  { level: "intermediate", trackOrder: 23 },
  "events":                   { level: "intermediate", trackOrder: 24 },
  "accessibility-testing":    { level: "intermediate", trackOrder: 25 },

  // ── ADVANCED (28 topics) ────────────────────────────────────────────────
  "test-snapshots":       { level: "advanced", trackOrder: 1 },
  "test-ui-mode":         { level: "advanced", trackOrder: 2 },
  "trace-viewer":         { level: "advanced", trackOrder: 3 },
  "test-typescript":      { level: "advanced", trackOrder: 4 },
  "test-sharding":        { level: "advanced", trackOrder: 5 },
  "ci-intro":             { level: "advanced", trackOrder: 6 },
  "ci":                   { level: "advanced", trackOrder: 7 },
  "docker":               { level: "advanced", trackOrder: 8 },
  "emulation":            { level: "advanced", trackOrder: 9 },
  "browsers":             { level: "advanced", trackOrder: 10 },
  "languages":            { level: "advanced", trackOrder: 11 },
  "library":              { level: "advanced", trackOrder: 12 },
  "test-agents":          { level: "advanced", trackOrder: 13 },
  "test-components":      { level: "advanced", trackOrder: 14 },
  "mock-browser-apis":    { level: "advanced", trackOrder: 15 },
  "other-locators":       { level: "advanced", trackOrder: 16 },
  "aria-snapshots":       { level: "advanced", trackOrder: 17 },
  "clock":                { level: "advanced", trackOrder: 18 },
  "extensibility":        { level: "advanced", trackOrder: 19 },
  "selenium-grid":        { level: "advanced", trackOrder: 20 },
  "service-workers":      { level: "advanced", trackOrder: 21 },
  "chrome-extensions":    { level: "advanced", trackOrder: 22 },
  "webview2":             { level: "advanced", trackOrder: 23 },
  "touch-events":         { level: "advanced", trackOrder: 24 },
  "videos":               { level: "advanced", trackOrder: 25 },
  "best-practices":       { level: "advanced", trackOrder: 26 },
  "protractor":           { level: "advanced", trackOrder: 27 },
  "puppeteer":            { level: "advanced", trackOrder: 28 },
  "testing-library":      { level: "advanced", trackOrder: 29 },
}

// Find all topic .ts files
const topicFiles = globSync("src/lib/playwright-learn/topics/**/*.ts", {
  cwd: ROOT,
  absolute: true,
})

let updated = 0
let skipped = 0
let missing = 0

for (const file of topicFiles) {
  let src = readFileSync(file, "utf8")

  // Find the slug in this file
  const slugMatch = src.match(/slug:\s*["']([^"']+)["']/)
  if (!slugMatch) continue
  const slug = slugMatch[1]

  const assignment = ASSIGNMENT[slug]
  if (!assignment) {
    console.log(`MISSING assignment for slug: ${slug} (${file})`)
    missing++
    continue
  }

  // Skip if already has level field
  if (/\blevel:\s*["']/.test(src)) {
    console.log(`ALREADY_DONE: ${slug}`)
    skipped++
    continue
  }

  // Insert after the `order: N,` line
  const orderLineRe = /([ \t]*order:\s*\d+,?\n)/
  if (!orderLineRe.test(src)) {
    console.log(`NO_ORDER_LINE: ${slug} in ${file}`)
    continue
  }

  src = src.replace(
    orderLineRe,
    `$1  level: "${assignment.level}",\n  trackOrder: ${assignment.trackOrder},\n`,
  )

  writeFileSync(file, src, "utf8")
  console.log(`UPDATED: ${slug} → ${assignment.level} #${assignment.trackOrder}`)
  updated++
}

console.log(`\nDone: ${updated} updated, ${skipped} already done, ${missing} missing assignment`)
