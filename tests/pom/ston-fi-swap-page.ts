import { Locator, Page } from '@playwright/test';

export class StonFiSwapPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  
  async goto() {
    await this.page.goto('https://app.ston.fi/swap');
  }    
}
