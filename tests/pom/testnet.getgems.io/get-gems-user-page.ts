// get-gems-user-page.ts:

import { Locator, Page } from "@playwright/test";

import { BasePage } from "../base-page";

export class GetGemsUserPage extends BasePage {
  readonly accountPage: Locator;
  readonly accountProducts: Locator;
  readonly nftsList: Locator;
  readonly nftPreview: Locator;
  readonly nftPreviewTitle: Locator;
  constructor(page: Page) {
    super(page);

    this.accountPage = page.locator('.AccountPage');
    this.accountProducts = this.accountPage.locator('.AccountProducts');
    this.nftsList = this.accountProducts.locator('.NftsList');
    this.nftPreview = this.nftsList.locator('.NftPreview');
    this.nftPreviewTitle = this.nftPreview.locator('.NftPreview__title');
  }  
}
