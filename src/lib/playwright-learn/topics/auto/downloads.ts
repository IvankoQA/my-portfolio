import type { PlaywrightTopic } from "../../types"

export const downloadsTopic: PlaywrightTopic = {
  slug: "downloads",
  groupId: "guides",
  order: 180,
  level: "intermediate",
  trackOrder: 21,
  sourceDoc: "downloads.md",
  officialDocsUrl: "https://playwright.dev/docs/downloads",
  title: {
    en: "Downloads",
    uk: "Завантаження файлів",
  },
  summary: {
    en: "If your app has an Export CSV button, you need to test that the file actually downloads and contains the right data. Playwright intercepts downloads before they hit the filesystem.",
    uk: "Якщо в застосунку є кнопка Export CSV — треба перевірити що файл справді завантажується і містить правильні дані. Playwright перехоплює завантаження до того як вони потрапляють у файлову систему.",
  },
  sections: [
    {
      id: "basic-download",
      title: {
        en: "Intercept and verify a download",
        uk: "Перехоплення і перевірка завантаження",
      },
      paragraphs: [
        {
          en: "The pattern is the same as `waitForResponse` — set up the promise BEFORE the click, then await it after. If you click first and then call `waitForEvent('download')`, the download event may fire before you start listening and you'll miss it.",
          uk: "Паттерн такий самий як і `waitForResponse` — встановлюй проміс ДО кліку, потім очікуй після. Якщо клікнути спочатку і потім викликати `waitForEvent('download')` — подія завантаження може спрацювати до того як ти почав слухати і ти її пропустиш.",
        },
        {
          en: "The `Download` object gives you the filename, a path to the temp file, and methods to save it or read its content.",
          uk: "Об'єкт `Download` дає ім'я файлу, шлях до тимчасового файлу і методи щоб зберегти його або прочитати вміст.",
        },
      ],
      codeBlocks: [
        {
          id: "basic-download",
          language: "ts",
          code: `test('export orders as CSV', async ({ page }) => {
  await page.goto('/orders')

  // Встановлюємо очікування ДО кліку
  const downloadPromise = page.waitForEvent('download')

  await page.getByRole('button', { name: 'Export CSV' }).click()

  // Чекаємо завантаження
  const download = await downloadPromise

  // Перевіряємо ім'я файлу
  expect(download.suggestedFilename()).toMatch(/orders-\d{4}-\d{2}-\d{2}\.csv/)

  // Зберегти куди треба
  await download.saveAs('/tmp/test-export.csv')
})`,
        },
      ],
    },
    {
      id: "verify-content",
      title: {
        en: "Read the downloaded file content",
        uk: "Читання вмісту завантаженого файлу",
      },
      paragraphs: [
        {
          en: "After intercepting the download, you can read the file content to assert on what's actually inside. `download.path()` returns the path to the temp file Playwright saved. Then use Node.js `fs` to read it.",
          uk: "Після перехоплення завантаження можна прочитати вміст файлу щоб перевірити що всередині. `download.path()` повертає шлях до тимчасового файлу збереженого Playwright. Далі використовуй Node.js `fs` щоб прочитати.",
        },
      ],
      codeBlocks: [
        {
          id: "read-content",
          language: "ts",
          code: `import fs from 'fs'

test('exported CSV contains correct order data', async ({ page }) => {
  await page.goto('/orders')

  // Фільтруємо по статусу перед експортом
  await page.getByRole('combobox', { name: 'Status' }).selectOption('pending')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export CSV' }).click()
  const download = await downloadPromise

  // Читаємо вміст
  const filePath = await download.path()
  const content = fs.readFileSync(filePath!, 'utf-8')

  // Перевіряємо структуру CSV
  const lines = content.split('\\n')
  expect(lines[0]).toContain('Order ID,Customer,Status,Total')

  // Всі рядки мають статус pending
  for (const line of lines.slice(1).filter(Boolean)) {
    expect(line).toContain('pending')
  }
})`,
        },
      ],
    },
    {
      id: "multiple-downloads",
      title: {
        en: "Handle multiple downloads",
        uk: "Кілька завантажень",
      },
      paragraphs: [
        {
          en: "If one action triggers multiple downloads (a zip archive plus a manifest, for example), or if downloads happen at unpredictable moments, use the event listener pattern instead of `waitForEvent`.",
          uk: "Якщо одна дія запускає кілька завантажень (zip архів плюс маніфест, наприклад), або якщо завантаження відбуваються в непередбачуваний момент — використовуй слухач події замість `waitForEvent`.",
        },
      ],
      codeBlocks: [
        {
          id: "multiple-downloads",
          language: "ts",
          code: `test('bulk export downloads all files', async ({ page }) => {
  await page.goto('/reports')

  const downloads: string[] = []
  page.on('download', async download => {
    downloads.push(download.suggestedFilename())
  })

  await page.getByRole('button', { name: 'Export all reports' }).click()

  // Чекаємо поки завантаження завершаться
  await expect.poll(() => downloads.length, { timeout: 10000 }).toBe(3)

  expect(downloads).toContain('orders.csv')
  expect(downloads).toContain('customers.csv')
  expect(downloads).toContain('summary.pdf')
})`,
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "You set up page.waitForEvent('download') AFTER clicking the Export button. The test hangs indefinitely. Why?",
        uk: "Ти встановив page.waitForEvent('download') ПІСЛЯ кліку Export. Тест зависає назавжди. Чому?",
      },
      options: [
        { id: "a", label: { en: "The download event requires a specific timeout to be set.", uk: "Для події download потрібно задати конкретний timeout." } },
        { id: "b", label: { en: "The download event fired before waitForEvent() started listening — the event was missed.", uk: "Подія download спрацювала до того як waitForEvent() почав слухати — подія пропущена." } },
        { id: "c", label: { en: "`page.waitForEvent` is not the right method for downloads.", uk: "`page.waitForEvent` не є правильним методом для завантажень." } },
        { id: "d", label: { en: "You need to disable the browser's built-in download prompt first.", uk: "Спочатку потрібно вимкнути вбудований download prompt браузера." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "If the click triggers an immediate download, the 'download' event fires before `waitForEvent()` registers its listener. The listener was too late and never sees the event. Fix: create the promise first (no await), then click, then await the promise.",
        uk: "Якщо клік запускає миттєве завантаження, подія 'download' спрацьовує до того як `waitForEvent()` реєструє слухача. Слухач запізнився і ніколи не побачить подію. Виправлення: спочатку створи проміс (без await), потім клікни, потім очікуй проміс.",
      },
    },
    {
      id: "q2",
      prompt: {
        en: "Which method on the Download object returns the filename suggested by the server?",
        uk: "Який метод об'єкта Download повертає ім'я файлу, запропоноване сервером?",
      },
      options: [
        { id: "a", label: { en: "`download.fileName()`", uk: "`download.fileName()`" } },
        { id: "b", label: { en: "`download.suggestedFilename()`", uk: "`download.suggestedFilename()`" } },
        { id: "c", label: { en: "`download.name()`", uk: "`download.name()`" } },
        { id: "d", label: { en: "`download.path()` — it includes the filename.", uk: "`download.path()` — він включає ім'я файлу." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`download.suggestedFilename()` returns the filename from the `Content-Disposition` header (or derived from the URL). `download.path()` returns the path to the temporary file Playwright saved — it's a system temp path, not the user-visible name. There is no `.fileName()` or `.name()` method.",
        uk: "`download.suggestedFilename()` повертає ім'я файлу з заголовка `Content-Disposition` (або отримане з URL). `download.path()` повертає шлях до тимчасового файлу збереженого Playwright — це системний temp-шлях, а не видиме ім'я. Методів `.fileName()` або `.name()` не існує.",
      },
    },
    {
      id: "q3",
      prompt: {
        en: "What is the correct pattern to intercept a download triggered by a button click?",
        uk: "Який правильний патерн для перехоплення завантаження запущеного кліком кнопки?",
      },
      options: [
        { id: "a", label: { en: "Click the button, then call `await page.waitForEvent('download')`.", uk: "Клікнути кнопку, потім викликати `await page.waitForEvent('download')`." } },
        { id: "b", label: { en: "Call `const dl = page.waitForEvent('download')` (no await), click the button, then `const download = await dl`.", uk: "Викликати `const dl = page.waitForEvent('download')` (без await), клікнути кнопку, потім `const download = await dl`." } },
        { id: "c", label: { en: "Use `page.on('download', handler)` after the click.", uk: "Використати `page.on('download', handler)` після кліку." } },
        { id: "d", label: { en: "Use `context.waitForEvent('download')` instead of `page.waitForEvent`.", uk: "Використати `context.waitForEvent('download')` замість `page.waitForEvent`." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The pattern is: set up the promise without awaiting it, perform the action, then await the promise. This ensures the listener is registered before the click so the event can't be missed even if the download starts immediately.",
        uk: "Патерн такий: встанови обіцянку без await, виконай дію, потім очікуй обіцянку. Це гарантує що слухач зареєстровано до кліку і подія не може бути пропущена навіть якщо завантаження починається миттєво.",
      },
    },
    {
      id: "q4",
      prompt: {
        en: "How do you read the content of an intercepted download file in a test?",
        uk: "Як прочитати вміст перехопленого файлу завантаження в тесті?",
      },
      options: [
        { id: "a", label: { en: "`const content = await download.text()`", uk: "`const content = await download.text()`" } },
        { id: "b", label: { en: "`const content = download.read('utf-8')`", uk: "`const content = download.read('utf-8')`" } },
        { id: "c", label: { en: "`const filePath = await download.path(); const content = fs.readFileSync(filePath, 'utf-8')`", uk: "`const filePath = await download.path(); const content = fs.readFileSync(filePath, 'utf-8')`" } },
        { id: "d", label: { en: "`const content = await download.body()`", uk: "`const content = await download.body()`" } },
      ],
      correctOptionId: "c",
      rationale: {
        en: "`download.path()` returns the path to the temporary file Playwright saved during the download. You then use Node.js `fs` to read the file content. There is no `.text()`, `.read()`, or `.body()` method on the `Download` object.",
        uk: "`download.path()` повертає шлях до тимчасового файлу збереженого Playwright під час завантаження. Потім використовуєш Node.js `fs` щоб прочитати вміст файлу. Методів `.text()`, `.read()` або `.body()` на об'єкті `Download` немає.",
      },
    },
    {
      id: "q5",
      prompt: {
        en: "One button click triggers three file downloads simultaneously. What is the best way to collect all three?",
        uk: "Один клік кнопки запускає три файлові завантаження одночасно. Який найкращий спосіб зібрати всі три?",
      },
      options: [
        { id: "a", label: { en: "Call `page.waitForEvent('download')` three times sequentially.", uk: "Викликати `page.waitForEvent('download')` тричі послідовно." } },
        { id: "b", label: { en: "Use `page.on('download', handler)` to collect downloads as they arrive, then poll until you have all three.", uk: "Використати `page.on('download', handler)` для збору завантажень по мірі надходження, потім опитувати до отримання всіх трьох." } },
        { id: "c", label: { en: "Use `context.waitForEvent('download')` which returns an array.", uk: "Використати `context.waitForEvent('download')` який повертає масив." } },
        { id: "d", label: { en: "Multiple downloads are not supported — you must test each one in a separate test.", uk: "Кілька завантажень не підтримуються — потрібно тестувати кожне в окремому тесті." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "When multiple downloads happen at unpredictable moments, use the event listener pattern: `page.on('download', d => downloads.push(d.suggestedFilename()))`. Then use `expect.poll(() => downloads.length).toBe(3)` to wait until all three arrive. Calling `waitForEvent` three times sequentially works only if downloads arrive in a predictable order.",
        uk: "Коли кілька завантажень відбуваються в непередбачуваний момент, використовуй патерн слухача подій: `page.on('download', d => downloads.push(d.suggestedFilename()))`. Потім `expect.poll(() => downloads.length).toBe(3)` щоб дочекатися всіх трьох. Виклик `waitForEvent` тричі послідовно працює лише якщо завантаження надходять в передбачуваному порядку.",
      },
    },
    {
      id: "q6",
      prompt: {
        en: "How do you permanently save an intercepted download to a specific path on disk?",
        uk: "Як постійно зберегти перехоплене завантаження за конкретним шляхом на диску?",
      },
      options: [
        { id: "a", label: { en: "`await download.saveAs('/desired/path/file.csv')`", uk: "`await download.saveAs('/desired/path/file.csv')`" } },
        { id: "b", label: { en: "`fs.copyFileSync(await download.path(), '/desired/path/file.csv')`", uk: "`fs.copyFileSync(await download.path(), '/desired/path/file.csv')`" } },
        { id: "c", label: { en: "`await download.moveTo('/desired/path/file.csv')`", uk: "`await download.moveTo('/desired/path/file.csv')`" } },
        { id: "d", label: { en: "Configure `downloadsPath` in `playwright.config.ts` — files go there automatically.", uk: "Налаштувати `downloadsPath` в `playwright.config.ts` — файли туди автоматично зберігаються." } },
      ],
      correctOptionId: "a",
      rationale: {
        en: "`download.saveAs(path)` copies the temporary download file to the specified path. The temporary file is automatically cleaned up when the browser context closes. There is no `.moveTo()` method. `downloadsPath` in config changes where temp files land, not where you save them per-test.",
        uk: "`download.saveAs(path)` копіює тимчасовий файл завантаження за вказаним шляхом. Тимчасовий файл автоматично видаляється при закритті browser context. Методу `.moveTo()` немає. `downloadsPath` в конфігу змінює місце тимчасових файлів, а не де ти їх зберігаєш в кожному тесті.",
      },
    },
    {
      id: "q7",
      prompt: {
        en: "You want to verify that a downloaded CSV has a header row containing 'Order ID,Customer,Status,Total'. What approach works?",
        uk: "Хочеш перевірити що завантажений CSV має рядок заголовку що містить 'Order ID,Customer,Status,Total'. Який підхід працює?",
      },
      options: [
        { id: "a", label: { en: "Use `expect(download).toContainText('Order ID')`.", uk: "Використати `expect(download).toContainText('Order ID')`." } },
        { id: "b", label: { en: "Read the file with `fs.readFileSync(await download.path(), 'utf-8')`, split by newline, and assert on the first line.", uk: "Прочитати файл через `fs.readFileSync(await download.path(), 'utf-8')`, розділити по новому рядку і перевірити перший рядок." } },
        { id: "c", label: { en: "Use `download.matches('Order ID,Customer,Status,Total')`.", uk: "Використати `download.matches('Order ID,Customer,Status,Total')`." } },
        { id: "d", label: { en: "The Download object exposes `.headers()` which includes the CSV header.", uk: "Об'єкт Download має `.headers()` що включає заголовок CSV." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "The `Download` object has no text-assertion methods. You use `download.path()` to get the temp file path, read it with Node.js `fs`, split the string into lines, and assert on `lines[0]`. This is standard Node.js file I/O combined with Playwright's download interception.",
        uk: "Об'єкт `Download` не має методів текстової перевірки. Використовуєш `download.path()` щоб отримати шлях тимчасового файлу, читаєш через Node.js `fs`, ділиш рядок на рядки і перевіряєш `lines[0]`. Це стандартний Node.js file I/O в поєднанні з перехопленням завантажень Playwright.",
      },
    },
    {
      id: "q8",
      prompt: {
        en: "Why is the `page.waitForEvent('download')` pattern safer than `page.on('download', handler)` for a single expected download?",
        uk: "Чому патерн `page.waitForEvent('download')` безпечніший ніж `page.on('download', handler)` для одного очікуваного завантаження?",
      },
      options: [
        { id: "a", label: { en: "`page.on()` only works for multiple downloads.", uk: "`page.on()` працює лише для кількох завантажень." } },
        { id: "b", label: { en: "`waitForEvent` returns a Promise you can `await`, making the test linear and easy to read; `page.on` requires manual cleanup of the listener.", uk: "`waitForEvent` повертає Promise який можна `await`, роблячи тест лінійним і легким для читання; `page.on` вимагає ручного видалення слухача." } },
        { id: "c", label: { en: "`page.on` permanently blocks all future downloads.", uk: "`page.on` назавжди блокує всі майбутні завантаження." } },
        { id: "d", label: { en: "They are identical — use either one.", uk: "Вони ідентичні — використовуй будь-який." } },
      ],
      correctOptionId: "b",
      rationale: {
        en: "`waitForEvent('download')` returns a Promise and naturally integrates with `async/await`, making the test flow read sequentially: set up → act → assert. `page.on()` requires managing listener lifecycle (add, collect, remove) and combining with `expect.poll()`. For a single download, `waitForEvent` is cleaner.",
        uk: "`waitForEvent('download')` повертає Promise і природно інтегрується з `async/await`, роблячи флоу тесту послідовним: налаштування → дія → перевірка. `page.on()` вимагає управління lifecycle слухача (додати, зібрати, видалити) і комбінування з `expect.poll()`. Для одного завантаження `waitForEvent` чистіший.",
      },
    },
  ],
}
