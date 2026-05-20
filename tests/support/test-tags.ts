export const TAG = {
  smoke: "@smoke",
  regression: "@regression",
  api: "@api",
  learn: "@learn",
  critical: "@critical",
  sandbox: "@sandbox",
  sandboxPlanted: "@sandbox-planted",
} as const

export type TestTag = (typeof TAG)[keyof typeof TAG]
