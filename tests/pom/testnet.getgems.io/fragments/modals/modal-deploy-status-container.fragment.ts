import { Locator, Page } from "@playwright/test";

import { BasePage } from "../../../base-page";
import { test } from "../../../../fixtures";

export class ModalDeployStatusContainerFragment extends BasePage {
    static PROGRESS_CIRCLE = 'ProgressCircle';
    static PROGRESS_CIRCLE_DONE = 'ProgressCircle--done';
    static PROGRESS_CIRCLE_LOADING = 'ProgressCircle--loading';
    static PROGRESS_CIRCLE_FAILED = 'ProgressCircle--failed';
    static PROGRESS_CIRCLE_EMPTY = 'ProgressCircle--empty';

    readonly root: Locator;
    readonly progressList: Locator;
    readonly progressStep: Locator;
    readonly transactionStep: Locator;
    readonly progressCircle: Locator;
    readonly progressListHeader: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator('.ModalDeployStatusContainer');
        this.progressList = this.root.locator('.ProgressList');
        this.progressStep = this.progressList.locator('.ProgressStep');
        this.transactionStep = this.progressStep.nth(0);
        this.progressCircle = this.page.locator('.ProgressCircle');
        this.progressListHeader = this.progressList.locator('.ProgressList__header');
    }

    async verifyFirstTransactionPaymentReceived() {
        await this.page.bringToFront();
        const libraryBadge = this.transactionStep.locator('.ModalTonTx__bottom-wrapper').locator('.LibraryBadge').filter({ hasText: 'Payment Received' });
        await libraryBadge.waitFor({ state: 'visible' });
        await test.expect(libraryBadge).toBeVisible();
    }

    async verifyFirstTransactionCheckingPaymentLoading() {
        const progressCircle = this.progressStep.nth(1).locator('.ProgressCircle');
        await progressCircle.waitFor({ state: 'visible' });
        await test.expect(progressCircle).toHaveClass(`${ModalDeployStatusContainerFragment.PROGRESS_CIRCLE} ${ModalDeployStatusContainerFragment.PROGRESS_CIRCLE_LOADING}`);
    }

    async verifyFirstTransactionCheckingPaymentDone() {
        const progressCircle = this.progressStep.nth(1).locator(`.${ModalDeployStatusContainerFragment.PROGRESS_CIRCLE_DONE}`);
        await progressCircle.waitFor({ state: 'visible' });
        await test.expect(progressCircle).toBeVisible();
    }

    async verifySecondTransactionCheckingPaymentDone() {
        const progressCircle = this.progressStep.nth(3).locator(`.${ModalDeployStatusContainerFragment.PROGRESS_CIRCLE_DONE}`);
        await progressCircle.waitFor({ state: 'visible' });
        await test.expect(progressCircle).toBeVisible();
    }

    async verifyTransactionStepDone() {
        const progressCircle = this.transactionStep.locator('.ProgressCircle');
        await test.expect(progressCircle).toHaveClass(ModalDeployStatusContainerFragment.PROGRESS_CIRCLE_DONE);
    }

    async verifyTransactionStepIsLoading() {
        const progressCircle = this.transactionStep.locator(`.${ModalDeployStatusContainerFragment.PROGRESS_CIRCLE}`);
        // await test.expect(progressCircle).not.toHaveClass(ModalDeployStatusContainerFragment.PROGRESS_CIRCLE_DONE);
        await test.expect(progressCircle).toHaveClass(`${ModalDeployStatusContainerFragment.PROGRESS_CIRCLE} ${ModalDeployStatusContainerFragment.PROGRESS_CIRCLE_LOADING}`);
    }
}
