import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../base-page";
import { HeaderFragment } from "../../fragments/header.fragment";
import { MintNFTFormFragment } from "./mint-nft-form.fragment";

export class MainNfrPageCreateFragment extends BasePage {

  readonly root: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.locator('.NftPageCreate');
  }    

  header() {
    return new HeaderFragment(this.page);
  }

  mintNftForm() {
    return new MintNFTFormFragment(this.page);
  }
}
