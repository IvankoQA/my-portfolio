import type { PlaywrightTopic } from "../../types"

export const actionabilityTopic: PlaywrightTopic = {
  slug: "actionability",
  groupId: "guides",
  order: 105,
  level: "beginner",
  trackOrder: 9,
  sourceDoc: "actionability.md",
  officialDocsUrl: "https://playwright.dev/docs/actionability",
  title: {
    en: "Auto-waiting",
    uk: "Автоочікування",
  },
  summary: {
    en: "Tests that fail only on CI are almost always a timing issue. Playwright's auto-waiting solves most of them without a single sleep() — it checks that an element is ready before every action.",
    uk: "Тести що падають тільки на CI — майже завжди проблема тайміногу. Auto-waiting вирішує більшість з них без жодного sleep() — Playwright сам перевіряє готовність елемента перед кожною дією.",
  },
  sections: [
    {
      id: "introduction",
      title: {
        en: "How auto-waiting works",
        uk: "Як працює автоочікування",
      },
      diagram: {
        mermaid: `flowchart TD
  A["locator.click()"] --> B{"Visible?"}
  B -- No --> W1["⏳ wait"]
  W1 --> B
  B -- Yes --> C{"Stable?"}
  C -- No --> W2["⏳ wait"]
  W2 --> C
  C -- Yes --> D{"Receives events?"}
  D -- No --> W3["⏳ wait"]
  W3 --> D
  D -- Yes --> E{"Enabled?"}
  E -- No --> W4["⏳ wait"]
  W4 --> E
  E -- Yes --> F["✓ Click fires"]`,
        caption: {
          en: "Before every click, Playwright runs this checklist automatically",
          uk: "Перед кожним кліком Playwright автоматично проходить цей чеклист",
        },
      },
      paragraphs: [
        {
          en: "Flaky tests that pass locally but fail on CI are usually a timing problem — the test clicks something before it's ready. Auto-waiting is Playwright's answer: before every action, it silently runs a checklist. No manual waits, no arbitrary sleeps.",
          uk: "Тести що стабільно проходять локально але падають на CI — майже завжди проблема часу: тест клікає раніше ніж елемент готовий. Автоочікування — це відповідь Playwright: перед кожною дією він тихо перевіряє чеклист. Жодних ручних waitForSelector чи sleep.",
        },
        {
          en: "For `locator.click()`, Playwright checks four things in sequence:\n1. Visible — the element has a non-zero size and isn't hidden\n2. Stable — not currently animating or transitioning\n3. Receives events — not covered by another element like a modal or spinner\n4. Enabled — not disabled via HTML attribute or ARIA",
          uk: "Для `locator.click()` Playwright по черзі перевіряє чотири умови:\n1. Видимий — елемент має розміри і не прихований\n2. Стабільний — не анімується і не в перехідному стані\n3. Не перекритий — модальним вікном, спінером або тултіпом\n4. Увімкнений — не задизейблений через HTML або ARIA",
        },
        {
          en: "If any check fails, Playwright waits and retries until the default 30-second timeout expires. When it does, you get a descriptive `TimeoutError` — not a mystery crash.",
          uk: "Якщо будь-яка умова не виконана, Playwright чекає і перевіряє знову до закінчення дефолтного 30-секундного таймауту. Коли він спливає — отримуєш зрозумілий `TimeoutError`, а не загадкове падіння.",
        },
      ],
    },
    {
      id: "checks-per-action",
      title: {
        en: "Which checks run for which actions",
        uk: "Які перевірки для яких дій",
      },
      paragraphs: [
        {
          en: "Not every action needs all four checks. `fill()` doesn't care about stability — it just needs the field to be visible, enabled and editable. `hover()` doesn't require the element to be enabled. Here's the reference:",
          uk: "Не кожна дія потребує всіх чотирьох перевірок. `fill()` не перевіряє стабільність — лише видимість, увімкненість і редагованість. `hover()` не вимагає увімкненого стану. Шпаргалка:",
        },
        {
          en: "| Action | Visible | Stable | Receives Events | Enabled | Editable |\n| :- | :-: | :-: | :-: | :-: | :-: |\n| `locator.check()` | Yes | Yes | Yes | Yes | - |\n| `locator.click()` | Yes | Yes | Yes | Yes | - |\n| `locator.dblclick()` | Yes | Yes | Yes | Yes | - |\n| `locator.tap()` | Yes | Yes | Yes | Yes | - |\n| `locator.hover()` | Yes | Yes | Yes | - | - |\n| `locator.dragTo()` | Yes | Yes | Yes | - | - |\n| `locator.screenshot()` | Yes | Yes | - | - | - |\n| `locator.fill()` | Yes | - | - | Yes | Yes |\n| `locator.clear()` | Yes | - | - | Yes | Yes |\n| `locator.selectOption()` | Yes | - | - | Yes | - |\n| `locator.selectText()` | Yes | - | - | - | - |\n| `locator.blur()` | - | - | - | - | - |\n| `locator.press()` | - | - | - | - | - |",
          uk: "| Дія | Видимий | Стабільний | Не перекритий | Увімкнений | Редагований |\n| :- | :-: | :-: | :-: | :-: | :-: |\n| `locator.check()` | Так | Так | Так | Так | - |\n| `locator.click()` | Так | Так | Так | Так | - |\n| `locator.dblclick()` | Так | Так | Так | Так | - |\n| `locator.tap()` | Так | Так | Так | Так | - |\n| `locator.hover()` | Так | Так | Так | - | - |\n| `locator.dragTo()` | Так | Так | Так | - | - |\n| `locator.screenshot()` | Так | Так | - | - | - |\n| `locator.fill()` | Так | - | - | Так | Так |\n| `locator.clear()` | Так | - | - | Так | Так |\n| `locator.selectOption()` | Так | - | - | Так | - |\n| `locator.selectText()` | Так | - | - | - | - |\n| `locator.blur()` | - | - | - | - | - |\n| `locator.press()` | - | - | - | - | - |",
        },
      ],
    },
    {
      id: "forcing-actions",
      title: {
        en: "Bypassing checks with force",
        uk: "Обхід перевірок через force",
      },
      paragraphs: [
        {
          en: "If you need to click an element that's technically covered by an overlay, pass `{ force: true }`. This skips the \"receives events\" check and fires the click directly at the element's coordinates. Use it sparingly — if you're reaching for `force: true` often, the test is probably fighting the UI instead of working with it.",
          uk: "Якщо треба клікнути елемент що технічно перекритий оверлеєм — передай `{ force: true }`. Це пропускає перевірку \"не перекритий\" і відправляє клік прямо в координати елемента. Але якщо ти часто вимушений форсити — це знак що тест бореться з UI замість того щоб з ним співпрацювати.",
        },
      ],
      codeBlocks: [
        {
          id: "force",
          language: "ts",
          code: `// Пропустити перевірку "отримує події" для кнопки під оверлеєм
await page.getByRole('button', { name: 'Зберегти' }).click({ force: true })

// Те саме для fill
await page.getByLabel('Email').fill('test@example.com', { force: true })`,
        },
      ],
    },
    {
      id: "assertions",
      title: {
        en: "Assertions auto-wait too",
        uk: "Асерти теж авто-чекають",
      },
      paragraphs: [
        {
          en: "The same retry logic applies to `expect()` assertions. If the condition isn't met yet, Playwright keeps retrying until the assertion passes or the timeout expires. You rarely need explicit waits before assertions — just write what you expect and let Playwright handle the timing.",
          uk: "Та сама логіка повторних спроб діє для `expect()`. Якщо умова ще не виконана — Playwright перевіряє знову до таймауту. Явні waits перед асертами майже ніколи не потрібні: пиши що очікуєш, а тайміног Playwright бере на себе.",
        },
      ],
      codeBlocks: [
        {
          id: "assertions-example",
          language: "ts",
          code: `// Чекає поки кнопка стане видимою (наприклад після завантаження)
await expect(page.getByRole('button', { name: 'Готово' })).toBeVisible()

// Чекає поки таблиця завантажить всі 12 рядків
await expect(page.getByRole('row')).toHaveCount(12)

// Чекає поки URL зміниться після редиректу
await expect(page).toHaveURL('/dashboard')`,
        },
      ],
    },
    {
      id: "visible",
      title: {
        en: "What counts as visible",
        uk: "Що вважається видимим",
      },
      paragraphs: [
        {
          en: "An element is visible when it has a non-zero bounding box and its computed style is not `visibility: hidden`. Three edge cases worth knowing:\n1. Elements with `display: none` — **not** visible\n2. Elements with zero width or zero height — **not** visible\n3. Elements with `opacity: 0` — **are** visible (they have a box, just transparent)",
          uk: "Елемент видимий якщо він має ненульовий bounding box і обчислений стиль не `visibility: hidden`. Три граничні випадки що варто пам'ятати:\n1. Елементи з `display: none` — **не** видимі\n2. Елементи з нульовою шириною або висотою — **не** видимі\n3. Елементи з `opacity: 0` — **видимі** (вони мають розміри, просто прозорі)",
        },
      ],
    },
    {
      id: "stable",
      title: {
        en: "What counts as stable",
        uk: "Що вважається стабільним",
      },
      paragraphs: [
        {
          en: "An element is stable when its bounding box hasn't moved for at least two consecutive animation frames. In practice this means Playwright waits for CSS transitions and animations to finish before acting. If a dropdown slides in from the top, Playwright clicks only after it stops moving — no manual `waitForSelector` needed.",
          uk: "Елемент стабільний якщо його bounding box не змінювався щонайменше два кадри підряд. На практиці це означає що Playwright чекає завершення CSS-переходів і анімацій. Якщо дропдаун виїжджає зверху — клік відбудеться тільки після зупинки. Жодного ручного waitForSelector.",
        },
      ],
    },
    {
      id: "enabled",
      title: {
        en: "What counts as enabled",
        uk: "Що вважається увімкненим",
      },
      paragraphs: [
        {
          en: "An element is disabled — and Playwright won't interact with it — in three cases:\n1. It's a `<button>`, `<input>`, `<select>` or `<textarea>` with the `[disabled]` attribute\n2. It's inside a `<fieldset disabled>`\n3. It has an ancestor with `[aria-disabled=true]`\n\nPractical case: the Submit button is disabled until the form is valid. Playwright waits for validation to pass before clicking — the test just works.",
          uk: "Елемент вимкнений — і Playwright не буде з ним взаємодіяти — в трьох випадках:\n1. Це `<button>`, `<input>`, `<select>` або `<textarea>` з атрибутом `[disabled]`\n2. Він знаходиться в `<fieldset disabled>`\n3. Один з батьківських елементів має `[aria-disabled=true]`\n\nПрактичний приклад: кнопка Submit вимкнена поки форма не валідна. Playwright чекає поки валідація пройде і кнопка стане активною — тест просто працює.",
        },
      ],
    },
    {
      id: "receives-events",
      title: {
        en: "What counts as receiving events",
        uk: "Що означає отримувати події",
      },
      paragraphs: [
        {
          en: "Even a visible and enabled button might not receive clicks if something is sitting on top of it — a loading spinner, a modal backdrop, or a cookie banner. Playwright checks that the element at the exact click coordinates is the target (or a descendant of it), not an interceptor.",
          uk: "Навіть видима і активна кнопка може не отримати клік якщо щось лежить зверху — спінер завантаження, підложка модального вікна або банер cookies. Playwright перевіряє що елемент в точних координатах кліку — це саме ціль (або її нащадок), а не перехоплювач.",
        },
        {
          en: "Real example: you click 'Save' but a loading overlay is still showing. Playwright waits for the overlay to disappear, then clicks. Without this check the click would hit the overlay silently and nothing would happen.",
          uk: "Реальний приклад: натискаєш 'Зберегти' але оверлей завантаження ще видимий. Playwright чекає поки оверлей зникне — і тоді клікає. Без цієї перевірки клік потрапив би в оверлей і мовчки нічого б не зробив.",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "A button is visible and enabled, but clicking it does nothing in the test. The page has a loading spinner that covers the button briefly. What's happening and how does Playwright handle it?",
        uk: "Кнопка видима і активна, але клік на неї нічого не робить у тесті. На сторінці є спінер завантаження що коротко перекриває кнопку. Що відбувається і як Playwright це обробляє?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Playwright clicks immediately — visibility and enabled status are sufficient",
            uk: "Playwright клікає одразу — видимість і активність достатні",
          },
        },
        {
          id: "b",
          label: {
            en: "Playwright waits for the spinner to disappear (the 'receives events' check), then clicks",
            uk: "Playwright чекає поки спінер зникне (перевірка 'не перекритий'), потім клікає",
          },
        },
        {
          id: "c",
          label: {
            en: "You need to add await page.waitForSelector('.spinner', { state: 'hidden' }) manually",
            uk: "Треба вручну додати await page.waitForSelector('.spinner', { state: 'hidden' })",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The 'receives events' check verifies that the element at the exact click coordinates is the target, not something sitting on top of it. While the spinner is visible, it intercepts the click — Playwright detects this and waits until the spinner is gone before firing the click. No manual wait needed.",
        uk: "Перевірка 'не перекритий' верифікує що елемент у точних координатах кліку є ціллю, а не чимось що лежить зверху. Поки спінер видимий він перехоплює клік — Playwright це виявляє і чекає поки спінер зникне перш ніж виконати клік. Ручний wait не потрібен.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "An element has opacity: 0 in CSS. Is it considered 'visible' by Playwright's actionability checks?",
        uk: "Елемент має opacity: 0 у CSS. Чи вважається він 'видимим' за перевірками actionability Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "No — opacity: 0 makes it invisible, Playwright won't act on it",
            uk: "Ні — opacity: 0 робить його невидимим, Playwright не буде з ним взаємодіяти",
          },
        },
        {
          id: "b",
          label: {
            en: "Yes — it still has a bounding box, so it counts as visible",
            uk: "Так — він все ще має bounding box, тому вважається видимим",
          },
        },
        {
          id: "c",
          label: {
            en: "It depends on whether pointer-events is also disabled",
            uk: "Залежить від того чи вимкнено також pointer-events",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's visibility check looks at bounding box size and `visibility: hidden` CSS property. `opacity: 0` makes the element transparent but it still occupies space — so it IS visible to Playwright. `display: none` and `visibility: hidden` are the properties that actually make an element non-visible.",
        uk: "Перевірка видимості в Playwright дивиться на розмір bounding box і CSS-властивість `visibility: hidden`. `opacity: 0` робить елемент прозорим але він все ще займає місце — тому він IS видимий для Playwright. `display: none` і `visibility: hidden` — це властивості що справді роблять елемент невидимим.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What does Playwright's 'stable' check verify before performing a click?",
        uk: "Що перевіряє Playwright у перевірці 'стабільний' перед кліком?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "That the element's text content has not changed in the last second",
            uk: "Що текстовий вміст елемента не змінювався протягом останньої секунди",
          },
        },
        {
          id: "b",
          label: {
            en: "That the element's bounding box has not moved for at least two consecutive animation frames",
            uk: "Що bounding box елемента не рухався протягом щонайменше двох послідовних кадрів анімації",
          },
        },
        {
          id: "c",
          label: {
            en: "That the element has no active CSS transitions in its style attribute",
            uk: "Що елемент не має активних CSS-переходів в атрибуті style",
          },
        },
        {
          id: "d",
          label: {
            en: "That the element is inside the visible viewport",
            uk: "Що елемент знаходиться в межах видимого viewport",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Stable means the element's bounding box has not moved for at least two consecutive animation frames. This ensures CSS transitions and animations have finished before the action fires. If a dropdown is still sliding into position, Playwright waits until it stops — no manual waitForSelector required.",
        uk: "Стабільний означає що bounding box елемента не рухався щонайменше два кадри підряд. Це гарантує що CSS-переходи і анімації завершилися перед виконанням дії. Якщо дропдаун ще виїжджає — Playwright чекає поки він зупиниться, без ручного waitForSelector.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "When does Playwright throw a TimeoutError for an actionability check?",
        uk: "Коли Playwright кидає TimeoutError через перевірку actionability?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Immediately when the first check fails",
            uk: "Одразу коли перша перевірка не проходить",
          },
        },
        {
          id: "b",
          label: {
            en: "After retrying all checks until the configured timeout (default 30 s) expires",
            uk: "Після повторних спроб перевірок до закінчення таймауту (за замовчуванням 30 с)",
          },
        },
        {
          id: "c",
          label: {
            en: "After exactly 3 retry attempts regardless of timeout setting",
            uk: "Після рівно 3 спроб незалежно від налаштування таймауту",
          },
        },
        {
          id: "d",
          label: {
            en: "Only if the element is not found in the DOM at all",
            uk: "Тільки якщо елемент взагалі відсутній в DOM",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When an actionability check fails, Playwright does not throw immediately. It keeps retrying the entire checklist until the default 30-second timeout expires, then throws a descriptive TimeoutError explaining which condition was not met. This gives the page enough time to finish rendering or remove overlays.",
        uk: "Коли перевірка actionability не проходить, Playwright не кидає помилку одразу. Він повторює весь чеклист поки не спливе дефолтний 30-секундний таймаут, а потім кидає зрозумілий TimeoutError з поясненням якої умови не виконано. Це дає сторінці час завершити рендеринг або прибрати оверлеї.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "What does passing { force: true } to locator.click() actually skip?",
        uk: "Що насправді пропускає передача { force: true } до locator.click()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "All actionability checks — visible, stable, receives events, and enabled",
            uk: "Всі перевірки actionability — visible, stable, receives events та enabled",
          },
        },
        {
          id: "b",
          label: {
            en: "Only the 'receives events' check, so the click fires at the element's coordinates even if something covers it",
            uk: "Тільки перевірку 'receives events', тому клік відбувається в координатах елемента навіть якщо щось його перекриває",
          },
        },
        {
          id: "c",
          label: {
            en: "The network request that the click would normally trigger",
            uk: "Мережевий запит який клік зазвичай ініціював би",
          },
        },
        {
          id: "d",
          label: {
            en: "The timeout — the click fires without waiting at all",
            uk: "Таймаут — клік відбувається без будь-якого очікування",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "{ force: true } skips the 'receives events' check and dispatches the click directly at the element's coordinates, even if another element (like a modal or spinner) is positioned on top. The other checks — visible, stable, enabled — are still applied. Use force sparingly; needing it often signals the test is working against the UI.",
        uk: "{ force: true } пропускає перевірку 'receives events' і відправляє клік прямо в координати елемента, навіть якщо зверху розміщений інший елемент (як модальне вікно або спінер). Інші перевірки — visible, stable, enabled — все ще виконуються. Використовуй force рідко; часта необхідність в ньому сигналізує що тест бореться з UI.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "Which actionability checks does locator.fill() require, compared to locator.click()?",
        uk: "Які перевірки actionability вимагає locator.fill() порівняно з locator.click()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "fill() requires the same four checks as click(): visible, stable, receives events, enabled",
            uk: "fill() вимагає ті самі чотири перевірки що й click(): visible, stable, receives events, enabled",
          },
        },
        {
          id: "b",
          label: {
            en: "fill() requires visible, enabled, and editable — but NOT stable or receives events",
            uk: "fill() вимагає visible, enabled та editable — але НЕ stable і не receives events",
          },
        },
        {
          id: "c",
          label: {
            en: "fill() requires no actionability checks at all — it always writes directly",
            uk: "fill() не вимагає жодних перевірок actionability — воно завжди пише безпосередньо",
          },
        },
        {
          id: "d",
          label: {
            en: "fill() only requires that the element is editable",
            uk: "fill() вимагає лише щоб елемент був редагованим",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "fill() checks visible, enabled, and editable — but skips stable and receives events. This makes sense because filling a text field doesn't need the element to have finished a CSS animation, and the field doesn't need to be the topmost element at its coordinates. The editable check (not required by click()) ensures the field is not readonly.",
        uk: "fill() перевіряє visible, enabled та editable — але пропускає stable і receives events. Це логічно: заповнення текстового поля не вимагає завершення CSS-анімації, і поле не обов'язково має бути верхнім елементом у своїх координатах. Перевірка editable (не вимагається click()) гарантує що поле не є readonly.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "An element has [aria-disabled='true'] on its parent. Will locator.click() wait or throw?",
        uk: "Елемент має [aria-disabled='true'] на батьківському елементі. locator.click() буде чекати чи кине помилку?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Click immediately — aria-disabled is a hint for screen readers, not enforced by Playwright",
            uk: "Клікне одразу — aria-disabled є підказкою для скрінрідерів, Playwright її не враховує",
          },
        },
        {
          id: "b",
          label: {
            en: "Wait until the timeout expires because the enabled check fails, then throw TimeoutError",
            uk: "Чекатиме поки не спливе таймаут бо перевірка enabled не проходить, потім кине TimeoutError",
          },
        },
        {
          id: "c",
          label: {
            en: "Throw an ElementDisabledError immediately without waiting",
            uk: "Кине ElementDisabledError одразу без очікування",
          },
        },
        {
          id: "d",
          label: {
            en: "Click the element but log a warning about aria-disabled",
            uk: "Клікне елемент але виведе попередження про aria-disabled",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's enabled check covers three cases: the [disabled] HTML attribute, a <fieldset disabled> ancestor, and [aria-disabled='true'] on any ancestor. All three block interaction. When [aria-disabled='true'] is present, the enabled check fails repeatedly until the timeout expires and a TimeoutError is thrown.",
        uk: "Перевірка enabled у Playwright охоплює три випадки: атрибут HTML [disabled], предок <fieldset disabled>, і [aria-disabled='true'] на будь-якому предку. Всі три блокують взаємодію. Коли присутній [aria-disabled='true'], перевірка enabled постійно не проходить поки не спливе таймаут і не кинеться TimeoutError.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "How is expect(locator).toBeVisible() different from Playwright's actionability 'visible' check?",
        uk: "Чим expect(locator).toBeVisible() відрізняється від перевірки actionability 'visible' у Playwright?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are identical — both use exactly the same logic and retry loop",
            uk: "Вони ідентичні — обидва використовують абсолютно однакову логіку і цикл повторів",
          },
        },
        {
          id: "b",
          label: {
            en: "toBeVisible() is an assertion that retries until the element is visible (or timeout); the actionability check is part of an action and retries the full checklist before acting",
            uk: "toBeVisible() є assertion що повторює поки елемент не стане видимим (або таймаут); перевірка actionability є частиною дії і повторює повний чеклист перед виконанням дії",
          },
        },
        {
          id: "c",
          label: {
            en: "toBeVisible() only runs once, while the actionability check retries automatically",
            uk: "toBeVisible() виконується лише один раз, тоді як перевірка actionability повторює автоматично",
          },
        },
        {
          id: "d",
          label: {
            en: "The actionability check uses a shorter timeout than toBeVisible()",
            uk: "Перевірка actionability використовує коротший таймаут ніж toBeVisible()",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Both retry, but they serve different purposes. expect(locator).toBeVisible() is a standalone assertion — it polls until visibility is confirmed or the assertion timeout (default 5 s) expires. The actionability visible check is one gate in a sequence of checks (visible → stable → receives events → enabled) that runs automatically before every action. You rarely need to write toBeVisible() before a click; Playwright's actionability already waits for the element to be ready.",
        uk: "Обидва повторюють, але слугують різним цілям. expect(locator).toBeVisible() — це самостійний assertion: він опитує поки видимість не підтвердиться або не спливе таймаут assertion (за замовчуванням 5 с). Перевірка actionability visible — це один з кроків у послідовності перевірок (visible → stable → receives events → enabled) що виконується автоматично перед кожною дією. Рідко потрібно писати toBeVisible() перед кліком — actionability Playwright вже чекає готовності елемента.",
      },
    },
  ],
}
