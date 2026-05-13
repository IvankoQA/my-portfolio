import type { PlaywrightTopic } from "../../types"

export const testAssertionsTopic: PlaywrightTopic = {
  slug: "test-assertions",
  groupId: "test-runner",
  order: 315,
  level: "beginner",
  trackOrder: 10,
  sourceDoc: "test-assertions-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-assertions",
  title: {
    en: "Assertions",
    uk: "Перевірки (assertions)",
  },
  summary: {
    en: "Playwright includes test assertions in the form of `expect` function. To make an assertion, call `expect(value)` and choose a matcher that reflects the expectation. There are many [generic matchers](./api/class-genericassertions.md) like `toEqual`, `toContain`, `toBeTruthy` that can be used to assert any conditions.",
    uk: "Playwright надає тестові перевірки у вигляді функції `expect`. Щоб виконати перевірку, викличте `expect(value)` і оберіть matcher, який відображає очікування. Є багато [загальних matchers](./api/class-genericassertions.md), як-от `toEqual`, `toContain`, `toBeTruthy`, які можна використовувати для будь-яких умов.",
  },
  sections: [
    {
      id: "introduction",
      title: {
        en: "Introduction",
        uk: "Вступ",
      },
      paragraphs: [
        {
          en: "Playwright includes test assertions in the form of `expect` function. To make an assertion, call `expect(value)` and choose a matcher that reflects the expectation. There are many [generic matchers](./api/class-genericassertions.md) like `toEqual`, `toContain`, `toBeTruthy` that can be used to assert any conditions.",
          uk: "Playwright надає тестові перевірки у вигляді функції `expect`. Щоб виконати перевірку, викличте `expect(value)` і оберіть matcher, який відображає очікування. Є багато [загальних matchers](./api/class-genericassertions.md), як-от `toEqual`, `toContain`, `toBeTruthy`, які можна використовувати для будь-яких умов.",
        },
        {
          en: "Playwright also includes web-specific [async matchers](./api/class-locatorassertions.md) that will wait until\nthe expected condition is met. Consider the following example:",
          uk: "Playwright також містить веб-специфічні [async matchers](./api/class-locatorassertions.md), які чекатимуть,\nпоки не виконається очікувана умова. Розгляньте такий приклад:",
        },
        {
          en: 'Playwright will be re-testing the element with the test id of `status` until the fetched element has the `"Submitted"` text. It will re-fetch the element and check it over and over, until the condition is met or until the timeout is reached. You can either pass this timeout or configure it once via the [`property: TestConfig.expect`] value in the test config.',
          uk: 'Playwright повторно перевірятиме елемент із test id `status`, доки отриманий елемент не матиме тексту `"Submitted"`. Він знову отримуватиме елемент і перевірятиме знову й знову, доки умова не виконається або не спливе таймаут. Можна передати цей таймаут або один раз налаштувати його через значення [`property: TestConfig.expect`] у конфігурації тестів.',
        },
        {
          en: "By default, the timeout for assertions is set to 5 seconds. Learn more about [various timeouts](./test-timeouts.md).",
          uk: "За замовчуванням таймаут для перевірок становить 5 секунд. Докладніше — у розділі [різні таймаути](./test-timeouts.md).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "expect(success).toBeTruthy();",
        },
        {
          id: "cb-2",
          language: "js",
          code: "await expect(page.getByTestId('status')).toHaveText('Submitted');",
        },
      ],
    },
    {
      id: "auto-retrying-assertions",
      title: {
        en: "Auto-retrying assertions",
        uk: "Перевірки з автоповтором",
      },
      paragraphs: [
        {
          en: "The following assertions will retry until the assertion passes, or the assertion timeout is reached.\nNote that retrying assertions are async, so you must `await` them.",
          uk: "Наведені нижче перевірки повторюватимуться, доки перевірка не пройде або не спливе таймаут перевірки.\nЗверніть увагу: перевірки з повторенням асинхронні, тому їх потрібно `await`.",
        },
        {
          en: "| Assertion | Description |\n| :- | :- |\n| [await expect(locator).toBeAttached()](./api/class-locatorassertions.md#locator-assertions-to-be-attached) | Element is attached |\n| [await expect(locator).toBeChecked()](./api/class-locatorassertions.md#locator-assertions-to-be-checked) | Checkbox is checked |\n| [await expect(locator).toBeDisabled()](./api/class-locatorassertions.md#locator-assertions-to-be-disabled) | Element is disabled |\n| [await expect(locator).toBeEditable()](./api/class-locatorassertions.md#locator-assertions-to-be-editable) | Element is editable |\n| [await expect(locator).toBeEmpty()](./api/class-locatorassertions.md#locator-assertions-to-be-empty) | Container is empty |\n| [await expect(locator).toBeEnabled()](./api/class-locatorassertions.md#locator-assertions-to-be-enabled) | Element is enabled |\n| [await expect(locator).toBeFocused()](./api/class-locatorassertions.md#locator-assertions-to-be-focused) | Element is focused |\n| [await expect(locator).toBeHidden()](./api/class-locatorassertions.md#locator-assertions-to-be-hidden) | Element is not visible |\n| [await expect(locator).toBeInViewport()](./api/class-locatorassertions.md#locator-assertions-to-be-in-viewport) | Element intersects viewport |\n| [await expect(locator).toBeVisible()](./api/class-locatorassertions.md#locator-assertions-to-be-visible) | Element is visible |\n| [await expect(locator).toContainText()](./api/class-locatorassertions.md#locator-assertions-to-contain-text) | Element contains text |\n| [await expect(locator).toContainClass()](./api/class-locatorassertions.md#locator-assertions-to-contain-class) | Element has specified CSS classes |\n| [await expect(locator).toHaveAccessibleDescription()](./api/class-locatorassertions.md#locator-assertions-to-have-accessible-description) | Element has a matching [accessible description](https://w3c.github.io/accname/#dfn-accessible-description) |\n| [await expect(locator).toHaveAccessibleName()](./api/class-locatorassertions.md#locator-assertions-to-have-accessible-name) | Element has a matching [accessible name](https://w3c.github.io/accname/#dfn-accessible-name) |\n| [await expect(locator).toHaveAttribute()](./api/class-locatorassertions.md#locator-assertions-to-have-attribute) | Element has a DOM attribute |\n| [await expect(locator).toHaveClass()](./api/class-locatorassertions.md#locator-assertions-to-have-class) | Element has specified CSS class property |\n| [await expect(locator).toHaveCount()](./api/class-locatorassertions.md#locator-assertions-to-have-count) | List has exact number of children |\n| [await expect(locator).toHaveCSS()](./api/class-locatorassertions.md#locator-assertions-to-have-css) | Element has CSS property |\n| [await expect(locator).toHaveId()](./api/class-locatorassertions.md#locator-assertions-to-have-id) | Element has an ID |\n| [await expect(locator).toHaveJSProperty()](./api/class-locatorassertions.md#locator-assertions-to-have-js-property) | Element has a JavaScript property |\n| [await expect(locator).toHaveRole()](./api/class-locatorassertions.md#locator-assertions-to-have-role) | Element has a specific [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles) |\n| [await expect(locator).toHaveScreenshot()](./api/class-locatorassertions.md#locator-assertions-to-have-screenshot-1) | Element has a screenshot |\n| [await expect(locator).toHaveText()](./api/class-locatorassertions.md#locator-assertions-to-have-text) | Element matches text |\n| [await expect(locator).toHaveValue()](./api/class-locatorassertions.md#locator-assertions-to-have-value) | Input has a value |\n| [await expect(locator).toHaveValues()](./api/class-locatorassertions.md#locator-assertions-to-have-values) | Select has options selected |\n| [await expect(locator).toMatchAriaSnapshot()](./api/class-locatorassertions.md#locator-assertions-to-match-aria-snapshot) | Element matches the Aria snapshot |\n| [await expect(page).toMatchAriaSnapshot()](./api/class-pageassertions.md#page-assertions-to-match-aria-snapshot) | Page matches the Aria snapshot |\n| [await expect(page).toHaveScreenshot()](./api/class-pageassertions.md#page-assertions-to-have-screenshot-1) | Page has a screenshot |\n| [await expect(page).toHaveTitle()](./api/class-pageassertions.md#page-assertions-to-have-title) | Page has a title |\n| [await expect(page).toHaveURL()](./api/class-pageassertions.md#page-assertions-to-have-url) | Page has a URL |\n| [await expect(response).toBeOK()](./api/class-apiresponseassertions.md#api-response-assertions-to-be-ok) | Response has an OK status |",
          uk: "| Перевірка | Опис |\n| :- | :- |\n| [await expect(locator).toBeAttached()](./api/class-locatorassertions.md#locator-assertions-to-be-attached) | Елемент прикріплений до DOM |\n| [await expect(locator).toBeChecked()](./api/class-locatorassertions.md#locator-assertions-to-be-checked) | Прапорець позначено |\n| [await expect(locator).toBeDisabled()](./api/class-locatorassertions.md#locator-assertions-to-be-disabled) | Елемент вимкнено |\n| [await expect(locator).toBeEditable()](./api/class-locatorassertions.md#locator-assertions-to-be-editable) | Елемент доступний для редагування |\n| [await expect(locator).toBeEmpty()](./api/class-locatorassertions.md#locator-assertions-to-be-empty) | Контейнер порожній |\n| [await expect(locator).toBeEnabled()](./api/class-locatorassertions.md#locator-assertions-to-be-enabled) | Елемент увімкнено |\n| [await expect(locator).toBeFocused()](./api/class-locatorassertions.md#locator-assertions-to-be-focused) | Елемент у фокусі |\n| [await expect(locator).toBeHidden()](./api/class-locatorassertions.md#locator-assertions-to-be-hidden) | Елемент невидимий |\n| [await expect(locator).toBeInViewport()](./api/class-locatorassertions.md#locator-assertions-to-be-in-viewport) | Елемент перетинає область перегляду |\n| [await expect(locator).toBeVisible()](./api/class-locatorassertions.md#locator-assertions-to-be-visible) | Елемент видимий |\n| [await expect(locator).toContainText()](./api/class-locatorassertions.md#locator-assertions-to-contain-text) | Елемент містить текст |\n| [await expect(locator).toContainClass()](./api/class-locatorassertions.md#locator-assertions-to-contain-class) | Елемент має вказані CSS-класи |\n| [await expect(locator).toHaveAccessibleDescription()](./api/class-locatorassertions.md#locator-assertions-to-have-accessible-description) | Елемент має відповідний [accessible description](https://w3c.github.io/accname/#dfn-accessible-description) |\n| [await expect(locator).toHaveAccessibleName()](./api/class-locatorassertions.md#locator-assertions-to-have-accessible-name) | Елемент має відповідну [accessible name](https://w3c.github.io/accname/#dfn-accessible-name) |\n| [await expect(locator).toHaveAttribute()](./api/class-locatorassertions.md#locator-assertions-to-have-attribute) | Елемент має атрибут DOM |\n| [await expect(locator).toHaveClass()](./api/class-locatorassertions.md#locator-assertions-to-have-class) | Елемент має задану властивість CSS class |\n| [await expect(locator).toHaveCount()](./api/class-locatorassertions.md#locator-assertions-to-have-count) | Список має точну кількість дочірніх елементів |\n| [await expect(locator).toHaveCSS()](./api/class-locatorassertions.md#locator-assertions-to-have-css) | Елемент має властивість CSS |\n| [await expect(locator).toHaveId()](./api/class-locatorassertions.md#locator-assertions-to-have-id) | Елемент має ID |\n| [await expect(locator).toHaveJSProperty()](./api/class-locatorassertions.md#locator-assertions-to-have-js-property) | Елемент має властивість JavaScript |\n| [await expect(locator).toHaveRole()](./api/class-locatorassertions.md#locator-assertions-to-have-role) | Елемент має певну [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles) |\n| [await expect(locator).toHaveScreenshot()](./api/class-locatorassertions.md#locator-assertions-to-have-screenshot-1) | Елемент має скриншот |\n| [await expect(locator).toHaveText()](./api/class-locatorassertions.md#locator-assertions-to-have-text) | Текст елемента відповідає очікуванню |\n| [await expect(locator).toHaveValue()](./api/class-locatorassertions.md#locator-assertions-to-have-value) | Поле вводу має значення |\n| [await expect(locator).toHaveValues()](./api/class-locatorassertions.md#locator-assertions-to-have-values) | У select вибрано опції |\n| [await expect(locator).toMatchAriaSnapshot()](./api/class-locatorassertions.md#locator-assertions-to-match-aria-snapshot) | Елемент відповідає знімку Aria |\n| [await expect(page).toMatchAriaSnapshot()](./api/class-pageassertions.md#page-assertions-to-match-aria-snapshot) | Сторінка відповідає знімку Aria |\n| [await expect(page).toHaveScreenshot()](./api/class-pageassertions.md#page-assertions-to-have-screenshot-1) | Сторінка має скриншот |\n| [await expect(page).toHaveTitle()](./api/class-pageassertions.md#page-assertions-to-have-title) | Сторінка має заголовок |\n| [await expect(page).toHaveURL()](./api/class-pageassertions.md#page-assertions-to-have-url) | Сторінка має URL |\n| [await expect(response).toBeOK()](./api/class-apiresponseassertions.md#api-response-assertions-to-be-ok) | Відповідь має успішний статус (OK) |",
        },
      ],
    },
    {
      id: "non-retrying-assertions",
      title: {
        en: "Non-retrying assertions",
        uk: "Перевірки без автоповтору",
      },
      paragraphs: [
        {
          en: "These assertions allow to test any conditions, but do not auto-retry. Most of the time, web pages show information asynchronously, and using non-retrying assertions can lead to a flaky test.",
          uk: "Ці перевірки дають змогу перевіряти будь-які умови, але не повторюються автоматично. Зазвичай вебсторінки показують дані асинхронно, і використання таких перевірок може призвести до нестабільних (flaky) тестів.",
        },
        {
          en: "Prefer [auto-retrying](#auto-retrying-assertions) assertions whenever possible. For more complex assertions that need to be retried, use [`expect.poll`](#expectpoll) or [`expect.toPass`](#expecttopass).",
          uk: "За можливості надавайте перевагу [перевіркам з автоповтором](#auto-retrying-assertions). Для складніших перевірок, які потрібно повторювати, використовуйте [`expect.poll`](#expectpoll) або [`expect.toPass`](#expecttopass).",
        },
        {
          en: "| Assertion | Description |\n| :- | :- |\n| [`method: GenericAssertions.toBe`] | Value is the same |\n| [`method: GenericAssertions.toBeCloseTo`] | Number is approximately equal |\n| [`method: GenericAssertions.toBeDefined`] | Value is not `undefined` |\n| [`method: GenericAssertions.toBeFalsy`] | Value is falsy, e.g. `false`, `0`, `null`, etc. |\n| [`method: GenericAssertions.toBeGreaterThan`] | Number is more than |\n| [`method: GenericAssertions.toBeGreaterThanOrEqual`] | Number is more than or equal |\n| [`method: GenericAssertions.toBeInstanceOf`] | Object is an instance of a class |\n| [`method: GenericAssertions.toBeLessThan`] | Number is less than |\n| [`method: GenericAssertions.toBeLessThanOrEqual`] | Number is less than or equal |\n| [`method: GenericAssertions.toBeNaN`] | Value is `NaN` |\n| [`method: GenericAssertions.toBeNull`] | Value is `null` |\n| [`method: GenericAssertions.toBeTruthy`] | Value is truthy, i.e. not `false`, `0`, `null`, etc. |\n| [`method: GenericAssertions.toBeUndefined`] | Value is `undefined` |\n| [`method: GenericAssertions.toContain#1`] | String contains a substring |\n| [`method: GenericAssertions.toContain#2`] | Array or set contains an element |\n| [`method: GenericAssertions.toContainEqual`] | Array or set contains a similar element |\n| [`method: GenericAssertions.toEqual`] | Value is similar - deep equality and pattern matching |\n| [`method: GenericAssertions.toHaveLength`] | Array or string has length |\n| [`method: GenericAssertions.toHaveProperty`] | Object has a property |\n| [`method: GenericAssertions.toMatch`] | String matches a regular expression |\n| [`method: GenericAssertions.toMatchObject`] | Object contains specified properties |\n| [`method: GenericAssertions.toStrictEqual`] | Value is similar, including property types |\n| [`method: GenericAssertions.toThrow`] | Function throws an error |",
          uk: "| Перевірка | Опис |\n| :- | :- |\n| [`method: GenericAssertions.toBe`] | Значення однакове |\n| [`method: GenericAssertions.toBeCloseTo`] | Число наближено дорівнює |\n| [`method: GenericAssertions.toBeDefined`] | Значення не `undefined` |\n| [`method: GenericAssertions.toBeFalsy`] | Значення хибне (falsy), наприклад `false`, `0`, `null` тощо |\n| [`method: GenericAssertions.toBeGreaterThan`] | Число більше за |\n| [`method: GenericAssertions.toBeGreaterThanOrEqual`] | Число більше або дорівнює |\n| [`method: GenericAssertions.toBeInstanceOf`] | Об’єкт є екземпляром класу |\n| [`method: GenericAssertions.toBeLessThan`] | Число менше за |\n| [`method: GenericAssertions.toBeLessThanOrEqual`] | Число менше або дорівнює |\n| [`method: GenericAssertions.toBeNaN`] | Значення — `NaN` |\n| [`method: GenericAssertions.toBeNull`] | Значення — `null` |\n| [`method: GenericAssertions.toBeTruthy`] | Значення істинне (truthy), тобто не `false`, `0`, `null` тощо |\n| [`method: GenericAssertions.toBeUndefined`] | Значення — `undefined` |\n| [`method: GenericAssertions.toContain#1`] | Рядок містить підрядок |\n| [`method: GenericAssertions.toContain#2`] | Масив або множина містить елемент |\n| [`method: GenericAssertions.toContainEqual`] | Масив або множина містить подібний елемент |\n| [`method: GenericAssertions.toEqual`] | Значення подібне — глибока рівність і зіставлення з шаблоном |\n| [`method: GenericAssertions.toHaveLength`] | Масив або рядок має довжину |\n| [`method: GenericAssertions.toHaveProperty`] | Об’єкт має властивість |\n| [`method: GenericAssertions.toMatch`] | Рядок відповідає регулярному виразу |\n| [`method: GenericAssertions.toMatchObject`] | Об’єкт містить вказані властивості |\n| [`method: GenericAssertions.toStrictEqual`] | Значення подібне, включно з типами властивостей |\n| [`method: GenericAssertions.toThrow`] | Функція викидає помилку |",
        },
      ],
    },
    {
      id: "asymmetric-matchers",
      title: {
        en: "Asymmetric matchers",
        uk: "Асиметричні matchers",
      },
      paragraphs: [
        {
          en: "These expressions can be nested in other assertions to allow more relaxed matching against a given condition.",
          uk: "Ці вирази можна вкладати в інші перевірки, щоб дозволити менш суворе зіставлення з заданою умовою.",
        },
        {
          en: "| Matcher | Description |\n| :- | :- |\n| [expect.any()](./api/class-genericassertions.md#generic-assertions-any) | Matches any instance of a class/primitive |\n| [expect.anything()](./api/class-genericassertions.md#generic-assertions-anything) | Matches anything |\n| [expect.arrayContaining()](./api/class-genericassertions.md#generic-assertions-array-containing) | Array contains specific elements |\n| [expect.arrayOf()](./api/class-genericassertions.md#generic-assertions-array-of) | Array contains elements of specific type |\n| [expect.closeTo()](./api/class-genericassertions.md#generic-assertions-close-to) | Number is approximately equal |\n| [expect.objectContaining()](./api/class-genericassertions.md#generic-assertions-object-containing) | Object contains specific properties |\n| [expect.stringContaining()](./api/class-genericassertions.md#generic-assertions-string-containing) | String contains a substring |\n| [expect.stringMatching()](./api/class-genericassertions.md#generic-assertions-string-matching) | String matches a regular expression |",
          uk: "| Matcher | Опис |\n| :- | :- |\n| [expect.any()](./api/class-genericassertions.md#generic-assertions-any) | Відповідає будь-якому екземпляру класу або примітиву |\n| [expect.anything()](./api/class-genericassertions.md#generic-assertions-anything) | Відповідає чомусь |\n| [expect.arrayContaining()](./api/class-genericassertions.md#generic-assertions-array-containing) | Масив містить вказані елементи |\n| [expect.arrayOf()](./api/class-genericassertions.md#generic-assertions-array-of) | Масив містить елементи певного типу |\n| [expect.closeTo()](./api/class-genericassertions.md#generic-assertions-close-to) | Число наближено дорівнює |\n| [expect.objectContaining()](./api/class-genericassertions.md#generic-assertions-object-containing) | Об’єкт містить вказані властивості |\n| [expect.stringContaining()](./api/class-genericassertions.md#generic-assertions-string-containing) | Рядок містить підрядок |\n| [expect.stringMatching()](./api/class-genericassertions.md#generic-assertions-string-matching) | Рядок відповідає регулярному виразу |",
        },
      ],
    },
    {
      id: "negating-matchers",
      title: {
        en: "Negating matchers",
        uk: "Заперечення matchers",
      },
      paragraphs: [
        {
          en: "In general, we can expect the opposite to be true by adding a `.not` to the front\nof the matchers:",
          uk: "Зазвичай можна очікувати протилежне, додавши `.not` перед\nmatchers:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "js",
          code: "expect(value).not.toEqual(0);\nawait expect(locator).not.toContainText('some text');",
        },
      ],
    },
    {
      id: "soft-assertions",
      title: {
        en: "Soft assertions",
        uk: "М’які перевірки (soft assertions)",
      },
      paragraphs: [
        {
          en: "By default, failed assertion will terminate test execution. Playwright also\nsupports *soft assertions*: failed soft assertions **do not** terminate test execution,\nbut mark the test as failed.",
          uk: "За замовчуванням невдала перевірка завершує виконання тесту. Playwright також\nпідтримує *м’які перевірки*: невдалі м’які перевірки **не** зупиняють виконання тесту,\nале позначають тест як невдалий.",
        },
        {
          en: "At any point during test execution, you can check whether there were any\nsoft assertion failures:",
          uk: "У будь-який момент під час тесту можна перевірити, чи були\nневдалі м’які перевірки:",
        },
        {
          en: "Note that soft assertions only work with Playwright test runner.",
          uk: "Зверніть увагу: м’які перевірки працюють лише з тестранером Playwright.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-4",
          language: "js",
          code: "// Make a few checks that will not stop the test when failed...\nawait expect.soft(page.getByTestId('status')).toHaveText('Success');\nawait expect.soft(page.getByTestId('eta')).toHaveText('1 day');\n\n// ... and continue the test to check more things.\nawait page.getByRole('link', { name: 'next page' }).click();\nawait expect.soft(page.getByRole('heading', { name: 'Make another order' })).toBeVisible();",
        },
        {
          id: "cb-5",
          language: "js",
          code: "// Make a few checks that will not stop the test when failed...\nawait expect.soft(page.getByTestId('status')).toHaveText('Success');\nawait expect.soft(page.getByTestId('eta')).toHaveText('1 day');\n\n// Avoid running further if there were soft assertion failures.\nexpect(test.info().errors).toHaveLength(0);",
        },
      ],
    },
    {
      id: "custom-expect-message",
      title: {
        en: "Custom expect message",
        uk: "Власне повідомлення expect",
      },
      paragraphs: [
        {
          en: "You can specify a custom expect message as a second argument to the `expect` function, for example:",
          uk: "Можна вказати власне повідомлення expect другим аргументом функції `expect`, наприклад:",
        },
        {
          en: "This message will be shown in reporters, both for passing and failing expects, providing more context about the assertion.",
          uk: "Це повідомлення показуватиметься в репортерах і для успішних, і для невдалих expect — дає більше контексту про перевірку.",
        },
        {
          en: "When expect passes, you might see a successful step like this:",
          uk: "Коли expect проходить, ви можете побачити успішний крок на кшталт:",
        },
        {
          en: "When expect fails, the error would look like this:",
          uk: "Коли expect падає, помилка виглядатиме приблизно так:",
        },
        {
          en: "Soft assertions also support custom message:",
          uk: "М’які перевірки також підтримують власне повідомлення:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "await expect(page.getByText('Name'), 'should be logged in').toBeVisible();",
        },
        {
          id: "cb-7",
          language: "txt",
          code: "✅ should be logged in    @example.spec.ts:18",
        },
        {
          id: "cb-8",
          language: "bash",
          code: "    Error: should be logged in\n\n    Call log:\n      - expect.toBeVisible with timeout 5000ms\n      - waiting for \"getByText('Name')\"\n\n      2 |\n      3 | test('example test', async({ page }) => {\n    > 4 |   await expect(page.getByText('Name'), 'should be logged in').toBeVisible();\n        |                                                                  ^\n      5 | });\n      6 |",
        },
        {
          id: "cb-9",
          language: "js",
          code: "expect.soft(value, 'my soft assertion').toBe(56);",
        },
      ],
    },
    {
      id: "expect-configure",
      title: {
        en: "expect.configure",
        uk: "expect.configure",
      },
      paragraphs: [
        {
          en: "You can create your own pre-configured `expect` instance to have its own\ndefaults such as `timeout` and `soft`.",
          uk: "Можна створити власний попередньо налаштований екземпляр `expect` із власними\nзначеннями за замовчуванням, як-от `timeout` і `soft`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-10",
          language: "js",
          code: "const slowExpect = expect.configure({ timeout: 10000 });\nawait slowExpect(locator).toHaveText('Submit');\n\n// Always do soft assertions.\nconst softExpect = expect.configure({ soft: true });\nawait softExpect(locator).toHaveText('Submit');",
        },
      ],
    },
    {
      id: "expect-poll",
      title: {
        en: "expect.poll",
        uk: "expect.poll",
      },
      paragraphs: [
        {
          en: "You can convert any synchronous `expect` to an asynchronous polling one using `expect.poll`.",
          uk: "Будь-який синхронний `expect` можна перетворити на асинхронний з опитуванням за допомогою `expect.poll`.",
        },
        {
          en: "The following method will poll given function until it returns HTTP status 200:",
          uk: "Наведений нижче спосіб опитуватиме задану функцію, доки вона не поверне HTTP-статус 200:",
        },
        {
          en: "You can also specify custom polling intervals:",
          uk: "Також можна задати власні інтервали опитування:",
        },
        {
          en: "You can combine `expect.configure({ soft: true })` with expect.poll to perform soft assertions in polling logic.",
          uk: "Можна поєднати `expect.configure({ soft: true })` з expect.poll, щоб виконувати м’які перевірки в логіці опитування.",
        },
        {
          en: "This allows the test to continue even if the assertion inside poll fails.",
          uk: "Це дозволяє тесту продовжитися, навіть якщо перевірка всередині poll не вдалася.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "await expect.poll(async () => {\n  const response = await page.request.get('https://api.example.com');\n  return response.status();\n}, {\n  // Custom expect message for reporting, optional.\n  message: 'make sure API eventually succeeds',\n  // Poll for 10 seconds; defaults to 5 seconds. Pass 0 to disable timeout.\n  timeout: 10000,\n}).toBe(200);",
        },
        {
          id: "cb-12",
          language: "js",
          code: "await expect.poll(async () => {\n  const response = await page.request.get('https://api.example.com');\n  return response.status();\n}, {\n  // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe\n  // ... Defaults to [100, 250, 500, 1000].\n  intervals: [1_000, 2_000, 10_000],\n  timeout: 60_000\n}).toBe(200);",
        },
        {
          id: "cb-13",
          language: "js",
          code: "const softExpect = expect.configure({ soft: true });\nawait softExpect.poll(async () => {\n  const response = await page.request.get('https://api.example.com');\n  return response.status();\n}, {}).toBe(200);",
        },
      ],
    },
    {
      id: "expect-topass",
      title: {
        en: "expect.toPass",
        uk: "expect.toPass",
      },
      paragraphs: [
        {
          en: "You can retry blocks of code until they are passing successfully.",
          uk: "Можна повторювати блоки коду, доки вони не почнуть успішно проходити.",
        },
        {
          en: "You can also specify custom timeout and retry intervals:",
          uk: "Також можна задати власний таймаут і інтервали повторних спроб:",
        },
        {
          en: "Note that by default `toPass` has timeout 0 and does not respect custom [expect timeout](./test-timeouts.md#expect-timeout).",
          uk: "За замовчуванням `toPass` має таймаут 0 і не враховує власний [таймаут expect](./test-timeouts.md#expect-timeout).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-14",
          language: "js",
          code: "await expect(async () => {\n  const response = await page.request.get('https://api.example.com');\n  expect(response.status()).toBe(200);\n}).toPass();",
        },
        {
          id: "cb-15",
          language: "js",
          code: "await expect(async () => {\n  const response = await page.request.get('https://api.example.com');\n  expect(response.status()).toBe(200);\n}).toPass({\n  // Probe, wait 1s, probe, wait 2s, probe, wait 10s, probe, wait 10s, probe\n  // ... Defaults to [100, 250, 500, 1000].\n  intervals: [1_000, 2_000, 10_000],\n  timeout: 60_000\n});",
        },
      ],
    },
    {
      id: "add-custom-matchers-using-expect-extend",
      title: {
        en: "Add custom matchers using expect.extend",
        uk: "Додавання власних matchers через expect.extend",
      },
      paragraphs: [
        {
          en: "You can extend Playwright assertions by providing custom matchers. These matchers will be available on the `expect` object.",
          uk: "Можна розширити перевірки Playwright, додавши власні matchers. Вони будуть доступні на об’єкті `expect`.",
        },
        {
          en: "In this example we add a custom `toHaveAmount` function. Custom matcher should return a `pass` flag indicating whether the assertion passed, and a `message` callback that's used when the assertion fails.",
          uk: "У цьому прикладі додаємо власну функцію `toHaveAmount`. Власний matcher має повертати прапорець `pass`, що вказує, чи пройшла перевірка, і колбек `message`, який використовується, коли перевірка не вдалася.",
        },
        {
          en: "Now we can use `toHaveAmount` in the test.",
          uk: "Тепер можна використовувати `toHaveAmount` у тесті.",
        },
        {
          en: "### Compatibility with expect library",
          uk: "### Сумісність із бібліотекою expect",
        },
        {
          en: "### Combine custom matchers from multiple modules",
          uk: "### Об’єднання власних matchers з кількох модулів",
        },
        {
          en: "You can combine custom matchers from multiple files or modules.",
          uk: "Можна об’єднувати власні matchers з кількох файлів або модулів.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-16",
          language: "js",
          code: "\nexport { test } from '@playwright/test';\n\nexport const expect = baseExpect.extend({\n  async toHaveAmount(locator: Locator, expected: number, options?: { timeout?: number }) {\n    const assertionName = 'toHaveAmount';\n    let pass: boolean;\n    let matcherResult: any;\n    try {\n      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);\n      await expectation.toHaveAttribute('data-amount', String(expected), options);\n      pass = true;\n    } catch (e: any) {\n      matcherResult = e.matcherResult;\n      pass = false;\n    }\n\n    if (this.isNot) {\n      pass =!pass;\n    }\n\n    const message = pass\n      ? () => this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +\n          '\\n\\n' +\n          `Locator: ${locator}\\n` +\n          `Expected: not ${this.utils.printExpected(expected)}\\n` +\n          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '')\n      : () =>  this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +\n          '\\n\\n' +\n          `Locator: ${locator}\\n` +\n          `Expected: ${this.utils.printExpected(expected)}\\n` +\n          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '');\n\n    return {\n      message,\n      pass,\n      name: assertionName,\n      expected,\n      actual: matcherResult?.actual,\n    };\n  },\n});",
        },
        {
          id: "cb-17",
          language: "js",
          code: "\ntest('amount', async () => {\n  await expect(page.locator('.cart')).toHaveAmount(4);\n});",
        },
        {
          id: "cb-18",
          language: "js",
          code: "\nexport const expect = mergeExpects(dbExpect, a11yExpect);\nexport const test = mergeTests(dbTest, a11yTest);",
        },
        {
          id: "cb-19",
          language: "js",
          code: "\ntest('passes', async ({ database }) => {\n  await expect(database).toHaveDatabaseUser('admin');\n});",
        },
      ],
    },
  ],
  quiz: [],
}
