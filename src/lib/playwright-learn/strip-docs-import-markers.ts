/**
 * Strips Playwright docs import artefacts (`* langs: …`, lone `#` heading lines)
 * from paragraph/summary strings so the learn UI does not show raw tab markers.
 */
export function stripDocsImportMarkers(raw: string): string | null {
  let t = raw.replace(/\r\n/g, "\n")
  t = t.replace(/\n\* langs:[^\n]*/g, "")
  t = t.replace(/^\* langs:[^\n]*\n?/gm, "")
  t = t.trim()
  if (!t) return null
  if (/^#{1,6}\s*$/.test(t)) return null
  return t
}
