import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../base-page";
import { ModalDeployStatusContainerFragment } from "./modals/modal-deploy-status-container.fragment";
import { ModalPutOnSaleFragment } from "./modals/modal-put-on-sale.fragment";

export class ModalRootFragment extends BasePage {
  readonly root: Locator;
  readonly modalSingleNftWarning: Locator;
  readonly modalDeployStatus: Locator;
  readonly createNftBtn: Locator;
  readonly saleModal: Locator;
  readonly fixedPriceLink: Locator;
  readonly formGroup: Locator;
  readonly enterPriceInput: Locator;
  
  constructor(page: Page) {
    super(page);
    this.root = page.locator('#modal-root');
    this.modalSingleNftWarning = this.root.locator('.ModalSingleNftWarning');
    this.createNftBtn = this.modalSingleNftWarning.locator('.ModalSingleNftWarning__button').filter({ hasText: 'Create Single NFT' });
    this.modalDeployStatus = this.root.locator('.ModalDeployStatus');
    this.saleModal = this.root.locator('.NftPageOwnerControls__sale_modal');
    this.fixedPriceLink = this.saleModal.locator('.NftPageOwnerControls__cell').filter({ hasText: 'Fixed Price' });
  }

  modalPutOnSale() {
    return new ModalPutOnSaleFragment(this.page);
  }

  modalDeployStatusContainer() {
    return new ModalDeployStatusContainerFragment(this.page);
  }

  async createSingleNft() {
    await this.createNftBtn.click();
  }
}
