import type { PlaywrightTopic } from "../../types"

export const locatorsTopic: PlaywrightTopic = {
  slug: "locators",
  groupId: "guides",
  order: 245,
  level: "beginner",
  trackOrder: 6,
  sourceDoc: "locators.md",
  officialDocsUrl: "https://playwright.dev/docs/locators",
  title: {
    en: "Locators",
    uk: "Локатори",
  },
  summary: {
    en: "[Locator]s are the central piece of Playwright's auto-waiting and retry-ability. In a nutshell, locators represent a way to find element(s) on the page at any moment.",
    uk: "[Locator] — центральна частина автоматичного очікування та повторних спроб у Playwright. Простими словами, локатори описують спосіб знайти елемент(и) на сторінці в будь-який момент.",
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
          en: "[Locator]s are the central piece of Playwright's auto-waiting and retry-ability. In a nutshell, locators represent\na way to find element(s) on the page at any moment.",
          uk: "[Locator] — центральна частина автоматичного очікування та повторних спроб у Playwright. Простими словами, локатори описують спосіб знайти елемент(и) на сторінці в будь-який момент.",
        },
        {
          en: "### Quick Guide",
          uk: "### Швидкий довідник",
        },
        {
          en: "These are the recommended built-in locators.",
          uk: "Ось рекомендовані вбудовані локатори.",
        },
        {
          en: "- [`method: Page.getByRole`](#locate-by-role) to locate by explicit and implicit accessibility attributes.\n- [`method: Page.getByText`](#locate-by-text) to locate by text content.\n- [`method: Page.getByLabel`](#locate-by-label) to locate a form control by associated label's text.\n- [`method: Page.getByPlaceholder`](#locate-by-placeholder) to locate an input by placeholder.\n- [`method: Page.getByAltText`](#locate-by-alt-text) to locate an element, usually image, by its text alternative.\n- [`method: Page.getByTitle`](#locate-by-title) to locate an element by its title attribute.\n- [`method: Page.getByTestId`](#locate-by-test-id) to locate an element based on its `data-testid` attribute (other attributes can be configured).",
          uk: "- [`method: Page.getByRole`](#locate-by-role) — за явними й неявними атрибутами доступності.\n- [`method: Page.getByText`](#locate-by-text) — за текстовим вмістом.\n- [`method: Page.getByLabel`](#locate-by-label) — за текстом пов’язаного підпису до поля форми.\n- [`method: Page.getByPlaceholder`](#locate-by-placeholder) — за плейсхолдером поля введення.\n- [`method: Page.getByAltText`](#locate-by-alt-text) — за текстовою альтернативою, зазвичай для зображень.\n- [`method: Page.getByTitle`](#locate-by-title) — за атрибутом title.\n- [`method: Page.getByTestId`](#locate-by-test-id) — за атрибутом `data-testid` (інші атрибути можна налаштувати).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "await page.getByLabel('User Name').fill('John');\n\nawait page.getByLabel('Password').fill('secret-password');\n\nawait page.getByRole('button', { name: 'Sign in' }).click();\n\nawait expect(page.getByText('Welcome, John!')).toBeVisible();",
        },
      ],
    },
    {
      id: "locating-elements",
      title: {
        en: "Locating elements",
        uk: "Пошук елементів",
      },
      paragraphs: [
        {
          en: "Playwright comes with multiple built-in locators. To make tests resilient, we recommend prioritizing user-facing attributes and explicit contracts such as [`method: Page.getByRole`].",
          uk: "У Playwright є кілька вбудованих локаторів. Щоб тести були стійкими, радимо надавати перевагу атрибутам, які бачить користувач, і явним «контрактам», як-от [`method: Page.getByRole`].",
        },
        {
          en: "For example, consider the following DOM structure.",
          uk: "Наприклад, розгляньте таку структуру DOM.",
        },
        {
          en: 'Locate the element by its role of `button` with name "Sign in".',
          uk: "Знайдіть елемент за роллю `button` з ім’ям «Sign in».",
        },
        {
          en: "Every time a locator is used for an action, an up-to-date DOM element is located in the page. In the snippet\nbelow, the underlying DOM element will be located twice, once prior to every action. This means that if the\nDOM changes in between the calls due to re-render, the new element corresponding to the\nlocator will be used.",
          uk: "Щоразу, коли локатор використовують для дії, на сторінці знаходять актуальний елемент DOM. У фрагменті\nнижче відповідний елемент DOM шукають двічі — перед кожною дією. Тобто якщо між викликами DOM зміниться\nчерез повторний рендер, буде використано новий елемент, який відповідає локатору.",
        },
        {
          en: "Note that all methods that create a locator, such as [`method: Page.getByLabel`], are also available on the [Locator] and [FrameLocator] classes, so you can chain them and iteratively narrow down your locator.",
          uk: "Усі методи, що створюють локатор (наприклад [`method: Page.getByLabel`]), доступні також у класах [Locator] та [FrameLocator], тож їх можна ланцюгувати й поступово звужувати локатор.",
        },
        {
          en: "### Locate by role",
          uk: "### Пошук за роллю",
        },
        {
          en: "The [`method: Page.getByRole`] locator reflects how users and assistive technology perceive the page, for example whether some element is a button or a checkbox. When locating by role, you should usually pass the accessible name as well, so that the locator pinpoints the exact element.",
          uk: "Локатор [`method: Page.getByRole`] відображає, як сторінку сприймають користувачі та допоміжні технології — наприклад, чи елемент є кнопкою чи прапорцем. Зазвичай варто також передати доступну назву, щоб локатор однозначно вказував на потрібний елемент.",
        },
        {
          en: "For example, consider the following DOM structure.",
          uk: "Наприклад, розгляньте таку структуру DOM.",
        },
        {
          en: "You can locate each element by its implicit role:",
          uk: "Кожен елемент можна знайти за його неявною роллю:",
        },
        {
          en: "Role locators include [buttons, checkboxes, headings, links, lists, tables, and many more](https://www.w3.org/TR/html-aria/#docconformance) and follow W3C specifications for [ARIA role](https://www.w3.org/TR/wai-aria-1.2/#roles), [ARIA attributes](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) and [accessible name](https://w3c.github.io/accname/#dfn-accessible-name). Note that many html elements like `` have an [implicitly defined role](https://w3c.github.io/html-aam/#html-element-role-mappings) that is recognized by the role locator.",
          uk: "Рольові локатори охоплюють [кнопки, прапорці, заголовки, посилання, списки, таблиці та багато іншого](https://www.w3.org/TR/html-aria/#docconformance) і відповідають специфікаціям W3C для [ролі ARIA](https://www.w3.org/TR/wai-aria-1.2/#roles), [атрибутів ARIA](https://www.w3.org/TR/wai-aria-1.2/#aria-attributes) та [доступної назви](https://w3c.github.io/accname/#dfn-accessible-name). Зверніть увагу: багато HTML-елементів на кшталт `` мають [неявно визначену ролю](https://w3c.github.io/html-aam/#html-element-role-mappings), яку розпізнає рольовий локатор.",
        },
        {
          en: "Note that role locators **do not replace** accessibility audits and conformance tests, but rather give early feedback about the ARIA guidelines.",
          uk: "Рольові локатори **не замінюють** аудит доступності й тести відповідності, але дають ранній зворотний зв’язок щодо рекомендацій ARIA.",
        },
        {
          en: "### Locate by label",
          uk: "### Пошук за підписом (label)",
        },
        {
          en: "Most form controls usually have dedicated labels that could be conveniently used to interact with the form. In this case, you can locate the control by its associated label using [`method: Page.getByLabel`].",
          uk: "У більшості елементів форми є підписи, зручні для взаємодії. Тоді елемент можна знайти за пов’язаним підписом через [`method: Page.getByLabel`].",
        },
        {
          en: "For example, consider the following DOM structure.",
          uk: "Наприклад, розгляньте таку структуру DOM.",
        },
        {
          en: "You can fill the input after locating it by the label text:",
          uk: "Після пошуку за текстом підпису можна заповнити поле:",
        },
        {
          en: "### Locate by placeholder",
          uk: "### Пошук за плейсхолдером",
        },
        {
          en: "Inputs may have a placeholder attribute to hint to the user what value should be entered. You can locate such an input using [`method: Page.getByPlaceholder`].",
          uk: "У полів введення може бути атрибут placeholder як підказка щодо значення. Таке поле знаходять через [`method: Page.getByPlaceholder`].",
        },
        {
          en: "For example, consider the following DOM structure.",
          uk: "Наприклад, розгляньте таку структуру DOM.",
        },
        {
          en: "You can fill the input after locating it by the placeholder text:",
          uk: "Після пошуку за текстом плейсхолдера можна заповнити поле:",
        },
        {
          en: "### Locate by text",
          uk: "### Пошук за текстом",
        },
        {
          en: "Find an element by the text it contains. You can match by a substring, exact string, or a regular expression when using [`method: Page.getByText`].",
          uk: "Знайдіть елемент за текстом, який він містить. За допомогою [`method: Page.getByText`] можна збігати підрядок, точний рядок або регулярний вираз.",
        },
        {
          en: "For example, consider the following DOM structure.",
          uk: "Наприклад, розгляньте таку структуру DOM.",
        },
        {
          en: "You can locate the element by the text it contains:",
          uk: "Елемент можна знайти за текстом усередині:",
        },
        {
          en: "Set an exact match:",
          uk: "Точний збіг:",
        },
        {
          en: "Match with a regular expression:",
          uk: "Збіг за регулярним виразом:",
        },
        {
          en: "You can also [filter by text](#filter-by-text) which can be useful when trying to find a particular item in a list.",
          uk: "Також можна [фільтрувати за текстом](#filter-by-text) — зручно, коли потрібен конкретний елемент у списку.",
        },
        {
          en: "### Locate by alt text",
          uk: "### Пошук за alt-текстом",
        },
        {
          en: "All images should have an `alt` attribute that describes the image. You can locate an image based on the text alternative using [`method: Page.getByAltText`].",
          uk: "У зображень має бути атрибут `alt` з описом. Зображення знаходять за текстовою альтернативою через [`method: Page.getByAltText`].",
        },
        {
          en: "For example, consider the following DOM structure.",
          uk: "Наприклад, розгляньте таку структуру DOM.",
        },
        {
          en: "You can click on the image after locating it by the text alternative:",
          uk: "Після пошуку за текстовою альтернативою можна клікнути по зображенню:",
        },
        {
          en: "### Locate by title",
          uk: "### Пошук за атрибутом title",
        },
        {
          en: "Locate an element with a matching title attribute using [`method: Page.getByTitle`].",
          uk: "Елемент із відповідним атрибутом title знаходять через [`method: Page.getByTitle`].",
        },
        {
          en: "For example, consider the following DOM structure.",
          uk: "Наприклад, розгляньте таку структуру DOM.",
        },
        {
          en: "You can check the issues count after locating it by the title text:",
          uk: "Після пошуку за текстом у title можна перевірити кількість issues:",
        },
        {
          en: "### Locate by test id",
          uk: "### Пошук за test id",
        },
        {
          en: "Testing by test ids is the most resilient way of testing as even if your text or role of the attribute changes, the test will still pass. QA's and developers should define explicit test ids and query them with [`method: Page.getByTestId`]. However testing by test ids is not user facing. If the role or text value is important to you then consider using user facing locators such as [role](#locate-by-role) and [text locators](#locate-by-text).",
          uk: "Тестування за test id найстійкіше: навіть якщо зміниться текст або роль атрибута, тест може залишитися валідним. QA й розробники мають задавати явні test id і шукати їх через [`method: Page.getByTestId`]. Водночас test id не відображаються користувачу. Якщо важливі роль або текст, краще використовувати «людино-орієнтовані» локатори — [за роллю](#locate-by-role) та [текстові](#locate-by-text).",
        },
        {
          en: "For example, consider the following DOM structure.",
          uk: "Наприклад, розгляньте таку структуру DOM.",
        },
        {
          en: "You can locate the element by its test id:",
          uk: "Елемент можна знайти за test id:",
        },
        {
          en: "#### Set a custom test id attribute",
          uk: "#### Власний атрибут для test id",
        },
        {
          en: "By default, [`method: Page.getByTestId`] will locate elements based on the `data-testid` attribute, but you can configure it in your test config or by calling [`method: Selectors.setTestIdAttribute`].",
          uk: "За замовчуванням [`method: Page.getByTestId`] шукає за атрибутом `data-testid`, але це можна змінити в конфігурації тестів або викликом [`method: Selectors.setTestIdAttribute`].",
        },
        {
          en: "Set the test id to use a custom data attribute for your tests.",
          uk: "Установіть test id на користувацький data-атрибут для тестів.",
        },
        {
          en: "In your html you can now use `data-pw` as your test id instead of the default `data-testid`.",
          uk: "У HTML тепер можна використовувати `data-pw` як test id замість стандартного `data-testid`.",
        },
        {
          en: "And then locate the element as you would normally do:",
          uk: "Далі знаходьте елемент як зазвичай:",
        },
        {
          en: "### Locate by CSS or XPath",
          uk: "### Пошук за CSS або XPath",
        },
        {
          en: "If you absolutely must use CSS or XPath locators, you can use [`method: Page.locator`] to create a locator that takes a selector describing how to find an element in the page. Playwright supports CSS and XPath selectors, and auto-detects them if you omit `css=` or `xpath=` prefix.",
          uk: "Якщо без CSS- чи XPath-локаторів ніяк, скористайтеся [`method: Page.locator`], щоб створити локатор із селектором, який описує пошук на сторінці. Playwright підтримує CSS і XPath і сам визначає тип, якщо не вказувати префікси `css=` чи `xpath=`.",
        },
        {
          en: "XPath and CSS selectors can be tied to the DOM structure or implementation. These selectors can break when the DOM structure changes. Long CSS or XPath chains below are an example of a **bad practice** that leads to unstable tests:",
          uk: "XPath і CSS часто прив’язані до структури DOM або реалізації й ламаються при її зміні. Довгі ланцюжки CSS або XPath нижче — приклад **поганої практики**, що веде до нестабільних тестів:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "html",
          code: "Sign in",
        },
        {
          id: "cb-7",
          language: "js",
          code: "await page.getByRole('button', { name: 'Sign in' }).click();",
        },
        {
          id: "cb-12",
          language: "js",
          code: "const locator = page.getByRole('button', { name: 'Sign in' });\n\nawait locator.hover();\nawait locator.click();",
        },
        {
          id: "cb-17",
          language: "js",
          code: "const locator = page\n    .frameLocator('#my-frame')\n    .getByRole('button', { name: 'Sign in' });\n\nawait locator.click();",
        },
        {
          id: "cb-22",
          language: "html",
          code: "Sign up\n\n   Subscribe\n\nSubmit",
        },
        {
          id: "cb-23",
          language: "js",
          code: "await expect(page.getByRole('heading', { name: 'Sign up' })).toBeVisible();\n\nawait page.getByRole('checkbox', { name: 'Subscribe' }).check();\n\nawait page.getByRole('button', { name: /submit/i }).click();",
        },
        {
          id: "cb-28",
          language: "html",
          code: "Password",
        },
        {
          id: "cb-29",
          language: "js",
          code: "await page.getByLabel('Password').fill('secret');",
        },
        {
          id: "cb-34",
          language: "html",
          code: "",
        },
        {
          id: "cb-35",
          language: "js",
          code: "await page\n    .getByPlaceholder('name@example.com')\n    .fill('playwright@microsoft.com');",
        },
        {
          id: "cb-40",
          language: "html",
          code: "Welcome, John",
        },
        {
          id: "cb-41",
          language: "js",
          code: "await expect(page.getByText('Welcome, John')).toBeVisible();",
        },
        {
          id: "cb-46",
          language: "js",
          code: "await expect(page.getByText('Welcome, John', { exact: true })).toBeVisible();",
        },
        {
          id: "cb-51",
          language: "js",
          code: "await expect(page.getByText(/welcome, [A-Za-z]+$/i)).toBeVisible();",
        },
        {
          id: "cb-56",
          language: "html",
          code: "",
        },
        {
          id: "cb-57",
          language: "js",
          code: "await page.getByAltText('playwright logo').click();",
        },
        {
          id: "cb-62",
          language: "html",
          code: "25 issues",
        },
        {
          id: "cb-63",
          language: "js",
          code: "await expect(page.getByTitle('Issues count')).toHaveText('25 issues');",
        },
        {
          id: "cb-68",
          language: "html",
          code: "Itinéraire",
        },
        {
          id: "cb-69",
          language: "js",
          code: "await page.getByTestId('directions').click();",
        },
        {
          id: "cb-74",
          language: "js",
          code: "\nexport default defineConfig({\n  use: {\n    testIdAttribute: 'data-pw'\n  }\n});",
        },
        {
          id: "cb-79",
          language: "html",
          code: "Itinéraire",
        },
        {
          id: "cb-80",
          language: "js",
          code: "await page.getByTestId('directions').click();",
        },
        {
          id: "cb-85",
          language: "js",
          code: "await page.locator('css=button').click();\nawait page.locator('xpath=//button').click();\n\nawait page.locator('button').click();\nawait page.locator('//button').click();",
        },
        {
          id: "cb-90",
          language: "js",
          code: "await page.locator(\n    '#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input'\n).click();\n\nawait page\n    .locator('//*[@id=\"tsf\"]/div[2]/div[1]/div[1]/div/div[2]/input')\n    .click();",
        },
      ],
    },
    {
      id: "locate-in-shadow-dom",
      title: {
        en: "Locate in Shadow DOM",
        uk: "Пошук у Shadow DOM",
      },
      paragraphs: [
        {
          en: "All locators in Playwright **by default** work with elements in Shadow DOM. The exceptions are:\n- Locating by XPath does not pierce shadow roots.\n- [Closed-mode shadow roots](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters) are not supported.",
          uk: "Усі локатори Playwright **за замовчуванням** працюють з елементами в Shadow DOM. Винятки:\n- пошук за XPath не проходить крізь shadow root;\n- [shadow root у закритому режимі](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#parameters) не підтримується.",
        },
        {
          en: "Consider the following example with a custom web component:",
          uk: "Розгляньте приклад із власним веб-компонентом:",
        },
        {
          en: "You can locate in the same way as if the shadow root was not present at all.",
          uk: "Шукати можна так само, ніби shadow root взагалі немає.",
        },
        {
          en: "To click `Details`:",
          uk: "Щоб клікнути `Details`:",
        },
        {
          en: "To click ``:",
          uk: "Щоб клікнути ``:",
        },
        {
          en: 'To ensure that `` contains the text "Details":',
          uk: "Щоб переконатися, що `` містить текст «Details»:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-95",
          language: "html",
          code: "\n  Title\n  #shadow-root\n    Details",
        },
        {
          id: "cb-96",
          language: "js",
          code: "await page.getByText('Details').click();",
        },
        {
          id: "cb-101",
          language: "html",
          code: "\n  Title\n  #shadow-root\n    Details",
        },
        {
          id: "cb-102",
          language: "js",
          code: "await page.locator('x-details', { hasText: 'Details' }).click();",
        },
        {
          id: "cb-107",
          language: "html",
          code: "\n  Title\n  #shadow-root\n    Details",
        },
        {
          id: "cb-108",
          language: "js",
          code: "await expect(page.locator('x-details')).toContainText('Details');",
        },
      ],
    },
    {
      id: "filtering-locators",
      title: {
        en: "Filtering Locators",
        uk: "Фільтрація локаторів",
      },
      paragraphs: [
        {
          en: "Consider the following DOM structure where we want to click on the buy button of the second product card. We have a few options in order to filter the locators to get the right one.",
          uk: "Нижче структура DOM, де потрібно клікнути кнопку купівлі на другій картці товару. Є кілька способів відфільтрувати локатори, щоб вибрати потрібний.",
        },
        {
          en: "### Filter by text",
          uk: "### Фільтр за текстом",
        },
        {
          en: "Locators can be filtered by text with the [`method: Locator.filter`] method. It will search for a particular string somewhere inside the element, possibly in a descendant element, case-insensitively. You can also pass a regular expression.",
          uk: "Локатори можна фільтрувати за текстом методом [`method: Locator.filter`]: шукає заданий рядок десь усередині елемента, зокрема в нащадку, без урахування регістра. Можна передати й регулярний вираз.",
        },
        {
          en: "Use a regular expression:",
          uk: "Регулярний вираз:",
        },
        {
          en: "### Filter by not having text",
          uk: "### Фільтр за відсутністю тексту",
        },
        {
          en: "Alternatively, filter by **not having** text:",
          uk: "Альтернативно — фільтр за **відсутністю** тексту:",
        },
        {
          en: "### Filter by child/descendant",
          uk: "### Фільтр за нащадком",
        },
        {
          en: "Locators support an option to only select elements that have or have not a descendant matching another locator. You can therefore filter by any other locator such as a [`method: Locator.getByRole`], [`method: Locator.getByTestId`], [`method: Locator.getByText`] etc.",
          uk: "Локатори підтримують опцію вибору лише елементів, у яких є або немає нащадка, що відповідає іншому локатору. Тож можна фільтрувати будь-яким іншим локатором — [`method: Locator.getByRole`], [`method: Locator.getByTestId`], [`method: Locator.getByText`] тощо.",
        },
        {
          en: "We can also assert the product card to make sure there is only one:",
          uk: "Можна також перевірити картку товару, щоб переконатися, що вона одна:",
        },
        {
          en: "The filtering locator **must be relative** to the original locator and is queried starting with the original locator match, not the document root. Therefore, the following will not work, because the filtering locator starts matching from the `` list element that is outside of the `` list item matched by the original locator:",
          uk: "Фільтрувальний локатор **має бути відносним** до вихідного: пошук починається зі збігу вихідного локатора, а не з кореня документа. Тому наведений нижче варіант не спрацює: фільтр починає збіг з елемента списку ``, який лежить поза елементом списку ``, знайденим вихідним локатором:",
        },
        {
          en: "### Filter by not having child/descendant",
          uk: "### Фільтр за відсутністю нащадка",
        },
        {
          en: "We can also filter by **not having** a matching element inside.",
          uk: "Також можна фільтрувати за **відсутністю** відповідного елемента всередині.",
        },
        {
          en: "Note that the inner locator is matched starting from the outer one, not from the document root.",
          uk: "Внутрішній локатор збігається від зовнішнього, а не від кореня документа.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-113",
          language: "html",
          code: "\n  \n    Product 1\n    Add to cart\n  \n  \n    Product 2\n    Add to cart",
        },
        {
          id: "cb-114",
          language: "js",
          code: "await page\n    .getByRole('listitem')\n    .filter({ hasText: 'Product 2' })\n    .getByRole('button', { name: 'Add to cart' })\n    .click();",
        },
        {
          id: "cb-119",
          language: "js",
          code: "await page\n    .getByRole('listitem')\n    .filter({ hasText: /Product 2/ })\n    .getByRole('button', { name: 'Add to cart' })\n    .click();",
        },
        {
          id: "cb-124",
          language: "js",
          code: "// 5 in-stock items\nawait expect(page.getByRole('listitem').filter({ hasNotText: 'Out of stock' })).toHaveCount(5);",
        },
        {
          id: "cb-129",
          language: "html",
          code: "\n  \n    Product 1\n    Add to cart\n  \n  \n    Product 2\n    Add to cart",
        },
        {
          id: "cb-130",
          language: "js",
          code: "await page\n    .getByRole('listitem')\n    .filter({ has: page.getByRole('heading', { name: 'Product 2' }) })\n    .getByRole('button', { name: 'Add to cart' })\n    .click();",
        },
        {
          id: "cb-135",
          language: "js",
          code: "await expect(page\n    .getByRole('listitem')\n    .filter({ has: page.getByRole('heading', { name: 'Product 2' }) }))\n    .toHaveCount(1);",
        },
        {
          id: "cb-140",
          language: "js",
          code: "// ✖ WRONG\nawait expect(page\n    .getByRole('listitem')\n    .filter({ has: page.getByRole('list').getByText('Product 2') }))\n    .toHaveCount(1);",
        },
        {
          id: "cb-145",
          language: "js",
          code: "await expect(page\n    .getByRole('listitem')\n    .filter({ hasNot: page.getByText('Product 2') }))\n    .toHaveCount(1);",
        },
      ],
    },
    {
      id: "locator-operators",
      title: {
        en: "Locator operators",
        uk: "Оператори локаторів",
      },
      paragraphs: [
        {
          en: "### Matching inside a locator",
          uk: "### Збіг всередині локатора",
        },
        {
          en: "You can chain methods that create a locator, like [`method: Page.getByText`] or [`method: Locator.getByRole`], to narrow down the search to a particular part of the page.",
          uk: "Можна ланцюгувати методи, що створюють локатор, наприклад [`method: Page.getByText`] або [`method: Locator.getByRole`], щоб звузити пошук до певної частини сторінки.",
        },
        {
          en: 'In this example we first create a locator called product by locating its role of `listitem`. We then filter by text. We can use the product locator again to get by role of button and click it and then use an assertion to make sure there is only one product with the text "Product 2".',
          uk: "Спочатку створюємо локатор product за роллю `listitem`, потім фільтруємо за текстом. Далі знову використовуємо product, щоб знайти кнопку й клікнути, і перевірити, що лише один товар з текстом «Product 2».",
        },
        {
          en: 'You can also chain two locators together, for example to find a "Save" button inside a particular dialog:',
          uk: "Можна поєднати два локатори, наприклад знайти кнопку «Save» всередині певного діалогу:",
        },
        {
          en: "### Matching two locators simultaneously",
          uk: "### Одночасний збіг двох локаторів",
        },
        {
          en: "Method [`method: Locator.and`] narrows down an existing locator by matching an additional locator. For example, you can combine [`method: Page.getByRole`] and [`method: Page.getByTitle`] to match by both role and title.",
          uk: "Метод [`method: Locator.and`] звужує наявний локатор додатковим збігом. Наприклад, можна поєднати [`method: Page.getByRole`] та [`method: Page.getByTitle`], щоб збігатися і за роллю, і за title.",
        },
        {
          en: "### Matching one of the two alternative locators",
          uk: "### Збіг з одного з двох альтернативних локаторів",
        },
        {
          en: "If you'd like to target one of the two or more elements, and you don't know which one it will be, use [`method: Locator.or`] to create a locator that matches any one or both of the alternatives.",
          uk: "Якщо потрібен один із двох чи більше елементів і невідомо який саме, використовуйте [`method: Locator.or`], щоб локатор збігався з будь-яким або з обома варіантами.",
        },
        {
          en: 'For example, consider a scenario where you\'d like to click on a "New email" button, but sometimes a security settings dialog shows up instead. In this case, you can wait for either a "New email" button, or a dialog and act accordingly.',
          uk: "Наприклад, потрібно клікнути «New email», але іноді з’являється діалог налаштувань безпеки. Тоді можна дочекатися або кнопки «New email», або діалогу й діяти відповідно.",
        },
        {
          en: "### Matching only visible elements",
          uk: "### Лише видимі елементи",
        },
        {
          en: "Consider a page with two buttons, the first invisible and the second [visible](./actionability.md#visible).",
          uk: "Сторінка з двома кнопками: перша невидима, друга [видима](./actionability.md#visible).",
        },
        {
          en: "* This will find both buttons and throw a [strictness](./locators.md#strictness) violation error:",
          uk: "* Це знайде обидві кнопки й викине помилку порушення [суворості](./locators.md#strictness):",
        },
        {
          en: "* This will only find a second button, because it is visible, and then click it.",
          uk: "* Це знайде лише другу кнопку, бо вона видима, і клікне по ній.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-150",
          language: "js",
          code: "const product = page.getByRole('listitem').filter({ hasText: 'Product 2' });\n\nawait product.getByRole('button', { name: 'Add to cart' }).click();\n\nawait expect(product).toHaveCount(1);",
        },
        {
          id: "cb-155",
          language: "js",
          code: "const saveButton = page.getByRole('button', { name: 'Save' });\n// ...\nconst dialog = page.getByTestId('settings-dialog');\nawait dialog.locator(saveButton).click();",
        },
        {
          id: "cb-160",
          language: "js",
          code: "const button = page.getByRole('button').and(page.getByTitle('Subscribe'));",
        },
        {
          id: "cb-165",
          language: "js",
          code: "const newEmail = page.getByRole('button', { name: 'New' });\nconst dialog = page.getByText('Confirm security settings');\nawait expect(newEmail.or(dialog).first()).toBeVisible();\nif (await dialog.isVisible())\n  await page.getByRole('button', { name: 'Dismiss' }).click();\nawait newEmail.click();",
        },
        {
          id: "cb-170",
          language: "html",
          code: "Invisible\nVisible",
        },
        {
          id: "cb-171",
          language: "js",
          code: "  await page.locator('button').click();",
        },
        {
          id: "cb-176",
          language: "js",
          code: "  await page.locator('button').filter({ visible: true }).click();",
        },
      ],
    },
    {
      id: "lists",
      title: {
        en: "Lists",
        uk: "Списки",
      },
      paragraphs: [
        {
          en: "### Count items in a list",
          uk: "### Підрахунок елементів у списку",
        },
        {
          en: "You can assert locators in order to count the items in a list.",
          uk: "Можна перевіряти локатори, щоб порахувати елементи в списку.",
        },
        {
          en: "For example, consider the following DOM structure:",
          uk: "Наприклад, розгляньте таку структуру DOM:",
        },
        {
          en: "Use the count assertion to ensure that the list has 3 items.",
          uk: "Використайте перевірку кількості, щоб переконатися, що в списку 3 елементи.",
        },
        {
          en: "### Assert all text in a list",
          uk: "### Перевірка всього тексту в списку",
        },
        {
          en: "You can assert locators in order to find all the text in a list.",
          uk: "Можна перевіряти локатори, щоб отримати весь текст у списку.",
        },
        {
          en: "For example, consider the following DOM structure:",
          uk: "Наприклад, розгляньте таку структуру DOM:",
        },
        {
          en: 'Use [`method: LocatorAssertions.toHaveText`] to ensure that the list has the text "apple", "banana" and "orange".',
          uk: "За допомогою [`method: LocatorAssertions.toHaveText`] переконайтеся, що в списку тексти «apple», «banana» та «orange».",
        },
        {
          en: "### Get a specific item",
          uk: "### Отримати конкретний елемент",
        },
        {
          en: "There are many ways to get a specific item in a list.\n#### Get by text",
          uk: "Є багато способів вибрати конкретний елемент у списку.\n#### За текстом",
        },
        {
          en: "Use the [`method: Page.getByText`] method to locate an element in a list by its text content and then click on it.",
          uk: "Метод [`method: Page.getByText`] знаходить елемент у списку за текстом, після чого можна клікнути.",
        },
        {
          en: "For example, consider the following DOM structure:",
          uk: "Наприклад, розгляньте таку структуру DOM:",
        },
        {
          en: "Locate an item by its text content and click it.",
          uk: "Знайдіть елемент за текстом і клікніть.",
        },
        {
          en: "#### Filter by text\nUse the [`method: Locator.filter`] to locate a specific item in a list.",
          uk: "#### Фільтр за текстом\nВикористайте [`method: Locator.filter`], щоб знайти конкретний елемент у списку.",
        },
        {
          en: "For example, consider the following DOM structure:",
          uk: "Наприклад, розгляньте таку структуру DOM:",
        },
        {
          en: 'Locate an item by the role of "listitem" and then filter by the text of "orange" and then click it.',
          uk: "Знайдіть елемент за роллю «listitem», відфільтруйте за текстом «orange» і клікніть.",
        },
        {
          en: "#### Get by test id",
          uk: "#### За test id",
        },
        {
          en: "Use the [`method: Page.getByTestId`] method to locate an element in a list. You may need to modify the html and add a test id if you don't already have a test id.",
          uk: "Метод [`method: Page.getByTestId`] знаходить елемент у списку. Можливо, доведеться змінити HTML і додати test id, якщо його ще немає.",
        },
        {
          en: "For example, consider the following DOM structure:",
          uk: "Наприклад, розгляньте таку структуру DOM:",
        },
        {
          en: 'Locate an item by its test id of "orange" and then click it.',
          uk: "Знайдіть елемент за test id «orange» і клікніть.",
        },
        {
          en: "#### Get by nth item",
          uk: "#### За порядковим номером (nth)",
        },
        {
          en: "If you have a list of identical elements, and the only way to distinguish between them is the order, you can choose a specific element from a list with [`method: Locator.first`], [`method: Locator.last`] or [`method: Locator.nth`].",
          uk: "Якщо елементи однакові й розрізнити їх можна лише порядком, виберіть конкретний через [`method: Locator.first`], [`method: Locator.last`] або [`method: Locator.nth`].",
        },
        {
          en: "However, use this method with caution. Often times, the page might change, and the locator will point to a completely different element from the one you expected. Instead, try to come up with a unique locator that will pass the [strictness criteria](#strictness).",
          uk: "Використовуйте обережно: сторінка може змінитися, і локатор вкаже зовсім не на той елемент. Краще підібрати унікальний локатор, який задовольняє [критерії суворості](#strictness).",
        },
        {
          en: "### Chaining filters",
          uk: "### Ланцюжок фільтрів",
        },
        {
          en: "When you have elements with various similarities, you can use the [`method: Locator.filter`] method to select the right one. You can also chain multiple filters to narrow down the selection.",
          uk: "Коли елементи частково схожі, [`method: Locator.filter`] допомагає вибрати потрібний. Можна ланцюгувати кілька фільтрів.",
        },
        {
          en: "For example, consider the following DOM structure:",
          uk: "Наприклад, розгляньте таку структуру DOM:",
        },
        {
          en: 'To take a screenshot of the row with "Mary" and "Say goodbye":',
          uk: "Щоб зробити скриншот рядка з «Mary» та «Say goodbye»:",
        },
        {
          en: 'You should now have a "screenshot.png" file in your project\'s root directory.',
          uk: "У корені проєкту має з’явитися файл «screenshot.png».",
        },
        {
          en: "### Rare use cases",
          uk: "### Рідкі сценарії",
        },
        {
          en: "#### Do something with each element in the list",
          uk: "#### Дія з кожним елементом списку",
        },
        {
          en: "Iterate elements:",
          uk: "Ітерація по елементах:",
        },
        {
          en: "Iterate using regular for loop:",
          uk: "Ітерація звичайним циклом for:",
        },
        {
          en: "#### Evaluate in the page",
          uk: "#### Обчислення в контексті сторінки",
        },
        {
          en: "The code inside [`method: Locator.evaluateAll`] runs in the page, you can call any DOM apis there.",
          uk: "Код у [`method: Locator.evaluateAll`] виконується в сторінці; там можна викликати будь-які DOM API.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-181",
          language: "html",
          code: "\n  apple\n  banana\n  orange",
        },
        {
          id: "cb-182",
          language: "js",
          code: "await expect(page.getByRole('listitem')).toHaveCount(3);",
        },
        {
          id: "cb-187",
          language: "html",
          code: "\n  apple\n  banana\n  orange",
        },
        {
          id: "cb-188",
          language: "js",
          code: "await expect(page\n    .getByRole('listitem'))\n    .toHaveText(['apple', 'banana', 'orange']);",
        },
        {
          id: "cb-193",
          language: "html",
          code: "\n  apple\n  banana\n  orange",
        },
        {
          id: "cb-194",
          language: "js",
          code: "await page.getByText('orange').click();",
        },
        {
          id: "cb-199",
          language: "html",
          code: "\n  apple\n  banana\n  orange",
        },
        {
          id: "cb-200",
          language: "js",
          code: "await page\n    .getByRole('listitem')\n    .filter({ hasText: 'orange' })\n    .click();",
        },
        {
          id: "cb-205",
          language: "html",
          code: "\n  apple\n  banana\n  orange",
        },
        {
          id: "cb-206",
          language: "js",
          code: "await page.getByTestId('orange').click();",
        },
        {
          id: "cb-211",
          language: "js",
          code: "const banana = await page.getByRole('listitem').nth(1);",
        },
        {
          id: "cb-216",
          language: "html",
          code: "\n  \n    John\n    Say hello\n  \n  \n    Mary\n    Say hello\n  \n  \n    John\n    Say goodbye\n  \n  \n    Mary\n    Say goodbye",
        },
        {
          id: "cb-217",
          language: "js",
          code: "const rowLocator = page.getByRole('listitem');\n\nawait rowLocator\n    .filter({ hasText: 'Mary' })\n    .filter({ has: page.getByRole('button', { name: 'Say goodbye' }) })\n    .screenshot({ path: 'screenshot.png' });",
        },
        {
          id: "cb-222",
          language: "js",
          code: "for (const row of await page.getByRole('listitem').all())\n  console.log(await row.textContent());",
        },
        {
          id: "cb-227",
          language: "js",
          code: "const rows = page.getByRole('listitem');\nconst count = await rows.count();\nfor (let i = 0; i < count; ++i)\n  console.log(await rows.nth(i).textContent());",
        },
        {
          id: "cb-232",
          language: "js",
          code: "const rows = page.getByRole('listitem');\nconst texts = await rows.evaluateAll(\n    list => list.map(element => element.textContent));",
        },
      ],
    },
    {
      id: "strictness",
      title: {
        en: "Strictness",
        uk: "Суворість",
      },
      paragraphs: [
        {
          en: "Locators are strict. This means that all operations on locators that imply\nsome target DOM element will throw an exception if more than one element matches. For example, the following call throws if there are several buttons in the DOM:",
          uk: "Локатори суворі: усі операції, що передбачають один цільовий елемент DOM,\nвикинуть виняток, якщо збігається більше одного елемента. Наприклад, наведений виклик падає, якщо у DOM кілька кнопок:",
        },
        {
          en: "#### Throws an error if more than one",
          uk: "#### Помилка, якщо більше одного",
        },
        {
          en: "On the other hand, Playwright understands when you perform a multiple-element operation,\nso the following call works perfectly fine when the locator resolves to multiple elements.",
          uk: "Натомість Playwright розуміє операції над кількома елементами,\nтож такий виклик коректний, коли локатор збігається з кількома елементами.",
        },
        {
          en: "#### Works fine with multiple elements",
          uk: "#### Коректно з кількома елементами",
        },
        {
          en: "You can explicitly opt-out from strictness check by telling Playwright which element to use when multiple elements match, through [`method: Locator.first`], [`method: Locator.last`], and [`method: Locator.nth`]. These methods are **not recommended** because when your page changes, Playwright may click on an element you did not intend. Instead, follow best practices above to create a locator that uniquely identifies the target element.",
          uk: "Можна явно вимкнути суворість, вказавши, який елемент брати при кількох збігах, через [`method: Locator.first`], [`method: Locator.last`] та [`method: Locator.nth`]. Ці методи **не рекомендуються**: після зміни сторінки Playwright може клікнути не туди. Краще дотримуйтеся практик вище й створіть локатор, що однозначно визначає ціль.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-237",
          language: "js",
          code: "await page.getByRole('button').click();",
        },
        {
          id: "cb-242",
          language: "js",
          code: "await page.getByRole('button').count();",
        },
      ],
    },
    {
      id: "more-locators",
      title: {
        en: "More Locators",
        uk: "Більше про локатори",
      },
      paragraphs: [
        {
          en: "For less commonly used locators, look at the [other locators](./other-locators.md) guide.",
          uk: "Рідкіші локатори описані в [посібнику «Інші локатори»](./other-locators.md).",
        },
      ],
    },
  ],
  quiz: [],
}
