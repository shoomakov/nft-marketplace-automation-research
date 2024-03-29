import { Locator, Page } from '@playwright/test';

import { BasePage } from './base-page';
import { test } from '../fixtures';

export class TonWalletPage extends BasePage {
  readonly startScreen: Locator;
  readonly startCreateBtn: Locator;
  readonly extensionId: string;
  readonly createdScreen: Locator;
  readonly createdContinueBtn: Locator;
  readonly backupContinueBtn: Locator;
  readonly backupScreen: Locator;
  readonly wordsConfirmScreen: Locator;
  readonly createWordItem: Locator;
  readonly alertPopup: Locator;
  readonly imSureBtn: Locator;
  readonly wordItem: Locator;
  readonly confirmWordsNums: Locator;
  readonly createPasswordScreen: Locator;
  readonly createPasswordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly continueBtnOnCreatePassword: Locator;
  readonly readyToGoScreen: Locator;
  readonly mainScreen: Locator;
  readonly mainSettingsButton: Locator;
  readonly menuDropDown: Locator;
  readonly aboutPopup: Locator;
  readonly aboutVersion: Locator;
  readonly signConfirmPopup: Locator;
  readonly signConfirmOkBtn: Locator;
  readonly enterPasswordPopup: Locator;
  readonly enterPasswordInput: Locator;
  readonly enterPasswordOkBtn: Locator;
  readonly mainReceiveBtn: Locator;
  readonly receiveCloseBtn: Locator;
  readonly balance: Locator;
  readonly startImportBtn: Locator;
  readonly importContinueBtn: Locator;
  readonly importScreen: Locator;
  readonly sendConfirmPopup: Locator;
  readonly sendConfirmOkBtn: Locator;
  readonly processingPopup: Locator;
  readonly donePopup: Locator;
  readonly doneCloseBtn: Locator;
  public secretWords: string[];
  public createdAddress: string;
  readonly refreshBtn: Locator;

  constructor(page: Page, extensionId: string) {
    super(page);
    this.extensionId = extensionId;
    this.startCreateBtn = page.locator('#start_createBtn', { hasText: 'Create My Wallet' });
    this.createdScreen = page.locator('#created');
    this.createdContinueBtn = page.locator('#createdContinueButton', { hasText: 'Continue' });
    this.backupScreen = page.locator('#backup');
    this.createWordItem = page.locator('.create-word-item');
    this.backupContinueBtn = page.locator('#backup_continueBtn', { hasText: 'Continue' });
    this.wordsConfirmScreen = page.locator('#wordsConfirm');
    this.alertPopup = page.locator('#alert');
    this.wordItem = page.locator('.word-item');
    this.confirmWordsNums = page.locator('#confirmWordsNums');
    this.createPasswordScreen = page.locator('#createPassword');
    this.createPasswordInput = page.locator('#createPassword_input');
    this.repeatPasswordInput = page.locator('#createPassword_repeatInput');
    this.continueBtnOnCreatePassword = page.locator('#createPassword_continueBtn', { hasText: 'Continue' });
    this.readyToGoScreen = page.locator('#readyToGo');
    this.mainScreen = page.locator('#main');
    this.mainSettingsButton = page.locator('#main_settingsButton');
    this.menuDropDown = page.locator('#menuDropdown');
    this.aboutPopup = page.locator('#about');
    this.aboutVersion = page.locator('#about_version');
    this.signConfirmPopup = page.locator('#signConfirm');
    this.signConfirmOkBtn = page.locator('#signConfirm_okBtn');
    this.enterPasswordPopup = page.locator('#enterPassword');
    this.enterPasswordInput = this.enterPasswordPopup.locator('#enterPassword_input');
    this.enterPasswordOkBtn = this.enterPasswordPopup.locator('#enterPassword_okBtn');
    this.mainReceiveBtn = page.locator('#main_receiveBtn');
    this.receiveCloseBtn = page.locator('#receive_closeBtn');
    this.balance = page.locator('#balance');
    this.startImportBtn = page.locator('#start_importBtn');
    this.importContinueBtn = page.locator('#import_continueBtn');
    this.importScreen = page.locator('#import');
    this.imSureBtn = this.alertPopup.locator('.btn-lite', { hasText: 'I\'M SURE' });
    this.startScreen = page.locator('#start');
    this.sendConfirmPopup = page.locator('#sendConfirm');
    this.sendConfirmOkBtn = this.sendConfirmPopup.locator('#sendConfirm_okBtn');
    this.processingPopup = page.locator('#processing');
    this.donePopup = page.locator('#done');
    this.doneCloseBtn = this.donePopup.locator('#done_closeBtn');
    this.refreshBtn = page.locator('#main_refreshBtn');
  }

  async goto() {
    await this.page.goto(`chrome-extension://${this.extensionId}/index.html`);
    await this.page.waitForFunction(() => document.title === 'TON Wallet')
    await test.expect(this.page).toHaveTitle('TON Wallet');
  }

  async refreshPage() {
    await this.page.reload();
    await this.refreshBtn.click();
  }

  async createWallet() {
    await this.startCreateBtn.click();
    await test.expect(this.createdScreen).toBeVisible();
    await test.expect(this.createdContinueBtn).toBeVisible();
  }

  async continueOnCreated() {
    await this.createdContinueBtn.click();
    await test.expect(this.backupScreen).toBeVisible();
  }

  async continueOnBackup() {
    await this.backupContinueBtn.click();
    // await test.expect(this.alertPopup).toBeVisible();
  }

  async imSure() {
    await this.imSureBtn.click();
    // await test.expect(this.wordsConfirmScreen).toBeVisible();
  }

  async confirmWords() {
    
  }

  /**
   * @todo move to utils?
   * @todo rename to setSecretWords
   */
  async getSecretWords(): Promise<string[]> {
    const map = new Map();
    for (let index = 0; index < 24; index++) {
      let first = (await this.createWordItem.nth(index).locator('span').first().innerText()).valueOf();
      let last = (await this.createWordItem.nth(index).locator('span').last().innerText()).valueOf();
      map.set(first, last);
    }

    const secretWords = [];
    [...map].forEach((item) => {
      let i: number = Number(item[0].replace('.', ''));
      // @ts-ignore
      secretWords[i] = item[1];
    });

    secretWords.shift();
    this.secretWords = secretWords;

    return secretWords;
  }

  async fillAllSecretWords(words: string[]) {
    for (let index = 0; index < words.length; index++) {
      const el = this.page.locator(`#importsInput${index}[tabindex="${index + 1}"]`);

      await el.fill(words[index]);
    }

    await this.importContinueBtn.click();
  }

  async fillSecretWords() {
    const nums = await this.getConfirmWordsNums();
    for (let index = 0; index < nums.length; index++) {
      const el = this.page.locator(`#confirmInput${index}[data-index="${nums[index] - 1}"]`);
      const word = await el.getAttribute('data-word');

      if (word) await el.fill(word);
    }

    await this.wordsConfirmScreen.locator('button', { hasText: 'Continue' }).click();
  }

  async fillSecretWord() {
    const inputElement = this.wordItem.locator('#confirmInput0');
    const dataWord = await inputElement.getAttribute('data-word');
    debugger
    console.log('data-word', dataWord);
  }

  protected async getConfirmWordsNums() {
    let numbers: number[] = [];
    const nums = this.confirmWordsNums.locator('span');
    for (const num of await nums.all()) {
      let temp: string = (await num.innerText()).valueOf();
      numbers.push(Number(temp));
    }

    return numbers;
  }

  async createPassword(password: string) {
    await this.createPasswordInput.fill(password);
    await this.repeatPasswordInput.fill(password);
    await this.continueBtnOnCreatePassword.click();
  }

  async viewMyWallet() {
    await this.page.locator('#readyToGo_continueBtn', { hasText: 'View My Wallet' }).click();
  }

  async openMenuDropDown() {
    await test.expect(this.mainSettingsButton).toBeVisible();
    await this.mainSettingsButton.click();
    await test.expect(this.menuDropDown).toBeVisible();
  }

  async viewAbout() {
    await this.openMenuDropDown();
    await this.page.locator('#menu_about').click();
    await test.expect(this.aboutPopup).toBeVisible();
  }

  async toggleNetwork() {
    await this.page.keyboard.down("Shift");
    await this.aboutVersion.click();
    await this.page.keyboard.up('Shift');
    await this.imSureBtn.click();
  }

  async signConfirm() {
    await this.page.bringToFront();
    await this.signConfirmOkBtn.click({ force: true });
    await this.enterPasswordInput.fill('password');
    await this.enterPasswordOkBtn.click();
  }

  async sendConfirm() {
    await this.page.bringToFront();
    await this.sendConfirmPopup.waitFor({ state: 'visible' });
    // await test.expect(this.signConfirmPopup).toBeVisible();
    await this.sendConfirmOkBtn.click({ force: true });
    // await test.expect(this.enterPasswordPopup).toBeVisible();
    await this.enterPasswordInput.fill('password');
    await this.enterPasswordOkBtn.click();
  }

  async closeDoneModal() {
    await this.doneCloseBtn.click();
  }

  async openReceivePopup() {
    await this.mainReceiveBtn.click();
  }

  async closeReceivePopup() {
    await this.receiveCloseBtn.click();
  }

  async getAddress() {
    let address = (await this.page.locator('.my-addr').first().innerText()).valueOf();
    this.createdAddress = address;

    return address;
  }

  async getBalance() {
    let balance = (await this.balance.first().innerText()).valueOf();

    return balance;
  }
}
