import type { PlaywrightTopic } from "../../types"

export const testTypescriptTopic: PlaywrightTopic = {
  slug: "test-typescript",
  groupId: "test-runner",
  order: 385,
  level: "advanced",
  trackOrder: 4,
  sourceDoc: "test-typescript-js.md",
  officialDocsUrl: "https://playwright.dev/docs/test-typescript",
  title: {
    en: "TypeScript",
    uk: "TypeScript",
  },
  summary: {
    en: "Playwright supports TypeScript out of the box. You just write tests in TypeScript, and Playwright will read them, transform to JavaScript and run.",
    uk: "Playwright підтримує TypeScript «з коробки». Ви просто пишете тести на TypeScript, а Playwright читає їх, перетворює на JavaScript і запускає.",
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
          en: "Playwright supports TypeScript out of the box. You just write tests in TypeScript, and Playwright will read them, transform to JavaScript and run.",
          uk: "Playwright підтримує TypeScript «з коробки». Ви просто пишете тести на TypeScript, а Playwright читає їх, перетворює на JavaScript і запускає.",
        },
        {
          en: "Note that Playwright does not check the types and will run tests even if there are non-critical TypeScript compilation errors. We recommend you run TypeScript compiler alongside Playwright. For example on GitHub actions:",
          uk: "Зауважте: Playwright не перевіряє типи й запустить тести навіть за наявності некритичних помилок компіляції TypeScript. Рекомендуємо запускати компілятор TypeScript паралельно з Playwright. Наприклад, у GitHub Actions:",
        },
        {
          en: "For local development, you can run `tsc` in [watch](https://www.typescriptlang.org/docs/handbook/configuring-watch.html) mode like this:",
          uk: "Для локальної розробки можна запускати `tsc` у режимі [watch](https://www.typescriptlang.org/docs/handbook/configuring-watch.html) ось так:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "yaml",
          code: "jobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n    ...\n    - name: Run type checks\n      run: npx tsc -p tsconfig.json --noEmit\n    - name: Run Playwright tests\n      run: npx playwright test",
        },
        {
          id: "cb-2",
          language: "sh",
          code: "npx tsc -p tsconfig.json --noEmit -w",
        },
      ],
    },
    {
      id: "tsconfig-json",
      title: {
        en: "tsconfig.json",
        uk: "tsconfig.json",
      },
      paragraphs: [
        {
          en: "Playwright will pick up `tsconfig.json` for each source file it loads. Note that Playwright **only supports** the following tsconfig options: `allowJs`, `baseUrl`, `paths` and `references`.",
          uk: "Playwright підхоплює `tsconfig.json` для кожного завантаженого вихідного файлу. Зауважте: Playwright **підтримує лише** такі опції tsconfig: `allowJs`, `baseUrl`, `paths` і `references`.",
        },
        {
          en: "We recommend setting up a separate `tsconfig.json` in the tests directory so that you can change some preferences specifically for the tests. Here is an example directory structure.",
          uk: "Рекомендуємо окремий `tsconfig.json` у каталозі тестів, щоб можна було змінювати налаштування саме для тестів. Нижче — приклад структури каталогів.",
        },
        {
          en: "### tsconfig path mapping",
          uk: "### Зіставлення шляхів у tsconfig",
        },
        {
          en: "Playwright supports [path mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping) declared in the `tsconfig.json`.",
          uk: "Playwright підтримує [зіставлення шляхів (path mapping)](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping), оголошене в `tsconfig.json`.",
        },
        {
          en: "Here is an example `tsconfig.json` that works with Playwright:",
          uk: "Ось приклад `tsconfig.json`, який працює з Playwright:",
        },
        {
          en: "You can now import using the mapped paths:",
          uk: "Тепер можна імпортувати за зіставленими шляхами:",
        },
        {
          en: "### tsconfig resolution",
          uk: "### Вибір tsconfig",
        },
        {
          en: "By default, Playwright will look up a closest tsconfig for each imported file by going up the directory structure and looking for `tsconfig.json` or `jsconfig.json`. This way, you can create a `tests/tsconfig.json` file that will be used only for your tests and Playwright will pick it up automatically.",
          uk: "За замовчуванням Playwright для кожного імпортованого файлу шукає найближчий tsconfig, піднімаючись ієрархією каталогів і шукаючи `tsconfig.json` або `jsconfig.json`. Так можна створити `tests/tsconfig.json`, який використовуватиметься лише для тестів, і Playwright підхопить його автоматично.",
        },
        {
          en: "Alternatively, you can specify a single tsconfig file to use in the command line, and Playwright will use it for all imported files, not only test files.",
          uk: "Або можна вказати один файл tsconfig у командному рядку — тоді Playwright застосує його до всіх імпортованих файлів, не лише до тестів.",
        },
        {
          en: "You can specify a single tsconfig file in the config file, that will be used for loading test files, reporters, etc. However, it will not be used while loading the playwright config itself or any files imported from it.",
          uk: "Один файл tsconfig можна вказати в конфігураційному файлі — він використовуватиметься для завантаження тестових файлів, репортерів тощо. Водночас він не застосовується під час завантаження самого playwright config і файлів, які з нього імпортуються.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-3",
          language: "txt",
          code: "src/\n    source.ts\n\ntests/\n    tsconfig.json  # test-specific tsconfig\n    example.spec.ts\n\ntsconfig.json  # generic tsconfig for all typescript sources\n\nplaywright.config.ts",
        },
        {
          id: "cb-4",
          language: "json",
          code: '{\n  "compilerOptions": {\n    "paths": {\n      "@myhelper/*": ["packages/myhelper/*"] // This mapping is relative to the tsconfig.\n    }\n  }\n}',
        },
        {
          id: "cb-5",
          language: "js",
          code: "\ntest('example', async ({ page }) => {\n  await page.getByLabel('User Name').fill(username);\n  await page.getByLabel('Password').fill(password);\n});",
        },
        {
          id: "cb-6",
          language: "sh",
          code: "# Playwright will choose tsconfig automatically\nnpx playwright test",
        },
        {
          id: "cb-7",
          language: "sh",
          code: "# Pass a specific tsconfig\nnpx playwright test --tsconfig=tsconfig.test.json",
        },
        {
          id: "cb-8",
          language: "js",
          code: "\nexport default defineConfig({\n  tsconfig: './tsconfig.test.json',\n});",
        },
      ],
    },
    {
      id: "manually-compile-tests-with-typescript",
      title: {
        en: "Manually compile tests with TypeScript",
        uk: "Ручна компіляція тестів за допомогою TypeScript",
      },
      paragraphs: [
        {
          en: "Sometimes, Playwright Test will not be able to transform your TypeScript code correctly, for example when you are using experimental or very recent features of TypeScript, usually configured in `tsconfig.json`.",
          uk: "Іноді Playwright Test не зможе коректно перетворити ваш код TypeScript, наприклад якщо ви використовуєте експериментальні або дуже нові можливості TypeScript, зазвичай налаштовані в `tsconfig.json`.",
        },
        {
          en: "In this case, you can perform your own TypeScript compilation before sending the tests to Playwright.",
          uk: "У такому разі можна самостійно скомпілювати TypeScript перед передачею тестів у Playwright.",
        },
        {
          en: "First add a `tsconfig.json` file inside the tests directory:",
          uk: "Спочатку додайте файл `tsconfig.json` у каталозі тестів:",
        },
        {
          en: "In `package.json`, add two scripts:",
          uk: "У `package.json` додайте два скрипти:",
        },
        {
          en: "The `pretest` script runs typescript on the tests. `test` will run the tests that have been generated to the `tests-out` directory. The `-c` argument configures the test runner to look for tests inside the `tests-out` directory.",
          uk: "Скрипт `pretest` запускає TypeScript для тестів. Скрипт `test` запускає тести, згенеровані в каталог `tests-out`. Аргумент `-c` налаштовує раннер шукати тести в каталозі `tests-out`.",
        },
        {
          en: "Then `npm run test` will build the tests and run them.",
          uk: "Тоді `npm run test` збере тести й запустить їх.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-9",
          language: "json",
          code: '{\n    "compilerOptions": {\n        "target": "ESNext",\n        "module": "commonjs",\n        "moduleResolution": "Node",\n        "sourceMap": true,\n        "outDir": "../tests-out",\n    }\n}',
        },
        {
          id: "cb-10",
          language: "json",
          code: '{\n  "scripts": {\n    "pretest": "tsc --incremental -p tests/tsconfig.json",\n    "test": "playwright test -c tests-out"\n  }\n}',
        },
      ],
    },
  ],
  quiz: [],
}
