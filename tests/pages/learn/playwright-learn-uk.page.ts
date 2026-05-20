import type { Page } from "@playwright/test"
import {
  UK_LEARN_PLAYWRIGHT_INDEX,
  ukLearnQuizPath,
  ukLearnTopicPath,
} from "../../support/playwright-learn-urls"

export class PlaywrightLearnUkPage {
  constructor(readonly page: Page) {}

  async gotoIndex() {
    await this.page.goto(UK_LEARN_PLAYWRIGHT_INDEX)
  }

  async gotoTopic(slug: string) {
    await this.page.goto(ukLearnTopicPath(slug))
  }

  async gotoQuiz(slug: string) {
    await this.page.goto(ukLearnQuizPath(slug))
  }

  get heading() {
    return this.page.getByRole("heading", { level: 1 })
  }

  get tracksHeading() {
    return this.page.getByRole("heading", {
      name: /навчальні треки/i,
    })
  }

  get modulesHeading() {
    return this.page.getByRole("heading", {
      name: /перегляд за розділами/i,
    })
  }

  introTopicLink(slug = "intro") {
    return this.page.getByTestId(`learn-intro-topic-${slug}`)
  }

  introQuizLink(slug = "intro") {
    return this.page.getByTestId(`learn-intro-quiz-${slug}`)
  }

  get backToIndexLink() {
    return this.page.getByTestId("learn-back-to-index")
  }

  get takeQuizLink() {
    return this.page.getByTestId("learn-take-quiz")
  }

  get quizBackToTopicLink() {
    return this.page.getByTestId("learn-quiz-back-to-topic")
  }

  get quizSubmitButton() {
    return this.page.getByTestId("learn-quiz-submit")
  }
}
