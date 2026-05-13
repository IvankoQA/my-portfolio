import type { ReactNode, SVGProps } from "react"

type Props = SVGProps<SVGSVGElement> & { size?: number }

function svgBase({ size = 14, ...rest }: Props) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...rest,
  }
}

function DecorativeSvg({
  name,
  children,
  ...props
}: Props & { name: string; children: ReactNode }) {
  return (
    <svg {...svgBase(props)}>
      <title>{name}</title>
      {children}
    </svg>
  )
}

export function CheckIcon(p: Props) {
  return (
    <DecorativeSvg name="check" {...p}>
      <path d="M5 13l4 4L19 7" />
    </DecorativeSvg>
  )
}

export function XIcon(p: Props) {
  return (
    <DecorativeSvg name="cross" {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </DecorativeSvg>
  )
}

export function CopyIcon(p: Props) {
  return (
    <DecorativeSvg name="copy" {...p}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </DecorativeSvg>
  )
}

export function ArrowLeftIcon(p: Props) {
  return (
    <DecorativeSvg name="arrow-left" {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </DecorativeSvg>
  )
}

export function ArrowRightIcon(p: Props) {
  return (
    <DecorativeSvg name="arrow-right" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </DecorativeSvg>
  )
}

export function ExternalIcon(p: Props) {
  return (
    <DecorativeSvg name="external" {...p}>
      <path d="M14 4h6v6" />
      <path d="M20 4L10 14" />
      <path d="M20 14v6H4V4h6" />
    </DecorativeSvg>
  )
}

export function BookIcon(p: Props) {
  return (
    <DecorativeSvg name="book" {...p}>
      <path d="M4 4a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2 2V4z" />
      <path d="M19 2v18" />
    </DecorativeSvg>
  )
}
