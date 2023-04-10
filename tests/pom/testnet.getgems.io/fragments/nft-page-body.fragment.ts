import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../base-page";
import { NFTPageLeftFragment } from "./nft-page-left.fragment";
import { NFTPageRightFragment } from "./nft-page-right.fragment";

export class NFTPageBodyFragment extends BasePage {
  readonly root: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator('.NftPageBody');
    }

    pageLeft() {
        return new NFTPageLeftFragment(this.page);
    }

    pageRight() {
        return new NFTPageRightFragment(this.page);
    }
}
