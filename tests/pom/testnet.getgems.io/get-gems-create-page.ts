import { BasePage } from '../base-page';
import { HeaderFragment } from '../fragments/header.fragment';
import { MainNfrPageCreateFragment } from './fragments/main-nft-page-create.fragment';
import { ModalRootFragment } from './fragments/modal-root.fragment';
import { NftActionSuccessFragment } from './fragments/nft-action-success.fragment';
import { Page } from '@playwright/test';

export class GetGemsCreatePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  mainNftPageCreate() {
    return new MainNfrPageCreateFragment(this.page);
  }

  modalRoot() {
    return new ModalRootFragment(this.page);
  }

  header() {
    return new HeaderFragment(this.page);
  }

  nftActionSuccess() {
    return new NftActionSuccessFragment(this.page);
  }
}
