// jd-matcher.jsx — local keyword JD analyzer.
// Returns { score, band, strong, partial, gaps, totalSignals, parsed }.
// "weight" tweak: 'strict' | 'balanced' | 'lenient' tunes how generous adjacency is.

function normalizeText(t) {
  return (t || "").toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"');
}

function countMatches(text, aliases) {
  const norm = normalizeText(text);
  let count = 0;
  for (const a of aliases) {
    const needle = normalizeText(a);
    // boundary check; allow word + dot + slash
    const re = new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`, "g");
    const m = norm.match(re);
    if (m) count += m.length;
  }
  return count;
}

function analyzeJD(jdText, weightMode = "balanced") {
  if (!jdText || !jdText.trim()) {
    return { empty: true };
  }
  const text = jdText.slice(0, 30000);

  const strong = [];
  const partial = [];
  const gaps = [];

  const cv = window.CV;
  let totalJDSignals = 0;
  let earned = 0;

  // CV skill matches
  for (const s of cv.skills) {
    const hits = countMatches(text, s.aliases);
    if (hits > 0) {
      totalJDSignals += s.weight;
      earned += s.weight;
      strong.push({ id: s.id, label: s.label, hits, weight: s.weight, level: s.level, category: s.category });
    }
  }

  // Adjacent matches — partial credit
  for (const a of cv.adjacent) {
    const hits = countMatches(text, a.aliases);
    if (hits > 0) {
      const adjW = 2; // each adjacent counted as worth 2 JD points
      totalJDSignals += adjW;
      const partialCredit = weightMode === "lenient" ? 1.4 : weightMode === "strict" ? 0.4 : 0.85;
      earned += partialCredit;
      partial.push({ id: a.id, label: a.label, hits, note: a.note });
    }
  }

  // Gap detection — JD has "must have" / required-style mentions but we didn't match
  // Crude heuristic: lines starting with bullet markers + a known skill keyword that didn't match.
  // Plus: any of a "common JD asks" list that wasn't matched anywhere.
  const COMMON_JD_ASKS = [
    { label: "Selenium", aliases: ["selenium"] },
    { label: "Java", aliases: [" java "] },
    { label: "Kotlin", aliases: ["kotlin"] },
    { label: "Python", aliases: ["python"] },
    { label: "Appium", aliases: ["appium"] },
    { label: "Kubernetes", aliases: ["kubernetes", "k8s"] },
    { label: "AWS", aliases: ["aws"] },
    { label: "Azure", aliases: [" azure "] },
    { label: "Selenium Grid", aliases: ["selenium grid"] },
    { label: "Mobile-native testing", aliases: ["native mobile", "ios automation", "android automation"] },
    { label: "Ruby / RSpec", aliases: ["rspec", " ruby "] },
    { label: "Performance engineering (full)", aliases: ["jmeter", "gatling", "locust"] },
    { label: "Manager / Lead title", aliases: ["lead engineer", "engineering manager", "head of qa"] },
  ];

  for (const ask of COMMON_JD_ASKS) {
    const hits = countMatches(text, ask.aliases);
    if (hits === 0) continue;
    // skip if already in partial / strong
    const inStrong = strong.some((s) => s.label.toLowerCase() === ask.label.toLowerCase());
    const inPartial = partial.some((p) => p.label.toLowerCase() === ask.label.toLowerCase());
    if (inStrong || inPartial) continue;
    totalJDSignals += 2;
    gaps.push({ label: ask.label, hits });
  }

  // Score
  if (totalJDSignals === 0) {
    // Couldn't extract anything technical from text — error-ish
    return { error: "noSignals" };
  }
  let pct = Math.round((earned / totalJDSignals) * 100);

  // Mode adjustments
  if (weightMode === "strict") pct = Math.max(0, pct - 8);
  if (weightMode === "lenient") pct = Math.min(100, pct + 8);

  // Soft floor for weak JDs (at least one match)
  if (strong.length >= 4) pct = Math.max(pct, 55);

  pct = Math.max(0, Math.min(100, pct));

  let band = "poor";
  if (pct >= 80) band = "strong";
  else if (pct >= 65) band = "solid";
  else if (pct >= 45) band = "partial";

  // Sort
  strong.sort((a, b) => b.weight * 10 + b.hits - (a.weight * 10 + a.hits));
  partial.sort((a, b) => b.hits - a.hits);

  return {
    empty: false,
    error: null,
    score: pct,
    band,
    strong,
    partial,
    gaps,
    totalSignals: totalJDSignals,
    earned: Math.round(earned * 10) / 10,
  };
}

window.analyzeJD = analyzeJD;
