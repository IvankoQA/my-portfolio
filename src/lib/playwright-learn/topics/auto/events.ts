import type { PlaywrightTopic } from "../../types"

export const eventsTopic: PlaywrightTopic = {
  slug: "events",
  groupId: "guides",
  order: 195,
  sourceDoc: "events.md",
  officialDocsUrl: "https://playwright.dev/docs/events",
  title: {
    en: "Events",
    uk: "Події",
  },
  summary: {
    en: "Playwright allows listening to various types of events happening on the web page, such as network requests, creation of child pages, dedicated workers etc. There are several ways to subscribe to such events, such as waiting for events or adding or removing event listeners.",
    uk: "Playwright дозволяє підписуватися на різні події на сторінці: мережеві запити, відкриття дочірніх сторінок, виділені воркери тощо. Підписатися можна кількома способами: очікувати подію або додавати й знімати обробники.",
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
          en: "Playwright allows listening to various types of events happening on the web page, such as network requests, creation of child pages, dedicated workers etc. There are several ways to subscribe to such events, such as waiting for events or adding or removing event listeners.",
          uk: "Playwright дозволяє підписуватися на різні події на сторінці: мережеві запити, відкриття дочірніх сторінок, виділені воркери тощо. Підписатися можна кількома способами: очікувати подію або додавати й знімати обробники.",
        },
      ],
    },
    {
      id: "waiting-for-event",
      title: {
        en: "Waiting for event",
        uk: "Очікування події",
      },
      paragraphs: [
        {
          en: "Most of the time, scripts will need to wait for a particular event to happen. Below are some of the typical event awaiting patterns.",
          uk: "Зазвичай сценарію потрібно дочекатися певної події. Нижче — типові шаблони очікування.",
        },
        {
          en: "Wait for a request with the specified url using [`method: Page.waitForRequest`]:",
          uk: "Очікування запиту з заданою URL за допомогою [`method: Page.waitForRequest`]:",
        },
        {
          en: "Wait for popup window:",
          uk: "Очікування спливаючого вікна:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "// Start waiting for request before goto. Note no await.\nconst requestPromise = page.waitForRequest('**/*logo*.png');\nawait page.goto('https://wikipedia.org');\nconst request = await requestPromise;\nconsole.log(request.url());",
        },
        {
          id: "cb-6",
          language: "js",
          code: "// Start waiting for popup before clicking. Note no await.\nconst popupPromise = page.waitForEvent('popup');\nawait page.getByText('open the popup').click();\nconst popup = await popupPromise;\nawait popup.goto('https://wikipedia.org');",
        },
      ],
    },
    {
      id: "adding-removing-event-listener",
      title: {
        en: "Adding/removing event listener",
        uk: "Додавання та зняття обробника подій",
      },
      paragraphs: [
        {
          en: "Sometimes, events happen in random time and instead of waiting for them, they need to be handled. Playwright supports traditional language mechanisms for subscribing and unsubscribing from the events:",
          uk: "Іноді події виникають у довільний момент і їх треба обробляти, а не лише чекати. Playwright підтримує звичні для мови механізми підписки й відписки:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "page.on('request', request => console.log(`Request sent: ${request.url()}`));\nconst listener = request => console.log(`Request finished: ${request.url()}`);\npage.on('requestfinished', listener);\nawait page.goto('https://wikipedia.org');\n\npage.off('requestfinished', listener);\nawait page.goto('https://www.openstreetmap.org/');",
        },
      ],
    },
    {
      id: "adding-one-off-listeners",
      title: {
        en: "Adding one-off listeners",
        uk: "Одноразові обробники",
      },
      paragraphs: [
        {
          en: "If a certain event needs to be handled once, there is a convenience API for that:",
          uk: "Якщо подію потрібно обробити лише один раз, є зручний API:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-16",
          language: "js",
          code: "page.once('dialog', dialog => dialog.accept('2021'));\nawait page.evaluate(\"prompt('Enter a number:')\");",
        },
      ],
    },
  ],
  quiz: [],
}
