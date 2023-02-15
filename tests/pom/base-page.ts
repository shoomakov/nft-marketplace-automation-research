import { Locator, Page } from '@playwright/test';

import { test } from '../fixtures';

export class BasePage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async bringToFront() {
    await this.page.bringToFront();
  }

  async instance() {
    return this.page;
  }
}
