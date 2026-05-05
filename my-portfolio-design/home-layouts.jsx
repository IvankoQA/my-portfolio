// home-layouts.jsx — Two Home page layouts: 'terminal' and 'editorial'.
// Both render the SAME data; differ in composition, type scale, and rhythm.

function HomeHeader({ lang, setLang, theme, setTheme, onGoSandbox, t, sectionsVisible }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30,
      background: "color-mix(in oklch, var(--bg) 92%, transparent)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "12px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20,
      }}>
        <a href="#top" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, letterSpacing: -0.2, color: "var(--ink)" }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            background: "var(--ink)", color: "var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700,
          }}>IK</span>
          ivan-kozenko<span style={{ color: "var(--ink-3)" }}>.qa</span>
        </a>
        <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {sectionsVisible.experience && <NavLink href="#experience">{t("nav.experience")}</NavLink>}
          {sectionsVisible.stack && <NavLink href="#stack">{t("nav.skills")}</NavLink>}
          {sectionsVisible.fit && <NavLink href="#fit">{t("nav.fit")}</NavLink>}
          {sectionsVisible.contact && <NavLink href="#contact">{t("nav.contact")}</NavLink>}
        </nav>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setLang(lang === "en" ? "ua" : "en")} className="mono" style={{
            height: 30, padding: "0 10px", border: "1px solid var(--line)", borderRadius: 7,
            background: "transparent", color: "var(--ink-2)", fontSize: 11.5, fontWeight: 500, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <Icon name="globe" size={12} /> {lang.toUpperCase()}
          </button>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} title="Theme" style={{
            height: 30, width: 30, border: "1px solid var(--line)", borderRadius: 7,
            background: "transparent", color: "var(--ink-2)", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name={theme === "light" ? "moon" : "sun"} size={13} />
          </button>
          <Button variant="accent" size="sm" iconRight="arrow-right" onClick={onGoSandbox}>{t("home.cta.primary")}</Button>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }) {
  return (
    <a href={href} style={{
      padding: "7px 12px", fontSize: 13, color: "var(--ink-2)",
      borderRadius: 6, fontWeight: 450,
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--chip-bg)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────
// LAYOUT A — TERMINAL / GRID
// ─────────────────────────────────────────────────────────────
function HomeTerminal({ lang, theme, setLang, setTheme, onGoSandbox, weightMode, setWeightMode, sectionsVisible }) {
  const t = useT(lang);
  const [copied, setCopied] = useState(false);
  const cv = window.CV;
  const { Stats, ExperienceItem, ContactCard, SkillChip } = window.HomeBits;

  function copyCV() {
    const txt = `${cv.name} — ${cv.role[lang] || cv.role.en}\n${cv.location[lang] || cv.location.en}\n${cv.email} · ${cv.phone}\n${cv.links.linkedin}`;
    navigator.clipboard?.writeText(txt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Skills grouped by category for the stack section
  const cats = [
    { id: "framework", label: lang === "ua" ? "Фреймворки" : "Automation Frameworks" },
    { id: "language", label: lang === "ua" ? "Мови & патерни" : "Languages & Patterns" },
    { id: "api", label: "API & Data" },
    { id: "perf", label: lang === "ua" ? "Performance & Security" : "Performance & Security" },
    { id: "infra", label: "Infrastructure & CI/CD" },
    { id: "mgmt", label: lang === "ua" ? "Менеджмент" : "Observability & Mgmt" },
    { id: "ai", label: "AI & Productivity" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }} id="top">
      <HomeHeader lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onGoSandbox={onGoSandbox} t={t} sectionsVisible={sectionsVisible}/>

      {/* HERO */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 60, alignItems: "stretch" }}>
          <div>
            {/* status line */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 10px 5px 8px", border: "1px solid var(--line)", borderRadius: 999, marginBottom: 24, background: "var(--bg-elev)" }}>
              <span className="pulse-dot" />
              <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-2)", letterSpacing: 0.2 }}>{t("home.status.available")}</span>
            </div>

            <div className="mono" style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>
              <span style={{ color: "var(--ok)" }}>$</span> whoami
            </div>
            <h1 style={{
              margin: 0, fontSize: "clamp(44px, 6vw, 84px)", lineHeight: 0.95,
              fontWeight: 600, letterSpacing: -2.4, color: "var(--ink)",
              fontFamily: "var(--font-display)",
            }}>
              {cv.name}.
            </h1>
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 17, fontWeight: 500, color: "var(--ink-2)" }}>{cv.role[lang] || cv.role.en}</span>
              <span style={{ color: "var(--ink-4)" }}>·</span>
              <span className="mono" style={{ fontSize: 13, color: "var(--ink-3)" }}>{cv.location[lang] || cv.location.en}</span>
            </div>

            <p style={{
              marginTop: 28, marginBottom: 0, fontSize: 19, lineHeight: 1.5,
              color: "var(--ink-2)", maxWidth: 560, letterSpacing: -0.2,
              textWrap: "pretty",
            }}>
              <span className="uline">{t("home.tagline")}</span>
            </p>

            {/* CTAs */}
            <div style={{ marginTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Button variant="accent" size="lg" iconRight="arrow-right" onClick={onGoSandbox}>{t("home.cta.primary")}</Button>
              <Button variant="secondary" size="lg" icon={copied ? "check" : "copy"} onClick={copyCV}>
                {copied ? t("home.cta.copied") : t("home.cta.secondary")}
              </Button>
            </div>
          </div>

          {/* Right: terminal card */}
          <div style={{
            background: "var(--term-bg)", borderRadius: 12,
            border: "1px solid var(--line)",
            overflow: "hidden", display: "flex", flexDirection: "column",
            boxShadow: "var(--shadow-md)",
          }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: "#FF5F57" }} />
              <span style={{ width: 10, height: 10, borderRadius: 5, background: "#FEBC2E" }} />
              <span style={{ width: 10, height: 10, borderRadius: 5, background: "#28C840" }} />
              <span className="mono" style={{ marginLeft: 10, fontSize: 11, color: "rgba(240,237,229,.6)" }}>~/portfolio — zsh</span>
            </div>
            <div className="mono" style={{ padding: 18, fontSize: 12.5, lineHeight: 1.7, color: "var(--term-ink)", flex: 1, fontFamily: "var(--font-mono)" }}>
              <div><span style={{ color: "#7CFF6B" }}>ivan@portfolio</span><span style={{ opacity: .5 }}>:</span><span style={{ color: "#6BB6FF" }}>~</span><span style={{ opacity: .5 }}> $ </span>cat about.txt</div>
              <div style={{ color: "rgba(240,237,229,.85)", marginTop: 6, marginBottom: 10, whiteSpace: "pre-wrap" }}>
                {t("home.summary")}
              </div>
              <div><span style={{ color: "#7CFF6B" }}>ivan@portfolio</span><span style={{ opacity: .5 }}>:</span><span style={{ color: "#6BB6FF" }}>~</span><span style={{ opacity: .5 }}> $ </span>npx playwright test --shard=1/3</div>
              <div style={{ color: "rgba(240,237,229,.7)", marginTop: 4 }}>
                Running 47 tests using 4 workers
              </div>
              <div style={{ color: "#7CFF6B", marginTop: 2 }}>  ✓ 47 passed (1m 38s)</div>
              <div style={{ color: "rgba(240,237,229,.5)", marginTop: 2 }}>
                <span style={{ color: "#FFB36B" }}>Slowest:</span> auth › 2FA flow (12.4s)
              </div>
              <div style={{ marginTop: 10 }}>
                <span style={{ color: "#7CFF6B" }}>ivan@portfolio</span><span style={{ opacity: .5 }}>:</span><span style={{ color: "#6BB6FF" }}>~</span><span style={{ opacity: .5 }}> $ </span>
                <span style={{ background: "var(--term-ink)", color: "var(--term-bg)", padding: "0 3px", animation: "blink 1.1s steps(2) infinite" }}>_</span>
              </div>
              <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 48 }}>
          <Stats lang={lang} />
        </div>
      </section>

      {/* WINS */}
      {sectionsVisible.wins && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.wins")} title={lang === "ua" ? "Ключові досягнення" : "Key wins"} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {cv.wins.map((w, i) => (
              <div key={i} style={{
                padding: "22px 24px",
                borderRadius: 14, background: "var(--bg-elev)",
                border: "1px solid var(--line)",
                position: "relative", overflow: "hidden",
              }}>
                <div className="mono" style={{
                  position: "absolute", top: 14, right: 16,
                  fontSize: 10, color: "var(--ink-4)", letterSpacing: 0.5, textTransform: "uppercase",
                }}>{w.tag}</div>
                <div style={{ fontSize: 15, lineHeight: 1.5, color: "var(--ink-2)", textWrap: "pretty", marginTop: 4 }}>
                  {w[lang] || w.en}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {sectionsVisible.experience && (
        <section id="experience" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.experience")} title={lang === "ua" ? "Досвід роботи" : "Experience"} />
          <div>
            {cv.experience.map((x, i) => (
              <ExperienceItem key={i} x={x} lang={lang} />
            ))}
            <div style={{ borderTop: "1px solid var(--line)" }} />
          </div>
        </section>
      )}

      {/* TECH STACK */}
      {sectionsVisible.stack && (
        <section id="stack" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.stack")} title={lang === "ua" ? "Технологічний стек" : "Tech stack"} sub={lang === "ua" ? "Розмір крапки = глибина експертизи" : "Dot size indicates depth of expertise"} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            {cats.map((c) => {
              const items = cv.skills.filter((s) => s.category === c.id);
              if (items.length === 0) return null;
              return (
                <div key={c.id} style={{ padding: 20, borderRadius: 12, background: "var(--bg-elev)", border: "1px solid var(--line)" }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>{c.label}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map((s) => <SkillChip key={s.id} s={s} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* JOB FIT */}
      {sectionsVisible.fit && (
        <section id="fit" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.fit")} title={lang === "ua" ? "Перевірка під вашу вакансію" : "Job-fit checker for recruiters"} sub={lang === "ua" ? "Швидкий чесний матчинг — без BS-метрик." : "Quick honest match — no inflated buzzword bingo."}/>
          <JobFitChecker lang={lang} weightMode={weightMode} setWeightMode={setWeightMode} />
        </section>
      )}

      {/* DEV / LANGUAGES / BEYOND */}
      {sectionsVisible.beyond && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 18 }}>
            {/* Languages */}
            <div style={{ padding: 22, borderRadius: 12, background: "var(--bg-elev)", border: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 14 }}>{t("home.section.languages")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cv.languages.map((l) => (
                  <div key={l.lang} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 32, height: 24, borderRadius: 4, background: "var(--bg-sunken)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, color: "var(--ink-2)",
                      border: "1px solid var(--line)",
                    }}>{l.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{l.lang}</span>
                    <span style={{ flex: 1 }} />
                    <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Development */}
            <div style={{ padding: 22, borderRadius: 12, background: "var(--bg-elev)", border: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 14 }}>{t("home.section.education")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cv.development.map((d, i) => (
                  <div key={i} style={{ fontSize: 13.5, color: "var(--ink-2)", display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Icon name="check" size={14} style={{ color: "var(--ok)", marginTop: 2, flexShrink: 0 }}/>
                    {d[lang] || d.en}
                  </div>
                ))}
              </div>
            </div>
            {/* Beyond */}
            <div style={{ padding: 22, borderRadius: 12, background: "var(--bg-elev)", border: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 14 }}>{t("home.section.beyond")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {cv.beyond.map((b, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{lang === "ua" ? b.titleUa : b.titleEn}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>{lang === "ua" ? b.bodyUa : b.bodyEn}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      {sectionsVisible.contact && (
        <section id="contact" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.contact")} title={lang === "ua" ? "Зв'яжіться зі мною" : "Get in touch"} sub={lang === "ua" ? "Найшвидше — Telegram або LinkedIn." : "Fastest reply on Telegram or LinkedIn."}/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <ContactCard icon="mail" label={t("contact.email")} value={cv.email} href={`mailto:${cv.email}`} lang={lang} />
            <ContactCard icon="linkedin" label={t("contact.linkedin")} value="ivan-kozenko-qa" href={cv.links.linkedin} lang={lang}/>
            <ContactCard icon="telegram" label={t("contact.telegram")} value="@IvanTryCry" href={cv.links.telegram} lang={lang}/>
            <ContactCard icon="github" label={t("contact.github")} value="ivan-kozenko-qa" href={cv.links.github} lang={lang}/>
            <ContactCard icon="youtube" label={t("contact.youtube")} value="@ivan-kozenko" href={cv.links.youtube} lang={lang}/>
            <ContactCard icon="phone" label={t("contact.phone")} value={cv.phone} href={`tel:${cv.phone.replace(/\s/g, "")}`} lang={lang}/>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ marginTop: 100, padding: "32px", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
            <span style={{ color: "var(--ok)" }}>$</span> exit 0 · {new Date().getFullYear()} · Built with too much coffee.
          </div>
          <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
            v2.4.1 · last commit: 2 days ago · ✓ green
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LAYOUT B — EDITORIAL / BIG TYPE
// ─────────────────────────────────────────────────────────────
function HomeEditorial({ lang, theme, setLang, setTheme, onGoSandbox, weightMode, setWeightMode, sectionsVisible }) {
  const t = useT(lang);
  const cv = window.CV;
  const { Stats, ExperienceItem, ContactCard, SkillChip } = window.HomeBits;
  const [copied, setCopied] = useState(false);

  function copyCV() {
    const txt = `${cv.name} — ${cv.role[lang] || cv.role.en}\n${cv.email}\n${cv.links.linkedin}`;
    navigator.clipboard?.writeText(txt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }} id="top">
      <HomeHeader lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onGoSandbox={onGoSandbox} t={t} sectionsVisible={sectionsVisible}/>

      {/* HERO — full bleed type */}
      <section style={{ position: "relative", overflow: "hidden", padding: "80px 32px 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          {/* Status row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 50 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="pulse-dot" />
              <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-2)", letterSpacing: 0.4, textTransform: "uppercase" }}>{t("home.status.available")}</span>
            </div>
            <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", letterSpacing: 0.4, textTransform: "uppercase" }}>
              {cv.location[lang] || cv.location.en} · {cv.yearsExperience}+ {t("home.years")}
            </div>
          </div>

          {/* Massive name */}
          <h1 style={{
            margin: 0, fontSize: "clamp(60px, 11vw, 168px)",
            lineHeight: 0.85, fontWeight: 600, letterSpacing: -5,
            color: "var(--ink)", fontFamily: "var(--font-display)",
            textWrap: "balance",
          }}>
            {cv.name.split(" ").map((w, i) => (
              <div key={i}>{w}{i === 0 && <span style={{ color: "var(--accent)" }}>.</span>}</div>
            ))}
          </h1>

          {/* sub */}
          <div style={{
            marginTop: 36,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end",
          }}>
            <div>
              <div className="mono" style={{ fontSize: 12.5, color: "var(--ink-3)", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 10 }}>// role</div>
              <div style={{ fontSize: 24, fontWeight: 500, color: "var(--ink)", letterSpacing: -0.6, lineHeight: 1.2 }}>
                {cv.role[lang] || cv.role.en}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                <Chip accent>Playwright</Chip>
                <Chip accent>TypeScript</Chip>
                <Chip>E2E · API · CI/CD</Chip>
                <Chip>fintech · gaming</Chip>
              </div>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 12.5, color: "var(--ink-3)", letterSpacing: 0.4, textTransform: "uppercase", marginBottom: 10 }}>// elevator</div>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: "var(--ink-2)", textWrap: "pretty" }}>
                {t("home.summary")}
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ marginTop: 44, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <Button variant="primary" size="lg" iconRight="arrow-right" onClick={onGoSandbox}>{t("home.cta.primary")}</Button>
            <Button variant="secondary" size="lg" icon={copied ? "check" : "copy"} onClick={copyCV}>
              {copied ? t("home.cta.copied") : t("home.cta.secondary")}
            </Button>
            <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", marginLeft: 8 }}>↓ scroll for the deep dive</span>
          </div>
        </div>

        {/* Marquee */}
        <div style={{ marginTop: 80, padding: "16px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", overflow: "hidden", whiteSpace: "nowrap" }}>
          <div style={{ display: "inline-flex", animation: "marquee 40s linear infinite", gap: 40 }}>
            {[...Array(2)].map((_, k) => (
              <div key={k} style={{ display: "inline-flex", gap: 40, paddingRight: 40 }}>
                {["Playwright", "TypeScript", "Postman", "k6", "Datadog", "GitHub Actions", "Docker", "Allure", "Cypress", "GraphQL", "SQL", "Cursor"].map((w) => (
                  <span key={w} className="mono" style={{ fontSize: 14, color: "var(--ink-3)", letterSpacing: 0.4 }}>
                    {w} <span style={{ color: "var(--accent)" }}>·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUMMARY + STATS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
        <Stats lang={lang} />
      </section>

      {/* EXPERIENCE */}
      {sectionsVisible.experience && (
        <section id="experience" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.experience")} title={lang === "ua" ? "Досвід роботи" : "Experience"}/>
          <div>{cv.experience.map((x, i) => <ExperienceItem key={i} x={x} lang={lang}/>)}<div style={{ borderTop: "1px solid var(--line)" }}/></div>
        </section>
      )}

      {/* WINS */}
      {sectionsVisible.wins && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.wins")} title={lang === "ua" ? "Ключові досягнення" : "Key wins"}/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden", background: "var(--bg-elev)" }}>
            {cv.wins.map((w, i) => (
              <div key={i} style={{ padding: "26px 28px", borderRight: i === 0 ? "1px solid var(--line)" : "none", position: "relative" }}>
                <div className="mono" style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12 }}>● {w.tag}</div>
                <div style={{ fontSize: 18, lineHeight: 1.45, color: "var(--ink)", letterSpacing: -0.2, fontWeight: 500, textWrap: "pretty" }}>
                  {w[lang] || w.en}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STACK — flat tag wall */}
      {sectionsVisible.stack && (
        <section id="stack" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.stack")} title={lang === "ua" ? "Технологічний стек" : "Tech stack"}/>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 28, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 14 }}>
            {cv.skills.map((s) => <SkillChip key={s.id} s={s}/>)}
          </div>
        </section>
      )}

      {/* JOB FIT */}
      {sectionsVisible.fit && (
        <section id="fit" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.fit")} title={lang === "ua" ? "Перевірка під вашу вакансію" : "Job-fit checker for recruiters"} sub={lang === "ua" ? "Чесний матчинг проти вашої вакансії." : "Honest match against the JD you have open."}/>
          <JobFitChecker lang={lang} weightMode={weightMode} setWeightMode={setWeightMode} />
        </section>
      )}

      {/* DEV / LANGUAGES / BEYOND */}
      {sectionsVisible.beyond && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 18 }}>
            <div style={{ padding: 22, borderRadius: 12, background: "var(--bg-elev)", border: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 14 }}>{t("home.section.languages")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cv.languages.map((l) => (
                  <div key={l.lang} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 32, height: 24, borderRadius: 4, background: "var(--bg-sunken)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, color: "var(--ink-2)",
                      border: "1px solid var(--line)",
                    }}>{l.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{l.lang}</span>
                    <span style={{ flex: 1 }} />
                    <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 22, borderRadius: 12, background: "var(--bg-elev)", border: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 14 }}>{t("home.section.education")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cv.development.map((d, i) => (
                  <div key={i} style={{ fontSize: 13.5, color: "var(--ink-2)", display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <Icon name="check" size={14} style={{ color: "var(--ok)", marginTop: 2, flexShrink: 0 }}/>
                    {d[lang] || d.en}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 22, borderRadius: 12, background: "var(--bg-elev)", border: "1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 14 }}>{t("home.section.beyond")}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {cv.beyond.map((b, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{lang === "ua" ? b.titleUa : b.titleEn}</div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>{lang === "ua" ? b.bodyUa : b.bodyEn}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT — large blocks */}
      {sectionsVisible.contact && (
        <section id="contact" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 0" }}>
          <SectionHeader eyebrow={t("home.section.contact")} title={lang === "ua" ? "Зв'яжіться зі мною" : "Get in touch"}/>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <ContactCard icon="mail" label={t("contact.email")} value={cv.email} href={`mailto:${cv.email}`} lang={lang} />
            <ContactCard icon="linkedin" label={t("contact.linkedin")} value="ivan-kozenko-qa" href={cv.links.linkedin} lang={lang}/>
            <ContactCard icon="telegram" label={t("contact.telegram")} value="@IvanTryCry" href={cv.links.telegram} lang={lang}/>
            <ContactCard icon="github" label={t("contact.github")} value="ivan-kozenko-qa" href={cv.links.github} lang={lang}/>
            <ContactCard icon="youtube" label={t("contact.youtube")} value="@ivan-kozenko" href={cv.links.youtube} lang={lang}/>
            <ContactCard icon="phone" label={t("contact.phone")} value={cv.phone} href={`tel:${cv.phone.replace(/\s/g, "")}`} lang={lang}/>
          </div>
        </section>
      )}

      <footer style={{ marginTop: 100, padding: "32px", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>© {new Date().getFullYear()} Ivan Kozenko · QA, but make it editorial.</div>
          <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>v2.4.1 · ✓ all suites green</div>
        </div>
      </footer>
    </div>
  );
}

window.HomeTerminal = HomeTerminal;
window.HomeEditorial = HomeEditorial;
