#!/usr/bin/env node
/**
 * Frees the default dev port (3000) then starts `next dev`.
 * Next 16 refuses a second dev server for the same repo; orphaned PIDs
 * often still hold :3000 even when the terminal tab is closed.
 */
import { spawn } from "node:child_process"
import { execSync } from "node:child_process"
import { createRequire } from "node:module"
import path from "node:path"
import process from "node:process"
import { setTimeout as delay } from "node:timers/promises"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const port = process.env.PORT || "3000"

function listenPids(p) {
  try {
    const out = execSync(`lsof -tiTCP:${p} -sTCP:LISTEN`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
    return [...new Set(out.trim().split(/\s+/).filter(Boolean))]
  } catch {
    return []
  }
}

function killPid(pid, signal) {
  try {
    process.kill(Number(pid), signal)
  } catch {
    // already dead or not ours
  }
}

const pids = listenPids(port)
if (pids.length > 0) {
  console.info(
    `[dev] Port ${port} in use by PID(s) ${pids.join(", ")} — sending SIGTERM…`,
  )
  for (const pid of pids) killPid(pid, "SIGTERM")
  await delay(400)
  const still = listenPids(port)
  for (const pid of still) killPid(pid, "SIGKILL")
  await delay(150)
}

const require = createRequire(path.join(root, "package.json"))
const nextCli = require.resolve("next/dist/bin/next")

const child = spawn(
  process.execPath,
  [nextCli, "dev", ...process.argv.slice(2)],
  {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  },
)

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
