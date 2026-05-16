import type { PlaywrightTopic } from "../../types"

export const testingLibraryTopic: PlaywrightTopic = {
  slug: "testing-library",
  groupId: "guides",
  order: 405,
  level: "advanced",
  trackOrder: 29,
  sourceDoc: "testing-library-js.md",
  officialDocsUrl: "https://playwright.dev/docs/testing-library",
  title: {
    en: "Migrating from Testing Library",
    uk: "Міграція з Testing Library",
  },
  summary: {
    en: "If you know React Testing Library, the mental model carries over almost directly — getByRole, getByLabel, getByText, getByTestId all exist in Playwright too. The main differences: no more getBy/findBy/queryBy split (Playwright locators auto-wait), render() becomes mount(), screen becomes page or the component locator, and waitFor is usually replaced by a Playwright assertion.",
    uk: "Якщо знаєш React Testing Library — ментальна модель переноситься майже напряму: getByRole, getByLabel, getByText, getByTestId є і в Playwright. Головні відмінності: немає поділу getBy/findBy/queryBy (Playwright-локатори auto-wait), render() стає mount(), screen стає page або локатором компонента, а waitFor замінюється Playwright-assertion.",
  },
  sections: [
    {
      id: "mental-model",
      title: {
        en: "The mental model shift",
        uk: "Зміна ментальної моделі",
      },
      paragraphs: [
        {
          en: "In Testing Library there are three query variants:\n- `getBy*` — synchronous, throws if not found\n- `findBy*` — async, waits and retries\n- `queryBy*` — synchronous, returns null if not found\n\nIn Playwright **all locators are lazy** — they don't do anything until you call an action or assertion. When I call `.click()` or `expect(...).toBeVisible()`, Playwright auto-waits for the element to appear and be actionable. I never need to choose between the three variants.",
          uk: "У Testing Library три варіанти запитів:\n- `getBy*` — синхронний, кидає помилку якщо не знайдено\n- `findBy*` — async, чекає і повторює\n- `queryBy*` — синхронний, повертає null якщо не знайдено\n\nВ Playwright **всі локатори ліниві** — вони нічого не роблять поки не викличеш дію або assertion. Коли викликаю `.click()` або `expect(...).toBeVisible()` — Playwright auto-wait очікує поки елемент з'явиться і буде actionable. Ніколи не потрібно вибирати між трьома варіантами.",
        },
      ],
    },
    {
      id: "cheat-sheet",
      title: {
        en: "Quick reference",
        uk: "Швидка довідка",
      },
      paragraphs: [
        {
          en: "| Testing Library | Playwright |\n|---|---|\n| `screen` | `page` (e2e) або `component` (CT) |\n| `getBy*`, `findBy*`, `queryBy*` | `page.getBy*()` (всі однакові — auto-wait) |\n| `render(<Component />)` | `await mount(<Component />)` |\n| `const { unmount } = render(...)` | `const { unmount } = await mount(...)` |\n| `const { rerender } = render(...)` | `const { update } = await mount(...)` |\n| `within(element)` | `locator.locator(...)` (nested) |\n| `waitFor(() => expect(...))` | `await expect(...).toBeVisible()` |\n| `waitForElementToBeRemoved(...)` | `await expect(...).toBeHidden()` |\n| `user.click(el)` | `await locator.click()` |\n| `user.type(el, 'text')` | `await locator.fill('text')` |\n| `expect(el).toBeInTheDocument()` | `await expect(locator).toBeVisible()` |",
          uk: "| Testing Library | Playwright |\n|---|---|\n| `screen` | `page` (e2e) або `component` (CT) |\n| `getBy*`, `findBy*`, `queryBy*` | `page.getBy*()` (всі однакові — auto-wait) |\n| `render(<Component />)` | `await mount(<Component />)` |\n| `const { unmount } = render(...)` | `const { unmount } = await mount(...)` |\n| `const { rerender } = render(...)` | `const { update } = await mount(...)` |\n| `within(element)` | `locator.locator(...)` (вкладений) |\n| `waitFor(() => expect(...))` | `await expect(...).toBeVisible()` |\n| `waitForElementToBeRemoved(...)` | `await expect(...).toBeHidden()` |\n| `user.click(el)` | `await locator.click()` |\n| `user.type(el, 'text')` | `await locator.fill('text')` |\n| `expect(el).toBeInTheDocument()` | `await expect(locator).toBeVisible()` |",
        },
      ],
    },
    {
      id: "example-migration",
      title: {
        en: "Side by side example",
        uk: "Приклад поруч",
      },
      paragraphs: [
        {
          en: "A sign-in test migrated from React Testing Library to Playwright Component Testing:",
          uk: "Тест входу мігрований з React Testing Library на Playwright Component Testing:",
        },
      ],
      codeBlocks: [
        {
          id: "rtl-before",
          language: "ts",
          code: `// React Testing Library (до міграції)
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('sign in', async () => {
  const user = userEvent.setup()
  render(<SignInForm />)

  await user.type(screen.getByLabelText('Username'), 'John')
  await user.type(screen.getByLabelText('Password'), 'secret')
  await user.click(screen.getByRole('button', { name: 'Sign in' }))

  expect(await screen.findByText('Welcome, John')).toBeInTheDocument()
})`,
        },
        {
          id: "playwright-after",
          language: "ts",
          code: `// Playwright Component Testing (після міграції)
import { test, expect } from '@playwright/experimental-ct-react'

test('sign in', async ({ mount }) => {
  // render() → mount() (тепер async)
  const component = await mount(<SignInForm />)

  // screen.getByLabelText() → component.getByLabel()
  await component.getByLabel('Username').fill('John')
  await component.getByLabel('Password').fill('secret')
  await component.getByRole('button', { name: 'Sign in' }).click()

  // findByText() + toBeInTheDocument() → getByText() + toBeVisible()
  // Playwright auto-wait — немає потреби у findBy vs getBy
  await expect(component.getByText('Welcome, John')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "replacing-waitfor",
      title: {
        en: "Replacing waitFor and waitForElementToBeRemoved",
        uk: "Заміна waitFor і waitForElementToBeRemoved",
      },
      paragraphs: [
        {
          en: "In Testing Library I often need `waitFor` to wait for async state changes. In Playwright, assertions auto-wait — so `await expect(locator).toBeVisible()` already waits for up to the configured timeout.",
          uk: "У Testing Library часто потрібен `waitFor` щоб чекати async-змін стану. У Playwright assertions auto-wait — тому `await expect(locator).toBeVisible()` вже чекає до налаштованого тайм-ауту.",
        },
        {
          en: "When there's no suitable built-in assertion, I use `expect.poll()` for custom conditions.",
          uk: "Коли немає підходящого вбудованого assertion — використовую `expect.poll()` для кастомних умов.",
        },
      ],
      codeBlocks: [
        {
          id: "waitfor-migration",
          language: "ts",
          code: `// Testing Library
await waitFor(() => {
  expect(getByText('Order created')).toBeInTheDocument()
})
await waitForElementToBeRemoved(() => queryByText('Loading...'))

// Playwright — просто assertions
await expect(page.getByText('Order created')).toBeVisible()
await expect(page.getByText('Loading...')).toBeHidden()

// Кастомна умова без built-in assertion
await expect.poll(async () => {
  return await page.evaluate(() => window.appState.loaded)
}).toBe(true)`,
        },
      ],
    },
    {
      id: "replacing-within",
      title: {
        en: "Replacing within()",
        uk: "Заміна within()",
      },
      paragraphs: [
        {
          en: "`within(element)` in Testing Library scopes queries to inside a specific element. In Playwright, I chain locators — every locator method called on a locator searches within that locator's scope.",
          uk: "`within(element)` у Testing Library обмежує запити до конкретного елемента. У Playwright — ланцюгую локатори: кожен метод локатора викликаний на локаторі шукає в межах того локатора.",
        },
      ],
      codeBlocks: [
        {
          id: "within-migration",
          language: "ts",
          code: `// Testing Library
const orderRow = screen.getByTestId('order-row-1042')
const cancelButton = within(orderRow).getByRole('button', { name: 'Cancel' })

// Playwright — вкладені локатори
const orderRow = page.getByTestId('order-row-1042')
const cancelButton = orderRow.getByRole('button', { name: 'Cancel' })
await cancelButton.click()`,
        },
      ],
    },
    {
      id: "what-you-gain",
      title: {
        en: "What you gain by switching",
        uk: "Що отримуєш при переході",
      },
      paragraphs: [
        {
          en: "Moving from RTL to Playwright Component Testing gives:\n- Tests run in a **real browser** — real CSS, real layout, real hover states\n- All standard Playwright tools work: traces, screenshots, HTML reports, UI mode\n- The same test can run in Chrome, Firefox, and WebKit\n- Visual snapshot testing built in\n- No JSDOM quirks or limitations",
          uk: "Перехід з RTL на Playwright Component Testing дає:\n- Тести виконуються у **реальному браузері** — реальний CSS, реальний лейаут, реальні hover-стани\n- Всі стандартні інструменти Playwright: traces, screenshots, HTML-звіти, UI mode\n- Той самий тест може виконуватися в Chrome, Firefox і WebKit\n- Вбудоване візуальне snapshot-тестування\n- Жодних JSDOM-артефактів або обмежень",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "In React Testing Library you use `await screen.findByText('Welcome')` to wait for async text to appear. What's the direct Playwright equivalent?",
        uk: "У React Testing Library використовуєш `await screen.findByText('Welcome')` щоб дочекатися async тексту. Який прямий еквівалент у Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.waitForSelector('text=Welcome') — explicit wait needed",
            uk: "await page.waitForSelector('text=Welcome') — потрібне явне очікування",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(page.getByText('Welcome')).toBeVisible() — Playwright assertions auto-wait, no findBy/getBy/queryBy distinction needed",
            uk: "await expect(page.getByText('Welcome')).toBeVisible() — Playwright assertions auto-wait, поділ findBy/getBy/queryBy не потрібен",
          },
        },
        {
          id: "c",
          label: {
            en: "page.getByText('Welcome') — locators auto-wait by themselves when called",
            uk: "page.getByText('Welcome') — локатори auto-wait самостійно при виклику",
          },
        },
        {
          id: "d",
          label: {
            en: "await page.findByText('Welcome') — Playwright has a findBy equivalent",
            uk: "await page.findByText('Welcome') — Playwright має еквівалент findBy",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "In Testing Library, `findBy*` is the async variant that waits — you use it when the element appears asynchronously. In Playwright, this distinction doesn't exist. `page.getByText('Welcome')` is just a locator definition — it doesn't do anything yet. The waiting happens in the assertion: `await expect(locator).toBeVisible()` polls until the element appears (or times out). So `findByText` maps directly to `getByText` + `toBeVisible()` assertion. Option C is wrong: creating a locator alone doesn't trigger any waiting.",
        uk: "У Testing Library `findBy*` — асинхронний варіант що чекає, використовується коли елемент з'являється асинхронно. У Playwright цього розрізнення не існує. `page.getByText('Welcome')` — просто визначення локатора, він ще нічого не робить. Очікування відбувається в assertion: `await expect(locator).toBeVisible()` перевіряє поки елемент не з'явиться (або не вийде тайм-аут). Тому `findByText` відображається напряму на `getByText` + assertion `toBeVisible()`. Варіант C неправильний: створення локатора само по собі не запускає ніякого очікування.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "In Testing Library, `within(orderRow).getByRole('button', { name: 'Cancel' })` scopes a query to inside an element. What's the Playwright equivalent?",
        uk: "У Testing Library `within(orderRow).getByRole('button', { name: 'Cancel' })` обмежує запит до елемента. Який еквівалент у Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.within(orderRow).getByRole('button', { name: 'Cancel' })",
            uk: "page.within(orderRow).getByRole('button', { name: 'Cancel' })",
          },
        },
        {
          id: "b",
          label: {
            en: "orderRow.getByRole('button', { name: 'Cancel' }) — Playwright locators are chainable, every method on a locator searches within it",
            uk: "orderRow.getByRole('button', { name: 'Cancel' }) — Playwright-локатори ланцюгуються, кожен метод на локаторі шукає всередині нього",
          },
        },
        {
          id: "c",
          label: {
            en: "page.getByRole('button', { name: 'Cancel', within: orderRow })",
            uk: "page.getByRole('button', { name: 'Cancel', within: orderRow })",
          },
        },
        {
          id: "d",
          label: {
            en: "page.locator('button[name=Cancel]').inside(orderRow)",
            uk: "page.locator('button[name=Cancel]').inside(orderRow)",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "In Playwright, locators are scope-aware by default: calling `.getByRole()` or any other selector method on an existing locator searches only within that locator's subtree. `orderRow.getByRole('button', { name: 'Cancel' })` finds a Cancel button inside the order row element. This is exactly equivalent to Testing Library's `within(orderRow).getByRole(...)`. The `locator.locator(selector)` method works similarly for CSS/XPath selectors.",
        uk: "У Playwright локатори за замовчуванням враховують область пошуку: виклик `.getByRole()` або будь-якого іншого методу-селектора на існуючому локаторі шукає лише в піддереві того локатора. `orderRow.getByRole('button', { name: 'Cancel' })` знаходить кнопку Cancel всередині елемента рядка замовлення. Це точний еквівалент `within(orderRow).getByRole(...)` у Testing Library. Метод `locator.locator(selector)` працює аналогічно для CSS/XPath-селекторів.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Testing Library's `render(<SignInForm />)` is synchronous. What's the key difference when using Playwright Component Testing's `mount()`?",
        uk: "Функція `render(<SignInForm />)` у Testing Library — синхронна. Яка ключова відмінність при використанні `mount()` у компонентному тестуванні Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "mount() requires a cleanup call — Playwright doesn't auto-unmount like Testing Library",
            uk: "mount() вимагає виклику cleanup — Playwright не виконує auto-unmount як Testing Library",
          },
        },
        {
          id: "b",
          label: {
            en: "mount() is async — you must await it; it returns a locator scoped to the mounted component",
            uk: "mount() — асинхронний, треба await; повертає локатор обмежений змонтованим компонентом",
          },
        },
        {
          id: "c",
          label: {
            en: "mount() requires explicit props serialization before passing to the component",
            uk: "mount() вимагає явної серіалізації props перед передачею компоненту",
          },
        },
        {
          id: "d",
          label: {
            en: "mount() only works for functional components, not class components",
            uk: "mount() працює лише для функціональних компонентів, не для класових",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`mount()` is async because Playwright communicates with the browser to mount the component — network round-trips are involved. You must `await` it: `const component = await mount(<SignInForm />)`. The returned value is a Playwright locator scoped to the component's root element, so `component.getByLabel('Email')` searches inside the mounted component. In Testing Library, `render()` is synchronous and returns `{ getByRole, queryByText, ... }` bound to `screen`.",
        uk: "`mount()` — асинхронний тому що Playwright спілкується з браузером для монтування компонента, це потребує мережевих round-trip. Потрібно `await` його: `const component = await mount(<SignInForm />)`. Повернуте значення — Playwright-локатор обмежений кореневим елементом компонента, тому `component.getByLabel('Email')` шукає всередині змонтованого компонента. У Testing Library `render()` синхронний і повертає `{ getByRole, queryByText, ... }` прив'язані до `screen`.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "Testing Library uses `await waitForElementToBeRemoved(() => queryByText('Loading...'))`. What's the Playwright equivalent?",
        uk: "Testing Library використовує `await waitForElementToBeRemoved(() => queryByText('Loading...'))`. Який еквівалент у Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.waitForSelector('text=Loading...', { state: 'detached' })",
            uk: "await page.waitForSelector('text=Loading...', { state: 'detached' })",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(page.getByText('Loading...')).toBeHidden() — the assertion auto-waits for the element to disappear",
            uk: "await expect(page.getByText('Loading...')).toBeHidden() — assertion auto-wait чекає зникнення елемента",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.evaluate(() => !document.querySelector('text=Loading...'))",
            uk: "await page.evaluate(() => !document.querySelector('text=Loading...'))",
          },
        },
        {
          id: "d",
          label: {
            en: "await expect.poll(() => page.getByText('Loading...').count()).toBe(0)",
            uk: "await expect.poll(() => page.getByText('Loading...').count()).toBe(0)",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`toBeHidden()` is the Playwright equivalent of `waitForElementToBeRemoved` — it auto-waits until the element is either gone from the DOM or hidden (`display: none`, `visibility: hidden`, or `opacity: 0`). If you need to differentiate between fully removed vs hidden, use `toBeAttached()` with `{ attached: false }`. `toBeVisible()` and `toBeHidden()` are the main tools replacing Testing Library's element removal waits.",
        uk: "`toBeHidden()` — еквівалент Playwright для `waitForElementToBeRemoved`: auto-wait чекає поки елемент або зникне з DOM або буде прихований (`display: none`, `visibility: hidden` або `opacity: 0`). Якщо потрібно розрізняти між повністю видаленим і прихованим — використовуй `toBeAttached()` з `{ attached: false }`. `toBeVisible()` і `toBeHidden()` — основні інструменти що замінюють очікування видалення елементів у Testing Library.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "Testing Library uses `await user.type(emailInput, 'john@example.com')`. What's the equivalent in Playwright?",
        uk: "Testing Library використовує `await user.type(emailInput, 'john@example.com')`. Який еквівалент у Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.keyboard.type('john@example.com') — Playwright uses the keyboard API",
            uk: "await page.keyboard.type('john@example.com') — Playwright використовує keyboard API",
          },
        },
        {
          id: "b",
          label: {
            en: "await locator.fill('john@example.com') — clears the field and types the value",
            uk: "await locator.fill('john@example.com') — очищає поле і вводить значення",
          },
        },
        {
          id: "c",
          label: {
            en: "await locator.pressSequentially('john@example.com') — the user.type equivalent",
            uk: "await locator.pressSequentially('john@example.com') — еквівалент user.type",
          },
        },
        {
          id: "d",
          label: {
            en: "await locator.setValue('john@example.com') — the direct value setter",
            uk: "await locator.setValue('john@example.com') — прямий встановлювач значення",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`locator.fill()` is the main equivalent of `user.type()` — it clears the existing value and types the new one. It's fast and reliable for input fields. If you need to simulate actual key presses (e.g., for input that reacts to individual keystrokes), use `locator.pressSequentially()` which types character by character with realistic delays. Testing Library's `user.type()` appends to the existing value; `fill()` replaces it — use `locator.focus()` + `locator.pressSequentially()` to append.",
        uk: "`locator.fill()` — основний еквівалент `user.type()`: очищає існуюче значення і вводить нове. Швидкий і надійний для полів вводу. Якщо потрібно симулювати реальні натискання клавіш (наприклад для input що реагує на окремі клавіатурні удари) — використовуй `locator.pressSequentially()` який вводить символ за символом з реалістичними затримками. `user.type()` у Testing Library додає до існуючого значення; `fill()` замінює його — використовуй `locator.focus()` + `locator.pressSequentially()` для додавання.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Testing Library: `expect(el).toBeInTheDocument()`. What's the Playwright equivalent for checking an element is present and visible?",
        uk: "Testing Library: `expect(el).toBeInTheDocument()`. Який еквівалент у Playwright для перевірки що елемент присутній і видимий?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await expect(locator).toBeAttached() — checks the element is in the DOM",
            uk: "await expect(locator).toBeAttached() — перевіряє що елемент є в DOM",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(locator).toBeVisible() — checks the element is present and visible to the user",
            uk: "await expect(locator).toBeVisible() — перевіряє що елемент присутній і видимий користувачу",
          },
        },
        {
          id: "c",
          label: {
            en: "await expect(locator).not.toBeHidden() — the logical inverse",
            uk: "await expect(locator).not.toBeHidden() — логічна інверсія",
          },
        },
        {
          id: "d",
          label: {
            en: "expect(await locator.count()).toBeGreaterThan(0) — count-based existence check",
            uk: "expect(await locator.count()).toBeGreaterThan(0) — перевірка існування через кількість",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`toBeInTheDocument()` from `@testing-library/jest-dom` checks that an element exists in the document. The closest Playwright equivalent is `toBeVisible()`, which checks that the element is attached to the DOM AND visible (not hidden by CSS). `toBeAttached()` checks only DOM presence without visibility. In most migration cases, `toBeVisible()` is the right choice because it reflects what the user actually sees — an element hidden with `display: none` passes `toBeAttached()` but fails `toBeVisible()`.",
        uk: "`toBeInTheDocument()` з `@testing-library/jest-dom` перевіряє що елемент існує в документі. Найближчий еквівалент Playwright — `toBeVisible()`, який перевіряє що елемент приєднаний до DOM І видимий (не прихований CSS). `toBeAttached()` перевіряє лише присутність у DOM без видимості. У більшості випадків міграції `toBeVisible()` — правильний вибір тому що відображає що користувач реально бачить — елемент прихований через `display: none` проходить `toBeAttached()` але провалює `toBeVisible()`.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Testing Library uses `const { rerender } = render(<Counter count={1} />)` and then `rerender(<Counter count={2} />)`. What's the Playwright component testing equivalent for re-rendering with new props?",
        uk: "Testing Library використовує `const { rerender } = render(<Counter count={1} />)` і потім `rerender(<Counter count={2} />)`. Який еквівалент у компонентному тестуванні Playwright для повторного рендеру з новими props?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Unmount and mount again with new props",
            uk: "Розмонтуй і змонтуй знову з новими props",
          },
        },
        {
          id: "b",
          label: {
            en: "const component = await mount(...); await component.update(<Counter count={2} />) — update() re-renders with new props",
            uk: "const component = await mount(...); await component.update(<Counter count={2} />) — update() повторно рендерить з новими props",
          },
        },
        {
          id: "c",
          label: {
            en: "await mount(<Counter count={2} />) again — mount() replaces the previous component",
            uk: "await mount(<Counter count={2} />) знову — mount() замінює попередній компонент",
          },
        },
        {
          id: "d",
          label: {
            en: "component.setProps({ count: 2 }) — direct prop setter",
            uk: "component.setProps({ count: 2 }) — прямий встановлювач props",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `mount()` return value in Playwright component testing includes an `update()` method that re-renders the component with new props — equivalent to Testing Library's `rerender()`. `const { update } = await mount(...)` (or `component.update(...)` if you stored the whole object) triggers a re-render. Calling `mount()` again creates a second mounted component rather than replacing the first. `unmount()` is also available if you need to test component cleanup behavior.",
        uk: "Повернуте значення `mount()` у компонентному тестуванні Playwright включає метод `update()` що повторно рендерить компонент з новими props — еквівалент `rerender()` у Testing Library. `const { update } = await mount(...)` (або `component.update(...)` якщо зберіг весь об'єкт) запускає повторний рендер. Повторний виклик `mount()` створює другий змонтований компонент а не замінює перший. `unmount()` також доступний якщо потрібно тестувати поведінку cleanup компонента.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Your RTL test uses `expect(button).toBeDisabled()`. What's the direct Playwright assertion?",
        uk: "Твій RTL-тест використовує `expect(button).toBeDisabled()`. Який прямий Playwright-assertion?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await expect(locator).toHaveAttribute('disabled')",
            uk: "await expect(locator).toHaveAttribute('disabled')",
          },
        },
        {
          id: "b",
          label: {
            en: "await expect(locator).toBeDisabled() — Playwright has the same assertion name",
            uk: "await expect(locator).toBeDisabled() — Playwright має той самий assertion з такою ж назвою",
          },
        },
        {
          id: "c",
          label: {
            en: "await expect(locator).not.toBeEnabled()",
            uk: "await expect(locator).not.toBeEnabled()",
          },
        },
        {
          id: "d",
          label: {
            en: "expect(await locator.evaluate(el => el.disabled)).toBe(true)",
            uk: "expect(await locator.evaluate(el => el.disabled)).toBe(true)",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's `expect(locator).toBeDisabled()` directly mirrors Testing Library's `expect(el).toBeDisabled()` — same name, same semantics. Playwright also has `toBeEnabled()`, `toBeChecked()`, `toBeEditable()`, and `toBeReadOnly()` that map cleanly from `@testing-library/jest-dom` assertions. The Playwright versions are all web-first: they auto-retry until the condition is true or timeout expires. `toHaveAttribute('disabled')` would also work but doesn't auto-wait for the attribute to change.",
        uk: "Playwright `expect(locator).toBeDisabled()` напряму дзеркалює `expect(el).toBeDisabled()` у Testing Library — та сама назва, та сама семантика. Playwright також має `toBeEnabled()`, `toBeChecked()`, `toBeEditable()` і `toBeReadOnly()` що чисто відображаються з assertions `@testing-library/jest-dom`. Версії Playwright — web-first: auto-retry поки умова не буде правдивою або не спливе тайм-аут. `toHaveAttribute('disabled')` також спрацює але не чекає автоматично поки атрибут зміниться.",
      },
    },
  ],
}
