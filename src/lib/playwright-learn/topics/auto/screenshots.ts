import type { PlaywrightTopic } from "../../types"

export const screenshotsTopic: PlaywrightTopic = {
  slug: "screenshots",
  groupId: "guides",
  order: 295,
  level: "beginner",
  trackOrder: 17,
  sourceDoc: "screenshots.md",
  officialDocsUrl: "https://playwright.dev/docs/screenshots",
  title: {
    en: "Screenshots",
    uk: "Знімки екрана",
  },
  summary: {
    en: "I use screenshots for two things: debugging (save a screenshot when something looks wrong) and visual regression (compare against a golden image). Two completely different use cases, two different APIs.",
    uk: "Я використовую screenshots для двох речей: дебаг (зберегти screenshot коли щось виглядає не так) і візуальна регресія (порівняти з еталонним зображенням). Два абсолютно різні кейси, два різні API.",
  },
  sections: [
    {
      id: "capture-screenshot",
      title: {
        en: "Capture a screenshot",
        uk: "Зняти screenshot",
      },
      paragraphs: [
        {
          en: "The most common use: save a screenshot to a file for debugging. Use it when a test fails and you want to see what the page looked like at that moment.",
          uk: "Найпоширеніше використання: зберегти screenshot у файл для дебагу. Використовую коли тест падає і хочу побачити як виглядала сторінка в той момент.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-screenshot",
          language: "ts",
          code: `// Весь viewport
await page.screenshot({ path: '/tmp/debug.png' })

// Вся сторінка (зі скролом)
await page.screenshot({ path: '/tmp/full-page.png', fullPage: true })

// Конкретний елемент
await page.locator('[data-testid="order-card"]').screenshot({ path: '/tmp/card.png' })

// Отримати як Buffer (без збереження)
const buffer = await page.screenshot()
// можна відправити кудись або зробити base64
console.log(buffer.toString('base64'))`,
        },
      ],
    },
    {
      id: "screenshot-on-failure",
      title: {
        en: "Auto-screenshot on failure",
        uk: "Автоматичний screenshot при падінні",
      },
      paragraphs: [
        {
          en: "Instead of adding `page.screenshot()` calls throughout your tests, configure Playwright to save screenshots automatically on failure. The screenshot is attached to the test report — you see it right next to the failed test.",
          uk: "Замість того щоб додавати `page.screenshot()` по всіх тестах — налаштуй Playwright зберігати screenshots автоматично при падінні. Screenshot прикріплюється до тестового звіту — бачиш його прямо поруч з падаючим тестом.",
        },
      ],
      codeBlocks: [
        {
          id: "auto-screenshot",
          language: "ts",
          code: `// playwright.config.ts
export default defineConfig({
  use: {
    // 'off' — не знімати (за замовчуванням)
    // 'on' — знімати завжди
    // 'only-on-failure' — тільки при падінні
    screenshot: 'only-on-failure',
  },
})`,
        },
      ],
    },
    {
      id: "visual-regression",
      title: {
        en: "Visual regression with toHaveScreenshot",
        uk: "Візуальна регресія з toHaveScreenshot",
      },
      paragraphs: [
        {
          en: "For visual regression tests — \"does the dashboard look the same as before\" — use `toHaveScreenshot`. On the first run it saves a golden image. On subsequent runs it compares pixel by pixel. If they differ beyond the threshold, the test fails.",
          uk: "Для тестів візуальної регресії — \"чи виглядає dashboard так само як раніше\" — використовуй `toHaveScreenshot`. При першому запуску зберігає еталонне зображення. При наступних — порівнює піксель за пікселем. Якщо відрізняються більше порогу — тест падає.",
        },
        {
          en: "Visual tests are fragile — fonts, colors, anti-aliasing differ across OS and GPU. Best practice: run visual tests in a fixed Docker environment, not local machines.",
          uk: "Візуальні тести крихкі — шрифти, кольори, антиаліасинг відрізняються між ОС і GPU. Кращий підхід: запускати візуальні тести у фіксованому Docker оточенні, а не на локальних машинах.",
        },
      ],
      codeBlocks: [
        {
          id: "visual-regression",
          language: "ts",
          code: `test('order dashboard looks correct', async ({ page }) => {
  await page.goto('/dashboard')
  await page.waitForLoadState('networkidle') // чекаємо всіх завантажень

  // Перший запуск: зберігає dashboard.png як еталон
  // Наступні запуски: порівнює з еталоном
  await expect(page).toHaveScreenshot('dashboard.png')
})

// Для конкретного компонента
test('order card renders correctly', async ({ page }) => {
  await page.goto('/orders/42')

  const card = page.getByTestId('order-card')
  await expect(card).toHaveScreenshot('order-card.png', {
    maxDiffPixelRatio: 0.02, // допускаємо 2% відхилення
  })
})

// Оновити еталонні зображення
// npx playwright test --update-snapshots`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "What's the difference between page.screenshot() and expect(page).toHaveScreenshot()?",
        uk: "В чому різниця між page.screenshot() і expect(page).toHaveScreenshot()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "They do the same thing, toHaveScreenshot is just a newer API",
            uk: "Вони роблять те саме, toHaveScreenshot просто новіший API",
          },
        },
        {
          id: "b",
          label: {
            en: "screenshot() saves to a file for debugging; toHaveScreenshot() compares against a saved golden image for visual regression",
            uk: "screenshot() зберігає у файл для дебагу; toHaveScreenshot() порівнює з еталонним зображенням для візуальної регресії",
          },
        },
        {
          id: "c",
          label: {
            en: "toHaveScreenshot() takes higher quality images",
            uk: "toHaveScreenshot() робить зображення вищої якості",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.screenshot()` is an imperative action — it saves an image to disk or returns a buffer. `toHaveScreenshot()` is an assertion — it compares the current screenshot against a previously saved 'golden' image and fails if they differ beyond a threshold. Two different purposes.",
        uk: "`page.screenshot()` — це imperative дія: зберігає зображення на диск або повертає буфер. `toHaveScreenshot()` — це assertion: порівнює поточний screenshot з раніше збереженим 'еталонним' зображенням і падає якщо вони відрізняються більше порогу. Два різні призначення.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "How do you capture a screenshot of the entire page, including content below the fold?",
        uk: "Як зробити знімок всієї сторінки, включаючи вміст нижче лінії згину?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.screenshot({ fullPage: true })",
            uk: "await page.screenshot({ fullPage: true })",
          },
        },
        {
          id: "b",
          label: {
            en: "await page.screenshot({ scroll: 'all' })",
            uk: "await page.screenshot({ scroll: 'all' })",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.scrollToBottom(); await page.screenshot()",
            uk: "await page.scrollToBottom(); await page.screenshot()",
          },
        },
        {
          id: "d",
          label: {
            en: "await page.screenshot({ height: 'auto' })",
            uk: "await page.screenshot({ height: 'auto' })",
          },
        },
      ],
      correctOptionId: "a",
      rationale: {
        en: "{ fullPage: true } tells Playwright to expand the viewport to the full document height before capturing, resulting in a single image of the complete page including off-screen content. The other options don't exist as valid Playwright API options.",
        uk: "{ fullPage: true } вказує Playwright розширити viewport до повної висоти документа перед захопленням, що дає одне зображення повної сторінки включаючи позаекранний вміст. Інші варіанти не існують як валідні опції API Playwright.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "You want to capture only a specific region of the page — for example, a 400×200 pixel rectangle starting at coordinates (100, 50). Which option do you pass to page.screenshot()?",
        uk: "Хочеш захопити тільки певну область сторінки — наприклад прямокутник 400×200 пікселів починаючи з координат (100, 50). Який параметр передати до page.screenshot()?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "{ region: { x: 100, y: 50, width: 400, height: 200 } }",
            uk: "{ region: { x: 100, y: 50, width: 400, height: 200 } }",
          },
        },
        {
          id: "b",
          label: {
            en: "{ clip: { x: 100, y: 50, width: 400, height: 200 } }",
            uk: "{ clip: { x: 100, y: 50, width: 400, height: 200 } }",
          },
        },
        {
          id: "c",
          label: {
            en: "{ crop: { x: 100, y: 50, width: 400, height: 200 } }",
            uk: "{ crop: { x: 100, y: 50, width: 400, height: 200 } }",
          },
        },
        {
          id: "d",
          label: {
            en: "{ viewport: { x: 100, y: 50, width: 400, height: 200 } }",
            uk: "{ viewport: { x: 100, y: 50, width: 400, height: 200 } }",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The clip option accepts an object with x, y, width, and height — it captures only that rectangular region of the page. This is useful when you want to focus on a specific UI section without capturing the surrounding page. The other option names (region, crop, viewport) are not valid Playwright screenshot options.",
        uk: "Опція clip приймає об'єкт з x, y, width і height — вона захоплює тільки той прямокутний регіон сторінки. Корисна коли хочеш сфокусуватись на конкретній секції UI не захоплюючи навколишню сторінку. Інші назви опцій (region, crop, viewport) не є валідними опціями screenshot Playwright.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you take a screenshot of a single element (e.g., a card component) rather than the whole page?",
        uk: "Як зробити знімок окремого елемента (наприклад компонента картки) а не всієї сторінки?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "await page.screenshot({ element: page.getByTestId('card') })",
            uk: "await page.screenshot({ element: page.getByTestId('card') })",
          },
        },
        {
          id: "b",
          label: {
            en: "await page.getByTestId('card').screenshot({ path: 'card.png' })",
            uk: "await page.getByTestId('card').screenshot({ path: 'card.png' })",
          },
        },
        {
          id: "c",
          label: {
            en: "await page.cropTo(page.getByTestId('card')).screenshot()",
            uk: "await page.cropTo(page.getByTestId('card')).screenshot()",
          },
        },
        {
          id: "d",
          label: {
            en: "You must use the clip option with manually measured coordinates",
            uk: "Потрібно використовувати опцію clip з вручну виміряними координатами",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Locators have their own .screenshot() method — locator.screenshot() scrolls the element into view and captures just that element's bounding box. This is far more convenient than computing clip coordinates manually. It works well combined with visual regression: await expect(locator).toHaveScreenshot('card.png').",
        uk: "Локатори мають власний метод .screenshot() — locator.screenshot() прокручує елемент у область видимості і захоплює тільки bounding box цього елемента. Це набагато зручніше ніж вручну обчислювати координати clip. Добре поєднується з візуальною регресією: await expect(locator).toHaveScreenshot('card.png').",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "Your page has a dynamic user avatar image that changes with every test run, causing visual regression tests to fail. How do you prevent the avatar from appearing in the screenshot?",
        uk: "На сторінці є динамічне зображення аватара користувача що змінюється при кожному запуску тесту, через що тести візуальної регресії падають. Як запобігти появі аватара на знімку?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Use page.evaluate() to remove the avatar element from the DOM before screenshotting",
            uk: "Використати page.evaluate() щоб видалити елемент аватара з DOM перед знімком",
          },
        },
        {
          id: "b",
          label: {
            en: "Pass mask: [page.getByTestId('avatar')] to toHaveScreenshot() — the element is replaced with a solid box in the comparison",
            uk: "Передати mask: [page.getByTestId('avatar')] до toHaveScreenshot() — елемент замінюється суцільним блоком при порівнянні",
          },
        },
        {
          id: "c",
          label: {
            en: "Increase maxDiffPixelRatio to ignore the avatar region",
            uk: "Збільшити maxDiffPixelRatio щоб ігнорувати регіон аватара",
          },
        },
        {
          id: "d",
          label: {
            en: "Set screenshot: { ignoreElements: ['[data-testid=avatar]'] } in playwright.config.ts",
            uk: "Встановити screenshot: { ignoreElements: ['[data-testid=avatar]'] } в playwright.config.ts",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The mask option accepts an array of locators. Each matched element is painted over with a solid magenta rectangle before the comparison — the pixel content of the masked area is ignored. This is the idiomatic Playwright way to handle dynamic content like timestamps, avatars, or animated elements in visual regression tests.",
        uk: "Опція mask приймає масив локаторів. Кожен відповідний елемент замальовується суцільним пурпуровим прямокутником перед порівнянням — піксельний вміст маскованої області ігнорується. Це ідіоматичний спосіб Playwright для обробки динамічного вмісту як мітки часу, аватари або анімовані елементи у тестах візуальної регресії.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you configure Playwright to automatically save a screenshot only when a test fails?",
        uk: "Як налаштувати Playwright щоб автоматично зберігати знімок тільки коли тест падає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Add a try/catch block in every test and call page.screenshot() in the catch",
            uk: "Додати блок try/catch в кожен тест і викликати page.screenshot() в catch",
          },
        },
        {
          id: "b",
          label: {
            en: "Set screenshot: 'only-on-failure' in the use section of playwright.config.ts",
            uk: "Встановити screenshot: 'only-on-failure' в секції use playwright.config.ts",
          },
        },
        {
          id: "c",
          label: {
            en: "Set screenshot: 'on-first-retry' in playwright.config.ts",
            uk: "Встановити screenshot: 'on-first-retry' в playwright.config.ts",
          },
        },
        {
          id: "d",
          label: {
            en: "Use afterEach hook with a condition checking test.info().status",
            uk: "Використати afterEach хук з умовою що перевіряє test.info().status",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "screenshot: 'only-on-failure' in the use section of playwright.config.ts tells Playwright to automatically capture and attach a screenshot to the test report when a test fails — no manual code needed in individual tests. The valid values are 'off' (default), 'on' (always), and 'only-on-failure'. This is ideal for CI debugging without bloating reports with screenshots of passing tests.",
        uk: "screenshot: 'only-on-failure' в секції use playwright.config.ts вказує Playwright автоматично захоплювати і прикріплювати знімок до звіту тесту коли тест падає — не потрібен жодний ручний код в окремих тестах. Валідні значення: 'off' (за замовчуванням), 'on' (завжди) і 'only-on-failure'. Ідеально для дебагу на CI без заповнення звітів знімками тестів що проходять.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "Visual regression tests pass on your Mac but fail on the CI Linux runner due to slightly different font rendering. What is the recommended fix?",
        uk: "Тести візуальної регресії проходять на твоєму Mac але падають на CI Linux runner через дещо відмінний рендеринг шрифтів. Яке рекомендоване виправлення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Increase maxDiffPixelRatio to tolerate the font differences on all platforms",
            uk: "Збільшити maxDiffPixelRatio щоб допустити відмінності шрифтів на всіх платформах",
          },
        },
        {
          id: "b",
          label: {
            en: "Run visual tests inside a fixed Docker container so rendering is consistent regardless of where the test runs",
            uk: "Запускати візуальні тести всередині фіксованого Docker контейнера щоб рендеринг був однаковим незалежно від місця запуску",
          },
        },
        {
          id: "c",
          label: {
            en: "Disable font anti-aliasing in the browser launch options",
            uk: "Вимкнути антиаліасинг шрифтів в опціях запуску браузера",
          },
        },
        {
          id: "d",
          label: {
            en: "Use toHaveScreenshot on Linux and page.screenshot on Mac",
            uk: "Використовувати toHaveScreenshot на Linux і page.screenshot на Mac",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Font rendering, color profiles, and anti-aliasing differ between operating systems and even GPU drivers — this is why visual regression tests that pass locally can fail on CI. The best practice is to run visual tests inside a locked Docker image (e.g. mcr.microsoft.com/playwright) where the rendering environment is fully controlled and reproducible. Golden images should be generated inside the same Docker container.",
        uk: "Рендеринг шрифтів, кольорові профілі і антиаліасинг відрізняються між операційними системами і навіть між GPU-драйверами — саме тому тести візуальної регресії що проходять локально можуть падати на CI. Кращий підхід — запускати візуальні тести всередині заблокованого Docker-образу (наприклад mcr.microsoft.com/playwright) де середовище рендеринга повністю контрольоване і відтворюване. Еталонні зображення мають генеруватись всередині того самого Docker контейнера.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "You update a UI component intentionally and now toHaveScreenshot() fails because the golden image is outdated. How do you update the golden images?",
        uk: "Ти навмисно оновлюєш UI компонент і тепер toHaveScreenshot() падає бо еталонне зображення застаріле. Як оновити еталонні зображення?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Delete the snapshot files manually from the file system",
            uk: "Видалити файли знімків вручну з файлової системи",
          },
        },
        {
          id: "b",
          label: {
            en: "Run npx playwright test --update-snapshots to regenerate all golden images",
            uk: "Запустити npx playwright test --update-snapshots щоб регенерувати всі еталонні зображення",
          },
        },
        {
          id: "c",
          label: {
            en: "Rename the .png files with a -new suffix and Playwright will use them automatically",
            uk: "Перейменувати .png файли з суфіксом -new і Playwright використовуватиме їх автоматично",
          },
        },
        {
          id: "d",
          label: {
            en: "Increase maxDiffPixelRatio until the test passes again",
            uk: "Збільшити maxDiffPixelRatio поки тест не почне проходити знову",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "npx playwright test --update-snapshots reruns the visual tests and overwrites the existing golden image files with the current screenshots. Review the git diff afterwards to confirm that only the expected visual changes are included. Never increase maxDiffPixelRatio as a permanent fix — it reduces the sensitivity of all future visual checks.",
        uk: "npx playwright test --update-snapshots повторно запускає візуальні тести і перезаписує існуючі файли еталонних зображень поточними знімками. Після цього переглянь git diff щоб переконатись що включені тільки очікувані візуальні зміни. Ніколи не збільшуй maxDiffPixelRatio як постійне виправлення — це знижує чутливість всіх майбутніх візуальних перевірок.",
      },
    },
  ],
}
