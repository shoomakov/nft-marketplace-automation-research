import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../base-page";

export class NftActionSuccessFragment extends BasePage {
  readonly root: Locator;
  readonly actions: Locator;
  readonly successBtn: Locator;
  readonly image: Locator;
  constructor(page: Page) {
    super(page);
    this.root = page.locator('.NftActionSuccess');
    this.actions = this.root.locator('.NftActionSuccess__actions');
    this.successBtn = this.actions.locator('.NftActionSuccess__button');
    this.image = this.root.locator('.NftActionSuccess__image');
  }
  
  async viewNFT() {
    await this.successBtn.filter({ hasText: 'View NFT' }).click();
  }
}
