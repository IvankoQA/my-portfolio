export const VIBE_AUTO_TEST_RUN = {
  command: "pnpm run test:store:full",
  runLabel: "vibe-coder-supply / store full / ci #2847",
  runtime: {
    node: "v20.11",
    pnpm: "9.4",
    browser: "chromium 122.0",
    os: "macos 15.1",
  },
} as const
