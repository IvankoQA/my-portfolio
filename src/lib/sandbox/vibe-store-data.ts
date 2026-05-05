/** Vibe Coder Supply Co. — static catalog + planted bugs (from my-portfolio-design/sandbox-data.jsx). */

export type VibeTextLang = "en" | "ua"

export type VibeBilingual = { en: string; ua: string }

export type VibeCategory = { id: string; icon: string }

export type VibeProduct = {
  id: string
  name: VibeBilingual
  cat: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  stock: number
  isNew?: boolean
  sale?: boolean
  tagline: VibeBilingual
}

export type VibeBugSeverity = "blocker" | "major" | "minor"

export type VibeBug = {
  id: string
  area: string
  severity: VibeBugSeverity
  title: VibeBilingual
  hint: VibeBilingual
}

/** Functional slices of the vibe store (for challenge hints only; counts come from `SB_BUGS`). */
export const SB_CHALLENGE_AREAS = [
  "header",
  "search",
  "filter",
  "card",
  "cart",
  "auth",
  "chat",
  "pagination",
  "a11y",
] as const

export type SandboxChallengeArea = (typeof SB_CHALLENGE_AREAS)[number]

export const SB_CATEGORIES: VibeCategory[] = [
  { id: "duck", icon: "duck" },
  { id: "mug", icon: "package" },
  { id: "sticker", icon: "tag" },
  { id: "apparel", icon: "package" },
  { id: "tool", icon: "code" },
  { id: "book", icon: "package" },
  { id: "snack", icon: "package" },
]

export const SB_PRODUCTS: VibeProduct[] = [
  {
    id: "p01",
    name: { en: "Senior Rubber Duck", ua: "Senior гумова качечка" },
    cat: "duck",
    price: 24,
    oldPrice: 32,
    rating: 4.9,
    reviews: 412,
    stock: 87,
    isNew: false,
    sale: true,
    tagline: {
      en: "Listens better than your tech lead.",
      ua: "Слухає краще, ніж ваш тімлід.",
    },
  },
  {
    id: "p02",
    name: { en: "Junior Rubber Duck", ua: "Junior гумова качечка" },
    cat: "duck",
    price: 12,
    rating: 4.4,
    reviews: 198,
    stock: 132,
    tagline: { en: "Asks a lot of questions.", ua: "Ставить багато питань." },
  },
  {
    id: "p03",
    name: { en: "Staff Rubber Duck", ua: "Staff качечка" },
    cat: "duck",
    price: 64,
    rating: 4.8,
    reviews: 64,
    stock: 12,
    tagline: {
      en: "Will draw you a system diagram.",
      ua: "Намалює діаграму системи.",
    },
  },
  {
    id: "p04",
    name: { en: "Pirate Duck (npm install)", ua: "Качка-пірат (npm install)" },
    cat: "duck",
    price: 18,
    rating: 4.6,
    reviews: 91,
    stock: 34,
    tagline: { en: "Yarrr. Or yarn.", ua: "Yarrr. Або yarn." },
  },
  {
    id: "p05",
    name: { en: "Goth Duck", ua: "Goth-качечка" },
    cat: "duck",
    price: 22,
    rating: 4.7,
    reviews: 56,
    stock: 19,
    tagline: { en: "It works on her machine.", ua: "У неї на машині працює." },
  },
  {
    id: "p06",
    name: { en: "Duck Pack of 5", ua: "Набір з 5 качечок" },
    cat: "duck",
    price: 78,
    oldPrice: 96,
    rating: 5.0,
    reviews: 22,
    stock: 7,
    sale: true,
    tagline: {
      en: "For your whole sprint team.",
      ua: "На всю команду спринту.",
    },
  },
  {
    id: "p07",
    name: {
      en: "It Compiles, Ship It mug",
      ua: "Чашка «Компілюється — релізимо»",
    },
    cat: "mug",
    price: 19,
    rating: 4.5,
    reviews: 287,
    stock: 64,
    tagline: {
      en: "350ml of irresponsibility.",
      ua: "350мл безвідповідальності.",
    },
  },
  {
    id: "p08",
    name: {
      en: "Stack Overflow Inheritance Mug",
      ua: "Чашка «Stack Overflow inheritance»",
    },
    cat: "mug",
    price: 22,
    rating: 4.7,
    reviews: 156,
    stock: 88,
    tagline: {
      en: "Copy & paste with confidence.",
      ua: "Копіюй і вставляй впевнено.",
    },
  },
  {
    id: "p09",
    name: { en: "Sad Sprint Mug", ua: "Чашка сумного спринту" },
    cat: "mug",
    price: 18,
    rating: 4.2,
    reviews: 73,
    stock: 41,
    tagline: { en: "Burndown chart goes up.", ua: "Burndown йде вгору." },
  },
  {
    id: "p10",
    name: { en: "Espresso & Exceptions", ua: "Espresso & Exceptions" },
    cat: "mug",
    price: 26,
    rating: 4.8,
    reviews: 113,
    stock: 28,
    isNew: true,
    tagline: { en: "Throws stack traces.", ua: "Кидає stack trace." },
  },
  {
    id: "p11",
    name: { en: "404: Coffee Not Found", ua: "404: каву не знайдено" },
    cat: "mug",
    price: 17,
    rating: 4.3,
    reviews: 198,
    stock: 0,
    tagline: { en: "Empty by design.", ua: "Порожня by design." },
  },
  {
    id: "p12",
    name: { en: "TypeScript Tear Catcher", ua: "Збирач сліз TypeScript" },
    cat: "mug",
    price: 21,
    rating: 4.6,
    reviews: 88,
    stock: 53,
    tagline: { en: "any[] is a feeling.", ua: "any[] — це відчуття." },
  },
  {
    id: "p13",
    name: { en: "Senior Junior sticker", ua: "Наліпка «Senior Junior»" },
    cat: "sticker",
    price: 4,
    rating: 4.9,
    reviews: 612,
    stock: 1024,
    tagline: { en: "It depends on the day.", ua: "Залежить від дня." },
  },
  {
    id: "p14",
    name: { en: "Vibe Coding sticker pack", ua: "Набір «Vibe Coding»" },
    cat: "sticker",
    price: 9,
    rating: 4.8,
    reviews: 421,
    stock: 412,
    isNew: true,
    tagline: {
      en: "12 stickers. 0 productivity.",
      ua: "12 наліпок. 0 продуктивності.",
    },
  },
  {
    id: "p15",
    name: { en: "It works ✓", ua: "Воно працює ✓" },
    cat: "sticker",
    price: 3,
    rating: 4.6,
    reviews: 309,
    stock: 800,
    tagline: {
      en: "Locally. On your branch.",
      ua: "Локально. На вашій гілці.",
    },
  },
  {
    id: "p16",
    name: { en: "Production = Staging", ua: "Production = Staging" },
    cat: "sticker",
    price: 4,
    rating: 4.4,
    reviews: 117,
    stock: 220,
    tagline: {
      en: "What's the worst that could happen.",
      ua: "Що може піти не так.",
    },
  },
  {
    id: "p17",
    name: { en: "Skill issue sticker", ua: "Наліпка «Skill issue»" },
    cat: "sticker",
    price: 3,
    rating: 4.7,
    reviews: 244,
    stock: 612,
    tagline: { en: "Your bug, not mine.", ua: "Це ваш баг, не мій." },
  },
  {
    id: "p18",
    name: { en: "Holographic 'TODO' sticker", ua: "Голографічна «TODO»" },
    cat: "sticker",
    price: 6,
    rating: 4.5,
    reviews: 88,
    stock: 312,
    tagline: { en: "Forever pending.", ua: "Назавжди pending." },
  },
  {
    id: "p19",
    name: { en: "Hoodie: 'I am the bug'", ua: "Худі «Я — це баг»" },
    cat: "apparel",
    price: 65,
    oldPrice: 79,
    rating: 4.7,
    reviews: 134,
    stock: 22,
    sale: true,
    tagline: {
      en: "Self-aware. Slightly damp.",
      ua: "Самосвідома. Трохи волога.",
    },
  },
  {
    id: "p20",
    name: { en: "T-shirt: localhost:3000", ua: "Футболка «localhost:3000»" },
    cat: "apparel",
    price: 32,
    rating: 4.6,
    reviews: 211,
    stock: 86,
    tagline: { en: "ECONNREFUSED forever.", ua: "ECONNREFUSED назавжди." },
  },
  {
    id: "p21",
    name: {
      en: "T-shirt: 'It works on my machine'",
      ua: "Футболка «Works on my machine»",
    },
    cat: "apparel",
    price: 30,
    rating: 4.4,
    reviews: 311,
    stock: 102,
    tagline: {
      en: "Includes a docker container.",
      ua: "З docker-контейнером у комплекті.",
    },
  },
  {
    id: "p22",
    name: { en: "Cap: --force", ua: "Кепка «--force»" },
    cat: "apparel",
    price: 28,
    rating: 4.5,
    reviews: 92,
    stock: 41,
    isNew: true,
    tagline: {
      en: "Yes you can push to main.",
      ua: "Так, можна пушити в main.",
    },
  },
  {
    id: "p23",
    name: { en: "Socks: monorepo edition", ua: "Шкарпетки «monorepo edition»" },
    cat: "apparel",
    price: 14,
    rating: 4.3,
    reviews: 67,
    stock: 188,
    tagline: { en: "Two socks, one repo.", ua: "Дві шкарпетки, один репо." },
  },
  {
    id: "p24",
    name: { en: "Beanie: WARN-level", ua: "Шапка «WARN-level»" },
    cat: "apparel",
    price: 22,
    rating: 4.4,
    reviews: 41,
    stock: 54,
    tagline: { en: "Yellow, naturally.", ua: "Жовта, природно." },
  },
  {
    id: "p25",
    name: {
      en: "Mechanical keyboard 'Linter 87'",
      ua: "Клавіатура «Linter 87»",
    },
    cat: "tool",
    price: 189,
    oldPrice: 219,
    rating: 4.9,
    reviews: 88,
    stock: 6,
    sale: true,
    tagline: {
      en: "Click-clacks at every typo.",
      ua: "Клацає на кожну помилку.",
    },
  },
  {
    id: "p26",
    name: { en: "Debug LED desk light", ua: "Лампа Debug LED" },
    cat: "tool",
    price: 56,
    rating: 4.6,
    reviews: 47,
    stock: 18,
    tagline: {
      en: "Goes red on production fires.",
      ua: "Червоніє при пожежі на проді.",
    },
  },
  {
    id: "p27",
    name: { en: "Standing desk: 'Standup'", ua: "Стіл-трансформер «Standup»" },
    cat: "tool",
    price: 449,
    rating: 4.7,
    reviews: 23,
    stock: 4,
    tagline: { en: "Auto-rises at 9:30.", ua: "Сам підіймається о 9:30." },
  },
  {
    id: "p28",
    name: {
      en: "Cable organizer 'Spaghetti'",
      ua: "Органайзер кабелів «Spaghetti»",
    },
    cat: "tool",
    price: 24,
    rating: 4.2,
    reviews: 156,
    stock: 67,
    tagline: {
      en: "Renames cables to types.",
      ua: "Перейменовує кабелі на типи.",
    },
  },
  {
    id: "p29",
    name: { en: "USB-C dongle 'Yet Another'", ua: "USB-C донгл «Yet Another»" },
    cat: "tool",
    price: 39,
    rating: 3.9,
    reviews: 411,
    stock: 0,
    tagline: {
      en: "Now with HDMI you'll lose.",
      ua: "З HDMI, який ви загубите.",
    },
  },
  {
    id: "p30",
    name: { en: "Mousepad: Whitespace", ua: "Килимок «Whitespace»" },
    cat: "tool",
    price: 14,
    rating: 4.5,
    reviews: 76,
    stock: 99,
    tagline: { en: "Tabs, on principle.", ua: "Tabs, з принципу." },
  },
  {
    id: "p31",
    name: { en: "Webcam cover 'feature flag'", ua: "Шторка «feature flag»" },
    cat: "tool",
    price: 6,
    rating: 4.7,
    reviews: 188,
    stock: 412,
    tagline: {
      en: "Rolled out to 100% of users.",
      ua: "Викочено на 100% юзерів.",
    },
  },
  {
    id: "p32",
    name: { en: "Screen wipes 'rebuild'", ua: "Серветки «rebuild»" },
    cat: "tool",
    price: 8,
    rating: 4.5,
    reviews: 144,
    stock: 311,
    tagline: {
      en: "Pack of 50. Probably enough.",
      ua: "50 шт. Мабуть, вистачить.",
    },
  },
  {
    id: "p33",
    name: { en: "Pragmatic Vibe Coder", ua: "Pragmatic Vibe Coder" },
    cat: "book",
    price: 38,
    rating: 4.7,
    reviews: 92,
    stock: 14,
    isNew: true,
    tagline: {
      en: "Like the other one but with feelings.",
      ua: "Як та, тільки з почуттями.",
    },
  },
  {
    id: "p34",
    name: { en: "Clean Code: Eventually", ua: "Clean Code: Eventually" },
    cat: "book",
    price: 42,
    rating: 4.4,
    reviews: 67,
    stock: 9,
    tagline: { en: "TDD in a hurry.", ua: "TDD у поспіху." },
  },
  {
    id: "p35",
    name: { en: "QA: A Field Guide", ua: "QA: польовий гайд" },
    cat: "book",
    price: 32,
    rating: 4.9,
    reviews: 188,
    stock: 22,
    tagline: {
      en: "Featuring real Playwright traces.",
      ua: "З реальними Playwright traces.",
    },
  },
  {
    id: "p36",
    name: {
      en: "The Phoenix Project (audiobook)",
      ua: "The Phoenix Project (аудіо)",
    },
    cat: "book",
    price: 18,
    rating: 4.6,
    reviews: 312,
    stock: 999,
    tagline: { en: "Listen at 1.75×.", ua: "Слухайте на 1.75×." },
  },
  {
    id: "p37",
    name: { en: "Cold brew (12-pack)", ua: "Cold brew (12 шт.)" },
    cat: "snack",
    price: 36,
    rating: 4.5,
    reviews: 211,
    stock: 144,
    tagline: {
      en: "Approx. one sprint of caffeine.",
      ua: "Приблизно один спринт кофеїну.",
    },
  },
  {
    id: "p38",
    name: { en: "Energy gel: 'await'", ua: "Гель «await»" },
    cat: "snack",
    price: 4,
    rating: 4.3,
    reviews: 422,
    stock: 612,
    tagline: { en: "Resolves your tiredness.", ua: "Резолвить вашу втому." },
  },
  {
    id: "p39",
    name: { en: "Stickerbook of Snacks", ua: "Стікер-книга снеків" },
    cat: "snack",
    price: 11,
    rating: 4.6,
    reviews: 88,
    stock: 200,
    tagline: {
      en: "Scratch-and-sniff debug logs.",
      ua: "Скретч-і-нюхай debug logs.",
    },
  },
  {
    id: "p40",
    name: { en: "Caffeine pills (180ct)", ua: "Кофеїн у таблетках (180)" },
    cat: "snack",
    price: 22,
    rating: 4.7,
    reviews: 144,
    stock: 86,
    tagline: {
      en: "Actually just espresso.",
      ua: "Насправді просто espresso.",
    },
  },
  {
    id: "p41",
    name: { en: "Yak shaver razor (deluxe)", ua: "Бритва для яків (deluxe)" },
    cat: "tool",
    price: 88,
    rating: 4.4,
    reviews: 33,
    stock: 12,
    tagline: {
      en: "Includes 11 yaks to shave first.",
      ua: "11 яків у комплекті для гоління.",
    },
  },
  {
    id: "p42",
    name: {
      en: "Sticker: 'It's not flaky, you are'",
      ua: "Наліпка «Це не flaky, це ви»",
    },
    cat: "sticker",
    price: 4,
    rating: 4.8,
    reviews: 188,
    stock: 412,
    tagline: {
      en: "Tested 47 times. Once.",
      ua: "Тестовано 47 разів. Один раз.",
    },
  },
  {
    id: "p43",
    name: { en: "Mug: '0 unread Slack'", ua: "Чашка «0 unread Slack»" },
    cat: "mug",
    price: 23,
    rating: 5.0,
    reviews: 12,
    stock: 3,
    isNew: true,
    tagline: { en: "A theoretical state.", ua: "Теоретичний стан." },
  },
  {
    id: "p44",
    name: {
      en: "Hoodie: 'On call, off vibes'",
      ua: "Худі «On call, off vibes»",
    },
    cat: "apparel",
    price: 72,
    rating: 4.6,
    reviews: 56,
    stock: 18,
    tagline: { en: "Pager included.", ua: "Пейджер у комплекті." },
  },
]

/**
 * Planted defects for the QA challenge (see docs/testing/vibe-store-planted-bugs.md).
 * DO NOT fix these — they are intentional. Each bug is also marked in its implementation file
 * with a comment like `// vs-XX: <description>` and/or `data-vibe-bug-id="vs-XX"`.
 */
export const SB_BUGS: VibeBug[] = [
  {
    id: "vs-01",
    area: "auth",
    severity: "minor",
    title: {
      en: "Password generator visible on login",
      ua: "Генератор пароля видно у формі входу",
    },
    hint: {
      en: "Autogen should be register-only.",
      ua: "Автогенерація логічніше лише при реєстрації.",
    },
  },
  {
    id: "vs-02",
    area: "auth",
    severity: "major",
    title: {
      en: "Show password (eye icon) does not work on register",
      ua: "Кнопка «Показати пароль» (іконка ока) не працює у формі реєстрації",
    },
    hint: {
      en: "Toggle does not reveal password when signing up.",
      ua: "Перемикач не показує пароль при реєстрації.",
    },
  },
  {
    id: "vs-03",
    area: "auth",
    severity: "major",
    title: {
      en: "No validation error for empty email field on register",
      ua: "Відсутня валідаційна помилка для порожнього поля email",
    },
    hint: {
      en: "Required field but no inline validation message.",
      ua: "Обовʼязкове поле без інлайн-повідомлення.",
    },
  },
  {
    id: "vs-04",
    area: "auth",
    severity: "minor",
    title: {
      en: "Register role always displays QA regardless of selection",
      ua: "У вікні реєстрації завжди відображається QA незалежно від вибраної ролі",
    },
    hint: {
      en: "Changing role does not update visible label.",
      ua: "Зміна ролі не оновлює підпис.",
    },
  },
  {
    id: "vs-05",
    area: "auth",
    severity: "blocker",
    title: {
      en: "User cannot log in after successful registration",
      ua: "Зареєстрований користувач не може повторно увійти через форму логіну",
    },
    hint: {
      en: "Same credentials fail on Login tab.",
      ua: "Ті самі дані не проходять на вкладці «Увійти».",
    },
  },
  {
    id: "vs-06",
    area: "header",
    severity: "major",
    title: {
      en: "Price sort order is identical for Price ↑ and Price ↓",
      ua: "Ціни в сортуванні однакові для «Ціна ↑» та «Ціна ↓»",
    },
    hint: {
      en: "Both price sorts order the same way.",
      ua: "Обидва режими сортують однаково.",
    },
  },
  {
    id: "vs-07",
    area: "pagination",
    severity: "major",
    title: {
      en: "Side pagination buttons (‹ ›) do not work",
      ua: "Кнопки пагінації по боках (‹ ›) не працюють",
    },
    hint: {
      en: "Only numbered page buttons work.",
      ua: "Працюють лише номери сторінок.",
    },
  },
  {
    id: "vs-08",
    area: "filter",
    severity: "major",
    title: {
      en: "Books & snacks filters ignore clicks",
      ua: "Фільтри «Книги» та «Снеки» не перемикаються",
    },
    hint: {
      en: "Category chips do not switch for book/snack.",
      ua: "Категорії книги/снеки не змінюють вибір.",
    },
  },
  {
    id: "vs-09",
    area: "card",
    severity: "minor",
    title: {
      en: "Empty-state “Clear all” button does not work",
      ua: "Кнопка «Скинути все» у порожньому стані (коли товарів немає) не працює",
    },
    hint: {
      en: "Sidebar reset still works.",
      ua: "У сайдбарі скидання працює.",
    },
  },
  {
    id: "vs-10",
    area: "filter",
    severity: "major",
    title: {
      en: "With max price set to $5, products above $5 are still shown",
      ua: "При виборі ціни до $5 відображаються товари дорожче $5",
    },
    hint: {
      en: "Slider at minimum does not cap catalog.",
      ua: "Мінімум слайдера не обмежує каталог.",
    },
  },
  {
    id: "vs-11",
    area: "search",
    severity: "major",
    title: {
      en: "Search returns non-matching products",
      ua: "Пошук показує не ті товари",
    },
    hint: {
      en: "Results are not limited to query matches.",
      ua: "Результати не відповідають запиту.",
    },
  },
  {
    id: "vs-12",
    area: "cart",
    severity: "major",
    title: {
      en: "Promo code VIBES10 gives 50% instead of 10%",
      ua: "Промокод VIBES10 у кошику дає знижку 50% замість 10%",
    },
    hint: {
      en: "Promo line disagrees with label.",
      ua: "Знижка не збігається з описом промо.",
    },
  },
  {
    id: "vs-13",
    area: "cart",
    severity: "blocker",
    title: {
      en: "Random promo code (except VIBES10) gives 69% discount",
      ua: "Рандомний промокод (крім VIBES10) дає знижку 69%",
    },
    hint: {
      en: "Apply with arbitrary string.",
      ua: "Застосувати довільний рядок.",
    },
  },
  {
    id: "vs-14",
    area: "cart",
    severity: "blocker",
    title: {
      en: "Removing a cart item deletes a different product",
      ua: "У кошику видалення товару прибирає інший доданий товар",
    },
    hint: {
      en: "With two SKUs, X removes another row.",
      ua: "При двох SKU видаляється інший товар.",
    },
  },
  {
    id: "vs-15",
    area: "chat",
    severity: "major",
    title: {
      en: "After the second message in Contact us chat, response becomes error",
      ua: "Після відправки другого повідомлення в Contact us чаті зʼявляється error",
    },
    hint: {
      en: "After two user sends, bot text is wrong.",
      ua: "Після другого відправлення текст бота зламаний.",
    },
  },
  {
    id: "vs-16",
    area: "chat",
    severity: "minor",
    title: {
      en: "Chat uses wrong green theme and has poor text contrast in dark mode",
      ua: "Чат має неправильний зелений колір і погану читабельність тексту в темній темі",
    },
    hint: {
      en: "Header/footer panels use off-palette green.",
      ua: "Шапка/футер з некоректним зеленим.",
    },
  },
  {
    id: "vs-17",
    area: "cart",
    severity: "minor",
    title: {
      en: "Cart strings stay English in UA locale",
      ua: "Кошик англійською при UA",
    },
    hint: {
      en: "Title and totals ignore Ukrainian.",
      ua: "Заголовки та суми не локалізовані.",
    },
  },
  {
    id: "vs-18",
    area: "cart",
    severity: "minor",
    title: {
      en: "Cart drawer closes on third click",
      ua: "Кошик закривається з третього кліку",
    },
    hint: {
      en: "Close button ignores first two taps.",
      ua: "Хрестик спрацьовує лише з третього разу.",
    },
  },
  {
    id: "vs-19",
    area: "filter",
    severity: "major",
    title: {
      en: "Checkbox “In stock only” can hide all products",
      ua: "Чекбокс «Лише в наявності» може приховати всі товари",
    },
    hint: {
      en: "Toggling stock-only can wipe out the whole grid.",
      ua: 'Перемикач "Лише в наявності" може очистити всю сітку.',
    },
  },
]

/** Fast membership check for pick-mode bug marking. */
export const SB_BUG_ID_SET: ReadonlySet<string> = new Set(
  SB_BUGS.map((b) => b.id),
)

export function vibePickText<T extends VibeBilingual>(
  obj: T,
  lang: VibeTextLang,
): string {
  return lang === "ua" ? obj.ua || obj.en : obj.en
}
