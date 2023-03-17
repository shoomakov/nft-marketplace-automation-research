import { KeyPair, mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV3R2, fromNano, internal, toNano } from "ton";

import { getHttpEndpoint } from "@orbs-network/ton-access";

export class TonWallet {
  private mnemonic: string;
  private key: KeyPair;
  private wallet: WalletContractV3R2;
  private client: TonClient;

  constructor(mnemonic: string) {
    this.mnemonic = mnemonic;
  }

  async initialize() {
    this.key = await mnemonicToWalletKey(this.mnemonic.split(" "));
    this.wallet = WalletContractV3R2.create({ publicKey: this.key.publicKey, workchain: 0 });
    this.client = new TonClient({ endpoint: await getHttpEndpoint({ network: "testnet" }) });
  }

  async getBalance() {
    if (!this.client) {
      await this.initialize();
    }

    const balance = await this.client.getBalance(this.wallet.address);
    return fromNano(balance);
  }

  async logBalance() {
    console.log('--------------------------------------------------');
    console.log('Address: ', this.wallet.address);
    console.log('Balance: ', await this.getBalance());
    console.log('--------------------------------------------------');
  }

  async sendTransaction(receiveAddress: string, value = "0.001") {
    if (!this.client) {
      await this.initialize();
    }

    // const balance = await this.getBalance();
    // const fromNanoBalance = parseFloat(balance);

    // if (fromNanoBalance < parseFloat(value)) {
    //   throw new Error("Insufficient funds");
    // }

    const walletContract = this.client.open(this.wallet);
    const seqno = await walletContract.getSeqno();

    await walletContract.sendTransfer({
      secretKey: this.key.secretKey,
      seqno: seqno,
      messages: [
        internal({
          to: receiveAddress,
          value: toNano(value),
          body: "Hello",
          bounce: false,
        })
      ]
    });

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
      console.log("waiting for transaction to confirm...");
      await this.sleep(2000);
      currentSeqno = await walletContract.getSeqno();
    }

    console.log("Transaction confirmed!");
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
