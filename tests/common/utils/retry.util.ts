export const withRetry = async <T>(
  action: () => Promise<T>,
  opts: { attempts?: number; delayMs?: number } = {},
): Promise<T> => {
  const attempts = opts.attempts ?? 3
  const delayMs = opts.delayMs ?? 500
  let lastError: unknown

  for (let i = 1; i <= attempts; i += 1) {
    try {
      return await action()
    } catch (error) {
      lastError = error
      if (i === attempts) break
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  throw lastError
}
