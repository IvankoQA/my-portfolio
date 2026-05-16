import type { PlaywrightTopic } from "../../types"

export const dialogsTopic: PlaywrightTopic = {
  slug: "dialogs",
  groupId: "guides",
  order: 170,
  level: "intermediate",
  trackOrder: 20,
  sourceDoc: "dialogs.md",
  officialDocsUrl: "https://playwright.dev/docs/dialogs",
  title: {
    en: "Dialogs",
    uk: "Діалогові вікна",
  },
  summary: {
    en: "Native browser dialogs — alert, confirm, prompt — are invisible to locators. You handle them through page events, not clicks. Get this wrong and the test hangs forever.",
    uk: "Нативні діалоги браузера — alert, confirm, prompt — невидимі для локаторів. Їх обробляють через події сторінки, а не кліки. Помилишся — тест зависне назавжди.",
  },
  sections: [
    {
      id: "how-dialogs-work",
      title: {
        en: "Why native dialogs are different",
        uk: "Чому нативні діалоги особливі",
      },
      paragraphs: [
        {
          en: "When JavaScript calls `window.alert()`, `window.confirm()`, or `window.prompt()`, the browser opens a native OS dialog — not a DOM element. Playwright can't find it with `getByRole` or any locator because it's not in the page's HTML at all.",
          uk: "Коли JavaScript викликає `window.alert()`, `window.confirm()` або `window.prompt()`, браузер відкриває нативний діалог ОС — не DOM елемент. Playwright не може знайти його через `getByRole` або будь-який локатор, бо його взагалі немає в HTML сторінки.",
        },
        {
          en: "By default, Playwright auto-dismisses all dialogs. For `alert` that means clicking OK. For `confirm` it means clicking Cancel (returns `false`). For `prompt` it means clicking Cancel (returns `null`). If your code checks the return value of `confirm()` and does something on `true`, the default behavior will break that flow.",
          uk: "За замовчуванням Playwright автоматично закриває всі діалоги. Для `alert` це означає клік OK. Для `confirm` — клік Cancel (повертає `false`). Для `prompt` — Cancel (повертає `null`). Якщо твій код перевіряє результат `confirm()` і щось робить при `true` — поведінка за замовчуванням зламає цей flow.",
        },
      ],
    },
    {
      id: "handling-dialogs",
      title: {
        en: "Handling alert, confirm, prompt",
        uk: "Обробка alert, confirm, prompt",
      },
      paragraphs: [
        {
          en: "Register a `dialog` event handler on the page. The handler fires when any dialog opens. The critical detail: register it BEFORE the action that triggers the dialog. If you register after, the dialog might appear and auto-close before your handler is attached.",
          uk: "Зареєструй обробник події `dialog` на сторінці. Обробник спрацьовує коли відкривається будь-який діалог. Критична деталь: реєструй ДО дії що відкриває діалог. Якщо після — діалог може з'явитися і закритися автоматично до того як обробник підключений.",
        },
      ],
      codeBlocks: [
        {
          id: "confirm-accept",
          language: "ts",
          code: `test('delete order with confirmation', async ({ page }) => {
  await page.goto('/orders')

  // Реєструємо обробник ДО кліку — прийняти confirm
  page.on('dialog', dialog => dialog.accept())

  await page.getByRole('row').filter({ hasText: 'ORDER-042' })
    .getByRole('button', { name: 'Delete' }).click()

  // Order видалений
  await expect(page.getByText('ORDER-042')).not.toBeVisible()
})

test('cancel deletes nothing', async ({ page }) => {
  await page.goto('/orders')

  // Відхилити confirm — order лишається
  page.on('dialog', dialog => dialog.dismiss())

  await page.getByRole('row').filter({ hasText: 'ORDER-042' })
    .getByRole('button', { name: 'Delete' }).click()

  await expect(page.getByText('ORDER-042')).toBeVisible()
})`,
        },
        {
          id: "prompt-fill",
          language: "ts",
          code: `test('rename order via prompt', async ({ page }) => {
  await page.goto('/orders')

  // Для prompt: acceptText встановлює що ввів користувач
  page.on('dialog', async dialog => {
    expect(dialog.type()).toBe('prompt')
    expect(dialog.message()).toBe('Enter new order name:')
    await dialog.accept('Laptop Stand Order')
  })

  await page.getByRole('button', { name: 'Rename' }).click()
  await expect(page.getByText('Laptop Stand Order')).toBeVisible()
})`,
        },
        {
          id: "check-message",
          language: "ts",
          code: `test('alert shows correct message', async ({ page }) => {
  await page.goto('/orders')

  let alertMessage = ''

  page.on('dialog', async dialog => {
    alertMessage = dialog.message()
    await dialog.accept()
  })

  // Дія що викликає alert
  await page.getByRole('button', { name: 'Show summary' }).click()

  // Перевіряємо текст після обробки
  expect(alertMessage).toContain('5 orders pending')
})`,
        },
      ],
    },
    {
      id: "beforeunload",
      title: {
        en: "beforeunload — unsaved changes warning",
        uk: "beforeunload — попередження про незбережені зміни",
      },
      paragraphs: [
        {
          en: "The `beforeunload` event fires when the user tries to leave the page with unsaved changes. The browser shows \"Are you sure you want to leave?\" — a dialog you can't suppress with CSS or locators. Handle it the same way: register before the action that navigates away.",
          uk: "Подія `beforeunload` спрацьовує коли користувач намагається покинути сторінку з незбереженими змінами. Браузер показує \"Are you sure you want to leave?\" — діалог який не можна закрити через CSS або локатори. Обробляй так само: реєструй до дії що призводить до навігації.",
        },
      ],
      codeBlocks: [
        {
          id: "beforeunload-code",
          language: "ts",
          code: `test('warns before leaving with unsaved edits', async ({ page }) => {
  await page.goto('/orders/42/edit')

  // Зміни без збереження
  await page.getByLabel('Item name').fill('Modified item')

  let dialogShown = false
  page.on('dialog', async dialog => {
    dialogShown = true
    expect(dialog.type()).toBe('beforeunload')
    await dialog.dismiss() // Залишитися на сторінці
  })

  await page.close({ runBeforeUnload: true })
  expect(dialogShown).toBe(true)
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your app shows a window.confirm() dialog when clicking Delete. The test calls .click() but the order is never deleted. What's the most likely cause?",
        uk: "Твій застосунок показує window.confirm() при кліку Delete. Тест викликає .click() але order ніколи не видаляється. Яка найімовірніша причина?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The locator for the Delete button is wrong",
            uk: "Неправильний локатор кнопки Delete",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright auto-dismisses confirm() with Cancel, so the code receives false and skips deletion",
            uk: "Playwright автоматично закриває confirm() через Cancel, тому код отримує false і пропускає видалення",
          },
        },
        {
          id: "c",
          label: {
            en: "The test needs await page.waitForTimeout(2000) before the click",
            uk: "Тесту потрібен await page.waitForTimeout(2000) перед кліком",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By default Playwright dismisses confirm() which returns false. Your delete code likely checks `if (confirm('Delete?'))` and skips deletion when it gets false. Fix: add `page.on('dialog', dialog => dialog.accept())` before the click.",
        uk: "За замовчуванням Playwright відхиляє confirm() що повертає false. Код видалення, найімовірніше, перевіряє `if (confirm('Delete?'))` і пропускає видалення при false. Виправлення: додати `page.on('dialog', dialog => dialog.accept())` до кліку.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Why must you register the page 'dialog' event handler BEFORE the action that triggers the dialog?",
        uk: "Чому потрібно реєструвати обробник події 'dialog' ДО дії що відкриває діалог?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Playwright requires all event handlers to be registered at test start",
            uk: "Playwright вимагає реєстрації всіх обробників подій на початку тесту",
          },
        },
        {
          id: "b",
          label: {
            en: "If the dialog appears before the handler is attached, Playwright auto-dismisses it and your handler never runs",
            uk: "Якщо діалог з'являється до підключення обробника, Playwright автоматично закриває його і твій обробник ніколи не виконається",
          },
        },
        {
          id: "c",
          label: {
            en: "The browser blocks the action until a dialog handler is registered",
            uk: "Браузер блокує дію поки не зареєстрований обробник діалогу",
          },
        },
        {
          id: "d",
          label: {
            en: "Dialog handlers can only be registered once per test",
            uk: "Обробники діалогів можна реєструвати лише один раз за тест",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The dialog event fires the moment the dialog appears. If your handler isn't registered yet, Playwright falls back to auto-dismissal (OK for alert, Cancel for confirm and prompt). The handler you register later never gets called for that dialog. The fix is always: register the handler first, then trigger the action.",
        uk: "Подія dialog спрацьовує в момент появи діалогу. Якщо твій обробник ще не зареєстрований, Playwright переходить до автоматичного закриття (OK для alert, Cancel для confirm і prompt). Обробник зареєстрований пізніше ніколи не буде викликаний для того діалогу. Виправлення завжди: спочатку зареєструй обробник, потім тригерни дію.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does dialog.message() return?",
        uk: "Що повертає dialog.message()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The type of dialog: 'alert', 'confirm', or 'prompt'",
            uk: "Тип діалогу: 'alert', 'confirm' або 'prompt'",
          },
        },
        {
          id: "b",
          label: {
            en: "The text shown inside the dialog — the message passed to alert(), confirm(), or prompt()",
            uk: "Текст показаний всередині діалогу — повідомлення передане до alert(), confirm() або prompt()",
          },
        },
        {
          id: "c",
          label: {
            en: "The value the user typed into a prompt dialog",
            uk: "Значення яке користувач ввів в prompt-діалозі",
          },
        },
        {
          id: "d",
          label: {
            en: "The HTML content of the dialog element",
            uk: "HTML-вміст елемента діалогу",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`dialog.message()` returns the string passed to the JavaScript dialog function — what's written inside `alert('...')`, `confirm('...')`, or `prompt('...')`. Use it to assert the exact text shown to the user. `dialog.type()` tells you whether it's 'alert', 'confirm', 'prompt', or 'beforeunload'.",
        uk: "`dialog.message()` повертає рядок переданий до JavaScript-функції діалогу — те що написано всередині `alert('...')`, `confirm('...')` або `prompt('...')`. Використовуй щоб перевірити точний текст показаний користувачу. `dialog.type()` повідомляє чи це 'alert', 'confirm', 'prompt' або 'beforeunload'.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "Your app shows a prompt() dialog asking users to type a name. How do you simulate the user typing 'Test Order' and clicking OK?",
        uk: "Твій застосунок показує prompt()-діалог що просить ввести назву. Як симулювати введення 'Test Order' і клік OK?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.on('dialog', dialog => dialog.accept()) — accept fills the default value",
            uk: "page.on('dialog', dialog => dialog.accept()) — accept заповнює значення за замовчуванням",
          },
        },
        {
          id: "b",
          label: {
            en: "page.on('dialog', async dialog => await dialog.accept('Test Order'))",
            uk: "page.on('dialog', async dialog => await dialog.accept('Test Order'))",
          },
        },
        {
          id: "c",
          label: {
            en: "page.on('dialog', dialog => dialog.fill('Test Order').accept())",
            uk: "page.on('dialog', dialog => dialog.fill('Test Order').accept())",
          },
        },
        {
          id: "d",
          label: {
            en: "page.keyboard.type('Test Order') then dialog.accept()",
            uk: "page.keyboard.type('Test Order') потім dialog.accept()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "For prompt dialogs, `dialog.accept(text)` simultaneously sets the input value and clicks OK. The text argument is what the JavaScript `prompt()` call will return. Calling `dialog.accept()` without text accepts with the default value (from the second argument of `prompt()`) or empty string.",
        uk: "Для prompt-діалогів `dialog.accept(text)` одночасно встановлює значення поля і клікає OK. Аргумент text — це те що повертає JavaScript-виклик `prompt()`. Виклик `dialog.accept()` без тексту приймає зі значенням за замовчуванням (з другого аргументу `prompt()`) або порожнім рядком.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What is the difference between dialog.accept() and dialog.dismiss()?",
        uk: "В чому різниця між dialog.accept() і dialog.dismiss()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "accept() closes the dialog; dismiss() leaves it open",
            uk: "accept() закриває діалог; dismiss() залишає його відкритим",
          },
        },
        {
          id: "b",
          label: {
            en: "accept() clicks OK/Yes (confirm returns true, prompt returns the value); dismiss() clicks Cancel (confirm returns false, prompt returns null)",
            uk: "accept() клікає OK/Yes (confirm повертає true, prompt повертає значення); dismiss() клікає Cancel (confirm повертає false, prompt повертає null)",
          },
        },
        {
          id: "c",
          label: {
            en: "They are identical for alert dialogs but different for confirm",
            uk: "Вони однакові для alert-діалогів але відрізняються для confirm",
          },
        },
        {
          id: "d",
          label: {
            en: "dismiss() only works for beforeunload dialogs",
            uk: "dismiss() працює лише для beforeunload-діалогів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`dialog.accept()` simulates clicking the affirmative button: OK for alert and confirm (returns true), OK for prompt (returns the text value). `dialog.dismiss()` simulates clicking Cancel: for confirm it returns false, for prompt it returns null. For alert, both accept and dismiss close the dialog since alert has only one button. For beforeunload, dismiss means 'stay on the page'.",
        uk: "`dialog.accept()` симулює клік стверджуючої кнопки: OK для alert і confirm (повертає true), OK для prompt (повертає текстове значення). `dialog.dismiss()` симулює клік Cancel: для confirm повертає false, для prompt — null. Для alert обидва accept і dismiss закривають діалог оскільки alert має лише одну кнопку. Для beforeunload dismiss означає 'залишитися на сторінці'.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What happens if a dialog appears during a test and no 'dialog' event handler is registered?",
        uk: "Що відбувається якщо під час тесту з'являється діалог і жодного обробника події 'dialog' не зареєстровано?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The test throws an error immediately",
            uk: "Тест одразу кидає помилку",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright auto-dismisses the dialog: OK for alert, Cancel for confirm and prompt",
            uk: "Playwright автоматично закриває діалог: OK для alert, Cancel для confirm і prompt",
          },
        },
        {
          id: "c",
          label: {
            en: "The dialog stays open and the test hangs waiting for user input",
            uk: "Діалог залишається відкритим і тест зависає чекаючи введення користувача",
          },
        },
        {
          id: "d",
          label: {
            en: "The browser screenshot captures the dialog and the test continues",
            uk: "Скріншот браузера захоплює діалог і тест продовжується",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright automatically dismisses any unhandled dialog to keep tests from hanging. For `alert` it clicks OK (the only option). For `confirm` it clicks Cancel (returns false). For `prompt` it clicks Cancel (returns null). This is why tests that need confirm() to return true silently fail — the auto-dismiss behavior returns false.",
        uk: "Playwright автоматично закриває будь-який необроблений діалог щоб тести не зависали. Для `alert` клікає OK (єдиний варіант). Для `confirm` клікає Cancel (повертає false). Для `prompt` клікає Cancel (повертає null). Тому тести що потребують щоб confirm() повернув true тихо не проходять — поведінка авто-закриття повертає false.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "How do you verify the text of an alert dialog message inside a dialog handler?",
        uk: "Як перевірити текст повідомлення alert-діалогу всередині обробника діалогу?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.on('dialog', dialog => expect(dialog.text()).toBe('5 orders pending'))",
            uk: "page.on('dialog', dialog => expect(dialog.text()).toBe('5 orders pending'))",
          },
        },
        {
          id: "b",
          label: {
            en: "Capture dialog.message() inside the handler into a variable, then assert it after the triggering action",
            uk: "Зберегти dialog.message() всередині обробника в змінну, потім перевірити після тригерної дії",
          },
        },
        {
          id: "c",
          label: {
            en: "page.waitForDialog().then(d => expect(d.message()).toBe(...))",
            uk: "page.waitForDialog().then(d => expect(d.message()).toBe(...))",
          },
        },
        {
          id: "d",
          label: {
            en: "Use page.screenshot() to capture the dialog text visually",
            uk: "Використовувати page.screenshot() для захоплення тексту діалогу візуально",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The clean pattern: declare a variable outside the handler, set it inside the handler with `alertMessage = dialog.message()`, then `await dialog.accept()`. After the triggering action completes, assert the variable: `expect(alertMessage).toContain('5 orders pending')`. This works because the handler runs synchronously within the event flow before the action resolves.",
        uk: "Чистий патерн: оголоси змінну поза обробником, встанови всередині обробника через `alertMessage = dialog.message()`, потім `await dialog.accept()`. Після завершення тригерної дії — перевіряй змінну: `expect(alertMessage).toContain('5 orders pending')`. Це працює бо обробник виконується синхронно в потоці подій до резолву дії.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You want to handle only the next dialog that appears, not all future ones. What do you use?",
        uk: "Хочеш обробити лише наступний діалог що з'явиться, а не всі майбутні. Що використовуєш?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "page.on('dialog', handler) then page.off('dialog', handler) after the action",
            uk: "page.on('dialog', handler) потім page.off('dialog', handler) після дії",
          },
        },
        {
          id: "b",
          label: {
            en: "page.once('dialog', handler) — fires for the next dialog only and auto-removes itself",
            uk: "page.once('dialog', handler) — спрацьовує лише для наступного діалогу і автоматично видаляє себе",
          },
        },
        {
          id: "c",
          label: {
            en: "page.waitForEvent('dialog') then call handler on the result",
            uk: "page.waitForEvent('dialog') потім виклич обробник на результаті",
          },
        },
        {
          id: "d",
          label: {
            en: "Set a flag inside the handler to skip subsequent calls",
            uk: "Встановити прапорець всередині обробника щоб пропускати подальші виклики",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.once('dialog', handler)` registers a listener that fires exactly once — for the very next dialog — and then automatically removes itself. This is the cleanest solution when you know exactly one dialog will appear. `page.on()` would keep firing for every subsequent dialog. `page.once()` is equivalent to `page.on()` followed by `page.off()` but in a single, self-cleaning call.",
        uk: "`page.once('dialog', handler)` реєструє слухача що спрацьовує рівно один раз — для самого наступного діалогу — і потім автоматично видаляє себе. Це найчистіше рішення коли знаєш що з'явиться рівно один діалог. `page.on()` продовжував би спрацьовувати для кожного наступного діалогу. `page.once()` еквівалентний `page.on()` з наступним `page.off()` але в одному самоочисному виклику.",
      },
    },
  ],
}
