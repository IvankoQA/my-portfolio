import type { PlaywrightTopic } from "../../types"

export const testAgentsTopic: PlaywrightTopic = {
  slug: "test-agents",
  groupId: "test-runner",
  order: 305,
  sourceDoc: "test-agents-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-agents",
  title: {
    en: "Agents",
    uk: "Агенти",
  },
  summary: {
    en: "# Playwright Test Agents",
    uk: "# Агенти Playwright Test",
  },
  sections: [
    {
      id: "overview",
      title: {
        en: "Overview",
        uk: "Огляд",
      },
      paragraphs: [
        {
          en: "# Playwright Test Agents",
          uk: "# Агенти Playwright Test",
        },
      ],
    },
    {
      id: "introduction",
      title: {
        en: "Introduction",
        uk: "Вступ",
      },
      paragraphs: [
        {
          en: "Playwright comes with three Playwright Test Agents out of the box: **🎭 planner**, **🎭 generator** and **🎭 healer**.",
          uk: "Playwright постачає три вбудовані Playwright Test Agents: **🎭 planner**, **🎭 generator** і **🎭 healer**.",
        },
        {
          en: "These agents can be used independently, sequentially, or as the chained calls in the agentic loop.\nUsing them sequentially will produce test coverage for your product.",
          uk: "Цих агентів можна використовувати окремо, послідовно або ланцюжком викликів у agentic loop.\nПослідовне використання допоможе сформувати покриття тестами вашого продукту.",
        },
        {
          en: "* **🎭 planner** explores the app and produces a Markdown test plan",
          uk: "* **🎭 planner** досліджує застосунок і створює тест-план у Markdown",
        },
        {
          en: "* **🎭 generator** transforms the Markdown plan into the Playwright Test files",
          uk: "* **🎭 generator** перетворює Markdown-план на файли Playwright Test",
        },
        {
          en: "* **🎭 healer** executes the test suite and automatically repairs failing tests",
          uk: "* **🎭 healer** запускає набір тестів і автоматично виправляє ті, що падають",
        },
        {
          en: "### Getting Started",
          uk: "### Початок роботи",
        },
        {
          en: "Start with adding Playwright Test Agent definitions to your project using\nthe `init-agents` command. These definitions should be regenerated whenever Playwright\nis updated to pick up new tools and instructions.",
          uk: "Почніть із додавання визначень Playwright Test Agent до проєкту командою\n`init-agents`. Ці визначення варто регенерувати після кожного оновлення Playwright,\nщоб отримати нові інструменти та інструкції.",
        },
        {
          en: "Once the agents have been generated, you can use your AI tool of choice to command these agents to build Playwright Tests.",
          uk: "Після генерації агентів можна обрати зручний для вас AI-інструмент і керувати ними для створення Playwright Tests.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "bash",
          code: "npx playwright init-agents --loop=vscode",
        },
        {
          id: "cb-2",
          language: "bash",
          code: "npx playwright init-agents --loop=claude",
        },
        {
          id: "cb-3",
          language: "bash",
          code: "npx playwright init-agents --loop=opencode",
        },
      ],
    },
    {
      id: "planner",
      title: {
        en: "🎭 Planner",
        uk: "🎭 Planner",
      },
      paragraphs: [
        {
          en: "Planner agent explores your app and produces a test plan for one or many scenarios and user flows.",
          uk: "Агент planner досліджує застосунок і формує тест-план для одного або багатьох сценаріїв і користувацьких потоків.",
        },
        {
          en: "**Input**",
          uk: "**Вхідні дані**",
        },
        {
          en: "* A clear request to the planner (e.g., “Generate a plan for guest checkout.”)\n* A `seed test` that sets up the environment necessary to interact with your app\n* *(optional)* A Product Requirement Document (PRD) for context",
          uk: "* Чіткий запит до planner (наприклад: «Згенеруй план для гостьового оформлення замовлення.»)\n* `seed test`, який готує середовище для взаємодії з застосунком\n* *(необов’язково)* PRD (Product Requirement Document) для контексту",
        },
        {
          en: "**Prompt**",
          uk: "**Підказка**",
        },
        {
          en: "> - Notice how the `seed.spec.ts` is included in the context of the planner.\n> - Planner will run this test to execute all the initialization necessary for your test including the global setup, project dependencies and all the necessary fixtures and hooks.\n> - Planner will also use this seed test as an example of all the generated tests. Alternatively, you can mention the file name in the prompt.",
          uk: "> - Зверніть увагу: `seed.spec.ts` включено в контекст planner.\n> - Planner запустить цей тест, щоб виконати всю ініціалізацію — глобальний setup, залежності проєкту, потрібні фікстури та хуки.\n> - Цей seed також слугуватиме зразком для згенерованих тестів. За потреби можна просто згадати ім’я файлу в підказці.",
        },
        {
          en: "**Output**",
          uk: "**Результат**",
        },
        {
          en: "* A Markdown test plan saved as `specs/basic-operations.md`.\n* The plan is human-readable but precise enough for test generation.",
          uk: "* Тест-план у Markdown збережено як `specs/basic-operations.md`.\n* План зручний для людини й водночас достатньо точний для генерації тестів.",
        },
        {
          en: "Example: specs/basic-operations.md",
          uk: "Приклад: specs/basic-operations.md",
        },
        {
          en: "```markdown\n# TodoMVC Application - Basic Operations Test Plan",
          uk: "```markdown\n# Застосунок TodoMVC — тест-план базових операцій",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: "\ntest('seed', async ({ page }) => {\n  // this test uses custom fixtures from ./fixtures\n});",
        },
      ],
    },
    {
      id: "application-overview",
      title: {
        en: "Application Overview",
        uk: "Огляд застосунку",
      },
      paragraphs: [
        {
          en: "The TodoMVC application is a React-based todo list manager that demonstrates standard todo application functionality. The application provides comprehensive task management capabilities with a clean, intuitive interface. Key features include:",
          uk: "TodoMVC — це менеджер списків справ на React, який демонструє типову функціональність todo-застосунків. Є повноцінне керування задачами з чистим інтуїтивним інтерфейсом. Ключові можливості:",
        },
        {
          en: "- **Task Management**: Add, edit, complete, and delete individual todos\n- **Bulk Operations**: Mark all todos as complete/incomplete and clear all completed todos  \n- **Filtering System**: View todos by All, Active, or Completed status with URL routing support\n- **Real-time Counter**: Display of active (incomplete) todo count\n- **Interactive UI**: Hover states, edit-in-place functionality, and responsive design\n- **State Persistence**: Maintains state during session navigation",
          uk: "- **Керування задачами**: додавання, редагування, позначення виконаними та видалення окремих todo\n- **Масові операції**: позначити всі як виконані/невиконані й очистити всі виконані  \n- **Фільтрація**: перегляд за All, Active або Completed з підтримкою маршрутизації в URL\n- **Лічильник у реальному часі**: кількість активних (невиконаних) todo\n- **Інтерактивний UI**: hover, редагування на місці, адаптивна верстка\n- **Збереження стану**: стан зберігається під час навігації в сесії",
        },
      ],
    },
    {
      id: "test-scenarios",
      title: {
        en: "Test Scenarios",
        uk: "Тестові сценарії",
      },
      paragraphs: [
        {
          en: "### 1. Adding New Todos",
          uk: "### 1. Додавання нових todo",
        },
        {
          en: "**Seed:** `tests/seed.spec.ts`",
          uk: "**Seed:** `tests/seed.spec.ts`",
        },
        {
          en: "#### 1.1 Add Valid Todo",
          uk: "#### 1.1 Додати коректне todo",
        },
        {
          en: '**Steps:**\n1. Click in the "What needs to be done?" input field\n2. Type "Buy groceries"\n3. Press Enter key',
          uk: "**Кроки:**\n1. Клацніть у полі введення «What needs to be done?»\n2. Введіть «Buy groceries»\n3. Натисніть Enter",
        },
        {
          en: '**Expected Results:**\n- Todo appears in the list with unchecked checkbox\n- Counter shows "1 item left"\n- Input field is cleared and ready for next entry\n- Todo list controls become visible (Mark all as complete checkbox)',
          uk: "**Очікуваний результат:**\n- Todo з’являється в списку з непозначеним чекбоксом\n- Лічильник показує «1 item left»\n- Поле введення очищене й готове до наступного запису\n- З’являються елементи керування списком (чекбокс «Mark all as complete»)",
        },
        {
          en: "#### 1.2 Add Multiple Todos\n...\n```",
          uk: "#### 1.2 Додати кілька todo\n...\n```",
        },
      ],
    },
    {
      id: "generator",
      title: {
        en: "🎭 Generator",
        uk: "🎭 Generator",
      },
      paragraphs: [
        {
          en: "Generator agent uses the Markdown plan to produce executable Playwright Tests.\nIt verifies selectors and assertions live as it performs the scenarios. Playwright supports\ngeneration hints and provides a catalog of assertions for efficient structural and\nbehavioral validation.",
          uk: "Агент generator будує виконувані Playwright Tests з Markdown-плану.\nПід час проходження сценаріїв перевіряє селектори й твердження «на льоту». Playwright підтримує\nпідказки для генерації й надає каталог assertions для ефективної структурної та\nповедінкової перевірки.",
        },
        {
          en: "**Input**",
          uk: "**Вхідні дані**",
        },
        {
          en: "* Markdown plan from `specs/`",
          uk: "* Markdown-план з каталогу `specs/`",
        },
        {
          en: "**Prompt**",
          uk: "**Підказка**",
        },
        {
          en: "> - Notice how the `basic-operations.md` is included in the context of the generator.\n> - This is how generator knows where to get the test plan from. Alternatively, you can mention the file name in the prompt.",
          uk: "> - Зверніть увагу: `basic-operations.md` включено в контекст generator.\n> - Так generator знає, звідки брати тест-план. За потреби можна згадати ім’я файлу в підказці.",
        },
        {
          en: "**Output**",
          uk: "**Результат**",
        },
        {
          en: "* A test suite under `tests/`\n* Generated tests may include initial errors that can be healed automatically by the healer agent",
          uk: "* Набір тестів у каталозі `tests/`\n* Згенеровані тести можуть спочатку містити помилки — їх може автоматично виправити агент healer",
        },
        {
          en: "Example: tests/add-valid-todo.spec.ts",
          uk: "Приклад: tests/add-valid-todo.spec.ts",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "ts",
          code: "// spec: specs/basic-operations.md\n// seed: tests/seed.spec.ts\n\ntest.describe('Adding New Todos', () => {\n  test('Add Valid Todo', async ({ page }) => {\n    // 1. Click in the \"What needs to be done?\" input field\n    const todoInput = page.getByRole('textbox', { name: 'What needs to be done?' });\n    await todoInput.click();\n\n    // 2. Type \"Buy groceries\"\n    await todoInput.fill('Buy groceries');\n\n    // 3. Press Enter key\n    await todoInput.press('Enter');\n\n    // Expected Results:\n    // - Todo appears in the list with unchecked checkbox\n    await expect(page.getByText('Buy groceries')).toBeVisible();\n    const todoCheckbox = page.getByRole('checkbox', { name: 'Toggle Todo' });\n    await expect(todoCheckbox).toBeVisible();\n    await expect(todoCheckbox).not.toBeChecked();\n\n    // - Counter shows \"1 item left\"\n    await expect(page.getByText('1 item left')).toBeVisible();\n\n    // - Input field is cleared and ready for next entry\n    await expect(todoInput).toHaveValue('');\n    await expect(todoInput).toBeFocused();\n\n    // - Todo list controls become visible (Mark all as complete checkbox)\n    await expect(page.getByRole('checkbox', { name: '❯Mark all as complete' })).toBeVisible();\n  });\n});",
        },
      ],
    },
    {
      id: "healer",
      title: {
        en: "🎭 Healer",
        uk: "🎭 Healer",
      },
      paragraphs: [
        {
          en: "When the test fails, the healer agent:",
          uk: "Коли тест падає, агент healer:",
        },
        {
          en: "* Replays the failing steps\n* Inspects the current UI to locate equivalent elements or flows\n* Suggests a patch (e.g., locator update, wait adjustment, data fix)\n* Re-runs the test until it passes or until guardrails stop the loop",
          uk: "* Повторює кроки, що призвели до збою\n* Переглядає поточний UI, щоб знайти еквівалентні елементи або потоки\n* Пропонує патч (оновлення локатора, корекція очікувань, виправлення даних)\n* Перезапускає тест, доки він не пройде або доки обмеження не зупинять цикл",
        },
        {
          en: "**Input**",
          uk: "**Вхідні дані**",
        },
        {
          en: "* Failing test name",
          uk: "* Назва тесту, що падає",
        },
        {
          en: "**Prompt**",
          uk: "**Підказка**",
        },
        {
          en: "**Output**",
          uk: "**Результат**",
        },
        {
          en: "* A passing test, or a skipped test if the healer believes that functionality is broken.",
          uk: "* Успішний тест або пропущений, якщо healer вважає функціональність зламаною.",
        },
      ],
    },
    {
      id: "artifacts-and-conventions",
      title: {
        en: "Artifacts and Conventions",
        uk: "Артефакти та угоди",
      },
      paragraphs: [
        {
          en: "The static agent definitions and generated files follow a simple, auditable structure:",
          uk: "Статичні визначення агентів і згенеровані файли мають просту структуру, зручну для аудиту:",
        },
        {
          en: "### Agent Definitions",
          uk: "### Визначення агентів",
        },
        {
          en: "Under the hood, agent definitions are collections of instructions and MCP tools. They are provided by\nPlaywright and should be regenerated whenever Playwright is updated.",
          uk: "Під капотом визначення агентів — це набір інструкцій і MCP-інструментів. Їх надає\nPlaywright; їх слід регенерувати після кожного оновлення Playwright.",
        },
        {
          en: "Example for Claude Code subagents:",
          uk: "Приклад для субагентів Claude Code:",
        },
        {
          en: "### Specs in `specs/`",
          uk: "### Спеки в `specs/`",
        },
        {
          en: "Specs are structured plans describing scenarios in human-readable terms. They include\nsteps, expected outcomes, and data. Specs can start from scratch or extend a seed test.",
          uk: "Спеки — структуровані плани сценаріїв людською мовою. Містять\nкроки, очікувані результати та дані. Можна починати з нуля або розширювати seed-тест.",
        },
        {
          en: "### Tests in `tests/`",
          uk: "### Тести в `tests/`",
        },
        {
          en: "Generated Playwright tests, aligned one-to-one with specs wherever feasible.",
          uk: "Згенеровані тести Playwright, по можливості у відповідності один-до-одного зі спеками.",
        },
        {
          en: "### Seed tests `seed.spec.ts`",
          uk: "### Seed-тести `seed.spec.ts`",
        },
        {
          en: "Seed tests provide a ready-to-use `page` context to bootstrap execution.",
          uk: "Seed-тести дають готовий контекст `page` для старту виконання.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "bash",
          code: "repo/\n  .github/                    # agent definitions\n  specs/                      # human-readable test plans\n    basic-operations.md\n  tests/                      # generated Playwright tests\n    seed.spec.ts              # seed test for environment\n    tests/create/add-valid-todo.spec.ts\n  playwright.config.ts",
        },
        {
          id: "cb-7",
          language: "bash",
          code: "npx playwright init-agents --loop=vscode",
        },
      ],
    },
  ],
  quiz: [],
}
