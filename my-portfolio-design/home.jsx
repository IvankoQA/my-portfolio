// home.jsx — Home page (CV hero) with two layouts: 'terminal' and 'editorial'.
// Reads CV data from window.CV; uses i18n via useT(lang).

const { useState, useEffect, useRef } = React;

// ─── Skill chip (with weight bar)
function SkillChip({ s }) {
  const t = useT(window.__lang || 'en');
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 11px",
      borderRadius: 7,
      background: "var(--bg-elev)",
      border: "1px solid var(--line)",
      fontSize: 12.5,
      fontFamily: "var(--font-mono)",
      color: "var(--ink-2)",
      letterSpacing: -0.1,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: 5,
        background: s.weight === 3 ? "var(--accent)" : s.weight === 2 ? "var(--ink-3)" : "var(--ink-4)",
      }} />
      {s.label}
    </span>
  );
}

// ─── Terminal command line (decorative) — also used as a hero
function TerminalLine({ user = "ivan@portfolio", pwd = "~", cmd, prompt = "$" }) {
  return (
    <div className="mono" style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
      <span style={{ color: "var(--ok)" }}>{user}</span>
      <span style={{ color: "var(--ink-4)" }}>:</span>
      <span style={{ color: "var(--info)" }}>{pwd}</span>
      <span style={{ color: "var(--ink-4)" }}> {prompt} </span>
      <span style={{ color: "var(--ink)" }}>{cmd}</span>
    </div>
  );
}

// ─── Hero stats
function Stats({ lang }) {
  const t = useT(lang);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
      {window.CV.stats.map((s, i) => (
        <div key={i} style={{
          padding: "16px 18px",
          borderRight: i < 3 ? "1px solid var(--line)" : "none",
        }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -1, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6, textTransform: "lowercase", letterSpacing: 0.2 }}>{t(s.labelKey)}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Experience row
function ExperienceItem({ x, lang }) {
  const t = useT(lang);
  const to = typeof x.to === "string" ? x.to : x.to[lang] || x.to.en;
  const role = typeof x.role === "string" ? x.role : x.role[lang] || x.role.en;
  const bullets = x.bullets[lang] || x.bullets.en;
  return (
    <article style={{
      display: "grid",
      gridTemplateColumns: "180px 1fr",
      gap: 24,
      padding: "20px 0",
      borderTop: "1px solid var(--line)",
    }}>
      <div>
        <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", letterSpacing: 0.2 }}>
          {x.from} → {to}
        </div>
        {x.domainKey && (
          <div style={{ marginTop: 8 }}>
            <Chip sm>{x.domainKey}</Chip>
          </div>
        )}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: -0.2 }}>{x.company}</h3>
          <span style={{ color: "var(--ink-3)", fontSize: 14 }}>· {role}</span>
        </div>
        <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)", paddingLeft: 16, position: "relative" }}>
              <span className="mono" style={{ position: "absolute", left: 0, top: 0, color: "var(--ink-4)" }}>›</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

// ─── Contact row
function ContactCard({ icon, label, value, href, lang }) {
  const t = useT(lang);
  const [copied, setCopied] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 16px",
      borderRadius: 10,
      background: "var(--bg-elev)",
      border: "1px solid var(--line)",
      transition: "border-color .15s, transform .15s",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: "var(--bg-sunken)",
        border: "1px solid var(--line)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--ink-2)", flexShrink: 0,
      }}>
        <Icon name={icon} size={16} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "lowercase", letterSpacing: 0.2 }}>{label}</div>
        <a href={href} target="_blank" rel="noopener noreferrer" style={{
          fontSize: 13.5, fontWeight: 500, color: "var(--ink)",
          display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>{value}</a>
      </div>
      <button onClick={(e) => {
        e.preventDefault(); e.stopPropagation();
        navigator.clipboard?.writeText(value).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1400);
      }}
        title={t("contact.copy")}
        style={{
          height: 28, padding: "0 10px",
          fontSize: 11, fontFamily: "var(--font-mono)",
          background: copied ? "var(--accent-soft)" : "transparent",
          color: copied ? "var(--accent)" : "var(--ink-3)",
          border: "1px solid var(--line)",
          borderRadius: 6, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}>
        {copied ? <><Icon name="check" size={11}/> {t("contact.copied")}</> : <><Icon name="copy" size={11}/> {t("contact.copy")}</>}
      </button>
    </div>
  );
}

// ─── Mini gauge for fit score
function ScoreGauge({ score = 0, label, sub }) {
  const C = 2 * Math.PI * 54;
  const offset = C - (score / 100) * C;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r="54" fill="none" stroke="var(--line)" strokeWidth="10" />
        <circle cx="64" cy="64" r="54" fill="none" stroke="var(--accent)" strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={offset}
          transform="rotate(-90 64 64)"
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.7,.3,1)" }}
        />
        <text x="64" y="68" textAnchor="middle" fontFamily="var(--font-display)" fontSize="32" fontWeight="600" fill="var(--ink)" style={{ fontVariantNumeric: "tabular-nums" }}>
          {score}
        </text>
        <text x="64" y="86" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-3)" letterSpacing="1">/ 100</text>
      </svg>
      <div>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: 0.4, textTransform: "lowercase" }}>{label}</div>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, marginTop: 4 }}>{sub}</div>
      </div>
    </div>
  );
}

// ─── Job-fit checker
function JobFitChecker({ lang, weightMode, setWeightMode }) {
  const t = useT(lang);
  const [text, setText] = useState("");
  const [state, setState] = useState("idle"); // idle | analyzing | results | error
  const [result, setResult] = useState(null);
  const [phase, setPhase] = useState(0); // 0/1/2 during loading
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef(null);

  function loadSample() {
    setText(window.CV.sampleJD[lang] || window.CV.sampleJD.en);
    setState("idle");
  }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result || "").slice(0, 30000));
    reader.readAsText(f);
  }

  function analyze() {
    if (!text.trim()) return;
    setState("analyzing");
    setPhase(0);
    let p = 0;
    const tick = setInterval(() => {
      p += 1;
      setPhase(p);
      if (p >= 2) {
        clearInterval(tick);
        setTimeout(() => {
          const r = window.analyzeJD(text, weightMode);
          if (r.error) { setState("error"); return; }
          setResult(r);
          setState("results");
        }, 400);
      }
    }, 500);
  }

  // Re-analyze when weight mode changes (after first run)
  useEffect(() => {
    if (state === "results" && text.trim()) {
      const r = window.analyzeJD(text, weightMode);
      if (r && !r.error) setResult(r);
    }
  }, [weightMode]);

  function reset() {
    setState("idle"); setResult(null); setText("");
  }

  function copySummary() {
    if (!result) return;
    const lines = [
      `Job-fit summary — Ivan Kozenko (${result.score}/100, ${t("fit.band." + result.band)})`,
      `Strong matches: ${result.strong.map(s => s.label).join(", ") || "—"}`,
      `Partial / adjacent: ${[
        ...result.partial.map(p => p.label),
        ...result.gaps.map(g => g.label),
      ].join(", ") || "—"}`,
    ];
    navigator.clipboard?.writeText(lines.join("\n")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{
      borderRadius: 14, background: "var(--bg-elev)",
      border: "1px solid var(--line)", overflow: "hidden",
    }}>
      {/* head */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: 8, background: "var(--accent)" }} />
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: 0.4 }}>JD-MATCH · LOCAL · NO LLM</span>
          </div>
          <h3 style={{ margin: "10px 0 4px", fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>{t("fit.title")}</h3>
          <div style={{ fontSize: 13.5, color: "var(--ink-3)", maxWidth: 540 }}>{t("fit.subtitle")}</div>
        </div>
        {/* Weighting selector */}
        <div style={{ display: "flex", gap: 4, padding: 3, background: "var(--bg-sunken)", borderRadius: 8, border: "1px solid var(--line)" }}>
          {[
            { v: "strict", l: t("fit.weight.strict") },
            { v: "balanced", l: t("fit.weight.balanced") },
            { v: "lenient", l: t("fit.weight.lenient") },
          ].map((o) => (
            <button key={o.v} onClick={() => setWeightMode(o.v)} style={{
              padding: "6px 11px", fontSize: 11.5, borderRadius: 5,
              border: "none", cursor: "pointer",
              background: weightMode === o.v ? "var(--bg-card)" : "transparent",
              boxShadow: weightMode === o.v ? "var(--shadow-sm)" : "none",
              color: weightMode === o.v ? "var(--ink)" : "var(--ink-3)",
              fontWeight: weightMode === o.v ? 500 : 400,
              fontFamily: "var(--font-mono)",
            }}>{o.l}</button>
          ))}
        </div>
      </div>

      {/* body */}
      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, minHeight: 380 }}>
        {/* LEFT: input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("fit.placeholder")}
            disabled={state === "analyzing"}
            style={{
              minHeight: 280, resize: "vertical",
              padding: 16,
              fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.55,
              background: "var(--bg-sunken)",
              color: "var(--ink)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Button variant="accent" onClick={analyze} disabled={!text.trim() || state === "analyzing"} icon="target">
              {state === "analyzing" ? t("fit.analyzing") : t("fit.analyze")}
            </Button>
            <Button variant="ghost" size="sm" onClick={loadSample} icon="spark">{t("fit.sample")}</Button>
            <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} icon="upload">{t("fit.upload")}</Button>
            <input ref={fileInputRef} type="file" accept=".txt,.md,text/*" onChange={onFile} style={{ display: "none" }} />
            <div style={{ flex: 1 }} />
            {state !== "idle" && <Button variant="ghost" size="sm" onClick={reset} icon="x">{t("fit.reset")}</Button>}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.5, padding: "10px 12px", background: "var(--bg-sunken)", borderRadius: 8, borderLeft: "2px solid var(--accent)" }}>
            {t("fit.disclaimer")}
          </div>
        </div>

        {/* RIGHT: states */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {state === "idle" && <FitEmpty t={t}/>}
          {state === "analyzing" && <FitLoading t={t} phase={phase}/>}
          {state === "error" && <FitError t={t} onReset={reset}/>}
          {state === "results" && result && (
            <FitResults t={t} r={result} onCopy={copySummary} copied={copied} lang={lang}/>
          )}
        </div>
      </div>
    </div>
  );
}

function FitEmpty({ t }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, border: "1px dashed var(--line)", borderRadius: 10, color: "var(--ink-3)", gap: 12 }}>
      <Icon name="target" size={28} stroke={1.4} />
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-2)" }}>{t("fit.empty.title")}</div>
      <div style={{ fontSize: 12.5, maxWidth: 260 }}>{t("fit.empty.body")}</div>
    </div>
  );
}

function FitLoading({ t, phase }) {
  const phases = [t("fit.reading"), t("fit.matching"), t("fit.scoring")];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, gap: 16 }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: 0.5 }}>// processing</div>
      {phases.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 18, height: 18, borderRadius: 18,
            background: i < phase ? "var(--ok)" : i === phase ? "transparent" : "var(--bg-sunken)",
            border: i === phase ? "2px solid var(--accent)" : "1px solid var(--line)",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}>
            {i < phase && <Icon name="check" size={11} stroke={2.4} style={{ color: "var(--bg)" }}/>}
            {i === phase && (
              <div className="spin" style={{ width: 10, height: 10, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: 5 }} />
            )}
          </div>
          <div style={{ fontSize: 14, color: i <= phase ? "var(--ink)" : "var(--ink-3)", fontWeight: i === phase ? 500 : 400 }}>{p}</div>
        </div>
      ))}
      {/* skeletons */}
      <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skel" style={{ height: 12, width: "60%" }} />
        <div className="skel" style={{ height: 12, width: "85%" }} />
        <div className="skel" style={{ height: 12, width: "70%" }} />
      </div>
    </div>
  );
}

function FitError({ t, onReset }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24, border: "1px solid var(--err)", borderRadius: 10, color: "var(--err)", gap: 12, background: "rgba(209,75,75,0.04)" }}>
      <Icon name="x" size={28}/>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{t("fit.error.title")}</div>
      <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{t("fit.error.body")}</div>
      <Button variant="secondary" size="sm" onClick={onReset}>{t("fit.reset")}</Button>
    </div>
  );
}

function FitResults({ t, r, onCopy, copied, lang }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
      <ScoreGauge score={r.score} label={t("fit.score.label")} sub={t("fit.band." + r.band)} />
      <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{t("fit.score.based")}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 4 }}>
        <FitGroup title={t("fit.match.strong")} count={r.strong.length} dotColor="var(--ok)" emptyText={t("fit.match.none")}>
          {r.strong.map((s) => (
            <Chip key={s.id} accent>{s.label}{s.hits > 1 && <span style={{ opacity: 0.6 }}>·{s.hits}</span>}</Chip>
          ))}
        </FitGroup>
        <FitGroup title={t("fit.match.partial")} count={r.partial.length + r.gaps.length} dotColor="var(--warn)" emptyText={t("fit.match.none")}>
          {r.partial.map((p) => (
            <Chip key={p.id} title={p.note?.[lang] || p.note?.en}>{p.label}</Chip>
          ))}
          {r.gaps.map((g) => (
            <Chip key={`gap:${g.label}`}><span style={{ color: "var(--err)" }}>{g.label}</span></Chip>
          ))}
        </FitGroup>
      </div>

      <div style={{ marginTop: "auto", paddingTop: 8 }}>
        <Button variant="secondary" size="sm" icon={copied ? "check" : "copy"} onClick={onCopy}>
          {copied ? t("fit.copied") : t("fit.copy")}
        </Button>
      </div>
    </div>
  );
}

function FitGroup({ title, count, dotColor, children, emptyText }) {
  const arr = React.Children.toArray(children);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 6, height: 6, borderRadius: 6, background: dotColor }} />
        <span className="mono" style={{ fontSize: 11.5, fontWeight: 500, color: "var(--ink-2)", letterSpacing: 0.2 }}>
          {title} <span style={{ color: "var(--ink-3)" }}>({count})</span>
        </span>
      </div>
      {arr.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{arr}</div>
      ) : (
        <div style={{ fontSize: 12, color: "var(--ink-3)", fontStyle: "italic" }}>{emptyText}</div>
      )}
    </div>
  );
}

window.JobFitChecker = JobFitChecker;
window.HomeBits = { Stats, ExperienceItem, ContactCard, SkillChip, TerminalLine };
