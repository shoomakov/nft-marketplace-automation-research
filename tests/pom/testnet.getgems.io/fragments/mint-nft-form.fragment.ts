import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../base-page";

export class MintNFTFormFragment extends BasePage {
  readonly root: Locator;
  readonly nftPageRight: Locator;
  readonly nftPageLeft: Locator;
  readonly inputNameYourNft: Locator;
  readonly textareaDescription: Locator;
  readonly createNFTButton: Locator;
  readonly uploadButton: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.locator('#mintNftForm');
    this.nftPageRight = this.root.locator('.NftPageRight');
    this.nftPageLeft = this.root.locator('.NftPageLeft');
    this.inputNameYourNft = this.nftPageRight.getByPlaceholder('Name your NFT');
    this.textareaDescription = this.nftPageRight.getByPlaceholder('Describe the idea behind your NFT and explain how it stands out from the rest.');
    this.createNFTButton = this.nftPageRight.locator('.NftPageCreate__submit').filter({ hasText: 'Create NFT' });
    this.uploadButton = this.nftPageLeft.getByRole('button').filter({ hasText: 'Upload' });
  }

  async uploadFiles(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.uploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  async fillCommonRightsFields(name: string, description: string) {
    await this.inputNameYourNft.fill(name);
    await this.textareaDescription.fill(description);
  }

  async submitForm() {
    await this.createNFTButton.click();
  }
}
