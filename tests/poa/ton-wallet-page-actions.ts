import { getBalanceByMnemonic, saveSecretWords, sendTransaction } from '../utils';

import { TonWallet } from '../utils/ton-wallet';
import { TonWalletPage } from '../pom/ton-wallet-page';

interface Wallets {
  main: TonWallet;
  created: TonWallet;
}

export class TonWalletPageActions {
    private generatedMnemonic: string;
    private createdAddress: string;
    private mainMnemonic: string;
    private password: string;
    private mainAddress: string;
    private readonly approximateFee = 0.003 + 0.000009999;
    public wallets?: Wallets;

    constructor(public tonWalletPage: TonWalletPage) {
      this.tonWalletPage = tonWalletPage;
      this.mainMnemonic = process.env.MAIN_MNEMONIC || '';
      this.password = process.env.EXTENSION_PASSWORD || '';
      this.mainAddress = process.env.MAIN_ADDRESS || '';
    }

    initialized() {
      console.log('initialized');
    }

    /**
     * Run all operations needed for create new wallet
     * and send to created address custom amount
     * @todo possibly rename this method
     */
    async runCreateWalletOperations() {
      await this.tonWalletPage.goto()
      await this.tonWalletPage.createWallet();
      await this.tonWalletPage.continueOnCreated();
      await this.tonWalletPage.getSecretWords();

      this.generatedMnemonic = this.tonWalletPage.secretWords.join(' ');

      await this.tonWalletPage.continueOnBackup();
      await this.tonWalletPage.imSure();
      await this.tonWalletPage.fillSecretWords();
      await this.tonWalletPage.createPassword(this.password);
      await this.tonWalletPage.viewMyWallet();
      await this.tonWalletPage.viewAbout();
      await this.tonWalletPage.toggleNetwork();
      await this.tonWalletPage.openReceivePopup();
      this.createdAddress = await this.tonWalletPage.getAddress();
      await saveSecretWords(this.tonWalletPage.secretWords.join(" "), this.createdAddress);     
    }

    buildMainWallet() {
      return new TonWallet(this.mainMnemonic);
    }

    buildCreatedWallet() {
      return new TonWallet(this.generatedMnemonic);
    }

    async afterAll() {
      const fee = Number(process.env.TRANSACTION_COST) * 2;
      const backAmount = 1 - fee + this.approximateFee;
      await this.tonWalletPage.bringToFront();

      await sendTransaction(this.generatedMnemonic, this.mainAddress, String(backAmount));

      const balance = await getBalanceByMnemonic(this.generatedMnemonic);

      console.log('new balance: ', balance);           
    }
}
