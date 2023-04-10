
import { type Page } from '@playwright/test';
import { TonWalletPage } from '../ton-wallet-page';
import { ModalRootFragment } from './fragments/modal-root.fragment';
import { GetGemsCreatePage } from './get-gems-create-page';
import { GetGemsHomePage } from './get-gems-home-page';
import { GetGemsNFTPage } from './get-gems-nft-page';
import { GetGemsUserPage } from './get-gems-user-page';


export class GetGemsApp {
  /**
   * Abstracts the app and provides access to the pages and fragments.
   * As SPA this class has access to the getgems.io app and TON wallet extension
   */  
  constructor(private page: Page, private extension: Page, private extensionId: string) {
    this.page = page;
    this.extension = extension;
    this.extensionId = extensionId;
  }

  public get app(): Page {
    return this.page;
  }

  homePage() {
    return new GetGemsHomePage(this.page);
  }

  userPage() {
    return new GetGemsUserPage(this.page);
  }

  createPage() {
    return new GetGemsCreatePage(this.page);
  }

  nftPage() {
    return new GetGemsNFTPage(this.page);
  }

  modalRoot() {
    return new ModalRootFragment(this.page);
  }

  tonWalletPage() {
    return new TonWalletPage(this.extension, this.extensionId);
  }
}
