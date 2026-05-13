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
    en: "This guide describes migration to Playwright's [Experimental Component Testing](./test-components) from [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro).",
    uk: "Цей посібник описує міграцію на [експериментальне компонентне тестування](./test-components) Playwright з [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) та [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro).",
  },
  sections: [
    {
      id: "migration-principles",
      title: {
        en: "Migration principles",
        uk: "Принципи міграції",
      },
      paragraphs: [
        {
          en: "This guide describes migration to Playwright's [Experimental Component Testing](./test-components) from [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro).",
          uk: "Цей посібник описує міграцію на [експериментальне компонентне тестування](./test-components) Playwright з [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) та [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro).",
        },
      ],
    },
    {
      id: "cheat-sheet",
      title: {
        en: "Cheat Sheet",
        uk: "Шпаргалка",
      },
      paragraphs: [
        {
          en: "| Testing Library                                                                 | Playwright                                                             |\n| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |\n| [screen](https://testing-library.com/docs/queries/about#screen)                 | [page](./api/class-page) and [component](./api/class-locator)          |\n| [queries](https://testing-library.com/docs/queries/about)                       | [locators](./locators)                                                 |\n| [async helpers](https://testing-library.com/docs/dom-testing-library/api-async) | [assertions](./test-assertions)                                        |\n| [user events](https://testing-library.com/docs/user-event/intro)                | [actions](./api/class-locator)                                         |\n| `await user.click(screen.getByText('Click me'))`                                | `await component.getByText('Click me').click()`                        |\n| `await user.click(await screen.findByText('Click me'))`                         | `await component.getByText('Click me').click()`                        |\n| `await user.type(screen.getByLabelText('Password'), 'secret')`                  | `await component.getByLabel('Password').fill('secret')`                |\n| `expect(screen.getByLabelText('Password')).toHaveValue('secret')`               | `await expect(component.getByLabel('Password')).toHaveValue('secret')` |\n| `screen.getByRole('button', { pressed: true })`                                 | `component.getByRole('button', { pressed: true })`                     |\n| `screen.getByLabelText('...')`                                                  | `component.getByLabel('...')`                                          |\n| `screen.queryByPlaceholderText('...')`                                          | `component.getByPlaceholder('...')`                                    |\n| `screen.findByText('...')`                                                      | `component.getByText('...')`                                           |\n| `screen.getByTestId('...')`                                                     | `component.getByTestId('...')`                                         |\n| `render();`                                                        | `mount();`                                                |\n| `const { unmount } = render();`                                    | `const { unmount } = await mount();`                      |\n| `const { rerender } = render();`                                   | `const { update } = await mount();`                       |",
          uk: "| Testing Library                                                                 | Playwright                                                             |\n| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |\n| [screen](https://testing-library.com/docs/queries/about#screen)                 | [page](./api/class-page) та [component](./api/class-locator)          |\n| [queries](https://testing-library.com/docs/queries/about)                       | [locators](./locators)                                                 |\n| [async helpers](https://testing-library.com/docs/dom-testing-library/api-async) | [assertions](./test-assertions)                                        |\n| [user events](https://testing-library.com/docs/user-event/intro)                | [actions](./api/class-locator)                                         |\n| `await user.click(screen.getByText('Click me'))`                                | `await component.getByText('Click me').click()`                        |\n| `await user.click(await screen.findByText('Click me'))`                         | `await component.getByText('Click me').click()`                        |\n| `await user.type(screen.getByLabelText('Password'), 'secret')`                  | `await component.getByLabel('Password').fill('secret')`                |\n| `expect(screen.getByLabelText('Password')).toHaveValue('secret')`               | `await expect(component.getByLabel('Password')).toHaveValue('secret')` |\n| `screen.getByRole('button', { pressed: true })`                                 | `component.getByRole('button', { pressed: true })`                     |\n| `screen.getByLabelText('...')`                                                  | `component.getByLabel('...')`                                          |\n| `screen.queryByPlaceholderText('...')`                                          | `component.getByPlaceholder('...')`                                    |\n| `screen.findByText('...')`                                                      | `component.getByText('...')`                                           |\n| `screen.getByTestId('...')`                                                     | `component.getByTestId('...')`                                         |\n| `render();`                                                        | `mount();`                                                |\n| `const { unmount } = render();`                                    | `const { unmount } = await mount();`                      |\n| `const { rerender } = render();`                                   | `const { update } = await mount();`                       |",
        },
      ],
    },
    {
      id: "example",
      title: {
        en: "Example",
        uk: "Приклад",
      },
      paragraphs: [
        {
          en: "Testing Library:",
          uk: "Testing Library:",
        },
        {
          en: "Line-by-line migration to Playwright Test:",
          uk: "Покрокова міграція на Playwright Test:",
        },
        {
          en: "Migration highlights (see inline comments in the Playwright Test code snippet):",
          uk: "Ключові моменти міграції (див. вбудовані коментарі у фрагменті коду Playwright Test):",
        },
        {
          en: "1. Import everything from `@playwright/experimental-ct-react` (or -vue) for component tests, or from `@playwright/test` for end-to-end tests.\n1. Test function is given a `page` that is isolated from other tests, and `mount` that renders a component in this page. These are two of the [useful fixtures](./api/class-fixtures) in Playwright Test.\n1. Replace `render` with `mount` that returns a [component locator](./locators).\n1. Use locators created with [`method: Locator.locator`] or [`method: Page.locator`] to perform most of the actions.\n1. Use [assertions](./test-assertions) to verify the state.",
          uk: "1. Імпортуйте все з `@playwright/experimental-ct-react` (або `-vue`) для компонентних тестів або з `@playwright/test` для end-to-end тестів.\n1. Функція тесту отримує `page`, ізольовану від інших тестів, і `mount`, який рендерить компонент на цій сторінці. Це дві з [корисних фікстур](./api/class-fixtures) у Playwright Test.\n1. Замініть `render` на `mount`, який повертає [локатор компонента](./locators).\n1. Використовуйте локатори, створені через [`method: Locator.locator`] або [`method: Page.locator`], для більшості дій.\n1. Застосовуйте [твердження](./test-assertions), щоб перевіряти стан.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "\ntest('sign in', async () => {\n  // Setup the page.\n  const user = userEvent.setup();\n  render();\n\n  // Perform actions.\n  await user.type(screen.getByLabelText('Username'), 'John');\n  await user.type(screen.getByLabelText('Password'), 'secret');\n  await user.click(screen.getByRole('button', { name: 'Sign in' }));\n\n  // Verify signed in state by waiting until \"Welcome\" message appears.\n  expect(await screen.findByText('Welcome, John')).toBeInTheDocument();\n});",
        },
        {
          id: "cb-2",
          language: "js",
          code: "const { test, expect } = require('@playwright/experimental-ct-react'); // 1\n\ntest('sign in', async ({ mount }) => { // 2\n  // Setup the page.\n  const component = await mount(); // 3\n\n  // Perform actions.\n  await component.getByLabel('Username').fill('John'); // 4\n  await component.getByLabel('Password').fill('secret');\n  await component.getByRole('button', { name: 'Sign in' }).click();\n\n  // Verify signed in state by waiting until \"Welcome\" message appears.\n  await expect(component.getByText('Welcome, John')).toBeVisible(); // 5\n});",
        },
      ],
    },
    {
      id: "migrating-queries",
      title: {
        en: "Migrating queries",
        uk: "Міграція запитів",
      },
      paragraphs: [
        {
          en: "All queries like `getBy...`, `findBy...`, `queryBy...` and their multi-element counterparts are replaced with `component.getBy...` locators. Locators always auto-wait and retry when needed, so you don't have to worry about choosing the right method. When you want to do a [list operation](./locators#lists), e.g. assert a list of texts, Playwright automatically performs multi-element operations.",
          uk: "Усі запити на кшталт `getBy...`, `findBy...`, `queryBy...` та їхні варіанти для кількох елементів замінюються локаторами `component.getBy...`. Локатори завжди автоматично чекають і повторюють спроби за потреби, тож не доведеться підбирати «правильний» метод. Для [операцій зі списками](./locators#lists), наприклад перевірки списку текстів, Playwright автоматично виконує операції з кількома елементами.",
        },
      ],
    },
    {
      id: "replacing-waitfor",
      title: {
        en: "Replacing `waitFor`",
        uk: "Заміна `waitFor`",
      },
      paragraphs: [
        {
          en: "Playwright includes [assertions](./test-assertions) that automatically wait for the condition, so you don't usually need an explicit `waitFor`/`waitForElementToBeRemoved` call.",
          uk: "У Playwright є [твердження](./test-assertions), які автоматично чекають на виконання умови, тож зазвичай не потрібні явні виклики `waitFor`/`waitForElementToBeRemoved`.",
        },
        {
          en: "When you cannot find a suitable assertion, use [`expect.poll`](./test-assertions#expectpoll) instead.",
          uk: "Якщо немає підходящого твердження, використовуйте [`expect.poll`](./test-assertions#expectpoll).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "// Testing Library\nawait waitFor(() => {\n  expect(getByText('the lion king')).toBeInTheDocument();\n});\nawait waitForElementToBeRemoved(() => queryByText('the mummy'));\n\n// Playwright\nawait expect(page.getByText('the lion king')).toBeVisible();\nawait expect(page.getByText('the mummy')).toBeHidden();",
        },
        {
          id: "cb-4",
          language: "js",
          code: "await expect.poll(async () => {\n  const response = await page.request.get('https://api.example.com');\n  return response.status();\n}).toBe(200);",
        },
      ],
    },
    {
      id: "replacing-within",
      title: {
        en: "Replacing `within`",
        uk: "Заміна `within`",
      },
      paragraphs: [
        {
          en: "You can create a locator inside another locator with [`method: Locator.locator`] method.",
          uk: "Локатор всередині іншого локатора можна створити методом [`method: Locator.locator`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-5",
          language: "js",
          code: "// Testing Library\nconst messages = screen.getByTestId('messages');\nconst helloMessage = within(messages).getByText('hello');\n\n// Playwright\nconst messages = component.getByTestId('messages');\nconst helloMessage = messages.getByText('hello');",
        },
      ],
    },
    {
      id: "playwright-test-super-powers",
      title: {
        en: "Playwright Test Super Powers",
        uk: "Суперможливості Playwright Test",
      },
      paragraphs: [
        {
          en: "Once you're on Playwright Test, you get a lot!",
          uk: "Перейшовши на Playwright Test, ви отримуєте дуже багато!",
        },
        {
          en: "- Full zero-configuration TypeScript support\n- Run tests across **all web engines** (Chrome, Firefox, Safari) on **any popular operating system** (Windows, macOS, Ubuntu)\n- Full support for multiple origins, [(i)frames](./api/class-frame), [tabs and contexts](./pages)\n- Run tests in isolation in parallel across multiple browsers\n- Built-in test [artifact collection](./test-use-options.md#recording-options)",
          uk: "- Повна підтримка TypeScript без додаткового налаштування\n- Запуск тестів на **усіх основних рушіях** (Chrome, Firefox, Safari) у **будь-якій поширеній ОС** (Windows, macOS, Ubuntu)\n- Повна підтримка кількох джерел, [(i)frames](./api/class-frame), [вкладок і контекстів](./pages)\n- Паралельний запуск ізольованих тестів у кількох браузерах\n- Вбудований [збір артефактів](./test-use-options.md#recording-options) тестів",
        },
        {
          en: "You also get all these ✨ awesome tools ✨ that come bundled with Playwright Test:\n- [Visual Studio Code integration](./getting-started-vscode.md)\n- [UI mode](./test-ui-mode.md) for debugging tests with a time travel experience complete with watch mode.\n- [Playwright Inspector](./debug.md#playwright-inspector)\n- [Playwright Test Code generation](./codegen-intro.md)\n- [Playwright Tracing](./trace-viewer.md) for post-mortem debugging",
          uk: "Також ви отримуєте ✨ чудові інструменти ✨ разом із Playwright Test:\n- [інтеграцію з Visual Studio Code](./getting-started-vscode.md)\n- [UI mode](./test-ui-mode.md) для дебагу тестів з ефектом «подорожі в часі» і режимом watch\n- [Playwright Inspector](./debug.md#playwright-inspector)\n- [генерацію коду Playwright Test](./codegen-intro.md)\n- [Playwright Tracing](./trace-viewer.md) для аналізу після збою",
        },
      ],
    },
    {
      id: "further-reading",
      title: {
        en: "Further Reading",
        uk: "Додаткові матеріали",
      },
      paragraphs: [
        {
          en: "Learn more about Playwright Test runner:",
          uk: "Дізнайтеся більше про раннер Playwright Test:",
        },
        {
          en: "- [Getting Started](./intro)\n- [Experimental Component Testing](./test-components)\n- [Locators](./locators.md)\n- [Assertions](./test-assertions)\n- [Auto-waiting](./actionability)",
          uk: "- [Початок роботи](./intro)\n- [Експериментальне компонентне тестування](./test-components)\n- [Локатори](./locators.md)\n- [Твердження](./test-assertions)\n- [Автоочікування](./actionability)",
        },
      ],
    },
  ],
  quiz: [],
}
