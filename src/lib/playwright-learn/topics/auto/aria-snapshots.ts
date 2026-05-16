import type { PlaywrightTopic } from "../../types"

export const ariaSnapshotsTopic: PlaywrightTopic = {
  slug: "aria-snapshots",
  groupId: "guides",
  order: 115,
  level: "advanced",
  trackOrder: 17,
  sourceDoc: "aria-snapshots.md",
  officialDocsUrl: "https://playwright.dev/docs/aria-snapshots",
  title: {
    en: "Snapshot testing",
    uk: "Snapshot-тестування",
  },
  summary: {
    en: "ARIA snapshots capture the accessibility tree of a page as YAML and compare it on re-run. Unlike HTML snapshots, they survive CSS/class refactors — they only break when the meaningful structure changes.",
    uk: "ARIA snapshot фіксує дерево доступності сторінки як YAML і порівнює при повторному запуску. На відміну від HTML snapshots — переживає рефакторинг CSS і класів. Ламається лише коли змінюється значуща структура.",
  },
  sections: [
    {
      id: "what-aria-snapshots-capture",
      title: {
        en: "What gets captured",
        uk: "Що фіксується",
      },
      paragraphs: [
        {
          en: "An ARIA snapshot is not HTML. It's the accessibility tree — the same view a screen reader sees. It captures roles, accessible names, and attributes like `checked`, `expanded`, `disabled`. Implementation details like CSS classes, data attributes, or HTML tags don't appear.",
          uk: "ARIA snapshot — це не HTML. Це дерево доступності — той самий вигляд що бачить screen reader. Фіксує ролі, доступні назви і атрибути як `checked`, `expanded`, `disabled`. Деталі реалізації на зразок CSS класів, data атрибутів або HTML тегів не з'являються.",
        },
        {
          en: "This is the key advantage: a developer can rewrite the component's internals, change the markup, rename classes — the snapshot won't break unless the component's accessible structure actually changes.",
          uk: "Це ключова перевага: розробник може переписати внутрішній код компонента, змінити верстку, перейменувати класи — snapshot не зламається поки не зміниться доступна структура компонента.",
        },
      ],
    },
    {
      id: "basic-snapshot",
      title: {
        en: "Write and match a snapshot",
        uk: "Написати та перевірити snapshot",
      },
      paragraphs: [
        {
          en: "The template is a YAML-like string where each line is `- role \"accessible name\"`. You can match the whole page with `expect(page).toMatchAriaSnapshot()` or scope to a specific element with a locator.",
          uk: "Шаблон — це YAML-подібний рядок де кожен рядок є `- роль \"доступна назва\"`. Можна перевірити всю сторінку через `expect(page).toMatchAriaSnapshot()` або обмежити scope конкретним елементом через локатор.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-match",
          language: "ts",
          code: `test('order detail page structure', async ({ page }) => {
  await page.goto('/orders/42')

  // Перевіряємо структуру всієї сторінки
  await expect(page).toMatchAriaSnapshot(\`
    - heading "Order #42" [level=1]
    - region "Order details":
      - text: Customer: Ivan Kozenko
      - text: Status: Pending
    - region "Actions":
      - button "Approve order"
      - button "Cancel order"
  \`)
})

// Або лише конкретну частину сторінки
test('action buttons are correct', async ({ page }) => {
  await page.goto('/orders/42')

  await expect(page.getByRole('region', { name: 'Actions' })).toMatchAriaSnapshot(\`
    - button "Approve order"
    - button "Cancel order"
  \`)
})`,
        },
      ],
    },
    {
      id: "partial-matching",
      title: {
        en: "Partial matching — check what matters",
        uk: "Часткове збігання — перевіряй що важливо",
      },
      paragraphs: [
        {
          en: "By default, a snapshot template matches a subset — you don't need to list every element. Only what you put in the template is checked. If the page has 20 nav links but you only care that the Orders link exists, include just that one.",
          uk: "За замовчуванням шаблон перевіряє підмножину — не треба перераховувати кожен елемент. Перевіряється лише те що ти поклав у шаблон. Якщо на сторінці 20 nav посилань але тебе цікавить лише що посилання Orders існує — включи лише його.",
        },
        {
          en: "You can also omit the accessible name to match any element with that role, or use regex for dynamic text.",
          uk: "Можна також опустити доступну назву щоб збіг з будь-яким елементом тієї ролі, або використати regex для динамічного тексту.",
        },
      ],
      codeBlocks: [
        {
          id: "partial-match",
          language: "ts",
          code: `// Перевірити що кнопка з роллю button існує (без вказання назви)
await expect(page.getByRole('dialog')).toMatchAriaSnapshot(\`
  - dialog:
    - button
\`)

// Regex для динамічного тексту
await expect(page).toMatchAriaSnapshot(\`
  - heading /Order #\\d+/ [level=1]
  - text: /\\d+ items/
\`)

// Перевірити що список містить хоча б ці елементи (порядок — не важливий)
await expect(page.getByRole('navigation')).toMatchAriaSnapshot(\`
  - navigation:
    - link "Dashboard"
    - link "Orders"
\`)`,
        },
      ],
    },
    {
      id: "strict-children",
      title: {
        en: "Strict children — exact list",
        uk: "Strict children — точний список",
      },
      paragraphs: [
        {
          en: "When you need to assert that the element has EXACTLY these children and no others, add `/children: equal` to the template. This is useful for navigation menus, action toolbars, or select options where unexpected extra items are a bug.",
          uk: "Коли треба перевірити що елемент має РІВНО ці нащадки і жодних інших — додай `/children: equal` до шаблону. Корисно для меню навігації, тулбарів дій або select опцій де несподівані зайві елементи — це баг.",
        },
      ],
      codeBlocks: [
        {
          id: "strict-children",
          language: "ts",
          code: `// Точно ці 3 кнопки, не більше і не менше
await expect(page.getByRole('toolbar')).toMatchAriaSnapshot(\`
  - toolbar "Order actions":
    - /children: equal
    - button "Approve"
    - button "Reject"
    - button "Archive"
\`)

// Глобально в конфізі — щоб всі snapshots перевіряли рівно
// playwright.config.ts
export default defineConfig({
  expect: {
    toMatchAriaSnapshot: {
      children: 'equal',
    },
  },
})`,
        },
      ],
    },
    {
      id: "generating-snapshots",
      title: {
        en: "Auto-generate snapshot templates",
        uk: "Автогенерація шаблонів",
      },
      paragraphs: [
        {
          en: "You don't have to write snapshot templates by hand. Two ways to generate them: run with `--update-snapshots` flag (updates in-test inline strings), or use the VS Code extension's \"Update snapshot\" button next to a failing test.",
          uk: "Не обов'язково писати шаблони вручну. Два способи згенерувати: запустити з прапором `--update-snapshots` (оновлює inline рядки у тесті), або використати кнопку \"Update snapshot\" у VS Code extension поруч з падаючим тестом.",
        },
        {
          en: "On the first run when there's no existing snapshot, Playwright auto-generates it and the test passes. After that, any deviation fails the test until you explicitly update.",
          uk: "При першому запуску коли немає існуючого snapshot — Playwright автоматично генерує його і тест проходить. Після цього будь-яке відхилення падає поки ти явно не оновиш.",
        },
      ],
      codeBlocks: [
        {
          id: "update-snapshots",
          language: "bash",
          code: `# Оновити всі застарілі snapshots
npx playwright test --update-snapshots

# Або лише конкретний файл
npx playwright test tests/orders.spec.ts --update-snapshots`,
        },
        {
          id: "first-run",
          language: "ts",
          code: `// При першому запуску — пустий шаблон, Playwright заповнить
test('nav structure', async ({ page }) => {
  await page.goto('/dashboard')

  // Перший запуск: Playwright запише шаблон
  await expect(page.getByRole('navigation')).toMatchAriaSnapshot(\`\`)
})

// Після першого запуску шаблон буде заповнений:
// await expect(page.getByRole('navigation')).toMatchAriaSnapshot(\`
//   - navigation:
//     - link "Dashboard"
//     - link "Orders"
//     - link "Customers"
// \`)`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A developer renames a CSS class on the order table from .orders-table to .data-table. Will the ARIA snapshot test break?",
        uk: "Розробник перейменовує CSS клас таблиці замовлень з .orders-table на .data-table. Чи зламається ARIA snapshot тест?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Yes — the snapshot includes class names",
            uk: "Так — snapshot включає назви класів",
          },
        },
        {
          id: "b",
          label: {
            en: "No — ARIA snapshots capture the accessibility tree, not CSS classes",
            uk: "Ні — ARIA snapshots фіксують дерево доступності, а не CSS класи",
          },
        },
        {
          id: "c",
          label: {
            en: "It depends on whether the table has an aria-label attribute",
            uk: "Залежить від того чи таблиця має атрибут aria-label",
          },
        },
        {
          id: "d",
          label: {
            en: "Yes — the snapshot records every DOM attribute including class names",
            uk: "Так — snapshot записує кожен DOM атрибут включно з назвами класів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "ARIA snapshots capture roles, accessible names, and semantic attributes — not CSS classes, HTML tags, or data attributes. A CSS class rename is invisible to the accessibility tree and won't affect the snapshot.",
        uk: "ARIA snapshots фіксують ролі, доступні назви і семантичні атрибути — не CSS класи, HTML теги або data атрибути. Перейменування CSS класу невидиме для дерева доступності і не вплине на snapshot.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You want to assert that a toolbar has EXACTLY 3 buttons and no more. What do you add to the template?",
        uk: "Хочеш перевірити що тулбар має РІВНО 3 кнопки і не більше. Що додаєш до шаблону?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add count: 3 to each button entry",
            uk: "Додати count: 3 до кожного запису кнопки",
          },
        },
        {
          id: "b",
          label: {
            en: "Add /children: equal to the toolbar node in the template",
            uk: "Додати /children: equal до вузла toolbar у шаблоні",
          },
        },
        {
          id: "c",
          label: {
            en: "Use expect(toolbar).toHaveCount(3) instead of toMatchAriaSnapshot",
            uk: "Використати expect(toolbar).toHaveCount(3) замість toMatchAriaSnapshot",
          },
        },
        {
          id: "d",
          label: {
            en: "Add strict: true as an option to toMatchAriaSnapshot()",
            uk: "Додати strict: true як опцію до toMatchAriaSnapshot()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`/children: equal` switches the matching from 'contains these children' (default) to 'has exactly these children in this order'. Without it, extra buttons would be silently allowed.",
        uk: "`/children: equal` перемикає збігання з 'містить ці нащадки' (за замовчуванням) на 'має рівно ці нащадки в цьому порядку'. Без цього зайві кнопки були б мовчки дозволені.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does an ARIA snapshot actually capture about a page element?",
        uk: "Що насправді фіксує ARIA snapshot про елемент сторінки?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The full HTML markup including CSS classes and data attributes",
            uk: "Повну HTML-розмітку включно з CSS класами і data-атрибутами",
          },
        },
        {
          id: "b",
          label: {
            en: "A pixel-by-pixel screenshot of the rendered element",
            uk: "Попіксельний знімок відрендереного елемента",
          },
        },
        {
          id: "c",
          label: {
            en: "Roles, accessible names, and semantic attributes like checked, expanded, disabled",
            uk: "Ролі, доступні назви і семантичні атрибути як checked, expanded, disabled",
          },
        },
        {
          id: "d",
          label: {
            en: "The computed CSS styles and layout coordinates of each element",
            uk: "Обчислені CSS-стилі і координати розташування кожного елемента",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "ARIA snapshots capture the accessibility tree — the same view a screen reader sees. This means roles (button, heading, link), accessible names, and state attributes (checked, expanded, disabled). HTML tags, CSS classes, data attributes, and visual properties are deliberately excluded, which is why snapshots survive CSS refactors.",
        uk: "ARIA snapshots фіксують дерево доступності — той самий вигляд що бачить screen reader. Це означає ролі (button, heading, link), доступні назви і атрибути стану (checked, expanded, disabled). HTML теги, CSS класи, data атрибути і візуальні властивості навмисно виключені — тому snapshots переживають CSS рефакторинг.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You run a snapshot test for the first time with an empty template string. What happens?",
        uk: "Запускаєш snapshot тест вперше з порожнім рядком шаблону. Що відбувається?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The test fails immediately because an empty template never matches",
            uk: "Тест одразу падає бо порожній шаблон ніколи не збігається",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright auto-generates the snapshot template and the test passes",
            uk: "Playwright автоматично генерує шаблон snapshot і тест проходить",
          },
        },
        {
          id: "c",
          label: {
            en: "The test is skipped and a warning is printed to the console",
            uk: "Тест пропускається і у консоль виводиться попередження",
          },
        },
        {
          id: "d",
          label: {
            en: "You must run --update-snapshots first before any snapshot test can run",
            uk: "Потрібно спочатку запустити --update-snapshots перш ніж будь-який snapshot тест може виконатися",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "On the first run with no existing snapshot (or an empty template string), Playwright automatically generates the ARIA snapshot and writes it into the template. The test passes. On subsequent runs, any deviation from the captured template causes a failure. This bootstrap behavior means you can write the test with empty templates and let Playwright fill them in.",
        uk: "При першому запуску без існуючого snapshot (або з порожнім рядком шаблону) Playwright автоматично генерує ARIA snapshot і записує його в шаблон. Тест проходить. При наступних запусках будь-яке відхилення від зафіксованого шаблону призводить до падіння. Ця bootstrap-поведінка означає що можна написати тест з порожніми шаблонами і дати Playwright заповнити їх.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you update all outdated ARIA snapshot templates after a legitimate UI restructure?",
        uk: "Як оновити всі застарілі шаблони ARIA snapshot після законної реструктуризації UI?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Delete the snapshot files manually and re-run the tests",
            uk: "Видалити файли snapshot вручну і перезапустити тести",
          },
        },
        {
          id: "b",
          label: {
            en: "Run npx playwright test --update-snapshots",
            uk: "Запустити npx playwright test --update-snapshots",
          },
        },
        {
          id: "c",
          label: {
            en: "Edit each YAML snapshot file by hand to match the new structure",
            uk: "Відредагувати кожен YAML файл snapshot вручну відповідно до нової структури",
          },
        },
        {
          id: "d",
          label: {
            en: "Run npx playwright test --reset to clear all snapshots",
            uk: "Запустити npx playwright test --reset щоб очистити всі snapshot",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `--update-snapshots` flag tells Playwright to regenerate snapshot templates for all tests, updating any that no longer match. This is the standard workflow: make your UI change, run tests to see which snapshots fail, then run with `--update-snapshots` to accept the new structure. You can also use the VS Code extension's 'Update snapshot' button next to a failing test.",
        uk: "Прапор `--update-snapshots` наказує Playwright регенерувати шаблони snapshot для всіх тестів, оновлюючи ті що більше не збігаються. Це стандартний workflow: внести зміну в UI, запустити тести щоб побачити які snapshot падають, потім запустити з `--update-snapshots` щоб прийняти нову структуру. Також можна використовувати кнопку 'Update snapshot' у VS Code extension поруч із падаючим тестом.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You want to check that a navigation menu contains a 'Dashboard' link without listing every other link in the nav. How does ARIA snapshot matching work by default?",
        uk: "Хочеш перевірити що меню навігації містить посилання 'Dashboard' не перераховуючи всі інші посилання. Як за замовчуванням працює збігання ARIA snapshot?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "By default matching is strict — you must list every element or the test fails",
            uk: "За замовчуванням збігання суворе — потрібно перерахувати кожен елемент або тест падає",
          },
        },
        {
          id: "b",
          label: {
            en: "By default matching is partial — the template checks a subset, so you only include what you care about",
            uk: "За замовчуванням збігання часткове — шаблон перевіряє підмножину, тому включаєш лише те що важливо",
          },
        },
        {
          id: "c",
          label: {
            en: "You must add a wildcard '...' entry to allow unspecified elements",
            uk: "Потрібно додати запис-шаблон '...' щоб дозволити невказані елементи",
          },
        },
        {
          id: "d",
          label: {
            en: "Partial matching requires passing { partial: true } as an option",
            uk: "Часткове збігання вимагає передати { partial: true } як опцію",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By default, ARIA snapshot templates use partial (subset) matching. You only list the elements you want to assert — any additional elements on the page are silently ignored. This lets you write focused assertions. To switch to exact matching (no unspecified children allowed), add `/children: equal` to the parent node.",
        uk: "За замовчуванням шаблони ARIA snapshot використовують часткове (підмножинне) збігання. Перераховуєш лише ті елементи що хочеш перевірити — будь-які додаткові елементи на сторінці мовчки ігноруються. Це дозволяє писати сфокусовані assertions. Щоб перейти до точного збігання (ніяких незазначених нащадків), додай `/children: equal` до батьківського вузла.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What is the key difference between ARIA snapshot testing and visual screenshot testing?",
        uk: "Яка ключова відмінність між ARIA snapshot тестуванням і візуальним скріншот тестуванням?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "ARIA snapshots are faster because they skip rendering; screenshot tests require a real browser",
            uk: "ARIA snapshots швидші бо пропускають рендеринг; скріншот тести вимагають реального браузера",
          },
        },
        {
          id: "b",
          label: {
            en: "ARIA snapshots check semantic structure and accessibility; screenshot tests check visual pixel output. ARIA snapshots survive CSS/layout refactors; screenshots break on any visual change",
            uk: "ARIA snapshots перевіряють семантичну структуру і доступність; скріншот тести перевіряють візуальний піксельний вивід. ARIA snapshots переживають CSS/layout рефакторинг; скріншоти ламаються при будь-якій візуальній зміні",
          },
        },
        {
          id: "c",
          label: {
            en: "Screenshot tests are more reliable because they capture exactly what the user sees",
            uk: "Скріншот тести надійніші бо фіксують саме те що бачить користувач",
          },
        },
        {
          id: "d",
          label: {
            en: "ARIA snapshots work across all browsers; screenshot tests are Chromium-only",
            uk: "ARIA snapshots працюють у всіх браузерах; скріншот тести тільки для Chromium",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "ARIA snapshots capture semantic structure (roles, names, states) — the same view a screen reader sees. Screenshot tests capture exact pixel output. A button that moves 2px to the right will break a screenshot test but not an ARIA snapshot. Conversely, a button whose accessible name changes from 'Delete' to 'Remove' will break an ARIA snapshot but might not be caught by a screenshot test if the visual looks identical.",
        uk: "ARIA snapshots фіксують семантичну структуру (ролі, назви, стани) — той самий вигляд що бачить screen reader. Скріншот тести фіксують точний піксельний вивід. Кнопка що зсунулася на 2px вправо зламає скріншот тест але не ARIA snapshot. Навпаки, кнопка чия доступна назва змінилася з 'Delete' на 'Remove' зламає ARIA snapshot але може не бути виявлена скріншот тестом якщо вигляд ідентичний.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You can scope an ARIA snapshot assertion to a specific part of the page. Which call checks only the 'Actions' region instead of the whole page?",
        uk: "Можна обмежити ARIA snapshot assertion до конкретної частини сторінки. Який виклик перевіряє лише регіон 'Actions' замість всієї сторінки?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await expect(page).toMatchAriaSnapshot('region Actions')",
            uk: "await expect(page).toMatchAriaSnapshot('region Actions')",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(page.getByRole('region', { name: 'Actions' })).toMatchAriaSnapshot(`- button \"Approve order\"`)",
            uk: "await expect(page.getByRole('region', { name: 'Actions' })).toMatchAriaSnapshot(`- button \"Approve order\"`)",
          },
        },
        {
          id: "c",
          label: {
            en: "await expect(page).toMatchAriaSnapshot({ scope: 'Actions' })",
            uk: "await expect(page).toMatchAriaSnapshot({ scope: 'Actions' })",
          },
        },
        {
          id: "d",
          label: {
            en: "Scoping is not supported — toMatchAriaSnapshot always checks the entire page",
            uk: "Scoping не підтримується — toMatchAriaSnapshot завжди перевіряє всю сторінку",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "You can pass any locator to `expect()` before calling `toMatchAriaSnapshot()`. The snapshot is then taken from that locator's subtree only. Using `page.getByRole('region', { name: 'Actions' })` scopes the assertion to just the Actions region, making the test more focused and resilient to changes in other parts of the page.",
        uk: "Можна передати будь-який локатор до `expect()` перед викликом `toMatchAriaSnapshot()`. Snapshot тоді береться лише з піддерева того локатора. Використання `page.getByRole('region', { name: 'Actions' })` обмежує assertion лише регіоном Actions, роблячи тест більш сфокусованим і стійким до змін в інших частинах сторінки.",
      },
    },
  ],
}
