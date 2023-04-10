import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../../base-page";

export class ModalPutOnSaleFragment extends BasePage {
    readonly root: Locator;
    readonly formGroup: Locator;
    readonly enterPriceInput: Locator;
    readonly row: Locator;
    readonly rowLeft: Locator;
    readonly rowRight: Locator;
    readonly bottom: Locator;
    readonly putOnSaleBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator('.ModalPutOnSale');
        this.formGroup = this.root.locator('.FormGroup');
        this.enterPriceInput = this.formGroup.getByPlaceholder('Enter Price');
        this.row = this.root.locator('.ModalPutOnSale__row');
        this.rowLeft = this.row.locator('.ModalPutOnSale__row_left');
        this.rowRight = this.row.locator('.ModalPutOnSale__row_right');
        this.bottom = this.root.locator('.ModalPutOnSale__bottom');
        this.putOnSaleBtn = this.bottom.locator('button').filter({ hasText: 'Put on Sale' });
    }
}
