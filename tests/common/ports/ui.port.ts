import type { Page, Locator } from "@playwright/test"

export type UiPort = {
  page: Page
  byTestId: (id: string) => Locator
  byRole: Page["getByRole"]
  byText: Page["getByText"]
}

export const makeUiPort = (page: Page): UiPort => ({
  page,
  byTestId: (id: string) => page.getByTestId(id),
  byRole: page.getByRole.bind(page),
  byText: page.getByText.bind(page),
})
