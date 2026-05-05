import fs from "node:fs/promises"
import path from "node:path"

const baseDir = path.join(process.cwd(), "reports/html")
function mimeTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case ".html":
      return "text/html; charset=utf-8"
    case ".js":
      return "text/javascript; charset=utf-8"
    case ".css":
      return "text/css; charset=utf-8"
    case ".png":
      return "image/png"
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".svg":
      return "image/svg+xml; charset=utf-8"
    case ".webmanifest":
      return "application/manifest+json; charset=utf-8"
    case ".zip":
      return "application/zip"
    case ".md":
      return "text/markdown; charset=utf-8"
    case ".json":
      return "application/json; charset=utf-8"
    case ".txt":
      return "text/plain; charset=utf-8"
    case ".woff":
      return "font/woff"
    case ".woff2":
      return "font/woff2"
    case ".ttf":
      return "font/ttf"
    default:
      return "application/octet-stream"
  }
}

const DATE_PATTERN =
  /\b\d{1,2}\/\d{1,2}\/\d{4},\s+\d{1,2}:\d{2}:\d{2}\s+(?:AM|PM)\b/g

export async function GET(
  req: Request,
  ctx: { params: Promise<{ path?: string[] }> | { path?: string[] } },
): Promise<Response> {
  const params = await Promise.resolve(ctx.params)
  const segs = params.path ?? []
  const relative = segs.length > 0 ? segs.join("/") : "index.html"

  // Playwright trace viewer can generate nested trace routes like
  // /trace/trace/index.html?... and /trace/trace/trace/index.html?...
  // Redirect any nested form to canonical /trace/index.html so links
  // inside report stay stable and never keep growing.
  const nestedTraceIndexPath = /^(?:trace\/){2,}index\.html$/
  if (nestedTraceIndexPath.test(relative)) {
    const url = new URL(req.url)
    const target = new URL("/sandbox-test-report/trace/index.html", url.origin)
    target.search = url.search
    return Response.redirect(target, 307)
  }

  // Resolve and guard against path traversal.
  const resolved = path.resolve(baseDir, relative)
  if (!resolved.startsWith(baseDir)) {
    return new Response("Not found", { status: 404 })
  }

  try {
    const buf = await fs.readFile(resolved)

    // If user asks to hide "when it ran" date, strip it from the HTML report.
    // This keeps the embedded report usable without showing the run timestamp.
    if (relative === "index.html") {
      const raw = buf.toString("utf8")
      const cleaned = raw.replace(DATE_PATTERN, "")
      return new Response(cleaned, {
        headers: {
          "content-type": mimeTypeFor(resolved),
          "cache-control": "no-store",
        },
      })
    }

    return new Response(buf, {
      headers: {
        "content-type": mimeTypeFor(resolved),
        "cache-control": "no-store",
      },
    })
  } catch {
    return new Response("Not found", { status: 404 })
  }
}
