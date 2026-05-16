import type { PlaywrightTopic } from "../../types"

export const accessibilityTestingTopic: PlaywrightTopic = {
  slug: "accessibility-testing",
  groupId: "guides",
  order: 100,
  level: "intermediate",
  trackOrder: 25,
  sourceDoc: "accessibility-testing-js.md",
  officialDocsUrl: "https://playwright.dev/docs/accessibility-testing",
  title: {
    en: "Accessibility testing",
    uk: "Тестування доступності",
  },
  summary: {
    en: "axe-core integrated with Playwright runs automated WCAG checks in 3 lines of code. I add it to every page-level test — it catches missing labels, contrast issues, and duplicate IDs before they reach production.",
    uk: "axe-core інтегрований з Playwright запускає автоматичні WCAG перевірки за 3 рядки коду. Я додаю це до кожного тесту на рівні сторінки — воно ловить відсутні підписи, проблеми контрасту і дубльовані ID до того як вони потрапляють в прод.",
  },
  sections: [
    {
      id: "setup",
      title: {
        en: "Install axe-core",
        uk: "Встановлення axe-core",
      },
      paragraphs: [
        {
          en: "Playwright doesn't include accessibility scanning out of the box — you need the `@axe-core/playwright` package. axe-core is the most widely used automated accessibility engine. It catches ~57% of WCAG issues automatically — the rest require manual review.",
          uk: "Playwright не включає сканування доступності з коробки — потрібен пакет `@axe-core/playwright`. axe-core — найпоширеніший автоматичний рушій доступності. Він ловить ~57% проблем WCAG автоматично — решта вимагає ручної перевірки.",
        },
      ],
      codeBlocks: [
        {
          id: "install",
          language: "bash",
          code: `npm install --save-dev @axe-core/playwright`,
        },
        {
          id: "basic-scan",
          language: "ts",
          code: `import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('dashboard has no accessibility violations', async ({ page }) => {
  await page.goto('/dashboard')

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})`,
        },
      ],
    },
    {
      id: "scan-scope",
      title: {
        en: "Scan the whole page or a specific component",
        uk: "Сканування всієї сторінки або конкретного компонента",
      },
      paragraphs: [
        {
          en: "By default `AxeBuilder.analyze()` scans the entire page. If you only care about a specific region — a modal, a form, a nav — use `.include()`. This is useful when you're adding accessibility tests incrementally and don't want violations from other parts of the page to block you.",
          uk: "За замовчуванням `AxeBuilder.analyze()` сканує всю сторінку. Якщо тебе цікавить лише конкретна область — модальне вікно, форма, навігація — використовуй `.include()`. Корисно коли додаєш тести доступності поступово і не хочеш щоб порушення з інших частин сторінки тебе блокували.",
        },
        {
          en: "Important: if you're scanning a UI state that appears after user interaction (a dropdown, a modal), trigger that state before calling `analyze()`.",
          uk: "Важливо: якщо скануєш стан UI що з'являється після взаємодії (dropdown, модальне), спершу активуй цей стан і лише потім виклич `analyze()`.",
        },
      ],
      codeBlocks: [
        {
          id: "scope-example",
          language: "ts",
          code: `test('create order form is accessible', async ({ page }) => {
  await page.goto('/orders')

  // Відкриваємо форму — вона з'явиться в DOM
  await page.getByRole('button', { name: 'Create order' }).click()
  await page.getByRole('dialog').waitFor()

  // Скануємо лише форму, не всю сторінку
  const results = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .analyze()

  expect(results.violations).toEqual([])
})

test('navigation is accessible', async ({ page }) => {
  await page.goto('/dashboard')

  const results = await new AxeBuilder({ page })
    .include('nav')
    .analyze()

  expect(results.violations).toEqual([])
})`,
        },
      ],
    },
    {
      id: "wcag-tags",
      title: {
        en: "Target specific WCAG criteria",
        uk: "Цільові критерії WCAG",
      },
      paragraphs: [
        {
          en: "By default axe runs all its rules — some are WCAG requirements, others are best practices. If your project has an accessibility conformance target (e.g. WCAG 2.1 AA), filter to those specific tags. This makes failures meaningful and actionable rather than \"best practice\" noise.",
          uk: "За замовчуванням axe запускає всі свої правила — частина з них вимоги WCAG, інші — кращі практики. Якщо твій проєкт має ціль відповідності (наприклад WCAG 2.1 AA) — фільтруй за конкретними тегами. Це робить падіння значущими і actionable, а не шумом «кращих практик».",
        },
      ],
      codeBlocks: [
        {
          id: "wcag-tags",
          language: "ts",
          code: `test('meets WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/orders')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

  expect(results.violations).toEqual([])
})`,
        },
      ],
    },
    {
      id: "handling-known-issues",
      title: {
        en: "Handle known violations",
        uk: "Відомі порушення",
      },
      paragraphs: [
        {
          en: "When adding accessibility tests to an existing app, you'll find violations you can't fix immediately. Two options: exclude the element, or disable the specific rule. Don't suppress blindly — document why each suppression exists and when it should be fixed.",
          uk: "Коли додаєш тести доступності до існуючого застосунку — знайдеш порушення які не можеш виправити одразу. Два варіанти: виключити елемент або вимкнути конкретне правило. Не пригнічуй сліпо — документуй чому кожне придушення існує і коли має бути виправлене.",
        },
      ],
      codeBlocks: [
        {
          id: "known-issues",
          language: "ts",
          code: `// Виключити проблемний елемент зі сканування
test('dashboard accessible except legacy widget', async ({ page }) => {
  await page.goto('/dashboard')

  const results = await new AxeBuilder({ page })
    .exclude('#legacy-chart-widget') // TODO: fix Q3 2026 — tracked in #1234
    .analyze()

  expect(results.violations).toEqual([])
})

// Вимкнути конкретне правило
test('orders page accessible', async ({ page }) => {
  await page.goto('/orders')

  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast']) // TODO: update design tokens
    .analyze()

  expect(results.violations).toEqual([])
})`,
        },
      ],
    },
    {
      id: "axe-fixture",
      title: {
        en: "Shared axe configuration via fixture",
        uk: "Спільна конфігурація через fixture",
      },
      paragraphs: [
        {
          en: "When the same axe configuration (same WCAG tags, same exclusions) repeats across many tests — extract it into a fixture. This keeps configuration in one place and makes tests cleaner.",
          uk: "Коли одна і та сама конфігурація axe (ті самі WCAG теги, ті самі виключення) повторюється в багатьох тестах — виніс її у fixture. Це тримає конфігурацію в одному місці і робить тести чистішими.",
        },
      ],
      codeBlocks: [
        {
          id: "axe-fixture",
          language: "ts",
          code: `// fixtures/axe.ts
import { test as base, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

type AxeFixture = {
  makeAxeBuilder: () => AxeBuilder
}

export const test = base.extend<AxeFixture>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () =>
      new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .exclude('#legacy-chart-widget')

    await use(makeAxeBuilder)
  },
})

export { expect }

// В тестах
import { test, expect } from '../fixtures/axe'

test('login page is accessible', async ({ page, makeAxeBuilder }) => {
  await page.goto('/login')
  const results = await makeAxeBuilder().analyze()
  expect(results.violations).toEqual([])
})

test('dashboard accessible with form open', async ({ page, makeAxeBuilder }) => {
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Create order' }).click()

  // Додаткова конфігурація поверх спільної
  const results = await makeAxeBuilder()
    .include('[role="dialog"]')
    .analyze()

  expect(results.violations).toEqual([])
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want to scan only the navigation menu for accessibility issues, not the whole page. What do you use?",
        uk: "Хочеш просканувати лише меню навігації, не всю сторінку. Що використовуєш?",
      },
      options: [
        { id: "a", label: { en: "new AxeBuilder({ page }).include('nav').analyze()", uk: "new AxeBuilder({ page }).include('nav').analyze()" } },
        { id: "b", label: { en: "new AxeBuilder({ page }).exclude('main').analyze()", uk: "new AxeBuilder({ page }).exclude('main').analyze()" } },
        { id: "c", label: { en: "page.locator('nav').analyze()", uk: "page.locator('nav').analyze()" } },
        { id: "d", label: { en: "new AxeBuilder({ page }).scope('nav').analyze()", uk: "new AxeBuilder({ page }).scope('nav').analyze()" } },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`.include()` scopes the scan to only the matching element and its descendants. `.exclude()` removes an element but still scans everything else. `page.locator().analyze()` doesn't exist — axe runs through AxeBuilder, not locators. There is no `.scope()` method.",
        uk: "`.include()` обмежує сканування лише відповідним елементом і його нащадками. `.exclude()` видаляє елемент але сканує все інше. `page.locator().analyze()` не існує — axe запускається через AxeBuilder, а не локатори. Методу `.scope()` немає.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Which npm package provides the axe-core integration for Playwright?",
        uk: "Який npm-пакет забезпечує інтеграцію axe-core з Playwright?",
      },
      options: [
        { id: "a", label: { en: "`axe-playwright`", uk: "`axe-playwright`" } },
        { id: "b", label: { en: "`playwright-axe`", uk: "`playwright-axe`" } },
        { id: "c", label: { en: "`@axe-core/playwright`", uk: "`@axe-core/playwright`" } },
        { id: "d", label: { en: "`@playwright/axe`", uk: "`@playwright/axe`" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "The correct package is `@axe-core/playwright`. It's maintained by Deque Systems (the axe-core authors) and provides the `AxeBuilder` class that integrates directly with Playwright's `Page` object.",
        uk: "Правильний пакет — `@axe-core/playwright`. Його підтримує Deque Systems (автори axe-core) і він надає клас `AxeBuilder`, що інтегрується безпосередньо з об'єктом `Page` Playwright.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Approximately what percentage of WCAG issues does axe-core catch automatically?",
        uk: "Приблизно який відсоток проблем WCAG axe-core знаходить автоматично?",
      },
      options: [
        { id: "a", label: { en: "~20%", uk: "~20%" } },
        { id: "b", label: { en: "~57%", uk: "~57%" } },
        { id: "c", label: { en: "~80%", uk: "~80%" } },
        { id: "d", label: { en: "~100%", uk: "~100%" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "axe-core catches approximately 57% of WCAG issues automatically. The remaining ~43% require human judgment — things like whether the visual design communicates meaning effectively, or whether error messages are clear to a user with cognitive disabilities.",
        uk: "axe-core знаходить приблизно 57% проблем WCAG автоматично. Решта ~43% вимагають людського судження — наприклад чи візуальний дизайн ефективно передає зміст, чи повідомлення про помилки зрозумілі користувачеві з когнітивними вадами.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You need to scan a modal dialog for accessibility issues, but the modal only appears after clicking a button. In what order must you perform these actions?",
        uk: "Потрібно просканувати модальне вікно на доступність, але воно з'являється лише після натискання кнопки. В якому порядку потрібно виконати ці дії?",
      },
      options: [
        { id: "a", label: { en: "Call `analyze()` first, then click the button to open the modal.", uk: "Спочатку викликати `analyze()`, потім клікнути кнопку щоб відкрити модальне вікно." } },
        { id: "b", label: { en: "Click the button to open the modal, wait for it to appear, then call `analyze()`.", uk: "Клікнути кнопку щоб відкрити модальне вікно, дочекатися появи, потім викликати `analyze()`." } },
        { id: "c", label: { en: "Call `analyze()` on page load — axe scans all possible UI states automatically.", uk: "Викликати `analyze()` при завантаженні сторінки — axe автоматично сканує всі можливі стани UI." } },
        { id: "d", label: { en: "Use `.include('[role=\"dialog\"]')` without opening the dialog — it finds hidden elements too.", uk: "Використати `.include('[role=\"dialog\"]')` без відкриття діалогу — він знаходить приховані елементи теж." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "axe-core scans the DOM as it currently exists, not all possible states. You must trigger the UI state (click the button, wait for the modal to appear) before calling `analyze()`. Scanning before the modal opens means axe won't find it in the DOM.",
        uk: "axe-core сканує DOM у поточному стані, а не всі можливі стани. Потрібно активувати стан UI (клікнути кнопку, дочекатися появи модального вікна) перед викликом `analyze()`. Сканування до появи модального вікна означає що axe не знайде його в DOM.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "Your project has an accessibility conformance target of WCAG 2.1 AA. Which `.withTags()` call matches this target?",
        uk: "Твій проєкт має ціль відповідності WCAG 2.1 AA. Який виклик `.withTags()` відповідає цій цілі?",
      },
      options: [
        { id: "a", label: { en: "`.withTags(['wcag21aa'])`", uk: "`.withTags(['wcag21aa'])`" } },
        { id: "b", label: { en: "`.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])`", uk: "`.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])`" } },
        { id: "c", label: { en: "`.withTags(['aa'])`", uk: "`.withTags(['aa'])`" } },
        { id: "d", label: { en: "`.withTags(['wcag2', 'wcag21'])`", uk: "`.withTags(['wcag2', 'wcag21'])`" } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "WCAG 2.1 AA includes all criteria from WCAG 2.0 A (`wcag2a`), WCAG 2.0 AA (`wcag2aa`), WCAG 2.1 A (`wcag21a`), and WCAG 2.1 AA (`wcag21aa`). You must include all four tag levels because AA conformance requires meeting all A criteria too.",
        uk: "WCAG 2.1 AA включає всі критерії з WCAG 2.0 A (`wcag2a`), WCAG 2.0 AA (`wcag2aa`), WCAG 2.1 A (`wcag21a`) та WCAG 2.1 AA (`wcag21aa`). Потрібно включити всі чотири рівні тегів, бо відповідність AA вимагає дотримання і всіх критеріїв A.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You find a known color-contrast violation in a third-party component you cannot change yet. How do you prevent it from failing tests while tracking it for future fixing?",
        uk: "Знайшов відоме порушення контрасту кольорів у сторонньому компоненті який поки не можеш змінити. Як запобігти падінню тестів і при цьому відстежити для майбутнього виправлення?",
      },
      options: [
        { id: "a", label: { en: "Remove the test entirely until the component is fixed.", uk: "Повністю видалити тест до виправлення компонента." } },
        { id: "b", label: { en: "Use `.disableRules(['color-contrast'])` with a comment explaining why and when it should be fixed.", uk: "Використати `.disableRules(['color-contrast'])` з коментарем що пояснює чому і коли це має бути виправлено." } },
        { id: "c", label: { en: "Mark the test with `test.skip()` permanently.", uk: "Позначити тест як `test.skip()` назавжди." } },
        { id: "d", label: { en: "Set `expect(results.violations).toHaveLength(1)` as an assertion instead.", uk: "Замінити асерт на `expect(results.violations).toHaveLength(1)`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`.disableRules()` suppresses specific axe rules without removing the test. Adding a comment (and ideally a ticket reference) documents that this is a known, tracked issue — not a forgotten suppression. This keeps the test running and checking everything else while the known violation is addressed.",
        uk: "`.disableRules()` пригнічує конкретні правила axe без видалення тесту. Коментар (і в ідеалі посилання на тікет) документує що це відома відстежувана проблема — а не забуте придушення. Тест продовжує виконуватись і перевіряти всі інші речі поки відоме порушення вирішується.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What is the benefit of extracting shared axe configuration into a fixture?",
        uk: "Яка перевага виносу спільної конфігурації axe у fixture?",
      },
      options: [
        { id: "a", label: { en: "Fixtures make tests run in parallel automatically.", uk: "Fixtures автоматично запускають тести паралельно." } },
        { id: "b", label: { en: "The shared configuration (WCAG tags, exclusions) lives in one place — tests stay clean and configuration changes require editing only the fixture.", uk: "Спільна конфігурація (WCAG теги, виключення) в одному місці — тести залишаються чистими а зміни конфігурації потребують редагування лише fixture." } },
        { id: "c", label: { en: "Fixtures cache axe scan results across tests to speed up the suite.", uk: "Fixtures кешують результати сканування axe між тестами для прискорення сьюту." } },
        { id: "d", label: { en: "axe-core requires a fixture to function; it cannot be called directly in tests.", uk: "axe-core вимагає fixture для роботи; не може викликатися безпосередньо в тестах." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A `makeAxeBuilder` fixture keeps the WCAG tags, excluded elements, and disabled rules in a single file. Every test that uses it automatically gets the project-wide configuration. Individual tests can still chain additional `.include()` or `.disableRules()` calls on top — the fixture sets the baseline, tests specialize.",
        uk: "Fixture `makeAxeBuilder` тримає WCAG теги, виключені елементи і відключені правила в одному файлі. Кожен тест що використовує її автоматично отримує проєктну конфігурацію. Окремі тести можуть доповнювати `.include()` або `.disableRules()` — fixture задає базовий рівень, тести спеціалізуються.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "What does `expect(results.violations).toEqual([])` assert?",
        uk: "Що перевіряє `expect(results.violations).toEqual([])`?",
      },
      options: [
        { id: "a", label: { en: "That the page has no elements with ARIA attributes.", uk: "Що на сторінці немає елементів з ARIA-атрибутами." } },
        { id: "b", label: { en: "That the axe scan found zero accessibility rule violations.", uk: "Що сканування axe знайшло нуль порушень правил доступності." } },
        { id: "c", label: { en: "That every interactive element has a `data-testid` attribute.", uk: "Що кожен інтерактивний елемент має атрибут `data-testid`." } },
        { id: "d", label: { en: "That the page's HTML validates against the W3C HTML spec.", uk: "Що HTML сторінки відповідає специфікації W3C HTML." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`results.violations` is an array of accessibility violations found by axe-core. Each entry contains the rule ID, impact level (minor/moderate/serious/critical), a description, and the affected DOM elements. `toEqual([])` asserts the array is empty — no violations were detected for the scanned rules.",
        uk: "`results.violations` — масив порушень доступності знайдених axe-core. Кожен запис містить ID правила, рівень впливу (minor/moderate/serious/critical), опис і уражені DOM-елементи. `toEqual([])` перевіряє що масив порожній — жодних порушень не знайдено для перевірених правил.",
      },
    },
  ],
}
