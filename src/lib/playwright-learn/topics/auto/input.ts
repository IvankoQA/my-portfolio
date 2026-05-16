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
    en: "fill, click, check, selectOption — these are the actions you use in 90% of tests. Each one waits for the element to be ready before acting.",
    uk: "fill, click, check, selectOption — це дії що використовуються в 90% тестів. Кожна чекає поки елемент буде готовий перш ніж діяти.",
  },
  sections: [
    {
      id: "text-input",
      title: {
        en: "Text input — fill vs type",
        uk: "Текстовий ввід — fill і type",
      },
      paragraphs: [
        {
          en: "`fill` is what you want 95% of the time — it focuses the field, clears it, sets the value, and fires the `input` event. Fast and reliable. Use it for login forms, order creation, search fields.",
          uk: "`fill` — це те що потрібно в 95% випадків: фокусує поле, очищає його, встановлює значення і генерує подію `input`. Швидко і надійно. Використовую для форм логіну, створення замовлень, пошукових полів.",
        },
        {
          en: "`pressSequentially` types character by character — useful for testing autocomplete or fields that react to each keystroke. It's slower than `fill` on purpose.",
          uk: "`pressSequentially` друкує символ за символом — корисно для тестування автодоповнення або полів що реагують на кожен натиск. Навмисно повільніше ніж `fill`.",
        },
      ],
      codeBlocks: [
        {
          id: "fill-examples",
          language: "ts",
          code: `test('fill login form', async ({ page }) => {
  await page.goto('/login')

  // fill — найшвидший і найнадійніший спосіб
  await page.getByLabel('Email').fill('admin@example.com')
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD!)

  // Дата, час — теж через fill
  await page.getByLabel('Order date').fill('2026-05-14')
  await page.getByLabel('Delivery time').fill('14:30')

  await page.getByRole('button', { name: 'Sign in' }).click()
})

test('autocomplete reacts to typing', async ({ page }) => {
  await page.goto('/orders/new')

  // pressSequentially — символ за символом, для autocomplete
  await page.getByLabel('Customer name').pressSequentially('Iva', { delay: 50 })

  // Autocomplete список з'явився
  await expect(page.getByRole('listbox')).toBeVisible()
  await page.getByRole('option', { name: 'Ivan Kozenko' }).click()
})`,
        },
      ],
    },
    {
      id: "checkboxes-and-radio",
      title: {
        en: "Checkboxes and radio buttons",
        uk: "Чекбокси і радіокнопки",
      },
      paragraphs: [
        {
          en: "`check()` and `uncheck()` are semantic — they verify the current state first. `check()` on an already-checked box does nothing. `setChecked(true/false)` explicitly sets the state regardless. I use `check()` for clarity and `setChecked` when I need to be explicit about the end state.",
          uk: "`check()` і `uncheck()` семантичні — спочатку перевіряють поточний стан. `check()` на вже відміченому чекбоксі нічого не робить. `setChecked(true/false)` явно задає стан незалежно від поточного. Я використовую `check()` для ясності і `setChecked` коли треба явно задати кінцевий стан.",
        },
      ],
      codeBlocks: [
        {
          id: "checkbox-examples",
          language: "ts",
          code: `test('accept terms and subscribe', async ({ page }) => {
  await page.goto('/register')

  await page.getByLabel('I agree to the terms').check()
  await expect(page.getByLabel('I agree to the terms')).toBeChecked()

  // Відмінити
  await page.getByLabel('Subscribe to newsletter').uncheck()
  await expect(page.getByLabel('Subscribe to newsletter')).not.toBeChecked()

  // setChecked — явна установка
  await page.getByLabel('Send notifications').setChecked(true)
})

test('select delivery method', async ({ page }) => {
  await page.goto('/checkout')

  // Радіокнопка — те саме API
  await page.getByLabel('Express delivery').check()
  await expect(page.getByLabel('Express delivery')).toBeChecked()
  await expect(page.getByLabel('Standard delivery')).not.toBeChecked()
})`,
        },
      ],
    },
    {
      id: "select-options",
      title: {
        en: "Select dropdowns",
        uk: "Вибір з select",
      },
      paragraphs: [
        {
          en: "`selectOption` works on native `<select>` elements. You can select by value (what's in the `value` attribute), by label (what the user sees), or by index. For multiple-select, pass an array.",
          uk: "`selectOption` працює на нативних елементах `<select>`. Можна вибирати за value (що в атрибуті `value`), за label (що бачить користувач) або за індексом. Для multi-select — передай масив.",
        },
      ],
      codeBlocks: [
        {
          id: "select-examples",
          language: "ts",
          code: `test('filter orders by status', async ({ page }) => {
  await page.goto('/orders')

  // За value — те що в HTML <option value="pending">
  await page.getByRole('combobox', { name: 'Status' }).selectOption('pending')

  // За label — те що бачить користувач
  await page.getByRole('combobox', { name: 'Status' }).selectOption({ label: 'Pending' })

  // За індексом (з 0)
  await page.getByRole('combobox', { name: 'Items per page' }).selectOption({ index: 2 })

  // Multi-select
  await page.getByLabel('Tags').selectOption(['urgent', 'vip', 'export'])
})`,
        },
      ],
    },
    {
      id: "mouse-click",
      title: {
        en: "Clicks and mouse actions",
        uk: "Кліки і дії мишею",
      },
      paragraphs: [
        {
          en: "`click()` is the most-used action — it waits for the element to be visible, stable (animations done), and not obscured. It also scrolls the element into view first. Variants: `dblclick()`, right-click with `{ button: 'right' }`, shift+click with `{ modifiers: ['Shift'] }`.",
          uk: "`click()` — найбільш вживана дія. Чекає поки елемент стане видимим, стабільним (анімації завершені) і не перекритим. Також прокручує елемент у видиму область. Варіанти: `dblclick()`, правий клік з `{ button: 'right' }`, shift+клік з `{ modifiers: ['Shift'] }`.",
        },
      ],
      codeBlocks: [
        {
          id: "click-examples",
          language: "ts",
          code: `test('order table interactions', async ({ page }) => {
  await page.goto('/orders')

  // Звичайний клік
  await page.getByRole('button', { name: 'Create order' }).click()

  // Подвійний клік (відкрити для редагування)
  await page.getByRole('row').filter({ hasText: 'ORDER-042' }).dblclick()

  // Правий клік (контекстне меню)
  await page.getByRole('row').filter({ hasText: 'ORDER-007' })
    .click({ button: 'right' })
  await page.getByRole('menuitem', { name: 'Archive' }).click()

  // Ctrl+клік (мульти-вибір)
  await page.getByRole('row').nth(1).click()
  await page.getByRole('row').nth(3).click({ modifiers: ['ControlOrMeta'] })
  await page.getByRole('row').nth(5).click({ modifiers: ['ControlOrMeta'] })

  // Hover (показати тултіп)
  await page.getByTestId('info-icon').hover()
  await expect(page.getByRole('tooltip')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "keyboard",
      title: {
        en: "Keyboard shortcuts and key presses",
        uk: "Клавіатурні скорочення і натиски",
      },
      paragraphs: [
        {
          en: "`press()` sends a keyboard event to the focused element. Common use cases: submitting forms with `Enter`, clearing fields with `Control+A` then `Backspace`, navigating with `ArrowDown`/`Tab`. For combinations, use `+` separator.",
          uk: "`press()` надсилає подію клавіатури до сфокусованого елемента. Типові кейси: відправити форму через `Enter`, очистити поле через `Control+A` + `Backspace`, навігувати через `ArrowDown`/`Tab`. Для комбінацій — роздільник `+`.",
        },
      ],
      codeBlocks: [
        {
          id: "keyboard-examples",
          language: "ts",
          code: `test('keyboard navigation in order form', async ({ page }) => {
  await page.goto('/orders/new')

  const nameField = page.getByLabel('Customer name')
  await nameField.fill('Test')

  // Очистити і ввести нове значення
  await nameField.press('Control+a')
  await nameField.press('Backspace')
  await nameField.fill('Ivan Kozenko')

  // Enter для відправки форми
  await page.getByLabel('Search').press('Enter')

  // Tab між полями
  await page.getByLabel('First name').press('Tab') // переходить на Last name

  // Escape для закриття модального
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()

  // Arrow down в dropdown
  await page.getByRole('combobox', { name: 'Status' }).press('ArrowDown')
})`,
        },
      ],
    },
    {
      id: "file-upload",
      title: {
        en: "File upload",
        uk: "Завантаження файлів",
      },
      paragraphs: [
        {
          en: "`setInputFiles` sets files on an `<input type=\"file\">` element without opening the OS file picker. Pass a file path or multiple paths for multi-file inputs. For drag-and-drop upload zones, use `page.dragAndDrop()` or `dispatchEvent`.",
          uk: "`setInputFiles` встановлює файли на `<input type=\"file\">` без відкриття системного вибору файлів. Передай шлях до файлу або кілька шляхів для multi-file. Для drag-and-drop зон завантаження — `page.dragAndDrop()` або `dispatchEvent`.",
        },
      ],
      codeBlocks: [
        {
          id: "upload-examples",
          language: "ts",
          code: `test('upload order document', async ({ page }) => {
  await page.goto('/orders/42/documents')

  // Один файл
  await page.getByLabel('Upload document').setInputFiles('tests/fixtures/invoice.pdf')

  // Кілька файлів
  await page.getByLabel('Upload documents').setInputFiles([
    'tests/fixtures/invoice.pdf',
    'tests/fixtures/contract.pdf',
  ])

  // Очистити вибір файлів
  await page.getByLabel('Upload document').setInputFiles([])

  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('2 documents uploaded')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "drag-and-drop",
      title: {
        en: "Drag and drop",
        uk: "Drag and drop",
      },
      paragraphs: [
        {
          en: "For HTML5 drag-and-drop (elements with `draggable` attribute), `page.dragAndDrop()` handles the whole sequence. For custom drag implementations that listen to mouse events directly, use the lower-level `mouse.down()`, `mouse.move()`, `mouse.up()` sequence.",
          uk: "Для HTML5 drag-and-drop (елементи з атрибутом `draggable`) — `page.dragAndDrop()` обробляє всю послідовність. Для кастомних реалізацій що слухають події мишей безпосередньо — використовуй нижньорівневу послідовність `mouse.down()`, `mouse.move()`, `mouse.up()`.",
        },
      ],
      codeBlocks: [
        {
          id: "drag-examples",
          language: "ts",
          code: `test('reorder items in kanban', async ({ page }) => {
  await page.goto('/orders/kanban')

  // HTML5 dragAndDrop: з "Pending" колонки до "In Progress"
  await page.dragAndDrop(
    '[data-testid="card-ORDER-042"]',
    '[data-testid="column-in-progress"]'
  )

  await expect(
    page.getByTestId('column-in-progress').getByText('ORDER-042')
  ).toBeVisible()
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You need to test an autocomplete that triggers suggestions after each keystroke. Which method should you use instead of fill()?",
        uk: "Треба тестувати autocomplete що показує підказки після кожного натиску. Який метод використовувати замість fill()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.keyboard.type() — simulates real keystroke events",
            uk: "page.keyboard.type() — симулює реальні події натиску",
          },
        },
        {
          id: "b",
          label: {
            en: "locator.pressSequentially() — types character by character",
            uk: "locator.pressSequentially() — друкує символ за символом",
          },
        },
        {
          id: "c",
          label: {
            en: "locator.fill() with a delay option",
            uk: "locator.fill() з опцією delay",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`pressSequentially` types character by character on a focused locator, which triggers `keydown`, `input`, and `keyup` events for each character — exactly what autocomplete listens to. `fill()` sets the value in one shot and only fires one `input` event, which autocomplete may not respond to correctly.",
        uk: "`pressSequentially` друкує символ за символом на сфокусованому локаторі, що генерує `keydown`, `input` і `keyup` для кожного символу — саме те що слухає autocomplete. `fill()` встановлює значення одразу і генерує лише одну подію `input`, на яку autocomplete може не відреагувати правильно.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What does `locator.fill('hello')` do before setting the value?",
        uk: "Що робить `locator.fill('hello')` перед встановленням значення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It appends 'hello' to whatever text is already in the field.",
            uk: "Він додає 'hello' до тексту що вже є в полі.",
          },
        },
        {
          id: "b",
          label: {
            en: "It focuses the field and clears any existing value, then sets the new value.",
            uk: "Він фокусує поле і очищає будь-яке існуюче значення, потім встановлює нове.",
          },
        },
        {
          id: "c",
          label: {
            en: "It clicks the field twice to select all, then types the new value.",
            uk: "Він двічі клікає по полю щоб виділити все, потім вводить нове значення.",
          },
        },
        {
          id: "d",
          label: {
            en: "It does nothing if the field already has a value.",
            uk: "Він нічого не робить якщо поле вже має значення.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`fill` focuses the input element, clears its current content, and then sets it to the given value — all in one step. It also fires the `input` event. This makes it reliable for re-filling fields without needing to manually select-all and delete first. Because it clears before setting, use `pressSequentially` when you want to test incremental typing behavior.",
        uk: "`fill` фокусує поле вводу, очищає його поточний вміст, потім встановлює задане значення — все за один крок. Також генерує подію `input`. Це робить його надійним для повторного заповнення полів без необхідності вручну виділяти і видаляти спочатку. Оскільки він очищає перед встановленням — використовуй `pressSequentially` коли хочеш тестувати поступове введення.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does `locator.click()` automatically do before firing the click event?",
        uk: "Що автоматично робить `locator.click()` перед генерацією події кліку?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "It fires the click immediately without any waiting.",
            uk: "Він миттєво генерує клік без будь-якого очікування.",
          },
        },
        {
          id: "b",
          label: {
            en: "It waits for the element to be visible, stable (no animations), and not obscured by another element — and scrolls it into view.",
            uk: "Він чекає поки елемент стане видимим, стабільним (без анімацій) і не перекритим іншим елементом — та прокручує його у видиму область.",
          },
        },
        {
          id: "c",
          label: {
            en: "It takes a screenshot of the element for the trace.",
            uk: "Він робить скріншот елемента для трейсу.",
          },
        },
        {
          id: "d",
          label: {
            en: "It moves the mouse to the center of the page first, then to the element.",
            uk: "Він спочатку переміщує мишу до центру сторінки, потім до елемента.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's `click()` is actionability-aware: it waits for the element to be visible (not display:none or visibility:hidden), stable (no CSS transitions or animations in progress), and not obscured by an overlapping element. It also auto-scrolls the element into the viewport. This eliminates most timing-related test flakiness without needing manual waits.",
        uk: "Метод `click()` Playwright враховує actionability: він чекає поки елемент стане видимим (не display:none або visibility:hidden), стабільним (немає CSS переходів або анімацій в процесі) і не перекритим елементом що накривається. Також автоматично прокручує елемент у видиму область. Це усуває більшість нестабільностей тестів пов'язаних з часом без ручних очікувань.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You want to check a checkbox only if it is currently unchecked. Which method is most appropriate?",
        uk: "Хочеш відмітити чекбокс лише якщо він зараз не відмічений. Який метод найбільш підходить?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "locator.click() — clicking always toggles the checkbox.",
            uk: "locator.click() — клік завжди перемикає чекбокс.",
          },
        },
        {
          id: "b",
          label: {
            en: "locator.check() — it verifies the current state and only clicks if the box is unchecked.",
            uk: "locator.check() — він перевіряє поточний стан і клікає лише якщо чекбокс не відмічений.",
          },
        },
        {
          id: "c",
          label: {
            en: "locator.setChecked(false) — explicitly sets the state.",
            uk: "locator.setChecked(false) — явно встановлює стан.",
          },
        },
        {
          id: "d",
          label: {
            en: "locator.fill('true') — fill works for checkboxes too.",
            uk: "locator.fill('true') — fill працює і для чекбоксів.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`check()` is semantic — it first checks whether the element is already checked, and only performs the click if it isn't. This avoids accidentally unchecking a box that was already checked. `click()` blindly toggles. `setChecked(true)` also works and is explicit about the desired end state. `fill()` does not work on checkboxes.",
        uk: "`check()` є семантичним — він спочатку перевіряє чи елемент вже відмічений, і виконує клік лише якщо ні. Це запобігає випадковому скасуванню відмітки чекбоксу що вже був відмічений. `click()` сліпо перемикає. `setChecked(true)` також працює і є явним щодо бажаного кінцевого стану. `fill()` не працює для чекбоксів.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "How do you select an option in a native `<select>` dropdown by the text the user sees (not the `value` attribute)?",
        uk: "Як вибрати опцію в нативному `<select>` за текстом що бачить користувач (не атрибут `value`)?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "locator.selectOption('Pending') — passing a string matches by value or visible text.",
            uk: "locator.selectOption('Pending') — передача рядка збігається за value або видимим текстом.",
          },
        },
        {
          id: "b",
          label: {
            en: "locator.selectOption({ label: 'Pending' }) — passing an object with `label` matches by visible text.",
            uk: "locator.selectOption({ label: 'Pending' }) — передача об'єкта з `label` збігається за видимим текстом.",
          },
        },
        {
          id: "c",
          label: {
            en: "locator.click() then locator.getByText('Pending').click()",
            uk: "locator.click() потім locator.getByText('Pending').click()",
          },
        },
        {
          id: "d",
          label: {
            en: "locator.fill('Pending') — fill works for select elements.",
            uk: "locator.fill('Pending') — fill працює для select елементів.",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`selectOption` accepts three forms: a plain string (matches by `value` attribute), `{ label: '...' }` (matches by visible option text), or `{ index: N }` (by zero-based position). When you want to select by what the user sees in the dropdown — like 'Pending' — use `{ label: 'Pending' }`. Passing a plain string 'Pending' would match by the HTML `value` attribute, which may differ from the label.",
        uk: "`selectOption` приймає три форми: звичайний рядок (збігається за атрибутом `value`), `{ label: '...' }` (збігається за видимим текстом опції) або `{ index: N }` (за позицією з нуля). Коли хочеш вибрати за тим що бачить користувач у dropdown — наприклад 'Pending' — використовуй `{ label: 'Pending' }`. Передача звичайного рядка 'Pending' збіжиться з атрибутом `value` HTML, який може відрізнятися від підпису.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you attach a file to an `<input type=\"file\">` element in Playwright without opening the OS file picker?",
        uk: "Як прикріпити файл до елемента `<input type=\"file\">` у Playwright без відкриття системного вибору файлів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "locator.click() — Playwright intercepts the file picker dialog automatically.",
            uk: "locator.click() — Playwright автоматично перехоплює діалог вибору файлів.",
          },
        },
        {
          id: "b",
          label: {
            en: "page.on('filechooser', ...) combined with locator.click() — you must listen for the chooser event.",
            uk: "page.on('filechooser', ...) у поєднанні з locator.click() — треба слухати подію chooser.",
          },
        },
        {
          id: "c",
          label: {
            en: "locator.setInputFiles('path/to/file.pdf') — directly sets the file on the input without triggering the OS picker.",
            uk: "locator.setInputFiles('path/to/file.pdf') — безпосередньо встановлює файл на інпут без запуску системного вибору.",
          },
        },
        {
          id: "d",
          label: {
            en: "locator.fill('path/to/file.pdf') — fill works for file inputs too.",
            uk: "locator.fill('path/to/file.pdf') — fill також працює для file inputs.",
          },
        },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`setInputFiles` is the dedicated Playwright API for file inputs. It bypasses the OS file picker entirely and directly sets the file(s) on the input element. Pass a single path string, an array of paths for multi-file inputs, or an empty array to clear the selection. `fill()` does not work on file inputs.",
        uk: "`setInputFiles` — це спеціальний API Playwright для file inputs. Він повністю обходить системний вибір файлів і безпосередньо встановлює файл(и) на елемент input. Передай один рядок шляху, масив шляхів для multi-file inputs або порожній масив щоб очистити вибір. `fill()` не працює для file inputs.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to send the keyboard combination Ctrl+A (select all) to an input field. Which code is correct?",
        uk: "Хочеш надіслати комбінацію клавіш Ctrl+A (виділити все) до поля вводу. Який код правильний?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await locator.press('Ctrl', 'A')",
            uk: "await locator.press('Ctrl', 'A')",
          },
        },
        {
          id: "b",
          label: {
            en: "await locator.press('Control+a')",
            uk: "await locator.press('Control+a')",
          },
        },
        {
          id: "c",
          label: {
            en: "await locator.keyboard('Ctrl+A')",
            uk: "await locator.keyboard('Ctrl+A')",
          },
        },
        {
          id: "d",
          label: {
            en: "await locator.fill('Control+a')",
            uk: "await locator.fill('Control+a')",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`press()` accepts key combinations with a `+` separator. Use the full key name `Control` (not `Ctrl`) combined with a lowercase letter: `'Control+a'`. On macOS you can use `'Meta+a'` or the cross-platform `'ControlOrMeta+a'`. There is no `locator.keyboard()` method, and `fill()` is for text values, not key events.",
        uk: "`press()` приймає комбінації клавіш з роздільником `+`. Використовуй повну назву клавіші `Control` (не `Ctrl`) у поєднанні з малою літерою: `'Control+a'`. На macOS можна використовувати `'Meta+a'` або крос-платформний `'ControlOrMeta+a'`. Методу `locator.keyboard()` не існує, а `fill()` — для текстових значень, не для подій клавіш.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Which Playwright method handles HTML5 drag-and-drop (elements with the `draggable` attribute)?",
        uk: "Який метод Playwright обробляє HTML5 drag-and-drop (елементи з атрибутом `draggable`)?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "locator.dragTo(targetLocator) — drags from the source locator to a target locator.",
            uk: "locator.dragTo(targetLocator) — перетягує від локатора-джерела до локатора-цілі.",
          },
        },
        {
          id: "b",
          label: {
            en: "page.mouse.move() then page.mouse.down() then page.mouse.up() — only the low-level mouse API works.",
            uk: "page.mouse.move() потім page.mouse.down() потім page.mouse.up() — працює лише низькорівневий mouse API.",
          },
        },
        {
          id: "c",
          label: {
            en: "locator.click({ button: 'left', force: true }) held down.",
            uk: "locator.click({ button: 'left', force: true }) утримуваний.",
          },
        },
        {
          id: "d",
          label: {
            en: "page.dragAndDrop(source, target) or locator.dragTo(target) — both work for HTML5 drag.",
            uk: "page.dragAndDrop(source, target) або locator.dragTo(target) — обидва працюють для HTML5 drag.",
          },
        },
      ],
      correctOptionId: "d",
      rationale: {
        en: "Playwright offers two high-level APIs for HTML5 drag-and-drop: `page.dragAndDrop(sourceSelector, targetSelector)` which takes CSS/text selectors, and `locator.dragTo(targetLocator)` which works with locators. Both handle the full drag sequence (mousedown, mousemove, mouseup plus drag events). For custom implementations that listen to raw mouse events — not the native drag API — you may need the low-level `mouse.down/move/up` sequence instead.",
        uk: "Playwright пропонує два високорівневих API для HTML5 drag-and-drop: `page.dragAndDrop(sourceSelector, targetSelector)` що приймає CSS/текстові селектори, і `locator.dragTo(targetLocator)` що працює з локаторами. Обидва обробляють повну послідовність перетягування (mousedown, mousemove, mouseup плюс drag-події). Для кастомних реалізацій що слухають сирі події миші — не нативний drag API — може знадобитися низькорівнева послідовність `mouse.down/move/up`.",
      },
    },
  ],
}
