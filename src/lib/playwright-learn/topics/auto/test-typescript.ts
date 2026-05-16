import type { PlaywrightTopic } from "../../types"

export const testTypescriptTopic: PlaywrightTopic = {
  slug: "test-typescript",
  groupId: "test-runner",
  order: 385,
  level: "advanced",
  trackOrder: 4,
  sourceDoc: "test-typescript-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-typescript",
  title: {
    en: "TypeScript",
    uk: "TypeScript",
  },
  summary: {
    en: "Playwright transpiles TypeScript automatically — no build step needed. The gotcha: it doesn't type-check. You can have type errors and Playwright will still run the tests. I always add a separate tsc --noEmit step in CI to catch this.",
    uk: "Playwright автоматично транспілює TypeScript — крок збірки не потрібен. Підводний камінь: він не перевіряє типи. Можна мати помилки типів і Playwright все одно запустить тести. Я завжди додаю окремий крок tsc --noEmit у CI щоб це ловити.",
  },
  sections: [
    {
      id: "zero-config",
      title: {
        en: "TypeScript works out of the box",
        uk: "TypeScript працює без додаткового налаштування",
      },
      paragraphs: [
        {
          en: "Write `.ts` files, Playwright handles the rest. No `ts-jest`, no Babel, no build step. Just name the file `orders.spec.ts` and run `npx playwright test`.",
          uk: "Пиши `.ts` файли, Playwright бере на себе все інше. Ніякого `ts-jest`, Babel, чи кроку збірки. Просто назви файл `orders.spec.ts` і запусти `npx playwright test`.",
        },
        {
          en: "The important caveat: Playwright transpiles but doesn't type-check. Type errors won't stop tests from running. On CI I run `tsc --noEmit` before the test step so type errors fail the build.",
          uk: "Важливий застереження: Playwright транспілює але не перевіряє типи. Помилки типів не зупинять виконання тестів. На CI я запускаю `tsc --noEmit` перед кроком тестів щоб помилки типів провалювали збірку.",
        },
      ],
      codeBlocks: [
        {
          id: "ci-typecheck",
          language: "yaml",
          code: `# GitHub Actions — перевірка типів перед тестами
steps:
  - name: Type check
    run: npx tsc -p tsconfig.json --noEmit
  - name: Run Playwright tests
    run: npx playwright test`,
        },
        {
          id: "local-watch",
          language: "bash",
          code: `# Локально — watch mode для типів поки пишеш тести
npx tsc -p tsconfig.json --noEmit -w`,
        },
      ],
    },
    {
      id: "tsconfig-for-tests",
      title: {
        en: "Separate tsconfig for tests",
        uk: "Окремий tsconfig для тестів",
      },
      paragraphs: [
        {
          en: "I keep a separate `tests/tsconfig.json` so test-specific settings (like allowing `any` in fixtures or enabling decorators) don't affect the main app config. Playwright picks it up automatically by looking for the nearest tsconfig up the directory tree.",
          uk: "Я тримаю окремий `tests/tsconfig.json` щоб тест-специфічні налаштування (наприклад дозвіл `any` у фікстурах або включення декораторів) не впливали на конфіг основного застосунку. Playwright знаходить його автоматично йдучи вгору по дереву каталогів.",
        },
        {
          en: "Note: Playwright only reads these options from tsconfig: `allowJs`, `baseUrl`, `paths`, `references`. Other options like `strict` or `target` are ignored for transpilation purposes.",
          uk: "Увага: Playwright читає з tsconfig тільки ці опції: `allowJs`, `baseUrl`, `paths`, `references`. Інші опції типу `strict` або `target` ігноруються для цілей транспіляції.",
        },
      ],
      codeBlocks: [
        {
          id: "project-structure",
          language: "text",
          code: `src/
  source.ts

tests/
  tsconfig.json     ← тест-специфічний конфіг
  orders.spec.ts
  fixtures.ts

tsconfig.json       ← загальний конфіг застосунку
playwright.config.ts`,
        },
      ],
    },
    {
      id: "path-mapping",
      title: {
        en: "Path aliases — import fixtures by @fixtures/...",
        uk: "Псевдоніми шляхів — імпортувати фікстури через @fixtures/...",
      },
      paragraphs: [
        {
          en: "Playwright supports tsconfig `paths` mapping. I use this to avoid `../../fixtures` relative imports — instead I write `@fixtures/auth` regardless of where the test file is. Add the mapping in the tests tsconfig and Playwright resolves it automatically.",
          uk: "Playwright підтримує маппінг `paths` з tsconfig. Я використовую це щоб уникнути відносних імпортів `../../fixtures` — замість цього пишу `@fixtures/auth` незалежно від того де знаходиться файл тесту. Додай маппінг у tsconfig для тестів і Playwright резолвить його автоматично.",
        },
      ],
      codeBlocks: [
        {
          id: "path-mapping",
          language: "json",
          code: `// tests/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@fixtures/*": ["./fixtures/*"],
      "@helpers/*": ["./helpers/*"]
    }
  }
}`,
        },
        {
          id: "path-usage",
          language: "ts",
          code: `// Замість: import { test } from '../../fixtures/auth'
import { test } from '@fixtures/auth'
import { createOrder } from '@helpers/orders'

test('create order', async ({ page, loggedInPage }) => {
  // loggedInPage приходить з auth фікстури
})`,
        },
      ],
    },
    {
      id: "explicit-tsconfig",
      title: {
        en: "Point to a specific tsconfig",
        uk: "Вказати конкретний tsconfig",
      },
      paragraphs: [
        {
          en: "If the auto-detection isn't picking up the right config, you can specify it explicitly in `playwright.config.ts` or via CLI flag.",
          uk: "Якщо авто-виявлення не підхоплює правильний конфіг — можна вказати його явно в `playwright.config.ts` або через прапорець CLI.",
        },
      ],
      codeBlocks: [
        {
          id: "explicit-tsconfig",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  tsconfig: './tests/tsconfig.json',
})`,
        },
        {
          id: "cli-tsconfig",
          language: "bash",
          code: `# Або через CLI
npx playwright test --tsconfig=tests/tsconfig.json`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You have a TypeScript error in your test file — a method call with the wrong argument type. You run 'npx playwright test' and the tests execute. What's happening?",
        uk: "У тебе є TypeScript-помилка у файлі тесту — виклик методу з неправильним типом аргументу. Ти запускаєш 'npx playwright test' і тести виконуються. Що відбувається?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Playwright fixed the type error automatically",
            uk: "Playwright автоматично виправив помилку типу",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright transpiles TypeScript but doesn't type-check — type errors are ignored at runtime",
            uk: "Playwright транспілює TypeScript але не перевіряє типи — помилки типів ігноруються під час виконання",
          },
        },
        {
          id: "c",
          label: {
            en: "TypeScript errors in tests don't matter because tests use dynamic typing",
            uk: "Помилки TypeScript у тестах не мають значення бо тести використовують динамічну типізацію",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright uses its own transpiler (esbuild-based) to convert TypeScript to JavaScript. It strips types but doesn't validate them. Type errors that would fail `tsc` compilation are silently ignored at runtime. This is why you need a separate `tsc --noEmit` step in CI — to catch these errors before they ship to production.",
        uk: "Playwright використовує власний транспілер (на основі esbuild) для конвертації TypeScript у JavaScript. Він видаляє типи але не валідує їх. Помилки типів які б провалили компіляцію `tsc` — мовчазно ігноруються під час виконання. Саме тому потрібен окремий крок `tsc --noEmit` у CI — щоб ловити ці помилки до того як вони потраплять у продакшн.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Where should you add a separate `tsconfig.json` for tests so that test-specific TypeScript settings don't affect the main app?",
        uk: "Де слід додати окремий `tsconfig.json` для тестів щоб тест-специфічні налаштування TypeScript не впливали на основний застосунок?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Inside the `node_modules/playwright` directory",
            uk: "Всередині директорії `node_modules/playwright`",
          },
        },
        {
          id: "b",
          label: {
            en: "In the tests directory (e.g. `tests/tsconfig.json`) — Playwright picks it up by searching upward from the test files",
            uk: "У директорії тестів (наприклад `tests/tsconfig.json`) — Playwright знаходить його йдучи вгору від файлів тестів",
          },
        },
        {
          id: "c",
          label: {
            en: "In the project root alongside the main `tsconfig.json`, named `tsconfig.test.json`",
            uk: "У кореневій директорії проекту поруч з основним `tsconfig.json`, з назвою `tsconfig.test.json`",
          },
        },
        {
          id: "d",
          label: {
            en: "Inside `playwright.config.ts` as an inline object",
            uk: "Всередині `playwright.config.ts` як вбудований об'єкт",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright searches for the nearest `tsconfig.json` by walking up the directory tree from the test file. Placing `tests/tsconfig.json` next to your spec files means Playwright automatically uses it for all tests in that directory, without affecting `tsconfig.json` at the project root used by the main app. You can also explicitly point to a config using `tsconfig: './tests/tsconfig.json'` in `playwright.config.ts`.",
        uk: "Playwright шукає найближчий `tsconfig.json` йдучи вгору по дереву директорій від файлу тесту. Розміщення `tests/tsconfig.json` поруч з файлами spec означає що Playwright автоматично використовує його для всіх тестів у тій директорії без впливу на `tsconfig.json` в корені проекту що використовується основним застосунком. Також можна явно вказати конфіг через `tsconfig: './tests/tsconfig.json'` у `playwright.config.ts`.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Which tsconfig options does Playwright actually read when transpiling test files?",
        uk: "Які опції tsconfig Playwright фактично читає при транспіляції файлів тестів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "All options including `strict`, `target`, and `lib`",
            uk: "Всі опції включно з `strict`, `target` і `lib`",
          },
        },
        {
          id: "b",
          label: {
            en: "Only `allowJs`, `baseUrl`, `paths`, and `references`",
            uk: "Тільки `allowJs`, `baseUrl`, `paths` і `references`",
          },
        },
        {
          id: "c",
          label: {
            en: "Only `strict` and `target`",
            uk: "Тільки `strict` і `target`",
          },
        },
        {
          id: "d",
          label: {
            en: "Playwright reads every option but only applies a subset at runtime",
            uk: "Playwright читає всі опції але застосовує лише підмножину під час виконання",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's transpiler only honours `allowJs`, `baseUrl`, `paths`, and `references` from tsconfig. Options like `strict`, `target`, `lib`, or `decorators` are ignored for transpilation. This means enabling strict mode in your tests tsconfig does not cause Playwright to enforce strict type checking at runtime — you still need `tsc --noEmit` for that.",
        uk: "Транспілер Playwright враховує лише `allowJs`, `baseUrl`, `paths` і `references` з tsconfig. Опції типу `strict`, `target`, `lib` або `decorators` ігноруються для транспіляції. Це означає що включення strict mode у tsconfig тестів не змушує Playwright застосовувати суворе перевірення типів під час виконання — для цього все одно потрібен `tsc --noEmit`.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You want to import test fixtures using `@fixtures/auth` instead of `../../fixtures/auth`. What do you need to configure?",
        uk: "Ти хочеш імпортувати тестові фікстури через `@fixtures/auth` замість `../../fixtures/auth`. Що потрібно налаштувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Install a Babel plugin to resolve path aliases at build time",
            uk: "Встановити Babel-плагін для розрішення псевдонімів шляхів під час збірки",
          },
        },
        {
          id: "b",
          label: {
            en: "Add `baseUrl` and `paths` mapping in `tests/tsconfig.json` — Playwright resolves aliases automatically",
            uk: "Додати маппінг `baseUrl` і `paths` у `tests/tsconfig.json` — Playwright розрішує псевдоніми автоматично",
          },
        },
        {
          id: "c",
          label: {
            en: "Configure webpack aliases in `playwright.config.ts`",
            uk: "Налаштувати webpack-аліаси у `playwright.config.ts`",
          },
        },
        {
          id: "d",
          label: {
            en: "Path aliases are not supported in Playwright test files",
            uk: "Псевдоніми шляхів не підтримуються у файлах тестів Playwright",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright honours the `baseUrl` and `paths` settings from tsconfig when resolving module imports. Adding `\"@fixtures/*\": [\"./fixtures/*\"]` under `compilerOptions.paths` in `tests/tsconfig.json` allows any test file to import `@fixtures/auth` and Playwright automatically resolves it to the correct physical file — no Babel, no webpack needed.",
        uk: "Playwright враховує налаштування `baseUrl` і `paths` з tsconfig при розрішенні імпортів модулів. Додавання `\"@fixtures/*\": [\"./fixtures/*\"]` під `compilerOptions.paths` у `tests/tsconfig.json` дозволяє будь-якому файлу тесту імпортувати `@fixtures/auth` і Playwright автоматично розрішить його до правильного фізичного файлу — Babel чи webpack не потрібні.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What is the correct CLI command to run type-checking on test files without executing them?",
        uk: "Яка правильна CLI-команда для перевірки типів у файлах тестів без їх виконання?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright test --typecheck",
            uk: "npx playwright test --typecheck",
          },
        },
        {
          id: "b",
          label: {
            en: "npx tsc -p tsconfig.json --noEmit",
            uk: "npx tsc -p tsconfig.json --noEmit",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright lint",
            uk: "npx playwright lint",
          },
        },
        {
          id: "d",
          label: {
            en: "npx ts-node --dry-run tests/",
            uk: "npx ts-node --dry-run tests/",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`tsc --noEmit` runs the TypeScript compiler in check-only mode: it performs full type checking and reports all errors but outputs no JavaScript files. Using `-p tsconfig.json` (or `-p tests/tsconfig.json` for a test-specific config) scopes the check to the right config. This is the standard CI step to catch type errors that Playwright's own transpiler would silently ignore.",
        uk: "`tsc --noEmit` запускає компілятор TypeScript у режимі лише перевірки: виконує повну перевірку типів і повідомляє про всі помилки але не виводить JavaScript-файли. Використання `-p tsconfig.json` (або `-p tests/tsconfig.json` для тест-специфічного конфігу) обмежує перевірку правильним конфігом. Це стандартний крок CI для ловіння помилок типів які власний транспілер Playwright мовчазно ігнорував би.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How does Playwright handle TypeScript without requiring a separate compilation step before running tests?",
        uk: "Як Playwright обробляє TypeScript без окремого кроку компіляції перед запуском тестів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It calls the official TypeScript compiler (tsc) internally before loading each file",
            uk: "Він викликає офіційний компілятор TypeScript (tsc) внутрішньо перед завантаженням кожного файлу",
          },
        },
        {
          id: "b",
          label: {
            en: "It uses its own esbuild-based transpiler that strips types on the fly, skipping type checking entirely",
            uk: "Він використовує власний транспілер на основі esbuild що видаляє типи на льоту, повністю пропускаючи перевірку типів",
          },
        },
        {
          id: "c",
          label: {
            en: "It converts TypeScript to JavaScript using Babel with the TypeScript preset",
            uk: "Він конвертує TypeScript у JavaScript використовуючи Babel з пресетом TypeScript",
          },
        },
        {
          id: "d",
          label: {
            en: "TypeScript support in Playwright requires ts-jest to be installed",
            uk: "Підтримка TypeScript у Playwright вимагає встановлення ts-jest",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright bundles an esbuild-based transpiler that strips TypeScript type annotations on the fly as it loads test files. This is extremely fast because esbuild only does syntax transformation — it never runs the type checker. The tradeoff is that type errors are invisible to Playwright. You get zero-config TypeScript support but need a separate `tsc --noEmit` step for type safety.",
        uk: "Playwright включає транспілер на основі esbuild що видаляє анотації TypeScript на льоту при завантаженні файлів тестів. Це надзвичайно швидко бо esbuild лише виконує синтаксичну трансформацію — він ніколи не запускає перевірку типів. Компроміс: помилки типів невидимі для Playwright. Отримуєш підтримку TypeScript без налаштування але потрібен окремий крок `tsc --noEmit` для безпеки типів.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you explicitly point Playwright to a specific tsconfig file instead of relying on auto-detection?",
        uk: "Як явно вказати Playwright конкретний файл tsconfig замість покладання на авто-виявлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set the `TS_CONFIG` environment variable before running tests",
            uk: "Встановити змінну середовища `TS_CONFIG` перед запуском тестів",
          },
        },
        {
          id: "b",
          label: {
            en: "Add `tsconfig: './tests/tsconfig.json'` in `playwright.config.ts`, or pass `--tsconfig=tests/tsconfig.json` via CLI",
            uk: "Додати `tsconfig: './tests/tsconfig.json'` у `playwright.config.ts`, або передати `--tsconfig=tests/tsconfig.json` через CLI",
          },
        },
        {
          id: "c",
          label: {
            en: "Rename the file to `playwright.tsconfig.json` so Playwright finds it automatically",
            uk: "Перейменувати файл на `playwright.tsconfig.json` щоб Playwright знаходив його автоматично",
          },
        },
        {
          id: "d",
          label: {
            en: "Import it at the top of every test file using `/// <reference path='...' />`",
            uk: "Імпортувати його на початку кожного файлу тесту через `/// <reference path='...' />`",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright supports two ways to specify an explicit tsconfig: the `tsconfig` property in `playwright.config.ts` (e.g. `tsconfig: './tests/tsconfig.json'`) and the `--tsconfig` CLI flag. Both override the automatic directory-traversal search. This is useful when your project structure has the test config in a non-standard location or when auto-detection picks up the wrong config.",
        uk: "Playwright підтримує два способи вказати явний tsconfig: властивість `tsconfig` у `playwright.config.ts` (наприклад `tsconfig: './tests/tsconfig.json'`) і прапорець CLI `--tsconfig`. Обидва перевизначають автоматичний пошук по директоріям. Це корисно коли структура проекту має конфіг тестів у нестандартному місці або коли авто-виявлення підхоплює неправильний конфіг.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You are adding a custom fixture that extends the base `test`. How does TypeScript know the type of the new fixture property (e.g. `loggedInPage`) when used inside tests?",
        uk: "Ти додаєш кастомну фікстуру що розширює базовий `test`. Як TypeScript знає тип нової властивості фікстури (наприклад `loggedInPage`) при використанні в тестах?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "You must use `any` for custom fixture types — generics are not supported",
            uk: "Потрібно використовувати `any` для типів кастомних фікстур — дженерики не підтримуються",
          },
        },
        {
          id: "b",
          label: {
            en: "The type is inferred from the generic type argument passed to `test.extend<{ loggedInPage: Page }>()` — TypeScript propagates it to the test callback automatically",
            uk: "Тип виводиться з дженерик-аргументу переданого до `test.extend<{ loggedInPage: Page }>()` — TypeScript автоматично передає його до callback тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright auto-generates TypeScript types for fixtures into a `.d.ts` file after the first test run",
            uk: "Playwright автоматично генерує TypeScript-типи для фікстур у `.d.ts` файл після першого тестового запуску",
          },
        },
        {
          id: "d",
          label: {
            en: "You need to manually declare a global augmentation for the `PlaywrightTestArgs` interface",
            uk: "Потрібно вручну оголосити глобальне розширення для інтерфейсу `PlaywrightTestArgs`",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`test.extend<T>()` is generic — the type parameter `T` declares the shape of your custom fixtures. TypeScript infers that any test function receiving the extended `test` fixture object will have the properties declared in `T` fully typed. So `async ({ page, loggedInPage }) => {}` knows `loggedInPage` is a `Page` without any extra annotation, because `test.extend<{ loggedInPage: Page }>()` established that constraint.",
        uk: "`test.extend<T>()` — дженерик: параметр типу `T` оголошує форму кастомних фікстур. TypeScript виводить що будь-яка тестова функція що отримує розширений об'єкт фікстури `test` матиме властивості оголошені в `T` з повними типами. Тому `async ({ page, loggedInPage }) => {}` знає що `loggedInPage` є `Page` без жодної додаткової анотації, бо `test.extend<{ loggedInPage: Page }>()` встановив це обмеження.",
      },
    },
  ],
}
