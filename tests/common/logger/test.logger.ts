export type LogLevel = "info" | "warn" | "error"

export const log = (
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
) => {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      level,
      message,
      context: context ?? {},
    }),
  )
}
