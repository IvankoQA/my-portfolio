// ui.jsx — small shared bits: Icon, Chip, Button, MarchingDots
// Plus reusable layout helpers.

const Icon = ({ name, size = 16, stroke = 1.7, ...rest }) => {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round", strokeLinejoin: "round",
    ...rest,
  };
  switch (name) {
    case "arrow-right": return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-up-right": return <svg {...common}><path d="M7 17L17 7M8 7h9v9"/></svg>;
    case "external": return <svg {...common}><path d="M14 4h6v6M10 14L20 4M19 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6"/></svg>;
    case "copy": return <svg {...common}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>;
    case "check": return <svg {...common}><path d="M5 13l4 4L19 7"/></svg>;
    case "x": return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>;
    case "filter": return <svg {...common}><path d="M3 5h18M7 12h10M10 19h4"/></svg>;
    case "grid": return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "list": return <svg {...common}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
    case "cart": return <svg {...common}><path d="M3 4h2l2.5 12.5A2 2 0 0 0 9.5 18H19"/><circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/><path d="M6 8h16l-2 8"/></svg>;
    case "user": return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    case "chat": return <svg {...common}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case "play": return <svg {...common}><path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none"/></svg>;
    case "play-line": return <svg {...common}><path d="M6 4l14 8-14 8z"/></svg>;
    case "linkedin": return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 17v-7"/></svg>;
    case "github": return <svg {...common}><path d="M9 19c-4 1.5-4-2-6-2.5M15 22v-3.87a3.4 3.4 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7a5.44 5.44 0 0 0-1.5-3.75 5 5 0 0 0-.09-3.77S17.5 3 15 4.77a13 13 0 0 0-7 0C5.5 3 4.09 3.5 4.09 3.5a5 5 0 0 0-.09 3.77 5.44 5.44 0 0 0-1.5 3.75c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 21.13V22"/></svg>;
    case "telegram": return <svg {...common}><path d="M21 4L2 11l5 2 9-7-7 9 8 6z"/></svg>;
    case "youtube": return <svg {...common}><rect x="2" y="6" width="20" height="12" rx="3"/><path d="M10 9v6l5-3z" fill="currentColor" stroke="none"/></svg>;
    case "mail": return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case "phone": return <svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
    case "sun": return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case "moon": return <svg {...common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    case "globe": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>;
    case "code": return <svg {...common}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>;
    case "terminal": return <svg {...common}><path d="M4 17l6-6-6-6M12 19h8"/></svg>;
    case "spark": return <svg {...common}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/></svg>;
    case "target": return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>;
    case "bug": return <svg {...common}><path d="M9 9V6a3 3 0 0 1 6 0v3"/><rect x="6" y="9" width="12" height="11" rx="6"/><path d="M6 13H3M21 13h-3M6 18l-3 2M21 20l-3-2M6 9L4 7M20 7l-2 2"/></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "flag": return <svg {...common}><path d="M4 21V4M4 4h13l-2 4 2 4H4"/></svg>;
    case "upload": return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
    case "download": return <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
    case "menu": return <svg {...common}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case "plus": return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus": return <svg {...common}><path d="M5 12h14"/></svg>;
    case "duck": return <svg {...common}><path d="M14 5a3 3 0 0 1 3 3v1l3 1-2 2 1 5h-3a8 8 0 0 1-8 0H5l-1-5a4 4 0 0 1 4-5h3a3 3 0 0 1 3-2z"/><circle cx="15.5" cy="7.5" r=".4" fill="currentColor"/></svg>;
    case "tag": return <svg {...common}><path d="M20 12L12 20l-9-9V3h8z"/><circle cx="7" cy="7" r="1.4"/></svg>;
    case "star": return <svg {...common}><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>;
    case "package": return <svg {...common}><path d="M21 16V8l-9-5-9 5v8l9 5zM3.3 7l8.7 5 8.7-5M12 22V12"/></svg>;
    case "logo": return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <path d="M8 10l3 3-3 3M13 16h4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    default: return <svg {...common}><circle cx="12" cy="12" r="3"/></svg>;
  }
};

const Chip = ({ children, accent = false, mono = true, sm = false, onClick, title }) => (
  <span
    onClick={onClick}
    title={title}
    style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: sm ? "3px 8px" : "5px 10px",
      fontSize: sm ? 11 : 12,
      lineHeight: 1,
      fontFamily: mono ? "var(--font-mono)" : "inherit",
      borderRadius: 999,
      background: accent ? "var(--accent-soft)" : "var(--chip-bg)",
      color: accent ? "var(--accent)" : "var(--ink-2)",
      border: accent ? "1px solid var(--accent-line)" : "1px solid var(--line)",
      whiteSpace: "nowrap",
      cursor: onClick ? "pointer" : "default",
      letterSpacing: mono ? 0 : -0.1,
    }}
  >{children}</span>
);

const Button = ({ children, variant = "primary", size = "md", icon, iconRight, onClick, type = "button", disabled, full, title, style: extra = {} }) => {
  const sizes = {
    sm: { h: 30, px: 12, fs: 12, gap: 6 },
    md: { h: 38, px: 16, fs: 13, gap: 8 },
    lg: { h: 48, px: 22, fs: 15, gap: 10 },
  }[size];

  const styles = {
    primary: { bg: "var(--ink)", fg: "var(--bg)", border: "var(--ink)" },
    accent: { bg: "var(--accent)", fg: "var(--accent-ink)", border: "var(--accent)" },
    secondary: { bg: "transparent", fg: "var(--ink)", border: "var(--line-strong)" },
    ghost: { bg: "transparent", fg: "var(--ink-2)", border: "transparent" },
    danger: { bg: "var(--err)", fg: "#fff", border: "var(--err)" },
  }[variant];

  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title}
      style={{
        height: sizes.h, padding: `0 ${sizes.px}px`, gap: sizes.gap,
        fontSize: sizes.fs, fontWeight: 500, fontFamily: "var(--font-sans)",
        letterSpacing: -0.1,
        background: styles.bg, color: styles.fg, border: `1px solid ${styles.border}`,
        borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: full ? "100%" : "auto",
        transition: "transform .08s, background .15s, border-color .15s",
        whiteSpace: "nowrap",
        ...extra,
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = ""; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 18 : size === "sm" ? 13 : 15} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 18 : size === "sm" ? 13 : 15} />}
    </button>
  );
};

// Section header with mono prefix (e.g. "// summary")
const SectionHeader = ({ id, eyebrow, title, sub, action }) => (
  <div id={id} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
    <div>
      {eyebrow && (
        <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", letterSpacing: 0.4, marginBottom: 8, textTransform: "lowercase" }}>{eyebrow}</div>
      )}
      <h2 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.1, color: "var(--ink)" }}>{title}</h2>
      {sub && <div style={{ marginTop: 6, color: "var(--ink-3)", fontSize: 14, maxWidth: 540 }}>{sub}</div>}
    </div>
    {action}
  </div>
);

// Animated dots while loading
const Dots = () => (
  <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
    {[0, 1, 2].map((i) => (
      <span key={i} style={{
        width: 5, height: 5, borderRadius: 5, background: "currentColor",
        animation: `dot 1.2s ease-in-out ${i * 0.16}s infinite`,
      }} />
    ))}
    <style>{`@keyframes dot { 0%,80%,100% { opacity: .25; transform: scale(.8);} 40% { opacity: 1; transform: scale(1);} }`}</style>
  </span>
);

Object.assign(window, { Icon, Chip, Button, SectionHeader, Dots });
