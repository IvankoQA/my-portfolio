import type { PlaywrightTopic } from "../../types"

export const codegenIntroTopic: PlaywrightTopic = {
  slug: "codegen-intro",
  groupId: "getting-started",
  order: 160,
  level: "beginner",
  trackOrder: 13,
  sourceDoc: "codegen-intro.md",
  officialDocsUrl: "https://playwright.dev/docs/codegen-intro",
  title: {
    en: "Generating tests",
    uk: "Автогенерація тестів",
  },
  summary: {
    en: "Codegen is the fastest way to get locators when I don't know the element structure yet. I run 'npx playwright codegen http://localhost:3000/orders', click around, and Playwright generates test code with the best locators automatically — getByRole first, then text, then test id. It also records assertions for visibility, text, and values.",
    uk: "Codegen — найшвидший спосіб отримати локатори коли не знаєш структуру елемента. Запускаю 'npx playwright codegen http://localhost:3000/orders', клікаю — Playwright сам генерує код з найкращими локаторами: спочатку getByRole, потім текст, потім test id. Ще записує assertions на видимість, текст і значення.",
  },
  sections: [
    {
      id: "what-it-does",
      title: {
        en: "What codegen actually does",
        uk: "Що codegen насправді робить",
      },
      paragraphs: [
        {
          en: "I use codegen when I'm working on a new page and I don't know what locators to use. Instead of digging through DevTools to guess `getByRole('button', { name: 'Create order' })`, I just click the button in codegen and it tells me. It also picks the most stable locator — role > text > test id — so the generated code is already good quality.",
          uk: "Codegen використовую коли працюю з новою сторінкою і не знаю яке значення передавати в getByRole або getByLabel. Замість того щоб копатися в DevTools — просто клікаю на кнопку в codegen і він показує готовий локатор. Причому вибирає найстабільніший: role > текст > test id.",
        },
        {
          en: "Codegen opens two windows: a browser where I interact with the app, and Playwright Inspector where the generated code appears. I record, copy the code, paste into my test file, and done.",
          uk: "Codegen відкриває два вікна: браузер де я взаємодію з застосунком, і Playwright Inspector де з'являється згенерований код. Записав, скопіював, вставив у тест-файл — готово.",
        },
      ],
      codeBlocks: [
        {
          id: "run-codegen",
          language: "bash",
          code: `# Запустити codegen для конкретного URL
npx playwright codegen http://localhost:3000/orders

# Або без URL — потім вписати адресу в браузер вручну
npx playwright codegen`,
        },
      ],
    },
    {
      id: "recording-a-test",
      title: {
        en: "Recording a test",
        uk: "Запис тесту",
      },
      paragraphs: [
        {
          en: "Every click, fill, and keyboard press I make in the browser window is converted to test code in real time. When I'm done, I press Stop, then Copy to get the full test. The generated test includes `page.goto()`, all my actions, and uses `await` everywhere correctly.",
          uk: "Кожен клік, заповнення поля і натискання клавіші в браузері миттєво перетворюється на код тесту. Коли закінчив — натискаю Stop, потім Copy щоб отримати повний тест. Згенерований тест включає `page.goto()`, всі мої дії і правильно розставляє `await`.",
        },
        {
          en: "Besides actions I can also record assertions without writing them manually:\n- Click the assert button on the toolbar, then click an element to assert that it's **visible**\n- Or assert that it has specific **text**\n- Or assert that an input has a specific **value**\n\nThis is the fastest way to get a working test skeleton — I clean it up after.",
          uk: "Крім дій можна записувати assertions без ручного написання:\n- Клікнути кнопку assert на панелі, потім клікнути елемент — для перевірки **видимості**\n- Або перевірки **тексту**\n- Або перевірки **значення** поля\n\nЦе найшвидший спосіб отримати робочий скелет тесту — потім я його шліфую.",
        },
      ],
      codeBlocks: [
        {
          id: "generated-example",
          language: "ts",
          code: `// Приклад того що генерує codegen для форми замовлення
import { test, expect } from '@playwright/test'

test('create order', async ({ page }) => {
  await page.goto('http://localhost:3000/orders')
  await page.getByRole('button', { name: 'New order' }).click()
  await page.getByLabel('Customer name').fill('Acme Corp')
  await page.getByLabel('Amount').fill('5000')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Order created')).toBeVisible()
})`,
        },
      ],
    },
    {
      id: "picking-locators",
      title: {
        en: "Picking locators without recording a test",
        uk: "Отримання локаторів без запису тесту",
      },
      paragraphs: [
        {
          en: "When I only need a locator for a specific element (not a full test), I use Pick Locator mode. I click Stop to pause recording, then press the Pick Locator button. Now hovering over elements shows the recommended locator — I click the element, the locator appears in the playground, I can edit it there and see the match highlighted in the browser, then copy.",
          uk: "Коли потрібен лише локатор конкретного елемента (а не повний тест) — використовую режим Pick Locator. Натискаю Stop щоб зупинити запис, потім кнопку Pick Locator. Тепер при наведенні на елементи показується рекомендований локатор — клікаю елемент, локатор з'являється в playground де можна відредагувати й побачити матч у браузері, потім копіюю.",
        },
        {
          en: "This is the workflow I use most often: not to record a complete test, but to quickly find the right locator for an element I'm adding to an existing test.",
          uk: "Це мій найчастіший кейс: не записати повний тест, а швидко знайти правильний локатор для елемента якого додаю до вже існуючого тесту.",
        },
      ],
    },
    {
      id: "emulation",
      title: {
        en: "Recording with device emulation",
        uk: "Запис з емуляцією пристрою",
      },
      paragraphs: [
        {
          en: "Codegen can record tests with device emulation active — viewport, locale, geolocation. For example, to generate a test that runs as iPhone 13 in Ukrainian:",
          uk: "Codegen може записувати тести з активною емуляцією пристрою — viewport, локаль, геолокація. Наприклад, щоб згенерувати тест для iPhone 13 з українською локаллю:",
        },
      ],
      codeBlocks: [
        {
          id: "codegen-emulation",
          language: "bash",
          code: `# Записати тест для iPhone 13
npx playwright codegen --device="iPhone 13" http://localhost:3000

# З конкретною локаллю
npx playwright codegen --lang=uk-UA http://localhost:3000

# Зберегти в конкретний файл замість буфера
npx playwright codegen --output=tests/orders.spec.ts http://localhost:3000/orders`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You're writing a test for a new 'Create order' page you've never touched before. Which is the fastest way to get the right locator for the Save button?",
        uk: "Ти пишеш тест для нової сторінки 'Create order' якої раніше не торкався. Який найшвидший спосіб отримати правильний локатор для кнопки Save?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Open DevTools, inspect the button, copy its CSS selector",
            uk: "Відкрити DevTools, проінспектувати кнопку, скопіювати CSS-селектор",
          },
        },
        {
          id: "b",
          label: {
            en: "Run npx playwright codegen, click the Save button — Playwright generates the locator automatically with the best strategy (role first, then text)",
            uk: "Запустити npx playwright codegen, клікнути кнопку Save — Playwright автоматично генерує локатор з найкращою стратегією (role спочатку, потім текст)",
          },
        },
        {
          id: "c",
          label: {
            en: "Try getByText('Save') and see if it works",
            uk: "Спробувати getByText('Save') і подивитись чи спрацює",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Codegen is exactly the tool for this. CSS selectors from DevTools are fragile (they break with any DOM restructuring). `getByText('Save')` might work but codegen does better: it analyzes the page and picks the most resilient locator — usually `getByRole('button', { name: 'Save' })` which survives style changes and refactors. And it does it instantly, without you needing to know the element structure.",
        uk: "Codegen — це саме той інструмент для цього. CSS-селектори з DevTools крихкі (ламаються при будь-якій реструктуризації DOM). `getByText('Save')` може спрацювати але codegen робить краще: аналізує сторінку і вибирає найстійкіший локатор — зазвичай `getByRole('button', { name: 'Save' })` який виживає при зміні стилів і рефакторингах. І робить це миттєво без потреби знати структуру елемента.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "What two windows does codegen open when you run 'npx playwright codegen'?",
        uk: "Які два вікна відкриває codegen при запуску 'npx playwright codegen'?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "A terminal with live code output and a browser DevTools panel",
            uk: "Термінал з живим виводом коду і панель DevTools браузера",
          },
        },
        {
          id: "b",
          label: {
            en: "A browser window to interact with the app and Playwright Inspector showing the generated code",
            uk: "Вікно браузера для взаємодії з застосунком і Playwright Inspector що показує згенерований код",
          },
        },
        {
          id: "c",
          label: {
            en: "A VS Code editor tab with the test file and a headless browser running in the background",
            uk: "Вкладка редактора VS Code з файлом тесту і headless-браузер що працює у фоні",
          },
        },
        {
          id: "d",
          label: {
            en: "Two browser windows — one to record and one to replay the recording",
            uk: "Два вікна браузера — одне для запису і одне для відтворення запису",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Codegen always opens two windows: a regular browser where you interact with the app (clicking, filling forms, navigating), and the Playwright Inspector which shows the generated test code in real time. When you're done, you press Stop in the Inspector, then Copy to get the complete test. This two-window design lets you see the code appear as you act.",
        uk: "Codegen завжди відкриває два вікна: звичайний браузер де ти взаємодієш з застосунком (клікаєш, заповнюєш форми, навігуєш), і Playwright Inspector який показує згенерований код тесту в реальному часі. Коли закінчиш — натискаєш Stop в Inspector, потім Copy щоб отримати повний тест. Цей дводіконний дизайн дозволяє бачити як код з'являється в процесі дій.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "In what priority order does codegen pick locators when you click an element?",
        uk: "В якому пріоритетному порядку codegen вибирає локатори при кліку на елемент?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "CSS selector first, then XPath, then text content",
            uk: "Спочатку CSS-селектор, потім XPath, потім текстовий вміст",
          },
        },
        {
          id: "b",
          label: {
            en: "Role first, then text, then test id — preferring the most stable and semantic option",
            uk: "Спочатку role, потім текст, потім test id — надаючи перевагу найстабільнішому і семантичному варіанту",
          },
        },
        {
          id: "c",
          label: {
            en: "data-testid first, then aria-label, then CSS class",
            uk: "Спочатку data-testid, потім aria-label, потім CSS клас",
          },
        },
        {
          id: "d",
          label: {
            en: "The locator type is chosen randomly and you must manually select a better one",
            uk: "Тип локатора вибирається випадково і потрібно вручну вибрати кращий",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Codegen follows a deliberate priority: role-based locators (getByRole) first, then text-based (getByText, getByLabel), then test id (getByTestId). Role locators are most resilient because they reflect semantic meaning rather than DOM structure or styling — they survive refactors. CSS selectors and XPath are fragile by comparison and codegen avoids them unless nothing better is available.",
        uk: "Codegen дотримується свідомого пріоритету: спочатку локатори на основі ролі (getByRole), потім на основі тексту (getByText, getByLabel), потім test id (getByTestId). Локатори за роллю найстійкіші бо відображають семантичний зміст а не структуру DOM або стилізацію — вони виживають при рефакторингах. CSS-селектори і XPath крихкіші за порівнянням і codegen уникає їх якщо немає кращого варіанту.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "What can you record as assertions in codegen without writing code manually?",
        uk: "Що можна записати як assertions у codegen без ручного написання коду?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Only network response assertions — codegen cannot record DOM assertions",
            uk: "Тільки assertions мережевих відповідей — codegen не може записувати DOM-assertions",
          },
        },
        {
          id: "b",
          label: {
            en: "Visibility, text content, and input value assertions — by clicking the assert toolbar button then clicking the element",
            uk: "Assertions видимості, текстового вмісту і значення поля — клацнувши кнопку assert на панелі інструментів потім на елемент",
          },
        },
        {
          id: "c",
          label: {
            en: "Only screenshot assertions — codegen saves a screenshot and generates a visual comparison",
            uk: "Тільки screenshot assertions — codegen зберігає скриншот і генерує візуальне порівняння",
          },
        },
        {
          id: "d",
          label: {
            en: "Codegen records actions only — assertions must always be written manually",
            uk: "Codegen записує тільки дії — assertions завжди потрібно писати вручну",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Codegen has assertion recording built in. The toolbar has an assert button — click it and then click any element to record that it's visible (toBeVisible), has specific text (toHaveText), or has a specific value (toHaveValue) for inputs. This gives you a full test skeleton including assertions, not just actions. You still need to clean up and review the output, but it's a huge head-start.",
        uk: "Codegen має вбудований запис assertions. Панель інструментів має кнопку assert — клацни її і потім клацни будь-який елемент щоб записати що він видимий (toBeVisible), має конкретний текст (toHaveText) або конкретне значення (toHaveValue) для полів вводу. Це дає повний скелет тесту включно з assertions, а не тільки дії. Потрібно все одно прибрати і переглянути результат, але це великий початок.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "You need a locator for one specific element in an existing test — not a full recording. How do you use codegen for this?",
        uk: "Тобі потрібен локатор для одного конкретного елемента в існуючому тесті — не повний запис. Як використати codegen для цього?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Record a full test, then delete all lines except the locator you need",
            uk: "Записати повний тест, потім видалити всі рядки крім потрібного локатора",
          },
        },
        {
          id: "b",
          label: {
            en: "Press Stop to pause recording, then click 'Pick Locator' — hover over the element to see the recommended locator, click to copy it",
            uk: "Натиснути Stop щоб зупинити запис, потім клацнути 'Pick Locator' — навести на елемент щоб побачити рекомендований локатор, клацнути для копіювання",
          },
        },
        {
          id: "c",
          label: {
            en: "Open DevTools in the codegen browser and use $0 to get the selected element's selector",
            uk: "Відкрити DevTools у браузері codegen і використати $0 щоб отримати селектор виділеного елемента",
          },
        },
        {
          id: "d",
          label: {
            en: "Pick Locator is only available in the VS Code extension, not in codegen",
            uk: "Pick Locator доступний тільки в розширенні VS Code, а не в codegen",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Pick Locator mode is built into the Playwright Inspector (the codegen window). Stop recording first so new clicks don't generate action code, then switch to Pick Locator. Hovering shows the best locator for each element, clicking copies it. This is the fastest way to get a locator when you just need to add one line to an existing test — no full recording needed.",
        uk: "Режим Pick Locator вбудований в Playwright Inspector (вікно codegen). Спочатку зупини запис щоб нові кліки не генерували код дій, потім перейди на Pick Locator. Наведення показує найкращий локатор для кожного елемента, клацання копіює його. Це найшвидший спосіб отримати локатор коли потрібно лише додати один рядок до існуючого тесту — не потрібний повний запис.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "When is generated code from codegen NOT ideal and requires manual editing?",
        uk: "Коли згенерований код codegen НЕ є ідеальним і вимагає ручного редагування?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Always — codegen output is never production-quality and is only a starting point",
            uk: "Завжди — вивід codegen ніколи не є production-якості і є лише відправною точкою",
          },
        },
        {
          id: "b",
          label: {
            en: "When elements lack semantic roles or labels — codegen may fall back to fragile position-based or CSS selectors",
            uk: "Коли елементам бракує семантичних ролей або міток — codegen може повернутися до крихких селекторів на основі позиції або CSS",
          },
        },
        {
          id: "c",
          label: {
            en: "When the page uses React — codegen cannot generate correct selectors for component-based UIs",
            uk: "Коли сторінка використовує React — codegen не може генерувати правильні селектори для UI на основі компонентів",
          },
        },
        {
          id: "d",
          label: {
            en: "When tests run in Firefox or WebKit — codegen only works correctly with Chromium",
            uk: "Коли тести виконуються в Firefox або WebKit — codegen працює правильно тільки з Chromium",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Codegen picks the best available locator, but if an element has no role, no label, and no test id, it may fall back to a CSS class or nth-child selector — which is fragile. This is a signal to improve the app's accessibility markup (add aria-label, role, or data-testid) rather than accept the generated selector. Codegen works fine with React and all browsers — these are myths.",
        uk: "Codegen вибирає найкращий доступний локатор, але якщо елемент не має ролі, мітки і test id — може повернутися до CSS класу або nth-child селектора що є крихким. Це сигнал покращити розмітку доступності застосунку (додати aria-label, role або data-testid) а не приймати згенерований селектор. Codegen добре працює з React і всіма браузерами — це міфи.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "What is the key difference between recording a test with codegen versus writing locators manually?",
        uk: "Яка ключова відмінність між записом тесту через codegen і ручним написанням локаторів?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Codegen produces slower tests because it records extra wait steps",
            uk: "Codegen продукує повільніші тести бо записує зайві кроки очікування",
          },
        },
        {
          id: "b",
          label: {
            en: "Codegen lets you discover the right locator by interacting with the live page instead of guessing from source code or DevTools",
            uk: "Codegen дозволяє знаходити правильний локатор взаємодіючи з живою сторінкою замість того щоб здогадуватися з вихідного коду або DevTools",
          },
        },
        {
          id: "c",
          label: {
            en: "Manual locators use getByRole while codegen always uses CSS selectors",
            uk: "Ручні локатори використовують getByRole тоді як codegen завжди використовує CSS-селектори",
          },
        },
        {
          id: "d",
          label: {
            en: "There is no difference — codegen just types the same code you would write manually",
            uk: "Різниці немає — codegen просто вводить той самий код який би ти написав вручну",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The core advantage of codegen is discovery through interaction. When writing manually, you must read the source HTML or use DevTools to find accessible names, roles, and labels. Codegen does this for you: you click the real element in the live app and it immediately tells you the best locator. This is especially valuable on unfamiliar pages or when the DOM is complex and hard to read statically.",
        uk: "Основна перевага codegen — це відкриття через взаємодію. При ручному написанні потрібно читати вихідний HTML або використовувати DevTools щоб знайти доступні імена, ролі і мітки. Codegen робить це за тебе: клацаєш реальний елемент у живому застосунку і він одразу каже найкращий локатор. Це особливо цінно на незнайомих сторінках або коли DOM складний і важко читається статично.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "How do you start codegen to record a test for a specific URL?",
        uk: "Як запустити codegen для запису тесту для конкретного URL?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "npx playwright test --record http://localhost:3000/orders",
            uk: "npx playwright test --record http://localhost:3000/orders",
          },
        },
        {
          id: "b",
          label: {
            en: "npx playwright codegen http://localhost:3000/orders",
            uk: "npx playwright codegen http://localhost:3000/orders",
          },
        },
        {
          id: "c",
          label: {
            en: "npx playwright open --codegen http://localhost:3000/orders",
            uk: "npx playwright open --codegen http://localhost:3000/orders",
          },
        },
        {
          id: "d",
          label: {
            en: "npx playwright generate http://localhost:3000/orders",
            uk: "npx playwright generate http://localhost:3000/orders",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "'npx playwright codegen <URL>' is the correct command. It opens the browser at that URL and starts recording immediately. You can also run 'npx playwright codegen' without a URL and manually type the address in the browser — but passing the URL is faster. The other command variants ('--record', 'open --codegen', 'generate') do not exist in Playwright's CLI.",
        uk: "'npx playwright codegen <URL>' — правильна команда. Вона відкриває браузер за тим URL і одразу починає запис. Можна також запустити 'npx playwright codegen' без URL і вручну ввести адресу в браузері — але передача URL швидша. Інші варіанти команд ('--record', 'open --codegen', 'generate') не існують в CLI Playwright.",
      },
    },
  ],
}
