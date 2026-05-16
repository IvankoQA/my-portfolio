import type { PlaywrightTopic } from "../../types"

export const languagesTopic: PlaywrightTopic = {
  slug: "languages",
  groupId: "guides",
  order: 235,
  level: "advanced",
  trackOrder: 11,
  sourceDoc: "languages.md",
  officialDocsUrl: "https://playwright.dev/docs/languages",
  title: {
    en: "Supported languages",
    uk: "Підтримувані мови",
  },
  summary: {
    en: "Playwright's browser automation API is the same across all languages — the same page.click(), page.fill(), page.waitForURL(). What differs is the testing ecosystem wrapper around it. I work in JavaScript/TypeScript and the @playwright/test runner is the best-integrated option there. Python with pytest-playwright is the strongest choice for Python projects.",
    uk: "API автоматизації браузера Playwright однаковий у всіх мовах — той самий page.click(), page.fill(), page.waitForURL(). Відрізняється обгортка тестової екосистеми навколо нього. Я працюю на JavaScript/TypeScript і раннер @playwright/test — найкраще інтегрований варіант там. Python з pytest-playwright — найсильніший вибір для Python-проєктів.",
  },
  sections: [
    {
      id: "language-choice",
      title: {
        en: "How to choose a language",
        uk: "Як вибрати мову",
      },
      paragraphs: [
        {
          en: "The browser API itself is the same regardless of which language you pick — the same actions, the same locators, the same assertions. What differs is the test runner, fixture system, and how well it integrates with the rest of your stack. Pick the language your team already knows best.",
          uk: "Сам браузерний API однаковий незалежно від мови яку вибереш — ті самі дії, ті самі локатори, ті самі assertions. Відрізняється тестовий раннер, система фікстур і наскільки добре він інтегрується з рештою стека. Вибирай мову яку твоя команда вже знає найкраще.",
        },
      ],
    },
    {
      id: "javascript-and-typescript",
      title: {
        en: "JavaScript and TypeScript",
        uk: "JavaScript і TypeScript",
      },
      paragraphs: [
        {
          en: "This is what I use. `@playwright/test` is the official test runner — it handles parallelization, fixtures, retries, HTML reports, traces, and screenshot assertions out of the box. TypeScript works without any build step (Playwright transpiles it automatically). The VS Code extension and UI mode are best-supported here.",
          uk: "Це те що я використовую. `@playwright/test` — офіційний тестовий раннер: паралелізація, фікстури, повтори, HTML-звіти, трейси і screenshot assertions з коробки. TypeScript працює без кроку збірки (Playwright транспілює автоматично). Розширення VS Code і UI mode найкраще підтримуються тут.",
        },
        {
          en: "- [Documentation](https://playwright.dev/docs/intro)\n- [GitHub repo](https://github.com/microsoft/playwright)",
          uk: "- [Документація](https://playwright.dev/docs/intro)\n- [Репозиторій на GitHub](https://github.com/microsoft/playwright)",
        },
      ],
    },
    {
      id: "python",
      title: {
        en: "Python",
        uk: "Python",
      },
      paragraphs: [
        {
          en: "The recommended option is `pytest-playwright` — a pytest plugin that provides fixtures (`page`, `browser`, `context`) and handles browser lifecycle automatically. Same pattern as `@playwright/test` but in Python. Good choice if the team has existing pytest test infrastructure.",
          uk: "Рекомендований варіант — `pytest-playwright`: pytest-плагін що надає фікстури (`page`, `browser`, `context`) і автоматично керує lifecycle браузера. Той самий патерн що `@playwright/test` але на Python. Хороший вибір якщо команда має існуючу pytest-тестову інфраструктуру.",
        },
        {
          en: "- [Documentation](https://playwright.dev/python/docs/intro)\n- [GitHub repo](https://github.com/microsoft/playwright-python)",
          uk: "- [Документація](https://playwright.dev/python/docs/intro)\n- [Репозиторій на GitHub](https://github.com/microsoft/playwright-python)",
        },
      ],
    },
    {
      id: "java",
      title: {
        en: "Java",
        uk: "Java",
      },
      paragraphs: [
        {
          en: "Works with JUnit or TestNG. The Java bindings don't have a dedicated test runner like `@playwright/test` — you pick the framework based on what your team already uses. The browser API is the same, but setup (launching browser, creating context) is more explicit.",
          uk: "Працює з JUnit або TestNG. Java-біндінги не мають спеціального тестового раннера як `@playwright/test` — вибираєш фреймворк виходячи з того що команда вже використовує. Браузерний API той самий, але налаштування (запуск браузера, створення context) більш явне.",
        },
        {
          en: "- [Documentation](https://playwright.dev/java/docs/intro)\n- [GitHub repo](https://github.com/microsoft/playwright-java)",
          uk: "- [Документація](https://playwright.dev/java/docs/intro)\n- [Репозиторій на GitHub](https://github.com/microsoft/playwright-java)",
        },
      ],
    },
    {
      id: "net",
      title: {
        en: ".NET",
        uk: ".NET",
      },
      paragraphs: [
        {
          en: "Playwright for .NET comes with base classes for MSTest, NUnit, xUnit, and xUnit v3. The base classes provide page fixtures and browser management. Good choice for teams with existing .NET test suites — Playwright integrates directly into the same test framework.",
          uk: "Playwright для .NET постачає базові класи для MSTest, NUnit, xUnit і xUnit v3. Базові класи надають page-фікстури і керування браузером. Хороший вибір для команд з існуючими .NET тестовими наборами — Playwright інтегрується прямо в той самий тестовий фреймворк.",
        },
        {
          en: "- [Documentation](https://playwright.dev/dotnet/docs/intro)\n- [GitHub repo](https://github.com/microsoft/playwright-dotnet)",
          uk: "- [Документація](https://playwright.dev/dotnet/docs/intro)\n- [Репозиторій на GitHub](https://github.com/microsoft/playwright-dotnet)",
        },
      ],
    },
  ],
  quiz: [
    {
      id: "q1",
      prompt: {
        en: "Your team decides to write Playwright tests in Python instead of JavaScript. Will the locator strategies (getByRole, getByLabel, getByText) work the same way?",
        uk: "Твоя команда вирішує писати тести Playwright на Python замість JavaScript. Чи будуть стратегії локаторів (getByRole, getByLabel, getByText) працювати так само?",
      },
      options: [
        {
          id: "a",
          label: {
            en: "No — locators differ between languages since each has its own API",
            uk: "Ні — локатори відрізняються між мовами оскільки кожна має свій API",
          },
        },
        {
          id: "b",
          label: {
            en: "Yes — the browser automation API is the same across all Playwright language bindings, just with language-appropriate syntax conventions",
            uk: "Так — API автоматизації браузера однаковий у всіх мовних біндінгах Playwright, просто з синтаксичними конвенціями відповідної мови",
          },
        },
        {
          id: "c",
          label: {
            en: "Only getByRole works across languages — getByLabel and getByText are JavaScript-only",
            uk: "Тільки getByRole працює у всіх мовах — getByLabel і getByText тільки для JavaScript",
          },
        },
      ],
      correctOptionId: "b",
      rationale: {
        en: "Playwright's browser automation layer is implemented once in the browser communication protocol and exposed through bindings in each language. All four language bindings (JS/TS, Python, Java, .NET) expose the same locators: getByRole, getByLabel, getByText, getByTestId, etc. The naming convention may vary slightly (Python uses snake_case: `page.get_by_role()`), but the capabilities are identical. What differs between languages is the testing framework integration, not the browser API.",
        uk: "Шар автоматизації браузера Playwright реалізований один раз у протоколі браузерної комунікації і виставлений через біндінги в кожній мові. Всі чотири мовні біндінги (JS/TS, Python, Java, .NET) виставляють ті самі локатори: getByRole, getByLabel, getByText, getByTestId тощо. Конвенція іменування може дещо відрізнятися (Python використовує snake_case: `page.get_by_role()`), але можливості ідентичні. Між мовами відрізняється інтеграція з тестовим фреймворком, а не браузерний API.",
      },
    },
  ],
}
