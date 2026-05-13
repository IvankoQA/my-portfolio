import type { PlaywrightTopic } from "../../types"

export const navigationsTopic: PlaywrightTopic = {
  slug: "navigations",
  groupId: "guides",
  order: 260,
  sourceDoc: "navigations.md",
  officialDocsUrl: "https://playwright.dev/docs/navigations",
  title: {
    en: "Navigations",
    uk: "Навігація",
  },
  summary: {
    en: "Playwright can navigate to URLs and handle navigations caused by the page interactions.",
    uk: "Playwright може переходити за URL і обробляти навігацію, спричинену взаємодією зі сторінкою.",
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
          en: "Playwright can navigate to URLs and handle navigations caused by the page interactions.",
          uk: "Playwright може переходити за URL і обробляти навігацію, спричинену взаємодією зі сторінкою.",
        },
      ],
    },
    {
      id: "basic-navigation",
      title: {
        en: "Basic navigation",
        uk: "Базова навігація",
      },
      paragraphs: [
        {
          en: "Simplest form of a navigation is opening a URL:",
          uk: "Найпростіша навігація — відкрити URL:",
        },
        {
          en: "The code above loads the page and waits for the web page to fire the\n[load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) event.\nThe load event is fired when the whole page has loaded, including all dependent\nresources such as stylesheets, scripts, iframes, and images.",
          uk: "Код вище завантажує сторінку й чекає події\n[load](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event).\nВона виникає, коли завантажено всю сторінку, включно з залежними\nресурсами: стилі, скрипти, iframe, зображення.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "// Navigate the page\nawait page.goto('https://example.com');",
        },
      ],
    },
    {
      id: "when-is-the-page-loaded",
      title: {
        en: "When is the page loaded?",
        uk: "Коли сторінка «завантажена»?",
      },
      paragraphs: [
        {
          en: "Modern pages perform numerous activities after the `load` event was fired. They\nfetch data lazily, populate UI, load expensive resources, scripts and styles after\nthe `load` event was fired. There is no way to tell that the page is `loaded`,\nit depends on the page, framework, etc. So when can you start interacting with\nit?",
          uk: "Сучасні сторінки після `load` роблять багато чого: ліниво тягнуть дані,\nоновлюють UI, підвантажують важкі ресурси, скрипти й стилі після\n`load`. Універсального сигналу «сторінка готова» немає — це залежить від сторінки, фреймворку тощо.\nКоли ж можна взаємодіяти?",
        },
        {
          en: "In Playwright you can interact with the page at any moment. It will automatically\nwait for the target elements to become [actionable](./actionability.md).",
          uk: "У Playwright можна взаємодіяти зі сторінкою в будь-який момент: він автоматично\nчекає, поки цільові елементи стануть [придатними до дії](./actionability.md).",
        },
        {
          en: "For the scenario above, Playwright will wait for the text to become visible,\nwill wait for the rest of the actionability checks to pass for that element,\nand will click it.",
          uk: "У наведеному сценарії Playwright дочекається видимості тексту,\nрешти перевірок actionability для елемента\nі виконає клік.",
        },
        {
          en: "Playwright operates as a very fast user - the moment it sees the button, it\nclicks it. In the general case, you don't need to worry about whether all the\nresources loaded, etc.",
          uk: "Playwright діє як дуже швидкий користувач: побачив кнопку — одразу клік.\nЗазвичай не потрібно окремо турбуватися, чи завантажилися всі\nресурси тощо.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "// Navigate and click element\n// Click will auto-wait for the element\nawait page.goto('https://example.com');\nawait page.getByText('Example Domain').click();",
        },
      ],
    },
    {
      id: "hydration",
      title: {
        en: "Hydration",
        uk: "Гідратація",
      },
      paragraphs: [
        {
          en: "At some point in time, you'll stumble upon a use case where Playwright performs\nan action, but nothing seemingly happens. Or you enter some text into the input\nfield and it will disappear. The most probable reason behind that is a poor page\n[hydration](https://en.wikipedia.org/wiki/Hydration_(web_development)).",
          uk: "Інколи Playwright виконує дію, але ніби нічого не відбувається. Або введений у поле\nтекст зникає. Найімовірніша причина — проблемна\n[гідратація](https://en.wikipedia.org/wiki/Hydration_(web_development)) сторінки.",
        },
        {
          en: 'When page is hydrated, first, a static version of the page is sent to the browser.\nThen the dynamic part is sent and the page becomes "live". As a very fast user,\nPlaywright will start interacting with the page the moment it sees it. And if\nthe button on a page is enabled, but the listeners have not yet been added,\nPlaywright will do its job, but the click won\'t have any effect.',
          uk: "Під час гідратації спочатку в браузер надсилається статична версія сторінки,\nпотім динамічна частина — і сторінка стає «живою». Playwright, як дуже швидкий користувач,\nпочинає взаємодію щойно бачить UI. Якщо кнопка вже увімкнена, але обробники ще не додані,\nPlaywright виконає клік, але ефекту не буде.",
        },
        {
          en: 'A simple way to verify if your page suffers from a poor hydration is to open Chrome\nDevTools, pick "Slow 3G" network emulation in the Network panel and reload the page.\nOnce you see the element of interest, interact with it. You\'ll see that the button\nclicks will be ignored and the entered text will be reset by the subsequent page\nload code.\n\nThe right fix for this issue is to make sure that all the interactive\ncontrols are disabled until after the hydration, when the page is fully functional.',
          uk: "Проста перевірка: Chrome DevTools → панель Network → емуляція «Slow 3G» → перезавантаження.\nКоли з’явиться потрібний елемент, спробуйте з ним взаємодіяти: кліки ігноруватимуться, текст скинеться\nнаступним кодом завантаження.\n\nПравильне виправлення — не давати інтерактивним елементам бути активними до завершення гідратації,\nколи сторінка повністю готова.",
        },
      ],
    },
    {
      id: "waiting-for-navigation",
      title: {
        en: "Waiting for navigation",
        uk: "Очікування навігації",
      },
      paragraphs: [
        {
          en: "Clicking an element could trigger multiple navigations. In these cases, it is\nrecommended to explicitly [`method: Page.waitForURL`] to a specific url.",
          uk: "Клік може спричинити кілька переходів. У таких випадках варто явно\nвикликати [`method: Page.waitForURL`] для потрібного URL.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "await page.getByText('Click me').click();\nawait page.waitForURL('**/login');",
        },
      ],
    },
    {
      id: "navigation-events",
      title: {
        en: "Navigation events",
        uk: "Події навігації",
      },
      paragraphs: [
        {
          en: "Playwright splits the process of showing a new document in a page into **navigation** and **loading**.",
          uk: "Playwright розділяє показ нового документа на сторінці на **навігацію** та **завантаження**.",
        },
        {
          en: "**Navigation starts** by changing the page URL or by interacting with the page (e.g., clicking a link).\nThe navigation intent may be canceled, for example, on hitting an unresolved DNS address or transformed into a file download.",
          uk: "**Початок навігації** — зміна URL або взаємодія зі сторінкою (наприклад, клік по посиланню).\nНамір може бути скасовано (наприклад, нерозв’язаний DNS) або перетворитися на завантаження файлу.",
        },
        {
          en: "**Navigation is committed** when the response headers have been parsed and session history is updated. Only after the\nnavigation succeeds (is committed), the page starts **loading** the document.",
          uk: "**Навігація зафіксована (committed)**, коли розібрано заголовки відповіді й оновлено історію сесії. Лише після\nуспішного commit сторінка починає **завантажувати** документ.",
        },
        {
          en: "**Loading** covers getting the remaining response body over the network, parsing, executing the scripts and firing load\nevents:\n- [`method: Page.url`] is set to the new url\n- document content is loaded over network and parsed\n- [`event: Page.DOMContentLoaded`] event is fired\n- page executes some scripts and loads resources like stylesheets and images\n- [`event: Page.load`] event is fired\n- page executes dynamically loaded scripts",
          uk: "**Завантаження** — отримання тіла відповіді з мережі, парсинг, виконання скриптів і події load:\n- [`method: Page.url`] встановлюється на новий URL\n- вміст документа з мережі завантажується й парситься\n- випромінюється [`event: Page.DOMContentLoaded`]\n- сторінка виконує скрипти й тягне ресурси (стилі, зображення)\n- випромінюється [`event: Page.load`]\n- виконуються динамічно підвантажені скрипти",
        },
      ],
    },
  ],
  quiz: [],
}
