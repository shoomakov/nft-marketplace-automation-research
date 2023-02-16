import { BasePage } from "../base-page";
import { Locator, type Page } from '@playwright/test';

export class WalletConnectFragment extends BasePage {
  readonly root: Locator;

  readonly walletName: Locator;

  constructor(page: Page) {
    super(page);

    this.root = page.locator('.WalletConnect');
    this.walletName = this.root.locator('.WalletConnect__wallet_name');
  }

  async selectWalletInModal(name: 'TON Wallet' | 'Tonkeeper' | 'Tonhub') {
    await this.walletName.filter({ hasText: name }).click();
  }
}
