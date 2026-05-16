import type { PlaywrightTopic } from "../../types"

export const touchEventsTopic: PlaywrightTopic = {
  slug: "touch-events",
  groupId: "guides",
  order: 410,
  level: "advanced",
  trackOrder: 24,
  sourceDoc: "touch-events.md",
  officialDocsUrl: "https://playwright.dev/docs/touch-events",
  title: {
    en: "Touch events (legacy)",
    uk: "Події дотику (legacy)",
  },
  summary: {
    en: "When an app handles legacy Touch Events — not Pointer Events — for swipe, pinch, and tap gestures, I dispatch them manually with locator.dispatchEvent('touchstart'/'touchmove'/'touchend'). The key gotcha: dispatchEvent doesn't set Event.isTrusted. If the app gates behavior on that property to detect automation, you'll need to disable that check during tests.",
    uk: "Коли застосунок обробляє legacy Touch Events — не Pointer Events — для жестів свайп, pinch і тап, диспетчеризую їх вручну через locator.dispatchEvent('touchstart'/'touchmove'/'touchend'). Ключова підводна: dispatchEvent не встановлює Event.isTrusted. Якщо застосунок перевіряє цю властивість щоб виявити автоматизацію — потрібно вимкнути цю перевірку під час тестів.",
  },
  sections: [
    {
      id: "when-to-use",
      title: {
        en: "When to use manual touch dispatch",
        uk: "Коли використовувати ручну диспетчеризацію дотиків",
      },
      paragraphs: [
        {
          en: "Modern apps typically use Pointer Events, which Playwright handles automatically with `locator.tap()` when `hasTouch: true` is set in device emulation. Manual dispatch is only needed for older apps that specifically listen for `touchstart`, `touchmove`, and `touchend` events on DOM elements.",
          uk: "Сучасні застосунки зазвичай використовують Pointer Events, з якими Playwright автоматично справляється через `locator.tap()` при встановленому `hasTouch: true` в емуляції пристрою. Ручна диспетчеризація потрібна лише для старих застосунків що слухають саме події `touchstart`, `touchmove`, `touchend` на DOM-елементах.",
        },
        {
          en: "Each touch event needs a list of `Touch` points with at minimum `identifier`, `clientX`, and `clientY`. Three lists are required: `touches` (all current touches), `changedTouches` (touches that changed this event), and `targetTouches` (touches on the target element).",
          uk: "Кожна touch-подія потребує список точок `Touch` з мінімум `identifier`, `clientX` і `clientY`. Потрібні три списки: `touches` (всі поточні дотики), `changedTouches` (що змінилися у цій події) і `targetTouches` (дотики на цільовому елементі).",
        },
      ],
    },
    {
      id: "pan-gesture",
      title: {
        en: "Pan gesture (swipe)",
        uk: "Жест pan (свайп)",
      },
      paragraphs: [
        {
          en: "A pan is one touch point moving across the element. The pattern: `touchstart` at the center, multiple `touchmove` events stepping toward the target offset, then `touchend`. I compute the element center from `getBoundingClientRect()` and move by `deltaX`/`deltaY` across `steps` increments:",
          uk: "Pan — це одна точка дотику що рухається по елементу. Патерн: `touchstart` у центрі, кілька `touchmove` подій крокуючи до цільового зміщення, потім `touchend`. Обчислюю центр елемента через `getBoundingClientRect()` і рухаюся кроками `deltaX`/`deltaY` по `steps` інкрементах:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: `test.use({ ...devices['Pixel 7'] });

async function pan(locator: Locator, deltaX?: number, deltaY?: number, steps?: number) {
  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {
    const bounds = target.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    return { centerX, centerY };
  });

  // Providing only clientX and clientY as the app only cares about those.
  const touches = [{
    identifier: 0,
    clientX: centerX,
    clientY: centerY,
  }];
  await locator.dispatchEvent('touchstart',
      { touches, changedTouches: touches, targetTouches: touches });

  steps = steps ?? 5;
  deltaX = deltaX ?? 0;
  deltaY = deltaY ?? 0;
  for (let i = 1; i <= steps; i++) {
    const touches = [{
      identifier: 0,
      clientX: centerX + deltaX * i / steps,
      clientY: centerY + deltaY * i / steps,
    }];
    await locator.dispatchEvent('touchmove',
        { touches, changedTouches: touches, targetTouches: touches });
  }

  await locator.dispatchEvent('touchend');
}

test('pan gesture to move the map', async ({ page }) => {
  await page.goto('/dashboard');
  const map = page.locator('[data-test-id="met"]');
  for (let i = 0; i < 5; i++)
    await pan(map, 200, 100);
  await expect(map).toHaveScreenshot();
});`,
        },
      ],
    },
    {
      id: "pinch-gesture",
      title: {
        en: "Pinch gesture (zoom)",
        uk: "Жест pinch (масштабування)",
      },
      paragraphs: [
        {
          en: "A pinch uses two touch points. For pinch-in (zoom out), the points start far apart and move toward each other. For pinch-out (zoom in), they start close and move apart. Each step updates both touch points simultaneously in the `touchmove` event:",
          uk: "Pinch використовує дві точки дотику. Для pinch-in (zoom out) — точки починають далеко і зближуються. Для pinch-out (zoom in) — починають близько і розходяться. Кожен крок оновлює обидві точки одночасно в події `touchmove`:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: `test.use({ ...devices['Pixel 7'] });

async function pinch(locator: Locator,
  arg: { deltaX?: number, deltaY?: number, steps?: number, direction?: 'in' | 'out' }) {
  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {
    const bounds = target.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    return { centerX, centerY };
  });

  const deltaX = arg.deltaX ?? 50;
  const steps = arg.steps ?? 5;
  const stepDeltaX = deltaX / (steps + 1);

  // Two touch points equally distant from the center of the element.
  const touches = [
    {
      identifier: 0,
      clientX: centerX - (arg.direction === 'in' ? deltaX : stepDeltaX),
      clientY: centerY,
    },
    {
      identifier: 1,
      clientX: centerX + (arg.direction === 'in' ? deltaX : stepDeltaX),
      clientY: centerY,
    },
  ];
  await locator.dispatchEvent('touchstart',
      { touches, changedTouches: touches, targetTouches: touches });

  for (let i = 1; i <= steps; i++) {
    const offset = (arg.direction === 'in' ? (deltaX - i * stepDeltaX) : (stepDeltaX * (i + 1)));
    const touches = [
      {
        identifier: 0,
        clientX: centerX - offset,
        clientY: centerY,
      },
      {
        identifier: 0,
        clientX: centerX + offset,
        clientY: centerY,
      },
    ];
    await locator.dispatchEvent('touchmove',
        { touches, changedTouches: touches, targetTouches: touches });
  }

  await locator.dispatchEvent('touchend', { touches: [], changedTouches: [], targetTouches: [] });
}

test('pinch in gesture to zoom out the map', async ({ page }) => {
  await page.goto('/dashboard');
  const map = page.locator('[data-test-id="met"]');
  for (let i = 0; i < 5; i++)
    await pinch(map, { deltaX: 40, direction: 'in' });
  await expect(map).toHaveScreenshot();
});`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You're testing a mobile swipe widget. You call locator.dispatchEvent('touchstart') without extra arguments, then 'touchmove', then 'touchend', but the widget doesn't respond. What's most likely missing?",
        uk: "Тестуєш мобільний swipe-віджет. Викликаєш locator.dispatchEvent('touchstart') без додаткових аргументів, потім 'touchmove', потім 'touchend' — але віджет не реагує. Чого найімовірніше бракує?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "dispatchEvent doesn't support touch events — use page.touchscreen.tap() instead",
            uk: "dispatchEvent не підтримує touch-події — використовуй page.touchscreen.tap()",
          },
        },
        {
          id: "b",
          label: {
            en: "The touch event needs Touch point data as the second argument: { touches: [{ identifier: 0, clientX: ..., clientY: ... }], changedTouches: [...], targetTouches: [...] } — without coordinates the widget receives touchstart but can't tell where the touch is",
            uk: "Touch-подія потребує дані точок як другий аргумент: { touches: [{ identifier: 0, clientX: ..., clientY: ... }], changedTouches: [...], targetTouches: [...] } — без координат віджет отримує touchstart але не знає де саме дотик",
          },
        },
        {
          id: "c",
          label: {
            en: "You need to set hasTouch: true in the test config for touch events to fire",
            uk: "Потрібно встановити hasTouch: true у конфігурації тесту щоб touch-події спрацьовували",
          },
        },
        {
          id: "d",
          label: {
            en: "Touch events require enabling experimental flags in the browser context",
            uk: "Touch-події вимагають увімкнення експериментальних прапорців у контексті браузера",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Touch events carry coordinate information through Touch objects in three lists: `touches` (all active touches), `changedTouches` (touches that changed this event), and `targetTouches` (touches on the specific element). Without these, the event fires but the widget receives undefined coordinates — it can't compute a swipe direction or distance. At minimum each Touch point needs `{ identifier, clientX, clientY }`. `hasTouch: true` enables touch emulation globally, but doesn't help when dispatching raw events manually — the coordinates still need to be provided explicitly.",
        uk: "Touch-події передають координати через об'єкти Touch у трьох списках: `touches` (всі активні дотики), `changedTouches` (що змінилися у цій події), `targetTouches` (дотики на конкретному елементі). Без них подія спрацьовує але віджет отримує невизначені координати — він не може обчислити напрямок або відстань свайпу. Мінімум кожна точка дотику потребує `{ identifier, clientX, clientY }`. `hasTouch: true` вмикає емуляцію дотиків глобально але не допомагає при ручній диспетчеризації сирих подій — координати все одно потрібно надавати явно.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Your app uses modern Pointer Events (not legacy Touch Events) for its swipe gesture. You want to test the swipe in a mobile device emulation. What's the simplest approach?",
        uk: "Твій застосунок використовує сучасні Pointer Events (не legacy Touch Events) для жесту свайпу. Хочеш протестувати свайп в емуляції мобільного пристрою. Який найпростіший підхід?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use locator.dispatchEvent('pointerdown') then 'pointermove' then 'pointerup' with coordinate data",
            uk: "Використовуй locator.dispatchEvent('pointerdown') потім 'pointermove' потім 'pointerup' з даними координат",
          },
        },
        {
          id: "b",
          label: {
            en: "Set test.use({ ...devices['Pixel 7'] }) and use locator.tap() or mouse drag — Playwright translates these to Pointer Events automatically with hasTouch: true",
            uk: "Встанови test.use({ ...devices['Pixel 7'] }) і використовуй locator.tap() або перетягування миші — Playwright автоматично транслює їх у Pointer Events при hasTouch: true",
          },
        },
        {
          id: "c",
          label: {
            en: "Use page.touchscreen API — it handles both Pointer Events and Touch Events automatically",
            uk: "Використовуй API page.touchscreen — він автоматично обробляє як Pointer Events так і Touch Events",
          },
        },
        {
          id: "d",
          label: {
            en: "Pointer Events can't be tested in Playwright — only Touch Events can be dispatched manually",
            uk: "Pointer Events не можна тестувати в Playwright — лише Touch Events можна диспетчеризувати вручну",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When `hasTouch: true` is set (included in all mobile device profiles), Playwright's mouse and locator APIs automatically fire Pointer Events in touch mode. `locator.tap()` becomes a touch tap, and mouse drags produce the Pointer Event sequence. Manual dispatch with `dispatchEvent` is only needed for legacy Touch Events (`touchstart`, `touchmove`, `touchend`) that the app specifically listens for — not for apps using the modern Pointer Events API.",
        uk: "Коли встановлено `hasTouch: true` (включено у всі профілі мобільних пристроїв) — API миші і локаторів Playwright автоматично генерують Pointer Events у режимі дотику. `locator.tap()` стає тап-дотиком, а перетягування миші виробляє послідовність Pointer Event. Ручна диспетчеризація через `dispatchEvent` потрібна лише для legacy Touch Events (`touchstart`, `touchmove`, `touchend`) які застосунок слухає конкретно — не для застосунків що використовують сучасний API Pointer Events.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "In the pan gesture helper, why does the code call `locator.evaluate(target => target.getBoundingClientRect())` at the start?",
        uk: "У помічнику жесту pan чому код викликає `locator.evaluate(target => target.getBoundingClientRect())` на початку?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "To verify the element is visible before dispatching events",
            uk: "Щоб перевірити що елемент видимий перед диспетчеризацією подій",
          },
        },
        {
          id: "b",
          label: {
            en: "To get the element's pixel position in the viewport so touch coordinates (clientX/clientY) can be computed relative to its center",
            uk: "Щоб отримати позицію елемента в пікселях у viewport щоб координати дотику (clientX/clientY) можна було обчислити відносно його центру",
          },
        },
        {
          id: "c",
          label: {
            en: "To check the element's dimensions before deciding the swipe distance",
            uk: "Щоб перевірити розміри елемента перед визначенням відстані свайпу",
          },
        },
        {
          id: "d",
          label: {
            en: "dispatchEvent requires the target's bounding rect as a required parameter",
            uk: "dispatchEvent вимагає bounding rect цілі як обов'язковий параметр",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Touch event coordinates (`clientX`, `clientY`) are absolute positions in the viewport — not relative to the element. `getBoundingClientRect()` returns the element's position in the viewport, letting you compute `centerX = bounds.left + bounds.width / 2` and `centerY = bounds.top + bounds.height / 2`. Without this, you'd have to hardcode pixel positions that break when the layout changes. The widget needs to know where the touch landed to compute swipe direction and distance.",
        uk: "Координати touch-подій (`clientX`, `clientY`) — абсолютні позиції у viewport, не відносно елемента. `getBoundingClientRect()` повертає позицію елемента у viewport дозволяючи обчислити `centerX = bounds.left + bounds.width / 2` і `centerY = bounds.top + bounds.height / 2`. Без цього доводилося б хардкодити піксельні позиції що ламаються при зміні верстки. Віджету потрібно знати де приземлився дотик щоб обчислити напрямок і відстань свайпу.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "A pinch-in gesture starts with two touch points far apart and moves them toward each other. How many touch points does each touchmove event in a pinch need?",
        uk: "Жест pinch-in починається з двох точок дотику на відстані і зближує їх. Скільки точок дотику потрібно кожній touchmove-події в pinch?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "One — the primary touch point only",
            uk: "Одна — лише основна точка дотику",
          },
        },
        {
          id: "b",
          label: {
            en: "Two — both touch points must be updated simultaneously in each touchmove event",
            uk: "Дві — обидві точки дотику мають оновлюватися одночасно в кожній touchmove-події",
          },
        },
        {
          id: "c",
          label: {
            en: "One per event — alternate which touch point moves in each step",
            uk: "Одна на подію — чергуй яка точка дотику рухається в кожному кроці",
          },
        },
        {
          id: "d",
          label: {
            en: "Three — two fingers and the center contact point",
            uk: "Три — два пальці і центральна точка контакту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A pinch uses two simultaneous touch points — `identifier: 0` and `identifier: 1`. Both must appear in every `touchmove` event's `touches`, `changedTouches`, and `targetTouches` arrays. The pinch effect comes from moving both points on each step: for pinch-in, both move toward the center; for pinch-out, both move away. If only one point moves per event, the browser doesn't recognize it as a two-finger gesture — the event fires but the pinch handler doesn't trigger.",
        uk: "Pinch використовує дві одночасних точки дотику — `identifier: 0` і `identifier: 1`. Обидві мають з'являтися в масивах `touches`, `changedTouches` і `targetTouches` кожної події `touchmove`. Ефект pinch досягається переміщенням обох точок на кожному кроці: для pinch-in обидві рухаються до центру; для pinch-out обидві рухаються від центру. Якщо на кожну подію рухається лише одна точка — браузер не розпізнає це як жест двома пальцями, подія спрацьовує але обробник pinch не запускається.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "After dispatching touch events via dispatchEvent, why might the gesture work in a real mobile browser but fail in your test, even though events are firing?",
        uk: "Після диспетчеризації touch-подій через dispatchEvent чому жест може працювати в реальному мобільному браузері але провалюватися в тесті, навіть якщо події спрацьовують?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Playwright runs tests too fast — add artificial delays between touch events",
            uk: "Playwright виконує тести надто швидко — додай штучні затримки між touch-подіями",
          },
        },
        {
          id: "b",
          label: {
            en: "dispatchEvent sets Event.isTrusted to false — if the app checks isTrusted to detect automation, it will ignore the touch events",
            uk: "dispatchEvent встановлює Event.isTrusted в false — якщо застосунок перевіряє isTrusted для виявлення автоматизації — він ігноруватиме touch-події",
          },
        },
        {
          id: "c",
          label: {
            en: "Playwright doesn't support multi-step touch sequences on non-mobile browsers",
            uk: "Playwright не підтримує багатокрокові touch-послідовності на немобільних браузерах",
          },
        },
        {
          id: "d",
          label: {
            en: "The touch events need to be dispatched on the document, not on specific elements",
            uk: "Touch-події потрібно диспетчеризувати на документі, а не на конкретних елементах",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`Event.isTrusted` is `true` for events generated by real user interaction and `false` for programmatically dispatched events. Some apps check this property to prevent bots or automation from triggering gestures. When you use `dispatchEvent`, `isTrusted` is always `false` — the spec prevents scripts from spoofing trusted events. The fix: disable the `isTrusted` check during test mode, or use a feature flag to bypass gesture authentication. This is a legitimate automation defense that can't be worked around at the Playwright level.",
        uk: "`Event.isTrusted` має значення `true` для подій згенерованих реальною взаємодією користувача і `false` для програмно диспетчеризованих подій. Деякі застосунки перевіряють цю властивість щоб запобігти запуску жестів ботами або автоматизацією. При використанні `dispatchEvent` — `isTrusted` завжди `false`, специфікація забороняє скриптам підробляти довірені події. Виправлення: вимкни перевірку `isTrusted` в тестовому режимі, або використай feature flag щоб обійти автентифікацію жестів. Це легітимний захист від автоматизації що не можна обійти на рівні Playwright.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "For the touchend event at the end of a pan gesture, what should the `touches` list contain?",
        uk: "Для події touchend в кінці жесту pan що має містити список `touches`?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The final position of the touch point",
            uk: "Фінальна позиція точки дотику",
          },
        },
        {
          id: "b",
          label: {
            en: "An empty array — touches lists all currently active touches, and after touchend there are none",
            uk: "Порожній масив — touches перераховує всі поточні активні дотики а після touchend їх немає",
          },
        },
        {
          id: "c",
          label: {
            en: "The same touch point as touchstart for reference",
            uk: "Та сама точка дотику що в touchstart для довідки",
          },
        },
        {
          id: "d",
          label: {
            en: "touchend doesn't need a touches property at all",
            uk: "touchend взагалі не потребує властивості touches",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `touches` list in a touch event represents currently active touch points. When a finger lifts (`touchend`), that touch is no longer active — so `touches` must be an empty array. The `changedTouches` list should contain the touch point that just ended (with its last known position). Many implementations omit this distinction and pass empty arrays for all three lists in `touchend`, which works for most gesture handlers that only care about the `touchend` event firing, not where the finger lifted.",
        uk: "Список `touches` у touch-події представляє поточні активні точки дотику. Коли палець піднімається (`touchend`) — цей дотик більше не активний, тому `touches` має бути порожнім масивом. Список `changedTouches` має містити точку дотику що щойно завершилась (з останньою відомою позицією). Багато реалізацій пропускають це розрізнення і передають порожні масиви для всіх трьох списків у `touchend`, що працює для більшості обробників жестів які турбуються лише про те що подія `touchend` спрацювала, а не де підняли палець.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "When should you use locator.tap() instead of manually dispatching touch events?",
        uk: "Коли слід використовувати locator.tap() замість ручної диспетчеризації touch-подій?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Always — locator.tap() is more reliable than dispatchEvent for all touch scenarios",
            uk: "Завжди — locator.tap() надійніший за dispatchEvent для всіх touch-сценаріїв",
          },
        },
        {
          id: "b",
          label: {
            en: "When the app uses Pointer Events or standard click handlers — tap() sends a real tap through the browser's pointer dispatch, not a synthetic touch event",
            uk: "Коли застосунок використовує Pointer Events або стандартні обробники click — tap() надсилає реальний тап через диспетчер pointer браузера, а не синтетичну touch-подію",
          },
        },
        {
          id: "c",
          label: {
            en: "Only for button clicks — use dispatchEvent for all other interactions",
            uk: "Лише для кліків по кнопках — використовуй dispatchEvent для всіх інших взаємодій",
          },
        },
        {
          id: "d",
          label: {
            en: "tap() and dispatchEvent are equivalent — choose based on personal preference",
            uk: "tap() і dispatchEvent еквівалентні — вибирай за особистими уподобаннями",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`locator.tap()` is the right choice for any element that responds to clicks, pointer events, or taps — which covers most modern UIs. It sends a real pointer/touch input through the browser's input dispatch mechanism, respecting actionability checks (element must be visible, enabled, and in viewport). Manual `dispatchEvent` is specifically for legacy Touch Event APIs where the app explicitly listens for `touchstart`/`touchmove`/`touchend`. If in doubt, try `tap()` first — it handles more cases with less code.",
        uk: "`locator.tap()` — правильний вибір для будь-якого елемента що реагує на кліки, pointer-події або taps, що охоплює більшість сучасних UI. Він надсилає реальний pointer/touch-ввід через механізм диспетчеризації вводу браузера дотримуючись перевірок actionability (елемент має бути видимим, увімкненим і у viewport). Ручний `dispatchEvent` призначений конкретно для legacy Touch Event API де застосунок явно слухає `touchstart`/`touchmove`/`touchend`. Якщо не певен — спробуй спочатку `tap()`: він обробляє більше випадків з меншим кодом.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You need to simulate a swipe that starts at the center of a map element and moves 200px to the right. How do you compute the starting clientX coordinate?",
        uk: "Потрібно симулювати свайп що починається в центрі елемента карти і рухається на 200px праворуч. Як обчислити початкову координату clientX?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use 200 as clientX — coordinates are relative to the element's top-left corner",
            uk: "Використовуй 200 як clientX — координати відносні до лівого верхнього кута елемента",
          },
        },
        {
          id: "b",
          label: {
            en: "Get the element's bounding rect via locator.evaluate(el => el.getBoundingClientRect()), then compute bounds.left + bounds.width / 2",
            uk: "Отримай bounding rect елемента через locator.evaluate(el => el.getBoundingClientRect()), потім обчисли bounds.left + bounds.width / 2",
          },
        },
        {
          id: "c",
          label: {
            en: "Use page.mouse.move() to get the current cursor position as a reference point",
            uk: "Використовуй page.mouse.move() щоб отримати поточну позицію курсору як точку відліку",
          },
        },
        {
          id: "d",
          label: {
            en: "Use locator.boundingBox() and divide the returned x and width by 2",
            uk: "Використовуй locator.boundingBox() і ділить повернуті x і width на 2",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Touch event coordinates use the viewport's coordinate system (not element-relative). `getBoundingClientRect()` returns `{ left, top, right, bottom, width, height }` in viewport coordinates. The center is `left + width / 2`. In Playwright, this requires `locator.evaluate(el => el.getBoundingClientRect())` since the DOM API is browser-side. Note: `locator.boundingBox()` from option D also works and is actually the Playwright-native equivalent — it returns the same data without needing `evaluate`. Both approaches are valid.",
        uk: "Координати touch-подій використовують систему координат viewport (не відносно елемента). `getBoundingClientRect()` повертає `{ left, top, right, bottom, width, height }` у координатах viewport. Центр — `left + width / 2`. У Playwright це вимагає `locator.evaluate(el => el.getBoundingClientRect())` оскільки DOM API знаходиться на стороні браузера. Зауваж: `locator.boundingBox()` з варіанту D також працює і фактично є Playwright-нативним еквівалентом — повертає ті ж дані без потреби в `evaluate`. Обидва підходи дійсні.",
      },
    },
  ],
}
