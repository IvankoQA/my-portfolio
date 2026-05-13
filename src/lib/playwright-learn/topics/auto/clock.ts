import type { PlaywrightTopic } from "../../types"

export const clockTopic: PlaywrightTopic = {
  slug: "clock",
  groupId: "guides",
  order: 150,
  sourceDoc: "clock.md",
  officialDocsUrl: "https://playwright.dev/docs/clock",
  title: {
    en: "Clock",
    uk: "Годинник",
  },
  summary: {
    en: "Accurately simulating time-dependent behavior is essential for verifying the correctness of applications. Utilizing [Clock] functionality allows developers to manipulate and control time within tests, enabling the precise validation of features such as rendering time, timeouts, scheduled tasks without the delays and variability of real-time execution.",
    uk: "Точна емуляція поведінки, що залежить від часу, важлива для перевірки коректності застосунків. API [Clock] дає змогу керувати часом у тестах і перевіряти рендеринг, таймаути, заплановані задачі без затримок і випадковостей реального часу.",
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
          en: "Accurately simulating time-dependent behavior is essential for verifying the correctness of applications. Utilizing [Clock] functionality allows developers to manipulate and control time within tests, enabling the precise validation of features such as rendering time, timeouts, scheduled tasks without the delays and variability of real-time execution.",
          uk: "Точна емуляція поведінки, що залежить від часу, важлива для перевірки коректності застосунків. API [Clock] дає змогу керувати часом у тестах і перевіряти рендеринг, таймаути, заплановані задачі без затримок і випадковостей реального часу.",
        },
        {
          en: "The [Clock] API provides the following methods to control time:\n- `setFixedTime`: Sets the fixed time for `Date.now()` and `new Date()`.\n- `install`: initializes the clock and allows you to:\n  - `pauseAt`: Pauses the time at a specific time.\n  - `fastForward`: Fast forwards the time.\n  - `runFor`: Runs the time for a specific duration.\n  - `resume`: Resumes the time.\n- `setSystemTime`: Sets the current system time.",
          uk: "API [Clock] надає такі методи керування часом:\n- `setFixedTime` — фіксує час для `Date.now()` і `new Date()`.\n- `install` — ініціалізує годинник і дозволяє:\n  - `pauseAt` — зупинити час у заданий момент;\n  - `fastForward` — перемотати час уперед;\n  - `runFor` — прогнати час на задану тривалість;\n  - `resume` — відновити хід часу.\n- `setSystemTime` — встановити поточний системний час.",
        },
        {
          en: "The recommended approach is to use `setFixedTime` to set the time to a specific value. If that doesn't work for your use case, you can use `install` which allows you to pause time later on, fast forward it, tick it, etc. `setSystemTime` is only recommended for advanced use cases.",
          uk: "Рекомендовано спочатку використовувати `setFixedTime` для встановлення конкретного часу. Якщо це не підходить, застосуйте `install` — можна зупиняти час, перемотувати, «тикати» тощо. `setSystemTime` варто лишати для складних сценаріїв.",
        },
      ],
    },
    {
      id: "test-with-predefined-time",
      title: {
        en: "Test with predefined time",
        uk: "Тест із наперед заданим часом",
      },
      paragraphs: [
        {
          en: "Often you only need to fake `Date.now` while keeping the timers going.\nThat way the time flows naturally, but `Date.now` always returns a fixed value.",
          uk: "Часто достатньо підмінити лише `Date.now`, залишивши таймери активними: час «тече» природно, але `Date.now` завжди повертає одне й те саме значення.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "html",
          code: "\n  const renderTime = () => {\n    document.getElementById('current-time').textContent =\n        new Date().toLocaleString();\n  };\n  setInterval(renderTime, 1000);",
        },
        {
          id: "cb-2",
          language: "js",
          code: "await page.clock.setFixedTime(new Date('2024-02-02T10:00:00'));\nawait page.goto('http://localhost:3333');\nawait expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');\n\nawait page.clock.setFixedTime(new Date('2024-02-02T10:30:00'));\n// We know that the page has a timer that updates the time every second.\nawait expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');",
        },
      ],
    },
    {
      id: "consistent-time-and-timers",
      title: {
        en: "Consistent time and timers",
        uk: "Узгоджений час і таймери",
      },
      paragraphs: [
        {
          en: "Sometimes your timers depend on `Date.now` and are confused when the `Date.now` value does not change over time.\nIn this case, you can install the clock and fast forward to the time of interest when testing.",
          uk: "Іноді таймери залежать від `Date.now` і «плутаються», якщо `Date.now` не змінюється з часом. Тоді варто встановити годинник (`install`) і перемотати до потрібного моменту під час тесту.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-7",
          language: "html",
          code: "\n  const renderTime = () => {\n    document.getElementById('current-time').textContent =\n        new Date().toLocaleString();\n  };\n  setInterval(renderTime, 1000);",
        },
        {
          id: "cb-8",
          language: "js",
          code: "// Initialize clock with some time before the test time and let the page load\n// naturally. `Date.now` will progress as the timers fire.\nawait page.clock.install({ time: new Date('2024-02-02T08:00:00') });\nawait page.goto('http://localhost:3333');\n\n// Pretend that the user closed the laptop lid and opened it again at 10am,\n// Pause the time once reached that point.\nawait page.clock.pauseAt(new Date('2024-02-02T10:00:00'));\n\n// Assert the page state.\nawait expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');\n\n// Close the laptop lid again and open it at 10:30am.\nawait page.clock.fastForward('30:00');\nawait expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:30:00 AM');",
        },
      ],
    },
    {
      id: "test-inactivity-monitoring",
      title: {
        en: "Test inactivity monitoring",
        uk: "Тестування моніторингу неактивності",
      },
      paragraphs: [
        {
          en: "Inactivity monitoring is a common feature in web applications that logs out users after a period of inactivity.\nTesting this feature can be tricky because you need to wait for a long time to see the effect.\nWith the help of the clock, you can speed up time and test this feature quickly.",
          uk: "Моніторинг неактивності — типова функція вебзастосунків: користувача виводить із сесії після простою.\nПеревірити це важко, бо доводиться довго чекати.\nЗа допомогою годинника можна прискорити час і швидко перевірити сценарій.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-13",
          language: "html",
          code: "\n  const endTime = Date.now() + 5 * 60_000;\n  const renderTime = () => {\n    const diffInSeconds = Math.round((endTime - Date.now()) / 1000);\n    if (diffInSeconds <= 0) {\n      document.getElementById('remaining-time').textContent =\n        'You have been logged out due to inactivity.';\n    } else {\n      document.getElementById('remaining-time').textContent =\n        `You will be logged out in ${diffInSeconds} seconds.`;\n    }\n    setTimeout(renderTime, 1000);\n  };\n  renderTime();\n\nInteraction",
        },
        {
          id: "cb-14",
          language: "js",
          code: "// Initial time does not matter for the test, so we can pick current time.\nawait page.clock.install();\nawait page.goto('http://localhost:3333');\n// Interact with the page\nawait page.getByRole('button').click();\n\n// Fast forward time 5 minutes as if the user did not do anything.\n// Fast forward is like closing the laptop lid and opening it after 5 minutes.\n// All the timers due will fire once immediately, as in the real browser.\nawait page.clock.fastForward('05:00');\n\n// Check that the user was logged out automatically.\nawait expect(page.getByText('You have been logged out due to inactivity.')).toBeVisible();",
        },
      ],
    },
    {
      id: "tick-through-time-manually-firing-all-the-timers-consistently",
      title: {
        en: "Tick through time manually, firing all the timers consistently",
        uk: "Ручне «тікання» часу з послідовним спрацюванням таймерів",
      },
      paragraphs: [
        {
          en: "In rare cases, you may want to tick through time manually, firing all timers and\nanimation frames in the process to achieve a fine-grained control over the passage of time.",
          uk: "Рідко потрібно вручну проганяти час, послідовно викликаючи всі таймери та кадри анімації — для дрібнозернистого контролю плину часу.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-19",
          language: "html",
          code: "\n  const renderTime = () => {\n    document.getElementById('current-time').textContent =\n        new Date().toLocaleString();\n  };\n  setInterval(renderTime, 1000);",
        },
        {
          id: "cb-20",
          language: "js",
          code: "// Initialize clock with a specific time, let the page load naturally.\nawait page.clock.install({ time: new Date('2024-02-02T08:00:00') });\nawait page.goto('http://localhost:3333');\n\n// Pause the time flow, stop the timers, you now have manual control\n// over the page time.\nawait page.clock.pauseAt(new Date('2024-02-02T10:00:00'));\nawait expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:00 AM');\n\n// Tick through time manually, firing all timers in the process.\n// In this case, time will be updated in the screen 2 times.\nawait page.clock.runFor(2000);\nawait expect(page.getByTestId('current-time')).toHaveText('2/2/2024, 10:00:02 AM');",
        },
      ],
    },
    {
      id: "related-videos",
      title: {
        en: "Related Videos",
        uk: "Пов’язані відео",
      },
    },
  ],
  quiz: [],
}
