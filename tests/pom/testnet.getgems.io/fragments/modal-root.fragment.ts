import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../base-page";

export class ModalRootFragment extends BasePage {
  readonly root: Locator;
  readonly modalSingleNftWarning: Locator;
  readonly modalDeployStatus: Locator;
  readonly createNftBtn: Locator;
  
  constructor(page: Page) {
    super(page);
    this.root = page.locator('#modal-root');
    this.modalSingleNftWarning = this.root.locator('.ModalSingleNftWarning');
    this.createNftBtn = this.modalSingleNftWarning.locator('.ModalSingleNftWarning__button').filter({ hasText: 'Create Single NFT' });
    this.modalDeployStatus = this.root.locator('.ModalDeployStatus');
  }

  async createSingleNft() {
    await this.createNftBtn.click();
  }
}
