/**
 * Copies Playwright HTML report → public/sandbox-test-report for static hosting on Vercel.
 * Strips US-style run timestamps from all .html files (keep in sync with DATE_PATTERN in
 * src/app/sandbox-test-report/[...path]/route.ts).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const src = path.join(root, "reports/html")
const dest = path.join(root, "public/sandbox-test-report")

const DATE_PATTERN =
  /\b\d{1,2}\/\d{1,2}\/\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+(?:AM|PM)\b/g

if (!fs.existsSync(src)) {
  console.error(
    "Missing reports/html. Run: pnpm run test:store (or pnpm run test:store:full)",
  )
  process.exit(1)
}

fs.rmSync(dest, { recursive: true, force: true })
fs.mkdirSync(dest, { recursive: true })
fs.cpSync(src, dest, { recursive: true })

function stripDatesInHtmlFiles(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      stripDatesInHtmlFiles(p)
    } else if (ent.isFile() && ent.name.endsWith(".html")) {
      const raw = fs.readFileSync(p, "utf8")
      fs.writeFileSync(p, raw.replace(DATE_PATTERN, ""), "utf8")
    }
  }
}

stripDatesInHtmlFiles(dest)
console.log(
  "Synced reports/html → public/sandbox-test-report (dates stripped from HTML)",
)
