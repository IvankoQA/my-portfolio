import type { PlaywrightTopic } from "../../types"

export const ariaSnapshotsTopic: PlaywrightTopic = {
  slug: "aria-snapshots",
  groupId: "guides",
  order: 115,
  sourceDoc: "aria-snapshots.md",
  officialDocsUrl: "https://playwright.dev/docs/aria-snapshots",
  title: {
    en: "Snapshot testing",
    uk: "Snapshot-тестування",
  },
  summary: {
    en: "With Playwright's Snapshot testing you can assert the accessibility tree of a page against a predefined snapshot template.",
    uk: "У Playwright snapshot-тести дозволяють звіряти дерево доступності сторінки з наперед заданим шаблоном знімка.",
  },
  sections: [
    {
      id: "overview",
      title: {
        en: "Overview",
        uk: "Огляд",
      },
      paragraphs: [
        {
          en: "With Playwright's Snapshot testing you can assert the accessibility tree of a page against a predefined snapshot template.",
          uk: "У Playwright snapshot-тести дозволяють звіряти дерево доступності сторінки з наперед заданим шаблоном знімка.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: 'await page.goto(\'https://playwright.dev/\');\nawait expect(page).toMatchAriaSnapshot(`\n  - banner:\n    - heading /Playwright enables reliable end-to-end/ [level=1]\n    - link "Get started":\n      - /url: /docs/intro\n    - link "Star microsoft/playwright on GitHub":\n      - /url: https://github.com/microsoft/playwright\n    - link /[\\\\d]+k\\\\+ stargazers on GitHub/\n`);',
        },
      ],
    },
    {
      id: "assertion-testing-vs-snapshot-testing",
      title: {
        en: "Assertion testing vs Snapshot testing",
        uk: "Перевірки твердженнями (assertions) проти snapshot-тестів",
      },
      paragraphs: [
        {
          en: "Snapshot testing and assertion testing serve different purposes in test automation:",
          uk: "Snapshot-тести й перевірки твердженнями вирішують різні задачі в автоматизації:",
        },
        {
          en: "### Assertion testing\nAssertion testing is a targeted approach where you assert specific values or conditions about elements or components. For instance, with Playwright, [`method: LocatorAssertions.toHaveText`]\nverifies that an element contains the expected text, and [`method: LocatorAssertions.toHaveValue`]\nconfirms that an input field has the expected value.\nAssertion tests are specific and generally check the current state of an element or property\nagainst an expected, predefined state.\nThey work well for predictable, single-value checks but are limited in scope when testing the\nbroader structure or variations.",
          uk: "### Перевірки твердженнями (assertions)\nТут ви явно перевіряєте конкретні значення або умови для елементів. Наприклад, у Playwright [`method: LocatorAssertions.toHaveText`]\nперевіряє текст елемента, а [`method: LocatorAssertions.toHaveValue`] — значення поля вводу.\nТакі тести зазвичай звіряють поточний стан з наперед заданим очікуванням.\nВони добре підходять для передбачуваних одиничних перевірок, але гірше масштабуються на широку структуру або багато варіацій.",
        },
        {
          en: "**Advantages**\n- **Clarity**: The intent of the test is explicit and easy to understand.\n- **Specificity**: Tests focus on particular aspects of functionality, making them more robust\n  against unrelated changes.\n- **Debugging**: Failures provide targeted feedback, pointing directly to the problematic aspect.",
          uk: "**Переваги**\n- **Зрозумілість**: намір тесту явний.\n- **Фокус**: перевіряються конкретні аспекти — менше хибних спрацьовувань від сторонніх змін.\n- **Дебаг**: падіння вказують прямо на проблемне місце.",
        },
        {
          en: "**Disadvantages**\n- **Verbose for complex outputs**: Writing assertions for complex data structures or large outputs\n  can be cumbersome and error-prone.\n- **Maintenance overhead**: As code evolves, manually updating assertions can be time-consuming.",
          uk: "**Недоліки**\n- **Багато коду** для складних структур або великих виходів.\n- **Підтримка**: при еволюції коду ручне оновлення асершенів забирає час.",
        },
        {
          en: "### Snapshot testing\nSnapshot testing captures a “snapshot” or representation of the entire\nstate of an element, component, or data at a given moment, which is then saved for future\ncomparisons. When re-running tests, the current state is compared to the snapshot, and if there\nare differences, the test fails. This approach is especially useful for complex or dynamic\nstructures, where manually asserting each detail would be too time-consuming. Snapshot testing\nis broader and more holistic than assertion testing, allowing you to track more complex changes over time.",
          uk: "### Snapshot-тестування\nЗнімок фіксує стан елемента, компонента або даних у момент часу й зберігається для подальших порівнянь.\nПри повторному запуску поточний стан звіряється зі знімком; розбіжність — падіння тесту.\nЗручно для складних структур, де ручні асершени на кожну деталь були б надто дорогими.\nSnapshot охоплює ширше й дозволяє відстежувати складніші зміни в часі.",
        },
        {
          en: "**Advantages**\n- **Simplifies complex outputs**: For example, testing a UI component's rendered output can be tedious with traditional assertions. Snapshots capture the entire output for easy comparison.\n- **Quick Feedback loop**: Developers can easily spot unintended changes in the output.\n- **Encourages consistency**: Helps maintain consistent output as code evolves.",
          uk: "**Переваги**\n- **Спрощує складні виходи**: увесь рендер можна порівняти одним знімком.\n- **Швидкий зворотний зв’язок**: неочікувані зміни видно одразу.\n- **Послідовність**: легше тримати стабільний вигляд при змінах коду.",
        },
        {
          en: "**Disadvantages**\n- **Over-Reliance**: It can be tempting to accept changes to snapshots without fully understanding\n  them, potentially hiding bugs.\n- **Granularity**: Large snapshots may be hard to interpret when differences arise, especially\n  if minor changes affect large portions of the output.\n- **Suitability**: Not ideal for highly dynamic content where outputs change frequently or\n  unpredictably.",
          uk: "**Недоліки**\n- **Сліпе оновлення**: легко «погодити» знімок, не розібравшись, і сховати баг.\n- **Деталізація**: великі знімки важко читати при дифах.\n- **Не для всього**: погано для сильно динамічного контенту з хаотичними змінами.",
        },
        {
          en: "### When to use",
          uk: "### Коли що використовувати",
        },
        {
          en: "- **Snapshot testing** is ideal for:\n  - UI testing of whole pages and components.\n  - Broad structural checks for complex UI components.\n  - Regression testing for outputs that rarely change structure.",
          uk: "- **Snapshot-тести** доречні для:\n  - UI цілих сторінок і компонентів.\n  - широких структурних перевірок складного UI.\n  - регресій, де структура рідко змінюється.",
        },
        {
          en: "- **Assertion testing** is ideal for:\n  - Core logic validation.\n  - Computed value testing.\n  - Fine-grained tests requiring precise conditions.",
          uk: "- **Асершени** доречні для:\n  - перевірки бізнес-логіки.\n  - обчислених значень.\n  - дрібнозернистих умов.",
        },
        {
          en: "By combining snapshot testing for broad, structural checks and assertion testing for specific functionality, you can achieve a well-rounded testing strategy.",
          uk: "Поєднуючи snapshot для структури та асершени для конкретної поведінки, отримуєте збалансовану стратегію тестування.",
        },
      ],
    },
    {
      id: "aria-snapshots",
      title: {
        en: "Aria snapshots",
        uk: "Aria snapshots",
      },
      paragraphs: [
        {
          en: "In Playwright, aria snapshots provide a YAML representation of the accessibility tree of a page.\nThese snapshots can be stored and compared later to verify if the page structure remains consistent or meets defined\nexpectations.",
          uk: "У Playwright aria snapshot — це YAML-подання дерева доступності сторінки.\nЗнімки можна зберігати й пізніше звіряти з поточною структурою або вимогами.",
        },
        {
          en: "The YAML format describes the hierarchical structure of accessible elements on the page, detailing **roles**, **attributes**, **values**, and **text content**.\nThe structure follows a tree-like syntax, where each node represents an accessible element, and indentation indicates\nnested elements.",
          uk: "YAML описує ієрархію доступних елементів: **ролі**, **атрибути**, **значення** та **текст**.\nВузол — елемент дерева; відступи показують вкладеність.",
        },
        {
          en: "Each accessible element in the tree is represented as a YAML node:",
          uk: "Кожен доступний елемент — окремий вузол YAML:",
        },
        {
          en: '- **role**: Specifies the ARIA or HTML role of the element (e.g., `heading`, `list`, `listitem`, `button`).\n- **"name"**: Accessible name of the element. Quoted strings indicate exact values, `/patterns/` are used for regular expression.\n- **[attribute=value]**: Attributes and values, in square brackets, represent specific ARIA attributes, such\n  as `checked`, `disabled`, `expanded`, `level`, `pressed`, or `selected`.',
          uk: '- **role** — ARIA або HTML-роль (`heading`, `list`, `listitem`, `button` тощо).\n- **"name"** — доступна назва; у лапках точний рядок, `/шаблон/` — регулярний вираз.\n- **[attribute=value]** — атрибути в квадратних дужках (`checked`, `disabled`, `expanded`, `level`, `pressed`, `selected` тощо).',
        },
        {
          en: "These values are derived from ARIA attributes or calculated based on HTML semantics. To inspect the accessibility tree\nstructure of a page, use the [Chrome DevTools Accessibility Tab](https://developer.chrome.com/docs/devtools/accessibility/reference#tab).",
          uk: "Значення беруться з ARIA або обчислюються з HTML-семантики. Дерево доступності можна переглянути у [вкладці Accessibility Chrome DevTools](https://developer.chrome.com/docs/devtools/accessibility/reference#tab).",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "yaml",
          code: '- role "name" [attribute=value]',
        },
      ],
    },
    {
      id: "snapshot-matching",
      title: {
        en: "Snapshot matching",
        uk: "Звіряння зі знімком",
      },
      paragraphs: [
        {
          en: "The [`method: PageAssertions.toMatchAriaSnapshot`] assertion method in Playwright compares the accessible\nstructure of the page with a predefined aria snapshot template, helping validate the page's state against\ntesting requirements. You can also use [`method: LocatorAssertions.toMatchAriaSnapshot`] to match a specific part of the page.",
          uk: "[`method: PageAssertions.toMatchAriaSnapshot`] порівнює доступну структуру сторінки з шаблоном aria snapshot.\n[`method: LocatorAssertions.toMatchAriaSnapshot`] — звірити лише частину сторінки.",
        },
        {
          en: "For the following DOM:",
          uk: "Для такого DOM:",
        },
        {
          en: "You can match it using the following snapshot template:",
          uk: "Підійде такий шаблон знімка:",
        },
        {
          en: "When matching, the snapshot template is compared to the current accessibility tree of the page:",
          uk: "При звірянні шаблон порівнюється з поточним деревом доступності:",
        },
        {
          en: "* If the tree structure matches the template, the test passes; otherwise, it fails, indicating a mismatch between\n  expected and actual accessibility states.\n* The comparison is case-sensitive and collapses whitespace, so indentation and line breaks are ignored.\n* The comparison is order-sensitive, meaning the order of elements in the snapshot template must match the order in the\n  page's accessibility tree.",
          uk: "* Якщо структура збігається — тест проходить; інакше — розбіжність очікуваного й фактичного стану доступності.\n* Порівняння чутливе до регістру; пробіли згортаються — відступи й переноси рядків ігноруються.\n* Порядок вузлів має збігатися з порядком у дереві доступності сторінки.",
        },
        {
          en: "### Partial matching",
          uk: "### Часткове збігання",
        },
        {
          en: "You can perform partial matches on nodes by omitting attributes or accessible names, enabling verification of specific\nparts of the accessibility tree without requiring exact matches. This flexibility is helpful for dynamic or irrelevant\nattributes.",
          uk: "Можна опускати атрибути або доступні назви — перевіряється лише потрібна частина дерева. Зручно для динамічних або неважливих атрибутів.",
        },
        {
          en: 'In this example, the button role is matched, but the accessible name ("Submit") is not specified, allowing the test to\npass regardless of the button\'s label.',
          uk: "Тут збігається роль `button`, але не вказано назву «Submit» — тест проходить з будь-яким підписом кнопки.",
        },
        {
          en: "For elements with ARIA attributes like `checked` or `disabled`, omitting these attributes allows partial matching,\nfocusing solely on role and hierarchy.",
          uk: "Для елементів з `checked` чи `disabled` можна не вказувати ці атрибути — перевіряються роль і ієрархія.",
        },
        {
          en: "In this partial match, the `checked` attribute is ignored, so the test will pass regardless of the checkbox state.",
          uk: "У цьому частковому збіганні `checked` ігнорується — тест проходить незалежно від стану чекбокса.",
        },
        {
          en: "Similarly, you can partially match children in lists or groups by omitting specific list items or nested elements.",
          uk: "Аналогічно можна опускати окремі елементи списку або вкладені вузли.",
        },
        {
          en: "Partial matches let you create flexible snapshot tests that verify essential page structure without enforcing\nspecific content or attributes.",
          uk: "Часткові збігання дають гнучкі тести структури без жорсткої фіксації всього контенту й атрибутів.",
        },
        {
          en: "### Strict matching",
          uk: "### Суворе збігання",
        },
        {
          en: "By default, a template containing the subset of children will be matched:",
          uk: "За замовчуванням шаблон із підмножиною нащадків збігається так:",
        },
        {
          en: "The `/children` property can be used to control how child elements are matched:\n- `contain` (default): Matches if all specified children are present in order\n- `equal`: Matches if the children exactly match the specified list in order\n- `deep-equal`: Matches if the children exactly match the specified list in order, including nested children",
          uk: "Властивість `/children` керує збіганням нащадків:\n- `contain` (за замовчуванням): усі вказані діти присутні в тому ж порядку\n- `equal`: діти точно збігаються зі списком у тому ж порядку\n- `deep-equal`: те саме, включно з вкладеними рівнями",
        },
        {
          en: "Following snapshot will fail due to Feature C not being in the template:",
          uk: "Наступний знімок впаде, бо в шаблоні немає Feature C:",
        },
        {
          en: "#### Setting `children` mode globally",
          uk: "#### Глобальний режим `children`",
        },
        {
          en: "Instead of adding a `/children` property to every snapshot, you can set the default children matching mode for all\n`toMatchAriaSnapshot` calls in the configuration file:",
          uk: "Замість `/children` у кожному знімку можна задати режим за замовчуванням для всіх викликів `toMatchAriaSnapshot` у конфігурації:",
        },
        {
          en: "Individual snapshots can still override the global setting by including an explicit `/children` property in the template.",
          uk: "Окремий знімок може перевизначити глобальне значення явним `/children` у шаблоні.",
        },
        {
          en: "### Matching with regular expressions",
          uk: "### Збігання з регулярними виразами",
        },
        {
          en: "Regular expressions allow flexible matching for elements with dynamic or variable text. Accessible names and text can\nsupport regex patterns.",
          uk: "Регулярні вирази зручні для динамічного тексту; доступні назви й текст підтримують патерни `/.../`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "html",
          code: "title",
        },
        {
          id: "cb-8",
          language: "js",
          code: 'await expect(page).toMatchAriaSnapshot(`\n  - heading "title"\n`);',
        },
        {
          id: "cb-13",
          language: "html",
          code: "Submit",
        },
        {
          id: "cb-14",
          language: "yaml",
          code: "- button",
        },
        {
          id: "cb-15",
          language: "html",
          code: "",
        },
        {
          id: "cb-16",
          language: "yaml",
          code: "- checkbox",
        },
        {
          id: "cb-17",
          language: "html",
          code: "\n  Feature A\n  Feature B\n  Feature C",
        },
        {
          id: "cb-18",
          language: "yaml",
          code: "- list\n  - listitem: Feature B",
        },
        {
          id: "cb-19",
          language: "html",
          code: "\n  Feature A\n  Feature B\n  Feature C",
        },
        {
          id: "cb-20",
          language: "yaml",
          code: "- list\n  - listitem: Feature B",
        },
        {
          id: "cb-21",
          language: "html",
          code: "\n  Feature A\n  Feature B\n  Feature C",
        },
        {
          id: "cb-22",
          language: "yaml",
          code: "- list\n  - /children: equal\n  - listitem: Feature A\n  - listitem: Feature B",
        },
        {
          id: "cb-23",
          language: "js",
          code: "\nexport default defineConfig({\n  expect: {\n    toMatchAriaSnapshot: {\n      children: 'equal',\n    },\n  },\n});",
        },
        {
          id: "cb-24",
          language: "html",
          code: "Issues 12",
        },
        {
          id: "cb-25",
          language: "yaml",
          code: "- heading /Issues \\d+/",
        },
      ],
    },
    {
      id: "generating-snapshots",
      title: {
        en: "Generating snapshots",
        uk: "Генерація знімків",
      },
      paragraphs: [
        {
          en: "Creating aria snapshots in Playwright helps ensure and maintain your application's structure.\nYou can generate snapshots in various ways depending on your testing setup and workflow.",
          uk: "Aria snapshots допомагають зафіксувати й підтримувати структуру застосунку.\nСпособи генерації залежать від вашого workflow.",
        },
        {
          en: "### Generating snapshots with the Playwright code generator",
          uk: "### Генерація через Code Generator",
        },
        {
          en: "If you're using Playwright's [Code Generator](./codegen.md), generating aria snapshots is streamlined with its\ninteractive interface:",
          uk: "У [Code Generator](./codegen.md) aria snapshots зручно створювати через інтерактивний інтерфейс:",
        },
        {
          en: '- **"Assert snapshot" Action**: In the code generator, you can use the "Assert snapshot" action to automatically create\na snapshot assertion for the selected elements. This is a quick way to capture the aria snapshot as part of your\nrecorded test flow.',
          uk: "- **Дія «Assert snapshot»**: автоматично додає assertion зі знімком для вибраних елементів у записаному сценарії.",
        },
        {
          en: '- **"Aria snapshot" Tab**: The "Aria snapshot" tab within the code generator interface visually represents the\naria snapshot for a selected locator, letting you explore, inspect, and verify element roles, attributes, and\naccessible names to aid snapshot creation and review.',
          uk: "- **Вкладка «Aria snapshot»**: показує знімок для вибраного локатора — ролі, атрибути та доступні назви для перегляду й редагування.",
        },
        {
          en: "### Updating snapshots with `@playwright/test` and the `--update-snapshots` flag",
          uk: "### Оновлення знімків через `@playwright/test` і `--update-snapshots`",
        },
        {
          en: "When using the Playwright test runner (`@playwright/test`), you can automatically update snapshots with the `--update-snapshots` flag, `-u` for short.",
          uk: "У `@playwright/test` знімки оновлюються прапором `--update-snapshots` (скорочено `-u`).",
        },
        {
          en: "Running tests with the `--update-snapshots` flag will update snapshots that did not match. Matching snapshots will not be updated.",
          uk: "Оновлюються лише знімки, що не збіглися; ті, що вже ок — лишаються без змін.",
        },
        {
          en: "Updating snapshots is useful when application structure changes require new snapshots as a baseline. Note that Playwright will wait for the maximum expect timeout specified in the test runner configuration to ensure the page is settled before taking the snapshot. It might be necessary to adjust the `--timeout` if the test hits the timeout while generating snapshots.",
          uk: "Оновлення базової лінії зручне після зміни структури UI. Playwright чекає до expect timeout з конфігу, поки сторінка «встигне». За таймауту під час генерації збільшіть `--timeout`.",
        },
        {
          en: "#### Empty template for snapshot generation",
          uk: "#### Порожній шаблон для генерації",
        },
        {
          en: "Passing an empty string as the template in an assertion generates a snapshot on-the-fly:",
          uk: "Порожній рядок як шаблон у assertion згенерує знімок на льоту:",
        },
        {
          en: "Note that Playwright will wait for the maximum expect timeout specified in the test runner configuration to ensure the\npage is settled before taking the snapshot. It might be necessary to adjust the `--timeout` if the test hits the timeout\nwhile generating snapshots.",
          uk: "Знову діє очікування до expect timeout; за потреби збільшіть `--timeout`.",
        },
        {
          en: "#### Snapshot patch files",
          uk: "#### Patch-файли знімків",
        },
        {
          en: "When updating snapshots, Playwright creates patch files that capture differences. These patch files can be reviewed,\napplied, and committed to source control, allowing teams to track structural changes over time and ensure updates are\nconsistent with application requirements.",
          uk: "При оновленні створюються patch-файли з різницею — їх можна переглянути, застосувати (`git apply`) й закомітити, щоб відстежувати зміни структури.",
        },
        {
          en: "The way source code is updated can be changed using the `--update-source-method` flag. There are several options available:",
          uk: "Спосіб запису в код задає `--update-source-method`:",
        },
        {
          en: '- **"patch"** (default): Generates a unified diff file that can be applied to the source code using `git apply`.\n- **"3way"**: Generates merge conflict markers in your source code, allowing you to choose whether to accept changes.\n- **"overwrite"**: Overwrites the source code with the new snapshot values.',
          uk: '- **"patch"** (за замовчуванням): unified diff для `git apply`.\n- **"3way"**: маркери конфлікту злиття в коді — вибір змін вручну.\n- **"overwrite"**: повністю перезаписує значення знімка в коді.',
        },
        {
          en: "#### Snapshots as separate files",
          uk: "#### Знімки в окремих файлах",
        },
        {
          en: "To store your snapshots in a separate file, use the `toMatchAriaSnapshot` method with the `name` option, specifying a `.aria.yml` file extension.",
          uk: "Для файлу використовуйте `toMatchAriaSnapshot` з опцією `name` і розширенням `.aria.yml`.",
        },
        {
          en: "By default, snapshots from a test file `example.spec.ts` are placed in the `example.spec.ts-snapshots` directory. As snapshots should be the same across browsers, only one snapshot is saved even if testing with multiple browsers. Should you wish, you can customize the [snapshot path template](./api/class-testconfig#test-config-snapshot-path-template) using the following configuration:",
          uk: "За замовчуванням знімки для `example.spec.ts` лежать у `example.spec.ts-snapshots`. Між браузерами зберігається один файл. Шлях можна змінити через [snapshot path template](./api/class-testconfig#test-config-snapshot-path-template).",
        },
        {
          en: "### Using [`method: Page.ariaSnapshot`] and [`method: Locator.ariaSnapshot`]",
          uk: "### Методи [`method: Page.ariaSnapshot`] та [`method: Locator.ariaSnapshot`]",
        },
        {
          en: "Methods [`method: Page.ariaSnapshot`] and [`method: Locator.ariaSnapshot`] allow you to programmatically create a YAML representation of accessible\nelements within a locator's scope, especially helpful for generating snapshots dynamically during test execution.",
          uk: "Ці методи повертають YAML доступних елементів у межах локатора — зручно генерувати знімки динамічно під час тесту.",
        },
        {
          en: "**Example**:",
          uk: "**Приклад**:",
        },
        {
          en: "This command outputs the aria snapshot within the specified locator's scope in YAML format, which you can validate\nor store as needed.",
          uk: "Команда виводить aria snapshot у YAML для перевірки або збереження.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-26",
          language: "bash",
          code: "npx playwright test --update-snapshots",
        },
        {
          id: "cb-27",
          language: "js",
          code: "await expect(locator).toMatchAriaSnapshot('');",
        },
        {
          id: "cb-28",
          language: "bash",
          code: "npx playwright test --update-snapshots --update-source-method=3way",
        },
        {
          id: "cb-29",
          language: "js",
          code: "await expect(page.getByRole('main')).toMatchAriaSnapshot({ name: 'main.aria.yml' });",
        },
        {
          id: "cb-30",
          language: "js",
          code: "export default defineConfig({\n  expect: {\n    toMatchAriaSnapshot: {\n      pathTemplate: '__snapshots__/{testFilePath}/{arg}{ext}',\n    },\n  },\n});",
        },
        {
          id: "cb-31",
          language: "js",
          code: "const snapshot = await page.ariaSnapshot();\nconsole.log(snapshot);",
        },
      ],
    },
    {
      id: "accessibility-tree-examples",
      title: {
        en: "Accessibility tree examples",
        uk: "Приклади дерева доступності",
      },
      paragraphs: [
        {
          en: "### Headings with level attributes",
          uk: "### Заголовки з атрибутом level",
        },
        {
          en: "Headings can include a `level` attribute indicating their heading level.",
          uk: "У заголовків може бути атрибут `level` — рівень заголовка.",
        },
        {
          en: "### Text nodes",
          uk: "### Текстові вузли",
        },
        {
          en: "Standalone or descriptive text elements appear as text nodes.",
          uk: "Окремий або описовий текст з’являється як text node.",
        },
        {
          en: "### Inline multiline text",
          uk: "### Багаторядковий текст",
        },
        {
          en: "Multiline text, such as paragraphs, is normalized in the aria snapshot.",
          uk: "Багаторядковий текст (наприклад, абзаци) нормалізується в знімку.",
        },
        {
          en: "### Links",
          uk: "### Посилання",
        },
        {
          en: "Links display their text or composed content from pseudo-elements. The link’s destination may be matched using the\n`/url` property.",
          uk: "Посилання показують текст або вміст з псевдоелементів. Адресу можна звіряти через властивість `/url`.",
        },
        {
          en: "The value of `/url` may also be a regular expression:",
          uk: "Значення `/url` може бути регулярним виразом:",
        },
        {
          en: "### Text boxes",
          uk: "### Поля вводу (textbox)",
        },
        {
          en: "Input elements of type `text` show their `value` attribute content.",
          uk: 'Для `input type="text"` у знімку відображається вміст `value`.',
        },
        {
          en: "### Lists with items",
          uk: "### Списки з елементами",
        },
        {
          en: "Ordered and unordered lists include their list items.",
          uk: "Нумеровані та марковані списки містять свої `listitem`.",
        },
        {
          en: "### Grouped elements",
          uk: "### Згруповані елементи",
        },
        {
          en: "Groups capture nested elements, such as `` elements with summary content.",
          uk: "Групи описують вкладені елементи, зокрема вміст summary у згрупованих блоках.",
        },
        {
          en: "### Attributes and states",
          uk: "### Атрибути та стани",
        },
        {
          en: "Commonly used ARIA attributes, like `checked`, `disabled`, `expanded`, `level`, `pressed`, and `selected`, represent\ncontrol states.",
          uk: "Типові ARIA-атрибути — `checked`, `disabled`, `expanded`, `level`, `pressed`, `selected` — відображають стан контролів.",
        },
        {
          en: "#### Checkbox with `checked` attribute",
          uk: "#### Чекбокс з атрибутом `checked`",
        },
        {
          en: "#### Button with `pressed` attribute",
          uk: "#### Кнопка з атрибутом `pressed`",
        },
      ],
      codeBlocks: [
        {
          id: "cb-36",
          language: "html",
          code: "Title\nSubtitle",
        },
        {
          id: "cb-37",
          language: "yaml",
          code: '- heading "Title" [level=1]\n- heading "Subtitle" [level=2]',
        },
        {
          id: "cb-38",
          language: "html",
          code: "Sample accessible name",
        },
        {
          id: "cb-39",
          language: "yaml",
          code: "- text: Sample accessible name",
        },
        {
          id: "cb-40",
          language: "html",
          code: "Line 1Line 2",
        },
        {
          id: "cb-41",
          language: "yaml",
          code: "- paragraph: Line 1 Line 2",
        },
        {
          id: "cb-42",
          language: "html",
          code: "Read more about Accessibility",
        },
        {
          id: "cb-43",
          language: "yaml",
          code: '- link "Read more about Accessibility":\n    - /url: "#more-info"',
        },
        {
          id: "cb-44",
          language: "html",
          code: "YouTube channel",
        },
        {
          id: "cb-45",
          language: "yaml",
          code: "- link:\n  - /url: /https://www.youtube.com/channel/.*/",
        },
        {
          id: "cb-46",
          language: "html",
          code: "",
        },
        {
          id: "cb-47",
          language: "yaml",
          code: "- textbox: Enter your name",
        },
        {
          id: "cb-48",
          language: "html",
          code: "\n  Feature 1\n  Feature 2",
        },
        {
          id: "cb-49",
          language: "yaml",
          code: '- list "Main Features":\n  - listitem: Feature 1\n  - listitem: Feature 2',
        },
        {
          id: "cb-50",
          language: "html",
          code: "\n  Summary\n  Detail content here",
        },
        {
          id: "cb-51",
          language: "yaml",
          code: "- group: Summary",
        },
        {
          id: "cb-52",
          language: "html",
          code: "",
        },
        {
          id: "cb-53",
          language: "yaml",
          code: "- checkbox [checked]",
        },
        {
          id: "cb-54",
          language: "html",
          code: "Toggle",
        },
        {
          id: "cb-55",
          language: "yaml",
          code: '- button "Toggle" [pressed=true]',
        },
      ],
    },
  ],
  quiz: [],
}
