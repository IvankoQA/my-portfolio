import type { PlaywrightTopic } from "../../types"

export const handlesTopic: PlaywrightTopic = {
  slug: "handles",
  groupId: "guides",
  order: 225,
  level: "intermediate",
  trackOrder: 23,
  sourceDoc: "handles.md",
  officialDocsUrl: "https://playwright.dev/docs/handles",
  title: {
    en: "Handles",
    uk: "Дескриптори (handles)",
  },
  summary: {
    en: "Playwright can create handles to the page DOM elements or any other objects inside the page. These handles live in the Playwright process, whereas the actual objects live in the browser. There are two types of handles: - [JSHandle] to reference any JavaScript objects in the page - [ElementHandle] to reference DOM elements in the page, it has extra methods that allow performing actions on the elements and asserting…",
    uk: "Playwright може створювати дескриптори на елементи DOM сторінки або інші об’єкти всередині неї. Дескриптори існують у процесі Playwright, а реальні об’єкти — у браузері. Є два типи: [JSHandle] — на будь-який JavaScript-об’єкт на сторінці; [ElementHandle] — на елемент DOM, з додатковими методами для дій і перевірок…",
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
          en: "Playwright can create handles to the page DOM elements or any other objects inside the\npage. These handles live in the Playwright process, whereas the actual objects live\nin the browser. There are two types of handles:\n- [JSHandle] to reference any JavaScript objects in the page\n- [ElementHandle] to reference DOM elements in the page, it has extra methods that allow\nperforming actions on the elements and asserting their properties.",
          uk: "Playwright може створювати дескриптори на елементи DOM або інші об’єкти на\nсторінці. Дескриптори живуть у процесі Playwright, а об’єкти — у\nбраузері. Типи:\n- [JSHandle] — посилання на JavaScript-об’єкти на сторінці\n- [ElementHandle] — на елемент DOM; є додаткові методи для\nдій з елементом і перевірки його властивостей.",
        },
        {
          en: "Since any DOM element in the page is also a JavaScript object, any [ElementHandle] is\na [JSHandle] as well.",
          uk: "Будь-який елемент DOM на сторінці також є JavaScript-об’єктом, тому [ElementHandle]\nє й [JSHandle].",
        },
        {
          en: "Handles are used to perform operations on those actual objects in the page. You can evaluate\non a handle, get handle properties, pass handle as an evaluation parameter, serialize page\nobject into JSON etc. See the [JSHandle] class API for these and methods.",
          uk: "Дескриптори використовують для операцій над реальними об’єктами на сторінці: `evaluate`,\nчитання властивостей, передача як аргумент оцінювання, серіалізація в JSON тощо.\nДив. API класу [JSHandle].",
        },
        {
          en: "### API reference\n- [JSHandle]\n- [ElementHandle]",
          uk: "### Довідка API\n- [JSHandle]\n- [ElementHandle]",
        },
        {
          en: "Here is the easiest way to obtain a [JSHandle].",
          uk: "Найпростіший спосіб отримати [JSHandle]:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "const jsHandle = await page.evaluateHandle('window');\n//  Use jsHandle for evaluations.",
        },
      ],
    },
    {
      id: "element-handles",
      title: {
        en: "Element Handles",
        uk: "ElementHandle",
      },
      paragraphs: [
        {
          en: "When [ElementHandle] is required, it is recommended to fetch it with the\n[`method: Page.waitForSelector`] or [`method: Frame.waitForSelector`] methods. These\nAPIs wait for the element to be attached and visible.",
          uk: "Коли потрібен [ElementHandle], краще отримувати його через\n[`method: Page.waitForSelector`] або [`method: Frame.waitForSelector`]. Ці\nAPI чекають, поки елемент буде в DOM і видимим.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-6",
          language: "js",
          code: "// Get the element handle\nconst elementHandle = page.waitForSelector('#box');\n\n// Assert bounding box for the element\nconst boundingBox = await elementHandle.boundingBox();\nexpect(boundingBox.width).toBe(100);\n\n// Assert attribute for the element\nconst classNames = await elementHandle.getAttribute('class');\nexpect(classNames.includes('highlighted')).toBeTruthy();",
        },
      ],
    },
    {
      id: "handles-as-parameters",
      title: {
        en: "Handles as parameters",
        uk: "Дескриптори як параметри",
      },
      paragraphs: [
        {
          en: "Handles can be passed into the [`method: Page.evaluate`] and similar methods.\nThe following snippet creates a new array in the page, initializes it with data\nand returns a handle to this array into Playwright. It then uses the handle\nin subsequent evaluations:",
          uk: "Дескриптори можна передавати в [`method: Page.evaluate`] та подібні методи.\nУ прикладі на сторінці створюється масив, він ініціалізується даними,\nа в Playwright повертається дескриптор на цей масив, який потім\nвикористовується в наступних `evaluate`:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "// Create new array in page.\nconst myArrayHandle = await page.evaluateHandle(() => {\n  window.myArray = [1];\n  return myArray;\n});\n\n// Get the length of the array.\nconst length = await page.evaluate(a => a.length, myArrayHandle);\n\n// Add one more element to the array using the handle\nawait page.evaluate(arg => arg.myArray.push(arg.newElement), {\n  myArray: myArrayHandle,\n  newElement: 2\n});\n\n// Release the object when it's no longer needed.\nawait myArrayHandle.dispose();",
        },
      ],
    },
    {
      id: "handle-lifecycle",
      title: {
        en: "Handle Lifecycle",
        uk: "Життєвий цикл дескриптора",
      },
      paragraphs: [
        {
          en: "Handles can be acquired using the page methods such as [`method: Page.evaluateHandle`],\n[`method: Page.querySelector`] or [`method: Page.querySelectorAll`] or their frame counterparts\n[`method: Frame.evaluateHandle`], [`method: Frame.querySelector`] or [`method: Frame.querySelectorAll`]. Once\ncreated, handles will retain object from\n[garbage collection](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)\nunless page navigates or the handle is manually disposed via the [`method: JSHandle.dispose`] method.",
          uk: "Дескриптори отримують методами сторінки, наприклад [`method: Page.evaluateHandle`],\n[`method: Page.querySelector`] або [`method: Page.querySelectorAll`], або аналогами для фрейму\n[`method: Frame.evaluateHandle`], [`method: Frame.querySelector`] чи [`method: Frame.querySelectorAll`].\n\nПісля створення дескриптор утримує об’єкт від\n[збирання сміття](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management),\nдоки не відбудеться навігація або не викличуть [`method: JSHandle.dispose`].",
        },
        {
          en: "### API reference\n- [JSHandle]\n- [ElementHandle]\n- [`method: ElementHandle.boundingBox`]\n- [`method: ElementHandle.getAttribute`]\n- [`method: ElementHandle.innerText`]\n- [`method: ElementHandle.innerHTML`]\n- [`method: ElementHandle.textContent`]\n- [`method: JSHandle.evaluate`]\n- [`method: Page.evaluateHandle`]\n- [`method: Page.querySelector`]\n- [`method: Page.querySelectorAll`]",
          uk: "### Довідка API\n- [JSHandle]\n- [ElementHandle]\n- [`method: ElementHandle.boundingBox`]\n- [`method: ElementHandle.getAttribute`]\n- [`method: ElementHandle.innerText`]\n- [`method: ElementHandle.innerHTML`]\n- [`method: ElementHandle.textContent`]\n- [`method: JSHandle.evaluate`]\n- [`method: Page.evaluateHandle`]\n- [`method: Page.querySelector`]\n- [`method: Page.querySelectorAll`]",
        },
      ],
    },
    {
      id: "locator-vs-elementhandle",
      title: {
        en: "Locator vs ElementHandle",
        uk: "Locator проти ElementHandle",
      },
      paragraphs: [
        {
          en: "The difference between the [Locator] and [ElementHandle] is that the latter points to a particular element, while Locator captures the logic of how to retrieve that element.",
          uk: "Різниця між [Locator] і [ElementHandle]: другий вказує на конкретний елемент, а Locator зберігає логіку його пошуку.",
        },
        {
          en: "In the example below, handle points to a particular DOM element on page. If that element changes text or is used by React to render an entirely different component, handle is still pointing to that very stale DOM element. This can lead to unexpected behaviors.",
          uk: "У прикладі нижче handle вказує на певний вузол DOM. Якщо текст зміниться або React відрендерить інший компонент, handle усе ще вказує на старий вузол — можливі неочікувані ефекти.",
        },
        {
          en: "With the locator, every time the locator is used, up-to-date DOM element is located in the page using the selector. So in the snippet below, underlying DOM element is going to be located twice.",
          uk: "З локатором при кожному використанні знову знаходиться актуальний елемент за селектором. У фрагменті нижче DOM-елемент буде знайдено двічі.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-16",
          language: "js",
          code: "const handle = await page.$('text=Submit');\n// ...\nawait handle.hover();\nawait handle.click();",
        },
        {
          id: "cb-21",
          language: "js",
          code: "const locator = page.getByText('Submit');\n// ...\nawait locator.hover();\nawait locator.click();",
        },
      ],
    },
  ],
  quiz: [],
}
