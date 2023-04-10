import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../base-page";

export class NFTPageRightFragment extends BasePage {
    readonly root: Locator;
    readonly mainCard: Locator;
    readonly pageInfo: Locator;
    readonly pageInfoControls: Locator;
    readonly putOnSaleBtn: Locator;
    readonly transferNFTBtn: Locator;
    readonly statusBadge: Locator;
    readonly status: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator('.NftPageRight');
        this.mainCard = this.root.locator('.Card--main');
        this.pageInfo = this.mainCard.locator('.NftPageInfo');
        this.pageInfoControls = this.mainCard.locator('.NftPageInfo__controls');
        this.putOnSaleBtn = this.pageInfoControls.locator('.NftPageOwnerControls__btn').filter({ hasText: 'Put on sale' });
        this.transferNFTBtn = this.pageInfoControls.locator('.NftPageOwnerControls__btn').filter({ hasText: 'Transfer NFT' });
        this.statusBadge = this.pageInfo.locator('.NftStatusBadge');
        this.status = this.statusBadge.locator('.NftStatusBadge__status');
    }
}