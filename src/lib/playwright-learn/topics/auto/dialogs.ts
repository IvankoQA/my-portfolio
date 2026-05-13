import type { PlaywrightTopic } from "../../types"

export const dialogsTopic: PlaywrightTopic = {
  slug: "dialogs",
  groupId: "guides",
  order: 170,
  sourceDoc: "dialogs.md",
  officialDocsUrl: "https://playwright.dev/docs/dialogs",
  title: {
    en: "Dialogs",
    uk: "Діалогові вікна",
  },
  summary: {
    en: "Playwright can interact with the web page dialogs such as [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) as well as [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) confirmation. For print dial…",
    uk: "Playwright може взаємодіяти з діалогами сторінки — [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) та підтвердженням [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event). Для діалогу друку див. [Print](#print-dialogs).",
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
          en: "Playwright can interact with the web page dialogs such as [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) as well as [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event) confirmation. For print dialogs, see [Print](#print-dialogs).",
          uk: "Playwright може взаємодіяти з діалогами сторінки — [`alert`](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert), [`confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm), [`prompt`](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt) та підтвердженням [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event). Для діалогів друку див. [Print](#print-dialogs).",
        },
      ],
    },
    {
      id: "alert-confirm-prompt-dialogs",
      title: {
        en: "alert(), confirm(), prompt() dialogs",
        uk: "Діалоги alert(), confirm(), prompt()",
      },
      paragraphs: [
        {
          en: "By default, dialogs are auto-dismissed by Playwright, so you don't have to handle them. However, you can register a dialog handler before the action that triggers the dialog to either [`method: Dialog.accept`] or [`method: Dialog.dismiss`] it.",
          uk: "За замовчуванням Playwright автоматично закриває діалоги, тож їх не обов’язково обробляти вручну. Але можна зареєструвати обробник перед дією, що відкриває діалог, і викликати [`method: Dialog.accept`] або [`method: Dialog.dismiss`].",
        },
        {
          en: "As a result, the following snippet will never resolve:",
          uk: "Через це наведений фрагмент ніколи не завершиться:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-1",
          language: "js",
          code: "page.on('dialog', dialog => dialog.accept());\nawait page.getByRole('button').click();",
        },
        {
          id: "cb-6",
          language: "js",
          code: "page.on('dialog', dialog => console.log(dialog.message()));\nawait page.getByRole('button').click(); // Will hang here",
        },
      ],
    },
    {
      id: "beforeunload-dialog",
      title: {
        en: "beforeunload dialog",
        uk: "Діалог beforeunload",
      },
      paragraphs: [
        {
          en: "When [`method: Page.close`] is invoked with the truthy [`option: Page.close.runBeforeUnload`] value, the page runs its unload handlers. This is the only case when [`method: Page.close`] does not wait for the page to actually close, because it might be that the page stays open in the end of the operation.",
          uk: "Якщо викликати [`method: Page.close`] з істинним [`option: Page.close.runBeforeUnload`], сторінка виконує обробники вивантаження. Це єдиний випадок, коли [`method: Page.close`] не чекає фактичного закриття сторінки, бо після операції вона може лишитися відкритою.",
        },
        {
          en: "You can register a dialog handler to handle the `beforeunload` dialog yourself:",
          uk: "Можна зареєструвати обробник діалогу й самостійно обробити `beforeunload`:",
        },
      ],
      codeBlocks: [
        {
          id: "cb-11",
          language: "js",
          code: "page.on('dialog', async dialog => {\n  assert(dialog.type() === 'beforeunload');\n  await dialog.dismiss();\n});\nawait page.close({ runBeforeUnload: true });",
        },
      ],
    },
    {
      id: "print-dialogs",
      title: {
        en: "Print dialogs",
        uk: "Діалог друку",
      },
      paragraphs: [
        {
          en: "In order to assert that a print dialog via [`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print) was triggered, you can use the following snippet:",
          uk: "Щоб переконатися, що після дії з’явився діалог друку через [`window.print`](https://developer.mozilla.org/en-US/docs/Web/API/Window/print), можна використати такий фрагмент:",
        },
        {
          en: "This will wait for the print dialog to be opened after the button is clicked.\nMake sure to evaluate the script before clicking the button / after the page is loaded.",
          uk: "Код чекатиме відкриття діалогу друку після кліку по кнопці.\nВиконайте скрипт оцінки до кліку або після завантаження сторінки.",
        },
      ],
      codeBlocks: [
        {
          id: "cb-16",
          language: "js",
          code: "await page.goto('');\n\nawait page.evaluate('(() => {window.waitForPrintDialog = new Promise(f => window.print = f);})()');\nawait page.getByText('Print it!').click();\n\nawait page.waitForFunction('window.waitForPrintDialog');",
        },
      ],
    },
  ],
  quiz: [],
}
