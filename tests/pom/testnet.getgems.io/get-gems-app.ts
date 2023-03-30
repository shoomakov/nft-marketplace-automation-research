
import { type Page } from '@playwright/test';
import { TonWalletPage } from '../ton-wallet-page';
import { GetGemsCreatePage } from './get-gems-create-page';
import { GetGemsHomePage } from './get-gems-home-page';
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

  homePage() {
    return new GetGemsHomePage(this.page);
  }

  userPage() {
    return new GetGemsUserPage(this.page);
  }

  createPage() {
    return new GetGemsCreatePage(this.page);
  }

  tonWalletPage() {
    return new TonWalletPage(this.extension, this.extensionId);
  }
}
