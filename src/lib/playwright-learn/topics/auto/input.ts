import type { PlaywrightTopic } from "../../types"

export const inputTopic: PlaywrightTopic = {
  slug: "input",
  groupId: "guides",
  order: 230,
  level: "beginner",
  trackOrder: 7,
  sourceDoc: "input.md",
  officialDocsUrl: "https://playwright.dev/docs/input",
  title: {
    en: "Actions",
    uk: "Дії",
  },
  summary: {
    en: "Playwright can interact with HTML Input elements such as text inputs, checkboxes, radio buttons, select options, mouse clicks, type characters, keys and shortcuts as well as upload files and focus elements.",
    uk: "Playwright може взаємодіяти з HTML-елементами введення: текстовими полями, прапорцями, радіокнопками, вибором у `<select>`, кліками мишею, посимвольним введенням, клавішами та скороченнями, а також завантаженням файлів і фокусуванням елементів.",
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
          en: "Playwright can interact with HTML Input elements such as text inputs, checkboxes, radio buttons, select options, mouse clicks, type characters, keys and shortcuts as well as upload files and focus elements.",
          uk: "Playwright може взаємодіяти з HTML-елементами введення: текстовими полями, прапорцями, радіокнопками, вибором у `<select>`, кліками мишею, посимвольним введенням, клавішами та скороченнями, а також завантаженням файлів і фокусуванням елементів.",
        },
      ],
    },
    {
      id: "text-input",
      title: {
        en: "Text input",
        uk: "Текстовий ввід",
      },
      paragraphs: [
        {
          en: "Using [`method: Locator.fill`] is the easiest way to fill out the form fields. It focuses the element and triggers an `input` event with the entered text. It works for ``, `` and `[contenteditable]` elements.",
          uk: "Використання [`method: Locator.fill`] — найпростіший спосіб заповнити поля форми. Метод фокусує елемент і генерує подію `input` із введеним текстом. Працює для ``, `` і елементів `[contenteditable]`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "// Text input\nawait page.getByRole('textbox').fill('Peter');\n\n// Date input\nawait page.getByLabel('Birth date').fill('2020-02-02');\n\n// Time input\nawait page.getByLabel('Appointment time').fill('13:15');\n\n// Local datetime input\nawait page.getByLabel('Local time').fill('2020-03-02T05:15');",
        },
      ],
    },
    {
      id: "checkboxes-and-radio-buttons",
      title: {
        en: "Checkboxes and radio buttons",
        uk: "Прапорці та радіокнопки",
      },
      paragraphs: [
        {
          en: "Using [`method: Locator.setChecked`] is the easiest way to check and uncheck a checkbox or a radio button. This method can be used with `input[type=checkbox]`, `input[type=radio]` and `[role=checkbox]` elements.",
          uk: "Використання [`method: Locator.setChecked`] — найпростіший спосіб увімкнути або вимкнути прапорець або радіокнопку. Метод підходить для `input[type=checkbox]`, `input[type=radio]` і елементів `[role=checkbox]`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "// Check the checkbox\nawait page.getByLabel('I agree to the terms above').check();\n\n// Assert the checked state\nexpect(page.getByLabel('Subscribe to newsletter')).toBeChecked();\n\n// Select the radio button\nawait page.getByLabel('XL').check();",
        },
      ],
    },
    {
      id: "select-options",
      title: {
        en: "Select options",
        uk: "Вибір опцій у select",
      },
      paragraphs: [
        {
          en: "Selects one or multiple options in the `` element with [`method: Locator.selectOption`].\nYou can specify option `value`, or `label` to select. Multiple options can be selected.",
          uk: "Вибирає одну або кілька опцій у елементі `` за допомогою [`method: Locator.selectOption`].\nМожна вказати `value` або `label` для вибору. Допускається вибір кількох опцій.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "// Single selection matching the value or label\nawait page.getByLabel('Choose a color').selectOption('blue');\n\n// Single selection matching the label\nawait page.getByLabel('Choose a color').selectOption({ label: 'Blue' });\n\n// Multiple selected items\nawait page.getByLabel('Choose multiple colors').selectOption(['red', 'green', 'blue']);",
        },
      ],
    },
    {
      id: "mouse-click",
      title: {
        en: "Mouse click",
        uk: "Клік мишею",
      },
      paragraphs: [
        {
          en: "Performs a simple human click.",
          uk: "Виконує простий «людський» клік.",
        },
        {
          en: "Under the hood, this and other pointer-related methods:",
          uk: "Під капотом цей і інші методи, пов’язані з вказівником:",
        },
        {
          en: "- wait for element with given selector to be in DOM\n- wait for it to become displayed, i.e. not empty, no `display:none`, no `visibility:hidden`\n- wait for it to stop moving, for example, until css transition finishes\n- scroll the element into view\n- wait for it to receive pointer events at the action point, for example, waits until element becomes non-obscured by other elements\n- retry if the element is detached during any of the above checks",
          uk: "- чекають появи елемента за селектором у DOM\n- чекають відображення: не порожній, без `display:none`, без `visibility:hidden`\n- чекають зупинки руху, наприклад завершення CSS-переходу\n- прокручують елемент у видиму область\n- чекають, поки в точці дії елемент отримає події вказівника, зокрема поки його не перекриватимуть інші елементи\n- повторюють спробу, якщо елемент від’єднали під час будь-якої з цих перевірок",
        },
        {
          en: "#### Forcing the click",
          uk: "#### Примусовий клік",
        },
        {
          en: "Sometimes, apps use non-trivial logic where hovering the element overlays it with another element that intercepts the click. This behavior is indistinguishable from a bug where element gets covered and the click is dispatched elsewhere. If you know this is taking place, you can bypass the [actionability](./actionability.md) checks and force the click:",
          uk: "Іноді застосунки мають нетривіальну логіку: наведення накладає поверх елемента інший, який перехоплює клік. Це не відрізнити від бага, коли елемент перекрито й клік потрапляє не туди. Якщо ви це очікуєте, можна обійти перевірки [дієздатності](./actionability.md) і виконати примусовий клік:",
        },
        {
          en: "#### Programmatic click",
          uk: "#### Програмний клік",
        },
        {
          en: "If you are not interested in testing your app under the real conditions and want to simulate the click by any means possible, you can trigger the [`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click) behavior via simply dispatching a click event on the element with [`method: Locator.dispatchEvent`]:",
          uk: "Якщо вам не потрібно тестувати застосунок у реальних умовах і ви хочете імітувати клік будь-яким способом, можна викликати поведінку [`HTMLElement.click()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click), просто диспатчивши подію кліку на елементі через [`method: Locator.dispatchEvent`]:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-16",
          language: "js",
          code: "// Generic click\nawait page.getByRole('button').click();\n\n// Double click\nawait page.getByText('Item').dblclick();\n\n// Right click\nawait page.getByText('Item').click({ button: 'right' });\n\n// Shift + click\nawait page.getByText('Item').click({ modifiers: ['Shift'] });\n\n// Ctrl + click on Windows and Linux\n// Meta + click on macOS\nawait page.getByText('Item').click({ modifiers: ['ControlOrMeta'] });\n\n// Hover over element\nawait page.getByText('Item').hover();\n\n// Click the top left corner\nawait page.getByText('Item').click({ position: { x: 0, y: 0 } });",
        },
        {
          id: "cb-21",
          language: "js",
          code: "await page.getByRole('button').click({ force: true });",
        },
        {
          id: "cb-26",
          language: "js",
          code: "await page.getByRole('button').dispatchEvent('click');",
        },
      ],
    },
    {
      id: "type-characters",
      title: {
        en: "Type characters",
        uk: "Введення символів",
      },
      paragraphs: [
        {
          en: "Type into the field character by character, as if it was a user with a real keyboard with [`method: Locator.pressSequentially`].",
          uk: "Введення в поле посимвольно, ніби користувач набирає на реальній клавіатурі, за допомогою [`method: Locator.pressSequentially`].",
        },
        {
          en: "This method will emit all the necessary keyboard events, with all the `keydown`, `keyup`, `keypress` events in place. You can even specify the optional `delay` between the key presses to simulate real user behavior.",
          uk: "Метод генерує всі потрібні події клавіатури — `keydown`, `keyup`, `keypress`. Можна також задати необов’язковий `delay` між натисканнями, щоб імітувати поведінку людини.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-31",
          language: "js",
          code: "// Press keys one by one\nawait page.locator('#area').pressSequentially('Hello World!');",
        },
      ],
    },
    {
      id: "keys-and-shortcuts",
      title: {
        en: "Keys and shortcuts",
        uk: "Клавіші та скорочення",
      },
      paragraphs: [
        {
          en: "The [`method: Locator.press`] method focuses the selected element and produces a single keystroke. It accepts the logical key names that are emitted in the [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) property of the keyboard events:",
          uk: "Метод [`method: Locator.press`] фокусує вибраний елемент і генерує одне натискання клавіші. Приймає логічні назви клавіш, які з’являються у властивості [keyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) подій клавіатури:",
        },
        {
          en: '- You can alternatively specify a single character you\'d like to produce such as `"a"` or `"#"`.',
          uk: '- Альтернативно можна вказати один символ, який потрібно згенерувати, наприклад `"a"` або `"#"`.',
        },
        {
          en: "- Following modification shortcuts are also supported: `Shift, Control, Alt, Meta`.",
          uk: "- Підтримуються й модифікатори: `Shift, Control, Alt, Meta`.",
        },
        {
          en: 'Simple version produces a single character. This character is case-sensitive, so `"a"` and `"A"` will produce different results.',
          uk: 'Простий варіант генерує один символ. Регістр важливий: `"a"` та `"A"` дають різний результат.',
        },
        {
          en: 'Shortcuts such as `"Control+o"` or `"Control+Shift+T"` are supported as well. When specified with the modifier, modifier is pressed and being held while the subsequent key is being pressed.',
          uk: 'Підтримуються й скорочення на кшталт `"Control+o"` або `"Control+Shift+T"`. Якщо вказано модифікатор, він утримується під час натискання наступної клавіші.',
        },
        {
          en: "Note that you still need to specify the capital `A` in `Shift-A` to produce the capital character. `Shift-a` produces a lower-case one as if you had the `CapsLock` toggled.",
          uk: "Зверніть увагу: для великої літери в `Shift-A` потрібна саме велика `A`. `Shift-a` дає малу літеру, ніби ввімкнено `CapsLock`.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-36",
          language: "js",
          code: "// Hit Enter\nawait page.getByText('Submit').press('Enter');\n\n// Dispatch Control+Right\nawait page.getByRole('textbox').press('Control+ArrowRight');\n\n// Press $ sign on keyboard\nawait page.getByRole('textbox').press('$');",
        },
        {
          id: "cb-41",
          language: "txt",
          code: "Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape,\nArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight,\nArrowUp, F1 - F12, Digit0 - Digit9, KeyA - KeyZ, etc.",
        },
        {
          id: "cb-42",
          language: "js",
          code: "// \nawait page.locator('#name').press('Shift+A');\n\n// \nawait page.locator('#name').press('Shift+ArrowLeft');",
        },
      ],
    },
    {
      id: "upload-files",
      title: {
        en: "Upload files",
        uk: "Завантаження файлів",
      },
      paragraphs: [
        {
          en: 'You can select input files for upload using the [`method: Locator.setInputFiles`] method. It expects first argument to point to an [input element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) with the type `"file"`. Multiple files can be passed in the array. If some of the file paths are relative, they are resolved relative to the current working directory. Empty array clears the selected files.',
          uk: 'Вибрати файли для завантаження можна методом [`method: Locator.setInputFiles`]. Перший аргумент має вказувати на [елемент input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) з типом `"file"`. Кілька файлів передають масивом. Відносні шляхи розв’язуються відносно поточної робочої директорії. Порожній масив очищає вибрані файли.',
        },
        {
          en: "If you don't have input element in hand (it is created dynamically), you can handle the [`event: Page.fileChooser`] event\nor use a corresponding waiting method upon your action:",
          uk: "Якщо елемента input під рукою немає (він створюється динамічно), можна обробити подію [`event: Page.fileChooser`]\nабо скористатися відповідним методом очікування після вашої дії:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-47",
          language: "js",
          code: "// Select one file\nawait page.getByLabel('Upload file').setInputFiles(path.join(__dirname, 'myfile.pdf'));\n\n// Select multiple files\nawait page.getByLabel('Upload files').setInputFiles([\n  path.join(__dirname, 'file1.txt'),\n  path.join(__dirname, 'file2.txt'),\n]);\n\n// Select a directory\nawait page.getByLabel('Upload directory').setInputFiles(path.join(__dirname, 'mydir'));\n\n// Remove all the selected files\nawait page.getByLabel('Upload file').setInputFiles([]);\n\n// Upload buffer from memory\nawait page.getByLabel('Upload file').setInputFiles({\n  name: 'file.txt',\n  mimeType: 'text/plain',\n  buffer: Buffer.from('this is test')\n});",
        },
        {
          id: "cb-52",
          language: "js",
          code: "// Start waiting for file chooser before clicking. Note no await.\nconst fileChooserPromise = page.waitForEvent('filechooser');\nawait page.getByLabel('Upload file').click();\nconst fileChooser = await fileChooserPromise;\nawait fileChooser.setFiles(path.join(__dirname, 'myfile.pdf'));",
        },
      ],
    },
    {
      id: "focus-element",
      title: {
        en: "Focus element",
        uk: "Фокус на елементі",
      },
      paragraphs: [
        {
          en: "For the dynamic pages that handle focus events, you can focus the given element with [`method: Locator.focus`].",
          uk: "На динамічних сторінках, які обробляють події фокусу, можна сфокусувати потрібний елемент за допомогою [`method: Locator.focus`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-57",
          language: "js",
          code: "await page.getByLabel('Password').focus();",
        },
      ],
    },
    {
      id: "drag-and-drop",
      title: {
        en: "Drag and Drop",
        uk: "Перетягування (drag and drop)",
      },
      paragraphs: [
        {
          en: "You can perform drag&drop operation with [`method: Locator.dragTo`]. This method will:\n- Hover the element that will be dragged.\n- Press left mouse button.\n- Move mouse to the element that will receive the drop.\n- Release left mouse button.",
          uk: "Операцію drag&drop можна виконати через [`method: Locator.dragTo`]. Метод:\n- наводить курсор на елемент, який перетягують;\n- натискає ліву кнопку миші;\n- переміщує курсор до елемента, куди відпускають;\n- відпускає ліву кнопку миші.",
        },
        {
          en: "### Dragging manually",
          uk: "### Ручне перетягування",
        },
        {
          en: "If you want precise control over the drag operation, use lower-level methods like [`method: Locator.hover`], [`method: Mouse.down`], [`method: Mouse.move`] and [`method: Mouse.up`].",
          uk: "Для точного керування перетягуванням використовуйте нижчорівневі методи: [`method: Locator.hover`], [`method: Mouse.down`], [`method: Mouse.move`] та [`method: Mouse.up`].",
        },
      ],
      codeBlocks: [
        {
          id: "cb-62",
          language: "js",
          code: "await page.locator('#item-to-be-dragged').dragTo(page.locator('#item-to-drop-at'));",
        },
        {
          id: "cb-67",
          language: "js",
          code: "await page.locator('#item-to-be-dragged').hover();\nawait page.mouse.down();\nawait page.locator('#item-to-drop-at').hover();\nawait page.mouse.up();",
        },
      ],
    },
    {
      id: "scrolling",
      title: {
        en: "Scrolling",
        uk: "Прокрутка",
      },
      paragraphs: [
        {
          en: "Most of the time, Playwright will automatically scroll for you before doing any actions. Therefore, you do not need to scroll explicitly.",
          uk: "Зазвичай Playwright автоматично прокручує сторінку перед діями, тож явна прокрутка не потрібна.",
        },
        {
          en: 'However, in rare cases you might need to manually scroll. For example, you might want to force an "infinite list" to load more elements, or position the page for a specific screenshot. In such a case, the most reliable way is to find an element that you want to make visible at the bottom, and scroll it into view.',
          uk: "У рідких випадках може знадобитися ручна прокрутка: наприклад, щоб «нескінченний список» підвантажив елементи або щоб підготувати сторінку до скриншота. Найнадійніше знайти елемент, який має з’явитися внизу, і прокрутити до нього.",
        },
        {
          en: "If you would like to control the scrolling more precisely, use [`method: Mouse.wheel`] or [`method: Locator.evaluate`]:",
          uk: "Для точнішого керування прокруткою використовуйте [`method: Mouse.wheel`] або [`method: Locator.evaluate`]:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-72",
          language: "js",
          code: "// Scrolls automatically so that button is visible\nawait page.getByRole('button').click();",
        },
        {
          id: "cb-77",
          language: "js",
          code: "// Scroll the footer into view, forcing an \"infinite list\" to load more content\nawait page.getByText('Footer text').scrollIntoViewIfNeeded();",
        },
        {
          id: "cb-82",
          language: "js",
          code: "// Position the mouse and scroll with the mouse wheel\nawait page.getByTestId('scrolling-container').hover();\nawait page.mouse.wheel(0, 10);\n\n// Alternatively, programmatically scroll a specific element\nawait page.getByTestId('scrolling-container').evaluate(e => e.scrollTop += 100);",
        },
      ],
    },
  ],
  quiz: [],
}
