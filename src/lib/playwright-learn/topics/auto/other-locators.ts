import type { PlaywrightTopic } from "../../types"

export const otherLocatorsTopic: PlaywrightTopic = {
  slug: "other-locators",
  groupId: "guides",
  order: 270,
  level: "advanced",
  trackOrder: 16,
  sourceDoc: "other-locators.md",
  officialDocsUrl: "https://playwright.dev/docs/other-locators",
  title: {
    en: "Other locators",
    uk: "Інші локатори",
  },
  summary: {
    en: "In addition to recommended locators like [`method: Page.getByRole`] and [`method: Page.getByText`], Playwright supports a variety of other locators described in this guide.",
    uk: "Окрім рекомендованих локаторів на кшталт [`method: Page.getByRole`] та [`method: Page.getByText`], Playwright підтримує й інші локатори, описані в цьому посібнику.",
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
          en: "In addition to recommended locators like [`method: Page.getByRole`] and [`method: Page.getByText`], Playwright supports a variety of other locators described in this guide.",
          uk: "Окрім рекомендованих локаторів на кшталт [`method: Page.getByRole`] та [`method: Page.getByText`], Playwright підтримує й інші локатори, описані в цьому посібнику.",
        },
      ],
    },
    {
      id: "css-locator",
      title: {
        en: "CSS locator",
        uk: "CSS-локатор",
      },
      paragraphs: [
        {
          en: "Playwright can locate an element by CSS selector.",
          uk: "Playwright може знайти елемент за CSS-селектором.",
        },
        {
          en: "Playwright augments standard CSS selectors in two ways:\n* CSS selectors pierce open shadow DOM.\n* Playwright adds custom pseudo-classes like `:visible`, `:has-text()`, `:has()`, `:is()`, `:nth-match()` and more.",
          uk: "Playwright доповнює стандартні CSS-селектори двома способами:\n* CSS-селектори проходять крізь відкритий shadow DOM.\n* Playwright додає власні псевдокласи, як-от `:visible`, `:has-text()`, `:has()`, `:is()`, `:nth-match()` та інші.",
        },
        {
          en: "### CSS: matching by text",
          uk: "### CSS: збіг за текстом",
        },
        {
          en: "Playwright include a number of CSS pseudo-classes to match elements by their text content.",
          uk: "Playwright містить низку CSS-псевдокласів для збігу елементів за текстовим вмістом.",
        },
        {
          en: '- `article:has-text("Playwright")` - the `:has-text()` matches any element containing specified text somewhere inside, possibly in a child or a descendant element. Matching is case-insensitive, trims whitespace and searches for a substring.',
          uk: '- `article:has-text("Playwright")` — `:has-text()` збігається з будь-яким елементом, усередині якого десь є вказаний текст (у дочірньому чи нащадку). Збіг без урахування регістру, з обрізанням пробілів і пошуком підрядка.',
        },
        {
          en: 'For example, `article:has-text("Playwright")` matches `Playwright`.',
          uk: 'Наприклад, `article:has-text("Playwright")` збігається з `Playwright`.',
        },
        {
          en: "Note that `:has-text()` should be used together with other CSS specifiers, otherwise it will match all the elements containing specified text, including the ``.",
          uk: "Зверніть увагу: `:has-text()` слід поєднувати з іншими CSS-специфікаторами, інакше збігатимуться всі елементи з цим текстом, включно з ``.",
        },
        {
          en: '- `#nav-bar :text("Home")` - the `:text()` pseudo-class matches the smallest element containing specified text. Matching is case-insensitive, trims whitespace and searches for a substring.',
          uk: '- `#nav-bar :text("Home")` — псевдоклас `:text()` збігається з найменшим елементом, що містить вказаний текст. Без урахування регістру, з обрізанням пробілів і пошуком підрядка.',
        },
        {
          en: 'For example, this will find an element with text "Home" somewhere inside the `#nav-bar` element:',
          uk: "Наприклад, це знайде елемент із текстом «Home» десь всередині `#nav-bar`:",
        },
        {
          en: '- `#nav-bar :text-is("Home")` - the `:text-is()` pseudo-class matches the smallest element with exact text. Exact matching is case-sensitive, trims whitespace and searches for the full string.',
          uk: '- `#nav-bar :text-is("Home")` — псевдоклас `:text-is()` збігається з найменшим елементом із точним текстом. Точний збіг з урахуванням регістру, з обрізанням пробілів і по всьому рядку.',
        },
        {
          en: 'For example, `:text-is("Log")` does not match `Log in` because `` contains a single text node `"Log in"` that is not equal to `"Log"`. However, `:text-is("Log")` matches ` Log in`, because `` contains a text node `" Log "`.',
          uk: 'Наприклад, `:text-is("Log")` не збігається з `Log in`, бо `` має один текстовий вузол `"Log in"`, який не дорівнює `"Log"`. Натомість `:text-is("Log")` збігається з ` Log in`, бо `` містить вузол `" Log "`.',
        },
        {
          en: 'Similarly, `:text-is("Download")` will not match `download` because it is case-sensitive.',
          uk: 'Аналогічно, `:text-is("Download")` не збігається з `download`, бо збіг з урахуванням регістру.',
        },
        {
          en: '* `#nav-bar :text-matches("reg?ex", "i")` - the `:text-matches()` pseudo-class matches the smallest element with text content matching the [JavaScript-like regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).',
          uk: '* `#nav-bar :text-matches("reg?ex", "i")` — псевдоклас `:text-matches()` збігається з найменшим елементом, текст якого відповідає [регулярному виразу у стилі JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).',
        },
        {
          en: 'For example, `:text-matches("Log\\s*in", "i")` matches `Login` and `log IN`.',
          uk: 'Наприклад, `:text-matches("Log\\s*in", "i")` збігається з `Login` і `log IN`.',
        },
        {
          en: "### CSS: matching only visible elements",
          uk: "### CSS: лише видимі елементи",
        },
        {
          en: "Playwright supports the `:visible` pseudo class in CSS selectors. For example, `css=button` matches all the buttons on the page, while `css=button:visible` only matches visible buttons. This is useful to distinguish elements that are very similar but differ in visibility.",
          uk: "Playwright підтримує псевдоклас `:visible` у CSS-селекторах. Наприклад, `css=button` збігається з усіма кнопками на сторінці, а `css=button:visible` — лише з видимими. Це корисно розрізняти схожі елементи за видимістю.",
        },
        {
          en: "Consider a page with two buttons, first invisible and second visible.",
          uk: "Уявіть сторінку з двома кнопками: перша невидима, друга видима.",
        },
        {
          en: "* This will find both buttons and throw a [strictness](./locators.md#strictness) violation error:",
          uk: "* Це знайде обидві кнопки й викине помилку порушення [суворості](./locators.md#strictness):",
        },
        {
          en: "* This will only find a second button, because it is visible, and then click it.",
          uk: "* Це знайде лише другу кнопку, бо вона видима, і клікне по ній.",
        },
        {
          en: "### CSS: elements that contain other elements",
          uk: "### CSS: елементи, що містять інші елементи",
        },
        {
          en: "The `:has()` pseudo-class is a [CSS pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:has). It returns an element if any of the selectors passed as parameters\nrelative to the `:scope` of the given element match at least one element.",
          uk: "Псевдоклас `:has()` — це [CSS-псевдоклас](https://developer.mozilla.org/en-US/docs/Web/CSS/:has). Він повертає елемент, якщо хоча б один із селекторів-параметрів\nвідносно `:scope` даного елемента збігається хоча б з одним елементом.",
        },
        {
          en: "Following snippet returns text content of an `` element that has a `` inside.",
          uk: "Наведений фрагмент повертає текстовий вміст `` з `` всередині.",
        },
        {
          en: "### CSS: elements matching one of the conditions",
          uk: "### CSS: елементи, що відповідають одній із умов",
        },
        {
          en: "Comma-separated list of CSS selectors will match all elements that can be selected by\none of the selectors in that list.",
          uk: "Список CSS-селекторів через кому збігається з усіма елементами, які можна вибрати\nбудь-яким селектором з цього списку.",
        },
        {
          en: "The `:is()` pseudo-class is a [CSS pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:is) that\nmay be useful for specifying a list of extra conditions on an element.",
          uk: "Псевдоклас `:is()` — це [CSS-псевдоклас](https://developer.mozilla.org/en-US/docs/Web/CSS/:is), який\nможе знадобитися для списку додаткових умов на елементі.",
        },
        {
          en: "### CSS: matching elements based on layout",
          uk: "### CSS: збіг за розташуванням (layout)",
        },
        {
          en: "Sometimes, it is hard to come up with a good selector to the target element when it lacks distinctive features. In this case, using Playwright layout CSS pseudo-classes could help. These can be combined with regular CSS to pinpoint one of the multiple choices.",
          uk: "Іноді важко підібрати хороший селектор до цільового елемента без виразних ознак. Тоді допоможуть layout-псевдокласи Playwright у CSS; їх можна поєднувати зі звичайним CSS, щоб виділити один із кількох варіантів.",
        },
        {
          en: 'For example, `input:right-of(:text("Password"))` matches an input field that is to the right of text "Password" - useful when the page has multiple inputs that are hard to distinguish between each other.',
          uk: 'Наприклад, `input:right-of(:text("Password"))` збігається з полем праворуч від тексту «Password» — корисно, коли на сторінці кілька полів, які важко розрізнити.',
        },
        {
          en: 'Note that layout pseudo-classes are useful in addition to something else, like `input`. If you use a layout pseudo-class alone, like `:right-of(:text("Password"))`, most likely you\'ll get not the input you are looking for, but some empty element in between the text and the target input.',
          uk: 'Layout-псевдокласи варто додавати до чогось конкретного, наприклад `input`. Якщо використати лише `:right-of(:text("Password"))`, швидше за все ви отримаєте не те поле, а якийсь порожній елемент між текстом і цільовим input.',
        },
        {
          en: "Layout pseudo-classes use [bounding client rect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)\nto compute distance and relative position of the elements.\n* `:right-of(div > button)` - Matches elements that are to the right of any element matching the inner selector, at any vertical position.\n* `:left-of(div > button)` - Matches elements that are to the left of any element matching the inner selector, at any vertical position.\n* `:above(div > button)` - Matches elements that are above any of the elements matching the inner selector, at any horizontal position.\n* `:below(div > button)` - Matches elements that are below any of the elements matching the inner selector, at any horizontal position.\n* `:near(div > button)` - Matches elements that are near (within 50 CSS pixels) any of the elements matching the inner selector.",
          uk: "Layout-псевдокласи використовують [bounding client rect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)\nдля відстані й відносного положення елементів.\n* `:right-of(div > button)` — елементи праворуч від будь-якого збігу внутрішнього селектора, на будь-якій вертикалі.\n* `:left-of(div > button)` — елементи ліворуч від будь-якого збігу внутрішнього селектора, на будь-якій вертикалі.\n* `:above(div > button)` — елементи над будь-яким збігом внутрішнього селектора, на будь-якій горизонталі.\n* `:below(div > button)` — елементи під будь-яким збігом внутрішнього селектора, на будь-якій горизонталі.\n* `:near(div > button)` — елементи поблизу (у межах 50 CSS-пікселів) від будь-якого збігу внутрішнього селектора.",
        },
        {
          en: "Note that resulting matches are sorted by their distance to the anchor element, so you can use [`method: Locator.first`] to pick the closest one. This is only useful if you have something like a list of similar elements, where the closest is obviously the right one. However, using [`method: Locator.first`] in other cases most likely won't work as expected - it will not target the element you are searching for, but some other element that happens to be the closest like a random empty ``, or an element that is scrolled out and is not currently visible.",
          uk: "Зверніть увагу: збіги сортують за відстанню до якорного елемента, тож [`method: Locator.first`] вибирає найближчий. Це має сенс лише для списків схожих елементів, де «найближчий» очевидно правильний.\n\nУ інших випадках [`method: Locator.first`] швидше за все не спрацює як задумано — потрапите не на шуканий елемент, а на випадковий порожній ``, або на елемент поза видимою областю.",
        },
        {
          en: 'All layout pseudo-classes support optional maximum pixel distance as the last argument. For example\n`button:near(:text("Username"), 120)` matches a button that is at most 120 CSS pixels away from the element with the text "Username".',
          uk: 'Усі layout-псевдокласи підтримують необов’язкову максимальну відстань у пікселях останнім аргументом. Наприклад,\n`button:near(:text("Username"), 120)` збігається з кнопкою не далі ніж на 120 CSS-пікселів від елемента з текстом «Username».',
        },
        {
          en: "### CSS: pick n-th match from the query result",
          uk: "### CSS: n-й збіг із результату запиту",
        },
        {
          en: "Sometimes page contains a number of similar elements, and it is hard to select a particular one. For example:",
          uk: "Іноді на сторінці багато схожих елементів і важко вибрати потрібний. Наприклад:",
        },
        {
          en: 'In this case, `:nth-match(:text("Buy"), 3)` will select the third button from the snippet above. Note that index is one-based.',
          uk: 'Тоді `:nth-match(:text("Buy"), 3)` вибере третю кнопку з наведеного фрагмента. Індекс починається з 1.',
        },
        {
          en: "`:nth-match()` is also useful to wait until a specified number of elements appear, using [`method: Locator.waitFor`].",
          uk: "`:nth-match()` також корисний, щоб дочекатися появи заданої кількості елементів, через [`method: Locator.waitFor`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "await page.locator('css=button').click();",
        },
        {
          id: "cb-6",
          language: "js",
          code: "  // Wrong, will match many elements including \n  await page.locator(':has-text(\"Playwright\")').click();\n  // Correct, only matches the  element\n  await page.locator('article:has-text(\"Playwright\")').click();",
        },
        {
          id: "cb-11",
          language: "js",
          code: "  await page.locator('#nav-bar :text(\"Home\")').click();",
        },
        {
          id: "cb-16",
          language: "html",
          code: "Invisible\nVisible",
        },
        {
          id: "cb-17",
          language: "js",
          code: "  await page.locator('button').click();",
        },
        {
          id: "cb-22",
          language: "js",
          code: "  await page.locator('button:visible').click();",
        },
        {
          id: "cb-27",
          language: "js",
          code: "await page.locator('article:has(div.promo)').textContent();",
        },
        {
          id: "cb-32",
          language: "js",
          code: '// Clicks a  that has either a "Log in" or "Sign in" text.\nawait page.locator(\'button:has-text("Log in"), button:has-text("Sign in")\').click();',
        },
        {
          id: "cb-37",
          language: "js",
          code: "// Fill an input to the right of \"Username\".\nawait page.locator('input:right-of(:text(\"Username\"))').fill('value');\n\n// Click a button near the promo card.\nawait page.locator('button:near(.promo-card)').click();\n\n// Click the radio input in the list closest to the \"Label 3\".\nawait page.locator('[type=radio]:left-of(:text(\"Label 3\"))').first().click();",
        },
        {
          id: "cb-42",
          language: "html",
          code: "\n  Buy\n\n  \n    Buy\n  \n\n  \n    Buy",
        },
        {
          id: "cb-43",
          language: "js",
          code: '// Click the third "Buy" button\nawait page.locator(\':nth-match(:text("Buy"), 3)\').click();',
        },
        {
          id: "cb-48",
          language: "js",
          code: "// Wait until all three buttons are visible\nawait page.locator(':nth-match(:text(\"Buy\"), 3)').waitFor();",
        },
      ],
    },
    {
      id: "n-th-element-locator",
      title: {
        en: "N-th element locator",
        uk: "Локатор n-го елемента",
      },
      paragraphs: [
        {
          en: "You can narrow down query to the n-th match using the `nth=` locator passing a zero-based index.",
          uk: "Запит можна звузити до n-го збігу за допомогою локатора `nth=` з нульовим індексом.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-53",
          language: "js",
          code: "// Click first button\nawait page.locator('button').locator('nth=0').click();\n\n// Click last button\nawait page.locator('button').locator('nth=-1').click();",
        },
      ],
    },
    {
      id: "parent-element-locator",
      title: {
        en: "Parent element locator",
        uk: "Локатор батьківського елемента",
      },
      paragraphs: [
        {
          en: "When you need to target a parent element of some other element, most of the time you should [`method: Locator.filter`] by the child locator. For example, consider the following DOM structure:",
          uk: "Коли потрібно націлитися на батьківський елемент іншого, зазвичай варто [`method: Locator.filter`] за дочірнім локатором. Наприклад, розгляньте таку структуру DOM:",
        },
        {
          en: 'If you\'d like to target the parent `` of a label with text `"Hello"`, using [`method: Locator.filter`] works best:',
          uk: 'Щоб націлитися на батьківський `` підпису з текстом `"Hello"`, найкраще підходить [`method: Locator.filter`]:',
        },
        {
          en: "Alternatively, if you cannot find a suitable locator for the parent element, use `xpath=..`. Note that this method is not as reliable, because any changes to the DOM structure will break your tests. Prefer [`method: Locator.filter`] when possible.",
          uk: "Альтернативно, якщо не вдається підібрати локатор для батька, можна `xpath=..`. Це менш надійно: зміни структури DOM зламають тести. За можливості віддавайте перевагу [`method: Locator.filter`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-58",
          language: "html",
          code: "Hello\nWorld",
        },
        {
          id: "cb-59",
          language: "js",
          code: "const child = page.getByText('Hello');\nconst parent = page.getByRole('listitem').filter({ has: child });",
        },
        {
          id: "cb-64",
          language: "js",
          code: "const parent = page.getByText('Hello').locator('xpath=..');",
        },
      ],
    },
    {
      id: "xpath-locator",
      title: {
        en: "XPath locator",
        uk: "XPath-локатор",
      },
      paragraphs: [
        {
          en: "XPath locators are equivalent to calling [`Document.evaluate`](https://developer.mozilla.org/en/docs/Web/API/Document/evaluate).",
          uk: "XPath-локатори еквівалентні виклику [`Document.evaluate`](https://developer.mozilla.org/en/docs/Web/API/Document/evaluate).",
        },
        {
          en: "### XPath union",
          uk: "### Об’єднання XPath",
        },
        {
          en: "Pipe operator (`|`) can be used to specify multiple selectors in XPath. It will match all\nelements that can be selected by one of the selectors in that list.",
          uk: "Оператор `|` дозволяє задати кілька селекторів у XPath. Збігатимуться всі\neлементи, які можна вибрати будь-яким селектором зі списку.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-69",
          language: "js",
          code: "await page.locator('xpath=//button').click();",
        },
        {
          id: "cb-74",
          language: "js",
          code: "// Waits for either confirmation dialog or load spinner.\nawait page.locator(\n    `//span[contains(@class, 'spinner__loading')]|//div[@id='confirmation']`\n).waitFor();",
        },
      ],
    },
    {
      id: "label-to-form-control-retargeting",
      title: {
        en: "Label to form control retargeting",
        uk: "Перенаправлення з підпису на поле форми",
      },
      paragraphs: [
        {
          en: "Targeted input actions in Playwright automatically distinguish between labels and controls, so you can target the label to perform an action on the associated control.",
          uk: "Цільові дії введення в Playwright автоматично розрізняють підписи й елементи керування, тож можна націлитися на підпис і виконати дію над пов’язаним контролом.",
        },
        {
          en: 'For example, consider the following DOM structure: `Password:`. You can target the label by its "Password" text using [`method: Page.getByText`]. However, the following actions will be performed on the input instead of the label:\n- [`method: Locator.click`] will click the label and automatically focus the input field;\n- [`method: Locator.fill`] will fill the input field;\n- [`method: Locator.inputValue`] will return the value of the input field;\n- [`method: Locator.selectText`] will select text in the input field;\n- [`method: Locator.setInputFiles`] will set files for the input field with `type=file`;\n- [`method: Locator.selectOption`] will select an option from the select box.',
          uk: "Наприклад, структура DOM: `Password:`. Підпис можна націлити за текстом «Password» через [`method: Page.getByText`].\n\nАле такі дії виконаються над полем введення, а не над підписом:\n- [`method: Locator.click`] — клік по підпису й автофокус на input;\n- [`method: Locator.fill`] — заповнення поля;\n- [`method: Locator.inputValue`] — значення поля;\n- [`method: Locator.selectText`] — виділення тексту в полі;\n- [`method: Locator.setInputFiles`] — файли для `type=file`;\n- [`method: Locator.selectOption`] — вибір опції з випадного списку (select box).",
        },
        {
          en: "However, other methods will target the label itself, for example [`method: LocatorAssertions.toHaveText`] will assert the text content of the label, not the input field.",
          uk: "Інші методи націлюються саме на підпис: наприклад, [`method: LocatorAssertions.toHaveText`] перевіряє текст підпису, а не поля.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-79",
          language: "js",
          code: "// Fill the input by targeting the label.\nawait page.getByText('Password').fill('secret');",
        },
        {
          id: "cb-84",
          language: "js",
          code: "// Fill the input by targeting the label.\nawait expect(page.locator('label')).toHaveText('Password');",
        },
      ],
    },
    {
      id: "legacy-text-locator",
      title: {
        en: "Legacy text locator",
        uk: "Застарілий текстовий локатор",
      },
      paragraphs: [
        {
          en: "Legacy text locator matches elements that contain passed text.",
          uk: "Застарілий текстовий локатор збігається з елементами, що містять переданий текст.",
        },
        {
          en: "Legacy text locator has a few variations:",
          uk: "Є кілька варіантів:",
        },
        {
          en: "- `text=Log in` - default matching is case-insensitive, trims whitespace and searches for a substring. For example, `text=Log` matches `Log in`.",
          uk: "- `text=Log in` — за замовчуванням без урахування регістру, з обрізанням пробілів і пошуком підрядка. Наприклад, `text=Log` збігається з `Log in`.",
        },
        {
          en: '- `text="Log in"` - text body can be escaped with single or double quotes to search for a text node with exact content after trimming whitespace.',
          uk: '- `text="Log in"` — тіло в лапках шукає текстовий вузол із точним вмістом після обрізання пробілів.',
        },
        {
          en: 'For example, `text="Log"` does not match `Log in` because `` contains a single text node `"Log in"` that is not equal to `"Log"`. However, `text="Log"` matches ` Log in`, because `` contains a text node `" Log "`. This exact mode implies case-sensitive matching, so `text="Download"` will not match `download`.',
          uk: 'Наприклад, `text="Log"` не збігається з `Log in`, бо `` має один вузол `"Log in"`, який не дорівнює `"Log"`. Натомість `text="Log"` збігається з ` Log in`, бо `` містить `" Log "`. Точний режим з урахуванням регістру: `text="Download"` не збігається з `download`.',
        },
        {
          en: 'Quoted body follows the usual escaping rules, e.g. use `\\"` to escape double quote in a double-quoted string: `text="foo\\"bar"`.',
          uk: 'У лапках діють звичні правила екранування, наприклад `\\"` для лапки в рядку в подвійних лапках: `text="foo\\"bar"`.',
        },
        {
          en: "- `/Log\\s*in/i` - body can be a [JavaScript-like regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) wrapped in `/` symbols. For example, `text=/Log\\s*in/i` matches `Login` and `log IN`.",
          uk: "- `/Log\\s*in/i` — тіло може бути [регулярним виразом у стилі JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) у `/`. Наприклад, `text=/Log\\s*in/i` збігається з `Login` і `log IN`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-89",
          language: "js",
          code: "await page.locator('text=Log in').click();",
        },
        {
          id: "cb-94",
          language: "js",
          code: "  await page.locator('text=Log in').click();",
        },
        {
          id: "cb-99",
          language: "js",
          code: "  await page.locator('text=\"Log in\"').click();",
        },
        {
          id: "cb-104",
          language: "js",
          code: "  await page.locator('text=/Log\\\\s*in/i').click();",
        },
      ],
    },
    {
      id: "id-data-testid-data-test-id-data-test-selectors",
      title: {
        en: "id, data-testid, data-test-id, data-test selectors",
        uk: "Селектори id, data-testid, data-test-id, data-test",
      },
      paragraphs: [
        {
          en: "Playwright supports shorthand for selecting elements using certain attributes. Currently, only\nthe following attributes are supported:",
          uk: "Playwright підтримує скорочений вибір елементів за певними атрибутами. Наразі підтримуються\nлише такі:",
        },
        {
          en: "- `id`\n- `data-testid`\n- `data-test-id`\n- `data-test`",
          uk: "- `id`\n- `data-testid`\n- `data-test-id`\n- `data-test`",
        },
      ],
      codeBlocks: [
        {
          id: "cb-109",
          language: "js",
          code: "// Fill an input with the id \"username\"\nawait page.locator('id=username').fill('value');\n\n// Click an element with data-test-id \"submit\"\nawait page.locator('data-test-id=submit').click();",
        },
      ],
    },
    {
      id: "chaining-selectors",
      title: {
        en: "Chaining selectors",
        uk: "Ланцюжок селекторів",
      },
      paragraphs: [
        {
          en: "Selectors defined as `engine=body` or in short-form can be combined with the `>>` token, e.g. `selector1 >> selector2 >> selectors3`. When selectors are chained, the next one is queried relative to the previous one's result.",
          uk: "Селектори у формі `engine=body` або короткі можна поєднувати токеном `>>`, наприклад `selector1 >> selector2 >> selectors3`. У ланцюжку кожний наступний запит відносно результату попереднього.",
        },
        {
          en: "For example,",
          uk: "Наприклад,",
        },
        {
          en: "is equivalent to",
          uk: "еквівалентно",
        },
        {
          en: 'If a selector needs to include `>>` in the body, it should be escaped inside a string to not be confused with chaining separator, e.g. `text="some >> text"`.',
          uk: 'Якщо в тілі селектора потрібен `>>`, його слід екранувати в рядку, щоб не плутати з роздільником ланцюга, наприклад `text="some >> text"`.',
        },
        {
          en: "### Intermediate matches",
          uk: "### Проміжні збіги",
        },
        {
          en: "By default, chained selectors resolve to an element queried by the last selector. A selector can be prefixed with `*` to capture elements that are queried by an intermediate selector.",
          uk: "За замовчуванням ланцюжок вказує на елемент, знайдений останнім селектором. Префікс `*` дозволяє захопити елемент, знайдений проміжним селектором.",
        },
        {
          en: "For example, `css=article >> text=Hello` captures the element with the text `Hello`, and `*css=article >> text=Hello` (note the `*`) captures the `article` element that contains some element with the text `Hello`.",
          uk: "Наприклад, `css=article >> text=Hello` дає елемент із текстом `Hello`, а `*css=article >> text=Hello` (зверніть увагу на `*`) — елемент `article`, який містить елемент із текстом `Hello`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-114",
          language: "txt",
          code: "css=article >> css=.bar > .baz >> css=span[attr=value]",
        },
        {
          id: "cb-115",
          language: "js",
          code: "document\n    .querySelector('article')\n    .querySelector('.bar > .baz')\n    .querySelector('span[attr=value]');",
        },
      ],
    },
  ],
  quiz: [],
}
