import type { PlaywrightTopic } from "../../types"

export const videosTopic: PlaywrightTopic = {
  slug: "videos",
  groupId: "guides",
  order: 425,
  level: "advanced",
  trackOrder: 25,
  sourceDoc: "videos.md",
  officialDocsUrl: "https://playwright.dev/docs/videos",
  title: {
    en: "Videos",
    uk: "Відео",
  },
  summary: {
    en: "Videos record everything that happened in the browser during a test — every click, navigation, and visual state change. I use retain-on-failure so videos only keep around when a test actually breaks. Combined with traces, they make debugging CI failures possible without reproducing locally.",
    uk: "Відео записує все що відбувалося в браузері під час тесту — кожен клік, навігацію і зміну візуального стану. Я використовую retain-on-failure щоб відео зберігалися тільки коли тест реально падає. У поєднанні з traces — вони роблять дебаг CI-падінь можливим без локального відтворення.",
  },
  sections: [
    {
      id: "video-modes",
      title: {
        en: "Video recording modes",
        uk: "Режими запису відео",
      },
      paragraphs: [
        {
          en: "Four modes, each for a different need. Configure in `use.video` in `playwright.config.ts`.",
          uk: "Чотири режими, кожен для різних потреб. Налаштовується в `use.video` у `playwright.config.ts`.",
        },
      ],
      codeBlocks: [
        {
          id: "video-config",
          language: "ts",
          code: `export default defineConfig({
  use: {
    // 'off'               — не записувати відео (за замовчуванням)
    // 'on'                — записувати для кожного тесту
    // 'retain-on-failure' — записувати, але видаляти відео успішних тестів
    // 'on-first-retry'    — записувати тільки при першому повторі падаючого тесту
    video: 'retain-on-failure',
  },
})`,
        },
      ],
    },
    {
      id: "what-you-get",
      title: {
        en: "Where videos end up",
        uk: "Де опиняються відео",
      },
      paragraphs: [
        {
          en: "After the test run, videos are in `test-results/`. Each failed test gets its own subfolder with the video alongside the trace and screenshots. In the HTML report (`npx playwright show-report`) you can play the video directly in the browser.",
          uk: "Після запуску тестів відео знаходяться у `test-results/`. Кожен падаючий тест отримує власну підпапку з відео поруч із trace і скріншотами. В HTML-репорті (`npx playwright show-report`) відео можна відтворити прямо в браузері.",
        },
        {
          en: "Video is saved when the browser context closes at the end of a test. If you create a context manually, you must `await context.close()` to flush the video file.",
          uk: "Відео зберігається при закритті контексту браузера наприкінці тесту. Якщо ти створюєш контекст вручну — потрібно зробити `await context.close()` щоб відео записалося.",
        },
      ],
      codeBlocks: [
        {
          id: "manual-context",
          language: "ts",
          code: `// Якщо контекст створений вручну — закрити явно
const context = await browser.newContext()
const page = await context.newPage()

await page.goto('/orders')
// ... тест ...

// БЕЗ await context.close() — відео може не зберегтися
await context.close()`,
        },
      ],
    },
    {
      id: "video-size",
      title: {
        en: "Video size and annotations",
        uk: "Розмір відео і анотації",
      },
      paragraphs: [
        {
          en: "By default video resolution matches the viewport, scaled to fit 800×800. You can specify size explicitly. Playwright also supports annotating the video — highlighting actions with outlines and titles, useful for sharing recordings with non-technical stakeholders.",
          uk: "За замовчуванням роздільна здатність відео збігається з viewport, масштабованим до 800×800. Можна задати розмір явно. Playwright також підтримує анотування відео — підсвічування дій з контурами і підписами, корисно для демонстрацій нетехнічним колегам.",
        },
      ],
      codeBlocks: [
        {
          id: "video-advanced",
          language: "ts",
          code: `export default defineConfig({
  use: {
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 },

      // Показувати анотації дій у відео
      show: {
        actions: {
          duration: 500,        // мс, як довго підсвічувати кожну дію
          position: 'top-right',
          fontSize: 14,
        },
        // Показати назву тесту і крок у відео
        test: {
          level: 'step',
          position: 'top-left',
          fontSize: 12,
        },
      },
    },
  },
})`,
        },
      ],
    },
    {
      id: "video-path",
      title: {
        en: "Access the video path in a test",
        uk: "Отримати шлях до відео у тесті",
      },
      paragraphs: [
        {
          en: "If you need to attach the video to a report or send it somewhere, you can get the file path via `page.video().path()`. Note: this resolves only after the page closes.",
          uk: "Якщо потрібно прикріпити відео до репорту або надіслати кудись — отримай шлях до файлу через `page.video().path()`. Зауваж: резолвиться тільки після закриття сторінки.",
        },
      ],
      codeBlocks: [
        {
          id: "video-path",
          language: "ts",
          code: `test('capture video path', async ({ page }) => {
  await page.goto('/orders')
  // ... тест ...

  // Отримати шлях після тесту (але до закриття context)
  const videoPath = await page.video()?.path()
  console.log('Video saved at:', videoPath)
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You want videos to be recorded but not waste disk space on passing tests. Which mode should you use?",
        uk: "Хочеш щоб відео записувалися але не витрачали місце на диску для тестів що проходять. Який режим використовувати?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "video: 'on' — record everything",
            uk: "video: 'on' — записувати все",
          },
        },
        {
          id: "b",
          label: {
            en: "video: 'retain-on-failure' — record everything but delete passing test videos",
            uk: "video: 'retain-on-failure' — записувати все але видаляти відео успішних тестів",
          },
        },
        {
          id: "c",
          label: {
            en: "video: 'on-first-retry' — only record when a test is retried",
            uk: "video: 'on-first-retry' — записувати тільки коли тест перезапускається",
          },
        },
        {
          id: "d",
          label: {
            en: "video: 'off-on-pass' — a mode that skips recording if the test passes",
            uk: "video: 'off-on-pass' — режим що пропускає запис якщо тест проходить",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`retain-on-failure` records video for every test run but automatically deletes the video file if the test passes. You get videos exactly when you need them (failures) without the storage cost of keeping all passing test videos. `on-first-retry` requires retries to be configured — it won't capture a test that fails on the first run without a retry.",
        uk: "`retain-on-failure` записує відео для кожного запуску тесту але автоматично видаляє файл відео якщо тест проходить. Ти отримуєш відео саме коли вони потрібні (падіння) без витрат на зберігання відео всіх успішних тестів. `on-first-retry` вимагає налаштованих повторів — не захопить тест що падає з першого разу без retry.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "You create a browser context manually with `browser.newContext()` and configure `video: 'on'`. After running the test, the video file doesn't appear. What's missing?",
        uk: "Ти створюєш контекст браузера вручну через `browser.newContext()` і налаштовуєш `video: 'on'`. Після виконання тесту файл відео не з'являється. Чого не вистачає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "You need to call page.video().save() to flush the video file",
            uk: "Потрібно викликати page.video().save() щоб записати файл відео",
          },
        },
        {
          id: "b",
          label: {
            en: "You must await context.close() — video is saved to disk only when the browser context closes",
            uk: "Потрібно await context.close() — відео зберігається на диск лише коли закривається контекст браузера",
          },
        },
        {
          id: "c",
          label: {
            en: "Manual contexts don't support video recording — use the fixture-based { context } instead",
            uk: "Ручні контексти не підтримують запис відео — використовуй фікстуру { context } натомість",
          },
        },
        {
          id: "d",
          label: {
            en: "Call page.video().start() explicitly before the test begins",
            uk: "Виклич page.video().start() явно перед початком тесту",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Video is buffered in memory during the test and written to disk when the browser context closes. With fixture-provided contexts, Playwright closes the context automatically at the end of each test — so video always saves. With manually created contexts, you must explicitly `await context.close()` before the test function returns. Without this, the test process exits before the video is flushed to disk. This is the most common cause of 'video file missing' bugs with manual context creation.",
        uk: "Відео буферизується в пам'яті під час тесту і записується на диск коли закривається контекст браузера. З контекстами наданими фікстурами — Playwright закриває контекст автоматично в кінці кожного тесту, тому відео завжди зберігається. З ручно створеними контекстами — потрібно явно `await context.close()` до повернення функції тесту. Без цього процес тесту завершується до того як відео записується на диск. Це найпоширеніша причина баг 'файл відео відсутній' при ручному створенні контекстів.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "Where can you find and play back test videos after a run?",
        uk: "Де знайти і відтворити відео тестів після запуску?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "In the playwright/ directory at the project root",
            uk: "У теці playwright/ в кореневій директорії проєкту",
          },
        },
        {
          id: "b",
          label: {
            en: "In test-results/ — each test gets its own subfolder with the video alongside traces and screenshots; also accessible in the HTML report",
            uk: "У test-results/ — кожен тест отримує власну підпапку з відео поруч із трейсами і скриншотами; також доступне в HTML-звіті",
          },
        },
        {
          id: "c",
          label: {
            en: "In playwright-report/videos/ — video files are bundled with the report",
            uk: "У playwright-report/videos/ — файли відео bundled зі звітом",
          },
        },
        {
          id: "d",
          label: {
            en: "In a temporary OS directory that's cleared after each run",
            uk: "У тимчасовій системній теці що очищається після кожного запуску",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Test artifacts (videos, traces, screenshots) go into `test-results/` by default. Each test gets a subfolder named after the test title and browser. Inside: `video.webm` (the recording), `trace.zip` (if tracing is on), and any screenshots. The HTML report (`npx playwright show-report`) lets you play videos inline in the browser when viewing a failed test — click the test, scroll to the Attachments section. This makes it easy to share CI failures with video context.",
        uk: "Тестові артефакти (відео, трейси, скриншоти) за замовчуванням йдуть у `test-results/`. Кожен тест отримує підпапку названу за назвою тесту і браузером. Всередині: `video.webm` (запис), `trace.zip` (якщо трейсинг увімкнений) і будь-які скриншоти. HTML-звіт (`npx playwright show-report`) дозволяє відтворювати відео inline в браузері при перегляді тесту що впав — клацни тест, прокрути до розділу Attachments. Це полегшує ділитися CI-падіннями з контекстом відео.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "You configure `video: 'on-first-retry'` but your suite runs with `retries: 0`. A test fails. Is there a video?",
        uk: "Ти налаштовуєш `video: 'on-first-retry'` але набір тестів виконується з `retries: 0`. Тест падає. Чи є відео?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Yes — 'on-first-retry' means record when a test fails for the first time",
            uk: "Так — 'on-first-retry' означає записувати коли тест падає вперше",
          },
        },
        {
          id: "b",
          label: {
            en: "No — 'on-first-retry' records only when a test is retried; with retries: 0, no retry ever happens, so no video is recorded",
            uk: "Ні — 'on-first-retry' записує лише коли тест повторюється; з retries: 0, повтор ніколи не відбувається тому відео не записується",
          },
        },
        {
          id: "c",
          label: {
            en: "It depends — Playwright records the video speculatively but deletes it if there's no retry",
            uk: "Залежить — Playwright записує відео спекулятивно але видаляє якщо немає повтору",
          },
        },
        {
          id: "d",
          label: {
            en: "Yes — Playwright treats a first-and-only failure as an implicit first retry",
            uk: "Так — Playwright вважає перше і єдине падіння неявним першим повтором",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`on-first-retry` is triggered by the retry mechanism — it records the test when Playwright is about to retry it (i.e., after the first failure when `retries >= 1`). With `retries: 0`, there are no retries, so `on-first-retry` never activates. This is exactly the scenario where `retain-on-failure` is preferable: it records always and deletes the video on success, independent of retry configuration. Use `on-first-retry` only when you also have retries configured.",
        uk: "`on-first-retry` запускається механізмом повторів — записує тест коли Playwright збирається його повторити (тобто після першого падіння коли `retries >= 1`). З `retries: 0` повторів немає тому `on-first-retry` ніколи не активується. Саме тут `retain-on-failure` кращий: записує завжди і видаляє відео при успіху незалежно від конфігурації повторів. Використовуй `on-first-retry` лише коли також налаштовані повтори.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "After your test finishes but while the context is still open, you call `page.video().path()`. What does it return?",
        uk: "Після завершення тесту але поки контекст ще відкритий ти викликаєш `page.video().path()`. Що він повертає?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "The final path where the video will be saved",
            uk: "Фінальний шлях де буде збережено відео",
          },
        },
        {
          id: "b",
          label: {
            en: "null — path() resolves only after the page or context closes, since the video file isn't finalized yet",
            uk: "null — path() розрішується лише після закриття сторінки або контексту, оскільки файл відео ще не завершений",
          },
        },
        {
          id: "c",
          label: {
            en: "A temporary path to the in-progress video buffer",
            uk: "Тимчасовий шлях до буфера відео в процесі",
          },
        },
        {
          id: "d",
          label: {
            en: "An error — calling path() before close() throws an exception",
            uk: "Помилка — виклик path() до close() кидає виняток",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`page.video().path()` is a Promise that resolves to the video file path, but only after the page closes (which happens when the context closes). While recording is in progress, the path is `null`. The correct pattern to get the path and attach it to a report: await the test logic, then `const path = await page.video()?.path()` — but this works only if you close the page or context first. In test fixtures, Playwright's own cleanup handles this for you.",
        uk: "`page.video().path()` — Promise що розрішується до шляху файлу відео, але лише після закриття сторінки (що відбувається при закритті контексту). Поки запис відбувається — шлях `null`. Правильний шаблон для отримання шляху і прикріплення до звіту: дочекайся логіки тесту, потім `const path = await page.video()?.path()` — але це працює лише якщо спочатку закрити сторінку або контекст. У тестових фікстурах Playwright сам обробляє це у своєму cleanup.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "What is the default video resolution when no `size` is specified in the video config?",
        uk: "Яка роздільна здатність відео за замовчуванням коли `size` не вказаний у конфігурації відео?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "1280×720 — standard HD",
            uk: "1280×720 — стандартний HD",
          },
        },
        {
          id: "b",
          label: {
            en: "The viewport size scaled to fit 800×800 — Playwright scales the viewport to fit within 800×800 pixels",
            uk: "Розмір viewport масштабований до 800×800 — Playwright масштабує viewport щоб вміститися в 800×800 пікселів",
          },
        },
        {
          id: "c",
          label: {
            en: "The exact viewport size — 1280×720 if using the default Playwright viewport",
            uk: "Точний розмір viewport — 1280×720 при використанні стандартного viewport Playwright",
          },
        },
        {
          id: "d",
          label: {
            en: "480×360 — optimized for small file sizes",
            uk: "480×360 — оптимізовано для маленьких файлів",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "By default, Playwright scales the viewport to fit within 800×800 pixels while maintaining aspect ratio. If your viewport is 1280×720, the video will be 800×450. To record at a specific resolution, set `video: { mode: 'retain-on-failure', size: { width: 1280, height: 720 } }`. Larger videos are clearer for debugging but take more disk space and CI artifact storage. The 800×800 default is a balance between clarity and file size.",
        uk: "За замовчуванням Playwright масштабує viewport щоб вміститися в 800×800 пікселів зберігаючи пропорції. Якщо viewport 1280×720 — відео буде 800×450. Щоб записати з конкретною роздільною здатністю: встанови `video: { mode: 'retain-on-failure', size: { width: 1280, height: 720 } }`. Більші відео чіткіші для дебагу але займають більше місця на диску і в зберіганні CI-артефактів. За замовчуванням 800×800 — баланс між чіткістю і розміром файлу.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to share a recorded test failure with a non-technical stakeholder who doesn't use Playwright. What's the easiest way to show them what went wrong?",
        uk: "Хочеш поділитися записаним падінням тесту з нетехнічним стейкхолдером що не використовує Playwright. Який найпростіший спосіб показати що пішло не так?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "Share the trace.zip file — it contains a visual trace they can explore",
            uk: "Поділись файлом trace.zip — він містить візуальний трейс який вони можуть дослідити",
          },
        },
        {
          id: "b",
          label: {
            en: "Share the video file (video.webm or MP4) — it plays in any browser or media player and shows exactly what the browser did during the test",
            uk: "Поділись файлом відео (video.webm або MP4) — відтворюється в будь-якому браузері або медіаплеєрі і показує точно що браузер робив під час тесту",
          },
        },
        {
          id: "c",
          label: {
            en: "Export screenshots from the HTML report as a slideshow",
            uk: "Експортуй скриншоти з HTML-звіту як слайдшоу",
          },
        },
        {
          id: "d",
          label: {
            en: "Give them access to the HTML report — it's self-contained and easy to navigate",
            uk: "Надай доступ до HTML-звіту — він самодостатній і простий для навігації",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "A video file is universally accessible — `.webm` plays in any modern browser, and the recording is a direct visual representation of what the browser did. Non-technical stakeholders can watch it like a screen recording and immediately see 'the button wasn't there' or 'the page loaded blank'. Trace files require the Playwright viewer and have a learning curve. HTML reports are self-contained but require a web server or local installation to open correctly. Video is the most shareable artifact.",
        uk: "Файл відео є загальнодоступним — `.webm` відтворюється в будь-якому сучасному браузері, і запис є прямим візуальним представленням того що робив браузер. Нетехнічні стейкхолдери можуть дивитися його як запис екрана і одразу бачити 'кнопка була відсутня' або 'сторінка завантажилася порожньою'. Файли трейсів вимагають переглядача Playwright і мають певну криву навчання. HTML-звіти самодостатні але вимагають веб-сервер або локальну установку для правильного відкриття. Відео — найбільш ділений артефакт.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Can video annotations (highlighting actions with outlines and test step names in the video) help with non-technical stakeholder reviews?",
        uk: "Чи можуть анотації відео (підсвічування дій з контурами і назвами кроків тесту у відео) допомогти при перегляді нетехнічними стейкхолдерами?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "No — annotations are only for developer debugging",
            uk: "Ні — анотації призначені лише для дебагу розробників",
          },
        },
        {
          id: "b",
          label: {
            en: "Yes — annotations add visual callouts for each action and can display test step names, making it clear what the test was doing at each point in the video",
            uk: "Так — анотації додають візуальні позначки для кожної дії і можуть відображати назви кроків тесту, роблячи зрозумілим що тест робив у кожній точці відео",
          },
        },
        {
          id: "c",
          label: {
            en: "Only if you use test.step() — without steps, annotations don't add context",
            uk: "Лише якщо використовуєш test.step() — без кроків анотації не додають контексту",
          },
        },
        {
          id: "d",
          label: {
            en: "Annotations are not a Playwright feature — you'd need a separate video editing tool",
            uk: "Анотації — не функція Playwright, потрібен окремий інструмент відеоредагування",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's video annotation feature (configured in `use.video.show`) adds real-time callouts to the recorded video: outlines around clicked elements, text labels showing what action occurred (and with `level: 'step'`, the test step names). For non-technical reviews — demos to product managers or QA stakeholders — annotated videos make it obvious what the automated test was doing without requiring knowledge of test code. Configure with `show: { actions: { duration: 500, position: 'top-right' }, test: { level: 'step', position: 'top-left' } }`.",
        uk: "Функція анотацій відео Playwright (налаштована в `use.video.show`) додає позначки в реальному часі до записаного відео: контури навколо елементів що клікаються, текстові підписи що показують яка дія відбулася (і з `level: 'step'` — назви кроків тесту). Для нетехнічних переглядів — демо для product manager-ів або QA-стейкхолдерів — анотовані відео роблять очевидним що робив автоматизований тест без знання коду тестів. Налаштуй з `show: { actions: { duration: 500, position: 'top-right' }, test: { level: 'step', position: 'top-left' } }`.",
      },
    },
  ],
}
