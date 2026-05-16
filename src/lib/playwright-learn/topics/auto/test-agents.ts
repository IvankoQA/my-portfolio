import type { PlaywrightTopic } from "../../types"

export const testAgentsTopic: PlaywrightTopic = {
  slug: "test-agents",
  groupId: "test-runner",
  order: 305,
  level: "advanced",
  trackOrder: 13,
  sourceDoc: "test-agents-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-agents",
  title: {
    en: "Agents",
    uk: "Агенти",
  },
  summary: {
    en: "Playwright ships three AI agents — planner, generator, healer — that work together to build and maintain a test suite automatically. I run npx playwright init-agents --loop=claude to wire them up to my AI tool, point planner at the app, and it writes a Markdown plan, generator converts it to real Playwright tests, and healer fixes anything that fails.",
    uk: "Playwright постачає три AI-агенти — planner, generator, healer — які разом автоматично будують і підтримують тестовий набір. Запускаю npx playwright init-agents --loop=claude щоб підключити їх до мого AI-інструменту, вказую planner на застосунок — він пише Markdown-план, generator перетворює план на реальні Playwright-тести, healer виправляє все що падає.",
  },
  sections: [
    {
      id: "overview",
      title: {
        en: "Three agents, one pipeline",
        uk: "Три агенти, один пайплайн",
      },
      paragraphs: [
        {
          en: "This is a relatively new feature — AI agents that automate the test-writing workflow itself. Instead of I writing tests by hand, I describe what to test and the agents do the work. The three agents form a pipeline:",
          uk: "Це відносно нова фіча — AI-агенти які автоматизують сам процес написання тестів. Замість того щоб писати тести вручну — описую що тестувати і агенти роблять роботу. Три агенти утворюють пайплайн:",
        },
        {
          en: "- **planner** — explores the app and produces a Markdown test plan describing what scenarios to test and expected results\n- **generator** — reads the Markdown plan and writes actual Playwright test files, verifying locators and assertions live as it goes\n- **healer** — runs the test suite, finds what fails, and automatically patches the tests to make them pass",
          uk: "- **planner** — досліджує застосунок і складає Markdown-план із описом сценаріїв і очікуваних результатів\n- **generator** — читає Markdown-план і пише реальні Playwright-тест-файли, перевіряючи локатори і assertions по ходу\n- **healer** — запускає набір тестів, знаходить що падає і автоматично виправляє тести щоб вони проходили",
        },
        {
          en: "Each agent can be run independently too — I don't have to use all three together.",
          uk: "Кожен агент можна запускати і окремо — не обов'язково використовувати всі три разом.",
        },
      ],
    },
    {
      id: "setup",
      title: {
        en: "Setting up agents",
        uk: "Налаштування агентів",
      },
      paragraphs: [
        {
          en: "First, I generate the agent definition files — these are instructions and MCP tools that tell my AI coding tool how to run Playwright agents. I pick the AI tool I'm using:",
          uk: "Спочатку генерую файли визначень агентів — це інструкції та MCP-інструменти які говорять моєму AI-інструменту як запускати Playwright-агенти. Вибираю той AI-інструмент який використовую:",
        },
        {
          en: "After running this, the agent definitions appear in `.github/` (for Claude Code) or similar. I regenerate them whenever Playwright updates to pick up new instructions.",
          uk: "Після запуску файли визначень агентів з'являються в `.github/` (для Claude Code) або аналогічно. Регенерую їх після кожного оновлення Playwright щоб підхопити нові інструкції.",
        },
      ],
      codeBlocks: [
        {
          id: "init-agents",
          language: "bash",
          code: `# Для Claude Code
npx playwright init-agents --loop=claude

# Для VS Code Copilot
npx playwright init-agents --loop=vscode

# Для OpenCode
npx playwright init-agents --loop=opencode`,
        },
      ],
    },
    {
      id: "planner",
      title: {
        en: "Planner — exploring and planning",
        uk: "Planner — дослідження і планування",
      },
      paragraphs: [
        {
          en: "I give planner a description of what to test and a seed test that sets up the environment (authentication, fixtures). Planner navigates the app, explores the relevant flows, and produces a Markdown test plan with steps and expected outcomes.",
          uk: "Вказую planner опис що тестувати і seed-тест який налаштовує середовище (автентифікація, фікстури). Planner навігує застосунок, досліджує відповідні потоки і складає Markdown-план з кроками й очікуваними результатами.",
        },
        {
          en: "A typical prompt: 'Using seed.spec.ts, generate a test plan for the order creation flow on /orders/new'. The output is a file like `specs/order-creation.md` — human-readable, precise enough for generator to work from.",
          uk: "Типовий запит: 'Using seed.spec.ts, generate a test plan for the order creation flow on /orders/new'. Результат — файл типу `specs/order-creation.md`: зрозумілий людині і водночас достатньо точний для роботи generator.",
        },
      ],
      codeBlocks: [
        {
          id: "seed-test",
          language: "ts",
          code: `// tests/seed.spec.ts — мінімальний seed для planner
import { test } from '@playwright/test'

test('seed', async ({ page }) => {
  // Planner запустить цей тест щоб отримати готову сторінку
  await page.goto('/orders')
})`,
        },
        {
          id: "planner-output",
          language: "bash",
          code: `# Приклад структури Markdown-плану від planner
# specs/order-creation.md

## Test Scenarios

### 1. Create valid order
Steps:
1. Click "New order" button
2. Fill customer name field with "Acme Corp"
3. Fill amount with "5000"
4. Click Save

Expected Results:
- Success toast "Order created" is visible
- Order appears in the list with correct data`,
        },
      ],
    },
    {
      id: "generator",
      title: {
        en: "Generator — plan to code",
        uk: "Generator — план у код",
      },
      paragraphs: [
        {
          en: "Generator reads the Markdown plan and writes actual Playwright test files. It opens the app and verifies each locator and assertion live as it writes — so the generated tests are already verified against the real UI, not just guessed.",
          uk: "Generator читає Markdown-план і пише реальні Playwright-тест-файли. Він відкриває застосунок і перевіряє кожен локатор і assertion на льоту поки пише — тому згенеровані тести вже перевірені проти реального UI, а не просто вгадані.",
        },
        {
          en: "A typical prompt: 'Using specs/order-creation.md and seed.spec.ts, generate Playwright tests'. The output is a test file under `tests/` aligned with the spec.",
          uk: "Типовий запит: 'Using specs/order-creation.md and seed.spec.ts, generate Playwright tests'. Результат — файл тестів у `tests/` у відповідності зі спекою.",
        },
      ],
      codeBlocks: [
        {
          id: "generator-output",
          language: "ts",
          code: `// tests/order-creation.spec.ts — згенерований generator
import { test, expect } from '@playwright/test'

test.describe('Create valid order', () => {
  test('fills form and saves', async ({ page }) => {
    await page.goto('/orders')
    await page.getByRole('button', { name: 'New order' }).click()
    await page.getByLabel('Customer name').fill('Acme Corp')
    await page.getByLabel('Amount').fill('5000')
    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Order created')).toBeVisible()
  })
})`,
        },
      ],
    },
    {
      id: "healer",
      title: {
        en: "Healer — fixing what breaks",
        uk: "Healer — виправлення того що ламається",
      },
      paragraphs: [
        {
          en: "After the UI changes, tests that were passing start failing. Healer runs the failing test, replays the failing steps in the browser, inspects the current UI to find the equivalent elements or flows, and patches the test — updating locators, wait strategies, or test data.",
          uk: "Після змін у UI тести що раніше проходили починають падати. Healer запускає тест що впав, повторює кроки в браузері, інспектує поточний UI щоб знайти еквівалентні елементи або потоки і патчить тест — оновлює локатори, стратегії очікування або тестові дані.",
        },
        {
          en: "A typical prompt: 'Heal failing test tests/order-creation.spec.ts'. Healer loops — run, fail, patch, re-run — until the test passes or until it determines the functionality itself is broken (in which case it skips the test and reports the issue).",
          uk: "Типовий запит: 'Heal failing test tests/order-creation.spec.ts'. Healer повторює цикл — запуск, збій, патч, повторний запуск — доки тест не пройде або доки не визначить що сама функціональність зламана (тоді пропускає тест і повідомляє про проблему).",
        },
      ],
    },
    {
      id: "file-structure",
      title: {
        en: "File structure conventions",
        uk: "Угоди про структуру файлів",
      },
      paragraphs: [
        {
          en: "The three-agent workflow produces a clean, auditable structure:",
          uk: "Три-агентний workflow дає чисту структуру зручну для аудиту:",
        },
      ],
      codeBlocks: [
        {
          id: "structure",
          language: "bash",
          code: `repo/
  .github/                    # визначення агентів (для Claude Code)
  specs/                      # Markdown-плани від planner
    order-creation.md
    dashboard.md
  tests/                      # Playwright-тести від generator
    seed.spec.ts              # seed для planner і generator
    order-creation.spec.ts
    dashboard.spec.ts
  playwright.config.ts`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "After a UI redesign, 15 tests are failing because button labels and form field names changed. What's the most efficient way to fix this?",
        uk: "Після редизайну UI 15 тестів падають бо змінились написи кнопок і назви полів форм. Який найефективніший спосіб це виправити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Manually open each failing test, find the broken locator, update it by inspecting the new UI",
            uk: "Вручну відкрити кожен тест що впав, знайти зламаний локатор, оновити перевіривши новий UI",
          },
        },
        {
          id: "b",
          label: {
            en: "Use the healer agent — it replays each failing test in the browser, finds the equivalent elements in the new UI, and patches the locators automatically",
            uk: "Використати агент healer — він повторює кожен тест що впав у браузері, знаходить еквівалентні елементи в новому UI і автоматично патчить локатори",
          },
        },
        {
          id: "c",
          label: {
            en: "Delete all failing tests and regenerate from the Markdown plans",
            uk: "Видалити всі тести що впали і перегенерувати з Markdown-планів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Healer is built exactly for this scenario — UI changes that break locators. It runs the failing test, opens the browser, looks at the actual rendered page to find what element now corresponds to what the test was targeting, and patches the locator. For 15 failing tests this is dramatically faster than manual fixes. Regenerating from plans (option C) would also work but would lose any manual improvements made to the test files.",
        uk: "Healer створений саме для цього сценарію — зміни UI що ламають локатори. Він запускає тест що впав, відкриває браузер, дивиться на реально відрендерену сторінку щоб знайти який елемент тепер відповідає тому що тест намагався знайти, і патчить локатор. Для 15 тестів це драматично швидше ніж ручні виправлення. Перегенерація з планів (варіант В) теж спрацює але втратить будь-які ручні покращення що були зроблені у файлах тестів.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What are the three agents in Playwright's AI agent pipeline and what does each one do?",
        uk: "Які три агенти в AI-пайплайні Playwright і що робить кожен?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "recorder, runner, reporter — they record, execute, and report test results",
            uk: "recorder, runner, reporter — записують, виконують і звітують про результати тестів",
          },
        },
        {
          id: "b",
          label: {
            en: "planner (explores the app and writes a Markdown test plan), generator (turns the plan into Playwright test code), healer (fixes failing tests automatically)",
            uk: "planner (досліджує застосунок і пише Markdown-план), generator (перетворює план у Playwright-код тестів), healer (автоматично виправляє тести що падають)",
          },
        },
        {
          id: "c",
          label: {
            en: "analyzer, writer, debugger — they analyze coverage gaps, write tests, and debug failures",
            uk: "analyzer, writer, debugger — аналізують прогалини покриття, пишуть тести і дебажать збої",
          },
        },
        {
          id: "d",
          label: {
            en: "seeder, executor, validator — they seed test data, run tests, and validate outcomes",
            uk: "seeder, executor, validator — підготовляють тестові дані, запускають тести і валідують результати",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright ships three agents that form a pipeline: planner explores the app and produces a Markdown test plan with scenarios and expected results; generator reads that plan, verifies locators against the live UI, and outputs actual Playwright test files; healer takes failing tests, replays them in the browser, finds the corrected elements or flows, and patches the tests. Each can be run independently.",
        uk: "Playwright постачає три агенти що утворюють пайплайн: planner досліджує застосунок і виробляє Markdown-план з сценаріями і очікуваними результатами; generator читає цей план, перевіряє локатори проти живого UI і виводить реальні Playwright-файли тестів; healer бере тести що падають, відтворює їх у браузері, знаходить виправлені елементи або потоки і патчить тести. Кожен може запускатися окремо.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What command do you run to generate agent definition files for Claude Code?",
        uk: "Яку команду потрібно запустити щоб згенерувати файли визначень агентів для Claude Code?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright codegen --ai=claude",
            uk: "npx playwright codegen --ai=claude",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright init-agents --loop=claude",
            uk: "npx playwright init-agents --loop=claude",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright agents install --tool=claude",
            uk: "npx playwright agents install --tool=claude",
          },
        },
        {
          id: "d",
          label: {
            en: "npx playwright setup-mcp --provider=claude",
            uk: "npx playwright setup-mcp --provider=claude",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`npx playwright init-agents --loop=claude` generates the agent definition files (instructions and MCP tools) for Claude Code in `.github/`. For VS Code Copilot the flag is `--loop=vscode`, and for OpenCode it's `--loop=opencode`. These files tell the AI tool how to invoke each Playwright agent correctly. You should regenerate them whenever Playwright updates to pick up new instructions.",
        uk: "`npx playwright init-agents --loop=claude` генерує файли визначень агентів (інструкції та MCP-інструменти) для Claude Code у `.github/`. Для VS Code Copilot прапорець `--loop=vscode`, для OpenCode — `--loop=opencode`. Ці файли говорять AI-інструменту як правильно викликати кожен Playwright-агент. Їх варто регенерувати після кожного оновлення Playwright щоб підхопити нові інструкції.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What is the purpose of the seed test (`seed.spec.ts`) used by the planner and generator agents?",
        uk: "Яка мета seed-тесту (`seed.spec.ts`) що використовується агентами planner і generator?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It seeds the database with test data before each agent run",
            uk: "Він підготовлює базу даних тестовими даними перед кожним запуском агента",
          },
        },
        {
          id: "b",
          label: {
            en: "It provides the agent with a ready starting page — handling authentication and navigation so the agent can begin exploring from a known state",
            uk: "Він надає агенту готову початкову сторінку — обробляє автентифікацію і навігацію щоб агент міг почати дослідження з відомого стану",
          },
        },
        {
          id: "c",
          label: {
            en: "It is the template that the generator copies when creating new test files",
            uk: "Це шаблон який generator копіює при створенні нових файлів тестів",
          },
        },
        {
          id: "d",
          label: {
            en: "It runs before every generated test to verify the environment is healthy",
            uk: "Він запускається перед кожним згенерованим тестом щоб перевірити що середовище справне",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The seed test is a minimal Playwright test that establishes the starting environment — logging in, navigating to the right URL, setting up fixtures. When you tell planner 'Using seed.spec.ts, generate a test plan for /orders/new', the planner runs the seed first to get an authenticated, correctly-navigated page, then explores the UI from there. This avoids the agent needing to figure out login flows itself.",
        uk: "Seed-тест — мінімальний Playwright-тест що встановлює початкове середовище: вхід в систему, навігація до правильного URL, налаштування фікстур. Коли говориш planner 'Using seed.spec.ts, generate a test plan for /orders/new' — planner спочатку запускає seed щоб отримати авторизовану правильно-навіговану сторінку, а потім досліджує UI звідти. Це позбавляє агента потреби самостійно розбиратися з потоками входу.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does the generator agent do that makes its output more reliable than naive AI code generation?",
        uk: "Що робить агент generator що робить його вивід надійнішим ніж наївна AI-генерація коду?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It uses a formal specification language to describe tests before converting to code",
            uk: "Він використовує формальну мову специфікації для опису тестів перед конвертацією в код",
          },
        },
        {
          id: "b",
          label: {
            en: "It opens the real app and verifies each locator and assertion live as it writes the test — the generated tests are already confirmed against the actual UI",
            uk: "Він відкриває реальний застосунок і перевіряє кожен локатор і assertion на льоту поки пише тест — згенеровані тести вже підтверджені проти реального UI",
          },
        },
        {
          id: "c",
          label: {
            en: "It generates tests in multiple languages and picks the one that passes all checks",
            uk: "Він генерує тести кількома мовами і вибирає той що проходить всі перевірки",
          },
        },
        {
          id: "d",
          label: {
            en: "It copies patterns from a pre-trained dataset of high-quality Playwright tests",
            uk: "Він копіює патерни з попередньо навченого набору даних якісних Playwright-тестів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Generator doesn't just guess locators based on the Markdown plan — it opens the actual running application and verifies each locator and assertion as it writes. This live verification loop means the generated test file already has confirmed selectors that match the real DOM, rather than plausible-looking locators that might fail on first run. It reads the plan, writes a step, verifies it, then proceeds.",
        uk: "Generator не просто вгадує локатори на основі Markdown-плану — він відкриває реально запущений застосунок і перевіряє кожен локатор і assertion під час написання. Цей цикл живої верифікації означає що згенерований файл тесту вже має підтверджені селектори що відповідають реальному DOM, а не правдоподібні локатори які можуть впасти при першому запуску. Він читає план, пише крок, перевіряє його, потім продовжує.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What happens when healer determines that a failing test reflects a real bug in the application rather than a broken locator?",
        uk: "Що відбувається коли healer визначає що тест що падає відображає реальний баг у застосунку, а не зламаний локатор?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Healer deletes the failing test to keep the test suite green",
            uk: "Healer видаляє тест що падає щоб тестовий набір залишався зеленим",
          },
        },
        {
          id: "b",
          label: {
            en: "Healer skips the test and reports the issue — it doesn't fix application bugs, only broken test locators and wait strategies",
            uk: "Healer пропускає тест і повідомляє про проблему — він не виправляє баги застосунку, лише зламані локатори тестів і стратегії очікування",
          },
        },
        {
          id: "c",
          label: {
            en: "Healer automatically creates a GitHub issue with the details",
            uk: "Healer автоматично створює GitHub issue з деталями",
          },
        },
        {
          id: "d",
          label: {
            en: "Healer patches the test to skip the failing assertion so the test passes",
            uk: "Healer патчить тест щоб пропустити assertion що падає і тест проходив",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Healer's job is to fix tests that break due to UI changes, not to mask application bugs. It loops — run, fail, patch, re-run — until the test passes or until it determines the underlying functionality is genuinely broken. In the latter case, it marks the test as skipped and reports the issue for human review. This distinction keeps the test suite honest: a green suite means the app works, not that the tests were silently loosened.",
        uk: "Завдання healer — виправляти тести що ламаються через зміни UI, а не маскувати баги застосунку. Він повторює цикл — запуск, збій, патч, повторний запуск — доки тест не пройде або доки не визначить що базова функціональність справді зламана. В останньому випадку він позначає тест як пропущений і повідомляє про проблему для перевірки людиною. Це розрізнення тримає тестовий набір чесним: зелений набір означає що застосунок працює, а не що тести були мовчазно послаблені.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Where does Playwright store the agent definition files when you run `npx playwright init-agents --loop=claude`?",
        uk: "Де Playwright зберігає файли визначень агентів при запуску `npx playwright init-agents --loop=claude`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "In `node_modules/@playwright/agents/`",
            uk: "У `node_modules/@playwright/agents/`",
          },
        },
        {
          id: "b",
          label: {
            en: "In `.github/` — the standard location for Claude Code agent definitions",
            uk: "У `.github/` — стандартне місце для визначень агентів Claude Code",
          },
        },
        {
          id: "c",
          label: {
            en: "In `playwright.config.ts` as exported agent configuration",
            uk: "У `playwright.config.ts` як експортована конфігурація агентів",
          },
        },
        {
          id: "d",
          label: {
            en: "In `specs/agents/` alongside the Markdown test plans",
            uk: "У `specs/agents/` поруч з Markdown-планами тестів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "For Claude Code, `init-agents` places the generated agent definition files in `.github/` — the directory that Claude Code uses for agent instructions and MCP tool definitions. The location varies by AI tool: VS Code Copilot uses a different directory. You should commit these files to version control and regenerate them when Playwright updates to pick up revised instructions.",
        uk: "Для Claude Code `init-agents` розміщує згенеровані файли визначень агентів у `.github/` — директорія яку Claude Code використовує для інструкцій агентів і визначень MCP-інструментів. Розташування відрізняється залежно від AI-інструменту: VS Code Copilot використовує іншу директорію. Ці файли варто комітити у version control і регенерувати при оновленні Playwright щоб підхопити переглянуті інструкції.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "The agent-produced test file has clear, semantic locators and readable structure, but a human engineer notices a more efficient assertion strategy. Should they edit the file?",
        uk: "Файл тесту створений агентом має чіткі семантичні локатори і читабельну структуру, але інженер-людина помічає більш ефективну стратегію assertion. Чи варто редагувати файл?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "No — agent-generated files must never be manually edited or the agents will refuse to process them",
            uk: "Ні — файли створені агентами ніколи не можна редагувати вручну або агенти відмовляться їх обробляти",
          },
        },
        {
          id: "b",
          label: {
            en: "Yes — agent-generated tests are regular Playwright files that humans can and should improve; the value is in the workflow, not in treating output as immutable",
            uk: "Так — тести створені агентами є звичайними Playwright-файлами які люди можуть і повинні покращувати; цінність у workflow, а не в ставленні до виводу як до незмінного",
          },
        },
        {
          id: "c",
          label: {
            en: "Only the healer agent is allowed to modify generated test files",
            uk: "Тільки агент healer може змінювати згенеровані файли тестів",
          },
        },
        {
          id: "d",
          label: {
            en: "Manual edits are fine but must be tagged with a `// human-edit` comment so the agent ignores those lines",
            uk: "Ручні правки допустимі але мають бути позначені коментарем `// human-edit` щоб агент ігнорував ці рядки",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Agent-generated test files are ordinary TypeScript files — there is nothing special that prevents human edits. The three-agent workflow is a productivity tool, not a locked system. Humans should review, improve, and refactor the generated tests. The trade-off to be aware of: if you later ask generator to regenerate from the Markdown plan, manual improvements in the `.spec.ts` file may be overwritten. Use healer for targeted fixes to preserve manual work.",
        uk: "Файли тестів створені агентами — звичайні TypeScript-файли: немає нічого особливого що забороняє правки людиною. Три-агентний workflow — інструмент продуктивності, а не заблокована система. Люди повинні переглядати, покращувати і рефакторити згенеровані тести. Компроміс про який варто знати: якщо пізніше попросити generator перегенерувати з Markdown-плану — ручні покращення у файлі `.spec.ts` можуть бути перезаписані. Використовуй healer для точкових виправлень щоб зберегти ручну роботу.",
      },
    },
  ],
}
