function normalizeTraceTarget(rawTrace: string): string {
  const decoded = decodeURIComponent(rawTrace)
  return decoded.replace(
    /\/sandbox-test-report\/(?:trace\/)+index\.html\?trace=/,
    "/sandbox-test-report/trace/index.html?trace=",
  )
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const traceParam = url.searchParams.get("trace")
  if (!traceParam) return new Response("Missing trace", { status: 400 })

  const normalizedTrace = normalizeTraceTarget(traceParam)
  const target = new URL("/sandbox-test-report/trace/index.html", url.origin)
  target.searchParams.set("trace", normalizedTrace)
  return Response.redirect(target, 307)
}
