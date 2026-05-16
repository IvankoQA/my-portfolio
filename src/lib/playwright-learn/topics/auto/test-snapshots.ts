import type { PlaywrightTopic } from "../../types"

export const testSnapshotsTopic: PlaywrightTopic = {
  slug: "test-snapshots",
  groupId: "test-runner",
  order: 375,
  level: "advanced",
  trackOrder: 1,
  sourceDoc: "test-snapshots-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-snapshots",
  title: {
    en: "Visual comparisons",
    uk: "Візуальні порівняння",
  },
  summary: {
    en: "Visual snapshot testing: first run generates the reference, every run after compares pixel-by-pixel. I use it for catching accidental CSS regressions — a layout that looks fine in code but breaks visually. The main challenge is flakiness from dynamic content like timestamps and ads — mask those with stylePath or mask option.",
    uk: "Візуальне snapshot-тестування: перший запуск генерує еталон, кожен наступний порівнює піксель за пікселем. Я використовую це для ловіння випадкових CSS-регресій — верстки що виглядає нормально в коді але ламається візуально. Головна проблема — нестабільність через динамічний контент типу часових міток і реклами — маскуй їх через stylePath або mask.",
  },
  sections: [
    {
      id: "how-it-works",
      title: {
        en: "How screenshot comparison works",
        uk: "Як працює порівняння скриншотів",
      },
      diagram: {
        mermaid: `flowchart TD
  R1["First run"] --> NR{"reference\nexists?"}
  NR -->|"no"| GEN["generate reference PNG\n(test fails — expected)"]
  GEN --> COM["commit reference file"]
  NR -->|"yes"| SS["take screenshot"]
  SS --> CMP{"pixel diff\nwithin threshold?"}
  CMP -->|"yes"| P["✓ test passes"]
  CMP -->|"no"| F["✗ test fails\n(show diff image)"]`,
        caption: {
          en: "First run always fails and generates the reference — commit that file, subsequent runs compare against it",
          uk: "Перший запуск завжди падає і генерує еталон — закомітьте цей файл, наступні запуски порівнюють з ним",
        },
      },
      paragraphs: [
        {
          en: "First run: no reference exists, so Playwright generates it and writes the file to disk. The test fails on the first run — that's expected. Commit the generated file. Every run after that: Playwright takes a fresh screenshot and compares it pixel-by-pixel to the saved reference.",
          uk: "Перший запуск: еталону немає, тому Playwright генерує його і записує файл на диск. Тест падає при першому запуску — це очікувано. Закомить згенерований файл. Кожен наступний запуск: Playwright робить свіжий скриншот і порівнює його піксель за пікселем зі збереженим еталоном.",
        },
        {
          en: "Screenshot files are named with browser and OS in the name: `orders-page-1-chromium-darwin.png`. That's because rendering differs between browsers and platforms — you need separate references for each. If you run tests on Linux CI but generate references on macOS, the comparison will fail.",
          uk: "Файли скриншотів іменуються з браузером і ОС: `orders-page-1-chromium-darwin.png`. Це тому що рендеринг відрізняється між браузерами й платформами — потрібні окремі еталони для кожного. Якщо запускаєш тести на Linux CI але генеруєш еталони на macOS — порівняння падатиме.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-snapshot",
          language: "ts",
          code: `test('orders page looks correct', async ({ page }) => {
  await page.goto('/orders')
  await page.waitForLoadState('networkidle')

  // Порівняти весь page
  await expect(page).toHaveScreenshot()

  // Або з явним іменем (рекомендую — легше знайти файл)
  await expect(page).toHaveScreenshot('orders-page.png')
})

test('order card component', async ({ page }) => {
  await page.goto('/orders/42')

  // Порівняти тільки конкретний елемент
  const card = page.getByTestId('order-card')
  await expect(card).toHaveScreenshot('order-card.png')
})`,
        },
      ],
    },
    {
      id: "generating-and-updating",
      title: {
        en: "Generating and updating references",
        uk: "Генерація і оновлення еталонів",
      },
      paragraphs: [
        {
          en: "When the page design changes intentionally, you need to update the reference. Use `--update-snapshots` to regenerate all references. Review the diff in git before committing — this is the checkpoint where you confirm the change is intentional.",
          uk: "Коли дизайн сторінки змінюється навмисно — потрібно оновити еталон. Використовуй `--update-snapshots` щоб перегенерувати всі еталони. Переглянь diff в git перед комітом — це контрольна точка де ти підтверджуєш що зміна навмисна.",
        },
      ],
      codeBlocks: [
        {
          id: "update-snapshots",
          language: "bash",
          code: `# Перший запуск — згенерувати еталони
npx playwright test --update-snapshots

# Оновити еталон після навмисних змін дизайну
npx playwright test --update-snapshots orders.spec.ts

# Переглянути що змінилося
git diff tests/orders.spec.ts-snapshots/`,
        },
      ],
    },
    {
      id: "tolerance",
      title: {
        en: "Tolerance — allow minor pixel differences",
        uk: "Толерантність — дозволяти мінімальні відмінності",
      },
      paragraphs: [
        {
          en: "Anti-aliasing, font rendering, and subpixel differences cause minor pixel variations between runs. I set `maxDiffPixelRatio: 0.01` globally — allows 1% of pixels to differ without failing. For individual assertions I use `maxDiffPixels` when a specific component is known to have micro-rendering differences.",
          uk: "Антиаліасинг, рендеринг шрифтів і subpixel-відмінності спричиняють незначні варіації пікселів між запусками. Я встановлюю `maxDiffPixelRatio: 0.01` глобально — дозволяю 1% пікселів відрізнятися без падіння. Для окремих перевірок використовую `maxDiffPixels` коли конкретний компонент відомо має мікро-рендерингові відмінності.",
        },
      ],
      codeBlocks: [
        {
          id: "tolerance-config",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01, // допустити до 1% різниці пікселів
    },
  },
})`,
        },
        {
          id: "tolerance-per-test",
          language: "ts",
          code: `// Або для конкретної перевірки
await expect(page).toHaveScreenshot('dashboard.png', {
  maxDiffPixels: 100, // точна кількість пікселів що можуть відрізнятися
})`,
        },
      ],
    },
    {
      id: "mask-dynamic-content",
      title: {
        en: "Masking dynamic content — timestamps, avatars, ads",
        uk: "Маскування динамічного контенту — часові мітки, аватари, реклама",
      },
      paragraphs: [
        {
          en: "Dynamic content like timestamps, user avatars, or live counters will always differ between runs and make visual tests flaky. Two ways to handle it: `mask` option (Playwright overlays a colored box) or `stylePath` (inject CSS that hides elements).",
          uk: "Динамічний контент типу часових міток, аватарів юзерів або live-лічильників завжди буде відрізнятися між запусками і робить візуальні тести нестабільними. Два способи: опція `mask` (Playwright накладає кольоровий блок) або `stylePath` (вставити CSS що ховає елементи).",
        },
      ],
      codeBlocks: [
        {
          id: "mask",
          language: "ts",
          code: `test('order list - visual', async ({ page }) => {
  await page.goto('/orders')

  // Маскувати елементи що змінюються між запусками
  await expect(page).toHaveScreenshot('orders.png', {
    mask: [
      page.getByTestId('created-at-column'),   // часові мітки
      page.getByTestId('user-avatar'),          // аватари
      page.getByTestId('live-counter'),         // лічильники
    ],
  })
})`,
        },
        {
          id: "style-path",
          language: "css",
          code: `/* screenshot.css — ховати dynamic елементи глобально */
[data-testid="created-at-column"],
[data-testid="user-avatar"],
.ad-banner,
.live-indicator {
  visibility: hidden !important;
}`,
        },
        {
          id: "style-path-config",
          language: "ts",
          code: `// playwright.config.ts — застосувати CSS до всіх snapshot-тестів
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      stylePath: './screenshot.css',
    },
  },
})`,
        },
      ],
    },
    {
      id: "text-snapshots",
      title: {
        en: "Text snapshots — compare API responses and text content",
        uk: "Текстові знімки — порівняти API-відповіді і текстовий контент",
      },
      paragraphs: [
        {
          en: "Beyond screenshots, `toMatchSnapshot()` works for any text or binary data. I use it for API response structure snapshots — when I want to catch unexpected field changes in an endpoint response.",
          uk: "Крім скриншотів, `toMatchSnapshot()` працює для будь-якого тексту чи бінарних даних. Я використовую це для snapshot-ів структури API-відповідей — коли хочу ловити несподівані зміни полів у відповіді ендпоїнту.",
        },
      ],
      codeBlocks: [
        {
          id: "text-snapshot",
          language: "ts",
          code: `test('order page title snapshot', async ({ page }) => {
  await page.goto('/orders/42')
  const title = await page.getByRole('heading').textContent()
  expect(title).toMatchSnapshot('order-title.txt')
})

// Snapshot API-відповіді
test('orders API response structure', async ({ request }) => {
  const response = await request.get('/api/orders?limit=1')
  const body = await response.json()
  // Перший запуск збереже структуру; наступні будуть порівнювати
  expect(JSON.stringify(body, null, 2)).toMatchSnapshot('orders-api.json')
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You run `npx playwright test` and a visual test fails with: 'snapshot doesn't exist, writing actual'. What should you do?",
        uk: "Ти запускаєш `npx playwright test` і візуальний тест падає з помилкою: 'snapshot doesn't exist, writing actual'. Що потрібно зробити?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "This is a bug — fix the test so it doesn't fail on first run",
            uk: "Це баг — виправи тест щоб він не падав при першому запуску",
          },
        },
        {
          id: "b",
          label: {
            en: "Review the generated screenshot, then commit it — this is the expected first-run behavior",
            uk: "Перевір згенерований скриншот, потім закомить його — це очікувана поведінка першого запуску",
          },
        },
        {
          id: "c",
          label: {
            en: "Run --update-snapshots to fix the failure",
            uk: "Запусти --update-snapshots щоб виправити падіння",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The first run always fails when no reference exists — Playwright writes the screenshot to disk and reports the missing snapshot as a failure. This is correct behavior. Review the generated file, confirm it looks right, then `git add` and commit it as your reference baseline. `--update-snapshots` does the same thing but is used when updating *existing* references after intentional design changes.",
        uk: "Перший запуск завжди падає коли еталону немає — Playwright записує скриншот на диск і повідомляє про відсутній snapshot як про падіння. Це правильна поведінка. Переглянь згенерований файл, переконайся що він виглядає правильно, потім `git add` і закомить його як базовий еталон. `--update-snapshots` робить те саме але використовується для оновлення *існуючих* еталонів після навмисних змін дизайну.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Visual tests fail intermittently on CI because the order list shows different timestamps on each run. What's the best fix?",
        uk: "Візуальні тести нестабільно падають на CI бо список замовлень показує різні часові мітки при кожному запуску. Яке найкраще виправлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Set maxDiffPixelRatio: 0.5 — allow 50% pixel difference to absorb the timestamp changes",
            uk: "Встановити maxDiffPixelRatio: 0.5 — дозволити 50% різниці пікселів щоб поглинути зміни часових міток",
          },
        },
        {
          id: "b",
          label: {
            en: "Mask the timestamp column using the mask option or hide it via screenshot.css",
            uk: "Замаскувати колонку часових міток через опцію mask або сховати через screenshot.css",
          },
        },
        {
          id: "c",
          label: {
            en: "Mock Date.now() so timestamps are always the same",
            uk: "Замокати Date.now() щоб часові мітки завжди були однакові",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Masking is the right tool: `mask: [page.getByTestId('timestamp')]` overlays a solid block over the element, so the pixel comparison ignores that area entirely. A large `maxDiffPixelRatio` is too coarse — it could hide real visual regressions. Mocking `Date.now()` might work but doesn't handle already-rendered timestamps or server-returned dates.",
        uk: "Маскування — правильний інструмент: `mask: [page.getByTestId('timestamp')]` накладає суцільний блок поверх елемента, тому порівняння пікселів повністю ігнорує цю область. Великий `maxDiffPixelRatio` занадто грубий — він може приховати реальні візуальні регресії. Мокати `Date.now()` може спрацювати але не обробляє вже відрендерені часові мітки або дати що повертає сервер.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the difference between `expect(page).toHaveScreenshot()` and `expect(locator).toHaveScreenshot()`?",
        uk: "В чому різниця між `expect(page).toHaveScreenshot()` і `expect(locator).toHaveScreenshot()`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "There is no difference — both capture the full page",
            uk: "Різниці немає — обидва захоплюють повну сторінку",
          },
        },
        {
          id: "b",
          label: {
            en: "`expect(page)` captures the full viewport; `expect(locator)` captures only the bounding box of that specific element",
            uk: "`expect(page)` захоплює весь viewport; `expect(locator)` захоплює лише bounding box конкретного елемента",
          },
        },
        {
          id: "c",
          label: {
            en: "`expect(locator)` is deprecated — always use `expect(page)`",
            uk: "`expect(locator)` застарілий — завжди використовуй `expect(page)`",
          },
        },
        {
          id: "d",
          label: {
            en: "`expect(page)` only works on the landing page; `expect(locator)` works anywhere",
            uk: "`expect(page)` працює тільки на головній сторінці; `expect(locator)` працює будь-де",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`expect(page).toHaveScreenshot()` captures the entire visible viewport and saves a full-page reference. `expect(locator).toHaveScreenshot()` clips the screenshot to exactly the element's bounding box — useful for component-level visual regression where you only care about one widget, not the surrounding layout.",
        uk: "`expect(page).toHaveScreenshot()` захоплює весь видимий viewport і зберігає повносторінковий еталон. `expect(locator).toHaveScreenshot()` обрізає скриншот до bounding box елемента — корисно для візуальної регресії на рівні компонента, коли важливий лише один віджет а не навколишній лейаут.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "Where does Playwright store generated screenshot reference files by default?",
        uk: "Де Playwright за замовчуванням зберігає згенеровані еталонні файли скриншотів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "In a `__snapshots__` folder inside the project root",
            uk: "У папці `__snapshots__` в кореневій директорії проекту",
          },
        },
        {
          id: "b",
          label: {
            en: "In a folder named `<testFile>-snapshots` next to the test file",
            uk: "У папці `<testFile>-snapshots` поруч з файлом тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "In the `test-results` directory alongside trace and video files",
            uk: "У директорії `test-results` поруч з трейсами і відео",
          },
        },
        {
          id: "d",
          label: {
            en: "In a `.playwright/screenshots` hidden folder",
            uk: "У прихованій папці `.playwright/screenshots`",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright creates a snapshot directory named after the spec file with a `-snapshots` suffix, placed alongside the test file. For example, `tests/orders.spec.ts` generates references in `tests/orders.spec.ts-snapshots/`. The filename also encodes browser and OS: `orders-page-1-chromium-darwin.png`. This keeps references co-located with their tests and makes it easy to see diffs in git.",
        uk: "Playwright створює директорію snapshot з назвою файлу spec і суфіксом `-snapshots`, розміщену поруч з файлом тесту. Наприклад `tests/orders.spec.ts` генерує еталони в `tests/orders.spec.ts-snapshots/`. Назва файлу також кодує браузер і ОС: `orders-page-1-chromium-darwin.png`. Це тримає еталони поруч з тестами і дозволяє легко бачити diff в git.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You intentionally updated the checkout page design. How do you update the visual references so tests stop failing?",
        uk: "Ти навмисно оновив дизайн сторінки оформлення замовлення. Як оновити візуальні еталони щоб тести перестали падати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Delete the snapshot directory and re-run tests — they will regenerate automatically",
            uk: "Видалити директорію snapshot і перезапустити тести — вони перегенеруються автоматично",
          },
        },
        {
          id: "b",
          label: {
            en: "Run `npx playwright test --update-snapshots` to regenerate reference screenshots",
            uk: "Запустити `npx playwright test --update-snapshots` щоб перегенерувати еталонні скриншоти",
          },
        },
        {
          id: "c",
          label: {
            en: "Increase `maxDiffPixelRatio` to absorb the visual differences",
            uk: "Збільшити `maxDiffPixelRatio` щоб поглинути візуальні відмінності",
          },
        },
        {
          id: "d",
          label: {
            en: "Rename the snapshot files to force Playwright to treat them as new references",
            uk: "Перейменувати файли snapshot щоб змусити Playwright вважати їх новими еталонами",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`--update-snapshots` is the official flag for regenerating references after intentional design changes. After running it, review the diff in git to confirm only the expected changes are present before committing. Deleting the folder also works but is more error-prone. Raising `maxDiffPixelRatio` is wrong — it would permanently lower your visual regression sensitivity, masking future accidental regressions.",
        uk: "`--update-snapshots` — офіційний прапорець для перегенерації еталонів після навмисних змін дизайну. Після запуску перегляд diff в git підтверджує що присутні тільки очікувані зміни перед комітом. Видалення папки теж спрацює але більш схильне до помилок. Підвищення `maxDiffPixelRatio` неправильне — це постійно знизить чутливість до візуальних регресій, приховуючи майбутні випадкові регресії.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What does `maxDiffPixels: 100` do when passed to `toHaveScreenshot()`?",
        uk: "Що робить `maxDiffPixels: 100` коли передається в `toHaveScreenshot()`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It scales the comparison to only check 100 pixels sampled randomly",
            uk: "Він масштабує порівняння щоб перевіряти лише 100 випадково вибраних пікселів",
          },
        },
        {
          id: "b",
          label: {
            en: "It allows up to 100 individual pixels to differ between the screenshot and reference before the assertion fails",
            uk: "Він дозволяє до 100 окремих пікселів відрізнятися між скриншотом і еталоном до провалу assertion",
          },
        },
        {
          id: "c",
          label: {
            en: "It sets the image resolution to 100 DPI for comparison",
            uk: "Він встановлює роздільну здатність зображення 100 DPI для порівняння",
          },
        },
        {
          id: "d",
          label: {
            en: "It limits comparison to the first 100 pixels of the screenshot",
            uk: "Він обмежує порівняння першими 100 пікселями скриншоту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`maxDiffPixels` sets an absolute pixel count threshold. If the number of differing pixels between the fresh screenshot and the stored reference exceeds that number, the assertion fails. Use `maxDiffPixels` when you know a specific component has minor rendering noise (e.g. anti-aliased borders). Use `maxDiffPixelRatio` (a percentage, like `0.01` for 1%) when you want a relative tolerance that scales with image size.",
        uk: "`maxDiffPixels` встановлює абсолютний поріг кількості пікселів. Якщо кількість пікселів що відрізняються між новим скриншотом і збереженим еталоном перевищує це число — assertion падає. Використовуй `maxDiffPixels` коли знаєш що конкретний компонент має незначний рендеринговий шум (наприклад згладжені межі). Використовуй `maxDiffPixelRatio` (відсоток, як `0.01` для 1%) коли хочеш відносний допуск що масштабується з розміром зображення.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "A test captures a screenshot named `dashboard.png`. What does the actual filename on disk look like on a macOS machine running Chromium?",
        uk: "Тест захоплює скриншот з назвою `dashboard.png`. Як виглядає фактичне ім'я файлу на диску на машині з macOS що запускає Chromium?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "`dashboard.png` — the name is used exactly as given",
            uk: "`dashboard.png` — назва використовується точно як задано",
          },
        },
        {
          id: "b",
          label: {
            en: "`dashboard-chromium-darwin.png` — browser and OS are appended automatically",
            uk: "`dashboard-chromium-darwin.png` — браузер і ОС додаються автоматично",
          },
        },
        {
          id: "c",
          label: {
            en: "`dashboard-1.png` — a run counter is always appended",
            uk: "`dashboard-1.png` — лічильник запусків завжди додається",
          },
        },
        {
          id: "d",
          label: {
            en: "`dashboard-snap.png` — Playwright adds a `-snap` suffix to distinguish references from regular images",
            uk: "`dashboard-snap.png` — Playwright додає суфікс `-snap` щоб відрізнити еталони від звичайних зображень",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright appends the browser name and operating system to every screenshot reference filename. So `dashboard.png` becomes `dashboard-chromium-darwin.png` on macOS with Chromium, and `dashboard-chromium-linux.png` on Linux CI. This is essential because font rendering, anti-aliasing, and color profiles differ by platform — the same page can look pixel-different on macOS vs Linux even with identical code.",
        uk: "Playwright додає назву браузера і операційну систему до кожного еталонного файлу скриншоту. Тому `dashboard.png` стає `dashboard-chromium-darwin.png` на macOS з Chromium і `dashboard-chromium-linux.png` на Linux CI. Це важливо бо рендеринг шрифтів, антиаліасинг і колірні профілі відрізняються залежно від платформи — одна й та ж сторінка може виглядати по-різному в пікселях на macOS проти Linux навіть з ідентичним кодом.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want to hide a live chat widget globally across all visual tests without adding a `mask` option to every individual assertion. What is the recommended approach?",
        uk: "Ти хочеш приховати live chat віджет глобально у всіх візуальних тестах без додавання опції `mask` до кожного окремого assertion. Який рекомендований підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add `mask: [page.locator('.live-chat')]` to every `toHaveScreenshot()` call",
            uk: "Додати `mask: [page.locator('.live-chat')]` до кожного виклику `toHaveScreenshot()`",
          },
        },
        {
          id: "b",
          label: {
            en: "Create a `screenshot.css` file that hides the widget and reference it via `stylePath` in `playwright.config.ts`",
            uk: "Створити файл `screenshot.css` що приховує віджет і посилатися на нього через `stylePath` у `playwright.config.ts`",
          },
        },
        {
          id: "c",
          label: {
            en: "Use `beforeEach` to click the close button on the chat widget before every test",
            uk: "Використати `beforeEach` щоб клікати кнопку закриття chat-віджета перед кожним тестом",
          },
        },
        {
          id: "d",
          label: {
            en: "Disable the chat widget feature flag in the environment config for all test runs",
            uk: "Вимкнути feature flag chat-віджета в конфігурації середовища для всіх тестових запусків",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `stylePath` option in `playwright.config.ts` under `expect.toHaveScreenshot` injects a CSS file into every page before taking a screenshot. A `screenshot.css` with `visibility: hidden !important` for the widget selector hides it globally with zero changes to individual tests. This is the cleanest approach when you have multiple dynamic elements to suppress across the entire test suite.",
        uk: "Опція `stylePath` у `playwright.config.ts` під `expect.toHaveScreenshot` впроваджує CSS-файл у кожну сторінку перед зйомкою скриншоту. `screenshot.css` з `visibility: hidden !important` для селектора віджета приховує його глобально без жодних змін в окремих тестах. Це найчистіший підхід коли є кілька динамічних елементів для придушення в усьому тестовому наборі.",
      },
    },
  ],
}
