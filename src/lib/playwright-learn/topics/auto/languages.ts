import type { PlaywrightTopic } from "../../types"

export const languagesTopic: PlaywrightTopic = {
  slug: "languages",
  groupId: "guides",
  order: 235,
  sourceDoc: "languages.md",
  officialDocsUrl: "https://playwright.dev/docs/languages",
  title: {
    en: "Supported languages",
    uk: "Підтримувані мови",
  },
  summary: {
    en: "Playwright is available in multiple languages that share the same underlying implementation. All core features for automating the browser are supported in all languages, while testing ecosystem integration is different. Pick the language based on your experience, familiarity with its testing ecosystem and your project constraints. For the best experience pick the test runner that we recommend for each language.",
    uk: "Playwright доступний кількома мовами з однаковою базовою реалізацією. Усі основні можливості автоматизації браузера підтримуються в кожній мові, але інтеграція з тестовою екосистемою відрізняється. Обирайте мову з огляду на досвід, знайомість з її тестовою екосистемою та обмеження проєкту. Для найкращого досвіду використовуйте рекомендований для мови тестовий раннер.",
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
          en: "Playwright is available in multiple languages that share the same underlying implementation. All core features for automating the browser are supported in all languages, while testing ecosystem integration is different. Pick the language based on your experience, familiarity with its testing ecosystem and your project constraints. For the best experience pick the test runner that we recommend for each language.",
          uk: "Playwright доступний кількома мовами з однаковою базовою реалізацією. Усі основні можливості автоматизації браузера підтримуються в кожній мові, але інтеграція з тестовою екосистемою відрізняється. Обирайте мову з огляду на досвід, знайомість з її тестовою екосистемою та обмеження проєкту. Для найкращого досвіду використовуйте рекомендований для мови тестовий раннер.",
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
          en: "Playwright for Node.js comes with its own [test runner](https://playwright.dev/docs/running-tests) that provides great parallelization mechanism, screenshot assertions, html reporter, automatic tracing etc.",
          uk: "Playwright для Node.js постачається з власним [тестовим раннером](https://playwright.dev/docs/running-tests): паралелізація, перевірки зі скриншотами, HTML-звіт, автоматичний trace тощо.",
        },
        {
          en: "* [Documentation](https://playwright.dev/docs/intro)\n* [GitHub repo](https://github.com/microsoft/playwright)",
          uk: "* [Документація](https://playwright.dev/docs/intro)\n* [Репозиторій на GitHub](https://github.com/microsoft/playwright)",
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
          en: "Playwright [Pytest plugin](https://playwright.dev/python/docs/test-runners) is the recommended way to run end-to-end tests. It provides context isolation, running it on multiple browser configurations and more out of the box.",
          uk: "Рекомендований спосіб запуску end-to-end тестів — [плагін Pytest для Playwright](https://playwright.dev/python/docs/test-runners): ізоляція контекстів, запуск на кількох конфігураціях браузера та інше «з коробки».",
        },
        {
          en: "* [Documentation](https://playwright.dev/python/docs/intro)\n* [GitHub repo](https://github.com/microsoft/playwright-python)",
          uk: "* [Документація](https://playwright.dev/python/docs/intro)\n* [Репозиторій на GitHub](https://github.com/microsoft/playwright-python)",
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
          en: "You can choose any testing framework such as JUnit or TestNG based on your project requirements.",
          uk: "Можна обрати будь-який тестовий фреймворк — JUnit, TestNG тощо — залежно від вимог проєкту.",
        },
        {
          en: "* [Documentation](https://playwright.dev/java/docs/intro)\n* [GitHub repo](https://github.com/microsoft/playwright-java)",
          uk: "* [Документація](https://playwright.dev/java/docs/intro)\n* [Репозиторій на GitHub](https://github.com/microsoft/playwright-java)",
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
          en: "Playwright for .NET comes with MSTest, NUnit, xUnit, and xUnit v3 [base classes](https://playwright.dev/dotnet/docs/test-runners) for writing end-to-end tests.",
          uk: "Playwright для .NET містить MSTest, NUnit, xUnit і xUnit v3 — [базові класи](https://playwright.dev/dotnet/docs/test-runners) для написання end-to-end тестів.",
        },
        {
          en: "* [Documentation](https://playwright.dev/dotnet/docs/intro)\n* [GitHub repo](https://github.com/microsoft/playwright-dotnet)",
          uk: "* [Документація](https://playwright.dev/dotnet/docs/intro)\n* [Репозиторій на GitHub](https://github.com/microsoft/playwright-dotnet)",
        },
      ],
    },
  ],
  quiz: [],
}
