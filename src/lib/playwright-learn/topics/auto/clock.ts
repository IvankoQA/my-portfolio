import type { PlaywrightTopic } from "../../types"

export const clockTopic: PlaywrightTopic = {
  slug: "clock",
  groupId: "guides",
  order: 150,
  level: "advanced",
  trackOrder: 18,
  sourceDoc: "clock.md",
  officialDocsUrl: "https://playwright.dev/docs/clock",
  title: {
    en: "Clock",
    uk: "Годинник",
  },
  summary: {
    en: "\"Auto-logout after 30 minutes of inactivity\" — how do you test that without actually waiting 30 minutes? You fake the clock. Playwright can freeze, fast-forward, or manually tick browser time.",
    uk: "\"Автологаут через 30 хвилин неактивності\" — як тестувати це не чекаючи реальних 30 хвилин? Підробити годинник. Playwright може заморозити, перемотати або вручну просунути час браузера.",
  },
  sections: [
    {
      id: "why-fake-the-clock",
      title: {
        en: "What the clock API controls",
        uk: "Що контролює Clock API",
      },
      paragraphs: [
        {
          en: "Playwright's `page.clock` replaces the browser's time functions: `Date`, `Date.now()`, `setTimeout`, `setInterval`, `requestAnimationFrame`. When you control the clock, timers don't fire in real time — they fire when you tell them to. This makes time-dependent tests instant.",
          uk: "Playwright's `page.clock` підміняє браузерні функції часу: `Date`, `Date.now()`, `setTimeout`, `setInterval`, `requestAnimationFrame`. Коли ти контролюєш годинник — таймери спрацьовують не в реальному часі, а тоді коли ти кажеш. Це робить тести що залежать від часу — миттєвими.",
        },
        {
          en: "Three modes: `setFixedTime` (simplest — freeze Date.now to a specific timestamp), `install` with `fastForward` or `pauseAt` (for more complex scenarios), and `runFor` (manually tick milliseconds).",
          uk: "Три режими: `setFixedTime` (найпростіше — заморозити Date.now на конкретній мітці), `install` з `fastForward` або `pauseAt` (для складніших сценаріїв), і `runFor` (вручну просунути мілісекунди).",
        },
      ],
    },
    {
      id: "set-fixed-time",
      title: {
        en: "setFixedTime — freeze the date",
        uk: "setFixedTime — заморозити дату",
      },
      paragraphs: [
        {
          en: "The simplest case: you need `Date.now()` to return a specific value so that dates display consistently in tests. If your order list shows \"Created 2 days ago\" and the text depends on the current date — tests become flaky because \"2 days ago\" changes every day. Fix: freeze the clock before loading the page.",
          uk: "Найпростіший кейс: потрібно щоб `Date.now()` повертав конкретне значення і дати відображалися стабільно в тестах. Якщо список замовлень показує \"Створено 2 дні тому\" і текст залежить від поточної дати — тести стають flaky бо \"2 дні тому\" змінюється щодня. Виправлення: заморозити годинник перед завантаженням сторінки.",
        },
      ],
      codeBlocks: [
        {
          id: "set-fixed-time",
          language: "ts",
          code: `test('order shows correct relative date', async ({ page }) => {
  // Фіксуємо час ПЕРЕД завантаженням сторінки
  await page.clock.setFixedTime(new Date('2026-05-14T12:00:00'))

  await page.goto('/orders')

  // Замовлення створене 2026-05-12 завжди показуватиме "2 days ago"
  await expect(page.getByTestId('order-date').first()).toContainText('2 days ago')
})

test('session expiry shows correct countdown', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-05-14T09:00:00'))
  await page.goto('/dashboard')

  // Сесія закінчується о 17:00 — показує "8 hours remaining"
  await expect(page.getByTestId('session-expiry')).toContainText('8 hours remaining')
})`,
        },
      ],
    },
    {
      id: "fast-forward",
      title: {
        en: "fastForward — skip through time",
        uk: "fastForward — перемотати час",
      },
      paragraphs: [
        {
          en: "For features like auto-logout, session expiry, or debounced search — where something should happen after a time delay — `fastForward` fires all pending timers instantly. It's like closing the laptop lid and opening it N minutes later.",
          uk: "Для фіч як автологаут, закінчення сесії або debounced пошук — де щось має статися після затримки — `fastForward` миттєво спрацьовує всі відкладені таймери. Це як закрити кришку ноутбука і відкрити її через N хвилин.",
        },
      ],
      codeBlocks: [
        {
          id: "fast-forward",
          language: "ts",
          code: `test('auto-logout after 30 minutes inactivity', async ({ page }) => {
  await page.clock.install()
  await page.goto('/dashboard')

  // Перевіряємо що залогінені
  await expect(page.getByTestId('user-menu')).toBeVisible()

  // Перемотуємо 30 хвилин — жодного реального очікування
  await page.clock.fastForward('30:00')

  // Застосунок має перенаправити на логін
  await expect(page).toHaveURL('/login')
  await expect(page.getByText('Session expired')).toBeVisible()
})

test('debounced search fires after 500ms', async ({ page }) => {
  await page.clock.install()
  await page.goto('/orders')

  await page.getByRole('searchbox', { name: 'Search orders' }).fill('laptop')

  // Без перемотки — запит ще не відправлений (debounce 500ms)
  // Перемотуємо 500ms
  await page.clock.fastForward(500)

  // Тепер запит має відправитися
  await expect(page.getByRole('row')).toHaveCount(3)
})`,
        },
      ],
    },
    {
      id: "pause-at",
      title: {
        en: "pauseAt — stop at a specific moment",
        uk: "pauseAt — зупинити в конкретний момент",
      },
      paragraphs: [
        {
          en: "`pauseAt` lets you install the clock, let the page load naturally (with timers firing), and then freeze time at a specific timestamp. Useful when you need to test a specific point in time — like what happens at exactly midnight, or at a deadline.",
          uk: "`pauseAt` дозволяє встановити годинник, дати сторінці завантажитися природно (з таймерами що спрацьовують), а потім заморозити час на конкретній мітці. Корисно коли треба перевірити конкретний момент — що відбувається рівно опівночі або при дедлайні.",
        },
      ],
      codeBlocks: [
        {
          id: "pause-at",
          language: "ts",
          code: `test('countdown shows zero at deadline', async ({ page }) => {
  // Починаємо задовго до дедлайну
  await page.clock.install({ time: new Date('2026-05-14T08:00:00') })
  await page.goto('/orders/42')

  // Перевіряємо початковий countdown
  await expect(page.getByTestId('delivery-countdown')).toContainText('9 hours remaining')

  // Переходимо до моменту дедлайну
  await page.clock.pauseAt(new Date('2026-05-14T17:00:00'))
  await expect(page.getByTestId('delivery-countdown')).toContainText('Deadline passed')
})`,
        },
      ],
    },
    {
      id: "run-for",
      title: {
        en: "runFor — tick manually",
        uk: "runFor — ручне тікання",
      },
      paragraphs: [
        {
          en: "`runFor` ticks time by an exact number of milliseconds, firing each timer that falls within that window in order. Unlike `fastForward` (which jumps), `runFor` steps through — useful when you need to verify intermediate states between timer firings.",
          uk: "`runFor` просуває час на точну кількість мілісекунд, послідовно спрацьовуючи кожен таймер що потрапляє у це вікно. На відміну від `fastForward` (що стрибає), `runFor` крокує — корисно коли треба перевірити проміжні стани між спрацюваннями таймерів.",
        },
      ],
      codeBlocks: [
        {
          id: "run-for",
          language: "ts",
          code: `test('progress bar updates every second', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-05-14T10:00:00') })
  await page.clock.pauseAt(new Date('2026-05-14T10:00:00'))

  await page.goto('/import-job/123')
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

  // Tick 1 секунду — перший апдейт прогресу
  await page.clock.runFor(1000)
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '10')

  // Ще 4 секунди
  await page.clock.runFor(4000)
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You need to test that a countdown timer shows '0 seconds' exactly at the deadline. Which approach is correct?",
        uk: "Треба перевірити що таймер зворотного відліку показує '0 секунд' рівно в момент дедлайну. Який підхід правильний?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use await page.waitForTimeout(deadline - Date.now()) to wait for the real deadline",
            uk: "Використати await page.waitForTimeout(deadline - Date.now()) щоб дочекатися реального дедлайну",
          },
        },
        {
          id: "b",
          label: {
            en: "Install the clock, then call page.clock.pauseAt(deadlineDate) to jump to that moment",
            uk: "Встановити годинник, потім викликати page.clock.pauseAt(deadlineDate) щоб перейти до того моменту",
          },
        },
        {
          id: "c",
          label: {
            en: "Mock Date.now() with page.evaluate() to return the deadline timestamp",
            uk: "Підмінити Date.now() через page.evaluate() щоб повертати мітку дедлайну",
          },
        },
        {
          id: "d",
          label: {
            en: "Use page.clock.fastForward() to skip time from the test start to the deadline",
            uk: "Використати page.clock.fastForward() щоб перемотати час від початку тесту до дедлайну",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.clock.pauseAt()` jumps the browser clock to exactly that moment, firing all timers that would have fired in between. The test runs in milliseconds instead of waiting for real time. `waitForTimeout` wastes real time. `page.evaluate` only replaces `Date.now` for one call, not for running timers.",
        uk: "`page.clock.pauseAt()` переміщує годинник браузера рівно до того моменту, спрацьовуючи всі таймери що мали б спрацювати між ними. Тест виконується за мілісекунди замість очікування реального часу. `waitForTimeout` витрачає реальний час. `page.evaluate` підміняє `Date.now` лише для одного виклику, але не для запущених таймерів.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Which browser APIs does page.clock control when installed?",
        uk: "Які браузерні API контролює page.clock після встановлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Only Date and Date.now()",
            uk: "Тільки Date і Date.now()",
          },
        },
        {
          id: "b",
          label: {
            en: "Date, Date.now(), setTimeout, setInterval, and requestAnimationFrame",
            uk: "Date, Date.now(), setTimeout, setInterval і requestAnimationFrame",
          },
        },
        {
          id: "c",
          label: {
            en: "setTimeout and setInterval only — Date is not affected",
            uk: "Тільки setTimeout і setInterval — Date не зачіпається",
          },
        },
        {
          id: "d",
          label: {
            en: "Only network-related timing APIs like fetch and XMLHttpRequest",
            uk: "Тільки мережеві timing API як fetch і XMLHttpRequest",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's `page.clock` replaces all time-related browser functions: `Date`, `Date.now()`, `setTimeout`, `setInterval`, and `requestAnimationFrame`. This complete replacement means that any UI code relying on any of these — whether it reads the current date, sets a timeout for auto-logout, or uses rAF for animation — is fully under test control.",
        uk: "Playwright `page.clock` підміняє всі браузерні функції пов'язані з часом: `Date`, `Date.now()`, `setTimeout`, `setInterval` і `requestAnimationFrame`. Це повне заміщення означає що будь-який UI код що покладається на будь-яку з цих функцій — чи то читає поточну дату, встановлює таймер для автологауту, або використовує rAF для анімації — повністю під контролем тесту.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Your app shows 'Created 2 days ago' for orders. The test passes today but will fail tomorrow because the date changes. What is the correct fix?",
        uk: "Застосунок показує 'Створено 2 дні тому' для замовлень. Тест проходить сьогодні але завтра впаде бо дата змінюється. Яке правильне виправлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use a regex assertion like /\\d+ days? ago/ to avoid hardcoding the day count",
            uk: "Використати regex assertion як /\\d+ days? ago/ щоб не хардкодити кількість днів",
          },
        },
        {
          id: "b",
          label: {
            en: "Call await page.clock.setFixedTime(new Date('2026-05-14T12:00:00')) before loading the page to freeze Date.now()",
            uk: "Викликати await page.clock.setFixedTime(new Date('2026-05-14T12:00:00')) перед завантаженням сторінки щоб заморозити Date.now()",
          },
        },
        {
          id: "c",
          label: {
            en: "Run the test at a fixed time of day using a cron job",
            uk: "Запускати тест у фіксований час доби через cron job",
          },
        },
        {
          id: "d",
          label: {
            en: "Set the order creation date to always be 2 days before today in the test database",
            uk: "Встановити дату створення замовлення завжди за 2 дні до сьогодні в тестовій базі даних",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`setFixedTime` freezes `Date.now()` to a specific timestamp before the page loads. With the clock frozen, the relative date calculation ('2 days ago') always returns the same result regardless of when the test actually runs. This is the simplest clock API — unlike `install()`, it doesn't affect timers, only the current date value.",
        uk: "`setFixedTime` заморожує `Date.now()` на конкретній мітці часу до завантаження сторінки. З замороженим годинником обчислення відносної дати ('2 дні тому') завжди повертає однаковий результат незалежно від того коли тест реально виконується. Це найпростіший Clock API — на відміну від `install()`, він не впливає на таймери, тільки на поточне значення дати.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What is the difference between page.clock.fastForward() and page.clock.runFor()?",
        uk: "У чому різниця між page.clock.fastForward() і page.clock.runFor()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "fastForward() works in seconds; runFor() works in milliseconds",
            uk: "fastForward() працює в секундах; runFor() в мілісекундах",
          },
        },
        {
          id: "b",
          label: {
            en: "fastForward() jumps to the end of the time window, firing all timers; runFor() steps through time incrementally, letting you observe intermediate states",
            uk: "fastForward() стрибає до кінця часового вікна, спрацьовуючи всі таймери; runFor() крокує через час поступово, дозволяючи спостерігати проміжні стани",
          },
        },
        {
          id: "c",
          label: {
            en: "runFor() fires real-time timers; fastForward() fires fake timers",
            uk: "runFor() спрацьовує таймери в реальному часі; fastForward() — фейкові",
          },
        },
        {
          id: "d",
          label: {
            en: "They are identical — both advance the clock by the given number of milliseconds",
            uk: "Вони ідентичні — обидва просувають годинник на задану кількість мілісекунд",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`fastForward` is for 'get to the end' scenarios like auto-logout — you jump past the delay and check the final state. `runFor` is for step-by-step scenarios where you need to verify intermediate states — like checking a progress bar at 10%, then 50%, then 100%. `runFor(1000)` ticks 1 second and fires any timers that fall within that window, in order.",
        uk: "`fastForward` для сценаріїв 'дістатися кінця' як автологаут — стрибаєш через затримку і перевіряєш фінальний стан. `runFor` для покрокових сценаріїв де потрібно перевіряти проміжні стани — як перевірити progress bar на 10%, потім 50%, потім 100%. `runFor(1000)` просуває 1 секунду і спрацьовує всі таймери що потрапляють у це вікно, по порядку.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You need to test a debounced search that fires an API request 500ms after the user stops typing. Which clock approach is correct?",
        uk: "Треба перевірити debounced пошук що надсилає API-запит через 500ms після того як користувач перестає друкувати. Який підхід з годинником правильний?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.waitForTimeout(500) — wait for the real debounce to elapse",
            uk: "await page.waitForTimeout(500) — чекати поки реальний debounce не спливе",
          },
        },
        {
          id: "b",
          label: {
            en: "Install the clock, fill the search input, then call await page.clock.fastForward(500) to trigger the debounce",
            uk: "Встановити годинник, заповнити поле пошуку, потім викликати await page.clock.fastForward(500) щоб запустити debounce",
          },
        },
        {
          id: "c",
          label: {
            en: "Use page.clock.setFixedTime() to set the time 500ms ahead before filling the input",
            uk: "Використати page.clock.setFixedTime() щоб встановити час на 500ms вперед до заповнення поля",
          },
        },
        {
          id: "d",
          label: {
            en: "Debounced functions can't be tested with Playwright's clock API",
            uk: "Debounced функції не можна тестувати через Clock API Playwright",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The pattern for testing debounced behavior: (1) install the fake clock with `page.clock.install()`, (2) trigger the user action (fill the input), (3) advance the clock past the debounce window with `page.clock.fastForward(500)` — this fires the pending setTimeout without waiting in real time, (4) assert the API was called and results appeared. `waitForTimeout(500)` would work but wastes 500ms of real CI time per test.",
        uk: "Патерн для тестування debounced поведінки: (1) встановити фейковий годинник через `page.clock.install()`, (2) запустити дію користувача (заповнити поле), (3) просунути годинник повз вікно debounce через `page.clock.fastForward(500)` — це спрацьовує відкладений setTimeout без очікування реального часу, (4) перевірити що API викликано і результати з'явилися. `waitForTimeout(500)` спрацює але витрачає 500ms реального CI-часу на тест.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "You must call page.clock.install() before navigating to the page. Why does the order matter?",
        uk: "Потрібно викликати page.clock.install() до навігації на сторінку. Чому порядок важливий?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "install() can only be called on a blank about:blank page",
            uk: "install() можна викликати тільки на порожній about:blank сторінці",
          },
        },
        {
          id: "b",
          label: {
            en: "If the page loads before the clock is installed, timers started during page initialization will fire with the real clock and the fake clock won't control them",
            uk: "Якщо сторінка завантажується до встановлення годинника — таймери запущені під час ініціалізації сторінки спрацьовують з реальним годинником і фейковий годинник не контролюватиме їх",
          },
        },
        {
          id: "c",
          label: {
            en: "Navigating first causes install() to throw a 'clock already running' error",
            uk: "Навігація першою спричиняє помилку install() 'clock already running'",
          },
        },
        {
          id: "d",
          label: {
            en: "The order doesn't matter — install() replaces the clock retroactively",
            uk: "Порядок не важливий — install() замінює годинник ретроактивно",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The clock must be installed before `page.goto()` because page initialization can set up timers (setTimeout, setInterval) and read Date.now() during load. If those execute with the real clock before `install()` is called, the fake clock won't have control over them. Installing first ensures every timer registered from the moment of page load is under the fake clock's control.",
        uk: "Годинник повинен бути встановлений до `page.goto()` бо ініціалізація сторінки може налаштовувати таймери (setTimeout, setInterval) і читати Date.now() під час завантаження. Якщо вони виконуються з реальним годинником до виклику `install()` — фейковий годинник не матиме контролю над ними. Встановлення першим гарантує що кожен таймер зареєстрований з моменту завантаження сторінки перебуває під контролем фейкового годинника.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What does page.clock.install({ time: new Date('2026-05-14T08:00:00') }) do compared to page.clock.setFixedTime()?",
        uk: "Що робить page.clock.install({ time: new Date('2026-05-14T08:00:00') }) порівняно з page.clock.setFixedTime()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They are equivalent — both freeze the clock at the given time permanently",
            uk: "Вони еквівалентні — обидва заморожують годинник на заданому часі назавжди",
          },
        },
        {
          id: "b",
          label: {
            en: "install() with a time sets the starting point and enables timer control (fastForward, runFor, pauseAt); setFixedTime() only freezes Date.now() without enabling timer manipulation",
            uk: "install() з часом встановлює початкову точку і вмикає контроль таймерів (fastForward, runFor, pauseAt); setFixedTime() лише заморожує Date.now() не вмикаючи маніпуляцію таймерами",
          },
        },
        {
          id: "c",
          label: {
            en: "install() affects only setTimeout; setFixedTime() affects only Date.now()",
            uk: "install() впливає лише на setTimeout; setFixedTime() лише на Date.now()",
          },
        },
        {
          id: "d",
          label: {
            en: "setFixedTime() requires calling install() first before it has any effect",
            uk: "setFixedTime() вимагає спочатку викликати install() перш ніж матиме ефект",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`setFixedTime` is the simplest mode — it just freezes what `Date.now()` returns. It doesn't install a full fake clock, so `fastForward`, `runFor`, and `pauseAt` won't work after it. `install({ time })` installs the complete fake clock starting at the given timestamp, enabling all the timer manipulation methods. Use `setFixedTime` for simple date-display tests, and `install` for any test involving timer-based behavior.",
        uk: "`setFixedTime` — найпростіший режим: просто заморожує що повертає `Date.now()`. Він не встановлює повний фейковий годинник, тому `fastForward`, `runFor` і `pauseAt` не працюватимуть після нього. `install({ time })` встановлює повний фейковий годинник починаючи з заданої мітки часу, вмикаючи всі методи маніпуляції таймерами. Використовуй `setFixedTime` для простих тестів відображення дат, і `install` для будь-якого тесту що включає timer-based поведінку.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You're testing a progress bar that updates every second via setInterval. You want to verify the bar is at 50% after 5 seconds. Which call correctly advances the clock by 5 seconds?",
        uk: "Тестуєш progress bar що оновлюється кожну секунду через setInterval. Хочеш перевірити що bar на 50% після 5 секунд. Який виклик правильно просуває годинник на 5 секунд?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.clock.fastForward('5:00') — the '5:00' string means 5 minutes",
            uk: "await page.clock.fastForward('5:00') — рядок '5:00' означає 5 хвилин",
          },
        },
        {
          id: "b",
          label: {
            en: "await page.clock.runFor(5000) — advances 5000 milliseconds, firing each setInterval tick in order",
            uk: "await page.clock.runFor(5000) — просуває 5000 мілісекунд, спрацьовуючи кожен тік setInterval по порядку",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.clock.tick(5) — the argument is in seconds",
            uk: "await page.clock.tick(5) — аргумент у секундах",
          },
        },
        {
          id: "d",
          label: {
            en: "await page.clock.pauseAt(startTime + 5000) — pauseAt accepts a millisecond offset",
            uk: "await page.clock.pauseAt(startTime + 5000) — pauseAt приймає зміщення в мілісекундах",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`runFor(5000)` advances the fake clock by exactly 5000 milliseconds and fires all timers that fall within that window in chronological order — so a setInterval at 1000ms fires five times. The argument is always in milliseconds. `fastForward('5:00')` would advance 5 minutes (not seconds) — the string format is mm:ss. `pauseAt` takes an absolute timestamp (a Date or ISO string), not a relative offset.",
        uk: "`runFor(5000)` просуває фейковий годинник рівно на 5000 мілісекунд і спрацьовує всі таймери що потрапляють у це вікно в хронологічному порядку — тому setInterval на 1000ms спрацьовує п'ять разів. Аргумент завжди в мілісекундах. `fastForward('5:00')` просунув би 5 хвилин (не секунд) — формат рядка mm:ss. `pauseAt` приймає абсолютну мітку часу (Date або ISO рядок), а не відносне зміщення.",
      },
    },
  ],
}
