import { NextResponse } from "next/server"
import type { JdMatchOkBody } from "@/lib/jd-match-api-types"
import { analyzeJD } from "@/lib/jd-matcher"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let body: { text?: string; lang?: "en" | "uk" }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const text = String(body.text ?? "")
    .trim()
    .slice(0, 30_000)
  if (!text) {
    return NextResponse.json({ error: "empty" }, { status: 400 })
  }

  const local = analyzeJD(text, "balanced")
  if (local.error === "noSignals") {
    return NextResponse.json(
      { error: "noSignals", result: local },
      { status: 422 },
    )
  }

  const out: JdMatchOkBody = {
    source: "local",
    result: local,
    aiNarrative: null,
    aiStrongNote: null,
    aiPartialGapsNote: null,
  }
  return NextResponse.json(out)
}
