export type EnvConfig = {
  baseUrl: string
}

export const readEnv = (): EnvConfig => ({
  baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
})
