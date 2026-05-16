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
    en: "When getByRole, getByLabel, getByText don't cut it — usually with legacy apps or unusual DOM structures — I reach for CSS pseudo-classes, XPath, layout-based selectors, or nth= indexing. These are escape hatches, not first choices. The most useful ones in practice: :has() to get a parent by child, :visible to filter hidden duplicates, and nth= to pick one from a list.",
    uk: "Коли getByRole, getByLabel, getByText не справляються — зазвичай зі старими застосунками або нестандартними DOM-структурами — я беруся за CSS-псевдокласи, XPath, layout-селектори або індексування через nth=. Це запасні виходи, а не перший вибір. Найкорисніші на практиці: :has() щоб отримати батьківський елемент за дочірнім, :visible щоб відфільтрувати приховані дублікати, і nth= щоб вибрати один зі списку.",
  },
  sections: [
    {
      id: "when-to-use",
      title: {
        en: "When I use these locators",
        uk: "Коли я використовую ці локатори",
      },
      paragraphs: [
        {
          en: "The priority order: `getByRole` > `getByLabel` > `getByText` > `getByTestId` > everything in this file. I only reach for CSS/XPath when the preferred locators literally can't target the element — usually legacy apps without semantic HTML, or complex table/grid structures.",
          uk: "Пріоритет: `getByRole` > `getByLabel` > `getByText` > `getByTestId` > все що в цьому файлі. До CSS/XPath вдаюся лише коли preferred локатори буквально не можуть націлитися на елемент — зазвичай legacy-застосунки без семантичного HTML або складні структури таблиць/гридів.",
        },
        {
          en: "The two I use most often from this list: `:has()` to get a parent by child, and `:visible` to exclude hidden duplicates.",
          uk: "Двоє яких я найчастіше використовую з цього списку: `:has()` щоб отримати батьківський елемент за дочірнім, і `:visible` щоб виключити приховані дублікати.",
        },
      ],
    },
    {
      id: "css-locator",
      title: {
        en: "CSS locator — and Playwright's additions",
        uk: "CSS-локатор — і доповнення Playwright",
      },
      paragraphs: [
        {
          en: "Playwright's `page.locator('css=...')` accepts standard CSS selectors, but also adds pseudo-classes that don't exist in native CSS:",
          uk: "Playwright `page.locator('css=...')` приймає стандартні CSS-селектори але також додає псевдокласи яких не існує у нативному CSS:",
        },
        {
          en: "**`:has-text()`** — matches any element that contains the text somewhere inside (case-insensitive substring). Combine it with a tag or class to avoid matching the whole document.\n\n**`:text()`** — matches the smallest element containing the text.\n\n**`:text-is()`** — exact, case-sensitive text match.\n\n**`:visible`** — filters to only visible elements. Useful when there are hidden duplicate elements with the same selector.",
          uk: "**`:has-text()`** — збігається з будь-яким елементом що містить текст всередині (регістронечутливий підрядок). Поєднуй із тегом або класом щоб не матчити весь документ.\n\n**`:text()`** — збігається з найменшим елементом що містить текст.\n\n**`:text-is()`** — точний, чутливий до регістру збіг тексту.\n\n**`:visible`** — фільтрує тільки видимі елементи. Корисно коли є приховані дублікати з однаковим селектором.",
        },
      ],
      codeBlocks: [
        {
          id: "css-examples",
          language: "ts",
          code: `// :has-text() — знайти article що містить "Playwright" десь всередині
await page.locator('article:has-text("Playwright")').click()
// Неправильно — матчить весь <body> теж:
// await page.locator(':has-text("Playwright")').click()

// :visible — коли є і видима і прихована кнопки
// page.locator('button').click() — кине помилку: знайдено 2 збіги
await page.locator('button:visible').click()  // тільки видима

// :text() — найменший елемент з текстом "Home" у #nav-bar
await page.locator('#nav-bar :text("Home")').click()

// :text-is() — точний збіг, чутливий до регістру
await page.locator('#nav-bar :text-is("Home")').click()
// Не збігатиметься з "home" або "Homepage"`,
        },
      ],
    },
    {
      id: "has-parent",
      title: {
        en: "Getting a parent element by its child",
        uk: "Отримання батьківського елемента за дочірнім",
      },
      paragraphs: [
        {
          en: "This is the most practical use case I have for CSS pseudo-classes. I have a list of items, each with a label and a button. I want to click the button in the row that has label 'Acme Corp'. The preferred way is `locator.filter({ has: child })`:",
          uk: "Це найпрактичніший кейс використання CSS псевдокласів. Є список елементів, кожен з міткою і кнопкою. Хочу клікнути кнопку в рядку де мітка 'Acme Corp'. Кращий спосіб — `locator.filter({ has: child })`:",
        },
        {
          en: "The CSS `:has()` pseudo-class does the same thing directly:",
          uk: "CSS-псевдоклас `:has()` робить те саме напряму:",
        },
        {
          en: "If neither works, `xpath=..` as a last resort goes up one DOM level. Avoid it in stable tests — DOM structure changes will break it.",
          uk: "Якщо жодне не підходить, `xpath=..` як останній засіб піднімається на один рівень DOM. Уникай його в стабільних тестах — зміни структури DOM зламають його.",
        },
      ],
      codeBlocks: [
        {
          id: "parent-by-child",
          language: "ts",
          code: `// Кращий спосіб: locator.filter({ has: child })
const row = page.getByRole('listitem').filter({
  has: page.getByText('Acme Corp')
})
await row.getByRole('button', { name: 'Edit' }).click()

// Через CSS :has()
await page.locator('li:has(:text("Acme Corp"))').getByRole('button', { name: 'Edit' }).click()

// Останній засіб: xpath=.. (підняться на рівень вгору)
const label = page.getByText('Acme Corp')
const parent = label.locator('xpath=..')`,
        },
      ],
    },
    {
      id: "layout-locators",
      title: {
        en: "Layout-based locators",
        uk: "Локатори на основі розташування",
      },
      paragraphs: [
        {
          en: "When an element has no unique attributes or text but is positioned relative to another element, I can use layout pseudo-classes. These work on pixel positions — not DOM structure.",
          uk: "Коли елемент не має унікальних атрибутів або тексту але розташований відносно іншого елемента — можу використовувати layout псевдокласи. Вони працюють на основі пікселів, не DOM-структури.",
        },
        {
          en: "I always combine layout pseudo-classes with a selector — using them alone often matches empty wrapper elements instead of the actual target.",
          uk: "Завжди комбіную layout псевдокласи з селектором — використані самостійно вони часто матчать порожні wrapper-елементи замість реальної цілі.",
        },
      ],
      codeBlocks: [
        {
          id: "layout-examples",
          language: "ts",
          code: `// Заповнити поле праворуч від мітки "Username"
await page.locator('input:right-of(:text("Username"))').fill('admin')

// Клікнути кнопку поруч із promo-карткою (в межах 50px)
await page.locator('button:near(.promo-card)').click()

// Вибрати найближчий radio до "Option 3"
await page.locator('[type=radio]:left-of(:text("Option 3"))').first().click()

// Всі layout псевдокласи:
// :right-of()  :left-of()  :above()  :below()  :near()
// Всі підтримують опціональну максимальну відстань у px:
await page.locator('button:near(:text("Save"), 120)').click()`,
        },
      ],
    },
    {
      id: "nth-and-xpath",
      title: {
        en: "nth= indexing and XPath",
        uk: "Індексування nth= і XPath",
      },
      paragraphs: [
        {
          en: "`nth=` picks a specific element by zero-based index from a locator result. Useful when there are multiple identical elements and I want a specific one by position.",
          uk: "`nth=` вибирає конкретний елемент за нульовим індексом з результату локатора. Корисно коли є кілька однакових елементів і потрібен конкретний за позицією.",
        },
        {
          en: "XPath locators are the last resort. They work, but they're fragile — any DOM restructuring breaks them. I use XPath only when CSS approaches have failed.",
          uk: "XPath-локатори — останній засіб. Вони працюють але крихкі: будь-яка реструктуризація DOM їх ломає. XPath використовую лише коли CSS-підходи не спрацювали.",
        },
      ],
      codeBlocks: [
        {
          id: "nth-xpath",
          language: "ts",
          code: `// nth= — нульовий індекс
await page.locator('button').locator('nth=0').click()   // перша кнопка
await page.locator('button').locator('nth=-1').click()  // остання кнопка

// Чекати поки з'явиться третя кнопка
await page.locator(':nth-match(:text("Buy"), 3)').waitFor()

// XPath
await page.locator('xpath=//button[@data-action="save"]').click()

// XPath об'єднання (| для "або")
await page.locator('xpath=//span[@class="spinner"]|//div[@id="confirmation"]').waitFor()`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your page has a table of orders. Each row has an order number and a 'Cancel' button. You want to click Cancel for the row with order number 'ORD-1042'. There's no unique test id on the button. What's the cleanest approach?",
        uk: "Сторінка має таблицю замовлень. Кожен рядок має номер замовлення і кнопку 'Cancel'. Хочеш натиснути Cancel у рядку з номером замовлення 'ORD-1042'. На кнопці немає унікального test id. Який найчистіший підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use XPath to navigate: //tr[contains(., 'ORD-1042')]//button",
            uk: "Використати XPath: //tr[contains(., 'ORD-1042')]//button",
          },
        },
        {
          id: "b",
          label: {
            en: "Use locator.filter(): page.getByRole('row').filter({ has: page.getByText('ORD-1042') }).getByRole('button', { name: 'Cancel' }).click()",
            uk: "Використати locator.filter(): page.getByRole('row').filter({ has: page.getByText('ORD-1042') }).getByRole('button', { name: 'Cancel' }).click()",
          },
        },
        {
          id: "c",
          label: {
            en: "Use nth= to pick the right row by its index in the table",
            uk: "Використати nth= щоб вибрати потрібний рядок за індексом у таблиці",
          },
        },
        {
          id: "d",
          label: {
            en: "Use page.locator('tr:has-text(\"ORD-1042\")').getByRole('button', { name: 'Cancel' }).click()",
            uk: "Використати page.locator('tr:has-text(\"ORD-1042\")').getByRole('button', { name: 'Cancel' }).click()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`locator.filter({ has: child })` is exactly the right tool here — it scopes a locator to only elements that contain a specific child. The result is expressive: 'give me the row that contains ORD-1042, then find the Cancel button inside it'. XPath would work but is fragile (structure-dependent). `nth=` by index is terrible — the order can change, so the test would pick the wrong row when orders are reordered.",
        uk: "`locator.filter({ has: child })` — це саме правильний інструмент тут: звужує локатор до елементів що містять конкретний дочірній. Результат виразний: 'дай мені рядок що містить ORD-1042, потім знайди кнопку Cancel всередині'. XPath спрацює але крихкий (залежить від структури). `nth=` за індексом — жахливо: порядок може змінитися і тест вибере неправильний рядок коли замовлення переставлять.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What does the :visible CSS pseudo-class do in Playwright selectors?",
        uk: "Що робить CSS псевдоклас :visible у Playwright селекторах?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It selects elements with visibility: visible CSS property only",
            uk: "Вибирає елементи лише з CSS властивістю visibility: visible",
          },
        },
        {
          id: "b",
          label: {
            en: "It filters the locator result to only include elements that are currently visible on the page, excluding hidden duplicates",
            uk: "Фільтрує результат локатора щоб включати лише елементи що зараз видимі на сторінці, виключаючи приховані дублікати",
          },
        },
        {
          id: "c",
          label: {
            en: ":visible is standard CSS and is not specific to Playwright",
            uk: ":visible є стандартним CSS і не є специфічним для Playwright",
          },
        },
        {
          id: "d",
          label: {
            en: "It selects elements that are within the visible viewport area",
            uk: "Вибирає елементи що знаходяться в межах видимої області viewport",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`:visible` is a Playwright-specific CSS pseudo-class (not native CSS) that filters to only elements visible to the user. It's most useful when a page has both a visible and a hidden copy of the same element — for example, a mobile nav that duplicates the desktop nav but hides it with CSS. Without `:visible`, `page.locator('button')` would throw a 'strict mode violation' if multiple matches exist.",
        uk: "`:visible` — це Playwright-специфічний CSS псевдоклас (не нативний CSS) що фільтрує до елементів видимих для користувача. Найкорисніший коли сторінка має видиму і приховану копії одного елемента — наприклад, мобільна навігація що дублює десктопну але ховає її CSS. Без `:visible`, `page.locator('button')` кине помилку 'strict mode violation' якщо є кілька збігів.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the recommended priority order for choosing a locator strategy in Playwright?",
        uk: "Який рекомендований порядок пріоритету для вибору стратегії локатора в Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "CSS selector > XPath > getByText > getByRole",
            uk: "CSS селектор > XPath > getByText > getByRole",
          },
        },
        {
          id: "b",
          label: {
            en: "getByRole > getByLabel > getByText > getByTestId > CSS/XPath as last resort",
            uk: "getByRole > getByLabel > getByText > getByTestId > CSS/XPath як останній засіб",
          },
        },
        {
          id: "c",
          label: {
            en: "getByTestId > getByRole > CSS selector > XPath",
            uk: "getByTestId > getByRole > CSS селектор > XPath",
          },
        },
        {
          id: "d",
          label: {
            en: "All strategies are equal — use whichever is most concise",
            uk: "Всі стратегії рівнозначні — використовуй найбільш стислу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's recommended priority is: `getByRole` (tests accessibility), then `getByLabel`, `getByText`, `getByTestId`, and only then CSS/XPath. The preferred locators are resilient to implementation changes — they test what the user sees and interacts with. CSS and XPath are escape hatches for legacy apps or unusual DOM structures where semantic locators literally can't target the element.",
        uk: "Рекомендований пріоритет Playwright: `getByRole` (тестує доступність), потім `getByLabel`, `getByText`, `getByTestId`, і лише потім CSS/XPath. Preferred локатори стійкі до змін реалізації — вони тестують те що користувач бачить і з чим взаємодіє. CSS і XPath — запасні виходи для legacy-застосунків або нестандартних DOM-структур де семантичні локатори буквально не можуть націлитися на елемент.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What does nth=-1 select when used with a locator?",
        uk: "Що вибирає nth=-1 при використанні з локатором?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It throws an error — negative indices are not supported",
            uk: "Кидає помилку — від'ємні індекси не підтримуються",
          },
        },
        {
          id: "b",
          label: {
            en: "The last element in the locator result set",
            uk: "Останній елемент в результаті локатора",
          },
        },
        {
          id: "c",
          label: {
            en: "The second-to-last element in the locator result set",
            uk: "Передостанній елемент в результаті локатора",
          },
        },
        {
          id: "d",
          label: {
            en: "One element before the first match — useful for ancestors",
            uk: "Один елемент перед першим збігом — корисно для предків",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`nth=-1` selects the last element from the locator's result set, similar to how Python uses negative indexing. `nth=0` is the first element. This is useful when you need the last row in a dynamically growing list without knowing the total count. For example: `page.locator('tr').locator('nth=-1')` selects the last table row.",
        uk: "`nth=-1` вибирає останній елемент з результату локатора, подібно до того як Python використовує від'ємну індексацію. `nth=0` — перший елемент. Корисно коли потрібен останній рядок в динамічно зростаючому списку без знання загальної кількості. Наприклад: `page.locator('tr').locator('nth=-1')` вибирає останній рядок таблиці.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You need to locate an input field that has no label or placeholder, but is positioned to the right of the text 'Username'. Which locator should you use?",
        uk: "Потрібно знайти поле введення без мітки або placeholder, але розташоване праворуч від тексту 'Username'. Який локатор використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.locator('input').nth(0) — assume it's the first input on the page",
            uk: "page.locator('input').nth(0) — припустити що це перше поле на сторінці",
          },
        },
        {
          id: "b",
          label: {
            en: "page.locator('input:right-of(:text(\"Username\"))') — layout-based locator",
            uk: "page.locator('input:right-of(:text(\"Username\"))') — локатор на основі розташування",
          },
        },
        {
          id: "c",
          label: {
            en: "page.getByText('Username').locator('..') — go to the parent element",
            uk: "page.getByText('Username').locator('..') — перейти до батьківського елемента",
          },
        },
        {
          id: "d",
          label: {
            en: "page.locator('xpath=//input[preceding-sibling::*[text()=\"Username\"]]')",
            uk: "page.locator('xpath=//input[preceding-sibling::*[text()=\"Username\"]]')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's layout pseudo-classes like `:right-of()`, `:left-of()`, `:above()`, `:below()`, and `:near()` find elements by their pixel position relative to another element. `input:right-of(:text('Username'))` finds an input that is visually to the right of the 'Username' text. This is designed exactly for legacy form layouts without proper labels. Always combine layout pseudo-classes with a tag or class to avoid matching wrapper elements.",
        uk: "Layout псевдокласи Playwright як `:right-of()`, `:left-of()`, `:above()`, `:below()` і `:near()` знаходять елементи за їхньою пікселеною позицією відносно іншого елемента. `input:right-of(:text('Username'))` знаходить input що візуально праворуч від тексту 'Username'. Це розроблено саме для legacy форм без належних міток. Завжди комбінуй layout псевдокласи з тегом або класом щоб не матчити wrapper-елементи.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What is the key difference between :has-text() and :text() CSS pseudo-classes in Playwright?",
        uk: "Яка ключова різниця між CSS псевдокласами :has-text() і :text() в Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: ":has-text() is case-sensitive; :text() is case-insensitive",
            uk: ":has-text() чутливий до регістру; :text() нечутливий",
          },
        },
        {
          id: "b",
          label: {
            en: ":has-text() matches any ancestor element containing the text anywhere inside; :text() matches the smallest element that directly contains the text",
            uk: ":has-text() збігається з будь-яким елементом-предком що містить текст будь-де всередині; :text() збігається з найменшим елементом що безпосередньо містить текст",
          },
        },
        {
          id: "c",
          label: {
            en: ":text() supports regex patterns; :has-text() only supports plain strings",
            uk: ":text() підтримує regex патерни; :has-text() підтримує лише звичайні рядки",
          },
        },
        {
          id: "d",
          label: {
            en: "They are identical — both find the smallest element containing the text",
            uk: "Вони ідентичні — обидва знаходять найменший елемент що містить текст",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`:has-text()` matches any element that contains the text somewhere inside it — including ancestors. This means `:has-text('Playwright')` would match the entire `<body>` if the word appears anywhere on the page, so you should always combine it with a tag (e.g. `article:has-text('Playwright')`). `:text()` specifically matches the smallest element whose text content contains the substring — much more targeted. `:text-is()` is the exact, case-sensitive version.",
        uk: "`:has-text()` збігається з будь-яким елементом що містить текст десь всередині — включно з предками. Це означає що `:has-text('Playwright')` збіглося б з усім `<body>` якщо слово є десь на сторінці, тому завжди комбінуй з тегом (напр. `article:has-text('Playwright')`). `:text()` конкретно збігається з найменшим елементом чий текстовий контент містить підрядок — набагато точніше. `:text-is()` — точний варіант з урахуванням регістру.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Why are XPath locators considered a last resort in Playwright?",
        uk: "Чому XPath локатори вважаються останнім засобом у Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "XPath is slower to execute than CSS selectors in the browser",
            uk: "XPath повільніше виконується ніж CSS селектори у браузері",
          },
        },
        {
          id: "b",
          label: {
            en: "XPath locators are tied to DOM structure — any HTML restructuring breaks them, making tests fragile and hard to maintain",
            uk: "XPath локатори прив'язані до DOM-структури — будь-яка HTML реструктуризація їх ламає, роблячи тести крихкими і важкими у підтримці",
          },
        },
        {
          id: "c",
          label: {
            en: "XPath is not supported in Firefox and WebKit in Playwright",
            uk: "XPath не підтримується у Firefox і WebKit в Playwright",
          },
        },
        {
          id: "d",
          label: {
            en: "Playwright's auto-waiting doesn't work with XPath locators",
            uk: "Playwright auto-waiting не працює з XPath локаторами",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "XPath selectors describe a path through the DOM tree — things like '//div[3]/ul/li[2]/button'. This means they break whenever a developer adds a wrapper div, reorders elements, or changes nesting depth. Semantic locators like `getByRole` or CSS `:has()` describe what the element IS (its role, label, or relationship to content) rather than WHERE it is in the tree, making them resilient to internal restructuring.",
        uk: "XPath селектори описують шлях через DOM-дерево — речі на кшталт '//div[3]/ul/li[2]/button'. Це означає що вони ламаються коли розробник додає wrapper div, переставляє елементи або змінює глибину вкладення. Семантичні локатори як `getByRole` або CSS `:has()` описують чим елемент Є (його роль, мітку або відношення до контенту) а не ДЕ він знаходиться в дереві, роблячи їх стійкими до внутрішньої реструктуризації.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "A page has both a visible dropdown and a hidden mobile dropdown with the same CSS class. page.locator('.dropdown').click() throws a strict mode violation. What is the cleanest fix?",
        uk: "Сторінка має видимий dropdown і прихований мобільний dropdown з однаковим CSS класом. page.locator('.dropdown').click() кидає strict mode violation. Яке найчистіше виправлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use page.locator('.dropdown').first().click() to always pick the first match",
            uk: "Використати page.locator('.dropdown').first().click() щоб завжди вибирати перший збіг",
          },
        },
        {
          id: "b",
          label: {
            en: "Use page.locator('.dropdown:visible').click() to target only the visible element",
            uk: "Використати page.locator('.dropdown:visible').click() щоб націлитися лише на видимий елемент",
          },
        },
        {
          id: "c",
          label: {
            en: "Add a unique id attribute to the visible dropdown and target that",
            uk: "Додати унікальний атрибут id до видимого dropdown і націлитися на нього",
          },
        },
        {
          id: "d",
          label: {
            en: "Use page.locator('.dropdown').nth(0).click() — first() and nth(0) are the same",
            uk: "Використати page.locator('.dropdown').nth(0).click() — first() і nth(0) однакові",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`:visible` is exactly the right tool for this situation. It filters the locator result to only elements that are currently visible, so `.dropdown:visible` resolves to only the visible dropdown and the strict mode violation goes away. Using `.first()` or `.nth(0)` would also resolve the strict violation, but is fragile — it assumes the visible one is always first in the DOM. Adding a unique id is a better long-term fix but requires changing app code.",
        uk: "`:visible` — саме правильний інструмент для цієї ситуації. Він фільтрує результат локатора до елементів що зараз видимі, тому `.dropdown:visible` резолвиться до лише видимого dropdown і порушення strict mode зникає. Використання `.first()` або `.nth(0)` також вирішить strict violation, але крихке — припускає що видимий завжди перший у DOM. Додавання унікального id — краще довгострокове виправлення але вимагає зміни коду застосунку.",
      },
    },
  ],
}
