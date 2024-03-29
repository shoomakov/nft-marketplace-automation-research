import { Locator, Page } from "@playwright/test";

import { BasePage } from "../base-page";

export class HeaderFragment extends BasePage {
  readonly root: Locator;
  readonly headerRight: Locator;
  readonly headerProfile: Locator;
  readonly connectWalletButton: Locator;
  readonly tooltip: Locator;
  readonly tooltipUserName: Locator; //  LibraryDisplay LibraryDisplay--l-3 LibraryDisplay--w-semi-bold HeaderProfile__tooltip_user_name
  readonly cryptoPriceAmount: Locator;
  readonly selectNFTBtn: Locator;
  readonly openProfileLink: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.locator('header.Header');
    this.headerRight = this.root.locator('.Header__right');
    this.connectWalletButton = this.headerRight.locator('.LibraryButton', { hasText: 'Connect Wallet' });
    this.headerProfile = this.headerRight.locator('.HeaderProfile');
    this.tooltip = this.headerProfile.locator('.Tooltip');
    this.selectNFTBtn = this.headerRight.locator('.SelectNftButton');
    this.tooltipUserName = this.tooltip.locator('.HeaderProfile__tooltip_user_name');
    this.cryptoPriceAmount = this.tooltip.locator('.CryptoPrice__amount');
    this.openProfileLink = this.headerProfile.locator('.HeaderProfile__tooltip_user_text').filter({ hasText: 'Open profile' });
  }

  async openConnectWalletModal() {
    await this.connectWalletButton.click();
  }

  async openTooltip() {
    // await this.page.locator('[data-tooltip-id="tooltip-header-profile"]').hover();
    await this.page.screenshot({ path: 'toooltip.png' });
    await this.headerProfile.first().click();
    await this.page.screenshot({ path: 'toooltip_open.png' });
  }

  async gotoUserPage() {
    await this.openProfileLink.first().click();
  }  

  async getMyAddressOnTooltip() {
    let address = (await this.tooltipUserName.first().innerText()).valueOf();

    return address;
  }
}
