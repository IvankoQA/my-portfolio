"use client"

import type React from "react"
import type { SVGProps } from "react"

export type VibeIconName = string

function SvgWithTitle({
  accessibleName,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"svg"> & {
  accessibleName: string
  children: React.ReactNode
}) {
  return (
    <svg {...rest}>
      <title>{accessibleName}</title>
      {children}
    </svg>
  )
}

type IconProps = {
  name: VibeIconName
  size?: number
  stroke?: number
} & Omit<
  SVGProps<SVGSVGElement>,
  "name" | "width" | "height" | "stroke" | "strokeWidth" | "viewBox" | "fill"
>

export function VibeIcon({
  name,
  size = 16,
  stroke = 1.7,
  ...rest
}: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  }
  switch (name) {
    case "arrow-left":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </SvgWithTitle>
      )
    case "arrow-right":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </SvgWithTitle>
      )
    case "check":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M5 13l4 4L19 7" />
        </SvgWithTitle>
      )
    case "x":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M6 6l12 12M18 6L6 18" />
        </SvgWithTitle>
      )
    case "search":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </SvgWithTitle>
      )
    case "grid":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </SvgWithTitle>
      )
    case "list":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
        </SvgWithTitle>
      )
    case "filter":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M4 6h16M7 12h10M10 18h4" />
        </SvgWithTitle>
      )
    case "cart":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M3 4h2l2.5 12.5A2 2 0 0 0 9.5 18H19" />
          <circle cx="9" cy="21" r="1.4" />
          <circle cx="18" cy="21" r="1.4" />
          <path d="M6 8h16l-2 8" />
        </SvgWithTitle>
      )
    case "user":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </SvgWithTitle>
      )
    case "chat":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </SvgWithTitle>
      )
    case "play-line":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M6 4l14 8-14 8z" />
        </SvgWithTitle>
      )
    case "sun":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </SvgWithTitle>
      )
    case "moon":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </SvgWithTitle>
      )
    case "bug":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          <rect x="6" y="9" width="12" height="11" rx="6" />
          <path d="M6 13H3M21 13h-3M6 18l-3 2M21 20l-3-2M6 9L4 7M20 7l-2 2" />
        </SvgWithTitle>
      )
    case "clock":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </SvgWithTitle>
      )
    case "flag":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M4 21V4M4 4h13l-2 4 2 4H4" />
        </SvgWithTitle>
      )
    case "plus":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M12 5v14M5 12h14" />
        </SvgWithTitle>
      )
    case "duck":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M14 5a3 3 0 0 1 3 3v1l3 1-2 2 1 5h-3a8 8 0 0 1-8 0H5l-1-5a4 4 0 0 1 4-5h3a3 3 0 0 1 3-2z" />
          <circle cx="15.5" cy="7.5" r=".4" fill="currentColor" />
        </SvgWithTitle>
      )
    case "eye":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </SvgWithTitle>
      )
    case "eye-off":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
          <path d="M2 2l20 20" />
        </SvgWithTitle>
      )
    case "sparkles":
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
          <path d="M5 3v3M19 17v3M3 5h3M17 19h3" />
        </SvgWithTitle>
      )
    default:
      return (
        <SvgWithTitle {...common} accessibleName={String(name)}>
          <circle cx="12" cy="12" r="3" />
        </SvgWithTitle>
      )
  }
}

type ChipProps = {
  children: React.ReactNode
  accent?: boolean
  mono?: boolean
  sm?: boolean
  onClick?: () => void
  title?: string
  style?: React.CSSProperties
  /** Playwright / E2E hook */
  testId?: string
}

export function VibeChip({
  children,
  accent = false,
  mono = true,
  sm = false,
  onClick,
  title,
  style: extra = {},
  testId,
}: ChipProps) {
  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: sm ? "3px 8px" : "5px 10px",
    fontSize: sm ? 11 : 12,
    lineHeight: 1,
    fontFamily: mono ? "var(--font-mono)" : "inherit",
    borderRadius: 999,
    background: accent ? "var(--accent-soft)" : "var(--chip-bg)",
    color: accent ? "var(--accent-color)" : "var(--ink-2)",
    border: accent ? "1px solid var(--accent-line)" : "1px solid var(--line)",
    whiteSpace: "nowrap",
    cursor: onClick ? "pointer" : "default",
    letterSpacing: mono ? 0 : -0.1,
    ...extra,
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        data-testid={testId}
        style={{
          ...chipStyle,
          font: "inherit",
          margin: 0,
          textAlign: "inherit",
        }}
      >
        {children}
      </button>
    )
  }

  return (
    <span title={title} style={chipStyle} data-testid={testId}>
      {children}
    </span>
  )
}

type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

type VibeButtonProps = {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: VibeIconName
  iconRight?: VibeIconName
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
  full?: boolean
  title?: string
  style?: React.CSSProperties
  /** Playwright / E2E hook */
  testId?: string
}

export function VibeButton({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  onClick,
  type = "button",
  disabled,
  full,
  title,
  style: extra = {},
  testId,
}: VibeButtonProps) {
  const sizes =
    size === "sm"
      ? { h: 30, px: 12, fs: 12, gap: 6 }
      : size === "lg"
        ? { h: 48, px: 22, fs: 15, gap: 10 }
        : { h: 38, px: 16, fs: 13, gap: 8 }

  const styles: Record<
    ButtonVariant,
    { bg: string; fg: string; border: string }
  > = {
    primary: { bg: "var(--ink)", fg: "var(--bg)", border: "var(--ink)" },
    accent: {
      bg: "var(--accent-color)",
      fg: "var(--accent-ink)",
      border: "var(--accent-color)",
    },
    secondary: {
      bg: "transparent",
      fg: "var(--ink)",
      border: "var(--line-strong)",
    },
    ghost: { bg: "transparent", fg: "var(--ink-2)", border: "transparent" },
    danger: { bg: "var(--err)", fg: "#fff", border: "var(--err)" },
  }
  const st = styles[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      data-testid={testId}
      style={{
        height: sizes.h,
        padding: `0 ${sizes.px}px`,
        gap: sizes.gap,
        fontSize: sizes.fs,
        fontWeight: 500,
        fontFamily: "var(--font-sans)",
        letterSpacing: -0.1,
        background: st.bg,
        color: st.fg,
        border: `1px solid ${st.border}`,
        borderRadius: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: full ? "100%" : "auto",
        transition: "transform .08s, background .15s, border-color .15s",
        whiteSpace: "nowrap",
        ...extra,
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = "scale(0.98)"
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = ""
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ""
      }}
    >
      {icon && (
        <VibeIcon
          name={icon}
          size={size === "lg" ? 18 : size === "sm" ? 13 : 15}
        />
      )}
      {children}
      {iconRight && (
        <VibeIcon
          name={iconRight}
          size={size === "lg" ? 18 : size === "sm" ? 13 : 15}
        />
      )}
    </button>
  )
}
