#!/usr/bin/env node
/**
 * Spawns the platform @biomejs/cli-* native binary from the pnpm store layout,
 * bypassing the default Node wrapper (avoids false OOM / exit 254 in some setups).
 */
import { execSync, spawnSync } from "node:child_process"
import { readdirSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..")
const pnpmRoot = join(projectRoot, "node_modules", ".pnpm")

function isMusl() {
  try {
    const out = execSync("ldd --version", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    })
    return out.includes("musl")
  } catch (e) {
    const stderr =
      e && typeof e === "object" && "stderr" in e ? String(e.stderr) : ""
    return stderr.includes("musl")
  }
}

/** pnpm virtual store folder prefix, e.g. @biomejs+cli-darwin-arm64@ */
function pnpmCliPrefixes() {
  const platform = process.platform
  const arch = process.arch
  if (platform === "win32") return [`@biomejs+cli-win32-${arch}@`]
  if (platform === "darwin") return [`@biomejs+cli-darwin-${arch}@`]
  if (platform === "linux") {
    const out = []
    if (isMusl()) out.push(`@biomejs+cli-linux-${arch}-musl@`)
    out.push(`@biomejs+cli-linux-${arch}@`)
    return out
  }
  return []
}

function platformBinaryName() {
  return process.platform === "win32" ? "biome.exe" : "biome"
}

function findNativeBinary() {
  let entries
  try {
    entries = readdirSync(pnpmRoot)
  } catch {
    return null
  }
  for (const prefix of pnpmCliPrefixes()) {
    const dir = entries.find((d) => d.startsWith(prefix))
    if (!dir) continue
    const m = dir.match(/^@biomejs\+(cli-[^@]+)@/)
    if (!m) continue
    const pkg = m[1]
    const bin = join(
      pnpmRoot,
      dir,
      "node_modules",
      "@biomejs",
      pkg,
      platformBinaryName(),
    )
    return bin
  }
  return null
}

const binaryPath = findNativeBinary()
if (!binaryPath) {
  console.error(
    "Biome: native CLI not found under node_modules/.pnpm. Run: pnpm install",
  )
  process.exit(1)
}

const result = spawnSync(binaryPath, process.argv.slice(2), {
  stdio: "inherit",
  env: process.env,
  cwd: projectRoot,
})

if (result.error) throw result.error
const code = result.status
if (code == null) process.exit(result.signal === "SIGINT" ? 130 : 1)
process.exit(code)
