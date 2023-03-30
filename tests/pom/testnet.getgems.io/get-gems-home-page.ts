// get-gems-home-page.ts:

import { Locator, Page } from '@playwright/test';

import { BasePage } from '../base-page';
import { HeaderFragment } from '../fragments/header.fragment';
import { WalletConnectFragment } from '../fragments/wallet-connect.fragment';
import { test } from '../../fixtures';

export class GetGemsHomePage extends BasePage {
  readonly walletConnectModal: Locator;
  readonly walletConnectButton: Locator;
  readonly headerPrimaryButton: Locator;
  readonly headerProfile: Locator;
  readonly modalRoot: Locator;

  constructor(page: Page) {
    super(page);
    this.walletConnectModal = page.locator('.WalletConnectModal');
    this.walletConnectButton = page.locator('.WalletConnect__button');
    this.headerPrimaryButton = page.locator('.Header__primary-button');
    this.headerProfile = page.locator('.HeaderProfile');
    this.modalRoot = page.locator('#modal-root');
  }
  
  async goto() {
    await this.page.goto('https://testnet.getgems.io');
  }

  // async gotoUserPage() {
  //   await this.openProfileLink.first().click();
  // }

  async openWalletConnectModal() {
    await test.expect(this.modalRoot).toBeEmpty();
    
    await this.headerPrimaryButton.filter({ hasText: 'Connect Wallet' }).click();
    await test.expect(this.modalRoot).not.toBeEmpty();
  }

  async selectWallet(name: string) {
    await this.walletConnectButton.filter({ hasText: name }).click();
  }

  /**
   * ----------------------------------------------------------------
   * FRAGMENTS
   * ----------------------------------------------------------------
   */

  header(){
    return new HeaderFragment(this.page);
  }

  walletConnect() {
    return new WalletConnectFragment(this.page);
  }
}
