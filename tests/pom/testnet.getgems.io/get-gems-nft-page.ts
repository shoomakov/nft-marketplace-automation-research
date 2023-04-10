import { BasePage } from "../base-page";
import { NFTPageBodyFragment } from "./fragments/nft-page-body.fragment";
import { Page } from "@playwright/test";

export class GetGemsNFTPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    pageBody() {
        return new NFTPageBodyFragment(this.page);
    }
}
