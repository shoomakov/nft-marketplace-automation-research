import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../base-page";

export class NFTPageLeftFragment extends BasePage {
  readonly root: Locator;
  readonly proportionalImage: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator('.NftPageLeft');
        this.proportionalImage = this.root.locator('.ProportionalImage');
    }

}
