// auto-test.jsx — Animated automated QA report

const { useState: aS, useEffect: aE, useRef: aR } = React;

// One bug → simulated test outcome (some pass, some fail to mirror the planted bugs)
const AUTO_TESTS = [
  { id: "t01", name: "header › cart counter never goes below zero", file: "header.spec.ts", bugId: "b01", status: "fail", duration: 312, msg: "expected counter >= 0, got -1" },
  { id: "t02", name: "search › cyrillic query returns matches", file: "search.spec.ts", bugId: "b02", status: "fail", duration: 198, msg: "0 results for 'качечка'; expected ≥ 1" },
  { id: "t03", name: "filter › Clear all resets every filter", file: "filters.spec.ts", bugId: "b03", status: "fail", duration: 144, msg: "minRating still 4 after clearAll()" },
  { id: "t04", name: "card › 0-stock items disable Add to cart", file: "card.spec.ts", bugId: "b04", status: "fail", duration: 220, msg: "Add button enabled on stock===0" },
  { id: "t05", name: "card › sale strike-through wraps cleanly", file: "visual.spec.ts", bugId: "b05", status: "fail", duration: 410, msg: "snapshot diff: 12px overflow" },
  { id: "t06", name: "cart › promo VIBES10 does not stack", file: "cart.spec.ts", bugId: "b06", status: "fail", duration: 287, msg: "applied:2 → 20% (expected 10%)" },
  { id: "t07", name: "cart › subtotal precision on odd qty", file: "cart.spec.ts", bugId: "b07", status: "fail", duration: 156, msg: "3 × $4 = $11 (expected $12)" },
  { id: "t08", name: "auth › logout clears cart for next session", file: "auth.spec.ts", bugId: "b08", status: "fail", duration: 245, msg: "cart.length = 3 after logout" },
  { id: "t09", name: "auth › register rejects email without @", file: "auth.spec.ts", bugId: "b09", status: "fail", duration: 130, msg: "Validation passed for 'no-at-sign'" },
  { id: "t10", name: "chat › scroll position smooth on send", file: "chat.spec.ts", bugId: "b10", status: "fail", duration: 312, msg: "scrollTop jumped +200px" },
  { id: "t11", name: "pagination › never displays page 0", file: "pagination.spec.ts", bugId: "b11", status: "fail", duration: 178, msg: "page=0 detected briefly" },
  { id: "t12", name: "a11y › filter inputs have visible focus", file: "a11y.spec.ts", bugId: "b12", status: "fail", duration: 220, msg: "outline: none on :focus-visible" },
  // Passing tests — to make report feel real
  { id: "t13", name: "header › language toggle works", file: "header.spec.ts", status: "pass", duration: 88 },
  { id: "t14", name: "header › theme toggle persists", file: "header.spec.ts", status: "pass", duration: 102 },
  { id: "t15", name: "card › product image renders", file: "card.spec.ts", status: "pass", duration: 64 },
  { id: "t16", name: "card › Add to cart adds 1 item", file: "card.spec.ts", status: "pass", duration: 122 },
  { id: "t17", name: "filter › category filter narrows results", file: "filters.spec.ts", status: "pass", duration: 156 },
  { id: "t18", name: "filter › price range slider", file: "filters.spec.ts", status: "pass", duration: 211 },
  { id: "t19", name: "cart › empty state renders", file: "cart.spec.ts", status: "pass", duration: 78 },
  { id: "t20", name: "cart › qty buttons increment / decrement", file: "cart.spec.ts", status: "pass", duration: 144 },
  { id: "t21", name: "auth › login flow happy path", file: "auth.spec.ts", status: "pass", duration: 188 },
  { id: "t22", name: "search › ASCII query matches", file: "search.spec.ts", status: "pass", duration: 134 },
  { id: "t23", name: "view › list / grid toggle", file: "view.spec.ts", status: "pass", duration: 92 },
  { id: "t24", name: "drawer › cart drawer opens & closes", file: "drawer.spec.ts", status: "pass", duration: 167 },
  { id: "t25", name: "perf › first paint < 1.5s", file: "perf.spec.ts", status: "pass", duration: 1340 },
];

function AutoTestReport({ onBack, lang, foundBugIds }) {
  const t = useT(lang);
  const found = new Set(foundBugIds);
  const [phase, setPhase] = aS("running"); // running | done
  const [results, setResults] = aS([]); // appended one-by-one
  const [pointer, setPointer] = aS(0);

  aE(() => {
    if (pointer >= AUTO_TESTS.length) { setPhase("done"); return; }
    const test = AUTO_TESTS[pointer];
    const delay = test.status === "pass" ? 90 + Math.random() * 80 : 130 + Math.random() * 120;
    const tid = setTimeout(() => {
      setResults((r) => [...r, test]);
      setPointer((p) => p + 1);
    }, delay);
    return () => clearTimeout(tid);
  }, [pointer]);

  const runMs = results.reduce((s, r) => s + r.duration, 0);
  const passed = results.filter(r => r.status === "pass").length;
  const failed = results.filter(r => r.status === "fail").length;
  const totalRun = results.length;
  const expectedTotal = AUTO_TESTS.length;

  // Bug coverage analysis (only when done)
  const failedBugs = AUTO_TESTS.filter(t => t.status === "fail");
  const caughtByHuman = failedBugs.filter(t => found.has(t.bugId)).length;
  const missedByHuman = failedBugs.filter(t => !found.has(t.bugId)).length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 24px 80px" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <button onClick={onBack} style={{ height: 30, padding: "0 10px", border: "1px solid var(--line)", background: "var(--bg-elev)", color: "var(--ink-2)", borderRadius: 7, cursor: "pointer", fontSize: 12, fontFamily: "var(--font-mono)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="arrow-left" size={12}/> {t("auto.back")}
          </button>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6 }}>
            {t("auto.context")}
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid var(--line)", paddingBottom: 24, marginBottom: 24 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className={phase === "running" ? "pulse-dot" : ""} style={{ background: phase === "done" ? "var(--ok)" : "var(--accent)" }}/>
              {phase === "running" ? t("auto.status.running") : t("auto.status.done")}
            </div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, letterSpacing: -1, lineHeight: 1.1 }}>{t("auto.title")}</h1>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--ink-3)" }}>vibe-coder-supply / e2e · playwright · ci #2847</p>
          </div>
          <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "right" }}>
            <div>node v20.11 · pnpm 9.4</div>
            <div style={{ marginTop: 2 }}>chromium 122.0 · macos 15.1</div>
          </div>
        </div>

        {/* Summary tiles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          <SummaryTile label={t("auto.tile.total")} value={`${totalRun}/${expectedTotal}`} accent={false}/>
          <SummaryTile label={t("auto.tile.passed")} value={passed} color="var(--ok)"/>
          <SummaryTile label={t("auto.tile.failed")} value={failed} color="var(--err)" pulse={phase === "running" && failed > 0}/>
          <SummaryTile label={t("auto.tile.duration")} value={`${(runMs / 1000).toFixed(1)}s`}/>
        </div>

        {/* Progress bar */}
        {phase === "running" && (
          <div style={{ marginBottom: 24 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}>
              {totalRun} / {expectedTotal} tests · {Math.round((totalRun / expectedTotal) * 100)}%
            </div>
            <div style={{ height: 4, background: "var(--bg-sunken)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${(totalRun / expectedTotal) * 100}%`, height: "100%", background: "var(--accent)", transition: "width .15s linear" }}/>
            </div>
          </div>
        )}

        {/* Test list — terminal-feel */}
        <div style={{
          background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 12,
          padding: "16px 0", marginBottom: 24,
          fontFamily: "var(--font-mono)", fontSize: 12.5,
        }}>
          <div style={{ padding: "0 18px 10px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--line)", color: "var(--ink-3)", fontSize: 11 }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#fc625d" }}/>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#fdbc40" }}/>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#34c749" }}/>
            <span style={{ marginLeft: 12 }}>$ pnpm run test:e2e</span>
          </div>
          <div style={{ maxHeight: 380, overflow: "auto", padding: "10px 18px" }}>
            {results.map((r, i) => (
              <TestLine key={r.id} test={r} index={i+1} foundByHuman={r.bugId && found.has(r.bugId)}/>
            ))}
            {phase === "running" && (
              <div style={{ color: "var(--ink-3)", padding: "4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                <span className="pulse-dot" style={{ width: 6, height: 6 }}/>
                <span>running test {totalRun + 1}…</span>
              </div>
            )}
            {phase === "done" && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed var(--line)", color: "var(--ink-3)" }}>
                <div>{passed} passed, <span style={{ color: "var(--err)" }}>{failed} failed</span></div>
                <div style={{ marginTop: 4 }}>finished in {(runMs / 1000).toFixed(2)}s</div>
              </div>
            )}
          </div>
        </div>

        {/* Coverage analysis */}
        {phase === "done" && (
          <div style={{ background: "var(--bg-elev)", border: "1px solid var(--accent-line)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>// human vs robot</div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: -0.4 }}>{t("auto.cov.title")}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
              <CoverageBlock
                label={t("auto.cov.caught")}
                value={caughtByHuman}
                total={failedBugs.length}
                color="var(--ok)"
                hint={t("auto.cov.caught.hint")}/>
              <CoverageBlock
                label={t("auto.cov.missed")}
                value={missedByHuman}
                total={failedBugs.length}
                color="var(--err)"
                hint={t("auto.cov.missed.hint")}/>
            </div>
            {missedByHuman > 0 && (
              <details style={{ marginTop: 18 }}>
                <summary style={{ cursor: "pointer", fontSize: 13, color: "var(--ink-2)", padding: "8px 0", fontFamily: "var(--font-mono)" }}>
                  {t("auto.cov.missed.list")} ({missedByHuman})
                </summary>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                  {failedBugs.filter(t => !found.has(t.bugId)).map(t => (
                    <div key={t.id} style={{ padding: "8px 12px", background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: 7, fontSize: 12, fontFamily: "var(--font-mono)" }}>
                      <span style={{ color: "var(--err)" }}>✗</span> {t.name}
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}

        {/* CTA — closing message */}
        {phase === "done" && (
          <div style={{ padding: "24px 0", textAlign: "center", borderTop: "1px solid var(--line)" }}>
            <p style={{ margin: 0, fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6, maxWidth: 540, marginInline: "auto" }}>
              {t("auto.outro")}
            </p>
            <div style={{ marginTop: 16, display: "inline-flex", gap: 8 }}>
              <Button variant="primary" onClick={onBack}>{t("auto.cta.home")}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryTile({ label, value, color, pulse }) {
  return (
    <div style={{
      padding: 14,
      background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 10,
      position: "relative", overflow: "hidden",
    }}>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
      <div style={{
        fontSize: 26, fontWeight: 700, marginTop: 6, fontFamily: "var(--font-display)",
        letterSpacing: -1, color: color || "var(--ink)",
        animation: pulse ? "pulse-num 1.2s ease-in-out infinite" : "none",
      }}>{value}</div>
      <style>{`@keyframes pulse-num { 0%,100%{opacity:1} 50%{opacity:.6}}`}</style>
    </div>
  );
}

function TestLine({ test, index, foundByHuman }) {
  const isPass = test.status === "pass";
  return (
    <div style={{
      padding: "5px 0",
      display: "flex", alignItems: "flex-start", gap: 10,
      animation: "slideUp .25s ease",
      borderLeft: foundByHuman ? "2px solid var(--accent)" : "2px solid transparent",
      paddingLeft: 8, marginLeft: -8,
    }}>
      <span style={{ color: "var(--ink-3)", minWidth: 26, fontSize: 11 }}>{String(index).padStart(2, "0")}</span>
      <span style={{ color: isPass ? "var(--ok)" : "var(--err)", fontWeight: 600, minWidth: 14 }}>{isPass ? "✓" : "✗"}</span>
      <span style={{ color: isPass ? "var(--ink-2)" : "var(--ink)", flex: 1, lineHeight: 1.5 }}>
        {test.name}
        {foundByHuman && <span style={{ marginLeft: 6, fontSize: 10, color: "var(--accent)" }}>· you caught this</span>}
        {test.status === "fail" && (
          <div style={{ marginTop: 2, fontSize: 11, color: "var(--err)", opacity: 0.8 }}>
            └─ {test.msg}
          </div>
        )}
      </span>
      <span style={{ color: "var(--ink-4)", fontSize: 10.5 }}>{test.duration}ms</span>
      <style>{`@keyframes slideUp { from { transform: translateY(4px); opacity: 0;} to { transform: translateY(0); opacity: 1;}}`}</style>
    </div>
  );
}

function CoverageBlock({ label, value, total, color, hint }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ padding: 16, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: 10 }}>
      <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: 8 }}>
        <span style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--font-display)", color, letterSpacing: -1 }}>{value}</span>
        <span style={{ color: "var(--ink-3)", fontSize: 14 }}>/ {total}</span>
        <span className="mono" style={{ marginLeft: "auto", fontSize: 12, color }}>{pct}%</span>
      </div>
      <div style={{ marginTop: 8, height: 3, background: "var(--bg-sunken)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: color, transition: "width .8s" }}/>
      </div>
      <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.4 }}>{hint}</div>
    </div>
  );
}

window.AutoTestReport = AutoTestReport;
