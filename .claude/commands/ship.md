---
description: Lint, build, and prepare for deploy
---

Run the release safety pipeline for this repository:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Summarize any failures with the first actionable fix.
4. If both commands pass, report that the branch is ready for deployment.

Do not commit or push unless explicitly requested.
