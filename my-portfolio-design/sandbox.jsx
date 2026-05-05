// sandbox.jsx — Vibe Coder Supply Co. store + Challenge mode + Results + Auto-test report.

const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM } = React;

// ─── Tiny placeholder product image (striped, with mono initials)
function ProductImage({ p, size = 120 }) {
  const initials = p.name.en.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase().slice(0, 2);
  // Hash to pick a tint
  const seed = p.id.charCodeAt(1) + p.id.charCodeAt(2);
  const hues = [22, 200, 280, 145, 45, 320];
  const hue = hues[seed % hues.length];
  return (
    <div style={{
      width: size, height: size,
      borderRadius: 8,
      background: `linear-gradient(135deg, oklch(0.9 0.05 ${hue}), oklch(0.78 0.08 ${hue}))`,
      backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,.06) 0px, rgba(0,0,0,.06) 6px, transparent 6px, transparent 12px), linear-gradient(135deg, oklch(0.92 0.05 ${hue}), oklch(0.78 0.1 ${hue}))`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-mono)", fontSize: size / 5, fontWeight: 700,
      color: "rgba(20,17,13,.55)", letterSpacing: -0.5,
      flexShrink: 0,
      position: "relative", overflow: "hidden",
    }}>{initials}</div>
  );
}

// ─── Star rating
function Stars({ value, count }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--ink-3)" }}>
      <span style={{ display: "inline-flex" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ color: i < full ? "var(--accent)" : i === full && half ? "var(--accent)" : "var(--line-strong)", opacity: i === full && half ? 0.6 : 1, fontSize: 12 }}>★</span>
        ))}
      </span>
      <span className="mono">{value.toFixed(1)}</span>
      {count != null && <span className="mono" style={{ opacity: .6 }}>({count})</span>}
    </span>
  );
}

// ─── Product card (grid)
function ProductCard({ p, onAdd, lang, dense, onMarkBug }) {
  const t = useT(lang);
  const [added, setAdded] = useS(false);
  const oos = p.stock === 0;
  function add() {
    // BUG b04: out-of-stock items can still be added — intentional
    onAdd(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--line)",
      borderRadius: 12,
      padding: dense ? 12 : 16,
      display: "flex", flexDirection: "column",
      transition: "border-color .15s, transform .15s",
      position: "relative",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink-3)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}>
      {/* badges */}
      <div style={{ position: "absolute", top: dense ? 10 : 14, left: dense ? 10 : 14, display: "flex", gap: 4, zIndex: 1 }}>
        {p.isNew && <span className="mono" style={{ padding: "2px 7px", fontSize: 10, fontWeight: 600, background: "var(--ink)", color: "var(--bg)", borderRadius: 4 }}>NEW</span>}
        {p.sale && <span className="mono" style={{ padding: "2px 7px", fontSize: 10, fontWeight: 600, background: "var(--accent)", color: "var(--accent-ink)", borderRadius: 4 }}>SALE</span>}
        {oos && <span className="mono" style={{ padding: "2px 7px", fontSize: 10, fontWeight: 600, background: "var(--bg-sunken)", color: "var(--ink-3)", borderRadius: 4, border: "1px solid var(--line)" }}>0 LEFT</span>}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <ProductImage p={p} size={dense ? 90 : 120} />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: dense ? 12.5 : 13.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 4, color: "var(--ink)" }}>
          {p.name[lang] || p.name.en}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.4, marginBottom: 10, minHeight: dense ? 0 : 32 }}>
          {p.tagline[lang] || p.tagline.en}
        </div>
        <Stars value={p.rating} count={p.reviews} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 12, paddingTop: 12, borderTop: "1px dashed var(--line)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: dense ? 14 : 16, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--ink)" }}>${p.price}</span>
          {p.oldPrice && <span style={{ fontSize: 11, color: "var(--ink-4)", textDecoration: "line-through", fontFamily: "var(--font-mono)" }}>${p.oldPrice}</span>}
        </div>
        <button onClick={add} style={{
          height: 28, padding: "0 10px",
          fontSize: 11.5, fontWeight: 600, fontFamily: "var(--font-mono)",
          background: added ? "var(--ok)" : "var(--ink)",
          color: added ? "#fff" : "var(--bg)",
          border: "none", borderRadius: 6, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 4,
          transition: "background .15s",
        }}>
          {added ? <><Icon name="check" size={11} stroke={2.5}/> {t("sb.added")}</> : <><Icon name="plus" size={11} stroke={2.5}/> {t("sb.add")}</>}
        </button>
      </div>
    </div>
  );
}

// ─── Product row (list view)
function ProductRow({ p, onAdd, lang }) {
  const t = useT(lang);
  const [added, setAdded] = useS(false);
  function add() {
    onAdd(p);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "70px 1fr 110px 140px 110px",
      gap: 16, alignItems: "center",
      padding: "12px 16px",
      background: "var(--bg-card)",
      border: "1px solid var(--line)",
      borderRadius: 10,
    }}>
      <ProductImage p={p} size={56} />
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name[lang] || p.name.en}</span>
          {p.isNew && <Chip sm accent>NEW</Chip>}
          {p.sale && <Chip sm accent>SALE</Chip>}
          {p.stock === 0 && <Chip sm>OOS</Chip>}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{p.tagline[lang] || p.tagline.en}</div>
      </div>
      <Stars value={p.rating} count={p.reviews} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span className="mono" style={{ fontSize: 14, fontWeight: 700 }}>${p.price}</span>
        {p.oldPrice && <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", textDecoration: "line-through" }}>was ${p.oldPrice}</span>}
      </div>
      <button onClick={add} style={{
        height: 30, padding: "0 12px",
        fontSize: 11.5, fontWeight: 600, fontFamily: "var(--font-mono)",
        background: added ? "var(--ok)" : "var(--ink)",
        color: added ? "#fff" : "var(--bg)",
        border: "none", borderRadius: 6, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
      }}>
        {added ? <><Icon name="check" size={11} stroke={2.5}/> {t("sb.added")}</> : <><Icon name="plus" size={12} stroke={2.5}/> {t("sb.add")}</>}
      </button>
    </div>
  );
}

// ─── Main Sandbox component
function Sandbox({ lang, theme, setLang, setTheme, onGoHome, density, humor, challenge, onStartChallenge, onMarkBug, foundBugIds, onFinishChallenge, timeLeft, totalBugs }) {
  const t = useT(lang);
  const [view, setView] = useS("grid");
  const [query, setQuery] = useS("");
  const [cat, setCat] = useS("all");
  const [sort, setSort] = useS("featured");
  const [minRating, setMinRating] = useS(0);
  const [maxPrice, setMaxPrice] = useS(500);
  const [stockOnly, setStockOnly] = useS(false);
  const [page, setPage] = useS(1);
  const perPage = density === "dense" ? 16 : density === "sparse" ? 8 : 12;

  // Cart
  const [cart, setCart] = useS([]);
  const [cartOpen, setCartOpen] = useS(false);
  const [chatOpen, setChatOpen] = useS(false);
  const [accountOpen, setAccountOpen] = useS(false);
  const [user, setUser] = useS(null); // {email, role}
  const [promo, setPromo] = useS(null); // {code, applied}
  const [promoInput, setPromoInput] = useS("");

  function addToCart(p) {
    setCart((c) => {
      const ex = c.find((x) => x.id === p.id);
      if (ex) return c.map((x) => x.id === p.id ? { ...x, q: x.q + 1 } : x);
      return [...c, { ...p, q: 1 }];
    });
    if (challenge && p.stock === 0) onMarkBug?.("b04");
  }
  function removeFromCart(id) {
    setCart((c) => c.filter((x) => x.id !== id));
  }
  function updateQty(id, delta) {
    setCart((c) => c.map((x) => x.id === id ? { ...x, q: Math.max(0, x.q + delta) } : x).filter(x => x.q > 0));
  }

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (code === "VIBES10") {
      // BUG b06: stacks if applied twice
      if (promo?.applied && challenge) onMarkBug?.("b06");
      setPromo({ code: "VIBES10", applied: (promo?.applied || 0) + 1, percent: 10 * ((promo?.applied || 0) + 1) });
    } else {
      setPromo(null);
    }
  }

  // Filter
  const filtered = useM(() => {
    let list = window.SB_PRODUCTS.slice();
    // BUG b02: search ignores cyrillic — only matches en name when query is ASCII
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const isCyrillic = /[\u0400-\u04FF]/.test(q);
      if (isCyrillic) {
        list = []; // intentional bug
        if (challenge) onMarkBug?.("b02");
      } else {
        list = list.filter((p) =>
          p.name.en.toLowerCase().includes(q) ||
          p.id.includes(q) ||
          p.tagline.en.toLowerCase().includes(q)
        );
      }
    }
    if (cat !== "all") list = list.filter((p) => p.cat === cat);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (maxPrice < 500) list = list.filter((p) => p.price <= maxPrice);
    if (stockOnly) list = list.filter((p) => p.stock > 0);
    // sort
    if (sort === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "new") list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [query, cat, minRating, maxPrice, stockOnly, sort, challenge]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pagedProducts = filtered.slice((page - 1) * perPage, page * perPage);

  // BUG b11: page 0 briefly on filter change
  useE(() => {
    setPage(1);
  }, [cat, minRating, maxPrice, stockOnly]);

  function clearFilters() {
    setQuery(""); setCat("all"); setMaxPrice(500); setStockOnly(false);
    // BUG b03: minRating not reset — intentional
  }

  // Subtotal — BUG b07: rounds wrong on odd qty stickers
  const subtotal = cart.reduce((s, x) => {
    let v = x.price * x.q;
    if (x.cat === "sticker" && x.q % 2 === 1) v = Math.floor(v); // wrong rounding
    return s + v;
  }, 0);
  const promoDiscount = promo ? subtotal * (promo.percent / 100) : 0;
  const total = Math.max(0, subtotal - promoDiscount);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: challenge ? 80 : 0 }}>
      {/* Challenge top banner */}
      {challenge && (
        <ChallengeBar t={t} timeLeft={timeLeft} foundCount={foundBugIds.length} totalBugs={totalBugs} onFinish={onFinishChallenge} />
      )}

      {/* Top header */}
      <header style={{
        position: "sticky", top: challenge ? 44 : 0, zIndex: 20,
        background: "color-mix(in oklch, var(--bg) 92%, transparent)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onGoHome} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-2)", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
            {t("sb.back.home")}
          </button>
          <div style={{ width: 1, height: 22, background: "var(--line)" }} />
          <a href="#top" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14 }}>
            <span style={{ width: 24, height: 24, borderRadius: 6, background: "var(--accent)", color: "var(--accent-ink)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="duck" size={14} stroke={2.2}/>
            </span>
            <span style={{ letterSpacing: -0.3 }}>{t("sb.brand")}</span>
          </a>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 480, marginLeft: 16, position: "relative" }}>
            <Icon name="search" size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}/>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("sb.search")}
              style={{
                width: "100%", height: 36, padding: "0 12px 0 34px",
                background: "var(--bg-elev)", border: "1px solid var(--line)",
                borderRadius: 8, fontSize: 13, color: "var(--ink)",
                outline: "none", fontFamily: "var(--font-sans)",
              }}/>
            {query && <button onClick={() => setQuery("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-3)" }}><Icon name="x" size={13}/></button>}
          </div>

          <div style={{ flex: 1 }} />

          <button onClick={() => setLang(lang === "en" ? "ua" : "en")} className="mono" style={{ height: 30, padding: "0 10px", border: "1px solid var(--line)", borderRadius: 7, background: "transparent", color: "var(--ink-2)", fontSize: 11.5, fontWeight: 500, cursor: "pointer" }}>{lang.toUpperCase()}</button>
          <button onClick={() => setTheme(theme === "light" ? "dark" : "light")} style={{ height: 30, width: 30, border: "1px solid var(--line)", borderRadius: 7, background: "transparent", color: "var(--ink-2)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={theme === "light" ? "moon" : "sun"} size={13} />
          </button>
          <button onClick={() => setChatOpen(true)} style={{ height: 30, padding: "0 10px", border: "1px solid var(--line)", borderRadius: 7, background: "transparent", color: "var(--ink-2)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <Icon name="chat" size={13}/> {t("sb.contact")}
          </button>
          <button onClick={() => setAccountOpen(true)} style={{ height: 30, padding: "0 10px", border: "1px solid var(--line)", borderRadius: 7, background: user ? "var(--accent-soft)" : "transparent", color: user ? "var(--accent)" : "var(--ink-2)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
            <Icon name="user" size={13}/> {user ? user.email.split("@")[0] : t("sb.account")}
          </button>
          <button onClick={() => setCartOpen(true)} style={{ height: 30, padding: "0 12px", border: "none", borderRadius: 7, background: "var(--ink)", color: "var(--bg)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 }}>
            <Icon name="cart" size={13}/> {t("sb.cart")} <span className="mono" style={{ background: "var(--accent)", color: "var(--accent-ink)", borderRadius: 4, padding: "1px 5px", fontSize: 10, marginLeft: 2 }}>{cart.reduce((s, x) => s + x.q, 0)}</span>
          </button>
        </div>

        {/* Promo + challenge invite */}
        {!challenge && (
          <div style={{ background: "var(--ink)", color: "var(--bg)", textAlign: "center", padding: "8px 24px", fontSize: 12, fontFamily: "var(--font-mono)", display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
            <span>{t("sb.promo")}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <button onClick={onStartChallenge} style={{ background: "var(--accent)", color: "var(--accent-ink)", border: "none", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="bug" size={11} stroke={2.4}/> {t("ch.banner")}
            </button>
          </div>
        )}
      </header>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }} id="top">
        {/* SIDEBAR — Filters */}
        <aside style={{ position: "sticky", top: challenge ? 140 : 100, alignSelf: "flex-start" }}>
          <div style={{ padding: 16, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 12 }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 }}>{t("sb.filters")}</div>

            {/* Categories */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[{ id: "all" }, ...window.SB_CATEGORIES].map((c) => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "7px 10px", border: "none", background: cat === c.id ? "var(--bg-sunken)" : "transparent",
                  color: cat === c.id ? "var(--ink)" : "var(--ink-2)",
                  borderRadius: 6, cursor: "pointer", fontSize: 12.5, fontFamily: "var(--font-sans)",
                  fontWeight: cat === c.id ? 600 : 400, textAlign: "left",
                }}>
                  <span>{t("sb.cat." + c.id)}</span>
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>
                    {c.id === "all" ? window.SB_PRODUCTS.length : window.SB_PRODUCTS.filter(p => p.cat === c.id).length}
                  </span>
                </button>
              ))}
            </div>

            <hr style={{ border: "none", borderTop: "1px solid var(--line)", margin: "14px 0" }}/>

            {/* Price */}
            <div style={{ marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}>{t("sb.price")}: <span style={{ color: "var(--ink)" }}>${maxPrice}</span></div>
              <input type="range" min={5} max={500} step={5} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} style={{ width: "100%", accentColor: "var(--accent)" }}/>
            </div>

            {/* Rating */}
            <div style={{ marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}>{t("sb.rating")}</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 3, 4, 4.5].map((r) => (
                  <button key={r} onClick={() => setMinRating(r)} style={{
                    flex: 1, padding: "5px 0", border: "1px solid var(--line)",
                    background: minRating === r ? "var(--ink)" : "var(--bg-card)",
                    color: minRating === r ? "var(--bg)" : "var(--ink-2)",
                    borderRadius: 5, fontSize: 11, cursor: "pointer", fontFamily: "var(--font-mono)",
                  }}>{r === 0 ? "all" : r + "+"}</button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--ink-2)", cursor: "pointer", padding: "4px 0" }}>
              <input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)}/>
              {t("sb.stock")}
            </label>

            <button onClick={clearFilters} style={{
              marginTop: 14, width: "100%",
              height: 30, border: "1px solid var(--line)", background: "var(--bg-card)",
              color: "var(--ink-2)", fontSize: 11.5, borderRadius: 6, cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}>{t("sb.empty.cta")}</button>
          </div>

          {/* Bug-checklist panel (only in challenge) */}
          {challenge && <BugChecklistPanel t={t} foundBugIds={foundBugIds} onMark={onMarkBug} lang={lang}/>}
        </aside>

        {/* MAIN — toolbar + grid + pagination */}
        <main>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
              <span style={{ color: "var(--ink)", fontWeight: 600 }}>{filtered.length}</span> {t("sb.results")}
              {cat !== "all" && <> · {t("sb.cat." + cat)}</>}
              {query && <> · "<span style={{ color: "var(--ink)" }}>{query}</span>"</>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select value={sort} onChange={(e) => setSort(e.target.value)} style={{
                height: 30, padding: "0 10px", border: "1px solid var(--line)", borderRadius: 7,
                background: "var(--bg-elev)", color: "var(--ink-2)", fontSize: 12, cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}>
                {["featured", "priceAsc", "priceDesc", "rating", "new"].map((s) => (
                  <option key={s} value={s}>{t("sb.sort." + s)}</option>
                ))}
              </select>
              <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 7, overflow: "hidden" }}>
                <button onClick={() => setView("grid")} title={t("sb.view.grid")} style={{
                  width: 30, height: 30, border: "none",
                  background: view === "grid" ? "var(--ink)" : "var(--bg-elev)",
                  color: view === "grid" ? "var(--bg)" : "var(--ink-2)",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}><Icon name="grid" size={13}/></button>
                <button onClick={() => setView("list")} title={t("sb.view.list")} style={{
                  width: 30, height: 30, border: "none",
                  background: view === "list" ? "var(--ink)" : "var(--bg-elev)",
                  color: view === "list" ? "var(--bg)" : "var(--ink-2)",
                  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}><Icon name="list" size={13}/></button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: "center", border: "1px dashed var(--line)", borderRadius: 14, color: "var(--ink-3)" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-2)" }}>{t("sb.empty.title")}</div>
              <Button variant="secondary" size="sm" onClick={clearFilters} style={{ marginTop: 14 }}>{t("sb.empty.cta")}</Button>
            </div>
          ) : view === "grid" ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: density === "dense" ? "repeat(4, 1fr)" : density === "sparse" ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
              gap: density === "dense" ? 10 : 14,
            }}>
              {pagedProducts.map((p) => (
                <ProductCard key={p.id} p={p} onAdd={addToCart} lang={lang} dense={density === "dense"} onMarkBug={onMarkBug}/>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pagedProducts.map((p) => <ProductRow key={p.id} p={p} onAdd={addToCart} lang={lang}/>)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginTop: 24, padding: "20px 0" }}>
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={paginateBtn(page === 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} style={{
                  ...paginateBtn(false),
                  background: p === page ? "var(--ink)" : "transparent",
                  color: p === page ? "var(--bg)" : "var(--ink-2)",
                  fontWeight: p === page ? 700 : 500,
                }}>{p}</button>
              ))}
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={paginateBtn(page === totalPages)}>›</button>
            </div>
          )}

        </main>
      </div>

      {/* Drawers + dialogs */}
      {cartOpen && (
        <Drawer onClose={() => setCartOpen(false)} title={t("sb.cart")}>
          <CartContents t={t} cart={cart} onRemove={removeFromCart} onQty={updateQty} subtotal={subtotal} promo={promo} promoDiscount={promoDiscount} total={total} promoInput={promoInput} setPromoInput={setPromoInput} onApplyPromo={applyPromo} lang={lang}/>
        </Drawer>
      )}
      {chatOpen && <ContactChat t={t} onClose={() => setChatOpen(false)} onMarkBug={challenge ? onMarkBug : null}/>}
      {accountOpen && (
        <Drawer onClose={() => setAccountOpen(false)} title={t("sb.account")}>
          <AccountPanel t={t} user={user} onUser={setUser} onLogout={() => { setUser(null); /* BUG b08: cart not cleared */ if (challenge && cart.length > 0) onMarkBug?.("b08"); }} onMarkBug={challenge ? onMarkBug : null}/>
        </Drawer>
      )}
    </div>
  );
}

const paginateBtn = (disabled) => ({
  width: 32, height: 32,
  border: "1px solid var(--line)",
  background: "var(--bg-elev)",
  color: "var(--ink-2)",
  borderRadius: 6,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.4 : 1,
  fontSize: 13, fontFamily: "var(--font-mono)",
});

// ─── Drawer
function Drawer({ children, title, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 420, height: "100%", background: "var(--bg)",
        boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column",
        borderLeft: "1px solid var(--line)",
        animation: "slideIn .25s ease",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ width: 30, height: 30, background: "transparent", border: "none", cursor: "pointer", borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--ink-3)" }}><Icon name="x" size={16}/></button>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>{children}</div>
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(40px); opacity: 0;} to { transform: translateX(0); opacity: 1;} }`}</style>
    </div>
  );
}

// ─── Cart contents
function CartContents({ t, cart, onRemove, onQty, subtotal, promo, promoDiscount, total, promoInput, setPromoInput, onApplyPromo, lang }) {
  if (cart.length === 0) return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--ink-3)" }}>
      <Icon name="cart" size={36} stroke={1.4}/>
      <div style={{ fontSize: 14, marginTop: 14 }}>{t("sb.cart.empty")}</div>
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {cart.map((x) => (
        <div key={x.id} style={{ display: "flex", gap: 12, padding: 12, border: "1px solid var(--line)", borderRadius: 10, background: "var(--bg-elev)" }}>
          <ProductImage p={x} size={48}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{x.name[lang] || x.name.en}</div>
            <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>${x.price} × {x.q}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
              <button onClick={() => onQty(x.id, -1)} style={qtyBtn}>−</button>
              <span className="mono" style={{ fontSize: 12, minWidth: 18, textAlign: "center" }}>{x.q}</span>
              <button onClick={() => onQty(x.id, 1)} style={qtyBtn}>+</button>
              <button onClick={() => onRemove(x.id)} style={{ ...qtyBtn, marginLeft: 8, color: "var(--err)", border: "1px solid var(--line)" }}><Icon name="x" size={11}/></button>
            </div>
          </div>
          <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>${(x.price * x.q).toFixed(0)}</span>
        </div>
      ))}

      {/* Promo */}
      <div style={{ marginTop: 12, padding: 12, background: "var(--bg-elev)", borderRadius: 10, border: "1px dashed var(--line)" }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}>PROMO</div>
        <div style={{ display: "flex", gap: 6 }}>
          <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="VIBES10" style={{
            flex: 1, height: 32, padding: "0 10px",
            border: "1px solid var(--line)", borderRadius: 6,
            background: "var(--bg-card)", color: "var(--ink)", fontSize: 12, outline: "none",
          }}/>
          <button onClick={onApplyPromo} style={{
            height: 32, padding: "0 12px",
            border: "none", borderRadius: 6, background: "var(--ink)", color: "var(--bg)",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>Apply</button>
        </div>
        {promo && <div className="mono" style={{ fontSize: 11, color: "var(--ok)", marginTop: 6 }}>{promo.code} · −{promo.percent}% applied{promo.applied > 1 ? ` (×${promo.applied}!)` : ""}</div>}
      </div>

      {/* Totals */}
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
        <Row label={t("sb.cart.subtotal")} value={`$${subtotal.toFixed(2)}`}/>
        {promo && <Row label="Promo" value={`−$${promoDiscount.toFixed(2)}`}/>}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 8, marginTop: 4 }}>
          <Row label="Total" value={`$${total.toFixed(2)}`} bold/>
        </div>
      </div>
      <Button variant="primary" size="lg" full iconRight="arrow-right" style={{ marginTop: 16 }}>{t("sb.cart.checkout")}</Button>
    </div>
  );
}
function Row({ label, value, bold }) { return <div style={{ display: "flex", justifyContent: "space-between", fontWeight: bold ? 700 : 400, fontSize: bold ? 16 : 13 }}><span>{label}</span><span className="mono">{value}</span></div>; }
const qtyBtn = { width: 22, height: 22, border: "1px solid var(--line)", background: "var(--bg-card)", color: "var(--ink-2)", borderRadius: 5, cursor: "pointer", fontSize: 12, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)" };

// ─── Account panel
function AccountPanel({ t, user, onUser, onLogout, onMarkBug }) {
  const [mode, setMode] = useS("login");
  const [email, setEmail] = useS("");
  const [pass, setPass] = useS("");

  if (user) {
    return (
      <div>
        <div style={{ padding: 16, background: "var(--bg-elev)", border: "1px solid var(--line)", borderRadius: 10 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>logged in as</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{user.email}</div>
          <Chip sm accent style={{ marginTop: 6 }}>{user.role}</Chip>
        </div>
        <Button variant="secondary" size="md" full style={{ marginTop: 12 }} onClick={onLogout}>{t("sb.logout")}</Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 4, padding: 3, background: "var(--bg-sunken)", borderRadius: 7, marginBottom: 16 }}>
        {["login", "register"].map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{
            flex: 1, height: 30, border: "none", borderRadius: 5,
            background: mode === m ? "var(--bg-card)" : "transparent",
            color: mode === m ? "var(--ink)" : "var(--ink-3)",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            boxShadow: mode === m ? "var(--shadow-sm)" : "none",
          }}>{m === "login" ? t("sb.login") : t("sb.register")}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" style={inputStyle}/>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="password" style={inputStyle}/>
      </div>
      <Button variant="primary" full size="md" style={{ marginTop: 14 }} onClick={() => {
        // BUG b09: register accepts email without @
        if (mode === "register" && !email.includes("@") && onMarkBug) onMarkBug("b09");
        onUser({ email: email || "guest@vibe.dev", role: "customer" });
      }}>{mode === "login" ? t("sb.login") : t("sb.register")}</Button>
    </div>
  );
}
const inputStyle = { height: 36, padding: "0 12px", border: "1px solid var(--line)", borderRadius: 7, background: "var(--bg-elev)", color: "var(--ink)", fontSize: 13, outline: "none" };

// ─── Contact chat
function ContactChat({ t, onClose, onMarkBug }) {
  const [msgs, setMsgs] = useS([{ from: "bot", text: t("sb.contact.greet") }]);
  const [input, setInput] = useS("");
  const scrollRef = useR(null);
  function send() {
    if (!input.trim()) return;
    setMsgs((m) => [...m, { from: "user", text: input }]);
    setInput("");
    // BUG b10: jumpy scroll on send
    if (onMarkBug) onMarkBug("b10");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: ["Got it — flagged to QA.", "Hmm interesting.", "Try clearing your cache 😉", "Have you tried turning it off and on again?"][Math.floor(Math.random()*4)] }]);
    }, 800);
  }
  useE(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight + 200; // intentional 'jump'
  }, [msgs]);
  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, width: 340, height: 440, background: "var(--bg)", borderRadius: 14, boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)", zIndex: 60, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-elev)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="pulse-dot"/>
          <strong style={{ fontSize: 13 }}>{t("sb.contact.title")}</strong>
        </div>
        <button onClick={onClose} style={{ width: 26, height: 26, border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-3)" }}><Icon name="x" size={14}/></button>
      </div>
      <div ref={scrollRef} style={{ flex: 1, padding: 14, overflow: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.from === "user" ? "flex-end" : "flex-start",
            background: m.from === "user" ? "var(--ink)" : "var(--bg-elev)",
            color: m.from === "user" ? "var(--bg)" : "var(--ink)",
            padding: "8px 11px", borderRadius: 10,
            border: m.from === "user" ? "none" : "1px solid var(--line)",
            fontSize: 13, lineHeight: 1.4, maxWidth: "78%",
          }}>{m.text}</div>
        ))}
      </div>
      <div style={{ padding: 12, borderTop: "1px solid var(--line)", display: "flex", gap: 6 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" style={{
          flex: 1, height: 32, padding: "0 12px", border: "1px solid var(--line)", borderRadius: 7,
          background: "var(--bg-elev)", color: "var(--ink)", fontSize: 12.5, outline: "none",
        }}/>
        <button onClick={send} style={{ height: 32, padding: "0 12px", border: "none", borderRadius: 7, background: "var(--accent)", color: "var(--accent-ink)", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{t("sb.contact.send")}</button>
      </div>
    </div>
  );
}

// ─── Challenge top bar
function ChallengeBar({ t, timeLeft, foundCount, totalBugs, onFinish }) {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const lowTime = timeLeft < 60;
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 30,
      background: lowTime ? "var(--err)" : "var(--ink)",
      color: lowTime ? "#fff" : "var(--bg)",
      transition: "background .3s",
    }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600 }}>
          <Icon name="bug" size={14} stroke={2.4}/>
          {t("ch.modeBadge")}
        </div>
        <div className="mono" style={{ fontSize: 12, opacity: .8 }}>·</div>
        <div className="mono" style={{ fontSize: 12 }}>
          {t("ch.found")}: <span style={{ fontWeight: 700 }}>{foundCount} / {totalBugs}</span>
        </div>
        <div style={{ flex: 1 }}/>
        <div className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
          <Icon name="clock" size={13}/>
          {t("ch.timer")}: {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </div>
        <button onClick={onFinish} style={{
          height: 28, padding: "0 12px",
          background: "rgba(255,255,255,.15)", color: "inherit",
          border: "1px solid rgba(255,255,255,.3)", borderRadius: 6, cursor: "pointer",
          fontSize: 11.5, fontWeight: 600, fontFamily: "var(--font-mono)",
          display: "inline-flex", alignItems: "center", gap: 5,
        }}><Icon name="flag" size={11}/> {t("ch.finish")}</button>
      </div>
    </div>
  );
}

// ─── Bug checklist (during challenge)
function BugChecklistPanel({ t, foundBugIds, onMark, lang }) {
  const found = new Set(foundBugIds);
  const sevOrder = { blocker: 0, major: 1, minor: 2 };
  const sortedBugs = [...window.SB_BUGS].sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);
  return (
    <div style={{ marginTop: 14, padding: 14, background: "var(--bg-elev)", border: "1px solid var(--accent-line)", borderRadius: 12 }}>
      <div className="mono" style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="bug" size={11}/> Bug log · {found.size}/{window.SB_BUGS.length}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 320, overflow: "auto" }}>
        {sortedBugs.map((b) => {
          const isFound = found.has(b.id);
          return (
            <button key={b.id} onClick={() => onMark(b.id)} style={{
              padding: "8px 10px", border: "1px solid var(--line)",
              background: isFound ? "var(--accent-soft)" : "var(--bg-card)",
              borderColor: isFound ? "var(--accent-line)" : "var(--line)",
              borderRadius: 7, cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "flex-start", gap: 8,
              transition: "background .15s",
            }}>
              <span style={{
                marginTop: 2, width: 14, height: 14, borderRadius: 4,
                border: "1.5px solid " + (isFound ? "var(--accent)" : "var(--line-strong)"),
                background: isFound ? "var(--accent)" : "transparent",
                display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {isFound && <Icon name="check" size={9} stroke={3} style={{ color: "var(--accent-ink)" }}/>}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, fontWeight: isFound ? 600 : 500, color: isFound ? "var(--ink)" : "var(--ink-2)", lineHeight: 1.35 }}>
                  {b.title[lang] || b.title.en}
                </div>
                <div className="mono" style={{ fontSize: 9.5, color: "var(--ink-3)", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.4 }}>
                  {b.area} · <span style={{ color: b.severity === "blocker" ? "var(--err)" : b.severity === "major" ? "var(--warn)" : "var(--ink-3)" }}>{b.severity}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 8, lineHeight: 1.4 }}>
        Tap a row to mark as found. Be honest.
      </div>
    </div>
  );
}

// ─── Challenge start modal
function ChallengeStartModal({ t, onStart, onCancel }) {
  return (
    <ModalShell onClose={onCancel}>
      <div style={{ padding: 28, maxWidth: 480 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon name="bug" size={12}/> QA challenge
        </div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.15 }}>{t("ch.modal.title")}</h2>
        <p style={{ marginTop: 12, fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.55 }}>{t("ch.modal.lede")}</p>
        <ul style={{ margin: "20px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {t("ch.modal.rules").map((r, i) => (
            <li key={i} style={{ fontSize: 13, color: "var(--ink-2)", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span className="mono" style={{ color: "var(--accent)", fontWeight: 700, marginTop: 1 }}>0{i+1}</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: 8, marginTop: 28 }}>
          <Button variant="ghost" onClick={onCancel}>{t("ch.modal.cancel")}</Button>
          <div style={{ flex: 1 }}/>
          <Button variant="accent" iconRight="arrow-right" onClick={onStart} size="md">{t("ch.modal.go")}</Button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Confirm finish
function ChallengeFinishConfirm({ t, onCancel, onConfirm }) {
  return (
    <ModalShell onClose={onCancel}>
      <div style={{ padding: 24, maxWidth: 400 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{t("ch.confirm.title")}</h3>
        <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--ink-3)", lineHeight: 1.5 }}>{t("ch.confirm.body")}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <Button variant="ghost" onClick={onCancel}>{t("ch.confirm.cancel")}</Button>
          <div style={{ flex: 1 }}/>
          <Button variant="primary" onClick={onConfirm}>{t("ch.confirm.go")}</Button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Results modal
function ChallengeResults({ t, foundCount, totalBugs, timeLeft, onRunAuto, onSkip, lang, finishedEarly }) {
  const pct = Math.round((foundCount / totalBugs) * 100);
  let band = "res.bandD";
  if (pct >= 90) band = "res.bandA";
  else if (pct >= 60) band = "res.bandB";
  else if (pct >= 30) band = "res.bandC";
  const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
  const used = 300 - timeLeft;
  const um = Math.floor(used / 60), us = used % 60;

  return (
    <ModalShell>
      <div style={{ padding: 32, maxWidth: 560 }}>
        <div className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8 }}>
          // run complete
        </div>
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.15 }}>
          {finishedEarly ? t("res.title.early") : t("res.title")}
        </h2>
        <p style={{ marginTop: 10, fontSize: 14.5, color: "var(--ink-2)" }}>{t(band)}</p>

        {/* stats */}
        <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 0, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "var(--bg-elev)" }}>
          <div style={{ padding: "16px 18px", borderRight: "1px solid var(--line)" }}>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t("res.found")}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 700, fontFamily: "var(--font-display)", letterSpacing: -1, color: "var(--accent)" }}>{foundCount}</span>
              <span style={{ fontSize: 16, color: "var(--ink-3)" }}>{t("res.of")} {totalBugs} {t("res.bugs")}</span>
            </div>
            <div style={{ marginTop: 10, height: 4, background: "var(--bg-sunken)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: pct + "%", height: "100%", background: "var(--accent)", borderRadius: 4, transition: "width .8s" }}/>
            </div>
          </div>
          <div style={{ padding: "16px 18px", borderRight: "1px solid var(--line)" }}>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t("res.timeLeft")}</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
              {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
            </div>
          </div>
          <div style={{ padding: "16px 18px" }}>
            <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: 0.5 }}>{t("res.timeUsed")}</div>
            <div className="mono" style={{ fontSize: 22, fontWeight: 700, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>
              {String(um).padStart(2, "0")}:{String(us).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
          <Button variant="ghost" onClick={onSkip} icon="x">{t("res.skip")}</Button>
          <div style={{ flex: 1 }}/>
          <Button variant="accent" size="lg" onClick={onRunAuto} iconRight="play-line">{t("res.runAuto")}</Button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Modal shell
function ModalShell({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, animation: "fadeIn .2s" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--bg)", borderRadius: 16, boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--line)", maxHeight: "90vh", overflow: "auto",
        animation: "popIn .25s cubic-bezier(.2,.7,.3,1.2)",
      }}>{children}</div>
      <style>{`@keyframes fadeIn { from { opacity: 0;} to { opacity: 1;} } @keyframes popIn { from { transform: scale(.92); opacity: 0;} to { transform: scale(1); opacity: 1;} }`}</style>
    </div>
  );
}

window.Sandbox = Sandbox;
window.ChallengeStartModal = ChallengeStartModal;
window.ChallengeFinishConfirm = ChallengeFinishConfirm;
window.ChallengeResults = ChallengeResults;
window.ModalShell = ModalShell;
