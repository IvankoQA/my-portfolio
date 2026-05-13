import type { PlaywrightTopic } from "../../types"

export const actionabilityTopic: PlaywrightTopic = {
  slug: "actionability",
  groupId: "guides",
  order: 105,
  sourceDoc: "actionability.md",
  officialDocsUrl: "https://playwright.dev/docs/actionability",
  title: {
    en: "Auto-waiting",
    uk: "Автоочікування",
  },
  summary: {
    en: "Playwright performs a range of actionability checks on the elements before making actions to ensure these actions behave as expected. It auto-waits for all the relevant checks to pass and only then performs the requested action. If the required checks do not pass within the given `timeout`, action fails with the `TimeoutError`.",
    uk: "Playwright виконує низку перевірок можливості дії (actionability) над елементами перед виконанням дій, щоб вони поводилися очікувано. Він автоматично чекає, поки всі потрібні перевірки пройдуть, і лише тоді виконує дію. Якщо перевірки не вдається завершити за вказаний `timeout`, дія завершується з `TimeoutError`.",
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
          en: "Playwright performs a range of actionability checks on the elements before making actions to ensure these actions\nbehave as expected. It auto-waits for all the relevant checks to pass and only then performs the requested action. If the required checks do not pass within the given `timeout`, action fails with the `TimeoutError`.",
          uk: "Playwright виконує низку перевірок можливості дії над елементами перед виконанням дій, щоб вони поводилися очікувано. Він автоматично чекає, поки всі потрібні перевірки пройдуть, і лише тоді виконує дію. Якщо перевірки не вдається завершити за вказаний `timeout`, дія завершується з `TimeoutError`.",
        },
        {
          en: "For example, for [`method: Locator.click`], Playwright will ensure that:\n- locator resolves to exactly one element\n- element is [Visible]\n- element is [Stable], as in not animating or completed animation\n- element [Receives Events], as in not obscured by other elements\n- element is [Enabled]",
          uk: "Наприклад, для [`method: Locator.click`] Playwright перевірить:\n- локатор вказує рівно на один елемент\n- елемент [Visible] (видимий)\n- елемент [Stable] (стабільний), тобто не анімується або анімація завершена\n- елемент [Receives Events] (отримує події), тобто його не перекривають інші елементи\n- елемент [Enabled] (увімкнений)",
        },
        {
          en: "Here is the complete list of actionability checks performed for each action:",
          uk: "Ось повний перелік перевірок можливості дії для кожної дії:",
        },
        {
          en: "| Action | [Visible] | [Stable] | [Receives Events] | [Enabled] | [Editable] |\n| :- | :-: | :-: | :-: | :-: | :-: |\n| [`method: Locator.check`] | Yes | Yes | Yes | Yes | - |\n| [`method: Locator.click`] | Yes | Yes | Yes | Yes | - |\n| [`method: Locator.dblclick`] | Yes | Yes | Yes | Yes | - |\n| [`method: Locator.setChecked`] | Yes | Yes | Yes | Yes | - |\n| [`method: Locator.tap`] | Yes | Yes | Yes | Yes | - |\n| [`method: Locator.uncheck`] | Yes | Yes | Yes | Yes | - |\n| [`method: Locator.hover`] | Yes | Yes | Yes | - | - |\n| [`method: Locator.dragTo`] | Yes | Yes | Yes | - | - |\n| [`method: Locator.screenshot`] | Yes | Yes | - | - | - |\n| [`method: Locator.fill`] | Yes | - | - | Yes | Yes |\n| [`method: Locator.clear`] | Yes | - | - | Yes | Yes |\n| [`method: Locator.selectOption`] | Yes | - | - | Yes | - |\n| [`method: Locator.selectText`] | Yes | - | - | - | - |\n| [`method: Locator.scrollIntoViewIfNeeded`] | - | Yes | - | - | - |\n| [`method: Locator.blur`] | - | - | - | - | - |\n| [`method: Locator.dispatchEvent`] | - | - | - | - | - |\n| [`method: Locator.focus`] | - | - | - | - | - |\n| [`method: Locator.press`] | - | - | - | - | - |\n| [`method: Locator.pressSequentially`] | - | - | - | - | - |\n| [`method: Locator.setInputFiles`] | - | - | - | - | - |",
          uk: "| Дія | [Visible] | [Stable] | [Receives Events] | [Enabled] | [Editable] |\n| :- | :-: | :-: | :-: | :-: | :-: |\n| [`method: Locator.check`] | Так | Так | Так | Так | - |\n| [`method: Locator.click`] | Так | Так | Так | Так | - |\n| [`method: Locator.dblclick`] | Так | Так | Так | Так | - |\n| [`method: Locator.setChecked`] | Так | Так | Так | Так | - |\n| [`method: Locator.tap`] | Так | Так | Так | Так | - |\n| [`method: Locator.uncheck`] | Так | Так | Так | Так | - |\n| [`method: Locator.hover`] | Так | Так | Так | - | - |\n| [`method: Locator.dragTo`] | Так | Так | Так | - | - |\n| [`method: Locator.screenshot`] | Так | Так | - | - | - |\n| [`method: Locator.fill`] | Так | - | - | Так | Так |\n| [`method: Locator.clear`] | Так | - | - | Так | Так |\n| [`method: Locator.selectOption`] | Так | - | - | Так | - |\n| [`method: Locator.selectText`] | Так | - | - | - | - |\n| [`method: Locator.scrollIntoViewIfNeeded`] | - | Так | - | - | - |\n| [`method: Locator.blur`] | - | - | - | - | - |\n| [`method: Locator.dispatchEvent`] | - | - | - | - | - |\n| [`method: Locator.focus`] | - | - | - | - | - |\n| [`method: Locator.press`] | - | - | - | - | - |\n| [`method: Locator.pressSequentially`] | - | - | - | - | - |\n| [`method: Locator.setInputFiles`] | - | - | - | - | - |",
        },
      ],
    },
    {
      id: "forcing-actions",
      title: {
        en: "Forcing actions",
        uk: "Примусове виконання дій",
      },
      paragraphs: [
        {
          en: "Some actions like [`method: Locator.click`] support `force` option that disables non-essential actionability checks,\nfor example passing truthy `force` to [`method: Locator.click`] method will not check that the target element actually\nreceives click events.",
          uk: "Деякі дії, як-от [`method: Locator.click`], підтримують опцію `force`, яка вимикає необов’язкові перевірки можливості дії:\nнаприклад, якщо передати істинне значення `force` у [`method: Locator.click`], не перевірятиметься, чи цільовий елемент\nфактично отримує події кліку.",
        },
      ],
    },
    {
      id: "assertions",
      title: {
        en: "Assertions",
        uk: "Асерти",
      },
      paragraphs: [
        {
          en: "Playwright includes auto-retrying assertions that remove flakiness by waiting until the condition is met, similarly to auto-waiting before actions.",
          uk: "Playwright має асерти з автоповтором: вони зменшують нестабільність, чекаючи на виконання умови — за тим самим принципом, що й автоочікування перед діями.",
        },
        {
          en: "| Assertion | Description |\n| :- | :- |\n| [`method: LocatorAssertions.toBeAttached`] | Element is attached |\n| [`method: LocatorAssertions.toBeChecked`] | Checkbox is checked |\n| [`method: LocatorAssertions.toBeDisabled`] | Element is disabled |\n| [`method: LocatorAssertions.toBeEditable`] | Element is editable |\n| [`method: LocatorAssertions.toBeEmpty`] | Container is empty |\n| [`method: LocatorAssertions.toBeEnabled`] | Element is enabled |\n| [`method: LocatorAssertions.toBeFocused`] | Element is focused |\n| [`method: LocatorAssertions.toBeHidden`] | Element is not visible |\n| [`method: LocatorAssertions.toBeInViewport`] | Element intersects viewport |\n| [`method: LocatorAssertions.toBeVisible`] | Element is visible |\n| [`method: LocatorAssertions.toContainText`] | Element contains text |\n| [`method: LocatorAssertions.toHaveAttribute`] | Element has a DOM attribute |\n| [`method: LocatorAssertions.toHaveClass`] | Element has a class property |\n| [`method: LocatorAssertions.toHaveCount`] | List has exact number of children |\n| [`method: LocatorAssertions.toHaveCSS`] | Element has CSS property |\n| [`method: LocatorAssertions.toHaveId`] | Element has an ID |\n| [`method: LocatorAssertions.toHaveJSProperty`] | Element has a JavaScript property |\n| [`method: LocatorAssertions.toHaveText`] | Element matches text |\n| [`method: LocatorAssertions.toHaveValue`] | Input has a value |\n| [`method: LocatorAssertions.toHaveValues`] | Select has options selected |\n| [`method: PageAssertions.toHaveTitle`] | Page has a title |\n| [`method: PageAssertions.toHaveURL`] | Page has a URL |\n| [`method: APIResponseAssertions.toBeOK`] | Response has an OK status |",
          uk: "| Асерт | Опис |\n| :- | :- |\n| [`method: LocatorAssertions.toBeAttached`] | Елемент прикріплено до DOM |\n| [`method: LocatorAssertions.toBeChecked`] | Прапорець позначено |\n| [`method: LocatorAssertions.toBeDisabled`] | Елемент вимкнено |\n| [`method: LocatorAssertions.toBeEditable`] | Елемент можна редагувати |\n| [`method: LocatorAssertions.toBeEmpty`] | Контейнер порожній |\n| [`method: LocatorAssertions.toBeEnabled`] | Елемент увімкнено |\n| [`method: LocatorAssertions.toBeFocused`] | Елемент у фокусі |\n| [`method: LocatorAssertions.toBeHidden`] | Елемент не видимий |\n| [`method: LocatorAssertions.toBeInViewport`] | Елемент перетинає область перегляду |\n| [`method: LocatorAssertions.toBeVisible`] | Елемент видимий |\n| [`method: LocatorAssertions.toContainText`] | Елемент містить текст |\n| [`method: LocatorAssertions.toHaveAttribute`] | У елемента є атрибут DOM |\n| [`method: LocatorAssertions.toHaveClass`] | У елемента задано клас |\n| [`method: LocatorAssertions.toHaveCount`] | У списку очікувана кількість дочірніх елементів |\n| [`method: LocatorAssertions.toHaveCSS`] | У елемента задано CSS-властивість |\n| [`method: LocatorAssertions.toHaveId`] | У елемента є `id` |\n| [`method: LocatorAssertions.toHaveJSProperty`] | У елемента є властивість JavaScript |\n| [`method: LocatorAssertions.toHaveText`] | Текст елемента відповідає очікуванню |\n| [`method: LocatorAssertions.toHaveValue`] | У поля введення є значення |\n| [`method: LocatorAssertions.toHaveValues`] | У `<select>` вибрано потрібні опції |\n| [`method: PageAssertions.toHaveTitle`] | У сторінки очікуваний заголовок |\n| [`method: PageAssertions.toHaveURL`] | У сторінки очікуваний URL |\n| [`method: APIResponseAssertions.toBeOK`] | Відповідь має успішний HTTP-статус |",
        },
        {
          en: "Learn more in the [assertions guide](./test-assertions.md).",
          uk: "Докладніше — у [посібнику з асертів](./test-assertions.md).",
        },
      ],
    },
    {
      id: "visible",
      title: {
        en: "Visible",
        uk: "Видимість",
      },
      paragraphs: [
        {
          en: "Element is considered visible when it has non-empty bounding box and does not have `visibility:hidden` computed style.",
          uk: "Елемент вважається видимим, якщо його bounding box непорожній і обчислений стиль не дорівнює `visibility:hidden`.",
        },
        {
          en: "Note that according to this definition:\n* Elements of zero size **are not** considered visible.\n* Elements with `display:none` **are not** considered visible.\n* Elements with `opacity:0` **are** considered visible.",
          uk: "За цим визначенням:\n* елементи нульового розміру **не** вважаються видимими;\n* елементи з `display:none` **не** вважаються видимими;\n* елементи з `opacity:0` **вважаються** видимими.",
        },
      ],
    },
    {
      id: "stable",
      title: {
        en: "Stable",
        uk: "Стабільність",
      },
      paragraphs: [
        {
          en: "Element is considered stable when it has maintained the same bounding box for at least two consecutive animation frames.",
          uk: "Елемент вважається стабільним, якщо його bounding box не змінювався щонайменше протягом двох послідовних кадрів анімації.",
        },
      ],
    },
    {
      id: "enabled",
      title: {
        en: "Enabled",
        uk: "Увімкнений стан",
      },
      paragraphs: [
        {
          en: "Element is considered enabled when it is **not disabled**.",
          uk: "Елемент вважається увімкненим, коли він **не вимкнений**.",
        },
        {
          en: "Element is **disabled** when:\n- it is a `<button>`, `<input>`, `<select>`, `<textarea>`, `<optgroup>` or `<option>` with a `[disabled]` attribute;\n- it is a `<button>`, `<input>`, `<select>`, `<textarea>`, `<optgroup>` or `<option>` that is a part of a `<fieldset>` with a `[disabled]` attribute;\n- it is a descendant of an element with `[aria-disabled=true]` attribute.",
          uk: "Елемент **вимкнений**, коли:\n- це `<button>`, `<input>`, `<select>`, `<textarea>`, `<optgroup>` або `<option>` з атрибутом `[disabled]`;\n- це `<button>`, `<input>`, `<select>`, `<textarea>`, `<optgroup>` або `<option>`, які входять до `<fieldset>` з атрибутом `[disabled]`;\n- він є нащадком елемента з атрибутом `[aria-disabled=true]`.",
        },
      ],
    },
    {
      id: "editable",
      title: {
        en: "Editable",
        uk: "Редагування",
      },
      paragraphs: [
        {
          en: "Element is considered editable when it is [enabled] and is **not readonly**.",
          uk: "Елемент вважається придатним для редагування, коли він [enabled] і **не** перебуває в стані **лише для читання**.",
        },
        {
          en: "Element is **readonly** when:\n- it is a `<input type=text/url/email/date>`, `<textarea>` or `<select>` with a `[readonly]` attribute;\n- it has an `[aria-readonly=true]` attribute and an aria role that [supports it](https://w3c.github.io/aria/#aria-readonly).",
          uk: "Елемент **лише для читання**, коли:\n- це `<input type=text/url/email/date>`, `<textarea>` або `<select>` з атрибутом `[readonly]`;\n- у нього є атрибут `[aria-readonly=true]` і роль ARIA, яка [підтримує readonly](https://w3c.github.io/aria/#aria-readonly).",
        },
      ],
    },
    {
      id: "receives-events",
      title: {
        en: "Receives Events",
        uk: "Отримання подій",
      },
      paragraphs: [
        {
          en: "Element is considered receiving pointer events when it is the hit target of the pointer event at the action point. For example, when clicking at the point `(10;10)`, Playwright checks whether some other element (usually an overlay) will instead capture the click at `(10;10)`.",
          uk: "Елемент вважається таким, що отримує вказівникові події, якщо саме він є ціллю влучення (hit target) у точці дії. Наприклад, під час кліку в точці `(10;10)` Playwright перевіряє, чи не перехопить клік у `(10;10)` інший елемент (зазвичай оверлей).",
        },
        {
          en: "For example, consider a scenario where Playwright will click `Sign Up` button regardless of when the [`method: Locator.click`] call was made:\n- page is checking that user name is unique and `Sign Up` button is disabled;\n- after checking with the server, the disabled `Sign Up` button is replaced with another one that is now enabled.",
          uk: "Наприклад, сценарій, у якому Playwright натисне кнопку `Sign Up` незалежно від моменту виклику [`method: Locator.click`]:\n- сторінка перевіряє унікальність імені користувача, і кнопка `Sign Up` вимкнена;\n- після відповіді сервера вимкнену кнопку `Sign Up` замінюють на нову, уже увімкнену.",
        },
        {
          en: '[Visible]: #visible "Visible"\n[Stable]: #stable "Stable"\n[Enabled]: #enabled "Enabled"\n[Editable]: #editable "Editable"\n[Receives Events]: #receives-events "Receives Events"',
          uk: '[Visible]: #visible "Видимість"\n[Stable]: #stable "Стабільність"\n[Enabled]: #enabled "Увімкнений стан"\n[Editable]: #editable "Редагування"\n[Receives Events]: #receives-events "Отримання подій"',
        },
      ],
    },
  ],
  quiz: [],
}
