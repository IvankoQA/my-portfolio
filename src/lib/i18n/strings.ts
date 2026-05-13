export type AppLang = "en" | "uk"

const STRINGS = {
  en: {
    "nav.home": "Home",
    "nav.sandbox": "Sandbox",
    "nav.skills": "Skills",
    "nav.experience": "Experience",
    "nav.fit": "Job-fit",
    "nav.contact": "Contact",

    "home.tagline":
      "I architect Playwright frameworks from scratch. Then I find the bugs in them. :)",
    "home.summary":
      "Senior Automation QA with 7+ years across fintech, AdTech and gaming. I bridge automation gaps with exploratory testing — clean code, lean E2E, and CI pipelines that don't flake at 4am — but that's not a promise...)",
    "home.cta.primary": "Take the QA challenge",
    "home.cta.secondary": "Copy CV",
    "home.cta.copied": "Copied",
    "home.status.available": "Open to work · Senior AQA",
    "home.years": "years in industry",
    "home.farmer":
      'times I\'ve chosen "Deploy" over "Raise Chickens" — and it\'s getting harder to resist every year.',
    "home.releases": "release cadence",
    "home.frameworks": "frameworks built",
    "home.mentees": "QA mentees",

    "home.section.education": "// development",
    "home.section.languages": "// languages",
    "home.section.beyond": "// beyond engineering",

    "exp.present": "present",

    "fit.title": "Job-fit checker",
    "fit.subtitle":
      "Paste a JD — this page matches keywords from your text against the CV and shows chips plus a simple score.",
    "fit.placeholder":
      "Paste a job description here…\n\ne.g. 'We're looking for a Senior QA Engineer with strong Playwright/TypeScript experience, API testing (Postman, REST, GraphQL), CI/CD on GitHub Actions, and exposure to Datadog…'",
    "fit.upload": "Upload .txt",
    "fit.sample": "Try a sample JD",
    "fit.analyze": "Analyze fit",
    "fit.analyzing": "Analyzing…",
    "fit.reset": "New JD",
    "fit.reading": "Reading the JD",
    "fit.matching": "Matching skills",
    "fit.scoring": "Scoring",
    "fit.empty.title": "Waiting for a job description.",
    "fit.empty.body": "Paste up to ~2,000 words. Plain text works best.",
    "fit.error.title": "Couldn't parse the text.",
    "fit.error.body": "Try plain text or remove special characters.",
    "fit.score.label": "Overall fit",
    "fit.score.based": "Based on the CV you provided.",
    "fit.match.strong": "Strong matches",
    "fit.match.partial": "Partial / adjacent",
    "fit.match.gaps": "Gaps",
    "fit.match.none": "Nothing detected in this group.",
    "fit.badge.local": "JD-MATCH · LOCAL",
    "fit.copy": "Copy summary",
    "fit.copied": "Summary copied",
    "fit.band.poor": "Probably not a fit",
    "fit.band.partial": "Partial fit",
    "fit.band.solid": "Solid fit",
    "fit.band.strong": "Strong fit",
    "fit.breakdown.title": "Score breakdown",
    "fit.breakdown.keyword": "Keyword match (CV vs JD text)",
    "fit.adjust.weakCushion":
      "Gentle boost when the keyword match is on the low side (demo curve)",
    "fit.adjust.humor":
      "Fixed portfolio bonus: strong sense of humor (not detected from the JD — it’s the person, not the parser)",

    "contact.email": "Email",
    "contact.linkedin": "LinkedIn",
    "contact.github": "GitHub",
    "contact.telegram": "Telegram",
    "contact.youtube": "YouTube",
    "contact.copy": "Copy",
    "contact.copied": "Copied",
  },
  uk: {
    "nav.home": "Головна",
    "nav.sandbox": "Пісочниця",
    "nav.skills": "Стек",
    "nav.experience": "Досвід",
    "nav.fit": "Аналіз",
    "nav.contact": "Контакти",

    "home.tagline":
      "Архітектую Playwright-фреймворки з нуля. А потім знаходжу в них баги. :)",
    "home.summary":
      "Senior Automation QA з 7+ роками досвіду у fintech, AdTech та gaming. Поєдную автоматизацію з exploratory-тестуванням — чистий код, легкі E2E та CI-пайплайни, що не флакають о 4-й ранку — але це не точно...)",
    "home.cta.primary": "Пройти QA-челендж",
    "home.cta.secondary": "Копіювати CV",
    "home.cta.copied": "Скопійовано",
    "home.status.available": "Відкритий до пропозицій · Senior AQA",
    "home.years": "роки в індустрії",
    "home.farmer":
      "Раз за разом обираю «Deploy» замість «переїхати в село і завести курей» — і з кожним роком це дедалі важче.",
    "home.releases": "реліз-каденс",
    "home.frameworks": "фреймворків з нуля",
    "home.mentees": "менті у QA",

    "home.section.education": "// розвиток",
    "home.section.languages": "// мови",
    "home.section.beyond": "// поза інженерією",

    "exp.present": "сьогодні",

    "fit.title": "Аналіз відповідності вакансії",
    "fit.subtitle": "Вставте опис вакансії — порівняю з CV Івана.",
    "fit.placeholder":
      "Вставте опис вакансії сюди…\n\nнапр. 'Шукаємо Senior QA Engineer з досвідом Playwright/TypeScript, API testing (Postman, REST, GraphQL), CI/CD GitHub Actions, Datadog…'",
    "fit.upload": "Завантажити .txt",
    "fit.sample": "Тестовий JD",
    "fit.analyze": "Проаналізувати",
    "fit.analyzing": "Аналізую…",
    "fit.reset": "Новий JD",
    "fit.reading": "Читаю вакансію",
    "fit.matching": "Матчу скіли",
    "fit.scoring": "Оцінюю",
    "fit.empty.title": "Чекаю на опис вакансії.",
    "fit.empty.body": "До ~2 000 слів. Простий текст — найкраще.",
    "fit.error.title": "Не вдалося розібрати текст.",
    "fit.error.body": "Спробуйте без спецсимволів.",
    "fit.score.label": "Загальна відповідність",
    "fit.score.based": "На основі CV з цієї сторінки.",
    "fit.match.strong": "Сильні збіги",
    "fit.match.partial": "Часткові / суміжні",
    "fit.match.gaps": "Прогалини",
    "fit.match.none": "У цій групі нічого не знайдено.",
    "fit.badge.local": "JD-MATCH · LOCAL",
    "fit.copy": "Копіювати summary",
    "fit.copied": "Скопійовано",
    "fit.band.poor": "Скоріше не підходить",
    "fit.band.partial": "Часткова відповідність",
    "fit.band.solid": "Хороша відповідність",
    "fit.band.strong": "Сильна відповідність",
    "fit.breakdown.title": "Розбивка балів",
    "fit.breakdown.keyword": "Збіг за ключовими словами (CV vs текст JD)",
    "fit.adjust.weakCushion":
      "М’який підйом, коли ключовий збіг низький (демо-крива)",
    "fit.adjust.humor":
      "Фіксований бонус портфоліо: гарне почуття гумору (не з вакансії — про людину, не про парсер)",

    "contact.email": "Email",
    "contact.linkedin": "LinkedIn",
    "contact.github": "GitHub",
    "contact.telegram": "Telegram",
    "contact.youtube": "YouTube",
    "contact.copy": "Копіювати",
    "contact.copied": "Скопійовано",
  },
} as const

type StringKey = keyof typeof STRINGS.en

export function useT(lang: AppLang) {
  return (key: StringKey): string => {
    const locale = lang === "uk" ? "uk" : "en"
    const dict = STRINGS[locale] as Record<string, string>
    return dict[key] ?? (STRINGS.en as Record<string, string>)[key] ?? key
  }
}
